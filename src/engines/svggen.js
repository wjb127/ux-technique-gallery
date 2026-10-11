import { h, s, css, drag, localPos, clamp, copy, toast, sleep, rng, hsl, pick, randHex, gesture, noise2 } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle, codebox } from '../kit.js';
const ser = (el) => new XMLSerializer().serializeToString(el);
const dl = (name, text) => { const a = h('a', { download: name, href: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text) }); a.click(); toast(`${name} downloaded`); };
function wavePath(w, hh, n, amp, seed, base) { const R = rng(seed); const pts = Array.from({ length: n + 1 }, (_, i) => [(i / n) * w, base + (R() - 0.5) * amp]); let d = `M0 ${hh}L0 ${pts[0][1]}`; for (let i = 0; i < n; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; const mx = (x0 + x1) / 2; d += `C${mx} ${y0},${mx} ${y1},${x1} ${y1}`; } return d + `L${w} ${hh}Z`; }
function blobPath(n, contrast, seed, r = 180, cx = 250, cy = 250) { const R = rng(seed); const pts = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; const rr = r * (1 - contrast * 0.1 * R() * 4 + contrast * 0.05); return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]; }); let d = ''; for (let i = 0; i < n; i++) { const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]; if (!i) d = `M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`; d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)},${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)},${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`; } return d + 'Z'; }
const V = {};
V['shapedivider-preview-export'] = (root, T) => {
  theme(root, T, { bg: '#f4f7fb', fg: '#1d2939', panel: '#fff', ac: '#16a34a', dark: false });
  const SH = { Waves: (w, hh) => `M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z`, Tilt: () => 'M1200 120L0 16.48 0 0 1200 0 1200 120z', Triangle: () => 'M1200 0L0 0 598.97 114.72 1200 0z', Curve: () => 'M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z', Arrow: () => 'M649.97 0L550.03 0 599.91 54.12 649.97 0z', Book: () => 'M602.45,3.86h0S572.9,116.24,281.94,120H923C632,116.24,602.45,3.86,602.45,3.86Z', Split: () => 'M0,0V3.6H580.08c11,0,19.92,5.09,19.92,13.2,0-8.14,8.88-13.2,19.92-13.2H1200V0Z' };
  const P = { shape: 'Waves', flip: false, invert: false, pos: 'bottom', height: 150, width: 100, color: '#16a34a' };
  const prev = h('div', { style: { position: 'relative', height: '460px', background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 10px 40px #0001' } }, h('div', { style: { padding: '70px', textAlign: 'center' } }, h('h1', { style: { fontSize: '44px', margin: 0 } }, 'Section heading'), h('p', { style: { opacity: .6 } }, 'Your content above the divider')));
  const div = h('div', { style: { position: 'absolute', left: 0, width: '100%', lineHeight: 0 } }); prev.append(div);
  const code = h('pre.k-code', { style: { display: 'none' } });
  const draw = () => { const svg = s('svg', { viewBox: '0 0 1200 120', preserveAspectRatio: 'none', style: `width:${P.width}%;height:${P.height}px;display:block;transform:${P.flip ? 'scaleX(-1)' : ''} ${P.invert ? 'scaleY(-1)' : ''}` }, s('path', { d: SH[P.shape](), fill: P.color })); div.replaceChildren(svg); Object.assign(div.style, P.pos === 'bottom' ? { bottom: 0, top: '', transform: 'rotate(180deg)' } : { top: 0, bottom: '', transform: '' }); code.textContent = `<div class="custom-shape-divider-${P.pos}">\n  ${ser(svg)}\n</div>\n\n.custom-shape-divider-${P.pos} svg { height: ${P.height}px; width: calc(${P.width}% + 1.3px); }\n.custom-shape-divider-${P.pos} .shape-fill { fill: ${P.color}; }`; };
  const picker = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '6px' } }, Object.keys(SH).map((k) => h('button', { onclick: () => { P.shape = k; draw(); }, style: { border: '1px solid #e4e7ec', background: '#fff', borderRadius: '8px', padding: '6px' } }, s('svg', { viewBox: '0 0 1200 120', preserveAspectRatio: 'none', style: 'width:100%;height:30px' }, s('path', { d: SH[k](), fill: '#16a34a' })), h('div', { style: { fontSize: '11px' } }, k))));
  root.append(h('div.k-row', { style: { height: '56px', padding: '0 30px', background: '#16a34a', color: '#fff' } }, h('b', { style: { fontSize: '18px' } }, 'Shape Divider-ish'), h('span', { style: { flex: 1 } }), 'Generate SVG section dividers'), h('div', { style: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', padding: '20px 30px' } }, panel('Shape', picker, h('div.k-row', {}, toggle('Flip', false, (v) => { P.flip = v; draw(); }), toggle('Invert', false, (v) => { P.invert = v; draw(); })), seg([['top', 'Top'], ['bottom', 'Bottom']], 'bottom', (v) => { P.pos = v; draw(); }), slider('Height', 20, 400, P.height, 1, (v) => { P.height = v; draw(); }, (v) => v + 'px'), slider('Width', 100, 300, P.width, 1, (v) => { P.width = v; draw(); }, (v) => v + '%'), h('input', { type: 'color', value: P.color, oninput: (e) => { P.color = e.target.value; draw(); } }), btn('Get Code', () => { code.style.display = code.style.display ? '' : 'none'; copy(code.textContent, 'Code copied'); }, 'pri')), h('div', {}, prev, code)));
  draw();
  window.__demoProof = async () => { P.shape = 'Curve'; P.flip = true; P.height = 180; draw(); code.style.display = ''; return 'Curve divider, flipped, height 180, code shown'; };
};
V['svg-wave-floating-control-bar'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#0099ff', dark: false });
  const P = { color: '#0099ff', op: 1, cx: 10, layers: 1, seed: 7, curve: 'smooth' };
  const svg = s('svg', { viewBox: '0 0 1440 320', preserveAspectRatio: 'none', style: 'position:absolute;left:0;bottom:0;width:100%;height:45%' });
  const draw = () => { svg.replaceChildren(...Array.from({ length: P.layers }, (_, i) => s('path', { d: P.curve === 'step' ? stepPath(i) : wavePath(1440, 320, P.cx, 140, P.seed + i * 13, 150 + i * 40), fill: P.color, 'fill-opacity': P.layers > 1 ? 0.3 + (i / P.layers) * 0.7 : P.op }))); };
  const stepPath = (i) => { const R = rng(P.seed + i); let d = 'M0 320'; for (let k = 0; k <= P.cx; k++) { const y = 100 + R() * 150; d += `V${y}H${(k + 1) * (1440 / P.cx)}`; } return d + 'V320Z'; };
  const bar = h('div.k-row', { style: { position: 'absolute', top: '180px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '10px 16px', borderRadius: '12px', boxShadow: '0 6px 24px #0002', gap: '16px', zIndex: 2 } }, seg([['smooth', '∿'], ['step', '⎍'], ['peak', '⋀']], 'smooth', (v) => { P.curve = v; draw(); }), h('input', { type: 'color', value: P.color, oninput: (e) => { P.color = e.target.value; draw(); } }), h('div', { style: { width: '120px' } }, slider('Opacity', 0, 1, 1, 0.05, (v) => { P.op = v; draw(); })), h('div', { style: { width: '120px' } }, slider('Complexity', 3, 30, P.cx, 1, (v) => { P.cx = v; draw(); })), select([[1, '1 layer'], [2, '2 layers'], [3, '3 layers']], 1, (v) => { P.layers = +v; draw(); }), btn('🎲', () => { P.seed = Math.floor(Math.random() * 1e5); draw(); }), btn('⬇', () => dl('wave.svg', ser(svg)), 'pri'));
  root.append(h('div', { style: { background: '#0f1b2d', color: '#fff', textAlign: 'center', padding: '8px', fontSize: '13px' } }, 'Get Waves-ish · Make some waves!'), h('div', { style: { position: 'absolute', top: '90px', width: '100%', textAlign: 'center', font: '800 44px Inter Variable' } }, 'Make some waves!'), bar, svg);
  draw();
  window.__demoProof = async () => { P.seed = 42; P.cx = 12; P.layers = 2; draw(); return 'randomized 2-layer wave, complexity 12'; };
};
V['blobmaker-organic-svg-desk'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#fa4d56', dark: false });
  const P = { n: 6, c: 0.5, color: '#ff0066', seed: 3 };
  const svg = s('svg', { viewBox: '0 0 500 500', width: 420, height: 420 });
  const draw = () => svg.replaceChildren(s('path', { d: blobPath(P.n, P.c, P.seed), fill: P.color }));
  root.append(h('div', { style: { background: '#fa4d56', color: '#fff', textAlign: 'center', padding: '6px', fontSize: '12px' } }, 'Make organic SVG shapes for your next design'), h('div.k-row', { style: { padding: '14px 40px' } }, h('b', { style: { background: '#ff6600', color: '#fff', borderRadius: '8px', padding: '4px 8px' } }, 'b'), h('span', {}, 'blobmaker-ish'), h('span', { style: { flex: 1 } }), 'Share ♥'), h('div', { style: { display: 'grid', placeItems: 'center', height: '520px' } }, svg),
    h('div.k-row', { style: { position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: '99px', padding: '12px 22px', boxShadow: '0 8px 30px #0002', gap: '20px' } }, h('input', { type: 'color', value: P.color, oninput: (e) => { P.color = e.target.value; draw(); }, style: { width: '34px', height: '34px', border: 0, borderRadius: '50%' } }), h('div', { style: { width: '140px' } }, slider('Complexity', 3, 12, P.n, 1, (v) => { P.n = v; draw(); })), h('div', { style: { width: '140px' } }, slider('Contrast', 0, 1, P.c, 0.05, (v) => { P.c = v; draw(); })), h('button', { style: { width: '48px', height: '48px', borderRadius: '50%', border: 0, background: '#fa4d56', color: '#fff', fontSize: '22px' }, onclick: () => { P.seed = Math.floor(Math.random() * 1e5); draw(); } }, '🎲'), btn('⬇ SVG', () => dl('blob.svg', ser(svg))), btn('</>', () => copy(ser(svg), 'SVG code copied'))));
  draw();
  window.__demoProof = async () => { P.seed = 99; P.n = 8; draw(); return 'dice re-roll, complexity 8'; };
};
V['svg-generator-studio'] = (root, T) => {
  theme(root, T, { bg: '#1b1b2f', fg: '#e6e6ff', panel: '#23233b', ac: '#fe5d9f', dark: true });
  const GENS = ['Layered Waves', 'Blob Scene', 'Stacked Waves', 'Low Poly Grid', 'Circle Scatter', 'Layered Peaks'];
  const P = { gen: 'Layered Waves', layers: 5, cx: 8, seed: 1, c1: '#fa7268', c2: '#c62368', bg: '#001220' };
  const svg = s('svg', { viewBox: '0 0 900 600', style: 'width:100%;height:100%;border-radius:6px' });
  const mix = (a, b, t) => { const A = a.match(/\w\w/g).map((x) => parseInt(x, 16)), B = b.match(/\w\w/g).map((x) => parseInt(x, 16)); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  const draw = () => { svg.replaceChildren(s('rect', { width: 900, height: 600, fill: P.bg })); const R = rng(P.seed);
    if (P.gen === 'Blob Scene') for (let i = 0; i < P.layers; i++) svg.append(s('path', { d: blobPath(P.cx, 0.6, P.seed + i, 90 + R() * 60, R() * 900, R() * 600), fill: mix(P.c1, P.c2, i / P.layers) }));
    else if (P.gen === 'Circle Scatter') for (let i = 0; i < P.layers * 8; i++) svg.append(s('circle', { cx: R() * 900, cy: R() * 600, r: 10 + R() * 60, fill: mix(P.c1, P.c2, R()) }));
    else if (P.gen === 'Low Poly Grid') { for (let y = 0; y < 6; y++) for (let x = 0; x < 9; x++) svg.append(s('path', { d: `M${x * 100} ${y * 100}l100 0l-${R() * 100} 100z`, fill: mix(P.c1, P.c2, (x + y) / 14 + R() * 0.1) }), s('path', { d: `M${x * 100 + 100} ${y * 100}l0 100l-100 0z`, fill: mix(P.c2, P.c1, (x + y) / 14) })); }
    else for (let i = 0; i < P.layers; i++) svg.append(s('path', { d: P.gen === 'Layered Peaks' ? `M0 600L0 ${300 + i * 50}` + Array.from({ length: P.cx }, (_, k) => `L${((k + 0.5) / P.cx) * 900} ${250 + i * 50 - R() * 120}L${((k + 1) / P.cx) * 900} ${300 + i * 50}`).join('') + 'L900 600Z' : wavePath(900, 600, P.cx, 80, P.seed + i * 7, 280 + i * (300 / P.layers)), fill: mix(P.c1, P.c2, i / (P.layers - 1 || 1)) })); };
  const list = h('div', { style: { display: 'grid', gap: '10px' } }, GENS.map((g) => h('button', { onclick: () => { P.gen = g; draw(); list.querySelectorAll('button').forEach((b) => (b.style.outline = b.textContent === g ? '2px solid #fe5d9f' : '')); }, style: { height: '92px', border: 0, borderRadius: '8px', color: '#fff', fontWeight: 700, background: `linear-gradient(160deg,${P.c1},${P.c2} 60%,#001220)`, outline: g === P.gen ? '2px solid #fe5d9f' : '' } }, g)));
  root.style.display = 'grid'; root.style.gridTemplateColumns = '180px 1fr 280px'; root.style.gap = '16px'; root.style.padding = '16px';
  root.append(h('div', { style: { overflow: 'auto' } }, h('b', { style: { color: '#fe5d9f', fontSize: '18px' } }, 'haikei-ish'), list), h('div', { style: { display: 'grid', placeItems: 'center' } }, h('div', { style: { width: '100%', aspectRatio: '3/2' } }, svg)), panel(P.gen, slider('Layers', 2, 10, P.layers, 1, (v) => { P.layers = v; draw(); }), slider('Complexity', 2, 20, P.cx, 1, (v) => { P.cx = v; draw(); }), h('div.k-row', {}, ['c1', 'c2', 'bg'].map((k) => h('input', { type: 'color', value: P[k], oninput: (e) => { P[k] = e.target.value; draw(); } }))), btn('🎲 Randomize', () => { P.seed = Math.floor(Math.random() * 1e5); draw(); }), seg(['SVG', 'PNG'], 'SVG', () => {}), btn('Download', () => dl('haikei.svg', ser(svg)), 'pri')));
  draw();
  window.__demoProof = async () => { P.seed = 11; P.layers = 6; draw(); return 'regenerated 6 layered waves'; };
};
V['fffuel-organic-leaf-svg'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#fff', ac: '#d946ef', dark: false });
  const P = { hue: 300, sat: 70, light: 60, op: 0.8, blur: 0, density: 60, prob: 0.8, reg: 0.4, fill: 'solid', seed: 5 };
  const svg = s('svg', { viewBox: '0 0 800 600', style: 'width:100%;height:100%' });
  const leaf = 'M0 -20C12 -10 12 10 0 20C-12 10 -12 -10 0 -20Z';
  const draw = () => { const R = rng(P.seed); svg.replaceChildren(s('defs', {}, s('filter', { id: 'bl' }, s('feGaussianBlur', { stdDeviation: P.blur })), s('linearGradient', { id: 'lg', x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: 0, 'stop-color': hsl(P.hue, P.sat, P.light + 15) }), s('stop', { offset: 1, 'stop-color': hsl(P.hue + 30, P.sat, P.light - 15) }))), s('rect', { width: 800, height: 600, fill: '#fff' }));
    const g = s('g', { filter: P.blur ? 'url(#bl)' : null }); const n = Math.round(P.density / 5); for (let y = 0; y < n; y++) for (let x = 0; x < n * 1.3; x++) { if (R() > P.prob) continue; const jx = (R() - 0.5) * 60 * (1 - P.reg), jy = (R() - 0.5) * 60 * (1 - P.reg); g.append(s('path', { d: leaf, transform: `translate(${(x + 0.5) * (800 / (n * 1.3)) + jx} ${(y + 0.5) * (600 / n) + jy}) rotate(${R() * 360 * (1 - P.reg) + 30}) scale(${0.6 + R() * 0.6})`, fill: P.fill === 'gradient' ? 'url(#lg)' : P.fill === 'outline' ? 'none' : hsl(P.hue + (R() - 0.5) * 30, P.sat, P.light), stroke: P.fill === 'outline' ? hsl(P.hue, P.sat, P.light) : 'none', opacity: P.op })); } svg.append(g); };
  const ctl = panel(null, h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } }, slider('Hue', 0, 360, P.hue, 1, (v) => { P.hue = v; draw(); }), slider('Saturation', 0, 100, P.sat, 1, (v) => { P.sat = v; draw(); }), slider('Lightness', 10, 90, P.light, 1, (v) => { P.light = v; draw(); }), slider('Opacity', 0.1, 1, P.op, 0.05, (v) => { P.op = v; draw(); }), slider('Blur', 0, 8, P.blur, 0.5, (v) => { P.blur = v; draw(); }), slider('Density', 20, 120, P.density, 1, (v) => { P.density = v; draw(); }), slider('Probability', 0.1, 1, P.prob, 0.05, (v) => { P.prob = v; draw(); }), slider('Regularity', 0, 1, P.reg, 0.05, (v) => { P.reg = v; draw(); })), seg(['solid', 'gradient', 'outline'], 'solid', (v) => { P.fill = v; draw(); }), h('div.k-row', {}, btn('🎲', () => { P.seed++; P.hue = Math.random() * 360; draw(); }), btn('Copy SVG', () => copy(ser(svg), 'SVG copied'), 'pri'), btn('Save SVG', () => dl('llleaves.svg', ser(svg)))));
  Object.assign(ctl.style, { position: 'absolute', right: '20px', bottom: '20px', width: '380px', boxShadow: '0 10px 40px #0002' });
  root.append(h('div', { style: { position: 'absolute', left: '20px', top: '10px', writingMode: 'vertical-rl', transform: 'rotate(180deg)', font: '800 44px Inter Variable', color: '#d946ef' } }, 'llleaves-ish'), h('div', { style: { position: 'absolute', left: '100px', right: '420px', top: '20px', bottom: '20px' } }, svg), ctl);
  draw();
  window.__demoProof = async () => { P.seed = 8; P.fill = 'gradient'; draw(); return 'gradient fill leaves re-seeded'; };
};
V['seamless-pattern-generator'] = (root, T) => {
  theme(root, T, { bg: '#f2e6c9', fg: '#2b2118', panel: '#fbf3e0', ac: '#e0633a', dark: false });
  const P = { motif: 'squiggle', size: 60, spacing: 20, rot: 0, fg: '#e0a93a', bg: '#1e2a4a', stroke: 6 };
  const M = { squiggle: 'M-20 0C-10 -15 0 15 10 0S20 -15 30 0', dot: 'M0 -8a8 8 0 1 0 0.1 0', cross: 'M-10 0H10M0 -10V10', zig: 'M-20 5L-10 -5L0 5L10 -5L20 5', ring: 'M0 -12a12 12 0 1 0 0.1 0' };
  const tile = h('div', { style: { width: '420px', height: '420px', border: '3px solid #2b2118', boxShadow: '6px 6px 0 #2b2118' } });
  const code = h('pre.k-code');
  const draw = () => { const t = P.size + P.spacing; const sv = `<svg xmlns='http://www.w3.org/2000/svg' width='${t}' height='${t}'><rect width='100%' height='100%' fill='${P.bg}'/><path d='${M[P.motif]}' transform='translate(${t / 2} ${t / 2}) rotate(${P.rot}) scale(${P.size / 40})' fill='${P.motif === 'dot' ? P.fg : 'none'}' stroke='${P.fg}' stroke-width='${P.stroke / (P.size / 40)}' stroke-linecap='round'/></svg>`; const url = `url("data:image/svg+xml,${encodeURIComponent(sv)}")`; tile.style.background = url; code.textContent = `background-color: ${P.bg};\nbackground-image: ${url.slice(0, 90)}…;`; };
  const win = (title, ...kids) => h('div', { style: { border: '3px solid #2b2118', background: '#fbf3e0', boxShadow: '5px 5px 0 #2b2118' } }, h('div', { style: { background: '#e0633a', color: '#fff', padding: '4px 8px', fontWeight: 800, borderBottom: '3px solid #2b2118', fontFamily: 'Courier New,monospace' } }, title), h('div', { style: { padding: '12px', display: 'grid', gap: '10px' } }, ...kids));
  root.style.fontFamily = 'Courier New,monospace';
  root.append(h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: '24px', padding: '24px' } }, h('div', { style: { display: 'grid', gap: '18px', alignContent: 'start' } }, win('MOTIF.EXE', h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '4px' } }, Object.keys(M).map((k) => btn(k.slice(0, 4), () => { P.motif = k; draw(); }))), slider('Size', 20, 120, P.size, 1, (v) => { P.size = v; draw(); }), slider('Spacing', 0, 80, P.spacing, 1, (v) => { P.spacing = v; draw(); }), slider('Rotate', 0, 180, P.rot, 1, (v) => { P.rot = v; draw(); }), slider('Stroke', 1, 14, P.stroke, 1, (v) => { P.stroke = v; draw(); })), win('COLORS', h('div.k-row', {}, h('input', { type: 'color', value: P.fg, oninput: (e) => { P.fg = e.target.value; draw(); } }), h('input', { type: 'color', value: P.bg, oninput: (e) => { P.bg = e.target.value; draw(); } }), btn('🎲', () => { P.fg = randHex(); P.bg = randHex(); draw(); })))), h('div', { style: { display: 'grid', placeItems: 'center' } }, win('PATTERN PREVIEW — seamless', tile)), h('div', { style: { display: 'grid', gap: '18px', alignContent: 'start' } }, win('EXPORT', code, btn('COPY CSS', () => copy(code.textContent), 'pri'), btn('DOWNLOAD SVG', () => toast('tile.svg saved'))))));
  draw();
  window.__demoProof = async () => { P.motif = 'squiggle'; P.rot = 45; P.size = 50; draw(); return 'rotated squiggle tile 45°'; };
};
V['svg-path-command-studio'] = (root, T) => {
  theme(root, T, { bg: '#1d1f24', fg: '#ddd', panel: '#25282e', ac: '#60a5fa', dark: true });
  let cmds = [['M', 120, 380], ['L', 170, 330], ['L', 380, 120], ['L', 440, 100], ['L', 420, 160], ['L', 210, 370], ['L', 250, 410], ['L', 220, 430], ['L', 180, 400], ['L', 140, 440], ['L', 110, 430], ['Z']];
  const svg = s('svg', { style: 'width:100%;height:100%;background:#2a2d33' }); const ta = h('textarea', { spellcheck: false, style: { width: '100%', height: '90px', background: '#15171b', color: '#9fd3ff', border: '1px solid #333', fontFamily: 'monospace', padding: '6px' } });
  const list = h('div', { style: { display: 'grid', gap: '3px', fontFamily: 'monospace', fontSize: '12px', maxHeight: '420px', overflow: 'auto' } });
  const dstr = () => cmds.map((c) => c[0] + (c.length > 1 ? ' ' + c.slice(1).map((v) => Math.round(v)).join(' ') : '')).join(' ');
  const draw = () => { svg.replaceChildren(s('path', { d: dstr(), fill: '#ffffff22', stroke: '#fff', 'stroke-width': 2 })); cmds.forEach((c, i) => { if (c.length < 3) return; const k = s('circle', { cx: c[1], cy: c[2], r: 6, fill: '#60a5fa', stroke: '#fff', style: 'cursor:grab' }); drag(k, { move: (e) => { const p = localPos(e, svg); c[1] = p.x; c[2] = p.y; draw(); } }); svg.append(k); }); ta.value = dstr(); list.replaceChildren(...cmds.map((c, i) => h('div', { style: { display: 'flex', gap: '6px', background: '#2f333a', padding: '3px 6px', borderRadius: '4px' } }, h('b', { style: { color: '#60a5fa', width: '14px' } }, c[0]), ...c.slice(1).map((v) => h('span', {}, Math.round(v)))))); };
  ta.onchange = () => { const toks = ta.value.match(/[MLZ]|-?\d+\.?\d*/gi) || []; const out = []; let cur; for (const t of toks) { if (/[MLZ]/i.test(t)) { cur = [t.toUpperCase()]; out.push(cur); } else cur?.push(+t); } cmds = out; draw(); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '300px 1fr'; root.style.gap = '0';
  root.append(panel('Path', ta, h('div.k-row', {}, btn('Scale ×1.1', () => { cmds.forEach((c) => { if (c[1] != null) { c[1] *= 1.1; c[2] *= 1.1; } }); draw(); }), btn('Translate →', () => { cmds.forEach((c) => { if (c[1] != null) c[1] += 20; }); draw(); })), h('div.k-row', {}, btn('To absolute', () => {}), btn('To relative', () => toast('Converted (demo)')), btn('Optimize', () => toast('Optimized'))), h('div.k-h', {}, 'Commands'), list), h('div', { style: { position: 'relative' } }, svg));
  draw();
  window.__demoProof = async () => { cmds[3][1] = 470; cmds[3][2] = 70; draw(); return 'dragged tip point → d-string updated'; };
};
V['svg-optimize-toggle-studio'] = (root, T) => {
  theme(root, T, { bg: '#e8e8e8', fg: '#222', panel: '#303030', ac: '#00bcd4', dark: false });
  const PL = ['Remove doctype', 'Remove XML instructions', 'Remove comments', 'Remove metadata', 'Remove editor data', 'Cleanup IDs', 'Collapse groups', 'Round/rewrite numbers', 'Merge paths', 'Minify colors', 'Remove hidden elements', 'Prefer viewBox to width/height', 'Sort attrs'];
  const on = new Set(PL.filter((_, i) => i % 4 !== 3)); let prec = 3;
  const art = s('svg', { viewBox: '0 0 200 200', width: 380, height: 380 }, s('circle', { cx: 100, cy: 100, r: 80, fill: '#00bcd4' }), s('path', { d: 'M60 120q40-80 80 0', stroke: '#fff', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }), s('circle', { cx: 75, cy: 80, r: 10, fill: '#fff' }), s('circle', { cx: 125, cy: 80, r: 10, fill: '#fff' }));
  const stat = h('div', { style: { position: 'absolute', right: '20px', bottom: '20px', background: '#fff', padding: '12px 18px', borderRadius: '6px', boxShadow: '0 4px 20px #0002', fontFamily: 'monospace' } });
  const draw = () => { const orig = 4820; const pct = 0.08 * on.size + (6 - prec) * 0.02; const sz = Math.round(orig * (1 - pct)); stat.replaceChildren(h('div', {}, `${(orig / 1024).toFixed(2)}k → `, h('b', { style: { color: '#00897b' } }, `${(sz / 1024).toFixed(2)}k`)), h('div', { style: { fontSize: '22px', fontWeight: 800 } }, `−${Math.round(pct * 100)}%`)); drawer.querySelectorAll('input[type=checkbox]').forEach((c) => (c.checked = on.has(c.dataset.n))); };
  const drawer = h('div', { style: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '320px', background: '#303030', color: '#eee', padding: '16px', overflow: 'auto', display: 'grid', gap: '6px', alignContent: 'start' } }, h('b', {}, 'Global settings'), slider('Precision', 0, 8, prec, 1, (v) => { prec = v; draw(); }), h('b', { style: { marginTop: '10px' } }, 'Features'), ...PL.map((n) => h('label.k-row', { style: { fontSize: '13px', cursor: 'pointer' } }, h('input', { type: 'checkbox', 'data-n': n, onchange: (e) => { e.target.checked ? on.add(n) : on.delete(n); draw(); } }), n)));
  const menu = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '220px', background: '#fff', boxShadow: '2px 0 10px #0002', padding: '10px 0' } }, h('div', { style: { background: '#00bcd4', color: '#fff', padding: '14px' } }, h('b', {}, 'SVGOMG-ish'), h('div', { style: { fontSize: '11px' } }, 'Powered by SVGO')), ...['📂 Open SVG', '📋 Paste markup', '🖼 Demo', '📄 Contribute'].map((x) => h('div', { style: { padding: '12px 16px' } }, x)));
  root.append(h('div', { style: { position: 'absolute', left: '220px', right: '320px', top: 0, bottom: 0, display: 'grid', placeItems: 'center', background: 'repeating-conic-gradient(#ddd 0 25%,#f5f5f5 0 50%) 0 0/20px 20px' } }, art), menu, drawer, h('div.k-row', { style: { position: 'absolute', right: '340px', top: '14px' } }, seg(['Image', 'Markup'], 'Image', () => {}), btn('⬇ Download', () => dl('optimized.svg', ser(art)), 'pri')), stat);
  stat.style.right = '340px'; draw();
  window.__demoProof = async () => { on.add('Merge paths'); on.add('Sort attrs'); prec = 1; draw(); return 'toggled plugins, precision 1 → size delta'; };
};
V['maskable-pwa-icon-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#fff', ac: '#4285f4', dark: false });
  const MASK = { Circle: '50%', Square: '0', Rounded: '22%', Squircle: '34%', Drop: '50% 50% 0 50%', Cylinder: '50% / 20%' }; let mask = 'Circle', pad = 10, bg = '#4285f4', showSafe = true;
  const icon = h('div', { style: { position: 'relative', width: '320px', height: '320px', overflow: 'hidden', margin: '0 auto', transition: '.2s' } });
  const safe = h('div', { style: { position: 'absolute', inset: '10%', borderRadius: '50%', border: '2px dashed #fff', pointerEvents: 'none' } });
  const draw = () => { icon.style.borderRadius = MASK[mask]; icon.style.background = bg; icon.replaceChildren(h('div', { style: { position: 'absolute', inset: pad + '%', display: 'grid', placeItems: 'center', fontSize: '120px' } }, '⚡'), showSafe ? safe : ''); layerList.replaceChildren(h('div.k-row', { style: { padding: '8px', background: '#e8f0fe', borderRadius: '6px' } }, h('span.k-sw', { style: { background: bg, borderRadius: '4px' } }), 'Background'), h('div.k-row', { style: { padding: '8px', border: '1px solid #eee', borderRadius: '6px' } }, '⚡', 'Emoji layer', h('span', { style: { flex: 1 } }), `pad ${pad}%`)); };
  const layerList = h('div', { style: { display: 'grid', gap: '6px' } });
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 300px';
  root.append(h('div', { style: { padding: '30px' } }, h('div.k-row', {}, h('b', { style: { fontSize: '20px' } }, '◐ Maskable-ish'), h('span', { style: { flex: 1 } }), seg(['Viewer', 'Editor'], 'Editor', () => {})), h('div', { style: { margin: '40px 0' } }, icon), h('div.k-row', { style: { justifyContent: 'center', flexWrap: 'wrap' } }, Object.keys(MASK).map((m) => h('label.k-row', { style: { cursor: 'pointer' } }, h('input', { type: 'radio', name: 'm', checked: m === mask, onchange: () => { mask = m; draw(); } }), m))), h('div', { style: { textAlign: 'center', marginTop: '14px' } }, toggle('Show safe area (minimum 80% circle)', true, (v) => { showSafe = v; draw(); }))),
    panel('Layers', btn('+ Add layer', () => toast('Layer added'), 'pri'), layerList, slider('Padding', 0, 40, pad, 1, (v) => { pad = v; draw(); }, (v) => v + '%'), h('input', { type: 'color', value: bg, oninput: (e) => { bg = e.target.value; draw(); } }), btn('Export icon (512/192/48)', () => toast('icon-512.png exported (demo)'))));
  draw();
  window.__demoProof = async () => { mask = 'Squircle'; pad = 18; draw(); return 'squircle mask + safe-zone overlay, padding 18%'; };
};
V['styled-qr-param-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#f4f4f4', ac: '#9d2f84', dark: false });
  const P = { data: 'https://qr-code-styling.com', dots: 'rounded', corners: 'extra-rounded', c1: '#4267b2', c2: '#9d2f84', grad: true, logo: true, size: 300 };
  const N = 29; const qr = s('svg', { viewBox: `0 0 ${N} ${N}`, width: 300, height: 300 });
  const draw = () => { let hs = 0; for (const ch of P.data) hs = (hs * 31 + ch.charCodeAt(0)) >>> 0; const R = rng(hs || 1); qr.replaceChildren(s('defs', {}, s('linearGradient', { id: 'qg', x1: 0, y1: 0, x2: 1, y2: 1 }, s('stop', { offset: 0, 'stop-color': P.c1 }), s('stop', { offset: 1, 'stop-color': P.grad ? P.c2 : P.c1 }))));
    const finder = (x, y) => qr.append(s('rect', { x: x + 0.5, y: y + 0.5, width: 6, height: 6, rx: P.corners === 'square' ? 0 : P.corners === 'dot' ? 3 : 1.6, fill: 'none', stroke: 'url(#qg)', 'stroke-width': 1 }), s('rect', { x: x + 2, y: y + 2, width: 3, height: 3, rx: P.corners === 'square' ? 0 : 1.5, fill: 'url(#qg)' }));
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const inF = (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9); const inLogo = P.logo && Math.abs(x - N / 2) < 4 && Math.abs(y - N / 2) < 4; if (inF || inLogo || R() < 0.5) continue; qr.append(P.dots === 'dots' ? s('circle', { cx: x + 0.5, cy: y + 0.5, r: 0.45, fill: 'url(#qg)' }) : s('rect', { x: x + 0.05, y: y + 0.05, width: 0.9, height: 0.9, rx: P.dots === 'rounded' ? 0.35 : P.dots === 'classy' ? 0.15 : 0, fill: 'url(#qg)' })); }
    finder(0, 0); finder(N - 7, 0); finder(0, N - 7); if (P.logo) qr.append(s('text', { x: N / 2, y: N / 2 + 1.3, 'text-anchor': 'middle', 'font-size': 4, 'font-weight': 900, fill: P.c2 }, 'QR')); };
  const acc = (t, ...k) => h('details', { open: t === 'Main Options', style: { background: '#fff', borderRadius: '4px', padding: '8px 10px' } }, h('summary', { style: { fontWeight: 700, cursor: 'pointer' } }, t), h('div', { style: { display: 'grid', gap: '8px', marginTop: '8px' } }, ...k));
  root.append(h('div', { style: { background: 'linear-gradient(90deg,#1e1e1e,#6d1d59 60%,#c63b8f)', color: '#fff', padding: '26px 60px' } }, h('div', { style: { fontSize: '30px', fontWeight: 800 } }, 'QR Code Styling-ish'), h('div', { style: { opacity: .8 } }, 'An open source JS library · For generating styled QR codes')),
    h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '30px', padding: '24px 60px' } }, h('div', { style: { display: 'grid', gap: '8px', background: '#f4f4f4', padding: '12px', borderRadius: '6px', alignContent: 'start' } }, acc('Main Options', h('input', { value: P.data, oninput: (e) => { P.data = e.target.value; draw(); }, style: { padding: '8px' } }), slider('Width', 100, 500, 300, 10, () => {})), acc('Dots Options', select(['rounded', 'dots', 'classy', 'square'], P.dots, (v) => { P.dots = v; draw(); }), h('div.k-row', {}, h('input', { type: 'color', value: P.c1, oninput: (e) => { P.c1 = e.target.value; draw(); } }), toggle('Gradient', true, (v) => { P.grad = v; draw(); }), h('input', { type: 'color', value: P.c2, oninput: (e) => { P.c2 = e.target.value; draw(); } }))), acc('Corners Square Options', select(['extra-rounded', 'square', 'dot'], P.corners, (v) => { P.corners = v; draw(); })), acc('Image Options', toggle('Center logo', true, (v) => { P.logo = v; draw(); })), acc('QR Options', select(['Error correction: Q', 'H', 'M', 'L'], 'Q', () => {}))), h('div', { style: { textAlign: 'center' } }, qr, h('div.k-row', { style: { justifyContent: 'center' } }, select(['PNG', 'SVG', 'JPEG', 'WEBP'], 'PNG', () => {}), btn('Download', () => dl('qr.svg', ser(qr)), 'pri')), h('div', { style: { fontSize: '11px', opacity: .5, marginTop: '8px' } }, 'Styled preview (demo encoder)'))));
  draw();
  window.__demoProof = async () => { P.dots = 'dots'; P.data = 'https://ux-gallery.example'; draw(); return 'dot style + data change → QR re-rendered'; };
};
function avatarSVG(o) {
  const skin = o.skin, g = s('svg', { viewBox: '0 0 200 200', width: o.size || 240, height: o.size || 240 });
  g.append(s('circle', { cx: 100, cy: 100, r: 96, fill: o.bg }));
  g.append(s('path', { d: 'M40 200c0-40 28-60 60-60s60 20 60 60z', fill: o.shirt }));
  g.append(s('rect', { x: 88, y: 120, width: 24, height: 26, fill: skin }), s('ellipse', { cx: 100, cy: 92, rx: 38, ry: 44, fill: skin }));
  const HAIR = { short: 'M60 85c0-35 20-50 40-50s42 12 42 50c-6-18-20-26-42-26s-34 8-40 26z', long: 'M56 90c0-40 22-56 44-56s44 16 44 56v60h-14v-60c-6-18-20-26-30-26s-24 8-30 26v60H56z', bun: 'M62 80c0-30 18-44 38-44s38 14 38 44c-8-14-20-22-38-22s-30 8-38 22zM88 22a14 14 0 1 0 24 0a14 14 0 1 0-24 0', none: '' };
  if (HAIR[o.hair]) g.append(s('path', { d: HAIR[o.hair], fill: o.hairColor }));
  const EYES = { default: [s('circle', { cx: 86, cy: 92, r: 4, fill: '#222' }), s('circle', { cx: 114, cy: 92, r: 4, fill: '#222' })], happy: [s('path', { d: 'M80 94q6-7 12 0M108 94q6-7 12 0', stroke: '#222', 'stroke-width': 3, fill: 'none' })], wink: [s('circle', { cx: 86, cy: 92, r: 4, fill: '#222' }), s('path', { d: 'M108 93h12', stroke: '#222', 'stroke-width': 3 })] };
  g.append(...(EYES[o.eyes] || EYES.default));
  const MOUTH = { smile: 'M86 110q14 12 28 0', open: 'M88 108q12 16 24 0z', serious: 'M88 112h24' }; g.append(s('path', { d: MOUTH[o.mouth] || MOUTH.smile, stroke: '#7a2b2b', 'stroke-width': 3, fill: o.mouth === 'open' ? '#7a2b2b' : 'none', 'stroke-linecap': 'round' }));
  if (o.glasses) g.append(s('path', { d: 'M74 92a12 10 0 1 0 24 0a12 10 0 1 0-24 0M102 92a12 10 0 1 0 24 0a12 10 0 1 0-24 0M98 92h4', stroke: '#222', 'stroke-width': 2.5, fill: '#ffffff33' }));
  return g;
}
V['personas-svg-avatar-composer'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', panel: '#fff', ac: '#5a4bff', dark: false });
  const o = { skin: '#f2c7a5', hair: 'long', hairColor: '#6b3e26', eyes: 'happy', mouth: 'smile', bg: '#ffd9c7', shirt: '#5a4bff', glasses: false, size: 220 };
  const q = new URLSearchParams(location.search); for (const k of Object.keys(o)) if (q.get(k)) o[k] = q.get(k);
  const card = h('div', { style: { width: '460px', margin: '0 auto', borderRadius: '24px', boxShadow: '0 20px 60px #0002', padding: '26px', background: '#fff', textAlign: 'center' } });
  const CATS = { skin: ['#f2c7a5', '#e0a878', '#b67b52', '#8d5a3b', '#5c3a23'], hairColor: ['#2b1b10', '#6b3e26', '#c98a3a', '#e8d27a', '#b33a3a', '#8a8fa0'], bg: ['#ffd9c7', '#c7e6ff', '#d9f7c7', '#f1d9ff', '#fff3b8', '#e5e5e5'], shirt: ['#5a4bff', '#ff5a7a', '#1bb57a', '#222', '#ffb020'] };
  const draw = () => { history.replaceState(null, '', '?' + new URLSearchParams(o).toString()); card.replaceChildren(avatarSVG(o), h('div', { style: { fontWeight: 700, margin: '10px 0' } }, 'Randomize ↻'), h('div.k-row', { style: { justifyContent: 'center', gap: '10px', flexWrap: 'wrap' } }, ...['hair', 'eyes', 'mouth'].map((k) => select({ hair: ['long', 'short', 'bun', 'none'], eyes: ['default', 'happy', 'wink'], mouth: ['smile', 'open', 'serious'] }[k], o[k], (v) => { o[k] = v; draw(); }))), ...Object.entries(CATS).map(([k, cs]) => h('div.k-row', { style: { justifyContent: 'center', margin: '8px 0' } }, h('span', { style: { width: '80px', fontSize: '12px', textAlign: 'right', opacity: .6 } }, k), ...cs.map((c) => h('span.k-sw', { class: o[k] === c ? 'k-sw on' : 'k-sw', style: { background: c, width: '22px', height: '22px' }, onclick: () => { o[k] = c; draw(); } })))), h('div.k-row', { style: { justifyContent: 'center', marginTop: '10px' } }, btn('PNG', () => toast('avatar.png saved')), btn('SVG', () => copy(ser(card.querySelector('svg')), 'SVG copied'), 'pri'))); };
  root.append(h('div', { style: { position: 'absolute', left: '60px', top: '120px', width: '320px' } }, h('div', { style: { fontSize: '14px', color: '#5a4bff', fontWeight: 700 } }, '◆ draftbit-ish'), h('div', { style: { font: '400 72px/1 Inter Variable', margin: '14px 0' } }, 'Personas'), h('div', { style: { opacity: .6 } }, 'A playful avatar generator for the modern age.')), h('div', { style: { position: 'absolute', left: '380px', right: '40px', top: '50px' } }, card));
  draw();
  window.__demoProof = async () => { o.hair = 'bun'; o.glasses = true; o.bg = '#c7e6ff'; draw(); return 'hair→bun, glasses, bg chip; URL synced'; };
};
V['avatar-part-composer'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', panel: '#fff', ac: '#6a39ca', dark: false });
  const o = { skin: '#edb98a', hair: 'long', hairColor: '#4a312c', eyes: 'default', mouth: 'smile', bg: '#65c9ff', shirt: '#3c4f5c', glasses: false, size: 240 };
  const prev = h('div', { style: { textAlign: 'center', margin: '20px 0' } });
  const OPTS = { 'Avatar Style': ['Circle', 'Transparent'], Top: ['long', 'short', 'bun', 'none'], '↳ Hair Color': ['#4a312c', '#2c1b18', '#b58143', '#d6b370', '#c93305'], Accessories: ['Blank', 'Glasses'], 'Eyes': ['default', 'happy', 'wink'], 'Mouth': ['smile', 'open', 'serious'], 'Skin': ['#edb98a', '#fd9841', '#d08b5b', '#ae5d29', '#614335'], 'Clothes color': ['#3c4f5c', '#65c9ff', '#ff5c5c', '#929598'] };
  const map = { Top: 'hair', '↳ Hair Color': 'hairColor', Eyes: 'eyes', Mouth: 'mouth', Skin: 'skin', 'Clothes color': 'shirt' };
  const form = h('div', { style: { display: 'grid', gridTemplateColumns: '160px 1fr', gap: '10px 16px', maxWidth: '620px', margin: '0 auto', alignItems: 'center' } });
  const draw = () => { prev.replaceChildren(avatarSVG(o)); form.replaceChildren(...Object.entries(OPTS).flatMap(([k, vs]) => [h('label', { style: { textAlign: 'right', fontSize: '14px' } }, k), select(vs, map[k] ? o[map[k]] : k === 'Accessories' ? (o.glasses ? 'Glasses' : 'Blank') : vs[0], (v) => { if (map[k]) o[map[k]] = v; if (k === 'Accessories') o.glasses = v === 'Glasses'; if (k === 'Avatar Style') o.bg = v === 'Circle' ? '#65c9ff' : 'transparent'; draw(); })])); };
  root.style.overflow = 'auto';
  root.append(h('div', { style: { maxWidth: '760px', margin: '0 auto', padding: '30px' } }, h('div.k-row', {}, h('b', { style: { color: '#6a39ca', fontSize: '26px' } }, 'avataaars generator-ish'), h('span', { style: { flex: 1 } }), btn('🎲 Random', () => { o.hair = pick(['long', 'short', 'bun']); o.eyes = pick(['default', 'happy', 'wink']); o.mouth = pick(['smile', 'open']); o.skin = pick(OPTS.Skin); o.hairColor = pick(OPTS['↳ Hair Color']); draw(); }, 'pri')), prev, form, h('div.k-row', { style: { justifyContent: 'center', marginTop: '20px' } }, btn('⬇ Download PNG', () => toast('avataaar.png')), btn('⬇ Download SVG', () => copy(ser(prev.firstChild), 'SVG copied')), btn('</> Show React', () => copy(`<Avatar topType='${o.hair}' eyeType='${o.eyes}' mouthType='${o.mouth}' />`)))));
  draw();
  window.__demoProof = async () => { o.glasses = true; o.eyes = 'happy'; draw(); return 'accessory + eyes changed → live SVG'; };
};
V['social-meta-preview-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#1d2129', panel: '#fff', ac: '#2d70f6', dark: false });
  const M = { title: 'Meta Tags — Preview, Edit and Generate', desc: 'With Meta Tags you can edit and experiment with your content then preview how your webpage will look on Google, Facebook, Twitter and more!', url: 'https://metatags.io', img: 'linear-gradient(135deg,#2d70f6,#6aa3ff)' };
  const pv = h('div', { style: { display: 'grid', gap: '22px' } }); const code = h('pre.k-code');
  const host = () => new URL(M.url).host;
  const draw = () => { pv.replaceChildren(h('div', {}, h('div.k-h', {}, 'Google'), h('div', { style: { color: '#1a0dab', fontSize: '19px' } }, M.title), h('div', { style: { color: '#006621', fontSize: '13px' } }, M.url), h('div', { style: { fontSize: '13px', color: '#545454' } }, M.desc.slice(0, 150))), h('div', {}, h('div.k-h', {}, 'Facebook'), h('div', { style: { border: '1px solid #dadde1', maxWidth: '520px' } }, h('div', { style: { height: '250px', background: M.img, display: 'grid', placeItems: 'center', color: '#fff', fontSize: '30px', fontWeight: 800 } }, '◧ Meta Tags'), h('div', { style: { background: '#f2f3f5', padding: '10px 12px' } }, h('div', { style: { fontSize: '12px', color: '#606770', textTransform: 'uppercase' } }, host()), h('div', { style: { fontWeight: 700 } }, M.title), h('div', { style: { fontSize: '13px', color: '#606770' } }, M.desc.slice(0, 90))))), h('div', {}, h('div.k-h', {}, 'Twitter / X'), h('div', { style: { border: '1px solid #e1e8ed', borderRadius: '14px', overflow: 'hidden', maxWidth: '520px' } }, h('div', { style: { height: '180px', background: M.img } }), h('div', { style: { padding: '10px' } }, h('b', {}, M.title), h('div', { style: { color: '#8899a6', fontSize: '13px' } }, host())))));
    code.textContent = `<title>${M.title}</title>\n<meta name="description" content="${M.desc}" />\n<meta property="og:type" content="website" />\n<meta property="og:url" content="${M.url}" />\n<meta property="og:title" content="${M.title}" />\n<meta property="og:image" content="${M.url}/og.png" />\n<meta property="twitter:card" content="summary_large_image" />`; };
  const f = (k, area) => h(area ? 'textarea' : 'input', { value: M[k], oninput: (e) => { M[k] = e.target.value; try { draw(); } catch {} }, style: { width: '100%', padding: '8px', border: '1px solid #dde', borderRadius: '6px', minHeight: area ? '80px' : '' } });
  const ta = f('desc', true); ta.value = M.desc;
  root.append(h('div.k-row', { style: { height: '54px', padding: '0 30px', borderBottom: '1px solid #eee' } }, h('b', { style: { color: '#2d70f6' } }, '◧ Meta Tags-ish'), h('span', { style: { flex: 1 } }), 'Meta Tags Toolkit'), h('div', { style: { position: 'absolute', inset: '54px 0 0 0', display: 'grid', gridTemplateColumns: '360px 1fr', gap: '30px', padding: '20px 30px', overflow: 'auto' } }, h('div', { style: { display: 'grid', gap: '10px', alignContent: 'start' } }, h('div.k-h', {}, 'Metadata'), f('url'), h('div', { style: { height: '140px', borderRadius: '8px', background: M.img } }), f('title'), ta, btn('Copy meta HTML', () => copy(code.textContent, 'Meta tags copied'), 'pri'), code), h('div', {}, h('b', {}, 'Preview'), pv)));
  draw();
  window.__demoProof = async () => { M.title = 'UX Technique Gallery — 217 interactive clones'; draw(); return 'title edited → all previews + meta HTML updated'; };
};

