# Voxel Gallery

Interactive, procedurally-generated **voxel art** scenes built with
[Three.js](https://threejs.org/). The homepage is a gallery with **live
rotating 3D previews** of every scene and tag-based filtering; each scene is a
self-contained page.

## Live scenes

| # | Scene | File | Tags |
|---|-------|------|------|
| 001 | The Pelican Cruiser | [`lib/pelican.html`](lib/pelican.html) | animal, beach |
| 002 | 야생의 용사 링크 (Zelda BotW) | [`lib/zeldabotw.html`](lib/zeldabotw.html) | game, nature |
| 003 | SpaceX Launch Pad | [`lib/spacex.html`](lib/spacex.html) | space, animated |
| 004 | 네온 시티 (Neon City) | [`lib/neoncity.html`](lib/neoncity.html) | city, cyberpunk, animated, night |

## Project structure

```
index.html            Gallery homepage — cards, tag filters, live 3D previews
scenes.js             Scene manifest (single source of truth for the gallery)
lib/
  voxel-engine.js     Shared voxel engine: VoxelBuilder + buildVoxelMesh()
  vendor/             Vendored three.js + OrbitControls (no CDN dependency)
  pelican.html        Individual scenes — each imports voxel-engine.js
  zeldabotw.html
  spacex.html
  neoncity.html
test/
  voxel-engine.test.mjs   Equivalence test guarding the shared engine
  scenes.test.mjs         Manifest / preview3d / importmap validation
package.json
```

Design highlights:

- **Shared engine** — `VoxelBuilder` lives once in `lib/voxel-engine.js` and is
  imported by every scene. `test/voxel-engine.test.mjs` proves it is
  byte-for-byte equivalent to the original per-scene implementations.
- **Data-driven gallery** — `index.html` renders every card from `scenes.js`.
- **Live 3D previews** — each card runs a small deterministic voxel diorama
  (`preview3d` in the manifest) on its own lazy-initialised WebGL canvas:
  created only when the card scrolls into view, paused when the tab is hidden,
  static when the user prefers reduced motion, and falling back to inline SVG
  art if WebGL/modules are unavailable.
- **Self-contained** — three.js is vendored under `lib/vendor/`, so the site
  has no runtime CDN dependency and works offline once cloned.

## Adding a new scene

1. Create `lib/your-scene.html`. Import the shared engine inside the module script:

   ```js
   import * as THREE from 'three';
   import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
   import { VoxelBuilder, buildVoxelMesh } from './voxel-engine.js';

   const v = new VoxelBuilder();          // lineDensity defaults to 2.5
   // ...build voxels with v.box / v.sphere / v.line / ...
   scene.add(buildVoxelMesh(THREE, v, { roughness: 0.85, metalness: 0.1 }));
   ```

   Use the local importmap (copy it from any existing scene):

   ```json
   { "imports": { "three": "./vendor/three.module.min.js",
                  "three/addons/": "./vendor/addons/" } }
   ```

2. Append one object to the array in `scenes.js`:

   ```js
   {
       file: 'lib/your-scene.html',
       index: '005',
       title: 'Your Scene',
       desc: 'One-line description.',
       badge: 'Interactive 3D',
       gradient: 'linear-gradient(135deg, #123 0%, #456 100%)',
       accent: '#ff1155',
       tags: ['whatever'],
       icon: '🚀',              // fallback art if preview3d is omitted
       preview3d(v) {           // optional: live 3D card preview
           v.cylinderY(0, 0, 1, 0, 11, 0x888888);   // turntable base
           // ...a few hundred voxels; must be deterministic (no Math.random)
       },
   }
   ```

That's it — the homepage card, tag filter, and live preview are generated
automatically. No HTML/CSS edits.

## Running locally

The pages load ES modules, so they must be served over HTTP (opening files via
`file://` is blocked by browser CORS):

```bash
npm start          # → python3 -m http.server 8000, then open http://localhost:8000
# or:  npx serve
```

On **GitHub Pages** everything is served over HTTP already, so it just works.

## Tests

```bash
npm test
```

- `voxel-engine.test.mjs` — the shared engine matches the original scene
  implementations across 4,000 randomized operations per variant.
- `scenes.test.mjs` — manifest integrity, deterministic `preview3d` output,
  local-only importmaps, and index.html script syntax.
