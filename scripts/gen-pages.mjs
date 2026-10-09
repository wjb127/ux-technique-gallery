// Builds data/techniques.json (registry) from ledger-techniques + assign + palettes, and writes t/<slug>/index.html
import fs from 'node:fs';
const led = JSON.parse(fs.readFileSync('data/ledger-techniques.json', 'utf8'));
const assign = JSON.parse(fs.readFileSync('data/assign.json', 'utf8'));
const pal = fs.existsSync('data/ref-palettes.json') ? JSON.parse(fs.readFileSync('data/ref-palettes.json', 'utf8')) : {};
const engineOf = {}; for (const [e, list] of Object.entries(assign)) for (const s of list) engineOf[s] = e;
// Korean category label for each clone. Resolution order (first hit wins):
//   1. explicit `category` on the ledger entry (Korean label or an engine key), if the ledger ever supplies one
//   2. LABEL_OVERRIDE by slug (hand-fixed cases where the engine is a poor description of the technique)
//   3. the curated engine from data/assign.json (except the catch-all 'saas' engine)
//   4. whole-word keyword RULES on the technique name (\b-bounded; no bare 'os' / 'sim' / 'data' / 'sand' substrings)
//   5. fallback '인터랙션'
const ENGINE_LABEL = { gradient: '그라디언트', palette: '컬러', paint: '드로잉', seq: '사운드', audio: '사운드', nodes: '노드 그래프', type: '타이포',
  pixel: '그리드/타일', globe: '지도/지구', cssfx: 'CSS 생성기', svggen: 'SVG 생성기', imagefx: '이미지 스튜디오', puzzle: '퍼즐/게임', code: '라이브 코딩',
  three: '3D 스테이지', desk: '레트로 데스크톱', sim: '시뮬레이션', chart: '데이터/타임라인', gen: '제너레이티브 아트' };
const LABEL_OVERRIDE = { 'webcam-class-train-studio': '인터랙션', 'mondrian-partition-canvas': '드로잉', 'social-meta-preview-studio': '인터랙션',
  'cuberto-context-cursor-agency-home': '랜딩 페이지', 'rauno-craft-interaction-shelf': '인터랙션', 'lofi-cafe-station-tv-room': '사운드',
  'drifting-art-attic-canvas': '인터랙션', 'partiful-invite-theme-customizer': '인터랙션', 'zenpen-zen-writing-editor': '타이포',
  'mmm-page-sticker-site-builder': '인터랙션', 'lospec-pixel-palette-browser': '컬러', 'waveform-audio-editor': '사운드', 'ladybug-effects-studio': '이미지 스튜디오',
  'duolingo-mascot-onboarding-quiz-flow': '온보딩 플로우', 'slowroads-zen-title-procedural-drive': '3D 스테이지', 'pixelthoughts-star-shrink-60s-ritual': '명상 인터랙션',
  'ia-writer-focus-mode-typewriter-hero': '글쓰기 에디터', 'devouring-details-scroll-ruler-reference-manual': '스크롤 인터랙션', 'hey-screener-yes-no-gradient-inbox': '인박스 인터랙션',
  'stripe-press-3d-book-stack-catalog': '3D 카탈로그', 'airpods-pro-highlights-carousel-sticky-localnav': '제품 스토리 캐러셀', 'opal-scroll-word-reveal-odometer-gems': '스크롤 인터랙션',
  'polestar-4-configurator-swatch-gallery-price-rail': '차량 컨피규레이터', 'mercury-demo-banking-dashboard-persona-tour': '뱅킹 대시보드', 'zed-blueprint-grid-kbd-hint-command-palette': '커맨드 팔레트 랜딩',
  'globle-hot-cold-3d-globe-guess-game': '지구본 추리 게임', 'arc-stitched-banner-grain-blue-quote-marquee': '브랜드 랜딩', 'screen-studio-editor-timeline-hero-tabbed-zoom-clips': '에디터 목업 랜딩',
  'flocus-gradient-focus-dashboard-mode-toggle': '집중 대시보드', 'dinamo-favorit-fullscreen-variable-axis-tester': '가변 폰트 테스터', 'rhode-lip-tint-pdp-swatch-route-cart-drawer': '뷰티 상품 상세(PDP)',
  'airbnb-segmented-search-pill-calendar-guests-map-pins': '숙소 검색 플로우', 'nts-dual-live-channel-bar-expand-schedule-mixtape-rail': '라이브 라디오 플레이어', 'basement-human-machine-toggle-3d-hq-ascii-index': '3D 에이전시 사이트',
  'a24-title-stack-hover-hero-swap-masonry-films': '영화 스튜디오 히어로', 'rijksmuseum-floating-search-dock-masonry-filter-drawer-deep-zoom': '미술관 컬렉션 탐색', 'copilot-blurred-tilted-category-pills-hero-split-glass-nav': '핀테크 앱 랜딩',
  'lando-topo-hero-scroll-signature-draw-two-tone-manifesto': '선수 포트폴리오', 'brilliant-autoplay-demo-card-hero-koji-onboarding-steps': '학습 앱 온보딩', 'mschf-numbered-drop-index-bottom-anchored-redacted-rows': '브루탈리스트 인덱스',
  'daylight-sunlit-hero-leaf-shadow-scroll-word-fill-glass-pill-nav': '하드웨어 제품 랜딩', 'wetransfer-floating-upload-panel-expiry-menu-wallpaper-swap': '파일 전송 업로드 플로우', 'readymag-cycling-collage-hero-floating-cta-card-bento-stickers': '디자인 툴 랜딩',
  'mynoise-ten-band-spectrum-slider-mixer-presets-animate': '스펙트럼 사운드 믹서',
  'arnaud-story-progress-fluid-drag-scramble-title-portfolio': '스토리 포트폴리오',
  'fromanother-agency-studio-collective-cycle-section-rail-blob': '에이전시 랜딩',
  'nightride-crt-scanline-eq-station-rail-milkdrop-tabs': 'CRT 신스웨이브 라디오',
  'grilli-flexa-jump-rail-subfamily-pill-editable-specimen': '타입 파운드리 스페시먼',
  'groovepizza-radial-slice-sequencer-shape-polygon-sliders': '라디얼 드럼 시퀀서',
  'rabbit-r1-orange-device-stacked-app-card-screen-buy-bar': '하드웨어 제품 랜딩',
  'skia-shaders-thumb-rail-split-editor-canvas-run-itime': '셰이더 플레이그라운드',
  'hoverstat-framed-site-preview-year-tag-pill-archive': '웹 아카이브' };