V['icones-icon-explorer-desk'] = (root, T) => {
  theme(root, T, { bg: '#fafafa', fg: '#222', ac: '#111', dark: false });
  const ICONS = {
    lucide: {
      name: 'Lucide', author: 'Lucide Contributors', license: 'ISC',
      glyphs: {
        home: 'M3 12l9-9 9 9M5 10v10h14V10', search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3', settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
        heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z', star: 'M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z',
        moon: 'M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z', sun: 'M12 4V2M12 22v-2M4.9 4.9L3.5 3.5M20.5 20.5l-1.4-1.4M4 12H2M22 12h-2M4.9 19.1L3.5 20.5M20.5 3.5l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
        copy: 'M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2M6 10h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z',
        download: 'M12 3v12M7 10l5 5 5-5M5 21h14', user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
        mail: 'M4 6h16v12H4zM4 6l8 7 8-7', bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0',
        check: 'M5 12l5 5L20 7', x: 'M6 6l12 12M18 6L6 18', plus: 'M12 5v14M5 12h14', trash: 'M4 7h16M9 7V5h6v2M7 7l1 14h8l1-14',
        edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z', eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
        lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6z', zap: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
        folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
        image: 'M4 5h16v14H4zM4 15l4-4 3 3 3-4 6 5', code: 'M8 8l-4 4 4 4M16 8l4 4-4 4',
        globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20',
        menu: 'M4 7h16M4 12h16M4 17h16', arrow: 'M5 12h14M13 6l6 6-6 6'
      }
    },
    tabler: {
      name: 'Tabler', author: 'Tabler', license: 'MIT',
      glyphs: {
        home: 'M5 12l7-7 7 7M9 21V12h6v9', search: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4-4',
        settings: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15l1 1.7-1.7 3-2-.4a7.5 7.5 0 0 1-1.7 1l-.4 2h-3.4l-.4-2a7.5 7.5 0 0 1-1.7-1l-2 .4-1.7-3 1-1.7a7.5 7.5 0 0 1 0-2l-1-1.7 1.7-3 2 .4a7.5 7.5 0 0 1 1.7-1l.4-2h3.4l.4 2a7.5 7.5 0 0 1 1.7 1l2-.4 1.7 3-1 1.7a7.5 7.5 0 0 1 0 2z',
        heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z', star: 'M12 3l2.5 6.5H21l-5.2 4 2 6.5L12 16.5 6.2 20l2-6.5L3 9.5h6.5z',
        moon: 'M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z', sun: 'M12 5V3M12 21v-2M5 12H3M21 12h-2M6.3 6.3L4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7L4.9 19.1M19.1 4.9l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
        copy: 'M8 8V6h10v10h-2M6 10h10v10H6z', download: 'M4 17v2h16v-2M12 3v12M8 11l4 4 4-4',
        user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM6 21v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1',
        mail: 'M3 7h18v12H3zM3 7l9 6 9-6', bell: 'M10 21h4M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9',
        check: 'M5 13l4 4L19 7', x: 'M18 6L6 18M6 6l12 12', plus: 'M12 5v14M5 12h14',
        trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3',
        edit: 'M4 20h4l10-10-4-4L4 16v4zM14 6l4 4', eye: 'M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
        lock: 'M8 11V8a4 4 0 0 1 8 0v3M6 11h12v10H6z', zap: 'M13 2L5 13h6l-1 9 9-12h-6z',
        folder: 'M3 6h6l2 2h10v12H3z', image: 'M4 6h16v12H4zM4 14l4-3 3 2 4-4 5 5',
        code: 'M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16', globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18-3-3-3-15 0-18',
        menu: 'M4 8h16M4 12h16M4 16h16', arrow: 'M5 12h14M15 6l6 6-6 6'
      }
    },
    phosphor: {
      name: 'Phosphor', author: 'Phosphor Icons', license: 'MIT',
      glyphs: {
        home: 'M4 12l8-8 8 8v9H4zM9 21v-7h6v7', search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5',
        settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4',
        heart: 'M12 21S4 15.5 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 21 12 21z',
        star: 'M12 2.5l2.9 6.2 6.6.6-5 4.4 1.5 6.5L12 16.8 5.9 20.2l1.5-6.5-5-4.4 6.6-.6z',
        moon: 'M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z', sun: 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
        copy: 'M8 8V5h11v11h-3M5 8h11v11H5z', download: 'M12 3v12M7 11l5 5 5-5M4 19h16',
        user: 'M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1',
        mail: 'M3 6h18v12H3zM3 7l9 7 9-7', bell: 'M6 9a6 6 0 0 1 12 0c0 6 2 8 2 8H4s2-2 2-8M10 20a2 2 0 0 0 4 0',
        check: 'M4 12l6 6L20 6', x: 'M6 6l12 12M18 6L6 18', plus: 'M12 4v16M4 12h16',
        trash: 'M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13', edit: 'M4 20h4L18 10l-4-4L4 16v4z',
        eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
        lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z', zap: 'M13 2L4 13h7l-1 9 10-12h-7z',
        folder: 'M3 7h6l2 2h10v11H3z', image: 'M3 5h18v14H3zM3 15l5-4 3 3 4-5 5 6',
        code: 'M8 8L4 12l4 4M16 8l4 4-4 4', globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a16 16 0 0 1 4 10 16 16 0 0 1-4 10 16 16 0 0 1-4-10A16 16 0 0 1 12 2z',
        menu: 'M4 7h16M4 12h16M4 17h16', arrow: 'M4 12h16M14 6l6 6-6 6'
      }
    }
  };
  let dark = false, view = 'home', colKey = 'lucide', q = '', sel = null, size = 48, col = '#222';
  const shell = h('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background .2s,color .2s' } });
  root.append(shell);
  const applyTheme = () => {
    shell.style.background = dark ? '#121212' : '#fafafa';
    shell.style.color = dark ? '#eee' : '#222';
    col = dark ? '#eee' : '#222';
    render();
  };
  const svgOf = (d, sz = 24, c = col) => s('svg', { viewBox: '0 0 24 24', width: sz, height: sz, fill: 'none', stroke: c, 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s('path', { d }));
  const fuzzy = (name, query) => { if (!query) return true; const n = name.toLowerCase(), qq = query.toLowerCase(); let i = 0; for (const ch of n) if (ch === qq[i]) i++; return i === qq.length || n.includes(qq); };
  const header = () => h('div.k-row', { style: { height: '56px', padding: '0 24px', gap: '12px' } },
    h('b', { style: { font: '400 28px/1 Georgia,serif', letterSpacing: '-.02em', cursor: 'pointer' }, onclick: () => { view = 'home'; sel = null; render(); } }, 'Icônes'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: .55, cursor: 'pointer' } }, '⌥ GitHub'),
    h('span', { style: { opacity: .55, cursor: 'pointer' } }, '⚙'),
    h('span', { style: { cursor: 'pointer', fontSize: '18px' }, onclick: () => { dark = !dark; applyTheme(); } }, dark ? '☾' : '☀'));
  const searchBar = (ph, on) => h('div', { style: { padding: '0 24px 16px' } },
    h('div.k-row', { style: { background: dark ? '#1e1e1e' : '#fff', border: `1px solid ${dark ? '#333' : '#e5e5e5'}`, borderRadius: '10px', padding: '10px 14px', gap: '10px' } },
      h('span', { style: { opacity: .45 } }, '🔍'),
      h('input', { value: q, placeholder: ph, style: { flex: 1, border: 0, outline: 'none', background: 'transparent', color: 'inherit', fontSize: '15px' }, oninput: (e) => { q = e.target.value; on(); } })));
  const card = (key, pack) => {
    const names = Object.keys(pack.glyphs).slice(0, 9);
    return h('div', { style: { background: dark ? '#1a1a1a' : '#fff', border: `1px solid ${dark ? '#2a2a2a' : '#e8e8e8'}`, borderRadius: '10px', padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', cursor: 'pointer' }, onclick: () => { view = 'collection'; colKey = key; q = ''; sel = null; render(); } },
      h('div', {},
        h('b', { style: { fontSize: '15px' } }, pack.name),
        h('div', { style: { fontSize: '12px', opacity: .55, marginTop: '4px' } }, `${pack.author} · ${pack.license}`),
        h('div', { style: { fontSize: '12px', opacity: .7, marginTop: '8px' } }, `${Object.keys(pack.glyphs).length} icons`)),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,22px)', gap: '4px' } }, ...names.map((n) => svgOf(pack.glyphs[n], 18, dark ? '#ccc' : '#444'))));
  };
  const drawer = () => {
    if (!sel) return '';
    const d = ICONS[colKey].glyphs[sel];
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${col}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
    const jsx = `<Icon name="${sel}" size={${size}} color="${col}" />`;
    return h('div', { style: { width: '280px', borderLeft: `1px solid ${dark ? '#2a2a2a' : '#e8e8e8'}`, padding: '16px', display: 'grid', gap: '12px', alignContent: 'start', background: dark ? '#161616' : '#fff' } },
      h('div.k-row', {}, h('b', {}, sel), h('span', { style: { flex: 1 } }), h('span', { style: { cursor: 'pointer' }, onclick: () => { sel = null; render(); } }, '✕')),
      h('div', { style: { display: 'grid', placeItems: 'center', height: '140px', background: dark ? '#0e0e0e' : '#f5f5f5', borderRadius: '10px' } }, svgOf(d, size, col)),
      h('div', {}, h('div', { style: { fontSize: '11px', opacity: .55 } }, 'Size'), h('input', { type: 'range', min: 16, max: 96, value: size, oninput: (e) => { size = +e.target.value; render(); } })),
      h('div', {}, h('div', { style: { fontSize: '11px', opacity: .55 } }, 'Color'), h('input', { type: 'color', value: col.startsWith('#') && col.length === 7 ? col : '#222222', oninput: (e) => { col = e.target.value; render(); } })),
      btn('Copy SVG', () => copy(svgStr, 'SVG'), 'pri'),
      btn('Copy JSX', () => copy(jsx, 'JSX')),
      btn('Download SVG', () => dl(sel + '.svg', svgStr)));
  };
  const collectionView = () => {
    const pack = ICONS[colKey];
    const names = Object.keys(pack.glyphs).filter((n) => fuzzy(n, q));
    const side = h('div', { style: { width: '220px', borderRight: `1px solid ${dark ? '#2a2a2a' : '#e8e8e8'}`, padding: '12px', overflow: 'auto', fontSize: '13px' } },
      h('div', { style: { opacity: .5, marginBottom: '8px' } }, 'Collections'),
      ...Object.entries(ICONS).map(([k, p]) => h('div', { style: { padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', background: k === colKey ? (dark ? '#2a2a2a' : '#eee') : 'transparent' }, onclick: () => { colKey = k; sel = null; q = ''; render(); } }, h('b', {}, p.name), h('span', { style: { float: 'right', opacity: .5 } }, Object.keys(p.glyphs).length))));
    const grid = h('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
      searchBar('Search icons…', () => render()),
      h('div', { style: { padding: '0 16px 8px', fontSize: '13px', opacity: .6 } }, `${pack.name} · ${names.length} icons`),
      h('div', { style: { flex: 1, overflow: 'auto', padding: '8px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(88px,1fr))', gap: '6px', alignContent: 'start' } },
        ...names.map((n) => h('button', { title: n, style: { border: `1px solid ${sel === n ? (dark ? '#888' : '#111') : (dark ? '#2a2a2a' : '#eee')}`, background: dark ? '#1a1a1a' : '#fff', borderRadius: '8px', padding: '14px 8px', cursor: 'pointer', color: 'inherit', display: 'grid', gap: '8px', placeItems: 'center' }, onclick: () => { sel = n; render(); } }, svgOf(pack.glyphs[n], 28), h('span', { style: { fontSize: '10px', opacity: .65 } }, n)))),
      h('div.k-row', { style: { padding: '10px 16px', gap: '8px' } }, btn('Load More', () => toast('All local icons loaded')), btn('Load All', () => toast('All loaded'))));
    return h('div', { style: { flex: 1, display: 'flex', overflow: 'hidden' } }, side, grid, drawer());
  };
  const homeView = () => h('div', { style: { flex: 1, overflow: 'auto' } },
    searchBar('Search category…', () => render()),
    h('div', { style: { padding: '0 24px 24px' } },
      h('div', { style: { fontSize: '12px', opacity: .5, margin: '8px 0' } }, 'UI 24px'),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '12px' } },
        ...Object.entries(ICONS).filter(([k, p]) => !q || fuzzy(p.name, q) || fuzzy(k, q)).map(([k, p]) => card(k, p)))));
  function render() {
    shell.replaceChildren(header(), view === 'home' ? homeView() : collectionView());
  }
  applyTheme();
  window.__demoProof = async () => {
    view = 'collection'; colKey = 'lucide'; q = 'he'; render();
    await sleep(100);
    sel = Object.keys(ICONS.lucide.glyphs).find((n) => fuzzy(n, 'he')) || 'heart';
    render();
    await copy(`<svg><path d="${ICONS.lucide.glyphs[sel]}"/></svg>`, 'SVG');
    dark = true; applyTheme();
    return `collection+filter(${q})+detail ${sel}+copy+dark`;
  };
};


V['svgomg-optimize-toggle-desk'] = (root, T) => {
  theme(root, T, { bg: '#303030', fg: '#f0f0f0', panel: '#303030', ac: '#e91e8c', dark: true });
  const CATS = [
    ['Global', ['Remove doctype', 'Remove XML proc. instruction', 'Remove comments', 'Remove metadata', 'Remove title', 'Remove desc']],
    ['Cleanup', ['Cleanup attrs', 'Cleanup IDs', 'Remove unused NS', 'Convert colors', 'Remove empty attrs', 'Remove empty containers']],
    ['Shapes', ['Convert shape to path', 'Merge paths', 'Convert path data', 'Remove hidden elems', 'Round/rewrite numbers', 'Sort attrs']],
  ];
  const ALL = CATS.flatMap(([, opts]) => opts);
  const on = new Set(ALL.filter((_, i) => i % 3 !== 2));
  let prec = 3;
  let checker = true;
  let view = 'Image'; // Image | Markup
  const SAMPLE = `<?xml version="1.0"?>
<!-- demo icon -->
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <metadata>svgomg-demo</metadata>
  <circle cx="100.000" cy="100.000" r="78.500" fill="#E91E8C"/>
  <path d="M 62.25 118.00 Q 100.00 48.00 137.75 118.00" stroke="#FFFFFF" stroke-width="12.000" fill="none" stroke-linecap="round"/>
  <circle cx="78.000" cy="82.000" r="9.000" fill="#FFFFFF"/>
  <circle cx="122.000" cy="82.000" r="9.000" fill="#FFFFFF"/>
  <g id="unused-group"><rect x="0" y="0" width="0" height="0" fill="#000000"/></g>
</svg>`;
  let raw = SAMPLE;
  const optimize = (src) => {
    let out = src;
    if (on.has('Remove comments')) out = out.replace(/<!--[\s\S]*?-->/g, '');
    if (on.has('Remove doctype')) out = out.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
    if (on.has('Remove XML proc. instruction')) out = out.replace(/<\?xml[\s\S]*?\?>/gi, '');
    if (on.has('Remove metadata')) out = out.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
    if (on.has('Remove title')) out = out.replace(/<title[\s\S]*?<\/title>/gi, '');
    if (on.has('Remove desc')) out = out.replace(/<desc[\s\S]*?<\/desc>/gi, '');
    if (on.has('Remove empty containers')) out = out.replace(/<g[^>]*>\s*<\/g>/gi, '').replace(/<g[^>]*>\s*<rect[^>]*width="0"[^>]*\/?>\s*<\/g>/gi, '');
    if (on.has('Remove hidden elems')) out = out.replace(/<rect[^>]*width="0"[^>]*\/?>/gi, '');
    if (on.has('Convert colors')) out = out.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3').replace(/#FFFFFF/gi, '#fff').replace(/#000000/gi, '#000');
    if (on.has('Round/rewrite numbers')) {
      const p = prec;
      out = out.replace(/-?\d+\.\d+/g, (n) => {
        const v = (+n).toFixed(p); return v.replace(/\.?0+$/, '') || '0';
      });
    }
    if (on.has('Cleanup attrs')) out = out.replace(/\s{2,}/g, ' ').replace(/\s+>/g, '>');
    if (on.has('Cleanup IDs')) out = out.replace(/\s+id="[^"]*"/g, '');
    if (on.has('Sort attrs')) out = out; // stub visual
    if (on.has('Merge paths')) out = out; // stub
    if (on.has('Convert shape to path')) out = out;
    if (on.has('Convert path data')) out = out;
    if (on.has('Remove unused NS')) out = out;
    if (on.has('Remove empty attrs')) out = out.replace(/\s+\w+=""/g, '');
    return out.trim();
  };
  let opt = optimize(raw);
  const bytes = (s) => new TextEncoder().encode(s).length;
  const preview = h('div', { style: { width: '100%', height: '100%', display: 'grid', placeItems: 'center' } });
  const markup = h('pre', { style: { display: 'none', margin: 0, padding: '16px', font: '12px/1.5 ui-monospace,monospace', color: '#e8e8e8', whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflow: 'auto', height: '100%', boxSizing: 'border-box' } });
  const stage = h('div', { style: { position: 'absolute', left: '280px', right: 0, top: '48px', bottom: '56px' } }, preview, markup);
  const drop = h('div', { style: { display: 'none', position: 'absolute', inset: 0, background: '#000a', placeItems: 'center', zIndex: 8, color: '#fff', fontSize: '18px', fontWeight: 700 } }, 'Drop SVG here');
  const stat = h('div', { style: { position: 'absolute', right: '16px', bottom: '64px', background: '#fff', color: '#222', padding: '10px 14px', borderRadius: '8px', fontFamily: 'ui-monospace,monospace', fontSize: '12px', boxShadow: '0 8px 28px #0005', zIndex: 6, minWidth: '140px' } });
  const sync = () => {
    opt = optimize(raw);
    const o = bytes(raw), n = bytes(opt);
    const pct = o ? Math.round((1 - n / o) * 100) : 0;
    stat.replaceChildren(
      h('div', {}, h('span', { style: { opacity: .55 } }, 'Original '), h('b', {}, o + ' B')),
      h('div', {}, h('span', { style: { opacity: .55 } }, 'Optimized '), h('b', { style: { color: '#00897b' } }, n + ' B')),
      h('div', { style: { fontSize: '22px', fontWeight: 800, color: pct > 0 ? '#00897b' : '#666' } }, (pct > 0 ? '−' : '') + pct + '%'));
    markup.textContent = opt;
    preview.style.background = checker
      ? 'repeating-conic-gradient(#cfcfcf 0 25%, #f3f3f3 0 50%) 0 0 / 20px 20px'
      : '#2a2a2a';
    try {
      const doc = new DOMParser().parseFromString(opt, 'image/svg+xml');
      const svgEl = doc.documentElement;
      if (svgEl && svgEl.nodeName === 'svg') {
        svgEl.setAttribute('width', '360'); svgEl.setAttribute('height', '360');
        preview.replaceChildren(document.importNode(svgEl, true));
      } else preview.textContent = 'Invalid SVG';
    } catch { preview.textContent = 'Parse error'; }
    preview.style.display = view === 'Image' ? 'grid' : 'none';
    markup.style.display = view === 'Markup' ? 'block' : 'none';
    drawer.querySelectorAll('input[type=checkbox]').forEach((c) => { c.checked = on.has(c.dataset.n); });
  };
  const mkSwitch = (n) => {
    const lab = h('label', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '7px 4px', fontSize: '12.5px', cursor: 'pointer', borderBottom: '1px solid #ffffff10' } },
      h('span', {}, n),
      h('input', { type: 'checkbox', 'data-n': n, checked: on.has(n), style: { accentColor: '#e91e8c', width: '18px', height: '18px' }, onchange: (e) => { e.target.checked ? on.add(n) : on.delete(n); sync(); } }));
    return lab;
  };
  const drawer = h('div', { style: { position: 'absolute', left: 0, top: '48px', bottom: 0, width: '280px', background: '#303030', borderRight: '1px solid #ffffff14', overflow: 'auto', padding: '10px 12px 24px', display: 'grid', gap: '4px', alignContent: 'start', zIndex: 5 } },
    h('b', { style: { fontSize: '11px', letterSpacing: '.08em', opacity: .55, margin: '4px 0' } }, 'GLOBAL SETTINGS'),
    slider('Precision', 0, 8, prec, 1, (v) => { prec = v; sync(); }),
    ...CATS.flatMap(([cat, opts]) => [h('b', { style: { fontSize: '11px', letterSpacing: '.08em', opacity: .55, margin: '12px 0 4px' } }, cat.toUpperCase()), ...opts.map(mkSwitch)]));

  const loadSample = () => { raw = SAMPLE; sync(); toast('Sample SVG loaded'); };
  const onFile = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => { raw = String(r.result || ''); sync(); toast('SVG loaded'); };
    r.readAsText(file);
  };

  root.append(
    h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: '48px', background: '#e91e8c', color: '#fff', padding: '0 14px', zIndex: 6, gap: '14px' } },
      h('b', { style: { fontSize: '16px' } }, 'SVGOMG'),
      h('span', { style: { fontSize: '11px', opacity: .85 } }, 'SVGO Magical GUI'),
      h('span', { style: { flex: 1 } }),
      btn('Open SVG', () => fileInp.click()),
      btn('Paste markup', () => { const t = prompt('Paste SVG markup', raw.slice(0, 200)); if (t != null && t.trim()) { raw = t; sync(); } }),
      btn('Demo', loadSample, 'pri')),
    drawer, stage, drop, stat,
    h('div.k-row', { style: { position: 'absolute', left: '280px', right: 0, bottom: 0, height: '56px', background: '#252525', borderTop: '1px solid #ffffff14', padding: '0 16px', zIndex: 6, gap: '12px' } },
      seg([['Image', 'Image'], ['Markup', 'Markup']], 'Image', (v) => { view = v; sync(); }),
      toggle('Checkerboard', true, (v) => { checker = v; sync(); }),
      h('span', { style: { flex: 1 } }),
      btn('Copy markup', () => copy(opt, 'Optimized SVG copied'), 'pri'),
      btn('Download', () => dl('optimized.svg', opt))),
  );
  // style primary header buttons
  root.querySelectorAll('.k-btn').forEach((b) => {
    if (b.textContent === 'Demo') { b.style.background = '#fff'; b.style.color = '#e91e8c'; }
    else if (b.closest('[style*="e91e8c"]')) { b.style.background = '#ffffff22'; b.style.borderColor = 'transparent'; b.style.color = '#fff'; }
  });
  const fileInp = h('input', { type: 'file', accept: '.svg,image/svg+xml', style: { display: 'none' }, onchange: (e) => onFile(e.target.files?.[0]) });
  root.append(fileInp);
  // drag-drop on stage
  stage.addEventListener('dragover', (e) => { e.preventDefault(); drop.style.display = 'grid'; });
  stage.addEventListener('dragleave', () => { drop.style.display = 'none'; });
  stage.addEventListener('drop', (e) => { e.preventDefault(); drop.style.display = 'none'; onFile(e.dataTransfer?.files?.[0]); });
  sync();
  window.__demoProof = async () => {
    loadSample(); await sleep(60);
    on.add('Round/rewrite numbers'); on.add('Convert colors'); on.add('Remove comments');
    prec = 1; drawer.querySelector('input[type=range]').value = 1;
    sync(); await sleep(80);
    view = 'Markup'; sync(); await sleep(60);
    view = 'Image'; checker = false; sync(); await sleep(40);
    checker = true; sync();
    copy(opt);
    return `toggles ${on.size}; precision ${prec}; bytes ${bytes(raw)}→${bytes(opt)}; markup+checker exercised`;
  };
};

