import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, drum, blip, midi, fitCanvas, noise2, hexToRgb, oklchToHex, hexToOklch } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle } from '../kit.js';
const MONO = "'JetBrains Mono Variable',ui-monospace,monospace";
function editor(val, on, { bg = '#1e1e1e', fg = '#d4d4d4', gutter = '#858585', size = 13, lh = 20 } = {}) {
  const gut = h('pre', { style: { margin: 0, padding: '10px 8px', color: gutter, textAlign: 'right', userSelect: 'none', font: `${size}px/${lh}px ${MONO}`, minWidth: '34px' } });
  const ta = h('textarea', { spellcheck: false, value: val, style: { flex: 1, resize: 'none', border: 0, outline: 'none', background: 'transparent', color: fg, font: `${size}px/${lh}px ${MONO}`, padding: '10px', whiteSpace: 'pre', overflow: 'auto', tabSize: 2 } });
  ta.value = val;
  const upd = () => { gut.textContent = ta.value.split('\n').map((_, i) => i + 1).join('\n'); };
  ta.addEventListener('input', () => { upd(); on(ta.value); }); ta.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end'); ta.dispatchEvent(new Event('input')); } if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); w.onRun?.(); } });
  const w = h('div', { style: { display: 'flex', background: bg, height: '100%', overflow: 'hidden' } }, gut, ta); w.ta = ta; w.set = (v) => { ta.value = v; upd(); on(v); }; upd(); return w;
}
function gl(frag) { const cv = h('canvas', { style: { width: '100%', height: '100%', display: 'block' } }); const g = cv.getContext('webgl', { preserveDrawingBuffer: true }); let pr = null; const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}';
  const mk = (t, src) => { const x = g.createShader(t); g.shaderSource(x, src); g.compileShader(x); if (!g.getShaderParameter(x, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(x)); return x; };
  const b = g && g.createBuffer(); if (g) { g.bindBuffer(g.ARRAY_BUFFER, b); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW); }
  const api = { cv, err: '', compile(src) { if (!g) return; try { const p2 = g.createProgram(); g.attachShader(p2, mk(g.VERTEX_SHADER, vs)); g.attachShader(p2, mk(g.FRAGMENT_SHADER, src)); g.linkProgram(p2); pr = p2; api.err = ''; } catch (e) { api.err = e.message; } }, draw(t, m = [0, 0]) { if (!pr) return; const r = cv.getBoundingClientRect(); if (cv.width !== (r.width | 0) || cv.height !== (r.height | 0)) { cv.width = r.width | 0; cv.height = r.height | 0; } g.viewport(0, 0, cv.width, cv.height); g.useProgram(pr); const l = g.getAttribLocation(pr, 'p'); g.enableVertexAttribArray(l); g.vertexAttribPointer(l, 2, g.FLOAT, false, 0, 0); for (const n of ['r', 'resolution', 'R']) g.uniform2f(g.getUniformLocation(pr, n), cv.width, cv.height); for (const n of ['t', 'time']) g.uniform1f(g.getUniformLocation(pr, n), t); g.uniform2f(g.getUniformLocation(pr, 'm'), m[0], m[1]); g.drawArrays(g.TRIANGLE_STRIP, 0, 4); } }; if (frag) api.compile(frag); return api; }
