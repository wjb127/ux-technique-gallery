import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/inter';
import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, blip, drum, midi, audio, fitCanvas, fire, css } from '../lib.js';
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

V['posthog-desktop-os-marketing-site'] = (root, T) => {
  theme(root, T, { bg: '#9fbf72', fg: '#151515', ac: '#f1a82c', dark: false });
  const SA = "'Inter Variable',system-ui,sans-serif", KEY = 'ph-clone-wins-v1';
  root.append(h('style', {}, `.ph-root{position:absolute;inset:0;overflow:hidden;font:14px/1.45 ${SA};background:radial-gradient(ellipse 60% 40% at 85% 95%,#7da34f,transparent),radial-gradient(ellipse 80% 50% at 10% 100%,#86ad55,transparent),repeating-linear-gradient(100deg,#0000 0 6px,#ffffff08 6px 8px),linear-gradient(180deg,#b9d48f,#9cbf6c 55%,#86ad55)}.ph-menu{position:absolute;left:6px;right:6px;top:6px;height:30px;background:#eef0e6ee;backdrop-filter:blur(8px);border-radius:4px;display:flex;align-items:center;padding:0 10px;gap:2px;z-index:900;box-shadow:0 1px 0 #0001}.ph-mi{padding:4px 8px;border-radius:4px;cursor:pointer;font-size:13px;position:relative}.ph-mi:hover,.ph-mi.on{background:#0000000f}.ph-dd{position:absolute;top:28px;left:0;min-width:200px;background:#fdfdf8;border:1px solid #0002;border-radius:6px;box-shadow:0 10px 30px #0003;padding:6px;display:none}.ph-mi.on .ph-dd{display:block}.ph-dd div{padding:6px 10px;border-radius:4px}.ph-dd div:hover{background:#f1a82c33}.ph-ic{position:absolute;width:86px;text-align:center;font-size:12px;line-height:1.25;color:#1d1d1d;cursor:default;user-select:none;padding:4px 2px;border-radius:4px;text-shadow:0 1px 0 #fff8}.ph-ic.sel{background:#ffffff55;outline:1px dashed #0005}.ph-ic .g{width:40px;height:34px;margin:0 auto 6px;display:grid;place-items:center;font-size:26px;filter:grayscale(.2)}.ph-win{position:absolute;background:#f5f5ef;border:1px solid #0000002a;border-radius:8px;box-shadow:0 18px 50px #0003;display:flex;flex-direction:column;overflow:hidden;min-width:300px;min-height:180px}.ph-win.act{box-shadow:0 22px 70px #0005;border-color:#0004}.ph-tb{height:30px;flex:none;display:flex;align-items:center;gap:8px;padding:0 10px;font-size:12px;color:#777;cursor:grab;background:#ecece4}.ph-win.act .ph-tb{background:#e5e7dd;color:#222}.ph-tb button{border:0;background:transparent;width:22px;height:22px;border-radius:4px;cursor:pointer;color:#666;font-size:13px}.ph-tb button:hover{background:#0001}.ph-body{flex:1;overflow:auto;background:#fff}.ph-rs{position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;background:linear-gradient(135deg,#0000 50%,#0003 50% 58%,#0000 58% 70%,#0003 70% 78%,#0000 78%)}.ph-task{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);display:flex;gap:6px;background:#eef0e6dd;backdrop-filter:blur(8px);border-radius:8px;padding:5px;z-index:900;box-shadow:0 4px 18px #0002}.ph-task span{padding:5px 12px;border-radius:5px;font-size:12px;cursor:pointer;background:#fff8}.ph-task span.act{background:#fff;box-shadow:0 0 0 1px #0002;font-weight:600}.ph-task span.min{opacity:.55;font-style:italic}.ph-btn{border:0;border-radius:6px;padding:11px 18px;font:600 14px ${SA};cursor:pointer;box-shadow:0 3px 0 #b97d12;background:#f1a82c;color:#151515;transition:transform .1s}.ph-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #b97d12}.ph-btn.w{background:#fff;box-shadow:0 3px 0 #bbb;border:1px solid #ccc}.ph-hl{background:#f6e7a4;padding:0 2px}.ph-tab{flex:1;text-align:center;padding:10px;cursor:pointer;color:#555;font-weight:600;font-size:13px;border-radius:6px 6px 0 0}.ph-tab.on{background:#b62ad9;color:#fff}@media (max-width:700px){.ph-win{left:0!important;top:36px!important;width:100%!important;height:calc(100% - 36px)!important;border-radius:12px 12px 0 0}.ph-ic{position:static;display:inline-block}.ph-icons{position:absolute;top:44px;left:0;right:0;display:flex;flex-wrap:wrap}}`));
  const desk = h('div.ph-root'); root.append(desk);
  const hog = (w = 34) => s('svg', { viewBox: '0 0 50 26', width: w, height: w * 0.52 }, ...[['#1d4aff', 0], ['#f54e00', 9], ['#f9bd2b', 18]].map(([c, x]) => s('path', { d: `M${x} 26V8l9 9V26z M${x} 8V0l9 9v8z`, fill: c })), s('path', { d: 'M27 26V0l20 20v6z', fill: '#151515' }), s('circle', { cx: 39, cy: 15, r: 1.6, fill: '#fff' }));
  // persisted window state
  let saved = {}; try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch {}
  const save = () => { const o = {}; wins.forEach((w, k) => { o[k] = { x: w.el.offsetLeft, y: w.el.offsetTop, w: w.el.offsetWidth, hh: w.el.offsetHeight }; }); try { localStorage.setItem(KEY, JSON.stringify(o)); } catch {} };
  const wins = new Map(); let z = 10;
  const task = h('div.ph-task'); desk.append(task);
  const drawTask = () => task.replaceChildren(...[...wins].map(([k, w]) => h('span' + (w.el.classList.contains('act') ? '.act' : '') + (w.min ? '.min' : ''), { onclick: () => { if (w.min) { w.min = false; w.el.style.display = ''; } focus(k); } }, w.title)));
  const focus = (k) => { const w = wins.get(k); if (!w) return; wins.forEach((o) => o.el.classList.remove('act')); w.el.classList.add('act'); w.el.style.zIndex = ++z; drawTask(); };
  const close = (k) => { const w = wins.get(k); if (!w) return; w.el.remove(); wins.delete(k); drawTask(); };
  const open = (k) => { if (wins.has(k)) { const w = wins.get(k); w.min = false; w.el.style.display = ''; return focus(k); } const def = APPS[k]; const p = saved[k] || def.pos; const el = h('div.ph-win', { style: { left: p.x + 'px', top: p.y + 'px', width: p.w + 'px', height: p.hh + 'px' }, onpointerdown: () => focus(k) });
    const w = { el, title: def.title, min: false, max: null };
    const bar = h('div.ph-tb', {}, h('span', { style: { fontWeight: 600 } }, def.title), h('span', { style: { flex: 1 } }), h('button', { title: 'Minimize', onclick: (e) => { e.stopPropagation(); w.min = true; el.style.display = 'none'; el.classList.remove('act'); drawTask(); } }, '–'), h('button', { title: 'Maximize', onclick: (e) => { e.stopPropagation(); toggleMax(); } }, '▢'), h('button', { title: 'Close', onclick: (e) => { e.stopPropagation(); close(k); } }, '✕'));
    const toggleMax = () => { if (w.max) { Object.assign(el.style, w.max); w.max = null; } else { w.max = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height }; Object.assign(el.style, { left: '6px', top: '42px', width: desk.clientWidth - 12 + 'px', height: desk.clientHeight - 100 + 'px' }); } save(); }; w.toggleMax = toggleMax;
    bar.addEventListener('dblclick', toggleMax);
    bar.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; const sx = e.clientX - el.offsetLeft, sy = e.clientY - el.offsetTop; bar.setPointerCapture(e.pointerId); bar.style.cursor = 'grabbing'; const mv = (ev) => { el.style.left = clamp(ev.clientX - sx, -el.offsetWidth + 80, desk.clientWidth - 80) + 'px'; el.style.top = clamp(ev.clientY - sy, 36, desk.clientHeight - 40) + 'px'; }; const up = () => { bar.removeEventListener('pointermove', mv); bar.style.cursor = ''; save(); }; bar.addEventListener('pointermove', mv); bar.addEventListener('pointerup', up, { once: true }); });
    const rs = h('div.ph-rs'); rs.addEventListener('pointerdown', (e) => { e.stopPropagation(); focus(k); const sx = e.clientX, sy = e.clientY, w0 = el.offsetWidth, h0 = el.offsetHeight; rs.setPointerCapture(e.pointerId); const mv = (ev) => { el.style.width = Math.max(300, w0 + ev.clientX - sx) + 'px'; el.style.height = Math.max(180, h0 + ev.clientY - sy) + 'px'; }; rs.addEventListener('pointermove', mv); rs.addEventListener('pointerup', () => { rs.removeEventListener('pointermove', mv); save(); }, { once: true }); });
    el.append(bar, h('div.ph-body', {}, def.body()), rs); desk.append(el); wins.set(k, w); focus(k); save(); };
  // window contents
  const homeBody = () => { let tab = 0; const tabNames = ['Ask PostHog anything', 'Give agents product context', 'Ship with PostHog']; const COPY = [['Ask PostHog anything', 'PostHog is the single place to ingest, store, and query your product and company data. Analytics, replays, errors, and logs, stitched together on-the-fly to answer any question you have.'], ['Give agents product context', 'Connect your coding agent to PostHog over MCP so it can read real usage, errors and experiments before it writes a line of code.'], ['Ship with PostHog', 'Feature flags, experiments and surveys live next to the data they move, so every release ships with its own feedback loop.']];
    const tabsEl = h('div', { style: { display: 'flex', gap: '4px' } }); const pane = h('div'); const prompt = h('div', { style: { padding: '8px 12px', minHeight: '40px', color: '#222' } }); const QS = ['Why are signups growing, but paid conversion is flat?', 'Which feature do churned users touch last?', 'Show me rage clicks on the pricing page this week'];
    let qi = 0, ci = 0; const typer = setInterval(() => { if (!root.isConnected) return clearInterval(typer); const q = QS[qi]; ci++; prompt.textContent = q.slice(0, ci); if (ci > q.length + 25) { ci = 0; qi = (qi + 1) % QS.length; } }, 55);
    const draw = () => { tabsEl.replaceChildren(...tabNames.map((t, i) => h('div.ph-tab' + (i === tab ? '.on' : ''), { onclick: () => { tab = i; draw(); } }, t))); pane.replaceChildren(h('div', { style: { border: '6px solid #b62ad9', borderRadius: '0 0 8px 8px', padding: '18px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', background: '#fff' } }, h('div', { style: { border: '1px solid #ddd', borderRadius: '6px', padding: '22px 12px 12px', textAlign: 'center', background: '#fafaf7' } }, hog(40), h('div', { style: { font: `600 18px ${SA}`, margin: '10px 0 14px' } }, 'What can I help you with?'), h('div', { style: { border: '1px solid #ccc', borderRadius: '6px', textAlign: 'left', background: '#fff' } }, h('div', { style: { padding: '6px 8px' } }, h('span', { style: { border: '1px solid #ddd', borderRadius: '4px', padding: '1px 6px', fontSize: '11px', color: '#666' } }, '@ Add context ▾')), prompt, h('div', { style: { display: 'flex', gap: '6px', padding: '6px 8px', fontSize: '11px', alignItems: 'center' } }, h('span', { style: { border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px' } }, '✓ Auto ▾'), h('span', { style: { border: '1px solid #ddd', borderRadius: '4px', padding: '2px 6px' } }, 'Default · Claude Sonnet ▾'), h('span', { style: { flex: 1 } }), h('span', { style: { border: '1px solid #f1a82c', borderRadius: '4px', padding: '2px 8px', color: '#f1a82c', fontSize: '14px' } }, '→'))), h('div', { style: { display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' } }, ...['</> Coding', '▥ Product analytics', '⛁ SQL', '▶ Session replay'].map((c) => h('span', { style: { border: '1px solid #ddd', borderRadius: '4px', padding: '2px 7px', fontSize: '11px', background: '#fff' } }, c)))), h('div', {}, h('div', { style: { font: `600 22px ${SA}`, marginBottom: '10px' } }, COPY[tab][0]), h('p', { style: { fontSize: '16px', lineHeight: 1.55, color: '#444' } }, COPY[tab][1]), h('button.ph-btn', { style: { padding: '7px 12px', fontSize: '12px' }, onclick: () => open('signup') }, 'Get started - free')))); };
    draw();
    return h('div', { style: { padding: '40px 56px 30px', background: 'linear-gradient(180deg,#f3f4ee,#eceee6)', minHeight: '100%' } }, h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', font: `700 22px ${SA}` } }, hog(44), 'PostHog'), h('div', { style: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', marginTop: '28px', alignItems: 'start' } }, h('div', {}, h('h1', { style: { font: `800 34px/1.15 ${SA}`, margin: '0 0 14px', letterSpacing: '-.02em' } }, 'Your product’s ', h('span', { style: { background: '#d5e3ff', color: '#3d6df5', padding: '0 6px', borderRadius: '3px' } }, 'context layer')), h('p', { style: { fontSize: '17px', lineHeight: 1.55, color: '#333', margin: 0 } }, 'PostHog ingests and stores your ', h('span.ph-hl', {}, 'analytics, errors, replays, and business data'), ' so you and your ', h('u', {}, 'agents'), ' can query and act on it.'), h('p', { style: { fontSize: '17px', color: '#666', marginTop: '24px' } }, 'Join 500,000+ teams already shipping with PostHog.')), h('div', { style: { background: '#fff', borderRadius: '6px', padding: '16px', boxShadow: '0 1px 4px #0002' } }, h('div', { style: { font: `700 17px ${SA}`, display: 'flex', gap: '8px', alignItems: 'center' } }, 'Set up', hog(26), h('span.ph-hl', {}, 'for free')), ...['97% of users pay us $0', 'No credit card required', 'Setup wizard installs PostHog for you'].map((t) => h('div', { style: { fontSize: '13px', marginTop: '7px' } }, h('span', { style: { color: '#2f9e44', marginRight: '6px' } }, '✓'), t)), h('div', { style: { display: 'flex', gap: '8px', marginTop: '14px' } }, h('button.ph-btn', { style: { flex: 1 }, onclick: () => open('signup') }, 'Get started'), h('button.ph-btn.w', { style: { flex: 1 }, onclick: () => toast('npx @posthog/wizard (demo)') }, 'Install with AI')))), h('div', { style: { marginTop: '40px' } }, tabsEl, pane)); };
  const listBody = (title, rows) => () => h('div', { style: { padding: '24px 28px' } }, h('h2', { style: { font: `800 24px ${SA}`, margin: '0 0 14px' } }, title), ...rows.map(([a, b]) => h('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' } }, h('b', { style: { fontWeight: 600 } }, a), h('span', { style: { color: '#666' } }, b))));
  const APPS = {
    home: { title: 'home.mdx', icon: '⌂', label: 'Home', pos: { x: 150, y: 46, w: 1140, hh: 780 }, body: homeBody },
    sdp: { title: 'self-driving-product.mdx', icon: '✈', label: 'Self-driving product', body: listBody('Self-driving product', [['Auto-instrumentation', 'on'], ['Anomaly alerts', 'beta'], ['Agent actions', 'new']]) },
    ctx: { title: 'context-warehouse.mdx', icon: '☁', label: 'Context warehouse', body: listBody('Context warehouse', [['Sources connected', '24'], ['Rows synced today', '1.2B'], ['SQL editor', 'ready']]) },
    pricing: { title: 'pricing.mdx', icon: '💵', label: 'Pricing', body: listBody('Pricing — usage based', [['Product analytics', '1M events free/mo'], ['Session replay', '5K recordings free/mo'], ['Feature flags', '1M requests free/mo'], ['Error tracking', '100K exceptions free/mo']]) },
    docs: { title: 'docs.mdx', icon: '📄', label: 'Docs', body: listBody('Docs', [['Getting started', '5 min'], ['Install the snippet', 'JS · iOS · Android'], ['HogQL reference', 'SQL']]) },
    demo: { title: 'demo.mov', icon: '🎬', label: 'Demo', body: () => h('div', { style: { height: '100%', minHeight: '240px', background: '#111', color: '#fff', display: 'grid', placeItems: 'center', font: `700 28px ${SA}` } }, '▶ 2-minute demo') },
    human: { title: 'talk-to-a-human.mdx', icon: '👤', label: 'Talk to a human', body: listBody('Talk to a human', [['Sales', 'book a call'], ['Support', 'in-app chat'], ['Community', 'forums']]) },
    about: { title: 'about.mdx', icon: '⛰', label: 'About us', body: listBody('About us', [['Founded', '2020'], ['Team', 'fully remote'], ['Values', 'transparency']]) },
    changelog: { title: 'changelog.mdx', icon: '🍲', label: 'Changelog', body: listBody('Changelog', [['Max AI can now write SQL', 'Oct'], ['Replay: network waterfall', 'Sep'], ['Flags: early access', 'Sep']]) },
    handbook: { title: 'handbook.mdx', icon: '📚', label: 'Company handbook', body: listBody('Company handbook', [['How we work', 'read'], ['Compensation', 'transparent'], ['Strategy', 'public']]) },
    store: { title: 'store.mdx', icon: '🛒', label: 'Store', body: listBody('Merch store', [['Hedgehog plushie', '$30'], ['Sticker pack', '$8'], ['Hoodie', '$65']]) },
    careers: { title: 'careers.mdx', icon: '🧑‍🚀', label: 'Careers', body: listBody('Careers', [['Product Engineer', 'Remote'], ['Technical Writer', 'Remote']]) },
    trash: { title: 'Trash', icon: '🗑', label: 'Trash', body: listBody('Trash', [['cookie-banner-v1.tsx', 'deleted'], ['dark-patterns.md', 'deleted']]) },
    signup: { title: 'signup.mdx', icon: '★', label: 'Sign up', body: () => h('div', { style: { padding: '28px' } }, h('h2', { style: { font: `800 22px ${SA}`, margin: '0 0 12px' } }, 'Create your account'), h('input', { placeholder: 'Work email', style: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '10px' } }), h('button.ph-btn', { onclick: () => toast('Account created (demo)') }, 'Continue')) },
  };
  Object.entries({ signup: { x: 520, y: 140, w: 380, hh: 240 } }).forEach(([k, p]) => (APPS[k].pos = p));
  Object.values(APPS).forEach((a, i) => { a.pos ||= { x: 180 + (i % 5) * 40, y: 70 + (i % 5) * 30, w: 560, hh: 420 }; a.pos.w ||= 810; a.pos.hh ||= 570; });
  const icons = h('div.ph-icons'); const L = ['home', 'sdp', 'ctx', 'pricing', 'docs', 'demo', 'human'], Rr = ['about', 'changelog', 'handbook', 'store', 'careers', 'trash'];
  const icon = (k, x, y, right) => { const a = APPS[k]; const el = h('div.ph-ic', { style: right ? { right: x + 'px', top: y + 'px' } : { left: x + 'px', top: y + 'px' }, onclick: () => { icons.querySelectorAll('.sel').forEach((n) => n.classList.remove('sel')); el.classList.add('sel'); }, ondblclick: () => open(k) }, h('div.g', {}, a.icon), a.label); el.dataset.k = k; return el; };
  L.forEach((k, i) => icons.append(icon(k, 0, 44 + i * 66)));
  Rr.forEach((k, i) => icons.append(icon(k, 0, 44 + i * 66, true)));
  desk.append(icons);
  // top menu bar
  const MENUS = { Products: ['Product analytics', 'Web analytics', 'Session replay', 'Feature flags', 'Experiments', 'Error tracking', 'Data warehouse'], Pricing: ['Plans', 'Calculator', 'Startups'], Docs: ['Getting started', 'SDKs', 'API'], Community: ['Questions', 'Blog', 'Newsletter'], Company: ['About', 'Handbook', 'Careers'], More: ['Store', 'Changelog', 'Trash'] };
  const OPEN_FOR = { Plans: 'pricing', 'Getting started': 'docs', About: 'about', Handbook: 'handbook', Careers: 'careers', Store: 'store', Changelog: 'changelog', Trash: 'trash', 'Product analytics': 'sdp', 'Data warehouse': 'ctx' };
  const mis = Object.entries(MENUS).map(([m, items]) => { const mi = h('div.ph-mi', { onclick: (e) => { e.stopPropagation(); const on = !mi.classList.contains('on'); mis.forEach((x) => x.classList.remove('on')); mi.classList.toggle('on', on); } }, m, h('div.ph-dd', {}, ...items.map((t) => h('div', { onclick: (e) => { e.stopPropagation(); mis.forEach((x) => x.classList.remove('on')); OPEN_FOR[t] ? open(OPEN_FOR[t]) : toast(`${t} (demo)`); } }, t)))); return mi; });
  desk.addEventListener('click', () => mis.forEach((x) => x.classList.remove('on')));
  desk.append(h('div.ph-menu', {}, h('span', { style: { marginRight: '8px', display: 'flex' } }, hog(24)), ...mis, h('span', { style: { flex: 1 } }), h('button.ph-btn', { style: { padding: '4px 10px', fontSize: '12px', boxShadow: '0 2px 0 #b97d12' }, onclick: () => open('signup') }, 'Get started – free'), h('span', { style: { margin: '0 6px 0 12px', cursor: 'pointer' } }, '⌕'), h('span', { style: { margin: '0 6px', cursor: 'pointer' } }, '⍰'), h('span', { style: { margin: '0 4px', cursor: 'pointer' } }, '◉')));
  // cookie banner
  const cookie = h('div', { style: { position: 'absolute', right: '12px', bottom: '12px', width: '280px', background: '#fff', borderRadius: '6px', boxShadow: '0 8px 30px #0003', padding: '14px 16px', fontSize: '12.5px', color: '#444', zIndex: 950 } }, h('div', { style: { display: 'flex', justifyContent: 'space-between', font: `700 13px ${SA}`, color: '#111' } }, 'Legally-required cookie banner', h('span', { style: { cursor: 'pointer' }, onclick: () => cookie.remove() }, '✕')), h('p', { style: { margin: '8px 0' } }, 'PostHog.com doesn’t use third-party cookies, only a single in-house cookie.'), h('p', { style: { margin: 0 } }, 'No data is sent to a third party. (This clone stores window positions in localStorage only.)'));
  desk.append(cookie);
  open('home');
  window.__demoProof = async () => { const ic = icons.querySelectorAll('.ph-ic').length; icons.querySelector('[data-k="changelog"]').dispatchEvent(new MouseEvent('dblclick', { bubbles: true })); const n2 = wins.size; const top1 = wins.get('changelog').el.classList.contains('act'); focus('home'); const raised = +wins.get('home').el.style.zIndex > +wins.get('changelog').el.style.zIndex; wins.get('home').toggleMax(); const mx = wins.get('home').el.offsetWidth; wins.get('home').toggleMax(); mis[0].click(); const dd = mis[0].classList.contains('on'); mis[0].click(); const tb = task.children.length; const stored = !!localStorage.getItem(KEY); close('changelog'); focus('home'); return `icons=${ic}, dblclick opened changelog (windows=${n2}, active=${top1}), focus raises z=${raised}, maximize width=${mx}, menu dropdown=${dd}, taskbar items=${tb}, positions saved=${stored}; restored`; };
};
V['infinitemac-beige-bezel-year-timeline-os-launcher-customize-run'] = (root, T) => {
  import('@fontsource/pixelify-sans/400.css'); import('@fontsource/pixelify-sans/700.css'); import('@fontsource/eb-garamond/400.css'); import('@fontsource/eb-garamond/500.css'); import('@fontsource-variable/roboto-flex');
  theme(root, T, { bg: '#262a33', fg: '#fff', ac: '#fff', dark: true });
  root.classList.add('scroll'); root.style.overflow = 'auto';
  const CHI = "'Pixelify Sans','Chicago','ChicagoFLF',monospace", GAR = "'EB Garamond','Apple Garamond',Garamond,Georgia,serif", ROB = "'Roboto Flex Variable',Roboto,system-ui,sans-serif";
  const RB = ['#61bb46', '#fdb827', '#f5821f', '#e03a3e', '#963d97', '#009ddc'];
  css(`.im{min-height:100%;background:#262a33;color:#fff;font:400 15px/1.4 ${ROB};position:relative}
.im-top{background:#dbe4fc;color:#1d1d1d;display:flex;gap:40px;align-items:center;padding:30px 52px 34px 40px}
.im-logo{flex:none;width:228px;display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer}
.im-logo canvas{image-rendering:pixelated}
.im-wm{background:#fff;color:#000;font:400 31px/1 ${CHI};padding:6px 9px 7px;letter-spacing:.01em;white-space:nowrap}
.im-intro p{margin:0 0 12px;font-size:15px;line-height:1.36;color:#222}.im-intro p:last-child{margin:0}
.im-intro a{color:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}.im-intro a:hover{color:#2850c8}
.im-body{padding:6px 40px 90px;position:relative}
.im-yr{font:700 25px ${ROB};margin:44px 0 26px;color:#fff;scroll-margin-top:16px;display:flex;align-items:center;gap:14px}
.im-row{display:flex;flex-wrap:wrap;gap:38px}
.im-filter{position:absolute;right:42px;top:30px;z-index:6;background:#fff;color:#000;border:1.5px solid #000;outline:1.5px solid #fff;padding:5px 7px;display:flex;align-items:center;gap:8px;font:700 13.5px ${CHI}}
.im-pop{all:unset;cursor:pointer;position:relative;border:1px solid #000;box-shadow:1.5px 1.5px 0 #000;padding:1px 26px 1px 8px;font:400 13px ${CHI};min-width:104px;background:#fff}
.im-pop::after{content:'';position:absolute;right:7px;top:6px;border:5px solid transparent;border-top:6px solid #000;border-bottom:0}
.im-menu{position:absolute;right:0;top:calc(100% + 2px);background:#fff;border:1px solid #000;box-shadow:2px 2px 0 #000;padding:2px 0;display:none;min-width:140px}
.im-menu.on{display:block}.im-menu div{padding:3px 12px 3px 20px;font:400 13px ${CHI};position:relative;cursor:pointer;white-space:nowrap}
.im-menu div:hover{background:#000;color:#fff}.im-menu div.on::before{content:'✓';position:absolute;left:6px}
.im-card{width:422px;height:345px;border-radius:7px;position:relative;flex:none;background:linear-gradient(180deg,#e4dbc4,#d8ceb3);box-shadow:inset 0 -3px 0 #c6bb9f,inset 0 2px 0 #f2ecdc,0 10px 22px #0003;transition:transform .2s,box-shadow .2s}
.im-card:hover{transform:translateY(-3px);box-shadow:inset 0 -3px 0 #c6bb9f,inset 0 2px 0 #f2ecdc,0 18px 34px #0005}
.im-card.platinum{background:linear-gradient(180deg,#e2e0da,#cfccc4);box-shadow:inset 0 -3px 0 #b9b6ad,inset 0 2px 0 #f3f2ee,0 10px 22px #0003}
.im-card.next{background:linear-gradient(180deg,#3a3a3c,#232325);box-shadow:inset 0 -3px 0 #141415,inset 0 2px 0 #4c4c4f,0 10px 22px #0005}
.im-card.osx{background:linear-gradient(180deg,#f4f6f8,#dfe4ea);box-shadow:inset 0 -3px 0 #c7ced6,inset 0 2px 0 #fff,0 10px 22px #0003}
.im-card.sel{outline:3px solid #9ec1ff;outline-offset:4px}
.im-scr{position:absolute;left:40px;top:40px;right:40px;height:253px;background:#000;border-radius:5px;padding:11px;box-shadow:inset 0 0 0 2px #0008, 0 0 0 4px #00000014}
.im-win{background:#fff;color:#000;height:100%;padding:18px 16px 14px;display:flex;flex-direction:column;position:relative}
.im-card.osx .im-win,.im-card.platinum.v8 .im-win{border-radius:2px}
.im-win h3{margin:0;font:400 25px/1.05 ${GAR};letter-spacing:-.005em}
.im-dt{color:#999;font:400 13.5px ${ROB};margin:3px 0 12px}
.im-ds{font:400 15px/1.32 ${ROB};color:#111;margin:0;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.im-btns{margin-top:auto;display:flex;justify-content:flex-end;gap:10px}
.im-b{all:unset;cursor:pointer;font:700 13px ${CHI};border:1.5px solid #000;border-radius:7px;padding:2px 14px 3px;background:#fff;color:#000;user-select:none}
.im-b:active,.im-b.down{background:#000;color:#fff}
.im-b.cus{opacity:0;transition:opacity .15s}.im-card:hover .im-b.cus,.im-card:focus-within .im-b.cus{opacity:1}
.im-b.def{box-shadow:0 0 0 2px #fff,0 0 0 4.5px #000}
.im-badge{position:absolute;left:40px;bottom:12px}
.im-next-logo{position:absolute;left:40px;bottom:13px;width:18px;height:18px;background:#000;transform:rotate(-12deg);display:grid;place-items:center;font:700 6px ${ROB};color:#fff;letter-spacing:-.02em;box-shadow:0 0 0 1px #555}
.im-rail{position:fixed;right:10px;bottom:22px;z-index:7;display:flex;flex-direction:column;gap:1px;padding:6px 4px;border-radius:6px;background:#1c1f26cc;backdrop-filter:blur(4px)}
.im-rail a{font:400 10.5px ${CHI};color:#8f97a8;padding:1px 6px;cursor:pointer;border-radius:3px;text-align:right;transition:color .15s,background .15s}
.im-rail a:hover{color:#fff}.im-rail a.on{color:#000;background:#dbe4fc}
.im-ov{position:fixed;inset:var(--tg-h,38px) 0 0 0;z-index:20;display:grid;place-items:center;background:#0000;transition:background .2s}
.im-ov.dim{background:#0008}
.im-dlg{background:#fff;color:#000;border:1px solid #000;box-shadow:2px 2px 0 #000;width:470px;font:400 13px ${CHI}}
.im-tb{height:20px;border-bottom:1px solid #000;display:flex;align-items:center;justify-content:center;position:relative;background:repeating-linear-gradient(#fff 0 1px,#000 1px 2px) 0 4px/100% 11px no-repeat;cursor:move}
.im-tb span{background:#fff;padding:0 8px;font:700 13px ${CHI}}
.im-tb i{position:absolute;left:8px;top:4px;width:11px;height:11px;border:1px solid #000;background:#fff;cursor:pointer}
.im-dlg .bd{padding:16px 20px 18px;display:grid;grid-template-columns:auto 1fr;gap:12px 14px;align-items:center}
.im-dlg label{text-align:right}
.im-dlg select{font:400 13px ${CHI};border:1px solid #000;box-shadow:1.5px 1.5px 0 #000;padding:1px 4px;background:#fff;border-radius:0;color:#000}
.im-dlg .ck{display:flex;flex-direction:column;gap:5px}.im-dlg .ck span{display:flex;gap:7px;align-items:center;cursor:pointer}
.im-dlg .ck b{width:12px;height:12px;border:1px solid #000;display:grid;place-items:center;font:700 11px/1 ${ROB}}
.im-dlg .ft{grid-column:1/-1;display:flex;justify-content:flex-end;gap:14px;margin-top:6px}
.im-emu{position:fixed;inset:var(--tg-h,38px) 0 0 0;z-index:30;background:#16181d;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}
.im-ctl{position:absolute;top:12px;left:50%;transform:translateX(-50%);display:flex;gap:10px;align-items:center;background:#ffffffe8;color:#000;padding:5px 8px;border-radius:8px;font:400 12.5px ${CHI};box-shadow:0 6px 20px #0006}
.im-mon{padding:34px 34px 54px;border-radius:9px;position:relative}
.im-screen{position:relative;overflow:hidden;background:#000;image-rendering:pixelated}
.im-mb{height:20px;background:#fff;border-bottom:1px solid #000;display:flex;align-items:center;gap:16px;padding:0 10px;font:700 13px ${CHI};color:#000}
.im-dk{position:absolute;inset:21px 0 0 0}
.im-ic{position:absolute;width:76px;display:flex;flex-direction:column;align-items:center;gap:3px;font:400 12px ${CHI};cursor:default;color:#000}
.im-ic span{background:#fff;padding:0 3px}.im-ic.on span{background:#000;color:#fff}
.im-fw{position:absolute;background:#fff;border:1px solid #000;box-shadow:1px 1px 0 #000;color:#000;font:400 12px ${CHI}}
.im-fw .st{border-bottom:1px solid #000;padding:2px 8px;display:flex;justify-content:space-between;font-size:11px}
.im-fw .gr{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 4px;padding:12px 8px}
.im-boot{position:absolute;inset:0;display:grid;place-items:center}`);
  const D = [
    ['1984', 'System 1.0', '1984-01-24', 'Initial system software release, shipped with the Mac 128K.', 'compact', 1],
    ['1984', 'System 1.1', '1984-05-05', 'Maintenance release that added the Set Startup command and a faster disk copying routine.', 'compact', 0],
    ['1985', 'System 2.0', '1985-04-08', 'Introduced the “New Folder” and “Shut Down” commands, the MiniFinder, and the Choose Printer DA. Also added icons to list view and the Command-Shift-3 screenshot FKEY.', 'compact', 1],
    ['1985', 'System 2.1', '1985-09-17', 'Added support for the Hard Disk 20 drive and the HFS file system.', 'compact', 1],
    ['1986', 'System 3.0', '1986-01-16', 'Added more complete support for HFS, a RAM disk cache, zoom boxes for windows and a redesigned control panel. Introduced with the Mac Plus.', 'compact', 1],
    ['1986', 'System 3.2', '1986-06-02', 'Updated Calculator and Chooser, plus fixes for the Mac Plus SCSI hard disks.', 'compact', 0],
    ['1987', 'System 4.0', '1987-03-02', 'Shipped with the Mac SE and Mac II, adding support for ADB keyboards and mice.', 'compact', 0],
    ['1987', 'System 5.0', '1987-10-08', 'Introduced the MultiFinder, revised the Finder about box, and improved printing support.', 'compact', 1],
    ['1988', 'A/UX 1.0', '1988-02-09', 'Initial release, combining UNIX System V Release 2 with BSD networking, TCP/IP and NFS.', 'compact', 0, 'aux'],
    ['1988', 'System 6.0', '1988-04-30', 'Added MacroMaker, Map and CloseView utilities.', 'compact', 1],
    ['1988', 'NeXTStep 0.8', '1988-10-12', 'First publicly-available preview release. Included the Mach kernel, an object-oriented API based on Objective-C and a Display PostScript-powered UI.', 'next', 1, 'next'],
    ['1989', 'NeXTStep 1.0', '1989-09-11', 'Includes the ability to kill applications from Workspace Manager, a redesigned Preferences application and other polish.', 'next', 0, 'next'],
    ['1990', 'System 6.0.5', '1990-03-19', 'Bundled 32-bit QuickDraw (previously a separate package). Added support for the Mac IIfx.', 'compact', 0],
    ['1990', 'NeXTStep 2.0', '1990-09-18', 'Added support for the NeXTstation and color displays, plus CD-ROM drives and a dockable Workspace.', 'next', 0, 'next'],
    ['1991', 'System 7.0', '1991-05-13', 'Major update with a new color Finder, aliases, Balloon Help, file sharing, virtual memory and drag-and-drop between windows.', 'platinum', 1],
    ['1992', 'System 7.1', '1992-08-28', 'Introduced the Fonts folder and WorldScript for non-Roman languages.', 'platinum', 1],
    ['1994', 'System 7.5', '1994-09-12', 'Added the Apple Guide help system, a hierarchical Apple menu, Stickies and the Control Strip.', 'platinum', 1],
    ['1995', 'NeXTSTEP 3.3', '1995-02-15', 'Final NeXTSTEP release, running on Intel, PA-RISC and SPARC machines as well as NeXT hardware.', 'next', 1, 'next'],
    ['1997', 'Mac OS 7.6', '1997-01-07', 'First release to use the “Mac OS” name. Integrated the Extensions Manager, Open Transport and QuickDraw 3D.', 'platinum', 1],
    ['1997', 'Mac OS 8.0', '1997-07-26', 'Introduced the Platinum appearance, spring-loaded folders, contextual menus and a multi-threaded Finder.', 'platinum', 1],
    ['1998', 'Mac OS 8.5', '1998-10-17', 'Added Sherlock search, Appearance themes, font smoothing and PowerPC-native AppleScript.', 'platinum', 1],
    ['1999', 'Mac OS 9.0', '1999-10-23', 'Added multiple users, Keychain, Sherlock 2 and software update over the Internet.', 'platinum', 1],
    ['2000', 'Mac OS X Public Beta', '2000-09-13', 'Preview of the Aqua interface, the Dock and the Darwin core, sold for $29.95.', 'osx', 1, 'osx'],
    ['2001', 'Mac OS X 10.0', '2001-03-24', 'First release of Mac OS X (“Cheetah”), with protected memory, preemptive multitasking and Classic mode.', 'osx', 1, 'osx'],
    ['2001', 'Mac OS 9.2', '2001-06-18', 'Final major Classic release, required to run the Classic environment on Mac OS X.', 'platinum', 0],
    ['2002', 'Mac OS X 10.2', '2002-08-24', 'Jaguar added Quartz Extreme, Rendezvous, iChat and the Address Book.', 'osx', 1, 'osx'],
  ].map(([y, t, d, ds, bez, n, fam = 'mac'], i) => ({ i, y, t, d, ds, bez, notable: !!n, fam }));
  const FIL = [['all', 'All', () => true], ['notable', 'Notable', (r) => r.notable], ['aux', 'A/UX', (r) => r.fam === 'aux'], ['next', 'NeXT', (r) => r.fam === 'next'], ['osx', 'Mac OS X', (r) => r.fam === 'osx']];
  const MACH = { compact: ['Macintosh 128K', 'Macintosh 512Ke', 'Macintosh Plus', 'Macintosh SE'], platinum: ['Macintosh IIci', 'Macintosh Quadra 650', 'Power Macintosh 6100', 'Power Macintosh 9500'], next: ['NeXT Cube', 'NeXTstation', 'NeXTstation Color'], osx: ['Power Macintosh G3 (Beige)', 'Power Mac G4 (AGP)', 'iMac G3'] };
  const st = { filter: 'notable', sel: null };
  const dfmt = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  // ---- pixel rainbow infinity logo ----
  const logo = () => { const c = h('canvas', { width: 38, height: 21, style: { width: '160px', height: '88px' } }), g = c.getContext('2d');
    for (let y = 0; y < 21; y++) for (let x = 0; x < 38; x++) { const px = (x + 0.5 - 19) / 19, py = (y + 0.5 - 10.5) / 19; const ring = (ox) => { const d = Math.hypot((px - ox) * 1.0, py * 1.05); return d < 0.5 && d > 0.24; }; if (ring(-0.47) || ring(0.47)) { g.fillStyle = RB[Math.min(5, Math.floor((y / 21) * 6))]; g.fillRect(x, y, 1, 1); } }
    return c; };
  const apple = (sz = 16, mono) => { const id = 'imrb' + Math.random().toString(36).slice(2, 7); return s('svg', { width: sz, height: sz * 1.12, viewBox: '0 0 20 22.4' }, s('defs', {}, s('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, ...RB.flatMap((c, k) => [s('stop', { offset: k / 6, 'stop-color': c }), s('stop', { offset: (k + 1) / 6, 'stop-color': c })]))),
    s('path', { d: 'M13.6 0c.1 1.4-.4 2.7-1.2 3.6-.8 1-2.1 1.7-3.3 1.6-.2-1.3.5-2.7 1.2-3.5C11.1.8 12.5.1 13.6 0Zm3.9 16.3c-.6 1.3-.9 1.9-1.6 3.1-1 1.6-2.5 3.6-4.3 3-.9-.2-1.4-.7-2.8-.7s-2 .5-2.9.7C4.1 23 2.7 21.2 1.7 19.6-1 15.3-.4 9.8 2.2 7.6c1.1-1 2.5-1.5 3.8-1.5 1.4 0 2.3.8 3.5.8 1.1 0 1.8-.8 3.5-.8 1.2 0 2.5.6 3.4 1.7-3 1.7-2.5 6.1 1.1 8.5Z', fill: mono ? mono : `url(#${id})` })); };
  // ---- layout ----
  const wrap = h('div.im'); root.append(wrap);
  const intro = h('div.im-intro', {},
    h('p', {}, 'Infinite Mac is a collection of classic Macintosh and NeXT operating systems and software, all easily accessible from the comfort of a web browser.'),
    h('p', {}, 'Pick any version of System Software, A/UX, NeXTStep, Mac OS or Mac OS X from the 1980s, 1990s or early 2000s and run it within a virtual machine. An “Infinite HD” disk with representative software from that era is also available. You can also ', h('a', { onclick: () => customize(D[16]) }, 'run a custom version'), ' with your choice of machine and disks. On some operating systems files and disk images can be imported and exported using drag and drop and virtual CD-ROMs can be mounted – refer to the welcome screen in each machine for more details.'),
    h('p', {}, 'You can ', h('a', {}, 'learn more'), ', ', h('a', {}, 'embed instances into your own site'), ', ', h('a', {}, 'monkey around'), ', ', h('a', {}, 'see what’s changed recently'), ' or ', h('a', {}, 'donate'), ' to support this project.'));
  wrap.append(h('div.im-top', {}, h('div.im-logo', { onclick: () => root.scrollTo({ top: 0, behavior: 'smooth' }) }, logo(), h('div.im-wm', {}, 'Infinite Mac')), intro));
  const body = h('div.im-body'); wrap.append(body);
  const popLbl = h('span'); const pmenu = h('div.im-menu');
  const pop = h('button.im-pop', { onclick: (e) => { e.stopPropagation(); pmenu.classList.toggle('on'); } }, popLbl);
  const filter = h('div.im-filter', {}, 'Releases:', h('span', { style: { position: 'relative' } }, pop, pmenu)); body.append(filter);
  root.addEventListener('click', () => pmenu.classList.remove('on'));
  const list = h('div'); body.append(list);
  const rail = h('div.im-rail'); root.append(rail);
  const card = (r) => { const run = h('button.im-b', { onclick: (e) => { e.stopPropagation(); boot(r, MACH[r.bez][r.bez === 'compact' ? (r.y < 1986 ? 0 : 2) : 0]); } }, 'Run');
    const cus = h('button.im-b.cus', { onclick: (e) => { e.stopPropagation(); customize(r); } }, 'Customize…');
    const el = h(`div.im-card.${r.bez}`, { tabindex: 0, 'data-i': r.i, onclick: () => { st.sel = r.i; draw(); }, ondblclick: () => run.click() },
      h('div.im-scr', {}, h('div.im-win', {}, h('h3', {}, r.t), h('div.im-dt', {}, dfmt(r.d)), h('p.im-ds', {}, r.ds), h('div.im-btns', {}, cus, r.fam === 'aux' && r.t === 'A/UX 1.0' ? null : run))),
      r.bez === 'next' ? h('div.im-next-logo', {}, 'NeXT') : h('div.im-badge', {}, apple(15, r.bez === 'osx' ? '#9aa3ad' : null)));
    if (st.sel === r.i) el.classList.add('sel'); return el; };
  let years = [];
  const draw = () => { const f = FIL.find((x) => x[0] === st.filter); const rows = D.filter(f[2]); popLbl.textContent = `${f[1]} (${rows.length})`;
    pmenu.replaceChildren(...FIL.map(([k, l, fn]) => h('div', { class: k === st.filter ? 'on' : '', onclick: (e) => { e.stopPropagation(); st.filter = k; pmenu.classList.remove('on'); draw(); } }, `${l} (${D.filter(fn).length})`)));
    const by = {}; rows.forEach((r) => (by[r.y] ||= []).push(r)); years = Object.keys(by);
    list.replaceChildren(...years.flatMap((y) => [h('h2.im-yr', { id: 'im-y' + y }, y), h('div.im-row', {}, ...by[y].map(card))]));
    rail.replaceChildren(...years.map((y) => h('a', { onclick: () => jump(y) }, y))); spy(); return rows.length; };
  const jump = (y) => { const el = list.querySelector('#im-y' + y); if (el) root.scrollTo({ top: el.offsetTop - 10, behavior: 'smooth' }); };
  const spy = () => { const hs = [...list.querySelectorAll('.im-yr')]; let cur = 0; hs.forEach((e, k) => { if (e.getBoundingClientRect().top - root.getBoundingClientRect().top < root.clientHeight * 0.45) cur = k; }); [...rail.children].forEach((a, k) => a.classList.toggle('on', k === cur)); };
  root.addEventListener('scroll', spy, { passive: true });
  // ---- classic dialog: Customize ----
  let ov = null;
  const closeOv = () => { ov?.remove(); ov = null; };
  const popSel = (opts, v) => h('select', {}, ...opts.map((o) => h('option', { value: o, selected: o === v }, o)));
  const chk = (label, on) => { const b = h('b', {}, on ? '✕' : ''); const sp = h('span', { onclick: () => { on = !on; b.textContent = on ? '✕' : ''; sp.on = on; } }, b, label); sp.on = on; return sp; };
  const customize = (r) => { closeOv(); const sysDisk = `${r.t} HD`;
    const mSel = popSel(MACH[r.bez], MACH[r.bez][r.bez === 'compact' ? 2 : 0]); const ram = popSel(r.bez === 'compact' ? ['512 K', '1 MB', '4 MB'] : r.bez === 'next' ? ['8 MB', '16 MB', '32 MB'] : ['8 MB', '32 MB', '128 MB', '256 MB'], r.bez === 'compact' ? '4 MB' : r.bez === 'next' ? '16 MB' : '32 MB');
    const scr = popSel(['Default', '512×342', '640×480', '800×600', '1024×768'], 'Default'); const disks = [chk(sysDisk, true), chk('Infinite HD', true), chk('Saved HD', false)];
    const dlg = h('div.im-dlg', { onclick: (e) => e.stopPropagation() }, h('div.im-tb', {}, h('i', { onclick: closeOv }), h('span', {}, `Customize ${r.t}`)),
      h('div.bd', {}, h('label', {}, 'Machine:'), mSel, h('label', {}, 'RAM:'), ram, h('label', { style: { alignSelf: 'start' } }, 'Disks:'), h('div.ck', {}, ...disks), h('label', {}, 'Screen:'), scr,
        h('div.ft', {}, h('button.im-b', { onclick: closeOv }, 'Cancel'), h('button.im-b.def', { onclick: () => { const cfg = { ram: ram.value, disks: disks.filter((d) => d.on).map((d) => d.textContent), screen: scr.value }; closeOv(); boot(r, mSel.value, cfg); } }, 'Run'))));
    const tb = dlg.firstChild; let ox = 0, oy = 0; drag(tb, { start: (e) => { if (e.target.tagName === 'I') return false; ox = e.clientX - (parseFloat(dlg.style.left) || 0); oy = e.clientY - (parseFloat(dlg.style.top) || 0); }, move: (e) => { dlg.style.position = 'relative'; dlg.style.left = e.clientX - ox + 'px'; dlg.style.top = e.clientY - oy + 'px'; } });
    ov = h('div.im-ov', { onclick: closeOv }, dlg); document.body.append(ov); requestAnimationFrame(() => ov?.classList.add('dim')); ov.dlg = dlg; ov.mSel = mSel; return dlg; };
  // ---- fake emulator boot ----
  let emu = null; const exitEmu = () => { emu?.remove(); emu = null; };
  const happyMac = () => { const c = h('canvas', { width: 16, height: 20, style: { width: '64px', height: '80px', imageRendering: 'pixelated' } }); const g = c.getContext('2d'); const M = ['  ############  ', ' #............# ', ' #.##########.# ', ' #.#........#.# ', ' #.#..#..#..#.# ', ' #.#........#.# ', ' #.#....#...#.# ', ' #.#...##...#.# ', ' #.#........#.# ', ' #.#.#....#.#.# ', ' #.#..####..#.# ', ' #.##########.# ', ' #............# ', ' #............# ', ' #.....####...# ', ' #............# ', ' ############## ', ' #............# ', ' ############## ', '                '];
    M.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === ' ') return; g.fillStyle = ch === '#' ? '#000' : '#fff'; g.fillRect(x, y, 1, 1); })); return c; };
  const boot = async (r, mach, cfg = {}) => { exitEmu(); const color = r.bez !== 'compact'; const big = r.bez === 'osx' || r.bez === 'next' || (cfg.screen && cfg.screen !== 'Default' && cfg.screen !== '512×342');
    const [w, hh] = r.bez === 'compact' && !big ? [512, 342] : cfg.screen && /×/.test(cfg.screen) && cfg.screen !== '512×342' ? cfg.screen.split('×').map(Number) : [640, 480];
    const scale = Math.min(1.25, (root.clientWidth - 160) / (w + 68), (root.clientHeight - 140) / (hh + 88));
    const screen = h('div.im-screen', { style: { width: w + 'px', height: hh + 'px' } });
    const mon = h(`div.im-mon.im-card.${r.bez}`, { style: { width: 'auto', height: 'auto', transform: `scale(${scale})`, transformOrigin: 'center' } }, screen, r.bez === 'next' ? h('div.im-next-logo', { style: { left: '34px', bottom: '18px' } }, 'NeXT') : h('div.im-badge', { style: { left: '34px', bottom: '16px' } }, apple(18, r.bez === 'osx' ? '#9aa3ad' : null)));
    const status = h('span', {}, 'Starting up…');
    emu = h('div.im-emu', {}, h('div.im-ctl', {}, h('button.im-b', { onclick: exitEmu }, 'Done'), h('span', {}, `${mach} · ${r.t}${cfg.ram ? ' · ' + cfg.ram : ''}`), h('span', { style: { opacity: .55 } }, '|'), status), mon);
    document.body.append(emu); const my = emu;
    const desk = r.bez === 'osx' ? 'linear-gradient(160deg,#3d8ee0,#1d4fa8 60%,#14306e)' : r.bez === 'next' ? '#4d4d4d' : color ? (r.y >= 1997 ? '#6670a6' : 'repeating-conic-gradient(#6b6bb8 0 25%,#7878c4 0 50%) 0 0/4px 4px') : 'repeating-conic-gradient(#000 0 25%,#fff 0 50%) 0 0/2px 2px';
    screen.style.background = r.bez === 'next' ? '#000' : '#808080';
    screen.append(h('div.im-boot', {}, r.bez === 'next' ? h('div', { style: { color: '#ccc', font: `400 18px ${ROB}`, letterSpacing: '.2em' } }, 'NeXT') : happyMac()));
    await sleep(900); if (emu !== my) return;
    screen.replaceChildren(h('div.im-boot', { style: { background: desk } }, h('div.im-fw', { style: { position: 'relative', padding: '18px 34px', font: `400 ${color ? 16 : 14}px ${CHI}` } }, r.bez === 'osx' ? 'Welcome to Mac OS X' : r.bez === 'next' ? 'NeXTSTEP — Loading Workspace…' : r.y >= 1997 ? 'Mac OS — Starting Up…' : 'Welcome to Macintosh.')));
    status.textContent = 'Loading extensions…'; await sleep(1000); if (emu !== my) return;
    status.textContent = 'Running'; screen.replaceChildren(); screen.style.background = '';
    const dk = h('div.im-dk', { style: { background: desk, inset: r.bez === 'next' || r.bez === 'osx' ? '0' : '21px 0 0 0' } });
    if (r.bez !== 'next') screen.append(h('div.im-mb', { style: r.bez === 'osx' ? { background: '#f4f4f4e8', borderBottom: '0', fontWeight: 400 } : color && r.y >= 1997 ? { background: 'linear-gradient(#f2f2f2,#d6d6d6)' } : {} }, apple(13, color ? null : '#000'), ...(r.bez === 'osx' ? ['Finder', 'File', 'Edit', 'View', 'Go', 'Window', 'Help'] : ['File', 'Edit', 'View', 'Special']).map((m) => h('span', { style: { fontWeight: r.bez === 'osx' && m === 'Finder' ? 700 : '' } }, m)), h('span', { style: { marginLeft: 'auto', fontWeight: 400 } }, new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))));
    screen.append(dk);
    const disks = cfg.disks?.length ? cfg.disks : [`${r.t} HD`, 'Infinite HD'];
    const icon = (lbl, x, y, glyph, open) => { const el = h('div.im-ic', { style: { left: x + 'px', top: y + 'px', color: r.bez === 'osx' || r.bez === 'next' ? '#fff' : '#000' }, onclick: () => { dk.querySelectorAll('.im-ic').forEach((e) => e.classList.remove('on')); el.classList.add('on'); }, ondblclick: open }, glyph, h('span', {}, lbl)); dk.append(el); return el; };
    const diskG = () => s('svg', { width: 34, height: 26, viewBox: '0 0 34 26' }, s('rect', { x: 1, y: 3, width: 32, height: 20, fill: '#fff', stroke: '#000', 'stroke-width': 1.5 }), s('rect', { x: 5, y: 15, width: 6, height: 3, fill: '#000' }), s('line', { x1: 1, y1: 11, x2: 33, y2: 11, stroke: '#000' }));
    const trashG = () => s('svg', { width: 26, height: 32, viewBox: '0 0 26 32' }, s('path', { d: 'M3 7h20l-2 24H5Z', fill: '#fff', stroke: '#000', 'stroke-width': 1.4 }), s('rect', { x: 1, y: 3, width: 24, height: 4, fill: '#fff', stroke: '#000', 'stroke-width': 1.4 }), ...[8, 13, 18].map((x) => s('line', { x1: x, y1: 10, x2: x, y2: 28, stroke: '#000' })));
    const appG = (k) => s('svg', { width: 30, height: 30, viewBox: '0 0 30 30' }, s('rect', { x: 3, y: 3, width: 24, height: 24, rx: k % 2 ? 12 : 3, fill: color ? ['#ffd966', '#9fc5f8', '#b6d7a8', '#f4b6c2', '#d9c3f0'][k % 5] : '#fff', stroke: '#000', 'stroke-width': 1.4 }), s('path', { d: ['M9 20l6-10 6 10Z', 'M8 9h14M8 15h14M8 21h9', 'M15 7v16M7 15h16', 'M9 9l12 12M21 9 9 21', 'M10 20c0-6 10-6 10-10'][k % 5], stroke: '#000', 'stroke-width': 1.6, fill: 'none' }));
    const W0 = screen.clientWidth;
    const openWin = (title, items) => { const fw = h('div.im-fw', { style: { left: 40 + Math.random() * 40 + 'px', top: 30 + Math.random() * 30 + 'px', width: Math.min(360, W0 - 140) + 'px' } }, h('div.im-tb', {}, h('i', { onclick: () => fw.remove() }), h('span', {}, title)), h('div.st', {}, h('span', {}, `${items.length} items`), h('span', {}, '1.2 MB available')), h('div.gr', {}, ...items.map((t, k) => h('div.im-ic', { style: { position: 'static', width: 'auto' } }, appG(k), h('span', {}, t)))));
      const tb = fw.firstChild; let ox, oy; drag(tb, { start: (e) => { ox = e.clientX / scale - fw.offsetLeft; oy = e.clientY / scale - fw.offsetTop; }, move: (e) => { fw.style.left = e.clientX / scale - ox + 'px'; fw.style.top = e.clientY / scale - oy + 'px'; } }); dk.append(fw); return fw; };
    const SW = { compact: ['MacPaint', 'MacWrite', 'Alarm Clock', 'Puzzle', 'Note Pad', 'Calculator', 'Scrapbook', 'Games'], platinum: ['SimpleText', 'HyperCard', 'Kid Pix', 'Marathon', 'Photoshop', 'Lemmings', 'Netscape', 'Utilities'], next: ['Edit', 'Mail', 'Preview', 'Terminal', 'Doom', 'Mathematica', 'Lotus Improv', 'Chess'], osx: ['Safari', 'iTunes', 'TextEdit', 'Terminal', 'Chess', 'Preview', 'Mail', 'Utilities'] }[r.bez];
    disks.forEach((d, k) => icon(d.replace(/ HD$/, ' HD'), W0 - 92, 12 + k * 66, diskG(), () => openWin(d, d === 'Infinite HD' ? SW : ['System Folder', 'Applications', 'Documents', 'Read Me'])));
    if (r.bez !== 'next' && r.bez !== 'osx') icon('Trash', W0 - 92, hh - 21 - 70, trashG(), () => openWin('Trash', []));
    if (r.bez === 'next') { dk.append(h('div', { style: { position: 'absolute', right: '0', top: '0', width: '64px', display: 'flex', flexDirection: 'column' } }, ...['NeXT', 'Edit', 'Mail', 'Term', 'Prefs', 'Recycler'].map((t, k) => h('div', { style: { height: '64px', background: 'linear-gradient(135deg,#9a9a9a,#5e5e5e)', border: '1px solid #222', display: 'grid', placeItems: 'center', font: `400 11px ${ROB}`, color: k ? '#fff' : '#000' } }, t)))); }
    if (r.bez === 'osx') dk.append(h('div', { style: { position: 'absolute', left: '50%', bottom: '4px', transform: 'translateX(-50%)', display: 'flex', gap: '6px', padding: '6px 10px', background: '#ffffff40', border: '1px solid #ffffff70', borderRadius: '6px' } }, ...[0, 1, 2, 3, 4, 0].map((k) => appG(k))));
    const win = openWin(disks[1] || disks[0], SW); emu.screen = screen; emu.win = win; return emu; };
  root.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeOv(); exitEmu(); } });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeOv(); exitEmu(); } });
  draw();
  window.__demoProof = async () => { const out = [];
    pop.click(); await sleep(150); out.push(`popup open=${pmenu.classList.contains('on')}`); [...pmenu.children][0].click(); await sleep(100); out.push(`All → ${list.querySelectorAll('.im-card').length} cards`);
    st.filter = 'next'; draw(); out.push(`NeXT → ${list.querySelectorAll('.im-card').length} cards`); st.filter = 'notable'; draw(); out.push(`Notable → ${list.querySelectorAll('.im-card').length} cards / ${years.length} years`);
    rail.children[Math.min(6, years.length - 1)].click(); await sleep(700); spy(); out.push(`year rail → scrollTop ${Math.round(root.scrollTop)}, active ${rail.querySelector('.on')?.textContent}`);
    const dlg = customize(D[16]); await sleep(150); out.push(`Customize dialog: ${dlg.querySelector('.im-tb span').textContent}, machines ${ov.mSel.options.length}`); ov.mSel.value = 'Macintosh Quadra 650'; dlg.querySelector('.im-b.def').click();
    await sleep(2200); out.push(`Run → emulator running=${!!emu?.screen} on "${emu?.querySelector('.im-ctl span')?.textContent}" with ${emu?.querySelectorAll('.im-ic').length} icons`);
    exitEmu(); root.scrollTo({ top: 0 }); await sleep(200); st.sel = null; draw();
    return out.join('; ') + '; restored Notable list at top'; };
};