V['boxy-svg-craft-editor'] = (root, T) => {
  theme(root, T, { bg: '#e8e8e8', fg: '#333', panel: '#f5f5f5', ac: '#5e7c9e', dark: false });
  root.style.overflow = 'hidden';
  root.style.display = 'grid';
  root.style.gridTemplateRows = '28px 36px 1fr 28px';
  root.style.background = '#e8e8e8';

  const TOOLS = [
    ['select', '↖'], ['rect', '▭'], ['ellipse', '◯'],
    ['line', '╱'], ['pen', '✎'], ['text', 'A'],
  ];
  let tool = 'select';
  let fill = '#5e7c9e';
  let stroke = '#222222';
  let strokeW = 2;
  let opacity = 1;
  const layers = [];
  let selected = null;
  let dragState = null;
  let penPts = null;
  let idSeq = 1;

  const menu = h('div.k-row', {
    style: {
      height: '28px', background: '#f0f0f0', borderBottom: '1px solid #ccc',
      padding: '0 10px', gap: '14px', fontSize: '12px',
    },
  },
    ...['File', 'Edit', 'View', 'Object', 'Shape', 'Text', 'Tools', 'Help'].map((m) =>
      h('span', { style: { cursor: 'default', opacity: .8 } }, m)),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '11px', opacity: .5 } }, 'Boxy SVG-ish'),
  );

  const ctx = h('div.k-row', {
    style: {
      height: '36px', background: '#f7f7f7', borderBottom: '1px solid #ddd',
      padding: '0 10px', gap: '8px', fontSize: '12px',
    },
  },
    btn('Undo', () => toast('Nothing to undo')),
    btn('Redo', () => {}),
    h('span', { style: { width: '1px', height: '18px', background: '#ccc', margin: '0 4px' } }),
    btn('Copy SVG', () => copy(serialize(), 'SVG copied'), 'pri'),
    btn('Download', () => {
      const a = h('a', { download: 'boxy-craft.svg', href: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialize()) });
      a.click(); toast('boxy-craft.svg downloaded');
    }),
    h('span', { style: { flex: 1 } }),
  );
  const layerCountLab = h('span', { style: { fontSize: '11px', opacity: .55 } }, '0 layers');
  ctx.append(layerCountLab);

  const body = h('div', {
    style: { display: 'grid', gridTemplateColumns: '48px 1fr 240px', minHeight: 0, position: 'relative' },
  });

  const toolRail = h('div', {
    style: {
      background: '#f5f5f5', borderRight: '1px solid #ddd', display: 'grid',
      gap: '4px', padding: '8px 6px', alignContent: 'start',
    },
  });
  const toolBtns = {};
  const setTool = (t) => {
    tool = t;
    Object.entries(toolBtns).forEach(([k, b]) => {
      b.style.background = k === t ? '#5e7c9e' : 'transparent';
      b.style.color = k === t ? '#fff' : '#333';
    });
  };
  TOOLS.forEach(([id, ic]) => {
    const b = h('button', {
      title: id,
      style: {
        width: '36px', height: '36px', border: '1px solid #ddd', borderRadius: '6px',
        background: id === 'select' ? '#5e7c9e' : 'transparent',
        color: id === 'select' ? '#fff' : '#333', cursor: 'pointer', fontSize: '16px',
      },
      onclick: () => setTool(id),
    }, ic);
    toolBtns[id] = b;
    toolRail.append(b);
  });
  toolRail.append(h('div', {
    style: {
      marginTop: '8px', background: '#3b82f6', color: '#fff', fontSize: '10px',
      fontWeight: 800, textAlign: 'center', borderRadius: '4px', padding: '4px 0',
    },
  }, 'SVG'));

  const boardWrap = h('div', {
    style: {
      position: 'relative', background: '#d8d8d8', overflow: 'hidden',
      backgroundImage: 'linear-gradient(#ccc 1px,transparent 1px),linear-gradient(90deg,#ccc 1px,transparent 1px)',
      backgroundSize: '20px 20px',
    },
  });
  const art = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '50%', width: '520px', height: '360px',
      marginLeft: '-260px', marginTop: '-180px', background: '#fff',
      boxShadow: '0 8px 32px #0002', border: '1px solid #bbb', overflow: 'hidden', cursor: 'crosshair',
    },
  });
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 520 360');
  svg.setAttribute('width', '520');
  svg.setAttribute('height', '360');
  Object.assign(svg.style, { position: 'absolute', inset: 0, width: '100%', height: '100%' });
  // grid inside artboard
  const gridG = document.createElementNS(svgNS, 'g');
  gridG.setAttribute('stroke', '#eee');
  gridG.setAttribute('stroke-width', '1');
  for (let x = 40; x < 520; x += 40) {
    const l = document.createElementNS(svgNS, 'line');
    l.setAttribute('x1', x); l.setAttribute('x2', x); l.setAttribute('y1', 0); l.setAttribute('y2', 360);
    gridG.appendChild(l);
  }
  for (let y = 40; y < 360; y += 40) {
    const l = document.createElementNS(svgNS, 'line');
    l.setAttribute('x1', 0); l.setAttribute('x2', 520); l.setAttribute('y1', y); l.setAttribute('y2', y);
    gridG.appendChild(l);
  }
  svg.appendChild(gridG);
  const drawG = document.createElementNS(svgNS, 'g');
  svg.appendChild(drawG);
  art.append(svg);
  boardWrap.append(art);

  const side = h('div', {
    style: {
      background: '#f5f5f5', borderLeft: '1px solid #ddd', display: 'grid',
      gridTemplateRows: 'auto 1fr', fontSize: '12px', minHeight: 0,
    },
  });
  const insp = h('div', { style: { padding: '12px', display: 'grid', gap: '10px', borderBottom: '1px solid #ddd' } },
    h('b', {}, 'Inspector'),
    h('div.k-row', {}, h('span', { style: { width: '56px' } }, 'Fill'),
      h('input', { type: 'color', value: fill, oninput: (e) => { fill = e.target.value; applyStyle(); } })),
    h('div.k-row', {}, h('span', { style: { width: '56px' } }, 'Stroke'),
      h('input', { type: 'color', value: stroke, oninput: (e) => { stroke = e.target.value; applyStyle(); } })),
    slider('Stroke W', 0, 12, strokeW, 1, (v) => { strokeW = v; applyStyle(); }),
    slider('Opacity', 0.1, 1, opacity, 0.05, (v) => { opacity = v; applyStyle(); }, (v) => Math.round(v * 100) + '%'),
    btn('Delete selected', () => { if (selected) removeLayer(selected); }, ''),
  );
  const layerList = h('div', { style: { padding: '10px 12px', overflow: 'auto', display: 'grid', gap: '4px', alignContent: 'start' } },
    h('b', { style: { marginBottom: '4px' } }, 'Layers'));
  side.append(insp, layerList);

  function serialize() {
    const clone = svg.cloneNode(true);
    const g0 = clone.querySelector('g');
    if (g0) g0.remove(); // drop grid
    return '<?xml version="1.0"?>\n' + new XMLSerializer().serializeToString(clone);
  }
  function applyStyle() {
    if (!selected) return;
    const el = selected.el;
    if (el.tagName === 'text') {
      el.setAttribute('fill', fill);
      el.setAttribute('opacity', opacity);
    } else {
      el.setAttribute('fill', el.tagName === 'line' || el.tagName === 'polyline' ? 'none' : fill);
      el.setAttribute('stroke', stroke);
      el.setAttribute('stroke-width', strokeW);
      el.setAttribute('opacity', opacity);
    }
    selected.fill = fill; selected.stroke = stroke; selected.strokeW = strokeW; selected.opacity = opacity;
  }
  function selectLayer(L) {
    selected = L;
    layers.forEach((x) => x.el.setAttribute('stroke-dasharray', x === L ? '4 3' : null));
    if (L && L.el.tagName !== 'line' && L.el.tagName !== 'polyline') {
      // keep dash only as selection hint on stroke
    }
    renderLayers();
    if (L) {
      fill = L.fill || fill; stroke = L.stroke || stroke;
      strokeW = L.strokeW ?? strokeW; opacity = L.opacity ?? opacity;
      insp.querySelectorAll('input[type=color]')[0].value = fill;
      insp.querySelectorAll('input[type=color]')[1].value = stroke;
    }
  }
  function renderLayers() {
    layerCountLab.textContent = `${layers.length} layers`;
    const rows = layers.slice().reverse().map((L) => h('div.k-row', {
      style: {
        padding: '6px 8px', borderRadius: '6px', gap: '8px', cursor: 'pointer',
        background: selected === L ? '#dbe4f0' : '#fff', border: '1px solid #e0e0e0',
      },
      onclick: () => selectLayer(L),
    },
      h('input', {
        type: 'checkbox', checked: L.visible !== false,
        onclick: (e) => e.stopPropagation(),
        onchange: (e) => {
          L.visible = e.target.checked;
          L.el.setAttribute('display', L.visible ? 'inline' : 'none');
        },
      }),
      h('span', { style: { flex: 1, fontWeight: selected === L ? 700 : 400 } }, L.name),
      h('span', {
        style: { opacity: .45, cursor: 'pointer' },
        onclick: (e) => { e.stopPropagation(); removeLayer(L); },
      }, '✕'),
    ));
    layerList.replaceChildren(h('b', { style: { marginBottom: '4px' } }, 'Layers'), ...rows);
  }
  function removeLayer(L) {
    drawG.removeChild(L.el);
    const i = layers.indexOf(L);
    if (i >= 0) layers.splice(i, 1);
    if (selected === L) selected = null;
    renderLayers();
  }
  function addLayer(el, kind) {
    const L = {
      id: idSeq++, name: kind[0].toUpperCase() + kind.slice(1) + ' ' + idSeq,
      el, kind, fill, stroke, strokeW, opacity, visible: true,
    };
    layers.push(L);
    selectLayer(L);
    renderLayers();
    return L;
  }
  function localXY(e) {
    const r = art.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 520,
      y: ((e.clientY - r.top) / r.height) * 360,
    };
  }

  art.addEventListener('pointerdown', (e) => {
    const p = localXY(e);
    if (tool === 'select') {
      let hit = null;
      for (let i = layers.length - 1; i >= 0; i--) {
        const L = layers[i];
        if (L.visible === false) continue;
        const bb = L.el.getBBox?.();
        if (!bb) continue;
        if (p.x >= bb.x && p.x <= bb.x + bb.width && p.y >= bb.y && p.y <= bb.y + bb.height) {
          hit = L; break;
        }
        // lines: proximity
        if (L.el.tagName === 'line') {
          const x1 = +L.el.getAttribute('x1'), y1 = +L.el.getAttribute('y1');
          const x2 = +L.el.getAttribute('x2'), y2 = +L.el.getAttribute('y2');
          const d = Math.abs((y2 - y1) * p.x - (x2 - x1) * p.y + x2 * y1 - y2 * x1) /
            (Math.hypot(y2 - y1, x2 - x1) || 1);
          if (d < 8) { hit = L; break; }
        }
      }
      selectLayer(hit);
      if (hit) {
        dragState = { L: hit, x0: p.x, y0: p.y, ox: 0, oy: 0 };
        const t = hit.el.getAttribute('transform') || '';
        const m = /translate\(([-\d.]+),\s*([-\d.]+)\)/.exec(t);
        if (m) { dragState.ox = +m[1]; dragState.oy = +m[2]; }
      }
      return;
    }
    if (tool === 'rect') {
      const el = document.createElementNS(svgNS, 'rect');
      el.setAttribute('x', p.x); el.setAttribute('y', p.y);
      el.setAttribute('width', 1); el.setAttribute('height', 1);
      el.setAttribute('fill', fill); el.setAttribute('stroke', stroke);
      el.setAttribute('stroke-width', strokeW); el.setAttribute('opacity', opacity);
      drawG.appendChild(el);
      const L = addLayer(el, 'rect');
      dragState = { create: 'rect', L, x0: p.x, y0: p.y };
    } else if (tool === 'ellipse') {
      const el = document.createElementNS(svgNS, 'ellipse');
      el.setAttribute('cx', p.x); el.setAttribute('cy', p.y);
      el.setAttribute('rx', 1); el.setAttribute('ry', 1);
      el.setAttribute('fill', fill); el.setAttribute('stroke', stroke);
      el.setAttribute('stroke-width', strokeW); el.setAttribute('opacity', opacity);
      drawG.appendChild(el);
      const L = addLayer(el, 'ellipse');
      dragState = { create: 'ellipse', L, x0: p.x, y0: p.y };
    } else if (tool === 'line') {
      const el = document.createElementNS(svgNS, 'line');
      el.setAttribute('x1', p.x); el.setAttribute('y1', p.y);
      el.setAttribute('x2', p.x); el.setAttribute('y2', p.y);
      el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', strokeW);
      el.setAttribute('opacity', opacity); el.setAttribute('fill', 'none');
      drawG.appendChild(el);
      const L = addLayer(el, 'line');
      dragState = { create: 'line', L, x0: p.x, y0: p.y };
    } else if (tool === 'pen') {
      penPts = [p];
      const el = document.createElementNS(svgNS, 'polyline');
      el.setAttribute('points', `${p.x},${p.y}`);
      el.setAttribute('fill', 'none'); el.setAttribute('stroke', stroke);
      el.setAttribute('stroke-width', strokeW); el.setAttribute('opacity', opacity);
      el.setAttribute('stroke-linecap', 'round'); el.setAttribute('stroke-linejoin', 'round');
      drawG.appendChild(el);
      const L = addLayer(el, 'pen');
      dragState = { create: 'pen', L };
    } else if (tool === 'text') {
      const el = document.createElementNS(svgNS, 'text');
      el.setAttribute('x', p.x); el.setAttribute('y', p.y);
      el.setAttribute('fill', fill); el.setAttribute('opacity', opacity);
      el.setAttribute('font-size', '28'); el.setAttribute('font-family', 'system-ui,sans-serif');
      el.textContent = 'Text';
      drawG.appendChild(el);
      addLayer(el, 'text');
      setTool('select');
    }
  });
  art.addEventListener('pointermove', (e) => {
    if (!dragState) return;
    const p = localXY(e);
    if (dragState.L && tool === 'select' && !dragState.create) {
      const dx = p.x - dragState.x0, dy = p.y - dragState.y0;
      dragState.L.el.setAttribute('transform', `translate(${dragState.ox + dx},${dragState.oy + dy})`);
      return;
    }
    const el = dragState.L?.el;
    if (!el) return;
    if (dragState.create === 'rect') {
      const x = Math.min(dragState.x0, p.x), y = Math.min(dragState.y0, p.y);
      el.setAttribute('x', x); el.setAttribute('y', y);
      el.setAttribute('width', Math.max(1, Math.abs(p.x - dragState.x0)));
      el.setAttribute('height', Math.max(1, Math.abs(p.y - dragState.y0)));
    } else if (dragState.create === 'ellipse') {
      el.setAttribute('cx', (dragState.x0 + p.x) / 2);
      el.setAttribute('cy', (dragState.y0 + p.y) / 2);
      el.setAttribute('rx', Math.max(1, Math.abs(p.x - dragState.x0) / 2));
      el.setAttribute('ry', Math.max(1, Math.abs(p.y - dragState.y0) / 2));
    } else if (dragState.create === 'line') {
      el.setAttribute('x2', p.x); el.setAttribute('y2', p.y);
    } else if (dragState.create === 'pen') {
      penPts.push(p);
      el.setAttribute('points', penPts.map((q) => `${q.x},${q.y}`).join(' '));
    }
  });
  const endDrag = () => { dragState = null; penPts = null; };
  art.addEventListener('pointerup', endDrag);
  art.addEventListener('pointerleave', endDrag);

  const status = h('div.k-row', {
    style: {
      height: '28px', background: '#eee', borderTop: '1px solid #ccc',
      padding: '0 12px', fontSize: '11px', gap: '16px', color: '#555',
    },
  },
    h('span', {}, 'Elements'),
    h('span', { style: { opacity: .45 } }, 'Animation'),
    h('span', { style: { flex: 1 } }),
    h('span', {}, 'Artboard 520×360'),
  );

  body.append(toolRail, boardWrap, side);
  root.append(menu, ctx, body, status);
  renderLayers();

  window.__demoProof = async () => {
    setTool('rect');
    // synthesize shapes
    const mk = (tag, attrs, kind) => {
      const el = document.createElementNS(svgNS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      drawG.appendChild(el);
      return addLayer(el, kind);
    };
    fill = '#5e7c9e'; stroke = '#222'; strokeW = 2;
    mk('rect', { x: 60, y: 50, width: 160, height: 100, fill, stroke, 'stroke-width': strokeW, opacity: 1 }, 'rect');
    fill = '#ff5c8a';
    mk('ellipse', { cx: 320, cy: 140, rx: 70, ry: 50, fill, stroke, 'stroke-width': strokeW, opacity: 1 }, 'ellipse');
    stroke = '#333';
    mk('line', { x1: 80, y1: 240, x2: 280, y2: 300, stroke, 'stroke-width': 3, fill: 'none', opacity: 1 }, 'line');
    fill = '#222';
    const te = document.createElementNS(svgNS, 'text');
    te.setAttribute('x', 340); te.setAttribute('y', 280);
    te.setAttribute('fill', fill); te.setAttribute('font-size', '28');
    te.setAttribute('font-family', 'system-ui,sans-serif'); te.textContent = 'Boxy';
    drawG.appendChild(te); addLayer(te, 'text');
    selectLayer(layers[0]);
    fill = '#ffc83d'; applyStyle();
    setTool('select');
    await sleep(80);
    copy(serialize());
    return `layers ${layers.length}; rect/ellipse/line/text; fill edit; copy SVG`;
  };
};

