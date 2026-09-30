import './chrome.css';
import { h } from './lib.js';
const engines = import.meta.glob('./engines/*.js');
const T = JSON.parse(document.getElementById('tg-data').textContent);
const bar = h('header.tg-bar', {},
  h('a.tg-home', { href: '/' }, 'UX Gallery'),
  h('span.tg-name', { title: T.name }, T.product ? `${T.product} ·` : '', ' ', T.short || T.name),
  T.ko ? h('span.tg-ko', {}, T.ko) : null,
  h('span.tg-meta', {}, `${T.date} ${T.slot !== '—' ? T.slot : ''} KST`),
  T.url ? h('a.tg-ref', { href: T.url, target: '_blank', rel: 'noopener' }, '↗ ', T.domain) : h('span.tg-meta', {}, 'principle'),
  h('span.tg-sp'),
  h('button', { onclick: () => cp.classList.toggle('on') }, `✓ ${T.checkpoints.length} checkpoints`));
const cp = h('aside.tg-cp', {}, h('h4', {}, 'Checkpoints covered · 구현 체크포인트'), h('ol', {}, T.checkpoints.map((c) => h('li', {}, c))),
  h('div.src', {}, `source: ${T.checkpoint_source} · engine: ${T.engine}/${T.variant || ''}`));
document.body.prepend(bar, cp);
const root = document.getElementById('demo');
const load = engines[`./engines/${T.engine}.js`];
if (!load) root.append(h('div.tg-fail', {}, `Missing engine ${T.engine}`));
else load().then((m) => m.mount(root, T.variant, T.opts || {}, T)).catch((e) => { console.error(e); root.append(h('div.tg-fail', {}, 'Demo failed: ' + e.message)); throw e; });
