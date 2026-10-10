import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, blip, drum, midi, audio, fitCanvas, noise2, css } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle } from '../kit.js';
import { scene } from './imagefx.js';
const MONO = "'JetBrains Mono Variable',monospace";
const V = {};
const noiseSrc = (kind = 'white') => { const ac = audio(); if (!ac) return null; const len = ac.sampleRate * 2; const b = ac.createBuffer(1, len, ac.sampleRate); const d = b.getChannelData(0); let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; } const src = ac.createBufferSource(); src.buffer = b; src.loop = true; return src; };
V['key-av-instrument'] = (root, T) => {
  theme(root, T, { bg: '#b3b3b3', fg: '#fff', ac: '#fff', dark: false });
  const PALS = [['#b3b3b3', '#f5d547', '#e0525e', '#57b8a8', '#fff'], ['#181818', '#ff4f8b', '#4fd1ff', '#ffe066', '#fff'], ['#2e3a59', '#f78c6b', '#83d483', '#ffd166', '#fff']]; let pi = 0;
  const cv = h('canvas', { style: { position: 'absolute', inset: 0 } }); root.append(cv); const anims = [];
  const fire = (k) => { const P = PALS[pi]; const c = pick(P.slice(1)); const kind = k.charCodeAt(0) % 5; const note = [48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72][k.charCodeAt(0) % 11]; kind === 0 ? drum('kick') : kind === 1 ? drum('snare') : blip(midi(note), 0.5, pick(['sine', 'triangle']), 0.15); anims.push({ kind, c, t: 0, x: Math.random(), y: Math.random(), r: Math.random() }); };
  window.addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); pi = (pi + 1) % PALS.length; root.style.background = PALS[pi][0]; return; } if (/^[a-z]$/i.test(e.key)) fire(e.key.toLowerCase()); });
  cv.addEventListener('pointerdown', () => fire(String.fromCharCode(97 + Math.floor(Math.random() * 26))));
  const loop = () => { fitCanvas(cv, root); const g = cv.g, W = cv.W, H = cv.H; g.clearRect(0, 0, W, H); for (const a of anims) { a.t += 0.02; const e = 1 - (1 - Math.min(1, a.t)) ** 3; g.globalAlpha = 1 - Math.max(0, a.t - 0.6) / 0.4; g.fillStyle = g.strokeStyle = a.c; g.lineWidth = 8; if (a.kind === 0) { g.beginPath(); g.arc(W / 2, H / 2, e * Math.max(W, H) * 0.6, 0, 7); g.fill(); } else if (a.kind === 1) { for (let i = 0; i < 12; i++) { const an = (i / 12) * 6.28; g.beginPath(); g.arc(a.x * W + Math.cos(an) * e * 200, a.y * H + Math.sin(an) * e * 200, 14, 0, 7); g.fill(); } } else if (a.kind === 2) { g.fillRect(0, a.y * H - 40, e * W, 80); } else if (a.kind === 3) { g.beginPath(); g.moveTo(0, H / 2); for (let x = 0; x <= W * e; x += 10) g.lineTo(x, H / 2 + Math.sin(x / 40 + a.t * 10) * 80); g.stroke(); } else { g.save(); g.translate(a.x * W, a.y * H); g.rotate(e * 3); g.strokeRect(-e * 150, -e * 150, e * 300, e * 300); g.restore(); } } g.globalAlpha = 1; while (anims.length && anims[0].t > 1) anims.shift(); requestAnimationFrame(loop); };
  root.append(h('div', { style: { position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#777', padding: '6px 16px', borderRadius: '99px', fontSize: '12px' } }, 'Press any key, A to Z, or spacebar, and turn up speakers.'), h('div.k-row', { style: { position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)', gap: '10px' } }, ...['▶ Google Play', ' App Store'].map((t) => h('span', { style: { background: '#000', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px' } }, t))));
  loop();
  window.__demoProof = async () => 'keys trigger shape+sound (idle state like ref)';
};
V['animal-percussion-pad'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', ac: '#111', dark: false });
  let L = false, R = false; const cat = s('svg', { viewBox: '0 0 400 300', width: 520, style: 'position:absolute;left:50%;top:44%;transform:translate(-40%,-50%)' });
  const draw = () => cat.replaceChildren(s('path', { d: 'M110 170 Q100 40 160 60 L190 90 Q230 80 270 90 L300 55 Q360 40 340 170', fill: '#fff', stroke: '#111', 'stroke-width': 4 }), s('circle', { cx: 200, cy: 125, r: 4 }), s('circle', { cx: 262, cy: 125, r: 4 }), s('path', { d: 'M222 135 q8 8 16 0 q8 8 16 0', fill: 'none', stroke: '#111', 'stroke-width': 3 }), s('ellipse', { cx: 150, cy: 225, rx: 58, ry: 26, fill: '#d9b98c', stroke: '#5a3b1c', 'stroke-width': 4 }), s('rect', { x: 92, y: 225, width: 116, height: 70, fill: '#c89662', stroke: '#5a3b1c', 'stroke-width': 4 }), s('ellipse', { cx: 265, cy: 240, rx: 46, ry: 22, fill: '#d9b98c', stroke: '#5a3b1c', 'stroke-width': 4 }), s('rect', { x: 219, y: 240, width: 92, height: 60, fill: '#c89662', stroke: '#5a3b1c', 'stroke-width': 4 }), s('path', { d: L ? 'M130 170 q-10 40 20 55' : 'M130 170 q-30 -10 -40 -40', fill: 'none', stroke: '#111', 'stroke-width': 18, 'stroke-linecap': 'round' }), s('path', { d: R ? 'M300 170 q10 40 -30 65' : 'M300 170 q30 -10 40 -40', fill: 'none', stroke: '#111', 'stroke-width': 18, 'stroke-linecap': 'round' }));
  const hit = (side) => { if (side === 'L') { L = true; drum('kick'); } else { R = true; blip(220, 0.12, 'triangle', 0.3); drum('snare'); } draw(); setTimeout(() => { L = R = false; draw(); }, 110); };
  window.addEventListener('keydown', (e) => { const k = e.key.toLowerCase(); if (k === 'a') hit('L'); else if (k === 'd') hit('R'); else if (/^[0-9]$/.test(k)) { blip(midi(60 + +k * 2), 0.3, 'square', 0.08); R = true; draw(); setTimeout(() => { R = false; draw(); }, 110); } });
  root.addEventListener('pointerdown', (e) => hit(e.clientX < innerWidth / 2 ? 'L' : 'R'));
  const key = (k, l) => h('div', { style: { textAlign: 'center', fontSize: '10px' } }, l, h('div.k-row', { style: { gap: '2px', justifyContent: 'center' } }, ...k.map((x) => h('span', { style: { border: '1px solid #111', padding: '2px 6px', fontSize: '11px' } }, x))));
  root.append(h('div', { style: { position: 'absolute', top: '44%', left: 0, right: 0, height: '3px', background: '#111', transform: 'rotate(8deg)' } }), cat, h('div.k-row', { style: { position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', gap: '14px' } }, key(['A', 'D'], 'Bongo'), key(['C'], 'Cymbal'), key(['0-9'], 'Marimba'), key(['Q', 'W', 'E'], 'Tambourine'), select(['Bongo', 'Keyboard', 'Meow'], 'Bongo', () => {}), key(['Space'], 'Meow')), h('div', { style: { position: 'absolute', right: '10px', bottom: '40px', width: '240px', background: '#111', color: '#fff', padding: '10px', fontSize: '11px' } }, 'This website uses cookies to analyze traffic.', h('button', { style: { display: 'block', width: '100%', marginTop: '8px', background: '#d9b98c', border: 0, padding: '4px' }, onclick: (e) => e.target.parentNode.remove() }, 'Got it!')));
  draw();
  window.__demoProof = async () => { L = true; draw(); return 'A key → left paw hits bongo'; };
};
V['beatbox-avatar-mix-stage'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', ac: '#e53935', dark: false });
  const VERS = ['Alpha', 'Little Miss', 'Sunrise', 'The Love', 'Brazil', 'Alive', 'Jeevan', 'Dystopia', 'Wekiddy', 'Asia'];
  const face = (i, c) => s('svg', { viewBox: '0 0 60 60', width: 70 }, s('rect', { width: 60, height: 60, rx: 10, fill: c }), s('circle', { cx: 30, cy: 26, r: 14, fill: '#f1c9a5' }), s('rect', { x: 14, y: 12, width: 32, height: 8, fill: '#333' }), s('circle', { cx: 25, cy: 27, r: 2 }), s('circle', { cx: 35, cy: 27, r: 2 }), s('rect', { x: 18, y: 42, width: 24, height: 18, fill: '#555' }));
  const stage = h('div', { style: { display: 'none', position: 'absolute', inset: '40px 0 0 0', background: 'linear-gradient(#f5f5f5,#ddd)' } }); let loops = new Set(), step = 0;
  setInterval(() => { if (!loops.size) return; step++; loops.forEach((k) => { if (k === 'beat' && step % 2 === 0) drum(step % 4 ? 'snare' : 'kick'); if (k === 'hat') drum('hat'); if (k === 'bass' && step % 4 === 0) blip(midi(36 + [0, 0, 3, 5][(step / 4) % 4 | 0]), 0.3, 'sawtooth', 0.1); if (k === 'melody' && step % 2 === 0) blip(midi(72 + [0, 3, 7, 10, 7, 3][(step / 2) % 6 | 0]), 0.2, 'triangle', 0.06); if (k === 'voice' && step % 8 === 0) blip(midi(60), 0.6, 'sine', 0.08); }); stage.querySelectorAll('.bb').forEach((el) => (el.style.transform = el.dataset.k && step % 2 ? 'translateY(-4px)' : '')); }, 140);
  const openStage = (v) => { stage.style.display = 'block'; stage.replaceChildren(h('div', { style: { textAlign: 'center', padding: '10px', fontWeight: 700 } }, 'Incredibox-ish · ' + v + ' — drag an icon onto a character'), h('div.k-row', { style: { justifyContent: 'center', gap: '30px', marginTop: '60px' } }, ...Array.from({ length: 5 }, (_, i) => { const el = h('div.bb', { style: { width: '100px', height: '240px', background: '#888', borderRadius: '50px 50px 10px 10px', display: 'grid', placeItems: 'start center', transition: 'transform .1s' }, ondragover: (e) => e.preventDefault(), ondrop: (e) => { const k = e.dataTransfer.getData('text'); el.dataset.k = k; el.style.background = { beat: '#e53935', hat: '#fb8c00', bass: '#8e24aa', melody: '#1e88e5', voice: '#43a047' }[k]; loops.add(k); } }, h('div', { style: { width: '70px', height: '70px', borderRadius: '50%', background: '#f1c9a5', marginTop: '14px' } })); return el; })), h('div.k-row', { style: { justifyContent: 'center', gap: '10px', position: 'absolute', bottom: '30px', left: 0, right: 0 } }, ...[['beat', '#e53935'], ['hat', '#fb8c00'], ['bass', '#8e24aa'], ['melody', '#1e88e5'], ['voice', '#43a047']].map(([k, c]) => h('div', { draggable: true, ondragstart: (e) => e.dataTransfer.setData('text', k), style: { width: '56px', height: '56px', borderRadius: '10px', background: c, color: '#fff', display: 'grid', placeItems: 'center', fontSize: '11px', cursor: 'grab' } }, k)), btn('Reset', () => { loops.clear(); openStage(v); }))); };
  root.append(h('div.k-row', { style: { height: '40px', background: '#111', color: '#fff', padding: '0 20px', gap: '20px', fontSize: '12px' } }, h('b', { style: { letterSpacing: '.2em' } }, 'INCREDIBOX-ish'), h('span', { style: { color: '#e53935' } }, 'DEMO'), 'SHOP', 'ALBUM', 'CONTACT', h('span', { style: { flex: 1 } }), 'f  ✕  ▶  ◎'), h('div', { style: { textAlign: 'center', marginTop: '70px', fontSize: '11px', letterSpacing: '.2em', opacity: .6 } }, 'SELECT A VERSION TO START MIXING MUSIC'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5,90px)', gap: '14px 10px', justifyContent: 'center', marginTop: '20px' } }, ...VERS.map((v, i) => h('div', { style: { textAlign: 'center', fontSize: '11px', cursor: 'pointer' }, onclick: () => openStage(v) }, face(i, ['#9e9e9e', '#bcaaa4', '#ef9a9a', '#b0bec5', '#a5d6a7', '#ffcc80', '#ce93d8', '#90a4ae', '#80deea', '#e53935'][i]), h('div', {}, v)))), stage);
  window.__demoProof = async () => 'version picker; click opens drag-to-mix stage';
};
V['rhythm-tap-performance-stage'] = (root, T) => {
  theme(root, T, { bg: '#0d2a33', fg: '#cfe', ac: '#dfff5a', dark: true });
  const MEL = [64, 62, 60, 62, 64, 64, 64, 62, 62, 62, 64, 67, 67, 64, 62, 60, 62, 64, 64, 64, 64, 62, 62, 64, 62, 60]; let mi = 0; const cv = h('canvas', { style: { position: 'absolute', inset: 0 } }); root.append(cv); const dots = []; const R = rng(2); for (let i = 0; i < 40; i++) dots.push({ x: R(), y: 0.3 + R() * 0.35, r: 3 + R() * 5, lit: R() < 0.5, ph: R() * 6 });
  const tap = () => { const n = MEL[mi++ % MEL.length]; blip(midi(n), 0.9, 'triangle', 0.18); blip(midi(n - 12), 0.9, 'sine', 0.08); dots.push({ x: 0.1 + (mi % 20) / 22, y: 0.62 - (n - 58) / 40, r: 7, lit: true, ph: 0, born: 1 }); };
  window.addEventListener('keydown', (e) => { if (!e.repeat && e.key.length === 1) tap(); }); cv.addEventListener('pointerdown', tap);
  const loop = () => { fitCanvas(cv, root); const g = cv.g, W = cv.W, H = cv.H; const gr = g.createRadialGradient(W / 2, H * 0.6, 0, W / 2, H * 0.6, W * 0.7); gr.addColorStop(0, '#1d5561'); gr.addColorStop(1, '#071a20'); g.fillStyle = gr; g.fillRect(0, 0, W, H); const t = performance.now() / 1000; dots.forEach((d) => { d.x += 0.0004; if (d.x > 1.05) d.x = -0.05; if (d.born) d.born *= 0.97; g.fillStyle = d.lit ? `rgba(223,255,90,${0.7 + 0.3 * Math.sin(t + d.ph)})` : 'rgba(60,160,190,.6)'; g.shadowColor = d.lit ? '#dfff5a' : '#3ab'; g.shadowBlur = 16; g.beginPath(); g.arc(d.x * W, d.y * H + Math.sin(t + d.ph) * 6, d.r * (1 + (d.born || 0) * 2), 0, 7); g.fill(); }); g.shadowBlur = 0; requestAnimationFrame(loop); };
  root.append(h('div', { style: { position: 'absolute', right: '30px', bottom: '90px', textAlign: 'right', fontSize: '11px', lineHeight: 1.8, opacity: .8 } }, 'Moonlight Sonata', h('br'), 'Clair de Lune', h('br'), 'Gymnopédie No.1', h('br'), h('b', {}, 'Tap any key rhythmically ▾')), h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '44px', background: '#0009', padding: '0 14px', fontSize: '11px', gap: '14px' } }, h('span', { style: { background: '#1e88e5', padding: '2px 6px' } }, 'f Like'), 'Touch Pianist-ish', h('span', { style: { flex: 1, textAlign: 'center' } }, 'Chopin — Nocturne Op. 9 No. 2'), h('span', { style: { background: '#000', padding: '4px 10px', border: '1px solid #555' } }, 'Google Play'), h('span', { style: { background: '#000', padding: '4px 10px', border: '1px solid #555' } }, 'App Store')));
  loop();
  window.__demoProof = async () => { for (let i = 0; i < 6; i++) tap(); return 'tapped 6 notes → melody advances with glow dots'; };
};
V['drawing-garden-sound-canvas'] = (root, T) => {
  theme(root, T, { bg: '#b0741f', fg: '#fff', ac: '#fff', dark: true });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0, cursor: 'crosshair', touchAction: 'none' } }); root.append(cv); const plants = []; let stroke = null; const SC = [0, 2, 4, 7, 9];
  drag(cv, { start: (e) => { stroke = [localPos(e, cv)]; }, move: (e) => { const p = localPos(e, cv); stroke.push(p); if (stroke.length % 6 === 0) blip(midi(60 + SC[Math.floor((1 - p.y / cv.H) * 10) % 5] + 12 * Math.floor((1 - p.y / cv.H) * 2)), 0.2, 'sine', 0.06); }, end: () => { if (stroke?.length > 2) plants.push({ pts: stroke, t: 0, kind: plants.length % 3 }); stroke = null; } });
  const loop = () => { fitCanvas(cv, root); const g = cv.g, W = cv.W, H = cv.H; g.fillStyle = '#b0741f'; g.fillRect(0, 0, W, H); g.fillStyle = '#8e5a14'; g.font = '11px monospace'; for (let y = 10; y < H; y += 16) g.fillText('ᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥᵥ'.repeat(3), (y % 32) ? 0 : 6, y); const drawP = (pl, grow) => { g.strokeStyle = ['#3f7d20', '#2f5d14', '#6a9d2a'][pl.kind]; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); const n = Math.floor(pl.pts.length * grow); pl.pts.slice(0, n).forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.stroke(); pl.pts.slice(0, n).forEach((p, i) => { if (i % 8 === 4) { g.fillStyle = ['#f7c6d9', '#fff3a0', '#b9e3ff'][pl.kind]; g.beginPath(); g.arc(p.x + 6, p.y, 5, 0, 7); g.fill(); } }); }; plants.forEach((pl) => { pl.t = Math.min(1, pl.t + 0.02); drawP(pl, pl.t); }); if (stroke) drawP({ pts: stroke, kind: 0 }, 1); requestAnimationFrame(loop); };
  root.append(h('div.k-row', { style: { position: 'absolute', top: '10px', right: '14px', fontSize: '12px', gap: '10px' } }, h('b', {}, 'drawing.garden-ish'), '✎ draw to plant · each stroke sings', btn('clear', () => (plants.length = 0))));
  loop();
  window.__demoProof = async () => { plants.push({ pts: Array.from({ length: 40 }, (_, i) => ({ x: 300 + i * 6, y: 600 - i * 8 + Math.sin(i / 3) * 20 })), t: 1, kind: 0 }); return 'drew a singing plant stroke'; };
};
V['ambient-mixer-deck'] = (root, T) => {
  theme(root, T, { bg: '#1f2426', fg: '#fff', ac: '#fff', dark: true });
  const bg = scene(720, 450, 'land', 11); bg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(3px) brightness(.35) saturate(.6)'; root.append(bg);
  const SND = [['Rain', '🌧', 'white', 800], ['Thunder', '⛈', 'brown', 120], ['Waves', '🌊', 'brown', 500], ['Wind', '🌬', 'white', 400], ['Fire', '🔥', 'brown', 900], ['Birds', '🐦', 'tone', 2400], ['Crickets', '🦗', 'tone', 4200], ['Coffee Shop', '☕', 'brown', 1500], ['Singing Bowl', '🔔', 'tone', 220], ['White Noise', '📺', 'white', 8000]]; const nodes = {}; let playing = false;
  const set = (i, v) => { const ac = audio(); if (!ac) return; let n = nodes[i]; if (!n) { const [, , kind, f] = SND[i]; const gain = ac.createGain(); gain.gain.value = 0; let src; if (kind === 'tone') { src = ac.createOscillator(); src.frequency.value = f; const lfo = ac.createOscillator(); lfo.frequency.value = 6; const lg = ac.createGain(); lg.gain.value = f * 0.02; lfo.connect(lg).connect(src.frequency); lfo.start(); } else src = noiseSrc(kind); const flt = ac.createBiquadFilter(); flt.type = 'lowpass'; flt.frequency.value = f; src.connect(flt).connect(gain).connect(ac.destination); src.start(); n = nodes[i] = { gain }; } n.gain.gain.value = playing ? v * (SND[i][2] === 'tone' ? 0.03 : 0.25) : 0; n.v = v; };
  const vols = SND.map((_, i) => (i === 0 || i === 3 ? 0.5 : 0));
  const pb = h('div', { style: { fontSize: '64px', cursor: 'pointer', margin: '10px 0' }, onclick: () => { playing = !playing; pb.textContent = playing ? '❚❚' : '▶'; vols.forEach((v, i) => set(i, v)); } }, '▶');
  root.append(h('div.k-row', { style: { position: 'absolute', top: '10px', right: '20px', gap: '20px', fontSize: '12px' } }, 'Blog', 'Get Combos', 'Account', 'Login'), h('div', { style: { position: 'relative', textAlign: 'center', paddingTop: '40px' } }, h('div', { style: { font: "300 44px 'Inter Variable'", letterSpacing: '.12em' } }, 'A SOFT MURMUR-ish'), h('div', { style: { fontSize: '13px', opacity: .7 } }, 'Ambient sounds to wash away distraction'), h('div.k-row', { style: { justifyContent: 'center', gap: '60px' } }, h('span', { style: { fontSize: '26px', opacity: .6 } }, '◎'), pb, h('span', { style: { fontSize: '26px', opacity: .6 } }, '⚙')), h('div.k-row', { style: { justifyContent: 'center', gap: '12px', fontSize: '11px' } }, ...['TIMER', 'MIXES', 'AUDIO'].map((t) => h('span', { style: { border: '1px solid #fff8', padding: '4px 14px' } }, t))), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5,150px)', gap: '26px 40px', justifyContent: 'center', marginTop: '40px' } }, ...SND.map(([n, ic], i) => h('div', { style: { textAlign: 'center' } }, h('div', { style: { fontSize: '40px', filter: 'grayscale(1) brightness(2)' } }, ic), h('div', { style: { fontSize: '12px', margin: '4px 0' } }, n), (() => { const sl = h('input', { type: 'range', min: 0, max: 1, step: 0.01, value: vols[i], style: { width: '120px', accentColor: '#fff' }, oninput: (e) => { vols[i] = +e.target.value; set(i, vols[i]); } }); return sl; })())))));
  window.__demoProof = async () => 'mixer ready with rain+wind preset (press ▶)';
};
V['circle-of-fifths-instrument'] = (root, T) => {
  theme(root, T, { bg: '#1e1f22', fg: '#ddd', ac: '#fff', dark: true });
  const NOTES = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F']; const PC = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; let on = new Set();
  const svg = s('svg', { viewBox: '-260 -260 520 520', width: 640, height: 640 }); const col = (pc) => `hsl(${(pc * 30 + 0) % 360} 80% 55%)`;
  const draw = () => { const els = [s('defs', {}, s('filter', { id: 'bl' }, s('feGaussianBlur', { stdDeviation: 14 })))]; NOTES.forEach((n, i) => { const a0 = ((i - 0.5) / 12) * 6.283 - 1.57, a1 = ((i + 0.5) / 12) * 6.283 - 1.57; const arc = (r0, r1) => `M${Math.cos(a0) * r0} ${Math.sin(a0) * r0}A${r0} ${r0} 0 0 1 ${Math.cos(a1) * r0} ${Math.sin(a1) * r0}L${Math.cos(a1) * r1} ${Math.sin(a1) * r1}A${r1} ${r1} 0 0 0 ${Math.cos(a0) * r1} ${Math.sin(a0) * r1}Z`; const lit = on.has(i); els.push(s('path', { d: arc(240, 150), fill: col(PC[i]), opacity: lit ? 1 : 0.55, filter: 'url(#bl)', style: 'cursor:pointer', onclick: () => chord(i) }), s('path', { d: arc(148, 90), fill: col(PC[(i + 3) % 12]), opacity: lit ? 0.9 : 0.35, filter: 'url(#bl)', style: 'cursor:pointer', onclick: () => chord(i, true) }), s('text', { x: Math.cos((i / 12) * 6.283 - 1.57) * 195, y: Math.sin((i / 12) * 6.283 - 1.57) * 195 + 6, 'text-anchor': 'middle', fill: '#fff', 'font-size': 18, 'font-weight': 700, 'pointer-events': 'none' }, n), s('text', { x: Math.cos((i / 12) * 6.283 - 1.57) * 120, y: Math.sin((i / 12) * 6.283 - 1.57) * 120 + 5, 'text-anchor': 'middle', fill: '#fff', 'font-size': 12, 'pointer-events': 'none', opacity: .8 }, NOTES[(i + 3) % 12].toLowerCase() + 'm')); }); els.push(s('circle', { r: 60, fill: '#1e1f22' }), s('text', { y: 6, 'text-anchor': 'middle', fill: '#fff', 'font-size': 14 }, on.size ? NOTES[[...on][0]] : '·')); svg.replaceChildren(...els); };
  const chord = (i, minor) => { const root = 48 + PC[i]; [0, minor ? 3 : 4, 7, 12].forEach((iv, k) => blip(midi(root + iv), 1.2, 'triangle', 0.08, k * 0.02)); on = new Set([i]); draw(); setTimeout(() => { on.clear(); draw(); }, 700); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '46px 380px 1fr';
  root.append(h('div', { style: { background: '#16171a', display: 'grid', alignContent: 'start', gap: '18px', paddingTop: '14px', justifyItems: 'center', fontSize: '16px' } }, '◉', '⌂', '♪', '◎', '⚙'), h('div', { style: { padding: '20px', overflow: 'auto', fontSize: '13px', lineHeight: 1.6 } }, h('div', { style: { opacity: .6, fontSize: '11px' } }, 'Chromatone-ish'), h('div', { style: { fontSize: '30px', margin: '6px 0' } }, 'Circle of Fifths'), h('div', { style: { fontSize: '15px', opacity: .8 } }, 'Interactive circle of fifths as composition tool and performance instrument. A tool to explore chords in tonal space'), h('button', { style: { width: '100%', margin: '14px 0', padding: '8px', background: '#fff', color: '#111', border: 0, borderRadius: '4px' }, onclick: () => chord(0) }, 'START'), h('p', { style: { opacity: .7 } }, 'The Circle of Fifths is a sequence of all 12 pitch classes, arranged so each adjacent note is a perfect fifth apart. Outer ring: major chords. Inner ring: relative minors.'), h('p', { style: { opacity: .7 } }, 'Click any segment to play its chord. Neighbours share the most notes — try walking around the circle.')), h('div', { style: { display: 'grid', placeItems: 'center' } }, svg));
  draw();
  window.__demoProof = async () => 'colour circle of fifths; segments play chords';
};
V['ear-training-melody-ritual'] = (root, T) => {
  theme(root, T, { bg: '#c9a5a5', fg: '#3b2a2a', ac: '#9b3d3d', dark: false });
  let target = [], streak = 0; const res = h('div', { style: { minHeight: '24px', fontWeight: 700 } });
  const newQ = () => { const base = 60; target = [0, pick([2, 3, 4, 5, 7]), pick([7, 9, 12])].map((x) => base + x); play(); };
  const play = () => target.forEach((n, i) => blip(midi(n), 0.4, 'triangle', 0.15, i * 0.45));
  const guess = (iv) => { const ok = target[1] - target[0] === iv; streak = ok ? streak + 1 : 0; res.textContent = ok ? `✓ Correct — streak ${streak}` : `✗ It was ${target[1] - target[0]} semitones`; res.style.color = ok ? '#2e7d32' : '#9b3d3d'; };
  const modal = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '380px', maxHeight: '80%', overflow: 'auto', background: '#fbf3ea', borderRadius: '10px', padding: '18px', boxShadow: '0 10px 40px #0004', fontSize: '12px', lineHeight: 1.6 } }, h('div.k-row', {}, h('b', { style: { fontSize: '14px' } }, "What's New"), h('span', { style: { flex: 1 } }), h('span', { style: { cursor: 'pointer' }, onclick: () => modal.remove() }, '✕')), h('div', { style: { background: '#fff', padding: '8px', borderRadius: '6px', margin: '8px 0' } }, '🎧 There are now 12 updates since your last visit.'), ...[['June 12, 2026', 'New', 'Interval drills now include compound intervals.'], ['May 30, 2026', 'Fix', 'Tempo control is remembered between sessions.'], ['January 12, 2026', 'New', 'Daily ritual: 5 questions a day with streak tracking.']].map(([d, t, x]) => h('div', { style: { borderTop: '1px solid #e5d5c5', padding: '8px 0' } }, h('b', {}, '● ' + d), h('div', {}, h('span', { style: { background: t === 'New' ? '#c8e6c9' : '#ffe0b2', padding: '0 6px', borderRadius: '4px', fontSize: '10px' } }, t), ' ' + x))));
  root.append(h('div', { style: { textAlign: 'center', paddingTop: '30px' } }, h('div', { style: { font: "700 44px 'Fraunces Variable'", color: '#9b3d3d' } }, 'Lend Me Your Ears-ish'), h('div', { style: { opacity: .7 } }, 'a daily ear-training ritual'), h('div', { style: { margin: '40px auto', width: '520px', background: '#f3e5e0', borderRadius: '12px', padding: '24px', display: 'grid', gap: '14px' } }, h('b', {}, 'Which interval did you hear between note 1 and 2?'), h('div.k-row', { style: { justifyContent: 'center' } }, btn('▶ Play', play, 'pri'), btn('New question', newQ)), h('div.k-row', { style: { justifyContent: 'center', flexWrap: 'wrap' } }, ...[[2, 'M2'], [3, 'm3'], [4, 'M3'], [5, 'P4'], [7, 'P5']].map(([iv, l]) => btn(l, () => guess(iv)))), res)), modal);
  target = [60, 64, 67];
  window.__demoProof = async () => { guess(4); return 'answered interval → feedback + streak ("What’s New" modal)'; };
};
V['synth-visualizer-control-deck'] = (root, T) => {
  theme(root, T, { bg: '#0a0a0a', fg: '#9f9', ac: '#aaff00', acfg: '#000', dark: true });
  const P = { wave: 'sawtooth', attack: 0.02, release: 0.6, cutoff: 3000, detune: 8 }; const cv = h('canvas', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: '62%' } }); root.append(cv); const falling = [];
  const note = (n) => { const ac = audio(); if (!ac) return; const t = ac.currentTime; const g = ac.createGain(); const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = P.cutoff; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + P.attack); g.gain.exponentialRampToValueAtTime(0.0001, t + P.attack + P.release); [-1, 1].forEach((d) => { const o = ac.createOscillator(); o.type = P.wave; o.frequency.value = midi(n); o.detune.value = d * P.detune; o.connect(f); o.start(t); o.stop(t + P.attack + P.release + 0.1); }); f.connect(g).connect(ac.destination); falling.push({ n, y: 0 }); keys[n]?.animate([{ background: '#aaff00' }, { background: keys[n].dataset.bg }], 300); };
  const kb = h('div', { style: { position: 'absolute', left: '50%', top: '62%', transform: 'translateX(-50%)', display: 'flex', height: '90px', position: 'absolute' } }); const keys = {}; const KMAP = 'awsedftgyhujkolp;'; for (let n = 60; n < 77; n++) { const black = [1, 3, 6, 8, 10].includes(n % 12); const k = h('div', { style: { width: black ? '20px' : '32px', height: black ? '56px' : '90px', background: black ? '#111' : '#eee', margin: black ? '0 -10px' : '0 1px', zIndex: black ? 2 : 1, border: '1px solid #333', cursor: 'pointer' }, onpointerdown: () => note(n) }); k.dataset.bg = black ? '#111' : '#eee'; keys[n] = k; kb.append(k); }
  window.addEventListener('keydown', (e) => { const i = KMAP.indexOf(e.key); if (i >= 0 && !e.repeat) note(60 + i); });
  const loop = () => { fitCanvas(cv, root); const g = cv.g; g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, cv.W, cv.H); const kr = kb.getBoundingClientRect(), rr = root.getBoundingClientRect(); falling.forEach((f) => { f.y += 3; const kk = keys[f.n].getBoundingClientRect(); g.fillStyle = `rgba(170,255,0,${1 - f.y / cv.H})`; g.fillRect(kk.left - rr.left, cv.H - f.y, kk.width, 14); }); while (falling.length && falling[0].y > cv.H) falling.shift(); requestAnimationFrame(loop); };
  const knob = (l, k, mn, mx) => { let v = P[k]; const el = h('div', { style: { width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #aaff00', borderRightColor: '#333', transform: `rotate(${((v - mn) / (mx - mn)) * 270 - 135}deg)`, cursor: 'ns-resize' } }); let y0, v0; drag(el, { start: (e) => { y0 = e.clientY; v0 = P[k]; }, move: (e) => { P[k] = clamp(v0 + ((y0 - e.clientY) / 120) * (mx - mn), mn, mx); el.style.transform = `rotate(${((P[k] - mn) / (mx - mn)) * 270 - 135}deg)`; } }); return h('div', { style: { display: 'grid', justifyItems: 'center', gap: '4px', fontSize: '10px' } }, el, l); };
  root.append(kb, h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, bottom: '30px', justifyContent: 'center', gap: '26px', padding: '10px', borderTop: '1px solid #222' } }, seg(['sine', 'square', 'sawtooth', 'triangle'], P.wave, (v) => (P.wave = v)), knob('ATTACK', 'attack', 0.005, 1), knob('RELEASE', 'release', 0.05, 3), knob('CUTOFF', 'cutoff', 200, 8000), knob('DETUNE', 'detune', 0, 40), h('span', { style: { background: '#aaff00', color: '#000', padding: '4px 10px', fontSize: '11px' } }, 'REC')), h('div', { style: { position: 'absolute', left: '10px', bottom: '8px', fontSize: '10px', opacity: .5 } }, 'SYNTHVIZ-ish · keys A–; play notes'));
  loop();
  window.__demoProof = async () => { [60, 64, 67].forEach(note); await sleep(200); return 'played C major; notes rise from keys'; };
};
V['engine-sound-instrument-cluster'] = (root, T) => {
  theme(root, T, { bg: '#0d0f12', fg: '#ddd', ac: '#2962ff', dark: true });
  const CARS = [['Mustang GT', 5.0, 'V8', 450, 7500], ['911 GT3', 4.0, 'F6', 502, 9000], ['M3 CSL', 3.0, 'I6', 543, 7200], ['NSX', 3.5, 'V6', 573, 7500], ['Charger', 6.4, 'V8', 485, 6400], ['Supra', 3.0, 'I6', 382, 7000], ['F40', 2.9, 'V8', 471, 7750], ['Miata', 2.0, 'I4', 181, 7500]]; let car = 0, rpm = 900, thr = 0, eng = null;
  const start = () => { const ac = audio(); if (!ac || eng) return; const o = ac.createOscillator(); o.type = 'sawtooth'; const o2 = ac.createOscillator(); o2.type = 'square'; const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600; const g = ac.createGain(); g.gain.value = 0.08; o.connect(f); o2.connect(f); f.connect(g).connect(ac.destination); o.start(); o2.start(); eng = { o, o2, f }; };
  const title = h('div', { style: { font: "900 110px/0.9 'Inter Variable'", letterSpacing: '-.02em', fontVariationSettings: '"wdth" 60' } }); const stats = h('div', { style: { display: 'grid', gap: '10px' } }); const tach = h('div', { style: { font: `700 40px ${MONO}`, color: '#2962ff' } });
  const drawCar = () => { const c = CARS[car]; title.innerHTML = c[0].toUpperCase().replace(' ', '<br>'); stats.replaceChildren(...[['DISPLACEMENT', c[1] + ' L'], ['LAYOUT', c[2]], ['POWER', c[3] + ' hp'], ['REDLINE', c[4]]].map(([k, v]) => h('div', { style: { borderRight: '3px solid #2962ff', paddingRight: '10px', textAlign: 'right' } }, h('div', { style: { fontSize: '26px', fontWeight: 800 } }, v), h('div', { style: { fontSize: '10px', opacity: .6, letterSpacing: '.2em' } }, k)))); };
  const loop = () => { const red = CARS[car][4]; rpm += ((thr ? red * 0.95 : 900) - rpm) * (thr ? 0.04 : 0.02); tach.textContent = `${Math.round(rpm)} RPM`; if (eng) { const cyl = { V8: 4, F6: 3, I6: 3, V6: 3, I4: 2 }[CARS[car][2]]; eng.o.frequency.value = (rpm / 60) * cyl; eng.o2.frequency.value = (rpm / 60) * cyl * 0.5; eng.f.frequency.value = 300 + rpm / 6; } requestAnimationFrame(loop); };
  window.addEventListener('keydown', (e) => e.code === 'Space' && (e.preventDefault(), start(), (thr = 1))); window.addEventListener('keyup', (e) => e.code === 'Space' && (thr = 0));
  root.style.display = 'grid'; root.style.gridTemplateColumns = '210px 1fr 240px'; root.style.gridTemplateRows = '44px 1fr';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', padding: '0 14px', borderBottom: '1px solid #222', gap: '14px' } }, h('b', {}, 'ROAR-ish'), h('span', { style: { flex: 1 } }), h('input', { placeholder: '⌕ Search engines', style: { background: '#16181c', border: '1px solid #333', color: '#ddd', padding: '4px 8px' } })), h('div', { style: { borderRight: '1px solid #222', padding: '10px', display: 'grid', gap: '4px', alignContent: 'start', fontSize: '12px' } }, h('div', { style: { opacity: .5, fontSize: '10px' } }, 'ALL ENGINES'), ...CARS.map((c, i) => h('div', { style: { padding: '6px 8px', background: i === car ? '#2962ff33' : '', cursor: 'pointer', borderRadius: '4px' }, onclick: (e) => { car = i; drawCar(); root.querySelectorAll('[data-car]').forEach(() => {}); } }, '▣ ' + c[0]))), h('div', { style: { padding: '30px 40px', display: 'grid', alignContent: 'start', gap: '14px' } }, h('div', { style: { fontSize: '11px', letterSpacing: '.3em', opacity: .6 } }, 'FORD · MUSCLE · NA'), title, h('p', { style: { opacity: .6, fontSize: '13px', maxWidth: '360px' } }, 'The roar of the American V8, synthesized in real time from cylinder count and RPM.'), tach, h('button', { style: { width: '300px', background: '#2962ff', color: '#fff', border: 0, padding: '14px', fontWeight: 700, letterSpacing: '.15em' }, onpointerdown: () => { start(); thr = 1; }, onpointerup: () => (thr = 0), onpointerleave: () => (thr = 0) }, 'HOLD TO REV (or Space) →')), h('div', { style: { padding: '30px 20px' } }, stats));
  drawCar(); loop();
  window.__demoProof = async () => { rpm = 5200; return 'engine rev: RPM tach + synth tied to throttle'; };
};
V['3d-ambient-sound-garden'] = (root, T) => {
  theme(root, T, { bg: '#8fb3d9', fg: '#fff', ac: '#fff', dark: true });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0 } }); root.append(cv); const R = rng(4); const plants = Array.from({ length: 30 }, () => ({ x: R() * 2 - 1, z: R() * 1 + 0.1, h: 0.3 + R(), n: pick([60, 62, 64, 67, 69, 72]) })); let cam = 0, walking = 0;
  window.addEventListener('keydown', (e) => { if (e.key === 'w' || e.key === 'ArrowUp') walking = 1; if (e.key === 's' || e.key === 'ArrowDown') walking = -1; }); window.addEventListener('keyup', () => (walking = 0));
  const loop = () => { fitCanvas(cv, root); const g = cv.g, W = cv.W, H = cv.H; cam += walking * 0.01; const sky = g.createLinearGradient(0, 0, 0, H * 0.55); sky.addColorStop(0, '#6a8fc8'); sky.addColorStop(0.7, '#f3b58a'); sky.addColorStop(1, '#f7d59a'); g.fillStyle = sky; g.fillRect(0, 0, W, H); g.fillStyle = '#9ab86a'; g.fillRect(0, H * 0.55, W, H); for (let i = 0; i < 40; i++) { const y = H * 0.55 + (i / 40) ** 2 * H * 0.45; g.fillStyle = i % 2 ? '#a9c46f' : '#94b25f'; g.fillRect(0, y, W, 6); } g.fillStyle = '#d8d0b8'; g.beginPath(); g.moveTo(W / 2 - 6, H * 0.55); g.lineTo(W / 2 + 6, H * 0.55); g.lineTo(W / 2 + 160, H); g.lineTo(W / 2 - 160, H); g.fill(); plants.map((p) => ({ ...p, zz: ((p.z - cam) % 1 + 1) % 1 + 0.05 })).sort((a, b) => b.zz - a.zz).forEach((p) => { const sc = 1 / p.zz; const x = W / 2 + p.x * W * 0.5 * sc * 0.3, y = H * 0.55 + H * 0.06 * sc; const hh = p.h * 60 * sc; g.strokeStyle = '#3f7a2a'; g.lineWidth = Math.max(1, 3 * sc * 0.3); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 10, y - hh / 2, x, y - hh); g.stroke(); g.fillStyle = '#4f9a34'; for (let k = 1; k < 5; k++) { g.beginPath(); g.ellipse(x + (k % 2 ? 8 : -8) * sc * 0.3, y - (hh * k) / 5, 6 * sc * 0.3, 3 * sc * 0.3, k % 2 ? 0.5 : -0.5, 0, 7); g.fill(); } if (p.zz < 0.12 && Math.random() < 0.02) blip(midi(p.n), 1.5, 'sine', 0.04); }); requestAnimationFrame(loop); };
  const dlg = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '440px', background: '#3a2e2acc', border: '1px solid #fff6', padding: '20px 26px', fontSize: '13px', lineHeight: 1.8, backdropFilter: 'blur(4px)' } }, h('div', { style: { fontSize: '15px', marginBottom: '10px' } }, 'ambient.garden-ish: an algorithmic audio landscape'), h('b', {}, 'Navigation'), h('ul', { style: { margin: '4px 0' } }, h('li', {}, 'W / ↑ to walk forward'), h('li', {}, 'S / ↓ to walk back'), h('li', {}, 'Plants sing as you pass them')), h('div', { style: { textAlign: 'center', marginTop: '10px' } }, h('button', { style: { background: '#8b3a2a', color: '#fff', border: '1px solid #fff8', padding: '4px 14px' }, onclick: () => { dlg.remove(); audio(); } }, 'Start')));
  root.append(dlg, h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '26px', background: '#0006', padding: '0 10px', fontSize: '11px', gap: '12px' } }, '⚙', '🔊 volume', h('span', { style: { flex: 1 } }), 'Ambient Garden-ish'));
  loop();
  window.__demoProof = async () => 'walkable singing landscape (intro dialog)';
};
V['typedrummer-ascii-drum-desk'] = (root, T) => {
  theme(root, T, { bg: '#f8dfb4', fg: '#e8a24a', ac: '#e8a24a', dark: false });
  const out = h('div', { style: { minHeight: '100px', font: `28px/1.4 ${MONO}`, color: '#c2771f', wordBreak: 'break-all' } }, h('span', { style: { opacity: .5 } }, 'type something!')); let txt = '', idx = 0, tmr = null;
  const snd = (c) => { if (c === ' ') return; const k = c.charCodeAt(0) % 6; [() => drum('kick'), () => drum('snare'), () => drum('hat'), () => blip(midi(48 + (c.charCodeAt(0) % 12)), 0.2, 'square', 0.06), () => drum('hat'), () => blip(midi(36), 0.25, 'sine', 0.3)][k](); };
  const draw = () => out.replaceChildren(...(txt ? [...txt].map((c, i) => h('span', { style: { color: i === idx ? '#fff' : '', background: i === idx ? '#e8a24a' : '' } }, c)) : [h('span', { style: { opacity: .5 } }, 'type something!')]));
  const loopT = () => { clearInterval(tmr); tmr = setInterval(() => { if (!txt) return; idx = (idx + 1) % txt.length; snd(txt[idx]); draw(); }, 150); };
  window.addEventListener('keydown', (e) => { if (e.key === 'Backspace') txt = txt.slice(0, -1); else if (e.key.length === 1) { txt += e.key.toLowerCase(); snd(e.key); } else return; e.preventDefault(); draw(); loopT(); });
  root.append(h('div', { style: { textAlign: 'center', paddingTop: '60px', font: `12px/1.1 ${MONO}`, whiteSpace: 'pre' } }, ' ___________________\n|[][][][][][][][][]|\n|[][][][][][][][][]|\n|[__][][][][][][__]|\n|___[________]_____|'), h('div', { style: { textAlign: 'center', font: `13px ${MONO}`, margin: '12px 0 30px' } }, 'type your beat'), h('div', { style: { width: '560px', margin: '0 auto', border: '4px solid #fff', padding: '20px', background: '#f8dfb4' } }, out), h('div', { style: { textAlign: 'center', font: `12px ${MONO}`, marginTop: '20px' } }, h('span', { style: { cursor: 'pointer' }, onclick: () => copy(location.href + '#' + txt) }, 'share beat'), ' · ', h('span', { style: { cursor: 'pointer' }, onclick: () => { txt = ''; draw(); } }, 'clear')), h('div', { style: { position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', font: `11px ${MONO}`, opacity: .7 } }, 'typedrummer-ish · every letter is a drum'));
  window.__demoProof = async () => 'ascii keyboard + beat box ready (type to loop)';
};
V['year-vault-dial-player'] = (root, T) => {
  theme(root, T, { bg: '#0a1a2e', fg: '#dff', ac: '#7fd8ff', dark: true });
  let year = 2004; const GEN = { 1960: [0, 4, 7, 9], 1970: [0, 3, 7, 10], 1980: [0, 7, 12, 16], 1990: [0, 5, 7, 12], 2000: [0, 4, 7, 11], 2010: [0, 3, 5, 7], 2020: [0, 2, 7, 9] };
  const yEl = h('div', { style: { font: "200 110px/1 'Inter Variable'", letterSpacing: '.1em' } }); const song = h('div', { style: { fontSize: '13px', opacity: .8 } });
  const SONGS = ['Neon Skies', 'Paper Hearts', 'Midnight Radio', 'Golden Hour', 'Satellite Love', 'Electric Summer'];
  const draw = () => { yEl.textContent = year; song.textContent = `#1 this week: “${SONGS[year % SONGS.length]}” — The ${['Echoes', 'Rivals', 'Satellites', 'Hues'][year % 4]}`; };
  const play = () => { const d = Math.floor(year / 10) * 10; const ch = GEN[clamp(d, 1960, 2020)]; for (let b = 0; b < 4; b++) ch.forEach((iv, k) => blip(midi(52 + iv + (b % 2 ? 5 : 0)), 0.5, d < 1990 ? 'triangle' : 'sawtooth', 0.04, b * 0.5 + k * 0.03)); };
  const bg = h('div', { style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%,#2a6a9a 0%,#0d2a4a 40%,#050d18 75%)' } }); const ring = h('div', { style: { position: 'absolute', left: '50%', top: '45%', width: '720px', height: '720px', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '30px solid #7fd8ff18', boxShadow: '0 0 80px #7fd8ff33 inset' } });
  root.append(bg, ring, h('div', { style: { position: 'relative', textAlign: 'center', paddingTop: '40px' } }, h('div.k-row', { style: { justifyContent: 'center', gap: '20px', fontSize: '12px' } }, 'Why', 'Login', 'Help', 'Explore'), h('div', { style: { letterSpacing: '.4em', fontSize: '13px', margin: '20px 0' } }, 'MUSIC TIME MACHINE-ish'), h('div.k-row', { style: { justifyContent: 'center', gap: '12px' } }, h('span', { style: { fontSize: '28px', cursor: 'pointer' }, onclick: () => { year--; draw(); } }, '‹'), h('span', { style: { border: '1px solid #7fd8ff', borderRadius: '99px', padding: '4px 14px', fontSize: '12px' } }, 'US'), h('span', { style: { fontSize: '28px', cursor: 'pointer' }, onclick: () => { year++; draw(); } }, '›')), h('div', { style: { fontSize: '11px', opacity: .6, marginTop: '10px' } }, 'SET THE YEAR'), yEl, song, h('button', { style: { marginTop: '20px', background: '#e8f7ff', color: '#0a1a2e', border: 0, padding: '10px 50px', borderRadius: '99px', fontWeight: 700 }, onclick: play }, 'ENGAGE'), h('div', { style: { width: '460px', margin: '40px auto 0' } }, slider('Year dial', 1960, 2026, year, 1, (v) => { year = v; draw(); })), h('div', { style: { fontSize: '11px', opacity: .6 } }, '1960 ··· 1980 ··· 2000 ··· 2026')));
  draw();
  window.__demoProof = async () => 'year dial at 2004; ENGAGE plays era chords';
};
V['math-theorem-voice-instrument'] = (root, T) => {
  theme(root, T, { bg: '#10141a', fg: '#ccd', ac: '#f2c14e', acfg: '#000', dark: true });
  const P = { f: 440, wave: 'sine', vol: 0.3, pan: 0, on: false }; let o = null, g = null; const ctx = { an: null };
  const toggleOn = () => { const ac = audio(); if (!ac) return; P.on = !P.on; if (P.on) { o = ac.createOscillator(); g = ac.createGain(); ctx.an = ac.createAnalyser(); o.type = P.wave; o.frequency.value = P.f; g.gain.value = P.vol * 0.3; o.connect(g).connect(ctx.an).connect(ac.destination); o.start(); } else { o?.stop(); o = null; } pb.textContent = P.on ? '■ STOP' : '▶ PLAY'; };
  const cv = h('canvas', { style: { width: '100%', height: '100%' } }); const scope = h('div', { style: { height: '200px', background: '#0b0e13', border: '1px solid #2a2f38' } }, cv);
  const loop = () => { fitCanvas(cv, scope); const g2 = cv.g; g2.fillStyle = '#0b0e13'; g2.fillRect(0, 0, cv.W, cv.H); g2.strokeStyle = '#2a2f38'; for (let x = 0; x < cv.W; x += 40) { g2.beginPath(); g2.moveTo(x, 0); g2.lineTo(x, cv.H); g2.stroke(); } g2.strokeStyle = '#f2c14e'; g2.lineWidth = 2; g2.beginPath(); if (ctx.an && P.on) { const d = new Uint8Array(1024); ctx.an.getByteTimeDomainData(d); d.forEach((v, i) => { const x = (i / 1024) * cv.W, y = (v / 255) * cv.H; i ? g2.lineTo(x, y) : g2.moveTo(x, y); }); } else for (let x = 0; x < cv.W; x++) { const t = x / cv.W * 8 * Math.PI; const v = P.wave === 'square' ? Math.sign(Math.sin(t)) : P.wave === 'sawtooth' ? ((t / Math.PI) % 2) - 1 : P.wave === 'triangle' ? Math.asin(Math.sin(t)) / 1.57 : Math.sin(t); x ? g2.lineTo(x, cv.H / 2 - v * cv.H * 0.35 * P.vol * 2) : g2.moveTo(x, cv.H / 2); } g2.stroke(); requestAnimationFrame(loop); };
  const pb = h('button', { style: { background: '#f2c14e', border: 0, padding: '10px 18px', fontWeight: 700, letterSpacing: '.1em' }, onclick: toggleOn }, '▶ PLAY');
  const setF = (v) => { P.f = v; if (o) o.frequency.value = v; fOut.textContent = v.toFixed(1) + ' Hz'; }; const fOut = h('b', { style: { color: '#f2c14e', font: `22px ${MONO}` } });
  root.append(h('div.k-row', { style: { height: '44px', padding: '0 20px', borderBottom: '1px solid #222', fontSize: '12px' } }, h('b', {}, '◎ Szynalski-ish'), h('span', { style: { flex: 1 } }), 'Blog', 'Tools'), h('div', { style: { padding: '24px 60px', display: 'grid', gap: '16px' } }, h('div', { style: { fontSize: '11px', letterSpacing: '.2em', color: '#f2c14e' } }, 'OFFICIAL SPECIAL · THE THEOREM VOICE'), h('div', { style: { font: "600 38px 'Fraunces Variable'" } }, 'The Generator'), h('p', { style: { opacity: .7, maxWidth: '720px', fontSize: '13px' } }, 'Precise pure-tone and waveform generator: sweep frequency, pick a waveform, and hear the mathematics of sound.'), h('div', { style: { background: '#161b22', border: '1px solid #2a2f38', padding: '16px', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '20px', alignItems: 'center' } }, pb, slider('Frequency', 20, 2000, P.f, 0.5, setF), fOut, h('div', { style: { width: '160px' } }, slider('Volume', 0, 1, P.vol, 0.01, (v) => { P.vol = v; if (g) g.gain.value = v * 0.3; }))), h('div.k-row', {}, seg(['sine', 'square', 'sawtooth', 'triangle'], P.wave, (v) => { P.wave = v; if (o) o.type = v; }), ...[[-12, '½×'], [-1, '−1 st'], [1, '+1 st'], [12, '2×']].map(([st, l]) => btn(l, () => setF(clamp(P.f * 2 ** (st / 12), 20, 2000)))), btn('A4 440', () => setF(440))), scope));
  setF(440); loop();
  window.__demoProof = async () => { setF(523.3); return 'tone generator at 523 Hz with scope'; };
};
V['webcam-class-train-studio'] = (root, T) => {
  theme(root, T, { bg: '#e8eaed', fg: '#202124', ac: '#1967d2', dark: false });
  const classes = [{ n: 'Class 1', s: [] }, { n: 'Class 2', s: [] }]; let model = null; const pad = h('canvas', { width: 120, height: 120, style: { background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', cursor: 'crosshair', touchAction: 'none' } }); const pg = pad.getContext('2d'); pg.lineWidth = 8; pg.lineCap = 'round';
  let last = null; drag(pad, { start: (e) => { last = localPos(e, pad); }, move: (e) => { const p = localPos(e, pad); pg.beginPath(); pg.moveTo(last.x, last.y); pg.lineTo(p.x, p.y); pg.stroke(); last = p; predict(); } });
  const feat = () => { const d = pg.getImageData(0, 0, 120, 120).data; const f = []; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { let s2 = 0; for (let yy = 0; yy < 15; yy++) for (let xx = 0; xx < 15; xx++) s2 += d[((y * 15 + yy) * 120 + x * 15 + xx) * 4 + 3]; f.push(s2 / 57375); } return f; };
  const bars = h('div', { style: { display: 'grid', gap: '6px' } });
  const predict = () => { if (!model) return; const f = feat(); const ds = model.map((c) => Math.exp(-c.reduce((a, v, i) => a + (v - f[i]) ** 2, 0) * 3)); const sum = ds.reduce((a, b) => a + b, 0) || 1; bars.replaceChildren(...classes.map((c, i) => h('div.k-row', {}, h('span', { style: { width: '60px', fontSize: '12px' } }, c.n), h('div', { style: { flex: 1, height: '22px', background: '#f1f3f4', borderRadius: '4px', overflow: 'hidden' } }, h('div', { style: { width: (ds[i] / sum) * 100 + '%', height: '100%', background: ['#e8710a', '#1967d2'][i], color: '#fff', fontSize: '11px', paddingLeft: '4px' } }, Math.round((ds[i] / sum) * 100) + '%'))))); };
  const cards = h('div', { style: { display: 'grid', gap: '14px' } }); const drawCards = () => cards.replaceChildren(...classes.map((c, i) => h('div', { style: { background: '#fff', borderRadius: '8px', padding: '14px', boxShadow: '0 1px 3px #0002', width: '360px' } }, h('div', { style: { fontWeight: 500, marginBottom: '8px' } }, c.n, ' ✎'), h('div', { style: { fontSize: '12px', color: '#5f6368', marginBottom: '6px' } }, `${c.s.length} Image Samples`), h('div.k-row', {}, h('button', { style: { border: 0, background: '#e8f0fe', color: '#1967d2', padding: '8px 12px', borderRadius: '6px' }, onclick: () => { c.s.push(feat()); pg.clearRect(0, 0, 120, 120); drawCards(); } }, '＋ Add sample from pad'), h('button', { style: { border: 0, background: '#e8f0fe', color: '#1967d2', padding: '8px 12px', borderRadius: '6px' } }, '⇪ Upload'))))); 
  root.append(h('div', { style: { position: 'absolute', left: '14px', top: '10px', background: '#fff', padding: '6px 12px', borderRadius: '6px', color: '#1967d2', fontWeight: 600, boxShadow: '0 1px 3px #0002' } }, '≡ Teachable Machine-ish'), h('div', { style: { position: 'absolute', left: '60px', top: '80px', right: '60px', display: 'flex', gap: '40px', alignItems: 'center' } }, cards, h('div', { style: { background: '#fff', borderRadius: '8px', padding: '14px', boxShadow: '0 1px 3px #0002', width: '180px', textAlign: 'center' } }, h('b', {}, 'Training'), h('button', { style: { display: 'block', width: '100%', marginTop: '10px', background: '#1967d2', color: '#fff', border: 0, padding: '8px', borderRadius: '6px' }, onclick: () => { if (classes.some((c) => !c.s.length)) return toast('Add samples to every class'); model = classes.map((c) => c.s[0].map((_, i) => c.s.reduce((a, v) => a + v[i], 0) / c.s.length)); toast('Model trained'); predict(); } }, 'Train Model'), h('div', { style: { fontSize: '11px', color: '#5f6368', marginTop: '8px' } }, 'Advanced ▾')), h('div', { style: { background: '#fff', borderRadius: '8px', padding: '14px', boxShadow: '0 1px 3px #0002', width: '300px', display: 'grid', gap: '10px' } }, h('div.k-row', {}, h('b', {}, 'Preview'), h('span', { style: { flex: 1 } }), h('span', { style: { fontSize: '12px', color: '#1967d2' } }, 'Export Model')), h('div.k-row', {}, pad, btn('clear', () => { pg.clearRect(0, 0, 120, 120); predict(); })), h('div', { style: { fontSize: '12px', color: '#5f6368' } }, 'Draw on the pad (stands in for webcam frames).'), bars)));
  drawCards();
  window.__demoProof = async () => { const dr = (f) => { pg.clearRect(0, 0, 120, 120); pg.beginPath(); f(); pg.stroke(); }; for (let k = 0; k < 3; k++) { dr(() => pg.arc(60, 60, 35 + k * 3, 0, 7)); classes[0].s.push(feat()); dr(() => { pg.moveTo(20, 20 + k * 4); pg.lineTo(100, 100); pg.moveTo(100, 20); pg.lineTo(20, 100); }); classes[1].s.push(feat()); } model = classes.map((c) => c.s[0].map((_, i) => c.s.reduce((a, v) => a + v[i], 0) / c.s.length)); dr(() => pg.arc(60, 60, 38, 0, 7)); drawCards(); predict(); return 'trained 2 classes (circle vs X) → live prediction'; };
};
V['calm-window-view-swap'] = (root, T) => {
  theme(root, T, { bg: '#1f3a44', fg: '#fff', ac: '#fff', dark: true });
  const PL = [['Oslo, Norway', 'land', 3], ['Kyoto, Japan', 'sunset', 5], ['Lisbon, Portugal', 'land', 9], ['Cape Town, SA', 'sunset', 2], ['Reykjavík, Iceland', 'land', 14]]; let i = 0;
  const view = h('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden' } }); const cap = h('div', { style: { position: 'absolute', left: '20px', bottom: '20px', fontSize: '13px', opacity: .8 } });
  const show = () => { const [n, k, sd] = PL[i]; const c = scene(480, 300, k, sd); c.style.cssText = 'width:100%;height:100%;object-fit:cover;filter:blur(18px) saturate(1.3);transform:scale(1.1);transition:opacity .6s'; view.replaceChildren(c); cap.textContent = '📍 ' + n + ' · window #' + (1000 + sd * 37); };
  root.append(view, h('div.k-row', { style: { position: 'absolute', top: '14px', left: '20px', right: '20px', gap: '14px', fontSize: '12px' } }, h('span', { style: { background: '#e0457b', padding: '3px 10px', borderRadius: '99px' } }, '♥ Support us'), 'WINDOWS', 'ABOUT', 'CONTACT', h('span', { style: { flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '16px' } }, 'WindowSwap-ish'), 'Login', h('span', { style: { background: '#fff', color: '#000', padding: '3px 14px', borderRadius: '99px' } }, 'Donate')), h('button', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: '#ffffff22', color: '#fff', border: '1.5px solid #fff', padding: '12px 30px', borderRadius: '99px', fontSize: '15px', backdropFilter: 'blur(6px)', cursor: 'pointer' }, onclick: () => { i = (i + 1) % PL.length; show(); blip(330, 0.5, 'sine', 0.04); } }, 'Open a new window somewhere in the world'), cap);
  show();
  window.__demoProof = async () => 'blurred window view; button swaps location';
};

V['radiooooo-decade-country-radio'] = (root, T) => {
  theme(root, T, { bg: '#c8e8ea', fg: '#1a2b44', ac: '#e8c547', dark: false });
  const DECADES = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 'NOW', 2070];
  const COUNTRIES = [
    { n: 'France', x: 0.48, y: 0.38, tracks: ['La Vie en Rose', 'Je t\'aime', 'Paris Nights'] },
    { n: 'United Kingdom', x: 0.45, y: 0.32, tracks: ['The Light', 'Midnight Bus', 'Foghorn'] },
    { n: 'United States', x: 0.22, y: 0.4, tracks: ['Route 66', 'Neon Motel', 'Coast Highway'] },
    { n: 'Brazil', x: 0.32, y: 0.62, tracks: ['Bossa Nova', 'Samba Rain', 'Ipanema'] },
    { n: 'Japan', x: 0.82, y: 0.4, tracks: ['Tokyo Drifted', 'Shibuya Signal', 'Kyoto Dust'] },
    { n: 'India', x: 0.68, y: 0.48, tracks: ['Raga Road', 'Monsoon FM', 'Spice Wave'] },
    { n: 'Egypt', x: 0.54, y: 0.48, tracks: ['Nile Radio', 'Cairo Pulse', 'Desert Dial'] },
    { n: 'Australia', x: 0.84, y: 0.7, tracks: ['Outback AM', 'Coral Coast', 'Sydney Static'] },
  ];
  const ARTISTS = ['Metronomy', 'The Echoes', 'Radio Ghost', 'Velvet Antenna', 'Oriana Ferst'];
  let decade = 'NOW', country = COUNTRIES[1], moods = { SLOW: true, FAST: true, WEIRD: true };
  let playing = false, trackIdx = 0, tmr = null;
  const label = () => `${country.n.toUpperCase()} ${decade}`;
  const trackName = () => country.tracks[trackIdx % country.tracks.length];
  const badge = h('div', { style: { position: 'absolute', left: '18px', top: '58px', background: '#e8c547', color: '#1a2b44', fontWeight: 800, fontSize: '12px', padding: '6px 12px', borderRadius: '4px', zIndex: 5, letterSpacing: '.04em' } }, label());
  const titleEl = h('div', { style: { fontWeight: 700, fontSize: '15px', textAlign: 'center' } });
  const metaEl = h('div', { style: { fontSize: '11px', opacity: .75, textAlign: 'center' } });
  const playBtn = h('button', { style: { width: '48px', height: '48px', borderRadius: '50%', background: '#e53935', color: '#fff', border: 0, fontSize: '18px', cursor: 'pointer', boxShadow: '0 2px 10px #0006' } }, '▶');
  const refresh = () => {
    badge.textContent = label();
    titleEl.textContent = `${trackName()} — ${ARTISTS[trackIdx % ARTISTS.length]}`;
    metaEl.textContent = `${country.n} · ${decade} · ${Object.entries(moods).filter(([, v]) => v).map(([k]) => k).join('/') || 'ALL'}`;
  };
  const playBlip = () => {
    const base = decade === 'NOW' ? 64 : decade === 2070 ? 72 : 48 + (typeof decade === 'number' ? (decade - 1900) / 10 : 10);
    const scale = moods.WEIRD ? [0, 1, 4, 6, 7, 10] : moods.FAST ? [0, 2, 4, 7, 9] : [0, 3, 5, 7];
    const rate = moods.FAST && !moods.SLOW ? 0.18 : moods.SLOW && !moods.FAST ? 0.42 : 0.28;
    for (let i = 0; i < 6; i++) blip(midi(base + scale[i % scale.length]), rate * 1.4, moods.WEIRD ? 'square' : 'triangle', 0.07, i * rate);
  };
  const setPlaying = (on) => {
    playing = on; playBtn.textContent = on ? '❚❚' : '▶';
    clearInterval(tmr);
    if (on) { playBlip(); tmr = setInterval(playBlip, moods.FAST && !moods.SLOW ? 1100 : 1800); }
  };
  playBtn.onclick = () => setPlaying(!playing);
  const skip = () => { trackIdx++; refresh(); if (playing) playBlip(); };
  // illustrated map stage
  const map = h('div', { style: { position: 'absolute', inset: '44px 0 150px 0', background: 'linear-gradient(180deg,#9ed9dc 0%,#7ec8cc 40%,#6ab8c0 100%)', overflow: 'hidden' } });
  const svg = s('svg', { viewBox: '0 0 1000 500', preserveAspectRatio: 'xMidYMid slice', style: 'position:absolute;inset:0;width:100%;height:100%' });
  const lands = [
    'M80 180 Q140 120 220 160 L280 200 Q240 280 160 300 Q90 260 80 180Z',
    'M260 140 Q340 100 420 150 L480 220 Q400 280 320 250 Q250 200 260 140Z',
    'M500 160 Q560 120 620 170 L640 240 Q580 280 520 250 Q480 200 500 160Z',
    'M700 180 Q780 140 860 190 L900 260 Q820 320 740 280 Q680 230 700 180Z',
    'M300 340 Q380 300 460 360 L420 420 Q340 430 300 340Z',
    'M780 340 Q860 300 920 360 L900 430 Q820 440 780 340Z',
  ];
  svg.append(s('rect', { width: 1000, height: 500, fill: '#7ec8cc' }));
  // wave lines
  for (let y = 40; y < 500; y += 28) {
    const d = `M0 ${y} Q50 ${y - 6} 100 ${y} T200 ${y} T300 ${y} T400 ${y} T500 ${y} T600 ${y} T700 ${y} T800 ${y} T900 ${y} T1000 ${y}`;
    svg.append(s('path', { d, fill: 'none', stroke: '#ffffff44', 'stroke-width': 1.2 }));
  }
  lands.forEach((d, i) => svg.append(s('path', { d, fill: ['#e8d9a8', '#dfd3a3', '#f0e2b4', '#e2d49a', '#ebe0b0', '#d9c98e'][i], stroke: '#c4b37a', 'stroke-width': 2 })));
  const pins = h('div', { style: { position: 'absolute', inset: 0 } });
  const drawPins = () => {
    pins.replaceChildren(...COUNTRIES.map((c) => h('button', {
      style: {
        position: 'absolute', left: c.x * 100 + '%', top: c.y * 100 + '%', transform: 'translate(-50%,-50%)',
        width: country === c ? '18px' : '12px', height: country === c ? '18px' : '12px', borderRadius: '50%',
        background: country === c ? '#e53935' : '#1a2b44', border: '2px solid #fff', cursor: 'pointer',
        boxShadow: country === c ? '0 0 0 4px #e5393544' : '0 1px 4px #0004', zIndex: 3,
      },
      title: c.n,
      onclick: () => { country = c; trackIdx = 0; refresh(); if (playing) playBlip(); },
    })));
  };
  const shuffleCard = h('div', { style: { position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%,-50%)', background: '#1a2b44ee', color: '#fff', padding: '22px 36px', borderRadius: '8px', textAlign: 'center', zIndex: 4, boxShadow: '0 12px 40px #0005', pointerEvents: 'none' } },
    h('div', { style: { fontSize: '11px', letterSpacing: '.2em', opacity: .7, marginBottom: '6px' } }, 'SHUFFLE MODE'),
    h('div', { style: { fontWeight: 800, fontSize: '18px' } }, "THE CURATOR'S CHOICE"));
  map.append(svg, pins, shuffleCard, badge,
    h('button', { style: { position: 'absolute', left: '18px', top: '96px', background: '#3a7bd5', color: '#fff', border: 0, padding: '6px 14px', borderRadius: '4px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', zIndex: 5 }, onclick: () => { country = pick(COUNTRIES); decade = pick(DECADES); trackIdx = 0; refresh(); drawPins(); drawDecades(); if (playing) playBlip(); } }, 'SHUFFLE'));
  // top bar
  const moodRow = h('div.k-row', { style: { gap: '18px' } });
  ['SLOW', 'FAST', 'WEIRD'].forEach((m) => {
    const lamp = h('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: moods[m] ? (m === 'WEIRD' ? '#7fd8ff' : '#e53935') : '#334', display: 'inline-block', boxShadow: moods[m] ? '0 0 8px currentColor' : 'none' } });
    const btnEl = h('button', { style: { background: 'none', border: 0, color: '#e8c547', fontWeight: 800, fontSize: '12px', letterSpacing: '.12em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }, onclick: () => { moods[m] = !moods[m]; lamp.style.background = moods[m] ? (m === 'WEIRD' ? '#7fd8ff' : '#e53935') : '#334'; refresh(); if (playing) { clearInterval(tmr); tmr = setInterval(playBlip, moods.FAST && !moods.SLOW ? 1100 : 1800); playBlip(); } } }, lamp, m);
    moodRow.append(btnEl);
  });
  const top = h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '44px', background: '#1a2b44', color: '#e8c547', padding: '0 16px', zIndex: 6, gap: '20px', fontSize: '12px' } },
    h('b', { style: { font: "italic 900 20px Georgia,serif", letterSpacing: '.06em', color: '#e8c547' } }, 'RADIOOOOO'),
    h('span', { style: { flex: 1 } }), moodRow,
    h('span', { style: { color: '#9ab', marginLeft: '20px' } }, 'EN ▾'),
    h('span', { style: { background: '#3cb371', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 } }, 'Sign up'),
    h('span', { style: { background: '#3a7bd5', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 } }, 'Log In'));
  // decade rail
  const decadeRow = h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, bottom: '88px', height: '54px', justifyContent: 'center', gap: '8px', zIndex: 6, background: 'linear-gradient(180deg,transparent,#1a2b4422)' } });
  const drawDecades = () => {
    decadeRow.replaceChildren(...DECADES.map((d) => {
      const on = d === decade;
      return h('button', {
        style: { width: '44px', height: '44px', borderRadius: '50%', background: '#fff', border: on ? '3px solid #e53935' : '2px solid #1a2b44', color: '#1a2b44', fontWeight: 800, fontSize: d === 'NOW' || d === 2070 ? '10px' : '11px', cursor: 'pointer', boxShadow: on ? '0 0 0 3px #e5393533' : '0 2px 6px #0002', position: 'relative' },
        onclick: () => { decade = d; refresh(); drawDecades(); if (playing) playBlip(); },
      }, d === 'NOW' || d === 2070 ? String(d) : String(d).slice(2),
        on ? h('span', { style: { position: 'absolute', left: '50%', bottom: '6px', transform: 'translateX(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: '#e53935' } }) : null);
    }));
  };
  // player bar
  const player = h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '88px', background: '#1a2b44', color: '#fff', padding: '0 20px', zIndex: 7, gap: '18px' } },
    h('div', { style: { width: '56px', height: '56px', background: 'linear-gradient(135deg,#3a7bd5,#e53935)', borderRadius: '6px', flexShrink: 0 } }),
    h('div.k-row', { style: { gap: '10px', fontSize: '16px', opacity: .85 } }, '♥', '↗', '+'),
    h('div', { style: { flex: 1, display: 'grid', gap: '4px', justifyItems: 'center' } }, titleEl, metaEl,
      h('div.k-row', { style: { gap: '16px', alignItems: 'center' } },
        playBtn,
        h('button', { style: { background: 'none', border: 0, color: '#fff', fontSize: '20px', cursor: 'pointer' }, onclick: skip }, '⏭'))),
    h('div', { style: { fontSize: '11px', opacity: .7, textAlign: 'right', minWidth: '160px' } }, 'Discovered by Curator', h('div', {}, 'Volume ▬▬▬▬○')));
  root.append(top, map, decadeRow, player);
  drawPins(); drawDecades(); refresh();
  window.__demoProof = async () => {
    decade = 1980; country = COUNTRIES[0]; trackIdx = 0; moods.WEIRD = false;
    refresh(); drawPins(); drawDecades();
    setPlaying(true); await sleep(400); skip(); await sleep(200); setPlaying(false);
    return `played ${country.n} ${decade}: ${trackName()}; moods SLOW/FAST`;
  };
};

V['generative-fm-ambient-player'] = (root, T) => {
  theme(root, T, { bg: '#121212', fg: '#e8e8e8', ac: '#ffc83d', dark: true });
  const PIECES = [
    { n: 'Oxalis 1', tags: 'acoustic/calm', geo: ['#000', '#f2bd76', '#aabe9b'], base: 196 },
    { n: 'Moss Garden', tags: 'drone/soft', geo: ['#1a1a1a', '#7eb8a8', '#d4a574'], base: 174 },
    { n: 'Night Ferry', tags: 'ambient/deep', geo: ['#0d0d0d', '#6a8caf', '#c4b7a6'], base: 130 },
    { n: 'Paper Lantern', tags: 'warm/pad', geo: ['#111', '#e8a87c', '#8fbc8f'], base: 220 },
  ];
  let idx = 0, playing = false, shuffle = false, loop = true, queue = false, vol = 0.35;
  let nodes = null, anim = 0;
  const cover = h('canvas', { width: 420, height: 420, style: { width: '360px', height: '360px', background: '#000', flexShrink: 0 } });
  const title = h('div', { style: { font: "700 42px/1.1 'Inter Variable'", color: '#fff' } });
  const meta = h('div', { style: { fontSize: '13px', color: '#9a9a9a', lineHeight: 1.7 } });
  const playBtn = h('button', { style: { background: '#ffc83d', color: '#111', border: 0, padding: '14px 28px', fontWeight: 800, fontSize: '15px', letterSpacing: '.08em', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' } }, '▶  PLAY');
  const dockBtn = (label, activeFn, onClick) => {
    const el = h('button', { style: { background: 'none', border: 0, color: '#888', fontSize: '13px', cursor: 'pointer', padding: '8px 12px', letterSpacing: '.06em' }, onclick: () => { onClick(); paintDock(); } }, label);
    el._activeFn = activeFn; return el;
  };
  const shuffleEl = dockBtn('⇄ SHUFFLE', () => shuffle, () => (shuffle = !shuffle));
  const loopEl = dockBtn('↻ LOOP', () => loop, () => (loop = !loop));
  const queueEl = dockBtn('☰ QUEUE', () => queue, () => (queue = !queue));
  const volEl = h('input', { type: 'range', min: 0, max: 1, step: 0.01, value: vol, style: { width: '100px', accentColor: '#ffc83d' }, oninput: (e) => { vol = +e.target.value; if (nodes) nodes.g.gain.value = vol * 0.08; } });
  const paintDock = () => {
    [shuffleEl, loopEl, queueEl].forEach((el) => { const on = el._activeFn(); el.style.color = on ? '#ffc83d' : '#666'; el.style.fontWeight = on ? 800 : 500; });
  };
  const drawCover = () => {
    const p = PIECES[idx], g = cover.getContext('2d'), W = cover.width, H = cover.height;
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    const pulse = playing ? 0.5 + 0.5 * Math.sin(anim / 20) : 0;
    const pad = 48 - pulse * 6;
    g.strokeStyle = '#fff'; g.lineWidth = 3; g.strokeRect(pad, pad, W - pad * 2, H - pad * 2);
    g.fillStyle = p.geo[0]; g.fillRect(pad + 4, pad + 4, (W - pad * 2) / 2 - 4, H - pad * 2 - 8);
    g.fillStyle = p.geo[1]; g.fillRect(W / 2, pad + 4, (W - pad * 2) / 2 - 4, (H - pad * 2) / 2 - 6);
    g.fillStyle = p.geo[2]; g.fillRect(W / 2, H / 2 + 2, (W - pad * 2) / 2 - 4, (H - pad * 2) / 2 - 6);
    if (playing) {
      g.globalAlpha = 0.15 + pulse * 0.1;
      g.fillStyle = '#ffc83d';
      g.beginPath(); g.arc(W / 2, H / 2, 40 + pulse * 30, 0, 7); g.fill();
      g.globalAlpha = 1;
    }
  };
  const refresh = () => {
    const p = PIECES[idx];
    title.textContent = p.n;
    meta.replaceChildren(
      h('div', {}, 'released March 31, 2020'),
      h('div', {}, p.tags),
      h('div', {}, playing ? 'playing now' : 'never played by you'),
      h('div', {}, 'played for 26K hours total'),
      h('div', {}, 'version 5.2.0'),
    );
    playBtn.textContent = playing ? '❚❚  STOP' : '▶  PLAY';
    drawCover();
  };
  const stopAudio = () => { try { nodes?.o1.stop(); nodes?.o2.stop(); nodes?.n?.stop(); } catch {} nodes = null; };
  const startAudio = () => {
    const ac = audio(); if (!ac) return;
    stopAudio();
    const p = PIECES[idx];
    const o1 = ac.createOscillator(); o1.type = 'sine'; o1.frequency.value = p.base;
    const o2 = ac.createOscillator(); o2.type = 'triangle'; o2.frequency.value = p.base * 1.5;
    const g = ac.createGain(); g.gain.value = vol * 0.08;
    const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 800;
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.08;
    const lg = ac.createGain(); lg.gain.value = 40;
    lfo.connect(lg).connect(o1.frequency);
    o1.connect(f); o2.connect(f); f.connect(g).connect(ac.destination);
    o1.start(); o2.start(); lfo.start();
    nodes = { o1, o2, g, n: lfo };
  };
  const setPlaying = (on) => {
    playing = on;
    if (on) startAudio(); else stopAudio();
    refresh();
  };
  playBtn.onclick = () => setPlaying(!playing);
  const next = () => { idx = shuffle ? Math.floor(Math.random() * PIECES.length) : (idx + 1) % PIECES.length; if (playing) startAudio(); refresh(); };
  const prev = () => { idx = (idx - 1 + PIECES.length) % PIECES.length; if (playing) startAudio(); refresh(); };
  const loopDraw = () => { if (playing) { anim++; drawCover(); } requestAnimationFrame(loopDraw); };
  loopDraw();
  const dock = h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '56px', background: '#0a0a0a', borderTop: '1px solid #222', padding: '0 24px', gap: '8px', zIndex: 5, justifyContent: 'center' } },
    shuffleEl,
    h('button', { style: { background: 'none', border: 0, color: '#ccc', fontSize: '18px', cursor: 'pointer', padding: '8px 14px' }, onclick: prev }, '⏮'),
    h('button', { style: { background: '#ffc83d', color: '#111', border: 0, width: '44px', height: '36px', fontWeight: 800, cursor: 'pointer' }, onclick: () => setPlaying(!playing) }, '▶'),
    h('button', { style: { background: 'none', border: 0, color: '#ccc', fontSize: '18px', cursor: 'pointer', padding: '8px 14px' }, onclick: next }, '⏭'),
    loopEl, queueEl,
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '11px', color: '#666' } }, 'VOL'), volEl);
  root.append(
    h('div.k-row', { style: { height: '48px', padding: '0 20px', borderBottom: '1px solid #222', fontSize: '13px', color: '#aaa', gap: '18px' } },
      h('b', { style: { color: '#fff' } }, 'Generative.fm'), 'Play', 'Browse', 'Library',
      h('span', { style: { flex: 1 } }), '⌕', '⋮',
      h('span', { style: { background: '#ffc83d', color: '#111', padding: '6px 12px', fontWeight: 800, fontSize: '12px' } }, 'SIGN IN')),
    h('div', { style: { position: 'absolute', inset: '48px 0 56px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '56px', padding: '40px' } },
      cover,
      h('div', { style: { display: 'grid', gap: '18px', maxWidth: '360px' } }, title,
        h('div.k-row', { style: { gap: '12px', alignItems: 'center' } }, playBtn,
          h('span', { style: { color: '#666', fontSize: '18px' } }, '👎'), h('span', { style: { color: '#666', fontSize: '18px' } }, '👍'), h('span', { style: { color: '#666', fontSize: '18px' } }, '⋮')),
        meta)),
    dock);
  paintDock(); refresh();
  window.__demoProof = async () => {
    setPlaying(true); shuffle = true; loop = true; paintDock();
    await sleep(400); next(); await sleep(200); vol = 0.5; volEl.value = 0.5;
    if (nodes) nodes.g.gain.value = vol * 0.08;
    setPlaying(false);
    return `played ${PIECES[idx].n}; shuffle/loop on; transport exercised`;
  };
};


V['sfxr-8bit-sound-desk'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#333', panel: '#f5f5f4', ac: '#e67e22', dark: false, line: '#d0d0cc', btn: '#4a4a4a' });
  const PRESETS = {
    'Pickup/coin': { wave: 'square', attack: 0, sustain: 0.07, punch: 0.3, decay: 0.35, freq: 0.55, slide: 0.2, vibrato: 0, vibSpeed: 0, duty: 0.4, gain: 0.35 },
    'Laser/shoot': { wave: 'sawtooth', attack: 0, sustain: 0.1, punch: 0, decay: 0.3, freq: 0.7, slide: -0.45, vibrato: 0, vibSpeed: 0, duty: 0.5, gain: 0.3 },
    'Explosion': { wave: 'noise', attack: 0, sustain: 0.2, punch: 0.4, decay: 0.55, freq: 0.25, slide: -0.15, vibrato: 0, vibSpeed: 0, duty: 0.5, gain: 0.4 },
    'Powerup': { wave: 'square', attack: 0, sustain: 0.15, punch: 0, decay: 0.35, freq: 0.35, slide: 0.35, vibrato: 0.2, vibSpeed: 0.4, duty: 0.5, gain: 0.32 },
    'Hit/hurt': { wave: 'noise', attack: 0, sustain: 0.05, punch: 0.2, decay: 0.2, freq: 0.45, slide: -0.3, vibrato: 0, vibSpeed: 0, duty: 0.5, gain: 0.35 },
    'Jump': { wave: 'square', attack: 0, sustain: 0.1, punch: 0, decay: 0.25, freq: 0.4, slide: 0.25, vibrato: 0, vibSpeed: 0, duty: 0.55, gain: 0.3 },
    'Blip/select': { wave: 'square', attack: 0, sustain: 0.04, punch: 0, decay: 0.08, freq: 0.6, slide: 0, vibrato: 0, vibSpeed: 0, duty: 0.5, gain: 0.28 },
    'Click': { wave: 'noise', attack: 0, sustain: 0.01, punch: 0, decay: 0.04, freq: 0.8, slide: -0.5, vibrato: 0, vibSpeed: 0, duty: 0.5, gain: 0.25 },
  };
  let name = 'Pickup/coin';
  const P = { ...PRESETS[name] };
  const waveSeg = seg([['square', 'Square'], ['sawtooth', 'Sawtooth'], ['sine', 'Sine'], ['noise', 'Noise']], P.wave, (v) => { P.wave = v; paintWave(); });
  const vals = {};
  const mkSl = (key, label, min, max, step) => {
    const sl = slider(label, min, max, P[key], step, (v) => { P[key] = v; vals[key].textContent = (+v).toFixed(2); }, (v) => (+v).toFixed(2));
    vals[key] = sl.querySelector('output');
    return sl;
  };
  const paintWave = () => {
    waveSeg.buttons.forEach((b) => b.classList.toggle('on', b.textContent.toLowerCase().startsWith(P.wave.slice(0, 3)) || (P.wave === 'sawtooth' && b.textContent === 'Sawtooth') || (P.wave === 'noise' && b.textContent === 'Noise') || (P.wave === 'sine' && b.textContent === 'Sine') || (P.wave === 'square' && b.textContent === 'Square')));
  };
  const applyPreset = (n) => {
    name = n; Object.assign(P, PRESETS[n]);
    Object.keys(vals).forEach((k) => { if (P[k] != null && vals[k]) { vals[k].textContent = (+P[k]).toFixed(2); const inp = vals[k].parentNode.querySelector('input'); if (inp) inp.value = P[k]; } });
    paintWave();
    drawWave();
    presetCol.querySelectorAll('button[data-p]').forEach((b) => { b.style.background = b.dataset.p === name ? '#e67e22' : '#4a4a4a'; b.style.color = '#fff'; });
  };
  const playSfx = () => {
    const ac = audio(); if (!ac) return;
    const dur = Math.max(0.05, P.attack + P.sustain + P.decay);
    const t0 = ac.currentTime;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(P.gain * (1 + P.punch), t0 + Math.max(0.005, P.attack));
    g.gain.linearRampToValueAtTime(P.gain * 0.7, t0 + P.attack + P.sustain);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    g.connect(ac.destination);
    if (P.wave === 'noise') {
      const len = Math.floor(ac.sampleRate * dur);
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = ac.createBufferSource(); src.buffer = buf; src.connect(g); src.start(t0); src.stop(t0 + dur + 0.02);
    } else {
      const o = ac.createOscillator(); o.type = P.wave === 'sawtooth' ? 'sawtooth' : P.wave;
      const f0 = 80 + P.freq * 1400;
      const f1 = Math.max(40, f0 * (1 + P.slide));
      o.frequency.setValueAtTime(f0, t0);
      o.frequency.linearRampToValueAtTime(f1, t0 + dur);
      if (P.vibrato > 0) {
        const lfo = ac.createOscillator(); const lg = ac.createGain();
        lfo.frequency.value = 2 + P.vibSpeed * 20; lg.gain.value = P.vibrato * 40;
        lfo.connect(lg).connect(o.frequency); lfo.start(t0); lfo.stop(t0 + dur + 0.02);
      }
      o.connect(g); o.start(t0); o.stop(t0 + dur + 0.02);
    }
    drawWave();
  };
  const mutate = () => {
    ['attack', 'sustain', 'decay', 'freq', 'slide', 'vibrato', 'vibSpeed', 'duty', 'punch'].forEach((k) => {
      if (P[k] == null) return;
      P[k] = clamp(P[k] + (Math.random() - 0.5) * 0.18, k === 'slide' ? -1 : 0, k === 'slide' ? 1 : 1);
    });
    Object.keys(vals).forEach((k) => { if (P[k] != null && vals[k]) { vals[k].textContent = (+P[k]).toFixed(2); const inp = vals[k].parentNode.querySelector('input'); if (inp) inp.value = P[k]; } });
    drawWave(); toast('mutated');
  };
  const randomize = () => {
    const keys = Object.keys(PRESETS);
    applyPreset(keys[Math.floor(Math.random() * keys.length)]);
    mutate();
    name = 'Random';
    toast('randomized');
  };
  const exportWav = () => {
    // tiny stub WAV (silent header + placeholder) for demo download
    const sr = 22050, n = 1392;
    const data = new ArrayBuffer(44 + n * 2); const v = new DataView(data);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) { const t = i / n; const env = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9; const s = Math.sin(2 * Math.PI * (200 + P.freq * 800) * t) * env * 0.4; v.setInt16(44 + i * 2, s * 32767, true); }
    const blob = new Blob([data], { type: 'audio/wav' });
    const a = h('a', { href: URL.createObjectURL(blob), download: (name.replace(/\W+/g, '_') || 'sfx') + '.wav' });
    document.body.append(a); a.click(); a.remove();
    toast('WAV exported');
  };
  const waveCv = h('canvas', { width: 260, height: 64, style: { width: '100%', height: '64px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px' } });
  const drawWave = () => {
    const g = waveCv.getContext('2d'); const W = waveCv.width, H = waveCv.height;
    g.fillStyle = '#f0f0ee'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#e67e22'; g.lineWidth = 1.5; g.beginPath();
    for (let x = 0; x < W; x++) {
      const t = x / W;
      const env = t < P.attack ? t / Math.max(0.001, P.attack) : t < P.attack + P.sustain ? 1 : Math.max(0, 1 - (t - P.attack - P.sustain) / Math.max(0.001, P.decay));
      const y = H / 2 - Math.sin(t * Math.PI * 2 * (6 + P.freq * 10)) * env * (H * 0.4) * (P.wave === 'noise' ? (Math.random() * 2 - 1) : 1);
      x ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  };

  const presetCol = h('div', { style: { display: 'grid', gap: '6px', alignContent: 'start' } },
    h('div.k-h', {}, 'Generator'),
    btn('Random', randomize),
    ...Object.keys(PRESETS).map((n) => h('button.k-btn', { 'data-p': n, style: { background: n === name ? '#e67e22' : '#4a4a4a', color: '#fff', border: 0, textAlign: 'left' }, onclick: () => { applyPreset(n); playSfx(); } }, n)),
    btn('Mutate', mutate),
    h('button.k-btn.pri', { style: { background: '#508f49', color: '#fff', border: 0, fontWeight: 800, padding: '12px' }, onclick: playSfx }, 'Play'),
  );
  // style grey buttons
  presetCol.querySelectorAll('.k-btn').forEach((b) => { if (!b.classList.contains('pri') && !b.dataset.p) { b.style.background = '#4a4a4a'; b.style.color = '#fff'; b.style.border = '0'; } });

  const mid = h('div', { style: { display: 'grid', gap: '8px', overflow: 'auto', paddingRight: '6px' } },
    h('div.k-h', {}, 'Manual settings'),
    h('div.k-h', {}, 'Waveform'), waveSeg,
    h('div.k-h', {}, 'Envelope'),
    mkSl('attack', 'Attack time', 0, 1, 0.01),
    mkSl('sustain', 'Sustain time', 0, 1, 0.01),
    mkSl('punch', 'Sustain punch', 0, 1, 0.01),
    mkSl('decay', 'Decay time', 0, 1, 0.01),
    h('div.k-h', {}, 'Frequency'),
    mkSl('freq', 'Start frequency', 0, 1, 0.01),
    mkSl('slide', 'Slide', -1, 1, 0.01),
    h('div.k-h', {}, 'Vibrato'),
    mkSl('vibrato', 'Depth', 0, 1, 0.01),
    mkSl('vibSpeed', 'Speed', 0, 1, 0.01),
    h('div.k-h', {}, 'Duty'),
    mkSl('duty', 'Duty cycle', 0, 1, 0.01),
    mkSl('gain', 'Gain', 0, 1, 0.01),
  );

  const right = h('div', { style: { display: 'grid', gap: '10px', alignContent: 'start' } },
    h('div.k-h', {}, 'Sound'),
    h('button.k-btn.pri', { style: { background: '#508f49', color: '#fff', border: 0, fontWeight: 800, padding: '14px', fontSize: '16px' }, onclick: playSfx }, 'Play'),
    h('a', { href: '#', style: { color: '#2980b9', fontWeight: 600 }, onclick: (e) => { e.preventDefault(); exportWav(); } }, 'Download: pickupCoin.wav'),
    h('div', { style: { fontSize: '12px', opacity: .7 } }, 'File size: 1kB · Samples: 1392 · 8 bit'),
    seg([['44k', '44k'], ['22k', '22k'], ['11k', '11k'], ['8k', '8k']], '22k', () => {}),
    seg([['16', '16 bit'], ['8', '8 bit']], '8', () => {}),
    btn('Export WAV', exportWav, 'pri'),
    btn('Copy code', () => copy(JSON.stringify(P, null, 2), 'params copied')),
    waveCv,
  );

  root.append(
    h('div.k-row', { style: { height: '52px', padding: '0 18px', borderBottom: '1px solid #ddd', gap: '12px' } },
      h('b', { style: { font: '900 22px ui-rounded,system-ui', color: '#e67e22', letterSpacing: '-.02em' } }, 'jsfxr'),
      h('span', { style: { flex: 1 } }),
      h('span', { style: { background: '#508f49', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: 700, fontSize: '12px' } }, 'Try Pro for free')),
    h('div', { style: { position: 'absolute', inset: '52px 0 0 0', display: 'grid', gridTemplateColumns: '200px 1fr 260px', gap: '16px', padding: '16px 18px', overflow: 'hidden' } },
      presetCol, mid, right),
  );
  applyPreset('Pickup/coin');
  drawWave();
  window.__demoProof = async () => {
    applyPreset('Laser/shoot'); playSfx(); await sleep(200);
    mutate(); playSfx(); await sleep(200);
    P.wave = 'square'; paintWave();
    return 'presets + mutate + play; wave square; WAV export available';
  };
};


V['tonejs-simple-synth-desk'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#333', panel: '#f7f7f8', ac: '#2277ee', dark: false, line: '#e5e5e8', btn: '#333' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'system-ui, Inter Variable, sans-serif';

  const P = { type: 'triangle', attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.6, volume: 0.35 };
  const defaults = { ...P };
  const NOTES = [
    { name: 'C4', midi: 60, black: false },
    { name: 'C#4', midi: 61, black: true },
    { name: 'D4', midi: 62, black: false },
    { name: 'D#4', midi: 63, black: true },
    { name: 'E4', midi: 64, black: false },
    { name: 'F4', midi: 65, black: false },
    { name: 'F#4', midi: 66, black: true },
    { name: 'G4', midi: 67, black: false },
    { name: 'G#4', midi: 68, black: true },
    { name: 'A4', midi: 69, black: false },
    { name: 'A#4', midi: 70, black: true },
    { name: 'B4', midi: 71, black: false },
    { name: 'C5', midi: 72, black: false },
  ];
  const active = new Map();
  let lastNote = '—';

  const status = h('div', {
    style: { font: '12px ui-monospace, JetBrains Mono Variable, monospace', color: '#888' },
  }, 'last: —');

  const trigger = (m, name) => {
    const ac = audio();
    lastNote = name;
    status.textContent = `last: ${name} · ${P.type}`;
    if (!ac) return 'simulated';
    const t0 = ac.currentTime;
    const osc = ac.createOscillator();
    osc.type = P.type;
    osc.frequency.value = midi(m);
    const g = ac.createGain();
    const peak = clamp(P.volume, 0.01, 1);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + Math.max(0.005, P.attack));
    g.gain.linearRampToValueAtTime(peak * P.sustain, t0 + P.attack + P.decay);
    const hold = 0.12;
    const relStart = t0 + P.attack + P.decay + hold;
    g.gain.setValueAtTime(peak * P.sustain, relStart);
    g.gain.exponentialRampToValueAtTime(0.0001, relStart + Math.max(0.02, P.release));
    osc.connect(g).connect(ac.destination);
    osc.start(t0);
    osc.stop(relStart + P.release + 0.05);
    active.set(name, { osc, g });
    return 'played';
  };

  const whites = NOTES.filter((n) => !n.black);
  const blacks = NOTES.filter((n) => n.black);
  const kb = h('div', {
    style: {
      position: 'relative', width: 'min(640px,92vw)', height: '160px',
      margin: '0 auto', userSelect: 'none',
    },
  });
  const whiteRow = h('div', {
    style: { display: 'grid', gridTemplateColumns: `repeat(${whites.length},1fr)`, height: '100%', gap: '2px' },
  });
  whites.forEach((n) => {
    const key = h('button', {
      style: {
        border: '1px solid #bbb', borderRadius: '0 0 6px 6px', background: 'linear-gradient(#fff,#f2f2f2)',
        boxShadow: 'inset 0 -10px 0 #e8e8e8', cursor: 'pointer', position: 'relative',
      },
      onpointerdown: (e) => { e.preventDefault(); key.style.background = '#e8eef8'; trigger(n.midi, n.name); },
      onpointerup: () => { key.style.background = 'linear-gradient(#fff,#f2f2f2)'; },
      onpointerleave: () => { key.style.background = 'linear-gradient(#fff,#f2f2f2)'; },
    }, h('span', { style: { position: 'absolute', bottom: '14px', left: 0, right: 0, textAlign: 'center', font: '10px ui-monospace,monospace', color: '#999' } }, n.name.replace(/\d/, '')));
    whiteRow.append(key);
  });
  kb.append(whiteRow);
  // black keys positioned over whites
  const whiteNames = whites.map((w) => w.name);
  blacks.forEach((n) => {
    // find left neighbor white index
    const base = n.name[0] + n.name.slice(-1); // e.g. C4 from C#4 — better: previous white
    const prevWhite = NOTES.slice(0, NOTES.indexOf(n)).reverse().find((x) => !x.black);
    const idx = whiteNames.indexOf(prevWhite.name);
    const leftPct = ((idx + 0.72) / whites.length) * 100;
    const key = h('button', {
      style: {
        position: 'absolute', left: `calc(${leftPct}% - 14px)`, top: 0, width: '28px', height: '96px',
        background: '#222', border: '1px solid #111', borderRadius: '0 0 4px 4px', cursor: 'pointer', zIndex: 2,
      },
      onpointerdown: (e) => { e.preventDefault(); key.style.background = '#445'; trigger(n.midi, n.name); },
      onpointerup: () => { key.style.background = '#222'; },
      onpointerleave: () => { key.style.background = '#222'; },
    });
    kb.append(key);
  });

  const typeSel = select(
    [['sine', 'sine'], ['square', 'square'], ['sawtooth', 'sawtooth'], ['triangle', 'triangle']],
    P.type,
    (v) => { P.type = v; status.textContent = `last: ${lastNote} · ${P.type}`; },
  );
  Object.assign(typeSel.style, { fontFamily: 'ui-monospace,monospace', minWidth: '140px' });

  const panelOpen = h('div', {
    style: {
      width: 'min(640px,92vw)', margin: '18px auto 0', padding: '16px 18px',
      border: '1px solid #e5e5e8', borderRadius: '10px', background: '#fafafa',
      display: 'grid', gap: '8px',
    },
  },
    h('div.k-row', { style: { gap: '10px', marginBottom: '4px' } },
      h('b', { style: { fontSize: '15px' } }, '▸ Synth'),
      h('span', { style: { flex: 1, height: '1px', background: '#e5e5e8' } }),
      status,
    ),
    h('div.k-row', { style: { gap: '12px', font: '12px ui-monospace,monospace' } },
      h('span', { style: { opacity: .6 } }, 'oscillator'),
      typeSel,
    ),
    slider('Attack', 0.005, 1.5, P.attack, 0.005, (v) => { P.attack = v; }, (v) => (+v).toFixed(3) + 's'),
    slider('Decay', 0.01, 1.5, P.decay, 0.01, (v) => { P.decay = v; }, (v) => (+v).toFixed(2) + 's'),
    slider('Sustain', 0, 1, P.sustain, 0.01, (v) => { P.sustain = v; }, (v) => (+v).toFixed(2)),
    slider('Release', 0.01, 2.5, P.release, 0.01, (v) => { P.release = v; }, (v) => (+v).toFixed(2) + 's'),
    slider('Volume', 0, 1, P.volume, 0.01, (v) => { P.volume = v; }, (v) => Math.round(v * 100) + '%'),
  );

  const top = h('div', {
    style: { padding: '28px 28px 8px', maxWidth: '760px', margin: '0 auto' },
  },
    h('div.k-row', { style: { marginBottom: '18px' } },
      h('span', { style: { fontSize: '20px', letterSpacing: '.08em' } }, '☰'),
      h('span', { style: { flex: 1 } }),
      h('span', { style: { fontSize: '18px' } }, '🔊'),
    ),
    h('p', {
      style: { fontSize: '14px', color: '#555', lineHeight: 1.55, maxWidth: '560px', margin: '0 0 22px' },
    },
      h('a', { href: '#', style: { color: '#2277ee', textDecoration: 'none' }, onclick: (e) => e.preventDefault() }, 'Tone.Synth'),
      ' is composed simply of a ',
      h('a', { href: '#', style: { color: '#2277ee', textDecoration: 'none' }, onclick: (e) => e.preventDefault() }, 'Tone.OmniOscillator'),
      ' routed through a ',
      h('a', { href: '#', style: { color: '#2277ee', textDecoration: 'none' }, onclick: (e) => e.preventDefault() }, 'Tone.AmplitudeEnvelope'),
      '.',
    ),
    h('div.k-row', { style: { justifyContent: 'flex-end', marginBottom: '6px', font: '11px ui-monospace,monospace', color: '#888', width: 'min(640px,92vw)', marginLeft: 'auto', marginRight: 'auto' } },
      'MIDI IN:',
      h('span', { style: { border: '1px solid #ccc', padding: '2px 8px', borderRadius: '4px', marginLeft: '6px' } }, 'none'),
    ),
    kb,
    panelOpen,
  );

  root.append(top);

  window.__demoProof = async () => {
    const before = { ...P };
    P.type = 'square';
    typeSel.value = 'square';
    P.attack = 0.12; P.decay = 0.35; P.sustain = 0.55; P.release = 0.8;
    const r = trigger(64, 'E4');
    await sleep(160);
    Object.assign(P, before);
    typeSel.value = before.type;
    return `osc→square, ADSR nudged, note ${r}, restored`;
  };
};


V['blob-opera-drag-choir-desk'] = (root, T) => {
  theme(root, T, { bg: '#1a1428', fg: '#f4efe8', panel: '#241c36', ac: '#ffb4e1', dark: true });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Fraunces Variable, Georgia, serif';

  const VOICES = [
    { id: 'bass', name: 'Bass', color: '#5b8def', baseMidi: 40, x: 0.18 },
    { id: 'mezzo', name: 'Mezzo', color: '#f0a05a', baseMidi: 55, x: 0.40 },
    { id: 'tenor', name: 'Tenor', color: '#34d399', baseMidi: 60, x: 0.62 },
    { id: 'soprano', name: 'Soprano', color: '#f472b6', baseMidi: 72, x: 0.84 },
  ];
  // pose: pitch 0..1 (up=high), vowel 0..1 (right=open)
  const pose = VOICES.map((v, i) => ({ pitch: 0.35 + i * 0.08, vowel: 0.45 }));
  const defaults = pose.map((p) => ({ ...p }));
  let active = -1;
  const oscillators = VOICES.map(() => null);

  const stage = h('div', {
    style: {
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 50% 70%, #3a2a55 0%, #1a1428 55%, #0e0a18 100%)',
    },
  });
  const floor = h('div', {
    style: {
      position: 'absolute', left: '8%', right: '8%', bottom: '12%', height: '18%',
      background: 'linear-gradient(180deg, #2a2040aa, #120e1c)',
      borderRadius: '50%', filter: 'blur(1px)', opacity: .7, pointerEvents: 'none',
    },
  });
  const curtain = h('div', {
    style: {
      position: 'absolute', inset: '0 0 auto', height: '70px',
      background: 'linear-gradient(180deg, #4a1840cc, transparent)', pointerEvents: 'none',
    },
  });

  const svg = s('svg', {
    viewBox: '0 0 1000 560',
    style: 'position:absolute;inset:40px 40px 90px;width:calc(100% - 80px);height:calc(100% - 130px);touch-action:none',
  });

  const blobEls = [];
  const stopVoice = (i) => {
    const o = oscillators[i];
    if (!o) return;
    try { o.gain.gain.exponentialRampToValueAtTime(0.0001, audio().currentTime + 0.12); o.osc.stop(audio().currentTime + 0.14); } catch {}
    oscillators[i] = null;
  };
  const startVoice = (i) => {
    const ac = audio(); if (!ac) return;
    stopVoice(i);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filt = ac.createBiquadFilter();
    filt.type = 'lowpass';
    osc.type = i === 0 ? 'triangle' : i === 3 ? 'sine' : 'sawtooth';
    const p = pose[i];
    const freq = midi(VOICES[i].baseMidi + Math.round((p.pitch - 0.5) * 24));
    osc.frequency.value = freq;
    filt.frequency.value = 400 + p.vowel * 2200;
    gain.gain.value = 0.0001;
    osc.connect(filt); filt.connect(gain); gain.connect(ac.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.06, ac.currentTime + 0.05);
    oscillators[i] = { osc, gain, filt };
  };
  const updateVoice = (i) => {
    const o = oscillators[i]; if (!o) return;
    const p = pose[i];
    const freq = midi(VOICES[i].baseMidi + Math.round((p.pitch - 0.5) * 24));
    o.osc.frequency.setTargetAtTime(freq, audio().currentTime, 0.04);
    o.filt.frequency.setTargetAtTime(400 + p.vowel * 2200, audio().currentTime, 0.05);
  };

  const drawBlobs = () => {
    svg.replaceChildren();
    // soft stage lights
    svg.append(s('ellipse', { cx: 500, cy: 480, rx: 420, ry: 40, fill: '#ffffff08' }));
    blobEls.length = 0;
    VOICES.forEach((v, i) => {
      const p = pose[i];
      const cx = v.x * 1000;
      const cy = 420 - p.pitch * 260;
      const stretchX = 55 + p.vowel * 35;
      const stretchY = 70 - p.vowel * 18 + (1 - p.pitch) * 10;
      const mouthW = 12 + p.vowel * 28;
      const mouthH = 6 + p.vowel * 16;
      const g = s('g', { style: 'cursor:grab', 'data-i': String(i) });
      g.append(
        s('ellipse', { cx, cy: cy + stretchY * 0.55, rx: stretchX * 0.55, ry: 14, fill: '#00000033' }),
        s('ellipse', { cx, cy, rx: stretchX, ry: stretchY, fill: v.color, opacity: active === i ? 1 : 0.92 }),
        s('ellipse', { cx: cx - stretchX * 0.25, cy: cy - stretchY * 0.25, rx: stretchX * 0.28, ry: stretchY * 0.22, fill: '#ffffff55' }),
        s('ellipse', { cx: cx - 14, cy: cy - 8, rx: 6, ry: 8, fill: '#1a1020' }),
        s('ellipse', { cx: cx + 14, cy: cy - 8, rx: 6, ry: 8, fill: '#1a1020' }),
        s('ellipse', { cx, cy: cy + 18, rx: mouthW / 2, ry: mouthH / 2, fill: '#2a1030' }),
        s('text', { x: cx, y: cy + stretchY + 28, 'text-anchor': 'middle', fill: '#f4efe8aa', 'font-size': 18, 'font-family': 'Inter Variable,system-ui' }, v.name),
      );
      const onDown = (e) => {
        e.preventDefault();
        active = i;
        const rect = svg.getBoundingClientRect();
        startVoice(i);
        // harmony followers
        VOICES.forEach((_, j) => { if (j !== i) startVoice(j); });
        const move = (ev) => {
          const x = (ev.clientX - rect.left) / rect.width;
          const y = (ev.clientY - rect.top) / rect.height;
          pose[i].vowel = clamp(x * 1.2 - v.x + 0.5, 0, 1);
          pose[i].pitch = clamp(1 - y, 0, 1);
          // others harmonize
          VOICES.forEach((_, j) => {
            if (j === i) return;
            const interval = [0, 3, 7, 12][(j - i + 4) % 4] / 24;
            pose[j].pitch = clamp(pose[i].pitch + (j - i) * 0.08 + (interval - 0.2) * 0.15, 0.05, 0.95);
            pose[j].vowel = clamp(pose[i].vowel * 0.7 + 0.15 + j * 0.05, 0, 1);
            updateVoice(j);
          });
          updateVoice(i);
          drawBlobs();
        };
        const up = () => {
          active = -1;
          VOICES.forEach((_, j) => stopVoice(j));
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          drawBlobs();
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        drawBlobs();
      };
      g.addEventListener('pointerdown', onDown);
      svg.append(g);
      blobEls.push(g);
    });
  };

  const reset = () => {
    pose.forEach((p, i) => Object.assign(p, defaults[i]));
    VOICES.forEach((_, i) => stopVoice(i));
    drawBlobs();
    toast('Poses reset');
  };

  const top = h('div.k-row', {
    style: { position: 'absolute', top: 0, left: 0, right: 0, height: '52px', padding: '0 22px', zIndex: 2, gap: '14px', background: 'linear-gradient(#2a1840cc,#0000)', fontFamily: 'Inter Variable,system-ui' },
  },
    h('b', { style: { letterSpacing: '.08em', fontSize: '14px' } }, 'Blob Opera-ish'),
    h('span', { style: { opacity: .5, fontSize: '12px' } }, 'drag choir'),
    h('span', { style: { flex: 1 } }),
    btn('Reset', reset),
    btn('Record stub', () => toast('Recording stub saved'), 'pri'),
  );

  const hint = h('div', {
    style: { position: 'absolute', bottom: '22px', left: 0, right: 0, textAlign: 'center', fontSize: '13px', opacity: .65, zIndex: 2, fontFamily: 'Inter Variable,system-ui', pointerEvents: 'none' },
  }, 'Drag up/down for pitch · sideways for vowels · others harmonize');

  root.append(stage, floor, curtain, svg, top, hint);
  drawBlobs();

  window.__demoProof = async () => {
    const snap = pose.map((p) => ({ ...p }));
    pose[2].pitch = 0.85; pose[2].vowel = 0.8;
    VOICES.forEach((_, j) => {
      if (j === 2) return;
      pose[j].pitch = clamp(0.85 + (j - 2) * 0.1, 0.1, 0.95);
      pose[j].vowel = 0.55;
    });
    drawBlobs();
    startVoice(2); VOICES.forEach((_, j) => { if (j !== 2) startVoice(j); });
    await sleep(500);
    VOICES.forEach((_, j) => stopVoice(j));
    pose.forEach((p, i) => Object.assign(p, snap[i]));
    drawBlobs();
    return 'tenor raised · choir harmonized · restored';
  };
};

V['typatone-type-music-desk'] = (root, T) => {
  theme(root, T, { bg: '#efefef', fg: '#0a81c6', panel: '#ffffff', ac: '#0a81c6', dark: false, line: '#d0d8e0' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter Variable', Georgia, serif";

  // A–Z → pentatonic-ish map (C4 major pentatonic repeating)
  const PENTA = [60, 62, 64, 67, 69]; // C D E G A
  const pitchOf = (ch) => {
    const i = ch.toLowerCase().charCodeAt(0) - 97;
    if (i < 0 || i > 25) return null;
    const deg = PENTA[i % 5];
    const oct = Math.floor(i / 5);
    return deg + oct * 12;
  };

  let muted = false;
  let typed = '';
  const flashes = []; // {ch,x,y,t,hue,vx,vy}
  let unlocked = false;

  const cv = h('canvas', { style: { position: 'absolute', inset: 0, displayAction: 'none', cursor: 'text' } });
  root.append(cv);

  const preview = h('div', {
    style: {
      position: 'absolute', left: '50%', bottom: '28px', transform: 'translateX(-50%)',
      width: 'min(720px,90vw)', textAlign: 'center', font: '18px/1.4 Georgia, serif',
      color: '#0a81c6', letterSpacing: '0.04em', zIndex: 3, pointerEvents: 'none',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    },
  }, 'Start typing…');

  const bar = h('div.k-row', {
    style: {
      position: 'absolute', top: '18px', right: '18px', gap: '8px', zIndex: 4,
    },
  },
    btn('Mute', (e) => {
      muted = !muted;
      e.target.textContent = muted ? 'Unmute' : 'Mute';
      toast(muted ? 'muted' : 'sound on');
    }),
    btn('Clear', () => {
      typed = '';
      flashes.length = 0;
      preview.textContent = 'Start typing…';
      preview.style.opacity = '0.55';
    }, 'pri'),
  );

  const hint = h('div', {
    style: {
      position: 'absolute', top: '22%', left: '50%', transform: 'translateX(-50%)',
      font: '13px/1.5 system-ui', color: '#0a81c688', zIndex: 2, textAlign: 'center',
      pointerEvents: 'none',
    },
  }, 'writing as performance · each letter is a note');

  const unlock = () => {
    if (unlocked) return;
    audio();
    unlocked = true;
    hint.style.opacity = '0';
  };

  const playLetter = (ch) => {
    const m = pitchOf(ch);
    if (m == null) return;
    unlock();
    if (!muted) blip(midi(m), 0.28, 'sine', 0.14);
    const hue = ((m - 60) * 18 + 190) % 360;
    flashes.push({
      ch: ch.toUpperCase(),
      x: 0.15 + Math.random() * 0.7,
      y: 0.25 + Math.random() * 0.45,
      t: 0,
      hue,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.08 - Math.random() * 0.12,
      rot: (Math.random() - 0.5) * 0.4,
    });
  };

  const onKey = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Backspace') {
      typed = typed.slice(0, -1);
      preview.textContent = typed || 'Start typing…';
      preview.style.opacity = typed ? '1' : '0.55';
      e.preventDefault();
      return;
    }
    if (e.key.length === 1) {
      const ch = e.key;
      typed += ch;
      if (typed.length > 80) typed = typed.slice(-80);
      preview.textContent = typed;
      preview.style.opacity = '1';
      if (/^[a-z]$/i.test(ch)) playLetter(ch);
      else if (ch === ' ') {
        unlock();
        // soft rest click
        if (!muted) blip(110, 0.05, 'triangle', 0.04);
      }
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', onKey);
  cv.addEventListener('pointerdown', () => unlock());

  const loop = () => {
    fitCanvas(cv, root);
    const g = cv.g, W = cv.W, H = cv.H;
    // soft cream stage
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#f7f7f5');
    grad.addColorStop(1, '#e8eef2');
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    // faint staff lines
    g.strokeStyle = '#0a81c612';
    g.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = H * 0.38 + i * 14;
      g.beginPath(); g.moveTo(W * 0.12, y); g.lineTo(W * 0.88, y); g.stroke();
    }
    // flashes / trails
    for (const f of flashes) {
      f.t += 0.018;
      f.x += f.vx * 0.016;
      f.y += f.vy * 0.016;
      const life = Math.min(1, f.t);
      const fade = 1 - Math.max(0, f.t - 0.55) / 0.45;
      g.save();
      g.translate(f.x * W, f.y * H);
      g.rotate(f.rot * life);
      g.globalAlpha = Math.max(0, fade);
      g.fillStyle = `hsl(${f.hue} 70% 45%)`;
      g.font = `700 ${28 + life * 36}px Georgia, serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(f.ch, 0, 0);
      // trail dots
      g.fillStyle = `hsl(${f.hue} 80% 60% / 0.35)`;
      for (let k = 1; k <= 4; k++) {
        g.beginPath();
        g.arc(-f.vx * W * 0.04 * k, -f.vy * H * 0.04 * k, 3 - k * 0.4, 0, 7);
        g.fill();
      }
      g.restore();
    }
    while (flashes.length && flashes[0].t > 1) flashes.shift();
    if (!typed && flashes.length === 0) {
      g.fillStyle = '#0a81c655';
      g.font = '28px Georgia, serif';
      g.textAlign = 'center';
      g.fillText('Start typing…', W / 2, H * 0.48);
    }
    requestAnimationFrame(loop);
  };
  loop();

  root.append(bar, hint, preview);

  window.__demoProof = async () => {
    const before = { muted, typed };
    muted = false;
    typed = '';
    for (const ch of 'melody') playLetter(ch);
    typed = 'melody';
    preview.textContent = typed;
    await sleep(220);
    muted = true;
    playLetter('z');
    await sleep(80);
    muted = before.muted;
    typed = before.typed;
    flashes.length = 0;
    preview.textContent = typed || 'Start typing…';
    return 'A–Z pitch map + glyph flash + mute exercised, restored';
  };
};


V['plaza-vaporwave-radio-desk'] = (root, T) => {
  theme(root, T, { bg: '#1a1030', fg: '#e8e0f0', panel: '#c0c0c0', ac: '#ff71ce', dark: true, line: '#808080' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'MS Sans Serif', Tahoma, system-ui, sans-serif";
  root.style.background = '#0d0820';

  const TRACKS = [
    { title: 'Aisle 9 (Palm Leaves)', artist: '식료품groceries', dur: '3:42' },
    { title: 'リサフランク420', artist: 'Macintosh Plus', dur: '7:12' },
    { title: 'Private Caller', artist: 'Blank Banshee', dur: '3:05' },
    { title: 'Resonance', artist: 'HOME', dur: '3:32' },
    { title: '花の専門店', artist: 'マクロスMACROSS 82-99', dur: '4:01' },
    { title: 'Slow Dive', artist: 'Saint Pepsi', dur: '2:48' },
    { title: 'Breeze', artist: 'Eco Virtual', dur: '3:18' },
    { title: 'Night Temples', artist: '丹波', dur: '5:02' },
  ];
  let idx = 0, playing = false, vol = 0.45, listeners = 151;
  let tmr = null, pulse = 0;

  // vapor pixel backdrop (canvas)
  const bg = h('canvas', { style: { position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated', zIndex: 0 } });
  root.append(bg);
  const paintBg = () => {
    fitCanvas(bg, root);
    const g = bg.g, W = bg.W, H = bg.H;
    const grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, '#2a1848');
    grd.addColorStop(0.45, '#1a2840');
    grd.addColorStop(1, '#0a1828');
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    // dithered cliffs / waterfall suggestion
    for (let y = 0; y < H; y += 3) {
      for (let x = 0; x < W; x += 3) {
        const n = (Math.sin(x * 0.02 + y * 0.01) + Math.cos(x * 0.005 - y * 0.03)) * 0.5;
        const edge = Math.abs(x - W * 0.5) / W;
        if (n > 0.3 + edge * 0.4) {
          g.fillStyle = y < H * 0.45 ? '#3d2a5c' : '#1e3a3a';
          if ((x + y) % 6 === 0) g.fillStyle = y < H * 0.5 ? '#5a3d7a' : '#2a5050';
          g.fillRect(x, y, 3, 3);
        }
      }
    }
    // waterfall column
    g.fillStyle = '#9ad4e844';
    for (let y = H * 0.2; y < H * 0.85; y += 4) {
      g.fillRect(W * 0.48 + Math.sin(y * 0.08) * 6, y, 10, 4);
    }
    // pink rooftops
    g.fillStyle = '#c45c7a';
    [[0.22, 0.38], [0.28, 0.32], [0.7, 0.36], [0.76, 0.42]].forEach(([px, py]) => {
      g.fillRect(W * px, H * py, 28, 8);
      g.fillRect(W * px + 4, H * py - 10, 20, 10);
    });
  };
  paintBg();
  new ResizeObserver(paintBg).observe(root);

  const bevel = (raised = true) => raised
    ? 'border:2px solid;border-color:#fff #808080 #808080 #fff'
    : 'border:2px solid;border-color:#808080 #fff #fff #808080';

  const clock = h('span', {}, '');
  const tickClock = () => {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  tickClock(); setInterval(tickClock, 10000);

  const titleEl = h('div', { style: { fontWeight: 700, fontSize: '13px', color: '#000' } });
  const artistEl = h('div', { style: { fontSize: '11px', color: '#333', marginTop: '2px' } });
  const listenEl = h('div', { style: { fontSize: '11px', color: '#444', marginTop: '8px' } });
  const playBtn = h('button', {
    style: { padding: '4px 14px', ...Object.fromEntries([]), cursor: 'pointer', background: '#c0c0c0', fontSize: '12px', fontWeight: 700 },
  }, '▶ Play');
  playBtn.setAttribute('style', `padding:4px 14px;cursor:pointer;background:#c0c0c0;font-size:12px;font-weight:700;${bevel(true)}`);

  const art = h('div', {
    style: {
      width: '120px', height: '120px', background: 'linear-gradient(135deg,#ff71ce,#01cdfe 50%,#b967ff)',
      border: '2px solid #808080', flexShrink: 0, display: 'grid', placeItems: 'center',
      fontSize: '42px', color: '#fff8', textShadow: '0 0 12px #ff71ce',
    },
  }, '◈');

  const list = h('div', {
    style: { marginTop: '10px', maxHeight: '160px', overflow: 'auto', background: '#fff', ...Object.fromEntries([]), fontSize: '12px', color: '#000' },
  });
  list.setAttribute('style', 'margin-top:10px;max-height:160px;overflow:auto;background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;font-size:12px;color:#000');

  const volSl = h('input', { type: 'range', min: 0, max: 100, value: 45, style: { width: '90px', writingMode: 'vertical-lr', direction: 'rtl', height: '100px' } });

  const refresh = () => {
    const t = TRACKS[idx];
    titleEl.textContent = t.title;
    artistEl.textContent = t.artist + ' · ' + t.dur;
    listenEl.textContent = 'Listeners: ' + listeners;
    playBtn.textContent = playing ? '❚❚ Pause' : '▶ Play';
    list.replaceChildren(...TRACKS.map((tr, i) => h('div', {
      style: {
        padding: '4px 8px', cursor: 'pointer',
        background: i === idx ? '#000080' : (i % 2 ? '#f0f0f0' : '#fff'),
        color: i === idx ? '#fff' : '#000',
      },
      onclick: () => { idx = i; refresh(); if (playing) pulsePlay(); },
    }, `${i + 1}. ${tr.title} — ${tr.artist}`)));
  };

  const pulsePlay = () => {
    const t = TRACKS[idx];
    const base = 48 + (t.title.charCodeAt(0) % 12);
    blip(midi(base), 0.35 * vol, 'triangle', 0.08 * vol);
    blip(midi(base + 7), 0.45 * vol, 'sine', 0.05 * vol, 0.05);
    blip(midi(base + 12), 0.5 * vol, 'sawtooth', 0.03 * vol, 0.1);
  };

  const setPlaying = (on) => {
    playing = on;
    clearInterval(tmr);
    refresh();
    if (on) {
      pulsePlay();
      tmr = setInterval(() => {
        pulsePlay();
        listeners = 140 + ((listeners + 3) % 40);
        listenEl.textContent = 'Listeners: ' + listeners;
        pulse = (pulse + 1) % 8;
        art.style.filter = `hue-rotate(${pulse * 20}deg) brightness(1.05)`;
      }, 1600);
    } else {
      art.style.filter = '';
    }
  };
  playBtn.onclick = () => setPlaying(!playing);
  volSl.oninput = (e) => { vol = (+e.target.value) / 100; };

  const win = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)',
      width: 'min(520px, 92%)', background: '#c0c0c0', zIndex: 4,
      boxShadow: '4px 4px 0 #0006', border: '2px solid', borderColor: '#fff #808080 #808080 #fff',
    },
  });
  const titlebar = h('div', {
    style: {
      background: 'linear-gradient(90deg,#000080,#1084d0)', color: '#fff',
      padding: '3px 6px', display: 'flex', alignItems: 'center', gap: '8px',
      fontSize: '12px', fontWeight: 700, cursor: 'default',
    },
  },
    h('span', {}, '🌃 Nightwave Plaza-ish'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: `width:16px;height:14px;background:#c0c0c0;color:#000;text-align:center;line-height:12px;font-size:10px;${bevel(true)}` }, '_'),
    h('span', { style: `width:16px;height:14px;background:#c0c0c0;color:#000;text-align:center;line-height:12px;font-size:10px;${bevel(true)}` }, '□'),
    h('span', { style: `width:16px;height:14px;background:#c0c0c0;color:#000;text-align:center;line-height:12px;font-size:10px;${bevel(true)}` }, '×'),
  );
  const menu = h('div', {
    style: { display: 'flex', gap: '12px', padding: '2px 8px', fontSize: '12px', color: '#000', borderBottom: '1px solid #808080' },
  }, ...['About', 'Settings', 'Visuals', 'Station', 'IRC'].map((m) => h('span', { style: { cursor: 'default' } }, m)));

  const body = h('div', { style: { padding: '10px', display: 'flex', gap: '12px', color: '#000' } },
    art,
    h('div', { style: { flex: 1, minWidth: 0 } },
      titleEl, artistEl,
      h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' } },
        playBtn,
        h('button', {
          style: `padding:4px 10px;cursor:pointer;background:#c0c0c0;font-size:12px;${bevel(true)}`,
          onclick: () => { idx = (idx + 1) % TRACKS.length; refresh(); if (playing) pulsePlay(); },
        }, '♥ Fav'),
        h('button', {
          style: `padding:4px 10px;cursor:pointer;background:#c0c0c0;font-size:12px;${bevel(true)}`,
          onclick: () => { idx = (idx + 1) % TRACKS.length; refresh(); if (playing) pulsePlay(); },
        }, '⏭'),
      ),
      listenEl,
      list,
    ),
    h('div', { style: { display: 'grid', justifyItems: 'center', gap: '4px', fontSize: '11px', color: '#000' } },
      h('span', {}, '🔊'),
      volSl,
      h('span', {}, '45%'),
    ),
  );
  // fix volume label
  const volLbl = h('span', {}, '45%');
  volSl.oninput = (e) => { vol = (+e.target.value) / 100; volLbl.textContent = Math.round(vol * 100) + '%'; };
  body.lastChild.replaceChildren(h('span', {}, '🔊'), volSl, volLbl);

  win.append(titlebar, menu, body);

  const taskbar = h('div', {
    style: {
      position: 'absolute', left: 0, right: 0, bottom: 0, height: '28px', zIndex: 8,
      background: '#c0c0c0', borderTop: '2px solid #fff', display: 'flex', alignItems: 'center',
      gap: '4px', padding: '0 4px', color: '#000', fontSize: '12px',
    },
  },
    h('button', { style: `padding:2px 10px;font-weight:700;background:#c0c0c0;cursor:pointer;${bevel(true)}` }, 'Start'),
    h('button', { style: `padding:2px 10px;background:#c0c0c0;cursor:pointer;${bevel(false)}` }, 'Nightwave Plaza'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: `padding:2px 8px;${bevel(false)}` }, clock),
  );

  root.append(win, taskbar);
  refresh();

  window.__demoProof = async () => {
    const before = { idx, playing, vol };
    idx = 2; vol = 0.6; volSl.value = 60; volLbl.textContent = '60%';
    refresh();
    setPlaying(true);
    await sleep(300);
    idx = 4; refresh(); pulsePlay();
    await sleep(200);
    setPlaying(false);
    idx = before.idx; vol = before.vol; volSl.value = Math.round(vol * 100); volLbl.textContent = Math.round(vol * 100) + '%';
    refresh();
    return 'play/pause + track select + volume exercised, restored';
  };
};

