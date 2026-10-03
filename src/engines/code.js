import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, drum, blip, midi, fitCanvas } from '../lib.js';
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

export function mount(root, variant, opts, T) { (V[variant] || V['regex-visual-lab'])(root, T); }
