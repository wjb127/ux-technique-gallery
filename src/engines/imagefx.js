import { h, s, css, drag, localPos, clamp, copy, toast, sleep, rng, hexToRgb, rgbToHsl, hsl, noise2, gesture } from '../lib.js';
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


V['moshlite-glitch-effect-mixer-desk'] = (root, T) => {
  theme(root, T, { bg: '#0a0a0a', fg: '#f5f5f5', panel: '#141414', ac: '#ffffff', dark: true });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  const FX_DEFS = [
    { id: 'rgb', name: 'RGB Split', on: true, amt: 0.55 },
    { id: 'scan', name: 'Scanlines', on: true, amt: 0.4 },
    { id: 'noise', name: 'Noise', on: true, amt: 0.35 },
    { id: 'wave', name: 'Wave', on: false, amt: 0.45 },
    { id: 'pixel', name: 'Pixelate', on: false, amt: 0.3 },
    { id: 'hue', name: 'Hue Shift', on: true, amt: 0.25 },
  ];
  const fx = FX_DEFS.map((d) => ({ ...d }));
  let seed = 48291;
  let srcKind = 'land';
  let mode = 'mixer';
  const localRng = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

  const srcCanvas = () => scene(640, 400, srcKind, (srcKind === 'land' ? 3 : srcKind === 'sunset' ? 7 : 11));
  let base = srcCanvas();

  const stageWrap = h('div', { style: { position: 'relative', flex: 1, minWidth: 0, minHeight: 0, background: '#000', display: 'grid', placeItems: 'center' } });
  const out = h('canvas', { width: 640, height: 400, style: { maxWidth: '92%', maxHeight: '86%', width: 'auto', height: 'auto', boxShadow: '0 0 0 1px #ffffff18, 0 30px 80px #000a' } });
  const watermark = h('div', { style: { position: 'absolute', right: '18px', bottom: '14px', fontSize: '11px', letterSpacing: '.12em', opacity: .35, pointerEvents: 'none' } }, 'MOSH-LITE');
  stageWrap.append(out, watermark);

  const seedLab = h('b', { style: { fontFamily: 'ui-monospace,monospace', fontSize: '12px' } }, String(seed));
  const stack = h('div', { style: { display: 'grid', gap: '8px', overflow: 'auto', padding: '4px 2px', flex: 1, alignContent: 'start' } });

  const applyFx = () => {
    const g = out.getContext('2d');
    const W = out.width, H = out.height;
    g.clearRect(0, 0, W, H);
    g.drawImage(base, 0, 0, W, H);
    let img = g.getImageData(0, 0, W, H);
    const d = img.data;
    const roll = rng(seed || 1);

    const rgb = fx.find((f) => f.id === 'rgb');
    if (rgb?.on) {
      const off = Math.round(rgb.amt * 18);
      const copyA = new Uint8ClampedArray(d);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const xr = clamp(x + off, 0, W - 1);
        const xb = clamp(x - off, 0, W - 1);
        d[i] = copyA[(y * W + xr) * 4];
        d[i + 2] = copyA[(y * W + xb) * 4 + 2];
      }
    }
    const hue = fx.find((f) => f.id === 'hue');
    if (hue?.on) {
      const shift = hue.amt * 80;
      for (let i = 0; i < d.length; i += 4) {
        const [hh, ss, ll] = rgbToHsl(d[i], d[i + 1], d[i + 2]);
        const hex = hsl((hh + shift) % 360, ss, ll);
        const [rr, gg, bb] = hexToRgb(hex);
        d[i] = rr; d[i + 1] = gg; d[i + 2] = bb;
      }
    }
    const noiseF = fx.find((f) => f.id === 'noise');
    if (noiseF?.on) {
      const a = noiseF.amt * 70;
      for (let i = 0; i < d.length; i += 4) {
        const n = (roll() - 0.5) * a;
        d[i] = clamp(d[i] + n, 0, 255);
        d[i + 1] = clamp(d[i + 1] + n, 0, 255);
        d[i + 2] = clamp(d[i + 2] + n, 0, 255);
      }
    }
    g.putImageData(img, 0, 0);

    const wave = fx.find((f) => f.id === 'wave');
    if (wave?.on) {
      const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
      tmp.getContext('2d').drawImage(out, 0, 0);
      g.clearRect(0, 0, W, H);
      const amp = wave.amt * 14;
      for (let y = 0; y < H; y++) {
        const dx = Math.sin(y * 0.08 + seed * 0.001) * amp;
        g.drawImage(tmp, 0, y, W, 1, dx, y, W, 1);
      }
    }
    const pixel = fx.find((f) => f.id === 'pixel');
    if (pixel?.on) {
      const s = Math.max(2, Math.round(2 + pixel.amt * 14));
      const tw = Math.ceil(W / s), th = Math.ceil(H / s);
      const t = document.createElement('canvas'); t.width = tw; t.height = th;
      const tg = t.getContext('2d'); tg.imageSmoothingEnabled = false;
      tg.drawImage(out, 0, 0, tw, th);
      g.imageSmoothingEnabled = false;
      g.clearRect(0, 0, W, H);
      g.drawImage(t, 0, 0, W, H);
    }
    const scan = fx.find((f) => f.id === 'scan');
    if (scan?.on) {
      g.fillStyle = `rgba(0,0,0,${0.15 + scan.amt * 0.35})`;
      for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1);
    }
    seedLab.textContent = String(seed);
  };

  const renderStack = () => {
    stack.replaceChildren(...fx.map((f, i) => {
      const row = h('div', { style: { background: '#1a1a1a', border: '1px solid #ffffff14', borderRadius: '10px', padding: '10px 12px', display: 'grid', gap: '8px' } });
      const head = h('div.k-row', { style: { gap: '8px', fontSize: '12px' } },
        h('span', { style: { opacity: .4, cursor: 'grab' } }, '⠿'),
        h('b', { style: { flex: 1 } }, f.name),
        h('label.k-row', { style: { gap: '6px', cursor: 'pointer', fontSize: '11px', opacity: .8 } },
          h('input', { type: 'checkbox', checked: f.on, onchange: (e) => { f.on = e.target.checked; applyFx(); } }), 'ON'));
      const sl = slider('Amount', 0, 1, f.amt, 0.01, (v) => { f.amt = v; applyFx(); }, (v) => (+v).toFixed(2));
      sl.style.opacity = f.on ? '1' : '.35';
      row.append(head, sl);
      row.addEventListener('dblclick', () => {
        if (i <= 0) return;
        const [x] = fx.splice(i, 1); fx.splice(i - 1, 0, x);
        renderStack(); applyFx();
      });
      return row;
    }));
  };

  const mosh = () => {
    seed = (Math.random() * 1e9) | 0;
    fx.forEach((f) => {
      f.on = Math.random() > 0.35;
      f.amt = 0.15 + Math.random() * 0.8;
    });
    if (!fx.some((f) => f.on)) fx[0].on = true;
    renderStack(); applyFx();
    toast('Moshed · seed ' + seed);
  };

  const loadSample = (kind) => {
    srcKind = kind; base = srcCanvas(); mode = 'mixer'; showUI(); applyFx();
  };

  const top = h('div.k-row', { style: { height: '52px', padding: '0 18px', borderBottom: '1px solid #ffffff12', gap: '18px', background: '#0a0a0a' } },
    h('b', { style: { letterSpacing: '.18em', fontSize: '14px' } }, 'MOSH'),
    h('span', { style: { opacity: .4, fontSize: '12px' } }, 'Lite'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '12px', opacity: .45 } }, 'Overview'),
    h('span', { style: { fontSize: '12px', opacity: .45 } }, 'Effects'),
    btn('GET MOSH-PRO', () => toast('Pro upgrade stub'), 'pri'));

  const landing = h('div', { style: { position: 'absolute', inset: '52px 0 0', display: 'grid', placeItems: 'center', background: '#0a0a0a', zIndex: 5 } },
    h('div', { style: { width: 'min(520px, 90%)', textAlign: 'center', display: 'grid', gap: '18px' } },
      h('div', { style: { fontSize: '42px', fontWeight: 800, letterSpacing: '-.02em' } }, 'Mosh-Lite'),
      h('div', { style: { opacity: .55, fontSize: '14px' } }, 'Try the free demo version of Mosh with limited features.'),
      h('div', { style: { border: '1px dashed #ffffff33', borderRadius: '16px', padding: '28px', display: 'grid', gap: '14px' } },
        h('div.k-row', { style: { justifyContent: 'center', gap: '10px', flexWrap: 'wrap' } },
          btn('LOAD FILE', () => loadSample('sunset')),
          btn('USE WEBCAM', () => { toast('Webcam stub — sample loaded'); loadSample('portrait'); })),
        h('div', { style: { opacity: .4, fontSize: '12px' } }, 'OR'),
        h('div', { style: { opacity: .5, fontSize: '12px' } }, 'DRAG AND DROP FILE HERE · or pick a sample'),
        h('div.k-row', { style: { justifyContent: 'center', gap: '8px', flexWrap: 'wrap' } },
          ...[['land', 'Landscape'], ['sunset', 'Sunset'], ['portrait', 'Portrait']].map(([k, l]) =>
            btn(l, () => loadSample(k)))))));

  const side = h('div', { style: { width: '300px', background: '#101010', borderLeft: '1px solid #ffffff12', display: 'flex', flexDirection: 'column', minHeight: 0 } },
    h('div.k-row', { style: { padding: '14px 14px 8px', gap: '8px' } },
      h('b', { style: { flex: 1, fontSize: '13px' } }, 'Effects'),
      h('span', { style: { fontSize: '11px', opacity: .45 } }, 'Seed'), seedLab),
    h('div', { style: { padding: '0 14px 10px', display: 'grid', gap: '8px' } },
      btn('MOSH', mosh, 'pri'),
      h('div.k-row', { style: { gap: '8px' } },
        btn('Reroll seed', () => { seed = (Math.random() * 1e9) | 0; applyFx(); }),
        btn('Export PNG', () => { const a = h('a', { download: 'mosh-lite.png', href: out.toDataURL('image/png') }); a.click(); toast('Exported with watermark'); }))),
    h('div', { style: { padding: '0 12px 12px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } }, stack),
    h('div', { style: { padding: '10px 14px', borderTop: '1px solid #ffffff10', fontSize: '11px', opacity: .4 } }, 'Double-click an effect to bump order · look-alike'));

  const mixer = h('div', { style: { position: 'absolute', inset: '52px 0 0', display: 'none', gridTemplateColumns: '1fr 300px' } }, stageWrap, side);

  const showUI = () => {
    landing.style.display = mode === 'landing' ? 'grid' : 'none';
    mixer.style.display = mode === 'mixer' ? 'grid' : 'none';
  };

  root.append(top, landing, mixer);
  mode = 'mixer'; showUI(); renderStack(); applyFx();

  window.__demoProof = async () => {
    mode = 'landing'; showUI(); await sleep(120);
    loadSample('sunset'); await sleep(80);
    mosh(); await sleep(80);
    const rgbF = fx.find((f) => f.id === 'rgb'); if (rgbF) { rgbF.on = true; rgbF.amt = 0.85; }
    const scanF = fx.find((f) => f.id === 'scan'); if (scanF) { scanF.on = true; scanF.amt = 0.7; }
    renderStack(); applyFx();
    seed = 123456; applyFx();
    return `mixer; seed ${seed}; rgb+scan; moshed`;
  };
};


V['pointerpointer-photo-novelty'] = (root, T) => {
  theme(root, T, { bg: '#000000', fg: '#f0f0f0', panel: '#111', ac: '#ffffff', dark: true });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';
  root.style.cursor = 'none';

  // Procedural photo cards: colored rect + silhouette + finger tip hotspot (nx, ny in 0..1)
  const PHOTOS = [
    { bg: '#e8d5c4', accent: '#c4785a', emoji: '🧑', tip: [0.72, 0.38], label: 'A' },
    { bg: '#d4e4f7', accent: '#4a7ab5', emoji: '👩', tip: [0.28, 0.42], label: 'B' },
    { bg: '#f5e6c8', accent: '#b8860b', emoji: '🧔', tip: [0.65, 0.55], label: 'C' },
    { bg: '#e0f0e0', accent: '#3d8b5f', emoji: '👨', tip: [0.35, 0.30], label: 'D' },
    { bg: '#f0d4e8', accent: '#a8558a', emoji: '👧', tip: [0.78, 0.48], label: 'E' },
    { bg: '#dde8f0', accent: '#5b7c99', emoji: '👱', tip: [0.22, 0.58], label: 'F' },
    { bg: '#f8e8d0', accent: '#c97b3a', emoji: '👵', tip: [0.58, 0.25], label: 'G' },
    { bg: '#e8e0f5', accent: '#7c5cff', emoji: '🧒', tip: [0.40, 0.70], label: 'H' },
    { bg: '#f5d0d0', accent: '#c45a5a', emoji: '👩‍🦰', tip: [0.82, 0.35], label: 'I' },
    { bg: '#d0f0f5', accent: '#2a9d8f', emoji: '🧑‍🦱', tip: [0.18, 0.45], label: 'J' },
    { bg: '#f0f0d0', accent: '#9a8b2a', emoji: '👨‍🦳', tip: [0.55, 0.62], label: 'K' },
    { bg: '#e0d8d0', accent: '#8b6f5c', emoji: '🧔‍♀️', tip: [0.68, 0.28], label: 'L' },
    { bg: '#d8e8e0', accent: '#4a8b6a', emoji: '🧑‍💼', tip: [0.45, 0.50], label: 'M' },
    { bg: '#f0e0e8', accent: '#b85a8a', emoji: '👩‍🎤', tip: [0.75, 0.65], label: 'N' },
    { bg: '#e8f0f8', accent: '#4a6a9a', emoji: '👨‍🔬', tip: [0.30, 0.22], label: 'O' },
    { bg: '#f5e8e0', accent: '#c4784a', emoji: '🧑‍🎨', tip: [0.60, 0.40], label: 'P' },
  ];

  const stage = h('div', {
    style: { position: 'absolute', inset: 0, background: '#000', overflow: 'hidden' },
  });
  const hint = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
      color: '#fff', fontSize: '15px', letterSpacing: '.01em', pointerEvents: 'none',
      opacity: 1, transition: 'opacity .25s',
    },
  }, 'Please move your pointer');
  const photoEl = h('div', {
    style: {
      position: 'absolute', display: 'none', pointerEvents: 'none',
      width: '320px', height: '400px', borderRadius: '2px', overflow: 'hidden',
      boxShadow: '0 12px 40px #0008',
    },
  });
  const cursorDot = h('div', {
    style: {
      position: 'absolute', width: '10px', height: '10px', borderRadius: '50%',
      background: '#fff', border: '1.5px solid #000', pointerEvents: 'none',
      transform: 'translate(-50%,-50%)', zIndex: 20, display: 'none',
    },
  });
  stage.append(hint, photoEl, cursorDot);
  root.append(stage);

  let mx = 0, my = 0, stillTimer = 0, shown = false, used = new Set();
  let current = null;
  const STILL_MS = 1100;

  const paintPhoto = (p, scale = 1) => {
    const W = 320, H = 400;
    photoEl.replaceChildren();
    photoEl.style.width = W * scale + 'px';
    photoEl.style.height = H * scale + 'px';
    photoEl.style.background = p.bg;
    const body = h('div', {
      style: {
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        fontSize: (120 * scale) + 'px', background: `linear-gradient(160deg,${p.bg},${p.accent}55)`,
      },
    }, p.emoji);
    // Finger tip marker (visual only — positioning uses tip nx,ny)
    const finger = h('div', {
      style: {
        position: 'absolute',
        left: (p.tip[0] * 100) + '%',
        top: (p.tip[1] * 100) + '%',
        width: (28 * scale) + 'px', height: (28 * scale) + 'px',
        transform: 'translate(-50%,-50%)',
        borderRadius: '50% 50% 40% 50%',
        background: '#f5c9a0',
        boxShadow: '0 0 0 2px #e0a878',
        display: 'grid', placeItems: 'center', fontSize: (14 * scale) + 'px',
      },
    }, '👆');
    const badge = h('div', {
      style: {
        position: 'absolute', left: '8px', bottom: '8px', fontSize: '10px',
        opacity: .35, letterSpacing: '.08em', color: '#000',
      },
    }, 'PHOTO ' + p.label);
    photoEl.append(body, finger, badge);
  };

  const placeAtCursor = (p) => {
    const rect = stage.getBoundingClientRect();
    const W = 320, H = 400;
    // pan so tip (nx,ny) lands on cursor
    const left = mx - p.tip[0] * W;
    const top = my - p.tip[1] * H;
    photoEl.style.left = left + 'px';
    photoEl.style.top = top + 'px';
    photoEl.style.display = 'block';
    paintPhoto(p);
    shown = true;
    current = p;
    hint.style.opacity = '0';
  };

  const clearPhoto = () => {
    photoEl.style.display = 'none';
    shown = false;
    current = null;
    hint.style.opacity = '1';
    hint.textContent = 'Please move your pointer';
  };

  const pickNearest = () => {
    const rect = stage.getBoundingClientRect();
    const nx = mx / Math.max(1, rect.width);
    const ny = my / Math.max(1, rect.height);
    let best = null, bestD = Infinity;
    for (const p of PHOTOS) {
      if (used.has(p.label) && used.size < PHOTOS.length) continue;
      const d = (p.tip[0] - nx) ** 2 + (p.tip[1] - ny) ** 2;
      if (d < bestD) { bestD = d; best = p; }
    }
    if (used.size >= PHOTOS.length) used.clear();
    if (best) used.add(best.label);
    return best;
  };

  const onMove = (e) => {
    const r = stage.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    cursorDot.style.display = 'block';
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
    if (shown) clearPhoto();
    clearTimeout(stillTimer);
    stillTimer = setTimeout(() => {
      const p = pickNearest();
      if (p) placeAtCursor(p);
    }, STILL_MS);
  };

  stage.addEventListener('pointermove', onMove);
  stage.addEventListener('pointerleave', () => {
    clearTimeout(stillTimer);
    cursorDot.style.display = 'none';
    clearPhoto();
  });

  window.__demoProof = async () => {
    const r = stage.getBoundingClientRect();
    const fake = { clientX: r.left + r.width * 0.62, clientY: r.top + r.height * 0.4 };
    onMove(fake);
    await sleep(STILL_MS + 80);
    const had = shown && !!current;
    const lab = current?.label || '?';
    onMove({ clientX: r.left + r.width * 0.3, clientY: r.top + r.height * 0.7 });
    await sleep(STILL_MS + 80);
    clearTimeout(stillTimer);
    clearPhoto();
    cursorDot.style.display = 'none';
    hint.style.opacity = '1';
    hint.textContent = 'Please move your pointer';
    return had ? `still→photo ${lab} then move-clear; restored idle` : 'still-hold photo attempt';
  };
};

