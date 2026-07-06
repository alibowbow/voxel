# Voxel Gallery

Interactive, procedurally-generated **voxel art** scenes built with
[Three.js](https://threejs.org/). Each scene is a self-contained page; the
homepage is a gallery that links to them.

## Live scenes

| # | Scene | File |
|---|-------|------|
| 001 | The Pelican Cruiser | [`lib/pelican.html`](lib/pelican.html) |
| 002 | 야생의 용사 링크 (Zelda BotW) | [`lib/zeldabotw.html`](lib/zeldabotw.html) |
| 003 | SpaceX Launch Pad | [`lib/spacex.html`](lib/spacex.html) |

## Project structure

```
index.html            Gallery homepage — renders cards from the manifest
scenes.js             Scene manifest (the single source of truth for the gallery)
lib/
  voxel-engine.js     Shared voxel engine: VoxelBuilder + buildVoxelMesh()
  pelican.html        Individual scenes — each imports voxel-engine.js
  zeldabotw.html
  spacex.html
test/
  voxel-engine.test.mjs   Equivalence test guarding the shared engine
package.json
```

The `VoxelBuilder` used to be copy-pasted into every scene. It now lives once in
`lib/voxel-engine.js` and is imported by each scene. `test/voxel-engine.test.mjs`
proves the shared engine produces byte-for-byte identical voxel output to the
original per-scene implementations.

## Adding a new scene

1. Create `lib/your-scene.html`. Import the shared engine inside the module script:

   ```js
   import { VoxelBuilder, buildVoxelMesh } from './voxel-engine.js';

   const v = new VoxelBuilder();          // lineDensity defaults to 2.5
   // ...build voxels with v.box / v.sphere / v.line / ...
   scene.add(buildVoxelMesh(THREE, v, { roughness: 0.85, metalness: 0.1 }));
   ```

2. Append one object to the array in `scenes.js`:

   ```js
   {
       file: 'lib/your-scene.html',
       index: '004',
       title: 'Your Scene',
       desc: 'One-line description.',
       badge: 'Interactive 3D',
       gradient: 'linear-gradient(135deg, #123 0%, #456 100%)',
       accent: '#ff1155',
       tags: ['whatever'],
       icon: '🚀',          // shown when no custom `preview` SVG is given
   }
   ```

That's it — the homepage card is generated automatically. No HTML/CSS edits.

## Running locally

The scenes load `voxel-engine.js` as an ES module, so they must be served over
HTTP (opening the file directly via `file://` is blocked by browser CORS).

```bash
npm start          # → python3 -m http.server 8000, then open http://localhost:8000
# or:  npx serve
```

On **GitHub Pages** everything is served over HTTP already, so it just works.

## Tests

```bash
npm test           # verifies the shared engine matches the original scenes
```