const V = {};
// ---- mermaid
function flow(src) { const nodes = new Map(), edges = []; const node = (tok) => { const m = tok.trim().match(/^(\w+)\s*(?:\[(.+?)\]|\((.+?)\)|\{(.+?)\})?$/); if (!m) return null; const id = m[1]; const shape = m[2] ? 'rect' : m[3] ? 'round' : m[4] ? 'diamond' : null; if (!nodes.has(id)) nodes.set(id, { id, label: m[2] || m[3] || m[4] || id, shape: shape || 'rect' }); else if (shape) Object.assign(nodes.get(id), { label: m[2] || m[3] || m[4], shape }); return id; }; let dir = 'TD'; src.split('\n').forEach((l) => { l = l.trim(); const d = l.match(/^(?:graph|flowchart)\s+(\w+)/); if (d) { dir = d[1]; return; } const parts = l.split(/\s*-->\s*(?:\|([^|]*)\|\s*)?/); if (parts.length >= 3) { for (let i = 0; i + 2 < parts.length; i += 2) { const a = node(parts[i]), b = node(parts[i + 2]); if (a && b) edges.push([a, b, parts[i + 1]]); } } else if (l && !l.startsWith('%%')) node(l); }); const lvl = new Map(); [...nodes.keys()].forEach((k) => lvl.set(k, 0)); for (let it = 0; it < 20; it++) edges.forEach(([a, b]) => { if (lvl.get(b) <= lvl.get(a)) lvl.set(b, lvl.get(a) + 1); }); const rows = {}; nodes.forEach((n, k) => (rows[lvl.get(k)] ||= []).push(n)); const H = dir === 'LR'; Object.entries(rows).forEach(([L, ns]) => ns.forEach((n, i) => { const a = +L * (H ? 190 : 110) + 60, b = (i - (ns.length - 1) / 2) * (H ? 100 : 180); n.x = H ? a : b; n.y = H ? b : a; })); return { nodes, edges }; }
function flowSvg({ nodes, edges }, { fill = '#ECECFF', stroke = '#9370DB', ink = '#333' } = {}) { const xs = [...nodes.values()]; if (!xs.length) return s('svg'); const minX = Math.min(...xs.map((n) => n.x)) - 90, maxX = Math.max(...xs.map((n) => n.x)) + 90, minY = Math.min(...xs.map((n) => n.y)) - 40, maxY = Math.max(...xs.map((n) => n.y)) + 40; const svg = s('svg', { viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`, style: 'max-width:100%;max-height:100%' }, s('defs', {}, s('marker', { id: 'ar', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, s('path', { d: 'M0 0L10 5L0 10z', fill: ink })))); edges.forEach(([a, b, lab]) => { const A = nodes.get(a), B = nodes.get(b); const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1; svg.append(s('line', { x1: A.x + (dx / d) * 40, y1: A.y + (dy / d) * 24, x2: B.x - (dx / d) * 44, y2: B.y - (dy / d) * 26, stroke: ink, 'stroke-width': 1.5, 'marker-end': 'url(#ar)' })); if (lab) svg.append(s('text', { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, 'text-anchor': 'middle', 'font-size': 12, fill: ink, style: 'paint-order:stroke;stroke:#fff;stroke-width:4px' }, lab)); }); nodes.forEach((n) => { const w = Math.max(70, n.label.length * 8 + 24); const sh = n.shape === 'diamond' ? s('polygon', { points: `${n.x},${n.y - 32} ${n.x + w / 2 + 6},${n.y} ${n.x},${n.y + 32} ${n.x - w / 2 - 6},${n.y}`, fill, stroke }) : s('rect', { x: n.x - w / 2, y: n.y - 20, width: w, height: 40, rx: n.shape === 'round' ? 20 : 4, fill, stroke }); svg.append(sh, s('text', { x: n.x, y: n.y + 5, 'text-anchor': 'middle', 'font-size': 14, fill: ink, 'font-family': 'trebuchet ms,verdana,arial' }, n.label)); }); return svg; }
V['mermaid-dualpane-live-editor'] = (root, T) => {
  theme(root, T, { bg: '#1e1e2e', fg: '#ddd', ac: '#ff3670', dark: true });
  const out = h('div', { style: { display: 'grid', placeItems: 'center', height: '100%', padding: '40px', boxSizing: 'border-box', background: '#fff', backgroundImage: 'radial-gradient(#ddd 1px,transparent 1px)', backgroundSize: '16px 16px' } }); const err = h('div', { style: { color: '#f66', fontSize: '12px', padding: '4px 10px', minHeight: '18px' } });
  const render = (v) => { try { out.replaceChildren(flowSvg(flow(v))); err.textContent = ''; } catch (e) { err.textContent = e.message; } };
  const ed = editor('flowchart TD\n  A[Christmas] -->|Get money| B(Go shopping)\n  B --> C{Let me think}\n  C -->|One| D[Laptop]\n  C -->|Two| E[iPhone]\n  C -->|Three| F[fa:fa-car Car]', render, { bg: '#1e1e2e' });
  const modal = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '400px', background: '#fff', color: '#222', borderRadius: '12px', padding: '22px', boxShadow: '0 20px 60px #0008', zIndex: 5, display: 'grid', gap: '10px' } }, h('div', { style: { width: '34px', height: '34px', background: '#ff3670', borderRadius: '8px', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900 } }, 'M'), h('b', { style: { fontSize: '18px' } }, 'Try the full Mermaid-ish experience'), ...['AI diagram generation', 'Visual drag-and-drop editing', 'Unlimited diagram storage', 'Real-time collaboration'].map((t) => h('div', { style: { border: '1px solid #eee', borderRadius: '8px', padding: '10px', fontSize: '13px' } }, '✦ ' + t)), h('div.k-row', {}, h('button', { style: { background: '#ff3670', color: '#fff', border: 0, padding: '9px 14px', borderRadius: '6px' }, onclick: () => modal.remove() }, 'Start free trial'), h('button', { style: { background: '#fff', border: '1px solid #ccc', padding: '9px 14px', borderRadius: '6px' }, onclick: () => modal.remove() }, 'Stay on playground')));
  root.style.display = 'grid'; root.style.gridTemplateRows = '44px 1fr'; root.style.gridTemplateColumns = '420px 1fr';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', background: '#ff3670', color: '#fff', padding: '0 14px', gap: '14px' } }, h('b', {}, 'Mermaid-ish Live Editor'), h('span', { style: { flex: 1 } }), select(['Flowchart', 'Sequence', 'Class'], 'Flowchart', () => {}), btn('Copy SVG', () => copy(out.innerHTML)), btn('PNG', () => toast('diagram.png'))), h('div', { style: { display: 'grid', gridTemplateRows: '30px 1fr 22px 160px' } }, h('div.k-row', { style: { padding: '0 10px', fontSize: '12px', background: '#181825' } }, h('b', {}, 'Code'), 'Config'), ed, err, h('div', { style: { background: '#181825', padding: '10px', fontSize: '12px', display: 'grid', gap: '6px' } }, h('b', {}, 'Sample Diagrams'), ...['Flowchart', 'Sequence', 'Class', 'State', 'Gantt'].map((t) => h('span', { style: { opacity: .7 } }, '▸ ' + t)))), h('div', { style: { position: 'relative' } }, out), modal);
  render(ed.ta.value);
  window.__demoProof = async () => { ed.set(ed.ta.value + '\n  D --> G[Ship it]'); return 'edited code → diagram re-rendered (promo modal shown)'; };
};
// ---- markmap
V['markdown-mindmap-dualpane'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', ac: '#1a73e8', dark: false });
  const COLS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#bcbd22'];
  const svg = s('svg', { style: 'width:100%;height:100%' }); const folded = new Set();
  const parse = (md) => { const rootN = { t: 'markmap', c: [], d: 0 }; const st = [rootN]; md.split('\n').forEach((l) => { const m = l.match(/^(#{1,6})\s+(.*)/) || l.match(/^(\s*)[-*]\s+(.*)/); if (!m) return; const d = m[1].startsWith('#') ? m[1].length : 7 + m[1].length / 2; const n = { t: m[2], c: [], d }; while (st.length > 1 && st[st.length - 1].d >= d) st.pop(); st[st.length - 1].c.push(n); st.push(n); }); return rootN.c.length === 1 ? rootN.c[0] : rootN; };
  const render = (md) => { const tr = parse(md); let y = 0; const lay = (n, x, depth, col) => { n.x = x; n.col = col; const kids = folded.has(n.t) ? [] : n.c; if (!kids.length) { n.y = y; y += 30; } else { kids.forEach((k, i) => lay(k, x + 40 + n.t.length * 7.5, depth + 1, depth === 0 ? COLS[i % 8] : col)); n.y = (kids[0].y + kids[kids.length - 1].y) / 2; } }; lay(tr, 20, 0, COLS[0]); const els = []; const walk = (n) => { const kids = folded.has(n.t) ? [] : n.c; const w = n.t.length * 7.5; kids.forEach((k) => { els.push(s('path', { d: `M${n.x + w} ${n.y}C${n.x + w + 20} ${n.y} ${k.x - 20} ${k.y} ${k.x} ${k.y}`, fill: 'none', stroke: k.col, 'stroke-width': 2 })); walk(k); }); els.push(s('line', { x1: n.x, y1: n.y, x2: n.x + w, y2: n.y, stroke: n.col, 'stroke-width': 2 }), s('text', { x: n.x + 2, y: n.y - 5, 'font-size': 13, fill: '#333', style: 'cursor:pointer' }, n.t), n.c.length ? s('circle', { cx: n.x + w, cy: n.y, r: 4, fill: folded.has(n.t) ? n.col : '#fff', stroke: n.col, 'stroke-width': 1.5, style: 'cursor:pointer', onclick: () => { folded.has(n.t) ? folded.delete(n.t) : folded.add(n.t); render(ed.ta.value); } }) : null); }; walk(tr); const g = s('g', { transform: `translate(20 ${Math.max(20, 300 - y / 2)})` }, ...els); svg.replaceChildren(g); };
  const ed = editor('---\ntitle: markmap\n---\n\n## Links\n\n- Website\n- GitHub\n\n## Related Projects\n\n- coc-markmap\n- markmap-vscode\n- eaf-markmap\n\n## Features\n\nNote that if blocks and lists appear at the same level, the lists will be ignored.\n\n### Lists\n\n- **strong** ~~del~~ *italic*\n- `inline code`\n- [x] checkbox\n- Katex\n  - normal\n  - block\n- Now we can wrap very long text\n\n### Blocks\n\n- code block\n- table', (v) => render(v), { bg: '#fff', fg: '#333', gutter: '#aaa' });
  root.style.display = 'grid'; root.style.gridTemplateRows = '34px 26px 1fr'; root.style.gridTemplateColumns = '1fr 1fr';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', padding: '0 14px', fontSize: '13px', gap: '16px', borderBottom: '1px solid #eee' } }, h('b', {}, 'markmap-ish'), 'Docs', 'Try it out', h('span', { style: { flex: 1 } }), h('span', { style: { background: '#fce4ec', color: '#c2185b', padding: '2px 8px', borderRadius: '4px' } }, 'Download as interactive HTML')), h('div.k-row', { style: { gridColumn: '1/-1', padding: '0 14px', fontSize: '11px', gap: '12px', color: '#1a73e8', background: '#f7f9fc' } }, 'Basic', 'Use with frontmatter', 'Load plugin', 'Colors', 'Folding'), h('div', { style: { borderRight: '1px solid #eee', overflow: 'hidden' } }, ed), h('div', { style: { overflow: 'hidden' } }, svg));
  render(ed.ta.value);
  window.__demoProof = async () => { ed.set(ed.ta.value + '\n- chart'); return 'markdown edit re-rendered mindmap'; };
};
// ---- markwhen
V['markdown-timeline-workspace'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', ac: '#4b8f3b', dark: false });
  const tl = h('div', { style: { position: 'relative', height: '100%', overflow: 'hidden' } });
  const COL = { design: '#7c3aed', build: '#0ea5e9', launch: '#16a34a', ops: '#f59e0b' };
  const render = (v) => { const ev = []; v.split('\n').forEach((l) => { const m = l.match(/^(\d{4}-\d{2})(?:\/(\d{4}-\d{2}))?:\s*(.+?)(?:\s+#(\w+))?$/); if (m) ev.push({ a: new Date(m[1]), b: new Date(m[2] || m[1]), t: m[3], tag: m[4] }); }); if (!ev.length) { tl.replaceChildren(); return; } const t0 = Math.min(...ev.map((e) => +e.a)), t1 = Math.max(...ev.map((e) => +e.b)) + 30 * 864e5; const X = (d) => ((d - t0) / (t1 - t0)) * 92 + 4; const months = []; for (let d = new Date(t0); +d < t1; d.setMonth(d.getMonth() + 1)) months.push(new Date(d)); tl.replaceChildren(...months.map((m) => h('div', { style: { position: 'absolute', left: X(+m) + '%', top: 0, bottom: 0, borderLeft: '1px solid #eee', fontSize: '11px', color: '#999', paddingLeft: '4px' } }, m.toLocaleString('en', { month: 'short' }) + (m.getMonth() === 0 ? ' ' + m.getFullYear() : ''))), ...ev.map((e, i) => h('div', { style: { position: 'absolute', left: X(+e.a) + '%', width: Math.max(0.8, X(+e.b + 30 * 864e5) - X(+e.a)) + '%', top: 40 + i * 44 + 'px', height: '26px', background: (COL[e.tag] || '#64748b') + '33', borderLeft: '3px solid ' + (COL[e.tag] || '#64748b'), borderRadius: '4px', fontSize: '12px', padding: '4px 8px', whiteSpace: 'nowrap' } }, e.t, e.tag ? h('span', { style: { color: COL[e.tag], marginLeft: '6px' } }, '#' + e.tag) : null))); };
  const ed = editor('title: Product roadmap\n\n2026-01/2026-03: Discovery & research #design\n2026-02/2026-04: Design system v2 #design\n2026-03/2026-07: Build core app #build\n2026-05: Private beta #launch\n2026-06/2026-08: Performance work #ops\n2026-08: Public launch 🚀 #launch\n2026-09/2026-11: Mobile apps #build', render, { bg: '#fafafa', fg: '#333', gutter: '#aaa' });
  root.style.display = 'grid'; root.style.gridTemplateColumns = '220px 380px 1fr'; root.style.gridTemplateRows = '34px 1fr';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', padding: '0 12px', fontSize: '12px', gap: '14px', borderBottom: '1px solid #eee' } }, 'File', 'Edit', 'View', 'Help', h('span', { style: { flex: 1 } }), seg(['Timeline', 'Calendar', 'Resume'], 'Timeline', () => {})), h('div', { style: { borderRight: '1px solid #eee', padding: '12px', fontSize: '12px', display: 'grid', gap: '8px', alignContent: 'start', color: '#555' } }, h('b', { style: { color: '#4b8f3b', fontSize: '16px' } }, '▲ Markwhen-ish'), '▸ roadmap.mw', '▸ launch.mw', '▸ personal.mw', h('div', { style: { marginTop: '10px', opacity: .6 } }, 'Tags'), ...Object.entries(COL).map(([k, c]) => h('span', { style: { color: c } }, '# ' + k))), h('div', { style: { borderRight: '1px solid #eee', overflow: 'hidden' } }, ed), tl);
  render(ed.ta.value);
  window.__demoProof = async () => { ed.set(ed.ta.value + '\n2026-12: Year review #ops'); return 'timeline re-rendered from markdown'; };
};
// ---- regex
V['regex-visual-lab'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#16a34a', dark: false });
  let pat = '([A-Z])\\w+', flags = 'g';
  const rail = h('div', { style: { minHeight: '110px', display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto', padding: '10px' } }); const hi = h('div', { style: { font: `14px/1.8 ${MONO}`, whiteSpace: 'pre-wrap' } }); const info = h('div', { style: { fontSize: '12px' } });
  const text = 'Hello World!\nRegex Vis is a powerful online regular expression tester.\nTest your patterns here with sample text.\nThe fox ran on Monday.';
  const tok = (p) => { const out = []; let i = 0; while (i < p.length) { let c = p[i]; if (c === '(') { let d = 1, j = i + 1; while (j < p.length && d) { if (p[j] === '(') d++; if (p[j] === ')') d--; j++; } out.push({ k: 'group', v: p.slice(i + 1, j - 1) }); i = j; } else if (c === '[') { const j = p.indexOf(']', i); out.push({ k: 'set', v: p.slice(i, j + 1) }); i = j + 1; } else if (c === '\\') { out.push({ k: 'esc', v: p.slice(i, i + 2) }); i += 2; } else { out.push({ k: 'lit', v: c }); i++; } if (/[*+?]/.test(p[i] || '')) { out[out.length - 1].q = p[i]; i++; } } return out; };
  const box = (t) => { const lab = { '\\w': 'word', '\\d': 'digit', '\\s': 'space', '.': 'any char' }[t.v] || t.v; const col = t.k === 'group' ? '#16a34a' : t.k === 'set' ? '#f59e0b' : t.k === 'esc' ? '#0ea5e9' : '#64748b'; const el = t.k === 'group' ? h('div', { style: { border: `2px dashed ${col}`, borderRadius: '6px', padding: '14px 6px 6px', position: 'relative', display: 'flex', alignItems: 'center' } }, h('span', { style: { position: 'absolute', top: '-2px', left: '6px', fontSize: '10px', color: col } }, 'Group #1'), ...tok(t.v).map(box)) : h('div', { style: { background: col, color: '#fff', borderRadius: '4px', padding: '6px 10px', font: `12px ${MONO}` } }, lab); return h('div', { style: { display: 'flex', alignItems: 'center' } }, h('div', { style: { width: '22px', height: '2px', background: '#999' } }), t.q ? h('div', { style: { position: 'relative', padding: '0 0 14px' } }, el, h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '12px', border: '2px solid #999', borderTop: 0, borderRadius: '0 0 8px 8px', fontSize: '9px', textAlign: 'center', color: '#666' } }, t.q === '+' ? '1+ times' : t.q === '*' ? '0+ times' : 'optional')) : el); };
  const run = () => { let re; try { re = new RegExp(pat, flags.includes('g') ? flags : flags + 'g'); } catch (e) { info.textContent = '⚠ ' + e.message; return; } rail.replaceChildren(h('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' } }), ...tok(pat).map(box), h('div', { style: { width: '22px', height: '2px', background: '#999' } }), h('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' } })); const parts = []; let last = 0, n = 0; for (const m of text.matchAll(re)) { if (!m[0]) break; parts.push(text.slice(last, m.index), h('mark', { style: { background: n % 2 ? '#bbf7d0' : '#86efac', borderRadius: '3px' } }, m[0])); last = m.index + m[0].length; n++; } parts.push(text.slice(last)); hi.replaceChildren(...parts); info.textContent = `${n} matches`; };
  const inp = h('input', { value: pat, oninput: (e) => { pat = e.target.value; run(); }, style: { flex: 1, font: `16px ${MONO}`, border: 0, outline: 'none' } });
  root.style.overflow = 'auto';
  root.append(h('div.k-row', { style: { height: '48px', padding: '0 20px', borderBottom: '1px solid #eee', gap: '16px', fontSize: '13px' } }, h('b', { style: { background: '#16a34a', color: '#fff', padding: '4px 8px', borderRadius: '4px' } }, 'RegexVis-ish'), h('span', { style: { flex: 1 } }), 'Reference', 'Library', 'Challenges', 'Blog'), h('div', { style: { padding: '14px 30px', display: 'grid', gap: '12px' } }, h('div', { style: { fontSize: '13px', opacity: .7 } }, 'Test and debug JavaScript regex with a live railroad diagram, match highlighting and explanations.'), h('div.k-row', { style: { border: '2px solid #16a34a', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 0 0 4px #16a34a22' } }, h('span', { style: { color: '#999', font: `16px ${MONO}` } }, '/'), inp, h('span', { style: { color: '#999', font: `16px ${MONO}` } }, '/'), h('input', { value: flags, oninput: (e) => { flags = e.target.value; run(); }, style: { width: '40px', font: `16px ${MONO}`, border: 0, color: '#16a34a' } })), h('div', { style: { border: '1px solid #eee', borderRadius: '8px' } }, h('div', { style: { padding: '6px 10px', fontSize: '12px', borderBottom: '1px solid #eee' } }, 'Railroad Diagram'), rail), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } }, h('div', { style: { border: '1px solid #eee', borderRadius: '8px', padding: '10px' } }, h('div.k-row', { style: { fontSize: '12px', marginBottom: '6px' } }, h('b', {}, 'Test String'), h('span', { style: { flex: 1 } }), info), hi), h('div', { style: { border: '1px solid #eee', borderRadius: '8px', padding: '10px', fontSize: '12px', lineHeight: 1.8 } }, h('b', {}, 'Explanation'), h('div', {}, '( ) capturing group #1'), h('div', {}, '[A-Z] one uppercase letter'), h('div', {}, '\\w+ word character, one or more'), h('div', {}, 'g global — find all matches')))));
  run();
  window.__demoProof = async () => 'regex matched with live railroad diagram';
};
// ---- strudel
V['strudel-tidal-repl-stage'] = (root, T) => {
  theme(root, T, { bg: '#161616', fg: '#ddd', ac: '#e6c229', dark: true });
  let code = 's("bd sd [~ bd] sd, hh*8").bank("tr909")\n  .gain(.9)\n\nnote("c3 eb3 g3 bb3").s("sawtooth").lpf(800)', playing = false, step = 0, tmr = null;
  const viz = h('div', { style: { display: 'grid', gap: '4px', padding: '10px' } });
  const parse = () => { const tracks = []; for (const m of code.matchAll(/s\("([^"]+)"\)/g)) m[1].split(',').forEach((p) => tracks.push({ kind: 'drum', seq: expand(p.trim()) })); for (const m of code.matchAll(/note\("([^"]+)"\)/g)) tracks.push({ kind: 'note', seq: expand(m[1]) }); return tracks; };
  const expand = (p) => { const out = []; p.replace(/\[([^\]]+)\]/g, (_, x) => x.replace(/\s+/g, '|')).split(/\s+/).forEach((t) => { const m = t.match(/^(.+)\*(\d+)$/); if (m) for (let i = 0; i < +m[2]; i++) out.push(m[1]); else out.push(t); }); return out; };
  const tick = () => { const tr = parse(); tr.forEach((t) => { const n = t.seq[step % t.seq.length]; if (!n || n === '~') return; n.split('|').forEach((x) => { if (x === '~') return; if (t.kind === 'drum') drum(x.startsWith('bd') ? 'kick' : x.startsWith('sd') ? 'snare' : 'hat'); else { const m = x.match(/([a-g])(b|#)?(\d)/); if (m) { const b = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[m[1]] + (m[2] === 'b' ? -1 : m[2] === '#' ? 1 : 0); blip(midi(12 * (+m[3] + 1) + b), 0.18, 'sawtooth', 0.05); } } }); }); viz.replaceChildren(...tr.map((t) => h('div', { style: { display: 'flex', gap: '3px' } }, t.seq.map((n, i) => h('div', { style: { flex: 1, height: '16px', background: n === '~' ? '#222' : i === step % t.seq.length ? '#e6c229' : '#555', borderRadius: '2px' } }))))); step++; };
  const play = () => { playing = !playing; clearInterval(tmr); if (playing) tmr = setInterval(tick, 150); pb.textContent = playing ? '■ stop' : '▶ play'; };
  const ed = editor(code, (v) => (code = v), { bg: '#161616', fg: '#e8e8e8', gutter: '#555', size: 15, lh: 24 }); ed.onRun = play; ed.style.gridColumn = '1'; ed.style.gridRow = '2'; viz.style.gridColumn = '1'; viz.style.gridRow = '3';
  const pb = h('button', { style: { background: 'none', border: 0, color: '#e6c229', fontSize: '13px' }, onclick: play }, '▶ play');
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 420px'; root.style.gridTemplateRows = '40px 1fr 90px';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', padding: '0 14px', fontSize: '13px', gap: '16px' } }, h('b', { style: { color: '#e6c229' } }, '🌀 strudel-ish'), h('span', { style: { opacity: .5 } }, 'REPL'), h('span', { style: { flex: 1 } }), pb, '⟳ update', '🎲 shuffle', '↗ share', '? learn'), ed, h('div', { style: { gridRow: '2/4', gridColumn: 2, background: '#222', padding: '14px', fontSize: '13px', lineHeight: 1.6, overflow: 'auto' } }, h('div.k-row', { style: { gap: '12px', fontSize: '12px', opacity: .7, marginBottom: '10px' } }, h('u', {}, 'welcome'), 'patterns', 'sounds', 'reference', 'export', 'console', 'settings'), h('b', {}, 'welcome'), h('p', {}, 'You have found strudel-ish, a live coding playground to write dynamic music pieces in the browser. Press ctrl+enter to play, ctrl+. to stop.'), h('p', {}, 'Mini-notation: spaces split steps, [ ] subdivides, ~ is a rest, *n repeats, commas stack patterns.'), h('b', {}, 'about'), h('p', {}, 'A port of the Tidal pattern language to JavaScript — this demo implements s(), note(), and the core mini-notation with WebAudio.')), viz);
  window.__demoProof = async () => { for (let i = 0; i < 5; i++) tick(); return 'mini-notation parsed; step visualizer advanced'; };
};
// ---- p5 editor
const P5SHIM = `<script>let _c,_g,_fill='#fff',_stroke='#000',_noStroke=false,_noFill=false,frameCount=0,mouseX=0,mouseY=0,width=0,height=0,PI=Math.PI,TWO_PI=Math.PI*2;
function createCanvas(w,h){_c=document.createElement('canvas');_c.width=width=w;_c.height=height=h;document.body.appendChild(_c);_g=_c.getContext('2d');_c.onmousemove=e=>{mouseX=e.offsetX;mouseY=e.offsetY}}
const col=(a,b,c,d)=>typeof a==='string'?a:b===undefined?\`rgb(\${a},\${a},\${a})\`:c===undefined?\`rgba(\${a},\${a},\${a},\${b/255})\`:\`rgba(\${a},\${b},\${c},\${d===undefined?1:d/255})\`;
function background(...a){_g.fillStyle=col(...a);_g.fillRect(0,0,width,height)}function fill(...a){_noFill=false;_fill=col(...a)}function stroke(...a){_noStroke=false;_stroke=col(...a)}function noStroke(){_noStroke=true}function noFill(){_noFill=true}function strokeWeight(w){_g.lineWidth=w}
function _p(){if(!_noFill){_g.fillStyle=_fill;_g.fill()}if(!_noStroke){_g.strokeStyle=_stroke;_g.stroke()}}
function ellipse(x,y,w,h=w){_g.beginPath();_g.ellipse(x,y,w/2,h/2,0,0,7);_p()}function circle(x,y,d){ellipse(x,y,d)}function rect(x,y,w,h=w){_g.beginPath();_g.rect(x,y,w,h);_p()}function line(a,b,c,d){_g.beginPath();_g.moveTo(a,b);_g.lineTo(c,d);if(!_noStroke){_g.strokeStyle=_stroke;_g.stroke()}}
const sin=Math.sin,cos=Math.cos,random=(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a),map=(v,a,b,c,d)=>c+(v-a)/(b-a)*(d-c),noise=(x,y=0)=>(Math.sin(x*1.7+y*3.1)+Math.sin(x*0.6-y*1.3))/4+.5;
function translate(x,y){_g.translate(x,y)}function rotate(a){_g.rotate(a)}function push(){_g.save()}function pop(){_g.restore()}
window.onerror=(m)=>{parent.postMessage({p5err:String(m)},'*')};
addEventListener('load',()=>{if(window.setup)setup();(function L(){frameCount++;if(window.draw){_g&&_g.setTransform(1,0,0,1,0,0);draw()}requestAnimationFrame(L)})()});<\/script>`;
V['creative-code-ide'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', ac: '#ed225d', dark: false });
  let code = 'function setup() {\n  createCanvas(400, 400);\n}\n\nfunction draw() {\n  background(220);\n  noStroke();\n  for (let i = 0; i < 12; i++) {\n    fill(237, 34, 93, 120);\n    let a = frameCount * 0.02 + i * TWO_PI / 12;\n    circle(200 + cos(a) * 120, 200 + sin(a) * 120, 60);\n  }\n  fill(40);\n  circle(mouseX, mouseY, 24);\n}';
  const frame = h('iframe', { sandbox: 'allow-scripts', style: { border: 0, width: '100%', height: '100%', background: '#fff' } }); const con = h('pre', { style: { margin: 0, padding: '6px 10px', font: `12px ${MONO}`, color: '#c00', background: '#f4f4f4', height: '100%', overflow: 'auto' } }, '');
  addEventListener('message', (e) => { if (e.data?.p5err) con.textContent = '🌸 p5-ish says: ' + e.data.p5err; });
  const run = () => { con.textContent = ''; frame.srcdoc = `<body style="margin:0">${P5SHIM}<script>${code}<\/script></body>`; }; let auto = false;
  const ed = editor(code, (v) => { code = v; if (auto) run(); }, { bg: '#fff', fg: '#333', gutter: '#aaa' }); ed.onRun = run;
  root.style.display = 'grid'; root.style.gridTemplateRows = '26px 50px 1fr 120px'; root.style.gridTemplateColumns = '1fr 1fr';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', background: '#ed225d', color: '#fff', padding: '0 10px', fontSize: '12px', gap: '14px' } }, h('b', {}, 'p5*-ish'), 'File', 'Edit', 'Sketch', 'Help', h('span', { style: { flex: 1 } }), 'Log in', 'or', 'Sign up'), h('div.k-row', { style: { gridColumn: '1/-1', padding: '0 14px', gap: '10px', borderBottom: '1px solid #ddd' } }, h('button', { style: { width: '36px', height: '36px', borderRadius: '50%', background: '#ed225d', color: '#fff', border: 0 }, onclick: run }, '▶'), h('button', { style: { width: '36px', height: '36px', borderRadius: '50%', background: '#fff', border: '1px solid #aaa' }, onclick: () => (frame.srcdoc = '') }, '■'), toggle('Auto-refresh', false, (v) => (auto = v)), h('span', { style: { fontSize: '13px' } }, 'Graceful kaleidoscope ✎'), h('span', { style: { flex: 1 } }), '⚙'), h('div', { style: { borderRight: '1px solid #ddd', display: 'grid', gridTemplateRows: '28px 1fr' } }, h('div', { style: { fontSize: '12px', padding: '6px 10px', background: '#f4f4f4' } }, 'sketch.js'), ed), h('div', { style: { display: 'grid', gridTemplateRows: '28px 1fr' } }, h('div', { style: { fontSize: '12px', padding: '6px 10px', background: '#f4f4f4' } }, 'Preview'), frame), h('div', { style: { gridColumn: '1/-1', borderTop: '1px solid #ddd', display: 'grid', gridTemplateRows: '24px 1fr' } }, h('div', { style: { fontSize: '12px', padding: '4px 10px' } }, 'Console'), con));
  run();
  window.__demoProof = async () => { await sleep(500); return 'sketch running in sandboxed preview'; };
};
// ---- css-doodle
V['css-doodle-playground'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', ac: '#000', dark: false });
  let code = '@grid: 1 / 8em;\n@place-cell: center;\n\n:doodle {\n  background: #0a0a1f;\n}\n\n@size: calc(@i * 1.6%);\n@count: 60;\nborder: 1px solid #c3d8ff;\ntransform: rotate(calc(@i * 5deg));\nopacity: calc(1 - @i / 90);';
  const stage = h('div', { style: { width: '460px', height: '460px', position: 'relative', overflow: 'hidden', background: '#0a0a1f' } });
  const render = () => { const n = +(code.match(/@count:\s*(\d+)/)?.[1] || 40); const rot = +(code.match(/rotate\(calc\(@i \* ([\d.]+)deg/)?.[1] || 5); const sz = +(code.match(/@size: calc\(@i \* ([\d.]+)%/)?.[1] || 1.6); const bc = code.match(/border:\s*[^;]*?(#[0-9a-f]{3,6})/i)?.[1] || '#fff'; const bg = code.match(/background:\s*(#[0-9a-f]{3,6})/i)?.[1] || '#000'; stage.style.background = bg; stage.replaceChildren(...Array.from({ length: n }, (_, i) => h('div', { style: { position: 'absolute', left: '50%', top: '50%', width: (i + 1) * sz + '%', height: (i + 1) * sz + '%', border: '1px solid ' + bc, transform: `translate(-50%,-50%) rotate(${(i + 1) * rot}deg)`, opacity: 1 - i / 90 } }))); };
  const ed = editor(code, (v) => { code = v; render(); }, { bg: '#fff', fg: '#2a52be', gutter: '#bbb', size: 14, lh: 22 });
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 1fr'; root.style.gridTemplateRows = '44px 1fr 30px';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', padding: '0 14px' } }, h('b', {}, '▣ css-doodle-ish'), h('span', { style: { flex: 1 } }), h('span', { style: { background: '#000', color: '#fff', padding: '3px 10px', borderRadius: '99px', fontSize: '12px' } }, 'Share'), h('span', { style: { background: '#444', color: '#fff', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', marginLeft: '6px' } }, 'Export')), h('div', { style: { borderRight: '1px solid #eee' } }, ed), h('div', { style: { display: 'grid', placeItems: 'center' } }, stage), h('div.k-row', { style: { gridColumn: '1/-1', fontSize: '11px', padding: '0 14px', borderTop: '1px solid #eee', gap: '12px', opacity: .6 } }, 'Examples', 'Docs', h('span', { style: { flex: 1 } }), 'Cmd+S to save'));
  render();
  window.__demoProof = async () => 'nested rotated squares rendered from doodle rules';
};
// ---- twigl
V['tweet-glsl-livecode-stage'] = (root, T) => {
  theme(root, T, { bg: '#111', fg: '#ddd', ac: '#1f7aff', dark: true });
  const head = 'precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;\n';
  let code = 'void main(){vec2 p=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);vec3 c=vec3(0);for(float i=0.;i<6.;i++){p=abs(p)/dot(p,p)-vec2(.9,.6+.1*sin(t*.3));c+=vec3(.9,.8,.2)*exp(-length(p)*6.)+vec3(.1,.2,.9)*exp(-abs(p.y)*20.);}gl_FragColor=vec4(c,1);}';
  const G = gl(head + code); const err = h('div', { style: { color: '#f55', fontSize: '11px', padding: '2px 8px', height: '16px', overflow: 'hidden' } }); const len = h('b');
  const ed = editor(code, (v) => { code = v; G.compile(head + v); err.textContent = G.err.split('\n')[0]; len.textContent = v.length + ' chars'; }, { bg: '#0d0d0d', fg: '#9cdcfe', gutter: '#444' }); len.textContent = code.length + ' chars';
  const t0 = performance.now(); let paused = false; const loop = () => { if (!paused) G.draw((performance.now() - t0) / 1000); requestAnimationFrame(loop); }; loop();
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 44px 180px'; root.style.gridTemplateRows = '58% 26px 1fr';
  root.append(h('div', { style: { gridColumn: '1/3' } }, G.cv), h('div', { style: { gridRow: '1/4', gridColumn: 3, background: '#1a1a1a', padding: '10px', fontSize: '11px', display: 'grid', gap: '8px', alignContent: 'start' } }, h('b', {}, 'Mode'), select(['classic', 'geek', 'geeker', 'geekest'], 'classic', () => {}), h('b', {}, 'Sound'), toggle('enable', false, () => {}), h('b', {}, 'Export'), btn('Download PNG', () => { const a = h('a', { download: 'twigl.png', href: G.cv.toDataURL() }); a.click(); }, 'pri'), btn('Share link', () => copy(location.href)), h('b', {}, 'Author'), h('span', { style: { opacity: .6 } }, '@you')), h('div.k-row', { style: { gridColumn: '1/3', background: '#1a1a1a', padding: '0 10px', fontSize: '11px', gap: '12px' } }, len, h('span', { style: { opacity: .6 } }, 'fps 60'), h('span', { style: { cursor: 'pointer' }, onclick: () => (paused = !paused) }, '❚❚'), err), h('div', { style: { gridColumn: '1/3', overflow: 'hidden' } }, ed));
  window.__demoProof = async () => { await sleep(300); return 'GLSL compiled & rendering live'; };
};
// ---- hydra
V['hydra-livecode-video-synth'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#fff', ac: '#fff', dark: true });
  let code = 'osc(20, 0.1, 1.2)\n  .rotate(0.6)\n  .kaleid(5)\n  .modulate(noise(3), 0.2)\n  .out()';
  const toGLSL = (c) => { const f = (n, d) => { const m = c.match(new RegExp(n + '\\(([^)]*)\\)')); return m ? m[1].split(',').map((x) => parseFloat(x) || 0).concat(d).slice(0, d.length).map((x, i) => (isNaN(x) ? d[i] : x)) : null; }; const o = f('osc', [60, 0.1, 0]) || [60, 0.1, 0]; const rot = f('rotate', [0]); const kal = f('kaleid', [4]); const mod = f('modulate', [0, 0.1]); const pix = f('pixelate', [20, 20]); return `precision highp float;uniform vec2 r;uniform float t;float h(vec2 p){return fract(sin(dot(p,vec2(12.9,78.2)))*43758.);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),f.x),f.y);}void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv-.5;p.x*=r.x/r.y;${rot ? `float a=${rot[0].toFixed(3)};p=mat2(cos(a),-sin(a),sin(a),cos(a))*p;` : ''}${kal ? `float k=${kal[0].toFixed(1)};float an=atan(p.y,p.x);float rr=length(p);an=mod(an,6.2832/k);an=abs(an-3.1416/k);p=vec2(cos(an),sin(an))*rr;` : ''}${mod ? `p+=(n(p*3.+t*.3)-.5)*${mod[1].toFixed(3)};` : ''}${pix ? `p=floor(p*${pix[0].toFixed(1)})/${pix[0].toFixed(1)};` : ''}float fr=${o[0].toFixed(2)},sp=${o[1].toFixed(3)},of=${o[2].toFixed(3)};vec3 c=vec3(sin((p.x*fr+t*sp*6.28)+of*0.),sin((p.x*fr+t*sp*6.28)+of),sin((p.x*fr+t*sp*6.28)+of*2.))*.5+.5;gl_FragColor=vec4(c,1);}`; };
  const G = gl(toGLSL(code)); G.cv.style.position = 'absolute'; G.cv.style.inset = '0';
  const ta = h('textarea', { spellcheck: false, value: code, style: { position: 'absolute', left: '20px', top: '20px', width: '500px', height: '200px', background: 'transparent', color: '#fff', border: 0, outline: 'none', font: `18px/1.5 ${MONO}`, textShadow: '0 0 4px #000,0 0 8px #000', resize: 'none' }, onkeydown: (e) => { if ((e.ctrlKey || e.metaKey || e.shiftKey) && e.key === 'Enter') { e.preventDefault(); code = ta.value; G.compile(toGLSL(code)); } } });
  const info = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '620px', background: '#000', border: '1px solid #fff', padding: '20px 30px', fontSize: '14px', lineHeight: 1.7 } }, h('div.k-row', { style: { fontSize: '12px', gap: '10px', opacity: .8 } }, 'english', h('b', {}, '한국어'), 'français', '日本語', 'español', h('span', { style: { flex: 1 } }), h('span', { style: { cursor: 'pointer' }, onclick: () => info.remove() }, '✕')), h('div', { style: { fontSize: '26px', marginTop: '12px' } }, '하이드라'), h('div', { style: { opacity: .7 } }, '라이브 코딩 비디오 신스'), h('div', { style: { borderTop: '1px dashed #fff', margin: '12px 0' } }), h('p', {}, '하이드라는 브라우저에서 동작하는 라이브 코딩 비디오 신시사이저입니다. osc(), rotate(), kaleid(), modulate() 같은 함수를 체인으로 연결해 시각을 만들어 보세요.'), h('ol', {}, h('li', {}, '왼쪽 위 코드를 수정합니다'), h('li', {}, 'Ctrl + Shift + Enter 로 실행합니다'), h('li', {}, '✕ 로 이 창을 닫습니다')), h('div', { style: { borderTop: '1px dashed #fff', margin: '12px 0' } }), h('p', { style: { opacity: .7, fontSize: '12px' } }, 'Hydra-ish · functions translate to a GLSL fragment shader in real time.'));
  const t0 = performance.now(); const loop = () => { G.draw((performance.now() - t0) / 1000); requestAnimationFrame(loop); }; loop();
  root.append(G.cv, ta, h('div.k-row', { style: { position: 'absolute', right: '16px', top: '14px', gap: '12px', fontSize: '18px' } }, h('span', { style: { cursor: 'pointer' }, onclick: () => { code = ta.value; G.compile(toGLSL(code)); } }, '▶'), h('span', { style: { cursor: 'pointer' }, onclick: () => { ta.value = pick(['osc(40,0.05,1.5).kaleid(7).out()', 'osc(10,0.2,0.8).rotate(1.2).pixelate(24,24).out()', 'osc(30,0.1,2).modulate(noise(4),0.4).kaleid(3).out()']); code = ta.value; G.compile(toGLSL(code)); } }, '🎲'), '📷', '?'), info);
  window.__demoProof = async () => { await sleep(300); return 'osc→rotate→kaleid chain compiled to shader (info panel shown)'; };
};
// ---- textmode
V['textmode-livecode-stage'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#111', ac: '#111', dark: false });
  let code = '// textmode-ish: return a char per cell\n// (x, y, t, cols, rows) => string\n\nconst density = " .:-=+*#%@";\n\nreturn (x, y, t) => {\n  const d = Math.sin(x * 0.18 + t) * Math.cos(y * 0.3 - t * 0.7);\n  const i = Math.floor((d * 0.5 + 0.5) * (density.length - 1));\n  return density[i];\n};';
  let fn = null; const out = h('pre', { style: { margin: 0, font: `11px/12px ${MONO}`, color: '#111', overflow: 'hidden', height: '100%' } }); const err = h('div', { style: { color: '#c00', fontSize: '11px', minHeight: '14px' } });
  const comp = () => { try { fn = new Function(code)(); err.textContent = ''; } catch (e) { err.textContent = e.message; } };
  const C = 110, R = 64; const t0 = performance.now(); const loop = () => { const t = (performance.now() - t0) / 1000; if (fn) { let s2 = ''; try { for (let y = 0; y < R; y++) { for (let x = 0; x < C; x++) s2 += fn(x, y, t, C, R) || ' '; s2 += '\n'; } out.textContent = s2; } catch (e) { err.textContent = e.message; } } requestAnimationFrame(loop); };
  const ed = editor(code, (v) => { code = v; comp(); }, { bg: '#fff', fg: '#333', gutter: '#bbb', size: 12, lh: 18 });
  root.style.display = 'grid'; root.style.gridTemplateColumns = '1fr 520px 150px';
  root.append(h('div', { style: { padding: '6px', overflow: 'hidden' } }, out), h('div', { style: { display: 'grid', gridTemplateRows: '1fr 20px', borderLeft: '1px solid #eee' } }, ed, err), h('div', { style: { background: '#000', color: '#ccc', padding: '10px', fontSize: '11px', display: 'grid', gap: '4px', alignContent: 'start', fontFamily: MONO } }, h('b', { style: { color: '#fff' } }, 'textmode-ish'), '▸ Examples', ...['plasma', 'rain', 'donut', 'noise field', 'spiral', 'life', 'wave'].map((n) => h('span', { style: { opacity: .7 } }, '  ' + n)), h('br'), '▸ Settings', '  font 11px', '  cols 110', h('br'), btn('Export .txt', () => copy(out.textContent))));
  comp(); loop();
  window.__demoProof = async () => 'ASCII field rendered from live function';
};
// ---- turtletoy
V['turtle-plotter-livecode'] = (root, T) => {
  theme(root, T, { bg: '#262a30', fg: '#ddd', ac: '#1db954', dark: true });
  let code = '// You can find the Turtle API reference here: https://turtletoy.net/syntax\nCanvas.setpenopacity(1);\n\n// Global code will be evaluated once.\nconst turtle = new Turtle();\nturtle.penup();\nturtle.goto(-50,-20);\nturtle.pendown();\n\n// The walk function will be called until it returns false.\nfunction walk(i) {\n    turtle.forward(100);\n    turtle.right(144);\n    return i < 4;\n}';
  const cv = h('canvas', { width: 512, height: 512, style: { width: '100%', aspectRatio: '1', background: '#fff' } }); const err = h('div', { style: { color: '#f66', fontSize: '12px' } });
  const run = () => { const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 512); g.strokeStyle = '#000'; g.lineWidth = 1; class Turtle { constructor() { this.x = 0; this.y = 0; this.a = 0; this.d = true; } forward(n) { const nx = this.x + Math.cos(this.a) * n, ny = this.y + Math.sin(this.a) * n; if (this.d) { g.beginPath(); g.moveTo(256 + this.x * 2.56, 256 + this.y * 2.56); g.lineTo(256 + nx * 2.56, 256 + ny * 2.56); g.stroke(); } this.x = nx; this.y = ny; } backward(n) { this.forward(-n); } right(d) { this.a += (d * Math.PI) / 180; } left(d) { this.right(-d); } penup() { this.d = false; } pendown() { this.d = true; } goto(x, y) { if (Array.isArray(x)) [x, y] = x; if (this.d) { g.beginPath(); g.moveTo(256 + this.x * 2.56, 256 + this.y * 2.56); g.lineTo(256 + x * 2.56, 256 + y * 2.56); g.stroke(); } this.x = x; this.y = y; } jump(x, y) { this.penup(); this.goto(x, y); this.pendown(); } setheading(d) { this.a = (d * Math.PI) / 180; } circle(r) { for (let i = 0; i < 36; i++) { this.forward((2 * Math.PI * r) / 36); this.left(10); } } } const Canvas = { setpenopacity: (o) => (g.globalAlpha = Math.abs(o)) }; try { const walk = new Function('Turtle', 'Canvas', code + '\n;return typeof walk==="function"?walk:null')(Turtle, Canvas); if (walk) for (let i = 0; i < 20000 && walk(i) !== false; i++); err.textContent = ''; } catch (e) { err.textContent = e.message; } };
  const ed = editor(code, (v) => (code = v), { bg: '#1e2227', fg: '#c5c8c6', gutter: '#555' }); ed.onRun = run;
  root.style.display = 'grid'; root.style.gridTemplateColumns = '420px 1fr'; root.style.gridTemplateRows = '44px 1fr';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', padding: '0 16px', gap: '16px', fontSize: '13px' } }, h('b', { style: { fontSize: '18px' } }, 'Turtletoy-ish'), 'Browse', h('b', {}, 'New Turtle'), h('span', { style: { flex: 1 } }), h('input', { placeholder: 'Search', style: { background: '#fff', border: 0, padding: '4px 8px' } }), h('span', { style: { background: '#1db954', color: '#fff', padding: '4px 12px', borderRadius: '4px' } }, 'Sign in')), h('div', { style: { padding: '12px', display: 'grid', gap: '8px', alignContent: 'start' } }, cv, err, h('input', { value: 'Star', style: { padding: '6px', background: '#fff', border: 0 } }), h('textarea', { style: { height: '50px', padding: '6px' } }, 'A five pointed star.'), h('div.k-row', {}, btn('▶ Compile & Run (ctrl+enter)', run, 'pri'), btn('SVG', () => toast('turtle.svg')))), h('div', { style: { overflow: 'hidden', position: 'relative' } }, ed, h('button', { style: { position: 'absolute', right: '14px', bottom: '14px', background: '#1db954', color: '#fff', border: 0, padding: '8px 14px', borderRadius: '4px' }, onclick: run }, 'Compile & run')));
  run();
  window.__demoProof = async () => 'turtle program drew a star';
};
// ---- httpie
V['httpie-api-workspace'] = (root, T) => {
  theme(root, T, { bg: '#1c1f24', fg: '#ddd', panel: '#262a31', ac: '#73dc8c', acfg: '#000', dark: true });
  const MOCK = { '/users': [{ id: 1, name: 'Ada Lovelace', role: 'admin' }, { id: 2, name: 'Alan Turing', role: 'member' }], '/status': { ok: true, uptime: '31d 4h', region: 'icn1' } };
  let method = 'GET', url = 'https://api.example.dev/users'; const resp = h('pre', { style: { margin: 0, font: `12px/1.6 ${MONO}`, color: '#9fe8b2', padding: '12px', overflow: 'auto' } }); const meta = h('div.k-row', { style: { fontSize: '12px', gap: '14px', padding: '8px 12px', borderBottom: '1px solid #333' } });
  const send = async () => { meta.replaceChildren(h('span', {}, 'Sending…')); await sleep(250); const path = new URL(url, 'https://x').pathname; const body = MOCK[path]; const st = body ? (method === 'DELETE' ? 204 : method === 'POST' ? 201 : 200) : 404; meta.replaceChildren(h('b', { style: { color: st < 300 ? '#73dc8c' : '#ff6b6b' } }, `${st} ${st === 404 ? 'Not Found' : st === 201 ? 'Created' : 'OK'}`), h('span', {}, `${(80 + Math.random() * 90) | 0} ms`), h('span', {}, `${JSON.stringify(body || {}).length} B`)); resp.textContent = `HTTP/1.1 ${st}\ncontent-type: application/json\n\n` + JSON.stringify(body || { error: 'not found' }, null, 2); };
  const side = h('div', { style: { background: '#16181c', padding: '12px', fontSize: '12px', display: 'grid', gap: '6px', alignContent: 'start' } }, h('b', {}, '⚡ HTTPie-ish'), h('div', { style: { opacity: .6, marginTop: '10px' } }, 'COLLECTIONS'), ...[['GET', '/users'], ['GET', '/status'], ['POST', '/users'], ['DELETE', '/users/2']].map(([m, p]) => h('div', { style: { cursor: 'pointer', padding: '4px' }, onclick: () => { method = m; ms.value = m; url = 'https://api.example.dev' + p; ui.value = url; send(); } }, h('span', { style: { color: m === 'GET' ? '#73dc8c' : m === 'POST' ? '#f6c85f' : '#ff6b6b', width: '48px', display: 'inline-block' } }, m), p)));
  const ms = select(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], method, (v) => (method = v)); const ui = h('input', { value: url, oninput: (e) => (url = e.target.value), onkeydown: (e) => e.key === 'Enter' && send(), style: { flex: 1, background: '#16181c', border: '1px solid #333', color: '#fff', padding: '8px', font: `13px ${MONO}` } });
  root.style.display = 'grid'; root.style.gridTemplateColumns = '220px 1fr';
  root.append(side, h('div', { style: { display: 'grid', gridTemplateRows: 'auto auto 1fr', background: 'radial-gradient(80% 60% at 70% 20%,#2f6b45,#1c1f24 70%)' } }, h('div.k-row', { style: { padding: '14px', gap: '8px' } }, ms, ui, h('button', { style: { background: '#73dc8c', border: 0, padding: '8px 18px', borderRadius: '4px', fontWeight: 700 }, onclick: send }, 'Send')), h('div.k-row', { style: { padding: '0 14px', gap: '16px', fontSize: '12px', opacity: .8 } }, h('u', {}, 'Params'), 'Headers', 'Auth', 'Body', h('span', { style: { flex: 1 } }), h('span', { style: { background: '#73dc8c22', color: '#73dc8c', padding: '2px 8px', borderRadius: '4px' } }, '✦ AI: describe a request in plain English')), h('div', { style: { margin: '10px 14px', background: '#16181ccc', border: '1px solid #333', borderRadius: '8px', display: 'grid', gridTemplateRows: 'auto 1fr', overflow: 'hidden' } }, meta, resp)));
  window.__demoProof = async () => { await send(); return 'GET /users → 200 JSON response'; };
};

V['shaderpark-js-sdf-sculpt-desk'] = (root, T) => {
  theme(root, T, { bg: '#0b0c10', fg: '#e8ecf4', panel: '#12141a', ac: '#7cf0c2', dark: true, line: '#ffffff14' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "Inter Variable, system-ui, sans-serif";

  const EX = {
    blob: `// blob sphere — soft SDF sculpt
function sculpt(p, size, noise) {
  const d = length(p) - size;
  const n = sin(p.x*3.+t)*cos(p.y*3.-t)*noise*0.15;
  return d + n;
}
color(0.45, 0.85, 0.95);`,
    torus: `// twisted torus
function sculpt(p, size, noise) {
  const q = vec2(length(p.xz)-size*1.2, p.y);
  const tw = sin(atan(p.z,p.x)*3. + t)*noise*0.2;
  return length(q) - size*0.35 + tw;
}
color(0.95, 0.55, 0.85);`,
    noise: `// noisy terrain stub
function sculpt(p, size, noise) {
  const h = sin(p.x*2.5+t)*cos(p.z*2.2-t*0.7)*noise*0.45;
  return p.y - h + (1.0-size);
}
color(0.55, 0.95, 0.65);`,
  };

  let code = EX.blob;
  let auto = true;
  let size = 0.72;
  let noise = 0.55;
  let angY = 0.55, angX = 0.35;
  let dragging = false, lx = 0, ly = 0;
  let errMsg = '';
  let mode = 'blob';
  let timer = 0;

  // Canvas 2D metaball / raymarch-ish stub driven by "sculpt" keywords
  const cv = h('canvas', { style: { width: '100%', height: '100%', display: 'block', cursor: 'grab', background: '#05060a' } });
  const err = h('div', {
    style: {
      position: 'absolute', left: '12px', right: '12px', top: '12px', zIndex: 3,
      background: '#3a1218ee', color: '#ffb4c0', border: '1px solid #ff5c8a55',
      borderRadius: '8px', padding: '8px 10px', fontSize: '11px', fontFamily: MONO,
      display: 'none',
    },
  });

  const parseColor = (src) => {
    const m = src.match(/color\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/);
    if (!m) return [0.5, 0.85, 0.9];
    return [+m[1], +m[2], +m[3]];
  };
  const detectKind = (src) => {
    if (/torus|twisted/i.test(src)) return 'torus';
    if (/terrain|noisy/i.test(src)) return 'noise';
    if (/sculpt\s*\(/.test(src) && /length\(p\)/.test(src)) return 'blob';
    if (/function\s+sculpt/.test(src)) return 'blob';
    return null;
  };

  const draw = (t) => {
    const g = cv.getContext('2d');
    const r = cv.getBoundingClientRect();
    const W = r.width | 0, H = r.height | 0;
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const img = g.createImageData(W, H);
    const data = img.data;
    const col = parseColor(code);
    const kind = detectKind(code);
    if (!kind) {
      errMsg = 'compile failed: expected function sculpt(p, size, noise)';
      err.textContent = errMsg;
      err.style.display = 'block';
      g.fillStyle = '#0a0b10';
      g.fillRect(0, 0, W, H);
      return;
    }
    errMsg = '';
    err.style.display = 'none';
    const cosY = Math.cos(angY), sinY = Math.sin(angY);
    const cosX = Math.cos(angX), sinX = Math.sin(angX);
    const sdf = (x, y, z) => {
      // rotate into view
      let X = x * cosY - z * sinY; let Z = x * sinY + z * cosY;
      let Y = y * cosX - Z * sinX; Z = y * sinX + Z * cosX;
      if (kind === 'torus') {
        const qx = Math.hypot(X, Z) - size * 1.2;
        const tw = Math.sin(Math.atan2(Z, X) * 3 + t) * noise * 0.2;
        return Math.hypot(qx, Y) - size * 0.35 + tw;
      }
      if (kind === 'noise') {
        const hgt = Math.sin(X * 2.5 + t) * Math.cos(Z * 2.2 - t * 0.7) * noise * 0.45;
        return Y - hgt + (1 - size);
      }
      const d = Math.hypot(X, Y, Z) - size;
      const n = Math.sin(X * 3 + t) * Math.cos(Y * 3 - t) * noise * 0.15;
      return d + n;
    };
    const step = Math.max(1, Math.floor(Math.min(W, H) / 180));
    for (let py = 0; py < H; py += step) {
      for (let px = 0; px < W; px += step) {
        const u = (px / W) * 2 - 1;
        const v = -((py / H) * 2 - 1);
        const aspect = W / H;
        let ox = 0, oy = 0, oz = 2.6;
        let dx = u * aspect * 0.7, dy = v * 0.7, dz = -1;
        const dl = Math.hypot(dx, dy, dz); dx /= dl; dy /= dl; dz /= dl;
        let dist = 0, hit = false, p = 0;
        for (let i = 0; i < 48; i++) {
          const x = ox + dx * dist, y = oy + dy * dist, z = oz + dz * dist;
          p = sdf(x, y, z);
          if (p < 0.008) { hit = true; break; }
          dist += Math.max(0.02, p * 0.85);
          if (dist > 6) break;
        }
        let rC = 8, gC = 10, bC = 16;
        if (hit) {
          const x = ox + dx * dist, y = oy + dy * dist, z = oz + dz * dist;
          const e = 0.02;
          const nx = sdf(x + e, y, z) - sdf(x - e, y, z);
          const ny = sdf(x, y + e, z) - sdf(x, y - e, z);
          const nz = sdf(x, y, z + e) - sdf(x, y, z - e);
          const nl = Math.hypot(nx, ny, nz) || 1;
          const ndx = nx / nl, ndy = ny / nl, ndz = nz / nl;
          const ldot = Math.max(0, ndx * 0.4 + ndy * 0.85 + ndz * 0.35);
          const fres = Math.pow(1 - Math.max(0, -dy * ndy + 0.2), 2) * 0.35;
          rC = Math.min(255, (col[0] * (0.25 + ldot * 0.85) + fres) * 255);
          gC = Math.min(255, (col[1] * (0.25 + ldot * 0.85) + fres) * 255);
          bC = Math.min(255, (col[2] * (0.25 + ldot * 0.85) + fres) * 255);
        } else {
          const glow = Math.max(0, 1 - Math.abs(v) * 0.7) * 18;
          rC = 8 + glow; gC = 10 + glow * 0.8; bC = 18 + glow;
        }
        for (let yy = 0; yy < step && py + yy < H; yy++) {
          for (let xx = 0; xx < step && px + xx < W; xx++) {
            const i = ((py + yy) * W + (px + xx)) * 4;
            data[i] = rC; data[i + 1] = gC; data[i + 2] = bC; data[i + 3] = 255;
          }
        }
      }
    }
    g.putImageData(img, 0, 0);
  };

  let t0 = performance.now();
  const loop = () => { draw((performance.now() - t0) / 1000); requestAnimationFrame(loop); };
  loop();

  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => draw((performance.now() - t0) / 1000), 280);
  };

  const ed = editor(code, (v) => {
    code = v;
    if (auto) schedule();
  }, { bg: '#0e1016', fg: '#c8d6ff', gutter: '#4a5568', size: 13, lh: 20 });
  ed.onRun = () => draw((performance.now() - t0) / 1000);

  cv.addEventListener('pointerdown', (e) => {
    dragging = true; lx = e.clientX; ly = e.clientY;
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor = 'grabbing';
  });
  cv.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    angY += (e.clientX - lx) * 0.01;
    angX = clamp(angX + (e.clientY - ly) * 0.01, -1.2, 1.2);
    lx = e.clientX; ly = e.clientY;
  });
  cv.addEventListener('pointerup', () => { dragging = false; cv.style.cursor = 'grab'; });

  const loadEx = (k) => {
    mode = k;
    code = EX[k];
    ed.set(code);
    chips.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.k === k));
  };

  const chips = h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } },
    ...[['blob', 'Blob'], ['torus', 'Torus'], ['noise', 'Noise']].map(([k, lab]) =>
      h('button.k-btn', {
        'data-k': k,
        className: 'k-btn' + (k === 'blob' ? ' on' : ''),
        style: { padding: '5px 10px', fontSize: '11px' },
        onclick: () => loadEx(k),
      }, lab)),
  );
  // fix class for first
  chips.children[0].classList.add('on');

  const preview = h('div', { style: { position: 'relative', minHeight: 0, background: '#05060a' } }, cv, err);
  const side = h('div', {
    style: {
      display: 'grid', gridTemplateRows: '40px 1fr 150px', borderLeft: '1px solid #ffffff14',
      background: '#0e1016', minHeight: 0,
    },
  },
    h('div.k-row', { style: { padding: '0 12px', gap: '10px', borderBottom: '1px solid #ffffff10' } },
      h('b', { style: { fontSize: '12px' } }, 'sculpt.js'),
      h('span', { style: { flex: 1 } }),
      toggle('Auto Update', true, (v) => { auto = v; }),
      btn('Run', () => draw((performance.now() - t0) / 1000), 'pri'),
    ),
    h('div', { style: { minHeight: 0, overflow: 'hidden' } }, ed),
    h('div', {
      style: {
        borderTop: '1px solid #ffffff10', padding: '10px 12px', display: 'grid', gap: '8px',
        background: '#0b0d12',
      },
    },
      h('div.k-h', {}, 'Examples'),
      chips,
      h('div.k-h', {}, 'Controls'),
      slider('size', 0.25, 1.2, size, 0.01, (v) => { size = v; }),
      slider('noise', 0, 1.2, noise, 0.01, (v) => { noise = v; }),
    ),
  );

  const top = h('div.k-row', {
    style: {
      padding: '0 14px', gap: '12px', background: '#0e1016', borderBottom: '1px solid #ffffff10',
      height: '40px',
    },
  },
    h('b', { style: { fontSize: '13px', letterSpacing: '-.01em' } }, 'Shader Park-ish'),
    h('span', { style: { fontSize: '11px', opacity: .45 } }, 'JS → SDF live sculpt'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '11px', opacity: .4, fontFamily: MONO } }, 'drag preview to orbit'),
  );

  root.style.display = 'grid';
  root.style.gridTemplateRows = '40px 1fr';
  root.append(top, h('div', { style: { display: 'grid', gridTemplateColumns: '1.15fr 1fr', minHeight: 0 } }, preview, side));

  window.__demoProof = async () => {
    loadEx('torus');
    size = 0.9; noise = 0.8;
    angY += 0.6; angX = 0.2;
    await sleep(200);
    loadEx('blob');
    size = 0.72; noise = 0.55;
    await sleep(120);
    return 'examples swapped; size/noise + orbit exercised; auto-update path ready';
  };
};


