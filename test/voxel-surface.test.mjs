import assert from 'node:assert/strict';
import * as THREE from '../lib/vendor/three.module.min.js';
import { VoxelBuilder, buildVoxelMesh } from '../lib/voxel-engine.js';
import { buildVoxelSurface } from '../lib/voxel-surface.js';

const solid = new VoxelBuilder();
solid.box(-1, -1, -1, 1, 1, 1, 0xffffff);
const before = [...solid.voxels];
const shell = buildVoxelSurface(THREE, solid, { chunkSize: 2 });
assert.equal(shell.userData.stats.faces, 54, '3×3×3 solid must contain only six 3×3 surfaces');
assert.deepEqual([...solid.voxels], before, 'compilation must preserve source voxels');
for (const mesh of shell.children) {
    const p = mesh.geometry.attributes.position, n = mesh.geometry.attributes.normal;
    const idx = mesh.geometry.index.array;
    for (let i = 0; i < idx.length; i += 3) {
        const a = new THREE.Vector3().fromBufferAttribute(p, idx[i]);
        const b = new THREE.Vector3().fromBufferAttribute(p, idx[i + 1]);
        const c = new THREE.Vector3().fromBufferAttribute(p, idx[i + 2]);
        const normal = new THREE.Vector3().fromBufferAttribute(n, idx[i]);
        assert.ok(b.sub(a).cross(c.sub(a)).dot(normal) > 0, 'all triangles face outward');
        const center = a.clone().addScaledVector(normal, -.5);
        assert.ok(Number.isFinite(center.length()));
    }
}
const pair = new VoxelBuilder(); pair.add(0, 0, 0, 0); pair.add(1, 0, 0, 0xffffff);
const mixed = buildVoxelSurface(THREE, pair, {
    materials: { default: {}, metal: { metalness: .8 } },
    materialFor: hex => hex === 0 ? 'metal' : 'default',
});
assert.equal(mixed.userData.stats.faces, 10, 'different opaque materials still cull shared faces');
assert.equal(mixed.children.find(m => m.name === 'metal').material.metalness, .8);
assert.ok([...mixed.children.find(m => m.name === 'metal').geometry.attributes.color.array].every(c => c === 0), 'black is occupied, not empty');

const corner = new VoxelBuilder();
corner.add(0, 0, 0, 0xffffff); corner.add(1, 1, 0, 0xffffff); corner.add(0, 1, 1, 0xffffff);
const shaded = buildVoxelSurface(THREE, corner);
const shadeValues = shaded.children.flatMap(m => [...m.geometry.attributes.color.array]);
assert.ok(Math.min(...shadeValues) < .6, 'an enclosed corner receives strong occlusion');
assert.equal(Math.max(...shadeValues), 1, 'exposed vertices retain their full color');
const noAO = buildVoxelSurface(THREE, corner, { aoStrength: 0 });
assert.ok(noAO.children.every(m => [...m.geometry.attributes.color.array].every(c => c === 1)));
const empty = buildVoxelSurface(THREE, new VoxelBuilder());
assert.equal(empty.children.length, 0);
assert.equal(buildVoxelMesh(THREE, solid).count, 27, 'legacy instancing remains available');
for (const g of [shell, mixed, shaded, noAO, empty]) g.userData.dispose();
console.log('Surface geometry: occlusion, culling, winding, chunks, materials and legacy compatibility passed.');
