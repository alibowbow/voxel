// Solid, unit-sized voxels: exposed faces only, with baked corner occlusion.
// Opt-in: the original InstancedMesh engine and editor keep their existing API.
const FACES = [
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
    [[0, 1, 0], [0, 0, 1], [1, 0, 0]],
    [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
    [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
    [[0, 0, -1], [0, 1, 0], [1, 0, 0]],
];
const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];

export function buildVoxelSurface(THREE, builder, {
    materials = { default: { roughness: 0.85 } },
    materialFor = () => 'default', chunkSize = 32, aoStrength = 0.16,
} = {}) {
    if (!Number.isFinite(chunkSize) || chunkSize <= 0) throw new Error('Invalid chunkSize');
    if (!materials.default) throw new Error('A default material is required');
    aoStrength = Math.max(0, Math.min(1 / 3, aoStrength));
    const palette = new Map(Object.entries(materials).map(([id, props]) => [id,
        new THREE.MeshStandardMaterial({ roughness: 0.85, ...props, vertexColors: true })]));
    const chunks = new Map();
    const color = new THREE.Color();
    const occupied = (x, y, z) => builder.voxels.has(`${x},${y},${z}`) ? 1 : 0;
    let faces = 0;
    for (const [key, hex] of builder.voxels) {
        const p = key.split(',').map(Number);
        const requested = materialFor(hex, ...p);
        const id = palette.has(requested) ? requested : 'default';
        const chunk = `${p.map(c => Math.floor(c / chunkSize)).join(',')}:${id}`;
        color.setHex(hex);
        for (const [n, u, v] of FACES) {
            const q = p.map((c, i) => c + n[i]);
            if (occupied(...q)) continue;
            let data = chunks.get(chunk);
            if (!data) {
                data = { id, position: [], normal: [], color: [], index: [] };
                chunks.set(chunk, data);
            }
            const offset = data.position.length / 3;
            const shades = [];
            for (const [a, b] of CORNERS) {
                const s1 = occupied(...q.map((c, i) => c + a * u[i]));
                const s2 = occupied(...q.map((c, i) => c + b * v[i]));
                const corner = occupied(...q.map((c, i) => c + a * u[i] + b * v[i]));
                const shade = 1 - aoStrength * (s1 && s2 ? 3 : s1 + s2 + corner);
                shades.push(shade);
                data.position.push(...p.map((c, i) => c + (n[i] + a * u[i] + b * v[i]) * 0.5));
                data.normal.push(...n);
                data.color.push(color.r * shade, color.g * shade, color.b * shade);
            }
            // Choose the diagonal that avoids a bright/dark crease through AO.
            const order = shades[0] + shades[2] > shades[1] + shades[3]
                ? [0, 1, 3, 1, 2, 3] : [0, 1, 2, 0, 2, 3];
            data.index.push(...order.map(i => offset + i));
            faces++;
        }
    }
    const group = new THREE.Group();
    group.name = 'Voxel surface';
    for (const data of chunks.values()) {
        const geometry = new THREE.BufferGeometry();
        for (const name of ['position', 'normal', 'color'])
            geometry.setAttribute(name, new THREE.Float32BufferAttribute(data[name], 3));
        geometry.setIndex(data.index);
        geometry.computeBoundingSphere();
        const mesh = new THREE.Mesh(geometry, palette.get(data.id));
        mesh.name = data.id;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
    }
    group.userData.stats = { voxels: builder.voxels.size, faces,
        triangles: faces * 2, unculledTriangles: builder.voxels.size * 12,
        meshes: group.children.length };
    group.userData.dispose = () => {
        for (const mesh of group.children) mesh.geometry.dispose();
        for (const mat of palette.values()) mat.dispose();
    };
    return group;
}
