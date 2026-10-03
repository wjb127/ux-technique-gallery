import { h, s, css, drag, localPos, clamp, copy, toast, gesture, sleep, hsl, hexToRgb, rgbToHex, fitCanvas, pick, rng } from '../lib.js';
import { theme, slider, seg, select, btn, panel, grid, toggle } from '../kit.js';
css(`
.pt-cv{position:absolute;inset:0;touch-action:none;cursor:crosshair}
.pt-tools{display:grid;gap:4px}.pt-tools button{border:1px solid var(--line);background:var(--btn,transparent);color:inherit;border-radius:6px;height:34px;font-size:15px}
.pt-tools button.on{background:var(--ac);color:#fff;border-color:transparent}
.w95{background:#c0c0c0;color:#000;font:12px/1.2 'Tahoma','MS Sans Serif',system-ui}.w95 .b{border:2px solid;border-color:#fff #404040 #404040 #fff;background:#c0c0c0}
.w95 .in{border:2px solid;border-color:#404040 #fff #fff #404040}
.w95 .menu{display:flex;gap:14px;padding:3px 8px}.w95 .menu span:first-letter{text-decoration:underline}
.w95 .tb{display:grid;grid-template-columns:repeat(2,26px);gap:0;padding:3px}.w95 .tb button{width:26px;height:26px;padding:0;font-size:13px;border:2px solid;border-color:#fff #404040 #404040 #fff;background:#c0c0c0}
.w95 .tb button.on{border-color:#404040 #fff #fff #404040;background:#dcdcdc}
.w95 .pal{display:grid;grid-template-columns:repeat(14,16px);grid-auto-rows:16px;gap:1px}.w95 .pal i{border:1px solid;border-color:#404040 #fff #fff #404040}
.shp-sel{fill:none;stroke:#3b82f6;stroke-width:1.5;pointer-events:none}.shp-h{fill:#fff;stroke:#3b82f6;stroke-width:1.5}
.tl-bar{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:2px;background:var(--panel);border-radius:12px;padding:4px;box-shadow:0 2px 12px #0002,0 0 0 1px #0000000d}
.tl-bar button{width:38px;height:38px;border:0;border-radius:9px;background:transparent;font-size:16px;color:inherit}.tl-bar button.on{background:var(--ac);color:#fff}
`);
// ---------- raster painter core
function painter(host, o = {}) {
  const cv = h('canvas.pt-cv'); host.append(cv);
  const st = { tool: 'brush', color: o.color || '#111', size: o.size || 6, alpha: 1, sym: o.sym || 0, glow: o.glow || false, undo: [], bg: o.bg || null, onstroke: o.onstroke, width: o.width };
  let g;
  const resize = () => { const snap = g ? g.getImageData(0, 0, cv.width, cv.height) : null; fitCanvas(cv, host); g = cv.g; if (st.bg) { g.fillStyle = st.bg; g.fillRect(0, 0, cv.W, cv.H); } if (snap) g.putImageData(snap, 0, 0); };
  resize();
  new ResizeObserver(() => { const r = host.getBoundingClientRect(); if (Math.abs(r.width - cv.W) > 1 || Math.abs(r.height - cv.H) > 1) resize(); }).observe(host);
  const pts = []; let last, start, snapshot;
  const sym = (x, y, fn) => { if (!st.sym) return fn(x, y); const cx = cv.W / 2, cy = cv.H / 2; for (let i = 0; i < st.sym; i++) { const a = (i * 2 * Math.PI) / st.sym; const dx = x - cx, dy = y - cy; fn(cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)); if (o.mirror) fn(cx - (dx * Math.cos(a) - dy * Math.sin(a)), cy + dx * Math.sin(a) + dy * Math.cos(a)); } };
  const seg2 = (a, b, w) => { g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = w; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); };
  function stroke(a, b) {
    g.globalAlpha = st.alpha; g.globalCompositeOperation = st.tool === 'eraser' ? 'destination-out' : o.blend || 'source-over';
    g.strokeStyle = st.color; if (st.glow) { g.shadowColor = st.color; g.shadowBlur = 12; }
    const w = st.width ? st.width(a, b) : st.size;
    if (st.sym) { const pairs = []; sym(a.x, a.y, (x, y) => pairs.push({ x, y })); const pb = []; sym(b.x, b.y, (x, y) => pb.push({ x, y })); pairs.forEach((p, i) => seg2(p, pb[i], w)); } else seg2(a, b, w);
    if (o.threads) { g.globalAlpha = 0.18; g.lineWidth = 0.6; for (const p of pts) if (Math.hypot(p.x - b.x, p.y - b.y) < o.threads && Math.random() < 0.3) sym(b.x, b.y, (x, y) => { g.beginPath(); g.moveTo(x, y); g.lineTo(x + (p.x - b.x), y + (p.y - b.y)); g.stroke(); }); }
    g.shadowBlur = 0; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  function flood(x, y) {
    const W = cv.width, H = cv.height, sc = cv.width / cv.W; x = Math.floor(x * sc); y = Math.floor(y * sc); const img = g.getImageData(0, 0, W, H), d = img.data; const i0 = (y * W + x) * 4; const t = [d[i0], d[i0 + 1], d[i0 + 2], d[i0 + 3]]; const [r, gg, b] = hexToRgb(st.color);
    if (t[0] === r && t[1] === gg && t[2] === b && t[3] === 255) return; const stack = [[x, y]]; const same = (i) => Math.abs(d[i] - t[0]) + Math.abs(d[i + 1] - t[1]) + Math.abs(d[i + 2] - t[2]) + Math.abs(d[i + 3] - t[3]) < 40;
    let n = 0; while (stack.length && n++ < 4e6) { const [px, py] = stack.pop(); if (px < 0 || py < 0 || px >= W || py >= H) continue; const i = (py * W + px) * 4; if (!same(i)) continue; d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255; stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]); }
    g.putImageData(img, 0, 0);
  }
  cv.addEventListener('pointerdown', (e) => {
    const p = localPos(e, cv); st.undo.push(g.getImageData(0, 0, cv.width, cv.height)); if (st.undo.length > 30) st.undo.shift();
    if (st.tool === 'fill') { flood(p.x, p.y); st.onstroke?.(); return; }
    if (st.tool === 'picker') { const d = g.getImageData(p.x * (cv.width / cv.W), p.y * (cv.height / cv.H), 1, 1).data; st.color = rgbToHex(d[0], d[1], d[2]); o.onpick?.(st.color); return; }
    cv.setPointerCapture(e.pointerId); last = start = p; pts.length = 0; pts.push(p); snapshot = g.getImageData(0, 0, cv.width, cv.height);
    const mv = (ev) => { const q = localPos(ev, cv); if (['line', 'rect', 'ellipse'].includes(st.tool)) { g.putImageData(snapshot, 0, 0); g.strokeStyle = st.color; g.lineWidth = st.size; g.beginPath(); if (st.tool === 'line') { g.moveTo(start.x, start.y); g.lineTo(q.x, q.y); } else if (st.tool === 'rect') g.rect(start.x, start.y, q.x - start.x, q.y - start.y); else g.ellipse((start.x + q.x) / 2, (start.y + q.y) / 2, Math.abs(q.x - start.x) / 2, Math.abs(q.y - start.y) / 2, 0, 0, 7); g.stroke(); return; }
      if (st.tool === 'spray') { g.fillStyle = st.color; for (let i = 0; i < 20; i++) { const a = Math.random() * 7, r = Math.random() * st.size * 2; g.fillRect(q.x + Math.cos(a) * r, q.y + Math.sin(a) * r, 1, 1); } return; }
      stroke(last, q); pts.push(q); last = q; };
    const up = () => { cv.removeEventListener('pointermove', mv); cv.removeEventListener('pointerup', up); st.onstroke?.(pts.slice()); };
    cv.addEventListener('pointermove', mv); cv.addEventListener('pointerup', up);
  });
  return Object.assign(st, { cv, get g() { return g; }, resize, undoOnce: () => { const u = st.undo.pop(); if (u) g.putImageData(u, 0, 0); }, clear: () => { st.undo.push(g.getImageData(0, 0, cv.width, cv.height)); g.clearRect(0, 0, cv.W, cv.H); if (st.bg) { g.fillStyle = st.bg; g.fillRect(0, 0, cv.W, cv.H); } }, pts });
}
const scribble = async (el, cx, cy, r = 80, n = 40, fn) => { const P = []; for (let i = 0; i <= n; i++) { const t = i / n; P.push(fn ? fn(t) : [cx + Math.cos(t * 9) * r * (0.4 + t), cy + Math.sin(t * 7) * r * 0.6]); } await gesture(el, P, 2); };
const V = {};
function toolRail(p, tools, cls = 'pt-tools') { const bs = tools.map(([t, ic]) => h('button', { title: t, class: t === p.tool ? 'on' : '', onclick: () => { p.tool = t; bs.forEach((b) => b.classList.toggle('on', b.title === t)); } }, ic)); return h('div.' + cls, {}, bs); }
V['kleki-layered-paint-desk'] = (root, T) => {
  theme(root, T, { bg: '#9e9e9e', fg: '#222', panel: '#dcdcdc', ac: '#3a6ea5', dark: false, r: '0px' });
  const host = h('div', { style: { position: 'absolute', inset: '0 272px 0 0', display: 'grid', placeItems: 'center' } });
  const paper = h('div', { style: { position: 'relative', width: '72%', height: '82%', background: '#fff', boxShadow: '0 0 0 1px #0003, 0 8px 30px #0003' } }); host.append(paper);
  const p = painter(paper, { color: '#1b1b1b', size: 8, bg: '#fff' });
  const layers = h('div', { style: { display: 'grid', gap: '3px' } }); let nL = 1;
  const addLayer = () => { nL++; layers.prepend(h('div', { style: { padding: '8px', background: '#fff', border: '2px solid #3a6ea5', fontSize: '12px' } }, `Layer ${nL}`)); };
  layers.append(h('div', { style: { padding: '8px', background: '#eee', fontSize: '12px' } }, 'Layer 1'));
  let H0 = 210, S0 = 60, L0 = 30; const sq = h('div', { style: { position: 'relative', height: '150px', cursor: 'crosshair' } }); const hue = h('input', { type: 'range', min: 0, max: 360, value: H0, style: { width: '100%' } });
  const setC = () => { sq.style.background = `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(${H0} 100% 50%))`; p.color = hsl(H0, S0, L0); cur.style.background = p.color; };
  const cur = h('div', { style: { height: '22px', border: '1px solid #0004' } });
  drag(sq, { start: (e) => { const q = localPos(e, sq); S0 = clamp(q.x / q.w * 100, 0, 100); L0 = clamp((1 - q.y / q.h) * (100 - S0 / 2), 0, 100); setC(); }, move: (e) => { const q = localPos(e, sq); S0 = clamp(q.x / q.w * 100, 0, 100); L0 = clamp((1 - q.y / q.h) * (100 - S0 / 2), 0, 100); setC(); } });
  hue.oninput = (e) => { H0 = +e.target.value; setC(); }; setC();
  const txt = h('input', { placeholder: 'Type text, then click canvas', style: { width: '100%', padding: '6px' } });
  const tools = toolRail(p, [['brush', '🖌'], ['eraser', '⌫'], ['fill', '🪣'], ['line', '╱'], ['rect', '▭'], ['text', 'T']]); tools.style.gridTemplateColumns = 'repeat(6,1fr)';
  paper.addEventListener('pointerdown', (e) => { if (p.tool !== 'text') return; const q = localPos(e, paper); p.g.fillStyle = p.color; p.g.font = `${p.size * 4}px Inter Variable`; p.g.fillText(txt.value || 'Hello Kleki', q.x, q.y); }, true);
  const side = panel(null, h('div.k-row', {}, h('b', { style: { fontSize: '18px', fontStyle: 'italic' } }, 'kleki'), h('span', { style: { flex: 1 } }), btn('↶', p.undoOnce), btn('↷', () => {})), tools, sq, hue, cur,
    slider('Size', 1, 60, 8, 1, (v) => (p.size = v)), slider('Opacity', 0.05, 1, 1, 0.05, (v) => (p.alpha = v), (v) => Math.round(v * 100) + '%'), txt, h('div.k-row', {}, h('div.k-h', {}, 'Layers'), h('span', { style: { flex: 1 } }), btn('+', addLayer)), layers);
  Object.assign(side.style, { position: 'absolute', right: 0, top: 0, bottom: 0, width: '272px', borderRadius: 0 });
  root.append(host, side);
  window.__demoProof = async () => { await sleep(50); await scribble(p.cv, 300, 250, 120); p.color = '#e0457b'; p.size = 22; await scribble(p.cv, 500, 380, 90, 30, (t) => [380 + t * 400, 380 + Math.sin(t * 12) * 40]); addLayer(); return 'painted 2 strokes + added layer'; };
};
V['jspaint-classic-paint-desk'] = (root, T) => {
  theme(root, T, { bg: '#808080', fg: '#000', dark: false }); root.classList.add('w95');
  const COL = ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000', '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040'];
  const cvwrap = h('div', { style: { position: 'absolute', left: '64px', top: '24px', right: 0, bottom: '62px', background: '#808080', overflow: 'hidden' } });
  const paper = h('div', { style: { position: 'absolute', left: '4px', top: '4px', width: '720px', height: '460px', background: '#fff' } }); cvwrap.append(paper);
  const fgbg = h('div', { style: { position: 'relative', width: '32px', height: '32px' } }); const fg = h('div.b', { style: { position: 'absolute', left: 0, top: 0, width: '18px', height: '18px', background: '#000', zIndex: 1 } }), bgc = h('div.b', { style: { position: 'absolute', right: 0, bottom: 0, width: '18px', height: '18px', background: '#fff' } }); fgbg.append(fg, bgc);
  const status = h('div.in', { style: { flex: 1, padding: '2px 4px' } }, 'For Help, click Help Topics on the Help Menu.');
  const p = painter(paper, { color: '#000', size: 2, bg: '#fff', onstroke: () => (status.textContent = `Drew with ${p.tool}`) });
  const tb = toolRail(p, [['select', '⬚'], ['lasso', '✂'], ['eraser', '▯'], ['fill', '🪣'], ['picker', '💧'], ['zoom', '🔍'], ['pencil', '✎'], ['brush', '🖌'], ['spray', '💨'], ['text', 'A'], ['line', '╲'], ['curve', '∿'], ['rect', '▭'], ['poly', '⬠'], ['ellipse', '◯'], ['rrect', '▢']], 'tb');
  tb.querySelectorAll('button').forEach((b) => { if (b.title === 'pencil') b.onclick = () => { p.tool = 'brush'; p.size = 1; tb.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); }; });
  const pal = h('div.pal', {}, COL.map((c) => h('i', { style: { background: c }, onclick: () => { p.color = c; fg.style.background = c; }, oncontextmenu: (e) => { e.preventDefault(); bgc.style.background = c; } })));
  root.append(h('div.menu', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '22px' } }, ['File', 'Edit', 'View', 'Image', 'Colors', 'Help', 'Extras'].map((m) => h('span', {}, m))),
    h('div', { style: { position: 'absolute', left: 0, top: '24px', width: '62px', bottom: '62px', padding: '4px' } }, tb, h('div.in', { style: { height: '64px', marginTop: '6px', background: '#c0c0c0' } })), cvwrap,
    h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: '22px', height: '40px', display: 'flex', gap: '6px', padding: '4px' } }, h('div.in', { style: { padding: '2px' } }, fgbg), pal),
    h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '22px', display: 'flex', gap: '2px', padding: '2px' } }, status, h('div.in', { style: { width: '120px' } }), h('div.in', { style: { width: '120px' } }), btn('Save PNG', () => { const a = h('a', { download: 'untitled.png', href: p.cv.toDataURL() }); a.click(); })));
  root.style.setProperty('--line', '#404040');
  window.__demoProof = async () => { p.tool = 'rect'; p.color = '#0000ff'; p.size = 3; await gesture(p.cv, [[80, 80], [200, 160], [300, 240]]); p.tool = 'fill'; p.color = '#ffff00'; await gesture(p.cv, [[150, 150], [150, 150]]); p.tool = 'brush'; p.color = '#ff0000'; p.size = 5; await scribble(p.cv, 480, 260, 90); return 'rect + bucket fill + brush'; };
};
V['photo-editor-workspace'] = (root, T) => {
  theme(root, T, { bg: '#1d1b2e', fg: '#eee', panel: '#474747', ac: '#2d8ceb', dark: true });
  root.style.background = 'radial-gradient(120% 90% at 50% 0%, #4b2c6f 0%, #1d1b2e 55%, #121218 100%)';
  const app = h('div', { style: { position: 'absolute', left: '50%', top: '210px', transform: 'translateX(-50%)', width: '1020px', height: '520px', background: '#474747', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 30px 90px #0009', display: 'grid', gridTemplateRows: '26px 30px 1fr', gridTemplateColumns: '40px 1fr 230px' } });
  const menu = h('div', { style: { gridColumn: '1/-1', background: '#333', display: 'flex', gap: '16px', padding: '5px 10px', fontSize: '12px' } }, ['File', 'Edit', 'Image', 'Layer', 'Select', 'Filter', 'View', 'Window', 'More'].map((m) => h('span', {}, m)));
  const opts = h('div', { style: { gridColumn: '1/-1', background: '#3c3c3c', display: 'flex', gap: '10px', alignItems: 'center', padding: '0 10px', fontSize: '12px' } }, 'Brush:', h('b', {}, '12px'), 'Mode: Normal', 'Opacity: 100%');
  const tools = h('div', { style: { background: '#3a3a3a', display: 'grid', alignContent: 'start', gap: '2px', padding: '4px 3px' } });
  const stage = h('div', { style: { position: 'relative', background: '#282828', display: 'grid', placeItems: 'center' } });
  const doc = h('div', { style: { position: 'relative', width: '560px', height: '360px', background: '#fff' } }); stage.append(doc);
  const p = painter(doc, { color: '#2d8ceb', size: 12, bg: '#fff' });
  const lay = h('div', { style: { display: 'grid', gap: '2px' } });
  const hist = h('div', { style: { fontSize: '12px', display: 'grid', gap: '2px', maxHeight: '120px', overflow: 'auto' } }, h('div', {}, '▸ Open'));
  const addLayer = (n) => lay.prepend(h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center', background: '#555', padding: '4px', fontSize: '12px' } }, '👁', h('div', { style: { width: '30px', height: '20px', background: '#fff' } }), n));
  addLayer('Background'); p.onstroke = () => { hist.append(h('div', {}, '▸ Brush Tool')); };
  tools.append(toolRail(p, [['move', '✥'], ['select', '⬚'], ['lasso', '➰'], ['wand', '✦'], ['crop', '⌗'], ['picker', '💧'], ['brush', '🖌'], ['eraser', '▯'], ['fill', '🪣'], ['rect', '▭'], ['ellipse', '◯'], ['line', '╱']]));
  const side = h('div', { style: { background: '#3c3c3c', padding: '6px', display: 'grid', gridTemplateRows: 'auto auto auto 1fr', gap: '6px', fontSize: '12px' } }, h('b', {}, 'History'), hist, h('div.k-row', {}, h('b', {}, 'Layers'), h('span', { style: { flex: 1 } }), btn('+', () => addLayer('Layer ' + (lay.children.length)))), lay);
  app.append(menu, opts, tools, stage, side);
  root.append(h('div', { style: { position: 'absolute', top: '44px', width: '100%', textAlign: 'center' } }, h('div', { style: { font: '800 48px/1 Inter Variable', letterSpacing: '-.03em' } }, 'Free Online Photo Editor'), h('div', { style: { opacity: .75, margin: '12px 0 16px', fontSize: '16px' } }, 'Unlock your creativity with a free, in-browser layered editor.'), btn('Start using the editor', () => stage.scrollIntoView(), 'pri')), app);
  window.__demoProof = async () => { await scribble(p.cv, 280, 180, 110); addLayer('Layer 1'); p.tool = 'ellipse'; p.color = '#e63946'; await gesture(p.cv, [[360, 60], [460, 160], [500, 200]]); return 'brush + ellipse + layer'; };
};
V['symmetric-silk-canvas'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#9ab', dark: true });
  const p = painter(root, { color: '#4fb3ff', size: 1.4, sym: 6, mirror: true, glow: true, blend: 'lighter' });
  let hue = 200; p.width = () => p.size;
  const cols = ['#4fb3ff', '#ff5ec4', '#ffd166', '#7cff9e', '#b388ff'];
  const title = h('div', { style: { position: 'absolute', top: '44%', width: '100%', textAlign: 'center', pointerEvents: 'none', transition: 'opacity .6s' } }, h('div', { style: { font: '300 22px Georgia,serif', color: '#8aa' } }, 'Silk'), h('div', { style: { fontSize: '11px', color: '#566', marginTop: '6px' } }, 'Interactive generative art · click and drag'));
  p.onstroke = () => (title.style.opacity = 0);
  const bar = h('div', { style: { position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', alignItems: 'center', color: '#89a', fontSize: '12px' } },
    cols.map((c) => h('span.k-sw', { style: { background: c, width: '18px', height: '18px' }, onclick: () => (p.color = c) })),
    select([[0, 'No symmetry'], [2, '2'], [4, '4'], [6, '6'], [10, '10'], [16, '16']], 6, (v) => (p.sym = +v)), toggle('Mirror', true, () => {}), btn('Undo', p.undoOnce), btn('Clear', p.clear));
  root.append(title, bar);
  window.__demoProof = async () => { for (const c of cols.slice(0, 3)) { p.color = c; await scribble(p.cv, 720, 430, 140, 60, (t) => [720 + Math.cos(t * 6 + cols.indexOf(c)) * 260 * t, 430 + Math.sin(t * 5) * 200 * t]); } return 'painted 3 symmetric strokes'; };
};
V['freehand-stroke-param-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', panel: '#fff', ac: '#111', dark: false });
  const P = { size: 16, thinning: 0.5, streamline: 0.5, taper: 20 };
  const p = painter(root, { color: '#111', size: 16 });
  let lastT = 0, vel = 0; p.width = (a, b) => { const d = Math.hypot(b.x - a.x, b.y - a.y); vel = vel * P.streamline + d * (1 - P.streamline); return Math.max(1, P.size * (1 - P.thinning * clamp(vel / 30, 0, 1))); };
  const side = panel(null, h('div.k-row', {}, '☰', h('b', {}, 'perfect-freehand')), slider('Size', 1, 64, 16, 1, (v) => (P.size = v)), slider('Thinning', -1, 1, 0.5, 0.05, (v) => (P.thinning = v)), slider('Streamline', 0, 0.99, 0.5, 0.01, (v) => (P.streamline = v)), slider('Smoothing', 0, 1, 0.5, 0.01, () => {}), toggle('Taper start', true, () => {}), slider('Taper', 0, 100, 20, 1, (v) => (P.taper = v)), toggle('Fill', true, () => {}), h('div.k-row', {}, ['#111', '#e03131', '#1971c2', '#2f9e44'].map((c) => h('span.k-sw', { style: { background: c }, onclick: () => (p.color = c) }))), h('div.k-row', {}, btn('Reset Options', () => {}), btn('Copy Options', () => copy(JSON.stringify(P)))), btn('Copy to SVG', () => copy('<svg><!-- stroke --></svg>'), 'pri'));
  Object.assign(side.style, { position: 'absolute', left: '10px', top: '10px', width: '230px', boxShadow: '0 2px 20px #0001' });
  root.append(side, h('div.k-row', { style: { position: 'absolute', right: '16px', bottom: '12px', gap: '18px' } }, btn('Undo', p.undoOnce), btn('Redo', () => {}), btn('Clear', p.clear)));
  const hey = (t) => { const x = 520 + t * 420; return [x, 420 + Math.sin(t * 22) * 60 - Math.cos(t * 9) * 30]; };
  (async () => { await sleep(50); await scribble(p.cv, 0, 0, 0, 80, hey); })();
  window.__demoProof = async () => { P.size = 28; P.thinning = 0.8; await scribble(p.cv, 0, 0, 0, 50, (t) => [560 + t * 300, 600 + Math.sin(t * 14) * 40]); return 'variable-width strokes'; };
};
V['memory-connect-drawing-desk'] = (root, T) => {
  theme(root, T, { bg: '#0e0e10', fg: '#ccc', dark: true });
  const guides = h('div', { style: { position: 'absolute', inset: 0, background: 'repeating-conic-gradient(from 0deg at 50% 50%, #ffffff08 0deg 0.6deg, transparent 0.6deg 15deg)' } });
  root.append(guides);
  const p = painter(root, { color: '#e8e2d0', size: 0.8, threads: 90, sym: 8, mirror: false });
  const bar = h('div', { style: { position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', background: '#1b1b1f', padding: '6px', borderRadius: '999px', border: '1px solid #333', alignItems: 'center' } },
    btn('Thread', () => (p.threads = 90)), btn('Bloom', () => (p.threads = 160)), btn('Ink', () => (p.threads = 0)), select([[1, 'No sym'], [4, '4×'], [8, '8×'], [12, '12×']], 8, (v) => (p.sym = +v > 1 ? +v : 0)), ['#e8e2d0', '#ff7a59', '#7ad7ff', '#c9a7ff'].map((c) => h('span.k-sw', { style: { background: c, width: '18px', height: '18px' }, onclick: () => (p.color = c) })), btn('Layers ▾', () => toast('Layer 2 added')), btn('↶', p.undoOnce), btn('PNG', () => toast('PNG saved (demo)')), btn('.nekudot', () => copy(JSON.stringify(p.pts.slice(0, 50)), 'Points copied')));
  root.append(bar, h('div', { style: { position: 'absolute', top: '48%', width: '100%', textAlign: 'center', fontSize: '12px', color: '#666', pointerEvents: 'none' } }, 'Draw to connect memory points'));
  window.__demoProof = async () => { await scribble(p.cv, 0, 0, 0, 120, (t) => [720 + Math.cos(t * 14) * 200 * (0.3 + t), 430 + Math.sin(t * 11) * 180 * (0.3 + t)]); return 'thread bloom stroke with 8x symmetry'; };
};
V['quick-draw-guess-stage'] = (root, T) => {
  theme(root, T, { bg: '#ffd600', fg: '#111', dark: false });
  const WORDS = ['cat', 'bicycle', 'house', 'sun', 'tree', 'fish', 'umbrella', 'clock'];
  let round = 0, timer = 20, tid, strokes = 0, word;
  const intro = h('div', { style: { position: 'absolute', inset: 0, background: '#fff', display: 'grid', placeItems: 'center', textAlign: 'center' } }, h('div', {},
    h('div', { style: { font: '900 64px "Comic Sans MS","Chalkboard SE",cursive', transform: 'rotate(-4deg)', border: '5px solid #111', borderRadius: '50%', padding: '30px 60px', display: 'inline-block' } }, 'QUICK, DRAW!'),
    h('p', { style: { fontSize: '17px', maxWidth: '560px', margin: '28px auto' } }, '신경망이 낙서를 알아맞힐 수 있을까요? Can a neural network learn to recognize doodling?'), btn("Let's Draw!", () => start(), 'pri')));
  root.style.setProperty('--ac', '#ffd600'); root.style.setProperty('--acfg', '#111');
  const game = h('div', { style: { position: 'absolute', inset: 0, background: '#fff' } });
  const top = h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '64px', background: '#ffd600', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', font: '700 22px "Comic Sans MS",cursive', zIndex: 2 } });
  const bubble = h('div', { style: { position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '3px solid #111', borderRadius: '24px', padding: '12px 22px', font: '600 20px "Comic Sans MS",cursive', zIndex: 2 } }, 'I see…');
  const host = h('div', { style: { position: 'absolute', inset: '64px 0 0 0' } }); game.append(host, top, bubble);
  const p = painter(host, { color: '#111', size: 5, onstroke: () => { strokes++; bubble.textContent = strokes < 3 ? `I see ${WORDS.filter((w) => w !== word).slice(strokes, strokes + 2).join(', or ')}…` : `Oh I know, it's ${word}!`; if (strokes >= 3) setTimeout(next, 1200); } });
  function start() { intro.remove(); root.append(game); round = 0; next(); }
  function next() { round++; if (round > 6) { bubble.textContent = 'Well done! 6 / 6 rounds'; clearInterval(tid); return; } word = WORDS[(round * 3) % WORDS.length]; strokes = 0; timer = 20; p.clear(); clearInterval(tid); tid = setInterval(() => { timer--; paint(); if (timer <= 0) next(); }, 1000); paint(); bubble.textContent = 'I see…'; }
  const paint = () => top.replaceChildren(h('span', {}, `Draw: ${word}`), h('span', {}, `${round}/6`), h('span', {}, `00:${String(timer).padStart(2, '0')}`));
  root.append(intro);
  window.__demoProof = async () => { start(); await sleep(80); await scribble(p.cv, 700, 380, 110); await scribble(p.cv, 600, 300, 40, 20); return 'round 1 with 2 strokes, guess bubble live'; };
};
const ICONS = { sun: 'M50 30a20 20 0 1 1 0 40a20 20 0 1 1 0-40M50 5v12M50 83v12M5 50h12M83 50h12M18 18l9 9M73 73l9 9M82 18l-9 9M27 73l-9 9', house: 'M15 50L50 18l35 32M25 45v40h50V45M42 85V62h16v23', star: 'M50 8l12 28 30 3-23 20 7 30-26-16-26 16 7-30L8 39l30-3z', heart: 'M50 85C20 62 8 45 8 30a20 20 0 0 1 42-8a20 20 0 0 1 42 8c0 15-12 32-42 55z', cloud: 'M28 72h46a16 16 0 0 0 0-32a22 22 0 0 0-42-6a18 18 0 0 0-4 38z', tree: 'M50 10L20 55h18L22 75h56L62 55h18zM45 75h10v15H45z', fish: 'M10 50c20-25 50-25 70 0c-20 25-50 25-70 0zM80 50l12-14v28zM28 46a3 3 0 1 0 0 1' };
V['ai-sketch-suggest-replace'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#1a73e8', dark: false });
  const intro = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', background: '#fff', zIndex: 3 } }, h('div', {}, h('div', { style: { fontSize: '64px' } }, '✏️'), h('div', { style: { font: '500 40px Inter Variable' } }, 'AutoDraw'), h('p', { style: { color: '#666' } }, 'Fast drawing for everyone.'), h('div.k-row', { style: { justifyContent: 'center' } }, h('button.k-btn.pri', { style: { background: '#0f9d58' }, onclick: () => intro.remove() }, 'Start Drawing'), btn('How-To', () => {}, 'pri'))));
  const sugg = h('div', { style: { position: 'absolute', top: 0, left: '64px', right: 0, height: '76px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', zIndex: 2, background: '#fff' } }, h('b', { style: { color: '#777', fontSize: '12px' } }, 'Do you mean:'));
  const host = h('div', { style: { position: 'absolute', inset: '76px 0 0 64px' } }); const svg = s('svg', { style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none' }); 
  const p = painter(host, { color: '#222', size: 4, onstroke: (pts) => suggest(pts) }); host.append(svg);
  const rail = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '64px', borderRight: '1px solid #eee', display: 'grid', alignContent: 'start', gap: '8px', padding: '10px 12px' } }, toolRail(p, [['brush', '✦'], ['draw', '✎'], ['text', 'T'], ['fill', '🪣'], ['rect', '▭']]), ['#222', '#e53935', '#fdd835', '#43a047', '#1e88e5'].map((c) => h('span.k-sw', { style: { background: c }, onclick: () => (p.color = c) })));
  let bbox;
  function suggest(pts) { if (!pts || pts.length < 3) return; const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y); bbox = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; const ar = (bbox[2] - bbox[0]) / (bbox[3] - bbox[1] + 1); const order = ar > 1.4 ? ['fish', 'cloud', 'heart', 'house', 'star', 'sun', 'tree'] : ar < 0.7 ? ['tree', 'house', 'star', 'heart', 'sun', 'fish', 'cloud'] : ['sun', 'star', 'heart', 'house', 'cloud', 'tree', 'fish'];
    sugg.replaceChildren(h('b', { style: { color: '#777', fontSize: '12px' } }, 'Do you mean:'), ...order.map((k) => h('button', { style: { width: '56px', height: '56px', border: '1px solid #eee', borderRadius: '8px', background: '#fff' }, onclick: () => place(k) }, s('svg', { viewBox: '0 0 100 100', width: 40, height: 40 }, s('path', { d: ICONS[k], fill: 'none', stroke: '#222', 'stroke-width': 5, 'stroke-linejoin': 'round' }))))); }
  function place(k) { p.undoOnce(); const [x0, y0, x1, y1] = bbox; const sz = Math.max(x1 - x0, y1 - y0); svg.append(s('path', { d: ICONS[k], transform: `translate(${x0},${y0}) scale(${sz / 100})`, fill: 'none', stroke: p.color, 'stroke-width': 4, 'vector-effect': 'non-scaling-stroke' })); toast(`Replaced with ${k}`); }
  root.append(host, sugg, rail, intro);
  window.__demoProof = async () => { intro.remove(); await scribble(p.cv, 0, 0, 0, 40, (t) => [400 + Math.cos(t * 6.3) * 90, 320 + Math.sin(t * 6.3) * 90]); sugg.children[1].click(); await scribble(p.cv, 0, 0, 0, 30, (t) => [800 + t * 200, 360 - Math.sin(t * 3.14) * 80]); return 'stroke→suggest→replaced with icon, second stroke suggestions'; };
};
function makeScene(w, h2) { const c = document.createElement('canvas'); c.width = w; c.height = h2; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, h2); gr.addColorStop(0, '#ffd9c7'); gr.addColorStop(1, '#f7b89d'); g.fillStyle = gr; g.fillRect(0, 0, w, h2); g.fillStyle = '#f2f0ea'; g.fillRect(0, h2 * 0.62, w, h2); g.fillStyle = '#e84a5f'; g.beginPath(); g.ellipse(w * 0.5, h2 * 0.55, w * 0.18, h2 * 0.12, 0, 0, 7); g.fill(); g.fillStyle = '#3a3a3a'; g.fillRect(w * 0.75, h2 * 0.35, w * 0.05, h2 * 0.3); g.fillStyle = '#ffffffaa'; g.font = `bold ${w / 18}px sans-serif`; g.fillText('SALE', w * 0.12, h2 * 0.25); return c; }
V['ai-inpaint-brush-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', ac: '#c8f548', acfg: '#111', dark: false });
  const land = h('div', { style: { position: 'absolute', inset: 0, padding: '50px 110px' } });
  const ed = h('div', { style: { position: 'absolute', inset: 0, display: 'none', background: '#f5f5f5' } });
  land.append(h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 360px', alignItems: 'center' } }, h('h1', { style: { font: '800 48px/1.15 Inter Variable', letterSpacing: '-.03em' } }, 'Remove any unwanted ', h('mark', { style: { background: '#c8f548' } }, 'object'), ', ', h('mark', { style: { background: '#c8f548' } }, 'defect'), ', ', h('mark', { style: { background: '#c8f548' } }, 'people'), ' or ', h('mark', { style: { background: '#c8f548' } }, 'text'), ' from your pictures in seconds'), makeScene(360, 240)),
    h('div', { style: { margin: '30px auto', maxWidth: '700px', height: '130px', border: '3px dashed #111', borderRadius: '14px', display: 'grid', placeItems: 'center', cursor: 'pointer' }, onclick: () => open() }, 'Click here or drag an image file'), h('div', { style: { textAlign: 'center' } }, h('div', { style: { margin: '8px' } }, '→ Try with an example'), h('div.k-row', { style: { justifyContent: 'center' } }, [0, 1, 2, 3].map((i) => h('button', { style: { width: '64px', height: '64px', border: 0, borderRadius: '8px', background: ['#e84a5f', '#8ecae6', '#ffb703', '#2a9d8f'][i] }, onclick: () => open() })))));
  const wrap = h('div', { style: { position: 'absolute', left: '50%', top: '60px', transform: 'translateX(-50%)', width: '900px', height: '560px' } });
  const base = makeScene(900, 560); Object.assign(base.style, { position: 'absolute', inset: 0, borderRadius: '10px' }); wrap.append(base);
  const mask = h('div', { style: { position: 'absolute', inset: 0 } }); wrap.append(mask);
  const p = painter(mask, { color: '#8e54e9', size: 40 }); p.cv.style.opacity = 0.55;
  const orig = makeScene(900, 560); let showOrig = false;
  const bar = h('div.k-row', { style: { position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '10px 16px', borderRadius: '999px', boxShadow: '0 6px 30px #0002' } }, h('span', {}, 'Brush'), slider('', 5, 90, 40, 1, (v) => (p.size = v)), btn('Undo', p.undoOnce), btn('Clean', clean, 'pri'), btn('Original ⇄', () => { showOrig = !showOrig; base.getContext('2d').drawImage(showOrig ? orig : cleaned, 0, 0); }), btn('Download', () => toast('Downloaded (demo)')));
  let cleaned = document.createElement('canvas'); cleaned.width = 900; cleaned.height = 560;
  function clean() { const g = base.getContext('2d'); const m = p.g.getImageData(0, 0, p.cv.width, p.cv.height); const sc = p.cv.width / 900; const img = g.getImageData(0, 0, 900, 560); for (let pass = 0; pass < 30; pass++) for (let y = 1; y < 559; y++) for (let x = 1; x < 899; x++) { const mi = ((Math.floor(y * sc) * p.cv.width) + Math.floor(x * sc)) * 4 + 3; if (m.data[mi] > 10) { const i = (y * 900 + x) * 4; for (let c = 0; c < 3; c++) img.data[i + c] = (img.data[i - 4 + c] + img.data[i + 4 + c] + img.data[i - 3600 + c] + img.data[i + 3600 + c]) / 4; } } g.putImageData(img, 0, 0); cleaned.getContext('2d').drawImage(base, 0, 0); p.clear(); toast('Cleaned ✓'); }
  ed.append(wrap, bar);
  const open = () => { land.style.display = 'none'; ed.style.display = ''; };
  root.append(land, ed, h('div', { style: { position: 'absolute', top: '10px', right: '20px' } }, h('span.k-btn', { style: { background: '#c8f548', borderRadius: '99px' } }, 'Cleanup Pro')));
  window.__demoProof = async () => { open(); await sleep(80); await scribble(p.cv, 0, 0, 0, 30, (t) => [340 + t * 220, 300 + Math.sin(t * 20) * 40]); clean(); return 'mask brushed over object → Clean → inpainted'; };
};
// ---------- vector shape editors (tldraw / excalidraw / flag desk)
function shapeEditor(host, o) {
  const svg = s('svg', { style: 'position:absolute;inset:0;width:100%;height:100%;touch-action:none' }); host.append(svg);
  const st = { tool: 'select', shapes: [], sel: null, color: o.color || '#1d1d1d', fill: o.fill || 'none', rough: o.rough || 0, width: 2.5, onchange: o.onchange };
  const rough = (d) => d;
  function pathOf(sh) {
    const { x, y, w, hh } = sh; const j = (v) => v + (st.rough ? (Math.random() - 0.5) * st.rough : 0);
    if (sh.t === 'rect') return `M${j(x)} ${j(y)}L${j(x + w)} ${j(y)}L${j(x + w)} ${j(y + hh)}L${j(x)} ${j(y + hh)}Z` + (st.rough ? `M${j(x)} ${j(y)}L${j(x + w)} ${j(y)}L${j(x + w)} ${j(y + hh)}L${j(x)} ${j(y + hh)}Z` : '');
    if (sh.t === 'ellipse') { const cx = x + w / 2, cy = y + hh / 2; return `M${cx - w / 2} ${cy}a${w / 2} ${hh / 2} 0 1 0 ${w} 0a${w / 2} ${hh / 2} 0 1 0 ${-w} 0`; }
    if (sh.t === 'diamond') return `M${x + w / 2} ${y}L${x + w} ${y + hh / 2}L${x + w / 2} ${y + hh}L${x} ${y + hh / 2}Z`;
    if (sh.t === 'arrow') { const a = Math.atan2(hh, w); const ex = x + w, ey = y + hh; return `M${x} ${y}L${ex} ${ey}M${ex} ${ey}L${ex - 14 * Math.cos(a - 0.5)} ${ey - 14 * Math.sin(a - 0.5)}M${ex} ${ey}L${ex - 14 * Math.cos(a + 0.5)} ${ey - 14 * Math.sin(a + 0.5)}`; }
    if (sh.t === 'draw') return 'M' + sh.pts.map((q) => q.join(' ')).join('L');
    if (sh.t === 'star') { let d = ''; for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.2 : 0.5; const a = -Math.PI / 2 + (i * Math.PI) / 5; d += (i ? 'L' : 'M') + (x + w / 2 + Math.cos(a) * w * r) + ' ' + (y + hh / 2 + Math.sin(a) * hh * r); } return d + 'Z'; }
    if (sh.t === 'cross') return `M${x + w * 0.4} ${y}h${w * 0.2}v${hh * 0.4}h${w * 0.6}v${hh * 0.2}h${-w * 0.6}v${hh * 0.4}h${-w * 0.2}v${-hh * 0.4}h${-w * 0.4}v${-hh * 0.2}h${w * 0.4}z`;
    return '';
  }
  function render() {
    svg.replaceChildren(...(o.under ? o.under() : []));
    for (const sh of st.shapes) {
      if (sh.t === 'text') { svg.append(s('text', { x: sh.x, y: sh.y + 24, fill: sh.color, 'font-size': 24, 'font-family': o.font || 'Inter Variable', 'data-i': st.shapes.indexOf(sh) }, sh.text)); continue; }
      svg.append(s('path', { d: pathOf(sh), fill: sh.t === 'draw' || sh.t === 'arrow' ? 'none' : sh.fill, stroke: sh.color, 'stroke-width': sh.sw || st.width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'data-i': st.shapes.indexOf(sh), style: 'cursor:move' }));
    }
    if (st.sel) { const { x, y, w, hh } = norm(st.sel); svg.append(s('rect', { class: 'shp-sel', x: x - 4, y: y - 4, width: w + 8, height: hh + 8 }), ...[[x - 4, y - 4], [x + w + 4, y - 4], [x - 4, y + hh + 4], [x + w + 4, y + hh + 4]].map(([a, b]) => s('rect', { class: 'shp-h', x: a - 4, y: b - 4, width: 8, height: 8, rx: 2 })), s('circle', { class: 'shp-h', cx: x + w / 2, cy: y - 22, r: 5 })); }
    st.onchange?.();
  }
  const norm = (sh) => sh.t === 'draw' ? (() => { const xs = sh.pts.map((q) => q[0]), ys = sh.pts.map((q) => q[1]); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), hh: Math.max(...ys) - Math.min(...ys) }; })() : { x: Math.min(sh.x, sh.x + sh.w), y: Math.min(sh.y, sh.y + sh.hh), w: Math.abs(sh.w), hh: Math.abs(sh.hh) };
  svg.addEventListener('pointerdown', (e) => {
    const p0 = localPos(e, svg); svg.setPointerCapture(e.pointerId); const hit = e.target.dataset?.i; let cur, mode;
    if (st.tool === 'select') { if (hit != null) { st.sel = st.shapes[+hit]; mode = 'move'; cur = { ...st.sel, pts: st.sel.pts?.map((q) => q.slice()) }; } else st.sel = null; render(); }
    else if (st.tool === 'text') { const text = o.textPrompt ? o.textPrompt() : 'Text'; st.shapes.push({ t: 'text', x: p0.x, y: p0.y, text, color: st.color }); render(); return; }
    else { cur = { t: st.tool, x: p0.x, y: p0.y, w: 0, hh: 0, color: st.color, fill: st.fill, pts: [[p0.x, p0.y]] }; st.shapes.push(cur); mode = 'create'; }
    const mv = (ev) => { const q = localPos(ev, svg); if (mode === 'move') { const dx = q.x - p0.x, dy = q.y - p0.y; st.sel.x = cur.x + dx; st.sel.y = cur.y + dy; if (st.sel.pts) st.sel.pts = cur.pts.map(([a, b]) => [a + dx, b + dy]); } else if (mode === 'create') { cur.w = q.x - p0.x; cur.hh = q.y - p0.y; if (cur.t === 'draw') cur.pts.push([q.x, q.y]); } render(); };
    const up = () => { svg.removeEventListener('pointermove', mv); svg.removeEventListener('pointerup', up); if (mode === 'create') { st.sel = cur; o.after?.(cur); } render(); };
    svg.addEventListener('pointermove', mv); svg.addEventListener('pointerup', up);
  });
  window.addEventListener('keydown', (e) => { if ((e.key === 'Delete' || e.key === 'Backspace') && st.sel && document.activeElement === document.body) { st.shapes.splice(st.shapes.indexOf(st.sel), 1); st.sel = null; render(); } });
  return Object.assign(st, { svg, render, add: (sh) => { st.shapes.push(sh); render(); } });
}
V['polished-whiteboard-canvas'] = (root, T) => {
  theme(root, T, { bg: '#f9fafb', fg: '#1d1d1d', panel: '#fff', ac: '#2f80ed', dark: false });
  root.style.backgroundImage = 'radial-gradient(#d4d4d8 1px, transparent 1px)'; root.style.backgroundSize = '20px 20px';
  const ed = shapeEditor(root, { color: '#1d1d1d' });
  const tools = [['select', '↖'], ['hand', '✋'], ['draw', '✎'], ['eraser', '⌫'], ['arrow', '↗'], ['text', 'T'], ['note', '🗒'], ['rect', '▭'], ['ellipse', '◯'], ['diamond', '◇'], ['star', '☆']];
  const bar = h('div.tl-bar', { style: { bottom: '14px' } }, tools.map(([t, i]) => h('button', { title: t, class: t === 'select' ? 'on' : '', onclick: (e) => { ed.tool = t === 'note' ? 'rect' : t; bar.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === e.currentTarget)); } }, i)));
  const COLS = ['#1d1d1d', '#9fa8b2', '#e085f4', '#ae3ec9', '#4465e9', '#4ba1f1', '#f1ac4b', '#e16919', '#099268', '#4cb05e', '#f87777', '#e03131'];
  const style = h('div.k-panel', { style: { position: 'absolute', right: '10px', top: '10px', width: '188px', boxShadow: '0 2px 12px #0002', padding: '8px' } }, h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '4px' } }, COLS.map((c) => h('button', { style: { height: '30px', border: 0, background: 'transparent' }, onclick: () => { ed.color = c; if (ed.sel) { ed.sel.color = c; ed.render(); } } }, h('span', { style: { display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', background: c } })))),
    slider('Opacity', 0, 1, 1, 0.1, (v) => (ed.svg.style.opacity = v)), seg([['none', '▢'], ['#e7f0ff', '▣'], ['solid', '■']], 'none', (v) => { ed.fill = v === 'solid' ? ed.color : v; if (ed.sel) { ed.sel.fill = ed.fill; ed.render(); } }), seg([['2', 'S'], ['3.5', 'M'], ['6', 'L'], ['10', 'XL']], '2', (v) => { ed.width = +v; ed.render(); }));
  root.append(bar, style, h('div.k-row', { style: { position: 'absolute', left: '10px', top: '10px' } }, h('span.k-btn', { style: { background: '#fff' } }, 'Page 1 ▾')), h('div', { style: { position: 'absolute', right: '10px', bottom: '14px' } }, h('span.k-btn', { style: { background: '#fff' } }, 'Made with tldraw-ish')));
  window.__demoProof = async () => { ed.tool = 'rect'; await gesture(ed.svg, [[300, 200], [420, 280], [520, 340]]); ed.tool = 'ellipse'; ed.color = '#4465e9'; ed.fill = '#e7f0ff'; await gesture(ed.svg, [[640, 220], [760, 300], [820, 380]]); ed.tool = 'arrow'; await gesture(ed.svg, [[520, 280], [580, 290], [640, 300]]); ed.tool = 'select'; await gesture(ed.svg, [[700, 300], [700, 300]]); return 'rect + ellipse + arrow, ellipse selected with transform handles'; };
};
V['infinite-canvas-toolbar'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#1e1e1e', panel: '#fff', ac: '#6965db', dark: false });
  const ed = shapeEditor(root, { color: '#1e1e1e', rough: 2.2, font: '"Comic Sans MS","Virgil",cursive', textPrompt: () => 'Hand-drawn note' });
  const tools = [['lock', '🔓'], ['hand', '✋'], ['select', '↖'], ['rect', '▭'], ['diamond', '◇'], ['ellipse', '◯'], ['arrow', '→'], ['line', '—'], ['draw', '✎'], ['text', 'A'], ['image', '🖼'], ['eraser', '⌫']];
  const bar = h('div.tl-bar', { style: { top: '14px' } }, tools.map(([t, i], k) => h('button', { title: t, class: t === 'select' ? 'on' : '', onclick: (e) => { ed.tool = t === 'line' ? 'arrow' : t; bar.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === e.currentTarget)); } }, i, h('sub', { style: { fontSize: '8px', opacity: .5 } }, k || ''))));
  const props = h('div.k-panel', { style: { position: 'absolute', left: '14px', top: '70px', width: '200px', boxShadow: '0 2px 12px #0002', display: 'none' } }, h('div.k-h', {}, 'Stroke'), h('div.k-row', {}, ['#1e1e1e', '#e03131', '#2f9e44', '#1971c2', '#f08c00'].map((c) => h('span.k-sw', { style: { background: c, borderRadius: '6px', width: '22px', height: '22px' }, onclick: () => { if (ed.sel) { ed.sel.color = c; ed.render(); } } }))), h('div.k-h', {}, 'Background'), h('div.k-row', {}, ['transparent', '#ffc9c9', '#b2f2bb', '#a5d8ff', '#ffec99'].map((c) => h('span.k-sw', { style: { background: c, borderRadius: '6px', width: '22px', height: '22px', border: '1px solid #ddd' }, onclick: () => { if (ed.sel) { ed.sel.fill = c; ed.render(); } } }))), h('div.k-h', {}, 'Sloppiness'), seg([['0', 'Architect'], ['2.2', 'Artist'], ['5', 'Cartoonist']], '2.2', (v) => { ed.rough = +v; ed.render(); }));
  ed.onchange = () => (props.style.display = ed.sel ? '' : 'none');
  const lib = h('div.k-panel', { style: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '280px', transform: 'translateX(100%)', transition: '.25s', boxShadow: '-4px 0 20px #0001', borderRadius: 0 } }, h('b', {}, 'Library'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' } }, ['rect', 'ellipse', 'diamond', 'star', 'arrow', 'rect'].map((t) => h('button', { style: { aspectRatio: '1', border: '1px dashed #ccc', borderRadius: '8px', background: '#fafafa' }, onclick: () => ed.add({ t, x: 400 + Math.random() * 300, y: 250 + Math.random() * 200, w: 90, hh: 60, color: '#1e1e1e', fill: '#a5d8ff' }) }, t))));
  const welcome = h('div', { style: { position: 'absolute', top: '42%', width: '100%', textAlign: 'center', color: '#6965db', pointerEvents: 'none' } }, h('div', { style: { font: '800 36px Inter Variable', letterSpacing: '.04em' } }, '✎ EXCALIDRAW-ish'), h('div', { style: { color: '#999', fontFamily: 'Comic Sans MS,cursive', marginTop: '8px' } }, 'All your data is saved locally in your browser.'));
  ed.onchange = ((f) => () => { f(); welcome.style.display = ed.shapes.length ? 'none' : ''; })(ed.onchange);
  root.append(welcome, bar, props, lib, h('div.k-row', { style: { position: 'absolute', right: '14px', top: '14px' } }, btn('Share', () => toast('Live collab link copied'), 'pri'), btn('📚 Library', () => (lib.style.transform = lib.style.transform ? '' : 'translateX(100%)'))));
  window.__demoProof = async () => { ed.tool = 'rect'; await gesture(ed.svg, [[360, 260], [480, 330], [560, 380]]); ed.tool = 'diamond'; await gesture(ed.svg, [[700, 240], [800, 320], [860, 400]]); ed.tool = 'arrow'; await gesture(ed.svg, [[560, 320], [620, 320], [700, 320]]); ed.tool = 'text'; await gesture(ed.svg, [[380, 420], [380, 420]]); ed.tool = 'select'; await gesture(ed.svg, [[780, 320], [780, 320]]); return 'rough rect/diamond/arrow/text + properties panel for selection'; };
};
V['heraldic-flag-canvas-desk'] = (root, T) => {
  theme(root, T, { bg: '#eceae4', fg: '#222', panel: '#fff', ac: '#b22234', dark: false });
  const stageW = 780, stageH = 520;
  const st = { field: '#b22234', div: 'none', c2: '#ffffff' };
  const stage = h('div', { style: { position: 'relative', width: stageW + 'px', height: stageH + 'px', boxShadow: '0 20px 50px #0003', background: '#fff' } });
  const under = () => { const f = [s('rect', { x: 0, y: 0, width: stageW, height: stageH, fill: st.field })]; if (st.div === 'bicolor') f.push(s('rect', { x: stageW / 2, y: 0, width: stageW / 2, height: stageH, fill: st.c2 })); if (st.div === 'fess') f.push(s('rect', { x: 0, y: stageH / 3, width: stageW, height: stageH / 3, fill: st.c2 })); if (st.div === 'saltire') f.push(s('path', { d: `M0 0L${stageW} ${stageH}M${stageW} 0L0 ${stageH}`, stroke: st.c2, 'stroke-width': 70 })); if (st.div === 'nordic') f.push(s('path', { d: `M0 ${stageH / 2}H${stageW}M${stageW * 0.36} 0V${stageH}`, stroke: st.c2, 'stroke-width': 80 })); return f; };
  const ed = shapeEditor(stage, { under, color: '#ffffff', fill: '#ffffff' }); ed.width = 0;
  const insp = h('div', { style: { display: 'grid', gap: '8px' } });
  ed.onchange = () => insp.replaceChildren(...(ed.sel ? [h('div.k-h', {}, `Selected: ${ed.sel.t}`), h('input', { type: 'color', value: ed.sel.fill, oninput: (e) => { ed.sel.fill = ed.sel.color = e.target.value; ed.render(); } }), slider('Size', 20, 400, Math.abs(ed.sel.w), 1, (v) => { ed.sel.hh = ed.sel.hh / ed.sel.w * v; ed.sel.w = v; ed.render(); }), btn('Delete', () => { ed.shapes.splice(ed.shapes.indexOf(ed.sel), 1); ed.sel = null; ed.render(); })] : [h('div', { style: { opacity: .6 } }, 'Select a charge to edit')]));
  const addC = (t) => ed.add(Object.assign({ t, x: stageW / 2 - 70, y: stageH / 2 - 70, w: 140, hh: 140, color: '#fff', fill: ['#ffffff', '#ffd700', '#003893'][ed.shapes.length % 3] }));
  const left = panel('Field', h('input', { type: 'color', value: st.field, oninput: (e) => { st.field = e.target.value; ed.render(); } }), h('div.k-h', {}, 'Division'), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' } }, ['none', 'bicolor', 'fess', 'saltire', 'nordic'].map((d) => btn(d, () => { st.div = d; ed.render(); }))), h('input', { type: 'color', value: st.c2, oninput: (e) => { st.c2 = e.target.value; ed.render(); } }), h('div.k-h', {}, 'Charges'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' } }, [['star', '★'], ['ellipse', '●'], ['rect', '■'], ['diamond', '◆'], ['cross', '✚']].map(([t, i]) => btn(i, () => addC(t)))));
  grid(root, '240px 1fr 240px', '1fr', 14).style.padding = '14px';
  root.append(left, h('div', { style: { display: 'grid', placeItems: 'center' } }, stage), panel('Inspector', insp, h('div.k-h', {}, 'Export'), h('div.k-row', {}, btn('SVG', () => copy(new XMLSerializer().serializeToString(ed.svg), 'SVG copied'), 'pri'), btn('PNG', () => toast('PNG export (demo)')))));
  ed.render();
  window.__demoProof = async () => { st.div = 'nordic'; st.field = '#003893'; st.c2 = '#ffd700'; addC('star'); ed.render(); return 'nordic cross + star charge selected'; };
};
V['frame-timeline-animation-studio'] = (root, T) => {
  theme(root, T, { bg: '#2c2c2c', fg: '#ddd', panel: '#373737', ac: '#16a085', dark: true });
  const FR = 12; let cur = 0, playing = false, onion = true; const frames = Array.from({ length: FR }, () => null);
  const stageBox = h('div', { style: { position: 'relative', width: '720px', height: '405px', background: '#fff', boxShadow: '0 0 0 1px #000' } });
  const onionCv = h('canvas', { width: 720, height: 405, style: { position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' } }); stageBox.append(onionCv);
  const p = painter(stageBox, { color: '#16a085', size: 6, onstroke: () => { frames[cur] = p.g.getImageData(0, 0, p.cv.width, p.cv.height); drawTL(); } }); stageBox.append(onionCv);
  const tl = h('div', { style: { display: 'grid', gridTemplateColumns: `90px repeat(${FR},1fr)`, gap: '2px', padding: '8px', fontSize: '11px' } });
  function show(i) { cur = i; p.g.clearRect(0, 0, p.cv.W, p.cv.H); if (frames[i]) p.g.putImageData(frames[i], 0, 0); const og = onionCv.getContext('2d'); og.clearRect(0, 0, 720, 405); const prev = frames[(i - 1 + FR) % FR]; if (onion && prev) { const t = document.createElement('canvas'); t.width = prev.width; t.height = prev.height; t.getContext('2d').putImageData(prev, 0, 0); og.drawImage(t, 0, 0, 720, 405); } drawTL(); }
  function drawTL() { tl.replaceChildren(h('b', {}, 'Layer 1'), ...frames.map((f, i) => h('div', { onclick: () => show(i), style: { height: '28px', background: i === cur ? '#16a085' : f ? '#555' : '#444', borderRadius: '3px', display: 'grid', placeItems: 'center', cursor: 'pointer' } }, f ? '●' : i + 1))); }
  const tick = () => { if (playing) show((cur + 1) % FR); };
  setInterval(tick, 120);
  const rail = h('div', { style: { background: '#252525', padding: '6px' } }, toolRail(p, [['select', '↖'], ['brush', '🖌'], ['pencil', '✎'], ['eraser', '▯'], ['fill', '🪣'], ['rect', '▭'], ['ellipse', '◯'], ['line', '╱'], ['picker', '💧']]));
  root.style.display = 'grid'; root.style.gridTemplateColumns = '48px 1fr 240px'; root.style.gridTemplateRows = '32px 1fr 150px';
  root.append(h('div', { style: { gridColumn: '1/-1', background: '#1f1f1f', display: 'flex', gap: '14px', alignItems: 'center', padding: '0 12px' } }, h('b', {}, 'Wick-ish Editor'), 'File', 'Edit', 'Help', h('span', { style: { flex: 1 } }), 'Project ▾'), rail,
    h('div', { style: { display: 'grid', placeItems: 'center', background: '#3a3a3a' } }, stageBox),
    panel('Inspector', h('div', {}, 'Frame ', h('b', {}, 'selected')), slider('Brush size', 1, 40, 6, 1, (v) => (p.size = v)), h('input', { type: 'color', value: '#16a085', oninput: (e) => (p.color = e.target.value) }), toggle('Onion skin', true, (v) => { onion = v; show(cur); }), slider('FPS', 1, 24, 8, 1, () => {})),
    h('div', { style: { gridColumn: '1/-1', background: '#262626', borderTop: '1px solid #111' } }, h('div.k-row', { style: { padding: '6px 8px' } }, btn('⏮', () => show(0)), btn('▶ Play', (e) => { playing = !playing; e.target.textContent = playing ? '⏸ Pause' : '▶ Play'; }, 'pri'), btn('⏭', () => show(FR - 1)), btn('+ Frame', () => show(Math.min(FR - 1, cur + 1)))), tl));
  drawTL();
  window.__demoProof = async () => { await sleep(50); for (let i = 0; i < 3; i++) { show(i); await scribble(p.cv, 0, 0, 0, 20, (t) => [150 + i * 150 + Math.cos(t * 6.3) * 50, 200 + Math.sin(t * 6.3) * 50]); } show(3); show(2); return 'drew 3 frames, onion skin visible on frame 3'; };
};

V['bomomo-generative-brush-desk'] = (root, T) => {
  theme(root, T, { bg: '#c8c8c8', fg: '#222', panel: '#d8d8d8', ac: '#f0e070', dark: false, line: '#999' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'system-ui, sans-serif';

  const BRUSHES = [
    { id: 'orbit', label: 'Orbit', icon: '◎' },
    { id: 'sprout', label: 'Sprout', icon: '✶' },
    { id: 'ribbon', label: 'Ribbon', icon: '∿' },
    { id: 'stamp', label: 'Stamp', icon: '◍' },
    { id: 'scatter', label: 'Scatter', icon: '∷' },
    { id: 'mirror', label: 'Mirror', icon: '☯' },
    { id: 'propeller', label: 'Prop', icon: '✱' },
    { id: 'wave', label: 'Wave', icon: '≈' },
  ];
  let bi = 0;
  const COLORS = ['#222', '#e0457b', '#2d8ceb', '#16a085', '#f39c12', '#8e44ad', '#1abc9c', '#c0392b'];
  let color = COLORS[0];

  const stage = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%,-50%)',
      width: 'min(860px, 92%)', height: 'min(480px, 62%)',
      background: '#fff', boxShadow: '0 2px 0 #0002, 0 12px 40px #0002',
      border: '1px solid #bbb',
    },
  });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0, touchAction: 'none', cursor: 'crosshair' } });
  stage.append(cv);
  root.append(stage);

  let g, drawing = false, last = null, particles = [];

  const resize = () => {
    const snap = g && cv.width ? g.getImageData(0, 0, cv.width, cv.height) : null;
    fitCanvas(cv, stage);
    g = cv.g;
    g.fillStyle = '#fff';
    g.fillRect(0, 0, cv.W, cv.H);
    if (snap) try { g.putImageData(snap, 0, 0); } catch {}
  };
  resize();
  new ResizeObserver(resize).observe(stage);

  const spawn = (x, y, dx, dy) => {
    const b = BRUSHES[bi].id;
    const spd = Math.hypot(dx, dy) || 1;
    if (b === 'orbit') {
      for (let i = 0; i < 3; i++) {
        const a = Math.random() * 7;
        particles.push({ kind: 'orb', x, y, r: 8 + Math.random() * 18, a, da: 0.08 + Math.random() * 0.1, life: 1, c: color });
      }
    } else if (b === 'sprout') {
      particles.push({ kind: 'sprout', x, y, vx: dx * 0.2, vy: dy * 0.2 - 1.2, life: 1, c: color, len: 10 + Math.random() * 20 });
    } else if (b === 'ribbon') {
      g.strokeStyle = color; g.lineWidth = 2 + spd * 0.15; g.lineCap = 'round';
      g.globalAlpha = 0.55;
      g.beginPath(); g.moveTo(x - dy * 0.4, y + dx * 0.4); g.lineTo(x + dy * 0.4, y - dx * 0.4); g.stroke();
      g.globalAlpha = 1;
      particles.push({ kind: 'ribbon', x, y, life: 0.6, c: color });
    } else if (b === 'stamp') {
      g.strokeStyle = color; g.lineWidth = 1.5; g.globalAlpha = 0.7;
      g.beginPath(); g.arc(x, y, 6 + Math.random() * 10, 0, 7); g.stroke();
      g.globalAlpha = 1;
    } else if (b === 'scatter') {
      g.fillStyle = color;
      for (let i = 0; i < 8; i++) {
        const a = Math.random() * 7, r = Math.random() * 16;
        g.globalAlpha = 0.5 + Math.random() * 0.5;
        g.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r, 2, 2);
      }
      g.globalAlpha = 1;
    } else if (b === 'mirror') {
      const cx = cv.W / 2, cy = cv.H / 2;
      g.fillStyle = color; g.globalAlpha = 0.65;
      for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        g.beginPath(); g.arc(cx + (x - cx) * sx, cy + (y - cy) * sy, 3, 0, 7); g.fill();
      }
      g.globalAlpha = 1;
    } else if (b === 'propeller') {
      particles.push({ kind: 'prop', x, y, a: Math.random() * 7, life: 1, c: color });
    } else if (b === 'wave') {
      g.strokeStyle = color; g.lineWidth = 1.4; g.globalAlpha = 0.6;
      g.beginPath();
      for (let i = 0; i < 12; i++) {
        const px = x + i * 3, py = y + Math.sin(i * 0.8 + x * 0.05) * 6;
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
      }
      g.stroke(); g.globalAlpha = 1;
    }
  };

  const onDown = (e) => {
    drawing = true; last = localPos(e, cv);
    cv.setPointerCapture(e.pointerId);
    spawn(last.x, last.y, 0, 0);
  };
  const onMove = (e) => {
    if (!drawing) return;
    const p = localPos(e, cv);
    const dx = p.x - last.x, dy = p.y - last.y;
    // interpolate
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.floor(dist / 4));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      spawn(last.x + dx * t, last.y + dy * t, dx, dy);
    }
    last = p;
  };
  const onUp = () => { drawing = false; last = null; };
  cv.addEventListener('pointerdown', onDown);
  cv.addEventListener('pointermove', onMove);
  cv.addEventListener('pointerup', onUp);

  const tick = () => {
    // animate living particles onto canvas
    if (g) {
      for (const p of particles) {
        p.life -= 0.02;
        if (p.kind === 'orb') {
          p.a += p.da;
          const ox = p.x + Math.cos(p.a) * p.r, oy = p.y + Math.sin(p.a) * p.r;
          g.strokeStyle = p.c; g.globalAlpha = Math.max(0, p.life) * 0.5; g.lineWidth = 1.2;
          g.beginPath(); g.arc(ox, oy, 2.5, 0, 7); g.stroke();
          g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(ox, oy); g.stroke();
          g.globalAlpha = 1;
        } else if (p.kind === 'sprout') {
          p.x += p.vx; p.y += p.vy; p.vy += 0.05;
          g.strokeStyle = p.c; g.globalAlpha = Math.max(0, p.life); g.lineWidth = 1.5;
          g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - p.vx * 2, p.y - p.vy * 2); g.stroke();
          g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, 2, 0, 7); g.fill();
          g.globalAlpha = 1;
        } else if (p.kind === 'prop') {
          p.a += 0.2;
          g.strokeStyle = p.c; g.globalAlpha = Math.max(0, p.life) * 0.7; g.lineWidth = 1.3;
          for (let k = 0; k < 3; k++) {
            const a = p.a + k * 2.094;
            g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + Math.cos(a) * 14, p.y + Math.sin(a) * 14); g.stroke();
          }
          g.globalAlpha = 1;
        }
      }
      particles = particles.filter((p) => p.life > 0);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const rail = h('div', {
    style: {
      position: 'absolute', left: '50%', bottom: '28px', transform: 'translateX(-50%)',
      display: 'flex', gap: '4px', alignItems: 'center', zIndex: 5,
      background: '#d0d0d0', padding: '6px 8px', border: '1px solid #999',
      boxShadow: 'inset 1px 1px 0 #fff8, 0 2px 8px #0002',
    },
  });
  const brushBtns = [];
  const paintRail = () => {
    rail.replaceChildren(
      ...BRUSHES.map((b, i) => {
        const el = h('button', {
          title: b.label,
          style: {
            width: '36px', height: '36px', border: '1px solid #888', cursor: 'pointer',
            background: i === bi ? '#f0e070' : '#ececec', fontSize: '16px',
            boxShadow: i === bi ? 'inset 1px 1px 0 #0003' : 'inset 1px 1px 0 #fff',
          },
          onclick: () => { bi = i; paintRail(); },
        }, b.icon);
        brushBtns[i] = el;
        return el;
      }),
      h('span', { style: { width: '8px' } }),
      ...COLORS.map((c) => h('button', {
        style: { width: '18px', height: '18px', background: c, border: color === c ? '2px solid #111' : '1px solid #666', cursor: 'pointer', padding: 0 },
        onclick: () => { color = c; paintRail(); },
      })),
      h('span', { style: { width: '8px' } }),
      h('button', {
        title: 'Clear',
        style: { width: '36px', height: '36px', border: '1px solid #888', background: '#ececec', cursor: 'pointer', fontSize: '14px' },
        onclick: () => { g.fillStyle = '#fff'; g.fillRect(0, 0, cv.W, cv.H); particles = []; toast('cleared'); },
      }, '⌫'),
      h('button', {
        title: 'Save PNG',
        style: { width: '36px', height: '36px', border: '1px solid #888', background: '#ececec', cursor: 'pointer', fontSize: '14px' },
        onclick: () => { const a = h('a', { download: 'bomomo-ish.png', href: cv.toDataURL('image/png') }); a.click(); },
      }, '⬇'),
    );
  };
  paintRail();

  const tip = h('div', {
    style: { position: 'absolute', top: '14px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', opacity: .55, zIndex: 3 },
  }, 'generative brushes · drag to paint');

  root.append(rail, tip);

  window.__demoProof = async () => {
    const before = bi;
    resize();
    for (let b = 0; b < 4; b++) {
      bi = b; paintRail();
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        pts.push([180 + b * 140 + Math.cos(t * 9) * 50, 160 + Math.sin(t * 7) * 40 + b * 20]);
      }
      await gesture(cv, pts, 2);
      await sleep(40);
    }
    bi = before; paintRail();
    return '4 generative brushes stroked, restored brush index';
  };
};

