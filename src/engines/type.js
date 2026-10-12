import '@fontsource-variable/roboto-flex/full.css';
import '@fontsource-variable/fraunces/full.css';
import { h, s, css, drag, localPos, clamp, copy, toast, sleep, rng, pick, gesture, fire } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle, codebox } from '../kit.js';
const RF = "'Roboto Flex Variable', sans-serif", FR = "'Fraunces Variable', Georgia, serif";
const AX = { wght: [100, 1000, 400], wdth: [25, 151, 100], opsz: [8, 144, 14], GRAD: [-200, 150, 0], slnt: [-10, 0, 0], XTRA: [323, 603, 468], YOPQ: [25, 135, 79] };
const fvs = (a) => Object.entries(a).map(([k, v]) => `"${k}" ${Math.round(v)}`).join(', ');
import MSLOGO from '../data/monaspace-logo.json';
const V = {};
V['modular-typescale-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', panel: '#fafafa', ac: '#3f51b5', dark: false });
  const P = { base: 16, ratio: 1.25, weight: 600, font: RF, text: 'Brown jars prevented the mixture from freezing too quickly' };
  const RAT = [[1.067, 'Minor Second'], [1.125, 'Major Second'], [1.2, 'Minor Third'], [1.25, 'Major Third'], [1.333, 'Perfect Fourth'], [1.414, 'Augmented Fourth'], [1.5, 'Perfect Fifth'], [1.618, 'Golden Ratio']];
  const spec = h('div', { style: { display: 'grid', gap: '6px', overflow: 'hidden' } }); const site = h('div'); const code = codebox(() => Array.from({ length: 7 }, (_, i) => `--step-${6 - i}: ${(P.base * P.ratio ** (6 - i) / 16).toFixed(3)}rem; /* ${(P.base * P.ratio ** (6 - i)).toFixed(2)}px */`).join('\n') + `\n--step--1: ${(P.base / P.ratio / 16).toFixed(3)}rem;`);
  const draw = () => { spec.replaceChildren(...Array.from({ length: 8 }, (_, i) => { const px = P.base * P.ratio ** (6 - i); return h('div', { style: { display: 'grid', gridTemplateColumns: '70px 1fr', alignItems: 'baseline', gap: '12px' } }, h('span', { style: { fontSize: '11px', opacity: .5, fontFamily: 'monospace' } }, px.toFixed(2) + 'px'), h('span', { style: { fontSize: px + 'px', fontWeight: P.weight, fontFamily: P.font, whiteSpace: 'nowrap', lineHeight: 1.15, letterSpacing: '-.01em' } }, P.text)); }));
    site.replaceChildren(h('div', { style: { fontFamily: P.font } }, h('div.k-row', { style: { fontSize: '12px', marginBottom: '30px' } }, h('b', {}, 'Zephyr'), h('span', { style: { flex: 1 } }), 'Home', 'Features', 'Pricing'), h('div', { style: { fontSize: P.base * P.ratio ** 4 + 'px', fontWeight: P.weight, lineHeight: 1.05 } }, 'Your digital transformation begins here'), h('p', { style: { fontSize: P.base + 'px', opacity: .7 } }, 'Unlock the full potential of your business with scalable solutions.'), h('div.k-row', {}, h('span', { style: { background: '#111', color: '#fff', padding: '10px 16px', borderRadius: '6px', fontSize: P.base + 'px' } }, 'Explore Services'), h('span', { style: { border: '1px solid #111', padding: '10px 16px', borderRadius: '6px', fontSize: P.base + 'px' } }, 'Get Started')))); code.update(); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '260px 1fr 380px'; root.style.gap = '0';
  root.append(panel(null, h('b', { style: { fontSize: '18px' } }, 'Typescale-ish'), slider('Base size', 10, 24, P.base, 1, (v) => { P.base = v; draw(); }, (v) => v + 'px'), select(RAT.map(([r, n]) => [r, `${r} – ${n}`]), P.ratio, (v) => { P.ratio = +v; draw(); }), slider('Weight', 100, 1000, P.weight, 10, (v) => { P.weight = v; draw(); }), select([[RF, 'Roboto Flex'], [FR, 'Fraunces'], ['Georgia,serif', 'Georgia'], ["'Inter Variable'", 'Inter']], P.font, (v) => { P.font = v; draw(); }), h('input', { value: P.text, oninput: (e) => { P.text = e.target.value; draw(); }, style: { padding: '8px' } }), code, btn('Copy CSS', () => copy(code.textContent), 'pri')), h('div', { style: { padding: '30px', overflow: 'hidden' } }, spec), h('div', { style: { padding: '30px', borderLeft: '1px solid #eee' } }, site));
  draw();
  window.__demoProof = async () => { P.ratio = 1.25; P.weight = 700; draw(); return 'Major Third scale, weight 700'; };
};
V['variable-font-axis-playground'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', panel: '#fff', ac: '#e91e63', dark: false });
  const a = Object.fromEntries(Object.entries(AX).map(([k, v]) => [k, v[2]])); let anim = false, t = 0;
  const NAMES = ['Arial', 'Antonia', 'Camera', 'Daily', 'Dialyte', 'Estragon', 'Favorit', 'Gridnik', 'Gravity', 'Helvetica', 'Hermes', 'Ikaros', 'Lulia', 'Marfa', 'Monument', 'Oracle', 'Otto', 'Pilow', 'Pantom', 'Prophet', 'Publisher', 'ROM', 'Regola', 'Schengen', 'Social', 'Solar', 'Stolt', 'Walter', 'Whyte'];
  const stage = h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px 12px', justifyContent: 'center', maxWidth: '760px', margin: '0 auto' } }, NAMES.map((n, i) => h('span', { style: { fontSize: '24px', fontFamily: RF, background: i === 8 ? '#111' : '#f1f1f1', color: i === 8 ? '#fff' : '#111', padding: '3px 8px', borderRadius: '4px' } }, n)));
  const big = h('div', { contentEditable: true, style: { fontFamily: RF, fontSize: '120px', textAlign: 'center', outline: 'none', lineHeight: 1, margin: '30px 0' } }, 'Gravity');
  const code = codebox(() => `font-variation-settings: ${fvs(a)};`);
  const sls = {};
  const draw = () => { big.style.fontVariationSettings = fvs(a); stage.querySelectorAll('span').forEach((e) => (e.style.fontVariationSettings = fvs(a))); code.update(); };
  const loop = () => { if (anim) { t += 0.02; a.wght = 550 + Math.sin(t) * 450; a.wdth = 88 + Math.sin(t * 0.7) * 60; sls.wght.set(a.wght); sls.wdth.set(a.wdth); } requestAnimationFrame(loop); }; loop();
  const left = panel('Axes', ...Object.entries(AX).map(([k, [mn, mx, d]]) => (sls[k] = slider(k, mn, mx, d, 1, (v) => { a[k] = v; draw(); }))), btn('▶ Animate', (e) => { anim = !anim; e.target.textContent = anim ? '■ Stop' : '▶ Animate'; }, 'pri'), code, btn('Copy CSS', () => copy(code.textContent)));
  Object.assign(left.style, { position: 'absolute', right: '10px', top: '10px', width: '260px', bottom: '10px' });
  root.append(h('div', { style: { position: 'absolute', left: 0, right: '280px', top: '60px' } }, h('div', { style: { textAlign: 'center', fontSize: '22px' } }, 'Drop or ', h('u', {}, 'Open'), ' your font to get started'), big, stage), left);
  draw();
  window.__demoProof = async () => { sls.wght.set(820); sls.wdth.set(130); return 'wght 820 / wdth 130 applied'; };
};
V['axis-praxis-specimen-desk'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', panel: '#fff', ac: '#e51d1d', dark: false });
  const a = { wght: 800, wdth: 100, opsz: 72, GRAD: 0 }; let size = 52, lh = 1.1;
  const FONTS = ['Roboto Flex', 'Fraunces', 'IBM Plex', 'Amstelvar', 'Avenir Next', 'Bitcount', 'Bree', 'Buffalo Gal', 'Compressa', 'Decovar', 'Dunbar', 'Gingham', 'Kairos Sans', 'Leitura News', 'Mutator Sans', 'Nitti Grotesk'];
  let fam = FR;
  const spec = h('div', { contentEditable: true, style: { outline: 'none', textAlign: 'center', fontFamily: fam } }, 'Axis-Praxis is a website for playing with OpenType Variable Fonts');
  const spec2 = h('div', { contentEditable: true, style: { outline: 'none', color: '#fff', background: '#e51d1d', padding: '12px', fontFamily: FR, fontStyle: 'italic', marginTop: '20px', fontSize: '30px', lineHeight: 1.3 } }, 'Font makers can try out their own variable fonts. Just drag and drop a TTF onto the right panel.');
  const out = h('pre.k-code');
  const draw = () => { Object.assign(spec.style, { fontSize: size + 'px', lineHeight: lh, fontVariationSettings: fvs(a), fontFamily: fam }); out.textContent = `font-family: ${fam.split(',')[0]};\nfont-size: ${size}px;\nline-height: ${lh};\nfont-variation-settings: ${fvs(a)};`; };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '200px 1fr 250px'; root.style.gridTemplateRows = '64px 1fr';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', borderBottom: '1px solid #ddd', padding: '0 20px', gap: '30px' } }, h('b', { style: { font: '400 26px Georgia,serif', letterSpacing: '.02em' } }, 'AXISPRAXIS'), 'playground', 'blog', 'resources', 'donate'),
    h('div', { style: { padding: '14px', fontSize: '15px', color: '#8a8a8a', display: 'grid', gap: '4px', alignContent: 'start' } }, h('b', { style: { color: '#111' } }, 'Introduction'), h('div.k-h', {}, 'Specimens'), ...FONTS.map((f, i) => h('div', { style: { cursor: 'pointer', color: i < 2 ? '#111' : '' }, onclick: () => { fam = i === 1 ? FR : RF; draw(); } }, f))),
    h('div', { style: { padding: '40px', overflow: 'hidden' } }, spec, spec2),
    panel('Typography', slider('Size', 12, 120, size, 1, (v) => { size = v; draw(); }), slider('Line height', 0.8, 2, lh, 0.05, (v) => { lh = v; draw(); }), h('div.k-h', {}, 'Variations'), ...Object.keys(a).map((k) => slider(k, AX[k][0], AX[k][1], a[k], 1, (v) => { a[k] = v; draw(); })), h('div.k-h', {}, 'CSS'), out));
  draw();
  window.__demoProof = async () => { a.wght = 900; a.opsz = 144; draw(); return 'wght 900 / opsz 144 on editable specimen'; };
};
V['cursor-magnet-variable-font-field'] = (root, T) => {
  theme(root, T, { bg: '#3a0ca3', fg: '#fff', panel: '#2b0a78', ac: '#f72585', dark: true });
  root.style.background = 'radial-gradient(120% 100% at 30% 0%,#4c16b8,#2a0a73)';
  let spread = 220, maxW = 900, mode = 'char'; const pos = { x: -999, y: -999 };
  const line = (t, sz, it) => h('div', { style: { fontFamily: FR, fontSize: sz + 'px', lineHeight: 1.02, fontStyle: it ? 'italic' : '' } }, ...t.split('').map((c) => h('span.mg', {}, c)));
  const block = h('div', { style: { position: 'absolute', left: '90px', top: '120px', right: '90px' } }, h('div', { style: { fontSize: '12px', letterSpacing: '.2em', opacity: .6, marginBottom: '14px' } }, 'CURSOR PROXIMITY · VARIABLE AXES'), line('Per-word axis', 118), line('variation.', 118, true), h('p', { style: { maxWidth: '640px', opacity: .8, lineHeight: 1.6, fontSize: '16px', marginTop: '26px' } }, 'Move the cursor across the text: each character is attracted toward heavier weight and wider width depending on its distance to the pointer.'));
  const upd = () => block.querySelectorAll('.mg').forEach((sp) => { const r = sp.getBoundingClientRect(); const d = Math.hypot(r.left + r.width / 2 - pos.x, r.top + r.height / 2 - pos.y); const k = clamp(1 - d / spread, 0, 1); sp.style.fontVariationSettings = `"wght" ${150 + k * (maxW - 150)}, "opsz" 144, "SOFT" ${k*100}`; sp.style.color = k > 0.5 ? '#ffd6f0' : ''; });
  root.addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; upd(); });
  const ctl = h('div.k-row', { style: { position: 'absolute', left: '90px', bottom: '40px', gap: '20px' } }, seg([['char', 'Per char'], ['word', 'Per word']], mode, (v) => (mode = v)), h('div', { style: { width: '180px' } }, slider('Spread', 60, 500, spread, 10, (v) => { spread = v; upd(); })), h('div', { style: { width: '180px' } }, slider('Max weight', 300, 1000, maxW, 10, (v) => { maxW = v; upd(); })));
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '50px', padding: '0 30px', borderBottom: '1px solid #ffffff22' } }, h('b', {}, 'Magnet Type-ish'), h('span', { style: { flex: 1 } }), 'Specimen', 'About'), block, ctl);
  upd();
  window.__demoProof = async () => { const r = block.getBoundingClientRect(); pos.x = r.left + 360; pos.y = r.top + 120; upd(); return 'cursor at "axis" → local weight/width bloom'; };
};
V['variable-font-physics-stage'] = (root, T) => {
  theme(root, T, { bg: '#1a1a1a', fg: '#ddd', panel: '#222', ac: '#fff', acfg: '#000', dark: true });
  const stage = h('div', { style: { position: 'absolute', left: '280px', top: '20px', right: '20px', bottom: '20px', background: '#000', overflow: 'hidden', borderRadius: '4px' } });
  let text = 'type today', force = 'gravity', G = 0.5; let bodies = [];
  const build = () => { stage.replaceChildren(); bodies = text.split('').filter((c) => c !== ' ').map((c, i) => { const el = h('div', { style: { position: 'absolute', width: '110px', height: '110px', borderRadius: '50%', background: '#fff', color: '#000', display: 'grid', placeItems: 'center', fontFamily: RF, fontSize: '80px', fontVariationSettings: '"wght" 900' } }, c); stage.append(el); return { el, x: 120 + (i % 5) * 150, y: 60 + Math.floor(i / 5) * 140, vx: (Math.random() - 0.5) * 6, vy: 0, a: 0, va: (Math.random() - 0.5) * 0.1 }; }); };
  const step = () => { const W = stage.clientWidth, H = stage.clientHeight; for (const b of bodies) { if (force === 'gravity') b.vy += G; if (force === 'vortex') { const dx = b.x - W / 2, dy = b.y - H / 2; b.vx += -dy * 0.002 - dx * 0.001; b.vy += dx * 0.002 - dy * 0.001; } if (force === 'attract') { b.vx += (W / 2 - b.x) * 0.002; b.vy += (H / 2 - b.y) * 0.002; } b.x += b.vx; b.y += b.vy; b.a += b.va; if (b.y > H - 55) { b.y = H - 55; b.vy *= -0.6; b.vx *= 0.95; } if (b.y < 55) { b.y = 55; b.vy *= -0.6; } if (b.x < 55 || b.x > W - 55) { b.x = clamp(b.x, 55, W - 55); b.vx *= -0.7; } for (const o of bodies) if (o !== b) { const dx = o.x - b.x, dy = o.y - b.y, d = Math.hypot(dx, dy); if (d < 110 && d > 0) { const p = (110 - d) / 2; b.x -= (dx / d) * p; b.y -= (dy / d) * p; } } const sp = Math.min(1, Math.hypot(b.vx, b.vy) / 12); b.el.style.transform = `translate(${b.x - 55}px,${b.y - 55}px) rotate(${b.a}rad)`; b.el.style.fontVariationSettings = `"wght" ${900 - sp * 700}, "wdth" ${100 + sp * 50}`; } requestAnimationFrame(step); };
  root.append(panel('Type Physics', h('input', { value: text, oninput: (e) => { text = e.target.value; build(); }, style: { padding: '8px', background: '#111', color: '#fff', border: '1px solid #333' } }), h('div.k-h', {}, 'Layout presets'), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' } }, ['Circles', 'Stack', 'Scatter', 'Line'].map((p) => btn(p, build))), h('div.k-h', {}, 'Force'), seg(['gravity', 'vortex', 'attract'], force, (v) => (force = v)), slider('Gravity', 0, 1.5, G, 0.05, (v) => (G = v)), btn('Shake', () => bodies.forEach((b) => { b.vx += (Math.random() - 0.5) * 30; b.vy -= Math.random() * 20; }), 'pri'), btn('Export PNG', () => toast('type-physics.png'))), stage);
  root.lastChild.previousSibling.style.cssText += 'position:absolute;left:20px;top:20px;bottom:20px;width:240px';
  build(); requestAnimationFrame(step);
  window.__demoProof = async () => { await sleep(800); return 'letters fell under gravity with axis-by-speed'; };
};
V['dom-text-surface-wrap'] = (root, T) => {
  theme(root, T, { bg: '#4a1fb8', fg: '#fff', ac: '#fff', acfg: '#4a1fb8', dark: true });
  let shape = 'sphere', rx = -15, ry = 0, auto = true;
  const world = h('div', { style: { position: 'absolute', right: '12%', top: '50%', width: '0', height: '0', transformStyle: 'preserve-3d' } });
  const scene3 = h('div', { style: { position: 'absolute', inset: 0, perspective: '900px' } }, world);
  const TXT = 'TEXT ON A SURFACE · STILL REAL DOM · SELECTABLE · ';
  const build = () => { world.replaceChildren(); const rows = shape === 'cylinder' ? 7 : 9; for (let r = 0; r < rows; r++) { const n = shape === 'sphere' ? Math.max(6, Math.round(28 * Math.sin(((r + 0.5) / rows) * Math.PI))) : 28; const lat = ((r + 0.5) / rows - 0.5) * Math.PI; for (let i = 0; i < n; i++) { const lon = (i / n) * 360; const R = 200; const ch = TXT[(r * 7 + i) % TXT.length]; let tr; if (shape === 'sphere') tr = `rotateY(${lon}deg) rotateX(${(-lat * 180) / Math.PI}deg) translateZ(${R}px)`; else if (shape === 'cylinder') tr = `translateY(${(r - rows / 2) * 36}px) rotateY(${lon}deg) translateZ(${R}px)`; else tr = `rotateY(${lon}deg) translateX(${150}px) rotateZ(${(r / rows) * 360}deg) translateX(60px)`; world.append(h('span', { style: { position: 'absolute', transform: tr, font: `700 24px ${RF}`, marginLeft: '-8px', marginTop: '-14px', backfaceVisibility: 'visible', color: '#fff' } }, ch)); } } };
  const loop = () => { if (auto) ry += 0.3; world.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; requestAnimationFrame(loop); };
  drag(scene3, { move: (e) => { ry += e.movementX * 0.4; rx -= e.movementY * 0.4; } });
  root.append(scene3, h('div', { style: { position: 'absolute', left: '80px', top: '130px', maxWidth: '520px' } }, h('div', { style: { fontSize: '12px', letterSpacing: '.2em', opacity: .7 } }, 'WRAPTYPE-ISH · CSS 3D'), h('h1', { style: { fontFamily: FR, fontWeight: 400, fontSize: '66px', lineHeight: 1.02, margin: '14px 0' } }, 'Text on a surface, ', h('i', { style: { opacity: .8 } }, 'still real DOM.')), h('p', { style: { opacity: .8, lineHeight: 1.6 } }, 'Every glyph is a span transformed onto a sphere, cylinder or torus. Drag to orbit.'), h('div.k-row', {}, seg(['sphere', 'cylinder', 'torus'], shape, (v) => { shape = v; build(); }), toggle('Auto-rotate', true, (v) => (auto = v)))));
  build(); loop();
  window.__demoProof = async () => { shape = 'sphere'; build(); ry = 40; return 'sphere wrap with orbit'; };
};
V['kerning-skill-game'] = (root, T) => {
  theme(root, T, { bg: '#1c2033', fg: '#fff', ac: '#fff', acfg: '#1c2033', dark: true });
  const WORDS = [['WAVE', [0, -38, -44, -8]], ['AVATAR', [0, -40, -22, -30, -12, -6]], ['TYPO', [0, -24, -8, -4]]]; let wi = 0, offs, done = false;
  const word = h('div', { style: { position: 'absolute', left: 0, right: 0, top: '32%', display: 'flex', justifyContent: 'center', font: `900 200px/1 ${RF}`, fontVariationSettings: '"wdth" 120, "wght" 900' } });
  const score = h('div', { style: { position: 'absolute', bottom: '110px', width: '100%', textAlign: 'center', fontSize: '20px' } });
  const load = () => { const [w, ideal] = WORDS[wi]; offs = ideal.map((v, i) => (i === 0 ? 0 : v + (i % 2 ? 40 : -30))); done = false; draw(); score.textContent = ''; };
  const draw = () => { const [w, ideal] = WORDS[wi]; word.replaceChildren(...w.split('').map((c, i) => { const sp = h('span', { style: { position: 'relative', marginLeft: offs[i] + 'px', cursor: i ? 'ew-resize' : 'default', color: done && i ? '#fff' : '#fff', touchAction: 'none' } }, c, done && i ? h('span', { style: { position: 'absolute', left: ideal[i] - offs[i] + 'px', top: 0, color: '#ff4d6d55', pointerEvents: 'none' } }, c) : null); if (i) { let x0, o0; drag(sp, { start: (e) => { x0 = e.clientX; o0 = offs[i]; }, move: (e) => { if (done) return; offs[i] = Math.round(o0 + (e.clientX - x0)); sp.style.marginLeft = offs[i] + 'px'; } }); } return sp; })); };
  const check = () => { const [, ideal] = WORDS[wi]; const err = offs.reduce((s2, v, i) => s2 + Math.abs(v - ideal[i]), 0); const sc = Math.max(0, Math.round(100 - err / 2)); done = true; draw(); score.textContent = `Score ${sc} / 100 — red ghost = typographer's solution`; };
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '60px', padding: '0 40px' } }, h('b', { style: { letterSpacing: '.3em' } }, 'KERNTYPE-ISH'), h('span', { style: { flex: 1 } }), `Word ${wi + 1}/3`), word, score, h('div.k-row', { style: { position: 'absolute', bottom: '40px', left: 0, right: 0, justifyContent: 'center', gap: '12px' } }, btn('Reset', load), h('button', { style: { background: '#fff', color: '#1c2033', border: 0, padding: '12px 28px', borderRadius: '6px', font: `700 20px ${FR}` }, onclick: () => (done ? (wi = (wi + 1) % 3, load()) : check()) }, 'Done')), h('div', { style: { position: 'absolute', left: '40px', bottom: '40px', fontSize: '13px', opacity: .6, lineHeight: 1.6 } }, 'Drag letters horizontally', h('br'), 'to balance the spacing.'));
  load();
  window.__demoProof = async () => { offs = [0, -30, -40, -12]; draw(); check(); return 'adjusted kerning → score revealed with ghost'; };
};
V['metaflop-metafont-modulator'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#e8f7d9', ac: '#5aa02c', dark: false });
  const P = { unit: 1, pen: 30, height: 1, ascender: 0.2, contrast: 0.4, round: 0.6, slant: 0, aperture: 0.5 };
  const glyphs = { A: 'M10 100L50 0L90 100M25 62H75', B: 'M15 0V100M15 0H60Q85 0 85 25Q85 48 60 50H15M60 50Q90 52 90 76Q90 100 60 100H15', C: 'M85 20Q70 0 50 0Q10 0 10 50Q10 100 50 100Q70 100 85 80', D: 'M15 0V100H50Q90 100 90 50Q90 0 50 0Z', E: 'M85 0H15V100H85M15 50H70', F: 'M85 0H15V100M15 50H70', G: 'M85 20Q70 0 50 0Q10 0 10 50Q10 100 50 100Q88 100 88 60H55', H: 'M15 0V100M85 0V100M15 50H85', I: 'M50 0V100', J: 'M70 0V70Q70 100 45 100Q20 100 18 80', K: 'M15 0V100M85 0L15 60M40 42L88 100', L: 'M15 0V100H85', M: 'M10 100V0L50 60L90 0V100', N: 'M15 100V0L85 100V0', O: 'M50 0Q10 0 10 50Q10 100 50 100Q90 100 90 50Q90 0 50 0Z', R: 'M15 100V0H60Q88 0 88 27Q88 54 60 54H15M55 54L88 100', S: 'M82 18Q70 0 48 0Q15 0 15 26Q15 48 50 52Q85 56 85 78Q85 100 50 100Q24 100 12 80', T: 'M10 0H90M50 0V100', U: 'M15 0V65Q15 100 50 100Q85 100 85 65V0', V: 'M10 0L50 100L90 0', W: 'M5 0L28 100L50 30L72 100L95 0', X: 'M12 0L88 100M88 0L12 100', Y: 'M10 0L50 55L90 0M50 55V100', Z: 'M12 0H88L12 100H88' };
  const G = (ch, size) => { const w = 100 * P.unit, hh = 100 * P.height; return s('svg', { viewBox: `-15 -15 ${w + 30} ${hh + 30}`, width: size * P.unit, height: size }, s('path', { d: glyphs[ch] || glyphs.A, transform: `scale(${P.unit} ${P.height}) skewX(${-P.slant})`, fill: 'none', stroke: '#222', 'stroke-width': P.pen / (1 + P.contrast), 'stroke-linecap': P.round > 0.5 ? 'round' : 'butt', 'stroke-linejoin': P.round > 0.5 ? 'round' : 'miter', 'vector-effect': 'none' })); };
  const big = h('div', { style: { display: 'grid', placeItems: 'center', background: '#fff', border: '1px solid #bfe3a3', height: '260px' } }), chart = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: '8px', background: '#fff', border: '1px solid #bfe3a3', padding: '10px' } }), tw = h('div', { style: { background: '#e8f7d9', padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '2px' } });
  const draw = () => { big.replaceChildren(G('A', 200)); chart.replaceChildren(...Object.keys(glyphs).map((c) => G(c, 34))); tw.replaceChildren(...'FONT DESIGN IS FUN'.split('').map((c) => (c === ' ' ? h('span', { style: { width: '20px' } }) : G(c, 40)))); };
  const grp = (t, keys) => h('div', { style: { borderTop: '1px solid #bfe3a3', paddingTop: '6px' } }, h('div', { style: { fontWeight: 700, fontSize: '12px' } }, t), ...keys.map(([k, mn, mx, st]) => slider(k, mn, mx, P[k], st, (v) => { P[k] = v; draw(); })));
  root.style.display = 'grid'; root.style.gridTemplateColumns = '260px 1fr'; root.style.gap = '14px'; root.style.padding = '14px'; root.style.fontFamily = 'Courier New,monospace';
  root.append(h('div', { style: { background: '#e8f7d9', padding: '10px', display: 'grid', gap: '6px', alignContent: 'start', overflow: 'auto' } }, h('b', {}, 'metaflop-ish · modulator'), grp('Dimension', [['unit', 0.6, 1.6, 0.02], ['height', 0.6, 1.5, 0.02], ['ascender', 0, 0.5, 0.01]]), grp('Proportion', [['pen', 4, 60, 1], ['contrast', 0, 2, 0.05]]), grp('Shape', [['round', 0, 1, 0.05], ['aperture', 0, 1, 0.05]]), grp('Optical', [['slant', -20, 20, 1]]), h('div.k-row', {}, btn('OTF', () => toast('font.otf (stub)'), 'pri'), btn('Webfont', () => toast('webfont kit (stub)')))), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gridTemplateRows: 'auto auto', gap: '14px', alignContent: 'start' } }, big, chart, h('div', { style: { gridColumn: '1/-1' } }, tw)));
  draw();
  window.__demoProof = async () => { P.pen = 38; P.slant = 8; draw(); return 'pen width 38, slant 8 → glyphs regenerated'; };
};
V['liquid-type-motion-toy'] = (root, T) => {
  theme(root, T, { bg: '#f7f7fb', fg: '#1a1a2e', ac: '#6c4dff', dark: false });
  const W = 760, H = 360; const cv = h('canvas', { width: W, height: H, style: { width: W + 'px', height: H + 'px', borderRadius: '14px', background: '#101018', cursor: 'crosshair' } });
  const src = document.createElement('canvas'); src.width = W; src.height = H; let word = 'liquid';
  const P = { visc: 0.92, wave: 6, drip: 0.3 };
  const field = new Float32Array((W / 8) * (H / 8) * 2);
  const paintSrc = () => { const g = src.getContext('2d'); g.clearRect(0, 0, W, H); g.fillStyle = '#e8e6ff'; g.font = `900 170px ${RF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(word, W / 2, H / 2); };
  let t = 0; const g = cv.getContext('2d'); const cw = W / 8;
  const frame = () => { t += 0.03; for (let i = 0; i < field.length; i++) field[i] *= P.visc; g.fillStyle = '#101018'; g.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 4) { const row = Math.floor(y / 8) * cw; for (let x = 0; x < W; x += 8) { const k = (row + Math.floor(x / 8)) * 2; const dx = field[k] + Math.sin(y / 30 + t) * P.wave * 0.4, dy = field[k + 1] + P.drip * (y / H) * 6; g.drawImage(src, x, y, 8, 4, x + dx, y + dy, 8, 4); } } requestAnimationFrame(frame); };
  cv.addEventListener('pointermove', (e) => { const p = localPos(e, cv); const cx = Math.floor(p.x / 8), cy = Math.floor(p.y / 8); for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) { const X = cx + x, Y = cy + y; if (X < 0 || Y < 0 || X >= cw || Y >= H / 8) continue; const k = (Y * cw + X) * 2; const f = 1 - Math.hypot(x, y) / 6; if (f > 0) { field[k] += e.movementX * f * 0.8; field[k + 1] += e.movementY * f * 0.8; } } });
  root.append(h('div.k-row', { style: { height: '54px', padding: '0 40px', gap: '22px', fontSize: '13px' } }, h('b', {}, '◉ workaholic-ish'), 'Products', 'Services', 'Tools', h('span', { style: { flex: 1 } }), btn('Get started', () => {}, 'pri')), h('div', { style: { textAlign: 'center', marginTop: '10px' } }, h('div', { style: { fontSize: '40px' } }, '💧'), h('div', { style: { font: '800 40px Inter Variable' } }, 'Liquid Type'), h('div', { style: { opacity: .6, margin: '6px 0 16px' } }, 'Type a word, stir it with your cursor and export the motion.'), cv, h('div.k-row', { style: { justifyContent: 'center', marginTop: '12px', gap: '16px' } }, h('input', { value: word, oninput: (e) => { word = e.target.value || ' '; paintSrc(); }, style: { padding: '8px', width: '140px' } }), h('div', { style: { width: '140px' } }, slider('Viscosity', 0.8, 0.99, P.visc, 0.01, (v) => (P.visc = v))), h('div', { style: { width: '140px' } }, slider('Wave', 0, 20, P.wave, 1, (v) => (P.wave = v))), h('div', { style: { width: '140px' } }, slider('Drip', 0, 2, P.drip, 0.05, (v) => (P.drip = v))), btn('● WebM', () => toast('Recording 3s webm (demo)')), btn('PNG', () => { const a = h('a', { download: 'liquid.png', href: cv.toDataURL() }); a.click(); }))));
  paintSrc(); frame();
  window.__demoProof = async () => { for (let i = 0; i < 30; i++) cv.dispatchEvent(new PointerEvent('pointermove', { clientX: cv.getBoundingClientRect().left + 200 + i * 12, clientY: cv.getBoundingClientRect().top + 170 + Math.sin(i / 3) * 40, movementX: 12, movementY: Math.cos(i / 3) * 12 })); await sleep(300); return 'stirred the word with cursor'; };
};
V['pretext-dragon-chase-reflow'] = (root, T) => {
  theme(root, T, { bg: '#f1eefb', fg: '#2c2745', panel: '#fff', ac: '#8b5cf6', dark: false });
  const P = { size: 15, width: 1100, dark: false };
  const TEXT = 'Typography on the web has always been constrained by the DOM’s layout model. Every line you read is the result of a browser deciding where text should break, how wide a column should be, and what happens when content meets an obstacle. This experiment computes line breaks in JavaScript and lets a chasing dragon of glowing orbs carve a path through the paragraph in real time, so every line reflows around it at sixty frames per second. '.repeat(6);
  const txt = h('div', { style: { position: 'absolute', left: '60px', top: '70px' } }); const orbs = Array.from({ length: 9 }, (_, i) => h('div', { style: { position: 'absolute', width: 40 - i * 3 + 'px', height: 40 - i * 3 + 'px', borderRadius: '50%', background: `radial-gradient(circle,#c084fc,#8b5cf6 60%,transparent 70%)`, boxShadow: '0 0 30px #a855f7', pointerEvents: 'none', transform: 'translate(-50%,-50%)' } }));
  const hud = h('div', { style: { position: 'absolute', right: '20px', top: '60px', background: '#fff', padding: '10px 14px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '12px', boxShadow: '0 4px 20px #0001' } });
  const chain = orbs.map(() => ({ x: 400, y: 300 })); let target = { x: 500, y: 300 }, t = 0, auto = true;
  const words = TEXT.split(' ');
  const ctx = document.createElement('canvas').getContext('2d');
  const layout = () => { ctx.font = `${P.size}px Georgia`; const lh = P.size * 1.55; const lines = []; let y = 0, i = 0, displaced = 0; while (i < words.length && y < 760) { const cy = 70 + y + lh / 2; let x0 = 0, x1 = P.width; for (const c of chain.slice(0, 5)) { if (Math.abs(c.y - cy) < 42) { const cx = c.x - 60; if (cx > x0 && cx < x1) { if (cx < P.width / 2) x0 = Math.max(x0, cx + 50); else x1 = Math.min(x1, cx - 50); } } } if (x0 > 0 || x1 < P.width) displaced++; let line = '', w = 0; while (i < words.length) { const ww = ctx.measureText(words[i] + ' ').width; if (w + ww > x1 - x0) break; line += words[i] + ' '; w += ww; i++; } lines.push(h('div', { style: { position: 'absolute', left: x0 + 'px', top: y + 'px', whiteSpace: 'nowrap', font: `${P.size}px/1 Georgia,serif`, color: x0 > 0 || x1 < P.width ? '#7c3aed' : '' } }, line)); y += lh; } txt.replaceChildren(...lines); hud.textContent = `lines ${lines.length} · displaced ${displaced}`; };
  const loop = () => { t += 0.015; if (auto) target = { x: 560 + Math.cos(t) * 420, y: 380 + Math.sin(t * 1.7) * 260 }; chain.forEach((c, i) => { const p = i ? chain[i - 1] : target; c.x += (p.x - c.x) * 0.25; c.y += (p.y - c.y) * 0.25; Object.assign(orbs[i].style, { left: c.x + 'px', top: c.y + 'px' }); }); layout(); requestAnimationFrame(loop); };
  root.addEventListener('pointermove', (e) => { const p = localPos(e, root); target = p; auto = false; });
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '48px', padding: '0 20px', gap: '16px', background: '#fff', zIndex: 2 } }, h('b', {}, 'Pretext-ish · Dragon Chase'), h('span', { style: { flex: 1 } }), h('div', { style: { width: '150px' } }, slider('Font', 11, 22, P.size, 1, (v) => (P.size = v))), h('div', { style: { width: '150px' } }, slider('Width', 500, 1300, P.width, 10, (v) => (P.width = v))), btn('Theme ◐', () => { P.dark = !P.dark; root.style.background = P.dark ? '#16131f' : '#f1eefb'; root.style.color = P.dark ? '#e9e5ff' : '#2c2745'; })), txt, ...orbs, hud);
  loop();
  window.__demoProof = async () => { await sleep(600); return 'orb chain displacing lines live'; };
};
V['font-pair-studio'] = (root, T) => {
  theme(root, T, { bg: '#111', fg: '#eee', ac: '#fff', acfg: '#111', dark: true });
  const FONTS = [["'Fraunces Variable'", 'Fraunces'], [RF, 'Roboto Flex'], ["'Inter Variable'", 'Inter'], ['Georgia,serif', 'Georgia'], ["'JetBrains Mono Variable'", 'JetBrains Mono'], ['"Times New Roman",serif', 'Times'], ['Verdana,sans-serif', 'Verdana']];
  const roles = [{ f: 0, lock: false, w: 700 }, { f: 1, lock: false, w: 400 }, { f: 2, lock: false, w: 400 }];
  const spec = h('div', { style: { maxWidth: '640px' } });
  const draw = () => { const [a, b, c] = roles.map((r) => FONTS[r.f]); spec.replaceChildren(...[[a, 'Font pairing made simple', 44, roles[0].w], [b, 'Generate font combinations with deep learning', 22, 300], [c, 'Fontjoy helps designers choose the best font pairings. Click on the fonts to change them, lock the ones you like and generate new combinations. Edit any text to preview your content.', 16, 400]].map(([f, t, sz, w], i) => h('div', { style: { position: 'relative', margin: '0 0 22px' } }, h('div', { contentEditable: true, style: { fontFamily: f[0], fontSize: sz + 'px', fontWeight: w, fontStyle: i === 1 ? 'italic' : '', outline: 'none', lineHeight: 1.3 } }, t), h('div.k-row', { style: { fontSize: '11px', opacity: .55, marginTop: '4px' } }, h('span', {}, f[1]), h('button', { onclick: () => { roles[i].lock = !roles[i].lock; draw(); }, style: { background: 'none', border: 0, color: 'inherit' } }, roles[i].lock ? '🔒 locked' : '🔓'))))); };
  const gen = () => { roles.forEach((r) => { if (!r.lock) r.f = Math.floor(Math.random() * FONTS.length); }); draw(); };
  root.append(h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '70px', borderRight: '1px solid #222', display: 'grid', alignContent: 'start', gap: '20px', paddingTop: '20px', justifyItems: 'center' } }, '≡', '⟳', '♥'), h('div', { style: { position: 'absolute', left: '120px', top: '40px' } }, h('div.k-row', { style: { marginBottom: '50px' } }, h('button', { style: { background: '#fff', color: '#111', border: 0, borderRadius: '99px', padding: '10px 22px', fontWeight: 700 }, onclick: gen }, 'Generate'), h('span', { style: { opacity: .6, fontSize: '13px' } }, 'or press spacebar'), h('div', { style: { width: '160px', marginLeft: '20px' } }, slider('Contrast', 0, 1, 0.5, 0.05, () => {}))), spec), h('div', { style: { position: 'absolute', left: '120px', bottom: '30px', fontSize: '12px', opacity: .5 } }, 'Share · Edit mode · Export CSS'));
  window.addEventListener('keydown', (e) => { if (e.code === 'Space' && document.activeElement === document.body) { e.preventDefault(); gen(); } });
  draw();
  window.__demoProof = async () => { roles[0].lock = true; gen(); return 'locked heading, regenerated body pair'; };
};
V['pretextjs-reflow-playground'] = (root, T) => {
  theme(root, T, { bg: '#faf8ff', fg: '#1e1b2e', panel: '#ffffff', ac: '#7c3aed', dark: false });
  const SAMPLE = 'Pretext measures how text will wrap before the browser paints it. Drag the width, change the font size, and watch lineCount and height update as the paragraph reflows. In variable-width mode an obstacle steals space and every line bends around it in real time — the same idea as computing line breaks in JavaScript instead of waiting on layout.';
  const P = { text: SAMPLE, size: 17, width: 520, mode: 'uniform', prep: 0 };
  const obs = { x: 220, y: 90, r: 70 };
  const mctx = document.createElement('canvas').getContext('2d');
  const preview = h('div', { style: { position: 'relative', background: '#fff', border: '1px solid #e8e0f5', borderRadius: '12px', minHeight: '360px', overflow: 'hidden', boxShadow: '0 8px 28px #7c3aed12' } });
  const linesEl = h('div', { style: { position: 'absolute', left: '20px', top: '20px' } });
  const hud = h('div', { style: { position: 'absolute', right: '14px', top: '14px', font: '12px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace', background: '#1e1b2eee', color: '#e9e5ff', padding: '10px 12px', borderRadius: '10px', minWidth: '160px', boxShadow: '0 8px 24px #0003' } });
  const obstacle = h('div', { style: { position: 'absolute', width: obs.r * 2 + 'px', height: obs.r * 2 + 'px', margin: -obs.r + 'px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#c4b5fd,#7c3aed)', boxShadow: '0 10px 30px #7c3aed55', cursor: 'grab', touchAction: 'none', display: 'none', zIndex: 2 } });
  preview.append(linesEl, obstacle, hud);
  drag(obstacle, { move: (e) => { const q = localPos(e, preview); obs.x = clamp(q.x, 40, Math.max(80, P.width - 20)); obs.y = clamp(q.y, 40, 320); layout(); } });
  const ta = h('textarea', { value: P.text, rows: 6, style: { width: '100%', padding: '10px', border: '1px solid #e0d8f0', borderRadius: '8px', font: '13px/1.5 Georgia,serif', resize: 'vertical', background: '#faf8ff' } });
  ta.oninput = () => { P.text = ta.value; layout(); };
  const metrics = { lines: 0, height: 0 };
  const layout = () => {
    const t0 = performance.now();
    mctx.font = `${P.size}px Georgia`;
    const words = (P.text || ' ').split(/\s+/);
    const lh = P.size * 1.55;
    const maxW = P.width;
    const lines = [];
    let i = 0, y = 0;
    const band = (cy) => {
      if (P.mode !== 'variable') return [0, maxW];
      const dy = Math.abs(cy - obs.y);
      if (dy >= obs.r + 8) return [0, maxW];
      const half = Math.sqrt(Math.max(0, (obs.r + 8) ** 2 - dy ** 2));
      const L = obs.x - half, R = obs.x + half;
      // prefer keeping left band if obstacle is on the right half
      if (L > maxW * 0.35) return [0, Math.max(40, L - 8)];
      return [Math.min(maxW - 40, R + 8), maxW];
    };
    while (i < words.length && y < 520) {
      const cy = 20 + y + lh / 2;
      let [x0, x1] = band(cy);
      if (P.mode === 'ranges') {
        // alternating width bands for "line ranges" demo
        const bandW = maxW * (0.55 + 0.35 * ((Math.floor(y / lh) % 3) / 2));
        x0 = 0; x1 = bandW;
      }
      let line = '', w = 0;
      while (i < words.length) {
        const ww = mctx.measureText(words[i] + ' ').width;
        if (w + ww > Math.max(20, x1 - x0) && line) break;
        line += words[i] + ' '; w += ww; i++;
      }
      if (!line && i < words.length) { line = words[i++] + ' '; }
      const muted = P.mode === 'ranges' && (Math.floor(y / lh) % 3) === 2;
      lines.push(h('div', { style: { position: 'absolute', left: (20 + x0) + 'px', top: (20 + y) + 'px', whiteSpace: 'nowrap', font: `${P.size}px/${lh}px Georgia,serif`, color: muted ? '#7c3aed99' : '#1e1b2e', maxWidth: (x1 - x0) + 'px' } }, line.trimEnd()));
      y += lh;
    }
    linesEl.replaceChildren(...lines);
    Object.assign(obstacle.style, { display: P.mode === 'variable' ? '' : 'none', left: obs.x + 'px', top: obs.y + 'px', width: obs.r * 2 + 'px', height: obs.r * 2 + 'px', margin: -obs.r + 'px' });
    preview.style.width = (maxW + 40) + 'px';
    metrics.lines = lines.length; metrics.height = Math.round(y);
    P.prep = Math.max(0.1, performance.now() - t0);
    hud.replaceChildren(
      h('div', { style: { opacity: .55, fontSize: '10px', letterSpacing: '.08em' } }, 'PRETEXT · MEASURE'),
      h('div', {}, 'lineCount  ', h('b', { style: { color: '#c4b5fd' } }, String(metrics.lines))),
      h('div', {}, 'height     ', h('b', { style: { color: '#c4b5fd' } }, metrics.height + 'px')),
      h('div', {}, 'prepare    ', h('b', { style: { color: '#c4b5fd' } }, P.prep.toFixed(2) + 'ms')),
      h('div', {}, 'width      ', h('b', { style: { color: '#c4b5fd' } }, maxW + 'px')),
      h('div', {}, 'font-size  ', h('b', { style: { color: '#c4b5fd' } }, P.size + 'px')),
    );
  };
  const modeSeg = seg([['uniform', 'Uniform'], ['variable', 'Variable-width'], ['ranges', 'Line ranges']], P.mode, (v) => { P.mode = v; layout(); });
  const left = panel(null,
    h('b', { style: { fontSize: '18px' } }, 'Pretext.js-ish'),
    h('div', { style: { fontSize: '12px', opacity: .6, marginBottom: '6px' } }, 'Text reflow measurement playground'),
    h('div.k-h', {}, 'Sample text'), ta,
    h('div.k-h', {}, 'Mode'), modeSeg,
    slider('Font size', 11, 28, P.size, 1, (v) => { P.size = v; layout(); }, (v) => v + 'px'),
    slider('Container width', 240, 720, P.width, 10, (v) => { P.width = v; layout(); }, (v) => v + 'px'),
    slider('Obstacle radius', 40, 120, obs.r, 2, (v) => { obs.r = v; layout(); }, (v) => v + 'px'),
    btn('Reset sample', () => { ta.value = SAMPLE; P.text = SAMPLE; layout(); }),
  );
  Object.assign(left.style, { borderRadius: '0', border: '0', borderRight: '1px solid #e8e0f5', width: '300px' });
  root.style.display = 'grid'; root.style.gridTemplateColumns = '300px 1fr';
  root.append(left, h('div', { style: { padding: '28px 32px', overflow: 'auto', background: 'linear-gradient(180deg,#faf8ff,#f3efff)' } },
    h('div.k-row', { style: { marginBottom: '16px', gap: '12px' } },
      h('div', { style: { font: '700 22px Georgia,serif' } }, 'playground'),
      h('span', { style: { flex: 1 } }),
      h('span', { style: { font: '12px ui-monospace,monospace', opacity: .5 } }, 'measure → reflow → paint')),
    preview));
  layout();
  window.__demoProof = async () => {
    P.mode = 'variable'; P.size = 18; P.width = 480; obs.x = 260; obs.y = 120;
    modeSeg.buttons?.[1]?.click?.();
    layout();
    await sleep(200);
    return `variable mode · lines ${metrics.lines} · height ${metrics.height}px`;
  };
};
V['alphazet-3d-type-specimen-desk'] = (root, T) => {
  theme(root, T, { bg: '#2a2a2a', fg: '#f4f4f4', panel: '#1c1c1c', ac: '#b8ff3c', dark: true });
  root.style.backgroundImage = 'radial-gradient(#ffffff14 1px, transparent 1px)';
  root.style.backgroundSize = '22px 22px';
  root.style.overflow = 'auto';
  const P = { weight: 700, slant: 0, tracking: 0, text: 'Alphazet', test: 'Interface @16dp 1/4 CPM {!exception:} 1,048 Устройство $ кремний gränssnitt', section: 'mock', talk: 0.35 };
  const specimen = h('div', { contentEditable: true, spellcheck: 'false', style: { fontFamily: RF, fontSize: 'clamp(64px,12vw,140px)', fontWeight: 700, lineHeight: .9, letterSpacing: '-.04em', outline: 'none', textAlign: 'center', margin: '24px 0 8px', color: '#f0f0f0', textShadow: '0 18px 40px #0008' } }, P.text);
  const applyType = () => {
    specimen.style.fontVariationSettings = `"wght" ${P.weight}, "slnt" ${P.slant}`;
    specimen.style.fontWeight = P.weight;
    specimen.style.letterSpacing = (P.tracking / 1000) + 'em';
    testLive.style.fontVariationSettings = `"wght" ${P.weight}, "slnt" ${P.slant}`;
    testLive.style.fontWeight = P.weight;
    testLive.style.letterSpacing = (P.tracking / 1000) + 'em';
    glyphBig.style.fontVariationSettings = `"wght" ${P.weight}`;
    glyphBig.style.fontWeight = P.weight;
    wLab.textContent = String(P.weight);
  };
  const wLab = h('b', { style: { font: '700 13px ui-monospace,monospace', color: '#b8ff3c', minWidth: '36px', textAlign: 'right' } }, '700');
  const weightRail = h('div', { style: { display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'center', background: '#111c', border: '1px solid #ffffff18', borderRadius: '999px', padding: '8px 16px', maxWidth: '560px', margin: '0 auto' } },
    h('span', { style: { fontSize: '11px', opacity: .55, letterSpacing: '.12em' } }, 'WEIGHT'),
    h('input', { type: 'range', min: 100, max: 900, step: 10, value: P.weight, style: { width: '100%', accentColor: '#b8ff3c' }, oninput: (e) => { P.weight = +e.target.value; applyType(); } }),
    wLab);
  // Mock stage — drag text + shape cards
  const stage = h('div', { style: { position: 'relative', height: '280px', borderRadius: '18px', background: 'linear-gradient(145deg,#3a3a3a,#1f1f1f)', border: '1px solid #ffffff14', boxShadow: 'inset 0 1px 0 #fff1, 0 24px 60px #0006', overflow: 'hidden', perspective: '900px' } });
  const mkCard = (label, x, y, style, kind) => {
    const el = h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', cursor: 'grab', touchAction: 'none', userSelect: 'none', ...style } }, label);
    el.dataset.kind = kind;
    drag(el, { move: (e) => { const q = localPos(e, stage); el.style.left = clamp(q.x - 40, 0, stage.clientWidth - 40) + 'px'; el.style.top = clamp(q.y - 20, 0, stage.clientHeight - 40) + 'px'; } });
    stage.append(el); return el;
  };
  const textCard = mkCard('POSTER', 48, 70, { padding: '14px 18px', background: '#fff', color: '#111', font: `800 28px ${RF}`, borderRadius: '10px', boxShadow: '0 16px 40px #0005', transform: 'rotate(-4deg)' }, 'text');
  const shapeCard = mkCard('', 280, 110, { width: '96px', height: '96px', borderRadius: '28px', background: 'linear-gradient(135deg,#b8ff3c,#5cffb0)', boxShadow: '0 18px 40px #b8ff3c44', transform: 'rotate(12deg)' }, 'shape');
  mkCard('Aa', 420, 40, { padding: '10px 16px', background: '#111', color: '#b8ff3c', font: `700 22px ${RF}`, borderRadius: '12px', border: '1px solid #b8ff3c55', transform: 'rotate(6deg)' }, 'text');
  // Test
  const testLive = h('div', { style: { fontFamily: RF, fontSize: '28px', lineHeight: 1.35, minHeight: '120px', padding: '18px 20px', background: '#141414', borderRadius: '14px', border: '1px solid #ffffff14' } }, P.test);
  const testInput = h('textarea', { value: P.test, rows: 3, style: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ffffff22', background: '#0e0e0e', color: '#eee', font: `13px/1.5 ${RF}`, resize: 'vertical', boxSizing: 'border-box' } });
  testInput.oninput = () => { P.test = testInput.value; testLive.textContent = P.test; };
  // Examine — glyph guides
  const glyphWrap = h('div', { style: { position: 'relative', height: '220px', background: '#f6f6f4', color: '#111', borderRadius: '14px', overflow: 'hidden' } });
  const glyphBig = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-46%)', fontFamily: RF, fontSize: '180px', fontWeight: 700, lineHeight: 1, color: '#111' } }, 'A');
  const guide = (top, label, color) => h('div', { style: { position: 'absolute', left: '8%', right: '8%', top, borderTop: `1px dashed ${color}`, pointerEvents: 'none' } },
    h('span', { style: { position: 'absolute', right: 0, top: '-14px', font: '10px/1 ui-monospace,monospace', color, opacity: .85 } }, label));
  glyphWrap.append(glyphBig,
    guide('18%', 'Ascender', '#7c5cff'),
    guide('28%', 'Cap Height', '#ff5c8a'),
    guide('52%', 'X-Height', '#0ea5e9'),
    guide('72%', 'Baseline', '#111'),
    guide('88%', 'Descender', '#94a3b8'));
  // Talk
  const talkMeter = h('div', { style: { height: '10px', borderRadius: '999px', background: '#ffffff14', overflow: 'hidden' } },
    h('div', { style: { height: '100%', width: (P.talk * 100) + '%', background: 'linear-gradient(90deg,#b8ff3c,#5cffb0)', transition: 'width .08s linear' } }));
  const talkFill = talkMeter.firstChild;
  const talkLab = h('div', { style: { font: '12px ui-monospace,monospace', opacity: .7 } }, 'level −6 dB · drives weight + tracking');
  const onTalk = (v) => {
    P.talk = v;
    talkFill.style.width = (v * 100) + '%';
    P.weight = Math.round(clamp(200 + v * 700, 100, 900));
    P.tracking = Math.round((v - 0.35) * 80);
    wRailInput.value = P.weight;
    applyType();
    talkLab.textContent = `level ${(20 * Math.log10(Math.max(0.01, v))).toFixed(1)} dB · weight ${P.weight} · tracking ${P.tracking}`;
  };
  const wRailInput = weightRail.querySelector('input');
  const talkSlider = slider('Voice level', 0, 1, P.talk, 0.01, onTalk, (v) => (v * 100).toFixed(0) + '%');
  // Sections
  const sectionHost = h('div', { style: { display: 'grid', gap: '18px', padding: '0 28px 48px', maxWidth: '960px', margin: '0 auto' } });
  const sec = (id, title, sub, ...kids) => h('section', { id: 'az-' + id, style: { scrollMarginTop: '70px' } },
    h('div.k-row', { style: { marginBottom: '10px', gap: '12px' } },
      h('b', { style: { font: `700 22px ${RF}`, letterSpacing: '-.02em' } }, title),
      h('span', { style: { fontSize: '12px', opacity: .5 } }, sub)),
    ...kids);
  sectionHost.append(
    sec('mock', 'Mock', 'Drag text & shape cards on a soft 3D stage',
      h('div', { style: { fontSize: '13px', opacity: .6, marginBottom: '10px' } }, 'Create your own layout with Text, Shapes and Images.'),
      stage),
    sec('test', 'Test', 'Type & test — live specimen',
      testInput, testLive,
      h('div.k-row', { style: { gap: '8px', flexWrap: 'wrap', marginTop: '8px' } },
        ...['English', 'Cyrillic', 'Greek', 'Symbols'].map((chip) => h('button', { style: { background: '#ffffff10', border: '1px solid #ffffff22', color: '#eee', borderRadius: '999px', padding: '4px 10px', fontSize: '11px' }, onclick: () => {
          const samples = { English: 'The quick brown fox jumps over the lazy dog', Cyrillic: 'Съешь ещё этих мягких французских булок', Greek: 'Γαζέες καὶ μυρτιὲς δὲν θὰ βρῶ', Symbols: '© ® ™ € £ ¥ → ← ↑ ↓ ✦' };
          testInput.value = samples[chip]; P.test = samples[chip]; testLive.textContent = P.test;
        } }, chip)))),
    sec('examine', 'Examine', 'Glyph metrics — baseline + x-height guides',
      glyphWrap,
      h('div.k-row', { style: { marginTop: '10px', gap: '8px' } },
        ...['A', 'g', 'R', 'y', 'Ö'].map((gch) => h('button', { style: { width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #ffffff22', background: '#141414', color: '#fff', font: `700 16px ${RF}` }, onclick: () => { glyphBig.textContent = gch; } }, gch)))),
    sec('talk', 'Talk', 'Level slider drives weight / tracking',
      h('div', { style: { background: '#141414', borderRadius: '14px', border: '1px solid #ffffff14', padding: '16px', display: 'grid', gap: '12px' } },
        talkLab, talkMeter, talkSlider,
        h('div', { style: { fontSize: '11px', opacity: .45 } }, 'Mic stub — use the slider (no recording).'))),
  );
  const navBtn = (id, label) => h('button', { style: { background: 'transparent', border: 0, color: '#eee', padding: '8px 12px', fontWeight: 600, fontSize: '13px', opacity: .75 }, onclick: () => {
    P.section = id;
    document.getElementById('az-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } }, label);
  root.append(
    h('div.k-row', { style: { position: 'sticky', top: 0, zIndex: 5, height: '48px', padding: '0 16px', background: '#0e0e0eee', borderBottom: '1px solid #ffffff14', gap: '4px', backdropFilter: 'blur(8px)' } },
      navBtn('mock', 'Mock'), navBtn('test', 'Test'), navBtn('examine', 'Examine'), navBtn('talk', 'Talk'),
      h('span', { style: { flex: 1 } }),
      h('b', { style: { font: `700 14px ${RF}`, letterSpacing: '.04em' } }, 'typeforward-ish'),
      h('span', { style: { flex: 1 } }),
      h('button', { style: { background: '#b8ff3c', color: '#111', border: 0, fontWeight: 800, padding: '7px 14px', borderRadius: '8px' } }, 'Buy Alphazet')),
    h('div', { style: { padding: '36px 28px 12px', textAlign: 'center' } },
      specimen,
      h('div', { style: { fontSize: '14px', opacity: .55, marginBottom: '18px', letterSpacing: '.04em' } }, 'Geometric Sans-Serif Variable Font'),
      weightRail),
    h('div', { style: { background: '#e8e8e4', color: '#111', padding: '28px', marginTop: '28px' } },
      h('div', { style: { font: `800 clamp(28px,6vw,56px)/1.05 ${RF}`, letterSpacing: '-.03em', maxWidth: '960px', margin: '0 auto' } }, 'TALL X-HEIGHT · SHORT ASCENDERS & DESCENDERS · WIDER LETTERFORMS')),
    sectionHost,
  );
  applyType();
  window.__demoProof = async () => {
    P.weight = 820; wRailInput.value = 820; applyType();
    textCard.style.left = '120px'; textCard.style.top = '40px';
    shapeCard.style.left = '340px'; shapeCard.style.top = '90px';
    testInput.value = 'Live type specimen desk'; P.test = testInput.value; testLive.textContent = P.test;
    glyphBig.textContent = 'g';
    onTalk(0.72);
    await sleep(200);
    return `weight ${P.weight}; mock cards dragged; test typed; examine glyph g; talk level drove weight/tracking`;
  };
};
V['wakamai-fondue-opentype-desk'] = (root, T) => {
  theme(root, T, { bg: '#dfd6b3', fg: '#3e3533', panel: '#f4efe0', ac: '#5a7a4a', dark: false });
  const FEATS = [
    ['liga', 'Ligatures'], ['smcp', 'Small Caps'], ['onum', 'Oldstyle Figs'],
    ['tnum', 'Tabular Figs'], ['ss01', 'Stylistic Set 1'], ['kern', 'Kerning'],
  ];
  const AXES = { wght: [100, 1000, 450], wdth: [75, 125, 100], opsz: [8, 144, 72] };
  const state = {
    fontName: '',
    fam: RF,
    feats: new Set(['liga', 'kern']),
    axes: Object.fromEntries(Object.entries(AXES).map(([k, v]) => [k, v[2]])),
    text: 'The quick brown fondue dips over the lazy baguette',
    loaded: false,
  };
  const ffs = () => [...state.feats].map((f) => `"${f}" 1`).join(', ') || 'normal';
  const apply = () => {
    const fvs = Object.entries(state.axes).map(([k, v]) => `"${k}" ${Math.round(v)}`).join(', ');
    [spec, nameLab, glyphGrid].forEach((el) => {
      if (!el) return;
      el.style.fontFamily = state.fam;
      el.style.fontFeatureSettings = ffs();
      el.style.fontVariationSettings = fvs;
    });
    if (glyphGrid) glyphGrid.querySelectorAll('span').forEach((sp) => {
      sp.style.fontFamily = state.fam;
      sp.style.fontFeatureSettings = ffs();
      sp.style.fontVariationSettings = fvs;
    });
    chipHost?.querySelectorAll('[data-f]').forEach((b) => {
      const on = state.feats.has(b.dataset.f);
      b.style.background = on ? '#5a7a4a' : '#fff';
      b.style.color = on ? '#fff' : '#3e3533';
      b.style.borderColor = on ? '#5a7a4a' : '#c4b690';
    });
  };
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let chipHost, glyphGrid, spec, nameLab, desk, land;
  const buildDesk = () => {
    nameLab = h('b', { style: { fontSize: '18px', letterSpacing: '.02em' } }, state.fontName || 'Sample Variable');
    spec = h('div', {
      contentEditable: true, spellcheck: 'false',
      style: {
        outline: 'none', fontSize: 'clamp(36px,6vw,72px)', lineHeight: 1.15, fontWeight: 450,
        padding: '28px 8px', minHeight: '120px', letterSpacing: '-.01em',
      },
    }, state.text);
    spec.oninput = () => { state.text = spec.textContent || ''; };
    chipHost = h('div.k-row', { style: { gap: '8px', flexWrap: 'wrap' } },
      ...FEATS.map(([id, lab]) => h('button', {
        'data-f': id,
        style: {
          border: '1.5px solid #c4b690', borderRadius: '999px', padding: '7px 14px',
          fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: '#fff', color: '#3e3533',
        },
        onclick: () => {
          if (state.feats.has(id)) state.feats.delete(id); else state.feats.add(id);
          apply();
        },
      }, lab)));
    const axisPanel = h('div', { style: { display: 'grid', gap: '10px' } },
      ...Object.entries(AXES).map(([k, [mn, mx, d]]) =>
        slider(k, mn, mx, state.axes[k] ?? d, 1, (v) => { state.axes[k] = v; apply(); })));
    glyphGrid = h('div', {
      style: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(52px,1fr))', gap: '6px',
        maxHeight: '220px', overflow: 'auto', padding: '4px',
      },
    }, ...[...glyphs].map((g) => h('span', {
      style: {
        aspectRatio: '1', display: 'grid', placeItems: 'center', background: '#fff',
        border: '1px solid #ddd4b8', borderRadius: '8px', fontSize: '22px', cursor: 'pointer',
      },
      onclick: () => { spec.textContent = (spec.textContent || '') + g; state.text = spec.textContent; },
    }, g)));
    desk = h('div', {
      style: {
        position: 'absolute', inset: 0, display: 'grid',
        gridTemplateColumns: '1fr 280px', gridTemplateRows: '52px 1fr', background: '#f7f2e4',
      },
    },
      h('div.k-row', {
        style: {
          gridColumn: '1/-1', padding: '0 18px', gap: '14px',
          borderBottom: '1px solid #ddd4b8', background: '#efe9d4',
        },
      },
        h('span', { style: { fontSize: '20px' } }, '🧀'),
        nameLab,
        h('span', { style: { fontSize: '12px', opacity: .55 } }, 'OpenType · Variable'),
        h('span', { style: { flex: 1 } }),
        btn('Change font', () => { state.loaded = false; land.style.display = 'grid'; desk.style.display = 'none'; }, ''),
      ),
      h('div', { style: { padding: '22px 28px', overflow: 'auto', display: 'grid', gap: '18px', alignContent: 'start' } },
        h('div', { style: { fontSize: '11px', letterSpacing: '.12em', opacity: .5, fontWeight: 700 } }, 'SPECIMEN'),
        h('div', { style: { background: '#fff', borderRadius: '16px', border: '1px solid #ddd4b8', boxShadow: '0 10px 40px #834f4114', padding: '8px 22px' } }, spec),
        h('div', { style: { fontSize: '11px', letterSpacing: '.12em', opacity: .5, fontWeight: 700 } }, 'OPENTYPE FEATURES'),
        chipHost,
        h('div', { style: { fontSize: '11px', letterSpacing: '.12em', opacity: .5, fontWeight: 700 } }, 'GLYPH GRID'),
        glyphGrid),
      h('div', {
        style: {
          borderLeft: '1px solid #ddd4b8', background: '#f4efe0', padding: '18px 16px',
          display: 'grid', gap: '14px', alignContent: 'start', overflow: 'auto',
        },
      },
        h('b', { style: { fontSize: '13px' } }, 'Variable axes'),
        axisPanel,
        h('div', { style: { fontSize: '11px', opacity: .5, lineHeight: 1.5 } },
          'font-feature-settings + font-variation-settings applied live to specimen & glyphs.'),
        btn('Reset axes', () => {
          Object.entries(AXES).forEach(([k, v]) => { state.axes[k] = v[2]; });
          desk.querySelectorAll('input[type=range]').forEach((inp, i) => {
            const keys = Object.keys(AXES); if (keys[i]) inp.value = AXES[keys[i]][2];
          });
          apply();
        }, 'pri'),
      ),
    );
    root.append(desk);
    apply();
  };
  const loadSample = () => {
    state.loaded = true;
    state.fontName = 'Roboto Flex Variable';
    state.fam = RF;
    state.feats = new Set(['liga', 'kern']);
    Object.entries(AXES).forEach(([k, v]) => { state.axes[k] = v[2]; });
    if (!desk) buildDesk();
    else { nameLab.textContent = state.fontName; apply(); desk.style.display = 'grid'; }
    land.style.display = 'none';
    toast('Sample font loaded');
  };
  // Landing — fondue drop circle
  const ring = h('div', {
    style: {
      width: 'min(420px,78vw)', aspectRatio: '1', borderRadius: '50%', background: '#e8dfc0',
      boxShadow: '0 24px 80px #3e353355, inset 0 0 0 14px #dfd6b3, inset 0 0 0 18px #bb7e5c55',
      display: 'grid', placeItems: 'center', textAlign: 'center', gap: '10px', padding: '40px',
      position: 'relative',
    },
  },
    h('div', {
      style: {
        position: 'absolute', inset: '-8px', borderRadius: '50%', pointerEvents: 'none',
        background: 'conic-gradient(from 0deg,#834f41 0 33%,#bb7e5c 0 66%,#5a7a4a 0)',
        WebkitMask: 'radial-gradient(farthest-side,transparent calc(100% - 22px),#000 calc(100% - 21px))',
        mask: 'radial-gradient(farthest-side,transparent calc(100% - 22px),#000 calc(100% - 21px))',
        opacity: .85,
      },
    }),
    h('div', { style: { fontSize: '11px', letterSpacing: '.28em', fontWeight: 800, color: '#834f41', zIndex: 1 } }, 'WAKAMAI FONDUE'),
    h('div', { style: { fontSize: '28px', fontWeight: 800, zIndex: 1 } }, 'Drop a font!'),
    btn('Try with Roboto Flex', loadSample, 'pri'),
    h('div', { style: { fontSize: '12px', opacity: .6, zIndex: 1 } }, 'Or pick a sample · no upload needed'),
  );
  ring.querySelector('.k-btn') && Object.assign(ring.querySelector('.k-btn').style, {
    background: '#5a7a4a', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700,
  });
  land = h('div', {
    style: {
      position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
      background: 'radial-gradient(120% 80% at 50% 30%,#c9b896,#8a6a4a 55%,#5c4030)',
    },
  }, ring);
  land.addEventListener('dragover', (e) => e.preventDefault());
  land.addEventListener('drop', (e) => { e.preventDefault(); loadSample(); });
  root.append(land);
  window.__demoProof = async () => {
    loadSample(); await sleep(80);
    state.feats.add('smcp'); state.feats.add('onum'); apply(); await sleep(60);
    state.axes.wght = 820; state.axes.wdth = 110; state.axes.opsz = 96; apply();
    desk.querySelectorAll('input[type=range]').forEach((inp, i) => {
      const vals = [820, 110, 96]; if (vals[i] != null) inp.value = vals[i];
    });
    spec.textContent = 'Fondue typography lab — liga · smcp · axes';
    state.text = spec.textContent;
    await sleep(80);
    return `loaded ${state.fontName}; feats ${[...state.feats].join(',')}; wght ${state.axes.wght}`;
  };
};


V['recursive-five-axis-font-desk'] = (root, T) => {
  theme(root, T, { bg: '#0f1220', fg: '#f4f1ea', panel: '#1a1f33', ac: '#ff6bcb', dark: true, line: '#ffffff18' });
  root.style.overflow = 'auto';
  root.style.fontFamily = "Recursive, 'Recursive Mono Casual Static', ui-sans-serif, system-ui, sans-serif";

  // Load Recursive variable from Google Fonts CDN (five axes)
  if (!document.getElementById('tg-recursive-font')) {
    const link = document.createElement('link');
    link.id = 'tg-recursive-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&display=swap';
    document.head.append(link);
  }

  const a = { MONO: 0, CASL: 0, wght: 700, slnt: 0, CRSV: 0.5 };
  const CRSV_MAP = { off: 0, auto: 0.5, on: 1 };
  let crsvKey = 'auto';
  const sls = {};

  const fvsRec = () => `"MONO" ${a.MONO.toFixed(2)}, "CASL" ${a.CASL.toFixed(2)}, "wght" ${Math.round(a.wght)}, "slnt" ${a.slnt.toFixed(1)}, "CRSV" ${a.CRSV.toFixed(2)}`;
  const cssSnippet = () => `font-family: "Recursive", sans-serif;\nfont-variation-settings: ${fvsRec()};`;

  const hero = h('div', {
    contentEditable: true,
    spellcheck: false,
    style: {
      fontSize: 'clamp(56px, 9vw, 120px)', lineHeight: 0.95, letterSpacing: '-.03em',
      outline: 'none', fontFamily: 'Recursive, sans-serif', fontWeight: 700,
      background: 'linear-gradient(120deg,#fff 20%,#ff6bcb 55%,#7cf0c2)',
      WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      minHeight: '1.1em', margin: '0 0 8px',
    },
  }, 'Recursive');

  const sub = h('div', {
    style: { fontSize: '15px', opacity: .65, maxWidth: '520px', lineHeight: 1.5, marginBottom: '22px' },
  }, 'Five-axis variable font playground — MONO · CASL · wght · slnt · CRSV wired live.');

  const code = codebox(cssSnippet);
  const apply = () => {
    const settings = fvsRec();
    hero.style.fontVariationSettings = settings;
    hero.style.fontFamily = 'Recursive, sans-serif';
    menuDemo.querySelectorAll('[data-item]').forEach((el) => {
      el.style.fontVariationSettings = settings;
      el.style.fontFamily = 'Recursive, sans-serif';
    });
    compare.querySelectorAll('[data-side]').forEach((el) => {
      el.style.fontFamily = 'Recursive, sans-serif';
    });
    code.update();
    axisReadout.textContent = fvsRec();
  };

  const PRESETS = [
    { id: 'linear-sans', lab: 'Linear Sans', v: { MONO: 0, CASL: 0, wght: 500, slnt: 0, CRSV: 0.5 } },
    { id: 'casual-mono', lab: 'Casual Mono', v: { MONO: 1, CASL: 1, wght: 600, slnt: 0, CRSV: 1 } },
    { id: 'extra-black', lab: 'ExtraBlack', v: { MONO: 0, CASL: 0.2, wght: 1000, slnt: 0, CRSV: 0.5 } },
    { id: 'slanted', lab: 'Slanted', v: { MONO: 0, CASL: 0.35, wght: 700, slnt: -12, CRSV: 0.5 } },
    { id: 'soft-casual', lab: 'Soft Casual', v: { MONO: 0, CASL: 1, wght: 450, slnt: -3, CRSV: 1 } },
    { id: 'code-italic', lab: 'Code Italic', v: { MONO: 1, CASL: 0, wght: 480, slnt: -10, CRSV: 0 } },
    { id: 'display', lab: 'Display', v: { MONO: 0, CASL: 0.7, wght: 900, slnt: -6, CRSV: 0.5 } },
    { id: 'neutral', lab: 'Neutral', v: { MONO: 0, CASL: 0, wght: 400, slnt: 0, CRSV: 0.5 } },
  ];

  const setAxes = (v, syncSliders = true) => {
    Object.assign(a, v);
    crsvKey = a.CRSV <= 0.1 ? 'off' : a.CRSV >= 0.9 ? 'on' : 'auto';
    if (syncSliders) {
      sls.MONO?.set(a.MONO);
      sls.CASL?.set(a.CASL);
      sls.wght?.set(a.wght);
      sls.slnt?.set(a.slnt);
      crsvSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent.toLowerCase() === crsvKey));
    }
    presetRow.querySelectorAll('button').forEach((b) => {
      const p = PRESETS.find((x) => x.id === b.dataset.id);
      const match = p && ['MONO', 'CASL', 'wght', 'slnt', 'CRSV'].every((k) => Math.abs(p.v[k] - a[k]) < 0.05);
      b.classList.toggle('on', !!match);
    });
    apply();
  };

  const presetRow = h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } },
    ...PRESETS.map((p) => h('button.k-btn', {
      'data-id': p.id,
      style: { padding: '6px 10px', fontSize: '11px', borderRadius: '999px' },
      onclick: () => setAxes({ ...p.v }),
    }, p.lab)),
  );

  const crsvSeg = seg([['off', 'Off'], ['auto', 'Auto'], ['on', 'On']], 'auto', (v) => {
    crsvKey = v;
    a.CRSV = CRSV_MAP[v];
    apply();
  });

  sls.MONO = slider('MONO', 0, 1, a.MONO, 0.01, (v) => { a.MONO = v; apply(); }, (v) => (+v).toFixed(2));
  sls.CASL = slider('CASL', 0, 1, a.CASL, 0.01, (v) => { a.CASL = v; apply(); }, (v) => (+v).toFixed(2));
  sls.wght = slider('wght', 300, 1000, a.wght, 1, (v) => { a.wght = v; apply(); });
  sls.slnt = slider('slnt', -15, 0, a.slnt, 0.5, (v) => { a.slnt = v; apply(); }, (v) => (+v).toFixed(1));

  const axisReadout = h('div', {
    style: { font: "11px/1.5 'JetBrains Mono Variable',ui-monospace,monospace", opacity: .55, wordBreak: 'break-all' },
  }, fvsRec());

  const menuDemo = h('div', {
    style: {
      background: '#12162a', border: '1px solid #ffffff14', borderRadius: '14px',
      padding: '14px 16px', display: 'grid', gap: '6px', maxWidth: '280px',
    },
  },
    h('div', { style: { fontSize: '11px', opacity: .45, marginBottom: '4px' } }, 'Width-stable menu'),
    ...['Overview', 'Features', 'Pricing', 'Docs'].map((lab) => h('div', {
      'data-item': lab,
      style: {
        padding: '8px 10px', borderRadius: '8px', background: '#ffffff08',
        fontFamily: 'Recursive, sans-serif', fontSize: '14px',
      },
    }, lab)),
    h('div', { style: { fontSize: '10px', opacity: .4, marginTop: '4px' } }, 'Weight changes · mono width holds layout'),
  );

  const compare = h('div', {
    style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  },
    h('div', {
      'data-side': 'lin',
      style: {
        padding: '18px', borderRadius: '14px', background: '#161b30', border: '1px solid #ffffff12',
        fontSize: '28px', lineHeight: 1.15, fontVariationSettings: '"MONO" 0, "CASL" 0, "wght" 700, "slnt" 0, "CRSV" 0.5',
      },
    }, h('div', { style: { fontSize: '11px', opacity: .45, marginBottom: '8px' } }, 'Linear'), 'Sans energy'),
    h('div', {
      'data-side': 'cas',
      style: {
        padding: '18px', borderRadius: '14px', background: '#1c1630', border: '1px solid #ff6bcb33',
        fontSize: '28px', lineHeight: 1.15, fontVariationSettings: '"MONO" 0, "CASL" 1, "wght" 700, "slnt" 0, "CRSV" 1',
      },
    }, h('div', { style: { fontSize: '11px', opacity: .45, marginBottom: '8px' } }, 'Casual'), 'Brush energy'),
  );

  const controls = h('div', {
    style: {
      background: '#151a2e', border: '1px solid #ffffff14', borderRadius: '16px',
      padding: '16px', display: 'grid', gap: '10px',
    },
  },
    h('div.k-h', {}, 'Axes'),
    sls.MONO, sls.CASL, sls.wght, sls.slnt,
    h('div.k-row', {}, h('span', { style: { fontSize: '12px', opacity: .75, width: '54px' } }, 'CRSV'), crsvSeg),
    h('div.k-h', {}, 'Presets'),
    presetRow,
    h('div.k-h', {}, 'CSS'),
    code,
    btn('Copy CSS', () => copy(cssSnippet()), 'pri'),
    axisReadout,
  );

  const stage = h('div', {
    style: {
      minHeight: '100%',
      background: 'radial-gradient(90% 70% at 15% 0%,#2a1a40 0%,#0f1220 45%,#0a1020 100%)',
      padding: '28px 28px 48px',
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.2fr) minmax(280px,360px)',
      gap: '28px',
      alignItems: 'start',
    },
  },
    h('div', {},
      h('div.k-row', { style: { gap: '10px', marginBottom: '18px' } },
        h('b', { style: { fontSize: '13px', letterSpacing: '.12em', textTransform: 'uppercase', opacity: .55 } }, 'Recursive-ish'),
        h('span', { style: { flex: 1 } }),
        h('span', { style: { fontSize: '11px', padding: '4px 10px', borderRadius: '999px', background: '#ff6bcb22', color: '#ff9ad8' } }, '5 axes'),
      ),
      hero, sub,
      compare,
      h('div', { style: { marginTop: '18px' } }, menuDemo),
    ),
    controls,
  );

  root.append(stage);
  apply();

  window.__demoProof = async () => {
    setAxes(PRESETS.find((p) => p.id === 'casual-mono').v);
    await sleep(120);
    setAxes(PRESETS.find((p) => p.id === 'extra-black').v);
    hero.textContent = 'Five Axes';
    await sleep(100);
    await copy(cssSnippet(), 'CSS');
    setAxes(PRESETS.find((p) => p.id === 'linear-sans').v);
    hero.textContent = 'Recursive';
    return '5 axes + presets + copy CSS exercised';
  };
};

V['spacetype-kinetic-type-desk'] = (root, T) => {
  theme(root, T, { bg: '#0a0a0c', fg: '#f2f2f4', panel: '#141418', ac: '#e8ff4a', dark: true, line: '#ffffff14' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter Variable', system-ui, sans-serif";

  const P = { text: 'THIS & THEN', variation: 'coil', speed: 0.55, density: 0.72, scale: 1.05 };
  let rotX = 0.35, rotY = 0.0, dragOn = false, lx = 0, ly = 0, t0 = performance.now();

  const cv = h('canvas', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'grab', touchAction: 'none' } });
  const g = cv.getContext('2d');

  const textInp = h('input', {
    value: P.text,
    style: { width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #ffffff22', background: '#0c0c10', color: '#fff', font: '600 13px Inter Variable' },
    oninput: (e) => { P.text = e.target.value || ' '; },
  });

  const varSeg = seg([['coil', 'Coil'], ['cylinder', 'Cylinder'], ['layers', 'Layers']], P.variation, (v) => { P.variation = v; });
  const speedSl = slider('Speed', 0.05, 1.5, P.speed, 0.01, (v) => { P.speed = v; }, (v) => (+v).toFixed(2));
  const densSl = slider('Density', 0.2, 1.4, P.density, 0.01, (v) => { P.density = v; }, (v) => (+v).toFixed(2));
  const scaleSl = slider('Scale', 0.4, 2.2, P.scale, 0.01, (v) => { P.scale = v; }, (v) => (+v).toFixed(2));

  const fit = () => {
    const r = root.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.max(1, Math.floor(r.width * dpr));
    cv.height = Math.max(1, Math.floor(r.height * dpr));
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { W: r.width, H: r.height };
  };

  const samplePath = (kind, i, n, W, H, phase) => {
    const cx = W * 0.42, cy = H * 0.5;
    const u = i / Math.max(1, n - 1);
    if (kind === 'coil') {
      const turns = 3.2 * P.density;
      const ang = u * Math.PI * 2 * turns + phase;
      const rad = (18 + u * Math.min(W, H) * 0.28) * P.scale;
      return { x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad * 0.55 + Math.sin(phase * 0.7 + u * 4) * 8, a: ang + Math.PI / 2, z: u };
    }
    if (kind === 'cylinder') {
      const bands = Math.max(3, Math.round(5 * P.density));
      const bi = i % bands, bj = Math.floor(i / bands);
      const rows = Math.ceil(n / bands);
      const ang = (bi / bands) * Math.PI * 2 + phase * 0.6;
      const y = cy - (rows * 14 * P.scale) / 2 + bj * 14 * P.scale;
      const rad = Math.min(W, H) * 0.22 * P.scale;
      return { x: cx + Math.cos(ang) * rad, y: y + Math.sin(ang) * 10, a: ang + Math.PI / 2, z: (Math.sin(ang) + 1) / 2 };
    }
    // layers
    const layers = Math.max(2, Math.round(4 * P.density));
    const li = i % layers;
    const along = Math.floor(i / layers) / Math.max(1, Math.ceil(n / layers) - 1);
    const y = cy - (layers - 1) * 28 * P.scale / 2 + li * 28 * P.scale + Math.sin(phase + along * 6) * 6;
    const x = cx - 180 * P.scale + along * 360 * P.scale;
    return { x, y, a: Math.sin(phase * 0.5 + li) * 0.25, z: 1 - li / layers };
  };

  const draw = () => {
    const { W, H } = fit();
    const t = (performance.now() - t0) / 1000 * P.speed;
    g.clearRect(0, 0, W, H);
    const grd = g.createRadialGradient(W * 0.4, H * 0.45, 40, W * 0.4, H * 0.5, Math.max(W, H) * 0.7);
    grd.addColorStop(0, '#1a1a22');
    grd.addColorStop(1, '#050506');
    g.fillStyle = grd;
    g.fillRect(0, 0, W, H);

    // faint grid
    g.strokeStyle = '#ffffff08';
    g.beginPath();
    for (let x = 0; x < W; x += 48) { g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); }
    for (let y = 0; y < H; y += 48) { g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); }
    g.stroke();

    const chars = [...P.text.replace(/\s+/g, ' ')];
    const n = Math.max(chars.length, 1);
    const reps = P.variation === 'coil' ? Math.max(2, Math.round(3 * P.density)) : P.variation === 'cylinder' ? Math.max(2, Math.round(4 * P.density)) : Math.max(2, Math.round(3 * P.density));
    const items = [];
    for (let r = 0; r < reps; r++) {
      for (let i = 0; i < n; i++) {
        const idx = r * n + i;
        const p = samplePath(P.variation, idx, n * reps, W, H, t + rotY + r * 0.4);
        // orbit tilt
        const yy = (p.y - H / 2) * Math.cos(rotX) - (p.z - 0.5) * 80 * Math.sin(rotX) + H / 2;
        items.push({ ch: chars[i % n], x: p.x, y: yy, a: p.a + rotY * 0.2, z: p.z, i: idx });
      }
    }
    items.sort((a, b) => a.z - b.z);
    for (const it of items) {
      const size = (22 + it.z * 38) * P.scale;
      g.save();
      g.translate(it.x, it.y);
      g.rotate(it.a * 0.35);
      g.globalAlpha = 0.35 + it.z * 0.65;
      g.fillStyle = it.z > 0.55 ? '#f4f4f6' : '#a8a8b8';
      g.font = `700 ${size}px "Inter Variable", system-ui, sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(it.ch, 0, 0);
      g.restore();
    }

    g.globalAlpha = 1;
    g.fillStyle = '#ffffff22';
    g.font = '11px Inter Variable';
    g.fillText('STG-ish · kinetic type desk', 18, H - 16);
    requestAnimationFrame(draw);
  };

  drag(cv, {
    start: (e) => { dragOn = true; lx = e.clientX; ly = e.clientY; cv.style.cursor = 'grabbing'; },
    move: (e) => {
      if (!dragOn) return;
      rotY += (e.clientX - lx) * 0.008;
      rotX = clamp(rotX + (e.clientY - ly) * 0.004, -0.9, 0.9);
      lx = e.clientX; ly = e.clientY;
    },
    end: () => { dragOn = false; cv.style.cursor = 'grab'; },
  });

  const panelEl = h('div', {
    style: {
      position: 'absolute', right: '16px', top: '16px', bottom: '16px', width: '280px',
      background: '#141418ee', border: '1px solid #ffffff16', borderRadius: '16px',
      padding: '16px', display: 'grid', gap: '12px', alignContent: 'start', zIndex: 3,
      backdropFilter: 'blur(10px)',
    },
  },
    h('div.k-row', {}, h('b', { style: { letterSpacing: '.14em', fontSize: '11px', opacity: .55 } }, 'CONTROLS'), h('span', { style: { flex: 1 } }),
      h('span', { style: { fontSize: '10px', padding: '3px 8px', borderRadius: '999px', background: '#e8ff4a22', color: '#e8ff4a' } }, 'coil desk')),
    h('div.k-h', {}, 'Variation'),
    varSeg,
    h('div.k-h', {}, 'Text'),
    textInp,
    h('div.k-h', {}, 'Motion'),
    speedSl, densSl, scaleSl,
    h('div', { style: { fontSize: '11px', opacity: .45, lineHeight: 1.5 } }, 'Drag stage to orbit. Switching variation remaps the same string.'),
    btn('Reset view', () => { rotX = 0.35; rotY = 0; P.speed = 0.55; speedSl.set(0.55); }, ''),
  );

  root.append(cv, panelEl);
  requestAnimationFrame(draw);

  window.__demoProof = async () => {
    P.text = 'COIL TYPE'; textInp.value = P.text;
    P.variation = 'coil';
    varSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent === 'Coil'));
    P.speed = 1.1; speedSl.set(1.1);
    P.scale = 1.3; scaleSl.set(1.3);
    await sleep(120);
    P.variation = 'cylinder';
    varSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent === 'Cylinder'));
    await sleep(100);
    P.variation = 'layers';
    varSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent === 'Layers'));
    await sleep(80);
    P.variation = 'coil';
    varSeg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent === 'Coil'));
    P.text = 'THIS & THEN'; textInp.value = P.text;
    P.speed = 0.55; speedSl.set(0.55);
    P.scale = 1.05; scaleSl.set(1.05);
    return 'coil→cylinder→layers + text/speed/scale exercised';
  };
};

V['utopia-fluid-type-calculator'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#001f35', panel: '#f7f7f5', ac: '#b08a4a', dark: false, line: '#001f3518' });
  root.style.overflow = 'auto';
  root.style.fontFamily = "'Inter Variable', system-ui, sans-serif";
  root.classList.add('scroll');

  const P = {
    minW: 360, maxW: 1240,
    minFs: 18, maxFs: 20,
    minRatio: 1.2, maxRatio: 1.25,
    stepsNeg: 2, stepsPos: 5,
    previewW: 760,
  };
  const RAT_LABELS = {
    1.067: 'Minor Second', 1.125: 'Major Second', 1.2: 'Minor Third', 1.25: 'Major Third',
    1.333: 'Perfect Fourth', 1.414: 'Augmented Fourth', 1.5: 'Perfect Fifth', 1.618: 'Golden Ratio',
  };
  const ratioName = (r) => RAT_LABELS[Math.round(r * 1000) / 1000] || (r.toFixed(3));

  const fluid = (minPx, maxPx) => {
    const minW = P.minW, maxW = P.maxW;
    const slope = (maxPx - minPx) / (maxW - minW);
    const yInt = minPx - slope * minW;
    const vw = (slope * 100).toFixed(4);
    const rem = (yInt / 16).toFixed(4);
    return {
      minPx, maxPx,
      clamp: `clamp(${(minPx / 16).toFixed(4)}rem, ${vw}vw + ${rem}rem, ${(maxPx / 16).toFixed(4)}rem)`,
      at: (w) => minPx + (maxPx - minPx) * ((w - minW) / (maxW - minW)),
    };
  };

  const steps = () => {
    const out = [];
    for (let i = -P.stepsNeg; i <= P.stepsPos; i++) {
      const minPx = P.minFs * (P.minRatio ** i);
      const maxPx = P.maxFs * (P.maxRatio ** i);
      out.push({ step: i, ...fluid(minPx, maxPx) });
    }
    return out;
  };

  const cssText = () => {
    const lines = steps().map((s) => `  --step-${s.step}: ${s.clamp};`);
    return `:root {\n${lines.join('\n')}\n}`;
  };

  const header = h('div.k-row', {
    style: { padding: '18px 28px', borderBottom: '1px solid #001f3512', gap: '18px' },
  },
    h('div', {},
      h('div', { style: { fontFamily: FR, fontWeight: 700, fontSize: '20px', letterSpacing: '.02em' } }, 'UTOPIA.'),
      h('div', { style: { fontSize: '10px', letterSpacing: '.14em', color: '#b08a4a', fontWeight: 600 } }, 'FLUID RESPONSIVE DESIGN'),
    ),
    h('span', { style: { flex: 1 } }),
    ...['Type', 'Space', 'Grid', 'Clamp', 'Blog', 'Showcase', 'Merch'].map((l, i) =>
      h('span', { style: { fontSize: '13px', color: i === 0 ? '#b08a4a' : '#6a7a88', fontWeight: i === 0 ? 700 : 500, cursor: 'pointer' } }, l)),
  );

  const title = h('h1', {
    style: {
      fontFamily: FR, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
      letterSpacing: '.04em', margin: '28px 28px 18px', textTransform: 'uppercase',
    },
  }, 'Fluid Type Scale Calculator');

  const band = h('div', {
    style: {
      background: '#001f35', color: '#fff', padding: '28px',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px',
    },
  });

  const numField = (label, key, min, max, step, suffix = '') => {
    const lab = h('div', { style: { fontSize: '11px', letterSpacing: '.12em', color: '#c4a46a', marginBottom: '6px', fontWeight: 600 } }, label);
    const inp = h('input', {
      type: 'number', value: P[key], min, max, step,
      style: {
        width: '100%', background: '#001627', color: '#fff', border: '1px solid #ffffff33',
        borderRadius: '4px', padding: '12px 14px', fontSize: '22px', fontWeight: 600,
        fontFamily: "'JetBrains Mono Variable', monospace",
      },
      oninput: (e) => { P[key] = +e.target.value; draw(); },
    });
    const wrap = h('div', {}, lab, h('div.k-row', { style: { gap: '8px', alignItems: 'center' } }, inp,
      suffix ? h('span', { style: { opacity: .5, fontSize: '13px' } }, suffix) : null));
    wrap.input = inp;
    return wrap;
  };

  const minCol = h('div', {},
    h('div', { style: { fontSize: '12px', letterSpacing: '.16em', color: '#c4a46a', marginBottom: '16px', fontWeight: 700 } }, 'MIN VIEWPORT'),
  );
  const maxCol = h('div', {},
    h('div', { style: { fontSize: '12px', letterSpacing: '.16em', color: '#c4a46a', marginBottom: '16px', fontWeight: 700 } }, 'MAX VIEWPORT'),
  );
  const fMinW = numField('Width', 'minW', 200, 900, 1, 'px');
  const fMinFs = numField('Font size', 'minFs', 10, 32, 0.5, 'px');
  const fMinR = numField('Type scale', 'minRatio', 1.05, 1.8, 0.001);
  const minRatioLab = h('div', { style: { fontSize: '12px', color: '#c4a46a', marginTop: '6px' } }, ratioName(P.minRatio));
  const fMaxW = numField('Width', 'maxW', 800, 2000, 1, 'px');
  const fMaxFs = numField('Font size', 'maxFs', 12, 40, 0.5, 'px');
  const fMaxR = numField('Type scale', 'maxRatio', 1.05, 1.8, 0.001);
  const maxRatioLab = h('div', { style: { fontSize: '12px', color: '#c4a46a', marginTop: '6px' } }, ratioName(P.maxRatio));
  minCol.append(fMinW, h('div', { style: { height: '12px' } }), fMinFs, h('div', { style: { height: '12px' } }), fMinR, minRatioLab);
  maxCol.append(fMaxW, h('div', { style: { height: '12px' } }), fMaxFs, h('div', { style: { height: '12px' } }), fMaxR, maxRatioLab);
  band.append(minCol, maxCol);

  const stepCountLab = h('span', { style: { fontFamily: 'monospace', fontWeight: 700, minWidth: '72px', textAlign: 'center' } }, '−2 … +5');
  const stepRow = h('div.k-row', {
    style: { padding: '14px 28px', gap: '14px', borderBottom: '1px solid #001f3512', flexWrap: 'wrap' },
  },
    h('span', { style: { fontSize: '12px', fontWeight: 700, opacity: .55 } }, 'STEPS'),
    btn('− Neg', () => { P.stepsNeg = clamp(P.stepsNeg - 1, 0, 4); draw(); }),
    btn('+ Neg', () => { P.stepsNeg = clamp(P.stepsNeg + 1, 0, 4); draw(); }),
    stepCountLab,
    btn('− Pos', () => { P.stepsPos = clamp(P.stepsPos - 1, 1, 8); draw(); }),
    btn('+ Pos', () => { P.stepsPos = clamp(P.stepsPos + 1, 1, 8); draw(); }),
  );

  const tableWrap = h('div', { style: { padding: '24px 28px' } });
  const specimen = h('div', {
    style: {
      margin: '0 28px 20px', padding: '22px 24px', border: '1px solid #001f3514',
      borderRadius: '10px', background: '#fafaf8',
    },
  });
  const codePre = h('pre', {
    style: {
      margin: '0 28px 28px', padding: '16px 18px', background: '#001f35', color: '#e8f0f8',
      borderRadius: '10px', fontSize: '12.5px', lineHeight: 1.55,
      fontFamily: "'JetBrains Mono Variable', monospace", overflow: 'auto',
    },
  });
  const copyRow = h('div.k-row', { style: { padding: '0 28px 40px', gap: '10px' } },
    btn('Copy CSS', () => copy(cssText(), 'CSS'), 'pri'),
    h('span', { style: { fontSize: '12px', opacity: .45 } }, 'Live clamp() tokens update as you edit'),
  );

  const previewSl = slider('Simulated viewport', 320, 1600, P.previewW, 1, (v) => { P.previewW = v; draw(); }, (v) => v + 'px');
  previewSl.style.padding = '0 28px 8px';

  const draw = () => {
    minRatioLab.textContent = ratioName(P.minRatio);
    maxRatioLab.textContent = ratioName(P.maxRatio);
    stepCountLab.textContent = `−${P.stepsNeg} … +${P.stepsPos}`;
    const st = steps();
    const head = h('div', {
      style: {
        display: 'grid', gridTemplateColumns: '90px 1fr 1fr 1.4fr', gap: '8px',
        fontSize: '11px', letterSpacing: '.08em', color: '#b08a4a', fontWeight: 700,
        marginBottom: '10px', textTransform: 'uppercase',
      },
    }, 'Step', 'Min px', 'Max px', 'Preview @ ' + P.previewW + 'px');
    const rows = st.map((s) => {
      const at = s.at(P.previewW);
      return h('div', {
        style: {
          display: 'grid', gridTemplateColumns: '90px 1fr 1fr 1.4fr', gap: '8px',
          alignItems: 'baseline', padding: '8px 0', borderTop: '1px solid #001f3510',
        },
      },
        h('code', { style: { fontWeight: 700 } }, `step${s.step >= 0 ? s.step : s.step}`),
        h('span', {}, s.minPx.toFixed(2)),
        h('span', {}, s.maxPx.toFixed(2)),
        h('span', {
          style: {
            fontSize: Math.max(10, Math.min(48, at)) + 'px',
            fontFamily: FR, lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden',
          },
        }, 'Almost before we knew it'),
      );
    });
    tableWrap.replaceChildren(
      h('h2', { style: { fontFamily: FR, fontSize: '22px', letterSpacing: '.04em', textTransform: 'uppercase', margin: '0 0 10px' } }, 'Calculated Font Sizes'),
      h('p', { style: { fontSize: '14px', lineHeight: 1.6, maxWidth: '640px', opacity: .75, margin: '0 0 16px' } },
        'Min/max columns show sizes at the viewport extremes. Drag the simulated viewport to preview fluid values between them.'),
      head, ...rows,
    );
    const heroStep = st.find((s) => s.step === 2) || st[st.length - 1];
    const bodyStep = st.find((s) => s.step === 0) || st[0];
    specimen.replaceChildren(
      h('div', { style: { fontSize: '11px', letterSpacing: '.1em', color: '#b08a4a', marginBottom: '8px', fontWeight: 700 } }, 'SPECIMEN'),
      h('div', {
        style: {
          fontFamily: FR, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.02em',
          fontSize: heroStep.at(P.previewW) + 'px', marginBottom: '10px',
        },
      }, 'Fluid type that breathes with the viewport'),
      h('p', {
        style: { fontSize: bodyStep.at(P.previewW) + 'px', lineHeight: 1.55, opacity: .8, margin: 0, maxWidth: '52ch' },
      }, 'Utopia-style clamp() scales keep hierarchy intact from phone to ultrawide — no breakpoint jumps.'),
    );
    codePre.textContent = cssText();
  };

  // wire ratio label updates via draw; also sync number inputs when proof mutates
  const syncInputs = () => {
    fMinW.input.value = P.minW; fMinFs.input.value = P.minFs; fMinR.input.value = P.minRatio;
    fMaxW.input.value = P.maxW; fMaxFs.input.value = P.maxFs; fMaxR.input.value = P.maxRatio;
  };

  root.append(header, title, band, stepRow, previewSl, specimen, tableWrap, codePre, copyRow);
  draw();

  window.__demoProof = async () => {
    const snap = { ...P };
    P.minFs = 16; P.maxFs = 22; P.minRatio = 1.25; P.maxRatio = 1.333; P.previewW = 980;
    syncInputs(); previewSl.set(980); draw();
    await sleep(200);
    copy(cssText(), 'CSS');
    await sleep(150);
    Object.assign(P, snap); syncInputs(); previewSl.set(P.previewW); draw();
    return 'tweaked scale + viewport · copied clamp CSS · restored';
  };
};


V['squeezy-variable-font-playground'] = (root, T) => {
  theme(root, T, { bg: '#008f5d', fg: '#ffcf66', panel: '#007a50', ac: '#ffcf66', acfg: '#008f5d', dark: true, line: '#ffcf6633' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';
  root.style.background = '#008f5d';
  root.style.color = '#ffcf66';

  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let gi = 10; // K
  let wdth = 100;
  let wght = 700;
  let soft = 80;
  const pos = { x: 0.5, nx: 0.5 };

  const header = h('div.k-row', {
    style: { position: 'absolute', top: 0, left: 0, right: 0, height: '64px', padding: '0 28px', zIndex: 4, gap: '18px' },
  },
    h('div.k-row', { style: { gap: '10px', alignItems: 'center' } },
      h('span', {
        style: {
          width: '22px', height: '22px', borderRadius: '50%', background: '#ffcf66', color: '#008f5d',
          display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '12px',
        },
      }, '0'),
      h('b', { style: { fontSize: '15px', letterSpacing: '-.01em' } }, 'Squeezy Variable'),
    ),
    h('span', { style: { flex: 1, textAlign: 'center', fontSize: '13px', opacity: .85 } }, 'A squishable and squashable variable font'),
    h('button', {
      style: {
        background: 'transparent', border: 0, color: '#ffcf66', fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px',
      },
      onclick: () => toast('Download Squeezy (demo)'),
    }, 'Download', h('span', {
      style: {
        width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #ffcf66',
        display: 'grid', placeItems: 'center', fontSize: '12px',
      },
    }, '→')),
  );

  const stage = h('div', {
    style: {
      position: 'absolute', inset: '64px 0 90px', display: 'grid', placeItems: 'center',
      cursor: 'ew-resize', userSelect: 'none',
    },
  });

  const letter = h('div', {
    style: {
      fontFamily: RF,
      fontSize: 'min(62vh, 420px)',
      lineHeight: 0.85,
      color: '#ffcf66',
      fontVariationSettings: '"wght" 700, "wdth" 100, "SOFT" 80',
      letterSpacing: '-.04em',
      transition: 'font-variation-settings 40ms linear',
      textShadow: '0 0 0 #007048, 4px 6px 0 #00704844',
      position: 'relative',
    },
  }, GLYPHS[gi]);

  const hint = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
      background: '#ffcf66', color: '#008f5d', borderRadius: '99px', padding: '10px 18px',
      fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', pointerEvents: 'none',
      boxShadow: '0 4px 18px #0003', zIndex: 2,
    },
  }, '← Move your cursor to control the font width.');

  const apply = () => {
    letter.style.fontVariationSettings = `"wght" ${Math.round(wght)}, "wdth" ${Math.round(wdth)}, "SOFT" ${Math.round(soft)}`;
    letter.textContent = GLYPHS[gi];
  };

  stage.append(letter, hint);
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    pos.x = clamp((e.clientX - r.left) / r.width, 0, 1);
    pos.nx = pos.x;
    // left = narrow (squished), right = wide (stretched)
    wdth = 50 + pos.x * 120; // 50..170
    wght = 500 + pos.x * 400;
    soft = 40 + (1 - Math.abs(pos.x - 0.5) * 2) * 60;
    hint.style.opacity = String(0.15 + (1 - Math.abs(pos.x - 0.5) * 1.6) * 0.85);
    apply();
  });
  stage.addEventListener('click', () => {
    gi = (gi + 1) % GLYPHS.length;
    apply();
    toast('glyph ' + GLYPHS[gi]);
  });

  const tabs = ['Info', 'Try It', 'Characters', 'Posters', 'Info & Download'];
  let tab = 'Info';
  const nav = h('div.k-row', {
    style: {
      position: 'absolute', left: '24px', bottom: '22px', zIndex: 4,
      background: '#006b46', borderRadius: '99px', padding: '8px 14px', gap: '4px',
      boxShadow: '0 6px 20px #0003',
    },
  },
    h('div.k-row', { style: { gap: '5px', marginRight: '10px' } },
      ...['#7c5cff', '#3ddc97', '#2b4cff', '#ff4d6d'].map((c) =>
        h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: c } })),
    ),
  );
  const paintTabs = () => {
    // keep dots, rebuild labels
    while (nav.children.length > 1) nav.lastChild.remove();
    tabs.forEach((t) => {
      nav.append(h('button', {
        style: {
          border: 0, background: tab === t ? '#ffcf66' : 'transparent',
          color: tab === t ? '#008f5d' : '#ffcf66',
          borderRadius: '99px', padding: '7px 12px', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
        },
        onclick: () => { tab = t; paintTabs(); if (t === 'Characters') { gi = (gi + 3) % GLYPHS.length; apply(); } toast(t); },
      }, t));
    });
  };
  paintTabs();

  const credit = h('button', {
    style: {
      position: 'absolute', right: '24px', bottom: '22px', zIndex: 4,
      background: '#ffcf66', color: '#008f5d', border: 0, borderRadius: '99px',
      padding: '10px 16px', fontWeight: 800, fontSize: '13px', cursor: 'pointer',
      boxShadow: '0 6px 20px #0003',
    },
    onclick: () => toast('Made by Overnice'),
  }, 'Made by Overnice.');

  const axisReadout = h('div', {
    style: {
      position: 'absolute', left: '50%', bottom: '100px', transform: 'translateX(-50%)',
      fontFamily: "'JetBrains Mono Variable', monospace", fontSize: '11px', letterSpacing: '.08em',
      opacity: .7, zIndex: 3,
    },
  });
  const tick = () => {
    axisReadout.textContent = `wdth ${Math.round(wdth)} · wght ${Math.round(wght)} · ${GLYPHS[gi]}`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  root.append(header, stage, nav, credit, axisReadout);
  apply();

  window.__demoProof = async () => {
    const r = stage.getBoundingClientRect();
    // squish left
    stage.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + r.width * 0.12, clientY: r.top + r.height * 0.5 }));
    await sleep(120);
    // stretch right
    stage.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + r.width * 0.88, clientY: r.top + r.height * 0.5 }));
    await sleep(120);
    // center restore
    stage.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + r.width * 0.5, clientY: r.top + r.height * 0.5 }));
    gi = 10; apply();
    return 'cursor width axis squish→stretch→center · glyph K';
  };
};

V['fontshare-live-type-catalog'] = (root, T) => {
  theme(root, T, { bg: '#fefee6', fg: '#111', ac: '#111', dark: false });
  const FAM = [
    ['Satoshi', 'satoshi', 'Sans', 10, true], ['Clash Display', 'clash-display', 'Display', 6, true], ['General Sans', 'general-sans', 'Sans', 12, true], ['Zodiak', 'zodiak', 'Serif', 12, true], ['Cabinet Grotesk', 'cabinet-grotesk', 'Sans', 9, true], ['Bespoke Slab', 'bespoke-slab', 'Slab', 12, true],
    ['Switzer', 'switzer', 'Sans', 18, true], ['Gambetta', 'gambetta', 'Serif', 8, true], ['Panchang', 'panchang', 'Display', 7, true], ['Sentient', 'sentient', 'Serif', 12, true], ['Tanker', 'tanker', 'Display', 1, false], ['Erode', 'erode', 'Slab', 12, true], ['Boska', 'boska', 'Serif', 12, true], ['Chillax', 'chillax', 'Display', 7, true], ['Comico', 'comico', 'Handwritten', 1, false],
  ];
  if (!document.getElementById('fs-css')) document.head.append(h('link', { id: 'fs-css', rel: 'stylesheet', href: 'https://api.fontshare.com/v2/css?' + FAM.map((f) => `f[]=${f[1]}@1,400`).join('&') + '&display=swap' }));
  const UI = "'Satoshi','General Sans','Inter Variable',sans-serif";
  const KEY = 'fs-preview-theme'; let dark = localStorage.getItem(KEY) === 'dark';
  const P = { size: 120, text: '', mode: 'names', cat: 'All', sort: 'Popular', q: '', align: 'left' };
  const CITIES = ['Mumbai', 'Lisbon', 'Kyoto', 'Reykjavík', 'Oaxaca', 'Seoul', 'Marrakesh', 'Helsinki', 'Valparaíso', 'Tbilisi', 'Hanoi', 'Montréal', 'Zanzibar', 'Bergen', 'Cusco'];
  const EXC = ['The quick brown fox jumps over the lazy dog', 'Typography is the craft of endowing human language with a durable visual form', 'Sphinx of black quartz, judge my vow', 'Good design is as little design as possible'];
  root.classList.add('scroll'); Object.assign(root.style, { overflow: 'auto', fontFamily: UI });
  root.append(h('style', {}, `.fs{--bg:#fefee6;--fg:#111;--mut:#9a9a8a;--ln:#e6e6c8;background:var(--bg);color:var(--fg);min-height:100%;transition:background .25s,color .25s}.fs.dk{--bg:#111;--fg:#fefee6;--mut:#77776a;--ln:#2a2a24}.fs-cell{border-right:1px solid var(--ln);display:flex;flex-direction:column;justify-content:center;padding:0 16px;font-size:13px;font-weight:500;cursor:pointer;position:relative}.fs-cell small{position:absolute;left:16px;bottom:14px;font-size:9px}.fs-m{color:var(--mut);font-size:11px}.fs-chip{font-size:11px;color:var(--mut);cursor:pointer;margin-right:14px}.fs-chip.on{color:var(--fg)}.fs-row{border:1px solid var(--ln);border-top:0;padding:30px 28px 22px;position:relative;cursor:pointer;transition:background .15s}.fs-row:first-child{border-top:1px solid var(--ln)}.fs-row:hover{background:color-mix(in srgb,var(--fg) 3%,transparent)}.fs-act{position:absolute;right:28px;bottom:20px;display:flex;gap:8px;opacity:0;transform:translateY(4px);transition:.18s}.fs-row:hover .fs-act,.fs-row.hov .fs-act{opacity:1;transform:none}.fs-btn{border:1px solid var(--fg);background:transparent;color:var(--fg);font:500 11px ${UI};padding:8px 14px;border-radius:99px;cursor:pointer}.fs-btn.blk{background:var(--fg);color:var(--bg)}.fs-in{background:transparent;border:0;border-bottom:1px solid var(--ln);color:var(--fg);font:12px ${UI};padding:10px 0 10px 18px;outline:0;width:100%}.fs-sample{line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:18px 0 32px}input[type=range].fs-r{-webkit-appearance:none;appearance:none;height:1px;background:var(--fg);width:140px}input[type=range].fs-r::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border:1.5px solid var(--fg);border-radius:50%;background:var(--bg)}`));
  const shell = h('div.fs' + (dark ? '.dk' : ''));
  const sizeLab = h('span', { style: { fontSize: '11px', width: '46px' } }, '120px');
  const sizeR = h('input.fs-r', { type: 'range', min: 24, max: 220, value: 120, oninput: (e) => { P.size = +e.target.value; sizeLab.textContent = P.size + 'px'; draw(); } });
  const txt = h('input.fs-in', { placeholder: 'Your Text', oninput: (e) => { P.text = e.target.value; draw(); } });
  const search = h('input.fs-in', { placeholder: 'Search', oninput: (e) => { P.q = e.target.value.toLowerCase(); draw(); } });
  const chipRow = (opts, key) => { const wrap = h('span'); const upd = () => [...wrap.children].forEach((c) => c.classList.toggle('on', c.dataset.v === P[key])); opts.forEach((o) => wrap.append(h('span.fs-chip', { 'data-v': o, onclick: () => { P[key] = o; upd(); draw(); } }, o[0].toUpperCase() + o.slice(1)))); upd(); wrap.upd = upd; return wrap; };
  const cats = chipRow(['All', 'Sans', 'Serif', 'Slab', 'Display', 'Handwritten'], 'cat'), modes = chipRow(['cities', 'excerpts', 'names'], 'mode'), sorts = chipRow(['New', 'Popular', 'Hot', 'Alphabetical'], 'sort');
  const themeBtn = h('span', { title: 'Light/Dark preview', onclick: () => setDark(!dark), style: { cursor: 'pointer', display: 'inline-flex', gap: '8px', alignItems: 'center' } }, h('span', { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#f7e7a1', border: '1px solid #111' } }), h('span', { style: { width: '12px', height: '12px', borderRadius: '50%', background: 'linear-gradient(90deg,currentColor 50%,transparent 50%)', border: '1.5px solid currentColor' } }));
  const setDark = (v) => { dark = v; localStorage.setItem(KEY, v ? 'dark' : 'light'); shell.classList.toggle('dk', v); };
  const alignBtns = h('span', { style: { display: 'inline-flex', gap: '14px' } }, ...['left', 'center', 'right'].map((a) => h('span', { title: 'align ' + a, onclick: () => { P.align = a; draw(); }, style: { cursor: 'pointer', fontSize: '12px', color: 'var(--mut)' } }, a === 'left' ? '☰' : a === 'center' ? '≡' : '☷')));
  const countEl = h('span', { style: { fontSize: '17px', fontWeight: 500 } });
  const list = h('div');
  const tabCell = (l, n, on) => h('div.fs-cell', { style: on ? { background: 'var(--fg)', color: 'var(--bg)' } : {}, onclick: () => toast(`${l} — demo`) }, h('span', { style: { textAlign: 'center' } }, l), n ? h('small', {}, n) : null);
  const header = h('div', { style: { display: 'grid', gridTemplateColumns: '1.1fr .5fr .5fr .5fr .5fr 1fr', height: '112px', borderBottom: '1px solid var(--ln)' } },
    h('div', { style: { display: 'flex', alignItems: 'center', padding: '0 28px', fontSize: '25px', fontWeight: 700, letterSpacing: '-.02em' } }, 'Fontshare', h('sup', { style: { fontSize: '11px', fontWeight: 700 } }, 'TM')), tabCell('Fonts', '100', true), tabCell('Pairs', '59'), tabCell('Licenses'), h('div.fs-cell', { style: { alignItems: 'center' } }, h('span', { style: { width: '38px', height: '9px', borderTop: '2px solid currentColor', borderBottom: '2px solid currentColor' } })), h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--mut)' } }, 'No styles selected'));
  const lbl = (t) => h('span', { style: { fontSize: '11px', color: 'var(--mut)' } }, t);
  const filters = h('div', { style: { padding: '42px 28px 0' } },
    h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', alignItems: 'center', borderBottom: '1px solid var(--ln)', paddingBottom: '6px' } }, search, h('div', { style: { paddingLeft: '14px' } }, lbl('Categories ◂ '), cats), lbl('Properties ◂'), h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, sizeLab, sizeR)),
    h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', alignItems: 'center', paddingTop: '6px' } }, txt, h('div', { style: { paddingLeft: '14px' } }, lbl('Personality ◂')), modes, h('div', { style: { display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'space-between', fontSize: '11px' } }, alignBtns, themeBtn, h('span', { onclick: () => reset(), style: { cursor: 'pointer', color: 'var(--mut)' } }, 'Reset All'))),
    h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '14px', margin: '72px 0 26px', fontSize: '11px' } }, countEl, h('span', {}, 'List view'), h('span', { style: { color: 'var(--mut)', marginRight: '90px' } }, 'Grid view'), lbl('Top 20   Hot 20   Variable'), h('span', { style: { flex: 1 } }), lbl('Sort by ——— '), sorts));
  const sampleFor = (f, i) => P.text || (P.mode === 'cities' ? CITIES[i % CITIES.length] : P.mode === 'excerpts' ? EXC[i % EXC.length] : f[0]);
  const draw = () => {
    let fs = FAM.map((f, i) => [f, i]).filter(([f]) => (P.cat === 'All' || f[2] === P.cat) && (!P.q || f[0].toLowerCase().includes(P.q)));
    if (P.sort === 'Alphabetical') fs.sort((a, b) => a[0][0].localeCompare(b[0][0])); else if (P.sort === 'New') fs.reverse(); else if (P.sort === 'Hot') fs.sort((a, b) => b[0][3] - a[0][3]);
    countEl.textContent = fs.length;
    list.replaceChildren(...fs.map(([f, i]) => h('div.fs-row', { onclick: (e) => { if (!e.target.closest('.fs-act')) openDetail(f); } },
      h('div', { style: { display: 'flex', fontSize: '9.5px', color: 'var(--mut)', gap: '40px' } }, h('span', { style: { flex: 1, fontWeight: 600 } }, `${f[0]} ☆`), h('span', {}, `${f[3]} style${f[3] > 1 ? 's' : ''}`), h('span', {}, f[4] ? 'Variable' : f[2]), h('span', {}, 'Closed Source')),
      h('div.fs-sample', { style: { fontFamily: `'${f[0]}', ${UI}`, fontSize: (P.mode === 'excerpts' && !P.text ? P.size * 0.5 : P.size) + 'px', textAlign: P.align } }, sampleFor(f, i)),
      h('div.fs-m', { style: { fontSize: '9.5px' } }, 'Designed by Indian Type Foundry'),
      h('div.fs-act', {}, h('button.fs-btn', { onclick: () => openDetail(f) }, 'View'), h('button.fs-btn.blk', { onclick: () => toast(`${f[0]} — download (demo)`) }, '↓ Download')))));
    if (!fs.length) list.append(h('div', { style: { padding: '60px', textAlign: 'center', color: 'var(--mut)' } }, 'No fonts match these filters.'));
  };
  // detail page with weight ladder + variable slider
  const detail = h('div', { style: { position: 'absolute', inset: 0, background: 'var(--bg)', color: 'var(--fg)', display: 'none', overflow: 'auto', zIndex: 5 } });
  const openDetail = (f) => {
    const W = [[300, 'Light'], [400, 'Regular'], [500, 'Medium'], [700, 'Bold'], [900, 'Black']]; const fam = `'${f[0]}', ${UI}`;
    const big = h('div', { style: { fontFamily: fam, fontSize: '150px', lineHeight: 1, fontWeight: 400, transition: 'font-weight .05s' } }, 'Aa');
    const wl = h('span', { style: { fontSize: '11px' } }, '400');
    detail.replaceChildren(h('div', { style: { display: 'flex', alignItems: 'center', padding: '28px', borderBottom: '1px solid var(--ln)', gap: '20px' } }, h('button.fs-btn', { onclick: () => (detail.style.display = 'none') }, '← All fonts'), h('b', { style: { fontSize: '20px', fontFamily: fam } }, f[0]), h('span.fs-m', {}, `${f[2]} · ${f[3]} styles${f[4] ? ' · Variable' : ''}`), h('span', { style: { flex: 1 } }), h('button.fs-btn.blk', { onclick: () => toast('Download family (demo)') }, '↓ Download family')),
      h('div', { style: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: '40px', padding: '40px 28px' } },
        h('div', {}, big, h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' } }, h('span.fs-m', {}, 'Weight'), h('input.fs-r.fs-wght', { type: 'range', min: 300, max: 900, value: 400, oninput: (e) => { big.style.fontWeight = e.target.value; wl.textContent = e.target.value; } }), wl), h('p.fs-m', { style: { marginTop: '20px', lineHeight: 1.6, maxWidth: '300px' } }, `${f[0]} is a ${f[2].toLowerCase()} family from Indian Type Foundry, free for personal and commercial use.`)),
        h('div', {}, ...W.map(([w, n]) => h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '24px', borderTop: '1px solid var(--ln)', padding: '14px 0' } }, h('span.fs-m', { style: { width: '90px' } }, `${n} ${w}`), h('span', { style: { fontFamily: fam, fontWeight: w, fontSize: '40px', whiteSpace: 'nowrap', overflow: 'hidden' } }, P.text || 'Sphinx of black quartz'))))));
    detail.style.display = 'block'; detail.scrollTop = 0;
  };
  const reset = () => { Object.assign(P, { size: 120, text: '', mode: 'names', cat: 'All', sort: 'Popular', q: '', align: 'left' }); sizeR.value = 120; sizeLab.textContent = '120px'; txt.value = ''; search.value = ''; cats.upd(); modes.upd(); sorts.upd(); draw(); };
  shell.append(header, filters, h('div', { style: { padding: '0 28px 80px' } }, list));
  root.style.position = 'relative'; root.append(shell, detail); draw();
  window.__demoProof = async () => { txt.value = 'Hello Seoul'; txt.dispatchEvent(new Event('input')); sizeR.value = 60; sizeR.dispatchEvent(new Event('input')); const s0 = list.querySelector('.fs-sample'); const live = s0.textContent === 'Hello Seoul' && s0.style.fontSize === '60px'; cats.querySelector('[data-v=Serif]').click(); const nSerif = list.children.length; const row = list.querySelector('.fs-row'); row.classList.add('hov'); const acts = getComputedStyle(row.querySelector('.fs-act')).display !== 'none'; row.classList.remove('hov'); openDetail(FAM[0]); const lad = detail.querySelectorAll('[style*="font-weight"]').length; detail.querySelector('.fs-wght').value = 800; detail.querySelector('.fs-wght').dispatchEvent(new Event('input')); detail.style.display = 'none'; const was = dark; setDark(!was); const stored = localStorage.getItem(KEY); setDark(was); reset(); return `preview text+size live on all rows=${live}, Serif filter→${nSerif} rows, hover actions=${acts}, detail ladder+wght slider ok (${lad}), theme persisted=${stored}; restored`; };
};

V['grilli-flexa-jump-rail-subfamily-pill-editable-specimen'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#000', ac: '#000', dark: false });
  root.classList.add('scroll'); root.style.overflow = 'auto'; root.style.background = '#fff';
  const F = "'Roboto Flex Variable','Inter Variable',system-ui,sans-serif";
  const WIDTHS = [['X Compressed', 25], ['Compressed', 42], ['Condensed', 68], ['Standard', 100], ['Expanded', 151]];
  const WEIGHTS = [['Lazer', 100], ['Thin', 170], ['Light', 300], ['Regular', 400], ['Medium', 520], ['Bold', 700], ['Black', 1000]];
  const SAMPLES = [
    [44, 1000, 'Spectacular jab across the boxing ring, Flexa'],
    [118, 300, 'Elastic letterforms stretch from tight to wide'],
    [72, 700, 'Quiet Zurich mornings, loud Basel nights'],
    [36, 400, 'A grotesk with forty-two styles across five widths, drawn for screens and signage alike.'],
    [22, 400, 'GT Flexa is a versatile family that pairs neo-grotesk construction with a wide range of widths. Click any line to edit it — the specimen overflows at the right edge just like the original.'],
  ];
  const fv = (w, g, x) => `'wdth' ${w}, 'wght' ${g}` + (x ? `, 'XTRA' ${x}` : '');
  css(`.gf{font:400 16px/1.35 ${F};font-variation-settings:'wdth' 100;color:#000;background:#fff;min-height:100%;padding:0 122px 120px}
.gf a{color:inherit;text-decoration:none}
.gf-nav{display:grid;grid-template-columns:173px 1fr auto;align-items:end;padding-bottom:21px;height:90px;border-bottom:1px solid #000;font-size:15.5px;letter-spacing:-.005em}
.gf-nav .lk{display:flex;gap:25px;color:#8a8a8a}.gf-nav .lk span,.gf-nav .lg{cursor:pointer;transition:color .15s}.gf-nav .lk span:hover,.gf-nav .lg:hover{color:#000}.gf-nav .lg{color:#8a8a8a}
.gf-title{display:grid;grid-template-columns:173px 1fr auto;align-items:center;height:121px;border-bottom:1px solid #000}
.gf-title h1{margin:0;font:420 47px/1 ${F};font-variation-settings:'wdth' 100;letter-spacing:-.012em;transform:translateY(8px)}
.gf-title .bt{display:flex;gap:10px;transform:translateY(19px)}
.gf-btn{font:400 15.5px ${F};height:39px;padding:0 20px;border-radius:3px;border:1px solid #bdbdbd;background:#fff;color:#8a8a8a;cursor:pointer}
.gf-btn.k{background:#000;border-color:#000;color:#fff}
.gf-body{display:grid;grid-template-columns:173px 1fr}
.gf-rail{position:sticky;top:20px;align-self:start;padding-top:72px;font-size:15.5px;line-height:27px}
.gf-rail b{font-weight:400;display:block;color:#000}.gf-rail span{display:block;color:#8a8a8a;cursor:pointer;width:122px;line-height:22px;margin-bottom:5px}.gf-rail span:hover,.gf-rail span.on{color:#000}
.gf-hero{height:498px;display:flex;align-items:center;justify-content:space-between;overflow:hidden;cursor:pointer;user-select:none}
.gf-hero span{font-family:${F};font-size:527px;line-height:1;display:block;transform:translateY(14px);transition:font-variation-settings .6s cubic-bezier(.3,.8,.2,1)}
.gf-sec{border-top:1px solid #000;display:grid;grid-template-columns:173px 1fr;padding:42px 0 60px}
.gf-sec>*{min-width:0}
.gf-sec>h3{margin:0;font:400 15.5px ${F};position:sticky;top:20px;align-self:start}
.gf-fam{display:grid;grid-template-columns:repeat(3,1fr);row-gap:56px}
.gf-fam h4{margin:0 0 14px;font:400 15.5px ${F}}
.gf-fam .st{font-size:25px;line-height:38px;cursor:pointer;white-space:nowrap}
.gf-fam .st:hover{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
.gf-pills{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:34px}
.gf-pill{font:400 14px ${F};border:1px solid #000;border-radius:99px;padding:6px 14px;background:#fff;cursor:pointer}
.gf-pill.on{background:#000;color:#fff}
.gf-line{white-space:nowrap;overflow:hidden;outline:0;border-bottom:1px solid #e3e3e3;padding:6px 0 10px;line-height:1.08;caret-color:#ff3c00}
.gf-line:focus{background:#fafafa}
.gf-meta{font-size:12px;color:#8a8a8a;margin:14px 0 2px;display:flex;gap:18px}
.gf-ot{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.gf-ot div{border:1px solid #000;height:220px;display:grid;place-items:center;position:relative;cursor:pointer;font-size:92px}
.gf-ot div i{position:absolute;left:12px;top:10px;font:400 12px ${F};font-style:normal;color:#8a8a8a}
.gf-mini{margin-top:20px;border:1px solid #000;height:340px;background:#ffef00;display:grid;place-items:center;font-size:150px;overflow:hidden}
.gf-use{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px}.gf-use div{aspect-ratio:4/5;display:grid;place-items:center;color:#fff;font-size:44px}
.gf-info{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;font-size:15px;color:#333}.gf-info b{display:block;font-weight:400;color:#8a8a8a;margin-bottom:6px}`);
  const top = h('div.gf-nav', {}, h('b', { style: { fontWeight: 450 } }, 'Grilli Type'), h('div.lk', {}, ...['Typefaces', 'Free Trials', 'Commissions', 'Blog', 'Information', 'About'].map((t) => h('span', { onclick: () => toast(t + ' (demo)') }, t))), h('span.lg', { onclick: () => toast('Login (demo)') }, 'Login'));
  const title = h('div.gf-title', {}, h('span'), h('h1', {}, 'GT Flexa'), h('div.bt', {}, h('button.gf-btn', { onclick: () => toast('Trial fonts → zip (demo)') }, 'Download trial fonts'), h('button.gf-btn.k', { onclick: () => toast('Purchase GT Flexa (demo)') }, 'Purchase GT Flexa')));
  const HERO_DEF = [['J', 25, 1000], ['A', 42, 380], ['B', 151, 1000, 603]];
  const HERO_ALT = [['J', 151, 100], ['A', 100, 1000], ['B', 25, 600]];
  let heroAlt = false;
  const heroEls = HERO_DEF.map(([c, w, g, x]) => h('span', { style: { fontVariationSettings: fv(w, g, x) } }, c));
  const setHero = (alt) => { heroAlt = alt; (alt ? HERO_ALT : HERO_DEF).forEach(([, w, g, x], i) => { heroEls[i].style.fontVariationSettings = fv(w, g, x); }); };
  const hero = h('div.gf-hero', { onclick: () => setHero(!heroAlt), title: 'click to remix widths' }, ...heroEls);
  // Family overview
  const famEl = h('div.gf-fam', {}, ...WIDTHS.map(([wn, w]) => h('div', {}, h('h4', {}, wn), ...WEIGHTS.map(([gn, g]) => h('div.st', { style: { fontVariationSettings: fv(w, g) }, onclick: () => { setWidth(wn); go(1); } }, gn, ' ', h('span', { style: { fontStyle: 'oblique 10deg', fontVariationSettings: fv(w, g) + ", 'slnt' -10" } }, 'Italic'))))));
  // Editable samples
  let cur = 'Standard';
  const pills = WIDTHS.map(([wn]) => h('button.gf-pill', { onclick: () => setWidth(wn) }, 'GT Flexa ' + wn));
  const lines = SAMPLES.map(([sz, g, txt]) => h('div.gf-line', { contenteditable: 'true', spellcheck: 'false', style: { fontSize: sz + 'px' } }, txt));
  const metas = SAMPLES.map(([sz, g]) => h('div.gf-meta', {}, h('span.m1'), h('span', {}, sz + ' px'), h('span', {}, WEIGHTS.find((x) => x[1] === g)?.[0] || 'Regular')));
  const setWidth = (wn) => { cur = wn; const w = WIDTHS.find((x) => x[0] === wn)[1]; pills.forEach((p, i) => p.classList.toggle('on', WIDTHS[i][0] === wn)); lines.forEach((l, i) => { l.style.fontVariationSettings = fv(w, SAMPLES[i][1]); metas[i].querySelector('.m1').textContent = 'GT Flexa ' + wn + ' ' + (WEIGHTS.find((x) => x[1] === SAMPLES[i][1])?.[0] || ''); }); };
  const samples = h('div', {}, h('div.gf-pills', {}, ...pills), ...SAMPLES.flatMap((_, i) => [metas[i], lines[i]]));
  const ot = h('div', {}, h('div.gf-ot', {}, ...[['SS01', 'Gag', 'Single-storey a'], ['SS03', 'R→R', 'Straight-leg R'], ['SS05', '1→1', 'Flag-free 1']].map(([k, g, d]) => { const el = h('div', { onclick: () => { el.dataset.on = el.dataset.on ? '' : '1'; el.style.background = el.dataset.on ? '#000' : '#fff'; el.style.color = el.dataset.on ? '#fff' : '#000'; } }, h('i', {}, k + ' · ' + d), g); el.style.fontVariationSettings = fv(100, 500); return el; })),
    h('div.gf-mini', { style: { fontVariationSettings: fv(151, 1000) } }, 'Flexa'),
    h('div.gf-use', {}, ...[['#ff3c00', 'Aa'], ['#1a1a1a', 'Jab'], ['#2d5bff', 'Rr'], ['#0b8a5a', 'GT']].map(([c, t], i) => h('div', { style: { background: c, fontVariationSettings: fv(WIDTHS[i + 1][1], 900) } }, t))));
  const info = h('div.gf-info', {}, h('div', {}, h('b', {}, 'Design'), 'Dominik Huber, 2019'), h('div', {}, h('b', {}, 'Styles'), '42 styles · 5 widths · 7 weights + italics · variable'), h('div', {}, h('b', {}, 'Formats'), 'OTF, WOFF2, variable TTF'));
  const SECS = [['Family overview', famEl], ['Editable samples', samples], ['OpenType features', ot], ['Typeface information', info]];
  const secEls = SECS.map(([n, c]) => h('section.gf-sec', {}, h('h3', {}, n), c));
  const railItems = ['Family overview', 'Editable samples', 'Typeface information'].map((n) => h('span', { onclick: () => go(SECS.findIndex((x) => x[0] === n)) }, n));
  const go = (i) => { const r = secEls[i].getBoundingClientRect(), rr = root.getBoundingClientRect(); root.scrollTo({ top: root.scrollTop + r.top - rr.top - 10, behavior: 'instant' }); };
  root.addEventListener('scroll', () => { const rr = root.getBoundingClientRect().top; let a = -1; secEls.forEach((s, i) => { if (s.getBoundingClientRect().top - rr < 300) a = i; }); railItems.forEach((el, i) => el.classList.toggle('on', ['Family overview', 'Editable samples', 'Typeface information'][i] === SECS[a]?.[0])); });
  const rail = h('div.gf-rail', {}, h('b', {}, 'Jump to'), ...railItems);
  root.append(h('div.gf', {}, top, title, h('div.gf-body', {}, rail, hero), ...secEls));
  setWidth('Standard');
  window.__demoProof = async () => { const out = [];
    setWidth('X Compressed'); out.push(`pill X Compressed → line0 fvs="${lines[0].style.fontVariationSettings}"`);
    setWidth('Expanded'); out.push(`Expanded → line0 scrollWidth ${lines[0].scrollWidth} > clientWidth ${lines[0].clientWidth} (overflow clip)`);
    const t0 = lines[0].textContent; lines[0].textContent = 'Edited JAB'; out.push(`contenteditable → "${lines[0].textContent}"`); lines[0].textContent = t0;
    setHero(true); await sleep(50); out.push('hero remix ' + heroEls.map((e) => e.style.fontVariationSettings).join(' | ')); setHero(false);
    go(1); await sleep(30); out.push(`jump-to Editable samples scrollTop=${Math.round(root.scrollTop)}`);
    root.scrollTo({ top: 0, behavior: 'instant' }); setWidth('Standard');
    return out.join('; ') + '; restored'; };
};

V['locomotive-stacked-echo-typing-preloader-glyph-scramble-wordmark'] = (root, T) => {
  import('@fontsource/instrument-serif/400.css');
  theme(root, T, { bg: '#000', fg: '#fff', ac: '#5fe3e8', dark: true });
  const GR = "'Inter Variable','Helvetica Neue',Arial,sans-serif", SE = "'Instrument Serif','Times New Roman',serif", CY = '#5fe3e8';
  const st = document.createElement('style'); st.textContent = `
.lc{position:absolute;inset:0;background:#000;color:#fff;overflow:hidden;font-family:${GR}}
.lc-home{position:absolute;inset:0;opacity:0}
.lc-home.on{opacity:1;transition:opacity .5s ease}
.lc-cv{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
.lc-nav{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;padding:16px 40px;font:400 22px/1 ${GR};letter-spacing:-.01em;z-index:3}
.lc-nav a{color:#fff;text-decoration:none;cursor:pointer;background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .3s}
.lc-nav a:hover{background-size:100% 1px}
.lc-nav .c{color:${CY}}.lc-nav .sp{flex:1}
.lc-nav sup{font-size:.45em;vertical-align:.9em;margin-left:1px}.lc-hero sup{font-size:.26em;vertical-align:2.2em;margin-left:2px;font-family:${GR}}
.lc-hero{position:absolute;left:40px;bottom:26px;color:${CY};font:400 70px/0.98 ${SE};letter-spacing:-.005em;z-index:3}
.lc-hero .r{display:flex;align-items:center;gap:16px;overflow:hidden}
.lc-hero .r>span{display:inline-block}
.lc-badge{display:grid;grid-template-columns:auto auto;border:2px solid ${CY};font:700 17px/1 ${GR};letter-spacing:.02em;height:54px;align-self:center}
.lc-badge b{display:grid;place-items:center;padding:0 12px;border-right:2px solid ${CY}}
.lc-badge i{font-style:normal;display:grid;grid-template-rows:1fr 1fr;padding:0 10px}.lc-badge i span{display:grid;place-items:center}.lc-badge i span:first-child{border-bottom:2px solid ${CY}}
.lc-loco{display:inline-flex;flex-direction:column;align-items:flex-start;font:500 20px/1 ${GR};margin-left:6px;transform:translateY(-14px)}
.lc-loco u{text-decoration:none;border-bottom:2px solid ${CY};padding-bottom:2px;letter-spacing:.06em}
.lc-up{transform:translateY(105%)}.lc-home.on .lc-up{transform:none;transition:transform .9s cubic-bezier(.2,.8,.2,1)}
.lc-pre{position:absolute;inset:0;background:#000;z-index:10;transition:opacity .6s ease,transform .8s cubic-bezier(.7,0,.2,1)}
.lc-pre.out{opacity:0;transform:translateY(-6%);pointer-events:none}
.lc-pre.gone{display:none}
.lc-g{position:absolute;font:400 23px/31px ${GR};white-space:pre;letter-spacing:-.005em}
.lc-wm{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:10px;font:400 30px/1 ${SE};color:#fff;white-space:pre}
.lc-wm .ic{display:inline-block;width:16px;height:16px;border:1.5px solid #fff;opacity:0;transition:opacity .2s}
.lc-wm .ic.on{opacity:1}
.lc-wm .l{display:inline-block}
.lc-wm .l.s{font-family:${GR};font-size:21px;opacity:.85}
.lc-ctl{position:absolute;right:20px;bottom:20px;z-index:20;display:flex;gap:8px;align-items:center;font:600 12px ${GR}}
.lc-ctl button{all:unset;cursor:pointer;padding:8px 13px;border-radius:999px;background:#ffffff1f;color:#fff;backdrop-filter:blur(8px);border:1px solid #ffffff30}
.lc-ctl button:hover{background:#ffffff38}.lc-ctl button.on{background:${CY};color:#000;border-color:${CY}}
.lc-ctl .seg{display:flex;gap:2px;padding:3px;border-radius:999px;background:#0006;border:1px solid #ffffff30}.lc-ctl .seg button{padding:5px 10px;border:0;background:none}.lc-ctl .seg button.on{background:#fff;color:#000}
.lc-note{position:absolute;left:50%;top:70px;transform:translateX(-50%);z-index:20;background:#000c;color:${CY};font:500 13px ${GR};padding:8px 14px;border-radius:999px;opacity:0;transition:opacity .3s;pointer-events:none}
.lc-note.on{opacity:1}
.lc-dots{position:absolute;right:40px;bottom:34px;z-index:3;display:flex;gap:6px}.lc-dots i{width:22px;height:2px;background:#ffffff55}.lc-dots i.on{background:${CY}}
`; root.append(st);
  const stage = h('div.lc'); root.append(stage);
  // ---------- homepage ----------
  const home = h('div.lc-home'); const cv = h('canvas.lc-cv'); home.append(cv);
  const ast = `<svg width="30" height="20" viewBox="0 0 30 20" style="vertical-align:-2px"><g stroke="${CY}" stroke-width="1.6" fill="none"><path d="M3 12q12-14 24 0"/><path d="M9 4v12M3 10h12M5 6l8 8M13 6l-8 8"/><path d="M21 6v8M17 10h8M18 7l6 6M24 7l-6 6"/></g></svg>`;
  home.append(h('nav.lc-nav', {}, h('a.c', {}, 'Locomotive', h('sup', {}, '®')), h('span', { style: { marginLeft: '64px' }, html: ast }), h('span.sp'), h('span', {}, h('a', {}, 'Work'), ', ', h('a', {}, 'Agency'), ', ', h('a', {}, 'Careers'), ', ', h('a', {}, 'Store')), h('span', { style: { width: '22%' } }), h('a.c', {}, 'Let’s talk')));
  const hero = h('div.lc-hero', {},
    h('div.r', {}, h('span.lc-up', { style: { display: 'flex', alignItems: 'center', gap: '16px' } }, h('span.lc-badge', {}, h('b', {}, 'OPS'), h('i', {}, h('span', {}, 'DES'), h('span', {}, 'DEV'))), h('span', {}, 'Locomotive', h('sup', {}, '®')))),
    h('div.r', {}, h('span.lc-up', { style: { transitionDelay: '.12s' } }, 'Digital-first Design Agency', h('span', { style: { fontFamily: GR, fontWeight: 200, fontSize: '64px', margin: '0 4px 0 6px' } }, '✳'), h('span.lc-loco', {}, h('u', {}, 'LOCO')))));
  const dots = h('div.lc-dots'); home.append(hero, dots);
  stage.append(home);
  // canvas slides (generative stand-ins for the campaign photos)
  const ctx = cv.getContext('2d'); const off = document.createElement('canvas'); const octx = off.getContext('2d'); const sm = document.createElement('canvas'); const sctx = sm.getContext('2d');
  const figure = (c, w, hh, col, x0 = 0.5, sc0 = 1, blur = 22) => { const cx = w * x0, s0 = hh * sc0; c.save(); c.filter = `blur(${blur}px)`; const g = c.createRadialGradient(cx, hh * 0.42, s0 * 0.05, cx, hh * 0.45, s0 * 0.42); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]); c.fillStyle = g;
    c.beginPath(); c.ellipse(cx, hh * 0.4, s0 * 0.17, s0 * 0.24, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.moveTo(cx - s0 * 0.5, hh); c.bezierCurveTo(cx - s0 * 0.45, hh * 0.78, cx - s0 * 0.2, hh * 0.74, cx - s0 * 0.09, hh * 0.62); c.lineTo(cx + s0 * 0.09, hh * 0.62); c.bezierCurveTo(cx + s0 * 0.2, hh * 0.74, cx + s0 * 0.45, hh * 0.78, cx + s0 * 0.5, hh); c.fill(); c.restore(); };
  const SLIDES = [
    (c, w, hh) => { const g = c.createRadialGradient(w * 0.5, hh * 0.4, 10, w * 0.5, hh * 0.5, w * 0.7); g.addColorStop(0, '#ff3a26'); g.addColorStop(1, '#c7130e'); c.fillStyle = g; c.fillRect(0, 0, w, hh);
      figure(c, w, hh, ['#2a0303', '#a3100c00'], 0.5, 1.2, 28); c.save(); c.filter = 'blur(10px)'; c.fillStyle = '#12010166'; [[0.455, 0.37], [0.545, 0.37]].forEach(([x, y]) => { c.beginPath(); c.ellipse(w * x, hh * y, hh * 0.04, hh * 0.018, 0, 0, 7); c.fill(); }); c.fillStyle = '#ff6a5a33'; c.beginPath(); c.ellipse(w * 0.5, hh * 0.47, hh * 0.03, hh * 0.06, 0, 0, 7); c.fill(); c.restore();
      c.fillStyle = '#5a4bff'; [[0.52, 0.07], [0.54, 0.065]].forEach(([x, y]) => { c.beginPath(); c.arc(w * x, hh * y, 5, 0, 7); c.fill(); }); },
    (c, w, hh) => { c.fillStyle = '#b8d4e2'; c.fillRect(0, 0, w, hh); c.strokeStyle = '#2b3138'; c.lineCap = 'butt'; c.lineWidth = hh * 0.05;
      const arrow = (x, y, L, a) => { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(-L, 0); c.lineTo(L, 0); c.moveTo(L - L * 0.45, -L * 0.45); c.lineTo(L, 0); c.lineTo(L - L * 0.45, L * 0.45); c.stroke(); c.restore(); };
      arrow(w * 0.18, hh * 0.35, hh * 0.28, 0); arrow(w * 0.82, hh * 0.45, hh * 0.24, Math.PI); c.save(); c.translate(w * 0.62, hh * 0.25); for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 4); c.beginPath(); c.moveTo(-hh * 0.18, 0); c.lineTo(hh * 0.18, 0); c.stroke(); } c.restore();
      figure(c, w, hh, ['#f2f2f2', '#c9d6dd'], 0.42, 1.05); c.fillStyle = '#5a3a2a'; c.beginPath(); c.ellipse(w * 0.42, hh * 0.3, hh * 0.14, hh * 0.13, 0, Math.PI, 0); c.fill(); },
    (c, w, hh) => { c.fillStyle = '#1f53ff'; c.fillRect(0, 0, w, hh); c.fillStyle = '#9fd6ff55'; c.font = `${hh * 0.3}px ${SE}`; c.fillText('Design &', w * 0.36, hh * 0.38); c.fillText('Loco', w * 0.72, hh * 0.72);
      figure(c, w, hh, ['#0b1440', '#14246f00'], 0.38, 1.2); c.fillStyle = '#a8e2ff66'; c.font = `${hh * 0.22}px ${SE}`; c.fillText('ign &', w * 0.33, hh * 0.52); },
    (c, w, hh) => { c.fillStyle = '#050505'; c.fillRect(0, 0, w, hh); c.save(); c.filter = 'blur(3px)'; c.fillStyle = '#e8e8e8'; c.font = `italic ${hh * 0.24}px ${SE}`; c.textBaseline = 'middle'; c.save(); c.translate(w * 0.5, hh * 0.45); c.scale(1, 0.9); c.textAlign = 'center'; c.fillText('ʎɐuɐƃǝ⅂ocoMo', 0, 0); c.restore(); c.restore(); },
  ];
  let slide = 0, blockPx = 1, slideT = null, homeShown = false;
  const fit = () => { const w = stage.clientWidth || 1200, hh = stage.clientHeight || 800; [cv, off].forEach((c) => { c.width = w; c.height = hh; }); };
  const render = () => { const w = cv.width, hh = cv.height; octx.filter = 'none'; SLIDES[slide](octx, w, hh); if (blockPx <= 1) { ctx.drawImage(off, 0, 0); return; }
    const bw = Math.max(1, Math.ceil(w / blockPx)), bh = Math.max(1, Math.ceil(hh / blockPx)); sm.width = bw; sm.height = bh; sctx.imageSmoothingEnabled = true; sctx.drawImage(off, 0, 0, bw, bh); ctx.imageSmoothingEnabled = false; ctx.drawImage(sm, 0, 0, bw, bh, 0, 0, w, hh); };
  const updDots = () => dots.replaceChildren(...SLIDES.map((_, i) => h('i', { class: i === slide ? 'on' : '' })));
  const goSlide = async (n, id) => { if (reduced()) { slide = n; blockPx = 1; render(); updDots(); return; }
    for (const b of [6, 14, 30, 56]) { if (id !== run) return; blockPx = b; render(); await sleep(55); } slide = n; updDots();
    for (const b of [56, 30, 14, 6, 1]) { if (id !== run) return; blockPx = b; render(); await sleep(55); } };
  const loopSlides = (id) => { clearTimeout(slideT); slideT = setTimeout(async () => { if (id !== run || !document.body.contains(stage)) return; await goSlide((slide + 1) % SLIDES.length, id); loopSlides(id); }, 3800); };
  new ResizeObserver(() => { fit(); render(); }).observe(stage);
  // ---------- preloader ----------
  const pre = h('div.lc-pre'); const gA = h('div.lc-g'), gB = h('div.lc-g'), wm = h('div.lc-wm'); pre.append(gA, gB, wm); stage.append(pre);
  const note = h('div.lc-note'); stage.append(note);
  const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=/\\<>[]{}?!$@^~|;:';
  const rg = () => GL[Math.floor(Math.random() * GL.length)];
  const garble = (s0, keep) => s0.split('').map((ch, i) => (i < keep || ch === ' ' ? ch : rg())).join('');
  let run = 0, speed = 1, mode = 'system', log = [], doneRes = null;
  const reduced = () => mode === 'reduce' || (mode === 'system' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const W = (ms) => sleep(ms / speed);
  const ok = (id) => id === run && document.body.contains(stage);
  const line = (g) => { const d = h('div', {}, '\u00a0'); g.append(d); return d; };
  const typeLine = async (el, text, id, cut = text.length, ms = 30) => { for (let i = 1; i <= cut; i++) { if (!ok(id)) return; el.textContent = text.slice(0, i) + (i < cut ? rg() + (Math.random() < 0.5 ? rg() : '') : ''); await W(ms); } el.textContent = text.slice(0, cut) || '\u00a0'; };
  const scrambleTo = async (el, from, to, id, frames = 10) => { for (let f = 0; f <= frames; f++) { if (!ok(id)) return; const keep = Math.floor((f / frames) * to.length); const len = Math.round(from.length + ((to.length - from.length) * f) / frames); let o = ''; for (let j = 0; j < len; j++) o += j < keep ? to[j] || '' : to[j] === ' ' ? ' ' : rg(); el.textContent = o || '\u00a0'; await W(38); } el.textContent = to; };
  const retract = async (el, id) => { let t = el.textContent; while (t.trim().length) { if (!ok(id)) return; t = t.slice(0, -1); el.textContent = t.length > 2 && Math.random() < 0.3 ? t.slice(0, -1) + rg() : t || '\u00a0'; await W(12); } el.textContent = '\u00a0'; };
  const WORD = 'Locomotive';
  const buildWm = () => { const sup = h('sup', { style: { fontSize: '13px', opacity: 0, fontFamily: GR, verticalAlign: '1.1em', marginLeft: '2px' } }, '®'); wm.replaceChildren(h('span.ic'), h('span', {}, ...WORD.split('').map(() => h('span.l', {}, '\u00a0')), sup)); wm.sup = sup; };
  const revealWm = async (id) => { wm.firstChild.classList.add('on'); const ls = [...wm.querySelectorAll('.l')];
    await Promise.all(ls.map(async (sp0, i) => { await W(90 * i); for (let f = 0; f < 5 + Math.floor(Math.random() * 5); f++) { if (!ok(id)) return; sp0.textContent = rg(); sp0.classList.add('s'); await W(48); } sp0.classList.remove('s'); sp0.textContent = WORD[i]; }));
    if (!ok(id)) return; wm.sup.style.opacity = 1; log.push(`wordmark settled "${ls.map((x) => x.textContent).join('')}"`); };
  const position = () => { const w = stage.clientWidth, hh = stage.clientHeight; gA.style.left = Math.round(w * 0.34) + 'px'; gA.style.bottom = Math.round(hh * 0.5 + 34) + 'px'; gB.style.left = Math.round(w * 0.42) + 'px'; gB.style.top = Math.round(hh * 0.5 + 34) + 'px'; };
  const showHome = (instant) => { pre.classList.add('out'); home.classList.add('on'); if (instant) { home.style.transition = 'none'; home.querySelectorAll('.lc-up').forEach((e) => (e.style.transition = 'none')); pre.classList.add('gone'); } else { home.style.transition = ''; home.querySelectorAll('.lc-up').forEach((e) => (e.style.transition = '')); setTimeout(() => pre.classList.contains('out') && pre.classList.add('gone'), 900 / speed); } homeShown = true; };
  const intro = async () => { const id = ++run; log = []; clearTimeout(slideT); homeShown = false; slide = 0; updDots(); fit(); position();
    home.classList.remove('on'); pre.classList.remove('out', 'gone'); gA.replaceChildren(); gB.replaceChildren(); buildWm();
    const finish = () => { if (doneRes) { doneRes(log.slice()); doneRes = null; } };
    if (reduced()) { blockPx = 1; render(); showHome(true); log.push('prefers-reduced-motion → intro skipped, homepage shown instantly'); note.textContent = 'Reduced motion: intro skipped'; note.classList.add('on'); setTimeout(() => note.classList.remove('on'), 2200); finish(); return; }
    note.classList.remove('on');
    await W(250); const wmP = revealWm(id);
    // group A: type, then echo downward and morph into "Agency"
    const A = ['Digital-First Design', 'Digital-First Agency'];
    const a1 = line(gA); await typeLine(a1, A[0], id); if (!ok(id)) return; log.push(`A typed "${a1.textContent}"`);
    const bP = (async () => { await W(260); const B = [['Based in Montreal', 3], ['Based in Montreal', 17], ['Based in Montreal', 17], ['Based in Montreal, Canada', 25], ['45.5019° N, 73.5674° W', 9]]; const els = [];
      await Promise.all(B.map(async ([t, cut], i) => { await W(170 * i); if (!ok(id)) return; const e = line(gB); els.push(e); if (i === 4) e.style.paddingLeft = '20px'; await typeLine(e, t, id, cut, 26); if (i === 3) { await W(200); await scrambleTo(e, e.textContent, 'Based in Montreal', id, 8); } }));
      log.push(`B lines: ${[...gB.children].map((e) => e.textContent.trim()).join(' | ')}`); })();
    const a2 = line(gA); await typeLine(a2, A[0], id, A[0].length, 18); await scrambleTo(a2, A[0], A[1], id, 9);
    const a3 = line(gA); await typeLine(a3, A[1], id, A[1].length, 16);
    const a4 = line(gA); await typeLine(a4, 'Digital-First Agency', id, 14, 14); await scrambleTo(a4, a4.textContent, A[1], id, 8);
    const a0 = h('div', { style: { paddingLeft: '120px' } }, '\u00a0'); gA.prepend(a0); await typeLine(a0, 'X u}V#H[', id, 8, 20);
    await Promise.all([bP, wmP]); if (!ok(id)) return;
    log.push(`A echoes: ${gA.children.length} lines, last "${a4.textContent}"`);
    await W(380);
    // retract in reverse order (last line first, group B then A)
    const all = [...gA.children, ...gB.children]; for (const e of all.reverse()) { await retract(e, id); if (!ok(id)) return; }
    log.push(`retracted: ${all.reduce((n, e) => n + e.textContent.trim().length, 0)} chars left`);
    await W(320); if (!ok(id)) return;
    // hand-off
    blockPx = 56; render(); showHome(false); log.push('hand-off: preloader fades/slides up, homepage reveals');
    for (const b of [56, 30, 14, 6, 1]) { if (!ok(id)) return; blockPx = b; render(); await W(70); }
    loopSlides(id); finish(); };
  // ---------- controls ----------
  const segBtns = {}; const seg0 = h('div.seg', {}, [['system', 'OS motion'], ['reduce', 'Reduce'], ['full', 'Full']].map(([k0, l]) => (segBtns[k0] = h('button', { class: k0 === mode ? 'on' : '', title: 'prefers-reduced-motion handling', onclick: () => { mode = k0; Object.entries(segBtns).forEach(([kk, b]) => b.classList.toggle('on', kk === mode)); intro(); } }, l))));
  const replay = h('button', { title: 'Replay the preloader', onclick: () => intro() }, '↺ Replay intro');
  stage.append(h('div.lc-ctl', {}, seg0, replay));
  stage.addEventListener('keydown', (e) => { if (e.key === 'r') intro(); });
  document.fonts.load(`40px 'Instrument Serif'`).catch(() => {}).finally(() => { fit(); render(); intro(); });
  window.__demoProof = async () => { const out = []; speed = 5;
    const p = new Promise((r) => (doneRes = r)); mode = 'full'; intro(); const L1 = await Promise.race([p, sleep(9000).then(() => ['timeout'])]); out.push(...L1);
    out.push(`home visible=${home.classList.contains('on')}, preloader hidden=${pre.classList.contains('out')}`);
    const p2 = new Promise((r) => (doneRes = r)); mode = 'reduce'; intro(); const L2 = await Promise.race([p2, sleep(2000).then(() => ['timeout'])]); out.push(...L2);
    const s0 = slide; await goSlide((slide + 1) % SLIDES.length, run); out.push(`slide ${s0} → ${slide} (instant under reduce)`);
    mode = 'system'; Object.entries(segBtns).forEach(([kk, b]) => b.classList.toggle('on', kk === mode)); speed = 1; slide = 0; blockPx = 1; render(); updDots(); showHome(true); note.classList.remove('on'); loopSlides(run);
    out.push('restored: homepage, slide 0, OS motion mode'); return out.join('; '); };
};

