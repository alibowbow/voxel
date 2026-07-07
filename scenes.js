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
        // 라이브 3D 카드 프리뷰용 미니 디오라마 (결정론적 — Math.random 금지)
        preview3d(v) {
            const C = { sand: 0xffdca8, sandWet: 0xe6c280, wood: 0x8b5a2b, woodD: 0x6b4226,
                tire: 0x222222, frame: 0xff1155, metal: 0xaaaaaa, saddle: 0x5c3a21,
                white: 0xffffff, shade: 0xeeeeee, beak: 0xffa500, pouch: 0xffcc00,
                dark: 0x222222, band: 0x0000aa, scarf: 0xcc0000, gold: 0xffd700 };
            // 모래 턴테이블 + 보드워크
            v.cylinderY(0, 0, 1, 0, 11, C.sand);
            for (let a = 0; a < 12; a++) {
                const ang = a * Math.PI / 6;
                v.add(Math.round(Math.cos(ang) * 9), 1, Math.round(Math.sin(ang) * 9), C.sandWet);
            }
            for (let x = -10; x <= 10; x++)
                if (x % 4 !== 0) v.box(x, 1, -3, x, 2, 3, x % 2 ? C.wood : C.woodD);
            // 자전거
            v.torusZ(-4, 5, 0, 2.5, 0.8, C.tire); v.torusZ(4, 5, 0, 2.5, 0.8, C.tire);
            v.sphere(-4, 5, 0, 0.6, C.metal); v.sphere(4, 5, 0, 0.6, C.metal);
            v.line(-4, 5, 0, -1, 9, 0, 0.7, C.frame);
            v.line(4, 5, 0, 2, 9, 0, 0.7, C.frame);
            v.line(-1, 9, 0, 2, 9, 0, 0.7, C.frame);
            v.line(0, 5, 0, -4, 5, 0, 0.5, C.frame);
            v.box(-2, 10, -1, 0, 10, 1, C.saddle);
            v.line(2, 9, 0, 3, 11, 0, 0.5, C.metal);
            v.line(3, 11, -2, 3, 11, 2, 0.5, C.metal);
            v.sphere(3, 12, -2, 0.7, C.gold);
            // 펠리컨
            v.ellipsoid(-1, 13, 0, 3, 3, 2, C.white);
            v.line(-4, 12, 0, -6, 11, 0, 1.2, C.white);
            v.add(-7, 10, 0, C.dark);
            v.line(0, 15, 0, 2, 18, 0, 1.2, C.white);
            v.sphere(2, 19, 0, 2, C.white);
            v.add(3, 20, 1, C.dark); v.add(3, 20, -1, C.dark);
            v.line(4, 19, 0, 8, 18, 0, 0.8, C.beak);
            v.line(4, 18, 0, 6, 17, 0, 0.7, C.pouch);
            // 선장 모자 + 스카프
            v.cylinderY(2, 21, 21, 0, 2.4, C.dark);
            v.cylinderY(2, 22, 23, 0, 1.7, C.white);
            v.cylinderY(2, 22, 22, 0, 1.8, C.band);
            v.torusY(0, 16, 0, 2, 0.7, C.scarf);
            v.line(-1, 16, -1, -4, 14, -3, 0.6, C.scarf);
            // 날개(핸들 잡기) + 다리(페달)
            v.line(-1, 13, 2, 3, 11, 2, 0.9, C.shade);
            v.line(-1, 13, -2, 3, 11, -2, 0.9, C.shade);
            v.line(-1, 10, 1, 0, 6, 2, 0.6, C.beak);
            v.line(-1, 10, -1, -1, 6, -2, 0.6, C.beak);
        },
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
        preview3d(v) {
            const C = { grass: 0x62b947, grassL: 0x8ed65f, dirt: 0x8a6240, tunic: 0x1f9bd1,
                tunicD: 0x10658d, skin: 0xf1c27d, hair: 0xf0c64f, pants: 0xd6c59a, boots: 0x6a3b1a,
                glider: 0xd8a85a, gliderD: 0x6d3b1c, gold: 0xffd15c, leaf: 0x2f8f45, leafL: 0x5ec85a,
                wood: 0x8a5a2b, blue: 0x28d7ff, slate: 0x344a5c, dark: 0x202020 };
            // 초원 턴테이블
            for (let x = -11; x <= 11; x++)
            for (let z = -11; z <= 11; z++)
                if (x * x + z * z <= 121) {
                    v.add(x, 1, z, (x + z) % 2 ? C.grass : C.grassL);
                    v.add(x, 0, z, C.dirt);
                }
            v.add(5, 2, 6, 0x4cc9ff); v.add(-6, 2, 4, 0xffdd43);
            v.add(3, 2, -7, 0xff7ab6); v.add(-3, 2, -6, 0x4cc9ff);
            // 나무 + 미니 사당
            v.cylinderY(-7, 2, 7, -5, 1, C.wood);
            v.sphere(-7, 9, -5, 3.2, C.leaf); v.sphere(-5, 10, -3.5, 2.2, C.leafL);
            v.add(-6, 8, -3, 0xdd3344);
            v.box(6, 2, -6, 8, 4, -4, C.slate); v.add(7, 5, -5, C.slate); v.add(7, 3, -3, C.blue);
            // 공중의 링크
            v.line(-1, 8, 0, -1, 5, 1, 0.7, C.pants); v.line(1, 8, 0, 1, 5, -1, 0.7, C.pants);
            v.add(-1, 4, 1, C.boots); v.add(1, 4, -1, C.boots);
            v.ellipsoid(0, 10, 0, 2, 2, 1, C.tunic);
            v.box(-1, 9, -1, 1, 9, 1, C.tunicD);
            v.line(-1, 12, 0, -3, 14, 0, 0.6, C.tunic);
            v.line(1, 12, 0, 3, 14, 0, 0.6, C.tunic);
            v.sphere(0, 15, 0, 1.7, C.skin);
            v.ellipsoid(0, 16, 0, 1.8, 1, 1.8, C.hair);
            v.add(1, 15, 1, C.dark); v.add(1, 15, -1, C.dark);
            v.line(-1, 9, -1, -2, 14, -2, 0.4, 0xcfd8dc); v.add(-2, 14, -2, C.blue);
            // 패러세일 캐노피 + 줄
            for (let x = -6; x <= 6; x++) {
                const y = 17 + Math.round(2 - (x * x) / 10);
                for (let z = -2; z <= 2; z++)
                    v.add(x, y, z, Math.abs(x) > 4 ? C.gliderD : (x === 0 && Math.abs(z) <= 1 ? C.gold : C.glider));
            }
            v.line(-5, 17, 0, -3, 14, 0, 0.4, C.gliderD);
            v.line(5, 17, 0, 3, 14, 0, 0.4, C.gliderD);
            v.line(-3, 14, 0, 3, 14, 0, 0.5, C.gliderD);
        },
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
        preview3d(v) {
            const C = { pad: 0x8e969f, padD: 0x606a73, steel: 0xaab3bc, steelD: 0x59636d,
                deep: 0x303943, white: 0xf4f8fb, white2: 0xdde5eb, tile: 0x151a20,
                win: 0x78eaff, warn: 0xffd44d, fire: 0xff7a20, red: 0xff3b3b };
            // 콘크리트 패드
            v.cylinderY(0, 0, 1, 0, 11, C.pad);
            v.ringY(0, 1, 0, 9, 0.6, C.padD);
            v.ringY(0, 1, 0, 5.5, 0.5, C.warn);
            // 발사 마운트 + 점화 글로우
            v.cylinderY(2, 1, 3, 0, 3.4, C.deep, true);
            v.ringY(2, 1, 0, 4, 0.5, C.fire);
            // 부스터 + 상단 우주선
            for (let y = 4; y <= 17; y++) v.cylinderY(2, y, y, 0, 2.4, y % 5 === 0 ? C.white2 : C.white);
            v.box(1, 4, -2, 3, 17, -2, C.tile);
            for (let y = 18; y <= 21; y++) v.cylinderY(2, y, y, 0, 2.4 * (1 - (y - 17) / 5.2), C.white);
            v.add(2, 22, 0, C.white);
            v.box(-1, 5, -1, -1, 8, 1, C.tile);
            v.box(5, 5, -1, 5, 8, 1, C.tile);
            v.add(0, 12, 0, C.win); v.add(0, 13, 0, C.win);
            // 서비스 타워 + 젓가락 팔
            v.box(-7, 1, -1, -5, 20, 1, C.steelD);
            for (let y = 4; y <= 19; y += 4) v.box(-7, y, -1, -5, y, 1, C.steel);
            v.line(-5, 16, -1, -1, 15, -1, 0.6, C.steel);
            v.line(-5, 16, 1, -1, 15, 1, 0.6, C.steel);
            v.add(-6, 21, 0, C.red);
            v.line(-6, 20, 0, -6, 23, 0, 0.4, C.steel);
            // 연료 탱크
            v.cylinderY(7, 1, 5, -6, 2, C.white2); v.sphere(7, 6, -6, 2, C.white);
        },
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
    {
        file: 'lib/neoncity.html',
        index: '004',
        title: '네온 시티',
        desc: '비에 젖은 사이버펑크 거리 — 네온 간판, 홀로그램 광고, 하늘을 나는 자동차와 고가 모노레일이 있는 야간 복셀 디오라마.',
        badge: 'Animated 3D',
        gradient: 'linear-gradient(180deg, #0e1236 0%, #241448 55%, #3a1c66 100%)',
        accent: '#ff2d95',
        cta: '#1cf0ff',
        tags: ['city', 'cyberpunk', 'animated', 'night'],
        preview3d(v) {
            const C = { road: 0x232833, walk: 0x3a3f4a, bA: 0x3a4056, bB: 0x454c6b, bC: 0x35435c,
                winW: 0xffdca0, winC: 0x9bf9ff, winM: 0xffa3e0, winO: 0x232a3c,
                pink: 0xff2d95, cyan: 0x1cf0ff, purple: 0x9b5cff, yellow: 0xffe24a,
                lamp: 0xfff2c4, pole: 0x3a3f48, red: 0xff3b3b, body: 0x1c2230, glass: 0x39f0ff };
            // 야간 교차로 턴테이블
            v.cylinderY(0, 0, 1, 0, 11, C.walk);
            v.box(-11, 1, -2, 11, 1, 2, C.road);
            v.box(-2, 1, -11, 2, 1, 11, C.road);
            for (let x = -9; x <= 9; x += 3) v.add(x, 1, 0, 0xffdd55);
            for (let z = -9; z <= 9; z += 3) v.add(0, 1, z, 0xffdd55);
            // 네온 빌딩 4채 (창문은 결정론적 패턴)
            const bldg = (cx, cz, h, base, neon) => {
                v.box(cx - 2, 1, cz - 2, cx + 2, h, cz + 2, base);
                for (let y = 3; y <= h - 3; y += 2)
                    for (let o = -1; o <= 1; o++) {
                        const pick = ((cx + cz + y + o * 3) % 4 + 4) % 4;
                        const col = pick === 0 ? C.winW : pick === 1 ? C.winC : pick === 2 ? C.winM : C.winO;
                        v.add(cx + o, y, cz - 2, col); v.add(cx + o, y, cz + 2, col);
                        v.add(cx - 2, y, cz + o, col); v.add(cx + 2, y, cz + o, col);
                    }
                v.box(cx - 2, h - 1, cz - 2, cx + 2, h - 1, cz + 2, neon);
                v.line(cx, h + 1, cz, cx, h + 3, cz, 0.4, C.pole);
                v.add(cx, h + 4, cz, C.red);
            };
            bldg(-5, -5, 13, C.bA, C.pink);
            bldg(6, -5, 16, C.bB, C.cyan);
            bldg(5, 6, 10, C.bC, C.yellow);
            bldg(-5, 6, 8, C.bB, C.purple);
            // 가로등
            v.line(3, 1, 3, 3, 7, 3, 0.4, C.pole); v.add(3, 7, 3, C.lamp);
            v.line(-3, 1, -3, -3, 7, -3, 0.4, C.pole); v.add(-3, 7, -3, C.lamp);
            // 홀로그램 링 + 하늘을 나는 차
            v.torusY(0, 13, 0, 3, 0.6, C.cyan);
            v.torusY(0, 13, 0, 1.5, 0.5, C.pink);
            v.ellipsoid(-2, 18, 2, 2, 1, 1, C.body);
            v.add(-1, 19, 2, C.glass);
            v.add(-4, 18, 2, C.cyan);
            v.line(-4, 18, 2, -7, 18, 3, 0.4, C.cyan);
        },
        preview: `
            <svg width="190" height="126" viewBox="0 0 190 126" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 18px rgba(0,0,0,0.45));">
                <!-- Moon -->
                <circle cx="158" cy="24" r="11" fill="#f3f0ff" opacity="0.95"/>
                <circle cx="153" cy="20" r="4" fill="#dad4f0" opacity="0.9"/>
                <!-- Stars -->
                <circle cx="24" cy="18" r="1.2" fill="#fff"/>
                <circle cx="52" cy="12" r="1" fill="#fff"/>
                <circle cx="88" cy="22" r="1.2" fill="#fff"/>
                <circle cx="120" cy="14" r="1" fill="#fff"/>
                <circle cx="40" cy="30" r="1" fill="#fff"/>
                <!-- Distant silhouettes -->
                <rect x="0" y="60" width="190" height="66" fill="#161d3c"/>
                <!-- Buildings -->
                <rect x="16" y="46" width="20" height="80" fill="#23252e"/>
                <rect x="40" y="30" width="16" height="96" fill="#2b2f3a"/>
                <rect x="60" y="58" width="18" height="68" fill="#1e2733"/>
                <rect x="96" y="24" width="22" height="102" fill="#23252e"/>
                <rect x="124" y="50" width="16" height="76" fill="#2b2f3a"/>
                <rect x="146" y="40" width="20" height="86" fill="#1e2733"/>
                <!-- Neon trims -->
                <rect x="40" y="30" width="16" height="2.5" fill="#1cf0ff"/>
                <rect x="96" y="24" width="22" height="2.5" fill="#ff2d95"/>
                <rect x="146" y="40" width="20" height="2.5" fill="#ffe24a"/>
                <rect x="16" y="46" width="2" height="80" fill="#9b5cff"/>
                <rect x="140" y="50" width="2" height="76" fill="#54ff9b"/>
                <!-- Lit windows -->
                <g fill="#ffcf7a">
                    <rect x="20" y="52" width="3" height="3"/><rect x="28" y="60" width="3" height="3"/>
                    <rect x="44" y="40" width="3" height="3"/><rect x="50" y="54" width="3" height="3"/>
                    <rect x="100" y="34" width="3" height="3"/><rect x="110" y="48" width="3" height="3"/>
                    <rect x="128" y="58" width="3" height="3"/><rect x="150" y="50" width="3" height="3"/>
                    <rect x="160" y="64" width="3" height="3"/><rect x="64" y="66" width="3" height="3"/>
                </g>
                <g fill="#6ff5ff">
                    <rect x="24" y="66" width="3" height="3"/><rect x="104" y="60" width="3" height="3"/>
                    <rect x="46" y="66" width="3" height="3"/><rect x="154" y="78" width="3" height="3"/>
                </g>
                <g fill="#ff8ad8">
                    <rect x="32" y="74" width="3" height="3"/><rect x="114" y="72" width="3" height="3"/>
                </g>
                <!-- Elevated rail -->
                <rect x="0" y="88" width="190" height="3" fill="#1cf0ff" opacity="0.8"/>
                <!-- Wet street + reflections -->
                <rect x="0" y="112" width="190" height="14" fill="#14161c"/>
                <rect x="30" y="115" width="6" height="8" fill="#ff2d95" opacity="0.5"/>
                <rect x="96" y="116" width="6" height="7" fill="#1cf0ff" opacity="0.5"/>
                <rect x="150" y="115" width="5" height="8" fill="#ffe24a" opacity="0.4"/>
                <!-- Flying car with light trail -->
                <ellipse cx="70" cy="40" rx="7" ry="2.6" fill="#12161f"/>
                <rect x="66" y="38" width="5" height="2" fill="#39f0ff"/>
                <circle cx="63" cy="40" r="1.6" fill="#1cf0ff"/>
                <line x1="63" y1="40" x2="50" y2="42" stroke="#1cf0ff" stroke-width="1.2" opacity="0.5"/>
            </svg>`,
    },
];
