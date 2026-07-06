// ============================================================================
// voxel-engine.js — Shared voxel geometry engine for the Voxel Gallery.
// ----------------------------------------------------------------------------
// Every scene used to carry its own copy of this class. It now lives here once.
//
// Design notes:
//   * VoxelBuilder is PURE (no three.js dependency) so it can be unit-tested in
//     Node — see test/voxel-engine.test.mjs.
//   * The `line()` sampling density differs between the original scenes
//     (pelican 2.5, zelda 2.6, spacex 2.2). It is exposed as a constructor
//     option so each scene reproduces its exact original voxel output.
//   * buildVoxelMesh() receives THREE as an argument instead of importing it,
//     keeping the module decoupled and testable.
// ============================================================================

export class VoxelBuilder {
    constructor({ lineDensity = 2.5 } = {}) {
        this.voxels = new Map();
        this.lineDensity = lineDensity;
    }

    add(x, y, z, color) {
        x = Math.round(x); y = Math.round(y); z = Math.round(z);
        this.voxels.set(`${x},${y},${z}`, color);
    }

    box(x1, y1, z1, x2, y2, z2, color) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
        for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++)
            this.add(x, y, z, color);
    }

    sphere(cx, cy, cz, r, color) {
        const rSq = r * r;
        const b = Math.ceil(r);
        for (let x = -b; x <= b; x++)
        for (let y = -b; y <= b; y++)
        for (let z = -b; z <= b; z++)
            if (x * x + y * y + z * z <= rSq) this.add(cx + x, cy + y, cz + z, color);
    }

    ellipsoid(cx, cy, cz, rx, ry, rz, color) {
        for (let x = -rx; x <= rx; x++)
        for (let y = -ry; y <= ry; y++)
        for (let z = -rz; z <= rz; z++)
            if ((x * x) / (rx * rx) + (y * y) / (ry * ry) + (z * z) / (rz * rz) <= 1)
                this.add(cx + x, cy + y, cz + z, color);
    }

    // surfaceOnly hollows out the cylinder (used by the SpaceX scene).
    cylinderY(cx, y1, y2, cz, r, color, surfaceOnly = false) {
        const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
        const b = Math.ceil(r);
        const rr = r * r;
        const inner = Math.max(0, r - 1.2);
        const ii = inner * inner;
        for (let y = minY; y <= maxY; y++)
        for (let x = -b; x <= b; x++)
        for (let z = -b; z <= b; z++) {
            const d = x * x + z * z;
            if (d <= rr && (!surfaceOnly || d >= ii || y === minY || y === maxY))
                this.add(cx + x, y, cz + z, color);
        }
    }

    cylinderZ(cx, cy, z1, z2, r, color) {
        const minZ = Math.min(z1, z2), maxZ = Math.max(z1, z2);
        const b = Math.ceil(r);
        const rr = r * r;
        for (let z = minZ; z <= maxZ; z++)
        for (let x = -b; x <= b; x++)
        for (let y = -b; y <= b; y++)
            if (x * x + y * y <= rr) this.add(cx + x, cy + y, z, color);
    }

    line(x1, y1, z1, x2, y2, z2, r, color) {
        const dist = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
        const steps = Math.max(1, Math.ceil(dist * this.lineDensity));
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const cx = x1 + (x2 - x1) * t;
            const cy = y1 + (y2 - y1) * t;
            const cz = z1 + (z2 - z1) * t;
            if (r <= 0.5) this.add(cx, cy, cz, color);
            else this.sphere(Math.round(cx), Math.round(cy), Math.round(cz), r, color);
        }
    }

    torusZ(cx, cy, cz, R, r, color) {
        const bound = Math.ceil(R + r);
        for (let u = -bound; u <= bound; u++)
        for (let v = -bound; v <= bound; v++)
        for (let w = -Math.ceil(r); w <= Math.ceil(r); w++) {
            const dC = Math.hypot(u, v);
            const dT = Math.hypot(dC - R, w);
            if (dT <= r) this.add(cx + u, cy + v, cz + w, color);
        }
    }

    torusY(cx, cy, cz, R, r, color) {
        const bound = Math.ceil(R + r);
        for (let u = -bound; u <= bound; u++)
        for (let v = -bound; v <= bound; v++)
        for (let w = -Math.ceil(r); w <= Math.ceil(r); w++) {
            const dC = Math.hypot(u, v);
            const dT = Math.hypot(dC - R, w);
            if (dT <= r) this.add(cx + u, cy + w, cz + v, color);
        }
    }

    ringY(cx, cy, cz, radius, thickness, color) {
        const b = Math.ceil(radius + thickness);
        const outer = (radius + thickness) * (radius + thickness);
        const inner = Math.max(0, radius - thickness) * Math.max(0, radius - thickness);
        for (let x = -b; x <= b; x++)
        for (let z = -b; z <= b; z++) {
            const d = x * x + z * z;
            if (d <= outer && d >= inner) this.add(cx + x, cy, cz + z, color);
        }
    }
}

// Compile a VoxelBuilder's voxel map into a single InstancedMesh.
// THREE is injected so this module never imports three.js directly.
export function buildVoxelMesh(THREE, builder, opts = {}) {
    const size = opts.size ?? 0.95;
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = new THREE.MeshStandardMaterial({
        roughness: opts.roughness ?? 0.82,
        metalness: opts.metalness ?? 0.08,
    });

    const mesh = new THREE.InstancedMesh(geometry, material, builder.voxels.size);
    mesh.castShadow = opts.cast ?? true;
    mesh.receiveShadow = opts.receive ?? true;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let i = 0;
    for (const [key, hex] of builder.voxels.entries()) {
        const [x, y, z] = key.split(',').map(Number);
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        color.setHex(hex);
        mesh.setColorAt(i, color);
        i++;
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    return mesh;
}
