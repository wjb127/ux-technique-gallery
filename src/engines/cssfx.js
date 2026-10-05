import { h, s, css, drag, localPos, clamp, copy, toast, sleep, hexToRgb, rgbToHex, hsl, gesture } from '../lib.js';
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

export function mount(root, variant, opts, T) { (V[variant] || V['neumorph-softui-generator'])(root, T); }
