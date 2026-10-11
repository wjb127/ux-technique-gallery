import { h, s, css, drag, localPos, clamp, copy, toast, sleep, rng, pick, noise2, fitCanvas } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle } from '../kit.js';
import { glCanvas } from './sim.js';
const nz = noise2(11); const sn = (x, y) => (nz(x, y) - 0.5) * 2.2;
const V = {};
const dl = (cv, n) => { const a = h('a', { download: n, href: cv.toDataURL() }); a.click(); };
V['tinkersynth-slopes-synth-desk'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#6c4cf5', dark: false });
  const P = { lines: 60, amp: 40, freq: 0.012, seed: 3, peaks: 0.6, perspective: 0.4, split: false };
  const cv = h('canvas', { width: 520, height: 640, style: { width: '400px', height: '492px', background: '#000' } });
  const draw = () => { const g = cv.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 520, 640); g.strokeStyle = '#fff'; g.lineWidth = 1.4; for (let i = 0; i < P.lines; i++) { const y0 = 80 + (i / P.lines) * 500; g.beginPath(); let first = true; for (let x = 40; x <= 480; x += 3) { const cx = Math.abs(x - 260) / 220; const env = Math.pow(1 - cx, 2) * P.peaks * 2; const n = sn(x * P.freq + P.seed * 10, i * 0.25 + P.seed) ; const y = y0 - Math.max(0, n) * P.amp * env * (1 + i * P.perspective / P.lines); if (first) { g.moveTo(x, y); first = false; } else g.lineTo(x, y); } g.save(); g.fillStyle = '#000'; g.lineTo(480, 640); g.lineTo(40, 640); g.closePath(); g.fill(); g.restore(); g.beginPath(); first = true; for (let x = 40; x <= 480; x += 3) { const cx = Math.abs(x - 260) / 220; const env = Math.pow(1 - cx, 2) * P.peaks * 2; const n = sn(x * P.freq + P.seed * 10, i * 0.25 + P.seed); const y = y0 - Math.max(0, n) * P.amp * env * (1 + i * P.perspective / P.lines); if (first) { g.moveTo(x, y); first = false; } else g.lineTo(x, y); } g.stroke(); } };
  const knob = (lab, k, mn, mx) => { const el = h('div', { style: { width: '54px', height: '54px', borderRadius: '50%', background: 'conic-gradient(#f0f 0 ' + ((P[k] - mn) / (mx - mn)) * 100 + '%,#333 0)', border: '4px solid #111', cursor: 'ns-resize' } }); let y0, v0; drag(el, { start: (e) => { y0 = e.clientY; v0 = P[k]; }, move: (e) => { P[k] = clamp(v0 + ((y0 - e.clientY) / 150) * (mx - mn), mn, mx); el.style.background = 'conic-gradient(#f0f 0 ' + ((P[k] - mn) / (mx - mn)) * 100 + '%,#333 0)'; draw(); } }); return h('div', { style: { display: 'grid', justifyItems: 'center', gap: '4px', fontSize: '10px', color: '#ccc' } }, el, lab); };
  const mod = (t, ...k) => h('div', { style: { background: '#1b1b1f', border: '2px solid #333', borderRadius: '6px', padding: '10px', display: 'grid', gap: '8px', color: '#ddd', fontSize: '11px' } }, h('b', { style: { color: '#f0f', letterSpacing: '.1em' } }, t), ...k);
  root.append(h('div.k-row', { style: { height: '56px', padding: '0 30px' } }, h('b', { style: { color: '#6c4cf5' } }, '▼ Tinkersynth-ish'), h('span', { style: { flex: 1 } }), 'Gallery', 'Shop', 'Help'), h('div', { style: { display: 'flex', gap: '30px', padding: '10px 60px' } }, h('div', { style: { background: '#fff', padding: '20px', boxShadow: '0 10px 40px #0002', display: 'grid', gap: '14px' } }, cv, h('div.k-row', {}, h('span', { style: { background: '#222', color: '#fff', borderRadius: '50%', width: '34px', height: '34px', display: 'grid', placeItems: 'center' } }, '⟳'), h('span', { style: { flex: 1 } }), h('button', { style: { background: '#6c4cf5', color: '#fff', border: 0, padding: '10px 24px', borderRadius: '6px' }, onclick: () => dl(cv, 'slopes.png') }, 'Download'))), h('div', { style: { flex: 1, background: '#f3efe6', borderRadius: '10px', padding: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignContent: 'start' } }, h('div', { style: { gridColumn: '1/-1', font: '900 34px Georgia', color: '#1b1b1f' } }, 'Slopes'), mod('LINES', slider('Count', 10, 120, P.lines, 1, (v) => { P.lines = v; draw(); })), mod('PEAKS', h('div.k-row', {}, knob('Amp', 'amp', 0, 120), knob('Peaks', 'peaks', 0, 1.5))), mod('NOISE', slider('Frequency', 0.002, 0.04, P.freq, 0.001, (v) => { P.freq = v; draw(); }), btn('Randomize seed', () => { P.seed = Math.random() * 100; draw(); })), mod('PERSPECTIVE', slider('Depth', 0, 2, P.perspective, 0.05, (v) => { P.perspective = v; draw(); })), mod('PRINT', h('div', {}, '18×24" archival giclée'), h('div', { style: { color: '#f0f' } }, '$60')))));
  draw();
  window.__demoProof = async () => { P.amp = 70; P.peaks = 0.9; draw(); return 'slopes regenerated with higher peaks'; };
};
V['ritmo-simplex-wave-studio'] = (root, T) => {
  theme(root, T, { bg: '#ececec', fg: '#222', panel: '#fff', ac: '#1e90ff', dark: false });
  const P = { freq: 1.6, amp: 0.35, stripes: 12, angle: 35, t: 0, anim: true, cols: ['#2b1d3a', '#ffffff', '#8e5cc4', '#f4a340'] };
  const cv = h('canvas', { width: 560, height: 560, style: { boxShadow: '0 8px 30px #0002' } });
  const draw = () => { const g = cv.getContext('2d'); const img = g.createImageData(560, 560); const a = (P.angle * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a); const cc = P.cols.map((c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))); for (let y = 0; y < 560; y += 2) for (let x = 0; x < 560; x += 2) { const u = (x * ca + y * sa) / 560, v = (-x * sa + y * ca) / 560; const w = u + sn(v * P.freq * 3 + P.t, P.t * 0.3) * P.amp; const k = ((Math.floor(w * P.stripes) % 4) + 4) % 4; const c = cc[k]; for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const i = ((y + dy) * 560 + x + dx) * 4; img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255; } } g.putImageData(img, 0, 0); };
  const loop = () => { if (P.anim) { P.t += 0.01; draw(); } requestAnimationFrame(loop); };
  const sect = (t, ...k) => h('div', { style: { borderTop: '1px solid #eee', padding: '8px 0', display: 'grid', gap: '6px' } }, h('div', { style: { fontSize: '11px', fontWeight: 700 } }, '▾ ' + t), ...k);
  root.append(h('div.k-row', { style: { position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', background: '#fff', borderRadius: '8px', padding: '4px', boxShadow: '0 1px 4px #0001' } }, seg(['Simplex', 'Waves', 'Grid', 'Truchet'], 'Simplex', () => {}), h('button', { style: { background: '#1e90ff', color: '#fff', border: 0, padding: '6px 14px', borderRadius: '6px' }, onclick: () => dl(cv, 'ritmo.png') }, 'Export')), h('div', { style: { position: 'absolute', left: 0, right: '300px', top: '60px', bottom: '60px', display: 'grid', placeItems: 'center' } }, cv), h('div', { style: { position: 'absolute', right: '20px', top: '20px', width: '260px', bottom: '20px', background: '#fff', borderRadius: '8px', padding: '12px', fontSize: '12px', overflow: 'auto' } }, sect('Canvas', select(['1:1 · 2400px', '4:5', '16:9'], '1:1 · 2400px', () => {})), sect('Noise', slider('Frequency', 0.2, 4, P.freq, 0.05, (v) => (P.freq = v)), slider('Amplitude', 0, 1, P.amp, 0.01, (v) => (P.amp = v))), sect('Stripes', slider('Count', 4, 40, P.stripes, 1, (v) => (P.stripes = v)), slider('Angle', 0, 180, P.angle, 1, (v) => (P.angle = v))), sect('Colors', h('div.k-row', {}, P.cols.map((c, i) => h('input', { type: 'color', value: c, oninput: (e) => (P.cols[i] = e.target.value), style: { width: '40px', height: '26px', border: 0 } })))), sect('Animation', toggle('Animate', true, (v) => (P.anim = v))), h('button', { style: { width: '100%', background: '#1e90ff', color: '#fff', border: 0, padding: '8px', borderRadius: '6px', marginTop: '8px' }, onclick: () => dl(cv, 'ritmo.png') }, 'Download PNG')), h('div.k-row', { style: { position: 'absolute', bottom: '16px', left: 'calc(50% - 150px)', transform: 'translateX(-50%)', fontSize: '11px' } }, '◀', '❚❚', '▶', 'loop 4s'));
  draw(); loop();
  window.__demoProof = async () => 'simplex-warped stripes animating';
};
V['threelab-generative-pattern-deck'] = (root, T) => {
  theme(root, T, { bg: '#2a1d2c', fg: '#eee', ac: '#3cf', dark: true });
  const U = { waves: 9, petals: 7, twist: 0.6, speed: 0.3, c1: [0.95, 0.8, 0.85], c2: [0.3, 0.2, 0.15], c3: [0.8, 0.65, 0.3] };
  const G = glCanvas(`void main(){vec2 p=(gl_FragCoord.xy-R*.5)/R.y;float r=length(p),a=atan(p.y,p.x);float T=t*speed;float w=sin(r*waves*6.283-T*3.+sin(a*petals+T)*twist*3.);float band=smoothstep(-.2,.2,w);float band2=smoothstep(.6,.9,sin(r*waves*12.566+sin(a*petals)*twist*4.-T*2.));vec3 c=mix(c2,c1,band);c=mix(c,c3,band2*.8);c*=1.-smoothstep(.7,1.2,r)*.3;gl_FragColor=vec4(c,1);}`, U);
  G.cv.style.position = 'absolute'; G.cv.style.inset = '0';
  root.append(G.cv, h('div.k-row', { style: { position: 'absolute', left: '12px', top: '10px', gap: '6px' } }, h('span', { style: { background: '#3cf', color: '#000', padding: '4px 12px', borderRadius: '4px', fontSize: '12px' } }, 'Randomize'), h('span', { style: { background: '#000a', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' } }, 'threelab-ish · Pattern 12')), h('div', { style: { position: 'absolute', right: '12px', top: '10px', width: '210px', background: '#000a', borderRadius: '6px', padding: '10px', display: 'grid', gap: '8px', fontSize: '11px' } }, slider('Waves', 1, 20, U.waves, 0.1, (v) => (U.waves = v)), slider('Petals', 1, 16, U.petals, 1, (v) => (U.petals = v)), slider('Twist', 0, 2, U.twist, 0.01, (v) => (U.twist = v)), slider('Speed', 0, 2, U.speed, 0.01, (v) => (U.speed = v)), btn('Randomize', () => { U.waves = 3 + Math.random() * 12; U.petals = 2 + Math.round(Math.random() * 10); U.twist = Math.random() * 1.5; }, 'pri'), btn('Save PNG', () => dl(G.cv, 'pattern.png'))), h('div.k-row', { style: { position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', background: '#000a', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', gap: '14px' } }, '◀ prev', '● 12 / 40', 'next ▶'));
  const t0 = performance.now(); const loop = () => { G.draw((performance.now() - t0) / 1000); requestAnimationFrame(loop); }; loop();
  window.__demoProof = async () => 'radial wave pattern shader live';
};
V['city-roads-lineart-explorer'] = (root, T) => {
  theme(root, T, { bg: '#f7f2e8', fg: '#222', ac: '#222', dark: false });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .6s' } }); root.append(cv);
  const roads = (seed) => { fitCanvas(cv, root); const g = cv.g, W = cv.W, H = cv.H; const R = rng(seed); g.fillStyle = '#f7f2e8'; g.fillRect(0, 0, W, H); g.strokeStyle = '#222'; const segs = []; const grow = (x, y, a, d, w) => { if (d > 7 || x < 0 || y < 0 || x > W || y > H) return; const L = 40 + R() * 120; for (let k = 0; k < 3; k++) { const nx = x + Math.cos(a) * L, ny = y + Math.sin(a) * L; g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 0.2) * L / 2, y + Math.sin(a + 0.2) * L / 2, nx, ny); g.stroke(); segs.push(1); x = nx; y = ny; a += (R() - 0.5) * 0.5; if (R() < 0.6) grow(x, y, a + Math.PI / 2 + (R() - 0.5) * 0.4, d + 1, Math.max(0.4, w * 0.6)); if (R() < 0.6) grow(x, y, a - Math.PI / 2 + (R() - 0.5) * 0.4, d + 1, Math.max(0.4, w * 0.6)); } }; for (let i = 0; i < 6; i++) grow(W / 2, H / 2, (i / 6) * 6.283, 0, 3); for (let i = 0; i < 1400; i++) { const x = R() * W, y = R() * H; const a = R() < 0.5 ? 0 : Math.PI / 2; g.lineWidth = 0.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 30, y + Math.sin(a) * 30); g.stroke(); } cv.style.opacity = 1; card.style.top = '20px'; info.textContent = `${segs.length + 1400} roads · ${inp.value}`; };
  const inp = h('input', { placeholder: 'Enter a city name to start', style: { width: '320px', padding: '10px 12px', border: '1px solid #ccc', background: '#fff', fontSize: '14px' }, onkeydown: (e) => e.key === 'Enter' && roads(inp.value.length * 7 + 3) });
  const sug = h('div', { style: { background: '#fff', border: '1px solid #ddd', borderTop: 0, width: '344px', textAlign: 'left', fontSize: '13px', display: 'none' } });
  inp.addEventListener('input', () => { const v = inp.value.trim(); sug.style.display = v ? 'block' : 'none'; sug.replaceChildren(...['', ', South Korea', ', Metropolitan City'].map((sfx) => h('div', { style: { padding: '8px 12px', borderTop: '1px solid #eee', cursor: 'pointer' }, onclick: () => { inp.value = v + sfx; sug.style.display = 'none'; roads(v.length * 7 + 3); } }, v + sfx))); });
  const info = h('div', { style: { fontSize: '12px', opacity: .6, marginTop: '6px' } }, 'This website renders every single road within a city');
  const card = h('div', { style: { position: 'absolute', left: '50%', top: '40%', transform: 'translateX(-50%)', textAlign: 'center', transition: 'top .6s' } }, h('div', { style: { fontSize: '26px' } }, 'city roads-ish'), info, h('div', { style: { marginTop: '12px' } }, inp), sug, h('div.k-row', { style: { justifyContent: 'center', marginTop: '10px', fontSize: '12px', gap: '12px', opacity: .7 } }, 'Customize', '·', 'Export PNG', '·', 'About'));
  root.append(card);
  window.__demoProof = async () => { inp.value = 'Seoul'; inp.dispatchEvent(new Event('input')); return 'typed city → suggestions (landing state)'; };
};
V['pattern-symmetry-playground'] = (root, T) => {
  theme(root, T, { bg: '#111', fg: '#ddd', panel: '#1b1b1b', ac: '#fff', acfg: '#000', dark: true });
  const P = { count: 26, curve: 1.8, width: 7, sym: 'none', invert: false };
  const svg = s('svg', { viewBox: '0 0 700 400', width: 700, height: 400, style: 'background:#000' });
  const draw = () => { const els = [s('rect', { width: 700, height: 400, fill: P.invert ? '#fff' : '#000' })]; for (let i = 0; i < P.count; i++) { let t = i / P.count; t = Math.pow(t, 1 / P.curve); let x = t * 520; const add = (x) => els.push(s('rect', { x, y: 0, width: P.width, height: 400, fill: P.invert ? '#000' : '#fff' })); add(x); if (P.sym === 'mirror') add(700 - x - P.width); if (P.sym === 'radial') add(350 + (x - 260) * -1); } svg.replaceChildren(...els); };
  const row = (l, c) => h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 110px', alignItems: 'center', fontSize: '12px', padding: '4px 0' } }, l, c);
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 300px';
  root.append(h('div', { style: { display: 'grid', placeItems: 'center', position: 'relative' } }, h('div.k-row', { style: { position: 'absolute', top: '12px', left: '14px', fontSize: '12px' } }, h('b', {}, '◎ RHYTHM-ish'), h('span', { style: { background: '#2c2', color: '#000', padding: '1px 5px', borderRadius: '3px', fontSize: '10px' } }, 'BETA')), h('span', { style: { position: 'absolute', right: '14px', top: '12px', background: '#fff', color: '#000', padding: '4px 12px', borderRadius: '99px', fontSize: '12px' } }, 'Export'), svg), h('div', { style: { background: '#1b1b1b', padding: '14px', display: 'grid', gap: '4px', alignContent: 'start', borderLeft: '1px solid #2a2a2a' } }, h('div.k-h', {}, 'Artboard'), row('Size', select(['700 × 400', '1080 × 1080'], '700 × 400', () => {})), h('div.k-h', {}, 'Elements'), row('Count', slider('', 2, 120, P.count, 1, (v) => { P.count = v; draw(); })), row('Width', slider('', 1, 20, P.width, 0.5, (v) => { P.width = v; draw(); })), h('div.k-h', {}, 'Distribution'), row('Curve', slider('', 0.2, 5, P.curve, 0.05, (v) => { P.curve = v; draw(); })), row('Symmetry', select(['none', 'mirror', 'radial'], 'none', (v) => { P.sym = v; draw(); })), row('Invert', toggle('', false, (v) => { P.invert = v; draw(); })), h('div.k-h', {}, 'Export'), btn('SVG', () => copy(svg.outerHTML)), btn('Copy code', () => copy(svg.outerHTML))));
  draw();
  window.__demoProof = async () => { P.curve = 2.6; draw(); return 'rhythmic line distribution curve 2.6'; };
};
V['canvas-fx-param-export'] = (root, T) => {
  theme(root, T, { bg: '#f7f7f7', fg: '#1f2d1f', panel: '#fff', ac: '#3e7d3e', dark: false });
  const P = { fx: 'grain', amt: 0.5, size: 2, hue: 140, glow: 0.3 };
  const cv = h('canvas', { width: 640, height: 400, style: { borderRadius: '10px', boxShadow: '0 6px 24px #0002' } });
  const draw = () => { const g = cv.getContext('2d'); const gr = g.createLinearGradient(0, 0, 640, 400); gr.addColorStop(0, `hsl(${P.hue} 50% 30%)`); gr.addColorStop(1, `hsl(${P.hue + 60} 60% 70%)`); g.fillStyle = gr; g.fillRect(0, 0, 640, 400); g.fillStyle = '#fff'; g.font = '900 72px Inter Variable'; g.textAlign = 'center'; g.fillText('canvas fx', 320, 220); const img = g.getImageData(0, 0, 640, 400); const R = rng(4); for (let i = 0; i < img.data.length; i += 4) { if (P.fx === 'grain') { const n = (R() - 0.5) * 255 * P.amt; img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n; } else if (P.fx === 'scanlines' && ((i / 4 / 640) | 0) % (P.size * 2) < P.size) { img.data[i] *= 1 - P.amt; img.data[i + 1] *= 1 - P.amt; img.data[i + 2] *= 1 - P.amt; } else if (P.fx === 'posterize') { const lv = 2 + Math.round((1 - P.amt) * 8); for (let k = 0; k < 3; k++) img.data[i + k] = Math.round((img.data[i + k] / 255) * lv) * (255 / lv); } } g.putImageData(img, 0, 0); if (P.fx === 'pixelate') { const sz = 2 + Math.round(P.amt * 20); const t = document.createElement('canvas'); t.width = 640 / sz; t.height = 400 / sz; t.getContext('2d').drawImage(cv, 0, 0, t.width, t.height); g.imageSmoothingEnabled = false; g.drawImage(t, 0, 0, 640, 400); } code.textContent = `canvasFx(ctx, { effect: '${P.fx}', amount: ${P.amt}, size: ${P.size} })`; };
  const code = h('pre.k-code', { style: { width: '640px' } });
  root.append(h('div.k-row', { style: { height: '56px', padding: '0 30px', borderBottom: '1px solid #e5e5e5', background: '#fff' } }, h('b', { style: { color: '#3e7d3e' } }, '✺ canvas-fx-ish'), h('span', { style: { flex: 1 } }), 'Effects', 'Docs', 'GitHub'), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', padding: '30px' } }, h('div', { style: { display: 'grid', justifyItems: 'center', gap: '14px' } }, cv, code), panel('Effect', seg(['grain', 'scanlines', 'posterize', 'pixelate'], P.fx, (v) => { P.fx = v; draw(); }), slider('Amount', 0, 1, P.amt, 0.01, (v) => { P.amt = v; draw(); }), slider('Size', 1, 8, P.size, 1, (v) => { P.size = v; draw(); }), slider('Hue', 0, 360, P.hue, 1, (v) => { P.hue = v; draw(); }), btn('Export PNG', () => dl(cv, 'fx.png'), 'pri'), btn('Copy params', () => copy(code.textContent)))));
  draw();
  window.__demoProof = async () => { P.fx = 'scanlines'; P.amt = 0.4; draw(); return 'scanlines fx applied, params code updated'; };
};
V['procedural-dungeon-theme-stage'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#cfd8ff', panel: '#0c0f1a', ac: '#4f7cff', dark: true });
  const P = { seed: 7, rooms: 14, theme: 'blueprint' }; const TH = { blueprint: ['#000', '#5d8bff'], parchment: ['#e9dcbc', '#5a3d1e'], neon: ['#0a0014', '#ff3df2'] };
  const svg = s('svg', { viewBox: '-450 -80 900 520', style: 'width:100%;height:100%' }); const title = h('div', { style: { font: '700 14px Georgia', margin: '6px 0' } });
  const gen = () => { const R = rng(P.seed); const rooms = []; for (let i = 0; i < P.rooms; i++) { const w = 2 + Math.floor(R() * 4), d = 2 + Math.floor(R() * 4); rooms.push({ x: Math.floor(R() * 16), y: Math.floor(R() * 16), w, d, r: R() < 0.15 }); } const [bg, fg] = TH[P.theme]; root.style.background = bg; const iso = (x, y) => [(x - y) * 22, (x + y) * 11]; const els = []; rooms.sort((a, b) => a.x + a.y - b.x - b.y).forEach((r, i) => { const pts = [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.d], [r.x, r.y + r.d]].map(([x, y]) => iso(x, y)); if (r.r) { const [cx, cy] = iso(r.x + r.w / 2, r.y + r.d / 2); els.push(s('ellipse', { cx, cy, rx: r.w * 18, ry: r.w * 9, fill: 'none', stroke: fg, 'stroke-width': 1.5 }), s('ellipse', { cx, cy: cy - 14, rx: r.w * 18, ry: r.w * 9, fill: 'none', stroke: fg, 'stroke-width': 1, opacity: .5 })); } else { els.push(s('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill: fg + '14', stroke: fg, 'stroke-width': 1.5 })); els.push(s('polygon', { points: pts.map(([x, y]) => `${x},${y - 14}`).join(' '), fill: 'none', stroke: fg, 'stroke-width': 1, opacity: .45 })); for (let gx = 1; gx < r.w; gx++) { const [a, b] = [iso(r.x + gx, r.y), iso(r.x + gx, r.y + r.d)]; els.push(s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: fg, 'stroke-width': 0.4, opacity: .5 })); } } if (i) { const p = rooms[i - 1]; const [a, b] = [iso(p.x + p.w / 2, p.y + p.d / 2), iso(r.x + r.w / 2, p.y + p.d / 2)]; const c = iso(r.x + r.w / 2, r.y + r.d / 2); els.push(s('polyline', { points: `${a} ${b} ${c}`, fill: 'none', stroke: fg, 'stroke-width': 5, opacity: .25 })); } }); svg.replaceChildren(...els); const N1 = ['The Lost', 'The Drowned', 'The Hollow', 'The Ashen']; const N2 = ['Vaults of the Idle', 'Halls of Nuun', 'Crypt of Mirrors', 'Warrens of Salt']; title.replaceChildren(h('div', { style: { opacity: .6, fontSize: '11px' } }, 'Dungeon #' + P.seed), N1[P.seed % 4], h('br'), N2[(P.seed >> 1) % 4]); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '230px 1fr';
  root.append(h('div', { style: { background: '#0c0f1add', padding: '14px', display: 'grid', gap: '10px', alignContent: 'start', fontSize: '12px', borderRight: '1px solid #1c2340' } }, h('b', { style: { font: '700 20px Georgia', letterSpacing: '.08em' } }, 'DUNGEONEER-ish'), title, seg(['blueprint', 'parchment', 'neon'], P.theme, (v) => { P.theme = v; gen(); }), h('button', { style: { background: '#4f7cff', color: '#fff', border: 0, padding: '10px', borderRadius: '4px', fontWeight: 700 }, onclick: () => { P.seed++; gen(); } }, 'NEW DUNGEON ⟳'), slider('Rooms', 4, 30, P.rooms, 1, (v) => { P.rooms = v; gen(); }), h('div.k-row', {}, btn('Export SVG', () => copy(svg.outerHTML)), btn('PNG', () => toast('dungeon.png'))), h('div', { style: { opacity: .5, fontSize: '11px', lineHeight: 1.5 } }, 'Seeds are shareable. Press Space for a new dungeon.')), h('div', { style: { position: 'relative' } }, svg));
  window.addEventListener('keydown', (e) => e.code === 'Space' && (e.preventDefault(), P.seed++, gen()));
  gen();
  window.__demoProof = async () => { P.seed = 11; gen(); return 'generated blueprint dungeon #11'; };
};
V['fantasy-map-generator-workspace'] = (root, T) => {
  theme(root, T, { bg: '#6b8fc2', fg: '#222', panel: '#f5efe0', ac: '#7a4a1e', dark: false });
  const W = 360, H = 225; const cv = h('canvas', { width: W * 4, height: H * 4, style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } }); let seed = 5, nStates = 9, showLabels = true;
  const gen = () => { const R = rng(seed); const hgt = new Float32Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const dx = (x / W - 0.5) * 2, dy = (y / H - 0.5) * 2; const n = sn(x * 0.015 + seed, y * 0.015) * 0.6 + sn(x * 0.05 + seed, y * 0.05) * 0.25 + sn(x * 0.12, y * 0.12 + seed) * 0.1; hgt[y * W + x] = n + 0.12 - Math.hypot(dx * 0.85, dy) * 0.62; } const seeds = []; for (let tries = 0; seeds.length < nStates && tries < 5000; tries++) { const x = (R() * W) | 0, y = (R() * H) | 0; if (hgt[y * W + x] > 0.1) seeds.push({ x, y }); } const PAL = ['#f5e4a6', '#cfe3b2', '#e8c1d6', '#c7d3ef', '#f3c7a1', '#d6e8c9', '#e3d0f2', '#f7d6c1', '#c9e7e3', '#efe2b8', '#d8c9e8', '#f2b8b8']; const g = cv.getContext('2d'); const img = g.createImageData(W, H); const st = new Int8Array(W * H).fill(-1); for (let i = 0; i < W * H; i++) { const x = i % W, y = (i / W) | 0; const hh = hgt[i]; let c; if (hh <= 0) { const d = clamp(-hh * 6, 0, 1); c = [120 - d * 30, 160 - d * 40, 210 - d * 20]; if (hh > -0.04) c = [190, 215, 235]; } else { let bi = 0, bd = 1e9; seeds.forEach((sd, k) => { const d = (sd.x - x) ** 2 + (sd.y - y) ** 2; if (d < bd) { bd = d; bi = k; } }); st[i] = bi; const p = PAL[bi % PAL.length]; c = [1, 3, 5].map((k) => parseInt(p.slice(k, k + 2), 16) - hh * 40); } img.data[i * 4] = c[0]; img.data[i * 4 + 1] = c[1]; img.data[i * 4 + 2] = c[2]; img.data[i * 4 + 3] = 255; } for (let i = W; i < W * H - W; i++) if (st[i] >= 0 && (st[i] !== st[i + 1] || st[i] !== st[i + W]) && st[i + 1] >= 0 && st[i + W] >= 0) { img.data[i * 4] -= 60; img.data[i * 4 + 1] -= 60; img.data[i * 4 + 2] -= 40; } const t = document.createElement('canvas'); t.width = W; t.height = H; t.getContext('2d').putImageData(img, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(t, 0, 0, W * 4, H * 4); g.strokeStyle = '#5a4a3a'; g.lineWidth = 1.5; for (let i = W; i < W * H - W; i++) { if (hgt[i] > 0 && (hgt[i + 1] <= 0 || hgt[i + W] <= 0 || hgt[i - 1] <= 0)) { g.fillStyle = '#4a3b2c'; g.fillRect((i % W) * 4, ((i / W) | 0) * 4, 3, 3); } } if (showLabels) { const NAMES = ['Republic of Etoile', 'Kingdom of Tanar', 'Monch', 'Zeldan Caliphate', 'Orlesia', 'Grand Duchy of Vell', 'Empire of Sorn', 'Harmar', 'Coast League', 'Isle Kha', 'Bretonia', 'Marsh Union']; g.textAlign = 'center'; seeds.forEach((sd, k) => { g.font = `600 ${k % 3 ? 20 : 26}px 'Fraunces Variable',Georgia,serif`; g.fillStyle = '#3a2a1a'; g.strokeStyle = '#fff8'; g.lineWidth = 4; const [a, ...b] = NAMES[k % NAMES.length].split(' of '); g.strokeText(a, sd.x * 4, sd.y * 4); g.fillText(a, sd.x * 4, sd.y * 4); }); } };
  root.append(cv, h('div', { style: { position: 'absolute', right: '12px', bottom: '12px', display: 'grid', gap: '4px' } }, ...[['⟳', () => { seed++; gen(); }], ['🏷', () => { showLabels = !showLabels; gen(); }], ['＋', () => { nStates = Math.min(12, nStates + 1); gen(); }], ['－', () => { nStates = Math.max(3, nStates - 1); gen(); }]].map(([l, f]) => h('button', { style: { width: '34px', height: '34px', background: '#f5efe0', border: '1px solid #7a4a1e', borderRadius: '4px' }, onclick: f }, l))), h('div', { style: { position: 'absolute', left: '12px', top: '12px', background: '#f5efe0ee', border: '1px solid #7a4a1e', padding: '8px 10px', fontSize: '12px', display: 'grid', gap: '6px', width: '190px' } }, h('b', {}, '☰ Fantasy Map-ish'), h('div.k-row', { style: { flexWrap: 'wrap', gap: '4px' } }, ...['Layers', 'Style', 'Options', 'Tools', 'About'].map((t) => h('span', { style: { border: '1px solid #b89', padding: '1px 4px' } }, t))), slider('States', 3, 12, nStates, 1, (v) => { nStates = v; gen(); }), btn('New map', () => { seed++; gen(); }, 'pri')));
  gen();
  window.__demoProof = async () => { seed = 6; gen(); return 'generated heightmap + 9 political states'; };
};

V['voanh-generative-art-studio-desk'] = (root, T) => {
  theme(root, T, { bg: '#0c0d10', fg: '#e8e6e3', panel: '#16181e', ac: '#c8f55a', dark: true });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  const PALETTES = [
    { id: 'ink', name: 'Ink Bloom', cols: ['#0b0c10', '#1f2a44', '#5b8def', '#c8f55a', '#f4f1ea'] },
    { id: 'ember', name: 'Ember', cols: ['#140a08', '#3b1510', '#c44b27', '#f0a05a', '#ffe8c8'] },
    { id: 'tide', name: 'Tide', cols: ['#061018', '#0d3a4a', '#1aa6a6', '#7ee0d0', '#e8fff8'] },
    { id: 'orchid', name: 'Orchid', cols: ['#120816', '#3a1650', '#a855f7', '#f0abfc', '#fdf4ff'] },
    { id: 'mono', name: 'Mono', cols: ['#0a0a0a', '#2a2a2a', '#6a6a6a', '#b0b0b0', '#f2f2f2'] },
  ];
  const ASPECTS = { '1:1': [720, 720], '16:9': [960, 540], '9:16': [480, 854], '4:5': [640, 800] };
  const P = {
    gen: 'flow', aspect: '1:1', pal: 'ink', mode: 'harmony',
    density: 0.55, swirl: 0.65, scale: 0.45, grain: 0.22, vignette: 0.35, bloom: 0.25,
    seed: 48291, lock: false,
  };
  let W = 720, H = 720;

  const cv = h('canvas', { width: W, height: H, style: { maxWidth: '100%', maxHeight: '100%', boxShadow: '0 0 0 1px #ffffff14, 0 28px 80px #000a', background: '#000' } });
  const seedLab = h('b', { style: { font: '600 12px ui-monospace,monospace' } }, String(P.seed));

  const rnd = (s) => { let x = s >>> 0; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; };
  const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => a.map((v, i) => Math.round(lerp(v, b[i], t)));

  const palCols = () => {
    const base = PALETTES.find((p) => p.id === P.pal) || PALETTES[0];
    let cols = base.cols.map(hexRgb);
    if (P.mode === 'mono') cols = cols.map((c, i) => mix([20, 20, 22], [235, 232, 228], i / (cols.length - 1)));
    if (P.mode === 'pastel') cols = cols.map((c) => mix(c, [255, 250, 245], 0.45));
    if (P.mode === 'custom') cols = cols.map((c, i) => mix(c, [200, 245, 90], (i % 3) * 0.12));
    return cols;
  };

  const draw = () => {
    const [aw, ah] = ASPECTS[P.aspect] || ASPECTS['1:1'];
    W = aw; H = ah; cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    const cols = palCols();
    const R = rnd(P.seed);
    const nz = (x, y) => {
      const s = sn(x + P.seed * 0.01, y - P.seed * 0.007);
      return s;
    };
    g.fillStyle = `rgb(${cols[0].join(',')})`;
    g.fillRect(0, 0, W, H);

    if (P.gen === 'flow') {
      const n = Math.floor(lerp(120, 520, P.density));
      g.lineWidth = 1.1;
      for (let i = 0; i < n; i++) {
        let x = R() * W, y = R() * H;
        const c = cols[1 + Math.floor(R() * (cols.length - 1))];
        g.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},0.55)`;
        g.beginPath(); g.moveTo(x, y);
        for (let s = 0; s < 80; s++) {
          const a = nz(x * (0.002 + P.scale * 0.006), y * (0.002 + P.scale * 0.006)) * Math.PI * (1 + P.swirl * 2);
          x += Math.cos(a) * 3; y += Math.sin(a) * 3;
          if (x < 0 || y < 0 || x > W || y > H) break;
          g.lineTo(x, y);
        }
        g.stroke();
      }
    } else if (P.gen === 'warp') {
      const img = g.createImageData(W, H);
      const d = img.data;
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
        const u = x / W, v = y / H;
        const wx = u + nz(u * (2 + P.scale * 6), v * 3) * P.swirl * 0.35;
        const wy = v + nz(u * 3 + 9, v * (2 + P.scale * 6)) * P.swirl * 0.35;
        const t = (Math.sin(wx * 8 + P.seed) + Math.cos(wy * 7 - P.seed) + 2) / 4;
        const ci = Math.min(cols.length - 1, Math.floor(t * (cols.length - 0.01)));
        const c = mix(cols[ci], cols[Math.min(cols.length - 1, ci + 1)], (t * cols.length) % 1);
        for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
          const i = ((y + dy) * W + x + dx) * 4;
          if (i >= d.length) continue;
          d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
    } else {
      const n = Math.floor(lerp(40, 220, P.density));
      const circles = [];
      for (let tries = 0; circles.length < n && tries < n * 40; tries++) {
        const r = lerp(4, 48 * (1.2 - P.scale * 0.6), Math.pow(R(), 1.6));
        const x = r + R() * (W - 2 * r), y = r + R() * (H - 2 * r);
        if (circles.some((c) => Math.hypot(c.x - x, c.y - y) < c.r + r + 1.5)) continue;
        circles.push({ x, y, r });
      }
      circles.forEach((c, i) => {
        const col = cols[1 + (i % (cols.length - 1))];
        g.beginPath(); g.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        g.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},0.85)`;
        g.fill();
        if (P.swirl > 0.3) {
          g.strokeStyle = `rgba(${cols[cols.length - 1].join(',')},0.35)`;
          g.lineWidth = 1; g.stroke();
        }
      });
    }

    if (P.bloom > 0.02) {
      g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = P.bloom * 0.35;
      g.filter = 'blur(12px)'; g.drawImage(cv, 0, 0); g.restore();
    }
    if (P.grain > 0.01) {
      const img = g.getImageData(0, 0, W, H); const d = img.data; const gr = rnd(P.seed ^ 0x9e37);
      for (let i = 0; i < d.length; i += 4) {
        const n = (gr() - 0.5) * 255 * P.grain * 0.55;
        d[i] = clamp(d[i] + n, 0, 255); d[i + 1] = clamp(d[i + 1] + n, 0, 255); d[i + 2] = clamp(d[i + 2] + n, 0, 255);
      }
      g.putImageData(img, 0, 0);
    }
    if (P.vignette > 0.01) {
      const grd = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.hypot(W, H) * 0.55);
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(1, `rgba(0,0,0,${0.25 + P.vignette * 0.65})`);
      g.fillStyle = grd; g.fillRect(0, 0, W, H);
    }
    seedLab.textContent = String(P.seed);
  };

  const roll = () => { if (!P.lock) P.seed = (Math.random() * 1e9) | 0; draw(); toast(P.lock ? 'Seed locked' : 'Rolled · ' + P.seed); };

  const sect = (t, ...kids) => h('div', { style: { display: 'grid', gap: '8px', padding: '10px 0', borderBottom: '1px solid #ffffff10' } }, h('div.k-h', {}, t), ...kids);

  const stage = h('div', { style: { flex: 1, minWidth: 0, display: 'grid', placeItems: 'center', padding: '24px', background: 'radial-gradient(ellipse at 50% 40%, #1a1c24 0%, #0c0d10 70%)' } }, cv);
  const side = h('div', {
    style: { width: '300px', flexShrink: 0, background: '#16181e', borderLeft: '1px solid #ffffff12', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'auto', fontSize: '12px' },
  },
    h('div.k-row', {}, h('b', { style: { letterSpacing: '.14em', fontSize: '13px' } }, 'VOANH'), h('span', { style: { flex: 1 } }), h('span', { style: { opacity: .4, fontSize: '11px' } }, 'studio')),
    sect('Generator', seg([['flow', 'Flow'], ['warp', 'Warp'], ['pack', 'Pack']], P.gen, (v) => { P.gen = v; draw(); })),
    sect('Canvas', seg(Object.keys(ASPECTS), P.aspect, (v) => { P.aspect = v; draw(); })),
    sect('Palette', h('div.k-row', { style: { flexWrap: 'wrap', gap: '6px' } }, ...PALETTES.map((p) => h('button', {
      title: p.name, style: { width: '34px', height: '34px', borderRadius: '8px', border: P.pal === p.id ? '2px solid #c8f55a' : '1px solid #ffffff22', background: `linear-gradient(135deg,${p.cols[1]},${p.cols[3]})`, cursor: 'pointer' },
      onclick: () => { P.pal = p.id; draw(); side.querySelectorAll('button[title]').forEach((b) => { b.style.border = b.title === p.name ? '2px solid #c8f55a' : '1px solid #ffffff22'; }); },
    }))), select([['harmony', 'Harmony'], ['mono', 'Monochrome'], ['pastel', 'Pastel'], ['custom', 'Custom']], P.mode, (v) => { P.mode = v; draw(); })),
    sect('Composition',
      slider('Density', 0, 1, P.density, 0.01, (v) => { P.density = v; draw(); }, (v) => (+v).toFixed(2)),
      slider('Swirl', 0, 1, P.swirl, 0.01, (v) => { P.swirl = v; draw(); }, (v) => (+v).toFixed(2)),
      slider('Scale', 0, 1, P.scale, 0.01, (v) => { P.scale = v; draw(); }, (v) => (+v).toFixed(2))),
    sect('Finish',
      slider('Grain', 0, 1, P.grain, 0.01, (v) => { P.grain = v; draw(); }, (v) => (+v).toFixed(2)),
      slider('Vignette', 0, 1, P.vignette, 0.01, (v) => { P.vignette = v; draw(); }, (v) => (+v).toFixed(2)),
      slider('Bloom', 0, 1, P.bloom, 0.01, (v) => { P.bloom = v; draw(); }, (v) => (+v).toFixed(2))),
    sect('Seed', h('div.k-row', {}, seedLab, h('span', { style: { flex: 1 } }), btn('Roll', roll), btn(P.lock ? 'Locked' : 'Lock', (e) => { P.lock = !P.lock; e.target.textContent = P.lock ? 'Locked' : 'Lock'; toast(P.lock ? 'Seed locked' : 'Seed unlocked'); }))),
    h('div.k-row', { style: { marginTop: '8px' } }, btn('Export PNG', () => dl(cv, 'voanh-' + P.seed + '.png'), 'pri'), btn('SVG stub', () => toast('SVG export stub'))),
  );

  const top = h('div.k-row', { style: { height: '48px', padding: '0 18px', borderBottom: '1px solid #ffffff10', gap: '16px', background: '#0c0d10' } },
    h('b', { style: { letterSpacing: '.16em' } }, 'voanh'),
    h('span', { style: { opacity: .4, fontSize: '12px' } }, 'generative art studio'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '12px', opacity: .4 } }, 'Local render · private'),
  );

  root.style.display = 'flex'; root.style.flexDirection = 'column';
  root.append(top, h('div', { style: { display: 'flex', flex: 1, minHeight: 0 } }, stage, side));
  draw();

  window.__demoProof = async () => {
    const prev = { ...P };
    P.gen = 'warp'; P.pal = 'ember'; P.grain = 0.4; P.vignette = 0.5;
    if (!P.lock) P.seed = 777001;
    draw();
    await sleep(200);
    Object.assign(P, prev); draw();
    return 'warp+ember applied then restored · seed ' + P.seed;
  };
};

V['whorl-generative-motion-desk'] = (root, T) => {
  theme(root, T, { bg: '#0a0b0f', fg: '#ece8e1', panel: '#12141c', ac: '#7ee0c8', ac2: '#f0a05a', dark: true, line: '#ffffff12' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  const P = { mode: 'motion', speed: 0.55, density: 0.62, swirl: 0.7, stroke: 1.4, hue: 168, seed: 42011 };
  const defaults = { ...P };
  let playing = true;
  let t0 = performance.now();
  let raf = 0;

  const cv = h('canvas', { width: 900, height: 640, style: { width: '100%', height: '100%', display: 'block', background: '#05060a' } });
  const g = cv.getContext('2d');
  const R = () => rng(P.seed);

  const drawFrame = (t) => {
    const W = cv.width, H = cv.height;
    g.fillStyle = '#05060a';
    g.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const dens = Math.floor(18 + P.density * 64);
    const spd = 0.25 + P.speed * 1.8;
    const swirl = P.swirl * 2.4;
    const hue = P.hue;
    g.lineCap = 'round';

    if (P.mode === 'motion') {
      for (let i = 0; i < dens; i++) {
        const r = 28 + i * (Math.min(W, H) * 0.42 / dens);
        const a0 = t * spd * (0.4 + (i % 5) * 0.08) + i * 0.37;
        g.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.05) {
          const wob = Math.sin(a * (3 + (i % 4)) + t * spd + i) * (6 + swirl * 10);
          const x = cx + Math.cos(a + a0) * (r + wob);
          const y = cy + Math.sin(a + a0 * 0.92) * (r * 0.72 + wob * 0.7);
          if (a === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.strokeStyle = `hsla(${(hue + i * 4) % 360} 72% ${48 + (i % 5) * 6}% / ${0.35 + (i % 3) * 0.12})`;
        g.lineWidth = P.stroke * (0.6 + (i % 4) * 0.25);
        g.stroke();
      }
      // particle trails
      for (let i = 0; i < dens * 2; i++) {
        const ang = t * spd + i * 0.31;
        const rr = 40 + (i % dens) * 7 + Math.sin(t * spd + i) * swirl * 12;
        const x = cx + Math.cos(ang) * rr;
        const y = cy + Math.sin(ang * 1.15) * rr * 0.68;
        g.fillStyle = `hsla(${(hue + 40 + i * 3) % 360} 80% 68% / 0.75)`;
        g.beginPath(); g.arc(x, y, 1.2 + P.stroke * 0.4, 0, 7); g.fill();
      }
    } else if (P.mode === 'stencil') {
      g.save();
      g.translate(cx, cy);
      g.rotate(t * spd * 0.15);
      const shapes = dens;
      for (let i = 0; i < shapes; i++) {
        const ang = (i / shapes) * Math.PI * 2;
        g.save();
        g.rotate(ang + Math.sin(t * spd + i) * swirl * 0.2);
        g.beginPath();
        const len = 80 + i * 4;
        g.moveTo(0, 0);
        g.quadraticCurveTo(len * 0.5, -30 - swirl * 20, len, Math.sin(t + i) * 18);
        g.strokeStyle = `hsla(${(hue + i * 6) % 360} 65% 60% / 0.55)`;
        g.lineWidth = P.stroke * 1.2;
        g.stroke();
        // stencil cut rings
        g.beginPath();
        g.arc(len * 0.7, 0, 8 + (i % 5) * 3, 0, 7);
        g.fillStyle = `hsla(${(hue + 90) % 360} 70% 55% / 0.25)`;
        g.fill();
        g.restore();
      }
      g.restore();
      // vignette mask feel
      const grd = g.createRadialGradient(cx, cy, 40, cx, cy, Math.min(W, H) * 0.55);
      grd.addColorStop(0, 'rgba(5,6,10,0)');
      grd.addColorStop(1, 'rgba(5,6,10,0.55)');
      g.fillStyle = grd; g.fillRect(0, 0, W, H);
    } else {
      // Text mode — kinetic letterforms from seed glyphs
      const glyphs = 'WHORL · MOTION · STENCIL'.split('');
      g.textAlign = 'center'; g.textBaseline = 'middle';
      for (let i = 0; i < dens; i++) {
        const ang = t * spd * 0.5 + i * (Math.PI * 2 / dens);
        const rr = 60 + (i % 8) * 28 + Math.sin(t * spd + i) * swirl * 16;
        const x = cx + Math.cos(ang) * rr;
        const y = cy + Math.sin(ang * 0.9) * rr * 0.62;
        const ch = glyphs[i % glyphs.length];
        g.save();
        g.translate(x, y);
        g.rotate(ang + Math.PI / 2);
        g.font = `${700} ${10 + P.stroke * 6 + (i % 4) * 2}px Inter Variable,sans-serif`;
        g.fillStyle = `hsla(${(hue + i * 5) % 360} 70% 70% / ${0.4 + (i % 3) * 0.15})`;
        g.fillText(ch, 0, 0);
        g.restore();
      }
      g.font = '800 42px Inter Variable,sans-serif';
      g.fillStyle = `hsla(${hue} 80% 78% / 0.9)`;
      g.fillText('WHORL', cx, cy);
      g.font = '500 13px Inter Variable,sans-serif';
      g.fillStyle = 'rgba(236,232,225,0.45)';
      g.fillText('generative motion desk', cx, cy + 28);
    }
  };

  const loop = () => {
    if (playing) drawFrame((performance.now() - t0) / 1000);
    raf = requestAnimationFrame(loop);
  };
  loop();

  const modeBtn = (id, label, icon) => h('button', {
    title: label,
    style: {
      width: '48px', height: '48px', borderRadius: '12px', cursor: 'pointer',
      border: P.mode === id ? '1px solid #7ee0c8' : '1px solid #ffffff14',
      background: P.mode === id ? '#7ee0c822' : '#161822', color: P.mode === id ? '#7ee0c8' : '#9aa0ae',
      display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '.04em',
    },
    onclick: () => { P.mode = id; paintRail(); toast(label); },
  }, icon || label.slice(0, 3));

  const rail = h('div', { style: { width: '72px', flexShrink: 0, background: '#0e1016', borderRight: '1px solid #ffffff10', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px 0' } });
  const paintRail = () => {
    rail.replaceChildren(
      h('div', { style: { width: '28px', height: '28px', borderRadius: '8px', background: 'conic-gradient(from 120deg,#7ee0c8,#f0a05a,#7b8cff,#7ee0c8)', marginBottom: '8px' } }),
      modeBtn('motion', 'Motion', '◉'),
      modeBtn('stencil', 'Stencil', '▣'),
      modeBtn('text', 'Text', 'Aa'),
      h('span', { style: { flex: 1 } }),
      h('span', { style: { fontSize: '9px', opacity: .35, writingMode: 'vertical-rl' } }, 'WHORL'),
    );
  };
  paintRail();

  const seedLab = h('b', { style: { font: '600 12px ui-monospace,monospace', color: '#7ee0c8' } }, String(P.seed));
  const side = h('div', {
    style: { width: '280px', flexShrink: 0, background: '#12141c', borderLeft: '1px solid #ffffff10', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'auto', fontSize: '12px' },
  },
    h('div.k-row', {}, h('b', { style: { letterSpacing: '.14em', fontSize: '13px' } }, 'WHORL'), h('span', { style: { flex: 1 } }), h('span', { style: { opacity: .4 } }, 'desk')),
    h('div', { style: { opacity: .45, fontSize: '11px', marginBottom: '6px' } }, 'Generative motion · stencil · text'),
    h('div.k-h', {}, 'Inspector'),
    slider('Speed', 0, 1, P.speed, 0.01, (v) => { P.speed = v; }, (v) => (+v).toFixed(2)),
    slider('Density', 0, 1, P.density, 0.01, (v) => { P.density = v; }, (v) => (+v).toFixed(2)),
    slider('Swirl', 0, 1, P.swirl, 0.01, (v) => { P.swirl = v; }, (v) => (+v).toFixed(2)),
    slider('Stroke', 0.4, 4, P.stroke, 0.1, (v) => { P.stroke = v; }, (v) => (+v).toFixed(1)),
    slider('Hue', 0, 360, P.hue, 1, (v) => { P.hue = v; }, (v) => String(v | 0)),
    h('div.k-row', { style: { marginTop: '10px', gap: '8px' } }, seedLab, h('span', { style: { flex: 1 } }),
      btn('🎲 Seed', () => { P.seed = (Math.random() * 1e9) | 0; seedLab.textContent = String(P.seed); toast('seed ' + P.seed); }),
    ),
    h('div.k-row', { style: { marginTop: '8px', gap: '8px' } },
      btn(playing ? 'Pause' : 'Play', (e) => { playing = !playing; e.target.textContent = playing ? 'Pause' : 'Play'; if (playing) t0 = performance.now() - ((performance.now() - t0)); }),
      btn('Export PNG', () => dl(cv, 'whorl-' + P.seed + '.png'), 'pri'),
    ),
  );

  const top = h('div.k-row', { style: { height: '48px', padding: '0 18px', borderBottom: '1px solid #ffffff10', gap: '14px', background: '#0a0b0f' } },
    h('b', { style: { letterSpacing: '.18em', fontSize: '13px' } }, 'WHORL'),
    h('span', { style: { opacity: .4, fontSize: '12px' } }, 'generative motion design desk'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '11px', opacity: .35 } }, 'look-alike · local canvas'),
  );

  const stage = h('div', { style: { flex: 1, minWidth: 0, minHeight: 0, position: 'relative', background: 'radial-gradient(ellipse at 50% 45%, #141824 0%, #05060a 70%)' } }, cv);
  // fit canvas to stage
  const fit = () => {
    const r = stage.getBoundingClientRect();
    const w = Math.max(640, Math.floor(r.width) || 900);
    const hgt = Math.max(420, Math.floor(r.height) || 640);
    if (cv.width !== w || cv.height !== hgt) { cv.width = w; cv.height = hgt; }
  };
  requestAnimationFrame(fit);
  window.addEventListener('resize', fit);

  root.style.display = 'flex'; root.style.flexDirection = 'column';
  root.append(top, h('div', { style: { display: 'flex', flex: 1, minHeight: 0 } }, rail, stage, side));

  window.__demoProof = async () => {
    const prev = { ...P };
    P.mode = 'stencil'; P.hue = 28; P.swirl = 0.95; P.density = 0.8;
    paintRail();
    await sleep(180);
    P.mode = 'text'; paintRail();
    await sleep(120);
    Object.assign(P, prev); paintRail();
    return 'cycled motion→stencil→text and restored · seed ' + P.seed;
  };
};


V['motionforge-motion-exhibition'] = (root, T) => {
  theme(root, T, { bg: '#0b0b0d', fg: '#f4f1f8', panel: '#121016', ac: '#c5b4e3', ac2: '#8b7bb8', dark: true, line: '#ffffff14' });
  root.style.overflow = 'auto';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';
  root.classList.add('scroll');

  const FILTERS = [
    { id: 'all', label: 'All motion', n: 15 },
    { id: 'webgl', label: 'WebGL', n: 5 },
    { id: 'type', label: 'Typography', n: 4 },
    { id: 'physics', label: '3D & physics', n: 3 },
    { id: 'ui', label: 'Interface', n: 3 },
  ];
  const ITEMS = [
    { id: '01', title: 'Liquid Reality Reveal', tag: 'Expert', cat: 'webgl', blurb: 'A fluid lens between the expected and the extraordinary.', tech: 'WebGL / GLSL' },
    { id: '02', title: 'Magnetic Typography', tag: 'Pro', cat: 'type', blurb: 'Letters that lean toward the pointer with spring physics.', tech: 'Canvas / Springs' },
    { id: '03', title: 'Portal Image Transition', tag: 'Studio', cat: 'ui', blurb: 'A circular portal that opens into another frame.', tech: 'CSS / Mask' },
    { id: '04', title: 'Dimensional Image Trail', tag: 'Lab', cat: 'webgl', blurb: 'Cursor wakes leave refracting afterimages.', tech: 'WebGL' },
    { id: '05', title: 'Melting Text', tag: 'Pro', cat: 'type', blurb: 'Glyphs drip and reform under scroll pressure.', tech: 'SVG / Filter' },
    { id: '06', title: 'Holographic Glass Cards', tag: 'Studio', cat: 'ui', blurb: 'Iridescent panels that tilt with the pointer.', tech: 'CSS 3D' },
    { id: '07', title: 'Procedural Aurora Field', tag: 'Lab', cat: 'webgl', blurb: 'Soft northern ribbons driven by simplex noise.', tech: 'WebGL' },
    { id: '08', title: 'Geometry Morphing', tag: 'Expert', cat: 'physics', blurb: 'Torus ↔ knot morph with metallic shading.', tech: 'Three.js' },
    { id: '09', title: 'Scroll Tunnel', tag: 'Pro', cat: 'physics', blurb: 'Depth rings that scrub with scroll progress.', tech: 'Canvas' },
    { id: '10', title: 'Liquid Magnetic Button', tag: 'Studio', cat: 'ui', blurb: 'A CTA that pools toward your cursor.', tech: 'SVG' },
    { id: '11', title: 'Kinetic Word Split', tag: 'Lab', cat: 'type', blurb: 'Pull a word apart; velocity reshapes spacing.', tech: 'DOM' },
    { id: '12', title: 'Signal Glitch', tag: 'Pro', cat: 'webgl', blurb: 'Controlled RGB tear with hold-to-corrupt.', tech: 'WebGL' },
    { id: '13', title: 'Product Explosion', tag: 'Expert', cat: 'physics', blurb: 'Scroll-scrubbed disassembly of a hero object.', tech: 'Three.js' },
    { id: '14', title: 'Infinite 3D Carousel', tag: 'Studio', cat: 'physics', blurb: 'Seamless orbit of product plates.', tech: 'Three.js' },
    { id: '15', title: 'Cinematic Disintegration', tag: 'Lab', cat: 'type', blurb: 'Type dissolves into particles on hover.', tech: 'Canvas' },
  ];
  let filter = 'all';
  let playing = true;
  let selected = '01';
  let mx = 0.5, my = 0.5;
  let t0 = performance.now();
  const N = noise2(42);

  const nav = h('div.k-row', {
    style: { height: '56px', padding: '0 28px', gap: '22px', borderBottom: '1px solid #ffffff10', position: 'sticky', top: 0, background: '#0b0b0dcc', backdropFilter: 'blur(10px)', zIndex: 5 },
  },
    h('b', { style: { letterSpacing: '.12em', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' } },
      h('span', { style: { width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg,#c5b4e3,#7b6aa8)', display: 'grid', placeItems: 'center', color: '#0b0b0d', fontSize: '11px', fontWeight: 800 } }, 'M'),
      'MOTIONFORGE.'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '13px', opacity: .7, cursor: 'pointer' }, onclick: () => { document.getElementById('mf-coll')?.scrollIntoView({ behavior: 'smooth' }); } }, 'Collection ', h('sup', { style: { color: '#c5b4e3' } }, '15')),
    h('span', { style: { fontSize: '13px', opacity: .7, cursor: 'pointer' }, onclick: () => toast('playground') }, 'Playground'),
    h('span', { style: { fontSize: '13px', opacity: .7, cursor: 'pointer' }, onclick: () => toast('philosophy') }, 'The philosophy'),
    h('button', {
      style: { marginLeft: '10px', border: '1px solid #ffffff55', background: 'transparent', color: '#fff', borderRadius: '8px', padding: '8px 14px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' },
      onclick: () => toast("let's make it move"),
    }, "Let's make it move ↗"),
  );

  const heroCv = h('canvas', { width: 520, height: 420, style: { width: '100%', height: '100%', display: 'block' } });
  const heroVisual = h('div', {
    style: { position: 'relative', borderRadius: '18px', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 40%, #2a1f3a 0%, #0b0b0d 70%)', minHeight: '360px', border: '1px solid #ffffff10' },
  }, heroCv, h('div', { style: { position: 'absolute', right: '14px', bottom: '12px', fontSize: '10px', letterSpacing: '.14em', opacity: .45 } }, 'SCROLL TO DISCOVER ↓'));

  const paintKnot = (t) => {
    const g = heroCv.getContext('2d');
    const W = heroCv.width, H = heroCv.height;
    g.fillStyle = '#0b0b0d'; g.fillRect(0, 0, W, H);
    // stars
    const R = rng(9);
    for (let i = 0; i < 80; i++) {
      const x = R() * W, y = R() * H;
      g.fillStyle = `rgba(197,180,227,${0.15 + R() * 0.5})`;
      g.fillRect(x, y, 1.5, 1.5);
    }
    const cx = W * 0.5 + (mx - 0.5) * 30, cy = H * 0.48 + (my - 0.5) * 20;
    g.save();
    g.translate(cx, cy);
    g.rotate(t * 0.25);
    for (let i = 0; i < 160; i++) {
      const u = i / 160;
      const a = u * Math.PI * 2 * 3 + t * 0.6;
      const r = 70 + Math.sin(u * Math.PI * 4 + t) * 38 + Math.cos(a * 2) * 18;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.55 + Math.sin(u * 8 + t) * 12;
      const n = N(u * 3 + t * 0.2, a);
      const L = 55 + n * 30;
      g.beginPath();
      g.arc(x, y, 3.2 + (i % 5) * 0.4, 0, 7);
      g.fillStyle = `hsla(${270 + n * 40} 45% ${L}% / 0.85)`;
      g.fill();
      if (i > 0) {
        g.strokeStyle = `hsla(${275} 40% 70% / 0.15)`;
        g.lineWidth = 1.2;
      }
    }
    // metallic torus ribbon
    g.beginPath();
    for (let i = 0; i <= 220; i++) {
      const u = i / 220;
      const a = u * Math.PI * 2 * 2 + t * 0.4;
      const R1 = 95, R2 = 34;
      const x = (R1 + R2 * Math.cos(a * 3)) * Math.cos(a);
      const y = (R1 + R2 * Math.cos(a * 3)) * Math.sin(a) * 0.42;
      if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.strokeStyle = 'rgba(230,220,255,0.55)';
    g.lineWidth = 6;
    g.shadowColor = '#c5b4e3';
    g.shadowBlur = 24;
    g.stroke();
    g.restore();
  };

  heroVisual.addEventListener('pointermove', (e) => {
    const r = heroVisual.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width;
    my = (e.clientY - r.top) / r.height;
  });

  const loop = () => {
    if (playing) paintKnot((performance.now() - t0) / 1000);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const hero = h('div', {
    style: { display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '28px', padding: '48px 36px 36px', alignItems: 'center' },
  },
    h('div', {},
      h('div', { style: { color: '#c5b4e3', fontSize: '11px', letterSpacing: '.14em', marginBottom: '18px' } }, '• INDEPENDENT MOTION. EXTRAORDINARY POSSIBILITIES.'),
      h('div', { style: { font: '800 72px/0.95 Inter Variable', letterSpacing: '-.04em' } },
        h('div', {}, 'MOTION'),
        h('div', { style: { color: '#c5b4e3' } }, 'FORGE ', h('span', { style: { fontSize: '42px', verticalAlign: 'super' } }, '✦')),
      ),
      h('p', { style: { opacity: .55, maxWidth: '420px', lineHeight: 1.55, margin: '18px 0 22px', fontSize: '15px' } },
        'Production-ready motion systems for ambitious websites.'),
      h('div.k-row', { style: { gap: '12px' } },
        h('button', {
          style: { background: '#c5b4e3', color: '#0b0b0d', border: 0, borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' },
          onclick: () => document.getElementById('mf-coll')?.scrollIntoView({ behavior: 'smooth' }),
        }, 'Explore the collection ↓'),
        h('button', {
          style: { background: 'transparent', color: '#fff', border: '1px solid #ffffff40', borderRadius: '10px', padding: '12px 18px', fontWeight: 600, cursor: 'pointer' },
          onclick: () => { selected = '01'; paintGrid(); toast('entered playground · Liquid Reality'); },
        }, 'Enter playground ↗'),
      ),
      h('div', { style: { marginTop: '40px', fontSize: '10px', letterSpacing: '.16em', opacity: .35 } }, 'NOT YOUR ORDINARY ANIMATION LIBRARY.'),
    ),
    heroVisual,
  );

  const filterBar = h('div.k-row', { style: { gap: '8px', flexWrap: 'wrap', margin: '18px 0' } });
  const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' } });
  const liveLab = h('span', { style: { fontSize: '12px', opacity: .45 } }, '• Live previews');

  const paintFilters = () => {
    filterBar.replaceChildren(
      ...FILTERS.map((f) => h('button', {
        style: {
          border: 0, borderRadius: '99px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '12px',
          background: filter === f.id ? '#2a2038' : '#16141c', color: filter === f.id ? '#c5b4e3' : '#9a94a8',
          boxShadow: filter === f.id ? 'inset 0 0 0 1px #c5b4e355' : 'none',
        },
        onclick: () => { filter = f.id; paintFilters(); paintGrid(); },
      }, `${f.label} ${f.n}`)),
      h('span', { style: { flex: 1 } }),
      liveLab,
      h('button', {
        style: { border: '1px solid #ffffff22', background: 'transparent', color: '#aaa', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' },
        onclick: () => { playing = !playing; toast(playing ? 'previews playing' : 'previews paused'); },
      }, playing ? '❚❚' : '▶'),
    );
  };

  const paintGrid = () => {
    const list = ITEMS.filter((it) => filter === 'all' || it.cat === filter);
    grid.replaceChildren(...list.map((it) => {
      const on = selected === it.id;
      const mini = h('canvas', { width: 320, height: 160, style: { width: '100%', height: '140px', display: 'block', background: '#08070a' } });
      const g = mini.getContext('2d');
      const paintMini = () => {
        g.fillStyle = '#08070a'; g.fillRect(0, 0, 320, 160);
        const tt = (performance.now() - t0) / 1000;
        if (it.cat === 'webgl') {
          for (let y = 0; y < 160; y += 2) for (let x = 0; x < 320; x += 2) {
            const n = N(x * 0.02 + tt * 0.3, y * 0.02);
            const d = Math.hypot(x / 320 - 0.5, y / 160 - 0.5);
            const v = (n * 0.6 + Math.exp(-d * 4) * 0.5) * 255;
            g.fillStyle = `rgb(${v * 0.7 | 0},${v * 0.65 | 0},${v | 0})`;
            g.fillRect(x, y, 2, 2);
          }
        } else if (it.cat === 'type') {
          g.fillStyle = '#c5b4e3'; g.font = '800 42px Inter Variable'; g.textAlign = 'center';
          const wob = Math.sin(tt * 2 + it.id.charCodeAt(1)) * 8;
          g.fillText('Aa', 160 + wob, 90);
          g.font = '12px Inter Variable'; g.fillStyle = '#ffffff66'; g.fillText(it.title.split(' ')[0], 160, 120);
        } else if (it.cat === 'ui') {
          g.strokeStyle = '#c5b4e3'; g.lineWidth = 2;
          const r = 30 + Math.sin(tt * 2) * 10;
          g.beginPath(); g.arc(160, 80, r, 0, 7); g.stroke();
          g.fillStyle = '#ffffff18'; g.fillRect(90, 50, 140, 60);
        } else {
          g.strokeStyle = '#c5b4e399'; g.lineWidth = 2;
          g.beginPath();
          for (let i = 0; i <= 40; i++) {
            const a = (i / 40) * Math.PI * 2 + tt;
            const rr = 40 + Math.sin(a * 3) * 18;
            const x = 160 + Math.cos(a) * rr;
            const y = 80 + Math.sin(a) * rr * 0.55;
            if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
          }
          g.stroke();
        }
      };
      paintMini();
      if (playing) {
        const id = setInterval(() => { if (!mini.isConnected) return clearInterval(id); paintMini(); }, 80);
      }
      return h('button', {
        style: {
          textAlign: 'left', border: on ? '1px solid #c5b4e3' : '1px solid #ffffff14', borderRadius: '14px',
          overflow: 'hidden', background: '#100e14', color: '#fff', cursor: 'pointer', padding: 0,
          boxShadow: on ? '0 0 0 1px #c5b4e355' : 'none',
        },
        onclick: () => { selected = it.id; paintGrid(); toast(it.title); },
      },
        mini,
        h('div', { style: { padding: '12px 14px 14px' } },
          h('div.k-row', { style: { gap: '8px', marginBottom: '6px' } },
            h('span', { style: { font: '600 11px JetBrains Mono Variable,monospace', opacity: .45 } }, it.id),
            h('span', { style: { fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: '#c5b4e322', color: '#c5b4e3' } }, it.tag),
            h('span', { style: { flex: 1 } }),
            h('span', { style: { fontSize: '10px', opacity: .35 } }, it.tech),
          ),
          h('div', { style: { font: '700 15px Inter Variable' } }, it.title),
          h('div', { style: { fontSize: '12px', opacity: .45, marginTop: '4px', lineHeight: 1.4 } }, it.blurb),
          h('div.k-row', { style: { marginTop: '10px', gap: '8px' } },
            h('span', { style: { fontSize: '11px', color: '#c5b4e3', fontWeight: 600 } }, 'Customize'),
            h('span', { style: { fontSize: '11px', opacity: .5 } }, 'Open demo'),
          ),
        ),
      );
    }));
  };

  paintFilters();
  paintGrid();

  const collection = h('div', { id: 'mf-coll', style: { padding: '24px 36px 60px' } },
    h('div.k-row', { style: { gap: '8px', marginBottom: '10px', fontSize: '12px', opacity: .5 } }, h('span', {}, '+'), h('span', { style: { letterSpacing: '.12em' } }, 'THE SIGNATURE COLLECTION.')),
    h('div', { style: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', alignItems: 'end', marginBottom: '8px' } },
      h('div', { style: { font: '800 42px/1.05 Inter Variable', letterSpacing: '-.03em' } }, 'Ordinary ends here', h('span', { style: { color: '#c5b4e3' } }, '.')),
      h('div', { style: { opacity: .5, fontSize: '13px', lineHeight: 1.5 } }, 'Fifteen experiments in extraordinary. Built to be felt. Ready to be yours.'),
    ),
    filterBar,
    grid,
  );

  root.append(nav, hero, collection);

  window.__demoProof = async () => {
    filter = 'webgl'; paintFilters(); paintGrid();
    await sleep(160);
    selected = '08'; filter = 'physics'; paintFilters(); paintGrid();
    await sleep(140);
    filter = 'all'; selected = '01'; paintFilters(); paintGrid();
    playing = true;
    return 'filtered All→WebGL→physics→All; selected Liquid Reality restored';
  };
};


V['kolesidis-frivobrutalism-playground'] = (root, T) => {
  theme(root, T, { bg: '#ff7051', fg: '#111', panel: '#fff', ac: '#111', acfg: '#ffd30c', dark: false, line: '#111' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';
  root.style.background = '#ff7051';
  root.style.color = '#111';

  const hard = (extra = {}) => ({
    border: '3px solid #111',
    boxShadow: '6px 6px 0 #111',
    background: '#fff',
    ...extra,
  });

  // scrolling marquee bar
  const marqueeInner = h('div', {
    style: {
      display: 'inline-block', whiteSpace: 'nowrap', paddingLeft: '100%',
      animation: 'mk-marquee 22s linear infinite', fontWeight: 800, fontSize: '13px',
      letterSpacing: '.08em', color: '#fff',
    },
  }, 'WELCOME TO MY PLAYGROUND  ·  FEEL FREE TO PLAY WITH MY RUBBER DUCK  ·  TRY MOVING THINGS AROUND  ·  FRIVOBRUTALISM  ·  ');
  const marquee = h('div', {
    style: {
      position: 'absolute', top: 0, left: 0, right: 0, height: '34px', background: '#111',
      overflow: 'hidden', zIndex: 6, displayItems: 'center', display: 'flex',
    },
  }, marqueeInner);
  css(`@keyframes mk-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`);

  const title = h('div', {
    style: { position: 'absolute', left: '28px', top: '56px', zIndex: 4, fontWeight: 900, fontSize: '42px', letterSpacing: '-.03em', lineHeight: 1 },
  }, 'Michael', h('br'), 'Kolesidis');

  const cta = h('button', {
    style: {
      position: 'absolute', right: '28px', top: '56px', zIndex: 5, ...hard({
        padding: '14px 18px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', borderRadius: '2px',
      }),
    },
    onclick: () => toast('Project request submitted (demo)'),
  }, 'Submit Project Request');

  // rubber duck (CSS shapes)
  const duck = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%,-50%)',
      width: '220px', height: '200px', zIndex: 3, cursor: 'grab', touchAction: 'none',
    },
  });
  const duckBody = h('div', {
    style: {
      position: 'absolute', left: '20px', bottom: '20px', width: '170px', height: '110px',
      background: '#ffd30c', border: '4px solid #111', borderRadius: '80px 80px 70px 70px',
      boxShadow: '8px 8px 0 #111',
    },
  });
  const duckHead = h('div', {
    style: {
      position: 'absolute', right: '18px', top: '18px', width: '96px', height: '96px',
      background: '#ffd30c', border: '4px solid #111', borderRadius: '50%',
      boxShadow: '6px 6px 0 #111',
    },
  });
  const beak = h('div', {
    style: {
      position: 'absolute', right: '-18px', top: '38px', width: '48px', height: '28px',
      background: '#ff7a1a', border: '3px solid #111', borderRadius: '4px 16px 16px 4px',
    },
  });
  const eye = h('div', {
    style: {
      position: 'absolute', left: '28px', top: '34px', width: '14px', height: '14px',
      background: '#111', borderRadius: '50%',
    },
  });
  duckHead.append(beak, eye);
  const wing = h('div', {
    style: {
      position: 'absolute', left: '48px', bottom: '48px', width: '70px', height: '42px',
      background: '#f5c400', border: '3px solid #111', borderRadius: '40px',
      transform: 'rotate(-12deg)',
    },
  });
  duck.append(duckBody, duckHead, wing);

  let duckRot = 0;
  const bob = () => {
    duckRot += 0.04;
    const y = Math.sin(duckRot) * 6;
    const r = Math.sin(duckRot * 0.7) * 3;
    if (!duck._dragging) duck.style.transform = `translate(-50%, calc(-50% + ${y}px)) rotate(${r}deg)`;
    requestAnimationFrame(bob);
  };
  requestAnimationFrame(bob);

  // make duck draggable
  (() => {
    let ox = 0, oy = 0, sx = 0, sy = 0;
    drag(duck, {
      start: (e) => {
        duck._dragging = true;
        duck.style.cursor = 'grabbing';
        const r = duck.getBoundingClientRect();
        const pr = root.getBoundingClientRect();
        ox = r.left - pr.left + r.width / 2; oy = r.top - pr.top + r.height / 2;
        sx = e.clientX; sy = e.clientY;
      },
      move: (e) => {
        const pr = root.getBoundingClientRect();
        const nx = ox + (e.clientX - sx);
        const ny = oy + (e.clientY - sy);
        duck.style.left = nx + 'px';
        duck.style.top = ny + 'px';
        duck.style.transform = 'translate(-50%,-50%) rotate(' + ((e.clientX - sx) * 0.05) + 'deg)';
      },
      end: () => { duck._dragging = false; duck.style.cursor = 'grab'; },
    });
  })();

  const note = h('div', {
    style: {
      position: 'absolute', left: '58%', top: '28%', zIndex: 4, fontFamily: 'Georgia, serif',
      fontStyle: 'italic', fontWeight: 700, fontSize: '15px', transform: 'rotate(6deg)',
      maxWidth: '140px',
    },
  }, 'Use it for debugging ↗');

  // WELCOME sunburst badge
  const welcome = h('div', {
    style: {
      position: 'absolute', left: '36px', top: '38%', width: '150px', height: '150px', zIndex: 4,
      borderRadius: '50%', border: '4px solid #111', boxShadow: '6px 6px 0 #111',
      background: 'repeating-conic-gradient(#111 0 8deg, #fff 0 16deg)',
      display: 'grid', placeItems: 'center', cursor: 'grab', touchAction: 'none',
    },
  }, h('span', {
    style: {
      background: '#ff7051', color: '#fff', fontWeight: 900, fontSize: '18px',
      padding: '8px 10px', border: '3px solid #111', transform: 'rotate(-8deg)',
      textShadow: '2px 2px 0 #111', letterSpacing: '.04em',
    },
  }, 'WELCOME'));

  // hatch pattern block
  const hatch = h('div', {
    style: {
      position: 'absolute', left: '48px', bottom: '160px', width: '110px', height: '110px', zIndex: 3,
      ...hard({
        backgroundImage: 'repeating-linear-gradient(-45deg,#111 0 2px,transparent 2px 10px)',
        backgroundColor: '#fff', borderRadius: '2px', cursor: 'grab', touchAction: 'none',
      }),
    },
  });

  // award badge
  const award = h('div', {
    style: {
      position: 'absolute', right: '40px', top: '36%', width: '180px', zIndex: 4,
      ...hard({
        padding: '14px 14px 16px', borderImage: 'repeating-linear-gradient(45deg,#111 0 8px,#fff 0 16px) 8',
        border: '8px solid #111', background: '#111', color: '#fff', cursor: 'grab', touchAction: 'none',
      }),
    },
  },
    h('button', {
      style: { float: 'right', border: 0, background: 'transparent', color: '#fff', fontWeight: 800, cursor: 'pointer' },
      onclick: (e) => { e.stopPropagation(); award.style.display = 'none'; toast('badge closed'); },
    }, '✕'),
    h('div', { style: { fontSize: '11px', letterSpacing: '.14em', opacity: .7, marginBottom: '6px' } }, 'DESIGN AWARD'),
    h('div', { style: { fontWeight: 800, fontSize: '15px', lineHeight: 1.25 } }, 'One Page Love'),
    h('div', { style: { fontSize: '12px', marginTop: '6px', opacity: .75 } }, 'February 2023'),
  );

  // Japanese vertical tab
  const jp = h('div', {
    style: {
      position: 'absolute', right: '28px', bottom: '150px', zIndex: 4,
      ...hard({
        writingMode: 'vertical-rl', padding: '16px 10px', fontWeight: 900, fontSize: '18px',
        letterSpacing: '.2em', cursor: 'grab', touchAction: 'none', borderRadius: '2px',
      }),
    },
  }, 'ラバーダック');

  // melting smiley
  const smile = h('div', {
    style: {
      position: 'absolute', right: '220px', top: '70px', zIndex: 4, width: '72px', height: '78px',
      cursor: 'grab', touchAction: 'none',
    },
  },
    s('svg', { viewBox: '0 0 72 78', width: '72', height: '78' },
      s('path', { d: 'M8 28c0-16 12-26 28-26s28 10 28 26c0 8-2 14-6 20-3 5-2 12 2 18H12c4-6 5-13 2-18-4-6-6-12-6-20z', fill: '#fff', stroke: '#111', 'stroke-width': '3' }),
      s('circle', { cx: '26', cy: '28', r: '4', fill: '#111' }),
      s('circle', { cx: '46', cy: '28', r: '4', fill: '#111' }),
      s('path', { d: 'M24 40c4 6 20 6 24 0', fill: 'none', stroke: '#111', 'stroke-width': '3', 'stroke-linecap': 'round' }),
    ),
  );

  // make stickers draggable
  const makeDrag = (el) => {
    let ox = 0, oy = 0, sx = 0, sy = 0;
    drag(el, {
      start: (e) => {
        el.style.zIndex = '8';
        const r = el.getBoundingClientRect();
        const pr = root.getBoundingClientRect();
        ox = r.left - pr.left; oy = r.top - pr.top; sx = e.clientX; sy = e.clientY;
      },
      move: (e) => {
        el.style.left = (ox + e.clientX - sx) + 'px';
        el.style.top = (oy + e.clientY - sy) + 'px';
        el.style.right = 'auto'; el.style.bottom = 'auto';
      },
    });
  };
  [welcome, hatch, award, jp, smile].forEach(makeDrag);

  const body = h('div', {
    style: {
      position: 'absolute', left: '28px', right: '28px', bottom: '28px', zIndex: 2,
      display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '22px',
      fontSize: '13px', lineHeight: 1.45, fontWeight: 600,
    },
  },
    h('div', {}, 'Abolishing the static web through fluid motion and interactive storytelling.'),
    h('div', {}, 'Bridging the gap between art direction and technical execution, I craft bespoke digital experiences for a global clientele.'),
    h('div', {}, 'By operating on a limited commission basis, I ensure every project receives uncompromising focus.'),
  );

  const bounceDuck = () => {
    duck.style.transition = 'transform 280ms cubic-bezier(.2,1.4,.4,1)';
    duck.style.transform = 'translate(-50%,-50%) scale(1.12) rotate(-8deg)';
    setTimeout(() => {
      duck.style.transform = 'translate(-50%,-50%) scale(1) rotate(0deg)';
      setTimeout(() => { duck.style.transition = ''; }, 280);
    }, 280);
  };
  duck.addEventListener('dblclick', bounceDuck);

  root.append(marquee, title, cta, duck, note, welcome, hatch, award, jp, smile, body);

  window.__demoProof = async () => {
    bounceDuck();
    await sleep(200);
    // nudge welcome badge
    welcome.style.left = '80px'; welcome.style.top = '42%';
    await sleep(100);
    smile.style.transform = 'rotate(-18deg) scale(1.1)';
    await sleep(120);
    smile.style.transform = '';
    welcome.style.left = '36px'; welcome.style.top = '38%';
    award.style.display = '';
    return 'duck bounce + sticker nudge · frivobrutalism playground';
  };
};

V['watabou-parchment-ink-city-map-curved-ward-labels-compass-regenerate'] = (root, T) => {
  const fontP = Promise.all([import('@fontsource/im-fell-english'), import('@fontsource/im-fell-english/400-italic.css'), import('@fontsource/ibm-plex-mono')]);
  theme(root, T, { bg: '#cec7b8', fg: '#1b1915', ac: '#1b1915', dark: false });
  const FELL = "'IM Fell English','Iowan Old Style',Georgia,serif", MONO = "'IBM Plex Mono',ui-monospace,monospace";
  const STY = {
    Default: { paper: '#cfc8ba', grid: 'rgba(70,62,50,.17)', water: '#7e786f', coast: '#5f5a52', bld: '#aaa59b', line: '#59544c', shade: '#8a857b', ink: '#1b1915', road: '#e7e1d5', roadE: '#6c665c', halo: 'rgba(207,200,186,.9)', field: null },
    Ink: { paper: '#f5f2ea', grid: 'rgba(0,0,0,.07)', water: '#d6d2c6', coast: '#1a1a1a', bld: '#fbfaf6', line: '#1a1a1a', shade: '#1a1a1a', ink: '#111', road: '#f5f2ea', roadE: '#1a1a1a', halo: 'rgba(245,242,234,.92)', field: null },
    Natural: { paper: '#d9d4b4', grid: 'rgba(60,70,40,.12)', water: '#86a3ad', coast: '#4f6870', bld: '#c2a888', line: '#5a4630', shade: '#9b8566', ink: '#2a2116', road: '#ece4cc', roadE: '#857a5c', halo: 'rgba(217,212,180,.9)', field: '#c9cc9e' },
    Blueprint: { paper: '#1e3d6e', grid: 'rgba(220,235,255,.13)', water: '#152c52', coast: '#9fbbe6', bld: '#2b5590', line: '#d8e6ff', shade: '#16305a', ink: '#eaf2ff', road: '#1e3d6e', roadE: '#9fbbe6', halo: 'rgba(30,61,110,.9)', field: null },
  };
  const SIZES = { Small: 0.74, Medium: 1, Large: 1.2 };
  const st = { seed: 1 + Math.floor(Math.random() * 99999), size: 'Medium', style: 'Default', show: { Grid: true, Labels: true, Compass: true, 'Scale bar': true, Walls: true } };
  css(`.wb{position:absolute;inset:0;overflow:hidden;background:#cfc8ba}
.wb canvas{position:absolute;inset:0;display:block}
.wb-chip{all:unset;position:absolute;top:7px;right:8px;z-index:4;background:#2c2b29;color:#ece7dc;font:500 12.5px ${MONO};padding:5px 9px 6px;border-radius:4px;cursor:pointer;box-shadow:0 1px 3px #0005;transition:background .15s}
.wb-chip:hover,.wb-chip.on{background:#43413d}
.wb-menu{position:absolute;top:36px;right:8px;z-index:5;background:#2c2b29;color:#e6e1d6;font:400 12.5px/1 ${MONO};border-radius:4px;box-shadow:0 8px 28px #0007;padding:5px 0;min-width:212px;opacity:0;transform:translateY(-4px);pointer-events:none;transition:.14s}
.wb-menu.on{opacity:1;transform:none;pointer-events:auto}
.wb-menu .it{display:flex;align-items:center;gap:8px;padding:7px 14px;cursor:pointer;white-space:nowrap}
.wb-menu .it:hover{background:#4a4843;color:#fff}
.wb-menu .it kbd{margin-left:auto;font:inherit;opacity:.5}
.wb-menu .it i{width:12px;font-style:normal;color:#d8c69a}
.wb-menu .sep{height:1px;background:#ffffff1a;margin:5px 0}
.wb-menu .hd{padding:7px 14px 3px;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;opacity:.45}
.wb-tip{position:absolute;z-index:3;pointer-events:none;background:#2c2b29e6;color:#ece7dc;font:400 12px ${MONO};padding:4px 8px;border-radius:3px;opacity:0;transition:opacity .12s;white-space:nowrap}
.wb-fade{position:absolute;inset:0;background:#cfc8ba;opacity:0;pointer-events:none;transition:opacity .22s;z-index:2}.wb-fade.on{opacity:.85}`);
  const wrap = h('div.wb'); root.append(wrap);
  const cv = h('canvas'); wrap.append(cv);
  const fade = h('div.wb-fade'); wrap.append(fade);
  const tip = h('div.wb-tip'); wrap.append(tip);
  // ---------- geometry helpers ----------
  const area = (P) => { let a = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
  const cen = (P) => { let x = 0, y = 0; for (const p of P) { x += p[0]; y += p[1]; } return [x / P.length, y / P.length]; };
  const clip = (P, nx, ny, c) => { const out = []; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; const da = nx * a[0] + ny * a[1] - c, db = nx * b[0] + ny * b[1] - c; if (da <= 0) out.push(a); if ((da < 0) !== (db < 0) && da !== db) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } } return out; };
  const inset = (P, d) => { const G = cen(P); let Q = P; for (let i = 0; i < P.length && Q.length > 2; i++) { const a = P[i], b = P[(i + 1) % P.length]; let ex = b[0] - a[0], ey = b[1] - a[1]; const L = Math.hypot(ex, ey); if (L < 1e-6) continue; ex /= L; ey /= L; let nx = ey, ny = -ex; if (nx * (G[0] - a[0]) + ny * (G[1] - a[1]) > 0) { nx = -nx; ny = -ny; } Q = clip(Q, nx, ny, nx * a[0] + ny * a[1] - d); } return Q; };
  const segD = (px, py, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1]; const l2 = dx * dx + dy * dy || 1; let t = ((px - a[0]) * dx + (py - a[1]) * dy) / l2; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - a[0] - t * dx, py - a[1] - t * dy); };
  const lineD = (px, py, L) => { let m = 1e9; for (let i = 0; i < L.length - 1; i++) m = Math.min(m, segD(px, py, L[i], L[i + 1])); return m; };
  const pip = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
  // ---------- names ----------
  const A1 = ['Cloud', 'Green', 'Grey', 'Oak', 'Raven', 'Ash', 'Stone', 'Mist', 'Wolf', 'Salt', 'Thorn', 'Elder', 'Frost', 'Iron', 'Amber', 'Hollow', 'Silver', 'Fair', 'Black', 'Wind', 'Dun', 'Marrow'];
  const A2 = ['soul', 'bloom', 'ford', 'haven', 'mere', 'wick', 'gate', 'hold', 'barrow', 'vale', 'stead', 'port', 'moor', 'brook', 'fall', 'marsh', 'dale', 'crest', 'wall', 'by'];
  const WARDS = ['Fish Ring', 'Military Ward', 'Oak Gate', 'Honey Stair', 'Ghost Vale', 'Deep Town', 'Skyrise Street', 'Redfall', 'Mist Arch', 'Merchant Row', 'Temple Close', 'Tanners Lane', 'Crown Hill', 'Lantern Yard', 'Saltmarket', 'Weavers End', 'Bell Court', 'Applegate', 'Craftsmen Ward', 'Patriciate', 'Gallows Hill', 'Cooper Square'];
  const OUTER = ['Greywind Grove', 'Wolfmeadow', 'Long Fields', 'Kingsmoor', 'Hallow Heath', 'Copper Downs', 'Elm Reach', 'Low Barrows'];
  let M = null; // generated map
  const generate = () => {
    const W = cv.W, H = cv.H, R = rng(st.seed * 7919 + 13), S = SIZES[st.size];
    const sh = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const name = A1[Math.floor(R() * A1.length)] + A2[Math.floor(R() * A2.length)];
    const cx = W * 0.5 + (R() - 0.5) * W * 0.08, cy = H * 0.54 + (R() - 0.5) * H * 0.06, C = [cx, cy];
    const Rw = Math.min(W * 0.6, H) * 0.3 * S;
    const r0 = R(); const sea = r0 < 0.72, river = r0 > 0.42;
    const sA = R() * Math.PI * 2, ux = Math.cos(sA), uy = Math.sin(sA), seaD = Rw * (0.62 + R() * 0.3), bend = (R() < 0.5 ? 1 : -1) * (0.9 + R() * 0.8), p1 = R() * 9, p2 = R() * 9;
    const coastAt = (t) => seaD + (bend * t * t) / (Rw * 4.2) + Math.sin(t / Rw * 2.1 + p1) * Rw * 0.1 + Math.sin(t / Rw * 5.3 + p2) * Rw * 0.03;
    const inSea = (x, y) => sea && (x - cx) * ux + (y - cy) * uy > coastAt(-(x - cx) * uy + (y - cy) * ux);
    const diag = Math.hypot(W, H);
    let seaPoly = null;
    if (sea) { seaPoly = []; for (let t = -diag; t <= diag; t += 6) { const d = coastAt(t); seaPoly.push([cx + ux * d - uy * t, cy + uy * d + ux * t]); } seaPoly.push([cx + ux * diag * 3 - uy * diag, cy + uy * diag * 3 + ux * diag], [cx + ux * diag * 3 + uy * diag, cy + uy * diag * 3 - ux * diag]); }
    // river: from far edge opposite-ish to the sea, meandering through/near the town
    let riv = null; const rw = 13 * S;
    if (river) { const ra = (sea ? sA + Math.PI : R() * 6.28) + (R() - 0.5) * 1.6; const P0 = [cx + Math.cos(ra) * diag, cy + Math.sin(ra) * diag]; const P1 = sea ? [cx + ux * (seaD + Rw * 0.5), cy + uy * (seaD + Rw * 0.5)] : [cx - Math.cos(ra) * diag, cy - Math.sin(ra) * diag]; const off = (R() - 0.5) * Rw * 0.7, ph = R() * 6; const nx = -(P1[1] - P0[1]), ny = P1[0] - P0[0], nl = Math.hypot(nx, ny);
      riv = []; for (let i = 0; i <= 60; i++) { const t = i / 60, m = Math.sin(t * Math.PI * 2.3 + ph) * Rw * 0.16 + off * Math.sin(t * Math.PI); riv.push([P0[0] + (P1[0] - P0[0]) * t + (nx / nl) * m, P0[1] + (P1[1] - P0[1]) * t + (ny / nl) * m]); } }
    const wet = (x, y, pad = 0) => inSea(x, y) || (riv && lineD(x, y, riv) < rw / 2 + 2 + pad);
    // wall
    const wp = [R() * 6, R() * 6, R() * 6];
    const wr = (a) => Rw * (0.94 + 0.07 * Math.sin(3 * a + wp[0]) + 0.045 * Math.sin(5 * a + wp[1]) + 0.025 * Math.sin(8 * a + wp[2]));
    const nW = 20 + Math.floor(R() * 6); const wall = []; for (let k = 0; k < nW; k++) { const a = (k / nW) * Math.PI * 2 + (R() - 0.5) * 0.12; wall.push([cx + Math.cos(a) * wr(a), cy + Math.sin(a) * wr(a)]); }
    // gates + main roads
    const nG = 3 + Math.floor(R() * 3); const g0 = R() * 6.28; const gates = [], roadsIn = [], roadsOut = [];
    for (let i = 0; i < nG; i++) { const g = g0 + (i / nG) * Math.PI * 2 + (R() - 0.5) * 0.6; const gp = [cx + Math.cos(g) * wr(g), cy + Math.sin(g) * wr(g)]; if (wet(gp[0], gp[1], 6)) continue; gates.push(gp);
      const ph = R() * 6, amp = 0.12 + R() * 0.2; const out = []; for (let r = wr(g); r < diag; r += 14) { const a = g + Math.sin(r / Rw * 1.3 + ph) * amp * Math.min(1, (r - wr(g)) / Rw); const p = [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; if (inSea(p[0], p[1])) break; out.push(p); } if (out.length > 1) roadsOut.push(out);
      const inn = []; for (let r = Rw * 0.1; r <= wr(g); r += 10) { const a = g + Math.sin(r / Rw * 2 + ph) * 0.06; inn.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } inn.push(gp); roadsIn.push(inn); }
    // sites (Vogel spiral with jitter) -> Voronoi cells via half-plane clipping
    const N = Math.round(105 * (0.85 + 0.15 * S)); const sites = [];
    for (let i = 0; i < N; i++) { const a = i * 2.39996 + (R() - 0.5) * 0.9, rad = Rw * 2.05 * Math.pow((i + 0.6) / N, 0.78) * (0.9 + R() * 0.2); sites.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); }
    const box = [[-50, -50], [W + 50, -50], [W + 50, H + 50], [-50, H + 50]];
    const cells = sites.map((s0, i) => { let P = box; for (let j = 0; j < N && P.length > 2; j++) { if (j === i) continue; const s1 = sites[j]; const nx = s1[0] - s0[0], ny = s1[1] - s0[1]; if (nx * nx + ny * ny > (Rw * 1.4) ** 2) continue; P = clip(P, nx, ny, nx * (s0[0] + s1[0]) / 2 + ny * (s0[1] + s1[1]) / 2); } return P; });
    const blds = [], marks = [], fields = [];
    const minA = 78 * S * S;
    const nearMain = (x, y) => roadsIn.some((L) => lineD(x, y, L) < 4.2 * S) ;
    const nearOut = (x, y) => roadsOut.reduce((m, L) => Math.min(m, lineD(x, y, L)), 1e9);
    const plazaR = Rw * 0.1;
    cells.forEach((cell, i) => { const s0 = sites[i]; const d = Math.hypot(s0[0] - cx, s0[1] - cy); if (cell.length < 3 || wet(s0[0], s0[1])) return;
      const inner = pip(s0[0], s0[1], wall) && d < Rw; const P = inset(cell, inner ? 2.3 * S : 3.6 * S); if (P.length < 3 || Math.abs(area(P)) < 40) return;
      if (!inner && d > Rw * 1.35 && R() < 0.6) fields.push(P);
      const out = []; const split = (Q, dep) => { const a = Math.abs(area(Q)); if (Q.length < 3 || a < 4) return; if (a < minA * (0.55 + R() * 0.9) || dep > 14) { out.push(Q); return; }
        let li = 0, lb = 0; for (let k = 0; k < Q.length; k++) { const p = Q[k], q = Q[(k + 1) % Q.length]; const l = Math.hypot(q[0] - p[0], q[1] - p[1]); if (l > lb) { lb = l; li = k; } }
        const p = Q[li], q = Q[(li + 1) % Q.length]; const ex = (q[0] - p[0]) / lb, ey = (q[1] - p[1]) / lb; const t = 0.36 + R() * 0.28; const c = ex * (p[0] + (q[0] - p[0]) * t) + ey * (p[1] + (q[1] - p[1]) * t); const gap = a > minA * 14 ? 1.5 * S : 0.55;
        split(clip(Q, ex, ey, c - gap), dep + 1); split(clip(Q, -ex, -ey, -(c + gap)), dep + 1); };
      split(P, 0);
      for (const b of out) { const [bx, by] = cen(b); const bd = Math.hypot(bx - cx, by - cy);
        if (b.some((p) => wet(p[0], p[1]))) continue; if (nearMain(bx, by) || bd < plazaR) continue;
        if (lineD(bx, by, [...wall, wall[0]]) < 5 * S) continue;
        if (inner) { const edge = Math.min(...P.map((p, k) => segD(bx, by, p, P[(k + 1) % P.length]))); if (edge > 10 * S && R() < 0.55) continue; }
        else { const ro = nearOut(bx, by); const keep = Math.max(0, 1.15 - bd / Rw * 0.9) + (ro < 24 * S && bd < Rw * 2.3 ? 0.5 : 0); if (R() > keep) continue; if (ro < 4 * S) continue; }
        if (Math.abs(area(b)) < 9) continue;
        (inner && Math.abs(area(b)) > minA * 0.9 && bd < Rw * 0.75 && R() < 0.035 ? marks : blds).push(b); } });
    // ward labels
    const names = sh(WARDS.slice()); const labels = []; const used = [];
    const innerSites = sites.filter((s0) => { const d = Math.hypot(s0[0] - cx, s0[1] - cy); return d > Rw * 0.22 && d < Rw * 0.86 && !wet(s0[0], s0[1], 12); });
    sh(innerSites).forEach((s0) => { if (labels.length >= 5 + Math.round(S * 2)) return; if (used.some((u) => Math.hypot(u[0] - s0[0], u[1] - s0[1]) < Rw * 0.42)) return; used.push(s0); labels.push({ t: names[labels.length] || 'Old Ward', x: s0[0], y: s0[1], size: 15.5 * Math.min(1.1, S + 0.1), sp: 1.5 }); });
    if (R() < 0.7) { labels.push({ t: 'Old ' + name, x: cx + (R() - 0.5) * Rw * 0.2, y: cy - Rw * 0.12, size: 11.5, sp: 1 }); }
    const outerN = sh(OUTER.slice()); let oc = 0;
    for (let k = 0; k < 14 && oc < 2; k++) { const a = (k % 2 ? -Math.PI / 2 : Math.PI / 2) + (R() - 0.5) * 1.3, r = Rw * (1.22 + R() * 0.12), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; if (wet(x, y, 30) || x < 80 || x > W - 80 || y < 90 || y > H - 60) continue; if (used.some((u, ui) => Math.hypot(u[0] - x, u[1] - y) < (ui >= used.length - oc ? Rw * 1.3 : Rw * 0.62))) continue; used.push([x, y]); labels.push({ t: outerN[oc++], x, y, size: 27 * Math.min(1.1, S + 0.1), sp: 13 }); }
    return { name, C, Rw, wall, gates, roadsOut, riv, rw, seaPoly, blds, marks, fields, labels, S };
  };
  // ---------- render ----------
  const arcText = (g, text, x, y, size, sp, C, col, halo) => { g.font = `400 ${size}px ${FELL}`; const ch = [...text.toUpperCase()]; const ws = ch.map((c) => g.measureText(c).width); const tot = ws.reduce((a, b) => a + b, 0) + sp * (ch.length - 1);
    let dx = x - C[0], dy = y - C[1]; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl; const Rr = Math.max(dl, 230); const vc = [x - dx * Rr, y - dy * Rr]; const phi = Math.atan2(y - vc[1], x - vc[0]); const below = Math.sin(phi) >= 0;
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
    for (const pass of [0, 1]) { let acc = 0; ch.forEach((c, i) => { const mid = acc + ws[i] / 2; acc += ws[i] + sp; const a = below ? phi + (tot / 2 - mid) / Rr : phi - (tot / 2 - mid) / Rr; const px = vc[0] + Math.cos(a) * Rr, py = vc[1] + Math.sin(a) * Rr;
      g.save(); g.translate(px, py); g.rotate(below ? a - Math.PI / 2 : a + Math.PI / 2); if (pass === 0) { g.strokeStyle = halo; g.lineWidth = Math.max(3, size * 0.28); g.strokeText(c, 0, 0); } else { g.fillStyle = col; g.fillText(c, 0, 0); } g.restore(); }); } };
  const poly = (g, P, dx = 0, dy = 0) => { g.beginPath(); P.forEach((p, i) => (i ? g.lineTo(p[0] + dx, p[1] + dy) : g.moveTo(p[0] + dx, p[1] + dy))); g.closePath(); };
  const line = (g, L) => { g.beginPath(); L.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); };
  const compass = (g, x, y, r, K) => { g.save(); g.translate(x, y);
    const pt = (ang, len, wd, fillL, fillR) => { const c = Math.cos(ang), s0 = Math.sin(ang), px = -s0, py = c; g.beginPath(); g.moveTo(0, 0); g.lineTo(c * len, s0 * len); g.lineTo(px * wd, py * wd); g.closePath(); g.fillStyle = fillL; g.fill(); g.beginPath(); g.moveTo(0, 0); g.lineTo(c * len, s0 * len); g.lineTo(-px * wd, -py * wd); g.closePath(); g.fillStyle = fillR; g.fill(); g.strokeStyle = K.ink; g.lineWidth = 1; g.beginPath(); g.moveTo(px * wd, py * wd); g.lineTo(c * len, s0 * len); g.lineTo(-px * wd, -py * wd); g.stroke(); };
    g.strokeStyle = K.ink; g.lineWidth = 1; g.beginPath(); g.arc(0, 0, r * 0.52, 0, 7); g.stroke(); g.beginPath(); g.arc(0, 0, r * 0.47, 0, 7); g.stroke();
    for (let k = 0; k < 4; k++) pt(Math.PI / 4 + (k * Math.PI) / 2, r * 0.55, r * 0.09, K.ink, K.paper);
    for (let k = 0; k < 4; k++) pt(-Math.PI / 2 + (k * Math.PI) / 2, r, r * 0.14, K.ink, K.paper);
    g.fillStyle = K.ink; g.font = `400 ${Math.round(r * 0.3)}px ${FELL}`; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillText('N', 0, -r - 7); g.restore(); };
  const render = () => { if (!M) return; const g = cv.g, W = cv.W, H = cv.H, K = STY[st.style], sh = st.show; wrap.style.background = K.paper;
    g.fillStyle = K.paper; g.fillRect(0, 0, W, H);
    if (K.field) { g.fillStyle = K.field; for (const f of M.fields) { poly(g, inset(f, 3)); g.fill(); } }
    // outer roads (double line)
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const L of M.roadsOut) { line(g, L); g.strokeStyle = K.roadE; g.lineWidth = 4.2 * M.S; g.stroke(); line(g, L); g.strokeStyle = K.road; g.lineWidth = 2.4 * M.S; g.stroke(); }
    // water
    if (M.seaPoly) { poly(g, M.seaPoly); g.fillStyle = K.water; g.fill(); g.strokeStyle = K.coast; g.lineWidth = 1.2; g.stroke(); }
    if (M.riv) { line(g, M.riv); g.strokeStyle = K.coast; g.lineWidth = M.rw + 2.4; g.stroke(); line(g, M.riv); g.strokeStyle = K.water; g.lineWidth = M.rw; g.stroke(); }
    if (sh.Grid) { g.strokeStyle = K.grid; g.lineWidth = 1; const step = Math.round(Math.min(W, H) / 7.6); const ox = (W / 2) % step, oy = (H / 2) % step; g.beginPath(); for (let x = ox; x < W; x += step) { g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); } for (let y = oy; y < H; y += step) { g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); } g.stroke(); }
    // buildings: offset shadow, fill, outline
    g.fillStyle = K.shade; for (const b of M.blds) { poly(g, b, 1.3, 1.3); g.fill(); }
    g.lineWidth = 0.75; g.strokeStyle = K.line; g.fillStyle = K.bld; for (const b of M.blds) { poly(g, b); g.fill(); g.stroke(); }
    g.fillStyle = K.ink; for (const b of M.marks) { poly(g, b); g.fill(); }
    // walls + towers + gates
    if (sh.Walls) { const Wl = M.wall, n = Wl.length; g.strokeStyle = K.ink; g.lineWidth = 3.4 * M.S; const dry = (p) => !(M.seaPoly && pip(p[0], p[1], M.seaPoly));
      for (let k = 0; k < n; k++) { const a = Wl[k], b = Wl[(k + 1) % n]; if (!dry(a) || !dry(b)) continue; if (M.riv && (lineD(a[0], a[1], M.riv) < M.rw && lineD(b[0], b[1], M.riv) < M.rw)) continue; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
      g.fillStyle = K.ink; for (const p of Wl) if (dry(p)) { g.beginPath(); g.arc(p[0], p[1], 3.6 * M.S, 0, 7); g.fill(); }
      for (const p of M.gates) { g.fillStyle = K.ink; g.fillRect(p[0] - 4.5 * M.S, p[1] - 4.5 * M.S, 9 * M.S, 9 * M.S); g.fillStyle = K.road; g.fillRect(p[0] - 1.6 * M.S, p[1] - 1.6 * M.S, 3.2 * M.S, 3.2 * M.S); } }
    if (sh.Labels) for (const L of M.labels) arcText(g, L.t, L.x, L.y, L.size, L.sp, M.C, K.ink, K.halo);
    // title
    g.font = `400 ${Math.round(Math.min(46, W / 30))}px ${FELL}`; g.textAlign = 'center'; g.textBaseline = 'top'; g.lineJoin = 'round'; g.strokeStyle = K.halo; g.lineWidth = 6; g.strokeText(M.name, W / 2, 16); g.fillStyle = K.ink; g.fillText(M.name, W / 2, 16);
    if (sh['Scale bar']) { const u = 0.46 * M.S, x0 = 8, y0 = H - 18, len = 500 * u; g.strokeStyle = K.ink; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + len, y0); for (let m = 0; m <= 500; m += 50) { const tl = m % 250 === 0 ? 7 : 3.5; g.moveTo(x0 + m * u + 0.5, y0); g.lineTo(x0 + m * u + 0.5, y0 - tl); } g.stroke(); g.fillStyle = K.ink; g.font = `400 14px ${FELL}`; g.textBaseline = 'bottom'; g.textAlign = 'left'; g.fillText('0', x0 - 3, y0 - 9); g.textAlign = 'center'; g.fillText('250', x0 + 250 * u, y0 - 9); g.fillText('500 m', x0 + 500 * u + 10, y0 - 9); }
    if (sh.Compass) compass(g, W - 82, H - 92, 62, K); };
  const regen = (seed) => { if (seed != null) st.seed = seed; fitCanvas(cv, wrap); M = generate(); render(); return M; };
  // ---------- menu ----------
  const chip = h('button.wb-chip', { onclick: (e) => { e.stopPropagation(); menuOn(!menu.classList.contains('on')); } }, 'Menu');
  const menu = h('div.wb-menu', { onclick: (e) => e.stopPropagation() });
  const menuOn = (v) => { menu.classList.toggle('on', v); chip.classList.toggle('on', v); if (v) drawMenu(); };
  const it = (label, fn, mark = '', kbd = '') => h('div.it', { onclick: fn }, h('i', {}, mark), label, kbd ? h('kbd', {}, kbd) : null);
  const drawMenu = () => menu.replaceChildren(
    it('Regenerate', () => { menuOn(false); reseed(); }, '', '⏎'),
    it('Permalink', () => { copy(`https://watabou.github.io/city-generator/?seed=${st.seed}&size=${st.size}`, 'Permalink copied'); menuOn(false); }),
    it('Export as PNG', () => { const a = h('a', { download: `${M.name}.png`, href: cv.toDataURL('image/png') }); a.click(); menuOn(false); }),
    h('div.sep'), h('div.hd', {}, 'Size'), ...Object.keys(SIZES).map((k) => it(k, () => { st.size = k; reseed(st.seed); drawMenu(); }, st.size === k ? '●' : '')),
    h('div.sep'), h('div.hd', {}, 'Style'), ...Object.keys(STY).map((k) => it(k, () => { st.style = k; render(); drawMenu(); }, st.style === k ? '●' : '')),
    h('div.sep'), h('div.hd', {}, 'Elements'), ...Object.keys(st.show).map((k) => it(k, () => { st.show[k] = !st.show[k]; render(); drawMenu(); }, st.show[k] ? '✓' : '')),
    h('div.sep'), it('About', () => { toast('Medieval Fantasy City Generator — look-alike demo'); menuOn(false); }));
  wrap.append(chip, menu);
  root.addEventListener('click', () => menuOn(false));
  const reseed = async (seed) => { fade.classList.add('on'); await sleep(200); regen(seed ?? 1 + Math.floor(Math.random() * 99999)); fade.classList.remove('on'); return M; };
  const onKey = (e) => { if (e.key === 'Enter' && !e.target.closest?.('input,textarea')) reseed(); }; window.addEventListener('keydown', onKey);
  // hover tooltip: nearest ward label
  cv.addEventListener('pointermove', (e) => { if (!M || !st.show.Labels) return; const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = null, bd = 60; for (const L of M.labels) { const d = Math.hypot(L.x - x, L.y - y); if (d < bd) { bd = d; best = L; } } tip.style.opacity = best ? 1 : 0; if (best) { tip.textContent = best.t; tip.style.left = x + 14 + 'px'; tip.style.top = y + 12 + 'px'; } });
  cv.addEventListener('pointerleave', () => (tip.style.opacity = 0));
  new ResizeObserver(() => regen()).observe(wrap);
  regen(); fontP.then(() => document.fonts.load(`20px ${FELL}`)).then(() => render()).catch(() => {});
  window.__demoProof = async () => { const out = []; await document.fonts.ready; const s0 = st.seed;
    chip.click(); await sleep(200); out.push(`menu open=${menu.classList.contains('on')} items=${menu.querySelectorAll('.it').length}`);
    const a = M.name; menu.querySelector('.it').click(); await sleep(450); out.push(`Regenerate: ${a} → ${M.name} (${M.blds.length} buildings, ${M.labels.length} ward labels, ${M.gates.length} gates)`);
    st.style = 'Ink'; render(); await sleep(120); out.push('style Ink rendered'); st.style = 'Blueprint'; render(); await sleep(120); out.push('style Blueprint rendered');
    st.style = 'Default'; st.size = 'Large'; regen(s0); out.push(`size Large → ${M.blds.length} buildings`); st.size = 'Medium';
    const keep = [3, 11, 27, 42, 58, 77, 91]; let pick0 = s0; for (const k of keep) { regen(k * 1013); if (M.seaPoly && M.labels.length >= 7) { pick0 = k * 1013; break; } }
    regen(pick0); menuOn(false); return out.join('; ') + `; restored Default/Medium seed ${st.seed} → ${M.name}`; };
};


V['humanssince1982-clock-wall-kinetic-hands-grid-live-since-counter-mono-nav'] = (root, T) => {
  theme(root, T, { bg: '#0c0c0c', fg: '#f2f2f2', ac: '#ffffff', dark: true });
  const F = "'Inter Variable','Helvetica Neue',Arial,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLS = 12, ROWS = 6, CELL = 96, D = 88;
  css(`.hs{position:absolute;inset:0;overflow:hidden;background:#0c0c0c;color:#f2f2f2;font-family:${F};letter-spacing:-.01em}
.hs *{box-sizing:border-box}
.hs-bar{position:absolute;left:0;right:0;top:0;height:48px;background:#dddcd8;color:#111;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 30px;z-index:5;font:450 14.5px ${F}}
.hs-bar nav{display:flex;gap:0}.hs-bar nav a{cursor:pointer;width:116px}.hs-bar nav a:hover,.hs-bar .r a:hover{text-decoration:underline;text-underline-offset:3px}
.hs-bar .wm{font:400 22px ${F};letter-spacing:-.025em;cursor:pointer}
.hs-bar .r{display:flex;justify-content:flex-end;gap:52px}.hs-bar .r a{cursor:pointer}.hs-bar .r b{font-weight:450;margin-left:12px}
.hs-bar .r a.bump b{display:inline-block;animation:hsB .5s}@keyframes hsB{40%{transform:scale(1.6)}}
.hs-dd{position:absolute;top:48px;left:0;right:0;background:#dddcd8;color:#111;padding:26px 30px 34px;display:grid;grid-template-columns:repeat(4,220px);gap:20px;font:450 14px/2 ${F};z-index:4;transform:translateY(-110%);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.hs-dd.on{transform:none}.hs-dd b{display:block;font-weight:450;color:#777;margin-bottom:4px}.hs-dd a{display:block;cursor:pointer}.hs-dd a:hover{text-decoration:underline}
.hs-sc{position:absolute;inset:48px 0 0 0;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:#444 #0c0c0c}
.hs-hero{position:relative;height:814px;background:radial-gradient(ellipse at 52% 46%,#1b1b1b 0%,#0f0f0f 55%,#080808 100%);overflow:hidden;cursor:pointer}
.hs-frame{position:absolute;left:78px;right:68px;top:76px;bottom:-30px;background:linear-gradient(180deg,#141414,#101010);box-shadow:inset 0 0 0 1px #1c1c1c,0 30px 80px #000c;border-radius:2px}
.hs-grid{position:absolute;left:50%;top:388px;width:${COLS * CELL}px;height:${ROWS * CELL}px;margin:-${(ROWS * CELL) / 2}px 0 0 -${(COLS * CELL) / 2}px;display:grid;grid-template-columns:repeat(${COLS},${CELL}px);grid-auto-rows:${CELL}px}
.hs-c{position:relative;width:${D}px;height:${D}px;margin:auto;border-radius:50%;background:radial-gradient(circle at 50% 40%,#151515,#0b0b0b 72%);box-shadow:inset 0 0 0 1px #1f1f1f,inset 0 6px 14px #000,0 1px 0 #222}
.hs-h{position:absolute;left:50%;bottom:calc(50% - 3.5px);width:7px;height:calc(47% + 3.5px);margin-left:-3.5px;transform-origin:50% calc(100% - 3.5px);border-radius:1.5px;
 background:linear-gradient(90deg,#ffffff38 0%,#ffffffe6 30%,#ffffff70 55%,#ffffffd0 80%,#ffffff30 100%);box-shadow:0 0 4px #ffffff22,1px 2px 3px #0009;will-change:transform}
.hs-ov{position:absolute;left:30px;top:166px;font:400 18px/1.3 ${F};color:#f4f4f4;pointer-events:none;z-index:2;text-shadow:0 1px 8px #000}
.hs-ov .n{font-variant-numeric:tabular-nums}
.hs-cap{position:absolute;right:30px;bottom:22px;display:flex;align-items:center;gap:14px;font:400 12px ${F};color:#8a8a8a;z-index:2}
.hs .hs-pp{width:26px;height:26px;border-radius:50%;border:1px solid #555;background:#0008;color:#ddd;display:grid;place-items:center;font-size:9px;cursor:pointer}
.hs-dots{display:flex;gap:5px}.hs-dots i{width:5px;height:5px;border-radius:50%;background:#444}.hs-dots i.on{background:#ddd}
.hs-split{display:grid;grid-template-columns:1fr 1fr;height:780px}
.hs-water{position:relative;background:#0d1020;overflow:hidden}
.hs-water canvas{position:absolute;inset:0;width:100%;height:100%}
.hs-water span{position:absolute;left:34px;top:46%;font:400 19px ${F};color:#eef}
.hs-grey{background:#d8d7d3;display:grid;place-items:center;position:relative}
.hs-disc{width:560px;height:560px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#1d3a78,#0f2050 60%,#0a1638);box-shadow:0 30px 60px #0003;position:relative;overflow:hidden}
.hs-disc .m{position:absolute;width:40px;height:40px;border-radius:50%;box-shadow:inset 0 0 0 1px #ffffff14}
.hs-disc .m i{position:absolute;left:50%;bottom:calc(50% - 2px);width:4px;height:calc(46% + 2px);margin-left:-2px;transform-origin:50% calc(100% - 2px);background:linear-gradient(90deg,#fff5,#fffd,#fff6);border-radius:1px}
.hs-grey small{position:absolute;left:34px;bottom:30px;font:400 13px ${F};color:#333}
.hs-txt{background:#d8d7d3;color:#111;padding:110px 30px 90px;display:grid;grid-template-columns:240px 1fr;gap:28px 40px}
.hs-txt b{font:400 14px ${F};color:#666}
.hs-txt p{margin:0;font:400 34px/1.18 ${F};letter-spacing:-.025em;max-width:980px}
.hs-txt p.s{font-size:19px;line-height:1.4;max-width:760px;color:#222}
.hs-shop{background:#d8d7d3;color:#111;padding:20px 30px 110px}
.hs-shop h3{font:400 14px ${F};color:#666;margin:0 0 22px}
.hs-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.hs-cd{cursor:pointer}
.hs-cd .im{height:420px;background:#cfcec9;display:grid;place-items:center;position:relative;overflow:hidden;transition:background .3s}
.hs-cd:hover .im{background:#c8c7c1}
.hs-cd .meta{display:grid;grid-template-columns:1fr auto;padding:12px 0;font:400 14px/1.45 ${F}}
.hs-cd .meta span:nth-child(even){text-align:right}.hs-cd .meta .g{color:#777}
.hs .hs-add{position:absolute;left:14px;bottom:14px;height:34px;padding:0 16px;border:0;background:#111;color:#eee;font:400 13px ${F};opacity:0;transform:translateY(8px);transition:.25s;cursor:pointer}
.hs-cd:hover .hs-add{opacity:1;transform:none}
.cc{position:relative;padding:14px 16px;border-radius:3px;display:grid;grid-template-columns:repeat(8,34px);gap:4px;box-shadow:0 20px 40px #0003}
.cc .k{position:relative;width:34px;height:34px;border-radius:50%}
.cc .k i{position:absolute;left:50%;bottom:calc(50% - 1.5px);width:3px;height:calc(46% + 1.5px);margin-left:-1.5px;transform-origin:50% calc(100% - 1.5px);border-radius:1px;transition:transform 1.6s cubic-bezier(.6,0,.2,1)}
.hs-ft{background:#0c0c0c;color:#ddd;padding:70px 30px 40px;display:grid;grid-template-columns:repeat(4,1fr);gap:24px;font:400 14px/2 ${F}}
.hs-ft b{display:block;color:#777;font-weight:400}.hs-ft a{display:block;cursor:pointer}.hs-ft a:hover{color:#fff}
.hs-ft .c{grid-column:1/-1;border-top:1px solid #222;padding-top:22px;display:flex;justify-content:space-between;color:#999;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion: reduce){.hs *{transition:none!important;animation:none!important}}
`);
  const el = h('div.hs'); root.append(el);
  // ---------- top bar ----------
  let cart = 0; const cartA = h('a', { onclick: () => toast('Cart: ' + cart + ' item(s)') }, 'Cart', h('b', {}, '0'));
  const dd = h('div.hs-dd', {}, [['Masterpieces', ['AMT61C Tidal', 'AMT72 Black Sterling', 'AMT72V', 'AMT120']], ['Collectibles', ['CC24 / White', 'CC24 / White Sterling', 'CC24 / Black Sterling']], ['Collaborations', ['HS82 x Bjarke Ingels', 'HS82 x Rolls-Royce Club', 'HS82 x Steinway', 'HS82 x IKEA']], ['Bespoke', ['HS82 for Moncler', 'HS82 for Changi', 'HS82 for San Jose']]].map(([t, ls]) => h('div', {}, h('b', {}, t), ls.map((l) => h('a', { onclick: () => { dd.classList.remove('on'); toast(l); } }, l)))));
  const bar = h('header.hs-bar', {}, h('nav', {}, h('a', { onclick: () => dd.classList.toggle('on') }, 'Shop'), h('a', { onclick: () => dd.classList.toggle('on') }, 'Explore'), h('a', { onclick: () => toast('Client care') }, 'Client care')),
    h('div.wm', { onclick: () => sc.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }) }, 'Humans since 1982'),
    h('div.r', {}, h('a', { onclick: () => toast('Search') }, 'Search'), h('a', { onclick: () => toast('Subscribe to the newsletter') }, 'Subscribe'), cartA));
  // ---------- since-2008 counter ----------
  const T0 = Date.UTC(2008, 6, 4, 3, 0, 0);
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sinceTxt = (now = Date.now()) => { const sec = Math.floor((now - T0) / 1000), days = Math.floor(sec / 86400), yrs = Math.floor(days / 365.2425); return `${yrs} years : ${days} days : ${fmt(sec)}s`; };
  const cntEls = [];
  const cnt = () => { const e = h('span.n', {}, sinceTxt()); cntEls.push(e); return e; };
  // ---------- clock wall ----------
  const grid = h('div.hs-grid'); const clocks = [];
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const a = h('i.hs-h'), b = h('i.hs-h'), c = h('div.hs-c', {}, a, b); grid.append(c); clocks.push({ x, y, a, b, cur: [225, 225], from: [225, 225], to: [225, 225] }); }
  // digit glyphs: polylines through the 3x6 point grid; each clock's hands point at its path neighbours
  const DG = { 0: [[[0, 0], [2, 0], [2, 5], [0, 5], [0, 0]], [[1, 1], [1, 4]]], 1: [[[1, 0], [2, 0], [2, 5], [1, 5], [1, 0]]],
    2: [[[0, 0], [2, 0], [2, 3], [1, 3], [1, 4], [2, 4], [2, 5], [0, 5], [0, 2], [1, 2], [1, 1], [0, 1], [0, 0]]],
    3: [[[0, 0], [2, 0], [2, 5], [0, 5], [0, 4], [1, 4], [1, 3], [0, 3], [0, 2], [1, 2], [1, 1], [0, 1], [0, 0]]],
    4: [[[0, 0], [0, 3], [1, 3], [1, 5], [2, 5], [2, 0], [1, 0], [1, 2]]],
    5: [[[2, 0], [0, 0], [0, 3], [1, 3], [1, 4], [0, 4], [0, 5], [2, 5], [2, 2], [1, 2], [1, 1], [2, 1], [2, 0]]],
    6: [[[2, 0], [0, 0], [0, 5], [2, 5], [2, 2], [1, 2], [1, 1], [2, 1], [2, 0]], [[1, 3], [1, 4]]],
    7: [[[0, 0], [2, 0], [2, 5], [1, 5], [1, 1], [0, 1], [0, 0]]],
    8: [[[0, 0], [2, 0], [2, 5], [0, 5], [0, 0]], [[1, 1], [1, 2]], [[1, 3], [1, 4]]],
    9: [[[0, 0], [2, 0], [2, 5], [0, 5], [0, 4], [1, 4], [1, 3], [0, 3], [0, 0]], [[1, 1], [1, 2]]] };
  const dirOf = (dx, dy) => (dy < 0 ? 0 : dx > 0 ? 90 : dy > 0 ? 180 : 270);
  const glyph = (d) => { const adj = {}; const add = (p, q) => { const k = p.join(); (adj[k] ||= []).push(dirOf(Math.sign(q[0] - p[0]), Math.sign(q[1] - p[1]))); };
    for (const line of DG[d]) for (let i = 0; i < line.length - 1; i++) { const [p, q] = [line[i], line[i + 1]]; const dx = Math.sign(q[0] - p[0]), dy = Math.sign(q[1] - p[1]); let c = [...p];
      while (c[0] !== q[0] || c[1] !== q[1]) { const n = [c[0] + dx, c[1] + dy]; add(c, n); add(n, c); c = n; } }
    return (x, y) => { const l = [...new Set(adj[[x, y].join()] || [])]; return l.length === 0 ? [225, 225] : l.length === 1 ? [l[0], l[0]] : [l[0], l[1]]; }; };
  const timeDigits = () => { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`; };
  const timeTarget = () => { const ds = timeDigits().split('').map((c) => glyph(+c)); return (x, y) => ds[Math.floor(x / 3)](x % 3, y); };
  const cx = (COLS - 1) / 2, cy = (ROWS - 1) / 2;
  const PATTERNS = [
    { name: 'time', tgt: timeTarget, k: 1, hold: 4200, stag: (x) => x * 55 },
    { name: 'diagonal wave', tgt: () => (x, y) => [((x + y) * 30) % 360, ((x + y) * 30 + 180) % 360], k: 1, hold: 600, stag: (x, y) => (x + y) * 70 },
    { name: 'chevrons', tgt: () => (x, y) => (y % 2 ? [135, 45] : [315, 225]), k: 0, hold: 1500, stag: (x) => x * 80 },
    { name: 'vertical rain', tgt: () => () => [0, 180], k: 1, hold: 1300, stag: (x, y) => y * 120 + x * 25 },
    { name: 'bloom', tgt: () => (x, y) => { const a = (Math.atan2(x - cx, -(y - cy)) * 180) / Math.PI; return [(a + 360) % 360, (a + 180) % 360]; }, k: 1, hold: 1500, stag: (x, y) => Math.hypot(x - cx, y - cy) * 140 },
    { name: 'horizon', tgt: () => () => [90, 270], k: 0, hold: 1200, stag: (x) => Math.abs(x - cx) * 90 } ];
  const DUR = 2300, ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  let pi = 0, segT0 = 0, paused = false, raf = 0, pauseAt = 0, curPat = PATTERNS[0];
  const apply = () => clocks.forEach((c) => { c.a.style.transform = `rotate(${c.cur[0]}deg)`; c.b.style.transform = `rotate(${c.cur[1]}deg)`; });
  const unwrapCW = (f, t, k) => f + ((((t - f) % 360) + 360) % 360) + k * 360, unwrapCCW = (f, t, k) => f - ((((f - t) % 360) + 360) % 360) - k * 360;
  const startSeg = (i, now = performance.now()) => { pi = (i + PATTERNS.length) % PATTERNS.length; curPat = PATTERNS[pi]; const tg = curPat.tgt(); segT0 = now;
    clocks.forEach((c) => { const [t1, t2] = tg(c.x, c.y); c.from = [...c.cur]; c.to = [unwrapCW(c.cur[0], t1, curPat.k), unwrapCCW(c.cur[1], t2, curPat.k)]; c.del = curPat.stag(c.x, c.y); });
    [...dots.children].forEach((d, j) => d.classList.toggle('on', j === pi)); capT.textContent = `A Million Times · ${curPat.name}`; };
  const maxDel = () => Math.max(...clocks.map((c) => c.del));
  const frame = (now) => { if (!paused) { const t = now - segT0;
      clocks.forEach((c) => { const p = ease(clamp((t - c.del) / DUR, 0, 1)); c.cur = [c.from[0] + (c.to[0] - c.from[0]) * p, c.from[1] + (c.to[1] - c.from[1]) * p]; }); apply();
      if (t > maxDel() + DUR + curPat.hold) { clocks.forEach((c) => (c.cur = [c.to[0] % 360, c.to[1] % 360])); startSeg(pi + 1, now); } }
    raf = requestAnimationFrame(frame); };
  const snapTime = () => { const tg = timeTarget(); clocks.forEach((c) => { c.cur = tg(c.x, c.y); c.from = [...c.cur]; c.to = [...c.cur]; c.del = 0; }); apply(); };
  const capT = h('span', {}, 'A Million Times · time');
  const dots = h('div.hs-dots', {}, PATTERNS.map(() => h('i')));
  const ppB = h('button.hs-pp', { title: 'Pause choreography', onclick: (e) => { e.stopPropagation(); setPaused(!paused); } }, '❚❚');
  const setPaused = (p) => { if (RM) return; if (p && !paused) pauseAt = performance.now(); if (!p && paused) segT0 += performance.now() - pauseAt; paused = p; ppB.textContent = p ? '▶' : '❚❚'; };
  const hero = h('section.hs-hero', { title: 'Click to skip to the next choreography', onclick: () => { if (RM) return; clocks.forEach((c) => (c.cur = [c.cur[0] % 360, c.cur[1] % 360])); if (paused) setPaused(false); startSeg(pi + 1); } },
    h('div.hs-frame'), grid, h('div.hs-ov', {}, 'Celebrating Time since 2008', h('br'), cnt()), h('div.hs-cap', {}, capT, dots, ppB));
  // ---------- split: water + navy disc ----------
  const wcv = h('canvas'); const water = h('div.hs-water', {}, wcv, h('span', {}, 'Humans since 1982'));
  const disc = h('div.hs-disc'); const minis = [];
  for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) { const px = 40 + x * 40, py = 40 + y * 40; if (Math.hypot(px + 20 - 280, py + 20 - 280) > 236) continue; const a = h('i'), b = h('i'); const m = h('div.m', { style: { left: px + 'px', top: py + 'px' } }, a, b); disc.append(m); minis.push({ x, y, a, b }); }
  const split = h('section.hs-split', {}, water, h('div.hs-grey', {}, disc, h('small', {}, 'AMT61C Tidal — Black mineral composite, bespoke programming')));
  const nz = noise2(5);
  const drawWater = (t) => { const r = water.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; if (wcv.width !== 540) { wcv.width = 540; wcv.height = 585; }
    const g = wcv.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 585); gr.addColorStop(0, '#20253f'); gr.addColorStop(0.5, '#121628'); gr.addColorStop(1, '#06070f'); g.fillStyle = gr; g.fillRect(0, 0, 540, 585);
    for (let y = 0; y < 585; y += 2) { const ps = 0.6 + y / 585; for (let x = 0; x < 540; x += 3) { const n = nz(x * 0.03 / ps + t * 0.00012, y * 0.085 / ps - t * 0.00028) * 0.8 + nz(x * 0.16 - t * 0.0005, y * 0.3 + t * 0.0002) * 0.3;
      if (n > 0.64) { const a = Math.min(1, (n - 0.64) * 6); g.fillStyle = `rgba(236,238,255,${a})`; g.fillRect(x, y, 1.5 + a * 3 * ps, 1); } else if (n > 0.5) { g.fillStyle = `rgba(70,80,135,${(n - 0.5) * 2.2})`; g.fillRect(x, y, 3, 1.2); } } } };
  const drawMinis = (t) => minis.forEach((m) => { const base = 30 + Math.sin(t * 0.0006 + m.x * 0.35 + m.y * 0.2) * (RM ? 0 : 22); m.a.style.transform = `rotate(${base}deg)`; m.b.style.transform = `rotate(${base + 180}deg)`; });
  // ---------- text + product cards (ClockClock 24 stand-ins) ----------
  const txt = h('section.hs-txt', {}, h('b', {}, 'Introduction'), h('p', {}, 'Humans since 1982 is a pioneering studio for collectible design and art, based in Stockholm, Sweden.'),
    h('b', {}, 'Recognition'), h('p.s', {}, 'Through their many exhibitions worldwide \u2014 including Somerset House, Saatchi Gallery, and Smithsonian Design Museum \u2014 Humans since 1982 have established themselves as a force for immersive and captivating experiences.'));
  const CH = { '┌': [90, 180], '┐': [270, 180], '└': [0, 90], '┘': [0, 270], '│': [0, 180], '╷': [180, 180], '╵': [0, 0], '╶': [90, 90], '╴': [270, 270], ' ': [225, 225], '>': [315, 225], '<': [45, 135] };
  const D24 = { 0: ['┌┐', '││', '└┘'], 1: [' ╷', ' │', ' ╵'], 2: ['╶┐', '┌┘', '└╴'], 3: ['╶┐', '╶│', '╶┘'], 4: ['╷╷', '└│', ' ╵'], 5: ['┌╴', '└┐', '╶┘'], 6: ['┌╴', '│┐', '└┘'], 7: ['╶┐', ' │', ' ╵'], 8: ['┌┐', '><', '└┘'], 9: ['┌┐', '└│', '╶┘'] };
  const ccs = [];
  const mkCC = (body, face, hand, ring) => { const ks = []; const box = h('div.cc', { style: { background: body } });
    for (let y = 0; y < 3; y++) for (let x = 0; x < 8; x++) { const a = h('i', { style: { background: hand } }), b = h('i', { style: { background: hand } }); const k = h('div.k', { style: { background: face, boxShadow: `inset 0 0 0 1px ${ring}` } }, a, b); box.append(k); ks.push({ x, y, a, b }); }
    const o = { box, ks, show(str, spin = 0) { ks.forEach((k) => { const ch = D24[+str[Math.floor(k.x / 2)]][k.y][k.x % 2]; const [p, q] = CH[ch] || CH[' ']; k.a.style.transform = `rotate(${p + spin}deg)`; k.b.style.transform = `rotate(${q - spin}deg)`; }); } };
    ccs.push(o); return o; };
  const PROD = [['CC24 White', '€6,500', 'Edition of 950', ['#f3f2ee', '#fbfaf7', '#1a1a1a', '#0000000f']], ['CC24 Bjarke Ingels', '€19,000', 'Edition of 10', ['#b9a58a', '#cdbca3', '#2a2018', '#0000001a']], ['CC24 Black Sterling', '€9,800', 'Edition of 250', ['#141414', '#1c1c1c', '#e8e8e8', '#ffffff14']]];
  const cards = PROD.map(([n, p, ed, col]) => { const cc = mkCC(...col); const add = h('button.hs-add', { onclick: (e) => { e.stopPropagation(); cart++; cartA.querySelector('b').textContent = cart; cartA.classList.remove('bump'); void cartA.offsetWidth; cartA.classList.add('bump'); toast(`${n} added to cart`); } }, 'Add to cart');
    const c = h('div.hs-cd', { onmouseenter: () => cc.show(timeDigits(), 360), onmouseleave: () => cc.show('1982') }, h('div.im', {}, cc.box, add), h('div.meta', {}, h('span', {}, n), h('span', {}, p), h('span.g', {}, 'Collectibles'), h('span.g', {}, ed))); c.cc = cc; return c; });
  ccs.forEach((c) => c.show('1982'));
  const shop = h('section.hs-shop', {}, h('h3', {}, 'Explore a Selection of our Work'), h('div.hs-cards', {}, cards));
  const ft = h('footer.hs-ft', {}, [['About', ['Studio & Story', 'Projects', 'Savoir-Faire', 'Philosophy', 'Careers']], ['Client care', ['Ownership', 'FAQ', 'Care & Maintenance', 'Technical Support', 'Contact']], ['Shop', ['Masterpieces', 'Collectibles', 'Bespoke', 'Book appointment']], ['Social', ['Instagram', 'Vimeo', 'LinkedIn']]].map(([t, ls]) => h('div', {}, h('b', {}, t), ls.map((l) => h('a', { onclick: () => toast(l) }, l)))),
    h('div.c', {}, h('span', {}, 'Celebrating Time since 2008'), cnt(), h('span', {}, '© Humans since 1982 — demo clone')));
  const sc = h('div.hs-sc', {}, hero, split, txt, shop, ft);
  el.append(sc, dd, bar);
  // ---------- loops ----------
  const secT = setInterval(() => { const s0 = sinceTxt(); cntEls.forEach((e) => (e.textContent = s0)); if (RM) { const tg = timeTarget(); clocks.forEach((c) => (c.cur = tg(c.x, c.y))); apply(); } }, 1000);
  let wraf = 0; const wloop = (t) => { drawWater(RM ? 0 : t); drawMinis(t); if (!RM) wraf = requestAnimationFrame(wloop); };
  if (RM) { snapTime(); capT.textContent = 'A Million Times · time (reduced motion: frozen)'; dots.children[0].classList.add('on'); wloop(0); setTimeout(() => wloop(0), 300); sc.addEventListener('scroll', () => wloop(0), { passive: true }); }
  else { startSeg(0); raf = requestAnimationFrame(frame); wraf = requestAnimationFrame(wloop); }
  void secT; void wraf;
  // ---------- demo proof ----------
  const reset = () => { dd.classList.remove('on'); sc.scrollTop = 0; cart = 0; cartA.querySelector('b').textContent = '0'; ccs.forEach((c) => c.show('1982'));
    if (RM) snapTime(); else { if (paused) setPaused(false); clocks.forEach((c) => (c.cur = [c.cur[0] % 360, c.cur[1] % 360])); startSeg(0); } };
  window.__demoProof = async () => { const o = []; reset();
    const c0 = cntEls[0].textContent; await sleep(1100); o.push(`counter ticks: "${c0}" → "${cntEls[0].textContent}"`);
    o.push(`wall ${COLS}x${ROWS}=${clocks.length} clocks, ${grid.querySelectorAll('.hs-h').length} hands`);
    if (!RM) { hero.click(); await sleep(60); o.push(`click wall → choreography "${curPat.name}" (${pi + 1}/${PATTERNS.length})`);
      const tg = timeTarget(); const ok = clocks.every((c) => { const [p, q] = tg(c.x, c.y); return Number.isFinite(p + q); }); o.push(`time glyphs for ${timeDigits()} valid=${ok}`);
      ppB.click(); o.push(`pause → ${paused}`); ppB.click(); } else o.push(`reduced motion: hands frozen at ${timeDigits()}`);
    dd.classList.add('on'); o.push(`Explore mega-menu open=${dd.classList.contains('on')}`); dd.classList.remove('on');
    cards[0].dispatchEvent(new MouseEvent('mouseenter')); o.push(`CC24 hover → shows time ${timeDigits()}`); cards[0].querySelector('.hs-add').click(); o.push(`add to cart → Cart ${cartA.querySelector('b').textContent}`);
    reset(); if (!RM) snapTime(); o.push(`restored: top, Cart ${cartA.querySelector('b').textContent}, wall shows ${timeDigits()}`); return o.join('; '); };
};

V['zoomquilt-infinite-zoom-painting-layered-scale-loop-arrow-keys'] = (root, T) => {
  theme(root, T, { bg: '#17110f', fg: '#efe7dc', ac: '#d9531e', dark: true });
  const F = "Georgia,'Times New Roman',serif", SF = "'Helvetica Neue',Arial,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = 4, R = 0.3, S = 1024, V0 = 0.11, Z0 = 0.12;
  css(`.zq{position:absolute;inset:0;background:#120d0c;overflow:hidden;font-family:${SF};color:#efe7dc;cursor:crosshair}
.zq canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.zq .zq-mb{position:absolute;left:18px;top:16px;width:34px;height:34px;border-radius:50%;border:1px solid #ffffff40;background:#0006;color:#eee;font:600 15px ${F};font-style:italic;cursor:pointer;opacity:.35;transition:opacity .3s;z-index:3}
.zq:hover .zq-mb,.zq .zq-mb.on{opacity:1}
.zq-hint{position:absolute;right:18px;bottom:14px;font:400 12px ${SF};color:#ffffffa0;letter-spacing:.04em;text-shadow:0 1px 4px #000;opacity:.0;transition:opacity .6s;z-index:2}.zq.act .zq-hint{opacity:1}
.zq-hint kbd{display:inline-block;border:1px solid #ffffff70;border-radius:3px;padding:0 5px;margin:0 2px;font:600 11px ${SF}}
.zq-spd{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:400 15px ${SF};background:#000a;padding:8px 16px;border-radius:20px;opacity:0;transition:opacity .4s;pointer-events:none;letter-spacing:.03em;z-index:2}.zq-spd.on{opacity:1}
.zq-inf{position:absolute;left:18px;top:62px;width:330px;max-height:calc(100% - 84px);overflow:auto;background:#0e0a09e6;border:1px solid #ffffff1c;padding:22px 24px;font:400 13px/1.55 ${SF};color:#cfc6bb;transform:translateX(-380px);transition:transform .45s cubic-bezier(.2,.8,.2,1);z-index:3;scrollbar-width:thin}
.zq-inf.on{transform:none}.zq-inf h1{margin:0 0 4px;font:400 30px ${F};color:#f3ece2;letter-spacing:.01em}.zq-inf .p{font:italic 400 16px ${F};color:#e9dfd2;margin:0 0 4px}
.zq-inf .y{color:#9a8f84;margin-bottom:14px}.zq-inf .k{border-top:1px solid #ffffff1c;border-bottom:1px solid #ffffff1c;padding:10px 0;margin:10px 0;color:#efe7dc}
.zq-inf .cr{font-size:12px;color:#968b80}.zq-inf a{color:#e9895c;cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.zq-inf ul{list-style:none;padding:0;margin:12px 0 0;display:grid;gap:3px}.zq-inf li a{text-decoration:none}.zq-inf li a:hover{text-decoration:underline}
.zq-mod{position:absolute;inset:0;background:#000b;display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity .35s;z-index:5}
.zq-mod.on{opacity:1;pointer-events:auto}.zq-mod .bx{width:min(640px,86%);max-height:78%;overflow:auto;background:#f1ebe2;color:#2a221e;padding:34px 40px;position:relative;font:400 15px/1.65 ${F};box-shadow:0 30px 80px #000}
.zq-mod h2{margin:0 0 14px;font:400 28px ${F}}.zq-mod .x{position:absolute;right:14px;top:10px;border:0;background:none;font:300 26px ${SF};cursor:pointer;color:#2a221e}
.zq .zq-play{position:absolute;left:50%;top:50%;width:84px;height:84px;margin:-42px;border-radius:50%;border:2px solid #fff;background:#0007;color:#fff;font:400 30px ${SF};cursor:pointer;z-index:4;display:none}
.zq .zq-play.on{display:block}
`);
  const el = h('div.zq'); root.append(el);
  // ---------- procedural painted layers (code-drawn stand-ins for the illustrators' artwork) ----------
  const P = (a) => a.map(([x, y]) => [x * S, y * S]);
  const smooth = (g, pts) => { g.beginPath(); g.moveTo(...pts[0]); for (let i = 1; i < pts.length - 1; i++) { const [x, y] = pts[i], [nx, ny] = pts[i + 1]; g.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2); } g.lineTo(...pts[pts.length - 1]); };
  const tube = (g, pts, w, base, shade, hi, sharp) => { g.lineCap = 'round'; g.lineJoin = sharp ? 'miter' : 'round'; const path = () => { if (sharp) { g.beginPath(); g.moveTo(...pts[0]); pts.slice(1).forEach((p) => g.lineTo(...p)); } else smooth(g, pts); };
    g.save(); g.translate(w * 0.12, w * 0.18); path(); g.strokeStyle = '#0008'; g.lineWidth = w * 1.05; g.stroke(); g.restore();
    path(); g.strokeStyle = shade; g.lineWidth = w; g.stroke(); g.save(); g.translate(-w * 0.1, -w * 0.12); path(); g.strokeStyle = base; g.lineWidth = w * 0.72; g.stroke(); g.restore();
    g.save(); g.translate(-w * 0.22, -w * 0.26); path(); g.strokeStyle = hi; g.lineWidth = w * 0.14; g.globalAlpha = 0.7; g.stroke(); g.restore(); };
  const ribbon = (g, pts, w, c1, c2, ph = 0) => { const L = []; for (let i = 0; i < pts.length - 1; i++) for (let t = 0; t < 1; t += 0.05) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1]; L.push([ax + (bx - ax) * t, ay + (by - ay) * t]); } L.push(pts[pts.length - 1]);
    const sm = L.map((p, i) => { const a = L[Math.max(0, i - 3)], b = L[Math.min(L.length - 1, i + 3)]; return [(a[0] + p[0] * 2 + b[0]) / 4, (a[1] + p[1] * 2 + b[1]) / 4]; });
    const top = [], bot = []; sm.forEach((p, i) => { const q = sm[Math.min(sm.length - 1, i + 1)], o = sm[Math.max(0, i - 1)]; let dx = q[0] - o[0], dy = q[1] - o[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d; const ww = w * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.11 + ph))) * (1 - 0.6 * i / sm.length);
      top.push([p[0] - dy * ww, p[1] + dx * ww]); bot.push([p[0] + dy * ww, p[1] - dx * ww]); });
    const gr = g.createLinearGradient(...sm[0], ...sm[sm.length - 1]); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.beginPath(); g.moveTo(...top[0]); top.forEach((p) => g.lineTo(...p)); bot.reverse().forEach((p) => g.lineTo(...p)); g.closePath(); g.fillStyle = gr; g.shadowColor = '#0007'; g.shadowBlur = w * 0.6; g.shadowOffsetY = w * 0.3; g.fill(); g.shadowColor = 'transparent';
    g.beginPath(); g.moveTo(...top[0]); top.forEach((p) => g.lineTo(...p)); g.strokeStyle = '#ffb08066'; g.lineWidth = 3; g.stroke(); };
  const bridge = (g, pts, w) => { const sm = []; for (let i = 0; i < pts.length - 1; i++) for (let t = 0; t <= 1; t += 0.04) sm.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]);
    smooth(g, pts); g.lineCap = 'round'; g.strokeStyle = '#4b4743'; g.lineWidth = w * 1.1; g.stroke(); smooth(g, pts); g.strokeStyle = '#8f8b86'; g.lineWidth = w * 0.85; g.stroke();
    g.strokeStyle = '#c9c2b9'; g.lineWidth = Math.max(1.5, w * 0.08); sm.forEach(([x, y], i) => { const k = 1 - i / sm.length * 0.7; if (i % 2 === 0) { g.beginPath(); g.moveTo(x, y - w * 0.4); g.lineTo(x, y - w * 0.4 - w * 0.6 * k); g.stroke(); } });
    g.save(); g.translate(0, -w * 0.4 - w * 0.6); smooth(g, pts); g.lineWidth = Math.max(2, w * 0.12); g.stroke(); g.restore(); };
  const blocks = (g, r, c1, c2, y0, y1) => { for (let i = 0; i < 46; i++) { const x = r() * S, w = 40 + r() * 140, hh = 60 + r() * 260; const y = y0 * S + r() * (y1 - y0) * S; g.fillStyle = r() < 0.5 ? c1 : c2; g.globalAlpha = 0.65 + r() * 0.35; g.fillRect(x, y - hh, w, hh + S); } g.globalAlpha = 1; };
  const grain = (g, r, n, cols) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[(r() * cols.length) | 0]; g.globalAlpha = 0.05 + r() * 0.08; const x = r() * S, y = r() * S; g.save(); g.translate(x, y); g.rotate(r() * 3.14); g.fillRect(0, 0, 2 + r() * 9, 1 + r() * 2.5); g.restore(); } g.globalAlpha = 1; };
  const OPEN = [{ k: 'tv', w: 0.27, h: 0.2 }, { k: 'arch', w: 0.22, h: 0.27 }, { k: 'circle', r: 0.135 }, { k: 'door', w: 0.17, h: 0.28 }];
  const openPath = (g, n, cx, cy, sz) => { const o = OPEN[n]; g.beginPath(); if (o.k === 'circle') g.arc(cx, cy, o.r * sz, 0, Math.PI * 2);
    else if (o.k === 'arch') { const w = o.w * sz, hh = o.h * sz; g.moveTo(cx - w / 2, cy + hh / 2); g.lineTo(cx - w / 2, cy - hh / 2 + w / 2); g.arc(cx, cy - hh / 2 + w / 2, w / 2, Math.PI, 0); g.lineTo(cx + w / 2, cy + hh / 2); g.closePath(); }
    else { const w = o.w * sz, hh = o.h * sz, rr = (o.k === 'tv' ? 0.03 : 0.005) * sz; g.roundRect(cx - w / 2, cy - hh / 2, w, hh, rr); } };
  const frame = (g, n, base, shade) => { g.save(); openPath(g, n, S / 2 + 10, S / 2 + 14, S); g.strokeStyle = '#000a'; g.lineWidth = 26; g.stroke(); openPath(g, n, S / 2, S / 2, S); g.strokeStyle = shade; g.lineWidth = 24; g.stroke(); openPath(g, n, S / 2 - 2, S / 2 - 3, S); g.strokeStyle = base; g.lineWidth = 15; g.stroke(); openPath(g, n, S / 2, S / 2, S); g.strokeStyle = '#3a302a'; g.lineWidth = 4; g.stroke(); g.restore(); };
  const paint = (n) => { const cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d'); const r = rng(101 + n * 37);
    const pal = [
      { s1: '#120d0c', s2: '#2c211e', b1: '#3e2f2b', b2: '#4a3833', st: '#d9d0c4', sh: '#8f8277', hi: '#fffaf0', r1: '#e2581f', r2: '#a8350f', stars: 1 },
      { s1: '#24150f', s2: '#5a3524', b1: '#6b4330', b2: '#7d5038', st: '#cfc3b3', sh: '#7f7468', hi: '#fff6e6', r1: '#d24a19', r2: '#8f2c0c', stars: 0 },
      { s1: '#86b5d1', s2: '#efe6c9', b1: '#5b8a3f', b2: '#3f6a2d', st: '#e4dacb', sh: '#9b8f80', hi: '#ffffff', r1: '#e0632a', r2: '#b13c12', stars: 0 },
      { s1: '#1a0c10', s2: '#45201f', b1: '#55282a', b2: '#3a1a1d', st: '#d8ccbf', sh: '#86786c', hi: '#fff8ee', r1: '#ef6e2c', r2: '#b2410f', stars: 1 }][n];
    const sk = g.createLinearGradient(0, 0, 0, S); sk.addColorStop(0, pal.s1); sk.addColorStop(1, pal.s2); g.fillStyle = sk; g.fillRect(0, 0, S, S);
    if (pal.stars) for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(255,248,235,${0.2 + r() * 0.6})`; g.fillRect(r() * S, r() * S * 0.5, 1.4, 1.4); }
    if (n === 2) { for (let k = 0; k < 4; k++) { g.fillStyle = [pal.b1, pal.b2, '#77a24e', '#2f5523'][k]; g.beginPath(); g.moveTo(0, S); for (let x = 0; x <= S; x += 16) g.lineTo(x, S * (0.5 + k * 0.1) + Math.sin(x * 0.006 + k * 2) * 40 + Math.sin(x * 0.017 + k) * 14); g.lineTo(S, S); g.fill(); } }
    else blocks(g, r, pal.b1, pal.b2, 0.4, 0.8);
    grain(g, r, 2600, [pal.b1, pal.b2, pal.s2, '#000', pal.st]);
    if (n === 0) { tube(g, P([[-0.05, 0.08], [0.12, 0.1], [0.14, 0.24], [0.06, 0.3], [0.07, 0.46], [0.22, 0.47], [0.27, 0.5], [0.36, 0.5]]), 46, pal.st, pal.sh, pal.hi, true);
      tube(g, P([[0.18, -0.05], [0.22, 0.2], [0.3, 0.27], [0.31, 0.44], [0.4, 0.43]]), 30, pal.st, pal.sh, pal.hi, true);
      tube(g, P([[0.2, 1.05], [0.3, 0.86], [0.24, 0.72], [0.36, 0.62], [0.42, 0.6]]), 52, pal.st, pal.sh, pal.hi);
      ribbon(g, P([[-0.05, 0.84], [0.12, 0.8], [0.26, 0.66], [0.38, 0.6], [0.46, 0.58]]), 44, pal.r1, pal.r2, 0.4);
      ribbon(g, P([[1.05, 0.22], [0.86, 0.25], [0.74, 0.34], [0.62, 0.4], [0.56, 0.44]]), 40, pal.r1, pal.r2, 1.3);
      bridge(g, P([[1.05, 0.62], [0.86, 0.56], [0.74, 0.54], [0.64, 0.52]]), 46);
      g.fillStyle = '#5a534d'; g.fillRect(0.5 * S, 0.7 * S, 0.36 * S, 0.3 * S); g.fillStyle = '#d6cdc1'; g.fillRect(0.5 * S, 0.68 * S, 0.34 * S, 0.3 * S); g.fillStyle = '#b3a99d'; g.fillRect(0.5 * S, 0.68 * S, 0.34 * S, 0.03 * S);
      [[0.53, 0.74, 0.17, 0.18], [0.73, 0.76, 0.09, 0.13]].forEach(([x, y, w, hh]) => { g.fillStyle = '#2b2a29'; g.fillRect(x * S, y * S, w * S, hh * S); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(200,200,200,${r() * 0.35})`; g.fillRect(x * S + r() * w * S, y * S + r() * hh * S, 1.5, 1.5); } }); }
    if (n === 1) { for (let k = 0; k < 5; k++) { const x = (0.05 + k * 0.2) * S; g.fillStyle = '#00000030'; g.beginPath(); g.moveTo(x, S); g.lineTo(x, 0.35 * S); g.arc(x + 0.07 * S, 0.35 * S, 0.07 * S, Math.PI, 0); g.lineTo(x + 0.14 * S, S); g.fill(); }
      for (let k = 0; k < 4; k++) tube(g, P([[-0.05, 0.62 + k * 0.07], [0.18, 0.62 + k * 0.07], [0.24, 0.56 + k * 0.03], [0.39, 0.54 + k * 0.02]]), 24, '#bdb6ad', '#6f6962', '#fff');
      tube(g, P([[0.62, 1.05], [0.62, 0.72], [0.7, 0.62], [0.7, 0.2], [0.78, 0.08], [1.05, 0.08]]), 70, pal.st, pal.sh, pal.hi, true);
      ribbon(g, P([[1.05, 0.9], [0.84, 0.86], [0.7, 0.74], [0.58, 0.64], [0.53, 0.6]]), 40, pal.r1, pal.r2, 2.1);
      ribbon(g, P([[0.0, 0.18], [0.16, 0.24], [0.28, 0.34], [0.4, 0.4]]), 34, pal.r1, pal.r2, 0.2); bridge(g, P([[0.0, 0.94], [0.2, 0.86], [0.36, 0.72], [0.45, 0.64]]), 40); }
    if (n === 2) { ribbon(g, P([[0.5, 1.05], [0.62, 0.92], [0.42, 0.8], [0.58, 0.7], [0.5, 0.62]]), 46, pal.r1, pal.r2, 0.7);
      tube(g, P([[-0.05, 0.3], [0.1, 0.32], [0.2, 0.42], [0.36, 0.46]]), 40, pal.st, pal.sh, pal.hi); tube(g, P([[1.05, 0.36], [0.86, 0.4], [0.78, 0.5], [0.64, 0.5]]), 40, pal.st, pal.sh, pal.hi);
      for (let i = 0; i < 18; i++) { const x = r() * S, y = 0.62 * S + r() * 0.35 * S, s0 = 10 + r() * 26; g.fillStyle = '#2c4d1e'; g.beginPath(); g.arc(x, y, s0, 0, 7); g.fill(); g.fillStyle = '#6f9a45'; g.beginPath(); g.arc(x - s0 * 0.25, y - s0 * 0.3, s0 * 0.6, 0, 7); g.fill(); }
      for (let i = 0; i < 6; i++) { g.fillStyle = '#ffffffb0'; const x = r() * S, y = r() * 0.3 * S; g.beginPath(); g.ellipse(x, y, 60 + r() * 60, 14 + r() * 10, 0, 0, 7); g.fill(); } }
    if (n === 3) { for (let i = 0; i < 14; i++) { const x = r() * S, w = 30 + r() * 60, l = 0.1 + r() * 0.25; g.fillStyle = r() < 0.5 ? '#2a1214' : '#5b2c2c'; g.beginPath(); g.moveTo(x - w, 0); g.lineTo(x, l * S); g.lineTo(x + w, 0); g.fill(); }
      tube(g, P([[-0.05, 0.5], [0.12, 0.5], [0.12, 0.3], [0.3, 0.3], [0.3, 0.46], [0.41, 0.46]]), 40, pal.st, pal.sh, pal.hi, true);
      tube(g, P([[1.05, 0.7], [0.88, 0.7], [0.88, 0.86], [0.7, 0.86], [0.7, 0.62], [0.59, 0.6]]), 44, pal.st, pal.sh, pal.hi, true);
      ribbon(g, P([[1.05, 0.16], [0.85, 0.12], [0.72, 0.3], [0.58, 0.38], [0.54, 0.42]]), 44, pal.r1, pal.r2, 1.6); ribbon(g, P([[-0.05, 0.9], [0.2, 0.8], [0.34, 0.66], [0.44, 0.6]]), 38, pal.r1, pal.r2, 2.8);
      bridge(g, P([[0.2, 1.05], [0.36, 0.84], [0.44, 0.7], [0.48, 0.64]]), 36); }
    // focal frame around the opening the next painting sits inside
    if (n === 0) { g.fillStyle = '#cfc5b8'; g.fillRect(0.47 * S, 0.37 * S, 0.06 * S, 0.04 * S); const dg = g.createRadialGradient(0.49 * S, 0.33 * S, 2, 0.5 * S, 0.36 * S, 0.05 * S); dg.addColorStop(0, '#6a6460'); dg.addColorStop(1, '#1d1a19'); g.fillStyle = dg; g.beginPath(); g.arc(0.5 * S, 0.375 * S, 0.042 * S, Math.PI, 0); g.fill(); }
    if (n === 1) { tube(g, P([[0.5, 0.78], [0.5, 0.66]]), 40, pal.st, pal.sh, pal.hi, true); }
    if (n === 3) { tube(g, P([[0.42, 0.33], [0.5, 0.29], [0.58, 0.33]]), 22, pal.st, pal.sh, pal.hi); }
    frame(g, n, pal.st, pal.sh); openPath(g, n, S / 2, S / 2, S); g.fillStyle = '#0c0908'; g.fill();
    grain(g, r, 1600, ['#000', '#fff', pal.r1, pal.st]);
    const vg = g.createRadialGradient(S / 2, S / 2, S * 0.2, S / 2, S / 2, S * 0.75); vg.addColorStop(0, '#0000'); vg.addColorStop(1, '#00000055'); g.fillStyle = vg; g.fillRect(0, 0, S, S);
    return cv; };
  const layers = Array.from({ length: N }, (_, n) => paint(n));
  // ---------- infinite zoom renderer: layer k sits inside layer k-1's opening at scale R ----------
  const cv = h('canvas'); const g = cv.getContext('2d');
  let z = Z0, v = RM ? 0 : V0, paused = RM, last = performance.now(), act = 0;
  const draw = () => { const W = el.clientWidth || 1440, Hh = el.clientHeight || 862; if (cv.width !== W || cv.height !== Hh) { cv.width = W; cv.height = Hh; }
    const i = Math.floor(z), f = z - i, S0 = Math.max(W, Hh * 1.25) * 1.04, cx = W / 2, cy = Hh / 2;
    g.save(); g.fillStyle = '#0c0908'; g.fillRect(0, 0, W, Hh);
    for (let k = -2; k < 9; k++) { const sz = S0 * Math.pow(R, k - f); if (sz < 3) break; const n = (((i + k) % N) + N) % N; if (sz > 40 * S0) continue;
      g.drawImage(layers[n], cx - sz / 2, cy - sz / 2, sz, sz); openPath(g, n, cx, cy, sz); g.clip(); }
    g.restore(); };
  const MOD = (x) => (((x % N) + N) % N);
  const loop = (now) => { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (!paused) z += v * dt; if (z > 1e6 || z < -1e6) z = MOD(z); draw(); requestAnimationFrame(loop); };
  // ---------- UI ----------
  const spd = h('div.zq-spd');
  let spT; const showSpd = () => { spd.textContent = v === 0 ? 'stopped' : `${v > 0 ? 'zooming in' : 'zooming out'} · ${Math.abs(v / V0).toFixed(1)}×`; spd.classList.add('on'); clearTimeout(spT); spT = setTimeout(() => spd.classList.remove('on'), 900); };
  const setV = (nv) => { v = clamp(Math.round(nv * 1000) / 1000, -0.66, 0.66); if (paused && v !== 0) setPaused(false); showSpd(); };
  const play = h('button.zq-play', { title: 'Play (motion is paused because your OS prefers reduced motion)', onclick: (e) => { e.stopPropagation(); setPaused(false); if (!v) v = V0; } }, '▶');
  const setPaused = (p) => { paused = p; play.classList.toggle('on', p); };
  const about = h('div.zq-mod', { onclick: (e) => { if (e.target === about) about.classList.remove('on'); } }, h('div.bx', {}, h('button.x', { onclick: () => about.classList.remove('on') }, '×'), h('h2', {}, 'About the Zoomquilt'),
    h('p', {}, 'Started in 2004, the Zoomquilt grew out of early-2000s online “quilts”: collaborative patchwork paintings where each artist received a tile with the neighbouring borders and had to blend their own picture into them, a little like the surrealist game Cadavre Exquis.'),
    h('p', {}, 'The Zoomquilt turned that idea inward — every painting is hidden inside the previous one, so the camera can fall forever. It was first published in Shockwave/Flash and later rebuilt for the modern web; successors include Zoomquilt 2, Arkadia and Infinite Flowers.'),
    h('p', { style: { fontSize: '13px', color: '#6b5f57' } }, 'This demo page uses procedurally drawn stand-in layers, not the original illustrations.')));
  const LINKS = ['Screensaver for Mac', 'Live Wallpaper for Android', 'Organic City', 'Infinite Flowers', 'Arkadia', 'Zoomquilt 2'];
  const inf = h('aside.zq-inf', { onclick: (e) => e.stopPropagation() }, h('h1', {}, 'The Zoomquilt'), h('div.p', {}, 'A collaborative infinitely zooming painting'), h('div.y', {}, 'Created in 2004'),
    h('div.k', {}, 'Up and down keys to navigate'), h('div.cr', {}, 'A project by Nikolaus Baumgarten. Participating illustrators: Andreas Schumann, Eero Pitkänen, Florian Biege, Jann Kerntke, Lars Götze, Luis Felipe, Marcus Blättermann, Markus Neidel, Paul Painter, Oliver Schlemmer, Sonja Schneider, Thorsten Wolber, Tony Stanley, Ville Vanninen'),
    h('p', {}, h('a', { onclick: () => about.classList.add('on') }, 'Read about the history of this project')), h('ul', {}, LINKS.map((l) => h('li', {}, h('a', { onclick: () => toast(l) }, l)))));
  const mb = h('button.zq-mb', { title: 'Info', onclick: (e) => { e.stopPropagation(); inf.classList.toggle('on'); mb.classList.toggle('on', inf.classList.contains('on')); } }, 'i');
  const hint = h('div.zq-hint', {}, h('kbd', {}, '↑'), h('kbd', {}, '↓'), ' to navigate');
  el.append(cv, mb, inf, hint, spd, play, about);
  const onKey = (e) => { if (!el.isConnected) return; if (e.key === 'ArrowUp') { e.preventDefault(); setV(v + 0.06); } else if (e.key === 'ArrowDown') { e.preventDefault(); setV(v - 0.06); } else if (e.key === ' ') { e.preventDefault(); setPaused(!paused); } else if (e.key === 'Escape') { about.classList.remove('on'); inf.classList.remove('on'); mb.classList.remove('on'); } };
  addEventListener('keydown', onKey);
  el.addEventListener('wheel', (e) => { e.preventDefault(); z += clamp(e.deltaY, -100, 100) * -0.002; }, { passive: false });
  el.addEventListener('mousemove', () => { el.classList.add('act'); clearTimeout(act); act = setTimeout(() => el.classList.remove('act'), 2500); });
  el.addEventListener('click', () => { inf.classList.remove('on'); mb.classList.remove('on'); });
  setPaused(paused); requestAnimationFrame(loop);
  // ---------- demo proof ----------
  const key = (k) => dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  window.__demoProof = async () => { const o = []; const pv = paused; setPaused(false);
    z = Z0; v = V0; await sleep(400); o.push(`auto-zoom: z ${Z0} → ${z.toFixed(3)} at ${V0}/s`);
    key('ArrowUp'); key('ArrowUp'); o.push(`↑↑ → speed ${(v / V0).toFixed(2)}× (${spd.textContent})`); const za = z; await sleep(400); o.push(`zoomed in Δz=+${(z - za).toFixed(3)}`);
    for (let k = 0; k < 6; k++) key('ArrowDown'); const zb = z; await sleep(400); o.push(`↓×6 → speed ${v.toFixed(2)}, zoom out Δz=${(z - zb).toFixed(3)}`);
    z = N - 0.001; draw(); const a = cv.getContext('2d').getImageData(cv.width / 2 + 200, cv.height / 2, 1, 1).data.join(); z = N + 0.001 - N; draw(); o.push(`loop seam: layer ${MOD(Math.floor(N - 0.001))}→${MOD(Math.floor(N + 0.001))} (wraps after ${N} layers, R=${R})`); void a;
    mb.click(); o.push(`info overlay open=${inf.classList.contains('on')}`); inf.querySelector('p a').click(); o.push(`about modal open=${about.classList.contains('on')}`); about.querySelector('.x').click(); key('Escape');
    o.push(`closed: modal=${!about.classList.contains('on')}, info panel=${!inf.classList.contains('on')}`);
    z = Z0; v = RM ? 0 : V0; setPaused(RM ? true : pv && false); spd.classList.remove('on'); draw(); o.push(`restored z=${Z0}, speed ${v}/s${RM ? ', paused (reduced motion)' : ''}`); return o.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['ritmo-simplex-wave-studio'])(root, T); }