V['hydra-live-visual-synth'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#f0f0f0', panel: '#010101', ac: '#fff', dark: true });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable,system-ui,sans-serif';

  const SNIPS = [
    'osc(20, 0.1, 1.2)\n  .rotate(0.6)\n  .kaleid(5)\n  .modulate(noise(3), 0.2)\n  .out()',
    'osc(10, 0.2, 0.8)\n  .rotate(1.2)\n  .pixelate(24, 24)\n  .out()',
    'osc(30, 0.1, 2)\n  .modulate(noise(4), 0.4)\n  .kaleid(3)\n  .out()',
    'osc(40, 0.05, 1.5)\n  .kaleid(7)\n  .rotate(0.2)\n  .out()',
    'osc(8, 0.15, 0)\n  .modulate(noise(2), 0.6)\n  .pixelate(40, 20)\n  .out()',
  ];
  let code = SNIPS[0];
  let showInfo = true;

  const toGLSL = (c) => {
    const f = (n, d) => {
      const m = c.match(new RegExp(n + '\\(([^)]*)\\)'));
      return m ? m[1].split(',').map((x) => parseFloat(x) || 0).concat(d).slice(0, d.length).map((x, i) => (isNaN(x) ? d[i] : x)) : null;
    };
    const o = f('osc', [60, 0.1, 0]) || [60, 0.1, 0];
    const rot = f('rotate', [0]);
    const kal = f('kaleid', [4]);
    const mod = f('modulate', [0, 0.1]);
    const pix = f('pixelate', [20, 20]);
    return `precision highp float;uniform vec2 r;uniform float t;float h(vec2 p){return fract(sin(dot(p,vec2(12.9,78.2)))*43758.);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),f.x),f.y);}void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv-.5;p.x*=r.x/r.y;${rot ? `float a=${rot[0].toFixed(3)};p=mat2(cos(a),-sin(a),sin(a),cos(a))*p;` : ''}${kal ? `float k=${kal[0].toFixed(1)};float an=atan(p.y,p.x);float rr=length(p);an=mod(an,6.2832/k);an=abs(an-3.1416/k);p=vec2(cos(an),sin(an))*rr;` : ''}${mod ? `p+=(n(p*3.+t*.3)-.5)*${mod[1].toFixed(3)};` : ''}${pix ? `p=floor(p*${pix[0].toFixed(1)})/${pix[0].toFixed(1)};` : ''}float fr=${o[0].toFixed(2)},sp=${o[1].toFixed(3)},of=${o[2].toFixed(3)};float band=sin(p.x*fr+t*sp*6.28+of);float grain=h(uv*r*.5+t)*.12;vec3 c=vec3(band*.5+.5)+grain;float vig=smoothstep(1.2,.3,length(uv-.5));c*=vig;gl_FragColor=vec4(c,1);}`;
  };

  const G = gl(toGLSL(code));
  G.cv.style.position = 'absolute';
  G.cv.style.inset = '0';
  G.cv.style.filter = 'contrast(1.15) brightness(1.05)';

  const ta = h('textarea', {
    spellcheck: false, value: code,
    style: {
      position: 'absolute', left: '20px', top: '20px', width: 'min(520px, 55vw)', height: '220px',
      background: 'transparent', color: '#fff', border: 0, outline: 'none',
      font: `17px/1.55 ${MONO}`, textShadow: '0 0 4px #000,0 0 10px #000', resize: 'none', zIndex: 2,
    },
    onkeydown: (e) => {
      if ((e.ctrlKey || e.metaKey || e.shiftKey) && e.key === 'Enter') {
        e.preventDefault(); code = ta.value; G.compile(toGLSL(code)); toast('compiled');
      }
    },
  });

  const run = () => { code = ta.value; G.compile(toGLSL(code)); };
  const shuffle = () => {
    ta.value = pick(SNIPS);
    code = ta.value; G.compile(toGLSL(code));
  };

  const toolbar = h('div.k-row', {
    style: {
      position: 'absolute', right: '16px', top: '14px', gap: '14px', fontSize: '18px', zIndex: 3,
      color: '#fff', textShadow: '0 0 6px #000',
    },
  },
    h('span', { style: { cursor: 'pointer' }, title: 'Run', onclick: run }, '▶'),
    h('span', { style: { cursor: 'pointer' }, title: 'Random', onclick: shuffle }, '🎲'),
    h('span', { style: { cursor: 'pointer' }, title: 'Info', onclick: () => { showInfo = true; paintInfo(); } }, '?'),
  );

  const infoHost = h('div', { style: { position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' } });
  const paintInfo = () => {
    if (!showInfo) { infoHost.replaceChildren(); return; }
    infoHost.replaceChildren(h('div', {
      style: {
        pointerEvents: 'auto', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: 'min(640px, 92vw)', background: '#000', border: '1px solid #fff', padding: '20px 28px',
        fontSize: '14px', lineHeight: 1.7, color: '#fff',
      },
    },
      h('div.k-row', { style: { fontSize: '12px', gap: '10px', opacity: .85, flexWrap: 'wrap' } },
        'english', 'español', h('b', {}, '한글'), '中文', 'français', 'deutsch', '日本語',
        h('span', { style: { flex: 1 } }),
        h('span', { style: { cursor: 'pointer' }, onclick: () => { showInfo = false; paintInfo(); } }, '✕'),
      ),
      h('div', { style: { fontSize: '28px', marginTop: '14px', fontWeight: 700 } }, '하이드라'),
      h('div', { style: { opacity: .7 } }, '라이브 코딩 비디오 신스'),
      h('div', { style: { margin: '12px 0', opacity: .5, letterSpacing: '1px' } }, '//////////////////////////////////////////'),
      h('p', {}, '하이드라는 브라우저에서 동작하는 라이브 코딩 비디오 신시사이저입니다. osc(), rotate(), kaleid(), modulate(), pixelate() 체인을 연결해 시각을 만듭니다.'),
      h('div', { style: { margin: '8px 0', opacity: .5 } }, 'To start'),
      h('ol', { style: { margin: 0, paddingLeft: '18px' } },
        h('li', {}, '이 창을 닫습니다'),
        h('li', {}, '왼쪽 위 코드의 숫자를 바꿉니다'),
        h('li', {}, 'Ctrl + Shift + Enter 로 실행합니다'),
      ),
      h('div', { style: { margin: '12px 0', opacity: .5, letterSpacing: '1px' } }, '//////////////////////////////////////////'),
      h('p', { style: { opacity: .65, fontSize: '12px' } }, 'Hydra-ish · JS-like chains compile to a WebGL fragment shader in real time.'),
    ));
  };
  paintInfo();

  const t0 = performance.now();
  const loop = () => { G.draw((performance.now() - t0) / 1000); requestAnimationFrame(loop); };
  loop();

  root.append(G.cv, ta, toolbar, infoHost);

  window.__demoProof = async () => {
    showInfo = true; paintInfo();
    await sleep(60);
    showInfo = false; paintInfo();
    ta.value = SNIPS[2]; code = ta.value; G.compile(toGLSL(code));
    await sleep(100);
    ta.value = SNIPS[1]; code = ta.value; G.compile(toGLSL(code));
    await sleep(80);
    ta.value = SNIPS[0]; code = ta.value; G.compile(toGLSL(code));
    showInfo = true; paintInfo();
    return 'info toggled · osc/modulate/kaleid snippets compiled · restored';
  };
};


V['dwitter-140char-demo-stage'] = (root, T) => {
  theme(root, T, { bg: '#0b0d10', fg: '#e8eaed', panel: '#151920', ac: '#3d8bfd', ac2: '#ff6b81', dark: true, line: '#ffffff14' });
  root.style.fontFamily = 'Inter Variable,system-ui,sans-serif';
  root.style.overflow = 'hidden';

  const SAMPLES = [
    { user: 'u/xor', likes: 1842, body: 'for(i=0;i<2e3;i++)x.fillRect(960+C(i)*i/3+S(t)*99,540+S(i)*i/3,2,2)' },
    { user: 'u/neon', likes: 991, body: 'for(i=0;i<400;i++){x.fillStyle=R(S(i+t)*128+128,99,C(i)*128+128);x.fillRect(960+C(i*.02+t)*400,540+S(i*.03)*220,3,3)}' },
    { user: 'u/wave', likes: 640, body: 'x.strokeStyle=R(0,200,255,.4);x.beginPath();for(i=0;i<1920;i++)x.lineTo(i,540+S(i*.01+t)*99+C(i*.02-t)*40);x.stroke()' },
    { user: 'u/orb', likes: 512, body: 'for(i=0;i<64;i++){a=i/10+t;x.fillStyle=R(255,C(a)*99+99,S(a)*99+99,.6);x.beginPath();x.arc(960+C(a)*300,540+S(a*1.3)*200,8+S(t+i)*6,0,7);x.fill()}' },
    { user: 'u/grid', likes: 308, body: 'for(i=0;i<20;i++)for(j=0;j<12;j++){x.fillStyle=R(40+i*8,30+j*12,90+S(t+i)*.40);x.fillRect(200+i*70+S(t+j)*8,80+j*60,50,40)}' },
  ];
  let body = SAMPLES[0].body;
  let err = '';
  let playing = true;
  let likes = 0;

  const wrap = (src) => {
    const trimmed = String(src || '').slice(0, 140);
    return `with(Math){const S=sin,C=cos,T=tan;const R=(r,g,b,a)=>a==null?\`rgb(\${r|0},\${g|0},\${b|0})\`:\`rgba(\${r|0},\${g|0},\${b|0},\${a})\`;return function(t,c,x){${trimmed}\n}}`;
  };
  let fn = null;
  const compile = (src) => {
    try {
      // eslint-disable-next-line no-new-func
      fn = new Function('return ' + wrap(src))();
      err = '';
    } catch (e) {
      err = String(e.message || e).slice(0, 80);
      fn = null;
    }
  };
  compile(body);

  const shell = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '52px 1fr', background: '#0b0d10' } });
  const header = h('div.k-row', { style: { padding: '0 18px', borderBottom: '1px solid #ffffff12', gap: '16px', background: '#10141a' } },
    h('b', { style: { fontSize: '20px', letterSpacing: '-.02em' } }, 'Dwitter'),
    h('span', { style: { opacity: .45, fontSize: '13px' } }, '140-char JS demos'),
    h('span', { style: { flex: 1 } }),
    btn('New dweet', () => { body = SAMPLES[0].body; ta.value = body; compile(body); paintFeed(); updMeta(); toast('new'); }, 'pri'),
  );

  const main = h('div', { style: { display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', minHeight: 0, overflow: 'hidden' } });
  const stage = h('div', { style: { display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '10px', padding: '14px', minHeight: 0, borderRight: '1px solid #ffffff10' } });
  const feedHost = h('div', { style: { overflow: 'auto', padding: '12px 14px', display: 'grid', gap: '10px', alignContent: 'start', background: '#0d1117' } });

  const cv = h('canvas', { width: 960, height: 540, style: { width: '100%', height: 'auto', maxHeight: '360px', background: '#000', borderRadius: '10px', border: '1px solid #ffffff14', display: 'block' } });
  const x = cv.getContext('2d');
  const meta = h('div.k-row', { style: { gap: '10px', fontSize: '12px', opacity: .85 } });
  const ta = h('textarea', {
    spellcheck: false, maxlength: 140, value: body,
    style: {
      width: '100%', minHeight: '88px', resize: 'vertical', border: '1px solid #ffffff18', borderRadius: '10px',
      background: '#12161d', color: '#9cdcfe', font: `13px/1.45 ${MONO}`, padding: '12px', outline: 'none',
    },
    oninput: (e) => {
      body = e.target.value.slice(0, 140);
      e.target.value = body;
      compile(body);
      updMeta();
    },
  });
  const updMeta = () => {
    meta.replaceChildren(
      h('b', { style: { color: body.length > 140 ? '#ff6b81' : '#3d8bfd' } }, `${body.length}/140`),
      h('span', { style: { opacity: .5 } }, 'function u(t){ … }'),
      h('span', { style: { flex: 1 } }),
      err ? h('span', { style: { color: '#ff6b81' } }, err) : h('span', { style: { color: '#3dd68c' } }, 'ok'),
      btn(playing ? '❚❚' : '▶', () => { playing = !playing; updMeta(); }),
      btn('♥ ' + likes, () => { likes++; updMeta(); toast('liked'); }),
      btn('Remix', () => { toast('remixed into editor'); }),
    );
  };
  updMeta();

  const t0 = performance.now();
  const loop = () => {
    if (playing && fn) {
      const t = (performance.now() - t0) / 1000;
      try {
        x.fillStyle = '#000';
        x.fillRect(0, 0, cv.width, cv.height);
        x.save();
        // scale logical 1920×1080 → canvas
        x.scale(cv.width / 1920, cv.height / 1080);
        fn(t, cv, x);
        x.restore();
      } catch (e) {
        err = String(e.message || e).slice(0, 80);
        fn = null;
        updMeta();
      }
    }
    requestAnimationFrame(loop);
  };
  loop();

  const paintFeed = () => {
    feedHost.replaceChildren(
      h('div.k-h', {}, 'Hot dweets'),
      ...SAMPLES.map((d, i) => {
        const mini = h('canvas', { width: 320, height: 180, style: { width: '100%', height: 'auto', background: '#000', borderRadius: '8px', display: 'block' } });
        const mx = mini.getContext('2d');
        try {
          // eslint-disable-next-line no-new-func
          const f = new Function('return ' + wrap(d.body))();
          mx.fillStyle = '#000'; mx.fillRect(0, 0, 320, 180);
          mx.save(); mx.scale(320 / 1920, 180 / 1080); f(1.2 + i * 0.4, mini, mx); mx.restore();
        } catch {}
        return h('div', {
          style: { background: '#151920', border: '1px solid #ffffff12', borderRadius: '12px', padding: '10px', cursor: 'pointer' },
          onclick: () => { body = d.body; ta.value = body; compile(body); likes = d.likes; updMeta(); toast('loaded ' + d.user); },
        },
          h('div.k-row', { style: { gap: '8px', marginBottom: '8px' } },
            h('div', { style: { width: '28px', height: '28px', borderRadius: '50%', background: `hsl(${i * 50},60%,45%)` } }),
            h('b', { style: { fontSize: '13px' } }, d.user),
            h('span', { style: { flex: 1 } }),
            h('span', { style: { fontSize: '12px', opacity: .6 } }, '♥ ' + d.likes),
          ),
          mini,
          h('pre', { style: { margin: '8px 0 0', font: `11px/1.4 ${MONO}`, color: '#9cdcfe', whiteSpace: 'pre-wrap', wordBreak: 'break-all', opacity: .9 } }, `u(t){\n${d.body}\n}`),
          h('div.k-row', { style: { marginTop: '8px', gap: '6px' } },
            btn('Like', () => toast('♥')),
            btn('Remix', () => { body = d.body; ta.value = body; compile(body); updMeta(); }),
          ),
        );
      }),
    );
  };
  paintFeed();

  stage.append(
    h('div', {}, h('div.k-row', { style: { marginBottom: '8px' } }, h('b', {}, 'Live stage'), h('span', { style: { flex: 1 } }), h('span', { style: { fontSize: '12px', opacity: .5 } }, 'S C T R · c · x')), cv),
    h('div', { style: { display: 'grid', gap: '8px', minHeight: 0 } }, meta, ta),
    h('div', { style: { fontSize: '11px', opacity: .45 } }, 'Helpers: S=sin C=cos T=tan R=rgba · canvas is 1920×1080 logical'),
  );
  main.append(stage, feedHost);
  shell.append(header, main);
  root.append(shell);

  window.__demoProof = async () => {
    body = SAMPLES[1].body; ta.value = body; compile(body); likes = 42; updMeta();
    await sleep(120);
    body = SAMPLES[0].body; ta.value = body; compile(body); updMeta();
    await sleep(80);
    playing = true; updMeta();
    return 'switched dweet bodies · recompiled u(t) · animation running';
  };
};

V['vertexshaderart-live-stage'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#e8e8e8', panel: '#111', ac: '#6cf', dark: true, line: '#ffffff14' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'ui-monospace, JetBrains Mono Variable, monospace';

  const PRESETS = [
    {
      id: 'spiral', title: 'point spiral', author: 'gman', likes: 1284,
      code: `// vertex-ish point spiral
vec2 pos = vec2(cos(i*0.15+t), sin(i*0.15+t)) * (0.2+i*0.002);
gl_PointSize = 2.0;`,
      paint: (g, W, H, t, n) => {
        for (let i = 0; i < n; i++) {
          const a = i * 0.15 + t;
          const r = 40 + i * 0.55;
          const x = W / 2 + Math.cos(a) * r;
          const y = H / 2 + Math.sin(a) * r * 0.85;
          g.fillStyle = `hsl(${(i * 0.4 + t * 40) % 360} 80% 65%)`;
          g.fillRect(x, y, 2, 2);
        }
      },
    },
    {
      id: 'gridwave', title: 'grid wave', author: 'kolargon', likes: 862,
      code: `// displaced grid
float z = sin(x*0.04+t)*cos(y*0.04-t);
pos = vec3(x, y, z*40.0);`,
      paint: (g, W, H, t, n) => {
        const cols = 48, rows = 28;
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
          const x = (i / (cols - 1)) * W;
          const y = (j / (rows - 1)) * H;
          const z = Math.sin(i * 0.35 + t * 2) * Math.cos(j * 0.35 - t) * 18;
          g.fillStyle = `hsl(${180 + z * 3} 70% ${55 + z}%)`;
          g.fillRect(x, y + z, 3, 3);
        }
      },
    },
    {
      id: 'tunnel', title: 'circle tunnel', author: 'argonblue', likes: 640,
      code: `// rings toward camera
float z = fract(i/N - t*0.2);
pos = vec2(cos(a),sin(a)) * (0.1/z);`,
      paint: (g, W, H, t, n) => {
        const rings = 28;
        for (let r = 0; r < rings; r++) {
          const z = ((r / rings) + t * 0.15) % 1;
          const rad = 20 + (1 - z) * Math.min(W, H) * 0.48;
          const pts = 36;
          for (let k = 0; k < pts; k++) {
            const a = (k / pts) * Math.PI * 2 + t * 0.4;
            const x = W / 2 + Math.cos(a) * rad;
            const y = H / 2 + Math.sin(a) * rad * 0.7;
            g.fillStyle = `hsla(${(k * 8 + r * 12) % 360} 75% 60% / ${0.3 + z * 0.7})`;
            g.beginPath(); g.arc(x, y, 2 + (1 - z) * 2, 0, 7); g.fill();
          }
        }
      },
    },
    {
      id: 'nebula', title: 'nebula cloud', author: 'trip-les-ix', likes: 401,
      code: `// noisy point cloud
pos += noise(pos+t)*0.15;
color = hsl(length(pos)+t, .7, .6);`,
      paint: (g, W, H, t, n) => {
        const rnd = rng(99);
        for (let i = 0; i < n; i++) {
          let x = rnd() * W, y = rnd() * H;
          const nx = Math.sin(x * 0.01 + t) * Math.cos(y * 0.012 - t * 0.7);
          x += nx * 40; y += Math.cos(x * 0.008 + t) * 30;
          g.fillStyle = `hsla(${(200 + nx * 80 + t * 30) % 360} 70% 60% / 0.55)`;
          g.fillRect(x, y, 2.2, 2.2);
        }
      },
    },
  ];

  let cur = 0;
  let playing = true;
  let likes = PRESETS[0].likes;
  let code = PRESETS[0].code;
  const t0 = performance.now();

  const cv = h('canvas', { width: 960, height: 540, style: { width: '100%', height: 'auto', display: 'block', background: '#000', borderBottom: '1px solid #ffffff10' } });
  const g = cv.getContext('2d');
  const ta = h('textarea', {
    spellcheck: false, value: code,
    style: {
      width: '100%', height: '140px', resize: 'vertical', border: '1px solid #ffffff18', borderRadius: '0',
      background: '#0a0a0a', color: '#9cdcfe', font: '12px/1.45 ui-monospace,monospace', padding: '12px', outline: 'none',
    },
    oninput: (e) => { code = e.target.value; },
  });
  const meta = h('div.k-row', { style: { padding: '8px 12px', gap: '10px', fontSize: '12px', borderBottom: '1px solid #ffffff10', background: '#0d0d0d' } });
  const strip = h('div', { style: { display: 'flex', gap: '10px', padding: '10px 12px', overflowX: 'auto', background: '#0a0a0a', borderTop: '1px solid #ffffff10' } });

  const updMeta = () => {
    const p = PRESETS[cur];
    meta.replaceChildren(
      h('b', {}, p.title),
      h('span', { style: { opacity: .5 } }, '@' + p.author),
      h('span', { style: { flex: 1 } }),
      btn(playing ? '❚❚' : '▶', () => { playing = !playing; updMeta(); }),
      btn('♥ ' + likes, () => { likes++; updMeta(); toast('liked'); }),
      btn('Apply', () => { toast('shader applied (visual preset)'); }, 'pri'),
    );
  };

  const paintStrip = () => {
    strip.replaceChildren(...PRESETS.map((p, i) => {
      const mini = h('canvas', { width: 160, height: 90, style: { width: '160px', height: '90px', display: 'block', background: '#000', borderRadius: '4px' } });
      const mx = mini.getContext('2d');
      mx.fillStyle = '#000'; mx.fillRect(0, 0, 160, 90);
      p.paint(mx, 160, 90, 1.2 + i, 400);
      return h('div', {
        style: {
          flex: '0 0 auto', cursor: 'pointer', padding: '4px',
          border: i === cur ? '1px solid #6cf' : '1px solid #ffffff14', borderRadius: '6px', background: '#111',
        },
        onclick: () => {
          cur = i; likes = p.likes; code = p.code; ta.value = code; updMeta(); paintStrip(); toast(p.title);
        },
      },
        mini,
        h('div.k-row', { style: { marginTop: '4px', fontSize: '10px', gap: '6px' } },
          h('span', {}, p.title), h('span', { style: { flex: 1 } }), h('span', { style: { opacity: .5 } }, p.author),
        ),
      );
    }));
  };

  const loop = () => {
    if (playing) {
      const t = (performance.now() - t0) / 1000;
      g.fillStyle = '#000'; g.fillRect(0, 0, cv.width, cv.height);
      PRESETS[cur].paint(g, cv.width, cv.height, t, 900);
    }
    requestAnimationFrame(loop);
  };
  loop();
  updMeta();
  paintStrip();

  const header = h('div.k-row', { style: { height: '44px', padding: '0 14px', gap: '14px', borderBottom: '1px solid #ffffff12', background: '#0a0a0a', fontSize: '13px' } },
    h('b', {}, 'vertexshaderart.com'),
    h('span', { style: { opacity: .4 } }, 'live vertex stage'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: .45 } }, 'new'),
    h('span', { style: { opacity: .45 } }, 'lessons'),
    h('span', { style: { opacity: .45 } }, 'github'),
  );

  const author = h('div.k-row', { style: { padding: '6px 12px', fontSize: '11px', opacity: .55, gap: '8px', background: '#0d0d0d' } },
    h('span', { style: { width: '18px', height: '18px', borderRadius: '50%', background: '#6cf' } }),
    h('span', {}, 'author chip · GLSL-ish vertex snippet · canvas 2D point stage'),
  );

  root.style.display = 'flex'; root.style.flexDirection = 'column';
  root.append(
    header,
    h('div', { style: { flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: 'auto auto 1fr auto auto', overflow: 'auto' } },
      cv, meta, ta, author, strip,
    ),
  );

  window.__demoProof = async () => {
    cur = 1; likes = PRESETS[1].likes; code = PRESETS[1].code; ta.value = code; updMeta(); paintStrip();
    await sleep(140);
    cur = 2; likes = PRESETS[2].likes; code = PRESETS[2].code; ta.value = code; updMeta(); paintStrip();
    await sleep(100);
    cur = 0; likes = PRESETS[0].likes; code = PRESETS[0].code; ta.value = code; updMeta(); paintStrip();
    playing = true; updMeta();
    return 'cycled spiral→gridwave→tunnel→spiral · animation running';
  };
};


