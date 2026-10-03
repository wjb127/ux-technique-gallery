import '@fontsource/vt323';
import '@fontsource/press-start-2p';
import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle, codebox } from '../kit.js';
import { scene } from './imagefx.js';
// generic pixel grid editor on canvas
function pixGrid({ w = 32, hh = 32, cell = 16, bg = null, grid = '#0002', checker = true, onChange = () => {} }) {
  const cv = h('canvas', { width: w * cell, height: hh * cell, style: { imageRendering: 'pixelated', cursor: 'crosshair', touchAction: 'none' } });
  const g = cv.getContext('2d'); const data = new Array(w * hh).fill(null); const st = { color: '#000', tool: 'pen', mirror: false };
  const render = () => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const c = data[y * w + x]; g.fillStyle = c || (bg ? bg : checker ? ((x + y) % 2 ? '#bcbcbc' : '#a8a8a8') : '#fff'); g.fillRect(x * cell, y * cell, cell, cell); } if (grid) { g.strokeStyle = grid; g.lineWidth = 1; g.beginPath(); for (let i = 0; i <= w; i++) { g.moveTo(i * cell + 0.5, 0); g.lineTo(i * cell + 0.5, hh * cell); } for (let i = 0; i <= hh; i++) { g.moveTo(0, i * cell + 0.5); g.lineTo(w * cell, i * cell + 0.5); } g.stroke(); } };
  const set = (x, y, c) => { if (x < 0 || y < 0 || x >= w || y >= hh) return; data[y * w + x] = c; if (st.mirror) data[y * w + (w - 1 - x)] = c; };
  const flood = (x, y, c) => { const t = data[y * w + x]; if (t === c) return; const q = [[x, y]]; while (q.length) { const [a, b] = q.pop(); if (a < 0 || b < 0 || a >= w || b >= hh || data[b * w + a] !== t) continue; data[b * w + a] = c; q.push([a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]); } };
  const at = (e) => { const p = localPos(e, cv); const r = cv.getBoundingClientRect(); return [Math.floor((p.x / r.width) * w), Math.floor((p.y / r.height) * hh)]; };
  const act = (e) => { const [x, y] = at(e); if (st.tool === 'fill') flood(x, y, st.color); else if (st.tool === 'pick') { st.color = data[y * w + x] || st.color; st.onPick?.(st.color); } else set(x, y, st.tool === 'erase' ? null : st.color); render(); onChange(); };
  drag(cv, { start: act, move: (e) => st.tool !== 'fill' && act(e) });
  render();
  return { cv, data, set, st, render, flood, w, hh, clear: () => { data.fill(null); render(); onChange(); } };
}
const drawSprite = (G, rows, map, ox = 0, oy = 0) => rows.forEach((r, y) => [...r].forEach((ch, x) => map[ch] && G.set(ox + x, oy + y, map[ch])));
const SLIME = ['.....kkkkkk.....', '...kkggggggkk...', '..kggggggggggk..', '.kgggwwggwwgggk.', '.kggwkkggwkkggk.', 'kgggwkkggwkkgggk', 'kggggggggggggggk', 'kgggggrrrrgggggk', 'kggggggrrggggggk', 'kkggggggggggggkk', '.kkkkkkkkkkkkkk.'];
const SMAP = { k: '#1b2a1b', g: '#6ccf4c', w: '#ffffff', r: '#c0392b' };
const V = {};
V['pixel-sprite-editor-workspace'] = (root, T) => {
  theme(root, T, { bg: '#2c2c2c', fg: '#ccc', panel: '#3a3a3a', ac: '#ffd700', acfg: '#000', dark: true });
  const prev = h('canvas', { width: 128, height: 128, style: { imageRendering: 'pixelated', background: '#a8a8a8', width: '180px', height: '180px' } });
  const G = pixGrid({ w: 32, hh: 32, cell: 20, grid: null, onChange: () => upd() });
  const frames = [G.data.slice()]; let cur = 0; const fl = h('div', { style: { display: 'grid', gap: '6px' } });
  const upd = () => { frames[cur] = G.data.slice(); const g = prev.getContext('2d'); g.clearRect(0, 0, 128, 128); G.data.forEach((c, i) => { if (c) { g.fillStyle = c; g.fillRect((i % 32) * 4, Math.floor(i / 32) * 4, 4, 4); } }); fl.replaceChildren(...frames.map((f, i) => { const c = h('canvas', { width: 32, height: 32, style: { width: '84px', height: '84px', imageRendering: 'pixelated', background: '#a8a8a8', border: i === cur ? '3px solid #ffd700' : '3px solid #555', cursor: 'pointer' }, onclick: () => { cur = i; G.data.splice(0, G.data.length, ...frames[i]); G.render(); upd(); } }); const cg = c.getContext('2d'); f.forEach((col, j) => { if (col) { cg.fillStyle = col; cg.fillRect(j % 32, Math.floor(j / 32), 1, 1); } }); return h('div', { style: { position: 'relative' } }, h('span', { style: { position: 'absolute', left: '4px', top: '2px', fontSize: '10px', color: '#fff', background: '#000a', padding: '0 3px' } }, i + 1), c); }), h('button', { style: { width: '90px', height: '40px', background: '#444', color: '#aaa', border: '2px dashed #666' }, onclick: () => { frames.push(G.data.slice()); cur = frames.length - 1; upd(); } }, '+ Add frame')); };
  const TOOLS = [['pen', '✎'], ['mirror', '⇋'], ['fill', '🪣'], ['erase', '⌫'], ['pick', '💧'], ['rect', '▭'], ['circle', '◯'], ['move', '✥'], ['select', '⬚'], ['lasso', '➰'], ['light', '☀'], ['dither', '▦']];
  const tb = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', width: '76px' } }, TOOLS.map(([t, ic]) => h('button', { title: t, style: { width: '36px', height: '36px', background: '#3a3a3a', color: '#ddd', border: t === 'pen' ? '2px solid #ffd700' : '2px solid #3a3a3a', fontSize: '16px' }, onclick: (e) => { tb.querySelectorAll('button').forEach((b) => (b.style.borderColor = '#3a3a3a')); e.currentTarget.style.borderColor = '#ffd700'; if (t === 'mirror') { G.st.mirror = !G.st.mirror; G.st.tool = 'pen'; } else G.st.tool = t; } }, ic)));
  const col = h('input', { type: 'color', value: '#000000', oninput: (e) => (G.st.color = e.target.value), style: { width: '50px', height: '50px' } }); G.st.onPick = (c) => (col.value = c);
  let fps = 12, pi = 0; setInterval(() => { if (frames.length > 1) { pi = (pi + 1) % frames.length; const g = prev.getContext('2d'); g.clearRect(0, 0, 128, 128); frames[pi].forEach((c, i) => { if (c) { g.fillStyle = c; g.fillRect((i % 32) * 4, Math.floor(i / 32) * 4, 4, 4); } }); } }, 1000 / fps);
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '36px', background: '#000', padding: '0 10px' } }, h('b', { style: { color: '#fff', fontFamily: 'Press Start 2P', fontSize: '12px' } }, 'PISKEL-ish'), h('span', { style: { flex: 1, textAlign: 'center', color: '#888' } }, 'New Piskel'), h('span', { style: { background: '#ffd700', color: '#000', padding: '4px 10px', fontSize: '12px' } }, 'Sign in')),
    h('div', { style: { position: 'absolute', top: '46px', left: '8px', display: 'grid', gap: '10px' } }, tb, col), h('div', { style: { position: 'absolute', top: '46px', left: '100px', width: '110px', bottom: '10px', overflow: 'auto' } }, fl),
    h('div', { style: { position: 'absolute', top: '46px', left: '220px', right: '270px', bottom: '10px', display: 'grid', placeItems: 'center', background: '#1f1f1f' } }, G.cv),
    h('div', { style: { position: 'absolute', top: '46px', right: '50px', width: '210px', display: 'grid', gap: '8px' } }, prev, slider('FPS', 1, 24, fps, 1, (v) => (fps = v)), panel('Layers', h('div', { style: { background: '#ffd700', color: '#000', padding: '4px' } }, 'Layer 1'), h('div', { style: { padding: '4px' } }, 'Layer 2'))),
    h('div', { style: { position: 'absolute', top: '46px', right: 0, width: '40px', display: 'grid', gap: '8px', fontSize: '18px', justifyItems: 'center' } }, '⚙', '⤢', '💾', '🖼', '⬇'));
  G.cv.style.width = '600px'; G.cv.style.height = '600px'; G.cv.style.maxHeight = '95%'; G.cv.style.width = 'auto'; G.cv.style.aspectRatio = '1';
  upd();
  window.__demoProof = async () => { drawSprite(G, SLIME, SMAP, 8, 11); G.render(); upd(); frames.push(G.data.map((c, i) => (c === '#6ccf4c' && i % 7 === 0 ? '#8fe36d' : c))); upd(); return 'drew slime sprite + 2 frames animating'; };
};
V['pixel-favicon-grid-studio'] = (root, T) => {
  theme(root, T, { bg: '#111', fg: '#ccc', panel: '#1b1b1b', ac: '#e0b000', acfg: '#000', dark: true });
  root.style.fontFamily = 'JetBrains Mono Variable, monospace';
  const PAL = ['#000', '#fff', '#9d9d9d', '#be2633', '#e06f8b', '#493c2b', '#a46422', '#eb8931', '#f7e26b', '#2f484e', '#44891a', '#a3ce27', '#1b2632', '#005784', '#31a2f2', '#b2dcef'];
  const pv = [16, 32, 64].map((z) => h('canvas', { width: 16, height: 16, style: { width: z + 'px', height: z + 'px', imageRendering: 'pixelated', background: '#222' } }));
  const G = pixGrid({ w: 16, hh: 16, cell: 24, bg: '#1d1d1d', grid: '#333', onChange: () => pv.forEach((c) => { const g = c.getContext('2d'); g.clearRect(0, 0, 16, 16); G.data.forEach((col, i) => { if (col) { g.fillStyle = col; g.fillRect(i % 16, Math.floor(i / 16), 1, 1); } }); }) });
  const sw = h('div.k-row', { style: { gap: '2px' } }, PAL.map((c) => h('div', { style: { width: '18px', height: '18px', background: c, cursor: 'pointer', outline: c === '#000' ? '2px solid #e0b000' : '' }, onclick: (e) => { G.st.color = c; sw.querySelectorAll('div').forEach((d) => (d.style.outline = '')); e.target.style.outline = '2px solid #e0b000'; } })));
  root.append(h('div', { style: { maxWidth: '900px', margin: '30px auto', display: 'grid', gap: '14px' } }, h('div', { style: { fontSize: '20px', color: '#fff' } }, 'pxicons-ish'), h('div', { style: { fontSize: '12px', opacity: .6 } }, 'draw a 16×16 favicon'), h('div.k-row', { style: { fontSize: '12px' } }, 'tools:', seg([['pen', 'pen'], ['erase', 'erase'], ['fill', 'fill'], ['pick', 'pick']], 'pen', (v) => (G.st.tool = v)), toggle('mirror', false, (v) => (G.st.mirror = v)), btn('clear', () => G.clear())), sw, h('div.k-row', { style: { alignItems: 'flex-start', gap: '30px' } }, G.cv, h('div', { style: { display: 'grid', gap: '16px' } }, ...pv.map((c, i) => h('div.k-row', {}, c, h('span', { style: { fontSize: '11px' } }, [16, 32, 64][i] + 'px'))), h('div', { style: { background: '#2a2a2a', padding: '6px 10px', borderRadius: '6px 6px 0 0', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center', width: '200px' } }, pv[0].cloneNode(), 'My site — tab preview'))), h('div.k-row', { style: { fontSize: '12px' } }, btn('↓ favicon.ico', () => toast('favicon.ico'), 'pri'), btn('↓ png 32', () => toast('png')), btn('↓ svg', () => toast('svg')), btn('copy <link>', () => copy('<link rel="icon" href="/favicon.ico">'))), h('p', { style: { fontSize: '12px', opacity: .6, lineHeight: 1.7, maxWidth: '640px' } }, 'pxicons is a simple free online tool for drawing pixel-art favicons. Choose a colour from the palette, click the grid to draw, and export as ICO, PNG or SVG.')));
  window.__demoProof = async () => { const HEART = ['..rr..rr..', '.rrrrrrrr.', 'rrrrrrrrrr', 'rrrwrrrrrr', '.rrrrrrrr.', '..rrrrrr..', '...rrrr...', '....rr....']; drawSprite(G, HEART, { r: '#be2633', w: '#fff' }, 3, 4); G.render(); G.cv.dispatchEvent(new Event('x')); pv.forEach((c) => { const g = c.getContext('2d'); G.data.forEach((col, i) => { if (col) { g.fillStyle = col; g.fillRect(i % 16, Math.floor(i / 16), 1, 1); } }); }); return 'drew heart favicon, 16/32/64 previews'; };
};
V['modular-glyph-grid-editor'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#000', panel: '#fff', ac: '#000', dark: false });
  const MODS = ['M0 0H1V1H0Z', 'M0 0H1V1Z', 'M0 0H1L0 1Z', 'M0 1L1 0V1Z', 'M0 0L1 1H0Z', 'M0 0A1 1 0 0 1 1 1H0Z', 'M1 0A1 1 0 0 0 0 1H1Z', 'M0 0H1A1 1 0 0 1 0 1Z', 'M1 1A1 1 0 0 1 0 0H1Z', 'M.5 0A.5 .5 0 1 1 .5 1A.5 .5 0 1 1 .5 0Z', 'M0 0H.5V1H0Z', 'M0 .5H1V1H0Z', 'M0 0H1V.5H0Z', 'M.5 0H1V1H.5Z', 'M.5 0L1 .5L.5 1L0 .5Z', 'M0 0H1V1H0ZM.25 .25V.75H.75V.25Z'];
  let cur = 0; const N = 10; const cells = new Array(N * N).fill(-1);
  const grid = s('svg', { viewBox: `0 0 ${N} ${N}`, width: 520, height: 520, style: 'background:#fff;cursor:crosshair;border:1px solid #eee' });
  const draw = () => { grid.replaceChildren(...Array.from({ length: N * N }, (_, i) => s('g', { transform: `translate(${i % N} ${Math.floor(i / N)})` }, s('rect', { width: 1, height: 1, fill: '#fff', stroke: '#e6e6e6', 'stroke-width': 0.02 }), cells[i] >= 0 ? s('path', { d: MODS[cells[i]], fill: '#000' }) : null))); };
  const hit = (e) => { const p = localPos(e, grid); const r = grid.getBoundingClientRect(); const i = Math.floor((p.y / r.height) * N) * N + Math.floor((p.x / r.width) * N); if (i >= 0 && i < N * N) { cells[i] = e.shiftKey ? -1 : cur; draw(); } };
  drag(grid, { start: hit, move: hit });
  const lib = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '8px' } }, MODS.map((d, i) => { const b = h('div', { style: { padding: '4px', outline: i === 0 ? '2px solid #0a0' : '', cursor: 'pointer' }, onclick: () => { cur = i; lib.querySelectorAll('div').forEach((x) => (x.style.outline = '')); b.style.outline = '2px solid #0a0'; } }, s('svg', { viewBox: '0 0 1 1', width: 30, height: 30 }, s('path', { d, fill: '#000' }))); return b; }));
  const ex = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '10px' } }, 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('').map((c) => h('div', { style: { font: '900 30px Inter Variable', textAlign: 'center' } }, c)));
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 520px';
  root.append(h('div', { style: { display: 'grid', placeItems: 'center', background: '#f4f4f4' } }, grid), h('div', { style: { padding: '14px', borderLeft: '1px solid #ddd', overflow: 'auto', fontSize: '12px', display: 'grid', gap: '10px', alignContent: 'start' } }, h('div.k-row', {}, 'Font', 'Glyphs', 'Settings', 'Save', 'Help'), h('b', {}, 'GLYPH DATA'), h('div.k-row', {}, 'Rows', h('b', {}, N), 'Cols', h('b', {}, N), btn('Export SVG', () => copy(grid.outerHTML)), h('span', { style: { background: '#2c2', width: '14px', height: '14px' } })), h('b', {}, 'SELECT GLYPH'), ex, h('b', {}, 'MODULE SELECTION'), lib));
  draw();
  window.__demoProof = async () => { const A = [[2, 1, 6], [3, 1, 0], [4, 1, 0], [5, 1, 0], [6, 1, 0], [7, 1, 5], [2, 2, 0], [7, 2, 0], [2, 3, 0], [7, 3, 0], [2, 4, 0], [3, 4, 0], [4, 4, 0], [5, 4, 0], [6, 4, 0], [7, 4, 0], [2, 5, 0], [7, 5, 0], [2, 6, 0], [7, 6, 0], [2, 7, 0], [7, 7, 0], [2, 8, 3], [7, 8, 4]]; A.forEach(([x, y, m]) => (cells[y * N + x] = m)); draw(); return 'built glyph "A" from modules'; };
};
V['ascii-diagram-canvas'] = (root, T) => {
  theme(root, T, { bg: '#fbfbfd', fg: '#333', ac: '#26a', dark: false });
  const CW = 9, CH = 17; const cols = 150, rows = 50; const txt = Array.from({ length: rows }, () => new Array(cols).fill(' '));
  const board = h('pre', { style: { position: 'absolute', inset: '0', margin: 0, font: `15px/17px 'JetBrains Mono Variable',monospace`, color: '#222', backgroundImage: 'linear-gradient(#e8e8f0 1px,transparent 1px),linear-gradient(90deg,#e8e8f0 1px,transparent 1px)', backgroundSize: `${CW}px ${CH}px`, cursor: 'crosshair', userSelect: 'none', letterSpacing: '0' } });
  let tool = 'box', start = null, snap = null;
  const draw = () => (board.textContent = txt.map((r) => r.join('')).join('\n'));
  const cell = (e) => { const p = localPos(e, board); return [clamp(Math.floor(p.x / CW), 0, cols - 1), clamp(Math.floor(p.y / CH), 0, rows - 1)]; };
  const box = (x0, y0, x1, y1) => { [x0, x1] = [Math.min(x0, x1), Math.max(x0, x1)]; [y0, y1] = [Math.min(y0, y1), Math.max(y0, y1)]; for (let x = x0; x <= x1; x++) { txt[y0][x] = txt[y1][x] = '─'; } for (let y = y0; y <= y1; y++) { txt[y][x0] = txt[y][x1] = '│'; } txt[y0][x0] = '┌'; txt[y0][x1] = '┐'; txt[y1][x0] = '└'; txt[y1][x1] = '┘'; };
  const line = (x0, y0, x1, y1, arrow) => { for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) txt[y0][x] = '─'; for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) txt[y][x1] = '│'; if (x0 !== x1 && y0 !== y1) txt[y0][x1] = y1 > y0 ? (x1 > x0 ? '┐' : '┌') : x1 > x0 ? '┘' : '└'; if (arrow) txt[y1][x1] = y1 !== y0 ? (y1 > y0 ? '▼' : '▲') : x1 > x0 ? '►' : '◄'; };
  const text = (x, y, t) => [...t].forEach((c, i) => (txt[y][x + i] = c));
  drag(board, { start: (e) => { start = cell(e); snap = txt.map((r) => r.slice()); if (tool === 'text') { const t = prompt('Text', 'Hello'); if (t) text(...start, t); draw(); return false; } }, move: (e) => { const [x, y] = cell(e); snap.forEach((r, i) => (txt[i] = r.slice())); if (tool === 'box') box(...start, x, y); if (tool === 'line' || tool === 'arrow') line(...start, x, y, tool === 'arrow'); if (tool === 'freeform') { snap[y][x] = '*'; txt[y][x] = '*'; } if (tool === 'erase') for (let yy = Math.min(start[1], y); yy <= Math.max(start[1], y); yy++) for (let xx = Math.min(start[0], x); xx <= Math.max(start[0], x); xx++) txt[yy][xx] = ' '; draw(); } });
  const bar = h('div.k-row', { style: { position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '4px 8px', fontSize: '12px', boxShadow: '0 2px 8px #0001', zIndex: 2 } }, h('b', {}, 'ASCIIFlow-ish'), seg([['box', '▭ Box'], ['select', '⬚ Select'], ['line', '╱ Line'], ['arrow', '→ Arrow'], ['text', 'T Text'], ['freeform', '✎ Freeform'], ['erase', '⌫ Erase']], tool, (v) => (tool = v)), btn('Copy', () => { copy(board.textContent.replace(/ +$/gm, '').trim()); toast('Copied ASCII'); }), btn('Clear', () => { txt.forEach((r) => r.fill(' ')); draw(); }));
  root.append(board, bar); draw();
  window.__demoProof = async () => { box(20, 8, 40, 14); text(25, 11, 'Browser'); box(70, 8, 92, 14); text(76, 11, 'API'); line(41, 11, 69, 11, true); box(70, 24, 92, 30); text(74, 27, 'Database'); line(81, 15, 81, 23, true); text(48, 10, 'fetch()'); draw(); return 'drew 3 boxes + arrows as ASCII'; };
};
V['math-pixel-codegolf-stage'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#fff', ac: '#f24', dark: true });
  let src = 'sin(t-sqrt((x-7.5)**2+(y-6)**2))', fn = null, t0 = performance.now();
  const N = 16, D = 28; const dots = Array.from({ length: N * N }, () => h('div', { style: { width: D + 'px', height: D + 'px', borderRadius: '50%', transform: 'scale(0)', background: '#fff' } }));
  const gridEl = h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(${N},${D}px)`, gap: '4px', margin: '0 auto' } }, dots);
  const err = h('div', { style: { color: '#f24', minHeight: '1em' } });
  const compile = () => { try { fn = new Function('t', 'i', 'x', 'y', `with(Math){return (${src})}`); fn(0, 0, 0, 0); err.textContent = ''; } catch (e) { err.textContent = e.message; } };
  const inp = h('input', { value: src, spellcheck: false, oninput: (e) => { src = e.target.value; compile(); }, style: { width: '540px', background: 'transparent', color: '#fff', border: 0, borderBottom: '1px solid #444', font: "16px 'JetBrains Mono Variable',monospace", outline: 'none', textAlign: 'center' } });
  const loop = () => { const t = (performance.now() - t0) / 1000; if (fn) for (let i = 0; i < N * N; i++) { let v = 0; try { v = +fn(t, i, i % N, Math.floor(i / N)) || 0; } catch {} v = clamp(v, -1, 1); dots[i].style.transform = `scale(${Math.abs(v)})`; dots[i].style.background = v < 0 ? '#f24' : '#fff'; } requestAnimationFrame(loop); };
  const EX = ['sin(t-sqrt((x-7.5)**2+(y-6)**2))', 'sin(y/8+t)', 'random()-0.5', '(x+y)%2*2-1', 'sin(x/2)-sin(x-t)-y+6', 'y-x*sin(t)', 'x&y', '1/32*tan(t/64*x*tan(i-x))'];
  root.append(h('div', { style: { paddingTop: '70px', display: 'grid', justifyItems: 'center', gap: '24px', fontFamily: "'JetBrains Mono Variable',monospace" } }, gridEl, h('div', { style: { color: '#888' } }, '(t,i,x,y) =>'), inp, err, h('div', { style: { fontSize: '12px', color: '#666', display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '700px', justifyContent: 'center' } }, EX.map((e) => h('span', { style: { cursor: 'pointer', borderBottom: '1px dotted #666' }, onclick: () => { inp.value = src = e; compile(); } }, e))), h('div', { style: { color: '#666', fontSize: '12px' } }, `${src.length} chars · tixy-ish`)));
  compile(); loop();
  window.__demoProof = async () => { await sleep(400); return 'expression evaluated live over 16×16 dots'; };
};
function knotTile(k, size = 1) { const P = { fill: 'none', stroke: '#fff', 'stroke-width': 0.12, 'stroke-linecap': 'round' }; const T = [[], ['M.35 0V1', 'M.65 0V1'], ['M0 .35H1', 'M0 .65H1'], ['M.35 1A.65 .65 0 0 1 1 .35', 'M.65 1A.35 .35 0 0 1 1 .65'], ['M0 .35A.65 .65 0 0 1 .65 1', 'M0 .65A.35 .35 0 0 1 .35 1'], ['M.35 0A.65 .65 0 0 0 1 .65', 'M.65 0A.35 .35 0 0 0 1 .35'], ['M0 .65A.65 .65 0 0 0 .65 0', 'M0 .35A.35 .35 0 0 0 .35 0'], ['M.35 0V1', 'M.65 0V1', 'M0 .35H.3', 'M.7 .35H1', 'M0 .65H.3', 'M.7 .65H1'], ['M.35 0A.65 .65 0 0 0 1 .65', 'M.65 0A.35 .35 0 0 0 1 .35', 'M0 .35A.65 .65 0 0 1 .65 1', 'M0 .65A.35 .35 0 0 1 .35 1'], ['M.35 1A.65 .65 0 0 1 1 .35', 'M.65 1A.35 .35 0 0 1 1 .65', 'M0 .65A.65 .65 0 0 0 .65 0', 'M0 .35A.35 .35 0 0 0 .35 0'], ['M0 .35H1', 'M0 .65H1', 'M.35 0V.3', 'M.65 0V.3', 'M.35 .7V1', 'M.65 .7V1']]; return (T[k] || []).map((d) => s('path', { d, ...P })); }
V['knot-mosaic-tile-composer'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', ac: '#7a6ab8', dark: false }); root.style.fontFamily = 'Georgia,serif'; root.style.overflow = 'auto';
  let W = 12, H = 5, cur = 3; const cells = new Array(W * H).fill(0);
  const mosaic = s('svg', { viewBox: `0 0 ${W} ${H}`, width: 480, height: 200, style: 'background:#8a7cc8;cursor:pointer;border:3px solid #6554a8;border-radius:6px' });
  const draw = () => { mosaic.replaceChildren(...cells.map((k, i) => s('g', { transform: `translate(${i % W} ${Math.floor(i / W)})` }, s('rect', { width: 1, height: 1, fill: 'none', stroke: '#fff3', 'stroke-width': 0.02 }), ...knotTile(k)))); };
  mosaic.addEventListener('click', (e) => { const p = localPos(e, mosaic); const r = mosaic.getBoundingClientRect(); const i = Math.floor((p.y / r.height) * H) * W + Math.floor((p.x / r.width) * W); cells[i] = cur; draw(); });
  const pal = h('div.k-row', { style: { justifyContent: 'center', gap: '4px' } }, Array.from({ length: 11 }, (_, k) => h('div', { style: { background: '#fff', border: k === cur ? '2px solid #f33' : '1px solid #999', cursor: 'pointer' }, onclick: (e) => { cur = k; pal.querySelectorAll('div').forEach((d) => (d.style.border = '1px solid #999')); e.currentTarget.style.border = '2px solid #f33'; } }, s('svg', { viewBox: '0 0 1 1', width: 36, height: 36 }, ...knotTile(k).map((p) => (p.setAttribute('stroke', '#111'), p))))));
  const banner = s('svg', { viewBox: '0 0 19 3', width: 560, height: 88, style: 'background:#8a7cc8;border:4px solid #6554a8;border-radius:8px;display:block;margin:20px auto' }, ...[[3, 1, 3, 1, 3, 4, 1, 3, 2, 4, 3, 2, 2, 4, 3, 1, 3, 2, 4], [1, 1, 7, 1, 1, 8, 1, 9, 10, 1, 1, 7, 10, 1, 1, 8, 7, 1, 1], [6, 1, 5, 1, 6, 5, 1, 6, 2, 5, 6, 2, 2, 5, 6, 1, 6, 2, 5]].flatMap((r, y) => r.map((k, x) => s('g', { transform: `translate(${x} ${y})` }, ...knotTile(k)))));
  root.append(banner, h('div', { style: { fontSize: '12px', margin: '0 60px' } }, 'Welcome to ', h('u', { style: { color: '#00c' } }, 'Knot Mosaic Maker-ish')), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', border: '2px solid #333', margin: '8px 60px', fontSize: '13px' } }, h('div', { style: { padding: '14px', borderRight: '2px solid #333', textAlign: 'center' } }, h('h3', {}, 'Search for a Knot'), h('p', {}, 'Search for and display knot mosaic for a knot by name.'), h('div', {}, 'Search a knot: ', h('input', { value: '3_1', style: { width: '80px' } }), ' ', btn('Display Knot', () => { cells.fill(0); [[4, 1, 3], [5, 1, 2], [6, 1, 4], [4, 2, 1], [5, 2, 3], [6, 2, 8], [7, 2, 4], [4, 3, 6], [5, 3, 9], [6, 3, 5], [7, 3, 1], [5, 4, 6], [6, 4, 2], [7, 4, 5]].forEach(([x, y, k]) => (cells[y * W + x] = k)); draw(); }))), h('div', { style: { padding: '14px', textAlign: 'center' } }, h('h3', {}, 'Build Your Own Knot Mosaic'), h('ul', { style: { textAlign: 'left' } }, h('li', {}, 'Pick a tile below, click a cell to place it'), h('li', {}, 'Check "Suitably connected" to validate')), h('div.k-row', { style: { justifyContent: 'center' } }, select(['12 × 5', '8 × 8', '6 × 6'], '12 × 5', () => {}), btn('Check mosaic', () => toast('Suitably connected ✓'), 'pri')))), h('div.k-row', { style: { justifyContent: 'center', margin: '10px' } }, h('button', { style: { background: '#d9534f', color: '#fff', border: 0, padding: '8px 12px' }, onclick: () => { cells.fill(0); draw(); } }, 'Clear Mosaic'), h('button', { style: { background: '#5b9bd5', color: '#fff', border: 0, padding: '8px 12px' }, onclick: () => toast('mosaic.png') }, 'Save Mosaic')), pal, h('div', { style: { display: 'grid', placeItems: 'center', margin: '14px' } }, mosaic));
  draw();
  window.__demoProof = async () => { root.querySelectorAll('button').forEach((b) => b.textContent === 'Display Knot' && b.click()); return 'trefoil 3_1 rendered as knot mosaic'; };
};
V['tesselchet-truchet-plate'] = (root, T) => {
  theme(root, T, { bg: '#0d2a2e', fg: '#cfe', panel: '#113236', ac: '#2dd4bf', acfg: '#022', dark: true });
  const P = { n: 14, tile: 'zigzag', seed: 3, stroke: 2, lines: 3, ink: '#1a1a1a', paper: '#efe8d8' };
  const plate = s('svg', { viewBox: '0 0 100 100', width: 620, height: 620, style: 'box-shadow:0 20px 60px #0008' });
  const draw = () => { const R = rng(P.seed); const c = 100 / P.n; const els = [s('rect', { width: 100, height: 100, fill: P.paper })]; for (let y = 0; y < P.n; y++) for (let x = 0; x < P.n; x++) { const flip = P.tile === 'zigzag' ? y % 2 : R() < 0.5; const g = s('g', { transform: `translate(${x * c} ${y * c})` }); for (let k = 1; k <= P.lines; k++) { const o = (k / (P.lines + 1)) * c; let d; if (P.tile === 'arcs') d = flip ? `M${o} 0A${o} ${o} 0 0 1 0 ${o}M${c - o} ${c}A${o} ${o} 0 0 1 ${c} ${c - o}` : `M${c - o} 0A${o} ${o} 0 0 0 ${c} ${o}M${o} ${c}A${o} ${o} 0 0 0 0 ${c - o}`; else if (P.tile === 'diag') d = flip ? `M0 ${o}L${o} 0M${c - o} ${c}L${c} ${c - o}` : `M${c - o} 0L${c} ${o}M0 ${c - o}L${o} ${c}`; else d = `M0 ${o}L${c / 2} ${o + (flip ? -c * 0.3 : c * 0.3)}L${c} ${o}`; g.append(s('path', { d, fill: 'none', stroke: P.ink, 'stroke-width': P.stroke * 0.15 })); } els.push(g); } plate.replaceChildren(...els); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '300px 1fr';
  root.append(h('div', { style: { padding: '16px', display: 'grid', gap: '10px', alignContent: 'start', background: '#0a2226', overflow: 'auto' } }, h('b', { style: { fontSize: '18px', letterSpacing: '.1em' } }, '⬡ TESSELCHET-ish'), h('div', { style: { fontSize: '11px', opacity: .6 } }, 'truchet plate generator'), btn('⟳ Randomise', () => { P.seed++; draw(); }, 'pri'), h('div.k-h', {}, 'Tile'), seg(['zigzag', 'arcs', 'diag'], P.tile, (v) => { P.tile = v; draw(); }), slider('Grid', 4, 30, P.n, 1, (v) => { P.n = v; draw(); }), slider('Lines per tile', 1, 6, P.lines, 1, (v) => { P.lines = v; draw(); }), slider('Stroke', 0.5, 6, P.stroke, 0.1, (v) => { P.stroke = v; draw(); }), h('div.k-h', {}, 'Colours'), h('div', { style: { display: 'grid', gap: '6px' } }, [['#1a1a1a', '#efe8d8', 'Ink on paper'], ['#f5f0e6', '#1b3a4b', 'Chalk'], ['#b3261e', '#f3e9d2', 'Risograph']].map(([i, p, n]) => h('div.k-row', { style: { cursor: 'pointer', fontSize: '12px' }, onclick: () => { P.ink = i; P.paper = p; draw(); } }, h('span', { style: { width: '18px', height: '18px', background: p, border: `3px solid ${i}` } }), n))), h('div.k-row', {}, btn('SVG', () => copy(plate.outerHTML)), btn('PNG', () => toast('plate.png')))), h('div', { style: { display: 'grid', placeItems: 'center', background: 'radial-gradient(circle,#15454a,#07191c)' } }, plate));
  draw();
  window.__demoProof = async () => { P.lines = 4; draw(); return 'zigzag truchet plate, 4 lines per tile'; };
};
V['isometric-island-hotbar-builder'] = (root, T) => {
  theme(root, T, { bg: '#1c1712', fg: '#f3e6c8', ac: '#8bc34a', dark: true }); root.style.fontFamily = "'VT323',monospace"; root.style.fontSize = '20px';
  const BL = [['grass', '#6fbf4a', '#4f8f33'], ['sand', '#e8d28a', '#c2a85e'], ['stone', '#9a9a9a', '#6e6e6e'], ['wood', '#a8743a', '#7a5226'], ['water', '#4aa3df', '#2f78ab'], ['leaf', '#3f9142', '#2a6a2d']];
  let cur = 0; const N = 10; const hgt = new Array(N * N).fill(0).map((_, i) => { const x = i % N, y = Math.floor(i / N); return Math.hypot(x - 4.5, y - 4.5) < 4.2 ? 1 : 0; }); const typ = hgt.map((v) => (v ? 0 : 4));
  const svg = s('svg', { viewBox: '-330 -60 660 440', width: 900, height: 600 });
  const cube = (x, y, z, b) => { const X = (x - y) * 30, Y = (x + y) * 15 - z * 18; const [_, top, side] = BL[b]; return s('g', { 'data-i': y * N + x }, s('path', { d: `M${X} ${Y}l30 15l-30 15l-30 -15z`, fill: top, stroke: '#0002' }), s('path', { d: `M${X - 30} ${Y}l30 15v18l-30 -15z`, fill: side }), s('path', { d: `M${X + 30} ${Y}l-30 15v18l30 -15z`, fill: side, opacity: 0.75 })); };
  const draw = () => { const out = []; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const i = y * N + x; const hh = hgt[i]; if (!hh) { out.push(cube(x, y, 0, 4)); continue; } for (let z = 0; z < hh; z++) out.push(cube(x, y, z, z === hh - 1 ? typ[i] : 2)); } svg.replaceChildren(...out); };
  svg.addEventListener('click', (e) => { const g = e.target.closest('g'); if (!g) return; const i = +g.dataset.i; if (e.shiftKey) hgt[i] = Math.max(0, hgt[i] - 1); else { hgt[i] = Math.min(6, hgt[i] + 1); typ[i] = cur; } draw(); });
  const hot = h('div.k-row', { style: { position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', background: '#3b2c1c', border: '3px solid #6b4a2a', padding: '6px', gap: '6px' } }, BL.map(([n, c], i) => h('div', { title: n, style: { width: '48px', height: '48px', background: c, border: i === 0 ? '3px solid #fff' : '3px solid #2a1f14', display: 'grid', placeItems: 'end center', fontSize: '14px', cursor: 'pointer' }, onclick: (e) => { cur = i; hot.querySelectorAll('div').forEach((d) => (d.style.borderColor = '#2a1f14')); e.currentTarget.style.borderColor = '#fff'; } }, i + 1)));
  window.addEventListener('keydown', (e) => { const k = +e.key; if (k >= 1 && k <= 6) hot.children[k - 1].click(); });
  const modal = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-52%)', width: '560px', background: '#8a6238', border: '4px solid #4e3520', boxShadow: '0 0 0 4px #b48a58 inset', padding: '18px', lineHeight: 1.2 } }, h('div', { style: { fontSize: '16px', opacity: .8 } }, 'Isle Builder-ish · Before You Play'), h('div', { style: { fontSize: '30px', color: '#fff' } }, 'Build your island, block by block'), h('div', { style: { background: '#5e4128', padding: '10px', margin: '10px 0', fontSize: '18px' } }, '• Click a tile to stack the selected block', h('br'), '• Shift+click to dig down', h('br'), '• Keys 1–6 choose from the hotbar', h('br'), '• Water surrounds everything'), h('div.k-row', { style: { justifyContent: 'center' } }, h('button', { style: { background: '#6fbf4a', border: '3px solid #2f5f1f', font: "22px 'VT323'", padding: '4px 20px' }, onclick: () => modal.remove() }, 'Accept & play ▸')));
  root.append(h('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'radial-gradient(circle at 50% 40%,#2a3b4a,#0e141a)' } }, svg), hot, h('div', { style: { position: 'absolute', left: '16px', top: '12px' } }, 'Blocks: ', h('b', {}, '∞'), ' · Day 1'), modal);
  draw();
  window.__demoProof = async () => { [[4, 4, 3, 2], [4, 5, 2, 3], [5, 4, 3, 5], [2, 5, 1, 1], [6, 6, 1, 1]].forEach(([x, y, hh, t]) => { hgt[y * N + x] = hh + 1; typ[y * N + x] = t; }); draw(); return 'stacked blocks on island (welcome panel visible)'; };
};
function keyboard(keys, { unit = 54, cap = '#f5f5f5', ink = '#333', onPick } = {}) { const wrap = h('div', { style: { position: 'relative' } }); let mw = 0, mh = 0; keys.forEach((k) => { mw = Math.max(mw, k.x + (k.w || 1)); mh = Math.max(mh, k.y + 1); const el = h('div', { style: { position: 'absolute', left: k.x * unit + 'px', top: k.y * unit + 'px', width: (k.w || 1) * unit - 4 + 'px', height: unit - 4 + 'px', background: k.c || cap, color: k.t || ink, borderRadius: '5px', boxShadow: 'inset 0 -5px 0 #0002, 0 1px 2px #0004', fontSize: '11px', padding: '5px', boxSizing: 'border-box', cursor: 'pointer', whiteSpace: 'pre', lineHeight: 1.2 }, onclick: () => onPick?.(k, el) }, k.l); k.el = el; wrap.append(el); }); wrap.style.width = mw * unit + 'px'; wrap.style.height = mh * unit + 'px'; return wrap; }
const ROWS = [['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', ['Backspace', 2]], [['Tab', 1.5], 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', ['\\', 1.5]], [['Caps', 1.75], 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", ['Enter', 2.25]], [['Shift', 2.25], 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ['Shift', 2.75]], [['Ctrl', 1.25], ['Win', 1.25], ['Alt', 1.25], ['', 6.25], ['Alt', 1.25], ['Fn', 1.25], ['Menu', 1.25], ['Ctrl', 1.25]]];
const rowsToKeys = () => ROWS.flatMap((r, y) => { let x = 0; return r.map((k) => { const [l, w] = Array.isArray(k) ? k : [k, 1]; const o = { l, w, x, y }; x += w; return o; }); });
V['keycap-layout-canvas'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', panel: '#f5f5f5', ac: '#337ab7', dark: false }); root.style.fontFamily = 'Helvetica,Arial,sans-serif'; root.style.fontSize = '13px'; root.style.overflow = 'auto';
  const keys = rowsToKeys(); let sel = null; const f = {};
  const props = h('div', { style: { display: 'grid', gridTemplateColumns: '120px 200px 60px 200px', gap: '6px 10px', alignItems: 'center', padding: '14px 30px' } });
  const kb = keyboard(keys, { unit: 46, onPick: (k, el) => { if (sel) sel.el.style.outline = ''; sel = k; el.style.outline = '2px solid #d9534f'; f.label.value = k.l; f.w.value = k.w; f.c.value = k.c || '#f5f5f5'; } });
  const field = (lab, inp) => [h('label', { style: { textAlign: 'right', color: '#555' } }, lab), inp];
  f.label = h('input', { oninput: (e) => { if (sel) { sel.l = e.target.value; sel.el.textContent = sel.l; } } }); f.w = h('input', { type: 'number', step: 0.25, style: { width: '60px' }, oninput: (e) => { if (sel) { sel.w = +e.target.value; sel.el.style.width = sel.w * 46 - 4 + 'px'; } } }); f.c = h('input', { type: 'color', oninput: (e) => { if (sel) sel.el.style.background = sel.c = e.target.value; } });
  props.append(...field('Top Legend', f.label), h('span'), h('span'), ...field('Width', f.w), h('span'), h('span'), ...field('Keycap Color', f.c), h('span'), h('span'), ...field('Profile / Row', select(['SA R1', 'DCS R2', 'DSA'], 'DCS R2', () => {})), h('span'), h('span'));
  root.append(h('div.k-row', { style: { background: '#222', color: '#9d9d9d', height: '40px', padding: '0 14px', gap: '16px' } }, h('b', { style: { color: '#fff' } }, 'Keyboard Layout Editor-ish'), h('span', { style: { background: '#d9534f', color: '#fff', padding: '3px 8px', borderRadius: '3px' } }, 'Preset ▾'), 'Storage ▾', 'Character Picker ▾', h('span', { style: { flex: 1 } }), 'Sign in with GitHub'), h('div.k-row', { style: { padding: '8px 14px', gap: '6px', borderBottom: '1px solid #ddd' } }, h('span', { style: { background: '#337ab7', color: '#fff', padding: '4px 10px', borderRadius: '3px' } }, '＋ Add Key'), h('span', { style: { background: '#d9534f', color: '#fff', padding: '4px 10px', borderRadius: '3px' }, onclick: () => sel && (sel.el.remove(), (sel = null)) }, 'Delete Key'), btn('Undo', () => {}), btn('Redo', () => {}), btn('Cut', () => {}), btn('Copy', () => {}), btn('Paste', () => {}), h('span', { style: { flex: 1 } }), h('span', { style: { background: '#5cb85c', color: '#fff', padding: '4px 10px', borderRadius: '3px' } }, 'Download ▾')), h('div', { style: { padding: '20px 30px', display: 'flex', gap: '20px', alignItems: 'flex-start' } }, h('div', { style: { background: '#ddd', padding: '14px', borderRadius: '8px' } }, kb), h('div', { style: { background: '#d9edf7', border: '1px solid #bce8f1', padding: '12px', maxWidth: '340px', color: '#31708f', lineHeight: 1.5 } }, h('b', {}, 'Getting Started'), h('p', {}, 'Click a key to select it, then edit its legend, width and color below. Download as PNG or copy raw JSON data.'))), h('div.k-row', { style: { padding: '0 30px', gap: '14px', color: '#337ab7', borderBottom: '1px solid #ddd' } }, h('span', { style: { color: '#555', borderBottom: '2px solid #555' } }, 'Properties'), 'Keyboard Properties', 'Custom Styles', 'Color Swatches', 'Raw data', 'Summary'), props);
  window.__demoProof = async () => { const e = keys.find((k) => k.l === 'Esc'); e.el.click(); f.c.value = '#d9534f'; f.c.dispatchEvent(new Event('input')); e.el.style.color = '#fff'; keys.find((k) => k.l === 'Enter').el.style.background = '#5cb85c'; return 'selected Esc, recolored keycap via properties'; };
};
V['hardware-keymap-layer-configurator'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#f6f6f8', ac: '#f47c20', dark: false });
  const LAYERS = [['Base', '#f5f5f5'], ['Symbols', '#e3f2fd'], ['Media', '#fce4ec'], ['Nav', '#e8f5e9']]; let L = 0;
  const LEG = [['Q', 'W', 'E', 'R', 'T', 'A', 'S', 'D', 'F', 'G', 'Z', 'X', 'C', 'V', 'B'], ['!', '@', '{', '}', '|', '#', '$', '(', ')', '`', '%', '^', '[', ']', '~'], ['◀◀', '▶', '▶▶', '🔇', '🔉', '☀-', '☀+', '', '', '', '', '', '', '', ''], ['⇞', '↑', '⇟', '', '', '←', '↓', '→', 'Home', 'End', '', '', '', '', '']];
  const half = (side) => { const ks = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) ks.push({ x: c + (side ? 7 : 0), y: r + [0.3, 0.1, 0, 0.1, 0.3][c] * (side ? 1 : 1), l: '', i: r * 5 + c, side }); ks.push({ x: side ? 7 : 3, y: 3.2, l: side ? 'Space' : 'Enter', w: 1.5 }); return ks; };
  const keys = [...half(0), ...half(1)]; const box = h('div', { style: { position: 'relative', margin: '20px auto', width: '700px', height: '260px' } });
  const info = h('div', { style: { padding: '14px', background: '#f6f6f8', borderRadius: '10px', fontSize: '13px' } });
  const draw = () => { box.replaceChildren(keyboard(keys.map((k) => ({ ...k, l: k.l || (k.side ? LEG[L][(k.i + 5) % 15] : LEG[L][k.i]) || '▽', c: LAYERS[L][1] })), { unit: 56, onPick: (k) => (info.textContent = `Key ${k.l} on layer ${LAYERS[L][0]} → tap: ${k.l} · hold: Layer ${(L + 1) % 4}`) })); };
  const tabs = h('div.k-row', { style: { gap: '6px', justifyContent: 'center' } });
  const drawTabs = () => tabs.replaceChildren(...LAYERS.map(([n, c], i) => h('button', { style: { padding: '8px 16px', borderRadius: '99px', border: i === L ? '2px solid #f47c20' : '1px solid #ddd', background: c, fontWeight: i === L ? 700 : 400 }, onclick: () => { L = i; draw(); drawTabs(); } }, `${i} · ${n}`)));
  root.append(h('div.k-row', { style: { height: '56px', padding: '0 30px', borderBottom: '1px solid #eee', gap: '22px', fontSize: '13px' } }, h('b', { style: { color: '#f47c20', fontSize: '18px' } }, '◆ ORYX-ish'), h('span', { style: { flex: 1 } }), 'Configure', 'Train', 'Search Layouts', 'Blog', 'Sign in', 'Sign Up'), h('div', { style: { textAlign: 'center', marginTop: '20px' } }, h('div', { style: { fontSize: '26px', fontWeight: 700 } }, 'My Split Layout'), h('div', { style: { opacity: .6, fontSize: '13px', margin: '4px 0 16px' } }, 'Voyager · revision 3 · 4 layers')), tabs, box, h('div', { style: { width: '700px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' } }, info, btn('Compile & flash', () => toast('Firmware compiled (demo)'), 'pri')));
  info.textContent = 'Click any key to configure tap / hold behavior.'; draw(); drawTabs();
  window.__demoProof = async () => { L = 1; draw(); drawTabs(); return 'switched to Symbols layer'; };
};
V['image-weave-loom-desk'] = (root, T) => {
  theme(root, T, { bg: '#efe6d6', fg: '#2a2420', ac: '#9b3d2a', dark: false }); root.style.fontFamily = "'Fraunces Variable',Georgia,serif";
  const P = { threads: 64, weave: 'plain', shafts: 4 };
  const img = scene(200, 200, 'sunset', 5); const cv = h('canvas', { width: 420, height: 420, style: { borderRadius: '50%', boxShadow: '0 12px 40px #0003' } });
  const draw = () => { const g = cv.getContext('2d'); const n = P.threads, c = 420 / n; const src = img.getContext('2d').getImageData(0, 0, 200, 200).data; g.fillStyle = '#e8dcc6'; g.fillRect(0, 0, 420, 420); for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const sx = Math.floor((x / n) * 200), sy = Math.floor((y / n) * 200); const k = (sy * 200 + sx) * 4; const lum = (src[k] + src[k + 1] + src[k + 2]) / 3; const up = P.weave === 'plain' ? (x + y) % 2 : P.weave === 'twill' ? (x + y) % P.shafts < P.shafts / 2 : (x * 2 + y) % 5 === 0; const warp = up ? lum > 110 : lum > 150; g.fillStyle = `rgb(${src[k]},${src[k + 1]},${src[k + 2]})`; if (warp) { g.fillRect(x * c + c * 0.15, y * c, c * 0.7, c); g.fillStyle = '#0002'; g.fillRect(x * c + c * 0.15, y * c + c * 0.85, c * 0.7, c * 0.15); } else { g.fillRect(x * c, y * c + c * 0.15, c, c * 0.7); g.fillStyle = '#fff2'; g.fillRect(x * c, y * c + c * 0.15, c, c * 0.12); } } };
  root.append(h('div.k-row', { style: { height: '50px', padding: '0 40px', fontSize: '13px', borderBottom: '1px solid #d5c7ae', gap: '18px' } }, h('b', {}, '◎ Weave Studio-ish'), h('span', { style: { flex: 1 } }), 'Playlab', 'Research', 'The Studio', 'Loom', 'About'), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '40px 80px', gap: '60px', alignItems: 'center' } }, h('div', {}, h('div', { style: { fontSize: '12px', opacity: .6 } }, 'Studio › Tools › The Loom'), h('h1', { style: { fontSize: '58px', lineHeight: 1.02, margin: '14px 0', fontWeight: 700 } }, 'Weave the picture into working cloth.'), h('p', { style: { lineHeight: 1.6, opacity: .8, fontFamily: 'Georgia,serif' } }, 'Any image becomes a woven structure: pick a weave, thread count and shafts, and the loom renders a drawdown you could set up on real harnesses.'), h('div', { style: { display: 'grid', gap: '10px', maxWidth: '360px', fontFamily: 'Inter Variable' } }, seg(['plain', 'twill', 'satin'], P.weave, (v) => { P.weave = v; draw(); }), slider('Threads', 16, 140, P.threads, 1, (v) => { P.threads = v; draw(); }), slider('Shafts', 2, 8, P.shafts, 1, (v) => { P.shafts = v; draw(); }), h('div.k-row', {}, btn('Export WIF', () => toast('draft.wif'), 'pri'), btn('PNG', () => toast('cloth.png'))))), h('div', { style: { display: 'grid', placeItems: 'center' } }, cv)));
  draw();
  window.__demoProof = async () => { P.weave = 'twill'; P.threads = 90; draw(); return 'twill 90 threads woven from image'; };
};

