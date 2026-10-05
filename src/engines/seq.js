import '@fontsource-variable/inter';
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

V['fontbox-typo-sequencer'] = (root, T) => {
  theme(root, T, { bg: '#faf8f4', fg: '#1a1a1a', panel: '#f1e3c0', ac: '#62B6FF', dark: false });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter Variable', system-ui, sans-serif";
  root.style.display = 'flex';
  root.style.padding = '12px';
  root.style.gap = '10px';
  root.style.background = '#faf8f4';
  css(`.fb-cell{cursor:pointer;transition:transform .12s}.fb-pulse{transform:scale(1.12)}`);

  const FONTS = ["Georgia,serif", "'Courier New',monospace", "Impact,sans-serif", "'Comic Sans MS',cursive", "system-ui", "'Times New Roman',serif", "Verdana,sans-serif", "'Trebuchet MS',sans-serif"];
  const COLORS = ['#ff8a3d', '#e33059', '#8e4cf0', '#2cc36b', '#1d8af8', '#fdb827', '#ff5c8a', '#15b7a8', '#5d5cf5', '#fc8a28'];
  const PRESETS = ['CHOIR', 'TYPEWRITER', 'BOUNCE', 'WHISPER', 'SHOUT'];

  let text = 'FOnt box';
  let stepMs = 250;
  let dir = 1;
  let ping = 1;
  let playing = false;
  let pos = -1;
  let tid = null;
  let preset = 0;
  let fontSize = 72;
  let tracking = 8;
  let glyphs = [];

  const chunkBtn = (label, on) => h('button', {
    style: {
      border: '2px solid #1a1a1a', background: '#fff', color: '#1a1a1a',
      padding: '6px 8px', fontWeight: 700, fontSize: '11px', cursor: 'pointer', borderRadius: '2px',
    },
    onclick: on,
  }, label);

  const section = (title, bg, ...kids) => h('div', {
    style: { border: '2.5px solid #1a1a1a', background: '#fff', marginBottom: '8px' },
  },
    h('div', {
      style: {
        background: bg, borderBottom: '2.5px solid #1a1a1a',
        padding: '6px 10px', fontWeight: 800, fontSize: '11px', letterSpacing: '.08em',
      },
    }, title),
    h('div', { style: { padding: '10px', display: 'grid', gap: '8px' } }, ...kids),
  );

  const stage = h('div', {
    style: {
      flex: 1, minWidth: 0, border: '3px solid #1a1a1a', background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexWrap: 'wrap', gap: tracking + 'px', padding: '40px', overflow: 'hidden',
    },
  });

  const seqGrid = h('div', {
    style: {
      display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: '6px',
      minHeight: '90px', background: '#e8dcc0', border: '2px solid #1a1a1a', padding: '10px',
    },
  });

  const paintStage = () => {
    stage.replaceChildren(...glyphs.map((g, i) => {
      if (g.ch === ' ') return h('span', { style: { width: (fontSize * 0.35) + 'px' } });
      const el = h('span.fb-cell', {
        style: {
          fontFamily: g.font, color: g.color,
          fontSize: (fontSize * g.size) + 'px', fontWeight: 700,
          userSelect: 'none', padding: '2px 4px', borderRadius: '4px',
          outline: i === pos ? '3px solid #1a1a1a' : '',
          background: i === pos ? '#ffc83d55' : 'transparent',
        },
        onclick: () => {
          audio();
          blip(midi(g.note), 0.22, i % 2 ? 'triangle' : 'sine', 0.14);
          pos = i; paintStage(); paintSeq();
        },
      }, g.ch);
      if (i === pos) el.classList.add('fb-pulse');
      return el;
    }));
  };

  const paintSeq = () => {
    seqGrid.replaceChildren(...glyphs.filter((g) => g.ch !== ' ').map((g) => {
      const realI = glyphs.indexOf(g);
      return h('div.fb-cell', {
        style: {
          aspectRatio: '1', border: '2px solid #1a1a1a', background: g.on ? g.color : '#fff',
          display: 'grid', placeItems: 'center', fontFamily: g.font, fontWeight: 800,
          fontSize: '16px', color: '#1a1a1a',
          outline: realI === pos ? '3px solid #1a1a1a' : '',
          transform: realI === pos ? 'scale(1.08)' : '',
        },
        onclick: () => {
          g.on = !g.on;
          audio();
          if (g.on) blip(midi(g.note), 0.18, 'square', 0.1);
          paintSeq(); paintStage();
        },
      }, g.ch);
    }));
  };

  const rebuild = () => {
    glyphs = [...text].map((ch, i) => ({
      ch,
      font: FONTS[i % FONTS.length],
      color: COLORS[i % COLORS.length],
      size: 0.7 + (i % 5) * 0.12,
      note: 60 + (i % 8) * 2,
      on: ch !== ' ',
    }));
    paintStage();
    paintSeq();
  };

  const stop = () => { clearInterval(tid); tid = null; playing = false; playBtn.textContent = '▶ Play'; };
  const tick = () => {
    const active = glyphs.map((g, i) => ({ g, i })).filter((x) => x.g.ch !== ' ' && x.g.on);
    if (!active.length) return;
    let next;
    if (dir === 0) {
      const cur = active.findIndex((x) => x.i === pos);
      let ni = (cur < 0 ? 0 : cur) + ping;
      if (ni < 0 || ni >= active.length) { ping *= -1; ni = (cur < 0 ? 0 : cur) + ping; }
      next = active[clamp(ni, 0, active.length - 1)];
    } else {
      const cur = active.findIndex((x) => x.i === pos);
      const ni = ((cur < 0 ? -1 : cur) + dir + active.length * 8) % active.length;
      next = active[ni];
    }
    pos = next.i;
    const g = next.g;
    g.size = 0.65 + Math.random() * 0.5;
    g.font = FONTS[Math.floor(Math.random() * FONTS.length)];
    blip(midi(g.note), 0.2, pos % 3 === 0 ? 'triangle' : 'sine', 0.12);
    paintStage(); paintSeq();
  };
  const play = () => {
    audio();
    if (playing) { stop(); return; }
    playing = true;
    playBtn.textContent = '❚❚ Pause';
    tid = setInterval(tick, stepMs);
  };

  const inputEl = h('input', {
    value: text, placeholder: 'Type here!',
    style: {
      width: '100%', boxSizing: 'border-box', border: '2.5px solid #1a1a1a',
      padding: '10px 12px', fontSize: '14px', fontWeight: 600, background: '#fff',
    },
    oninput: (e) => { text = e.target.value || ' '; rebuild(); },
  });

  const playBtn = chunkBtn('▶ Play', play);
  const presetLab = h('button', {
    style: { flex: 1, border: '2px solid #1a1a1a', background: '#fff', fontWeight: 800, padding: '6px', cursor: 'pointer' },
    onclick: () => {
      const p = PRESETS[preset];
      if (p === 'CHOIR') glyphs.forEach((g, i) => { g.note = 60 + (i % 5); g.size = 0.9; });
      if (p === 'TYPEWRITER') glyphs.forEach((g) => { g.font = "'Courier New',monospace"; g.size = 0.85; });
      if (p === 'BOUNCE') glyphs.forEach((g, i) => { g.size = 0.55 + (i % 3) * 0.25; });
      if (p === 'WHISPER') glyphs.forEach((g) => { g.note = 72 + (g.note % 5); g.size = 0.55; });
      if (p === 'SHOUT') glyphs.forEach((g) => { g.note = 48 + (g.note % 7); g.size = 1.15; });
      paintStage(); paintSeq(); toast(p);
    },
  }, PRESETS[0]);

  const side = h('div', {
    style: { width: '300px', flexShrink: 0, overflow: 'auto', maxHeight: '100%' },
  },
    section('INPUT', '#62B6FF', inputEl),
    section('SEQUENCER', '#DCD0B4',
      h('div.k-row', { style: { gap: '4px', flexWrap: 'wrap' } },
        chunkBtn('Set All', () => { glyphs.forEach((g) => { if (g.ch !== ' ') g.on = true; }); paintSeq(); }),
        chunkBtn('Rando', () => {
          glyphs.forEach((g) => {
            g.font = FONTS[Math.floor(Math.random() * FONTS.length)];
            g.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            g.size = 0.6 + Math.random() * 0.6;
            g.note = 55 + Math.floor(Math.random() * 24);
          });
          paintStage(); paintSeq();
        }),
        chunkBtn('Font', () => { glyphs.forEach((g) => { g.font = FONTS[(FONTS.indexOf(g.font) + 1) % FONTS.length]; }); paintStage(); paintSeq(); }),
        chunkBtn('Pulse', () => { glyphs.forEach((g) => { g.size = 0.7 + Math.random() * 0.5; }); paintStage(); }),
      ),
      h('div.k-row', { style: { gap: '8px', alignItems: 'center', fontSize: '12px', fontWeight: 700 } },
        'Time (MS)',
        h('input', {
          type: 'number', value: stepMs, min: 80, max: 800, step: 10,
          style: { width: '72px', border: '2px solid #1a1a1a', padding: '4px 6px', fontWeight: 700 },
          oninput: (e) => {
            stepMs = clamp(+e.target.value || 250, 80, 800);
            if (playing) { stop(); play(); }
          },
        }),
      ),
      seqGrid,
    ),
    section('TRANSPORT', '#FFC1C1',
      h('div.k-row', { style: { gap: '6px' } },
        chunkBtn('◀◀ Rev', () => { dir = -1; }),
        chunkBtn('↔ Ping', () => { dir = 0; ping = 1; }),
        chunkBtn('▶▶ Fwd', () => { dir = 1; }),
      ),
      playBtn,
    ),
    section('PRESETS', '#C6F0D2',
      h('div.k-row', { style: { gap: '6px' } },
        chunkBtn('◀', () => { preset = (preset - 1 + PRESETS.length) % PRESETS.length; presetLab.textContent = PRESETS[preset]; }),
        presetLab,
        chunkBtn('▶', () => { preset = (preset + 1) % PRESETS.length; presetLab.textContent = PRESETS[preset]; }),
      ),
    ),
    section('SETTINGS', '#E2D5F2',
      h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } },
        chunkBtn('Font −', () => { fontSize = clamp(fontSize - 6, 28, 140); paintStage(); }),
        chunkBtn('Font +', () => { fontSize = clamp(fontSize + 6, 28, 140); paintStage(); }),
        chunkBtn('Track −', () => { tracking = clamp(tracking - 2, 0, 24); stage.style.gap = tracking + 'px'; }),
        chunkBtn('Track +', () => { tracking = clamp(tracking + 2, 0, 24); stage.style.gap = tracking + 'px'; }),
      ),
    ),
    section('FONTBOX', '#FF954D',
      h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } },
        chunkBtn('INFO + CREDITS', () => toast('Design + Code · Gabriel Drozdov')),
        chunkBtn('MORE PROJECTS', () => toast('barcoloudly.com')),
        chunkBtn('GO FULLSCREEN', () => toast('fullscreen (demo)')),
      ),
    ),
  );

  root.append(stage, side);
  rebuild();

  window.__demoProof = async () => {
    const prev = text;
    text = 'Fontbox'; inputEl.value = text; rebuild();
    play(); await sleep(700); stop();
    pos = -1; text = prev; inputEl.value = text; rebuild();
    return 'typed Fontbox · sequencer advanced · restored';
  };
};

