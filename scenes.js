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
        file: 'lib/studio.html',
        index: '000',
        tagLabel: '🎨 직접 만들기 · Create',
        title: '복셀 스튜디오',
        desc: '브라우저에서 블록을 쌓아 나만의 복셀 아트를 만들어 보세요 — PNG로 저장하고 링크 하나로 친구에게 공유할 수 있습니다.',
        badge: 'Editor',
        gradient: 'linear-gradient(140deg, #1a2148 0%, #2a3468 60%, #3d2a68 100%)',
        accent: '#ffd84d',
        cta: '#ffd84d',
        tags: ['create'],
        preview3d(v) {
            // 작업대 위에 무지개 블록이 쌓여가는 모습
            v.box(-11, 0, -11, 11, 1, 11, 0x2e3860);
            for (let x = -10; x <= 10; x += 2)
            for (let z = -10; z <= 10; z += 2) v.add(x, 1, z, 0x39457e);
            const cols = [0xff4757, 0xff8a3c, 0xffd84d, 0x2ed573, 0x1cc8ff, 0xa55eea];
            const spots = [[-7, -6], [-3, -8], [2, -7], [6, -4], [7, 1], [5, 5], [1, 7], [-4, 7], [-7, 3]];
            spots.forEach(([x, z], i) => v.box(x - 1, 2, z - 1, x + 1, 2 + i, z + 1, cols[i % 6]));
            // 중앙의 하트 (스튜디오 시작 모델)
            const HEART = [[-2, 3], [0, 3], [2, 3], [-1, 4], [1, 4],
                [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2], [-1, 1], [0, 1], [1, 1], [0, 0]];
            for (const [hx, hy] of HEART) v.box(hx, hy + 4, -1, hx, hy + 4, 0, 0xff4757);
            // 떠 있는 고스트 블록 + 커서
            v.box(4, 9, 4, 5, 10, 5, 0x1cc8ff);
            v.add(6, 12, 6, 0xffffff); v.add(7, 12, 6, 0xffffff); v.add(6, 12, 7, 0xffffff);
        },
    },
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
    {
        file: 'lib/hanok.html',
        index: '005',
        title: '가을 한옥 마을',
        desc: '단풍과 은행이 물든 한옥 마을 — 곡선 기와지붕, 돌담, 장독대, 석등 위로 낙엽이 흩날리는 가을 풍경.',
        badge: 'Animated 3D',
        gradient: 'linear-gradient(160deg, #ffe3b8 0%, #ffc98f 55%, #e8a05e 100%)',
        accent: '#e8542f',
        cta: '#b3541e',
        tags: ['korea', 'nature', 'animated'],
        icon: '🍂',
        preview3d(v) {
            const C = { grass: 0x8aa04e, path: 0xcabb9a, stone: 0x8d8578, stoneD: 0x6e675c,
                wall: 0xf2e8d8, hanji: 0xfff6e0, pillar: 0x7a4b28, tile: 0x3d4148, tileD: 0x2b2e33,
                ridge: 0xe8e2d4, maple: 0xe8542f, ginkgo: 0xffd166, trunk: 0x5c3a21, jar: 0x7a4a2e };
            for (let x = -11; x <= 11; x++)
            for (let z = -11; z <= 11; z++)
                if (x * x + z * z <= 121) v.add(x, 1, z, Math.abs(z) < 3 ? C.path : ((x + z) % 3 ? C.grass : 0xb0a45a));
            // 미니 한옥
            v.box(-6, 2, -5, 4, 2, 3, C.stone);           // 기단
            v.box(-5, 3, -4, 3, 6, 2, C.wall);            // 벽체
            v.box(-4, 4, 2, -3, 6, 2, C.hanji); v.box(0, 4, 2, 1, 6, 2, C.hanji);
            v.box(-5, 3, 2, -5, 6, 2, C.pillar); v.box(3, 3, 2, 3, 6, 2, C.pillar);
            for (let x = -8; x <= 6; x++)                  // 곡선 기와지붕
            for (let z = -7; z <= 5; z++) {
                const slope = (1 - Math.abs(z + 1) / 6) * 3;
                const curve = Math.max(0, Math.abs(x + 1) - 4) * 0.4;
                v.add(x, 7 + Math.round(slope + curve), z, (x + z) % 2 ? C.tile : C.tileD);
            }
            v.box(-8, 10, -2, 6, 10, 0, C.ridge);          // 용마루
            // 단풍나무 + 은행나무
            v.box(8, 2, -6, 8, 6, -6, C.trunk);
            v.sphere(8, 8, -6, 3, C.maple); v.sphere(9.5, 9.5, -4.5, 2, 0xc23a1c);
            v.box(-9, 2, 6, -9, 5, 6, C.trunk);
            v.sphere(-9, 7, 6, 2.6, C.ginkgo);
            // 장독대
            v.sphere(7, 3, 6, 1.6, C.jar); v.sphere(9, 3, 8, 1.3, C.jar);
            // 낙엽
            v.add(3, 2, 7, C.maple); v.add(-3, 2, -8, C.ginkgo); v.add(5, 2, -9, C.maple);
        },
    },
    {
        file: 'lib/ocean.html',
        index: '006',
        title: '산호초 바닷속',
        desc: '바다거북이 유영하는 산호초 — 물고기 떼가 원을 그리고 물방울이 피어오르는 햇살 스민 바닷속 디오라마.',
        badge: 'Animated 3D',
        gradient: 'linear-gradient(180deg, #0a5f8e 0%, #084a72 55%, #032a44 100%)',
        accent: '#22c8b0',
        cta: '#22c8b0',
        tags: ['ocean', 'animal', 'animated'],
        icon: '🐠',
        preview3d(v) {
            const C = { sand: 0xd8c48e, sandD: 0xb8a26e, pink: 0xff6b9d, orange: 0xff8a5c,
                purple: 0xa06bff, tube: 0x22c8b0, turtle: 0x4a9e5c, shell: 0x7a5c34,
                shellD: 0x5c421f, skin: 0x8fce9b, kelp: 0x2e8f5a, bubble: 0xcdf4ff };
            for (let x = -11; x <= 11; x++)
            for (let z = -11; z <= 11; z++)
                if (x * x + z * z <= 121) { v.add(x, 1, z, (x * 3 + z) % 5 ? C.sand : C.sandD); v.add(x, 0, z, C.sandD); }
            // 산호
            v.line(-7, 2, -4, -7, 8, -4, 1, C.pink);
            v.line(-7, 5, -4, -10, 9, -5, 0.7, C.pink);
            v.line(-7, 5, -4, -4, 9, -3, 0.7, C.pink);
            v.line(6, 2, -7, 6, 7, -7, 0.9, C.purple);
            v.line(6, 4, -7, 9, 8, -6, 0.6, C.purple);
            v.sphere(8, 3, 4, 2.4, 0xffb0c8);
            v.cylinderY(-4, 2, 6, 7, 1, C.tube); v.cylinderY(-2, 2, 5, 8, 0.8, C.tube);
            for (let y = 2; y < 11; y++) v.add(-9 + Math.sin(y * 0.6) * 1.4, y, 6, C.kelp);
            // 바다거북 (유영 중)
            v.ellipsoid(1, 10, 0, 4, 2, 3, C.shell);
            v.ellipsoid(1, 9, 0, 3, 1, 2, C.skin);
            v.add(0, 12, 0, C.shellD); v.add(2, 12, 1, C.shellD); v.add(2, 12, -1, C.shellD);
            v.sphere(6, 10, 0, 1.5, C.turtle);
            v.add(7, 11, 1, 0x111111);
            v.line(3, 9, 3, 6, 8, 5, 0.9, C.turtle);
            v.line(3, 9, -3, 6, 8, -5, 0.9, C.turtle);
            v.line(-2, 9, 2, -4, 8, 4, 0.7, C.turtle);
            v.line(-2, 9, -2, -4, 8, -4, 0.7, C.turtle);
            // 물방울
            v.add(-6, 12, 2, C.bubble); v.add(-5, 15, 3, C.bubble); v.add(-7, 17, 2, C.bubble);
            v.add(9, 13, -3, C.bubble); v.add(10, 16, -2, C.bubble);
            // 불가사리
            v.add(4, 2, 8, 0xff5c8a); v.add(5, 2, 8, 0xff5c8a); v.add(3, 2, 8, 0xff5c8a);
            v.add(4, 2, 9, 0xff5c8a); v.add(4, 2, 7, 0xff5c8a);
        },
    },
    {
        file: 'lib/winter.html',
        index: '007',
        title: '겨울밤 오두막',
        desc: '오로라가 넘실대는 겨울밤 — 함박눈, 굴뚝 연기 대신 창문의 온기, 눈사람과 소나무가 있는 아늑한 설원.',
        badge: 'Animated 3D',
        gradient: 'linear-gradient(180deg, #0b1230 0%, #16204a 55%, #26355e 100%)',
        accent: '#7fe8c8',
        cta: '#7fe8c8',
        tags: ['winter', 'night', 'animated'],
        icon: '❄️',
        preview3d(v) {
            const C = { snow: 0xf2f6ff, snowD: 0xd6e0f5, log: 0x6e4a2a, logD: 0x54361c,
                roof: 0xf7faff, win: 0xffc978, pine: 0x2a5c42, pineSnow: 0xe8f0fa,
                trunk: 0x4a3018, coal: 0x222222, carrot: 0xff8a3c, scarf: 0xd6455c, aurora: 0x54ffb0 };
            for (let x = -11; x <= 11; x++)
            for (let z = -11; z <= 11; z++)
                if (x * x + z * z <= 121) { v.add(x, 1, z, (x + z * 2) % 6 ? C.snow : C.snowD); v.add(x, 0, z, C.snowD); }
            // 통나무 오두막
            for (let y = 2; y <= 6; y++) {
                const c = y % 2 ? C.log : C.logD;
                v.box(-7, y, -5, 1, y, -5, c); v.box(-7, y, 1, 1, y, 1, c);
                v.box(-7, y, -5, -7, y, 1, c); v.box(1, y, -5, 1, y, 1, c);
            }
            for (let i = 0; i <= 3; i++) v.box(-8 + i, 7 + i, -6, 2 - i, 7 + i, 2, i > 1 ? C.roof : C.logD);
            v.box(-4, 2, 1, -2, 5, 1, 0x8a5c30);      // 문
            v.box(-6, 3, 1, -5, 5, 1, C.win);         // 따뜻한 창
            v.box(0, 3, 1, 0, 5, 1, C.win);
            v.box(0, 8, -4, 1, 11, -3, 0x7a7d85);     // 굴뚝
            // 소나무
            v.box(6, 2, -6, 6, 4, -6, C.trunk);
            v.cylinderY(6, 4, 5, -6, 3, C.pine); v.ringY(6, 6, -6, 2.2, 0.7, C.pineSnow);
            v.cylinderY(6, 6, 7, -6, 2, C.pine); v.cylinderY(6, 8, 9, -6, 1, C.pine);
            v.add(6, 10, -6, C.pineSnow);
            // 눈사람
            v.sphere(6, 3, 6, 2, 0xffffff);
            v.sphere(6, 6, 6, 1.4, 0xffffff);
            v.add(7, 6, 7, C.coal); v.line(7, 6, 6, 8, 6, 6, 0.4, C.carrot);
            v.torusY(6, 5, 6, 1.3, 0.5, C.scarf);
            // 오로라 리본
            for (let x = -9; x <= 9; x++) {
                const y = 16 + Math.round(Math.sin(x * 0.5) * 2);
                v.add(x, y, -9, C.aurora); v.add(x, y + 1, -9, 0x7fe8c8);
            }
            // 눈송이
            v.add(-4, 11, 4, 0xffffff); v.add(3, 14, 2, 0xffffff); v.add(-8, 13, -2, 0xffffff);
        },
    },
    {
        file: 'lib/tinyplanet.html',
        index: '008',
        title: '미니 행성',
        desc: '고리를 두른 자그마한 행성 — 위성과 우주선이 궤도를 돌고, 극지방 얼음과 초록 대륙 위에 작은 집 한 채.',
        badge: 'Animated 3D',
        gradient: 'radial-gradient(circle at 30% 20%, #1c2450 0%, #0c1030 45%, #050818 100%)',
        accent: '#6b8aff',
        cta: '#ffb85c',
        tags: ['space', 'animated'],
        icon: '🪐',
        preview3d(v) {
            const C = { ocean: 0x2e6ed6, grass: 0x5cb85c, sand: 0xe8cc8a, ice: 0xeaf5ff,
                ring: 0xc8a86e, ringD: 0x9a7f4e, moon: 0xb8bcc8, star: 0xffffff,
                rocket: 0xf4f8fb, nose: 0xe85c5c, flame: 0xffb85c };
            const R = 7;
            for (let x = -R; x <= R; x++)
            for (let y = -R; y <= R; y++)
            for (let z = -R; z <= R; z++) {
                const d = Math.hypot(x, y, z);
                if (d > R || d < R - 2) continue;
                const cont = Math.sin(x * 0.8) + Math.cos(z * 0.7) + Math.sin(y * 0.6);
                let c;
                if (Math.abs(y) > R - 2) c = C.ice;
                else if (cont > 0.5) c = Math.abs(y) < 2 ? C.sand : C.grass;
                else c = C.ocean;
                v.add(x, y + 9, z, c);
            }
            v.ringY(0, 9, 0, 11, 1, C.ring);           // 고리
            v.ringY(0, 9, 0, 13, 0.6, C.ringD);
            v.sphere(0, 18, -1, 1.6, C.moon);          // 위성
            // 작은 우주선
            v.box(9, 14, 5, 10, 15, 5, C.rocket);
            v.add(10, 16, 5, C.nose); v.add(9, 13, 5, C.flame);
            // 나무 한 그루 + 집
            v.add(0, 17, 0, 0x5c3a21); v.sphere(0, 18, 0, 1.2, 0x2f8f45);
            v.box(-5, 14, -3, -4, 15, -2, 0xfff2dd); v.add(-4, 16, -2, 0xe85c5c);
            // 별
            v.add(-10, 20, -8, C.star); v.add(11, 19, -6, C.star); v.add(-12, 12, 6, C.star);
            v.add(8, 4, 10, C.star); v.add(-9, 2, -10, C.star); v.add(12, 8, 2, C.star);
        },
    },
];