const RULES = [
  [/\b(pricing|checkout|billing|booking|wallet|cart)\b/i, 'SaaS 화면'],
  [/\b(explainer|scrollytelling|scroll-depth|smooth scroll)\b/i, '스크롤 인터랙션'],
  [/\b(desktop|win95|windows 9[58]|retro os|vaporwave os)\b/i, '레트로 데스크톱'],
  [/\b(landing|hero|product (page|story)|brand store|feature tour|agency home|marketing site)\b/i, '랜딩 페이지'],
  [/\b(puzzles?|games?|quiz)\b/i, '퍼즐/게임'],
  [/\b(3d|three\.js|voxels?|isometric|origami|gltf)\b/i, '3D 스테이지'],
  [/\bgradients?\b/i, '그라디언트'],
  [/\b(pixel|ascii|mosaic|tiles?)\b/i, '그리드/타일'],
  [/\b(colou?rs?|(?<!command-)palettes?|hues?)\b/i, '컬러'],
  [/\b(paint|brush(es)?|drawing|sketch(es)?|whiteboard)\b/i, '드로잉'],
  [/\b(sequencer|drums?|synth|audio|music|sound|piano|melody|radio)\b/i, '사운드'],
  [/\b(node[- ]graph|node editor|patcher|schema|circuit)\b/i, '노드 그래프'],
  [/\b(fonts?|typography|typeface|glyphs?|kerning|type[- ]scale)\b/i, '타이포'],
  [/\b(maps?|geospatial|globe|earth|star-map|solar-system|orbital)\b/i, '지도/지구'],
  [/\b(css|clip-path|box-shadow|glassmorphism|neumorphi\w*|claymorphi\w*|border-radius|easing|bezier)\b/i, 'CSS 생성기'],
  [/\b(svg|blobs?|waves?|qr|icons?|avatars?)\b/i, 'SVG 생성기'],
  [/\b(photo|image|dither|duotone|mockup|screenshot)\b/i, '이미지 스튜디오'],
  [/\b(repl|live-?cod(e|ing)|code editor|regex|api)\b/i, '라이브 코딩'],
  [/\b(simulat\w*|sandbox|fluid|reaction-diffusion|ecosystem|physics|particles?)\b/i, '시뮬레이션'],
  [/\b(charts?|timeline|data-?viz|visuali[sz]ation|heatmap)\b/i, '데이터/타임라인'],
  [/\b(generative|procedural)\b/i, '제너레이티브 아트'],
];
const ruleLabel = (name) => (RULES.find(([re]) => re.test(name)) || [])[1] || null;
const categoryOf = (t, engine) => {
  if (t.category) { const c = String(t.category).trim(); if (ENGINE_LABEL[c]) return ENGINE_LABEL[c]; if (/[가-힣]/.test(c)) return c; }
  return LABEL_OVERRIDE[t.slug] || (engine && engine !== 'saas' && ENGINE_LABEL[engine]) || ruleLabel(t.name) || '인터랙션';
};
// "Things 3 — Cultured Code task manager for Mac & iOS" -> "Things 3"; "Igloo Inc. (WebGL by Abeto)" -> "Igloo Inc."
const brandOf = (t) => (String(t.product || t.domain).split(/\s+[—–|]\s+/)[0].replace(/\s*\([^)]*\)\s*$/, '').trim() || t.domain);
const koOf = (t) => { if (t.lens === 'foundational-principle' || !t.id.startsWith('clone-')) return 'UX 원칙 데모'; return `${brandOf(t)} 스타일 ${categoryOf(t, engineOf[t.slug])} 클론`; };
const shortOf = (t) => t.name.replace(/^Clone\s+/i, '').split(':')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
const out = led.map((t) => ({ ...t, short: shortOf(t), ko: koOf(t), engine: engineOf[t.slug] || null, variant: t.slug, theme: pal[t.slug] || null,
  path: `/t/${t.slug}/`, built: !!engineOf[t.slug] }));
fs.writeFileSync('data/techniques.json', JSON.stringify(out, null, 1));
fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/palettes.json', JSON.stringify(pal));
fs.writeFileSync('public/techniques.json', JSON.stringify(out.map(({ theme, prompt, ...r }) => r), null, 1));
fs.rmSync('t', { recursive: true, force: true });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
for (const t of out) {
  if (!t.engine) continue;
  fs.mkdirSync(`t/${t.slug}`, { recursive: true });
  const { prompt, ...pub } = t;
  fs.writeFileSync(`t/${t.slug}/index.html`, `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.short)} · ${esc(t.product)} — UX Technique Gallery</title><meta name="description" content="${esc(t.name)}">
<script type="application/json" id="tg-data">${JSON.stringify(pub).replace(/</g, '\\u003c')}</script></head>
<body><div id="demo"></div><noscript>${esc(t.name)}</noscript><script type="module" src="/src/page.js"></script></body></html>\n`);
}
console.log('pages', out.filter((t) => t.engine).length, '/', out.length);