V['pattern-monster-svg-pattern-desk'] = (root, T) => {
  theme(root, T, { bg: '#0f1115', fg: '#f0f0f0', panel: '#1a1d24', ac: '#ffc83d', ac2: '#ff5c8a', dark: true });
  const MOTIFS = {
    waves: (c, s) => `<path d="M0 ${s / 2} Q ${s / 4} 0 ${s / 2} ${s / 2} T ${s} ${s / 2}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,
    dots: (c, s) => `<circle cx="${s / 2}" cy="${s / 2}" r="${s * 0.18}" fill="${c}"/>`,
    chevron: (c, s) => `<path d="M${s * 0.15} ${s * 0.7} L${s / 2} ${s * 0.3} L${s * 0.85} ${s * 0.7}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    grid: (c, s) => `<path d="M0 ${s / 2}H${s}M${s / 2} 0V${s}" stroke="${c}" stroke-width="2"/>`,
    crosses: (c, s) => `<path d="M${s / 2 - 8} ${s / 2}H${s / 2 + 8}M${s / 2} ${s / 2 - 8}V${s / 2 + 8}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,
    diamonds: (c, s) => `<path d="M${s / 2} ${s * 0.2} L${s * 0.8} ${s / 2} L${s / 2} ${s * 0.8} L${s * 0.2} ${s / 2}Z" fill="none" stroke="${c}" stroke-width="2.5"/>`,
    stripes: (c, s) => `<path d="M0 0L${s} ${s}M${-s / 3} 0L${s} ${s * 4 / 3}M0 ${-s / 3}L${s * 4 / 3} ${s}" stroke="${c}" stroke-width="3"/>`,
    stars: (c, s) => { const cx = s / 2, cy = s / 2, R = s * 0.28, r = s * 0.12; let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rr = i % 2 ? r : R; d += `${i ? 'L' : 'M'}${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr}`; } return `<path d="${d}Z" fill="${c}"/>`; },
  };
  const P = { motif: 'waves', fg: '#ffc83d', bg: '#1a2434', scale: 48, spacing: 8 };
  const preview = h('div', { style: { flex: 1, borderRadius: '16px', border: '1px solid #ffffff18', minHeight: '360px', boxShadow: 'inset 0 0 0 1px #0004' } });
  const code = h('pre', { style: { background: '#0c0e12', border: '1px solid #ffffff14', borderRadius: '10px', padding: '12px', fontSize: '11px', color: '#9fd3ff', margin: 0, maxHeight: '120px', overflow: 'auto', whiteSpace: 'pre-wrap' } });
  const motifGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' } });

  const tileSvg = () => {
    const t = P.scale + P.spacing;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}"><rect width="100%" height="100%" fill="${P.bg}"/>${MOTIFS[P.motif](P.fg, P.scale)}</svg>`;
  };
  const draw = () => {
    const sv = tileSvg();
    const url = `url("data:image/svg+xml,${encodeURIComponent(sv)}")`;
    preview.style.background = `${P.bg} ${url}`;
    preview.style.backgroundSize = `${P.scale + P.spacing}px ${P.scale + P.spacing}px`;
    code.textContent = sv;
    motifGrid.querySelectorAll('[data-m]').forEach((b) => {
      b.style.outline = b.dataset.m === P.motif ? '2px solid #ffc83d' : '1px solid #ffffff18';
    });
  };

  Object.keys(MOTIFS).forEach((k) => {
    const thumb = h('button', {
      'data-m': k,
      style: { height: '64px', borderRadius: '10px', border: '1px solid #ffffff18', cursor: 'pointer', background: '#1a2434', padding: 0, overflow: 'hidden' },
      onclick: () => { P.motif = k; draw(); },
    });
    const t = 40;
    const mini = `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}"><rect width="100%" height="100%" fill="#1a2434"/>${MOTIFS[k]('#ffc83d', t)}</svg>`;
    thumb.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(mini)}")`;
    thumb.style.backgroundSize = 'cover';
    motifGrid.append(thumb);
  });

  const exportSvg = () => {
    const a = h('a', { download: `pattern-monster-${P.motif}.svg`, href: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(tileSvg()) });
    a.click();
    toast('SVG exported');
  };

  root.append(
    h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '56px 1fr', background: '#0f1115' } },
      h('div.k-row', { style: { padding: '0 20px', gap: '14px', borderBottom: '1px solid #ffffff12', fontSize: '12px' } },
        h('b', { style: { fontSize: '14px', letterSpacing: '.08em' } }, '👾 PATTERN MONSTER'),
        h('span', { style: { flex: 1 } }),
        h('span', { style: { border: '1px solid #ffc83d66', color: '#ffc83d', padding: '5px 10px', borderRadius: '8px' } }, 'Upgrade to Pro'),
        h('span', { style: { background: '#7c5cff', padding: '5px 10px', borderRadius: '8px' } }, 'Buy me a coffee')),
      h('div', { style: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px', padding: '20px', minHeight: 0 } },
        h('div', { style: { display: 'grid', gap: '14px', alignContent: 'start', overflow: 'auto' } },
          h('div', { style: { fontSize: '22px', fontWeight: 800, lineHeight: 1.25 } }, 'Customizable ', h('span', { style: { color: '#ffc83d' } }, 'SVG patterns'), ' for your projects'),
          h('div', { style: { fontSize: '12px', opacity: .65 } }, 'Pick a motif · tune colors & scale · export seamless SVG'),
          h('div', { style: { fontSize: '11px', opacity: .5, letterSpacing: '.08em' } }, 'MOTIF'),
          motifGrid,
          h('div', { style: { fontSize: '11px', opacity: .5, letterSpacing: '.08em' } }, 'COLORS'),
          h('div.k-row', { style: { gap: '10px' } },
            h('label.k-row', { style: { gap: '6px', fontSize: '12px' } }, 'FG', h('input', { type: 'color', value: P.fg, oninput: (e) => { P.fg = e.target.value; draw(); } })),
            h('label.k-row', { style: { gap: '6px', fontSize: '12px' } }, 'BG', h('input', { type: 'color', value: P.bg, oninput: (e) => { P.bg = e.target.value; draw(); } })),
            btn('🎲', () => { P.fg = randHex(); P.bg = randHex(); draw(); })),
          slider('Scale', 24, 120, P.scale, 1, (v) => { P.scale = v; draw(); }),
          slider('Spacing', 0, 48, P.spacing, 1, (v) => { P.spacing = v; draw(); }),
          h('div.k-row', { style: { gap: '8px' } }, btn('Export SVG', exportSvg, 'pri'), btn('Copy SVG', () => copy(tileSvg()))),
          code),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 } },
          h('div.k-row', { style: { fontSize: '12px', opacity: .6 } }, 'LIVE SEAMLESS PREVIEW', h('span', { style: { flex: 1 } }), 'CSS · SVG · PNG'),
          preview))));

  draw();
  window.__demoProof = async () => {
    P.motif = 'diamonds'; P.fg = '#ff5c8a'; P.bg = '#18181b'; P.scale = 56; P.spacing = 12; draw(); await sleep(80);
    P.motif = 'stars'; P.fg = '#ffc83d'; draw(); await sleep(60);
    copy(tileSvg());
    return `motif stars; fg/bg/scale/spacing set; SVG copied`;
  };
};