V['pixelartcss-boxshadow-desk'] = (root, T) => {
  theme(root, T, { bg: '#1a1a2e', fg: '#f2f2f7', panel: '#16213e', ac: '#e94560', dark: true });
  const PAL = ['#000000', '#ffffff', '#e94560', '#0f3460', '#16c79a', '#f9c74f', '#577590', '#f9844a', '#90be6d', '#277da1', '#f94144', '#8338ec'];
  let N = 16;
  let tool = 'pen'; // pen | erase
  let color = '#e94560';
  let playing = false;
  let playTimer = null;
  let playIdx = 0;
  const empty = () => new Array(N * N).fill(null);
  let frames = [empty()];
  let cur = 0;
  const undoStack = [];
  const redoStack = [];
  const snap = () => frames[cur].slice();
  const pushUndo = () => { undoStack.push(snap()); if (undoStack.length > 80) undoStack.shift(); redoStack.length = 0; };

  const cell = 22;
  const cv = h('canvas', { width: N * cell, height: N * cell, style: { imageRendering: 'pixelated', cursor: 'crosshair', touchAction: 'none', border: '3px solid #0f3460', boxShadow: '0 12px 40px #0006', background: '#111' } });
  const g = cv.getContext('2d');
  const cssPrev = h('div', { style: { position: 'relative', width: '120px', height: '120px', margin: '0 auto', background: 'repeating-conic-gradient(#333 0 25%, #222 0 50%) 0 0/12px 12px', border: '1px solid #ffffff22', borderRadius: '8px' } });
  const cssBox = h('div', { style: { position: 'absolute', left: '50%', top: '50%', width: '1px', height: '1px', transformOrigin: '0 0' } });
  cssPrev.append(cssBox);
  const code = h('pre.k-code', { style: { maxHeight: '180px', fontSize: '11px' } });
  const frameBar = h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } });
  const sizeLab = h('b', {}, '16×16');

  const toCSS = (data) => {
    const parts = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const c = data[y * N + x]; if (!c) continue;
      parts.push(`${x}px ${y}px 0 0 ${c}`);
    }
    return parts.length ? parts.join(',\n  ') : 'none';
  };
  const render = () => {
    const data = frames[cur];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const c = data[y * N + x];
      g.fillStyle = c || (((x + y) % 2) ? '#2a2a40' : '#222238');
      g.fillRect(x * cell, y * cell, cell, cell);
    }
    g.strokeStyle = '#ffffff10'; g.beginPath();
    for (let i = 0; i <= N; i++) { g.moveTo(i * cell + 0.5, 0); g.lineTo(i * cell + 0.5, N * cell); g.moveTo(0, i * cell + 0.5); g.lineTo(N * cell, i * cell + 0.5); }
    g.stroke();
    const shadow = toCSS(data);
    const scale = Math.max(2, Math.floor(90 / N));
    cssBox.style.boxShadow = shadow;
    cssBox.style.background = 'transparent';
    cssBox.style.transform = `scale(${scale}) translate(-0.5px,-0.5px)`;
    code.textContent = `.pixel {\n  width: 1px;\n  height: 1px;\n  box-shadow:\n  ${shadow};\n}`;
    frameBar.replaceChildren(
      ...frames.map((f, i) => {
        const t = h('canvas', { width: N, height: N, style: { width: '40px', height: '40px', imageRendering: 'pixelated', border: i === cur ? '2px solid #e94560' : '2px solid #ffffff22', cursor: 'pointer', background: '#111' }, onclick: () => { cur = i; render(); } });
        const tg = t.getContext('2d');
        f.forEach((c, j) => { if (c) { tg.fillStyle = c; tg.fillRect(j % N, Math.floor(j / N), 1, 1); } });
        return t;
      }),
      h('button', { style: { width: '40px', height: '40px', background: '#ffffff10', border: '2px dashed #ffffff33', color: '#ccc', cursor: 'pointer' }, onclick: () => { frames.push(frames[cur].slice()); cur = frames.length - 1; render(); } }, '+'));
  };

  const paintAt = (e) => {
    const p = localPos(e, cv); const r = cv.getBoundingClientRect();
    const x = Math.floor((p.x / r.width) * N), y = Math.floor((p.y / r.height) * N);
    if (x < 0 || y < 0 || x >= N || y >= N) return;
    const i = y * N + x;
    const next = tool === 'erase' ? null : color;
    if (frames[cur][i] !== next) { frames[cur][i] = next; render(); }
  };
  let painting = false;
  drag(cv, {
    start: (e) => { pushUndo(); painting = true; paintAt(e); },
    move: (e) => { if (painting) paintAt(e); },
    end: () => { painting = false; },
  });

  const setSize = (n) => {
    pushUndo();
    N = n; sizeLab.textContent = `${n}×${n}`;
    frames = frames.map((f) => {
      const nf = empty();
      const old = Math.sqrt(f.length) | 0;
      for (let y = 0; y < Math.min(old, N); y++) for (let x = 0; x < Math.min(old, N); x++) nf[y * N + x] = f[y * old + x];
      return nf;
    });
    cv.width = N * cell; cv.height = N * cell;
    undoStack.length = 0; redoStack.length = 0;
    render();
  };

  const undo = () => {
    if (!undoStack.length) return;
    redoStack.push(snap());
    frames[cur] = undoStack.pop();
    render();
  };
  const redo = () => {
    if (!redoStack.length) return;
    undoStack.push(snap());
    frames[cur] = redoStack.pop();
    render();
  };

  const dlPng = () => {
    const c = document.createElement('canvas'); c.width = N; c.height = N;
    const cg = c.getContext('2d');
    frames[cur].forEach((col, i) => { if (col) { cg.fillStyle = col; cg.fillRect(i % N, Math.floor(i / N), 1, 1); } });
    const a = h('a', { download: 'pixel.png', href: c.toDataURL('image/png') }); a.click();
    toast('pixel.png downloaded');
  };

  const play = () => {
    playing = !playing;
    playBtn.textContent = playing ? '❚❚ Stop' : '▶ Play';
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
    if (!playing) return;
    playTimer = setInterval(() => {
      playIdx = (playIdx + 1) % frames.length;
      cur = playIdx; render();
    }, 220);
  };
  const playBtn = btn('▶ Play', play);

  const swatches = h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } },
    ...PAL.map((c) => h('div.k-sw', { style: { background: c, outline: c === color ? '2px solid #fff' : '' }, onclick: (e) => {
      color = c; tool = 'pen';
      swatches.querySelectorAll('.k-sw').forEach((d) => (d.style.outline = ''));
      e.currentTarget.style.outline = '2px solid #fff';
      toolSeg.buttons[0].click();
    } })),
    h('input', { type: 'color', value: color, style: { width: '32px', height: '32px', border: 0, background: 'none', cursor: 'pointer' }, oninput: (e) => { color = e.target.value; tool = 'pen'; } }));

  const toolSeg = seg([['pen', 'Pencil'], ['erase', 'Eraser']], 'pen', (v) => (tool = v));

  root.style.overflow = 'auto';
  root.append(
    h('div.k-row', { style: { height: '52px', padding: '0 18px', background: '#0f3460', gap: '12px', borderBottom: '2px solid #e94560' } },
      h('b', { style: { fontSize: '16px', letterSpacing: '.02em' } }, 'Pixel Art to CSS'),
      h('span', { style: { opacity: .65, fontSize: '12px' } }, 'box-shadow workbench'),
      h('span', { style: { flex: 1 } }),
      sizeLab,
      seg([['16', '16×16'], ['32', '32×32']], '16', (v) => setSize(+v))),
    h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', padding: '20px 24px 40px', maxWidth: '1100px', margin: '0 auto' } },
      h('div', { style: { display: 'grid', gap: '14px', justifyItems: 'center' } },
        h('div.k-row', { style: { gap: '10px', width: '100%', justifyContent: 'center' } }, toolSeg, btn('Undo', undo), btn('Redo', redo), btn('Clear', () => { pushUndo(); frames[cur] = empty(); render(); })),
        cv,
        h('div', { style: { width: '100%' } }, h('div.k-h', {}, 'Timeline'), h('div.k-row', { style: { gap: '10px', marginTop: '8px' } }, frameBar, playBtn))),
      h('div', { style: { display: 'grid', gap: '12px', alignContent: 'start' } },
        panel('Palette', swatches),
        panel('CSS Preview', cssPrev),
        panel('Export', code,
          h('div.k-row', {}, btn('Copy CSS', () => copy(code.textContent, 'CSS copied'), 'pri'), btn('Download PNG', dlPng))))),
  );
  // seed a small heart so preview isn't empty
  const HEART = [[3,1],[4,1],[7,1],[8,1],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[4,5],[5,5],[6,5],[7,5],[5,6],[6,6]];
  HEART.forEach(([x, y]) => { frames[0][y * N + x] = '#e94560'; });
  frames[0][3 * N + 4] = '#ffffff';
  render();

  window.__demoProof = async () => {
    pushUndo();
    // paint a few cells
    frames[cur][1 * N + 1] = '#16c79a'; frames[cur][1 * N + 2] = '#16c79a';
    render(); await sleep(40);
    undo(); await sleep(40); redo();
    frames.push(frames[cur].map((c, i) => (c === '#e94560' && i % 5 === 0 ? '#f9c74f' : c)));
    cur = 1; render();
    setSize(32); await sleep(40); setSize(16);
    tool = 'erase'; frames[cur][2 * N + 2] = null; render(); tool = 'pen';
    playing = false; play(); await sleep(500); play();
    copy(code.textContent);
    return `grid ${N}; frames ${frames.length}; undo/redo; copy CSS; play loop exercised`;
  };
};