V['gsap-kinetic-letter-assembly-hero-shape-confetti-scroll-tool-cards'] = (root, T) => {
  theme(root, T, { bg: '#0e100f', fg: '#fffce1', ac: '#0ae448', dark: true });
  import('@fontsource-variable/dm-sans');
  const F = "'DM Sans Variable','Helvetica Neue',Arial,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = { bg: '#0e100f', cr: '#fffce1', lime: '#0ae448', lime2: '#abff84', pink: '#fec5fb', org: '#ff8709', lil: '#9d95ff', blue: '#00bae2', gry: '#bbbaa6' };
  // ---------- code-drawn shapes (stand-ins, no copied artwork) ----------
  let gid = 0;
  const SH = {
    pin: () => { const g = 'gp' + gid++; return `<svg viewBox="0 0 100 100"><defs><linearGradient id="${g}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ff8709"/><stop offset="1" stop-color="#f7bdf8"/></linearGradient></defs>${[0, 90, 180, 270].map((r) => `<path transform="rotate(${r} 50 50)" d="M50 50 C49 27 60 5 92 4 C93 30 76 50 50 50Z" fill="url(#${g})"/>`).join('')}</svg>`; },
    ast: () => { const g = 'ga' + gid++; return `<svg viewBox="0 0 100 100"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6d4d"/><stop offset="1" stop-color="#ffc2ad"/></linearGradient></defs><g stroke="url(#${g})" stroke-width="12" stroke-linecap="round">${[0, 45, 90, 135].map((r) => `<line transform="rotate(${r} 50 50)" x1="50" y1="10" x2="50" y2="90"/>`).join('')}</g></svg>`; },
    bolt: () => `<svg viewBox="0 0 100 100"><polygon points="62,0 16,60 46,58 30,100 84,34 54,36 72,0" fill="#0ae448"/></svg>`,
    sq: () => { const g = 'gq' + gid++; return `<svg viewBox="0 0 100 100" style="overflow:visible"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7f6dff"/><stop offset=".6" stop-color="#b9a4ff"/><stop offset="1" stop-color="#e4b7ff"/></linearGradient></defs><path d="M40 4 C78 14 18 30 58 44 C96 58 20 66 50 82 C66 90 70 96 62 100" fill="none" stroke="url(#${g})" stroke-width="15" stroke-linecap="round"/><path d="M42 6 C74 15 22 30 58 42" fill="none" stroke="#fff6" stroke-width="3" stroke-linecap="round"/></svg>`; },
    ring: () => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="none" stroke="#ff8709" stroke-width="16"/></svg>`,
    flower: () => `<svg viewBox="0 0 100 100">${[0, 60, 120, 180, 240, 300].map((r) => `<circle transform="rotate(${r} 50 50)" cx="50" cy="24" r="20" fill="#fec5fb"/>`).join('')}<circle cx="50" cy="50" r="14" fill="#f58fe8"/></svg>`,
    dots: () => `<svg viewBox="0 0 100 50"><circle cx="25" cy="25" r="22" fill="#3b2a55"/><circle cx="72" cy="25" r="22" fill="#4a3366"/></svg>`,
    dia: () => { const g = 'gd' + gid++; return `<svg viewBox="0 0 100 100"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9d95ff"/><stop offset="1" stop-color="#6c3bff"/></linearGradient></defs><rect x="22" y="22" width="56" height="56" rx="4" transform="rotate(45 50 50)" fill="url(#${g})"/></svg>`; },
    arc: () => { const g = 'gr' + gid++; return `<svg viewBox="0 0 100 100"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7ee2"/><stop offset="1" stop-color="#c04bd8"/></linearGradient></defs><path d="M92 20 A42 42 0 0 1 10 60 L30 58 A24 24 0 0 0 74 24 Z" fill="url(#${g})"/></svg>`; },
    horn: () => `<svg viewBox="0 0 100 100" fill="none" stroke="#fffce1" stroke-width="5" stroke-linejoin="round"><path d="M30 92 L26 56 L18 22 Q16 12 25 12 Q32 12 33 22 L40 46 L46 18 Q48 8 57 10 Q64 12 62 22 L58 50 L70 34 Q76 26 82 32 Q86 37 80 46 L66 72 Q60 86 46 92 Z"/></svg>`,
  };
  css(`.gs{position:absolute;inset:0;background:${C.bg};color:${C.cr};font-family:${F};overflow:hidden}
.gs *{box-sizing:border-box}.gs svg{display:block;width:100%;height:100%}
.gs-sc{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:#333 ${C.bg}}
.gs-ban{height:50px;background:linear-gradient(90deg,#0ae448 0%,#abff84 60%,#abff84 100%);color:#0e100f;display:flex;align-items:center;justify-content:center;gap:12px;font:400 14.5px ${F};letter-spacing:-.01em}
.gs-ban u{cursor:pointer;text-underline-offset:2px}.gs-ban i{width:20px;height:16px;display:inline-block}
.gs-nav{position:sticky;top:0;z-index:20;height:76px;background:${C.bg};display:flex;align-items:center;margin:0 40px;border-bottom:1px solid #fffce12a}
.gs-logo{font:italic 850 38px/1 ${F};letter-spacing:-.06em;color:${C.cr};cursor:pointer;transform:skewX(-6deg);margin-right:44px}
.gs-nav nav{display:flex;gap:24px;font:420 19.5px ${F};color:${C.gry}}.gs-nav nav a,.gs-nav .lg{cursor:pointer;transition:color .2s}.gs-nav nav a:hover,.gs-nav .lg:hover{color:${C.cr}}
.gs-nav .sp{flex:1}.gs-nav .lg{font:420 17px ${F};color:${C.gry};margin-right:16px}
.gs .gs-pill{height:34px;padding:0 13px;border-radius:99px;border:1.5px solid ${C.cr};background:transparent;color:${C.cr};font:520 17px ${F};cursor:pointer;transition:background .2s,color .2s}
.gs .gs-pill:hover{background:${C.cr};color:${C.bg}}
.gs-hero{position:relative;height:calc(100vh - 38px - 126px);min-height:640px;cursor:pointer;user-select:none}
.gs-line{position:absolute;white-space:nowrap;font-weight:500;line-height:1;letter-spacing:-.025em;color:${C.cr}}
.gs-l{display:inline-block;position:relative}
.gs-l .ch{display:inline-block;transform-origin:50% 85%}
.gs-l .sh{position:absolute;left:50%;top:52%;width:.5em;height:.5em;margin:-.25em 0 0 -.25em;transform:scale(0);pointer-events:none}
.gs-deco{position:absolute;pointer-events:none;transform-origin:50% 50%}
.gs-tag{position:absolute;left:96px;bottom:13%;display:flex;align-items:center;gap:14px;font:420 22px/1.25 ${F};letter-spacing:-.01em}
.gs-tag .br{font:200 92px/1 ${F};transform:scaleX(.55);color:${C.cr};margin-top:-14px}
.gs .gs-get{position:absolute;right:97px;bottom:13.4%;height:58px;padding:0 50px;border-radius:99px;border:2px solid transparent;background:linear-gradient(${C.bg},${C.bg}) padding-box,linear-gradient(90deg,#0ae448,#abff84) border-box;color:${C.cr};font:500 22px ${F};display:flex;align-items:center;gap:10px;cursor:pointer;transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.gs .gs-get:hover{transform:scale(1.05)}.gs-get i{width:24px;height:24px;border:2px solid ${C.cr};border-radius:50%;display:grid;place-items:center;font:700 12px ${F};font-style:normal}
.gs-why{position:relative;padding:150px 40px 120px;display:grid;grid-template-columns:1.25fr 1fr;gap:60px}
.gs-why h3{grid-column:1/-1;margin:0;font:420 20px ${F};color:${C.gry}}
.gs-why p{margin:0;font:420 52px/1.12 ${F};letter-spacing:-.025em}
.gs-why p span{opacity:.14;transition:opacity .25s,color .25s}.gs-why p span.on{opacity:1}.gs-why p span.lime.on{color:${C.lime}}
.gs-why .art{position:relative}.gs-why .art .gs-deco{transition:transform .9s cubic-bezier(.34,1.56,.64,1)}
.gs-why .tagp{display:inline-block;background:${C.pink};color:${C.bg};font:520 26px ${F};padding:6px 14px;border-radius:5px;margin-top:20px}
.gs-why .sub{grid-column:1/-1;border-top:1px solid #fffce12a;padding-top:40px;display:grid;grid-template-columns:1.25fr 1fr;gap:60px}
.gs-why .sub b{font:500 44px/1.1 ${F};letter-spacing:-.03em}.gs-why .sub span{font:400 24px/1.4 ${F};color:${C.gry}}
.gs-ease{position:relative;height:3600px}
.gs-ease .st{position:sticky;top:76px;height:calc(100vh - 38px - 76px);overflow:hidden}
.gs-ease .lab{position:absolute;left:40px;top:40px;font:420 20px ${F};color:${C.gry}}
.gs-trk{position:absolute;top:44%;left:0;display:flex;align-items:center;white-space:nowrap;font:500 104px/1 ${F};letter-spacing:-.035em;will-change:transform}
.gs-trk .w{display:inline-block;margin-right:.26em;will-change:transform,opacity}
.gs-trk .ic{display:inline-block;width:1.05em;height:1.05em;margin-right:.26em;vertical-align:middle}
.gs-trk .curve{display:inline-block;width:2.4em;height:1.6em;margin-right:.3em;vertical-align:middle}
.gs-tools{padding:80px 40px 40px}
.gs-brace{display:inline-flex;align-items:center;gap:6px;font:500 15px ${F};color:${C.cr};margin-bottom:30px}.gs-brace b{font:200 40px/1 ${F};transform:scaleX(.6)}
.gs-row{display:grid;grid-template-columns:220px 1fr;gap:40px;align-items:center;padding:44px 0;border-bottom:1px solid #fffce12a;opacity:0;transform:translateY(60px);transition:opacity .7s,transform .9s cubic-bezier(.2,.8,.2,1);cursor:pointer}
.gs-row.in{opacity:1;transform:none}
.gs-row .icn{position:relative;width:170px;height:170px}
.gs-row .icn>*{position:absolute;transition:transform .7s cubic-bezier(.34,1.56,.64,1),border-radius .7s}
.gs-row:hover .icn>*:nth-child(1),.gs-row.hov .icn>*:nth-child(1){transform:rotate(-14deg) translate(-8px,-6px)}
.gs-row:hover .icn>*:nth-child(2),.gs-row.hov .icn>*:nth-child(2){transform:rotate(90deg) scale(1.08);border-radius:50%}
.gs-row h4{margin:0 0 18px;font:500 34px ${F};letter-spacing:-.02em}
.gs-row p{margin:0 0 26px;font:420 38px/1.18 ${F};letter-spacing:-.025em;max-width:720px}
.gs .gs-row .gs-pill{height:44px;padding:0 20px;font-size:18px}
.gs-brands{padding:90px 40px}
.gs-logos{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:30px;color:${C.cr};opacity:.92}
.gs-logos span{font-size:30px;letter-spacing:-.02em}
.gs-show{padding:20px 40px 120px}.gs-show h2{margin:0 0 30px;font:500 88px/1 ${F};letter-spacing:-.04em}
.gs-cards{display:flex;gap:22px;overflow:hidden}.gs-card{flex:0 0 380px;height:250px;border-radius:12px;position:relative;overflow:hidden;transition:transform .4s cubic-bezier(.34,1.56,.64,1)}
.gs-card:hover{transform:translateY(-8px) rotate(-1deg)}.gs-card b{position:absolute;left:18px;bottom:16px;font:600 20px ${F};color:#0e100f;background:#fffce1;padding:4px 10px;border-radius:6px}
.gs-ft{padding:40px;border-top:1px solid #fffce12a;display:flex;justify-content:space-between;font:400 15px ${F};color:${C.gry}}
`);
  const el = h('div.gs'); root.append(el);
  // ---------- hero letters ----------
  const W1 = 'Animate', W2 = 'anything';
  const slots = [];
  const mkLine = (word, li) => h('div.gs-line', {}, [...word].map((c, i) => { const ch = h('span.ch', {}, c); const sh = h('span.sh'); const sp = h('span.gs-l', {}, ch, sh); const o = { el: sp, ch, sh, c, li, i, swapped: null }; slots.push(o);
      sp.addEventListener('mouseenter', () => hoverSlot(o)); return sp; }));
  const L1 = mkLine(W1, 0), L2 = mkLine(W2, 1);
  const slot = (li, i) => slots.find((o) => o.li === li && o.i === i);
  const pinD = h('div.gs-deco', { html: SH.pin() }), sqD = h('div.gs-deco', { html: SH.sq() }), dotD = h('div.gs-deco', { html: SH.dots() });
  slot(0, 1).el.append(pinD); slot(1, 4).el.append(sqD); slot(0, 3).el.append(dotD);
  Object.assign(pinD.style, { width: '.46em', height: '.46em', left: '-.22em', top: '-.33em' });
  Object.assign(sqD.style, { width: '.32em', height: '.42em', left: '-.17em', top: '.56em', transform: 'rotate(8deg)' });
  Object.assign(dotD.style, { width: '.34em', height: '.17em', left: '-.1em', top: '-.36em', opacity: 0 });
  const tag = h('div.gs-tag', {}, h('span.br', {}, '{'), h('span', {}, 'GSAP – A wildly robust JavaScript', h('br'), 'animation library built for professionals'), h('span.br', {}, '}'));
  const getB = h('button.gs-get', { onclick: (e) => { e.stopPropagation(); toast('npm install gsap'); } }, 'Get GSAP', h('i', {}, '↓'));
  const hero = h('section.gs-hero', { title: 'Click to replay the letter assembly', onclick: () => replay() }, L1, L2, tag, getB);
  const fit = () => { const Wd = hero.clientWidth || 1440; let fs = parseFloat(L1.style.fontSize) || 200; for (let k = 0; k < 3; k++) { [L1, L2].forEach((l) => (l.style.fontSize = fs + 'px')); const w1 = L1.getBoundingClientRect().width || 1, w2 = L2.getBoundingClientRect().width || 1; fs = Math.min(280, fs * Math.min((Wd * 0.6) / w1, (Wd * 0.62) / w2)); } [L1, L2].forEach((l) => (l.style.fontSize = fs + 'px'));
    const Hh = hero.clientHeight; Object.assign(L1.style, { left: Wd * 0.067 + 'px', top: Hh * 0.115 + 'px' }); Object.assign(L2.style, { left: Wd * 0.305 + 'px', top: Hh * 0.115 + fs * 0.86 + 'px' }); };
  // ---------- nav ----------
  const ban = h('div.gs-ban', {}, h('i', { html: '<svg viewBox="0 0 20 16"><path d="M2 6h3l8-4v12l-8-4H2z M15 5c1.5 1 1.5 5 0 6" fill="none" stroke="#0e100f" stroke-width="1.6" stroke-linejoin="round"/></svg>' }), h('span', {}, 'GSAP is now ', h('u', { onclick: () => toast('free for everyone') }, 'free for everyone'), ', thanks to Webflow’s support!'));
  const nav = h('header.gs-nav', {}, h('span.gs-logo', { onclick: () => (sc.scrollTop = 0) }, 'GSAP'), h('nav', {}, ['Tools', 'Showcase', 'Community', 'Learn GSAP', 'Docs', 'Demos'].map((t) => h('a', { onclick: () => { const tg = { Tools: tools, Showcase: show }[t]; if (tg) sc.scrollTo({ top: tg.offsetTop - 76, behavior: RM ? 'auto' : 'smooth' }); else toast(t); } }, t))),
    h('span.sp'), h('span.lg', { onclick: () => toast('Login/Create Account') }, 'Login/Create Account'), h('button.gs-pill', { onclick: () => toast('npm install gsap') }, 'Get GSAP'));
  // ---------- Why GSAP ----------
  const WHY = 'GSAP lets you effortlessly animate anything JS can touch. Silky-smooth performance and rock-solid support so you can focus on the fun stuff.'.split(' ');
  const whyP = h('p', {}, WHY.flatMap((w) => [h('span' + (w === 'effortlessly' ? '.lime' : ''), {}, w), ' ']));
  const flw = h('div.gs-deco', { html: SH.flower(), style: { width: '190px', height: '190px', left: '60px', top: '40px', transform: 'scale(0) rotate(-90deg)' } });
  const rng2 = h('div.gs-deco', { html: SH.ring(), style: { width: '150px', height: '150px', left: '260px', top: '200px', transform: 'scale(0)' } });
  const astW = h('div.gs-deco', { html: SH.ast(), style: { width: '90px', height: '90px', left: '360px', top: '20px', transform: 'scale(0) rotate(-120deg)' } });
  const why = h('section.gs-why', {}, h('h3', {}, 'Why GSAP®'), h('div', {}, whyP, h('span.tagp', {}, 'Animate Anything')), h('div.art', {}, flw, rng2, astW),
    h('div.sub', {}, h('b', {}, 'That’s right, Anything'), h('span', {}, 'Whether you’re animating UI, SVG or building immersive WebGL scenes, GSAP has your back.')));
  // ---------- ease scrub ----------
  const curve = h('span.curve', { html: '<svg viewBox="0 0 240 160" style="overflow:visible"><line x1="20" y1="150" x2="20" y2="10" stroke="#fffce1" stroke-width="2" stroke-dasharray="4 6"/><path d="M20 150 C120 150 90 10 230 10" fill="none" stroke="#fffce1" stroke-width="4"/><rect x="8" y="138" width="22" height="22" fill="#abff84"/><circle cx="230" cy="10" r="10" fill="#0ae448"/></svg>' });
  const SEQ = ['Add', 'personality', 'to', 'your', ['ic', 'horn'], 'animations', 'with', 'eases,', ['ic', 'arc'], 'or', 'build', 'your', 'own', curve, 'custom', 'curves.', ['ic', 'ast'], 'Choreograph', 'sequences', 'in', 'a', ['ic', 'dia'], 'snap.'];
  const trk = h('div.gs-trk', {}, SEQ.map((x) => (typeof x === 'string' ? h('span.w', {}, x) : x.nodeType ? x : h('span.ic.w', { html: SH[x[1]]() }))));
  const easeSec = h('section.gs-ease', {}, h('div.st', {}, h('div.lab', {}, 'Nice and easy easing'), trk));
  // ---------- tools ----------
  const sqr = (bg, x, y, w, hh, r = 6) => h('i', { style: { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px', background: bg, borderRadius: r + 'px' } });
  const TOOLS = [['Scroll', C.lime, 'Create jaw-dropping scroll-based animations with minimal code.', [sqr('linear-gradient(135deg,#0ae448,#abff84)', 10, 40, 110, 110, 14), sqr('#abff84', 70, 6, 90, 70, 40)]],
    ['SVG', C.org, 'Move, morph and much more with our SVG plugins.', [sqr('linear-gradient(135deg,#ff8709,#ffb347)', 50, 10, 110, 110, 4), sqr('linear-gradient(135deg,#ffd08a,#ff8709)', 6, 70, 92, 92, 46)]],
    ['Text', C.lil, 'Leave them lost for words with seamless text effects.', [sqr('linear-gradient(135deg,#9d95ff,#d6d0ff)', 4, 4, 86, 86, 43), sqr('linear-gradient(135deg,#b5adff,#7c70ff)', 82, 84, 80, 80, 2)]],
    ['UI', C.blue, 'Make your UI pop with interactive draggable, flip and observer magic.', [sqr('linear-gradient(90deg,#00bae2,#7fe7ff)', 4, 46, 160, 62, 31), sqr('#fffce1', 14, 54, 46, 46, 23)]]];
  const rows = TOOLS.map(([n, col, d, icn]) => h('div.gs-row', {}, h('div.icn', {}, icn), h('div', {}, h('h4', { style: { color: col } }, n), h('p', {}, d), h('button.gs-pill', { onclick: (e) => { e.stopPropagation(); toast(`Explore ${n}`); } }, `Explore ${n}`))));
  const tools = h('section.gs-tools', {}, h('div.gs-brace', {}, h('b', {}, '{'), 'GSAP® Tools', h('b', {}, '}')), rows);
  const brands = h('section.gs-brands', {}, h('div.gs-brace', {}, h('b', {}, '{'), 'Brands using GSAP®', h('b', {}, '}')),
    h('div.gs-logos', {}, [['chipco', '700'], ['Vidstream', '800'], ['—netweave—', '500'], ['parcelly', '700'], ['Motorline', 'italic 700'], ['LUMEN', '800']].map(([t, w]) => h('span', { style: { font: `${w} 30px ${F}` } }, t))));
  const show = h('section.gs-show', {}, h('h2', {}, 'Showcase'), h('div.gs-cards', {}, [['#abff84', '#0ae448', 'Gallery'], ['#fec5fb', '#9d95ff', 'Studio'], ['#ffce8a', '#ff8709', 'Lab'], ['#7fe7ff', '#00bae2', 'Agency']].map(([a, b2, t]) => h('div.gs-card', { style: { background: `radial-gradient(circle at 30% 30%,${a},${b2})` } }, h('b', {}, t)))));
  const ft = h('footer.gs-ft', {}, h('span', {}, '© GSAP homepage — demo clone (code-drawn shapes)'), h('span', {}, `${T.date} ${T.slot} KST`));
  const sc = h('div.gs-sc', {}, ban, nav, hero, why, easeSec, tools, brands, show, ft);
  el.append(sc);
  // ---------- animation helpers ----------
  const EB = 'cubic-bezier(.34,1.7,.5,1)', EO = 'cubic-bezier(.2,.8,.2,1)';
  const SCR = 'aimt10e!';
  const shapeOf = { '1,3': 'bolt', '0,5': 'ast', '1,2': 'sq' };
  let anims = [], timers = [], idle = null, idleState = 0, assembling = false;
  const later = (ms, f) => timers.push(setTimeout(f, ms));
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; anims.forEach((a) => a.cancel()); anims = []; clearInterval(idle); };
  const setSwap = (o, kind, instant) => { o.swapped = kind; if (kind) { o.sh.innerHTML = SH[kind](); } const show = !!kind; const d = instant || RM ? 0 : 420;
    anims.push(o.ch.animate([{ transform: getComputedStyle(o.ch).transform === 'none' ? 'scale(1)' : getComputedStyle(o.ch).transform }, { transform: show ? 'scale(0) rotate(-40deg)' : 'scale(1)' }], { duration: d, easing: EB, fill: 'forwards' }));
    anims.push(o.sh.animate([{ transform: show ? 'scale(0) rotate(-90deg)' : 'scale(1)' }, { transform: show ? 'scale(1.05) rotate(0)' : 'scale(0) rotate(90deg)' }], { duration: d, easing: EB, fill: 'forwards' })); };
  const settled = () => { clearAll(); slots.forEach((o) => { o.ch.textContent = o.c; o.ch.style.transform = ''; o.ch.style.opacity = ''; o.swapped = null; o.sh.innerHTML = ''; o.sh.style.transform = 'scale(0)'; });
    [pinD, sqD].forEach((d) => (d.style.opacity = 1)); pinD.style.transform = 'rotate(0)'; sqD.style.transform = 'rotate(8deg)'; dotD.style.opacity = 0;
    setSwap(slot(1, 3), 'bolt', true); idleState = 0; assembling = false; startIdle(); };
  const startIdle = () => { clearInterval(idle); if (RM) return; idle = setInterval(() => { if (assembling) return; idleState ^= 1; const t = slot(1, 3), i = slot(1, 5);
      if (idleState) { setSwap(t, null); i.ch.textContent = '!'; anims.push(i.ch.animate([{ transform: 'translateY(-30%) scale(.6)' }, { transform: 'none' }], { duration: 500, easing: EB })); }
      else { i.ch.textContent = 'i'; setSwap(t, 'bolt'); } }, 2600); };
  function replay() { if (RM) { settled(); return 'reduced-motion: settled instantly'; } clearAll(); assembling = true;
    slots.forEach((o) => { o.swapped = null; o.sh.innerHTML = ''; o.sh.style.transform = 'scale(0)'; o.ch.style.opacity = 0; o.ch.textContent = o.c; });
    [pinD, sqD].forEach((d) => (d.style.opacity = 0)); dotD.style.opacity = 1;
    anims.push(dotD.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)', offset: 0.3 }, { transform: 'scale(1)', offset: 0.8 }, { transform: 'scale(0)' }], { duration: 1800, easing: EO, fill: 'forwards' }));
    slots.forEach((o, k) => { const t0 = k * 85 + (o.li ? 250 : 0); const key = `${o.li},${o.i}`;
      later(t0, () => { o.ch.style.opacity = 1; const scr = (k % 3 === 1) && !shapeOf[key]; if (scr) o.ch.textContent = SCR[k % SCR.length];
        anims.push(o.ch.animate([{ transform: `translateY(${(k % 2 ? -1 : 1) * 60}%) scale(0) rotate(${(k % 5 - 2) * 18}deg)` }, { transform: 'none' }], { duration: 700, easing: EB, fill: 'none' }));
        if (scr) later(320, () => (o.ch.textContent = o.c));
        if (shapeOf[key]) { setSwap(o, shapeOf[key], true); o.sh.innerHTML = SH[shapeOf[key]](); anims.push(o.sh.animate([{ transform: 'scale(0) rotate(-180deg)' }, { transform: 'scale(1.05) rotate(0)' }], { duration: 650, easing: EB, fill: 'forwards' })); later(700 + (key === '1,3' ? 500 : 0), () => setSwap(o, null)); } }); });
    later(1250, () => { pinD.style.opacity = 1; anims.push(pinD.animate([{ transform: 'translate(-120%,60%) scale(0) rotate(-240deg)' }, { transform: 'rotate(0)' }], { duration: 1100, easing: EB })); });
    later(1900, () => { sqD.style.opacity = 1; anims.push(sqD.animate([{ transform: 'translateY(80%) scale(0) rotate(-60deg)' }, { transform: 'rotate(8deg)' }], { duration: 900, easing: EB, fill: 'forwards' })); });
    later(2700, () => { assembling = false; setSwap(slot(1, 3), 'bolt'); startIdle(); });
    return 'replaying'; }
  const hoverSlot = (o) => { if (RM || assembling || o.swapped) return; anims.push(o.ch.animate([{ transform: 'none' }, { transform: 'translateY(-14%) rotate(-8deg) scale(1.08)', offset: 0.35 }, { transform: 'none' }], { duration: 650, easing: EO })); };
  // ---------- scroll-driven ----------
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { root: sc, threshold: 0.2 });
  rows.forEach((r) => io.observe(r));
  const words = [...whyP.querySelectorAll('span')], tw = [...trk.children];
  const onScroll = () => { const vh = sc.clientHeight, st = sc.scrollTop;
    const wr = why.offsetTop - st; const pw = clamp((vh * 0.85 - wr) / (vh * 0.9), 0, 1); words.forEach((w, i) => w.classList.toggle('on', i / words.length < pw * 1.15));
    const bl = pw > 0.45; flw.style.transform = bl ? 'scale(1) rotate(0)' : 'scale(0) rotate(-90deg)'; rng2.style.transform = bl ? 'scale(1)' : 'scale(0)'; astW.style.transform = pw > 0.7 ? 'scale(1) rotate(0)' : 'scale(0) rotate(-120deg)';
    const er = easeSec.offsetTop - 76 - st; const pe = clamp(-er / (easeSec.offsetHeight - (vh - 76)), 0, 1); const W = sc.clientWidth; const tl = trk.scrollWidth;
    trk.style.transform = `translate3d(${W * 0.75 - pe * (tl + W * 0.25)}px,-50%,0)`;
    tw.forEach((w) => { const x = w.offsetLeft + W * 0.75 - pe * (tl + W * 0.25); const t = clamp((W * 0.98 - x) / (W * 0.4), 0, 1); const b = 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2; w.style.transform = RM ? 'none' : `translateY(${(1 - b) * 70}px) rotate(${(1 - t) * 12}deg)`; w.style.opacity = RM ? 1 : 0.15 + 0.85 * t; }); };
  sc.addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { fit(); onScroll(); });
  const boot = () => { fit(); onScroll(); };
  boot(); (document.fonts?.ready || Promise.resolve()).then(() => setTimeout(boot, 60)); setTimeout(boot, 600);
  if (RM) settled(); else replay();
  // ---------- demo proof ----------
  window.__demoProof = async () => { const o = []; sc.scrollTop = 0; await sleep(50); fit();
    o.push(`replay: ${replay()}`); await sleep(RM ? 50 : 3000);
    const vis = slots.filter((s0) => s0.ch.style.opacity !== '0').length; o.push(`assembled ${vis}/${slots.length} letters "${W1} ${W2}", lightning on "t"=${slot(1, 3).swapped || '-'}, pinwheel=${pinD.style.opacity}, squiggle=${sqD.style.opacity}`);
    const s1 = slot(0, 2); s1.el.dispatchEvent(new MouseEvent('mouseenter')); o.push(`hover "${s1.c}" → bounce anims=${s1.ch.getAnimations().length}`);
    sc.scrollTop = why.offsetTop - sc.clientHeight * 0.2; onScroll(); await sleep(80); o.push(`Why section: ${words.filter((w) => w.classList.contains('on')).length}/${words.length} words lit, lime word on=${whyP.querySelector('.lime').classList.contains('on')}, flower=${flw.style.transform}`);
    sc.scrollTop = easeSec.offsetTop - 76 + (easeSec.offsetHeight - sc.clientHeight) * 0.5; onScroll(); await sleep(60); o.push(`ease scrub 50%: track ${trk.style.transform.match(/-?[\d.]+px/)[0]}, visible words ${tw.filter((w) => +w.style.opacity > 0.9).length}`);
    sc.scrollTop = tools.offsetTop; await sleep(400); rows[1].classList.add('hov'); o.push(`tool rows revealed ${rows.filter((r) => r.classList.contains('in')).length}/4, hover SVG icon morph`); rows[1].classList.remove('hov');
    sc.scrollTop = 0; onScroll(); settled(); o.push('restored: top, hero settled'); return o.join('; '); };
};

