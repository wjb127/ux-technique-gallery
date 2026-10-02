import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, noise2, fitCanvas } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle } from '../kit.js';
const V = {};
// ---------- falling sand
V['falling-sand-particle-sandbox'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', panel: '#fff', ac: '#e91e63', dark: false });
  const W = 300, H = 300; const E = { empty: 0, wall: 1, sand: 2, water: 3, plant: 4, fire: 5, lava: 6, ice: 7, gas: 8, stone: 9, seed: 10, dust: 11 };
  const COL = ['#f5e6e8', '#7a7a7a', '#e0b86a', '#4a90e2', '#5cb85c', '#ff6a00', '#e0401e', '#bfe8ff', '#cdb4db', '#8d8d8d', '#a0522d', '#d9c2a0'];
  const g = new Uint8Array(W * H); const cv = h('canvas', { width: W, height: H, style: { width: '640px', height: '640px', imageRendering: 'pixelated', cursor: 'crosshair', touchAction: 'none' } });
  const ctx = cv.getContext('2d'); const img = ctx.createImageData(W, H); let cur = 2, size = 6, paused = false;
  const rgb = COL.map((c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]);
  const get = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 1 : g[y * W + x]);
  const swap = (a, b) => { const t = g[a]; g[a] = g[b]; g[b] = t; };
  const step = () => { for (let y = H - 1; y >= 0; y--) { const dir = Math.random() < 0.5 ? 1 : -1; for (let xi = 0; xi < W; xi++) { const x = dir > 0 ? xi : W - 1 - xi; const i = y * W + x, t = g[i]; if (t === 2 || t === 11 || t === 10) { const d = Math.random() < 0.5 ? 1 : -1; if (get(x, y + 1) === 0 || get(x, y + 1) === 3) swap(i, i + W); else if (get(x + d, y + 1) === 0 || get(x + d, y + 1) === 3) swap(i, i + W + d); else if (t === 10 && get(x, y + 1) === 2 && Math.random() < 0.02) g[i] = 4; } else if (t === 3 || t === 6) { const d = Math.random() < 0.5 ? 1 : -1; if (get(x, y + 1) === 0) swap(i, i + W); else if (get(x + d, y + 1) === 0) swap(i, i + W + d); else if (get(x + d, y) === 0) swap(i, i + d); if (t === 6) for (const n of [1, -1, W, -W]) { const j = i + n; if (j >= 0 && j < W * H) { if (g[j] === 3) { g[j] = 9; g[i] = 9; } else if (g[j] === 4 && Math.random() < 0.3) g[j] = 5; } } } else if (t === 4) { for (const n of [1, -1, W, -W]) { const j = i + n; if (j >= 0 && j < W * H && g[j] === 3 && Math.random() < 0.05) g[j] = 4; } } else if (t === 5) { if (Math.random() < 0.1) { g[i] = Math.random() < 0.3 ? 8 : 0; continue; } for (const n of [1, -1, W, -W]) { const j = i + n; if (j >= 0 && j < W * H && (g[j] === 4 || g[j] === 11) && Math.random() < 0.5) g[j] = 5; } if (get(x, y - 1) === 0 && Math.random() < 0.5) swap(i, i - W); } else if (t === 8) { const d = Math.floor(Math.random() * 3) - 1; if (Math.random() < 0.02) g[i] = 0; else if (get(x + d, y - 1) === 0) swap(i, i - W + d); } else if (t === 7) { for (const n of [1, -1, W, -W]) { const j = i + n; if (j >= 0 && j < W * H && g[j] === 3 && Math.random() < 0.01) g[j] = 7; } } } } };
  const render = () => { for (let i = 0; i < W * H; i++) { const c = rgb[g[i]]; const v = g[i] ? ((i * 2654435761) >>> 28) - 8 : 0; img.data[i * 4] = c[0] + v; img.data[i * 4 + 1] = c[1] + v; img.data[i * 4 + 2] = c[2] + v; img.data[i * 4 + 3] = 255; } ctx.putImageData(img, 0, 0); };
  const paint = (px, py, t) => { for (let y = -size; y <= size; y++) for (let x = -size; x <= size; x++) if (x * x + y * y <= size * size && Math.random() < 0.7) { const X = px + x, Y = py + y; if (X >= 0 && Y >= 0 && X < W && Y < H && (t === 0 || g[Y * W + X] === 0)) g[Y * W + X] = t; } };
  const at = (e) => { const p = localPos(e, cv); const r = cv.getBoundingClientRect(); return [Math.floor((p.x / r.width) * W), Math.floor((p.y / r.height) * H)]; };
  drag(cv, { start: (e) => paint(...at(e), cur), move: (e) => paint(...at(e), cur) });
  const loop = () => { if (!paused) { step(); step(); } render(); requestAnimationFrame(loop); };
  for (let x = 0; x < W; x++) for (let y = H - 34 - Math.floor(6 + 5 * Math.sin(x / 20)); y < H; y++) g[y * W + x] = 2;
  const names = Object.keys(E); const els = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px' } }, names.map((n, i) => h('button', { style: { background: i ? COL[i] : '#fff', border: i === cur ? '2px solid #111' : '1px solid #ccc', fontSize: '11px', padding: '6px 2px', color: [1, 3, 5, 6, 9, 10].includes(i) ? '#fff' : '#222', borderRadius: '3px' }, onclick: (e) => { cur = i; els.querySelectorAll('button').forEach((b) => (b.style.border = '1px solid #ccc')); e.target.style.border = '2px solid #111'; } }, n === 'empty' ? 'Erase' : n[0].toUpperCase() + n.slice(1))));
  root.style.display = 'grid'; root.style.gridTemplateColumns = '220px 1fr 200px';
  root.append(h('div', { style: { borderRight: '1px solid #eee', fontSize: '13px' } }, ...['Discover more', 'Falling Sand', 'Procedural Worlds', 'Browser Games', 'Physics Toys', 'Cellular Automata', 'Pixel Art Tools'].map((t, i) => h('div', { style: { padding: '14px', borderBottom: '1px solid #eee', color: i ? '#444' : '#e91e63', fontWeight: i ? 400 : 700 } }, t, i ? h('span', { style: { float: 'right', opacity: .4 } }, '›') : null))), h('div', { style: { display: 'grid', placeItems: 'center', background: '#faf7f8' } }, cv), h('div', { style: { padding: '8px', display: 'grid', gap: '6px', alignContent: 'start' } }, h('div.k-row', {}, btn(paused ? '▶' : '❚❚', (e) => { paused = !paused; e.target.textContent = paused ? '▶' : '❚❚'; }), btn('Reset', () => g.fill(0)), btn('Info', () => toast('Sandspiel-ish'))), slider('Brush', 1, 20, size, 1, (v) => (size = v)), els));
  loop();
  window.__demoProof = async () => { cur = 3; paint(100, 60, 3); paint(200, 40, 3); cur = 1; for (let x = 60; x < 240; x++) g[180 * W + x] = x > 140 && x < 160 ? 0 : 1; paint(150, 120, 2); paint(60, 100, 4); for (let i = 0; i < 80; i++) step(); cur = 2; return 'sand + water + wall + plant simulated 80 steps'; };
};
// ---------- webgl-ish fluid (CPU stable fluids, low-res)
V['webgl-fluid-paint-stage'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#ddd', panel: '#1a1a1a', ac: '#2fa1d6', dark: true });
  const N = 128, M = 80; const sz = N * M; const u = new Float32Array(sz), v = new Float32Array(sz), u0 = new Float32Array(sz), v0 = new Float32Array(sz), p = new Float32Array(sz), dv = new Float32Array(sz); const r = new Float32Array(sz), gg = new Float32Array(sz), b = new Float32Array(sz), r0 = new Float32Array(sz), g0 = new Float32Array(sz), b0 = new Float32Array(sz);
  const P = { diss: 0.995, vel: 0.99, curl: 30, radius: 6, bloom: true, paused: false };
  const I = (x, y) => clamp(y, 0, M - 1) * N + clamp(x, 0, N - 1);
  const samp = (f, x, y) => { x = clamp(x, 0, N - 1.001); y = clamp(y, 0, M - 1.001); const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0; const a = f[y0 * N + x0], bb = f[y0 * N + x0 + 1], c = f[(y0 + 1) * N + x0], d = f[(y0 + 1) * N + x0 + 1]; return (a * (1 - fx) + bb * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy; };
  const adv = (dst, src, k) => { for (let y = 0; y < M; y++) for (let x = 0; x < N; x++) { const i = y * N + x; dst[i] = samp(src, x - u[i], y - v[i]) * k; } };
  const cv = h('canvas', { width: N, height: M, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'blur(3px) saturate(1.4)' } }); const ctx = cv.getContext('2d'); const img = ctx.createImageData(N, M);
  const splat = (x, y, dx, dy, col) => { const R = P.radius; for (let j = -R * 2; j <= R * 2; j++) for (let i = -R * 2; i <= R * 2; i++) { const w = Math.exp(-(i * i + j * j) / (R * R)); const k = I(Math.round(x) + i, Math.round(y) + j); u[k] += dx * w; v[k] += dy * w; r[k] += col[0] * w; gg[k] += col[1] * w; b[k] += col[2] * w; } };
  const step = () => { // vorticity
    for (let y = 1; y < M - 1; y++) for (let x = 1; x < N - 1; x++) { const i = y * N + x; p[i] = v[i + 1] - v[i - 1] - (u[i + N] - u[i - N]); } for (let y = 2; y < M - 2; y++) for (let x = 2; x < N - 2; x++) { const i = y * N + x; const gx = Math.abs(p[i + 1]) - Math.abs(p[i - 1]), gy = Math.abs(p[i + N]) - Math.abs(p[i - N]); const l = Math.hypot(gx, gy) + 1e-5; u[i] += (gy / l) * p[i] * P.curl * 0.0005; v[i] -= (gx / l) * p[i] * P.curl * 0.0005; }
    for (let y = 1; y < M - 1; y++) for (let x = 1; x < N - 1; x++) { const i = y * N + x; dv[i] = -0.5 * (u[i + 1] - u[i - 1] + v[i + N] - v[i - N]); p[i] = 0; } for (let k = 0; k < 14; k++) for (let y = 1; y < M - 1; y++) for (let x = 1; x < N - 1; x++) { const i = y * N + x; p[i] = (dv[i] + p[i - 1] + p[i + 1] + p[i - N] + p[i + N]) / 4; } for (let y = 1; y < M - 1; y++) for (let x = 1; x < N - 1; x++) { const i = y * N + x; u[i] -= 0.5 * (p[i + 1] - p[i - 1]); v[i] -= 0.5 * (p[i + N] - p[i - N]); }
    u0.set(u); v0.set(v); adv(u, u0, P.vel); adv(v, v0, P.vel); r0.set(r); g0.set(gg); b0.set(b); adv(r, r0, P.diss); adv(gg, g0, P.diss); adv(b, b0, P.diss); };
  const render = () => { for (let i = 0; i < sz; i++) { img.data[i * 4] = Math.min(255, r[i] * 255); img.data[i * 4 + 1] = Math.min(255, gg[i] * 255); img.data[i * 4 + 2] = Math.min(255, b[i] * 255); img.data[i * 4 + 3] = 255; } ctx.putImageData(img, 0, 0); };
  const hue = () => { const hh = Math.random() * 6; const f = hh % 1, i = hh | 0; const c = [[1, f, 0], [1 - f, 1, 0], [0, 1, f], [0, 1 - f, 1], [f, 0, 1], [1, 0, 1 - f]][i]; return c.map((x) => x * 0.9); };
  let col = hue(); root.addEventListener('pointerdown', () => (col = hue()));
  root.addEventListener('pointermove', (e) => { const q = localPos(e, cv); const rr = cv.getBoundingClientRect(); splat((q.x / rr.width) * N, (q.y / rr.height) * M, e.movementX * 0.3, e.movementY * 0.3, col.map((x) => x * 0.3)); });
  const loop = () => { if (!P.paused) step(); render(); requestAnimationFrame(loop); };
  const burst = () => { for (let k = 0; k < 6; k++) splat(Math.random() * N, Math.random() * M, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, hue()); };
  const gui = h('div', { style: { position: 'absolute', right: '12px', top: '10px', width: '245px', background: '#1a1a1a', font: '11px Lucida Grande,sans-serif', color: '#eee', padding: '4px 6px', display: 'grid', gap: '4px' } }, h('div', { style: { background: '#000', padding: '3px' } }, 'quality · high'), slider('density diffusion', 0.95, 1, P.diss, 0.001, (x) => (P.diss = x)), slider('velocity diffusion', 0.95, 1, P.vel, 0.001, (x) => (P.vel = x)), slider('vorticity', 0, 50, P.curl, 1, (x) => (P.curl = x)), slider('splat radius', 2, 14, P.radius, 1, (x) => (P.radius = x)), toggle('paused', false, (x) => (P.paused = x)), btn('Random splats', burst), toggle('bloom', true, (x) => (cv.style.filter = x ? 'blur(3px) saturate(1.4) brightness(1.2)' : 'blur(2px)')), h('div', { style: { borderLeft: '3px solid #2fa1d6', paddingLeft: '4px' } }, 'Capture'), h('div', { style: { borderLeft: '3px solid #e61d5f', paddingLeft: '4px' } }, 'Github'));
  root.append(cv, gui); loop();
  window.__demoProof = async () => { burst(); burst(); for (let i = 0; i < 30; i++) step(); return 'random splats advected with vorticity'; };
};
// ---------- reaction diffusion
function grayScott(W, H, F, K, seed) { const A = new Float32Array(W * H).fill(1), B = new Float32Array(W * H); const R = rng(seed); for (let k = 0; k < 14; k++) { const cx = (R() * W) | 0, cy = (R() * H) | 0; for (let y = -4; y < 4; y++) for (let x = -4; x < 4; x++) B[((cy + y + H) % H) * W + ((cx + x + W) % W)] = 1; } const A2 = new Float32Array(W * H), B2 = new Float32Array(W * H); return { A, B, F, K, step(n = 1) { for (let s2 = 0; s2 < n; s2++) { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; const l = (y * W + ((x + 1) % W)), rr = y * W + ((x - 1 + W) % W), u = ((y + 1) % H) * W + x, d = ((y - 1 + H) % H) * W + x; const la = A[l] + A[rr] + A[u] + A[d] - 4 * A[i], lb = B[l] + B[rr] + B[u] + B[d] - 4 * B[i]; const ab2 = A[i] * B[i] * B[i]; A2[i] = A[i] + (1.0 * la * 0.2 - ab2 + this.F * (1 - A[i])); B2[i] = B[i] + (0.5 * lb * 0.2 - ab2 + 0) + ab2 * 0 + (0.5 * lb * 0 + 0); B2[i] = B[i] + (0.1 * lb + ab2 - (this.K + this.F) * B[i]); } A.set(A2); B.set(B2); } } }; }
V['reaction-diffusion-playground'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#1a73e8', dark: false }); root.style.overflow = 'auto';
  const MAPS = [[[90, 80, 0], [240, 220, 40]], [[250, 220, 0], [120, 40, 0]], [[60, 60, 60], [230, 230, 230]], [[20, 60, 180], [120, 220, 255]], [[10, 10, 10], [80, 220, 80]], [[140, 0, 120], [255, 200, 60]]];
  const PRE = [[0.055, 0.062], [0.029, 0.057], [0.037, 0.06], [0.03, 0.055], [0.025, 0.06], [0.039, 0.058]];
  const W = 96, H = 96; const sims = PRE.map(([F, K], i) => ({ gs: grayScott(W, H, F, K, i + 1), cv: h('canvas', { width: W, height: H, style: { width: '100%', aspectRatio: '1', imageRendering: 'auto', display: 'block' } }), map: MAPS[i] }));
  const render = (sm) => { const ctx = sm.cv.getContext('2d'); const img = ctx.createImageData(W, H); const [c0, c1] = sm.map; for (let i = 0; i < W * H; i++) { const t = clamp((sm.gs.A[i] - sm.gs.B[i]) * 1.2, 0, 1); for (let k = 0; k < 3; k++) img.data[i * 4 + k] = c1[k] + (c0[k] - c1[k]) * t; img.data[i * 4 + 3] = 255; } ctx.putImageData(img, 0, 0); };
  let sel = 0; const fs = slider('Feed rate f', 0.01, 0.1, PRE[0][0], 0.001, (x) => (sims[sel].gs.F = x)), ks = slider('Kill rate k', 0.04, 0.07, PRE[0][1], 0.0005, (x) => (sims[sel].gs.K = x));
  sims.forEach((sm, i) => { sm.cv.addEventListener('pointerdown', (e) => { sel = i; fs.set(sm.gs.F); ks.set(sm.gs.K); const p = localPos(e, sm.cv); const r = sm.cv.getBoundingClientRect(); const cx = ((p.x / r.width) * W) | 0, cy = ((p.y / r.height) * H) | 0; for (let y = -3; y < 3; y++) for (let x = -3; x < 3; x++) sm.gs.B[clamp(cy + y, 0, H - 1) * W + clamp(cx + x, 0, W - 1)] = 1; }); });
  const loop = () => { sims.forEach((sm) => { sm.gs.step(4); render(sm); }); requestAnimationFrame(loop); };
  root.append(h('div', { style: { padding: '30px 40px', maxWidth: '1300px' } }, h('h1', { style: { fontSize: '30px', margin: '0 0 12px' } }, 'Reaction-Diffusion Playground'), h('p', { style: { lineHeight: 1.6, fontSize: '14px' } }, 'Reaction-diffusion is a mathematical model describing how two chemicals might ', h('b', {}, 'react'), ' to each other as they ', h('b', {}, 'diffuse'), ' through a medium together. It was ', h('u', { style: { color: '#1a73e8' } }, 'proposed by Alan Turing in 1952'), ' as a possible explanation for how the interesting patterns of stripes and spots that are seen on the skin/fur of animals like giraffes and leopards form.'), h('p', { style: { lineHeight: 1.6, fontSize: '14px' } }, 'Each tile below runs the Gray-Scott model live. Click a tile to seed it and edit its feed/kill rates.'), h('div.k-row', { style: { gap: '20px', margin: '16px 0' } }, h('button', { style: { background: '#1a73e8', color: '#fff', border: 0, padding: '10px 18px', borderRadius: '4px' }, onclick: () => sims.forEach((sm, i) => (sm.gs = grayScott(W, H, sm.gs.F, sm.gs.K, i + 9))) }, 'Reseed all'), h('div', { style: { width: '220px' } }, fs), h('div', { style: { width: '220px' } }, ks))), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)' } }, sims.map((sm) => sm.cv)));
  sims.forEach((sm) => sm.gs.step(600)); loop();
  window.__demoProof = async () => 'six Gray-Scott tiles evolving live';
};
// ---------- orb farm
V['orb-farm-ecosystem-terrarium'] = (root, T) => {
  theme(root, T, { bg: '#c9d4dd', fg: '#111', ac: '#335', dark: false }); root.style.fontFamily = 'Tahoma,Verdana,sans-serif'; root.style.fontSize = '12px';
  const W = 200, H = 150; const cv = h('canvas', { width: W, height: H, style: { width: '640px', height: '480px', imageRendering: 'pixelated', border: '2px solid #778', background: '#9ab' } }); const ctx = cv.getContext('2d'); const img = ctx.createImageData(W, H);
  const g = new Uint8Array(W * H); const COL = [[150, 175, 195], [214, 196, 150], [60, 140, 70], [240, 240, 240], [120, 110, 100]]; let cur = 1;
  for (let x = 0; x < W; x++) for (let y = H - 18 - Math.floor(4 * Math.sin(x / 17)); y < H; y++) g[y * W + x] = 1;
  const R = rng(4); const daph = Array.from({ length: 16 }, () => ({ x: R() * W, y: R() * 100 + 10, vx: 0, vy: 0, e: 1 }));
  const step = () => { for (let y = H - 2; y >= 0; y--) for (let x = 0; x < W; x++) { const i = y * W + x; if (g[i] === 1 && g[i + W] === 0) { g[i + W] = 1; g[i] = 0; } else if (g[i] === 2) { if (Math.random() < 0.004) { const d = [1, -1, -W, -W + 1, -W - 1][(Math.random() * 5) | 0]; if (g[i + d] === 0 && i + d > 0) g[i + d] = 2; } } } daph.forEach((d) => { d.vx += (Math.random() - 0.5) * 0.3; d.vy += (Math.random() - 0.5) * 0.3 + 0.01; d.vx *= 0.9; d.vy *= 0.9; d.x = clamp(d.x + d.vx, 1, W - 2); d.y = clamp(d.y + d.vy, 1, H - 20); const i = (d.y | 0) * W + (d.x | 0); for (const n of [0, 1, -1, W, -W]) if (g[i + n] === 2 && Math.random() < 0.1) { g[i + n] = 0; d.e = Math.min(2, d.e + 0.1); } }); };
  const render = () => { for (let i = 0; i < W * H; i++) { const c = COL[g[i]]; const y = (i / W) | 0; const dk = g[i] ? 0 : y * 0.25; img.data[i * 4] = c[0] - dk; img.data[i * 4 + 1] = c[1] - dk; img.data[i * 4 + 2] = c[2] - dk * 0.5; img.data[i * 4 + 3] = 255; } daph.forEach((d) => { for (const [ox, oy, k] of [[0, 0, 0], [1, 0, 1], [0, 1, 1], [-1, 0, 0]]) { const i = (((d.y + oy) | 0) * W + ((d.x + ox) | 0)) * 4; img.data[i] = k ? 210 : 240; img.data[i + 1] = k ? 90 : 240; img.data[i + 2] = k ? 200 : 240; } }); ctx.putImageData(img, 0, 0); };
  const paint = (e) => { const p = localPos(e, cv); const r = cv.getBoundingClientRect(); const cx = ((p.x / r.width) * W) | 0, cy = ((p.y / r.height) * H) | 0; for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (x * x + y * y < 10) { const X = cx + x, Y = cy + y; if (X >= 0 && Y >= 0 && X < W && Y < H) g[Y * W + X] = cur; } };
  drag(cv, { start: paint, move: paint });
  const loop = () => { step(); render(); requestAnimationFrame(loop); };
  let page = 1; const pages = ['This is your personal aquatic ecosystem to mature, sculpt, and observe.', 'Plant algae (green) — it grows slowly toward the light.', 'Daphnia (pink) swim around and graze on algae to survive.', 'Balance the tank: too little algae and the daphnia starve.'];
  const pg = h('div'), cnt = h('div', { style: { position: 'absolute', right: '24px', bottom: '56px', fontSize: '18px' } });
  const dlg = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-60%,-50%)', width: '440px', height: '420px', background: '#e9ecf0', border: '2px solid #556', boxShadow: '4px 4px 0 #0004' } }, h('div', { style: { background: '#223', color: '#fff', padding: '3px 6px' } }, 'Orb.Farm-ish'), h('div', { style: { margin: '12px', padding: '12px', background: '#fff', border: '1px solid #99a', borderRadius: '10px' } }, h('b', { style: { fontSize: '15px' } }, 'Welcome to Orb.Farm-ish!'), pg), s('svg', { viewBox: '0 0 100 100', width: 180, height: 180, style: 'display:block;margin:10px auto' }, s('ellipse', { cx: 50, cy: 52, rx: 26, ry: 36, fill: '#fde', stroke: '#b4a', 'stroke-width': 2 }), s('circle', { cx: 50, cy: 30, r: 4, fill: '#222' }), s('path', { d: 'M40 70q10 10 20 0M30 20l-14 -12M70 20l14 -12', stroke: '#b4a', 'stroke-width': 2, fill: 'none' })), cnt, h('button', { style: { position: 'absolute', right: '14px', bottom: '14px', padding: '6px 14px', border: '2px outset #ccc', background: '#ddd' }, onclick: () => { page++; if (page > 4) dlg.remove(); else upd(); } }, 'Next >'));
  const upd = () => { pg.textContent = pages[page - 1]; cnt.textContent = `${page}/4`; }; upd();
  const tools = h('div', { style: { position: 'absolute', right: '20px', top: '20px', width: '140px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', background: '#d8dde4', padding: '6px', border: '2px solid #889' } }, h('div', { style: { gridColumn: '1/-1', textAlign: 'center', fontSize: '26px' } }, '🌡'), ...['Sand', 'Algae', 'Glass', 'Stone', 'Water', 'Daphnia'].map((n, i) => h('button', { style: { padding: '6px 2px', border: '2px outset #ccc', background: '#e9ecf0', fontSize: '11px' }, onclick: () => { if (n === 'Daphnia') daph.push({ x: 100, y: 40, vx: 0, vy: 0, e: 1 }); else cur = { Sand: 1, Algae: 2, Glass: 3, Stone: 4, Water: 0 }[n]; } }, n)));
  root.append(h('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'linear-gradient(#8a98a6,#c7d0d9)' } }, cv), tools, dlg);
  for (let x = 20; x < 180; x += 3) for (let y = H - 30; y < H - 20; y++) if (Math.random() < 0.5) g[y * W + x] = 2;
  loop();
  window.__demoProof = async () => { for (let i = 0; i < 40; i++) step(); return 'tank running with daphnia grazing (onboarding 1/4)'; };
};
// ---------- neato marble (WebGL domain warp)
export function glCanvas(frag, uniforms) { const cv = h('canvas', { style: { width: '100%', height: '100%', display: 'block' } }); const gl = cv.getContext('webgl', { preserveDrawingBuffer: true }); if (!gl) return { cv, draw() {} }; const sh = (t, src) => { const x = gl.createShader(t); gl.shaderSource(x, src); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(x)); return x; }; const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}')); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, 'precision highp float;uniform vec2 R;uniform float t;' + Object.keys(uniforms).map((k) => `uniform ${Array.isArray(uniforms[k]) ? 'vec' + uniforms[k].length : 'float'} ${k};`).join('') + frag)); gl.linkProgram(pr); gl.useProgram(pr); const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW); const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0); return { cv, gl, draw(t) { const r = cv.getBoundingClientRect(); if (cv.width !== (r.width | 0)) { cv.width = r.width | 0; cv.height = r.height | 0; } gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(gl.getUniformLocation(pr, 'R'), cv.width, cv.height); gl.uniform1f(gl.getUniformLocation(pr, 't'), t); for (const [k, v] of Object.entries(uniforms)) { const l = gl.getUniformLocation(pr, k); Array.isArray(v) ? gl['uniform' + v.length + 'fv'](l, v) : gl.uniform1f(l, v); } gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); } }; }
const hex3 = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
V['neato-marble-shader-desk'] = (root, T) => {
  theme(root, T, { bg: '#1e1e1e', fg: '#ccc', panel: '#252525', ac: '#fff', acfg: '#000', dark: true });
  const U = { warp: 4, scale: 1.2, speed: 0.15, c1: hex3('#f4f1dc'), c2: hex3('#9ccf9a'), c3: hex3('#2f7d6d'), c4: hex3('#e7d88f') };
  const G = glCanvas(`float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}void main(){vec2 uv=gl_FragCoord.xy/R.y*scale;float T=t*speed;vec2 q=vec2(fbm(uv+T),fbm(uv+vec2(5.2,1.3)));vec2 r=vec2(fbm(uv+warp*q+vec2(1.7,9.2)+T*.5),fbm(uv+warp*q+vec2(8.3,2.8)));float f=fbm(uv+warp*r);vec3 c=mix(c1,c2,smoothstep(.2,.6,f));c=mix(c,c3,smoothstep(.55,.9,length(q)*f));c=mix(c,c4,smoothstep(.6,1.,r.x));c=mix(c,c1,smoothstep(.75,.95,f));gl_FragColor=vec4(c,1);}`, U);
  const sw = (k) => h('input', { type: 'color', value: '#' + U[k].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join(''), oninput: (e) => (U[k] = hex3(e.target.value)), style: { width: '40px', height: '22px', border: 0 } });
  root.style.display = 'grid'; root.style.gridTemplateColumns = '280px 1fr 60px';
  root.append(h('div', { style: { padding: '12px', display: 'grid', gap: '10px', alignContent: 'start', fontSize: '12px' } }, h('div.k-row', {}, h('b', { style: { fontSize: '15px' } }, 'Marble-ish'), h('span', { style: { flex: 1 } }), select(['Neato', 'Agate', 'Ink'], 'Neato', (v) => { const P2 = { Neato: ['#f4f1dc', '#9ccf9a', '#2f7d6d', '#e7d88f'], Agate: ['#f8efe6', '#d98a5f', '#6b2d3a', '#f2c46d'], Ink: ['#f2f2f2', '#6a8fd6', '#1c2a55', '#c7d6ff'] }[v]; ['c1', 'c2', 'c3', 'c4'].forEach((k, i) => (U[k] = hex3(P2[i]))); })), h('div.k-h', {}, 'Colours'), ...['c1', 'c2', 'c3', 'c4'].map((k, i) => h('div.k-row', {}, h('span', { style: { flex: 1 } }, ['Base', 'Vein', 'Deep', 'Accent'][i]), sw(k))), h('div.k-h', {}, 'Shape'), slider('Warp', 0, 10, U.warp, 0.1, (v) => (U.warp = v)), slider('Scale', 0.5, 6, U.scale, 0.1, (v) => (U.scale = v)), slider('Speed', 0, 1, U.speed, 0.01, (v) => (U.speed = v)), h('div.k-h', {}, 'Export'), btn('Download PNG', () => { const a = h('a', { download: 'marble.png', href: G.cv.toDataURL() }); a.click(); }, 'pri'), btn('Randomise', () => { U.warp = 2 + Math.random() * 6; U.scale = 1 + Math.random() * 3; })), h('div', { style: { position: 'relative' } }, G.cv), h('div', { style: { background: '#000' } }));
  const t0 = performance.now(); const loop = () => { G.draw((performance.now() - t0) / 1000 + 10); requestAnimationFrame(loop); }; loop();
  window.__demoProof = async () => { U.warp = 4.6; return 'domain-warped marble shader live'; };
};
// ---------- signal garden
V['constellation-signal-garden'] = (root, T) => {
  theme(root, T, { bg: '#0b1633', fg: '#dfe8ff', panel: '#13224a', ac: '#7dd3fc', dark: true });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0 } }); root.append(cv);
  const st = { mode: 'signal', lines: true, twinkle: true, cursor: 'attract', count: 90 };
  let stars = []; const R = rng(7); const mk = () => (stars = Array.from({ length: st.count }, () => ({ x: R(), y: R(), r: R() * 1.6 + 0.4, p: R() * 6 }))); mk(); let mouse = { x: 0.5, y: 0.5 }; let t = 0;
  root.addEventListener('pointermove', (e) => { const p = localPos(e, cv); mouse = { x: p.x / cv.W, y: p.y / cv.H }; });
  const loop = () => { fitCanvas(cv, root); const g = cv.g, W = cv.W, H = cv.H; t += 0.016; g.fillStyle = '#0b1633'; g.fillRect(0, 0, W, H); const grad = g.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, W * 0.8); grad.addColorStop(0, '#1b2e66'); grad.addColorStop(1, '#0b163300'); g.fillStyle = grad; g.fillRect(0, 0, W, H); stars.forEach((sr) => { if (st.cursor === 'attract') { sr.x += (mouse.x - sr.x) * 0.0006; sr.y += (mouse.y - sr.y) * 0.0006; } }); if (st.lines) { g.strokeStyle = '#7dd3fc33'; g.lineWidth = 1; for (let i = 0; i < stars.length; i++) for (let j = i + 1; j < stars.length; j++) { const a = stars[i], b = stars[j]; const d = Math.hypot((a.x - b.x) * W, (a.y - b.y) * H); if (d < 110) { g.globalAlpha = 1 - d / 110; g.beginPath(); g.moveTo(a.x * W, a.y * H); g.lineTo(b.x * W, b.y * H); g.stroke(); } } g.globalAlpha = 1; } stars.forEach((sr) => { const tw = st.twinkle ? 0.6 + 0.4 * Math.sin(t * 2 + sr.p) : 1; g.fillStyle = `rgba(220,235,255,${tw})`; g.beginPath(); g.arc(sr.x * W, sr.y * H, sr.r * (st.mode === 'signal' ? 1.4 : 1), 0, 7); g.fill(); }); requestAnimationFrame(loop); };
  const chip = (l, on) => h('button', { style: { background: on ? '#7dd3fc22' : '#ffffff08', border: '1px solid ' + (on ? '#7dd3fc' : '#ffffff22'), color: '#dfe8ff', padding: '6px 12px', borderRadius: '99px', fontSize: '12px' }, onclick: (e) => { const b = e.currentTarget; const now = b.style.borderColor.includes('125') ? false : true; b.style.borderColor = now ? '#7dd3fc' : '#ffffff22'; b.style.background = now ? '#7dd3fc22' : '#ffffff08'; if (l.startsWith('lines')) st.lines = now; if (l.startsWith('twinkle')) st.twinkle = now; if (l.startsWith('cursor')) st.cursor = now ? 'attract' : 'off'; if (l.startsWith('respawn')) mk(); } }, l);
  const stat = (k, v) => h('div', { style: { background: '#13224acc', border: '1px solid #ffffff18', borderRadius: '8px', padding: '8px 10px', fontSize: '11px' } }, h('div', { style: { opacity: .6, letterSpacing: '.1em', fontSize: '9px' } }, k), h('b', {}, v));
  const card = h('div', { style: { position: 'absolute', left: '50%', top: '40px', transform: 'translateX(-50%)', width: '900px', background: '#13224add', border: '1px solid #ffffff22', borderRadius: '14px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', backdropFilter: 'blur(6px)' } }, h('div', {}, h('div', { style: { fontSize: '10px', letterSpacing: '.2em', opacity: .6 } }, 'CONSTELLATION · INTERACTIVE'), h('div', { style: { font: "700 48px/1 'Inter Variable'", margin: '10px 0' } }, '✧ Signal', h('br'), 'Garden'), h('p', { style: { fontSize: '13px', opacity: .8, lineHeight: 1.6 } }, 'A living constellation you can nudge: stars drift toward your cursor, link up with neighbours and twinkle in response to the signal mode.')), h('div', { style: { display: 'grid', gap: '12px', alignContent: 'start' } }, h('div', { style: { fontSize: '10px', letterSpacing: '.2em', opacity: .6 } }, 'FIELD MODE'), seg(['quiet', 'signal', 'storm'], 'signal', (v) => { st.mode = v; }), h('div', { style: { fontSize: '10px', letterSpacing: '.2em', opacity: .6 } }, 'LAYERS'), h('div.k-row', { style: { flexWrap: 'wrap' } }, chip('lines: on', true), chip('twinkle: on', true), chip('cursor attract', true), chip('respawn', false)), slider('Density', 20, 200, st.count, 5, (v) => { st.count = v; mk(); }))); const stats = h('div', { style: { position: 'absolute', left: '50%', bottom: '40px', transform: 'translateX(-50%)', width: '900px', display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px' } }, stat('STARS', '90'), stat('MODE', 'signal'), stat('LINKS', 'on'), stat('TWINKLE', 'on'), stat('CURSOR', 'attract'), stat('FPS', '60'));
  root.append(card, stats); loop();
  window.__demoProof = async () => 'constellation live with lines/twinkle';
};
// ---------- hand-drawn physics
V['handdrawn-physics-sandbox'] = (root, T) => {
  theme(root, T, { bg: '#fdf6e3', fg: '#333', ac: '#333', dark: false }); root.style.fontFamily = "'Comic Sans MS','Chalkboard SE',cursive";
  const cv = h('canvas', { style: { width: '100%', height: '100%', cursor: 'crosshair' } }); const wrap = h('div', { style: { position: 'absolute', left: '110px', right: '170px', top: '20px', bottom: '20px', border: '2px solid #333', borderRadius: '4px', background: '#fffdf5' } }, cv);
  const segs = [[60, 120, 380, 180], [420, 260, 120, 330], [160, 420, 520, 470], [560, 500, 700, 440], [300, 560, 720, 600], [700, 120, 900, 90], [860, 250, 640, 300]]; let balls = []; let tool = 'ball', g0 = 0.25, st = null;
  const jit = (x, k) => x + Math.sin(x * 12.9898 + k) * 1.2;
  const loop = () => { fitCanvas(cv, wrap); const g = cv.g; g.clearRect(0, 0, cv.W, cv.H); g.strokeStyle = '#0001'; for (let x = 0; x < cv.W; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, cv.H); g.stroke(); } g.lineCap = 'round'; for (const b of balls) { b.vy += g0; b.x += b.vx; b.y += b.vy; for (const [x1, y1, x2, y2] of segs) { const dx = x2 - x1, dy = y2 - y1; const L = dx * dx + dy * dy; const tt = clamp(((b.x - x1) * dx + (b.y - y1) * dy) / L, 0, 1); const px = x1 + tt * dx, py = y1 + tt * dy; const d = Math.hypot(b.x - px, b.y - py); if (d < b.r) { const nx = (b.x - px) / d, ny = (b.y - py) / d; b.x = px + nx * b.r; b.y = py + ny * b.r; const vn = b.vx * nx + b.vy * ny; if (vn < 0) { b.vx -= 1.5 * vn * nx; b.vy -= 1.5 * vn * ny; } b.vx *= 0.995; } } b.a += b.vx / b.r; } balls = balls.filter((b) => b.y < cv.H + 50); g.strokeStyle = '#333'; g.lineWidth = 2.5; for (const [x1, y1, x2, y2] of segs) { for (let k = 0; k < 2; k++) { g.beginPath(); g.moveTo(jit(x1, k), jit(y1, k + 1)); g.lineTo(jit(x2, k + 2), jit(y2, k + 3)); g.stroke(); } } for (const b of balls) { g.beginPath(); g.arc(b.x, b.y, b.r, 0, 7); g.fillStyle = b.c; g.fill(); g.stroke(); g.beginPath(); g.moveTo(b.x, b.y); g.lineTo(b.x + Math.cos(b.a) * b.r, b.y + Math.sin(b.a) * b.r); g.stroke(); } if (st && st.cur) { g.setLineDash([6, 6]); g.beginPath(); g.moveTo(st.x, st.y); g.lineTo(st.cur.x, st.cur.y); g.stroke(); g.setLineDash([]); } g.font = '22px Comic Sans MS'; g.fillStyle = '#333'; g.fillText('Welcome to Scribble Physics! ↓ draw ramps, drop balls', 60, 60); requestAnimationFrame(loop); };
  drag(cv, { start: (e) => { const p = localPos(e, cv); if (tool === 'ball') { balls.push({ x: p.x, y: p.y, vx: 0, vy: 0, r: 14 + Math.random() * 10, a: 0, c: pick(['#f6c', '#fc6', '#6cf', '#9e9', '#fff']) }); return false; } st = { x: p.x, y: p.y }; }, move: (e) => { if (st) st.cur = localPos(e, cv); }, end: () => { if (st?.cur) segs.push([st.x, st.y, st.cur.x, st.cur.y]); st = null; } });
  const tb = h('div', { style: { position: 'absolute', left: '14px', top: '20px', width: '80px', display: 'grid', gap: '14px', justifyItems: 'center', fontSize: '12px' } }, ...[['ball', '◯', 'Ball'], ['line', '╱', 'Ramp'], ['box', '▭', 'Box'], ['text', 'Aa', 'Text'], ['erase', '⌫', 'Erase']].map(([t, ic, l]) => h('div', { style: { textAlign: 'center', cursor: 'pointer' }, onclick: (e) => { tool = t === 'box' || t === 'text' ? 'line' : t; if (t === 'erase') segs.length = 0; tb.querySelectorAll('div').forEach((d) => (d.style.fontWeight = 400)); e.currentTarget.style.fontWeight = 700; } }, h('div', { style: { fontSize: '26px', border: '2px solid #333', borderRadius: '50%', width: '44px', height: '44px', display: 'grid', placeItems: 'center' } }, ic), l)));
  root.append(tb, wrap, h('div', { style: { position: 'absolute', right: '14px', top: '20px', width: '140px', border: '2px solid #333', padding: '10px', display: 'grid', gap: '8px', background: '#fff', fontSize: '13px' } }, h('b', {}, 'Gravity'), slider('', 0, 1, g0, 0.01, (v) => (g0 = v)), toggle('Sketchy lines', true, () => {}), toggle('Bounce', true, () => {}), btn('Drop 5 balls', () => { for (let i = 0; i < 5; i++) balls.push({ x: 100 + i * 60, y: 90, vx: 1, vy: 0, r: 16, a: 0, c: pick(['#f6c', '#fc6', '#6cf', '#9e9']) }); }), btn('Clear balls', () => (balls = []))));
  loop();
  window.__demoProof = async () => { for (let i = 0; i < 6; i++) balls.push({ x: 100 + i * 50, y: 80 + i * 30, vx: 1, vy: 0, r: 16, a: 0, c: ['#f6c', '#fc6', '#6cf', '#9e9', '#fff', '#fc6'][i] }); await sleep(900); return 'balls rolling on sketched ramps'; };
};
// ---------- mondrian
V['mondrian-partition-canvas'] = (root, T) => {
  theme(root, T, { bg: '#e8e8e8', fg: '#111', ac: '#d40920', dark: false });
  const PAL = ['#f2f2f2', '#d40920', '#1356a2', '#f7d842', '#111']; let rects = [{ x: 0, y: 0, w: 1, h: 1, c: 0 }]; let color = 0; let line = 8;
  const board = h('div', { style: { position: 'absolute', left: '20px', top: '20px', right: '20px', bottom: '60px', background: '#111', border: '2px solid #111' } });
  const draw = () => { board.replaceChildren(...rects.map((r, i) => h('div', { style: { position: 'absolute', left: `calc(${r.x * 100}% + ${line / 2}px)`, top: `calc(${r.y * 100}% + ${line / 2}px)`, width: `calc(${r.w * 100}% - ${line}px)`, height: `calc(${r.h * 100}% - ${line}px)`, background: PAL[r.c], cursor: 'crosshair' }, onclick: (e) => { const rr = e.currentTarget.getBoundingClientRect(); const fx = (e.clientX - rr.left) / rr.width, fy = (e.clientY - rr.top) / rr.height; if (e.altKey || color) { if (color) { r.c = color; draw(); return; } } if (e.shiftKey || rr.height > rr.width) { rects.splice(i, 1, { ...r, h: r.h * fy }, { ...r, y: r.y + r.h * fy, h: r.h * (1 - fy) }); } else rects.splice(i, 1, { ...r, w: r.w * fx }, { ...r, x: r.x + r.w * fx, w: r.w * (1 - fx) }); draw(); } }))); };
  const bar = h('div.k-row', { style: { position: 'absolute', left: '20px', right: '20px', bottom: '14px', fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase' } }, h('b', {}, 'Composition with click · '), 'click = split · shift = horizontal · pick a colour to fill', h('span', { style: { flex: 1 } }), ...PAL.map((c, i) => h('span', { style: { width: '18px', height: '18px', background: c, border: i === 0 ? '2px solid #111' : '1px solid #111', cursor: 'pointer' }, onclick: (e) => { color = i; bar.querySelectorAll('span[style*="18px"]').forEach((x) => (x.style.border = '1px solid #111')); e.target.style.border = '2px solid #111'; } })), btn('Undo all', () => { rects = [{ x: 0, y: 0, w: 1, h: 1, c: 0 }]; draw(); }), btn('Random', () => { rects = [{ x: 0, y: 0, w: 1, h: 1, c: 0 }]; for (let k = 0; k < 9; k++) { const i = (Math.random() * rects.length) | 0; const r = rects[i]; const f = 0.3 + Math.random() * 0.4; if (r.w > r.h) rects.splice(i, 1, { ...r, w: r.w * f }, { ...r, x: r.x + r.w * f, w: r.w * (1 - f) }); else rects.splice(i, 1, { ...r, h: r.h * f }, { ...r, y: r.y + r.h * f, h: r.h * (1 - f) }); } rects.forEach((r) => (r.c = Math.random() < 0.25 ? 1 + ((Math.random() * 3) | 0) : 0)); draw(); }), btn('PNG', () => toast('mondrian.png')));
  root.append(board, bar); draw();
  window.__demoProof = async () => { rects = [{ x: 0, y: 0, w: 1, h: 1, c: 0 }]; draw(); return 'blank canvas awaiting click-to-split (initial state)'; };
};
V['matterjs-physics-demo-desk'] = (root, T) => {
  theme(root, T, { bg: '#14151f', fg: '#f0f0f0', panel: '#191921', ac: '#7c5cff', dark: true });
  const SCENES = ['Mixed Shapes', 'Avalanche', 'Ball Pool', 'Stack'];
  let scene = 'Mixed Shapes';
  let gravity = 0.45;
  let bodies = [];
  let walls = [];
  let dragging = null;
  const W = 720, H = 520;
  const cv = h('canvas', { width: W, height: H, style: { width: '100%', height: '100%', display: 'block', background: '#0e0f16', cursor: 'crosshair' } });
  const ctx = cv.getContext('2d');
  const sceneSel = select(SCENES.map((s) => [s, s]), scene, (v) => { scene = v; reset(); });
  Object.assign(sceneSel.style, { background: '#191921', color: '#f0f0f0', border: '1px solid #ffffff22', padding: '6px 10px', borderRadius: '6px' });
  const countEl = h('div', { style: { fontSize: '11px', opacity: .55, padding: '8px 10px' } });
  const bodyList = h('div', { style: { overflow: 'auto', flex: 1, fontSize: '11px', fontFamily: 'ui-monospace,monospace' } });

  const mk = (type, x, y, opts = {}) => {
    const b = { type, x, y, vx: opts.vx || 0, vy: opts.vy || 0, r: opts.r || 18, w: opts.w || 36, h: opts.h || 36, a: opts.a || 0, static: !!opts.static, color: opts.color || '#ffffff', id: bodies.length + walls.length + 1 };
    return b;
  };
  const reset = () => {
    bodies = []; walls = [];
    walls.push(mk('rect', W / 2, H - 8, { w: W - 20, h: 16, static: true }), mk('rect', 8, H / 2, { w: 16, h: H - 20, static: true }), mk('rect', W - 8, H / 2, { w: 16, h: H - 20, static: true }));
    if (scene === 'Mixed Shapes') {
      for (let i = 0; i < 10; i++) bodies.push(mk(i % 2 ? 'circle' : 'rect', 80 + i * 55, 40 + (i % 3) * 30, { r: 14 + (i % 4) * 4, w: 28 + (i % 3) * 8, h: 24 + (i % 2) * 10, vx: (i % 5) - 2 }));
      for (let i = 0; i < 4; i++) bodies.push(mk('poly', 200 + i * 70, 20, { r: 20 + i * 2 }));
    } else if (scene === 'Avalanche') {
      for (let row = 0; row < 8; row++) for (let col = 0; col < 8 - row; col++) bodies.push(mk('circle', 220 + col * 36 + row * 18, 30 + row * 32, { r: 14 }));
      bodies.push(mk('rect', 360, 200, { w: 200, h: 14, a: 0.35, static: true }));
      walls.push(bodies.pop());
    } else if (scene === 'Ball Pool') {
      for (let i = 0; i < 40; i++) bodies.push(mk('circle', 60 + (i % 10) * 60, 40 + Math.floor(i / 10) * 50, { r: 12 + (i % 5) * 2, color: pick(['#fff', '#ff5c8a', '#7c5cff', '#ffc83d', '#5cffb0']) }));
    } else {
      for (let row = 0; row < 6; row++) for (let col = 0; col < 5; col++) bodies.push(mk('rect', 260 + col * 40, 80 + row * 38, { w: 34, h: 32 }));
    }
    syncList();
  };
  const syncList = () => {
    countEl.textContent = `World · ${bodies.length} bodies`;
    bodyList.replaceChildren(
      h('div', { style: { padding: '6px 10px', opacity: .5 } }, `World ${bodies.length + walls.length}`),
      ...bodies.slice(0, 24).map((b) => h('div', { style: { padding: '4px 10px', borderLeft: '2px solid #7c5cff44' } }, `${b.type === 'circle' ? 'Circle' : b.type === 'poly' ? 'Polygon' : 'Rectangle'} Body ${b.id}`)),
      bodies.length > 24 ? h('div', { style: { padding: '4px 10px', opacity: .4 } }, `… +${bodies.length - 24} more`) : null,
    );
  };

  const collide = (a, b) => {
    if (a.type === 'circle' && b.type === 'circle') {
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, min = a.r + b.r;
      if (d < min) {
        const nx = dx / d, ny = dy / d, overlap = min - d;
        if (!a.static && !b.static) { a.x -= nx * overlap / 2; a.y -= ny * overlap / 2; b.x += nx * overlap / 2; b.y += ny * overlap / 2; }
        else if (!a.static) { a.x -= nx * overlap; a.y -= ny * overlap; }
        else if (!b.static) { b.x += nx * overlap; b.y += ny * overlap; }
        const rvx = b.vx - a.vx, rvy = b.vy - a.vy, vn = rvx * nx + rvy * ny;
        if (vn < 0) {
          const j = -(1.4) * vn / ((a.static || b.static) ? 1 : 2);
          if (!a.static) { a.vx -= j * nx; a.vy -= j * ny; }
          if (!b.static) { b.vx += j * nx; b.vy += j * ny; }
        }
      }
      return;
    }
    // circle vs AABB (approx)
    const box = a.type === 'circle' ? b : a, cir = a.type === 'circle' ? a : b;
    if (cir.type !== 'circle') return;
    const hw = (box.w || 36) / 2, hh = (box.h || 36) / 2;
    const cx = clamp(cir.x, box.x - hw, box.x + hw), cy = clamp(cir.y, box.y - hh, box.y + hh);
    const dx = cir.x - cx, dy = cir.y - cy, d = Math.hypot(dx, dy);
    if (d < cir.r && d > 0) {
      const nx = dx / d, ny = dy / d, overlap = cir.r - d;
      if (!cir.static) { cir.x += nx * overlap; cir.y += ny * overlap; }
      const vn = cir.vx * nx + cir.vy * ny;
      if (vn < 0 && !cir.static) { cir.vx -= 1.5 * vn * nx; cir.vy -= 1.5 * vn * ny; }
    } else if (d === 0) {
      if (!cir.static) { cir.y -= cir.r; cir.vy = -Math.abs(cir.vy) * 0.6; }
    }
    // rect-rect light separation
    if (a.type !== 'circle' && b.type !== 'circle' && !a.static && !b.static) {
      const dx = b.x - a.x, dy = b.y - a.y;
      const ox = (a.w + b.w) / 2 - Math.abs(dx), oy = (a.h + b.h) / 2 - Math.abs(dy);
      if (ox > 0 && oy > 0) {
        if (ox < oy) { const s = Math.sign(dx) || 1; a.x -= s * ox / 2; b.x += s * ox / 2; a.vx *= -0.4; b.vx *= -0.4; }
        else { const s = Math.sign(dy) || 1; a.y -= s * oy / 2; b.y += s * oy / 2; a.vy *= -0.4; b.vy *= -0.4; }
      }
    }
  };

  const step = () => {
    const all = [...bodies, ...walls];
    for (const b of bodies) {
      if (b === dragging) continue;
      b.vy += gravity;
      b.vx *= 0.995; b.vy *= 0.995;
      b.x += b.vx; b.y += b.vy;
      b.a += b.vx * 0.02;
    }
    for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) collide(all[i], all[j]);
    for (const b of bodies) {
      if (b.y > H + 80) { b.y = 40; b.x = 80 + Math.random() * (W - 160); b.vx = 0; b.vy = 0; }
    }
  };
  const drawBody = (b, wire = true) => {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.a || 0);
    ctx.strokeStyle = b.color || '#fff';
    ctx.fillStyle = wire ? 'transparent' : (b.color + '33');
    ctx.lineWidth = 1.5;
    if (b.type === 'circle') {
      ctx.beginPath(); ctx.arc(0, 0, b.r, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(b.r, 0); ctx.strokeStyle = '#ff5c8a'; ctx.stroke();
    } else if (b.type === 'poly') {
      const n = 5, R = b.r;
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / n; ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * R, Math.sin(a) * R); }
      ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, 0); ctx.strokeStyle = '#ff5c8a'; ctx.stroke();
    } else {
      ctx.strokeRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(b.w / 2, 0); ctx.strokeStyle = '#ff5c8a'; ctx.stroke();
    }
    ctx.restore();
  };
  const loop = () => {
    step(); step();
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#ffffff22'; ctx.strokeRect(16, 16, W - 32, H - 32);
    for (const w of walls) drawBody(w);
    for (const b of bodies) drawBody(b);
    requestAnimationFrame(loop);
  };

  const at = (e) => {
    const r = cv.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };
  cv.addEventListener('pointerdown', (e) => {
    const p = at(e);
    let hit = bodies.find((b) => Math.hypot(b.x - p.x, b.y - p.y) < (b.r || Math.max(b.w, b.h) / 2) + 4);
    if (!hit) {
      hit = mk(pick(['circle', 'rect', 'poly']), p.x, p.y, { r: 16 + Math.random() * 10, w: 30, h: 28, color: pick(['#fff', '#ffc83d', '#7c5cff']) });
      bodies.push(hit); syncList();
    }
    dragging = hit; cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const p = at(e);
    dragging.x = p.x; dragging.y = p.y; dragging.vx = e.movementX * 0.4; dragging.vy = e.movementY * 0.4;
  });
  cv.addEventListener('pointerup', () => { dragging = null; });

  const gSl = slider('Gravity', 0, 1.2, gravity, 0.01, (v) => { gravity = v; }, (v) => (+v).toFixed(2));
  const addAmt = { n: 3 };
  const amtSl = slider('amount', 1, 12, 3, 1, (v) => { addAmt.n = v; });

  root.append(
    h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '44px 1fr', background: '#14151f' } },
      h('div.k-row', { style: { padding: '0 14px', gap: '12px', borderBottom: '1px solid #ffffff12', fontSize: '13px' } },
        h('b', {}, 'matter-js'), h('span', { style: { opacity: .4 } }, '↗'),
        h('span', { style: { flex: 1 } }), sceneSel,
        h('button', { title: 'reset', style: { background: '#191921', border: '1px solid #ffffff22', color: '#fff', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }, onclick: reset }, '↻'),
        h('span', { style: { opacity: .5 } }, '{ }'), h('span', { style: { opacity: .5 } }, '⚙')),
      h('div', { style: { display: 'grid', gridTemplateColumns: '200px 1fr 240px', minHeight: 0 } },
        h('div', { style: { borderRight: '1px solid #ffffff12', display: 'flex', flexDirection: 'column', background: '#16171f' } },
          h('div', { style: { padding: '10px', fontSize: '11px', opacity: .5 } }, 'search'),
          countEl, bodyList),
        h('div', { style: { position: 'relative', minHeight: 0 } }, cv),
        h('div', { style: { borderLeft: '1px solid #ffffff12', padding: '12px', display: 'grid', gap: '12px', alignContent: 'start', background: '#16171f', overflow: 'auto', fontSize: '12px' } },
          h('b', {}, 'Add Body'), amtSl,
          btn('addBody', () => { for (let i = 0; i < addAmt.n; i++) bodies.push(mk(pick(['circle', 'rect', 'poly']), 100 + Math.random() * (W - 200), 40 + Math.random() * 60, { r: 14 + Math.random() * 12, w: 28 + Math.random() * 16, h: 24 + Math.random() * 14 })); syncList(); }, 'pri'),
          h('b', {}, 'World'),
          h('div.k-row', { style: { gap: '6px' } }, btn('clear', () => { bodies = []; syncList(); }), btn('reset', reset)),
          h('b', {}, 'Gravity'), gSl,
          h('b', {}, 'Render'),
          h('div', { style: { fontSize: '11px', opacity: .55, lineHeight: 1.7 } }, '✓ wireframes', h('br'), '✓ showAngleIndicator', h('br'), '○ showVelocity')))));

  reset();
  loop();
  window.__demoProof = async () => {
    scene = 'Avalanche'; sceneSel.value = 'Avalanche'; reset(); await sleep(200);
    gravity = 0.7; gSl.set(0.7); await sleep(200);
    for (let i = 0; i < 5; i++) bodies.push(mk('circle', 120 + i * 40, 50, { r: 16 })); syncList();
    scene = 'Mixed Shapes'; sceneSel.value = 'Mixed Shapes'; reset(); await sleep(120);
    return `scenes Avalanche→Mixed; gravity 0.7; spawned bodies; world ${bodies.length}`;
  };
};

