// Builds data/techniques.json (registry) from ledger-techniques + assign + palettes, and writes t/<slug>/index.html
import fs from 'node:fs';
const led = JSON.parse(fs.readFileSync('data/ledger-techniques.json', 'utf8'));
const assign = JSON.parse(fs.readFileSync('data/assign.json', 'utf8'));
const pal = fs.existsSync('data/ref-palettes.json') ? JSON.parse(fs.readFileSync('data/ref-palettes.json', 'utf8')) : {};
const engineOf = {}; for (const [e, list] of Object.entries(assign)) for (const s of list) engineOf[s] = e;
const KO = [[/gradient/i, '그라디언트'], [/palette|color|colour|hue|tone/i, '컬러'], [/paint|brush|draw|sketch|canvas/i, '드로잉'], [/sequencer|beat|drum|synth|audio|music|sound|piano|melody|instrument|radio|player|mixer/i, '사운드'],
  [/node|graph|patch|schema|circuit|logic/i, '노드 그래프'], [/font|type|glyph|kerning|text/i, '타이포'], [/pixel|grid|tile|mosaic|ascii/i, '그리드/타일'], [/map|globe|earth|star|solar|orbit/i, '지도/지구'],
  [/pricing|checkout|wallet|booking/i, 'SaaS 화면'], [/css|clip|shadow|glass|neumorph|clay|radius|bezier|easing|anim/i, 'CSS 생성기'], [/svg|wave|blob|shape|qr|icon|avatar/i, 'SVG 생성기'],
  [/photo|image|dither|duotone|mockup|screenshot|code-snippet|code image|video/i, '이미지 스튜디오'], [/puzzle|game|level|battle|quiz/i, '퍼즐/게임'], [/code|repl|editor|livecode|regex|api/i, '라이브 코딩'],
  [/3d|voxel|mesh|origami|isometric/i, '3D 스테이지'], [/desktop|os|win95|retro/i, '레트로 데스크톱'], [/sim|sand|fluid|diffusion|ecosystem|physics/i, '시뮬레이션'], [/chart|timeline|scrub|data/i, '데이터/타임라인']];
const koOf = (t) => { if (t.lens === 'foundational-principle' || !t.id.startsWith('clone-')) return 'UX 원칙 데모'; const hit = KO.find(([re]) => re.test(t.name)); return `${t.product || t.domain} 스타일 ${hit ? hit[1] : '인터랙션'} 클론`; };
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
