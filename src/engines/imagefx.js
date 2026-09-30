import { h, s, css, drag, localPos, clamp, copy, toast, sleep, rng, hexToRgb, noise2, gesture } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle, codebox } from '../kit.js';
export function scene(w, hh, kind = 'land', seed = 3) {
  const c = document.createElement('canvas'); c.width = w; c.height = hh; const g = c.getContext('2d'); const N = noise2(seed); const R = rng(seed);
  if (kind === 'earth') { g.fillStyle = '#000'; g.fillRect(0, 0, w, hh); const r = Math.min(w, hh) * 0.45; const img = g.getImageData(0, 0, w, hh); for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const dx = (x - w / 2) / r, dy = (y - hh / 2) / r; const d = dx * dx + dy * dy; if (d > 1) continue; const z = Math.sqrt(1 - d); const n = N(dx * 2 + 3, dy * 2 + z); const cl = N(dx * 5 + 9, dy * 5); const land = n > 0.52; let col = land ? [70 + n * 90, 120 + n * 60, 50] : [20, 60 + n * 60, 150 + n * 80]; if (cl > 0.62) col = [235, 240, 245]; const sh = 0.35 + 0.65 * z; const i = (y * w + x) * 4; img.data[i] = col[0] * sh; img.data[i + 1] = col[1] * sh; img.data[i + 2] = col[2] * sh; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); return c; }
  const sky = g.createLinearGradient(0, 0, 0, hh); const pal = kind === 'sunset' ? ['#ff7e5f', '#feb47b', '#ffd194'] : kind === 'portrait' ? ['#dfe7f2', '#c8d6e8', '#b0c3dc'] : ['#4facfe', '#8fd3fe', '#e0f7ff'];
  sky.addColorStop(0, pal[0]); sky.addColorStop(0.6, pal[1]); sky.addColorStop(1, pal[2]); g.fillStyle = sky; g.fillRect(0, 0, w, hh);
  if (kind === 'portrait') { g.fillStyle = '#e7b995'; g.beginPath(); g.ellipse(w / 2, hh * 0.45, w * 0.16, hh * 0.22, 0, 0, 7); g.fill(); g.fillStyle = '#3b2a20'; g.beginPath(); g.ellipse(w / 2, hh * 0.3, w * 0.19, hh * 0.14, 0, Math.PI, 0); g.fill(); g.fillStyle = '#2c5364'; g.beginPath(); g.ellipse(w / 2, hh * 1.02, w * 0.33, hh * 0.3, 0, Math.PI, 0); g.fill(); g.fillStyle = '#222'; [[-0.06, 0.44], [0.06, 0.44]].forEach(([dx, dy]) => { g.beginPath(); g.arc(w / 2 + dx * w, hh * dy, w * 0.012, 0, 7); g.fill(); }); g.strokeStyle = '#9b4b3a'; g.lineWidth = w * 0.008; g.beginPath(); g.arc(w / 2, hh * 0.52, w * 0.04, 0.2, Math.PI - 0.2); g.stroke(); return c; }
  g.fillStyle = kind === 'sunset' ? '#fff3c4' : '#fffbe6'; g.beginPath(); g.arc(w * 0.72, hh * 0.3, hh * 0.09, 0, 7); g.fill();
  [['#5b6d8f', 0.55, 0.5], ['#3e4f6e', 0.65, 0.8], ['#26344d', 0.78, 1.3]].forEach(([col, base, f], k) => { g.fillStyle = kind === 'sunset' ? ['#a24d6b', '#6d3159', '#3b1f3f'][k] : col; g.beginPath(); g.moveTo(0, hh); for (let x = 0; x <= w; x += 4) g.lineTo(x, hh * base - N(x / w * 3 * f + k * 5, k) * hh * 0.25); g.lineTo(w, hh); g.fill(); });
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(20,40,30,${0.5 + R() * 0.5})`; const x = R() * w, y = hh * (0.82 + R() * 0.18); g.beginPath(); g.moveTo(x, y - 30 - R() * 30); g.lineTo(x - 10, y); g.lineTo(x + 10, y); g.fill(); }
  return c;
}
const V = {};
V['duotone-photo-studio'] = (root, T) => {
  theme(root, T, { bg: '#0d1b3e', fg: '#fff', ac: '#3858ff', dark: true });
  let hi = '#00d2ff', sh = '#1d0f8a';
  const srcs = ['land', 'sunset', 'portrait', 'earth', 'land', 'sunset'].map((k, i) => scene(420, 300, k, i + 2));
  const gridEl = h('div', { style: { position: 'absolute', left: '300px', right: 0, top: 0, bottom: 0, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridAutoRows: '50%', gap: '0' } });
  const cvs = srcs.map(() => { const c = document.createElement('canvas'); c.width = 420; c.height = 300; Object.assign(c.style, { width: '100%', height: '100%', objectFit: 'cover' }); gridEl.append(c); return c; });
  const draw = () => { const A = hexToRgb(sh), B = hexToRgb(hi); srcs.forEach((src, k) => { const d = src.getContext('2d').getImageData(0, 0, 420, 300); for (let i = 0; i < d.data.length; i += 4) { const l = (0.3 * d.data[i] + 0.59 * d.data[i + 1] + 0.11 * d.data[i + 2]) / 255; for (let c = 0; c < 3; c++) d.data[i + c] = A[c] + (B[c] - A[c]) * l; } cvs[k].getContext('2d').putImageData(d, 0, 0); }); };
  const circ = (get, set) => h('label', { style: { width: '64px', height: '64px', borderRadius: '50%', background: get(), display: 'grid', placeItems: 'center', position: 'relative', cursor: 'pointer', border: '3px solid #fff3' } }, h('input', { type: 'color', value: get(), style: { opacity: 0, position: 'absolute', inset: 0 }, oninput: (e) => { set(e.target.value); e.target.parentNode.style.background = e.target.value; draw(); } }));
  const PRE = [['#00d2ff', '#1d0f8a'], ['#ffd400', '#e0006a'], ['#ff8a00', '#2b0045'], ['#b4ff9f', '#004e64'], ['#ffffff', '#111111']];
  root.append(h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '300px', background: '#0d1b3e', padding: '30px', display: 'grid', gap: '18px', alignContent: 'start' } }, h('div', { style: { fontSize: '26px', fontWeight: 800 } }, 'Duotone-ish'), h('div', { style: { opacity: .7, fontSize: '13px' } }, 'Pick highlight & shadow colors to remap every photo.'), h('div.k-row', { style: { gap: '18px' } }, circ(() => hi, (v) => (hi = v)), circ(() => sh, (v) => (sh = v))), h('div.k-row', {}, 'Highlights', h('span', { style: { flex: 1 } }), 'Shadows'), h('div.k-h', {}, 'Presets'), h('div.k-row', {}, PRE.map(([a, b]) => h('button', { onclick: () => { hi = a; sh = b; draw(); }, style: { width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #fff4', background: `linear-gradient(135deg,${a} 50%,${b} 50%)` } }))), btn('⬇ Download', () => toast('duotone.jpg saved'), 'pri'), btn('Upload photo', () => toast('Use sample photos in demo'))), gridEl);
  draw();
  window.__demoProof = async () => { hi = '#3fd0ff'; sh = '#1a0e8f'; draw(); return 'duotone remap applied to 6 photos'; };
};
V['dither-param-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#fff', ac: '#e53935', dark: false });
  const src = scene(320, 320, 'earth', 5); const out = document.createElement('canvas'); out.width = 320; out.height = 320;
  const PAL = { 'Game Boy': ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'], 'B/W': ['#000000', '#ffffff'], 'Sepia': ['#2b1b0e', '#704214', '#c08552', '#f3e0c5'], 'CGA': ['#000000', '#55ffff', '#ff55ff', '#ffffff'], 'Terracotta': ['#3d1f14', '#a8512f', '#e8a07a', '#fbe3d2'] };
  const P = { algo: 'Floyd–Steinberg', pal: 'Terracotta', th: 0, scale: 2 };
  const near = (r, g, b, pal) => { let best = pal[0], bd = 1e9; for (const p of pal) { const d = (r - p[0]) ** 2 + (g - p[1]) ** 2 + (b - p[2]) ** 2; if (d < bd) { bd = d; best = p; } } return best; };
  const B4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const draw = () => { const pal = PAL[P.pal].map(hexToRgb); const W = 320 / P.scale | 0; const t = document.createElement('canvas'); t.width = W; t.height = W; const tg = t.getContext('2d'); tg.drawImage(src, 0, 0, W, W); const d = tg.getImageData(0, 0, W, W); const a = Float32Array.from(d.data);
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; let [r, g, b] = [a[i] + P.th, a[i + 1] + P.th, a[i + 2] + P.th]; if (P.algo === 'Bayer 4×4') { const o = (B4[y % 4][x % 4] / 16 - 0.5) * 64; r += o; g += o; b += o; } const n = near(r, g, b, pal); d.data[i] = n[0]; d.data[i + 1] = n[1]; d.data[i + 2] = n[2];
      if (P.algo === 'Floyd–Steinberg') { const e = [r - n[0], g - n[1], b - n[2]]; [[1, 0, 7], [-1, 1, 3], [0, 1, 5], [1, 1, 1]].forEach(([dx, dy, w]) => { const j = ((y + dy) * W + x + dx) * 4; if (x + dx >= 0 && x + dx < W && y + dy < W) for (let c = 0; c < 3; c++) a[j + c] += (e[c] * w) / 16; }); } }
    tg.putImageData(d, 0, 0); const og = out.getContext('2d'); og.imageSmoothingEnabled = false; og.clearRect(0, 0, 320, 320); og.drawImage(t, 0, 0, 320, 320); };
  [src, out].forEach((c) => Object.assign(c.style, { width: '320px', height: '320px', borderRadius: '50%' }));
  root.append(h('div', { style: { position: 'absolute', top: '10px', right: '10px', width: '90px', height: '90px', borderRadius: '50%', background: '#e53935', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', transform: 'rotate(12deg)' } }, 'Dither v2!'), h('div', { style: { textAlign: 'center', paddingTop: '20px' } }, h('div', { style: { font: '800 38px Georgia,serif', color: '#e53935' } }, 'Dither it!'), h('div', { style: { margin: '10px 0 20px' } }, 'An image dithering tool'), h('div.k-row', { style: { justifyContent: 'center', gap: '30px' } }, src, h('span', { style: { fontSize: '30px', color: '#e53935' } }, '➜'), out)),
    h('div.k-row', { style: { justifyContent: 'center', marginTop: '20px', gap: '14px', flexWrap: 'wrap' } }, select(['Floyd–Steinberg', 'Bayer 4×4', 'Threshold'], P.algo, (v) => { P.algo = v; draw(); }), select(Object.keys(PAL), P.pal, (v) => { P.pal = v; draw(); }), h('div', { style: { width: '160px' } }, slider('Threshold', -80, 80, 0, 1, (v) => { P.th = v; draw(); })), h('div', { style: { width: '160px' } }, slider('Pixel scale', 1, 6, 2, 1, (v) => { P.scale = v; draw(); })), btn('Select Images', () => toast('Demo uses sample image')), btn('⬇ Export PNG', () => { const a = h('a', { download: 'dithered.png', href: out.toDataURL() }); a.click(); }, 'pri')));
  draw();
  window.__demoProof = async () => { P.algo = 'Floyd–Steinberg'; P.pal = 'Terracotta'; draw(); return 'FS dither with terracotta palette'; };
};
V['photo-grout-mosaic-composer'] = (root, T) => {
  theme(root, T, { bg: '#f4efe6', fg: '#2a2520', panel: '#fbf8f2', ac: '#b3542e', dark: false });
  const src = scene(480, 360, 'sunset', 4); const out = document.createElement('canvas'); out.width = 480; out.height = 360; Object.assign(out.style, { width: '480px', height: '360px', borderRadius: '4px', boxShadow: '0 10px 30px #0002' });
  const P = { shape: 'square', size: 16, grout: 3, gcol: '#efe8dc', mode: 'average' };
  const draw = () => { const g = out.getContext('2d'); g.fillStyle = P.gcol; g.fillRect(0, 0, 480, 360); const d = src.getContext('2d').getImageData(0, 0, 480, 360).data; const S = P.size;
    for (let y = 0; y < 360; y += S) for (let x = 0; x < 480; x += S) { let r = 0, gg = 0, b = 0, n = 0; if (P.mode === 'average') { for (let yy = y; yy < Math.min(y + S, 360); yy += 2) for (let xx = x; xx < Math.min(x + S, 480); xx += 2) { const i = (yy * 480 + xx) * 4; r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++; } r /= n; gg /= n; b /= n; } else { const i = ((y + S / 2 | 0) * 480 + (x + S / 2 | 0)) * 4; r = d[i]; gg = d[i + 1]; b = d[i + 2]; }
      g.fillStyle = `rgb(${r},${gg},${b})`; const gr = P.grout / 2; if (P.shape === 'circle') { g.beginPath(); g.arc(x + S / 2, y + S / 2, S / 2 - gr, 0, 7); g.fill(); } else if (P.shape === 'diamond') { g.beginPath(); g.moveTo(x + S / 2, y + gr); g.lineTo(x + S - gr, y + S / 2); g.lineTo(x + S / 2, y + S - gr); g.lineTo(x + gr, y + S / 2); g.fill(); } else g.fillRect(x + gr, y + gr, S - P.grout, S - P.grout); } };
  root.append(h('div.k-row', { style: { height: '50px', padding: '0 40px', borderBottom: '1px solid #e2dacd', gap: '22px', fontSize: '13px' } }, h('i', { style: { fontFamily: 'Georgia,serif', fontSize: '18px' } }, 'collage.recipes-ish'), h('span', { style: { flex: 1 } }), 'Recipes', 'Collections', 'Tools', 'About'),
    h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 520px', gap: '40px', padding: '40px 60px' } }, h('div', {}, h('div', { style: { font: '400 58px/1 Georgia,serif', letterSpacing: '-.02em' } }, 'Photo as tile pattern.'), h('p', { style: { lineHeight: 1.6, maxWidth: '460px', opacity: .8 } }, 'Squares, rounded, circle or diamond tiles, laid in grout. Pick tile size and grout width; choose average or dominant color per cell.'), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '460px' } }, seg(['square', 'circle', 'diamond'], P.shape, (v) => { P.shape = v; draw(); }), seg(['average', 'dominant'], P.mode, (v) => { P.mode = v; draw(); }), slider('Tile size', 6, 48, P.size, 1, (v) => { P.size = v; draw(); }), slider('Grout', 0, 8, P.grout, 1, (v) => { P.grout = v; draw(); }), h('label.k-row', {}, 'Grout color', h('input', { type: 'color', value: P.gcol, oninput: (e) => { P.gcol = e.target.value; draw(); } })), btn('⬇ Download PNG', () => { const a = h('a', { download: 'mosaic.png', href: out.toDataURL() }); a.click(); }, 'pri')), h('div', { style: { marginTop: '20px', border: '2px dashed #cbbfae', padding: '16px', textAlign: 'center', borderRadius: '8px', maxWidth: '460px' } }, 'Drop a photo here · or use the sample')), out));
  draw();
  window.__demoProof = async () => { P.shape = 'circle'; P.size = 20; draw(); return 'circle tiles, size 20'; };
};
V['compare-slider-inspector'] = (root, T) => {
  theme(root, T, { bg: '#f8f8fa', fg: '#222', panel: '#fff', ac: '#ff3385', dark: false });
  const src = scene(1200, 800, 'land', 8);
  const view = h('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden', background: 'repeating-conic-gradient(#e8e8ee 0 25%,#fff 0 50%) 0 0/24px 24px' } });
  const A = h('canvas', { width: 1200, height: 800, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }); A.getContext('2d').drawImage(src, 0, 0);
  const B = h('canvas', { width: 1200, height: 800, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } });
  let split = 0.5, q = 75, codec = 'MozJPEG';
  const comp = () => { const f = Math.max(2, Math.round((100 - q) / 6)); const t = document.createElement('canvas'); t.width = 1200 / f; t.height = 800 / f; t.getContext('2d').drawImage(src, 0, 0, t.width, t.height); const g = B.getContext('2d'); g.imageSmoothingEnabled = codec !== 'WebP'; g.drawImage(t, 0, 0, 1200, 800); const kb = Math.round(2870 * (q / 100) ** 2 * (codec === 'AVIF' ? 0.5 : codec === 'WebP' ? 0.7 : 1)); size.textContent = `2.8 MB → ${kb} kB`; pct.textContent = `${Math.round((1 - kb / 2870) * 100)}% smaller`; };
  const handle = h('div', { style: { position: 'absolute', top: 0, bottom: 0, width: '4px', marginLeft: '-2px', background: '#fff', boxShadow: '0 0 8px #0006', cursor: 'ew-resize', zIndex: 2, touchAction: 'none' } }, h('div', { style: { position: 'absolute', top: '50%', left: '-18px', width: '40px', height: '40px', borderRadius: '50%', background: '#ff3385', color: '#fff', display: 'grid', placeItems: 'center', transform: 'translateY(-50%)' } }, '⇔'));
  const place = () => { B.style.clipPath = `inset(0 0 0 ${split * 100}%)`; handle.style.left = split * 100 + '%'; };
  drag(handle, { move: (e) => { split = clamp(localPos(e, view).x / view.clientWidth, 0, 1); place(); } });
  view.append(A, B, handle);
  const size = h('b'), pct = h('div', { style: { color: '#ff3385', fontWeight: 800 } });
  const side = (title, kids, pos) => h('div', { style: { position: 'absolute', [pos]: '16px', bottom: '16px', width: '300px', background: '#fff', borderRadius: '14px', boxShadow: '0 10px 30px #0002', padding: '14px', display: 'grid', gap: '10px', zIndex: 3 } }, h('div', { style: { background: '#ff3385', color: '#fff', margin: '-14px -14px 0', padding: '10px 14px', borderRadius: '14px 14px 0 0', fontWeight: 700 } }, title), ...kids);
  root.append(view, side('Original Image', [select(['Original', 'Resize'], 'Original', () => {}), h('div', {}, '2.8 MB · 1200×800')], 'left'), side('Compress', [select(['MozJPEG', 'WebP', 'AVIF', 'OxiPNG'], codec, (v) => { codec = v; comp(); }), slider('Quality', 5, 100, q, 1, (v) => { q = v; comp(); }), size, pct, btn('⬇ Download', () => toast('Downloaded compressed.jpg'), 'pri')], 'right'), h('div', { style: { position: 'absolute', top: '14px', left: '14px', background: '#fff', borderRadius: '99px', padding: '6px 14px', fontWeight: 800, zIndex: 3 } }, '◉ Squoosh-ish'));
  comp(); place();
  window.__demoProof = async () => { await gesture(handle, [[2, 400], [-120, 400], [-260, 400]]); q = 22; comp(); return 'dragged compare handle + quality 22'; };
};
V['photo-relight-light-stage'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', ac: '#7b61ff', dark: false });
  const src = scene(460, 460, 'portrait', 2); const out = document.createElement('canvas'); out.width = 460; out.height = 460; Object.assign(out.style, { width: '460px', height: '460px', borderRadius: '24px' });
  const lights = [{ x: 0.25, y: 0.3, c: '#7b61ff', i: 0.8 }, { x: 0.78, y: 0.45, c: '#00d4ff', i: 0.6 }]; let before = false;
  const wrap = h('div', { style: { position: 'relative', width: '460px', height: '460px' } }, out);
  const draw = () => { const g = out.getContext('2d'); g.globalCompositeOperation = 'source-over'; g.drawImage(src, 0, 0); if (!before) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, 460, 460); g.globalCompositeOperation = 'screen'; for (const L of lights) { const gr = g.createRadialGradient(L.x * 460, L.y * 460, 0, L.x * 460, L.y * 460, 300 * L.i); gr.addColorStop(0, L.c); gr.addColorStop(1, 'transparent'); g.fillStyle = gr; g.fillRect(0, 0, 460, 460); } }
    wrap.querySelectorAll('.orb').forEach((e) => e.remove()); if (!before) lights.forEach((L) => { const k = h('div.orb', { style: { position: 'absolute', left: L.x * 100 + '%', top: L.y * 100 + '%', width: '30px', height: '30px', margin: '-15px', borderRadius: '50%', background: L.c, border: '3px solid #fff', boxShadow: `0 0 24px ${L.c}`, cursor: 'grab', touchAction: 'none' } }); drag(k, { move: (e) => { const p = localPos(e, wrap); L.x = clamp(p.x / 460, 0, 1); L.y = clamp(p.y / 460, 0, 1); draw(); } }); wrap.append(k); }); };
  root.append(h('div.k-row', { style: { height: '56px', padding: '0 40px', gap: '20px' } }, h('b', {}, 'Clipdrop-ish'), h('span', { style: { flex: 1 } }), 'Tools', 'API', 'Pricing', btn('Sign in', () => {})), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 520px', gap: '40px', padding: '30px 80px', alignItems: 'center' } }, h('div', {}, h('div', { style: { color: '#7b61ff', fontWeight: 700 } }, 'Image Relight'), h('h1', { style: { fontSize: '52px', lineHeight: 1.05, margin: '10px 0' } }, 'Relight your photos in seconds with zero studio gear'), h('div', { style: { display: 'grid', gap: '12px', maxWidth: '420px', marginTop: '20px' } }, ...lights.map((L, i) => h('div.k-row', {}, h('input', { type: 'color', value: L.c, oninput: (e) => { L.c = e.target.value; draw(); } }), h('div', { style: { flex: 1 } }, slider(`Light ${i + 1} intensity`, 0.1, 1.5, L.i, 0.05, (v) => { L.i = v; draw(); })))), h('div.k-row', {}, btn('+ Add light', () => { lights.push({ x: 0.5, y: 0.8, c: '#ff7a59', i: 0.6 }); draw(); }), btn('Before / After', () => { before = !before; draw(); }), btn('⬇ Download', () => toast('relit.png'), 'pri')))), wrap));
  draw();
  window.__demoProof = async () => { const orb = wrap.querySelector('.orb'); await gesture(orb, [[15, 15], [40, 60], [70, 110]]); return 'dragged light orb'; };
};
function shotCard(dark) { const c = scene(640, 400, 'land', 11); c.style.cssText = 'width:100%;height:100%;display:block;object-fit:cover'; return c; }
V['beautify-studio-inspector'] = (root, T) => {
  theme(root, T, { bg: '#f5f5f7', fg: '#1d1d1f', panel: '#fff', ac: '#ff2d6f', dark: false });
  const BG = ['linear-gradient(135deg,#ff9a9e,#fad0c4)', 'linear-gradient(135deg,#a18cd1,#fbc2eb)', 'linear-gradient(135deg,#84fab0,#8fd3f4)', 'linear-gradient(135deg,#fccb90,#d57eeb)', 'linear-gradient(135deg,#232526,#414345)', 'linear-gradient(135deg,#f6d365,#fda085)'];
  const P = { bg: 1, pad: 64, rad: 12, shadow: 0.35, frame: 'macOS', size: 'Twitter' }; let has = false;
  const stage = h('div', { style: { transition: 'all .2s', display: 'grid', placeItems: 'center', margin: 'auto', boxShadow: '0 1px 3px #0001' } });
  const SIZES = { Square: [520, 520], Twitter: [720, 405], OG: [720, 378], Story: [340, 600] };
  const draw = () => { const [w, hh] = SIZES[P.size]; Object.assign(stage.style, { width: w + 'px', height: hh + 'px', background: BG[P.bg], padding: P.pad + 'px' }); stage.replaceChildren(has ? h('div', { style: { width: '100%', height: '100%', borderRadius: P.rad + 'px', overflow: 'hidden', boxShadow: `0 ${P.shadow * 60}px ${P.shadow * 120}px rgba(0,0,0,${P.shadow})`, background: '#fff', display: 'flex', flexDirection: 'column' } }, P.frame === 'macOS' ? h('div.k-row', { style: { height: '26px', padding: '0 10px', gap: '6px', background: '#ececec' } }, ['#ff5f57', '#febc2e', '#28c840'].map((c) => h('i', { style: { width: '10px', height: '10px', borderRadius: '50%', background: c } }))) : null, h('div', { style: { flex: 1, minHeight: 0 } }, shotCard())) : h('div', { style: { background: '#fff', borderRadius: '14px', padding: '28px', textAlign: 'center', width: '320px' } }, h('b', {}, 'Add screenshot'), h('p', { style: { fontSize: '12px', opacity: .6 } }, 'Paste ⌘V, drop or try the demo'), btn('Try with demo image', () => { has = true; draw(); }, 'pri'))); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 320px'; root.style.gridTemplateRows = '52px 1fr';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', padding: '0 20px', borderBottom: '1px solid #e5e5ea', background: '#fff' } }, h('b', { style: { color: '#ff2d6f' } }, 'pika-ish'), 'Screenshot editor', h('span', { style: { flex: 1 } }), btn('Copy', () => toast('Image copied')), btn('Download', () => toast('pika.png saved'), 'pri')), h('div', { style: { display: 'grid', placeItems: 'center', overflow: 'hidden' } }, stage),
    panel('Inspector', h('div.k-h', {}, 'Background'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '6px' } }, BG.map((b, i) => h('button', { onclick: () => { P.bg = i; draw(); }, style: { height: '34px', borderRadius: '8px', border: '2px solid #fff', background: b } }))), slider('Padding', 0, 120, P.pad, 1, (v) => { P.pad = v; draw(); }), slider('Roundness', 0, 40, P.rad, 1, (v) => { P.rad = v; draw(); }), slider('Shadow', 0, 0.8, P.shadow, 0.05, (v) => { P.shadow = v; draw(); }), h('div.k-h', {}, 'Frame'), seg(['None', 'macOS'], P.frame, (v) => { P.frame = v; draw(); }), h('div.k-h', {}, 'Canvas size'), seg(Object.keys(SIZES), P.size, (v) => { P.size = v; draw(); })));
  draw();
  window.__demoProof = async () => { has = true; P.pad = 56; P.rad = 16; draw(); return 'demo image loaded, padding/roundness applied'; };
};
V['device-mockup-studio'] = (root, T) => {
  theme(root, T, { bg: '#0f0f12', fg: '#fff', panel: '#1a1a1f', ac: '#ff3b6b', dark: true });
  const P = { dev: 'iPhone', tilt: 12, shadow: 0.6, bg: 'linear-gradient(135deg,#ff3b6b,#7b2ff7)' };
  const stage = h('div', { style: { position: 'relative', display: 'grid', placeItems: 'center', borderRadius: '18px', overflow: 'hidden', perspective: '1200px' } });
  const draw = () => { stage.style.background = P.bg; const isPhone = P.dev === 'iPhone'; const dev = h('div', { style: { width: isPhone ? '250px' : '560px', height: isPhone ? '510px' : '360px', borderRadius: isPhone ? '44px' : '18px', background: '#111', padding: isPhone ? '12px' : '14px 14px 30px', transform: `rotateY(${-P.tilt}deg) rotateX(${P.tilt / 2}deg)`, boxShadow: `0 ${40 * P.shadow}px ${90 * P.shadow}px rgba(0,0,0,${P.shadow})`, transition: '.3s' } }, h('div', { style: { width: '100%', height: '100%', borderRadius: isPhone ? '34px' : '6px', overflow: 'hidden', background: '#fff' } }, (() => { const c = scene(400, 800, 'sunset', 6); c.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block'; return c; })())); stage.replaceChildren(dev); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 300px'; root.style.gap = '16px'; root.style.padding = '16px';
  root.append(h('div', { style: { display: 'grid', gridTemplateRows: 'auto 1fr', gap: '12px' } }, h('div', { style: { textAlign: 'center' } }, h('div', { style: { font: '800 40px Inter Variable' } }, 'Create Amazing Mockups'), h('div', { style: { opacity: .6 } }, 'Beautiful mockups for your app and web screenshots')), stage), panel('Mockup', seg(['iPhone', 'MacBook'], P.dev, (v) => { P.dev = v; draw(); }), slider('Tilt', -30, 30, P.tilt, 1, (v) => { P.tilt = v; draw(); }), slider('Shadow', 0, 1, P.shadow, 0.05, (v) => { P.shadow = v; draw(); }), h('div.k-h', {}, 'Background'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' } }, ['linear-gradient(135deg,#ff3b6b,#7b2ff7)', 'linear-gradient(135deg,#43e97b,#38f9d7)', '#e9e9ee', 'linear-gradient(135deg,#0f2027,#2c5364)'].map((b) => h('button', { onclick: () => { P.bg = b; draw(); }, style: { height: '40px', borderRadius: '8px', border: 0, background: b } }))), btn('Start Creating → Export 4K', () => toast('mockup.png exported'), 'pri')));
  draw();
  window.__demoProof = async () => { P.tilt = 18; draw(); return 'tilted device 18°'; };
};
const CODE = `const pluckDeep = key => obj => key.split('.').reduce((accum, key) => accum[key], obj)\n\nconst compose = (...fns) => res => fns.reduce((accum, next) => next(accum), res)\n\nconst unfold = (f, seed) => {\n  const go = (f, seed, acc) => {\n    const res = f(seed)\n    return res ? go(f, res[1], acc.concat([res[0]])) : acc\n  }\n  return go(f, seed, [])\n}`;
function hl(code, th) { const esc = code.replace(/&/g, '&amp;').replace(/</g, '&lt;'); return esc.replace(/(\/\/.*)|('.*?'|".*?"|`.*?`)|\b(const|let|return|function|import|from|export)\b|(\b\d+\b)|(=>)/g, (m, c, st, kw, n, ar) => `<span style="color:${c ? th.c : st ? th.s : kw ? th.k : n ? th.n : th.a}">${m}</span>`); }
function codeCard(root, T, cfg) {
  const TH = { Candy: { bg: 'linear-gradient(140deg,#ff6bcb,#7a5cff)', win: '#1e1e2ecc', k: '#ff7ab6', s: '#a6e3a1', c: '#6c7086', n: '#fab387', a: '#89dceb', fg: '#cdd6f4' }, Breeze: { bg: 'linear-gradient(140deg,#43e97b,#38f9d7)', win: '#0b1b2bcc', k: '#7ee787', s: '#a5d6ff', c: '#8b949e', n: '#ffa657', a: '#d2a8ff', fg: '#e6edf3' }, Midnight: { bg: 'linear-gradient(140deg,#0f2027,#2c5364)', win: '#0d1117e6', k: '#ff7b72', s: '#a5d6ff', c: '#8b949e', n: '#79c0ff', a: '#ffa657', fg: '#c9d1d9' }, Seti: { bg: '#abb8c3', win: '#151718', k: '#e6cd69', s: '#55b5db', c: '#41535b', n: '#cd3f45', a: '#9fca56', fg: '#d4d7d6' }, Dracula: { bg: '#a3b3ff', win: '#282a36', k: '#ff79c6', s: '#f1fa8c', c: '#6272a4', n: '#bd93f9', a: '#50fa7b', fg: '#f8f8f2' } };
  const P = { theme: cfg.theme, pad: cfg.pad, dark: true, chrome: true, shadow: true, lang: 'JavaScript', title: 'untitled.js' };
  const ta = h('textarea', { spellcheck: false, style: { position: 'absolute', inset: 0, background: 'transparent', color: 'transparent', caretColor: '#fff', border: 0, font: '14px/1.6 JetBrains Mono Variable,monospace', padding: '0', resize: 'none', outline: 'none', whiteSpace: 'pre', overflow: 'hidden' } }); ta.value = cfg.code || CODE;
  const pre = h('pre', { style: { margin: 0, font: '14px/1.6 JetBrains Mono Variable,monospace', whiteSpace: 'pre' } });
  const win = h('div', { style: { borderRadius: '10px', overflow: 'hidden' } }); const frame = h('div', { style: { display: 'inline-block', transition: 'padding .2s' } }, win);
  const draw = () => { const th = TH[P.theme]; frame.style.background = cfg.frameBg || th.bg; frame.style.padding = P.pad + 'px'; win.style.background = th.win; win.style.color = th.fg; win.style.boxShadow = P.shadow ? '0 20px 68px rgba(0,0,0,.55)' : 'none'; win.style.backdropFilter = 'blur(10px)'; pre.innerHTML = hl(ta.value, th); win.replaceChildren(P.chrome ? h('div.k-row', { style: { padding: '12px 14px', gap: '8px' } }, ['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => h('i', { style: { width: '12px', height: '12px', borderRadius: '50%', background: c } })), h('span', { style: { flex: 1, textAlign: 'center', opacity: .5, fontSize: '12px' } }, P.title)) : '', h('div', { style: { position: 'relative', padding: '4px 18px 18px' } }, pre, ta)); };
  ta.oninput = draw;
  const ctl = [select(Object.keys(TH), P.theme, (v) => { P.theme = v; draw(); }), seg([['16', '16'], ['32', '32'], ['64', '64'], ['128', '128']], String(P.pad), (v) => { P.pad = +v; draw(); }), toggle('Window', true, (v) => { P.chrome = v; draw(); }), toggle('Shadow', true, (v) => { P.shadow = v; draw(); }), select(['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go'], 'JavaScript', () => {}), btn(cfg.exportLabel || 'Export', () => toast('code.png exported'), 'pri'), btn('Copy', () => copy(ta.value, 'Code copied'))];
  return { frame, ctl, draw, P };
}
V['code-snippet-image-studio'] = (root, T) => {
  theme(root, T, { bg: '#111', fg: '#fff', ac: '#ff3c7e', dark: true });
  const c = codeCard(root, T, { theme: 'Candy', pad: 64 });
  root.append(h('div.k-row', { style: { height: '44px', padding: '0 18px', borderBottom: '1px solid #222' } }, h('b', {}, 'ray.so-ish'), h('span', { style: { flex: 1 } }), 'Export ▾'), h('div', { style: { position: 'absolute', inset: '44px 0 90px', display: 'grid', placeItems: 'center' } }, c.frame), h('div.k-row', { style: { position: 'absolute', bottom: '22px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', border: '1px solid #333', borderRadius: '14px', padding: '10px 16px', gap: '14px' } }, c.ctl));
  c.draw();
  window.__demoProof = async () => { c.P.pad = 64; c.P.theme = 'Candy'; c.draw(); return 'theme Candy, padding 64'; };
};
V['carbon-code-image-studio'] = (root, T) => {
  theme(root, T, { bg: '#121212', fg: '#fff', ac: '#f8e71c', acfg: '#111', dark: true });
  const c = codeCard(root, T, { theme: 'Seti', pad: 56, frameBg: 'rgba(171,184,195,1)', code: `const pluckDeep = key => obj => key.split('.').reduce((accum, key) => accum[key], obj)\n\nconst compose = (...fns) => res => fns.reduce((accum, next) => next(accum), res)`, exportLabel: 'Export PNG/SVG' });
  root.append(h('div', { style: { textAlign: 'center', paddingTop: '26px' } }, h('div', { style: { font: '800 54px Inter Variable', color: '#f8e71c', letterSpacing: '-.03em' } }, 'carbon'), h('div', { style: { fontWeight: 700 } }, 'Create and share beautiful images of your source code.'), h('div', { style: { opacity: .6, fontSize: '13px' } }, 'Start typing or drop a file into the text area to get started.')), h('div.k-row', { style: { justifyContent: 'center', margin: '18px 0', gap: '10px', flexWrap: 'wrap' } }, c.ctl), h('div', { style: { display: 'grid', placeItems: 'center' } }, h('div', { style: { border: '3px solid #444', borderRadius: '6px', padding: '0' } }, c.frame)));
  c.draw();
  window.__demoProof = async () => { c.P.theme = 'Seti'; c.draw(); return 'Seti theme with window chrome'; };
};
V['video-framegrid-contact-sheet'] = (root, T) => {
  theme(root, T, { bg: '#0b0b0b', fg: '#eee', panel: '#151515', ac: '#1ed760', acfg: '#000', dark: true });
  let cols = 5, rows = 4, loaded = false, dur = 94;
  const intro = h('div', { style: { textAlign: 'center', paddingTop: '160px' } }, h('div', { style: { fontSize: '40px' } }, '▦'), h('div', { style: { font: '800 26px Inter Variable' } }, 'TimeGrid-ish'), h('div', { style: { opacity: .6, margin: '8px 0 20px' } }, 'Turn any video into a frame-grid contact sheet'), h('div.k-row', { style: { justifyContent: 'center' } }, btn('Choose video', () => load(), 'pri'), btn('Use sample clip', () => load(), 'pri')));
  const sheet = h('div', { style: { display: 'none', padding: '20px 30px' } }); const gridEl = h('div', { style: { display: 'grid', gap: '6px', marginTop: '12px' } });
  const frame = (t) => { const c = document.createElement('canvas'); c.width = 256; c.height = 144; const g = c.getContext('2d'); const k = t / dur; const sky = g.createLinearGradient(0, 0, 0, 144); sky.addColorStop(0, `hsl(${200 + k * 140} 70% ${60 - k * 30}%)`); sky.addColorStop(1, `hsl(${30 + k * 20} 80% 60%)`); g.fillStyle = sky; g.fillRect(0, 0, 256, 144); g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(40 + k * 180, 110 - Math.sin(k * Math.PI) * 80, 14, 0, 7); g.fill(); g.fillStyle = '#1b2735'; g.fillRect(0, 110, 256, 34); g.fillStyle = '#e53935'; g.fillRect(20 + ((k * 900) % 220), 100, 26, 12); return c; };
  const draw = () => { gridEl.style.gridTemplateColumns = `repeat(${cols},1fr)`; gridEl.replaceChildren(...Array.from({ length: cols * rows }, (_, i) => { const t = (i / (cols * rows - 1)) * dur; const c = frame(t); c.style.cssText = 'width:100%;display:block;border-radius:3px'; return h('div', { style: { position: 'relative' } }, c, h('span', { style: { position: 'absolute', right: '4px', bottom: '4px', background: '#000a', fontFamily: 'monospace', fontSize: '11px', padding: '1px 4px' } }, `00:${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`)); })); };
  const load = () => { loaded = true; intro.style.display = 'none'; sheet.style.display = ''; draw(); };
  sheet.append(h('div.k-row', {}, h('b', {}, 'sample_clip.mp4 · 1:34 · 1920×1080'), h('span', { style: { flex: 1 } }), h('div', { style: { width: '150px' } }, slider('Columns', 2, 8, cols, 1, (v) => { cols = v; draw(); })), h('div', { style: { width: '150px' } }, slider('Rows', 2, 8, rows, 1, (v) => { rows = v; draw(); })), btn('⬇ Export JPG', () => toast('contact-sheet.jpg'), 'pri')), gridEl);
  root.append(intro, sheet);
  window.__demoProof = async () => { load(); return 'sample clip → 5×4 timecoded contact sheet'; };
};

V['chalkist-code-shot-studio'] = (root, T) => {
  theme(root, T, { bg: '#0b0b0d', fg: '#f0f0f0', panel: '#18181b', ac: '#3b82f6', dark: true });
  const CODE0 = `import type { App } from "vue";\n\nexport function createCounter(el: HTMLElement) {\n  let count = 0;\n  const btn = document.createElement("button");\n  btn.textContent = "count is 0";\n  btn.addEventListener("click", () => {\n    count += 1;\n    btn.textContent = \`count is \${count}\`;\n  });\n  el.append(btn);\n  return { getCount: () => count };\n}\n\nexport default function install(app: App) {\n  app.config.globalProperties.$counter = createCounter;\n}`;
  const TH = {
    Vue: { bg: 'radial-gradient(ellipse at 50% 40%, #154359 0%, #1a2840 45%, #0b0b0d 100%)', win: '#1e1e2ecc', k: '#89b4fa', s: '#a6e3a1', c: '#6c7086', n: '#fab387', a: '#cba6f7', fg: '#cdd6f4', t: '#94e2d5' },
    Candy: { bg: 'radial-gradient(ellipse at 50% 40%, #ff6bcb55 0%, #7a5cff44 50%, #0b0b0d 100%)', win: '#1e1e2ecc', k: '#ff7ab6', s: '#a6e3a1', c: '#6c7086', n: '#fab387', a: '#89dceb', fg: '#cdd6f4', t: '#f9e2af' },
    Midnight: { bg: 'radial-gradient(ellipse at 50% 35%, #2c5364 0%, #0f2027 55%, #05080c 100%)', win: '#0d1117e6', k: '#ff7b72', s: '#a5d6ff', c: '#8b949e', n: '#79c0ff', a: '#ffa657', fg: '#c9d1d9', t: '#7ee787' },
    Dracula: { bg: 'radial-gradient(ellipse at 50% 40%, #6272a4 0%, #282a36 60%, #0b0b0d 100%)', win: '#282a36ee', k: '#ff79c6', s: '#f1fa8c', c: '#6272a4', n: '#bd93f9', a: '#50fa7b', fg: '#f8f8f2', t: '#8be9fd' },
    Nord: { bg: 'radial-gradient(ellipse at 50% 40%, #5e81ac 0%, #2e3440 55%, #0b0b0d 100%)', win: '#2e3440ee', k: '#81a1c1', s: '#a3be8c', c: '#4c566a', n: '#d08770', a: '#88c0d0', fg: '#eceff4', t: '#8fbcbb' },
  };
  const P = { theme: 'Vue', pad: 64, round: 18, particles: true, noise: false, chrome: true, lang: 'TypeScript' };
  const hl = (code, th) => {
    const esc = code.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return esc.replace(/(\/\/.*)|(`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*")|\b(const|let|return|function|import|from|export|type|default|new)\b|(\b\d+\b)|(=>)|(:\s*[A-Z][\w<>|]*)/g,
      (m, c, st, kw, n, ar, ty) => `<span style="color:${c ? th.c : st ? th.s : kw ? th.k : n ? th.n : ar ? th.a : ty ? th.t : th.fg}">${m}</span>`);
  };
  const stage = h('div', { style: { position: 'relative', flex: 1, display: 'grid', placeItems: 'center', overflow: 'hidden', minHeight: 0 } });
  const particleLayer = h('canvas', { style: { position: 'absolute', inset: 0, pointerEvents: 'none' } });
  const frame = h('div', { style: { position: 'relative', zIndex: 2, transition: 'padding .2s, border-radius .2s', boxShadow: '0 30px 80px #000a' } });
  const win = h('div', { style: { overflow: 'hidden', backdropFilter: 'blur(12px)' } });
  const pre = h('pre', { style: { margin: 0, font: '13px/1.55 JetBrains Mono Variable,monospace', whiteSpace: 'pre', padding: '8px 18px 20px' } });
  const ta = h('textarea', { spellcheck: false, style: { position: 'absolute', inset: 0, background: 'transparent', color: 'transparent', caretColor: '#fff', border: 0, font: '13px/1.55 JetBrains Mono Variable,monospace', padding: '8px 18px 20px', resize: 'none', outline: 'none', whiteSpace: 'pre', overflow: 'auto' } });
  ta.value = CODE0;
  const codeWrap = h('div', { style: { position: 'relative' } }, pre, ta);
  frame.append(win);
  stage.append(particleLayer, frame);

  const drawParticles = () => {
    const r = stage.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    particleLayer.width = Math.max(1, r.width * dpr); particleLayer.height = Math.max(1, r.height * dpr);
    particleLayer.style.width = r.width + 'px'; particleLayer.style.height = r.height + 'px';
    const g = particleLayer.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, r.width, r.height);
    if (!P.particles) return;
    for (let i = 0; i < 70; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * r.width;
      const y = (Math.sin(i * 78.233) * 43758.5453 % 1 + 1) % 1 * r.height;
      g.fillStyle = `rgba(255,255,255,${0.15 + (i % 5) * 0.08})`;
      g.beginPath(); g.arc(x, y, 0.8 + (i % 3) * 0.5, 0, 7); g.fill();
    }
  };
  const draw = () => {
    const th = TH[P.theme];
    stage.style.background = th.bg;
    frame.style.padding = P.pad + 'px';
    frame.style.borderRadius = P.round + 'px';
    frame.style.background = 'transparent';
    win.style.background = th.win;
    win.style.color = th.fg;
    win.style.borderRadius = Math.max(8, P.round - 6) + 'px';
    win.style.boxShadow = '0 20px 60px rgba(0,0,0,.55)';
    const lines = ta.value.split('\n');
    const nums = P.chrome ? h('div', { style: { position: 'absolute', left: '10px', top: '8px', font: '13px/1.55 JetBrains Mono Variable,monospace', opacity: .35, textAlign: 'right', userSelect: 'none', pointerEvents: 'none' } }, ...lines.map((_, i) => h('div', {}, String(i + 1)))) : null;
    pre.style.paddingLeft = P.chrome ? '42px' : '18px';
    ta.style.paddingLeft = P.chrome ? '42px' : '18px';
    pre.innerHTML = hl(ta.value, th);
    win.replaceChildren(
      P.chrome ? h('div.k-row', { style: { padding: '12px 14px', gap: '8px' } },
        ['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => h('i', { style: { width: '12px', height: '12px', borderRadius: '50%', background: c } })),
        h('span', { style: { flex: 1, textAlign: 'center', opacity: .45, fontSize: '12px' } }, 'Untitled · ' + P.lang)) : '',
      h('div', { style: { position: 'relative' } }, nums, codeWrap),
    );
    drawParticles();
  };
  ta.oninput = draw;

  const side = panel('Chalk.ist-ish',
    h('div.k-h', {}, 'Theme & typography'),
    select(Object.keys(TH), P.theme, (v) => { P.theme = v; draw(); }),
    select(['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go'], P.lang, (v) => { P.lang = v; draw(); }),
    h('div.k-h', {}, 'Backdrop'),
    toggle('Backdrop particles', true, (v) => { P.particles = v; draw(); }),
    toggle('Backdrop noise', false, (v) => { P.noise = v; stage.style.filter = v ? 'url(#n)' : 'none'; }),
    slider('Padding', 24, 120, P.pad, 1, (v) => { P.pad = v; draw(); }),
    slider('Rounding', 4, 40, P.round, 1, (v) => { P.round = v; draw(); }),
    h('div.k-h', {}, 'Window'),
    toggle('Window chrome', true, (v) => { P.chrome = v; draw(); }),
    h('div.k-h', {}, 'Code'),
    h('div', { style: { fontSize: '11px', opacity: .6 } }, 'Edit the transparent textarea over the preview — live update.'),
    btn('Export PNG', () => toast('chalkist.png exported'), 'pri'),
    btn('Copy code', () => copy(ta.value, 'Code copied')),
  );
  side.style.width = '300px'; side.style.borderRadius = '0'; side.style.border = '0'; side.style.borderRight = '1px solid #ffffff14';
  const top = h('div.k-row', { style: { height: '48px', padding: '0 16px', borderBottom: '1px solid #ffffff14', gap: '14px' } },
    h('b', { style: { letterSpacing: '.04em' } }, 'chalk.ist'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: .5, fontSize: '12px' } }, 'Blocks ▾'),
    h('span', { style: { opacity: .5, fontSize: '12px' } }, 'Line decorations ▾'),
    btn('Export ▾', () => toast('chalkist.png exported'), 'pri'));
  const main = h('div', { style: { display: 'grid', gridTemplateRows: '48px 1fr', minHeight: 0, minWidth: 0 } }, top, stage);
  root.style.display = 'grid'; root.style.gridTemplateColumns = '300px 1fr';
  root.append(side, main);
  draw();
  new ResizeObserver(drawParticles).observe(stage);
  window.__demoProof = async () => {
    P.theme = 'Candy'; P.pad = 80; P.round = 24; P.particles = true;
    ta.value = 'const hello = (name) => `hi ${name}`;\nconsole.log(hello("chalk"));';
    draw();
    return 'theme Candy, pad 80, round 24, particles on, code edited';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['dither-param-studio'])(root, T); }
