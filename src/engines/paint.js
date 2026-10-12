import { h, s, css, drag, localPos, clamp, copy, toast, gesture, sleep, hsl, hexToRgb, rgbToHex, fitCanvas, pick, rng, fire } from '../lib.js';
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

V['kidpix-retro-mac-paint-tool-column-pattern-option-bar-palette-splash-canvas'] = (root, T) => {
  const fontsP = Promise.all([import('@fontsource/silkscreen/400.css'), import('@fontsource/pixelify-sans/400.css'), import('@fontsource/pixelify-sans/700.css'), import('@fontsource/anton')]).catch(() => {});
  theme(root, T, { bg: '#ffffff', fg: '#000', ac: '#0069ff', dark: false });
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PX = "'Pixelify Sans','Chicago','Geneva',monospace", SK = "'Silkscreen','Pixelify Sans',monospace", POST = "'Anton','Impact',sans-serif";
  css(`.kp{position:absolute;inset:0;background:#fff;color:#000;display:grid;grid-template-columns:calc(var(--u)*36px) calc(var(--u)*36px) 1fr;grid-template-rows:calc(var(--u)*36px) 1fr;user-select:none;-webkit-user-select:none;font:400 calc(var(--u)*9px) ${PX};overflow:hidden}
.kp button{font:inherit;color:inherit;cursor:pointer;padding:0;margin:0;background:#fff}
.kp-chip{grid-row:1;grid-column:1;border-right:1px solid #000;border-bottom:1px solid #000;display:grid;place-items:center;background:#fff}
.kp-chip i{display:block;width:88%;height:88%;border:1px solid #000;box-shadow:inset 0 0 0 1px #fff}
.kp-left{grid-row:2;grid-column:1;border-right:1px solid #000;display:flex;flex-direction:column;overflow:hidden}
.kp-pal{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:calc(var(--u)*18px)}
.kp-pal button{border:0;outline:1px solid #0000;position:relative}.kp-pal button.on::after{content:'';position:absolute;inset:2px;border:1px dotted #fff;mix-blend-mode:difference}
.kp-meta{margin-top:auto;padding:2px 1px 3px;text-align:center;font:400 calc(var(--u)*6.4px) ${PX};border-top:1px solid #000;background:#efefef}
.kp-meta div{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin-top:2px}.kp-meta button{height:calc(var(--u)*15px);border:1px solid #888;font:400 calc(var(--u)*9px) ${PX};display:grid;place-items:center}
.kp-meta button:active,.kp-meta button.flash{background:#000;color:#fff}
.kp-meta svg{width:80%;height:80%}
.kp-tools{grid-row:2;grid-column:2;display:flex;flex-direction:column;border-right:1px solid #000;overflow:hidden}
.kp-save{grid-row:1;grid-column:2;border-right:1px solid #000;border-bottom:1px solid #000;display:grid;place-items:center}
.kp-tool,.kp-save{height:calc(var(--u)*36px);flex:none;border:0!important;border-bottom:1px solid #000!important;display:grid;place-items:center;position:relative}
.kp-tool svg,.kp-save svg,.kp-opt svg{width:72%;height:72%;image-rendering:pixelated}
.kp-tool.on{background:#bdbdbd!important;box-shadow:inset 2px 2px 0 #7a7a7a,inset -1px -1px 0 #fff}
.kp-tool:active,.kp-save:active{background:#000!important}.kp-tool:active svg{filter:invert(1)}
.kp-bar{grid-row:1;grid-column:3;display:flex;align-items:stretch;border-bottom:1px solid #000;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;background:#fff}
.kp-bar::-webkit-scrollbar{display:none}
.kp-grp{display:flex;border-right:1px solid #000;border-left:1px solid #000;margin-right:calc(var(--u)*36px)}.kp-grp:first-child{border-left:0}
.kp-opt{width:calc(var(--u)*36px);flex:none;border:0!important;border-right:1px solid #9a9a9a!important;display:grid;place-items:center;font:700 calc(var(--u)*14px) ${PX}}
.kp-opt:last-child{border-right:0!important}
.kp-opt.on{background:#bdbdbd!important;box-shadow:inset 2px 2px 0 #7a7a7a}
.kp-opt.pat i{display:block;width:70%;height:70%;border:1px solid #000;image-rendering:pixelated;background-size:calc(var(--u)*8px) calc(var(--u)*8px)}
.kp-opt.txt{font:700 calc(var(--u)*15px) ${PX};width:calc(var(--u)*26px)}
.kp-stage{grid-row:2;grid-column:3;position:relative;overflow:hidden;background:#fff;border-top:0}
.kp-cv{position:absolute;left:0;top:0;image-rendering:pixelated;touch-action:none;cursor:crosshair}
.kp-fx{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.kp-truck{position:absolute;top:40%;width:calc(var(--u)*120px);height:calc(var(--u)*70px);image-rendering:pixelated}
.kp-boom{position:absolute;inset:0;background:#fff;animation:kpBoom .5s steps(4) forwards}@keyframes kpBoom{0%{background:#000}50%{background:#ff0}100%{opacity:0}}
.kp-hint{position:absolute;right:8px;bottom:6px;font:400 calc(var(--u)*7px) ${SK};background:#fff;border:1px solid #000;padding:2px 5px;pointer-events:none;opacity:.85}
@media (max-width:640px){.kp-hint{display:none}}
${RM ? '.kp *{animation:none!important;transition:none!important}' : ''}`);
  const el = h('div.kp'); root.append(el);
  const fitU = () => { const w = root.clientWidth, hh = root.clientHeight; el.style.setProperty('--u', clamp(Math.min(w / 1024, hh / 640), 0.78, 1.45).toFixed(3)); };
  fitU();
  // ---------- 1-bit icons (vector at 16px grid, crisp edges) ----------
  const sv = (b) => `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">${b}</svg>`;
  const IC = {
    save: sv('<rect x="2" y="2" width="12" height="12" fill="#000"/><rect x="4" y="2" width="7" height="4" fill="#d9d9d9"/><rect x="8" y="3" width="2" height="2" fill="#000"/><rect x="4" y="8" width="8" height="5" fill="#fff"/><rect x="5" y="9" width="6" height="1" fill="#e00"/><rect x="5" y="11" width="6" height="1" fill="#e00"/>'),
    pencil: sv('<path d="M4 14l-1-3 7-8 3 2-7 8z" fill="#ffd400" stroke="#000"/><path d="M3 11l1 3 2-1z" fill="#f2c08a" stroke="#000"/><path d="M10 3l3 2 1-1-3-2z" fill="#ff7fa8" stroke="#000"/><rect x="3" y="13" width="1" height="1" fill="#000"/>'),
    line: sv('<path d="M2 4L14 12" stroke="#000" stroke-width="1.6"/>'),
    rect: sv('<rect x="2" y="4" width="12" height="8" fill="#888" stroke="#000"/>'),
    oval: sv('<circle cx="8" cy="8" r="5.5" fill="#888" stroke="#000"/>'),
    brush: sv('<path d="M2 3l6 6" stroke="#8a5a2b" stroke-width="2.4"/><path d="M7 8l3-1 3 4-3 3-4-3z" fill="#1aa31a" stroke="#000"/><path d="M11 13l2 2M13 11l2 1" stroke="#000"/><rect x="3" y="12" width="2" height="2" fill="#e00"/><rect x="1" y="9" width="1" height="1" fill="#e00"/>'),
    bucket: sv('<path d="M3 7l5-5 6 6-5 5z" fill="#ddd" stroke="#000"/><path d="M3 7l6 6" stroke="#000"/><path d="M2 8c-2 3 0 5 1 5s2-2 1-4z" fill="#ffd400" stroke="#000"/><path d="M5 4l-1-2" stroke="#000"/>'),
    eraser: sv('<path d="M2 10l6-6 6 4-6 6z" fill="#ff5a6a" stroke="#000"/><path d="M2 10l6 4v1l-6-4z" fill="#b8202e" stroke="#000"/><path d="M8 4l6 4" stroke="#fff"/>'),
    text: sv('<path d="M3 14L7 2h2l4 12h-3l-1-3H7l-1 3zM7.6 8.6h1.6L8.4 5.6z" fill="#000"/>'),
    stamp: sv('<circle cx="8" cy="3.5" r="2.5" fill="#000"/><rect x="7" y="5" width="2" height="4" fill="#000"/><rect x="3" y="9" width="10" height="3" fill="#ffd400" stroke="#000"/><rect x="2" y="12" width="12" height="2" fill="#000"/>'),
    truck: sv('<rect x="1" y="4" width="9" height="7" fill="#e00" stroke="#000"/><path d="M10 6h3l2 3v2h-5z" fill="#e00" stroke="#000"/><rect x="11" y="7" width="2" height="2" fill="#fff"/><circle cx="4" cy="12.5" r="1.8" fill="#000"/><circle cx="12" cy="12.5" r="1.8" fill="#000"/><rect x="2" y="5" width="7" height="1" fill="#ff9"/>'),
    face: sv('<circle cx="8" cy="8" r="6.5" fill="#f2c08a" stroke="#000"/><rect x="5" y="5" width="2" height="2" fill="#000"/><rect x="9" y="5" width="2" height="2" fill="#000"/><path d="M5 10q3 3 6 0" fill="none" stroke="#e00" stroke-width="1.2"/><path d="M4 3l1 1M12 3l-1 1M8 1v1" stroke="#000"/>'),
    left: sv('<path d="M2 8l5-4v3h7v2H7v3z" fill="#000"/>'), right: sv('<path d="M14 8l-5-4v3H2v2h7v3z" fill="#000"/>'),
    help: sv('<path d="M8 1l7 7-7 7-7-7z" fill="#000"/><path d="M6 6q0-2 2-2t2 2-2 2v1" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="7.2" y="10.5" width="1.6" height="1.6" fill="#fff"/>'),
    splash: sv('<circle cx="8" cy="8" r="6.5" fill="#fff" stroke="#000"/><circle cx="8" cy="8" r="3.5" fill="#0069ff" stroke="#000"/><circle cx="8" cy="8" r="1.2" fill="#000"/>'),
    dice: sv('<rect x="2" y="2" width="12" height="12" rx="2" fill="#ff8040" stroke="#000"/><rect x="4" y="4" width="2" height="2"/><rect x="10" y="10" width="2" height="2"/><rect x="7" y="7" width="2" height="2"/><rect x="10" y="4" width="2" height="2"/><rect x="4" y="10" width="2" height="2"/>'),
  };
  // ---------- 8x8 dither patterns ----------
  const PF = [(x, y) => 1, (x, y) => (x + y) % 2 === 0, (x, y) => x % 4 === 0 && y % 2 === 0 || (x + 2) % 4 === 0 && y % 2 === 1 && 0, (x, y) => (x % 4 === 0 && y % 4 === 0) || (x % 4 === 2 && y % 4 === 2),
    (x, y) => y % 2 === 0, (x, y) => x % 2 === 0, (x, y) => (x + y) % 4 === 0, (x, y) => (x - y + 8) % 4 === 0, (x, y) => x % 4 === 0 || y % 4 === 0,
    (x, y) => y % 4 === 0 || (y < 4 ? x === 0 : x === 4), (x, y) => (x + y) % 4 === 0 || (x - y + 8) % 4 === 0, (x, y) => !((x % 4 === 0 && y % 2 === 0)), (x, y) => Math.round(Math.sin(x / 8 * 6.283) * 1.6 + 3) === y % 6 || Math.round(Math.sin(x / 8 * 6.283) * 1.6 + 3) === y % 6 + 1 && 0,
    (x, y) => { const dx = (x % 8) - 4, dy = (y % 4) * 2 - 1; return Math.abs(Math.hypot(dx, dy) - 3.5) < 0.8; }, (x, y) => (y % 4) === Math.abs((x % 8) - 4) % 4, (x, y) => Math.abs((x % 8) - 3.5) + Math.abs((y % 8) - 3.5) === 3, (x, y) => ((x >> 2) + (y >> 2)) % 2 === 0, (x, y) => ((x >> 1) + (y >> 1)) % 2 === 0 ? x % 2 === 0 : y % 2 === 0];
  const patCache = new Map();
  const patCanvas = (pi, color) => { const k = pi + color; if (patCache.has(k)) return patCache.get(k); const c = document.createElement('canvas'); c.width = c.height = 8; const g2 = c.getContext('2d'); g2.fillStyle = '#fff'; g2.fillRect(0, 0, 8, 8); g2.fillStyle = color; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (PF[pi](x, y)) g2.fillRect(x, y, 1, 1); patCache.set(k, c); return c; };
  const patURL = (pi) => patCanvas(pi, '#000').toDataURL();
  // ---------- stamps: vector shapes rasterised to 1-bit with black outline ----------
  const ST = [['Heart', '#ff0080', (g2) => { g2.beginPath(); g2.moveTo(10, 17); g2.bezierCurveTo(-4, 8, 4, -1, 10, 5); g2.bezierCurveTo(16, -1, 24, 8, 10, 17); g2.fill(); }],
    ['Star', '#ffc31e', (g2) => { g2.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, r = i % 2 ? 4 : 9.5; g2.lineTo(10 + Math.cos(a) * r, 10.5 + Math.sin(a) * r); } g2.fill(); }],
    ['House', '#ff0000', (g2) => { g2.fillRect(4, 9, 12, 9); g2.beginPath(); g2.moveTo(2, 10); g2.lineTo(10, 2); g2.lineTo(18, 10); g2.fill(); g2.clearRect(8.5, 12, 3, 6); }],
    ['Tree', '#008000', (g2) => { g2.beginPath(); g2.moveTo(10, 1); g2.lineTo(17, 14); g2.lineTo(3, 14); g2.fill(); g2.fillRect(8.5, 14, 3, 5); }],
    ['Cat', '#808080', (g2) => { g2.beginPath(); g2.arc(10, 12, 7, 0, 7); g2.fill(); g2.beginPath(); g2.moveTo(3.5, 9); g2.lineTo(4, 2); g2.lineTo(9, 6); g2.moveTo(16.5, 9); g2.lineTo(16, 2); g2.lineTo(11, 6); g2.fill(); g2.clearRect(6.5, 10, 2, 2); g2.clearRect(11.5, 10, 2, 2); }],
    ['Fish', '#0080ff', (g2) => { g2.beginPath(); g2.ellipse(9, 10, 7, 4.5, 0, 0, 7); g2.fill(); g2.beginPath(); g2.moveTo(15, 10); g2.lineTo(19.5, 5.5); g2.lineTo(19.5, 14.5); g2.fill(); g2.clearRect(5, 8, 2, 2); }],
    ['Flower', '#ff00ff', (g2) => { for (let i = 0; i < 5; i++) { const a = i * 1.2566; g2.beginPath(); g2.arc(10 + Math.cos(a) * 5, 9 + Math.sin(a) * 5, 3.4, 0, 7); g2.fill(); } g2.fillRect(9.2, 13, 1.6, 7); g2.clearRect(8.5, 7.5, 3, 3); }],
    ['Sun', '#ffff01', (g2) => { g2.beginPath(); g2.arc(10, 10, 5, 0, 7); g2.fill(); g2.lineWidth = 2; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g2.beginPath(); g2.moveTo(10 + Math.cos(a) * 7, 10 + Math.sin(a) * 7); g2.lineTo(10 + Math.cos(a) * 9.5, 10 + Math.sin(a) * 9.5); g2.strokeStyle = g2.fillStyle; g2.stroke(); } }],
    ['Smiley', '#ffc31e', (g2) => { g2.beginPath(); g2.arc(10, 10, 8.5, 0, 7); g2.fill(); g2.clearRect(6, 6, 2, 3); g2.clearRect(12, 6, 2, 3); g2.clearRect(6, 12, 8, 1.5); g2.clearRect(5, 11, 1.5, 1.5); g2.clearRect(13.5, 11, 1.5, 1.5); }],
    ['Car', '#8000ff', (g2) => { g2.fillRect(1, 9, 18, 5); g2.fillRect(5, 5, 9, 5); g2.beginPath(); g2.arc(5, 15, 2.6, 0, 7); g2.arc(15, 15, 2.6, 0, 7); g2.fill(); g2.clearRect(6.5, 6.5, 2.5, 2.5); g2.clearRect(10.5, 6.5, 2.5, 2.5); }],
    ['Apple', '#ff0000', (g2) => { g2.beginPath(); g2.arc(7.5, 12, 5.5, 0, 7); g2.arc(12.5, 12, 5.5, 0, 7); g2.fill(); g2.fillRect(9.4, 2, 1.4, 5); g2.beginPath(); g2.ellipse(13, 4, 3, 1.5, -0.5, 0, 7); g2.fill(); }],
    ['Moon', '#0000ff', (g2) => { g2.beginPath(); g2.arc(10, 10, 8.5, 0, 7); g2.fill(); g2.globalCompositeOperation = 'destination-out'; g2.beginPath(); g2.arc(14, 7, 7.5, 0, 7); g2.fill(); g2.globalCompositeOperation = 'source-over'; }],
  ];
  const stampBmp = (i) => { const [, col, draw] = ST[i]; const c = document.createElement('canvas'); c.width = c.height = 20; const g2 = c.getContext('2d'); g2.fillStyle = col; draw(g2);
    const d = g2.getImageData(0, 0, 20, 20), m = (x, y) => x >= 0 && y >= 0 && x < 20 && y < 20 && d.data[(y * 20 + x) * 4 + 3] > 110; const out = g2.createImageData(20, 20); const [r, gg, b] = hexToRgb(col);
    for (let y = 0; y < 20; y++) for (let x = 0; x < 20; x++) { if (!m(x, y)) continue; const edge = !m(x - 1, y) || !m(x + 1, y) || !m(x, y - 1) || !m(x, y + 1); const o = (y * 20 + x) * 4; out.data.set(edge ? [0, 0, 0, 255] : [r, gg, b, 255], o); }
    g2.clearRect(0, 0, 20, 20); g2.putImageData(out, 0, 0); return c; };
  const STB = ST.map((_, i) => stampBmp(i));
  // ---------- layout ----------
  const COLORS = ['#000000', '#ffffff', '#202020', '#404040', '#808080', '#c0c0c0', '#800000', '#ff0000', '#808000', '#ffff01', '#004040', '#006400', '#008000', '#00ff00', '#008080', '#80ffff', '#000080', '#0000ff', '#004080', '#0080ff', '#8000ff', '#8080ff', '#800080', '#ff00ff', '#800040', '#ff0080', '#493d26', '#886843', '#804000', '#ff8040', '#e18700', '#ffc31e'];
  const S = { tool: 'pencil', color: '#000000', size: 1, pat: 0, fill: 1, wacky: 0, letter: 'A', stamp: 0, stampK: 3, erase: 1, sound: true };
  const chipI = h('i', { style: { background: S.color } });
  const pal = h('div.kp-pal', {}, COLORS.map((c) => h('button', { title: c, style: { background: c }, onclick: (e) => setColor(c, e.currentTarget) })));
  const undoB = h('button', { title: 'Undo', html: IC.left, onclick: () => undo() }), redoB = h('button', { title: 'Redo', html: IC.right, onclick: () => redo() });
  const splB = h('button', { title: 'Show splash again', html: IC.splash, onclick: () => { snap(); drawSplash(); } }), rndB = h('button', { title: 'Random colour', html: IC.dice, onclick: () => setColor(pick(COLORS)) });
  el.append(h('div.kp-chip', { title: 'Current colour' }, chipI), h('div.kp-left', {}, pal, h('div.kp-meta', {}, 'kidpix.app', h('div', {}, undoB, redoB), h('div', {}, splB, rndB))));
  const saveB = h('button.kp-save', { title: 'Save picture (PNG)', html: IC.save, onclick: () => save() }); el.append(saveB);
  const TOOLS = [['pencil', 'Pencil'], ['line', 'Line'], ['rect', 'Rectangle'], ['oval', 'Oval'], ['brush', 'Wacky Brush'], ['bucket', 'Paint Can'], ['eraser', 'Eraser'], ['text', 'Alphabet'], ['stamp', 'Rubber Stamp'], ['truck', 'Moving Van'], ['face', 'Undo Guy']];
  const toolBs = {}; const toolsEl = h('div.kp-tools', {}, TOOLS.map(([k, n]) => (toolBs[k] = h('button.kp-tool', { title: n, html: IC[k], onclick: () => (k === 'face' ? undoGuy() : setTool(k)) }))));
  const bar = h('div.kp-bar'); const stage = h('div.kp-stage'); const cv = h('canvas.kp-cv'); const fx = h('div.kp-fx');
  const hint = h('div.kp-hint', {}, 'Try tools with ⇧SHIFT (straight/square) · ALT (pick colour) · CTRL (rainbow)');
  stage.append(cv, fx, hint); el.append(toolsEl, bar, stage);
  const g = cv.getContext('2d', { willReadFrequently: true });
  const sizeCv = () => { const r = stage.getBoundingClientRect(); const W = Math.max(320, Math.round(r.width)), H = Math.max(300, Math.round(r.height)); if (cv.width === W && cv.height === H) return;
    const old = cv.width ? g.getImageData(0, 0, cv.width, cv.height) : null; cv.width = W; cv.height = H; cv.style.width = W + 'px'; cv.style.height = H + 'px'; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); if (old) g.putImageData(old, 0, 0); g.imageSmoothingEnabled = false; };
  // ---------- sounds (tiny square-wave chirps, only from real user gestures) ----------
  let quiet = false; const chirp = (f = 520, d = 0.05, t = 'square') => { if (!S.sound || quiet) return; blipK(f, d, t); };
  const blipK = (f, d, t) => { try { const ac = window.__kpAC || (window.__kpAC = new (window.AudioContext || window.webkitAudioContext)()); const o = ac.createOscillator(), gg = ac.createGain(); o.type = t; o.frequency.value = f; gg.gain.setValueAtTime(0.04, ac.currentTime); gg.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d); o.connect(gg).connect(ac.destination); o.start(); o.stop(ac.currentTime + d + 0.02); } catch {} };
  // ---------- option bars (swap per tool) ----------
  const opt = (inner, on, fn, cls = '', title = '') => h('button.kp-opt' + (cls ? '.' + cls : '') + (on ? '.on' : ''), { title, html: inner, onclick: (e) => { fn(); chirp(880, 0.03); drawBar(); } });
  const sizeIco = (n, kind) => sv(kind === 'line' ? `<path d="M2 12L14 4" stroke="#000" stroke-width="${0.6 + n * 0.75}"/>` : `<path d="M2 13l5-6" stroke="#000"/><circle cx="${9 + n * 0.3}" cy="${6 - n * 0.2}" r="${0.6 + n * 0.62}" fill="#000"/>`);
  const patGrp = () => h('div.kp-grp', {}, PF.map((_, i) => { const b = opt('', S.pat === i, () => (S.pat = i), 'pat', `Pattern ${i + 1}`); b.append(h('i', { style: { backgroundImage: `url(${patURL(i)})` } })); return b; }));
  const WK = ['Spray Can', 'Drippy Paint', 'Rainbow', 'Bubbles', 'Zig-Zag', 'Echo Circles'];
  const wkIco = [sv('<g fill="#000">' + Array.from({ length: 22 }, (_, i) => { const R2 = rng(i + 3); const a = R2() * 6.28, r = Math.sqrt(R2()) * 6; return `<rect x="${(8 + Math.cos(a) * r).toFixed(0)}" y="${(8 + Math.sin(a) * r).toFixed(0)}" width="1" height="1"/>`; }).join('') + '</g>'),
    sv('<path d="M2 4h12" stroke="#000" stroke-width="2"/><path d="M4 4v6M8 4v9M11 4v5" stroke="#000"/><circle cx="4" cy="11" r="1" fill="#000"/><circle cx="8" cy="14" r="1" fill="#000"/>'),
    sv('<path d="M2 12q6-12 12 0" fill="none" stroke="#f00" stroke-width="1.6"/><path d="M4 12q4-8 8 0" fill="none" stroke="#fc0" stroke-width="1.6"/><path d="M6 12q2-4 4 0" fill="none" stroke="#08f" stroke-width="1.6"/>'),
    sv('<circle cx="5" cy="10" r="3" fill="none" stroke="#000"/><circle cx="11" cy="6" r="2" fill="none" stroke="#000"/><circle cx="11" cy="12" r="1.4" fill="none" stroke="#000"/>'),
    sv('<path d="M1 10l3-5 3 7 3-7 3 7 2-3" fill="none" stroke="#000" stroke-width="1.4"/>'),
    sv('<circle cx="8" cy="8" r="6" fill="none" stroke="#000"/><circle cx="8" cy="8" r="3.5" fill="none" stroke="#000"/><circle cx="8" cy="8" r="1" fill="#000"/>')];
  const VAN = [['clear', 'Clear page (the van hauls it away)', IC.truck], ['mirror', 'Mirror', sv('<path d="M8 1v14" stroke="#000" stroke-dasharray="2 1"/><path d="M6 4L1 8l5 4zM10 4l5 4-5 4z" fill="#000"/>')], ['flip', 'Flip', sv('<path d="M1 8h14" stroke="#000" stroke-dasharray="2 1"/><path d="M4 6L8 1l4 5zM4 10l4 5 4-5z" fill="#000"/>')], ['invert', 'Invert colours', sv('<rect x="2" y="2" width="12" height="12" fill="#fff" stroke="#000"/><path d="M2 2h12L2 14z" fill="#000"/>')]];
  const ER = [['s', 'Small eraser', 8], ['m', 'Medium eraser', 18], ['l', 'Big eraser', 34]];
  const ERX = [['firecracker', 'Firecracker: clear page', sv('<rect x="5" y="6" width="6" height="9" fill="#e00" stroke="#000"/><path d="M8 6q0-3 3-4" fill="none" stroke="#000"/><path d="M11 0l1 2 2-1-1 2 2 1-2 1" fill="#fc0" stroke="#000" stroke-width=".5"/>')], ['fade', 'Fade away', sv('<g fill="#000">' + Array.from({ length: 30 }, (_, i) => `<rect x="${(i * 7) % 15}" y="${(i * 5) % 15}" width="1" height="1"/>`).join('') + '</g>')], ['hole', 'Black hole', sv('<circle cx="8" cy="8" r="6.5" fill="#000"/><circle cx="8" cy="8" r="3" fill="#fff"/>')]];
  function drawBar() {
    const t = S.tool, g1 = h('div.kp-grp'); let extra = null;
    if (t === 'pencil' || t === 'line') { [1, 2, 4, 7, 11, 16].forEach((sz, i) => g1.append(opt(sizeIco(i, t), S.size === sz, () => (S.size = sz), '', `Size ${sz}px`))); extra = patGrp(); }
    else if (t === 'rect' || t === 'oval') { const shp = (f) => sv(t === 'rect' ? `<rect x="2" y="4" width="12" height="8" fill="${f ? '#000' : '#fff'}" stroke="#000"/>` : `<circle cx="8" cy="8" r="5.5" fill="${f ? '#000' : '#fff'}" stroke="#000" stroke-width="1.2"/>`); g1.append(opt(shp(0), !S.fill, () => (S.fill = 0), '', 'Outline'), opt(shp(1), !!S.fill, () => (S.fill = 1), '', 'Filled')); extra = patGrp(); }
    else if (t === 'brush') WK.forEach((n, i) => g1.append(opt(wkIco[i], S.wacky === i, () => (S.wacky = i), '', n)));
    else if (t === 'bucket') { PF.forEach((_, i) => { const b = opt('', S.pat === i, () => (S.pat = i), 'pat', `Fill pattern ${i + 1}`); b.append(h('i', { style: { backgroundImage: `url(${patURL(i)})` } })); g1.append(b); }); }
    else if (t === 'eraser') { ER.forEach(([k, n, sz], i) => g1.append(opt(sv(`<rect x="${8 - (i + 1) * 2}" y="${8 - (i + 1) * 2}" width="${(i + 1) * 4}" height="${(i + 1) * 4}" fill="#fff" stroke="#000"/>`), S.erase === i, () => (S.erase = i), '', n))); extra = h('div.kp-grp', {}, ERX.map(([k, n, ic]) => opt(ic, false, () => bigClear(k), '', n))); }
    else if (t === 'text') 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?'.split('').forEach((c) => g1.append(opt(c, S.letter === c, () => (S.letter = c), 'txt', `Letter ${c}`)));
    else if (t === 'stamp') { ST.forEach(([n], i) => { const b = opt('', S.stamp === i, () => (S.stamp = i), '', n); const c = STB[i]; b.append(h('img', { src: c.toDataURL(), alt: n, style: { width: '76%', imageRendering: 'pixelated' } })); g1.append(b); }); extra = h('div.kp-grp', {}, [[2, 'Small'], [3, 'Medium'], [5, 'Big']].map(([k, n]) => opt(`<span style="font-size:${6 + k * 2.4}px">★</span>`, S.stampK === k, () => (S.stampK = k), '', n + ' stamp'))); }
    else if (t === 'truck') VAN.forEach(([k, n, ic]) => g1.append(opt(ic, false, () => van(k), '', n)));
    g1.append(opt(IC.help, false, () => toast(`${TOOLS.find((x) => x[0] === t)[1]} · drag on the canvas`), '', 'Help'));
    bar.replaceChildren(g1, ...(extra ? [extra] : [])); bar.dataset.tool = t;
  }
  function setTool(k) { S.tool = k; for (const [kk, b] of Object.entries(toolBs)) b.classList.toggle('on', kk === k); if (k === 'line' && S.size > 7) S.size = 2; drawBar(); chirp(300 + TOOLS.findIndex((x) => x[0] === k) * 60, 0.06); cv.style.cursor = k === 'text' || k === 'stamp' ? 'copy' : k === 'bucket' ? 'cell' : 'crosshair'; }
  function setColor(c, b) { S.color = c; chipI.style.background = c; [...pal.children].forEach((x) => x.classList.toggle('on', x.title === c)); chirp(660, 0.03, 'triangle'); }
  // ---------- history ----------
  const hist = [], fut = []; const snap = () => { hist.push(g.getImageData(0, 0, cv.width, cv.height)); if (hist.length > 30) hist.shift(); fut.length = 0; };
  const undo = () => { if (!hist.length) return false; fut.push(g.getImageData(0, 0, cv.width, cv.height)); g.putImageData(hist.pop(), 0, 0); undoB.classList.add('flash'); setTimeout(() => undoB.classList.remove('flash'), 150); chirp(220, 0.12, 'sawtooth'); return true; };
  const redo = () => { if (!fut.length) return; hist.push(g.getImageData(0, 0, cv.width, cv.height)); g.putImageData(fut.pop(), 0, 0); chirp(330, 0.1, 'sawtooth'); };
  function undoGuy() { const ok = undo(); const b = toolBs.face; b.innerHTML = ok ? sv('<circle cx="8" cy="8" r="6.5" fill="#f2c08a" stroke="#000"/><rect x="4" y="5" width="3" height="3" fill="#000"/><rect x="9" y="5" width="3" height="3" fill="#000"/><ellipse cx="8" cy="11.5" rx="2.5" ry="2" fill="#e00" stroke="#000"/>') : IC.face; setTimeout(() => (b.innerHTML = IC.face), 500); if (!ok) toast('Nothing to undo'); }
  function save() { const a = h('a', { href: cv.toDataURL('image/png'), download: 'kidpix-picture.png' }); document.body.append(a); a.click(); a.remove(); toast('Saved kidpix-picture.png'); chirp(990, 0.08); }
  // ---------- drawing ----------
  const paint = () => { const col = S.ctrlRainbow ? `hsl(${(performance.now() / 4) % 360} 100% 50%)` : S.color; return S.pat ? g.createPattern(patCanvas(S.pat, col), 'repeat') : col; };
  let st = null, last = null, base = null;
  const P = (e) => { const r = cv.getBoundingClientRect(); return { x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) }; };
  const pickAt = (p) => { const d = g.getImageData(p.x, p.y, 1, 1).data; setColor(rgbToHex(d[0], d[1], d[2])); toast('Picked ' + S.color); };
  function stampAt(p) { const c = STB[S.stamp], k = S.stampK; g.imageSmoothingEnabled = false; g.drawImage(c, Math.round(p.x - 10 * k), Math.round(p.y - 10 * k), 20 * k, 20 * k); chirp(180 + S.stamp * 40, 0.09); }
  function letterAt(p) { const sz = 64; g.font = `700 ${sz}px ${PX}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 3; g.strokeStyle = '#000'; g.strokeText(S.letter, p.x, p.y); g.fillStyle = paint(); g.fillText(S.letter, p.x, p.y); chirp(400 + S.letter.charCodeAt(0) * 5, 0.12, 'triangle'); }
  function fill(p) { const W = cv.width, H = cv.height, img = g.getImageData(0, 0, W, H), d = img.data; const i0 = (p.y * W + p.x) * 4; const tr = d[i0], tg = d[i0 + 1], tb = d[i0 + 2];
    const [cr, cg, cb] = hexToRgb(S.color); const pc = (x, y) => PF[S.pat](x & 7, y & 7); const want = (x, y) => (pc(x, y) ? [cr, cg, cb] : [255, 255, 255]);
    const same = (i) => Math.abs(d[i] - tr) < 8 && Math.abs(d[i + 1] - tg) < 8 && Math.abs(d[i + 2] - tb) < 8; const seen = new Uint8Array(W * H); const stack = [p.x, p.y]; let n = 0;
    while (stack.length) { const y = stack.pop(), x0 = stack.pop(); let x = x0; while (x >= 0 && !seen[y * W + x] && same((y * W + x) * 4)) x--; x++; let up = false, dn = false;
      while (x < W && !seen[y * W + x] && same((y * W + x) * 4)) { const i = (y * W + x) * 4; seen[y * W + x] = 1; const w2 = want(x, y); d[i] = w2[0]; d[i + 1] = w2[1]; d[i + 2] = w2[2]; d[i + 3] = 255; n++;
        if (y > 0) { const s2 = !seen[(y - 1) * W + x] && same(((y - 1) * W + x) * 4); if (s2 && !up) { stack.push(x, y - 1); up = true; } else if (!s2) up = false; }
        if (y < H - 1) { const s2 = !seen[(y + 1) * W + x] && same(((y + 1) * W + x) * 4); if (s2 && !dn) { stack.push(x, y + 1); dn = true; } else if (!s2) dn = false; } x++; } }
    g.putImageData(img, 0, 0); chirp(140, 0.18, 'triangle'); return n; }
  function shape(a, b, shift) { let w = b.x - a.x, hh = b.y - a.y; if (shift) { const m = Math.max(Math.abs(w), Math.abs(hh)); w = Math.sign(w || 1) * m; hh = Math.sign(hh || 1) * m; }
    g.beginPath(); if (S.tool === 'rect') g.rect(a.x + 0.5, a.y + 0.5, w, hh); else g.ellipse(a.x + w / 2, a.y + hh / 2, Math.abs(w / 2), Math.abs(hh / 2), 0, 0, 7);
    if (S.fill) { g.fillStyle = paint(); g.fill(); g.lineWidth = 1; g.strokeStyle = '#000'; g.stroke(); } else { g.lineWidth = 2; g.strokeStyle = paint(); g.stroke(); } }
  function wackySeg(a, b, t) { const k = S.wacky, col = S.color; const dist = Math.hypot(b.x - a.x, b.y - a.y);
    if (k === 0) { g.fillStyle = col; for (let i = 0; i < 26; i++) { const an = Math.random() * 6.28, r = Math.sqrt(Math.random()) * 18; g.fillRect(Math.round(b.x + Math.cos(an) * r), Math.round(b.y + Math.sin(an) * r), 1, 1); } }
    else if (k === 1) { g.strokeStyle = col; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); if (Math.random() < 0.25) { const len = 10 + Math.random() * 40; g.lineWidth = 2; g.beginPath(); g.moveTo(b.x, b.y); g.lineTo(b.x, b.y + len); g.stroke(); g.fillStyle = col; g.beginPath(); g.arc(b.x, b.y + len, 2.5, 0, 7); g.fill(); } }
    else if (k === 2) { g.lineCap = 'round'; g.lineWidth = 14; g.strokeStyle = `hsl(${(t * 3) % 360} 100% 50%)`; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
    else if (k === 3) { if (dist > 0 && Math.random() < 0.6) { g.strokeStyle = '#000'; g.fillStyle = '#fff'; g.lineWidth = 1; const r = 3 + Math.random() * 12; g.beginPath(); g.arc(b.x + (Math.random() - 0.5) * 20, b.y + (Math.random() - 0.5) * 20, r, 0, 7); g.fill(); g.stroke(); g.fillStyle = col; g.fillRect(Math.round(b.x - r / 3), Math.round(b.y - r / 3), 2, 2); } }
    else if (k === 4) { g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.moveTo(a.x, a.y); const nx = -(b.y - a.y) / (dist || 1), ny = (b.x - a.x) / (dist || 1); const s2 = (t % 2 ? 1 : -1) * 12; g.lineTo((a.x + b.x) / 2 + nx * s2, (a.y + b.y) / 2 + ny * s2); g.lineTo(b.x, b.y); g.stroke(); }
    else if (k === 5) { if (t % 4 === 0) { g.strokeStyle = col; g.lineWidth = 1; for (let r = 4; r < 30; r += 7) { g.beginPath(); g.arc(b.x, b.y, r, 0, 7); g.stroke(); } } } }
  let tick = 0;
  drag(cv, {
    start: (e) => { sizeCv(); const p = P(e); S.ctrlRainbow = e.ctrlKey || e.metaKey; if (e.altKey) { pickAt(p); return false; } st = p; last = p; snap(); base = g.getImageData(0, 0, cv.width, cv.height);
      if (S.tool === 'stamp') { stampAt(p); st = null; } else if (S.tool === 'text') { letterAt(p); st = null; } else if (S.tool === 'bucket') { fill(p); st = null; } else if (S.tool === 'truck') { toast('Moving Van: pick an action on the top bar'); hist.pop(); st = null; }
      else if (S.tool === 'pencil') { g.fillStyle = paint(); g.beginPath(); g.arc(p.x, p.y, S.size / 2, 0, 7); g.fill(); chirp(700, 0.02); }
      else if (S.tool === 'eraser') { const z = ER[S.erase][2]; g.fillStyle = '#fff'; g.fillRect(p.x - z / 2, p.y - z / 2, z, z); } },
    move: (e) => { if (!st) return; const p = P(e); tick++;
      if (S.tool === 'pencil') { g.strokeStyle = paint(); g.lineWidth = S.size; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(last.x, last.y); g.lineTo(p.x, p.y); g.stroke(); if (tick % 6 === 0) chirp(500 + (p.y % 200), 0.015); }
      else if (S.tool === 'eraser') { const z = ER[S.erase][2]; g.fillStyle = '#fff'; const n = Math.ceil(Math.hypot(p.x - last.x, p.y - last.y) / 4) + 1; for (let i = 0; i <= n; i++) { const x = last.x + (p.x - last.x) * i / n, y = last.y + (p.y - last.y) * i / n; g.fillRect(Math.round(x - z / 2), Math.round(y - z / 2), z, z); } if (tick % 5 === 0) chirp(90, 0.03, 'sawtooth'); }
      else if (S.tool === 'brush') { wackySeg(last, p, tick); if (tick % 4 === 0) chirp(300 + S.wacky * 90 + (tick % 8) * 20, 0.02, 'triangle'); }
      else if (S.tool === 'line') { g.putImageData(base, 0, 0); let q = p; if (e.shiftKey) { const an = Math.round(Math.atan2(p.y - st.y, p.x - st.x) / (Math.PI / 4)) * (Math.PI / 4), L = Math.hypot(p.x - st.x, p.y - st.y); q = { x: st.x + Math.cos(an) * L, y: st.y + Math.sin(an) * L }; } g.strokeStyle = paint(); g.lineWidth = S.size; g.lineCap = 'round'; g.beginPath(); g.moveTo(st.x, st.y); g.lineTo(q.x, q.y); g.stroke(); }
      else if (S.tool === 'rect' || S.tool === 'oval') { g.putImageData(base, 0, 0); shape(st, p, e.shiftKey); }
      last = p; },
    end: () => { if (st && (S.tool === 'line' || S.tool === 'rect' || S.tool === 'oval')) chirp(440, 0.06, 'triangle'); st = null; base = null; },
  });
  // ---------- big clears (eraser extras + moving van) ----------
  const wipe = () => { g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); };
  async function bigClear(kind) { snap(); const W = cv.width, H = cv.height;
    if (kind === 'firecracker' || RM || quiet) { wipe(); if (!RM && !quiet) { const b = h('div.kp-boom'); fx.append(b); setTimeout(() => b.remove(), 600); } chirp(70, 0.4, 'sawtooth'); return; }
    if (kind === 'fade') { const order = []; for (let y = 0; y < H; y += 8) for (let x = 0; x < W; x += 8) order.push([x, y]); for (let i = order.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [order[i], order[j]] = [order[j], order[i]]; } g.fillStyle = '#fff'; const step = Math.ceil(order.length / 24); for (let i = 0; i < order.length; i += step) { for (const [x, y] of order.slice(i, i + step)) g.fillRect(x, y, 8, 8); await sleep(30); } return; }
    if (kind === 'hole') { const R = Math.hypot(W, H) / 2; for (let r = 0; r <= R; r += R / 18) { g.fillStyle = '#000'; g.beginPath(); g.arc(W / 2, H / 2, r, 0, 7); g.fill(); await sleep(25); } wipe(); return; } }
  async function van(kind) { const W = cv.width, H = cv.height; snap();
    if (kind === 'mirror' || kind === 'flip') { const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H; tmp.getContext('2d').drawImage(cv, 0, 0); g.save(); g.setTransform(kind === 'mirror' ? -1 : 1, 0, 0, kind === 'flip' ? -1 : 1, kind === 'mirror' ? W : 0, kind === 'flip' ? H : 0); g.drawImage(tmp, 0, 0); g.restore(); chirp(500, 0.1); return; }
    if (kind === 'invert') { const im = g.getImageData(0, 0, W, H); for (let i = 0; i < im.data.length; i += 4) { im.data[i] = 255 - im.data[i]; im.data[i + 1] = 255 - im.data[i + 1]; im.data[i + 2] = 255 - im.data[i + 2]; } g.putImageData(im, 0, 0); chirp(260, 0.12); return; }
    // clear: the red van drives across, wiping the page behind it
    if (RM || quiet) { wipe(); return; }
    const tr = h('div.kp-truck', { html: IC.truck.replace('<svg ', '<svg style="width:100%;height:100%" ') }); fx.append(tr); const tw = tr.offsetWidth; const N = 28;
    for (let i = 0; i <= N; i++) { const x = W + tw - (W + tw * 2) * (i / N); tr.style.left = x + 'px'; g.fillStyle = '#fff'; g.fillRect(x + tw * 0.5, 0, W, H); if (i % 3 === 0) chirp(80 + (i % 2) * 20, 0.05, 'sawtooth'); await sleep(28); }
    wipe(); tr.remove(); }
  // ---------- splash (code-drawn: Mac window + lavender dither bird + lime KID PIX poster) ----------
  function bird(w, hh) { // greyscale bird + branch, ordered-dithered to 1-bit navy on lavender
    const c = document.createElement('canvas'); c.width = w; c.height = hh; const b = c.getContext('2d'); b.fillStyle = '#fff'; b.fillRect(0, 0, w, hh); const k = w / 360; b.save(); b.scale(k, k);
    const sh = (fn, col) => { b.fillStyle = col; b.beginPath(); fn(); b.fill(); };
    sh(() => { b.moveTo(130, 300); b.bezierCurveTo(150, 250, 200, 230, 250, 250); b.bezierCurveTo(230, 270, 180, 280, 130, 300); }, '#777');
    sh(() => { b.ellipse(225, 280, 40, 18, -0.6, 0, 7); }, '#888'); sh(() => { b.ellipse(260, 240, 28, 12, 0.8, 0, 7); }, '#999');
    sh(() => { b.ellipse(170, 150, 62, 30, -0.45, 0, 7); }, '#3a3a3a'); sh(() => { b.ellipse(200, 128, 26, 22, 0, 0, 7); }, '#2a2a2a');
    sh(() => { b.moveTo(218, 118); b.lineTo(330, 168); b.lineTo(218, 130); }, '#111');
    sh(() => { b.moveTo(160, 132); b.bezierCurveTo(90, 40, 40, 30, 20, 60); b.bezierCurveTo(70, 80, 110, 120, 150, 160); }, '#555');
    sh(() => { b.moveTo(118, 168); b.lineTo(60, 250); b.lineTo(80, 255); b.lineTo(140, 180); }, '#444');
    sh(() => { b.ellipse(150, 180, 36, 18, -0.2, 0, 7); }, '#bbb'); sh(() => { b.arc(206, 124, 3.5, 0, 7); }, '#000');
    b.strokeStyle = '#555'; b.lineWidth = 6; b.beginPath(); b.moveTo(110, 360); b.bezierCurveTo(150, 280, 210, 230, 280, 200); b.stroke(); b.restore();
    const im = b.getImageData(0, 0, w, hh), d = im.data; const BY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]; const R2 = rng(5);
    for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; const v = d[i] / 255 + (R2() - 0.5) * 0.18; const on = v < (BY[(y & 3) * 4 + (x & 3)] + 0.5) / 16; d.set(on ? [30, 28, 110, 255] : [170, 168, 255, 255], i); }
    b.putImageData(im, 0, 0); return c; }
  function drawSplash() { sizeCv(); const s = clamp(Math.min(cv.width / 735, cv.height / 545), 0.4, 1.5); const X = (v) => Math.round(v * s); g.save(); g.imageSmoothingEnabled = false;
    // lavender block + bird
    g.fillStyle = '#aaa8ff'; g.fillRect(0, X(242), X(365), X(296)); g.drawImage(bird(X(340), X(270)), X(14), X(262));
    g.fillStyle = '#000'; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = `400 ${X(13)}px ${PX}`; g.fillText('This copy of JSKIDPIX belongs to...', X(182), X(298)); g.font = `700 ${X(15)}px ${PX}`; g.fillText('YOU!', X(182), X(334));
    // Mac window
    g.fillStyle = '#fff'; g.fillRect(0, 0, X(365), X(242)); g.fillStyle = '#000'; g.fillRect(0, X(14), X(365), 1); g.fillRect(X(3), X(15), X(4), X(198)); g.fillRect(X(360), X(15), X(4), X(198));
    g.fillRect(X(7), X(15), X(353), 2); g.fillRect(X(7), X(211), X(353), 2);
    g.font = `700 ${X(9)}px ${PX}`; g.textAlign = 'left'; g.fillText('\uF8FF', X(12), X(10)); g.fillRect(X(12), X(3), X(7), X(8)); g.fillStyle = '#fff'; g.fillRect(X(15), X(2), X(2), X(2)); g.fillStyle = '#000'; g.fillText('File', X(26), X(10.5)); g.fillText('Edit', X(52), X(10.5));
    g.strokeStyle = '#000'; g.lineWidth = 1; g.beginPath(); g.arc(X(327), X(7), X(4.5), 0, 7); g.stroke(); g.font = `700 ${X(7)}px ${PX}`; g.textAlign = 'center'; g.fillText('?', X(327), X(9.5)); g.fillRect(X(341), X(2), X(3), X(10));
    g.font = `400 ${X(8)}px ${PX}`; g.fillText('JS', X(106), X(42)); g.font = `700 ${X(46)}px ${PX}`; g.fillText('Kid Pix', X(190), X(78));
    g.font = `400 ${X(7.4)}px ${PX}`; g.fillText('Public Domain Version', X(185), X(96));
    for (let i = 0; i < 11; i++) g.drawImage(STB[i], X(68 + i * 21), X(104), X(16), X(16));
    g.font = `400 ${X(9.5)}px ${PX}`; g.fillText('by Craig Hickman', X(185), X(140));
    g.font = `400 ${X(6.6)}px ${PX}`; g.fillText('This version of KID PIX is FREE.  For the expanded deluxe', X(190), X(170)); g.fillText('version select "COMMERCIAL" in the Apple menu.', X(176), X(180));
    g.font = `400 ${X(5.4)}px ${PX}`; g.textAlign = 'left'; g.fillText('Version 1.0  November, 1989', X(14), X(205)); g.textAlign = 'right'; g.fillText('https://kidpix.app * https://kidpix.neocities.org', X(354), X(205));
    // "Try tools" strip
    g.fillStyle = '#fff'; g.fillRect(X(20), X(218), X(340), X(22)); g.strokeStyle = '#000'; g.lineWidth = Math.max(1, X(1.5)); g.strokeRect(X(20), X(218), X(340), X(22)); g.drawImage(patCanvas(1, '#000'), 0, X(218), X(20), X(22));
    g.fillStyle = '#000'; g.textAlign = 'left'; g.font = `400 ${X(9.6)}px ${PX}`; let tx = X(26); const piece = (t, c) => { g.fillStyle = c; g.fillText(t, tx, X(234)); tx += g.measureText(t).width; };
    piece('Try tools with ', '#000'); piece('⇧', '#8080ff'); piece('CTRL, ', '#000'); piece('⌘', '#8000ff'); piece('ALT, ', '#000'); piece('⌥', '#808080'); piece('OPTION, ', '#000'); piece('^', '#ff0080'); piece('SHIFT too!', '#000'); piece('✨', '#ffc31e');
    // lime poster
    const PX0 = X(365), PW = X(365); g.fillStyle = '#d0ff00'; g.fillRect(PX0, 0, PW, X(372)); g.fillStyle = '#fff'; g.fillRect(PX0 + X(22), X(20), X(300), X(232)); g.strokeStyle = '#8300d0'; g.lineWidth = X(7); g.strokeRect(PX0 + X(22), X(20), X(300), X(232));
    for (let j = 0, r = 19; r > 0; j++, r -= 3.2) { g.fillStyle = j % 2 ? '#fff' : '#000'; g.beginPath(); g.arc(PX0 + X(185), X(18), X(r), 0, 7); g.fill(); }
    g.save(); g.translate(PX0 + X(28), X(30)); g.rotate(-0.4); g.fillStyle = '#ff8fd0'; g.font = `400 ${X(30)}px ${POST}`; g.fillText('JS', 0, 0); g.restore();
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `400 ${X(100)}px ${POST}`; g.lineWidth = X(3); g.strokeStyle = '#000';
    const L = (ch, x, y, fillF) => { g.save(); g.translate(PX0 + X(x), X(y)); g.scale(1.75, 1); fillF(); g.fillText(ch, 0, 0); g.restore(); };
    L('K', 80, 88, () => (g.fillStyle = '#0069ff')); L('I', 165, 88, () => (g.fillStyle = '#ff0000'));
    g.save(); g.beginPath(); g.rect(PX0 + X(200), 0, X(55), X(88)); g.clip(); L('D', 245, 88, () => (g.fillStyle = '#ff0000')); g.restore(); g.save(); g.beginPath(); g.rect(PX0 + X(255), 0, X(60), X(88)); g.clip(); L('D', 245, 88, () => (g.fillStyle = '#00a000')); g.restore();
    g.save(); g.beginPath(); g.rect(PX0 + X(200), X(88), X(115), X(60)); g.clip(); L('D', 245, 88, () => (g.fillStyle = '#8300d0')); g.restore();
    L('P', 85, 200, () => (g.fillStyle = '#ff0080')); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(PX0 + X(78), X(178), X(22), X(12), 0, 0, 7); g.fill(); g.fillStyle = '#0069ff'; g.beginPath(); g.arc(PX0 + X(80), X(178), X(9), 0, 7); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.arc(PX0 + X(80), X(178), X(4), 0, 7); g.fill();
    const chk = document.createElement('canvas'); chk.width = chk.height = 2; const cg = chk.getContext('2d'); cg.fillStyle = '#e18700'; cg.fillRect(0, 0, 2, 2); cg.fillStyle = '#000'; cg.fillRect(0, 0, 1, 1); cg.fillRect(1, 1, 1, 1); const cp = g.createPattern(chk, 'repeat'); cp.setTransform(new DOMMatrix().scale(X(9)));
    L('I', 165, 200, () => (g.fillStyle = cp)); L('X', 248, 200, () => (g.fillStyle = '#8300d0'));
    [[150, 60, '#ff8040'], [300, 180, '#ff8040'], [228, 168, '#ff0000']].forEach(([x, y, c]) => { g.fillStyle = c; g.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = X(i % 2 ? 6 : 14); g.lineTo(PX0 + X(x) + Math.cos(a) * r, X(y) + Math.sin(a) * r); } g.fill(); });
    // two scribble kids
    [[272, 232], [312, 230]].forEach(([x, y], i) => { g.fillStyle = '#000'; g.beginPath(); g.arc(PX0 + X(x), X(y - 16), X(12), 0, 7); g.fill(); g.fillRect(PX0 + X(x - 10), X(y - 6), X(20), X(26)); g.fillStyle = '#fff'; g.fillRect(PX0 + X(x - 5), X(y - 20), X(3), X(3)); g.fillRect(PX0 + X(x + 2), X(y - 20), X(3), X(3)); g.fillStyle = i ? '#ff0080' : '#00a0ff'; g.fillRect(PX0 + X(x - 30), X(y + 2), X(42), X(5)); });
    g.font = `400 ${X(7)}px ${PX}`; g.fillStyle = '#8300d0'; g.textAlign = 'left'; g.fillText('BASED ON PUBLIC DOMAIN  BY CRAIG HICKMAN', PX0 + X(26), X(262));
    g.font = `900 ${X(46)}px 'Noto Sans CJK JP','Hiragino Sans','Yu Gothic',sans-serif`; let jx = PX0 + X(14); [['キ', '#0069ff'], ['ッ', '#ff0000'], ['ド', '#00a000'], ['ピ', '#ff0080'], ['ク', cp], ['ス', '#0069ff']].forEach(([ch, c]) => { g.fillStyle = c; g.strokeStyle = '#000'; g.lineWidth = X(1.5); g.fillText(ch, jx, X(318)); g.strokeText(ch, jx, X(318)); jx += X(55); });
    g.restore(); }
  // ---------- boot ----------
  setColor('#000000'); setTool('pencil');
  const boot = async () => { sizeCv(); try { await fontsP; await Promise.all([document.fonts.load(`700 40px 'Pixelify Sans'`), document.fonts.load(`400 12px 'Pixelify Sans'`), document.fonts.load(`400 12px Silkscreen`), document.fonts.load(`400 60px Anton`)]); } catch {} wipe(); drawSplash(); hist.length = 0; };
  const ready = boot();
  new ResizeObserver(() => { fitU(); sizeCv(); }).observe(root);
  window.__demoProof = async () => { await ready; quiet = true; const o = []; const px = (x, y) => [...g.getImageData(x, y, 1, 1).data.slice(0, 3)];
    const W = cv.width, H = cv.height, X = (f) => Math.round(W * f), ey = Math.round(H * 0.9);
    pal.children[7].click(); toolBs.pencil.click(); const pb = bar.querySelectorAll('.kp-opt').length; bar.querySelector('.kp-opt:nth-child(4)').click();
    await gesture(cv, Array.from({ length: 24 }, (_, i) => [X(0.04 + i * 0.012), ey + Math.sin(i / 3) * 12]), 2); o.push(`pencil red stroke px=${px(X(0.04), ey)} size=${S.size} bar(${bar.dataset.tool})=${pb} opts`);
    toolBs.oval.click(); o.push(`oval bar swapped→${bar.dataset.tool} (${bar.querySelectorAll('.kp-opt').length} opts)`); await gesture(cv, [[X(0.36), ey - 50], [X(0.42), ey - 20], [X(0.5), ey + 10]], 2);
    toolBs.stamp.click(); bar.querySelectorAll('.kp-opt')[1].click(); const sx = X(0.6), sy = ey - 20; fire(cv, 'pointerdown', sx, sy); fire(cv, 'pointerup', sx, sy); o.push(`stamp ${ST[S.stamp][0]} placed px=${px(sx, sy + 3)}`);
    toolBs.brush.click(); bar.querySelectorAll('.kp-opt')[2].click(); await gesture(cv, Array.from({ length: 12 }, (_, i) => [X(0.68 + i * 0.01), ey - 30]), 2); o.push(`wacky ${WK[S.wacky]}`);
    toolBs.text.click(); fire(cv, 'pointerdown', X(0.9), ey - 20); fire(cv, 'pointerup', X(0.9), ey - 20); o.push(`letter ${S.letter}`);
    const h0 = hist.length; toolBs.face.click(); o.push(`undo guy: history ${h0}→${hist.length}`);
    toolBs.truck.click(); o.push(`van bar=${bar.dataset.tool}`); await van('clear'); o.push(`van clear → px=${px(X(0.04), ey)} white=${px(X(0.04), ey).every((v) => v === 255)}`);
    undo(); o.push(`undo restores drawing px=${px(X(0.04), ey)}`);
    wipe(); drawSplash(); hist.length = 0; fut.length = 0; S.size = 1; S.pat = 0; S.wacky = 0; S.stamp = 0; setColor('#000000'); setTool('pencil'); quiet = false;
    o.push(`restored: tool=${S.tool} color=${S.color} splash`); return o.join('; '); };
};

V['dungeonscrawl-preset-rail-dual-sidebar-floating-draw-toolbar-hatching-map-inspector'] = (root, T) => {
  theme(root, T, { bg: '#efeae2', fg: '#222', ac: '#c94545', dark: false });
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  css(`.ds{position:absolute;inset:0;display:grid;grid-template-columns:38px 252px 1fr 252px;grid-template-rows:30px 1fr;background:#efeae2;color:#26272b;font:400 12px/1.3 'Inter Variable',system-ui,sans-serif;--pn:#fff;--ln:#e4e4e7;--tx:#26272b;--mut:#71717a;--chip:#f1f1f3;--on:#e4e4e7;user-select:none}
.ds.dark{--pn:#232428;--ln:#34353a;--tx:#e8e8ea;--mut:#9a9aa3;--chip:#2c2d32;--on:#3a3b41}
.ds *{box-sizing:border-box}.ds button{font:inherit;color:inherit;cursor:pointer;border:0;background:none;padding:0}
.ds-top{grid-column:1/-1;display:flex;align-items:center;gap:14px;padding:0 10px;background:var(--pn);border-bottom:1px solid var(--ln);color:var(--tx);position:relative;z-index:3}
.ds-top .mn{display:flex;gap:12px}.ds-top .mn button{padding:3px 2px;border-radius:4px}.ds-top .mn button:hover{background:var(--chip)}
.ds-crumb{position:absolute;left:50%;transform:translateX(-50%);font-weight:500}
.ds-sp{flex:1}.ds-pro{background:linear-gradient(90deg,#7b2ff7,#b14dff)!important;color:#fff!important;border-radius:6px!important;padding:4px 10px!important;font-weight:600!important}
.ds-su{background:#1f6fe5!important;color:#fff!important;border-radius:6px!important;padding:5px 12px!important;font-weight:600!important}
.ds-lt{display:flex;align-items:center;gap:5px;background:#1f6fe5!important;color:#fff!important;border-radius:99px!important;padding:2px 8px 2px 3px!important;font-size:10px!important}.ds-lt i{width:15px;height:15px;border-radius:50%;background:#fff;display:grid;place-items:center;color:#1f6fe5;font-style:normal;font-size:9px}
.ds-rail{grid-row:2;background:var(--pn);border-right:1px solid var(--ln);display:flex;flex-direction:column;align-items:center;padding-top:4px;gap:4px;color:var(--tx)}
.ds-rail button{width:30px;height:30px;border-radius:6px;display:grid;place-items:center;position:relative}.ds-rail button.on::before{content:'';position:absolute;left:-4px;top:4px;bottom:4px;width:2px;background:var(--tx);border-radius:2px}
.ds-rail button:hover{background:var(--chip)}.ds-rail svg{width:19px;height:19px}
.ds-left{grid-row:2;background:var(--pn);border-right:1px solid var(--ln);display:flex;flex-direction:column;min-height:0;color:var(--tx)}
.ds-sec{display:flex;align-items:center;gap:8px;padding:10px 12px;font-weight:600}.ds-sec .chev{display:inline-block;transition:transform .15s}.ds-sec.cl .chev{transform:rotate(-90deg)}
.ds-presets{flex:1;overflow:auto;padding:0 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:10px 8px;align-content:start}
.ds-pre{display:flex;flex-direction:column;gap:5px;text-align:left}.ds-pre canvas{width:100%;aspect-ratio:1;border-radius:9px;display:block;box-shadow:0 0 0 1px var(--ln)}
.ds-pre.on canvas{box-shadow:0 0 0 2px #c94545}.ds-pre:hover canvas{box-shadow:0 0 0 2px #c9454588}.ds-pre span{font-size:11px;color:var(--tx)}
.ds-tool{border-top:1px solid var(--ln);padding:6px 12px 12px;display:grid;gap:9px}
.ds-tool .rw{display:grid;grid-template-columns:62px 1fr auto;align-items:center;gap:6px}.ds-tool .rw>label{color:var(--tx)}
.ds-sg{display:flex;gap:2px}.ds-sg button{flex:1;padding:5px 0;border-radius:6px;color:var(--mut)}.ds-sg button.on{background:var(--on);color:var(--tx);font-weight:500}
.ds-k{background:#2b2b2e;color:#fff;border-radius:4px;font:600 9px/1 'Inter Variable';padding:4px 5px;min-width:18px;text-align:center}
.ds-num{width:42px;border:1px solid var(--ln);border-radius:6px;padding:4px 6px;font:inherit;background:var(--pn);color:var(--tx)}
.ds input[type=range]{accent-color:#8a8a92;width:100%;height:14px}
.ds-stage{grid-row:2;position:relative;overflow:hidden;min-width:0}
.ds-cv{position:absolute;inset:0;touch-action:none;cursor:crosshair}.ds-cv.pan{cursor:grab}.ds-cv.sel{cursor:default}
.ds-bar{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);background:var(--pn);border-radius:10px;box-shadow:0 2px 12px #0002,0 0 0 1px var(--ln);display:flex;gap:4px;padding:5px 6px;color:var(--tx);z-index:2}
.ds-bar button{width:30px;height:30px;border-radius:7px;display:grid;place-items:center}.ds-bar button:hover{background:var(--chip)}.ds-bar svg{width:19px;height:19px}
.ds-bar button.on{background:#c94545;color:#fff}.ds-bar .b{background:#2b2b2e;color:#fff;border-radius:5px;width:18px;height:18px;font:600 10px/18px 'Inter Variable';text-align:center}
.ds-tip{position:absolute;left:50%;bottom:60px;transform:translateX(-50%);background:#2b2b2e;color:#fff;padding:4px 9px;border-radius:6px;font-size:11px;pointer-events:none;opacity:0;transition:opacity .15s;white-space:nowrap}.ds-tip.on{opacity:1}
.ds-right{grid-row:2;background:var(--pn);border-left:1px solid var(--ln);overflow:auto;color:var(--tx)}
.ds-hd{display:flex;align-items:center;justify-content:space-between;padding:9px 12px 6px;font-weight:600}
.ds-li{display:flex;align-items:center;gap:8px;margin:1px 8px;padding:6px 8px;border-radius:6px;cursor:pointer}.ds-li.on{background:var(--on)}.ds-li:hover{background:var(--chip)}.ds-li svg{width:14px;height:14px;flex:none}
.ds-add{display:flex;gap:14px;padding:6px 14px 10px;color:var(--mut);font-size:11px}
.ds-ins{border-top:1px solid var(--ln)}.ds-grp{padding:8px 12px 12px;border-bottom:1px solid var(--ln);display:grid;gap:9px}.ds-grp .gh{display:flex;justify-content:space-between;align-items:center;font-weight:600}
.ds-f{display:grid;grid-template-columns:70px 1fr;align-items:center;gap:8px;padding-left:10px}.ds-f.top{padding-left:0}
.ds-col{display:flex;align-items:center;gap:8px;border:1px solid var(--ln);border-radius:6px;padding:4px 6px;font:500 11px 'Inter Variable';position:relative;cursor:pointer}.ds-col i{width:20px;height:18px;border-radius:4px;box-shadow:inset 0 0 0 1px #0002}.ds-col input{position:absolute;inset:0;opacity:0;cursor:pointer}
.ds-selx{border:1px solid var(--ln);border-radius:6px;padding:5px 6px;font:inherit;background:var(--pn);color:var(--tx);width:100%}
.ds-nr{display:grid;grid-template-columns:44px 1fr;gap:8px;align-items:center}
.ds-badge{background:#7b2ff7;color:#fff;font:700 8px/1 'Inter Variable';border-radius:99px;padding:3px 5px;margin-left:6px}
.ds-eye{opacity:.6;width:14px;height:14px}
.ds-assets{flex:1;overflow:auto;padding:0 10px 10px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;align-content:start}
.ds-asset{border:1px solid var(--ln);border-radius:8px;aspect-ratio:1;display:grid;place-items:center;background:#f6f3ec}.ds-asset.on{box-shadow:0 0 0 2px #c94545}.ds-asset svg{width:60%;height:60%}
.ds-fade{animation:dsF .28s ease-out}@keyframes dsF{from{opacity:.35}to{opacity:1}}
@media (max-width:760px){.ds{grid-template-columns:38px 1fr}.ds-left{position:absolute;left:38px;top:30px;bottom:0;width:min(252px,calc(100% - 38px));z-index:4;box-shadow:8px 0 30px #0003;display:none}.ds.lo .ds-left{display:flex}
.ds-right{display:none}.ds-stage{grid-column:2}.ds-top .mn button:not(:first-child),.ds-crumb,.ds-pro{display:none}.ds-bar{max-width:calc(100% - 16px);overflow-x:auto;scrollbar-width:none}.ds-bar button{flex:none}}
${RM ? '.ds *{animation:none!important;transition:none!important}' : ''}`);
  const I = (p, vb = 20) => `<svg viewBox="0 0 ${vb} ${vb}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const IC = {
    map: I('<rect x="2.5" y="2.5" width="15" height="15" rx="1"/><path d="M2.5 7.5h15M2.5 12.5h15M7.5 2.5v15M12.5 2.5v15"/>'),
    img: I('<rect x="2.5" y="3.5" width="15" height="13" rx="1.5"/><circle cx="7" cy="8" r="1.5"/><path d="M3 15l4.5-4.5 3 3 2.5-2.5 4.5 4.5"/>'),
    tok: I('<circle cx="6.5" cy="13" r="4"/><path d="M10 2.5l4.5 7.5h-9z"/><rect x="11" y="10" width="6.5" height="6.5" rx="1"/>'),
    lay: I('<rect x="2.5" y="2.5" width="15" height="15"/><path d="M2.5 7l4.5-4.5M2.5 12l9.5-9.5M2.5 17l15-15M7.5 17.5l10-10M12.5 17.5l5-5"/>'),
    bulb: I('<path d="M7 13.5c-1.6-1.2-2.5-2.8-2.5-4.6a5.5 5.5 0 0111 0c0 1.8-.9 3.4-2.5 4.6v1.5H7z"/><path d="M8 17.5h4"/>'),
    dice: I('<path d="M10 2l7 4v8l-7 4-7-4V6z"/><path d="M3 6l7 4 7-4M10 10v8"/><circle cx="7" cy="12" r=".6" fill="currentColor"/><circle cx="13.5" cy="8" r=".6" fill="currentColor"/>'),
    dl: I('<path d="M10 3v10M6 9.5l4 4 4-4M3.5 15.5v2h13v-2"/>'),
    r20: `<svg viewBox="0 0 20 20"><path d="M10 1.5l7.4 4.25v8.5L10 18.5l-7.4-4.25v-8.5z" fill="#c4278c"/><path d="M10 5l4.3 2.5v5L10 15l-4.3-2.5v-5z" fill="none" stroke="#fff" stroke-width="1.2"/></svg>`,
    mon: I('<rect x="2.5" y="3.5" width="15" height="10" rx="1"/><path d="M7 17h6M10 13.5V17"/>'),
    pan: I('<path d="M10 2.5v15M2.5 10h15M10 2.5l-2 2M10 2.5l2 2M10 17.5l-2-2M10 17.5l2-2M2.5 10l2-2M2.5 10l2 2M17.5 10l-2-2M17.5 10l-2 2"/>'),
    imgsel: I('<rect x="3" y="3" width="10" height="10" rx="1"/><circle cx="6.5" cy="6.5" r="1"/><path d="M3.5 12l3-3 2 2"/><path d="M11 10l6.5 3-3 1-1 3z" fill="currentColor"/>'),
    rect: I('<rect x="4" y="4" width="12" height="12"/><circle cx="4" cy="4" r="2" fill="currentColor"/><circle cx="16" cy="16" r="2" fill="currentColor"/>'),
    poly: I('<path d="M10 2.5l6.5 3.75v7.5L10 17.5l-6.5-3.75v-7.5z"/><circle cx="15" cy="5" r="2.2" fill="var(--pn)"/>'),
    path: I('<circle cx="6" cy="4.5" r="2"/><circle cx="14" cy="8" r="2"/><circle cx="6" cy="11.5" r="2"/><circle cx="12" cy="16" r="2"/><path d="M8 5l4 2M12 9l-4 2M8 12.5l2.5 2"/>'),
    free: I('<path d="M3 5l10-1 4 6-5 1 1 6-10-1z"/>'),
    line: I('<path d="M2.5 6l3.5 9 4-7 4 7 3.5-9"/><circle cx="2.5" cy="6" r="1.4" fill="currentColor"/><circle cx="10" cy="8" r="1.4" fill="currentColor"/><circle cx="17.5" cy="6" r="1.4" fill="currentColor"/>'),
    erase: I('<path d="M3 4h4M10 4h3M16 4v3M16 10v3M16 16h-3M10 16H7M3 16v-3M3 10V7"/><path d="M13 13l4 1.5-2 .5-.5 2z" fill="currentColor"/>'),
    door: I('<path d="M2 10h3M15 10h3"/><rect x="5" y="7.5" width="10" height="5" rx=".5"/>'),
    stair: I('<path d="M3 5h14M5 9h10M7 13h6M9 17h2"/>'),
    text: I('<path d="M5 4.5h10M10 4.5v11.5M8 16h4"/>'),
    stamp: I('<path d="M8 10V7a2 2 0 114 0v3"/><path d="M4 13h12v2.5H4zM6 10h8l1 3H5zM4 17.5h12"/>'),
    trash: I('<path d="M4 6h12M8 6V4h4v2M5.5 6l1 11h7l1-11"/>'),
    eye: I('<path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z"/><circle cx="10" cy="10" r="2.5"/>'),
    dung: I('<path d="M10 2.5l7 4v7l-7 4-7-4v-7z"/><path d="M3 6.5l7 4 7-4M10 10.5v7"/>'),
    help: I('<circle cx="10" cy="10" r="7.5"/><path d="M7.8 7.8a2.3 2.3 0 114 1.6c-.9.6-1.8 1.1-1.8 2.3"/><circle cx="10" cy="14.4" r=".5" fill="currentColor"/>'),
  };
  // ---------- styles (presets) ----------
  const PRESETS = [
    ['Classic Hatching', { bg: '#efeae2', bgGrid: 'dots', bgGridCol: '#8d8a83', floor: '#ffffff', gridCol: '#9a9a9a', grid: 'Neat', wall: '#000000', wallW: 5, rough: 1, hatch: 'classic', hatchCol: '#111111', shadow: 0, kind: 'line' }],
    ['Old School Module', { bg: '#4f93c4', bgGrid: 'dots', bgGridCol: '#86b6da', floor: '#ffffff', gridCol: '#8fbfe3', grid: 'Neat', wall: '#4f93c4', wallW: 1, rough: 0, hatch: 'none', hatchCol: '#000', shadow: 0, kind: 'line' }],
    ['Ancient Map', { bg: '#fdf4e3', bgGrid: 'dots', bgGridCol: '#c9b9a5', floor: '#fdf4e3', gridCol: '#e2cfc0', grid: 'Neat', wall: '#5b2a2a', wallW: 5, rough: 0, hatch: 'none', hatchCol: '#000', shadow: 0, kind: 'double' }],
    ['Gray Hatching', { bg: '#ececec', bgGrid: 'dots', bgGridCol: '#9b9b9b', floor: '#ffffff', gridCol: '#9a9a9a', grid: 'Neat', wall: '#111111', wallW: 5, rough: 1, hatch: 'classic', hatchCol: '#2a2a2a', shadow: 0, kind: 'line' }],
    ['Interior Wall Fill', { bg: '#ececec', bgGrid: 'dots', bgGridCol: '#8b8b8b', floor: '#f4f4f4', gridCol: '#a4a4a4', grid: 'Neat', wall: '#111111', wallW: 6, rough: 0, hatch: 'none', hatchCol: '#000', shadow: 0, kind: 'fill' }],
    ['Rough Cavern', { bg: '#ececec', bgGrid: 'dots', bgGridCol: '#9b9b9b', floor: '#ffffff', gridCol: '#a0a0a0', grid: 'Neat', wall: '#111111', wallW: 5, rough: 3, hatch: 'stone', hatchCol: '#7a7a7a', shadow: 0, kind: 'line' }],
    ['Gray Fill', { bg: '#8e8e8e', bgGrid: 'lines', bgGridCol: '#a5a5a5', floor: '#ffffff', gridCol: '#9c9c9c', grid: 'Neat', wall: '#111111', wallW: 3, rough: 0, hatch: 'none', hatchCol: '#000', shadow: 0, kind: 'line' }],
    ['Simple Shadow', { bg: '#ffffff', bgGrid: 'none', bgGridCol: '#bbb', floor: '#ffffff', gridCol: '#a8a8a8', grid: 'Neat', wall: '#3d3d3d', wallW: 7, rough: 0, hatch: 'none', hatchCol: '#000', shadow: 0.45, kind: 'line' }],
  ];
  const hs = (x, y, k = 0) => { let n = (x * 374761393 + y * 668265263 + k * 2147483647) | 0; n = (n ^ (n >>> 13)) * 1274126177 | 0; n ^= n >>> 16; return ((n >>> 0) % 10000) / 10000; };
  const K = (x, y) => x + ',' + y;
  // render a dungeon (cells are half-grid units) into a 2D context
  function render(g, W, H, vw, cells, st, opts = {}) {
    const u = vw.G / 2, ox = vw.ox, oy = vw.oy, sc = vw.G / 36;
    g.save(); g.clearRect(0, 0, W, H); g.fillStyle = st.bg; g.fillRect(0, 0, W, H);
    // background grid (dots / lines) in grid units
    const x0 = Math.floor(-ox / vw.G) - 1, x1 = Math.ceil((W - ox) / vw.G) + 1, y0 = Math.floor(-oy / vw.G) - 1, y1 = Math.ceil((H - oy) / vw.G) + 1;
    if (st.bgGrid === 'dots') { g.fillStyle = st.bgGridCol; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g.fillRect(ox + x * vw.G - 1, oy + y * vw.G - 1, 2, 2); }
    else if (st.bgGrid === 'lines') { g.strokeStyle = st.bgGridCol; g.lineWidth = 1; g.beginPath(); for (let x = x0; x <= x1; x++) { g.moveTo(ox + x * vw.G + 0.5, 0); g.lineTo(ox + x * vw.G + 0.5, H); } for (let y = y0; y <= y1; y++) { g.moveTo(0, oy + y * vw.G + 0.5); g.lineTo(W, oy + y * vw.G + 0.5); } g.stroke(); }
    const list = [...cells].map((k) => k.split(',').map(Number)); const has = (x, y) => cells.has(K(x, y));
    g.globalAlpha = opts.opacity ?? 1;
    // outside band: hatching or stone
    if (st.hatch !== 'none' && list.length) {
      const band = new Map(); const R = 2;
      for (const [cx, cy] of list) for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const x = cx + dx, y = cy + dy; if (has(x, y)) continue; const d = Math.max(Math.abs(dx), Math.abs(dy)); const k = K(x, y); if (!band.has(k) || band.get(k) > d) band.set(k, d); }
      g.lineCap = 'round';
      for (const [k, d] of band) { const [x, y] = k.split(',').map(Number); if (d === 2 && hs(x, y, 9) < 0.3) continue; const px = ox + x * u, py = oy + y * u;
        if (st.hatch === 'classic') { g.strokeStyle = st.hatchCol; g.lineWidth = 1.1 * sc; const n = 2 + (hs(x, y, 1) < 0.4 ? 1 : 0);
          for (let c = 0; c < n; c++) { const cxp = px + hs(x, y, 2 + c) * u, cyp = py + hs(x, y, 5 + c) * u, a = hs(x, y, 11 + c) * Math.PI, L = u * (0.6 + hs(x, y, 17 + c) * 0.4), m = 3 + Math.floor(hs(x, y, 23 + c) * 3), sp = u * 0.16;
            const ca = Math.cos(a), sa = Math.sin(a); g.beginPath(); for (let i = 0; i < m; i++) { const o = (i - (m - 1) / 2) * sp; const bx = cxp - sa * o, by = cyp + ca * o; g.moveTo(bx - ca * L / 2, by - sa * L / 2); g.lineTo(bx + ca * L / 2, by + sa * L / 2); } g.stroke(); } }
        else if (st.hatch === 'stone') { g.fillStyle = d === 1 ? '#6f6f6f' : '#8f8f8f'; g.strokeStyle = '#3c3c3c'; g.lineWidth = 0.8 * sc; g.beginPath(); const n = 6; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + hs(x, y, 3); const r = u * (0.55 + hs(x, y, 30 + i) * 0.35); const X = px + u / 2 + Math.cos(a) * r, Y = py + u / 2 + Math.sin(a) * r; i ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.closePath(); g.fill(); if (d === 1) g.stroke(); } }
    }
    // floor (+ optional shadow)
    const floor = () => { g.beginPath(); for (const [x, y] of list) g.rect(ox + x * u - 0.3, oy + y * u - 0.3, u + 0.6, u + 0.6); };
    if (st.shadow > 0 && list.length) { g.save(); g.shadowColor = `rgba(0,0,0,${st.shadow})`; g.shadowBlur = 14 * sc; g.shadowOffsetY = 3 * sc; g.fillStyle = st.floor; floor(); g.fill(); g.restore(); }
    g.fillStyle = st.floor; floor(); g.fill();
    // interior grid
    if (st.grid !== 'None' && list.length) { g.save(); floor(); g.clip(); g.strokeStyle = st.gridCol; g.lineWidth = (st.gridW || 1) * Math.max(0.6, sc * 0.9); if (st.grid === 'Dotted') g.setLineDash([2 * sc, 3 * sc]);
      const xs = list.map((c) => c[0]), ys = list.map((c) => c[1]); const gx0 = Math.floor(Math.min(...xs) / 2), gx1 = Math.ceil((Math.max(...xs) + 1) / 2), gy0 = Math.floor(Math.min(...ys) / 2), gy1 = Math.ceil((Math.max(...ys) + 1) / 2);
      g.beginPath(); for (let x = gx0; x <= gx1; x++) { g.moveTo(ox + x * vw.G, oy + gy0 * vw.G); g.lineTo(ox + x * vw.G, oy + gy1 * vw.G); } for (let y = gy0; y <= gy1; y++) { g.moveTo(ox + gx0 * vw.G, oy + y * vw.G); g.lineTo(ox + gx1 * vw.G, oy + y * vw.G); } g.stroke(); g.restore(); }
    // walls: boundary edges between filled and empty half-cells, jittered per vertex for roughness
    const rough = (st.rough || 0) + (opts.extraRough || 0); const J = (vx, vy) => rough ? [(hs(vx, vy, 41) - 0.5) * rough * 1.6 * sc, (hs(vx, vy, 43) - 0.5) * rough * 1.6 * sc] : [0, 0];
    const P = (vx, vy) => { const j = J(vx, vy); return [ox + vx * u / 2 + j[0], oy + vy * u / 2 + j[1]]; }; // vertices on quarter-grid lattice for roughness subdivisions
    const path = new Path2D(); const seg = (ax, ay, bx, by) => { const a = P(ax * 2, ay * 2), m = P(ax + bx, ay + by), b = P(bx * 2, by * 2); path.moveTo(...a); path.lineTo(...m); path.lineTo(...b); };
    for (const [x, y] of list) { if (!has(x, y - 1)) seg(x, y, x + 1, y); if (!has(x, y + 1)) seg(x, y + 1, x + 1, y + 1); if (!has(x - 1, y)) seg(x, y, x, y + 1); if (!has(x + 1, y)) seg(x + 1, y, x + 1, y + 1); }
    const w = st.wallW * 1.35 * sc; g.lineCap = 'round'; g.lineJoin = 'round';
    if (st.kind === 'double') { g.strokeStyle = st.wall; g.lineWidth = w * 2.1; g.stroke(path); g.strokeStyle = '#c99d96'; g.lineWidth = w * 1.1; g.stroke(path); g.strokeStyle = st.wall; g.lineWidth = Math.max(1, w * 0.25); g.stroke(path); }
    else if (st.kind === 'fill') { g.strokeStyle = st.wall; g.lineWidth = w * 2.2; g.stroke(path); const pc = document.createElement('canvas'); pc.width = pc.height = 8; const p2 = pc.getContext('2d'); p2.strokeStyle = '#fff'; p2.lineWidth = 1.6; p2.beginPath(); p2.moveTo(-2, 10); p2.lineTo(10, -2); p2.moveTo(-2, 2); p2.lineTo(2, -2); p2.moveTo(6, 10); p2.lineTo(10, 6); p2.stroke(); g.strokeStyle = g.createPattern(pc, 'repeat'); g.lineWidth = w * 1.3; g.stroke(path); }
    else { g.strokeStyle = st.wall; g.lineWidth = w; g.stroke(path); }
    // placed assets/tokens/labels
    for (const a of opts.items || []) drawItem(g, ox + a.x * u, oy + a.y * u, vw.G, a);
    g.restore();
  }
  function drawItem(g, x, y, G, a) {
    g.save(); g.translate(x, y); const s1 = G / 36; g.lineWidth = 1.6 * s1; g.strokeStyle = '#111'; g.fillStyle = '#fff';
    if (a.t === 'token') { g.fillStyle = a.c; g.beginPath(); g.arc(0, 0, G * 0.42, 0, 7); g.fill(); g.lineWidth = 2.5 * s1; g.strokeStyle = '#fff'; g.stroke(); g.fillStyle = '#fff'; g.font = `700 ${14 * s1}px 'Inter Variable'`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(a.l, 0, 1); }
    else if (a.t === 'text') { g.fillStyle = '#111'; g.font = `italic 600 ${15 * s1}px Georgia,serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(a.l, 0, 0); }
    else if (a.k === 'Barrel') { g.beginPath(); g.arc(0, 0, G * 0.32, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(0, 0, G * 0.18, 0, 7); g.stroke(); }
    else if (a.k === 'Chest') { g.beginPath(); g.rect(-G * 0.38, -G * 0.24, G * 0.76, G * 0.48); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-G * 0.38, -G * 0.04); g.lineTo(G * 0.38, -G * 0.04); g.stroke(); }
    else if (a.k === 'Table') { g.beginPath(); g.rect(-G * 0.8, -G * 0.45, G * 1.6, G * 0.9); g.fill(); g.stroke(); }
    else if (a.k === 'Stairs') { g.beginPath(); g.rect(-G * 0.5, -G * 0.9, G, G * 1.8); g.fill(); g.stroke(); for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(-G * 0.5, -G * 0.9 + i * G * 0.3); g.lineTo(G * 0.5, -G * 0.9 + i * G * 0.3); g.stroke(); } }
    else if (a.k === 'Pillar') { g.fillStyle = '#111'; g.beginPath(); g.arc(0, 0, G * 0.25, 0, 7); g.fill(); }
    else { g.beginPath(); g.moveTo(0, -G * 0.4); g.lineTo(G * 0.35, G * 0.3); g.lineTo(-G * 0.35, G * 0.3); g.closePath(); g.fill(); g.stroke(); }
    g.restore();
  }
  // ---------- state ----------
  const S = { preset: 0, style: { ...PRESETS[0][1], gridW: 1 }, tool: 'rect', mode: 'draw', snap: true, div: 2, roughOn: false, radius: 0, opacity: 1, dark: false, tab: 'map', layer: 1, place: null };
  const room = (cs, x, y, w, hh) => { for (let j = 0; j < hh; j++) for (let i = 0; i < w; i++) cs.add(K(x + i, y + j)); };
  const DEFAULT = () => { const c = new Set(); room(c, 0, 0, 16, 12); room(c, 16, 4, 10, 4); room(c, 26, -2, 10, 10); room(c, 4, 12, 4, 4); room(c, 0, 16, 12, 8); room(c, 30, 8, 2, 8); room(c, 26, 16, 10, 6); return c; };
  let cells = DEFAULT(); let items = [{ t: 'asset', k: 'Table', x: 8, y: 6 }, { t: 'asset', k: 'Barrel', x: 33, y: 1 }, { t: 'asset', k: 'Chest', x: 6, y: 20 }, { t: 'token', c: '#c94545', l: 'F', x: 29, y: 3 }, { t: 'text', l: 'Crypt', x: 31, y: 19 }];
  const vw = { G: 36, ox: 0, oy: 0 };
  // ---------- layout ----------
  const el = h('div.ds'); root.append(el);
  const sgFn = (opts, get, set) => { const w = h('div.ds-sg'); const draw = () => w.replaceChildren(...opts.map(([v, l]) => h('button' + (get() === v ? '.on' : ''), { onclick: () => { set(v); draw(); } }, l))); draw(); w.redraw = draw; return w; };
  const ltB = h('button.ds-lt', { title: 'Toggle light / dark', onclick: () => { S.dark = !S.dark; el.classList.toggle('dark', S.dark); ltB.lastChild.textContent = S.dark ? 'Dark' : 'Light'; ltB.firstChild.textContent = S.dark ? '☾' : '☀'; } }, h('i', {}, '☀'), 'Light');
  const menu = (n) => h('button', { onclick: () => toast(`${n} menu`) }, n);
  el.append(h('div.ds-top', {}, h('div.mn', {}, ['File', 'Edit', 'View', 'Help', 'Language'].map(menu)), h('div.ds-crumb', {}, h('span', { style: { opacity: 0.55 } }, 'My Maps / '), 'Map'), h('span.ds-sp'),
    h('button.ds-pro', { onclick: () => toast('Get Pro — floor textures, more presets') }, '✦ Get Pro'), h('button.ds-su', { onclick: () => toast('Sign up (demo)') }, 'Sign up'), h('button', { onclick: () => toast('Sign in (demo)') }, 'Sign in'), ltB));
  const railDefs = [['map', 'Map · Dungeon presets', IC.map], ['assets', 'Assets', IC.img], ['tokens', 'Tokens', IC.tok], ['layers', 'Layers', IC.lay], ['light', 'Lighting', IC.bulb], ['dice', 'Dice', IC.dice], ['export', 'Export', IC.dl], ['r20', 'Roll20', IC.r20], ['present', 'Present', IC.mon]];
  const railBs = {}; const rail = h('div.ds-rail', {}, railDefs.map(([k, t, ic]) => (railBs[k] = h('button', { title: t, html: ic, onclick: () => setTab(k) }))));
  const left = h('div.ds-left'); const leftBody = h('div', { style: { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } });
  // presets
  const preBs = PRESETS.map(([n, st], i) => { const c = h('canvas'); c.width = c.height = 200; const b = h('button.ds-pre', { title: n, onclick: () => setPreset(i) }, c, h('span', {}, n)); const pc = new Set(); room(pc, 2, 2, 12, 12); render(c.getContext('2d'), 200, 200, { G: 44, ox: 18, oy: 18 }, pc, { ...st, gridW: 1 }); return b; });
  const presetGrid = h('div.ds-presets', {}, preBs);
  const secH = h('div.ds-sec', { style: { cursor: 'pointer' }, onclick: () => { secH.classList.toggle('cl'); presetGrid.style.display = secH.classList.contains('cl') ? 'none' : ''; } }, h('span.chev', {}, '⌄'), h('span', { html: IC.dung, style: { width: '15px', height: '15px', display: 'inline-flex' } }), 'Dungeon Presets');
  // rectangle tool options
  const toolTitle = h('span', {}, 'Rectangle Tool');
  const modeSg = sgFn([['draw', 'Draw'], ['erase', 'Erase']], () => S.mode, (v) => (S.mode = v));
  const snapSg = sgFn([[true, 'On'], [false, 'Off']], () => S.snap, (v) => (S.snap = v));
  const roughSg = sgFn([[true, 'On'], [false, 'Off']], () => S.roughOn, (v) => { S.roughOn = v; draw(); });
  const divIn = h('input.ds-num', { type: 'number', min: 1, max: 4, value: 2, oninput: (e) => (S.div = clamp(+e.target.value || 1, 1, 4)) });
  const radNum = h('input.ds-num', { type: 'number', min: 0, max: 4, value: 0 }), radSl = h('input', { type: 'range', min: 0, max: 4, step: 1, value: 0 });
  const setRad = (v) => { S.radius = clamp(+v || 0, 0, 4); radNum.value = S.radius; radSl.value = S.radius; }; radNum.oninput = (e) => setRad(e.target.value); radSl.oninput = (e) => setRad(e.target.value);
  const toolPanel = h('div.ds-tool', {}, h('div.ds-sec', { style: { padding: '6px 0 2px' } }, toolTitle, h('span.ds-sp'), '⌄'),
    h('div.rw', {}, h('label', {}, 'Mode'), modeSg, h('span.ds-k', {}, 'E')), h('div.rw', {}, h('label', {}, 'Snap'), snapSg, h('span.ds-k', {}, 'S')),
    h('div.rw', {}, h('label', {}, 'Division'), h('div.k-row', { style: { gap: '6px', justifyContent: 'flex-end' } }, '1 /', divIn), h('span.ds-k', { title: 'Grid subdivisions to snap to', style: { background: 'none', color: 'var(--mut)', fontSize: '12px' } }, '?')),
    h('div.rw', {}, h('label', {}, 'Rough'), roughSg, h('span.ds-k', {}, '⇧+R')), h('div.rw', { style: { gridTemplateColumns: '62px 46px 1fr' } }, h('label', {}, 'Corner radius'), radNum, radSl));
  left.append(leftBody, toolPanel);
  // stage + floating toolbar
  const stage = h('div.ds-stage'); const cv = h('canvas.ds-cv'); const g = cv.getContext('2d'); const tip = h('div.ds-tip');
  const TOOLS = [['select', 'Select (V)', '<span class="b">B</span>'], ['pan', 'Pan (Space)', IC.pan], ['imgsel', 'Select image', IC.imgsel], ['rect', 'Rectangle (R)', IC.rect], ['poly', 'Polygon (P)', IC.poly], ['path', 'Path', IC.path], ['free', 'Freeform polygon', IC.free], ['line', 'Line / Bezier wall', IC.line], ['erase', 'Eraser selection', IC.erase], ['door', 'Door', IC.door], ['stair', 'Stairs', IC.stair], ['text', 'Text (T)', IC.text], ['mirror', 'Stamp / Mirror', IC.stamp]];
  const toolBs = {}; const bar = h('div.ds-bar', {}, TOOLS.map(([k, t, ic]) => (toolBs[k] = h('button', { title: t, html: ic, onclick: () => setTool(k), onpointerenter: () => { tip.textContent = t; tip.classList.add('on'); }, onpointerleave: () => tip.classList.remove('on') }))));
  stage.append(cv, bar, tip);
  // right sidebar
  const right = h('div.ds-right'); const layerName = () => `${PRESETS[S.preset][0]} 1`;
  const layerList = h('div'); const insTitle = h('span');
  const drawLayers = () => { layerList.replaceChildren(...[['Images', IC.img], [layerName(), IC.dung], ['Background', '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3l7 7-7 7-7-7z"/></svg>']].map(([n, ic], i) => h('div.ds-li' + (S.layer === i ? '.on' : ''), { onclick: () => { S.layer = i; drawLayers(); } }, h('span', { html: ic, style: { display: 'inline-flex' } }), n))); insTitle.textContent = layerName(); };
  const colorF = (label, key) => { const sw = h('i'); const tx = h('span'); const inp = h('input', { type: 'color', oninput: (e) => { S.style[key] = e.target.value; upd(); draw(); } }); const upd = () => { sw.style.background = S.style[key]; tx.textContent = S.style[key].toUpperCase(); inp.value = S.style[key]; }; upd(); const f = h('div.ds-f', {}, h('span', {}, label), h('label.ds-col', {}, sw, tx, inp)); f.upd = upd; return f; };
  const numSl = (label, key, min, max, on) => { const n = h('input.ds-num', { type: 'number', min, max, value: S.style[key] }); const r = h('input', { type: 'range', min, max, step: 1, value: S.style[key] }); const set = (v) => { S.style[key] = clamp(+v || min, min, max); n.value = r.value = S.style[key]; on?.(); draw(); }; n.oninput = (e) => set(e.target.value); r.oninput = (e) => set(e.target.value); const f = h('div.ds-f', {}, h('span', {}, label), h('div.ds-nr', {}, n, r)); f.upd = () => { n.value = r.value = S.style[key]; }; f.set = set; return f; };
  const opN = h('input.ds-num', { type: 'number', min: 0, max: 1, step: 0.1, value: 1 }), opR = h('input', { type: 'range', min: 0, max: 1, step: 0.05, value: 1 });
  const setOp = (v) => { S.opacity = clamp(+v, 0, 1); opN.value = S.opacity; opR.value = S.opacity; draw(); }; opN.oninput = (e) => setOp(e.target.value); opR.oninput = (e) => setOp(e.target.value);
  const wallCol = colorF('Color', 'wall'), wallW = numSl('Width', 'wallW', 1, 15), floorCol = colorF('Color', 'floor'), gridCol = colorF('Color', 'gridCol'), gridW = numSl('Width', 'gridW', 1, 4);
  const roughW = sgFn([[0, 'Hide'], [1, '1'], [2, '2'], [3, '3']], () => S.style.rough, (v) => { S.style.rough = v; draw(); });
  let lightBlock = true; const lightSg = sgFn([[true, 'Yes'], [false, 'No']], () => lightBlock, (v) => (lightBlock = v));
  const gridSel = h('select.ds-selx', { onchange: (e) => { S.style.grid = e.target.value; draw(); } }, ['Neat', 'Dotted', 'None'].map((v) => h('option', { value: v }, v)));
  const shN = h('input.ds-num', { type: 'number', min: 0, max: 1, step: 0.05 }), shR = h('input', { type: 'range', min: 0, max: 1, step: 0.05 });
  const setSh = (v) => { S.style.shadow = clamp(+v || 0, 0, 1); shN.value = shR.value = S.style.shadow; draw(); }; shN.oninput = (e) => setSh(e.target.value); shR.oninput = (e) => setSh(e.target.value);
  const blendSel = h('select.ds-selx', {}, ['Multiply', 'Normal', 'Darken'].map((v) => h('option', { value: v }, v)));
  const eye = () => h('span.ds-eye', { html: IC.eye, style: { display: 'inline-flex' } });
  right.append(h('div.ds-hd', {}, 'Maps', h('span', { style: { opacity: 0.6 } }, '⌃')), h('div.ds-li.on', {}, h('span', { html: IC.map, style: { display: 'inline-flex' } }), 'Map'), h('div.ds-add', {}, h('span', {}, '+ Add map'), h('span', {}, '+ Import save file')),
    h('div.ds-hd', { style: { borderTop: '1px solid var(--ln)' } }, 'Layers', h('button', { onclick: () => toast('Add layer'), style: { fontSize: '16px' } }, '+')), layerList,
    h('div.ds-ins', {}, h('div.ds-grp', {}, h('div.gh', {}, h('span.k-row', { style: { gap: '6px' } }, h('span', { html: IC.dung, style: { display: 'inline-flex', width: '14px' } }), insTitle), h('span.k-row', { style: { gap: '8px' } }, h('span', { html: IC.trash, style: { display: 'inline-flex', width: '14px', opacity: 0.6 } }), eye())),
      h('div.ds-f.top', {}, h('span', {}, 'Opacity'), h('div.ds-nr', {}, opN, opR))),
    h('div.ds-grp', {}, h('div.gh', {}, h('span', {}, 'Floor options', h('span.ds-badge', {}, 'PRO'))), h('div.ds-f.top', {}, h('span', {}, 'Floor texture'), h('select.ds-selx', { onchange: () => toast('Floor textures are a Pro feature') }, h('option', {}, 'None'), h('option', {}, 'Stone tiles'), h('option', {}, 'Wood planks')))),
    h('div.ds-grp', {}, h('div.gh', {}, 'Walls', eye()), wallCol, wallW, h('div.ds-f', {}, h('span', {}, 'Roughness'), roughW), h('div.ds-f', {}, h('span', {}, 'Blocks light'), lightSg)),
    h('div.ds-grp', {}, h('div.gh', {}, 'Floor', eye()), floorCol),
    h('div.ds-grp', {}, h('div.gh', {}, 'Grid', eye()), h('div.ds-f', {}, h('span', {}, 'Variant'), gridSel), gridCol, gridW),
    h('div.ds-grp', {}, h('div.gh', {}, 'Shadow', eye()), h('div.ds-f', {}, h('span', {}, 'Blend'), blendSel), h('div.ds-f', {}, h('span', {}, 'Opacity'), h('div.ds-nr', {}, shN, shR)))));
  el.append(rail, left, stage, right);
  const syncIns = () => { [wallCol, wallW, floorCol, gridCol, gridW].forEach((f) => f.upd()); roughW.redraw(); gridSel.value = S.style.grid; shN.value = shR.value = S.style.shadow; drawLayers(); };
  // left tabs
  const ASSETS = ['Table', 'Barrel', 'Chest', 'Stairs', 'Pillar', 'Statue'];
  const TOKENS = [['F', '#c94545', 'Fighter'], ['W', '#3d6fd8', 'Wizard'], ['R', '#3a9a5b', 'Rogue'], ['C', '#c49a2a', 'Cleric'], ['G', '#6d4aa8', 'Goblin'], ['O', '#555', 'Ogre']];
  const assetSvg = (k) => { const c = h('canvas'); c.width = c.height = 72; drawItem(c.getContext('2d'), 36, 36, k === 'Table' || k === 'Stairs' ? 26 : 40, { t: 'asset', k }); return c; };
  function setTab(k) { if (['light', 'dice', 'export', 'r20', 'present'].includes(k)) { toast({ light: 'Lighting (Pro)', dice: 'Dice roller', export: 'Export PNG / save file', r20: 'Send to Roll20', present: 'Presentation mode' }[k]); if (k === 'export') { const a = h('a', { href: cv.toDataURL('image/png'), download: 'dungeon-map.png' }); a.click(); } return; }
    if (!booting && matchMedia('(max-width:760px)').matches) el.classList.toggle('lo', !(S.tab === k && el.classList.contains('lo'))); S.tab = k; for (const [kk, b] of Object.entries(railBs)) b.classList.toggle('on', kk === k);
    if (k === 'map') leftBody.replaceChildren(secH, presetGrid);
    else if (k === 'assets' || k === 'tokens') { const grid = h('div.ds-assets', {}, (k === 'assets' ? ASSETS.map((a) => [a, a]) : TOKENS.map(([l, c, n]) => [n, l, c])).map(([n, l, c]) => { const b = h('button.ds-asset' + (S.place?.n === n ? '.on' : ''), { title: n + ' — click, then click the map', onclick: () => { S.place = k === 'assets' ? { n, t: 'asset', k: n } : { n, t: 'token', l, c }; setTab(k); toast(`Click the map to place ${n}`); } }); if (k === 'assets') b.append(assetSvg(n)); else b.append(h('span', { style: { width: '34px', height: '34px', borderRadius: '50%', background: c, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, boxShadow: '0 0 0 2px #fff,0 0 0 3px #0002' } }, l)); return b; }));
      leftBody.replaceChildren(h('div.ds-sec', {}, '⌄ ', k === 'assets' ? 'Assets' : 'Tokens'), grid); }
    else { const ll = h('div'); ll.append(...['Images', layerName(), 'Background'].map((n, i) => h('div.ds-li' + (S.layer === i ? '.on' : ''), {}, n))); leftBody.replaceChildren(h('div.ds-sec', {}, '⌄ Layers'), ll); }
  }
  function setTool(k) { S.tool = k; S.place = null; for (const [kk, b] of Object.entries(toolBs)) b.classList.toggle('on', kk === k); const n = TOOLS.find((t) => t[0] === k)[1].replace(/\s*\(.*\)/, ''); toolTitle.textContent = `${n} Tool`;
    cv.className = 'ds-cv' + (k === 'pan' ? ' pan' : k === 'select' || k === 'imgsel' ? ' sel' : '');
    if (['poly', 'path', 'free', 'line', 'door', 'stair', 'mirror'].includes(k)) toast(`${n}: drag draws a snapped room in this clone`); }
  function setPreset(i) { S.preset = i; S.style = { ...PRESETS[i][1], gridW: S.style.gridW || 1 }; preBs.forEach((b, j) => b.classList.toggle('on', j === i)); syncIns(); draw(); if (!RM) { cv.classList.remove('ds-fade'); void cv.offsetWidth; cv.classList.add('ds-fade'); } }
  // ---------- canvas ----------
  let preview = null; const dpr = Math.min(2, window.devicePixelRatio || 1);
  function size() { const r = stage.getBoundingClientRect(); const W = Math.max(200, r.width), H = Math.max(200, r.height); if (cv._w === W && cv._h === H) return; cv._w = W; cv._h = H; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; }
  function center() { size(); const xs = [...cells].map((k) => +k.split(',')[0]), ys = [...cells].map((k) => +k.split(',')[1]); const gw = (Math.max(...xs) - Math.min(...xs) + 1) / 2, gh = (Math.max(...ys) - Math.min(...ys) + 1) / 2; vw.G = clamp(Math.min(cv._w / (gw + 4), (cv._h - 60) / (gh + 4)), 16, 36); const u = vw.G / 2; const cx = (Math.min(...xs) + Math.max(...xs) + 1) / 2, cy = (Math.min(...ys) + Math.max(...ys) + 1) / 2; vw.ox = Math.round(cv._w / 2 - cx * u); vw.oy = Math.round(cv._h / 2 - 20 - cy * u); vw.ox -= vw.ox % 1; }
  function draw() { size(); g.setTransform(dpr, 0, 0, dpr, 0, 0); render(g, cv._w, cv._h, vw, cells, S.style, { opacity: S.opacity, extraRough: S.roughOn ? 1 : 0, items });
    if (preview) { const u = vw.G / 2; g.save(); g.strokeStyle = S.mode === 'erase' ? '#1f6fe5' : '#c94545'; g.lineWidth = 2; g.setLineDash([6, 4]); g.fillStyle = S.mode === 'erase' ? '#1f6fe522' : '#c9454522'; g.fillRect(vw.ox + preview.x * u, vw.oy + preview.y * u, preview.w * u, preview.h * u); g.strokeRect(vw.ox + preview.x * u, vw.oy + preview.y * u, preview.w * u, preview.h * u); g.restore(); } }
  const toCell = (e) => { const r = cv.getBoundingClientRect(); const u = vw.G / 2; return { x: (e.clientX - r.left - vw.ox) / u, y: (e.clientY - r.top - vw.oy) / u }; };
  const snapV = (v, up) => { if (!S.snap) return up ? Math.ceil(v) : Math.floor(v); const st = 2 / S.div >= 1 ? Math.round(2 / S.div) : 1; return (up ? Math.ceil(v / st) : Math.floor(v / st)) * st; };
  const rectOf = (a, b) => { const x0 = snapV(Math.min(a.x, b.x), false), y0 = snapV(Math.min(a.y, b.y), false), x1 = Math.max(x0 + 1, snapV(Math.max(a.x, b.x), true)), y1 = Math.max(y0 + 1, snapV(Math.max(a.y, b.y), true)); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; };
  function applyRect(R, erase) { const rr = S.radius * 2; let n = 0;
    for (let j = 0; j < R.h; j++) for (let i = 0; i < R.w; i++) { if (rr) { const cx = i < rr ? rr : i >= R.w - rr ? R.w - rr : null, cy = j < rr ? rr : j >= R.h - rr ? R.h - rr : null; if (cx != null && cy != null && Math.hypot(i + 0.5 - cx, j + 0.5 - cy) > rr) continue; }
      const k = K(R.x + i, R.y + j); if (erase) { if (cells.delete(k)) n++; } else if (!cells.has(k)) { cells.add(k); n++; } } return n; }
  let st0 = null, panSt = null;
  drag(cv, {
    start: (e) => { const p = toCell(e);
      if (S.place) { items.push({ ...S.place, x: Math.round(p.x), y: Math.round(p.y) }); draw(); return false; }
      if (S.tool === 'text') { const l = prompt('Label text', 'Room ' + (items.filter((i) => i.t === 'text').length + 1)); if (l) { items.push({ t: 'text', l, x: p.x, y: p.y }); draw(); } return false; }
      if (S.tool === 'pan') { panSt = { x: e.clientX, y: e.clientY, ox: vw.ox, oy: vw.oy }; cv.style.cursor = 'grabbing'; return; }
      if (S.tool === 'select' || S.tool === 'imgsel') return false; st0 = p; preview = rectOf(p, p); draw(); },
    move: (e) => { if (panSt) { vw.ox = panSt.ox + e.clientX - panSt.x; vw.oy = panSt.oy + e.clientY - panSt.y; draw(); return; } if (!st0) return; preview = rectOf(st0, toCell(e)); draw(); },
    end: () => { if (panSt) { panSt = null; cv.style.cursor = ''; return; } if (!st0) return; const erase = S.mode === 'erase' || S.tool === 'erase'; const n = applyRect(preview, erase); preview = null; st0 = null; draw(); cv.dataset.last = `${erase ? 'erased' : 'added'} ${n}`; },
  });
  cv.addEventListener('wheel', (e) => { e.preventDefault(); const r = cv.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top; const G2 = clamp(vw.G * (e.deltaY < 0 ? 1.1 : 1 / 1.1), 14, 90); vw.ox = mx - (mx - vw.ox) * (G2 / vw.G); vw.oy = my - (my - vw.oy) * (G2 / vw.G); vw.G = G2; draw(); }, { passive: false });
  const onKey = (e) => { if (!root.isConnected) return removeEventListener('keydown', onKey); if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return; const k = e.key.toLowerCase();
    if (k === 'e') { S.mode = S.mode === 'erase' ? 'draw' : 'erase'; modeSg.redraw(); } else if (k === 's') { S.snap = !S.snap; snapSg.redraw(); } else if (k === 'r' && e.shiftKey) { S.roughOn = !S.roughOn; roughSg.redraw(); draw(); } else if (k === 'r') setTool('rect'); else if (k === 'v') setTool('select'); else if (k === 'p') setTool('poly'); else if (k === 't') setTool('text'); };
  addEventListener('keydown', onKey);
  new ResizeObserver(() => { const had = cv._w; size(); if (!had) center(); draw(); }).observe(stage);
  let booting = true; setTab('map'); booting = false; setTool('rect'); setPreset(0); size(); center(); draw();
  window.__demoProof = async () => { const o = []; const px = (x, y) => { const d = g.getImageData(Math.round(x * dpr), Math.round(y * dpr), 1, 1).data; return rgbToHex(d[0], d[1], d[2]); };
    const c0 = cells.size; o.push(`default preset=${PRESETS[S.preset][0]} bg=${px(8, 8)} cells=${c0}`);
    preBs[1].click(); await sleep(60); o.push(`preset→${layerName()} bg=${px(8, 8)} layers[1]="${layerList.children[1].textContent}"`);
    preBs[2].click(); o.push(`preset→Ancient Map bg=${px(8, 8)}`); preBs[5].click(); o.push(`preset→Rough Cavern roughness=${S.style.rough}`);
    preBs[0].click(); await sleep(40);
    setTool('rect'); const u = vw.G / 2; const ax = vw.ox + 40 * u, ay = vw.oy + 2 * u; await gesture(cv, [[ax, ay], [ax + 40, ay + 30], [ax + 4 * vw.G, ay + 3 * vw.G]], 4); o.push(`rect drag (snap ${S.snap}, div ${S.div}) ${cv.dataset.last} cells → ${cells.size}`);
    S.mode = 'erase'; modeSg.redraw(); await gesture(cv, [[ax + 6, ay + 6], [ax + vw.G * 2, ay + vw.G * 2]], 4); o.push(`erase mode ${cv.dataset.last}`);
    wallW.set(9); o.push(`walls width→${S.style.wallW}`); toolBs.pan.click(); o.push(`toolbar active=${bar.querySelector('.on')?.title}`); ltB.click(); o.push(`theme dark=${el.classList.contains('dark')}`);
    // restore defaults
    ltB.click(); S.mode = 'draw'; modeSg.redraw(); cells = DEFAULT(); wallW.set(5); setPreset(0); setTool('rect'); center(); draw(); o.push(`restored Classic Hatching cells=${cells.size} tool=${S.tool}`); return o.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['kleki-layered-paint-desk'])(root, T); }