V['bitsy-pixel-game-maker-desk'] = (root, T) => {
  theme(root, T, { bg: '#ccccff', fg: '#2800aa', panel: '#f2f2ff', ac: '#2066d2', dark: false, line: '#b8b8ee' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  const ROOM = 16, PAINT = 8;
  let colors = { bg: '#0052cc', tile: '#80b3ff', sprite: '#ffffff' };
  let tab = 'avatar'; // avatar | tile | sprite
  let playing = false;
  let showGrid = true, showWalls = true;
  let roomId = 0;
  const drawings = {
    avatar: Array(PAINT * PAINT).fill(false),
    tile: Array(PAINT * PAINT).fill(false),
    sprite: Array(PAINT * PAINT).fill(false),
  };
  let tileWall = true;
  // seed avatar (simple person) + tile border block + cat sprite
  [[3,1],[4,1],[2,2],[3,2],[4,2],[5,2],[3,3],[4,3],[2,4],[3,4],[4,4],[5,4],[2,5],[5,5],[2,6],[5,6],[3,7],[4,7]].forEach(([x,y]) => drawings.avatar[y*PAINT+x]=true);
  for (let i=0;i<PAINT;i++){ drawings.tile[i]=true; drawings.tile[(PAINT-1)*PAINT+i]=true; drawings.tile[i*PAINT]=true; drawings.tile[i*PAINT+PAINT-1]=true; drawings.tile[3*PAINT+3]=true; }
  [[2,2],[3,2],[4,2],[5,2],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[2,4],[3,4],[4,4],[5,4],[2,5],[5,5],[3,6],[4,6]].forEach(([x,y]) => drawings.sprite[y*PAINT+x]=true);

  const rooms = [
    { name: 'room 0', cells: Array(ROOM * ROOM).fill(null), exits: [] },
    { name: 'room 1', cells: Array(ROOM * ROOM).fill(null), exits: [] },
  ];
  // border walls of tile in room 0
  for (let i = 0; i < ROOM; i++) {
    rooms[0].cells[i] = 'tile';
    rooms[0].cells[(ROOM - 1) * ROOM + i] = 'tile';
    rooms[0].cells[i * ROOM] = 'tile';
    rooms[0].cells[i * ROOM + ROOM - 1] = 'tile';
  }
  rooms[0].cells[8 * ROOM + 4] = 'avatar';
  rooms[0].cells[8 * ROOM + 10] = 'sprite';
  rooms[0].exits.push({ x: 14, y: 8, to: 1 });
  rooms[1].exits.push({ x: 1, y: 8, to: 0 });
  for (let i = 0; i < ROOM; i++) {
    rooms[1].cells[i] = 'tile';
    rooms[1].cells[(ROOM - 1) * ROOM + i] = 'tile';
    rooms[1].cells[i * ROOM] = 'tile';
    rooms[1].cells[i * ROOM + ROOM - 1] = 'tile';
  }

  let avatarPos = { x: 4, y: 8 };
  const findAvatar = () => {
    const cells = rooms[roomId].cells;
    for (let i = 0; i < cells.length; i++) if (cells[i] === 'avatar') return { x: i % ROOM, y: (i / ROOM) | 0 };
    return { ...avatarPos };
  };
  avatarPos = findAvatar();

  const paintCell = 22;
  const roomCell = 18;
  const paintCv = h('canvas', { width: PAINT * paintCell, height: PAINT * paintCell, style: { imageRendering: 'pixelated', cursor: 'crosshair', border: '2px solid #2800aa22' } });
  const roomCv = h('canvas', { width: ROOM * roomCell, height: ROOM * roomCell, style: { imageRendering: 'pixelated', cursor: 'crosshair', border: '2px solid #2800aa22' } });

  const drawPixels = (g, data, cell, fg, bg) => {
    for (let y = 0; y < PAINT; y++) for (let x = 0; x < PAINT; x++) {
      g.fillStyle = data[y * PAINT + x] ? fg : bg;
      g.fillRect(x * cell, y * cell, cell, cell);
    }
  };
  const blitDrawing = (g, kind, dx, dy, cell) => {
    const data = drawings[kind];
    const fg = kind === 'tile' ? colors.tile : colors.sprite;
    const bg = colors.bg;
    for (let y = 0; y < PAINT; y++) for (let x = 0; x < PAINT; x++) {
      if (!data[y * PAINT + x]) continue;
      g.fillStyle = fg;
      // scale 8px drawing into room cell
      const s = cell / PAINT;
      g.fillRect(dx + x * s, dy + y * s, Math.ceil(s), Math.ceil(s));
    }
  };

  const renderPaint = () => {
    const g = paintCv.getContext('2d');
    const fg = tab === 'tile' ? colors.tile : colors.sprite;
    drawPixels(g, drawings[tab], paintCell, fg, colors.bg);
    if (showGrid) {
      g.strokeStyle = '#00000022'; g.beginPath();
      for (let i = 0; i <= PAINT; i++) {
        g.moveTo(i * paintCell + 0.5, 0); g.lineTo(i * paintCell + 0.5, PAINT * paintCell);
        g.moveTo(0, i * paintCell + 0.5); g.lineTo(PAINT * paintCell, i * paintCell + 0.5);
      }
      g.stroke();
    }
  };

  const renderRoom = () => {
    const g = roomCv.getContext('2d');
    const cells = rooms[roomId].cells;
    g.fillStyle = colors.bg; g.fillRect(0, 0, ROOM * roomCell, ROOM * roomCell);
    for (let y = 0; y < ROOM; y++) for (let x = 0; x < ROOM; x++) {
      const kind = cells[y * ROOM + x];
      if (!kind) continue;
      if (kind === 'avatar' && playing) continue;
      blitDrawing(g, kind === 'avatar' ? 'avatar' : kind, x * roomCell, y * roomCell, roomCell);
    }
    if (playing) blitDrawing(g, 'avatar', avatarPos.x * roomCell, avatarPos.y * roomCell, roomCell);
    rooms[roomId].exits.forEach((ex) => {
      g.strokeStyle = '#ffcc00'; g.lineWidth = 2;
      g.strokeRect(ex.x * roomCell + 2, ex.y * roomCell + 2, roomCell - 4, roomCell - 4);
      g.fillStyle = '#ffcc00'; g.font = '10px sans-serif';
      g.fillText('E', ex.x * roomCell + 5, ex.y * roomCell + 12);
    });
    if (showWalls) {
      g.fillStyle = '#ffffff55';
      for (let y = 0; y < ROOM; y++) for (let x = 0; x < ROOM; x++) {
        if (cells[y * ROOM + x] === 'tile' && tileWall) {
          g.fillRect(x * roomCell + roomCell / 2 - 2, y * roomCell + roomCell / 2 - 2, 4, 4);
        }
      }
    }
    if (showGrid) {
      g.strokeStyle = '#ffffff33'; g.beginPath();
      for (let i = 0; i <= ROOM; i++) {
        g.moveTo(i * roomCell + 0.5, 0); g.lineTo(i * roomCell + 0.5, ROOM * roomCell);
        g.moveTo(0, i * roomCell + 0.5); g.lineTo(ROOM * roomCell, i * roomCell + 0.5);
      }
      g.stroke();
    }
  };

  const paintAt = (e) => {
    const p = localPos(e, paintCv); const r = paintCv.getBoundingClientRect();
    const x = Math.floor((p.x / r.width) * PAINT), y = Math.floor((p.y / r.height) * PAINT);
    if (x < 0 || y < 0 || x >= PAINT || y >= PAINT) return;
    drawings[tab][y * PAINT + x] = !drawings[tab][y * PAINT + x];
    renderPaint(); renderRoom();
  };
  paintCv.addEventListener('click', paintAt);

  const placeAt = (e) => {
    if (playing) return;
    const p = localPos(e, roomCv); const r = roomCv.getBoundingClientRect();
    const x = Math.floor((p.x / r.width) * ROOM), y = Math.floor((p.y / r.height) * ROOM);
    if (x < 0 || y < 0 || x >= ROOM || y >= ROOM) return;
    const i = y * ROOM + x;
    const cells = rooms[roomId].cells;
    if (tab === 'avatar') {
      for (let k = 0; k < cells.length; k++) if (cells[k] === 'avatar') cells[k] = null;
      cells[i] = 'avatar'; avatarPos = { x, y };
    } else if (cells[i] === tab) cells[i] = null;
    else cells[i] = tab;
    renderRoom();
  };
  roomCv.addEventListener('click', placeAt);

  const isWall = (x, y) => {
    if (x < 0 || y < 0 || x >= ROOM || y >= ROOM) return true;
    const kind = rooms[roomId].cells[y * ROOM + x];
    return kind === 'tile' && tileWall;
  };
  const tryMove = (dx, dy) => {
    if (!playing) return;
    const nx = avatarPos.x + dx, ny = avatarPos.y + dy;
    if (isWall(nx, ny)) return;
    const ex = rooms[roomId].exits.find((e) => e.x === nx && e.y === ny);
    if (ex) {
      roomId = ex.to;
      const back = rooms[roomId].exits.find((e) => e.to !== undefined) || { x: 2, y: 8 };
      avatarPos = { x: back.x, y: back.y };
      roomTitle.textContent = rooms[roomId].name;
      renderRoom();
      return;
    }
    avatarPos = { x: nx, y: ny }; renderRoom();
  };
  window.addEventListener('keydown', (e) => {
    if (!playing) return;
    const map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    if (map[e.key]) { e.preventDefault(); tryMove(...map[e.key]); }
  });

  const win = (title, icon, x, y, w, body) => {
    const el = h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', background: '#f7f7ff', borderRadius: '10px', boxShadow: '0 10px 28px #2800aa22', border: '1px solid #b8b8ee', overflow: 'hidden', zIndex: 2 } });
    const bar = h('div.k-row', { style: { background: '#e4e4ff', padding: '8px 10px', gap: '8px', cursor: 'move', fontSize: '13px', fontWeight: 600, color: '#2800aa' } },
      h('span', {}, icon), h('span', { style: { flex: 1 } }, title), h('span', { style: { opacity: .4 } }, '✕'));
    let ox = 0, oy = 0;
    drag(bar, {
      start: (e) => { const r = el.getBoundingClientRect(); const pr = root.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top; el.style.zIndex = 6; },
      move: (e) => {
        const pr = root.getBoundingClientRect();
        el.style.left = clamp(e.clientX - pr.left - ox, 0, pr.width - 80) + 'px';
        el.style.top = clamp(e.clientY - pr.top - oy, 40, pr.height - 40) + 'px';
      },
    });
    el.append(bar, body);
    return el;
  };

  const tabBar = h('div.k-row', { style: { gap: '4px', padding: '8px', flexWrap: 'wrap' } });
  const wallBtn = btn('wall', () => { tileWall = !tileWall; wallBtn.style.background = tileWall ? '#2066d2' : ''; wallBtn.style.color = tileWall ? '#fff' : ''; renderRoom(); });
  wallBtn.style.background = '#2066d2'; wallBtn.style.color = '#fff';
  const syncTabs = () => {
    tabBar.replaceChildren(...['avatar', 'tile', 'sprite'].map((t) => {
      const b = btn(t, () => { tab = t; syncTabs(); renderPaint(); });
      if (t === tab) { b.style.background = '#2066d2'; b.style.color = '#fff'; }
      return b;
    }));
  };
  syncTabs();

  const paintBody = h('div', { style: { padding: '10px', display: 'grid', gap: '8px', justifyItems: 'center' } },
    tabBar, paintCv,
    h('div.k-row', { style: { gap: '8px' } },
      btn('grid', () => { showGrid = !showGrid; renderPaint(); renderRoom(); }),
      wallBtn));

  const roomTitle = h('span', {}, rooms[roomId].name);
  const roomTools = h('div.k-row', { style: { gap: '6px', padding: '8px', flexWrap: 'wrap', fontSize: '12px' } },
    btn('paint', () => toast('Paint tool active — click room to place ' + tab)),
    btn('exits', () => {
      const cells = rooms[roomId];
      const x = clamp(avatarPos.x + 1, 0, ROOM - 1), y = avatarPos.y;
      if (!cells.exits.some((e) => e.x === x && e.y === y)) cells.exits.push({ x, y, to: (roomId + 1) % rooms.length });
      renderRoom(); toast('Exit marker added');
    }),
    btn('grid', () => { showGrid = !showGrid; renderPaint(); renderRoom(); }),
    btn('walls', () => { showWalls = !showWalls; renderRoom(); }),
    btn('‹', () => { roomId = (roomId + rooms.length - 1) % rooms.length; roomTitle.textContent = rooms[roomId].name; avatarPos = findAvatar(); renderRoom(); }),
    roomTitle,
    btn('›', () => { roomId = (roomId + 1) % rooms.length; roomTitle.textContent = rooms[roomId].name; avatarPos = findAvatar(); renderRoom(); }),
    btn('+', () => { rooms.push({ name: 'room ' + rooms.length, cells: Array(ROOM * ROOM).fill(null), exits: [] }); toast('Room added'); }));

  const roomBody = h('div', { style: { padding: '10px', display: 'grid', gap: '8px', justifyItems: 'center' } }, roomCv, roomTools);

  const colorRows = h('div', { style: { padding: '12px', display: 'grid', gap: '10px' } });
  const rebuildColors = () => {
    colorRows.replaceChildren(...[['bg', 'background color'], ['tile', 'tile color'], ['sprite', 'sprite color']].map(([k, lab]) =>
      h('label.k-row', { style: { gap: '10px', fontSize: '12px' } },
        h('input', { type: 'color', value: colors[k], oninput: (e) => { colors[k] = e.target.value; renderPaint(); renderRoom(); } }),
        h('span', { style: { flex: 1 } }, lab),
        h('code', { style: { fontSize: '11px', opacity: .6 } }, colors[k]))));
  };
  rebuildColors();

  const playBtn = btn('play', () => {
    playing = !playing;
    playBtn.textContent = playing ? 'stop' : 'play';
    if (playing) {
      avatarPos = findAvatar();
      // clear avatar cell so we draw movable avatar
      const cells = rooms[roomId].cells;
      for (let i = 0; i < cells.length; i++) if (cells[i] === 'avatar') cells[i] = null;
    } else {
      rooms[roomId].cells[avatarPos.y * ROOM + avatarPos.x] = 'avatar';
    }
    renderRoom();
    toast(playing ? 'Play mode — arrow keys' : 'Edit mode');
  });
  playBtn.style.background = '#2066d2'; playBtn.style.color = '#fff';

  const header = h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: '40px', background: '#fff', borderBottom: '1px solid #b8b8ee', padding: '0 12px', gap: '10px', zIndex: 8 } },
    h('b', { style: { color: '#2800aa' } }, '⬛ Bitsy'),
    h('input', { value: 'Write your game\'s title here.', style: { flex: 1, border: '1px solid #c8c8ee', borderRadius: '6px', padding: '6px 10px', background: '#f7f7ff', color: '#2800aa' } }),
    btn('tools', () => toast('Tools palette')),
    playBtn);

  root.append(
    header,
    win('room', '▦', 24, 56, 340, roomBody),
    win('paint', '✎', 390, 56, 260, paintBody),
    win('colors', '◐', 670, 56, 240, colorRows),
    h('div', { style: { position: 'absolute', right: '16px', bottom: '12px', fontSize: '11px', opacity: .45, color: '#2800aa' } }, 'look-alike · arrow keys in play'),
  );
  renderPaint(); renderRoom();

  window.__demoProof = async () => {
    tab = 'tile'; syncTabs(); renderPaint();
    drawings.tile[4 * PAINT + 4] = true; renderPaint(); await sleep(40);
    rooms[0].cells[5 * ROOM + 5] = 'tile'; roomId = 0; renderRoom(); await sleep(40);
    tileWall = true; renderRoom();
    playing = false; playBtn.click(); await sleep(40);
    tryMove(1, 0); tryMove(0, -1); tryMove(-1, 0);
    colors.bg = '#003399'; rebuildColors(); renderPaint(); renderRoom();
    playing = true; playBtn.click();
    return `paint tile; placed wall; play moves; colors updated; rooms ${rooms.length}`;
  };
};

