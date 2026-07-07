// ============================================================================
// Manifest + gallery validation.
//
//  * scenes.js loads and every entry has the required fields
//  * every scene file exists
//  * every preview3d builder runs against the REAL shared engine, produces a
//    reasonably sized, deterministic voxel map within sane bounds
//  * both index.html scripts (classic + module) parse cleanly
//
// Run: npm test   (or:  node test/scenes.test.mjs)
// ============================================================================

import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { VoxelBuilder } from '../lib/voxel-engine.js';

let failures = 0;
const ok = (cond, label) => {
    if (cond) console.log(`✅ ${label}`);
    else { console.error(`❌ ${label}`); failures++; }
};

// --- Load the manifest exactly the way the browser does ---------------------
const src = fs.readFileSync('scenes.js', 'utf8');
const windowStub = {};
new Function('window', src)(windowStub);
const scenes = windowStub.VOXEL_SCENES;

ok(Array.isArray(scenes) && scenes.length >= 4, `manifest loads (${scenes?.length} scenes)`);

const indexes = new Set();
for (const s of scenes) {
    const name = `#${s.index} ${s.title}`;
    ok(s.file && s.index && s.title && s.desc, `${name}: required fields present`);
    ok(fs.existsSync(s.file), `${name}: scene file exists (${s.file})`);
    ok(!indexes.has(s.index), `${name}: index unique`);
    indexes.add(s.index);
    ok(/^#[0-9a-fA-F]{6}$/.test(s.accent || ''), `${name}: accent is a hex colour`);
    ok(Array.isArray(s.tags) && s.tags.length > 0, `${name}: has tags`);

    if (typeof s.preview3d === 'function') {
        const a = new VoxelBuilder();
        const b = new VoxelBuilder();
        s.preview3d(a);
        s.preview3d(b);

        ok(a.voxels.size > 300 && a.voxels.size < 20000,
            `${name}: preview3d voxel count sane (${a.voxels.size})`);

        // deterministic: two runs must be identical
        let same = a.voxels.size === b.voxels.size;
        if (same) for (const [k, val] of a.voxels) if (b.voxels.get(k) !== val) { same = false; break; }
        ok(same, `${name}: preview3d is deterministic`);

        let maxAbs = 0;
        for (const key of a.voxels.keys()) {
            const [x, y, z] = key.split(',').map(Number);
            maxAbs = Math.max(maxAbs, Math.abs(x), Math.abs(y), Math.abs(z));
        }
        ok(maxAbs <= 60, `${name}: preview3d bounds sane (max |coord| = ${maxAbs})`);
    } else {
        console.log(`ℹ️  ${name}: no preview3d (SVG/icon fallback will be used)`);
    }
}

// --- importmaps must be local (vendored three.js) and resolve to real files --
const htmlFiles = ['index.html', ...fs.readdirSync('lib').filter(f => f.endsWith('.html')).map(f => `lib/${f}`)];
for (const file of htmlFiles) {
    const text = fs.readFileSync(file, 'utf8');
    const im = text.match(/<script type="importmap">([\s\S]*?)<\/script>/);
    if (!im) continue; // pages without an importmap don't use three.js
    const imports = JSON.parse(im[1]).imports;
    const baseDir = path.dirname(file);
    let allLocal = true, allExist = true;
    for (const target of Object.values(imports)) {
        if (/^https?:/.test(target)) { allLocal = false; continue; }
        const resolved = path.join(baseDir, target);
        const probe = target.endsWith('/') ? resolved : resolved; // dirs and files both stat-able
        if (!fs.existsSync(probe)) allExist = false;
    }
    ok(allLocal, `${file}: importmap uses only local (vendored) modules`);
    ok(allExist, `${file}: importmap targets exist on disk`);
}
ok(fs.existsSync('lib/vendor/three.module.min.js'), 'vendored three.module.min.js present');
ok(fs.existsSync('lib/vendor/addons/controls/OrbitControls.js'), 'vendored OrbitControls.js present');

// --- index.html script syntax ------------------------------------------------
const html = fs.readFileSync('index.html', 'utf8');
const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'voxel-test-'));

function checkScript(code, ext, label) {
    const tmp = path.join(tmpdir, `snippet${ext}`);
    fs.writeFileSync(tmp, code);
    const r = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
    ok(r.status === 0, `${label} parses cleanly${r.status !== 0 ? '\n' + r.stderr : ''}`);
    fs.unlinkSync(tmp);
}

const moduleMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
ok(!!moduleMatch, 'index.html has a module script');
if (moduleMatch) checkScript(moduleMatch[1], '.mjs', 'index.html module script');

const classicMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
ok(classicMatches.length >= 1, 'index.html has a classic script');
for (const [i, m] of classicMatches.entries()) checkScript(m[1], '.js', `index.html classic script #${i + 1}`);

// every scene page's module script must parse too
for (const file of htmlFiles) {
    if (file === 'index.html') continue;
    const text = fs.readFileSync(file, 'utf8');
    const m = text.match(/<script type="module">([\s\S]*?)<\/script>/);
    if (m) checkScript(m[1], '.mjs', `${file} module script`);
}

fs.rmdirSync(tmpdir);

if (failures) {
    console.error(`\n${failures} check(s) failed.`);
    process.exit(1);
}
console.log('\nAll manifest/gallery checks passed.');
