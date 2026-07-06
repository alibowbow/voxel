/* ============================================================================
 * scenes.js — Voxel Gallery scene manifest.
 * ----------------------------------------------------------------------------
 * This is the SINGLE source of truth for the gallery. To add a new scene:
 *
 *   1. Drop your scene file in  lib/your-scene.html
 *      (import the shared engine:  import { VoxelBuilder, buildVoxelMesh }
 *                                  from './voxel-engine.js';)
 *   2. Append one object to the array below.
 *
 * The homepage (index.html) renders every card from this data automatically —
 * no HTML or CSS editing required.
 *
 * Fields:
 *   file     (required)  path to the scene HTML
 *   index    (required)  the "#NNN" number shown on the card
 *   title    (required)  card heading
 *   desc     (required)  one-line description
 *   badge                pill text over the preview (default "Interactive 3D")
 *   gradient             CSS background for the preview area
 *   accent               primary colour (tag + hover glow)
 *   cta                  "Open Scene" link colour (defaults to accent)
 *   tags                 keywords (used by future filtering)
 *   preview              optional custom SVG art; omit to get an icon default
 *   icon                 emoji used when no `preview` is supplied
 * ========================================================================== */

window.VOXEL_SCENES = [
    {
        file: 'lib/pelican.html',
        index: '001',
        title: 'The Pelican Cruiser',
        desc: 'A captain pelican riding a neon beach cruiser across a sunset boardwalk — procedurally generated with 6,000+ voxels.',
        badge: 'Interactive 3D',
        gradient: 'linear-gradient(135deg, #ffcca8 60%, #ff9966)',
        accent: '#ff1155',
        cta: '#00ffff',
        tags: ['animal', 'beach'],
        preview: `
            <svg width="180" height="120" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 16px rgba(0,0,0,0.3));">
                <!-- Body -->
                <rect x="60" y="40" width="40" height="32" rx="8" fill="#ffffff"/>
                <!-- Wing -->
                <rect x="40" y="50" width="22" height="10" rx="4" fill="#eeeeee"/>
                <rect x="98" y="50" width="22" height="10" rx="4" fill="#eeeeee"/>
                <!-- Head -->
                <circle cx="82" cy="34" r="14" fill="#ffffff"/>
                <!-- Beak -->
                <rect x="92" y="32" width="30" height="6" rx="3" fill="#ffa500"/>
                <!-- Pouch -->
                <path d="M92 38 Q112 50 92 50 Z" fill="#ffcc00"/>
                <!-- Eye -->
                <circle cx="86" cy="30" r="3" fill="#222"/>
                <circle cx="87" cy="29" r="1" fill="#fff"/>
                <!-- Captain hat -->
                <rect x="70" y="17" width="28" height="4" rx="2" fill="#111"/>
                <rect x="74" y="10" width="20" height="10" rx="2" fill="#fff"/>
                <rect x="74" y="15" width="20" height="3" fill="#0000aa"/>
                <!-- Bike wheels -->
                <circle cx="50" cy="95" r="14" fill="none" stroke="#222" stroke-width="4"/>
                <circle cx="130" cy="95" r="14" fill="none" stroke="#222" stroke-width="4"/>
                <!-- Frame -->
                <line x1="80" y1="80" x2="50" y2="95" stroke="#ff1155" stroke-width="4" stroke-linecap="round"/>
                <line x1="80" y1="80" x2="130" y2="95" stroke="#ff1155" stroke-width="4" stroke-linecap="round"/>
                <line x1="80" y1="80" x2="100" y2="65" stroke="#ff1155" stroke-width="4" stroke-linecap="round"/>
                <!-- Handlebar -->
                <line x1="95" y1="62" x2="115" y2="58" stroke="#aaa" stroke-width="3" stroke-linecap="round"/>
                <!-- Legs -->
                <line x1="75" y1="70" x2="60" y2="90" stroke="#ffa500" stroke-width="3" stroke-linecap="round"/>
                <!-- Scarf -->
                <path d="M68 45 Q55 52 45 48" stroke="#cc0000" stroke-width="4" fill="none" stroke-linecap="round"/>
            </svg>`,
    },
    {
        file: 'lib/zeldabotw.html',
        index: '002',
        title: '야생의 용사 링크',
        desc: '패러세일을 타고 하이랄 초원을 활공하는 링크 — 고대 탑, 사당, 모닥불이 있는 절차적 복셀 디오라마.',
        badge: 'Interactive 3D',
        gradient: 'linear-gradient(160deg, #8fd8ff 0%, #c8efa8 100%)',
        accent: '#28d7ff',
        cta: '#28d7ff',
        tags: ['game', 'nature'],
        preview: `
            <svg width="180" height="120" viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 16px rgba(0,0,0,0.25));">
                <!-- Sky & ground -->
                <rect x="0" y="70" width="180" height="50" fill="#62b947" rx="2"/>
                <!-- Ancient Tower (far right) -->
                <rect x="138" y="18" width="14" height="56" rx="2" fill="#344a5c"/>
                <rect x="136" y="28" width="18" height="4" rx="1" fill="#1c2d3a"/>
                <rect x="136" y="46" width="18" height="4" rx="1" fill="#1c2d3a"/>
                <ellipse cx="145" cy="16" rx="7" ry="7" fill="#28d7ff" opacity="0.9"/>
                <!-- Ancient glow lines on tower -->
                <line x1="138" y1="34" x2="138" y2="44" stroke="#28d7ff" stroke-width="1.5"/>
                <line x1="152" y1="38" x2="152" y2="48" stroke="#28d7ff" stroke-width="1.5"/>
                <!-- Tree (left) -->
                <rect x="24" y="55" width="6" height="18" rx="2" fill="#5a3519"/>
                <ellipse cx="27" cy="52" rx="14" ry="12" fill="#2f8f45"/>
                <ellipse cx="35" cy="56" rx="9" ry="8" fill="#5ec85a"/>
                <!-- Link body -->
                <rect x="82" y="62" width="16" height="20" rx="3" fill="#1f9bd1"/>
                <rect x="82" y="72" width="16" height="4" fill="#4b2a16"/>
                <!-- Link legs -->
                <rect x="83" y="80" width="5" height="12" rx="2" fill="#d6c59a"/>
                <rect x="92" y="80" width="5" height="12" rx="2" fill="#d6c59a"/>
                <rect x="82" y="90" width="6" height="4" rx="1" fill="#6a3b1a"/>
                <rect x="91" y="90" width="6" height="4" rx="1" fill="#6a3b1a"/>
                <!-- Link head -->
                <circle cx="90" cy="56" r="9" fill="#f1c27d"/>
                <!-- Hair -->
                <ellipse cx="90" cy="50" rx="8" ry="5" fill="#f0c64f"/>
                <rect x="82" y="48" width="4" height="8" rx="2" fill="#b98527"/>
                <rect x="104" y="48" width="4" height="8" rx="2" fill="#b98527"/>
                <!-- Paraglider -->
                <ellipse cx="90" cy="28" rx="42" ry="10" fill="#d8a85a" opacity="0.92"/>
                <ellipse cx="90" cy="28" rx="42" ry="10" fill="none" stroke="#6d3b1c" stroke-width="1.5"/>
                <!-- Glider triangle pattern -->
                <polygon points="90,24 86,32 94,32" fill="#ffd15c"/>
                <!-- Glider strings -->
                <line x1="74" y1="35" x2="84" y2="58" stroke="#6d3b1c" stroke-width="1.2"/>
                <line x1="106" y1="35" x2="96" y2="58" stroke="#6d3b1c" stroke-width="1.2"/>
                <!-- Sword on back -->
                <line x1="100" y1="62" x2="112" y2="44" stroke="#cfd8dc" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="107" y1="55" x2="115" y2="56" stroke="#4cb6ff" stroke-width="2" stroke-linecap="round"/>
                <!-- Campfire (right) -->
                <circle cx="155" cy="76" r="4" fill="#ff5a1f"/>
                <circle cx="155" cy="73" r="2.5" fill="#fff05a"/>
                <!-- Clouds -->
                <ellipse cx="40" cy="16" rx="18" ry="7" fill="white" opacity="0.9"/>
                <ellipse cx="55" cy="12" rx="12" ry="6" fill="white" opacity="0.8"/>
            </svg>`,
    },
    {
        file: 'lib/spacex.html',
        index: '003',
        title: 'SpaceX Launch Pad',
        desc: '카운트다운부터 이륙까지 — Starship 발사 시퀀스가 애니메이션으로 펼쳐지는 절차적 복셀 발사장.',
        badge: 'Animated 3D',
        gradient: 'linear-gradient(160deg, #86d9ff 0%, #bfeeff 55%, #f6d79f 100%)',
        accent: '#ff6b2d',
        cta: '#ff6b2d',
        tags: ['space', 'animated'],
        preview: `
            <svg width="190" height="126" viewBox="0 0 190 126" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 18px rgba(0,0,0,0.28));">
                <!-- Ground / concrete pad -->
                <rect x="0" y="92" width="190" height="34" fill="#8e969f"/>
                <rect x="0" y="92" width="190" height="3" fill="#606a73"/>
                <!-- Warning lines -->
                <rect x="30" y="93" width="130" height="2" fill="#ffd44d"/>
                <!-- Service tower (left) -->
                <rect x="28" y="18" width="10" height="75" rx="1" fill="#59636d"/>
                <rect x="22" y="18" width="4" height="75" rx="1" fill="#59636d"/>
                <!-- Tower cross beams -->
                <line x1="22" y1="30" x2="38" y2="30" stroke="#aab3bc" stroke-width="1.5"/>
                <line x1="22" y1="48" x2="38" y2="48" stroke="#aab3bc" stroke-width="1.5"/>
                <line x1="22" y1="66" x2="38" y2="66" stroke="#aab3bc" stroke-width="1.5"/>
                <line x1="22" y1="82" x2="38" y2="82" stroke="#aab3bc" stroke-width="1.5"/>
                <!-- Chopstick arms -->
                <line x1="36" y1="46" x2="62" y2="50" stroke="#ff7a20" stroke-width="3" stroke-linecap="round"/>
                <line x1="36" y1="54" x2="62" y2="50" stroke="#ff7a20" stroke-width="3" stroke-linecap="round"/>
                <!-- Rocket body (Starship) -->
                <rect x="58" y="16" width="18" height="76" rx="4" fill="#f4f8fb"/>
                <!-- Heat tiles (dark side) -->
                <rect x="70" y="16" width="6" height="76" rx="2" fill="#151a20"/>
                <!-- Nose cone -->
                <ellipse cx="67" cy="14" rx="9" ry="6" fill="#f4f8fb"/>
                <rect x="70" y="8" width="4" height="10" rx="2" fill="#151a20"/>
                <!-- Flaps -->
                <rect x="55" y="22" width="4" height="14" rx="1" fill="#151a20"/>
                <rect x="75" y="22" width="4" height="14" rx="1" fill="#151a20"/>
                <rect x="55" y="72" width="4" height="10" rx="1" fill="#151a20"/>
                <rect x="75" y="72" width="4" height="10" rx="1" fill="#151a20"/>
                <!-- Window -->
                <rect x="60" y="44" width="6" height="5" rx="1" fill="#78eaff"/>
                <!-- Launch mount -->
                <rect x="56" y="90" width="22" height="6" rx="2" fill="#303943"/>
                <rect x="50" y="94" width="34" height="4" rx="1" fill="#59636d"/>
                <!-- Engine fire -->
                <ellipse cx="67" cy="98" rx="10" ry="6" fill="#ff7a20" opacity="0.9"/>
                <ellipse cx="67" cy="100" rx="7" ry="4" fill="#fff071" opacity="0.95"/>
                <ellipse cx="67" cy="102" rx="4" ry="2.5" fill="#80f4ff"/>
                <!-- Smoke -->
                <ellipse cx="40" cy="106" rx="18" ry="8" fill="#b7bcc1" opacity="0.55"/>
                <ellipse cx="90" cy="108" rx="14" ry="7" fill="#b7bcc1" opacity="0.4"/>
                <!-- Fuel tanks (right) -->
                <rect x="128" y="60" width="16" height="34" rx="8" fill="#dde5eb"/>
                <ellipse cx="136" cy="58" rx="8" ry="5" fill="#f4f8fb"/>
                <rect x="148" y="64" width="14" height="28" rx="7" fill="#dde5eb"/>
                <ellipse cx="155" cy="63" rx="7" ry="4" fill="#f4f8fb"/>
                <!-- Clouds -->
                <ellipse cx="155" cy="22" rx="20" ry="8" fill="white" opacity="0.85"/>
                <ellipse cx="168" cy="17" rx="13" ry="7" fill="white" opacity="0.7"/>
                <!-- Sun -->
                <circle cx="168" cy="14" r="9" fill="#fff9cf" opacity="0.95"/>
            </svg>`,
    },
];
