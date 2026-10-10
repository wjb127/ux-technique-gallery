import '@fontsource-variable/fraunces';
import '@fontsource-variable/roboto-flex/full.css';
import '@fontsource/press-start-2p';
import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, blip, audio, css } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle } from '../kit.js';
const MONO = "'JetBrains Mono Variable',monospace";
const V = {};
const cssEditor = (pre, post, val, on, { bg = '#f1f1f1', fg = '#333', lines = 10 } = {}) => { const ta = h('textarea', { spellcheck: false, style: { width: '100%', height: '48px', border: 0, outline: 'none', resize: 'none', background: '#fff', font: `15px/24px ${MONO}`, padding: '0 10px' } }); ta.value = val; ta.addEventListener('input', () => on(ta.value)); return { el: h('div', { style: { background: bg, color: fg, borderRadius: '4px', display: 'grid', gridTemplateColumns: '30px 1fr', font: `15px/24px ${MONO}`, overflow: 'hidden' } }, h('pre', { style: { margin: 0, padding: '8px 4px', background: '#ddd', color: '#999', textAlign: 'right' } }, Array.from({ length: lines }, (_, i) => i + 1).join('\n')), h('div', { style: { padding: '8px 0' } }, h('pre', { style: { margin: '0 10px' } }, pre), ta, h('pre', { style: { margin: '0 10px' } }, post))), ta }; };
V['css-grid-garden-puzzle'] = (root, T) => {
  theme(root, T, { bg: '#4fa75a', fg: '#fff', ac: '#e7a04e', dark: true });
  const LV = [{ txt: 'Grid Garden-ish에 오신 것을 환영합니다. CSS grid로 당근밭에 물을 주세요. grid-column-start 속성으로 물 영역을 옮겨 보세요.', carrot: [3, 1, 1, 1], prop: 'grid-column-start: ', ans: (v) => /grid-column-start:\s*3/.test(v) }, { txt: '이제 grid-column-start와 grid-column-end를 모두 사용해 보세요.', carrot: [1, 1, 3, 1], prop: 'grid-column: ', ans: (v) => /grid-column:\s*1\s*\/\s*4/.test(v) || /grid-column:\s*1\s*\/\s*span 3/.test(v) }, { txt: 'grid-row 를 사용해 세로로 물을 주세요.', carrot: [4, 2, 1, 3], prop: 'grid-area: ', ans: (v) => /grid-area:\s*2\s*\/\s*4\s*\/\s*5\s*\/\s*5/.test(v) }]; let L = 0, val = '';
  const garden = h('div', { style: { width: '460px', height: '460px', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gridTemplateRows: 'repeat(5,1fr)', background: 'repeating-linear-gradient(0deg,#8a5a2b 0 3px,#a26b35 3px 92px)', border: '10px solid #6b4423', position: 'relative' } });
  const water = h('div', { style: { background: 'repeating-linear-gradient(45deg,#4fb3e8 0 10px,#66c2f0 10px 20px)', opacity: 0.75, gridColumn: '1', gridRow: '1', zIndex: 1 } });
  const txt = h('p', { style: { lineHeight: 1.6, fontSize: '15px' } }); const lvl = h('span');
  const ed = cssEditor('#garden {\n  display: grid;\n  grid-template-columns: 20% 20% 20% 20% 20%;\n  grid-template-rows: 20% 20% 20% 20% 20%;\n}\n\n#water {', '}', '', (v) => { val = v; apply(); }, { lines: 10 });
  const next = h('button', { style: { background: '#e7a04e', color: '#fff', border: 0, padding: '8px 18px', borderRadius: '4px', float: 'right', opacity: .5 }, onclick: () => { if (LV[L].ans(val)) { L = (L + 1) % LV.length; load(); } } }, '다음');
  const apply = () => { water.style.cssText = water.style.cssText.replace(/grid-[^;]+;/g, ''); water.setAttribute('style', `background:repeating-linear-gradient(45deg,#4fb3e8 0 10px,#66c2f0 10px 20px);opacity:.75;z-index:1;grid-column:1;grid-row:1;${val}`); const ok = LV[L].ans(val); next.style.opacity = ok ? 1 : 0.5; next.style.animation = ok ? 'pulse 1s infinite' : ''; };
  const load = () => { const lv = LV[L]; txt.textContent = lv.txt; lvl.textContent = `레벨 ${L + 1} / 28`; ed.ta.value = lv.prop.split(':')[0] + ': '; val = ed.ta.value; const [c, r, w, hh] = lv.carrot; garden.replaceChildren(water, ...Array.from({ length: w * hh }, (_, i) => h('div', { style: { gridColumn: c + (i % w), gridRow: r + Math.floor(i / w), display: 'grid', placeItems: 'center', fontSize: '44px', zIndex: 2 } }, '🥕'))); apply(); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = 'minmax(0,1fr) minmax(0,1fr)'; root.style.padding = '20px 30px'; root.style.gap = '30px';
  root.append(h('div', {}, h('div.k-row', {}, h('b', { style: { fontSize: '26px', letterSpacing: '.05em' } }, 'GRID GARDEN-ish'), h('span', { style: { flex: 1 } }), h('span', { style: { background: '#3d8a47', padding: '4px 12px', borderRadius: '4px', fontSize: '13px' } }, '◀ ', lvl, ' ▶')), txt, h('p', { style: { fontSize: '13px', opacity: .85 } }, '예를 들어 grid-column-start: 3; 은 물을 3번째 세로선에서 시작하게 합니다.'), ed.el, h('div', { style: { marginTop: '10px' } }, next), h('div', { style: { fontSize: '12px', opacity: .7, marginTop: '50px', textAlign: 'center' } }, 'Grid Garden-ish · Flexbox Froggy-ish 의 제작자가 만든 게임을 오마주')), h('div', { style: { display: 'grid', placeItems: 'center' } }, garden));
  load();
  window.__demoProof = async () => { ed.ta.value = 'grid-column-start: 3;'; ed.ta.dispatchEvent(new Event('input')); return 'answered level 1 → water covers carrot, 다음 enabled'; };
};
V['flexbox-pond-level-puzzle'] = (root, T) => {
  theme(root, T, { bg: '#4fa75a', fg: '#fff', ac: '#d9534f', dark: true });
  const LV = [{ t: 'Flexbox Froggy-ish에 오신 것을 환영합니다. justify-content 속성으로 개구리를 연잎으로 보내 주세요.', n: 1, pad: 'flex-end', prop: 'justify-content', col: ['#5cb85c'] }, { t: 'justify-content를 다시 사용해 개구리들을 가운데 연잎으로 보내세요.', n: 2, pad: 'center', prop: 'justify-content', col: ['#5cb85c', '#f0ad4e'] }, { t: 'align-items 로 개구리들을 아래로 보내 주세요.', n: 3, pad: 'flex-end', prop: 'align-items', col: ['#5cb85c', '#f0ad4e', '#d9534f'] }]; let L = 0, val = '';
  const pond = h('div', { style: { position: 'absolute', inset: 0, background: '#1f5768', padding: '20px' } }); const frogs = h('div', { style: { position: 'absolute', inset: '20px', display: 'flex', zIndex: 2 } }); const pads = h('div', { style: { position: 'absolute', inset: '20px', display: 'flex' } }); pond.append(pads, frogs);
  const txt = h('p', { style: { lineHeight: 1.6 } }); const lvl = h('span'); const next = h('button', { style: { background: '#d9534f', color: '#fff', border: 0, padding: '8px 18px', borderRadius: '4px', float: 'right', opacity: .5 }, onclick: () => { if (ok()) { L = (L + 1) % LV.length; load(); } } }, '다음');
  const ok = () => new RegExp(`${LV[L].prop}\\s*:\\s*${LV[L].pad}`).test(val);
  const ed = cssEditor('#pond {\n  display: flex;', '}', '', (v) => { val = v; frogs.setAttribute('style', `position:absolute;inset:20px;display:flex;z-index:2;${v}`); next.style.opacity = ok() ? 1 : 0.5; });
  const frog = (c) => h('div', { style: { width: '90px', height: '90px', display: 'grid', placeItems: 'center' } }, s('svg', { viewBox: '0 0 40 30', width: 60 }, s('ellipse', { cx: 20, cy: 18, rx: 16, ry: 11, fill: c }), s('circle', { cx: 11, cy: 7, r: 6, fill: c }), s('circle', { cx: 29, cy: 7, r: 6, fill: c }), s('circle', { cx: 11, cy: 7, r: 3, fill: '#fff' }), s('circle', { cx: 29, cy: 7, r: 3, fill: '#fff' }), s('circle', { cx: 11, cy: 7, r: 1.5, fill: '#000' }), s('circle', { cx: 29, cy: 7, r: 1.5, fill: '#000' })));
  const pad = (c) => h('div', { style: { width: '90px', height: '90px', display: 'grid', placeItems: 'center' } }, s('svg', { viewBox: '0 0 40 40', width: 80 }, s('path', { d: 'M20 20L38 14A19 19 0 1 1 30 4Z', fill: c, opacity: 0.85 })));
  const load = () => { const lv = LV[L]; txt.textContent = lv.t; lvl.textContent = `레벨 ${L + 1} / 24`; pads.setAttribute('style', `position:absolute;inset:20px;display:flex;${lv.prop}:${lv.pad}`); pads.replaceChildren(...lv.col.map((c) => pad(c === '#5cb85c' ? '#3c8d3c' : c === '#f0ad4e' ? '#c98a2e' : '#a83a36'))); frogs.replaceChildren(...lv.col.map(frog)); ed.ta.value = ''; val = ''; frogs.setAttribute('style', 'position:absolute;inset:20px;display:flex;z-index:2'); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = 'minmax(0,1fr) minmax(0,1fr)';
  root.append(h('div', { style: { padding: '20px 30px' } }, h('div.k-row', {}, h('b', { style: { fontSize: '24px' } }, 'FLEXBOX FROGGY-ish'), h('span', { style: { flex: 1 } }), h('span', { style: { background: '#3d8a47', padding: '4px 12px', borderRadius: '4px', fontSize: '13px' } }, '◀ ', lvl, ' ▶')), txt, h('ul', { style: { fontSize: '13px', lineHeight: 1.8 } }, ...['flex-start: 요소들을 컨테이너의 왼쪽으로 정렬합니다.', 'flex-end: 요소들을 컨테이너의 오른쪽으로 정렬합니다.', 'center: 요소들을 컨테이너의 가운데로 정렬합니다.', 'space-between: 요소들 사이에 동일한 간격을 둡니다.', 'space-around: 요소들 주위에 동일한 간격을 둡니다.'].map((t) => h('li', {}, h('b', {}, t.split(':')[0]), ':' + t.split(':')[1]))), ed.el, h('div', { style: { marginTop: '10px' } }, next)), h('div', { style: { position: 'relative' } }, pond));
  load();
  window.__demoProof = async () => { ed.ta.value = 'justify-content: flex-end;'; ed.ta.dispatchEvent(new Event('input')); return 'frog moved to lilypad via justify-content'; };
};
V['cssbattle-daily-targets-desk'] = (root, T) => {
  theme(root, T, { bg: '#0f1318', fg: '#e3e6ea', panel: '#171c22', ac: '#ffcc4d', acfg: '#000', dark: true });
  const TG = [{ n: 'Flag', bg: '#f4f4f4', html: '<div style="position:absolute;left:100px;top:60px;width:200px;height:180px;background:repeating-linear-gradient(#d33 0 20px,#fff 20px 40px)"></div><div style="position:absolute;left:100px;top:60px;width:90px;height:80px;background:#335"></div>' }, { n: 'Magnet', bg: '#fff', html: '<div style="position:absolute;left:130px;top:50px;width:140px;height:180px;border:28px solid #5b4b9b;border-top:0;border-radius:0 0 100px 100px;box-sizing:border-box"></div><div style="position:absolute;left:130px;top:50px;width:28px;height:30px;background:#e8e3f5"></div><div style="position:absolute;left:242px;top:50px;width:28px;height:30px;background:#e8e3f5"></div>' }, { n: 'Pixel TV', bg: '#6b8a7a', html: '<div style="position:absolute;left:110px;top:70px;width:180px;height:140px;background:#e0e8e0;border-radius:14px;border:10px solid #3b4a44"></div>' }];
  let cur = 1; const ta = h('textarea', { spellcheck: false, style: { width: '100%', height: '100%', background: '#0b0e12', color: '#ffd479', border: 0, font: `13px/1.6 ${MONO}`, padding: '10px', resize: 'none', outline: 'none' } });
  const mk = (html, bg) => h('div', { style: { width: '400px', height: '300px', position: 'relative', overflow: 'hidden', background: bg }, html });
  const out = h('div'), tgt = h('div'), score = h('b', { style: { color: '#ffcc4d' } });
  const rate = () => { const A = out.firstChild, B = tgt.firstChild; if (!A || !B) return; const cells = []; const probe = (el) => { const r = el.getBoundingClientRect(); const acc = []; for (let y = 5; y < 300; y += 15) for (let x = 5; x < 400; x += 15) { const e = document.elementFromPoint(r.left + x, r.top + y); acc.push(e ? getComputedStyle(e).backgroundColor + getComputedStyle(e).borderTopColor : ''); } return acc; }; const a = probe(A), b = probe(B); let m = 0; a.forEach((v, i) => (m += v === b[i] ? 1 : 0)); score.textContent = `Match ${((m / a.length) * 100).toFixed(1)}%`; };
  const run = () => { out.replaceChildren(mk(ta.value, '#fff')); requestAnimationFrame(rate); };
  ta.addEventListener('input', run);
  const card = (t, i) => h('div', { style: { background: '#171c22', border: i === cur ? '2px solid #ffcc4d' : '1px solid #2a313a', borderRadius: '10px', padding: '10px', cursor: 'pointer', transform: i === cur ? 'scale(1.04)' : '' }, onclick: () => { cur = i; drawCards(); openT(); } }, h('div', { style: { transform: 'scale(.4)', transformOrigin: '0 0', width: '160px', height: '120px' } }, mk(t.html, t.bg)), h('div.k-row', { style: { fontSize: '12px', marginTop: '6px' } }, h('span', {}, t.n), h('span', { style: { flex: 1 } }), h('span', { style: { opacity: .6 } }, i === cur ? 'Not played' : 'Not played')));
  const cards = h('div', { style: { display: 'flex', gap: '18px' } }); const drawCards = () => cards.replaceChildren(...TG.map(card));
  const openT = () => { const t = TG[cur]; tgt.replaceChildren(mk(t.html, t.bg)); ta.value = `<div></div>\n<style>\n  div {\n    width: 100px;\n    height: 100px;\n    background: #5b4b9b;\n  }\n</style>`; run(); };
  root.style.display = 'grid'; root.style.gridTemplateColumns = '200px 1fr';
  root.append(h('div', { style: { background: '#11161b', padding: '14px', fontSize: '13px', display: 'grid', gap: '12px', alignContent: 'start', borderRight: '1px solid #222' } }, h('b', { style: { color: '#ffcc4d' } }, '⟨/⟩ CSSBattle-ish'), ...['Home', 'Battles', 'Daily Targets', 'Versus', 'Leaderboard', 'Learn CSS'].map((t, i) => h('div', { style: { opacity: i === 2 ? 1 : .6, color: i === 2 ? '#ffcc4d' : '' } }, t))), h('div', { style: { padding: '20px 30px', overflow: 'auto', display: 'grid', gap: '18px', alignContent: 'start' } }, h('div', { style: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', alignItems: 'center' } }, h('div', { style: { height: '120px', borderRadius: '10px', background: 'linear-gradient(135deg,#3b2f63,#1a3a4a)', display: 'grid', placeItems: 'center', font: `900 40px ${MONO}`, color: '#ffcc4d' } }, '[X]'), h('div', {}, h('div', { style: { fontSize: '26px', fontWeight: 800 } }, 'CSSBattle-ish — CSS Battles, Games & Coding Challenges'), h('p', { style: { opacity: .7, fontSize: '13px' } }, 'Replicate the target with the smallest possible CSS. Your output is compared pixel-by-pixel to compute a match score.'))), h('div', { style: { background: '#171c22', borderRadius: '12px', padding: '16px' } }, h('div.k-row', {}, h('b', {}, '📅 Daily Targets'), h('span', { style: { flex: 1 } }), btn('View all daily targets', () => {})), h('div', { style: { marginTop: '12px' } }, cards)), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 400px 400px', gap: '12px', height: '340px' } }, h('div', { style: { display: 'grid', gridTemplateRows: '24px 1fr', background: '#0b0e12', borderRadius: '8px', overflow: 'hidden' } }, h('div.k-row', { style: { fontSize: '11px', padding: '0 10px' } }, 'EDITOR', h('span', { style: { flex: 1 } }), score), ta), h('div', {}, h('div', { style: { fontSize: '11px', marginBottom: '4px' } }, 'YOUR OUTPUT'), out), h('div', {}, h('div', { style: { fontSize: '11px', marginBottom: '4px' } }, 'TARGET'), tgt))));
  drawCards(); openT();
  window.__demoProof = async () => { ta.value = TG[1].html; run(); await sleep(100); rate(); return 'wrote CSS → match score computed vs target'; };
};
V['git-branching-graph-terminal'] = (root, T) => {
  theme(root, T, { bg: '#2c3e50', fg: '#eee', ac: '#27ae60', dark: true });
  const G = { commits: { C0: { p: [], x: 0, y: 0 }, C1: { p: ['C0'], x: 1, y: 0 } }, branches: { main: 'C1' }, HEAD: 'main', n: 2 };
  const svg = s('svg', { viewBox: '-60 -40 700 420', style: 'width:100%;height:100%' }); const log = h('div', { style: { font: `13px/1.6 ${MONO}`, maxHeight: '100%', overflow: 'auto' } });
  const headC = () => G.branches[G.HEAD] || G.HEAD; const lanes = { main: 0 };
  const draw = () => { const els = []; Object.entries(G.commits).forEach(([id, c]) => c.p.forEach((p) => { const a = G.commits[p]; els.push(s('path', { d: `M${a.x * 90} ${a.y * 90}C${a.x * 90 + 45} ${a.y * 90} ${c.x * 90 - 45} ${c.y * 90} ${c.x * 90} ${c.y * 90}`, stroke: '#ecf0f1', 'stroke-width': 4, fill: 'none', opacity: .6 })); })); Object.entries(G.commits).forEach(([id, c]) => { els.push(s('circle', { cx: c.x * 90, cy: c.y * 90, r: 22, fill: headC() === id ? '#27ae60' : '#ecf0f1', stroke: '#1a252f', 'stroke-width': 3 }), s('text', { x: c.x * 90, y: c.y * 90 + 5, 'text-anchor': 'middle', 'font-size': 14, fill: '#2c3e50', 'font-weight': 700 }, id)); }); Object.entries(G.branches).forEach(([b, id], i) => { const c = G.commits[id]; els.push(s('rect', { x: c.x * 90 - 34, y: c.y * 90 - 64 - (Object.values(G.branches).filter((v, j) => v === id && j < i).length) * 26, width: 68, height: 22, rx: 4, fill: b === G.HEAD ? '#e67e22' : '#3498db' }), s('text', { x: c.x * 90, y: c.y * 90 - 48 - (Object.values(G.branches).filter((v, j) => v === id && j < i).length) * 26, 'text-anchor': 'middle', 'font-size': 12, fill: '#fff' }, b + (b === G.HEAD ? '*' : ''))); }); svg.replaceChildren(...els); };
  const cmd = (line) => { log.append(h('div', {}, h('span', { style: { color: '#27ae60' } }, '$ '), line)); const [g, op, arg] = line.trim().split(/\s+/); if (g !== 'git') { log.append(h('div', { style: { color: '#e74c3c' } }, 'command not found')); return; } const hc = headC(); if (op === 'commit') { const id = 'C' + G.n++; const pc = G.commits[hc]; const lane = lanes[G.HEAD] ?? pc.y; G.commits[id] = { p: [hc], x: pc.x + 1, y: lane }; if (G.branches[G.HEAD]) G.branches[G.HEAD] = id; else G.HEAD = id; } else if (op === 'branch' && arg) { G.branches[arg] = hc; lanes[arg] = Object.keys(lanes).length; } else if ((op === 'checkout' || op === 'switch') && arg) { if (G.branches[arg] || G.commits[arg]) G.HEAD = arg; else log.append(h('div', { style: { color: '#e74c3c' } }, `error: pathspec '${arg}' did not match`)); } else if (op === 'merge' && arg && G.branches[arg]) { const id = 'C' + G.n++; const a = G.commits[hc], b = G.commits[G.branches[arg]]; G.commits[id] = { p: [hc, G.branches[arg]], x: Math.max(a.x, b.x) + 1, y: a.y }; G.branches[G.HEAD] = id; } else log.append(h('div', { style: { color: '#e74c3c' } }, 'unsupported: try commit / branch / checkout / merge')); draw(); log.scrollTop = 1e6; };
  const inp = h('input', { placeholder: 'git commit', style: { width: '100%', background: '#1a252f', color: '#fff', border: 0, padding: '8px', font: `13px ${MONO}`, outline: 'none' }, onkeydown: (e) => { if (e.key === 'Enter' && inp.value) { cmd(inp.value); inp.value = ''; } } });
  const modal = h('div', { style: { position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%,-50%)', width: '720px', background: '#555c64', border: '1px solid #333', borderRadius: '4px', boxShadow: '0 10px 40px #0008', padding: '0 0 20px' } }, h('div', { style: { background: '#3a3f44', padding: '6px 10px', fontSize: '12px' } }, '● ● ●'), h('div', { style: { padding: '14px 30px', lineHeight: 1.7, fontSize: '14px' } }, h('h2', { style: { textAlign: 'center', margin: '4px 0 14px' } }, 'Git 브랜치 배우기-ish에 어서오세요!'), h('p', {}, '깃과 버전 관리를 배우는 데 관심이 있으신가요? 이 게임은 명령어를 입력하면 커밋 그래프가 실시간으로 어떻게 바뀌는지 보여줍니다.'), h('p', {}, '사용할 수 있는 명령: ', h('code', { style: { background: '#333', padding: '1px 5px' } }, 'git commit'), ' ', h('code', { style: { background: '#333', padding: '1px 5px' } }, 'git branch <name>'), ' ', h('code', { style: { background: '#333', padding: '1px 5px' } }, 'git checkout <name>'), ' ', h('code', { style: { background: '#333', padding: '1px 5px' } }, 'git merge <name>')), h('p', {}, '창을 닫고 아래 터미널에 명령을 입력해 보세요.')), h('div.k-row', { style: { justifyContent: 'center', gap: '40px', fontSize: '24px' } }, h('span', { style: { color: '#e74c3c', cursor: 'pointer' }, onclick: () => modal.remove() }, '✖'), h('span', { style: { color: '#2ecc71', cursor: 'pointer' }, onclick: () => modal.remove() }, '➜')));
  root.style.display = 'grid'; root.style.gridTemplateColumns = '380px 1fr';
  root.append(h('div', { style: { background: '#1e2b37', display: 'grid', gridTemplateRows: '1fr auto', padding: '10px' } }, log, inp), h('div', { style: { position: 'relative', background: 'linear-gradient(#5f8fb0,#3d6b8c)' } }, svg), modal);
  draw();
  window.__demoProof = async () => { ['git commit', 'git branch bugFix', 'git checkout bugFix', 'git commit', 'git checkout main', 'git commit', 'git merge bugFix'].forEach(cmd); return 'branch+merge graph built (intro modal shown)'; };
};
V['design-qa-dual-choice-game'] = (root, T) => {
  theme(root, T, { bg: '#1d2340', fg: '#fff', ac: '#8b6cff', dark: true }); root.style.fontFamily = "'VT323',monospace";
  const Q = [{ q: 'Which is the design that is more correct?', a: { r: 14, pad: 12, al: 'left' }, b: { r: 14, pad: 12, al: 'center' }, ok: 'a', why: 'Chat bubbles should align text to the start for readability.' }, { q: 'Which button spacing is better?', a: { r: 6, pad: 4, al: 'left' }, b: { r: 6, pad: 14, al: 'left' }, ok: 'b', why: 'Comfortable padding increases tap accuracy.' }]; let qi = 0, score = 0, picked = null;
  const phone = (v, k) => h('div', { style: { width: '260px', background: '#fff', color: '#222', borderRadius: '14px', padding: '12px', fontFamily: 'Inter Variable', cursor: 'pointer', outline: picked ? (Q[qi].ok === k ? '4px solid #3ecf8e' : picked === k ? '4px solid #ff5a6e' : '') : '' }, onclick: () => { if (picked) return; picked = k; if (Q[qi].ok === k) score++; draw(); } }, h('div.k-row', { style: { fontSize: '10px', opacity: .6 } }, '9:41', h('span', { style: { flex: 1 } }), '▮▮▮'), h('div.k-row', { style: { margin: '10px 0' } }, h('span', { style: { width: '26px', height: '26px', borderRadius: '50%', background: '#ffd166' } }), h('b', { style: { fontSize: '13px' } }, 'Joey Doe')), h('div', { style: { background: '#2f80ed', color: '#fff', borderRadius: v.r + 'px', padding: v.pad + 'px', textAlign: v.al, fontSize: '12px', width: '80%' } }, 'Hello! Do you want to check out the latest release notes?'), h('div', { style: { background: '#eee', borderRadius: v.r + 'px', padding: v.pad + 'px', fontSize: '12px', marginTop: '8px', textAlign: v.al } }, 'Check the pinned message'));
  const body = h('div', { style: { display: 'grid', justifyItems: 'center', gap: '18px', paddingTop: '30px' } });
  const draw = () => { const q = Q[qi]; body.replaceChildren(h('div.k-row', { style: { gap: '40px' } }, phone(q.a, 'a'), phone(q.b, 'b')), h('div', { style: { fontSize: '26px' } }, q.q), picked ? h('div', { style: { fontSize: '20px', color: picked === q.ok ? '#3ecf8e' : '#ff5a6e' } }, (picked === q.ok ? '✓ Correct! ' : '✗ Not quite. ') + q.why) : null, h('div', { style: { border: '2px solid #fff', padding: '4px 30px', fontSize: '22px' } }, `Tutorial ${qi + 1} / 3 · score ${score}`), picked ? h('button', { style: { background: '#8b6cff', color: '#fff', border: 0, padding: '8px 22px', font: "22px 'VT323'" }, onclick: () => { qi = (qi + 1) % Q.length; picked = null; draw(); } }, 'Next ▸') : null); };
  root.append(h('div.k-row', { style: { height: '56px', padding: '0 40px', justifyContent: 'space-between' } }, h('b', { style: { fontSize: '30px', color: '#8b6cff' } }, "Can't Unsee-ish"), h('span', { style: { background: '#8b6cff', padding: '4px 14px' } }, '★ Share')), body);
  draw();
  window.__demoProof = async () => 'dual-choice question ready';
};
V['typing-ritual-live-wpm'] = (root, T) => {
  theme(root, T, { bg: '#323437', fg: '#d1d0c5', ac: '#e2b714', dark: true });
  const WORDS = 'the quick people think about every small thing that makes a day feel lighter and more focused while the world keeps moving so try to type these words as fast as you can without looking down at the keyboard'.split(' ');
  let words = [], typed = '', start = 0, done = false, dur = 30; const wrap = h('div', { style: { font: `26px/1.6 ${MONO}`, maxWidth: '1000px', color: '#646669', position: 'relative', height: '130px', overflow: 'hidden' } }); const stat = h('div', { style: { color: '#e2b714', font: `26px ${MONO}`, height: '34px' } });
  const reset = () => { words = Array.from({ length: 40 }, () => pick(WORDS)); typed = ''; start = 0; done = false; draw(); stat.textContent = ''; };
  const draw = () => { const target = words.join(' '); const out = []; for (let i = 0; i < target.length; i++) { const c = target[i], t = typed[i]; out.push(h('span', { style: { color: t == null ? '' : t === c ? '#d1d0c5' : '#ca4754', borderLeft: i === typed.length ? '2px solid #e2b714' : '2px solid transparent' } }, c)); } wrap.replaceChildren(...out); };
  const tick = () => { if (!start || done) return; const el = (performance.now() - start) / 1000; const correct = [...typed].filter((c, i) => c === words.join(' ')[i]).length; const wpm = (correct / 5) / (el / 60); stat.textContent = `${Math.max(0, Math.ceil(dur - el))}   ${wpm.toFixed(0)} wpm   ${typed.length ? ((correct / typed.length) * 100).toFixed(0) : 100}%`; if (el >= dur) { done = true; stat.textContent = `wpm ${wpm.toFixed(0)} · acc ${((correct / Math.max(1, typed.length)) * 100).toFixed(0)}% · test complete`; } };
  setInterval(tick, 200);
  window.addEventListener('keydown', (e) => { if (done) return; if (e.key === 'Backspace') typed = typed.slice(0, -1); else if (e.key.length === 1) { if (!start) start = performance.now(); typed += e.key; } else return; e.preventDefault(); draw(); tick(); });
  const cookie = h('div', { style: { position: 'absolute', right: '20px', bottom: '20px', width: '320px', background: '#2c2e31', border: '1px solid #444', borderRadius: '8px', padding: '14px', font: `13px ${MONO}`, display: 'grid', gap: '8px' } }, h('div', {}, '🍪 We use cookies by the way'), h('div', { style: { opacity: .7 } }, 'Cookies enhance your experience and help us improve our website.'), h('button', { style: { background: '#e2b714', border: 0, padding: '6px', font: `13px ${MONO}` }, onclick: () => cookie.remove() }, 'accept all'), h('button', { style: { background: '#3a3c3f', color: '#d1d0c5', border: 0, padding: '6px', font: `13px ${MONO}` }, onclick: () => cookie.remove() }, 'reject non-essential'));
  root.append(h('div.k-row', { style: { height: '70px', padding: '0 12%', font: `28px ${MONO}`, gap: '18px' } }, h('b', { style: { color: '#e2b714' } }, '⌨'), h('span', { style: { color: '#d1d0c5' } }, 'monkeytype-ish'), h('span', { style: { flex: 1 } }), h('span', { style: { fontSize: '18px', color: '#646669' } }, '⌨  👑  ⓘ  ⚙')), h('div.k-row', { style: { justifyContent: 'center', gap: '14px', background: '#2c2e31', width: 'fit-content', margin: '0 auto', padding: '8px 16px', borderRadius: '8px', font: `13px ${MONO}`, color: '#646669' } }, '@ punctuation', '# numbers', '|', '⏱ time', 'A words', '|', ...[15, 30, 60, 120].map((d) => h('span', { style: { color: d === dur ? '#e2b714' : '', cursor: 'pointer' }, onclick: () => { dur = d; reset(); } }, d))), h('div', { style: { padding: '80px 12% 0', display: 'grid', gap: '10px' } }, stat, wrap, h('div', { style: { textAlign: 'center', color: '#646669', cursor: 'pointer', font: `20px ${MONO}` }, onclick: reset }, '↻')), cookie);
  reset();
  window.__demoProof = async () => { start = performance.now() - 4000; typed = words.join(' ').slice(0, 22); draw(); tick(); return 'typed 22 chars → live wpm/accuracy'; };
};
V['interactive-trust-explainer-game'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#222', dark: false }); root.style.fontFamily = "'Fraunces Variable',Georgia,serif";
  const BG = s('svg', { style: 'position:absolute;inset:0;width:100%;height:100%;opacity:.18' }); const R = rng(3); for (let i = 0; i < 80; i++) { const x = R() * 1440, y = R() * 900; BG.append(s('circle', { cx: x, cy: y, r: 16, fill: 'none', stroke: '#222', 'stroke-width': 2 }), s('path', { d: `M${x - 6} ${y + 16}v14M${x + 6} ${y + 16}v14`, stroke: '#222', 'stroke-width': 2 })); if (i) { const px = R() * 1440, py = R() * 900; BG.append(s('line', { x1: x, y1: y, x2: x + (px - x) * 0.1, y2: y + (py - y) * 0.1, stroke: '#222', 'stroke-dasharray': '4 4' })); } }
  const STR = { copycat: (h2) => (h2.length ? h2[h2.length - 1] : 'C'), cheater: () => 'D', cooperator: () => 'C', grudger: (h2) => (h2.includes('D') ? 'D' : 'C'), detective: (h2, i) => (i < 4 ? 'CDCC'[i] : h2.includes('D') ? h2[h2.length - 1] : 'D') };
  const game = h('div', { style: { display: 'none', position: 'absolute', inset: 0, background: '#fff', padding: '40px', textAlign: 'center' } }); let you = 0, them = 0, hist = [], mine = [], round = 0, opp = 'copycat';
  const play = (m) => { const o = STR[opp](mine, round); round++; mine.push(m); hist.push(o); if (m === 'C' && o === 'C') { you += 2; them += 2; } else if (m === 'C') { you -= 1; them += 3; } else if (o === 'C') { you += 3; them -= 1; } else {} drawG(); };
  const drawG = () => game.replaceChildren(h('div', { style: { fontSize: '30px' } }, 'The Game'), h('p', { style: { fontSize: '16px' } }, `You're playing against a mysterious character (${round >= 5 ? opp : '???'}). Put in a coin: they get 3. Cheat: keep it.`), h('div.k-row', { style: { justifyContent: 'center', gap: '80px', margin: '30px 0', fontSize: '60px' } }, h('div', {}, '🙂', h('div', { style: { fontSize: '26px' } }, 'you: ' + you)), h('div', { style: { fontSize: '30px', alignSelf: 'center' } }, mine.slice(-6).map((m, i) => (m === 'C' ? '🪙' : '✋') + (hist.slice(-6)[i] === 'C' ? '🪙' : '✋')).join(' · ')), h('div', {}, '😐', h('div', { style: { fontSize: '26px' } }, 'them: ' + them))), h('div.k-row', { style: { justifyContent: 'center', gap: '20px' } }, h('button', { style: { font: "24px 'Fraunces Variable'", padding: '10px 28px', border: '3px solid #222', background: '#fff', borderRadius: '8px' }, onclick: () => play('C') }, 'COOPERATE'), h('button', { style: { font: "24px 'Fraunces Variable'", padding: '10px 28px', border: '3px solid #222', background: '#fff', borderRadius: '8px' }, onclick: () => play('D') }, 'CHEAT')), h('div', { style: { marginTop: '20px' } }, select(Object.keys(STR), opp, (v) => { opp = v; you = them = round = 0; hist = []; mine = []; drawG(); })));
  root.append(BG, h('div', { style: { position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', textAlign: 'center', background: '#fff', padding: '20px 40px' } }, h('div', { style: { fontSize: '70px', lineHeight: 1, letterSpacing: '.05em' } }, 'THE'), h('div', { style: { fontSize: '110px', lineHeight: 1 } }, 'EVOLUTION'), h('div', { style: { fontSize: '60px', lineHeight: 1 } }, 'OF TRUST'), h('button', { style: { marginTop: '30px', font: "22px 'Fraunces Variable'", padding: '8px 30px', border: '3px solid #222', background: '#fff', borderRadius: '99px', cursor: 'pointer' }, onclick: () => { game.style.display = 'block'; drawG(); } }, 'PLAY →')), h('div.k-row', { style: { position: 'absolute', bottom: 0, left: 0, right: 0, background: '#222', color: '#fff', padding: '4px 12px', fontSize: '12px', fontFamily: 'Inter Variable' } }, '🔊 ON', h('span', { style: { flex: 1 } }), 'an interactive guide to the game theory of why & how we trust each other'), game);
  window.__demoProof = async () => 'title screen; PLAY opens iterated prisoner’s dilemma';
};
V['alchemy-combine-discovery'] = (root, T) => {
  theme(root, T, { bg: '#3a0a2e', fg: '#fff', ac: '#8b6cff', dark: true });
  const RECIPES = { 'earth+water': 'mud', 'fire+water': 'steam', 'air+fire': 'energy', 'earth+fire': 'lava', 'air+water': 'rain', 'air+earth': 'dust', 'lava+water': 'stone', 'earth+rain': 'plant', 'plant+plant': 'garden', 'mud+plant': 'swamp', 'energy+swamp': 'life', 'life+earth': 'human', 'stone+fire': 'metal', 'metal+human': 'tool', 'steam+metal': 'engine' };
  const ICON = { air: '💨', earth: '🌍', fire: '🔥', water: '💧', mud: '🟤', steam: '♨', energy: '⚡', lava: '🌋', rain: '🌧', dust: '🌫', stone: '🪨', plant: '🌱', garden: '🌷', swamp: '🐸', life: '🧬', human: '🧍', metal: '⚙', tool: '🔨', engine: '🚂' };
  const found = new Set(['air', 'earth', 'fire', 'water']); const board = h('div', { style: { position: 'absolute', left: 0, right: '220px', top: 0, bottom: 0 } }); const lib = h('div', { style: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '220px', background: '#2a0621', padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', alignContent: 'start', overflow: 'auto' } }); const cnt = h('div', { style: { position: 'absolute', left: '14px', bottom: '14px', fontSize: '14px', opacity: .8 } });
  const drawLib = () => { lib.replaceChildren(...[...found].map((e) => h('div', { style: { textAlign: 'center', fontSize: '12px', cursor: 'pointer', padding: '6px', background: '#ffffff10', borderRadius: '6px' }, onclick: () => spawn(e, 100 + Math.random() * 500, 100 + Math.random() * 400) }, h('div', { style: { fontSize: '28px' } }, ICON[e]), e))); cnt.textContent = `${found.size} / ${Object.keys(ICON).length} elements`; };
  const spawn = (e, x, y) => { const el = h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', textAlign: 'center', cursor: 'grab', userSelect: 'none', fontSize: '12px', touchAction: 'none' } }, h('div', { style: { fontSize: '44px' } }, ICON[e]), e); el.dataset.e = e; let ox, oy; drag(el, { start: (ev) => { ox = ev.clientX - el.offsetLeft; oy = ev.clientY - el.offsetTop; }, move: (ev) => { el.style.left = ev.clientX - ox + 'px'; el.style.top = ev.clientY - oy + 'px'; }, end: () => { for (const o of board.children) { if (o === el) continue; if (Math.hypot(o.offsetLeft - el.offsetLeft, o.offsetTop - el.offsetTop) < 50) { const k = [el.dataset.e, o.dataset.e].sort().join('+'); const r = RECIPES[k]; if (r) { const isNew = !found.has(r); found.add(r); o.remove(); el.remove(); spawn(r, el.offsetLeft, el.offsetTop); drawLib(); if (isNew) { toast('New element: ' + r); blip(660, 0.2); } } break; } } } }); board.append(el); return el; };
  const splash = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: '#3a0a2e', zIndex: 5 } }, h('div', { style: { textAlign: 'center' } }, h('div', { style: { font: "800 64px/0.9 'Fraunces Variable'", color: '#f6c343', transform: 'rotate(-6deg)', textShadow: '4px 4px 0 #b8541c' } }, 'Little', h('br'), 'Alchemy-ish 2'), h('button', { style: { marginTop: '40px', background: '#8b6cff', color: '#fff', border: 0, padding: '10px 36px', borderRadius: '4px', fontSize: '18px' }, onclick: () => splash.remove() }, 'Play')));
  root.append(board, lib, cnt, splash);
  ['air', 'earth', 'fire', 'water'].forEach((e, i) => spawn(e, 120 + i * 130, 200)); drawLib();
  window.__demoProof = async () => { const [a, b] = [spawn('earth', 400, 400), spawn('water', 420, 410)]; a.dispatchEvent(new PointerEvent('pointerdown', { clientX: 400, clientY: 400 })); a.dispatchEvent(new PointerEvent('pointerup', { clientX: 400, clientY: 400 })); return 'combined earth+water → mud (splash shown)'; };
};
V['voxel-sculpture-merge-puzzle'] = (root, T) => {
  theme(root, T, { bg: '#f3d5bd', fg: '#5a3a2a', ac: '#e57373', dark: false });
  root.style.background = 'radial-gradient(circle at 50% 40%,#f8e3d2,#eec3a6)';
  const R = rng(4); const floaters = Array.from({ length: 14 }, () => h('div', { style: { position: 'absolute', left: R() * 95 + '%', top: R() * 90 + '%', width: 20 + R() * 30 + 'px', aspectRatio: '1', background: pick(['#b98a7a', '#8fa393', '#c7a2a2', '#9b8fb0']), transform: `rotate(${R() * 90}deg)`, borderRadius: '4px', opacity: .7 } }));
  let grid = new Array(16).fill(0), best = 0; const COL = ['', '#f7c8a0', '#f4a582', '#e57373', '#ba68c8', '#7986cb', '#4db6ac', '#81c784', '#ffd54f', '#a1887f'];
  const cell = (v) => h('div', { style: { aspectRatio: '1', borderRadius: '8px', background: v ? COL[Math.min(v, 9)] : '#00000010', display: 'grid', placeItems: 'center', font: "800 18px 'Inter Variable'", color: '#5a3a2a', boxShadow: v ? `inset -4px -6px 0 #0002` : '' } }, v ? '▣'.repeat(Math.min(3, Math.ceil(v / 3))) + ' ' + v : '');
  const board = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', width: '240px' } });
  const add = () => { const e = grid.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0); if (e.length) grid[pick(e)] = R() < 0.9 ? 1 : 2; };
  const move = (dx, dy) => { let moved = false; const g2 = [...grid]; const lines = [0, 1, 2, 3].map((k) => [0, 1, 2, 3].map((j) => (dx ? (dx < 0 ? k * 4 + j : k * 4 + 3 - j) : dy < 0 ? j * 4 + k : (3 - j) * 4 + k))); lines.forEach((ln) => { const vals = ln.map((i) => grid[i]).filter(Boolean); for (let i = 0; i < vals.length - 1; i++) if (vals[i] === vals[i + 1]) { vals[i]++; best = Math.max(best, vals[i]); vals.splice(i + 1, 1); } ln.forEach((i, j) => (g2[i] = vals[j] || 0)); }); moved = g2.some((v, i) => v !== grid[i]); grid = g2; if (moved) add(); draw(); };
  window.addEventListener('keydown', (e) => { const m = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (m) { e.preventDefault(); move(...m); } });
  const bestEl = h('b');
  const draw = () => { board.replaceChildren(...grid.map(cell)); bestEl.textContent = best; };
  root.append(...floaters, h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' } }, h('div', { style: { font: "900 64px 'Fraunces Variable'", color: '#fff', textShadow: '0 4px 0 #d9a78a' } }, 'Cubelets-ish'), h('div', { style: { fontSize: '11px', letterSpacing: '.3em', opacity: .6, marginBottom: '12px' } }, 'MERGE · STACK · SCULPT'), h('div', { style: { background: '#fff7f0', borderRadius: '16px', padding: '18px', boxShadow: '0 10px 40px #0002', display: 'grid', gap: '12px', justifyItems: 'center' } }, h('span', { style: { background: '#fde4d4', padding: '3px 12px', borderRadius: '99px', fontSize: '12px' } }, 'Best cube: ', bestEl), board, h('button', { style: { background: '#e57373', color: '#fff', border: 0, padding: '12px 60px', borderRadius: '10px', fontWeight: 800 }, onclick: () => { grid.fill(0); add(); add(); draw(); } }, 'Start New'), h('div.k-row', { style: { gap: '6px' } }, ...[['←', -1, 0], ['↑', 0, -1], ['↓', 0, 1], ['→', 1, 0]].map(([l, a, b]) => h('button', { style: { width: '38px', height: '38px', borderRadius: '8px', border: 0, background: '#fde4d4' }, onclick: () => move(a, b) }, l))), h('div', { style: { fontSize: '11px', opacity: .6 } }, 'arrow keys / buttons merge matching cubelets'))));
  add(); add(); draw();
  window.__demoProof = async () => { grid = [1, 1, 2, 0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0]; move(-1, 0); return 'merged cubelets leftward'; };
};
V['math-manipulatives-playground'] = (root, T) => {
  theme(root, T, { bg: '#2b2b2f', fg: '#eee', ac: '#e4007c', dark: true });
  const canvas = h('div', { style: { position: 'absolute', left: '200px', right: '50px', top: '44px', bottom: '50px', background: '#34343a', backgroundImage: 'radial-gradient(#ffffff18 1px,transparent 1px)', backgroundSize: '24px 24px', overflow: 'hidden' } });
  const place = (el, x, y) => { Object.assign(el.style, { position: 'absolute', left: x + 'px', top: y + 'px', cursor: 'grab', touchAction: 'none' }); let ox, oy; drag(el, { start: (e) => { ox = e.clientX - el.offsetLeft; oy = e.clientY - el.offsetTop; }, move: (e) => { el.style.left = Math.round((e.clientX - ox) / 12) * 12 + 'px'; el.style.top = Math.round((e.clientY - oy) / 12) * 12 + 'px'; } }); el.addEventListener('dblclick', () => (el.style.transform = `rotate(${(parseFloat(el.dataset.r || 0) + 30)}deg)`, (el.dataset.r = (+el.dataset.r || 0) + 30))); canvas.append(el); };
  const TOOLS = { 'Fraction bar': () => { const n = pick([2, 3, 4, 5]); return h('div', { style: { display: 'flex', width: '240px', height: '36px', border: '2px solid #fff' } }, ...Array.from({ length: n }, () => h('div', { style: { flex: 1, borderRight: '1px solid #fff', background: '#e4007c88', display: 'grid', placeItems: 'center', fontSize: '12px' } }, `1/${n}`))); }, 'Number tile': () => h('div', { style: { width: '48px', height: '48px', background: pick(['#f6c343', '#4fc3f7', '#81c784']), color: '#222', display: 'grid', placeItems: 'center', fontWeight: 800, borderRadius: '6px', fontSize: '20px' } }, 1 + Math.floor(Math.random() * 9)), Polygon: () => { const n = pick([3, 4, 5, 6]); return s('svg', { width: 90, height: 90, viewBox: '-1 -1 2 2' }, s('polygon', { points: Array.from({ length: n }, (_, i) => `${Math.cos((i / n) * 6.283 - 1.57) * 0.9},${Math.sin((i / n) * 6.283 - 1.57) * 0.9}`).join(' '), fill: pick(['#e4007c', '#7c4dff', '#00bfa5', '#ffab00']), stroke: '#fff', 'stroke-width': 0.04 })); }, 'Algebra tile': () => h('div', { style: { width: pick(['24px', '96px']), height: '96px', background: '#29b6f6', border: '2px solid #fff', display: 'grid', placeItems: 'center', fontSize: '14px' } }, pick(['x', 'x²'])), 'Dice': () => h('div', { style: { width: '54px', height: '54px', background: '#fff', color: '#222', borderRadius: '10px', display: 'grid', placeItems: 'center', fontSize: '30px', cursor: 'pointer' }, onclick: (e) => (e.currentTarget.textContent = '⚀⚁⚂⚃⚄⚅'[Math.floor(Math.random() * 6)]) }, '⚃') };
  const side = h('div', { style: { position: 'absolute', left: 0, top: '44px', bottom: 0, width: '200px', background: '#232327', padding: '10px', display: 'grid', gap: '6px', alignContent: 'start', fontSize: '13px' } }, h('input', { placeholder: 'Search tools', style: { padding: '6px', background: '#333', border: 0, color: '#fff' } }), ...Object.keys(TOOLS).map((k) => h('div', { style: { padding: '8px', borderRadius: '6px', background: '#2f2f35', cursor: 'pointer' }, onclick: () => place(TOOLS[k](), 100 + Math.random() * 500, 60 + Math.random() * 400) }, '＋ ' + k)));
  const modal = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '440px', background: '#fff', color: '#222', borderRadius: '10px', padding: '22px', boxShadow: '0 10px 50px #000a', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', zIndex: 3 } }, h('div', { style: { gridColumn: '1/-1', textAlign: 'center', font: "600 20px 'Fraunces Variable'" } }, 'What do you want to do today?'), h('div', { style: { gridColumn: '1/-1', background: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }, onclick: () => modal.remove() }, '📁 Start a New Polypad'), ...[['#e8f5e9', '🧩 Discover Free Lessons & Activities'], ['#fff3e0', '🎓 Learn to Use Polypad'], ['#f3e5f5', '🔗 Join a Polypad Session'], ['#fce4ec', "✨ See What's New"]].map(([c, t]) => h('div', { style: { background: c, padding: '16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }, onclick: () => modal.remove() }, t)), h('label', { style: { gridColumn: '1/-1', fontSize: '12px', textAlign: 'center' } }, h('input', { type: 'checkbox' }), " Don't show this again"));
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '44px', padding: '0 14px', background: '#1d1d21', gap: '12px', fontSize: '13px' } }, h('b', { style: { background: '#e4007c', padding: '2px 6px', borderRadius: '4px' } }, 'P'), h('b', {}, 'Polypad-ish'), h('span', { style: { opacity: .6 } }, 'Untitled Polypad'), h('span', { style: { flex: 1 } }), '⚙ Settings', 'Log in', h('span', { style: { background: '#e4007c', padding: '4px 10px', borderRadius: '4px' } }, 'Sign up')), side, canvas, h('div.k-row', { style: { position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: '#1d1d21', padding: '6px 14px', borderRadius: '8px', gap: '14px' } }, '↖', '✎', '⌫', '⟲', '⟳', '▦'), h('div', { style: { position: 'absolute', right: 0, top: '44px', bottom: 0, width: '50px', background: '#232327' } }), modal);
  place(TOOLS['Fraction bar'](), 80, 80); place(TOOLS.Polygon(), 400, 200); place(TOOLS['Number tile'](), 300, 80);
  window.__demoProof = async () => 'manipulatives placed on grid (welcome modal)';
};

V['timeguessr-historic-photo-quiz'] = (root, T) => {
  theme(root, T, { bg: '#060a17', fg: '#e8e2d8', panel: '#0a1411', ac: '#ffc83d', dark: true });
  root.style.fontFamily = 'Inter Variable,system-ui,sans-serif';
  root.style.overflow = 'hidden';

  const ROUNDS = [
    { title: 'Desert cylinder inspection', year: 1947, lat: 33.4, lon: -106.5, place: 'New Mexico, USA', hue: '#8b6b4a' },
    { title: 'Crowd in red & yellow', year: 1969, lat: 41.9, lon: 12.5, place: 'Rome, Italy', hue: '#a83a3a' },
    { title: 'Grand hall gathering', year: 1923, lat: 51.5, lon: -0.12, place: 'London, UK', hue: '#5a4a3a' },
    { title: 'Harbor cranes at dusk', year: 1985, lat: 35.6, lon: 139.7, place: 'Tokyo, Japan', hue: '#3a5a7a' },
    { title: 'Snow plaza parade', year: 1955, lat: 55.75, lon: 37.62, place: 'Moscow, USSR', hue: '#6a7a8a' },
  ];
  let mode = 'home'; // home | play | result
  let ri = 0, yearGuess = 1950, pin = null, score = 0, last = null;

  const shell = h('div', { style: { position: 'absolute', inset: 0, background: '#060a17' } });
  root.append(shell);

  const mapBg = () => {
    // subtle world dots
    const cv = h('canvas', { width: 900, height: 500, style: { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .35, pointerEvents: 'none' } });
    const c = cv.getContext('2d');
    c.fillStyle = '#0a1420'; c.fillRect(0, 0, 900, 500);
    c.fillStyle = '#2a4a3a';
    for (let i = 0; i < 800; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453 % 1) * 900;
      const y = (Math.sin(i * 78.233) * 43758.5453 % 1) * 500;
      if (y > 60 && y < 440) c.fillRect(x, y, 2, 2);
    }
    return cv;
  };

  const photoCard = (r, big = false) => {
    const hgt = big ? '320px' : '160px';
    return h('div', {
      style: {
        position: 'relative', borderRadius: '14px', overflow: 'hidden', height: hgt,
        background: `linear-gradient(135deg, ${r.hue} 0%, #1a1210 100%)`,
        boxShadow: '0 12px 40px #0008', border: '1px solid #ffffff18',
      },
    },
      h('div', {
        style: {
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 30% 40%, #ffffff22, transparent 50%),
            repeating-linear-gradient(0deg, #00000018 0 2px, transparent 2px 4px)`,
        },
      }),
      h('div', {
        style: {
          position: 'absolute', left: '16px', bottom: '14px', right: '16px',
          fontSize: big ? '18px' : '14px', fontWeight: 700, textShadow: '0 2px 8px #000a',
        },
      }, r.title),
      h('div', {
        style: {
          position: 'absolute', top: '12px', right: '12px', fontSize: '11px',
          background: '#00000066', padding: '4px 8px', borderRadius: '99px', opacity: .8,
        },
      }, 'HISTORIC PHOTO'),
    );
  };

  const yearScore = (g, t) => Math.max(0, 5000 - Math.abs(g - t) * 25);
  const distKm = (a, b) => {
    const R = 6371, toR = (d) => d * Math.PI / 180;
    const dLat = toR(b.lat - a.lat), dLon = toR(b.lon - a.lon);
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };
  const locScore = (pin, t) => {
    if (!pin) return 0;
    const d = distKm(pin, t);
    return Math.max(0, Math.round(5000 * Math.exp(-d / 2500)));
  };

  const render = () => {
    if (mode === 'home') {
      shell.replaceChildren(mapBg(),
        h('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' } },
          h('div.k-row', { style: { height: '56px', padding: '0 20px', gap: '12px' } },
            h('span', { style: { fontSize: '18px', opacity: .7 } }, '☰'),
            h('span', { style: { fontSize: '16px', opacity: .7 } }, '⚙'),
            h('span', { style: { flex: 1 } }),
            h('b', { style: { letterSpacing: '.18em', fontSize: '20px', fontWeight: 900 } }, 'TIMEGUESSR'),
            h('span', { style: { flex: 1 } }),
            h('button', { style: { background: 'transparent', border: '1px solid #ffffff33', color: '#eee', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' } }, '🌐 English'),
            h('button', { style: { background: 'transparent', border: '1px solid #ffffff33', color: '#eee', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' } }, 'Log in'),
          ),
          h('div', {
            style: {
              flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px',
              padding: '40px 48px', alignContent: 'center',
            },
          },
            ...[
              ['Play', 'Play a random game', 0],
              ['Daily', 'Play the daily challenge', 1],
              ['Community', 'Play games made by the community', 2],
            ].map(([title, sub, idx]) => h('button', {
              style: {
                textAlign: 'left', border: '1px solid #ffffff22', borderRadius: '16px', padding: 0,
                overflow: 'hidden', cursor: 'pointer', color: '#fff', background: 'transparent',
                display: 'grid', gridTemplateRows: '1fr auto', minHeight: '280px',
              },
              onclick: () => { mode = 'play'; ri = idx % ROUNDS.length; yearGuess = 1950; pin = null; last = null; render(); },
            }, photoCard(ROUNDS[idx], true),
              h('div', { style: { padding: '14px 16px', background: '#0a0e1acc' } },
                h('div', { style: { fontSize: '22px', fontWeight: 800 } }, title),
                h('div', { style: { fontSize: '13px', opacity: .65, marginTop: '4px' } }, sub),
              ))),
          ),
          h('div', { style: { textAlign: 'center', paddingBottom: '18px', fontSize: '12px', opacity: .45 } }, 'contact@timeguessr.com'),
        ),
      );
      return;
    }

    const r = ROUNDS[ri];
    if (mode === 'play') {
      const yearLab = h('b', {}, String(yearGuess));
      const map = h('div', {
        style: {
          position: 'relative', height: '280px', borderRadius: '12px', overflow: 'hidden',
          background: '#0c1820', border: '1px solid #ffffff18', cursor: 'crosshair',
        },
      });
      const drawMap = () => {
        const cv = h('canvas', { width: 720, height: 280, style: { width: '100%', height: '100%', display: 'block' } });
        const c = cv.getContext('2d');
        c.fillStyle = '#0c1820'; c.fillRect(0, 0, 720, 280);
        c.strokeStyle = '#1a3a30'; c.lineWidth = 1;
        for (let x = 0; x < 720; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 280); c.stroke(); }
        for (let y = 0; y < 280; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(720, y); c.stroke(); }
        // continents blobs
        c.fillStyle = '#1e4a3a88';
        [[120, 100, 80, 50], [280, 90, 100, 60], [450, 110, 70, 40], [580, 130, 90, 55], [200, 180, 60, 30]].forEach(([x, y, w, h]) => {
          c.beginPath(); c.ellipse(x, y, w, h, 0, 0, Math.PI * 2); c.fill();
        });
        if (pin) {
          const px = ((pin.lon + 180) / 360) * 720;
          const py = ((90 - pin.lat) / 180) * 280;
          c.fillStyle = '#ffc83d'; c.beginPath(); c.arc(px, py, 7, 0, Math.PI * 2); c.fill();
          c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke();
        }
        map.replaceChildren(cv);
        cv.addEventListener('click', (e) => {
          const rect = cv.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          pin = { lon: x * 360 - 180, lat: 90 - y * 180 };
          drawMap();
        });
      };
      drawMap();

      shell.replaceChildren(
        h('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' } },
          h('div.k-row', { style: { height: '48px', padding: '0 16px', gap: '10px', borderBottom: '1px solid #ffffff12' } },
            h('button', { style: { background: 'transparent', border: 0, color: '#aaa', cursor: 'pointer', fontSize: '14px' }, onclick: () => { mode = 'home'; render(); } }, '← Home'),
            h('b', { style: { letterSpacing: '.14em' } }, 'TIMEGUESSR'),
            h('span', { style: { flex: 1 } }),
            h('span', { style: { fontSize: '12px', opacity: .55 } }, `Round ${ri + 1} / ${ROUNDS.length}`),
            h('span', { style: { fontSize: '12px', color: '#ffc83d' } }, `Score ${score}`),
          ),
          h('div', { style: { flex: 1, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '16px', padding: '16px', minHeight: 0 } },
            h('div', { style: { display: 'grid', gap: '12px', alignContent: 'start' } },
              photoCard(r, true),
              h('div', { style: { fontSize: '13px', opacity: .6 } }, 'Guess the year this photo was taken, then pin the location on the map.'),
            ),
            h('div', { style: { display: 'grid', gap: '12px', alignContent: 'start' } },
              h('div', { style: { background: '#0e1624', borderRadius: '12px', padding: '14px', border: '1px solid #ffffff12' } },
                h('div.k-row', {}, h('span', { style: { fontSize: '12px', opacity: .55 } }, 'YEAR'), h('span', { style: { flex: 1 } }), yearLab),
                h('input', {
                  type: 'range', min: 1900, max: 2020, value: yearGuess,
                  style: { width: '100%', accentColor: '#ffc83d', marginTop: '8px' },
                  oninput: (e) => { yearGuess = +e.target.value; yearLab.textContent = String(yearGuess); },
                }),
                h('div.k-row', { style: { fontSize: '11px', opacity: .4, marginTop: '4px' } }, h('span', {}, '1900'), h('span', { style: { flex: 1 } }), h('span', {}, '2020')),
              ),
              h('div', {},
                h('div', { style: { fontSize: '12px', opacity: .55, marginBottom: '6px' } }, 'LOCATION — click to pin'),
                map,
              ),
              btn('Guess!', () => {
                const ys = yearScore(yearGuess, r.year);
                const ls = locScore(pin, r);
                const total = ys + ls;
                last = { ys, ls, total, dist: pin ? Math.round(distKm(pin, r)) : null };
                score += total;
                mode = 'result';
                render();
              }, 'pri'),
            ),
          ),
        ),
      );
      return;
    }

    // result
    const ys = last?.ys || 0, ls = last?.ls || 0;
    shell.replaceChildren(
      h('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: '24px' } },
        h('div', {
          style: {
            width: 'min(520px, 100%)', background: '#0e1624', borderRadius: '16px',
            border: '1px solid #ffffff18', padding: '24px', display: 'grid', gap: '14px',
          },
        },
          h('div', { style: { fontSize: '12px', letterSpacing: '.16em', color: '#ffc83d' } }, 'ROUND RESULT'),
          h('b', { style: { fontSize: '28px' } }, `+${last?.total || 0} pts`),
          photoCard(r, false),
          h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' } },
            h('div', { style: { background: '#ffffff08', borderRadius: '10px', padding: '12px' } },
              h('div', { style: { opacity: .5, fontSize: '11px' } }, 'YEAR'),
              h('div', {}, `Guess ${yearGuess} · Answer ${r.year}`),
              h('div', { style: { color: '#ffc83d', marginTop: '4px' } }, `+${ys}`),
            ),
            h('div', { style: { background: '#ffffff08', borderRadius: '10px', padding: '12px' } },
              h('div', { style: { opacity: .5, fontSize: '11px' } }, 'LOCATION'),
              h('div', {}, r.place),
              h('div', { style: { color: '#ffc83d', marginTop: '4px' } }, last?.dist != null ? `${last.dist} km · +${ls}` : 'No pin · +0'),
            ),
          ),
          h('div.k-row', { style: { gap: '8px' } },
            btn('Next round', () => {
              ri = (ri + 1) % ROUNDS.length;
              yearGuess = 1950; pin = null; last = null; mode = 'play'; render();
            }, 'pri'),
            btn('Home', () => { mode = 'home'; render(); }),
          ),
        ),
      ),
    );
  };

  render();

  window.__demoProof = async () => {
    mode = 'play'; ri = 0; yearGuess = 1945; pin = { lat: 34, lon: -107 }; score = 0; last = null;
    render();
    await sleep(80);
    const r = ROUNDS[0];
    const ys = yearScore(yearGuess, r.year);
    const ls = locScore(pin, r);
    last = { ys, ls, total: ys + ls, dist: Math.round(distKm(pin, r)) };
    score += last.total;
    mode = 'result';
    render();
    await sleep(80);
    mode = 'home'; render();
    return `guessed year+map → scored ${last.total} · returned home`;
  };
};


V['purl-visual-game-engine'] = (root, T) => {
  theme(root, T, { bg: '#5c5c5c', fg: '#f2f2f2', panel: '#4a4a4a', ac: '#c45c6a', dark: true, line: '#3a3a3a' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  let mode = 'home'; // home | editor | tutorial | docs
  let nodes = [];
  let edges = [];
  let nid = 1;
  let zoom = 100;
  const body = h('div', { style: { position: 'absolute', inset: '36px 0 0', display: 'grid', placeItems: 'center' } });

  const logo = () => {
    const petals = [
      { c: '#c45c6a', rot: -20 },
      { c: '#4a7ab8', rot: 70 },
      { c: '#7a5ca8', rot: 160 },
      { c: '#c9a84a', rot: 250 },
    ];
    return h('div', { style: { width: '72px', height: '72px', position: 'relative', margin: '0 auto 18px' } },
      ...petals.map((p) => h('div', {
        style: {
          position: 'absolute', inset: '8px', borderRadius: '50% 50% 50% 0',
          border: '3px solid #111', background: p.c,
          transform: `rotate(${p.rot}deg)`, opacity: 0.92,
        },
      })),
    );
  };

  const card = (icon, title, sub, on) => h('button', {
    style: {
      width: '200px', height: '168px', border: 'none', borderRadius: '14px',
      background: '#3f3f3f', color: '#f2f2f2', cursor: 'pointer',
      display: 'grid', alignContent: 'center', justifyItems: 'center', gap: '10px',
      boxShadow: '0 8px 24px #0004', transition: 'transform .15s, background .15s',
    },
    onmouseenter: (e) => { e.currentTarget.style.background = '#484848'; e.currentTarget.style.transform = 'translateY(-2px)'; },
    onmouseleave: (e) => { e.currentTarget.style.background = '#3f3f3f'; e.currentTarget.style.transform = ''; },
    onclick: on,
  },
    h('div', { style: { fontSize: '28px', fontWeight: 300, lineHeight: 1 } }, icon),
    h('div', { style: { font: '600 16px Inter Variable,system-ui' } }, title),
    h('div', { style: { fontSize: '12px', opacity: .55, maxWidth: '140px', lineHeight: 1.35 } }, sub),
  );

  const topBar = () => h('div', {
    style: {
      position: 'absolute', top: 0, left: 0, right: 0, height: '36px',
      background: '#2a2a2a', display: 'flex', alignItems: 'center', gap: '14px',
      padding: '0 12px', fontSize: '12px', color: '#ddd', zIndex: 5,
      borderBottom: '1px solid #1a1a1a',
    },
  },
    h('span', { style: { width: '18px', height: '18px', borderRadius: '4px', background: 'conic-gradient(#c45c6a,#4a7ab8,#7a5ca8,#c9a84a)', border: '1px solid #111' } }),
    ...['File', 'Edit', 'View', 'Settings', 'Help'].map((t) => h('span', { style: { opacity: .85, cursor: 'default' } }, t)),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { background: '#3a3a3a', padding: '3px 10px', borderRadius: '6px', fontSize: '11px' } }, 'AI 🔒'),
    h('span', { style: { background: '#3a3a3a', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' } }, 'Sign in'),
    h('span', { style: { display: 'flex', alignItems: 'center', gap: '6px', background: '#333', borderRadius: '6px', padding: '2px 8px' } },
      h('span', { style: { cursor: 'pointer' }, onclick: () => { zoom = Math.max(50, zoom - 10); render(); } }, '−'),
      h('span', {}, zoom + '%'),
      h('span', { style: { cursor: 'pointer' }, onclick: () => { zoom = Math.min(200, zoom + 10); render(); } }, '+'),
    ),
  );

  const openBlank = () => {
    mode = 'editor';
    nodes = [
      { id: nid++, x: 180, y: 160, label: 'Start', kind: 'event' },
      { id: nid++, x: 420, y: 160, label: 'Scene', kind: 'scene' },
    ];
    edges = [[nodes[0].id, nodes[1].id]];
    render();
  };

  const addNode = (kind = 'action') => {
    const labels = { event: 'Event', scene: 'Scene', action: 'Action', sprite: 'Sprite' };
    nodes.push({ id: nid++, x: 220 + Math.random() * 280, y: 120 + Math.random() * 200, label: labels[kind] || 'Node', kind });
    if (nodes.length > 1) edges.push([nodes[nodes.length - 2].id, nodes[nodes.length - 1].id]);
    render();
  };

  const drawEditor = () => {
    const stage = h('div', {
      style: {
        position: 'absolute', inset: 0, background: '#4a4a4a',
        backgroundImage: 'radial-gradient(#666 1px, transparent 1px)',
        backgroundSize: '24px 24px', overflow: 'hidden',
      },
    });
    const world = h('div', {
      style: {
        position: 'absolute', left: '50%', top: '50%',
        width: '900px', height: '560px', margin: '-280px -450px',
        transform: `scale(${zoom / 100})`, transformOrigin: 'center center',
      },
    });
    const svg = s('svg', { viewBox: '0 0 900 560', style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none' });
    edges.forEach(([a, b]) => {
      const A = nodes.find((n) => n.id === a), B = nodes.find((n) => n.id === b);
      if (!A || !B) return;
      svg.append(s('path', {
        d: `M${A.x + 60} ${A.y + 28} C${A.x + 140} ${A.y + 28}, ${B.x - 40} ${B.y + 28}, ${B.x} ${B.y + 28}`,
        stroke: '#9aa', 'stroke-width': 2, fill: 'none', opacity: .7,
      }));
    });
    const kindColor = { event: '#c45c6a', scene: '#4a7ab8', action: '#7a5ca8', sprite: '#c9a84a' };
    nodes.forEach((n) => {
      const el = h('div', {
        style: {
          position: 'absolute', left: n.x + 'px', top: n.y + 'px', width: '120px',
          background: '#2f2f2f', border: `2px solid ${kindColor[n.kind] || '#888'}`,
          borderRadius: '10px', padding: '10px 12px', cursor: 'grab', boxShadow: '0 6px 18px #0005',
          fontSize: '13px', userSelect: 'none',
        },
      },
        h('div', { style: { fontSize: '10px', opacity: .5, textTransform: 'uppercase', letterSpacing: '.06em' } }, n.kind),
        h('div', { style: { fontWeight: 600, marginTop: '4px' } }, n.label),
      );
      let lx, ly; drag(el, { start: (e) => { lx = e.clientX; ly = e.clientY; }, move: (e) => { n.x += e.clientX - lx; n.y += e.clientY - ly; lx = e.clientX; ly = e.clientY; el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; redrawEdges(); } });
      world.append(el);
    });
    const redrawEdges = () => {
      svg.replaceChildren();
      edges.forEach(([a, b]) => {
        const A = nodes.find((n) => n.id === a), B = nodes.find((n) => n.id === b);
        if (!A || !B) return;
        svg.append(s('path', {
          d: `M${A.x + 60} ${A.y + 28} C${A.x + 140} ${A.y + 28}, ${B.x - 40} ${B.y + 28}, ${B.x} ${B.y + 28}`,
          stroke: '#9aa', 'stroke-width': 2, fill: 'none', opacity: .7,
        }));
      });
    };
    world.prepend(svg);
    stage.append(world);
    const rail = h('div', {
      style: {
        position: 'absolute', left: '14px', top: '14px', display: 'flex', gap: '8px', zIndex: 3,
      },
    },
      btn('← Home', () => { mode = 'home'; render(); }),
      btn('+ Event', () => addNode('event')),
      btn('+ Scene', () => addNode('scene')),
      btn('+ Action', () => addNode('action'), 'pri'),
      btn('+ Sprite', () => addNode('sprite')),
    );
    const hint = h('div', {
      style: {
        position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
        fontSize: '12px', opacity: .55, background: '#0006', padding: '6px 14px', borderRadius: '8px',
      },
    }, 'Blank project · drag nodes · wire story flow');
    stage.append(rail, hint);
    return stage;
  };

  const drawDocs = (title, lines) => h('div', {
    style: {
      width: 'min(640px,90%)', background: '#3f3f3f', borderRadius: '16px', padding: '28px 32px',
      boxShadow: '0 16px 40px #0005', display: 'grid', gap: '12px',
    },
  },
    h('div.k-row', {}, h('b', { style: { fontSize: '20px' } }, title), h('span', { style: { flex: 1 } }), btn('← Back', () => { mode = 'home'; render(); })),
    ...lines.map((t) => h('p', { style: { margin: 0, opacity: .75, lineHeight: 1.55, fontSize: '14px' } }, t)),
  );

  const render = () => {
    root.replaceChildren(topBar());
    if (mode === 'home') {
      body.replaceChildren(
        h('div', { style: { textAlign: 'center' } },
          logo(),
          h('div', { style: { font: '700 42px/1.1 Inter Variable,system-ui', letterSpacing: '-.02em', color: '#fff' } }, 'Purl Studio'),
          h('div', { style: { marginTop: '10px', marginBottom: '36px', opacity: .6, fontSize: '15px' } }, 'Visual game engine for the browser'),
          h('div', { style: { display: 'flex', gap: '18px', justifyContent: 'center' } },
            card('+', 'New Project', 'Start with a blank canvas', openBlank),
            card('▸', 'Tutorial', 'Interactive editor walkthrough', () => { mode = 'tutorial'; render(); }),
            card('?', 'Knowledge Portal', 'Docs, tutorials, reference', () => { mode = 'docs'; render(); }),
          ),
        ),
      );
      root.append(body);
    } else if (mode === 'editor') {
      root.append(drawEditor());
    } else if (mode === 'tutorial') {
      body.replaceChildren(drawDocs('Tutorial', [
        '1. Create a blank project from the home desk.',
        '2. Drop Event → Scene → Action nodes and drag them into place.',
        '3. Edges auto-wire in creation order — tell a short interactive story.',
        '4. Use zoom in the top bar to inspect denser graphs.',
      ]));
      root.append(body);
    } else {
      body.replaceChildren(drawDocs('Knowledge Portal', [
        'Purl-ish is a look-alike visual game / story builder desk.',
        'Nodes: Event (triggers), Scene (stages), Action (logic), Sprite (art).',
        'This gallery demo keeps everything local — no cloud save or AI.',
        'Rebuild focus: home card trio + blank node canvas flow.',
      ]));
      root.append(body);
    }
  };

  render();

  window.__demoProof = async () => {
    mode = 'home'; render();
    await sleep(40);
    openBlank();
    await sleep(40);
    addNode('action');
    addNode('sprite');
    await sleep(40);
    zoom = 110; render();
    await sleep(60);
    mode = 'home'; render();
    return 'opened blank project, added action+sprite nodes, returned home';
  };
};

// ---------- TETR.IO game client menu system (2026-10-05 12:00 KST)
V['tetrio-game-client-menu'] = (root, T) => {
  theme(root, T, { bg: '#000000', fg: '#ffffff', ac: '#e04fb0', dark: true });
  const CON = "'Roboto Flex Variable', 'Roboto Flex', Arial Narrow, sans-serif", PIX = "'Press Start 2P', monospace";
  root.style.background = '#000'; root.style.color = '#fff'; root.style.fontFamily = CON; root.style.overflow = 'hidden';
  root.append(h('style', {}, `
    .tt *{box-sizing:border-box}
    .tt{position:absolute;inset:0;font-family:${CON};font-variation-settings:'wdth' 30;text-transform:uppercase}
    .tt-sky{position:absolute;left:0;right:0;height:70px;pointer-events:none;opacity:.9}
    .tt-top{position:absolute;left:0;right:0;top:0;height:64px;display:flex;align-items:center;padding:0 22px;z-index:3;background:#000}
    .tt-logo{font:400 34px/1 ${PIX};letter-spacing:-2px;color:#fff;text-shadow:3px 3px 0 #555;margin-right:40px;transform:scaleY(1.15)}
    .tt-logo i{font-style:normal;color:#fff;opacity:.9}
    .tt-nav a{position:relative;display:inline-block;padding:22px 22px;font:700 19px/1 ${CON};font-variation-settings:'wdth' 60;letter-spacing:.03em;color:#fff;cursor:pointer;text-decoration:none}
    .tt-nav a.on::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:#fff}
    .tt-nav a:hover{background:#ffffff12}
    .tt-ic{margin-left:auto;display:flex;gap:18px;font-size:20px;color:#888}.tt-ic span{cursor:pointer}.tt-ic span:hover{color:#fff}
    .tt-beta{position:absolute;left:22px;top:82px;font:700 64px/1 ${CON};font-variation-settings:'wdth' 70;color:#ffffff10;letter-spacing:.02em}
    .tt-stats{position:absolute;left:50%;top:180px;transform:translateX(-50%);display:flex;gap:64px;text-align:center}
    .tt-stats b{display:block;font:600 34px/1 ${CON};font-variation-settings:'wdth' 40;color:#bdbdbd;letter-spacing:.02em}.tt-stats small{font:500 11px ${CON};color:#555;letter-spacing:.08em}
    .tt-dlg{position:absolute;left:50%;top:292px;transform:translateX(-50%);width:646px;background:#ececec;color:#111;box-shadow:0 0 60px #ffffff22;transition:opacity .35s,transform .35s}
    .tt-dlg h3{margin:0;padding:10px 12px 2px;font:700 23px/1 ${CON};font-variation-settings:'wdth' 45;letter-spacing:.04em}
    .tt-dlg p{margin:0;padding:4px 12px 10px;font:500 11.5px/1.45 ${CON};color:#444;letter-spacing:.03em;border-bottom:2px solid #d0d0d0}
    .tt-dlg label{display:block;padding:10px 12px 6px;font:700 13px ${CON};letter-spacing:.05em}
    .tt-dlg input{display:block;margin:0 6px;width:calc(100% - 12px);height:30px;background:#202020;border:0;color:#fff;font:500 18px ${CON};font-variation-settings:'wdth' 40;padding:0 8px;text-transform:uppercase;outline:none}
    .tt-dlg input::placeholder{color:#777}.tt-dlg input:focus{box-shadow:0 0 0 2px #e04fb0}
    .tt-dlg .tos{padding:7px 12px;font:600 10.5px ${CON};color:#555;letter-spacing:.04em}.tt-dlg .tos a{color:#2a4bd7}
    .tt-dlg button{display:block;width:100%;height:40px;border:0;background:#cfcfcf;font:600 26px/1 ${CON};font-variation-settings:'wdth' 50;letter-spacing:.06em;color:#222;cursor:pointer}
    .tt-dlg button:hover{background:#fff}
    .tt-foot{position:absolute;left:22px;bottom:16px;display:flex;align-items:center;gap:6px;font:500 13px ${CON};color:#bbb;z-index:2}.tt-foot b{font:900 26px/1 Arial;letter-spacing:-1px;color:#fff;text-transform:lowercase}
    .tt-menu{position:absolute;inset:64px 0 0 0;display:none;background:radial-gradient(ellipse at 70% 20%,#1d1630,#07060b 70%)}
    .tt-menu.show{display:block}
    .tt-user{position:absolute;left:24px;top:20px;display:flex;gap:12px;align-items:center}
    .tt-av{width:52px;height:52px;background:linear-gradient(135deg,#ff6ac1,#7b4dff);display:grid;place-items:center;font:400 18px ${PIX}}
    .tt-user b{display:block;font:700 26px/1 ${CON};font-variation-settings:'wdth' 50}.tt-user small{font:600 12px ${CON};color:#9b8fc0;letter-spacing:.06em}
    .tt-xp{width:180px;height:5px;background:#ffffff1a;margin-top:6px}.tt-xp i{display:block;height:100%;width:38%;background:#ffd23f}
    .tt-list{position:absolute;right:0;top:96px;width:min(820px,70%);display:grid;gap:10px}
    .tt-it{position:relative;height:98px;display:flex;align-items:center;gap:22px;padding:0 30px;cursor:pointer;transform:translateX(var(--x,40px));opacity:0;transition:transform .32s cubic-bezier(.2,.9,.2,1.2),opacity .3s,filter .2s;clip-path:polygon(18px 0,100% 0,100% 100%,0 100%);overflow:hidden}
    .tt-it.in{opacity:1;--x:0px}.tt-it:hover{--x:-26px;filter:brightness(1.25)}
    .tt-it::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#ffffff30,transparent 45%,#00000030);pointer-events:none}
    .tt-it .g{font:400 40px/1 ${PIX};opacity:.85;width:60px;text-align:center}
    .tt-it b{display:block;font:800 46px/1 ${CON};font-variation-settings:'wdth' 40;letter-spacing:.02em}
    .tt-it small{display:block;font:600 14px/1.2 ${CON};letter-spacing:.06em;opacity:.8;margin-top:4px}
    .tt-it .n{margin-left:auto;font:700 14px ${CON};opacity:.7;letter-spacing:.06em}
    .tt-back{position:absolute;left:24px;bottom:28px;padding:10px 26px;background:#2a2433;font:800 22px ${CON};font-variation-settings:'wdth' 45;letter-spacing:.06em;cursor:pointer;clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);display:none}
    .tt-back:hover{background:#3d3550}
    .tt-crumb{position:absolute;left:24px;top:96px;font:800 64px/1 ${CON};font-variation-settings:'wdth' 35;color:#ffffff14;letter-spacing:.02em}
    .tt-go{position:absolute;inset:0;display:none;place-items:center;font:900 150px/1 ${CON};font-variation-settings:'wdth' 35;color:#fff;text-shadow:0 0 40px #e04fb0;background:#000a;z-index:5}
  `));
  const sky = (top) => { const c = h('canvas.tt-sky', { width: 1440, height: 70, style: { [top ? 'top' : 'bottom']: top ? '52px' : '0px' } }); const g = c.getContext('2d'); const R = rng(top ? 3 : 9); for (let x = 0; x < 1440; x += 8) { const hh = top ? 4 + Math.floor(R() * 4) * 4 * (R() < .5 ? 1 : 0) : 6 + Math.floor(R() * 5) * 4; g.fillStyle = `rgba(255,255,255,${top ? .12 : .1})`; if (top) g.fillRect(x, 0, 8, hh); else g.fillRect(x, 70 - hh, 8, hh); if (R() < .3) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(x, top ? hh : 70 - hh - 8, 8, 8); } } return c; };
  const tick = (f = 660) => blip(f, 0.06, 'square', 0.04);
  const W = h('div.tt'); root.append(W);
  const navA = (t, on) => h('a' + (on ? '.on' : ''), { onmouseenter: () => tick(880), onclick: () => tick(520) }, t);
  W.append(sky(true), sky(false), h('div.tt-top', {}, h('div.tt-logo', {}, 'TETR', h('i', {}, '.IO')), h('nav.tt-nav', {}, navA('PLAY', 1), navA('TETRA CHANNEL'), navA('MERCH'), navA('ABOUT')), h('div.tt-ic', {}, ...['⤓', '𝕏', '◉', '⌂', '★'].map((x) => h('span', { onmouseenter: () => tick(990) }, x)))));
  const beta = h('div.tt-beta', {}, 'BETA');
  const stat = (n, l) => { const b = h('b', {}, n.toLocaleString('en-US')); return [h('div', {}, b, h('small', {}, l)), b, n]; };
  const S = [stat(9755378, 'TOTAL PLAYERS'), stat(1089820244, 'GAMES PLAYED'), stat(51945494, 'HOURS PLAYED')];
  const statsEl = h('div.tt-stats', {}, ...S.map((x) => x[0]));
  const inp = h('input', { placeholder: 'USERNAME', maxlength: 16, onkeydown: (e) => { if (e.key === 'Enter') join(); else tick(400 + Math.random() * 300); } });
  const dlg = h('div.tt-dlg', {}, h('h3', {}, 'WELCOME TO TETR.IO'), h('p', {}, 'PUZZLE TOGETHER IN THIS MODERN YET FAMILIAR ONLINE STACKER. PLAY AGAINST FRIENDS AND FOES ALL OVER THE WORLD, OR CLAIM A SPOT ON THE LEADERBOARDS - THE STACKER FUTURE IS YOURS!'), h('label', {}, 'ENTER A USERNAME TO JOIN, OR LEAVE IT BLANK TO GET A RANDOM ONE'), inp, h('div.tos', { html: 'BY JOINING, YOU ACCEPT THE <a>TERMS OF USE</a>, <a>PRIVACY POLICY</a> AND <a>RULES</a>' }), h('button', { onclick: () => join(), onmouseenter: () => tick(780) }, 'JOIN'));
  const foot = h('div.tt-foot', {}, h('b', {}, 'osk'), '©2019-2026');
  // main menu
  const user = h('b', {}, 'GUEST'); const menu = h('div.tt-menu'); const list = h('div.tt-list'); const crumb = h('div.tt-crumb', {}, 'HOME');
  const back = h('div.tt-back', { onclick: () => { tick(330); show('home'); } }, '◀ BACK'); const go = h('div.tt-go');
  menu.append(crumb, h('div.tt-user', {}, h('div.tt-av', {}, '☺'), h('div', {}, user, h('small', {}, 'LV 7 · 1,204 XP'), h('div.tt-xp', {}, h('i')))), list, back, go);
  const MENUS = {
    home: [['MULTIPLAYER', 'PLAY ONLINE WITH FRIENDS AND FOES', '⚔', 'linear-gradient(90deg,#8a1f6c,#c2459b)', 'multi', '1,204 ONLINE'], ['SOLO', 'CHALLENGE YOURSELF AND TOP THE LEADERBOARDS', '◆', 'linear-gradient(90deg,#4a2aa0,#7a5ae0)', 'solo', '4 MODES'], ['TETRA CHANNEL', 'VIEW LEADERBOARDS, REPLAYS AND RECORDS', '▤', 'linear-gradient(90deg,#1c6c55,#33a37f)', null, 'LIVE'], ['CONFIG', 'TWEAK YOUR TETR.IO EXPERIENCE', '⚙', 'linear-gradient(90deg,#31405a,#53698f)', null, ''], ['ABOUT', 'ALL ABOUT TETR.IO AND HOW TO SUPPORT IT', '?', 'linear-gradient(90deg,#3b3b3b,#5c5c5c)', null, '']],
    solo: [['40 LINES', 'CLEAR 40 LINES AS QUICKLY AS POSSIBLE', '▮', 'linear-gradient(90deg,#1d4f9e,#3c7fe0)', 'play', 'PB 1:02.418'], ['BLITZ', 'A TWO-MINUTE RACE AGAINST THE CLOCK', '⚡', 'linear-gradient(90deg,#a2430f,#e2752a)', 'play', 'PB 142,880'], ['QUICK PLAY', 'CLIMB AS HIGH AS YOU CAN', '▲', 'linear-gradient(90deg,#7a1a2a,#c33a4f)', 'play', 'FLOOR 6'], ['ZEN', 'RELAX, NO PRESSURE, NO END', '◌', 'linear-gradient(90deg,#256067,#3f9aa4)', 'play', 'LV 12'], ['CUSTOM', 'SET YOUR OWN RULES', '✎', 'linear-gradient(90deg,#3a3a46,#5c5c70)', 'play', '']],
    multi: [['QUICK PLAY', 'JOIN THE ENDLESS FREE-FOR-ALL', '▲', 'linear-gradient(90deg,#7a1a2a,#c33a4f)', 'play', '311 PLAYING'], ['TETRA LEAGUE', 'COMPETE 1V1 TO CLIMB THE RANKS', '♛', 'linear-gradient(90deg,#8a6a10,#d0a52a)', 'play', 'RANK S-'], ['CUSTOM ROOM', 'CREATE OR JOIN A PRIVATE ROOM', '⌂', 'linear-gradient(90deg,#3a3a46,#5c5c70)', 'play', '']],
  };
  let screen = 'welcome', where = 'home';
  const show = async (key) => { where = key; crumb.textContent = key === 'home' ? 'HOME' : key.toUpperCase() === 'SOLO' ? 'SOLO' : 'MULTIPLAYER'; back.style.display = key === 'home' ? 'none' : 'block'; list.replaceChildren(...MENUS[key].map(([t, sub, g, bg, to, n], i) => { const el = h('div.tt-it', { style: { background: bg }, onmouseenter: () => tick(560 + i * 70), onclick: () => { tick(990); if (to === 'play') launch(t); else if (to) show(to); else toast(t + ' (demo)'); } }, h('div.g', {}, g), h('div', {}, h('b', {}, t), h('small', {}, sub)), h('div.n', {}, n)); setTimeout(() => el.classList.add('in'), 40 + i * 55); return el; })); };
  const launch = async (t) => { go.style.display = 'grid'; for (const x of ['3', '2', '1', 'GO!']) { go.textContent = x; blip(x === 'GO!' ? 880 : 440, 0.15, 'square', 0.06); await sleep(380); } go.style.display = 'none'; toast(t + ' — replay will not be saved'); };
  const join = () => { const n = inp.value.trim() || 'GUEST-' + Math.floor(1000 + Math.random() * 9000); user.textContent = n.toUpperCase(); tick(990); blip(1320, 0.12, 'square', 0.05, 0.08); dlg.style.opacity = 0; dlg.style.transform = 'translateX(-50%) translateY(-20px)'; setTimeout(() => { [beta, statsEl, dlg].forEach((e) => (e.style.display = 'none')); menu.classList.add('show'); screen = 'menu'; show('home'); }, 300); };
  const reset = () => { screen = 'welcome'; menu.classList.remove('show'); [beta, statsEl, dlg].forEach((e) => (e.style.display = '')); dlg.style.opacity = 1; dlg.style.transform = 'translateX(-50%)'; inp.value = ''; };
  W.append(beta, statsEl, dlg, menu, foot);
  // live-ish counters
  const iv = setInterval(() => { if (!root.isConnected) return clearInterval(iv); S.forEach((x, i) => { x[2] += Math.floor(Math.random() * [3, 40, 6][i]); x[1].textContent = x[2].toLocaleString('en-US'); }); }, 1200);
  window.__demoProof = async () => { inp.value = 'junbok'; join(); await sleep(420); const a = list.children.length; await show('solo'); await sleep(200); const b = list.children.length; await show('home'); reset(); return `joined → home menu (${a} panels) → solo submenu (${b} modes) → back; reset to welcome`; };
};

V['nyt-connections-word-group-grid'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#000', ac: '#000', dark: false });
  const SANS = "'Roboto Flex Variable','Inter Variable',Helvetica,sans-serif"; root.style.fontFamily = SANS; root.style.overflow = 'auto';
  const st = document.createElement('style'); st.textContent = `@keyframes cx-hop{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}@keyframes cx-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}@keyframes cx-pop{0%{transform:scale(.9);opacity:.2}100%{transform:scale(1);opacity:1}}@keyframes cx-fade{0%{opacity:0;transform:translate(-50%,-6px)}15%,85%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}`; root.append(st);
  const GROUPS = [
    { c: '#f9df6d', name: 'THINGS WITH KEYS', w: ['PIANO', 'LOCKSMITH', 'MAP', 'KEYBOARD'] },
    { c: '#a0c35a', name: 'SHADES OF BLUE', w: ['NAVY', 'TEAL', 'AZURE', 'COBALT'] },
    { c: '#b0c4ef', name: 'COFFEE ORDERS', w: ['LATTE', 'MOCHA', 'CORTADO', 'FLAT WHITE'] },
    { c: '#ba81c5', name: '___BOARD', w: ['SKATE', 'DASH', 'CLIP', 'SURF'] }];
  const WC = Object.fromEntries(GROUPS.flatMap((g, i) => g.w.map((w) => [w, i])));
  let words, sel, solved, mistakes, hist, busy;
  const sq = ['🟨', '🟩', '🟦', '🟪'];
  const solvedEl = h('div', { style: { display: 'grid', gap: '8px' } }); const gridEl = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' } });
  const dots = h('div.k-row', { style: { gap: '10px' } }); const toastEl = h('div', { style: { position: 'absolute', left: '50%', top: '128px', background: '#000', color: '#fff', padding: '12px 16px', borderRadius: '4px', fontWeight: 700, fontSize: '15px', opacity: 0, pointerEvents: 'none', zIndex: 5, transform: 'translateX(-50%)' } });
  const say = (t) => { toastEl.textContent = t; toastEl.style.animation = 'none'; void toastEl.offsetWidth; toastEl.style.animation = 'cx-fade 2s forwards'; };
  const pillB = (t, on) => { const b = h('button', { onclick: on, style: { border: '1px solid #000', background: '#fff', color: '#000', borderRadius: '99px', padding: '0 18px', height: '48px', minWidth: '118px', fontWeight: 600, fontSize: '16px', fontFamily: SANS } }, t); return b; };
  const shuffleB = pillB('Shuffle', () => { words = words.sort(() => Math.random() - 0.5); draw(); }), deselB = pillB('Deselect All', () => { sel.clear(); draw(); }), subB = pillB('Submit', () => submit());
  const tiles = new Map();
  const draw = () => {
    solvedEl.replaceChildren(...solved.map((gi) => { const g = GROUPS[gi]; return h('div', { style: { background: g.c, borderRadius: '6px', height: '80px', display: 'grid', placeContent: 'center', textAlign: 'center', animation: 'cx-pop .35s ease-out', gridColumn: '1/-1' } }, h('div', { style: { fontWeight: 800, fontSize: '20px', fontVariationSettings: "'wdth' 80" } }, g.name), h('div', { style: { fontSize: '19px', marginTop: '2px' } }, g.w.join(', '))); }));
    tiles.clear(); gridEl.replaceChildren(...words.map((w) => { const on = sel.has(w); const el = h('button', { onclick: () => { if (busy) return; if (on) sel.delete(w); else if (sel.size < 4) sel.add(w); draw(); }, style: { height: '80px', border: 0, borderRadius: '6px', background: on ? '#5a594e' : '#efefe6', color: on ? '#fff' : '#000', fontFamily: SANS, fontWeight: 800, fontSize: w.length > 8 ? '15px' : '20px', fontVariationSettings: "'wdth' 75", letterSpacing: '.01em', transition: 'background .12s, transform .12s', textTransform: 'uppercase' } }, w); tiles.set(w, el); return el; }));
    dots.replaceChildren(h('span', { style: { fontSize: '16px', marginRight: '4px' } }, 'Mistakes Remaining:'), ...Array.from({ length: 4 }, (_, i) => h('span', { style: { width: '16px', height: '16px', borderRadius: '50%', background: '#5a594e', opacity: i < mistakes ? 1 : 0, transition: 'opacity .4s, transform .4s', transform: i < mistakes ? 'scale(1)' : 'scale(.2)' } })));
    const can = sel.size === 4 && !busy; subB.style.background = can ? '#000' : '#fff'; subB.style.color = can ? '#fff' : '#000'; subB.style.opacity = can || sel.size === 4 ? 1 : 0.45; deselB.style.opacity = sel.size ? 1 : 0.45;
  };
  const submit = async () => {
    if (sel.size !== 4 || busy) return; busy = true; const picked = words.filter((w) => sel.has(w)); const key = [...picked].sort().join('|');
    if (hist.some((x) => x.key === key)) { say('Already guessed!'); busy = false; return; }
    for (const [i, w] of picked.entries()) { await sleep(110); const t = tiles.get(w); t.style.animation = 'none'; void t.offsetWidth; t.style.animation = 'cx-hop .32s ease'; blip(520 + i * 70, 0.06, 'sine', 0.05); }
    await sleep(380); const cnt = [0, 0, 0, 0]; picked.forEach((w) => cnt[WC[w]]++); const best = Math.max(...cnt), gi = cnt.indexOf(best); hist.push({ key, row: picked.map((w) => WC[w]) });
    if (best === 4) { solved.push(gi); words = words.filter((w) => !sel.has(w)); sel.clear(); blip(880, 0.15, 'triangle', 0.07); }
    else { picked.forEach((w) => { const t = tiles.get(w); t.style.animation = 'none'; void t.offsetWidth; t.style.animation = 'cx-shake .4s'; }); await sleep(420); mistakes--; if (best === 3) say('One away...'); blip(180, 0.2, 'sawtooth', 0.04); }
    busy = false; draw();
    if (solved.length === 4 || mistakes === 0) { if (mistakes === 0) { for (const g of GROUPS.map((_, i) => i).filter((i) => !solved.includes(i))) { await sleep(450); solved.push(g); words = words.filter((w) => WC[w] !== g); draw(); } } await sleep(600); end(); }
  };
  const result = () => `Connections-ish\nPuzzle #${T.date || ''}\n` + hist.map((x) => x.row.map((i) => sq[i]).join('')).join('\n');
  const modal = h('div', { style: { position: 'absolute', inset: 0, background: '#ffffffd9', display: 'none', placeItems: 'center', zIndex: 6 } });
  const end = () => { const win = solved.length === 4 && mistakes > 0; modal.replaceChildren(h('div', { style: { background: '#fff', boxShadow: '0 6px 30px #0003', borderRadius: '8px', padding: '36px 56px', textAlign: 'center', minWidth: '360px', animation: 'cx-pop .3s' } }, h('div', { style: { textAlign: 'right', marginTop: '-20px', marginRight: '-36px' } }, h('button', { onclick: () => (modal.style.display = 'none'), style: { border: 0, background: 'none', fontSize: '20px' } }, '✕')), h('div', { style: { fontFamily: "'Fraunces Variable',Georgia,serif", fontWeight: 800, fontSize: '34px' } }, win ? (mistakes === 4 ? 'Perfect!' : 'Great!') : 'Next Time!'), h('div', { style: { margin: '6px 0 18px', fontSize: '16px' } }, `Connections-ish #${T.date || ''}`), h('div', { style: { fontSize: '26px', lineHeight: 1.15, letterSpacing: '2px' } }, ...hist.map((x) => h('div', {}, x.row.map((i) => sq[i]).join('')))), h('div.k-row', { style: { justifyContent: 'center', marginTop: '22px', gap: '10px' } }, h('button', { onclick: () => copy(result(), 'Results copied'), style: { background: '#000', color: '#fff', border: 0, borderRadius: '99px', height: '48px', padding: '0 28px', fontWeight: 700, fontSize: '16px' } }, 'Share Your Results'), pillB('Play Again', () => { modal.style.display = 'none'; reset(); })))); modal.style.display = 'grid'; };
  const reset = () => { words = GROUPS.flatMap((g) => g.w).sort(() => Math.random() - 0.5); sel = new Set(); solved = []; mistakes = 4; hist = []; busy = false; modal.style.display = 'none'; draw(); };
  const top = h('div', { style: { borderBottom: '1px solid #dcdcdc', height: '52px', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '14px' } }, h('span', { style: { fontSize: '20px' } }, '☰'), h('b', { style: { fontFamily: "'Fraunces Variable',Georgia,serif", fontSize: '22px', fontWeight: 800 } }, 'T | Games-ish'), h('span', { style: { flex: 1 } }), h('span', { style: { fontSize: '20px' } }, '⚙︎'), h('span', { style: { fontSize: '18px' } }, '?'));
  const head = h('div', { style: { borderBottom: '1px solid #dcdcdc', padding: '14px 0' } }, h('div', { style: { maxWidth: '660px', margin: '0 auto', display: 'flex', alignItems: 'baseline', gap: '12px', padding: '0 10px' } }, h('b', { style: { fontFamily: "'Fraunces Variable',Georgia,serif", fontWeight: 900, fontSize: '30px', letterSpacing: '-.01em' } }, 'Connections-ish'), h('span', { style: { fontSize: '22px', fontWeight: 300 } }, 'October 6, 2026')));
  const body = h('div', { style: { maxWidth: '640px', margin: '0 auto', padding: '22px 10px', display: 'grid', gap: '8px', justifyItems: 'stretch' } }, h('div', { style: { textAlign: 'center', fontSize: '17px', margin: '4px 0 14px' } }, 'Create four groups of four!'), solvedEl, gridEl, h('div', { style: { display: 'flex', justifyContent: 'center', margin: '18px 0 8px' } }, dots), h('div.k-row', { style: { justifyContent: 'center', gap: '10px', marginTop: '10px' } }, shuffleB, deselB, subB));
  root.append(top, head, body, toastEl, modal); reset();
  window.__demoProof = async () => { const near = [...GROUPS[0].w.slice(0, 3), GROUPS[1].w[0]]; sel = new Set(near); draw(); await submit(); const afterWrong = mistakes; sel = new Set(GROUPS[3].w); draw(); await submit(); const bands = solved.length; for (const g of [0, 1, 2]) { sel = new Set(GROUPS[g].w); draw(); await submit(); } await sleep(700); const ended = modal.style.display === 'grid'; const share = result().split('\n').length; reset(); return `one-away wrong guess (mistakes ${afterWrong}/4) → purple band solved (${bands}) → all 4 solved, end screen=${ended}, share grid ${share - 2} rows; reset`; };
};

V['waffle-drag-swap-letter-grid-color-feedback-swap-counter'] = (root, T) => {
  import('@fontsource/montserrat/500.css'); import('@fontsource/montserrat/600.css'); import('@fontsource/montserrat/700.css'); import('@fontsource/montserrat/800.css');
  theme(root, T, { bg: '#edeff1', fg: '#1a1a1a', ac: '#6fb05c', dark: false });
  const MS = "'Montserrat','Clear Sans','Helvetica Neue',Arial,sans-serif";
  const st = document.createElement('style'); st.textContent = `
.wf{position:absolute;inset:0;background:#edeff1;font-family:${MS};color:#1a1a1a;user-select:none;-webkit-user-select:none;overflow:hidden}
.wf-col{position:absolute;left:50%;top:0;bottom:0;width:728px;transform:translateX(-50%);background:#fff}
.wf-hd{position:relative;height:78px;display:flex;align-items:center;padding:0 20px;gap:20px}
.wf-ib{all:unset;cursor:pointer;width:47px;height:47px;border-radius:7px;background:#f3f4f6;display:grid;place-items:center;color:#1a1a1a;transition:background .15s,transform .1s}
.wf-ib:hover{background:#e7e9ec}.wf-ib:active{transform:scale(.94)}
.wf-sp{flex:1}
.wf-ttl{position:absolute;left:50%;top:15px;transform:translateX(-50%);text-align:center;pointer-events:none}
.wf-ttl b{display:block;font:800 25px/1 ${MS};letter-spacing:.17em;margin-right:-.17em}
.wf-ttl small{display:block;font:600 13px/1 ${MS};letter-spacing:.12em;color:#8e9196;margin-top:7px}
.wf-board{position:absolute;left:50%;top:176px;width:447px;height:447px;transform:translateX(-50%)}
.wf-t{position:absolute;width:83px;height:83px;border-radius:6px;display:grid;place-items:center;font:700 40px/1 ${MS};cursor:grab;touch-action:none;
  background:var(--c);color:var(--tc);box-shadow:inset 0 -5px 0 var(--e);padding-bottom:4px;box-sizing:border-box;transition:left .28s cubic-bezier(.3,.7,.3,1),top .28s cubic-bezier(.3,.7,.3,1),background .25s,box-shadow .25s,color .25s,transform .25s}
.wf-t.g{--c:#6fb05c;--e:#5b9a49;--tc:#fff;cursor:default}
.wf-t.y{--c:#e9ba3a;--e:#d3a42a;--tc:#fff}
.wf-t.n{--c:#edeff1;--e:#d4d6d9;--tc:#1a1a1a}
.wf-t.drag{transition:background .25s,box-shadow .25s,transform .12s;z-index:5;transform:scale(1.08);cursor:grabbing;box-shadow:inset 0 -5px 0 var(--e),0 14px 26px #0003}
.wf-t.over{transform:scale(.92);filter:brightness(.96)}
.wf-t.flip{animation:wfflip .5s ease both}
@keyframes wfflip{0%{transform:rotateX(0)}50%{transform:rotateX(90deg)}100%{transform:rotateX(0)}}
.wf-t.shake{animation:wfshake .3s}
@keyframes wfshake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.wf-sw{position:absolute;left:0;right:0;top:648px;text-align:center;font:500 21px/1 ${MS};letter-spacing:.09em;color:#a3a6ab}
.wf-sw b{color:#1a1a1a;font-weight:800;margin-right:6px;display:inline-block}
.wf-sw b.tick{animation:wftick .35s}
@keyframes wftick{40%{transform:scale(1.35)}}
.wf-ov{position:absolute;inset:0;background:#ffffffb3;display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity .3s;z-index:20}
.wf-ov.on{opacity:1;pointer-events:auto}
.wf-md{width:420px;background:#fff;border-radius:12px;box-shadow:0 18px 60px #0003;padding:26px 28px 24px;text-align:center;transform:translateY(16px);transition:transform .35s cubic-bezier(.2,.8,.3,1.2)}
.wf-ov.on .wf-md{transform:none}
.wf-md h2{margin:0;font:800 26px ${MS};letter-spacing:.14em}
.wf-md .sub{font:600 12px ${MS};letter-spacing:.12em;color:#8e9196;margin:6px 0 16px}
.wf-stars{display:flex;justify-content:center;gap:8px;margin:6px 0 14px}
.wf-stars svg{width:42px;height:42px;opacity:0;transform:scale(.3) rotate(-30deg);transition:opacity .3s,transform .45s cubic-bezier(.3,1.6,.5,1)}
.wf-stars svg.on{opacity:1;transform:none}
.wf-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0 18px}
.wf-stats div{font:700 26px ${MS}}.wf-stats small{display:block;font:600 10px ${MS};letter-spacing:.08em;color:#8e9196;margin-top:4px;text-transform:uppercase}
.wf-mini{display:inline-grid;grid-template-columns:repeat(5,16px);gap:3px;margin-bottom:16px}
.wf-mini i{width:16px;height:16px;border-radius:3px}
.wf-btns{display:flex;gap:10px;justify-content:center}
.wf-b{all:unset;cursor:pointer;font:700 14px ${MS};letter-spacing:.08em;padding:12px 20px;border-radius:7px;background:#6fb05c;color:#fff;box-shadow:inset 0 -4px 0 #5b9a49}
.wf-b.alt{background:#edeff1;color:#1a1a1a;box-shadow:inset 0 -4px 0 #d4d6d9}
.wf-help{position:absolute;right:20px;top:72px;width:330px;background:#fff;border-radius:10px;box-shadow:0 12px 40px #0002;padding:16px 18px;font:500 13px/1.5 ${MS};z-index:15;display:none}
.wf-help.on{display:block}.wf-help h4{margin:0 0 6px;font:800 14px ${MS};letter-spacing:.1em}
.wf-help .k{display:inline-block;width:16px;height:16px;border-radius:3px;vertical-align:-3px;margin-right:6px}
`; root.append(st);
  // solution: rows BRAVE / OLIVE / MONEY, columns BLOOM / ALIGN / EVERY
  const SOL = ['BRAVE', 'L.L.V', 'OLIVE', 'O.G.R', 'MONEY'];
  const cells = []; for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) if (SOL[r][c] !== '.') cells.push({ r, c, s: SOL[r][c] });
  const idx = (r, c) => cells.findIndex((k) => k.r === r && k.c === c);
  const LINES = [0, 2, 4].map((r) => [0, 1, 2, 3, 4].map((c) => idx(r, c))).concat([0, 2, 4].map((c) => [0, 1, 2, 3, 4].map((r) => idx(r, c))));
  const scramble = () => { // deterministic 10-swap scramble that keeps the 5 anchor tiles fixed (like Waffle's pre-solved corners/centre)
    const R = rng(1722); const cur = cells.map((k) => k.s); const anchors = new Set([idx(0, 0), idx(0, 4), idx(2, 2), idx(4, 0), idx(4, 4)]);
    const free = cells.map((_, i) => i).filter((i) => !anchors.has(i)); let n = 0, guard = 0;
    while (n < 10 && guard++ < 999) { const a = pick(free, R), b = pick(free, R); if (a === b || cur[a] === cur[b] || cur[a] !== cells[a].s && cur[b] !== cells[b].s && R() < .5) continue; [cur[a], cur[b]] = [cur[b], cur[a]]; n++; }
    return cur; };
  const START = scramble(); const MAX = 15;
  let cur = START.slice(), swaps = MAX, done = false, streak = 3, played = 12, wins = 11;
  const wrap = h('div.wf'); root.append(wrap);
  const ico = { menu: '<svg width="20" height="18" viewBox="0 0 20 18"><rect y="1" width="20" height="4" rx="2" fill="#1a1a1a"/><rect y="7" width="20" height="4" rx="2" fill="#1a1a1a"/><rect y="13" width="20" height="4" rx="2" fill="#1a1a1a"/></svg>',
    heart: '<svg width="22" height="20" viewBox="0 0 24 21"><path d="M12 21 2.2 11.4C-.6 8.6-.7 4.1 2 1.6 4.6-.8 8.6-.4 10.9 2.3L12 3.6l1.1-1.3C15.4-.4 19.4-.8 22 1.6c2.7 2.5 2.6 7-.2 9.8Z" fill="#1a1a1a"/></svg>',
    stats: '<svg width="20" height="19" viewBox="0 0 20 19"><rect x="0" y="5" width="5" height="14" rx="1.5" fill="#1a1a1a"/><rect x="7.5" y="0" width="5" height="19" rx="1.5" fill="#1a1a1a"/><rect x="15" y="9" width="5" height="10" rx="1.5" fill="#1a1a1a"/></svg>',
    help: '<svg width="16" height="22" viewBox="0 0 16 22"><path d="M1.5 6.2C1.9 2.6 4.6.6 8.3.6c3.9 0 6.6 2.2 6.6 5.6 0 2.5-1.4 3.8-3.2 4.9-1.5.9-1.9 1.4-1.9 2.7v.8H5.6v-1c0-2.2.7-3.3 2.6-4.5 1.5-.9 2.2-1.5 2.2-2.7 0-1.3-1-2.2-2.4-2.2S5.6 5.1 5.4 6.5Z" fill="#1a1a1a"/><circle cx="7.8" cy="19" r="2.6" fill="#1a1a1a"/></svg>' };
  const col = h('div.wf-col'); wrap.append(col);
  const help = h('div.wf-help', {}, h('h4', {}, 'HOW TO PLAY'), h('div', {}, 'Drag a tile onto another to swap them. Solve all six words before you run out of swaps.'),
    h('div', { style: { marginTop: '8px' } }, h('span.k', { style: { background: '#6fb05c' } }), 'right letter, right spot'), h('div', {}, h('span.k', { style: { background: '#e9ba3a' } }), 'in the word, wrong spot'), h('div', {}, h('span.k', { style: { background: '#edeff1', boxShadow: 'inset 0 -2px 0 #d4d6d9' } }), 'not in that row/column word'));
  const swEl = h('b', {}, String(swaps));
  col.append(h('div.wf-hd', {}, h('button.wf-ib', { html: ico.menu, title: 'Menu', onclick: () => toast('Archive · Deluxe · Settings') }), h('button.wf-ib', { html: ico.heart, title: 'Support', onclick: () => toast('♥ Thanks for supporting Waffle') }),
    h('div.wf-sp'), h('div.wf-ttl', {}, h('b', {}, 'WAFFLE'), h('small', {}, 'DAILY WAFFLE #1722')), h('button.wf-ib', { html: ico.stats, title: 'Statistics', onclick: () => showModal(false) }), h('button.wf-ib', { html: ico.help, title: 'Help', onclick: () => help.classList.toggle('on') })), help);
  const board = h('div.wf-board'); col.append(board, h('div.wf-sw', {}, swEl, 'SWAPS REMAINING'));
  const P = (i) => ({ left: cells[i].c * 91 + 'px', top: cells[i].r * 91 + 'px' });
  // tiles keep identity; position index map pos[i] = tile at cell i
  const tiles = cur.map((ch, i) => { const el = h('div.wf-t', {}, ch); Object.assign(el.style, P(i)); el.cell = i; board.append(el); return el; });
  let at = tiles.slice(); // at[cell] = tile element
  const colors = () => { const res = cells.map((k, i) => (cur[i] === k.s ? 'g' : 'n'));
    for (const L of LINES) { const need = {}; L.forEach((i) => { if (cur[i] !== cells[i].s) need[cells[i].s] = (need[cells[i].s] || 0) + 1; }); L.forEach((i) => { if (res[i] === 'g') return; if (need[cur[i]] > 0) { need[cur[i]]--; res[i] = 'y'; } }); }
    return res; };
  const paint = () => { const cs = colors(); at.forEach((el, i) => { el.textContent = cur[i]; el.className = 'wf-t ' + cs[i]; }); return cs; };
  const setSwaps = (n) => { swaps = n; swEl.textContent = n; swEl.classList.remove('tick'); void swEl.offsetWidth; swEl.classList.add('tick'); };
  const swap = (a, b, count = true) => { if (a === b || done) return false; const cs = colors(); if (cs[a] === 'g' || cs[b] === 'g') return false;
    [cur[a], cur[b]] = [cur[b], cur[a]]; [at[a], at[b]] = [at[b], at[a]]; Object.assign(at[a].style, P(a)); Object.assign(at[b].style, P(b)); at[a].cell = a; at[b].cell = b;
    if (count) setSwaps(swaps - 1); blip(520 + Math.random() * 80, .08, 'triangle', .05); setTimeout(check, 300); paintSoon(); return true; };
  let pt; const paintSoon = () => { clearTimeout(pt); pt = setTimeout(paint, 180); };
  const check = () => { const cs = colors(); if (cs.every((c) => c === 'g')) win(); else if (swaps <= 0) lose(); };
  const win = async () => { if (done) return; done = true; for (const L of LINES) { for (const i of L) { at[i].classList.remove('flip'); void at[i].offsetWidth; at[i].classList.add('flip'); } blip(660, .12, 'sine', .06); await sleep(160); }
    played++; wins++; streak++; await sleep(350); showModal(true); };
  const lose = () => { done = true; played++; streak = 0; cells.forEach((k, i) => { at[i].textContent = k.s; }); setTimeout(() => showModal(true, true), 400); };
  // ---- drag to swap ----
  board.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.wf-t'); if (!el || done) return; const from = el.cell; if (colors()[from] === 'g') { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); return; }
    e.preventDefault(); const br = board.getBoundingClientRect(); const ox = e.clientX - br.left - parseFloat(el.style.left), oy = e.clientY - br.top - parseFloat(el.style.top); el.classList.add('drag'); let over = null;
    const mv = (ev) => { el.style.left = ev.clientX - br.left - ox + 'px'; el.style.top = ev.clientY - br.top - oy + 'px'; const cx = ev.clientX - br.left, cy = ev.clientY - br.top;
      const hit = cells.findIndex((k, i) => i !== from && cx >= k.c * 91 && cx < k.c * 91 + 83 && cy >= k.r * 91 && cy < k.r * 91 + 83); const nt = hit >= 0 && colors()[hit] !== 'g' ? hit : null;
      if (nt !== over) { if (over != null) at[over].classList.remove('over'); over = nt; if (over != null) at[over].classList.add('over'); } };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); el.classList.remove('drag'); if (over != null) { at[over].classList.remove('over'); swap(from, over); } else Object.assign(el.style, P(from)); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); });
  // ---- result modal ----
  const ov = h('div.wf-ov', { onclick: (e) => { if (e.target === ov) ov.classList.remove('on'); } }); wrap.append(ov);
  const star = (on) => h('span', { html: `<svg viewBox="0 0 24 24" class="${on ? '' : 'off'}"><path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5 1.4-7.1-5.3-5 7.2-.9Z" fill="${on ? '#e9ba3a' : '#e3e5e8'}" stroke="${on ? '#d3a42a' : '#d4d6d9'}" stroke-width="1.2" stroke-linejoin="round"/></svg>` }).firstChild;
  const showModal = async (end, lost) => { const nstars = end && !lost ? Math.min(5, swaps) : 0; const cs = colors();
    const stars = h('div.wf-stars', {}, [0, 1, 2, 3, 4].map((k) => star(k < nstars)));
    const mini = h('div.wf-mini', {}, ...Array.from({ length: 25 }, (_, k) => { const r = Math.floor(k / 5), c = k % 5, i = idx(r, c); return h('i', { style: { background: i < 0 ? 'transparent' : cs[i] === 'g' ? '#6fb05c' : cs[i] === 'y' ? '#e9ba3a' : '#e3e5e8' } }); }));
    const share = () => { const g = Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => { const i = idx(r, c); return i < 0 ? '⬜' : cs[i] === 'g' ? '🟩' : '🟨'; }).join('')).join('\n'); copy(`#waffle1722 ${nstars}/5\n\n${g}\n\n🔥 streak: ${streak}`, 'Result copied'); };
    ov.replaceChildren(h('div.wf-md', {}, h('h2', {}, end ? (lost ? 'OUT OF SWAPS' : 'WAFFLE!') : 'STATISTICS'), h('div.sub', {}, end ? (lost ? 'THE ANSWER WAS REVEALED' : `SOLVED WITH ${swaps} SWAPS LEFT`) : 'DAILY WAFFLE #1722'),
      end ? stars : null, end ? mini : null,
      h('div.wf-stats', {}, ...[[played, 'Played'], [Math.round((wins / played) * 100) + '%', 'Win %'], [streak, 'Streak'], [Math.max(streak, 8), 'Best']].map(([v, l]) => h('div', {}, String(v), h('small', {}, l)))),
      h('div.wf-btns', {}, h('button.wf-b', { onclick: share }, 'SHARE'), h('button.wf-b.alt', { onclick: () => { ov.classList.remove('on'); } }, 'CLOSE'))));
    ov.classList.add('on'); if (end) { const ss = [...stars.children]; for (const s0 of ss) { await sleep(180); if (s0.querySelector('path').getAttribute('fill') === '#e9ba3a') { s0.classList.add('on'); blip(780, .1, 'sine', .05); } else s0.classList.add('on'); } } return ov; };
  const reset = () => { cur = START.slice(); at = tiles.slice(); tiles.forEach((el, i) => { el.cell = i; Object.assign(el.style, P(i)); }); swaps = MAX; swEl.textContent = MAX; done = false; ov.classList.remove('on'); paint(); };
  paint();
  // greedy solver (used by the demo proof to play a full game through the real swap() path)
  const nextMove = () => { const cs = colors(); for (let a = 0; a < cells.length; a++) { if (cs[a] === 'g') continue; for (let b = 0; b < cells.length; b++) if (b !== a && cs[b] !== 'g' && cur[b] === cells[a].s && cur[a] === cells[b].s) return [a, b]; }
    for (let a = 0; a < cells.length; a++) { if (cs[a] === 'g') continue; for (let b = 0; b < cells.length; b++) if (b !== a && cs[b] !== 'g' && cur[b] === cells[a].s) return [a, b]; } return null; };
  window.__demoProof = async () => { const out = []; reset(); const g0 = colors().filter((c) => c === 'g').length, y0 = colors().filter((c) => c === 'y').length; out.push(`start: ${g0} green / ${y0} yellow, ${swaps} swaps`);
    // real pointer drag for the first move
    const [a, b] = nextMove(); const ta = at[a], br = board.getBoundingClientRect(); const pos = (i) => [br.left + cells[i].c * 91 + 41, br.top + cells[i].r * 91 + 41];
    const ev = (t, [x, y], tg = window) => tg.dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: x, clientY: y, pointerId: 1, button: 0, buttons: t === 'pointerup' ? 0 : 1 }));
    ev('pointerdown', pos(a), ta); for (let k = 1; k <= 6; k++) { const [x0, y0] = pos(a), [x1, y1] = pos(b); ev('pointermove', [x0 + (x1 - x0) * k / 6, y0 + (y1 - y0) * k / 6]); await sleep(16); } ev('pointerup', pos(b)); await sleep(420);
    out.push(`drag ${cells[a].r},${cells[a].c}→${cells[b].r},${cells[b].c}: now ${colors().filter((c) => c === 'g').length} green, counter ${swaps}`);
    let m, n = 0; while (!done && (m = nextMove()) && n++ < 14) { swap(m[0], m[1]); await sleep(60); }
    await sleep(2400); out.push(`solved=${colors().every((c) => c === 'g')} with ${swaps} swaps left, modal=${ov.classList.contains('on')}, stars=${ov.querySelectorAll('.wf-stars svg.on path[fill="#e9ba3a"]').length}`);
    reset(); out.push('restored to fresh puzzle'); return out.join('; '); };
};

V['adarkroom-minimal-text-survival-cooldown-buttons-fading-log-lights-off'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#000000', ac: '#000000', dark: false });
  const TM = "'Times New Roman',Times,'Liberation Serif',serif";
  css(`.adr{position:absolute;inset:0;overflow:hidden;background:#fff;color:#000;font:16px/1.25 ${TM};transition:background-color 1s,color 1s;user-select:none;-webkit-user-select:none}
.adr.dark{background:#272823;color:#eee}
.adr-w{position:absolute;left:calc(50% - 460px);top:0;width:920px;bottom:60px;transition:opacity .4s}
.adr.ev .adr-w{opacity:.33}
.adr-log{position:absolute;left:0;top:13px;width:200px;bottom:0;overflow:hidden;-webkit-mask-image:linear-gradient(#000 40%,transparent 92%);mask-image:linear-gradient(#000 40%,transparent 92%)}
.adr-log div{margin-bottom:10px;transition:opacity .6s}
.adr-log div.nw{animation:adrIn .5s ease}
@keyframes adrIn{from{opacity:0}}
.adr-main{position:absolute;left:220px;top:0;right:0;bottom:0}
.adr-hd{position:relative;height:40px;padding-top:13px;white-space:nowrap}
.adr-hd span{cursor:pointer;color:inherit;opacity:.55}.adr-hd span.on{text-decoration:underline;opacity:1;cursor:default}
.adr-hd i{font-style:normal;margin:0 8px;opacity:.55}
.adr-hd span.new{animation:adrIn 1.4s ease}
.adr-pane{position:absolute;left:0;top:40px;right:0;bottom:0;transition:transform .6s cubic-bezier(.4,0,.2,1),opacity .6s}
.adr-pane.off{transform:translateX(-40px);opacity:0;pointer-events:none}
.adr-btn{position:relative;display:block;width:100px;padding:5px 0 6px;border:1px solid currentColor;text-align:center;cursor:pointer;margin-bottom:5px;background:transparent;color:inherit;font:inherit;overflow:hidden}
.adr-btn .cd{position:absolute;left:0;top:0;bottom:0;width:0;background:#ddd;z-index:0}
.adr.dark .adr-btn .cd{background:#555}
.adr-btn b{position:relative;z-index:1;font-weight:400}
.adr-btn.dis{cursor:default;color:#999;border-color:#999}
.adr-btn.dis b{color:#999}
.adr-btn:not(.dis):hover{text-decoration:underline}
.adr-btn.new{animation:adrIn 1.2s ease}
.adr-st{position:absolute;left:420px;top:0;width:200px;border:1px solid currentColor;padding:14px 10px 8px;animation:adrIn 1s ease}
.adr-st .lg{position:absolute;top:-10px;left:8px;background:#fff;padding:0 3px;transition:background-color 1s}
.adr.dark .adr-st .lg,.adr.dark .adr-ev .lg{background:#272823}
.adr-row{display:flex;gap:4px;margin:2px 0}.adr-row .dt{flex:1;border-bottom:1px dotted currentColor;opacity:.4;margin-bottom:4px}
.adr-ev{position:absolute;left:calc(50% - 210px);top:52px;width:338px;border:2px solid #000;background:#fff;padding:20px 20px 18px;box-shadow:4px 4px 0 #00000080,6px 6px 6px #0004;color:#000;z-index:5;animation:adrIn .4s ease;transition:background-color 1s,color 1s,border-color 1s}
.adr.dark .adr-ev{background:#272823;color:#eee;border-color:#eee}
.adr-ev .lg{position:absolute;top:-10px;left:12px;background:#fff;padding:0 2px;font-weight:700}
.adr-ev p{margin:0 0 16px}
.adr-ev .bt{display:flex;gap:14px;margin-top:30px}.adr-ev .adr-btn{width:auto;padding:3px 14px 4px;margin:0;white-space:nowrap}
.adr-ft{position:absolute;right:calc(50% - 652px);bottom:16px;display:flex;gap:14px;white-space:nowrap;color:#808080;z-index:6}
.adr-ft span{cursor:pointer}.adr-ft span:hover{text-decoration:underline}.adr-ft b{cursor:pointer}
.adr-fb{position:absolute;left:10px;bottom:4px;opacity:.9}
.adr-desc{margin:14px 0 0;max-width:320px;opacity:.55;transition:opacity .8s}
@media (max-width:1300px){.adr-ft{right:16px}}
@media (prefers-reduced-motion: reduce){.adr *, .adr{animation:none!important;transition:none!important}}
`);
  const el = h('div.adr'), W = h('div.adr-w'), log = h('div.adr-log'), main = h('div.adr-main'), hd = h('div.adr-hd'); main.append(hd); W.append(log, main); el.append(W); root.append(el);
  const room = h('div.adr-pane'), forest = h('div.adr-pane.off'); main.append(room, forest);
  // ---------- state ----------
  const FIRE = ['dead', 'smoldering', 'flickering', 'burning', 'roaring'], TEMP = ['freezing', 'cold', 'mild', 'warm', 'hot'];
  let S, speed = 1, gt = 0, sound = false, lights = true, loc = 'room', evEl = null;
  const fresh = () => ({ fire: 0, temp: 0, wood: 0, lit: false, stranger: 0, forest: false, stores: false, nextCool: 0, nextTemp: 0, nextStr: 0 });
  // ---------- log ----------
  const fadeLog = () => [...log.children].forEach((d, i) => { d.style.opacity = Math.max(0.05, 1 - i * 0.11).toFixed(2); });
  const say = (t) => { const d = h('div.nw', {}, t); log.prepend(d); while (log.children.length > 18) log.lastChild.remove(); fadeLog(); };
  // ---------- buttons with cooldown ----------
  const btns = [];
  const mk = (label, cd, act, opts = {}) => { const fill = h('div.cd'); const b = h('div.adr-btn' + (opts.cls || ''), { role: 'button', tabindex: 0 }, fill, h('b', {}, label));
    const o = { el: b, label, cd, end: 0, dur: 0, fill, act, set(l) { o.label = l; b.querySelector('b').textContent = l; } };
    const fire2 = () => { if (o.end > gt || b.classList.contains('dis')) return; if (o.act() === false) return; o.end = gt + o.cd; o.dur = o.cd; b.classList.add('dis'); };
    b.addEventListener('click', fire2); b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire2(); } }); o.fire = fire2; btns.push(o); return o; };
  const fireBtn = mk('light fire', 10000, () => { if (!S.lit) { S.lit = true; S.fire = 3; S.nextCool = gt + 30000; S.nextStr = gt + 9000; setFire(); fireBtn.set('stoke fire'); return; }
    if (S.wood <= 0) { say('not enough wood to get the fire going.'); return false; } S.wood--; S.fire = Math.min(4, S.fire + 1); S.nextCool = gt + 30000; setFire(); stores(); });
  const desc = h('p.adr-desc');
  room.append(fireBtn.el, desc);
  const woodBtn = mk('gather wood', 8000, () => { const n = 10; S.wood += n; say('dry brush and dead branches litter the forest floor.'); stores(); blipS(330, 0.05); });
  forest.append(woodBtn.el);
  let stEl = null;
  const stores = () => { if (S.wood > 0) S.stores = true; if (!S.stores) { stEl?.remove(); stEl = null; return; }
    if (!stEl) { stEl = h('div.adr-st', {}, h('div.lg', {}, 'stores')); main.append(stEl); }
    stEl.querySelectorAll('.adr-row').forEach((r) => r.remove()); stEl.append(h('div.adr-row', {}, h('span', {}, 'wood'), h('span.dt'), h('span.v', {}, String(S.wood)))); };
  const title = () => (S.lit ? (S.fire > 0 ? 'A Firelit Room' : 'A Dark Room') : 'A Dark Room');
  const header = () => { hd.innerHTML = ''; const a = h('span' + (loc === 'room' ? '.on' : ''), { onclick: () => goLoc('room') }, title()); hd.append(a);
    if (S.forest) { hd.append(h('i', {}, '|')); hd.append(h('span' + (loc === 'forest' ? '.on' : '') + (S._newF ? '.new' : ''), { onclick: () => goLoc('forest') }, 'A Silent Forest')); S._newF = false; } };
  const goLoc = (l) => { loc = l; room.classList.toggle('off', l !== 'room'); forest.classList.toggle('off', l !== 'forest'); header(); if (l === 'forest' && !S._seenF) { S._seenF = true; say('the sky is grey and the wind blows relentlessly.'); } };
  const DESC = ['the room is dark. cold air seeps in under the door.', 'embers glow faintly in the hearth.', 'shadows dance on the walls.', 'the fire crackles; light spills from the windows, out into the dark.', 'the fire roars, the room is bright and warm.'];
  const setFire = () => { say(`the fire is ${FIRE[S.fire]}.`); if (S.fire === 3 && !S._spill) { S._spill = true; say('the light from the fire spills from the windows, out into the dark.'); } desc.textContent = DESC[S.fire]; header(); crackle(); };
  // ---------- sound (tiny WebAudio) ----------
  const blipS = (f, d) => { if (sound) blip(f, d, 'triangle', 0.05); };
  const crackle = () => { if (!sound) return; const ac = audio(); if (!ac) return; const n = Math.round(ac.sampleRate * 0.25); const b = ac.createBuffer(1, n, ac.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() < 0.004 ? Math.random() * 2 - 1 : d[i - 1] * 0.6 || 0; const src = ac.createBufferSource(); src.buffer = b; const g = ac.createGain(); g.gain.value = 0.25; src.connect(g).connect(ac.destination); src.start(); };
  // ---------- event modal ----------
  const event = (ttl, lines, choices) => { evEl?.remove(); el.classList.add('ev'); evEl = h('div.adr-ev', {}, h('div.lg', {}, ttl), lines.map((l) => h('p', {}, l)), h('div.bt', {}, choices.map(([l, f]) => { const b = h('div.adr-btn', { role: 'button' }, h('b', {}, l)); b.onclick = () => { closeEv(); f(); }; return b; }))); el.append(evEl); };
  const closeEv = () => { evEl?.remove(); evEl = null; el.classList.remove('ev'); };
  // ---------- footer ----------
  const lightsEl = h('span', { onclick: () => setLights(!lights) }, 'lights off.'), soundEl = h('span', { onclick: () => setSound(!sound) }, 'sound on.'), hyperEl = h('span', { onclick: () => { speed = speed === 1 ? 2 : 1; hyperEl.textContent = speed > 1 ? 'classic.' : 'hyper.'; } }, 'hyper.');
  const ft = h('div.adr-ft', {}, h('span', { onclick: () => toast('github (demo link)') }, 'github.'), h('span', { onclick: () => toast('saved.') }, 'save.'), h('span', { onclick: () => copy(location.href, 'link copied') }, 'share.'),
    h('span', { onclick: () => event('Restart?', ['restart the game?'], [['yes', () => reset(false)], ['no', () => {}]]) }, 'restart.'), hyperEl, lightsEl, h('b', {}, 'get the app.'), soundEl, h('span', {}, 'language.'));
  el.append(ft, h('div.adr-fb', { html: '<svg width="38" height="30" viewBox="0 0 38 30"><path d="M1.5 1.5h35v20h-24l-8 7 2-7h-5z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>' }));
  const setLights = (on) => { lights = on; el.classList.toggle('dark', !on); lightsEl.textContent = on ? 'lights off.' : 'lights on.'; };
  const setSound = (on) => { sound = on; soundEl.textContent = on ? 'sound off.' : 'sound on.'; if (on) { audio(); crackle(); } };
  // ---------- loop ----------
  let raf = 0, last = performance.now();
  const step = (now) => { const dt = Math.min(250, now - last) * speed; last = now; if (!evEl) gt += dt;
    for (const b of btns) { if (b.end > gt) { const k = (b.end - gt) / b.dur; b.fill.style.width = (k * 100).toFixed(1) + '%'; } else if (b.el.classList.contains('dis')) { b.fill.style.width = '0%'; b.el.classList.remove('dis'); } }
    if (S.lit) { if (S.fire > 0 && gt > S.nextCool) { S.fire--; S.nextCool = gt + 30000; setFire(); }
      if (gt > S.nextTemp) { S.nextTemp = gt + 6000; const want = S.fire; if (S.temp !== want) { S.temp += Math.sign(want - S.temp); say(`the room is ${TEMP[S.temp]}.`); } }
      if (S.stranger < 3 && S.nextStr && gt > S.nextStr) { S.stranger++; S.nextStr = gt + 7000;
        if (S.stranger === 1) say('a ragged stranger stumbles through the door and collapses in the corner.');
        if (S.stranger === 2) say('the stranger shivers, and mumbles quietly. her words are unintelligible.');
        if (S.stranger === 3) { say('the stranger in the corner stops shivering. her breathing calms.'); say('the wind howls outside. the wood is running out.'); S.forest = true; S._newF = true; header(); } } }
    raf = requestAnimationFrame(step); };
  const reset = (askSound = true) => { closeEv(); S = fresh(); gt = 0; speed = 1; hyperEl.textContent = 'hyper.'; btns.forEach((b) => { b.end = 0; b.fill.style.width = '0%'; b.el.classList.remove('dis'); }); fireBtn.set('light fire'); log.innerHTML = ''; stEl?.remove(); stEl = null; setLights(true); goLoc('room');
    desc.textContent = DESC[0]; say('the room is freezing.'); say('the fire is dead.');
    if (askSound) event('Sound Available!', ['ears flooded with new sensations.', 'perhaps silence is safer?'], [['enable audio', () => setSound(true)], ['disable audio', () => setSound(false)]]); };
  reset(); raf = requestAnimationFrame(step);
  window.__demoProof = async () => { const o = []; reset(false); setSound(false);
    fireBtn.el.click(); await sleep(120); o.push(`light fire → header "${hd.textContent}", button "${fireBtn.label}" disabled=${fireBtn.el.classList.contains('dis')} cooldown fill=${fireBtn.fill.style.width}`);
    o.push(`log top="${log.firstChild.textContent}", line opacities=${[...log.children].slice(0, 4).map((d) => d.style.opacity).join('/')}`);
    speed = 40; await sleep(800); speed = 1; o.push(`fast-forward → stranger=${S.stranger}, forest tab=${S.forest}, room temp=${TEMP[S.temp]}`);
    if (S.forest) { goLoc('forest'); await sleep(50); woodBtn.el.click(); o.push(`gather wood → stores wood=${stEl?.querySelector('.v')?.textContent}`); goLoc('room'); }
    fireBtn.end = 0; fireBtn.el.classList.remove('dis'); fireBtn.el.click(); o.push(`stoke fire → wood=${S.wood}, fire=${FIRE[S.fire]}`);
    lightsEl.click(); o.push(`lights off → dark=${el.classList.contains('dark')} bg=${getComputedStyle(el).backgroundColor}`); await sleep(100); lightsEl.click(); o.push(`lights on → dark=${el.classList.contains('dark')}`);
    reset(true); o.push(`restored + sound modal (log="${log.firstChild.textContent}", header="${hd.textContent}")`); return o.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['css-grid-garden-puzzle'])(root, T); }
