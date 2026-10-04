import { h, css, drag, localPos, clamp, oklchToHex, hexToOklch, hexToRgb, copy, toast, gesture, sleep, noise2, fitCanvas } from '../lib.js';
import { theme, slider, seg, select, btn, codebox, panel, grid } from '../kit.js';
css(`
.gr-hdr{display:grid;grid-template-columns:260px 1fr 330px;gap:18px;padding:18px;height:100%}
.gr-logo{width:64px;height:64px;border-radius:50%;background:conic-gradient(from 90deg,#f0f,#0ff,#ff0,#f0f);margin:4px auto 6px}
.gr-stage{position:relative;display:grid;place-items:center}
.gr-prev{position:relative;width:min(100%,640px);aspect-ratio:1;border-radius:14px;box-shadow:0 30px 80px #0002}
.gr-badge{position:absolute;left:14px;top:14px;background:#000a;color:#fff;font:700 11px system-ui;padding:4px 8px;border-radius:6px}
.gr-guide{position:absolute;left:50%;top:50%;height:2px;background:#fff;box-shadow:0 0 0 1px #0003;transform-origin:0 50%}
.gr-stop{position:absolute;width:28px;height:28px;margin:-14px;border-radius:50%;border:4px solid #fff;box-shadow:0 2px 10px #0006;cursor:grab;touch-action:none}
.gr-stop.sel{outline:3px solid #111;outline-offset:2px}
.gr-card{border:1px solid var(--line);border-radius:10px;padding:10px;display:grid;gap:6px;background:#fff}
.gr-card.sel{border-color:#111;box-shadow:0 0 0 2px #1111}
.gr-pad{display:grid;grid-template-columns:repeat(3,34px);gap:4px}.gr-pad button{height:34px;border:1px solid var(--line);background:#fff;border-radius:8px;font-size:15px}
.gr-ex{display:flex;gap:6px;flex-wrap:wrap}.gr-ex button{width:30px;height:30px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px #0003}
.gr-types{display:flex;gap:6px}.gr-types button{flex:1;padding:10px 0;border:1px solid var(--line);background:#fff;border-radius:10px}.gr-types button.on{background:#111;color:#fff}
`);
const V = {};
function stopsEditor(root, T, cfg) {
  // shared state for HDR + AIKIZI
  const st = { type: 'linear', angle: 90, space: 'oklab', stops: cfg.stops.map((c, i) => ({ c, p: i / (cfg.stops.length - 1) })), sel: 0 };
  const cssOf = (modern = true) => {
    const list = st.stops.slice().sort((a, b) => a.p - b.p).map((s) => { const [L, C, H] = hexToOklch(s.c); return `${modern ? `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})` : s.c} ${(s.p * 100).toFixed(0)}%`; }).join(', ');
    const head = st.type === 'linear' ? `${st.angle}deg` : st.type === 'radial' ? 'circle at center' : `from ${st.angle}deg`;
    return `${st.type}-gradient(${head}${modern ? ` in ${st.space}` : ''}, ${list})`;
  };
  return { st, cssOf };
}
V['hdr-oklch-gradient-sculptor'] = (root, T) => {
  theme(root, T, { bg: '#f6f7f9', fg: '#18181b', panel: '#ffffff', ac: '#111111', dark: false });
  const { st, cssOf } = stopsEditor(root, T, { stops: ['#ff00ff', '#00ffff'] });
  const prev = h('div.gr-prev'), guide = h('div.gr-guide');
  prev.append(h('span.gr-badge', {}, 'HDR'), guide);
  const cards = h('div', { style: { display: 'grid', gap: '8px' } });
  const out = codebox(() => `--hdr-gradient: ${cssOf(true)};\n--sdr-gradient: ${cssOf(false)};\n\n@media (dynamic-range: high) {\n  .hero { background: var(--hdr-gradient); }\n}`);
  const typeBtns = ['linear', 'radial', 'conic'].map((t) => h('button', { class: t === st.type ? 'on' : '', onclick: (e) => { st.type = t; typeBtns.forEach((b) => b.classList.toggle('on', b === e.currentTarget)); draw(); } }, { linear: '╱ Linear', radial: '◎ Radial', conic: '◔ Conic' }[t]));
  const ang = slider('Angle', 0, 360, st.angle, 1, (v) => { st.angle = v; draw(); }, (v) => v + '°');
  const pad = h('div.gr-pad', {}, [315, 0, 45, 270, null, 90, 225, 180, 135].map((a) => h('button', { onclick: () => a != null && ang.set(a) }, a == null ? '•' : ['↖', '↑', '↗', '←', '', '→', '↙', '↓', '↘'][[315, 0, 45, 270, null, 90, 225, 180, 135].indexOf(a)])));
  const EX = [['#ff00ff', '#00ffff'], ['#ff3d00', '#ffe600', '#00ff85'], ['#6a00ff', '#ff00a8'], ['#00e1ff', '#0022ff', '#ff00d4'], ['#ffea00', '#ff006a'], ['#00ffa3', '#0066ff']];
  const ex = h('div.gr-ex', {}, EX.map((e) => h('button', { style: { background: `linear-gradient(135deg,${e.join(',')})` }, onclick: () => { st.stops = e.map((c, i) => ({ c, p: i / (e.length - 1) })); st.sel = 0; draw(); } })));
  const space = select(['oklab', 'oklch', 'srgb', 'hsl', 'display-p3'].map((x) => [x, x]), st.space, (v) => { st.space = v; draw(); });
  function place() {
    prev.querySelectorAll('.gr-stop').forEach((e) => e.remove());
    const r = prev.getBoundingClientRect(); const R = r.width * 0.42; const a = ((st.angle - 90) * Math.PI) / 180;
    Object.assign(guide.style, { width: 2 * R + 'px', left: r.width / 2 - R * Math.cos(a) + 'px', top: r.height / 2 - R * Math.sin(a) + 'px', transform: `rotate(${st.angle - 90}deg)`, display: st.type === 'linear' ? '' : 'none' });
    st.stops.forEach((s, i) => {
      const x = st.type === 'linear' ? r.width / 2 + (s.p * 2 - 1) * R * Math.cos(a) : r.width / 2 + s.p * R;
      const y = st.type === 'linear' ? r.height / 2 + (s.p * 2 - 1) * R * Math.sin(a) : r.height / 2;
      const k = h('div.gr-stop', { class: i === st.sel ? 'gr-stop sel' : 'gr-stop', style: { left: x + 'px', top: y + 'px', background: s.c } });
      drag(k, { start: () => { st.sel = i; }, move: (e) => { const p = localPos(e, prev); const t = st.type === 'linear' ? ((p.x - r.width / 2) * Math.cos(a) + (p.y - r.height / 2) * Math.sin(a)) / (2 * R) + 0.5 : (p.x - r.width / 2) / R; s.p = clamp(t, 0, 1); draw(); } });
      prev.append(k);
    });
  }
  function drawCards() {
    cards.replaceChildren(...st.stops.map((s, i) => {
      const [L, C, H] = hexToOklch(s.c);
      const upd = (l, c, hh) => { s.c = oklchToHex(l, c, hh); draw(); };
      const lab = st.space === 'oklch' || st.space === 'oklab' ? `oklch(${(L * 100).toFixed(0)}% ${C.toFixed(2)} ${H.toFixed(0)})` : st.space === 'hsl' ? `hsl(${H.toFixed(0)} …)` : s.c;
      return h('div.gr-card', { class: i === st.sel ? 'gr-card sel' : 'gr-card', onclick: () => { st.sel = i; place(); } },
        h('div.k-row', {}, h('span.k-sw', { style: { background: s.c, width: '22px', height: '22px' } }), h('b', {}, lab), h('span', { style: { flex: 1 } }), btn('✕', (e) => { e.stopPropagation(); if (st.stops.length > 2) { st.stops.splice(i, 1); st.sel = 0; draw(); } })),
        slider('L', 0, 1, L, 0.01, (v) => upd(v, C, H), (v) => (v * 100).toFixed(0) + '%'), slider('C', 0, 0.37, C, 0.005, (v) => upd(L, v, H), (v) => v.toFixed(3)), slider('H', 0, 360, H, 1, (v) => upd(L, C, v), (v) => v.toFixed(0) + '°'),
        slider('Position', 0, 100, Math.round(s.p * 100), 1, (v) => { s.p = v / 100; prev.style.background = cssOf(true); place(); out.update(); }, (v) => v + '%'));
    }));
  }
  function draw() { prev.style.background = cssOf(true); place(); drawCards(); out.update(); }
  const addRandom = () => { st.stops.push({ c: oklchToHex(0.6 + Math.random() * 0.3, 0.15 + Math.random() * 0.15, Math.random() * 360), p: Math.random() }); st.sel = st.stops.length - 1; draw(); };
  root.append(h('div.gr-hdr', {},
    panel(null, h('div.gr-logo'), h('div', { style: { textAlign: 'center', fontWeight: 800, fontSize: '18px' } }, 'HDR Gradients'), h('div.k-h', {}, 'Type'), h('div.gr-types', {}, typeBtns), h('div.k-h', {}, 'Direction'), pad, ang, h('div.k-h', {}, 'HD examples'), ex, btn('Start new', () => { st.stops = [{ c: '#ff00ff', p: 0 }, { c: '#00ffff', p: 1 }]; draw(); })),
    h('div.gr-stage', {}, prev),
    panel(null, h('div.k-row', {}, h('b', {}, 'Color space'), h('span', { style: { flex: 1 } }), space), cards, btn('+ Add a random color', addRandom, 'pri'), h('div.k-h', {}, 'CSS'), out,
      h('div.k-row', {}, btn('Copy modern', () => copy(cssOf(true)), 'pri'), btn('Copy classic', () => copy(cssOf(false)))))));
  new ResizeObserver(place).observe(prev); draw();
  window.__demoProof = async () => { const k = prev.querySelectorAll('.gr-stop')[1]; const r = k.getBoundingClientRect(), pr = prev.getBoundingClientRect(); await gesture(k, [[14, 14], [-30, 6], [-70, 10]]); addRandom(); return 'dragged stop 2 + added random stop: ' + cssOf(true).slice(0, 80); };
};
V['multi-kind-gradient-studio'] = (root, T) => {
  theme(root, T, { bg: '#111', fg: '#f3f3f3', panel: '#161616', ac: '#ff5a36', dark: true });
  const { st, cssOf } = stopsEditor(root, T, { stops: ['#ff5f6d', '#ff8a4c', '#ffc371'] });
  st.angle = 160; let grain = 0.25;
  const prev = h('div', { style: { position: 'relative', height: '100%' } });
  const grainEl = h('div', { style: { position: 'absolute', inset: 0, mixBlendMode: 'overlay', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")' } });
  prev.append(grainEl);
  const strip = h('div', { style: { position: 'relative', height: '26px', borderRadius: '6px' } });
  const out = codebox(() => `background: ${cssOf(false)};`);
  function draw() {
    const kind = st.type; prev.style.background = kind === 'mesh' ? st.stops.map((s, i) => `radial-gradient(at ${[10, 90, 30, 70][i % 4]}% ${[10, 20, 90, 70][i % 4]}%, ${s.c} 0, transparent 60%)`).join(',') + ',' + st.stops[0].c : cssOf(false);
    grainEl.style.opacity = grain; strip.style.background = `linear-gradient(90deg, ${st.stops.map((s) => `${s.c} ${s.p * 100}%`).join(',')})`;
    strip.replaceChildren(...st.stops.map((s, i) => { const k = h('div', { style: { position: 'absolute', top: '-4px', left: `calc(${s.p * 100}% - 8px)`, width: '16px', height: '34px', borderRadius: '5px', border: '3px solid #fff', background: s.c, cursor: 'ew-resize', touchAction: 'none' } }); drag(k, { move: (e) => { s.p = clamp(localPos(e, strip).x / strip.clientWidth, 0, 1); draw(); } }); return k; }));
    out.update();
  }
  const kinds = seg([['linear', 'Linear'], ['radial', 'Radial'], ['conic', 'Conic'], ['mesh', 'Mesh']], 'linear', (v) => { st.type = v; draw(); });
  const colors = h('div.k-row', {}, st.stops.map((s, i) => h('input', { type: 'color', value: s.c, oninput: (e) => { s.c = e.target.value; draw(); }, style: { width: '40px', height: '32px', border: 0, background: 'none' } })));
  grid(root, '1fr 340px').append(prev, panel('Gradient studio', h('div', { style: { fontSize: '12px', opacity: .6 } }, 'Create modern gradients with grain, mesh and image maps.'), kinds, h('div.k-h', {}, 'Color stops'), strip, colors,
    slider('Angle', 0, 360, st.angle, 1, (v) => { st.angle = v; draw(); }, (v) => v + '°'), slider('Grain', 0, 1, grain, 0.01, (v) => { grain = v; draw(); }), out, h('div.k-row', {}, btn('Copy CSS', () => copy(out.textContent), 'pri'), btn('Export PNG', () => toast('PNG export queued (demo)')))));
  draw();
  window.__demoProof = async () => { kinds.buttons[3].click(); await gesture(strip.children[1], [[8, 10], [60, 10]]); return 'switched to mesh + dragged stop'; };
};
V['mesh-gradient-webgl-sculptor'] = (root, T) => {
  theme(root, T, { bg: '#f4f4f6', fg: '#1b1b1f', panel: '#ffffff', ac: '#1b1b1f', dark: false });
  const PRE = [['#ff7eb3', '#ff758c', '#7afcff', '#feffb7', '#a18cd1', '#fbc2eb'], ['#0f0c29', '#302b63', '#24243e', '#ff00cc', '#333399', '#00dbde'], ['#f6d365', '#fda085', '#fbc2eb', '#a6c1ee', '#84fab0', '#8fd3f4'], ['#1e3c72', '#2a5298', '#6dd5ed', '#cc2b5e', '#753a88', '#ee9ca7']];
  let pts = [], play = false, speed = 0.4, t0 = 0;
  const setPreset = (p) => { pts = []; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) pts.push({ x: 0.12 + i * 0.38, y: 0.12 + j * 0.38, bx: 0.12 + i * 0.38, by: 0.12 + j * 0.38, c: p[(i + j * 3) % p.length] }); };
  setPreset(PRE[0]);
  const stage = h('div', { style: { position: 'relative', width: 'min(620px,100%)', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 20px 60px #0002', margin: 'auto' } });
  const cv = h('canvas', { width: 96, height: 96, style: { width: '100%', height: '100%', imageRendering: 'auto', filter: 'blur(6px)', transform: 'scale(1.05)' } });
  const svgL = h('div', { style: { position: 'absolute', inset: 0 } }); stage.append(cv, svgL);
  const g = cv.getContext('2d'); const rgb = (c) => hexToRgb(c);
  function render() {
    const img = g.createImageData(96, 96);
    for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) { let sw = 0, r = 0, gg = 0, b = 0; for (const p of pts) { const d = (x / 95 - p.x) ** 2 + (y / 95 - p.y) ** 2 + 0.002; const w = 1 / (d * d); const [R, G, B] = p.rgb; r += R * w; gg += G * w; b += B * w; sw += w; } const k = (y * 96 + x) * 4; img.data[k] = r / sw; img.data[k + 1] = gg / sw; img.data[k + 2] = b / sw; img.data[k + 3] = 255; }
    g.putImageData(img, 0, 0);
    svgL.replaceChildren(...pts.map((p, i) => { const k = h('div', { style: { position: 'absolute', left: p.x * 100 + '%', top: p.y * 100 + '%', width: '18px', height: '18px', margin: '-9px', borderRadius: '50%', border: '3px solid #fff', background: p.c, boxShadow: '0 1px 6px #0005', cursor: 'move', touchAction: 'none' } }); drag(k, { move: (e) => { const q = localPos(e, stage); p.x = p.bx = clamp(q.x / q.w, 0, 1); p.y = p.by = clamp(q.y / q.h, 0, 1); upd(); } }); return k; }));
  }
  const upd = () => { pts.forEach((p) => (p.rgb = rgb(p.c))); render(); };
  const tick = (t) => { if (play) { pts.forEach((p, i) => { p.x = clamp(p.bx + Math.sin(t / 1000 * speed + i) * 0.06, 0, 1); p.y = clamp(p.by + Math.cos(t / 1300 * speed + i * 2) * 0.06, 0, 1); }); render(); } requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const presets = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } }, [...PRE, ...PRE.map((p) => p.slice().reverse())].map((p) => h('button', { style: { aspectRatio: '1', border: 0, borderRadius: '8px', background: `radial-gradient(at 20% 20%, ${p[0]}, transparent 60%), radial-gradient(at 80% 30%, ${p[2]}, transparent 60%), radial-gradient(at 50% 90%, ${p[4]}, transparent 60%), ${p[1]}` }, onclick: () => { setPreset(p); upd(); } })));
  grid(root, '220px 1fr 280px', '1fr', 16).style.padding = '16px';
  root.append(panel('Presets', presets), h('div', { style: { display: 'grid', placeItems: 'center' } }, stage),
    panel('Inspector', h('div.k-row', {}, btn('▶ Play', (e) => { play = !play; e.target.textContent = play ? '❚❚ Pause' : '▶ Play'; }, 'pri'), btn('Randomize', () => { pts.forEach((p) => { p.bx = p.x = Math.random(); p.by = p.y = Math.random(); p.c = PRE[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 6)]; }); upd(); })),
      slider('Speed', 0, 2, speed, 0.05, (v) => (speed = v)), slider('Blur', 0, 20, 6, 1, (v) => (cv.style.filter = `blur(${v}px)`)), h('div.k-h', {}, 'Points'), h('div.k-row', { style: { flexWrap: 'wrap' } }, pts.map((p, i) => h('input', { type: 'color', value: p.c, oninput: (e) => { pts[i].c = e.target.value; upd(); }, style: { width: '34px', height: '28px', border: 0 } }))),
      h('div.k-h', {}, 'Export'), h('div.k-row', {}, ['PNG', 'SVG', 'CSS', 'MP4'].map((f) => btn(f, () => f === 'CSS' ? copy(`background: ${pts.map((p) => `radial-gradient(at ${(p.x * 100) | 0}% ${(p.y * 100) | 0}%, ${p.c} 0, transparent 55%)`).join(', ')};`) : toast(`${f} export (demo)`))))));
  upd();
  window.__demoProof = async () => { await gesture(svgL.children[4], [[9, 9], [60, -40], [120, -80]]); return 'dragged center lattice point'; };
};
V['shader-gradient-playground'] = (root, T) => {
  theme(root, T, { bg: '#ff6a3d', fg: '#fff', panel: '#ffffffee', dark: true });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } }); root.append(cv);
  let cols = ['#ff5005', '#dbba95', '#d0bce1'], speed = 0.4, dens = 1.3, shape = 'plane';
  const N = noise2(3);
  const W = 160, H = 100; cv.width = W; cv.height = H; const g = cv.getContext('2d'); const img = g.createImageData(W, H);
  const tick = (t) => {
    const c = cols.map(hexToRgb); const tt = t / 1000 * speed;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H; let n = N(u * 2 * dens + tt, v * 2 * dens - tt * 0.6);
      if (shape === 'sphere') n = n * 0.6 + 0.4 * (1 - Math.hypot(u - 0.5, (v - 0.5) * 0.6) * 2);
      if (shape === 'waterPlane') n = 0.5 + 0.5 * Math.sin((u + n) * 10 + tt * 3);
      const k = clamp(n * 1.4 - 0.2 + v * 0.3, 0, 1); const a = k < 0.5 ? c[0] : c[1], b = k < 0.5 ? c[1] : c[2]; const f = k < 0.5 ? k * 2 : k * 2 - 1;
      const i = (y * W + x) * 4; img.data[i] = a[0] + (b[0] - a[0]) * f; img.data[i + 1] = a[1] + (b[1] - a[1]) * f; img.data[i + 2] = a[2] + (b[2] - a[2]) * f; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0); requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const PRE = { 'Halo': ['#ff5005', '#dbba95', '#d0bce1'], 'Pensive': ['#606080', '#8d7dca', '#212121'], 'Mint': ['#94ffd1', '#6bf5ff', '#ffffff'], 'Interstella': ['#73bfc4', '#ff810a', '#8da0ce'], 'Nighty night': ['#1a0b2e', '#4f1a6b', '#ff4f9a'] };
  let names = Object.keys(PRE), idx = 0;
  const title = h('div', { style: { position: 'absolute', top: '22%', width: '100%', textAlign: 'center', font: '300 44px/1 "Inter Variable"', letterSpacing: '-.02em' } }, '00 Halo');
  const bar = h('div', { style: { position: 'absolute', left: '50%', bottom: '28px', transform: 'translateX(-50%)', display: 'flex', gap: '8px', background: '#ffffffe8', color: '#111', padding: '8px', borderRadius: '14px', boxShadow: '0 10px 40px #0003', alignItems: 'center' } });
  const drawer = panel('Customize', seg(['plane', 'sphere', 'waterPlane'], shape, (v) => (shape = v)), h('div.k-row', {}, cols.map((c, i) => h('input', { type: 'color', value: c, oninput: (e) => (cols[i] = e.target.value), style: { width: '44px', height: '30px', border: 0 } }))), slider('Speed', 0, 2, speed, 0.05, (v) => (speed = v)), slider('Density', 0.3, 4, dens, 0.1, (v) => (dens = v)));
  Object.assign(drawer.style, { position: 'absolute', right: '20px', top: '20px', width: '280px', color: '#111', background: '#ffffffee', display: 'none' });
  const go = (d) => { idx = (idx + d + names.length) % names.length; cols = PRE[names[idx]].slice(); title.textContent = String(idx).padStart(2, '0') + ' ' + names[idx]; };
  bar.append(btn('‹', () => go(-1)), h('b', { style: { padding: '0 8px' } }, 'Presets'), btn('›', () => go(1)), btn('Shape', () => (shape = shape === 'plane' ? 'sphere' : shape === 'sphere' ? 'waterPlane' : 'plane')), btn('Customize ⚙', () => (drawer.style.display = drawer.style.display ? '' : 'none')), btn('Copy URL', () => copy(location.href + '#' + cols.join(','))));
  root.append(title, bar, drawer);
  window.__demoProof = async () => { go(1); go(1); await sleep(400); drawer.style.display = ''; return 'preset → ' + names[idx]; };
};
V['whatamesh-gradient-desk'] = (root, T) => {
  theme(root, T, { bg: '#0f0f12', fg: '#f5f5f7', panel: '#ffffffee', ac: '#ff8fab', dark: true });
  const PRE = [
    ['#ff9a9e', '#fad0c4', '#a18cd1', '#fbc2eb', '#84fab0', '#8fd3f4'],
    ['#a1c4fd', '#c2e9fb', '#d4fc79', '#96e6a1', '#fbc2eb', '#a6c1ee'],
    ['#f6d365', '#fda085', '#fbc2eb', '#a18cd1', '#89f7fe', '#66a6ff'],
    ['#ffecd2', '#fcb69f', '#ff9a9e', '#fecfef', '#a1c4fd', '#c2e9fb'],
  ];
  let pts = [], play = true, speed = 0.55, t0 = performance.now();
  const setPreset = (p) => {
    pts = [];
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++)
      pts.push({ x: 0.1 + i * 0.4, y: 0.12 + j * 0.38, bx: 0.1 + i * 0.4, by: 0.12 + j * 0.38, c: p[(i + j * 2) % p.length] });
  };
  setPreset(PRE[0]);
  const cv = h('canvas', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'blur(28px)', transform: 'scale(1.12)' } });
  root.append(cv);
  const W = 72, H = 48; cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const rgb = (c) => hexToRgb(c);
  const meshCss = () => pts.map((p) => `radial-gradient(at ${Math.round(p.x * 100)}% ${Math.round(p.y * 100)}%, ${p.c} 0px, transparent 55%)`).join(', ') + `, ${pts[4]?.c || '#fbc2eb'}`;
  const render = () => {
    pts.forEach((p) => (p.rgb = rgb(p.c)));
    const img = g.createImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let sw = 0, r = 0, gg = 0, b = 0;
      for (const p of pts) {
        const d = (x / (W - 1) - p.x) ** 2 + (y / (H - 1) - p.y) ** 2 + 0.004;
        const w = 1 / (d * d);
        const [R, G, B] = p.rgb; r += R * w; gg += G * w; b += B * w; sw += w;
      }
      const k = (y * W + x) * 4;
      img.data[k] = r / sw; img.data[k + 1] = gg / sw; img.data[k + 2] = b / sw; img.data[k + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  };
  const tick = (t) => {
    if (play) {
      const tt = (t - t0) / 1000 * speed;
      pts.forEach((p, i) => {
        p.x = clamp(p.bx + Math.sin(tt * 1.1 + i * 0.9) * 0.07, 0, 1);
        p.y = clamp(p.by + Math.cos(tt * 0.9 + i * 1.3) * 0.07, 0, 1);
      });
      render();
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick); render();
  const colors = h('div.k-row', { style: { flexWrap: 'wrap', gap: '6px' } });
  const syncColors = () => {
    colors.replaceChildren(...pts.slice(0, 6).map((p, i) => h('input', {
      type: 'color', value: p.c,
      oninput: (e) => { pts[i].c = e.target.value; if (pts[i + 6]) pts[i + 6].c = e.target.value; render(); },
      style: { width: '34px', height: '28px', border: 0, background: 'none', cursor: 'pointer' },
    })));
  };
  syncColors();
  const playBtn = btn('❚❚ Pause', (e) => { play = !play; e.target.textContent = play ? '❚❚ Pause' : '▶ Play'; }, 'pri');
  const presets = h('div.k-row', { style: { flexWrap: 'wrap', gap: '6px' } }, PRE.map((p, i) => h('button', {
    style: { width: '36px', height: '28px', border: '2px solid #fff', borderRadius: '8px', cursor: 'pointer', background: `radial-gradient(at 30% 30%,${p[0]},transparent 55%), radial-gradient(at 70% 60%,${p[2]},transparent 55%), ${p[1]}` },
    onclick: () => { setPreset(p); syncColors(); render(); },
    title: 'Preset ' + (i + 1),
  }, '')));
  const float = h('div', {
    style: {
      position: 'absolute', left: '50%', bottom: '36px', transform: 'translateX(-50%)',
      background: '#fffffff2', color: '#1b1b1f', padding: '16px 18px', borderRadius: '18px',
      boxShadow: '0 20px 60px #0004', display: 'grid', gap: '10px', width: 'min(420px,92vw)', backdropFilter: 'blur(10px)',
    },
  },
    h('div.k-row', {}, h('b', { style: { font: '700 18px Inter Variable,system-ui', letterSpacing: '-.02em' } }, 'whatamesh'), h('span', { style: { flex: 1 } }), playBtn),
    h('div', { style: { fontSize: '12px', opacity: .55 } }, 'Soft pastel mesh · craft landing desk'),
    h('div.k-h', {}, 'Colors'), colors,
    h('div.k-h', {}, 'Presets'), presets,
    slider('Speed', 0, 2, speed, 0.05, (v) => (speed = v)),
    h('div.k-row', {},
      btn('Randomize', () => {
        pts.forEach((p) => {
          p.bx = p.x = Math.random(); p.by = p.y = Math.random();
          p.c = PRE[Math.floor(Math.random() * PRE.length)][Math.floor(Math.random() * 6)];
        });
        syncColors(); render();
      }),
      btn('Copy CSS', () => copy(`background: ${meshCss()};`, 'Mesh CSS copied'), 'pri'),
    ),
  );
  const title = h('div', { style: { position: 'absolute', top: '18%', width: '100%', textAlign: 'center', pointerEvents: 'none' } },
    h('div', { style: { font: '300 56px/1 Inter Variable,system-ui', letterSpacing: '-.03em', color: '#fff', textShadow: '0 8px 40px #0005' } }, 'whatamesh'),
    h('div', { style: { marginTop: '10px', opacity: .85, color: '#fff', fontSize: '14px' } }, 'animated CSS mesh gradients'),
  );
  root.append(title, float);
  window.__demoProof = async () => {
    play = true; speed = 1.2; setPreset(PRE[2]); syncColors(); render();
    await sleep(400);
    copy(meshCss());
    return 'preset 3 playing @1.2 · CSS copied';
  };
};

V['fluidshader-gradient-desk'] = (root, T) => {
  theme(root, T, { bg: '#121214', fg: '#f0f0f2', panel: '#1a1a1e', ac: '#8c35af', dark: true, line: '#2a2a30' });
  root.style.overflow = 'auto';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';
  root.style.padding = '28px 36px 48px';

  const STYLES = [
    { id: 'Fluid', cols: ['#2a0a4a', '#c42a8a', '#1a1a80'] },
    { id: 'Aurora', cols: ['#1a0a2a', '#f2a8c8', '#e8e8f8'] },
    { id: 'Silk', cols: ['#1a1028', '#e8a0c8', '#a8c8f0'] },
    { id: 'Caustics', cols: ['#041810', '#20ff90', '#10c8e0'] },
    { id: 'Plasma', cols: ['#1a2228', '#3a8a8a', '#c86878'] },
  ];
  const DITHERS = ['simplex', 'warp', 'dots', 'wave', 'ripple', 'swirl', 'sphere'];
  let style = 'Fluid';
  let dither = 'simplex';
  let t0 = performance.now();
  const N = noise2(7);

  const hdr = h('div', { style: { marginBottom: '28px' } },
    h('div.k-row', { style: { gap: '10px', marginBottom: '18px' } },
      h('div', { style: { width: '28px', height: '28px', borderRadius: '8px', background: 'conic-gradient(from 120deg,#8c35af,#336666,#63bf3f,#8c35af)' } }),
      h('b', { style: { font: '600 16px Inter Variable' } }, 'FluidShader'),
    ),
    h('div', { style: { font: '700 40px/1.1 Inter Variable', letterSpacing: '-.03em' } }, 'Shader playground'),
    h('div', { style: { marginTop: '10px', opacity: .55, fontSize: '14px', maxWidth: '520px', lineHeight: 1.5 } },
      'Choose a shader style below to start editing — tweak colors, speed, and patterns in real time.'),
  );

  const previewWrap = h('div', {
    style: {
      width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '28px',
      border: '1px solid #2a2a30', position: 'relative', background: '#000',
    },
  });
  const cv = h('canvas', { style: { width: '100%', height: '100%', display: 'block' } });
  previewWrap.append(cv);
  const badge = h('div', {
    style: {
      position: 'absolute', left: '14px', bottom: '14px', background: '#000a', color: '#fff',
      font: '600 12px Inter Variable', padding: '6px 10px', borderRadius: '8px',
    },
  }, 'Fluid · simplex');
  previewWrap.append(badge);

  const W = 320, H = 140;
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const img = g.createImageData(W, H);

  const styleCols = () => (STYLES.find((s) => s.id === style) || STYLES[0]).cols.map(hexToRgb);

  const ditherMask = (x, y, u, v, tt, n) => {
    if (dither === 'dots') return ((x * 3 + y * 5) % 7) / 7 > 0.55 ? 0 : 1;
    if (dither === 'wave') return (Math.sin(u * 18 + tt * 2) * 0.5 + 0.5 + n * 0.3) > (1 - v) ? 1 : 0.15;
    if (dither === 'ripple') {
      const d = Math.hypot(u - 0.5, v - 0.5);
      return (Math.sin(d * 40 - tt * 4) * 0.5 + 0.5) * (1 - d);
    }
    if (dither === 'swirl') {
      const dx = u - 0.5, dy = v - 0.5;
      const ang = Math.atan2(dy, dx) + Math.hypot(dx, dy) * 8 + tt;
      return (Math.sin(ang * 6) * 0.5 + 0.5);
    }
    if (dither === 'sphere') {
      const d = Math.hypot(u - 0.5, (v - 0.5) * 1.1);
      return d < 0.42 ? (0.6 + 0.4 * n) : 0.05;
    }
    if (dither === 'warp') return clamp(0.35 + n * 1.2 + Math.sin((u + n) * 12 + tt) * 0.2, 0, 1);
    // simplex default
    return clamp(0.4 + n * 0.9, 0, 1);
  };

  const tick = (t) => {
    const cols = styleCols();
    const tt = (t - t0) / 1000;
    const dens = style === 'Caustics' ? 3.2 : style === 'Silk' ? 2.4 : style === 'Aurora' ? 1.6 : 2.0;
    const spd = style === 'Plasma' ? 0.35 : 0.55;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      let n = N(u * dens + tt * spd, v * dens * 0.8 - tt * spd * 0.5);
      if (style === 'Aurora') n = 0.5 + 0.5 * Math.sin((v * 8 + n) * 2 + tt);
      if (style === 'Silk') n = 0.5 + 0.5 * Math.sin((u + v + n) * 10 + tt * 1.5);
      if (style === 'Caustics') n = Math.pow(clamp(0.55 + n * 0.7, 0, 1), 2.2);
      if (style === 'Plasma') n = 0.45 + 0.35 * Math.sin(u * 6 + tt) * Math.cos(v * 5 - tt * 0.7);
      const mask = ditherMask(x, y, u, v, tt, n);
      const k = clamp(n * 1.2, 0, 1);
      const a = k < 0.5 ? cols[0] : cols[1], b = k < 0.5 ? cols[1] : cols[2];
      const f = k < 0.5 ? k * 2 : k * 2 - 1;
      const i = (y * W + x) * 4;
      const m = Math.max(0.08, mask);
      img.data[i] = (a[0] + (b[0] - a[0]) * f) * m;
      img.data[i + 1] = (a[1] + (b[1] - a[1]) * f) * m;
      img.data[i + 2] = (a[2] + (b[2] - a[2]) * f) * m;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const mini = (kind, id, cols) => {
    const c = h('canvas', { width: 160, height: 96, style: { width: '100%', height: '110px', display: 'block', borderRadius: '12px 12px 0 0' } });
    const cg = c.getContext('2d');
    const paintMini = () => {
      const rgb = (cols || ['#222', '#888', '#eee']).map((x) => typeof x === 'string' ? hexToRgb(x) : x);
      for (let y = 0; y < 96; y++) for (let x = 0; x < 160; x += 2) {
        const u = x / 160, v = y / 96;
        let n = N(u * 2.5 + id.length * 0.1, v * 2 + id.length * 0.2);
        if (kind === 'dither') {
          const on = ditherMask(x, y, u, v, 0, n) > 0.45;
          const col = on ? (id === 'wave' ? [40, 180, 80] : id === 'ripple' ? [40, 180, 180] : id === 'simplex' ? [220, 200, 40] : [200, 40, 160]) : [0, 0, 0];
          cg.fillStyle = `rgb(${col})`;
          cg.fillRect(x, y, 2, 1);
        } else {
          const k = clamp(n * 1.1 + v * 0.2, 0, 1);
          const a = k < 0.5 ? rgb[0] : rgb[1], b = k < 0.5 ? rgb[1] : rgb[2];
          const f = k < 0.5 ? k * 2 : k * 2 - 1;
          cg.fillStyle = `rgb(${a[0] + (b[0] - a[0]) * f | 0},${a[1] + (b[1] - a[1]) * f | 0},${a[2] + (b[2] - a[2]) * f | 0})`;
          cg.fillRect(x, y, 2, 1);
        }
      }
    };
    paintMini();
    return c;
  };

  const card = (kind, id, sub, cols) => {
    const sel = kind === 'style' ? style === id : dither === id;
    return h('button', {
      style: {
        border: sel ? '2px solid #fff' : '1px solid #2a2a30',
        borderRadius: '14px', overflow: 'hidden', padding: 0, cursor: 'pointer',
        background: '#0c0c0e', color: '#fff', textAlign: 'left',
        boxShadow: sel ? '0 0 0 2px #8c35af55' : 'none',
        transition: 'border-color .15s',
      },
      onclick: () => {
        if (kind === 'style') style = id; else dither = id;
        badge.textContent = `${style} · ${dither}`;
        renderCards();
      },
    },
      mini(kind, id, cols),
      h('div', { style: { padding: '10px 12px 12px' } },
        h('div', { style: { font: '600 14px Inter Variable' } }, id),
        h('div', { style: { fontSize: '11px', opacity: .45, marginTop: '2px' } }, sub),
      ),
    );
  };

  const styleGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '14px', marginBottom: '32px' } });
  const ditherGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '12px' } });

  const renderCards = () => {
    styleGrid.replaceChildren(...STYLES.map((s) => card('style', s.id, 'Gradient shader', s.cols)));
    ditherGrid.replaceChildren(...DITHERS.map((d) => card('dither', d, 'Dither pattern')));
  };
  renderCards();

  root.append(
    hdr,
    previewWrap,
    h('div', { style: { fontSize: '11px', letterSpacing: '.08em', opacity: .45, marginBottom: '12px', textTransform: 'uppercase' } }, 'Gradient Styles'),
    styleGrid,
    h('div', { style: { fontSize: '11px', letterSpacing: '.08em', opacity: .45, marginBottom: '12px', textTransform: 'uppercase' } }, 'Dither Patterns'),
    ditherGrid,
  );

  window.__demoProof = async () => {
    style = 'Aurora'; dither = 'ripple'; badge.textContent = `${style} · ${dither}`; renderCards();
    await sleep(350);
    style = 'Caustics'; dither = 'swirl'; badge.textContent = `${style} · ${dither}`; renderCards();
    await sleep(350);
    style = 'Fluid'; dither = 'simplex'; badge.textContent = `${style} · ${dither}`; renderCards();
    return 'cycled Fluid→Aurora→Caustics with dither patterns; restored Fluid·simplex';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['hdr-oklch-gradient-sculptor'])(root, T); }
