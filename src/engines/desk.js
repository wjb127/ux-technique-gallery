import '@fontsource-variable/fraunces/full.css';
import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, blip, drum, midi, audio, fitCanvas, fire } from '../lib.js';
import { theme, slider, seg, select, btn } from '../kit.js';
const MONO = "'JetBrains Mono Variable',monospace";
const V = {};
function win95(title, body, { x = 100, y = 80, w = 360, hh = 240, dark = false } = {}) { const bar = h('div.k-row', { style: { background: 'linear-gradient(90deg,#000080,#1084d0)', color: '#fff', padding: '2px 4px', fontSize: '12px', fontWeight: 700, cursor: 'move', gap: '4px' } }, title, h('span', { style: { flex: 1 } }), ...['_', '□', '×'].map((c) => h('span', { style: { background: '#c0c0c0', color: '#000', width: '16px', height: '14px', display: 'grid', placeItems: 'center', fontSize: '10px', boxShadow: 'inset -1px -1px #000,inset 1px 1px #fff', cursor: 'pointer' }, onclick: c === '×' ? () => w0.remove() : null }, c))); const w0 = h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', background: '#c0c0c0', boxShadow: 'inset -1px -1px #000,inset 1px 1px #fff,inset -2px -2px #808080', padding: '3px', zIndex: 10 } }, bar, h('div', { style: { height: hh + 'px', background: dark ? '#000' : '#fff', margin: '3px', boxShadow: 'inset 1px 1px #808080', overflow: 'auto', color: dark ? '#0f0' : '#000' } }, body)); let ox, oy; drag(bar, { start: (e) => { ox = e.clientX - w0.offsetLeft; oy = e.clientY - w0.offsetTop; w0.parentNode.append(w0); }, move: (e) => { w0.style.left = e.clientX - ox + 'px'; w0.style.top = e.clientY - oy + 'px'; } }); return w0; }
V['parody-desktop-os-sandbox'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#ff0', ac: '#ff0', dark: true }); root.style.font = `14px/1.5 ${MONO}`;
  const boot = h('div', { style: { position: 'absolute', inset: 0, padding: '16px', color: '#ffea00', cursor: 'pointer' } }); const LINES = ['WINDOWS93-ish BIOS v0.93 (c) 2026 junk corp', 'CPU: Pentium-ish 93 MHz ........ OK', 'Memory Test: 640K ........ enough for anybody', 'Detecting IDE drives ... floppy A: [3½"]', '', 'Loading KERNEL93.SYS', 'Loading SILLY.DRV .......... done', 'Starting desktop ...', '', '▌ click anywhere to boot'];
  (async () => { for (const l of LINES) { boot.append(h('div', { style: { color: l.startsWith('▌') ? '#0f0' : '' } }, l || '\u00a0')); await sleep(60); } })();
  const desk = () => { boot.remove(); root.style.background = '#008080'; const icons = [['💾', 'My Computer'], ['🗑', 'Trash'], ['📁', 'Documents'], ['🎵', 'Radio'], ['🖥', 'Terminal'], ['🐱', 'Virtual Cat'], ['🎨', 'Paint'], ['🧩', 'Solitaire']]; icons.forEach(([ic, n], i) => root.append(h('div', { style: { position: 'absolute', left: 14 + Math.floor(i / 6) * 90 + 'px', top: 14 + (i % 6) * 84 + 'px', width: '76px', textAlign: 'center', color: '#fff', fontSize: '12px', cursor: 'pointer' }, ondblclick: () => open(n) }, h('div', { style: { fontSize: '34px' } }, ic), n))); root.append(h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '30px', background: '#c0c0c0', boxShadow: 'inset 0 1px #fff', padding: '0 4px', gap: '6px', color: '#000' } }, h('b', { style: { boxShadow: 'inset -1px -1px #000,inset 1px 1px #fff', padding: '2px 8px' } }, '⊞ Start'), h('span', { style: { flex: 1 } }), h('span', { style: { boxShadow: 'inset 1px 1px #808080', padding: '2px 8px' } }, '12:00 PM'))); open('Terminal'); };
  const open = (n) => { if (n === 'Terminal') { const out = h('div', { style: { padding: '6px', font: `12px ${MONO}` } }, 'Windows93-ish terminal. type help'); const inp = h('input', { style: { width: '95%', background: '#000', color: '#0f0', border: 0, font: `12px ${MONO}`, outline: 'none' }, onkeydown: (e) => { if (e.key !== 'Enter') return; const c = inp.value.trim(); out.append(h('div', {}, '> ' + c), h('div', {}, { help: 'commands: help, date, cowsay, beep, clear', date: new Date().toString(), beep: (blip(880, 0.2, 'square'), 'BEEP'), cowsay: ' ____\n< moo >\n ----\n  \\ ^__^\n    (oo)\\___' }[c] || (c === 'clear' ? (out.textContent = '', '') : 'bad command or file name'))); inp.value = ''; } }); root.append(win95('Terminal', [out, inp], { x: 260, y: 90, w: 480, hh: 280, dark: true })); setTimeout(() => inp.focus(), 50); } else root.append(win95(n, h('div', { style: { padding: '12px', fontSize: '13px' } }, n === 'Virtual Cat' ? '🐱 meow. (click me)' : `${n} — nothing important here.`), { x: 200 + Math.random() * 300, y: 60 + Math.random() * 200 })); };
  boot.addEventListener('click', desk); root.append(boot);
  window.__demoProof = async () => 'BIOS boot screen; click boots desktop';
};
V['retro-boot-desktop-museum'] = (root, T) => {
  theme(root, T, { bg: '#f5ecd9', fg: '#2a2a2a', ac: '#c98a1a', dark: false }); root.style.overflow = 'auto';
  const ITEMS = [['01', 'The Desktop', 'Windows 95'], ['02', 'Specifications', 'Pentium II'], ['03', 'Sound', 'SoundBlaster'], ['04', 'The Internet', '56k modem'], ['05', 'Screensavers', '3D Pipes']];
  const enter = () => { const d = h('div', { style: { position: 'fixed', inset: '38px 0 0 0', background: '#008080', zIndex: 20 } }); d.append(win95('Welcome', h('div', { style: { padding: '14px', fontSize: '13px', lineHeight: 1.6 } }, h('b', {}, 'Welcome to 1997-ish'), h('p', {}, 'Explore the desktop. Double-click icons. Close this window to exit the museum.'), btn('Exit museum', () => d.remove())), { x: 300, y: 120, w: 420, hh: 180 }), h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '30px', background: '#c0c0c0', padding: '0 4px' } }, h('b', { style: { boxShadow: 'inset -1px -1px #000,inset 1px 1px #fff', padding: '2px 8px' } }, '⊞ Start'))); ['💻 My Computer', '🌐 Netscape', '📝 Notepad', '🎵 Winamp'].forEach((t, i) => d.append(h('div', { style: { position: 'absolute', left: '16px', top: 16 + i * 80 + 'px', color: '#fff', textAlign: 'center', fontSize: '12px', width: '80px' } }, h('div', { style: { fontSize: '32px' } }, t.split(' ')[0]), t.split(' ').slice(1).join(' ')))); document.body.append(d); };
  root.append(h('div.k-row', { style: { height: '44px', padding: '0 60px', fontSize: '11px', letterSpacing: '.15em', borderBottom: '1px solid #e0d2b4' } }, h('b', {}, '◐ THE 1997 DESK · COMPUTER MUSEUM-ish'), h('span', { style: { flex: 1 } }), 'COLLECTION', 'ABOUT', 'VISIT', h('span', { style: { background: '#2a2a2a', color: '#fff', padding: '3px 10px', borderRadius: '99px' } }, 'EN')), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '60px', padding: '50px 120px 30px' } }, h('div', {}, h('div', { style: { fontSize: '11px', letterSpacing: '.3em', opacity: .6 } }, 'FIRST BOOT · 1997 · OPEN COLLECTION'), h('div', { style: { font: "700 96px/0.95 'Fraunces Variable'", margin: '16px 0' } }, 'Welcome', h('br'), 'to ', h('i', { style: { color: '#c98a1a', textDecoration: 'underline', textDecorationThickness: '3px' } }, '1997.')), h('p', { style: { maxWidth: '460px', lineHeight: 1.6 } }, 'A field guide to the golden age of home computing. Boot a legendary desktop, fiddle with its settings, and hear the dial-up sing.'), h('div.k-row', { style: { gap: '14px', marginTop: '20px' } }, h('button', { style: { background: '#c98a1a', color: '#fff', border: 0, padding: '12px 22px', fontWeight: 700, letterSpacing: '.1em' }, onclick: enter }, 'ENTER THE COLLECTION →'), h('button', { style: { background: 'none', border: '1px solid #2a2a2a', padding: '12px 22px' }, onclick: () => blip(1200, 1, 'square', 0.05) }, '▶ HEAR THE MODEM'))), h('div', { style: { background: '#fbf6ea', border: '1px solid #e0d2b4', padding: '18px', position: 'relative' } }, h('div', { style: { position: 'absolute', right: '10px', top: '-20px', font: "900 120px 'Fraunces Variable'", opacity: .06 } }, '97'), h('b', {}, 'Contents'), ...ITEMS.map(([n, t, sub]) => h('div.k-row', { style: { borderTop: '1px solid #eadfc6', padding: '10px 0', fontSize: '13px' } }, h('span', { style: { opacity: .5 } }, n), t, h('span', { style: { flex: 1 } }), h('span', { style: { opacity: .5, fontSize: '11px' } }, sub))))), h('div', { style: { margin: '0 120px', background: '#fff', border: '1px solid #e0d2b4', padding: '16px', display: 'grid', gap: '10px', fontSize: '13px' } }, h('b', {}, '🍪 Cookie & Privacy Settings'), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } }, h('div', { style: { background: '#f6f6f6', padding: '10px' } }, '☑ Essential cookies'), h('div', { style: { background: '#f6f6f6', padding: '10px' } }, '☐ Analytics')), h('div.k-row', { style: { justifyContent: 'flex-end' } }, h('button', { style: { background: '#0e7d6f', color: '#fff', border: 0, padding: '6px 14px' } }, 'Save'), btn('Accept all', () => {}))));
  window.__demoProof = async () => 'museum landing; ENTER opens Win95-style desktop';
};
V['winamp-skinned-player-chrome'] = (root, T) => {
  theme(root, T, { bg: '#3a6ea5', fg: '#fff', ac: '#0f0', dark: true });
  const TR = [['DJ Mike Llama - Llama Whippin\' Intro', 60, [0, 4, 7]], ['Chiptune Sunrise', 64, [0, 3, 7]], ['Modem Lullaby', 57, [0, 5, 9]], ['Floppy Disco', 62, [0, 4, 9]]]; let ti = 0, play = false, step = 0, vol = 0.6;
  const ac0 = () => audio(); let an = null; const bars = new Array(19).fill(0);
  setInterval(() => { if (!play) return; const [, r, ch] = TR[ti]; step++; blip(midi(r + ch[step % 3] + (step % 8 < 4 ? 12 : 0)), 0.15, 'square', 0.04 * vol); if (step % 2 === 0) drum(step % 4 ? 'hat' : 'kick'); bars.forEach((_, i) => (bars[i] = Math.random() * (1 - i / 30))); }, 130);
  const disp = h('div', { style: { background: '#000', color: '#0f0', font: `11px ${MONO}`, padding: '4px 6px', height: '40px', display: 'grid', gridTemplateColumns: '60px 1fr' } }); const viz = h('canvas', { width: 76, height: 16, style: { width: '76px', height: '16px' } });
  const tick = () => { disp.replaceChildren(h('div', { style: { font: `18px ${MONO}` } }, play ? `${String(Math.floor(step * 0.13 / 60)).padStart(2, '0')}:${String(Math.floor(step * 0.13) % 60).padStart(2, '0')}` : '00:00'), h('div', { style: { overflow: 'hidden', whiteSpace: 'nowrap' } }, `${ti + 1}. ${TR[ti][0]} (3:${20 + ti})  *** `, h('br'), '128 kbps 44 kHz stereo')); disp.firstChild.after(viz); const g = viz.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 76, 16); bars.forEach((b, i) => { g.fillStyle = b > 0.7 ? '#f33' : b > 0.4 ? '#ff3' : '#0f0'; g.fillRect(i * 4, 16 - b * 16, 3, b * 16); if (!play) bars[i] *= 0.9; }); requestAnimationFrame(tick); };
  const b95 = (l, f) => h('button', { style: { background: 'linear-gradient(#5a5a6a,#2a2a38)', color: '#ddd', border: '1px solid #111', fontSize: '10px', padding: '2px 6px' }, onclick: f }, l);
  const skin = (t, body, x, y, w) => { const el = h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', background: 'linear-gradient(#3b3b52,#23232f)', border: '1px solid #000', padding: '0 3px 4px', boxShadow: '0 0 0 1px #5a5a7a inset' } }, h('div', { style: { font: `bold 9px ${MONO}`, color: '#ccc', textAlign: 'center', letterSpacing: '.2em', padding: '2px', background: 'repeating-linear-gradient(90deg,#8888aa 0 1px,transparent 1px 3px)', backgroundClip: 'content-box', cursor: 'move' } }, h('span', { style: { background: '#2a2a3a', padding: '0 6px' } }, t)), body); let ox, oy; drag(el.firstChild, { start: (e) => { ox = e.clientX - el.offsetLeft; oy = e.clientY - el.offsetTop; }, move: (e) => { el.style.left = e.clientX - ox + 'px'; el.style.top = e.clientY - oy + 'px'; } }); return el; };
  const main = skin('WINAMP-ish', h('div', { style: { display: 'grid', gap: '4px' } }, disp, h('input', { type: 'range', min: 0, max: 1, step: 0.01, value: vol, oninput: (e) => (vol = +e.target.value), style: { accentColor: '#0f0' } }), h('div.k-row', { style: { gap: '2px' } }, b95('⏮', () => { ti = (ti + 3) % 4; }), b95('▶', () => { audio(); play = true; }), b95('❚❚', () => (play = false)), b95('■', () => { play = false; step = 0; }), b95('⏭', () => { ti = (ti + 1) % 4; }), b95('⏏', () => toast('Open file (demo)')))), 360, 220, 275);
  const eq = skin('WINAMP EQUALIZER', h('div.k-row', { style: { height: '70px', gap: '5px', justifyContent: 'center', background: '#111', padding: '4px' } }, ...Array.from({ length: 11 }, (_, i) => h('input', { type: 'range', min: -12, max: 12, value: Math.round(Math.sin(i) * 6), orient: 'vertical', style: { writingMode: 'vertical-lr', direction: 'rtl', height: '60px', width: '12px', accentColor: i ? '#ff3' : '#0f0' } }))), 360, 330, 275);
  const pl = skin('WINAMP PLAYLIST', h('div', { style: { background: '#000', font: `11px ${MONO}`, minHeight: '120px', padding: '4px' } }, ...TR.map((t, i) => h('div', { style: { color: i === ti ? '#fff' : '#0f0', background: i === ti ? '#0000c6' : '', cursor: 'pointer' }, ondblclick: () => { ti = i; audio(); play = true; } }, `${i + 1}. ${t[0]}`))), 360, 440, 275);
  const vis = skin('MILKDROP-ish', (() => { const c = h('canvas', { width: 380, height: 230, style: { display: 'block', background: '#000' } }); let t = 0; const lp = () => { t += 0.03; const g = c.getContext('2d'); g.fillStyle = '#0003'; g.fillRect(0, 0, 380, 230); g.strokeStyle = `hsl(${t * 40} 90% 60%)`; g.lineWidth = 2; g.beginPath(); for (let x = 0; x < 380; x++) { const v = play ? bars[x % 19] : 0.1; x ? g.lineTo(x, 115 + Math.sin(x / 20 + t * 3) * 60 * v) : g.moveTo(0, 115); } g.stroke(); requestAnimationFrame(lp); }; lp(); return c; })(), 640, 220, 390);
  root.append(...[['🗂', 'My Files'], ['🌐', 'Internet'], ['🎵', 'Winamp'], ['🗑', 'Recycle Bin'], ['📄', 'llama.mp3'], ['💿', 'Skins']].map(([ic, n], i) => h('div', { style: { position: 'absolute', left: 16 + i * 84 + 'px', top: '14px', width: '72px', textAlign: 'center', fontSize: '11px' } }, h('div', { style: { fontSize: '30px' } }, ic), n)), main, eq, pl, vis);
  tick();
  window.__demoProof = async () => { play = true; step = 40; bars.forEach((_, i) => (bars[i] = Math.random())); await sleep(300); play = false; return 'Winamp chrome: transport, EQ, playlist, visualizer'; };
};
V['retro-media-player-chrome'] = (root, T) => {
  theme(root, T, { bg: '#f6cfd0', fg: '#222', ac: '#222', dark: false }); root.style.fontFamily = 'Chicago,Charcoal,Geneva,sans-serif';
  const CH = [['Poolside FM', 60, [0, 4, 7, 11]], ['Tokyo Disco', 62, [0, 3, 7, 10]], ['Hangover Club', 57, [0, 5, 9, 12]]]; let ci = 0, play = false, step = 0;
  setInterval(() => { if (!play) return; step++; const [, r, ch] = CH[ci]; if (step % 2 === 0) blip(midi(r + ch[(step / 2) % 4 | 0]), 0.35, 'triangle', 0.05); if (step % 4 === 0) drum('kick'); if (step % 4 === 2) drum('hat'); }, 140);
  const macWin = (t, body, x, y, w) => { const el = h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', background: '#fff', border: '2px solid #222', boxShadow: '3px 3px 0 #222', zIndex: 5 } }, h('div.k-row', { style: { borderBottom: '2px solid #222', padding: '2px 6px', background: 'repeating-linear-gradient(#222 0 1px,#fff 1px 3px)', cursor: 'move' } }, h('span', { style: { background: '#fff', border: '1px solid #222', width: '12px', height: '12px', cursor: 'pointer' }, onclick: () => el.remove() }), h('span', { style: { flex: 1, textAlign: 'center' } }, h('span', { style: { background: '#fff', padding: '0 8px', fontSize: '12px', fontWeight: 700 } }, t))), body); let ox, oy; drag(el.firstChild, { start: (e) => { ox = e.clientX - el.offsetLeft; oy = e.clientY - el.offsetTop; }, move: (e) => { el.style.left = e.clientX - ox + 'px'; el.style.top = e.clientY - oy + 'px'; } }); root.append(el); return el; };
  const openPlayer = () => { const title = h('b'); const upd = () => (title.textContent = '♪ ' + CH[ci][0]); upd(); macWin('Poolsuite-ish.FM', h('div', { style: { padding: '12px', display: 'grid', gap: '10px', fontSize: '12px' } }, h('div', { style: { height: '120px', background: 'linear-gradient(#ffb3c1,#ffd8a8)', border: '1px solid #222', display: 'grid', placeItems: 'center', fontSize: '40px' } }, '🌴'), title, h('div.k-row', {}, btn('⏮', () => { ci = (ci + 2) % 3; upd(); }), btn(play ? '❚❚' : '▶', (e) => { audio(); play = !play; e.target.textContent = play ? '❚❚' : '▶'; }), btn('⏭', () => { ci = (ci + 1) % 3; upd(); })), select(CH.map((c) => c[0]), CH[0][0], (v) => { ci = CH.findIndex((c) => c[0] === v); upd(); })), 480, 160, 300); };
  const DOCK = [['🎵', 'Player', openPlayer], ['📼', 'Channels', openPlayer], ['📓', 'Notes', () => macWin('Notes', h('div', { style: { padding: '10px', fontSize: '12px' } }, 'Summer 1987. Sunscreen. Synths.'), 300, 200, 240)], ['🖼', 'Gallery', () => {}], ['📅', 'Events', () => {}], ['🛍', 'Shop', () => {}], ['🎮', 'Games', () => {}], ['⚙', 'Settings', () => {}], ['💌', 'Contact', () => {}]];
  root.append(h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: '24px', background: '#fff', borderBottom: '2px solid #222', padding: '0 10px', fontSize: '12px', gap: '16px', fontWeight: 700 } }, '🍑', 'File', 'Edit', 'View', 'Special', h('span', { style: { flex: 1 } }), h('span', { style: { background: '#222', color: '#fff', padding: '0 6px' } }, 'TUNE IN · FREE'), '☀ 27°'), h('div.k-row', { style: { position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '2px solid #222', boxShadow: '3px 3px 0 #222', padding: '6px', gap: '4px' } }, ...DOCK.map(([ic, n, f]) => h('div', { style: { width: '54px', textAlign: 'center', fontSize: '10px', cursor: 'pointer', padding: '4px 0', border: '1px solid transparent' }, onclick: f }, h('div', { style: { fontSize: '24px' } }, ic), n))));
  window.__demoProof = async () => 'pink desktop with dock (click Player to open)';
};

