import { h, s, css, drag, localPos, clamp, toast, sleep, audio, copy } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle } from '../kit.js';
css(`
.ng{position:absolute;inset:0;overflow:hidden}.ng svg.w{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.ng .nd{position:absolute;min-width:120px;background:var(--node,#2e2e2e);border:1px solid var(--nline,#444);border-radius:var(--nr,6px);color:var(--nfg,#eee);font-size:12px;box-shadow:0 4px 16px #0004;user-select:none}
.ng .nd.sel{outline:2px solid var(--ac)}
.ng .nt{padding:5px 8px;font-weight:700;cursor:grab;background:var(--nhead,#3a3a3a);border-radius:var(--nr,6px) var(--nr,6px) 0 0;display:flex;justify-content:space-between;gap:10px}
.ng .nb{padding:6px 8px;display:grid;gap:3px}
.ng .pr{display:flex;justify-content:space-between;gap:14px;align-items:center;min-height:18px}
.ng .pt{width:11px;height:11px;border-radius:var(--pr,2px);background:var(--port,#ff9f1c);cursor:crosshair;flex:none;border:1px solid #0006}
.ng .pt.in{margin-left:-14px}.ng .pt.out{margin-right:-14px}.ng .pt.arm{box-shadow:0 0 0 3px #fff}
.ng .picker{position:absolute;background:#1b1b1b;border:1px solid #555;border-radius:8px;padding:8px;display:grid;grid-template-columns:repeat(3,1fr);gap:4px;z-index:5;box-shadow:0 10px 40px #0008}
.ng .picker button{background:#2c2c2c;color:#eee;border:1px solid #444;border-radius:5px;padding:6px 10px;font-size:12px}
.knob{width:34px;height:34px;border-radius:50%;background:conic-gradient(var(--ac) var(--v,50%),#555 0);display:grid;place-items:center;cursor:ns-resize}
.knob::after{content:'';width:24px;height:24px;border-radius:50%;background:var(--node,#2e2e2e)}
`);
// generic node-graph core
export function graph(host, o = {}) {
  const wrap = h('div.ng'); host.append(wrap); const svg = s('svg', { class: 'w' }); wrap.append(svg);
  const st = { nodes: [], wires: [], arm: null, sel: null };
  const wireColor = o.wireColor || (() => '#ffb000');
  function portPos(n, kind, i) { const el = n.el.querySelectorAll('.pt.' + kind)[i]; if (!el) return [n.x, n.y]; const r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect(); return [r.left - w.left + r.width / 2, r.top - w.top + r.height / 2]; }
  function drawWires() { svg.replaceChildren(...st.wires.map((wi, k) => { const [x1, y1] = portPos(wi.a, 'out', wi.ao), [x2, y2] = portPos(wi.b, 'in', wi.bi); const dx = Math.max(40, Math.abs(x2 - x1) * 0.5); const d = o.straight ? `M${x1} ${y1}L${x2} ${y2}` : o.sag ? `M${x1} ${y1}C${x1} ${y1 + 80},${x2} ${y2 + 80},${x2} ${y2}` : `M${x1} ${y1}C${x1 + dx} ${y1},${x2 - dx} ${y2},${x2} ${y2}`; const c = wireColor(wi, k); return s('g', {}, o.glow ? s('path', { d, stroke: c, 'stroke-width': 8, fill: 'none', opacity: 0.25 }) : null, s('path', { d, stroke: c, 'stroke-width': o.wireW || 2.5, fill: 'none', 'stroke-linecap': 'round' })); })); o.onchange?.(st); }
  function add(def, x, y) {
    const n = { ...def, x, y, v: { ...(def.v || {}) } };
    const ins = (def.ins || []).map((p, i) => h('div.pr', {}, h('span.pt.in', { 'data-i': i, onclick: (e) => { e.stopPropagation(); if (st.arm) { st.wires = st.wires.filter((w) => !(w.b === n && w.bi === i)); st.wires.push({ a: st.arm.n, ao: st.arm.i, b: n, bi: i }); st.arm.el.classList.remove('arm'); st.arm = null; drawWires(); } else { st.wires = st.wires.filter((w) => !(w.b === n && w.bi === i)); drawWires(); } } }), h('span', {}, p), h('span')));
    const outs = (def.outs || []).map((p, i) => h('div.pr', {}, h('span'), h('span', {}, p), h('span.pt.out', { onclick: (e) => { e.stopPropagation(); st.arm?.el.classList.remove('arm'); st.arm = { n, i, el: e.target }; e.target.classList.add('arm'); } })));
    const title = h('div.nt', {}, def.title, def.badge ? h('span', { style: { opacity: .6 } }, def.badge) : null);
    const body = h('div.nb', {}, ins, def.body ? def.body(n) : null, outs);
    n.el = h('div.nd', { style: { left: x + 'px', top: y + 'px', ...(def.style || {}) } }, title, body);
    n.el.addEventListener('pointerdown', (e) => { st.sel?.el.classList.remove('sel'); st.sel = n; n.el.classList.add('sel'); e.stopPropagation(); });
    let ox, oy; drag(title, { start: (e) => { const p = localPos(e, wrap); ox = p.x - n.x; oy = p.y - n.y; }, move: (e) => { const p = localPos(e, wrap); n.x = p.x - ox; n.y = p.y - oy; n.el.style.left = n.x + 'px'; n.el.style.top = n.y + 'px'; drawWires(); } });
    wrap.append(n.el); st.nodes.push(n); requestAnimationFrame(drawWires); return n;
  }
  const connect = (a, ao, b, bi) => { st.wires.push({ a, ao, b, bi }); drawWires(); };
  const remove = (n) => { st.nodes = st.nodes.filter((x) => x !== n); st.wires = st.wires.filter((w) => w.a !== n && w.b !== n); n.el.remove(); drawWires(); };
  window.addEventListener('keydown', (e) => { if ((e.key === 'Delete' || e.key === 'Backspace') && st.sel && document.activeElement === document.body) { remove(st.sel); st.sel = null; } });
  if (o.types) wrap.addEventListener('click', (e) => { if (e.target !== wrap && e.target !== svg) return; wrap.querySelector('.picker')?.remove(); const p = localPos(e, wrap); const pk = h('div.picker', { style: { left: p.x + 'px', top: p.y + 'px' } }, Object.keys(o.types).map((k) => h('button', { onclick: (ev) => { ev.stopPropagation(); add(o.types[k], p.x, p.y); pk.remove(); o.onadd?.(); } }, k))); wrap.append(pk); });
  new ResizeObserver(drawWires).observe(wrap);
  return Object.assign(st, { wrap, svg, add, connect, remove, drawWires });
}
function knob(n, key, min, max, on) { const k = h('div.knob'); const set = () => k.style.setProperty('--v', ((n.v[key] - min) / (max - min)) * 100 + '%'); set(); let y0, v0; drag(k, { start: (e) => { y0 = e.clientY; v0 = n.v[key]; }, move: (e) => { n.v[key] = clamp(v0 + ((y0 - e.clientY) / 150) * (max - min), min, max); set(); lab.textContent = n.v[key].toFixed(1); on?.(); } }); const lab = h('span', { style: { fontFamily: 'monospace' } }, n.v[key].toFixed(1)); return h('div.k-row', {}, k, lab); }
const V = {};
V['noisecraft-node-audio-graph'] = (root, T) => {
  theme(root, T, { bg: '#222', fg: '#eee', ac: '#3ec74a', dark: true });
  let ac, running = [];
  const TY = {
    Knob: { title: 'Knob', outs: ['out'], v: { val: 220 }, body: (n) => knob(n, 'val', 40, 880) },
    Sine: { title: 'Sine', ins: ['freq', 'sync'], outs: ['out'] }, Saw: { title: 'Saw', ins: ['freq'], outs: ['out'] }, Noise: { title: 'Noise', outs: ['out'] },
    Filter: { title: 'Filter', ins: ['in', 'cutoff', 'reso'], outs: ['out'] }, ADSR: { title: 'ADSR', ins: ['gate', 'att', 'dec', 'sus', 'rel'], outs: ['out'] },
    Mul: { title: 'Mul', ins: ['in0', 'in1'], outs: ['out'] }, Add: { title: 'Add', ins: ['in0', 'in1'], outs: ['out'] }, Clock: { title: 'Clock', badge: '120', outs: ['out'] },
    MonoSeq: { title: 'MonoSeq', ins: ['clock', 'gateT'], outs: ['freq', 'gate'], body: () => h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(8,10px)', gap: '2px' } }, Array.from({ length: 32 }, (_, i) => h('i', { style: { height: '10px', background: [0, 10, 19, 29].includes(i) ? '#ff9f1c' : '#444' }, onclick: (e) => (e.target.style.background = e.target.style.background.includes('255') ? '#444' : '#ff9f1c') }))) },
    AudioOut: { title: 'AudioOut', ins: ['left', 'right'] },
  };
  const g = graph(root, { types: TY, wireColor: (w) => ({ Knob: '#ff9f1c', Sine: '#3ec7ff', Saw: '#3ec7ff', Filter: '#c77dff', Clock: '#7cf29a', MonoSeq: '#ffe45e' }[w.a.title] || '#ff5d5d'), onadd: () => (hint.style.display = 'none') });
  const hint = h('div', { style: { position: 'absolute', top: '50%', width: '100%', textAlign: 'center', color: '#888', pointerEvents: 'none' } }, 'Click the empty space to create a new node');
  const playB = h('button', { style: { background: '#3ec74a', border: 0, color: '#111', fontWeight: 800, padding: '5px 14px', borderRadius: '4px' } }, 'Play');
  function play() {
    if (running.length) { running.forEach((x) => x.stop?.()); running = []; playB.textContent = 'Play'; return; }
    ac = audio(); if (!ac) return; const out = g.nodes.find((n) => n.title === 'AudioOut'); if (!out) return toast('Add an AudioOut node');
    const build = (n) => { if (['Sine', 'Saw'].includes(n.title)) { const o = ac.createOscillator(); o.type = n.title === 'Sine' ? 'sine' : 'sawtooth'; const fw = g.wires.find((w) => w.b === n && w.bi === 0); o.frequency.value = fw ? fw.a.v.val || 220 : 220; o.start(); running.push(o); return o; }
      if (n.title === 'Filter') { const f = ac.createBiquadFilter(); f.frequency.value = 900; g.wires.filter((w) => w.b === n && w.bi === 0).forEach((w) => build(w.a)?.connect(f)); return f; } return null; };
    const gain = ac.createGain(); gain.gain.value = 0.08; gain.connect(ac.destination); running.push({ stop: () => gain.disconnect() });
    g.wires.filter((w) => w.b === out).forEach((w) => build(w.a)?.connect(gain)); playB.textContent = 'Stop';
  }
  playB.onclick = play; window.addEventListener('keydown', (e) => { if (e.code === 'Space' && document.activeElement === document.body) { e.preventDefault(); play(); } });
  root.append(h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '34px', background: '#1a1a1a', display: 'flex', gap: '16px', alignItems: 'center', padding: '0 12px', zIndex: 3, fontSize: '13px' } }, h('b', { style: { color: '#e03a3a', fontSize: '15px' } }, 'NoiseCraft-ish'), ...['New', 'Open', 'Save', 'Share', 'Browse', 'Help'].map((x) => h('span', { style: { opacity: .8 } }, x)), h('span', { style: { flex: 1 } }), playB, btn('Stop', () => running.length && play())), hint);
  g.wrap.style.top = '34px';
  window.__demoProof = async () => { hint.style.display = 'none'; const c = g.add(TY.Clock, 60, 80), sq = g.add(TY.MonoSeq, 240, 60), k = g.add(TY.Knob, 240, 260), s1 = g.add(TY.Saw, 460, 120), s2 = g.add(TY.Saw, 460, 260), f = g.add(TY.Filter, 680, 170), ad = g.add(TY.ADSR, 680, 330), m = g.add(TY.Mul, 900, 220), o = g.add(TY.AudioOut, 1100, 220); await sleep(30);
    g.connect(c, 0, sq, 0); g.connect(k, 0, s1, 0); g.connect(sq, 0, s2, 0); g.connect(s1, 0, f, 0); g.connect(s2, 0, f, 0); g.connect(sq, 1, ad, 0); g.connect(f, 0, m, 0); g.connect(ad, 0, m, 1); g.connect(m, 0, o, 0); g.connect(m, 0, o, 1); g.connect(k, 0, f, 1); return 'Dual-saw patch: 9 nodes, 11 wires'; };
};
V['neon-patcher-cable-synth'] = (root, T) => {
  theme(root, T, { bg: '#050505', fg: '#e8ffe8', ac: '#39ff14', dark: true });
  root.style.setProperty('--node', '#0e0e0e'); root.style.setProperty('--nhead', '#161616'); root.style.setProperty('--nline', '#39ff1455'); root.style.setProperty('--port', '#ffe600'); root.style.setProperty('--pr', '50%');
  const C = ['#39ff14', '#ff2bd6', '#00e5ff', '#ffe600', '#ff7a00'];
  const g = graph(root, { sag: true, glow: true, wireW: 3, wireColor: (w, k) => C[k % C.length] });
  root.style.backgroundImage = 'linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)'; root.style.backgroundSize = '40px 40px';
  let osc, gain, lfoT;
  const mk = (title, ins, outs, knobs) => ({ title, ins, outs, v: Object.fromEntries(knobs.map((k) => [k, 50])), body: (n) => h('div.k-row', {}, knobs.map((k) => h('div', { style: { textAlign: 'center', fontSize: '10px' } }, knob(n, k, 0, 100), k))) });
  const nodes = [g.add(mk('METRO', [], ['tick'], ['rate']), 80, 120), g.add(mk('VCO', ['pitch', 'fm'], ['out'], ['freq', 'fine']), 360, 90), g.add(mk('LFO', [], ['out'], ['rate', 'depth']), 360, 320), g.add(mk('VCA', ['in', 'cv'], ['out'], ['gain']), 640, 180), g.add(mk('DELAY', ['in'], ['out'], ['time', 'fb']), 900, 120), g.add(mk('DAC', ['L', 'R'], [], ['vol']), 1140, 220)];
  const play = () => { const ac = audio(); if (!ac) return; if (osc) { osc.stop(); osc = null; clearInterval(lfoT); return; } osc = ac.createOscillator(); gain = ac.createGain(); osc.type = 'sawtooth'; osc.frequency.value = 110 + nodes[1].v.freq * 4; gain.gain.value = 0; osc.connect(gain).connect(ac.destination); osc.start(); lfoT = setInterval(() => { gain.gain.cancelScheduledValues(ac.currentTime); gain.gain.setValueAtTime(0.1, ac.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2); }, 600 - nodes[0].v.rate * 4); };
  root.append(h('div.k-row', { style: { position: 'absolute', top: '10px', left: '12px', zIndex: 3 } }, h('b', { style: { color: '#39ff14', textShadow: '0 0 8px #39ff14', letterSpacing: '.2em' } }, 'NEON PATCHER'), btn('▶ RUN', play, 'pri'), btn('Zoom +', () => (g.wrap.style.transform = 'scale(1.1)')), btn('Zoom −', () => (g.wrap.style.transform = 'scale(.9)'))));
  window.__demoProof = async () => { await sleep(30); g.connect(nodes[0], 0, nodes[1], 0); g.connect(nodes[2], 0, nodes[1], 1); g.connect(nodes[1], 0, nodes[3], 0); g.connect(nodes[2], 0, nodes[3], 1); g.connect(nodes[3], 0, nodes[4], 0); g.connect(nodes[4], 0, nodes[5], 0); g.connect(nodes[3], 0, nodes[5], 1); return 'METRO→VCO→VCA→DELAY→DAC patched'; };
};
V['cables-node-patch'] = (root, T) => {
  theme(root, T, { bg: '#303030', fg: '#ddd', ac: '#ffcc00', dark: true });
  root.style.setProperty('--node', '#3d3d3d'); root.style.setProperty('--nhead', '#3d3d3d'); root.style.setProperty('--nr', '0px'); root.style.setProperty('--port', '#ffcc00');
  const host = h('div', { style: { position: 'absolute', left: 0, top: '30px', bottom: 0, right: '420px' } });
  const prev = h('canvas', { width: 420, height: 420, style: { position: 'absolute', right: 0, top: '30px', width: '420px', height: '420px', background: '#000' } });
  const P = { rot: 0.3, count: 24, hue: 200, scale: 1 };
  const g = graph(host, { straight: false, wireW: 2, wireColor: (w) => ({ MainLoop: '#ffcc00', Transform: '#ff66aa', Repeat: '#66ccff' }[w.a.title] || '#99ff66') });
  const TY = { MainLoop: { title: 'MainLoop', outs: ['trigger', 'width'] }, Transform: { title: 'Transform', ins: ['render', 'rotZ'], outs: ['next'], v: { r: 30 }, body: (n) => knob(n, 'r', 0, 100, () => (P.rot = n.v.r / 100)) }, Repeat: { title: 'Repeat', ins: ['exe', 'num'], outs: ['next', 'index'], v: { n: 24 }, body: (n) => knob(n, 'n', 1, 60, () => (P.count = Math.round(n.v.n))) }, Rectangle: { title: 'Rectangle', ins: ['render', 'w', 'h'], outs: ['next'] }, Color: { title: 'Color', ins: ['r', 'g', 'b'], outs: ['rgb'], v: { h: 200 }, body: (n) => knob(n, 'h', 0, 360, () => (P.hue = n.v.h)) }, Time: { title: 'Timer', outs: ['time'] } };
  const g2 = graph; const search = h('input', { placeholder: 'Search ops… (Esc)', style: { width: '260px', padding: '6px', background: '#222', color: '#eee', border: '1px solid #555' }, onkeydown: (e) => { if (e.key === 'Enter') { const k = Object.keys(TY).find((t) => t.toLowerCase().startsWith(e.target.value.toLowerCase())); if (k) g.add(TY[k], 200 + Math.random() * 300, 300 + Math.random() * 100); e.target.value = ''; } } });
  const pg = prev.getContext('2d'); let t = 0; const loop = () => { t += 0.016; pg.fillStyle = '#000'; pg.fillRect(0, 0, 420, 420); pg.save(); pg.translate(210, 210); for (let i = 0; i < P.count; i++) { pg.rotate(P.rot + Math.sin(t) * 0.02); pg.strokeStyle = `hsl(${P.hue + i * 4} 90% 60%)`; pg.lineWidth = 2; const sz = 20 + i * 7; pg.strokeRect(-sz / 2, -sz / 2, sz, sz); } pg.restore(); requestAnimationFrame(loop); }; loop();
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '30px', background: '#222', padding: '0 10px', gap: '14px' } }, h('b', { style: { color: '#ffcc00' } }, 'cables-ish'), 'Patch', 'Edit', 'Ops', 'Window', search), host, prev, h('div', { style: { position: 'absolute', right: 0, top: '450px', width: '420px', bottom: 0, padding: '10px', fontSize: '12px', background: '#282828' } }, h('b', {}, 'Op parameters'), h('p', { style: { opacity: .7 } }, 'Drag knobs on Transform / Repeat / Color to update the live WebGL-style preview.')));
  const n = [g.add(TY.MainLoop, 40, 40), g.add(TY.Time, 40, 220), g.add(TY.Repeat, 260, 80), g.add(TY.Transform, 480, 60), g.add(TY.Color, 480, 260), g.add(TY.Rectangle, 700, 140)];
  setTimeout(() => { g.connect(n[0], 0, n[2], 0); g.connect(n[2], 0, n[3], 0); g.connect(n[1], 0, n[3], 1); g.connect(n[3], 0, n[5], 0); g.connect(n[4], 0, n[5], 1); }, 50);
  window.__demoProof = async () => { n[3].v.r = 12; P.rot = 0.12; P.count = 40; P.hue = 320; search.value = 'Col'; return 'ops patched, params changed → preview updated'; };
};
V['procedural-vector-node-editor'] = (root, T) => {
  theme(root, T, { bg: '#262626', fg: '#ddd', panel: '#303030', ac: '#e1a33a', dark: true });
  root.style.display = 'grid'; root.style.gridTemplateColumns = '44px 1fr 260px'; root.style.gridTemplateRows = '30px 1fr 300px';
  const canvasArea = h('div', { style: { position: 'relative', background: '#1e1e1e', display: 'grid', placeItems: 'center', gridColumn: '2', gridRow: '2', minHeight: 0, overflow: 'hidden' } });
  const art = s('svg', { width: 520, height: 330, viewBox: '0 0 520 330', style: 'background:#fff' }); canvasArea.append(art);
  const P = { sides: 6, radius: 110, rot: 0, fill: '#e1a33a', copies: 3 };
  const drawArt = () => { art.replaceChildren(); for (let c = 0; c < P.copies; c++) { let d = ''; for (let i = 0; i < P.sides; i++) { const a = (i / P.sides) * 2 * Math.PI + P.rot + c * 0.3; d += (i ? 'L' : 'M') + (260 + Math.cos(a) * (P.radius - c * 25)) + ' ' + (165 + Math.sin(a) * (P.radius - c * 25)); } art.append(s('path', { d: d + 'Z', fill: P.fill, opacity: 1 - c * 0.25, stroke: '#222', 'stroke-width': 2 })); } };
  const ngHost = h('div', { style: { position: 'relative', gridColumn: '2', gridRow: '3', background: '#1a1a1a', borderTop: '1px solid #000' } });
  root.style.setProperty('--node', '#3b3b3b'); root.style.setProperty('--nhead', '#474747'); root.style.setProperty('--port', '#6bb5ff'); root.style.setProperty('--pr', '50%');
  const g = graph(ngHost, { wireColor: () => '#6bb5ff' });
  const mk = (title, ins, outs, key, min, max) => ({ title, ins, outs, v: { [key]: P[key] }, body: key ? (n) => knob(n, key, min, max, () => { P[key] = key === 'sides' || key === 'copies' ? Math.round(n.v[key]) : n.v[key]; drawArt(); }) : null });
  const n = [g.add(mk('Regular Polygon', [], ['vector'], 'sides', 3, 12), 30, 30), g.add(mk('Transform', ['vector'], ['vector'], 'rot', 0, 6.28), 250, 60), g.add(mk('Repeat', ['vector'], ['vector'], 'copies', 1, 5), 470, 30), g.add(mk('Fill', ['vector'], ['vector']), 690, 70), g.add({ title: 'Output', ins: ['artwork'] }, 900, 60)];
  setTimeout(() => { for (let i = 0; i < 4; i++) g.connect(n[i], 0, n[i + 1], 0); }, 50);
  const tools = h('div', { style: { gridRow: '2/4', gridColumn: '1', background: '#2b2b2b', display: 'grid', alignContent: 'start', gap: '4px', padding: '6px 4px' } }, ['↖', '✥', '✎', '▭', '◯', '⬠', 'T', '🪣'].map((i) => h('button', { style: { height: '34px', background: 'transparent', border: 0, color: '#ddd', fontSize: '15px' } }, i)));
  const layers = panel('Layers', ...['Output', 'Repeat', 'Transform', 'Regular Polygon'].map((l) => h('div', { style: { padding: '6px', background: '#3a3a3a', borderRadius: '4px' } }, '◆ ', l)));
  const props = panel('Properties', h('input', { type: 'color', value: P.fill, oninput: (e) => { P.fill = e.target.value; drawArt(); } }), slider('Radius', 30, 160, P.radius, 1, (v) => { P.radius = v; drawArt(); }));
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', background: '#1b1b1b', padding: '0 10px', gap: '16px' } }, h('b', { style: { color: '#e1a33a' } }, '◆ Graphite-ish'), 'File', 'Edit', 'Layer', 'Document', 'View', 'Help'), tools, canvasArea, h('div', { style: { gridRow: '2/4', gridColumn: '3', display: 'grid', gridTemplateRows: '1fr 1fr', gap: '6px', padding: '6px' } }, props, layers), ngHost);
  drawArt();
  window.__demoProof = async () => { P.sides = 5; P.rot = 0.4; P.copies = 4; drawArt(); return 'procedural polygon → transform → repeat graph'; };
};
V['json-graph-explorer'] = (root, T) => {
  theme(root, T, { bg: '#1e1e1e', fg: '#ddd', panel: '#252526', ac: '#e8590c', dark: true });
  root.style.setProperty('--node', '#2b2b2b'); root.style.setProperty('--nhead', '#2b2b2b'); root.style.setProperty('--nline', '#555');
  const sample = { fruits: [{ name: 'Apple', color: '#FF0000', details: { type: 'Pome', season: 'Fall' } }, { name: 'Banana', color: '#FFFF00', details: { type: 'Berry', season: 'Summer' } }], owner: { name: 'Studio', active: true } };
  const ta = h('textarea', { spellcheck: false, style: { width: '100%', height: '100%', background: '#1e1e1e', color: '#9cdcfe', border: 0, font: '13px/1.55 JetBrains Mono Variable,monospace', padding: '12px', resize: 'none', outline: 'none' } }); ta.value = JSON.stringify(sample, null, 2);
  const host = h('div', { style: { position: 'relative', height: '100%', backgroundImage: 'radial-gradient(#333 1px,transparent 1px)', backgroundSize: '18px 18px' } });
  let g; const build = () => { host.replaceChildren(); g = graph(host, { wireColor: () => '#666' }); let data; try { data = JSON.parse(ta.value); err.textContent = '✓ Valid JSON'; err.style.color = '#4caf50'; } catch (e) { err.textContent = '✗ ' + e.message; err.style.color = '#f44'; return; }
    const col = {}; const walk = (obj, depth, label) => { const prim = Object.entries(obj).filter(([, v]) => typeof v !== 'object' || v === null); const node = g.add({ title: label, ins: depth ? [''] : [], outs: Object.entries(obj).filter(([, v]) => v && typeof v === 'object').map(([k]) => k), body: () => h('div', {}, prim.map(([k, v]) => h('div', { style: { fontFamily: 'monospace', fontSize: '11px' } }, h('span', { style: { color: '#e8590c' } }, k + ': '), h('span', { style: { color: typeof v === 'string' && v.startsWith('#') ? v : '#9cdcfe' } }, JSON.stringify(v))))) }, 40 + depth * 230, 30 + (col[depth] = (col[depth] || 0) + 1) * 100 - 100);
      Object.entries(obj).filter(([, v]) => v && typeof v === 'object').forEach(([k, v], i) => { const c = walk(v, depth + 1, Array.isArray(obj) ? `[${k}]` : k); setTimeout(() => g.connect(node, i, c, 0), 30); }); return node; };
    walk(data, 0, 'root'); };
  const err = h('span'); ta.oninput = () => { clearTimeout(ta._t); ta._t = setTimeout(build, 300); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '380px 1fr'; root.style.gridTemplateRows = '38px 1fr 26px';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', background: '#252526', padding: '0 12px', gap: '14px' } }, h('b', {}, 'JSON Crack-ish'), 'File', 'View', 'Tools', h('span', { style: { flex: 1 } }), btn('Export PNG', () => toast('Exported graph.png (demo)'), 'pri')), ta, host, h('div.k-row', { style: { gridColumn: '1/-1', background: '#e8590c', color: '#fff', padding: '0 10px', fontSize: '12px' } }, err, h('span', { style: { flex: 1 } }), 'Nodes: live'));
  build();
  window.__demoProof = async () => { const d = JSON.parse(ta.value); d.fruits.push({ name: 'Cherry', color: '#DE3163', details: { type: 'Drupe', season: 'Spring' } }); ta.value = JSON.stringify(d, null, 2); build(); return 'edited JSON → graph rebuilt with Cherry node'; };
};
V['er-schema-canvas'] = (root, T) => {
  theme(root, T, { bg: '#f4f6f9', fg: '#1f2937', panel: '#fff', ac: '#2563eb', dark: false });
  root.style.setProperty('--node', '#fff'); root.style.setProperty('--nfg', '#1f2937'); root.style.setProperty('--nline', '#d1d5db'); root.style.setProperty('--port', '#2563eb'); root.style.setProperty('--pr', '50%'); root.style.setProperty('--nr', '8px');
  root.style.backgroundImage = 'radial-gradient(#cbd5e1 1px,transparent 1px)'; root.style.backgroundSize = '22px 22px';
  const host = h('div', { style: { position: 'absolute', inset: '44px 0 0 0' } }); root.append(host);
  const g = graph(host, { wireColor: () => '#64748b' });
  const table = (name, color, cols) => ({ title: name, style: { borderTop: `5px solid ${color}` }, ins: cols.filter((c) => c[2] === 'FK').map((c) => c[0]), outs: ['id'], body: () => h('div', {}, cols.map(([c, t, k]) => h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '18px', fontSize: '12px', padding: '2px 0' } }, h('span', {}, k === 'PK' ? '🔑 ' : '', c), h('span', { style: { color: '#94a3b8' } }, t)))) });
  root.style.setProperty('--nhead', '#fff');
  const n = [g.add(table('users', '#2563eb', [['id', 'INT', 'PK'], ['email', 'VARCHAR'], ['name', 'VARCHAR'], ['created_at', 'TIMESTAMP']]), 80, 80), g.add(table('orders', '#16a34a', [['id', 'INT', 'PK'], ['user_id', 'INT', 'FK'], ['total', 'DECIMAL'], ['status', 'ENUM']]), 460, 60), g.add(table('products', '#f59e0b', [['id', 'INT', 'PK'], ['sku', 'VARCHAR'], ['price', 'DECIMAL']]), 80, 380), g.add(table('order_items', '#db2777', [['id', 'INT', 'PK'], ['order_id', 'INT', 'FK'], ['product_id', 'INT', 'FK'], ['qty', 'INT']]), 820, 260)];
  setTimeout(() => { g.connect(n[0], 0, n[1], 0); g.connect(n[1], 0, n[3], 0); g.connect(n[2], 0, n[3], 1); }, 60);
  const sql = () => g.nodes.map((t) => `CREATE TABLE ${t.title} (...);`).join('\n');
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '44px', background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 14px', gap: '14px' } }, h('b', { style: { color: '#2563eb' } }, 'drawDB-ish'), 'File', 'Edit', 'View', 'Settings', h('span', { style: { flex: 1 } }), btn('+ Table', () => g.add(table('new_table', '#7c3aed', [['id', 'INT', 'PK']]), 500, 420)), btn('+ Area', () => toast('Subject area added')), btn('Export SQL', () => copy(sql(), 'SQL copied'), 'pri')),
    h('div', { style: { position: 'absolute', left: '60px', top: '400px', width: '360px', height: '220px', border: '2px dashed #f59e0b88', borderRadius: '12px', background: '#f59e0b0d', pointerEvents: 'none' } }, h('span', { style: { position: 'absolute', top: '-22px', fontSize: '12px', color: '#b45309' } }, 'Catalog area')));
  window.__demoProof = async () => { g.add(table('reviews', '#7c3aed', [['id', 'INT', 'PK'], ['user_id', 'INT', 'FK'], ['stars', 'INT']]), 500, 440); await sleep(30); g.connect(n[0], 0, g.nodes[4], 0); return 'added reviews table + FK edge'; };
};
V['nand-logic-build-game'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#fff', ac: '#3b5bdb', dark: false });
  root.style.setProperty('--node', '#fff'); root.style.setProperty('--nfg', '#222'); root.style.setProperty('--nhead', '#e7ecff'); root.style.setProperty('--port', '#3b5bdb'); root.style.setProperty('--pr', '50%');
  const board = h('div', { style: { position: 'absolute', left: '300px', top: '44px', right: '14px', bottom: '14px', background: '#b8b2e6', borderRadius: '6px' } });
  const g = graph(board, { wireColor: (w) => (evalNode(w.a) ? '#e03131' : '#1c1c1c') });
  const inA = g.add({ title: 'a', outs: ['out'], v: { on: 0 }, body: (n) => h('button.k-btn', { onclick: (e) => { n.v.on ^= 1; e.target.textContent = n.v.on; g.drawWires(); check(); } }, '0') }, 20, 60);
  const inB = g.add({ title: 'b', outs: ['out'], v: { on: 0 }, body: (n) => h('button.k-btn', { onclick: (e) => { n.v.on ^= 1; e.target.textContent = n.v.on; g.drawWires(); check(); } }, '0') }, 20, 260);
  const out = g.add({ title: 'output', ins: ['in'] }, 700, 160);
  const NAND = { title: 'nand', ins: ['a', 'b'], outs: ['out'], style: { borderRadius: '0 40px 40px 0' } };
  function evalNode(n) { if (n.title === 'a' || n.title === 'b') return n.v.on; if (n.title === 'nand') { const ins = [0, 1].map((i) => { const w = g.wires.find((x) => x.b === n && x.bi === i); return w ? evalNode(w.a) : 0; }); return ins[0] && ins[1] ? 0 : 1; } return 0; }
  const outVal = () => { const w = g.wires.find((x) => x.b === out); return w ? evalNode(w.a) : null; };
  const tt = h('table', { style: { borderCollapse: 'collapse', fontSize: '13px', marginTop: '8px' } });
  const status = h('div', { style: { fontWeight: 700 } });
  function check() { const rows = [[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 1]]; let ok = true; const sa = inA.v.on, sb = inB.v.on; tt.replaceChildren(h('tr', {}, ['a', 'b', 'expected', 'actual'].map((x) => h('th', { style: { border: '1px solid #ccc', padding: '4px 10px' } }, x))), ...rows.map(([a, b, e]) => { inA.v.on = a; inB.v.on = b; const v = outVal(); if (v !== e) ok = false; return h('tr', {}, [a, b, e, v ?? '–'].map((x, i) => h('td', { style: { border: '1px solid #ccc', padding: '4px 10px', textAlign: 'center', background: i === 3 ? (v === e ? '#d3f9d8' : '#ffe3e3') : '' } }, x))); })); inA.v.on = sa; inB.v.on = sb; status.textContent = ok ? '✓ Level complete! AND built from NAND' : 'Build an AND gate using nand components.'; status.style.color = ok ? '#2b8a3e' : '#222'; }
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '40px', padding: '0 14px', gap: '10px', borderBottom: '1px solid #ddd' } }, h('b', {}, 'NandGame-ish'), btn('Levels ▾', () => {}), btn('Reset', () => location.reload())),
    h('div', { style: { position: 'absolute', left: '14px', top: '54px', width: '270px' } }, h('h3', { style: { margin: '0 0 6px' } }, 'And'), h('p', { style: { fontSize: '13px', lineHeight: 1.5 } }, 'Output is 1 only when both inputs are 1. Drag a nand from the toolbox and wire it.'), tt, status, h('div.k-h', { style: { marginTop: '12px' } }, 'Toolbox'), btn('+ nand', () => g.add(NAND, 250 + g.nodes.length * 60, 120 + g.nodes.length * 20), 'pri'), btn('Check solution', check)), board);
  g.onchange = check; check();
  window.__demoProof = async () => { const n1 = g.add(NAND, 240, 140), n2 = g.add(NAND, 470, 150); await sleep(30); g.connect(inA, 0, n1, 0); g.connect(inB, 0, n1, 1); g.connect(n1, 0, n2, 0); g.connect(n1, 0, n2, 1); g.connect(n2, 0, out, 0); inA.v.on = 1; inB.v.on = 1; check(); return 'AND from 2 NANDs, truth table all green'; };
};
V['circuit-construction-sandbox'] = (root, T) => {
  theme(root, T, { bg: '#99ccff', fg: '#111', panel: '#fff', ac: '#ffcc00', acfg: '#111', dark: false });
  const intro = h('div', { style: { position: 'absolute', inset: 0, background: '#000', color: '#fff', display: 'grid', placeItems: 'center', zIndex: 4, textAlign: 'center' } }, h('div', {}, h('div', { style: { fontSize: '52px', marginBottom: '40px' } }, 'Circuit Construction Kit: DC'), h('div.k-row', { style: { justifyContent: 'center', gap: '60px' } }, ['Intro', 'Lab'].map((n) => h('div', { style: { cursor: 'pointer' }, onclick: () => intro.remove() }, h('div', { style: { width: '200px', height: '130px', background: n === 'Intro' ? '#9cf' : '#369', border: n === 'Intro' ? '4px solid #ff0' : '', display: 'grid', placeItems: 'center', fontSize: '48px' } }, n === 'Intro' ? '💡' : '🔋'), h('div', { style: { fontSize: '30px', marginTop: '10px' } }, n))))));
  root.style.setProperty('--node', '#fff'); root.style.setProperty('--nfg', '#111'); root.style.setProperty('--nhead', '#eee'); root.style.setProperty('--port', '#b87333'); root.style.setProperty('--pr', '50%');
  const g = graph(root, { wireColor: () => (closed() ? '#d9480f' : '#b87333'), wireW: 7, straight: true });
  const bulb = h('div', { style: { fontSize: '44px', textAlign: 'center', transition: '.2s' } }, '💡');
  const meter = h('div', { style: { fontFamily: 'monospace', fontSize: '18px', textAlign: 'center' } }, '0.00 A');
  const parts = { battery: g.add({ title: 'Battery 9V', ins: ['−'], outs: ['+'], body: () => h('div', { style: { fontSize: '36px', textAlign: 'center' } }, '🔋') }, 200, 300), bulb: g.add({ title: 'Light Bulb 10Ω', ins: ['a'], outs: ['b'], body: () => bulb }, 560, 120), sw: g.add({ title: 'Switch', ins: ['a'], outs: ['b'], v: { on: 1 }, body: (n) => h('button.k-btn', { onclick: (e) => { n.v.on ^= 1; e.target.textContent = n.v.on ? 'closed' : 'open'; upd(); } }, 'closed') }, 900, 300), amm: g.add({ title: 'Ammeter', ins: ['a'], outs: ['b'], body: () => meter }, 560, 480) };
  function closed() { const has = (a, b) => g.wires.some((w) => w.a === a && w.b === b); return has(parts.battery, parts.bulb) && has(parts.bulb, parts.sw) && has(parts.sw, parts.amm) && has(parts.amm, parts.battery) && parts.sw.v.on; }
  function upd() { const c = closed(); bulb.style.filter = c ? 'drop-shadow(0 0 24px #ffea00) brightness(1.3)' : 'grayscale(1)'; meter.textContent = c ? '0.90 A' : '0.00 A'; g.drawWires && null; }
  g.onchange = upd;
  root.append(panel('Toolbox', h('div', {}, '🔋 Battery · 💡 Bulb · ⎓ Wire · ⏻ Switch'), toggle('Lifelike / Schematic', true, (v) => root.style.setProperty('--nr', v ? '6px' : '0'))), intro);
  root.lastChild.previousSibling.style.cssText += 'position:absolute;right:14px;top:14px;width:220px';
  upd();
  window.__demoProof = async () => { intro.remove(); await sleep(30); g.connect(parts.battery, 0, parts.bulb, 0); g.connect(parts.bulb, 0, parts.sw, 0); g.connect(parts.sw, 0, parts.amm, 0); g.connect(parts.amm, 0, parts.battery, 0); upd(); g.drawWires(); return 'closed loop → bulb lit, ammeter 0.90 A'; };
};
V['neural-net-playground'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', panel: '#f7f7f7', ac: '#f59322', dark: false });
  const DS = { circle: (n) => Array.from({ length: n }, () => { const r = Math.random() * 5, a = Math.random() * 6.28; return [r * Math.cos(a), r * Math.sin(a), r < 2.5 ? 1 : -1]; }), xor: (n) => Array.from({ length: n }, () => { const x = Math.random() * 10 - 5, y = Math.random() * 10 - 5; return [x, y, x * y > 0 ? 1 : -1]; }), gauss: (n) => Array.from({ length: n }, (_, i) => { const c = i % 2 ? 2 : -2; return [c + Math.random() * 2 - 1, c + Math.random() * 2 - 1, i % 2 ? 1 : -1]; }), spiral: (n) => Array.from({ length: n }, (_, i) => { const lab = i % 2, r = (i / n) * 5, t = 1.75 * (i / n) * 2 * Math.PI + lab * Math.PI; return [r * Math.sin(t), r * Math.cos(t), lab ? 1 : -1]; }) };
  let data = DS.circle(200), H = [4, 4], lr = 0.03, epoch = 0, tid; let net;
  const init = () => { const sz = [4, ...H, 1]; net = sz.slice(1).map((n, l) => ({ W: Array.from({ length: n }, () => Array.from({ length: sz[l] }, () => Math.random() - 0.5)), b: Array(n).fill(0.1) })); epoch = 0; };
  const feat = (x, y) => [x / 5, y / 5, (x * x) / 25, (y * y) / 25];
  const fwd = (inp) => { const acts = [inp]; net.forEach((L) => acts.push(L.W.map((w, j) => Math.tanh(w.reduce((s2, wi, i) => s2 + wi * acts[acts.length - 1][i], L.b[j]))))); return acts; };
  const train = () => { for (const [x, y, lab] of data) { const acts = fwd(feat(x, y)); let d = [(acts[acts.length - 1][0] - lab) * (1 - acts[acts.length - 1][0] ** 2)]; for (let l = net.length - 1; l >= 0; l--) { const L = net[l], a = acts[l]; const nd = a.map((_, i) => L.W.reduce((s2, w, j) => s2 + w[i] * d[j], 0) * (1 - a[i] ** 2)); L.W.forEach((w, j) => { w.forEach((_, i) => (w[i] -= lr * d[j] * a[i])); L.b[j] -= lr * d[j]; }); d = nd; } } epoch++; };
  const out = h('canvas', { width: 100, height: 100, style: { width: '300px', height: '300px', imageRendering: 'auto', borderRadius: '4px' } }); const og = out.getContext('2d');
  const netSvg = s('svg', { width: 520, height: 360 });
  const hud = h('div', { style: { fontFamily: 'monospace' } });
  function draw() { const img = og.createImageData(100, 100); let loss = 0; for (let y = 0; y < 100; y++) for (let x = 0; x < 100; x++) { const v = fwd(feat(x / 10 - 5, y / 10 - 5)).pop()[0]; const i = (y * 100 + x) * 4; const c = v > 0 ? [8, 119, 189] : [245, 147, 34]; const k = Math.abs(v) * 0.7; img.data[i] = 255 - (255 - c[0]) * k; img.data[i + 1] = 255 - (255 - c[1]) * k; img.data[i + 2] = 255 - (255 - c[2]) * k; img.data[i + 3] = 255; } og.putImageData(img, 0, 0);
    for (const [x, y, lab] of data) { og.fillStyle = lab > 0 ? '#0877bd' : '#f59322'; og.strokeStyle = '#fff'; og.beginPath(); og.arc((x + 5) * 10, (y + 5) * 10, 1.4, 0, 7); og.fill(); loss += (fwd(feat(x, y)).pop()[0] - lab) ** 2; }
    hud.textContent = `Epoch ${String(epoch).padStart(6, '0')}   Test loss ${(loss / data.length / 4).toFixed(3)}`;
    netSvg.replaceChildren(); const sz = [4, ...H, 1]; const pos = sz.map((n, l) => Array.from({ length: n }, (_, j) => [40 + l * (440 / (sz.length - 1)), 40 + j * 60 + (6 - n) * 30]));
    net.forEach((L, l) => L.W.forEach((w, j) => w.forEach((wi, i) => netSvg.append(s('line', { x1: pos[l][i][0], y1: pos[l][i][1], x2: pos[l + 1][j][0], y2: pos[l + 1][j][1], stroke: wi > 0 ? '#0877bd' : '#f59322', 'stroke-width': Math.min(6, Math.abs(wi) * 3) + 0.3, opacity: 0.7 })))));
    pos.forEach((col, l) => col.forEach(([x, y], j) => netSvg.append(s('rect', { x: x - 16, y: y - 16, width: 32, height: 32, rx: 4, fill: '#fff', stroke: '#999' }), l === 0 ? s('text', { x: x - 70, y: y + 4, 'font-size': 11, fill: '#666' }, ['X₁', 'X₂', 'X₁²', 'X₂²'][j]) : null)));
  }
  init(); draw();
  const play = () => { if (tid) { clearInterval(tid); tid = null; return; } tid = setInterval(() => { for (let k = 0; k < 3; k++) train(); draw(); }, 60); };
  root.append(h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '90px', background: '#183d4e', color: '#fff', display: 'grid', placeItems: 'center', font: '300 22px Inter Variable' } }, 'Tinker With a Neural Network Right Here in Your Browser.'),
    h('div.k-row', { style: { position: 'absolute', top: '90px', left: 0, right: 0, height: '70px', padding: '0 30px', gap: '26px', borderBottom: '1px solid #ddd' } }, h('button', { style: { width: '48px', height: '48px', borderRadius: '50%', border: 0, background: '#183d4e', color: '#fff', fontSize: '18px' }, onclick: play }, '▶'), hud, select([['0.003', 'LR 0.003'], ['0.03', 'LR 0.03'], ['0.1', 'LR 0.1']], '0.03', (v) => (lr = +v)), select(['Tanh', 'ReLU', 'Sigmoid'], 'Tanh', () => {}), select(['Classification', 'Regression'], 'Classification', () => {})),
    h('div', { style: { position: 'absolute', top: '170px', left: '30px', right: '30px', bottom: 0, display: 'grid', gridTemplateColumns: '170px 1fr 320px', gap: '20px' } },
      h('div', {}, h('div.k-h', {}, 'Data'), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' } }, Object.keys(DS).map((k) => btn(k, () => { data = DS[k](200); init(); draw(); }))), slider('Noise', 0, 50, 0, 1, () => {}), slider('Batch size', 1, 30, 10, 1, () => {})),
      h('div', {}, h('div.k-row', {}, h('div.k-h', {}, `Hidden layers`), btn('+', () => { if (H.length < 4) H.push(4); init(); draw(); }), btn('−', () => { if (H.length > 1) H.pop(); init(); draw(); })), netSvg),
      h('div', {}, h('div.k-h', {}, 'Output'), out)));
  window.__demoProof = async () => { for (let i = 0; i < 150; i++) train(); draw(); return 'trained 150 epochs on circle dataset'; };
};

