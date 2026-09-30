// UI kit shared by engines: themed panels, sliders, selects, code boxes, landing wrapper.
import { h, css, copy } from './lib.js';
css(`
.k-root{position:absolute;inset:0;background:var(--bg);color:var(--fg);font:13px/1.4 var(--font,'Inter Variable',system-ui,sans-serif);overflow:hidden}
.k-root button{font:inherit;cursor:pointer}
.k-panel{background:var(--panel);border:1px solid var(--line);border-radius:var(--r,12px);padding:14px;display:flex;flex-direction:column;gap:12px;overflow:auto}
.k-h{font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.08em;opacity:.65;margin:2px 0}
.k-row{display:flex;align-items:center;gap:8px}
.k-sl{display:grid;grid-template-columns:1fr auto;gap:4px 8px;align-items:center}
.k-sl label{font-size:12px;opacity:.85}.k-sl output{font:600 11px 'JetBrains Mono Variable',ui-monospace,monospace;opacity:.8}
.k-sl input{grid-column:1/-1;width:100%;accent-color:var(--ac)}
.k-btn{border:1px solid var(--line);background:var(--btn,transparent);color:inherit;border-radius:var(--br,8px);padding:7px 11px;font-weight:600}
.k-btn.pri{background:var(--ac);color:var(--acfg,#fff);border-color:transparent}
.k-btn.on{background:var(--fg);color:var(--bg)}
.k-seg{display:flex;border:1px solid var(--line);border-radius:var(--br,8px);overflow:hidden}.k-seg button{flex:1;border:0;background:transparent;color:inherit;padding:7px 8px}.k-seg button.on{background:var(--ac);color:var(--acfg,#fff)}
.k-code{font:12px/1.5 'JetBrains Mono Variable',ui-monospace,monospace;background:var(--codebg,#0d0f14);color:var(--codefg,#d7e3ff);border-radius:10px;padding:12px;white-space:pre-wrap;word-break:break-all;margin:0;max-height:260px;overflow:auto}
.k-sel{font:inherit;padding:6px 8px;border-radius:8px;border:1px solid var(--line);background:var(--panel);color:inherit}
.k-sw{width:26px;height:26px;border-radius:50%;border:2px solid #fff6;cursor:pointer;flex:none}
.k-sw.on{outline:2px solid var(--fg);outline-offset:2px}
.k-land{position:absolute;inset:0;display:grid;overflow:hidden}
.k-land .k-hero h1{font-size:var(--hs,64px);line-height:1;letter-spacing:-.035em;margin:0 0 14px;font-weight:var(--hw,800)}
.k-land .k-hero p{font-size:17px;opacity:.75;max-width:520px;line-height:1.5;margin:0 0 20px}
`);
export function theme(root, T, over = {}) {
  const th = { bg: '#101114', fg: '#eef0f4', panel: '#1a1c21', ac: '#7c5cff', ac2: '#ff5c8a', ac3: '#ffc83d', ...(T.theme || {}), ...over };
  if (!over.line) th.line = th.dark === false && !over.dark ? '#00000018' : '#ffffff1c';
  root.classList.add('k-root');
  for (const [k, v] of Object.entries(th)) if (typeof v === 'string') root.style.setProperty('--' + k, v);
  return th;
}
export function slider(label, min, max, val, step = 1, on = () => {}, fmt = (v) => v) {
  const out = h('output', {}, fmt(val));
  const inp = h('input', { type: 'range', min, max, step, value: val, oninput: (e) => { const v = +e.target.value; out.textContent = fmt(v); on(v); } });
  const w = h('div.k-sl', {}, h('label', {}, label), out, inp); w.input = inp; w.set = (v) => { inp.value = v; out.textContent = fmt(v); on(+v); }; return w;
}
export function seg(opts, val, on) {
  const w = h('div.k-seg'); const bs = opts.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; const b = h('button', { onclick: () => { bs.forEach((x) => x.classList.remove('on')); b.classList.add('on'); on(v); } }, l); if (v === val) b.classList.add('on'); return b; });
  w.append(...bs); w.buttons = bs; return w;
}
export function select(opts, val, on) { const s = h('select.k-sel', { onchange: (e) => on(e.target.value) }, opts.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return h('option', { value: v, selected: v === val }, l); })); return s; }
export function btn(label, on, cls = '') { return h('button.k-btn' + (cls ? '.' + cls : ''), { onclick: on }, label); }
export function codebox(get) { const pre = h('pre.k-code'); const upd = () => (pre.textContent = get()); upd(); pre.update = upd; return pre; }
export function copyBtn(get, label = 'Copy CSS') { return btn(label, () => copy(get()), 'pri'); }
export function panel(title, ...kids) { return h('div.k-panel', {}, title ? h('div.k-h', {}, title) : null, ...kids); }
export function toggle(label, val, on) { const i = h('input', { type: 'checkbox', checked: val, onchange: (e) => on(e.target.checked) }); return h('label.k-row', { style: { cursor: 'pointer' } }, i, label); }
export function grid(root, cols, rows = '1fr', gap = 0) { root.style.display = 'grid'; root.style.gridTemplateColumns = cols; root.style.gridTemplateRows = rows; root.style.gap = gap + 'px'; return root; }
export function fill(el) { Object.assign(el.style, { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }); return el; }