V['lightphone-cinematic-photo-scroll-quote-hero-device-tool-menu-starfield'] = (root, T) => {
  theme(root, T, { bg: '#000000', fg: '#ffffff', ac: '#ffffff', dark: true });
  const SN = "'Futura PT','Futura','Outfit Variable','Jost',Helvetica,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W = 1440, Hh = 862;
  css(`.lp{position:absolute;inset:0;overflow:hidden;background:#000;color:#fff;font-family:${SN};font-weight:400}
.lp *{box-sizing:border-box}
.lp-ph{position:absolute;inset:0;overflow:hidden}
.lp-ph canvas{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .9s ease;will-change:opacity,transform}
.lp-ph canvas.on{opacity:1}
.lp-sc{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none}.lp-sc::-webkit-scrollbar{display:none}
.lp-hd{position:absolute;left:0;right:0;top:0;height:76px;z-index:10;display:flex;align-items:center;padding:0 32px;pointer-events:none;color:var(--lp-ui,#fff);transition:color .4s}
.lp-hd>*{pointer-events:auto}
.lp-wm{font:300 italic 29px ${SN};letter-spacing:.01em;cursor:pointer;transform:skewX(-10deg);display:inline-block}
.lp-dev{position:absolute;left:50%;transform:translateX(-50%);font:400 12.5px ${SN};cursor:pointer;letter-spacing:.01em}.lp-dev:hover{text-decoration:underline}
.lp-hd .sp{flex:1}.lp .lp-menu{font:500 17px ${SN};margin-right:24px;cursor:pointer;background:none;border:0;color:inherit;padding:0}
.lp .lp-shop{height:48px;width:93px;background:#fff;color:#111;border:0;font:400 17px ${SN};cursor:pointer;transition:background .2s}.lp-shop:hover{background:#ddd}
.lp.lt .lp-shop{background:#111;color:#fff}
.lp-sec{position:relative;min-height:${Hh}px}
.lp-body{position:absolute;left:32px;max-width:860px;font:400 31px/1.38 ${SN};letter-spacing:.003em;text-shadow:0 1px 18px #0003}
.lp-q{position:absolute;display:grid;grid-template-columns:28px 1fr;max-width:300px;font:400 14.5px/1.55 ${SN};letter-spacing:.01em;opacity:0;transform:translateY(16px);transition:opacity 1s,transform 1.2s}
.lp-q.on{opacity:1;transform:none}.lp-q i{width:9px;height:9px;border-radius:50%;background:#fff;margin-top:5px}
.lp-wrap{position:relative;height:${Hh * 2.3}px}
.lp-mock{position:sticky;top:${Hh / 2 - 190}px;margin:0 auto;width:296px;height:420px;border:1.5px solid #ffffffd0;border-radius:12px;overflow:hidden;z-index:3;backdrop-filter:blur(1.5px)}
.lp-mock ul{list-style:none;margin:0;padding:0;position:absolute;left:0;right:0;top:0;will-change:transform}
.lp-mock li{height:58px;display:grid;place-items:center;font:400 31px ${SN};cursor:pointer;transition:opacity .3s,letter-spacing .3s}
.lp-mock li:hover{letter-spacing:.03em}.lp-mock li.sel{text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:1.5px}
.lp-mock .dots{position:absolute;right:12px;top:50%;transform:translateY(-50%);display:grid;gap:7px}.lp-mock .dots i{width:5px;height:5px;border-radius:50%;background:#ffffff55;transition:background .2s}.lp-mock .dots i.on{background:#fff}
.lp-cap{position:sticky;top:${Hh / 2 + 248}px;margin:0 auto;width:max-content;display:flex;gap:12px;align-items:center;font:400 13px ${SN};cursor:pointer;z-index:3;margin-top:-40px}
.lp-cap i{width:9px;height:9px;border-radius:50%;background:#fff}
.lp-stars{position:relative;height:${Hh * 1.9}px;background:#000;overflow:hidden}
.lp-stars canvas{position:sticky;top:0;display:block;width:100%;height:${Hh}px}
.lp-eye{position:absolute;left:50%;top:120px;width:360px;margin-left:-180px}
.lp-stars .cap2{position:absolute;left:50%;top:410px;transform:translateX(-50%);display:flex;gap:12px;align-items:center;font:400 13px ${SN}}.lp-stars .cap2 i{width:9px;height:9px;border-radius:50%;background:#fff}
.lp-mani{position:absolute;left:32px;top:${Hh * 0.95}px;max-width:820px;font:400 31px/1.38 ${SN}}
.lp-peek{position:absolute;left:50%;width:300px;height:470px;margin-left:-150px;border-radius:30px;background:linear-gradient(160deg,#3a3a3d,#19191b);box-shadow:inset 0 0 0 2px #4a4a4f,0 -10px 60px #ffffff10;will-change:transform}
.lp-peek::before{content:'';position:absolute;left:24px;top:24px;width:12px;height:12px;border-radius:50%;background:#0b0b0c;box-shadow:inset 0 0 0 2px #333}
.lp-peek::after{content:'';position:absolute;left:22px;right:22px;top:56px;bottom:90px;border-radius:6px;background:#0d0d0e}
.lp-os{position:relative;height:${Hh * 2}px}
.lp-os .stk{position:sticky;top:0;height:${Hh}px}
.lp-phone{position:absolute;left:576px;top:150px;width:270px;height:400px;border-radius:14px;background:linear-gradient(170deg,#3b3b3e,#1d1d20 70%);box-shadow:inset 0 0 0 2px #505055,0 30px 60px #0006}
.lp-phone .cam{position:absolute;left:18px;top:14px;width:13px;height:13px;border-radius:50%;background:#111;box-shadow:inset 0 0 0 2px #444}
.lp-phone .spk{position:absolute;left:0;right:0;bottom:0;height:42px;border-radius:0 0 14px 14px;background-image:radial-gradient(circle,#0c0c0d 1.6px,transparent 2px);background-size:9px 9px;background-color:#29292b}
.lp-phone .scr{position:absolute;left:24px;right:24px;top:44px;bottom:58px;display:grid;place-items:center;font:400 22px ${SN};color:#e8e8e8;transition:opacity .25s}
.lp-phone .scr.fade{opacity:0}
.lp-phone .kp{display:grid;grid-template-columns:repeat(3,52px);gap:10px 12px;text-align:center}
.lp-phone .tl{display:grid;gap:10px;text-align:center;font-size:21px}
.lp-phone .dr{display:grid;gap:10px;justify-items:center;font-size:15px;text-align:center}.lp-phone .dr b{font:300 54px/1 ${SN}}
.lp-phone .side{position:absolute;right:-6px;top:120px;width:6px;height:46px;border-radius:0 3px 3px 0;background:#2a2a2d}.lp-phone .side.b{top:190px;height:30px}
.lp-feat{position:absolute;left:1032px;top:190px;width:330px;border-left:0}
.lp-feat .it{position:relative;padding:0 0 0 28px;margin-bottom:24px;cursor:pointer;color:#ffffff80;transition:color .3s}
.lp-feat .it::before{content:'';position:absolute;left:0;top:0;bottom:0;width:1.5px;background:#fff;transform:scaleY(0);transform-origin:top;transition:transform .45s}
.lp-feat .it.on{color:#fff}.lp-feat .it.on::before{transform:none}
.lp-feat h4{margin:0;font:400 19px ${SN};letter-spacing:.01em}.lp-feat p{margin:8px 0 0;font:400 14.5px/1.5 ${SN};display:none}.lp-feat .it.on p{display:block}
.lp-feat button{margin:14px 0 0 28px;height:40px;padding:0 24px;background:transparent;border:1px solid #ffffffa0;color:#fff;font:400 14px ${SN};cursor:pointer}.lp-feat button:hover{background:#ffffff1a}
.lp-two{background:#ededed;color:#111;padding:120px 32px 140px;min-height:${Hh}px}
.lp-two h3{margin:0 0 80px;font:400 31px/1.38 ${SN};max-width:700px}
.lp-pr{display:grid;grid-template-columns:1fr 1fr;gap:40px;max-width:1100px;margin:0 auto}
.lp-pr>div{display:grid;justify-items:center;gap:12px;text-align:center}
.lp-pr .dv{height:260px;display:grid;place-items:end center}
.lp-pr b{font:500 22px ${SN}}.lp-pr span{font:400 15px ${SN};color:#444}
.lp-pr .bt{display:flex;gap:10px}.lp-pr button{height:40px;padding:0 22px;font:400 14px ${SN};border:1px solid #111;background:transparent;cursor:pointer}.lp-pr button.k{background:#111;color:#fff}
.lp-ft{background:#ededed;color:#111;padding:40px 32px 200px;border-top:1px solid #d4d4d4;display:grid;grid-template-columns:1fr 1fr;gap:40px;font:400 15px/1.6 ${SN}}
.lp-ft nav{display:flex;flex-wrap:wrap;gap:6px 22px}.lp-ft nav a{cursor:pointer}.lp-ft nav a:hover{text-decoration:underline}
.lp-ft form{display:flex;border-bottom:1px solid #111}.lp-ft input{flex:1;border:0;background:none;font:400 15px ${SN};padding:10px 0;outline:none}.lp-ft form button{border:0;background:none;font:400 15px ${SN};cursor:pointer}
.lp-ck{position:absolute;left:0;right:0;bottom:0;height:140px;background:#000;z-index:12;display:flex;justify-content:center;align-items:center;gap:24px;font:400 21px ${SN};transition:transform .5s cubic-bezier(.6,0,.2,1)}
.lp-ck.off{transform:translateY(100%)}.lp-ck a{color:#fff;text-decoration:underline;text-underline-offset:4px;cursor:pointer}
.lp-ck button{height:62px;padding:0 13px;background:#000;border:2px solid #fff;color:#fff;font:500 30px ${SN};cursor:pointer;letter-spacing:.005em}.lp-ck button:hover{background:#fff;color:#000}
.lp-nav{position:absolute;inset:0;z-index:11;background:#000;display:grid;align-content:center;justify-items:start;padding-left:32px;gap:4px;opacity:0;pointer-events:none;transition:opacity .4s}
.lp-nav.on{opacity:1;pointer-events:auto}.lp-nav a{font:300 52px/1.18 ${SN};cursor:pointer;opacity:.85;transition:opacity .2s,transform .3s}.lp-nav a:hover{opacity:1;transform:translateX(8px)}
.lp.nav .lp-hd{color:#fff}
@media (prefers-reduced-motion: reduce){.lp *{transition:none!important;animation:none!important}}
`);
  const el = h('div.lp'); root.append(el);
  // ---------- code-painted "photographs" (stand-ins for the real photography) ----------
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = Hh; return c; };
  const grain = (g, a = 14) => { const im = g.getImageData(0, 0, W, Hh), d = im.data; for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * a; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(im, 0, 0); };
  const vign = (g, a = 0.45) => { const r = g.createRadialGradient(W / 2, Hh / 2, Hh * 0.3, W / 2, Hh / 2, W * 0.75); r.addColorStop(0, 'rgba(0,0,0,0)'); r.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = r; g.fillRect(0, 0, W, Hh); };
  const puff = (g, x, y, r, c) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, c); gr.addColorStop(0.55, c.replace(/[\d.]+\)$/, (m) => (parseFloat(m) * 0.6).toFixed(2) + ')')); gr.addColorStop(1, c.replace(/[\d.]+\)$/, '0)')); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const cloud = (g, R, cx, cy, w, hh, n) => { const pts = Array.from({ length: n }, () => { const a = R() * 6.283, d = Math.sqrt(R()); return [cx + Math.cos(a) * d * w, cy + Math.sin(a) * d * hh * (Math.sin(a) < 0 ? 1 : 0.55), 30 + R() * 70]; });
    pts.forEach(([x, y, r]) => puff(g, x + 10, y + r * 0.45, r * 1.15, 'rgba(110,124,128,0.30)')); pts.forEach(([x, y, r]) => puff(g, x, y, r, 'rgba(206,210,204,0.50)')); pts.forEach(([x, y, r]) => puff(g, x - r * 0.2, y - r * 0.35, r * 0.62, 'rgba(236,238,232,0.45)')); };
  const paintSky = (seed, low) => { const c = mk(), g = c.getContext('2d'), N = noise2(seed); const cw = 720, ch = 431, sm = document.createElement('canvas'); sm.width = cw; sm.height = ch; const sg = sm.getContext('2d'), im = sg.createImageData(cw, ch), d = im.data;
    const M = low ? [[720, 1000, 1050, 300], [150, 800, 260, 90], [1300, 790, 280, 100]] : [[250, 340, 340, 440], [1370, 330, 210, 190], [1120, 930, 600, 280], [480, 840, 420, 150], [1180, 110, 90, 45]];
    const dens = (X, Y) => { let m = 0; for (const [cx, cy, w, hh] of M) { const v = 1 - ((X - cx) / w) ** 2 - ((Y - cy) / hh) ** 2; if (v > m) m = v; } const n = (N(X / 230, Y / 230) - 0.5) * 2.4 + 0.5; return clamp((Math.min(1, m) * 0.9 + n * 0.7 - 0.6) * 1.8, 0, 1) ** 0.85; };
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const X = x * 2, Y = y * 2, t = Y / Hh, sk = [58 + t * 33, 101 + t * 29, 120 + t * 30]; const dd = dens(X, Y); let r = sk[0], gg = sk[1], b = sk[2];
      if (dd > 0) { const up = dens(X - 6, Y - 22), l = clamp(0.32 + (N(X / 70 + 50, Y / 70) - 0.5) * 1.3 + (dd - up) * 2.6 + 0.3 * (1 - t) + dd * 0.15, 0, 1), cc = [104 + l * 130, 116 + l * 120, 120 + l * 110]; r += (cc[0] - r) * dd; gg += (cc[1] - gg) * dd; b += (cc[2] - b) * dd; }
      const i = (y * cw + x) * 4; d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255; }
    sg.putImageData(im, 0, 0); g.imageSmoothingQuality = 'high'; g.filter = 'blur(1.2px)'; g.drawImage(sm, 0, 0, W, Hh); g.filter = 'none'; grain(g, 10); return c; };
  const paintPark = () => { const c = mk(), g = c.getContext('2d'), R = rng(21); g.fillStyle = '#26301f'; g.fillRect(0, 0, W, Hh);
    g.filter = 'blur(28px)'; for (let i = 0; i < 70; i++) { g.fillStyle = ['#5d6b3a', '#c8b04a', '#3a4a2a', '#8a8f5a', '#e0c85c', '#1d2616'][(R() * 6) | 0]; g.globalAlpha = 0.35 + R() * 0.5; g.beginPath(); g.arc(R() * W, R() * Hh * 0.8, 30 + R() * 90, 0, 7); g.fill(); }
    g.globalAlpha = 1; g.fillStyle = '#4d5a40'; g.fillRect(0, Hh * 0.62, W, Hh); g.filter = 'blur(6px)';
    g.filter = 'none';
    g.save(); g.translate(250, 330); g.rotate(-0.13); g.fillStyle = '#b98668'; g.beginPath(); g.ellipse(-30, 225, 105, 85, -0.3, 0, 7); g.fill(); g.fillStyle = '#16181c'; g.beginPath(); g.roundRect(-120, -190, 240, 360, 18); g.fill(); g.strokeStyle = '#3a3d44'; g.lineWidth = 3; g.stroke();
    g.fillStyle = '#f2f2f2'; g.font = `500 32px ${SN}`; g.textAlign = 'center'; ['Calendar', 'Podcast', 'Timer', 'Notes'].forEach((t, i) => { g.globalAlpha = i === 3 ? 0.4 : 1; g.fillText(t, 0, -70 + i * 52); }); g.globalAlpha = 1;
    g.fillStyle = '#c9967a'; g.save(); g.translate(-104, 110); g.rotate(-0.55); g.beginPath(); g.roundRect(-26, -80, 52, 170, 26); g.fill(); g.restore(); [[-40, 18], [30, 16], [96, 14]].forEach(([y, r]) => { g.beginPath(); g.roundRect(108, y, 40, r * 2, r); g.fill(); });
    g.fillStyle = '#e7e7e7'; g.beginPath(); g.arc(80, 30, 5, 0, 7); g.fill(); g.restore();
    const sh = g.createLinearGradient(0, 0, W, 0); sh.addColorStop(0, 'rgba(0,0,0,.35)'); sh.addColorStop(0.6, 'rgba(0,0,0,0)'); g.fillStyle = sh; g.fillRect(0, 0, W, Hh); grain(g, 16); return c; };
  const paintRoad = () => { const c = mk(), g = c.getContext('2d'), R = rng(5); const sk = g.createLinearGradient(0, 0, 0, Hh * 0.5); sk.addColorStop(0, '#53707f'); sk.addColorStop(1, '#8c9ba0'); g.fillStyle = sk; g.fillRect(0, 0, W, Hh);
    const hz = Hh * 0.47; g.fillStyle = '#6e6f6c'; g.beginPath(); g.moveTo(0, hz + 10); for (let x = 0; x <= W; x += 20) g.lineTo(x, hz - 40 - Math.sin(x / 210) * 26 - Math.sin(x / 70 + 1) * 8 - (x > 300 && x < 900 ? 22 : 0)); g.lineTo(W, hz + 10); g.fill();
    g.fillStyle = '#7d725c'; g.fillRect(0, hz, W, Hh); const gr = g.createLinearGradient(0, hz, 0, Hh); gr.addColorStop(0, '#8a8068'); gr.addColorStop(1, '#5a5244'); g.fillStyle = gr; g.fillRect(0, hz, W, Hh);
    for (let i = 0; i < 260; i++) { const y = hz + Math.pow(R(), 1.6) * (Hh - hz), s = 3 + (y - hz) / (Hh - hz) * 60, x = R() * W; if (Math.abs(x - W / 2) < (y - hz) * 1.25 + 30) continue; g.fillStyle = ['#3b4630', '#4b5636', '#2e3626'][(R() * 3) | 0]; g.beginPath(); g.ellipse(x, y, s, s * 0.6, 0, 0, 7); g.fill(); }
    const vx = W / 2 + 10; g.fillStyle = '#4f5151'; g.beginPath(); g.moveTo(vx - 8, hz); g.lineTo(vx + 8, hz); g.lineTo(W * 1.05, Hh); g.lineTo(-W * 0.05, Hh); g.fill();
    g.strokeStyle = '#d9d6cc'; g.lineWidth = 3; g.beginPath(); g.moveTo(vx - 6, hz); g.lineTo(-W * 0.02, Hh); g.moveTo(vx + 6, hz); g.lineTo(W * 1.02, Hh); g.stroke();
    g.fillStyle = '#c9a64a'; g.beginPath(); g.moveTo(vx - 1, hz); g.lineTo(vx + 1, hz); g.lineTo(vx + 9, Hh); g.lineTo(vx - 9, Hh); g.fill();
    g.fillStyle = '#2a2c30'; g.fillRect(vx - 6, hz + 18, 12, 30); g.beginPath(); g.arc(vx, hz + 14, 6, 0, 7); g.fill();
    const dim = g.createLinearGradient(0, 0, 0, Hh); dim.addColorStop(0, 'rgba(20,30,40,.25)'); dim.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = dim; g.fillRect(0, 0, W, Hh); grain(g, 14); return c; };
  const paintBridge = () => { const c = mk(), g = c.getContext('2d'), R = rng(8); const sk = g.createLinearGradient(0, 0, 0, Hh); sk.addColorStop(0, '#9aa3ab'); sk.addColorStop(1, '#c8c4bf'); g.fillStyle = sk; g.fillRect(0, 0, W, Hh);
    const vx = 760, vy = 430; for (let i = 0; i < 26; i++) { const x = 820 + R() * 620, hb = 60 + R() * 260; g.fillStyle = ['#7d7570', '#8d837c', '#6a6560'][(R() * 3) | 0]; g.fillRect(x, vy - hb, 30 + R() * 60, hb + 20); }
    g.fillStyle = '#5c5a5c'; g.fillRect(230, 0, 26, vy + 40); g.fillRect(1180, 0, 34, vy + 60);
    g.fillStyle = '#6f6668'; g.beginPath(); g.moveTo(vx - 30, vy); g.lineTo(vx + 30, vy); g.lineTo(W * 1.3, Hh); g.lineTo(-W * 0.3, Hh); g.fill();
    g.strokeStyle = '#c86c7c'; [[-1, 280], [1, 300]].forEach(([sd, top]) => { for (let k = 0; k < 4; k++) { g.lineWidth = 3 + k; g.beginPath(); g.moveTo(vx + sd * 40, vy - 20 + k * 8); g.lineTo(sd < 0 ? -40 : W + 40, top + k * 70); g.stroke(); } for (let t = 0; t < 1; t += 0.035) { const e = t * t; const x = vx + sd * 40 + (sd < 0 ? -40 - vx - sd * 40 : W + 40 - vx - sd * 40) * e, y1 = vy - 20 + (top - vy + 20) * e, y2 = vy + 4 + (top + 210 - vy - 4) * e; g.lineWidth = 1 + e * 10; g.beginPath(); g.moveTo(x, y1); g.lineTo(x, y2); g.stroke(); } });
    g.fillStyle = '#3d3a3b'; g.beginPath(); g.arc(vx + 20, vy + 46, 7, 0, 7); g.fill(); g.fillRect(vx + 14, vy + 52, 12, 30);
    const dim = g.createLinearGradient(0, 0, 0, Hh); dim.addColorStop(0, 'rgba(30,30,40,.2)'); dim.addColorStop(1, 'rgba(0,0,0,.4)'); g.fillStyle = dim; g.fillRect(0, 0, W, Hh); grain(g, 14); return c; };
  const paintGold = () => { const c = mk(), g = c.getContext('2d'), R = rng(31); const bg = g.createLinearGradient(0, 0, W, Hh); bg.addColorStop(0, '#3e5a2c'); bg.addColorStop(1, '#1f2b17'); g.fillStyle = bg; g.fillRect(0, 0, W, Hh);
    g.filter = 'blur(30px)'; for (let i = 0; i < 50; i++) { g.fillStyle = ['#6f8c3c', '#a8b860', '#2b3a1e', '#f0d890'][(R() * 4) | 0]; g.globalAlpha = 0.3 + R() * 0.5; g.beginPath(); g.arc(R() * W, R() * Hh * 0.7, 40 + R() * 120, 0, 7); g.fill(); }
    g.globalAlpha = 0.9; const sun = g.createRadialGradient(1200, 120, 0, 1200, 120, 420); sun.addColorStop(0, 'rgba(255,230,170,.9)'); sun.addColorStop(1, 'rgba(255,230,170,0)'); g.fillStyle = sun; g.fillRect(0, 0, W, Hh); g.filter = 'blur(4px)'; g.globalAlpha = 1;
    g.fillStyle = '#c38f6d'; g.beginPath(); g.ellipse(900, 330, 110, 135, 0, 0, 7); g.fill(); g.fillStyle = '#23272c'; g.beginPath(); g.ellipse(900, 260, 120, 80, 0, Math.PI, 0); g.fill(); g.fillStyle = '#2f3b4a'; g.beginPath(); g.ellipse(900, 760, 260, 320, 0, 0, 7); g.fill();
    g.fillStyle = '#dbac8a'; g.beginPath(); g.ellipse(520, 380, 90, 110, 0, 0, 7); g.fill(); g.fillStyle = '#6b6f72'; g.beginPath(); g.ellipse(520, 300, 112, 64, -0.1, Math.PI * 1.05, -0.05); g.fill(); g.fillStyle = '#20232a'; g.beginPath(); g.ellipse(520, 760, 200, 280, 0, 0, 7); g.fill();
    g.fillStyle = '#121214'; g.beginPath(); g.roundRect(820, 470, 150, 100, 10); g.fill(); g.fillStyle = '#d2a07e'; g.beginPath(); g.ellipse(800, 540, 44, 60, 0.5, 0, 7); g.fill(); g.beginPath(); g.ellipse(990, 530, 40, 58, -0.5, 0, 7); g.fill(); g.filter = 'none';
    const dim = g.createLinearGradient(0, 0, W, 0); dim.addColorStop(0, 'rgba(0,0,0,.3)'); dim.addColorStop(0.5, 'rgba(0,0,0,0)'); dim.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = dim; g.fillRect(0, 0, W, Hh); grain(g, 16); return c; };
  const photos = [paintSky(11, false), paintPark(), paintRoad(), paintBridge(), paintSky(17, true), paintGold()];
  const ph = h('div.lp-ph', {}, photos); photos[0].classList.add('on'); el.append(ph);
  const sc = h('div.lp-sc'); el.append(sc);
  // ---------- sections ----------
  const QUOTES = [['“I love this phone. It will make you a happier, more present person.”', 626, 504], ['“The Light Phone has probably given me back thousands of hours.”', 320, 1040], ['“It’s like the fog in my head has finally been cleared out and I’m seeing and enjoying the world anew.”', 900, 1380]];
  const qs = QUOTES.map(([t, x, y]) => h('div.lp-q', { style: { left: x + 'px', top: y + 'px' } }, h('i'), h('span', {}, t)));
  const s0 = h('section.lp-sec', { style: { height: '1700px' }, 'data-ph': 0 }, qs);
  const s1 = h('section.lp-sec', { style: { height: '1000px' }, 'data-ph': 1 }, h('div.lp-body', { style: { top: '330px' } }, 'Light Phones are simple devices with quality tools, designed to be used as little as possible.'));
  const TOOLS = ['Phone', 'Alarm', 'Directions', 'Music', 'Notes', 'Calendar', 'Podcast', 'Timer', 'Calculator', 'Hotspot', 'Settings'];
  let sel = -1; const lis = TOOLS.map((t, i) => h('li', { onclick: () => { sel = i; lis.forEach((x, j) => x.classList.toggle('sel', j === i)); toast(`${t} — a tool, not an app`); } }, t));
  const ul = h('ul', {}, lis); const dots = h('div.dots', {}, TOOLS.map(() => h('i')));
  const mock = h('div.lp-mock', {}, ul, dots);
  let listOff = 0, manual = 0; const ROW = 58, MAXOFF = (TOOLS.length - 3) * ROW;
  const setList = (off) => { listOff = clamp(off, -ROW * 1.3, MAXOFF); ul.style.transform = `translateY(${(140 - listOff).toFixed(1)}px)`; const c = Math.round(listOff / ROW); [...dots.children].forEach((d, i) => d.classList.toggle('on', i === clamp(c + 1, 0, TOOLS.length - 1))); lis.forEach((x, i) => (x.style.opacity = (1 - Math.min(0.8, Math.abs((i * ROW + 29 + 140 - listOff) - 210) / 260)).toFixed(2))); };
  mock.addEventListener('wheel', (e) => { e.preventDefault(); manual += e.deltaY * 0.5; setList(listOff + e.deltaY * 0.5); }, { passive: false });
  const wrap = h('div.lp-wrap', {}, h('div.lp-body', { style: { top: '130px' } }, 'The value of the Light Phone is not necessarily in any specific feature, but rather the experience we call going light. In our hyper-connected lives, going light is a profound shift.'),
    h('div.lp-body', { style: { top: `${Hh * 1.42}px` } }, 'Light is an alternative to the tech monopolies that are fighting aggressively for our time & attention. We make tools that serve you, not the other way around.'),
    h('div', { style: { height: '470px' } }), mock, h('div.lp-cap', { onclick: () => toast('What is a Light Phone?') }, h('i'), 'What is a Light Phone?'));
  const s2 = h('section.lp-sec', { 'data-ph': 2 }, wrap);
  // starfield + eye + manifesto + device peeking up
  const stc = h('canvas', { width: W, height: Hh }); const SR0 = rng(99), STARS = Array.from({ length: 420 }, () => { const R = SR0; return [R() * W, R() * Hh, R() * 1.5 + 0.3, R() * 6.28, 0.4 + R() * 1.6]; });
  let st = 0; const drawStars = (t) => { const g = stc.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, W, Hh); STARS.forEach(([x, y, r, p, sp]) => { g.globalAlpha = RM ? 0.8 : 0.45 + 0.55 * Math.abs(Math.sin(p + t * 0.0012 * sp)); g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }); g.globalAlpha = 1; st++; };
  const eye = h('div.lp-eye', { html: `<svg viewBox="0 0 360 260"><path d="M10 130 Q180 -40 350 130 Q180 300 10 130Z" fill="#fff"/><path d="M10 130 Q180 -40 350 130 Q180 300 10 130Z" fill="none" stroke="#000" stroke-width="3"/><circle cx="180" cy="130" r="78" fill="#e993c5" stroke="#111" stroke-width="5"/>
    <g transform="rotate(-8 180 130)"><rect x="150" y="70" width="60" height="104" rx="9" fill="#e993c5" stroke="#111" stroke-width="4"/><path d="M160 92h40M160 108h40M160 124h40M160 140h30" stroke="#111" stroke-width="3.5"/><path d="M128 150 q20 -30 34 -6 q10 30 -14 46z" fill="#e993c5" stroke="#111" stroke-width="4" stroke-linejoin="round"/></g></svg>` });
  const peek = h('div.lp-peek');
  const stars = h('section.lp-stars', { 'data-ph': -1 }, stc, eye, h('div.cap2', {}, h('i'), 'A radically different phone'), h('div.lp-mani', {}, 'The Light operating system, LightOS, is built around intentionality & privacy.'), peek);
  // LightOS feature steps with device
  const FEATS = [['It’s a phone.', 'At its core, it is a simple communication device for staying in touch with those that matter most.', 'kp'], ['Just the tools you’ll need.', 'LightOS is built around a customizable menu of tools managed from the dashboard website.', 'tl'], ['Find your way around the real world.', 'With tools like directions, LightOS brings the most useful aspects of technology without endless feeds of distraction.', 'dr'], ['Be intentional, you’re in control.', 'Every tool is designed for very intentional utility. No getting lost in a scroll hole.', 'ck']];
  const scr = h('div.scr'); const SCR = { kp: () => h('div.kp', {}, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', '', '×', ''].map((k) => h('span', {}, k))), tl: () => h('div.tl', {}, ['Phone', 'Alarm', 'Directions', 'Music', 'Notes'].map((k) => h('span', {}, k))), dr: () => h('div.dr', {}, h('b', {}, '↰'), h('span', {}, 'Turn left on Morris Ave'), h('span', { style: { opacity: 0.6 } }, '200 ft · 4 min')), ck: () => h('div.dr', {}, h('b', {}, '9:41'), h('span', {}, 'Sun Oct 11'), h('span', { style: { opacity: 0.6 } }, 'no notifications')) };
  let fi = -1; const items = FEATS.map(([t, p], i) => h('div.it', { onclick: () => setFeat(i, true) }, h('h4', {}, t), h('p', {}, p)));
  const setFeat = (i, jump) => { if (i === fi) return; fi = i; items.forEach((x, j) => x.classList.toggle('on', j === i)); scr.classList.add('fade'); const k = FEATS[i][2]; setTimeout(() => { scr.replaceChildren(SCR[k]()); scr.dataset.k = k; scr.classList.remove('fade'); }, RM ? 0 : 180);
    if (jump) { const y = os.offsetTop + (i / FEATS.length) * Hh * 1.0 + 5; sc.scrollTop = y; } };
  const phone = h('div.lp-phone', {}, h('div.cam'), h('div.side'), h('div.side.b'), scr, h('div.spk'));
  const os = h('section.lp-os', { 'data-ph': 4 }, h('div.stk', {}, phone, h('div.lp-feat', {}, items, h('button', { onclick: () => toast('How it works →') }, 'Read more about how it works'))));
  const s5 = h('section.lp-sec', { style: { height: '1100px' }, 'data-ph': 5 }, h('div.lp-body', { style: { top: '300px', maxWidth: '640px' } }, 'Going light can be whatever you’d like it to be.'),
    h('div.lp-feat', { style: { top: '300px' } }, [['Stay present during precious moments.', 'What are you missing out on when you pull out your smartphone hundreds of times a day? Life is just too short.'], ['Take your passions seriously.', 'Going light gives you the space you need to focus on what really moves and inspires you.'], ['A breath of fresh air.', 'It’s so refreshing to break free from your smartphone habits and the perpetual feeling of missing out.']].map(([t, p], i) => { const it = h('div.it' + (i ? '' : '.on'), {}, h('h4', {}, t), h('p', {}, p)); it.onclick = () => { [...it.parentNode.children].forEach((x) => x.classList.toggle('on', x === it)); }; return it; })));
  const dev3 = `<svg width="170" height="250" viewBox="0 0 170 250"><rect x="4" y="4" width="162" height="242" rx="14" fill="#2d2d30" stroke="#55555a" stroke-width="3"/><rect x="16" y="30" width="138" height="170" rx="4" fill="#111"/><circle cx="24" cy="17" r="5" fill="#111"/><text x="85" y="100" fill="#ddd" text-anchor="middle" style="font:400 15px ${SN}">Camera</text><text x="85" y="124" fill="#ddd" text-anchor="middle" style="font:400 15px ${SN}">Phone</text><text x="85" y="148" fill="#999" text-anchor="middle" style="font:400 15px ${SN}">Notes</text><rect x="16" y="210" width="138" height="26" rx="4" fill="#202022"/></svg>`;
  const flip = `<svg width="110" height="190" viewBox="0 0 110 190"><rect x="5" y="5" width="100" height="180" rx="12" fill="#1c1c1e" stroke="#47474b" stroke-width="3"/><rect x="5" y="92" width="100" height="6" fill="#0c0c0d"/><rect x="30" y="26" width="50" height="40" rx="3" fill="#0d0d0e"/><text x="55" y="51" fill="#bbb" text-anchor="middle" style="font:400 10px ${SN}">10:24</text></svg>`;
  const two = h('section.lp-two', { 'data-ph': -2 }, h('h3', {}, 'There are two different Light Phones, depending on how light you want to go.'), h('div.lp-pr', {}, [['Light Phone III', 'Moves at the speed of light, now with a camera.', dev3], ['Light Flip', 'Timeless tactile form factor.', flip]].map(([n, t, svg]) => h('div', {}, h('div.dv', { html: svg }), h('b', {}, n), h('span', {}, t), h('div.bt', {}, h('button', { onclick: () => toast(`${n}: learn more`) }, 'Learn more'), h('button.k', { onclick: () => toast(`${n} added to cart`) }, 'Buy'))))));
  const ft = h('footer.lp-ft', { 'data-ph': -2 }, h('div', {}, h('nav', {}, ['light', 'blog', 'plans', 'shop', 'faq', 'dashboard', 'support', 'about us'].map((t) => h('a', { onclick: () => toast(t) }, t))), h('p', { style: { color: '#666' } }, 'the light phone inc. 19 morris avenue brooklyn, ny 11205')),
    h('div', {}, h('form', { onsubmit: (e) => { e.preventDefault(); toast('successfully submitted your email'); e.target.reset(); } }, h('input', { placeholder: 'subscribe to our newsletter, sent sparingly', type: 'email' }), h('button', {}, 'submit')), h('p', { style: { color: '#666' } }, 'terms · privacy policy · return policy · investment')));
  sc.append(s0, s1, s2, stars, os, s5, two, ft);
  // ---------- fixed chrome ----------
  const nav = h('div.lp-nav', {}, ['Light Phone III', 'Light Flip', 'plans', 'shop', 'blog', 'faq', 'about us'].map((t) => h('a', { onclick: () => { setNav(false); toast(t); } }, t)));
  const setNav = (on) => { nav.classList.toggle('on', on); el.classList.toggle('nav', on); menuB.textContent = on ? 'close' : 'menu'; };
  const menuB = h('button.lp-menu', { onclick: () => setNav(!nav.classList.contains('on')) }, 'menu');
  const hd = h('header.lp-hd', {}, h('span.lp-wm', { onclick: () => { setNav(false); sc.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); } }, 'light'), h('span.lp-dev', { onclick: () => toast('Developer program →') }, 'Learn about our developer program !'), h('span.sp'), menuB, h('button.lp-shop', { onclick: () => toast('shop →') }, 'shop'));
  const ckB = h('button', { onclick: () => ck.classList.add('off') }, 'acknowledged');
  const ck = h('div.lp-ck', {}, h('span', {}, 'The internet can be sketchy. ', h('a', { onclick: () => toast('cookie policy') }, 'view our cookie policy')), ckB);
  el.append(nav, hd, ck);
  // ---------- scroll logic: photo swaps, quotes, list-in-device, starfield, feature steps ----------
  const SECS = [s0, s1, s2, stars, os, s5, two, ft]; let curPh = 0;
  const setPh = (i) => { if (i === curPh) return; curPh = i; photos.forEach((c, j) => c.classList.toggle('on', j === i)); };
  const update = () => { const y = sc.scrollTop, mid = y + Hh * 0.5; let sec = SECS[0]; for (const s1_ of SECS) if (s1_.offsetTop <= mid) sec = s1_;
    let pi = +sec.dataset.ph; if (sec === s2 && mid > s2.offsetTop + Hh * 1.3) pi = 3; setPh(pi); el.classList.toggle('lt', pi === -2); el.style.setProperty('--lp-ui', pi === -2 ? '#111' : '#fff');
    if (!RM && pi >= 0) { const p = clamp((y - sec.offsetTop) / Math.max(1, sec.offsetHeight), -0.2, 1.2); photos[pi].style.transform = `scale(1.08) translateY(${(-p * 24).toFixed(1)}px)`; }
    qs.forEach((q, i) => q.classList.toggle('on', y + Hh * 0.85 > QUOTES[i][2] && y < QUOTES[i][2] + 80));
    const wp = (y - s2.offsetTop + Hh * 0.2) / (wrap.offsetHeight - Hh * 0.4); setList(clamp(wp, 0, 1) * MAXOFF + manual);
    const sp = (y - stars.offsetTop) / (stars.offsetHeight - Hh); peek.style.top = `${Hh * 1.9 - 120 - clamp(sp, 0, 1) * 160}px`;
    const op = (y - os.offsetTop) / Hh; if (op > -0.5 && op < 1.2) setFeat(clamp(Math.floor(op * FEATS.length), 0, FEATS.length - 1));
  };
  sc.addEventListener('scroll', () => { manual *= 0.9; update(); }, { passive: true });
  const loop = (t) => { if (!el.isConnected) return; const y = sc.scrollTop; if (y + Hh > stars.offsetTop && y < stars.offsetTop + stars.offsetHeight) drawStars(t); requestAnimationFrame(loop); };
  drawStars(0); setFeat(0); update(); if (!RM) requestAnimationFrame(loop); setTimeout(() => qs[0].classList.add('on'), RM ? 0 : 500);
  // ---------- demo proof ----------
  const go = (y) => { sc.scrollTop = y; update(); };
  window.__demoProof = async () => { const o = []; manual = 0; go(0); ck.classList.remove('off');
    o.push(`hero sky photo on=${photos[0].classList.contains('on')}, quote visible=${qs[0].classList.contains('on')}`);
    const seq = []; for (const s_ of SECS.slice(0, 6)) { go(s_.offsetTop + 60); seq.push(curPh); } o.push(`photo swaps by section [${seq.join(',')}] (-1 = starfield)`);
    go(s2.offsetTop); const a = Math.round(listOff / ROW); go(s2.offsetTop + wrap.offsetHeight - Hh); const b = Math.round(listOff / ROW); o.push(`device tool list scrolls inside mock: row ${a} (${TOOLS[clamp(a + 1, 0, 10)]}) → row ${b} (${TOOLS[clamp(b + 1, 0, 10)]})`);
    lis[2].click(); o.push(`tap tool → "${TOOLS[sel]}" selected`); lis[2].classList.remove('sel'); sel = -1;
    go(stars.offsetTop + 200); const f0 = st; await sleep(RM ? 0 : 300); o.push(`starfield frames +${st - f0}${RM ? ' (static: reduced motion)' : ''}, device peek top=${peek.style.top}`);
    go(os.offsetTop); items[2].click(); await sleep(260); o.push(`LightOS step → "${FEATS[fi][0]}" screen=${scr.dataset.k}`);
    setNav(true); o.push(`menu overlay open=${nav.classList.contains('on')}`); setNav(false);
    ckB.click(); o.push(`cookie bar acknowledged → hidden=${ck.classList.contains('off')}`);
    ck.classList.remove('off'); manual = 0; go(0); setFeat(0); document.querySelector('.tg-toast')?.classList.remove('on'); o.push(`restored: top, sky photo, cookie bar back`); return o.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['dither-param-studio'])(root, T); }
