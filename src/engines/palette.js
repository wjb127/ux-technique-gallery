import { h, s, css, copy, toast, sleep, clamp, hsl, hexToRgb, rgbToHex, oklchToHex, hexToOklch, contrast, randHex, rgbToHsl, pick } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle, codebox } from '../kit.js';
css(`.pl-col{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:70px;gap:14px;transition:background .25s;position:relative}
.pl-col b{font:700 30px/1 'Inter Variable';letter-spacing:.02em}.pl-col .ic{opacity:0;display:grid;gap:10px;transition:.2s}.pl-col:hover .ic,.pl-col .ic.show{opacity:1}
.pl-col .ic button{background:transparent;border:0;font-size:18px;cursor:pointer;color:inherit}`);
const fgOn = (hex) => (contrast(hex, '#ffffff') > contrast(hex, '#111111') ? '#ffffff' : '#111111');
function harmony(base, n = 5, mode = 'analogous') { const [H, S, L] = rgbToHsl(...hexToRgb(base)); return Array.from({ length: n }, (_, i) => hsl((H + (mode === 'analogous' ? (i - 2) * 22 : i * 72) + 360) % 360, clamp(S + (Math.random() - 0.5) * 30, 20, 90), clamp(20 + i * 15 + (Math.random() - 0.5) * 12, 12, 92))); }
const ramp = (hex) => { const [L, C, H] = hexToOklch(hex); const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]; const Ls = [0.97, 0.94, 0.88, 0.8, 0.7, 0.62, 0.53, 0.45, 0.38, 0.32, 0.24]; return stops.map((st, i) => [st, oklchToHex(Ls[i], C * (1 - Math.abs(i - 5) / 9), H)]); };
const V = {};
V['palette-lock-export'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', ac: '#0066ff', dark: false });
  let cols = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'].map((c) => ({ c, lock: false }));
  const row = h('div', { style: { position: 'absolute', inset: '60px 0 0 0', display: 'flex' } });
  const draw = () => row.replaceChildren(...cols.map((o, i) => { const f = fgOn(o.c); return h('div.pl-col', { style: { background: o.c, color: f } }, h('div.ic', { class: o.lock ? 'ic show' : 'ic' }, h('button', { title: 'Remove', onclick: () => { cols.splice(i, 1); draw(); } }, '✕'), h('button', { title: 'Copy', onclick: () => copy(o.c, 'Hex copied') }, '⧉'), h('button', { title: 'Lock', onclick: () => { o.lock = !o.lock; draw(); } }, o.lock ? '🔒' : '🔓')), h('b', {}, o.c.slice(1).toUpperCase()), h('span', { style: { opacity: .7, fontSize: '13px' } }, ['Charcoal', 'Persian Green', 'Saffron', 'Sandy Brown', 'Burnt Sienna', 'Tint', 'Shade'][i % 7])); }));
  const gen = () => { const base = randHex(); const nw = harmony(base, cols.length); cols = cols.map((o, i) => (o.lock ? o : { c: nw[i], lock: false })); draw(); };
  window.addEventListener('keydown', (e) => { if (e.code === 'Space') { e.preventDefault(); gen(); } });
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '60px', borderBottom: '1px solid #eee', padding: '0 20px', gap: '18px' } }, h('b', { style: { fontSize: '22px', color: '#0066ff' } }, 'coolors-ish'), h('span', { style: { color: '#666' } }, 'Press the spacebar to generate color palettes!'), h('span', { style: { flex: 1 } }), btn('Generate', gen), btn('+ Add', () => { cols.push({ c: randHex(), lock: false }); draw(); }), btn('Export', () => copy(cols.map((o) => o.c).join(', '), 'Palette exported'), 'pri'), btn('Save', () => toast('Saved to library'))), row);
  draw();
  window.__demoProof = async () => { cols[1].lock = true; cols[3].lock = true; gen(); return 'locked 2 swatches, spacebar-generate kept them'; };
};
V['huemint-contextual-color-mock'] = (root, T) => {
  theme(root, T, { bg: '#fafafa', fg: '#222', panel: '#fff', ac: '#222', dark: false });
  let pal = ['#f4efe6', '#1d1d1b', '#d64933', '#e3a72f', '#2b5f75'].map((c) => ({ c, lock: false })); let creat = 1.2;
  const PRE = { Default: [30, 60], Pastel: [20, 85], Vibrant: [85, 55], Dark: [45, 25] }; let preset = 'Default';
  const stage = s('svg', { viewBox: '0 0 800 460', style: 'width:100%;height:100%' });
  const sw = h('div.k-row', { style: { gap: '6px' } });
  function draw() {
    const [bg, fg, a1, a2, a3] = pal.map((p) => p.c); stage.replaceChildren(s('rect', { width: 800, height: 460, fill: bg }));
    for (let i = 0; i < 6; i++) { stage.append(s('circle', { cx: 120 + i * 110, cy: 330, r: 55, fill: [a1, a2, a3][i % 3] })); stage.append(s('rect', { x: 65 + i * 110, y: 330, width: 110, height: 90, fill: [a2, a3, a1][i % 3] })); }
    stage.append(s('rect', { x: 250, y: 150, width: 300, height: 70, fill: fg }), s('text', { x: 400, y: 198, 'text-anchor': 'middle', fill: bg, 'font-size': 38, 'font-weight': 800, 'font-family': 'Inter Variable', 'letter-spacing': 6 }, 'BRAND'), s('path', { d: 'M560 60l60 60h-120z', fill: a1 }), s('circle', { cx: 150, cy: 110, r: 36, fill: a3 }));
    sw.replaceChildren(...pal.map((p, i) => h('div', { style: { position: 'relative', width: '40px', height: '40px', borderRadius: '50%', background: p.c, border: '2px solid #fff', boxShadow: '0 0 0 1px #0002', cursor: 'pointer' }, title: p.c, onclick: () => { p.lock = !p.lock; draw(); } }, p.lock ? h('span', { style: { position: 'absolute', right: '-4px', top: '-4px', fontSize: '12px' } }, '🔒') : null)));
    code.textContent = pal.map((p) => p.c).join(' ');
  }
  const gen = () => { const [sat, lig] = PRE[preset]; const h0 = Math.random() * 360; pal.forEach((p, i) => { if (p.lock) return; p.c = i === 0 ? hsl(h0, 20, preset === 'Dark' ? 12 : 94) : i === 1 ? hsl(h0, 15, preset === 'Dark' ? 92 : 12) : hsl((h0 + i * 60 * creat) % 360, clamp(sat + (Math.random() - 0.5) * 30 * creat, 10, 95), clamp(lig + (Math.random() - 0.5) * 20, 15, 90)); }); draw(); };
  const code = h('code', { style: { fontSize: '12px' } });
  const menu = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '180px', borderRight: '1px solid #eee', padding: '16px', background: '#fff', display: 'grid', alignContent: 'start', gap: '10px', fontSize: '13px' } }, h('b', { style: { fontSize: '18px' } }, 'huemint-ish'), ...['Brand', 'Website', 'Gradient', 'Illustration', 'Brand intersection', 'Poster', 'Logo'].map((x) => h('div', { style: { padding: '6px 8px', borderRadius: '6px', background: x === 'Brand intersection' ? '#f0f0f0' : '' } }, x)));
  root.append(menu, h('div.k-row', { style: { position: 'absolute', left: '200px', right: '20px', top: '14px', gap: '14px' } }, sw, h('span', { style: { flex: 1 } }), h('div', { style: { width: '180px' } }, slider('Creativity', 0.2, 2, creat, 0.1, (v) => (creat = v))), select(Object.keys(PRE), preset, (v) => { preset = v; gen(); }), btn('Generate', gen, 'pri'), btn('Copy Link', () => copy(location.href.split('#')[0] + '#' + pal.map((p) => p.c.slice(1)).join('-'), 'Link copied'))),
    h('div', { style: { position: 'absolute', left: '200px', right: '20px', top: '76px', bottom: '40px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 10px 40px #0001' } }, stage), h('div', { style: { position: 'absolute', left: '200px', bottom: '12px' } }, code));
  const hsh = location.hash.slice(1).split('-'); if (hsh.length === 5 && hsh.every((x) => /^[0-9a-f]{6}$/i.test(x))) pal.forEach((p, i) => (p.c = '#' + hsh[i]));
  draw();
  window.__demoProof = async () => { pal[2].lock = true; preset = 'Vibrant'; gen(); return 'locked accent, vibrant preset regenerated'; };
};
V['uicolors-tailwind-scale-studio'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#0f172a', panel: '#fff', ac: '#0f766e', dark: false });
  let base = '#2bb5b8', name = 'Tradewind';
  const strip = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(11,1fr)', gap: '4px' } });
  const gal = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' } });
  function draw() {
    const R = ramp(base); const c = Object.fromEntries(R);
    strip.replaceChildren(...R.map(([st, hx]) => h('div', { style: { height: '64px', borderRadius: '8px', background: hx, color: fgOn(hx), padding: '6px', fontSize: '11px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'pointer' }, onclick: () => copy(hx) }, h('b', {}, st), hx)));
    gal.replaceChildren(
      h('div', { style: { borderRadius: '16px', background: c[500], color: '#fff', padding: '22px', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } }, h('div', { style: { fontSize: '24px', fontWeight: 700 } }, 'Track your expenses'), h('div', { style: { opacity: .8 } }, 'Smarter money, one tap.')),
      h('div', { style: { borderRadius: '16px', background: c[50], padding: '18px', border: `1px solid ${c[100]}` } }, h('div', { style: { color: c[900], fontWeight: 700 } }, 'Expenses'), h('div', { style: { fontSize: '26px', fontWeight: 800, color: c[950] } }, '$12,543'), h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '6px', height: '110px', marginTop: '10px' } }, [40, 70, 55, 90, 65, 100, 80].map((v, i) => h('div', { style: { flex: 1, height: v + '%', background: i === 5 ? c[600] : c[300], borderRadius: '4px' } })))),
      h('div', { style: { borderRadius: '16px', background: c[300], padding: '22px', color: c[950], display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } }, h('div', { style: { fontSize: '26px', fontWeight: 800 } }, 'Gain control'), h('button', { style: { marginTop: '10px', background: c[900], color: '#fff', border: 0, borderRadius: '99px', padding: '8px 14px', width: 'fit-content' } }, 'Get started')),
      h('div', { style: { gridColumn: 'span 2', borderRadius: '16px', border: `1px solid ${c[200]}`, padding: '16px', display: 'flex', gap: '10px', alignItems: 'center' } }, h('div', { style: { width: '44px', height: '44px', borderRadius: '50%', background: c[200] } }), h('div', { style: { flex: 1 } }, h('b', {}, 'Jonah Klein'), h('div', { style: { color: c[700], fontSize: '12px' } }, 'Sent you $240 · 2 min ago')), h('span', { style: { background: c[100], color: c[800], padding: '4px 10px', borderRadius: '99px', fontSize: '12px' } }, 'Completed')),
      h('div', { style: { borderRadius: '16px', background: c[900], color: c[100], padding: '16px' } }, h('b', {}, 'Font pairing'), h('div', { style: { fontFamily: 'Georgia,serif', fontSize: '22px' } }, 'Aa Serif'), h('div', {}, 'Inter · body')));
    inp.value = base; nm.textContent = name; history.replaceState(null, '', '#' + base.slice(1));
  }
  const inp = h('input', { value: base, style: { width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', fontFamily: 'monospace' }, oninput: (e) => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) { base = e.target.value; draw(); } } });
  const nm = h('b');
  const rnd = () => { base = oklchToHex(0.62, 0.12 + Math.random() * 0.08, Math.random() * 360); name = pick(['Tradewind', 'Persian Rose', 'Royal Blue', 'Olivine', 'Tangerine', 'Lavender', 'Cerulean']); draw(); };
  root.append(h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '300px', borderRight: '1px solid #e2e8f0', padding: '24px', display: 'grid', alignContent: 'start', gap: '12px' } }, h('b', { style: { fontSize: '20px' } }, 'uicolors-ish'), h('div', { style: { fontSize: '22px', fontWeight: 800, lineHeight: 1.1 } }, 'Tailwind CSS Color Generator'), h('div', { style: { color: '#64748b', fontSize: '13px' } }, 'Create and share Tailwind palettes on the fly.'), inp, btn('↻ Randomize (space)', rnd, 'pri'), seg(['Shades', 'Contrast', 'Edit'], 'Shades', () => {}), btn('Export Tailwind', () => copy(`${name.toLowerCase()}: {\n${ramp(base).map(([a, b]) => `  ${a}: '${b}',`).join('\n')}\n}`, 'Config copied'))),
    h('div', { style: { position: 'absolute', left: '300px', right: 0, top: 0, bottom: 0, padding: '24px', display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: '16px', overflow: 'auto' } }, h('div.k-row', {}, nm, h('span', { style: { color: '#64748b' } }, '· 50–950')), strip, gal));
  window.addEventListener('keydown', (e) => { if (e.code === 'Space' && document.activeElement === document.body) { e.preventDefault(); rnd(); } });
  if (/^#[0-9a-f]{6}$/i.test(location.hash)) base = location.hash; draw();
  window.__demoProof = async () => { base = '#22b8c0'; name = 'Tradewind'; draw(); return 'base color edited → scale + gallery re-themed, URL synced'; };
};
V['happy-hues-palette-context'] = (root, T) => {
  theme(root, T, { bg: '#fef6e4', fg: '#001858', ac: '#f582ae', dark: false });
  const P = [['#fef6e4', '#001858', '#f582ae', '#8bd3dd'], ['#fffffe', '#094067', '#3da9fc', '#ef4565'], ['#16161a', '#fffffe', '#7f5af0', '#2cb67d'], ['#f9f4ef', '#020826', '#8c7851', '#f25042'], ['#232946', '#fffffe', '#eebbc3', '#b8c1ec'], ['#004643', '#fffffe', '#f9bc60', '#e16162'], ['#fec7d7', '#0e172c', '#a786df', '#d9d4e7'], ['#faeee7', '#33272a', '#ff8ba7', '#c3f0ca'], ['#0f0e17', '#fffffe', '#ff8906', '#e53170'], ['#eff0f3', '#0d0d0d', '#ff8e3c', '#d9376e']];
  let cur = 0;
  const rail = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', overflow: 'auto', padding: '10px', display: 'grid', gap: '8px', alignContent: 'start', borderRight: '2px solid var(--fg)' } });
  const main = h('div', { style: { position: 'absolute', left: '120px', right: 0, top: 0, bottom: 0, padding: '30px 60px', overflow: 'hidden', transition: 'background .3s' } });
  function draw() { const [bg, fg, a, b] = P[cur]; root.style.setProperty('--fg', fg); rail.style.background = bg;
    rail.replaceChildren(...P.map((p, i) => h('button', { onclick: () => { cur = i; draw(); }, style: { display: 'flex', height: '34px', border: `2px solid ${fg}`, borderRadius: '8px', overflow: 'hidden', padding: 0, outline: i === cur ? `3px solid ${a}` : '' } }, p.map((c) => h('span', { style: { flex: 1, background: c } })))));
    main.style.background = bg; main.style.color = fg;
    main.replaceChildren(h('div.k-row', {}, h('b', { style: { fontSize: '20px' } }, '◑ Happy Hues-ish'), h('span', { style: { flex: 1 } }), h('span', {}, 'Toggle palette'), h('span', {}, 'Toggle section colors')),
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '60px', alignItems: 'center' } }, h('div', {}, h('h1', { style: { fontSize: '56px', margin: 0, lineHeight: 1.05 } }, 'Curated colors in context.'), h('p', { style: { fontSize: '18px', lineHeight: 1.6, opacity: .85 } }, 'Not sure what colors to use in your design? Each palette shows its colors in a real page so you can judge them in context.'), h('button', { style: { background: a, color: fg, border: `2px solid ${fg}`, borderRadius: '8px', padding: '12px 18px', fontWeight: 700 } }, 'Try changing the palette!')),
        s('svg', { viewBox: '0 0 300 220', width: '100%' }, s('rect', { x: 20, y: 30, width: 220, height: 160, rx: 12, fill: b, stroke: fg, 'stroke-width': 3 }), s('rect', { x: 20, y: 30, width: 220, height: 28, rx: 12, fill: a, stroke: fg, 'stroke-width': 3 }), s('circle', { cx: 240, cy: 60, r: 34, fill: a, stroke: fg, 'stroke-width': 3 }), s('path', { d: 'M60 150q40-60 80 0t80 0', fill: 'none', stroke: fg, 'stroke-width': 4 }))),
      h('div', { style: { marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' } }, [['Background', bg], ['Headline', fg], ['Button', a], ['Highlight', b]].map(([n, c]) => h('div', { style: { border: `2px solid ${fg}`, borderRadius: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }, onclick: () => copy(c) }, h('span', {}, n), h('span.k-row', {}, h('i', { style: { width: '20px', height: '20px', borderRadius: '50%', background: c, border: `2px solid ${fg}` } }), c)))));
  }
  root.append(rail, main); draw();
  window.__demoProof = async () => { cur = 4; draw(); cur = 0; draw(); return 'switched palette 5 then back to 1 → page recolored twice'; };
};
V['oklch-palette-preview-desk'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111827', panel: '#fff', ac: '#1bc3e6', dark: false });
  let seed = '#1bc3e6';
  const ramp2 = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(11,1fr)', height: '96px', borderRadius: '10px', overflow: 'hidden' } });
  const chips = h('div.k-row', { style: { flexWrap: 'wrap' } }); const prev = h('div'); const tok = h('pre.k-code');
  function draw() { const R = ramp(seed); const c = Object.fromEntries(R);
    ramp2.replaceChildren(...R.map(([st, hx]) => h('div', { style: { background: hx, color: fgOn(hx), padding: '8px', fontSize: '11px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } }, h('b', {}, st), hx)));
    chips.replaceChildren(...[[500, '#fff'], [700, '#fff'], [100, c[900]], [50, c[800]]].map(([k, f]) => { const r = contrast(c[k], f); return h('span', { style: { background: c[k], color: f, padding: '6px 10px', borderRadius: '99px', fontSize: '12px', border: '1px solid #0001' } }, `${k} · ${r.toFixed(2)} ${r >= 4.5 ? 'AA ✓' : '✗'}`); }));
    prev.replaceChildren(h('div', { style: { borderRadius: '16px', background: `linear-gradient(135deg,${c[100]},${c[300]})`, padding: '28px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' } }, h('div', {}, h('span', { style: { background: c[500], color: '#fff', padding: '4px 10px', borderRadius: '99px', fontSize: '12px' } }, 'New release'), h('h2', { style: { fontSize: '40px', margin: '14px 0', color: c[950] } }, 'Your brand, ', h('em', { style: { color: c[600] } }, 'in full colour')), h('p', { style: { color: c[800] } }, 'Preview the ramp on real components before shipping tokens.'), h('button', { style: { background: c[700], color: '#fff', border: 0, padding: '10px 16px', borderRadius: '8px' } }, 'Get started')), h('div', { style: { background: '#fff', borderRadius: '12px', padding: '14px', boxShadow: '0 8px 30px #0001' } }, h('b', { style: { color: c[900] } }, 'Usage'), h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px', marginTop: '10px' } }, [30, 60, 45, 80, 70, 95].map((v, i) => h('div', { style: { flex: 1, height: v + '%', background: c[i % 2 ? 400 : 600], borderRadius: '4px' } }))))));
    tok.textContent = `:root {\n${R.map(([a, b]) => `  --brand-${a}: ${b};`).join('\n')}\n}`; inp.value = seed; }
  const inp = h('input', { value: seed, style: { padding: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', fontFamily: 'monospace', width: '140px' }, oninput: (e) => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) { seed = e.target.value; draw(); } } });
  root.append(h('div.k-row', { style: { height: '56px', padding: '0 24px', borderBottom: '1px solid #eee', gap: '14px' } }, h('b', {}, 'aesthetic colours-ish'), inp, h('input', { type: 'color', value: seed, oninput: (e) => { seed = e.target.value; draw(); } }), h('span', { style: { flex: 1 } }), btn('Random', () => { seed = oklchToHex(0.65, 0.15, Math.random() * 360); draw(); }), btn('Export tokens', () => copy(tok.textContent, 'Tokens copied'), 'pri')),
    h('div', { style: { padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' } }, h('div', { style: { display: 'grid', gap: '14px' } }, ramp2, chips, prev), tok));
  draw();
  window.__demoProof = async () => { seed = '#17b6db'; draw(); return 'seed hex changed → ramp/contrast/preview/tokens updated'; };
};
V['huetone-tone-ramp'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#fafafa', ac: '#555', dark: false });
  const hues = [['Gray', 260, 0.01], ['Red', 25, 0.16], ['Orange', 55, 0.15], ['Yellow', 95, 0.14], ['Green', 145, 0.13], ['Teal', 185, 0.1], ['Blue', 250, 0.14], ['Purple', 300, 0.14]];
  const tones = [0.97, 0.9, 0.82, 0.73, 0.64, 0.55, 0.47, 0.39, 0.31, 0.23]; let sel = [6, 4]; let bgRef = '#ffffff';
  const gridEl = h('div', { style: { display: 'grid', gridTemplateColumns: `70px repeat(${tones.length},1fr)`, gap: '3px' } });
  const info = h('div');
  function draw() { gridEl.replaceChildren(h('span'), ...tones.map((_, i) => h('span', { style: { fontSize: '11px', textAlign: 'center', opacity: .6 } }, (i + 1) * 100)), ...hues.flatMap(([n, H, C], r) => [h('span', { style: { fontSize: '12px', alignSelf: 'center' } }, n), ...tones.map((L, i) => { const hx = oklchToHex(L, C, H); const cr = contrast(hx, bgRef); return h('div', { onclick: () => { sel = [r, i]; draw(); }, style: { height: '52px', background: hx, color: fgOn(hx), fontSize: '11px', display: 'grid', placeItems: 'center', cursor: 'pointer', outline: sel[0] === r && sel[1] === i ? '3px solid #111' : '', outlineOffset: '1px' } }, cr.toFixed(1)); })]));
    const [n, H, C] = hues[sel[0]]; const L = tones[sel[1]]; const hx = oklchToHex(L, C, H);
    info.replaceChildren(h('div', { style: { height: '90px', borderRadius: '8px', background: hx } }), h('b', {}, `${n} ${(sel[1] + 1) * 100} · ${hx}`), slider('L', 0, 1, L, 0.01, (v) => { tones[sel[1]] = v; draw(); }), slider('C', 0, 0.3, C, 0.005, (v) => { hues[sel[0]][2] = v; draw(); }), slider('H', 0, 360, H, 1, (v) => { hues[sel[0]][1] = v; draw(); }), h('div.k-h', {}, 'Contrast vs'), seg([['#ffffff', 'White'], ['#000000', 'Black']], bgRef, (v) => { bgRef = v; draw(); }), h('div', { style: { fontSize: '13px' } }, `APCA-ish / WCAG: ${contrast(hx, bgRef).toFixed(2)} ${contrast(hx, bgRef) >= 4.5 ? 'AA ✓' : ''}`), btn('Export Figma tokens', () => copy(JSON.stringify(hues)), 'pri')); }
  root.append(h('div.k-row', { style: { height: '46px', padding: '0 16px', borderBottom: '1px solid #eee', gap: '14px' } }, h('b', {}, 'Huetone-ish'), select(['Tailwind', 'Material', 'Radix'], 'Tailwind', () => {}), 'Hue × Tone palette editor'), h('div', { style: { position: 'absolute', inset: '46px 0 0 0', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '18px', padding: '18px' } }, gridEl, panel('Selected', info)));
  draw();
  window.__demoProof = async () => { sel = [1, 5]; hues[1][2] = 0.2; draw(); return 'selected Red 600, boosted chroma'; };
};
function siteMock(c, f = 'Inter Variable') {
  return h('div', { style: { background: c.bg, color: c.text, fontFamily: f, height: '100%', padding: '26px 60px', overflow: 'hidden' } },
    h('div.k-row', { style: { gap: '22px', fontSize: '14px' } }, h('b', { style: { fontSize: '17px' } }, '◼ Realtime'), h('span', { style: { flex: 1 } }), 'Figma Plugin', 'Docs', 'Templates', h('span', { style: { background: c.primary, color: fgOn(c.primary), padding: '6px 12px', borderRadius: '8px' } }, 'Export')),
    h('div', { style: { display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '40px', marginTop: '60px', alignItems: 'center' } }, h('div', {}, h('h1', { style: { fontSize: '54px', lineHeight: 1.05, margin: 0, fontWeight: 800 } }, 'Visualize Your ', h('span', { style: { color: c.primary } }, 'Colors'), ' & ', h('span', { style: { color: c.accent } }, 'Fonts'), ' On a Real Site'), h('p', { style: { fontSize: '17px', opacity: .8, lineHeight: 1.6 } }, 'Choosing colors or typography for your website? Use the toolbar below to realize your choices.'), h('div.k-row', {}, h('span', { style: { border: `1px solid ${c.text}33`, padding: '10px 16px', borderRadius: '8px' } }, 'How does it work?'), h('span', { style: { background: c.primary, color: fgOn(c.primary), padding: '10px 16px', borderRadius: '8px' } }, 'Get Started'))),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,70px)', gap: '10px' } }, [c.primary, c.secondary, c.accent, c.secondary, c.primary, c.text, c.accent, c.secondary, c.primary].map((x, i) => h('div', { style: { background: x, opacity: i % 2 ? 0.8 : 1, borderRadius: i === 4 ? '50%' : '6px' } })))));
}
function roleBar(c, onch, extra = []) { return h('div.k-row', { style: { position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', background: '#0e0e10', color: '#fff', padding: '8px', borderRadius: '12px', gap: '6px', boxShadow: '0 10px 40px #0004', zIndex: 3 } }, Object.keys(c).map((k) => h('label', { style: { background: c[k], color: fgOn(c[k]), padding: '8px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', position: 'relative' } }, k[0].toUpperCase() + k.slice(1), h('input', { type: 'color', value: c[k], style: { position: 'absolute', opacity: 0, inset: 0 }, oninput: (e) => { c[k] = e.target.value; onch(); } }))), extra); }
V['live-theme-site-preview'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#050315', dark: false });
  const c = { text: '#050315', bg: '#fbfbfe', primary: '#2f27ce', secondary: '#dedcff', accent: '#433bff' }; let font = 'Inter Variable';
  const host = h('div', { style: { position: 'absolute', inset: 0 } });
  const draw = () => host.replaceChildren(siteMock(c, font));
  const rnd = () => { const H0 = Math.random() * 360; c.primary = oklchToHex(0.5, 0.2, H0); c.accent = oklchToHex(0.6, 0.2, (H0 + 40) % 360); c.secondary = oklchToHex(0.9, 0.05, H0); draw(); };
  root.append(host, roleBar(c, draw, [select([['Inter Variable', 'Inter'], ['Georgia', 'Georgia'], ['Fraunces Variable', 'Fraunces'], ['JetBrains Mono Variable', 'Mono']], font, (v) => { font = v; draw(); }), btn('🎲', rnd), btn('Export', () => copy(`:root{${Object.entries(c).map(([k, v]) => `--${k}:${v};`).join('')}}`, 'CSS copied'), 'pri')]));
  draw();
  window.__demoProof = async () => { c.primary = '#3a31d8'; c.accent = '#4f46ff'; c.secondary = '#e4e2ff'; draw(); return 'remapped primary/accent/secondary + font'; };
};
V['livetheme-realtime-theme-desk'] = (root, T) => {
  theme(root, T, { bg: '#ece6df', fg: '#2b2b2b', panel: '#fff', ac: '#c2412d', dark: false });
  const c = { base: '#f6f1ea', text: '#2b2b2b', primary: '#c2412d', secondary: '#f2b8a2', accent: '#7da35f' }; let font = 'Inter Variable', device = 'desktop', tpl = 'dashboard';
  const frame = h('div', { style: { transition: 'width .3s', margin: '0 auto', height: '100%', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 20px 60px #0002' } });
  const T2 = {
    dashboard: () => h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', padding: '22px' } }, h('div', { style: { gridColumn: 'span 2', background: c.primary, color: fgOn(c.primary), borderRadius: '16px', padding: '22px' } }, h('div', { style: { opacity: .8 } }, 'Focus timer'), h('div', { style: { fontSize: '64px', fontWeight: 800 } }, '25:00'), h('div.k-row', {}, ['Start', 'Reset'].map((x) => h('span', { style: { background: c.base, color: c.text, padding: '8px 14px', borderRadius: '99px' } }, x)))), h('div', { style: { background: c.secondary, borderRadius: '16px', padding: '18px' } }, h('b', {}, 'Weather'), h('div', { style: { fontSize: '40px' } }, '24°')), h('div', { style: { background: '#fff', borderRadius: '16px', padding: '18px' } }, h('b', {}, 'Tasks'), ...['Design review', 'Ship v2', 'Write docs'].map((t, i) => h('div.k-row', { style: { marginTop: '8px' } }, h('i', { style: { width: '14px', height: '14px', borderRadius: '4px', background: i ? '#ddd' : c.accent } }), t))), h('div', { style: { gridColumn: 'span 2', background: c.accent, color: fgOn(c.accent), borderRadius: '16px', padding: '18px' } }, h('b', {}, 'Habit streak'), h('div.k-row', { style: { marginTop: '10px' } }, Array.from({ length: 14 }, (_, i) => h('i', { style: { flex: 1, height: '26px', borderRadius: '6px', background: i % 3 ? c.base : c.primary } }))))),
    landing: () => h('div', { style: { padding: '40px' } }, h('h1', { style: { fontSize: '46px', margin: 0 } }, 'Ship themes ', h('span', { style: { color: c.primary } }, 'in realtime')), h('p', {}, 'Every role, every template, one source of truth.'), h('span', { style: { background: c.primary, color: fgOn(c.primary), padding: '10px 16px', borderRadius: '10px' } }, 'Get LiveTheme')),
    pricing: () => h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', padding: '30px' } }, ['Free', 'Pro', 'Team'].map((p, i) => h('div', { style: { background: i === 1 ? c.primary : '#fff', color: i === 1 ? fgOn(c.primary) : c.text, borderRadius: '16px', padding: '22px' } }, h('b', {}, p), h('div', { style: { fontSize: '36px', fontWeight: 800 } }, ['$0', '$12', '$29'][i])))),
  };
  const draw = () => { frame.style.width = { desktop: '100%', tablet: '760px', mobile: '390px' }[device]; frame.style.background = c.base; frame.style.color = c.text; frame.style.fontFamily = font; frame.replaceChildren(T2[tpl]()); code.update(); };
  const code = codebox(() => `/* DaisyUI */\n[data-theme=live]{--p:${c.primary};--s:${c.secondary};--a:${c.accent};--b1:${c.base};--bc:${c.text}}\n/* shadcn */\n--primary: ${c.primary};`);
  const left = panel('Colors', ...Object.keys(c).map((k) => h('label.k-row', {}, h('input', { type: 'color', value: c[k], oninput: (e) => { c[k] = e.target.value; draw(); } }), k)), h('div.k-h', {}, 'Font'), select([['Inter Variable', 'Inter'], ['Fraunces Variable', 'Fraunces'], ['Georgia', 'Georgia']], font, (v) => { font = v; draw(); }), btn('🎲 Randomize', () => { const H0 = Math.random() * 360; c.primary = oklchToHex(0.58, 0.17, H0); c.secondary = oklchToHex(0.85, 0.08, H0 + 30); c.accent = oklchToHex(0.65, 0.14, H0 + 150); draw(); }, 'pri'));
  root.style.display = 'grid'; root.style.gridTemplateColumns = '240px 1fr 300px'; root.style.gap = '14px'; root.style.padding = '14px';
  root.append(left, h('div', { style: { display: 'grid', gridTemplateRows: 'auto 1fr', gap: '10px', minHeight: 0 } }, h('div.k-row', { style: { justifyContent: 'center' } }, seg(['dashboard', 'landing', 'pricing'], tpl, (v) => { tpl = v; draw(); }), seg([['desktop', '🖥'], ['tablet', '▭'], ['mobile', '📱']], device, (v) => { device = v; draw(); })), frame), panel('Export', seg(['DaisyUI', 'Tailwind', 'shadcn'], 'DaisyUI', () => {}), code, btn('Copy CSS', () => copy(code.textContent), 'pri')));
  draw();
  window.__demoProof = async () => { c.primary = '#d0442e'; c.accent = '#8aa865'; draw(); return 'recolored + tablet device frame'; };
};
V['oklch-perceptual-color-lab'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', panel: '#fff', ac: '#3aa7a3', dark: false });
  let L = 0.7, C = 0.1, H = 190;
  const sw = h('div', { style: { height: '120px', borderRadius: '10px' } });
  const f1 = h('input', { style: { width: '100%', padding: '8px', fontFamily: 'monospace', border: '1px solid #ddd', borderRadius: '6px' } }), f2 = h('input', { style: { width: '100%', padding: '8px', fontFamily: 'monospace', border: '1px solid #ddd', borderRadius: '6px' } });
  const warn = h('div', { style: { fontSize: '12px' } });
  const bars = {}; const mk = (k, min, max, step) => { const bar = h('div', { style: { height: '120px', borderRadius: '8px', position: 'relative' } }); const sl = slider(k === 'L' ? 'Lightness' : k === 'C' ? 'Chroma' : 'Hue', min, max, { L, C, H }[k], step, (v) => { if (k === 'L') L = v; if (k === 'C') C = v; if (k === 'H') H = v; draw(); }); bars[k] = bar; return h('div.k-panel', {}, sl, bar); };
  function draw() { const hx = oklchToHex(L, C, H); sw.style.background = hx; f1.value = `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`; f2.value = hx; const [l2, c2] = hexToOklch(hx); warn.textContent = Math.abs(c2 - C) > 0.01 ? `⚠ Out of sRGB gamut — fallback ${hx} (chroma ${c2.toFixed(3)})` : '✓ In sRGB gamut'; warn.style.color = Math.abs(c2 - C) > 0.01 ? '#c92a2a' : '#2b8a3e';
    bars.L.style.background = `linear-gradient(90deg,${Array.from({ length: 11 }, (_, i) => oklchToHex(i / 10, C, H)).join(',')})`; bars.C.style.background = `linear-gradient(90deg,${Array.from({ length: 11 }, (_, i) => oklchToHex(L, (i / 10) * 0.37, H)).join(',')})`; bars.H.style.background = `linear-gradient(90deg,${Array.from({ length: 13 }, (_, i) => oklchToHex(L, C, i * 30)).join(',')})`; }
  root.append(h('div', { style: { textAlign: 'center', padding: '14px', fontWeight: 800, letterSpacing: '.04em' } }, 'OKLCH Color Picker & Converter'), h('div', { style: { display: 'grid', gridTemplateColumns: '320px 1fr 1fr', gap: '16px', padding: '0 20px' } }, h('div.k-panel', {}, sw, f1, f2, warn, toggle('Show 3D', false, () => {}), toggle('Show P3', true, () => {}), toggle('Show Rec2020', false, () => {})), mk('L', 0, 1, 0.005), mk('C', 0, 0.37, 0.002)), h('div', { style: { padding: '16px 20px 0 356px' } }, mk('H', 0, 360, 1)));
  draw();
  window.__demoProof = async () => { C = 0.3; L = 0.75; draw(); return 'pushed chroma out of sRGB → fallback warning'; };
};
V['vision-contrast-sim-cards'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#1a1a2e', panel: '#fff', ac: '#6b2fd1', dark: false });
  let fg = '#ffffff', bg = '#6b2fd1';
  const SIM = [['Regular vision (Trichromacy)', (r) => r], ['Protanopia', ([r, g, b]) => [0.567 * r + 0.433 * g, 0.558 * r + 0.442 * g, 0.242 * g + 0.758 * b]], ['Protanomaly', ([r, g, b]) => [0.817 * r + 0.183 * g, 0.333 * r + 0.667 * g, 0.125 * g + 0.875 * b]], ['Deuteranopia', ([r, g, b]) => [0.625 * r + 0.375 * g, 0.7 * r + 0.3 * g, 0.3 * g + 0.7 * b]], ['Tritanopia', ([r, g, b]) => [0.95 * r + 0.05 * g, 0.433 * g + 0.567 * b, 0.475 * g + 0.525 * b]], ['Achromatopsia', ([r, g, b]) => { const y = 0.299 * r + 0.587 * g + 0.114 * b; return [y, y, y]; }], ['Cataracts (blur)', (r) => r]];
  const card = h('div'); const list = h('div', { style: { display: 'grid', gap: '10px' } });
  function draw() { const cr = contrast(fg, bg); const grade = cr >= 7 ? 'AAA' : cr >= 4.5 ? 'AA' : cr >= 3 ? 'AA Large' : 'Fail';
    card.replaceChildren(h('div', { style: { background: bg, color: fg, borderRadius: '14px', padding: '40px 28px', minHeight: '230px' } }, h('div', { style: { fontSize: '14px' } }, 'The quick brown fox jumps over the lazy dog.'), h('div', { style: { fontSize: '44px', fontWeight: 800, marginTop: '30px' } }, cr.toFixed(2) + ':1'), h('div', {}, grade)), h('div.k-row', { style: { marginTop: '12px' } }, h('label', {}, 'Text ', h('input', { type: 'color', value: fg, oninput: (e) => { fg = e.target.value; draw(); } })), h('label', {}, 'Background ', h('input', { type: 'color', value: bg, oninput: (e) => { bg = e.target.value; draw(); } }))));
    list.replaceChildren(...SIM.map(([n, f], i) => { const t = (hx) => rgbToHex(...f(hexToRgb(hx))); const a = t(fg), b = t(bg); const r = contrast(a, b); const ok = r >= 4.5; return h('div', { style: { display: 'grid', gridTemplateColumns: '28px 1fr 110px', gap: '12px', alignItems: 'center', border: '1px solid #eee', borderRadius: '10px', padding: '10px 14px' } }, h('span', { style: { color: ok ? '#2b8a3e' : '#c92a2a', fontSize: '20px' } }, ok ? '✓' : '✗'), h('div', {}, h('b', {}, n), h('div', { style: { fontSize: '12px', opacity: .6 } }, `${(8 - i * 1.1).toFixed(1)}% of people · ${r.toFixed(2)}:1`)), h('div', { style: { background: b, color: a, borderRadius: '8px', padding: '8px', textAlign: 'center', fontWeight: 700, filter: n.startsWith('Cat') ? 'blur(1.4px)' : '' } }, 'Who can use')); })); }
  root.append(h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '440px 1fr', gap: '30px', padding: '30px 50px', overflow: 'auto' } }, h('div', {}, h('b', { style: { fontSize: '22px' } }, 'who can use-ish'), h('div', { style: { marginTop: '16px' } }, card)), h('div', {}, h('h2', { style: { marginTop: 0 } }, 'Who can use this color combination?'), list)));
  draw();
  window.__demoProof = async () => { fg = '#ffcc00'; bg = '#ff5500'; draw(); return 'low-contrast pair → failures flagged per impairment'; };
};

V['khroma-ai-color-pair-studio'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#111', ac: '#f9ed79', dark: false });
  const NAMES = ['PALE', 'MUTED', 'RICH', 'NEUTRAL', 'VIVID', 'DUSTY', 'SOFT', 'DEEP'];
  const HUES = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'TEAL', 'BLUE', 'VIOLET', 'MAGENTA', 'BROWN', 'GRAY'];
  const VALUES = ['LIGHT', 'MIDTONE', 'DARK'];
  const randCol = () => {
    const hx = oklchToHex(0.35 + Math.random() * 0.5, 0.04 + Math.random() * 0.16, Math.random() * 360);
    const name = `${pick(NAMES)} ${pick(VALUES)} ${pick(HUES)}`;
    return { hx, name };
  };
  const NEED = 12;
  let likes = [];
  let phase = 'train'; // train | generator
  let bias = 'Balanced';
  let query = '';
  let pairs = [];
  let selected = null;
  const shell = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '52px 1fr', background: '#fff' } });
  const header = h('div.k-row', { style: { padding: '0 20px', borderBottom: '1px solid #eee', gap: '12px' } },
    h('b', { style: { fontSize: '22px', fontFamily: 'Georgia,serif' } }, 'K', h('span', { style: { background: '#ff6b9d', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '3px', marginLeft: '6px', fontFamily: 'Inter,sans-serif', verticalAlign: 'super' } }, 'BETA')),
    h('span', { style: { flex: 1 } }),
    h('span', { id: 'kh-counter', style: { fontSize: '13px', color: '#666' } }, `${NEED} likes to go`));
  const body = h('div', { style: { overflow: 'auto', padding: '28px 40px' } });
  const mkPairs = (n = 24) => {
    const baseHue = likes.length ? hexToOklch(likes[0].hx)[2] : Math.random() * 360;
    const biasShift = bias === 'Warm' ? 30 : bias === 'Cool' ? -40 : bias === 'Pastel' ? 0 : 0;
    const biasC = bias === 'Pastel' ? 0.06 : bias === 'Vivid' ? 0.18 : 0.12;
    const biasL = bias === 'Pastel' ? 0.82 : bias === 'Vivid' ? 0.55 : 0.62;
    pairs = Array.from({ length: n }, (_, i) => {
      const h1 = (baseHue + biasShift + i * 17 + Math.random() * 40) % 360;
      const h2 = (h1 + 40 + Math.random() * 140) % 360;
      const a = oklchToHex(biasL + (Math.random() - 0.5) * 0.2, biasC + Math.random() * 0.06, h1);
      const b = oklchToHex(1 - biasL + (Math.random() - 0.5) * 0.15, biasC * 0.9, h2);
      return { a, b, id: i + '-' + Math.random().toString(36).slice(2, 6) };
    });
  };
  const filtered = () => {
    if (!query.trim()) return pairs;
    const q = query.trim().toLowerCase().replace('#', '');
    return pairs.filter((p) => p.a.toLowerCase().includes(q) || p.b.toLowerCase().includes(q));
  };
  const drawTrain = () => {
    header.querySelector('#kh-counter').textContent = `${Math.max(0, NEED - likes.length)} likes to go`;
    const gridColors = Array.from({ length: 18 }, randCol);
    body.replaceChildren(
      h('div', { style: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', marginBottom: '28px' } },
        h('div', {},
          h('h1', { style: { fontSize: '42px', margin: '0 0 12px', fontWeight: 800 } }, `Choose ${NEED} colors`),
          h('p', { style: { color: '#555', maxWidth: '480px', lineHeight: 1.6 } }, 'These colors train a generator personalized to you. Pick a wide variety of hues, values, and saturations.'),
          h('div', { style: { background: '#f9ed79', padding: '12px 16px', marginTop: '16px', fontSize: '13px', borderRadius: '4px' } }, 'Note: For this demo, likes are saved in-session only (localStorage stub).')),
        h('div', {}, h('h3', { style: { marginTop: 0, color: '#7a8a9a' } }, 'Why so many?'), h('p', { style: { color: '#8a9aaa', fontSize: '14px', lineHeight: 1.6 } }, 'More likes help the model learn your taste across the spectrum — not just your favorite hue.'))),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '16px' } },
        ...gridColors.map((c) => h('button', {
          style: { border: likes.some((l) => l.hx === c.hx) ? '3px solid #111' : '1px solid #eee', background: '#fff', padding: '0 0 10px', cursor: 'pointer', borderRadius: '4px' },
          onclick: () => {
            if (likes.some((l) => l.hx === c.hx)) return;
            likes.push(c);
            if (likes.length >= NEED) { phase = 'generator'; mkPairs(30); drawGen(); }
            else drawTrain();
          },
        }, h('div', { style: { height: '110px', background: c.hx } }), h('div', { style: { fontSize: '10px', color: '#4a6fa5', letterSpacing: '.06em', marginTop: '8px', fontWeight: 700 } }, c.name)))));
  };
  const drawGen = () => {
    header.querySelector('#kh-counter').textContent = `${likes.length} trained · ${pairs.length} pairs`;
    const list = filtered();
    const preview = selected ? h('div', { style: { position: 'sticky', top: '10px', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 30px #0001' } },
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', height: '120px' } },
        h('div', { style: { background: selected.a, display: 'grid', placeItems: 'end start', padding: '10px', color: fgOn(selected.a), fontFamily: 'monospace', fontWeight: 700 } }, selected.a),
        h('div', { style: { background: selected.b, display: 'grid', placeItems: 'end end', padding: '10px', color: fgOn(selected.b), fontFamily: 'monospace', fontWeight: 700 } }, selected.b)),
      h('div', { style: { padding: '20px', background: selected.a, color: selected.b } },
        h('div', { style: { font: "700 32px/1.1 Georgia,serif" } }, 'Typography preview'),
        h('p', { style: { opacity: .9, lineHeight: 1.6 } }, 'The quick brown fox jumps over the lazy dog. Pair cards become real layouts.'),
        h('button', { style: { marginTop: '10px', background: selected.b, color: selected.a, border: 0, padding: '10px 16px', fontWeight: 700, borderRadius: '6px' } }, 'Primary action')),
      h('div.k-row', { style: { padding: '12px 16px', gap: '8px', background: '#fafafa' } },
        btn('Copy A', () => copy(selected.a, 'Hex A')),
        btn('Copy B', () => copy(selected.b, 'Hex B')),
        btn('Close', () => { selected = null; drawGen(); })))
      : h('div', { style: { color: '#99a', fontSize: '14px', padding: '40px 10px' } }, 'Click a pair card to open typography / template layout.');
    body.replaceChildren(
      h('div.k-row', { style: { gap: '12px', marginBottom: '20px', flexWrap: 'wrap' } },
        h('b', { style: { fontSize: '28px' } }, 'Your color pairs'),
        h('span', { style: { flex: 1 } }),
        h('input', { placeholder: 'Search hex…', value: query, style: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', width: '160px' }, oninput: (e) => { query = e.target.value; drawGen(); } }),
        seg(['Balanced', 'Warm', 'Cool', 'Pastel', 'Vivid'], bias, (v) => { bias = v; mkPairs(30); selected = null; drawGen(); }),
        btn('Regenerate', () => { mkPairs(30); selected = null; drawGen(); toast('New pairs'); }, 'pri'),
        btn('Retrain', () => { phase = 'train'; likes = []; selected = null; drawTrain(); })),
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' } },
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '14px' } },
          ...list.map((p) => h('button', {
            style: { border: selected?.id === p.id ? '2px solid #111' : '1px solid #eee', borderRadius: '10px', overflow: 'hidden', padding: 0, cursor: 'pointer', background: '#fff', textAlign: 'left' },
            onclick: () => { selected = p; drawGen(); },
          }, h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100px' } },
            h('div', { style: { background: p.a } }), h('div', { style: { background: p.b } })),
            h('div.k-row', { style: { padding: '8px 10px', fontSize: '11px', fontFamily: 'monospace', justifyContent: 'space-between' } },
              h('span', {}, p.a), h('span', {}, p.b))))),
        preview));
  };
  shell.append(header, body);
  root.append(shell);
  drawTrain();
  window.__demoProof = async () => {
    likes = Array.from({ length: NEED }, randCol);
    phase = 'generator'; mkPairs(24); bias = 'Warm';
    selected = pairs[0]; drawGen();
    await copy(selected.a, 'Hex');
    mkPairs(24); selected = pairs[1]; drawGen();
    return `trained ${NEED} likes → generator; bias Warm; opened pair + copied hex`;
  };
};


V['leonardocolor-adaptive-theme-desk'] = (root, T) => {
  theme(root, T, { bg: '#f5f5f5', fg: '#2c2c2c', panel: '#ffffff', ac: '#1473e6', ac2: '#5258e4', dark: false, line: '#00000014' });
  const RATIOS = [1.45, 2.05, 3.03, 4.54, 7, 10.86];
  const LABELS = ['100', '200', '300', '400', '500', '600'];
  let key = '#6b7cff';
  let bg = '#ffffff';
  let target = 4.5;
  let mode = 'light'; // light | dark adaptive preview
  let scaleName = 'Gray';
  let tab = 'Theme colors';

  const shell = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '48px 1fr', background: '#f5f5f5' } });
  const header = h('div.k-row', { style: { background: '#fff', borderBottom: '1px solid #e6e6e6', padding: '0 16px', gap: '16px' } },
    h('div.k-row', { style: { gap: '8px' } },
      h('div', { style: { width: '22px', height: '22px', borderRadius: '50%', background: 'conic-gradient(#1473e6,#7c5cff,#39c5ff,#1473e6)' } }),
      h('b', { style: { fontSize: '16px' } }, 'Leonardo')),
    h('span', { style: { opacity: 0.45 } }, '⌂'),
    h('span', { style: { borderBottom: '2px solid #1473e6', paddingBottom: '12px', marginTop: '12px', color: '#1473e6', fontWeight: 600 } }, 'Create'),
    h('span', { style: { opacity: 0.55 } }, 'Use'),
    h('span', { style: { flex: 1 } }),
    h('b', { id: 'leo-title', style: { fontWeight: 600 } }, 'Untitled'),
    h('span', { style: { flex: 1 } }),
    btn('Share', () => copy(exportCSS(), 'Theme URL stub'), 'pri'));

  const body = h('div', { style: { display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 0, overflow: 'hidden' } });
  const side = h('div', { style: { background: '#fff', borderRight: '1px solid #e6e6e6', padding: '14px', display: 'grid', alignContent: 'start', gap: '10px', overflow: 'auto' } });
  const main = h('div', { style: { padding: '18px 22px', overflow: 'auto' } });

  const relLum = (hex) => {
    const [r, g, b] = hexToRgb(hex).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrastOf = (a, b) => {
    const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };
  const badge = (ratio) => {
    if (ratio >= 7) return { lab: 'AAA', ok: true, col: '#0e7a3d' };
    if (ratio >= target) return { lab: 'AA', ok: true, col: '#1473e6' };
    if (ratio >= 3) return { lab: 'AA Large', ok: true, col: '#b26a00' };
    return { lab: 'Fail', ok: false, col: '#c9252d' };
  };
  const buildRamp = () => {
    // Generate tonal ramp targeting RATIOS against bg, tinted by key hue
    const [L, C, H] = hexToOklch(key);
    const bgL = relLum(bg);
    const wantDarker = bgL > 0.5;
    return RATIOS.map((ratio, i) => {
      // binary search lightness for approximate contrast
      let lo = 0.05, hi = 0.98, best = 0.5;
      for (let k = 0; k < 18; k++) {
        const mid = (lo + hi) / 2;
        const hx = oklchToHex(mid, C * (0.55 + i * 0.06), H);
        const r = contrastOf(hx, bg);
        best = mid;
        if (wantDarker) {
          if (r < ratio) hi = mid; else lo = mid;
        } else {
          if (r < ratio) lo = mid; else hi = mid;
        }
      }
      const hx = oklchToHex(best, Math.max(0.02, C * (0.4 + i * 0.08)), H);
      const r = contrastOf(hx, bg);
      return { label: LABELS[i], hex: hx, ratio: r, target: ratio };
    });
  };
  const exportCSS = () => {
    const ramp = buildRamp();
    return `:root {\n  --leo-bg: ${bg};\n  --leo-key: ${key};\n  --leo-contrast-target: ${target};\n${ramp.map((s) => `  --${scaleName.toLowerCase()}-${s.label}: ${s.hex}; /* ${s.ratio.toFixed(2)}:1 */`).join('\n')}\n}`;
  };
  const exportJSON = () => {
    const ramp = buildRamp();
    return JSON.stringify({ name: scaleName, background: bg, key, contrastTarget: target, mode, colors: Object.fromEntries(ramp.map((s) => [s.label, s.hex])) }, null, 2);
  };

  const draw = () => {
    const ramp = buildRamp();
    const previewBg = mode === 'dark' ? '#1b1b1b' : bg;
    const previewFg = mode === 'dark' ? ramp[4].hex : ramp[5].hex;
    side.replaceChildren(
      h('div.k-row', { style: { gap: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' } },
        h('b', { style: { color: '#1473e6', borderBottom: '2px solid #1473e6', paddingBottom: '6px' } }, 'Color scales'),
        h('span', { style: { opacity: 0.45 } }, 'Lightness stops')),
      h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } },
        btn('+ Add color', () => { key = oklchToHex(0.62, 0.14, Math.random() * 360); scaleName = 'Accent'; draw(); toast('Scale recolored'); }),
        btn('Sort', () => { RATIOS.sort((a, b) => a - b); draw(); })),
      h('div', { style: { border: '1px solid #e6e6e6', borderRadius: '10px', padding: '10px', display: 'grid', gap: '8px' } },
        h('div.k-row', {},
          h('div', { style: { width: '36px', height: '36px', borderRadius: '6px', background: `linear-gradient(90deg,${ramp[0].hex},${ramp[5].hex})`, border: '1px solid #ddd' } }),
          h('b', {}, scaleName), h('span', { style: { flex: 1 } }), h('span', { style: { opacity: 0.4 } }, '✎')),
        h('label', { style: { fontSize: '12px', opacity: 0.7 } }, 'Key color'),
        h('div.k-row', {},
          h('input', { type: 'color', value: key, oninput: (e) => { key = e.target.value; draw(); } }),
          h('input', { value: key, style: { flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'monospace' }, oninput: (e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) { key = e.target.value; draw(); } } })),
        h('label', { style: { fontSize: '12px', opacity: 0.7 } }, 'Background'),
        h('div.k-row', {},
          h('input', { type: 'color', value: bg, oninput: (e) => { bg = e.target.value; draw(); } }),
          h('input', { value: bg, style: { flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'monospace' }, oninput: (e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) { bg = e.target.value; draw(); } } })),
        h('div.k-h', {}, 'Contrast target'),
        seg([['3', '3:1'], ['4.5', '4.5:1'], ['7', '7:1']], String(target), (v) => { target = +v; draw(); }),
      ),
      h('div.k-h', {}, 'Adaptive preview'),
      seg([['light', 'Light'], ['dark', 'Dark']], mode, (v) => { mode = v; draw(); }),
      btn('Export CSS vars', () => copy(exportCSS(), 'CSS copied'), 'pri'),
      btn('Export JSON', () => copy(exportJSON(), 'JSON copied')),
    );

    const swatches = ramp.map((s) => {
      const b = badge(s.ratio);
      const fg = contrastOf(s.hex, '#ffffff') > contrastOf(s.hex, '#111111') ? '#fff' : '#111';
      return h('div', { style: { width: '92px', height: '92px', borderRadius: '10px', background: s.hex, color: fg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px', boxShadow: '0 1px 0 #0001 inset', border: '1px solid #0001' } },
        h('b', { style: { fontSize: '13px' } }, s.label),
        h('div', {},
          h('div', { style: { fontSize: '11px', fontWeight: 700 } }, `${s.ratio.toFixed(2)}:1`),
          h('div', { style: { fontSize: '10px', marginTop: '2px', background: b.col, color: '#fff', display: 'inline-block', padding: '1px 6px', borderRadius: '99px' } }, b.lab)));
    });

    main.replaceChildren(
      h('div.k-row', { style: { gap: '18px', marginBottom: '14px', borderBottom: '1px solid #e8e8e8', paddingBottom: '8px' } },
        ...['Theme colors', 'Chromaticity', 'Lightness', '3d model'].map((name) => h('button', {
          style: { border: 0, background: 'transparent', padding: '6px 2px', borderBottom: tab === name ? '2px solid #1473e6' : '2px solid transparent', color: tab === name ? '#1473e6' : '#666', fontWeight: tab === name ? 700 : 500 },
          onclick: () => { tab = name; draw(); },
        }, name))),
      h('div', { style: { background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '20px', boxShadow: '0 1px 2px #00000008' } },
        h('div.k-row', { style: { gap: '12px', marginBottom: '18px' } },
          h('b', {}, 'Background color'),
          h('div', { style: { width: '48px', height: '48px', borderRadius: '8px', background: bg, border: '1px solid #ddd' } }),
          h('span', { style: { fontFamily: 'monospace', fontSize: '12px', opacity: 0.7 } }, bg)),
        h('div.k-row', { style: { marginBottom: '10px' } }, h('b', {}, scaleName), h('span', { style: { flex: 1 } }), h('span', { style: { fontSize: '12px', opacity: 0.55 } }, `target ≥ ${target}:1`)),
        h('div.k-row', { style: { gap: '10px', flexWrap: 'wrap' } }, ...swatches),
        h('div', { style: { marginTop: '22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' } },
          h('div', { style: { borderRadius: '12px', background: previewBg, color: previewFg, padding: '18px', border: '1px solid #0001', minHeight: '140px' } },
            h('div', { style: { fontSize: '11px', opacity: 0.6, marginBottom: '8px' } }, `Adaptive · ${mode}`),
            h('b', { style: { fontSize: '22px' } }, 'UI preview'),
            h('p', { style: { opacity: 0.85, lineHeight: 1.5 } }, 'Accessible theme tokens update with contrast target and key color.'),
            h('button', { style: { marginTop: '8px', background: ramp[4].hex, color: contrastOf(ramp[4].hex, '#fff') > 3 ? '#fff' : '#111', border: 0, borderRadius: '8px', padding: '8px 12px', fontWeight: 700 } }, 'Primary action')),
          h('pre.k-code', { style: { background: '#1e1e1e', color: '#d7e3ff', maxHeight: '200px' } }, exportCSS())),
      ),
    );
  };

  body.append(side, main);
  shell.append(header, body);
  root.append(shell);
  draw();
  window.__demoProof = async () => {
    key = '#3b6df0'; bg = '#ffffff'; target = 4.5; mode = 'light'; scaleName = 'Blue';
    draw();
    await sleep(60);
    target = 7; draw();
    await sleep(40);
    mode = 'dark'; draw();
    await copy(exportCSS(), 'CSS');
    mode = 'light'; target = 4.5; draw();
    return 'key+target 7:1 → WCAG badges; dark adaptive preview; CSS exported; restored';
  };
};


V['colorbox-palette-system-desk'] = (root, T) => {
  theme(root, T, { bg: '#ebebeb', fg: '#1a1a1a', panel: '#ffffff', ac: '#2732e6', ac2: '#040675', dark: false, line: '#00000014' });
  root.style.overflow = 'hidden';

  let mode = 'HSV'; // HSV | OKLCH
  let hueStart = 220, hueEnd = 240;
  let satStart = 0.08, satEnd = 1;
  let briStart = 1, briEnd = 0.22;
  let steps = 11;
  let locked = false;
  let name = 'Blue';

  const ease = (t, kind = 'easeOut') => {
    if (kind === 'linear') return t;
    if (kind === 'easeIn') return t * t;
    return 1 - (1 - t) * (1 - t);
  };

  const shell = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '48px 1fr', background: '#ebebeb' } });
  const header = h('div.k-row', { style: { background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '0 16px', gap: '14px' } },
    h('b', { style: { fontSize: '15px' } }, 'ColorBox ', h('span', { style: { fontWeight: 500, opacity: .55 } }, 'by Kevyn')),
    h('span', { style: { flex: 1 } }),
    btn('Import', () => toast('import stub')),
    btn('Export', () => copy(exportCSS(), 'CSS vars'), 'pri'),
  );

  const body = h('div', { style: { display: 'grid', gridTemplateColumns: '200px 1fr 300px', minHeight: 0, overflow: 'hidden' } });
  const left = h('div', { style: { background: '#fff', borderRight: '1px solid #e4e4e4', padding: '14px', display: 'grid', alignContent: 'start', gap: '10px' } });
  const stage = h('div', { style: { display: 'grid', placeItems: 'center', padding: '24px', overflow: 'auto' } });
  const right = h('div', { style: { background: '#fff', borderLeft: '1px solid #e4e4e4', padding: '14px', overflow: 'auto', display: 'grid', alignContent: 'start', gap: '10px' } });

  const buildRamp = () => {
    const out = [];
    for (let i = 0; i < steps; i++) {
      const t = steps === 1 ? 0 : i / (steps - 1);
      const te = ease(t, 'easeOut');
      const H = hueStart + (hueEnd - hueStart) * te;
      const S = satStart + (satEnd - satStart) * te;
      const B = briStart + (briEnd - briStart) * te;
      let hex;
      if (mode === 'OKLCH') {
        // map B→L, S→C roughly
        hex = oklchToHex(clamp(B, 0.05, 0.98), clamp(S * 0.22, 0, 0.3), ((H % 360) + 360) % 360);
      } else {
        // HSV-ish via HSL approx: V≈L scaled
        const L = clamp(B * (1 - S * 0.35), 0.04, 0.97) * 100;
        const Ss = clamp(S * 100, 0, 100);
        hex = hsl(((H % 360) + 360) % 360, Ss, L);
      }
      out.push({ i, hex, H, S, B, crW: contrast(hex, '#ffffff'), crB: contrast(hex, '#000000') });
    }
    return out;
  };

  const exportCSS = () => {
    const ramp = buildRamp();
    return `:root {
${ramp.map((s, i) => `  --${name.toLowerCase()}-${i}: ${s.hex};`).join('\n')}
}
/* hex list */
${ramp.map((s) => s.hex).join(', ')}`;
  };

  const draw = () => {
    if (locked) return;
    const ramp = buildRamp();
    left.replaceChildren(
      h('div.k-h', {}, 'Colors'),
      h('div.k-row', { style: { gap: '8px', background: '#f3f4ff', border: '1px solid #d0d4ff', borderRadius: '999px', padding: '6px 10px' } },
        h('div', { style: { width: '18px', height: '18px', borderRadius: '50%', background: ramp[Math.floor(steps / 2)].hex, border: '1px solid #0002' } }),
        h('b', { style: { fontSize: '13px' } }, name),
        h('span', { style: { flex: 1 } }),
        h('span', { style: { opacity: .4, cursor: 'pointer' }, onclick: () => toast('locked tone') }, '✕'),
      ),
      btn('+ Add color', () => { name = 'Accent'; hueStart = (hueStart + 80) % 360; hueEnd = (hueEnd + 60) % 360; draw(); }),
      h('div.k-h', {}, 'Major steps'),
      h('div.k-row', {},
        btn('−', () => { steps = clamp(steps - 1, 3, 21); draw(); }),
        h('b', { style: { minWidth: '36px', textAlign: 'center', fontSize: '18px' } }, String(steps)),
        btn('+', () => { steps = clamp(steps + 1, 3, 21); draw(); }),
      ),
      toggle('Lock ramp', locked, (v) => { locked = v; toast(v ? 'locked' : 'unlocked'); }),
    );

    // find contrast marker indices vs white
    let m3 = -1, m45 = -1;
    ramp.forEach((s, i) => {
      if (m3 < 0 && s.crW >= 3) m3 = i;
      if (m45 < 0 && s.crW >= 4.5) m45 = i;
    });

    const rampEl = h('div', { style: { width: 'min(420px, 70%)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 12px 40px #00000018', border: '1px solid #00000010', position: 'relative' } },
      h('div.k-row', { style: { background: '#fff', padding: '10px 14px', borderBottom: '1px solid #eee' } },
        h('b', {}, name), h('span', { style: { flex: 1 } }), h('span', { style: { fontSize: '12px', opacity: .55 } }, `${steps} steps · ${mode}`)),
      ...ramp.map((s, i) => {
        const fg = fgOn(s.hex);
        const markers = [];
        if (i === m3) markers.push(h('div', { style: { position: 'absolute', left: '-70px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#666', whiteSpace: 'nowrap' } }, '—— 3:1'));
        if (i === m45) markers.push(h('div', { style: { position: 'absolute', left: '-78px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#666', whiteSpace: 'nowrap' } }, '—— 4.5:1'));
        return h('div', {
          style: {
            position: 'relative', height: '52px', background: s.hex, color: fg, display: 'grid',
            gridTemplateColumns: '48px 1fr auto', alignItems: 'center', padding: '0 14px', gap: '10px',
            borderTop: (i === m3 || i === m45) ? '2px solid #fff' : '0',
          },
          onclick: () => copy(s.hex, 'Hex'),
        },
          h('b', { style: { fontSize: '13px' } }, String(i)),
          h('span', { style: { fontFamily: 'JetBrains Mono Variable,ui-monospace,monospace', fontSize: '12px' } }, s.hex),
          h('span', { style: { fontSize: '11px', opacity: .85 } }, mode === 'OKLCH'
            ? `L${s.B.toFixed(2)} C${(s.S * 0.22).toFixed(2)} H${s.H.toFixed(0)}`
            : `H${s.H.toFixed(0)} S${s.S.toFixed(2)} B${s.B.toFixed(2)}`),
          ...markers,
        );
      }),
    );
    stage.replaceChildren(rampEl);

    const hs = slider('Hue start', 0, 360, hueStart, 1, (v) => { hueStart = v; draw(); });
    const he = slider('Hue end', 0, 360, hueEnd, 1, (v) => { hueEnd = v; draw(); });
    const ss = slider('Sat start', 0, 1, satStart, 0.01, (v) => { satStart = v; draw(); }, (v) => (+v).toFixed(2));
    const se = slider('Sat end', 0, 1, satEnd, 0.01, (v) => { satEnd = v; draw(); }, (v) => (+v).toFixed(2));
    const bs = slider('Bright start', 0, 1, briStart, 0.01, (v) => { briStart = v; draw(); }, (v) => (+v).toFixed(2));
    const be = slider('Bright end', 0, 1, briEnd, 0.01, (v) => { briEnd = v; draw(); }, (v) => (+v).toFixed(2));

    right.replaceChildren(
      h('div.k-h', {}, 'Color space'),
      seg([['HSV', 'HSV'], ['OKLCH', 'OKLCH']], mode, (v) => { mode = v; draw(); }),
      h('div.k-h', {}, 'Hue'),
      hs, he,
      h('div.k-h', {}, 'Saturation'),
      ss, se,
      h('div.k-h', {}, 'Brightness / Lightness'),
      bs, be,
      h('div.k-h', {}, 'Export'),
      codebox(() => exportCSS().split('/*')[0].trim()),
      btn('Copy CSS variables', () => copy(exportCSS(), 'Exported'), 'pri'),
      btn('Copy hex list', () => copy(buildRamp().map((s) => s.hex).join('\n'), 'Hex list')),
    );
  };

  body.append(left, stage, right);
  shell.append(header, body);
  root.append(shell);
  // unlock for initial paint
  locked = false;
  draw();

  window.__demoProof = async () => {
    locked = false;
    hueStart = 200; hueEnd = 260; steps = 11; mode = 'HSV'; draw();
    await sleep(80);
    hueStart = 12; hueEnd = 40; steps = 9; name = 'Warm'; draw();
    await sleep(60);
    mode = 'OKLCH'; steps = 13; draw();
    await sleep(40);
    mode = 'HSV'; hueStart = 220; hueEnd = 240; steps = 11; name = 'Blue'; draw();
    return 'hue start/steps regenerated ramp · OKLCH pass · restored Blue HSV';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['palette-lock-export'])(root, T); }
