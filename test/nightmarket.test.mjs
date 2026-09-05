// CPU integration test: execute the actual scene and real Three.js geometry.
// Only browser/GPU interfaces are substituted. This is not a WebGL visual test.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import * as THREE from '../lib/vendor/three.module.min.js';

const callbacks = new Map();
const elements = new Map();
const makeElement = key => ({
    style: {}, value: '', textContent: '', width: 0, height: 0,
    addEventListener: (event, cb) => callbacks.set(`${key}:${event}`, cb),
    setAttribute() {}, appendChild() {},
    getContext: () => ({ createLinearGradient: () => ({ addColorStop() {} }),
        createRadialGradient: () => ({ addColorStop() {} }), fillRect() {}, clearRect() {}, fillText() {} }),
});
const element = key => { if (!elements.has(key)) elements.set(key, makeElement(key)); return elements.get(key); };
let scene, camera, raf;
class TestRenderer {
    constructor() { this.domElement = element('canvas'); this.shadowMap = {}; }
    setSize() {} setPixelRatio(value) { this.dpr = value; }
    render(s, c) { scene = s; camera = c; }
}
class TestControls {
    constructor() { this.target = new THREE.Vector3(); }
    update() {}
}
const context = vm.createContext({
    console, performance,
    document: { createElement: tag => makeElement(tag), body: element('body'),
        getElementById: element, querySelector: element,
        addEventListener: (e, cb) => callbacks.set(`document:${e}`, cb),
        fonts: { load: () => Promise.resolve() }, hidden: false },
    window: { innerWidth: 1366, innerHeight: 900, devicePixelRatio: 2,
        matchMedia: () => ({ matches: false }), addEventListener: (e, cb) => callbacks.set(`window:${e}`, cb) },
    requestAnimationFrame: cb => { raf = cb; return 1; }, cancelAnimationFrame() {},
    setTimeout: cb => { cb(); return 1; },
});
const gpuStub = { ...THREE, WebGLRenderer: TestRenderer,
    PMREMGenerator: class { fromEquirectangular() { return new THREE.WebGLRenderTarget(16, 16); } dispose() {} } };
const threeModule = new vm.SyntheticModule(Object.keys(gpuStub), function () {
    for (const [name, value] of Object.entries(gpuStub)) this.setExport(name, value);
}, { context });
const controlsModule = new vm.SyntheticModule(['OrbitControls'], function () {
    this.setExport('OrbitControls', TestControls);
}, { context });
const cache = new Map();
async function link(specifier, parent) {
    if (specifier === 'three') return threeModule;
    if (specifier.includes('OrbitControls')) return controlsModule;
    const file = path.resolve(path.dirname(parent.identifier), specifier);
    if (!cache.has(file)) cache.set(file, new vm.SourceTextModule(fs.readFileSync(file, 'utf8'), { context, identifier: file }));
    return cache.get(file);
}
const file = path.resolve('lib/nightmarket.html');
const html = fs.readFileSync(file, 'utf8');
const source = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
const module = new vm.SourceTextModule(source, { context, identifier: file });
await module.link(link);
await module.evaluate();
assert.ok(scene?.isScene && camera?.isPerspectiveCamera, 'scene reaches its render loop');
const surface = scene.getObjectByName('Voxel surface');
const stats = surface.userData.stats;
assert.ok(stats.voxels > 20000, 'full world is constructed');
assert.ok(stats.triangles < stats.unculledTriangles * .6, 'hidden face removal saves at least 40% of triangles');
for (const mesh of surface.children) {
    assert.ok(mesh.geometry.boundingSphere.radius > 0);
    for (const attr of Object.values(mesh.geometry.attributes))
        assert.ok(attr.array.every(Number.isFinite), 'all attributes are finite');
}
const puddles = scene.getObjectByName('Puddle reflections');
assert.ok(puddles.geometry.index.count > 0, 'reflective geometry covers actual puddles');
assert.equal(puddles.getRenderTarget().width, 512);
scene.updateMatrixWorld(true); camera.lookAt(0, 13, -6); camera.updateMatrixWorld(true);
let reflectionTarget = null, reflectionDrawn = false;
const captureRenderer = {
    xr: { enabled: true }, shadowMap: { autoUpdate: true }, autoClear: true,
    state: { buffers: { depth: { setMask() {} } }, viewport() {} },
    getRenderTarget: () => reflectionTarget,
    setRenderTarget: target => { reflectionTarget = target; },
    render(s, reflectedCamera) {
        reflectionDrawn = true;
        assert.equal(puddles.visible, false, 'mirror cannot recursively render itself');
        assert.ok(reflectedCamera.position.y < .515, 'reflection camera lies below the water');
        assert.ok(reflectedCamera.projectionMatrix.elements.every(Number.isFinite));
    },
};
puddles.onBeforeRender(captureRenderer, scene, camera);
assert.ok(reflectionDrawn, 'actual reflector capture path runs');
assert.equal(reflectionTarget, null, 'main render target is restored');
assert.equal(puddles.visible, true);
assert.equal(captureRenderer.xr.enabled, true);
assert.equal(captureRenderer.shadowMap.autoUpdate, true);
element('quality').value = 'standard'; callbacks.get('quality:change')();
assert.equal(puddles.getRenderTarget().width, 256, 'standard quality shrinks shared reflection target');
element('quality').value = 'high'; callbacks.get('quality:change')();
assert.equal(puddles.getRenderTarget().width, 512, 'high quality can be restored');
callbacks.get('rotate:click')(); callbacks.get('reset-view:click')();
context.window.innerWidth = 390; context.window.innerHeight = 844;
callbacks.get('window:resize')(); callbacks.get('reset-view:click')();
assert.ok(Math.abs(camera.aspect - 390 / 844) < 1e-8);
raf();
assert.ok(Number.isFinite(camera.position.length()));
console.log('Night market CPU integration passed:', JSON.stringify(stats));