V['weatherstar-4000-retro-broadcast-auto-slide-forecast-player'] = (root, T) => {
  import('@fontsource/vt323');
  theme(root, T, { bg: '#ffffff', fg: '#111', ac: '#21285a', dark: false });
  const PX = "'VT323','Courier New',monospace";
  const st = document.createElement('style'); st.textContent = `
.ws{position:absolute;inset:0;background:#fff;color:#000;overflow:auto;font-family:${PX}}
.ws-loc{display:flex;gap:6px;align-items:center;padding:6px 8px}
.ws-loc input{width:476px;height:28px;font:22px/1 ${PX};padding:0 4px;border:1px solid #767676;border-radius:2px}
.ws-loc button{height:26px;font:20px/1 ${PX};padding:0 6px;background:#efefef;border:1px solid #767676;border-radius:3px;cursor:pointer}
.ws-loc button:active{background:#ddd}
.ws-stage{position:relative;width:640px;transform-origin:0 0}
.ws.theater .ws-stage{position:fixed;left:50%;top:calc(50% + 19px);z-index:50;transform:translate(-50%,-50%) scale(var(--k,1.4));box-shadow:0 0 0 100vmax #000}
.ws-fr{position:relative;width:640px;height:480px;overflow:hidden;background:linear-gradient(180deg,#1d1250 0,#1d1250 30px,#35287e 90px,#5a3278 150px,#9a4c48 250px,#c4651c 340px,#ca6c16 400px);image-rendering:pixelated}
.ws-hd{position:absolute;left:0;right:0;top:30px;height:60px;background:linear-gradient(90deg,#b4581c 0%,#9c4a34 40%,#4a2470 80%,#2a165c 100%)}
.ws-hd:after{content:'';position:absolute;left:0;right:0;bottom:0;height:2px;background:#ffffff22}
.ws-logo{position:absolute;left:50px;top:31px;width:82px;height:62px;border-radius:7px;background:linear-gradient(#2f6bff,#1440d0);border:3px solid #fff;box-shadow:2px 2px 0 #0008;color:#fff;text-align:center;font:700 18px/0.86 'Arial Narrow',Arial,sans-serif;padding-top:5px;letter-spacing:-.02em;text-shadow:1px 1px 0 #0006;z-index:3}
.ws-ttl{position:absolute;left:168px;top:28px;font:42px/0.82 ${PX};color:#ffff00;text-shadow:3px 3px 0 #000;z-index:3;white-space:pre}
.ws-noaa{position:absolute;left:350px;top:36px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 50% 70%,#fff 0 30%,#1d64c8 31%);box-shadow:inset 0 0 0 2px #fff,2px 2px 0 #0008;z-index:3}
.ws-noaa:after{content:'NOAA';position:absolute;left:0;right:0;top:3px;text-align:center;font:9px/1 ${PX};color:#fff}
.ws-clk{position:absolute;right:42px;top:42px;text-align:left;font:31px/0.85 ${PX};color:#fff;text-shadow:3px 3px 0 #000;letter-spacing:.12em;z-index:3}
.ws-pn{position:absolute;left:52px;top:90px;width:536px;height:310px;background:#1d2f7c;box-shadow:inset 0 0 0 3px #2f4cae,inset 4px 4px 0 3px #3a5bc6,inset -4px -4px 0 3px #172463}
.ws-sl{position:absolute;inset:0;color:#fff;font:34px/1 ${PX};text-shadow:3px 3px 0 #000}
.ws-sl .y{color:#ffff00}
.ws-cr{position:absolute;left:0;right:0;top:400px;height:80px;background:#253079;border-top:2px solid #6a78c8;overflow:hidden}
.ws-cr .ln{position:absolute;left:52px;top:22px;font:36px/1 ${PX};color:#fff;text-shadow:3px 3px 0 #000;white-space:nowrap}
.ws-cr .ln.scroll{left:0;animation:wscr var(--dur,14s) linear forwards}
@keyframes wscr{from{transform:translateX(640px)}to{transform:translateX(-100%)}}
.ws-pl{height:40px;background:#000;display:flex;align-items:center;padding:0 6px;gap:4px}
.ws-pl button{all:unset;cursor:pointer;width:38px;height:36px;display:grid;place-items:center;border-radius:4px}
.ws-pl button:hover{background:#ffffff1f}.ws-pl svg{width:26px;height:26px;fill:#fff}
.ws-pl .sp{flex:1}
.ws-box{width:452px;margin:22px 0 8px 6px;background:linear-gradient(#5a2f6e,#c06a1c);padding:6px}
.ws-box div{background:#1d2a6c;border:3px solid #2f4cae;color:#fff;text-align:center;font:20px/1.25 ${PX};padding:10px 8px}
.ws-box b{color:#ffff00;font-weight:400}
.ws-set{display:flex;gap:70px;padding:6px 8px 40px;font:18px/1.35 ${PX}}
.ws-set h4{margin:0 0 4px;font:700 18px/1 ${PX}}
.ws-set label{display:flex;gap:6px;align-items:center;cursor:pointer}
.ws-set select{font:16px ${PX}}
.ws-tbl{position:absolute;left:24px;right:24px;top:18px;font:30px/1.24 ${PX}}
.ws-tbl .r{display:grid;grid-template-columns:200px 70px 150px 1fr}
.ws-map{position:absolute;inset:6px}
.ws-fc{position:absolute;inset:10px 14px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center}
.ws-fc .d{display:flex;flex-direction:column;align-items:center;gap:4px;font:32px/1 ${PX}}
.ws-tick{position:absolute;right:8px;bottom:6px;font:14px ${PX};color:#ffffffaa;text-shadow:none}
.ws-load{position:absolute;inset:0;display:grid;place-items:center;font:40px ${PX};color:#fff;text-shadow:3px 3px 0 #000;background:#1d2f7c}
`; root.append(st);
  // ---------- data ----------
  const CITIES = {
    'Seattle, WA, USA': { st: 'Boeing Field', t: 54, c: 'Cloudy', w: 'E', ws: 5, hum: 77, dew: 46, ceil: 4600, vis: 10, pr: '29.84', reg: [['Seattle', 54, 'c', 115, 70], ['Spokane', 57, 'm', 430, 50], ['Yakima', 55, 'm', 300, 120], ['Olympia', 52, 'r', 90, 150], ['Tri-Cities', 57, 'm', 400, 190]], fc: [['SAT', 'Rain', 'r', 47, 58], ['SUN', 'Showers', 'r', 46, 56], ['MON', 'Partly Cloudy', 'pc', 44, 60]] },
    'Denver, CO, USA': { st: 'Denver Intl', t: 61, c: 'Sunny', w: 'SW', ws: 9, hum: 22, dew: 24, ceil: 12000, vis: 10, pr: '30.12', reg: [['Denver', 61, 's', 300, 110], ['Boulder', 59, 's', 230, 70], ['Ft Collins', 58, 's', 260, 30], ['Pueblo', 66, 's', 330, 210], ['Vail', 49, 'pc', 110, 120]], fc: [['SAT', 'Sunny', 's', 40, 68], ['SUN', 'Windy', 'pc', 38, 63], ['MON', 'Snow', 'sn', 27, 41]] },
    'Miami, FL, USA': { st: 'Miami Intl', t: 84, c: 'T-Storms', w: 'SE', ws: 12, hum: 81, dew: 75, ceil: 2800, vis: 6, pr: '29.91', reg: [['Miami', 84, 't', 330, 190], ['Naples', 82, 'pc', 160, 160], ['W Palm Bch', 83, 'pc', 360, 80], ['Key West', 85, 's', 200, 245], ['Orlando', 86, 't', 270, 10]], fc: [['SAT', 'T-Storms', 't', 77, 88], ['SUN', 'Showers', 'r', 78, 87], ['MON', 'Partly Cloudy', 'pc', 77, 89]] },
    'Chicago, IL, USA': { st: "O'Hare Intl", t: 48, c: 'Partly Cloudy', w: 'NW', ws: 14, hum: 58, dew: 34, ceil: 6500, vis: 10, pr: '30.02', reg: [['Chicago', 48, 'pc', 330, 80], ['Rockford', 45, 'c', 180, 40], ['Peoria', 50, 'pc', 200, 180], ['Gary', 49, 'pc', 400, 110], ['Champaign', 51, 's', 330, 230]], fc: [['SAT', 'Sunny', 's', 38, 55], ['SUN', 'Cloudy', 'c', 41, 57], ['MON', 'Rain', 'r', 45, 52]] },
  };
  let city = 'Seattle, WA, USA', metric = false;
  const D = () => CITIES[city];
  const tU = (f) => (metric ? Math.round(((f - 32) * 5) / 9) : f);
  const icon = (k, sz = 90) => { const S = sz; const cloud = (x, y, s, col = '#fff') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M10 40h52a14 14 0 0 0 0-28 18 18 0 0 0-34-4A13 13 0 0 0 10 40Z" fill="${col}" stroke="#8f9aa6" stroke-width="2.5"/><path d="M14 36h46" stroke="#c8d0d8" stroke-width="3"/></g>`;
    const sun = (x, y, r) => `<g transform="translate(${x} ${y})">${Array.from({ length: 8 }, (_, i) => `<rect x="-3" y="${-r - 12}" width="6" height="10" fill="#ffd400" transform="rotate(${i * 45})"/>`).join('')}<circle r="${r}" fill="#ffd400" stroke="#e08a00" stroke-width="3"/></g>`;
    const drops = (col = '#6fd0ff') => [20, 36, 52].map((x, i) => `<path d="M${x} ${52 + i * 3}l-5 12" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`).join('');
    const body = { c: cloud(4, 6, 1) + cloud(-4, 16, 0.85, '#e8ecf0'), s: sun(40, 34, 18), pc: sun(52, 22, 14) + cloud(0, 16, 0.9), m: `<path d="M48 8a26 26 0 1 0 20 36A22 22 0 0 1 48 8Z" fill="#ffe860" stroke="#c9a800" stroke-width="2.5"/>`, r: cloud(4, 0, 1, '#d6dde4') + drops(), t: cloud(4, 0, 1, '#b9c2cc') + `<path d="M38 42l-8 14h8l-6 14 16-20h-9l6-8Z" fill="#ffd400" stroke="#b07a00" stroke-width="1.5"/>`, sn: cloud(4, 0, 1) + [20, 38, 56].map((x) => `<text x="${x - 6}" y="66" font-size="16" fill="#fff">*</text>`).join('') }[k] || '';
    return `<svg width="${S}" height="${S * 0.8}" viewBox="0 0 80 72" style="filter:drop-shadow(2px 2px 0 #0007);overflow:visible">${body}</svg>`; };
  const SLIDES = [
    { id: 'cc', name: 'Current Conditions', ttl: 'Current\nConditions', html: () => { const d = D(); return `<div style="position:absolute;left:0;width:250px;top:14px;text-align:center"><div style="font-size:48px">${tU(d.t)}°</div><div style="font-size:38px;margin-top:4px">${d.c}</div><div style="margin:10px auto 0;width:110px">${icon(d.c === 'Sunny' ? 's' : d.c === 'T-Storms' ? 't' : d.c === 'Partly Cloudy' ? 'pc' : 'c', 110)}</div></div>
      <div style="position:absolute;left:20px;top:248px;width:200px;display:flex;justify-content:space-between;font-size:38px"><span>Wind:</span><span>${d.w} ${metric ? Math.round(d.ws * 1.6) : d.ws}</span></div>
      <div style="position:absolute;left:250px;right:18px;top:12px;font-size:36px;line-height:1.08"><div class="y" style="margin-left:-14px">${d.st}</div>${[['Humidity:', d.hum + '%'], ['Dewpoint:', tU(d.dew) + '°'], ['Ceiling:', (metric ? Math.round(d.ceil * 0.3048) + 'm' : d.ceil + 'ft.')], ['Visibility:', (metric ? Math.round(d.vis * 1.6) + ' km' : d.vis + ' mi.')], ['Pressure:', d.pr]].map(([a, b]) => `<div style="display:flex;justify-content:space-between"><span>${a}</span><span>${b}</span></div>`).join('')}</div>`; } },
    { id: 'obs', name: 'Latest Observations', ttl: 'Latest\nObservations', html: () => `<div class="ws-tbl"><div class="r y" style="font-size:26px"><span></span><span>${metric ? '°C' : '°F'}</span><span>WEATHER</span><span>WIND</span></div>${D().reg.concat([['Airport', D().t - 1, 'c']]).map(([n, t, k], i) => `<div class="r"><span>${n}</span><span>${tU(t)}</span><span>${{ c: 'Cloudy', m: 'Clear', r: 'Rain', s: 'Sunny', pc: 'P Cloudy', t: 'T-Storm', sn: 'Snow' }[k]}</span><span>${i % 6 === 4 ? 'Calm' : ['E', 'SE', 'S', 'NW', '', 'W'][i % 6] + ' ' + (3 + i * 2)}</span></div>`).join('')}</div>` },
    { id: 'hg', name: 'Hourly Graph', ttl: 'Hourly Graph', html: () => { const R = rng(city.length * 7); const n = 13, base = D().t; const ser = (b, amp) => Array.from({ length: n }, (_, i) => b + Math.sin(i / 2.2 + R() * 2) * amp + (R() - 0.5) * amp * 0.6); const temp = ser(base, 5), dew = ser(D().dew, 2), cloud = ser(base - 2, 6), pr = ser(base - 10, 1.2);
      const lo = Math.min(...temp, ...dew, ...pr) - 2, hi = Math.max(...temp, ...cloud) + 2; const X = (i) => 46 + (i * 470) / (n - 1), Y = (v) => 270 - ((v - lo) / (hi - lo)) * 236; const path = (a, c) => `<polyline points="${a.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}" fill="none" stroke="#000" stroke-width="7" stroke-linejoin="round"/><polyline points="${a.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}" fill="none" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`;
      return `<svg width="536" height="308" style="position:absolute;inset:0;font-family:${PX.replace(/"/g, '')}">${[0, 1, 2, 3].map((k) => `<line x1="46" x2="516" y1="${34 + k * 78.6}" y2="${34 + k * 78.6}" stroke="#ffffff33"/><text x="6" y="${40 + k * 78.6}" fill="#fff" font-size="22" style="paint-order:stroke" stroke="#000" stroke-width="3">${Math.round(tU(hi - ((hi - lo) * k) / 3))}°</text>`).join('')}${path(cloud, '#e8e8e8')}${path(dew, '#00c000')}${path(pr, '#00e5ff')}${path(temp, '#ff2020')}${['8P', '11P', '2A', '5A', '8A', '11A', '2P'].map((t, i) => `<text x="${40 + i * 78}" y="298" fill="#ffff00" font-size="20" stroke="#000" stroke-width="3" style="paint-order:stroke">${t}</text>`).join('')}</svg>`; } },
    { id: 'reg', name: 'Regional Observations', ttl: 'Regional\nObservations', html: () => `<svg class="ws-map" width="524" height="296" viewBox="0 0 524 296" style="position:absolute;inset:6px;background:#3d6cc4"><path d="M0 40 L40 30 L70 52 L60 90 L90 110 L80 150 L60 170 L70 210 L40 250 L0 260Z M120 0 L524 0 L524 296 L110 296 L130 240 L100 200 L120 160 L110 120 L140 80 L120 40Z" fill="#7d8f6a" stroke="#c8c0a0" stroke-width="2"/><path d="M200 0 L230 296 M360 0 L350 296 M120 150 L524 160" stroke="#c8c0a066" stroke-width="2" fill="none"/></svg>${D().reg.map(([n, t, k, x, y]) => `<div style="position:absolute;left:${x}px;top:${y}px;text-align:center;font-size:26px;line-height:.9"><div>${n}</div><div style="display:flex;align-items:center;gap:2px"><span class="y" style="font-size:38px">${tU(t)}</span><span style="display:inline-block;width:42px">${icon(k, 42)}</span></div></div>`).join('')}` },
    { id: 'ext', name: 'Extended Forecast', ttl: 'Extended\nForecast', html: () => `<div class="ws-fc">${D().fc.map(([d, c, k, lo, hi]) => `<div class="d"><div class="y" style="font-size:40px">${d}</div><div style="height:96px;display:grid;place-items:center">${icon(k, 104)}</div><div style="font-size:30px;height:60px;line-height:.95">${c}</div><div style="display:flex;gap:22px;font-size:28px"><div><div style="color:#8ab4ff">Lo</div><div style="font-size:40px">${tU(lo)}</div></div><div><div class="y">Hi</div><div style="font-size:40px">${tU(hi)}</div></div></div></div>`).join('')}</div>` },
    { id: 'alm', name: 'Almanac', ttl: 'Almanac', html: () => `<div style="position:absolute;left:30px;right:30px;top:20px;font-size:32px;line-height:1.15"><div style="display:grid;grid-template-columns:150px 1fr 1fr"><span></span><span class="y">Saturday</span><span class="y">Sunday</span><span>Sunrise:</span><span>7:18 am</span><span>7:19 am</span><span>Sunset:</span><span>6:31 pm</span><span>6:29 pm</span></div><div class="y" style="margin-top:22px">Moon Data:</div><div style="display:flex;justify-content:space-between;margin-top:8px;text-align:center">${[['New', 'Oct 10', 0], ['First', 'Oct 18', 0.5], ['Full', 'Oct 25', 1], ['Last', 'Nov 1', 0.5]].map(([p, d, f], i) => `<div><div>${p}</div><svg width="56" height="56" viewBox="0 0 56 56" style="margin:4px 0;filter:drop-shadow(2px 2px 0 #000)"><circle cx="28" cy="28" r="24" fill="#3a3a3a"/>${f === 1 ? '<circle cx="28" cy="28" r="24" fill="#f4f0c8"/>' : f ? `<path d="M28 4a24 24 0 0 ${i === 1 ? 1 : 0} 0 48Z" fill="#f4f0c8"/>` : ''}</svg><div style="font-size:26px">${d}</div></div>`).join('')}</div></div>` },
  ];
  const crawlLines = () => { const d = D(); return [`Conditions at ${d.st}`, `Temp: ${tU(d.t)}°${metric ? 'C' : 'F'}`, `Humidity: ${d.hum}%   Dewpoint: ${tU(d.dew)}°`, `Wind: ${d.w} ${d.ws} ${metric ? 'KM/H' : 'MPH'}`, `Visib: ${d.vis} mi.  Ceiling: ${d.ceil} ft.`]; };
  // ---------- DOM ----------
  const wrap = h('div.ws'); root.append(wrap);
  const inp = h('input', { value: city, list: 'ws-cities', spellcheck: 'false' });
  const dl = h('datalist', { id: 'ws-cities' }, Object.keys(CITIES).map((c) => h('option', { value: c })));
  wrap.append(h('div.ws-loc', {}, inp, dl, h('button', { title: 'Use my location', html: '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5" fill="none" stroke="#000" stroke-width="2"/><circle cx="8" cy="8" r="2" fill="#000"/><path d="M8 0v3M8 13v3M0 8h3M13 8h3" stroke="#000" stroke-width="2"/></svg>', onclick: () => { inp.value = 'Seattle, WA, USA'; go(); } }), h('button', { onclick: () => go() }, 'GO'), h('button', { onclick: () => { inp.value = 'Seattle, WA, USA'; go(); } }, 'Reset')));
  const stage = h('div.ws-stage'); wrap.append(stage);
  const fr = h('div.ws-fr'); stage.append(fr);
  const ttl = h('div.ws-ttl'), clk = h('div.ws-clk'), pn = h('div.ws-pn'), cr = h('div.ws-cr');
  fr.append(h('div.ws-hd'), h('div.ws-logo', { html: 'WEATHER<br>STAR<br>4000+' }), ttl, h('div.ws-noaa'), clk, pn, cr);
  const ico = { menu: '<svg viewBox="0 0 24 24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>', prev: '<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>', next: '<svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6zM16 6h2v12h-2z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>', play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>', ref: '<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg>',
    muted: '<svg viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.2l2.45 2.45c.03-.2.05-.41.05-.65zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9zM12 4 9.91 6.09 12 8.18z"/></svg>', vol: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
    full: '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z"/></svg>', scan: '<svg viewBox="0 0 24 24"><path d="M3 4h18v16H3zM5 6v12h14V6zM6 8l12 9" stroke="#fff" stroke-width="1.6" fill="none"/></svg>' };
  const bPlay = h('button', { title: 'Pause', html: ico.pause, onclick: () => setPlaying(!playing) }), bMute = h('button', { title: 'Unmute', html: ico.muted, onclick: () => toggleMute() });
  stage.append(h('div.ws-pl', {}, h('button', { title: 'Menu', html: ico.menu, onclick: () => setBox.scrollIntoView({ behavior: 'smooth' }) }), h('button', { title: 'Previous', html: ico.prev, onclick: () => step(-1) }), h('button', { title: 'Next', html: ico.next, onclick: () => step(1) }), bPlay,
    h('span', { style: { width: '50px' } }), h('button', { title: 'Refresh', html: ico.ref, onclick: () => go(true) }), h('span.sp'), bMute, h('button', { title: 'Scanlines', html: ico.scan, onclick: () => { fr.classList.toggle('scan'); fr.style.backgroundImage = fr.classList.contains('scan') ? 'repeating-linear-gradient(#0000 0 2px,#0003 2px 3px),' + getComputedStyle(fr).backgroundImage : ''; } }),
    h('button', { title: 'Fullscreen', html: ico.full, onclick: () => { wrap.classList.toggle('theater'); const k = Math.min((root.clientWidth - 40) / 640, (root.clientHeight - 40) / 520); stage.style.setProperty('--k', k.toFixed(2)); } })));
  const status = h('div', {}); wrap.append(h('div.ws-box', {}, status));
  const checks = {}; const SPEEDS = { Slow: 15000, Normal: 10000, Fast: 6000, 'Very Fast': 3500 };
  const speedSel = h('select', { onchange: () => { dur = SPEEDS[speedSel.value]; restartTimer(); } }, Object.keys(SPEEDS).map((k) => h('option', { value: k, selected: k === 'Normal' }, k)));
  const unitSel = h('select', { onchange: () => { metric = unitSel.value === 'Metric'; show(idx, true); } }, h('option', {}, 'US'), h('option', {}, 'Metric'));
  const setBox = h('div.ws-set', {}, h('div', {}, h('h4', {}, 'Selected displays'), SLIDES.map((s0) => { const c = h('input', { type: 'checkbox', checked: true, onchange: () => { if (!enabled().length) { c.checked = true; toast('At least one display must stay on'); } } }); checks[s0.id] = c; return h('label', {}, c, s0.name); })),
    h('div', {}, h('h4', {}, 'Settings'), h('label', {}, 'Speed ', speedSel), h('label', {}, 'Units ', unitSel), h('label', {}, h('input', { type: 'checkbox', checked: true, onchange: (e) => { crawlOn = e.target.checked; cr.style.visibility = crawlOn ? '' : 'hidden'; } }), 'Show crawl'),
      h('div', { style: { marginTop: '10px', fontSize: '16px', color: '#555', maxWidth: '340px' } }, 'Keyboard: ←/→ previous/next slide, space play/pause.')));
  wrap.append(setBox);
  // ---------- engine ----------
  let idx = 0, playing = true, dur = SPEEDS.Normal, timer = null, slideStart = performance.now(), crawlOn = true, crawlI = 0, crawlTimer = null, crawlCycles = 0, muted = true, musicT = null;
  const enabled = () => SLIDES.map((s0, i) => i).filter((i) => checks[SLIDES[i].id].checked);
  const show = (i, keep) => { idx = i; const s0 = SLIDES[i]; ttl.textContent = s0.ttl; ttl.style.top = s0.ttl.includes('\n') ? '24px' : '42px'; pn.replaceChildren(h('div.ws-sl', { html: s0.html() })); slideStart = performance.now(); if (!keep) blip(220, 0.03, 'square', 0.01); updStatus(); };
  const step = (d) => { const en = enabled(); const p = en.indexOf(idx); const ni = en[((p < 0 ? (d > 0 ? -1 : 0) : p) + d + en.length) % en.length]; show(ni); restartTimer(); };
  const restartTimer = () => { clearTimeout(timer); if (playing) timer = setTimeout(() => { if (!document.body.contains(wrap)) return; step(1); }, dur); updStatus(); };
  const setPlaying = (p) => { playing = p; bPlay.innerHTML = p ? ico.pause : ico.play; bPlay.title = p ? 'Pause' : 'Play'; restartTimer(); };
  const updStatus = () => status.replaceChildren(h('b', {}, `Now showing: ${SLIDES[idx].name}`), h('br'), playing ? `Auto-advance every ${dur / 1000}s · ${enabled().length} displays in rotation` : 'Paused — press ▶ to resume the broadcast', h('br'), `${city}`);
  const crawlNext = () => { if (!document.body.contains(wrap)) return; const L = crawlLines(); crawlCycles++;
    if (crawlCycles % 6 === 0) { const msg = `*** ${D().st}: ${D().c.toUpperCase()} — Winds ${D().w} at ${D().ws} MPH — Visibility ${D().vis} miles — Stay tuned for your local forecast ***`; const el = h('div.ln.scroll', {}, msg); el.style.setProperty('--dur', msg.length * 0.16 + 's'); cr.replaceChildren(el); crawlTimer = setTimeout(crawlNext, msg.length * 160 + 300); return; }
    cr.replaceChildren(h('div.ln', {}, L[crawlI % L.length])); crawlI++; crawlTimer = setTimeout(crawlNext, 3500); };
  const tickClock = () => { if (!document.body.contains(wrap)) return; const d = new Date(); const t = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' }).replace(/\s/g, ' '); const dd = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase().replace(',', ''); clk.innerHTML = `${t.padStart(11, '\u00a0')}<br>${dd}`; setTimeout(tickClock, 1000); };
  const go = async (refresh) => { const v = inp.value.trim(); const k = Object.keys(CITIES).find((c) => c.toLowerCase().startsWith(v.toLowerCase().split(',')[0])) || (refresh ? city : null); if (!k) { toast('Location not found — try Seattle, Denver, Miami or Chicago'); return; }
    city = k; inp.value = k; pn.replaceChildren(h('div.ws-load', {}, refresh ? 'Refreshing data...' : 'Loading forecast...')); clearTimeout(timer); await sleep(700); crawlI = 0; show(enabled()[0]); restartTimer(); };
  const toggleMute = () => { muted = !muted; bMute.innerHTML = muted ? ico.muted : ico.vol; clearTimeout(musicT); if (!muted) { const notes = [57, 61, 64, 69, 66, 64, 61, 59]; let n = 0; const loop = () => { if (muted || !document.body.contains(wrap)) return; blip(midi(notes[n % notes.length]), 0.5, 'triangle', 0.035); if (n % 4 === 0) blip(midi(notes[n % notes.length] - 24), 1.2, 'sine', 0.04); n++; musicT = setTimeout(loop, 420); }; loop(); } };
  const onKey = (e) => { if (!document.body.contains(wrap)) return window.removeEventListener('keydown', onKey); if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') { if (e.key === 'Enter' && e.target === inp) go(); return; } if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === ' ') { e.preventDefault(); setPlaying(!playing); } };
  window.addEventListener('keydown', onKey);
  tickClock(); show(0, true); crawlNext(); restartTimer();
  window.__demoProof = async () => { const out = []; const name = () => SLIDES[idx].name;
    out.push(`start: ${name()} (auto every ${dur / 1000}s)`);
    const saved = dur; dur = 700; restartTimer(); const a = idx; await sleep(1000); out.push(`auto-advance ${SLIDES[a].name} → ${name()}`);
    stage.querySelector('[title="Next"]').click(); out.push(`next → ${name()}`); stage.querySelector('[title="Previous"]').click(); out.push(`prev → ${name()}`);
    bPlay.click(); const held = idx; await sleep(1000); out.push(`paused: held=${held === idx}`); bPlay.click();
    checks.hg.checked = false; show(1); restartTimer(); stage.querySelector('[title="Next"]').click(); out.push(`Hourly Graph unchecked → next skips to ${name()}`); checks.hg.checked = true;
    const l0 = cr.textContent; clearTimeout(crawlTimer); crawlNext(); out.push(`crawl "${l0}" → "${cr.textContent.slice(0, 40)}"`);
    unitSel.value = 'Metric'; unitSel.onchange?.(); unitSel.dispatchEvent(new Event('change')); show(0, true); out.push(`metric temp: ${pn.textContent.match(/-?\d+°/)?.[0]}`); unitSel.value = 'US'; unitSel.dispatchEvent(new Event('change'));
    inp.value = 'Denver'; await go(); out.push(`GO Denver → ${D().st}`); inp.value = 'Seattle, WA, USA'; await go();
    dur = saved; speedSel.value = 'Normal'; setPlaying(true); show(0, true); restartTimer(); out.push('restored: Seattle, Current Conditions, Normal speed, playing'); return out.join('; '); };
};

V['cameronsworld-geocities-layered-collage-scroll-zones-gif-parallax-sound-toggle'] = (root, T) => {
  import('@fontsource/im-fell-english'); import('@fontsource/press-start-2p'); import('@fontsource/permanent-marker'); import('@fontsource/coming-soon'); import('@fontsource/pinyon-script');
  theme(root, T, { bg: '#000', fg: '#fff', ac: '#ffea00', dark: true });
  const FELL = "'IM Fell English',Georgia,serif", PX = "'Press Start 2P',monospace", MK = "'Permanent Marker',cursive", CS = "'Coming Soon','Comic Sans MS',cursive", PIN = "'Pinyon Script',cursive", TNR = "'Times New Roman',Times,serif";
  const heart = (c) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><path d='M14 22c-6-6-1-13 5-10 3 1 4 4 4 4s1-3 4-4c6-3 11 4 5 10l-9 9z' fill='${c}'/><path d='M42 50c-4-4-1-9 3-7 2 1 3 3 3 3s1-2 3-3c4-2 7 3 3 7l-6 6z' fill='${c}' opacity='.7'/></svg>`)}")`;
  const st = document.createElement('style'); st.textContent = `
.cw{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;background:#000;color:#fff;font-family:${TNR};scroll-behavior:auto}
.cw *{box-sizing:border-box}
.cw-z{position:relative;overflow:hidden}
.cw-sp{position:absolute;will-change:transform;user-select:none;line-height:1;pointer-events:auto}
.cw-sp>i{display:block;font-style:normal}
.cw-p0>i{filter:saturate(.8) brightness(.8)}.cw-p2>i{filter:drop-shadow(3px 4px 0 #0008)}
.cw-space{height:1180px;background-color:#000;background-image:radial-gradient(circle,#2b3d9c 0 3px,#14205a 5px,#0000 11px),radial-gradient(1.2px 1.2px at 12px 18px,#fff 50%,#0000),radial-gradient(1px 1px at 70px 40px,#ffd 50%,#0000),radial-gradient(1px 1px at 40px 90px,#aaf 50%,#0000),radial-gradient(1.4px 1.4px at 100px 110px,#fff 50%,#0000),radial-gradient(1px 1px at 25px 60px,#f9c 50%,#0000);background-size:96px 96px,120px 120px,120px 120px,120px 120px,120px 120px,64px 64px;background-position:48px 10px,0 0,0 0,0 0,0 0,0 0}
.cw-planet{border-radius:50%;position:relative}
.cw-ring{position:absolute;left:-38%;top:38%;width:176%;height:26%;border-radius:50%;border:5px solid #d9c9b0;box-shadow:0 0 0 3px #8a6f5a,inset 0 0 0 3px #f2e7d5;transform:rotate(-8deg)}
.cw-ring:after{content:'';position:absolute;inset:-9px 30% 40% 30%;background:inherit}
.cw-spine{position:relative;height:96px;display:grid;place-items:center;z-index:5}
.cw-spine svg{width:min(560px,80%);height:84px;filter:drop-shadow(0 0 2px #000)}
.cw-snd{position:absolute;top:10px;right:16px;z-index:40;width:34px;height:32px;border:0;padding:0;background:#c0c0c0;box-shadow:inset 1px 1px #fff,inset -1px -1px #404040,inset 2px 2px #dfdfdf,inset -2px -2px #808080;display:grid;place-items:center;cursor:pointer}
.cw-snd:active{box-shadow:inset 1px 1px #404040,inset -1px -1px #fff}
.cw-snd svg{width:24px;height:22px}
.cw-snd .lbl{position:absolute;right:40px;top:7px;white-space:nowrap;font:10px ${PX};color:#ff0;text-shadow:1px 1px #000;opacity:0;transition:opacity .3s;pointer-events:none}
.cw-snd:hover .lbl,.cw-snd.flash .lbl{opacity:1}
.cw-fan{height:1120px;background-color:#22063f;background-image:radial-gradient(ellipse at 30% 20%,#7b2fbf55,#0000 40%),repeating-radial-gradient(circle at 0 0,#3a0b62 0 7px,#26073f 7px 15px,#4a1478 15px 18px,#26073f 18px 26px);background-size:auto,70px 70px}
.cw-fan .rail{position:absolute;top:0;bottom:0;width:86px;font-size:62px;line-height:84px;text-align:center;filter:hue-rotate(285deg) saturate(.55) brightness(1.45);overflow:hidden;word-break:break-all;z-index:3}
.cw-fant{font:72px/1 ${FELL};letter-spacing:.02em;background:linear-gradient(180deg,#f6c8ff 0,#c03cff 38%,#6a0fa8 52%,#ff6cf0 70%,#fff 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:1.5px #fff;filter:drop-shadow(0 0 6px #e14bff) drop-shadow(3px 3px 0 #2a0040)}
.cw-glow{text-shadow:0 0 4px #fff,0 0 10px currentColor,0 0 18px currentColor}
.cw-out{-webkit-text-stroke:2px #fff;paint-order:stroke fill}
.cw-rb{background:linear-gradient(90deg,#f00,#f80,#ff0,#0f0,#0cf,#00f,#c0f,#f00);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:cwrb 3s linear infinite}
@keyframes cwrb{to{background-position:200% 0}}
.cw-love{height:980px;background-color:#b5001b;background-image:${heart('#ff3d6e')},radial-gradient(circle at 50% 50%,#d80d2f,#8f0016);background-size:56px 56px,auto}
.cw-azt{height:1260px;background:linear-gradient(180deg,#d9271c 0 300px,#ff5a00 300px,#ff8a00 470px,#ffc400 590px,#ffe14d 650px,#7fe3ff 651px,#36c8ff 700px,#1aa1f0 740px,#0b66d8 780px,#0749c2 1260px)}
.cw-band{position:absolute;left:0;right:0;height:40px}
.cw-oc{position:absolute;left:0;right:0;top:780px;bottom:0;background-image:radial-gradient(circle,#0000 0 3px,#bfe8ff99 3.5px 4.5px,#0000 5px),radial-gradient(circle,#0000 0 2px,#bfe8ff77 2.5px 3.2px,#0000 3.6px);background-size:46px 58px,31px 37px;background-position:0 0,13px 21px}
.cw-int{position:absolute;left:12px;top:800px;font:700 22px/1.32 ${TNR};color:#ffe600;text-shadow:2px 2px #003;width:20px;text-align:center}
.cw-fish{display:grid;grid-template-columns:repeat(8,1fr);gap:22px 10px;position:absolute;left:70px;right:40px;top:820px}
.cw-fish button{all:unset;cursor:pointer;text-align:center;font:12px ${TNR};color:#9fe7ff;text-shadow:1px 1px #003a8a}
.cw-fish button span{display:block;font-size:52px;line-height:1.15;transition:transform .2s}
.cw-fish button:hover span{transform:scale(1.25) rotate(-8deg)}
.cw-fish button:hover{color:#ff0}
.cw-home{height:900px;background:#fff;color:#000}
.cw-ft{background:#000;color:#fff;padding:90px 10% 60px;font-family:'Inter Variable',system-ui,sans-serif}
.cw-ft h2{font-weight:300;font-size:64px;line-height:1.05;margin:0 0 34px;letter-spacing:-.01em}
.cw-ft .cols{display:grid;grid-template-columns:1fr 1fr;gap:40px;max-width:900px;font-size:13px;line-height:1.6;color:#ccc}
.cw-ft .bot{margin-top:70px;display:flex;gap:26px;font-size:11px;color:#999;border-top:1px solid #333;padding-top:14px}
.cw-ft a{color:#ccc}
.cw-wa{font:900 96px/1 Impact,'Arial Black',sans-serif;transform:skewX(-8deg) perspective(400px) rotateX(12deg);background:linear-gradient(180deg,#ff0 0,#f90 25%,#f00 45%,#c0f 65%,#06f 85%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(4px 4px 0 #335) drop-shadow(2px 2px 0 #889)}
.cw-new{font:900 14px Impact,sans-serif;color:#ff0;background:#e00;padding:6px 8px;clip-path:polygon(50% 0,61% 30%,95% 20%,72% 48%,100% 70%,64% 70%,55% 100%,40% 72%,5% 85%,28% 52%,0 25%,38% 30%);animation:cwbl .7s steps(1) infinite}
@keyframes cwbl{50%{color:#fff;background:#00f}}
.cw-spin{animation:cwspin 6s linear infinite}@keyframes cwspin{to{transform:rotate(360deg)}}
.cw-bob{animation:cwbob 2.4s ease-in-out infinite}@keyframes cwbob{50%{transform:translateY(-12px)}}
.cw-tw{animation:cwtw 1.2s steps(2) infinite}@keyframes cwtw{50%{opacity:.25;transform:scale(.7)}}
.cw-fly{animation:cwfly 9s linear infinite}@keyframes cwfly{0%{transform:translateX(0)}50%{transform:translateX(160px) translateY(-20px)}100%{transform:translateX(0)}}
.cw-wob{animation:cwwob 1.6s ease-in-out infinite}@keyframes cwwob{50%{transform:rotate(10deg) scale(1.08)}}
.cw-marq{position:absolute;left:0;right:0;white-space:nowrap;overflow:hidden}
.cw-marq>div{display:inline-block;animation:cwmq 22s linear infinite;padding-left:100%}@keyframes cwmq{to{transform:translateX(-100%)}}
.cw-cnt{display:inline-flex;gap:1px;background:#000;padding:2px;border:2px inset #888}.cw-cnt b{background:#111;color:#0f0;font:16px ${PX};padding:4px 3px}
.cw-ring2{position:absolute;inset:0;border-radius:50%;border:3px dotted #7ff;box-shadow:0 0 12px #3ff}
@media (prefers-reduced-motion:reduce){.cw [class*="cw-spin"],.cw .cw-bob,.cw .cw-tw,.cw .cw-fly,.cw .cw-wob,.cw-marq>div,.cw-rb,.cw-new{animation:none}}
`; root.append(st);
  const R = rng(1997); const rr = (a, b) => a + R() * (b - a);
  const sc = h('div.cw'); root.append(sc);
  const sprites = []; const FACT = [0.38, 0.14, -0.22];
  // sprite helper: content (node|string emoji), zone, x% , y px, size px, plane 0..2, anim class
  const sp = (zone, x, y, content, { size = 40, plane = 1, anim = '', z = 0, title } = {}) => {
    const inner = typeof content === 'string' ? h('i', { style: { fontSize: size + 'px' } }, content) : h('i', {}, content);
    if (anim) inner.classList.add(anim);
    const el = h('div.cw-sp.cw-p' + plane, { style: { left: x + '%', top: y + 'px', zIndex: 2 + plane * 3 + z }, title }, inner);
    el.dataset.plane = plane; zone.append(el); sprites.push({ el, zone, plane }); return el;
  };
  const planet = (d, a, b, { ring = false, bands = false, glow } = {}) => { const p = h('div.cw-planet', { style: { width: d + 'px', height: d + 'px', background: `${bands ? `repeating-linear-gradient(${rr(-20, 20)}deg,#0000 0 ${d / 9}px,#ffffff22 ${d / 9}px ${d / 6}px),` : ''}radial-gradient(circle at 32% 30%,#fff8 0,${a} ${d * 0.22}px,${b} ${d * 0.55}px,#000 ${d * 0.78}px)`, boxShadow: `inset ${-d * 0.12}px ${-d * 0.1}px ${d * 0.18}px #0009${glow ? `,0 0 ${d / 3}px ${glow}` : ''}` } }); if (ring) p.append(h('div.cw-ring')); return p; };
  const txt = (cls, text, style = {}) => h('div' + cls, { style }, text);
  const star5 = (c = '#e8c870', s = 40) => h('div', { html: `<svg width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M20 2l5 13h14l-11 8 4 14-12-8-12 8 4-14L1 15h14z" fill="${c}" stroke="#fff8" stroke-width="1"/></svg>` });
  const sparkle = (c = '#fff', s = 60) => h('div', { html: `<svg width="${s}" height="${s}" viewBox="0 0 60 60"><path d="M30 0L33 27 60 30 33 33 30 60 27 33 0 30 27 27z" fill="${c}"/><path d="M30 12l2 16 16 2-16 2-2 16-2-16-16-2 16-2z" fill="#fff"/></svg>` });
  const spine = () => h('div.cw-spine', { html: `<svg viewBox="0 0 560 84"><g fill="none" stroke-width="2"><path d="M260 6h40M232 16h96M196 26h168" stroke="#aaa"/><path d="M196 58h168M232 68h96M260 78h40" stroke="#aaa"/><rect x="0" y="38" width="560" height="8" stroke="#bbb" fill="#111"/><path d="M60 42h440" stroke="#d58a2a" stroke-width="5"/><path d="M150 33h260M150 51h260" stroke="#c9a24a" stroke-width="3"/></g><g fill="#3fc6c6" stroke="#fff" stroke-width="1.2"><path d="M280 26l16 16-16 16-16-16z" fill="#c28a2c"/><path d="M280 32l10 10-10 10-10-10z"/><path d="M130 36l6 6-6 6-6-6zM430 36l6 6-6 6-6-6zM196 30l4 4-4 4-4-4zM364 30l4 4-4 4-4-4zM196 46l4 4-4 4-4-4zM364 46l4 4-4 4-4-4z"/></g></svg>` });
  // ---------- zone 1: outer space ----------
  const z1 = h('section.cw-z.cw-space', { 'data-zone': 'Outer space' });
  const PL = [['#ffb347', '#c0360c'], ['#e8e2d0', '#7d7466'], ['#9be7ff', '#2a6f9a'], ['#ffcf8a', '#b5532a'], ['#c9f0a0', '#3b7a2a'], ['#d6a5ff', '#5b2a9a'], ['#ff8a8a', '#8a1a1a'], ['#f0e0b0', '#9a7a3a'], ['#8ac4ff', '#1a3a9a']];
  [[5, 30, 64], [16, 40, 22], [11, 120, 50], [3, 150, 30], [72, 0, 72], [92, 20, 66], [88, 100, 96], [60, 52, 48], [36, 210, 74], [53, 222, 50], [5, 205, 64], [94, 345, 52], [84, 405, 58], [89, 435, 40], [33, 445, 40], [46, 455, 72], [3, 470, 66], [20, 520, 26], [62, 530, 54], [79, 600, 46], [12, 700, 90], [50, 760, 60], [70, 820, 78], [25, 880, 44], [90, 900, 64], [40, 980, 36], [8, 1010, 56], [58, 1050, 50]].forEach(([x, y, d], i) => { const [a, b] = PL[i % PL.length]; sp(z1, x, y, planet(d, a, b, { bands: i % 3 === 0, glow: i % 7 === 0 ? '#ff9a3c88' : null }), { plane: d > 60 ? 2 : d > 40 ? 1 : 0 }); });
  sp(z1, 43, 72, planet(130, '#f6e7c8', '#9a7b52', { ring: true, bands: true }), { plane: 1, title: 'Saturn' });
  sp(z1, 32, 470, planet(160, '#fff3a0', '#ff5a00', { glow: '#ff7a0088' }), { plane: 2, anim: 'cw-wob' });
  sp(z1, 47, 455, planet(110, '#9bd0ff', '#1d4fbf', {}), { plane: 2 });
  sp(z1, 41, 400, planet(48, '#fff59a', '#ffb300', { glow: '#ffd000' }), { plane: 1, anim: 'cw-tw' });
  const em = [['🛸', 63, 240, 34, 1, 'cw-fly'], ['🛸', 71, 270, 46, 2, 'cw-bob'], ['🛸', 30, 360, 32, 1, 'cw-bob'], ['🛸', 67, 375, 40, 1, 'cw-fly'], ['🚀', 72, 60, 64, 2, 'cw-bob'], ['👽', 3, 580, 40, 1, 'cw-wob'], ['🌙', 17, 220, 46, 1, ''], ['☄️', 58, 500, 46, 2, 'cw-fly'], ['🌠', 83, 380, 34, 0, 'cw-tw'], ['🌌', 80, 200, 110, 0, ''], ['⭐', 96, 205, 18, 0, 'cw-tw'], ['💫', 91, 420, 26, 0, 'cw-tw'], ['🌍', 57, 440, 26, 0, 'cw-spin'], ['🏯', 22, 60, 120, 1, ''], ['🦬', 90, 510, 80, 2, ''], ['🪐', 4, 470, 70, 2, 'cw-wob'], ['🌟', 74, 440, 30, 1, 'cw-tw'], ['🛰️', 30, 650, 54, 1, 'cw-fly'], ['👾', 64, 680, 40, 2, 'cw-bob'], ['🌛', 84, 760, 60, 1, ''], ['🛸', 15, 820, 56, 2, 'cw-fly'], ['✨', 48, 920, 40, 0, 'cw-tw'], ['🚀', 30, 1040, 44, 1, 'cw-bob'], ['👽', 76, 980, 54, 2, 'cw-wob']];
  em.forEach(([e, x, y, s, p, a]) => sp(z1, x, y, e, { size: s, plane: p, anim: a }));
  [[26, 450, '#e8c870', 38], [17, 425, '#3fd2d2', 70], [19, 500, '#b9a6ff', 22], [22, 520, '#b9a6ff', 16], [16, 520, '#b9a6ff', 18], [89, 405, '#5b8cff', 14], [95, 205, '#ff3030', 14]].forEach(([x, y, c, s]) => sp(z1, x, y, star5(c, s), { plane: s > 30 ? 2 : 0, anim: s < 20 ? 'cw-tw' : '' }));
  [[53, 390, '#fff', 60], [76, 520, '#ff5ad1', 150], [10, 640, '#cfe', 40], [62, 900, '#ffe', 70]].forEach(([x, y, c, s]) => sp(z1, x, y, sparkle(c, s), { plane: 1, anim: 'cw-tw' }));
  sp(z1, 6, 290, h('div', { style: { width: '120px', height: '120px', position: 'relative' } }, h('div.cw-ring2')), { plane: 1, anim: 'cw-spin' });
  sp(z1, 34, 845, txt('.cw-glow', '★ Welcome to my Space Station ★', { font: `20px ${PX}`, color: '#7ff', whiteSpace: 'nowrap' }), { plane: 2 });
  sp(z1, 38, 905, txt('', 'You are visitor number', { font: `15px ${TNR}`, color: '#ff0' }), { plane: 2 });
  sp(z1, 38, 930, h('div.cw-cnt', {}, ...'0019970'.split('').map((d) => h('b', {}, d))), { plane: 2 });
  z1.append(h('div', { style: { position: 'absolute', left: 0, right: 0, top: '286px', zIndex: 6 } }, spine()));
  // ---------- zone 2: purple fantasy ----------
  const z2 = h('section.cw-z.cw-fan', { 'data-zone': 'Purple fantasy realm' });
  z2.append(h('div.rail', { style: { left: 0 } }, '🌹'.repeat(14)), h('div.rail', { style: { right: 0 } }, '🌹'.repeat(14)));
  sp(z2, 34, 10, txt('', "You're visiting my", { font: `italic 20px ${TNR}`, color: '#d9c8ff', textShadow: '0 0 6px #b07cff' }), { plane: 2 });
  sp(z2, 50, 0, txt('', 'Dream', { font: `46px ${PIN}`, color: '#fff', textShadow: '0 0 8px #e0b0ff' }), { plane: 2 });
  sp(z2, 30, 52, txt('.cw-fant', 'Fantasy Realm'), { plane: 2, z: 2 });
  sp(z2, 35, 160, txt('', '⚔', { fontSize: '120px', color: '#ddd', transform: 'rotate(90deg)', textShadow: '0 0 8px #fff' }), { plane: 1 });
  sp(z2, 18, 210, h('div', { style: { width: '110px', height: '110px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,#fff,#e7a6ff 18%,#9b30d9 45%,#3a0a5e 75%)', boxShadow: '0 0 30px #c05cff' } }), { plane: 2, anim: 'cw-wob' });
  sp(z2, 40, 230, h('div', { style: { width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%,#9a6ad0,#2a0a4a 70%)', boxShadow: '0 0 16px #000' } }), { plane: 0 });
  sp(z2, 7, 280, txt('.cw-glow', 'Enter', { font: `40px ${FELL}`, color: '#ff2fa0' }), { plane: 2, anim: 'cw-tw' });
  sp(z2, 10, 360, txt('', 'Vinyl Mistress', { font: `italic 700 26px ${TNR}`, color: '#1a0640', background: 'linear-gradient(#fff,#cbb6ff)', padding: '6px 14px', borderRadius: '16px', boxShadow: '0 0 14px #fff' }), { plane: 1 });
  sp(z2, 55, 225, '🌹', { size: 130, plane: 2, anim: 'cw-wob' });
  sp(z2, 72, 120, '🧚', { size: 70, plane: 1, anim: 'cw-bob' });
  sp(z2, 66, 180, '🐉', { size: 56, plane: 0, anim: 'cw-fly' });
  sp(z2, 84, 300, '🐺', { size: 90, plane: 2 });
  sp(z2, 82, 330, '🍄', { size: 60, plane: 1, anim: 'cw-bob' });
  sp(z2, 33, 290, '💃', { size: 120, plane: 2 });
  sp(z2, 14, 120, '🧙', { size: 80, plane: 1 });
  sp(z2, 16, 30, '💀', { size: 50, plane: 0, anim: 'cw-tw' });
  sp(z2, 74, 30, '🔮', { size: 60, plane: 1, anim: 'cw-wob' });
  sp(z2, 56, 330, h('div', {}, txt('.cw-glow', 'Welcome to my Heart', { font: `34px ${TNR}`, color: '#ff4fb0' }), txt('', 'the page which loving built', { font: `24px ${TNR}`, color: '#ffe94f' }), txt('', 'Email the Webmaster', { font: `21px ${TNR}`, color: '#7fc8ff', marginLeft: '40px' }), txt('', 'hotmale@hotmail.com', { font: `21px ${TNR}`, color: '#7ff', textDecoration: 'underline', marginLeft: '60px' })), { plane: 2 });
  sp(z2, 9, 480, txt('.cw-glow', 'Hello', { font: `italic 52px ${MK}`, color: '#4f7bff' }), { plane: 2, anim: 'cw-bob' });
  sp(z2, 22, 500, txt('', 'Welcome To\nHiding Place', { font: `40px/0.95 ${PIN}`, color: '#ff4fd8', whiteSpace: 'pre', textShadow: '0 0 4px #fff,2px 2px 0 #500050' }), { plane: 1 });
  sp(z2, 52, 450, '💜', { size: 80, plane: 1, anim: 'cw-wob' });
  sp(z2, 65, 470, '💎', { size: 60, plane: 0, anim: 'cw-tw' });
  sp(z2, 44, 600, txt('.cw-rb', '~*~ The Everchanging Page ~*~', { font: `italic 30px ${TNR}`, whiteSpace: 'nowrap' }), { plane: 2 });
  sp(z2, 12, 700, '🦄', { size: 110, plane: 2, anim: 'cw-bob' });
  sp(z2, 70, 640, '🕯️', { size: 60, plane: 1, anim: 'cw-tw' });
  sp(z2, 30, 760, txt('.cw-glow', 'Sign My Guestbook!', { font: `30px ${CS}`, color: '#c9a0ff' }), { plane: 1 });
  sp(z2, 60, 780, '🌙', { size: 120, plane: 0 });
  sp(z2, 40, 880, '🪄', { size: 70, plane: 2, anim: 'cw-wob' });
  sp(z2, 76, 880, '🌹', { size: 80, plane: 1 });
  sp(z2, 18, 900, '✨', { size: 60, plane: 0, anim: 'cw-tw' });
  z2.append(h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: '10px', zIndex: 6 } }, spine()));
  // ---------- zone 3: red love ----------
  const z3 = h('section.cw-z.cw-love', { 'data-zone': 'Red love / hearts' });
  sp(z3, 29, 40, txt('.cw-rb', 'I ♥ LOVE ♥ YOU', { font: `900 76px Impact,'Arial Black',sans-serif`, whiteSpace: 'nowrap', filter: 'drop-shadow(3px 3px 0 #400)' }), { plane: 2 });
  sp(z3, 36, 140, txt('.cw-glow', 'Be My Valentine', { font: `52px ${PIN}`, color: '#fff' }), { plane: 1 });
  [[6, 60, 90], [80, 40, 110], [16, 300, 70], [70, 260, 80], [45, 300, 150], [88, 420, 60], [3, 520, 100], [60, 520, 70], [30, 600, 60], [80, 650, 120]].forEach(([x, y, s], i) => sp(z3, x, y, ['💖', '💘', '💝', '💗', '❤️', '💕', '💞', '💓', '🌹', '💌'][i], { size: s, plane: s > 100 ? 2 : s > 70 ? 1 : 0, anim: ['cw-bob', 'cw-wob', 'cw-tw', 'cw-spin', ''][i % 5] }));
  sp(z3, 33, 480, h('div', { style: { background: '#fff', color: '#c00', padding: '18px 26px', border: '6px ridge #ff8fb0', font: `18px/1.5 ${CS}`, maxWidth: '420px', boxShadow: '6px 6px 0 #600' } }, h('b', { style: { font: `24px ${FELL}`, display: 'block', marginBottom: '6px' } }, 'Roses are red...'), 'This page is dedicated to my sweetheart. Click the hearts and make a wish! ', h('span', { style: { color: '#f0f' } }, '♥♥♥')), { plane: 1 });
  sp(z3, 62, 380, txt('', 'NEW!', {}), { plane: 2 }).firstChild.className = 'cw-new';
  sp(z3, 8, 780, txt('.cw-out', 'xoxo', { font: `80px ${MK}`, color: '#ff2a6a' }), { plane: 2, anim: 'cw-wob' });
  sp(z3, 54, 760, '🧸', { size: 110, plane: 2, anim: 'cw-bob' });
  z3.append(h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: '10px', zIndex: 6 } }, spine()));
  // ---------- zone 4+5: aztec sunset + ocean "my interests" ----------
  const z4 = h('section.cw-z.cw-azt', { 'data-zone': 'Aztec sunset + ocean' });
  const bands = [['repeating-linear-gradient(90deg,#d01818 0 6px,#ffd400 6px 60px,#16a34a 60px 66px,#ff66c4 66px 112px,#1840d0 112px 118px)', 0, 52], ['repeating-linear-gradient(90deg,#111 0 2px,#ffd400 2px 20px)', 52, 16], ['repeating-linear-gradient(135deg,#ff2a00 0 10px,#ffd400 10px 20px,#13a538 20px 30px,#1840d0 30px 40px)', 68, 32], ['repeating-linear-gradient(90deg,#0d1a8a 0 48px,#ffd400 48px 52px)', 100, 30], ['repeating-linear-gradient(45deg,#d01818 0 8px,#ff8c00 8px 16px),linear-gradient(#000,#000)', 130, 20], ['radial-gradient(circle,#ffd400 0 7px,#c01010 8px 12px,#0000 13px)', 150, 30]];
  bands.forEach(([bg, top, hh]) => z4.append(h('div.cw-band', { style: { background: bg, top: top + 'px', height: hh + 'px', backgroundSize: bg.startsWith('radial') ? '56px 30px' : '' } })));
  z4.append(h('div.cw-band', { style: { top: '180px', height: '40px', background: 'radial-gradient(circle at 50% 10%,#ffde00 0 3px,#0000 4px),radial-gradient(circle at 50% 60%,#d0102a 0 11px,#0000 12px)', backgroundSize: '56px 40px' } }));
  const sun = h('div', { html: `<svg width="250" height="250" viewBox="0 0 250 250"><circle cx="125" cy="125" r="122" fill="#b8321a" stroke="#5a1408" stroke-width="4"/>${Array.from({ length: 24 }, (_, i) => `<path d="M125 6l9 22h-18z" fill="${i % 2 ? '#e8b030' : '#ff6a1a'}" stroke="#5a1408" transform="rotate(${i * 15} 125 125)"/>`).join('')}<circle cx="125" cy="125" r="92" fill="#e2522a" stroke="#5a1408" stroke-width="3"/>${Array.from({ length: 20 }, (_, i) => `<rect x="119" y="38" width="12" height="16" fill="${['#ffcc33', '#2aa6a0', '#ff8833', '#fff'][i % 4]}" stroke="#5a1408" transform="rotate(${i * 18} 125 125)"/>`).join('')}<circle cx="125" cy="125" r="62" fill="#c43c1c" stroke="#5a1408" stroke-width="3"/><circle cx="125" cy="122" r="36" fill="#f0a05a" stroke="#5a1408" stroke-width="3"/><circle cx="112" cy="114" r="6" fill="#fff" stroke="#000" stroke-width="2"/><circle cx="138" cy="114" r="6" fill="#fff" stroke="#000" stroke-width="2"/><rect x="113" y="132" width="24" height="10" rx="3" fill="#7a1a10"/><path d="M118 142l7 12 7-12" fill="#ff5a5a" stroke="#5a1408"/><path d="M78 100l-12-24 22 14zM172 100l12-24-22 14zM80 160l-14 18 24-6zM170 160l14 18-24-6z" fill="#fff" stroke="#5a1408" stroke-width="2"/></svg>` });
  sp(z4, 38, -10, sun, { plane: 1, z: 2, title: 'Sun stone' });
  z4.append(h('div', { style: { position: 'absolute', left: 0, right: 0, top: '520px', height: '60px', overflow: 'hidden', zIndex: 3 } }, h('div', { style: { font: `italic 700 40px ${TNR}`, color: '#ff6a0080', whiteSpace: 'nowrap', textShadow: '1px 1px #c43c0060' } }, '~ welcome to my homepage ~ '.repeat(8))));
  sp(z4, 15, 400, h('div', { style: { width: '130px', height: '130px', borderRadius: '50%', background: 'radial-gradient(circle,#fff36a,#ffd800 70%)', boxShadow: '0 0 40px #fff36a' } }), { plane: 0 });
  sp(z4, 18, 410, '🌍', { size: 50, plane: 1, anim: 'cw-spin' });
  sp(z4, 16, 470, '🦭', { size: 80, plane: 2, anim: 'cw-bob' });
  sp(z4, 23, 470, txt('', 'NEW!', {}), { plane: 2 }).firstChild.className = 'cw-new';
  [[26, 420, 34], [30, 470, 26], [77, 455, 28]].forEach(([x, y, s]) => sp(z4, x, y, h('div', { html: `<svg width="${s * 2}" height="${s}" viewBox="0 0 60 30"><path d="M2 20q14-18 28 0q14-18 28 0" stroke="#222" stroke-width="5" fill="none" stroke-linecap="round"/></svg>` }), { plane: 0, anim: 'cw-fly' }));
  sp(z4, 37, 520, '🗿', { size: 70, plane: 1 }); sp(z4, 60, 520, '🗿', { size: 70, plane: 1 });
  sp(z4, 1, 520, '💃', { size: 70, plane: 1 }); sp(z4, 87, 470, '🌴', { size: 120, plane: 2 }); sp(z4, 93, 520, '🌴', { size: 80, plane: 1 }); sp(z4, 85, 560, '🦩', { size: 60, plane: 1 });
  sp(z4, 9, 640, '🦈', { size: 46, plane: 0, anim: 'cw-fly' }); sp(z4, 76, 650, '🐬', { size: 84, plane: 2, anim: 'cw-wob' }); sp(z4, 92, 690, '🐠', { size: 50, plane: 1, anim: 'cw-bob' });
  sp(z4, 0, 735, '🧰', { size: 26, plane: 2 });
  z4.append(h('div.cw-oc'), h('div.cw-int', {}, ...'MY INTERESTS'.split('').map((c) => h('div', {}, c === ' ' ? '\u00a0' : c))));
  const FISH = [['🚢', 'N/A'], ['🐟', 'Dolphin'], ['🐠', 'Fish'], ['🐡', 'Dolphin'], ['🦐', 'Red Fish'], ['🧜‍♀️', 'Angel'], ['🐟', 'Dolphin'], ['🐋', 'Fish'], ['🐠', 'Shark'], ['🦈', 'Shark'], ['🐡', 'Dolphin'], ['🐚', 'Clam'], ['🦑', 'Jellyfish'], ['📧', 'Email Me'], ['🐬', 'Dolphin'], ['🦞', 'Shrimp'], ['🐙', 'Octopus'], ['🧜‍♂️', 'Merman'], ['🦀', 'Crab'], ['🐳', 'Whale'], ['🐢', 'Turtle'], ['🦭', 'Seal'], ['🪸', 'Coral'], ['⚓', 'Anchor']];
  const fishLog = h('div', { style: { position: 'absolute', left: '70px', bottom: '26px', font: `14px ${PX}`, color: '#ffe600', textShadow: '2px 2px #003', zIndex: 8 } }, 'Click a critter to learn more!');
  z4.append(h('div.cw-fish', { style: { zIndex: 6 } }, FISH.map(([e, n]) => h('button', { onclick: (ev) => { fishLog.textContent = n === 'Email Me' ? '✉ Mailbox is full! Try again later :)' : n === 'N/A' ? 'N/A ... under construction 🚧' : `My favourite: ${n}! (it's actually a ${e})`; if (sound) blip(midi(72 + Math.floor(Math.random() * 12)), 0.2, 'triangle', 0.05); ev.currentTarget.firstChild.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.6) rotate(20deg)' }, { transform: 'scale(1)' }], 500); } }, h('span', {}, e), n))), fishLog);
  z4.append(h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: '-6px', zIndex: 6 } }, spine()));
  // ---------- zone 6: welcome home ----------
  const z6 = h('section.cw-z.cw-home', { 'data-zone': 'Welcome home' });
  z6.append(h('div.cw-marq', { style: { top: '14px', font: `20px ${PX}`, color: '#f60', zIndex: 5 } }, h('div', {}, '★ THE BEST PLACE ON EARTH HAS BEEN... ★ Welcome home ★ Last updated: 06/14/1999 ★ Best viewed in Netscape Navigator at 800x600 ★')));
  sp(z6, 32, 60, txt('.cw-out', 'ON EARTH HAS BEEN.', { font: `900 44px Impact,'Arial Black',sans-serif`, color: '#ff7a00', whiteSpace: 'nowrap', WebkitTextStroke: '2px #000' }), { plane: 1 });
  sp(z6, 29, 130, txt('.cw-wa', 'Welcome home', { whiteSpace: 'nowrap' }), { plane: 2 });
  const HOUSES = ['🏠', '🏡', '🏘️', '⛪', '🏫', '🏡', '🏠', '🏰', '🏡', '🛖', '🏠', '🏡'];
  z6.append(h('div', { style: { position: 'absolute', left: '4%', right: '4%', top: '310px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '4px solid #6a4', paddingBottom: '2px', zIndex: 4 } }, HOUSES.map((e, i) => h('span', { style: { fontSize: 44 + (i * 17) % 34 + 'px' } }, e))));
  [[3, 230, '🐕', 60, 'cw-bob'], [92, 230, '👨‍👩‍👧', 58, ''], [55, 240, '🚗', 50, 'cw-fly'], [70, 60, '🌈', 90, ''], [10, 40, '☀️', 80, 'cw-spin'], [86, 40, '🎈', 60, 'cw-bob'], [50, 30, '💻', 50, 'cw-wob']].forEach(([x, y, e, s, a]) => sp(z6, x, y, e, { size: s, plane: s > 60 ? 2 : 1, anim: a }));
  z6.append(h('div', { style: { position: 'absolute', left: '10%', right: '10%', top: '410px', font: `13px ${TNR}`, color: '#00c', textAlign: 'center', zIndex: 4 } }, 'This page is a love letter to the GeoCities neighborhoods: ', h('u', {}, 'Area51'), ' · ', h('u', {}, 'Hollywood'), ' · ', h('u', {}, 'SiliconValley'), ' · ', h('u', {}, 'Heartland'), ' · ', h('u', {}, 'EnchantedForest'), ' · ', h('u', {}, 'Paris'), ' · ', h('u', {}, 'Athens')));
  const tiles = h('div', { style: { position: 'absolute', left: '4%', right: '4%', top: '470px', display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '12px', zIndex: 4 } }, ['🌳', '🔮', '🧊', '🎱', '🕸️', '🧪', '🗿', '💾', '📼', '🖱️', '📟', '💿', '📠', '🕹️'].map((e) => h('div', { style: { aspectRatio: '1.3', border: '3px outset #ddd', background: 'linear-gradient(135deg,#f5f5f5,#cfd8e8)', display: 'grid', placeItems: 'center', fontSize: '50px' } }, e)));
  z6.append(tiles);
  sp(z6, 40, 790, txt('', '🚧 UNDER CONSTRUCTION 🚧', { font: `14px ${PX}`, color: '#000', background: 'repeating-linear-gradient(45deg,#ffd400 0 16px,#111 16px 32px)', padding: '14px 18px', textShadow: '0 0 3px #ffd400,0 0 3px #ffd400,0 0 3px #ffd400' }), { plane: 2 });
  const ft = h('footer.cw-ft', {}, h('h2', {}, 'A love letter to the', h('br'), 'Internet of old'), h('div.cols', {}, h('p', {}, "This is a web collage of text and images excavated from the buried neighborhoods of archived GeoCities pages (1994–2009). It is an homage to a time when the internet was a place of personal expression, sharing and play."), h('p', {}, 'Rebuilt here as a clone-practice study: every sprite on this page is emoji or CSS, every loop is synthesised with WebAudio, and each sprite sits on one of three depth planes that drift at different speeds as you scroll.')), h('div.bot', {}, h('span', {}, 'Press'), h('span', {}, 'Facebook'), h('span', {}, 'Instagram'), h('span', { style: { marginLeft: 'auto' } }, 'Cameron’s World (study)')));
  sc.append(z1, z2, z3, z4, z6, ft);
  // ---------- parallax ----------
  const zones = [z1, z2, z3, z4, z6];
  const par = () => { const y = sc.scrollTop, vh = sc.clientHeight; for (const s0 of sprites) { const zt = s0.zone.offsetTop; if (zt > y + vh + 400 || zt + s0.zone.offsetHeight < y - 400) continue; s0.el.style.transform = `translate3d(0,${((y - zt) * FACT[s0.plane]).toFixed(1)}px,0)`; } };
  let raf = 0; sc.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; par(); }); }, { passive: true }); par();
  // ---------- sound toggle (looping WebAudio MIDI-ish track) ----------
  let sound = false, loopT = null, step0 = 0, notesPlayed = 0;
  const icoOn = `<svg viewBox="0 0 24 22"><path d="M2 8h4l6-5v16l-6-5H2z" fill="#000"/><path d="M15 7q3 4 0 8M18 4q6 7 0 14" stroke="#000" stroke-width="2" fill="none"/><text x="16" y="9" font-size="7" fill="#c00">♪</text></svg>`;
  const icoOff = `<svg viewBox="0 0 24 22"><path d="M2 8h4l6-5v16l-6-5H2z" fill="#000"/><path d="M15 7l7 8M22 7l-7 8" stroke="#c00" stroke-width="2.2"/></svg>`;
  const lbl = h('span.lbl', {}, 'sound: OFF');
  const snd = h('button.cw-snd', { title: 'Toggle background music', 'aria-pressed': 'false', html: icoOff, onclick: () => setSound(!sound) }); snd.append(lbl);
  root.append(snd);
  const CH = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]]; const MEL = [76, 74, 72, 74, 76, 76, 76, -1, 74, 74, 74, -1, 76, 79, 79, -1];
  const tick = () => { if (!sound || !document.body.contains(sc)) return; const bar = Math.floor(step0 / 8) % 4, k = step0 % 8; const ch = CH[bar];
    blip(midi(ch[[0, 1, 2, 3, 2, 1, 2, 3][k]] + 12), 0.28, 'triangle', 0.035); if (k === 0) blip(midi(ch[0] - 24), 1.4, 'sine', 0.06); if (k === 4) blip(midi(ch[0] - 12), 0.6, 'sine', 0.035);
    const m = MEL[(step0 >> 1) % 16]; if (step0 % 2 === 0 && m > 0) blip(midi(m), 0.32, 'square', 0.014); notesPlayed++; step0++; loopT = setTimeout(tick, 190); };
  const setSound = (on) => { sound = on; snd.innerHTML = on ? icoOn : icoOff; snd.append(lbl); lbl.textContent = on ? 'sound: ON (synth loop)' : 'sound: OFF'; snd.setAttribute('aria-pressed', String(on)); snd.classList.add('flash'); setTimeout(() => snd.classList.remove('flash'), 1200); clearTimeout(loopT); if (on) { audio(); tick(); } };
  window.__demoProof = async () => { const out = []; const plane = (p) => sprites.find((s0) => s0.plane === p && s0.zone === z2);
    out.push(`zones: ${zones.map((z) => z.dataset.zone).join(' → ')} (+footer)`); out.push(`sprites: ${sprites.length} on 3 planes [${[0, 1, 2].map((p) => sprites.filter((s0) => s0.plane === p).length).join('/')}]`);
    for (const z of zones) { sc.scrollTop = z.offsetTop + 200; par(); await sleep(60); }
    sc.scrollTop = z2.offsetTop + 300; par(); const ty = (el) => +(el.style.transform.match(/,\s*(-?[\d.]+)px/) || [0, 0])[1];
    out.push(`parallax @fantasy+300: back ${ty(plane(0).el)}px, mid ${ty(plane(1).el)}px, front ${ty(plane(2).el)}px`);
    setSound(true); await sleep(700); out.push(`sound ON: ${notesPlayed} notes scheduled, ctx=${audio()?.state}`); setSound(false); const n = notesPlayed; await sleep(400); out.push(`sound OFF: loop stopped=${notesPlayed === n}`);
    z4.querySelector('.cw-fish button:nth-child(10)').click(); out.push(`critter: ${fishLog.textContent}`); fishLog.textContent = 'Click a critter to learn more!';
    sc.scrollTop = 0; par(); out.push('restored: top of page, sound off'); return out.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['parody-desktop-os-sandbox'])(root, T); }