V['cyanbanister-vaporwave-os-desk'] = (root, T) => {
  let night = false;
  const apply = () => {
    const bg = night
      ? 'radial-gradient(ellipse at 30% 20%,#2a0845 0%,#0a1628 55%,#120818 100%)'
      : 'radial-gradient(ellipse at 70% 10%,#ff71ce55 0%,#01cdfe33 35%,#05ffa122 60%,#b967ff22 100%),linear-gradient(160deg,#0b3d4a 0%,#1a0a2e 50%,#3d0a4a 100%)';
    theme(root, T, { bg: night ? '#0a1628' : '#0b3d4a', fg: night ? '#e0b0ff' : '#e8fff6', ac: night ? '#ff71ce' : '#01cdfe', dark: true });
    root.style.background = bg;
    root.style.fontFamily = "'VT323',monospace";
    root.style.overflow = 'hidden';
    if (clock) clock.textContent = night ? '☾ AFTER DARK' : '☀ DAY GLOW';
    root.querySelectorAll('[data-vw]').forEach((w) => {
      w.style.borderColor = night ? '#ff71ce' : '#01cdfe';
      w.style.boxShadow = night ? '0 0 24px #ff71ce55, inset 0 0 0 1px #ff71ce44' : '0 0 24px #01cdfe55, inset 0 0 0 1px #01cdfe44';
    });
  };
  const icons = [
    ['🖥', 'Terminal', 'term'],
    ['📁', 'Folders', 'fold'],
    ['✦', 'About', 'about'],
    ['🎨', 'ASCII', 'ascii'],
    ['💾', 'Ugly Duck', 'duck'],
  ];
  let z = 20;
  const mkWin = (title, body, { x = 120, y = 70, w = 360, hh = 220 } = {}) => {
    const bar = h('div.k-row', {
      style: {
        background: night ? 'linear-gradient(90deg,#5a1a6e,#ff71ce)' : 'linear-gradient(90deg,#014d5c,#01cdfe)',
        color: '#fff', padding: '4px 8px', fontSize: '14px', letterSpacing: '.06em',
        cursor: 'move', gap: '6px', borderBottom: '1px solid #ffffff33',
      },
    }, h('span', {}, '◈ ' + title), h('span', { style: { flex: 1 } }), h('span', {
      style: { cursor: 'pointer', opacity: .85, fontSize: '16px' },
      onclick: () => el.remove(),
    }, '×'));
    const el = h('div', {
      'data-vw': '1',
      style: {
        position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px',
        background: night ? '#1a0a28ee' : '#062a32ee', color: night ? '#f0c8ff' : '#c8fff0',
        border: '1px solid ' + (night ? '#ff71ce' : '#01cdfe'),
        boxShadow: night ? '0 0 24px #ff71ce55' : '0 0 24px #01cdfe55',
        borderRadius: '4px', zIndex: ++z, backdropFilter: 'blur(6px)',
      },
    }, bar, h('div', { style: { height: hh + 'px', overflow: 'auto', padding: '10px', fontSize: '15px', lineHeight: 1.45 } }, body));
    let ox, oy;
    drag(bar, {
      start: (e) => { ox = e.clientX - el.offsetLeft; oy = e.clientY - el.offsetTop; el.style.zIndex = ++z; },
      move: (e) => { el.style.left = (e.clientX - ox) + 'px'; el.style.top = (e.clientY - oy) + 'px'; },
    });
    root.append(el);
    return el;
  };
  const open = (kind) => {
    if (kind === 'term') {
      const out = h('div', { style: { fontFamily: MONO, fontSize: '13px', whiteSpace: 'pre-wrap' } },
        'ugly-duckling OS v0.88 — type help\n');
      const inp = h('input', {
        style: {
          width: '100%', background: 'transparent', color: night ? '#ff71ce' : '#05ffa1',
          border: 0, borderTop: '1px solid #ffffff22', outline: 'none',
          font: `13px ${MONO}`, marginTop: '6px', paddingTop: '6px',
        },
        placeholder: '>',
        onkeydown: (e) => {
          if (e.key !== 'Enter') return;
          const c = inp.value.trim().toLowerCase();
          const reply = {
            help: 'cmds: help · whoami · ls · date · glow · clear · duck',
            whoami: 'guest@ugly-duckling ~ anti-portfolio',
            ls: 'about.txt  lore/  ascii.paint  night.sh',
            date: new Date().toUTCString(),
            glow: (night ? 'after-dark on' : 'day glow on') + ' · palette pulsing',
            duck: '  __\n<(o )___\n (  ._> /\n  `---\'  quack (not Cyan)',
          }[c];
          if (c === 'clear') { out.textContent = ''; }
          else out.append(h('div', {}, '> ' + c), h('div', { style: { opacity: .85 } }, reply || 'command not found: ' + c));
          inp.value = '';
          out.parentElement.scrollTop = 9999;
        },
      });
      mkWin('Terminal', [out, inp], { x: 280, y: 80, w: 420, hh: 240 });
      setTimeout(() => inp.focus(), 40);
    } else if (kind === 'fold') {
      const chips = ['lore: neon mall', 'lore: VHS dusk', 'lore: teal CRT', 'file: resume.fake', 'file: links.void', 'note: make weird'];
      mkWin('Folders', h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
        ...chips.map((t) => h('div', {
          style: {
            padding: '10px', borderRadius: '6px', cursor: 'pointer',
            background: night ? '#ff71ce18' : '#01cdfe18',
            border: '1px solid ' + (night ? '#ff71ce44' : '#01cdfe44'),
            fontSize: '13px',
          },
          onclick: () => toast(t),
        }, '📄 ' + t))), { x: 80, y: 120, w: 340, hh: 200 });
    } else if (kind === 'about') {
      mkWin('About', h('div', {},
        h('div', { style: { fontSize: '22px', letterSpacing: '.08em', marginBottom: '8px' } }, 'UGLY DUCKLING OS'),
        h('p', { style: { opacity: .8, margin: '0 0 8px' } }, 'A vaporwave anti-portfolio desk. Drag windows. Type nonsense. Flip after-dark.'),
        h('p', { style: { opacity: .55, fontSize: '12px' } }, 'Inspired look-alike · no real branding · toy terminal only.'),
      ), { x: 420, y: 160, w: 320, hh: 180 });
    } else if (kind === 'ascii') {
      const art = h('pre', { style: { margin: 0, fontSize: '11px', lineHeight: 1.2, color: night ? '#ff71ce' : '#05ffa1' } },
        '  .--.\n /@@  \\\n(____)/\n  ||  ASCII PAINT stub\n  ``  click · to drip');
      mkWin('ASCII Paint', art, { x: 200, y: 200, w: 280, hh: 160 });
    } else {
      mkWin('Ugly Duck', h('div', {}, 'A soft duck in a hard neon world.\nNo LLM contact form. Just chrome.'), { x: 340, y: 100, w: 300, hh: 140 });
    }
  };
  const clock = h('span', { style: { letterSpacing: '.12em', fontSize: '14px' } }, '☀ DAY GLOW');
  const task = h('div.k-row', {
    style: {
      position: 'absolute', left: 0, right: 0, bottom: 0, height: '36px', zIndex: 100,
      background: 'linear-gradient(90deg,#01cdfe33,#ff71ce33,#b967ff33)',
      borderTop: '1px solid #ffffff44', padding: '0 10px', gap: '10px',
      backdropFilter: 'blur(8px)', color: '#fff',
    },
  },
    h('b', { style: { cursor: 'pointer' }, onclick: () => open('about') }, '◈ Start'),
    h('span', { style: { flex: 1 } }),
    clock,
    btn(night ? 'After-dark ✦' : 'Day glow ✦', () => { night = !night; apply(); toast(night ? 'after-dark' : 'day glow'); }),
  );
  icons.forEach(([ic, name, kind], i) => {
    root.append(h('div', {
      style: {
        position: 'absolute', left: 18 + Math.floor(i / 5) * 92 + 'px',
        top: 48 + (i % 5) * 88 + 'px', width: '78px', textAlign: 'center',
        color: '#fff', fontSize: '12px', cursor: 'pointer', textShadow: '0 0 8px #01cdfe',
        letterSpacing: '.04em',
      },
      ondblclick: () => open(kind),
      onclick: () => open(kind),
    }, h('div', { style: { fontSize: '32px', filter: 'drop-shadow(0 0 6px #ff71ce)' } }, ic), name));
  });
  root.append(
    h('div', {
      style: {
        position: 'absolute', right: '24px', top: '48px', opacity: .35,
        fontSize: '11px', letterSpacing: '.3em', writingMode: 'vertical-rl', color: '#fff',
      },
    }, 'ANTI-PORTFOLIO · VAPOR DESK'),
    task,
  );
  apply();
  open('term');
  window.__demoProof = async () => {
    night = false; apply();
    open('fold'); open('about');
    night = true; apply();
    await sleep(120);
    night = false; apply();
    return 'opened Folders+About, toggled after-dark, restored day';
  };
};

