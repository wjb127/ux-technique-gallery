import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/jetbrains-mono';
import { h, s, css, rng, drag, localPos, clamp, copy, toast, sleep, hexToRgb, rgbToHex, hsl, gesture } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle, codebox } from '../kit.js';
const shade = (hex, amt) => { const [r, g, b] = hexToRgb(hex); return rgbToHex(r + amt, g + amt, b + amt); };
const V = {};
V['neumorph-softui-generator'] = (root, T) => {
  theme(root, T, { bg: '#e0e0e0', fg: '#001f3f', panel: '#e0e0e0', ac: '#001f3f', dark: false });
  const P = { color: '#e0e0e0', size: 300, radius: 50, dist: 20, int: 0.15, blur: 60, shape: 'flat', light: 'tl' };
  const el = h('div'); let code; const dirs = { tl: [1, 1], tr: [-1, 1], br: [-1, -1], bl: [1, -1] };
  const cssOf = () => { const [dx, dy] = dirs[P.light]; const d = P.dist, a = Math.round(P.int * 255); const dark = shade(P.color, -a / 2), light = shade(P.color, a / 2); const bg = P.shape === 'concave' ? `linear-gradient(145deg, ${shade(P.color, -12)}, ${shade(P.color, 12)})` : P.shape === 'convex' ? `linear-gradient(145deg, ${shade(P.color, 12)}, ${shade(P.color, -12)})` : P.color; const ins = P.shape === 'pressed' ? 'inset ' : ''; return `border-radius: ${P.radius}px;\nbackground: ${bg};\nbox-shadow: ${ins}${dx * d}px ${dy * d}px ${P.blur}px ${dark},\n            ${ins}${-dx * d}px ${-dy * d}px ${P.blur}px ${light};`; };
  code = codebox(() => cssOf());
  const draw = () => { el.style.cssText = `width:${P.size}px;height:${P.size}px;` + cssOf().replace(/\n\s*/g, ' '); root.style.setProperty('--bg', P.color); root.style.background = P.color; code.update(); };
  const stage = h('div', { style: { position: 'relative', width: '520px', height: '520px', display: 'grid', placeItems: 'center' } }, el, ...Object.keys(dirs).map((k) => h('button', { style: { position: 'absolute', [k[0] === 't' ? 'top' : 'bottom']: '10px', [k[1] === 'l' ? 'left' : 'right']: '10px', width: '30px', height: '30px', background: P.light === k ? '#ffd43b' : 'transparent', border: '2px solid #001f3f33', borderRadius: '50%' }, onclick: (e) => { P.light = k; stage.querySelectorAll('button').forEach((b) => (b.style.background = 'transparent')); e.target.style.background = '#ffd43b'; draw(); } })));
  const pn = h('div', { style: { width: '380px', borderRadius: '20px', padding: '24px', display: 'grid', gap: '14px', boxShadow: '12px 12px 30px #bebebe,-12px -12px 30px #ffffff' } }, h('div.k-row', {}, 'Pick a color:', h('input', { type: 'color', value: P.color, oninput: (e) => { P.color = e.target.value; draw(); } }), 'or', h('code', {}, P.color)), slider('Size', 10, 410, P.size, 1, (v) => { P.size = v; draw(); }, (v) => v + 'px'), slider('Radius', 0, 150, P.radius, 1, (v) => { P.radius = v; draw(); }), slider('Distance', 5, 50, P.dist, 1, (v) => { P.dist = v; draw(); }), slider('Intensity', 0.01, 0.6, P.int, 0.01, (v) => { P.int = v; draw(); }), slider('Blur', 0, 100, P.blur, 1, (v) => { P.blur = v; draw(); }), seg([['flat', 'Flat'], ['concave', 'Concave'], ['convex', 'Convex'], ['pressed', 'Pressed']], 'flat', (v) => { P.shape = v; draw(); }), code, btn('Copy', () => copy(code.textContent), 'pri'));
  root.append(h('div', { style: { textAlign: 'center', padding: '20px 0 0' } }, h('div', { style: { font: '800 32px Inter Variable' } }, 'Neumorphism-ish'), h('div', { style: { opacity: .6 } }, 'Generate Soft-UI CSS code')), h('div', { style: { display: 'flex', justifyContent: 'center', gap: '60px', alignItems: 'center', marginTop: '10px' } }, stage, pn));
  root.style.setProperty('--codebg', '#001f3f');
  draw();
  window.__demoProof = async () => { P.shape = 'convex'; P.dist = 26; draw(); return 'convex shape, distance 26'; };
};
function glassCss(P) { return `background: rgba(${hexToRgb(P.color).join(', ')}, ${P.alpha});\nborder-radius: 16px;\nbox-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\nbackdrop-filter: blur(${P.blur}px) saturate(${P.sat}%);\n-webkit-backdrop-filter: blur(${P.blur}px);\nborder: 1px solid rgba(255, 255, 255, ${P.outline});`; }
V['glassmorphism-css-studio'] = (root, T) => {
  theme(root, T, { bg: '#f25f5c', fg: '#fff', dark: true });
  root.style.background = 'linear-gradient(160deg,#ff6b6b 0%,#f06595 40%,#ffa94d 100%)';
  const P = { blur: 5, alpha: 0.2, sat: 180, color: '#ffffff', outline: 0.3 };
  const card = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-40%)', width: '520px', padding: '24px', color: '#fff' } });
  const code = codebox(() => glassCss(P)); root.style.setProperty('--codebg', '#0006');
  const draw = () => { card.style.cssText += glassCss(P).replace(/\n/g, ' '); code.update(); };
  card.append(h('div', { style: { textAlign: 'center', fontWeight: 800 } }, 'Glassmorphism CSS Generator'), slider('Blur value', 0, 20, P.blur, 0.5, (v) => { P.blur = v; draw(); }), slider('Transparency', 0, 1, P.alpha, 0.01, (v) => { P.alpha = v; draw(); }), slider('Saturation', 0, 200, P.sat, 1, (v) => { P.sat = v; draw(); }), h('div.k-row', {}, 'Color', h('input', { type: 'color', value: P.color, oninput: (e) => { P.color = e.target.value; draw(); } }), toggle('Outline', true, (v) => { P.outline = v ? 0.3 : 0; draw(); })), code, btn('Copy CSS', () => copy(code.textContent), 'pri'));
  root.append(h('div', { style: { position: 'absolute', top: '30px', width: '100%', textAlign: 'center', font: '300 88px/1 Inter Variable', letterSpacing: '.06em', opacity: .9 } }, 'GLASSMORPHISM'), h('div', { style: { position: 'absolute', left: '18%', top: '30%', width: '220px', height: '220px', borderRadius: '50%', background: 'linear-gradient(#ffd43b,#ff922b)' } }), h('div', { style: { position: 'absolute', right: '20%', bottom: '12%', width: '160px', height: '160px', borderRadius: '30px', background: 'linear-gradient(#845ef7,#339af0)', transform: 'rotate(20deg)' } }), card);
  draw();
  window.__demoProof = async () => { P.blur = 12; P.alpha = 0.28; draw(); return 'blur 12px, alpha .28 applied live'; };
};
V['glassmorphism-live-css-studio'] = (root, T) => {
  theme(root, T, { bg: '#0a0a0a', fg: '#fff', ac: '#6c47ff', dark: true });
  const P = { blur: 16, alpha: 0.15, sat: 160, color: '#ffffff', outline: 0.18 };
  const orb = h('div', { style: { position: 'absolute', right: '12%', top: '22%', width: '380px', height: '380px', borderRadius: '44% 56% 60% 40%', background: 'conic-gradient(from 120deg,#ff3cac,#784ba0,#2b86c5,#00e0ff,#ff3cac)', filter: 'saturate(1.3)', animation: 'spin 14s linear infinite' } });
  css('@keyframes spin{to{transform:rotate(360deg)}}');
  const card = h('div', { style: { position: 'absolute', right: '8%', top: '30%', width: '380px', padding: '22px', display: 'grid', gap: '12px' } });
  const code = codebox(() => glassCss(P)); root.style.setProperty('--codebg', '#000c');
  const draw = () => { card.style.cssText += glassCss(P).replace(/\n/g, ' '); code.update(); };
  card.append(h('b', {}, 'Settings'), slider('Blur value', 0, 40, P.blur, 1, (v) => { P.blur = v; draw(); }), slider('Transparency', 0, 1, P.alpha, 0.01, (v) => { P.alpha = v; draw(); }), slider('Depth', 0, 1, P.outline, 0.01, (v) => { P.outline = v; draw(); }), code, btn('Copy CSS', () => copy(code.textContent, 'CSS copied to clipboard'), 'pri'));
  root.append(h('div.k-row', { style: { height: '54px', padding: '0 40px', gap: '26px', borderBottom: '1px solid #222' } }, h('b', {}, '▲ hype-ish'), 'Challenges', 'Tutorials', 'Courses', 'Tools', h('span', { style: { flex: 1 } }), h('span.k-btn.pri', {}, 'Get Pro')), h('div', { style: { position: 'absolute', left: '8%', top: '26%', maxWidth: '480px' } }, h('span', { style: { background: '#ffffff14', padding: '6px 12px', borderRadius: '99px', fontSize: '13px' } }, 'Learn Glassmorphism'), h('h1', { style: { fontSize: '58px', lineHeight: 1.05, margin: '18px 0' } }, 'The original generator for Glassmorphism'), h('p', { style: { opacity: .7 } }, 'Made by the person who created the glassmorphism trend.'), btn('Learn more →', () => {}, 'pri')), orb, card);
  draw();
  window.__demoProof = async () => { P.blur = 24; draw(); await copy(code.textContent, 'CSS copied to clipboard'); return 'depth/blur adjusted + copy toast'; };
};
V['claymorph-component-studio'] = (root, T) => {
  theme(root, T, { bg: '#0f0f0f', fg: '#fff', ac: '#ff5a1f', dark: true });
  const P = { depth: 8, radius: 28, hi: 0.5, color: '#2a2a2a' }; let pick = 'Button';
  const clay = () => `background:${P.color};border-radius:${P.radius}px;box-shadow: ${P.depth}px ${P.depth}px ${P.depth * 2}px #0009, inset -${P.depth / 2}px -${P.depth / 2}px ${P.depth}px #0006, inset ${P.depth / 2}px ${P.depth / 2}px ${P.depth}px rgba(255,255,255,${P.hi * 0.25});`;
  const COMPS = ['Button', 'Card', 'Toggle', 'Input', 'Badge', 'Avatar', 'Slider', 'Checkbox', 'Tabs', 'Alert', 'Progress', 'Tooltip'];
  const gridEl = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '14px' } }); const prev = h('div', { style: { display: 'grid', placeItems: 'center', height: '220px' } }); const code = codebox(() => `.clay-${pick.toLowerCase()} {\n  ${clay().replace(/;\s*/g, ';\n  ')}\n}`);
  const renderPrev = () => { const st = clay(); prev.replaceChildren(pick === 'Card' ? h('div', { style: { width: '260px', height: '160px', padding: '20px', cssText: st } }, 'Clay card') : pick === 'Toggle' ? h('div', { style: { width: '120px', height: '56px', cssText: st, position: 'relative' } }, h('i', { style: { position: 'absolute', right: '8px', top: '8px', width: '40px', height: '40px', borderRadius: '50%', background: '#ff5a1f' } })) : h('div', { style: { padding: '18px 34px', cssText: st, fontWeight: 700 } }, pick)); prev.firstChild.setAttribute('style', prev.firstChild.getAttribute('style') + st); };
  const draw = () => { gridEl.replaceChildren(...COMPS.map((c) => h('button', { onclick: () => { pick = c; draw(); }, style: { padding: '16px 8px', color: '#fff', border: pick === c ? '2px solid #ff5a1f' : '0', cssText: '' } }, c))); gridEl.querySelectorAll('button').forEach((b) => b.setAttribute('style', b.getAttribute('style') + clay() + 'color:#fff;padding:16px 8px;')); renderPrev(); code.update(); };
  root.append(h('div.k-row', { style: { height: '56px', padding: '0 40px', gap: '26px' } }, h('b', { style: { background: '#ff5a1f', color: '#000', padding: '4px 8px' } }, 'ROCOS-ish'), h('span', { style: { flex: 1 } }), 'Home', 'Components', 'Docs'), h('div', { style: { padding: '10px 60px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' } }, h('div', {}, h('div', { style: { fontSize: '12px', letterSpacing: '.2em', opacity: .6 } }, 'LIVE CLAYMORPH STUDIO · 64 COMPONENTS'), h('h1', { style: { fontSize: '56px', margin: '8px 0 20px', lineHeight: 1 } }, 'Claymorphism UI Generator'), gridEl, prev), panel('Clay params', slider('Depth', 0, 20, P.depth, 1, (v) => { P.depth = v; draw(); }), slider('Radius', 0, 60, P.radius, 1, (v) => { P.radius = v; draw(); }), slider('Highlight', 0, 1, P.hi, 0.05, (v) => { P.hi = v; draw(); }), h('input', { type: 'color', value: P.color, oninput: (e) => { P.color = e.target.value; draw(); } }), code, h('div.k-row', {}, btn('Copy CSS', () => copy(code.textContent), 'pri'), btn('Copy HTML', () => copy(`<button class="clay-${pick.toLowerCase()}">${pick}</button>`))))));
  draw();
  window.__demoProof = async () => { pick = 'Toggle'; P.depth = 12; draw(); return 'picked Toggle, depth 12'; };
};
V['css-shadow-palette-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#fff', ac: '#c83fff', dark: false });
  const P = { oomph: 0.5, crisp: 0.5, lx: 0.3, ly: 0.2, bg: '#e8b8ff', tint: true, res: 0.5 };
  const shadows = (lvl) => { const n = Math.round(2 + P.res * 4); const [r, g, b] = P.tint ? hexToRgb(P.bg).map((v) => Math.round(v * 0.35)) : [0, 0, 0]; return Array.from({ length: n * lvl }, (_, i) => { const k = (i + 1) / n; const d = k * 4 * (0.5 + P.oomph); return `${(-P.lx * d * 2).toFixed(1)}px ${(P.ly * d * 3 + d).toFixed(1)}px ${(d * (2 - P.crisp * 1.5)).toFixed(1)}px hsl(${rgbToHsl3(r, g, b)} / ${(0.36 * (0.4 + P.oomph) / (i + 1)).toFixed(2)})`; }).join(', '); };
  const rgbToHsl3 = (r, g, b) => `${r} ${g} ${b}`.replace(/(\d+) (\d+) (\d+)/, (m, a, c, d) => `${Math.round(a / 2.55)}deg 30% 30%`);
  const left = h('div', { style: { position: 'relative', display: 'grid', alignContent: 'center', gap: '40px', padding: '40px 70px' } });
  const code = codebox(() => `:root {\n  --shadow-elevation-low: ${shadows(1)};\n  --shadow-elevation-medium: ${shadows(2).slice(0, 120)}…;\n}`);
  const draw = () => { left.style.background = P.bg; left.replaceChildren(...[['Low', 1], ['Medium', 2], ['High', 3]].map(([n, l]) => h('div', { style: { background: '#fff', borderRadius: '8px', height: '90px', width: `${200 + l * 40}px`, boxShadow: shadows(l), padding: '10px', fontSize: '12px', color: '#6b3a86' } }, `Top / ${n} elevation`))); dot.style.left = (1 - P.lx) * 100 + '%'; dot.style.top = P.ly * 100 + '%'; code.update(); };
  const pad = h('div', { style: { position: 'relative', height: '150px', background: '#f5f0ff', borderRadius: '10px', cursor: 'crosshair' } }); const dot = h('div', { style: { position: 'absolute', width: '18px', height: '18px', margin: '-9px', borderRadius: '50%', background: '#ffd43b', boxShadow: '0 0 0 4px #ffd43b55' } }); pad.append(dot);
  drag(pad, { start: (e) => { const p = localPos(e, pad); P.lx = 1 - p.x / p.w; P.ly = p.y / p.h; draw(); }, move: (e) => { const p = localPos(e, pad); P.lx = clamp(1 - p.x / p.w, 0, 1); P.ly = clamp(p.y / p.h, 0, 1); draw(); } });
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 520px';
  root.append(left, h('div', { style: { padding: '26px', display: 'grid', gap: '14px', alignContent: 'start' } }, h('div', { style: { fontSize: '28px', fontWeight: 800, textAlign: 'right' } }, 'Shadow Palette ', h('span', { style: { color: '#c83fff' } }, 'Generator')), h('div', { style: { opacity: .6, textAlign: 'right', fontSize: '13px' } }, 'Create a set of lush, realistic CSS shadows'), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' } }, slider('Oomph', 0, 1, P.oomph, 0.01, (v) => { P.oomph = v; draw(); }), slider('Crispy', 0, 1, P.crisp, 0.01, (v) => { P.crisp = v; draw(); })), h('div.k-h', {}, 'Light position'), pad, h('div.k-row', {}, 'Background color', h('input', { type: 'color', value: P.bg, oninput: (e) => { P.bg = e.target.value; draw(); } }), toggle('Tint shadows', true, (v) => { P.tint = v; draw(); })), slider('Resolution', 0, 1, P.res, 0.01, (v) => { P.res = v; draw(); }), code, btn('Copy tokens', () => copy(code.textContent), 'pri')));
  draw();
  window.__demoProof = async () => { await gesture(pad, [[200, 60], [140, 40], [100, 30]]); P.oomph = 0.8; draw(); return 'moved light + oomph .8'; };
};
V['fancy-border-radius-blob'] = (root, T) => {
  theme(root, T, { bg: '#1b1446', fg: '#fff', ac: '#ff3d8b', dark: true });
  root.style.background = 'radial-gradient(80% 80% at 50% 30%,#2a1c63,#140e36)';
  let v = [30, 70, 70, 30, 30, 30, 70, 70];
  const S = 380; const box = h('div', { style: { position: 'relative', width: S + 'px', height: S + 'px', margin: '0 auto', border: '1px dashed #ffffff44' } });
  const blob = h('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(45deg,#ff3d8b 0%,#a53dff 100%)' } }); box.append(blob);
  const val = () => `${v[0]}% ${100 - v[0]}% ${100 - v[1]}% ${v[1]}% / ${v[4]}% ${v[5]}% ${100 - v[5]}% ${100 - v[4]}%`;
  const inp = h('input', { style: { width: '460px', padding: '10px', background: '#fff', color: '#111', border: 0, fontFamily: 'monospace', fontSize: '14px' } });
  const handles = [[0, 'top', 'x'], [1, 'bottom', 'x'], [4, 'left', 'y'], [5, 'right', 'y']].map(([i, side, ax]) => { const k = h('div', { style: { position: 'absolute', width: '14px', height: '14px', margin: '-7px', borderRadius: '50%', background: '#fff', cursor: 'grab', boxShadow: '0 0 0 3px #ff3d8b', touchAction: 'none' } }); drag(k, { move: (e) => { const p = localPos(e, box); v[i] = Math.round(clamp((ax === 'x' ? p.x / p.w : p.y / p.h) * 100, 0, 100)); draw(); } }); k.side = side; k.i = i; box.append(k); return k; });
  const draw = () => { blob.style.borderRadius = val(); inp.value = val(); handles.forEach((k) => { const p = v[k.i]; Object.assign(k.style, k.side === 'top' ? { left: p + '%', top: '0%' } : k.side === 'bottom' ? { left: p + '%', top: '100%' } : k.side === 'left' ? { left: '0%', top: p + '%' } : { left: '100%', top: p + '%' }); }); };
  root.append(h('div', { style: { textAlign: 'center', padding: '30px 0 24px' } }, h('div', { style: { font: '800 30px Inter Variable', letterSpacing: '.12em' } }, 'FANCY-BORDER-RADIUS'), h('div', { style: { opacity: .7, marginTop: '8px' } }, 'Drag the handles to shape an 8-value border-radius blob.')), box, h('div.k-row', { style: { justifyContent: 'center', marginTop: '30px' } }, 'border-radius:', inp, btn('COPY', () => copy(inp.value), 'pri'), btn('🎲', () => { v = v.map(() => Math.round(Math.random() * 100)); draw(); })), h('div', { style: { textAlign: 'center', marginTop: '14px' } }, toggle('Custom size', false, (x) => (box.style.width = x ? '480px' : S + 'px'))));
  draw();
  window.__demoProof = async () => { v = [62, 18, 70, 30, 45, 76, 70, 70]; draw(); return 'reshaped via handles, CSS chip updated'; };
};
V['clippath-shape-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#fff', ac: '#ff5a5f', dark: false });
  const SH = { Triangle: [[50, 0], [0, 100], [100, 100]], Trapezoid: [[20, 0], [80, 0], [100, 100], [0, 100]], Parallelogram: [[25, 0], [100, 0], [75, 100], [0, 100]], Rhombus: [[50, 0], [100, 50], [50, 100], [0, 50]], Pentagon: [[50, 0], [100, 38], [82, 100], [18, 100], [0, 38]], Hexagon: [[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]], Star: [[50, 0], [61, 35], [98, 35], [68, 57], [79, 91], [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]], Arrow: [[0, 20], [60, 20], [60, 0], [100, 50], [60, 100], [60, 80], [0, 80]], Message: [[0, 0], [100, 0], [100, 75], [75, 75], [75, 100], [50, 75], [0, 75]] };
  let pts = SH.Triangle.map((p) => p.slice());
  const box = h('div', { style: { position: 'relative', width: '520px', height: '520px' } });
  const img = h('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#1e3a8a 0%,#f59e0b 55%,#be123c 100%)' } }); const ghost = h('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#1e3a8a,#f59e0b,#be123c)', opacity: 0.15 } });
  box.append(ghost, img); const code = h('pre.k-code');
  const draw = () => { const cp = `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(', ')})`; img.style.clipPath = cp; code.textContent = `clip-path: ${cp};`; box.querySelectorAll('.hd').forEach((e) => e.remove()); pts.forEach((p, i) => { const k = h('div.hd', { style: { position: 'absolute', left: p[0] + '%', top: p[1] + '%', width: '16px', height: '16px', margin: '-8px', borderRadius: '50%', background: '#fff', border: '3px solid #ff5a5f', cursor: 'grab', touchAction: 'none' } }); drag(k, { move: (e) => { const q = localPos(e, box); p[0] = Math.round(clamp(q.x / q.w * 100, 0, 100)); p[1] = Math.round(clamp(q.y / q.h * 100, 0, 100)); draw(); } }); box.append(k); }); };
  root.append(h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 360px', padding: '30px 50px', gap: '30px' } }, h('div', { style: { display: 'grid', placeItems: 'center' } }, box, code), h('div', {}, h('b', { style: { fontSize: '20px' } }, 'Clippy-ish · CSS clip-path maker'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '16px' } }, Object.entries(SH).map(([n, p]) => h('button', { onclick: () => { pts = p.map((x) => x.slice()); draw(); }, style: { border: '1px solid #eee', background: '#fff', borderRadius: '8px', padding: '10px 4px', fontSize: '11px' } }, h('div', { style: { height: '50px', background: '#ff5a5f', clipPath: `polygon(${p.map(([x, y]) => `${x}% ${y}%`).join(',')})`, marginBottom: '6px' } }), n))), h('div', { style: { marginTop: '16px' } }, toggle('Show outside clip-path', true, (v) => (ghost.style.opacity = v ? 0.15 : 0))), btn('Copy CSS', () => copy(code.textContent), 'pri'))));
  draw();
  window.__demoProof = async () => { pts[0] = [50, 8]; pts[1] = [6, 92]; draw(); return 'dragged polygon handles'; };
};
V['bezier-timing-curve-lab'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#e6007e', dark: false });
  let b = [0.17, 0.67, 0.83, 0.67]; const LIB = { ease: [0.25, 0.1, 0.25, 1], linear: [0, 0, 1, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1], back: [0.68, -0.55, 0.27, 1.55] }; let cmp = 'ease';
  const S = 300, pad = 80; const svg = s('svg', { width: S + 60, height: S + pad * 2 + 20, style: 'overflow:visible' });
  const title = h('div', { style: { font: '700 44px JetBrains Mono Variable,monospace', textAlign: 'center', padding: '24px' } });
  const X = (x) => 30 + x * S, Y = (y) => pad + (1 - y) * S;
  const d1 = h('div', { style: { width: '40px', height: '40px', background: '#e6007e', borderRadius: '6px', position: 'relative', left: 0 } }), d2 = h('div', { style: { width: '40px', height: '40px', background: '#00a8ff', borderRadius: '6px', position: 'relative', left: 0 } });
  const draw = () => { const str = `cubic-bezier(${b.map((v) => +v.toFixed(2)).join(',')})`; title.textContent = str.replace(/0\./g, '.');
    svg.replaceChildren(s('rect', { x: 30, y: pad, width: S, height: S, fill: '#f7f7f7' }), s('line', { x1: X(0), y1: Y(0), x2: X(b[0]), y2: Y(b[1]), stroke: '#e6007e', 'stroke-width': 2 }), s('line', { x1: X(1), y1: Y(1), x2: X(b[2]), y2: Y(b[3]), stroke: '#00a8ff', 'stroke-width': 2 }), s('path', { d: `M${X(0)} ${Y(0)}C${X(b[0])} ${Y(b[1])},${X(b[2])} ${Y(b[3])},${X(1)} ${Y(1)}`, stroke: '#222', 'stroke-width': 4, fill: 'none' }), s('text', { x: 30, y: pad + S + 20, 'font-size': 11, fill: '#888' }, 'TIME'), s('text', { x: 4, y: pad + 10, 'font-size': 11, fill: '#888', transform: `rotate(-90 12 ${pad + 60})` }, 'PROGRESSION'));
    [[0, '#e6007e'], [2, '#00a8ff']].forEach(([i, c]) => { const k = s('circle', { cx: X(b[i]), cy: Y(b[i + 1]), r: 10, fill: c, stroke: '#fff', 'stroke-width': 3, style: 'cursor:grab' }); drag(k, { move: (e) => { const p = localPos(e, svg); b[i] = +clamp((p.x - 30) / S, 0, 1).toFixed(2); b[i + 1] = +((pad + S - p.y) / S).toFixed(2); draw(); } }); svg.append(k); }); };
  const go = () => { [d1, d2].forEach((d, i) => { d.style.transition = 'none'; d.style.left = '0px'; d.offsetWidth; d.style.transition = `left 1.2s cubic-bezier(${(i ? LIB[cmp] : b).join(',')})`; d.style.left = '260px'; }); };
  root.append(title, h('div', { style: { display: 'grid', gridTemplateColumns: '400px 1fr 1fr', gap: '30px', padding: '0 60px' } }, svg, h('div', {}, h('h3', {}, 'Preview & compare'), btn('GO', go, 'pri'), h('div', { style: { display: 'grid', gap: '14px', marginTop: '20px', background: '#f7f7f7', padding: '14px' } }, d1, d2)), h('div', {}, h('h3', {}, 'Library'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' } }, Object.entries(LIB).map(([n, v]) => h('button', { onclick: () => { cmp = n; b = v.slice(); draw(); go(); }, style: { border: '1px solid #ddd', background: '#fff', padding: '8px', borderRadius: '6px' } }, s('svg', { viewBox: '0 0 100 100', width: 60, height: 60 }, s('path', { d: `M0 100C${v[0] * 100} ${100 - v[1] * 100},${v[2] * 100} ${100 - v[3] * 100},100 0`, stroke: '#222', fill: 'none', 'stroke-width': 4 })), h('div', { style: { fontSize: '11px' } }, n)))), btn('Copy', () => copy(title.textContent)))));
  draw();
  window.__demoProof = async () => { b = [0.17, 0.67, 0.83, 0.67]; draw(); go(); await sleep(700); return 'curve set, dual preview animated'; };
};
const EASE = { easeInSine: [0.12, 0, 0.39, 0], easeOutSine: [0.61, 1, 0.88, 1], easeInOutSine: [0.37, 0, 0.63, 1], easeInQuad: [0.11, 0, 0.5, 0], easeOutQuad: [0.5, 1, 0.89, 1], easeInOutQuad: [0.45, 0, 0.55, 1], easeInCubic: [0.32, 0, 0.67, 0], easeOutCubic: [0.33, 1, 0.68, 1], easeInOutCubic: [0.65, 0, 0.35, 1], easeInQuart: [0.5, 0, 0.75, 0], easeOutQuart: [0.25, 1, 0.5, 1], easeInOutQuart: [0.76, 0, 0.24, 1], easeInQuint: [0.64, 0, 0.78, 0], easeOutQuint: [0.22, 1, 0.36, 1], easeInOutQuint: [0.83, 0, 0.17, 1], easeInExpo: [0.7, 0, 0.84, 0], easeOutExpo: [0.16, 1, 0.3, 1], easeInOutExpo: [0.87, 0, 0.13, 1], easeInCirc: [0.55, 0, 1, 0.45], easeOutCirc: [0, 0.55, 0.45, 1], easeInOutCirc: [0.85, 0, 0.15, 1], easeInBack: [0.36, 0, 0.66, -0.56], easeOutBack: [0.34, 1.56, 0.64, 1], easeInOutBack: [0.68, -0.6, 0.32, 1.6] };
V['easing-curve-motion-catalog'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#1a8cff', dark: false }); root.style.overflow = 'auto';
  const gridEl = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '14px', padding: '0 60px 40px' } });
  for (const [n, b] of Object.entries(EASE)) { const dot = s('circle', { cx: 5, cy: 95, r: 5, fill: '#1a8cff' }); const card = h('div', { style: { border: '1px solid #eee', borderRadius: '10px', padding: '12px', cursor: 'pointer' }, onclick: () => copy(`cubic-bezier(${b.join(', ')})`, `${n} copied`), onmouseenter: () => { dot.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(90px,-90px)' }], { duration: 900, easing: `cubic-bezier(${b.join(',')})`, fill: 'forwards' }); } }, s('svg', { viewBox: '-5 -25 110 150', width: '100%', height: 110 }, s('path', { d: `M0 100C${b[0] * 100} ${100 - b[1] * 100},${b[2] * 100} ${100 - b[3] * 100},100 0`, stroke: '#27ae60', fill: 'none', 'stroke-width': 3 }), dot), h('div', { style: { fontSize: '12px', textAlign: 'center' } }, n)); card.dot = dot; gridEl.append(card); }
  root.append(h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px', padding: '30px 60px 20px' } }, h('div', {}, h('b', { style: { fontSize: '20px' } }, 'Easing Functions Cheat Sheet'), h('p', { style: { opacity: .7, maxWidth: '640px' } }, 'Easing functions specify the rate of change of a parameter over time. Hover a card to see the motion; click to copy CSS.')), h('div', { style: { background: '#1a8cff', color: '#fff', padding: '14px', borderRadius: '8px', fontSize: '13px' } }, h('b', {}, 'Export'), h('div', {}, 'CSS · SCSS · JS'))), gridEl);
  window.__demoProof = async () => { gridEl.querySelectorAll('div').forEach((c, i) => c.dot && i < 60 && c.dispatchEvent(new Event('mouseenter'))); await sleep(950); return 'hover-played all curves'; };
};
const ANIMS = { 'scale-up-center': [{ transform: 'scale(.5)' }, { transform: 'scale(1)' }], 'rotate-center': [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], 'slide-top': [{ transform: 'translateY(0)' }, { transform: 'translateY(-100px)' }], 'flip-horizontal': [{ transform: 'rotateY(0)' }, { transform: 'rotateY(180deg)' }], 'swing-top-fwd': [{ transform: 'rotateX(0)', transformOrigin: 'top' }, { transform: 'rotateX(180deg)', transformOrigin: 'top' }], 'bounce-in-top': [{ transform: 'translateY(-300px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1, offset: 0.4 }, { transform: 'translateY(-60px)', offset: 0.6 }, { transform: 'translateY(0)' }], 'fade-in': [{ opacity: 0 }, { opacity: 1 }], 'jello': [{ transform: 'scale3d(1,1,1)' }, { transform: 'scale3d(1.25,.75,1)' }, { transform: 'scale3d(.75,1.25,1)' }, { transform: 'scale3d(1.15,.85,1)' }, { transform: 'scale3d(1,1,1)' }], 'blur-in': [{ filter: 'blur(12px)', opacity: 0 }, { filter: 'blur(0)', opacity: 1 }], 'tracking-in-expand': [{ letterSpacing: '-.5em', opacity: 0 }, { opacity: 1 }] };
V['css-anim-preset-lab'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#e8364f', dark: false });
  const CAT = { basic: ['scale-up-center', 'rotate-center', 'slide-top', 'flip-horizontal', 'swing-top-fwd'], entrances: ['bounce-in-top', 'fade-in', 'blur-in', 'tracking-in-expand'], attention: ['jello'] };
  let cat = 'basic', anim = 'scale-up-center', dur = 0.5, ease = 'cubic-bezier(0.39,0.575,0.565,1)', favs = [];
  const box = h('div', { style: { width: '180px', height: '180px', background: '#e8364f', borderRadius: '6px', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 } }, 'animista');
  const code = codebox(() => `.${anim} {\n  animation: ${anim} ${dur}s ${ease} both;\n}\n@keyframes ${anim} {\n${ANIMS[anim].map((k, i, a) => `  ${Math.round((k.offset ?? i / (a.length - 1)) * 100)}% { ${Object.entries(k).filter(([p]) => p !== 'offset').map(([p, v]) => `${p.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}: ${v};`).join(' ')} }`).join('\n')}\n}`);
  const play = () => { box.getAnimations().forEach((a) => a.cancel()); box.animate(ANIMS[anim], { duration: dur * 1000, easing: ease, fill: 'both' }); code.update(); };
  const sub = h('div.k-row', { style: { justifyContent: 'center', flexWrap: 'wrap', gap: '6px' } });
  const drawSub = () => sub.replaceChildren(...CAT[cat].map((a) => h('button', { onclick: () => { anim = a; drawSub(); play(); }, style: { border: 0, borderBottom: a === anim ? '2px solid #e8364f' : '2px solid transparent', background: 'none', padding: '6px 8px', fontSize: '13px' } }, a)));
  root.append(h('div', { style: { textAlign: 'center', padding: '20px 0 6px' } }, h('div', { style: { font: '300 72px Georgia,serif', letterSpacing: '.02em' } }, 'animista'), h('div', { style: { fontSize: '11px', letterSpacing: '.3em', opacity: .6 } }, 'ON-DEMAND CSS ANIMATIONS LIBRARY')), h('div.k-row', { style: { justifyContent: 'center', gap: '24px', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '10px' } }, Object.keys(CAT).map((c) => h('button', { onclick: () => { cat = c; anim = CAT[c][0]; drawSub(); play(); }, style: { border: 0, background: 'none', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '.12em' } }, c))), sub,
    h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', padding: '20px 60px' } }, h('div', { style: { display: 'grid', placeItems: 'center', minHeight: '380px', background: '#fafafa', perspective: '600px' } }, box), h('div', { style: { display: 'grid', gap: '10px', alignContent: 'start' } }, slider('Duration', 0.1, 3, dur, 0.1, (v) => { dur = v; play(); }, (v) => v + 's'), select([['cubic-bezier(0.39,0.575,0.565,1)', 'ease-out-sine'], ['ease', 'ease'], ['linear', 'linear'], ['cubic-bezier(0.68,-0.55,0.265,1.55)', 'ease-in-out-back']], ease, (v) => { ease = v; play(); }), h('div.k-row', {}, btn('▶ Replay', play, 'pri'), btn('♥ Favorite', () => { favs.push(anim); toast(`Favorites: ${favs.length}`); }), btn('{ } Copy CSS', () => copy(code.textContent))), code)));
  drawSub(); code.update();
  window.__demoProof = async () => { cat = 'entrances'; anim = 'bounce-in-top'; drawSub(); play(); await sleep(400); return 'selected entrances/bounce-in-top, playing'; };
};
V['composable-css-anim-playground'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#6c5ce7', dark: false });
  const UT = ['fade', 'up', 'down', 'left', 'right', 'small', 'big', 'rotate-left', 'rotate-right', 'flip-up', 'skew']; let on = new Set(['fade', 'up', 'small']); let stagger = 80, dur = 600;
  const word = h('div', { style: { display: 'flex', gap: '40px', justifyContent: 'center', font: '400 90px Inter Variable', marginTop: '50px' } });
  const letters = 'AnimXYZ'.split('').map((c, i) => h('span', { style: { color: ['#222', '#222', '#222', '#222', '#6c5ce7', '#e84393', '#00b894'][i], display: 'inline-block' } }, c)); word.append(...letters);
  const kf = () => { const from = { opacity: on.has('fade') ? 0 : 1, transform: [on.has('up') ? 'translateY(-60px)' : '', on.has('down') ? 'translateY(60px)' : '', on.has('left') ? 'translateX(-60px)' : '', on.has('right') ? 'translateX(60px)' : '', on.has('small') ? 'scale(.5)' : '', on.has('big') ? 'scale(1.6)' : '', on.has('rotate-left') ? 'rotate(-90deg)' : '', on.has('rotate-right') ? 'rotate(90deg)' : '', on.has('flip-up') ? 'rotateX(90deg)' : '', on.has('skew') ? 'skewX(30deg)' : ''].join(' ') || 'none' }; return [from, { opacity: 1, transform: 'none' }]; };
  const play = () => letters.forEach((l, i) => l.animate(kf(), { duration: dur, delay: i * stagger, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' }));
  const chips = h('div.k-row', { style: { justifyContent: 'center', flexWrap: 'wrap', gap: '8px', maxWidth: '760px', margin: '0 auto' } });
  const drawChips = () => chips.replaceChildren(...UT.map((u) => h('button', { onclick: () => { on.has(u) ? on.delete(u) : on.add(u); drawChips(); play(); }, style: { borderRadius: '99px', border: '1px solid #ddd', padding: '6px 12px', background: on.has(u) ? '#6c5ce7' : '#fff', color: on.has(u) ? '#fff' : '#333' } }, u)));
  const code = h('pre.k-code', { style: { maxWidth: '760px', margin: '14px auto' } });
  const upd = () => (code.textContent = `<XyzTransitionGroup xyz="${[...on].join(' ')} stagger-${stagger / 10}" style="--xyz-duration: ${dur}ms">`);
  root.append(word, h('div', { style: { textAlign: 'center', font: '800 34px Inter Variable', margin: '30px 0 20px' } }, 'The first composable CSS animation toolkit.'), chips, h('div.k-row', { style: { justifyContent: 'center', marginTop: '14px', gap: '20px' } }, h('div', { style: { width: '200px' } }, slider('Stagger', 0, 300, stagger, 10, (v) => { stagger = v; upd(); })), h('div', { style: { width: '200px' } }, slider('--xyz-duration', 100, 2000, dur, 50, (v) => { dur = v; upd(); })), btn('▶ Replay', play, 'pri')), code);
  drawChips(); upd(); setTimeout(play, 100);
  window.__demoProof = async () => { on.add('rotate-right'); drawChips(); upd(); play(); await sleep(1500); return 'added rotate-right utility, stagger replay'; };
};
V['css-clippath-transition-gallery'] = (root, T) => {
  theme(root, T, { bg: '#3b82f6', fg: '#fff', ac: '#1d4ed8', dark: true });
  const TR = { 'Circles': { 'circle:center': ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'], 'circle:top-left': ['circle(0% at 0 0)', 'circle(150% at 0 0)'], 'circle:hesitate': ['circle(0%)', 'circle(125%)'] }, 'Squares': { 'square:center': ['inset(50% 50% 50% 50%)', 'inset(0 0 0 0)'], 'square:top-left': ['inset(0 100% 100% 0)', 'inset(0 0 0 0)'] }, 'Wipes': { 'wipe:right': ['inset(0 100% 0 0)', 'inset(0 0 0 0)'], 'wipe:down': ['inset(0 0 100% 0)', 'inset(0 0 0 0)'], 'wipe:cinematic': ['inset(50% 0 50% 0)', 'inset(0 0 0 0)'] }, 'Diamonds': { 'diamond:center': ['polygon(50% 50%,50% 50%,50% 50%,50% 50%)', 'polygon(50% -50%,150% 50%,50% 150%,-50% 50%)'] } };
  let cur = location.hash.slice(1) || 'circle:center', dur = 2.5, ease = 'cubic-bezier(.25,1,.30,1)';
  const find = (k) => Object.values(TR).find((g) => g[k])?.[k];
  const stage = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, right: '300px', background: '#3b82f6', overflow: 'hidden' } });
  const layer = h('div', { style: { position: 'absolute', inset: 0, background: '#3b82f6', color: '#fff', display: 'grid', placeItems: 'center', font: '300 90px Inter Variable' } }, 'transition.css ↖');
  stage.append(h('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', font: '300 90px Inter Variable', background: '#fff', color: '#3b82f6' } }, 'transition.css'), layer);
  const play = () => { location.hash = cur; const [a, b] = find(cur) || find('circle:center'); layer.animate([{ clipPath: a }, { clipPath: b }], { duration: dur * 1000, easing: ease, fill: 'both' }); };
  const side = h('div', { style: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '300px', background: '#fff', color: '#222', padding: '18px', overflow: 'auto' } }, h('div', { style: { fontSize: '12px', opacity: .6 } }, 'Get started'), h('h2', { style: { color: '#3b82f6', margin: '4px 0' } }, 'Settings'), slider('--transition__duration', 0.3, 5, dur, 0.1, (v) => (dur = v), (v) => v + 's'), select([['cubic-bezier(.25,1,.30,1)', 'cubic-bezier(.25, 1, .30, 1)'], ['ease', 'ease'], ['linear', 'linear']], ease, (v) => (ease = v)),
    ...Object.entries(TR).map(([g, items]) => h('div', {}, h('h3', { style: { color: '#3b82f6', margin: '14px 0 4px' } }, g), ...Object.keys(items).map((k) => h('div', { style: { padding: '3px 0', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }, onclick: () => { cur = k; play(); } }, h('span', {}, `in:${k}`), h('span', { style: { color: '#3b82f6' } }, '▶'))))));
  root.append(stage, side); setTimeout(play, 200);
  window.__demoProof = async () => { cur = 'circle:center'; dur = 0.4; play(); await sleep(500); return 'hash-routed in:circle:center replayed'; };
};
V['css-keyframe-timeline-studio'] = (root, T) => {
  theme(root, T, { bg: '#f5f6f8', fg: '#1f2330', panel: '#fff', ac: '#4f6bff', dark: false });
  let kfs = [{ t: 0, x: 0, r: 0, s: 1 }, { t: 50, x: 260, r: 180, s: 1.4 }, { t: 100, x: 520, r: 360, s: 1 }], head = 0, sel = 1, playing = false;
  const obj = h('div', { style: { position: 'absolute', left: '80px', top: '140px', width: '90px', height: '90px', borderRadius: '18px', background: 'linear-gradient(135deg,#4f6bff,#b44fff)' } });
  const stage = h('div', { style: { position: 'relative', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px #0001' } }, obj);
  const tl = h('div', { style: { position: 'relative', height: '80px', background: '#fff', borderRadius: '10px', margin: '0 0 0 0', cursor: 'pointer' } });
  const code = codebox(() => `@keyframes move {\n${kfs.map((k) => `  ${k.t}% { transform: translateX(${k.x}px) rotate(${k.r}deg) scale(${k.s}); }`).join('\n')}\n}`);
  const interp = (t) => { const sorted = kfs.slice().sort((a, b) => a.t - b.t); let a = sorted[0], b = sorted[sorted.length - 1]; for (let i = 0; i < sorted.length - 1; i++) if (t >= sorted[i].t && t <= sorted[i + 1].t) { a = sorted[i]; b = sorted[i + 1]; } const f = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t); return { x: a.x + (b.x - a.x) * f, r: a.r + (b.r - a.r) * f, s: a.s + (b.s - a.s) * f }; };
  const draw = () => { const v = interp(head); obj.style.transform = `translateX(${v.x}px) rotate(${v.r}deg) scale(${v.s})`; tl.replaceChildren(h('div', { style: { position: 'absolute', left: '10px', right: '10px', top: '38px', height: '2px', background: '#e3e6ee' } }), ...kfs.map((k, i) => { const d = h('div', { style: { position: 'absolute', left: `calc(10px + ${k.t}% * 0.98)`, top: '30px', width: '16px', height: '16px', margin: '0 -8px', transform: 'rotate(45deg)', background: i === sel ? '#4f6bff' : '#fff', border: '2px solid #4f6bff', cursor: 'ew-resize' } }); drag(d, { start: () => { sel = i; }, move: (e) => { const p = localPos(e, tl); k.t = Math.round(clamp(p.x / p.w * 100, 0, 100)); draw(); } }); return d; }), h('div', { style: { position: 'absolute', left: `calc(10px + ${head}% * 0.98)`, top: 0, bottom: 0, width: '2px', background: '#ff4f6b' } })); code.update(); };
  drag(tl, { start: (e) => { if (e.target !== tl) return false; head = clamp(localPos(e, tl).x / tl.clientWidth * 100, 0, 100); draw(); }, move: (e) => { head = clamp(localPos(e, tl).x / tl.clientWidth * 100, 0, 100); draw(); } });
  const loop = () => { if (playing) { head = (head + 0.8) % 100; draw(); } requestAnimationFrame(loop); }; loop();
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 320px'; root.style.gridTemplateRows = '48px 1fr 150px'; root.style.gap = '12px'; root.style.padding = '0 14px 14px';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', gap: '14px' } }, h('b', {}, '◆ KeyframePad-ish'), h('span', { style: { flex: 1 } }), btn('▶ Play', (e) => { playing = !playing; e.target.textContent = playing ? '⏸ Pause' : '▶ Play'; }, 'pri'), btn('+ Keyframe', () => { kfs.push({ t: Math.round(head), ...interp(head) }); sel = kfs.length - 1; draw(); })), stage,
    panel('Keyframe', slider('translateX', 0, 700, kfs[sel].x, 1, (v) => { kfs[sel].x = v; draw(); }), slider('rotate', 0, 720, kfs[sel].r, 1, (v) => { kfs[sel].r = v; draw(); }), slider('scale', 0.2, 3, kfs[sel].s, 0.05, (v) => { kfs[sel].s = v; draw(); }), seg(['CSS', 'Tailwind', 'Framer', 'GSAP'], 'CSS', () => {}), code, btn('Copy', () => copy(code.textContent), 'pri')), h('div', { style: { gridColumn: '1/-1' } }, h('div.k-h', {}, 'Timeline · scrub the playhead'), tl));
  draw();
  window.__demoProof = async () => { head = 62; draw(); return 'scrubbed playhead to 62%'; };
};
V['svgartista-stroke-draw'] = (root, T) => {
  theme(root, T, { bg: '#1c1c1c', fg: '#ddd', panel: '#262626', ac: '#1abc9c', dark: true });
  let dur = 2, stagger = 0.2, color = '#1abc9c', fill = true;
  const svg = s('svg', { viewBox: '0 0 400 260', width: 620, height: 400 });
  const paths = ['M200 30L290 170H250L200 90L150 170H110Z', 'M170 150h60l-30-50z', 'M60 230h40M110 230h40M160 230h40M210 230h40M260 230h40M310 230h30'];
  const draw = () => { svg.replaceChildren(...paths.map((d, i) => s('path', { d, fill: 'none', stroke: color, 'stroke-width': i === 2 ? 6 : 5, 'stroke-linejoin': 'round' })), s('text', { x: 200, y: 222, 'text-anchor': 'middle', fill: 'none', stroke: color, 'stroke-width': 1.4, 'font-size': 42, 'font-weight': 800, 'font-family': 'Inter Variable', 'letter-spacing': 4 }, 'SVG ARTISTA'));
    [...svg.children].forEach((p, i) => { const L = p.getTotalLength ? (p.tagName === 'text' ? 1200 : p.getTotalLength()) : 1000; p.style.strokeDasharray = L; p.animate([{ strokeDashoffset: L, fillOpacity: 0 }, { strokeDashoffset: 0, fillOpacity: 0, offset: 0.8 }, { strokeDashoffset: 0, fillOpacity: fill ? 1 : 0 }], { duration: dur * 1000, delay: i * stagger * 1000, fill: 'both', easing: 'ease-in-out' }); if (fill) p.setAttribute('fill', color); }); code.update(); };
  const code = codebox(() => `svg path { stroke-dasharray: var(--len); animation: draw ${dur}s ease-in-out forwards; }\n${paths.map((_, i) => `svg path:nth-child(${i + 1}) { animation-delay: ${(i * stagger).toFixed(1)}s }`).join('\n')}\n@keyframes draw { to { stroke-dashoffset: 0; fill-opacity: ${fill ? 1 : 0} } }`);
  root.style.display = 'grid'; root.style.gridTemplateColumns = '280px 1fr'; root.style.gridTemplateRows = '40px 1fr';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', background: '#141414', padding: '0 14px' } }, h('b', {}, 'SVG Artista-ish'), h('span', { style: { flex: 1 } }), btn('Upload SVG', () => toast('Demo uses built-in logo')), btn('Get code', () => copy(code.textContent), 'pri')), panel('Stroke settings', slider('Duration', 0.5, 6, dur, 0.1, (v) => { dur = v; draw(); }), slider('Stagger', 0, 1, stagger, 0.05, (v) => { stagger = v; draw(); }), h('input', { type: 'color', value: color, oninput: (e) => { color = e.target.value; draw(); } }), toggle('Fill after stroke', true, (v) => { fill = v; draw(); }), select(['ease-in-out', 'linear', 'ease-out'], 'ease-in-out', () => draw()), btn('↻ Replay', draw, 'pri'), code), h('div', { style: { display: 'grid', placeItems: 'center', background: '#fff' } }, svg));
  draw();
  window.__demoProof = async () => { dur = 0.8; stagger = 0.1; draw(); await sleep(1200); return 'stroke-draw replayed and filled'; };
};

V['bradwoods-css-layout-generator'] = (root, T) => {
  theme(root, T, { bg: '#ecebdf', fg: '#141414', panel: '#f7f6ef', ac: '#c45c4a', dark: false, line: '#d5d4c8', btn: '#141414' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'system-ui, Inter Variable, sans-serif';

  const P = { rows: 3, cols: 3, rowGap: 8, colGap: 8, children: 9 };
  const defaults = { ...P };

  const cssText = () => `.layout {
  display: grid;
  grid-template-rows: repeat(${P.rows}, 1fr);
  grid-template-columns: repeat(${P.cols}, 1fr);
  gap: ${P.rowGap}px ${P.colGap}px;
}`;
  const htmlText = () => {
    const n = Math.min(P.children, P.rows * P.cols);
    const cells = Array.from({ length: n }, (_, i) => `  <div>${i + 1}</div>`).join('\n');
    return `<section class="layout">\n${cells}\n</section>`;
  };

  const cssPre = h('pre', {
    style: {
      margin: 0, padding: '12px 14px', background: '#1e1e1c', color: '#e8e6dc',
      font: '12px/1.55 ui-monospace, JetBrains Mono Variable, monospace',
      borderRadius: '8px', whiteSpace: 'pre-wrap', minHeight: '120px',
    },
  });
  const htmlPre = h('pre', {
    style: {
      margin: 0, padding: '12px 14px', background: '#1e1e1c', color: '#e8e6dc',
      font: '12px/1.55 ui-monospace, JetBrains Mono Variable, monospace',
      borderRadius: '8px', whiteSpace: 'pre-wrap', minHeight: '120px', overflow: 'auto', maxHeight: '220px',
    },
  });

  const gridEl = h('div', {
    style: {
      display: 'grid', width: '100%', height: '100%', minHeight: '320px',
      border: '2px solid #141414', background: '#f7f6ef', boxSizing: 'border-box',
    },
  });

  const cell = (n) => h('div', {
    style: {
      position: 'relative',
      background: 'repeating-linear-gradient(135deg,#ecebdf 0 6px,#e4e3d6 6px 12px)',
      border: '1px dashed #c45c4a55',
      display: 'grid', placeItems: 'center',
      font: 'italic 700 42px/1 Georgia,serif', color: '#141414',
    },
  },
    h('span', { style: { position: 'absolute', left: '8px', top: '6px', font: '11px ui-monospace,monospace', color: '#c45c4a', fontStyle: 'normal', fontWeight: 600 } }, '+ name'),
    String(n),
  );

  const draw = () => {
    P.children = P.rows * P.cols;
    gridEl.style.gridTemplateRows = `repeat(${P.rows}, 1fr)`;
    gridEl.style.gridTemplateColumns = `repeat(${P.cols}, 1fr)`;
    gridEl.style.gap = `${P.rowGap}px ${P.colGap}px`;
    gridEl.replaceChildren(...Array.from({ length: P.children }, (_, i) => cell(i + 1)));
    cssPre.textContent = cssText();
    htmlPre.textContent = htmlText();
    rowsOut.textContent = String(P.rows);
    colsOut.textContent = String(P.cols);
    rgOut.textContent = P.rowGap + ' px';
    cgOut.textContent = P.colGap + ' px';
  };

  const rowsOut = h('span', { style: { color: '#c45c4a', fontWeight: 700, fontVariantNumeric: 'tabular-nums' } }, '3');
  const colsOut = h('span', { style: { color: '#c45c4a', fontWeight: 700, fontVariantNumeric: 'tabular-nums' } }, '3');
  const rgOut = h('span', { style: { color: '#c45c4a', fontWeight: 700 } }, '8 px');
  const cgOut = h('span', { style: { color: '#c45c4a', fontWeight: 700 } }, '8 px');

  const numRow = (label, out, min, max, key) => h('div.k-row', {
    style: { justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #d5d4c8', fontSize: '14px' },
  },
    h('span', {}, label),
    h('div.k-row', { style: { gap: '8px' } },
      h('button', {
        style: { width: '28px', height: '28px', border: '1px solid #141414', background: '#fff', borderRadius: '6px', cursor: 'pointer' },
        onclick: () => { P[key] = clamp(P[key] - 1, min, max); draw(); },
      }, '−'),
      out,
      h('button', {
        style: { width: '28px', height: '28px', border: '1px solid #141414', background: '#fff', borderRadius: '6px', cursor: 'pointer' },
        onclick: () => { P[key] = clamp(P[key] + 1, min, max); draw(); },
      }, '+'),
    ),
  );

  const gapRow = (label, out, key) => h('div', { style: { padding: '10px 0', borderBottom: '1px solid #d5d4c8' } },
    h('div.k-row', { style: { justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' } }, h('span', {}, label), out),
    slider('', 0, 48, P[key], 1, (v) => { P[key] = v; draw(); }),
  );

  const left = h('div', {
    style: {
      position: 'absolute', left: 0, top: 0, bottom: 0, width: '260px',
      padding: '18px 16px', background: '#f7f6ef', borderRight: '1px solid #d5d4c8',
      overflow: 'auto', display: 'grid', alignContent: 'start', gap: '4px',
    },
  },
    h('div.k-row', { style: { gap: '8px', marginBottom: '12px' } },
      h('span', { style: { width: '18px', height: '18px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px' } },
        ...Array.from({ length: 9 }, () => h('i', { style: { background: '#141414', borderRadius: '1px' } }))),
      h('b', { style: { fontSize: '15px' } }, 'CSS Layout Generator'),
    ),
    h('div', { style: { fontSize: '11px', letterSpacing: '.08em', opacity: .55, marginBottom: '6px' } }, 'GRID SETTINGS'),
    numRow('Rows', rowsOut, 1, 8, 'rows'),
    numRow('Columns', colsOut, 1, 8, 'cols'),
    gapRow('Row Gap', rgOut, 'rowGap'),
    gapRow('Column Gap', cgOut, 'colGap'),
    h('div', { style: { marginTop: '14px', fontSize: '12px', opacity: .6 } }, 'Live CSS grid · copy CSS / HTML from the right panels.'),
  );

  const mid = h('div', {
    style: {
      position: 'absolute', left: '260px', right: '320px', top: 0, bottom: 0,
      padding: '48px 28px 28px', display: 'grid',
    },
  },
    h('div.k-row', {
      style: {
        position: 'absolute', top: '12px', left: '28px', right: '28px',
        fontSize: '12px', letterSpacing: '.12em', gap: '18px',
      },
    },
      h('span', { style: { borderBottom: '2px solid #c45c4a', paddingBottom: '4px', fontWeight: 700 } }, 'BASIC'),
      h('span', { style: { opacity: .45 } }, 'ADVANCED'),
      h('span', { style: { flex: 1 } }),
      h('span', { style: { opacity: .45 } }, 'ABOUT'),
    ),
    gridEl,
  );

  const codePanel = (title, pre, getter) => h('div', {
    style: { display: 'grid', gap: '8px', minHeight: 0 },
  },
    h('div.k-row', { style: { justifyContent: 'space-between' } },
      h('b', { style: { fontSize: '13px' } }, title),
      btn('Copy', () => copy(getter(), title + ' copied'), 'pri'),
    ),
    pre,
  );

  const right = h('div', {
    style: {
      position: 'absolute', right: 0, top: 0, bottom: 0, width: '320px',
      padding: '16px', background: '#f7f6ef', borderLeft: '1px solid #d5d4c8',
      display: 'grid', gridTemplateRows: '1fr 1fr', gap: '14px', overflow: 'hidden',
    },
  },
    codePanel('# CSS', cssPre, cssText),
    codePanel('# HTML', htmlPre, htmlText),
  );
  right.querySelectorAll('.k-btn').forEach((b) => {
    Object.assign(b.style, { background: '#c45c4a', color: '#fff', border: 0, borderRadius: '8px', fontSize: '12px', fontWeight: 700 });
  });

  root.append(left, mid, right);
  draw();

  window.__demoProof = async () => {
    Object.assign(P, { rows: 4, cols: 5, rowGap: 16, colGap: 12 });
    draw();
    await copy(cssText(), 'CSS copied');
    await sleep(80);
    Object.assign(P, defaults);
    draw();
    return 'rows/cols/gaps changed, CSS copied, defaults restored';
  };
};

V['singlediv-css-art-museum'] = (root, T) => {
  theme(root, T, { bg: '#f4f1ea', fg: '#1a1a1a', panel: '#fffdf8', ac: '#2c5aa0', dark: false, line: '#e4dfd4' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Georgia, "Times New Roman", serif';

  const ART = [
    {
      id: 'coffee', title: 'Morning Cup', artist: 'Museum · CSS', year: '2016', bg: '#c4a574',
      css: `#art{width:60px;height:60px;background:#6f4e37;border-radius:0 0 28px 28px;box-shadow:70px 0 0 #6f4e37,35px 55px 0 -8px #fff,35px 55px 0 4px #6f4e37, -18px 10px 0 8px #6f4e37, 88px 10px 0 8px #6f4e37;position:relative}
#art:before{content:"";position:absolute;left:100%;top:12px;width:22px;height:34px;border:6px solid #6f4e37;border-left:0;border-radius:0 18px 18px 0}`,
    },
    {
      id: 'icecream', title: 'Soft Serve', artist: 'Museum · CSS', year: '2017', bg: '#f7c6d0',
      css: `#art{width:50px;height:50px;background:#fff;border-radius:50%;box-shadow:0 -28px 0 #fff,0 -56px 0 #fff,0 42px 0 -8px #e8b86d,0 58px 0 -2px #e8b86d,0 74px 0 2px #e8b86d;position:relative;margin-top:60px}
#art:before{content:"";position:absolute;left:50%;top:-70px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:#ff6b8a}`,
    },
    {
      id: 'ghost', title: 'Friendly Ghost', artist: 'Museum · CSS', year: '2015', bg: '#2b2d42',
      css: `#art{width:70px;height:80px;background:#f8f7f4;border-radius:35px 35px 8px 8px;box-shadow: inset 18px 28px 0 -10px #2b2d42, inset -18px 28px 0 -10px #2b2d42, 0 70px 0 -28px #f8f7f4, -18px 70px 0 -28px #f8f7f4, 18px 70px 0 -28px #f8f7f4;position:relative}
#art:before{content:"";position:absolute;left:16px;top:30px;width:10px;height:14px;border-radius:50%;background:#2b2d42;box-shadow:28px 0 #2b2d42}`,
    },
    {
      id: 'planet', title: 'Ringed Planet', artist: 'Museum · CSS', year: '2018', bg: '#0b132b',
      css: `#art{width:70px;height:70px;background:radial-gradient(circle at 30% 30%,#7ee0c8,#1c7c6a 55%,#0b3d4a);border-radius:50%;box-shadow:0 0 0 8px #0b132b, 0 0 0 12px #f0c27a55;position:relative}
#art:before{content:"";position:absolute;left:-30px;top:28px;width:130px;height:14px;border-radius:50%;border:3px solid #f0c27a;transform:rotate(-18deg);box-shadow:0 0 12px #f0c27a66}`,
    },
    {
      id: 'balloon', title: 'Party Balloon', artist: 'Museum · CSS', year: '2014', bg: '#e8f4ff',
      css: `#art{width:56px;height:68px;background:#ff5a5f;border-radius:50% 50% 50% 50% / 42% 42% 58% 58%;box-shadow:inset -10px -8px 0 #cc3338;position:relative;margin-bottom:40px}
#art:before{content:"";position:absolute;left:50%;bottom:-10px;width:0;height:0;border:6px solid transparent;border-top-color:#cc3338;margin-left:-6px}
#art:after{content:"";position:absolute;left:50%;top:100%;width:2px;height:48px;background:repeating-linear-gradient(#888 0 4px,transparent 4px 8px);margin-left:-1px}`,
    },
    {
      id: 'moon', title: 'Night Moon', artist: 'Museum · CSS', year: '2019', bg: '#1b1f3a',
      css: `#art{width:80px;height:80px;border-radius:50%;background:#f4e8c1;box-shadow: inset -18px -6px 0 6px #1b1f3a, 40px -30px 0 -28px #fff, 60px 10px 0 -34px #fff, -30px -40px 0 -32px #fff;position:relative}`,
    },
  ];
  let idx = 0;
  let showCss = false;

  const stageWrap = h('div', { style: { flex: 1, minWidth: 0, display: 'grid', placeItems: 'center', position: 'relative', transition: 'background .35s' } });
  const artHost = h('div', { style: { width: '160px', height: '160px', display: 'grid', placeItems: 'center' } });
  const meta = h('div', { style: { position: 'absolute', left: '28px', bottom: '28px', color: '#fff', textShadow: '0 1px 8px #0008' } });
  const cssPanel = h('pre', {
    style: {
      position: 'absolute', right: '20px', top: '20px', bottom: '20px', width: '340px', margin: 0,
      padding: '16px', background: '#1a1a1acc', color: '#e8e6dc', borderRadius: '12px',
      font: '11px/1.5 ui-monospace, JetBrains Mono Variable, monospace', overflow: 'auto',
      display: 'none', backdropFilter: 'blur(8px)', border: '1px solid #ffffff22',
    },
  });

  const styleEl = h('style', {});
  const apply = () => {
    const a = ART[idx];
    stageWrap.style.background = a.bg;
    styleEl.textContent = a.css.replace(/#art/g, '#singlediv-art');
    artHost.replaceChildren(h('div#singlediv-art', {}));
    meta.replaceChildren(
      h('div', { style: { font: 'italic 28px/1.1 Georgia,serif' } }, a.title),
      h('div', { style: { font: '13px Inter Variable,system-ui,sans-serif', opacity: .85, marginTop: '6px' } }, `${a.artist} · ${a.year}`),
      h('div', { style: { font: '11px Inter Variable,system-ui,sans-serif', opacity: .55, marginTop: '4px' } }, `${idx + 1} / ${ART.length} · one <div>`),
    );
    cssPanel.textContent = `/* single div */\n${a.css}`;
    cssPanel.style.display = showCss ? 'block' : 'none';
    paintGrid();
  };

  const gridHost = h('div', { style: { width: '220px', flexShrink: 0, background: '#fffdf8', borderLeft: '1px solid #e4dfd4', padding: '14px', overflow: 'auto', display: 'grid', gap: '10px', alignContent: 'start' } });
  const paintGrid = () => {
    gridHost.replaceChildren(
      h('div', { style: { font: '700 12px Inter Variable,system-ui', letterSpacing: '.1em', opacity: .55 } }, 'GALLERY'),
      ...ART.map((a, i) => h('button', {
        style: {
          textAlign: 'left', border: i === idx ? '2px solid #2c5aa0' : '1px solid #e4dfd4', borderRadius: '10px',
          padding: '10px', cursor: 'pointer', background: i === idx ? '#eef3fb' : '#fff', fontFamily: 'Inter Variable,system-ui',
        },
        onclick: () => { idx = i; apply(); toast(a.title); },
      },
        h('div', { style: { height: '48px', borderRadius: '6px', background: a.bg, marginBottom: '8px' } }),
        h('b', { style: { fontSize: '13px', display: 'block' } }, a.title),
        h('span', { style: { fontSize: '11px', opacity: .55 } }, a.year),
      )),
    );
  };

  const nav = (dir) => { idx = (idx + dir + ART.length) % ART.length; apply(); };

  const header = h('div.k-row', {
    style: { height: '52px', padding: '0 20px', background: '#2a2a2a', color: '#f4f1ea', gap: '16px', fontFamily: 'Inter Variable,system-ui,sans-serif' },
  },
    h('b', { style: { fontWeight: 500 } }, 'A Single Div'),
    h('span', { style: { opacity: .55, fontSize: '13px' } }, 'a CSS drawing museum'),
    h('span', { style: { flex: 1 } }),
    btn('← Prev', () => nav(-1)),
    btn('Next →', () => nav(1)),
    btn(showCss ? 'Hide CSS' : 'View CSS', (e) => { showCss = !showCss; e.target.textContent = showCss ? 'Hide CSS' : 'View CSS'; apply(); }, 'pri'),
    btn('Copy CSS', () => copy(ART[idx].css, 'CSS copied')),
  );
  header.querySelectorAll('.k-btn').forEach((b) => {
    Object.assign(b.style, { background: '#ffffff14', color: '#f4f1ea', border: '1px solid #ffffff22', borderRadius: '8px' });
  });

  stageWrap.append(artHost, meta, cssPanel);
  root.style.display = 'flex'; root.style.flexDirection = 'column';
  root.append(styleEl, header, h('div', { style: { display: 'flex', flex: 1, minHeight: 0 } }, stageWrap, gridHost));
  apply();

  window.__demoProof = async () => {
    const prev = idx;
    idx = 2; showCss = true; apply();
    await sleep(150);
    idx = 3; apply();
    await copy(ART[idx].css, 'CSS copied');
    await sleep(80);
    idx = prev; showCss = false; apply();
    return 'opened ghost→planet, copied CSS, restored gallery index';
  };
};

// ---------- Rauno craft — interaction-prototype shelf (2026-10-05 08:00 KST)
V['rauno-craft-interaction-shelf'] = (root, T) => {
  theme(root, T, { bg: '#f9f9f9', fg: '#1a1a1a', panel: '#ffffff', ac: '#fff200', dark: false, line: '#00000012' });
  root.classList.add('scroll'); root.style.overflow = 'auto'; root.style.background = '#f9f9f9'; root.style.color = '#1a1a1a';
  const SANS = "'Inter Variable', system-ui, sans-serif"; root.style.fontFamily = SANS;
  const OR = '#ff4f00', YE = '#fff200';
  root.append(h('style', {}, `
    .rc-top{height:146px;display:grid;place-items:center}
    .rc-bar{display:flex;align-items:center;gap:7px}
    .rc-bar button{border:1.5px solid #9a9a9a;background:transparent;height:16px;padding:0;cursor:pointer;border-radius:1px;transition:all .25s cubic-bezier(.2,.8,.2,1)}
    .rc-bar button.sq{width:28px}.rc-bar button.on{background:${YE};border-color:${YE};width:30px}
    .rc-bar button:hover{border-color:#333}.rc-bar i{width:1.5px;height:16px;background:#9a9a9a;display:block}
    .rc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 8px 40px;align-items:start;transition:all .3s}
    .rc-grid.one{grid-template-columns:minmax(0,560px);justify-content:center}.rc-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}
    .rc-col{display:grid;gap:8px}
    .rc-card{background:#fff;border:1px solid #ececec;border-radius:12px;padding:4px;display:flex;flex-direction:column;box-shadow:0 1px 0 #00000005}
    .rc-card.grey{background:#ececec;border-color:#e4e4e4}
    .rc-hd{display:flex;justify-content:space-between;padding:12px 12px 0;font-size:12px;color:#222;font-weight:450}
    .rc-hd span:last-child{color:#7a7a7a}
    .rc-body{position:relative;min-height:150px;display:grid;place-items:center;overflow:hidden;border-radius:9px}
    .rc-ft{margin-top:4px;height:38px;border-radius:8px;background:#f3f3f3;border:0;font:500 13px ${SANS};color:#222;cursor:pointer;transition:background .15s}
    .rc-ft:hover{background:#ebebeb}.rc-ft:active{transform:scale(.99)}
    .rc-cap{position:absolute;left:12px;bottom:8px;font-size:12px;color:#222}.rc-cap2{position:absolute;right:12px;bottom:8px;font-size:12px;color:#7a7a7a}
    .rc-post{width:100px;height:150px;background:#fff;box-shadow:0 1px 2px #0002;transition:transform .35s cubic-bezier(.2,.9,.3,1.3);cursor:zoom-in;position:relative;overflow:hidden}
    .rc-post:hover{transform:translateY(-6px) rotate(-2deg)}
    .rc-post.big{transform:scale(2.1) translateY(4px);z-index:5;box-shadow:0 10px 30px #0003;cursor:zoom-out}
    .rc-dock{display:flex;align-items:flex-end;gap:8px;height:110px;padding:0 14px 10px;background:#ffffffaa;border:1px solid #ececec;border-radius:18px;backdrop-filter:blur(8px)}
    .rc-dock b{width:42px;height:42px;border-radius:11px;display:block;transform-origin:bottom center;transition:width .08s,height .08s;box-shadow:inset 0 -2px 0 #0002,0 2px 6px #0001}
    .rc-stk{position:absolute;background:${YE};color:#111;font:500 22px/1 ${SANS};letter-spacing:-.02em;padding:6px 8px;border:1px solid #111;cursor:grab;user-select:none;touch-action:none;box-shadow:0 1px 0 #111}
    .rc-stk:active{cursor:grabbing}
    .rc-tcard{position:absolute;width:76%;padding:16px;border-radius:12px;background:#fff;border:1px solid #e6e6e6;font-size:13px;line-height:1.45;color:#333;box-shadow:0 8px 24px #0000000d;transition:transform .45s cubic-bezier(.2,.9,.3,1),opacity .3s;cursor:pointer}
    .rc-tcard b{display:block;font-size:12px;color:#111;margin-top:8px}
    .rc-cb{width:78%;position:relative}.rc-cb input{width:100%;height:38px;border:1px solid #e3e3e3;border-radius:9px;padding:0 12px;font:13px ${SANS};outline:none;background:#fff;color:#111}
    .rc-cb input:focus{border-color:#bbb;box-shadow:0 0 0 3px #0000000a}
    .rc-cb ul{list-style:none;margin:6px 0 0;padding:4px;border:1px solid #ececec;border-radius:10px;background:#fff;box-shadow:0 10px 30px #0000000f;max-height:150px;overflow:auto}
    .rc-cb li{padding:8px 10px;border-radius:7px;font-size:13px;display:flex;justify-content:space-between;cursor:pointer;color:#222}
    .rc-cb li.act{background:#f2f2f2}.rc-cb li .ck{color:${OR}}
    .rc-hold{position:relative;height:44px;padding:0 22px;border-radius:99px;border:0;background:#f1f1f1;font:500 14px ${SANS};color:#d92d20;cursor:pointer;overflow:hidden;user-select:none}
    .rc-hold .fill{position:absolute;inset:0;background:#ffdbd6;clip-path:inset(0 100% 0 0);display:flex;align-items:center;justify-content:center;color:#b42318}
    .rc-ic{display:grid;grid-template-columns:repeat(4,1fr);gap:12px 8px;padding:18px 10px;width:100%}
    .rc-ic div{height:52px;display:grid;place-items:center;cursor:pointer;border-radius:8px}.rc-ic div:hover{background:#f6f6f6}
    .rc-shim{background:linear-gradient(90deg,#999 0%,#111 40%,#999 60%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:rcSh 1.4s linear infinite}
    @keyframes rcSh{from{background-position:200% 0}to{background-position:-200% 0}}
    @keyframes rcOrb{to{transform:rotate(360deg)}} @keyframes rcSw{50%{transform:rotate(-28deg)}} @keyframes rcSl{50%{transform:translateX(14px)}} @keyframes rcBl{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}} @keyframes rcPu{50%{r:6}}
    .rc-ic .spin{animation:rcOrb 3s linear infinite;transform-origin:center}.rc-ic .sw{animation:rcSw 2s ease-in-out infinite;transform-origin:30px 6px}.rc-ic .sl{animation:rcSl 1.8s ease-in-out infinite}.rc-ic .bl{animation:rcBl 3s infinite;transform-origin:center}
    .rc-ic div:hover .spin{animation-duration:.8s}.rc-ic div:hover .sl{animation-duration:.6s}
  `));
  const card = (title, date, body, foot, cls = '') => h('div.rc-card' + cls, {}, title ? h('div.rc-hd', {}, h('span', {}, title), h('span', {}, date)) : null, body, foot ? h('button.rc-ft', { onclick: () => toast(foot + ' →') }, foot) : null);
  // top bar (view switch)
  let view = 'grid';
  const vb = { one: h('button.sq', { title: 'Single column' }), grid: h('button.sq.on', { title: 'Grid' }), two: h('button.sq', { title: 'Two columns' }) };
  const bar = h('div.rc-bar', {}, vb.one, h('i'), h('i'), h('i'), h('i'), vb.grid, h('i'), h('i'), vb.two, h('i'), h('i'));
  const setView = (v) => { view = v; Object.entries(vb).forEach(([k, b]) => b.classList.toggle('on', k === v)); grid.className = 'rc-grid' + (v === 'grid' ? '' : ' ' + v); };
  Object.entries(vb).forEach(([k, b]) => b.addEventListener('click', () => setView(k)));
  // 1. posters
  const P1 = () => h('div', { style: { padding: '6px 4px', font: `500 21px/0.82 ${SANS}`, letterSpacing: '-.03em', position: 'relative' } }, 'MAKE SOFT WARE MAKE SOFT WARE MAKE'.split(' ').map((w) => h('div', {}, w)), s('svg', { viewBox: '0 0 70 108', style: 'position:absolute;inset:0' }, s('path', { d: 'M4 20 C 30 10, 50 40, 66 22 M6 60 C 30 50, 40 80, 64 70', stroke: '#3a5bd9', fill: 'none', 'stroke-width': 1.4 }), s('path', { d: 'M10 40 C 20 30, 50 60, 60 46', stroke: '#e0403a', fill: 'none', 'stroke-width': 1.4 })));
  const P2 = () => s('svg', { viewBox: '0 0 70 108', width: 100, height: 150 }, s('path', { d: 'M28 0 L28 30 C 28 36, 40 36, 40 30 L40 0', fill: '#e7b48f' }), s('path', { d: 'M26 52 h4 v-10 h4 v14 h4 v-4 h4 v4 h4 v4 h4 v14 h-4 v6 h-20 v-6 h-4 v-6 h-4 v-6 h4 v4 h4 Z', fill: '#fff', stroke: '#111', 'stroke-width': 2 }));
  const P3 = () => h('div', { style: { padding: '6px 4px', font: `400 18px/1.05 ${SANS}`, position: 'relative', textAlign: 'center' } }, s('svg', { viewBox: '0 0 70 108', style: 'position:absolute;inset:0' }, s('path', { d: 'M18 30 L36 92', stroke: YE, 'stroke-width': 14 })), h('div', { style: { position: 'relative' } }, 'HISTORY', h('br'), 'OF', h('br'), 'SOFT-', h('br'), 'WARE', h('br'), 'DESIGN'));
  const P4 = () => s('svg', { viewBox: '0 0 70 108', width: 100, height: 150 }, ...Array.from({ length: 22 }, (_, i) => { const a = Math.PI * (0.1 + (i / 21) * 0.8); return s('circle', { cx: 35 + Math.cos(a) * 26, cy: 46 + Math.sin(a) * 22, r: 2.6, fill: 'none', stroke: '#4a4ad0', 'stroke-width': 1 }); }), ...[24, 46].map((x) => s('path', { d: `M${x} 20 v18`, stroke: '#4a4ad0', 'stroke-width': 4, 'stroke-dasharray': '2 1.5' })));
  const posters = h('div', { style: { display: 'flex', gap: '8px', padding: '16px 12px 34px' } }, [P1, P2, P3, P4].map((f) => { const p = h('div.rc-post', { onclick: () => { const on = !p.classList.contains('big'); postersAll().forEach((x) => x.classList.remove('big')); p.classList.toggle('big', on); } }, f()); return p; }));
  const postersAll = () => [...posters.children];
  const cPosters = card(null, null, h('div.rc-body', { style: { minHeight: '170px', overflow: 'visible' } }, posters, h('div.rc-cap', {}, 'Posters'), h('div.rc-cap2', {}, 'August 2026')), null, '.grey');
  // 2. slide to unlock phone
  let unlocked = false;
  const knobP = h('div', { style: { position: 'absolute', left: '3px', top: '3px', width: '34px', height: '22px', borderRadius: '5px', background: 'linear-gradient(#fdfdfd,#cfcfcf)', display: 'grid', placeItems: 'center', fontSize: '12px', color: '#777', cursor: 'grab', touchAction: 'none' } }, '➜');
  const track = h('div', { style: { position: 'absolute', left: '12px', right: '12px', bottom: '14px', height: '28px', borderRadius: '7px', background: '#0009', border: '1px solid #ffffff22' } }, h('div.rc-shim', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', font: `400 11px ${SANS}`, background: 'linear-gradient(90deg,#666 0%,#fff 45%,#666 60%)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', color: 'transparent', paddingLeft: '26px' } }, 'slide to unlock'), knobP);
  const apps = h('div', { style: { position: 'absolute', inset: '30px 10px 50px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', opacity: 0, transform: 'scale(1.15)', transition: 'all .45s cubic-bezier(.2,.9,.3,1)', pointerEvents: 'none' } }, ['#5ac8fa', '#4cd964', '#ff9500', '#ff2d55', '#ffcc00', '#8e8e93', '#34aadc', '#ff3b30', '#5856d6', '#4cd964', '#007aff', '#ff9500'].map((c) => h('i', { style: { aspectRatio: 1, borderRadius: '6px', background: `linear-gradient(${c},${c}bb)`, boxShadow: 'inset 0 1px 0 #fff6' } })));
  const clock = h('div', { style: { position: 'absolute', top: '22px', left: 0, right: 0, textAlign: 'center', color: '#fff', font: `200 30px/1 ${SANS}`, textShadow: '0 1px 2px #0006', transition: 'opacity .3s' } }, '9:41', h('div', { style: { font: `400 9px ${SANS}`, marginTop: '4px' } }, 'Monday, October 5'));
  const screen = h('div', { style: { position: 'absolute', inset: '26px 9px 40px', borderRadius: '3px', overflow: 'hidden', background: 'radial-gradient(circle at 40% 40%,#ff7a2e,#c4361a 30%,#1d6b3a 60%,#0c2b1c)' } }, clock, apps, track);
  const phone = h('div', { style: { position: 'relative', width: '150px', height: '270px', borderRadius: '22px', background: 'linear-gradient(135deg,#3a3a3a,#0d0d0d)', boxShadow: '0 0 0 2px #b9b9b9, 0 18px 40px #0003', transform: 'rotate(-14deg) skewX(4deg)' } }, screen, h('div', { style: { position: 'absolute', bottom: '8px', left: '50%', width: '24px', height: '24px', marginLeft: '-12px', borderRadius: '50%', border: '1.5px solid #555', cursor: 'pointer' }, onclick: () => lock() }));
  const setUnlock = (on) => { unlocked = on; apps.style.opacity = on ? 1 : 0; apps.style.transform = on ? 'scale(1)' : 'scale(1.15)'; clock.style.opacity = on ? 0 : 1; track.style.opacity = on ? 0 : 1; track.style.pointerEvents = on ? 'none' : ''; knobP.style.transition = 'left .3s'; knobP.style.left = '3px'; };
  const lock = () => setUnlock(false);
  let kx0 = 0; drag(knobP, { start: (e) => { kx0 = e.clientX; knobP.style.transition = 'none'; }, move: (e) => { const max = track.clientWidth - 40; knobP.style.left = clamp(3 + e.clientX - kx0, 3, max) + 'px'; }, end: () => { const max = track.clientWidth - 40; if (parseFloat(knobP.style.left) >= max - 4) { setUnlock(true); toast('Unlocked'); } else { knobP.style.transition = 'left .3s'; knobP.style.left = '3px'; } } });
  const cPhone = card('History of Software Design', 'February 2026', h('div.rc-body', { style: { minHeight: '300px' } }, phone, h('div', { style: { position: 'absolute', bottom: '6px', fontSize: '8px', color: '#999', letterSpacing: '.02em' } }, 'Fig. 1 — slide to unlock (2007) · drag the knob · tap home to lock')), 'View Production');
  // 3. icon micro-interactions
  const st = { stroke: '#111', 'stroke-width': 1.5, fill: 'none' };
  const ICONS = [
    () => s('svg', { width: 60, height: 40, viewBox: '0 0 60 40' }, s('g', { class: 'spin', style: 'transform-origin:30px 20px' }, s('circle', { cx: 12, cy: 20, r: 3, fill: OR }), s('circle', { cx: 48, cy: 14, r: 2.5, ...st })), s('path', { d: 'M12 20 L30 8 L48 14 L36 32 Z', ...st })),
    () => s('svg', { width: 60, height: 40, viewBox: '0 0 60 40' }, s('rect', { x: 18, y: 6, width: 22, height: 28, ...st }), s('rect', { x: 24, y: 14, width: 10, height: 6, fill: OR, class: 'bl' })),
    () => s('svg', { width: 60, height: 40, viewBox: '0 0 60 40' }, s('path', { d: 'M14 8 L46 20 L14 32', ...st }), s('circle', { cx: 30, cy: 20, r: 4, fill: OR, class: 'sl' })),
    () => s('svg', { width: 60, height: 40, viewBox: '0 0 60 40' }, s('g', { class: 'sw' }, s('path', { d: 'M30 6 L30 30', ...st }), s('circle', { cx: 30, cy: 32, r: 4, fill: OR })), s('path', { d: 'M8 34 C 20 40, 40 40, 52 34', ...st, 'stroke-dasharray': '2 3' })),
    () => { let on = false; const k = s('circle', { cx: 22, cy: 20, r: 6, fill: '#111' }); const bg = s('rect', { x: 12, y: 12, width: 36, height: 16, rx: 8, ...st }); const g = s('svg', { width: 60, height: 40, viewBox: '0 0 60 40', style: 'cursor:pointer' }, bg, k); g.addEventListener('click', () => { on = !on; k.setAttribute('cx', on ? 38 : 22); k.setAttribute('fill', on ? OR : '#111'); }); k.style.transition = 'cx .25s cubic-bezier(.3,1.6,.5,1)'; return g; },
    () => s('svg', { width: 60, height: 40, viewBox: '0 0 60 40' }, s('path', { d: 'M8 20 C 18 4, 28 36, 38 20', ...st }), s('circle', { cx: 44, cy: 20, r: 5, ...st }), s('circle', { cx: 20, cy: 14, r: 4, fill: OR, class: 'sl' })),
    () => s('svg', { width: 60, height: 40, viewBox: '0 0 60 40' }, s('rect', { x: 10, y: 15, width: 40, height: 10, rx: 5, ...st }), s('circle', { cx: 18, cy: 20, r: 6, fill: OR, class: 'sl' })),
    () => s('svg', { width: 60, height: 40, viewBox: '0 0 60 40' }, s('ellipse', { cx: 30, cy: 20, rx: 22, ry: 10, ...st }), s('g', { class: 'spin', style: 'transform-origin:30px 20px' }, s('circle', { cx: 52, cy: 20, r: 3, fill: OR })), s('ellipse', { cx: 30, cy: 20, rx: 12, ry: 5, ...st, 'stroke-dasharray': '2 2' })),
  ];
  const icons = h('div.rc-ic', {}, ICONS.concat(ICONS).map((f, i) => h('div', { title: 'micro-interaction ' + (i + 1), onclick: (e) => { const d = e.currentTarget; d.animate([{ transform: 'scale(1)' }, { transform: 'scale(.86)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'cubic-bezier(.3,1.6,.5,1)' }); } }, f())));
  const cIcons = card(null, null, h('div.rc-body', { style: { minHeight: '200px' } }, icons));
  // 4. dock magnification
  const DCOL = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#38d9a9', '#4dabf7', '#9775fa', '#f783ac'];
  const dockIcons = DCOL.map((c) => h('b', { style: { background: `linear-gradient(160deg,${c},${c}aa)` } }));
  const dock = h('div.rc-dock', {}, dockIcons);
  const magnify = (x) => dockIcons.forEach((b) => { const r = b.getBoundingClientRect(); const d = x == null ? 999 : Math.abs(x - (r.left + r.width / 2)); const k = 1 + Math.max(0, 1 - d / 110) * 0.85; b.style.width = b.style.height = 42 * k + 'px'; });
  dock.addEventListener('pointermove', (e) => magnify(e.clientX)); dock.addEventListener('pointerleave', () => magnify(null));
  const cDock = card('DD System', 'June 2026', h('div.rc-body', { style: { minHeight: '190px', background: 'linear-gradient(180deg,#fafafa,#efefef)' } }, dock), 'View Production');
  // 5. novelty stickers
  const novBody = h('div.rc-body', { style: { minHeight: '210px', cursor: 'copy' } });
  const STK0 = [[-70, -40, -14], [10, -52, 8], [-40, -8, 12], [50, -14, -6], [-90, 22, 4], [0, 26, -12], [70, 30, 10], [-20, 54, 3], [40, 60, -9]];
  const stickers = [];
  const mkStk = (x, y, r) => { const el = h('div.rc-stk', { style: { left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: `translate(-50%,-50%) rotate(${r}deg)` } }, 'Novelty'); const o = { el, x, y, r }; let p0, s0; drag(el, { start: (e) => { e.stopPropagation(); p0 = { x: e.clientX, y: e.clientY }; s0 = { x: o.x, y: o.y }; novBody.append(el); }, move: (e) => { o.x = s0.x + e.clientX - p0.x; o.y = s0.y + e.clientY - p0.y; el.style.left = `calc(50% + ${o.x}px)`; el.style.top = `calc(50% + ${o.y}px)`; } }); el.addEventListener('pointerdown', (e) => e.stopPropagation()); stickers.push(o); novBody.append(el); return o; };
  const resetNov = () => { stickers.splice(0).forEach((o) => o.el.remove()); STK0.forEach((a) => mkStk(...a)); };
  novBody.addEventListener('pointerdown', (e) => { if (e.target !== novBody) return; const r = novBody.getBoundingClientRect(); const o = mkStk(Math.round(e.clientX - r.left - r.width / 2), Math.round(e.clientY - r.top - r.height / 2), Math.round((Math.random() - 0.5) * 30)); o.el.animate([{ transform: o.el.style.transform + ' scale(1.4)', opacity: 0 }, { transform: o.el.style.transform, opacity: 1 }], { duration: 220, easing: 'cubic-bezier(.2,.9,.3,1.3)' }); });
  resetNov();
  const cNov = card(null, null, h('div', {}, novBody, h('div.rc-hd', { style: { paddingBottom: '10px' } }, h('span', {}, 'Novelty'), h('span', {}, 'February 2026'))), 'Read Essay');
  // 6. testimonials stack
  const QUOTES = [['“The details are the design. Every interaction here feels considered.”', 'Emil K. — Design Engineer'], ['“Rauno’s prototypes taught me how motion carries meaning.”', 'Paco C. — Designer'], ['“A shelf of tiny, perfect things.”', 'Jhey T. — Developer']];
  const tBody = h('div.rc-body', { style: { minHeight: '210px' } }); let order = [0, 1, 2];
  const tcards = QUOTES.map(([q, a]) => h('div.rc-tcard', { onclick: () => cycle() }, q, h('b', {}, a)));
  const layoutT = () => order.forEach((qi, depth) => { const c = tcards[qi]; c.style.zIndex = 10 - depth; c.style.transform = `translateY(${depth * 12}px) scale(${1 - depth * 0.05})`; c.style.opacity = depth > 2 ? 0 : 1 - depth * 0.15; });
  const cycle = () => { const top = order.shift(); order.push(top); const c = tcards[top]; c.style.transform = 'translateY(-40px) rotate(-6deg) scale(.95)'; c.style.opacity = 0; setTimeout(layoutT, 180); };
  tBody.append(...tcards); layoutT();
  const cTest = card('Testimonials', 'September 2025', tBody);
  // 7. agent streaming
  const ANS = 'Found 3 issues in checkout.tsx. Fixed the race in useCart, memoized the price list, and added a skeleton for the slow request. Opening a PR…';
  const out = h('div', { style: { fontSize: '13px', lineHeight: 1.5, color: '#222', minHeight: '60px' } });
  const thinking = h('div.rc-shim', { style: { fontSize: '13px', fontWeight: 500 } }, 'Thinking…');
  const ask = h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center', border: '1px solid #e6e6e6', borderRadius: '10px', padding: '6px 6px 6px 12px', fontSize: '13px', color: '#888', background: '#fff' } }, h('span', { style: { flex: 1 } }, 'Review my checkout flow'), h('button', { style: { width: '28px', height: '28px', borderRadius: '7px', border: 0, background: '#111', color: '#fff', cursor: 'pointer' }, onclick: () => runAgent() }, '↑'));
  let agentT = 0; const runAgent = async () => { const my = ++agentT; out.textContent = ''; thinking.style.display = ''; await sleep(700); if (my !== agentT) return; thinking.style.display = 'none'; for (const w of ANS.split(' ')) { if (my !== agentT) return; out.textContent += w + ' '; await sleep(45); } };
  const cAgent = card('Vercel Agent', 'May 2026', h('div.rc-body', { style: { minHeight: '230px', placeItems: 'stretch', padding: '14px', alignContent: 'start', gap: '10px', background: 'linear-gradient(#fff,#fafafa)' } }, ask, thinking, out));
  setTimeout(runAgent, 600);
  // 8. combobox
  const FR = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Dragonfruit', 'Fig', 'Grape', 'Kiwi', 'Lemon', 'Mango', 'Peach'];
  let act = 0, chosen = null; const inp = h('input', { placeholder: 'Search fruit…', autocomplete: 'off' }); const ul = h('ul');
  const renderCb = () => { const q = inp.value.toLowerCase(); const items = FR.filter((f) => f.toLowerCase().includes(q)); act = clamp(act, 0, Math.max(0, items.length - 1)); ul.replaceChildren(...(items.length ? items.map((f, i) => h('li' + (i === act ? '.act' : ''), { onmouseenter: () => { act = i; renderCb(); }, onmousedown: (e) => { e.preventDefault(); choose(f); } }, f, chosen === f ? h('span.ck', {}, '✓') : '')) : [h('li', { style: { color: '#999' } }, 'No results')])); ul.items = items; };
  const choose = (f) => { chosen = f; inp.value = f; renderCb(); toast('Selected ' + f); };
  inp.addEventListener('input', () => { act = 0; renderCb(); });
  inp.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { act++; renderCb(); e.preventDefault(); } if (e.key === 'ArrowUp') { act = Math.max(0, act - 1); renderCb(); e.preventDefault(); } if (e.key === 'Enter' && ul.items?.[act]) choose(ul.items[act]); if (e.key === 'Escape') { inp.value = ''; renderCb(); } });
  renderCb();
  const cCombo = card('Combobox', 'December 2025', h('div.rc-body', { style: { minHeight: '260px', alignContent: 'start', paddingTop: '18px' } }, h('div.rc-cb', {}, inp, ul)));
  // 9. hold to delete
  const fill = h('div.fill', {}, 'Hold to Delete'); const hold = h('button.rc-hold', {}, 'Hold to Delete', fill); let hp = 0, holding = false, raf = 0;
  const holdTick = () => { hp = clamp(hp + (holding ? 0.022 : -0.06), 0, 1); fill.style.clipPath = `inset(0 ${100 - hp * 100}% 0 0)`; if (hp >= 1) { holding = false; hp = 0; fill.style.clipPath = 'inset(0 100% 0 0)'; hold.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 250 }); toast('Deleted ✓'); deletedN++; } if (holding || hp > 0) raf = requestAnimationFrame(holdTick); else raf = 0; };
  let deletedN = 0; const startHold = () => { holding = true; if (!raf) raf = requestAnimationFrame(holdTick); }; const stopHold = () => { holding = false; };
  hold.addEventListener('pointerdown', startHold); ['pointerup', 'pointerleave'].forEach((ev) => hold.addEventListener(ev, stopHold));
  const cHold = card('Hold to Delete', 'October 2025', h('div.rc-body', { style: { minHeight: '170px', background: 'radial-gradient(circle at 50% 120%,#f3f3f3,#fff 70%)' } }, hold));
  const grid = h('div.rc-grid', {}, h('div.rc-col', {}, cPosters, cPhone, cIcons), h('div.rc-col', {}, cDock, cNov, cTest), h('div.rc-col', {}, cAgent, cCombo, cHold));
  root.append(h('div.rc-top', {}, bar), grid);
  window.__demoProof = async () => {
    const res = [];
    setView('one'); await sleep(120); setView('two'); await sleep(120); setView('grid'); res.push('view one→two→grid');
    const r = dock.getBoundingClientRect(); dock.dispatchEvent(new PointerEvent('pointermove', { clientX: r.left + r.width * 0.4, clientY: r.top + 40 })); await sleep(100); const big = parseFloat(dockIcons[3].style.width) > 50; magnify(null); res.push('dock magnify ' + big);
    setUnlock(true); await sleep(200); res.push('unlock ' + unlocked); lock();
    inp.value = 'an'; inp.dispatchEvent(new Event('input')); const n = ul.items.length; choose(ul.items[0]); res.push(`combobox ${n} hits → ${chosen}`); inp.value = ''; chosen = null; renderCb();
    const d0 = deletedN; startHold(); await sleep(1300); stopHold(); res.push('hold-delete ' + (deletedN > d0));
    stickers[0].x += 40; resetNov(); cycle(); await sleep(250); order = [0, 1, 2]; layoutT(); res.push('stickers+testimonials');
    postersAll()[2].classList.add('big'); await sleep(150); postersAll()[2].classList.remove('big');
    return res.join(' · ') + ' · restored';
  };
};


// ---------- poke-holo: holographic trading card tilt (2026-10-05 20:00 KST)
V['pokeholo-holographic-card-tilt'] = (root, T) => {
  theme(root, T, { bg: '#33373f', fg: '#e8e8e8', ac: '#0aa5a5', dark: true });
  root.style.overflow = 'auto'; root.style.fontFamily = "'Roboto Flex Variable','Inter Variable',sans-serif";
  root.append(h('style', {}, `
    .ph{max-width:1040px;margin:0 auto;padding:40px 40px 120px;color:#e8e8e8;font:300 15px/1.55 'Roboto Flex Variable',sans-serif}
    .ph .top{display:grid;grid-template-columns:1fr 300px;gap:40px;align-items:start;min-height:420px}
    .ph h1{font:700 32px/1.1 'Roboto Flex Variable';font-stretch:80%;margin:0 0 40px;color:#fff}.ph h1 sup{font-size:12px;font-weight:400;margin-left:6px}
    .ph .by{font-size:13px;margin-bottom:40px}.ph .by a{color:#5ad4e6;font-style:italic;text-decoration:underline;margin:0 4px}
    .ph mark{background:#0d6e6e;color:#fff;font-weight:700;font-style:italic;padding:0 4px;border-radius:3px}
    .ph .cta{font:300 19px 'Roboto Flex Variable';margin:44px 0 12px;color:#fff;border-bottom:1px solid #fff3;padding-bottom:14px}
    .ph .small{font-size:11px;color:#ccc}
    .ph .search{margin:60px 0 10px;width:350px;display:flex;align-items:center;background:#2a2d34;border:1px solid #fff1;border-radius:8px;box-shadow:0 4px 18px #0004;padding:0 12px}
    .ph .search input{all:unset;flex:1;height:44px;font-size:16px;color:#ddd}.ph .search input::placeholder{color:#888}
    .ph h2{font:700 20px 'Roboto Flex Variable';font-stretch:85%;color:#fff;margin:64px 0 4px}.ph .sub{font-style:italic;font-size:13px;color:#ddd;margin:0 0 22px}
    .ph .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:28px}
    .ph .hint{position:fixed;right:24px;bottom:22px;background:#4fd3ea;color:#0b2b33;font-weight:600;border-radius:20px;padding:7px 16px;font-size:13px;cursor:pointer;z-index:5;box-shadow:0 2px 10px #0006}
    .pc{--mx:50%;--my:50%;--rx:0deg;--ry:0deg;--o:0;--bgx:50%;--bgy:50%;--s:1;--tx:0px;--ty:0px;aspect-ratio:.716;perspective:600px;position:relative;cursor:pointer;z-index:1}
    .pc .rot{position:absolute;inset:0;transform:translate(var(--tx),var(--ty)) scale(var(--s)) rotateY(var(--rx)) rotateX(var(--ry));transform-style:preserve-3d;border-radius:4.5% / 3.5%;will-change:transform;box-shadow:0 10px 20px -5px #000a}
    .pc.act .rot{box-shadow:0 0 6px 2px var(--glow,#fff8),0 0 22px 8px var(--glow,#fff4),0 30px 50px -10px #000c}
    .pc .face{position:absolute;inset:0;border-radius:inherit;overflow:hidden;background:var(--frame,#e9d36a);padding:5.5% 5%;display:flex;flex-direction:column}
    .pc .hd{display:flex;align-items:baseline;gap:5px;font:800 9.5px/1 'Inter Variable';color:#111;padding:2px 2px 4px}.pc .hd b{font-size:12px}.pc .hd .hp{margin-left:auto;font-size:12px}.pc .hd .hp small{font-size:7px;margin-right:2px}
    .pc .bas{font:700 6px 'Inter Variable';background:linear-gradient(#fff,#bbb);border-radius:6px;padding:1px 4px;color:#333}
    .pc .art{height:46%;border:3px solid #c9c9c9;box-shadow:inset 0 0 0 1px #0003;background:var(--art);position:relative;overflow:hidden}
    .pc .art i{position:absolute;border-radius:50%;filter:blur(.3px)}
    .pc .info{font:italic 600 5.5px 'Inter Variable';background:linear-gradient(90deg,#c9a83a,#f3e39a,#c9a83a);margin:3px 6px;text-align:center;color:#333;padding:1px}
    .pc .atk{flex:1;display:flex;flex-direction:column;justify-content:center;gap:6px;padding:4px 4px 0;color:#111}
    .pc .atk div{display:flex;align-items:center;gap:5px;font:700 10px 'Inter Variable'}.pc .atk div span{margin-left:auto;font-size:12px}
    .pc .atk p{font:400 6.5px/1.3 'Inter Variable';margin:0}
    .pc .en{width:10px;height:10px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff8,var(--en,#f5c400) 60%);border:1px solid #0004;display:inline-block;flex:none}
    .pc .ft{display:flex;justify-content:space-between;font:600 5px 'Inter Variable';color:#333;border-top:1px solid #0002;padding-top:3px}
    .pc .shine,.pc .glare{position:absolute;inset:0;border-radius:inherit;pointer-events:none;transform:translateZ(1px)}
    .pc .glare{background:radial-gradient(farthest-corner circle at var(--mx) var(--my),#ffffffcc 8%,#ffffff55 22%,#0000 60%);mix-blend-mode:overlay;opacity:calc(var(--o) * .9)}
    .pc[data-r=common] .shine{display:none}
    .pc[data-r=holo] .shine{background:repeating-linear-gradient(110deg,#ff0080 0%,#ff8c00 4%,#ffe600 8%,#00ff8c 12%,#00c8ff 16%,#8000ff 20%,#ff0080 24%);background-size:400% 400%;background-position:var(--bgx) var(--bgy);mix-blend-mode:color-dodge;opacity:calc(var(--o) * .55);filter:brightness(.7) contrast(1.4) saturate(1.2);clip-path:inset(10% 8% 52% 8%)}
    .pc[data-r=rainbow] .shine{background:repeating-linear-gradient(-45deg,#ff2a6d 0 5%,#ffd319 5% 10%,#3cff9e 10% 15%,#2ab7ff 15% 20%,#b45cff 20% 25%),repeating-linear-gradient(45deg,#0000 0 3px,#fff3 3px 4px);background-size:300% 300%,auto;background-position:var(--bgx) var(--bgy),0 0;mix-blend-mode:color-dodge;opacity:calc(.25 + var(--o) * .6);filter:brightness(.6) contrast(1.6) saturate(1.4)}
    .pc[data-r=gold] .shine{background:radial-gradient(circle at var(--mx) var(--my),#fff6,#0000 40%),repeating-linear-gradient(120deg,#8a6a10 0%,#ffe9a0 6%,#b8901c 12%,#fff4c8 18%,#8a6a10 24%);background-size:auto,300% 300%;background-position:0 0,var(--bgx) var(--bgy);mix-blend-mode:color-dodge;opacity:calc(.18 + var(--o) * .42);filter:contrast(1.3)}
    .pc[data-r=gold] .face{background:linear-gradient(135deg,#a8862b,#f6e7a6,#b99331,#fff1c2,#a07c22)}
    .pc[data-r=gold] .art{border-color:#d9bf6a}
    .ph-dim{position:fixed;inset:38px 0 0;background:#000a;backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .35s;z-index:20}.ph-dim.on{opacity:1;pointer-events:auto}
    .pc.pop{z-index:30}
    .ph .tag{position:absolute;left:8px;top:-22px;font:600 10px 'Inter Variable';letter-spacing:.06em;text-transform:uppercase;color:#9aa}
  `));
  const MON = [
    { n: 'Pikachu', hp: 70, t: 'Lightning', en: '#f5c400', art: 'linear-gradient(160deg,#ffe36e,#ff7ab6 45%,#7a5cff)', blobs: ['#ffd400', '#ff4f9a', '#5b3fd1'], atk: 'Wild Charge', dmg: 90, glow: '#ffe14a', r: 'gold' },
    { n: 'Charizard', hp: 180, t: 'Fire', en: '#f2552c', art: 'linear-gradient(160deg,#ffb45c,#e2401f 55%,#5a1206)', blobs: ['#ff8a00', '#ffd27a', '#8e1d05'], atk: 'Burning Dark', dmg: 180, glow: '#ff7a3d', r: 'rainbow' },
    { n: 'Gyarados', hp: 160, t: 'Water', en: '#2e8ef0', art: 'linear-gradient(170deg,#9fe8ff,#2a7ad6 55%,#0b2a66)', blobs: ['#3cc3ff', '#fff', '#1a3fa0'], atk: 'Tidal Rage', dmg: 140, glow: '#59c7ff', r: 'holo' },
    { n: 'Venusaur', hp: 190, t: 'Grass', en: '#3cb04a', art: 'linear-gradient(160deg,#d9ff9c,#3fa24a 55%,#103d1c)', blobs: ['#ff7aa8', '#9be36b', '#1d6b2c'], atk: 'Solar Beam', dmg: 160, glow: '#7dff8a', r: 'holo' },
    { n: 'Mewtwo', hp: 130, t: 'Psychic', en: '#a64bd6', art: 'linear-gradient(160deg,#f1c4ff,#9b4bd8 55%,#2c0b4f)', blobs: ['#ffb3ff', '#7b2fd0', '#fff'], atk: 'Psystrike', dmg: 150, glow: '#d68bff', r: 'rainbow' },
    { n: 'Eevee', hp: 60, t: 'Colorless', en: '#ddd', art: 'linear-gradient(160deg,#fff2d6,#c8955a 60%,#5e3a1a)', blobs: ['#f7d29a', '#8a5a2b', '#fff'], atk: 'Tackle', dmg: 30, glow: '#fff', r: 'common' },
    { n: 'Snorlax', hp: 150, t: 'Colorless', en: '#ddd', art: 'linear-gradient(160deg,#cdeeff,#5a8fa8 60%,#1d3a4a)', blobs: ['#f6e3c3', '#2f5f73', '#fff'], atk: 'Body Slam', dmg: 80, glow: '#fff', r: 'common' },
    { n: 'Gengar', hp: 130, t: 'Psychic', en: '#a64bd6', art: 'linear-gradient(160deg,#c8a8ff,#4b2a8a 55%,#120526)', blobs: ['#ff3d6e', '#7a4bd1', '#2b1252'], atk: 'Shadow Ball', dmg: 120, glow: '#b07bff', r: 'gold' },
    { n: 'Lapras', hp: 110, t: 'Water', en: '#2e8ef0', art: 'linear-gradient(170deg,#e0fbff,#56b6e8 55%,#14507a)', blobs: ['#5ad0ff', '#f0e6c8', '#1b5f9a'], atk: 'Ice Beam', dmg: 70, glow: '#9ae5ff', r: 'common' },
    { n: 'Dragonite', hp: 170, t: 'Dragon', en: '#c9a227', art: 'linear-gradient(160deg,#ffe6a8,#ef9a2b 55%,#4c2a08)', blobs: ['#ffb84a', '#7fd0ff', '#a3560c'], atk: 'Dragon Rush', dmg: 170, glow: '#ffd27a', r: 'rainbow' },
    { n: 'Lucario', hp: 120, t: 'Fighting', en: '#b5532a', art: 'linear-gradient(160deg,#cfe3ff,#3a65b8 55%,#111c3d)', blobs: ['#1f2f6b', '#ffcf3a', '#9fc4ff'], atk: 'Aura Sphere', dmg: 110, glow: '#7ab0ff', r: 'holo' },
    { n: 'Jigglypuff', hp: 60, t: 'Colorless', en: '#ddd', art: 'linear-gradient(160deg,#fff,#ffb0d0 55%,#d04b86)', blobs: ['#ffc3dd', '#5fd0ff', '#fff'], atk: 'Sing', dmg: 20, glow: '#ffc3dd', r: 'common' }];
  const R = rng(7);
  const cards = [];
  const mk = (m, big) => {
    const blobs = m.blobs.map((c, i) => h('i', { style: { background: c, width: `${30 + R() * 50}%`, aspectRatio: '1', left: `${R() * 70}%`, top: `${R() * 60}%`, opacity: i ? .75 : .95, filter: `blur(${i ? 6 : 1}px)` } }));
    const face = h('div.face', {}, h('div.hd', {}, h('span.bas', {}, 'BASIC'), h('b', {}, m.n), h('span.hp', {}, h('small', {}, 'HP'), m.hp), h('span.en', { style: { '--en': m.en } })),
      h('div.art', { style: { '--art': m.art } }, ...blobs, h('i', { style: { left: '38%', top: '30%', width: '24%', aspectRatio: '1', background: 'radial-gradient(circle at 40% 35%,#fff,#0000 60%)', filter: 'none' } })),
      h('div.info', {}, `NO. ${String(25 + cards.length * 13).padStart(4, '0')}  ${m.t} Pokémon  HT: 1'04"  WT: 13.2 lbs`),
      h('div.atk', {}, h('div', {}, h('span.en', { style: { '--en': m.en } }), h('span.en', { style: { '--en': '#ddd' } }), m.atk, h('span', {}, m.dmg)), h('p', {}, `This Pokémon also does 30 damage to itself. Flip a coin. If heads, your opponent's Active Pokémon is now Paralyzed.`)),
      h('div.ft', {}, h('span', {}, 'weakness ×2'), h('span', {}, 'resistance'), h('span', {}, 'retreat ●'), h('span', {}, `${String(cards.length + 1).padStart(3, '0')}/159 ★`)));
    const el = h('div.pc', { 'data-r': m.r, style: { '--glow': m.glow } }, h('div.rot', {}, face, h('div.shine'), h('div.glare')));
    const st = { rx: 0, ry: 0, mx: 50, my: 50, o: 0, s: 1, tx: 0, ty: 0, trx: 0, try: 0, tmx: 50, tmy: 50, to: 0, ts: 1, ttx: 0, tty: 0, vrx: 0, vry: 0, raf: 0, popped: false, auto: 0 };
    const apply = () => { el.style.setProperty('--rx', st.rx.toFixed(2) + 'deg'); el.style.setProperty('--ry', st.ry.toFixed(2) + 'deg'); el.style.setProperty('--mx', st.mx.toFixed(1) + '%'); el.style.setProperty('--my', st.my.toFixed(1) + '%'); el.style.setProperty('--o', st.o.toFixed(3)); el.style.setProperty('--bgx', (37 + st.mx * 0.26).toFixed(1) + '%'); el.style.setProperty('--bgy', (33 + st.my * 0.34).toFixed(1) + '%'); el.style.setProperty('--s', st.s.toFixed(3)); el.style.setProperty('--tx', st.tx.toFixed(1) + 'px'); el.style.setProperty('--ty', st.ty.toFixed(1) + 'px'); };
    const tick = () => { // spring (stiffness .066, damping .25 like the original svelte springs)
      let moving = false;
      for (const k of ['rx', 'ry', 'mx', 'my', 'o', 's', 'tx', 'ty']) { const tk = 't' + k, vk = 'v' + k; st[vk] = ((st[vk] || 0) + (st[tk] - st[k]) * 0.08) * 0.78; st[k] += st[vk]; if (Math.abs(st[tk] - st[k]) > 0.01 || Math.abs(st[vk]) > 0.01) moving = true; }
      apply(); st.raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!st.raf) st.raf = requestAnimationFrame(tick); };
    const point = (px, py) => { st.tmx = px * 100; st.tmy = py * 100; st.trx = (px - 0.5) * 30; st.try = -(py - 0.5) * 30; st.to = 1; el.classList.add('act'); kick(); };
    const rest = () => { if (st.popped) return; st.tmx = 50; st.tmy = 50; st.trx = 0; st.try = 0; st.to = 0; el.classList.remove('act'); kick(); };
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); point(clamp((e.clientX - r.left) / r.width, 0, 1), clamp((e.clientY - r.top) / r.height, 0, 1)); });
    el.addEventListener('pointerleave', rest);
    el.addEventListener('click', () => (st.popped ? unpop() : pop(el)));
    const c = { el, st, point, rest, kick, m }; el._c = c; cards.push(c); return c;
  };
  const dim = h('div.ph-dim', { onclick: () => unpop() });
  let popped = null, spin = 0;
  const pop = (el) => { unpop(); const c = el._c; const r = el.getBoundingClientRect(); const W = root.clientWidth, H = root.clientHeight, rr = root.getBoundingClientRect(); const sc = Math.min((H * 0.8) / r.height, 2.6); c.st.popped = true; c.st.ts = sc; c.st.ttx = rr.left + W / 2 - (r.left + r.width / 2); c.st.tty = rr.top + H / 2 - (r.top + r.height / 2); c.st.trx = 360; c.st.rx = 0; c.st.to = 1; el.classList.add('pop', 'act'); dim.classList.add('on'); popped = c; c.kick(); setTimeout(() => { if (popped === c) { c.st.rx -= 360; c.st.trx = 0; } }, 900); };
  const unpop = () => { if (!popped) return; const c = popped; popped = null; c.st.popped = false; c.st.ts = 1; c.st.ttx = 0; c.st.tty = 0; dim.classList.remove('on'); c.el.classList.remove('act'); c.rest(); setTimeout(() => c.el.classList.remove('pop'), 600); };
  root.addEventListener('pointermove', (e) => { if (!popped) return; const W = innerWidth, H = innerHeight; popped.point(clamp(e.clientX / W, 0, 1), clamp(e.clientY / H, 0, 1)); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') unpop(); });
  const hero = mk(MON[0]); hero.el.style.width = '300px';
  // idle showcase: hero card wobbles until the user touches it
  let idle = true; const idleT = () => { if (!idle) return; const t = performance.now() / 1000; hero.point(0.5 + Math.sin(t * 0.9) * 0.35, 0.5 + Math.cos(t * 0.7) * 0.3); requestAnimationFrame(idleT); };
  hero.el.addEventListener('pointerenter', () => { idle = false; }); requestAnimationFrame(idleT);
  const sections = [
    ['Common & Uncommon', 'All cards get a 3d rotation with CSS based on the cursor position. The default basic non-holo cards simply apply a flare/glare effect to the card which follows the mouse.', 'common'],
    ['Holofoil', 'The holo foil sits only on the illustration window — a repeating rainbow linear-gradient with mix-blend-mode: color-dodge whose background-position follows the pointer.', 'holo'],
    ['Rainbow Rare', 'The whole card is foiled: two layered repeating gradients (diagonal rainbow + fine etched lines) shifting against each other.', 'rainbow'],
    ['Secret Gold', 'Gold frame, metallic sweep and a pointer-following spotlight — the rarest preset.', 'gold']];
  const grids = {};
  const q = h('input', { placeholder: 'eg: Morpeko or Marnie', oninput: () => filter() });
  const filter = () => { const v = q.value.trim().toLowerCase(); cards.forEach((c) => { if (c === hero) return; c.el.style.display = !v || c.m.n.toLowerCase().includes(v) || c.m.t.toLowerCase().includes(v) ? '' : 'none'; }); };
  const wrap = h('div.ph', {},
    h('div.top', {}, h('div', {}, h('h1', {}, 'Pokemon Cards', h('sup', {}, 'V2')), h('div.by', {}, 'By ', h('a', {}, '@simeydotme'), '|', h('a', {}, 'Simon Goellner')),
      h('p', {}, 'A collection of ', h('mark', {}, 'advanced CSS'), ' styles to create ', h('mark', {}, 'realistic-looking effects'), ' for the faces of Pokemon cards. The cards use ', h('mark', {}, '3d transforms'), ', ', h('mark', {}, 'filters'), ', ', h('mark', {}, 'blend modes'), ', ', h('mark', {}, 'css gradients'), ' and interactions to provide a unique experience when taking a closer look!'),
      h('div.cta', {}, 'Click on a Card to take a Closer look!'),
      h('div.small', {}, 'Pointer position is written to CSS custom properties (--mx, --my, --rx, --ry) on every move; a spring eases each value, which in turn drives the 3d transform and every shine layer. (clone practice — art is CSS-only)')), hero.el),
    h('div.search', {}, q, h('span', { style: { opacity: .6 } }, '⌕')), h('div', { style: { fontSize: '13px' } }, 'Browse cards below, Or search for your favourite!'),
    ...sections.flatMap(([t, d, r]) => { const g = h('div.grid'); grids[r] = g; MON.filter((m) => m.r === r && m !== MON[0]).forEach((m) => g.append(mk(m).el)); return [h('h2', {}, t), h('p.sub', {}, d), g]; }));
  root.append(wrap, dim, h('div.hint', { onclick: () => root.scrollTo({ top: 0, behavior: 'smooth' }) }, 'Back to Top'));
  apply0(); function apply0() { cards.forEach((c) => c.kick()); }
  window.__demoProof = async () => {
    idle = false; const c = cards.find((x) => x.m.r === 'rainbow'); c.point(0.85, 0.2); await sleep(500);
    const rx = parseFloat(c.el.style.getPropertyValue('--rx')), o = parseFloat(c.el.style.getPropertyValue('--o')); c.rest();
    pop(c.el); await sleep(700); const s1 = parseFloat(c.el.style.getPropertyValue('--s')); const dimOn = dim.classList.contains('on'); unpop(); await sleep(500);
    q.value = 'char'; filter(); const vis = cards.filter((x) => x !== hero && x.el.style.display !== 'none').length; q.value = ''; filter();
    idle = true; requestAnimationFrame(idleT);
    return `tilt rx=${rx.toFixed(1)}° glare=${o.toFixed(2)}; pop scale=${s1.toFixed(2)} dim=${dimOn}; search "char" → ${vis} card; rarities=${Object.keys(grids).join('/')}`;
  };
};

V['animejs-live-feature-demo-home'] = (root, T) => {
  theme(root, T, { bg: '#252423', fg: '#f6f4f2', ac: '#ff4b4b', dark: true });
  const G = "'Space Grotesk Variable','Inter Variable',sans-serif", M = "'JetBrains Mono Variable',monospace";
  const BG = '#252423', RED = '#ff4b4b', LINE = '#3a3836';
  root.classList.add('scroll'); Object.assign(root.style, { overflow: 'auto', background: BG, color: '#f6f4f2', fontFamily: G });
  root.append(h('style', {}, `.aj-nav a{color:#d8d5d2;font:600 11px ${M};letter-spacing:.08em;text-decoration:none;cursor:pointer;display:flex;gap:6px;align-items:center}.aj-nav a:hover{color:#fff}.aj-sec{max-width:1100px;margin:0 auto;padding:90px 48px;display:grid;grid-template-columns:360px 1fr;gap:56px;align-items:center;border-top:1px solid ${LINE}}.aj-h{font-size:40px;font-weight:700;line-height:1.02;letter-spacing:-.02em;margin:0 0 16px}.aj-p{color:#b9b5b1;font-size:16px;line-height:1.5}.aj-code{font:12.5px/1.65 ${M};background:#1d1c1b;border:1px solid ${LINE};border-radius:6px;padding:14px 16px;color:#d8d5d2;white-space:pre;margin-top:18px;overflow-x:auto}.aj-code b{color:#ff8a6b;font-weight:400}.aj-code i{color:#8fd19e;font-style:normal}.aj-stage{background:#1d1c1b;border:1px solid ${LINE};border-radius:10px;height:340px;position:relative;overflow:hidden}.aj-tag{position:absolute;left:14px;top:12px;font:11px ${M};color:#8a8580;letter-spacing:.06em}.aj-btn{font:600 11px ${M};letter-spacing:.08em;color:#d8d5d2;border:1px solid #57534f;background:transparent;border-radius:4px;padding:0 16px;height:46px;cursor:pointer;display:inline-flex;align-items:center;gap:10px}`));
  // ---- nav (sticky, blurs on scroll)
  const verBtn = h('a', {}, 'V4.2.2 ▾'); const verMenu = h('div', { style: { position: 'absolute', top: '44px', right: '0', background: '#1d1c1b', border: `1px solid ${LINE}`, borderRadius: '6px', padding: '6px', display: 'none', minWidth: '140px', zIndex: 30 } }, ...['v4.2.2 (latest)', 'v4.1.0', 'v3.2.2 (legacy)'].map((v, i) => h('div', { style: { padding: '8px 10px', font: `12px ${M}`, color: i ? '#b9b5b1' : '#fff', cursor: 'pointer', borderRadius: '4px' }, onclick: () => { verBtn.textContent = v.split(' ')[0].toUpperCase() + ' ▾'; verMenu.style.display = 'none'; toast(`Docs switched to ${v}`); } }, v)));
  verBtn.onclick = () => (verMenu.style.display = verMenu.style.display === 'none' ? 'block' : 'none');
  const nav = h('div.aj-nav', { style: { position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: '28px', padding: '0 22px', height: '52px', transition: 'background .3s, backdrop-filter .3s, border-color .3s', borderBottom: '1px solid transparent' } },
    h('div', { style: { fontWeight: 800, fontSize: '19px', letterSpacing: '-.03em', fontStyle: 'italic' } }, 'anime', h('span', { style: { fontWeight: 400 } }, 'js'), h('sup', { style: { color: RED, fontSize: '10px' } }, '●')), h('span', { style: { flex: 1 } }),
    h('div', { style: { position: 'relative' } }, verBtn, verMenu), h('a', {}, '▭ DOCS'), h('a', {}, '∫ EASINGS'), h('a', {}, '▷ LEARN'), h('a', {}, '◇'), h('a', {}, '⌥'), h('a', { style: { background: '#4a2324', color: RED, padding: '9px 12px', borderRadius: '4px' } }, '♥ SPONSOR'));
  root.addEventListener('scroll', () => { const on = root.scrollTop > 12; nav.style.background = on ? '#252423b3' : 'transparent'; nav.style.backdropFilter = nav.style.webkitBackdropFilter = on ? 'blur(14px) saturate(1.4)' : 'none'; nav.style.borderBottomColor = on ? LINE : 'transparent'; });
  // ---- hero: rotating multicolour rings + stagger diamond + dotted wave
  const R = 300, ARC = ['#ff4b4b', '#ff9f2e', '#33e27a', '#18d9d9', '#3b82ff', '#2bd1a0', '#f5d02b', '#7be04b'];
  const arcPath = (r, a0, a1) => { const p = (a) => [R + r * Math.cos(a), R + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}`; };
  const outer = s('g', {}, ...ARC.map((c, i) => s('path', { d: arcPath(272, (i / 8) * Math.PI * 2 + 0.03, ((i + 1) / 8) * Math.PI * 2 - 0.03), stroke: c, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', style: `filter:drop-shadow(0 0 6px ${c})` })));
  const ticks = s('g', {}, ...Array.from({ length: 180 }, (_, i) => { const a = (i / 180) * Math.PI * 2, r0 = i % 5 ? 252 : 246; return s('line', { x1: R + r0 * Math.cos(a), y1: R + r0 * Math.sin(a), x2: R + 258 * Math.cos(a), y2: R + 258 * Math.sin(a), stroke: i > 20 && i < 60 ? '#ff6b5b' : '#5b5753', 'stroke-width': 1.2 }); }));
  const inner = s('g', {}, s('circle', { cx: R, cy: R, r: 236, fill: '#1e1d1c', stroke: '#3a3836', 'stroke-width': 2 }), s('path', { d: arcPath(222, 3.4, 4.6), stroke: '#6b6763', 'stroke-width': 14, fill: 'none', opacity: 0.6, 'stroke-linecap': 'round' }), s('path', { d: arcPath(214, 0.2, 1.4), stroke: '#ffb199', 'stroke-width': 3, fill: 'none' }), s('path', { d: arcPath(204, 0.3, 1.2), stroke: '#ffb199', 'stroke-width': 2, fill: 'none', opacity: 0.6 }), s('circle', { cx: R, cy: R, r: 196, fill: 'none', stroke: '#2f2d2b', 'stroke-width': 1 }));
  const lines = Array.from({ length: 56 }, (_, i) => { const y = R - 150 + i * (300 / 55); const half = 150 - Math.abs(y - R); return s('line', { x1: R - half, x2: R + half, y1: y, y2: y, stroke: '#e0473f', 'stroke-width': 2.2, opacity: 0.85, 'data-h': half }); });
  const dots = Array.from({ length: 34 }, () => s('circle', { r: 5.5, fill: '#ff3d3d', style: 'filter:drop-shadow(0 0 4px #ff3d3d)' }));
  const hero = s('svg', { viewBox: `0 0 ${R * 2} ${R * 2}`, style: 'width:min(560px,46vw);height:auto;display:block;cursor:pointer' }, s('g', { id: 'aj-outer' }, outer), ticks, inner, ...lines, ...dots);
  let t0 = performance.now(), burst = 0;
  hero.addEventListener('click', () => { burst = performance.now(); });
  const npm = h('button.aj-btn', { onclick: () => copy('npm i animejs', 'npm i animejs copied'), style: { background: '#2f2d2b', borderColor: '#2f2d2b', textTransform: 'none', fontWeight: 400, fontSize: '13px' } }, 'npm i animejs', h('span', { style: { opacity: 0.7 } }, '⧉'));
  const learn = h('button.aj-btn', { onclick: () => secs[0].scrollIntoView({ behavior: 'smooth' }) }, 'LEARN MORE', h('span', {}, '↓'));
  const word = h('h1', { style: { fontSize: '68px', fontWeight: 700, lineHeight: 0.98, letterSpacing: '-.035em', margin: 0 } }, ...'All-in-one animation engine.'.split(' ').map((w, i) => h('span', { style: { display: 'inline-block', marginRight: '.22em', opacity: 0, transform: 'translateY(40px)' } }, w)));
  const heroEl = h('div', { style: { position: 'relative', minHeight: 'calc(100% - 52px)', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '0 44px 30px', marginTop: '-10px' } },
    h('div', { style: { alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 0 10px', maxWidth: '320px' } }, h('div', {}, word, h('p', { style: { fontSize: '19px', color: '#e2dfdc', lineHeight: 1.35, marginTop: '14px' } }, 'A fast and flexible JavaScript library to animate the web.')), h('div', { style: { display: 'flex', gap: '10px' } }, npm, learn)),
    hero, h('div', { style: { alignSelf: 'end', justifySelf: 'end', textAlign: 'center', font: `11px ${G}`, color: '#8a8580' } }, 'Sponsored by', h('div', { style: { width: '34px', height: '34px', border: '1px solid #8a8580', borderRadius: '6px', margin: '8px auto 0' } })));
  [...word.children].forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(40px) rotate(4deg)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 120 + i * 90, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }));
  const heroLoop = (now) => { if (!root.isConnected) return; const t = (now - t0) / 1000, b = burst ? Math.max(0, 1 - (now - burst) / 1200) : 0;
    root.querySelector('#aj-outer')?.setAttribute('transform', `rotate(${(t * 12) % 360} ${R} ${R})`); ticks.setAttribute('transform', `rotate(${-(t * 5) % 360} ${R} ${R})`);
    lines.forEach((l, i) => { const hf = +l.getAttribute('data-h'); const k = 0.55 + 0.45 * Math.sin(t * 2.2 - i * 0.22) + b * Math.sin(i * 0.9) * 0.4; l.setAttribute('x1', R - hf * k); l.setAttribute('x2', R + hf * k); });
    dots.forEach((d, i) => { const u = i / 33 - 0.5; const x = R + u * 320, y = R - u * 210 + Math.sin(t * 3 - i * 0.35) * (14 + b * 40); d.setAttribute('cx', x); d.setAttribute('cy', y); });
    requestAnimationFrame(heroLoop); };
  requestAnimationFrame(heroLoop);
  // ---- feature sections
  const secs = [];
  const section = (title, body, code, stage) => { const el = h('section.aj-sec', {}, h('div', {}, h('h2.aj-h', {}, title), h('p.aj-p', {}, body), code ? h('div.aj-code', { html: code }) : null), stage); secs.push(el); return el; };
  // 1 intuitive API
  const sq = Array.from({ length: 6 }, (_, i) => h('div', { style: { width: '40px', height: '40px', borderRadius: '6px', background: ARC[i], position: 'absolute', left: '40px', top: `${44 + i * 46}px` } }));
  const s1 = h('div.aj-stage', {}, h('div.aj-tag', {}, 'animate()'), ...sq);
  sq.forEach((el, i) => el.animate([{ transform: 'translateX(0) rotate(0)' }, { transform: 'translateX(min(30vw,420px)) rotate(1turn)' }], { duration: 1250, delay: i * 65, easing: 'cubic-bezier(.86,0,.07,1)', iterations: Infinity, direction: 'alternate' }));
  // 2 stagger grid
  const COLS = 17, ROWSN = 9; const cells = [];
  const gridEl = h('div', { style: { position: 'absolute', inset: '40px 30px 24px', display: 'grid', gridTemplateColumns: `repeat(${COLS},1fr)`, placeItems: 'center' } });
  for (let i = 0; i < COLS * ROWSN; i++) { const c = h('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#4b4744', cursor: 'pointer' }, onclick: () => ripple(i) }); cells.push(c); gridEl.append(c); }
  const ripple = (from) => { const fx = from % COLS, fy = Math.floor(from / COLS); cells.forEach((c, i) => { const x = i % COLS, y = Math.floor(i / COLS), d = Math.hypot(x - fx, y - fy); c.animate([{ transform: 'scale(1)', background: '#4b4744' }, { transform: 'scale(1.9) translateY(-6px)', background: ARC[Math.floor(d) % 8] }, { transform: 'scale(1)', background: '#4b4744' }], { duration: 900, delay: d * 55, easing: 'cubic-bezier(.34,1.56,.64,1)' }); }); };
  const s2 = h('div.aj-stage', {}, h('div.aj-tag', {}, 'stagger(50, { grid: [17, 9], from: index }) — click a dot'), gridEl);
  // 3 svg toolset: line drawing + morph
  const P1 = 'M60 220 C120 60 220 60 280 160 S440 300 520 120', SH = [[[310, 60], [380, 120], [370, 210], [290, 230], [250, 140]], [[320, 50], [400, 90], [400, 210], [300, 250], [240, 150]], [[300, 70], [420, 150], [340, 240], [260, 230], [280, 100]]];
  const path = s('path', { d: P1, fill: 'none', stroke: '#33e27a', 'stroke-width': 4, 'stroke-linecap': 'round' });
  const poly = s('polygon', { points: SH[0].join(' '), fill: '#3b82ff33', stroke: '#3b82ff', 'stroke-width': 3 });
  const runner = s('circle', { r: 8, fill: '#ff4b4b' });
  const s3svg = s('svg', { viewBox: '0 0 580 300', style: 'position:absolute;inset:30px 10px 10px;width:calc(100% - 20px);height:calc(100% - 40px)' }, poly, path, runner);
  const s3 = h('div.aj-stage', { style: { cursor: 'pointer' }, onclick: () => drawSvg() }, h('div.aj-tag', {}, 'svg.createDrawable() · svg.morphTo() · svg.createMotionPath()'), s3svg);
  let morphI = 0, drawn = false;
  const drawSvg = () => { drawn = true; const L = path.getTotalLength(); path.style.strokeDasharray = L; path.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1600, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }); const a = SH[morphI % 3], b2 = SH[(morphI + 1) % 3]; morphI++; const st = performance.now(); const step = (now) => { const k = Math.min(1, (now - st) / 1600), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; poly.setAttribute('points', a.map((p, i) => [p[0] + (b2[i][0] - p[0]) * e, p[1] + (b2[i][1] - p[1]) * e].join(',')).join(' ')); const pt = path.getPointAtLength(L * e); runner.setAttribute('cx', pt.x); runner.setAttribute('cy', pt.y); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  // 4 springs: drag & snap back
  const ball = h('div', { style: { position: 'absolute', left: '50%', top: '50%', width: '74px', height: '74px', margin: '-37px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#ffd0c4,#ff4b4b 60%,#b52a2a)', boxShadow: '0 10px 30px #ff4b4b55', cursor: 'grab', touchAction: 'none' } });
  const tether = s('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#ff4b4b88', 'stroke-width': 2, 'stroke-dasharray': '4 5' });
  const s4svg = s('svg', { style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none' }, tether);
  let bx = 0, by = 0, vx = 0, vy = 0, held = false, stiff = 180, damp = 9;
  const s4 = h('div.aj-stage', {}, h('div.aj-tag', {}, 'createSpring({ stiffness, damping }) — drag the ball'), s4svg, ball);
  const sp = h('div', { style: { position: 'absolute', right: '14px', bottom: '12px', display: 'flex', gap: '14px', font: `11px ${M}`, color: '#8a8580' } }, h('label', {}, 'stiffness ', h('input', { type: 'range', min: 40, max: 400, value: stiff, oninput: (e) => (stiff = +e.target.value), style: { accentColor: RED, width: '90px' } })), h('label', {}, 'damping ', h('input', { type: 'range', min: 2, max: 30, value: damp, oninput: (e) => (damp = +e.target.value), style: { accentColor: RED, width: '90px' } })));
  s4.append(sp);
  drag(ball, { start: (e) => { held = true; ball.style.cursor = 'grabbing'; ball._o = { x: e.clientX - bx, y: e.clientY - by }; }, move: (e) => { bx = e.clientX - ball._o.x; by = e.clientY - ball._o.y; vx = vy = 0; }, end: () => { held = false; ball.style.cursor = 'grab'; } });
  let last = performance.now();
  const spring = (now) => { if (!root.isConnected) return; const dt = Math.min(0.033, (now - last) / 1000); last = now; if (!held) { vx += (-stiff * bx - damp * vx) * dt; vy += (-stiff * by - damp * vy) * dt; bx += vx * dt; by += vy * dt; } ball.style.transform = `translate(${bx}px,${by}px) scale(${1 + Math.min(0.25, Math.hypot(vx, vy) / 4000)})`; const r = s4.getBoundingClientRect(); tether.setAttribute('x1', r.width / 2); tether.setAttribute('y1', r.height / 2); tether.setAttribute('x2', r.width / 2 + bx); tether.setAttribute('y2', r.height / 2 + by); requestAnimationFrame(spring); };
  requestAnimationFrame(spring);
  // 5 scroll observer
  const bar = h('div', { style: { position: 'absolute', left: '30px', right: '30px', bottom: '40px', height: '4px', background: '#3a3836', borderRadius: '2px' } }, h('div', { style: { height: '100%', width: '0%', background: RED, borderRadius: '2px' } }));
  const shapes = ARC.slice(0, 5).map((c, i) => h('div', { style: { position: 'absolute', left: `${40 + i * 70}px`, top: '120px', width: '50px', height: '50px', background: c, borderRadius: i % 2 ? '50%' : '8px' } }));
  const pctEl = h('div', { style: { position: 'absolute', right: '30px', top: '12px', font: `11px ${M}`, color: '#d8d5d2' } }, '0%');
  const s5 = h('div.aj-stage', {}, h('div.aj-tag', {}, 'onScroll({ sync: true })'), ...shapes, bar, pctEl);
  root.addEventListener('scroll', () => { const r = s5.getBoundingClientRect(), vr = root.getBoundingClientRect(); const k = clamp((vr.bottom - r.top) / (vr.height + r.height), 0, 1); bar.firstChild.style.width = k * 100 + '%'; pctEl.textContent = Math.round(k * 100) + '%'; shapes.forEach((el, i) => (el.style.transform = `translate(${k * 220}px, ${Math.sin(k * Math.PI * 2 + i) * 50}px) rotate(${k * 360 * (i % 2 ? -1 : 1)}deg)`)); });
  root.append(nav, heroEl,
    section('Intuitive API', 'Animate faster with an easy-to-use, yet powerful animation API. Per-property parameters, flexible keyframes, built-in easings and more.', "<b>import</b> { animate, stagger } <b>from</b> <i>'animejs'</i>;\n\nanimate(<i>'.square'</i>, {\n  x: <i>'15rem'</i>, rotate: <i>'1turn'</i>,\n  duration: 1250, delay: stagger(65),\n  ease: <i>'inOutQuint'</i>,\n  loop: <b>true</b>, alternate: <b>true</b>\n});", s1),
    section('Staggering', 'Animate multiple elements with follow-through and overlapping actions using the built-in stagger utility — from the first, last, centre or any clicked index of a grid.', "animate(<i>'.dot'</i>, {\n  scale: [1, 1.9, 1],\n  delay: stagger(50, { grid: [17, 9], from: index })\n});", s2),
    section('SVG toolset', 'Morph shapes, follow motion paths and draw lines easily with the built-in SVG utilities. Plays when the stage scrolls into view — click to replay.', "animate(svg.createDrawable(<i>'.line'</i>), { draw: <i>'0 1'</i> });\nanimate(<i>'.shape'</i>, { points: svg.morphTo(<i>'.next'</i>) });", s3),
    section('Springs', 'Physics-based easing that reacts to velocity. Drag the ball and release it — the spring snaps it back with the stiffness and damping you set.', "animate(<i>'.ball'</i>, {\n  x: 0, y: 0,\n  ease: createSpring({ stiffness: 180, damping: 9 })\n});", s4),
    section('Scroll Observer', 'Synchronise and trigger animations on scroll with the Scroll Observer API. The progress bar below is driven by this section\u2019s position in the viewport.', "animate(<i>'.shape'</i>, {\n  x: <i>'14rem'</i>, rotate: 360,\n  autoplay: onScroll({ sync: <b>true</b> })\n});", s5),
    h('div', { style: { textAlign: 'center', padding: '50px 0 70px', borderTop: `1px solid ${LINE}`, color: '#8a8580', font: `12px ${M}` } }, 'anime.js-ish — a practice clone of animejs.com (v4 homepage)'));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !drawn) drawSvg(); }), { root, threshold: 0.4 }); io.observe(s3);
  window.__demoProof = async () => { burst = performance.now(); root.scrollTop = 40; root.dispatchEvent(new Event('scroll')); ripple(4 * COLS + 8); await sleep(700); const blurred = nav.style.backdropFilter.includes('blur'); return `scrolled → sticky nav blurred=${blurred}; stagger ripple fired from centre dot (${cells.length} dots); hero burst triggered`; };
};
V['cuberto-context-cursor-agency-home'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#000000', ac: '#000000', dark: false });
  root.classList.add('scroll'); root.style.overflow = 'auto';
  const F = "'Inter Variable',system-ui,sans-serif";
  root.append(h('style', {}, `.cb{position:relative;min-height:100%;background:#fff;color:#000;font:400 17px/1.4 ${F};cursor:none}.cb *{cursor:none!important}.cb a{color:inherit;text-decoration:none}.cb-w{max-width:1200px;margin:0 auto;padding:0 40px}.cb-nav{height:70px;display:flex;align-items:center;gap:36px;font-size:16px}.cb-logo{font:700 26px/1 ${F};letter-spacing:-.06em}.cb-nav .sp{flex:1}.cb .cb-pill{background:#000;color:#fff;border:0;border-radius:99px;padding:15px 25px;font:600 16px ${F};display:inline-block;transition:transform .25s cubic-bezier(.2,.8,.2,1)}.cb-hero{text-align:center;padding:90px 0 60px}.cb-hero h1{font:500 84px/1 ${F};letter-spacing:-.045em;margin:0 0 28px}.cb-ln{display:block;overflow:hidden;padding-bottom:.06em}.cb-ln span{display:inline-block;transform:translateY(105%);transition:transform 1s cubic-bezier(.2,.8,.2,1)}.cb.in .cb-ln span{transform:none}.cb-hero p{font-size:21px;max-width:600px;margin:0 auto;opacity:0;transform:translateY(20px);transition:1s .6s}.cb.in .cb-hero p{opacity:1;transform:none}.cb-reel{position:relative;border-radius:22px;overflow:hidden;height:560px;background:#2a5bdc}.cb-reel canvas,.cb-card canvas{position:absolute;inset:0;width:100%;height:100%}.cb-sec{padding:120px 0 0}.cb-h2{font:500 64px/1 ${F};letter-spacing:-.04em;margin:0 0 50px;display:flex;align-items:baseline;gap:18px}.cb-h2 sup{font-size:18px;letter-spacing:0;opacity:.5}.cb-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px 30px}.cb-card{display:block}.cb-card .m{position:relative;border-radius:18px;overflow:hidden;aspect-ratio:4/3;background:#eee}.cb-card .m .ps{position:absolute;left:16px;bottom:14px;font:600 12px ${F};color:#fff;background:#0006;padding:4px 10px;border-radius:99px;backdrop-filter:blur(6px)}.cb-card h3{font:500 22px ${F};margin:18px 0 4px;letter-spacing:-.02em}.cb-card .tg{opacity:.5;font-size:15px}.cb-srv{border-top:1px solid #0002}.cb-row{display:flex;align-items:center;justify-content:space-between;padding:34px 0;border-bottom:1px solid #0002;font:500 46px/1 ${F};letter-spacing:-.035em;transition:padding .4s,color .3s}.cb-row:hover{padding-left:24px;color:#5f5f5f}.cb-row small{font:400 16px ${F};opacity:.5;letter-spacing:0}.cb-prev{position:fixed;width:300px;height:210px;border-radius:14px;pointer-events:none;z-index:50;transform:translate(-50%,-50%) scale(.6);opacity:0;transition:opacity .3s,transform .3s;overflow:hidden}.cb-prev.on{opacity:1;transform:translate(-50%,-50%) scale(1)}.cb-quote{display:grid;grid-template-columns:1fr auto;gap:40px;align-items:end}.cb-quote blockquote{margin:0;font:400 36px/1.25 ${F};letter-spacing:-.025em;min-height:180px}.cb-arw{width:64px;height:64px;border-radius:50%;border:1px solid #0003;background:#fff;font-size:22px;margin-left:10px}.cb-faq div.q{display:flex;justify-content:space-between;padding:26px 0;border-bottom:1px solid #0002;font:500 26px ${F};letter-spacing:-.02em}.cb-faq .a{max-height:0;overflow:hidden;transition:max-height .45s cubic-bezier(.2,.8,.2,1);font-size:18px;color:#555}.cb-faq .o .a{max-height:160px}.cb-faq .o .pl{transform:rotate(45deg)}.cb-faq .pl{transition:transform .3s;font-weight:300}.cb-cta{background:#000;color:#fff;margin-top:140px;padding:120px 0 60px;border-radius:30px 30px 0 0}.cb-cta h2{font:500 92px/1 ${F};letter-spacing:-.05em;margin:0 0 50px}.cb-mag{width:190px;height:190px;border-radius:50%;background:#2a5bdc;color:#fff;border:0;font:600 18px ${F};transition:transform .3s cubic-bezier(.2,.8,.2,1)}.cb-cur{position:fixed;left:0;top:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#000;z-index:100;pointer-events:none;display:grid;place-items:center;transition:width .3s cubic-bezier(.2,.8,.2,1),height .3s cubic-bezier(.2,.8,.2,1),margin .3s,background .3s;color:#fff}.cb-cur.big{width:80px;height:80px;margin:-40px 0 0 -40px}.cb-cur.lg{width:110px;height:110px;margin:-55px 0 0 -55px;background:#fff;color:#000}.cb-cur.hide{opacity:0}.cb-cur svg{width:26px;height:26px;opacity:0;transform:scale(.4);transition:.25s}.cb-cur.big svg,.cb-cur.lg svg{opacity:1;transform:none}.cb-cur.txt{font:600 13px ${F}}.cb-modal{position:fixed;inset:38px 0 0 0;background:#000;z-index:80;display:none}.cb-modal.on{display:block}`));
  const page = h('div.cb'); root.append(page);
  // generated "videos": canvas loops that only advance while playing
  const vid = (draw, seed) => { const c = h('canvas'); const v = { c, t: seed * 3, playing: false, frames: 0 }; const R = () => { const r = c.getBoundingClientRect(); if (r.width && c.width !== Math.round(r.width)) { c.width = Math.round(r.width); c.height = Math.round(r.height); } }; v.tick = (dt) => { R(); if (v.playing) { v.t += dt; v.frames++; } draw(c.getContext('2d'), c.width, c.height, v.t); }; return v; };
  const VIDS = [];
  const reelDraw = (g, w, hh, t) => { const gr = g.createLinearGradient(0, 0, w, hh); gr.addColorStop(0, '#9fc3ff'); gr.addColorStop(1, '#2353d8'); g.fillStyle = gr; g.fillRect(0, 0, w, hh); for (let i = 0; i < 7; i++) { const x = ((i * 0.17 + t * 0.03) % 1.2 - 0.1) * w; const lg = g.createLinearGradient(x, 0, x + 120, 0); lg.addColorStop(0, '#ffffff00'); lg.addColorStop(0.5, '#ffffff40'); lg.addColorStop(1, '#ffffff00'); g.fillStyle = lg; g.fillRect(x, 0, 120, hh); } g.save(); g.translate(w * 0.5, hh * 0.55); g.rotate(-0.06 + Math.sin(t * 0.6) * 0.03); g.fillStyle = '#1238c8'; g.shadowColor = '#0005'; g.shadowBlur = 40; g.fillRect(-w * 0.21, -hh * 0.42, w * 0.42, hh * 0.95); g.shadowBlur = 0; g.fillStyle = '#e8eeff'; g.font = `300 ${hh * 0.07}px Inter Variable`; g.fillText('Experience Real', -w * 0.18, -hh * 0.28); g.fillText('Estate Ownership', -w * 0.18, -hh * 0.18); g.font = `300 ${hh * 0.045}px Inter Variable`; ['The Digital Twin Token is a unique', 'digital asset backed by property', 'data. Built for the next market.'].forEach((s0, i) => g.fillText(s0, -w * 0.18, hh * 0.02 + i * hh * 0.06)); g.strokeStyle = '#ffffff55'; g.lineWidth = 2; g.beginPath(); g.arc(w * 0.13, -hh * 0.33, hh * 0.08 + Math.sin(t * 2) * 6, 0, 7); g.stroke(); g.restore(); };
  const WORK = [['Riverside', 'AI audio & video editor — product design', ['#0e0e12', '#ff5a3c']], ['Magma', 'Real estate tokenisation platform — website', ['#1340d0', '#a9c6ff']], ['Zelt', 'HR & payroll SaaS — brand identity', ['#e9e2d6', '#141414']], ['Kelvin Zero', 'Passwordless security — web & motion', ['#101318', '#5ef0c0']]];
  const workDraw = (k) => (g, w, hh, t) => { const [a, b] = WORK[k][2]; g.fillStyle = a; g.fillRect(0, 0, w, hh); g.save(); g.translate(w / 2, hh / 2); if (k === 0) { for (let i = 0; i < 40; i++) { const x = (i - 20) * w / 44, v = (Math.sin(t * 3 + i * 0.5) * 0.5 + 0.5) * hh * 0.5 + 8; g.fillStyle = i % 5 ? b + '99' : b; g.fillRect(x, -v / 2, w / 70, v); } } else if (k === 1) { for (let i = 0; i < 5; i++) { g.rotate(t * 0.15); g.strokeStyle = b; g.lineWidth = 2; g.strokeRect(-hh * 0.1 * (i + 1), -hh * 0.07 * (i + 1), hh * 0.2 * (i + 1), hh * 0.14 * (i + 1)); } } else if (k === 2) { g.fillStyle = b; g.font = `600 ${hh * 0.35}px Inter Variable`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('zelt', Math.sin(t) * 20, 0); g.fillStyle = '#ff7a59'; g.beginPath(); g.arc(hh * 0.42 + Math.cos(t * 1.4) * 12, -hh * 0.18, hh * 0.06, 0, 7); g.fill(); } else { for (let i = 0; i < 9; i++) { g.strokeStyle = b; g.globalAlpha = 1 - i / 10; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, ((i * 22 + t * 40) % 200) + 10, 0, 7); g.stroke(); } g.globalAlpha = 1; } g.restore(); };
  // cursor
  const ICON = { arrow: '<path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" fill="none"/>', play: '<path d="M8 5l11 7-11 7z" fill="currentColor"/>', times: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8"/>', left: '<path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="1.8" fill="none"/>', right: '<path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="1.8" fill="none"/>' };
  const cur = h('div.cb-cur'); const prev = h('div.cb-prev'); page.append(cur, prev);
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, curKind = '';
  const setCursor = (el) => { const k = el?.dataset.cursor || ''; if (k === curKind) return; curKind = k; cur.className = 'cb-cur' + (k ? (k === 'play' || k === 'times' ? '.lg' : '.big').replace('.', ' ') : ''); cur.innerHTML = k && ICON[k] ? `<svg viewBox="0 0 24 24">${ICON[k]}</svg>` : k ? `<span>${k}</span>` : ''; if (k && !ICON[k]) cur.classList.add('txt'); cur.dataset.kind = k; };
  page.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; const t = e.target.closest?.('[data-cursor]'); setCursor(t); const m = e.target.closest?.('[data-magnetic]'); page.querySelectorAll('[data-magnetic]').forEach((b) => { if (b !== m) b.style.transform = ''; }); if (m) { const r = m.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); m.style.transform = `translate(${dx * 0.35}px,${dy * 0.35}px)`; } const sv = e.target.closest?.('.cb-row'); prev.classList.toggle('on', !!sv); if (sv) { prev.style.left = mx + 'px'; prev.style.top = my + 'px'; prev.style.background = sv.dataset.bg; } });
  page.addEventListener('pointerleave', () => { cur.classList.add('hide'); prev.classList.remove('on'); }); page.addEventListener('pointerenter', () => cur.classList.remove('hide'));
  // build page
  const nav = h('div.cb-w.cb-nav', {}, h('a.cb-logo', { href: '#', 'data-cursor': 'arrow' }, 'cuberto'), h('span.sp'), ...['Services', 'Projects', 'About', 'Blog'].map((t) => h('a', { href: '#', 'data-cursor': 'arrow', onclick: (e) => e.preventDefault() }, t)), h('a.cb-pill', { href: '#', 'data-cursor': 'arrow', 'data-magnetic': '', onclick: (e) => { e.preventDefault(); toast('Contacts (demo)'); } }, 'Contacts'));
  const hero = h('div.cb-w.cb-hero', {}, h('h1', {}, ...['Digital design &', 'development agency'].map((l, i) => h('span.cb-ln', {}, h('span', { style: { transitionDelay: i * 0.12 + 's' } }, l)))), h('p', {}, 'We design and build digital products, brands and websites for companies ready to move beyond the ordinary.'));
  const reelV = vid(reelDraw, 0); reelV.playing = true; VIDS.push(reelV);
  const modal = h('div.cb-modal', { 'data-cursor': 'times', onclick: () => closeReel() }); const modalV = vid(reelDraw, 2); modal.append(modalV.c); VIDS.push(modalV);
  const openReel = () => { modal.classList.add('on'); modalV.playing = true; setCursor(modal); }; const closeReel = () => { modal.classList.remove('on'); modalV.playing = false; setCursor(null); };
  const reel = h('div.cb-w', {}, h('div.cb-reel', { 'data-cursor': 'play', onclick: openReel }, reelV.c));
  const cards = WORK.map(([n, tg], k) => { const v = vid(workDraw(k), k); VIDS.push(v); const ps = h('span.ps', {}, '❚❚ paused'); const c = h('a.cb-card', { href: '#', 'data-cursor': 'View', onclick: (e) => e.preventDefault() }, h('div.m', {}, v.c, ps), h('h3', {}, n), h('div.tg', {}, tg)); c.addEventListener('pointerenter', () => { v.playing = true; ps.textContent = '▶ playing'; }); c.addEventListener('pointerleave', () => { v.playing = false; ps.textContent = '❚❚ paused'; }); c.v = v; return c; });
  const work = h('div.cb-w.cb-sec', {}, h('div.cb-h2', {}, 'Selected work', h('sup', {}, '(24)')), h('div.cb-grid', {}, ...cards));
  const SRV = [['Mobile apps', '#ffb3c7'], ['Websites', '#a9c6ff'], ['Branding', '#ffe08a'], ['Product design', '#b9f5d0'], ['Motion & 3D', '#d7c2ff']];
  const srv = h('div.cb-w.cb-sec', {}, h('div.cb-h2', {}, 'Services'), h('div.cb-srv', {}, ...SRV.map(([n, c], i) => h('div.cb-row', { 'data-cursor': 'arrow', 'data-bg': `radial-gradient(circle at ${30 + i * 10}% 40%,#fff8,transparent 50%),linear-gradient(135deg,${c},#2a5bdc)` }, n, h('small', {}, `0${i + 1}`)))));
  const Q = [['“Cuberto turned a complex product into something people instantly understand. The motion work alone lifted our activation.”', 'Head of Product, fintech'], ['“They think like product people and ship like engineers. Every detail was considered.”', 'Founder, AI video startup'], ['“Our new site doubled demo requests within a quarter.”', 'CMO, B2B SaaS']]; let qi = 0;
  const qt = h('blockquote'); const qa = h('div', { style: { marginTop: '18px', opacity: .55 } }); const drawQ = () => { qt.textContent = Q[qi][0]; qa.textContent = `${Q[qi][1]} · ${qi + 1}/${Q.length}`; };
  const qprev = h('button.cb-arw', { 'data-cursor': 'left', onclick: () => { qi = (qi + Q.length - 1) % Q.length; drawQ(); } }, '←'), qnext = h('button.cb-arw', { 'data-cursor': 'right', onclick: () => { qi = (qi + 1) % Q.length; drawQ(); } }, '→');
  const testi = h('div.cb-w.cb-sec', {}, h('div.cb-h2', {}, 'What clients say'), h('div.cb-quote', {}, h('div', {}, qt, qa), h('div', {}, qprev, qnext)));
  const FAQ = [['How long does a project take?', 'Most product and website engagements run 8–16 weeks from discovery to launch.'], ['Do you also develop, or only design?', 'Both — our in-house engineers build web, iOS and Android products end to end.'], ['Can you join an existing team?', 'Yes. We often embed with in-house product teams as a design partner.'], ['What does it cost?', 'Every scope is different; we send a detailed estimate after a short intro call.']];
  const faq = h('div.cb-w.cb-sec.cb-faq', {}, h('div.cb-h2', {}, 'FAQ'), ...FAQ.map(([q, a]) => { const it = h('div', {}, h('div.q', { 'data-cursor': 'arrow', onclick: () => it.classList.toggle('o') }, q, h('span.pl', {}, '+')), h('div.a', {}, h('p', { style: { margin: '0 0 22px' } }, a))); return it; }));
  const mag = h('button.cb-mag', { 'data-magnetic': '', 'data-cursor': 'arrow', onclick: () => toast('Let’s talk (demo)') }, 'Get in touch');
  const cta = h('div.cb-cta', {}, h('div.cb-w', {}, h('h2', {}, 'Have a product to', h('br'), 'build or rethink?'), h('div', { style: { display: 'flex', alignItems: 'center', gap: '40px' } }, mag, h('div', { style: { fontSize: '22px', opacity: .7 } }, 'info@cuberto.com', h('br'), '+1 301 549 9309')), h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '120px', opacity: .5, fontSize: '14px' } }, h('span', {}, '© cuberto clone · practice build'), h('span', {}, 'Dribbble  Behance  Instagram  LinkedIn'))));
  page.append(nav, hero, reel, work, srv, testi, faq, cta, modal); drawQ();
  requestAnimationFrame(() => requestAnimationFrame(() => page.classList.add('in')));
  let last = performance.now(); const loop = (now) => { const dt = Math.min(0.05, (now - last) / 1000); last = now; cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18; cur.style.transform = `translate(${cx}px,${cy}px)`; VIDS.forEach((v) => v.tick(dt)); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  window.__demoProof = async () => {
    const out = [], mv = (el, dx = 0.5, dy = 0.5) => { const r = el.getBoundingClientRect(); el.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: r.left + r.width * dx, clientY: r.top + r.height * dy })); };
    out.push(`hero lines revealed=${page.classList.contains('in')}`);
    mv(nav.children[2]); await sleep(320); out.push(`link cursor=${cur.dataset.kind} w=${cur.offsetWidth}`);
    mv(reel.firstChild); out.push(`reel cursor=${cur.dataset.kind}`); reel.firstChild.click(); out.push(`showreel open=${modal.classList.contains('on')} cursor=${cur.dataset.kind}`); closeReel();
    const c0 = cards[0]; const f0 = c0.v.frames; await sleep(200); const idle = c0.v.frames === f0; c0.dispatchEvent(new PointerEvent('pointerenter')); mv(c0); await sleep(400); const played = c0.v.frames - f0; c0.dispatchEvent(new PointerEvent('pointerleave')); const f1 = c0.v.frames; await sleep(200); out.push(`work card idle=${idle}, hover-play frames=+${played}, paused after leave=${c0.v.frames === f1}, cursor="${cur.dataset.kind}"`);
    const row = srv.querySelector('.cb-row'); mv(row); out.push(`service preview=${prev.classList.contains('on')}`);
    mv(mag, 0.9, 0.9); const magT = mag.style.transform; out.push(`magnetic CTA ${magT}`);
    qnext.click(); const q2 = qi; qprev.click(); const it = faq.querySelectorAll('.cb-faq > div')[1] || faq.children[1]; it.querySelector('.q').click(); const op = it.classList.contains('o'); it.querySelector('.q').click(); out.push(`testimonial next→${q2 + 1}, faq toggle=${op}`);
    mv(hero.querySelector('h1')); setCursor(null); mag.style.transform = ''; prev.classList.remove('on'); root.scrollTop = 0; mx = cx = root.clientWidth * 0.5; my = cy = 520; return out.join('; ') + '; restored';
  };
};

V['csszengarden-single-markup-theme-switcher-design-list-skin-swap'] = (root, T) => {
  import('@fontsource/julius-sans-one'); import('@fontsource/libre-baskerville/400.css'); import('@fontsource/libre-baskerville/400-italic.css'); import('@fontsource/barlow-condensed/300.css'); import('@fontsource/barlow-condensed/700.css'); import('@fontsource/ibm-plex-mono/400.css'); import('@fontsource/eb-garamond/400.css'); import('@fontsource/eb-garamond/400-italic.css');
  theme(root, T, { bg: '#fff', fg: '#325050', ac: '#3d8a9f', dark: false });
  const JU = "'Julius Sans One',sans-serif", LB = "'Libre Baskerville',Georgia,serif", AR = "'Helvetica Neue',Arial,'Liberation Sans',sans-serif", BC = "'Barlow Condensed',sans-serif", PM = "'IBM Plex Mono',monospace", EB = "'EB Garamond',Garamond,serif", SG = "'Space Grotesk Variable',sans-serif";
  const svg = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
  const ENSO = svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='#fff' stroke-linecap='round'><path d='M62 9C36 3 9 20 8 49s22 44 43 43 41-18 40-42C90 33 82 20 70 14' stroke-width='7' opacity='.88'/><path d='M60 13C38 8 15 22 13 48' stroke-width='2' opacity='.5'/><path d='M86 62c-5 14-18 25-34 26' stroke-width='3' opacity='.6'/><path d='M70 14l3-3' stroke-width='3'/></g></svg>`);
  const ICON = { star: svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g stroke='#f15a33' stroke-width='3'><path d='M50 18v64M18 50h64M27 27l46 46M73 27L27 73'/></g></svg>`), glass: svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M30 30h40L30 70h40z' fill='none' stroke='#36c0d9' stroke-width='3'/></svg>`), flower: svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='#fff' stroke-width='3'><circle cx='50' cy='50' r='9'/><circle cx='50' cy='30' r='9'/><circle cx='50' cy='70' r='9'/><circle cx='33' cy='40' r='9'/><circle cx='67' cy='40' r='9'/><circle cx='33' cy='60' r='9'/><circle cx='67' cy='60' r='9'/></g></svg>`), rings: svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='#36c0d9' stroke-width='1.6'>${[22, 25, 28, 31].map((r) => `<circle cx='50' cy='50' r='${r}'/>`).join('')}</g></svg>`) };
  const SKINS = {
    '001': { name: 'Tranquille', by: 'Dave Shea', num: '001', thumb: ['#3d6e57', '#fff', '#e5ece7'] },
    '221': { name: 'Mid Century Modern', by: 'Andrew Lohman', num: '221', thumb: ['#c776b0', '#0e2a40', '#f15a33'] },
    '220': { name: 'Garments', by: 'Dan Mall', num: '220', thumb: ['#ecebe8', '#2b2b2b', '#c9c6bf'] },
    '219': { name: 'Steel', by: 'Steffen Knoeller', num: '219', thumb: ['#2a2d31', '#9aa3ad', '#e6e9ec'] },
    '218': { name: 'Apothecary', by: 'Trent Walton', num: '218', thumb: ['#efe6d2', '#5a3a22', '#a8322a'] },
  };
  const SEL = (id) => `.zg-m[data-skin="${id}"]`;
  const CSS = {};
  let k = SEL('001'); CSS['001'] = `
${k}{background:#fff;color:#325050;font:15px/1.8 ${LB}}
${k} .page-wrapper{position:relative;min-height:100%}
${k} a{color:#0d8ba1;text-decoration:none}${k} abbr{text-decoration:none;border-bottom:1px dotted;font-size:.9em;letter-spacing:.01em;text-transform:uppercase}
${k} .intro header{position:relative;height:310px;overflow:hidden;padding:110px 0 0 300px;isolation:isolate}
${k} .intro header:before{content:'';position:absolute;inset:-40px;z-index:-2;filter:blur(16px);background:radial-gradient(ellipse 9% 14% at 57% 54%,#c8553d,#0000),radial-gradient(ellipse 5% 8% at 62% 40%,#e0a24a,#0000),radial-gradient(ellipse 22% 60% at 12% 60%,#1d4d36,#0000),radial-gradient(ellipse 18% 50% at 35% 30%,#7fa863,#0000),radial-gradient(ellipse 25% 55% at 50% 80%,#2c5d43,#0000),radial-gradient(ellipse 14% 40% at 75% 45%,#9ab98a,#0000),radial-gradient(ellipse 30% 70% at 90% 70%,#3b6b52,#0000),radial-gradient(ellipse 10% 30% at 25% 85%,#a7c48b,#0000),linear-gradient(#26574a,#3f7560)}
${k} .intro header:after{content:'';position:absolute;inset:0;z-index:-1;background:repeating-radial-gradient(circle at 30% 140%,#ffffff12 0 1px,#0000 1.5px 13px),linear-gradient(#173d3a55,#0000 30%,#0000 80%,#12302d40)}
${k} .intro header h1{margin:0;color:#fff;font:400 54px/1 ${JU};text-transform:uppercase;letter-spacing:.06em;position:relative}
${k} .intro header h1:before{content:'';position:absolute;left:-170px;top:-30px;width:130px;height:130px;background:${ENSO} center/contain no-repeat}
${k} .intro header h2{margin:12px 0 0;color:#fff9;font:italic 400 24px/1.3 ${LB}}
${k} .intro header h2 abbr{font-size:1em;text-transform:none;letter-spacing:0}
${k} .summary,${k} .preamble,${k} .main{width:66%;padding:0 10%}
${k} .summary{padding-top:50px}${k} .summary p:last-child a{font:14px ${JU};text-transform:uppercase;color:#809b7e;padding:0 4px 0 26px;position:relative}
${k} .summary p:last-child a:before{content:'⤓';position:absolute;left:4px;top:-1px;background:#d9e1cd;color:#a9b995;border-radius:2px;padding:0 3px;font:13px/1.3 sans-serif}
${k} h3{margin:1.6em 0 .4em;color:#2e484c;font:400 30px/1.2 ${JU};text-transform:uppercase;letter-spacing:.04em}
${k} p{margin:.6em 0}
${k} .participation,${k} .benefits{width:150%;margin-left:-15%;padding:20px 15% 30px;background:repeating-linear-gradient(90deg,#9cc4a4 0 40px,#a9cfb0 40px 46px,#93bc9c 46px 120px),#8abc9f;background-blend-mode:normal;color:#2a4a44}
${k} .participation{margin-top:40px}${k} .benefits{padding-bottom:40px}
${k} .requirements{padding-bottom:30px}${k} .requirements p:last-child{color:#7a8f8c;font-style:italic}
${k} .main footer{width:150%;margin-left:-15%;padding:40px 15%;background:#134347;text-align:center}
${k} .main footer a{display:inline-block;width:40px;height:40px;margin:0 8px;border-radius:50%;border:1px solid #ffffff55;color:#ffffff99;font:10px/40px ${JU}}
${k} .sidebar{position:absolute;top:310px;right:0;width:34%;bottom:0;background:#e5ece7;padding:60px 0 0 0}
${k} .sidebar .wrapper{position:sticky;top:0}
${k} .sidebar h3{display:none}${k} .sidebar ul{list-style:none;margin:0;padding:0}
${k} .design-selection li{margin:0 22% 0 17%;padding:18px 0;border-top:1px solid #d3ddd6;color:#c0cac3;font:italic 13px ${LB}}
${k} .design-selection li:first-child{border-top:0}
${k} .design-selection .design-name{display:block;color:#607476;font:400 17px/1.3 ${JU};text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px;cursor:pointer}
${k} .design-selection .designer-name{color:#616857;font-style:normal;cursor:pointer}${k} .design-selection .design-name:hover{color:#49968e}
${k} .design-selection li.on .design-name{color:#2b8a7e}
${k} .design-archives{position:absolute;top:-190px;right:14px}${k} .design-archives .next{display:none}
${k} .design-archives .viewall a{display:flex;align-items:center;height:70px;width:390px;background:#ffffff26;box-shadow:inset 0 0 0 1px #ffffff14;color:#ffffffaa;font:400 18px ${JU};text-transform:uppercase;letter-spacing:.06em;cursor:pointer;padding-left:68px;position:relative}
${k} .design-archives .viewall a:after{content:'';position:absolute;right:0;top:0;width:70px;height:70px;background:#ffffff1f ${svg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 70 70'><path d='M30 22l13 13-13 13' fill='none' stroke='#fff' stroke-width='3'/></svg>`)} center/70px no-repeat;border-left:2px solid #ffffff22}
${k} .design-archives .viewall a:hover{color:#fff;background:#ffffff40}
${k} .zen-resources{margin:28px 22% 40px 17%;border-top:1px solid #d3ddd6;padding-top:14px}${k} .zen-resources li{font:13px/2.2 ${JU};text-transform:uppercase}${k} .zen-resources a{color:#607476;cursor:pointer}
${k} [class^=extra]{display:none}`;
  k = SEL('221'); CSS['221'] = `
${k}{background:#f6ede3;color:#0e2a40;font:15px/1.65 ${AR}}
${k} .page-wrapper{position:relative}
${k} a{color:inherit}${k} abbr{text-decoration:none;border-bottom:3px dotted currentColor}
${k} .intro{position:relative;padding-top:820px;background:linear-gradient(#c776b0 0 800px,#0000 800px)}
${k} .intro header h1{position:absolute;left:22px;top:36px;margin:0;writing-mode:vertical-rl;transform:rotate(180deg);font:700 17px ${AR};color:#fff}
${k} .intro header h2{position:absolute;left:20%;top:0;width:20%;height:800px;margin:0;background:#0e2a40;color:#fff;font:700 42px/1.2 ${AR};padding:240px 20px 0 20px}
${k} .intro header h2:after{content:'';position:absolute;left:50%;top:540px;width:225px;height:225px;margin-left:-112px;border-radius:50%;background:#fff ${ICON.star} center/66% no-repeat}
${k} .summary{position:absolute;left:42%;top:250px;width:33%;color:#fff;font-size:16px}${k} .summary a{text-decoration:underline}
${k} .preamble{width:22%;margin-left:59%;padding:20px 0 60px;font-size:14px}
${k} .preamble h3{font:700 19px ${AR};margin:0 0 14px}
${k} .preamble p:nth-of-type(3){position:absolute;left:80.5%;width:18%;top:830px;background:#36c0d9;color:#fff;margin:0;padding:30px 24px 60px;z-index:2}
${k} .main{position:relative;padding:240px 0 0;background:linear-gradient(170deg,#0000 0 30%,#5e5e5e 30.2% 33%,#0000 33.2%),repeating-linear-gradient(90deg,#9d9d9d 0 3px,#bdbdbd 3px 37px,#a5a5a5 37px 40px,#c9c9c9 40px 90px),linear-gradient(#d8d8d8,#8a8a8a);background-size:100% 900px,100% 900px,100% 900px;background-repeat:no-repeat}
${k} .explanation{position:relative;width:40%;background:#0e2a40;color:#fff;padding:30px 30px 30px 110px;font-size:14px}
${k} .explanation h3{position:absolute;left:24px;bottom:30px;margin:0;writing-mode:vertical-rl;transform:rotate(180deg);font:700 26px ${AR}}
${k} .participation{width:40%;margin:0 0 0 40%;background:#f6ede3;padding:34px 40px}
${k} .participation h3,${k} .benefits h3,${k} .requirements h3{font:700 22px ${AR};margin:0 0 10px}
${k} .benefits{width:40%;margin-left:20%;background:#f15a33;color:#fff;padding:34px 40px}
${k} .requirements{width:60%;margin-left:40%;background:#c776b0;color:#fff;padding:34px 40px}
${k} .main footer{background:#0e2a40;padding:30px 20%;display:flex;gap:20px}${k} .main footer a{color:#36c0d9;font:700 13px ${AR}}
${k} .sidebar{position:absolute;top:56px;right:3%;width:16%;color:#fff;z-index:3}
${k} .sidebar h3{font:700 12px ${AR};text-transform:uppercase;letter-spacing:.14em;margin:0 0 8px;opacity:.85}${k} .sidebar ul{list-style:none;padding:0;margin:0}
${k} .design-selection li{padding:6px 0;font-size:12px;color:#ffffffaa;border-bottom:1px solid #ffffff44}
${k} .design-selection .design-name{display:block;font:700 15px ${AR};color:#fff;cursor:pointer}${k} .design-selection li.on .design-name{color:#0e2a40}
${k} .design-selection .designer-name{cursor:pointer}
${k} .design-archives{margin-top:16px}${k} .design-archives h3{display:none}${k} .design-archives li{display:inline-block;margin-right:12px}${k} .design-archives a{font:700 12px ${AR};cursor:pointer;border:2px solid #fff;padding:6px 10px;display:inline-block}${k} .design-archives .next{display:none}
${k} .zen-resources{display:none}
${k} .extra1,${k} .extra2,${k} .extra3,${k} .extra4{position:absolute;top:505px;width:20%;height:295px}
${k} .extra1{left:40%;background:#f15a33}${k} .extra2{left:60%;background:#36c0d9;height:500px}${k} .extra3{left:80%;background:#f15a33}
${k} .extra1:before,${k} .extra2:before,${k} .extra3:before{content:'';position:absolute;left:50%;top:35px;width:225px;height:225px;margin-left:-112px;border-radius:50%;background:#fff ${ICON.glass} center/66% no-repeat}
${k} .extra2:before{background:#0e2a40 ${ICON.flower} center/66% no-repeat}${k} .extra3:before{background:#fff ${ICON.rings} center/80% no-repeat}
${k} .extra4,${k} .extra5,${k} .extra6{display:none}`;
  k = SEL('220'); CSS['220'] = `
${k}{background:#ecebe8 repeating-linear-gradient(45deg,#0000 0 3px,#00000006 3px 4px),repeating-linear-gradient(-45deg,#0000 0 3px,#00000006 3px 4px);color:#2b2b2b;font:13px/1.75 ${PM}}
${k} .page-wrapper{position:relative;max-width:1180px;margin:0 auto;padding:60px 40px 80px}
${k} a{color:#2b2b2b}${k} abbr{text-decoration:none}
${k} .intro header{position:relative;height:470px}
${k} .intro header h1{position:absolute;left:0;top:30px;margin:0;background:#fff;padding:26px 30px;font:400 15px ${PM};letter-spacing:.32em;text-transform:uppercase;outline:2px dashed #b9b4aa;outline-offset:-9px;box-shadow:0 2px 0 #d6d2ca,0 8px 18px #0000001a}
${k} .intro header h2{position:absolute;left:0;top:110px;width:66%;margin:0;font:700 124px/0.84 ${BC};text-transform:uppercase;color:#d5d2cb;letter-spacing:-.01em}
${k} .intro header h2 abbr{color:#2b2b2b}
${k} .summary{position:absolute;right:40px;top:80px;width:300px;background:#fff;padding:26px;outline:1px dashed #c8c3b8;outline-offset:-8px;transform:rotate(2deg);box-shadow:0 10px 24px #0000001f}
${k} .summary:before{content:'';display:block;width:18px;height:18px;border-radius:50%;margin:-8px auto 12px;box-shadow:inset 0 0 0 4px #ecebe8,0 0 0 1px #bbb}
${k} .preamble,${k} .main{width:68%}
${k} h3{font:700 32px/1 ${BC};text-transform:uppercase;letter-spacing:.02em;margin:46px 0 10px;border-bottom:1px solid #2b2b2b;padding-bottom:8px}
${k} .participation,${k} .benefits{column-count:2;column-gap:36px}${k} .participation h3,${k} .benefits h3{column-span:all}
${k} .main footer{margin-top:40px;display:flex;gap:20px;font:11px ${PM};text-transform:uppercase;letter-spacing:.2em}
${k} .sidebar{position:absolute;right:40px;top:560px;width:270px;background:#fff;padding:24px 24px 10px;outline:2px dashed #b9b4aa;outline-offset:-9px;box-shadow:0 8px 18px #0000001a}
${k} .sidebar h3{font:700 22px ${BC};margin:0 0 10px;border:0;padding:0}${k} .sidebar ul{list-style:none;margin:0;padding:0}
${k} .design-selection li{padding:8px 0;border-top:1px solid #e3e0da;font-size:11px;color:#888}
${k} .design-selection .design-name{display:block;font:700 18px/1.1 ${BC};text-transform:uppercase;letter-spacing:.06em;color:#2b2b2b;cursor:pointer}${k} .design-selection li.on .design-name:after{content:' ✂'}
${k} .design-selection .designer-name{cursor:pointer;color:#555}
${k} .design-archives h3,${k} .design-archives .next{display:none}${k} .design-archives a{display:block;text-align:center;border:1px solid #2b2b2b;padding:8px;margin:10px 0;font:11px ${PM};text-transform:uppercase;letter-spacing:.24em;cursor:pointer}
${k} .zen-resources li{font-size:11px;text-transform:uppercase;letter-spacing:.14em}${k} .zen-resources a{cursor:pointer}
${k} .extra1{position:absolute;right:420px;top:40px;width:120px;height:190px;background:#c9c6bf;clip-path:polygon(20% 0,80% 0,100% 15%,100% 100%,0 100%,0 15%);transform:rotate(-6deg)}
${k} .extra1:after{content:'100% CSS';position:absolute;left:0;right:0;top:80px;text-align:center;font:700 22px ${BC};color:#fff}
${k} [class^=extra]:not(.extra1){display:none}`;
  k = SEL('219'); CSS['219'] = `
${k}{background:radial-gradient(ellipse at 50% 0,#4a5058,#1d1f23 70%),#1d1f23;color:#b9c0c8;font:14px/1.7 ${SG}}
${k} .page-wrapper{position:relative;max-width:1240px;margin:0 auto;padding:50px 30px 80px;perspective:1400px}
${k} a{color:#e6e9ec}${k} abbr{text-decoration:none}
${k} .intro{transform:rotateX(8deg);transform-origin:50% 100%}
${k} .intro header,${k} .summary,${k} .preamble,${k} .main>div,${k} .sidebar{background:repeating-linear-gradient(90deg,#ffffff05 0 1px,#0000 1px 3px),linear-gradient(160deg,#5b636c,#3a4047 45%,#2a2e33);border-radius:6px;box-shadow:inset 0 1px #ffffff40,inset 0 -2px #0007,0 18px 30px #0009;position:relative}
${k} .intro header:before,${k} .preamble:before,${k} .main>div:before,${k} .sidebar:before{content:'';position:absolute;inset:10px;pointer-events:none;background:radial-gradient(circle at 0 0,#cfd5db 0 3px,#3a3f45 3.6px,#0000 4.5px) 0 0/100% 100% no-repeat,radial-gradient(circle at 100% 0,#cfd5db 0 3px,#3a3f45 3.6px,#0000 4.5px) 0 0/100% 100% no-repeat,radial-gradient(circle at 0 100%,#cfd5db 0 3px,#3a3f45 3.6px,#0000 4.5px) 0 0/100% 100% no-repeat,radial-gradient(circle at 100% 100%,#cfd5db 0 3px,#3a3f45 3.6px,#0000 4.5px) 0 0/100% 100% no-repeat}
${k} .intro header{padding:60px 50px 46px;text-align:center}
${k} .intro header h1{margin:0;font:700 74px/1 ${SG};text-transform:uppercase;letter-spacing:.08em;color:#2b3036;text-shadow:0 1px 0 #8d959e,0 -1px 0 #121417}
${k} .intro header h2{margin:12px 0 0;font:500 16px ${SG};letter-spacing:.5em;text-transform:uppercase;color:#d7dce1}
${k} .summary{margin:18px 0;padding:22px 40px;width:calc(70% - 10px);font-size:15px}
${k} .preamble,${k} .main{width:70%}
${k} .preamble{padding:30px 40px;margin-bottom:18px}${k} .main>div{padding:30px 40px;margin-bottom:18px}
${k} h3{margin:0 0 10px;font:700 13px ${SG};letter-spacing:.4em;text-transform:uppercase;color:#ff7a2f}
${k} .main footer{display:flex;gap:16px;padding:10px 0}${k} .main footer a{font:700 12px ${SG};letter-spacing:.2em;color:#7f8892}
${k} .sidebar{position:absolute;right:30px;top:330px;width:calc(30% - 40px);padding:26px 28px}
${k} .sidebar h3{display:block}${k} .sidebar ul{list-style:none;margin:0;padding:0}
${k} .design-selection li{padding:10px 0;border-top:1px solid #0006;box-shadow:inset 0 1px #ffffff14;font-size:12px;color:#8a929b}
${k} .design-selection .design-name{display:block;font:700 16px ${SG};text-transform:uppercase;letter-spacing:.12em;color:#e6e9ec;text-shadow:0 -1px #000;cursor:pointer}${k} .design-selection li.on .design-name{color:#ff7a2f}
${k} .design-selection .designer-name{cursor:pointer;color:#aab2bb}
${k} .design-archives{margin-top:12px}${k} .design-archives h3,${k} .design-archives .next{display:none}${k} .design-archives a{display:block;text-align:center;padding:10px;border-radius:4px;background:linear-gradient(#ff8a3d,#d65a14);color:#fff;font:700 12px ${SG};letter-spacing:.2em;text-transform:uppercase;box-shadow:inset 0 1px #ffffff66,0 3px 0 #7a300a;cursor:pointer}
${k} .zen-resources{margin-top:18px}${k} .zen-resources li{font-size:12px;letter-spacing:.1em;text-transform:uppercase}${k} .zen-resources a{color:#9aa3ad;cursor:pointer}
${k} [class^=extra]{display:none}`;
  k = SEL('218'); CSS['218'] = `
${k}{background:#efe6d2 radial-gradient(ellipse at 50% 30%,#f7f0e0,#e2d5b8 80%);color:#4a3220;font:17px/1.6 ${EB}}
${k} .page-wrapper{position:relative;max-width:1100px;margin:0 auto;padding:46px 30px 80px}
${k} a{color:#a8322a}${k} abbr{text-decoration:none;font-variant:small-caps;text-transform:lowercase;font-size:1.1em}
${k} .intro header{width:560px;margin:0 auto;text-align:center;background:#fbf6ea;border:2px solid #5a3a22;outline:6px double #5a3a22;outline-offset:6px;padding:30px 30px 26px;border-radius:50% 50% 8px 8px/22% 22% 8px 8px;box-shadow:0 14px 30px #5a3a2233}
${k} .intro header:before{content:'❦  No. 218  ❦';display:block;font:14px ${EB};letter-spacing:.3em;color:#a8322a;margin-bottom:6px}
${k} .intro header h1{margin:0;font:italic 400 64px/1 ${EB};color:#3d2614}
${k} .intro header h2{margin:12px auto 0;font:400 15px ${EB};letter-spacing:.32em;text-transform:uppercase;color:#fff;background:#a8322a;padding:6px 14px;display:inline-block}
${k} .intro header h2:after{content:'';display:block}
${k} .summary{text-align:center;max-width:620px;margin:34px auto 10px;font-style:italic}
${k} .summary:after{content:'— ✤ —';display:block;color:#a8322a;margin-top:10px;font-style:normal}
${k} .preamble,${k} .main{width:64%}
${k} h3{font:400 24px ${EB};font-variant:small-caps;letter-spacing:.12em;color:#a8322a;margin:30px 0 6px;border-bottom:1px solid #5a3a2255;padding-bottom:4px}
${k} .main footer{margin-top:30px;border-top:3px double #5a3a22;padding-top:12px;display:flex;gap:18px;font-variant:small-caps}
${k} .sidebar{position:absolute;right:30px;top:380px;width:31%;background:#fbf6ea;border:1px solid #5a3a22;outline:4px double #5a3a2299;outline-offset:4px;padding:20px 24px}
${k} .sidebar h3{margin:0 0 6px;text-align:center;border:0}${k} .sidebar ul{list-style:none;margin:0;padding:0}
${k} .design-selection li{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 6px;padding:5px 0;font-style:italic;font-size:14px;color:#8a6a50}
${k} .design-selection .design-name{flex:1 0 100%;display:flex;font:400 18px ${EB};font-variant:small-caps;letter-spacing:.06em;color:#3d2614;cursor:pointer}
${k} .design-selection .design-name:after{content:'';flex:1;border-bottom:2px dotted #5a3a2266;margin:0 0 6px 8px}${k} .design-selection li.on .design-name{color:#a8322a}
${k} .design-selection .designer-name{cursor:pointer;color:#6a4a30}
${k} .design-archives h3,${k} .design-archives .next{display:none}${k} .design-archives a{display:block;text-align:center;margin:14px 0 6px;padding:6px;border:1px solid #a8322a;color:#a8322a;font-variant:small-caps;letter-spacing:.2em;cursor:pointer}
${k} .zen-resources{font-size:14px}${k} .zen-resources h3{font-size:16px}${k} .zen-resources a{cursor:pointer;color:#5a3a22}
${k} [class^=extra]{display:none}`;
  // ---------- shell styles (not part of any skin) ----------
  const st = document.createElement('style'); st.textContent = `
.zg{position:absolute;inset:0;overflow:auto;background:#fff}
.zg-m{min-height:100%;transition:opacity .22s ease}
.zg-m.fade{opacity:0}
.zg-m ul{list-style:none}
.zg-hud{position:absolute;left:14px;bottom:14px;z-index:30;display:flex;gap:6px;align-items:center;background:#111c;color:#eee;font:600 11px 'Inter Variable',sans-serif;padding:6px 8px;border-radius:999px;backdrop-filter:blur(6px)}
.zg-hud button{all:unset;cursor:pointer;padding:4px 9px;border-radius:999px;background:#ffffff1a}
.zg-hud button.on{background:#d9f99d;color:#111}
.zg-hud .h{opacity:.7;padding:0 4px;font-variant-numeric:tabular-nums}
.zg-arc{position:absolute;inset:0;z-index:40;overflow:auto;background:linear-gradient(160deg,#9fb9b6,#cfddd8 40%,#e6eeea);opacity:0;pointer-events:none;transition:opacity .3s;font-family:${LB}}
.zg-arc.on{opacity:1;pointer-events:auto}
.zg-arc .top{display:flex;justify-content:space-between;align-items:center;padding:34px 8% 0;color:#fff}
.zg-arc .top b{font:700 15px 'Nunito Variable',${AR};letter-spacing:.06em;text-shadow:0 1px 8px #0003}
.zg-arc .top button{all:unset;cursor:pointer;font:12px ${LB};color:#3d6e7a}
.zg-arc h1{font:300 58px ${AR};color:#3d6e7a;margin:30px 8% 26px;letter-spacing:-.01em}
.zg-arc .body{display:grid;grid-template-columns:1fr 220px;gap:40px;padding:0 8% 60px}
.zg-arc .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px 22px}
.zg-arc .card{cursor:pointer}
.zg-arc .th{position:relative;height:190px;overflow:hidden;border-radius:4px;box-shadow:0 6px 18px #0003;background:#fff;transition:transform .2s}
.zg-arc .card:hover .th{transform:translateY(-4px)}
.zg-arc .th .zg-m{position:absolute;left:0;top:0;width:1440px;height:900px;transform:scale(.21);transform-origin:0 0;pointer-events:none;overflow:hidden}
.zg-arc .nm{font:19px ${AR};color:#2c6f7f;margin-top:8px}.zg-arc .by{font:13px ${AR};color:#555}.zg-arc .by u{color:#2c6f7f}
.zg-arc .side a{display:block;font:15px ${AR};color:#2c6f7f;padding:8px 18px;border-radius:999px}.zg-arc .side a.on{background:#fff}
.zg-css{position:absolute;inset:40px 12%;z-index:45;background:#0d0f14;color:#d7e3ff;border-radius:12px;box-shadow:0 30px 80px #0008;display:none;flex-direction:column}
.zg-css.on{display:flex}.zg-css pre{flex:1;overflow:auto;margin:0;padding:16px 20px;font:12px/1.5 'JetBrains Mono Variable',monospace;white-space:pre-wrap}
.zg-css div{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid #ffffff1a;font:600 13px 'Inter Variable'}
.zg-css button{all:unset;cursor:pointer;padding:4px 10px;background:#ffffff1a;border-radius:6px}
`; root.append(st);
  Object.keys(CSS).forEach((id) => (CSS[id] = CSS[id].replaceAll('li.on', `li[data-design="${id}"]`)));
  Object.entries(CSS).forEach(([id, c]) => { const e = document.createElement('style'); e.dataset.zenSkin = id; e.textContent = c; root.append(e); });
  // ---------- the single, never-modified markup ----------
  const LIST = ['221', '220', '219', '218', '001'];
  const MARKUP = `<div class="page-wrapper">
<section class="intro" id="zen-intro"><header role="banner"><h1>CSS Zen Garden</h1><h2>The Beauty of <abbr title="Cascading Style Sheets">CSS</abbr> Design</h2></header>
<div class="summary" id="zen-summary" role="article"><p>A demonstration of what can be accomplished through <abbr title="Cascading Style Sheets">CSS</abbr>-based design. Select any style sheet from the list to load it into this page.</p><p>Download the example <a class="zen-html" title="This page's source HTML code, not to be modified.">html file</a> and <a class="zen-css-file" title="This page's sample CSS, the file you may modify.">css file</a></p></div>
<div class="preamble" id="zen-preamble" role="article"><h3>The Road to Enlightenment</h3><p>Littering a dark and dreary road lay the past relics of browser-specific tags, incompatible <abbr title="Document Object Model">DOM</abbr>s, broken <abbr title="Cascading Style Sheets">CSS</abbr> support, and abandoned browsers.</p><p>We must clear the mind of the past. Web enlightenment has been achieved thanks to the tireless efforts of folk like the <abbr title="World Wide Web Consortium">W3C</abbr>, <abbr title="Web Standards Project">WaSP</abbr>, and the major browser creators.</p><p>The CSS Zen Garden invites you to relax and meditate on the important lessons of the masters. Begin to see with clarity. Learn to use the time-honored techniques in new and invigorating fashion. Become one with the web.</p></div></section>
<div class="main supporting" id="zen-supporting" role="main">
<div class="explanation" id="zen-explanation" role="article"><h3>So What is This About?</h3><p>There is a continuing need to show the power of <abbr title="Cascading Style Sheets">CSS</abbr>. The Zen Garden aims to excite, inspire, and encourage participation. To begin, view some of the existing designs in the list. Clicking on any one will load the style sheet into this very page. The <abbr title="HyperText Markup Language">HTML</abbr> remains the same, the only thing that has changed is the external <abbr title="Cascading Style Sheets">CSS</abbr> file. Yes, really.</p><p><abbr title="Cascading Style Sheets">CSS</abbr> allows complete and total control over the style of a hypertext document. The only way this can be illustrated in a way that gets people excited is by demonstrating what it can truly be, once the reins are placed in the hands of those able to create beauty from structure. Designers and coders alike have contributed to the beauty of the web; we can always push it further.</p></div>
<div class="participation" id="zen-participation" role="article"><h3>Participation</h3><p>Strong visual design has always been our focus. You are modifying this page, so strong <abbr title="Cascading Style Sheets">CSS</abbr> skills are necessary too, but the example files are commented well enough that even <abbr title="Cascading Style Sheets">CSS</abbr> novices can use them as starting points. Please see the <abbr title="Cascading Style Sheets">CSS</abbr> Resource Guide for advanced tutorials and tips on working with <abbr title="Cascading Style Sheets">CSS</abbr>.</p><p>You may modify the style sheet in any way you wish, but not the <abbr title="HyperText Markup Language">HTML</abbr>. This may seem daunting at first if you&#8217;ve never worked this way before, but follow the listed links to learn more, and use the sample files as a guide.</p><p>Download the sample HTML and CSS to work on a copy locally. Once you have completed your masterpiece (and please, don&#8217;t submit half-finished work) upload your <abbr title="Cascading Style Sheets">CSS</abbr> file to a web server under your control.</p></div>
<div class="benefits" id="zen-benefits" role="article"><h3>Benefits</h3><p>Why participate? For recognition, inspiration, and a resource we can all refer to showing people how amazing <abbr title="Cascading Style Sheets">CSS</abbr> really can be. This site serves as equal parts inspiration for those working on the web today, learning tool for those who will be tomorrow, and gallery of future techniques we can all look forward to.</p></div>
<div class="requirements" id="zen-requirements" role="article"><h3>Requirements</h3><p>Where possible, we would like to see mostly <abbr title="Cascading Style Sheets, levels 1 and 2">CSS 1 &amp; 2</abbr> usage. <abbr title="Cascading Style Sheets, levels 3 and 4">CSS 3 &amp; 4</abbr> should be limited to widely-supported elements only, or strong fallbacks should be provided. The CSS Zen Garden is about functional, practical <abbr title="Cascading Style Sheets">CSS</abbr> and not the latest bleeding-edge tricks viewable by 2% of the browsing public.</p><p>We ask that you submit original artwork. Please respect copyright laws. Please keep objectionable material to a minimum, and try to incorporate unique and interesting visual themes to your work. We&#8217;re well past the point of needing another garden-related design.</p><p>This is a learning exercise as well as a demonstration. You retain full copyright on your graphics, but we ask you release your <abbr title="Cascading Style Sheets">CSS</abbr> under a Creative Commons license identical to the one on this site so that others may learn from your work.</p></div>
<footer><a class="zen-validate-html" title="Check the validity of this site&#8217;s HTML">HTML</a><a class="zen-validate-css" title="Check the validity of this site&#8217;s CSS">CSS</a><a class="zen-license" title="View the Creative Commons license of this site">CC</a><a class="zen-accessibility" title="Read about the accessibility of this site">A11y</a><a class="zen-github" title="Fork this site on Github">GH</a></footer></div>
<aside class="sidebar" role="complementary"><div class="wrapper">
<div class="design-selection" id="design-selection"><h3 class="select">Select a Design:</h3><nav role="navigation"><ul>${LIST.map((id) => `<li data-design="${id}"><a class="design-name">${SKINS[id].name}</a> by <a class="designer-name">${SKINS[id].by}</a></li>`).join('')}</ul></nav></div>
<div class="design-archives" id="design-archives"><h3 class="archives">Archives:</h3><nav role="navigation"><ul><li class="next"><a>Next Designs <span class="indicator">&rsaquo;</span></a></li><li class="viewall"><a title="View every submission to the Zen Garden.">View All Designs</a></li></ul></nav></div>
<div class="zen-resources" id="zen-resources"><h3 class="resources">Resources:</h3><ul><li class="view-css"><a title="View the source CSS file of the currently-viewed design.">View This Design&#8217;s <abbr title="Cascading Style Sheets">CSS</abbr></a></li><li class="css-resources"><a title="Links to great sites with information on using CSS."><abbr title="Cascading Style Sheets">CSS</abbr> Resources</a></li><li class="zen-faq"><a title="A list of Frequently Asked Questions about the Zen Garden."><abbr title="Frequently Asked Questions">FAQ</abbr></a></li><li class="zen-submit"><a title="Send in your own CSS file.">Submit a Design</a></li><li class="zen-translations"><a title="View translated versions of this page.">Translations</a></li></ul></div>
</div></aside></div>
<div class="extra1" role="presentation"></div><div class="extra2" role="presentation"></div><div class="extra3" role="presentation"></div><div class="extra4" role="presentation"></div><div class="extra5" role="presentation"></div><div class="extra6" role="presentation"></div>`;
  const sc = h('div.zg'); const m = h('div.zg-m', { 'data-skin': '001', html: MARKUP }); sc.append(m); root.append(sc);
  const hash = (s0) => { let x = 5381; for (let i = 0; i < s0.length; i++) x = ((x * 33) ^ s0.charCodeAt(i)) >>> 0; return x.toString(16).padStart(8, '0'); };
  const H0 = hash(m.innerHTML);
  let cur = '001', busy = false, swaps = 0;
  const hudBtns = {}; const hashEl = h('span.h');
  const hud = h('div.zg-hud', {}, h('span.h', {}, 'stylesheet'), LIST.slice().reverse().map((id) => (hudBtns[id] = h('button', { title: `${SKINS[id].num} · ${SKINS[id].name} by ${SKINS[id].by}`, onclick: () => swap(id) }, id === '001' ? 'Default' : SKINS[id].name))), hashEl);
  root.append(hud);
  const markOn = () => { Object.entries(hudBtns).forEach(([id, b]) => b.classList.toggle('on', id === cur)); const hh0 = hash(m.innerHTML); hashEl.textContent = `markup #${hh0} ${hh0 === H0 ? '= unchanged' : '≠ CHANGED'}`; };
  const swap = async (id, { instant = false } = {}) => { if (busy || !SKINS[id]) return; if (id === cur) return; busy = true; const y = sc.scrollTop;
    if (!instant) { m.classList.add('fade'); await sleep(230); }
    m.dataset.skin = id; cur = id; swaps++; sc.scrollTop = y; markOn();
    if (!instant) { await sleep(20); m.classList.remove('fade'); await sleep(240); }
    busy = false; return { from: y, to: sc.scrollTop }; };
  m.addEventListener('click', (e) => { const li = e.target.closest('.design-selection li'); if (li) { e.preventDefault(); swap(li.dataset.design); return; }
    if (e.target.closest('.viewall')) { openArc(true); return; } if (e.target.closest('.view-css')) { showCss(true); return; }
    if (e.target.closest('.next')) { toast('Next Designs › (only these 5 skins are rebuilt here)'); return; }
    if (e.target.closest('a') && !e.target.closest('.sidebar')) { e.preventDefault(); } });
  // ---------- "View all designs" archive (live mini-renders of the same markup) ----------
  const arc = h('div.zg-arc'); const cards = h('div.grid');
  LIST.forEach((id) => { const th = h('div.th'); const mm = h('div.zg-m', { 'data-skin': id, html: MARKUP }); th.append(mm);
    cards.append(h('div.card', { 'data-design': id, onclick: async () => { openArc(false); await sleep(200); sc.scrollTop = 0; swap(id); } }, th, h('div.nm', {}, SKINS[id].name), h('div.by', {}, 'by ', h('u', {}, SKINS[id].by), ` · #${SKINS[id].num}`))); });
  arc.append(h('div.top', {}, h('b', {}, 'CSS ZEN GARDEN'), h('button', { onclick: () => openArc(false) }, '‹ return to zen garden')), h('h1', {}, 'All Designs'), h('div.body', {}, cards, h('div.side', {}, h('a.on', {}, 'All designs'), h('a', {}, 'About'), h('a', {}, 'FAQ'), h('a', {}, 'Resources'), h('a', {}, 'Submit'), h('a', {}, 'Translations'))));
  root.append(arc);
  const openArc = (on) => { arc.classList.toggle('on', on); if (on) arc.scrollTop = 0; };
  const cssBox = h('div.zg-css'); const pre = h('pre');
  cssBox.append(h('div', {}, h('span', {}, 'View This Design’s CSS'), h('button', { onclick: () => showCss(false) }, 'Close ✕')), pre); root.append(cssBox);
  const showCss = (on) => { cssBox.classList.toggle('on', on); if (on) pre.textContent = `/* css Zen Garden submission ${SKINS[cur].num} - '${SKINS[cur].name}' by ${SKINS[cur].by} */\n/* (rebuilt for clone practice; scoped to [data-skin="${cur}"]) */\n` + CSS[cur].replaceAll(SEL(cur), 'body').replace(/\}/g, '}\n'); };
  root.addEventListener('keydown', (e) => { if (e.key === 'Escape') { openArc(false); showCss(false); } });
  markOn();
  window.__demoProof = async () => { const out = [];
    sc.scrollTop = 600; const y0 = sc.scrollTop; out.push(`start skin ${SKINS[cur].name}, scrollTop ${y0}`);
    const li = m.querySelector('.design-selection li[data-design="221"] .design-name'); li.click(); await sleep(80); out.push(`fading=${m.classList.contains('fade')}`); await sleep(600);
    out.push(`clicked sidebar → ${SKINS[cur].name} (data-skin=${m.dataset.skin}), scrollTop kept ${sc.scrollTop}`);
    for (const id of ['220', '219', '218']) { await swap(id, { instant: true }); out.push(`${SKINS[id].name}: h1 font ${getComputedStyle(m.querySelector('h1')).fontFamily.split(',')[0]}`); }
    out.push(`markup hash ${hash(m.innerHTML)} vs initial ${H0} → ${hash(m.innerHTML) === H0 ? 'unchanged' : 'CHANGED'}`);
    m.querySelector('.viewall a').click(); out.push(`View all designs → archive open=${arc.classList.contains('on')} with ${cards.children.length} live thumbnails`); openArc(false);
    m.querySelector('.view-css a').click(); out.push(`View CSS: ${pre.textContent.split('\n')[0]}`); showCss(false);
    await swap('001', { instant: true }); sc.scrollTop = 0; out.push(`restored default Tranquille, top; swaps=${swaps}`); return out.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['neumorph-softui-generator'])(root, T); }