V['muted-circle-of-fifths-desk'] = (root, T) => {
  theme(root, T, { bg: '#0e2a32', fg: '#e8f1f3', ac: '#f3b5c5', dark: true });
  root.style.fontFamily = 'Inter Variable,system-ui,sans-serif';
  root.style.overflow = 'hidden';

  // Circle of fifths order (clockwise from C)
  const MAJ = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯/G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F'];
  const MIN = ['Am', 'Em', 'Bm', 'F♯m', 'C♯m', 'G♯m', 'E♭m', 'B♭m', 'Fm', 'Cm', 'Gm', 'Dm'];
  const PC = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; // pitch class of each major key
  const SHARPS = ['', 'F♯', 'F♯ C♯', 'F♯ C♯ G♯', 'F♯ C♯ G♯ D♯', 'F♯ C♯ G♯ D♯ A♯', 'F♯ C♯ G♯ D♯ A♯ E♯', '', '', '', '', ''];
  const FLATS = ['', '', '', '', '', '', 'G♭ D♭ A♭ E♭ B♭ F♭', 'B♭ E♭ A♭ D♭ G♭', 'B♭ E♭ A♭ D♭', 'B♭ E♭ A♭', 'B♭ E♭', 'B♭'];
  const DEG = ['1', '2', '3', '4', '5', '6', '7', '1', '2', '3', '4', '5']; // outer ring labels relative — rebuilt per tonic
  const ROMAN_MAJ = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  const ROMAN_MIN = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
  // scale degree offsets in fifths-circle steps from tonic for diatonic chords
  // better: use semitone intervals from tonic
  const MAJ_IV = [0, 2, 4, 5, 7, 9, 11]; // major scale
  const MIN_IV = [0, 2, 3, 5, 7, 8, 10]; // natural minor

  let mode = 'major'; // major | minor
  let sel = 0; // index into MAJ (tonic of selected key on major circle)

  const noteName = (pc) => {
    const N = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
    return N[((pc % 12) + 12) % 12];
  };
  const keySig = (i) => {
    // i = steps clockwise from C
    if (i === 0) return 'no sharps / flats';
    if (i === 6) return '6 sharps (F♯) or 6 flats (G♭)';
    if (i < 6) return `${i} sharp${i > 1 ? 's' : ''} · ${SHARPS[i]}`;
    const f = 12 - i;
    return `${f} flat${f > 1 ? 's' : ''} · ${FLATS[i]}`;
  };
  const diatonic = () => {
    const rootPc = mode === 'major' ? PC[sel] : (PC[sel] + 9) % 12; // relative minor of selected major slice when in minor mode uses inner
    // When mode is major: tonic is MAJ[sel]; when minor: tonic is MIN[sel] (relative minor of that slice)
    const tonicPc = mode === 'major' ? PC[sel] : (PC[sel] + 9) % 12;
    const ivs = mode === 'major' ? MAJ_IV : MIN_IV;
    const romans = mode === 'major' ? ROMAN_MAJ : ROMAN_MIN;
    const quals = mode === 'major'
      ? ['', 'm', 'm', '', '', 'm', '°']
      : ['m', '°', '', 'm', 'm', '', ''];
    return romans.map((r, k) => {
      const pc = (tonicPc + ivs[k]) % 12;
      return { roman: r, name: noteName(pc) + quals[k], pc };
    });
  };
  const tonicLabel = () => (mode === 'major' ? MAJ[sel] : MIN[sel]);

  const playChord = (i, asMinor) => {
    const root = 48 + PC[i];
    const minor = asMinor ?? (mode === 'minor');
    [0, minor ? 3 : 4, 7].forEach((iv, k) => blip(midi(root + iv), 0.9, 'triangle', 0.07, k * 0.03));
  };

  // SVG wheel
  const svg = s('svg', { viewBox: '-280 -280 560 560', width: '100%', height: '100%', style: 'max-width:560px;max-height:560px;display:block;margin:0 auto' });

  const wedge = (i, r0, r1) => {
    const a0 = ((i - 0.5) / 12) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.5) / 12) * Math.PI * 2 - Math.PI / 2;
    const x0 = Math.cos(a0), y0 = Math.sin(a0), x1 = Math.cos(a1), y1 = Math.sin(a1);
    return `M${x0 * r0} ${y0 * r0}A${r0} ${r0} 0 0 1 ${x1 * r0} ${y1 * r0}L${x1 * r1} ${y1 * r1}A${r1} ${r1} 0 0 0 ${x0 * r1} ${y0 * r1}Z`;
  };
  const midA = (i) => (i / 12) * Math.PI * 2 - Math.PI / 2;

  // degree labels around outer ring relative to selected tonic
  const degreeAt = (i) => {
    // position i relative to sel
    const steps = (i - sel + 12) % 12;
    // map fifths-steps to scale degree is non-trivial; show chromatic relation labels used by muted: 1 at tonic, then around
    // Simplified: show roman for diatonic positions only
    const map = { 0: '1', 1: '5', 11: '4', 2: '2', 10: '♭7', 3: '6', 9: '♭3', 4: '3', 8: '♭6', 5: '7', 7: '♭2', 6: '♯4/♭5' };
    return map[steps] || '';
  };

  const draw = () => {
    const els = [];
    els.push(s('circle', { r: 268, fill: '#123840', stroke: '#1e4a54', 'stroke-width': 2 }));
    // outer degree ring
    for (let i = 0; i < 12; i++) {
      const lit = i === sel;
      els.push(s('path', {
        d: wedge(i, 255, 220),
        fill: lit ? '#1a5560' : '#0f333c',
        stroke: '#2a5a66', 'stroke-width': 1,
        style: 'cursor:pointer',
        onclick: () => { sel = i; draw(); playChord(i, mode === 'minor'); refreshSide(); },
      }));
      const a = midA(i);
      els.push(s('text', {
        x: Math.cos(a) * 237, y: Math.sin(a) * 237 + 4,
        'text-anchor': 'middle', fill: lit ? '#f3b5c5' : '#8fb8c2',
        'font-size': 11, 'font-weight': 600, 'pointer-events': 'none',
      }, degreeAt(i)));
    }
    // main major keys ring
    for (let i = 0; i < 12; i++) {
      const lit = i === sel;
      const fill = lit ? (mode === 'major' ? '#f3b5c5' : '#3d7a88') : (mode === 'major' ? '#1c4e5a' : '#163e48');
      els.push(s('path', {
        d: wedge(i, 218, 130),
        fill, stroke: '#2a5a66', 'stroke-width': 1.2,
        style: 'cursor:pointer',
        onclick: () => { sel = i; draw(); playChord(i, mode === 'minor'); refreshSide(); },
      }));
      const a = midA(i);
      const label = mode === 'major' ? MAJ[i] : MIN[i];
      els.push(s('text', {
        x: Math.cos(a) * 174, y: Math.sin(a) * 174 + 5,
        'text-anchor': 'middle', fill: lit && mode === 'major' ? '#1a2a30' : '#e8f1f3',
        'font-size': label.length > 3 ? 13 : 16, 'font-weight': 700, 'pointer-events': 'none',
      }, label));
    }
    // inner relative ring
    for (let i = 0; i < 12; i++) {
      const lit = i === sel;
      const fill = lit ? (mode === 'minor' ? '#f3b5c5' : '#2a6270') : '#124049';
      els.push(s('path', {
        d: wedge(i, 128, 72),
        fill, stroke: '#2a5a66', 'stroke-width': 1,
        style: 'cursor:pointer',
        onclick: () => { sel = i; mode = mode === 'major' ? 'minor' : mode; /* keep selection */ draw(); playChord(i, true); refreshSide(); },
      }));
      const a = midA(i);
      const label = mode === 'major' ? MIN[i] : MAJ[i];
      els.push(s('text', {
        x: Math.cos(a) * 100, y: Math.sin(a) * 100 + 4,
        'text-anchor': 'middle', fill: lit && mode === 'minor' ? '#1a2a30' : '#b7d4db',
        'font-size': 11, 'font-weight': 600, 'pointer-events': 'none',
      }, label));
    }
    els.push(s('circle', { r: 70, fill: '#0e2a32', stroke: '#2a5a66', 'stroke-width': 2 }));
    els.push(s('text', { y: -6, 'text-anchor': 'middle', fill: '#f3b5c5', 'font-size': 13, 'font-weight': 700 }, 'tonic'));
    els.push(s('text', { y: 14, 'text-anchor': 'middle', fill: '#fff', 'font-size': 18, 'font-weight': 800 }, tonicLabel()));
    svg.replaceChildren(...els);
  };

  const sideTitle = h('div', { style: { fontSize: '22px', fontWeight: 800, letterSpacing: '-.02em' } });
  const sideSig = h('div', { style: { fontSize: '13px', opacity: .75, marginTop: '4px' } });
  const sideChords = h('div', { style: { display: 'grid', gap: '6px', marginTop: '14px' } });
  const refreshSide = () => {
    sideTitle.textContent = tonicLabel() + (mode === 'major' ? ' major' : '');
    sideSig.textContent = 'Key signature · ' + keySig(sel);
    const ch = diatonic();
    sideChords.replaceChildren(...ch.map((c) => h('button', {
      style: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a5a66',
        background: '#123840', color: '#e8f1f3', cursor: 'pointer', fontSize: '13px',
      },
      onclick: () => {
        const root = 48 + c.pc;
        const minor = /m|°/.test(c.name) && !/^[A-G]♯?$/.test(c.name.replace('°',''));
        const isDim = c.name.includes('°');
        const isMin = c.name.endsWith('m') || isDim;
        [0, isDim ? 3 : isMin ? 3 : 4, isDim ? 6 : 7].forEach((iv, k) => blip(midi(root + iv), 0.7, 'triangle', 0.06, k * 0.025));
      },
    }, h('span', { style: { color: '#f3b5c5', fontWeight: 700, width: '36px' } }, c.roman), h('span', { style: { fontWeight: 600 } }, c.name))));
  };

  const modeSeg = h('div', { style: { display: 'flex', gap: '0', background: '#123840', borderRadius: '10px', padding: '3px', border: '1px solid #2a5a66' } });
  const paintMode = () => {
    modeSeg.replaceChildren(
      ...[['major', 'Major (Ionian)'], ['minor', 'Minor (Aeolian)']].map(([v, l]) => h('button', {
        style: {
          flex: 1, padding: '8px 10px', border: 0, borderRadius: '8px', cursor: 'pointer',
          background: mode === v ? '#f3b5c5' : 'transparent',
          color: mode === v ? '#1a2a30' : '#8fb8c2', fontWeight: 700, fontSize: '12px',
        },
        onclick: () => { mode = v; draw(); refreshSide(); },
      }, l)),
    );
  };

  const header = h('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 20px',
      borderBottom: '1px solid #1e4a54', background: '#0c242c',
    },
  },
    h('div', { style: { width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #f3b5c5', display: 'grid', placeItems: 'center', fontSize: '12px', color: '#f3b5c5', fontWeight: 800 } }, '^^'),
    h('b', { style: { fontSize: '15px', letterSpacing: '.02em' } }, 'muted'),
    h('span', { style: { opacity: .45, fontSize: '13px' } }, '·'),
    h('span', { style: { fontSize: '13px', opacity: .8 } }, 'Circle of Fifths'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '11px', opacity: .5 } }, 'music theory chart'),
  );

  const stage = h('div', {
    style: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', padding: '18px 24px', height: 'calc(100% - 48px)', boxSizing: 'border-box' },
  },
    h('div', { style: { display: 'grid', gridTemplateRows: 'auto 1fr', gap: '12px', minHeight: 0 } },
      h('div', {},
        h('div', { style: { fontSize: '26px', fontWeight: 800, letterSpacing: '-.03em', marginBottom: '8px' } }, 'Interactive Circle of Fifths'),
        paintMode(),
      ),
      h('div', { style: { display: 'grid', placeItems: 'center', minHeight: 0 } }, svg),
    ),
    h('div', {
      style: {
        background: '#123840', border: '1px solid #2a5a66', borderRadius: '14px',
        padding: '16px', overflow: 'auto', alignSelf: 'stretch',
      },
    },
      h('div', { style: { fontSize: '11px', letterSpacing: '.14em', color: '#f3b5c5', fontWeight: 700 } }, 'SELECTED KEY'),
      sideTitle, sideSig,
      h('div', { style: { fontSize: '11px', letterSpacing: '.14em', color: '#8fb8c2', fontWeight: 700, marginTop: '16px' } }, 'DIATONIC CHORDS'),
      sideChords,
      h('div', { style: { fontSize: '11px', opacity: .5, marginTop: '14px', lineHeight: 1.5 } }, 'Click a key to select tonic. Outer ring = scale degrees · main ring = keys · inner = relatives.'),
    ),
  );

  // fix modeSeg - paintMode mutates modeSeg; need to call before append
  paintMode();
  // rebuild stage left header row properly
  stage.firstChild.firstChild.replaceChildren(
    h('div', { style: { fontSize: '26px', fontWeight: 800, letterSpacing: '-.03em', marginBottom: '8px' } }, 'Interactive Circle of Fifths'),
    modeSeg,
  );

  root.append(header, stage);
  draw();
  refreshSide();

  window.__demoProof = async () => {
    const before = { mode, sel };
    mode = 'major'; sel = 3; // A major
    draw(); refreshSide(); playChord(3, false);
    await sleep(200);
    mode = 'minor'; draw(); refreshSide(); playChord(3, true);
    await sleep(150);
    mode = before.mode; sel = before.sel;
    draw(); refreshSide();
    return 'selected A major → toggled Aeolian → restored';
  };
};