V['canvasui-shader-dom-playground'] = (root, T) => {
  theme(root, T, { bg: '#f4f4f5', fg: '#111', panel: '#fff', ac: '#111', dark: false, line: '#e6e6e8' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  const EFFECTS = [
    { id: 'Liquid', desc: 'A fluid simulation over the live DOM' },
    { id: 'Ripple', desc: 'Pointer ripples across the page surface' },
    { id: 'Glass', desc: 'Frosted refraction over interactive HTML' },
    { id: 'VHS', desc: 'Scanline + noise tape distortion' },
    { id: 'ASCII', desc: 'Glyph rain sampled from the DOM texture' },
  ];
  const P = { force: 1.1, radius: 0.3, curl: 1.9, swirl: 4, pressure: 0.8, intensity: 2, distortion: 0.4, blend: 5, trail: 0.96, motion: 1 };
  const defaults = { ...P };
  let effect = 'Liquid';
  let quality = 'Medium';
  let mx = 0.55, my = 0.42;
  const N = noise2(19);
  let t0 = performance.now();

  const side = h('div', {
    style: {
      width: '300px', flexShrink: 0, background: '#fff', borderRight: '1px solid #e8e8ea',
      display: 'flex', flexDirection: 'column', padding: '16px 16px 12px', gap: '10px', overflow: 'auto',
    },
  });
  const effectLab = h('div', { style: { font: '600 13px Inter Variable' } }, 'Liquid');
  const effectDesc = h('div', { style: { fontSize: '11px', opacity: .5, marginTop: '2px' } }, EFFECTS[0].desc);
  const qualitySeg = seg([['Low', 'Low'], ['Medium', 'Medium'], ['High', 'High']], quality, (v) => { quality = v; toast(v + ' quality'); });

  const slidersHost = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } });
  const SL = [
    ['Force', 'force', 0, 3, 0.1, (v) => (+v).toFixed(1)],
    ['Radius', 'radius', 0.05, 1, 0.01, (v) => (+v).toFixed(2)],
    ['Curl', 'curl', 0, 4, 0.1, (v) => (+v).toFixed(1)],
    ['Swirl', 'swirl', 0, 8, 0.1, (v) => String(+v)],
    ['Pressure', 'pressure', 0, 2, 0.05, (v) => (+v).toFixed(2)],
    ['Intensity', 'intensity', 0.2, 4, 0.1, (v) => (+v).toFixed(1)],
    ['Distortion', 'distortion', 0, 1.5, 0.05, (v) => (+v).toFixed(2)],
    ['Blend', 'blend', 0, 10, 0.1, (v) => (+v).toFixed(1)],
    ['Trail fade', 'trail', 0.5, 1, 0.001, (v) => (+v).toFixed(3)],
    ['Motion fade', 'motion', 0.5, 1, 0.001, (v) => (+v).toFixed(3)],
  ];
  const slMap = {};
  for (const [lab, key, mn, mxv, st, fmt] of SL) {
    const el = slider(lab, mn, mxv, P[key], st, (v) => { P[key] = v; }, fmt);
    slMap[key] = el;
    slidersHost.append(el);
  }

  const setEffect = (id) => {
    effect = id;
    const e = EFFECTS.find((x) => x.id === id) || EFFECTS[0];
    effectLab.textContent = e.id;
    effectDesc.textContent = e.desc;
    toast(e.id);
  };

  side.append(
    h('div.k-row', { style: { gap: '10px', marginBottom: '4px' } },
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', width: '22px', height: '22px' } },
        ...Array.from({ length: 4 }, () => h('i', { style: { background: '#111', borderRadius: '2px' } })),
      ),
      h('b', { style: { fontSize: '14px' } }, 'Canvas UI'),
      h('span', { style: { fontSize: '10px', padding: '2px 8px', borderRadius: '99px', background: '#f0f0f2', color: '#555', fontWeight: 600 } }, 'Playground'),
    ),
    h('div.k-h', {}, 'Component'),
    h('button', {
      style: {
        display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #e4e4e7', borderRadius: '12px',
        padding: '8px', background: '#fafafa', cursor: 'pointer', textAlign: 'left', width: '100%',
      },
      onclick: () => {
        const i = (EFFECTS.findIndex((e) => e.id === effect) + 1) % EFFECTS.length;
        setEffect(EFFECTS[i].id);
      },
    },
      h('div', { style: { width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#111', flex: 'none' } },
        h('canvas', { width: 40, height: 40, style: { width: '40px', height: '40px', display: 'block' }, ref: 0 }),
      ),
      h('div', { style: { minWidth: 0 } }, effectLab, effectDesc),
    ),
    h('div.k-row', { style: { gap: '8px' } },
      btn('Copy for AI', () => copy(`Canvas UI · ${effect} · quality ${quality}`, 'Snippet'), ''),
      btn('Share', () => toast('share link copied'), ''),
    ),
    h('div.k-row', {}, h('div.k-h', { style: { margin: 0 } }, 'Controls'), h('span', { style: { flex: 1 } }),
      btn('Reset', () => {
        Object.assign(P, defaults);
        for (const [lab, key] of SL.map((x) => [x[0], x[1]])) slMap[key].set(P[key]);
        toast('reset');
      })),
    qualitySeg,
    slidersHost,
    h('span', { style: { flex: 1 } }),
    h('button', {
      style: {
        marginTop: '8px', width: '100%', background: '#111', color: '#fff', border: 0, borderRadius: '10px',
        padding: '12px', fontWeight: 700, cursor: 'pointer',
      },
      onclick: () => toast('docs ←'),
    }, '← Back to Docs'),
  );

  // paint tiny thumb
  const thumbCv = side.querySelector('canvas');
  const tg = thumbCv.getContext('2d');
  const paintThumb = () => {
    const img = tg.createImageData(40, 40);
    for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) {
      const n = N(x * 0.08, y * 0.08 + performance.now() * 0.0002);
      const v = (n * 180) | 0;
      const i = (y * 40 + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    tg.putImageData(img, 0, 0);
  };

  const stage = h('div', {
    style: {
      flex: 1, minWidth: 0, minHeight: 0, padding: '18px 18px 18px 8px', display: 'flex', flexDirection: 'column', gap: '10px',
      position: 'relative', background: '#f4f4f5',
    },
  });
  const topTools = h('div.k-row', { style: { justifyContent: 'flex-end', gap: '10px', paddingRight: '6px' } },
    h('span', { style: { fontSize: '12px', opacity: .45 } }, '⌕'),
    h('span', { style: { fontSize: '12px', opacity: .45 } }, '☀'),
    h('span', { style: { fontSize: '11px', padding: '4px 8px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff' } }, '★ 4.8k'),
  );

  const frame = h('div', {
    style: {
      flex: 1, minHeight: 0, borderRadius: '16px', overflow: 'hidden', background: '#fff',
      border: '1px solid #e4e4e7', boxShadow: '0 12px 40px #00000012', position: 'relative',
    },
  });

  const site = h('div', {
    style: {
      position: 'absolute', inset: 0, padding: '22px 36px', background: '#fff', color: '#111',
      overflow: 'hidden', zIndex: 1,
    },
  },
    h('div.k-row', { style: { gap: '18px', marginBottom: '36px', fontSize: '13px' } },
      h('b', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, h('span', {}, '⚡'), 'bolt'),
      h('span', { style: { flex: 1 } }),
      ...['Product', 'Pricing', 'Docs', 'Changelog'].map((x) => h('span', { style: { opacity: .55 } }, x)),
    ),
    h('div', { style: { maxWidth: '420px' } },
      h('div', { style: { font: '800 42px/1.05 Inter Variable', letterSpacing: '-.03em' } }, 'Ship in days, not quarters'),
      h('p', { style: { opacity: .55, lineHeight: 1.5, margin: '12px 0 18px', fontSize: '14px' } },
        'bolt is the home for builds, reviews, and releases — with Canvas UI liquid over live DOM.'),
      h('div.k-row', { style: { gap: '10px' } },
        h('button', { style: { background: '#111', color: '#fff', border: 0, borderRadius: '10px', padding: '10px 14px', fontWeight: 700 } }, 'Start shipping free'),
        h('button', { style: { background: '#fff', color: '#111', border: '1px solid #ddd', borderRadius: '10px', padding: '10px 14px', fontWeight: 600 } }, 'Book a demo'),
      ),
    ),
    h('div', {
      style: {
        position: 'absolute', right: '28px', bottom: '24px', width: '46%', height: '48%',
        borderRadius: '12px', overflow: 'hidden', background: 'linear-gradient(145deg,#1a1a1a,#555 40%,#111)',
      },
    },
      h('div', { style: { position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg,#fff1 0 2px,transparent 2px 28px),repeating-linear-gradient(#fff1 0 2px,transparent 2px 36px)', opacity: .35 } }),
      h('div', { style: { position: 'absolute', inset: '18% 22%', border: '2px solid #fff6', borderRadius: '50%', transform: 'perspective(400px) rotateX(55deg)' } }),
    ),
  );

  const overlay = h('canvas', {
    style: { position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none', mixBlendMode: effect === 'Glass' ? 'soft-light' : 'multiply', opacity: 0.55 },
  });
  const newsletter = h('div', {
    style: {
      position: 'absolute', top: '18px', right: '18px', width: '240px', background: '#fff', border: '1px solid #e8e8ea',
      borderRadius: '14px', padding: '14px', zIndex: 3, boxShadow: '0 10px 30px #0002', fontSize: '12px',
    },
  },
    h('b', { style: { fontSize: '13px' } }, 'See how Canvas UI evolves'),
    h('div', { style: { opacity: .5, margin: '6px 0 10px', lineHeight: 1.4 } }, 'Sign up to our newsletter for new shader components.'),
    h('input', { placeholder: 'you@example.com', style: { width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '8px', marginBottom: '8px' } }),
    h('button', { style: { width: '100%', background: '#111', color: '#fff', border: 0, borderRadius: '8px', padding: '8px', fontWeight: 700, cursor: 'pointer' }, onclick: () => toast('signed up') }, 'Signup →'),
  );

  frame.append(site, overlay, newsletter);
  stage.append(topTools, frame);

  frame.addEventListener('pointermove', (e) => {
    const r = frame.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width;
    my = (e.clientY - r.top) / r.height;
  });

  const paintOverlay = (t) => {
    const r = frame.getBoundingClientRect();
    const step = quality === 'High' ? 1 : quality === 'Medium' ? 2 : 3;
    const W = Math.max(160, Math.floor(r.width / step));
    const H = Math.max(100, Math.floor(r.height / step));
    if (overlay.width !== W || overlay.height !== H) { overlay.width = W; overlay.height = H; }
    const g = overlay.getContext('2d');
    const img = g.createImageData(W, H);
    const dens = 1.4 + P.curl * 0.4;
    const spd = 0.15 + P.force * 0.12;
    const rad = P.radius * 1.2;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H;
      const dx = u - mx, dy = v - my;
      const d = Math.hypot(dx, dy);
      let n = N(u * dens + t * spd, v * dens - t * spd * 0.7);
      if (effect === 'Ripple') n = 0.5 + 0.5 * Math.sin(d * (18 + P.swirl * 4) - t * (3 + P.force));
      if (effect === 'VHS') n = ((x + (y % 3) * 7 + (t * 40 | 0)) % 9) / 9 * 0.7 + n * 0.3;
      if (effect === 'ASCII') n = ((Math.sin(u * 40 + t) * Math.cos(v * 30 - t) + 1) / 2);
      if (effect === 'Glass') n = 0.35 + n * 0.4;
      const wake = Math.exp(-d * d / (rad * rad + 0.001)) * P.intensity * 0.35;
      const swirl = Math.sin((Math.atan2(dy, dx) + t) * P.swirl * 0.5) * P.distortion * 0.25;
      const val = clamp(n * P.pressure * 0.5 + wake + swirl, 0, 1);
      const i = (y * W + x) * 4;
      const gray = (val * 220) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = gray;
      img.data[i + 3] = Math.min(255, (40 + val * 140 * (P.blend / 5) * P.trail * P.motion) | 0);
    }
    g.putImageData(img, 0, 0);
    overlay.style.mixBlendMode = effect === 'Glass' ? 'soft-light' : effect === 'VHS' ? 'screen' : 'multiply';
    overlay.style.opacity = effect === 'Glass' ? 0.7 : 0.55;
  };

  const loop = () => {
    const t = (performance.now() - t0) / 1000;
    paintOverlay(t);
    paintThumb();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  root.style.display = 'flex';
  root.append(side, stage);

  window.__demoProof = async () => {
    setEffect('Ripple'); quality = 'High'; qualitySeg.buttons[2].click();
    P.force = 2.2; P.swirl = 6; P.intensity = 3; slMap.force.set(P.force); slMap.swirl.set(P.swirl); slMap.intensity.set(P.intensity);
    await sleep(200);
    setEffect('Glass');
    await sleep(160);
    setEffect('Liquid'); Object.assign(P, defaults);
    for (const [, key] of SL.map((x) => [x[0], x[1]])) slMap[key].set(P[key]);
    quality = 'Medium'; qualitySeg.buttons[1].click();
    return 'cycled Liquid→Ripple→Glass→Liquid with param tweaks; restored defaults';
  };
};


V['tweakcn-theme-editor-desk'] = (root, T) => {
  theme(root, T, { bg: '#f7f7f8', fg: '#111', panel: '#fff', ac: '#111', dark: false, line: '#e5e5e7' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  const tokens = {
    primary: { bg: '#171717', fg: '#fafafa' },
    secondary: { bg: '#f5f5f5', fg: '#171717' },
    accent: { bg: '#f5f5f5', fg: '#171717' },
    base: { bg: '#ffffff', fg: '#171717' },
    card: { bg: '#ffffff', fg: '#171717' },
    muted: { bg: '#f5f5f5', fg: '#737373' },
    destructive: { bg: '#ef4444', fg: '#fafafa' },
  };
  const defaults = JSON.parse(JSON.stringify(tokens));
  let tab = 'Colors';
  let preview = 'Cards';
  let preset = 'Default';
  let darkMode = false;

  const okl = (hex) => {
    try {
      const [L, C, H] = hexToOklch(hex);
      return `oklch(${L.toFixed(3)} ${C.toFixed(2)} ${(H || 0).toFixed(0)})`;
    } catch { return hex; }
  };

  const top = h('div.k-row', {
    style: { height: '48px', padding: '0 16px', background: '#fff', borderBottom: '1px solid #ececee', gap: '12px', flexShrink: 0 },
  },
    h('b', { style: { fontSize: '15px', letterSpacing: '-.02em' } }, 'tweak', h('span', { style: { fontWeight: 500 } }, 'cn')),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '12px', opacity: .5 } }, '★ 10.4k'),
    h('span', { style: { fontSize: '12px', opacity: .5 } }, 'Discord'),
    btn('Export to Figma', () => toast('figma export'), ''),
    btn('Sign In', () => toast('sign in'), ''),
    btn('Sign Up', () => toast('sign up'), 'pri'),
  );

  const side = h('div', {
    style: {
      width: '300px', flexShrink: 0, background: '#fff', borderRight: '1px solid #ececee',
      display: 'flex', flexDirection: 'column', overflow: 'auto', padding: '12px',
    },
  });
  const colorList = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' } });

  const paintColors = () => {
    colorList.replaceChildren(
      h('input', { placeholder: 'Search colors...', style: { width: '100%', border: '1px solid #e5e5e7', borderRadius: '8px', padding: '8px 10px', marginBottom: '4px' } }),
      ...Object.entries(tokens).map(([group, pair]) => {
        const open = group === 'primary' || group === 'secondary' || group === 'accent' || group === 'base';
        const body = h('div', { style: { display: open ? 'grid' : 'none', gap: '6px', padding: '0 0 6px 4px' } });
        for (const [role, key] of [['Background', 'bg'], ['Foreground', 'fg']]) {
          body.append(h('div.k-row', { style: { gap: '8px', fontSize: '12px' } },
            h('input', {
              type: 'color', value: pair[key],
              style: { width: '28px', height: '28px', border: '1px solid #ddd', borderRadius: '6px', padding: 0, background: 'none' },
              oninput: (e) => { pair[key] = e.target.value; paintColors(); paintPreview(); },
            }),
            h('div', { style: { flex: 1, minWidth: 0 } },
              h('div', { style: { fontWeight: 600 } }, role),
              h('div', { style: { font: '11px/1.3 JetBrains Mono Variable,monospace', opacity: .55, overflow: 'hidden', textOverflow: 'ellipsis' } }, okl(pair[key])),
            ),
          ));
        }
        return h('div', { style: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' } },
          h('button', {
            style: {
              width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
              border: 0, background: '#fafafa', cursor: 'pointer', fontWeight: 700, fontSize: '11px', letterSpacing: '.06em',
            },
            onclick: (e) => {
              const b = e.currentTarget.nextSibling;
              b.style.display = b.style.display === 'none' ? 'grid' : 'none';
            },
          }, group.toUpperCase(), h('span', { style: { flex: 1 } }), open ? '▾' : '▸'),
          body,
        );
      }),
    );
  };

  side.append(
    h('div.k-row', { style: { gap: '8px', marginBottom: '8px' } },
      select([['Default', 'Default'], ['Midnight', 'Midnight'], ['Zinc', 'Zinc'], ['Rose', 'Rose']], preset, (v) => {
        preset = v;
        if (v === 'Midnight') {
          tokens.primary = { bg: '#3b82f6', fg: '#fff' }; tokens.secondary = { bg: '#1e293b', fg: '#e2e8f0' };
          tokens.accent = { bg: '#22d3ee', fg: '#082f49' }; tokens.base = { bg: '#0f172a', fg: '#e2e8f0' };
          tokens.card = { bg: '#1e293b', fg: '#e2e8f0' }; tokens.muted = { bg: '#334155', fg: '#94a3b8' };
        } else if (v === 'Rose') {
          tokens.primary = { bg: '#e11d48', fg: '#fff' }; tokens.secondary = { bg: '#ffe4e6', fg: '#881337' };
          tokens.accent = { bg: '#fb7185', fg: '#4c0519' }; tokens.base = { bg: '#fff1f2', fg: '#4c0519' };
          tokens.card = { bg: '#fff', fg: '#4c0519' }; tokens.muted = { bg: '#fecdd3', fg: '#9f1239' };
        } else if (v === 'Zinc') {
          tokens.primary = { bg: '#18181b', fg: '#fafafa' }; tokens.secondary = { bg: '#f4f4f5', fg: '#18181b' };
          tokens.accent = { bg: '#e4e4e7', fg: '#18181b' }; tokens.base = { bg: '#fafafa', fg: '#18181b' };
          tokens.card = { bg: '#fff', fg: '#18181b' }; tokens.muted = { bg: '#f4f4f5', fg: '#71717a' };
        } else {
          Object.assign(tokens, JSON.parse(JSON.stringify(defaults)));
        }
        paintColors(); paintPreview(); toast(v);
      }),
      h('div.k-row', { style: { gap: '4px' } },
        h('i', { style: { width: '12px', height: '12px', borderRadius: '50%', background: tokens.primary.bg } }),
        h('i', { style: { width: '12px', height: '12px', borderRadius: '50%', background: tokens.secondary.bg, border: '1px solid #ddd' } }),
        h('i', { style: { width: '12px', height: '12px', borderRadius: '50%', background: tokens.base.bg, border: '1px solid #ddd' } }),
      ),
    ),
    seg([['Colors', 'Colors'], ['Typography', 'Typography'], ['Other', 'Other'], ['Generate', 'Generate']], tab, (v) => { tab = v; toast(v); }),
    colorList,
    h('span', { style: { flex: 1 } }),
    btn('↻ SYNC', () => { Object.assign(tokens, JSON.parse(JSON.stringify(defaults))); preset = 'Default'; paintColors(); paintPreview(); toast('synced'); }),
  );
  paintColors();

  const main = h('div', { style: { flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', background: '#f7f7f8' } });
  const toolbar = h('div.k-row', { style: { padding: '10px 14px', gap: '8px', borderBottom: '1px solid #ececee', background: '#fff' } },
    toggle('☀', !darkMode, (on) => { darkMode = !on; paintPreview(); }),
    btn('Undo', () => toast('undo'), ''),
    btn('Reset', () => { Object.assign(tokens, JSON.parse(JSON.stringify(defaults))); paintColors(); paintPreview(); }, ''),
    h('span', { style: { flex: 1 } }),
    btn('Import', () => toast('import'), ''),
    btn('Share', () => toast('share'), ''),
    btn('♡ Save', () => toast('saved'), ''),
    btn('{ } Code', () => {
      const css = Object.entries(tokens).map(([k, v]) => `  --${k}: ${v.bg};\n  --${k}-foreground: ${v.fg};`).join('\n');
      copy(`:root {\n${css}\n}`, 'Theme CSS');
    }, 'pri'),
  );
  const previewTabs = h('div.k-row', { style: { padding: '8px 14px', gap: '4px' } });
  const previewHost = h('div', { style: { flex: 1, minHeight: 0, overflow: 'auto', padding: '8px 14px 18px' } });

  const paintPreviewTabs = () => {
    previewTabs.replaceChildren(
      ...['Custom', 'Cards', 'Dashboard', 'Application', 'Marketing'].map((name) => h('button', {
        style: {
          border: 0, background: preview === name ? '#fff' : 'transparent', borderRadius: '8px',
          padding: '6px 12px', fontWeight: preview === name ? 700 : 500, cursor: 'pointer',
          boxShadow: preview === name ? '0 1px 3px #0001' : 'none', fontSize: '13px',
        },
        onclick: () => { preview = name; paintPreviewTabs(); paintPreview(); },
      }, name)),
      h('span', { style: { flex: 1 } }),
      h('span', { style: { fontSize: '11px', opacity: .4 } }, 'Open in v0'),
    );
  };

  const card = (kids) => h('div', {
    style: {
      background: tokens.card.bg, color: tokens.card.fg, border: `1px solid ${tokens.muted.bg}`,
      borderRadius: '12px', padding: '16px', boxShadow: '0 1px 2px #00000008',
    },
  }, ...kids);

  const paintPreview = () => {
    const bg = darkMode ? '#0a0a0a' : tokens.base.bg;
    const fg = darkMode ? '#fafafa' : tokens.base.fg;
    previewHost.style.background = darkMode ? '#111' : '#f0f0f2';
    const spark = (kind) => {
      const cv = h('canvas', { width: 280, height: 80, style: { width: '100%', height: '72px', display: 'block', marginTop: '10px' } });
      const g = cv.getContext('2d');
      g.strokeStyle = tokens.primary.bg; g.fillStyle = tokens.primary.bg + '22'; g.lineWidth = 2;
      g.beginPath();
      for (let i = 0; i <= 20; i++) {
        const x = (i / 20) * 280;
        const y = 50 - Math.sin(i * 0.45) * 22 - (kind === 'area' ? i * 0.6 : 0);
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      if (kind === 'area') { g.lineTo(280, 80); g.lineTo(0, 80); g.closePath(); g.fill(); }
      g.stroke();
      return cv;
    };

    if (preview === 'Dashboard') {
      previewHost.replaceChildren(h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' } },
        card([h('div', { style: { opacity: .55, fontSize: '12px' } }, 'Active users'), h('div', { style: { font: '700 28px Inter Variable' } }, '12,482')]),
        card([h('div', { style: { opacity: .55, fontSize: '12px' } }, 'MRR'), h('div', { style: { font: '700 28px Inter Variable' } }, '$48.2k')]),
        card([h('div', { style: { opacity: .55, fontSize: '12px' } }, 'Churn'), h('div', { style: { font: '700 28px Inter Variable' } }, '2.1%')]),
        h('div', { style: { gridColumn: '1/-1' } }, card([h('b', {}, 'Overview'), spark('area')])),
      ));
      return;
    }
    if (preview === 'Marketing') {
      previewHost.replaceChildren(card([
        h('div', { style: { font: '800 36px/1.1 Inter Variable', letterSpacing: '-.03em', maxWidth: '520px' } }, 'Beautiful themes for shadcn/ui'),
        h('p', { style: { opacity: .6, margin: '12px 0 18px' } }, 'Visual editor · live component preview · export CSS variables.'),
        h('button', { style: { background: tokens.primary.bg, color: tokens.primary.fg, border: 0, borderRadius: '10px', padding: '12px 18px', fontWeight: 700 } }, 'Start editing'),
      ]));
      return;
    }
    // Cards (default) + Custom/Application similar
    previewHost.replaceChildren(h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' } },
      card([
        h('div', { style: { fontSize: '13px', opacity: .55 } }, 'Total Revenue'),
        h('div', { style: { font: '700 28px Inter Variable' } }, '$15,231.89'),
        h('div', { style: { fontSize: '12px', color: '#16a34a', marginTop: '4px' } }, '+20.1% from last month'),
        spark('line'),
      ]),
      card([
        h('div', { style: { fontSize: '13px', opacity: .55 } }, 'Subscriptions'),
        h('div', { style: { font: '700 28px Inter Variable' } }, '+2,350'),
        h('div', { style: { fontSize: '12px', color: '#16a34a', marginTop: '4px' } }, '+180.1% from last month'),
        spark('area'),
      ]),
      card([
        h('b', {}, 'Upgrade your subscription'),
        h('div', { style: { display: 'grid', gap: '8px', marginTop: '12px', fontSize: '12px' } },
          h('label', {}, 'Name', h('input', { value: 'Evil Rabbit', style: { display: 'block', width: '100%', marginTop: '4px', border: '1px solid #e5e5e7', borderRadius: '8px', padding: '8px', background: tokens.base.bg, color: tokens.base.fg } })),
          h('label', {}, 'Email', h('input', { placeholder: 'm@example.com', style: { display: 'block', width: '100%', marginTop: '4px', border: '1px solid #e5e5e7', borderRadius: '8px', padding: '8px' } })),
          h('div.k-row', { style: { gap: '8px' } },
            h('label', { style: { flex: 1 } }, 'Card Number', h('input', { value: '1234 1234 ····', style: { display: 'block', width: '100%', marginTop: '4px', border: '1px solid #e5e5e7', borderRadius: '8px', padding: '8px' } })),
          ),
          h('div.k-row', { style: { gap: '8px', marginTop: '4px' } },
            h('button', {
              style: { flex: 1, border: `2px solid ${tokens.primary.bg}`, borderRadius: '10px', padding: '10px', background: tokens.secondary.bg, fontWeight: 700, cursor: 'pointer' },
              onclick: () => toast('Starter Plan'),
            }, 'Starter Plan'),
            h('button', {
              style: { flex: 1, border: '1px solid #e5e5e7', borderRadius: '10px', padding: '10px', background: '#fff', fontWeight: 600, cursor: 'pointer' },
              onclick: () => toast('Pro Plan'),
            }, 'Pro Plan'),
          ),
        ),
      ]),
      card([
        h('b', {}, 'Create an account'),
        h('div', { style: { display: 'grid', gap: '8px', marginTop: '12px' } },
          h('button', { style: { border: '1px solid #e5e5e7', borderRadius: '8px', padding: '10px', background: '#fff', fontWeight: 600 }, onclick: () => toast('GitHub') }, 'GitHub'),
          h('button', { style: { border: '1px solid #e5e5e7', borderRadius: '8px', padding: '10px', background: '#fff', fontWeight: 600 }, onclick: () => toast('Google') }, 'Google'),
          h('div', { style: { textAlign: 'center', fontSize: '10px', opacity: .45, letterSpacing: '.08em' } }, 'OR CONTINUE WITH'),
          h('input', { placeholder: 'Email', style: { border: '1px solid #e5e5e7', borderRadius: '8px', padding: '10px' } }),
          h('input', { type: 'password', placeholder: 'Password', style: { border: '1px solid #e5e5e7', borderRadius: '8px', padding: '10px' } }),
          h('button', {
            style: { background: tokens.primary.bg, color: tokens.primary.fg, border: 0, borderRadius: '8px', padding: '12px', fontWeight: 700, cursor: 'pointer' },
            onclick: () => toast('account created'),
          }, 'Create account'),
        ),
      ]),
    ));
  };

  paintPreviewTabs();
  paintPreview();
  main.append(toolbar, previewTabs, previewHost);

  root.style.display = 'flex';
  root.style.flexDirection = 'column';
  root.append(top, h('div', { style: { display: 'flex', flex: 1, minHeight: 0 } }, side, main));

  window.__demoProof = async () => {
    tokens.primary = { bg: '#7c3aed', fg: '#fff' };
    tokens.accent = { bg: '#ede9fe', fg: '#5b21b6' };
    paintColors(); paintPreview();
    await sleep(160);
    preview = 'Dashboard'; paintPreviewTabs(); paintPreview();
    await sleep(140);
    preview = 'Cards';
    Object.assign(tokens, JSON.parse(JSON.stringify(defaults)));
    paintColors(); paintPreviewTabs(); paintPreview();
    return 'recolored primary→violet, preview Cards→Dashboard→Cards, restored Default';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['regex-visual-lab'])(root, T); }
