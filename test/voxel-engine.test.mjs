// ============================================================================
// Equivalence test for the extracted voxel-engine.
//
// Proves the shared VoxelBuilder produces byte-for-byte identical voxel maps to
// the three original (duplicated) implementations that lived inside each scene.
// This guards the SSJ1 refactor: if a future change alters voxel output, this
// test fails.
//
// Run: npm test   (or:  node test/voxel-engine.test.mjs)
// ============================================================================

import { VoxelBuilder } from '../lib/voxel-engine.js';

// --- Reference: verbatim copies of the ORIGINAL per-scene methods -----------
// lineStyle 'old'  -> pelican/zelda:  steps = ceil(dist * k),  t guarded for 0
// lineStyle 'clamp'-> spacex:         steps = max(1, ceil(dist * k))
class Reference {
    constructor(lineStyle, k) {
        this.voxels = new Map();
        this.lineStyle = lineStyle;
        this.k = k;
    }
    add(x, y, z, c) { x = Math.round(x); y = Math.round(y); z = Math.round(z); this.voxels.set(`${x},${y},${z}`, c); }
    box(x1, y1, z1, x2, y2, z2, c) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
        for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) this.add(x, y, z, c);
    }
    sphere(cx, cy, cz, r, c) {
        const rSq = r * r, b = Math.ceil(r);
        for (let x = -b; x <= b; x++) for (let y = -b; y <= b; y++) for (let z = -b; z <= b; z++)
            if (x * x + y * y + z * z <= rSq) this.add(cx + x, cy + y, cz + z, c);
    }
    ellipsoid(cx, cy, cz, rx, ry, rz, c) {
        for (let x = -rx; x <= rx; x++) for (let y = -ry; y <= ry; y++) for (let z = -rz; z <= rz; z++)
            if ((x * x) / (rx * rx) + (y * y) / (ry * ry) + (z * z) / (rz * rz) <= 1) this.add(cx + x, cy + y, cz + z, c);
    }
    cylinderY(cx, y1, y2, cz, r, c, surfaceOnly = false) {
        const minY = Math.min(y1, y2), maxY = Math.max(y1, y2), b = Math.ceil(r), rr = r * r;
        const inner = Math.max(0, r - 1.2), ii = inner * inner;
        for (let y = minY; y <= maxY; y++) for (let x = -b; x <= b; x++) for (let z = -b; z <= b; z++) {
            const d = x * x + z * z;
            if (d <= rr && (!surfaceOnly || d >= ii || y === minY || y === maxY)) this.add(cx + x, y, cz + z, c);
        }
    }
    cylinderZ(cx, cy, z1, z2, r, c) {
        const minZ = Math.min(z1, z2), maxZ = Math.max(z1, z2), b = Math.ceil(r), rr = r * r;
        for (let z = minZ; z <= maxZ; z++) for (let x = -b; x <= b; x++) for (let y = -b; y <= b; y++)
            if (x * x + y * y <= rr) this.add(cx + x, cy + y, z, c);
    }
    torusZ(cx, cy, cz, R, r, c) {
        const bound = Math.ceil(R + r);
        for (let u = -bound; u <= bound; u++) for (let v = -bound; v <= bound; v++) for (let w = -Math.ceil(r); w <= Math.ceil(r); w++) {
            const dC = Math.hypot(u, v), dT = Math.hypot(dC - R, w);
            if (dT <= r) this.add(cx + u, cy + v, cz + w, c);
        }
    }
    torusY(cx, cy, cz, R, r, c) {
        const bound = Math.ceil(R + r);
        for (let u = -bound; u <= bound; u++) for (let v = -bound; v <= bound; v++) for (let w = -Math.ceil(r); w <= Math.ceil(r); w++) {
            const dC = Math.hypot(u, v), dT = Math.hypot(dC - R, w);
            if (dT <= r) this.add(cx + u, cy + w, cz + v, c);
        }
    }
    ringY(cx, cy, cz, radius, thickness, c) {
        const b = Math.ceil(radius + thickness);
        const outer = (radius + thickness) * (radius + thickness);
        const inner = Math.max(0, radius - thickness) * Math.max(0, radius - thickness);
        for (let x = -b; x <= b; x++) for (let z = -b; z <= b; z++) {
            const d = x * x + z * z;
            if (d <= outer && d >= inner) this.add(cx + x, cy, cz + z, c);
        }
    }
    line(x1, y1, z1, x2, y2, z2, r, c) {
        const dist = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
        const steps = this.lineStyle === 'old' ? Math.ceil(dist * this.k) : Math.max(1, Math.ceil(dist * this.k));
        for (let i = 0; i <= steps; i++) {
            const t = this.lineStyle === 'old' ? (steps === 0 ? 0 : i / steps) : i / steps;
            const cx = x1 + (x2 - x1) * t, cy = y1 + (y2 - y1) * t, cz = z1 + (z2 - z1) * t;
            if (r <= 0.5) this.add(cx, cy, cz, c);
            else this.sphere(Math.round(cx), Math.round(cy), Math.round(cz), r, c);
        }
    }
}

