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

export function mount(root, variant, opts, T) { (V[variant] || V['ritmo-simplex-wave-studio'])(root, T); }