// ---------- Teenage Engineering OP–1 field product page (2026-10-05 12:00 KST)
V['te-op1-field-product-page'] = (root, T) => {
  theme(root, T, { bg: '#cfd0d2', fg: '#111', ac: '#e8452c', dark: false, line: '#00000018' });
  const SANS = "'Inter Variable', 'Helvetica Neue', Arial, sans-serif";
  root.style.background = '#cfd0d2'; root.style.color = '#111'; root.style.fontFamily = SANS; root.style.overflowY = 'auto';
  root.append(h('style', {}, `
    .te-nav{display:flex;align-items:flex-start;gap:38px;padding:10px 46px 0;color:#8d8e91;font-weight:300;height:84px}
    .te-nav .brand{font:300 19px/22px ${SANS};color:#8a8b8e;width:110px}
    .te-nav .it{display:flex;gap:10px;cursor:pointer}.te-nav .it:hover{color:#333}.te-nav .it:hover svg{stroke:#333}
    .te-nav .it b{display:block;font:300 18px/20px ${SANS};margin-bottom:8px}.te-nav .it small{display:block;font:300 9.5px/10.5px ${SANS};letter-spacing:.01em}
    .te-nav svg{stroke:#8d8e91;fill:none;stroke-width:1.1}
    .te-jp{font:300 7.5px/9.5px ${SANS};width:66px;color:#8d8e91}
    .te-h{text-align:center;font:400 34px/1 ${SANS};letter-spacing:-.01em;margin:40px 0 50px;color:#111}
    .te-dev{width:446px;margin:0 auto 80px;background:linear-gradient(90deg,#b9bbbe,#d8d9db 6%,#c8c9cc 50%,#d6d7d9 94%,#b5b7ba);border-radius:12px;padding:16px;box-shadow:0 40px 60px -30px #0006,inset 0 0 0 1px #ffffff80,0 0 0 1px #9c9ea2;display:grid;grid-template-columns:repeat(6,64px);grid-auto-rows:64px;gap:4px;position:relative}
    .te-k{background:#cfccc6;border-radius:6px;box-shadow:inset 0 0 0 1px #00000014,0 1px 0 #fff8;display:grid;place-items:center;cursor:pointer;position:relative;user-select:none}
    .te-k::after{content:'';position:absolute;inset:7px;border-radius:50%;background:radial-gradient(circle at 50% 35%,#e3e1dc,#c9c6c0 70%);box-shadow:0 3px 4px #0003,inset 0 -2px 2px #0001}
    .te-k span{position:relative;z-index:1;font:300 15px ${SANS};color:#333}
    .te-k.on::after,.te-k:active::after{transform:translateY(2px) scale(.97);box-shadow:0 1px 1px #0003;background:radial-gradient(circle at 50% 40%,#d8d5cf,#bfbcb6 70%)}
    .te-k.red span{color:#d43a22;font-size:20px}
    .te-k.pill::after{inset:9px 7px;border-radius:30px}
    .te-k.flat::after{border-radius:8px}
    .te-spk{grid-column:span 2;grid-row:span 2;background:radial-gradient(circle,#4a4a4a 1.4px,transparent 1.8px) 0 0/9px 9px,#cfccc6;border-radius:6px;background-clip:content-box;padding:12px;box-shadow:inset 0 0 0 1px #00000014;background-origin:content-box}
    .te-knob{display:grid;place-items:center;background:#cfccc6;border-radius:6px;cursor:ns-resize}
    .te-knob i{width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff,#e8e8e8 40%,#bbb 90%);box-shadow:0 4px 6px #0004,inset 0 0 0 1px #0001;position:relative}
    .te-knob i::after{content:'';position:absolute;left:50%;top:5px;width:2px;height:9px;margin-left:-1px;background:#888;border-radius:2px}
    .te-blk{background:#cfccc6;border-radius:6px;display:grid;place-items:center;cursor:pointer}.te-blk i{width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 45% 35%,#333,#050505 70%);box-shadow:0 3px 5px #0006}
    .te-blk.on i{transform:scale(.94);background:#222}
    .te-scr{grid-column:span 2;grid-row:span 2;background:#050505;border-radius:4px;border:6px solid #cfccc6;overflow:hidden}
    .te-scr canvas{width:100%;height:100%;display:block}
    .te-spec{max-width:900px;margin:0 auto 120px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#b4b5b8;border:1px solid #b4b5b8}
    .te-spec div{background:#cfd0d2;padding:22px 20px;font:300 13px/1.5 ${SANS};color:#444}.te-spec b{display:block;font:400 22px/1.1 ${SANS};color:#111;margin-bottom:8px}
    .te-cap{text-align:center;font:300 13px ${SANS};color:#666;margin:-60px 0 60px}
    .te-big{text-align:center;font:200 120px/1 ${SANS};letter-spacing:-.04em;margin:0 0 40px;color:#111}
  `));
  const ico = (d, w = 30, hh = 56) => s('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}` }, ...d);
  const navItem = (svgEl, title, ...sub) => h('div.it', {}, svgEl, h('div', {}, h('b', {}, title), h('small', {}, ...sub.flatMap((x) => [x, h('br')]))));
  root.append(h('div.te-nav', {}, h('div.brand', {}, 'teenage', h('br'), 'engineering'),
    navItem(ico([s('circle', { cx: 10, cy: 9, r: 6 }), s('circle', { cx: 20, cy: 9, r: 6 }), s('circle', { cx: 10, cy: 19, r: 6 }), s('circle', { cx: 20, cy: 19, r: 6 }), s('line', { x1: 15, y1: 14, x2: 15, y2: 56 })]), 'products', 'instruments', 'audio', 'designs'),
    navItem(ico([s('rect', { x: 2, y: 2, width: 26, height: 50 }), s('path', { d: 'M2 12h26M8 2v10M22 2v10' })]), 'store', 'visit store', 'cart & checkout', 'deals'),
    navItem(ico([s('rect', { x: 1, y: 1, width: 56, height: 56 }), s('rect', { x: 6, y: 6, width: 46, height: 46 })], 58, 58), 'latest', 'newsletter', 'instagram', 'now'),
    navItem(ico([s('path', { d: 'M2 2l22 22M2 14h12M14 2v12' }), s('rect', { x: 30, y: 2, width: 22, height: 22, fill: '#8d8e91' }), s('circle', { cx: 14, cy: 42, r: 10 }), s('circle', { cx: 42, cy: 42, r: 11, 'stroke-dasharray': '2 2' })], 56, 56), 'finder', 'guides & downloads', 'support', 'search'),
    h('div.te-jp', {}, '10代工学は未来の製品とコミュニケーションを生み出すスタジオです。私たちのミッションは高品質なデザインの製品を作り出すことです。'),
    h('div', { style: { marginLeft: 'auto' } }, s('svg', { width: 130, height: 64, viewBox: '0 0 130 64', fill: 'none', stroke: '#8d8e91', 'stroke-width': 1.1 }, s('path', { d: 'M4 20h26v-14h18v14h10v14h-10v24h-18v-24h-26z' }), s('path', { d: 'M86 4l26 0 14 28-14 28h-26l-14-28z' }), s('circle', { cx: 99, cy: 32, r: 10 })))));
  root.append(h('div.te-h', {}, 'the beauty of evolution.'));
  // device: keys grid (portrait, like the hero render)
  const cv = h('canvas', { width: 260, height: 260 });
  let enc = 12, rec = false, playing = false, tape = [], t0 = 0, lastNote = -1, lvl = 0, mode = 'DELAY';
  const note = (n) => { const f = 220 * Math.pow(2, n / 12); blip(f, 0.4 + enc / 60, 'triangle', 0.12); blip(f * 2.003, 0.25, 'sine', 0.04); lastNote = n; lvl = 1; if (rec) tape.push([performance.now() - t0, n]); };
  const K = (label, cls = '', on) => h('div.te-k' + (cls ? '.' + cls : ''), { onpointerdown: (e) => { e.currentTarget.classList.add('on'); on && on(); }, onpointerup: (e) => e.currentTarget.classList.remove('on'), onpointerleave: (e) => e.currentTarget.classList.remove('on') }, h('span', {}, label));
  const recKey = K('●', 'red', () => { rec = !rec; if (rec) { tape = []; t0 = performance.now(); } toast(rec ? 'tape: recording' : `tape: ${tape.length} notes`); });
  const playKey = K('▼', '', () => playback());
  const stopKey = K('■', '', () => { rec = false; playing = false; });
  const playback = async () => { if (!tape.length || playing) return; playing = true; const st = performance.now(); for (const [t, n] of tape) { const w = t - (performance.now() - st); if (w > 0) await sleep(w); if (!playing) break; const f = 220 * Math.pow(2, n / 12); blip(f, 0.4, 'triangle', 0.12); lastNote = n; lvl = 1; } playing = false; };
  const knob = h('div.te-knob', {}, h('i'));
  let ky = 0, ke = 0; drag(knob, { start: (e) => { ky = e.clientY; ke = enc; }, move: (ev) => { enc = clamp(Math.round(ke + (ky - ev.clientY) / 4), 0, 99); knob.firstChild.style.transform = `rotate(${enc * 3.3}deg)`; } });
  knob.addEventListener('wheel', (e) => { e.preventDefault(); enc = clamp(enc + (e.deltaY < 0 ? 1 : -1), 0, 99); knob.firstChild.style.transform = `rotate(${enc * 3.3}deg)`; }, { passive: false });
  const WK = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19];
  const blkFor = { 0: 1, 1: 3, 3: 6, 4: 8, 5: 10, 7: 13, 8: 15 };
  const dev = h('div.te-dev', {},
    K('↑'), recKey, K('|→'), K('∫∫'), h('div.te-spk'),
    K('↓'), playKey, K('|←'), K('⊙'),
    K('shift', '', () => { mode = mode === 'DELAY' ? 'FREQ' : 'DELAY'; }), stopKey, K('✂'), K('oo'), K('(o)'), knob);
  const blackKey = (n) => h('div.te-blk', { onpointerdown: (e) => { e.currentTarget.classList.add('on'); note(n); }, onpointerup: (e) => e.currentTarget.classList.remove('on') }, h('i'));
  const white = (n, span = 2) => { const el = K('', 'pill', () => note(n)); el.style.gridColumn = `span ${span}`; return el; };
  // keyboard rows (rotated piano): white pill + black dot + function keys / screen
  const rows = WK.map((n, r) => { const kids = [white(n)]; kids.push(blkFor[r] != null ? blackKey(blkFor[r]) : h('div', { style: { background: '#cfccc6', borderRadius: '6px' } })); if (r === 0) kids.push(K('≡'), K('◁'), K('▢', 'flat')); else if (r === 1) kids.push(K('—'), h('div.te-scr', {}, cv)); else if (r === 2) kids.push(K('◇')); else kids.push(K(['', '1', '2', '3', '4', 'T1', 'T2', 'T3', 'T4'][r - 2] || ''), K(['', '', '', 'M1', 'M2', '♪', '⌁', '◎', '✦'][r - 2] || ''), K('')); return kids; });
  rows.forEach((k) => dev.append(...k));
  root.append(dev, h('div.te-cap', {}, 'click the keys or play A W S E D F T G Y H U J K · drag the white encoder · ● record ▼ play ■ stop · shift toggles the screen'));
  root.append(h('div.te-big', {}, 'op–1 field'), h('div.te-spec', {}, ...[['synthesizer', 'multiple synth engines with a dedicated encoder per parameter.'], ['sampler', 'record anything through the built-in mic or line input.'], ['tape', 'a four-track tape machine with cut, lift and drop.'], ['sequencers', 'pattern, arpeggio and finger-style sequencers.'], ['fm radio', 'tune in, sample and resample the air.'], ['portable', 'aluminium unibody, built-in speaker and battery.']].map(([t, d]) => h('div', {}, h('b', {}, t), d))));
  const KEYMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12 };
  const onKey = (e) => { if (!root.isConnected) return removeEventListener('keydown', onKey); const n = KEYMAP[e.key]; if (n != null && !e.repeat) note(n); };
  addEventListener('keydown', onKey);
  const g = cv.getContext('2d');
  const draw = (ts) => { if (!root.isConnected) return; g.fillStyle = '#050505'; g.fillRect(0, 0, 260, 260); g.save(); g.translate(130, 130); g.rotate(-Math.PI / 2); g.translate(-130, -130);
    g.font = "300 20px 'Inter Variable'"; g.fillStyle = '#f39a2b'; g.fillText(mode, 18, 40); g.font = "200 64px 'Inter Variable'"; g.fillStyle = '#e9e9e9'; g.fillText(String(enc).padStart(2, '0'), 18, 104);
    g.strokeStyle = '#3aa6ff'; g.lineWidth = 3; g.beginPath(); g.arc(196, 62, 30, Math.PI * .75, Math.PI * .75 + (enc / 99) * Math.PI * 1.5); g.stroke(); g.strokeStyle = '#333'; g.beginPath(); g.arc(196, 62, 22, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#3aa6ff'; g.font = "300 12px 'Inter Variable'"; g.fillText(mode === 'DELAY' ? 'FREQ' : 'DELAY', 176, 112);
    lvl *= 0.94; g.strokeStyle = '#e9e9e9'; g.lineWidth = 1.5; g.beginPath(); for (let x = 0; x < 230; x++) { const y = 190 + Math.sin(x * (0.06 + (lastNote + 1) * 0.008) + ts / 160) * (6 + lvl * 34) * Math.sin(x / 230 * Math.PI); x ? g.lineTo(15 + x, y) : g.moveTo(15, y); } g.stroke();
    g.fillStyle = rec ? '#ff3b2f' : '#444'; g.beginPath(); g.arc(232, 236, 6, 0, 7); g.fill(); g.fillStyle = '#888'; g.font = "300 11px 'Inter Variable'"; g.fillText(`tape ${tape.length}${playing ? ' ▶' : ''}`, 18, 240);
    g.restore(); requestAnimationFrame(draw); };
  requestAnimationFrame(draw);
  window.__demoProof = async () => { const e0 = enc; [0, 4, 7, 12].forEach((n, i) => setTimeout(() => note(n), i * 60)); await sleep(300); enc = 40; await sleep(120); enc = e0; tape = []; rec = false; return `played C-E-G-C on the keyboard, encoder ${e0}→40→${e0}, tape cleared`; };
};


