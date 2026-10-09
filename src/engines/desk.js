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

export function mount(root, variant, opts, T) { (V[variant] || V['parody-desktop-os-sandbox'])(root, T); }