V['dicebear-avatar-seed-playground'] = (root, T) => {
  theme(root, T, { bg: '#f7f7f8', fg: '#1a1a1a', panel: '#fff', ac: '#0d9373', dark: false });
  root.style.fontFamily = 'Inter Variable,system-ui,sans-serif';
  root.style.overflow = 'hidden';

  const STYLES = [
    { id: 'adventurer', label: 'Adventurer', hair: 'long', eyes: 'default', mouth: 'smile' },
    { id: 'lorelei', label: 'Lorelei', hair: 'bun', eyes: 'happy', mouth: 'smile' },
    { id: 'bottts', label: 'Bottts', hair: 'none', eyes: 'default', mouth: 'serious' },
    { id: 'shapes', label: 'Shapes', hair: 'short', eyes: 'wink', mouth: 'open' },
    { id: 'identicon', label: 'Identicon', hair: 'none', eyes: 'default', mouth: 'serious' },
    { id: 'fun-emoji', label: 'Fun Emoji', hair: 'short', eyes: 'happy', mouth: 'open' },
    { id: 'pixel', label: 'Pixel', hair: 'short', eyes: 'default', mouth: 'smile' },
    { id: 'rings', label: 'Rings', hair: 'long', eyes: 'wink', mouth: 'smile' },
  ];
  const SKINS = ['#f2c7a5', '#e0a878', '#b67b52', '#8d5a3b', '#5c3a23'];
  const HAIRS = ['#2b1b10', '#6b3e26', '#c98a3a', '#e8d27a', '#b33a3a', '#8a8fa0'];
  const BGS = ['#e8f5e9', '#e3f2fd', '#fce4ec', '#fff8e1', '#f3e5f5', '#e0f7fa'];
  const SHIRTS = ['#0d9373', '#5a4bff', '#ff5a7a', '#222', '#ffb020', '#1bb57a'];

  const hash = (str) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  const pickN = (arr, h, i) => arr[(h + i * 97) % arr.length];

  let style = STYLES[0].id;
  let seed = 'playground';
  const state = () => {
    const h = hash(style + '::' + seed);
    const st = STYLES.find((x) => x.id === style) || STYLES[0];
    if (style === 'identicon') {
      return { kind: 'identicon', h, size: 280 };
    }
    if (style === 'shapes') {
      return { kind: 'shapes', h, size: 280 };
    }
    if (style === 'bottts') {
      return { kind: 'bottts', h, size: 280 };
    }
    if (style === 'rings') {
      return { kind: 'rings', h, size: 280 };
    }
    return {
      kind: 'face',
      skin: pickN(SKINS, h, 1),
      hair: st.hair,
      hairColor: pickN(HAIRS, h, 2),
      eyes: st.eyes,
      mouth: st.mouth,
      bg: pickN(BGS, h, 3),
      shirt: pickN(SHIRTS, h, 4),
      glasses: (h & 7) === 0,
      size: 280,
    };
  };

  const identiconSVG = (h, size) => {
    const g = s('svg', { viewBox: '0 0 5 5', width: size, height: size });
    const c = '#' + ((h & 0xffffff) | 0x333333).toString(16).padStart(6, '0');
    g.append(s('rect', { width: 5, height: 5, fill: '#f0f0f0' }));
    for (let y = 0; y < 5; y++) for (let x = 0; x < 3; x++) {
      if ((h >> (y * 3 + x)) & 1) {
        g.append(s('rect', { x, y, width: 1, height: 1, fill: c }));
        if (x < 2) g.append(s('rect', { x: 4 - x, y, width: 1, height: 1, fill: c }));
      }
    }
    return g;
  };
  const shapesSVG = (h, size) => {
    const g = s('svg', { viewBox: '0 0 200 200', width: size, height: size });
    const bg = pickN(BGS, h, 0);
    g.append(s('rect', { width: 200, height: 200, rx: 24, fill: bg }));
    for (let i = 0; i < 5; i++) {
      const x = 30 + ((h >> (i * 3)) & 7) * 18;
      const y = 30 + ((h >> (i * 4 + 2)) & 7) * 18;
      const r = 18 + ((h >> i) & 15);
      const fill = pickN(SHIRTS, h, i);
      if (i % 3 === 0) g.append(s('circle', { cx: x, cy: y, r, fill, opacity: 0.85 }));
      else if (i % 3 === 1) g.append(s('rect', { x: x - r / 2, y: y - r / 2, width: r, height: r, rx: 6, fill, opacity: 0.85 }));
      else g.append(s('polygon', { points: `${x},${y - r} ${x + r},${y + r} ${x - r},${y + r}`, fill, opacity: 0.85 }));
    }
    return g;
  };
  const botttsSVG = (h, size) => {
    const g = s('svg', { viewBox: '0 0 200 200', width: size, height: size });
    const bg = pickN(BGS, h, 5);
    const body = pickN(SHIRTS, h, 1);
    g.append(s('rect', { width: 200, height: 200, rx: 20, fill: bg }));
    g.append(s('rect', { x: 50, y: 55, width: 100, height: 90, rx: 12, fill: body }));
    g.append(s('rect', { x: 70, y: 80, width: 22, height: 14, rx: 3, fill: '#fff' }));
    g.append(s('rect', { x: 108, y: 80, width: 22, height: 14, rx: 3, fill: '#fff' }));
    g.append(s('rect', { x: 78, y: 110, width: 44, height: 8, rx: 2, fill: '#111' }));
    g.append(s('circle', { cx: 100, cy: 45, r: 10, fill: body }));
    g.append(s('line', { x1: 100, y1: 45, x2: 100, y2: 55, stroke: body, 'stroke-width': 4 }));
    return g;
  };
  const ringsSVG = (h, size) => {
    const g = s('svg', { viewBox: '0 0 200 200', width: size, height: size });
    g.append(s('rect', { width: 200, height: 200, rx: 100, fill: pickN(BGS, h, 2) }));
    for (let i = 0; i < 4; i++) {
      const r = 30 + i * 18;
      g.append(s('circle', { cx: 100, cy: 100, r, fill: 'none', stroke: pickN(SHIRTS, h, i), 'stroke-width': 6 + (h >> i) % 4, opacity: 0.8 }));
    }
    g.append(s('circle', { cx: 100, cy: 100, r: 14, fill: pickN(SKINS, h, 0) }));
    return g;
  };

  const preview = h('div', {
    style: {
      display: 'grid', placeItems: 'center', flex: 1,
      background: '#fff', borderRadius: '16px', border: '1px solid #e8e8ea',
      minHeight: '360px', boxShadow: '0 8px 30px #0000000a',
    },
  });
  const seedInput = h('input', {
    value: seed,
    style: {
      width: '100%', padding: '10px 12px', borderRadius: '8px',
      border: '1px solid #d0d0d4', font: '14px ui-monospace,monospace', outline: 'none',
    },
    oninput: (e) => { seed = e.target.value || ' '; draw(); },
  });
  const meta = h('div', { style: { fontSize: '12px', opacity: .55, marginTop: '8px' } });

  const draw = () => {
    const o = state();
    let node;
    if (o.kind === 'identicon') node = identiconSVG(o.h, o.size);
    else if (o.kind === 'shapes') node = shapesSVG(o.h, o.size);
    else if (o.kind === 'bottts') node = botttsSVG(o.h, o.size);
    else if (o.kind === 'rings') node = ringsSVG(o.h, o.size);
    else node = avatarSVG(o);
    preview.replaceChildren(node);
    meta.textContent = `style=${style} · seed="${seed}" · hash=${hash(style + '::' + seed).toString(16)}`;
  };

  const side = h('div', {
    style: {
      width: '240px', padding: '18px 14px', borderRight: '1px solid #e8e8ea',
      background: '#fff', overflow: 'auto', display: 'grid', gap: '8px', alignContent: 'start',
    },
  },
    h('div', { style: { fontSize: '11px', letterSpacing: '.12em', opacity: .5, marginBottom: '4px' } }, 'STYLES'),
    ...STYLES.map((st) => h('button', {
      style: {
        textAlign: 'left', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
        border: '1px solid ' + (style === st.id ? '#0d9373' : '#e8e8ea'),
        background: style === st.id ? '#0d937314' : '#fafafa',
        fontWeight: style === st.id ? 700 : 500, fontSize: '13px', color: 'inherit',
      },
      onclick: () => { style = st.id; paintSide(); draw(); },
    }, st.label)),
  );
  const paintSide = () => {
    side.replaceChildren(
      h('div', { style: { fontSize: '11px', letterSpacing: '.12em', opacity: .5, marginBottom: '4px' } }, 'STYLES'),
      ...STYLES.map((st) => h('button', {
        style: {
          textAlign: 'left', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
          border: '1px solid ' + (style === st.id ? '#0d9373' : '#e8e8ea'),
          background: style === st.id ? '#0d937314' : '#fafafa',
          fontWeight: style === st.id ? 700 : 500, fontSize: '13px', color: 'inherit',
        },
        onclick: () => { style = st.id; paintSide(); draw(); },
      }, st.label)),
    );
  };

  const main = h('div', {
    style: { flex: 1, padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'auto' },
  },
    h('div.k-row', {},
      h('div', {},
        h('div', { style: { fontSize: '11px', letterSpacing: '.14em', opacity: .5 } }, 'AVATAR SEED PLAYGROUND'),
        h('h1', { style: { margin: '4px 0 0', fontSize: '26px', fontWeight: 700 } }, 'Dice-ish Bear'),
      ),
      h('span', { style: { flex: 1 } }),
      btn('Randomize 🎲', () => {
        seed = Math.random().toString(36).slice(2, 10);
        seedInput.value = seed;
        draw();
        toast('seed → ' + seed);
      }, 'pri'),
      btn('Copy SVG', () => {
        const svgEl = preview.querySelector('svg');
        if (svgEl) copy(ser(svgEl), 'SVG copied');
      }),
      btn('Download', () => toast('avatar.svg (stub)')),
    ),
    h('div', {},
      h('div', { style: { fontSize: '12px', marginBottom: '6px', opacity: .65 } }, 'Seed — same seed + style → same face'),
      seedInput, meta,
    ),
    preview,
  );

  root.append(h('div', {
    style: { position: 'absolute', inset: 0, display: 'flex', background: '#f7f7f8' },
  }, side, main));
  paintSide();
  draw();

  window.__demoProof = async () => {
    const before = { style, seed };
    style = 'bottts'; seed = 'proof-seed'; seedInput.value = seed; paintSide(); draw();
    await sleep(80);
    const a = hash(style + '::' + seed);
    seed = 'proof-seed'; draw();
    const b = hash(style + '::' + seed);
    seed = Math.random().toString(36).slice(2, 8); seedInput.value = seed; draw();
    await sleep(60);
    style = before.style; seed = before.seed; seedInput.value = seed; paintSide(); draw();
    return `style+seed deterministic (${a === b}) · randomized · restored`;
  };
};


