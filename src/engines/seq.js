import { h, s, css, blip, drum, midi, SCALE, audio, toast, sleep, clamp } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle } from '../kit.js';
css(`.sq-cell{cursor:pointer;transition:background .08s, box-shadow .08s}.sq-play{box-shadow:inset 0 0 0 999px #ffffff22}`);
function core({ rows, steps, bpm = 110, onstep, sound }) {
  const g = Array.from({ length: rows }, () => Array(steps).fill(0)); let pos = -1, tid = null, tempo = bpm;
  const tick = () => { pos = (pos + 1) % steps; for (let r = 0; r < rows; r++) if (g[r][pos]) sound(r, g[r][pos]); onstep?.(pos); };
  const play = () => { audio(); if (tid) return; tid = setInterval(tick, 60000 / tempo / 4); };
  const stop = () => { clearInterval(tid); tid = null; };
  return { g, play, stop, toggle: () => (tid ? stop() : play(), !!tid), get playing() { return !!tid; }, setTempo: (t) => { tempo = t; if (tid) { stop(); play(); } }, get pos() { return pos; }, tick };
}
const V = {};
V['music-grid-sequencer'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', ac: '#1d8af8', dark: false });
  const R = 14, S = 32; const cols = ['#e33059', '#f95c3c', '#fc8a28', '#fdb827', '#9ecb3f', '#2cc36b', '#15b7a8', '#1d8af8', '#5d5cf5', '#8e4cf0', '#c847d8', '#e33059', '#f95c3c', '#fc8a28'];
  const sq = core({ rows: R + 2, steps: S, sound: (r) => (r < R ? blip(midi(60 + SCALE[R - 1 - r]), 0.3, 'triangle', 0.12) : drum(r === R ? 'snare' : 'kick')), onstep: (p) => cells.forEach((row, r) => row.forEach((c, i) => c.classList.toggle('sq-play', i === p))) });
  const gridEl = h('div', { style: { position: 'absolute', inset: '52px 0 78px 0', display: 'grid', gridTemplateColumns: `repeat(${S},1fr)`, gridTemplateRows: `repeat(${R},1fr) 6px repeat(2,1.4fr)` } });
  const cells = [];
  for (let r = 0; r < R + 2; r++) { if (r === R) for (let i = 0; i < S; i++) gridEl.append(h('div', { style: { background: '#fff' } })); cells[r] = []; for (let i = 0; i < S; i++) { const c = h('div.sq-cell', { style: { border: '1px solid #cfe3f7', borderLeft: i % 4 === 0 ? '1.5px solid #9cc7ee' : '', background: Math.floor(i / 8) % 2 ? '#f3f9ff' : '#fff' } }); c.onclick = () => { sq.g[r][i] ^= 1; paint(r, i); if (sq.g[r][i]) sq.tick === 0 || (r < R ? blip(midi(60 + SCALE[R - 1 - r]), 0.25, 'triangle') : drum(r === R ? 'snare' : 'kick')); }; cells[r][i] = c; gridEl.append(c); } }
  const paint = (r, i) => (cells[r][i].style.background = sq.g[r][i] ? (r < R ? cols[r] : '#3c3c4a') : Math.floor(i / 8) % 2 ? '#f3f9ff' : '#fff');
  const playB = h('button', { style: { width: '58px', height: '58px', borderRadius: '50%', border: 0, background: '#1d8af8', color: '#fff', fontSize: '22px' }, onclick: () => { sq.toggle(); playB.textContent = sq.playing ? '■' : '▶'; } }, '▶');
  root.append(h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '52px', display: 'flex', alignItems: 'center', padding: '0 18px', gap: '14px', borderBottom: '1px solid #eee' } }, '←', '↻', h('b', { style: { flex: 1, textAlign: 'center', letterSpacing: '.18em', fontSize: '13px' } }, 'SONG MAKER'), h('span', { style: { color: '#1d8af8' } }, '● Restart'), '● About'), gridEl,
    h('div', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '78px', display: 'flex', alignItems: 'center', gap: '26px', padding: '0 22px', borderTop: '1px solid #eee' } }, playB, select(['Marimba', 'Piano', 'Strings', 'Woodwind', 'Synth'], 'Marimba', () => {}), select(['Electronic', 'Blocks', 'Kit', 'Conga'], 'Electronic', () => {}), h('div', { style: { width: '220px' } }, slider('Tempo', 60, 200, 110, 1, (v) => sq.setTempo(v))), h('span', { style: { flex: 1 } }), btn('⚙ Settings', () => {}), btn('↶ Undo', () => {}), btn('✓ Save', () => toast('Song link copied'), 'pri')));
  window.__demoProof = async () => { const mel = [0, 2, 4, 5, 4, 2, 7, 9, 7, 4, 2, 0, 4, 7, 11, 13]; mel.forEach((n, i) => { const r = R - 1 - n % R; sq.g[r][i * 2] = 1; paint(r, i * 2); }); for (let i = 0; i < S; i += 4) { sq.g[R + 1][i] = 1; paint(R + 1, i); sq.g[R][i + 2] = 1; paint(R, i + 2); } sq.play(); await sleep(700); sq.stop(); return 'composed melody + beat, playhead advanced to ' + sq.pos; };
};
V['tonematrix-click-grid'] = (root, T) => {
  theme(root, T, { bg: '#0b0b0b', fg: '#bbb', dark: true });
  const N = 16; const sq = core({ rows: N, steps: N, bpm: 120, sound: (r) => blip(midi(48 + SCALE[N - 1 - r]), 0.5, 'sine', 0.09), onstep: (p) => draw(p) });
  const box = h('div', { style: { position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', width: '560px', height: '560px', display: 'grid', gridTemplateColumns: `repeat(${N},1fr)`, gap: '4px', padding: '14px', background: '#171717', borderRadius: '6px', boxShadow: '0 0 0 1px #2a2a2a' } });
  const cells = []; let down = null;
  for (let r = 0; r < N; r++) for (let i = 0; i < N; i++) { const c = h('div.sq-cell', { style: { background: '#2b2b2b', borderRadius: '2px' } }); c.onpointerdown = () => { down = sq.g[r][i] ? 0 : 1; sq.g[r][i] = down; draw(sq.pos); }; c.onpointerenter = () => { if (down != null) { sq.g[r][i] = down; draw(sq.pos); } }; cells.push(c); box.append(c); }
  window.addEventListener('pointerup', () => (down = null));
  function draw(p) { cells.forEach((c, k) => { const r = Math.floor(k / N), i = k % N; const on = sq.g[r][i]; const hit = on && i === p; c.style.background = hit ? '#fff' : on ? '#d9d9d9' : i === p ? '#3a3a3a' : '#2b2b2b'; c.style.boxShadow = hit ? '0 0 18px #fff' : on ? '0 0 6px #ffffff66' : ''; }); }
  root.append(box, h('div', { style: { position: 'absolute', bottom: '46px', width: '100%', textAlign: 'center', fontSize: '12px', lineHeight: 1.7 } }, h('div', {}, 'The ToneMatrix-ish is a click grid · Click cells to add notes'), h('div.k-row', { style: { justifyContent: 'center', marginTop: '10px' } }, btn('▶ Play', () => sq.play(), 'pri'), btn('■ Stop', () => sq.stop()), btn('Clear', () => { sq.g.forEach((r) => r.fill(0)); draw(-1); }), btn('Share', () => toast('Pattern URL copied')))));
  root.style.setProperty('--ac', '#555');
  window.__demoProof = async () => { for (let i = 0; i < N; i++) { sq.g[(i * 5) % N][i] = 1; sq.g[(i * 3 + 7) % N][i] = 1; } sq.play(); await sleep(600); sq.stop(); draw(sq.pos); return 'drew diagonal pattern, playhead lit'; };
};
V['beepbox-piano-roll'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#ccc', panel: '#000', ac: '#74f', dark: true });
  const R = 12, S = 32; const sq = core({ rows: R, steps: S, bpm: 150, sound: (r) => blip(midi(60 + (R - 1 - r)), 0.18, 'square', 0.05), onstep: (p) => (head.style.left = (p / S) * 100 + '%') });
  const roll = h('div', { style: { position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${S},1fr)`, gridTemplateRows: `repeat(${R},1fr)`, gap: '1px', background: '#111', height: '100%' } });
  const head = h('div', { style: { position: 'absolute', top: 0, bottom: 0, width: '2px', background: '#fff', left: 0, pointerEvents: 'none' } });
  const cells = [];
  for (let r = 0; r < R; r++) for (let i = 0; i < S; i++) { const black = [1, 3, 6, 8, 10].includes((R - 1 - r) % 12); const c = h('div.sq-cell', { style: { background: black ? '#1b1b1b' : '#262626' } }); c.onclick = () => { sq.g[r][i] ^= 1; c.style.background = sq.g[r][i] ? '#9d5cff' : black ? '#1b1b1b' : '#262626'; c.style.boxShadow = sq.g[r][i] ? 'inset 0 0 0 1px #c9a3ff' : ''; }; cells.push(c); roll.append(c); }
  roll.append(head);
  const chans = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(16,1fr)', gap: '2px', padding: '6px' } });
  ['#25f3ff', '#ffff25', '#ff9752', '#ff90ff', '#aaaaaa'].forEach((c, k) => { for (let b = 0; b < 16; b++) chans.append(h('div', { style: { height: '22px', background: b < 4 || (k === 0 && b < 8) ? c + '66' : '#222', color: '#000', fontSize: '11px', display: 'grid', placeItems: 'center', border: b === 0 && k === 0 ? '2px solid #fff' : '' } }, b < 4 ? (b % 2) + 1 : '')); });
  const side = panel(null, h('div', { style: { fontSize: '12px' } }, 'BeepBox-ish 4.1'), select(['File ▾'], 'File ▾', () => {}), select(['Edit ▾'], 'Edit ▾', () => {}), h('div.k-h', {}, 'Song Settings'), select(['C Major', 'A Minor', 'D Dorian'], 'C Major', () => {}), slider('Tempo', 30, 300, 150, 1, (v) => sq.setTempo(v)), slider('Reverb', 0, 100, 30, 1, () => {}), h('div.k-h', {}, 'Instrument'), select(['chip wave', 'FM', 'noise', 'spectrum'], 'chip wave', () => {}), select(['square', 'triangle', 'sawtooth'], 'square', () => {}), slider('Volume', 0, 100, 70, 1, () => {}));
  Object.assign(side.style, { border: '0', background: '#000' });
  const playB = btn('▶ Play', () => { sq.toggle(); playB.textContent = sq.playing ? '❚❚ Pause' : '▶ Play'; }, 'pri');
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 230px'; root.style.gridTemplateRows = '1fr auto'; root.style.gap = '6px'; root.style.padding = '8px 8px 0';
  root.append(h('div', { style: { display: 'grid', gridTemplateRows: 'auto 1fr', gap: '4px' } }, h('div.k-row', {}, playB, btn('⏮', () => {}), btn('⏭', () => {}), h('span', { style: { opacity: .6 } }, 'Channel 1 · Pattern 1')), roll), side, h('div', { style: { gridColumn: '1/-1' } }, chans, h('div', { style: { textAlign: 'center', padding: '10px', fontWeight: 800, fontSize: '22px' } }, 'BeepBox-ish'), h('p', { style: { textAlign: 'center', opacity: .6, margin: '0 0 8px', fontSize: '12px' } }, 'All song data is contained in the URL — share it to share your song.')));
  window.__demoProof = async () => { const mel = [0, 4, 7, 11, 7, 4, 2, 5, 9, 5, 2, 0, 4, 7, 4, 0]; mel.forEach((n, i) => cells[(R - 1 - n) * S + i * 2].click()); sq.play(); await sleep(500); sq.stop(); return 'wrote arpeggio in piano roll'; };
};
V['ableton-beat-grid-lesson'] = (root, T) => {
  theme(root, T, { bg: '#1a1a1a', fg: '#fff', ac: '#ffd200', acfg: '#000', dark: true });
  const ROWS = ['Kick', 'Snare', 'Hat', 'Open Hat', 'Clap', 'Cymbal'], S = 16;
  const sq = core({ rows: ROWS.length, steps: S, bpm: 118, sound: (r) => drum(['kick', 'snare', 'hat', 'hat', 'snare', 'hat'][r]), onstep: (p) => cells.forEach((c, k) => (c.style.outline = k % S === p ? '2px solid #fff' : '')) });
  const g = h('div', { style: { display: 'grid', gridTemplateColumns: `90px repeat(${S},1fr)`, gap: '6px' } }); const cells = [];
  ROWS.forEach((n, r) => { g.append(h('div', { style: { fontSize: '13px', alignSelf: 'center', opacity: .8 } }, n)); for (let i = 0; i < S; i++) { const c = h('div.sq-cell', { style: { aspectRatio: '1', background: i % 4 === 0 ? '#4a4a4a' : '#3a3a3a' } }); c.onclick = () => { sq.g[r][i] ^= 1; c.style.background = sq.g[r][i] ? '#ffd200' : i % 4 === 0 ? '#4a4a4a' : '#3a3a3a'; if (sq.g[r][i]) drum(['kick', 'snare', 'hat', 'hat', 'snare', 'hat'][r]); }; cells.push(c); g.append(c); } });
  root.append(h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '430px 1fr', gap: '50px', padding: '70px 60px' } },
    h('div', {}, h('div', { style: { fontSize: '13px', opacity: .6 } }, '1 / 6 · beats'), h('h1', { style: { fontSize: '44px', margin: '12px 0' } }, 'Make beats'), h('p', { style: { lineHeight: 1.6, opacity: .85 } }, 'The grid above is the “beats” of a musical pattern. Click the cells to add sounds; press Play to hear your drum loop. Try the kick on every quarter note.'), h('div.k-row', { style: { marginTop: '24px' } }, btn('▶ Play', (e) => { sq.toggle(); e.target.textContent = sq.playing ? '■ Stop' : '▶ Play'; }, 'pri'), btn('Clear', () => { sq.g.forEach((r) => r.fill(0)); cells.forEach((c, k) => (c.style.background = (k % S) % 4 === 0 ? '#4a4a4a' : '#3a3a3a')); }), btn('Export to Live', () => toast('Exported .als (demo)')), btn('Next →', () => toast('Lesson 2: Chords')))),
    h('div', { style: { alignSelf: 'center' } }, g, slider('Tempo', 60, 180, 118, 1, (v) => sq.setTempo(v)))));
  window.__demoProof = async () => { [0, 4, 8, 12].forEach((i) => cells[i].click()); [4, 12].forEach((i) => cells[S + i].click()); for (let i = 0; i < S; i += 2) cells[2 * S + i].click(); sq.play(); await sleep(500); sq.stop(); return 'four-on-floor beat programmed'; };
};
V['euclidean-pulse-necklace'] = (root, T) => {
  theme(root, T, { bg: '#0b1628', fg: '#e6edf7', panel: '#12213a', ac: '#2f7bff', dark: true });
  const TR = [{ n: 'kick', k: 4, s: 16, r: 0, c: '#ff8a3d' }, { n: 'snare', k: 3, s: 8, r: 2, c: '#3dd6ff' }, { n: 'hat', k: 7, s: 12, r: 0, c: '#b58cff' }, { n: 'perc', k: 5, s: 13, r: 1, c: '#7cf29a' }];
  const E = (k, n, r) => { const out = []; for (let i = 0; i < n; i++) out.push(Math.floor(((i + r) * k) / n) !== Math.floor(((i + r - 1) * k) / n) ? 1 : 0); return out; };
  let step = -1, tid;
  const svg = s('svg', { viewBox: '-220 -220 440 440', width: 440, height: 440 });
  const rowsEl = h('div', { style: { display: 'grid', gap: '10px' } });
  function draw() {
    svg.replaceChildren(); rowsEl.replaceChildren();
    TR.forEach((t, j) => { const pat = E(t.k, t.s, t.r); const R = 190 - j * 40;
      svg.append(s('circle', { r: R, fill: 'none', stroke: '#ffffff18' }));
      pat.forEach((on, i) => { const a = (i / t.s) * 2 * Math.PI - Math.PI / 2; const cur = step >= 0 && step % t.s === i; svg.append(s('circle', { cx: Math.cos(a) * R, cy: Math.sin(a) * R, r: on ? (cur ? 11 : 8) : 3, fill: on ? t.c : '#ffffff40', opacity: cur || !on ? 1 : 0.8 })); });
      rowsEl.append(h('div', { style: { display: 'grid', gridTemplateColumns: '60px 1fr 200px', gap: '10px', alignItems: 'center' } }, h('b', { style: { color: t.c } }, t.n), h('div', { style: { display: 'grid', gridTemplateColumns: `repeat(${t.s},1fr)`, gap: '3px' } }, pat.map((on, i) => h('div', { style: { height: '20px', borderRadius: '50%', background: on ? t.c : '#ffffff14', outline: step >= 0 && step % t.s === i ? '2px solid #fff' : '' } }))), h('div.k-row', {}, slider('k', 0, t.s, t.k, 1, (v) => { t.k = v; draw(); }), slider('n', 2, 16, t.s, 1, (v) => { t.s = v; t.k = Math.min(t.k, v); draw(); }), slider('rot', 0, 15, t.r, 1, (v) => { t.r = v; draw(); })))); });
    svg.append(s('text', { 'text-anchor': 'middle', y: 6, fill: '#e6edf7', 'font-size': 16, 'font-weight': 700 }, `E(${TR[0].k},${TR[0].s})`));
  }
  const play = () => { audio(); if (tid) { clearInterval(tid); tid = null; return; } tid = setInterval(() => { step++; TR.forEach((t) => { if (E(t.k, t.s, t.r)[step % t.s]) drum(t.n === 'kick' ? 'kick' : t.n === 'snare' ? 'snare' : 'hat'); }); draw(); }, 130); };
  root.append(h('div', { style: { position: 'absolute', inset: 0, padding: '22px 30px', display: 'grid', gridTemplateRows: 'auto 1fr', gap: '18px' } },
    h('div', { style: { textAlign: 'center' } }, h('div', { style: { font: '700 28px Georgia,serif' } }, 'Pulses & Drum Tracks Lab'), h('div', { style: { opacity: .6, fontSize: '13px' } }, 'Euclidean rhythms: distribute k onsets as evenly as possible over n steps')),
    h('div', { style: { display: 'grid', gridTemplateColumns: '460px 1fr', gap: '24px' } }, h('div.k-panel', { style: { alignItems: 'center' } }, svg), panel('Tracks · step grid', rowsEl, h('div.k-row', {}, btn('▶ Play / Stop', play, 'pri'), btn('Generate', () => { TR.forEach((t) => { t.k = 1 + Math.floor(Math.random() * t.s * 0.7); t.r = Math.floor(Math.random() * 4); }); draw(); }), btn('Rotate ↻', () => { TR.forEach((t) => (t.r = (t.r + 1) % t.s)); draw(); })), h('div.k-h', {}, 'ADSR / Delay'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px' } }, ['A', 'D', 'S', 'R', 'Delay'].map((n) => slider(n, 0, 100, 30, 1, () => {})))))));
  draw();
  window.__demoProof = async () => { TR[0].k = 5; draw(); play(); await sleep(700); play(); return 'E(5,16) kick + playback step ' + step; };
};
V['online-sequencer-piano-roll'] = (root, T) => {
  theme(root, T, { bg: '#e8e8ea', fg: '#222', panel: '#f4f4f5', ac: '#f08a24', dark: false });
  const NOTES = 24, STEPS = 64;
  const NOTE_NAMES = [];
  for (let i = NOTES - 1; i >= 0; i--) {
    const midiN = 48 + i; // C3..
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    NOTE_NAMES.push({ midi: midiN, name: names[midiN % 12] + Math.floor(midiN / 12 - 1), black: names[midiN % 12].includes('#') });
  }
  const INST = [
    { id: 'ep', label: 'Electric Piano', color: '#f08a24', wave: 'triangle' },
    { id: 'synth', label: 'Synth', color: '#3b82f6', wave: 'sawtooth' },
    { id: 'bass', label: 'Bass', color: '#22c55e', wave: 'square' },
    { id: 'pluck', label: 'Pluck', color: '#a855f7', wave: 'sine' },
    { id: 'bell', label: 'Bell', color: '#ef4444', wave: 'sine' },
  ];
  let inst = INST[0], tool = 'draw', bpm = 120;
  // grid[row][step] = 0 | instrument color key
  const g = Array.from({ length: NOTES }, () => Array(STEPS).fill(0));
  let pos = -1, tid = null;
  const cellW = 18, cellH = 16;
  const keys = h('div', { style: { width: '56px', flexShrink: 0, borderRight: '1px solid #bbb', background: '#ddd' } });
  const gridWrap = h('div', { style: { overflow: 'auto', flex: 1, position: 'relative', background: '#cfd0d4' } });
  const gridEl = h('div', { style: { position: 'relative', width: STEPS * cellW + 'px', height: NOTES * cellH + 'px' } });
  const head = h('div', { style: { position: 'absolute', top: 0, bottom: 0, width: '2px', background: '#e11', left: 0, zIndex: 3, pointerEvents: 'none', display: 'none' } });
  const cells = [];
  for (let r = 0; r < NOTES; r++) {
    const n = NOTE_NAMES[r];
    keys.append(h('div', {
      style: {
        height: cellH + 'px', boxSizing: 'border-box', borderBottom: '1px solid #bbb',
        background: n.black ? '#2a2a2a' : '#fafafa', color: n.black ? '#eee' : '#333',
        font: '10px/16px system-ui', paddingLeft: n.black ? '18px' : '6px', userSelect: 'none',
      },
    }, n.name));
    cells[r] = [];
    for (let i = 0; i < STEPS; i++) {
      const bar = Math.floor(i / 4) % 2;
      const c = h('div', {
        style: {
          position: 'absolute', left: i * cellW + 'px', top: r * cellH + 'px', width: cellW + 'px', height: cellH + 'px',
          boxSizing: 'border-box', borderRight: i % 4 === 0 ? '1px solid #9a9a9e' : '1px solid #b8b8bc',
          borderBottom: '1px solid #b8b8bc', background: n.black ? (bar ? '#b0b1b6' : '#babbbf') : (bar ? '#d5d6da' : '#dde0e4'),
          cursor: 'pointer',
        },
      });
      c.onpointerdown = (e) => {
        e.preventDefault();
        if (tool === 'erase' || (tool === 'draw' && g[r][i] && e.shiftKey)) {
          g[r][i] = 0; paint(r, i);
        } else if (tool === 'erase') {
          g[r][i] = 0; paint(r, i);
        } else {
          const on = g[r][i] ? 0 : inst.color;
          g[r][i] = on; paint(r, i);
          if (on) blip(midi(NOTE_NAMES[r].midi), 0.22, inst.wave, 0.08);
        }
      };
      cells[r][i] = c; gridEl.append(c);
    }
  }
  gridEl.append(head); gridWrap.append(gridEl);
  const paint = (r, i) => {
    const n = NOTE_NAMES[r]; const bar = Math.floor(i / 4) % 2;
    const off = n.black ? (bar ? '#b0b1b6' : '#babbbf') : (bar ? '#d5d6da' : '#dde0e4');
    cells[r][i].style.background = g[r][i] || off;
    cells[r][i].style.boxShadow = g[r][i] ? 'inset 0 0 0 1px #0004' : '';
  };
  const soundAt = (p) => {
    for (let r = 0; r < NOTES; r++) if (g[r][p]) {
      const col = g[r][p];
      const ins = INST.find((x) => x.color === col) || inst;
      blip(midi(NOTE_NAMES[r].midi), 0.2, ins.wave, 0.07);
    }
  };
  const stop = () => { clearInterval(tid); tid = null; head.style.display = 'none'; playB.textContent = '▶ Play'; };
  const play = () => {
    audio(); if (tid) return;
    head.style.display = '';
    tid = setInterval(() => {
      pos = (pos + 1) % STEPS;
      head.style.left = pos * cellW + 'px';
      soundAt(pos);
      // autoscroll playhead into view
      const left = gridWrap.scrollLeft, view = gridWrap.clientWidth;
      const x = pos * cellW;
      if (x < left || x > left + view - 40) gridWrap.scrollLeft = Math.max(0, x - 80);
    }, 60000 / bpm / 4);
    playB.textContent = '■ Stop';
  };
  const playB = btn('▶ Play', () => (tid ? stop() : play()), 'pri');
  const toolSeg = seg([['draw', 'Draw'], ['erase', 'Erase']], tool, (v) => (tool = v));
  const top = h('div.k-row', {
    style: {
      height: '48px', padding: '0 12px', gap: '10px', background: 'linear-gradient(#f7f7f8,#e4e4e6)',
      borderBottom: '1px solid #b0b0b4', flexShrink: 0, fontSize: '13px',
    },
  },
    h('b', { style: { letterSpacing: '.02em' } }, 'Online Sequencer-ish'),
    playB,
    h('div', { style: { width: '160px' } }, slider('BPM', 60, 200, bpm, 1, (v) => { bpm = v; if (tid) { stop(); play(); } })),
    select(INST.map((x) => [x.id, x.label]), inst.id, (v) => { inst = INST.find((x) => x.id === v) || INST[0]; }),
    toolSeg,
    btn('Clear', () => { g.forEach((row, r) => row.forEach((_, i) => { g[r][i] = 0; paint(r, i); })); }),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: .55, fontSize: '12px' } }, 'click grid · Shift+click erase'),
  );
  const body = h('div', { style: { display: 'flex', flex: 1, minHeight: 0, borderTop: '1px solid #ccc' } }, keys, gridWrap);
  root.style.display = 'flex'; root.style.flexDirection = 'column';
  root.append(top, body);
  // seed a short motif
  const seed = [[0, 0], [4, 4], [7, 8], [12, 12], [7, 16], [4, 20], [0, 24], [4, 28]];
  seed.forEach(([n, s]) => { const r = NOTES - 1 - n; g[r][s] = INST[0].color; paint(r, s); });
  window.__demoProof = async () => {
    inst = INST[1];
    [[2, 2], [5, 6], [9, 10], [14, 14]].forEach(([n, s]) => { const r = NOTES - 1 - n; g[r][s] = inst.color; paint(r, s); });
    play(); await sleep(700); stop();
    return 'synth notes placed · playhead advanced to ' + pos;
  };
};

V['signal-midi-piano-roll-desk'] = (root, T) => {
  theme(root, T, { bg: '#1e1e22', fg: '#e6e6ea', panel: '#2a2a30', ac: '#5b8def', dark: true });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  const NOTES = 28, PX = 14, PY = 14;
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const noteOf = (r) => { const midiN = 72 - r; return { midi: midiN, name: names[midiN % 12] + Math.floor(midiN / 12 - 1), black: names[midiN % 12].includes('#') }; };
  const TRACKS = [
    { id: 0, name: 'Acoustic Grand Piano', emoji: '🎹', color: '#5b8def', wave: 'triangle' },
    { id: 1, name: 'Synth Lead', emoji: '🎛', color: '#c084fc', wave: 'sawtooth' },
    { id: 2, name: 'Electric Bass', emoji: '🎸', color: '#34d399', wave: 'square' },
  ];
  const STEPS = 64;
  const songs = TRACKS.map(() => []); // each: {r, start, len, vel}
  // seed track 0 motif
  [[16, 0, 2, 100], [12, 2, 2, 90], [9, 4, 2, 95], [7, 6, 4, 110], [9, 10, 2, 90], [12, 12, 2, 85], [16, 14, 4, 100]].forEach(([r, s, l, v]) => songs[0].push({ r, start: s, len: l, vel: v }));
  [[20, 0, 4, 80], [18, 8, 4, 75], [16, 16, 4, 80]].forEach(([r, s, l, v]) => songs[1].push({ r, start: s, len: l, vel: v }));
  [[24, 0, 4, 100], [24, 8, 4, 95], [21, 16, 4, 100]].forEach(([r, s, l, v]) => songs[2].push({ r, start: s, len: l, vel: v }));

  let track = 0, bpm = 120, pos = -1, tid = null, tool = 'draw', ctrl = 'velocity';
  let dragNote = null;

  const keys = h('div', { style: { width: '64px', flexShrink: 0, background: '#25252b', borderRight: '1px solid #0008' } });
  const gridWrap = h('div', { style: { overflow: 'auto', flex: 1, position: 'relative', background: '#1a1a1e' } });
  const gridEl = h('div', { style: { position: 'relative', width: STEPS * PX + 'px', height: NOTES * PY + 'px' } });
  const head = h('div', { style: { position: 'absolute', top: 0, bottom: 0, width: '2px', background: '#ff6b6b', left: 0, zIndex: 5, pointerEvents: 'none', display: 'none' } });
  const noteLayer = h('div', { style: { position: 'absolute', inset: 0, zIndex: 2 } });

  for (let r = 0; r < NOTES; r++) {
    const n = noteOf(r);
    keys.append(h('div', {
      style: {
        height: PY + 'px', boxSizing: 'border-box', borderBottom: '1px solid #0006',
        background: n.black ? '#111116' : '#f4f4f6', color: n.black ? '#ccc' : '#222',
        font: '10px/14px ui-monospace,monospace', paddingLeft: n.black ? '22px' : '6px', userSelect: 'none',
      },
    }, n.name));
    for (let i = 0; i < STEPS; i++) {
      const bar = Math.floor(i / 4) % 2;
      const c = h('div', {
        style: {
          position: 'absolute', left: i * PX + 'px', top: r * PY + 'px', width: PX + 'px', height: PY + 'px',
          boxSizing: 'border-box',
          borderRight: i % 4 === 0 ? '1px solid #ffffff18' : '1px solid #ffffff08',
          borderBottom: '1px solid #ffffff08',
          background: n.black ? (bar ? '#16161a' : '#1a1a1f') : (bar ? '#202026' : '#24242a'),
        },
      });
      gridEl.append(c);
    }
  }
  gridEl.append(noteLayer, head);
  gridWrap.append(gridEl);

  const timeLab = h('span', { style: { font: '600 12px ui-monospace,monospace', minWidth: '96px' } }, '0001:01:000');
  const trackLab = h('span', { style: { fontSize: '12px' } }, TRACKS[0].emoji + ' ' + TRACKS[0].name);

  const paintNotes = () => {
    noteLayer.replaceChildren();
    songs[track].forEach((note, idx) => {
      const el = h('div', {
        style: {
          position: 'absolute', left: note.start * PX + 'px', top: note.r * PY + 1 + 'px',
          width: note.len * PX - 2 + 'px', height: PY - 2 + 'px',
          background: TRACKS[track].color, borderRadius: '3px',
          boxShadow: 'inset 0 0 0 1px #ffffff33', cursor: 'pointer', opacity: 0.55 + note.vel / 280,
          zIndex: 3,
        },
      });
      el.onpointerdown = (e) => {
        e.stopPropagation();
        if (e.shiftKey || tool === 'erase') {
          songs[track].splice(idx, 1); paintNotes(); paintVel(); return;
        }
        dragNote = { note, mode: e.offsetX > el.clientWidth - 8 ? 'resize' : 'move', ox: e.clientX, start0: note.start, len0: note.len };
        el.setPointerCapture?.(e.pointerId);
      };
      noteLayer.append(el);
    });
  };

  gridEl.onpointerdown = (e) => {
    if (e.target !== gridEl && e.target.parentNode !== gridEl) return;
    const rect = gridEl.getBoundingClientRect();
    const x = e.clientX - rect.left + gridWrap.scrollLeft;
    const y = e.clientY - rect.top + gridWrap.scrollTop;
    const r = clamp(Math.floor(y / PY), 0, NOTES - 1);
    const s = clamp(Math.floor(x / PX), 0, STEPS - 1);
    if (tool === 'erase') {
      songs[track] = songs[track].filter((n) => !(n.r === r && s >= n.start && s < n.start + n.len));
      paintNotes(); paintVel(); return;
    }
    const note = { r, start: s, len: 2, vel: 100 };
    songs[track].push(note);
    blip(midi(noteOf(r).midi), 0.18, TRACKS[track].wave, 0.08);
    dragNote = { note, mode: 'resize', ox: e.clientX, start0: s, len0: 2 };
    paintNotes(); paintVel();
  };

  window.addEventListener('pointermove', (e) => {
    if (!dragNote) return;
    const dx = Math.round((e.clientX - dragNote.ox) / PX);
    if (dragNote.mode === 'move') {
      dragNote.note.start = clamp(dragNote.start0 + dx, 0, STEPS - 1);
    } else {
      dragNote.note.len = clamp(dragNote.len0 + dx, 1, STEPS - dragNote.note.start);
    }
    paintNotes(); paintVel();
  });
  window.addEventListener('pointerup', () => { dragNote = null; });

  const velWrap = h('div', { style: { height: '72px', position: 'relative', background: '#18181c', borderTop: '1px solid #0008', overflow: 'hidden' } });
  const paintVel = () => {
    velWrap.replaceChildren();
    if (ctrl !== 'velocity') {
      velWrap.append(h('div', { style: { padding: '20px', opacity: .4, fontSize: '12px' } }, ctrl.toUpperCase() + ' lane stub'));
      return;
    }
    const inner = h('div', { style: { position: 'relative', width: STEPS * PX + 'px', height: '100%' } });
    songs[track].forEach((note) => {
      const bar = h('div', {
        style: {
          position: 'absolute', left: note.start * PX + 'px', bottom: '4px',
          width: Math.max(4, note.len * PX - 4) + 'px', height: (note.vel / 127) * 56 + 'px',
          background: TRACKS[track].color + '99', borderRadius: '2px 2px 0 0', cursor: 'ns-resize',
        },
      });
      let y0, v0;
      bar.onpointerdown = (e) => {
        e.stopPropagation(); y0 = e.clientY; v0 = note.vel;
        const move = (ev) => { note.vel = clamp(v0 + (y0 - ev.clientY), 1, 127); paintVel(); paintNotes(); };
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      };
      inner.append(bar);
    });
    velWrap.append(inner);
    velWrap.scrollLeft = gridWrap.scrollLeft;
  };
  gridWrap.addEventListener('scroll', () => { velWrap.querySelector('div') && (velWrap.querySelector('div').parentElement.scrollLeft = gridWrap.scrollLeft); });

  const stop = () => { clearInterval(tid); tid = null; head.style.display = 'none'; playB.textContent = '▶'; };
  const soundAt = (p) => {
    songs[track].forEach((n) => {
      if (n.start === p) blip(midi(noteOf(n.r).midi), 0.12 + n.len * 0.04, TRACKS[track].wave, 0.04 + n.vel / 800);
    });
  };
  const play = () => {
    audio(); if (tid) return;
    head.style.display = '';
    tid = setInterval(() => {
      pos = (pos + 1) % STEPS;
      head.style.left = pos * PX + 'px';
      const bar = Math.floor(pos / 16) + 1;
      const beat = Math.floor((pos % 16) / 4) + 1;
      timeLab.textContent = String(bar).padStart(4, '0') + ':' + String(beat).padStart(2, '0') + ':000';
      soundAt(pos);
      const x = pos * PX, left = gridWrap.scrollLeft, view = gridWrap.clientWidth;
      if (x < left || x > left + view - 40) gridWrap.scrollLeft = Math.max(0, x - 80);
    }, 60000 / bpm / 4);
    playB.textContent = '■';
  };
  const playB = h('button', { style: { width: '36px', height: '28px', border: '1px solid #ffffff22', background: '#2a2a32', color: '#fff', borderRadius: '6px', cursor: 'pointer' }, onclick: () => (tid ? stop() : play()) }, '▶');

  const menu = h('div.k-row', {
    style: { height: '36px', padding: '0 12px', gap: '14px', background: '#25252b', borderBottom: '1px solid #0008', fontSize: '12px', flexShrink: 0 },
  },
    h('b', { style: { letterSpacing: '.06em', color: '#5b8def' } }, 'signal'),
    ...['File', 'Edit', 'Piano Roll', 'Arrange', 'Tempo', 'Settings'].map((m) => h('span', { style: { opacity: m === 'Piano Roll' ? 1 : .55, borderBottom: m === 'Piano Roll' ? '2px solid #5b8def' : '2px solid transparent', paddingBottom: '2px', cursor: 'default' } }, m)),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: .4 } }, 'Sign In'),
  );

  const toolbar = h('div.k-row', {
    style: { height: '44px', padding: '0 12px', gap: '10px', background: '#1e1e22', borderBottom: '1px solid #0008', flexShrink: 0, fontSize: '12px' },
  },
    playB, timeLab,
    h('div', { style: { width: '140px' } }, slider('BPM', 40, 240, bpm, 1, (v) => { bpm = v; if (tid) { stop(); play(); } })),
    trackLab,
    h('div.k-row', { style: { gap: '4px' } }, ...TRACKS.map((t) => h('button', {
      style: { border: track === t.id ? '1px solid ' + t.color : '1px solid #ffffff18', background: track === t.id ? t.color + '33' : '#2a2a30', color: '#eee', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px' },
      onclick: () => { track = t.id; trackLab.textContent = t.emoji + ' ' + t.name; paintNotes(); paintVel(); toolbar.querySelectorAll('button').forEach((b, i) => { if (i < 3) { b.style.border = (i === track) ? '1px solid ' + TRACKS[i].color : '1px solid #ffffff18'; b.style.background = (i === track) ? TRACKS[i].color + '33' : '#2a2a30'; } }); },
    }, t.emoji))),
    seg([['draw', 'Draw'], ['erase', 'Erase']], tool, (v) => (tool = v)),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: .4 } }, 'Pan 8 · Vel'),
  );

  const ctrlTabs = h('div.k-row', { style: { height: '28px', padding: '0 10px', gap: '10px', background: '#222228', borderTop: '1px solid #0008', fontSize: '11px', flexShrink: 0 } },
    ...['velocity', 'pitch', 'volume', 'pan', 'expression'].map((c) => h('button', {
      style: { background: 'transparent', border: 0, color: ctrl === c ? '#5b8def' : '#888', borderBottom: ctrl === c ? '2px solid #5b8def' : '2px solid transparent', cursor: 'pointer', textTransform: 'capitalize', padding: '4px 2px' },
      onclick: (e) => { ctrl = c; [...e.target.parentNode.children].forEach((b) => { b.style.color = '#888'; b.style.borderBottom = '2px solid transparent'; }); e.target.style.color = '#5b8def'; e.target.style.borderBottom = '2px solid #5b8def'; paintVel(); },
    }, c.replace('pitch', 'Pitch Bend').replace('velocity', 'Velocity').replace('volume', 'Volume').replace('pan', 'Pan').replace('expression', 'Expression'))),
  );

  const body = h('div', { style: { display: 'flex', flex: 1, minHeight: 0 } }, keys, gridWrap);
  root.style.display = 'flex'; root.style.flexDirection = 'column';
  root.append(menu, toolbar, body, ctrlTabs, velWrap);
  paintNotes(); paintVel();

  window.__demoProof = async () => {
    track = 0; paintNotes(); paintVel();
    songs[0].push({ r: 4, start: 20, len: 3, vel: 120 });
    paintNotes(); paintVel();
    play(); await sleep(700); stop();
    songs[0].pop(); paintNotes(); paintVel();
    return 'note painted · playhead to ' + pos + ' · restored';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['music-grid-sequencer'])(root, T); }