// ---------- mmm.page sticker / drag website builder (2026-10-05 08:00 KST)
V['mmm-page-sticker-site-builder'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#111111', panel: '#f2f2f0', ac: '#5fe0a0', dark: false, line: '#0000001a' });
  root.style.overflow = 'hidden'; root.style.background = '#fff'; root.style.color = '#111';
  const SANS = "'Inter Variable', system-ui, sans-serif", SERIF = "'Fraunces Variable', Georgia, serif";
  root.style.fontFamily = SANS;
  root.append(h('style', {}, `
    .mm-side{position:absolute;left:0;top:0;bottom:0;width:186px;border-right:1px solid #ececec;background:#fff;z-index:6;padding:14px 12px;display:flex;flex-direction:column;gap:14px}
    .mm-pill{display:flex;align-items:center;background:#0d0d0d;color:#fff;border-radius:99px;height:40px;padding:0 14px 0 8px;gap:14px;font:800 12px/1 ${SANS};letter-spacing:.05em;box-shadow:0 0 0 2px #0d0d0d,inset 0 0 0 1.5px #fff;width:max-content}
    .mm-pill span{cursor:pointer}.mm-pill .i{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;border-right:1px solid #ffffff55;border-radius:0;padding-right:10px;width:auto}
    .mm-nav{display:grid;gap:4px}.mm-nav a span{width:16px;text-align:center;font-size:14px}.mm-nav a{display:flex;gap:14px;align-items:center;padding:9px 12px;border-radius:8px;font:700 12px/1 ${SANS};letter-spacing:.07em;color:#333;cursor:pointer;text-decoration:none}
    .mm-nav a.on{background:#f1f1ef}.mm-nav a:hover{background:#f6f6f4}
    .mm-card{margin-top:auto;margin-bottom:120px;background:#c7cfca;border:1.5px solid #9aa79f;border-radius:8px;padding:14px 14px 10px;font-size:13px;color:#2c3530;line-height:1.35}
    .mm-card b{display:block;font-size:14px;margin-bottom:8px}.mm-card ol{margin:0;padding-left:16px}.mm-card li{margin:3px 0}
    .mm-canvas{position:absolute;left:186px;right:0;top:0;bottom:0;overflow:hidden;transition:background .3s}
    .mm-it{position:absolute;touch-action:none;user-select:none;-webkit-user-select:none}
    .mm-edit .mm-it{cursor:grab}.mm-edit .mm-it:hover{outline:2px dashed #20c88a;outline-offset:6px}
    .mm-it.sel{outline:2px solid #20c88a!important;outline-offset:6px;cursor:move}
    .mm-hd{position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;border:2px solid #20c88a;display:none;z-index:3;box-shadow:0 1px 4px #0003}
    .mm-it.sel .mm-hd{display:block}
    .mm-hd.r{left:50%;top:-38px;margin-left:-8px;cursor:grab}.mm-hd.s{right:-14px;bottom:-14px;cursor:nwse-resize}
    .mm-hd.x{left:-16px;top:-16px;width:20px;height:20px;background:#ff4d4d;border-color:#fff;color:#fff;font:800 11px/16px ${SANS};text-align:center;cursor:pointer}
    .k-root .mm-btn{width:548px;max-width:44vw;height:80px;border:0;border-radius:3px;font:400 30px/1 ${SANS};letter-spacing:.01em;cursor:pointer;display:grid;place-items:center;box-shadow:0 1px 0 #0001}
    .mm-edit-btn{position:absolute;right:16px;bottom:16px;z-index:8;background:#36e0b0;color:#0d3b2c;border:0;border-radius:3px;height:46px;padding:0 18px;font:500 15px ${SANS};letter-spacing:.05em;display:flex;align-items:center;gap:10px;cursor:pointer;box-shadow:0 2px 0 #1fa77f}
    .mm-tool{position:absolute;right:16px;bottom:16px;z-index:8;display:none;gap:6px;background:#111;border-radius:12px;padding:6px;box-shadow:0 10px 30px #0004}
    .mm-tool button{background:#262626;color:#fff;border:0;border-radius:8px;height:38px;padding:0 13px;font:700 12px ${SANS};letter-spacing:.04em;cursor:pointer}
    .mm-tool button:hover{background:#333}.mm-tool button.done{background:#36e0b0;color:#0d3b2c}
    .mm-tray{position:absolute;right:16px;bottom:72px;z-index:8;display:none;grid-template-columns:repeat(4,64px);gap:8px;background:#fff;border:1.5px solid #111;border-radius:12px;padding:10px;box-shadow:6px 6px 0 #111}
    .mm-tray button{background:#f6f6f4;border:0;border-radius:8px;height:64px;cursor:pointer;display:grid;place-items:center}
    .mm-tray button:hover{background:#e9fbf3}
    .mm-sw{display:flex;gap:6px;align-items:center;padding:0 6px}.mm-sw i{width:18px;height:18px;border-radius:50%;cursor:pointer;box-shadow:0 0 0 2px #fff3}
    .mm-hint{position:absolute;right:20px;bottom:74px;z-index:7;background:#111;color:#fff;font:600 12px ${SANS};padding:8px 12px;border-radius:8px;animation:mmB 1.6s ease-in-out infinite}
    @keyframes mmB{50%{transform:translateY(-5px)}}
    @keyframes mmF{50%{transform:translateY(-8px) rotate(3deg)}}
  `));
  const G = (id, a, b, c = '#9e9e9e') => s('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 1 }, s('stop', { offset: 0, 'stop-color': a }), s('stop', { offset: .55, 'stop-color': b }), s('stop', { offset: 1, 'stop-color': c }));
  const svgW = (w, hh, ...kids) => s('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, style: 'overflow:visible;display:block' }, s('defs', {}, G('mmw', '#ffffff', '#e4e4e4', '#a9a9a9'), G('mmw2', '#f7f7f7', '#cfcfcf', '#8f8f8f')), ...kids);
  const SH = {
    cube: () => svgW(56, 60, s('polygon', { points: '28,2 54,14 54,44 28,58 2,44 2,14', fill: '#d6d6d6' }), s('polygon', { points: '28,2 54,14 28,27 2,14', fill: '#f6f6f6' }), s('polygon', { points: '28,27 54,14 54,44 28,58', fill: '#b9b9b9' }), s('polygon', { points: '2,14 28,27 28,58 2,44', fill: '#e2e2e2' })),
    ico: () => svgW(170, 120, s('polygon', { points: '30,10 120,0 168,46 150,104 70,118 8,70', fill: '#d4d4d4' }), s('polygon', { points: '30,10 120,0 92,52', fill: '#f4f4f4' }), s('polygon', { points: '120,0 168,46 92,52', fill: '#e6e6e6' }), s('polygon', { points: '168,46 150,104 92,52', fill: '#bdbdbd' }), s('polygon', { points: '92,52 150,104 70,118', fill: '#c9c9c9' }), s('polygon', { points: '30,10 92,52 8,70', fill: '#ececec' }), s('polygon', { points: '8,70 92,52 70,118', fill: '#dcdcdc' })),
    ring: () => svgW(70, 110, s('path', { d: 'M52 14 C 10 10, 4 92, 50 98', fill: 'none', stroke: 'url(#mmw)', 'stroke-width': 26, 'stroke-linecap': 'round' }), s('path', { d: 'M52 14 C 10 10, 4 92, 50 98', fill: 'none', stroke: '#ffffff', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: .8, transform: 'translate(-6,-3)' })),
    spring: () => { const pts = []; for (let i = 0; i < 9; i++) pts.push(`${10 + i * 13},${i % 2 ? 20 : 78}`); return svgW(130, 100, s('polyline', { points: pts.join(' '), fill: 'none', stroke: '#9b9b9b', 'stroke-width': 18, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(3,4)' }), s('polyline', { points: pts.join(' '), fill: 'none', stroke: 'url(#mmw)', 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })); },
    stick: () => svgW(30, 110, s('rect', { x: 6, y: 2, width: 16, height: 104, rx: 8, fill: 'url(#mmw2)' }), s('rect', { x: 9, y: 8, width: 4, height: 88, rx: 2, fill: '#fff', opacity: .9 })),
    frame: () => svgW(60, 120, s('path', { d: 'M8 8 L52 22 L52 112 L8 98 Z', fill: 'none', stroke: 'url(#mmw2)', 'stroke-width': 12, 'stroke-linejoin': 'round' })),
    cursor: (sc = 1) => svgW(40 * sc, 54 * sc, s('path', { d: 'M2 2 L2 40 L11 31 L18 48 L25 45 L18 29 L31 29 Z', fill: '#fff', stroke: '#111', 'stroke-width': 2.6, 'stroke-linejoin': 'round', transform: `scale(${sc})` })),
  };
  const STK = {
    star: () => svgW(60, 60, s('polygon', { points: '30,3 37,22 57,22 41,35 47,55 30,43 13,55 19,35 3,22 23,22', fill: '#ffd23f', stroke: '#111', 'stroke-width': 3, 'stroke-linejoin': 'round' })),
    heart: () => svgW(60, 56, s('path', { d: 'M30 52 C 4 34, 2 14, 16 7 C 24 3, 30 10, 30 14 C 30 10, 36 3, 44 7 C 58 14, 56 34, 30 52 Z', fill: '#ff6fa8', stroke: '#111', 'stroke-width': 3 })),
    smile: () => svgW(60, 60, s('circle', { cx: 30, cy: 30, r: 26, fill: '#ffe066', stroke: '#111', 'stroke-width': 3 }), s('circle', { cx: 21, cy: 25, r: 3.5, fill: '#111' }), s('circle', { cx: 39, cy: 25, r: 3.5, fill: '#111' }), s('path', { d: 'M18 36 Q30 48 42 36', fill: 'none', stroke: '#111', 'stroke-width': 3, 'stroke-linecap': 'round' })),
    wow: () => { const p = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, r = i % 2 ? 22 : 31; p.push(`${33 + Math.cos(a) * r},${33 + Math.sin(a) * r}`); } return svgW(66, 66, s('polygon', { points: p.join(' '), fill: '#ff5a36', stroke: '#111', 'stroke-width': 3 }), s('text', { x: 33, y: 39, 'text-anchor': 'middle', 'font-family': SANS, 'font-weight': 900, 'font-size': 15, fill: '#fff' }, 'WOW')); },
    flower: () => svgW(60, 60, ...[0, 1, 2, 3, 4, 5].map((i) => s('ellipse', { cx: 30, cy: 14, rx: 9, ry: 14, fill: ['#ff9ec7', '#ffb35c', '#b9a3ff', '#7fd6ff', '#ff9ec7', '#ffd166'][i], stroke: '#111', 'stroke-width': 2.5, transform: `rotate(${i * 60} 30 30)` })), s('circle', { cx: 30, cy: 30, r: 8, fill: '#ffd23f', stroke: '#111', 'stroke-width': 2.5 })),
    bolt: () => svgW(48, 64, s('polygon', { points: '28,2 4,36 22,36 16,62 44,24 26,24 32,2', fill: '#8be0ff', stroke: '#111', 'stroke-width': 3, 'stroke-linejoin': 'round' })),
    cursor: () => SH.cursor(1),
    mmm: () => h('div', { style: { background: '#7113e2', color: '#fff', font: `700 22px/1 ${SERIF}`, padding: '8px 12px', borderRadius: '6px', transform: 'rotate(-6deg)', boxShadow: '3px 3px 0 #111' } }, 'mmm'),
  };
  // sidebar
  const fr = rng(11); const flowers = svgW(140, 110, ...Array.from({ length: 16 }, (_, i) => { const r = fr; const cx = 10 + r() * 120, cy = 20 + r() * 85; const col = pick(['#f2a03d', '#e2536b', '#f7d046', '#9b6dd6', '#4f9b5c', '#f08ab2', '#3a7d44'], r); return s('g', {}, ...[0, 1, 2, 3, 4].map((k) => s('ellipse', { cx, cy: cy - 6, rx: 3.5, ry: 7, fill: col, transform: `rotate(${k * 72} ${cx} ${cy})` })), s('circle', { cx, cy, r: 3, fill: '#5a3a1a' })); }), s('circle', { cx: 18, cy: 98, r: 9, fill: '#36e0b0', stroke: '#111', 'stroke-width': 2 }));
  const side = h('aside.mm-side', {},
    h('div.mm-pill', {}, h('span.i', { onclick: () => toast('mmm.page — an internet for people') }, 'ⓘ'), h('span', { onclick: () => toast('Login (demo)') }, 'LOGIN'), h('span', { onclick: () => toast('Sign up (demo)') }, 'SIGN UP')),
    h('nav.mm-nav', {}, h('a.on', { onclick: (e) => navSel(e) }, h('span', {}, '⌂'), 'HOME'), h('a', { onclick: (e) => navSel(e) }, h('span', {}, '◍'), 'EXPLORE')),
    h('div.mm-card', {}, h('b', {}, 'An Internet for People'), h('ol', {}, h('li', {}, 'Your internet canvas'), h('li', {}, 'Space for everyone'), h('li', {}, 'Fun & enlivening'))),
    h('div', { style: { position: 'absolute', left: 0, bottom: 0, width: '186px', pointerEvents: 'none' } }, flowers));
  function navSel(e) { side.querySelectorAll('.mm-nav a').forEach((a) => a.classList.remove('on')); e.currentTarget.classList.add('on'); toast(e.currentTarget.textContent.replace(/[^A-Z]/g, '')); }
  const canvas = h('div.mm-canvas');
  // items
  const items = []; let uid = 0;
  function add(el, cx, y, { rot = 0, sc = 1, z = 1, float = false, fixed = false } = {}) {
    const node = h('div.mm-it', { style: { zIndex: z } }, el, h('i.mm-hd.r', { title: 'rotate' }), h('i.mm-hd.s', { title: 'scale' }), h('i.mm-hd.x', { title: 'delete' }, '×'));
    const it = { id: ++uid, el: node, cx, y, rot, sc, alive: true, float };
    if (float) el.style.animation = `mmF ${4 + (uid % 3)}s ease-in-out ${uid * 0.3}s infinite`;
    items.push(it); canvas.append(node); place(it); bind(it); return it;
  }
  function place(it) { Object.assign(it.el.style, { left: `calc(50% + ${it.cx}px)`, top: it.y + 'px', transform: `translate(-50%,-50%) rotate(${it.rot}deg) scale(${it.sc})` }); it.el.querySelectorAll('.mm-hd').forEach((d) => (d.style.transform = `scale(${1 / it.sc})`)); }
  // logo with brush stroke
  const brush = s('svg', { width: 600, height: 150, viewBox: '0 0 600 150', style: 'position:absolute;left:-30px;top:-6px;overflow:visible' },
    s('defs', {}, s('filter', { id: 'mmbr', x: '-10%', y: '-30%', width: '120%', height: '160%' }, s('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.035 0.6', numOctaves: 2, seed: 4 }), s('feDisplacementMap', { in: 'SourceGraphic', scale: 16 }))),
    s('path', { d: 'M18 30 C 150 8, 420 14, 588 26 L 582 92 C 400 86, 160 98, 14 96 Z', fill: '#f1d48d', filter: 'url(#mmbr)' }),
    s('path', { d: 'M24 84 C 170 74, 420 80, 584 74 L 574 130 C 420 136, 180 128, 30 120 Z', fill: '#e8a3a7', filter: 'url(#mmbr)', opacity: .95 }));
  const logo = h('div', { style: { position: 'relative', width: '540px', height: '140px' } }, brush,
    h('div', { style: { position: 'absolute', left: 0, right: 0, top: '-38px', font: `620 182px/182px ${SERIF}`, fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0', letterSpacing: '-0.035em', color: '#0b0b0b', textAlign: 'center' } }, 'mmm'),
    h('div', { style: { position: 'absolute', right: '6px', top: '58px' } }, SH.cursor(1.3)));
  const head = h('div', { style: { font: `400 45px/1.18 ${SANS}`, letterSpacing: '-0.02em', textAlign: 'center', width: '640px', color: '#0b0b0b' } }, 'Dead simple, drag & drop websites for anything');
  const chip = h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#36e0b0', color: '#0d3b2c', font: `600 13px/1 ${SANS}`, letterSpacing: '.05em', padding: '10px 12px', borderRadius: '3px', verticalAlign: 'middle', margin: '0 6px' } }, 'EDIT ✎');
  const sub = h('div', { style: { font: `400 28px/1.32 ${SANS}`, letterSpacing: '-0.01em', color: '#6b6b6b', textAlign: 'center', width: '600px' } }, 'Websites don’t have to be so cookie cutter. Try it out — tap', chip, 'in bottom right, then tap anything on this page.');
  const explore = h('button.mm-btn', { style: { background: '#7113e2', color: '#fff' }, onclick: () => !editing && toast('Explore → community pages') }, 'EXPLORE →');
  const signup = h('div', { style: { position: 'relative' } }, h('button.mm-btn', { style: { background: '#72dc95', color: '#0e2a17' }, onclick: () => !editing && toast('Sign up → claim your mmm.page') }, 'SIGN UP →'),
    h('div', { style: { position: 'absolute', right: '10px', top: '30px', pointerEvents: 'none' } }, SH.cursor(1)),
    h('div', { style: { position: 'absolute', left: '50%', top: '86px', height: '80px', borderLeft: '3px dotted #222', pointerEvents: 'none' } }));
  const base = [
    add(SH.frame(), -660, 112, { float: true }), add(SH.cube(), -330, 52, { float: true }), add(SH.ring(), -510, 300, { float: true, rot: -8 }),
    add(SH.spring(), -580, 760, { rot: -40, float: true }), add(SH.ico(), 520, 38, { rot: 8, float: true }), add(SH.stick(), 430, 240, { rot: -32, float: true }), add(SH.stick(), 520, 690, { rot: -8, sc: .7, float: true }),
    add(logo, 0, 120, { z: 2 }), add(head, 0, 280, { z: 2 }), add(sub, 0, 412, { z: 2 }), add(explore, 0, 540, { z: 2 }), add(signup, 0, 637, { z: 2 }),
  ];
  // edit state
  let editing = false, sel = null; const hist = [];
  const snapOf = (it) => ({ cx: it.cx, y: it.y, rot: it.rot, sc: it.sc });
  function select(it) { if (sel) sel.el.classList.remove('sel'); sel = it; if (it) it.el.classList.add('sel'); }
  function bind(it) {
    const n = it.el; const [hr, hs, hx] = n.querySelectorAll('.mm-hd');
    const center = () => { const r = n.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
    let start, p0;
    drag(n, { start: (e) => { if (!editing || e.target.classList.contains('mm-hd')) return false; select(it); start = snapOf(it); p0 = { x: e.clientX, y: e.clientY }; n.style.cursor = 'grabbing'; }, move: (e) => { it.cx = start.cx + e.clientX - p0.x; it.y = start.y + e.clientY - p0.y; place(it); }, end: () => { n.style.cursor = ''; if (start && (start.cx !== it.cx || start.y !== it.y)) hist.push({ it, prev: start }); } });
    drag(hr, { start: () => { if (!editing) return false; start = snapOf(it); }, move: (e) => { const c = center(); it.rot = Math.round((Math.atan2(e.clientY - c.y, e.clientX - c.x) * 180) / Math.PI + 90); place(it); }, end: () => hist.push({ it, prev: start }) });
    drag(hs, { start: (e) => { if (!editing) return false; start = snapOf(it); const c = center(); p0 = Math.hypot(e.clientX - c.x, e.clientY - c.y); }, move: (e) => { const c = center(); it.sc = clamp(start.sc * (Math.hypot(e.clientX - c.x, e.clientY - c.y) / p0), 0.3, 3); place(it); }, end: () => hist.push({ it, prev: start }) });
    hx.addEventListener('click', (e) => { e.stopPropagation(); kill(it); });
  }
  function kill(it, rec = true) { it.alive = false; it.el.remove(); if (sel === it) select(null); if (rec) hist.push({ it, deleted: true }); }
  function revive(it) { it.alive = true; canvas.append(it.el); place(it); }
  function undo() { const a = hist.pop(); if (!a) return toast('Nothing to undo'); if (a.added) kill(a.it, false); else if (a.deleted) revive(a.it); else { Object.assign(a.it, a.prev); place(a.it); } }
  canvas.addEventListener('pointerdown', (e) => { if (editing && e.target === canvas) { select(null); tray.style.display = 'none'; } });
  function addSticker(k, cx = (Math.random() - 0.5) * 600, y = 140 + Math.random() * 520) { const it = add(STK[k](), Math.round(cx), Math.round(y), { rot: Math.round((Math.random() - 0.5) * 30), z: 4 }); hist.push({ it, added: true }); select(it); return it; }
  function addText() { const t = h('div', { contenteditable: 'true', style: { font: `700 34px/1.1 ${SERIF}`, padding: '4px 8px', outline: 'none', minWidth: '120px', color: '#111', background: '#fff8', cursor: 'text' } }, 'Type anything ✎'); const it = add(t, Math.round((Math.random() - 0.5) * 400), 200 + Math.round(Math.random() * 400), { z: 4 }); hist.push({ it, added: true }); select(it); return it; }
  const tray = h('div.mm-tray', {}, Object.keys(STK).map((k) => h('button', { title: k, onclick: () => { addSticker(k); toast(`+ ${k} sticker`); } }, (() => { const e = STK[k](); e.style.transform = 'scale(.7)'; return e; })())));
  const BGS = ['#ffffff', '#fff6d8', '#ffe1ec', '#e2f7ee', '#e6e2ff', '#111111'];
  const setBg = (c) => { canvas.style.background = c; head.style.color = c === '#111111' ? '#fff' : '#0b0b0b'; };
  const tool = h('div.mm-tool', {},
    h('button', { onclick: () => addText() }, '＋ TEXT'),
    h('button', { onclick: () => (tray.style.display = tray.style.display === 'grid' ? 'none' : 'grid') }, '＋ STICKER'),
    h('div.mm-sw', {}, BGS.map((c) => h('i', { style: { background: c }, title: 'page background', onclick: () => setBg(c) }))),
    h('button', { onclick: undo }, '↺ UNDO'),
    h('button.done', { onclick: () => setEdit(false) }, 'DONE ✓'));
  const hint = h('div.mm-hint', {}, 'tap EDIT, then drag anything ↓');
  const editBtn = h('button.mm-edit-btn', { onclick: () => setEdit(true) }, 'EDIT', h('span', { style: { fontSize: '17px' } }, '✎'));
  function setEdit(on) { editing = on; root.classList.toggle('mm-edit', on); canvas.classList.toggle('mm-edit', on); tool.style.display = on ? 'flex' : 'none'; editBtn.style.display = on ? 'none' : 'flex'; hint.style.display = 'none'; if (!on) { select(null); tray.style.display = 'none'; } else toast('Edit mode — drag, rotate ◯, scale ◢, delete ×'); }
  root.append(canvas, side, hint, tray, tool, editBtn);
  window.addEventListener('keydown', (e) => { if (!editing) return; if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo(); } if ((e.key === 'Delete' || e.key === 'Backspace') && sel && document.activeElement?.contentEditable !== 'true') kill(sel); });
  window.__demoProof = async () => {
    const h0 = hist.length; const logoIt = base[7], headIt = base[8];
    setEdit(true); await sleep(80);
    const r = logoIt.el.getBoundingClientRect(); const x = r.width * 0.3, y = r.height * 0.5;
    fire(logoIt.el, 'pointerdown', x, y); fire(logoIt.el, 'pointermove', x + 60, y + 30); fire(logoIt.el, 'pointerup', x, y);
    const moved = logoIt.cx !== 0; select(headIt); headIt.rot = 6; place(headIt); hist.push({ it: headIt, prev: { cx: 0, y: 280, rot: 0, sc: 1 } });
    const st1 = addSticker('star', 260, 180); const st2 = addSticker('wow', -280, 470); setBg('#fff6d8'); await sleep(250);
    const n = items.filter((i) => i.alive).length;
    while (hist.length > h0) undo(); setBg('#ffffff'); setEdit(false); hint.style.display = '';
    return `edit mode · dragged logo (${moved}) · rotated headline · +2 stickers (${n} items) · bg swap · undo×all · restored`;
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['parody-desktop-os-sandbox'])(root, T); }