// ---------- musicForProgramming(); monospace terminal episode player (2026-10-05 16:00 KST)
V['mfp-terminal-music-player'] = (root, T) => {
  theme(root, T, { bg: '#1a1a1a', fg: '#cfcfcf', ac: '#2bd9a3', dark: true });
  const MONO = "'JetBrains Mono Variable', 'IBM Plex Mono', ui-monospace, monospace";
  root.style.background = '#1a1a1a'; root.style.color = '#cfcfcf'; root.style.fontFamily = MONO; root.style.minHeight = 'calc(100vh - 38px)';
  root.append(h('style', {}, `
    .mfp{display:grid;grid-template-columns:230px 1fr 230px;gap:36px;padding:34px 36px 60px;font:400 12.5px/18px ${MONO};letter-spacing:-.01em}
    .mfp a,.mfp .ln{cursor:pointer;text-decoration:none}
    .mfp .kw{color:#3aa0ff;font-style:italic}.mfp .fn{color:#2bd9a3}.mfp .ar{color:#ff8a3d;font-style:italic}.mfp .st{color:#e3d34a}.mfp .rt{color:#c04bd8}.mfp .pu{color:#a26bff}.mfp .dim{color:#7d7d7d}
    .mfp .rule{color:#2bd9a3;margin:80px 0 16px;letter-spacing:-.12em;overflow:hidden;white-space:nowrap}
    .mfp .ln:hover{background:#cfcfcf;color:#1a1a1a!important}
    .mfp .ctl .ln{display:inline-block}
    .mfp .bl{color:#3aa0ff}.mfp .or{color:#ff8a3d}.mfp .pk{color:#e04ba0}
    .mfp h1{font:200 44px/50px ${MONO};margin:0 0 34px;color:#d8d8d8;letter-spacing:-.02em}
    .mfp .tl div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .mfp .eps div{color:#2bd9a3;font-style:italic;white-space:nowrap}
    .mfp .eps div.cur{color:#a26bff}
    .mfp .bar{color:#555;letter-spacing:-.05em;margin:2px 0 12px;user-select:none;cursor:pointer;white-space:nowrap;overflow:hidden}
    .mfp .bar b{color:#2bd9a3;font-weight:400}
    .mfp .cur-blink::after{content:'_';animation:mfpb 1s steps(1) infinite}@keyframes mfpb{50%{opacity:0}}
    .mfp.inv{filter:invert(1) hue-rotate(180deg)}
  `));
  const EPS = ['Corticyte', 'Datassette', 'Phonaut', 'Material Object', 'Datassette', 'NCW', '[ln]anace', 'Freddy Cyclone', 'Neon Genesis', 'THINGS DISAPPEAR', 'Pearl River Sound', 'no data available', 'Datassette', 'Conrad Clipper', 'Matt Whitehead', 'Strepsil', 'T-FLX', 'Our Grey Lives', 'Linnley', 'TUNDRA', 'Miunau', 'OliSUn', 'Hainbach', 'Forest Drive West', '20 Jazz Funk Greats', 'HLER', 'Beb Welten', 'Inchindown', 'Mücha', 'Misc.', 'Julien Mier', 'Michael Hicks', 'Abe Mangger', 'Jo Johnson'];
  const EP79 = ['아버지 - reflection', 'Thomas Köner - Untitled', 'Francisco López - Untitled #218', 'Tod Dockstader - Tremblar', 'Thomas Köner - Novaya Zemlya 1', 'Jana Winderen - Energy Field (excerpt)', 'William Basinski - Watermusic (excerpt)', 'Pete Namlook & Tetsu Inoue - 62 Eulengasse', 'Harold Budd - As long as I can hold my breath', 'Judo Notomi Goro Yamaguchi - Shakuhachi (excerpt)', 'corticyte - VR1 (excerpt)', 'Andrew Chalk - Crescent', 'Gas - Untitled', 'Laraaji - Meditation #1 (excerpt)', 'Yasmin Hannah King - Slumber', 'Iasos - The Royal Court of Goddess Vesta (excerpt)', 'Electric Indigo - Ferrum 1_2', 'Fenn O\'Berg - Part I', 'Fennesz - Black Sea', 'Aphex Twin - red calx (slo)', 'Pub - Summer', 'St. GIGA - 山岳湿原・昼のまどろみ'];
  const POOL = EP79.map((x) => x.split(' - ')[0]);
  const TITLES = ['Untitled', 'Drift', 'Signal Path', 'Low Tide', 'Interior', 'Tape Loop 3', 'Halflight', 'Field (excerpt)', 'Morning Static', 'Glass', 'Ritual', 'Night Bus'];
  const tracksFor = (n) => { if (n === 79) return EP79; const r = rng(n * 977); return Array.from({ length: 12 + Math.floor(r() * 9) }, () => `${pick(POOL, r)} - ${pick(TITLES, r)}`); };
  const durFor = (n) => n === 79 ? 4 * 3600 : 3600 + Math.floor(rng(n * 31)() * 5400);
  const fmt = (t) => [Math.floor(t / 3600), Math.floor(t / 60) % 60, Math.floor(t) % 60].map((x) => String(x).padStart(2, '0')).join(':').replace(/^0/, '');
  let ep = 79, pos = 0, playing = false, vol = +(localStorage.getItem('mfp-vol') ?? 0.6), fav = new Set(JSON.parse(localStorage.getItem('mfp-fav') || '[]'));
  const L = (cls, txt, fn) => h('span.ln.' + cls, { onclick: fn }, txt);
  const left = h('div', {},
    h('div', {}, h('span.kw', {}, 'function'), ' ', h('span.fn', {}, 'musicFor'), '(', h('span.ar', {}, 'task'), ' = ', h('span.st', {}, "'programming'"), ') { ', h('span.rt', {}, 'return'), ' ', h('span.pu', {}, '`A series of mixes intended for listening while ${'), 'task', h('span.pu', {}, '} to focus the brain and inspire the mind.`'), '; }'),
    h('div.rule', {}, '_'.repeat(60)));
  const timeLine = h('div.dim', {}), barEl = h('div.bar', {});
  const ctl = h('div.ctl', {},
    h('div', {}, L('dim', '[-30]', () => seek(-30)), ' ', L('dim', '[+30]', () => seek(30)), ' ', L('dim', '[vol-]', () => setVol(vol - 0.1)), ' ', L('dim', '[vol+]', () => setVol(vol + 0.1))),
    timeLine, barEl,
    h('div', {}, L('pu', '[random]', () => load(1 + Math.floor(Math.random() * 79), true))), h('br'),
    h('div', {}, L('bl', '[about]', () => toast('a series of mixes for focus · clone demo')), ' ', L('bl', '[credits]', () => toast('credits: Datassette & guests')), ' ', L('bl', '[rss.xml]', () => toast('rss link copied (demo)'))),
    h('div', {}, L('or', '[patreon]', () => toast('patreon (demo)')), ' ', L('or', '[podcasts.apple]', () => toast('podcasts (demo)'))),
    h('div', {}, L('pk', '[folder.jpg]', () => toast('folder.jpg (demo)')), ' ', L('pk', '[enterprise mode]', () => { wrap.classList.toggle('ent'); toast('enterprise mode: ' + (wrap.classList.contains('ent') ? 'on' : 'off')); })),
    h('div', {}, L('pk', '[invert]', () => wrap.classList.toggle('inv')), ' ', L('pk', '[fullscreen]', () => (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen?.()))), h('br'),
    h('div.dim', {}, '// 79 episodes'), h('div.dim', {}, '// 1380 tracks'), h('div.dim', {}, '// 120 hours'), h('div.dim', {}, '// 25 minutes'), h('div.dim', {}, '// 11 seconds'));
  left.append(ctl);
  const title = h('h1'), meta = h('div', { style: { marginBottom: '22px' } }), tl = h('div.tl');
  const mid = h('div', {}, title, meta, tl);
  const eps = h('div.eps');
  const wrap = h('div.mfp', {}, left, mid, eps);
  root.append(wrap);
  // generative ambient drone stands in for the mp3 stream
  let ac, master, voices = [];
  const startAudio = () => { ac = audio(); if (!ac) return; master = ac.createGain(); master.gain.value = vol * 0.12; master.connect(ac.destination); const r = rng(ep * 13); const root0 = 55 * Math.pow(2, Math.floor(r() * 12) / 12);
    voices = [1, 1.5, 2, 3, 4.01].map((m, i) => { const o = ac.createOscillator(); const g = ac.createGain(); const lfo = ac.createOscillator(); const lg = ac.createGain(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = root0 * m; g.gain.value = 0.2 / (i + 1); lfo.frequency.value = 0.05 + r() * 0.2; lg.gain.value = 0.15 / (i + 1); lfo.connect(lg).connect(g.gain); o.connect(g).connect(master); o.start(); lfo.start(); return [o, lfo]; }); };
  const stopAudio = () => { voices.forEach(([o, l]) => { try { o.stop(); l.stop(); } catch {} }); voices = []; master?.disconnect(); };
  const setVol = (v) => { vol = clamp(Math.round(v * 10) / 10, 0, 1); localStorage.setItem('mfp-vol', vol); if (master) master.gain.value = vol * 0.12; toast(`volume ${Math.round(vol * 100)}%`); render(); };
  const seek = (d) => { pos = clamp(pos + d, 0, durFor(ep)); render(); };
  const toggle = () => { playing = !playing; playing ? startAudio() : stopAudio(); render(); };
  const load = (n, autoplay = false) => { stopAudio(); ep = n; pos = 0; playing = false; if (autoplay) toggle(); else render(); };
  const render = () => {
    title.textContent = `Episode ${ep}: ${EPS[79 - ep] || 'Datassette'}`;
    const d = durFor(ep);
    meta.replaceChildren(
      h('div', {}, L('fn', playing ? '[pause]' : '[play]', toggle), ' ', h('span.dim' + (playing ? '.cur-blink' : ''), {}, playing ? `${fmt(pos)} / ${fmt(d)}` : fmt(d))),
      h('div', {}, L('pu', '[source]', () => toast(`episode ${ep} mp3 (demo)`)), ' ', h('span.dim', {}, `${Math.round(d / 34)} MB`)),
      h('div', {}, L('st', fav.has(ep) ? '[unfavourite]' : '[favourite]', () => { fav.has(ep) ? fav.delete(ep) : fav.add(ep); localStorage.setItem('mfp-fav', JSON.stringify([...fav])); render(); })));
    tl.replaceChildren(...tracksFor(ep).map((t) => h('div', {}, t)));
    const pct = pos / d, n = 30, k = Math.round(pct * n);
    barEl.replaceChildren(h('b', {}, '#'.repeat(k)), '-'.repeat(n - k));
    timeLine.textContent = `${fmt(pos).padStart(8, '-')} [vol ${String(Math.round(vol * 100)).padStart(3, ' ')}%] ${playing ? '>>>>' : '....'}`;
    eps.replaceChildren(...Array.from({ length: 79 }, (_, i) => 79 - i).map((n) => h('div.ln' + (n === ep ? '.cur' : ''), { onclick: () => load(n, true) }, `${n}: ${EPS[79 - n] || ['Datassette', 'Misc.', 'Silent Servant', 'Uchu', 'Hivemind'][n % 5]}${fav.has(n) ? ' *' : ''}`)));
  };
  barEl.addEventListener('click', (e) => { const r = barEl.getBoundingClientRect(); pos = clamp((e.clientX - r.left) / r.width, 0, 1) * durFor(ep); render(); });
  const tick = setInterval(() => { if (!root.isConnected) { clearInterval(tick); stopAudio(); return; } if (playing) { pos = Math.min(pos + 1, durFor(ep)); render(); } }, 1000);
  const onKey = (e) => { if (!root.isConnected) return removeEventListener('keydown', onKey); if (e.code === 'Space') { e.preventDefault(); toggle(); } if (e.key === 'ArrowLeft') seek(-30); if (e.key === 'ArrowRight') seek(30); };
  addEventListener('keydown', onKey);
  render();
  window.__demoProof = async () => { load(62); await sleep(50); seek(30); seek(30); const p = pos; load(79); return `loaded ep 62 (${tl.children.length} tracks), +30 +30 → ${p}s, back to ep 79 with ${tracksFor(79).length} tracks, volume ${vol}`; };
};

V['mynoise-ten-band-spectrum-slider-mixer-presets-animate'] = (root, T) => {
  import('@fontsource-variable/inter'); import('@fontsource-variable/jetbrains-mono');
  theme(root, T, { bg: '#0a1a1e', fg: '#e8f4f6', ac: '#5ec8d8', dark: true });
  const F = "'Inter Variable',system-ui,sans-serif", M = "'JetBrains Mono Variable',monospace";
  const BANDS = ['Sub-bass', 'Bass', 'Low Mid', 'Mid', 'Upper Mid', 'Presence', 'Brilliance', 'Air', 'Sparkle', 'High Treble'];
  const COLORS = ['#8B5A2B', '#E53935', '#FB8C00', '#FDD835', '#43A047', '#26C6DA', '#29B6F6', '#1E88E5', '#8E24AA', '#CE93D8'];
  const PRESETS = {
    'Distant Storm': [0.72, 0.68, 0.55, 0.42, 0.35, 0.28, 0.22, 0.18, 0.12, 0.08],
    'Fairy Rain': [0.25, 0.35, 0.45, 0.55, 0.62, 0.72, 0.78, 0.85, 0.9, 0.88],
    'Brown': [0.85, 0.7, 0.5, 0.3, 0.18, 0.1, 0.06, 0.04, 0.02, 0.01],
    'Pink': [0.7, 0.65, 0.58, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2],
    'White': [0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45],
    'Bedroom': [0.4, 0.5, 0.55, 0.48, 0.4, 0.32, 0.25, 0.18, 0.12, 0.08],
    'Jungle Lodge': [0.35, 0.42, 0.5, 0.55, 0.6, 0.55, 0.45, 0.35, 0.28, 0.22],
  };
  let vals = Array(10).fill(0.45), playing = true, anim = false, bellArmed = false, bellSec = 60, tip = '', status = 'Now playing Rain Noise';
  let nodes = null, animId = 0;
  const tipEl = h('div'), statusEl = h('div'), bellBadge = h('span'), meters = [];
  css(`.mn{position:absolute;inset:0;overflow:auto;font:400 13px/1.4 ${F};color:#e8f4f6;background:#061218}
.mn-bg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 20%,#1a3a42 0%,#061218 70%);opacity:1}
.mn-bg canvas{width:100%;height:100%;opacity:.45;mix-blend-mode:screen}
.mn-stage{position:relative;z-index:1;padding:28px 24px 40px;max-width:980px;margin:0 auto}
.mn h1{margin:0 0 18px;text-align:center;font:300 42px/1 ${F};letter-spacing:.04em}
.mn-sliders{display:flex;justify-content:center;gap:14px;padding:10px 0 6px}
.mn-band{display:flex;flex-direction:column;align-items:center;gap:8px;width:52px}
.mn-rail{position:relative;width:14px;height:160px;border-radius:99px;background:rgba(255,255,255,.12);backdrop-filter:blur(6px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.mn-fill{position:absolute;left:2px;right:2px;bottom:2px;border-radius:99px;transition:height .35s ease}
.mn-knob{position:absolute;left:50%;width:22px;height:22px;margin-left:-11px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 12px currentColor,0 2px 6px #0008;cursor:ns-resize;touch-action:none}
.mn-lab{font:500 9px ${M};opacity:.7;text-align:center;letter-spacing:-.02em;height:28px}
.mn-tip{position:fixed;z-index:20;pointer-events:none;background:#0a2028ee;border:1px solid #5ec8d855;padding:4px 10px;border-radius:6px;font:600 11px ${M};color:#9ee;opacity:0;transition:opacity .15s}
.mn-tip.on{opacity:1}
.mn-btns{display:flex;justify-content:center;gap:10px;margin:14px 0 8px}
.mn-btns button{width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.12);color:#fff;cursor:pointer;font-size:15px;position:relative;transition:background .2s,opacity .2s}
.mn-btns button:hover{background:rgba(255,255,255,.22)}
.mn-btns button.dim{opacity:.35}
.mn-btns button .bdg{position:absolute;right:-4px;top:-4px;min-width:16px;height:16px;border-radius:8px;background:#5ec8d8;color:#042;font:700 9px/16px ${M};padding:0 4px}
.mn-status{text-align:center;font:400 12px ${M};color:#8ecad4;min-height:18px;margin-bottom:22px}
.mn-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.mn-card{background:rgba(8,28,34,.72);backdrop-filter:blur(10px);border-radius:14px;padding:18px 20px;border:1px solid rgba(94,200,216,.12)}
.mn-card h3{margin:0 0 10px;font:600 12px ${M};color:#5ec8d8;letter-spacing:.08em;text-transform:uppercase}
.mn-card a{display:inline-block;color:#7ad4e4;font:500 12px ${M};margin:2px 8px 2px 0;cursor:pointer;text-decoration:none}
.mn-card a:hover{color:#c8f4ff;text-decoration:underline}
.mn-card h2{margin:0 0 10px;font:500 22px ${F}}
.mn-card p{margin:0 0 10px;opacity:.78;line-height:1.55;font-size:13.5px}
.mn-card li{margin:4px 0;opacity:.78}
.mn.paused .mn-fill{height:0!important;transition:height .45s ease}
.mn.paused .mn-knob{bottom:2px!important}`);
  // rain streaks canvas bg
  const bgCv = h('canvas'); const bgWrap = h('div.mn-bg', {}, bgCv);
  const paintRain = () => { const r = root.getBoundingClientRect(); bgCv.width = r.width | 0; bgCv.height = r.height | 0; const g = bgCv.getContext('2d'); g.clearRect(0, 0, bgCv.width, bgCv.height); const R = rng(3); for (let i = 0; i < 90; i++) { const x = R() * bgCv.width, y = R() * bgCv.height, len = 20 + R() * 60; g.strokeStyle = `rgba(140,200,210,${.08 + R() * .18})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2, y + len); g.stroke(); } };
  const ensureAudio = () => { const ac = audio(); if (!ac || nodes) return; nodes = vals.map((v, i) => { const src = noiseSrc(i < 3 ? 'brown' : 'white'); const flt = ac.createBiquadFilter(); flt.type = i < 4 ? 'lowpass' : i > 6 ? 'highpass' : 'bandpass'; flt.frequency.value = [80, 160, 320, 640, 1280, 2500, 5000, 8000, 12000, 16000][i]; flt.Q.value = 0.7; const gain = ac.createGain(); gain.gain.value = playing ? v * 0.08 : 0; src.connect(flt).connect(gain).connect(ac.destination); src.start(); return { gain }; }); };
  const applyGains = () => { if (!nodes) return; nodes.forEach((n, i) => { n.gain.gain.setTargetAtTime(playing ? vals[i] * 0.08 : 0, audio().currentTime, 0.05); }); };
  const setVal = (i, v, animate = false) => { vals[i] = clamp(v, 0, 1); const fill = meters[i].fill, knob = meters[i].knob; const pct = vals[i] * 100; if (animate) { fill.style.transition = 'height .55s cubic-bezier(.4,0,.2,1)'; knob.style.transition = 'bottom .55s cubic-bezier(.4,0,.2,1)'; } else { fill.style.transition = playing ? 'height .08s' : 'height .45s'; knob.style.transition = 'none'; } fill.style.height = `calc(${pct}% - 4px)`; fill.style.background = `linear-gradient(to top,${COLORS[i]}99,${COLORS[i]})`; knob.style.bottom = `calc(${pct}% - 11px)`; knob.style.color = COLORS[i]; knob.style.background = COLORS[i]; applyGains(); };
  const morphTo = async (arr, label) => { status = label; statusEl.textContent = status; for (let step = 0; step <= 12; step++) { const t = step / 12; vals = vals.map((v, i) => v + (arr[i] - v) * (t === 0 ? 0 : 0.28)); vals.forEach((v, i) => setVal(i, v, true)); await sleep(40); } vals = arr.slice(); vals.forEach((v, i) => setVal(i, v, true)); };
  const bands = BANDS.map((lab, i) => {
    const fill = h('div.mn-fill'); const knob = h('div.mn-knob');
    const rail = h('div.mn-rail', {}, fill, knob);
    meters[i] = { fill, knob, rail };
    let dragging = false;
    const fromY = (clientY) => { const r = rail.getBoundingClientRect(); setVal(i, 1 - (clientY - r.top) / r.height); tip = `${lab} · ${Math.round(vals[i] * 100)}%`; tipEl.textContent = tip; tipEl.classList.add('on'); tipEl.style.left = (r.left + r.width / 2) + 'px'; tipEl.style.top = (clientY - 28) + 'px'; };
    rail.addEventListener('pointerdown', (e) => { dragging = true; ensureAudio(); try { rail.setPointerCapture(e.pointerId); } catch {} fromY(e.clientY); });
    rail.addEventListener('pointermove', (e) => { if (dragging) fromY(e.clientY); });
    rail.addEventListener('pointerup', () => { dragging = false; tipEl.classList.remove('on'); });
    return h('div.mn-band', {}, rail, h('div.mn-lab', {}, lab));
  });
  const setPlaying = (on) => { playing = on; wrap.classList.toggle('paused', !playing); status = playing ? 'Now playing Rain Noise' : 'Press Play to resume'; statusEl.textContent = status; applyGains(); playBtn.textContent = playing ? '❚❚' : '▶'; [...btns.children].forEach((b, i) => { if (i !== 0) b.classList.toggle('dim', !playing); }); };
  const playBtn = h('button', { title: 'Play/Pause (P)', onclick: () => { ensureAudio(); setPlaying(!playing); } }, '❚❚');
  const btns = h('div.mn-btns', {},
    playBtn,
    h('button', { title: 'Reset', onclick: () => { vals = Array(10).fill(0.45); vals.forEach((v, i) => setVal(i, v, true)); status = 'Reset to 45%'; statusEl.textContent = status; } }, '↺'),
    h('button', { title: 'Save', onclick: () => toast('mix saved (demo)') }, '↓'),
    h('button', { title: 'Load', onclick: () => toast('load mix (demo)') }, '↑'),
    h('button', { title: 'Slider Animation (A)', onclick: () => { anim = !anim; status = anim ? 'Sliders are on the move…' : 'Animation off'; statusEl.textContent = status; } }, '▅'),
    h('button', { title: 'Width', onclick: () => toast('Stereo Width (demo)') }, '⇔'),
    h('button', { title: 'Meditation Bell (L)', onclick: () => { bellArmed = !bellArmed; bellSec = 60; bellBadge.style.display = bellArmed ? 'block' : 'none'; bellBadge.textContent = bellSec; status = bellArmed ? 'Bell armed · 1 min' : 'Bell disarmed'; statusEl.textContent = status; } }, '🔔', (bellBadge.className = 'bdg', bellBadge.style.display = 'none', bellBadge)),
    h('button', { title: 'Timer', onclick: () => toast('Timer (demo)') }, '⏱'),
  );
  statusEl.className = 'mn-status'; statusEl.textContent = status;
  tipEl.className = 'mn-tip';
  const presetLinks = Object.keys(PRESETS).map((name) => h('a', { onclick: () => { ensureAudio(); morphTo(PRESETS[name], `Preset · ${name}`); } }, name));
  const left = h('div.mn-card', {},
    h('h3', {}, 'Presets'), h('div', {}, ...presetLinks),
    h('h3', { style: { marginTop: '16px' } }, 'Stereo Width'), h('div', {}, ...['Mono', 'Narrow', 'Normal', 'Wide'].map((t) => h('a', { onclick: () => toast(t) }, t))),
    h('h3', { style: { marginTop: '16px' } }, 'Tape Speed'), h('div', {}, ...['Slower', 'Faster', 'Alternate', 'Reset'].map((t) => h('a', { onclick: () => toast('Tape · ' + t) }, t))),
    h('h3', { style: { marginTop: '16px' } }, 'Animation Parameters'), h('div', {}, ...['Soft', 'Hard', 'Solo', 'x½', 'x1', 'x2', 'x4', 'x8'].map((t) => h('a', { onclick: () => toast('Anim · ' + t) }, t))),
    h('h3', { style: { marginTop: '16px' } }, 'Save & Share'), h('div', {}, ...['URL', 'Browser', 'Mini-player', 'iEQ', 'Shortcuts', 'Meditation'].map((t) => h('a', { onclick: () => toast(t) }, t))),
  );
  const right = h('div.mn-card', {},
    h('h2', {}, 'Experience the Sound, Stay Dry'),
    h('p', {}, 'Ten spectral bands sculpt rain from Sub-bass rumble to High Treble sparkle. Drag a handle to hear the band tip; presets morph the whole row.'),
    h('ul', {}, h('li', {}, 'Improve focus and concentration'), h('li', {}, 'Enhance sleep quality'), h('li', {}, 'Reduce stress and anxiety')),
  );
  const wrap = h('div.mn', {}, bgWrap, h('div.mn-stage', {},
    h('h1', {}, 'Rain Noise'),
    h('div.mn-sliders', {}, ...bands),
    btns, statusEl,
    h('div.mn-cols', {}, left, right),
  ), tipEl);
  root.append(wrap);
  vals.forEach((v, i) => setVal(i, v));
  paintRain(); new ResizeObserver(paintRain).observe(root);
  const tick = () => { animId = requestAnimationFrame(tick); if (!root.isConnected) return cancelAnimationFrame(animId);
    if (anim && playing) { const t = performance.now() / 1000; vals = vals.map((v, i) => clamp(v + Math.sin(t * 0.7 + i * 0.9) * 0.004, 0.05, 0.95)); vals.forEach((v, i) => setVal(i, v)); }
    if (bellArmed) { bellSec = Math.max(0, bellSec - 1 / 60); bellBadge.textContent = Math.ceil(bellSec); if (bellSec <= 0) { bellArmed = false; bellBadge.style.display = 'none'; blip(880, 1.2, 'sine', 0.12); status = 'Meditation bell'; statusEl.textContent = status; } }
  }; tick();
  const onKey = (e) => { if (!root.isConnected) return removeEventListener('keydown', onKey); if (e.key === 'p' || e.key === 'P') { ensureAudio(); setPlaying(!playing); } if (e.key === 'a' || e.key === 'A') { anim = !anim; status = anim ? 'Sliders are on the move…' : 'Animation off'; statusEl.textContent = status; } if (e.key === 'l' || e.key === 'L') btns.children[6].click(); };
  addEventListener('keydown', onKey);
  window.__demoProof = async () => { const out = []; ensureAudio(); const snap = vals.slice();
    await morphTo(PRESETS['Distant Storm'], 'Preset · Distant Storm'); out.push(`Distant Storm → [${vals.map((v) => v.toFixed(2)).join(',')}]`);
    await morphTo(PRESETS['Fairy Rain'], 'Preset · Fairy Rain'); out.push(`Fairy Rain tip mid=${vals[5].toFixed(2)}`);
    setVal(3, 0.9); tip = 'Mid · 90%'; out.push(`drag Mid → ${vals[3].toFixed(2)}`);
    setPlaying(false); out.push(`pause collapsed=${wrap.classList.contains('paused')} status="${status}"`);
    setPlaying(true); anim = true; status = 'Sliders are on the move…'; statusEl.textContent = status; await sleep(120); out.push(`anim=${anim}`);
    anim = false; vals = snap; vals.forEach((v, i) => setVal(i, v, true)); status = 'Now playing Rain Noise'; statusEl.textContent = status;
    return out.join('; ') + '; restored'; };
};

V['nightride-crt-scanline-eq-station-rail-milkdrop-tabs'] = (root, T) => {
  import('@fontsource/vt323'); import('@fontsource/press-start-2p'); import('@fontsource-variable/inter');
  theme(root, T, { bg: '#120818', fg: '#f0e6ff', ac: '#e040fb', dark: true });
  const PIXEL = "'VT323',monospace", CHROME = "'Press Start 2P',monospace", F = "'Inter Variable',system-ui,sans-serif";
  const TABS = ['EQ', 'Milkdrop', 'Video', 'Station', 'Chat', 'Archive'];
  const STATIONS = [
    { id: 'nightride', name: 'NIGHTRIDE', track: 'Protagonyst — Under Witches Spell' },
    { id: 'chillsynth', name: 'CHILLSYNTH', track: 'HOME — Resonance' },
    { id: 'datawave', name: 'DATAWAVE', track: 'POWERNERD — Remote (feat Oscar)' },
    { id: 'spacesynth', name: 'SPACESYNTH', track: 'Lazerhawk — Overdrive' },
    { id: 'darksynth', name: 'DARKSYNTH', track: 'Carpenter Brut — Turbo Killer' },
    { id: 'horrorsynth', name: 'HORRORSYNTH', track: 'Gost — Ascension' },
    { id: 'ebsm', name: 'EBSM', track: 'Perturbator — Future Club' },
    { id: 'archives', name: 'ARCHIVES', track: 'Silicon Heaven · 2024-11-02' },
  ];
  const ARCH = [['2024-11-02', 'Silicon Heaven Vol.12'], ['2024-08-18', 'Night Drive Mixtape'], ['2024-03-01', 'CRT Dreams Live'], ['2023-12-24', 'Holiday Synth Special']];
  let tab = 'EQ', station = 0, playing = true, vol = 0.7, bars = Array(10).fill(0.5);
  css(`.nr{position:absolute;inset:0;overflow:hidden;font:400 18px/1.2 ${PIXEL};color:#e8d4ff;background:#0a0610}
.nr-crt{position:absolute;inset:0;pointer-events:none;z-index:8;background:repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.18) 2px 3px),radial-gradient(ellipse at center,transparent 55%,#000a 100%);mix-blend-mode:multiply}
.nr-grain{position:absolute;inset:0;opacity:.08;pointer-events:none;z-index:7;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")}
.nr-shell{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;padding:18px 28px 24px}
.nr-head{display:flex;align-items:center;justify-content:center;gap:16px;position:relative;margin-top:8px}
.nr-logo{font:700 28px ${CHROME};letter-spacing:.08em;background:linear-gradient(180deg,#fff,#c0c0c0 40%,#888 55%,#eee 70%,#aaa);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 12px #e040fb88);cursor:pointer;user-select:none}
.nr-play{width:36px;height:36px;border-radius:50%;border:2px solid #e040fb;background:#e040fb22;color:#e040fb;display:grid;place-items:center;cursor:pointer;font-size:14px}
.nr-now{text-align:center;margin:8px 0 14px;font:400 20px ${PIXEL};color:#c070e0;letter-spacing:.04em;min-height:24px}
.nr-ico{position:absolute;right:0;top:4px;display:flex;gap:12px;font-size:18px;opacity:.8;cursor:pointer}
.nr-tabs{display:flex;gap:0;border-bottom:2px solid #6a2a7a;position:relative}
.nr-tab{padding:8px 18px;cursor:pointer;color:#8a6a9a;font:400 20px ${PIXEL};letter-spacing:.06em;border:2px solid transparent;border-bottom:0;margin-bottom:-2px;transition:color .15s,border-color .15s,background .15s}
.nr-tab.on{color:#f0d0ff;border-color:#c060e0;background:linear-gradient(#1a0a22,#120818);border-radius:6px 6px 0 0}
.nr-panel{flex:1;min-height:0;border:2px solid #c060e0;border-top:0;background:#100818ee;position:relative;overflow:hidden;display:flex;flex-direction:column}
.nr-eq{flex:1;display:flex;align-items:flex-end;justify-content:center;gap:14px;padding:40px 40px 50px}
.nr-bar{width:42px;height:100%;max-height:280px;border:1px solid #fff6;border-radius:2px;position:relative;background:#1a0a2288;overflow:hidden}
.nr-bar i{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(to top,#e040fb,#9c27b0 55%,#ce93d8);box-shadow:0 0 16px #e040fb88;transition:height .08s linear}
.nr-station{overflow:auto;padding:8px 0}
.nr-row{padding:12px 28px;cursor:pointer;border-bottom:1px solid #ffffff08;transition:background .15s}
.nr-row:hover,.nr-row.on{background:#e040fb18}
.nr-row b{display:block;font:700 16px ${CHROME};letter-spacing:.06em;font-size:13px;color:#f0e0ff}
.nr-row span{font:400 18px ${PIXEL};color:#a070c0}
.nr-milk{flex:1;position:relative;min-height:0}
.nr-milk canvas{width:100%;height:100%;display:block}
.nr-vid{flex:1;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,#3a1048,#100818);color:#c070e0;font:400 22px ${PIXEL}}
.nr-chat{flex:1;padding:16px 24px;font:400 18px ${PIXEL};color:#b090d0;overflow:auto}
.nr-arch{flex:1;padding:12px 0;overflow:auto}
.nr-arch div{padding:10px 28px;display:flex;gap:18px;cursor:pointer;border-bottom:1px solid #ffffff08}
.nr-arch div:hover{background:#e040fb14}
.nr-vol{position:absolute;right:60px;top:8px;width:80px;accent-color:#e040fb}`);
  const nowEl = h('div.nr-now');
  const playBtn = h('div.nr-play', { onclick: () => { playing = !playing; playBtn.textContent = playing ? '❚❚' : '▶'; } }, '❚❚');
  const volSl = h('input.nr-vol', { type: 'range', min: 0, max: 100, value: 70, oninput: (e) => { vol = +e.target.value / 100; } });
  const head = h('div.nr-head', {},
    playBtn,
    h('div.nr-logo', { onclick: () => toast('NIGHTRIDE FM') }, 'NIGHTRIDE FM'),
    h('div.nr-ico', {}, h('span', { title: 'volume' }, '🔊'), volSl, h('span', { title: 'settings', onclick: () => toast('settings (demo)') }, '⚙')),
  );
  const tabEls = TABS.map((t) => h('div.nr-tab', { onclick: () => setTab(t) }, t));
  const tabs = h('div.nr-tabs', {}, ...tabEls);
  const eqBars = bars.map(() => h('div.nr-bar', {}, h('i')));
  const eqView = h('div.nr-eq', {}, ...eqBars);
  const stationView = h('div.nr-station');
  const milkCv = h('canvas'); const milkView = h('div.nr-milk', {}, milkCv);
  const vidView = h('div.nr-vid', {}, '▶ VIDEO STREAM · synthwave visuals');
  const chatView = h('div.nr-chat', {}, ...['<system> welcome to nightride chat', '<neonfox> this drop is fire', '<crt_kid> milkdrop or eq tonight?', '<datawave> station hop → DATAWAVE'].map((l) => h('div', {}, l)));
  const archView = h('div.nr-arch', {}, ...ARCH.map(([d, t]) => h('div', { onclick: () => { nowEl.textContent = t; toast(t); } }, h('span', { style: { color: '#8060a0', minWidth: '110px' } }, d), h('b', {}, t))));
  const panel = h('div.nr-panel', {}, eqView);
  const views = { EQ: eqView, Milkdrop: milkView, Video: vidView, Station: stationView, Chat: chatView, Archive: archView };
  const refreshStations = () => {
    stationView.replaceChildren(...STATIONS.map((s, i) => h('div.nr-row' + (i === station ? '.on' : ''), {
      onclick: () => { station = i; nowEl.textContent = s.track; refreshStations(); if (playing) blip(220 + i * 40, 0.15, 'sawtooth', 0.04 * vol); toast('?station=' + s.id); },
    }, h('b', {}, s.name), h('span', {}, s.track))));
  };
  const setTab = (t) => { tab = t; tabEls.forEach((el, i) => el.classList.toggle('on', TABS[i] === t)); panel.replaceChildren(views[t]); if (t === 'Station') refreshStations(); if (t === 'Milkdrop') paintMilk(true); };
  const paintMilk = (force) => {
    if (tab !== 'Milkdrop' && !force) return;
    const r = milkView.getBoundingClientRect(); if (r.width < 10) return;
    milkCv.width = r.width | 0; milkCv.height = r.height | 0;
    const g = milkCv.getContext('2d'), W = milkCv.width, H = milkCv.height, t = performance.now() / 1000;
    g.fillStyle = '#0a0410'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) { const cx = W * (.3 + .1 * Math.sin(t + i)), cy = H * (.4 + .15 * Math.cos(t * .7 + i)); const grd = g.createRadialGradient(cx, cy, 0, cx, cy, 80 + i * 30); grd.addColorStop(0, `hsla(${280 + i * 25} 90% 60% / .55)`); grd.addColorStop(1, 'hsla(300 80% 40% / 0)'); g.fillStyle = grd; g.fillRect(0, 0, W, H); }
    g.strokeStyle = '#e040fb88'; g.beginPath(); for (let x = 0; x < W; x += 4) { const y = H / 2 + Math.sin(x * 0.02 + t * 3) * 40 * (0.4 + bars[x % 10]); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  };
  nowEl.textContent = STATIONS[station].track;
  const shell = h('div.nr-shell', {}, head, nowEl, tabs, panel);
  root.append(h('div.nr', {}, shell, h('div.nr-grain'), h('div.nr-crt')));
  setTab('EQ'); refreshStations();
  let acGain = null;
  const pulse = () => {
    if (!root.isConnected) return;
    if (playing) { bars = bars.map((b, i) => clamp(0.15 + Math.abs(Math.sin(performance.now() / 180 + i * 0.7)) * (0.35 + vol * 0.55) + (i === station % 10 ? 0.15 : 0), 0.08, 0.98)); eqBars.forEach((el, i) => { el.firstChild.style.height = (bars[i] * 100) + '%'; }); if (tab === 'Milkdrop') paintMilk(); }
    requestAnimationFrame(pulse);
  }; pulse();
  window.__demoProof = async () => { const out = []; const s0 = station, t0 = tab, p0 = playing;
    setTab('Station'); stationView.children[2].click(); out.push(`station → ${STATIONS[station].id} now="${nowEl.textContent}"`);
    setTab('EQ'); await sleep(80); out.push(`EQ bars mid=${bars.map((b) => b.toFixed(2)).join(',')}`);
    setTab('Milkdrop'); await sleep(100); paintMilk(true); out.push(`Milkdrop canvas=${milkCv.width}x${milkCv.height}`);
    setTab('Archive'); out.push(`Archive rows=${archView.children.length}`);
    playing = false; playBtn.textContent = '▶'; await sleep(40); playing = true; playBtn.textContent = '❚❚';
    station = s0; setTab(t0); nowEl.textContent = STATIONS[station].track; refreshStations(); playing = p0;
    return out.join('; ') + '; restored'; };
};

V['groovepizza-radial-slice-sequencer-shape-polygon-sliders'] = (root, T) => {
  import('@fontsource/lato/300.css'); import('@fontsource/lato/400.css'); import('@fontsource/lato/700.css'); import('@fontsource/lato/900-italic.css');
  theme(root, T, { bg: '#3d2e7f', fg: '#fff', ac: '#6fff64', dark: true });
  const L = "'Lato',system-ui,sans-serif";
  const CX = 859, CY = 330, RH = 40, R1 = 137, R2 = 224, R3 = 310, RB = 325;
  const RING = [{ name: 'snare', r0: RH, r1: R1, col: '#6fff64', dk: '#3fbf3a', fill: ['#a4d6ca', '#b2e8db'] }, { name: 'hat', r0: R1, r1: R2, col: '#ffd84a', dk: '#d1a400', fill: ['#93d2c3', '#9fe3d3'] }, { name: 'kick', r0: R2, r1: R3, col: '#42fff3', dk: '#1fbfb6', fill: ['#7dccb9', '#88ddc8'] }];
  const blank = (n) => [Array(n).fill(0), Array(n).fill(0), Array(n).fill(0)];
  const mk = (n, a, b, c) => { const g = blank(n); a.forEach((i) => (g[0][i] = 1)); b.forEach((i) => (g[1][i] = 1)); c.forEach((i) => (g[2][i] = 1)); return g; };
  const DEF = () => mk(16, [3, 9, 12], [], [0, 14]);
  const PRESETS = [DEF(), mk(16, [4, 12], [0, 2, 4, 6, 8, 10, 12, 14], [0, 10]), mk(16, [4, 12], [2, 6, 10, 14], [0, 3, 6, 8, 11, 14]), mk(16, [6, 14], [0, 4, 8, 12], [0, 6, 10])];
  let slots = PRESETS.map((g) => g.map((r) => r.slice())), slot = 0, grid = slots[0], N = 16;
  const P = { volume: 80, bpm: 120, swing: 0, slices: 16 };
  const RANGE = { volume: [0, 100], bpm: [40, 190], swing: [0, 100], slices: [4, 16] };
  let playing = false, step = -1, nextT = 0, timer = null, phase = 0, t0 = 0;
  css(`.gp{position:absolute;inset:0;overflow:hidden;background:#3d2e7f;font-family:${L};color:#fff;user-select:none}
.gp-stage{position:absolute;left:0;top:0;height:900px;transform-origin:0 0}
.gp-stars{position:absolute;inset:0}
.gp-rail{position:absolute;left:0;top:0;width:120px;height:710px;background:#4d38a0}
.gp-rail hr{position:absolute;left:0;right:0;top:139px;margin:0;border:0;border-top:1.5px solid #fff}
.gp-rb{position:absolute;left:20px;width:80px;height:80px;border-radius:50%;background:#3d2e7f;display:grid;place-items:center;font:400 15px ${L};cursor:pointer;transition:background .15s}
.gp-rb:hover,.gp-rb.on{background:#33266d}
.gp-logo{position:absolute;left:18px;top:18px;width:76px;height:76px}
.gp-wm{position:absolute;left:24px;top:91px;font:900 italic 21px/0.82 ${L};letter-spacing:-.02em;text-shadow:0 1px 0 #3d2e7f}
.gp-wm i{display:block;padding-left:29px;font-size:17px}
.gp-pop{position:absolute;left:126px;width:250px;background:#4d38a0;border-radius:12px;padding:12px;display:none;grid-template-columns:repeat(3,1fr);gap:8px;box-shadow:0 10px 30px #0006;z-index:5}
.gp-pop.on{display:grid}.gp-pop div{background:#3d2e7f;border-radius:8px;padding:8px 4px;text-align:center;font:400 12px ${L};cursor:pointer}.gp-pop div:hover{background:#6359c1}
.gp-svg{position:absolute;left:0;top:0;overflow:visible}
.gp-mid{position:absolute;top:0;left:calc(50% - 720px);width:1440px;height:900px;pointer-events:none}.gp-mid>*{pointer-events:auto}.gp-mid>svg{pointer-events:none}.gp-mid>svg *{pointer-events:auto}
.gp-dot{cursor:pointer}
.gp-sl{position:absolute;top:738px;width:40px;height:152px;background:#5845c4;cursor:ns-resize;touch-action:none}
.gp-sl i{position:absolute;left:0;right:0;bottom:0;background:#6359c1}
.gp-sl b{position:absolute;left:0;right:0;top:-31px;text-align:center;font:300 20px ${L}}
.gp-sl span{position:absolute;left:11px;bottom:8px;writing-mode:vertical-rl;transform:rotate(180deg);font:300 15px ${L};letter-spacing:.02em;pointer-events:none}
.gp-cb{position:absolute;left:210px;width:60px;height:60px;border-radius:50%;background:#6359c1;display:grid;place-items:center;cursor:pointer}
.gp-play{position:absolute;left:565px;top:784px;width:110px;height:110px;border-radius:50%;background:#6359c1;display:grid;place-items:center;cursor:pointer;transition:transform .1s}
.gp-play:active{transform:scale(.96)}
.gp-grid{position:absolute;left:680px;top:661px;width:480px;height:115px;background:#2c2563}
.gp-pats{position:absolute;left:680px;top:776px;width:480px;height:124px;background:#2c2563;display:flex}
.gp-pat{width:120px;height:124px;display:grid;place-items:center;cursor:pointer}
.gp-pat.on{background:#6359c1}
.gp-pat div{width:80px;height:80px;border-radius:50%;background:#716dbf;display:grid;place-items:center}`);
  const stage = h('div.gp-stage');
  const wrap = h('div.gp', {}, stage);
  root.append(wrap);
  // starfield
  const stars = h('canvas.gp-stars');
  const paintStars = (W) => { stars.width = W; stars.height = 900; const g = stars.getContext('2d'); const r = rng(7); g.fillStyle = '#fff'; for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * 900, s0 = r(); g.globalAlpha = 0.35 + r() * 0.6; g.beginPath(); g.arc(x, y, s0 < 0.85 ? 0.8 : s0 < 0.97 ? 1.4 : 2.8, 0, 7); g.fill(); if (s0 > 0.955 && s0 < 0.985) { g.fillRect(x - 5, y - 0.5, 10, 1); g.fillRect(x - 0.5, y - 5, 1, 10); } } g.globalAlpha = 1; };
  stage.append(stars);
  // rail
  const logo = s('svg', { class: 'gp-logo', viewBox: '0 0 76 76' }, s('defs', {}, s('radialGradient', { id: 'gpl', cx: '45%', cy: '40%', r: '60%' }, s('stop', { offset: 0, 'stop-color': '#b9f3ee' }), s('stop', { offset: 1, 'stop-color': '#39c6c0' }))), s('circle', { cx: 38, cy: 38, r: 37, fill: 'url(#gpl)' }), s('path', { d: 'M38 12 L60 26 L58 52 L36 64 L16 50 L18 24 Z', fill: '#7fe0d8', opacity: .8 }), s('path', { d: 'M38 24 L50 31 L49 46 L37 52 L26 45 L27 31 Z', fill: '#d8fbf8' }), s('circle', { cx: 8, cy: 0, r: 3, fill: '#fff' }), s('circle', { cx: 24, cy: 9, r: 3, fill: '#fff' }), s('circle', { cx: 58, cy: 27, r: 2.5, fill: '#fff' }), s('circle', { cx: 20, cy: 51, r: 2.5, fill: '#fff' }));
  const pop = h('div.gp-pop');
  const rb = (y, label, on) => h('div.gp-rb', { style: { top: y + 'px' }, onclick: on }, label);
  const SHAPES = [['Triangle', 3], ['Square', 4], ['Pentagon', 5], ['Hexagon', 6], ['Octagon', 8], ['Line', 2]];
  const SPECIALS = [['Boom bap', 1], ['Bossa', 2], ['Four floor', 3], ['Clear', -1]];
  let popKind = null;
  const openPop = (kind, y) => { if (popKind === kind) { pop.classList.remove('on'); popKind = null; return; } popKind = kind; pop.style.top = y + 'px'; pop.classList.add('on');
    pop.replaceChildren(...(kind === 'shapes' ? SHAPES.map(([n, k]) => h('div', { onclick: () => { applyShape(selRing, k); pop.classList.remove('on'); popKind = null; } }, polyIcon(k), h('div', {}, n))) : SPECIALS.map(([n, i]) => h('div', { onclick: () => { if (i < 0) grid.forEach((r) => r.fill(0)); else loadGroove(PRESETS[i]); render(); pop.classList.remove('on'); popKind = null; } }, n)))); };
  const polyIcon = (k) => { const pts = Array.from({ length: k }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / k; return `${15 + 11 * Math.cos(a)},${15 + 11 * Math.sin(a)}`; }).join(' '); return s('svg', { viewBox: '0 0 30 30', width: 30, height: 30 }, k === 2 ? s('line', { x1: 15, y1: 4, x2: 15, y2: 26, stroke: '#6fff64', 'stroke-width': 3 }) : s('polygon', { points: pts, fill: '#6fff64' })); };
  const share = s('svg', { viewBox: '0 0 72 72', width: 72, height: 72, style: 'position:absolute;inset:0' }, s('path', { d: 'M36 36 L36 0 A36 36 0 1 0 72 36 Z', fill: '#3d2e7f' }), s('path', { d: 'M46 26 L60 12 M52 10 L62 10 L62 20', stroke: '#3d2e7f', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }), ...[[14, 20], [30, 16], [20, 36], [12, 50], [32, 56]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 2.2, fill: '#5845c4' })));
  const shareBtn = h('div.gp-rb', { style: { top: '334px', left: '24px', width: '72px', height: '72px', background: 'transparent', position: 'absolute' }, onclick: () => { copy(location.href); toast('Share link copied'); } }, share, h('span', { style: { position: 'relative', fontSize: '15px', marginTop: '30px' } }, 'Share'));
  stage.append(h('div.gp-rail', {}, logo, h('div.gp-wm', {}, 'groove', h('i', {}, 'pizza')), h('hr'), rb(150, 'Specials', () => openPop('specials', 150)), rb(240, 'Shapes', () => openPop('shapes', 240)), shareBtn), pop);
  // pizza svg
  const svg = s('svg', { class: 'gp-svg', width: 1440, height: 900, viewBox: '0 0 1440 900' });
  const gSlices = s('g'), gNums = s('g'), gPoly = s('g'), gDots = s('g'), gHead = s('g');
  const hub = s('g', { style: 'cursor:pointer' }, s('circle', { cx: CX, cy: CY, r: RH, fill: '#42fff3', stroke: '#fff', 'stroke-width': 2.5 }),
    s('g', { transform: `translate(${CX - 22},${CY - 16})`, fill: '#2a9c98', stroke: '#2a9c98' }, s('ellipse', { cx: 22, cy: 20, rx: 9, ry: 9, fill: 'none', 'stroke-width': 3.5 }), s('rect', { x: 2, y: 8, width: 11, height: 9, rx: 2 }), s('rect', { x: 31, y: 8, width: 11, height: 9, rx: 2 }), s('line', { x1: 0, y1: 3, x2: 14, y2: 3, 'stroke-width': 2.5 }), s('line', { x1: 30, y1: 1, x2: 44, y2: 5, 'stroke-width': 2.5 }), s('line', { x1: 7, y1: 17, x2: 4, y2: 31, 'stroke-width': 2 }), s('line', { x1: 37, y1: 17, x2: 40, y2: 31, 'stroke-width': 2 }), s('line', { x1: 14, y1: 29, x2: 30, y2: 29, 'stroke-width': 2 })));
  hub.addEventListener('click', () => togglePlay());
  svg.append(s('circle', { cx: CX, cy: CY, r: RB, fill: '#4d38a0' }), gSlices, gNums, gHead, gPoly, gDots, hub);
  const mid = h('div.gp-mid', {}, svg); stage.append(mid);
  const ang = (i) => -Math.PI / 2 + i * 2 * Math.PI / N;
  const pt = (r, a) => [CX + r * Math.cos(a), CY + r * Math.sin(a)];
  const arc = (r0, r1, a0, a1) => { const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0); return `M${x0} ${y0} A${r1} ${r1} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r0} ${r0} 0 0 0 ${x3} ${y3}Z`; };
  const dotR = (k) => (RING[k].r0 + RING[k].r1) / 2 + (k === 0 ? 4 : k === 1 ? 0 : -1);
  let selRing = 0;
  // linear grid + pats
  const gridEl = h('div.gp-grid'); const patsEl = h('div.gp-pats'); mid.append(gridEl, patsEl);
  const playIcon = s('svg', { viewBox: '0 0 40 40', width: 44, height: 44 }, s('path', { d: 'M8 4 L36 20 L8 36Z', fill: '#fff' }));
  const playBtn = h('div.gp-play', { onclick: () => togglePlay() }, playIcon); mid.append(playBtn);
  const setPlayIcon = () => playIcon.replaceChildren(playing ? s('g', { fill: '#fff' }, s('rect', { x: 8, y: 5, width: 9, height: 30 }), s('rect', { x: 23, y: 5, width: 9, height: 30 })) : s('path', { d: 'M8 4 L36 20 L8 36Z', fill: '#fff' }));
  // sliders
  const SL = [['volume', 10, 'VOLUME'], ['bpm', 60, 'BPM'], ['swing', 110, 'SWING'], ['slices', 160, 'SLICES']];
  const slEls = {};
  SL.forEach(([k, x, lab]) => { const fill = h('i'), num = h('b'), el = h('div.gp-sl', { style: { left: x + 'px' } }, fill, num, h('span', {}, lab)); slEls[k] = { el, fill, num }; stage.append(el);
    let on = false; const at = (e) => { const r = el.getBoundingClientRect(); const f = clamp(1 - (e.clientY - r.top) / r.height, 0, 1); const [a, b] = RANGE[k]; setParam(k, Math.round(a + f * (b - a))); };
    el.addEventListener('pointerdown', (e) => { on = true; el.setPointerCapture(e.pointerId); at(e); }); el.addEventListener('pointermove', (e) => on && at(e)); el.addEventListener('pointerup', () => (on = false));
    el.addEventListener('wheel', (e) => { e.preventDefault(); setParam(k, P[k] + (e.deltaY < 0 ? 1 : -1)); }, { passive: false }); });
  const diamond = s('svg', { viewBox: '0 0 30 30', width: 30, height: 30 }, s('path', { d: 'M15 2 L28 15 L15 28 L2 15Z', fill: '#fff' }));
  const pen = s('svg', { viewBox: '0 0 30 30', width: 30, height: 30, fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }, s('path', { d: 'M5 25 L25 25 M7 21 L18 6 M8 21 Q14 13 21 17' }));
  stage.append(h('div.gp-cb', { style: { top: '750px' }, onclick: () => { selRing = (selRing + 1) % 3; toast('Shape target: ' + RING[selRing].name + ' ring'); } }, diamond), h('div.gp-cb', { style: { top: '821px' }, onclick: () => { grid[selRing].fill(0); render(); toast('cleared ' + RING[selRing].name); } }, pen));
  const setParam = (k, v) => { const [a, b] = RANGE[k]; v = clamp(Math.round(v), a, b); P[k] = v; const E = slEls[k]; E.num.textContent = v; E.fill.style.height = ((v - a) / (b - a)) * 100 + '%';
    if (k === 'swing') E.fill.style.height = (v / 100) * 100 + '%';
    if (k === 'volume' && master) master.gain.value = v / 100 * 0.9;
    if (k === 'slices' && v !== N) { resize(v); } };
  const resize = (n) => { grid = grid.map((row) => Array.from({ length: n }, (_, i) => row[i] || 0)); N = n; slots[slot] = grid; render(); };
  const loadGroove = (g) => { const n = g[0].length; grid = g.map((r) => r.slice()); slots[slot] = grid; N = n; P.slices = n; setParam('slices', n); };
  const applyShape = (k, sides) => { const row = grid[k]; row.fill(0); if (sides === 2) { row[0] = 1; row[Math.floor(N / 2)] = 1; } else for (let i = 0; i < sides; i++) row[Math.round(i * N / sides) % N] = 1; render(); };
  const toggle = (k, i) => { grid[k][i] = grid[k][i] ? 0 : 1; if (grid[k][i] && !playing) hit(k); render(); };
  const thumb = (g, size) => { const c = size / 2, n = g[0].length; const els = []; g.forEach((row, k) => { const rr = [c * 0.3, c * 0.6, c * 0.85][k]; const pts = row.map((v, i) => v ? pt0(c, rr, -Math.PI / 2 + i * 2 * Math.PI / n) : null).filter(Boolean); if (pts.length >= 3) els.push(s('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill: RING[k].col })); else if (pts.length === 2) els.push(s('line', { x1: pts[0][0], y1: pts[0][1], x2: pts[1][0], y2: pts[1][1], stroke: RING[k].col, 'stroke-width': 2 })); }); return s('svg', { viewBox: `0 0 ${size} ${size}`, width: size, height: size }, ...els); };
  const pt0 = (c, r, a) => [c + r * Math.cos(a), c + r * Math.sin(a)];
  const render = () => {
    gSlices.replaceChildren(); gNums.replaceChildren(); gPoly.replaceChildren(); gDots.replaceChildren();
    const w = Math.PI / N;
    for (let i = 0; i < N; i++) { const a = ang(i); RING.forEach((rg, k) => gSlices.append(s('path', { d: arc(rg.r0, rg.r1, a - w, a + w), fill: rg.fill[(i % 2)], stroke: '#00000010', 'stroke-width': 1 })));
      const [nx, ny] = pt(318, a); gNums.append(s('text', { x: nx, y: ny + 4, 'text-anchor': 'middle', fill: '#fff', 'font-size': 11, 'font-family': L }, String(i + 1))); }
    RING.forEach((rg, k) => { const r = dotR(k); const act = grid[k].map((v, i) => (v ? i : -1)).filter((i) => i >= 0); const pts = act.map((i) => pt(r, ang(i)));
      if (pts.length >= 3) gPoly.append(s('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill: rg.col, 'fill-opacity': 0.85, stroke: rg.col, 'stroke-width': 2, 'stroke-linejoin': 'round' }));
      else if (pts.length === 2) gPoly.append(s('line', { x1: pts[0][0], y1: pts[0][1], x2: pts[1][0], y2: pts[1][1], stroke: rg.col, 'stroke-width': 4 }));
      for (let i = 0; i < N; i++) { const [x, y] = pt(r, ang(i)); const on = grid[k][i]; const d = s('circle', { class: 'gp-dot', cx: x, cy: y, r: on ? 7.5 : 6.5, fill: on ? rg.dk === '#1fbfb6' ? '#2fd8cf' : rg.dk : '#ffffff', 'fill-opacity': on ? 1 : 0.6 }); d.addEventListener('click', () => toggle(k, i)); gDots.append(s('circle', { cx: x, cy: y, r: 16, fill: 'transparent', style: 'cursor:pointer', onclick: () => toggle(k, i) }), d); } });
    // linear grid
    const cw = Math.min(27, (480 - 40) / N - 2.4), gap = 2.4, x0 = 40;
    const rows = [h('div', { style: { position: 'absolute', left: 0, top: 0, right: 0, height: '22px' } }, ...Array.from({ length: N }, (_, i) => h('span', { style: { position: 'absolute', left: x0 + i * (cw + gap) + 'px', width: cw + 'px', top: '6px', textAlign: 'center', font: `400 11px ${L}` } }, i + 1)))];
    const icons = [polyIconTiny('#6fff64', 'tri'), polyIconTiny('#ffd84a', 'none'), polyIconTiny('#42fff3', 'line')];
    [0, 1, 2].forEach((k) => { const top = 25 + k * 30; rows.push(h('div', { style: { position: 'absolute', left: '10px', top: top + 4 + 'px' } }, icons[k]));
      for (let i = 0; i < N; i++) { const on = grid[k][i]; rows.push(h('div', { style: { position: 'absolute', left: x0 + i * (cw + gap) + 'px', top: top + 'px', width: cw + 'px', height: '27px', background: i === step && playing ? '#7a74b0' : '#565082', display: 'grid', placeItems: 'center', cursor: 'pointer' }, onclick: () => toggle(k, i) }, h('i', { style: { width: on ? '12px' : '5px', height: on ? '12px' : '5px', borderRadius: '50%', background: on ? (k === 0 ? '#6fff64' : k === 1 ? '#ffd84a' : '#42fff3') : '#fff' } }))); } });
    gridEl.replaceChildren(...rows);
    patsEl.replaceChildren(...slots.map((g, i) => h('div.gp-pat' + (i === slot ? '.on' : ''), { onclick: () => swapSlot(i) }, h('div', {}, i === slot || g.some((r) => r.some(Boolean)) ? thumb(g, 56) : null))));
  };
  const polyIconTiny = (c, kind) => s('svg', { viewBox: '0 0 22 18', width: 22, height: 18 }, kind === 'tri' ? s('path', { d: 'M2 6 L20 2 L9 16Z', fill: c }) : kind === 'line' ? s('line', { x1: 3, y1: 13, x2: 14, y2: 9, stroke: c, 'stroke-width': 2 }) : null);
  const swapSlot = (i) => { slots[slot] = grid; slot = i; grid = slots[i]; N = grid[0].length; P.slices = N; setParam('slices', N); render(); };
  // audio
  let master = null;
  const ensureAudio = () => { const ac = audio(); if (!ac) return null; if (!master) { master = ac.createGain(); master.gain.value = P.volume / 100 * 0.9; master.connect(ac.destination); } return ac; };
  const voice = (k, t) => { const ac = ensureAudio(); if (!ac) return; t = t || ac.currentTime; const g = ac.createGain(); g.connect(master);
    if (k === 2) { const o = ac.createOscillator(); o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35); o.connect(g); o.start(t); o.stop(t + 0.36); return; }
    const len = k === 1 ? 0.05 : 0.2; const b = ac.createBuffer(1, Math.ceil(ac.sampleRate * len), ac.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** (k === 1 ? 3 : 1.5);
    const src = ac.createBufferSource(); src.buffer = b; const f = ac.createBiquadFilter(); f.type = k === 1 ? 'highpass' : 'bandpass'; f.frequency.value = k === 1 ? 7500 : 1700; g.gain.value = k === 1 ? 0.35 : 0.6; src.connect(f).connect(g); src.start(t);
    if (k === 0) { const o = ac.createOscillator(), og = ac.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.1); og.gain.setValueAtTime(0.4, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.12); o.connect(og).connect(master); o.start(t); o.stop(t + 0.13); } };
  const hit = (k) => voice(k);
  const stepDur = () => 60 / P.bpm / 4;
  const sched = () => { const ac = audio(); if (!ac || !playing) return; while (nextT < ac.currentTime + 0.12) { step = (step + 1) % N; const sw = step % 2 ? stepDur() * (P.swing / 100) * 0.33 : 0; const st = step; grid.forEach((row, k) => row[st] && voice(k, nextT + sw)); const delay = Math.max(0, (nextT - ac.currentTime) * 1000); setTimeout(() => { if (playing) { step = st; render(); } }, delay); nextT += stepDur(); } };
  const head = s('path', { fill: '#ffffff', 'fill-opacity': 0.22 });
  const headLine = s('line', { stroke: '#fff', 'stroke-width': 2.5, 'stroke-opacity': 0.9, 'stroke-linecap': 'round' });
  gHead.append(head, headLine);
  const drawHead = (frac) => { const a = -Math.PI / 2 + frac * 2 * Math.PI; const [x, y] = pt(R3, a); headLine.setAttribute('x1', CX); headLine.setAttribute('y1', CY); headLine.setAttribute('x2', x); headLine.setAttribute('y2', y); const w = Math.PI / N; const i = Math.round(frac * N) % N; head.setAttribute('d', arc(RH, R3, ang(i) - w, ang(i) + w)); };
  const anim = () => { if (!root.isConnected) return; if (playing) { const ac = audio(); const el = ac ? ac.currentTime - t0 : (performance.now() / 1000 - t0); phase = ((el / (stepDur() * N)) + 1 / (2 * N)) % 1; drawHead((phase - 1 / (2 * N) + 1) % 1); } requestAnimationFrame(anim); };
  const togglePlay = (force) => { playing = force ?? !playing; setPlayIcon();
    if (playing) { const ac = ensureAudio(); step = -1; nextT = (ac ? ac.currentTime : 0) + 0.05; t0 = nextT; headLine.style.display = head.style.display = ''; sched(); timer = setInterval(sched, 25); }
    else { clearInterval(timer); step = -1; headLine.style.display = head.style.display = 'none'; render(); } };
  window.addEventListener('keydown', (e) => { if (e.code === 'Space' && root.isConnected) { e.preventDefault(); togglePlay(); } });
  const fit = () => { const r = root.getBoundingClientRect(); const k = r.height / 900; const W = r.width / k; stage.style.width = W + 'px'; stage.style.transform = `scale(${k})`; if (stars.width !== Math.round(W)) paintStars(Math.round(W)); };
  new ResizeObserver(fit).observe(root); fit();
  Object.keys(P).forEach((k) => setParam(k, P[k])); headLine.style.display = head.style.display = 'none';
  render(); anim();
  window.__demoProof = async () => { const out = []; const snap = JSON.stringify({ slots, slot, P });
    toggle(1, 2); toggle(1, 6); toggle(1, 10); out.push(`middle ring dots on → polygon count=${gPoly.childElementCount}`);
    out.push(`grid mirrors: row2 cells lit=${grid[1].filter(Boolean).length}`);
    gridEl.children[3].click(); out.push(`grid→pizza: inner ring slice2 now ${grid[0][1]} polygon pts=${grid[0].filter(Boolean).length}`);
    setParam('slices', 12); out.push(`SLICES 12 → slices drawn=${gSlices.childElementCount / 3}`);
    swapSlot(2); out.push(`pattern slot 3 → kick hits ${grid[2].filter(Boolean).length}`);
    applyShape(0, 5); out.push(`shape pentagon on inner ring → ${grid[0].filter(Boolean).length} hits`);
    togglePlay(true); await sleep(200); out.push(`playing step=${step} bpm=${P.bpm}`); togglePlay(false);
    const S0 = JSON.parse(snap); slots = S0.slots; slot = S0.slot; grid = slots[slot]; N = grid[0].length; Object.keys(S0.P).forEach((k) => setParam(k, S0.P[k])); render();
    return out.join('; ') + '; restored'; };
};

V['ipodjs-click-wheel-scroll-split-pane-menu-cover-flow'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#111', ac: '#2a7fd8', dark: false });
  const HV = "'Helvetica Neue',Helvetica,Arial,'Liberation Sans',sans-serif";
  const st = document.createElement('style'); st.textContent = `
.ip{position:absolute;inset:0;background:#fff;font-family:${HV};user-select:none;-webkit-user-select:none;overflow:hidden;display:grid;place-items:center}
.ip-body{position:relative;width:372px;height:600px;border-radius:24px;margin-top:-90px;background:linear-gradient(180deg,#e4e4e4 0%,#d6d6d6 45%,#cbcbcb 100%);
  box-shadow:inset 0 0 0 1px #bdbdbd,inset 0 2px 1px #f6f6f6,inset 0 -3px 6px #00000014,inset 10px 0 18px -10px #0000001f,inset -10px 0 18px -10px #0000001f;
  -webkit-box-reflect:below 6px linear-gradient(transparent 62%,#ffffff40);transition:background .4s}
.ip-body.blk{background:linear-gradient(180deg,#3a3a3c,#242426 50%,#1b1b1d);box-shadow:inset 0 0 0 1px #111,inset 0 2px 1px #555,inset 0 -3px 6px #0006}
.ip-scr{position:absolute;left:26px;top:24px;width:320px;height:252px;background:#000;border-radius:9px;padding:4px;box-shadow:0 1px 0 #ffffffaa,inset 0 0 0 1px #000}
.ip-in{position:relative;width:100%;height:100%;border-radius:5px;overflow:hidden;background:#fff}
.ip-split{position:absolute;inset:0;display:flex}
.ip-left{position:relative;width:50%;height:100%;background:#fff;z-index:2;box-shadow:4px 0 10px #0000003a;overflow:hidden}
.ip-right{position:relative;flex:1;height:100%;overflow:hidden;background:#fff}
.ip-tb{height:19px;display:flex;align-items:center;padding:0 6px;background:linear-gradient(#fbfbfb,#d7d7d7);border-bottom:1px solid #9a9a9a;font:700 11px/1 ${HV};color:#1b1b1b;gap:4px}
.ip-tb .sp{flex:1}.ip-tb .pl{font-size:9px;color:#3a6fb9}
.ip-bat{width:21px;height:10px;border:1px solid #444;border-radius:2px;position:relative;background:linear-gradient(#bdf2a5,#4bb52c);box-shadow:inset 0 0 0 1px #fff}
.ip-bat:after{content:'';position:absolute;right:-3px;top:2px;width:2px;height:4px;background:#444;border-radius:0 1px 1px 0}
.ip-list{position:absolute;left:0;right:0;top:19px;bottom:0;transition:transform .32s cubic-bezier(.3,.7,.3,1)}
.ip-pane{position:absolute;left:0;top:0;width:100%;bottom:0;transition:transform .32s cubic-bezier(.3,.7,.3,1);background:#fff}
.ip-it{height:21px;display:flex;align-items:center;padding:0 7px;font:700 12.5px/1 ${HV};color:#000;white-space:nowrap;overflow:hidden}
.ip-it .v{margin-left:auto;font-weight:400;font-size:11px;color:#666}
.ip-it .ch{margin-left:auto;font:400 15px/1 ${HV};opacity:0}
.ip-it.on{background:linear-gradient(#5bb4f6,#2a7fd8 55%,#1f6fcb);color:#fff}
.ip-it.on .ch{opacity:1}.ip-it.on .v{color:#e8f2ff}
.ip-prev{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10px;animation:ipfade .3s ease}
@keyframes ipfade{from{opacity:0}}
.ip-prev h5{margin:7px 0 2px;font:700 13px/1.1 ${HV};color:#111}.ip-prev p{margin:0;font:400 10px/1.25 ${HV};color:#666}
.ip-am{width:44px;height:44px;border-radius:10px;background:linear-gradient(#fb5c74,#fa233b);display:grid;place-items:center;box-shadow:0 1px 3px #0003}
.ip-full{position:absolute;inset:0;background:#fff;transition:transform .32s cubic-bezier(.3,.7,.3,1);z-index:5}
.ip-cf{position:absolute;left:0;right:0;top:19px;bottom:0;background:linear-gradient(#000 60%,#151515);perspective:420px;overflow:hidden}
.ip-cv{position:absolute;left:50%;top:22px;width:112px;height:112px;margin-left:-56px;transition:transform .38s cubic-bezier(.25,.8,.3,1),filter .38s;
  -webkit-box-reflect:below 1px linear-gradient(transparent 55%,#ffffff55);border-radius:1px}
.ip-cft{position:absolute;left:0;right:0;bottom:12px;text-align:center;color:#fff}
.ip-cft b{display:block;font:700 12px/1.2 ${HV}}.ip-cft span{font:400 10px/1.2 ${HV};color:#aaa}
.ip-np{position:absolute;left:0;right:0;top:19px;bottom:0;padding:16px 14px 10px;background:linear-gradient(#fff,#ececec)}
.ip-np .art{position:absolute;left:16px;top:20px;width:108px;height:108px;-webkit-box-reflect:below 1px linear-gradient(transparent 60%,#ffffff70);transform:perspective(300px) rotateY(18deg);box-shadow:0 2px 6px #0003}
.ip-np .meta{position:absolute;left:138px;right:10px;top:32px}
.ip-np .meta b{display:block;font:700 13px/1.25 ${HV};color:#111}.ip-np .meta span{display:block;font:400 11px/1.4 ${HV};color:#555}
.ip-np .meta small{display:block;font:400 9.5px/1.4 ${HV};color:#888;margin-top:5px}
.ip-pb{position:absolute;left:14px;right:14px;bottom:16px}
.ip-pb .tr{height:9px;border:1px solid #8a8a8a;border-radius:1px;background:linear-gradient(#fff,#e2e2e2);overflow:hidden}
.ip-pb .fl{height:100%;width:0;background:linear-gradient(#a6d4fb,#3b8fdf)}
.ip-pb .tm{display:flex;justify-content:space-between;font:700 9.5px/1 ${HV};color:#333;margin-top:4px}
.ip-vol{position:absolute;left:14px;right:14px;bottom:16px;display:flex;align-items:center;gap:6px;opacity:0;transition:opacity .2s;font-size:11px;color:#333}
.ip-vol.on{opacity:1}.ip-vol .tr{flex:1;height:9px;border:1px solid #8a8a8a;background:#fff}.ip-vol .fl{height:100%;background:linear-gradient(#a6d4fb,#3b8fdf)}
.ip-wh{position:absolute;left:50%;top:328px;width:234px;height:234px;margin-left:-117px;border-radius:50%;background:radial-gradient(circle at 50% 30%,#ffffff,#f4f4f4 60%,#e9e9e9);
  box-shadow:0 0 0 1px #c9c9c9,inset 0 1px 2px #fff,inset 0 -2px 4px #0000000f;cursor:grab;touch-action:none}
.blk .ip-wh{background:radial-gradient(circle at 50% 30%,#3d3d40,#2a2a2c 70%);box-shadow:0 0 0 1px #111,inset 0 1px 1px #555}
.ip-wh.grab{cursor:grabbing}
.ip-wl{position:absolute;font:700 13px/1 ${HV};color:#b4b4b4;letter-spacing:.03em;pointer-events:none}
.ip-wl svg{display:block;fill:#b4b4b4}
.ip-wh .flash{position:absolute;inset:0;border-radius:50%;pointer-events:none;background:conic-gradient(from var(--a,0deg),#0000 0 340deg,#2a7fd81c 350deg,#0000 360deg);opacity:0;transition:opacity .25s}
.ip-wh.spin .flash{opacity:1}
.ip-ctr{position:absolute;left:50%;top:50%;width:82px;height:82px;margin:-41px 0 0 -41px;border-radius:50%;background:linear-gradient(#d8d8d8,#ececec);box-shadow:inset 0 1px 2px #0000002e,0 1px 0 #fff;cursor:pointer}
.blk .ip-ctr{background:linear-gradient(#202022,#38383a);box-shadow:inset 0 1px 2px #000,0 1px 0 #444}
.ip-ctr:active,.ip-ctr.pr{background:linear-gradient(#cdcdcd,#dedede)}
.ip-hint{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);font:500 12px/1.4 'Inter Variable',${HV};color:#9a9a9a;text-align:center}
.ip-hint kbd{font:600 11px 'JetBrains Mono Variable',monospace;background:#f2f2f2;border:1px solid #e1e1e1;border-radius:4px;padding:1px 5px;color:#666}
`; root.append(st);
  // ---------- data ----------
  const ART = [['#ff6a3d', '#ffd23f', 'SUN'], ['#2b2d8f', '#e9446a', 'NOX'], ['#0f9b8e', '#c8f560', 'LAG'], ['#f4f1e8', '#1d1d1f', 'MONO'], ['#7b2ff7', '#f107a3', 'VPR'], ['#122a3a', '#4fc3f7', 'SEA'], ['#d4a373', '#6b3e26', 'ROOT'], ['#111', '#ff2e63', 'RED']];
  const ALB = [['Golden Hour Tapes', 'Sunroom'], ['Nocturne Club', 'Velvet Static'], ['Lagoon Days', 'The Palms'], ['Monochrome', 'Paper Planes'], ['Vaporline', 'Neon Kids'], ['Deep Blue Radio', 'Harbor'], ['Rootwork', 'Oak & Ash'], ['Red Shift', 'Kilowatt']].map(([t, a], i) => ({ t, a, art: ART[i], songs: ['Intro', 'Afterglow', 'Slow Motion', 'Paper Moon', 'Wires'].map((s, k) => ({ s: k ? s : t.split(' ')[0] + ' Intro', d: 150 + ((i * 37 + k * 53) % 120) })) }));
  const SONGS = ALB.flatMap((al) => al.songs.slice(0, 2).map((x) => ({ ...x, al })));
  const artEl = (al, sz = 112) => { const [c1, c2, w] = al.art; const e = h('div', { style: { width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: `radial-gradient(circle at 70% 30%,${c2} 0 22%,transparent 23%),linear-gradient(135deg,${c1},${c1} 55%,${c2})` } },
    h('div', { style: { position: 'absolute', left: '7%', bottom: '7%', font: `800 ${Math.round(sz * 0.2)}px/0.9 ${HV}`, color: c1 === '#f4f1e8' ? '#111' : '#fff', letterSpacing: '-.03em', mixBlendMode: 'normal' } }, w),
    h('div', { style: { position: 'absolute', left: '7%', top: '7%', font: `600 ${Math.max(7, Math.round(sz * 0.075))}px/1 ${HV}`, color: c1 === '#f4f1e8' ? '#333' : '#ffffffcc', textTransform: 'uppercase', letterSpacing: '.08em' } }, al.a)); return e; };
  const prefs = { clicker: true, theme: 'Silver', shuffle: false };
  let np = { song: SONGS[0], t: 34, playing: false, vol: 0.6 };
  // ---------- menus ----------
  const amPrev = (title, sub) => () => h('div.ip-prev', {}, h('div.ip-am', { html: '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M16.5 3.2 9 4.8v10.1a3 3 0 1 0 1.5 2.6V8.4l6-1.3v6.3a3 3 0 1 0 1.5 2.6V3Z" fill="#fff"/></svg>' }), h('h5', {}, title), h('p', {}, sub));
  const albumPrev = (al) => () => h('div.ip-prev', {}, h('div', { style: { width: '96px', height: '96px', boxShadow: '0 3px 10px #0004' } }, artEl(al, 96)), h('h5', {}, al.t), h('p', {}, al.a));
  const cfPrev = () => { const w = h('div.ip-prev', { style: { background: '#000' } }); const row = h('div', { style: { position: 'relative', width: '140px', height: '70px', perspective: '200px' } });
    [-2, -1, 1, 2, 0].forEach((k) => { const c = h('div', { style: { position: 'absolute', left: 50 + k * 22 + 'px', top: '10px', width: '44px', height: '44px', transform: k ? `rotateY(${k < 0 ? 55 : -55}deg)` : 'none', zIndex: 5 - Math.abs(k), WebkitBoxReflect: 'below 1px linear-gradient(transparent 50%,#fff4)' } }, artEl(ALB[(k + 8) % 8], 44)); row.append(c); });
    w.append(row, h('h5', { style: { color: '#fff' } }, 'Cover Flow'), h('p', { style: { color: '#999' } }, `${ALB.length} albums`)); return w; };
  const gamePrev = (n, e) => () => h('div.ip-prev', {}, h('div', { style: { width: '54px', height: '54px', borderRadius: '12px', background: 'linear-gradient(#5f6b7a,#2d3540)', display: 'grid', placeItems: 'center', font: '28px/1 sans-serif' } }, e), h('h5', {}, n), h('p', {}, 'Use the click wheel to play'));
  const gearPrev = () => h('div.ip-prev', {}, h('div', { html: '<svg width="52" height="52" viewBox="0 0 24 24"><path fill="#8e8e93" d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7 7 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7 7 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7 7 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7 7 0 0 0 1.7-1l2.5 1 2-3.5ZM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg>' }), h('h5', {}, 'Settings'), h('p', {}, `Clicker ${prefs.clicker ? 'On' : 'Off'} · ${prefs.theme}`));
  const nowPrev = () => albumPrev(np.song.al)();
  const M = {
    root: { title: 'iPod.js', items: [{ l: 'Cover Flow', go: 'coverflow', prev: amPrev('Apple Music', 'Sign in to view your library') }, { l: 'Music', go: 'music', prev: () => cfPrev() }, { l: 'Games', go: 'games', prev: gamePrev('Brick', '🧱') }, { l: 'Settings', go: 'settings', prev: gearPrev }, { l: 'Sign in', act: () => toast('Apple Music / Spotify sign-in (demo)'), prev: amPrev('Sign in', 'Connect Apple Music or Spotify to stream your library') }] },
    music: { title: 'Music', items: [{ l: 'Cover Flow', go: 'coverflow', prev: () => cfPrev() }, { l: 'Albums', go: 'albums', prev: albumPrev(ALB[1]) }, { l: 'Songs', go: 'songs', prev: albumPrev(ALB[2]) }, { l: 'Shuffle Songs', act: () => { np.song = SONGS[Math.floor(Math.random() * SONGS.length)]; np.t = 0; np.playing = true; push('nowplaying'); }, prev: albumPrev(ALB[4]) }, { l: 'Now Playing', go: 'nowplaying', prev: nowPrev }] },
    albums: { title: 'Albums', items: ALB.map((al) => ({ l: al.t, v: '', act: () => { np.song = { ...al.songs[0], al }; np.t = 0; np.playing = true; push('nowplaying'); }, prev: albumPrev(al) })) },
    songs: { title: 'Songs', items: SONGS.map((so) => ({ l: so.s, act: () => { np.song = so; np.t = 0; np.playing = true; push('nowplaying'); }, prev: albumPrev(so.al) })) },
    games: { title: 'Games', items: [['Brick', '🧱'], ['Music Quiz', '🎵'], ['Parachute', '🪂'], ['Solitaire', '🂡']].map(([n, e]) => ({ l: n, act: () => toast(`${n} — coming soon in this clone`), prev: gamePrev(n, e) })) },
    settings: { title: 'Settings', items: [{ l: 'About', act: () => toast('iPod.js clone · 8 albums · 16 songs'), prev: gearPrev }, { l: 'Clicker', v: () => (prefs.clicker ? 'On' : 'Off'), act: () => { prefs.clicker = !prefs.clicker; render(); }, prev: gearPrev },
      { l: 'Theme', v: () => prefs.theme, act: () => { prefs.theme = prefs.theme === 'Silver' ? 'Black' : 'Silver'; body.classList.toggle('blk', prefs.theme === 'Black'); render(); }, prev: gearPrev }, { l: 'Shuffle', v: () => (prefs.shuffle ? 'Songs' : 'Off'), act: () => { prefs.shuffle = !prefs.shuffle; render(); }, prev: gearPrev }] },
  };
  // ---------- DOM ----------
  const wrap = h('div.ip'); root.append(wrap);
  const body = h('div.ip-body'); wrap.append(body, h('div.ip-hint', { html: 'Drag in a circle on the click wheel (or scroll / <kbd>↑</kbd><kbd>↓</kbd>) · centre = select <kbd>Enter</kbd> · MENU = back <kbd>Esc</kbd>' }));
  const inner = h('div.ip-in'); body.append(h('div.ip-scr', {}, inner));
  const split = h('div.ip-split'); const left = h('div.ip-left'); const right = h('div.ip-right'); split.append(left, right); inner.append(split);
  const tb = (title) => h('div.ip-tb', {}, h('span', {}, title), h('span.sp'), np.playing ? h('span.pl', {}, '▶') : null, h('div.ip-bat'));
  // nav stack: [{id, sel, scroll}]
  let stack = [{ id: 'root', sel: 0, top: 0 }];
  const cur = () => stack[stack.length - 1];
  const ROWS = 10; // visible rows in pane (210px / 21)
  let paneEl = null, fullEl = null;
  const buildPane = (fr) => { const m = M[fr.id]; const p = h('div.ip-pane'); p.append(tb(m.title)); const list = h('div.ip-list'); p.append(list);
    m.items.forEach((it, i) => { const v = typeof it.v === 'function' ? it.v() : it.v; list.append(h('div.ip-it' + (i === fr.sel ? '.on' : ''), {}, h('span', {}, it.l), v ? h('span.v', {}, v) : null, h('span.ch', {}, '›'))); });
    list.style.transform = `translateY(${-fr.top * 21}px)`; return p; };
  const prevKey = { v: '' };
  const renderPreview = () => { const fr = cur(); const it = M[fr.id]?.items[fr.sel]; const k = fr.id + ':' + fr.sel + ':' + prefs.clicker + prefs.theme; if (k === prevKey.v) return; prevKey.v = k; right.replaceChildren(it?.prev ? it.prev() : h('div')); };
  const render = (dir = 0) => { const fr = cur();
    if (fr.id === 'coverflow' || fr.id === 'nowplaying') { renderFull(dir); return; }
    if (fullEl) { const f = fullEl; fullEl = null; f.style.transform = 'translateX(100%)'; setTimeout(() => f.remove(), 330); }
    const p = buildPane(fr);
    if (dir && paneEl) { const old = paneEl; p.style.transform = `translateX(${dir > 0 ? 100 : -100}%)`; left.append(p); void p.offsetWidth; p.style.transform = 'none'; old.style.transform = `translateX(${dir > 0 ? -100 : 100}%)`; setTimeout(() => old.remove(), 330); }
    else { if (paneEl) paneEl.remove(); left.append(p); }
    paneEl = p; prevKey.v = ''; renderPreview(); };
  const moveSel = (d) => { const fr = cur(); const m = M[fr.id]; const n = m.items.length; const ns = clamp(fr.sel + d, 0, n - 1); if (ns === fr.sel) return false; fr.sel = ns;
    if (fr.sel < fr.top) fr.top = fr.sel; if (fr.sel >= fr.top + ROWS) fr.top = fr.sel - ROWS + 1;
    const list = paneEl.querySelector('.ip-list'); [...list.children].forEach((el, i) => el.classList.toggle('on', i === ns)); list.style.transform = `translateY(${-fr.top * 21}px)`; renderPreview(); return true; };
  // ---- cover flow ----
  let cf = { i: 0 }, cfEls = [];
  const layoutCF = () => cfEls.forEach((el, k) => { const d = k - cf.i, a = Math.abs(d); el.style.transform = d === 0 ? 'translateZ(40px)' : `translateX(${Math.sign(d) * (58 + (a - 1) * 26)}px) translateZ(-30px) rotateY(${d < 0 ? 64 : -64}deg)`; el.style.zIndex = 50 - a; el.style.filter = a > 3 ? 'brightness(.35)' : a ? 'brightness(.8)' : 'none'; });
  const cfText = () => { const al = ALB[cf.i]; fullEl?.querySelector('.ip-cft')?.replaceChildren(h('b', {}, al.t), h('span', {}, al.a)); };
  // ---- now playing ----
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  let volT;
  const npUpdate = () => { if (cur().id !== 'nowplaying' || !fullEl) return; const so = np.song; fullEl.querySelector('.fl').style.width = (np.t / so.d) * 100 + '%'; const tm = fullEl.querySelectorAll('.ip-pb .tm span'); tm[0].textContent = fmt(np.t); tm[1].textContent = '-' + fmt(so.d - np.t); fullEl.querySelector('.ip-vol .fl').style.width = np.vol * 100 + '%'; const pl = fullEl.querySelector('.ip-tb .pl'); if (pl) pl.textContent = np.playing ? '▶' : '❚❚'; };
  const renderFull = (dir) => { const fr = cur(); const f = h('div.ip-full');
    if (fr.id === 'coverflow') { f.append(tb('Cover Flow')); const stage = h('div.ip-cf'); cfEls = ALB.map((al) => { const c = h('div.ip-cv', {}, artEl(al)); stage.append(c); return c; }); stage.append(h('div.ip-cft')); f.append(stage); }
    else { const so = np.song; f.append(h('div.ip-tb', {}, h('span', {}, 'Now Playing'), h('span.sp'), h('span.pl', {}, np.playing ? '▶' : '❚❚'), h('div.ip-bat')));
      f.append(h('div.ip-np', {}, h('div.art', {}, artEl(so.al, 108)), h('div.meta', {}, h('b', {}, so.s), h('span', {}, so.al.a), h('span', {}, so.al.t), h('small', {}, `${SONGS.indexOf(so) + 1 || 1} of ${SONGS.length}`)),
        h('div.ip-pb', {}, h('div.tr', {}, h('div.fl')), h('div.tm', {}, h('span', {}, '0:00'), h('span', {}, '-0:00'))), h('div.ip-vol', {}, h('span', {}, '🔈'), h('div.tr', {}, h('div.fl')), h('span', {}, '🔊')))); }
    const old = fullEl; fullEl = f; f.style.transform = dir >= 0 ? 'translateX(100%)' : 'translateX(-100%)'; inner.append(f); void f.offsetWidth; f.style.transform = 'none';
    if (old) { old.style.transform = dir >= 0 ? 'translateX(-100%)' : 'translateX(100%)'; setTimeout(() => old.remove(), 330); }
    if (fr.id === 'coverflow') { layoutCF(); cfText(); } else npUpdate(); };
  const push = (id) => { stack.push({ id, sel: 0, top: 0 }); render(1); };
  const back = () => { if (stack.length > 1) { stack.pop(); render(-1); click(900); } };
  const select = () => { const fr = cur(); click(1300);
    if (fr.id === 'coverflow') { const al = ALB[cf.i]; np.song = { ...al.songs[0], al }; np.t = 0; np.playing = true; push('nowplaying'); return; }
    if (fr.id === 'nowplaying') { toast(np.song.s + ' — ' + np.song.al.a); return; }
    const it = M[fr.id].items[fr.sel]; if (it.go) push(it.go); else it.act?.(); };
  const scroll = (d) => { const id = cur().id; let moved = false;
    if (id === 'coverflow') { const ni = clamp(cf.i + d, 0, ALB.length - 1); moved = ni !== cf.i; cf.i = ni; layoutCF(); cfText(); }
    else if (id === 'nowplaying') { np.vol = clamp(np.vol + d * 0.0625, 0, 1); moved = true; const v = fullEl.querySelector('.ip-vol'), pb = fullEl.querySelector('.ip-pb'); v.classList.add('on'); pb.style.opacity = 0; npUpdate(); clearTimeout(volT); volT = setTimeout(() => { v.classList.remove('on'); pb.style.opacity = 1; }, 1400); }
    else moved = moveSel(d);
    if (moved) click(1800); return moved; };
  const click = (f) => { if (prefs.clicker) blip(f, 0.012, 'square', 0.025); };
  const playPause = (quiet) => { np.playing = !np.playing; click(1100); npUpdate(); if (quiet !== true) toast(np.playing ? '▶ ' + np.song.s : '❚❚ Paused'); };
  const skip = (d) => { const i = SONGS.findIndex((x) => x.s === np.song.s && x.al === np.song.al); np.song = SONGS[(Math.max(0, i) + d + SONGS.length) % SONGS.length]; np.t = 0; click(1100); if (cur().id === 'nowplaying') render(0); else toast((d > 0 ? '⏭ ' : '⏮ ') + np.song.s); };
  setInterval(() => { if (np.playing) { np.t += 1; if (np.t >= np.song.d) skip(1); npUpdate(); } }, 1000);
  // ---------- click wheel ----------
  const wheel = h('div.ip-wh'); body.append(wheel); wheel.append(h('div.flash'));
  const lab = (txt, css2) => { const e = h('div.ip-wl', { html: txt }); Object.assign(e.style, css2); wheel.append(e); return e; };
  lab('MENU', { left: '50%', top: '17px', transform: 'translateX(-50%)' });
  lab('<svg width="18" height="10" viewBox="0 0 18 10"><rect x="0" y="0" width="2" height="10"/><path d="M9 0v10L2.5 5Z"/><path d="M16 0v10L9.5 5Z"/></svg>', { left: '16px', top: '50%', transform: 'translateY(-50%)' });
  lab('<svg width="18" height="10" viewBox="0 0 18 10"><path d="M2 0v10l6.5-5Z"/><path d="M9 0v10l6.5-5Z"/><rect x="16" y="0" width="2" height="10"/></svg>', { right: '16px', top: '50%', transform: 'translateY(-50%)' });
  lab('<svg width="20" height="10" viewBox="0 0 20 10"><path d="M0 0v10l7-5Z"/><rect x="11" y="0" width="2.6" height="10"/><rect x="16" y="0" width="2.6" height="10"/></svg>', { left: '50%', bottom: '17px', transform: 'translateX(-50%)' });
  const ctr = h('div.ip-ctr'); wheel.append(ctr);
  ctr.addEventListener('pointerdown', (e) => { e.stopPropagation(); ctr.classList.add('pr'); }); ctr.addEventListener('pointerup', () => { ctr.classList.remove('pr'); select(); }); ctr.addEventListener('pointerleave', () => ctr.classList.remove('pr'));
  const STEP = 24; // degrees per tick
  let ticks = 0;
  wheel.addEventListener('pointerdown', (e) => { if (e.target === ctr) return; e.preventDefault(); try { wheel.setPointerCapture(e.pointerId); } catch {}
    const r = wheel.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2; const ang = (ev) => (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI;
    let last = ang(e), acc = 0, total = 0; const sx = e.clientX - cx, sy = e.clientY - cy; wheel.classList.add('grab', 'spin');
    const mv = (ev) => { const a = ang(ev); let d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360; last = a; acc += d; total += Math.abs(d); wheel.style.setProperty('--a', a + 90 + 'deg');
      while (acc >= STEP) { acc -= STEP; ticks++; scroll(1); } while (acc <= -STEP) { acc += STEP; ticks--; scroll(-1); } };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); wheel.classList.remove('grab', 'spin');
      if (total < 8) { // tap on a quadrant
        if (Math.abs(sy) > Math.abs(sx)) { if (sy < 0) back(); else playPause(); } else skip(sx > 0 ? 1 : -1); } };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); });
  let wAcc = 0; body.addEventListener('wheel', (e) => { e.preventDefault(); wAcc += e.deltaY; while (wAcc > 40) { wAcc -= 40; scroll(1); } while (wAcc < -40) { wAcc += 40; scroll(-1); } }, { passive: false });
  const onKey = (e) => { if (!document.body.contains(wrap)) return window.removeEventListener('keydown', onKey); const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight' && cur().id === 'coverflow') { scroll(1); e.preventDefault(); } else if (k === 'ArrowUp' || k === 'ArrowLeft' && cur().id === 'coverflow') { scroll(-1); e.preventDefault(); }
    else if (k === 'Enter') select(); else if (k === 'Escape' || k === 'Backspace') back(); else if (k === ' ') { playPause(); e.preventDefault(); } };
  window.addEventListener('keydown', onKey);
  render();
  const reset = () => { stack = [{ id: 'root', sel: 0, top: 0 }]; cf.i = 0; np = { song: SONGS[0], t: 34, playing: false, vol: 0.6 }; prefs.theme = 'Silver'; body.classList.remove('blk'); if (fullEl) { fullEl.remove(); fullEl = null; } render(); };
  window.__demoProof = async () => { const out = []; reset(); const wasClick = prefs.clicker; prefs.clicker = false;
    const r = wheel.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = 92;
    const at = (deg) => ({ clientX: cx + R * Math.cos((deg * Math.PI) / 180), clientY: cy + R * Math.sin((deg * Math.PI) / 180), bubbles: true, pointerId: 7, button: 0 });
    const rotate = async (from, to) => { wheel.dispatchEvent(new PointerEvent('pointerdown', { ...at(from), buttons: 1 })); const n = Math.ceil(Math.abs(to - from) / 6); for (let k = 1; k <= n; k++) { window.dispatchEvent(new PointerEvent('pointermove', { ...at(from + ((to - from) * k) / n), buttons: 1 })); await sleep(12); } window.dispatchEvent(new PointerEvent('pointerup', { ...at(to), buttons: 0 })); await sleep(80); };
    await rotate(-90, -90 + STEP * 3 + 4); out.push(`wheel +3 ticks → "${M.root.items[cur().sel].l}" highlighted, preview="${right.querySelector('h5')?.textContent}"`);
    await rotate(0, -STEP * 3 - 4); out.push(`wheel −3 ticks → "${M.root.items[cur().sel].l}"`);
    ctr.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); await sleep(400); out.push(`centre → view=${cur().id}`);
    await rotate(90, 90 + STEP * 2 + 4); await sleep(420); out.push(`cover flow scrubbed to #${cf.i} "${ALB[cf.i].t}"`);
    ctr.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); await sleep(400); out.push(`centre → ${cur().id}: "${np.song.s}" playing=${np.playing}`);
    playPause(true); out.push(`play/pause → playing=${np.playing}`);
    back(); await sleep(360); back(); await sleep(360); out.push(`MENU×2 → ${cur().id}`);
    reset(); prefs.clicker = wasClick; out.push('restored root menu'); return out.join('; '); };
};

V['io808-tr808-skeuomorphic-step-sequencer-knob-drag-16-step-pads'] = (root, T) => {
  import('@fontsource/questrial');
  theme(root, T, { bg: '#232425', fg: '#9b9fa0', ac: '#ff5a00', dark: true });
  const HV = "Arial,'Liberation Sans',Helvetica,sans-serif", WM = "'Questrial','Century Gothic',Futura,sans-serif";
  const C = { bg: '#232425', grey: '#9b9fa0', cream: '#f6edc6', org: '#ff5a00', yel: '#eab210', wk: '#c8d4c8' };
  const st = document.createElement('style'); st.textContent = `
.t8w{position:absolute;inset:0;background:${C.bg};overflow:hidden;user-select:none;-webkit-user-select:none}
.t8{position:absolute;left:50%;top:50%;width:1440px;height:900px;transform-origin:0 0;font-family:${HV};color:${C.grey}}
.t8 .ab{position:absolute}
.t8 .lb{position:absolute;font:700 13px/1 ${HV};color:#c9cccd;text-align:center;letter-spacing:.01em;white-space:nowrap;transform:translateX(-50%)}
.t8 .tb{position:absolute;top:28px;height:34px;border-radius:3px;background:${C.yel};color:#2b2410;font:700 14px/34px ${HV};text-align:center;cursor:pointer;border:0;padding:0;box-shadow:inset 0 -2px 0 #0002}
.t8 .tb:active{filter:brightness(.9)}
.t8 .kn{position:absolute;touch-action:none;cursor:ns-resize}
.t8 .kn .rot{position:absolute;inset:0;transition:none}
.t8 .kn.grab{cursor:grabbing}
.t8 .div{position:absolute;top:77px;width:2px;height:493px;background:${C.grey}}
.t8 .ck{position:absolute;height:31px;border-radius:4px;background:${C.cream};color:#1d1d1d;font:400 17px/31px ${HV};font-variant:small-caps;text-align:center;cursor:pointer;box-shadow:inset 0 -2px 0 #0000001f,0 1px 0 #0006;white-space:nowrap;letter-spacing:-.01em}
.t8 .ck.sel{box-shadow:inset 0 0 0 2px ${C.org},0 1px 0 #0006}
.t8 .ck:active{filter:brightness(.93)}
.t8 .sw{position:absolute;width:20px;height:46px;background:#111;border-radius:2px;cursor:pointer;box-shadow:inset 0 0 0 1px #3a3b3c}
.t8 .sw i{position:absolute;left:4px;width:12px;height:18px;background:linear-gradient(#5d6061,#3b3d3e);border-radius:1px;transition:top .12s}
.t8 .il{position:absolute;width:30px;height:20px;border-radius:2px;background:${C.cream};color:#111;font:700 12px/20px ${HV};text-align:center;cursor:pointer;transform:translate(-50%,-50%)}
.t8 .il.sel{background:${C.org};color:#fff}
.t8 .in{position:absolute;font:700 11px/1 ${HV};color:${C.org};transform:translate(-50%,-50%)}
.t8 .grey{position:absolute;background:${C.grey}}
.t8 .nb{position:absolute;background:${C.grey};border-radius:6px;color:#111;font:16px/1 serif;display:flex;align-items:center;overflow:hidden;white-space:nowrap}
.t8 .pad{position:absolute;top:725px;width:48px;height:88px;border-radius:3px;cursor:pointer;box-shadow:inset 0 -3px 0 #0000002a;transition:filter .06s}
.t8 .pad:hover{filter:brightness(1.06)}
.t8 .pad i{position:absolute;left:50%;top:8px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#570000;box-shadow:0 0 0 3px #0000003a}
.t8 .pad.on i{background:#fe0000;box-shadow:0 0 0 3px #0000003a,0 0 8px #ff2a00}
.t8 .pad.cur{filter:brightness(1.18)}
.t8 .pad.cur i{background:#ffd9c9;box-shadow:0 0 0 3px #0000003a,0 0 12px 3px #ff3a00}
.t8 .pn{position:absolute;top:707px;width:48px;text-align:center;font:700 13px/1 ${HV};color:#e8e8e8}
.t8 .bn{position:absolute;top:836px;width:48px;text-align:center;font:400 23px/1 ${HV};color:#1b1c1d}
.t8 .led{position:absolute;width:14px;height:14px;border-radius:50%;background:#570000;box-shadow:0 0 0 3px #111}
.t8 .led.on{background:#fe0000;box-shadow:0 0 0 3px #111,0 0 7px #ff2a00}
.t8 .tag{position:absolute;height:22px;background:#c9cccd;color:#111;font:700 12px/22px ${HV};padding:0 10px 0 18px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%)}
.t8 .tog{position:absolute;width:58px;height:24px;border-radius:12px;background:#fff;box-shadow:inset 0 0 0 2px #111;cursor:pointer}
.t8 .tog i{position:absolute;top:2px;width:20px;height:20px;border-radius:50%;background:#111;transition:left .15s}
.t8 .ss{position:absolute;width:134px;height:58px;border-radius:3px;background:${C.yel};cursor:pointer;color:#4b4020;font:700 13px/1 ${HV};text-align:center;box-shadow:inset 0 -3px 0 #0002}
.t8 .ss.on{background:#ffcc33;box-shadow:inset 0 -3px 0 #0002,0 0 14px #eab21088}
.t8 .ss:active{transform:translateY(1px)}
.t8 .ft{position:absolute;top:876px;font:400 14px/1 ${HV};color:#c9cccd}
.t8 .ft u{color:#c9cccd}
.t8 .bpm{position:absolute;left:96px;top:398px;transform:translateX(-50%);font:700 11px/1 ${HV};color:${C.org};opacity:0;transition:opacity .3s}
.t8 .bpm.on{opacity:1}
`; root.append(st);
  const wrap = h('div.t8w'), P = h('div.t8'); wrap.append(P); root.append(wrap);
  const fit = () => { const r = wrap.getBoundingClientRect(); const k = Math.min(r.width / 1440, r.height / 900); P.style.transform = `scale(${k}) translate(-50%,-50%)`; P.style.transformOrigin = '0 0'; P.style.left = r.width / 2 + 'px'; P.style.top = r.height / 2 + 'px'; P.style.transform = `translate(-50%,-50%) scale(${k})`; P.style.transformOrigin = '50% 50%'; };
  new ResizeObserver(fit).observe(wrap);
  const ab = (x, y, el) => { el.style.position = 'absolute'; el.style.left = x + 'px'; el.style.top = y + 'px'; P.append(el); return el; };
  const lab = (x, y, t, st2 = {}) => ab(x, y, h('div.lb', { style: st2 }, t));
  // ---------- knob factory ----------
  const knobs = [];
  const knob = ({ x, y, d = 46, cap = 'org', v = 0.5, ticks = 11, ring = 1.55, def, dot = false, on = () => {}, nums = null, bezel = false, span = 270 }) => {
    const R = d / 2, S = d * ring, cx = S / 2;
    const k = h('div.kn', { style: { left: x - cx + 'px', top: y - cx + 'px', width: S + 'px', height: S + 'px' } });
    const sv = s('svg', { width: S, height: S, viewBox: `0 0 ${S} ${S}`, style: 'position:absolute;inset:0;overflow:visible' });
    if (bezel) { sv.append(s('circle', { cx, cy: cx, r: R * 1.85, fill: '#b9bdbe' }), s('circle', { cx, cy: cx, r: R * 1.85, fill: 'none', stroke: '#8d9192', 'stroke-width': 1 }), s('circle', { cx, cy: cx, r: R * 1.08, fill: '#0e0e0e' })); for (let i = 0; i < 72; i++) { const a = (i / 72) * Math.PI * 2; sv.append(s('circle', { cx: cx + Math.cos(a) * R * 1.74, cy: cx + Math.sin(a) * R * 1.74, r: 1.5, fill: '#f4f4f4' })); } }
    for (let i = 0; i < ticks; i++) { const a = ((-span / 2 + (span * i) / (ticks - 1) - 90) * Math.PI) / 180; const r1 = R * (bezel ? 1.62 : 1.12), r2 = R * (bezel ? 1.62 : 1.45);
      if (!bezel) sv.append(s('line', { x1: cx + Math.cos(a) * r1, y1: cx + Math.sin(a) * r1, x2: cx + Math.cos(a) * r2, y2: cx + Math.sin(a) * r2, stroke: '#e6e8e8', 'stroke-width': 2, 'stroke-linecap': 'butt' }));
      if (nums) sv.append(s('text', { x: cx + Math.cos(a) * R * (bezel ? 1.4 : 1.75), y: cx + Math.sin(a) * R * (bezel ? 1.4 : 1.75) + 5, 'text-anchor': 'middle', fill: bezel ? '#1d1d1d' : '#c9cccd', 'font-size': bezel ? 15 : 11, 'font-weight': 700, 'font-family': 'Arial,Helvetica,sans-serif' }, nums[i])); }
    if (dot) { const a = ((span / 2 - 90 + 12) * Math.PI) / 180; sv.append(s('circle', { cx: cx + Math.cos(a) * R * 1.32, cy: cx + Math.sin(a) * R * 1.32, r: 2.6, fill: C.org })); }
    const rot = h('div.rot'); const rs = s('svg', { width: S, height: S, viewBox: `0 0 ${S} ${S}`, style: 'position:absolute;inset:0' });
    const capC = cap === 'org' ? C.org : cap === 'white' ? C.wk : '#141414';
    rs.append(s('circle', { cx, cy: cx, r: R, fill: '#0e0e0e' }), s('circle', { cx, cy: cx, r: R * (cap === 'black' ? 0.98 : 0.66), fill: capC }));
    if (cap === 'black') { rs.append(s('circle', { cx, cy: cx, r: R * 0.98, fill: 'url(#t8g)' })); rs.append(s('rect', { x: cx - 3, y: cx - R * 0.92, width: 6, height: R * 0.42, rx: 1, fill: C.org })); }
    else rs.append(s('rect', { x: cx - 1.8, y: cx - R * 0.98, width: 3.6, height: R * 0.62, rx: 1, fill: '#0e0e0e' }));
    rot.append(rs); k.append(sv, rot); P.append(k);
    const o = { el: k, v, def: def ?? v, set(nv, fire = true) { o.v = clamp(nv, 0, 1); rot.style.transform = `rotate(${-span / 2 + span * o.v}deg)`; if (fire) on(o.v); } };
    o.set(v, false);
    let y0 = 0, v0 = 0;
    k.addEventListener('pointerdown', (e) => { e.preventDefault(); y0 = e.clientY; v0 = o.v; k.classList.add('grab'); try { k.setPointerCapture(e.pointerId); } catch {}
      const mv = (ev) => o.set(v0 + (y0 - ev.clientY) / 160); const up = () => { k.classList.remove('grab'); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); });
    k.addEventListener('wheel', (e) => { e.preventDefault(); o.set(o.v - Math.sign(e.deltaY) * 0.03); }, { passive: false });
    k.addEventListener('dblclick', () => o.set(o.def));
    knobs.push(o); return o;
  };
  P.append(s('svg', { width: 0, height: 0, style: 'position:absolute' }, s('defs', {}, s('radialGradient', { id: 't8g', cx: '45%', cy: '35%', r: '70%' }, s('stop', { offset: '0', 'stop-color': '#3a3a3a' }), s('stop', { offset: '.7', 'stop-color': '#151515' }), s('stop', { offset: '1', 'stop-color': '#0b0b0b' })))));
  // ---------- top bar ----------
  const icoUp = '<svg width="22" height="18" viewBox="0 0 24 20"><path d="M6 16H5a4 4 0 0 1-.6-8A6 6 0 0 1 16 6.5 4.5 4.5 0 0 1 19 16h-1" fill="none" stroke="#2b2410" stroke-width="2.2"/><path d="M12 18V9m-3.5 3.5L12 9l3.5 3.5" fill="none" stroke="#2b2410" stroke-width="2.2"/></svg>';
  const icoDn = '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 15v5h18v-5" fill="none" stroke="#2b2410" stroke-width="2.2"/><path d="M12 3v12m-4-4 4 4 4-4" fill="none" stroke="#2b2410" stroke-width="2.2"/></svg>';
  ab(25, 28, h('button.tb', { style: { width: '37px', display: 'grid', placeItems: 'center' }, title: 'Load pattern', html: icoUp, onclick: () => toast('pattern load (demo)') }));
  ab(73, 28, h('button.tb', { style: { width: '37px', display: 'grid', placeItems: 'center' }, title: 'Save pattern', html: icoDn, onclick: () => { copy(JSON.stringify(pat), 'Pattern JSON copied'); } }));
  ab(115, 28, h('button.tb', { style: { width: '52px' }, onclick: () => reset() }, 'Reset'));
  ab(1386, 26, h('div', { html: '<svg width="30" height="30" viewBox="0 0 16 16"><path fill="#3a3c3d" d="M8 0a8 8 0 0 0-2.5 15.6c.4 0 .5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.6 7.6 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.8-3.6 4 .3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 8 0z"/></svg>' }));
  P.append(h('div.grey', { style: { left: 0, top: '70px', width: '1440px', height: '3px' } }));
  // ---------- voices ----------
  const VO = [
    { id: 'AC', lab: 'ACcent', k: [['LEVEL']] },
    { id: 'BD', lab: 'BassDrum', k: [['LEVEL'], ['TONE'], ['DECAY']] },
    { id: 'SD', lab: 'SnareDrum', k: [['LEVEL'], ['TONE'], ['SNAPPY']] },
    { id: 'LT', lab: 'LowTom', alt: 'LowConga', k: [['LEVEL'], ['TUNING']] },
    { id: 'MT', lab: 'MidTom', alt: 'MidConga', k: [['LEVEL'], ['TUNING']] },
    { id: 'HT', lab: 'HiTom', alt: 'HiConga', k: [['LEVEL'], ['TUNING']] },
    { id: 'RS', lab: 'RimShot', alt: 'CLaves', k: [['LEVEL']] },
    { id: 'CP', lab: 'handClaP', alt: 'MAracas', k: [['LEVEL']] },
    { id: 'CB', lab: 'CowBell', k: [['LEVEL']] },
    { id: 'CY', lab: 'CYmbal', k: [['LEVEL'], ['TONE'], ['DECAY']] },
    { id: 'OH', lab: 'OpenHihat', k: [['LEVEL'], null, ['DECAY']] },
    { id: 'CH', lab: 'ClsdHihat', k: [['LEVEL']] }];
  const DEF = { BD: [0, 3, 8, 11], SD: [4, 12], LT: [], MT: [14], HT: [], RS: [7], CP: [12], CB: [], CY: [], OH: [6, 14], CH: [0, 2, 4, 8, 10, 12], AC: [0, 8] };
  let pat = {}; const freshPat = () => { const p = {}; for (const v of VO) p[v.id] = Array.from({ length: 16 }, (_, i) => (DEF[v.id] || []).includes(i)); return p; }; pat = freshPat();
  const prm = {}; const alt = {};
  const SX = 340, SW = 90;
  VO.forEach((v, i) => { const cx = SX + SW * i + SW / 2; prm[v.id] = {}; alt[v.id] = false;
    if (i) P.append(h('div.div', { style: { left: SX + SW * i - 1 + 'px' } }));
    v.k.forEach((kk, row) => { if (!kk) return; const name = kk[0]; const ys = [138, 239, 338][row]; lab(cx, ys - 47, name);
      const lvl = name === 'LEVEL'; const dv = lvl ? 0.72 : 0.5; prm[v.id][name] = dv;
      knob({ x: cx, y: ys, d: lvl ? 36 : 32, cap: lvl ? 'org' : 'white', v: dv, dot: lvl, on: (val) => { prm[v.id][name] = val; } }); });
    if (v.alt) { const y1 = v.k.length >= 2 ? 288 : 288; ab(cx - 41, y1, h('div.ck', { style: { width: '82px', fontSize: '16px' } }, v.alt));
      const sw = ab(cx - 10, 332, h('div.sw', { title: `${v.lab} ⇄ ${v.alt}` })); const kn = h('i', { style: { top: '24px' } }); sw.append(kn);
      sw.addEventListener('click', () => { alt[v.id] = !alt[v.id]; kn.style.top = alt[v.id] ? '4px' : '24px'; play(v.id, 0); }); v.swEl = kn; }
    v.ckEl = ab(cx - 41, 391, h('div.ck', { style: { width: '82px' }, onclick: () => { select(i); play(v.id, 0); } }, v.lab)); });
  P.append(h('div.grey', { style: { left: SX - 2 + 'px', top: '73px', width: '2px', height: '500px' } }));
  P.append(h('div.grey', { style: { left: '0', top: '574px', width: '1440px', height: '3px' } }));
  // wordmark
  P.append(h('div', { style: { position: 'absolute', left: '349px', top: '509px', width: '896px', height: '2px', background: C.org } }));
  ab(632, 462, h('div', { style: { font: `400 46px/1 ${WM}`, color: C.org, letterSpacing: '.005em', whiteSpace: 'nowrap' } }, 'Rhythm Composer'));
  ab(1082, 469, h('div', { style: { font: `400 38px/1 ${WM}`, color: C.org } }, 'iO-808'));
  ab(980, 521, h('div', { style: { font: `400 25px/1 ${WM}`, color: '#a3a7a8' } }, 'Browser Controlled'));
  const master = knob({ x: 1336, y: 495, d: 46, cap: 'black', v: 0.6, ticks: 10, nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ring: 2.2, on: (v) => { if (out) out.gain.value = v * 0.9; } });
  lab(1336, 552, 'MASTER VOLUME'); lab(1306, 538, 'MIN', { fontSize: '10px' }); lab(1366, 538, 'MAX', { fontSize: '10px' });
  // ---------- left controls ----------
  const line = (x, y, w, hh) => P.append(h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px', background: '#e6e8e8' } }));
  line(24, 92, 2, 210); line(24, 92, 18, 2); line(24, 300, 30, 2);
  ab(40, 82, h('div', { style: { border: '2px solid #e6e8e8', padding: '2px 4px', font: `700 12px/1 ${HV}`, color: '#fff', background: C.bg } }, 'PATTERN WRITE'));
  lab(78, 117, '2nd', { fontSize: '12px', color: '#fff' }); lab(78, 129, 'PART', { fontSize: '12px', color: '#fff' }); lab(46, 139, '1st', { fontSize: '12px', color: '#fff' }); lab(46, 151, 'PART', { fontSize: '12px', color: '#fff' });
  ab(115, 116, h('div', { style: { border: '2px solid #9b9fa0', padding: '2px 3px', font: `700 11px/1.05 ${HV}`, color: '#c9cccd', textAlign: 'center' } }, 'MANUAL', h('br'), 'PLAY'));
  lab(170, 146, 'PLAY', { color: C.org, fontSize: '12px' }); lab(166, 166, 'COM-', { color: C.org, fontSize: '12px' }); lab(166, 178, 'POSE', { color: C.org, fontSize: '12px' });
  const modeK = knob({ x: 96, y: 186, d: 70, cap: 'black', v: 0.75, ticks: 4, ring: 1.3, span: 180, on: () => {} });
  ab(70, 240, h('div', { style: { border: '2px solid #e6e8e8', padding: '2px 4px', font: `700 12px/1 ${HV}`, color: '#fff', background: C.bg } }, 'PATTERN CLEAR'));
  lab(70, 262, 'STEP', { fontSize: '12px', color: '#fff' }); lab(70, 274, 'NUMBER', { fontSize: '12px', color: '#fff' });
  lab(54, 289, 'PRE-', { fontSize: '12px', color: '#fff' }); lab(54, 301, 'SCALE', { fontSize: '12px', color: '#fff' });
  ab(82, 287, h('div', { title: 'Track clear — clears the selected instrument', style: { width: '26px', height: '26px', borderRadius: '50%', background: '#d03933', boxShadow: '0 0 0 3px #111', cursor: 'pointer' }, onclick: () => { pat[VO[sel].id].fill(false); paint(); } }));
  ab(112, 264, h('div', { style: { font: `700 12px/1.05 ${HV}`, color: C.org } }, 'TRACK', h('br'), 'CLEAR'));
  ab(76, 318, h('div', { style: { font: `700 10.5px/1.15 ${HV}`, color: '#fff', textAlign: 'center' } }, 'Drag to a Step', h('br'), 'Button to set', h('br'), 'Pattern Length'));
  line(216, 92, 2, 210);
  lab(275, 76, 'INSTRUMENT-SELECT', { fontSize: '12px', color: '#fff' });
  ab(198, 93, h('div', { style: { border: '2px solid ' + C.org, padding: '1px 6px', font: `700 11px/1 ${HV}`, color: C.org, letterSpacing: '.02em' } }, 'RHYTHMTRACK'));
  // instrument select rotary
  const ISX = 257, ISY = 190, IDS = ['AC', 'BD', 'SD', 'LT', 'MT', 'HT', 'RS', 'CP', 'CB', 'CY', 'OH', 'CH'];
  const angOf = (i) => ((105 + 30 * i) * Math.PI) / 180; // AC bottom → clockwise, 30° per voice (matches knob span 330/11)
  const ilEls = IDS.map((id, i) => { const a = angOf(i); const el = h('div.il', { style: { left: ISX + Math.cos(a) * 74 + 'px', top: ISY + Math.sin(a) * 70 + 'px' }, onclick: () => { select(VO.findIndex((v) => v.id === id)); play(id, 0); } }, id); P.append(el);
    P.append(h('div.in', { style: { left: ISX + Math.cos(a) * 46 + 'px', top: ISY + Math.sin(a) * 45 + 'px' } }, String(i || 12))); return el; });
  const isK = knob({ x: ISX, y: ISY, d: 56, cap: 'black', v: 1 / 11, ticks: 2, ring: 1.05, span: 330, on: (v) => { const i = Math.round(v * 11); if (i !== sel) select(i, false); } });
  // auto fill in
  lab(259, 288, '', {}); const af = [16, 12, 8, 4, 2]; [[-60, 16], [-25, 12], [8, 8], [40, 4], [70, 2]].forEach(([dg, n]) => { const a = ((dg - 90) * Math.PI) / 180; P.append(h('div.lb', { style: { left: 259 + Math.cos(a) * 52 + 'px', top: 344 + Math.sin(a) * 50 - 6 + 'px', fontSize: '11px' } }, String(n))); });
  lab(192, 340, 'MANUAL', { fontSize: '11px' });
  knob({ x: 259, y: 344, d: 54, cap: 'black', v: 0.12, ticks: 6, ring: 1.25, span: 200 });
  lab(259, 386, 'MEASURES', { fontSize: '11px' }); lab(259, 399, 'AUTO FILL IN', { fontSize: '15px' });
  P.append(h('div', { style: { position: 'absolute', left: '170px', top: '296px', width: '170px', height: '2px', background: '#e6e8e8' } }));
  // tempo
  lab(96, 366, 'TEMPO', { fontSize: '17px' });
  const bpmEl = ab(96, 386, h('div.bpm'));
  const tempo = knob({ x: 96, y: 478, d: 78, cap: 'black', v: 0.4, ticks: 11, nums: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], bezel: true, ring: 2.0, span: 300, on: () => showBpm() });
  lab(267, 452, 'FINE', { fontSize: '14px' });
  const fine = knob({ x: 267, y: 502, d: 38, cap: 'black', v: 0.5, ticks: 9, ring: 1.85, span: 270, on: () => showBpm() });
  lab(244, 540, 'SLOW', { fontSize: '11px' }); lab(292, 540, 'FAST', { fontSize: '11px' });
  const bpm = () => Math.round(40 + tempo.v * 200 + (fine.v - 0.5) * 20);
  let bpmT; const showBpm = () => { bpmEl.textContent = bpm() + ' BPM'; bpmEl.classList.add('on'); clearTimeout(bpmT); bpmT = setTimeout(() => bpmEl.classList.remove('on'), 900); };
  // ---------- bottom section ----------
  P.append(h('div.grey', { style: { left: '20px', top: '590px', width: '1400px', height: '276px', borderRadius: '8px' } }));
  P.append(h('div', { style: { position: 'absolute', left: '211px', top: '590px', width: '1040px', height: '232px', background: '#252627', borderRadius: '0 0 8px 8px' } }));
  P.append(h('div', { style: { position: 'absolute', left: '1012px', top: '822px', width: '20px', height: '44px', background: '#252627' } }));
  // note-timing bars
  const nbar = (x, y, w, hh, notes) => { const b = h('div.nb', { style: { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' } }); const sv = s('svg', { width: w, height: hh, style: 'position:absolute;inset:0' });
    notes.forEach((nx, j) => { sv.append(s('text', { x: nx, y: hh - 6, 'font-size': 18, fill: '#111' }, notes.length > 1 ? '♪' : '♩')); });
    if (notes.length > 1) sv.append(s('path', { d: `M${notes[0] + 12} ${hh - 18} Q${(notes[0] + notes[notes.length - 1]) / 2 + 6} ${hh - 30} ${notes[notes.length - 1] + 2} ${hh - 18}`, fill: 'none', stroke: '#111', 'stroke-width': 1.3 }));
    b.append(sv); P.append(b); };
  const NBX = (a, b) => [342 + (a - 243) * 1.406, (b - a) * 1.406];
  [[243, 362], [365, 480], [487, 600], [607, 720], [728, 845], [850, 880]].forEach(([a, b], g) => { const [x, w] = NBX(a, b); nbar(x, 593, w, 28, g === 5 ? [6] : [8, w / 2 - 6, w - 22]); });
  [[243, 482], [487, 720], [728, 880]].forEach(([a, b]) => { const [x, w] = NBX(a, b); nbar(x, 626, w, 26, [8, w / 2 - 6, w - 22]); });
  [[243, 398], [403, 560], [567, 720], [728, 880]].forEach(([a, b]) => { const [x, w] = NBX(a, b); nbar(x, 655, w, 25, [10]); });
  [[243, 560], [567, 880]].forEach(([a, b]) => { const [x, w] = NBX(a, b); nbar(x, 683, w, 25, [10]); });
  ab(221, 708, h('div.tag', { style: { width: '84px' } }, 'STEP NO'));
  lab(270, 596, 'PRE-SCALE', { fontSize: '12px', color: '#5c6061' });
  P.append(h('div', { style: { position: 'absolute', left: '260px', top: '614px', width: '16px', height: '64px', background: '#141414', borderRadius: '2px' } }, h('div', { style: { position: 'absolute', left: '3px', top: '30px', width: '10px', height: '16px', background: '#4a4d4e' } })));
  ['1', '2', '3', '4'].forEach((n, j) => lab(292, 620 + j * 16, n, { fontSize: '10px', color: '#5c6061' }));
  const led1 = ab(260, 731, h('div.led.on')); lab(267, 755, '1st PART', { fontSize: '12px' });
  const led2 = ab(260, 781, h('div.led')); lab(267, 805, '2nd PART', { fontSize: '12px' });
  const PCOL = ['#d03933', '#d03933', '#d03933', '#d03933', '#e98e2f', '#e98e2f', '#e98e2f', '#e98e2f', '#dfd442', '#dfd442', '#dfd442', '#dfd442', '#e9e8e7', '#e9e8e7', '#e9e8e7', '#e9e8e7'];
  const padX = (i) => 342 + i * 56.2;
  const pads = PCOL.map((c, i) => { P.append(h('div.pn', { style: { left: padX(i) + 'px' } }, String(i + 1)));
    const p = h('div.pad', { style: { left: padX(i) + 'px', background: c }, onpointerdown: (e) => { e.preventDefault(); toggleStep(i); } }, h('i')); P.append(p); return p; });
  // basic rhythm numbers
  ab(138, 836, h('div.tag', {}, 'BASIC RHYTHM'));
  for (let i = 0; i < 12; i++) P.append(h('div.bn', { style: { left: padX(i) + 'px' } }, String(i + 1)));
  for (let i = 0; i < 4; i++) P.append(h('div.bn', { style: { left: padX(12 + i) + 'px' } }, String(i + 1)));
  ab(1270, 836, h('div', { style: { position: 'absolute', height: '22px', background: '#c9cccd', color: '#111', font: `700 12px/22px ${HV}`, padding: '0 10px 0 22px', clipPath: 'polygon(12px 0,100% 0,100% 100%,12px 100%,0 50%)', whiteSpace: 'nowrap' } }, 'INTRO/FILL IN'));
  // left panel
  lab(115, 604, 'BASIC VARIATION', { fontSize: '12px', color: '#1b1c1d' });
  let varAB = 0; const tog1 = ab(86, 628, h('div.tog')); const tk1 = h('i', { style: { left: '3px' } }); tog1.append(tk1);
  const vlab = ['A', 'AB', 'B']; vlab.forEach((t, j) => lab(92 + j * 23, 660, t, { fontSize: '11px', color: '#1b1c1d' }));
  P.append(h('div', { style: { position: 'absolute', left: '77px', top: '683px', width: '78px', height: '30px', background: '#111', borderRadius: '2px' } }));
  const lA = ab(88, 691, h('div.led.on')), lB = ab(130, 691, h('div.led'));
  tog1.addEventListener('click', () => { varAB = (varAB + 1) % 3; tk1.style.left = [3, 19, 35][varAB] + 'px'; lA.classList.toggle('on', varAB !== 2); lB.classList.toggle('on', varAB !== 0); });
  P.append(h('div', { style: { position: 'absolute', left: '30px', top: '732px', width: '172px', height: '2px', background: '#252627' } }));
  const ssBtn = ab(49, 755, h('div.ss', { onpointerdown: (e) => { e.preventDefault(); toggle(); } }, h('div', { style: { paddingTop: '13px' } }, 'START'), h('div', { style: { width: '84px', height: '1.5px', background: '#4b4020', margin: '4px auto' } }), h('div', {}, 'STOP')));
  // right panel
  lab(1336, 604, 'I / F - VARIATION', { fontSize: '12px', color: '#1b1c1d' });
  let ifv = 0; const tog2 = ab(1307, 628, h('div.tog')); const tk2 = h('i', { style: { left: '3px' } }); tog2.append(tk2); lab(1315, 660, 'A', { fontSize: '11px', color: '#1b1c1d' }); lab(1358, 660, 'B', { fontSize: '11px', color: '#1b1c1d' });
  tog2.addEventListener('click', () => { ifv ^= 1; tk2.style.left = ifv ? '35px' : '3px'; });
  P.append(h('div', { style: { position: 'absolute', left: '1270px', top: '689px', width: '134px', height: '2px', background: '#252627' } }));
  lab(1336, 700, 'INTRO SET', { fontSize: '12px', color: '#1b1c1d' }); P.append(h('div', { style: { position: 'absolute', left: '1280px', top: '716px', width: '112px', height: '1.5px', background: '#252627' } })); lab(1336, 722, 'FILL IN TRIGGER', { fontSize: '12px', color: '#1b1c1d' });
  ab(1308, 755, h('div', { style: { width: '56px', height: '58px', borderRadius: '3px', background: '#a29159', color: '#e6d9a0', font: `700 12px/58px ${HV}`, textAlign: 'center' } }, 'TAP'));
  // footer
  ab(31, 876, h('div.ft', {}, h('u', {}, 'Tutorial')));
  ab(585, 876, h('div.ft', {}, 'Made with ♥ by ', h('u', {}, 'Vincent Riemer'), ' · clone'));
  ab(1302, 876, h('div.ft', {}, h('u', {}, 'Report an Issue')));
  // ---------- state & UI ----------
  let sel = 1;
  const paint = () => { const row = pat[VO[sel].id]; pads.forEach((p, i) => p.classList.toggle('on', row[i])); VO.forEach((v, i) => v.ckEl.classList.toggle('sel', i === sel)); ilEls.forEach((e, i) => e.classList.toggle('sel', IDS[i] === VO[sel].id)); };
  const select = (i, turn = true) => { sel = clamp(i, 0, 11); if (turn) isK.set(IDS.indexOf(VO[sel].id) / 11, false); paint(); };
  const toggleStep = (i) => { const row = pat[VO[sel].id]; row[i] = !row[i]; paint(); };
  // ---------- WebAudio TR-808 voices ----------
  let out = null; const bus = () => { const ac = audio(); if (!ac) return null; if (!out) { out = ac.createGain(); out.gain.value = master.v * 0.9; const comp = ac.createDynamicsCompressor(); comp.threshold.value = -10; out.connect(comp).connect(ac.destination); } return ac; };
  let noiseBuf = null; const noise = (ac) => { if (!noiseBuf) { noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } const n = ac.createBufferSource(); n.buffer = noiseBuf; return n; };
  let ohG = null;
  const env = (ac, t, peak, dec, att = 0.001) => { const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + dec); return g; };
  const metal = (ac, t, peak, dec, hp) => { const g = env(ac, t, peak, dec); const f1 = ac.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 10000; const f2 = ac.createBiquadFilter(); f2.type = 'highpass'; f2.frequency.value = hp; f1.connect(f2).connect(g);
    [205.3, 304.4, 369.6, 522.7, 540, 800].forEach((fq) => { const o = ac.createOscillator(); o.type = 'square'; o.frequency.value = fq * 1.7; o.connect(f1); o.start(t); o.stop(t + dec + 0.05); }); return g; };
  const play = (id, when = 0, acc = false) => { const ac = bus(); if (!ac) return; const t = (when || ac.currentTime) + 0.002; const P2 = prm[id]; const L = (P2.LEVEL ?? 0.7) * (acc ? 1.45 : 1); if (L < 0.01) return; let g;
    if (id === 'AC') return;
    if (id === 'BD') { const o = ac.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.08); const dec = 0.18 + P2.DECAY * 0.9; g = env(ac, t, L * 1.1, dec); const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 160 + P2.TONE * 2400; o.connect(lp).connect(g); o.start(t); o.stop(t + dec + 0.05);
      const ck = ac.createOscillator(); ck.frequency.value = 1400; const cg = env(ac, t, L * 0.12 * (0.3 + P2.TONE), 0.012); ck.connect(cg).connect(out); ck.start(t); ck.stop(t + 0.03); }
    else if (id === 'SD') { g = ac.createGain(); g.gain.value = 1; [185, 330].forEach((fq, j) => { const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.value = fq * (0.9 + P2.TONE * 0.3); const og = env(ac, t, L * (j ? 0.25 : 0.4), 0.13); o.connect(og).connect(g); o.start(t); o.stop(t + 0.2); });
      const n = noise(ac); const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800; const ng = env(ac, t, L * (0.1 + P2.SNAPPY * 0.55), 0.09 + P2.SNAPPY * 0.15); n.connect(hp).connect(ng).connect(g); n.start(t); n.stop(t + 0.35); }
    else if (['LT', 'MT', 'HT'].includes(id)) { const base = { LT: 95, MT: 135, HT: 190 }[id] * (0.75 + P2.TUNING * 0.5) * (alt[id] ? 1.9 : 1); const o = ac.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(base * 1.25, t); o.frequency.exponentialRampToValueAtTime(base, t + 0.06); const dec = alt[id] ? 0.18 : 0.42; g = env(ac, t, L * 0.75, dec); o.connect(g); o.start(t); o.stop(t + dec + 0.05); }
    else if (id === 'RS') { if (alt.RS) { const o = ac.createOscillator(); o.frequency.value = 2500; g = env(ac, t, L * 0.5, 0.05); o.connect(g); o.start(t); o.stop(t + 0.08); } else { const o = ac.createOscillator(); o.type = 'square'; o.frequency.value = 1700; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1700; bp.Q.value = 3; g = env(ac, t, L * 0.45, 0.035); o.connect(bp).connect(g); o.start(t); o.stop(t + 0.06); } }
    else if (id === 'CP') { const n = noise(ac); const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = alt.CP ? 6000 : 1100; bp.Q.value = alt.CP ? 1 : 2.2; g = ac.createGain(); g.gain.setValueAtTime(0.0001, t);
      if (alt.CP) { g.gain.exponentialRampToValueAtTime(L * 0.4, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06); } else { [0, 0.011, 0.022].forEach((dt) => { g.gain.setValueAtTime(L * 0.9, t + dt); g.gain.exponentialRampToValueAtTime(0.05, t + dt + 0.009); }); g.gain.setValueAtTime(L * 0.7, t + 0.033); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28); }
      n.connect(bp).connect(g); n.start(t); n.stop(t + 0.32); }
    else if (id === 'CB') { g = env(ac, t, L * 0.35, 0.32); const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2640; bp.Q.value = 1; bp.connect(g); [540, 800].forEach((fq) => { const o = ac.createOscillator(); o.type = 'square'; o.frequency.value = fq; o.connect(bp); o.start(t); o.stop(t + 0.35); }); }
    else if (id === 'CY') { g = metal(ac, t, L * 0.35, 0.6 + P2.DECAY * 1.6, 4000 + (1 - P2.TONE) * 3000); }
    else if (id === 'OH') { if (ohG) { try { ohG.gain.cancelScheduledValues(t); ohG.gain.setTargetAtTime(0.0001, t, 0.005); } catch {} } g = metal(ac, t, L * 0.3, 0.15 + P2.DECAY * 0.6, 7000); ohG = g; }
    else if (id === 'CH') { if (ohG) { try { ohG.gain.cancelScheduledValues(t); ohG.gain.setTargetAtTime(0.0001, t, 0.004); } catch {} ohG = null; } g = metal(ac, t, L * 0.3, 0.05, 7500); }
    if (g) g.connect(out); };
  // ---------- sequencer (lookahead scheduler) ----------
  let running = false, step = 0, nextT = 0, timer = null; const vis = [];
  const sched = () => { const ac = audio(); if (!ac) return; while (nextT < ac.currentTime + 0.12) { const acc = pat.AC[step]; for (const v of VO) if (v.id !== 'AC' && pat[v.id][step]) play(v.id, nextT, acc); vis.push([step, nextT]); nextT += 60 / bpm() / 4; step = (step + 1) % 16; } };
  let raf = 0, curStep = -1; const draw = () => { const ac = audio(); while (vis.length && ac && vis[0][1] <= ac.currentTime) { curStep = vis.shift()[0]; pads.forEach((p, i) => p.classList.toggle('cur', i === curStep)); led1.classList.toggle('on', true); } if (running) raf = requestAnimationFrame(draw); };
  const start = () => { const ac = bus(); if (!ac || running) return; running = true; step = 0; nextT = ac.currentTime + 0.05; vis.length = 0; sched(); timer = setInterval(sched, 25); ssBtn.classList.add('on'); raf = requestAnimationFrame(draw); };
  const stop = () => { running = false; clearInterval(timer); cancelAnimationFrame(raf); vis.length = 0; curStep = -1; pads.forEach((p) => p.classList.remove('cur')); ssBtn.classList.remove('on'); };
  const toggle = () => (running ? stop() : start());
  window.addEventListener('keydown', (e) => { if (e.code === 'Space' && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) { e.preventDefault(); toggle(); } });
  const reset = () => { stop(); pat = freshPat(); knobs.forEach((k) => k.set(k.def)); VO.forEach((v) => { alt[v.id] = false; if (v.swEl) v.swEl.style.top = '24px'; }); select(1); varAB = 0; tk1.style.left = '3px'; lA.classList.add('on'); lB.classList.remove('on'); ifv = 0; tk2.style.left = '3px'; };
  select(1); fit();
  window.__demoProof = async () => { const o = []; reset();
    const bdLevel = knobs[1]; const r = bdLevel.el.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const before = bdLevel.v;
    bdLevel.el.dispatchEvent(new PointerEvent('pointerdown', { clientX: cx, clientY: cy, bubbles: true, pointerId: 3, buttons: 1 }));
    for (let k = 1; k <= 8; k++) { window.dispatchEvent(new PointerEvent('pointermove', { clientX: cx, clientY: cy + k * 6, bubbles: true, pointerId: 3, buttons: 1 })); await sleep(10); }
    window.dispatchEvent(new PointerEvent('pointerup', { clientX: cx, clientY: cy + 48, bubbles: true, pointerId: 3 }));
    o.push(`BD LEVEL knob dragged down ${before.toFixed(2)}→${bdLevel.v.toFixed(2)} (rot ${bdLevel.el.querySelector('.rot').style.transform})`);
    ilEls[2].click(); o.push(`instrument-select → ${VO[sel].id}`);
    const lit0 = pads.filter((p) => p.classList.contains('on')).length; pads[2].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); pads[10].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    o.push(`SD pads 3+11 toggled: lit LEDs ${lit0}→${pads.filter((p) => p.classList.contains('on')).length}`);
    tempo.set(0.7); o.push(`tempo dial → ${bpm()} BPM`);
    const mv = master.v; master.set(0.02); start(); await sleep(700); const seen = curStep; o.push(`START → running=${running}, step light at pad ${seen + 1}`); await sleep(250); o.push(`step light moved to pad ${curStep + 1}`);
    stop(); master.set(mv); o.push(`STOP → running=${running}`);
    reset(); o.push('reset to default pattern/knobs'); return o.join('; '); };
};

V['plink-starfield-multiplayer-music-lobby-tilted-condensed-sticker-words-orbit-rings'] = (root, T) => {
  import('@fontsource/barlow-condensed/500.css'); import('@fontsource/barlow-condensed/600.css'); import('@fontsource/barlow-condensed/700.css'); import('@fontsource/barlow-condensed/800-italic.css'); import('@fontsource/barlow-condensed/900-italic.css');
  theme(root, T, { bg: '#000', fg: '#fff', ac: '#12a454', dark: true });
  const BC = "'Barlow Condensed','Oswald','Arial Narrow',sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  css(`.pk{position:absolute;inset:0;overflow:hidden;background:#000;color:#fff;font-family:${BC};user-select:none}
.pk *{box-sizing:border-box}
.pk-stars{position:absolute;inset:0;width:100%;height:100%}
.pk-hd{position:absolute;left:0;right:0;top:0;height:53px;background:#0b0b0b;display:flex;align-items:center;padding:0 18px;gap:0;z-index:5;font:600 10px ${BC};letter-spacing:.2em;color:#9c9c9c}
.pk-hd a{cursor:pointer;transition:color .15s}.pk-hd a:hover{color:#fff}
.pk-hd .sep{width:1px;height:22px;background:#444;margin:0 20px}
.pk-logo{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:4px;font:700 14px ${BC};letter-spacing:.16em;color:#8a8a8a;cursor:pointer}
.pk-logo span{background:#8a8a8a;color:#0b0b0b;padding:1px 14px 1px 10px;clip-path:polygon(0 0,100% 0,88% 100%,0 100%);letter-spacing:.14em}
.pk-hr{margin-left:auto;display:flex;align-items:center;gap:20px}
.pk-card{position:absolute;left:50%;top:50%;width:385px;transform:translate(-50%,-50%);z-index:6;transition:opacity .35s,transform .35s}
.pk-card.off{opacity:0;transform:translate(-50%,-46%);pointer-events:none}
.pk-card h1{margin:0 0 20px;font:700 21px/1.1 ${BC};letter-spacing:.17em}
.pk-card p{margin:0 0 16px;font:700 12.5px/1.4 ${BC};letter-spacing:.17em}
.pk-btn{position:relative;display:flex;align-items:center;gap:18px;height:35px;padding:0 18px;margin-bottom:5px;font:700 13px ${BC};letter-spacing:.2em;cursor:pointer;clip-path:polygon(0 0,100% 0,100% 62%,96.6% 100%,0 100%);transition:filter .15s,transform .15s}
.pk-btn:hover{filter:brightness(1.15);transform:translateX(3px)}
.pk-btn.ok{background:#12a454}.pk-btn.cf{background:#5c5c5c;clip-path:polygon(0 0,100% 0,100% 38%,96.6% 0,100% 0,100% 0,96.6% 100%,0 100%)}
.pk-btn.cf{clip-path:polygon(0 0,100% 0,96.6% 100%,0 100%)}
.pk-links{margin-top:20px;font:700 9.5px ${BC};letter-spacing:.17em}.pk-links a{text-decoration:underline;cursor:pointer}
.pk-cfg{margin:12px 0 0;display:none;gap:8px;font:600 11px ${BC};letter-spacing:.16em}.pk-cfg.on{display:grid}
.pk-cfg label{display:flex;justify-content:space-between;align-items:center;background:#1b1b1b;padding:8px 12px;cursor:pointer}
.pk-cfg input{accent-color:#12a454}
.pk-lob{position:absolute;inset:53px 0 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;z-index:3;transition:opacity .4s}
.pk-lob.off{opacity:0;pointer-events:none}
.pk-tit{font:900 italic 30px ${BC};letter-spacing:.06em;color:#ddd;margin-bottom:18px;transform:rotate(-3deg)}
.pk-tit b{display:inline-block;color:#000;background:#e8c547;padding:0 12px;clip-path:polygon(4% 0,100% 0,96% 100%,0 100%)}
.pk-w{position:relative;font:800 italic 84px/.98 ${BC};letter-spacing:.01em;cursor:pointer;padding:0 22px;filter:saturate(.62) brightness(.82);transition:transform .35s cubic-bezier(.3,1.6,.5,1),filter .25s}
.pk-w:hover,.pk-w.hov{filter:none;transform:rotate(var(--r)) translateY(-8px) scale(1.06)!important}
.pk-w span{position:relative;z-index:2;text-shadow:0 4px 0 #0008}
.pk-ring{position:absolute;left:50%;top:50%;border:1px solid currentColor;border-radius:50%;opacity:.35;pointer-events:none;animation:pkOrb var(--t) linear infinite}
.pk-ring::after{content:'';position:absolute;left:50%;top:-4px;width:7px;height:7px;margin-left:-3.5px;border-radius:50%;background:currentColor}
.pk-w:hover .pk-ring,.pk-w.hov .pk-ring{opacity:.75}
@keyframes pkOrb{from{transform:translate(-50%,-50%) rotate(0) scaleY(.42)}to{transform:translate(-50%,-50%) rotate(360deg) scaleY(.42)}}
.pk-pop{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:360px;background:#111;border:1px solid #333;padding:22px;z-index:7;font:700 12px/1.5 ${BC};letter-spacing:.15em;display:none}
.pk-pop.on{display:block}.pk-pop h3{margin:0 0 10px;font:800 italic 34px ${BC};letter-spacing:.02em}.pk-pop .code{font:700 28px ${BC};letter-spacing:.4em;color:#e8c547;margin:6px 0 14px}
.pk-play{position:absolute;inset:53px 0 0;z-index:4;display:none}.pk-play.on{display:block}
.pk-play canvas{position:absolute;inset:0;width:100%;height:100%;cursor:crosshair;touch-action:none}
.pk-pick{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;background:#000c;z-index:2}
.pk-pick.off{display:none}.pk-pick h2{margin:0;font:800 italic 46px ${BC};letter-spacing:.03em}
.pk-pick .cs{display:flex;gap:16px}.pk-pick .cs i{width:54px;height:54px;border-radius:50%;cursor:pointer;transition:transform .2s;box-shadow:0 0 0 3px #000,0 0 0 4px #fff3}.pk-pick .cs i:hover{transform:scale(1.15)}
.pk-ui{position:absolute;left:18px;top:14px;display:flex;gap:16px;align-items:center;z-index:1;font:700 11px ${BC};letter-spacing:.2em;color:#aaa}
.pk-ui a{cursor:pointer;color:#fff;background:#222;padding:6px 12px;clip-path:polygon(0 0,100% 0,92% 100%,0 100%)}
.pk-ui .bt{width:10px;height:10px;border-radius:50%;background:#333;transition:background .05s}.pk-ui .bt.on{background:#fff}
.pk-hint{position:absolute;left:0;right:0;bottom:22px;text-align:center;font:700 12px ${BC};letter-spacing:.24em;color:#777;z-index:1;pointer-events:none}
@media (prefers-reduced-motion: reduce){.pk *{animation:none!important;transition:none!important}}
`);
  const el = h('div.pk'); root.append(el);
  // ---------- starfield ----------
  const stars = h('canvas.pk-stars'); el.append(stars);
  const SR = rng(5); const STARS = Array.from({ length: 260 }, () => ({ x: SR(), y: SR(), r: SR() < 0.06 ? 1.6 : 0.4 + SR() * 0.8, p: SR() * 6.28, s: 0.5 + SR() * 2, v: 0.002 + SR() * 0.006 }));
  // ---------- header ----------
  el.append(h('div.pk-hd', {}, h('a', { html: '<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" fill="none" stroke="#9c9c9c" stroke-width="1.5"/><path d="M9 8v5M9 5v1" stroke="#9c9c9c" stroke-width="1.7"/></svg>', style: { marginRight: '38px', display: 'flex' }, onclick: () => showPop('about') }),
    h('a', { onclick: () => toast('Mailing list') }, 'JOIN THE MAILING LIST'), h('i.sep'), h('a', { onclick: () => toast('Thanks for the coffee ☕') }, 'BUY US A COFFEE'),
    h('div.pk-logo', { onclick: () => toLobby() }, 'DINAHMOE', h('span', {}, 'LABS')),
    h('div.pk-hr', {}, h('a', { onclick: () => toast('Create an account') }, 'CREATE AN ACCOUNT'), h('span', {}, '/'), h('a', { onclick: () => toast('Login') }, 'LOGIN'), h('a', { html: '<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8.2" fill="#9c9c9c"/><circle cx="9" cy="7" r="3" fill="#0b0b0b"/><path d="M3.5 14.5c1.4-2.4 3.3-3.3 5.5-3.3s4.1.9 5.5 3.3" fill="#0b0b0b"/></svg>', style: { display: 'flex' } }))));
  // ---------- cookie card ----------
  const cfg = h('div.pk-cfg', {}, ['NECESSARY', 'ANALYTICS', 'ACCOUNTS'].map((t, i) => h('label', {}, t, h('input', { type: 'checkbox', checked: true, disabled: i === 0 }))));
  const card = h('div.pk-card', {}, h('h1', {}, 'WELCOME TO', h('br'), 'DINAHMOE LABS.', h('br'), '...AND WE USE COOKIES.'), h('p', {}, 'WE USE COOKIES TO UNDERSTAND HOW OUR SITE IS USED AND IMPROVE THE USER EXPERIENCE. WE ALSO USE COOKIES FOR USER ACCOUNTS AND AUTHENTICATION.'),
    h('div.pk-btn.ok', { onclick: () => accept() }, h('span', {}, '➜'), h('span', {}, 'THAT’S OK!')), h('div.pk-btn.cf', { onclick: () => cfg.classList.toggle('on') }, h('span', {}, '🔧'), h('span', {}, 'CONFIGURE')), cfg,
    h('div.pk-links', {}, h('a', { onclick: () => toast('Terms & conditions') }, 'TERMS & CONDITIONS'), ' | ', h('a', { onclick: () => toast('Privacy policy') }, 'PRIVACY POLICY')));
  // ---------- lobby ----------
  const WORDS = [['PLAY NOW!', '#3fc1b0', -6, () => toPlay()], ['GO PRIVATE!', '#e0514a', 4, () => showPop('private')], ['SHARE THE LOVE!', '#f0c84a', -3, () => { copy('https://dinahmoelabs.com/plink', 'Link copied — share the love'); }], ['ABOUT', '#a98be0', 5, () => showPop('about')]];
  const wordEls = WORDS.map(([t, c, r, fn], i) => h('div.pk-w', { style: { color: c, transform: `rotate(${r}deg)`, '--r': r + 'deg' }, onclick: fn, onpointerenter: () => blip(midi(64 + i * 3), 0.25, 'triangle', 0.06) },
    h('i.pk-ring', { style: { width: `${150 + i * 20}%`, height: '230%', '--t': `${9 + i * 3}s` } }), h('i.pk-ring', { style: { width: `${110 + i * 14}%`, height: '170%', '--t': `${14 + i * 2}s`, animationDirection: 'reverse' } }), h('span', {}, t)));
  const lob = h('div.pk-lob.off', {}, h('div.pk-tit', {}, h('b', {}, 'PLINK!'), '  MAKE MUSIC WITH STRANGERS'), wordEls);
  const pop = h('div.pk-pop');
  const showPop = (k) => { pop.replaceChildren(...(k === 'private' ? [h('h3', { style: { color: '#e0514a' } }, 'GO PRIVATE!'), 'SEND THIS ROOM CODE TO YOUR FRIENDS:', h('div.code', {}, 'K7QZ'), h('div.pk-btn.ok', { onclick: () => copy('https://dinahmoelabs.com/plink#K7QZ', 'Room link copied') }, h('span', {}, '➜'), h('span', {}, 'COPY ROOM LINK'))]
    : [h('h3', { style: { color: '#a98be0' } }, 'ABOUT'), 'PLINK! IS A MULTIPLAYER MUSIC GAME. PICK A COLOR, HOLD THE MOUSE AND MOVE UP AND DOWN TO PLAY. EVERYONE IN THE ROOM PLAYS IN THE SAME KEY AND TEMPO, SO IT ALWAYS SOUNDS GOOD.']),
    h('div.pk-btn.cf', { style: { marginTop: '12px' }, onclick: () => pop.classList.remove('on') }, h('span', {}, '✕'), h('span', {}, 'CLOSE'))); pop.classList.add('on'); };
  // ---------- play screen ----------
  const pcv = h('canvas'); const beatEls = Array.from({ length: 4 }, () => h('i.bt'));
  const COLORS = ['#3fc1b0', '#e0514a', '#f0c84a', '#a98be0', '#5aa0f0', '#f08bc0'];
  const pick = h('div.pk-pick', {}, h('h2', {}, 'PICK YOUR COLOR'), h('div.cs', {}, COLORS.map((c) => h('i', { style: { background: c }, onclick: () => startPlay(c) }))));
  const play = h('div.pk-play', {}, pcv, pick, h('div.pk-ui', {}, h('a', { onclick: () => toLobby() }, '← LOBBY'), h('span', {}, '4 PLAYERS · 110 BPM · C MINOR PENTATONIC'), ...beatEls), h('div.pk-hint', {}, 'HOLD THE MOUSE AND MOVE UP / DOWN TO PLAY'));
  el.append(lob, play, card, pop);
  const SCL = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24, 27]; const NL = SCL.length;
  const me = { c: COLORS[0], y: 0.5, on: false, trail: [] };
  const bots = [['#5aa0f0', 0], ['#f08bc0', 1], ['#f0c84a', 2]].map(([c, k]) => ({ c, k, y: 0.5, on: false, trail: [] }));
  let mode = 'cookie', tick = 0, notes = 0, beatT = 0, lastStep = 0;
  const STEP = 60000 / 110 / 2;
  const noteOf = (y) => clamp(Math.floor((1 - y) * NL), 0, NL - 1);
  const pluck = (n, pan = 0, vol = 0.1) => { notes++; blip(midi(60 + SCL[n]), 0.42, 'triangle', vol); blip(midi(72 + SCL[n]), 0.12, 'sine', vol * 0.35); };
  const botMove = (b, step) => { const pat = [[0, 2, 4, 2, 5, 4, 2, -1], [7, -1, 7, 9, -1, 8, 7, 5], [4, 4, -1, 6, 7, -1, 9, 7]][b.k]; const n = pat[(step + b.k) % 8]; b.on = n >= 0 && (Math.floor(step / 16) + b.k) % 3 !== 2; if (n >= 0) b.y = 1 - (n + 0.5) / NL; };
  const stepFn = () => { tick++; beatEls.forEach((e, i) => e.classList.toggle('on', i === Math.floor(tick / 2) % 4)); bots.forEach((b) => { botMove(b, tick); if (b.on) pluck(noteOf(b.y), 0, 0.045); }); if (me.on) pluck(noteOf(me.y), 0, 0.11); };
  const pos = (e) => { const r = pcv.getBoundingClientRect(); me.y = clamp((e.clientY - r.top) / r.height, 0.02, 0.98); };
  pcv.addEventListener('pointerdown', (e) => { if (mode !== 'play') return; me.on = true; pos(e); audio(); try { pcv.setPointerCapture(e.pointerId); } catch {} });
  pcv.addEventListener('pointermove', (e) => { if (me.on) pos(e); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => pcv.addEventListener(t, () => (me.on = false)));
  const startPlay = (c) => { me.c = c; pick.classList.add('off'); mode = 'play'; audio(); };
  const toPlay = () => { lob.classList.add('off'); play.classList.add('on'); pick.classList.remove('off'); mode = 'pick'; pop.classList.remove('on'); [me, ...bots].forEach((p) => (p.trail = [])); };
  const toLobby = () => { if (mode === 'cookie') return; play.classList.remove('on'); lob.classList.remove('off'); mode = 'lobby'; me.on = false; };
  const accept = () => { card.classList.add('off'); lob.classList.remove('off'); mode = 'lobby'; };
  // ---------- render loop ----------
  let raf = 0, t0 = performance.now();
  const frame = (now) => { raf = requestAnimationFrame(frame); if (!el.isConnected) { cancelAnimationFrame(raf); return; }
    const dpr = Math.min(2, devicePixelRatio || 1); const W = el.clientWidth, H = el.clientHeight;
    if (stars.width !== Math.round(W * dpr)) { stars.width = Math.round(W * dpr); stars.height = Math.round(H * dpr); }
    const g = stars.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); const t = (now - t0) / 1000;
    for (const s0 of STARS) { if (!RM) s0.x = (s0.x - s0.v * 0.016 * (mode === 'play' ? 6 : 1) + 1) % 1; const a = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(t * s0.s + s0.p)); g.fillStyle = `rgba(255,255,255,${(RM ? 0.6 : a).toFixed(2)})`; g.beginPath(); g.arc(s0.x * W, s0.y * H, s0.r, 0, 7); g.fill(); if (s0.r > 1.4) { g.fillStyle = `rgba(255,255,255,${(a * 0.18).toFixed(2)})`; g.beginPath(); g.arc(s0.x * W, s0.y * H, 5, 0, 7); g.fill(); } }
    if (play.classList.contains('on')) { const pw = play.clientWidth, ph = play.clientHeight; if (pcv.width !== Math.round(pw * dpr)) { pcv.width = Math.round(pw * dpr); pcv.height = Math.round(ph * dpr); }
      const q = pcv.getContext('2d'); q.setTransform(dpr, 0, 0, dpr, 0, 0); q.clearRect(0, 0, pw, ph);
      for (let i = 0; i < NL; i++) { const y = (i / NL) * ph; q.fillStyle = i % 5 === 0 ? '#ffffff0d' : '#ffffff06'; q.fillRect(0, y, pw, ph / NL - 1); }
      if (mode === 'play' && now - lastStep >= STEP) { lastStep = now; stepFn(); }
      const X = pw * 0.72; const players = mode === 'play' ? [me, ...bots] : bots;
      for (const p of players) { const ny = (NL - noteOf(p.y) - 0.5) / NL * ph; p.trail.push(p.on ? ny : null); if (p.trail.length > 260) p.trail.shift();
        q.strokeStyle = p.c; q.lineWidth = p === me ? 7 : 5; q.lineCap = 'round'; q.globalAlpha = p === me ? 1 : 0.7; q.beginPath(); let pen = false;
        p.trail.forEach((v, i) => { const x = X - (p.trail.length - 1 - i) * 3; if (v == null) { pen = false; return; } if (!pen) { q.moveTo(x, v); pen = true; } else q.lineTo(x, v); }); q.stroke(); q.globalAlpha = 1;
        q.fillStyle = p.c; q.beginPath(); q.arc(X, p === me ? p.y * ph : ny, p.on ? (p === me ? 13 : 9) : 6, 0, 7); q.fill(); if (p.on) { q.strokeStyle = p.c; q.globalAlpha = 0.3; q.lineWidth = 2; q.beginPath(); q.arc(X, ny, 22 + Math.sin(now / 80) * 3, 0, 7); q.stroke(); q.globalAlpha = 1; } } } };
  raf = requestAnimationFrame(frame);
  const reset = () => { card.classList.remove('off'); cfg.classList.remove('on'); lob.classList.add('off'); play.classList.remove('on'); pop.classList.remove('on'); mode = 'cookie'; me.on = false; wordEls.forEach((w) => w.classList.remove('hov')); };
  window.__demoProof = async () => { const o = []; reset();
    card.querySelector('.pk-btn.cf').click(); o.push(`configure → ${cfg.querySelectorAll('input').length} toggles shown`);
    card.querySelector('.pk-btn.ok').click(); await sleep(300); o.push(`THAT'S OK → mode=${mode}, ${wordEls.length} tilted lobby words, rings=${lob.querySelectorAll('.pk-ring').length}`);
    wordEls[1].classList.add('hov'); await sleep(200); o.push(`hover lift → ${getComputedStyle(wordEls[1]).transform !== 'none'}`); wordEls[1].classList.remove('hov');
    wordEls[1].click(); o.push(`GO PRIVATE → popup "${pop.querySelector('.code')?.textContent}"`); pop.classList.remove('on');
    wordEls[0].click(); o.push(`PLAY NOW → mode=${mode}`); pick.querySelectorAll('i')[2].click(); o.push(`color picked → ${me.c}, mode=${mode}`);
    me.on = true; const n0 = notes; for (const y of [0.8, 0.6, 0.4, 0.3, 0.5]) { me.y = y; stepFn(); } me.on = false; o.push(`held + moved → ${notes - n0} quantized plucks (incl. bots), note idx now ${noteOf(0.5)}`);
    await sleep(250); o.push(`trails: ${[me, ...bots].map((p) => p.trail.length).join('/')}`);
    reset(); o.push(`restored: cookie card visible, mode=${mode}`); return o.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['key-av-instrument'])(root, T); }
