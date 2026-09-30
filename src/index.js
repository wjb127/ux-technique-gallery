import './index.css';
import { h } from './lib.js';
const app = document.getElementById('app');
const list = await fetch('/techniques.json').then((r) => r.json());
const dates = [...new Set(list.map((t) => t.date))].sort().reverse();
const engines = [...new Set(list.map((t) => t.engine))].sort();
let q = new URLSearchParams(location.search).get('q') || '', eng = '';
const theme = await fetch('/palettes.json').then((r) => r.ok ? r.json() : {}).catch(() => ({}));
const input = h('input', { placeholder: '검색 · Search techniques, products, domains…', value: q, oninput: (e) => { q = e.target.value; render(); } });
const chipBox = h('div.chips');
const meta = h('div.meta');
const body = h('div');
app.append(h('div.wrap', {},
  h('header.mast', {}, h('div', {}, h('h1', {}, 'UX Technique ', h('em', {}, 'Gallery')),
    h('p', {}, '매일 브리핑에서 연구한 UX/UI 기법·클론 타깃을 하나씩 직접 만들어 본 인터랙티브 아카이브. 각 페이지는 원본 제품의 핵심 인터랙션을 재현합니다. This index is also the dedup registry — ', h('a', { href: '/techniques.json' }, '/techniques.json'), '.')),
    h('div.count', {}, h('b', {}, list.length), h('span', {}, `techniques · ${dates[dates.length - 1]} → ${dates[0]}`))),
  h('div.tools', {}, input, meta), h('div', { style: { padding: '10px 0' } }, chipBox), body,
  h('footer', {}, 'Inspired recreations for study only — no trademarked assets. Generated from ux-daily-ledger.json.')));
chipBox.append(...['', ...engines].map((e) => h('button.chip', { 'data-e': e, onclick: () => { eng = e; render(); } }, e || 'all')));
function render() {
  const n = q.trim().toLowerCase();
  const f = list.filter((t) => (!eng || t.engine === eng) && (!n || [t.name, t.short, t.ko, t.product, t.domain, t.id].join(' ').toLowerCase().includes(n)));
  chipBox.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.e === eng));
  meta.textContent = `${f.length} / ${list.length}`;
  body.replaceChildren();
  if (!f.length) body.append(h('div.empty', {}, '결과 없음 — nothing matches “', q, '”'));
  for (const d of dates) {
    const g = f.filter((t) => t.date === d).sort((a, b) => (b.slot || '').localeCompare(a.slot || ''));
    if (!g.length) continue;
    body.append(h('section.day', {}, h('h2', {}, d, h('small', {}, `${g.length} techniques`)),
      g.map((t) => h('a.row', { href: t.path },
        h('span.slot', {}, t.slot === '—' ? '—' : t.slot.replace(/^manual.*/, 'manual')),
        h('span.sw', { style: { background: `linear-gradient(135deg, ${(theme[t.slug] || {}).ac || '#ccc'} 50%, ${(theme[t.slug] || {}).bg || '#eee'} 50%)` } }),
        h('span.nm', {}, h('b', {}, t.short), h('span', {}, `${t.ko} · ${t.product}`)),
        h('span.ref', {}, t.url ? t.url.replace(/^https?:\/\//, '') : 'UX principle'),
        h('span.go', {}, 'OPEN →')))));
  }
}
render();