V['sketchtoy-replay-sketch-stage'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#e85a3c', dark: false });
  root.style.fontFamily = 'system-ui,sans-serif';
  root.style.overflow = 'hidden';

  const COLORS = ['#111111', '#e85a3c', '#2d8ceb', '#16a085', '#f1c40f', '#8e44ad', '#e91e63', '#95a5a6'];
  let color = COLORS[0];
  let size = 3;
  let vibration = 1;
  let eraser = false;
  let strokes = []; // {color,size,vib,eraser,points:[{x,y,t}]}
  let cur = null;
  let undoStack = [];
  let replaying = false;
  let raf = null;

  const header = h('div', {
    style: {
      height: '44px', background: '#111', color: '#fff', display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: '14px', fontSize: '13px',
    },
  },
    h('span', { style: { font: "700 18px 'Comic Sans MS',cursive", letterSpacing: '.02em' } }, '✎ Sketch Toy'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: .55, fontSize: '12px' } }, 'shaky-line replay stage'),
  );

  const tb = h('div', {
    style: { display: 'flex', gap: '8px', padding: '10px 16px', alignItems: 'center', flexWrap: 'wrap', background: '#fafafa', borderBottom: '1px solid #eee' },
  });

  const stage = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-46%)',
      width: 'min(920px, 94%)', height: 'min(520px, 68%)',
      background: '#fff', border: '1px solid #c5d5e0', boxShadow: '0 4px 24px #0001',
      backgroundImage: 'linear-gradient(#e8f0f8 1px, transparent 1px), linear-gradient(90deg, #e8f0f8 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    },
  });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0, touchAction: 'none', cursor: 'crosshair' } });
  stage.append(cv);
  let g;

  const resize = () => {
    fitCanvas(cv, stage);
    g = cv.g;
    redraw(0);
  };

  const jitter = (p, vib, seed) => {
    if (!vib) return p;
    const a = Math.sin(seed * 12.9898) * 43758.5453;
    const b = Math.sin(seed * 78.233) * 43758.5453;
    return { x: p.x + (a - Math.floor(a) - 0.5) * vib * 0.9, y: p.y + (b - Math.floor(b) - 0.5) * vib * 0.9 };
  };

  const drawStroke = (st, tMax = Infinity, frameSeed = 0) => {
    if (!st.points.length) return;
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.globalCompositeOperation = st.eraser ? 'destination-out' : 'source-over';
    g.strokeStyle = st.color;
    g.lineWidth = st.size;
    g.globalAlpha = st.eraser ? 1 : 1;
    g.beginPath();
    let started = false;
    st.points.forEach((p, i) => {
      if (p.t > tMax) return;
      const q = jitter(p, st.vib, frameSeed + i * 17 + p.t * 0.01);
      if (!started) { g.moveTo(q.x, q.y); started = true; }
      else g.lineTo(q.x, q.y);
    });
    g.stroke();
    g.globalCompositeOperation = 'source-over';
  };

  const clearCanvas = () => {
    g.fillStyle = '#ffffff00';
    g.clearRect(0, 0, cv.W, cv.H);
    // grid shows through via stage bg; keep canvas transparent
  };

  const redraw = (frameSeed = 0) => {
    if (!g) return;
    g.clearRect(0, 0, cv.W, cv.H);
    for (const st of strokes) drawStroke(st, Infinity, frameSeed);
  };

  const paintTb = () => {
    const mk = (label, bg, onClick, active) => h('button', {
      style: {
        padding: '8px 14px', borderRadius: '8px', border: '0', cursor: 'pointer',
        background: bg, color: '#fff', fontWeight: 700, fontSize: '12px', letterSpacing: '.04em',
        boxShadow: active ? 'inset 0 2px 4px #0004' : '0 2px 0 #0002',
        outline: active ? '2px solid #111' : 'none',
      },
      onclick: onClick,
    }, label);

    const sizeBtn = mk(`SIZE: ${size}`, '#e85a3c', () => {
      size = size >= 12 ? 1 : size + 1; paintTb();
    });
    const vibBtn = mk(`VIBRATION: ${vibration}`, '#e85a3c', () => {
      vibration = vibration >= 20 ? 0 : vibration + 1; paintTb();
    });

    tb.replaceChildren(
      mk('NEW', '#7cb342', () => {
        if (replaying) return;
        undoStack.push(strokes.map((s) => ({ ...s, points: s.points.slice() })));
        strokes = []; redraw(); toast('new sketch');
      }),
      mk('SAVE', '#7cb342', () => { startReplay(); }),
      mk('UNDO', '#e85a3c', () => {
        if (replaying) return;
        if (strokes.length) { strokes.pop(); redraw(); }
        else if (undoStack.length) { strokes = undoStack.pop(); redraw(); }
      }),
      mk(eraser ? 'BRUSH' : 'ERASE', '#e85a3c', () => { eraser = !eraser; paintTb(); }, eraser),
      sizeBtn,
      vibBtn,
      h('span', { style: { width: '6px' } }),
      ...COLORS.map((c) => h('button', {
        title: c,
        style: {
          width: '22px', height: '22px', borderRadius: '50%', background: c, cursor: 'pointer',
          border: color === c && !eraser ? '2px solid #111' : '1px solid #ccc', padding: 0,
        },
        onclick: () => { color = c; eraser = false; paintTb(); },
      })),
      h('span', { style: { flex: 1 } }),
      mk('REPLAY', '#5c6bc0', () => startReplay()),
    );
  };

  const startReplay = () => {
    if (!strokes.length || replaying) return;
    replaying = true;
    const all = strokes.slice();
    const t0 = all[0]?.points[0]?.t || 0;
    const t1 = Math.max(...all.map((s) => s.points[s.points.length - 1]?.t || 0));
    const dur = Math.max(600, Math.min(4000, (t1 - t0) * 0.6 + 400));
    const start = performance.now();
    cancelAnimationFrame(raf);
    const tick = (now) => {
      const u = Math.min(1, (now - start) / dur);
      const tCut = t0 + (t1 - t0) * u;
      g.clearRect(0, 0, cv.W, cv.H);
      // animate vibration each frame
      const seed = now * 0.05;
      for (const st of all) drawStroke(st, tCut, seed);
      if (u < 1) raf = requestAnimationFrame(tick);
      else { replaying = false; redraw(0); toast('replay done'); }
    };
    g.clearRect(0, 0, cv.W, cv.H);
    raf = requestAnimationFrame(tick);
  };

  cv.addEventListener('pointerdown', (e) => {
    if (replaying) return;
    cv.setPointerCapture(e.pointerId);
    const p = localPos(e, cv);
    cur = {
      color, size, vib: vibration, eraser,
      points: [{ x: p.x, y: p.y, t: performance.now() }],
    };
    strokes.push(cur);
    redraw(0);
    drawStroke(cur, Infinity, 0);
  });
  cv.addEventListener('pointermove', (e) => {
    if (!cur || replaying) return;
    const p = localPos(e, cv);
    cur.points.push({ x: p.x, y: p.y, t: performance.now() });
    // live shaky preview: full redraw with live jitter
    redraw(performance.now() * 0.08);
  });
  cv.addEventListener('pointerup', () => { cur = null; redraw(0); });
  cv.addEventListener('pointercancel', () => { cur = null; });

  paintTb();
  root.append(header, tb, stage);
  resize();
  new ResizeObserver(resize).observe(stage);

  window.__demoProof = async () => {
    const before = { vibration, color, size, strokes: strokes.slice() };
    vibration = 8; color = '#e85a3c'; size = 4; eraser = false; paintTb();
    // programmatic stroke
    const now = performance.now();
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      pts.push({ x: 120 + t * 400, y: 200 + Math.sin(t * 8) * 60, t: now + i * 30 });
    }
    strokes = [{ color: '#e85a3c', size: 4, vib: 8, eraser: false, points: pts }];
    redraw(0);
    await sleep(80);
    startReplay();
    await sleep(500);
    // leave idle ready
    replaying = false; cancelAnimationFrame(raf);
    strokes = [];
    vibration = before.vibration; color = before.color; size = before.size;
    paintTb(); redraw(0);
    return 'drew shaky stroke, replayed briefly, left idle canvas';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['kleki-layered-paint-desk'])(root, T); }