V['lordicon-animated-icon-desk'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#121330', panel: '#fafafb', ac: '#00b884', dark: false });
  root.style.fontFamily = 'Inter Variable,system-ui,sans-serif';
  root.style.overflow = 'hidden';

  const ICONS = [
    { id: 'image-mountain', d: 'M3 17l5-6 4 4 3-3 6 7H3z M7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', style: 'wired-outline' },
    { id: 'book-guideline', d: 'M5 4h10a2 2 0 0 1 2 2v14l-6-3-6 3V6a2 2 0 0 1 2-2z M9 8h4M9 11h4', style: 'wired-outline' },
    { id: 'person-office', d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1', style: 'bulk' },
    { id: 'hand-refund', d: 'M8 11V7a2 2 0 1 1 4 0v4 M12 11V6a2 2 0 1 1 4 0v5 M16 11V8a2 2 0 1 1 4 0v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-1a3 3 0 0 1 3-3h1', style: 'wired-flat' },
    { id: 'heart-pulse', d: 'M12 21s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z', style: 'wired-outline' },
    { id: 'bell-alert', d: 'M6 9a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10 21a2 2 0 0 0 4 0', style: 'bulk' },
    { id: 'cart-shop', d: 'M3 4h2l2.4 12h11.2L21 7H7 M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z', style: 'wired-outline' },
    { id: 'cloud-upload', d: 'M8 17h8a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 8 17z M12 12v7 M9 15l3-3 3 3', style: 'wired-flat' },
    { id: 'mail-open', d: 'M4 8l8 5 8-5 M4 8v10h16V8 M4 8l8-4 8 4', style: 'bulk' },
    { id: 'star-glow', d: 'M12 3l2.8 6.2L21 10l-4.5 4.2L17.6 21 12 17.8 6.4 21l1.1-6.8L3 10l6.2-.8z', style: 'wired-outline' },
    { id: 'lock-secure', d: 'M8 11V8a4 4 0 0 1 8 0v3 M6 11h12v10H6z', style: 'wired-flat' },
    { id: 'zap-flash', d: 'M13 2L4 14h7l-1 8 9-12h-7z', style: 'bulk' },
  ];
  const ANIMS = ['reveal', 'pinch', 'portrait', 'sea', 'morph', 'hover'];
  let sel = ICONS[0], anim = 'pinch', color = '#121330', stroke = 2, playing = true, t0 = performance.now(), progress = 0;

  const svgIcon = (ic, sz = 48, col = color, sw = stroke, phase = 0) => {
    const g = s('svg', { viewBox: '0 0 24 24', width: sz, height: sz, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const p = s('path', { d: ic.d });
    // animation transforms by style
    const box = s('g');
    if (anim === 'pinch') {
      const sc = 1 + Math.sin(phase * Math.PI * 2) * 0.12;
      box.setAttribute('transform', `translate(12,12) scale(${sc}) translate(-12,-12)`);
    } else if (anim === 'reveal') {
      const len = 120;
      p.setAttribute('stroke-dasharray', String(len));
      p.setAttribute('stroke-dashoffset', String(len * (1 - phase)));
    } else if (anim === 'portrait') {
      box.setAttribute('transform', `translate(0,${Math.sin(phase * Math.PI * 2) * 1.5})`);
    } else if (anim === 'sea') {
      box.setAttribute('transform', `rotate(${Math.sin(phase * Math.PI * 2) * 8} 12 12)`);
    } else if (anim === 'morph') {
      p.setAttribute('opacity', String(0.55 + 0.45 * Math.sin(phase * Math.PI * 2)));
    } else {
      box.setAttribute('transform', `translate(0,${playing ? Math.sin(phase * Math.PI * 2) * -1.2 : 0})`);
    }
    box.append(p);
    g.append(box);
    return g;
  };

  const previewBox = h('div', {
    style: {
      height: '200px', display: 'grid', placeItems: 'center', borderRadius: '12px',
      background: 'repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 0 0 / 16px 16px',
      border: '1px solid #e8e8ea',
    },
  });
  const scrub = h('input', {
    type: 'range', min: 0, max: 100, value: 0,
    style: { width: '100%', accentColor: '#00b884' },
    oninput: (e) => { progress = +e.target.value / 100; playing = false; playBtn.textContent = '▶'; drawPreview(); },
  });
  const playBtn = h('button', {
    style: { width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '14px' },
    onclick: () => { playing = !playing; playBtn.textContent = playing ? '❚❚' : '▶'; if (playing) t0 = performance.now() - progress * 2000; },
  }, '❚❚');
  const animGrid = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } });
  const paintAnims = () => {
    animGrid.replaceChildren(...ANIMS.map((a) => h('button', {
      style: {
        padding: '14px 8px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
        border: '2px solid ' + (anim === a ? '#00b884' : '#e8e8ea'),
        background: anim === a ? '#00b88414' : '#fff', color: 'inherit',
      },
      onclick: () => { anim = a; paintAnims(); drawPreview(); },
    }, a)));
  };
  const drawPreview = () => {
    previewBox.replaceChildren(svgIcon(sel, 96, color, stroke, progress));
    scrub.value = Math.round(progress * 100);
  };

  const editor = h('aside', {
    style: {
      width: '320px', borderLeft: '1px solid #e8e8ea', background: '#fff',
      padding: '16px', display: 'grid', gap: '12px', alignContent: 'start', overflow: 'auto',
    },
  },
    h('div', {},
      h('b', { style: { fontSize: '15px' } }, sel.id),
      h('div', { style: { fontSize: '12px', opacity: .5, marginTop: '2px' } }, sel.style + '-54'),
    ),
    previewBox,
    h('div.k-row', { style: { gap: '10px' } }, playBtn, h('div', { style: { flex: 1 } }, scrub, h('div', { style: { fontSize: '11px', opacity: .45, marginTop: '2px' } }, '2s loop'))),
    h('div.k-row', { style: { gap: '8px' } },
      select(['GIF', 'JSON', 'SVG', 'Lottie'], 'GIF', () => {}),
      btn('Export', () => toast('exported ' + sel.id + '.gif'), 'pri'),
    ),
    h('div', { style: { fontSize: '12px', fontWeight: 700, marginTop: '4px' } }, 'Editor'),
    animGrid,
    h('div', {}, h('div', { style: { fontSize: '11px', opacity: .55, marginBottom: '4px' } }, 'Primary color'),
      h('input', { type: 'color', value: color.length === 7 ? color : '#121330', style: { width: '100%', height: '36px', border: '1px solid #e8e8ea', borderRadius: '8px', cursor: 'pointer' },
        oninput: (e) => { color = e.target.value; drawPreview(); paintGrid(); } })),
    h('div', {}, h('div', { style: { fontSize: '11px', opacity: .55, marginBottom: '4px' } }, 'Stroke'),
      slider('Stroke', 1, 4, stroke, 0.25, (v) => { stroke = v; drawPreview(); })),
  );

  const grid = h('div', {
    style: {
      flex: 1, overflow: 'auto', padding: '16px 20px',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '12px', alignContent: 'start',
    },
  });
  const paintGrid = () => {
    grid.replaceChildren(...ICONS.map((ic) => h('button', {
      style: {
        border: '2px solid ' + (sel.id === ic.id ? '#00b884' : '#eee'),
        borderRadius: '12px', background: '#fff', padding: '18px 10px 12px', cursor: 'pointer',
        display: 'grid', gap: '10px', placeItems: 'center', color: 'inherit',
        boxShadow: sel.id === ic.id ? '0 0 0 1px #00b88444' : 'none',
      },
      onclick: () => { sel = ic; paintGrid(); paintAnims(); drawPreview(); },
    }, svgIcon(ic, 40, color, 1.75, 0.35), h('span', { style: { fontSize: '11px', opacity: .65 } }, ic.id))));
  };

  const top = h('div.k-row', {
    style: { height: '56px', padding: '0 20px', gap: '18px', borderBottom: '1px solid #eee' },
  },
    h('b', { style: { color: '#00b884', fontSize: '18px', letterSpacing: '-.02em' } }, 'lordicon'),
    h('span', { style: { opacity: .55, fontSize: '13px' } }, 'Icons'),
    h('span', { style: { opacity: .55, fontSize: '13px' } }, 'Docs'),
    h('span', { style: { opacity: .55, fontSize: '13px' } }, 'Resources'),
    h('span', { style: { opacity: .55, fontSize: '13px' } }, 'Pricing'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '13px', opacity: .6 } }, 'Log in'),
    btn('Sign up', () => toast('signup'), 'pri'),
  );
  const filters = h('div.k-row', {
    style: { padding: '12px 20px', gap: '10px', borderBottom: '1px solid #f0f0f2' },
  },
    select(['All Styles', 'Wired', 'Bulk', 'Lineal'], 'All Styles', () => {}),
    select(['All Categories', 'UI', 'Business', 'Nature'], 'All Categories', () => {}),
    h('input', { placeholder: 'Search icons…', style: { flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e5e8', outline: 'none', fontSize: '13px' } }),
    toggle('Free only', false, () => {}),
  );

  root.append(h('div', {
    style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#fafafb' },
  }, top, filters, h('div', { style: { flex: 1, display: 'flex', minHeight: 0 } }, grid, editor)));

  paintAnims(); paintGrid(); drawPreview();
  const loop = () => {
    if (playing) {
      progress = ((performance.now() - t0) % 2000) / 2000;
      drawPreview();
    }
    requestAnimationFrame(loop);
  };
  loop();

  window.__demoProof = async () => {
    const before = { id: sel.id, anim, color, stroke };
    sel = ICONS[4]; anim = 'reveal'; color = '#00b884'; stroke = 2.5;
    paintGrid(); paintAnims(); drawPreview();
    await sleep(120);
    playing = true; playBtn.textContent = '❚❚'; t0 = performance.now();
    await sleep(100);
    anim = 'sea'; paintAnims(); drawPreview();
    await sleep(80);
    sel = ICONS.find((x) => x.id === before.id) || ICONS[0];
    anim = before.anim; color = before.color; stroke = before.stroke;
    paintGrid(); paintAnims(); drawPreview();
    return 'selected heart + reveal/sea anim + color · restored';
  };
};

V['blush-illustration-remix-desk'] = (root, T) => {
  theme(root, T, { bg: '#faf7f2', fg: '#222', ac: '#ff6b8a', dark: false });
  root.style.fontFamily = 'Inter Variable,system-ui,sans-serif';
  root.style.overflow = 'hidden';

  const SKINS = ['#FFE0C2', '#F5C7A0', '#D8A07A', '#A66B45', '#6B3F2A'];
  const HAIR_C = ['#1a1a1a', '#4a2c14', '#c47a3a', '#e8d27a', '#e85a8a', '#6b7cff', '#fff'];
  const CLOTH = ['#2b2b2b', '#6b7cff', '#ff6b8a', '#7ed6a5', '#ffd36b', '#f0f0f0', '#9b59b6'];
  const HAIRS = [
    { id: 'short', label: 'Short', d: 'M70 95c0-38 18-55 50-55s50 17 50 55c-8-20-24-30-50-30s-42 10-50 30z' },
    { id: 'afro', label: 'Afro', d: 'M55 100c-8-50 20-78 65-78s73 28 65 78c-10-28-30-40-65-40s-55 12-65 40z' },
    { id: 'long', label: 'Long', d: 'M68 100c0-42 20-62 52-62s52 20 52 62v70h-18v-68c-6-16-18-24-34-24s-28 8-34 24v68H68z' },
    { id: 'bun', label: 'Bun', d: 'M75 95c0-32 16-48 45-48s45 16 45 48c-8-14-22-22-45-22s-37 8-45 22zM105 28a16 16 0 1 0 0.1 0' },
    { id: 'mohawk', label: 'Mohawk', d: 'M108 28c-6 0-14 8-16 28h32c-2-20-10-28-16-28zM72 95c0-20 12-36 48-36s48 16 48 36' },
    { id: 'bald', label: 'Bald', d: '' },
  ];
  const FACES = [
    { id: 'round', label: 'Round' },
    { id: 'oval', label: 'Oval' },
    { id: 'soft', label: 'Soft' },
  ];
  const EYES = [
    { id: 'dot', label: 'Dots' },
    { id: 'happy', label: 'Happy' },
    { id: 'wink', label: 'Wink' },
    { id: 'wide', label: 'Wide' },
  ];
  const NOSES = [
    { id: 'dot', label: 'Dot' },
    { id: 'curve', label: 'Curve' },
    { id: 'none', label: 'None' },
  ];
  const MOUTHS = [
    { id: 'smile', label: 'Smile' },
    { id: 'grin', label: 'Grin' },
    { id: 'flat', label: 'Flat' },
    { id: 'o', label: 'Oh' },
  ];
  const BODIES = [
    { id: 'tee', label: 'Tee' },
    { id: 'hoodie', label: 'Hoodie' },
    { id: 'coat', label: 'Coat' },
    { id: 'tank', label: 'Tank' },
  ];
  const ACCS = [
    { id: 'none', label: 'None' },
    { id: 'glasses', label: 'Glasses' },
    { id: 'shades', label: 'Shades' },
    { id: 'mask', label: 'Mask' },
    { id: 'earrings', label: 'Earrings' },
  ];

  const DEFAULT = { hair: 'short', face: 'round', eyes: 'dot', nose: 'dot', mouth: 'smile', body: 'tee', acc: 'none', skin: SKINS[1], hairC: HAIR_C[0], cloth: CLOTH[1] };
  let P = { ...DEFAULT };
  let cat = 'hair';

  const peepSVG = (o, w = 320) => {
    const g = s('svg', { viewBox: '0 0 200 260', width: w, height: w * 1.3, style: 'overflow:visible' });
    // soft shadow blob
    g.append(s('ellipse', { cx: 100, cy: 248, rx: 48, ry: 8, fill: '#00000012' }));
    // body / clothes
    const cloth = o.cloth;
    if (o.body === 'tee') {
      g.append(s('path', { d: 'M55 150 L80 130 L120 130 L145 150 L140 230 L60 230 Z', fill: cloth, stroke: '#111', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
      g.append(s('path', { d: 'M80 130 L70 155 M120 130 L130 155', fill: 'none', stroke: '#111', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    } else if (o.body === 'hoodie') {
      g.append(s('path', { d: 'M52 148 L78 128 L122 128 L148 148 L142 232 L58 232 Z', fill: cloth, stroke: '#111', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
      g.append(s('path', { d: 'M78 128 Q100 118 122 128', fill: 'none', stroke: '#111', 'stroke-width': 3 }));
      g.append(s('path', { d: 'M100 128 L100 200', stroke: '#111', 'stroke-width': 2, 'stroke-dasharray': '4 3' }));
    } else if (o.body === 'coat') {
      g.append(s('path', { d: 'M48 145 L78 128 L122 128 L152 145 L148 235 L52 235 Z', fill: cloth, stroke: '#111', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
      g.append(s('path', { d: 'M100 130 L100 235', stroke: '#111', 'stroke-width': 2 }));
      g.append(s('circle', { cx: 92, cy: 160, r: 3, fill: '#111' }), s('circle', { cx: 92, cy: 180, r: 3, fill: '#111' }));
    } else {
      g.append(s('path', { d: 'M62 148 L82 132 L118 132 L138 148 L132 210 L68 210 Z', fill: cloth, stroke: '#111', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
    }
    // neck
    g.append(s('rect', { x: 90, y: 118, width: 20, height: 22, rx: 4, fill: o.skin, stroke: '#111', 'stroke-width': 2.5 }));
    // face
    if (o.face === 'oval') g.append(s('ellipse', { cx: 100, cy: 88, rx: 36, ry: 44, fill: o.skin, stroke: '#111', 'stroke-width': 3 }));
    else if (o.face === 'soft') g.append(s('path', { d: 'M64 90c0-36 16-50 36-50s36 14 36 50c0 28-12 44-36 44s-36-16-36-44z', fill: o.skin, stroke: '#111', 'stroke-width': 3 }));
    else g.append(s('circle', { cx: 100, cy: 90, r: 40, fill: o.skin, stroke: '#111', 'stroke-width': 3 }));
    // hair behind/front
    const hair = HAIRS.find((h) => h.id === o.hair);
    if (hair?.d) g.append(s('path', { d: hair.d, fill: o.hairC, stroke: '#111', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
    // eyes
    if (o.eyes === 'happy') {
      g.append(s('path', { d: 'M78 90q8-10 16 0', fill: 'none', stroke: '#111', 'stroke-width': 3, 'stroke-linecap': 'round' }));
      g.append(s('path', { d: 'M106 90q8-10 16 0', fill: 'none', stroke: '#111', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    } else if (o.eyes === 'wink') {
      g.append(s('circle', { cx: 84, cy: 90, r: 4.5, fill: '#111' }));
      g.append(s('path', { d: 'M106 90h16', stroke: '#111', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    } else if (o.eyes === 'wide') {
      g.append(s('circle', { cx: 84, cy: 90, r: 7, fill: '#fff', stroke: '#111', 'stroke-width': 2.5 }), s('circle', { cx: 84, cy: 90, r: 3, fill: '#111' }));
      g.append(s('circle', { cx: 116, cy: 90, r: 7, fill: '#fff', stroke: '#111', 'stroke-width': 2.5 }), s('circle', { cx: 116, cy: 90, r: 3, fill: '#111' }));
    } else {
      g.append(s('circle', { cx: 84, cy: 90, r: 4.5, fill: '#111' }), s('circle', { cx: 116, cy: 90, r: 4.5, fill: '#111' }));
    }
    // nose
    if (o.nose === 'dot') g.append(s('circle', { cx: 100, cy: 102, r: 2.5, fill: '#111' }));
    else if (o.nose === 'curve') g.append(s('path', { d: 'M100 96q6 8 0 12', fill: 'none', stroke: '#111', 'stroke-width': 2.5, 'stroke-linecap': 'round' }));
    // mouth (skip if mask)
    if (o.acc !== 'mask') {
      if (o.mouth === 'smile') g.append(s('path', { d: 'M86 112q14 14 28 0', fill: 'none', stroke: '#111', 'stroke-width': 3, 'stroke-linecap': 'round' }));
      else if (o.mouth === 'grin') g.append(s('path', { d: 'M84 110q16 18 32 0', fill: '#fff', stroke: '#111', 'stroke-width': 2.5 }));
      else if (o.mouth === 'flat') g.append(s('path', { d: 'M88 114h24', stroke: '#111', 'stroke-width': 3, 'stroke-linecap': 'round' }));
      else g.append(s('ellipse', { cx: 100, cy: 116, rx: 8, ry: 7, fill: '#111' }));
    }
    // accessories
    if (o.acc === 'glasses') {
      g.append(s('circle', { cx: 84, cy: 90, r: 12, fill: '#ffffff33', stroke: '#111', 'stroke-width': 2.5 }));
      g.append(s('circle', { cx: 116, cy: 90, r: 12, fill: '#ffffff33', stroke: '#111', 'stroke-width': 2.5 }));
      g.append(s('path', { d: 'M96 90h8M72 90h-6M128 90h6', stroke: '#111', 'stroke-width': 2.5 }));
    } else if (o.acc === 'shades') {
      g.append(s('rect', { x: 70, y: 82, width: 26, height: 16, rx: 4, fill: '#222', stroke: '#111', 'stroke-width': 2 }));
      g.append(s('rect', { x: 104, y: 82, width: 26, height: 16, rx: 4, fill: '#222', stroke: '#111', 'stroke-width': 2 }));
      g.append(s('path', { d: 'M96 90h8', stroke: '#111', 'stroke-width': 2.5 }));
    } else if (o.acc === 'mask') {
      g.append(s('path', { d: 'M70 105 Q100 130 130 105 Q100 145 70 105', fill: '#b8e0f0', stroke: '#111', 'stroke-width': 2.5 }));
      g.append(s('path', { d: 'M70 105 L58 95 M130 105 L142 95', stroke: '#111', 'stroke-width': 2 }));
    } else if (o.acc === 'earrings') {
      g.append(s('circle', { cx: 62, cy: 100, r: 4, fill: '#ffd36b', stroke: '#111', 'stroke-width': 1.5 }));
      g.append(s('circle', { cx: 138, cy: 100, r: 4, fill: '#ffd36b', stroke: '#111', 'stroke-width': 1.5 }));
    }
    return g;
  };

  const preview = h('div', {
    style: {
      flex: 1, display: 'grid', placeItems: 'center', position: 'relative',
      background: 'radial-gradient(circle at 50% 40%, #fff 0%, #faf7f2 70%)',
      minHeight: 0,
    },
  });
  // decorative shapes like Blush hero
  const decor = h('div', { style: { position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' } },
    h('div', { style: { position: 'absolute', left: '8%', top: '18%', width: 0, height: 0, borderLeft: '28px solid transparent', borderRight: '28px solid transparent', borderBottom: '48px solid #ffd36b', opacity: .7 } }),
    h('div', { style: { position: 'absolute', right: '12%', top: '22%', width: '44px', height: '44px', borderRadius: '50%', background: '#ffb3c6', opacity: .55 } }),
    h('div', { style: { position: 'absolute', left: '14%', bottom: '16%', width: '36px', height: '36px', background: '#a8d8ff', transform: 'rotate(20deg)', opacity: .6 } }),
    h('div', { style: { position: 'absolute', right: '10%', bottom: '20%', width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderBottom: '38px solid #c5b3ff', opacity: .65 } }),
  );

  const CATS = [
    ['hair', 'Hair', HAIRS],
    ['face', 'Face', FACES],
    ['eyes', 'Eyes', EYES],
    ['nose', 'Nose', NOSES],
    ['mouth', 'Mouth', MOUTHS],
    ['body', 'Body', BODIES],
    ['acc', 'Extra', ACCS],
  ];

  const tabs = h('div', { style: { display: 'flex', gap: '4px', padding: '8px 12px', borderBottom: '1px solid #eee', overflowX: 'auto' } });
  const thumbs = h('div', { style: { display: 'flex', gap: '10px', padding: '12px', overflowX: 'auto', minHeight: '92px', alignItems: 'center' } });
  const swatches = h('div', { style: { display: 'flex', gap: '16px', padding: '8px 12px 14px', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid #eee' } });

  const draw = () => {
    preview.replaceChildren(decor, peepSVG(P, 300));
    tabs.replaceChildren(...CATS.map(([id, label]) => h('button', {
      style: {
        padding: '7px 12px', borderRadius: '99px', border: '1px solid #e5e0d8', cursor: 'pointer',
        background: cat === id ? '#222' : '#fff', color: cat === id ? '#fff' : '#444',
        fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
      },
      onclick: () => { cat = id; draw(); },
    }, label)));
    const list = CATS.find((c) => c[0] === cat)[2];
    thumbs.replaceChildren(...list.map((item) => {
      const on = P[cat] === item.id;
      const mini = { ...P, [cat]: item.id };
      const thumb = h('button', {
        title: item.label,
        style: {
          width: '72px', height: '72px', borderRadius: '12px', cursor: 'pointer',
          border: on ? '2px solid #ff6b8a' : '1px solid #e5e0d8',
          background: on ? '#fff5f7' : '#fff', padding: '4px', overflow: 'hidden',
          display: 'grid', placeItems: 'center',
        },
        onclick: () => { P[cat] = item.id; draw(); },
      }, peepSVG(mini, 64));
      return thumb;
    }));
    const row = (label, arr, key) => h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center' } },
      h('span', { style: { fontSize: '11px', opacity: .55, width: '36px' } }, label),
      ...arr.map((c) => h('button', {
        style: {
          width: '22px', height: '22px', borderRadius: '50%', background: c, cursor: 'pointer', padding: 0,
          border: P[key] === c ? '2px solid #111' : '1px solid #ccc',
        },
        onclick: () => { P[key] = c; draw(); },
      })),
    );
    swatches.replaceChildren(row('Skin', SKINS, 'skin'), row('Hair', HAIR_C, 'hairC'), row('Fit', CLOTH, 'cloth'));
  };

  const randomize = () => {
    P.hair = pick(HAIRS).id;
    P.face = pick(FACES).id;
    P.eyes = pick(EYES).id;
    P.nose = pick(NOSES).id;
    P.mouth = pick(MOUTHS).id;
    P.body = pick(BODIES).id;
    P.acc = pick(ACCS).id;
    P.skin = pick(SKINS);
    P.hairC = pick(HAIR_C);
    P.cloth = pick(CLOTH);
    draw();
    toast('randomized peep');
  };
  const reset = () => { P = { ...DEFAULT }; draw(); toast('reset to default'); };

  const top = h('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px',
      borderBottom: '1px solid #efeae2', background: '#fff',
    },
  },
    h('b', { style: { fontSize: '18px', letterSpacing: '-.02em' } }, 'blush'),
    h('span', { style: { opacity: .35 } }, '/'),
    h('span', { style: { fontWeight: 600 } }, 'Open Peeps'),
    h('span', { style: { fontSize: '12px', opacity: .5 } }, 'remix desk'),
    h('span', { style: { flex: 1 } }),
    btn('🎲 Randomize', randomize),
    btn('Reset', reset, 'pri'),
  );

  const dock = h('div', {
    style: {
      background: '#fff', borderTop: '1px solid #efeae2',
      boxShadow: '0 -8px 30px #0000000a',
    },
  }, tabs, thumbs, swatches);

  const hero = h('div', { style: { padding: '10px 20px 0', textAlign: 'center' } },
    h('div', { style: { fontSize: '28px', fontWeight: 800, letterSpacing: '-.03em' } }, 'Open Peeps'),
    h('div', { style: { fontSize: '13px', opacity: .55 } }, 'Hand-drawn people · swap parts to remix yourself'),
  );

  root.append(h('div', {
    style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' },
  }, top, hero, preview, dock));

  draw();

  window.__demoProof = async () => {
    randomize();
    await sleep(120);
    reset();
    return 'randomized once then reset to default peep';
  };
};

V['atlas-of-emotions-morphing-emotion-continents-fullpage-chapters-state-intensity-bands'] = (root, T) => {
  import('@fontsource/raleway/300.css'); import('@fontsource/raleway/400.css'); import('@fontsource/raleway/500.css'); import('@fontsource/raleway/700.css'); import('@fontsource/raleway/800.css');
  theme(root, T, { bg: '#ffffff', fg: '#222', ac: '#f58b1f', dark: false });
  const RW = "'Raleway','Helvetica Neue',Arial,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SBW = 342;
  css(`.ae{position:absolute;inset:0;background:#fff;color:#333;font-family:${RW};overflow:hidden}
.ae *{box-sizing:border-box}
.ae-main{position:absolute;inset:0;overflow-y:auto;scroll-snap-type:y mandatory;scrollbar-width:none}
.ae-main::-webkit-scrollbar{display:none}
.ae-sec{position:relative;height:100%;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden}
.ae-in{position:absolute;left:${SBW}px;right:0;top:56px;bottom:0}
.ae-side{position:absolute;left:0;top:0;bottom:0;width:${SBW}px;background:#eee;z-index:5;transition:transform .6s cubic-bezier(.6,0,.2,1)}
.ae.intro .ae-side{transform:translateX(-100%)}
.ae-logo{position:absolute;left:26px;top:24px;display:flex;align-items:center;gap:16px;z-index:6;cursor:pointer;color:#222}
.ae-logo .c{width:84px;height:84px;border-radius:50%;background:#1d1d1d;display:grid;place-items:center}
.ae-logo b{font:800 19px/1.2 ${RW};letter-spacing:.16em}
.ae-st{position:absolute;left:27px;right:26px;top:128px}
.ae-st h2{margin:0;padding-bottom:9px;border-bottom:2px solid #555;font:400 22px ${RW};color:#222;display:flex;justify-content:space-between;align-items:baseline}
.ae-st h2 a{font:400 16px ${RW};color:#aaa;cursor:pointer}.ae-st h2 a:hover{color:#333}
.ae-st p{margin:16px 0 0;font:300 16.5px/1.55 ${RW};color:#444}
.ae-st h4{margin:22px 0 0;font:500 16px ${RW};color:#222;text-transform:uppercase;letter-spacing:.01em}
.ae .ae-hbtn{margin-top:20px;width:100%;height:32px;border:1px solid #333;border-radius:4px;background:#fff;font:500 12.5px ${RW};letter-spacing:.04em;box-shadow:0 2px 3px #0002;cursor:pointer}
.ae-lm{position:absolute;left:0;right:0;bottom:0;height:48px;border-top:1px solid #bbb;display:flex;align-items:center;justify-content:center;font:400 17px ${RW};color:#555;cursor:pointer}
.ae-lm::after{content:'›';position:absolute;right:20px;font:300 26px ${RW}}
.ae-lm:hover{background:#e4e4e4}
.ae-nav{position:absolute;left:${SBW}px;right:0;top:0;height:56px;display:flex;align-items:center;justify-content:flex-end;gap:44px;padding-right:26px;z-index:5;background:#eee;transition:opacity .4s,transform .5s}
.ae.dark .ae-nav{background:#eee}
.ae.intro .ae-nav{opacity:0;pointer-events:none;transform:translateY(-100%)}
.ae-nav a{font:400 18px ${RW};color:#8a8a8a;cursor:pointer;white-space:nowrap}.ae-nav a:hover{color:#333}.ae-nav a.on{color:#111;font-weight:700}
.ae-nav .env{width:24px;height:18px;border:1.6px solid #888;border-radius:2px;position:relative;cursor:pointer}
.ae-nav .env::after{content:'';position:absolute;left:3px;right:3px;top:-6px;height:14px;border-right:1.6px solid #888;border-bottom:1.6px solid #888;transform:scaleX(1.2) rotate(45deg);transform-origin:50% 50%;width:10px;margin:0 auto}
.ae-lang{position:absolute;right:26px;top:16px;font:400 17px ${RW};color:#888;z-index:6}
.ae-dots{position:absolute;right:16px;top:50%;transform:translateY(-50%);display:grid;gap:12px;z-index:6}
.ae-dots button{width:9px;height:9px;border-radius:50%;border:1.3px solid #999;background:transparent;padding:0;cursor:pointer;position:relative}
.ae-dots button.on{background:#333;border-color:#333}
.ae-dots button span{position:absolute;right:16px;top:50%;transform:translateY(-50%);font:500 11px ${RW};letter-spacing:.12em;text-transform:uppercase;color:#333;opacity:0;white-space:nowrap;transition:opacity .2s;pointer-events:none}
.ae-dots button:hover span{opacity:1}
.ae-intro{position:absolute;inset:0;display:grid;place-items:center}
.ae-intro svg{position:absolute;left:50%;top:47%;width:820px;height:820px;transform:translate(-50%,-50%)}
.ae-intro .tx{position:relative;text-align:center;margin-top:-30px}
.ae-intro h1{margin:0;font:400 46px ${RW};color:#1d1d1d;letter-spacing:-.005em}
.ae-intro h5{margin:12px 0 0;font:800 18.5px ${RW};color:#111}.ae-intro h5 a{font-weight:400;text-decoration:underline;cursor:pointer;text-underline-offset:3px}
.ae-intro p{margin:22px auto 0;width:500px;font:300 21px/1.6 ${RW};color:#666}
.ae .ae-begin{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);height:68px;padding:0 18px;border:1.5px solid #222;background:#fff;font:400 37px ${RW};color:#111;display:flex;align-items:center;gap:12px;cursor:pointer}
.ae-begin:hover{background:#111;color:#fff}.ae-begin svg{width:40px;height:22px}
.ae svg text{font-family:${RW}}
.ae-lbl{font:400 18px ${RW};letter-spacing:.02em;text-transform:uppercase;cursor:pointer}
.ae-box{position:absolute;width:276px;border:1.5px solid currentColor;background:#fffffff0;padding:14px 20px 14px 20px;display:none;z-index:3}
.ae-box.on{display:block}.ae-box h3{margin:0 0 8px;font:400 18px ${RW};letter-spacing:.02em;text-transform:uppercase}
.ae-box p{margin:0;font:400 13.5px/1.4 ${RW}}.ae-box button.x{position:absolute;right:12px;top:10px;border:0;background:none;color:inherit;font:300 26px/1 ${RW};cursor:pointer;padding:0}
.ae-box a{display:inline-block;margin-top:10px;font:600 12.5px ${RW};letter-spacing:.06em;text-transform:uppercase;cursor:pointer;border-bottom:1px solid currentColor}
.ae-tabs{position:absolute;left:0;right:0;bottom:0;height:56px;display:flex;justify-content:space-around;align-items:center}
.ae-tabs a{font:400 17.5px ${RW};letter-spacing:.02em;text-transform:uppercase;color:#999;cursor:pointer}.ae-tabs a:hover{color:#333}.ae-tabs a.on{color:#111;font-weight:700}
.ae-dark{background:#454545}.ae-dark .ae-tabs a{color:#ccc}.ae-dark .ae-tabs a.on{color:#fff}
.ae-tl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:22px;color:#fff;font:400 20px ${RW};padding-bottom:40px}
.ae-tl .ar{width:70px;height:2px;background:#bbb;position:relative;transform-origin:0 50%;transition:transform .6s}.ae-tl .ar::after{content:'';position:absolute;right:-1px;top:-4px;border:5px solid transparent;border-left:9px solid #bbb;border-right:0}
.ae-tl .em{width:154px;height:154px;border-radius:50%;display:grid;place-items:center;text-align:center;font:400 22px/1.2 ${RW};color:#ffffffcc;transition:background .5s,transform .5s}
.ae-tl .rs{width:250px;opacity:0;transition:opacity .6s}.ae-tl .rs.on{opacity:1}
.ae-tl select{background:transparent;color:#fff;border:0;border-bottom:1px dashed #999;font:400 20px ${RW};padding:2px 0;cursor:pointer}
.ae-tl select option{color:#222}
.ae-pk path{transition:opacity .25s,transform .35s}
.ae-pk .pk{cursor:pointer}
.ae-pill{display:inline-block;margin:4px 6px 4px 0;padding:6px 14px;border-radius:20px;font:500 13px ${RW};letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:transform .3s,opacity .3s}
.ae-pills{position:absolute;right:46px;top:110px;width:250px;opacity:0;transform:translateY(10px);transition:.4s}.ae-pills.on{opacity:1;transform:none}
.ae-pills h6{margin:14px 0 4px;font:700 11px ${RW};letter-spacing:.2em;color:#999}
.ae-ab{position:absolute;inset:0;background:#fff;z-index:20;display:none;padding:110px 0 0 ${SBW + 60}px}
.ae-ab.on{display:block}.ae-ab h2{font:300 44px ${RW};margin:0 0 18px}.ae-ab p{font:300 18px/1.65 ${RW};color:#555;max-width:620px}
.ae .ae-ab button{position:absolute;right:40px;top:30px;width:44px;height:44px;border:0;background:none;font:200 44px/1 ${RW};cursor:pointer;color:#222}
.ae-calm{position:absolute;inset:0;display:grid;place-items:center}
.ae-calm .br{width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,#cfe3f1 0,#a9c8e8 55%,#a9c8e800 72%);display:grid;place-items:center;font:300 26px ${RW};color:#456;transition:transform 4s ease-in-out}
.ae-calm .br.in{transform:scale(1.45)}
.ae-mood{position:absolute;inset:0}
.ae-mood input{width:340px}
@media (prefers-reduced-motion: reduce){.ae-calm .br{transition:none}}
`);
  const EM = [
    { k: 'anger', n: 'Anger', c: '#e3857c', d: 'Anger arises when something blocks us from pursuing a goal and/or we are being treated unfairly.', home: [544, 580, 152], lab: [703, 696],
      st: [['Annoyance', 'Mild anger caused by a nuisance'], ['Frustration', 'Responding to repeated failures to overcome an obstacle'], ['Exasperation', 'Anger caused by an extended or repeated frustration'], ['Argumentativeness', 'Taking a hostile position against someone'], ['Bitterness', 'Anger following unfair treatment'], ['Vengefulness', 'Wanting to retaliate against someone'], ['Fury', 'The most intense anger, losing control']],
      ac: [['Dispute', 1], ['Protest', 1], ['Set limits', 1], ['Insult', 0], ['Quarrel', 0], ['Simmer', 0], ['Scream', 0]], trig: 'you argue back, raising your voice' },
    { k: 'fear', n: 'Fear', c: '#d58ae0', d: 'Fear arises with the threat of harm, either physical, emotional, or psychological, real or imagined.', home: [340, 250, 140], lab: [198, 375],
      st: [['Trepidation', 'Anticipation of the possibility of danger'], ['Nervousness', 'Uncertainty as to whether there is danger'], ['Anxiety', 'Fear of possible threats that might occur'], ['Dread', 'Anticipation of severe danger'], ['Desperation', 'A response to the inability to reduce danger'], ['Panic', 'Sudden uncontrollable fear'], ['Horror', 'Fear mixed with shock and disgust'], ['Terror', 'Intense, overwhelming fear']],
      ac: [['Hesitate', 1], ['Withdraw', 1], ['Seek help', 1], ['Freeze', 0], ['Worry', 0], ['Ruminate', 0]], trig: 'you go quiet and step back' },
    { k: 'disgust', n: 'Disgust', c: '#7ab89b', d: 'Disgust arises as a feeling of aversion towards something offensive.', home: [738, 394, 115], lab: [877, 555],
      st: [['Dislike', 'A feeling of not liking something'], ['Aversion', 'An impulse to avoid something'], ['Distaste', 'Reaction to bad tastes, smells, things or ideas'], ['Repugnance', 'A strong aversion to something offensive'], ['Revulsion', 'A mixture of disgust and loathing'], ['Abhorrence', 'Intense dislike mixed with hatred'], ['Loathing', 'Intense disgust focused on a person']],
      ac: [['Avoid', 1], ['Withdraw', 1], ['Set distance', 1], ['Dehumanize', 0], ['Vilify', 0], ['Exclude', 0]], trig: 'you avoid them for the rest of the day' },
    { k: 'sadness', n: 'Sadness', c: '#a9c8e8', d: 'Sadness arises with the loss of something important.', home: [550, 215, 140], lab: [714, 77],
      st: [['Disappointment', 'Feeling that expectations are not being met'], ['Discouragement', 'A response to repeated failures'], ['Distraughtness', 'Feeling agitated or upset'], ['Resignation', 'Giving up because nothing will change'], ['Helplessness', 'Knowing you can do nothing'], ['Hopelessness', 'Believing nothing will get better'], ['Misery', 'Unbearable sadness'], ['Despair', 'Loss of all hope'], ['Grief', 'Sadness over the loss of someone'], ['Sorrow', 'A deep feeling of loss'], ['Anguish', 'Intense sadness, sometimes with protest']],
      ac: [['Mourn', 1], ['Seek comfort', 1], ['Protest', 1], ['Withdraw', 0], ['Ruminate', 0], ['Self-blame', 0]], trig: 'you feel hurt and pull away' },
    { k: 'enjoyment', n: 'Enjoyment', c: '#f58b1f', d: 'Enjoyment describes the many good feelings that arise from experiences both novel and familiar.', home: [397, 516, 183], lab: null,
      st: [['Sensory Pleasure', 'Enjoyment derived through one of the five senses'], ['Rejoicing', 'Overflowing joy at something good'], ['Compassion', 'Joy in another’s happiness'], ['Amusement', 'Pleasurable, relaxed excitation'], ['Schadenfreude', 'Enjoyment of the misfortunes of others'], ['Relief', 'When something unpleasant has been avoided'], ['Peace', 'Ease and contentment'], ['Pride', 'Pleasure in an accomplishment'], ['Fiero', 'Enjoyment of meeting a difficult challenge'], ['Naches', 'Joy in a child’s accomplishments'], ['Wonder', 'Encountering something incomprehensible'], ['Excitement', 'A strong response to novelty'], ['Ecstasy', 'Rapturous delight, nearly overwhelming']],
      ac: [['Exclaim', 1], ['Engage/Connect', 1], ['Gloat', 0], ['Indulge', 0], ['Maintain', 1], ['Savor', 1], ['Seek more', 1]], trig: 'you laugh it off together' }];
  const CH = [['intro', 'Introduction'], ['exp', 'Experience'], ['states', 'States'], ['tl', 'Timeline'], ['resp', 'Response'], ['mood', 'Moods'], ['calm', 'Strategies']];
  const SIDE = { exp: ['Our Experience', 'Most emotions researchers agree on these five Universal Emotions: emotions that all humans, no matter where or how we were raised, have in common. The movement of the shapes reflects the fluid nature of emotions – the way their strength and frequency varies from moment to moment. Select an emotion to learn more.'],
    states: ['Emotional States', 'Each emotion is a family of states that vary in intensity. Hover a band to see its name and what it feels like; the higher the band, the more intense the state.'],
    tl: ['The Timeline', 'Our emotions unfold on a timeline. The timeline begins with a trigger that initiates an emotional experience and ultimately results in a response.\n\nTry choosing different emotions from the list below the timeline.\n\nNotice how the same trigger can lead to a different response, depending on the emotion we feel.'],
    resp: ['Our Response', 'We respond to emotional states with our actions. Our responses to the same emotion may differ depending on the circumstances. Any response can be constructive and helpful to ourselves, others and the situation, or destructive and not helpful.'],
    mood: ['Moods', 'Moods are like emotions that linger: they can last for hours or days and colour everything we notice. Drag the slider to stretch a feeling into a mood.'],
    calm: ['Strategies', 'Calm is the ability to step back from our emotions so we can choose how to respond. Breathe with the circle: in as it grows, out as it shrinks.'] };
  const el = h('div.ae.intro'); root.append(el);
  const tri = '<svg width="34" height="30" viewBox="0 0 34 30"><path d="M17 2 32 28H2z" fill="#fff"/></svg>';
  const logo = h('div.ae-logo', { onclick: () => go(0) }, h('div.c', { html: tri }), h('b', {}, 'ATLAS', h('br'), 'OF', h('br'), 'EMOTIONS'));
  const stH = h('h2'), stP = h('div'); const st = h('div.ae-st', {}, stH, stP);
  const about = h('div.ae-ab', {}, h('button', { onclick: () => about.classList.remove('on'), 'aria-label': 'Close' }, '×'), h('h2', {}, 'About the Atlas'), h('p', {}, 'The Atlas of Emotions maps five universal emotions and the states, triggers, actions and moods that belong to each. It was made to build a vocabulary of feelings and to show that emotions unfold on a timeline we can learn to notice.'), h('p', {}, 'This page is a practice clone: shapes, copy and interactions are rebuilt in code as stand-ins for the original.'));
  const side = h('aside.ae-side', {}, st, h('div.ae-lm', { onclick: () => about.classList.add('on') }, 'Learn More'));
  const navA = CH.slice(1).map(([k, n], i) => h('a', { onclick: () => go(i + 1) }, n));
  const nav = h('nav.ae-nav', {}, navA, h('span.env', { title: 'Contact', onclick: () => toast('Newsletter sign-up (demo)') }), h('a', { onclick: () => toast('Language menu (demo)') }, '(English)'));
  const dots = h('div.ae-dots', {}, CH.map(([k, n], i) => h('button', { onclick: () => go(i), 'aria-label': n }, h('span', {}, n))));
  const main = h('div.ae-main'); el.append(main, side, nav, logo, dots, about);
  const sec = CH.map(([k]) => { const x = h('section.ae-sec', { 'data-k': k }); main.append(x); return x; });
  const NSV = 'http://www.w3.org/2000/svg';
  const nz = noise2(42); const sn = (x, y) => (nz(x, y) - 0.5) * 2;
  // ---------- 1. intro ----------
  const iSvg = s('svg', { viewBox: '-410 -410 820 820' }); const iRings = [];
  for (let i = 0; i < 9; i++) { const r = 400 - i * 38; const c = s('circle', { r, fill: i % 2 ? '#f3c9f2' : '#efd7f0', opacity: i % 2 ? 0.75 : 0.6, stroke: '#e6c2e8', 'stroke-width': 2 }); iRings.push(c); iSvg.append(c); }
  iSvg.append(s('circle', { r: 24, fill: '#fff', opacity: 0.6 }));
  sec[0].append(h('div.ae-intro', {}, iSvg, h('div.tx', {}, h('h1', {}, 'Welcome to the Atlas of Emotions'), h('h5', {}, 'SUPPORTED BY THE DALAI LAMA ', h('a', { onclick: () => about.classList.add('on') }, 'LEARN MORE')), h('p', {}, 'The Atlas is an interactive tool that builds your vocabulary of emotions and illuminates your emotional world.'))),
    h('button.ae-begin', { onclick: () => go(1) }, 'Begin', h('span', { html: '<svg viewBox="0 0 40 22"><path d="M3 3l17 16L37 3" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>' })), h('div.ae-lang', {}, '(English)'));
  // ---------- 2. experience: morphing continents ----------
  const W2 = 1098, H2 = 806;
  const eIn = h('div.ae-in'); sec[1].append(eIn);
  const eSvg = s('svg', { viewBox: `0 0 ${W2} ${H2}`, width: '100%', height: '100%', style: 'position:absolute;inset:0' }); eIn.append(eSvg);
  const box = h('div.ae-box', {}, h('button.x', { onclick: () => select(null), 'aria-label': 'Close' }, '×'), h('h3'), h('p'), h('a', { onclick: () => { if (sel) { stE = sel; go(2); } } }, 'See its states ↓')); eIn.append(box);
  const PTS = 72; const order = [1, 3, 2, 0, 4];
  EM.forEach((e, ei) => { e.g = s('g', { style: 'cursor:pointer' }); e.rings = e.st.map((x, i) => s('path', { fill: e.c, stroke: '#fff', 'stroke-width': 1.6, 'stroke-opacity': 0.6 })); e.core = s('circle', { r: 8, fill: '#fff' }); e.coreR = s('circle', { r: 20, fill: e.c, opacity: 0.6 });
    e.lbls = e.st.map(([n]) => s('text', { 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: '#fff', 'font-size': 12.5, 'font-weight': 600, 'letter-spacing': '.06em', opacity: 0, style: 'pointer-events:none;text-transform:uppercase' }, n.toUpperCase()));
    e.rings.forEach((r, i) => { r.addEventListener('pointerenter', () => { if (sel === e && e.m > 0.9) bandHover(e, i); }); });
    e.g.append(...e.rings, e.coreR, e.core, ...e.lbls); e.g.addEventListener('click', (ev) => { ev.stopPropagation(); if (sel !== e) select(e); });
    e.g.addEventListener('pointerenter', () => { e.hov = 1; }); e.g.addEventListener('pointerleave', () => { e.hov = 0; if (sel === e) bandHover(e, -1); });
    e.lab && (e.lt = s('text', { x: e.lab[0], y: e.lab[1], fill: e.c, class: 'ae-lbl', 'font-size': 18, 'letter-spacing': '.02em', onclick: () => select(e) }, e.n.toUpperCase()));
    e.m = 0; e.mt = 0; e.a = 1; e.hov = 0; e.hs = 1; e.seed = ei * 3.7; e.cx = e.home[0]; e.cy = e.home[1]; });
  order.forEach((i) => eSvg.append(EM[i].g)); EM.forEach((e) => e.lt && eSvg.append(e.lt));
  eSvg.addEventListener('click', () => select(null));
  let sel = null, hovBand = -1;
  const FOC = [300, 430];
  const select = (e) => { sel = e; EM.forEach((x) => (x.mt = x === e ? 1 : 0)); box.classList.toggle('on', !!e); if (e) { box.style.color = e.k === 'sadness' ? '#6f9fd0' : e.k === 'disgust' ? '#4f9a78' : e.c; box.style.left = '560px'; box.style.top = '300px'; box.children[1].textContent = e.n; box.children[2].textContent = e.d; } hovBand = -1; };
  const bandHover = (e, i) => { hovBand = i; if (i < 0) { box.children[1].textContent = e.n; box.children[2].textContent = e.d; return; } box.children[1].textContent = e.st[i][0]; box.children[2].textContent = e.st[i][1] + ` · intensity ${i + 1}/${e.st.length}`; };
  const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
  const ringPath = (e, i, t, time) => { const n = e.rings.length, r0 = e.home[2] * e.hs, k = i / n; const r = r0 * (1 - k * 0.86); const m = ease(e.m);
    const bandsH = Math.min(520, n * 46), bh = bandsH / n, by = FOC[1] + bandsH / 2 - (i + 0.5) * bh, bw = 300 * (1 - k * 0.55), hh = bh / 2 - 2.5;
    let d = ''; for (let p = 0; p < PTS; p++) { const a = p / PTS * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      const wob = RM ? 0 : 0.045 * sn(ca * 1.2 + time * 0.25 + e.seed, sa * 1.2 + i * 0.35 + time * 0.18);
      const cx = e.cx + (RM ? 0 : sn(time * 0.08 + e.seed, 3) * 10) * (1 - m), cy = e.cy + (RM ? 0 : sn(5, time * 0.08 + e.seed) * 10) * (1 - m);
      const x1 = cx + ca * r * (1 + wob), y1 = cy + sa * r * (1 + wob);
      const x2 = FOC[0] + clamp(ca * 1.45, -1, 1) * bw / 2, y2 = by + clamp(sa * 1.45, -1, 1) * hh;
      d += (p ? 'L' : 'M') + (x1 + (x2 - x1) * m).toFixed(1) + ' ' + (y1 + (y2 - y1) * m).toFixed(1); }
    return d + 'Z'; };
  // ---------- 3. states: intensity peaks ----------
  let stE = EM[4], hovPk = -1;
  const sIn = h('div.ae-in'); sec[2].append(sIn);
  const sSvg = s('svg', { viewBox: `0 0 ${W2} ${H2 - 56}`, width: '100%', height: H2 - 56, class: 'ae-pk', style: 'position:absolute;left:0;top:0' }); sIn.append(sSvg);
  const sInfo = h('div', { style: { position: 'absolute', left: '60px', top: '24px', width: '420px' } }); sIn.append(sInfo);
  const tabsS = h('div.ae-tabs', {}, EM.map((e) => h('a', { onclick: () => { stE = e; drawStates(); } }, e.n))); sIn.append(tabsS);
  const peakPath = (x, base, w, hgt, lean = 0.3) => `M${x - w} ${base} C${x - w * 0.55} ${base - hgt * 0.25} ${x - w * 0.08} ${base - hgt * 0.7} ${x + lean * 10} ${base - hgt} C${x + w * 0.18} ${base - hgt * 0.62} ${x + w * 0.3} ${base - hgt * 0.25} ${x + w * 0.42} ${base} Z`;
  const shade = (hex, k) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); const f = (v) => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k).toString(16).padStart(2, '0'); return '#' + f(r) + f(g) + f(b); };
  const drawStates = () => { sSvg.replaceChildren(); const e = stE, n = e.st.length, base = 560, x0 = 300, x1 = 860;
    const defs = s('defs'); sSvg.append(defs);
    sSvg.append(s('line', { x1: 230, y1: base, x2: 920, y2: base, stroke: '#ddd', 'stroke-width': 1.5 }), s('path', { d: `M200 ${base} V190`, stroke: '#bbb', 'stroke-width': 1.4 }), s('path', { d: 'M195 198l5-9 5 9', fill: 'none', stroke: '#bbb', 'stroke-width': 1.4 }), s('text', { x: 186, y: 178, 'font-size': 11, 'letter-spacing': '.2em', fill: '#999' }, 'INTENSITY'));
    e.pk = e.st.map(([nm, ds], i) => { const gid = `aeg${e.k}${i}`; defs.append(s('linearGradient', { id: gid, x1: 0, y1: 1, x2: 0.4, y2: 0 }, s('stop', { offset: 0, 'stop-color': shade(e.c, 0.45) }), s('stop', { offset: 1, 'stop-color': shade(e.c, -0.08 - i / n * 0.15) })));
      const x = x0 + (i / Math.max(1, n - 1)) * (x1 - x0), hg = 90 + (i / (n - 1)) * 330 + (i % 2 ? 18 : 0); const p = s('path', { class: 'pk', d: peakPath(x, base, 110 + i * 4, hg), fill: `url(#${gid})`, opacity: 0.88 });
      p.addEventListener('pointerenter', () => peakHover(i)); p.addEventListener('pointerleave', () => peakHover(-1)); p.addEventListener('click', () => { respE = e; respState = i; go(4); }); sSvg.append(p); return { p, x, hg }; });
    e.pkLbl = s('text', { 'text-anchor': 'middle', 'font-size': 15, fill: shade(e.c, -0.35), 'letter-spacing': '.08em', opacity: 0 }); sSvg.append(e.pkLbl);
    [...tabsS.children].forEach((a, i) => a.classList.toggle('on', EM[i] === e)); peakHover(-1); };
  const peakHover = (i) => { hovPk = i; const e = stE; e.pk.forEach((o, j) => o.p.setAttribute('opacity', i < 0 ? 0.88 : j === i ? 1 : 0.28));
    if (i < 0) { e.pkLbl.setAttribute('opacity', 0); sInfo.replaceChildren(h('div', { style: { font: `400 15px ${RW}`, color: '#999', letterSpacing: '.04em' } }, `${e.n.toUpperCase()} · ${e.st.length} STATES`), h('p', { style: { font: `300 16px/1.5 ${RW}`, color: '#555', margin: '8px 0 0' } }, 'Hover a shape to read the state; click it to see the actions it can lead to.')); return; }
    const o = e.pk[i]; e.pkLbl.setAttribute('x', o.x); e.pkLbl.setAttribute('y', 560 - o.hg - 14); e.pkLbl.textContent = e.st[i][0].toUpperCase(); e.pkLbl.setAttribute('opacity', 1);
    sInfo.replaceChildren(h('div', { style: { font: `500 21px ${RW}`, color: shade(e.c, -0.3), letterSpacing: '.03em' } }, e.st[i][0].toUpperCase()), h('p', { style: { font: `300 16.5px/1.5 ${RW}`, color: '#444', margin: '8px 0 0' } }, e.st[i][1]), h('div', { style: { marginTop: '10px', height: '4px', width: '220px', background: '#eee' } }, h('div', { style: { height: '100%', width: ((i + 1) / e.st.length * 100) + '%', background: e.c } }))); };
  // ---------- 4. timeline ----------
  sec[3].classList.add('ae-dark'); const tIn = h('div.ae-in'); sec[3].append(tIn);
  const TRIG = ['a friend gets upset with you', 'you miss the last train home', 'a stranger compliments your work'];
  let tlE = EM[0];
  const trigSel = h('select', { onchange: () => playTl() }, TRIG.map((t) => h('option', { value: t }, t)));
  const emC = h('div.em'), rs = h('div.rs'), ar1 = h('div.ar'), ar2 = h('div.ar');
  tIn.append(h('div.ae-tl', {}, trigSel, ar1, emC, ar2, rs));
  const tabsT = h('div.ae-tabs', {}, EM.map((e) => h('a', { onclick: () => { tlE = e; playTl(); } }, e.n))); tIn.append(tabsT);
  let tlT = 0;
  const playTl = () => { clearTimeout(tlT); const e = tlE; [...tabsT.children].forEach((a, i) => a.classList.toggle('on', EM[i] === e));
    emC.style.background = `radial-gradient(circle, ${shade(e.c, -0.15)} 0 34%, ${e.c}cc 35% 52%, ${e.c}88 53% 68%, ${e.c}55 69% 100%)`; emC.replaceChildren('you feel', h('br'), e.n.toUpperCase());
    rs.classList.remove('on'); ar2.style.transform = 'scaleX(0)'; emC.style.transform = 'scale(.85)';
    tlT = setTimeout(() => { emC.style.transform = 'scale(1)'; ar2.style.transform = 'scaleX(1)'; rs.textContent = '→ ' + e.trig; rs.classList.add('on'); }, RM ? 0 : 450); };
  // ---------- 5. response ----------
  let respE = EM[4], respState = -1, respAct = -1;
  const rIn = h('div.ae-in'); sec[4].append(rIn);
  const rSvg = s('svg', { viewBox: `0 0 ${W2} ${H2 - 56}`, width: '100%', height: H2 - 56, class: 'ae-pk', style: 'position:absolute;left:0;top:0' }); rIn.append(rSvg);
  const pills = h('div.ae-pills'); rIn.append(pills);
  const tabsR = h('div.ae-tabs', {}, EM.map((e) => h('a', { onclick: () => { respE = e; respState = -1; drawResp(); } }, e.n))); rIn.append(tabsR);
  const drawResp = () => { rSvg.replaceChildren(); const e = respE, n = e.st.length, base = 380, cx = 470; const defs = s('defs'); rSvg.append(defs);
    defs.append(s('linearGradient', { id: 'aerg', x1: 0, y1: 0, x2: 1, y2: 1 }, s('stop', { offset: 0, 'stop-color': shade(e.c, 0.5) }), s('stop', { offset: 1, 'stop-color': e.c })));
    e.st.forEach(([nm], i) => { const x = 380 + (i / Math.max(1, n - 1)) * 240, hg = 70 + (i / (n - 1)) * 200; const p = s('path', { class: 'pk', d: peakPath(x, base, 70 + i * 2, hg), fill: 'url(#aerg)', opacity: respState < 0 ? 0.75 : i === respState ? 1 : 0.22 });
      p.addEventListener('click', () => { respState = respState === i ? -1 : i; drawResp(); }); p.append(s('title', {}, nm)); rSvg.append(p); });
    if (respState >= 0) rSvg.append(s('text', { x: cx, y: 70, 'text-anchor': 'middle', 'font-size': 16, 'letter-spacing': '.08em', fill: shade(e.c, -0.35) }, e.st[respState][0].toUpperCase()));
    const A = e.ac, m = A.length, rad = 260; const grow = respState >= 0 ? 1 : 0.72;
    A.forEach(([nm, good], i) => { const ang = Math.PI * (0.03 + 0.94 * (i / (m - 1))); const L2 = rad * (0.62 + 0.38 * Math.sin(ang)) * grow; const tx = cx - Math.cos(ang) * L2, ty = base + Math.sin(ang) * L2 * 0.75;
      const nx = -Math.sin(ang) * 14, ny = Math.cos(ang) * 14 * 0.75; const mx = cx + (tx - cx) * 0.62, my = base + (ty - base) * 0.62;
      const p = s('path', { d: `M${cx} ${base} Q${mx + nx} ${my + ny} ${tx} ${ty} Q${mx - nx} ${my - ny} ${cx} ${base}Z`, fill: good ? 'url(#aerg)' : shade(e.c, -0.1), opacity: respAct < 0 ? 0.9 : respAct === i ? 1 : 0.3, style: 'cursor:pointer', 'stroke-dasharray': good ? '' : '4 3', stroke: good ? 'none' : shade(e.c, -0.3) });
      p.addEventListener('click', () => { respAct = respAct === i ? -1 : i; drawResp(); }); rSvg.append(p);
      rSvg.append(s('text', { x: tx - Math.cos(ang) * 22, y: ty + Math.sin(ang) * 18 + 4, 'text-anchor': ang < 1.3 ? 'end' : ang > 1.85 ? 'start' : 'middle', 'font-size': 12.5, fill: shade(e.c, -0.1), 'letter-spacing': '.04em' }, nm.toUpperCase())); });
    pills.classList.toggle('on', respState >= 0); pills.style.color = e.c;
    pills.replaceChildren(h('div', { style: { font: `500 18px ${RW}`, color: '#222' } }, respState >= 0 ? `ACTIONS OF ${e.st[respState][0].toUpperCase()}` : ''), h('h6', {}, 'CONSTRUCTIVE'), ...A.filter((a) => a[1]).map(([nm]) => h('span.ae-pill', { style: { background: e.c, color: '#fff' } }, nm)), h('h6', {}, 'DESTRUCTIVE'), ...A.filter((a) => !a[1]).map(([nm]) => h('span.ae-pill', { style: { border: `1.5px dashed ${shade(e.c, -0.25)}`, color: shade(e.c, -0.25) } }, nm)));
    [...tabsR.children].forEach((a, i) => a.classList.toggle('on', EM[i] === e)); };
  // ---------- 6. moods ----------
  const mIn = h('div.ae-in'); sec[5].append(mIn); let moodE = EM[3], moodV = 0.2;
  const mSvg = s('svg', { viewBox: `0 0 ${W2} ${H2 - 56}`, width: '100%', height: H2 - 56, style: 'position:absolute;left:0;top:0' }, s('defs', {}, s('filter', { id: 'aeblur', x: '-50%', y: '-50%', width: '200%', height: '200%' }, s('feGaussianBlur', { stdDeviation: 8 }))));
  const mBlob = s('path', { filter: 'url(#aeblur)', opacity: 0.8 }); mSvg.append(mBlob); mIn.append(mSvg);
  const mRange = h('input', { type: 'range', min: 0, max: 1, step: 0.01, value: moodV, oninput: (ev) => { moodV = +ev.target.value; mTxt.textContent = moodV < 0.33 ? 'an emotion · seconds to minutes' : moodV < 0.66 ? 'a lingering feeling · hours' : 'a mood · days'; } });
  const mTxt = h('div', { style: { font: `400 15px ${RW}`, letterSpacing: '.08em', color: '#777', marginTop: '6px', textTransform: 'uppercase' } }, 'an emotion · seconds to minutes');
  mIn.append(h('div', { style: { position: 'absolute', left: '50%', bottom: '90px', transform: 'translateX(-50%)', textAlign: 'center' } }, mRange, mTxt));
  const tabsM = h('div.ae-tabs', {}, EM.map((e) => h('a', { onclick: () => { moodE = e; [...tabsM.children].forEach((a, i) => a.classList.toggle('on', EM[i] === e)); } }, e.n))); mIn.append(tabsM); tabsM.children[3].classList.add('on');
  // ---------- 7. calm ----------
  const cIn = h('div.ae-in'); sec[6].append(cIn); const br = h('div.br', {}, 'breathe in'); cIn.append(h('div.ae-calm', {}, br));
  let brT = setInterval(() => { if (RM) return; const inn = !br.classList.contains('in'); br.classList.toggle('in', inn); br.textContent = inn ? 'breathe in' : 'breathe out'; }, 4000);
  // ---------- chapter state ----------
  let cur = 0;
  const setSide = (k) => { const sd = SIDE[k]; if (!sd) return; stH.replaceChildren(sd[0], k === 'tl' ? h('a', { onclick: () => playTl() }, 'restart ↻') : ''); stP.replaceChildren(...sd[1].split('\n\n').map((t) => h('p', {}, t)), k === 'tl' ? h('button.ae-hbtn', { onclick: () => toast('Trigger → experience → response') }, 'HOW DOES THIS HAPPEN?') : '', k === 'resp' ? h('h4', {}, `Actions of ${respE.n}`) : ''); };
  const onCh = (i) => { if (i === cur && el.dataset.ch) return; cur = i; el.dataset.ch = CH[i][0]; el.classList.toggle('intro', i === 0); navA.forEach((a, j) => a.classList.toggle('on', j + 1 === i)); [...dots.children].forEach((b, j) => b.classList.toggle('on', j === i)); setSide(CH[i][0]);
    if (CH[i][0] === 'tl') playTl(); if (CH[i][0] === 'states') drawStates(); if (CH[i][0] === 'resp') drawResp(); logo.style.display = ''; };
  const go = (i, instant) => { main.scrollTo({ top: i * main.clientHeight, behavior: instant || RM ? 'instant' : 'smooth' }); if (instant) onCh(i); };
  main.addEventListener('scroll', () => onCh(Math.round(main.scrollTop / (main.clientHeight || 1))));
  // ---------- animation loop ----------
  const t0 = performance.now();
  const frame = () => { requestAnimationFrame(frame); const time = (performance.now() - t0) / 1000;
    if (cur === 0) iRings.forEach((c, i) => c.setAttribute('r', (400 - i * 38) * (1 + (RM ? 0 : 0.012 * Math.sin(time * 0.9 - i * 0.5)))));
    if (cur === 1 || cur === 2) EM.forEach((e) => { e.m += (e.mt - e.m) * 0.07; const ta = sel && sel !== e ? 0 : 1; e.a += (ta - e.a) * 0.1; e.hs += ((e.hov && !sel ? 1.06 : 1) - e.hs) * 0.15; const m = ease(e.m);
      e.rings.forEach((r, i) => { r.setAttribute('d', ringPath(e, i, e.m, time)); const k = i / e.rings.length; const op = m > 0.5 ? (0.35 + 0.65 * k) * (hovBand < 0 || hovBand === i ? 1 : 0.35) : (i % 2 ? 0.32 : 0.2) + k * 0.12; r.setAttribute('fill-opacity', op.toFixed(3)); r.setAttribute('stroke-width', m > 0.5 ? 0 : 1.6); r.style.pointerEvents = m > 0.9 || i === 0 ? 'auto' : 'none'; });
      const n = e.rings.length; e.lbls.forEach((l, i) => { const bandsH = Math.min(520, n * 46), bh = bandsH / n; l.setAttribute('x', FOC[0]); l.setAttribute('y', FOC[1] + bandsH / 2 - (i + 0.5) * bh + 1); l.setAttribute('opacity', Math.max(0, m * 1.4 - 0.4).toFixed(2)); l.setAttribute('font-size', Math.min(12.5, bh * 0.45)); });
      const ccx = e.cx + (FOC[0] - e.cx) * m, ccy = e.cy; e.core.setAttribute('cx', ccx); e.core.setAttribute('cy', ccy); e.coreR.setAttribute('cx', ccx); e.coreR.setAttribute('cy', ccy); e.core.setAttribute('opacity', 1 - m); e.coreR.setAttribute('opacity', (1 - m) * 0.55); e.coreR.setAttribute('r', e.home[2] * 0.14);
      e.g.setAttribute('opacity', e.a.toFixed(3)); e.g.style.pointerEvents = e.a < 0.3 ? 'none' : ''; if (e.lt) e.lt.setAttribute('opacity', (sel ? 0 : 1) * e.a); });
    if (cur === 5) { const e = moodE, r = 150 + moodV * 90; let d = ''; for (let p = 0; p < 60; p++) { const a = p / 60 * 6.283, w = 1 + 0.18 * sn(Math.cos(a) + time * (0.5 - moodV * 0.4), Math.sin(a) + time * 0.2); d += (p ? 'L' : 'M') + (550 + Math.cos(a) * r * w).toFixed(1) + ' ' + (330 + Math.sin(a) * r * w * 0.9).toFixed(1); } mBlob.setAttribute('d', d + 'Z'); mBlob.setAttribute('fill', e.c); mBlob.firstChild || 0; mSvg.querySelector('feGaussianBlur').setAttribute('stdDeviation', 6 + moodV * 40); } };
  EM.forEach((e) => (e.cx = e.home[0], e.cy = e.home[1]));
  requestAnimationFrame(frame); onCh(0);
  // ---------- demo proof ----------
  const reset = () => { select(null); EM.forEach((e) => { e.m = 0; e.a = 1; }); stE = EM[4]; respE = EM[4]; respState = -1; respAct = -1; tlE = EM[0]; trigSel.value = TRIG[0]; moodE = EM[3]; moodV = 0.2; mRange.value = 0.2; about.classList.remove('on'); go(0, true); };
  window.__demoProof = async () => { const o = []; reset(); await sleep(50);
    o.push(`intro: sidebar hidden=${el.classList.contains('intro')}`); sec[0].querySelector('.ae-begin').click(); go(1, true); await sleep(120);
    o.push(`Begin → chapter "${el.dataset.ch}", nav active="${navA.find((a) => a.classList.contains('on'))?.textContent}"`);
    const p0 = EM[0].rings[0].getAttribute('d'); await sleep(250); o.push(`continents morphing (anger outline changed=${EM[0].rings[0].getAttribute('d') !== p0})`);
    EM[0].g.dispatchEvent(new MouseEvent('click', { bubbles: true })); await sleep(1300);
    o.push(`click ANGER → info box "${box.children[1].textContent}", expanded to ${EM[0].rings.length} intensity bands (morph=${EM[0].m.toFixed(2)}), others faded=${EM.filter((e) => e !== EM[0]).every((e) => e.a < 0.2)}`);
    EM[0].rings[3].dispatchEvent(new PointerEvent('pointerenter')); o.push(`hover band 4 → "${box.children[1].textContent}": ${box.children[2].textContent}`);
    box.querySelector('button.x').click(); await sleep(900); o.push(`× close → restored continents (anger morph=${EM[0].m.toFixed(2)})`);
    go(2, true); tabsS.children[1].click(); stE.pk[5].p.dispatchEvent(new PointerEvent('pointerenter')); o.push(`States: FEAR tab, hover peak → "${sInfo.firstChild.textContent}"`);
    go(3, true); tabsT.children[4].click(); await sleep(600); o.push(`Timeline: trigger "${trigSel.value}" + ENJOYMENT → "${emC.textContent}" ${rs.textContent}`);
    go(4, true); respE = EM[4]; respState = -1; drawResp(); rSvg.querySelectorAll('.pk')[7].dispatchEvent(new MouseEvent('click')); o.push(`Response: click state → "${pills.firstChild.textContent}", constructive=[${[...pills.querySelectorAll('.ae-pill')].filter((p) => p.style.background).map((p) => p.textContent).join(', ')}], destructive=${pills.querySelectorAll('.ae-pill').length - pills.querySelectorAll('.ae-pill[style*="background"]').length}`);
    main.dispatchEvent(new WheelEvent('wheel', { deltaY: 120 })); go(5, true); mRange.value = 0.9; mRange.dispatchEvent(new Event('input')); o.push(`Moods slider → "${mTxt.textContent}"`);
    go(6, true); o.push(`Strategies: breathing "${br.textContent}"`);
    side.querySelector('.ae-lm').click(); o.push(`About overlay open=${about.classList.contains('on')}`); about.querySelector('button').click(); o.push(`× → closed=${!about.classList.contains('on')}`);
    reset(); await sleep(60); document.querySelector('.tg-toast')?.classList.remove('on'); o.push(`restored: intro chapter, continents home, scroll=${main.scrollTop}`); return o.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['blobmaker-organic-svg-desk'])(root, T); }