V['stitchfiddle-knit-chart-desk'] = (root, T) => {
  theme(root, T, { bg: '#f4efe6', fg: '#2a241c', panel: '#fffdf8', ac: '#c45c26', dark: false, line: '#00000014' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter Variable', Georgia, serif";

  let step = 1; // 1 craft, 2 kind, 3 editor
  let craft = 'knitting';
  let kind = 'colors';
  let cols = 40, rows = 40;
  const YARNS = ['#e8dcc8', '#c45c26', '#2f5d50', '#1f3a5f', '#c9a227', '#8b3a4a', '#5a4a3a', '#dce6ea', '#6b7c3a', '#3d2b1f', '#f0a0a8', '#4a6fa5'];
  let color = YARNS[1];
  let cells = Array(cols * rows).fill(null);
  let painting = false, erase = false;

  const shell = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' } });
  const stage = h('div', { style: { width: 'min(980px, 96%)', height: 'min(720px, 92%)', background: '#fffdf8', border: '1px solid #d9d0c2', borderRadius: '18px', boxShadow: '0 20px 50px #2a241c18', display: 'flex', flexDirection: 'column', overflow: 'hidden' } });

  const header = h('div.k-row', { style: { padding: '14px 18px', borderBottom: '1px solid #ebe3d6', gap: '12px' } },
    h('b', { style: { color: '#c45c26', letterSpacing: '.04em' } }, '🧶 Stitch Fiddle-ish'),
    h('span', { style: { flex: 1, fontSize: '12px', opacity: .55 } }, 'knitting · cross stitch chart desk'),
    h('span', { style: { fontSize: '11px', padding: '4px 10px', borderRadius: '999px', background: '#c45c2614', color: '#c45c26' } }, 'look-alike'),
  );

  const body = h('div', { style: { flex: 1, overflow: 'auto', padding: '22px' } });

  const renderWizard = () => {
    if (step === 1) {
      body.replaceChildren(
        h('div', { style: { maxWidth: '640px', margin: '40px auto', display: 'grid', gap: '18px' } },
          h('div', { style: { fontSize: '28px', fontWeight: 750, letterSpacing: '-.02em' } }, 'Choose a craft'),
          h('div', { style: { opacity: .6, fontSize: '14px' } }, 'Start a digital knitting / embroidery chart — pattern paper chrome.'),
          h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' } },
            ...[['knitting', 'Knitting', 'Fair Isle · Lace · Cables'], ['cross', 'Cross stitch', 'X-grid · floss palette'], ['crochet', 'Crochet', 'Motif stubs']].map(([id, lab, sub]) =>
              h('button', {
                style: { textAlign: 'left', padding: '18px', borderRadius: '14px', border: craft === id ? '2px solid #c45c26' : '1px solid #ddd3c4', background: craft === id ? '#fff7f0' : '#fff', cursor: 'pointer' },
                onclick: () => { craft = id; step = id === 'knitting' ? 2 : 3; if (id !== 'knitting') kind = 'colors'; render(); },
              }, h('div', { style: { fontWeight: 700, marginBottom: '6px' } }, lab), h('div', { style: { fontSize: '12px', opacity: .55 } }, sub))),
          ),
        ),
      );
      return;
    }
    if (step === 2) {
      body.replaceChildren(
        h('div', { style: { maxWidth: '720px', margin: '36px auto', display: 'grid', gap: '16px' } },
          h('div.k-row', {}, btn('← Crafts', () => { step = 1; render(); }), h('span', { style: { flex: 1 } })),
          h('div', { style: { fontSize: '26px', fontWeight: 750 } }, 'Knitting project'),
          h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' } },
            ...[['colors', 'Colors / Fair Isle', 'Multi-yarn colorwork chart'], ['lace', 'Lace', 'Openwork stub'], ['cables', 'Cables', 'Twist markers stub']].map(([id, lab, sub]) =>
              h('button', {
                style: { textAlign: 'left', padding: '18px', borderRadius: '14px', border: '1px solid #ddd3c4', background: '#fff', cursor: 'pointer' },
                onclick: () => { kind = id; step = 3; render(); },
              }, h('div', { style: { fontWeight: 700, marginBottom: '6px' } }, lab), h('div', { style: { fontSize: '12px', opacity: .55 } }, sub))),
          ),
        ),
      );
    }
  };

  const cv = h('canvas', { style: { display: 'block', maxWidth: '100%', border: '1px solid #d9d0c2', borderRadius: '8px', cursor: 'crosshair', touchAction: 'none', background: '#fff' } });

  const resizeGrid = (nc, nr) => {
    const next = Array(nc * nr).fill(null);
    for (let y = 0; y < Math.min(rows, nr); y++) for (let x = 0; x < Math.min(cols, nc); x++) next[y * nc + x] = cells[y * cols + x];
    cols = nc; rows = nr; cells = next; paint();
  };

  const paint = () => {
    const cell = Math.max(8, Math.min(16, Math.floor(560 / Math.max(cols, rows))));
    cv.width = cols * cell; cv.height = rows * cell;
    const g = cv.getContext('2d');
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const c = cells[y * cols + x];
      g.fillStyle = c || ((x + y) % 2 ? '#f7f1e6' : '#fffdf8');
      g.fillRect(x * cell, y * cell, cell, cell);
    }
    g.strokeStyle = '#00000012';
    g.beginPath();
    for (let x = 0; x <= cols; x++) { g.moveTo(x * cell + 0.5, 0); g.lineTo(x * cell + 0.5, rows * cell); }
    for (let y = 0; y <= rows; y++) { g.moveTo(0, y * cell + 0.5); g.lineTo(cols * cell, y * cell + 0.5); }
    g.stroke();
    // every 10 helper
    g.strokeStyle = '#c45c2633';
    for (let x = 0; x <= cols; x += 10) { g.beginPath(); g.moveTo(x * cell + 0.5, 0); g.lineTo(x * cell + 0.5, rows * cell); g.stroke(); }
    for (let y = 0; y <= rows; y += 10) { g.beginPath(); g.moveTo(0, y * cell + 0.5); g.lineTo(cols * cell, y * cell + 0.5); g.stroke(); }
  };

  const at = (e) => {
    const p = localPos(e, cv); const r = cv.getBoundingClientRect();
    return [clamp(Math.floor((p.x / r.width) * cols), 0, cols - 1), clamp(Math.floor((p.y / r.height) * rows), 0, rows - 1)];
  };
  const stroke = (e) => {
    const [x, y] = at(e);
    cells[y * cols + x] = erase ? null : color;
    paint();
  };
  drag(cv, { start: (e) => { painting = true; erase = e.shiftKey || e.altKey; stroke(e); }, move: (e) => { if (painting) stroke(e); }, end: () => { painting = false; } });

  const pal = h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } });
  const syncPal = () => {
    pal.replaceChildren(...YARNS.map((c) => h('button', {
      style: { width: '28px', height: '28px', borderRadius: '50%', background: c, border: color === c ? '3px solid #2a241c' : '2px solid #fff', boxShadow: '0 0 0 1px #0002', cursor: 'pointer' },
      onclick: () => { color = c; syncPal(); },
      title: c,
    })));
  };
  syncPal();

  const wSl = slider('Width', 10, 60, cols, 1, (v) => resizeGrid(v, rows));
  const hSl = slider('Height', 10, 60, rows, 1, (v) => resizeGrid(cols, v));

  const renderEditor = () => {
    body.replaceChildren(
      h('div', { style: { display: 'grid', gridTemplateColumns: '240px 1fr', gap: '18px', height: '100%' } },
        h('div', { style: { display: 'grid', gap: '12px', alignContent: 'start' } },
          h('div.k-row', {}, btn('← Back', () => { step = craft === 'knitting' ? 2 : 1; render(); }), h('span', { style: { flex: 1 } })),
          h('div', { style: { fontSize: '12px', opacity: .55 } }, `${craft} · ${kind}`),
          h('div.k-h', {}, 'Yarn palette'),
          pal,
          h('div', { style: { fontSize: '11px', opacity: .5 } }, 'Click/drag to paint · Shift-drag erase'),
          h('div.k-h', {}, 'Grid size'),
          wSl, hSl,
          h('div.k-row', { style: { gap: '8px', flexWrap: 'wrap' } },
            btn('Clear', () => { cells.fill(null); paint(); }),
            btn('Symbol mode', () => toast('Symbol mode stub'), ''),
            btn('Export PNG', () => { const a = h('a', { download: 'knit-chart.png', href: cv.toDataURL() }); a.click(); }, 'pri'),
            btn('Export PDF', () => toast('PDF stub'), ''),
          ),
        ),
        h('div', { style: { display: 'grid', placeItems: 'center', background: '#f7f1e6', borderRadius: '12px', padding: '16px', overflow: 'auto' } }, cv),
      ),
    );
    paint();
  };

  const render = () => {
    if (step < 3) renderWizard();
    else renderEditor();
  };

  stage.append(header, body);
  shell.append(stage);
  root.append(shell);
  render();

  window.__demoProof = async () => {
    craft = 'knitting'; step = 2; render(); await sleep(60);
    kind = 'colors'; step = 3; render(); await sleep(60);
    color = YARNS[2]; syncPal();
    for (let i = 0; i < 12; i++) { cells[10 * cols + 8 + i] = color; cells[11 * cols + 8 + i] = YARNS[1]; }
    paint(); await sleep(40);
    resizeGrid(36, 36); wSl.set(36); hSl.set(36); await sleep(40);
    resizeGrid(40, 40); wSl.set(40); hSl.set(40);
    step = 1; render(); await sleep(40);
    step = 3; craft = 'knitting'; kind = 'colors'; render();
    return 'craft→kind→paint drag stub; grid resize; restored editor';
  };
};