V['monaspace-type-specimen-outline-node-logo-font-cards-axis-playground-texture-healing'] = (root, T) => {
  theme(root, T, { bg: '#0d1015', fg: '#e6edf3', ac: '#f2a58e', dark: true });
  root.classList.add('scroll'); root.style.overflow = 'auto';
  const MS = '/fonts/monaspace/monaspace-';
  const FONTS = [['Ne', 'Neon', 'Neo-grotesque sans', '#f4ab93'], ['Ar', 'Argon', 'Humanist sans', '#eed36d'], ['Xe', 'Xenon', 'Slab serif', '#c3d96a'], ['Rn', 'Radon', 'Handwriting', '#79d2c6'], ['Kr', 'Krypton', 'Mechanical sans', '#b8a1f6']];
  const fam = (n) => `'Monaspace ${n}',ui-monospace,monospace`;
  const UI = "'Inter Variable','Mona Sans',system-ui,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  css(FONTS.map(([, n]) => `@font-face{font-family:'Monaspace ${n}';src:url(${MS}${n.toLowerCase()}-var.woff2) format('woff2');font-weight:200 800;font-stretch:100% 125%;font-style:oblique 0deg 11deg;font-display:swap}`).join('\n') + `
.ms{position:relative;min-height:100%;background:#0d1015;color:#e6edf3;font:400 15px/1.55 ${UI};overflow-x:hidden}
.ms *{box-sizing:border-box}
.ms-dots{position:absolute;left:0;right:0;top:0;height:760px;background-image:radial-gradient(#ffffff2a 1px,transparent 1.3px);background-size:26px 26px;-webkit-mask-image:linear-gradient(#000 60%,transparent);mask-image:linear-gradient(#000 60%,transparent);pointer-events:none}
.ms-nav{position:relative;z-index:2;display:flex;align-items:center;gap:18px;height:74px;padding:0 0 0 112px;font:600 22px ${UI};color:#e6edf3}
.ms-nav .sl{color:#7d8590;font-weight:400}
.ms-hero{position:relative;z-index:1;text-align:center;padding:96px 0 90px}
.ms-logo{position:relative;display:inline-block;width:min(770px,78vw)}
.ms-logo svg{display:block;width:100%;height:auto;overflow:visible}
.ms-logo .gl{fill:#ffffff07;stroke:#c9d1d9;stroke-width:9;stroke-dasharray:1;stroke-dashoffset:0;transition:fill .4s}
.ms-logo.draw .gl{animation:msdraw 2.4s cubic-bezier(.6,0,.2,1) both}
@keyframes msdraw{from{stroke-dashoffset:1;fill:#ffffff00}to{stroke-dashoffset:0}}
.ms-logo .hd{stroke:#8b949e;stroke-width:5;opacity:.55}
.ms-logo .on{fill:#e6edf3}.ms-logo .of{fill:#0d1015;stroke:#c9d1d9;stroke-width:6}
.ms-logo .nd{transition:r .18s,fill .18s}
.ms-logo .nd.hot{fill:#f4ab93}
.ms-ver{position:absolute;right:-96px;bottom:26px;font:500 19px ${fam('Neon')};color:#c27f6c}
.ms-hero h2{margin:34px 0 40px;font:400 32px/1.3 ${UI};letter-spacing:-.01em;color:#f0f3f6}
.ms .ms-b{display:inline-flex;align-items:center;gap:12px;height:58px;padding:0 32px;border-radius:9px;font:500 19px ${UI};cursor:pointer;margin:0 5px;border:1px solid #30363d;background:#0d1015;color:#e6edf3;transition:background .15s,transform .15s}
.ms .ms-b.w{background:#fff;color:#111;border-color:#fff}.ms .ms-b:hover{transform:translateY(-1px)}.ms .ms-b.w:hover{background:#e8e8e8}.ms .ms-b:not(.w):hover{background:#161b22}
.ms-mq{position:relative;z-index:1;overflow:hidden;padding:8px 0 30px}
.ms-row{white-space:nowrap;font-size:43px;line-height:84px;will-change:transform}
.ms-row span{display:inline-block;padding-right:80px;text-shadow:0 0 18px currentColor}
@keyframes msl{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes msr{from{transform:translateX(-50%)}to{transform:translateX(0)}}
.ms-wrap{width:min(1250px,92%);margin:0 auto}
.ms-intro{display:grid;grid-template-columns:1fr 1fr;gap:34px 46px;padding:70px 0 40px}
.ms-intro h3{grid-column:1/-1;margin:0;font:700 42px/1.18 ${fam('Neon')};font-stretch:112%;letter-spacing:-.01em}
.ms-intro p{margin:0 0 16px;color:#b6bec8;font-size:16px}.ms-intro p em{font-style:normal;color:#f4ab93}
.ms-cards{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin:30px 0 30px}
.ms .ms-card{position:relative;height:280px;border:1px solid #30363d;border-radius:12px;background:linear-gradient(#171b22,#12161c);cursor:pointer;padding:0;color:inherit;display:flex;flex-direction:column;align-items:center;transition:border-color .2s,transform .2s,box-shadow .2s}
.ms .ms-card:hover{transform:translateY(-2px);border-color:#484f58}
.ms .ms-card.on{border:2px solid var(--c);box-shadow:0 0 0 1px #0d1015,0 0 24px -6px var(--c)}
.ms-card .sy{margin-top:64px;font-size:62px;line-height:1;color:var(--c);text-shadow:0 0 16px var(--c)}
.ms-card .nm{margin-top:34px;font-size:25px;color:var(--c)}
.ms-card .ds{margin-top:auto;width:100%;border-top:1px solid #30363d;padding:17px 0 19px;font:400 15px ${fam('Neon')};color:#8b949e}
.ms-pg{display:grid;grid-template-columns:1fr 380px;gap:34px;align-items:start;padding-bottom:90px}
.ms-ed{border:1px solid #30363d;border-radius:12px;overflow:hidden;background:var(--ebg);color:var(--etx);transition:background .3s,color .3s}
.ms-tabs{display:flex;background:var(--etab);border-bottom:1px solid var(--eln)}
.ms .ms-tab{border:0;background:none;color:var(--emut);font:500 14px ${UI};padding:13px 16px;cursor:pointer}
.ms .ms-tab.on{color:var(--etx);background:var(--ebg)}
.ms-code{position:relative;padding:12px 0 16px;height:560px;overflow:hidden}
.ms-code pre{margin:0;font-family:inherit;white-space:pre;position:relative;z-index:1}
.ms-code .ln{display:inline-block;width:3.2ch;text-align:right;margin-right:1.6ch;color:var(--emut);opacity:.85}
.ms-gridov{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .25s;background-image:linear-gradient(90deg,var(--eln) 1px,transparent 1px),linear-gradient(var(--eln) 1px,transparent 1px)}
.ms-gridov.on{opacity:1}
.ms-ctl{display:flex;flex-direction:column;gap:22px;padding-top:4px}
.ms-sl{display:grid;grid-template-columns:1fr auto;row-gap:8px;font:600 15px ${UI}}.ms-sl output{font:500 15px ${UI};color:#e6edf3}
.ms-sl input{grid-column:1/-1;-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:4px;background:linear-gradient(90deg,#f4ab93 var(--p),#3b3f46 var(--p));outline:none;margin:6px 0}
.ms-sl input::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#f4ab93;border:0;cursor:pointer;box-shadow:0 0 0 3px #0d1015}
.ms-sl .tk{grid-column:1/-1;display:flex;justify-content:space-between;padding:0 4px;margin-top:-10px;height:6px}.ms-sl .tk i{width:1px;height:5px;background:#6e7681}
.ms-ck{display:flex;align-items:center;gap:12px;font:600 15.5px ${UI};cursor:pointer}
.ms-ck input{width:16px;height:16px;accent-color:#e6edf3;margin:0}
.ms-th{font:600 12.5px ${UI}}.ms-th select{display:block;width:100%;margin-top:10px;height:36px;background:#0d1015;color:#e6edf3;border:1px solid #484f58;border-radius:6px;padding:0 10px;font:400 13px ${UI}}
.ms-pill{display:inline-block;border:1px solid #f4ab93;color:#f4ab93;border-radius:99px;padding:2px 10px;font:500 11px ${UI};background:#f4ab9314}
.ms-h3{margin:12px 0 16px;font:700 31px/1.15 ${fam('Neon')};font-stretch:110%}
.ms-th3{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;color:#b6bec8;font-size:13.5px;margin-bottom:36px}.ms-th3 p{margin:0}.ms-th3 b{color:#fff}
.ms-heal{display:grid;grid-template-columns:420px 1fr;gap:56px;align-items:start;padding:20px 0 80px}
.ms-stack{position:sticky;top:20px;border:1px solid #30363d;border-radius:12px;background:#11151b;padding:24px 28px}
.ms-stack .top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font:500 11.5px ${UI};color:#8b949e;letter-spacing:.06em;text-transform:uppercase}
.ms-word{font-size:40px;line-height:1.15;margin:4px 0 14px;white-space:nowrap;position:relative}
.ms-word .cells{display:block;height:4px;margin-top:4px;background:repeating-linear-gradient(90deg,var(--c) 0 calc(1ch - 5px),transparent calc(1ch - 5px) 1ch);opacity:.8}
.ms-word .m{color:#fff}.ms-word.dim{color:#5b636d}
.ms-word small{display:block;font:500 11px ${UI};color:#8b949e;letter-spacing:.04em;margin-bottom:2px}
.ms-stack input[type=text]{width:100%;height:34px;background:#0d1015;border:1px solid #30363d;border-radius:6px;color:#e6edf3;padding:0 10px;font:400 14px ${fam('Neon')};margin-top:6px}
.ms .ms-sw{position:relative;width:42px;height:22px;border-radius:99px;border:0;background:#3b3f46;cursor:pointer;transition:background .2s;padding:0}
.ms .ms-sw::after{content:'';position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s}
.ms .ms-sw.on{background:#f4ab93}.ms .ms-sw.on::after{transform:translateX(20px)}
.ms-heal .copy p{color:#b6bec8;font-size:16px;line-height:1.6;margin:0 0 22px}.ms-heal .copy p em{font-style:normal;color:#f4ab93}
.ms-five .ms-word{font-size:32px;margin:0 0 10px}
.ms-ai{border:1px solid #30363d;border-radius:12px;background:#11151b;padding:26px 30px;margin-bottom:110px;display:grid;grid-template-columns:1fr 330px;gap:30px}
.ms-ai h4{margin:0 0 10px;font:700 20px ${fam('Neon')}}.ms-ai p{margin:0 0 10px;color:#9aa4ae;font-size:13.5px}
.ms-ai pre{grid-column:1/-1;margin:0;background:#0d1015;border:1px solid #30363d;border-radius:10px;padding:18px 22px;font-size:15px;line-height:1.75;white-space:pre}
.ms-ai .sel{display:flex;gap:10px;flex-wrap:wrap;align-items:center;font:600 12px ${UI}}.ms-ai .sel select{background:#0d1015;color:#e6edf3;border:1px solid #484f58;border-radius:6px;height:30px;padding:0 6px}
.ms-ft{border-top:1px solid #21262d;padding:30px 0 50px;color:#7d8590;font-size:12.5px;text-align:center}
`);
  const el = h('div.ms'); root.append(el);
  // ---------- nav + hero ----------
  const mark = `<svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#e6edf3"/><path d="M8 21c0-4 1.5-6 3-7-1-1.2-1.4-3-.8-5l2.4 1.4a8 8 0 0 1 2.8 0L17.8 9c.6 2 .2 3.8-.8 5 1.5 1 3 3 3 7" fill="#0d1015"/></svg>`;
  const L = MSLOGO; const VB = [60, 760, 13900, 1600];
  const svgS = [`<svg viewBox="${VB.join(' ')}">`];
  L.d.forEach((d) => svgS.push(`<path class="gl" pathLength="1" d="${d}"/>`));
  L.hd.forEach(([a, b]) => svgS.push(`<line class="hd" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`));
  L.off.forEach((p) => svgS.push(`<circle class="nd of" cx="${p[0]}" cy="${p[1]}" r="22"/>`));
  L.on.forEach((p) => svgS.push(`<circle class="nd on" cx="${p[0]}" cy="${p[1]}" r="26"/>`));
  svgS.push('</svg>');
  const logo = h('div.ms-logo.draw', { html: svgS.join('') }, h('span.ms-ver', {}, 'v1.400'));
  const nodes = [...logo.querySelectorAll('.nd')].map((c) => ({ c, x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), r: +c.getAttribute('r') }));
  logo.addEventListener('pointermove', (e) => { const b = logo.querySelector('svg').getBoundingClientRect(); const ux = VB[0] + (e.clientX - b.left) / b.width * VB[2], uy = VB[1] + (e.clientY - b.top) / b.height * VB[3]; hotAt(ux, uy); });
  logo.addEventListener('pointerleave', () => hotAt(-1e9, -1e9));
  const hotAt = (ux, uy) => { let n = 0; for (const q of nodes) { const d = Math.hypot(q.x - ux, q.y - uy); const k = d < 900 ? 1 - d / 900 : 0; q.c.setAttribute('r', (q.r * (1 + k * 1.6)).toFixed(1)); q.c.classList.toggle('hot', k > 0.15); if (k > 0.15) n++; } return n; };
  const dl = h('button.ms-b.w', { onclick: () => toast('Download · stand-in (no file in this clone)') }, 'Download', h('span', {}, '›'));
  const lm = h('button.ms-b', { onclick: () => pgEl.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }) }, 'Learn more', h('span', {}, '›'));
  el.append(h('div.ms-dots'), h('nav.ms-nav', {}, h('span', { html: mark }), h('span.sl', {}, '/'), h('span', {}, 'Monaspace')),
    h('section.ms-hero', {}, logo, h('h2', {}, 'A superfamily of variable fonts for code'), h('div', {}, dl, lm)));
  // ---------- marquee ----------
  const MQ = ['console.log(`Grid size: ${term.cols} × ${term.rows}`);', '$frame_budget = $timer→measure($fps) / 1000;', 'ok = [s.started_at.to_millis() for s in run_log if s.ok]', 'std::sort(samples.begin(), samples.end(), by_latency);', 'let total: u32 = (1..=10).filter(|x| x % 2 == 0).sum();'];
  const mq = h('div.ms-mq'); MQ.forEach((line, i) => { const [, n, , c] = FONTS[i]; const r = h('div.ms-row', { style: { fontFamily: fam(n), color: c, fontVariationSettings: `"wght" 340`, animation: RM ? 'none' : `${i % 2 ? 'msr' : 'msl'} ${46 + i * 7}s linear infinite` } }, ...Array.from({ length: 4 }, () => h('span', {}, line))); mq.append(r); }); el.append(mq);
  // ---------- intro + cards ----------
  const wrap = h('div.ms-wrap'); el.append(wrap);
  wrap.append(h('div.ms-intro', {}, h('h3', {}, 'One superfamily.', h('br'), 'Five fonts.', h('br'), 'Three variable axes.'),
    h('div', {}, h('p', {}, 'Code has lived on a grid since the teletype: every letter gets exactly one cell. Monospace keeps columns aligned, but it also leaves narrow letters swimming in space and wide letters squeezed.'), h('p', {}, 'This specimen is a practice clone: five metrics-compatible faces you can mix on one screen, each tuned with weight, width and slant axes.')),
    h('div', {}, h('p', {}, 'Editors still give us one font, one size and a colour for syntax. Type can carry more meaning than that — comments, suggestions and diffs could each get a voice of their own.'), h('p', {}, h('em', {}, 'Pick a face below and play with its axes in the live editor.')))));
  const P = { font: 0, size: 16, wght: 300, wdth: 100, slnt: 0, heal: true, liga: true, grid: false, theme: 'GitHub Dark', lang: 'JavaScript' };
  const cards = FONTS.map(([sy, n, ds, c], i) => h('button.ms-card' + (i === 0 ? '.on' : ''), { style: `--c:${c}`, onclick: () => setFont(i) }, h('span.sy', { style: { fontFamily: fam(n), fontVariationSettings: n === 'Radon' ? '"wght" 400' : '"wght" 350' } }, sy), h('span.nm', { style: { fontFamily: fam(n) } }, n), h('span.ds', { style: { fontFamily: fam(n) } }, ds)));
  const pgEl = h('div.ms-cards', {}, cards); wrap.append(pgEl);
  // ---------- playground ----------
  const SAMPLE = {
    JavaScript: `// Pull in the module we need\nconst process = require('process');\n\n// Describe the terminal we draw into\nclass TerminalSize {\n  constructor() {\n    this.cols = process.stdout.columns;\n    this.rows = process.stdout.rows;\n  }\n}\n\n// Time the render loop\nlet frame_start;\nconst frame_budget = 16; // milliseconds per frame\n\nconst begin_frame = () => {\n  frame_start = new Date();\n};\n\nconst end_frame = () => {\n  let frame_end = new Date();\n  let spent = frame_end - frame_start; // in ms\n  return spent <= frame_budget ? 'ok' : 'slow';\n};`,
    HTML: `<!-- A tiny specimen card -->\n<article class="card" data-font="neon">\n  <h1>Monaspace</h1>\n  <p>Five faces, one grid.</p>\n  <ul>\n    <li>Neon</li>\n    <li>Argon</li>\n    <li>Xenon</li>\n    <li>Radon</li>\n    <li>Krypton</li>\n  </ul>\n  <a href="#playground">Try it =></a>\n</article>`,
    CSS: `/* Variable axes in CSS */\n.code {\n  font-family: "Monaspace Neon", monospace;\n  font-variation-settings: "wght" 300, "wdth" 100;\n  font-feature-settings: "calt" 1, "ss01" 1;\n}\n\n.code em {\n  font-family: "Monaspace Radon";\n  font-style: oblique 11deg;\n}\n\n@media (min-width: 900px) {\n  .code { font-size: 16px; }\n}`,
    Java: `// Measure a render pass\npublic class FrameTimer {\n  private long start;\n  private final int budget = 16;\n\n  public void begin() {\n    start = System.nanoTime();\n  }\n\n  public boolean end() {\n    long spent = (System.nanoTime() - start) / 1_000_000;\n    return spent <= budget;\n  }\n}`,
    Python: `# Summarise a run log\nfrom statistics import mean\n\ndef summarise(log):\n    ok = [r.ms for r in log if r.status == "ok"]\n    if not ok:\n        return None\n    return {\n        "count": len(ok),\n        "mean": mean(ok),\n        "worst": max(ok),\n    }\n\nprint(summarise(load("run.log")) != None)`,
    'C++': `// Sort samples by latency\n#include <algorithm>\n#include <vector>\n\nstruct Sample { int id; double ms; };\n\nvoid rank(std::vector<Sample>& xs) {\n  std::sort(xs.begin(), xs.end(),\n    [](const Sample& a, const Sample& b) {\n      return a.ms < b.ms;\n    });\n}`,
    PHP: `<?php\n// Pick the fastest frame\n$frames = [16.2, 15.8, 17.1, 14.9];\n$best = min($frames);\n\nfunction label($ms) {\n  return $ms <= 16 ? 'ok' : 'slow';\n}\n\necho label($best) . "\\n";`,
    'F#': `// Even numbers, summed\nlet evens =\n    [1..10]\n    |> List.filter (fun x -> x % 2 = 0)\n    |> List.sum\n\nprintfn "%d" evens`,
  };
  const THEMES = { 'GitHub Dark': { bg: '#0d1117', tab: '#161b22', ln: '#21262d', tx: '#e6edf3', mut: '#6e7681', cm: '#8b949e', kw: '#ff7b72', st: '#a5d6ff', fn: '#d2a8ff', nu: '#79c0ff', ty: '#ffa657' }, 'GitHub Light': { bg: '#ffffff', tab: '#f6f8fa', ln: '#d0d7de', tx: '#1f2328', mut: '#8c959f', cm: '#6e7781', kw: '#cf222e', st: '#0a3069', fn: '#8250df', nu: '#0550ae', ty: '#953800' }, Dracula: { bg: '#282a36', tab: '#21222c', ln: '#44475a', tx: '#f8f8f2', mut: '#6272a4', cm: '#6272a4', kw: '#ff79c6', st: '#f1fa8c', fn: '#50fa7b', nu: '#bd93f9', ty: '#8be9fd' }, 'Xcode Light': { bg: '#ffffff', tab: '#f3f3f3', ln: '#e2e2e2', tx: '#262626', mut: '#a6a6a6', cm: '#5d6c79', kw: '#9b2393', st: '#c41a16', fn: '#326d74', nu: '#1c00cf', ty: '#0b4f79' }, Monokai: { bg: '#272822', tab: '#1e1f1c', ln: '#3e3d32', tx: '#f8f8f2', mut: '#75715e', cm: '#75715e', kw: '#f92672', st: '#e6db74', fn: '#a6e22e', nu: '#ae81ff', ty: '#66d9ef' } };
  const KW = /^(const|let|var|class|new|return|function|this|if|else|for|in|of|import|from|def|public|private|final|void|long|int|double|struct|true|false|None|null|echo|fun|static|boolean|include|print|printfn)$/;
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const hl = (src) => src.split('\n').map((line, i) => { let out = ''; const re = /(\/\/.*|#(?!include).*|<!--.*-->|\/\*.*\*\/)|('[^']*'|"[^"]*"|`[^`]*`)|(\b\d[\d_.]*\b)|(\b[A-Za-z_$][\w$]*\b)(?=\s*\()|(\b[A-Za-z_$][\w$]*\b)/g; let m, last = 0;
    while ((m = re.exec(line))) { out += esc(line.slice(last, m.index)); const t = esc(m[0]); out += m[1] ? `<span style="color:var(--ecm);font-style:var(--cmst)">${t}</span>` : m[2] ? `<span style="color:var(--est)">${t}</span>` : m[3] ? `<span style="color:var(--enu)">${t}</span>` : m[4] ? `<span style="color:var(--efn)">${t}</span>` : KW.test(m[5]) ? `<span style="color:var(--ekw)">${t}</span>` : /^[A-Z]/.test(m[5]) ? `<span style="color:var(--ety)">${t}</span>` : t; last = m.index + m[0].length; }
    out += esc(line.slice(last)); return `<span class="ln">${i + 1}</span>${out}`; }).join('\n');
  const tabs = Object.keys(SAMPLE).map((k) => h('button.ms-tab' + (k === P.lang ? '.on' : ''), { onclick: () => setLang(k) }, k));
  const pre = h('pre'), gridov = h('div.ms-gridov'), code = h('div.ms-code', {}, gridov, pre);
  const ed = h('div.ms-ed', {}, h('div.ms-tabs', {}, tabs), code);
  const mkSl = (label, key, min, max, step, ticks) => { const out = h('output', {}, P[key]); const inp = h('input', { type: 'range', min, max, step, value: P[key] }); const upd = () => { inp.style.setProperty('--p', ((P[key] - min) / (max - min) * 100) + '%'); out.textContent = P[key]; inp.value = P[key]; };
    inp.addEventListener('input', () => { P[key] = +inp.value; upd(); apply(); }); upd(); const w = h('label.ms-sl', {}, h('span', {}, label), out, inp, ticks ? h('div.tk', {}, Array.from({ length: ticks }, () => h('i'))) : null); w.upd = upd; w.inp = inp; return w; };
  const sls = { size: mkSl('Font size', 'size', 10, 32, 1), wght: mkSl('Weight', 'wght', 200, 800, 100, 7), wdth: mkSl('Width', 'wdth', 100, 125, 1), slnt: mkSl('Slant', 'slnt', -11, 0, 1) };
  const ck = (label, key) => { const i = h('input', { type: 'checkbox', checked: P[key], onchange: () => { P[key] = i.checked; apply(); } }); const w = h('label.ms-ck', {}, i, label); w.i = i; return w; };
  const cks = { heal: ck('Texture healing', 'heal'), liga: ck('Ligatures', 'liga'), grid: ck('Grid', 'grid') };
  const thSel = h('select', { onchange: (e) => { P.theme = e.target.value; apply(); } }, Object.keys(THEMES).map((k) => h('option', { value: k, selected: k === P.theme }, k)));
  wrap.append(h('div.ms-pg', {}, ed, h('div.ms-ctl', {}, sls.size, sls.wght, sls.wdth, sls.slnt, cks.heal, cks.liga, cks.grid, h('label.ms-th', {}, 'Theme', thSel))));
  const feat = () => `"calt" ${P.heal ? 1 : 0}, "liga" ${P.liga ? 1 : 0}, ${[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `"ss0${n}" ${P.liga ? 1 : 0}`).join(', ')}`;
  const apply = () => { const th = THEMES[P.theme]; for (const [k, v] of Object.entries(th)) ed.style.setProperty('--e' + k, v);
    code.style.fontFamily = fam(FONTS[P.font][1]); code.style.fontSize = P.size + 'px'; code.style.lineHeight = '1.55'; code.style.fontVariationSettings = `"wght" ${P.wght}, "wdth" ${P.wdth}, "slnt" ${P.slnt}`; code.style.fontFeatureSettings = feat();
    gridov.style.backgroundSize = `1ch 1.55em`; gridov.style.backgroundPosition = `calc(4.8ch) 10px`; gridov.classList.toggle('on', P.grid);
    cards.forEach((c, i) => c.classList.toggle('on', i === P.font)); tabs.forEach((t) => t.classList.toggle('on', t.textContent === P.lang)); healUpd(); };
  const setFont = (i) => { P.font = i; apply(); };
  const setLang = (k) => { P.lang = k; pre.innerHTML = hl(SAMPLE[k]); apply(); };
  // ---------- texture healing ----------
  let word = 'calming', healOn = true;
  const sw = h('button.ms-sw.on', { onclick: () => { healOn = !healOn; sw.classList.toggle('on', healOn); healUpd(); } });
  const inp = h('input', { type: 'text', value: word, maxLength: 14, oninput: (e) => { word = e.target.value || ' '; healUpd(); } });
  const wSpan = (w, n, c, cls = '') => { const narrow = /[ilIjtfr1.,:;!|]/; const parts = [...w].map((ch, k) => { const nb = narrow.test(w[k - 1] || '') || narrow.test(w[k + 1] || ''); return /[mwMW@]/.test(ch) && nb ? h('span.m', {}, ch) : ch; });
    return h('div.ms-word' + cls, { style: `font-family:${fam(n)};--c:${c}` }, ...parts, h('span.cells')); };
  const cmpA = h('div'), cmpB = h('div'), five = h('div.ms-five');
  const healUpd = () => { const n = FONTS[P.font][1], c = FONTS[P.font][3];
    const a = wSpan(word, n, '#6e7681', '.dim'); a.style.fontFeatureSettings = '"calt" 0'; a.prepend(h('small', {}, 'Strict monospace')); cmpA.replaceChildren(a);
    const b = wSpan(word, n, c); b.style.fontFeatureSettings = `"calt" ${healOn ? 1 : 0}`; b.prepend(h('small', {}, healOn ? 'Texture healing on' : 'Texture healing off')); cmpB.replaceChildren(b);
    five.replaceChildren(...FONTS.map(([, fn, , fc]) => { const r = wSpan(word, fn, fc); r.style.fontFeatureSettings = `"calt" ${healOn ? 1 : 0}`; return r; })); };
  const stack = h('div.ms-stack', {}, h('div.top', {}, 'Texture healing', sw), cmpA, cmpB, h('div.top', { style: { marginTop: '18px' } }, 'All five faces'), five, h('div.top', { style: { marginTop: '10px', marginBottom: '0' } }, 'Try a word'), inp);
  wrap.append(h('div', {}, h('span.ms-pill', {}, 'Feature'), h('h3.ms-h3', {}, 'Texture healing'),
    h('div.ms-th3', {}, h('p', {}, 'Monospace text has uneven texture: some letters crowd their cell while others float in it, making words look blotchy at a glance.'), h('p', {}, 'The idea: let a wide letter borrow a little room from a narrow neighbour — without breaking the grid that keeps code aligned.'), h('p', {}, h('b', {}, 'Texture healing keeps every cell the same width and works through the font\u2019s contextual alternates, so no editor plugin is needed.')))),
    h('div.ms-heal', {}, stack, h('div.copy', {}, h('p', {}, 'In proportional type each glyph gets the room it needs: an ', h('em', {}, 'm'), ' is wider than an ', h('em', {}, 'i'), '.'), h('p', {}, 'In a monospaced face every letter must fit the same box. Narrow letters like ', h('em', {}, 'l'), ' and ', h('em', {}, 'i'), ' grow slab serifs to fill it; wide letters like ', h('em', {}, 'm'), ' and ', h('em', {}, 'w'), ' get squeezed until their counters clog.'), h('p', {}, 'With healing on, when an ', h('em', {}, 'm'), ' sits next to a narrow letter the font swaps in a wider alternate that leans into the spare space. Toggle the switch and watch the highlighted letters relax.'), h('p', {}, 'The total width never changes — compare the cell markers under each word.'))));
  // ---------- copilot voice ----------
  let aiFont = 3, codeFont = 0;
  const aiPre = h('pre'); const fSel = (v, on) => h('select', { onchange: (e) => on(+e.target.value) }, FONTS.map(([, n], i) => h('option', { value: i, selected: i === v }, n)));
  const aiUpd = () => { const cf = fam(FONTS[codeFont][1]), af = fam(FONTS[aiFont][1]); aiPre.style.fontFamily = cf; aiPre.innerHTML = `<span style="color:#8b949e">// Before</span>\n<span style="color:#ff7b72">const</span> [isOpen, setOpen] = React.<span style="color:#d2a8ff">useState</span>(<span style="color:#79c0ff">false</span>);\n<span style="color:#8b949e">// After</span>\n<span style="color:#ff7b72">const</span> [isOpen, setOpen] = <span style="font-family:${af};color:#f4ab93;font-style:oblique 8deg">React.useState(false); // suggested</span>`; };
  const aiSelA = fSel(aiFont, (v) => { aiFont = v; aiUpd(); }), aiSelC = fSel(codeFont, (v) => { codeFont = v; aiUpd(); });
  wrap.append(h('div.ms-ai', {}, h('div', {}, h('h4', {}, 'What if Copilot had its own voice?'), h('p', {}, 'Ghost text is hard to tell apart from code you wrote. Give suggestions a different face from the same superfamily and they read as a second voice.')), h('div', {}, h('p', {}, 'Because all five faces share metrics, you can mix them on one line without breaking alignment.'), h('div.sel', {}, 'Code', aiSelC, 'Copilot', aiSelA)), aiPre));
  wrap.append(h('div.ms-ft', {}, 'Practice clone of monaspace.githubnext.com · fonts: Monaspace (SIL OFL 1.1, © GitHub) served unmodified'));
  setLang('JavaScript'); aiUpd();
  // ---------- demo proof ----------
  const setSl = (k, v) => { P[k] = v; sls[k].upd(); sls[k].inp.dispatchEvent(new Event('input')); };
  const reset = () => { Object.assign(P, { font: 0, size: 16, wght: 300, wdth: 100, slnt: 0, heal: true, liga: true, grid: false, theme: 'GitHub Dark' }); Object.values(sls).forEach((s2) => s2.upd()); cks.heal.i.checked = true; cks.liga.i.checked = true; cks.grid.i.checked = false; thSel.value = 'GitHub Dark'; word = 'calming'; inp.value = word; healOn = true; sw.classList.add('on'); aiFont = 3; codeFont = 0; aiSelA.value = 3; aiSelC.value = 0; aiUpd(); setLang('JavaScript'); hotAt(-1e9, -1e9); root.scrollTop = 0; };
  window.__demoProof = async () => { const o = []; reset(); await document.fonts.ready; await Promise.all(FONTS.map(([, n]) => document.fonts.load(`300 16px 'Monaspace ${n}'`)));
    o.push(`fonts loaded ${FONTS.filter(([, n]) => document.fonts.check(`16px 'Monaspace ${n}'`)).length}/5; logo nodes ${nodes.length}`);
    const hot = hotAt(L.on[40][0], L.on[40][1]); o.push(`logo hover → ${hot} nodes swell`); hotAt(-1e9, -1e9);
    cards[3].click(); o.push(`card Radon → editor font ${getComputedStyle(code).fontFamily.split(',')[0]}, card active=${cards[3].classList.contains('on')}`);
    const tw = () => { const r = document.createRange(); r.selectNodeContents(pre); return r.getBoundingClientRect().width; }; const w0 = tw(); setSl('wdth', 125); const w1 = tw(); setSl('wght', 700); setSl('slnt', -11); setSl('size', 20);
    o.push(`axes → ${getComputedStyle(code).fontVariationSettings} size ${getComputedStyle(code).fontSize}; width axis widened code ${Math.round(w0)}→${Math.round(w1)}px`);
    cks.heal.i.click(); cks.liga.i.click(); o.push(`texture healing+ligatures off → ${getComputedStyle(code).fontFeatureSettings.slice(0, 30)}…`);
    cks.grid.i.click(); o.push(`grid overlay=${gridov.classList.contains('on')}`);
    tabs[4].click(); o.push(`tab Python → ${pre.textContent.split('\n').length} lines, first "${pre.textContent.split('\n')[0].replace(/^\d+/, '')}"`);
    thSel.value = 'Dracula'; thSel.dispatchEvent(new Event('change')); await sleep(380); o.push(`theme Dracula → editor bg ${getComputedStyle(ed).backgroundColor}`);
    sw.click(); const offF = cmpB.firstChild.style.fontFeatureSettings; sw.click(); o.push(`healing demo switch → off: ${offF}, on: ${cmpB.firstChild.style.fontFeatureSettings} (calt=1), highlighted m in "${word}": ${cmpB.querySelectorAll('.m').length}`);
    aiSelA.value = 4; aiSelA.dispatchEvent(new Event('change')); o.push(`Copilot voice → ${aiPre.innerHTML.includes('Krypton')}`);
    reset(); await sleep(30); document.querySelector('.tg-toast')?.classList.remove('on');
    o.push(`restored: Neon, 16px wght 300 wdth 100 slnt 0, healing+ligatures on, grid off, GitHub Dark, JavaScript (${getComputedStyle(code).fontVariationSettings})`); return o.join('; '); };
  if (!RM) setTimeout(() => logo.classList.remove('draw'), 2600); else logo.classList.remove('draw');
};
V['cydstumpel-giant-condensed-wordmark-rotating-serif-role-sticker-badges-rounded-work-tiles-pastel-blog-cards'] = (root, T) => {
  const fontsP = Promise.all([import('@fontsource/anton'), import('@fontsource/instrument-serif/400.css'), import('@fontsource/instrument-serif/400-italic.css')]).catch(() => {});
  theme(root, T, { bg: '#fff5ee', fg: '#111', ac: '#d9533f', dark: false });
  root.classList.add('scroll'); root.style.overflow = 'auto';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RED = '#d9533f', CREAM = '#fff5ee', AN = "'Anton','Bueno','Impact','Arial Narrow Bold',sans-serif", IS = "'Instrument Serif','Times New Roman',serif", SANS = "'Inter Variable',Helvetica,Arial,sans-serif";
  css(`.cy{background:${CREAM};color:#111;font:400 24px/1.15 ${IS};position:relative;overflow-x:clip;min-height:100%}
.cy *{box-sizing:border-box}.cy a{color:inherit}.cy button{font:inherit;cursor:pointer;background:none;border:0;color:inherit;padding:0}
.cy-mq{overflow:hidden;white-space:nowrap;line-height:.84;user-select:none;pointer-events:none}
.cy-mq .tr{display:inline-flex;will-change:transform}.cy-mq span{font:400 252px/.84 ${AN};color:${RED};letter-spacing:-.005em;padding-right:.22em;transform:scaleY(1.06);display:inline-block}
.cy-top{padding-top:14px}
.cy-box{position:absolute;left:50%;top:150px;width:150px;height:150px;margin-left:-20px;z-index:6;cursor:pointer}
.cy-box svg.bx{position:absolute;left:0;top:40px;width:150px;height:120px;overflow:visible}
.cy-box .ic{position:absolute;left:50px;top:70px;width:26px;height:26px;transition:transform .55s cubic-bezier(.3,1.7,.5,1);transform:translate(var(--x0),var(--y0)) rotate(var(--r0))}
.cy-box:hover .ic,.cy-box.pop .ic{transform:translate(var(--x1),var(--y1)) rotate(var(--r1))}
.cy-box.pop .ic{transition-duration:.35s}
.cy-hd{position:sticky;top:0;z-index:20;height:86px;display:grid;grid-template-columns:auto auto 1fr auto;align-items:center;gap:0 64px;padding:0 24px;background:${CREAM}00;transition:background .25s,height .25s,border-color .25s;border-bottom:1.5px solid #d9533f00}
.cy-hd.stuck{background:${CREAM};height:66px;border-color:${RED}}
.cy-logo{font:400 54px/1 ${AN};color:${RED};letter-spacing:-.01em;transform:scaleY(1.1)}
.cy-hd .mail{font:400 25px ${IS};text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;position:relative}
.cy-hd .mail .cp{position:absolute;left:0;top:-18px;font:400 11px ${SANS};opacity:0;transition:.2s;text-decoration:none;white-space:nowrap}.cy-hd .mail:hover .cp{opacity:.7}
.cy-av{display:flex;align-items:center;gap:10px;font:400 25px ${IS}}
.cy-nav{display:flex;gap:24px;font:400 25px ${IS}}.cy-nav button{position:relative}.cy-nav button::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .3s}.cy-nav button:hover::after{transform:scaleX(1);transform-origin:left}
.cy-hero{position:relative;height:860px}
.cy-circ{position:absolute;left:-180px;top:180px;width:780px;height:780px;border-radius:50%;background:${RED}}
.cy-por{position:absolute;left:40px;top:0;width:480px;height:860px}
.cy-hl{position:absolute;left:612px;top:120px;z-index:4}
.cy-hl .w{display:block;height:140px;overflow:hidden;position:relative}
.cy-hl .w span{display:block;font:400 152px/140px ${IS};letter-spacing:-.02em;white-space:nowrap;transition:transform .7s cubic-bezier(.7,0,.2,1),opacity .7s}
.cy-hl .w1 span{font-style:italic}.cy-hl .w2{margin-left:118px}
.cy-hl .w span.out{transform:translateY(-105%);opacity:0}.cy-hl .w span.in0{transform:translateY(105%);opacity:0}
.cy-hl .w span.nx{position:absolute;left:0;top:0}
.cy-intro{position:absolute;left:845px;top:420px;width:330px;font:400 13.4px/1.42 ${SANS};z-index:3}.cy-intro p{margin:0 0 12px}.cy-intro a{text-underline-offset:2px}
.cy-stk{position:absolute;z-index:8;cursor:grab;touch-action:none;filter:drop-shadow(0 2px 0 #0002);transition:filter .2s}
.cy-stk:active{cursor:grabbing;filter:drop-shadow(4px 10px 10px #0003)}.cy-stk.dragging{transition:none}
.cy-stk svg{display:block;width:100%;height:100%;overflow:visible}
.cy-ev{position:absolute;right:-14px;top:580px;width:170px;padding:10px 26px 12px 16px;border:3px solid ${RED};border-right:0;border-radius:14px 0 0 14px;background:${CREAM};font:400 13px/1.1 ${AN};color:${RED};text-transform:uppercase;z-index:5;box-shadow:inset 0 0 0 1.5px ${CREAM},inset 0 0 0 3px ${RED}}
.cy-pill{display:inline-block;border:2px solid ${RED};border-radius:99px;padding:4px 12px 3px;font:400 12px/1.2 ${AN};color:${RED};text-transform:uppercase;box-shadow:0 3px 0 ${RED};background:${CREAM};transition:transform .15s,box-shadow .15s;cursor:pointer}
.cy-pill:hover{transform:translateY(2px);box-shadow:0 1px 0 ${RED}}
.cy-work{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:60px 24px 40px}
.cy-tile{position:relative;aspect-ratio:1;border-radius:84px;overflow:hidden;cursor:pointer;isolation:isolate}
.cy-tile svg{position:absolute;inset:0;width:100%;height:100%;transition:transform .8s cubic-bezier(.2,.8,.2,1)}
.cy-tile:hover svg,.cy-tile.hov svg{transform:scale(1.07)}
.cy-tile b{position:absolute;left:0;right:0;bottom:46px;text-align:center;font:400 46px/1 ${AN};color:#fff5ee;text-transform:uppercase;text-shadow:0 2px 0 #0006,0 0 18px #0004;letter-spacing:.005em;transform:scaleY(1.05)}
.cy-tile .tags{position:absolute;left:0;right:0;bottom:16px;display:flex;justify-content:center;gap:6px;transform:translateY(30px);opacity:0;transition:.35s cubic-bezier(.3,1.5,.5,1)}
.cy-tile:hover .tags,.cy-tile.hov .tags{transform:none;opacity:1}
.cy-tile .tags i{font:400 11px/1 ${AN};font-style:normal;padding:4px 9px 3px;border-radius:99px;background:${CREAM};color:#111;border:1.5px solid #111}
.cy-txt{align-self:center;padding:0 30px 0 0;font:400 31px/1.03 ${IS};letter-spacing:-.01em}.cy-txt a{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px;cursor:pointer}
.cy-txt a.hl{color:${RED}}.cy-txt .cy-pill{margin-top:22px}
.cy-prev{position:fixed;z-index:50;width:150px;height:110px;border-radius:24px;overflow:hidden;pointer-events:none;transform:translate(-50%,-115%) scale(.6) rotate(-6deg);opacity:0;transition:opacity .2s,transform .3s cubic-bezier(.3,1.5,.5,1)}
.cy-prev.on{opacity:1;transform:translate(-50%,-115%) scale(1) rotate(-4deg)}.cy-prev svg{width:100%;height:100%}
.cy-blogs{padding:40px 24px 60px}.cy-blogs h2{margin:0 0 16px;font:400 40px ${IS};letter-spacing:-.01em}
.cy-bg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.cy-card{position:relative;min-height:306px;border:2px solid var(--c);background:var(--b);border-radius:6px;padding:26px 24px 22px;color:var(--c);clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,0 100%);transition:transform .35s cubic-bezier(.3,1.4,.5,1);cursor:pointer;display:flex;flex-direction:column}
.cy-card::after{content:'';position:absolute;right:-2px;top:-2px;width:20px;height:20px;background:linear-gradient(225deg,${CREAM} 50%,var(--c) 50% calc(50% + 2px),var(--b) calc(50% + 2px))}
.cy-card:hover,.cy-card.hov{transform:rotate(var(--rt,-1.2deg)) translateY(-6px)}
.cy-card .d{font:400 13px ${AN};text-transform:uppercase;letter-spacing:.01em}
.cy-card .ch{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 18px}.cy-card .ch i{font:400 11px/1 ${AN};font-style:normal;text-transform:uppercase;border:2px solid var(--c);border-radius:99px;padding:5px 9px 4px;box-shadow:inset 0 0 0 1.5px var(--b),inset 0 0 0 3px var(--c)}
.cy-card h3{margin:0;font:400 38px/1.02 ${AN};text-transform:uppercase;letter-spacing:.003em}
.cy-card .wm{margin-top:auto;align-self:flex-end;font:400 11px ${AN};text-transform:uppercase;border:2px solid var(--c);border-radius:99px;padding:6px 10px 4px;box-shadow:inset 0 0 0 1.5px var(--b),inset 0 0 0 3px var(--c)}
.cy-svc{display:flex;justify-content:center;padding:120px 24px 160px;gap:0}
.cy-sc{position:relative;width:452px;height:620px;margin:0 -12px;background:${RED};border:2.5px solid #111;border-radius:18px;overflow:hidden;transition:transform .5s cubic-bezier(.3,1.4,.5,1);transform:rotate(var(--rt));cursor:pointer}
.cy-sc:hover,.cy-sc.hov{transform:rotate(0deg) translateY(-14px) scale(1.02);z-index:3}
.cy-sc h3{margin:0;padding:22px 22px 0;font:400 68px/1 ${AN};color:${CREAM};text-transform:uppercase;text-shadow:3px 3px 0 #111,-1px -1px 0 #111,1px -1px 0 #111,-1px 1px 0 #111;letter-spacing:.005em}
.cy-sc img{position:absolute;right:-6px;bottom:44px;width:300px;image-rendering:pixelated;transition:transform .5s cubic-bezier(.3,1.6,.5,1)}
.cy-sc:hover img,.cy-sc.hov img{transform:translate(-12px,-16px) rotate(-6deg)}
.cy-sc .rail{position:absolute;left:0;right:0;bottom:12px;overflow:hidden;white-space:nowrap}
.cy-sc .rail div{display:inline-flex;gap:6px;animation:cyRail 14s linear infinite}.cy-sc .rail i{font:400 11px/1 ${AN};font-style:normal;text-transform:uppercase;color:${RED};background:${CREAM};border-radius:99px;padding:5px 10px 4px;border:1.5px solid ${CREAM};box-shadow:inset 0 0 0 1.5px ${RED}}
@keyframes cyRail{to{transform:translateX(-50%)}}
.cy-ft{background:${RED};color:${CREAM};padding:130px 24px 40px;margin-top:40px}
.cy-ft .row{display:flex;justify-content:space-between;align-items:flex-end;gap:30px}
.cy-ft .lg{font:400 54px/1 ${AN};transform:scaleY(1.1);transform-origin:left bottom;display:inline-block}
.cy-ft p{margin:10px 0 0;font:400 36px/1.1 ${IS}}.cy-ft .r{text-align:right}.cy-ft .r .a{font:400 50px/1 ${IS}}
.cy-ft .r a{font:400 36px ${IS};text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px;cursor:pointer}
.cy-ft .links{display:flex;justify-content:space-between;border-top:1px solid #fff5ee99;margin-top:42px;padding-top:24px;font:400 22px ${IS}}.cy-ft .links div{display:flex;gap:24px}.cy-ft .links .s span{text-decoration:underline;text-underline-offset:4px}
.cy-mq.bot{padding-top:16px;background:${CREAM}}
${RM ? '.cy *{transition-duration:.01s!important;animation:none!important}' : ''}
@media (max-width:760px){.cy-mq span{font-size:96px}.cy-hd{grid-template-columns:auto 1fr auto;gap:12px;padding:0 14px;height:60px}.cy-hd>span{display:none}.cy-hd.stuck{height:54px}.cy-logo{font-size:34px}.cy-hd .mail{display:none}.cy-av{font-size:16px}.cy-nav{display:none}.cy-burger{display:block!important}
.cy-box{top:40px;left:auto;right:18px;transform:scale(.55);transform-origin:top right;margin:0}
.cy-hero{height:auto;padding:0 0 30px}.cy-circ{left:-120px;top:70px;width:420px;height:420px}.cy-por{position:relative;left:0;width:300px;height:480px;margin-left:10px}
.cy-hl{position:relative;left:auto;top:auto;padding:0 16px;margin-top:-10px}.cy-hl .w{height:62px}.cy-hl .w span{font-size:68px;line-height:62px}.cy-hl .w2{margin-left:40px}
.cy-intro{position:relative;left:auto;top:auto;width:auto;padding:16px 16px 0}.cy-ev{position:relative;right:auto;top:auto;margin:16px 0 0 auto}
.cy-stk{transform:scale(.62);transform-origin:0 0}
.cy-work{grid-template-columns:1fr 1fr;gap:10px;padding:30px 12px}.cy-tile{border-radius:40px}.cy-tile b{font-size:22px;bottom:22px}.cy-txt{grid-column:1/-1;font-size:24px;padding:10px 4px}
.cy-bg{grid-template-columns:1fr}.cy-card{min-height:220px}.cy-card h3{font-size:28px}.cy-svc{flex-direction:column;align-items:center;padding:40px 12px 80px}.cy-sc{width:min(330px,90%);height:430px;margin:-16px 0}.cy-sc h3{font-size:46px}.cy-sc img{width:200px}
.cy-ft{padding:60px 16px 30px}.cy-ft .row{flex-direction:column;align-items:flex-start}.cy-ft .r{text-align:left}.cy-ft p,.cy-ft .r a{font-size:24px}.cy-ft .r .a{font-size:32px}.cy-ft .links{flex-direction:column;gap:14px;font-size:18px}.cy-ft .links div{flex-wrap:wrap;gap:12px}}
.cy-burger{display:none;font:400 20px ${IS};text-decoration:underline}`);
  const el = h('div.cy'); root.append(el);
  const vars = (e, o) => { for (const k in o) e.style.setProperty(k, o[k]); return e; };
  const fitZ = () => { const w = root.clientWidth; el.style.zoom = w > 760 ? clamp(w / 1440, 0.62, 1.5) : 1; }; fitZ(); new ResizeObserver(fitZ).observe(root);
  // ---------- wordmark marquee (scroll-velocity boosted) ----------
  const mq = (cls = '') => { const tr = h('div.tr', {}, Array.from({ length: 8 }, () => h('span', {}, 'CYD STUMPEL'))); const w = h('div.cy-mq' + cls, {}, tr); w.tr = tr; w.x = 0; return w; };
  const mTop = mq('.top'), mBot = mq('.bot'); mBot.x = -400;
  // ---------- pink open box with doodle icons ----------
  const ICON = { bulb: '<circle cx="13" cy="10" r="7" fill="#fff" stroke="#111" stroke-width="1.6"/><path d="M10 17h6v4h-6z" fill="#fff" stroke="#111" stroke-width="1.6"/><path d="M11 10l2 3 2-3" fill="none" stroke="#111" stroke-width="1.2"/>', arrow: '<path d="M6 3l14 9-6 1 4 7-3 2-4-7-5 4z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/>',
    eyes: '<ellipse cx="9" cy="13" rx="5" ry="7" fill="#fff" stroke="#111" stroke-width="1.6"/><ellipse cx="18" cy="13" rx="5" ry="7" fill="#fff" stroke="#111" stroke-width="1.6"/><circle cx="10" cy="14" r="2.2" fill="#111"/><circle cx="19" cy="14" r="2.2" fill="#111"/>',
    planet: '<circle cx="13" cy="13" r="6.5" fill="#fff" stroke="#111" stroke-width="1.6"/><ellipse cx="13" cy="13" rx="12" ry="3.5" fill="none" stroke="#111" stroke-width="1.6" transform="rotate(-20 13 13)"/>', hand: '<path d="M8 22v-8l-3-3 2-2 3 2V3h3v7l2-1 2 1 2-1 2 2v7l-3 4z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/>',
    plant: '<path d="M7 15h12l-2 8H9z" fill="#fff" stroke="#111" stroke-width="1.6"/><path d="M13 15V8M13 10q-5-1-6-6 5 0 6 6M13 9q4-3 7-2-1 4-7 3" fill="#fff" stroke="#111" stroke-width="1.4"/>', cup: '<path d="M7 4h12v6a6 6 0 0 1-12 0z" fill="#fff" stroke="#111" stroke-width="1.6"/><path d="M13 16v4M9 22h8" stroke="#111" stroke-width="1.6"/><path d="M7 6H4v2a3 3 0 0 0 3 3M19 6h3v2a3 3 0 0 1-3 3" fill="none" stroke="#111" stroke-width="1.4"/>' };
  const IP = [['hand', -46, -32, -20, -78, -96, -18], ['bulb', -24, -40, 10, -46, -120, 12], ['arrow', 0, -44, -10, 4, -128, -12], ['eyes', 22, -46, 8, 48, -116, 14], ['planet', 40, -30, 20, 84, -86, 24], ['plant', -14, -22, 0, -28, -70, -8], ['cup', 10, -20, -6, 24, -62, 10]];
  const box = h('div.cy-box', { title: 'Open the box', html: `<svg class="bx" viewBox="0 0 150 120"><path d="M30 34l52-14 46 18-52 16z" fill="#c4544a"/><path d="M30 34l46 20v58l-46-22z" fill="#ec8c80"/><path d="M76 54l52-16v56l-52 18z" fill="#e57466"/><path d="M30 34L6 52l46 22 24-20z" fill="#f4a49a"/><path d="M128 38l20-24-48-12-18 18z" fill="#f2a198"/><path d="M82 20l-8-22-46 14 2 22z" fill="#f6b4ab" opacity=".95"/></svg>` });
  IP.forEach(([k, x0, y0, r0, x1, y1, r1]) => box.append(vars(h('div.ic', { html: `<svg viewBox="0 0 26 26">${ICON[k]}</svg>` }), { '--x0': x0 * 0.4 + 'px', '--y0': y0 * 0.5 + 20 + 'px', '--r0': r0 + 'deg', '--x1': x1 + 'px', '--y1': y1 + 'px', '--r1': r1 + 'deg' })));
  let popT; const pop = () => { box.classList.add('pop'); clearTimeout(popT); popT = setTimeout(() => box.classList.remove('pop'), 1400); }; box.onclick = pop;
  // ---------- header (sticky) ----------
  const EMAIL = 'info@cydstumpel.nl';
  const mail = h('a.mail', { onclick: () => copy(EMAIL, 'Email copied') }, h('span.cp', {}, 'Copy email'), EMAIL);
  const spark = '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M9 2q1 7 7 8-6 1-7 8-1-7-7-8 6-1 7-8zM19 1q.4 3 3 3.4-2.6.6-3 3.6-.4-3-3-3.6 2.6-.4 3-3.4z" fill="#111"/></svg>';
  const secs = {};
  const go = (k) => { const t = secs[k]; if (t) root.scrollTo({ top: k === 'About' ? 0 : t.offsetTop * (parseFloat(el.style.zoom) || 1) - 70, behavior: RM ? 'auto' : 'smooth' }); };
  const navB = ['About', 'Archive', 'Speaking', 'Blogs', 'Contact'].map((k) => h('button', { onclick: () => go(k) }, k));
  const hd = h('div.cy-hd', {}, h('div.cy-logo', {}, 'CYD'), h('div.k-row', { style: { gap: '64px' } }, mail, h('div.cy-av', { html: spark + 'Available November 2026' })), h('span'), h('nav.cy-nav', {}, navB), h('button.cy-burger', { onclick: () => go('Contact') }, 'Menu'));
  // ---------- hero ----------
  const por = `<svg class="cy-por" viewBox="0 0 480 860" preserveAspectRatio="xMidYMax meet"><defs><linearGradient id="cyH" x1="0" x2="1"><stop offset="0" stop-color="#4a2e22"/><stop offset=".5" stop-color="#7a5038"/><stop offset="1" stop-color="#5a3826"/></linearGradient><linearGradient id="cyJ" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6a4c"/><stop offset="1" stop-color="#1d4a33"/></linearGradient></defs>
<path d="M120 300q-20-170 120-180 150 0 140 170 0 120-30 230l-200 20q-40-120-30-240z" fill="url(#cyH)"/><path d="M190 470h80l10 80h-100z" fill="#e9b39a"/>
<ellipse cx="236" cy="340" rx="92" ry="118" fill="#f2c4a8"/><path d="M146 300q10-120 100-122 90 0 96 110-40-70-110-76-50 30-86 88z" fill="url(#cyH)"/><path d="M146 300q-4 80 10 150-30-60-20-150zM334 290q20 80 0 180 30-80 12-180z" fill="#4a2e22"/>
<ellipse cx="200" cy="340" rx="11" ry="6" fill="#3a2a22"/><ellipse cx="272" cy="340" rx="11" ry="6" fill="#3a2a22"/><path d="M185 318q15-8 30 0M257 318q15-8 30 0" stroke="#5a3a2a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M236 350q-6 30 4 40" stroke="#c99478" stroke-width="3" fill="none"/><path d="M206 412q30 22 62 0" stroke="#b86a5a" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="190" cy="388" rx="16" ry="9" fill="#f0a493" opacity=".5"/><ellipse cx="284" cy="388" rx="16" ry="9" fill="#f0a493" opacity=".5"/>
<path d="M40 860q0-250 120-300l70 40 70-40q130 40 140 300z" fill="url(#cyJ)"/><path d="M180 560l50 90 50-90-20-14-30 40-30-40z" fill="#9aa0a4"/><path d="M160 560l-30 90 60 40zM300 560l30 90-60 40z" fill="#245a40"/><rect x="300" y="700" width="70" height="60" rx="6" fill="#1d4a33" stroke="#163a28" stroke-width="3"/><path d="M230 650v210" stroke="#163a28" stroke-width="3"/><circle cx="240" cy="700" r="5" fill="#111"/><circle cx="240" cy="760" r="5" fill="#111"/><circle cx="240" cy="820" r="5" fill="#111"/></svg>`;
  const ROLES = [['Freelance', 'Developer'], ['Creative', 'Engineer'], ['Conference', 'Speaker'], ['Parttime', 'Lecturer'], ['Front end', 'Consultant']];
  let ri = 1; const w1 = h('span.w.w1', {}, h('span', {}, ROLES[ri][0])), w2 = h('span.w.w2', {}, h('span', {}, ROLES[ri][1]));
  const roll = (wrap, txt) => { const cur = wrap.querySelector('span:not(.out)'); const nx = h('span.nx.in0', {}, txt); wrap.append(nx); requestAnimationFrame(() => requestAnimationFrame(() => { cur.classList.add('out'); nx.classList.remove('in0'); })); setTimeout(() => { cur.remove(); nx.classList.remove('nx'); }, RM ? 20 : 760); };
  const nextRole = (to) => { ri = to ?? (ri + 1) % ROLES.length; roll(w1, ROLES[ri][0]); setTimeout(() => roll(w2, ROLES[ri][1]), RM ? 0 : 90); };
  let roleT = setInterval(() => !document.hidden && nextRole(), RM ? 4000 : 2600);
  const hl = h('h1.cy-hl', { style: { margin: 0, fontWeight: 400 } }, w1, w2);
  // stickers (draggable)
  const circText = (txt, r, fs) => `<defs><path id="cyc${fs}" d="M50 50m-${r} 0a${r} ${r} 0 1 1 ${2 * r} 0a${r} ${r} 0 1 1 -${2 * r} 0"/></defs><text font-family="Anton,Impact" font-size="${fs}" letter-spacing="1.6" fill="#111"><textPath href="#cyc${fs}">${txt}</textPath></text>`;
  const STK = [
    ['award', 1074, 140, 200, 88, `<svg viewBox="0 0 200 88"><g transform="rotate(-6 100 44)"><rect x="6" y="8" width="188" height="72" rx="8" fill="#b18cff" stroke="#fff" stroke-width="5"/><text x="18" y="40" font-family="Anton,Impact" font-size="27" fill="#111">AWARD WINNING</text><text x="50" y="70" font-family="Anton,Impact" font-size="27" fill="#111">DEVELOPER</text><path d="M30 60l3 6 6-3-3 6 6 3-6 3 3 6-6-3-3 6-3-6-6 3 3-6-6-3 6-3-3-6 6 3z" fill="#111" transform="translate(-4 -12) scale(.9)"/><circle cx="177" cy="32" r="9" fill="#fff" stroke="#111" stroke-width="2"/></g></svg>`],
    ['motion', 609, 238, 104, 104, `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#7cc6f2" stroke="#111" stroke-width="3"/><text x="50" y="36" text-anchor="middle" font-family="Anton,Impact" font-size="15" fill="#111">MOTION</text><text x="50" y="53" text-anchor="middle" font-family="Anton,Impact" font-size="15" fill="#111">WEB DESIGN</text><circle cx="50" cy="72" r="8" fill="#fff" stroke="#111" stroke-width="2"/><ellipse cx="50" cy="72" rx="16" ry="4.5" fill="none" stroke="#111" stroke-width="2" transform="rotate(-15 50 72)"/></svg>`],
    ['a11y', 1203, 357, 104, 104, `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="#d9f36a" stroke="#fff" stroke-width="3"/>${circText('ACCESSIBILITY ✸ ACCESSIBILITY ✸ ', 35, 12)}<circle cx="50" cy="50" r="14" fill="#111"/><circle cx="50" cy="44" r="3" fill="#d9f36a"/><path d="M42 49h16M50 49v8l-5 6M50 57l5 6" stroke="#d9f36a" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`],
  ];
  const MOB = matchMedia('(max-width:760px)').matches, MPOS = { award: [200, 40], motion: [236, 300], a11y: [16, 400] };
  const stks = STK.map(([k, x, y, w, hh, svg]) => { if (MOB) [x, y] = MPOS[k]; const e = h('div.cy-stk', { 'data-k': k, html: svg, style: { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' } }); e.home = [x, y]; return e; });
  stks.forEach((e) => { let o = null; e.addEventListener('pointerdown', (ev) => { const z = parseFloat(el.style.zoom) || 1; o = { x: ev.clientX / z - e.offsetLeft, y: ev.clientY / z - e.offsetTop, z }; e.classList.add('dragging'); try { e.setPointerCapture(ev.pointerId); } catch {} ev.preventDefault(); });
    e.addEventListener('pointermove', (ev) => { if (!o) return; e.style.left = ev.clientX / o.z - o.x + 'px'; e.style.top = ev.clientY / o.z - o.y + 'px'; e.style.rotate = clamp(ev.movementX * 1.5, -12, 12) + 'deg'; });
    e.addEventListener('pointerup', () => { o = null; e.classList.remove('dragging'); e.style.rotate = '0deg'; }); });
  const ev = h('div.cy-ev', {}, 'Next speaking event:', h('br'), '13 November 2026', h('div', { style: { marginTop: '8px' } }, h('span.cy-pill', { onclick: () => toast('FFConf · 13 November 2026 (demo)') }, 'FFConf')));
  const intro = h('div.cy-intro', { html: `<p>I’m a creative developer &amp; teacher from Amsterdam, the Netherlands. I create accessible, creative, award winning websites for individuals and companies.</p><p>I teach the next generation of web developers at the Amsterdam University of Applied Sciences at the associate degree <a href="#">Frontend Design &amp; Development</a> and the Minor <a href="#">Web Design &amp; Development</a>.</p>` });
  intro.querySelectorAll('a').forEach((a) => (a.onclick = (e) => e.preventDefault()));
  const hero = h('section.cy-hero', {}, h('div.cy-circ'), h('div', { html: por }).firstChild, hl, intro, ...stks, ev);
  // ---------- work tiles (code-drawn duotone scenes) ----------
  const person = (x, y, s2, shirt, cap, extra = '') => `<g transform="translate(${x} ${y}) scale(${s2})"><path d="M-70 260q0-150 70-170 70 20 70 170z" fill="${shirt}"/><rect x="-14" y="60" width="28" height="36" fill="#d6a184"/><ellipse cx="0" cy="34" rx="34" ry="40" fill="#e4b394"/>${cap ? `<path d="M-36 24q0-40 36-42 38 2 38 42z" fill="${cap}"/><path d="M30 18q30 0 36 10l-36 4z" fill="${cap}"/>` : '<path d="M-36 30q-2-50 36-50 40 0 36 50-10-30-36-30t-36 30z" fill="#3a2a22"/>'}${extra}</g>`;
  const WORK = [
    ['Rotgans Media House', '#3d3540', ['2026', 'DEV', 'MOTION'], `<rect width="460" height="460" fill="#3d3540"/><path d="M60 0v120h90" stroke="#1e1a22" stroke-width="10" fill="none"/>${person(170, 110, 1.15, '#2aa36d', '#3d5a80', '<rect x="30" y="110" width="80" height="50" rx="8" fill="#1a1a1a"/><circle cx="96" cy="135" r="20" fill="#333" stroke="#111" stroke-width="6"/>')}<rect x="120" y="360" width="80" height="100" fill="#c9a77a"/>`],
    ['Club NAR', '#1d3a2a', ['2026', 'DEV', 'GSAP', 'MOTION'], `<rect width="460" height="460" fill="#1d3a2a"/>${person(230, 70, 1.25, '#f2f0ea', '#1f2f6a', '<path d="M-60 140h120v130h-120z" fill="#1a1a1a"/>')}<ellipse cx="230" cy="380" rx="140" ry="40" fill="#2b2b2b"/><ellipse cx="230" cy="370" rx="110" ry="24" fill="#e2b04a"/>${Array.from({ length: 24 }, (_, i) => { const R2 = rng(i + 4); return `<circle cx="${130 + R2() * 200}" cy="${360 + R2() * 20}" r="${4 + R2() * 6}" fill="#f2cf6a"/>`; }).join('')}`],
    ['De Visdeurbel', '#a383ff', ['2025', 'DEV', 'GSAP', 'MOTION'], `<rect width="460" height="460" fill="#a383ff"/>${person(300, 110, 1.2, '#1c2230', null, '<path d="M-10 96l10 80 10-80z" fill="#2a3a30"/><path d="M-16 96h32l-16 20z" fill="#e8dff0"/>')}<path d="M150 300q-30-60 10-90l20 60z" fill="#e4b394"/>`],
    ['Studio Sallali', '#b5705f', ['2023', 'DEV', 'GSAP', 'MOTION'], `<rect width="460" height="460" fill="#b5705f"/><g transform="rotate(-24 230 230)"><rect x="40" y="130" width="250" height="300" fill="#f4f2ee"/><rect x="290" y="130" width="160" height="300" fill="#e6e3dd"/><rect x="310" y="160" width="120" height="80" fill="#1c1f2a"/><path d="M320 230l40-60 20 30 20-20 20 50z" fill="#4a7fd0"/><text x="330" y="270" font-family="Instrument Serif,serif" font-size="16" fill="#333">The Photographic</text><text x="330" y="290" font-family="Instrument Serif,serif" font-size="16" fill="#333">Surface</text></g>`],
    ['BROED', '#dd1111', ['2024', 'DEV', 'GSAP', 'MOTION', 'THREE.JS'], `<rect width="460" height="460" fill="#dd1111"/>${person(110, 130, 1.1, '#cfd5dc', null, '<path d="M60 150l220 50" stroke="#e4b394" stroke-width="26" stroke-linecap="round"/>')}<path d="M340 250l-40 210M340 250l20 210" stroke="#c49a4a" stroke-width="6"/>`],
    ['The Kotaverse', '#e026a0', ['2024', 'DEV', 'GSAP', 'THREE.JS'], `<rect width="460" height="460" fill="#e026a0"/>${[[150, 90, 1], [330, 120, 0.9]].map(([x, y, s2]) => `<g transform="translate(${x} ${y}) scale(${s2})"><ellipse cx="0" cy="40" rx="38" ry="42" fill="#f2f0ea"/><path d="M-30 40h60v20h-60z" fill="#111"/><path d="M-60 100q60-30 120 0v240h-120z" fill="#f2f0ea"/><path d="M-60 160h120v14h-120zM-20 100v240" stroke="#111" stroke-width="6"/></g>`).join('')}`],
  ];
  const tileSVG = (w) => `<svg viewBox="0 0 460 460" preserveAspectRatio="xMidYMid slice">${w[3]}</svg>`;
  const tiles = WORK.map((w) => h('div.cy-tile', { title: w[0], html: tileSVG(w) + `<b>${w[0]}</b>`, onclick: () => toast(`${w[0]} · case study (demo)`) }, h('div.tags', {}, w[2].map((t) => h('i', {}, t)))));
  const prev = h('div.cy-prev'); document.body.append(prev);
  const lnk = (t, wi) => { const a = h('a', {}, t); a.onpointerenter = () => { tiles[wi].classList.add('hov'); a.classList.add('hl'); prev.innerHTML = tileSVG(WORK[wi]); prev.classList.add('on'); }; a.onpointermove = (e) => { prev.style.left = e.clientX + 'px'; prev.style.top = e.clientY + 'px'; }; a.onpointerleave = () => { tiles[wi].classList.remove('hov'); a.classList.remove('hl'); prev.classList.remove('on'); }; return a; };
  const txt1 = h('div.cy-txt', {}, 'From ', lnk('small studio’s', 3), ' and ', lnk('freelancers', 2), ' to ', lnk('campaigns', 5), ' and ', lnk('large international companies', 4), ', I create websites for all of them.', h('br'), h('span.cy-pill', { onclick: () => toast('All work → archive (demo)') }, 'All work'));
  const txt2 = h('div.cy-txt', { html: 'I talk about how I think we <i>should</i> build for the web, focussing on where design, code, and accessibility overlap.<br>' }, h('span.cy-pill', { onclick: () => go('Speaking') }, 'Speaking'));
  const work = h('section.cy-work', {}, tiles[0], tiles[1], txt1, txt2, tiles[2], tiles[3], tiles[4], tiles[5]);
  // ---------- blogs ----------
  const BLOG = [['October 7, 2026', ['Animation', 'CSS', 'Rant', 'Scroll-driven animations'], 'Demo deep-dive, praise and thoughts from Fronteers Dark Mode Conference', 24, '#f2a200', '#fff4e0'],
    ['September 15, 2026', ['CSS', 'New features', 'Scroll-triggered animations'], 'CSS scroll-triggered animations are here, and I completely missed them', 20, '#5b2d91', '#f5ecf0'], ['July 8, 2026', ['Animation', 'CSS', 'View transitions'], 'A deep dive into how I set up view transitions', 40, '#1e8ff0', '#f0f2f4'],
    ['July 3, 2026', ['Case study', 'Experimental'], '(Showing how) the whole world rang the fish doorbell this season', 6, '#9f6cf5', '#f6eff8'], ['December 13, 2025', ['CSS', 'JS'], 'Why we teach our students progressive enhancement', 53, '#d9533f', '#fdeee6'], ['November 2, 2025', ['Animation'], 'How I turn static designs into rich experiences', 18, '#e8004f', '#fde9ec']];
  const cards = BLOG.map(([d, ch, t, n, c, b], i) => vars(h('article.cy-card', { onclick: () => toast(`“${t.slice(0, 40)}…” (demo)`) }, h('div.d', {}, d), h('div.ch', {}, ch.map((x) => h('i', {}, x))), h('h3', {}, t), h('div.wm', {}, `${n} webmentions`)), { '--c': c, '--b': b, '--rt': (i % 2 ? 1.2 : -1.2) + 'deg' }));
  const blogs = h('section.cy-blogs', {}, h('h2', {}, 'Latest blogs'), h('div.cy-bg', {}, cards));
  // ---------- tilted service cards with pixel-art cursor icons ----------
  const pixel = (draw, W = 26, H = 26) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.fillStyle = '#000'; draw(g); const d = g.getImageData(0, 0, W, H); const m = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d.data[(y * W + x) * 4 + 3] > 120;
    const o = document.createElement('canvas'); o.width = W + 3; o.height = H + 3; const og = o.getContext('2d');
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m(x, y)) { og.fillStyle = '#111'; og.fillRect(x + 2, y + 2, 1, 1); }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m(x, y)) { const e = !m(x - 1, y) || !m(x + 1, y) || !m(x, y - 1) || !m(x, y + 1); og.fillStyle = e ? '#111' : CREAM; og.fillRect(x, y, 1, 1); }
    return o.toDataURL(); };
  const PH = pixel((g) => { g.fillRect(9, 1, 4, 14); g.fillRect(13, 8, 3, 8); g.fillRect(16, 9, 3, 7); g.fillRect(19, 10, 3, 8); g.beginPath(); g.moveTo(9, 13); g.lineTo(4, 10); g.lineTo(3, 12); g.lineTo(8, 19); g.lineTo(8, 25); g.lineTo(21, 25); g.lineTo(22, 16); g.fill(); g.clearRect(13, 10, 1, 4); g.clearRect(16, 11, 1, 4); });
  const PB = pixel((g) => { g.beginPath(); g.arc(13, 10, 8.5, 0, 7); g.fill(); g.fillRect(9, 17, 8, 8); g.clearRect(10, 8, 1, 7); g.clearRect(12, 8, 1, 7); g.clearRect(14, 8, 1, 7); g.clearRect(9, 20, 8, 1); });
  const PP = pixel((g) => { g.beginPath(); g.arc(13, 13, 8, 0, 7); g.fill(); g.save(); g.translate(13, 13); g.rotate(-0.4); g.fillRect(-13, -2, 26, 4); g.restore(); g.clearRect(5, 12, 2, 1); });
  const SVC = [['Web development', -3.5, PH, ['Front-end development', 'Service', 'Available November 2026', 'Creative development']], ['Consultancy', 3, PB, ['Service', 'Web development', 'Accessibility', 'Animation', 'GSAP', 'Three.js', 'Modernizing native tech stacks', '(New) CSS techniques']], ['Speaking', 1.2, PP, ['Conferences', 'Meetups', 'Workshops', 'Company talks']]];
  const scs = SVC.map(([t, r, img, tags]) => vars(h('div.cy-sc', { onclick: () => toast(`${t} · Available November 2026`) }, h('h3', {}, ...t.split(' ').flatMap((w, i) => (i ? [h('br'), w] : [w]))), h('img', { src: img, alt: '' }), h('div.rail', {}, h('div', {}, [...tags, ...tags].map((x) => h('i', {}, x))))), { '--rt': r + 'deg' }));
  const svc = h('section.cy-svc', {}, scs);
  // ---------- footer ----------
  const ft = h('footer.cy-ft', {}, h('div.row', {}, h('div', {}, h('div.lg', {}, 'CYD'), h('p', {}, 'I’m a creative developer & teacher from Amsterdam.')), h('div.r', {}, h('div.a', {}, 'Available November 2026'), h('p', {}, 'Have a project in mind?'), h('a', { onclick: () => copy(EMAIL, 'Email copied') }, EMAIL))),
    h('div.links', {}, h('div', {}, ['About', 'Archive', 'Blogs', 'Speaking', 'Contact'].map((k) => h('span', { style: { cursor: 'pointer' }, onclick: () => go(k) }, k))), h('div.s', {}, ['Github', 'Codepen', 'Bluesky', 'Mastodon', 'Instagram', 'LinkedIn', 'RSS'].map((k) => h('span', {}, k)))));
  Object.assign(secs, { About: hero, Archive: work, Speaking: svc, Blogs: blogs, Contact: ft });
  el.append(h('div.cy-top', {}, mTop), box, hd, hero, work, blogs, svc, ft, mBot);
  // ---------- motion loop: marquees + sticky state ----------
  let lastY = 0, vel = 0, raf;
  const loop = () => { const y = root.scrollTop; vel = vel * 0.9 + (y - lastY) * 0.1; lastY = y; const sp = 0.9 + Math.min(Math.abs(vel) * 0.4, 10);
    if (!RM) { mTop.x -= sp; mBot.x += sp * 0.8; const W = mTop.tr.firstChild.offsetWidth || 1; if (mTop.x < -W) mTop.x += W; if (mBot.x > 0) mBot.x -= W; mTop.tr.style.transform = `translateX(${mTop.x}px)`; mBot.tr.style.transform = `translateX(${mBot.x}px)`; }
    hd.classList.toggle('stuck', hd.getBoundingClientRect().top <= root.getBoundingClientRect().top + 1 && y > 20); raf = requestAnimationFrame(loop); };
  loop();
  window.__demoProof = async () => { await fontsP; const o = []; const w = (ms) => sleep(RM ? 40 : ms);
    clearInterval(roleT); const r0 = ROLES[ri].join(' '); nextRole(); await w(900); o.push(`role ${r0}→${ROLES[ri].join(' ')} (dom="${w1.textContent} ${w2.textContent}")`);
    const x0 = mTop.x; await sleep(300); o.push(`wordmark marquee moving=${RM ? 'off (reduced motion)' : mTop.x !== x0}`);
    pop(); await w(400); o.push(`box pop=${box.classList.contains('pop')} icons=${box.querySelectorAll('.ic').length}`);
    const s = stks[0], L0 = s.offsetLeft; const r = s.getBoundingClientRect(); s.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: r.left + 20, clientY: r.top + 20, pointerId: 7 })); s.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: r.left + 140, clientY: r.top + 60, pointerId: 7 })); s.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 7 }));
    o.push(`sticker drag left ${L0}→${s.offsetLeft}`); stks.forEach((e) => { e.style.left = e.home[0] + 'px'; e.style.top = e.home[1] + 'px'; });
    const a = txt1.querySelector('a'); a.onpointerenter(); o.push(`hover "${a.textContent}" → tile ${WORK[3][0]} hov=${tiles[3].classList.contains('hov')} preview=${prev.classList.contains('on')}`); a.onpointerleave();
    root.scrollTop = blogs.offsetTop * (parseFloat(el.style.zoom) || 1); await sleep(200); o.push(`scrolled to blogs: header stuck=${hd.classList.contains('stuck')} cards=${cards.length}`);
    cards[0].classList.add('hov'); scs[1].classList.add('hov'); await w(300); o.push(`card tilt=${getComputedStyle(cards[0]).transform !== 'none'}`); cards[0].classList.remove('hov'); scs[1].classList.remove('hov');
    root.scrollTop = 0; await sleep(150); o.push(`back to top stuck=${hd.classList.contains('stuck')}`);
    nextRole(1); roleT = setInterval(() => !document.hidden && nextRole(), RM ? 4000 : 2600); await w(800); o.push(`restored role=${ROLES[ri].join(' ')}`); return o.join('; '); };
};


V['ohnotype-drawer-family-rail-giant-variable-specimen-inline-type-tester-option-chips'] = (root, T) => {
  import('@fontsource-variable/dm-sans/opsz.css'); import('@fontsource-variable/dm-sans/opsz-italic.css');
  import('@fontsource/courier-prime/400-italic.css'); import('@fontsource/ibm-plex-mono/400.css'); import('@fontsource/ibm-plex-mono/600.css');
  theme(root, T, { bg: '#fff', fg: '#000', ac: '#000', dark: false }); root.classList.add('scroll'); root.style.overflow = 'auto';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DG = "'DM Sans Variable','Helvetica Neue',Arial,sans-serif", IT = "'Courier Prime','Courier New',monospace", UI = "'IBM Plex Mono','JetBrains Mono Variable',monospace";
  // stand-in faces for the other OH no families (lazy-loaded on click)
  const LOAD = {
    anton: () => import('@fontsource/anton'), fraunces: () => import('@fontsource-variable/fraunces/full.css'), gochi: () => import('@fontsource/gochi-hand'), lilita: () => import('@fontsource/lilita-one'),
    archivo: () => import('@fontsource-variable/archivo/wdth.css'), federant: () => import('@fontsource/federant'), instr: () => import('@fontsource/instrument-serif/400.css'), playfair: () => import('@fontsource/playfair-display/900.css'),
    bodoni: () => import('@fontsource/bodoni-moda/700.css'), pinyon: () => import('@fontsource/pinyon-script'), marker: () => import('@fontsource/permanent-marker'), gilda: () => import('@fontsource/gilda-display'),
    coming: () => import('@fontsource/coming-soon'), nunito: () => import('@fontsource-variable/nunito'), outfit: () => import('@fontsource-variable/outfit'), fell: () => import('@fontsource/im-fell-english'),
    courier: () => import('@fontsource/courier-prime/700.css'), garamond: () => import('@fontsource/eb-garamond'), jb: () => Promise.resolve(), silk: () => import('@fontsource/silkscreen'), cormorant: () => import('@fontsource/cormorant-upright/700.css'),
  };
  const F = (name, price, face, ld, w = 700, extra = {}) => ({ name, price, face, ld, w, ...extra });
  const FAM = [F('BEASTLY', 60, "'Anton',Impact,sans-serif", 'anton', 400), F('CAMELION', 340, "'Fraunces Variable',serif", 'fraunces', 900, { vw: 1 }), F('CASSEROLE', 120, "'Gochi Hand',cursive", 'gochi', 400),
    F('CHEEE', 150, "'Lilita One',sans-serif", 'lilita', 400), F('COMPADRE', 420, "'Archivo Variable',sans-serif", 'archivo', 800, { wdth: 125, vw: 1 }), F('CONIFEROUS', 90, "'Federant',serif", 'federant', 400),
    F('COVIK', 260, "'Instrument Serif',serif", 'instr', 400), F('DEGULAR', 519, DG, null, 900, { variable: true }), F('ECKMANNPSYCH', 180, "'Cormorant Upright',serif", 'cormorant', 700),
    F('FOREVS', 240, "'Playfair Display',serif", 'playfair', 900), F('HOBEAUX', 280, "'Bodoni Moda',serif", 'bodoni', 700), F('HOBEAUX ROCOCEAUX', 160, "'Pinyon Script',cursive", 'pinyon', 400),
    F('IRREGARDLESS', 100, "'Permanent Marker',cursive", 'marker', 400), F('MONTREUIL', 220, "'Gilda Display',serif", 'gilda', 400), F('OBVIOUSLY', 650, "'Archivo Variable',sans-serif", 'archivo', 900, { wdth: 62, vw: 1 }),
    F('OHNO BLAZEFACE', 300, "'Playfair Display',serif", 'playfair', 900, { ital: 1 }), F('OHNO CASUAL', 140, "'Coming Soon',cursive", 'coming', 400), F('OHNO FATFACE', 200, "'Bodoni Moda',serif", 'bodoni', 700, { ital: 1 }),
    F('OHNO SOFTIE', 180, "'Nunito Variable',sans-serif", 'nunito', 900, { vw: 1 }), F('POLYMATH', 480, "'Outfit Variable',sans-serif", 'outfit', 800, { vw: 1 }), F('REGRETS', 80, "'IM Fell English',serif", 'fell', 400),
    F('RETAIL', 160, "'Courier Prime',monospace", 'courier', 700), F('SWEAR', 360, "'EB Garamond',serif", 'garamond', 700), F('VIKTOR SCRIPT', 120, "'Pinyon Script',cursive", 'pinyon', 400),
    F('VULF', 390, "'JetBrains Mono Variable',monospace", 'jb', 800, { vw: 1 }), F('YUMEX', 90, "'Silkscreen',monospace", 'silk', 400)];
  const DEF = 'DEGULAR'; let act = FAM.find((f) => f.name === DEF);
  const title = (n) => n.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  css(`.oh{background:#fff;color:#000;min-height:100%;position:relative;font:400 11px/1.2 ${UI}}
.oh *{box-sizing:border-box}.oh button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.oh-side{position:sticky;top:0;float:left;width:0;height:0;z-index:30}
.oh-logo{position:absolute;left:28px;top:30px;width:32px;height:32px;display:block}.oh-logo svg{width:100%;height:100%}
.oh-nav{position:absolute;left:32px;top:126px;display:flex;flex-direction:column;gap:4px;font:italic 400 20px/1.05 ${IT};letter-spacing:-.01em}
.oh-nav button{text-align:left;color:#000;transition:opacity .15s;white-space:nowrap}.oh-nav button.on{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
.oh-nav button:hover{opacity:.55}.oh-nav .ct{font:400 10px ${UI};vertical-align:super;margin-left:2px}
.oh-sec{position:absolute;left:32px;top:274px;display:flex;flex-direction:column;gap:9px;font:400 10px/1 ${UI};letter-spacing:.05em}
.oh-sec a{color:#000;text-decoration:none}.oh-sec a:hover{text-decoration:underline}
.oh-drw{position:absolute;left:64px;top:0;height:100vh;display:flex;pointer-events:none;transition:transform .35s cubic-bezier(.2,.8,.2,1),opacity .25s}
.oh-drw.shut{transform:translateX(-24px);opacity:0}.oh-drw.shut *{pointer-events:none!important}
.oh-fam{width:250px;height:100%;background:#fff;border-left:1px solid #000;padding:130px 0 0;pointer-events:auto;overflow:hidden}
.oh-fam button{display:block;width:100%;text-align:left;padding:0 0 0 17px;height:28.6px;font:400 10.5px/28.6px ${UI};letter-spacing:.05em;white-space:nowrap}
.oh-fam button:hover{text-decoration:underline}.oh-fam button.on{font-weight:600}
.oh-sub{position:absolute;left:64px;top:0;width:190px;height:100%;background:#fff;border-left:1px solid #000;padding:128px 0 0;pointer-events:auto;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.oh-drw.peek .oh-sub{transform:translateX(150px)}
.oh-sub button{display:block;width:100%;text-align:left;padding:0 0 0 16px;height:28.6px;font:400 10.5px/28.6px ${UI};letter-spacing:.05em;white-space:nowrap}
.oh-sub button:hover{text-decoration:underline}.oh-sub .buy{background:#000;color:#fff;height:29px;line-height:29px;margin-bottom:0}.oh-sub .buy:hover{text-decoration:none;background:#222}
.oh-main{margin-left:512px;max-width:820px;padding:150px 40px 160px 0}
.oh-t{position:relative;margin-bottom:96px}
.oh-lab{display:flex;align-items:center;gap:22px;min-height:20px;font:400 10px/1 ${UI};letter-spacing:.06em;color:#9b9b9b;text-transform:uppercase}
.oh-ops{display:flex;gap:6px;opacity:0;transition:opacity .2s;margin-left:auto;color:#000;position:relative}
.oh-t:hover .oh-ops,.oh-t.edit .oh-ops,.oh-t.pin .oh-ops{opacity:1}
.oh-chip{border:1px solid #000!important;border-radius:99px;height:22px;padding:0 10px!important;font:400 10px/20px ${UI}!important;letter-spacing:.04em;background:#fff!important;white-space:nowrap}
.oh-chip:hover,.oh-chip.on{background:#000!important;color:#fff!important}
.oh-pop{position:absolute;right:0;top:28px;z-index:20;background:#fff;border:1px solid #000;padding:12px 14px;min-width:230px;display:grid;gap:10px;color:#000;font:400 10px ${UI}}
.oh-pop label{display:grid;grid-template-columns:52px 1fr 36px;align-items:center;gap:8px}.oh-pop input[type=range]{accent-color:#000;width:100%}
.oh-pop .opt{display:flex;flex-wrap:wrap;gap:5px}
.oh-ed{outline:none;color:#000;word-break:break-word;caret-color:#000;transition:font-size .15s}
.oh-ed:focus{background:linear-gradient(#0000 calc(100% - 1px),#0000)}
.oh-hero .oh-ed{font-size:226px;line-height:1.08;letter-spacing:-.025em;margin:48px 0 0;white-space:nowrap;overflow:visible}
.oh-txt .oh-ed{font-size:36px;line-height:1.26;letter-spacing:-.005em;margin-top:42px}
.oh-mono .oh-ed{font:500 22px/1.35 ${UI};margin-top:36px}
.oh-div{font:600 11px/1 ${UI};letter-spacing:.08em;text-align:center;margin:0 0 92px;white-space:nowrap;overflow:hidden}
.oh-disp .oh-ed{font-size:150px;line-height:1.1;letter-spacing:-.02em;margin-top:28px;white-space:nowrap}
.oh-co .oh-ed{font-size:62px;line-height:1.15;letter-spacing:-.01em;margin-top:22px}
.oh-rd{position:absolute;right:0;bottom:-18px;font:400 10px ${UI};color:#9b9b9b;opacity:0;transition:opacity .2s}.oh-hero:hover .oh-rd{opacity:1}
.oh-cart{position:fixed;top:var(--tg-h,38px);right:0;bottom:0;width:340px;background:#fff;border-left:1px solid #000;z-index:60;transform:translateX(101%);transition:transform .35s cubic-bezier(.2,.8,.2,1);padding:26px 24px;display:flex;flex-direction:column;gap:14px}
.oh-cart.on{transform:none}.oh-cart h3{margin:0;font:italic 400 24px ${IT}}.oh-cart .row{display:flex;justify-content:space-between;border-top:1px solid #000;padding:12px 0;font:400 11px ${UI};letter-spacing:.04em}
.oh-cart .x{position:absolute;right:20px;top:24px;font:400 11px ${UI}}.oh-cart .co{margin-top:auto;background:#000;color:#fff;height:40px;font:400 11px ${UI};letter-spacing:.06em}
.oh-mb{display:none}
@media (max-width:820px){.oh-side{position:relative;float:none;width:auto;height:64px}.oh-logo{left:16px;top:16px}.oh-nav{left:auto;right:16px;top:20px;flex-direction:row;gap:12px;font-size:16px}.oh-sec{display:none}
.oh-drw{position:fixed;left:0;top:calc(var(--tg-h,38px) + 64px);height:calc(100vh - 102px);z-index:40}.oh-fam{width:150px;padding-top:12px}.oh-sub{left:150px;width:160px;padding-top:12px;border-right:1px solid #000}.oh-drw.peek .oh-sub{transform:none}
.oh-main{margin-left:0;padding:40px 16px 100px}.oh-hero .oh-ed{font-size:min(226px,24vw)}.oh-txt .oh-ed{font-size:23px}.oh-mono .oh-ed{font-size:15px}.oh-disp .oh-ed{font-size:min(150px,22vw)}.oh-co .oh-ed{font-size:30px}.oh-ops{opacity:1;flex-wrap:wrap}.oh-lab{flex-wrap:wrap;gap:8px}.oh-div{white-space:normal;line-height:1.5}.oh-cart{width:100%}}
${RM ? '.oh *{transition:none!important}' : ''}`);
  const el = h('div.oh'); root.append(el);
  const logo = h('a.oh-logo', { href: '#', title: 'OH no Type Company', onclick: (e) => { e.preventDefault(); root.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); },
    html: '<svg viewBox="0 0 34 34" width="34" height="34"><ellipse cx="9.5" cy="17" rx="7" ry="13.5" fill="none" stroke="#000" stroke-width="4.6"/><path d="M17.5 3.5v27M31 3.5v27M17.5 17H31" stroke="#000" stroke-width="4.6" fill="none"/></svg>' });
  let cart = [];
  const ctBadge = h('span.ct');
  const navB = {};
  const nav = h('div.oh-nav', {}, ...[['fonts', () => toggleDrawer()], ['custom', () => toast('custom → bespoke type commissions')], ['drawer', () => openCart(true)], ['sign in', () => toast('sign in (demo)')]].map(([t, fn]) => (navB[t] = h('button', { onclick: fn }, t, t === 'drawer' ? ctBadge : null))));
  const sec = h('div.oh-sec', {}, ...['INFO', 'DEMO FONTS', 'COLLECTIONS', 'INSTAGRAM', 'BLOG'].map((t) => h('a', { href: '#', onclick: (e) => { e.preventDefault(); toast(t.toLowerCase()); } }, t)));
  const famCol = h('div.oh-fam'); const buyB = h('button.buy', { onclick: () => addToCart() });
  const SUB = [['STYLES', () => jump(sDisp)], ['IN-USE', () => toast('in-use gallery')], ['FEATURES', () => { jump(tHero); tHero.openPop('feat'); }], ['COLLECTIONS', () => toast('collections')], ['SPECIMEN ✧', () => jump(tHero)], ['DEMOS →', () => toast('download demo fonts')], ['PROCESS →', () => toast('process essay')]];
  const subCol = h('div.oh-sub', {}, buyB, ...SUB.map(([t, fn]) => h('button', { onclick: fn }, t)));
  const drw = h('div.oh-drw', { onpointerleave: () => drw.classList.remove('peek') }, famCol, subCol);
  famCol.addEventListener('pointerenter', () => drw.classList.add('peek'));
  subCol.addEventListener('pointerenter', () => drw.classList.remove('peek'));
  el.append(h('div.oh-side', {}, logo, nav, sec, drw));
  const main = h('div.oh-main'); el.append(main);
  const jump = (n) => n.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  // ---- tester factory
  const testers = [];
  function tester(cls, label, text, st) {
    const s0 = { ...st };
    const t = h('div.oh-t.' + cls); const lab = h('span'); const ops = h('div.oh-ops');
    const ed = h('div.oh-ed', { contenteditable: 'true', spellcheck: 'false' }, text);
    ed.addEventListener('focus', () => t.classList.add('edit')); ed.addEventListener('blur', () => t.classList.remove('edit'));
    const o = { el: t, ed, st: { ...st }, label, text, cls };
    const apply = () => {
      const f = o.st.face || act.face; const isDG = !o.st.face && act.variable;
      ed.style.fontFamily = f;
      ed.style.fontWeight = o.st.face || act.variable || act.vw ? (o.st.w ?? act.w) : act.w;
      const fvs = []; if (isDG) fvs.push(`"opsz" ${o.st.opsz ?? 40}`); if (/Archivo/.test(f) && !o.st.face) fvs.push(`"wdth" ${act.wdth || 100}`);
      ed.style.fontVariationSettings = fvs.join(',') || 'normal';
      ed.style.fontStyle = o.st.ital || (!o.st.face && act.ital) ? 'italic' : 'normal';
      const ff = []; if (o.st.tnum) ff.push('"tnum"'); if (o.st.ss01) ff.push('"ss01"'); if (o.st.frac) ff.push('"frac"');
      ed.style.fontFeatureSettings = ff.join(',') || 'normal';
      ed.style.fontVariantCaps = o.st.caps ? 'all-small-caps' : 'normal';
      ed.style.letterSpacing = o.st.track != null ? o.st.track + 'em' : '';
      ed.style.fontSize = o.st.size ? o.st.size + 'px' : '';
      ed.style.textAlign = o.st.center ? 'center' : '';
      const nm = act.name === DEF ? 'DEGULAR' : act.name;
      lab.textContent = typeof label === 'function' ? label(nm, o.st) : label;
      ops.querySelectorAll('[data-k]').forEach((b) => b.classList.toggle('on', !!o.st[b.dataset.k]));
    };
    o.apply = apply;
    let pop = null;
    const closePop = () => { pop?.remove(); pop = null; t.classList.remove('pin'); ops.querySelectorAll('.oh-chip.pp').forEach((b) => b.classList.remove('on')); };
    const rng = (k, lbl, mn, mx, def, step = 1) => { const out = h('span', {}, String(Math.round(o.st[k] ?? def))); return h('label', {}, lbl, h('input', { type: 'range', min: mn, max: mx, step, value: o.st[k] ?? def, oninput: (e) => { o.st[k] = +e.target.value; out.textContent = Math.round(+e.target.value); apply(); } }), out); };
    o.openPop = (kind) => {
      const was = pop?.dataset.kind; closePop(); if (was === kind) return;
      t.classList.add('pin');
      const WTS = [['Thin', 100], ['Light', 300], ['Regular', 400], ['Medium', 500], ['Semibold', 600], ['Bold', 700], ['Black', 900]];
      const body = kind === 'var' ? [rng('w', 'wght', 100, 1000, o.st.w ?? act.w), rng('opsz', 'opsz', 9, 40, o.st.opsz ?? 40, 0.1)]
        : kind === 'size' ? [rng('size', 'size', 12, cls === 'oh-hero' ? 300 : 200, parseFloat(getComputedStyle(ed).fontSize)), rng('track', 'track', -0.08, 0.2, o.st.track ?? 0, 0.005)]
          : kind === 'style' ? [h('div.opt', {}, ...WTS.map(([n, w]) => h('button.oh-chip' + ((o.st.w ?? act.w) === w ? '.on' : ''), { onclick: () => { o.st.w = w; apply(); o.openPop('style'); o.openPop('style'); } }, n)),
            h('button.oh-chip' + (o.st.ital ? '.on' : ''), { onclick: () => { o.st.ital = !o.st.ital; apply(); o.openPop('style'); o.openPop('style'); } }, 'Italic'))]
            : [h('div.opt', {}, ...[['ss01', 'ss01 alt'], ['tnum', 'tnum 0123'], ['frac', 'frac 1/2'], ['caps', 'Small caps'], ['center', 'Center']].map(([k, n]) => h('button.oh-chip' + (o.st[k] ? '.on' : ''), { onclick: () => { o.st[k] = !o.st[k]; apply(); o.openPop('feat'); o.openPop('feat'); } }, n)))];
      pop = h('div.oh-pop', { 'data-kind': kind }, ...body,
        h('button.oh-chip', { style: { justifySelf: 'start' }, onclick: () => { o.st = { ...s0 }; ed.textContent = text; apply(); closePop(); } }, 'Reset'));
      ops.append(pop); ops.querySelector(`[data-p="${kind}"]`)?.classList.add('on');
    };
    const chips = (cls === 'oh-hero' ? [['var', 'Variables']] : [['style', 'Styles']]).concat([['size', 'Size'], ['feat', 'Opentype']]);
    ops.append(...chips.map(([k, n]) => h('button.oh-chip.pp', { 'data-p': k, onclick: (e) => { e.stopPropagation(); o.openPop(k); } }, n + ' ▾')), h('span', { style: { color: '#9b9b9b', alignSelf: 'center', marginLeft: '8px' } }, 'Format  Opentype'));
    t.append(h('div.oh-lab', {}, lab, ops), ed); apply(); testers.push(o); o.close = closePop; o.reset = () => { o.st = { ...s0 }; ed.textContent = text; closePop(); apply(); };
    return o;
  }
  addEventListener('pointerdown', (e) => { if (!e.target.closest?.('.oh-ops')) testers.forEach((x) => x.close()); });
  const tHero = tester('oh-hero', (n, st) => `${n} ${act.variable ? 'VARIABLE' : '— ' + (st.w >= 800 || (!st.w && act.w >= 800) ? 'BLACK' : 'REGULAR')}`, 'Degular', { w: 900 });
  const rd = h('span.oh-rd'); tHero.el.append(rd);
  // pointer scrub on the variable wordmark: x → wght
  let scrub = false;
  tHero.ed.addEventListener('pointermove', (e) => { if (!act.variable || document.activeElement === tHero.ed || tHero.el.classList.contains('pin')) return; const r = tHero.ed.getBoundingClientRect(); const w = Math.round(100 + clamp((e.clientX - r.left) / r.width, 0, 1) * 900); tHero.ed.style.fontWeight = w; rd.textContent = `wght ${w} · move ← → to scrub · click to type`; scrub = true; });
  tHero.ed.addEventListener('pointerleave', () => { if (scrub) { scrub = false; tHero.apply(); } });
  const W = 'From the foundry that → brought you, “Hobeaux” (2015), “Ohno™ Blazeface” (2019), and “Cheee” (2020), comes something with (significantly) less allure. ✧ While {most of} the fonts around here scream in desperate need of your peepers’ gaze, Degular aims to fade into the background [like the finest Japanese-made white noise machine as you drift off to ~dreamland~]. ¶ Degular also provides a once-in-a-lifetime opportunity to use an Ohno font more than once! 7 weights, 3 optical sizes, in ☑roman and ☑italic.';
  const tTxt = tester('oh-txt', (n) => `${n} TEXT — LIGHT`, W, { w: 300, opsz: 14 });
  const tMono = tester('oh-mono', 'DEGULAR MONO — MEDIUM', 'From the foundry that brought you “Degular” (2020), comes Degular Mono. 7 Add\'l styles. It\'s like Degular, but it\'s doing a robot voice.', { face: UI, w: 500 });
  const div1 = h('div.oh-div', {}, '• • • • • • • §1: THE DISPLAY STYLES. USE THEM BIG. BE BOLD. BE PROUD. BE DEGULAR. • • • • • • •');
  const sDisp = h('div'); const disp = [['BLACK', 900, 'Firm'], ['BOLD', 700, 'Trust'], ['SEMIBOLD', 600, 'Group'], ['MEDIUM', 500, 'Studio'], ['REGULAR', 400, 'House'], ['LIGHT', 300, 'Agency'], ['THIN', 100, 'Company']]
    .map(([n, w, s]) => tester('oh-disp', (f) => `${f} DISPLAY — ${n}`, s, { w, opsz: 40 }));
  const div2 = h('div.oh-div', {}, '• • • • • • • §2: THE DEGULAR STYLES. THEY’RE SOMEHOW MORE DEGULAR THAN DEGULAR ITSELF. • • • • • • •');
  const cos = [['BLACK', 900, 'Ordinary Merchandising, LLC'], ['BOLD', 700, 'Unremarkable Enterprises Co.'], ['SEMIBOLD', 600, 'Supervanilla International GmbH'], ['MEDIUM', 500, 'Flat Services & Manufacturing Inc.'], ['REGULAR', 400, 'Monotony Systems Management AG'], ['LIGHT', 300, 'Basic Industries Marketing Group Corp.'], ['THIN', 100, 'Ho-Hum Business Collective']]
    .map(([n, w, s]) => tester('oh-co', (f) => `${f} — ${n}`, s, { w, opsz: 24 }));
  sDisp.append(div1, ...disp.map((x) => x.el));
  main.append(tHero.el, tTxt.el, tMono.el, sDisp, div2, ...cos.map((x) => x.el), h('div', { style: { font: `italic 400 18px ${IT}`, marginTop: '40px' } }, '© OH no Type Company — fonts for people who like fonts (look-alike study).'));
  // ---- family rail
  function drawFam() { famCol.replaceChildren(...FAM.map((f) => h('button' + (f === act ? '.on' : ''), { onclick: () => selectFam(f.name) }, f.name))); buyB.textContent = `BUY — $${act.price}`; }
  function selectFam(name) {
    const f = FAM.find((x) => x.name === name); if (!f) return; act = f; f.ld && LOAD[f.ld]?.().catch(() => {});
    tHero.ed.textContent = title(f.name); testers.forEach((x) => x.apply());
    drawFam();
  }
  const toggleDrawer = (v) => { const open = v ?? drw.classList.contains('shut'); drw.classList.toggle('shut', !open); navB.fonts.classList.toggle('on', open); };
  function openCart(on) {
    let c = el.querySelector('.oh-cart');
    if (!c) { c = h('aside.oh-cart'); el.append(c); }
    const total = cart.reduce((a, x) => a + x.price, 0);
    c.replaceChildren(h('h3', {}, 'drawer'), h('button.x', { onclick: () => openCart(false) }, 'CLOSE ✕'),
      ...(cart.length ? cart.map((x, i) => h('div.row', {}, h('span', {}, `${x.name} — COMPLETE FAMILY`), h('span', {}, `$${x.price} `, h('button', { onclick: () => { cart.splice(i, 1); ctBadge.textContent = cart.length || ''; openCart(true); } }, '✕')))) : [h('div', { style: { font: `italic 400 16px ${IT}` } }, 'your drawer is empty (for now).')]),
      h('div.row', {}, h('span', {}, 'TOTAL'), h('span', {}, `$${total}`)), h('button.co', { onclick: () => toast('checkout (demo — nothing is charged)') }, 'CHECK OUT →'));
    requestAnimationFrame(() => c.classList.toggle('on', on));
  }
  function addToCart() { if (!cart.find((x) => x.name === act.name)) cart.push({ name: act.name, price: act.price }); ctBadge.textContent = cart.length; openCart(true); }
  const DRW0 = !matchMedia('(max-width:820px)').matches; drawFam(); toggleDrawer(DRW0);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { openCart(false); testers.forEach((x) => x.close()); } });
  window.__demoProof = async () => {
    const o = [];
    toggleDrawer(false); await sleep(60); toggleDrawer(true); await sleep(60); o.push(`drawer toggle closed→${drw.classList.contains('shut') ? 'closed' : 'open'}`);
    drw.classList.add('peek'); await sleep(40); o.push('peek rail'); drw.classList.remove('peek');
    selectFam('HOBEAUX'); await sleep(250); o.push(`family→${act.name} buy="${buyB.textContent}" hero="${tHero.ed.textContent}" face=${tHero.ed.style.fontFamily.split(',')[0]}`);
    selectFam(DEF); o.push(`family→${act.name}`);
    tHero.openPop('var'); const sl = tHero.el.querySelector('.oh-pop input'); sl.value = 200; sl.dispatchEvent(new Event('input')); o.push(`hero wght=${getComputedStyle(tHero.ed).fontWeight}`); tHero.reset();
    tTxt.openPop('feat'); tTxt.st.caps = true; tTxt.st.center = true; tTxt.apply(); o.push(`txt caps=${getComputedStyle(tTxt.ed).fontVariantCaps} align=${getComputedStyle(tTxt.ed).textAlign}`); tTxt.reset();
    disp[0].openPop('size'); disp[0].st.size = 90; disp[0].apply(); o.push(`Firm size=${getComputedStyle(disp[0].ed).fontSize}`); disp[0].reset();
    tHero.ed.textContent = 'Ohno!'; o.push(`edit="${tHero.ed.textContent}"`); tHero.reset();
    addToCart(); o.push(`drawer items=${cart.length} badge=${ctBadge.textContent}`); cart = []; ctBadge.textContent = ''; openCart(false);
    toggleDrawer(DRW0); await sleep(380); o.push(`restored drawer=${DRW0 ? 'open' : 'closed'} family=${act.name} hero="${tHero.ed.textContent}" w=${tHero.st.w} cart=${cart.length}`);
    return o.join('; ');
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['modular-typescale-studio'])(root, T); }