V['drumbit-step-sequencer-drum-machine'] = (root, T) => {
  theme(root, T, { bg: '#151515', fg: '#cfcfcf', ac: '#3cc6c6', dark: true });
  const TEAL = '#3cc6c6', SANS = "'Inter Variable',Helvetica,Arial,sans-serif";
  const ROWS = ['crash', 'high tom', 'medium tom', 'low tom', 'open hihat', 'closed Hihat', 'snare', 'kick'], RC = ['#e3c65b', '#8f6fd6', '#7b8fe0', '#5aa0d8', '#3cc6c6', '#43d39b', '#e2567a', '#ee8a3b'];
  Object.assign(root.style, { fontFamily: SANS, overflow: 'auto', background: 'radial-gradient(circle at 50% 50%, #000 1.6px, transparent 2.2px) 0 0/7px 7px, radial-gradient(circle at 50% 50%, #000 1.6px, transparent 2.2px) 3.5px 3.5px/7px 7px, linear-gradient(#2a2a2a,#1c1c1c)', color: '#cfcfcf' });
  root.append(h('style', {}, `.db-pad{width:100%;aspect-ratio:1;border-radius:4px;background:#1b1b1b;box-shadow:inset 0 1px 2px #000a,0 1px 0 #ffffff0d;cursor:pointer;transition:background .06s,box-shadow .06s}.db-pad.on{box-shadow:inset 0 0 0 1px #ffffff40,0 0 10px var(--c)}.db-col{background:#2a2a2a}.db-col.on{filter:brightness(1.45)}.db-r input[type=range],.db-ctl input[type=range]{accent-color:${TEAL};height:14px}.db-sel{background:#2b2b2b;color:#ddd;border:1px solid #111;border-radius:3px;padding:6px 8px;font:12px ${SANS};box-shadow:0 1px 0 #ffffff12}.db-ib{background:#2b2b2b;color:#ddd;border:1px solid #111;border-radius:3px;width:32px;height:26px;font-size:13px;cursor:pointer;box-shadow:0 1px 0 #ffffff12}.db-ib.on{background:#b5243c;color:#fff}.db-tab{white-space:nowrap;background:#2b2b2b;color:#bbb;border:1px solid #111;border-radius:3px;padding:3px 8px;font:11px ${SANS};cursor:pointer}.db-tab.on{color:#fff;border-color:${TEAL}}.db-n{color:${TEAL};font-size:10px;text-align:center}`));
  const DEMOS = {
    Rock: ['x...............', '..............x.', '............x...', '..........x.....', '', 'x.x.x.x.x.x.x.x.', '....x.......x...', 'x.......x.x.....'],
    Funk: ['', '', '', '', '..........x.....', 'x.xxx.x.x.x.xxx.', '....x..x.x..x..x', 'x.x...x...x..x..'],
    'Bossa Nova': ['', '', '', '', '', 'xxxxxxxxxxxxxxxx', 'x..x..x...x..x..', 'x..xx..xx..xx..x'],
    'Hip-Hop': ['x...............', '', '', '', '......x.......x.', 'x.x.x.x.x.x.x...', '....x.......x...', 'x......x.xx.....'],
    House: ['x...............', '', '', '', '..x...x...x...x.', 'x...x...x...x...', '....x.......x...', 'x...x...x...x...'] };
  const empty = () => ROWS.map(() => Array(16).fill(0));
  const KEY = 'drumbit-ish-v1';
  let S = { slots: [empty(), empty(), empty(), empty()], slot: 0, bpm: 80, swing: 0, vol: 0.7, rv: ROWS.map(() => 0.8), rp: ROWS.map(() => 0.5), pan: ROWS.map(() => 0), low: false, high: false, comp: false, kit: 'Kit 1' };
  try { const j = JSON.parse(localStorage.getItem(KEY)); if (j?.slots) S = { ...S, ...j }; } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
  let clip = null, pos = -1, tid = null, panMode = false, filt = 1;
  const G = () => S.slots[S.slot];
  // ---- audio graph
  let master, lp, hp, comp;
  const graph = () => { const ac = audio(); if (!ac) return null; if (!master) { master = ac.createGain(); lp = ac.createBiquadFilter(); lp.type = 'lowpass'; hp = ac.createBiquadFilter(); hp.type = 'highpass'; comp = ac.createDynamicsCompressor(); master.connect(lp).connect(hp).connect(comp).connect(ac.destination); } master.gain.value = S.vol; lp.frequency.value = S.low ? 300 + 2200 * filt : 20000; hp.frequency.value = S.high ? 200 + 2400 * (1 - filt) : 10; comp.threshold.value = S.comp ? -28 : 0; comp.ratio.value = S.comp ? 8 : 1; return ac; };
  const voice = (r, when = 0) => {
    const ac = graph(); if (!ac) return; const t = ac.currentTime + when, pitch = 0.5 + S.rp[r] * 1.0, kit2 = S.kit === 'Kit 2' ? 0.8 : 1;
    const g = ac.createGain(); const pn = ac.createStereoPanner ? ac.createStereoPanner() : null; if (pn) { pn.pan.value = S.pan[r]; g.connect(pn).connect(master); } else g.connect(master);
    const vol = S.rv[r];
    const noise = (len, type, f, gain, dec) => { const b = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const src = ac.createBufferSource(); src.buffer = b; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.value = f * pitch; const gg = ac.createGain(); gg.gain.setValueAtTime(gain * vol, t); gg.gain.exponentialRampToValueAtTime(0.001, t + dec); src.connect(fl).connect(gg).connect(g); src.start(t); src.stop(t + len); };
    const tone = (f0, f1, dec, gain, type = 'sine') => { const o = ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0 * pitch * kit2, t); o.frequency.exponentialRampToValueAtTime(f1 * pitch * kit2, t + dec * 0.6); const gg = ac.createGain(); gg.gain.setValueAtTime(gain * vol, t); gg.gain.exponentialRampToValueAtTime(0.001, t + dec); o.connect(gg).connect(g); o.start(t); o.stop(t + dec + 0.05); };
    [() => noise(1.4, 'highpass', 5000, 0.25, 1.3), () => tone(300, 180, 0.35, 0.5), () => tone(220, 130, 0.4, 0.5), () => tone(150, 85, 0.45, 0.55), () => noise(0.5, 'highpass', 7500, 0.22, 0.45), () => noise(0.08, 'highpass', 8000, 0.25, 0.06), () => { noise(0.22, 'bandpass', 1800, 0.45, 0.2); tone(220, 160, 0.1, 0.25, 'triangle'); }, () => tone(150, 42, 0.38, 0.9)][r]();
    hits[r] = 1;
  };
  // ---- grid
  const pads = ROWS.map(() => []);
  const gridEl = h('div', { style: { display: 'grid', gridTemplateColumns: '80px repeat(16, 1fr) 128px', columnGap: '4px', rowGap: '4px', alignItems: 'center' } });
  let paint = null;
  window.addEventListener('pointerup', () => (paint = null));
  gridEl.append(h('div'), ...Array.from({ length: 16 }, (_, i) => h('div.db-n', {}, i % 4 === 0 ? String(i / 4 + 1) : '')), h('div'));
  const sliders = [];
  ROWS.forEach((name, r) => {
    gridEl.append(h('div', { style: { fontSize: '11px', textAlign: 'right', paddingRight: '8px', color: '#bbb' } }, name));
    for (let c = 0; c < 16; c++) { const p = h('div.db-pad', { style: { '--c': RC[r] } }); p.style.setProperty('--c', RC[r]); const set = (v) => { G()[r][c] = v; drawPad(r, c); save(); };
      p.addEventListener('pointerdown', (e) => { e.preventDefault(); paint = G()[r][c] ? 0 : 1; set(paint); if (paint) voice(r); });
      p.addEventListener('pointerenter', () => { if (paint != null) set(paint); });
      pads[r].push(p); gridEl.append(p); }
    const a = h('input', { type: 'range', min: 0, max: 1, step: 0.01, style: { width: '62px' } }), b = h('input', { type: 'range', min: 0, max: 1, step: 0.01, style: { width: '52px' } });
    a.value = S.rv[r]; a.oninput = () => { S.rv[r] = +a.value; save(); };
    b.oninput = () => { if (panMode) S.pan[r] = +b.value * 2 - 1; else S.rp[r] = +b.value; save(); };
    sliders.push(b); gridEl.append(h('div.db-r', { style: { display: 'flex', gap: '6px', paddingLeft: '10px' } }, a, b));
  });
  const botLab = h('span', {}, 'Pitch');
  gridEl.append(h('div'), ...Array.from({ length: 16 }, (_, i) => h('div.db-n', {}, String(i + 1))), h('div', { style: { display: 'flex', gap: '22px', paddingLeft: '18px', fontSize: '10px', color: '#aaa' } }, h('span', {}, 'Volume'), botLab));
  const syncSliders = () => sliders.forEach((b, r) => (b.value = panMode ? (S.pan[r] + 1) / 2 : S.rp[r]));
  const drawPad = (r, c) => { const p = pads[r][c], on = G()[r][c]; p.classList.toggle('on', !!on); p.style.background = on ? RC[r] : c === pos ? '#2c2c2c' : (Math.floor(c / 4) % 2 ? '#1b1b1b' : '#202020'); p.style.filter = c === pos ? 'brightness(1.5)' : ''; };
  const drawAll = () => { for (let r = 0; r < ROWS.length; r++) for (let c = 0; c < 16; c++) drawPad(r, c); slotBs.forEach((b, i) => b.classList.toggle('on', i === S.slot)); };
  // ---- transport
  const stepMs = () => 60000 / S.bpm / 4;
  const tick = () => { const prev = pos; pos = (pos + 1) % 16; const sw = pos % 2 ? (S.swing * stepMs()) / 1000 * 0.5 : 0; G().forEach((row, r) => row[pos] && voice(r, sw)); for (let r = 0; r < ROWS.length; r++) { if (prev >= 0) drawPad(r, prev); drawPad(r, pos); } };
  const play = () => { if (tid) return; graph(); tid = setInterval(tick, stepMs()); playB.textContent = '■'; playB.classList.add('on'); };
  const stop = () => { clearInterval(tid); tid = null; const pv = pos; pos = -1; if (pv >= 0) for (let r = 0; r < ROWS.length; r++) drawPad(r, pv); playB.textContent = '▶'; playB.classList.remove('on'); };
  const retime = () => { if (tid) { clearInterval(tid); tid = setInterval(tick, stepMs()); } };
  const onKey = (e) => { if (!root.isConnected) return window.removeEventListener('keydown', onKey); if (e.code === 'Space' && !/INPUT|SELECT/.test(e.target.tagName)) { e.preventDefault(); tid ? stop() : play(); } };
  window.addEventListener('keydown', onKey);
  // ---- controls
  const rng = (v, on, w = '186px') => { const i = h('input', { type: 'range', min: 0, max: 1, step: 0.01, style: { width: w } }); i.value = v; i.oninput = () => on(+i.value); return i; };
  const bpmIn = h('input', { type: 'number', min: 40, max: 240, value: S.bpm, style: { width: '46px', background: '#1d1d1d', color: '#eee', border: '1px solid #111', borderRadius: '3px', padding: '3px 4px', font: `12px ${SANS}` }, oninput: (e) => { S.bpm = clamp(+e.target.value || 80, 40, 240); retime(); save(); } });
  const sel = (opts, v, on) => { const s2 = h('select.db-sel', { onchange: (e) => on(e.target.value) }, opts.map((o) => h('option', { value: o, selected: o === v }, o))); return s2; };
  const demoSel = sel(['No Demo', ...Object.keys(DEMOS)], 'No Demo', (v) => loadDemo(v));
  const loadDemo = (v) => { if (!DEMOS[v]) return; S.slots[S.slot] = DEMOS[v].map((str) => Array.from({ length: 16 }, (_, i) => (str[i] === 'x' ? 1 : 0))); S.bpm = { Rock: 96, Funk: 100, 'Bossa Nova': 128, 'Hip-Hop': 88, House: 124 }[v]; bpmIn.value = S.bpm; retime(); save(); drawAll(); toast(`Demo loaded: ${v}`); };
  const chk = (label, k) => h('label', { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#aaa', cursor: 'pointer', whiteSpace: 'nowrap' } }, h('input', { type: 'checkbox', checked: !!S[k], onchange: (e) => { S[k] = e.target.checked; graph(); save(); } }), label);
  const leftCtl = h('div.db-ctl', { style: { display: 'grid', gap: '10px', alignContent: 'start' } },
    h('div', { style: { fontSize: '12px' } }, '🔊 Master volume', h('div', {}, rng(S.vol, (v) => { S.vol = v; graph(); save(); }))),
    h('div', { style: { display: 'flex', gap: '22px' } }, h('div', { style: { fontSize: '12px' } }, '♩ Tempo', h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px', fontSize: '12px' } }, bpmIn, 'bpm')), h('div', { style: { fontSize: '12px' } }, 'Swing', h('div', { style: { marginTop: '6px' } }, rng(S.swing, (v) => { S.swing = v; save(); }, '96px')))),
    h('div', { style: { display: 'flex', gap: '6px' } }, sel(['Kit 1', 'Kit 2'], S.kit, (v) => { S.kit = v; save(); }), sel(['No Effect', 'Low Pass', 'High Pass'], 'No Effect', (v) => { S.low = v === 'Low Pass'; S.high = v === 'High Pass'; graph(); })),
    h('div', { style: { display: 'flex', gap: '10px', alignItems: 'start' } }, demoSel, h('div', { style: { display: 'grid', gap: '3px' } }, h('div', { style: { display: 'flex', gap: '8px' } }, chk('Low', 'low'), chk('High Pass', 'high')), chk('Compressor', 'comp'))));
  // display screen (visualizer)
  const cv = h('canvas', { width: 480, height: 230, style: { width: '100%', height: '100%', display: 'block' } });
  const hits = ROWS.map(() => 0);
  const screen = h('div', { style: { background: '#1c1c1c', borderRadius: '6px', boxShadow: 'inset 0 2px 8px #000', height: '140px', position: 'relative', overflow: 'hidden' } }, cv, h('div', { style: { position: 'absolute', top: '8px', right: '10px', display: 'flex', gap: '5px' } }, ...['#2aa198', '#6c4f8c', '#7d7a2c', '#d33a5a'].map((c) => h('span', { style: { width: '12px', height: '5px', borderRadius: '3px', background: c } }))));
  const tabs = [['⇆ Panning', () => { panMode = !panMode; botLab.textContent = panMode ? 'Pan' : 'Pitch'; syncSliders(); return panMode; }], ['⏷ Filters', () => { const on = !(S.low || S.high); S.low = on; graph(); return on; }], ['⚙ Preferences', () => { toast('Preferences saved to this browser'); return false; }], ['? Help', () => { toast('Click/drag pads · Space = play/stop · slots 1–4 · copy/paste'); return false; }]].map(([t, fn]) => { const b = h('button.db-tab', { onclick: () => b.classList.toggle('on', fn()) }, t); return b; });
  const mid = h('div', { style: { display: 'grid', gap: '6px' } }, screen, h('div', { style: { display: 'flex', gap: '4px', justifyContent: 'center' } }, ...tabs));
  const playB = h('button.db-ib', { onclick: () => (tid ? stop() : play()) }, '▶');
  const slotBs = [0, 1, 2, 3].map((i) => h('button.db-ib', { onclick: () => { S.slot = i; save(); drawAll(); } }, String(i + 1)));
  const tools = [['📂', () => { demoSel.value = 'Rock'; loadDemo('Rock'); }, 'Load'], ['⧉', () => { clip = G().map((r) => [...r]); toast(`Pattern ${S.slot + 1} copied`); }, 'Copy'], ['📋', () => { if (!clip) return toast('Copy a pattern first'); S.slots[S.slot] = clip.map((r) => [...r]); save(); drawAll(); toast(`Pasted into pattern ${S.slot + 1}`); }, 'Paste'], ['↺', () => { S.slots[S.slot] = empty(); save(); drawAll(); }, 'Clear'], ['●', () => toast('Recording… tap pads live while playing'), 'Rec']].map(([ic, fn, t]) => h('button.db-ib', { onclick: fn, title: t }, ic));
  const rightCtl = h('div', { style: { display: 'grid', gap: '10px', justifyItems: 'end', alignContent: 'start' } }, h('div', { style: { textAlign: 'right' } }, h('div', { style: { color: TEAL, fontSize: '34px', fontWeight: 300, letterSpacing: '-.5px', lineHeight: 1, whiteSpace: 'nowrap' } }, 'drumbit', h('span', { style: { fontSize: '15px', opacity: .7 } }, '-ish')), h('div', { style: { fontSize: '11px', color: '#aaa' } }, 'online drum machine')), h('div', { style: { display: 'flex', gap: '4px' } }, ...tools), h('div', { style: { display: 'flex', gap: '4px' } }, ...slotBs, playB));
  const machine = h('div', { style: { background: 'linear-gradient(#3b3b3b,#333)', borderRadius: '10px', padding: '16px 18px 18px', boxShadow: '0 10px 40px #000c, inset 0 1px 0 #ffffff14', width: '720px', display: 'grid', gap: '16px' } }, h('div', { style: { display: 'grid', gridTemplateColumns: '236px 1fr 160px', gap: '14px' } }, leftCtl, mid, rightCtl), gridEl);
  const top = h('div', { style: { display: 'flex', alignItems: 'center', padding: '10px 18px', gap: '26px' } }, h('div', {}, h('div', { style: { color: TEAL, fontSize: '28px', fontWeight: 300, lineHeight: 1 } }, 'drumbit'), h('div', { style: { fontSize: '9px', color: '#999', marginLeft: '20px' } }, 'online drum machine')), h('div', { style: { flex: 1, display: 'flex', justifyContent: 'center', gap: '22px', fontSize: '12.5px', color: '#bbb' } }, ...['♡ Give back', '⌨ Shortcuts', '👥 Club', 'ⓘ About', '? Help Page'].map((x) => h('span', {}, x))), h('div', { style: { width: '120px' } }));
  root.append(top, h('div', { style: { display: 'flex', justifyContent: 'center', padding: '6px 0 16px' } }, machine), h('div', { style: { textAlign: 'center', fontSize: '11.5px', color: '#999', paddingBottom: '20px' } }, 'Space = play/stop · drag across pads to paint · state is saved in localStorage', h('br'), '© drumbit-ish — a practice clone of drumbit by João Santos'));
  syncSliders(); drawAll();
  // visualizer loop
  const ctx = cv.getContext('2d'); let lev = ROWS.map(() => 0);
  const loop = () => { if (!root.isConnected) return; ctx.clearRect(0, 0, 480, 230); const bw = 480 / ROWS.length; ROWS.forEach((_, r) => { lev[r] = Math.max(lev[r] * 0.9, hits[r]); hits[r] = 0; const hh = lev[r] * 170; const g = ctx.createLinearGradient(0, 230, 0, 230 - hh); g.addColorStop(0, RC[r] + '22'); g.addColorStop(1, RC[r]); ctx.fillStyle = g; ctx.fillRect(r * bw + 10, 220 - hh, bw - 20, hh); }); ctx.fillStyle = '#ffffff55'; ctx.font = '13px monospace'; ctx.fillText(`${tid ? '▶ PLAY' : '■ STOP'}  ${S.bpm} BPM  P${S.slot + 1}  step ${pos < 0 ? '--' : String(pos + 1).padStart(2, '0')}/16`, 14, 26); requestAnimationFrame(loop); };
  loop();
  window.__demoProof = async () => { S.slot = 0; demoSel.value = 'Funk'; loadDemo('Funk'); tools[1].click(); slotBs[1].click(); tools[2].click(); const pasted = G().flat().filter(Boolean).length; play(); await sleep(1300); const at = pos; return `loaded Funk demo, copied pattern 1 → pasted into slot 2 (${pasted} steps), playing at ${S.bpm} BPM, playhead at step ${at + 1}`; };
};
export function mount(root, variant, opts, T) { (V[variant] || V['music-grid-sequencer'])(root, T); }