V['lospec-pixel-palette-browser'] = (root, T) => {
  theme(root, T, { bg: '#1a1e27', fg: '#e8ecf4', panel: '#232834', ac: '#5b8cff', ac2: '#ffd166', dark: true, line: '#ffffff14' });
  root.style.fontFamily = "'Press Start 2P',Inter Variable,system-ui,sans-serif";
  root.style.overflow = 'hidden';

  const PALETTES = [
    { name: 'DawnBringer 16', author: 'DawnBringer', tags: ['retro', 'game'], likes: 9201, downloads: 48200, colors: ['#140c1c','#442434','#30346d','#4e4a4e','#854c30','#346524','#d04648','#757161','#597dce','#d27d2c','#8595a1','#6daa2c','#d2aa99','#6dc2ca','#dad45e','#deeed6'] },
    { name: 'PICO-8', author: 'Lexaloffle', tags: ['retro', 'console'], likes: 11002, downloads: 61000, colors: ['#000000','#1d2b53','#7e2553','#008751','#ab5236','#5f574f','#c2c3c7','#fff1e8','#ff004d','#ffa300','#ffec27','#00e436','#29adff','#83769c','#ff77a8','#ffccaa'] },
    { name: 'Endesga 32', author: 'Endesga', tags: ['rich', 'game'], likes: 7800, downloads: 34000, colors: ['#be4a2f','#d77643','#ead4aa','#e4a672','#b86f50','#733e39','#3e2731','#a22633','#e43b44','#f77622','#feae34','#fee761','#63c74d','#3e8948','#265c42','#193c3e','#124e89','#0099db','#2ce8f5','#ffffff','#c0cbdc','#8b9bb4','#5a6988','#3a4466','#262b44','#181425','#ff0044','#68386c','#b55088','#f6757a','#e8b796','#c28569'] },
    { name: 'Sweetie 16', author: 'GrafxKid', tags: ['pastel', 'soft'], likes: 5400, downloads: 22000, colors: ['#1a1c2c','#5d275d','#b13e53','#ef7d57','#ffcd75','#a7f070','#38b764','#257179','#29366f','#3b5dc9','#41a6f6','#73eff7','#f4f4f4','#94b0c2','#566c86','#333c57'] },
    { name: 'SLSO8', author: 'Clouds', tags: ['limited', '8'], likes: 2100, downloads: 9000, colors: ['#0d2b45','#203c56','#544e68','#8d697a','#d08159','#ffaa5e','#ffd4a3','#ffecd6'] },
    { name: 'Apollo', author: 'AdamCYounis', tags: ['warm', 'game'], likes: 4300, downloads: 18000, colors: ['#172038','#253a5e','#3c5e8b','#4f8fba','#73bed3','#a4dddb','#19332d','#25562e','#468232','#75a743','#a8ca58','#d0da91','#4d2b32','#7a4841','#ad7757','#c09473','#d7b594','#e7d5b3','#341c27','#602c2c','#884b2b','#be772b','#de9e41','#e8c170','#a62e2e','#d3455c','#e5897d','#f1b296','#ffd2c0','#ffffff'] },
    { name: 'Vinik24', author: 'Vinik', tags: ['vibrant'], likes: 3100, downloads: 12000, colors: ['#000000','#6f6776','#9a8e8b','#e5cdb8','#c8b58b','#92877a','#7a6a55','#593f2e','#452923','#6e273d','#ba3655','#ea4f36','#f88736','#f7bb3b','#f1f246','#a7d33e','#4dbc3c','#248b46','#176b4b','#0e484b','#0c2e44','#173f5f','#1e6f9f','#3bb6a9','#6dd3c5','#a9e8dc','#ffffff','#c1d9d8','#8ba1a9','#65778a','#4a5675','#393a61'] },
    { name: 'Oil 6', author: 'GrafxKid', tags: ['limited', '6'], likes: 1900, downloads: 8000, colors: ['#fbf5ef','#f2d3ab','#c69fa5','#8b6d9c','#494d7e','#272744'] },
    { name: 'Nyx8', author: 'Janne', tags: ['cool', '8'], likes: 2600, downloads: 11000, colors: ['#08141e','#0f2a3f','#20394f','#4a6b85','#738e99','#b0c0c7','#d7e1e4','#f4f7f5'] },
    { name: 'Journey', author: 'PineTreePizza', tags: ['warm', 'desert'], likes: 3500, downloads: 14000, colors: ['#3e2731','#733e39','#b86f50','#e4a672','#ead4aa','#f5f0d6','#a8c874','#63c74d','#3e8948','#265c42','#193c3e','#124e89','#0099db','#2ce8f5','#ffffff','#c0cbdc'] },
    { name: 'Resurrect 64', author: 'Kerrie Lake', tags: ['rich'], likes: 6200, downloads: 25000, colors: ['#2e222f','#3e3546','#625565','#966c6c','#ab947a','#cfbc8e','#e6cdb0','#fbffe0','#2e222f','#45293f','#7a3045','#ad3645','#d15f56','#e69c6a','#f0d2a8','#fbf5ef','#20394f','#2c5a6e','#33859d','#41a6f6','#73eff7','#a7f070','#38b764','#257179','#29366f','#3b5dc9','#41a6f6','#73eff7','#94b0c2','#566c86','#333c57','#1a1c2c'].slice(0,32) },
    { name: 'AAP-16', author: 'Adigun A. Polack', tags: ['retro'], likes: 2800, downloads: 10000, colors: ['#070708','#332222','#774433','#998855','#bbcc88','#ddeebb','#6699aa','#225588','#113344','#000000','#aa6644','#cc8855','#eecc99','#ffffff','#6688cc','#4466aa'] },
  ];

  let q = '';
  let countFilter = 'any';
  let tagFilter = 'all';
  let selected = PALETTES[0];
  let doodleColor = PALETTES[0].colors[0];
  const D = 16;
  const doodle = Array(D * D).fill(null);

  const shell = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '56px auto 1fr', background: '#1a1e27' } });
  const header = h('div.k-row', { style: { padding: '0 18px', gap: '18px', borderBottom: '1px solid #ffffff12', background: '#12151c' } },
    h('b', { style: { fontSize: '18px', letterSpacing: '.04em', color: '#d7dde8' } }, 'LOSPEC'),
    h('span', { style: { opacity: .45, fontSize: '10px' } }, 'GALLERY'),
    h('span', { style: { color: '#5b8cff', fontSize: '10px', borderBottom: '2px solid #5b8cff', paddingBottom: '14px', marginTop: '14px' } }, 'PALETTES'),
    h('span', { style: { opacity: .45, fontSize: '10px' } }, 'SHOP'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '10px', opacity: .5 } }, 'pixel palette desk'),
  );

  const filters = h('div.k-row', { style: { padding: '10px 18px', gap: '10px', flexWrap: 'wrap', borderBottom: '1px solid #ffffff10', background: '#1f2430', fontFamily: 'Inter Variable,system-ui,sans-serif' } });
  const body = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: 0, overflow: 'hidden' } });
  const grid = h('div', { style: { overflow: 'auto', padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '14px', alignContent: 'start' } });
  const detail = h('div', { style: { borderLeft: '1px solid #ffffff12', background: '#161a22', padding: '14px', overflow: 'auto', fontFamily: 'Inter Variable,system-ui,sans-serif', display: 'grid', alignContent: 'start', gap: '12px' } });

  const filtered = () => PALETTES.filter((p) => {
    if (countFilter !== 'any' && p.colors.length !== +countFilter) return false;
    if (tagFilter !== 'all' && !p.tags.includes(tagFilter)) return false;
    if (q && !(`${p.name} ${p.author} ${p.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const paintDoodle = (cv) => {
    const g = cv.getContext('2d');
    const cell = cv.width / D;
    for (let y = 0; y < D; y++) for (let x = 0; x < D; x++) {
      const c = doodle[y * D + x];
      g.fillStyle = c || (((x + y) % 2) ? '#2a3140' : '#232834');
      g.fillRect(x * cell, y * cell, cell, cell);
    }
  };

  const applyPalettePreview = (colors, cv) => {
    const g = cv.getContext('2d');
    const n = colors.length;
    for (let i = 0; i < 64; i++) {
      const x = i % 8, y = (i / 8) | 0;
      g.fillStyle = colors[(x * 3 + y * 5) % n];
      g.fillRect(x * 4, y * 4, 4, 4);
    }
  };

  const draw = () => {
    const list = filtered();
    filters.replaceChildren(
      h('b', { style: { fontSize: '11px', opacity: .55, letterSpacing: '.08em' } }, 'FILTERING'),
      h('input', { placeholder: 'Search palettes…', value: q, style: { padding: '7px 10px', borderRadius: '8px', border: '1px solid #ffffff18', background: '#12151c', color: '#fff', width: '180px', font: '12px Inter Variable' }, oninput: (e) => { q = e.target.value; draw(); } }),
      seg([['any', 'Any'], ['2', '2'], ['4', '4'], ['8', '8'], ['16', '16'], ['32', '32']], countFilter, (v) => { countFilter = v; draw(); }),
      select([['all', 'All tags'], ['retro', 'retro'], ['game', 'game'], ['limited', 'limited'], ['warm', 'warm'], ['cool', 'cool'], ['pastel', 'pastel'], ['vibrant', 'vibrant']], tagFilter, (v) => { tagFilter = v; draw(); }),
      h('span', { style: { flex: 1 } }),
      h('span', { style: { fontSize: '12px', opacity: .55 } }, `${list.length} results`),
    );

    grid.replaceChildren(...list.map((p) => {
      const mini = h('canvas', { width: 32, height: 32, style: { width: '40px', height: '40px', imageRendering: 'pixelated', borderRadius: '4px', border: '1px solid #ffffff10' } });
      applyPalettePreview(p.colors, mini);
      return h('button', {
        style: {
          textAlign: 'left', border: selected?.name === p.name ? '2px solid #5b8cff' : '1px solid #ffffff14',
          background: '#232834', borderRadius: '12px', padding: '12px', cursor: 'pointer', color: 'inherit', fontFamily: 'Inter Variable,system-ui',
        },
        onclick: () => { selected = p; doodleColor = p.colors[0]; draw(); },
      },
        h('div.k-row', { style: { gap: '10px', marginBottom: '8px' } },
          mini,
          h('div', {}, h('b', { style: { fontSize: '13px' } }, p.name), h('div', { style: { fontSize: '11px', opacity: .55 } }, p.author))),
        h('div', { style: { display: 'flex', height: '28px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #0006' } },
          ...p.colors.slice(0, 32).map((c) => h('div', { style: { flex: 1, background: c } }))),
        h('div.k-row', { style: { marginTop: '8px', fontSize: '11px', opacity: .6, gap: '10px' } },
          h('span', {}, '♥ ' + p.likes), h('span', {}, '⬇ ' + p.downloads), h('span', { style: { flex: 1 } }),
          ...p.tags.slice(0, 2).map((t) => h('span', { style: { background: '#ffffff10', padding: '2px 6px', borderRadius: '99px' } }, t))),
      );
    }));

    const cv = h('canvas', { width: 256, height: 256, style: { width: '100%', imageRendering: 'pixelated', borderRadius: '8px', border: '1px solid #ffffff14', cursor: 'crosshair', touchAction: 'none' } });
    paintDoodle(cv);
    drag(cv, {
      start: (e) => {
        const r = cv.getBoundingClientRect();
        const x = Math.floor(((e.clientX - r.left) / r.width) * D);
        const y = Math.floor(((e.clientY - r.top) / r.height) * D);
        if (x < 0 || y < 0 || x >= D || y >= D) return;
        doodle[y * D + x] = doodleColor;
        paintDoodle(cv);
      },
      move: (e) => {
        const r = cv.getBoundingClientRect();
        const x = Math.floor(((e.clientX - r.left) / r.width) * D);
        const y = Math.floor(((e.clientY - r.top) / r.height) * D);
        if (x < 0 || y < 0 || x >= D || y >= D) return;
        doodle[y * D + x] = doodleColor;
        paintDoodle(cv);
      },
    });

    detail.replaceChildren(
      h('div.k-h', {}, 'Palette detail'),
      h('b', { style: { fontSize: '16px' } }, selected.name),
      h('div', { style: { fontSize: '12px', opacity: .6 } }, `by ${selected.author} · ${selected.colors.length} colors`),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '4px' } },
        ...selected.colors.map((c) => h('button', {
          title: c, style: { aspectRatio: '1', background: c, border: doodleColor === c ? '2px solid #fff' : '1px solid #0005', borderRadius: '4px', cursor: 'pointer' },
          onclick: () => { doodleColor = c; copy(c, 'Hex'); draw(); },
        }))),
      h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } },
        ...selected.tags.map((t) => h('span', { style: { background: '#5b8cff22', color: '#9bbcff', padding: '3px 8px', borderRadius: '99px', fontSize: '11px' } }, t))),
      btn('Use palette', () => {
        // remap doodle to nearest palette colors / seed a sprite
        const seed = [
          '....xxxx........',
          '...xxxxxx.......',
          '..xx..x..xx.....',
          '.xxxxxxxxxxxx...',
          'xx..xxxxxx..xx..',
          'xxxxxxxxxxxxxxx.',
          '.xx..xxxx..xx...',
          '..xxxxxxxxxxxx..',
          '...xx....xx.....',
          '....xx..xx......',
          '.....xxxx.......',
          '......xx........',
        ];
        doodle.fill(null);
        seed.forEach((row, y) => [...row].forEach((ch, x) => {
          if (ch === 'x') doodle[y * D + x] = selected.colors[(x + y) % selected.colors.length];
        }));
        doodleColor = selected.colors[0];
        toast('palette applied');
        draw();
      }, 'pri'),
      h('div.k-h', {}, '16×16 doodle'),
      cv,
      btn('Clear doodle', () => { doodle.fill(null); draw(); }),
      btn('Copy hex list', () => copy(selected.colors.join(', '), 'Palette')),
    );
  };

  body.append(grid, detail);
  shell.append(header, filters, body);
  root.append(shell);
  draw();

  window.__demoProof = async () => {
    q = 'dawn'; countFilter = '16'; draw();
    await sleep(60);
    selected = PALETTES[0]; doodleColor = selected.colors[3];
    // seed doodle
    for (let i = 0; i < 40; i++) doodle[((i * 7) % (D * D))] = selected.colors[i % selected.colors.length];
    draw();
    q = ''; countFilter = 'any';
    selected = PALETTES[1];
    doodleColor = selected.colors[8];
    draw();
    return 'filtered DawnBringer-16 · applied swatches to doodle · switched to PICO-8';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['pixel-sprite-editor-workspace'])(root, T); }

