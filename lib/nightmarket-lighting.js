import * as THREE from 'three';
import { Reflector } from './vendor/addons/objects/Reflector.js';

// A small, procedural environment provides readable reflections on metal/glass.
// Built once; no external assets or per-frame environment captures.
export function createMarketEnvironment(renderer) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const sky = ctx.createLinearGradient(0, 0, 0, 128);
    sky.addColorStop(0, '#8899bb'); sky.addColorStop(0.45, '#465675');
    sky.addColorStop(0.53, '#b18b70'); sky.addColorStop(0.62, '#343345');
    sky.addColorStop(1, '#12131e');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#ffe2ac'; ctx.fillRect(40, 42, 30, 14);
    ctx.fillStyle = '#b9d9f6'; ctx.fillRect(175, 22, 42, 8);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const generator = new THREE.PMREMGenerator(renderer);
    const target = generator.fromEquirectangular(texture);
    generator.dispose(); texture.dispose();
    return target;
}

// All puddles share one coplanar reflector and one render target.
// Geometry follows their voxel silhouettes instead of covering the whole road.
export function createPuddles(builder, colors, highQuality) {
    const positions = [], indices = [];
    for (const [key, color] of builder.voxels) {
        const [x, y, z] = key.split(',').map(Number);
        if (y !== 0 || !colors.has(color)) continue;
        const start = positions.length / 3;
        positions.push(x - .5, -z - .5, 0, x + .5, -z - .5, 0,
            x + .5, -z + .5, 0, x - .5, -z + .5, 0);
        indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals(); geometry.computeBoundingSphere();
    const shader = {
        name: 'MarketPuddle',
        uniforms: { ...Reflector.ReflectorShader.uniforms, time: { value: 0 } },
        vertexShader: `
            uniform mat4 textureMatrix;
            varying vec4 reflectedUV;
            varying vec3 worldPosition;
            void main() {
                reflectedUV = textureMatrix * vec4(position, 1.0);
                worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float time;
            varying vec4 reflectedUV;
            varying vec3 worldPosition;
            void main() {
                vec2 uv = reflectedUV.xy / reflectedUV.w;
                vec2 ripple = vec2(sin(worldPosition.z * 3.2 + time * 1.7),
                    cos(worldPosition.x * 2.6 - time * 1.2)) * .0008;
                vec3 reflected = texture2D(tDiffuse, uv + ripple).rgb * .5;
                reflected += texture2D(tDiffuse, uv + ripple + vec2(.0015, 0.)).rgb * .25;
                reflected += texture2D(tDiffuse, uv + ripple - vec2(.0015, 0.)).rgb * .25;
                float grazing = 1. - abs(normalize(cameraPosition - worldPosition).y);
                float fresnel = .28 + .5 * pow(grazing, 3.);
                gl_FragColor = vec4(mix(vec3(.025, .037, .055), reflected, fresnel), 1.);
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
            }`,
    };
    const reflector = new Reflector(geometry, {
        textureWidth: highQuality ? 512 : 256, textureHeight: highQuality ? 512 : 256,
        multisample: 0, clipBias: .003, shader,
    });
    // Byte targets also work on devices without float render targets.
    reflector.getRenderTarget().texture.type = THREE.UnsignedByteType;
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.y = .515;
    reflector.name = 'Puddle reflections';
    const renderReflection = reflector.onBeforeRender;
    let lastCapture = -Infinity;
    let captureInterval = highQuality ? 1 / 30 : 1 / 15;
    reflector.onBeforeRender = function (renderer, scene, camera) {
        const now = performance.now() / 1000;
        if (now - lastCapture < captureInterval) return;
        lastCapture = now;
        renderReflection.call(this, renderer, scene, camera);
    };
    reflector.userData.setQuality = high => {
        captureInterval = high ? 1 / 30 : 1 / 15;
        reflector.getRenderTarget().setSize(high ? 512 : 256, high ? 512 : 256);
        lastCapture = -Infinity;
    };
    return reflector;
}
