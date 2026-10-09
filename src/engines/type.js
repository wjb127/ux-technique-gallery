import '@fontsource-variable/roboto-flex/full.css';
import '@fontsource-variable/fraunces/full.css';
import { h, s, css, drag, localPos, clamp, copy, toast, sleep, rng, pick, gesture, fire } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle, codebox } from '../kit.js';
const RF = "'Roboto Flex Variable', sans-serif", FR = "'Fraunces Variable', Georgia, serif";
const AX = { wght: [100, 1000, 400], wdth: [25, 151, 100], opsz: [8, 144, 14], GRAD: [-200, 150, 0], slnt: [-10, 0, 0], XTRA: [323, 603, 468], YOPQ: [25, 135, 79] };
const fvs = (a) => Object.entries(a).map(([k, v]) => `"${k}" ${Math.round(v)}`).join(', ');
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

export function mount(root, variant, opts, T) { (V[variant] || V['modular-typescale-studio'])(root, T); }