V['particulardrift-image-particle-desk'] = (root, T) => {
  theme(root, T, { bg: '#0e1020', fg: '#f0f0f0', panel: '#1a1c2e', ac: '#ff9f43', dark: true, line: '#ffffff18' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'system-ui, Inter Variable, sans-serif';

  const PALS = [
    ['#ff9f43', '#ee5a24', '#f8efba', '#58b19f'],
    ['#7c5cff', '#ff5c8a', '#5ce1ff', '#ffe66d'],
    ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5'],
    ['#00d2ff', '#3a7bd5', '#ffffff', '#89f7fe'],
    ['#f953c6', '#b91d73', '#ffecd2', '#fcb69f'],
    ['#11998e', '#38ef7d', '#d4fc79', '#96e6a1'],
  ];
  let pal = 0;
  const P = { speed: 0.55, attract: 0.45, edge: 0.35, flow: 0.4 };
  let paused = false;
  let particles = [];
  let targets = []; // {x,y} seed positions in 0..1
  const nz = noise2(11);

  const cv = h('canvas', { style: { position: 'absolute', inset: 0, touchAction: 'none' } });
  root.append(cv);

  // procedural silhouette (face/bust-ish) into offscreen, sample edges
  const seedFromProcedural = () => {
    const W = 320, H = 400;
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const g = off.getContext('2d');
    g.fillStyle = '#000';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#fff';
    // head
    g.beginPath(); g.ellipse(W / 2, H * 0.32, 70, 85, 0, 0, 7); g.fill();
    // neck + shoulders
    g.fillRect(W / 2 - 28, H * 0.45, 56, 50);
    g.beginPath();
    g.moveTo(40, H * 0.95); g.quadraticCurveTo(W / 2, H * 0.55, W - 40, H * 0.95);
    g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
    // hair blob
    g.beginPath(); g.ellipse(W / 2, H * 0.22, 78, 50, 0, Math.PI, 0); g.fill();

    const img = g.getImageData(0, 0, W, H);
    const thr = P.edge * 255;
    targets = [];
    for (let y = 1; y < H - 1; y += 2) {
      for (let x = 1; x < W - 1; x += 2) {
        const i = (y * W + x) * 4;
        const lum = img.data[i];
        if (lum < thr) continue;
        // edge: neighbor darker
        let edge = false;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const j = ((y + dy) * W + (x + dx)) * 4;
          if (img.data[j] < thr * 0.5) { edge = true; break; }
        }
        if (edge || lum > 200) {
          targets.push({ x: x / W, y: y / H });
        }
      }
    }
    if (targets.length < 80) {
      // fallback ring
      for (let i = 0; i < 200; i++) {
        const a = (i / 200) * Math.PI * 2;
        targets.push({ x: 0.5 + Math.cos(a) * 0.22, y: 0.42 + Math.sin(a) * 0.28 });
      }
    }
    spawnParticles();
  };

  const spawnParticles = () => {
    const n = Math.min(1400, Math.max(400, targets.length * 2));
    particles = Array.from({ length: n }, (_, i) => {
      const t = targets[i % targets.length];
      return {
        x: t.x + (Math.random() - 0.5) * 0.04,
        y: t.y + (Math.random() - 0.5) * 0.04,
        vx: 0, vy: 0,
        tx: t.x, ty: t.y,
        c: PALS[pal][i % PALS[pal].length],
        s: 0.8 + Math.random() * 1.6,
      };
    });
  };

  const randomize = () => {
    P.speed = 0.2 + Math.random() * 1.2;
    P.attract = 0.15 + Math.random() * 0.8;
    P.edge = 0.15 + Math.random() * 0.6;
    P.flow = Math.random() * 0.9;
    pal = Math.floor(Math.random() * PALS.length);
    seedFromProcedural();
    syncSliders();
    toast('randomized ✦');
  };

  let speedSl, attractSl, edgeSl, flowSl;
  const syncSliders = () => {
    speedSl?.set?.(P.speed);
    attractSl?.set?.(P.attract);
    edgeSl?.set?.(P.edge);
    flowSl?.set?.(P.flow);
    paintChips();
  };

  const loop = (tms) => {
    fitCanvas(cv, root);
    const g = cv.g, W = cv.W, H = cv.H;
    g.fillStyle = 'rgba(14,16,32,0.22)';
    g.fillRect(0, 0, W, H);

    if (!paused) {
      const t = tms * 0.001;
      for (const p of particles) {
        const n = nz(p.x * 3 + t * 0.15, p.y * 3 - t * 0.1);
        const ang = n * Math.PI * 4;
        const flowX = Math.cos(ang) * P.flow * 0.008;
        const flowY = Math.sin(ang) * P.flow * 0.008;
        p.vx += (p.tx - p.x) * P.attract * 0.04;
        p.vy += (p.ty - p.y) * P.attract * 0.04;
        p.vx += flowX;
        p.vy += flowY;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx * P.speed;
        p.y += p.vy * P.speed;
        // soft wrap
        if (p.x < -0.05) p.x = 1.05; if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05; if (p.y > 1.05) p.y = -0.05;
      }
    }

    for (const p of particles) {
      g.fillStyle = p.c;
      g.globalAlpha = 0.85;
      g.beginPath();
      g.arc(p.x * W, p.y * H, p.s, 0, 7);
      g.fill();
    }
    g.globalAlpha = 1;
    requestAnimationFrame(loop);
  };

  const chipWrap = h('div.k-row', { style: { flexWrap: 'wrap', gap: '6px' } });
  const paintChips = () => {
    chipWrap.replaceChildren(...PALS.map((set, i) => h('span', {
      style: {
        width: '28px', height: '18px', borderRadius: '4px', cursor: 'pointer',
        background: `linear-gradient(90deg,${set[0]},${set[1]},${set[2]})`,
        border: i === pal ? '2px solid #fff' : '1px solid #ffffff33',
      },
      onclick: () => { pal = i; particles.forEach((p, k) => { p.c = PALS[pal][k % PALS[pal].length]; }); paintChips(); },
    })));
  };

  speedSl = slider('Speed', 0.05, 1.8, P.speed, 0.01, (v) => { P.speed = v; });
  attractSl = slider('Attraction', 0, 1, P.attract, 0.01, (v) => { P.attract = v; });
  edgeSl = slider('Edge threshold', 0.05, 0.9, P.edge, 0.01, (v) => { P.edge = v; seedFromProcedural(); });
  flowSl = slider('Flow amount', 0, 1.2, P.flow, 0.01, (v) => { P.flow = v; });

  // attach .set helpers if slider returns element with value tracking — kit may not; wrap
  const bindSet = (el, apply) => {
    el.set = (v) => {
      const inp = el.querySelector('input[type=range]');
      if (inp) { inp.value = v; }
      apply(v);
    };
    return el;
  };
  speedSl = bindSet(speedSl, (v) => { P.speed = v; });
  attractSl = bindSet(attractSl, (v) => { P.attract = v; });
  edgeSl = bindSet(edgeSl, (v) => { P.edge = v; });
  flowSl = bindSet(flowSl, (v) => { P.flow = v; });

  const pauseBtn = btn('Pause', (e) => {
    paused = !paused;
    e.target.textContent = paused ? 'Play' : 'Pause';
  });

  const panelEl = h('div', {
    style: {
      position: 'absolute', top: '16px', right: '16px', width: '240px',
      background: '#1a1c2eee', border: '1px solid #ffffff18', borderRadius: '12px',
      padding: '14px', display: 'grid', gap: '8px', fontSize: '12px', zIndex: 4,
      backdropFilter: 'blur(8px)',
    },
  },
    h('div.k-row', {}, h('b', {}, 'Controls'), h('span', { style: { flex: 1 } }), pauseBtn),
    speedSl, attractSl, edgeSl, flowSl,
    h('div', { style: { opacity: .55, fontSize: '10px', letterSpacing: '.1em' } }, 'PALETTE'),
    chipWrap,
    h('div.k-row', { style: { gap: '6px' } },
      btn('🎲 Randomize', randomize, 'pri'),
      btn('PNG', () => {
        const a = h('a', { download: 'particle-drift.png', href: cv.toDataURL('image/png') });
        a.click();
        toast('screenshot stub');
      }),
    ),
    h('div', { style: { opacity: .45, fontSize: '10px', lineHeight: 1.5 } }, 'Space pause · R randomize · S screenshot'),
  );

  const title = h('div', {
    style: {
      position: 'absolute', left: '20px', bottom: '18px', zIndex: 3,
      fontSize: '12px', opacity: .5, letterSpacing: '.08em',
    },
  }, 'silhouette → flowing particles');

  root.append(panelEl, title);
  paintChips();
  seedFromProcedural();
  // dark clear first frame
  fitCanvas(cv, root); cv.g.fillStyle = '#0e1020'; cv.g.fillRect(0, 0, cv.W, cv.H);
  requestAnimationFrame(loop);

  const onKey = (e) => {
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      paused = !paused;
      pauseBtn.textContent = paused ? 'Play' : 'Pause';
    } else if (e.key === 'r' || e.key === 'R') {
      randomize();
    } else if (e.key === 's' || e.key === 'S') {
      const a = h('a', { download: 'particle-drift.png', href: cv.toDataURL('image/png') });
      a.click();
    }
  };
  window.addEventListener('keydown', onKey);

  window.__demoProof = async () => {
    const before = { ...P, pal, paused };
    P.speed = 1.2;
    P.attract = 0.8;
    P.flow = 0.7;
    pal = 1;
    paused = false;
    spawnParticles();
    await sleep(200);
    paused = true;
    await sleep(80);
    Object.assign(P, before);
    pal = before.pal;
    paused = false;
    seedFromProcedural();
    return 'speed/attract/flow + palette + pause exercised, restored';
  };
};


