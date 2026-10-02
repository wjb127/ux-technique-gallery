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

export function mount(root, variant, opts, T) { (V[variant] || V['modular-typescale-studio'])(root, T); }