V['webaudio-studio-graph-desk'] = (root, T) => {
  theme(root, T, { bg: '#0a0d10', fg: '#e8eef4', panel: '#1a2128', ac: '#ffb300', dark: true });
  root.style.setProperty('--node', '#1a2128');
  root.style.setProperty('--nhead', '#243039');
  root.style.setProperty('--nline', '#3a4652');
  root.style.setProperty('--port', '#ffb300');
  root.style.setProperty('--nr', '8px');
  root.style.setProperty('--pr', '50%');
  root.style.backgroundImage = 'radial-gradient(#ffffff14 1px, transparent 1px)';
  root.style.backgroundSize = '18px 18px';

  let oscNode = null, gainNode = null, playing = false;
  const host = h('div', { style: { position: 'absolute', inset: '44px 0 0 0' } });
  const g = graph(host, { wireW: 2.5, glow: true, wireColor: () => '#ffb300' });

  const freqLab = h('span', { style: { fontFamily: 'monospace', fontSize: '11px', opacity: .85 } }, '440 Hz');
  const gainLab = h('span', { style: { fontFamily: 'monospace', fontSize: '11px', opacity: .85 } }, '0.20');
  const applyAudio = () => {
    if (!oscNode || !gainNode) return;
    oscNode.frequency.setTargetAtTime(P.freq, audio().currentTime, 0.02);
    gainNode.gain.setTargetAtTime(P.gain, audio().currentTime, 0.02);
    oscNode.type = P.wave;
  };
  const P = { freq: 440, gain: 0.2, wave: 'sine' };

  const oscBody = (n) => h('div', { style: { display: 'grid', gap: '6px', minWidth: '160px' } },
    select([['sine', 'sine'], ['square', 'square'], ['sawtooth', 'saw'], ['triangle', 'tri']], P.wave, (v) => { P.wave = v; n.v.wave = v; applyAudio(); }),
    slider('Freq', 80, 1200, P.freq, 1, (v) => { P.freq = v; n.v.freq = v; freqLab.textContent = v + ' Hz'; applyAudio(); }, (v) => v + ' Hz'),
    freqLab,
  );
  const gainBody = (n) => h('div', { style: { display: 'grid', gap: '6px', minWidth: '140px' } },
    slider('Gain', 0, 1, P.gain, 0.01, (v) => { P.gain = v; n.v.gain = v; gainLab.textContent = v.toFixed(2); applyAudio(); }, (v) => (+v).toFixed(2)),
    gainLab,
  );

  const osc = g.add({ title: 'Oscillator', outs: ['out'], v: { freq: 440, wave: 'sine' }, body: oscBody, style: { minWidth: '200px' } }, 120, 160);
  const gain = g.add({ title: 'Gain', ins: ['in'], outs: ['out'], v: { gain: 0.2 }, body: gainBody, style: { minWidth: '180px' } }, 420, 200);
  const dest = g.add({ title: 'Destination', ins: ['in'], badge: '🔊', style: { minWidth: '140px', borderColor: '#ffb30066' } }, 720, 240);
  setTimeout(() => { g.connect(osc, 0, gain, 0); g.connect(gain, 0, dest, 0); }, 40);

  const stop = () => {
    try { oscNode?.stop(); } catch {}
    try { gainNode?.disconnect(); } catch {}
    oscNode = null; gainNode = null; playing = false;
    playBtn.textContent = '▶ Play'; playBtn.style.background = '#ffb300'; playBtn.style.color = '#111';
  };
  const play = () => {
    if (playing) { stop(); return; }
    const ac = audio(); if (!ac) return;
    oscNode = ac.createOscillator();
    gainNode = ac.createGain();
    oscNode.type = P.wave;
    oscNode.frequency.value = P.freq;
    gainNode.gain.value = P.gain;
    oscNode.connect(gainNode).connect(ac.destination);
    oscNode.start();
    playing = true;
    playBtn.textContent = '■ Stop'; playBtn.style.background = '#e53935'; playBtn.style.color = '#fff';
  };
  const playBtn = h('button', { style: { background: '#ffb300', color: '#111', border: 0, fontWeight: 800, padding: '7px 16px', borderRadius: '6px', cursor: 'pointer' }, onclick: play }, '▶ Play');

  root.append(
    h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '44px', background: '#12171c', borderBottom: '1px solid #2a333c', padding: '0 14px', zIndex: 4, gap: '14px' } },
      h('b', { style: { color: '#ffb300', font: '800 15px ui-monospace,monospace', letterSpacing: '.02em' } }, 'Web Audio Studio'),
      h('span', { style: { fontSize: '11px', opacity: .45 } }, 'live node-graph desk'),
      h('span', { style: { flex: 1 } }),
      btn('Load example', () => { P.freq = 330; P.gain = 0.25; P.wave = 'sawtooth'; osc.v.freq = 330; gain.v.gain = 0.25; g.drawWires(); toast('example graph loaded'); }, ''),
      playBtn,
      btn('Stop', () => playing && stop()),
    ),
    host,
    h('div', { style: { position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', background: '#1a2128cc', border: '1px solid #3a4652', borderRadius: '8px', padding: '6px 10px', zIndex: 4, fontSize: '12px', opacity: .85 } }, 'Oscillator → Gain → Destination · drag nodes · tune freq/gain'),
  );
  window.__demoProof = async () => {
    g.sel?.el.classList.remove('sel'); g.sel = osc; osc.el.classList.add('sel');
    P.freq = 520; P.gain = 0.15; P.wave = 'triangle';
    freqLab.textContent = '520 Hz'; gainLab.textContent = '0.15';
    play(); await sleep(350); stop();
    return 'Osc selected; freq 520 / gain 0.15; Play→Stop exercised; cables visible';
  };
};

V['flowchart-fun-indent-graph-desk'] = (root, T) => {
  let dark = false;
  const applyTheme = () => {
    theme(root, T, dark
      ? { bg: '#141414', fg: '#ececec', panel: '#1c1c1c', ac: '#5b8cff', dark: true }
      : { bg: '#ffffff', fg: '#141414', panel: '#f4f4f5', ac: '#2563eb', dark: false });
    root.style.setProperty('--line', dark ? '#ffffff18' : '#00000014');
    editorWrap.style.background = dark ? '#121212' : '#fafafa';
    editorWrap.style.borderColor = dark ? '#ffffff14' : '#e5e5e5';
    ta.style.background = 'transparent';
    ta.style.color = dark ? '#ececec' : '#141414';
    gutter.style.color = dark ? '#666' : '#aaa';
    canvasWrap.style.background = dark ? '#0e0e0e' : '#f7f7f8';
    topBar.style.background = dark ? '#1a1a1a' : '#fff';
    topBar.style.borderBottom = dark ? '1px solid #ffffff14' : '1px solid #eee';
    subBar.style.background = dark ? '#161616' : '#fafafa';
    subBar.style.borderBottom = dark ? '1px solid #ffffff10' : '1px solid #f0f0f0';
    layout();
  };
  const EXAMPLE = `This app works
  by typing
    indentation
    creates edges
  goes to: Share link
Share link
  goes to: Download
Download
  Export PNG
  Export SVG
Tips
  Click a node
  goes to: This app works`;
  let text = EXAMPLE;
  let nodes = [], edges = [], selLine = -1;
  let view = { x: 40, y: 40, k: 1 };
  let debounce = null;
  const parse = (src) => {
    const lines = src.replace(/\t/g, '  ').split('\n');
    const stack = []; // {depth, id}
    const byLabel = new Map();
    const ns = [], es = [];
    const idOf = (label) => {
      const key = label.trim();
      if (byLabel.has(key)) return byLabel.get(key);
      const id = 'n' + ns.length;
      byLabel.set(key, id);
      ns.push({ id, label: key, line: -1 });
      return id;
    };
    lines.forEach((raw, li) => {
      if (!raw.trim()) return;
      const mGo = raw.match(/^(\s*)(.+?)\s+goes to:\s*(.+)\s*$/i);
      if (mGo) {
        const depth = mGo[1].length;
        const fromLabel = mGo[2].trim();
        const toLabel = mGo[3].trim().replace(/^\(|\)$/g, '');
        while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
        const parent = stack.length ? stack[stack.length - 1].id : null;
        const fromId = idOf(fromLabel);
        const node = ns.find((n) => n.id === fromId);
        if (node && node.line < 0) node.line = li;
        if (parent && parent !== fromId) es.push({ a: parent, b: fromId });
        const toId = idOf(toLabel);
        es.push({ a: fromId, b: toId });
        stack.push({ depth, id: fromId });
        return;
      }
      const mRef = raw.match(/^(\s*)\((.+)\)\s*$/);
      const depth = (raw.match(/^(\s*)/) || ['', ''])[1].length;
      const label = mRef ? mRef[2].trim() : raw.trim().replace(/\s+\.color_\w+/g, '');
      while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
      const parent = stack.length ? stack[stack.length - 1].id : null;
      const id = idOf(label);
      const node = ns.find((n) => n.id === id);
      if (node.line < 0) node.line = li;
      if (parent && parent !== id) es.push({ a: parent, b: id });
      stack.push({ depth, id });
    });
    // dedupe edges
    const seen = new Set();
    const uniq = [];
    es.forEach((e) => { const k = e.a + '->' + e.b; if (!seen.has(k) && e.a !== e.b) { seen.add(k); uniq.push(e); } });
    return { nodes: ns, edges: uniq };
  };
  const layoutGraph = (ns, es) => {
    // simple layered tree layout by BFS from roots
    const children = new Map(ns.map((n) => [n.id, []]));
    const indeg = new Map(ns.map((n) => [n.id, 0]));
    es.forEach((e) => { children.get(e.a)?.push(e.b); indeg.set(e.b, (indeg.get(e.b) || 0) + 1); });
    const roots = ns.filter((n) => !indeg.get(n.id)).map((n) => n.id);
    if (!roots.length && ns.length) roots.push(ns[0].id);
    const depth = new Map();
    const order = [];
    const q = roots.map((r) => (depth.set(r, 0), r));
    const seen = new Set(q);
    while (q.length) {
      const u = q.shift(); order.push(u);
      for (const v of children.get(u) || []) if (!seen.has(v)) { seen.add(v); depth.set(v, (depth.get(u) || 0) + 1); q.push(v); }
    }
    ns.forEach((n) => { if (!seen.has(n.id)) { depth.set(n.id, 0); order.push(n.id); } });
    const layers = new Map();
    order.forEach((id) => {
      const d = depth.get(id) || 0;
      if (!layers.has(d)) layers.set(d, []);
      layers.get(d).push(id);
    });
    const pos = new Map();
    const W = 180, H = 70;
    [...layers.keys()].sort((a, b) => a - b).forEach((d) => {
      const row = layers.get(d);
      row.forEach((id, i) => {
        pos.set(id, { x: 40 + i * W, y: 40 + d * H });
      });
    });
    return pos;
  };
  const svg = s('svg', { style: 'width:100%;height:100%;cursor:grab;touch-action:none' });
  const gRoot = s('g');
  svg.append(gRoot);
  const canvasWrap = h('div', { style: { position: 'relative', overflow: 'hidden', minHeight: 0 } }, svg);
  const highlightLine = (li) => {
    selLine = li;
    const lines = ta.value.split('\n');
    // visual: set selection range approximate via overlay mark in gutter
    gutter.replaceChildren(...lines.map((ln, i) => h('div', { style: { height: '20px', background: i === li ? (dark ? '#2563eb55' : '#2563eb22') : 'transparent', color: i === li ? (dark ? '#9db7ff' : '#2563eb') : undefined, fontWeight: i === li ? 700 : 400 } }, String(i + 1))));
    // also flash node
    layout();
  };
  const layout = () => {
    const parsed = parse(text);
    nodes = parsed.nodes; edges = parsed.edges;
    const pos = layoutGraph(nodes, edges);
    gRoot.setAttribute('transform', `translate(${view.x},${view.y}) scale(${view.k})`);
    const els = [];
    edges.forEach((e) => {
      const a = pos.get(e.a), b = pos.get(e.b); if (!a || !b) return;
      const x1 = a.x + 70, y1 = a.y + 22, x2 = b.x + 70, y2 = b.y;
      const mid = (y1 + y2) / 2;
      els.push(s('path', { d: `M${x1} ${y1}C${x1} ${mid},${x2} ${mid},${x2} ${y2}`, fill: 'none', stroke: dark ? '#666' : '#b0b0b0', 'stroke-width': 2 }));
    });
    nodes.forEach((n) => {
      const p = pos.get(n.id); if (!p) return;
      const selected = n.line === selLine;
      const w = Math.max(120, n.label.length * 7.5 + 24);
      const bg = selected ? (dark ? '#2563eb' : '#2563eb') : (dark ? '#1e1e1e' : '#fff');
      const fg = selected ? '#fff' : (dark ? '#ececec' : '#141414');
      const stroke = selected ? '#93c5fd' : (dark ? '#444' : '#d4d4d8');
      const g = s('g', { style: 'cursor:pointer', onclick: () => highlightLine(n.line) },
        s('rect', { x: p.x, y: p.y, width: w, height: 44, rx: 10, fill: bg, stroke, 'stroke-width': 1.5, filter: dark ? '' : 'drop-shadow(0 2px 6px rgba(0,0,0,.08))' }),
        s('text', { x: p.x + w / 2, y: p.y + 27, 'text-anchor': 'middle', fill: fg, 'font-size': 13, 'font-family': 'Inter,system-ui,sans-serif', 'font-weight': 600 }, n.label.slice(0, 28)));
      els.push(g);
    });
    gRoot.replaceChildren(...els);
    stats.textContent = `${nodes.length} nodes · ${edges.length} edges`;
  };
  const schedule = () => { clearTimeout(debounce); debounce = setTimeout(layout, 180); };
  const gutter = h('div', { style: { padding: '12px 8px', font: '12px/20px ui-monospace,monospace', textAlign: 'right', userSelect: 'none', minWidth: '36px' } });
  const ta = h('textarea', { value: text, spellcheck: 'false', style: { flex: 1, border: 0, outline: 'none', resize: 'none', padding: '12px 12px 12px 0', font: '13px/20px ui-monospace,SFMono-Regular,Menlo,monospace', whiteSpace: 'pre', tabSize: 2 } });
  ta.oninput = () => { text = ta.value; gutter.replaceChildren(...text.split('\n').map((_, i) => h('div', { style: { height: '20px' } }, String(i + 1)))); schedule(); };
  gutter.replaceChildren(...text.split('\n').map((_, i) => h('div', { style: { height: '20px' } }, String(i + 1))));
  const editorWrap = h('div', { style: { display: 'flex', overflow: 'auto', minHeight: 0, borderRight: '1px solid var(--line)' } }, gutter, ta);
  // pan/zoom
  let panning = false, lx = 0, ly = 0;
  svg.addEventListener('pointerdown', (e) => { if (e.target === svg || e.target === gRoot) { panning = true; lx = e.clientX; ly = e.clientY; svg.setPointerCapture(e.pointerId); } });
  svg.addEventListener('pointermove', (e) => { if (!panning) return; view.x += e.clientX - lx; view.y += e.clientY - ly; lx = e.clientX; ly = e.clientY; layout(); });
  svg.addEventListener('pointerup', () => { panning = false; });
  svg.addEventListener('wheel', (e) => { e.preventDefault(); view.k = clamp(view.k * (e.deltaY > 0 ? 0.9 : 1.1), 0.4, 2.5); layout(); }, { passive: false });
  const stats = h('span', { style: { fontSize: '11px', opacity: .55 } }, '');
  const topBar = h('div.k-row', { style: { height: '44px', padding: '0 14px', gap: '14px', zIndex: 3 } },
    h('b', { style: { font: '800 15px Inter,system-ui', letterSpacing: '-.02em' } }, 'FF'),
    h('span', { style: { fontWeight: 700 } }, 'flowchart.fun-ish'),
    h('span', { style: { fontSize: '12px', opacity: .5 } }, 'indent text → graph'),
    h('span', { style: { flex: 1 } }),
    btn('Load example', () => { text = EXAMPLE; ta.value = text; ta.oninput(); toast('example loaded'); }),
    btn('Theme', () => { dark = !dark; applyTheme(); }),
    btn('Share stub', () => { try { location.hash = encodeURIComponent(text.slice(0, 800)); toast('hash updated'); } catch { toast('share stub'); } }),
  );
  const subBar = h('div.k-row', { style: { height: '34px', padding: '0 14px', gap: '10px', fontSize: '12px' } },
    h('span', { style: { fontWeight: 700, opacity: .7 } }, 'Document'),
    h('span', { style: { opacity: .4 } }, '·'),
    h('span', { style: { opacity: .6 } }, 'indent nests · `goes to:` edges · (Node) refs'),
    h('span', { style: { flex: 1 } }),
    stats,
    h('button', { style: { border: '1px solid var(--line)', background: 'transparent', borderRadius: '6px', padding: '3px 8px' }, onclick: () => { view.k = clamp(view.k * 1.15, 0.4, 2.5); layout(); } }, '+'),
    h('button', { style: { border: '1px solid var(--line)', background: 'transparent', borderRadius: '6px', padding: '3px 8px' }, onclick: () => { view.k = clamp(view.k * 0.87, 0.4, 2.5); layout(); } }, '−'),
    h('button', { style: { border: '1px solid var(--line)', background: 'transparent', borderRadius: '6px', padding: '3px 8px' }, onclick: () => { view = { x: 40, y: 40, k: 1 }; layout(); } }, 'Fit'),
  );
  root.style.display = 'grid';
  root.style.gridTemplateRows = '44px 34px 1fr';
  root.style.gridTemplateColumns = 'minmax(280px,38%) 1fr';
  root.append(topBar, subBar, editorWrap, canvasWrap);
  topBar.style.gridColumn = '1/-1';
  subBar.style.gridColumn = '1/-1';
  applyTheme();
  layout();
  window.__demoProof = async () => {
    text = EXAMPLE; ta.value = text; ta.oninput();
    await sleep(250);
    const n = nodes.find((x) => x.label.includes('Share')) || nodes[1];
    if (n) highlightLine(n.line);
    view.k = 1.2; view.x = 20; layout();
    await sleep(120);
    dark = true; applyTheme(); await sleep(80); dark = false; applyTheme();
    return `nodes ${nodes.length} edges ${edges.length}; click-highlight line ${selLine}; theme toggled; zoom ${view.k}`;
  };
};

V['rive-motion-state-editor'] = (root, T) => {
  theme(root, T, { bg: '#1d1d1d', fg: '#e8e8e8', panel: '#252525', ac: '#39c5ff', ac2: '#7c5cff', dark: true, line: '#ffffff14' });
  const STATES = [
    { id: 'idle', label: 'Idle', x: 40, y: 60 },
    { id: 'hover', label: 'Hover', x: 200, y: 40 },
    { id: 'pressed', label: 'Pressed', x: 360, y: 70 },
    { id: 'exit', label: 'Exit', x: 200, y: 160 },
  ];
  const EDGES = [['idle', 'hover'], ['hover', 'pressed'], ['pressed', 'idle'], ['hover', 'exit'], ['exit', 'idle']];
  const defaults = {
    idle: { x: 0, y: 0, scale: 1, opacity: 1, rot: 0 },
    hover: { x: 0, y: -8, scale: 1.12, opacity: 1, rot: 0 },
    pressed: { x: 0, y: 4, scale: 0.92, opacity: 1, rot: -4 },
    exit: { x: 40, y: -20, scale: 0.6, opacity: 0.2, rot: 12 },
  };
  let state = 'idle', playing = false, t = 0;
  let props = { ...defaults.idle };
  const shape = h('div', { style: { width: '120px', height: '120px', borderRadius: '28px', background: 'linear-gradient(135deg,#39c5ff,#7c5cff)', boxShadow: '0 18px 40px #0008', transition: 'transform .1s linear, opacity .1s linear' } });
  const artboard = h('div', { style: { position: 'relative', width: '420px', height: '280px', background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '4px', display: 'grid', placeItems: 'center' } },
    h('div', { style: { position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '24px 24px' } }),
    shape,
    h('div', { style: { position: 'absolute', left: '10px', top: '8px', fontSize: '11px', opacity: 0.55, fontFamily: 'JetBrains Mono Variable,monospace' } }, 'Artboard 1 · 420×280'));
  const smSvg = s('svg', { viewBox: '0 0 480 240', style: 'width:100%;height:210px;display:block' });
  const tlTrack = h('div', { style: { position: 'relative', height: '54px', background: '#1a1a1a', borderRadius: '4px', cursor: 'pointer', border: '1px solid #333' } });
  const playBtn = h('button', { style: { background: '#39c5ff', color: '#111', border: 0, borderRadius: '4px', padding: '6px 14px', fontWeight: 800 } }, '▶ Play');
  const frameLab = h('span', { style: { fontFamily: 'monospace', fontSize: '11px', opacity: 0.6 } }, '0f');
  const insp = h('div', { style: { display: 'grid', gap: '8px' } });
  const stateLab = h('span', { style: { fontSize: '11px', color: '#39c5ff' } }, 'idle');

  const applyProps = () => {
    shape.style.transform = `translate(${props.x}px,${props.y}px) rotate(${props.rot}deg) scale(${props.scale})`;
    shape.style.opacity = String(props.opacity);
  };
  const lerpProp = (a, b, u) => {
    const o = {};
    for (const k of Object.keys(a)) o[k] = a[k] + (b[k] - a[k]) * u;
    return o;
  };
  const drawSM = () => {
    const wires = EDGES.map(([a, b]) => {
      const A = STATES.find((x) => x.id === a), B = STATES.find((x) => x.id === b);
      const x1 = A.x + 110, y1 = A.y + 22, x2 = B.x, y2 = B.y + 22;
      const dx = Math.max(30, Math.abs(x2 - x1) * 0.4);
      return s('path', { d: `M${x1} ${y1}C${x1 + dx} ${y1},${x2 - dx} ${y2},${x2} ${y2}`, stroke: '#666', 'stroke-width': 1.5, fill: 'none', 'marker-end': 'url(#arr)' });
    });
    const nodes = STATES.map((n) => {
      const on = n.id === state;
      return s('g', { style: 'cursor:pointer', onclick: () => setState(n.id) },
        s('rect', { x: n.x, y: n.y, width: 110, height: 44, rx: 8, fill: on ? '#39c5ff22' : '#2e2e2e', stroke: on ? '#39c5ff' : '#555', 'stroke-width': on ? 2 : 1 }),
        s('text', { x: n.x + 14, y: n.y + 27, fill: '#eee', 'font-size': 13, 'font-family': 'Inter Variable,system-ui', 'font-weight': 600 }, n.label));
    });
    smSvg.replaceChildren(
      s('defs', {}, s('marker', { id: 'arr', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' }, s('path', { d: 'M0 0L10 5L0 10z', fill: '#888' }))),
      ...wires, ...nodes);
  };
  const drawTL = () => {
    tlTrack.replaceChildren(
      h('div', { style: { position: 'absolute', left: '8px', right: '8px', top: '26px', height: '2px', background: '#444' } }),
      ...[0, 25, 50, 75, 100].map((x) => h('div', { style: { position: 'absolute', left: `calc(8px + ${x}% * 0.96)`, top: '18px', width: '1px', height: '18px', background: '#666' } },
        h('span', { style: { position: 'absolute', top: '-14px', left: '-6px', fontSize: '9px', opacity: 0.5, fontFamily: 'monospace' } }, String(x)))),
      ...[0, 33, 66, 100].map((x) => h('div', { style: { position: 'absolute', left: `calc(8px + ${x}% * 0.96)`, top: '22px', width: '10px', height: '10px', marginLeft: '-5px', background: '#39c5ff', transform: 'rotate(45deg)' } })),
      h('div', { style: { position: 'absolute', left: `calc(8px + ${t}% * 0.96)`, top: '4px', bottom: '4px', width: '2px', background: '#ff5c8a' } },
        h('div', { style: { position: 'absolute', top: '-2px', left: '-5px', width: '12px', height: '12px', background: '#ff5c8a', borderRadius: '2px' } })),
    );
    frameLab.textContent = `${Math.round(t)}f`;
  };
  const drawInspector = () => {
    insp.replaceChildren(
      h('div.k-h', {}, 'Transform'),
      slider('X', -80, 80, props.x, 1, (v) => { props.x = v; applyProps(); }),
      slider('Y', -80, 80, props.y, 1, (v) => { props.y = v; applyProps(); }),
      slider('Scale', 0.2, 2, props.scale, 0.01, (v) => { props.scale = v; applyProps(); }, (v) => (+v).toFixed(2)),
      slider('Opacity', 0, 1, props.opacity, 0.01, (v) => { props.opacity = v; applyProps(); }, (v) => (+v).toFixed(2)),
      slider('Rotation', -45, 45, props.rot, 1, (v) => { props.rot = v; applyProps(); }),
      h('div.k-h', {}, 'State'),
      h('div', { style: { fontSize: '12px', opacity: 0.8 } }, `Active · ${state}`),
      h('div.k-row', { style: { flexWrap: 'wrap', gap: '6px' } }, ...STATES.map((n) => h('button', {
        style: { border: `1px solid ${n.id === state ? '#39c5ff' : '#444'}`, background: n.id === state ? '#39c5ff22' : '#2a2a2a', color: '#eee', borderRadius: '4px', padding: '4px 8px', fontSize: '11px' },
        onclick: () => setState(n.id),
      }, n.label))),
    );
  };
  const sampleAt = (u) => {
    const keys = [{ t: 0, s: 'idle' }, { t: 0.33, s: 'hover' }, { t: 0.66, s: 'pressed' }, { t: 1, s: 'idle' }];
    let a = keys[0], b = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) if (u >= keys[i].t && u <= keys[i + 1].t) { a = keys[i]; b = keys[i + 1]; }
    const f = b.t === a.t ? 0 : (u - a.t) / (b.t - a.t);
    props = lerpProp(defaults[a.s], defaults[b.s], f);
    state = u < a.t + (b.t - a.t) * 0.5 ? a.s : b.s;
    stateLab.textContent = state;
    applyProps(); drawSM(); drawTL(); drawInspector();
  };
  const setState = (id) => {
    state = id;
    props = { ...defaults[id] };
    t = ({ idle: 0, hover: 33, pressed: 66, exit: 85 })[id] ?? t;
    stateLab.textContent = state;
    applyProps(); drawSM(); drawTL(); drawInspector();
  };

  drag(tlTrack, {
    start: (e) => { const p = localPos(e, tlTrack); t = clamp((p.x / p.w) * 100, 0, 100); sampleAt(t / 100); },
    move: (e) => { const p = localPos(e, tlTrack); t = clamp((p.x / p.w) * 100, 0, 100); sampleAt(t / 100); },
  });
  const loop = () => {
    if (playing) { t = (t + 0.7) % 100; sampleAt(t / 100); }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  playBtn.onclick = () => {
    playing = !playing;
    playBtn.textContent = playing ? '⏸ Pause' : '▶ Play';
    playBtn.style.background = playing ? '#ff5c8a' : '#39c5ff';
  };

  const top = h('div.k-row', { style: { height: '36px', background: '#161616', borderBottom: '1px solid #2a2a2a', padding: '0 12px', gap: '14px', fontSize: '12px' } },
    h('b', { style: { color: '#39c5ff', letterSpacing: '0.04em' } }, '◇ RIVE'),
    ...['File', 'Edit', 'View', 'Animate', 'Window'].map((x) => h('span', { style: { opacity: 0.7 } }, x)),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: 0.45, fontFamily: 'monospace', fontSize: '11px' } }, 'motion-state-demo.riv'));
  const left = h('div', { style: { background: '#222', borderRight: '1px solid #2e2e2e', padding: '10px', display: 'grid', alignContent: 'start', gap: '6px', fontSize: '12px', overflow: 'auto' } },
    h('div.k-h', {}, 'Hierarchy'),
    ...['Artboard 1', '  └ Shape', '  └ State Machine 1', 'Animations', '  └ Timeline'].map((x, i) => h('div', { style: { padding: '4px 6px', borderRadius: '4px', background: i === 2 ? '#39c5ff22' : 'transparent', color: i === 2 ? '#39c5ff' : '#ccc' } }, x)));
  const center = h('div', { style: { display: 'grid', gridTemplateRows: '1fr 248px', minHeight: 0, overflow: 'hidden' } },
    h('div', { style: { display: 'grid', placeItems: 'center', background: '#1a1a1a' } }, artboard),
    h('div', { style: { background: '#202020', borderTop: '1px solid #2e2e2e', padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: '12px', minHeight: 0 } },
      h('div', {}, h('div.k-row', { style: { marginBottom: '6px' } }, h('b', { style: { fontSize: '11px', opacity: 0.7 } }, 'STATE MACHINE'), h('span', { style: { flex: 1 } }), stateLab), smSvg),
      h('div', {}, h('div.k-row', { style: { marginBottom: '6px', gap: '8px' } }, h('b', { style: { fontSize: '11px', opacity: 0.7 } }, 'TIMELINE'), h('span', { style: { flex: 1 } }), playBtn, frameLab), tlTrack,
        h('div', { style: { marginTop: '8px', fontSize: '11px', opacity: 0.5 } }, 'Scrub playhead · diamond keyframes · Play drives Idle→Hover→Pressed'))));
  const right = h('div', { style: { background: '#222', borderLeft: '1px solid #2e2e2e', padding: '12px', overflow: 'auto' } }, h('div.k-h', {}, 'Inspector'), insp);

  root.style.display = 'grid';
  root.style.gridTemplateColumns = '180px 1fr 240px';
  root.style.gridTemplateRows = '36px 1fr';
  root.append(top, left, center, right);
  top.style.gridColumn = '1 / -1';
  setState('idle');
  window.__demoProof = async () => {
    setState('hover'); await sleep(80);
    playing = true; playBtn.textContent = '⏸ Pause'; playBtn.style.background = '#ff5c8a';
    await sleep(350);
    playing = false; playBtn.textContent = '▶ Play'; playBtn.style.background = '#39c5ff';
    t = 50; sampleAt(0.5);
    props.scale = 1.35; applyProps(); drawInspector();
    await sleep(50);
    setState('pressed'); await sleep(60);
    setState('idle');
    return 'states Idle→Hover→Pressed; timeline scrubbed; scale edited; play toggled';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['noisecraft-node-audio-graph'])(root, T); }