V['paperplanes-throw-catch-world'] = (root, T) => {
  theme(root, T, { bg: '#a8b0e8', fg: '#2a2a44', panel: '#ffffffcc', ac: '#ff7eb6', dark: false, line: '#ffffff55' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'system-ui, Inter Variable, sans-serif';

  const STAMPS = ['Seoul', 'Tokyo', 'Lisbon', 'Cairo', 'Lima', 'Oslo', 'Nairobi', 'Reykjavík'];
  let mode = 'fold'; // fold | stamp | throw | catch
  let fold = 0; // 0..1
  let stamp = STAMPS[0];
  let hand = null; // plane being prepared {fold, stamp}
  let catchMsg = null;
  const flock = [];
  const R = rng(42);

  const seedFlock = (n = 28) => {
    flock.length = 0;
    for (let i = 0; i < n; i++) {
      flock.push({
        x: R(), y: 0.15 + R() * 0.55,
        vx: 0.08 + R() * 0.18, vy: (R() - 0.5) * 0.04,
        a: R() * Math.PI * 2, s: 0.7 + R() * 0.6,
        stamp: STAMPS[(R() * STAMPS.length) | 0],
        tint: R() > 0.5 ? '#fff8f0' : '#f4f0ff',
      });
    }
  };
  seedFlock();

  const cv = h('canvas', { style: { position: 'absolute', inset: 0, touchAction: 'none', cursor: 'pointer' } });
  root.append(cv);

  const drawPlane = (g, x, y, ang, sc, fill, outline = '#2a2a4422') => {
    g.save();
    g.translate(x, y);
    g.rotate(ang);
    g.scale(sc, sc);
    g.fillStyle = fill;
    g.strokeStyle = outline;
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(18, 0);
    g.lineTo(-14, 8);
    g.lineTo(-8, 0);
    g.lineTo(-14, -8);
    g.closePath();
    g.fill();
    g.stroke();
    g.beginPath();
    g.moveTo(-8, 0); g.lineTo(18, 0);
    g.strokeStyle = '#2a2a4433';
    g.stroke();
    g.restore();
  };

  const hud = h('div', {
    style: {
      position: 'absolute', left: '50%', bottom: '22px', transform: 'translateX(-50%)',
      display: 'flex', gap: '8px', zIndex: 5, alignItems: 'center',
      background: '#ffffffb8', backdropFilter: 'blur(10px)', padding: '10px 14px',
      borderRadius: '999px', boxShadow: '0 8px 28px #2a2a4418', border: '1px solid #ffffffaa',
    },
  });
  const status = h('div', {
    style: {
      position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 5, textAlign: 'center', color: '#2a2a44', fontWeight: 600, fontSize: '14px',
      letterSpacing: '.04em', textShadow: '0 1px 0 #fff8',
    },
  }, 'Fold a plane · soft sky flock');
  const catchCard = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '28%', transform: 'translate(-50%,-50%)',
      background: '#fffef8', borderRadius: '14px', padding: '18px 22px', zIndex: 6,
      boxShadow: '0 18px 50px #2a2a4433', border: '1px solid #e8e0d0', display: 'none',
      minWidth: '220px', textAlign: 'center',
    },
  });

  const setMode = (m) => {
    mode = m;
    status.textContent = ({
      fold: '① Fold — drag corners or tap Fold',
      stamp: '② Stamp — pick a city mark',
      throw: '③ Throw — flick into the flock',
      catch: '④ Catch — click a nearby plane',
    })[m];
    paintHud();
  };

  const paintHud = () => {
    const mk = (label, on, pri) => h('button', {
      style: {
        border: 0, borderRadius: '999px', padding: '8px 14px', cursor: 'pointer',
        fontWeight: 700, fontSize: '12px', letterSpacing: '.04em',
        background: on ? '#ff7eb6' : (pri ? '#7c5cff' : '#2a2a4410'),
        color: on || pri ? '#fff' : '#2a2a44',
      },
      onclick: () => {
        if (label === 'Fold') {
          fold = Math.min(1, fold + 0.34);
          if (fold >= 1) { hand = { fold: 1, stamp }; setMode('stamp'); }
          else setMode('fold');
        } else if (label === 'Stamp') {
          stamp = STAMPS[(STAMPS.indexOf(stamp) + 1) % STAMPS.length];
          if (hand) hand.stamp = stamp;
          setMode('stamp');
        } else if (label === 'Throw') {
          if (!hand) { hand = { fold: 1, stamp }; }
          // launch
          flock.push({
            x: 0.5, y: 0.72, vx: 0.35 + R() * 0.15, vy: -0.22 - R() * 0.08,
            a: -0.4, s: 1.1, stamp: hand.stamp, tint: '#fffef5', thrown: true,
          });
          hand = null; fold = 0;
          toast('thrown ✈');
          setMode('catch');
        } else if (label === 'Catch') {
          setMode('catch');
        } else if (label === 'Reset') {
          fold = 0; hand = null; catchMsg = null; catchCard.style.display = 'none';
          seedFlock(); setMode('fold');
        }
      },
    }, label);
    hud.replaceChildren(
      mk('Fold', mode === 'fold'),
      mk('Stamp', mode === 'stamp'),
      h('span', { style: { fontSize: '11px', opacity: .7, padding: '0 4px' } }, stamp),
      mk('Throw', mode === 'throw' || mode === 'stamp', true),
      mk('Catch', mode === 'catch'),
      mk('Reset', false),
    );
  };

  cv.addEventListener('pointerdown', (e) => {
    const q = localPos(e, cv);
    if (mode === 'fold') {
      fold = Math.min(1, fold + 0.25);
      if (fold >= 1) { hand = { fold: 1, stamp }; setMode('stamp'); }
      return;
    }
    if (mode === 'catch' || mode === 'throw') {
      fitCanvas(cv, root);
      const W = cv.W, H = cv.H;
      let best = null, bd = 40;
      for (const p of flock) {
        const d = Math.hypot(p.x * W - q.x, p.y * H - q.y);
        if (d < bd) { bd = d; best = p; }
      }
      if (best) {
        catchMsg = best;
        catchCard.style.display = 'block';
        catchCard.replaceChildren(
          h('div', { style: { fontSize: '11px', letterSpacing: '.14em', opacity: .55, marginBottom: '6px' } }, 'CAUGHT PLANE'),
          h('div', { style: { fontSize: '28px', margin: '4px 0' } }, '✈'),
          h('div', { style: { fontWeight: 700, fontSize: '16px' } }, best.stamp),
          h('div', { style: { fontSize: '12px', opacity: .65, marginTop: '6px' } }, 'passport stamp · add yours & rethrow'),
          h('div.k-row', { style: { justifyContent: 'center', gap: '8px', marginTop: '12px' } },
            btn('Stamp + Throw', () => {
              best.stamp = stamp;
              catchCard.style.display = 'none';
              best.vx += 0.2; best.vy -= 0.12;
              toast('rethrown from ' + stamp);
              catchMsg = null;
            }, 'pri'),
            btn('Release', () => { catchCard.style.display = 'none'; catchMsg = null; }),
          ),
        );
      }
    }
  });

  // drag-fold
  drag(cv, {
    move: () => {
      if (mode === 'fold') {
        fold = Math.min(1, fold + 0.02);
        if (fold >= 1) { hand = { fold: 1, stamp }; setMode('stamp'); }
      }
    },
  });

  const loop = (tms) => {
    fitCanvas(cv, root);
    const g = cv.g, W = cv.W, H = cv.H;
    const t = tms * 0.001;
    // pastel sky gradient that slowly shifts
    const sky = g.createLinearGradient(0, 0, 0, H);
    const hueShift = (Math.sin(t * 0.08) + 1) * 0.5;
    sky.addColorStop(0, `hsl(${210 + hueShift * 40} 55% 82%)`);
    sky.addColorStop(0.55, `hsl(${280 + hueShift * 20} 45% 78%)`);
    sky.addColorStop(1, `hsl(${320 - hueShift * 30} 50% 84%)`);
    g.fillStyle = sky;
    g.fillRect(0, 0, W, H);
    // soft haze clouds
    g.fillStyle = '#ffffff22';
    for (let i = 0; i < 5; i++) {
      const cx = ((t * 12 + i * 180) % (W + 200)) - 100;
      const cy = H * (0.18 + (i % 3) * 0.12);
      g.beginPath(); g.ellipse(cx, cy, 90 + i * 10, 28, 0, 0, 7); g.fill();
    }

    // flock update (boids-lite)
    for (const p of flock) {
      // slight cohesion toward center band
      p.vx += (0.55 - p.x) * 0.0008;
      p.vy += (0.4 - p.y) * 0.0006;
      p.vx += Math.sin(t + p.a) * 0.0004;
      p.vy += Math.cos(t * 0.7 + p.a) * 0.0003;
      p.vx *= 0.995; p.vy *= 0.995;
      const sp = Math.hypot(p.vx, p.vy) || 0.01;
      const max = p.thrown ? 0.55 : 0.22;
      if (sp > max) { p.vx *= max / sp; p.vy *= max / sp; }
      p.x += p.vx * 0.016;
      p.y += p.vy * 0.016;
      p.a = Math.atan2(p.vy, p.vx);
      if (p.x > 1.12) { p.x = -0.08; p.thrown = false; }
      if (p.x < -0.12) p.x = 1.08;
      if (p.y < 0.05) { p.y = 0.05; p.vy *= -0.4; }
      if (p.y > 0.85) { p.y = 0.85; p.vy *= -0.4; }
    }
    for (const p of flock) {
      drawPlane(g, p.x * W, p.y * H, p.a, 10 * p.s, p.tint);
    }

    // folding paper sheet / hand plane
    if (mode === 'fold' || (hand && mode === 'stamp')) {
      const cx = W * 0.5, cy = H * 0.72;
      const f = hand ? 1 : fold;
      g.save();
      g.translate(cx, cy);
      if (f < 1) {
        // paper sheet collapsing
        const w = 70 * (1 - f * 0.55), hh = 90 * (1 - f * 0.4);
        g.fillStyle = '#fffef8';
        g.strokeStyle = '#c8c0b0';
        g.lineWidth = 1.5;
        g.beginPath();
        g.moveTo(-w, -hh * (1 - f));
        g.lineTo(w * (1 - f * 0.3), -hh * 0.2);
        g.lineTo(w * 0.2, hh * (1 - f * 0.5));
        g.lineTo(-w * (0.6 + f * 0.2), hh * 0.3);
        g.closePath();
        g.fill(); g.stroke();
        g.fillStyle = '#ff7eb655';
        g.font = '11px system-ui';
        g.fillText(Math.round(f * 100) + '% folded', -20, hh + 18);
      } else {
        drawPlane(g, 0, 0, -0.35, 16, '#fffef5', '#2a2a4466');
        g.fillStyle = '#ff7eb6';
        g.font = 'bold 11px system-ui';
        g.fillText(stamp, -16, 28);
      }
      g.restore();
    }

    requestAnimationFrame(loop);
  };

  root.append(hud, status, catchCard);
  setMode('fold');
  requestAnimationFrame(loop);

  window.__demoProof = async () => {
    const before = { mode, fold, stamp, n: flock.length };
    fold = 1; hand = { fold: 1, stamp: 'Seoul' }; stamp = 'Seoul';
    setMode('stamp');
    await sleep(80);
    stamp = 'Tokyo'; hand.stamp = stamp; setMode('stamp');
    await sleep(60);
    flock.push({ x: 0.5, y: 0.72, vx: 0.4, vy: -0.25, a: -0.4, s: 1.2, stamp: 'Tokyo', tint: '#fffef5', thrown: true });
    hand = null; fold = 0; setMode('catch');
    await sleep(120);
    catchMsg = flock[flock.length - 1];
    catchCard.style.display = 'block';
    catchCard.textContent = 'caught ' + catchMsg.stamp;
    await sleep(100);
    catchCard.style.display = 'none'; catchMsg = null;
    fold = before.fold; stamp = before.stamp; hand = null; setMode('fold');
    return 'fold→stamp→throw→catch exercised, restored';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['falling-sand-particle-sandbox'])(root, T); }
