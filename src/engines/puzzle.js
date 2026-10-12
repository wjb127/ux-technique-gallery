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

V['skribbl-doodle-lobby-avatar-arrow-customizer-randomize-dice-pixel-logo'] = (root, T) => {
  import('@fontsource-variable/nunito'); import('@fontsource/gochi-hand');
  theme(root, T, { bg: '#124da5', fg: '#ffffff', ac: '#53e237', dark: true });
  const NU = "'Nunito Variable','Nunito',system-ui,sans-serif", GH = "'Gochi Hand','Comic Sans MS',cursive";
  // ---------- doodle background tile (hand-drawn line icons) ----------
  const R = rng(4242);
  const ICON = [
    'M-14 0a14 14 0 1 0 28 0a14 14 0 1 0-28 0M-6-4v2M6-4v2M-7 5q7 7 14 0', // smiley
    'M-14 14v-14l14-12l14 12v14zM-4 14v-9h8v9', // house
    'M0-15l4 10h11l-9 7l3 11l-9-7l-9 7l3-11l-9-7h11z', // star
    'M0 13c-18-11-14-25-6-25c4 0 6 4 6 6c0-2 2-6 6-6c8 0 12 14-6 25z', // heart
    'M-16 0q10-12 24 0q-14 12-24 0zM8 0l9-8v16zM-8-2v1', // fish
    'M-14 6a7 7 0 0 1 3-13a9 9 0 0 1 17-1a7 7 0 0 1 8 14z', // cloud
    'M-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0M0-15v5M0 10v5M-15 0h5M10 0h5M-11-11l4 4M7 7l4 4M11-11l-4 4M-7 7l-4 4', // sun
    'M0 15v-10M-12 4q-4-16 12-19q16 3 12 19z', // tree
    'M-10-10h18v18a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6zM8-6h4a4 4 0 0 1 0 8h-4', // cup
    'M-15 0a15 15 0 0 1 30 0q-4-4-7 0q-4-4-8 0q-4-4-8 0q-3-4-7 0M0 0v12a3 3 0 0 1-6 0', // umbrella
    'M-12 8l-3-16l8 7l7-11l7 11l8-7l-3 16z', // crown
    'M-16 6v-6l5-7h18l6 7h3v6zM-10 6a3 3 0 1 0 6 0M6 6a3 3 0 1 0 6 0', // car
    'M-11 14v-15a11 11 0 0 1 22 0v15l-4-4l-4 4l-3-4l-3 4l-4-4zM-5-3v2M4-3v2', // ghost
    'M0 0a4 4 0 1 0 0.1 0M0-4q-8-10 0-12q8 2 0 12M4 0q10-6 11 2q-4 6-11-2M0 4q8 10 0 12q-8-2 0-12M-4 0q-10 6-11-2q4-6 11 2', // flower
    'M-14 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M-2 0h16v5M9 0v4', // key
    'M-16 0q16-14 32 0q-16 14-32 0zM-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0', // eye
    'M-12 12l18-18l6 6l-18 18h-6zM6-6l4-4l6 6l-4 4', // pencil
    'M-10-14h20l-4 28h-12zM-12-14h24', // glass
    'M-14 10h28M-10 10v-12h20v12M-6-2v-6h12v6', // cake
    'M0-14v28M-9-9l18 18M9-9l-18 18', // asterisk
  ];
  const tile = () => { let p = ''; const N = 46, S = 520; for (let i = 0; i < N; i++) { const x = (i % 7) * 74 + R() * 30 + 10, y = Math.floor(i / 7) * 80 + R() * 30 + 12; p += `<path transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(R() * 60 - 30).toFixed(0)}) scale(${(0.8 + R() * 0.5).toFixed(2)})" d="${ICON[i % ICON.length]}"/>`; }
    return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><g fill="none" stroke="#123f8f" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" opacity=".85">${p}</g></svg>`)}")`; };
  // ---------- pixel avatar sprites ----------
  const COLORS = ['#f22e2e', '#ff7a00', '#ffe300', '#00cc1b', '#00b7ff', '#2a40ff', '#a700ff', '#ff58c7', '#a1653d', '#000000', '#c1c1c1', '#4c4c4c', '#00d68f', '#ffa3a3', '#7d2c00', '#13004a', '#b8fff2', '#ffd8a8'];
  const EYES = [
    ['..kkk....kkk..', '.kwwwk..kwwwk.', '.kwkkk..kwkkk.', '.kwkkk..kwkkk.', '.kwwwk..kwwwk.', '..kkk....kkk..'],
    ['....kkkkkk....', '...kwwwwwwk...', '...kwwkkwwk...', '...kwwkkwwk...', '...kwwwwwwk...', '....kkkkkk....'],
    ['.kk........kk.', '..kkk....kkk..', '..kwwk..kwwk..', '..kwkk..kkwk..', '..kkk....kkk..', '..............'],
    ['..............', '..............', '.kkkk....kkkk.', '..kk......kk..', '..............', '..............'],
    ['kkkkkkkkkkkkkk', 'kkkkkkkkkkkkkk', '.kkkkk..kkkkk.', '.kkwkk..kkwkk.', '..kkk....kkk..', '..............'],
    ['..............', '..kk......kk..', '..kk......kk..', '..............', '..............', '..............'],
    ['.kk.kk..kk.kk.', 'krrkrrkkrrkrrk', 'krrrrrkkrrrrrk', '.krrrk..krrrk.', '..krk....krk..', '...k......k...'],
    ['.k...k..k...k.', '..k.k....k.k..', '...k......k...', '..k.k....k.k..', '.k...k..k...k.', '..............'],
    ['..kkk.........', '.kwwwk..kkkk..', '.kwkkk.....k..', '.kwkkk..kkkk..', '.kwwwk........', '..kkk.........'],
    ['.kkkk...kkk...', 'kwwwwk.kwwwk..', 'kwwkkk.kwkkk..', 'kwwkkk.kwwwk..', 'kwwwwk..kkk...', '.kkkk.........'],
    ['.kkkkkkkkkkkk.', 'kwwwwwkkwwwwwk', 'kwkkwwkkwkkwwk', 'kwkkwwkkwkkwwk', 'kwwwwwkkwwwwwk', '.kkkk....kkkk.'],
    ['...k......k...', '..kwk....kwk..', '.kwwwk..kwwwk.', '..kwk....kwk..', '...k......k...', '..............'],
  ];
  const MOUTH = [
    ['k..........k', '.k........k.', '..kkkkkkkk..', '............', '............'],
    ['kkkkkkkkkkkk', 'kwwwwwwwwwwk', '.kwkwkwkwwk.', '..kkkkkkkk..', '............'],
    ['............', '.kkkkkkkkkk.', '............', '............', '............'],
    ['....kkkk....', '...krrrrk...', '...krrrrk...', '....kkkk....', '............'],
    ['............', '..kkkkkkkk..', '.k........k.', 'k..........k', '............'],
    ['kkkkkkkkkkkk', '.k..krrk..k.', '..kkkrrkkk..', '.....kk.....', '............'],
    ['kkkkkkkkkkkk', '.wk.....kw..', '.k.......k..', '............', '............'],
    ['..kkkkkkkk..', '.kkkkkkkkkk.', 'kk...kk...kk', '............', '............'],
    ['.........kk.', '........k...', '..kkkkkk....', '............', '............'],
    ['...kkkkkk...', '..kwwwwwwk..', '..krrrrrrk..', '...kkkkkk...', '............'],
  ];
  const PX = { k: '#000', w: '#fff', r: '#e2264d' };
  const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f))); return `rgb(${c.join(',')})`; };
  const draw = (cv, a, crown = false) => { const g = cv.getContext('2d'), N = 24; g.clearRect(0, 0, N, N); const col = COLORS[a.c];
    const inS = (x, y) => { if (y > 22) return false; const dx = x + 0.5 - 12, dy = y + 0.5 - 11.2; if (y >= 18) return Math.abs(dx) <= 9.5 - (y - 18) * 0.2; return dx * dx / 90 + dy * dy / 92 <= 1; };
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!inS(x, y)) continue; const edge = !inS(x - 1, y) || !inS(x + 1, y) || !inS(x, y - 1) || !inS(x, y + 1); g.fillStyle = edge ? '#000' : (x + y < 13 ? shade(col, 0.28) : x - y > 6 || y > 18 ? shade(col, -0.22) : col); g.fillRect(x, y, 1, 1); }
    const put = (art, ox, oy) => art.forEach((row, j) => [...row].forEach((ch, i) => { if (PX[ch]) { g.fillStyle = PX[ch]; g.fillRect(ox + i, oy + j, 1, 1); } }));
    put(EYES[a.e], 5, 6); put(MOUTH[a.m], 6, 13);
    if (crown) { g.fillStyle = '#000'; [[6, 0], [9, 1], [12, 0], [15, 1], [18, 0]].forEach(([x, y]) => g.fillRect(x - 1, y, 3, 1)); g.fillStyle = '#ffd400'; for (let x = 6; x <= 18; x++) g.fillRect(x, 2, 1, 2); g.fillStyle = '#ff7a00'; [7, 12, 17].forEach((x) => g.fillRect(x, 1, 1, 1)); }
  };
  const avCanvas = (cls = '') => h('canvas.sk-av' + cls, { width: 24, height: 24 });
  // ---------- styles ----------
  css(`.sk{position:absolute;inset:0;overflow:auto;background:#124da5 ${tile()} 0 0/520px 520px;color:#fff;font-family:${NU};scroll-behavior:smooth}
.sk *{box-sizing:border-box}
.sk-av{image-rendering:pixelated;image-rendering:crisp-edges;display:block}
.sk-logo{position:relative;width:640px;margin:18px auto 0;height:132px;display:flex;justify-content:center;cursor:pointer}
.sk-logo svg{overflow:visible}
.sk-logo text{font:400 122px ${GH};paint-order:stroke;stroke:#000;stroke-width:12px;stroke-linejoin:round}
.sk-row{display:flex;justify-content:center;gap:4px;margin:2px auto 0;height:52px}
.sk-row .sk-av{width:48px;height:48px;cursor:pointer;transition:transform .15s}
.sk-row .sk-av:hover{transform:translateY(-4px) rotate(-6deg)}
.sk-row .sk-av.wig{animation:skWig .7s steps(4) infinite}
@keyframes skWig{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
.sk-mid{position:relative;display:flex;justify-content:center;gap:12px;margin:32px auto 0;width:calc(400px + 12px + 326px);transform:translateX(169px)}
.sk-panel{width:400px;padding:14px;background:#0c2c96bf;border-radius:3px;position:relative}
.sk-nl{display:flex;gap:4px}
.sk-nl input,.sk-nl select{height:34px;border:2px solid transparent;border-radius:3px;font:500 15px ${NU};color:#000;background:#fff;outline:none}
.sk-nl input{flex:1;padding:0 8px;min-width:0}.sk-nl input:focus{border-color:#53e237}
.sk-nl select{width:122px;padding:0 4px}
.sk-ed{position:relative;height:130px;display:flex;justify-content:center;align-items:center;gap:6px;margin:6px 0 4px}
.sk-ed .sk-av{width:120px;height:120px}
.sk-ed .bump{animation:skBump .22s ease-out}
@keyframes skBump{40%{transform:scale(1.08,.94) translateY(3px)}}
.sk-arr{display:flex;flex-direction:column;gap:3px}
.sk-arr button{width:30px;height:32px;border:0;padding:0;background:none;cursor:pointer;display:grid;place-items:center}
.sk-arr button:hover svg{transform:scale(1.15)}.sk-arr button:active svg{transform:scale(.9)}
.sk-arr svg{width:26px;height:26px;image-rendering:pixelated;transition:transform .08s}
.sk-dice{position:absolute;right:2px;top:2px;width:28px;height:28px;border:0;background:none;cursor:pointer;padding:0}
.sk-dice:hover{transform:rotate(20deg) scale(1.1)}.sk-dice.roll{animation:skRoll .45s ease-out}
@keyframes skRoll{to{transform:rotate(360deg)}}
.sk .sk-play,.sk .sk-priv{display:block;width:100%;border:0;border-radius:3px;color:#fff;cursor:pointer;font-family:${NU};text-shadow:2px 2px 0 #0000002b;transition:filter .1s}
.sk .sk-play{height:54px;background:#53e237;font-size:32px;font-weight:800;margin-top:6px}
.sk-play:hover{background:#38c41c}.sk-priv:hover{background:#1671c5}
.sk-play:active,.sk-priv:active{transform:translateY(2px);filter:brightness(.92)}
.sk .sk-priv{height:40px;background:#2c8de7;font-size:19px;font-weight:700;margin-top:8px}
.sk-disc{width:326px;align-self:flex-start;background:#fff;color:#333;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px #0003;font:400 17px ${NU}}
.sk-disc .hd{background:#e9eefb;color:#222;font-weight:700;padding:16px 22px;border-bottom:1px solid #ddd;font-size:17px}
.sk-disc .it{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid #eee;cursor:pointer}.sk-disc .it:hover{background:#f6f8ff}
.sk-disc .it:last-child{border:0}.sk-disc .it span:last-child{color:#999;font-size:22px;line-height:0}
.sk-band{position:relative;margin-top:44px;padding:40px 0 60px;background:#0d3093;clip-path:polygon(0 18px,100% 0,100% 100%,0 100%)}
.sk-cols{display:flex;justify-content:center;gap:20px}
.sk-col{width:316px;min-height:360px;background:#0b2c86;border-radius:3px;padding:16px 16px 20px;font-size:15px;line-height:1.5}
.sk-col h3{display:flex;align-items:center;gap:12px;justify-content:center;margin:2px 0 20px;font:700 26px ${NU}}
.sk-col h3 svg{width:34px;height:34px;flex:none;margin-left:-40px}
.sk-col .nh{display:flex;justify-content:space-between;font-weight:700;font-size:17px;border-bottom:1px solid #ffffff66;padding-bottom:2px;margin-bottom:10px}.sk-col .nh small{font-size:12px}
.sk-col ul{margin:4px 0 0;padding-left:22px}.sk-col ul ul{font-size:12.5px}
.sk-how canvas{display:block;margin:10px auto 0;cursor:crosshair}
.sk-how .dots{display:flex;justify-content:center;gap:8px;margin-top:8px}.sk-how .dots i{width:10px;height:10px;border-radius:50%;background:#ffffff55;cursor:pointer}.sk-how .dots i.on{background:#fff}
.sk-how p{text-align:center;margin:6px 0 0}
.sk-foot{text-align:center;padding:30px 0 10px;font-size:13px;opacity:.7}
/* game */
.sk-game{display:none;width:1160px;margin:18px auto 0;grid-template-columns:200px 1fr 260px;grid-template-rows:48px 560px 56px;gap:6px}
.sk.ingame .sk-game{display:grid}.sk.ingame .sk-home{display:none}
.sk-ghd{grid-column:1/-1;background:#fff;color:#000;border-radius:3px;display:flex;align-items:center;padding:0 12px;position:relative;font-weight:800}
.sk-clock{width:46px;height:46px;border-radius:50%;background:#fff;border:3px solid #000;display:grid;place-items:center;font-size:16px;margin-top:-4px}
.sk-round{margin-left:14px;font-size:18px}.sk-word{position:absolute;left:50%;transform:translateX(-50%);text-align:center;line-height:1.1}
.sk-word small{display:block;font-size:12px;font-weight:700;letter-spacing:.04em}.sk-word b{font:800 26px ${NU};letter-spacing:.3em}
.sk-players{background:#fff;border-radius:3px;overflow:hidden;color:#000}
.sk-pl{display:flex;align-items:center;height:58px;padding:0 6px;gap:6px;font-size:14px}.sk-pl:nth-child(even){background:#ececec}
.sk-pl .rk{font-weight:800;width:26px}.sk-pl .nm{flex:1;text-align:center;line-height:1.15}.sk-pl .nm b{display:block}.sk-pl .nm.me b{color:#2c8de7}
.sk-pl .sk-av{width:48px;height:48px}.sk-pl.got{background:#5bdc3c!important}
.sk-cvw{background:#fff;border-radius:3px;position:relative;overflow:hidden}
.sk-cvw canvas{display:block;width:100%;height:100%;cursor:crosshair;touch-action:none}
.sk-chat{background:#fff;border-radius:3px;color:#000;display:flex;flex-direction:column;overflow:hidden}
.sk-msgs{flex:1;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;font-size:14px}
.sk-msgs div{padding:3px 8px}.sk-msgs div:nth-child(even){background:#ececec}.sk-msgs .ok{color:#56ce27;font-weight:800}.sk-msgs .sys{color:#3975ce;font-weight:800}
.sk-chat input{margin:6px;height:34px;border:2px solid #ccc;border-radius:3px;padding:0 8px;font:500 14px ${NU};outline:none}
.sk-tools{grid-column:2;display:flex;align-items:center;gap:8px}
.sk-cur{width:48px;height:48px;border-radius:3px;border:2px solid #fff}
.sk-pal{display:grid;grid-template-columns:repeat(13,24px);grid-template-rows:24px 24px;border-radius:3px;overflow:hidden}
.sk-pal i{cursor:pointer}.sk-pal i:hover{outline:2px solid #fff;outline-offset:-2px}
.sk .sk-tb{width:48px;height:48px;border-radius:3px;background:#fff;border:0;cursor:pointer;display:grid;place-items:center;color:#000;font:800 13px ${NU}}
.sk-tb.on{background:#a2c8ff}.sk-tb i{display:block;border-radius:50%;background:#000}
.sk .sk-back{grid-column:3;justify-self:end;align-self:center;background:#2c8de7;color:#fff;border:0;border-radius:3px;height:40px;padding:0 16px;font:700 15px ${NU};cursor:pointer}
/* private */
.sk-prv{display:none}.sk.private .sk-prv{display:block}.sk.private .sk-lob{display:none}
.sk-prv .row{display:flex;align-items:center;justify-content:space-between;margin:6px 0;font-weight:700;font-size:15px}
.sk-prv select{width:160px;height:30px;border-radius:3px;border:0;font:500 14px ${NU}}
.sk-prv .btns{display:flex;gap:6px;margin-top:10px}
.sk .sk-prv .btns button{flex:1;height:46px;border:0;border-radius:3px;color:#fff;font:800 20px ${NU};cursor:pointer}
@media (prefers-reduced-motion: reduce){.sk *{animation:none!important;transition:none!important}.sk{scroll-behavior:auto}}
`);
  const el = h('div.sk'); root.append(el);
  // ---------- logo ----------
  const LC = ['#ff2a2a', '#ff8c00', '#ffe600', '#15d900', '#00e2a0', '#00c3ff', '#2f6bff', '#b33bff', '#ff4fd2', '#ff2a2a'];
  const svg = s('svg', { width: 600, height: 132, viewBox: '0 0 600 132' }); const letters = [];
  [...'skribbl.io'].forEach((ch, i) => { const t = s('text', { x: 14 + [0, 48, 96, 134, 160, 210, 262, 292, 318, 346][i], y: 104, fill: LC[i] }, ch); letters.push(t); svg.append(t); });
  svg.append(s('g', { transform: 'translate(420 8) rotate(28)', stroke: '#000', 'stroke-width': 5, 'stroke-linejoin': 'round' }, s('path', { d: 'M0 0h22v66h-22z', fill: '#ff3b3b' }), s('path', { d: 'M0 0h22v12h-22z', fill: '#ff9ccf' }), s('path', { d: 'M0 66h22l-11 22z', fill: '#ffd9a0' }), s('path', { d: 'M7 80l4 8l4-8z', fill: '#000' })));
  const pencil = svg.lastChild;
  const layout = () => { let x = 8; letters.forEach((t) => { t.setAttribute('x', x); let w = 0; try { w = t.getComputedTextLength(); } catch {} x += (w || 44) - 3; }); pencil.setAttribute('transform', `translate(${x + 26} 4) rotate(28)`); const W = x + 80; svg.setAttribute('viewBox', `0 0 ${W} 132`); svg.setAttribute('width', W); };
  (document.fonts?.load ? document.fonts.load(`122px "Gochi Hand"`) : Promise.resolve()).then(() => requestAnimationFrame(layout)).catch(() => {}); setTimeout(layout, 600);
  const logo = h('div.sk-logo', { title: 'skribbl.io', onclick: () => leaveGame() }, svg);
  let boil = 0; const boilT = setInterval(() => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; boil++; letters.forEach((t, i) => t.setAttribute('transform', `rotate(${(((i * 7 + boil * 3) % 5) - 2) * 1.2} ${+t.getAttribute('x') + 20} 70)`)); }, 180);
  // ---------- avatar row ----------
  const ROW = [{ c: 0, e: 0, m: 0 }, { c: 1, e: 2, m: 7 }, { c: 2, e: 1, m: 1 }, { c: 3, e: 8, m: 3 }, { c: 4, e: 5, m: 2 }, { c: 5, e: 4, m: 8 }, { c: 6, e: 3, m: 5 }, { c: 7, e: 10, m: 9 }];
  const row = h('div.sk-row'); const rowCv = ROW.map((a, i) => { const c = avCanvas(); draw(c, a, i === 0); c.title = 'use this avatar'; c.onclick = () => { me = { ...a }; renderMe(true); }; row.append(c); return c; });
  // ---------- lobby panel ----------
  const DEF = { c: 3, e: 1, m: 0 };
  let me = { ...DEF };
  const pixArrow = (dir) => `<svg viewBox="0 0 13 13" shape-rendering="crispEdges"><path fill="#000" d="${dir < 0 ? 'M6 0h4v3h-1v1h-1v1h-1v1h-1v1h1v1h1v1h1v1h1v3h-4v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-3h1v-1h1v-1h1v-1h1v-1h1z' : 'M3 0h4v1h1v1h1v1h1v1h1v1h1v3h-1v1h-1v1h-1v1h-1v1h-1v1h-4v-3h1v-1h1v-1h1v-1h1v-1h-1v-1h-1v-1h-1v-1h-1z'}"/><path fill="#fff" d="${dir < 0 ? 'M7 1h2v1h-1v1h-1v1h-1v1h-1v1h-1v1h1v1h1v1h1v1h1v1h1v1h-2v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h1v-1h1v-1h1v-1h1v-1h1z' : 'M4 1h2v1h1v1h1v1h1v1h1v1h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v-1h-1v-1h-1v-1h-1z'}"/></svg>`;
  const FEAT = [['e', EYES.length, 'eyes'], ['m', MOUTH.length, 'mouth'], ['c', COLORS.length, 'color']];
  const meCv = avCanvas();
  const cyc = (k, n, d) => { me[k] = (me[k] + d + n) % n; renderMe(true); blipS(d > 0 ? 660 : 520); };
  const arrows = (d) => h('div.sk-arr', {}, FEAT.map(([k, n, lab]) => h('button', { 'aria-label': `${d < 0 ? 'previous' : 'next'} ${lab}`, 'data-k': k, 'data-d': d, html: pixArrow(d), onclick: () => cyc(k, n, d) })));
  const dice = h('button.sk-dice', { title: 'Randomize your Avatar!', 'aria-label': 'randomize avatar', html: '<svg viewBox="0 0 28 28" shape-rendering="crispEdges"><path d="M14 2l11 5v13l-11 6l-11-6v-13z" fill="#1d3f9e" stroke="#000" stroke-width="2"/><path d="M3 7l11 6l11-6M14 13v13" stroke="#000" stroke-width="2" fill="none"/><path d="M5 9l8 4v11l-8-4z" fill="#d6e2ff"/><path d="M15 13l8-4v11l-8 4z" fill="#a9bdf5"/><path d="M14 4l9 4l-9 4l-9-4z" fill="#ffffff"/><g fill="#000"><rect x="13" y="7" width="2" height="2"/><rect x="7" y="13" width="2" height="2"/><rect x="10" y="18" width="2" height="2"/><rect x="17" y="12" width="2" height="2"/><rect x="20" y="17" width="2" height="2"/><rect x="18.5" y="14.5" width="2" height="2"/></g></svg>' });
  const rnd = Math.random;
  dice.onclick = () => { me = { c: Math.floor(rnd() * COLORS.length), e: Math.floor(rnd() * EYES.length), m: Math.floor(rnd() * MOUTH.length) }; dice.classList.remove('roll'); void dice.offsetWidth; dice.classList.add('roll'); renderMe(true); blipS(880); };
  const nameIn = h('input', { type: 'text', placeholder: 'Enter your name', maxlength: 21, spellcheck: false });
  const LANGS = ['English', 'German', 'Bulgarian', 'Czech', 'Danish', 'Dutch', 'Finnish', 'French', 'Estonian', 'Greek', 'Hebrew', 'Hungarian', 'Italian', 'Japanese', 'Korean', 'Latvian', 'Macedonian', 'Norwegian', 'Portuguese', 'Polish', 'Romanian', 'Russian', 'Serbian', 'Slovakian', 'Spanish', 'Swedish', 'Tagalog', 'Turkish'];
  const lang = h('select', { 'aria-label': 'language' }, LANGS.map((l) => h('option', { value: l }, l)));
  const play = h('button.sk-play', { onclick: () => startGame(false) }, 'Play!');
  const priv = h('button.sk-priv', { onclick: () => setPrivate(true) }, 'Create Private Room');
  const lob = h('div.sk-lob', {}, h('div.sk-nl', {}, nameIn, lang), h('div.sk-ed', {}, arrows(-1), meCv, arrows(1), dice), play, priv);
  const sel2 = (lab, opts, v) => h('div.row', {}, h('span', {}, lab), h('select', {}, opts.map((o) => h('option', { selected: String(o) === String(v) }, o))));
  const prv = h('div.sk-prv', {}, h('div', { style: { fontWeight: 800, fontSize: '20px', textAlign: 'center', margin: '0 0 8px' } }, 'Private Room'),
    sel2('👥 Players', [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20], 8), sel2('🌐 Language', LANGS, 'English'), sel2('⏰ Drawtime', [15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 180, 210, 240], 80), sel2('🔁 Rounds', [2, 3, 4, 5, 6, 7, 8, 9, 10], 3), sel2('🎮 Game mode', ['Normal', 'Hidden', 'Combination'], 'Normal'), sel2('🔤 Word count', [1, 2, 3, 4, 5], 3), sel2('💡 Hints', [0, 1, 2, 3, 4, 5], 2),
    h('div.btns', {}, h('button', { style: { background: '#53e237' }, onclick: () => startGame(true) }, 'Start!'), h('button', { style: { background: '#2c8de7' }, onclick: () => copy('https://skribbl.io/?x7Kq2bLm', 'Invite link copied') }, '🔗 Invite')),
    h('button.sk-priv', { style: { background: 'transparent', boxShadow: 'inset 0 0 0 2px #ffffff55', fontSize: '15px', height: '32px' }, onclick: () => setPrivate(false) }, '← back'));
  const panelEl = h('div.sk-panel', {}, lob, prv);
  const disc = h('div.sk-disc', {}, h('div.hd', {}, 'Discover more'), ['Online Game Subscription', 'Drawing Tablet', 'Custom Avatars'].map((t) => h('div.it', { onclick: () => toast(t) }, h('span', {}, t), h('span', {}, '›'))));
  const renderMe = (bump) => { draw(meCv, me); if (bump) { meCv.classList.remove('bump'); void meCv.offsetWidth; meCv.classList.add('bump'); } };
  const setPrivate = (on) => el.classList.toggle('private', on);
  // ---------- below the fold ----------
  const ico = (d, c) => `<svg viewBox="0 0 34 34"><path d="${d}" fill="${c}" stroke="#000" stroke-width="2.4" stroke-linejoin="round"/></svg>`;
  const howCv = h('canvas', { width: 280, height: 220 });
  const HOW = ['When it\'s your turn, choose a word you want to draw!', 'Try to draw your choosen word! No spelling!', 'Let other players try to guess your drawn word!', 'When it\'s not your turn, try to guess what other players are drawing!', 'Score the most points and be crowned the winner at the end!'];
  let howI = 0; const howP = h('p', {}, HOW[0]); const howDots = h('div.dots', {}, HOW.map((_, i) => h('i' + (i ? '' : '.on'), { onclick: () => setHow(i) })));
  const drawHouse = (k) => { const g = howCv.getContext('2d'); g.clearRect(0, 0, 280, 220); g.strokeStyle = '#fff'; g.lineWidth = 3; g.lineCap = g.lineJoin = 'round'; const P = [[30, 200, 30, 110], [30, 110, 130, 30], [130, 30, 240, 110], [240, 110, 240, 200], [30, 200, 240, 200], [60, 125, 105, 125], [60, 125, 60, 165], [105, 125, 105, 165], [60, 165, 105, 165], [82, 125, 82, 165], [60, 145, 105, 145], [150, 200, 150, 120], [150, 120, 200, 120], [200, 120, 200, 200]]; const n = Math.ceil(P.length * k);
    P.slice(0, n).forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a + Math.sin(a) * 1.5, b); g.lineTo(c, d + Math.cos(c) * 1.5); g.stroke(); }); g.beginPath(); g.arc(186, 162, 3, 0, 7); g.stroke();
    g.save(); g.translate(205, 52); g.rotate(0.6); g.strokeRect(0, -10, 50, 20); g.beginPath(); g.moveTo(0, -10); g.lineTo(-18, 0); g.lineTo(0, 10); g.stroke(); g.restore(); };
  const setHow = (i) => { howI = i; howP.textContent = HOW[i]; [...howDots.children].forEach((d, j) => d.classList.toggle('on', j === i)); drawHouse((i + 1) / HOW.length); };
  let howT = setInterval(() => setHow((howI + 1) % HOW.length), 3200);
  const band = h('div.sk-band', {}, h('div.sk-cols', {},
    h('div.sk-col', {}, h('h3', { html: ico('M10 12q0-8 8-8q8 0 8 7q0 5-6 7v4h-5v-6q6-1 6-5q0-3-3-3q-3 0-3 4zM15 26h5v5h-5z', '#fff') + 'About' }), h('p', { style: { margin: 0 } }, h('b', {}, 'skribbl.io'), ' is a free online multiplayer drawing and guessing pictionary game.'), h('p', {}, 'A normal game consists of a few rounds, where every round a player has to draw their chosen word and others have to guess it to gain points!'), h('p', {}, 'The person with the most points at the end of the game, will then be crowned as the winner!'), h('p', {}, 'Have fun!')),
    h('div.sk-col', {}, h('h3', { html: ico('M6 4l18-2l4 26l-18 3zM10 10l12-1M11 15l12-1M11 20l12-1', '#5bdc3c') + 'News' }), h('div.nh', {}, h('span', {}, 'Fresh paint'), h('small', {}, '9th November 2022')), h('div', {}, 'Hello!'), h('ul', {}, h('li', {}, 'Redesign of the page'), h('li', {}, 'Mobile support'), h('li', {}, 'Reworked toolbar', h('ul', {}, ['Undo button', 'More colors', 'Left- and rightclick to select colors and draw', 'Experimental support for pressure touch input', 'Configurable hotkeys'].map((t) => h('li', {}, t)))), h('li', {}, 'Custom words and Hidden mode'))),
    h('div.sk-col.sk-how', {}, h('h3', { html: ico('M8 30l3-9l15-17l6 5l-15 17zM8 30l9-3', '#ff9a3c') + 'How to play' }), howCv, howP, howDots)),
    h('div.sk-foot', {}, 'Contact: contact@skribbl.io · Terms of Service · Credits'));
  const home = h('div.sk-home', {}, row, h('div.sk-mid', {}, panelEl, disc), band);
  // ---------- game screen ----------
  const WORDS = ['apple', 'rocket', 'castle', 'penguin', 'guitar', 'banana'];
  const BOTS = [{ n: 'Doodlebob', a: { c: 5, e: 4, m: 8 } }, { n: 'PicassoPete', a: { c: 7, e: 10, m: 9 } }, { n: 'mona', a: { c: 1, e: 2, m: 7 } }, { n: 'xX_draw_Xx', a: { c: 6, e: 3, m: 5 } }];
  const clockE = h('div.sk-clock', {}, '80'), roundE = h('div.sk-round', {}, 'Round 1 of 3'), wordE = h('div.sk-word', {}, h('small', {}, 'GUESS THIS'), h('b', {}, ''));
  const plE = h('div.sk-players'), cv = h('canvas', { width: 692, height: 560 }), cvw = h('div.sk-cvw', {}, cv), msgs = h('div.sk-msgs'), chatIn = h('input', { placeholder: 'Type your guess here...', maxlength: 100 });
  const PAL = ['#ffffff', '#c1c1c1', '#ef130b', '#ff7100', '#ffe400', '#00cc00', '#00ff91', '#00b2ff', '#231fd3', '#a300ba', '#df69a7', '#ffac8e', '#a0522d', '#000000', '#505050', '#740b07', '#c23800', '#e8a200', '#004619', '#00785d', '#00569e', '#0e0865', '#550069', '#873554', '#cc774d', '#63300d'];
  let pen = { c: '#000000', w: 6, fill: false };
  const cur = h('div.sk-cur', { style: { background: pen.c } });
  const pal = h('div.sk-pal', {}, PAL.map((c) => h('i', { style: { background: c }, title: c, onclick: () => { pen.c = c; cur.style.background = c; } })));
  const sizes = [4, 10, 20, 32].map((w, i) => { const b = h('button.sk-tb' + (i === 0 ? '.on' : ''), { title: `brush ${w}`, onclick: () => { pen.w = w; pen.fill = false; tools.querySelectorAll('.sk-tb').forEach((x) => x.classList.toggle('on', x === b)); } }, h('i', { style: { width: Math.max(4, w * 0.8) + 'px', height: Math.max(4, w * 0.8) + 'px' } })); return b; });
  const fillB = h('button.sk-tb', { title: 'fill', onclick: () => { pen.fill = true; tools.querySelectorAll('.sk-tb').forEach((x) => x.classList.toggle('on', x === fillB)); } }, '🪣');
  const strokes = []; const g = cv.getContext('2d');
  const redraw = () => { g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); for (const st of strokes) { if (st.fill) { g.fillStyle = st.c; g.fillRect(0, 0, cv.width, cv.height); continue; } g.strokeStyle = st.c; g.lineWidth = st.w; g.lineCap = g.lineJoin = 'round'; g.beginPath(); st.p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (st.p.length === 1) g.lineTo(st.p[0][0] + 0.1, st.p[0][1]); g.stroke(); } };
  const undoB = h('button.sk-tb', { title: 'undo', onclick: () => { strokes.pop(); redraw(); } }, '↶'), clrB = h('button.sk-tb', { title: 'clear', onclick: () => { strokes.length = 0; redraw(); } }, '🗑');
  const tools = h('div.sk-tools', {}, cur, pal, ...sizes, fillB, undoB, clrB);
  const cpos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
  let curSt = null;
  cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); if (pen.fill) { strokes.push({ fill: true, c: pen.c }); redraw(); return; } curSt = { c: e.button === 2 ? '#ffffff' : pen.c, w: pen.w, p: [cpos(e)] }; strokes.push(curSt); redraw(); });
  cv.addEventListener('pointermove', (e) => { if (!curSt) return; curSt.p.push(cpos(e)); redraw(); });
  const up = () => { curSt = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up); cv.addEventListener('contextmenu', (e) => e.preventDefault());
  const say = (t, cls = '') => { msgs.append(h('div' + (cls ? '.' + cls : ''), {}, t)); while (msgs.children.length > 22) msgs.firstChild.remove(); };
  let G = null, gT = 0;
  const renderPlayers = () => { plE.innerHTML = ''; const ps = [{ n: nameIn.value.trim() || 'You', a: me, me: true, pts: G.pts[0], got: G.got[0] }, ...BOTS.map((b, i) => ({ ...b, pts: G.pts[i + 1], got: G.got[i + 1] }))].map((p, i) => ({ ...p, i }));
    [...ps].sort((a, b) => b.pts - a.pts).forEach((p, r) => { const c = avCanvas(); draw(c, p.a, r === 0 && p.pts > 0); plE.append(h('div.sk-pl' + (p.got ? '.got' : ''), {}, h('span.rk', {}, '#' + (r + 1)), h('div.nm' + (p.me ? '.me' : ''), {}, h('b', {}, p.n + (p.me ? ' (You)' : '')), h('span', {}, `${p.pts} points`)), c)); }); };
  const hint = () => G.word.split('').map((ch, i) => (G.reveal.includes(i) ? ch : '_')).join('');
  const startGame = (isPriv) => { setPrivate(false); el.classList.add('ingame'); el.scrollTop = 0; strokes.length = 0; redraw(); msgs.innerHTML = '';
    G = { word: WORDS[Math.floor(Math.random() * WORDS.length)], t: 80, pts: [0, 0, 0, 0, 0], got: [false, false, false, false, false], reveal: [], priv: isPriv };
    wordE.lastChild.textContent = hint(); wordE.firstChild.textContent = 'GUESS THIS'; clockE.textContent = '80'; roundE.textContent = 'Round 1 of 3';
    say(`${nameIn.value.trim() || 'You'} joined the room!`, 'sys'); say('Doodlebob is drawing now!', 'sys'); renderPlayers(); botDraw(); clearInterval(gT); gT = setInterval(tick, 1000); };
  const botDraw = () => { // bot sketches a simple shape for the word
    const cx = 346, cy = 270; const ring = []; for (let a = 0; a <= 6.3; a += 0.25) ring.push([cx + Math.cos(a) * 120 + Math.sin(a * 5) * 4, cy + Math.sin(a) * 110]); strokes.push({ c: '#ef130b', w: 10, p: ring }); strokes.push({ c: '#a0522d', w: 10, p: [[cx, cy - 110], [cx + 8, cy - 160]] }); strokes.push({ c: '#00cc00', w: 10, p: [[cx + 8, cy - 140], [cx + 60, cy - 170], [cx + 20, cy - 130]] }); redraw(); };
  const tick = () => { if (!G) return; G.t--; clockE.textContent = String(Math.max(0, G.t));
    if (G.t === 60 || G.t === 40) { const left = [...G.word].map((_, i) => i).filter((i) => !G.reveal.includes(i)); G.reveal.push(left[Math.floor(Math.random() * left.length)]); wordE.lastChild.textContent = hint(); }
    if (G.t % 9 === 0) { const i = 1 + Math.floor(Math.random() * 4); if (!G.got[i]) { if (Math.random() < 0.5) { G.got[i] = true; G.pts[i] += 10 * G.t; say(`${BOTS[i - 1].n} guessed the word!`, 'ok'); renderPlayers(); } else say(`${BOTS[i - 1].n}: ${pick(['tomato?', 'ball', 'cherry', 'is it a planet', 'lol'])}`); } }
    if (G.t <= 0) { clearInterval(gT); say(`The word was '${G.word}'`, 'sys'); } };
  const guess = (txt) => { if (!G || !txt) return false; const me0 = nameIn.value.trim() || 'You'; if (G.got[0]) { say(`${me0}: ${txt}`); return false; }
    if (txt.toLowerCase() === G.word) { G.got[0] = true; G.pts[0] += 10 * G.t + 50; say(`${me0} guessed the word!`, 'ok'); wordE.lastChild.textContent = G.word; wordE.firstChild.textContent = 'YOU GUESSED IT'; renderPlayers(); blipS(990); return true; }
    if ([...G.word].filter((c, i) => txt[i] === c).length >= G.word.length - 1) say(`'${txt}' is close!`, 'sys'); else say(`${me0}: ${txt}`); return false; };
  chatIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') { guess(chatIn.value.trim()); chatIn.value = ''; } });
  const leaveGame = () => { clearInterval(gT); G = null; el.classList.remove('ingame'); setPrivate(false); };
  const game = h('div.sk-game', {}, h('div.sk-ghd', {}, clockE, roundE, wordE), plE, cvw, h('div.sk-chat', {}, msgs, chatIn), tools, h('button.sk-back', { onclick: leaveGame }, 'Leave room'));
  el.append(logo, home, game);
  // ---------- sound ----------
  const blipS = (f) => { try { blip(f, 0.06, 'square', 0.03); } catch {} };
  const reset = () => { leaveGame(); me = { ...DEF }; renderMe(false); nameIn.value = ''; lang.value = 'English'; setHow(0); el.scrollTop = 0; };
  reset();
  window.__demoProof = async () => { const o = []; reset(); el.style.scrollBehavior = 'auto';
    const bt = (k, d) => lob.querySelector(`.sk-arr button[data-k="${k}"][data-d="${d}"]`);
    const b0 = { ...me }; bt('e', 1).click(); bt('m', 1).click(); bt('c', -1).click(); await sleep(60);
    o.push(`arrows: eyes ${b0.e}→${me.e}, mouth ${b0.m}→${me.m}, color ${b0.c}→${me.c} (bounce=${meCv.classList.contains('bump')})`);
    dice.click(); await sleep(60); o.push(`dice → {color:${me.c}, eyes:${me.e}, mouth:${me.m}} roll=${dice.classList.contains('roll')}`);
    rowCv[2].click(); o.push(`row avatar #3 adopted → color=${me.c}`);
    nameIn.value = 'Junbok'; lang.value = 'Korean'; play.click(); await sleep(80);
    o.push(`Play! → in-game=${el.classList.contains('ingame')}, hint "${wordE.lastChild.textContent}", players=${plE.children.length}`);
    const r = cv.getBoundingClientRect(); const fire2 = (t, x, y) => cv.dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: r.left + x, clientY: r.top + y, pointerId: 1, button: 0 }));
    const n0 = strokes.length; fire2('pointerdown', 120, 420); for (let i = 1; i <= 8; i++) fire2('pointermove', 120 + i * 20, 420 - i * 8); fire2('pointerup', 280, 356);
    o.push(`drew stroke on canvas (strokes ${n0}→${strokes.length}, pts=${strokes.at(-1).p.length})`);
    guess('tomatoes'); const ok = guess(G.word); o.push(`guessed "${G.word}" → correct=${ok}, my points=${G.pts[0]}, header="${wordE.firstChild.textContent}"`);
    leaveGame(); priv.click(); o.push(`Create Private Room → settings panel=${getComputedStyle(prv).display !== 'none'} (${prv.querySelectorAll('select').length} selects)`);
    reset(); el.style.scrollBehavior = ''; o.push(`restored: lobby, default avatar {c:${me.c},e:${me.e},m:${me.m}}, name empty`); return o.join('; '); };
};


V['dialed-color-memory-game-tilted-card-hub-countdown-reveal-hue-slider-recall'] = (root, T) => {
  import('@fontsource-variable/inter-tight');
  theme(root, T, { bg: '#ffffff', fg: '#111111', ac: '#111111', dark: false });
  const F = "'Inter Tight Variable','Inter Variable',system-ui,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  css(`.dg{position:absolute;inset:0;overflow:hidden;background:#fff;color:#111;font-family:${F};transition:background .3s,color .3s}
.dg *{box-sizing:border-box}
.dg.dark{background:#0b0b0b;color:#eee}
.dg-sc{position:absolute;inset:0 0 96px 0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none}
.dg-hd{height:82px;max-width:980px;margin:0 auto;display:flex;align-items:center;gap:20px;font-size:14px}
.dg-logo{display:flex;align-items:center;gap:7px;font-weight:650;font-size:18px;letter-spacing:-.02em;cursor:pointer;margin-right:14px}
.dg-nav{display:flex;gap:19px}
.dg-nav a{position:relative;color:#555;font-weight:500;cursor:pointer;padding:6px 0;letter-spacing:-.005em}
.dg.dark .dg-nav a{color:#999}
.dg-nav a.on{color:#111}.dg.dark .dg-nav a.on{color:#fff}
.dg-nav a.on::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1.5px;background:currentColor}
.dg-nav a i{position:absolute;right:-6px;top:2px;width:4px;height:4px;border-radius:50%}
.dg-hr{margin-left:auto;display:flex;align-items:center;gap:18px;color:#666}
.dg-hr .ic{width:22px;height:22px;display:grid;place-items:center;cursor:pointer;opacity:.75}
.dg-hr .ic:hover{opacity:1}
.dg-hr .ad{font-weight:500;color:#333;cursor:pointer}.dg.dark .dg-hr .ad{color:#ccc}
.dg .dg-sign{height:33px;padding:0 17px;border-radius:99px;border:0;background:#111;color:#fff;font:600 14px ${F};cursor:pointer}
.dg.dark .dg-sign{background:#fff;color:#111}
/* game stage */
.dg-stage{position:relative;max-width:980px;margin:0 auto;height:640px}
.dg-card{position:absolute;left:50%;top:2px;width:476px;height:618px;margin-left:-238px;border-radius:14px;background:#000;color:#fff;overflow:hidden;box-shadow:0 18px 40px -12px #0007,0 2px 6px #0002;transition:background .45s ease}
.dg-card.rv{transition:none}
.dg-pane{position:absolute;inset:0;padding:30px 30px 28px;display:flex;flex-direction:column;opacity:0;pointer-events:none;transition:opacity .25s}
.dg-pane.on{opacity:1;pointer-events:auto}
.dg-ttl{font:500 104px/1 ${F};letter-spacing:-.055em;margin:6px 0 20px}
.dg-p{font:550 23px/1.17 ${F};color:#c4c4c4;letter-spacing:-.012em;margin:0 0 20px;max-width:340px}
.dg-laurel{position:absolute;right:30px;top:42px;opacity:.85}
.dg-q{margin-top:auto;font:500 15px ${F};margin-bottom:14px}
.dg-row{display:flex;align-items:center;gap:20px}
.dg .dg-rb{width:64px;height:64px;border-radius:50%;border:0;background:#fff;color:#111;display:grid;place-items:center;cursor:pointer;position:relative;transition:transform .18s}
.dg .dg-rb:hover{transform:scale(1.06)}.dg .dg-rb:active{transform:scale(.96)}
.dg-rb .beta{position:absolute;top:2px;right:-8px;background:#e6e6e6;color:#444;font:600 9px ${F};padding:2px 5px;border-radius:99px}
.dg-easy{display:flex;align-items:center;gap:7px;font:500 15px ${F};cursor:pointer;margin-left:2px;user-select:none}
.dg-sw{width:46px;height:18px;border-radius:99px;border:1.5px solid #fff;position:relative}
.dg-sw::before{content:'';position:absolute;left:2px;top:2px;width:11px;height:11px;border-radius:50%;background:#fff;transition:left .2s}
.dg-sw::after{content:'· ·';position:absolute;right:7px;top:-3px;font-size:13px;letter-spacing:2px;opacity:.8}
.dg-easy.on .dg-sw::before{left:29px}.dg-easy.on .dg-sw::after{left:7px;right:auto}
.dg .dg-daily{margin-left:auto;width:76px;height:76px;border-radius:50%;border:0;padding:4px;background:conic-gradient(#ff3b3b,#ffb800,#3ddc5a,#22c3ee,#5b5bff,#d63bff,#ff3b3b);cursor:pointer;transition:transform .2s}
.dg .dg-daily:hover{transform:rotate(18deg)}
.dg-daily span{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:#fff;color:#111;border:3px solid #000}
.dg-cnt{font:500 15px ${F};opacity:.75;letter-spacing:.02em}
.dg-word{position:absolute;right:28px;top:22px;font:500 96px/1 ${F};letter-spacing:-.05em;transition:opacity .15s}
.dg-cd{position:absolute;right:26px;top:24px;text-align:right}
.dg-cd b{font:500 96px/1 ${F};letter-spacing:-.04em;font-variant-numeric:tabular-nums}
.dg-cd b em{font-style:normal;opacity:.55}
.dg-cd small{display:block;font:600 15px ${F};margin-top:2px}
.dg-wm{position:absolute;left:30px;bottom:24px;font:600 16px ${F};opacity:.55;letter-spacing:-.02em}
.dg-wm.tr{left:auto;right:28px;top:26px;bottom:auto}
.dg-sls{position:absolute;left:0;top:0;bottom:0;display:flex}
.dg-sl{position:relative;width:46px;height:100%;cursor:ns-resize;touch-action:none}
.dg-sl .th{position:absolute;left:50%;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:#fff;box-shadow:0 1px 6px #0006;pointer-events:none}
.dg .dg-ok{position:absolute;right:24px;bottom:28px;width:72px;height:72px;border-radius:50%;border:0;background:#fff;color:#111;display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 18px #0003;transition:transform .18s}
.dg .dg-ok:hover{transform:scale(1.06)}
.dg-res{position:absolute;inset:0;display:grid;grid-template-rows:1fr 1fr}
.dg-res > div{position:relative;padding:22px 28px}
.dg-res .lb{font:600 14px ${F};opacity:.8}
.dg-res .hx{position:absolute;left:28px;bottom:18px;font:500 13px ${F};opacity:.7;font-variant-numeric:tabular-nums}
.dg-sc0{position:absolute;right:26px;top:50%;transform:translateY(-50%);text-align:right;z-index:2}
.dg-sc0 b{font:500 104px/1 ${F};letter-spacing:-.05em}
.dg-sc0 small{display:block;font:600 14px ${F}}
.dg-tot{padding:30px}
.dg-tot h3{font:500 64px/1 ${F};letter-spacing:-.05em;margin:0 0 4px}
.dg-tot .sub{font:550 18px ${F};color:#bbb;margin-bottom:22px}
.dg-pairs{display:grid;gap:8px}
.dg-pair{display:grid;grid-template-columns:44px 44px 1fr auto;gap:10px;align-items:center;font:500 14px ${F}}
.dg-pair i{height:44px;border-radius:9px;display:block}
.dg-pair b{font-weight:600;font-variant-numeric:tabular-nums}
.dg .dg-pill{height:44px;padding:0 22px;border-radius:99px;border:0;background:#fff;color:#111;font:600 15px ${F};cursor:pointer}
.dg .dg-pill.gh{background:#ffffff1f;color:#fff}
.dg-foot{position:absolute;right:calc(50% - 490px);top:622px;text-align:right;font:500 10.5px/1.6 ${F};color:#777}
.dg-foot a{margin-left:9px;cursor:pointer}.dg-foot div{color:#222}.dg.dark .dg-foot div{color:#ccc}
.dg-adl{position:absolute;left:0;right:0;bottom:96px;height:1px;background:#e5e5e5}
.dg-adh{position:absolute;left:50%;bottom:86px;width:38px;height:20px;margin-left:-19px;border:1px solid #e5e5e5;border-radius:7px;background:#fff;cursor:pointer;display:grid;place-items:center}
.dg-adh::after{content:'';width:12px;height:1.5px;background:#999}
.dg-adz{position:absolute;left:0;right:0;bottom:0;height:96px;background:#fff;display:grid;place-items:center;color:#c8c8c8;font:500 11px ${F};letter-spacing:.12em}
.dg.dark .dg-adz,.dg.dark .dg-adh{background:#0b0b0b}.dg.dark .dg-adl,.dg.dark .dg-adh{border-color:#222}
/* hub */
.dg-hub{max-width:980px;margin:0 auto;padding:2px 0 60px;display:none}
.dg.hubmode .dg-hub{display:block}.dg.hubmode .dg-stage{display:none}
.dg-hub .lead{font:500 15px ${F};color:#666;margin:0 0 14px}
.dg-hero{position:relative;height:380px;border-radius:14px;overflow:hidden;background:linear-gradient(115deg,#2d2d2d,#121212 60%,#0d0d0d);color:#fff;box-shadow:0 22px 50px -18px #0008}
.dg-hero .tx{position:absolute;left:52px;top:100px;width:330px}
.dg-tile{width:54px;height:54px;border-radius:14px;display:grid;place-items:center;flex:none}
.dg-hero h2{display:flex;align-items:center;gap:16px;margin:0 0 22px;font:550 35px ${F};letter-spacing:-.03em}
.dg-hero p{font:500 15px/1.5 ${F};color:#c9c9c9;margin:0 0 22px}
.dg .dg-play{height:42px;padding:0 21px;border-radius:99px;border:0;background:#fff;color:#111;font:600 14px ${F};cursor:pointer;transition:transform .15s}
.dg .dg-play:hover{transform:translateY(-1px)}
.dg-fan{position:absolute;right:40px;top:28px;width:440px;height:400px;perspective:900px}
.dg-fc{position:absolute;width:256px;height:352px;border-radius:18px;overflow:hidden;box-shadow:-18px 20px 40px #0008;transition:transform .5s cubic-bezier(.3,1.3,.5,1)}
.dg-hero:hover .f1{transform:translate(170px,8px) rotate(14deg)}
.dg-hero:hover .f2{transform:translate(92px,-4px) rotate(9deg)}
.dg-hero:hover .f3{transform:translate(-8px,10px) rotate(-3deg)}
.dg-cards3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:32px}
.dg-gc{height:220px;border-radius:12px;background:linear-gradient(160deg,#1f1f1f,#0e0e0e);color:#fff;padding:36px 34px;position:relative;box-shadow:0 18px 40px -20px #0009;transition:transform .25s}
.dg-gc:hover{transform:translateY(-4px)}
.dg-gc h4{display:flex;align-items:center;gap:13px;margin:0 0 18px;font:550 24px ${F};letter-spacing:-.03em}
.dg-gc .dg-tile{width:42px;height:42px;border-radius:11px}
.dg-gc p{font:500 13.5px/1.45 ${F};color:#c4c4c4;margin:0 0 20px;max-width:240px}
.dg-gc .new{font:700 9px ${F};background:#e8e8e8;color:#111;border-radius:4px;padding:2px 5px}
.dg .dg-gc .dg-play{height:34px;font-size:13px;padding:0 18px}
@media (prefers-reduced-motion: reduce){.dg *{transition:none!important;animation:none!important}}
`);
  const el = h('div.dg'), sc = h('div.dg-sc'); root.append(el); el.append(sc);
  const I = { logo: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7.5a4.5 4.5 0 1 0 4.5 4.5"/><path d="M12 12 19 5"/></svg>',
    snd: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 9h3l5-4v14l-5-4H4z"/><path d="M16 9c1.3 1.6 1.3 4.4 0 6M18.6 6.5c2.6 3 2.6 8 0 11"/></svg>',
    sun: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    user: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-4.2 3.8-6.5 7.5-6.5s6.7 2.3 7.5 6.5z"/></svg>',
    users: '<svg width="28" height="28" viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="14" cy="8" r="3.6"/><circle cx="6" cy="9.5" r="2.7"/><circle cx="22" cy="9.5" r="2.7"/><path d="M8 20c.6-3.6 3-5.6 6-5.6s5.4 2 6 5.6zM1.5 19c.4-2.6 2-4 4.3-4.1M26.5 19c-.4-2.6-2-4-4.3-4.1"/></svg>',
    cal: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M8 13.5h1M11.5 13.5h1M15 13.5h1M8 16.5h1M11.5 16.5h1"/></svg>',
    laurel: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"><path d="M7 20c-3-2-4.5-5.5-4-10M17 20c3-2 4.5-5.5 4-10"/><path d="M4.2 15.5c-1.6-.2-2.6-1.3-2.8-2.6 1.4-.1 2.5.6 2.8 2.6zM3.2 11.2C1.8 10.6 1.2 9.3 1.4 8c1.3.4 2.1 1.4 1.8 3.2zM5.8 18.6c-1.4.6-2.8.3-3.7-.6 1.2-.7 2.5-.6 3.7.6zM19.8 15.5c1.6-.2 2.6-1.3 2.8-2.6-1.4-.1-2.5.6-2.8 2.6zM20.8 11.2c1.4-.6 2-1.9 1.8-3.2-1.3.4-2.1 1.4-1.8 3.2zM18.2 18.6c1.4.6 2.8.3 3.7-.6-1.2-.7-2.5-.6-3.7.6z"/><path d="M12 6.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z"/></svg>',
    sliders: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"><path d="M6 4v16M12 4v16M18 4v16"/><circle cx="6" cy="9" r="2.2" fill="#111"/><circle cx="12" cy="15" r="2.2" fill="#111"/><circle cx="18" cy="7" r="2.2" fill="#111"/></svg>' };
  // ---------- colour maths ----------
  const hsv2rgb = (hh, ss, vv) => { const f = (n) => { const k = (n + hh / 60) % 6; return vv - vv * ss * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5) * 255, f(3) * 255, f(1) * 255]; };
  const hex = (c) => '#' + c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
  const lab = ([r, g, b]) => { const L = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; const [R, G, B] = [L(r), L(g), L(b)];
    let x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047, y = R * 0.2126 + G * 0.7152 + B * 0.0722, z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116); [x, y, z] = [f(x), f(y), f(z)]; return [116 * y - 16, 500 * (x - y), 200 * (y - z)]; };
  const dE = (a, b) => { const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
  const scoreOf = (a, b) => 10 * Math.exp(-dE(a, b) / 32);
  // ---------- header ----------
  const GAMES = [['color'], ['color-toon'], ['sound'], ['tempo', '#ff3b6b'], ['time'], ['shape'], ['pattern', '#f5b400']];
  const navA = GAMES.map(([g, dot]) => h('a', { class: g === 'color' ? 'on' : '', onclick: () => (g === 'color' ? showGame() : toast(`${g} — another Dialed game (not cloned)`)) }, g, dot ? h('i', { style: { background: dot } }) : null));
  let snd = true, dark = false;
  const sndI = h('span.ic', { title: 'Sound', html: I.snd, onclick: () => { snd = !snd; sndI.style.opacity = snd ? '' : '.3'; toast(snd ? 'Sound on' : 'Sound off'); } });
  const sunI = h('span.ic', { title: 'Theme', html: I.sun, onclick: () => setDark(!dark) });
  const hd = h('header.dg-hd', {}, h('div.dg-logo', { onclick: () => showHub() }, h('span', { html: I.logo, style: { display: 'grid' } }), 'Dialed.gg'), h('nav.dg-nav', {}, navA),
    h('div.dg-hr', {}, sndI, sunI, h('span.ad', { onclick: () => toast('Go ad-free for $1.99/mo (demo)') }, 'Go ad-free'), h('button.dg-sign', { onclick: () => toast('Sign in (demo)') }, 'Sign in')));
  const setDark = (d) => { dark = d; el.classList.toggle('dark', d); };
  // ---------- game card ----------
  const card = h('div.dg-card');
  const pIntro = h('div.dg-pane.on'), pPlay = h('div.dg-pane'), pRecall = h('div.dg-pane', { style: { padding: 0 } }), pRes = h('div.dg-pane', { style: { padding: 0 } }), pTot = h('div.dg-pane', { style: { padding: 0 } });
  card.append(pIntro, pPlay, pRecall, pRes, pTot);
  let easy = false;
  const easyEl = h('label.dg-easy', { onclick: () => { easy = !easy; easyEl.classList.toggle('on', easy); } }, h('span.dg-sw'), 'Easy');
  const soloB = h('button.dg-rb', { title: 'Solo', html: I.user, onclick: () => start() });
  pIntro.append(h('div.dg-laurel', { html: I.laurel, title: 'Leaderboard', style: { cursor: 'pointer' }, onclick: () => toast('Daily leaderboard (demo)') }), h('div.dg-ttl', {}, 'color'),
    h('p.dg-p', {}, 'Humans can\u2019t reliably recall colors. This is a simple game to see how good (or bad) you are at it.'),
    h('p.dg-p', {}, 'We\u2019ll show you five colors, then you\u2019ll try and recreate them.'),
    h('div.dg-q', {}, 'Solo or multiplayer?'),
    h('div.dg-row', {}, soloB, h('button.dg-rb', { title: 'Multiplayer', html: I.users + '<span class="beta">beta</span>', onclick: () => toast('Multiplayer lobby (beta) — demo plays solo') }), easyEl,
      h('button.dg-daily', { title: 'Daily', onclick: () => start(true) }, h('span', { html: I.cal }))));
  // play pane
  const cnt1 = h('div.dg-cnt'), word = h('div.dg-word'), cdB = h('b'), cd = h('div.dg-cd', {}, cdB, h('small', {}, 'Seconds to remember'));
  pPlay.append(cnt1, word, cd, h('div.dg-wm', {}, 'Dialed.gg'));
  // recall pane
  const cnt2 = h('div.dg-cnt', { style: { position: 'absolute', left: '150px', top: '30px' } });
  const mkSl = (key) => { const th = h('i.th'), e = h('div.dg-sl', {}, th); e.th = th; e.key = key;
    const set = (ev) => { const r = e.getBoundingClientRect(); const v = clamp((ev.clientY - r.top) / r.height, 0, 1); G[key] = key === 'h' ? v * 360 : 1 - v; paintGuess(); };
    drag(e, { start: set, move: set }); return e; };
  const G = { h: 210, s: 0.5, v: 0.5 };
  const slH = mkSl('h'), slS = mkSl('s'), slV = mkSl('v');
  slH.style.background = 'linear-gradient(#f00,#ff0 16.6%,#0f0 33.3%,#0ff 50%,#00f 66.6%,#f0f 83.3%,#f00)';
  const okB = h('button.dg-ok', { title: 'Confirm', html: I.logo.replace('width="17" height="17"', 'width="26" height="26"'), onclick: () => confirm() });
  pRecall.append(h('div.dg-sls', {}, slH, slS, slV), cnt2, h('div.dg-wm.tr', {}, 'Dialed.gg'), okB);
  const guessRGB = () => hsv2rgb(G.h, G.s, G.v);
  const paintGuess = () => { const c = hex(guessRGB()); card.style.background = c;
    slS.style.background = `linear-gradient(${hex(hsv2rgb(G.h, 1, G.v))},${hex(hsv2rgb(G.h, 0, G.v))})`;
    slV.style.background = `linear-gradient(${hex(hsv2rgb(G.h, G.s, 1))},#000)`;
    slH.th.style.top = (G.h / 360) * 100 + '%'; slS.th.style.top = (1 - G.s) * 100 + '%'; slV.th.style.top = (1 - G.v) * 100 + '%';
    const lt = lab(guessRGB())[0] > 72; card.style.color = lt ? '#111' : '#fff'; };
  // ---------- game state ----------
  let round = 0, targets = [], guesses = [], scores = [], timers = [], raf = 0, gen = 0;
  const later = (fn, ms) => timers.push(setTimeout(fn, RM ? Math.min(ms, 60) : ms));
  const clearT = () => { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); };
  const show = (p) => { [pIntro, pPlay, pRecall, pRes, pTot].forEach((x) => x.classList.toggle('on', x === p)); };
  const tick = (f) => snd && blip(f, 0.07, 'sine', 0.06);
  const mkTargets = (seed) => { const r = seed ? rng(seed) : Math.random; return Array.from({ length: 5 }, () => hsv2rgb(r() * 360, 0.3 + r() * 0.7, 0.3 + r() * 0.7)); };
  const start = (daily = false) => { clearT(); gen++; round = 0; guesses = []; scores = []; targets = mkTargets(daily ? +new Date().toISOString().slice(0, 10).replace(/-/g, '') : 0); if (snd) audio(); playRound(); };
  const playRound = () => { const my = gen; card.style.background = '#000'; card.style.color = '#fff'; cnt1.textContent = `${round + 1} / 5`; cd.style.display = 'none'; word.style.display = ''; show(pPlay);
    word.textContent = 'ready'; tick(520);
    later(() => { if (my !== gen) return; word.textContent = 'set'; tick(660); }, 650);
    later(() => { if (my !== gen) return; reveal(); }, 1300); };
  let remain = 0;
  const reveal = () => { const my = gen; word.style.display = 'none'; cd.style.display = ''; card.classList.add('rv'); card.style.background = hex(targets[round]); void card.offsetWidth; card.classList.remove('rv');
    card.style.color = lab(targets[round])[0] > 72 ? '#111' : '#fff'; tick(880);
    const total = easy ? 8 : 4; const t0 = performance.now(); let lastS = -1;
    const loop = () => { if (my !== gen) return; remain = Math.max(0, total - (performance.now() - t0) / 1000); const sTxt = remain.toFixed(2).split('.'); cdB.innerHTML = `${sTxt[0]}<em>${sTxt[1]}</em>`;
      const whole = Math.ceil(remain); if (whole !== lastS) { lastS = whole; if (whole < total && whole > 0) tick(440); }
      if (remain <= 0) return recall(); raf = requestAnimationFrame(loop); };
    loop(); };
  const recall = () => { cancelAnimationFrame(raf); cnt2.textContent = `${round + 1} / 5`; G.h = Math.random() * 360; G.s = 0.5; G.v = 0.5; paintGuess(); show(pRecall); };
  const confirm = () => { const g = guessRGB(), t = targets[round], sc0 = scoreOf(t, g); guesses.push(g); scores.push(sc0); tick(sc0 > 7 ? 990 : 330); showRes(t, g, sc0); };
  const showRes = (t, g, sc0) => { const lt = (c) => (lab(c)[0] > 72 ? '#111' : '#fff');
    pRes.innerHTML = ''; card.style.background = '#000';
    const nextB = h('button.dg-ok', { title: round < 4 ? 'Next color' : 'See total', html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>', onclick: () => next() });
    pRes.append(h('div.dg-res', {}, h('div', { style: { background: hex(t), color: lt(t) } }, h('div.lb', {}, `${round + 1} / 5 · Original`), h('div.hx', {}, hex(t).toUpperCase())),
      h('div', { style: { background: hex(g), color: lt(g) } }, h('div.lb', {}, 'Your guess'), h('div.hx', {}, hex(g).toUpperCase()))),
      h('div.dg-sc0', { style: { color: lt(t) } }, h('b', {}, sc0.toFixed(2)), h('small', {}, sc0 > 8.5 ? 'Dialed in.' : sc0 > 6 ? 'Not bad.' : 'Way off.')), nextB);
    show(pRes); };
  const next = () => { round++; if (round < 5) playRound(); else total(); };
  const total = () => { const sum = scores.reduce((a, b) => a + b, 0); card.style.background = '#000'; card.style.color = '#fff'; pTot.innerHTML = '';
    const share = `Dialed.gg color — ${sum.toFixed(2)}/50\n` + scores.map((x) => (x > 8 ? '🟩' : x > 5 ? '🟨' : '🟥')).join('');
    pTot.append(h('div.dg-tot', {}, h('div.dg-cnt', { style: { marginBottom: '18px' } }, 'Final score'), h('h3', {}, sum.toFixed(2), h('span', { style: { opacity: 0.4, fontSize: '36px' } }, ' / 50')),
      h('div.sub', {}, sum > 40 ? 'Your colour memory is scary good.' : sum > 28 ? 'Respectable. Most people land around 30.' : 'Colours are hard. Try Easy mode.'),
      h('div.dg-pairs', {}, targets.map((t, i) => h('div.dg-pair', {}, h('i', { style: { background: hex(t) } }), h('i', { style: { background: hex(guesses[i]) } }), h('span', { style: { opacity: 0.7 } }, `Color ${i + 1}`), h('b', {}, scores[i].toFixed(2))))),
      h('div', { style: { display: 'flex', gap: '10px', marginTop: '26px' } }, h('button.dg-pill', { onclick: () => copy(share, 'Score copied') }, 'Share'), h('button.dg-pill.gh', { onclick: () => start() }, 'Play again'), h('button.dg-pill.gh', { onclick: () => toIntro() }, 'Menu'))));
    show(pTot); };
  const toIntro = () => { clearT(); gen++; card.style.background = '#000'; card.style.color = '#fff'; show(pIntro); };
  const foot = h('div.dg-foot', {}, h('span', {}, ['Privacy', 'Support', 'Instagram', 'Discord'].map((x) => h('a', { onclick: () => toast(x) }, x))), h('div', {}, 'Go ad-free for $1.99/mo'));
  const stage = h('section.dg-stage', {}, card, foot);
  // ---------- hub ----------
  const fanCard = (cls, x, y, r, inner) => h('div.dg-fc.' + cls, { style: { transform: `translate(${x}px,${y}px) rotate(${r}deg)` }, html: inner });
  const sliderCard = `<div style="position:absolute;inset:0;background:#4a86e0;display:flex"><div style="width:22px;background:linear-gradient(#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);position:relative"><i style="position:absolute;left:1px;top:52%;width:20px;height:20px;border-radius:50%;background:#fff"></i></div><div style="width:22px;background:linear-gradient(#cfe0f7,#7b8796);position:relative"><i style="position:absolute;left:1px;top:24%;width:20px;height:20px;border-radius:50%;background:#fff"></i></div><div style="width:22px;background:linear-gradient(#bcd6ff,#000);position:relative"><i style="position:absolute;left:1px;top:17%;width:20px;height:20px;border-radius:50%;background:#fff"></i></div><div style="flex:1;position:relative;color:#fff;font:500 11px ${F}"><span style="position:absolute;left:14px;top:16px;opacity:.8">1 / 5</span><span style="position:absolute;right:14px;top:16px;opacity:.7">Dialed.gg</span><i style="position:absolute;right:12px;bottom:12px;width:26px;height:26px;border-radius:50%;background:#fff"></i></div></div>`;
  const redCard = `<div style="position:absolute;inset:0;background:#f2564f;color:#fff;font:500 13px/1.25 ${F};padding:18px"><div style="text-align:right;font:500 68px/1 ${F};letter-spacing:-.04em">26</div><div style="margin:12px 0 0 auto;width:150px;font-weight:600">Wolfgang took a snapshot for once.</div><div style="position:absolute;right:16px;bottom:14px;width:26px;height:26px;border-radius:50%;background:#fff;display:grid;place-items:center;color:#111">\u2192</div></div>`;
  const phoneCard = `<div style="position:absolute;inset:0;background:#141414;border:1px solid #333;border-radius:18px;color:#fff;font:600 10px ${F}"><div style="position:absolute;left:22px;top:24px;color:#f5b400">time</div><div style="position:absolute;right:22px;top:110px;width:96px;height:64px;border:1.5px solid #ddd;border-radius:8px;padding:6px;font-size:8px">01:12:50<i style="display:block;margin-top:6px;height:30px;border-radius:5px;background:linear-gradient(135deg,#8a6cff,#3b2a8a)"></i></div><div style="position:absolute;right:30px;bottom:40px;background:#fff;color:#111;border-radius:4px;padding:2px 6px;transform:rotate(-8deg)">Go friend</div></div>`;
  const fan = h('div.dg-fan', {}, fanCard('f1', 175, 6, 12, phoneCard), fanCard('f2', 98, 0, 7, redCard), fanCard('f3', 0, 34, 0, sliderCard));
  const tile = (bg, svg) => h('div.dg-tile', { style: { background: bg }, html: svg });
  const hero = h('div.dg-hero', {}, h('div.tx', {}, h('h2', {}, tile('#ff4d5e', I.sliders.replace(/#111/g, '#2a0a0e')), 'color'), h('p', {}, 'See a color for a moment, then recreate it from memory on the sliders.'), h('button.dg-play', { onclick: () => showGame() }, 'play color')), fan);
  const SMALL = [['color-toon', '#ff9b1a', '<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#2a1500"/><circle cx="9" cy="10" r="1.3" fill="#ff9b1a"/><circle cx="15" cy="10" r="1.3" fill="#ff9b1a"/><path d="M8 14c2 2.5 6 2.5 8 0" stroke="#ff9b1a" stroke-width="1.6" fill="none"/></svg>', 'A toon shows up with one color wrong. Fix it from what you remember.'],
    ['sound', '#18c9b8', '<svg width="22" height="22" viewBox="0 0 24 24" stroke="#04302b" stroke-width="2" stroke-linecap="round"><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/></svg>', 'Listen to a tone, then tune your way back to it from memory.'],
    ['tempo', '#ff4fd8', '<svg width="22" height="22" viewBox="0 0 24 24" fill="#3a0030"><circle cx="5" cy="12" r="1.6"/><circle cx="10" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="20" cy="12" r="3" fill="none" stroke="#3a0030" stroke-width="1.6"/></svg>', 'Rebuild a beat one track at a time, tapping each note as it lands.']];
  const cards3 = h('div.dg-cards3', {}, SMALL.map(([n, c, svg, d]) => h('div.dg-gc', {}, h('h4', {}, tile(c, svg), n, n === 'tempo' ? h('span.new', {}, 'new') : null), h('p', {}, d), h('button.dg-play', { onclick: () => toast(`${n} — not cloned in this demo`) }, `play ${n}`))));
  const hub = h('section.dg-hub', {}, h('p.lead', {}, 'Simple memory, puzzle and perception games'), hero, cards3);
  sc.append(hd, hub, stage);
  el.append(h('div.dg-adl'), h('div.dg-adz'), h('div.dg-adh', { title: 'Hide', onclick: () => toast('Go ad-free for $1.99/mo') }));
  const showHub = () => { toIntro(); el.classList.add('hubmode'); navA.forEach((a) => a.classList.remove('on')); sc.scrollTop = 0; };
  const showGame = () => { el.classList.remove('hubmode'); navA.forEach((a, i) => a.classList.toggle('on', i === 0)); sc.scrollTop = 0; };
  paintGuess(); card.style.background = '#000'; card.style.color = '#fff';
  // ---------- demo proof ----------
  const reset = () => { clearT(); gen++; showGame(); setDark(false); easy = false; easyEl.classList.remove('on'); toIntro(); };
  window.__demoProof = async () => { const o = []; reset();
    showHub(); await sleep(150); o.push(`hub: hero fan cards=${fan.children.length}, game cards=${cards3.children.length}`); showGame();
    const snd0 = snd; snd = false;
    soloB.click(); await sleep(120); o.push(`start → "${word.textContent}" flash, counter ${cnt1.textContent}`);
    await sleep(RM ? 200 : 1350); o.push(`reveal: card bg ${card.style.background}, countdown "${cdB.textContent}"`);
    clearT(); recall(); o.push(`recall: sliders=${pRecall.querySelectorAll('.dg-sl').length}`);
    const t = targets[0], sl = [slH, slS, slV]; const r = slH.getBoundingClientRect();
    for (const [e, v] of [[slH, 0.1], [slS, 0.2], [slV, 0.35]]) { const rr = e.getBoundingClientRect(); e.dispatchEvent(new PointerEvent('pointerdown', { clientX: rr.left + 20, clientY: rr.top + rr.height * v, bubbles: true, pointerId: 1 })); e.dispatchEvent(new PointerEvent('pointerup', { clientX: rr.left + 20, clientY: rr.top + rr.height * v, bubbles: true, pointerId: 1 })); }
    o.push(`drag sliders → guess ${hex(guessRGB())} live bg=${card.style.background}`); void sl; void r;
    okB.click(); o.push(`confirm → round score ${scores[0].toFixed(2)} (ΔE ${dE(t, guesses[0]).toFixed(1)})`);
    for (let i = 1; i < 5; i++) { guesses.push(targets[i]); scores.push(scoreOf(targets[i], targets[i])); } round = 4; next();
    o.push(`5-round total "${pTot.querySelector('h3')?.textContent}" share btn=${!!pTot.querySelector('.dg-pill')}`);
    snd = snd0; reset(); o.push(`restored: intro card visible=${pIntro.classList.contains('on')}`); return o.join('; '); };
};

V['santatracker-illustrated-village-hero-countdown-flip-play-cta-game-card-grid-menu'] = (root, T) => {
  import('@fontsource/lobster');
  theme(root, T, { bg: '#2fb0f0', fg: '#fff', ac: '#ef1b5c', dark: true });
  const LOB = "'Lobster',cursive", SANS = "'Roboto Flex Variable','Inter Variable',Arial,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  css(`.st{position:absolute;inset:0;overflow:hidden;font-family:${SANS};color:#fff;user-select:none;background:#2fb0f0}
.st button{font-family:inherit;cursor:pointer;border:0}
.st-vil{position:absolute;inset:0;width:100%;height:100%}
.st .spin{transform-box:fill-box;transform-origin:50% 50%;animation:stSpin 6s linear infinite}
@keyframes stSpin{to{transform:rotate(360deg)}}
.st .walk{animation:stWalk var(--d,18s) linear infinite}.st .bob{animation:stBob .5s ease-in-out infinite alternate}
@keyframes stWalk{from{transform:translateX(0)}50%{transform:translateX(var(--dx,160px))}to{transform:translateX(0)}}
@keyframes stBob{to{transform:translateY(-3px)}}
.st .flake{animation:stSnow var(--d,9s) linear infinite;animation-delay:var(--dl,0s)}@keyframes stSnow{from{transform:translate(0,-40px)}to{transform:translate(var(--dx,30px),940px)}}
${RM ? '.st *{animation:none!important}' : ''}
.st-hero{position:absolute;left:50%;top:44px;transform:translateX(-50%);text-align:center;z-index:3;pointer-events:none}
.st-hero .g{font:500 21px ${SANS};letter-spacing:-.01em;opacity:.95}
.st-hero h1{margin:0;font:400 86px/1.05 ${LOB};text-shadow:0 3px 0 #0001,0 0 30px #fff4;letter-spacing:.005em}
.st-hero p{margin:10px auto 0;font:400 21px/1.2 ${SANS};max-width:420px;text-shadow:0 1px 6px #2a7fc066}
.st .st-play{position:absolute;left:50%;top:292px;width:136px;height:136px;margin-left:-68px;border-radius:50%;background:#ef1b5c!important;color:#fff;font:400 38px ${LOB};box-shadow:0 0 0 7px #ffffffb0,0 14px 28px #0003;z-index:4;transition:transform .2s cubic-bezier(.3,1.6,.5,1)}
.st-play:hover{transform:scale(1.07)}.st-play:active{transform:scale(.96)}
.st-btns{position:absolute;left:72px;top:16px;display:flex;gap:14px;z-index:30}
.st-btns button{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 -4px 0 #0003,0 3px 0 #0002;transition:transform .15s}
.st-btns button:hover{transform:scale(1.08)}.st-btns .r{background:#ff3b3b;border:2px solid #d81e2c!important}.st-btns .p{background:#a10fb8;border:2px solid #7e0592!important}
.st-cd{position:absolute;right:66px;top:12px;display:flex;background:#ff3a3a;border-radius:6px;box-shadow:0 4px 0 #c21c26,0 8px 18px #0003;z-index:30;padding:2px 0}
.st-cd::before,.st-cd::after{content:'';position:absolute;top:50%;width:8px;height:8px;background:#ff3a3a;transform:translateY(-50%) rotate(45deg)}.st-cd::before{left:-3px}.st-cd::after{right:-3px}
.st-cd>div{width:52px;height:64px;position:relative;text-align:center;border-left:1px solid #c8202a;perspective:120px}.st-cd>div:first-child{border:0}
.st-cd .n{position:absolute;left:0;right:0;top:4px;font:400 33px/42px ${LOB};backface-visibility:hidden;transform-origin:50% 100%}
.st-cd .n.in{animation:stFlipIn .45s ease-out}.st-cd .n.out{animation:stFlipOut .45s ease-in forwards;opacity:.55}
@keyframes stFlipIn{from{transform:translateY(-22px) rotateX(70deg);opacity:0}to{transform:none;opacity:1}}@keyframes stFlipOut{to{transform:translateY(16px) rotateX(-80deg);opacity:0}}
.st-cd small{position:absolute;left:0;right:0;bottom:6px;font:700 7.5px ${SANS};letter-spacing:.08em}
.st-fam{position:absolute;left:34px;bottom:26px;height:46px;padding:0 20px 0 6px;border-radius:23px;background:#5fb2f7;display:flex;align-items:center;gap:12px;font:500 15px ${SANS};z-index:5;box-shadow:0 4px 12px #0002}
.st-fam i{width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 50% 38%,#7b4a2c 0 28%,#5a8df0 29% 100%)}
.st-ck{position:absolute;right:16px;bottom:16px;width:450px;background:#202124;border-radius:6px;padding:16px 22px 12px;font:400 15px/1.35 ${SANS};z-index:6;box-shadow:0 6px 24px #0005}
.st-ck div{display:flex;justify-content:flex-end;gap:36px;margin-top:14px}.st-ck button{background:none;color:#8ab4f8;font:500 14px ${SANS};letter-spacing:.03em}
.st-menu{position:absolute;inset:0;background:#4f16d4;z-index:20;overflow:auto;opacity:0;pointer-events:none;transition:opacity .3s}
.st-menu.on{opacity:1;pointer-events:auto}.st-menu::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(115deg,#ffffff07 0 60px,#0000 60px 140px);pointer-events:none}
.st-grid{position:relative;display:grid;grid-template-columns:repeat(5,224px);gap:24px;justify-content:center;padding:92px 0 60px;transform:translateY(24px);transition:transform .45s cubic-bezier(.2,.9,.3,1)}
.st-menu.on .st-grid{transform:none}
.st-card{position:relative;height:224px;border-radius:30px;overflow:hidden;cursor:pointer;box-shadow:0 6px 0 #0002;transition:transform .2s cubic-bezier(.3,1.5,.5,1)}
.st-card:hover{transform:translateY(-6px) scale(1.03)}.st-card.w{grid-column:span 2}
.st-card svg{position:absolute;inset:0;width:100%;height:100%}
.st-card b{position:absolute;left:0;right:0;bottom:28px;text-align:center;font:400 26px ${LOB};text-shadow:0 2px 3px #0005;letter-spacing:.01em}
.st-scene{position:absolute;inset:0;z-index:15;background:#000;display:none}.st-scene.on{display:block}
.st-scene .fr{position:absolute;left:0;right:0;top:44px;bottom:44px;overflow:hidden}
.st-scene .fr svg{width:100%;height:100%}.st-scene .ttl{position:absolute;left:0;right:0;bottom:70px;text-align:center;font:400 46px ${LOB};text-shadow:0 3px 6px #0005}
.st-pause{position:absolute;inset:0;background:#000a;display:none;place-items:center;font:400 64px ${LOB};z-index:2}.st-pause.on{display:grid}
`);
  const el = h('div.st'); root.append(el);
  const R = rng(12);
  // ---------- illustrated village (code-drawn flat vector) ----------
  const W = 1440, H = 900;
  const win = (x, y, w, hh, c = '#2d4fa8') => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="2" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${hh - 4}" fill="${c}"/><path d="M${x + w / 2} ${y + 2}v${hh - 4}M${x + 2} ${y + hh / 2}h${w - 4}" stroke="#fff" stroke-width="1.5"/>`;
  const house = (x, y, w, hh, body, sh = 0) => { let ws = ''; const cols = Math.max(1, Math.floor(w / 26)), rows = Math.max(1, Math.floor((hh - 20) / 34)); for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) ws += win(x + 8 + c * ((w - 16) / cols) + ((w - 16) / cols - 14) / 2, y + 14 + r * 34, 14, 22);
    const drips = Array.from({ length: Math.ceil((w + 16) / 14) }, (_, i) => `<circle cx="${x - 8 + i * 14 + 7}" cy="${y - 2}" r="${4 + (i % 3)}" fill="#fff"/>`).join('');
    return `<g><rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${body}"/><rect x="${x + w * 0.62}" y="${y}" width="${w * 0.38}" height="${hh}" fill="#0000001a"/>${ws}<path d="M${x - 10} ${y}L${x + w / 2} ${y - 26 - sh}L${x + w + 10} ${y}Z" fill="#fff"/><path d="M${x + w / 2} ${y - 26 - sh}L${x + w + 10} ${y}H${x + w / 2}Z" fill="#dce9f7"/>${drips}<rect x="${x + w * 0.7}" y="${y - 30 - sh}" width="10" height="18" fill="#b5523a"/><rect x="${x + w * 0.7 - 2}" y="${y - 34 - sh}" width="14" height="6" rx="3" fill="#fff"/></g>`; };
  const tree = (x, y, s2 = 1, c = '#1aa37a') => `<g transform="translate(${x} ${y}) scale(${s2})"><path d="M0-62L22-10H-22Z" fill="${c}"/><path d="M0-46L28 6H-28Z" fill="${c}"/><path d="M0-30L34 22H-34Z" fill="${c}"/><path d="M0-62L22-10H0ZM0-46L28 6H0ZM0-30L34 22H0Z" fill="#00000022"/><rect x="-4" y="22" width="8" height="10" fill="#7a4a2a"/></g>`;
  const bush = (x, y, r = 16) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#20a95a"/><path d="M${x} ${y - r}a${r} ${r} 0 0 1 0 ${2 * r}z" fill="#178a47"/><path d="M${x - r * 0.6} ${y - 2}h${r * 1.2}M${x - r * 0.5} ${y + 6}h${r}" stroke="#7ed67f" stroke-width="2"/>`;
  const lamp = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-4" y="-70" width="8" height="70" fill="#1f9a4c"/><rect x="-10" y="-6" width="20" height="8" rx="2" fill="#178a47"/><circle cy="-80" r="13" fill="#fff"/><path d="M-13-80a13 13 0 0 0 26 0z" fill="#e6eef7"/><rect x="-9" y="-70" width="18" height="5" fill="#178a47"/></g>`;
  const cane = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-6" y="-80" width="12" height="80" fill="#fff"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M-6 ${-80 + i * 14}l12 -6v8l-12 6z" fill="#e8283a"/>`).join('')}<circle cy="-84" r="7" fill="#fff"/></g>`;
  const elf = (x, y, body, k = 1, extra = '') => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="34" rx="13" ry="3" fill="#0000001a"/><rect x="-6" y="18" width="5" height="16" fill="#3a2a5a"/><rect x="2" y="18" width="5" height="16" fill="#3a2a5a"/><rect x="-9" y="0" width="18" height="22" rx="5" fill="${body}"/><circle cx="0" cy="-6" r="8" fill="#f2b38a"/><path d="M-9-8Q0-34 14-26L9-10Z" fill="${body === '#e8283a' ? '#1f9a4c' : '#e8283a'}"/><circle cx="14" cy="-26" r="3" fill="#fff"/><rect x="-10" y="-11" width="19" height="4" rx="2" fill="#fff"/>${extra}</g>`;
  const bike = (x, y, body, k = 1, d = 16, dx = 220) => `<g class="walk" style="--d:${d}s;--dx:${dx}px"><g transform="translate(${x} ${y}) scale(${k})"><circle cx="-22" cy="20" r="17" fill="none" stroke="#3b6fd8" stroke-width="3"/><circle cx="24" cy="20" r="17" fill="none" stroke="#3b6fd8" stroke-width="3"/><path d="M-22 20L-4 -2L18 -2L24 20M-4-2L2 20L18-2" fill="none" stroke="#3b6fd8" stroke-width="3"/>${elf(0, -30, body, 0.9)}</g></g>`;
  const turb = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-2 0L-4 140H4L2 0Z" fill="#fff"/><g class="spin"><path d="M0 0L-3-70Q0-74 3-70Z M0 0L62 32Q63 37 58 37Z M0 0L-60 37Q-63 33-59 30Z" fill="#fff"/><circle r="5" fill="#e7f2fb"/></g></g>`;
  const star4 = (x, y, r) => `<path d="M${x} ${y - r}Q${x + r * 0.15} ${y - r * 0.15} ${x + r} ${y}Q${x + r * 0.15} ${y + r * 0.15} ${x} ${y + r}Q${x - r * 0.15} ${y + r * 0.15} ${x - r} ${y}Q${x - r * 0.15} ${y - r * 0.15} ${x} ${y - r}Z" fill="#fff"/>`;
  let v = `<defs><linearGradient id="stSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1ea6ee"/><stop offset=".55" stop-color="#5cc9f5"/><stop offset="1" stop-color="#d4f1fb"/></linearGradient><linearGradient id="stHill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#dfe9f4"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#stSky)"/>${[[330, 40, 9], [930, 26, 7], [1100, 120, 8], [560, 160, 6], [240, 260, 5], [1240, 300, 6]].map(([x, y, r]) => star4(x, y, r)).join('')}
<g opacity=".9"><path d="M260 70q20-34 52-14q22-26 50 0q30-6 30 22H250q-10-8 10-8z" fill="#fff"/><path d="M300 210q16-24 40-10q20-18 40 2q24-2 24 22H290z" fill="#fff"/></g>
${turb(30, 130, 1)}${turb(118, 70, 1.25)}${turb(210, 160, 0.9)}${turb(355, 180, 0.8)}
<path d="M0 330C200 250 360 300 520 250S900 180 1100 230 1400 160 1440 170V420H0Z" fill="#2f6fe0"/><path d="M0 360C240 300 420 340 640 290S1000 250 1200 300 1440 260 1440 260V440H0Z" fill="#4b8cec"/>
${Array.from({ length: 34 }, (_, i) => `<path d="M${i * 44 + (i % 3) * 8} ${300 + (i % 4) * 9}l11-34 11 34z" fill="#2554b8"/>`).join('')}
<path d="M0 390C300 360 600 380 760 350L1440 40V900H0Z" fill="url(#stHill)"/><path d="M760 350L1440 40V140L900 420Z" fill="#c9d9ea" opacity=".45"/>`;
  [[10, 270, 120, 110, '#f6dba7'], [30, 190, 92, 80, '#fde0c4', 10], [138, 280, 76, 90, '#7fd0e8'], [210, 250, 70, 100, '#b6ec9f'], [282, 270, 64, 80, '#73b9f3'], [346, 290, 58, 70, '#bfe6f8']].forEach((a) => (v += house(...a)));
  v += `<g transform="translate(215 330)"><path d="M0-200L58 20H-58Z" fill="#fff"/><path d="M0-200L58 20H0Z" fill="#e3edf8"/>${Array.from({ length: 22 }, (_, i) => `<circle cx="${(R() - 0.5) * (i * 4.6)}" cy="${-190 + i * 9.5}" r="3" fill="${pick(['#e8283a', '#ffd23a', '#2fb0f0', '#1f9a4c'], R)}"/>`).join('')}<path d="M0-226l6 14 15 1-11 9 4 15-14-8-14 8 4-15-11-9 15-1z" fill="#ffd23a"/></g>`;
  [[1300, 30, 140, 210, '#bfe3fb', 12], [1180, 120, 120, 150, '#ffd9c6', 12], [1070, 220, 110, 120, '#fff4c2', 10], [960, 320, 110, 100, '#7cc7f5', 8], [870, 420, 100, 100, '#bff0c8'], [1040, 400, 120, 120, '#9be2a8', 10], [1210, 310, 230, 300, '#bde0fb', 20]].forEach((a) => (v += house(...a)));
  v += `<path d="M0 520C300 470 700 470 1100 520S1440 560 1440 560V900H0Z" fill="#f4f8fc"/><ellipse cx="720" cy="700" rx="640" ry="150" fill="none" stroke="#dde5ef" stroke-width="44"/><ellipse cx="720" cy="700" rx="380" ry="90" fill="none" stroke="#e4ebf3" stroke-width="30"/>
<g transform="translate(290 450)"><rect width="230" height="70" rx="4" fill="#f4874b" transform="skewX(-20)"/><rect y="70" width="230" height="10" fill="#c9622f" transform="skewX(-20)"/><path d="M40 0v70M80 0v70M120 0v70M160 0v70M200 0v70" stroke="#d96d36" stroke-width="2" transform="skewX(-20)"/></g>
<g transform="translate(250 360)"><rect width="110" height="90" rx="44" fill="#e6f1fb"/><path d="M0 40q55-30 110 0v-6q-55-50-110 0z" fill="#fff"/><path d="M30 90v-34a25 25 0 0 1 50 0v34z" fill="#2a3f86"/></g>`;
  v += [[580, 560], [880, 520], [1060, 640], [300, 690], [1300, 690]].map(([x, y]) => lamp(x, y)).join('') + [[560, 520], [870, 560], [1110, 700], [330, 760]].map(([x, y]) => cane(x, y)).join('');
  v += [[120, 620], [150, 640], [520, 760], [540, 790], [600, 780], [880, 790], [940, 800], [1250, 610], [1330, 600], [1380, 640], [460, 870], [990, 880]].map(([x, y]) => bush(x, y, 16 + R() * 8)).join('');
  v += tree(230, 780, 1.6, '#16a37f') + tree(1400, 760, 1.4, '#1a8d73') + tree(60, 470, 0.9);
  v += `<g transform="translate(720 820)"><ellipse rx="170" ry="48" fill="#3aa5e8"/><ellipse rx="150" ry="38" fill="#7fd0f5"/><rect x="-60" y="-60" width="120" height="60" fill="#c9d3dd"/><ellipse cy="-60" rx="60" ry="16" fill="#dfe6ed"/><path d="M-4-60V-120h8V-60z" fill="#3aa5e8"/><path d="M-70-120q70-60 140 0q-14 18-26 4q-14 18-30 2q-14 18-28 2q-16 16-28 0q-14 14-28-8z" fill="#b9ecff"/><path d="M-62-116q62-40 124 0" fill="none" stroke="#fff" stroke-width="8"/></g>`;
  v += elf(470, 470, '#e8283a') + elf(560, 430, '#1f9a4c', 1.1) + elf(640, 470, '#7a3fd0') + elf(1150, 520, '#1f9a4c', 1.2) + elf(1010, 360, '#e8283a', 0.9) + elf(160, 520, '#3b6fd8');
  v += `<g class="walk" style="--d:22s;--dx:-180px">${elf(920, 600, '#e8283a', 1.1)}</g><g class="walk" style="--d:15s;--dx:140px">${elf(400, 610, '#1f9a4c', 1.05)}</g>`;
  v += bike(470, 640, '#3b6fd8', 1, 14, 260) + bike(820, 620, '#e8283a', 1.05, 18, -240) + bike(1180, 590, '#1f9a4c', 0.95, 12, 140);
  v += `<g transform="translate(300 800)"><path d="M-30 60V0q0-30 30-30t30 30v60z" fill="#fff"/><circle cy="-6" r="18" fill="#fff"/><path d="M-10-8h6M4-8h6M-6 2q6 5 12 0" stroke="#5a8df0" stroke-width="3" fill="none"/></g>`;
  v += Array.from({ length: 70 }, (_, i) => `<circle class="flake" style="--d:${7 + R() * 9}s;--dl:${-R() * 16}s;--dx:${(R() - 0.5) * 80}px" cx="${R() * W}" cy="0" r="${1.5 + R() * 2.5}" fill="#fff" opacity="${0.6 + R() * 0.4}"/>`).join('');
  const vil = h('div', { html: `<svg class="st-vil" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${v}</svg>` }); el.append(vil);
  el.append(h('div.st-hero', {}, h('div.g', {}, 'Google'), h('h1', {}, 'Santa Tracker'), h('p', {}, "Explore, play and learn with Santa's elves all December long")));
  const ICO = { menu: '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>', home: '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" fill="#fff"/></svg>', on: '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M16 8q3 4 0 8M18.5 5.5q5 6.5 0 13" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>', off: '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M16 9l5 6M21 9l-5 6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>', pause: '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="#fff"/></svg>' };
  let muted = true, menuOn = false, scene = null, paused = false;
  const bMenu = h('button.r', { title: 'Menu', html: ICO.menu, onclick: () => (scene ? goHome() : setMenu(!menuOn)) });
  const bMute = h('button.p', { title: 'Mute', html: ICO.off, onclick: () => { muted = !muted; bMute.innerHTML = muted ? ICO.off : ICO.on; if (!muted) blip(880, 0.12, 'triangle', 0.08); } });
  const bPause = h('button.r', { title: 'Pause', html: ICO.pause, style: { display: 'none' }, onclick: () => { paused = !paused; pz.classList.toggle('on', paused); } });
  el.append(h('div.st-btns', {}, bMenu, bMute, bPause));
  // ---------- flip countdown (to 24 Dec, local time) ----------
  const cells = ['DAYS', 'HRS', 'MIN', 'SEC'].map((l) => { const c = h('div', {}, h('span.n', {}, '00'), h('small', {}, l)); c.cur = ''; return c; }); const cd = h('div.st-cd', {}, cells); el.append(cd);
  const flip = (c, val) => { if (c.cur === val) return; const old = c.querySelector('.n:not(.out)'); if (c.cur !== '' && !RM) { old.classList.remove('in'); old.classList.add('out'); setTimeout(() => old.remove(), 460); const n = h('span.n.in', {}, val); c.prepend(n); } else old.textContent = val; c.cur = val; };
  const tick = () => { const now = new Date(); let tgt = Date.UTC(now.getUTCFullYear(), 11, 24, 10, 0, 0); if (now > tgt + 86400000) tgt = Date.UTC(now.getUTCFullYear() + 1, 11, 24, 10, 0, 0); let d = Math.max(0, (tgt - now) / 1000); /* Santa takes off 24 Dec 10:00 UTC */ const v4 = [Math.floor(d / 86400), Math.floor(d / 3600) % 24, Math.floor(d / 60) % 60, Math.floor(d) % 60]; cells.forEach((c, i) => flip(c, String(v4[i]).padStart(2, '0'))); return v4; };
  tick(); const iv = setInterval(tick, 1000);
  const play = h('button.st-play', { onclick: () => openGame(0) }, 'Play'); el.append(play);
  el.append(h('div.st-fam', {}, h('i'), 'Family Guide'));
  const ck = h('div.st-ck', {}, 'Google serves cookies to analyse traffic to this site, and to optimize your experience. Information about your use of our site is shared with Google for that purpose.', h('div', {}, h('button', { onclick: () => toast('Cookie details (demo)') }, 'SEE DETAILS'), h('button', { onclick: () => ck.remove() }, 'OK'))); el.append(ck);
  // ---------- game-card grid menu (33 games) ----------
  const ART = {
    room: (c) => `<rect width="460" height="224" fill="#f7c12e"/><rect x="40" y="20" width="60" height="50" fill="#fff5" transform="rotate(-8 70 45)"/><rect x="170" y="30" width="50" height="44" fill="#e8283a"/><rect x="330" y="10" width="80" height="80" rx="10" fill="#e8283a"/><path d="M60 224V150q0-14 14-14h300q14 0 14 14v74z" fill="#9b4a2a"/><rect x="80" y="122" width="150" height="34" rx="12" fill="#fff"/><path d="M200 150q60-50 150-14l-6 18z" fill="#e8283a"/><rect x="190" y="100" width="70" height="50" rx="14" fill="#ff0000"/><path d="M216 112l20 13-20 13z" fill="#fff"/>`,
    santa: () => `<circle cx="112" cy="140" r="78" fill="#e8283a"/><circle cx="112" cy="104" r="42" fill="#f2c1a0"/><path d="M70 110q42 90 84 0q4 40-42 70q-46-30-42-70z" fill="#fff"/><path d="M76 82q36-50 72 0z" fill="#fff"/><circle cx="98" cy="98" r="4" fill="#333"/><circle cx="126" cy="98" r="4" fill="#333"/><path d="M60 224q52-40 104 0z" fill="#333"/>`,
    narwhal: () => `<rect width="224" height="224" fill="#1d5fa8"/><circle cx="40" cy="60" r="70" fill="#2e7ad0" opacity=".5"/><ellipse cx="120" cy="140" rx="90" ry="60" fill="#3b8ce0"/><ellipse cx="130" cy="160" rx="60" ry="34" fill="#cfe9ff"/><path d="M150 90l70-80" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M150 90l70-80" stroke="#e8283a" stroke-width="10" stroke-dasharray="8 8"/><circle cx="150" cy="120" r="8" fill="#123"/><path d="M130 150q14 10 30 0" stroke="#123" stroke-width="4" fill="none"/>`,
    puzzle: (c) => `<rect x="34" y="40" width="74" height="70" rx="6" fill="#8a2be2"/><rect x="116" y="40" width="74" height="70" rx="6" fill="#2fa84f"/><rect x="34" y="118" width="74" height="70" rx="6" fill="#2fa84f"/><rect x="116" y="118" width="74" height="70" rx="6" fill="#8a2be2"/><circle cx="112" cy="75" r="12" fill="#8a2be2"/><circle cx="71" cy="114" r="12" fill="#2fa84f"/>${elf(70, 70, '#e8283a', 1.1)}${elf(150, 140, '#1f9a4c', 1.1)}`,
    jet: () => `${elf(100, 100, '#3b6fd8', 1.6)}<path d="M80 150l-20 40M120 150l-6 44" stroke="#ff9a2e" stroke-width="10" stroke-linecap="round"/><path d="M150 60q20-30 40 0z" fill="#fff"/><path d="M152 60l18 26 18-26" stroke="#fff" fill="none"/><rect x="164" y="86" width="12" height="10" fill="#ffd23a"/>`,
    band: () => `${elf(112, 100, '#e8283a', 2.2)}<path d="M40 160l120-50" stroke="#c9862e" stroke-width="12" stroke-linecap="round"/><rect x="130" y="120" width="50" height="16" rx="3" fill="#333"/>`,
    snow: () => `${elf(80, 110, '#222', 1.8)}${elf(160, 130, '#ff7a2e', 1.4)}<circle cx="120" cy="60" r="10" fill="#fff"/><circle cx="190" cy="90" r="8" fill="#fff"/><ellipse cx="112" cy="190" rx="80" ry="10" fill="#0002"/>`,
    maker: () => `${Array.from({ length: 7 }, (_, i) => `<circle cx="${112 + Math.cos(i * 0.9 - 2.8) * 80}" cy="${120 + Math.sin(i * 0.9 - 2.8) * 70}" r="16" fill="${['#222', '#fff', '#e8283a', '#222', '#ffd23a', '#fff', '#222'][i]}"/>`).join('')}${elf(112, 120, '#e8283a', 1.6)}`,
    lab: (c) => `<rect x="30" y="50" width="70" height="40" rx="6" fill="#1e3f8a"/><rect x="124" y="50" width="70" height="40" rx="6" fill="#8a2be2"/><rect x="30" y="110" width="164" height="40" rx="6" fill="#8a2be2"/><rect x="30" y="160" width="70" height="30" rx="6" fill="#1e3f8a"/><circle cx="150" cy="130" r="12" fill="#fff"/><path d="M60 60h20v20H60z" fill="#e8a24a"/>`,
    dj: () => `<rect x="20" y="70" width="40" height="70" rx="4" fill="#222"/><rect x="164" y="70" width="40" height="70" rx="4" fill="#222"/><circle cx="40" cy="100" r="12" fill="#555"/><circle cx="184" cy="100" r="12" fill="#555"/><rect x="40" y="140" width="144" height="20" fill="#f7a92e"/>${elf(112, 100, '#e8283a', 1.4)}<rect x="160" y="128" width="24" height="16" fill="#e8283a"/>`,
    penguin: () => `<path d="M60 120q60-70 130-30q-40 50-130 30z" fill="#222"/><path d="M80 118q50-30 100-24q-40 30-100 24z" fill="#fff"/><path d="M160 78q20-24 40 0l-30 14z" fill="#e8283a"/><circle cx="175" cy="96" r="4" fill="#fff"/><path d="M40 130l-20 10M50 140l-30 0M44 120l-24-6" stroke="#2ea" stroke-width="3" stroke-dasharray="3 6"/>`,
    rail: () => `<path d="M20 170q60-50 100-10t90-20" stroke="#e8283a" stroke-width="12" fill="none"/><path d="M20 182q60-50 100-10t90-20" stroke="#5a1ad6" stroke-width="6" fill="none"/><rect x="92" y="96" width="40" height="40" rx="6" fill="#ff7a2e"/>${elf(112, 70, '#3b6fd8', 1.1)}`,
    bolt: () => `${elf(112, 90, '#e8283a', 2)}<rect x="82" y="130" width="60" height="50" rx="8" fill="#8a2be2"/><circle cx="170" cy="160" r="12" fill="none" stroke="#fff" stroke-width="5"/><circle cx="50" cy="160" r="5" fill="#e8283a"/>`,
    sling: () => `<path d="M40 140h150q10 0 10 10t-10 10H40q-16 0-20-20z" fill="#ffd23a"/><circle cx="50" cy="120" r="22" fill="#ffd23a"/><path d="M28 118l-14 6 14 4z" fill="#ff7a2e"/>${elf(130, 100, '#3b6fd8', 1.2)}<rect x="150" y="96" width="30" height="40" fill="#e8283a"/><rect x="160" y="76" width="22" height="20" fill="#2fa84f"/>`,
    gift: (c) => `<rect x="62" y="96" width="100" height="84" rx="6" fill="#e8283a"/><rect x="54" y="80" width="116" height="26" rx="5" fill="#ff4b4b"/><rect x="104" y="80" width="16" height="100" fill="#ffd23a"/><path d="M112 80q-40-40-40-10q0 10 40 10q40 0 40-10q0-30-40 10z" fill="none" stroke="#ffd23a" stroke-width="8"/>`,
    elf: (c, i) => elf(112, 110, pick(['#e8283a', '#1f9a4c', '#3b6fd8', '#ff7a2e'], rng(i + 5)), 2.2),
  };
  const GAMES = [['Out Like A Light', '#f7c12e', 'room', 1], ['Santa Selfie', '#6fb7ff', 'santa'], ['Ollie Under The Sea', '#1d5fa8', 'narwhal'], ['Code Boogie', '#ffc23a', 'puzzle'], ['Elf Jetpack', '#9c8cf0', 'jet'], ['Elf Jamband', '#6aaff7', 'band'], ['Snowball Storm', '#94d7e6', 'snow'], ['Elf Maker', '#3b8cf0', 'maker'], ['Code Lab', '#2d4fa8', 'lab'], ['Wrap Battle', '#2f55b8', 'dj'], ['Penguin Dash', '#94dce6', 'penguin'], ['Railroad Ride', '#7d4ef0', 'rail'], ['Build & Bolt', '#f7c12e', 'bolt'], ['Gift Slingshot', '#52b8f0', 'sling'], ['Present Bounce', '#3fa9f5', 'gift', 1], ['Snowflake', '#bf8a5a', 'elf'], ['Rudolph Racer', '#28a8f0', 'elf'], ['Elf Glider', '#8a5cf0', 'elf'], ['Penguin Speed Skating', '#5ec3f0', 'penguin'], ['Gumball Tilt', '#f05ca0', 'gift'], ['Present Drop', '#2fa84f', 'gift'], ['Santa Search', '#ff7a2e', 'santa'], ['Traditions', '#6fb7ff', 'elf'], ['Translations', '#f7c12e', 'elf'], ['Wrap Battle Remix', '#2d4fa8', 'dj'], ['Snowbox', '#94d7e6', 'snow'], ['Elf Ski', '#3b8cf0', 'jet'], ['Boatload', '#1d5fa8', 'sling'], ['Mail Mayhem', '#e8283a', 'gift'], ['Speed Sketch', '#7d4ef0', 'band'], ['Seasons of Giving', '#2fa84f', 'maker'], ['Elf Ski Lift', '#9c8cf0', 'rail'], ['Air Traffic Control', '#28a8f0', 'puzzle']];
  const art = (g, i, w = g[3] ? 472 : 224) => `<svg viewBox="0 0 ${w} 224" preserveAspectRatio="xMidYMid slice"><rect width="${w}" height="224" fill="${g[1]}"/>${g[2] === 'room' ? ART.room() : `<g transform="translate(${(w - 224) / 2} 0)">${(ART[g[2]] || ART.elf)(g[1], i)}</g>`}</svg>`;
  const grid = h('div.st-grid', {}, GAMES.map((g, i) => h('div.st-card' + (g[3] ? '.w' : ''), { html: art(g, i) + `<b>${g[0]}</b>`, onclick: () => openGame(i) })));
  const menu = h('div.st-menu', {}, grid); el.append(menu);
  function setMenu(on) { menuOn = on; menu.classList.toggle('on', on); bMenu.innerHTML = ICO.menu; if (!muted) blip(on ? 660 : 440, 0.1, 'triangle', 0.08); }
  // ---------- game scene (home / mute / pause; countdown stays) ----------
  const pz = h('div.st-pause', {}, 'Paused'); const fr = h('div.fr'); const sc = h('div.st-scene', {}, fr, pz); el.append(sc);
  const OLAL = `<svg viewBox="0 0 1440 812" preserveAspectRatio="xMidYMid slice"><rect width="1440" height="812" fill="#f9d33c"/><rect x="1250" width="190" height="812" fill="#e36633"/><circle cx="1440" cy="760" r="220" fill="#22704a"/><path d="M150 740L210 640H1240L1300 740Z" fill="#ff7a33"/><rect x="150" y="740" width="1150" height="72" fill="#d6531e"/><clipPath id="stHat"><path d="M370 560Q560 230 1100 220L1110 560Z"/></clipPath><path d="M370 560Q560 230 1100 220L1110 560Z" fill="#ff3a3a"/><g stroke="#a3140f" stroke-width="16" clip-path="url(#stHat)">${[0, 1, 2, 3, 4].map((i) => `<path d="M${420 + i * 150} 590L${520 + i * 150} 200"/><path d="M380 ${300 + i * 70}L1110 ${360 + i * 70}"/>`).join('')}</g><path d="M370 560Q560 230 1100 220L1110 560Z" fill="none"/><rect x="0" y="0" width="1" height="1" fill="none"/><ellipse cx="1265" cy="390" rx="125" ry="105" fill="#fff"/><rect x="240" y="560" width="960" height="210" rx="56" fill="#fff"/></svg>`;
  function openGame(i) { const g = GAMES[i]; scene = g[0]; setMenu(false); paused = false; pz.classList.remove('on');
    fr.innerHTML = i === 0 ? OLAL : `<svg viewBox="0 0 1440 812" preserveAspectRatio="xMidYMid slice"><rect width="1440" height="812" fill="${g[1]}"/><circle cx="1200" cy="120" r="260" fill="#fff1"/><circle cx="160" cy="700" r="300" fill="#0001"/><g transform="translate(470 120) scale(2.2)"><g class="bob">${(ART[g[2]] || ART.elf)(g[1], i)}</g></g></svg><div class="ttl">${g[0]}</div>`;
    sc.classList.add('on'); bMenu.innerHTML = ICO.home; bMenu.title = 'Home'; bPause.style.display = ''; if (!muted) blip(784, 0.15, 'triangle', 0.08); }
  function goHome() { scene = null; sc.classList.remove('on'); bMenu.innerHTML = ICO.menu; bMenu.title = 'Menu'; bPause.style.display = 'none'; paused = false; pz.classList.remove('on'); }
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (scene) goHome(); else setMenu(false); } });
  window.__demoProof = async () => { const o = [], w = (ms) => sleep(RM ? 30 : ms);
    const s0 = cells[3].cur; await sleep(1100); o.push(`countdown ${cells.map((c) => c.cur).join(':')} (sec ${s0}→${cells[3].cur}, flip=${!!cells[3].querySelector('.n.out') || RM})`);
    bMenu.click(); await w(400); o.push(`menu open=${menu.classList.contains('on')} cards=${grid.children.length}`);
    grid.children[1].click(); await w(200); o.push(`card→${scene} scene=${sc.classList.contains('on')} countdown kept=${getComputedStyle(cd).display !== 'none'} pause btn=${bPause.style.display !== 'none'}`);
    bPause.click(); o.push(`paused=${pz.classList.contains('on')}`); bPause.click();
    bMenu.click(); await w(150); o.push(`home→village=${!sc.classList.contains('on')}`);
    play.click(); await w(150); o.push(`Play→${scene}`); bMenu.click(); await w(100);
    o.push(`restored: menu=${menuOn} scene=${scene}`); return o.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['css-grid-garden-puzzle'])(root, T); }