// --- Seeded RNG so the battery is deterministic -----------------------------
function mulberry32(seed) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function mapsEqual(a, b) {
    if (a.size !== b.size) return `size differs: ${a.size} vs ${b.size}`;
    for (const [k, val] of a) {
        if (!b.has(k)) return `key ${k} present in A but not B`;
        if (b.get(k) !== val) return `color at ${k}: ${val} vs ${b.get(k)}`;
    }
    return null;
}

// Apply an identical random operation to two builders.
function applyOp(rng, target) {
    const R = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
    const col = () => R(0, 0xffffff);
    const op = R(0, 10);
    switch (op) {
        case 0: target.box(R(-10, 10), R(-10, 10), R(-10, 10), R(-10, 10), R(-10, 10), R(-10, 10), col()); break;
        case 1: target.sphere(R(-8, 8), R(-8, 8), R(-8, 8), rng() * 6, col()); break;
        case 2: target.ellipsoid(R(-8, 8), R(-8, 8), R(-8, 8), R(1, 6), R(1, 6), R(1, 6), col()); break;
        case 3: target.ellipsoid(R(-8, 8), R(-8, 8), R(-8, 8), 0.5, 1, rng() * 3, col()); break; // fractional radii (pelican pouch)
        case 4: target.cylinderY(R(-8, 8), R(-10, 10), R(-10, 10), R(-8, 8), rng() * 7, col(), false); break;
        case 5: target.cylinderY(R(-8, 8), R(-10, 10), R(-10, 10), R(-8, 8), rng() * 7, col(), true); break; // surfaceOnly
        case 6: target.cylinderZ(R(-8, 8), R(-8, 8), R(-10, 10), R(-10, 10), rng() * 5, col()); break;
        case 7: target.line(R(-12, 12), R(-12, 12), R(-12, 12), R(-12, 12), R(-12, 12), R(-12, 12), rng() * 3, col()); break;
        case 8: { const x = R(-12, 12), y = R(-12, 12), z = R(-12, 12); target.line(x, y, z, x, y, z, rng() > 0.5 ? 0.4 : 2, col()); break; } // zero-length line
        case 9: target.torusZ(R(-8, 8), R(-8, 8), R(-8, 8), R(3, 9), R(1, 3), col()); break;
        case 10: target.ringY(R(-8, 8), R(-8, 8), R(-8, 8), R(3, 9), R(1, 3), col()); break;
    }
    // torusY exercised separately to make sure both variants hit it
    if (op % 4 === 0) target.torusY(R(-8, 8), R(-8, 8), R(-8, 8), R(3, 8), R(1, 3), col());
}

const variants = [
    { name: 'pelican', lineStyle: 'old',   k: 2.5 },
    { name: 'zelda',   lineStyle: 'old',   k: 2.6 },
    { name: 'spacex',  lineStyle: 'clamp', k: 2.2 },
];

let failures = 0;
const OPS = 4000;

for (const variant of variants) {
    const shared = new VoxelBuilder({ lineDensity: variant.k });
    const ref = new Reference(variant.lineStyle, variant.k);
    const rngS = mulberry32(12345);
    const rngR = mulberry32(12345);
    for (let i = 0; i < OPS; i++) {
        applyOp(rngS, shared);
        applyOp(rngR, ref);
    }
    const diff = mapsEqual(shared.voxels, ref.voxels);
    if (diff) {
        console.error(`❌ ${variant.name}: MISMATCH — ${diff}`);
        failures++;
    } else {
        console.log(`✅ ${variant.name}: identical output (${shared.voxels.size} voxels over ${OPS} ops)`);
    }
}

if (failures) {
    console.error(`\n${failures} variant(s) failed — refactor changed voxel output.`);
    process.exit(1);
}
console.log('\nAll variants match the original implementations. Refactor is behavior-preserving.');
