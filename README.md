# Voxel Gallery

Interactive, procedurally-generated **voxel art** built with
[Three.js](https://threejs.org/). The homepage is a gallery with **live
rotating 3D previews** and tag filtering — and the **Voxel Studio** lets
visitors build their own voxel art in the browser, save it as a PNG, and
share it with a single link.

## 🎨 Voxel Studio ([`lib/studio.html`](lib/studio.html))

A browser voxel editor anyone can use:

- Click to place blocks, right-click (or eraser mode) to remove, 16-colour palette
- **PNG export** of your creation
- **Share by URL** — the whole model is encoded into the link (`#v=...`), no server needed
- Auto-saves to `localStorage`; undo, clear, mobile-friendly

## Live scenes

| # | Scene | File | Tags |
|---|-------|------|------|
| 001 | The Pelican Cruiser | [`lib/pelican.html`](lib/pelican.html) | animal, beach |
| 002 | 야생의 용사 링크 (Zelda BotW) | [`lib/zeldabotw.html`](lib/zeldabotw.html) | game, nature |
| 003 | SpaceX Launch Pad | [`lib/spacex.html`](lib/spacex.html) | space, animated |
| 004 | 네온 시티 (Neon City) | [`lib/neoncity.html`](lib/neoncity.html) | city, cyberpunk, animated, night |
| 005 | 가을 한옥 마을 (Autumn Hanok) | [`lib/hanok.html`](lib/hanok.html) | korea, nature, animated |
| 006 | 산호초 바닷속 (Coral Reef) | [`lib/ocean.html`](lib/ocean.html) | ocean, animal, animated |
| 007 | 겨울밤 오두막 (Winter Cabin) | [`lib/winter.html`](lib/winter.html) | winter, night, animated |
| 008 | 미니 행성 (Tiny Planet) | [`lib/tinyplanet.html`](lib/tinyplanet.html) | space, animated |
| 009 | 용의 성 (Dragon Keep) | [`lib/dragon.html`](lib/dragon.html) | fantasy, animated |
| 010 | 벚꽃 정원 (Sakura Garden) | [`lib/sakura.html`](lib/sakura.html) | nature, spring, animated |
| 011 | 사막 오아시스 (Desert Oasis) | [`lib/desert.html`](lib/desert.html) | desert, animated |
| 012 | 산악 증기기관차 (Mountain Steam Train) | [`lib/train.html`](lib/train.html) | vehicle, nature, animated |
| 013 | 남극 펭귄 마을 (Penguin Colony) | [`lib/penguin.html`](lib/penguin.html) | animal, winter, animated |
| 014 | 화산 섬 (Volcano Island) | [`lib/volcano.html`](lib/volcano.html) | nature, animated |
| 015 | 달빛 놀이공원 (Moonlit Funfair) | [`lib/funfair.html`](lib/funfair.html) | city, night, animated |
| 016 | 화성 개척 기지 (Mars Base) | [`lib/mars.html`](lib/mars.html) | space, animated |
| 017 | 할로윈 유령 마을 (Halloween Village) | [`lib/halloween.html`](lib/halloween.html) | night, fantasy, animated |
| 018 | 해적선과 크라켄 (Pirate Ship & Kraken) | [`lib/pirate.html`](lib/pirate.html) | ocean, fantasy, animated |
| 019 | 공룡 계곡 (Dinosaur Valley) | [`lib/dino.html`](lib/dino.html) | animal, nature, animated |
| 020 | 골목 야시장 (Night Market Alley) | [`lib/nightmarket.html`](lib/nightmarket.html) | city, night, animated |

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


## Night market rendering

The night market opts into `lib/voxel-surface.js`. It compiles solid, unit-sized
voxels into exposed faces, bakes corner ambient occlusion into linear vertex
colors, and groups geometry by spatial chunk and material. It does not merge
adjacent faces, change the voxel map, or replace the original instancing API.
Use `buildVoxelMesh` for separated blocks and editor instance picking. The
surface compiler assumes opaque solids; glass bottles use glossy opaque shading.

`lib/nightmarket-lighting.js` builds a small procedural environment and one
shared planar reflection for all puddles, using the vendored Three.js r160
Reflector (MIT, `lib/vendor/LICENSE.three`). Standard quality uses a 256px
reflection target at up to 15 captures/second, 1024px shadows and DPR up to 1.25;
high quality uses 512px / 30 captures, 2048px shadows and DPR up to 2. Static
shadows are cached. These are rendering budgets, not measured frame rates.

- `voxel-surface.test.mjs` checks exposed-face counts, triangle winding,
  ambient occlusion, material boundaries, chunking and legacy compatibility.
- `nightmarket.test.mjs` executes the complete scene with real Three.js geometry
  and substituted DOM/GPU interfaces, including quality changes and resizing.
  It does not validate GPU shader compilation, visual appearance or device FPS.
