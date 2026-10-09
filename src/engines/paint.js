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


V['brushie-painterly-canvas'] = (root, T) => {
  theme(root, T, { bg: '#f3e6ef', fg: '#2a2a2a', panel: '#f7f7f7ee', ac: '#e8a0b0', dark: false, line: '#00000014' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';
  root.style.background = 'linear-gradient(90deg, #dfe6ec 0%, #f0dce8 42%, #e8f3ea 100%)';

  let tool = 'pencil';
  let zoom = 100;
  let panX = 0, panY = 0;
  let spacePan = false;
  let peers = 0;
  let connected = true;
  const strokes = [];
  let undostack = [];
  let redostack = [];

  const stage = h('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'crosshair' } });
  const world = h('div', { style: { position: 'absolute', left: '50%', top: '50%', width: '2400px', height: '1600px', margin: '-800px -1200px', transformOrigin: 'center center' } });
  const cv = h('canvas', { width: 2400, height: 1600, style: { width: '2400px', height: '1600px', display: 'block', background: 'transparent' } });
  const g = cv.getContext('2d');
  // subtle scanline texture overlay via CSS on stage
  const texture = h('div', {
    style: {
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .18,
      backgroundImage: 'repeating-linear-gradient(0deg, #fff8 0 1px, transparent 1px 3px)',
    },
  });
  world.append(cv);
  stage.append(world, texture);

  const applyView = () => {
    world.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom / 100})`;
  };
  applyView();

  const redraw = () => {
    g.clearRect(0, 0, 2400, 1600);
    for (const s of strokes) {
      if (!s.points.length) continue;
      g.lineCap = 'round'; g.lineJoin = 'round';
      g.globalCompositeOperation = s.eraser ? 'destination-out' : 'source-over';
      g.strokeStyle = s.color; g.lineWidth = s.size;
      g.beginPath();
      s.points.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      g.stroke();
    }
    g.globalCompositeOperation = 'source-over';
  };

  const toWorld = (e) => {
    const r = stage.getBoundingClientRect();
    const sx = e.clientX - r.left - r.width / 2;
    const sy = e.clientY - r.top - r.height / 2;
    const z = zoom / 100;
    return { x: sx / z - panX / z + 1200, y: sy / z - panY / z + 800 };
  };

  let drawing = null;
  let panning = false;
  let lastPan = null;

  stage.addEventListener('pointerdown', (e) => {
    if (e.button === 1 || tool === 'hand' || spacePan) {
      panning = true; lastPan = { x: e.clientX, y: e.clientY };
      stage.setPointerCapture(e.pointerId);
      return;
    }
    if (tool === 'select') return;
    const p = toWorld(e);
    drawing = {
      color: tool === 'eraser' ? '#000' : '#2a2a2a',
      size: tool === 'eraser' ? 28 : (tool === 'pencil' ? 4 : 3),
      eraser: tool === 'eraser',
      points: [p],
      shape: ['rect', 'circle', 'line', 'arrow'].includes(tool) ? tool : null,
      start: p,
    };
    undostack.push(strokes.map((s) => ({ ...s, points: s.points.slice() })));
    redostack = [];
    if (undostack.length > 40) undostack.shift();
    strokes.push(drawing);
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => {
    if (panning && lastPan) {
      panX += e.clientX - lastPan.x; panY += e.clientY - lastPan.y;
      lastPan = { x: e.clientX, y: e.clientY }; applyView(); return;
    }
    if (!drawing) return;
    const p = toWorld(e);
    if (drawing.shape) {
      drawing.points = [drawing.start];
      if (drawing.shape === 'rect') {
        drawing.points = [
          drawing.start, { x: p.x, y: drawing.start.y }, p, { x: drawing.start.x, y: p.y }, drawing.start,
        ];
      } else if (drawing.shape === 'circle') {
        const cx = (drawing.start.x + p.x) / 2, cy = (drawing.start.y + p.y) / 2;
        const rx = Math.abs(p.x - drawing.start.x) / 2, ry = Math.abs(p.y - drawing.start.y) / 2;
        drawing.points = Array.from({ length: 33 }, (_, i) => {
          const a = (i / 32) * Math.PI * 2;
          return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
        });
      } else if (drawing.shape === 'line') {
        drawing.points = [drawing.start, p];
      } else if (drawing.shape === 'arrow') {
        const ang = Math.atan2(p.y - drawing.start.y, p.x - drawing.start.x);
        const ah = 14;
        drawing.points = [
          drawing.start, p,
          { x: p.x - Math.cos(ang - 0.4) * ah, y: p.y - Math.sin(ang - 0.4) * ah }, p,
          { x: p.x - Math.cos(ang + 0.4) * ah, y: p.y - Math.sin(ang + 0.4) * ah },
        ];
      }
    } else drawing.points.push(p);
    redraw();
  });
  stage.addEventListener('pointerup', () => { drawing = null; panning = false; lastPan = null; });
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey) {
      zoom = clamp(zoom + (e.deltaY < 0 ? 10 : -10), 40, 240);
      zoomLbl.textContent = zoom + '%'; applyView();
    } else {
      panX -= e.deltaX; panY -= e.deltaY; applyView();
    }
  }, { passive: false });
  window.addEventListener('keydown', (e) => { if (e.code === 'Space') { spacePan = true; stage.style.cursor = 'grab'; } });
  window.addEventListener('keyup', (e) => { if (e.code === 'Space') { spacePan = false; stage.style.cursor = tool === 'hand' ? 'grab' : 'crosshair'; } });

  const tools = [
    ['hand', '✥'], ['select', '↖'], ['rect', '□'], ['circle', '○'],
    ['line', '/'], ['arrow', '→'], ['pencil', '✎'], ['eraser', '⌫'],
  ];
  const tb = h('div', {
    style: {
      position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: '2px', background: '#f3f3f3ee', backdropFilter: 'blur(8px)',
      borderRadius: '14px', padding: '5px', boxShadow: '0 4px 20px #0002, 0 0 0 1px #0000000d', zIndex: 4,
    },
  });
  const syncTb = () => {
    tb.replaceChildren(...tools.map(([t, ic]) => h('button', {
      title: t,
      style: {
        width: '40px', height: '40px', border: 0, borderRadius: '10px', fontSize: '16px',
        background: tool === t ? '#e8a0b0' : 'transparent', color: tool === t ? '#fff' : '#333', cursor: 'pointer',
      },
      onclick: () => {
        tool = t; syncTb();
        stage.style.cursor = t === 'hand' ? 'grab' : t === 'select' ? 'default' : 'crosshair';
      },
    }, ic)));
  };
  syncTb();

  const hint = h('div', {
    style: {
      position: 'absolute', top: '68px', left: '50%', transform: 'translateX(-50%)',
      fontSize: '12px', color: '#6a6a6a', zIndex: 3, pointerEvents: 'none',
    },
  }, 'hold mouse wheel or spacebar while dragging, or use the hand tool');

  const status = h('div', {
    style: {
      position: 'absolute', left: '16px', bottom: '16px', display: 'flex', gap: '10px', alignItems: 'center', zIndex: 4,
    },
  });
  const paintStatus = () => {
    status.replaceChildren(
      h('button', {
        style: { background: '#f3f3f3ee', border: '1px solid #0001', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', font: '12px Inter Variable' },
        onclick: () => { strokes.length = 0; redraw(); toast('Room reset'); },
      }, 'Reset room'),
      h('button', {
        style: { background: '#f3f3f3ee', border: '1px solid #0001', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', font: '12px Inter Variable' },
        onclick: () => { connected = true; peers = Math.max(0, peers); paintStatus(); toast('Reconnected'); },
      }, 'Reconnect'),
      h('span', { style: { fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' } },
        h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: connected ? '#3ecf8e' : '#ff5a6e' } }),
        `Room: ${connected ? 'Connected' : 'Offline'}`,
      ),
      h('span', { style: { fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' } },
        h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#5b8def' } }),
        `Peers: ${peers}`,
      ),
    );
  };
  paintStatus();

  const zoomLbl = h('span', { style: { minWidth: '42px', textAlign: 'center', fontSize: '12px' } }, '100%');
  const zoomBox = h('div', {
    style: {
      position: 'absolute', right: '110px', bottom: '16px', display: 'flex', alignItems: 'center', gap: '4px',
      background: '#f3f3f3ee', borderRadius: '12px', padding: '6px 8px', boxShadow: '0 2px 10px #0001', zIndex: 4,
    },
  },
    h('button', { style: { border: 0, background: 'transparent', cursor: 'pointer', fontSize: '14px' }, onclick: () => { zoom = clamp(zoom + 10, 40, 240); zoomLbl.textContent = zoom + '%'; applyView(); } }, '🔍+'),
    zoomLbl,
    h('button', { style: { border: 0, background: 'transparent', cursor: 'pointer', fontSize: '14px' }, onclick: () => { zoom = clamp(zoom - 10, 40, 240); zoomLbl.textContent = zoom + '%'; applyView(); } }, '🔍−'),
  );

  const hist = h('div', {
    style: {
      position: 'absolute', right: '52px', bottom: '16px', display: 'flex', gap: '2px',
      background: '#f3f3f3ee', borderRadius: '12px', padding: '4px', zIndex: 4, boxShadow: '0 2px 10px #0001',
    },
  },
    h('button', {
      style: { width: '36px', height: '36px', border: 0, borderRadius: '9px', background: 'transparent', cursor: 'pointer' },
      onclick: () => {
        if (!undostack.length) return;
        redostack.push(strokes.map((s) => ({ ...s, points: s.points.slice() })));
        const prev = undostack.pop();
        strokes.length = 0; prev.forEach((s) => strokes.push(s)); redraw();
      },
    }, '↶'),
    h('button', {
      style: { width: '36px', height: '36px', border: 0, borderRadius: '9px', background: 'transparent', cursor: 'pointer' },
      onclick: () => {
        if (!redostack.length) return;
        undostack.push(strokes.map((s) => ({ ...s, points: s.points.slice() })));
        const next = redostack.pop();
        strokes.length = 0; next.forEach((s) => strokes.push(s)); redraw();
      },
    }, '↷'),
  );

  const logo = h('div', {
    style: {
      position: 'absolute', right: '16px', bottom: '16px', width: '36px', height: '36px',
      borderRadius: '10px', background: '#e8a0b0', color: '#fff', display: 'grid', placeItems: 'center',
      fontWeight: 800, fontSize: '14px', zIndex: 4, boxShadow: '0 2px 10px #e8a0b055',
    },
  }, 'B');

  const offline = h('div', {
    style: {
      position: 'absolute', left: '50%', bottom: '18px', transform: 'translateX(-50%)',
      background: '#f3f3f3ee', borderRadius: '12px', padding: '10px 14px', fontSize: '12px',
      boxShadow: '0 4px 16px #0002', zIndex: 5, textAlign: 'center',
    },
  },
    h('div', {}, 'App ready to work offline'),
    h('button', {
      style: { marginTop: '6px', border: 0, background: 'transparent', color: '#666', cursor: 'pointer', fontSize: '12px' },
      onclick: () => offline.remove(),
    }, 'Close'),
  );

  root.append(stage, tb, hint, status, zoomBox, hist, logo, offline);

  window.__demoProof = async () => {
    tool = 'pencil'; syncTb();
    const now = performance.now();
    const pts = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      pts.push({ x: 900 + t * 500, y: 700 + Math.sin(t * 9) * 80 });
    }
    undostack.push([]);
    strokes.push({ color: '#2a2a2a', size: 5, eraser: false, points: pts, shape: null });
    redraw();
    await sleep(80);
    tool = 'hand'; syncTb();
    zoom = 120; zoomLbl.textContent = '120%'; applyView();
    await sleep(80);
    peers = 1; paintStatus();
    await sleep(60);
    tool = 'pencil'; syncTb(); zoom = 100; zoomLbl.textContent = '100%'; applyView();
    peers = 0; paintStatus();
    return 'painted stroke, hand/zoom exercised, room status toggled';
  };
};

V['metademolab-animated-drawings-4-step-upload-box-mask-joint-motion-wizard'] = (root, T) => {
  import('@fontsource-variable/plus-jakarta-sans'); import('@fontsource/poppins/600.css'); import('@fontsource/poppins/700.css'); import('@fontsource/lato/400.css'); import('@fontsource/lato/700.css');
  theme(root, T, { bg: '#000', fg: '#fff', ac: '#0f2b52', dark: true });
  const JK = "'Plus Jakarta Sans Variable','Optimistic Display',system-ui,sans-serif", POP = "Poppins,'Optimistic Display',system-ui,sans-serif", LATO = "Lato,system-ui,sans-serif", NAVY = '#0f2b52', TNAVY = '#1f4d84';
  css(`.ad{position:absolute;inset:0;overflow:auto;background:#000;color:#fff;font:400 15px/1.5 ${JK}}
.ad-nav{height:64px;display:flex;align-items:center;padding:0 64px;gap:30px;font:400 15.5px ${JK};color:#8e8e8e}
.ad-nav b{display:flex;align-items:center;gap:6px;color:#d9d9d9;font:600 15px ${JK};margin-right:auto}
.ad-nav a{color:inherit;text-decoration:none;cursor:pointer;display:flex;gap:7px;align-items:center}.ad-nav a:hover{color:#fff}
.ad-hero{max-width:1280px;margin:0 auto;padding:22px 20px 0;display:flex;align-items:center}
.ad-h1{font:400 40px/1.22 ${JK};letter-spacing:-.01em;margin:0}
.ad-h1 span{background:linear-gradient(90deg,#c44f6e,#7a4fd0 32%,#4b63c7 52%,#5f86a8 70%,#b49a69);-webkit-background-clip:text;background-clip:text;color:transparent}
.ad-h1 em{display:block;font-style:normal;color:#bdbdbd}
.ad-try{all:unset;cursor:pointer;margin-left:auto;height:60px;padding:0 31px;border-radius:99px;border:1.5px solid transparent;background:linear-gradient(#000,#000) padding-box,linear-gradient(90deg,#c44f6e,#6e57d4,#b49a69) border-box;color:#d9d9d9;font:400 18px ${JK};transition:color .2s,box-shadow .25s}
.ad-try:hover{color:#fff;box-shadow:0 0 26px #7a4fd055}
.ad-card{max-width:1280px;margin:38px auto 0;border-radius:18px;overflow:hidden;height:560px;position:relative}
.ad-card svg{display:block;width:100%;height:100%}
.ad-foot{max-width:1400px;margin:0 auto;padding:40px 24px 30px;display:flex;gap:18px;font:400 13px ${JK};color:#cfcfcf}.ad-foot span:first-child{margin-right:6px}.ad-foot i{margin-left:auto;font-style:normal}
.ad-ck{position:absolute;left:0;right:0;bottom:0;height:226px;background:#fff;color:#1c1e21;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;font:400 15px/1.55 ${LATO};text-align:center;z-index:6;transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.ad-ck.gone{transform:translateY(105%)}.ad-ck p{margin:0;max-width:540px}.ad-ck a{color:#1d3d73;font-weight:700}
.ad-ck div{display:flex;gap:20px}.ad-ck button{all:unset;cursor:pointer;width:208px;height:36px;border-radius:3px;text-align:center;font:400 14.5px ${LATO};color:#fff;background:#000}.ad-ck button+button{background:#2c63db}
.ad-md{position:absolute;inset:0;background:#000b;display:grid;place-items:center;z-index:8;opacity:0;pointer-events:none;transition:opacity .25s}.ad-md.on{opacity:1;pointer-events:auto}
.ad-mc{width:560px;background:#1b1b1d;border:1px solid #333;border-radius:16px;padding:30px 34px;color:#e6e6e6;transform:translateY(12px);transition:transform .3s}.ad-md.on .ad-mc{transform:none}
.ad-mc h3{margin:0 0 14px;font:600 24px ${JK};color:#fff}.ad-mc ul{margin:0 0 24px;padding-left:20px;font-size:14.5px;line-height:1.6;color:#bdbdbd}.ad-mc li{margin:6px 0}
.ad-mc button{all:unset;cursor:pointer;background:#fff;color:#000;border-radius:99px;padding:11px 34px;font:600 15px ${JK}}
.ad-w{position:absolute;inset:0;overflow:hidden;background:linear-gradient(180deg,#c6d0f2 0%,#bab7e6 35%,#a986c8 75%,#a37ac0 100%);color:#1c1c1c;font:400 15.5px/1.5 ${LATO}}
.ad-w::before{content:'';position:absolute;inset:0;background-image:linear-gradient(#ffffff38 1px,transparent 1px),linear-gradient(90deg,#ffffff38 1px,transparent 1px);background-size:38px 38px;pointer-events:none}
.ad-wave{position:absolute;inset:0;pointer-events:none}
.ad-wh{position:relative;height:64px;display:flex;align-items:center;padding:0 64px;gap:28px;color:${NAVY};font:500 16px ${JK}}
.ad-wh b{font:600 22px ${POP};margin-right:auto;cursor:pointer;letter-spacing:-.005em;color:#19365f}
.ad-wh a{cursor:pointer;display:flex;gap:7px;align-items:center}
.ad-stage{position:absolute;left:50%;top:64px;width:1131px;height:700px;transform-origin:top center}
.ad-left{position:absolute;left:0;top:76px;width:486px;height:614px;background:#fff;border-radius:16px;box-shadow:0 14px 40px #2a1f5a26;display:flex;flex-direction:column;overflow:hidden}
.ad-lc{flex:1;overflow:auto;padding:30px 31px 10px;scrollbar-width:thin}
.ad-sl{font:700 13px ${POP};letter-spacing:.2em;color:#1d1d1d;margin-bottom:6px}
.ad-bar{display:flex;gap:7px;margin-bottom:18px}.ad-bar i{height:4px;border-radius:2px;background:#d6dae2;flex:1;transition:flex .45s cubic-bezier(.2,.7,.2,1),background .3s}.ad-bar i.done{background:${NAVY}}.ad-bar i.cur{flex:4.3;background:${NAVY}}
.ad-t{font:700 30px/1.15 ${POP};color:${TNAVY};margin:0 0 14px;text-transform:uppercase;letter-spacing:.005em}
.ad-p{margin:0 0 18px;color:#2b2b2b}.ad-p b{font-weight:700}
.ad-sh{font:700 14.5px ${POP};letter-spacing:.19em;color:#1d1d1d;margin:24px 0 12px;text-transform:uppercase}
.ad-ex{display:flex;gap:12px;margin:0 6px 4px}
.ad-ex button{all:unset;cursor:pointer;width:112px;height:112px;border:1px solid #2b2b2b;border-radius:9px;background:#fff;display:grid;place-items:center;transition:box-shadow .2s,transform .2s;box-sizing:border-box}
.ad-ex button:hover{transform:translateY(-2px)}.ad-ex button.on{box-shadow:0 0 0 3px ${NAVY};border-color:${NAVY}}
.ad-li{display:flex;gap:10px;margin:0 0 12px;color:#2b2b2b;font-size:14.5px}.ad-li svg{flex:none;margin-top:4px}
.ad-lf{display:flex;gap:12px;padding:14px 31px 22px;border-top:1px solid #eef0f4}
.ad-btn{all:unset;cursor:pointer;flex:1;height:44px;border-radius:6px;text-align:center;font:600 14.5px ${POP};letter-spacing:.06em;text-transform:uppercase;transition:background .2s,opacity .2s}
.ad-btn.pri{background:${NAVY};color:#fff}.ad-btn.pri:hover{background:#18406f}.ad-btn.sec{border:1.5px solid ${NAVY};color:${NAVY};box-sizing:border-box}.ad-btn.sec:hover{background:#eef2f8}
.ad-btn[disabled]{opacity:.35;pointer-events:none}
.ad-tools{display:flex;gap:10px;margin:6px 0 16px}.ad-tools button{all:unset;cursor:pointer;flex:1;height:42px;border:1.5px solid #cfd5df;border-radius:8px;display:flex;gap:8px;align-items:center;justify-content:center;font:600 14px ${POP};color:#333}
.ad-tools button.on{border-color:${NAVY};background:${NAVY};color:#fff}
.ad-rng{display:flex;align-items:center;gap:12px;font:600 13px ${POP};color:#555}.ad-rng input{flex:1;accent-color:${NAVY}}
.ad-mg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.ad-mt canvas{margin-bottom:2px}
.ad-mt{all:unset;cursor:pointer;border:1px solid #d7dbe3;border-radius:9px;padding:6px 4px 7px;display:flex;flex-direction:column;align-items:center;gap:2px;font:600 11.5px ${POP};color:#333;text-align:center;transition:border-color .2s,box-shadow .2s;background:#fff}
.ad-mt small{font:400 10px ${LATO};color:#8a93a3;letter-spacing:.06em;text-transform:uppercase}.ad-mt:hover{border-color:${NAVY}}
.ad-tabs{display:flex;gap:4px;margin:4px 0 14px;border-bottom:1px solid #e3e6ec}.ad-tabs button{all:unset;cursor:pointer;padding:6px 10px 8px;font:600 12.5px ${POP};letter-spacing:.08em;text-transform:uppercase;color:#7b8494;border-bottom:2.5px solid transparent;margin-bottom:-1px}.ad-tabs button.on{color:${NAVY};border-color:${NAVY}}.ad-mt.on{border-color:${NAVY};box-shadow:0 0 0 2px ${NAVY};color:${NAVY}}
.ad-back{position:absolute;left:614px;top:14px;width:527px;height:528px;border-radius:14px;background:${NAVY};transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.ad-right{position:absolute;left:551px;top:76px;width:527px;height:527px;border-radius:14px;background:#fff;box-shadow:0 16px 40px #1b143d33;overflow:hidden}
.ad-right canvas{position:absolute;left:20px;top:20px;touch-action:none}
.ad-tag{position:absolute;left:28px;top:28px;font:600 11px ${POP};letter-spacing:.16em;color:#0f2b52;background:#ffffffd9;border-radius:99px;padding:3px 10px;text-transform:uppercase;z-index:2;pointer-events:none}
.ad-ub{all:unset;cursor:pointer;position:absolute;left:551px;top:628px;width:527px;height:56px;border-radius:6px;background:${NAVY};color:#fff;display:flex;gap:10px;align-items:center;justify-content:center;font:500 14.5px ${LATO};box-shadow:0 8px 20px #0f2b5240}
.ad-ub:hover{background:#18406f}
.ad-ubs{position:absolute;left:551px;top:628px;width:527px;display:flex;gap:12px}.ad-ubs .ad-ub{position:static;flex:1;width:auto}`);
  // ---------------- characters (procedural "hand-drawn" figures over a rig) ----------------
  const D2R = Math.PI / 180, JOINTS = ['head', 'neck', 'hip', 'l_el', 'l_ha', 'r_el', 'r_ha', 'l_kn', 'l_ft', 'r_kn', 'r_ft'];
  const PAR = { neck: 'hip', head: 'neck', l_el: 'neck', l_ha: 'l_el', r_el: 'neck', r_ha: 'r_el', l_kn: 'hip', l_ft: 'l_kn', r_kn: 'hip', r_ft: 'r_kn' };
  const ORDER = ['neck', 'head', 'l_el', 'l_ha', 'r_el', 'r_ha', 'l_kn', 'l_ft', 'r_kn', 'r_ft'];
  const CH = {
    blue: { name: 'Blue friend', rig: { head: [196, 82], neck: [200, 132], hip: [202, 246], l_el: [158, 150], l_ha: [146, 92], r_el: [238, 190], r_ha: [250, 240], l_kn: [186, 304], l_ft: [180, 360], r_kn: [218, 304], r_ft: [226, 360] }, arm: '#59a7d8', leg: '#59a7d8', armW: 17, legW: 20, hand: '#59a7d8', foot: '#3d86bb', torso: '#59a7d8', tw: [34, 40], head: 'blue' },
    astro: { name: 'Astronaut', rig: { head: [206, 96], neck: [200, 152], hip: [194, 236], l_el: [150, 186], l_ha: [112, 218], r_el: [256, 140], r_ha: [302, 104], l_kn: [164, 292], l_ft: [140, 346], r_kn: [236, 286], r_ft: [268, 334] }, arm: '#f1f2f4', leg: '#a9c8ec', armW: 23, legW: 27, hand: '#c9ec6a', foot: '#d6f25a', torso: '#f4f5f7', tw: [58, 56], head: 'astro', ribs: true },
    dog: { name: 'Dog', rig: { head: [200, 108], neck: [200, 166], hip: [200, 246], l_el: [160, 196], l_ha: [136, 234], r_el: [244, 192], r_ha: [282, 168], l_kn: [180, 296], l_ft: [170, 346], r_kn: [220, 296], r_ft: [232, 346] }, arm: '#fbfbfb', leg: '#fbfbfb', armW: 19, legW: 22, hand: '#fbfbfb', foot: '#fbfbfb', torso: '#fbfbfb', tw: [50, 58], head: 'dog', shorts: '#d93a2f' },
  };
  const INK = '#262626';
  const drawChar = (g, P, c, solid) => { const col = (x) => (solid ? '#000' : x); g.lineCap = 'round'; g.lineJoin = 'round';
    const limb = (a, b, e, w, fill) => { g.beginPath(); g.moveTo(...P[a]); g.lineTo(...P[b]); g.lineTo(...P[e]); g.strokeStyle = solid ? '#000' : INK; g.lineWidth = w + (solid ? 8 : 4.5); g.stroke(); g.strokeStyle = col(fill); g.lineWidth = w; g.stroke();
      if (c.ribs && !solid) { g.strokeStyle = '#b7bcc4'; g.lineWidth = 1.6; for (const [p, q] of [[a, b], [b, e]]) for (const t of [0.35, 0.6]) { const x = P[p][0] + (P[q][0] - P[p][0]) * t, y = P[p][1] + (P[q][1] - P[p][1]) * t, L = Math.hypot(P[q][0] - P[p][0], P[q][1] - P[p][1]) || 1, nx = -(P[q][1] - P[p][1]) / L, ny = (P[q][0] - P[p][0]) / L; g.beginPath(); g.moveTo(x - nx * w * 0.42, y - ny * w * 0.42); g.lineTo(x + nx * w * 0.42, y + ny * w * 0.42); g.stroke(); } } };
    const blob = (x, y, rx, ry, rot, fill) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = col(fill); g.fill(); g.strokeStyle = solid ? '#000' : INK; g.lineWidth = solid ? 6 : 2.6; g.stroke(); };
    const foot = (k, f, side) => { const a = Math.atan2(P[f][1] - P[k][1], P[f][0] - P[k][0]); blob(P[f][0] + side * c.legW * 0.35, P[f][1] + 2, c.legW * 0.85, c.legW * 0.5, a - Math.PI / 2, c.foot); };
    // legs
    limb('hip', 'l_kn', 'l_ft', c.legW, c.leg); foot('l_kn', 'l_ft', -1); limb('hip', 'r_kn', 'r_ft', c.legW, c.leg); foot('r_kn', 'r_ft', 1);
    // torso quad
    const [nx0, ny0] = P.neck, [hx, hy] = P.hip, L = Math.hypot(nx0 - hx, ny0 - hy) || 1, px = -(ny0 - hy) / L, py = (nx0 - hx) / L, [wn, wh] = c.tw;
    const quad = () => { g.beginPath(); g.moveTo(nx0 + px * wn / 2, ny0 + py * wn / 2); g.lineTo(nx0 - px * wn / 2, ny0 - py * wn / 2); g.lineTo(hx - px * wh / 2, hy - py * wh / 2); g.lineTo(hx + px * wh / 2, hy + py * wh / 2); g.closePath(); };
    quad(); g.lineWidth = solid ? 22 : 18; g.strokeStyle = solid ? '#000' : INK; g.stroke(); quad(); g.lineWidth = solid ? 22 : 13.5; g.strokeStyle = col(c.torso); g.stroke(); g.fillStyle = col(c.torso); g.fill();
    if (!solid && c.head === 'astro') { const mx = nx0 + (hx - nx0) * 0.45, my = ny0 + (hy - ny0) * 0.45; g.save(); g.translate(mx, my); g.rotate(Math.atan2(hy - ny0, hx - nx0) - Math.PI / 2); g.fillStyle = '#dfe3e8'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.roundRect(-17, -12, 34, 22, 4); g.fill(); g.stroke(); g.fillStyle = '#c9ec6a'; g.beginPath(); g.arc(9, -1, 4, 0, 7); g.fill(); g.fillStyle = '#7d8794'; g.fillRect(-11, -5, 11, 3); g.fillRect(-11, 1, 7, 3); g.strokeStyle = '#9aa3ad'; g.beginPath(); g.moveTo(-26, 34); g.lineTo(26, 34); g.stroke(); g.restore(); }
    if (!solid && c.shorts) { g.save(); g.translate(hx, hy); g.rotate(Math.atan2(hy - ny0, hx - nx0) - Math.PI / 2); g.fillStyle = c.shorts; g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-wh / 2 - 6, -16); g.lineTo(wh / 2 + 6, -16); g.lineTo(wh / 2 + 10, 18); g.lineTo(3, 20); g.lineTo(0, 8); g.lineTo(-3, 20); g.lineTo(-wh / 2 - 10, 18); g.closePath(); g.fill(); g.stroke(); g.restore(); }
    // arms + hands
    for (const sd of ['l', 'r']) { limb('neck', sd + '_el', sd + '_ha', c.armW, c.arm); const a = Math.atan2(P[sd + '_ha'][1] - P[sd + '_el'][1], P[sd + '_ha'][0] - P[sd + '_el'][0]); blob(P[sd + '_ha'][0] + Math.cos(a) * 5, P[sd + '_ha'][1] + Math.sin(a) * 5, c.armW * 0.62, c.armW * 0.55, a, c.hand); }
    // head (rotated with the neck->head bone)
    const ra = Math.atan2(c.rig.head[1] - c.rig.neck[1], c.rig.head[0] - c.rig.neck[0]); const pa = Math.atan2(P.head[1] - P.neck[1], P.head[0] - P.neck[0]);
    g.save(); g.translate(...P.head); g.rotate(pa - ra); const st2 = solid ? '#000' : INK;
    const circ = (x, y, r, f, lw = 2.8) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = col(f); g.fill(); g.strokeStyle = st2; g.lineWidth = solid ? 6 : lw; g.stroke(); };
    if (c.head === 'astro') { circ(0, 0, 47, '#98a4b1'); if (!solid) { g.beginPath(); g.ellipse(6, 4, 31, 23, -0.15, 0, 7); g.fillStyle = '#5b6a7b'; g.fill(); g.strokeStyle = INK; g.lineWidth = 2.4; g.stroke(); g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(4, 2, 20, -2.6, -1.9); g.stroke(); g.fillStyle = '#cfd6de'; g.beginPath(); g.ellipse(-18, -30, 12, 6, -0.5, 0, 7); g.fill(); } }
    else if (c.head === 'blue') { circ(0, 0, 31, '#59a7d8'); if (!solid) { g.strokeStyle = INK; g.lineWidth = 2.6; g.beginPath(); g.moveTo(2, -30); g.quadraticCurveTo(8, -48, 18, -52); g.stroke(); circ(19, -54, 6, '#f2c94c', 2.2); g.fillStyle = INK; g.beginPath(); g.arc(-9, -4, 4, 0, 7); g.arc(10, -4, 4, 0, 7); g.fill(); g.beginPath(); g.arc(1, 6, 10, 0.3, 2.8); g.stroke(); } }
    else { if (!solid) { blob(-40, 4, 13, 26, 0.35, '#222'); blob(40, 4, 13, 26, -0.35, '#222'); } circ(0, 0, 42, '#fbfbfb'); if (!solid) { g.fillStyle = INK; g.beginPath(); g.arc(-14, -2, 4.5, 0, 7); g.arc(14, -2, 4.5, 0, 7); g.fill(); g.beginPath(); g.ellipse(0, 16, 9, 6, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 2.2; g.beginPath(); g.moveTo(0, 22); g.quadraticCurveTo(-8, 30, -14, 26); g.moveTo(0, 22); g.quadraticCurveTo(8, 30, 14, 26); g.stroke();
      g.fillStyle = '#d93a2f'; g.beginPath(); g.arc(0, -26, 30, Math.PI * 1.05, Math.PI * 1.95); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#fff'; g.fillRect(-3, -50, 6, 16); g.fillRect(-8, -45, 16, 6); } }
    g.restore(); };
  // ---------------- motions: absolute bone directions (deg, canvas y-down) ----------------
  const sn = Math.sin, sm = (x) => x * x * (3 - 2 * x);
  const MO = {
    'Hip hop': { cat: 'Dance', f: (t) => { const b = Math.abs(sn(t * 5)), w = sn(t * 2.5); return { root: [14 * w, 10 * b], neck: -90 + 10 * w, head: -90 + 14 * w, l_el: 145 + 28 * sn(t * 5), l_ha: 55 + 28 * sn(t * 5), r_el: 35 - 28 * sn(t * 5 + 1), r_ha: 125 - 28 * sn(t * 5 + 1), l_kn: 100 + 12 * sn(t * 5), l_ft: 80, r_kn: 80 - 12 * sn(t * 5), r_ft: 100 }; } },
    Dab: { cat: 'Dance', f: (t) => { const p = sm(Math.min(1, Math.max(0, (sn(t * 2.4) + 0.4) / 0.8))); const L = (a, b) => a + (b - a) * p; return { root: [0, L(0, 6)], neck: L(-90, -100), head: L(-90, -150), r_el: L(70, -32), r_ha: L(85, -32), l_el: L(110, -150), l_ha: L(95, 5), l_kn: 100, l_ft: 95, r_kn: 80, r_ft: 85 }; } },
    Zombie: { cat: 'Funny', f: (t) => ({ root: [10 * sn(t * 1.25), 4 * Math.abs(sn(t * 2.5))], neck: -84, head: -62 + 8 * sn(t * 2.5), r_el: -4 + 4 * sn(t * 2.5), r_ha: 2 + 8 * sn(t * 2.5 + 1), l_el: 8 + 4 * sn(t * 2.5 + 2), l_ha: 2 + 8 * sn(t * 2.5 + 3), l_kn: 92 + 16 * sn(t * 2.5), l_ft: 100 + 16 * sn(t * 2.5), r_kn: 88 - 16 * sn(t * 2.5), r_ft: 80 - 16 * sn(t * 2.5) }) },
    Boxing: { cat: 'Funny', f: (t) => { const q = sn(t * 6), a = Math.max(0, q), b = Math.max(0, -q); return { root: [0, 4 * sn(t * 12)], neck: -88 + 4 * q, head: -90, r_el: 25 - 25 * a, r_ha: 25 - 25 * a - 115 * (1 - a), l_el: 155 + 25 * b, l_ha: 155 + 25 * b + 115 * (1 - b), l_kn: 106, l_ft: 100, r_kn: 74, r_ft: 80 }; } },
    Jumping: { cat: 'Jumping', f: (t) => { const c = (t % 1.3) / 1.3; const up = c < 0.25 ? 0 : c < 0.85 ? sn(((c - 0.25) / 0.6) * Math.PI) : 0; const cr = c < 0.25 ? sn((c / 0.25) * Math.PI) : c > 0.85 ? sn(((c - 0.85) / 0.15) * Math.PI) : 0; return { root: [0, -90 * up + 22 * cr], neck: -90, head: -90, l_el: 120 + 100 * up, l_ha: 120 + 110 * up, r_el: 60 - 100 * up, r_ha: 60 - 110 * up, l_kn: 100 - 40 * cr, l_ft: 100 + 45 * cr, r_kn: 80 + 40 * cr, r_ft: 80 - 45 * cr }; } },
    'Jumping jacks': { cat: 'Jumping', f: (t) => { const p = (sn(t * 6) + 1) / 2; return { root: [0, -26 * p], neck: -90, head: -90, l_el: 115 + 112 * p, l_ha: 120 + 115 * p, r_el: 65 - 112 * p, r_ha: 60 - 115 * p, l_kn: 95 + 22 * p, l_ft: 95 + 22 * p, r_kn: 85 - 22 * p, r_ft: 85 - 22 * p }; } },
    'Wave hello': { cat: 'Walking', f: (t) => ({ root: [0, 2 * sn(t * 4)], neck: -90 + 3 * sn(t * 2), head: -90 + 7 * sn(t * 2), r_el: -38, r_ha: -78 + 30 * sn(t * 9), l_el: 108, l_ha: 100, l_kn: 98, l_ft: 95, r_kn: 82, r_ft: 85 }) },
    Running: { cat: 'Walking', f: (t) => { const w = sn(t * 9); return { root: [0, -9 * Math.abs(sn(t * 9))], neck: -80, head: -84, l_el: 100 + 45 * w, l_ha: 30 + 45 * w, r_el: 80 - 45 * w, r_ha: 10 - 45 * w, l_kn: 90 + 38 * w, l_ft: 90 + 38 * w + 30 * Math.max(0, -w) + 10, r_kn: 90 - 38 * w, r_ft: 90 - 38 * w + 30 * Math.max(0, w) + 10 }; } },
  };
  const pose = (rig, m, t) => { const o = m ? MO[m].f(t) : {}; const P = { hip: [rig.hip[0] + (o.root?.[0] || 0), rig.hip[1] + (o.root?.[1] || 0)] };
    for (const j of ORDER) { const p = PAR[j], vx = rig[j][0] - rig[p][0], vy = rig[j][1] - rig[p][1], L = Math.hypot(vx, vy); const a = o[j] != null ? o[j] * D2R : Math.atan2(vy, vx); P[j] = [P[p][0] + Math.cos(a) * L, P[p][1] + Math.sin(a) * L]; } return P; };
  // ---------------- state ----------------
  const st = { view: 'home', step: 1, ch: 'astro', box: null, rig: null, tool: 'pen', brush: 16, motion: 'Wave hello', t0: performance.now(), custom: null };
  const mask = h('canvas', { width: 400, height: 400 }), mg = mask.getContext('2d', { willReadFrequently: true });
  const img400 = h('canvas', { width: 400, height: 400 }), ig = img400.getContext('2d', { willReadFrequently: true });
  const cloneRig = (r) => Object.fromEntries(JOINTS.map((j) => [j, [...r[j]]]));
  const TEMPLATE = { head: [0.5, 0.11], neck: [0.5, 0.27], hip: [0.5, 0.56], l_el: [0.3, 0.38], l_ha: [0.14, 0.5], r_el: [0.7, 0.38], r_ha: [0.86, 0.5], l_kn: [0.42, 0.76], l_ft: [0.38, 0.95], r_kn: [0.58, 0.76], r_ft: [0.62, 0.95] };
  const bboxOfMask = () => { const d = mg.getImageData(0, 0, 400, 400).data; let x0 = 400, y0 = 400, x1 = 0, y1 = 0; for (let y = 0; y < 400; y += 2) for (let x = 0; x < 400; x += 2) if (d[(y * 400 + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } return x1 > x0 ? { x: Math.max(0, x0 - 14), y: Math.max(0, y0 - 14), w: Math.min(400, x1 + 14) - Math.max(0, x0 - 14), h: Math.min(400, y1 + 14) - Math.max(0, y0 - 14) } : { x: 60, y: 40, w: 280, h: 330 }; };
  const resetMask = () => { mg.clearRect(0, 0, 400, 400); if (st.custom) { const d = ig.getImageData(0, 0, 400, 400), m = mg.createImageData(400, 400); for (let i = 0; i < d.data.length; i += 4) { const l = (d.data[i] + d.data[i + 1] + d.data[i + 2]) / 3; if (l < 205) { m.data[i] = m.data[i + 1] = m.data[i + 2] = 255; m.data[i + 3] = 255; } } mg.putImageData(m, 0, 0); mg.filter = 'blur(3px)'; mg.drawImage(mask, 0, 0); mg.filter = 'none'; } else { drawChar(mg, CH[st.ch].rig, CH[st.ch], true); } };
  const pickChar = (k) => { st.ch = k; st.custom = null; st.rig = cloneRig(CH[k].rig); resetMask(); st.box = bboxOfMask(); };
  pickChar('astro');
  // ---------------- landing ----------------
  const ad = h('div.ad'); root.append(ad);
  const arrow = () => s('svg', { width: 12, height: 12, viewBox: '0 0 12 12' }, s('path', { d: 'M2 10 10 2M4 2h6v6', stroke: 'currentColor', 'stroke-width': 1.3, fill: 'none' }));
  const metaLogo = () => s('svg', { width: 22, height: 14, viewBox: '0 0 44 28' }, s('path', { d: 'M4 20c0-8 4-15 9-15 4 0 7 4 11 10s6 9 9 9c3 0 5-3 5-8S36 6 32 6c-3 0-5 3-8 7m-7 5c-2 4-4 6-7 6-4 0-6-3-6-6', stroke: '#d9d9d9', 'stroke-width': 3.2, fill: 'none', 'stroke-linecap': 'round' }));
  const star = (cx, cy, r, fill, op = 1) => s('path', { d: `M${cx} ${cy - r}Q${cx + r * 0.14} ${cy - r * 0.14} ${cx + r} ${cy}Q${cx + r * 0.14} ${cy + r * 0.14} ${cx} ${cy + r}Q${cx - r * 0.14} ${cy + r * 0.14} ${cx - r} ${cy}Q${cx - r * 0.14} ${cy - r * 0.14} ${cx} ${cy - r}Z`, fill, opacity: op });
  css(`@keyframes adBob{50%{transform:translateY(-12px)}}@keyframes adWave{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(14deg)}}@keyframes adPen{50%{transform:translate(-8px,6px)}}
.ad-astro{animation:adBob 4.5s ease-in-out infinite}.ad-arm{transform-box:fill-box;transform-origin:10% 90%;animation:adWave 1.6s ease-in-out infinite}.ad-hand{animation:adPen 2.2s ease-in-out infinite}`);
  const hero = s('svg', { viewBox: '0 0 1280 560', preserveAspectRatio: 'xMidYMid slice' },
    s('defs', {}, s('linearGradient', { id: 'adBg', x1: 0, y1: 0, x2: 1, y2: 1 }, s('stop', { offset: 0, 'stop-color': '#f3a19c' }), s('stop', { offset: 0.38, 'stop-color': '#ec8b98' }), s('stop', { offset: 0.62, 'stop-color': '#b2459f' }), s('stop', { offset: 0.84, 'stop-color': '#47309f' }), s('stop', { offset: 1, 'stop-color': '#1b237c' })),
      s('radialGradient', { id: 'adMoon', cx: 0.4, cy: 0.35, r: 0.7 }, s('stop', { offset: 0, 'stop-color': '#fbe1e2' }), s('stop', { offset: 1, 'stop-color': '#f1b6bb' })),
      s('linearGradient', { id: 'adVis', x1: 0, y1: 0, x2: 1, y2: 1 }, s('stop', { offset: 0, 'stop-color': '#a8f3ff' }), s('stop', { offset: 1, 'stop-color': '#2aa5c9' })),
      s('linearGradient', { id: 'adSuit', x1: 0, y1: 0, x2: 1, y2: 1 }, s('stop', { offset: 0, 'stop-color': '#3e64ee' }), s('stop', { offset: 1, 'stop-color': '#1d35b0' })),
      s('filter', { id: 'adGrain' }, s('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.85, numOctaves: 2, stitchTiles: 'stitch' }), s('feColorMatrix', { values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0' }))),
    s('rect', { width: 1280, height: 560, fill: 'url(#adBg)' }), s('circle', { cx: 300, cy: 175, r: 118, fill: 'url(#adMoon)', opacity: 0.9 }), star(1000, 255, 40, '#f5c4d8'), star(185, 500, 90, '#f6b8bf', 0.75), star(1150, 90, 18, '#f7d2e2', 0.7),
    s('g', { class: 'ad-astro' }, s('ellipse', { cx: 520, cy: 520, rx: 120, ry: 18, fill: '#3a1c6a', opacity: 0.25 }),
      s('rect', { x: 395, y: 145, width: 70, height: 150, rx: 26, fill: '#e2577f' }),
      s('path', { d: 'M440 260c-20 60-30 120-18 170l36 8c8-50 18-90 36-120M520 300c30 30 60 60 70 120l-40 14c-14-40-36-64-60-80', fill: 'url(#adSuit)' }),
      s('path', { d: 'M418 430l48 6 4 40c-20 8-46 6-58-6Z M555 432l40-10 22 34c-14 14-40 20-58 12Z', fill: '#121a46' }),
      s('path', { d: 'M420 170c10-30 60-46 110-34 40 10 56 50 46 100-8 40-30 66-80 70-50 4-82-30-84-70-1-24 2-46 8-66Z', fill: 'url(#adSuit)' }),
      s('path', { d: 'M410 250c-30 10-60 30-80 60l26 18c18-22 40-36 64-44Z', fill: 'url(#adSuit)' }), s('path', { d: 'M322 300c-14 8-18 26-8 38 12 12 30 6 36-6 4-12-6-30-28-32Z', fill: '#121a46' }),
      s('g', { class: 'ad-arm' }, s('path', { d: 'M560 190c26-20 40-60 46-96l30 6c-4 44-20 90-60 116Z', fill: 'url(#adSuit)' }), s('path', { d: 'M600 50c-2-12 6-16 10-6l2-14c2-10 12-8 12 2l2-10c2-10 12-8 12 2l0 10c4-8 12-4 10 6l-6 40c-6 14-30 16-40 0Z', fill: '#121a46' }), s('path', { d: 'M650 40l8 30M662 58l10 18', stroke: '#1b2a8a', 'stroke-width': 4, 'stroke-linecap': 'round' })),
      s('circle', { cx: 470, cy: 150, r: 74, fill: 'url(#adSuit)' }), s('path', { d: 'M418 140c0-34 30-52 62-50 30 2 50 24 48 52-2 30-26 44-58 44-30 0-52-16-52-46Z', fill: 'url(#adVis)' }), s('path', { d: 'M440 118c12-14 30-18 44-14', stroke: '#e9fdff', 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none', opacity: 0.8 }),
      s('rect', { x: 432, y: 238, width: 72, height: 66, rx: 6, fill: '#f2c232', transform: 'rotate(-6 468 270)' }), s('path', { d: 'M434 240l70 62M504 240l-36 30', stroke: '#d9a419', 'stroke-width': 3 }), s('path', { d: 'M410 236c40 0 80-6 112-30', stroke: '#f2c232', 'stroke-width': 6, fill: 'none' }),
      s('path', { d: 'M520 300c40 4 60-10 66-20', stroke: '#f2c232', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' })),
    s('g', { class: 'ad-hand' }, s('path', { d: 'M760 400c40-60 120-140 200-150 70-8 140 30 200 90 40 40 80 120 100 220H700c10-60 30-110 60-160Z', fill: '#f1d9c6' }), s('path', { d: 'M820 360c30-10 60-4 80 10M840 420c20 6 40 4 56-6', stroke: '#d9b8a4', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }),
      s('path', { d: 'M560 270l26-8 380 290-20 26Z', fill: '#e8579a' }), s('path', { d: 'M560 270l26-8 6 18Z', fill: '#2a1440' }), s('path', { d: 'M946 552l20-26 14 10-20 26Z', fill: '#f2d24a' }), s('path', { d: 'M780 380c20-30 60-50 90-40 16 6 14 26-4 34-24 10-50 24-70 40Z', fill: '#f6e3d5' })),
    s('rect', { width: 1280, height: 560, filter: 'url(#adGrain)', opacity: 0.55, style: 'mix-blend-mode:overlay' }));
  const consent = h('div.ad-md', {}, h('div.ad-mc', {}, h('h3', {}, 'Before you begin'), h('ul', {}, h('li', {}, 'This is a research demo: the drawing you upload is processed by an AI model to find, segment and rig the character.'), h('li', {}, 'Only upload drawings you made yourself, without personal or identifiable information.'), h('li', {}, 'Uploaded drawings may be used to improve the research, if you allow it later in the flow.'), h('li', {}, 'By continuing you agree to the Terms and the Usage policy.')), h('button', { onclick: () => { consent.classList.remove('on'); go('canvas'); } }, 'Accept')));
  const cookie = h('div.ad-ck', {}, h('p', {}, 'Allow the use of cookies from Meta on this browser? To find out more about the use of cookies, see our ', h('a', {}, 'Privacy Policy'), ' and ', h('a', {}, 'Cookies.')), h('div', {}, h('button', { onclick: () => cookie.classList.add('gone') }, 'Decline'), h('button', { onclick: () => cookie.classList.add('gone') }, 'Accept')));
  const tryBtn = h('button.ad-try', { onclick: () => consent.classList.add('on') }, 'Try it now');
  ad.append(h('div.ad-nav', {}, h('b', {}, metaLogo(), 'Meta'), h('a', {}, 'Blog ', arrow()), h('a', {}, 'AI Demos ', arrow())),
    h('div.ad-hero', {}, h('h1.ad-h1', {}, h('span', {}, 'Animated Drawings'), h('em', {}, 'Transform static sketches into fun animations.')), tryBtn),
    h('div.ad-card', {}, hero), h('div.ad-foot', {}, h('span', {}, '©2024 Meta'), h('span', {}, 'Privacy'), h('span', {}, 'Terms'), h('span', {}, 'Usage'), h('span', {}, 'Cookies'), h('i', {}, 'Feedback ⓘ')));
  root.append(consent, cookie);
  // ---------------- wizard ----------------
  const wz = h('div.ad-w', { style: { display: 'none' } });
  wz.append(s('svg', { class: 'ad-wave', viewBox: '0 0 1440 862', preserveAspectRatio: 'none' }, s('path', { d: 'M0 862V830C180 812 420 800 640 820 860 840 960 790 1010 700 1070 590 1120 420 1250 330 1330 280 1400 290 1440 300V862Z', fill: '#f5f5f7' })));
  const stage = h('div.ad-stage'); wz.append(h('div.ad-wh', {}, h('b', { onclick: () => go('home') }, 'Animated Drawings'), h('a', {}, 'Blog ', arrow()), h('a', {}, 'AI Demos ', arrow())), stage); root.append(wz);
  const left = h('div.ad-left'), lc = h('div.ad-lc'), lf = h('div.ad-lf'); left.append(lc, lf);
  const back = h('div.ad-back'), right = h('div.ad-right'), tag = h('div.ad-tag');
  const SZ = 487, cv = h('canvas', { width: SZ * 2, height: SZ * 2, style: { width: SZ + 'px', height: SZ + 'px' } }), g = cv.getContext('2d'); right.append(cv, tag); tag.style.display = 'none';
  const file = h('input', { type: 'file', accept: 'image/*', style: { display: 'none' }, onchange: (e) => { const f = e.target.files?.[0]; if (f) loadImg(URL.createObjectURL(f)); } });
  const ub = h('button.ad-ub', { onclick: () => file.click() }, s('svg', { width: 16, height: 14, viewBox: '0 0 16 14' }, s('rect', { x: 1, y: 1, width: 14, height: 12, rx: 1.5, fill: 'none', stroke: '#fff', 'stroke-width': 1.5 }), s('path', { d: 'M3 11l3.5-4 2.5 3 2-2 2 3Z', fill: '#fff' }), s('circle', { cx: 11, cy: 4.5, r: 1.3, fill: '#fff' })), 'Upload Photo');
  const ubs = h('div.ad-ubs', {}, h('button.ad-ub', { onclick: () => copy(location.href.split('#')[0] + '#motion=' + encodeURIComponent(st.motion), 'Share link copied') }, '⤴  Share'), h('button.ad-ub', { onclick: () => { const a = h('a', { download: `animated-drawing-${st.motion.replace(/\s+/g, '-').toLowerCase()}.png`, href: cv.toDataURL('image/png') }); a.click(); } }, '⤓  Download frame'));
  stage.append(back, left, right, ub, ubs, file);
  const fit = () => { const k = Math.min(1, (wz.clientWidth - 40) / 1131, (wz.clientHeight - 74) / 700); stage.style.transform = `translateX(calc(-50% + ${Math.round(42 * k)}px)) scale(${k})`; stage.k = k; };
  new ResizeObserver(fit).observe(wz);
  const loadImg = (url) => new Promise((res) => { const im = new Image(); im.onload = () => { ig.fillStyle = '#fff'; ig.fillRect(0, 0, 400, 400); const k = Math.min(360 / im.width, 360 / im.height); ig.drawImage(im, 200 - (im.width * k) / 2, 200 - (im.height * k) / 2, im.width * k, im.height * k); st.custom = true; resetMask(); st.box = bboxOfMask(); st.rig = Object.fromEntries(JOINTS.map((j) => [j, [st.box.x + TEMPLATE[j][0] * st.box.w, st.box.y + TEMPLATE[j][1] * st.box.h]])); skin = null; drawLeft(); res(); }; im.src = url; });
  // view transforms: full drawing or zoomed to the bounding box
  const view = () => { if (st.step === 3 || st.step === 4) { const b = st.box, k = Math.min(SZ / (b.w * 1.12), SZ / (b.h * 1.12), 2.2); return { k, ox: SZ / 2 - (b.x + b.w / 2) * k, oy: SZ / 2 - (b.y + b.h / 2) * k }; } const k = SZ / 400; return { k, ox: 0, oy: 0 }; };
  const toD = (e) => { const r = cv.getBoundingClientRect(), V0 = view(), sc = r.width / SZ; return [((e.clientX - r.left) / sc - V0.ox) / V0.k, ((e.clientY - r.top) / sc - V0.oy) / V0.k]; };
  const drawDrawing = (c2) => { if (st.custom) c2.drawImage(img400, 0, 0); else drawChar(c2, CH[st.ch].rig, CH[st.ch]); };
  const BONES = [['hip', 'l_kn'], ['l_kn', 'l_ft'], ['hip', 'r_kn'], ['r_kn', 'r_ft'], ['hip', 'neck'], ['neck', 'l_el'], ['l_el', 'l_ha'], ['neck', 'r_el'], ['r_el', 'r_ha'], ['neck', 'head']];
  let skin = null;
  const buildSkin = () => { const src = ig.getImageData(0, 0, 400, 400).data, md = mg.getImageData(0, 0, 400, 400).data, R0 = st.rig; const parts = BONES.map(() => new ImageData(400, 400));
    const sd = (x, y, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy || 1; let t = ((x - a[0]) * dx + (y - a[1]) * dy) / l2; t = Math.max(0, Math.min(1, t)); return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); };
    for (let y = 0; y < 400; y++) for (let x = 0; x < 400; x++) { const i = (y * 400 + x) * 4; if (md[i + 3] < 60) continue; const ds = BONES.map(([a, b]) => sd(x, y, R0[a], R0[b])); const mn = Math.min(...ds); ds.forEach((d, k) => { if (d <= mn + 5) { const P = parts[k].data; P[i] = src[i]; P[i + 1] = src[i + 1]; P[i + 2] = src[i + 2]; P[i + 3] = 255; } }); }
    skin = { rig: cloneRig(R0), parts: parts.map((d) => { const c = h('canvas', { width: 400, height: 400 }); c.getContext('2d').putImageData(d, 0, 0); return c; }) }; };
  const renderPosed = (c2, P) => { if (!st.custom) { drawChar(c2, P, CH[st.ch]); return; } if (!skin) buildSkin(); const R0 = skin.rig;
    BONES.forEach(([a, b], k) => { const t0 = Math.atan2(R0[b][1] - R0[a][1], R0[b][0] - R0[a][0]), t1 = Math.atan2(P[b][1] - P[a][1], P[b][0] - P[a][0]); c2.save(); c2.translate(P[a][0], P[a][1]); c2.rotate(t1 - t0); c2.translate(-R0[a][0], -R0[a][1]); c2.drawImage(skin.parts[k], 0, 0); c2.restore(); }); };
  let hover = null, dragK = null, paintPt = null;
  const render = () => { const V0 = view(); g.setTransform(2, 0, 0, 2, 0, 0); g.fillStyle = '#fff'; g.fillRect(0, 0, SZ, SZ); g.save(); g.translate(V0.ox, V0.oy); g.scale(V0.k, V0.k);
    if (st.step === 5) { const t = (performance.now() - st.t0) / 1000, P = pose(st.rig, st.motion, t); const gy = Math.max(st.rig.l_ft[1], st.rig.r_ft[1]) + 16; g.fillStyle = '#0f2b5214'; g.beginPath(); g.ellipse(st.rig.hip[0] + (P.hip[0] - st.rig.hip[0]), gy, 80 * (1 + (P.hip[1] - st.rig.hip[1]) / 300), 10, 0, 0, 7); g.fill(); renderPosed(g, P); }
    else drawDrawing(g);
    if (st.step === 2) { const b = st.box; g.fillStyle = '#0f2b5233'; g.beginPath(); g.rect(-50, -50, 500, 500); g.rect(b.x + b.w, b.y, -b.w, b.h); g.fill(); g.strokeStyle = '#2c63db'; g.lineWidth = 2.4 / V0.k; g.strokeRect(b.x, b.y, b.w, b.h); for (const [x, y] of [[b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.h], [b.x + b.w, b.y + b.h]]) { g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, 7 / V0.k, 0, 7); g.fill(); g.stroke(); } }
    if (st.step === 3) { const tmp = h('canvas', { width: 400, height: 400 }), tg = tmp.getContext('2d'); tg.fillStyle = 'rgba(20,28,60,.5)'; tg.fillRect(0, 0, 400, 400); tg.globalCompositeOperation = 'destination-out'; tg.drawImage(mask, 0, 0); g.drawImage(tmp, 0, 0); const t2 = h('canvas', { width: 400, height: 400 }), t2g = t2.getContext('2d'); t2g.drawImage(mask, 0, 0); t2g.globalCompositeOperation = 'source-in'; t2g.fillStyle = 'rgba(64,140,255,.22)'; t2g.fillRect(0, 0, 400, 400); g.drawImage(t2, 0, 0);
      if (paintPt) { g.strokeStyle = st.tool === 'pen' ? '#2c63db' : '#e5484d'; g.lineWidth = 1.5 / V0.k; g.beginPath(); g.arc(paintPt[0], paintPt[1], st.brush / 2, 0, 7); g.stroke(); } }
    if (st.step === 4) { g.fillStyle = '#ffffff70'; g.fillRect(-50, -50, 500, 500); const R0 = st.rig; g.lineCap = 'round'; for (const [a, b] of BONES) { g.strokeStyle = NAVY; g.lineWidth = 6 / V0.k; g.beginPath(); g.moveTo(...R0[a]); g.lineTo(...R0[b]); g.stroke(); g.strokeStyle = '#fff'; g.lineWidth = 2.4 / V0.k; g.stroke(); }
      for (const j of JOINTS) { const on = j === hover || j === dragK; g.fillStyle = on ? '#ffb020' : '#ff7a2f'; g.strokeStyle = '#fff'; g.lineWidth = 2.5 / V0.k; g.beginPath(); g.arc(R0[j][0], R0[j][1], (on ? 11 : 8) / V0.k, 0, 7); g.fill(); g.stroke(); } }
    g.restore(); };
  const loop = () => { if (!root.isConnected) return; if (st.view === 'canvas' && st.step === 5) render(); thumbs.forEach((tc) => tc.draw()); requestAnimationFrame(loop); };
  // pointer interactions per step
  let grab = null;
  cv.addEventListener('pointermove', (e) => { const [x, y] = toD(e), V0 = view(), tol = 14 / V0.k;
    if (st.step === 4 && !dragK) { hover = JOINTS.find((j) => Math.hypot(st.rig[j][0] - x, st.rig[j][1] - y) < tol) || null; cv.style.cursor = hover ? 'grab' : 'default'; render(); }
    if (st.step === 3) { paintPt = [x, y]; cv.style.cursor = 'none'; if (!grab) render(); }
    if (st.step === 2 && !grab) { const b = st.box, c = [[b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.h], [b.x + b.w, b.y + b.h]].findIndex(([cx, cy]) => Math.hypot(cx - x, cy - y) < tol); cv.style.cursor = c >= 0 ? (c === 0 || c === 3 ? 'nwse-resize' : 'nesw-resize') : x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h ? 'move' : 'default'; } });
  cv.addEventListener('pointerleave', () => { paintPt = null; hover = null; if (st.step !== 5) render(); });
  const dab = (x, y) => { mg.save(); mg.globalCompositeOperation = st.tool === 'pen' ? 'source-over' : 'destination-out'; mg.fillStyle = '#fff'; mg.beginPath(); mg.arc(x, y, st.brush / 2, 0, 7); mg.fill(); mg.restore(); };
  drag(cv, { start: (e) => { const [x, y] = toD(e), V0 = view(), tol = 14 / V0.k;
      if (st.step === 2) { const b = st.box; const c = [[b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.h], [b.x + b.w, b.y + b.h]].findIndex(([cx, cy]) => Math.hypot(cx - x, cy - y) < tol); grab = c >= 0 ? { c, b: { ...b } } : x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h ? { c: 'm', b: { ...b }, x, y } : null; return grab ? undefined : false; }
      if (st.step === 3) { grab = { last: [x, y] }; dab(x, y); render(); return; }
      if (st.step === 4) { dragK = JOINTS.find((j) => Math.hypot(st.rig[j][0] - x, st.rig[j][1] - y) < tol); if (!dragK) return false; cv.style.cursor = 'grabbing'; return; }
      return false; },
    move: (e) => { const [x, y] = toD(e);
      if (st.step === 2 && grab) { const o = grab.b; let x0 = o.x, y0 = o.y, x1 = o.x + o.w, y1 = o.y + o.h; if (grab.c === 'm') { const dx = clamp(x - grab.x, -o.x, 400 - x1), dy = clamp(y - grab.y, -o.y, 400 - y1); x0 += dx; x1 += dx; y0 += dy; y1 += dy; } else { if (grab.c === 0 || grab.c === 2) x0 = clamp(x, 0, x1 - 30); else x1 = clamp(x, x0 + 30, 400); if (grab.c < 2) y0 = clamp(y, 0, y1 - 30); else y1 = clamp(y, y0 + 30, 400); } st.box = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; render(); }
      if (st.step === 3 && grab) { const [lx, ly] = grab.last, n = Math.ceil(Math.hypot(x - lx, y - ly) / 3) || 1; for (let i = 1; i <= n; i++) dab(lx + ((x - lx) * i) / n, ly + ((y - ly) * i) / n); grab.last = [x, y]; paintPt = [x, y]; render(); }
      if (st.step === 4 && dragK) { st.rig[dragK] = [clamp(x, -60, 460), clamp(y, -60, 460)]; skin = null; render(); } },
    end: () => { grab = null; dragK = null; cv.style.cursor = 'default'; if (st.step === 3) skin = null; render(); } });
  // ---------------- left card per step ----------------
  const thumbs = [];
  const charThumb = (k) => { const c = h('canvas', { width: 200, height: 200, style: { width: '100px', height: '100px' } }), cg = c.getContext('2d'); cg.scale(0.5, 0.5); drawChar(cg, CH[k].rig, CH[k]); return c; };
  const motionThumb = (m) => { const c = h('canvas', { width: 140, height: 120, style: { width: '70px', height: '60px' } }), cg = c.getContext('2d'); const rig = CH.blue.rig;
    c.draw = () => { if (!c.isConnected) return; const P = pose(rig, m, (performance.now() - st.t0) / 1000); cg.setTransform(0.3, 0, 0, 0.3, 10, -2); cg.clearRect(-100, -100, 700, 700); cg.lineCap = 'round'; cg.lineJoin = 'round'; cg.strokeStyle = m === st.motion ? NAVY : '#5d6b82'; cg.lineWidth = 16; cg.beginPath(); for (const [a, b] of BONES.slice(0, 9)) { cg.moveTo(...P[a]); cg.lineTo(...P[b]); } cg.stroke(); cg.fillStyle = cg.strokeStyle; cg.beginPath(); cg.arc(P.head[0], P.head[1], 30, 0, 7); cg.fill(); };
    thumbs.push(c); return c; };
  const check = () => s('svg', { width: 14, height: 14, viewBox: '0 0 14 14' }, s('circle', { cx: 7, cy: 7, r: 6, fill: 'none', stroke: TNAVY, 'stroke-width': 1.3 }), s('path', { d: 'M4 7.2l2 2 4-4.2', stroke: TNAVY, 'stroke-width': 1.4, fill: 'none' }));
  const TITLES = ['Upload a drawing', 'Find the character', 'Highlight the character', "Mark the character's joints", 'Add animation'];
  const drawLeft = () => { thumbs.length = 0; const n = st.step;
    const bar = h('div.ad-bar', {}, ...[1, 2, 3, 4].map((k) => h('i', { class: n === 5 || k < n ? 'done' : k === n ? 'cur' : '' })));
    const kids = [h('div.ad-sl', {}, n === 5 ? 'FINAL STEP' : `STEP ${n}/4`), bar, h('h2.ad-t', {}, TITLES[n - 1])];
    if (n === 1) kids.push(h('p.ad-p', {}, 'Upload a drawing of ', h('b', {}, 'ONE'), ' character, where the arms and legs don’t overlap the body (see examples).'), h('div.ad-sh', {}, 'Start with an example'), h('p.ad-p', {}, 'Feel free to try the demo by clicking on one of the following example images.'),
      h('div.ad-ex', {}, ...['blue', 'astro', 'dog'].map((k) => h('button', { class: !st.custom && st.ch === k ? 'on' : '', title: CH[k].name, onclick: () => { pickChar(k); skin = null; drawLeft(); render(); } }, charThumb(k)))),
      h('div.ad-sh', {}, 'Checklist'), ...['Make sure the character is drawn on a white piece of paper without lines, wrinkles, or tears.', 'Make sure the drawing is well lit. To minimize shadows, hold the camera further away and zoom in on the drawing.', 'Don’t include any identifiable information, offensive content (see our community standards), or drawings that infringe on the copyrights of others.'].map((t) => h('div.ad-li', {}, check(), t)));
    if (n === 2) kids.push(h('p.ad-p', {}, 'We’ve identified the character, and put a box around it.'), h('p.ad-p', {}, 'Resize the box to ensure it tightly fits around the character. Drag the corners to resize, or drag inside the box to move it.'), h('div.ad-sh', {}, 'Tip'), h('div.ad-li', {}, check(), 'Leave a little white space around the hands and feet.'), h('button.ad-btn.sec', { style: { display: 'block', width: '100%', marginTop: '14px' }, onclick: () => { st.box = bboxOfMask(); render(); } }, 'Auto-fit box'));
    if (n === 3) { const tb = h('div.ad-tools', {}, ...[['pen', '✎  Pen'], ['eraser', '⌫  Eraser']].map(([k, l]) => h('button', { class: st.tool === k ? 'on' : '', onclick: () => { st.tool = k; drawLeft(); } }, l)));
      kids.push(h('p.ad-p', {}, 'We’ve separated the character from the background, and highlighted it.'), h('p.ad-p', {}, 'If the body parts of your character are not highlighted, use the pen and eraser tools to fix it.'), tb, h('div.ad-rng', {}, 'Size', h('input', { type: 'range', min: 4, max: 44, value: st.brush, oninput: (e) => { st.brush = +e.target.value; } }), h('button.ad-btn.sec', { style: { flex: 'none', width: '96px', height: '34px', fontSize: '12px' }, onclick: () => { resetMask(); skin = null; render(); } }, 'Reset'))); }
    if (n === 4) { const mini = h('canvas', { width: 220, height: 160, style: { width: '110px', height: '80px', display: 'block', margin: '0 auto 6px' } }), mgc = mini.getContext('2d'); mgc.scale(0.5, 0.42); mgc.translate(20, -40); const R0 = CH.blue.rig; mgc.lineCap = 'round'; mgc.strokeStyle = NAVY; mgc.lineWidth = 7; mgc.beginPath(); for (const [a, b] of BONES) { mgc.moveTo(...R0[a]); mgc.lineTo(...R0[b]); } mgc.stroke(); mgc.fillStyle = '#ff7a2f'; for (const j of JOINTS) { mgc.beginPath(); mgc.arc(R0[j][0], R0[j][1], 9, 0, 7); mgc.fill(); }
      kids.push(h('p.ad-p', {}, 'Here are your character’s joints! Here’s an example of what it should look like:'), mini, h('p.ad-p', {}, 'If your character doesn’t have any arms, drag the elbows and wrist joints far away from the character and it can still be animated.'), h('button.ad-btn.sec', { style: { display: 'block', width: '100%' }, onclick: () => { st.rig = st.custom ? Object.fromEntries(JOINTS.map((j) => [j, [st.box.x + TEMPLATE[j][0] * st.box.w, st.box.y + TEMPLATE[j][1] * st.box.h]])) : cloneRig(CH[st.ch].rig); skin = null; render(); } }, 'Reset joints')); }
    if (n === 5) { kids.push(h('p.ad-p', {}, 'Choose one of the motions below to see your character perform it.'));
      const cats = ['All', 'Dance', 'Funny', 'Jumping', 'Walking']; const grid0 = h('div.ad-mg'); const tabs = h('div.ad-tabs');
      const fill = (c) => { st.cat = c; tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent === c)); thumbs.length = 0; grid0.replaceChildren(...Object.keys(MO).filter((m) => c === 'All' || MO[m].cat === c).map((m) => h('button', { class: 'ad-mt' + (m === st.motion ? ' on' : ''), 'data-m': m, onclick: () => { st.motion = m; st.t0 = performance.now(); lc.querySelectorAll('.ad-mt').forEach((b) => b.classList.toggle('on', b.dataset.m === m)); } }, motionThumb(m), m, h('small', {}, MO[m].cat)))); };
      tabs.append(...cats.map((c) => h('button', { onclick: () => fill(c) }, c))); kids.push(tabs, grid0); fill(st.cat || 'All'); }
    lc.replaceChildren(...kids); lc.scrollTop = 0;
    lf.replaceChildren(...(n > 1 ? [h('button.ad-btn.sec', { onclick: () => setStep(n - 1) }, n === 5 ? 'Fix' : 'Previous')] : []), n < 5 ? h('button.ad-btn.pri', { onclick: () => setStep(n + 1) }, 'Next') : h('button.ad-btn.pri', { onclick: () => setStep(1) }, 'Start over'));
    tag.textContent = ['', 'Bounding box', 'Segmentation mask', 'Skeleton', st.motion][n - 1] ? ['', 'Bounding box', 'Segmentation mask', 'Skeleton', ''][n - 1] : '';
    tag.style.display = tag.textContent ? '' : 'none'; ub.style.display = n === 1 ? '' : 'none'; ubs.style.display = n === 5 ? 'flex' : 'none';
    back.style.transform = `translate(${[0, -8, 6, -4, 10][n - 1]}px,${[0, 6, -4, 8, -6][n - 1]}px) rotate(${[0, -1.2, 1, -0.6, 1.4][n - 1]}deg)`; };
  const setStep = (n) => { if (n === 5) { st.t0 = performance.now(); skin = null; } st.step = n; drawLeft(); render(); };
  const go = (v) => { st.view = v; ad.style.display = v === 'home' ? '' : 'none'; wz.style.display = v === 'canvas' ? '' : 'none'; if (v === 'canvas') { cookie.classList.add('gone'); fit(); drawLeft(); render(); } };
  drawLeft(); render(); requestAnimationFrame(loop);
  const maskCount = () => { const d = mg.getImageData(0, 0, 400, 400).data; let c = 0; for (let i = 3; i < d.length; i += 16) if (d[i] > 60) c++; return c; };
  window.__demoProof = async () => { const out = [];
    cookie.querySelector('button+button').click(); tryBtn.click(); await sleep(250); out.push(`consent modal=${consent.classList.contains('on')}`); consent.querySelector('button').click(); await sleep(150);
    lc.querySelectorAll('.ad-ex button')[2].click(); out.push(`example → ${CH[st.ch].name}`); lc.querySelectorAll('.ad-ex button')[1].click();
    lf.querySelector('.pri').click(); await sleep(80); const r = cv.getBoundingClientRect(), V0 = view(), sc = r.width / SZ, px = (x, y) => [(x * V0.k + V0.ox) * sc, (y * V0.k + V0.oy) * sc]; const b0 = { ...st.box };
    await gesture(cv, [px(b0.x + b0.w, b0.y + b0.h), px(b0.x + b0.w + 14, b0.y + b0.h + 8), px(b0.x + b0.w + 22, b0.y + b0.h + 10)]); out.push(`step 2 box ${Math.round(b0.w)}×${Math.round(b0.h)} → ${Math.round(st.box.w)}×${Math.round(st.box.h)}`); st.box = b0;
    lf.querySelector('.pri').click(); await sleep(80); const m0 = maskCount(); st.tool = 'eraser'; const V3 = view(), p3 = (x, y) => [(x * V3.k + V3.ox) * sc, (y * V3.k + V3.oy) * sc]; await gesture(cv, [p3(150, 186), p3(130, 200), p3(112, 218)]); const m1 = maskCount(); st.tool = 'pen'; await gesture(cv, [p3(112, 218), p3(130, 200), p3(150, 186)]); out.push(`step 3 mask eraser ${m0}→${m1}px, pen → ${maskCount()}px`); drawLeft();
    lf.querySelector('.pri').click(); await sleep(80); const V4 = view(), p4 = (x, y) => [(x * V4.k + V4.ox) * sc, (y * V4.k + V4.oy) * sc]; const j0 = [...st.rig.r_ha]; await gesture(cv, [p4(...j0), p4(j0[0] + 10, j0[1] - 6), p4(j0[0] + 16, j0[1] - 10)]); out.push(`step 4 drag wrist (${j0.map(Math.round)}) → (${st.rig.r_ha.map(Math.round)})`); st.rig.r_ha = j0; render();
    lf.querySelector('.pri').click(); await sleep(80); lc.querySelector('[data-m="Dab"]').click(); await sleep(900); const P1 = pose(st.rig, 'Dab', 0.2), P2 = pose(st.rig, 'Dab', 2.0); out.push(`step 5 Dab plays (wrist moves ${Math.round(Math.hypot(P1.r_ha[0] - P2.r_ha[0], P1.r_ha[1] - P2.r_ha[1]))}px)`);
    lc.querySelector('[data-m="Wave hello"]').click(); await sleep(300);
    return out.join('; ') + `; showing final step: ${st.motion} on ${CH[st.ch].name}`; };
};

export function mount(root, variant, opts, T) { (V[variant] || V['kleki-layered-paint-desk'])(root, T); }
