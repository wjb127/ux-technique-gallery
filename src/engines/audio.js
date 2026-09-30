import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, blip, drum, midi, audio, fitCanvas, noise2 } from '../lib.js';
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

export function mount(root, variant, opts, T) { (V[variant] || V['key-av-instrument'])(root, T); }
