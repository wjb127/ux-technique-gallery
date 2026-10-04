import { h, s, drag, clamp, toast, sleep, rng, pick, copy, css, blip, audio, midi } from '../lib.js';
import { theme, slider, seg, select, btn, toggle } from '../kit.js';
const V = {};
const SERIF = "'Fraunces Variable',Georgia,serif", MONO = "'JetBrains Mono Variable',monospace";
const nav = (logo, links, right, st = {}) => h('div.k-row', { style: { height: '56px', padding: '0 40px', gap: '22px', fontSize: '13px', ...st } }, h('b', { style: { fontSize: '15px' } }, logo), h('span', { style: { flex: 1 } }), ...links.map((l) => h('span', { style: { opacity: .75 } }, l)), h('span', { style: { flex: 1 } }), ...right);
const pill = (t, st = {}) => h('button', { style: { border: 0, borderRadius: '99px', padding: '7px 14px', fontWeight: 600, cursor: 'pointer', ...st } }, t);
const chk = (t, c = 'currentColor') => h('div.k-row', { style: { gap: '8px', padding: '4px 0', fontSize: '13px' } }, h('span', { style: { color: c } }, '✓'), t);
const scroll = (root) => { root.classList.add('scroll'); root.style.overflow = 'auto'; };

V['pricing-tier-cards'] = (root, T) => {
  theme(root, T, { bg: '#08090a', fg: '#f7f8f8', ac: '#5e6ad2', dark: true }); scroll(root);
  let yearly = true; const PL = [['Free', 0, 0, 'Free for everyone', ['Unlimited members', '2 teams', '250 issues', 'Slack and GitHub', 'AI agents']], ['Basic', 10, 12, 'per user/month', ['All Free features +', '5 teams', 'Unlimited issues', 'Unlimited file uploads', 'Admin roles']], ['Business', 16, 19, 'per user/month', ['All Basic features +', 'Unlimited teams', 'Private teams and guests', 'Triage intelligence', 'Linear Insights', 'Linear Asks', 'Zendesk and Intercom']], ['Enterprise', null, null, 'Annual billing only', ['All Business features +', 'Linear Agent', 'Sub-initiatives', 'Advanced authentication', 'SAML and SCIM', 'Uptime SLA']]];
  const cols = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid #ffffff14', margin: '0 60px' } });
  const draw = () => cols.replaceChildren(...PL.map(([n, y, m, sub, f], i) => h('div', { style: { padding: '24px 20px', borderLeft: i ? '1px solid #ffffff14' : '' } }, h('div', { style: { fontSize: '15px', fontWeight: 600 } }, n), h('div', { style: { fontSize: '14px', opacity: .6, margin: '6px 0' } }, y === null ? 'Contact us' : y === 0 ? '$0' : `$${yearly ? y : m} ${sub}`), i && i < 3 ? h('label.k-row', { style: { fontSize: '12px', opacity: .7, gap: '6px', cursor: 'pointer' } }, h('span', { style: { width: '26px', height: '14px', borderRadius: '9px', background: yearly ? '#5e6ad2' : '#333', position: 'relative' }, onclick: () => { yearly = !yearly; draw(); } }, h('span', { style: { position: 'absolute', top: '2px', left: yearly ? '14px' : '2px', width: '10px', height: '10px', borderRadius: '50%', background: '#fff' } })), 'Billed yearly') : h('div', { style: { fontSize: '12px', opacity: .5 } }, sub), h('button', { style: { width: '100%', margin: '18px 0', padding: '8px', borderRadius: '6px', border: '1px solid #ffffff22', background: i === 2 ? '#e6e6e6' : '#1c1d1f', color: i === 2 ? '#000' : '#fff' } }, i === 3 ? 'Request trial' : 'Get started'), ...f.map((x) => chk(x, '#8a8f98')))));
  draw(); root.append(nav('◑ Linear-ish', ['Product', 'Resources', 'Customers', 'Pricing', 'Now', 'Contact'], [h('span', {}, 'Log in'), pill('Sign up', { background: '#fff', color: '#000' })]), h('div', { style: { font: "500 64px/1 'Inter Variable'", padding: '110px 60px 90px', letterSpacing: '-.03em' } }, 'Pricing'), cols);
  window.__demoProof = async () => { yearly = false; draw(); await sleep(50); yearly = true; draw(); return 'yearly/monthly toggle recomputes prices'; };
};
V['pricing-feature-matrix'] = (root, T) => {
  theme(root, T, { bg: '#fafafa', fg: '#171717', ac: '#171717', dark: false }); scroll(root);
  const P = [['Hobby', '$0', 'The perfect starting place for your web app or personal project.', 'Start Deploying', ['Import your repo, deploy in seconds', 'Automatic CI/CD', 'Web Application Firewall', 'Global, automated CDN', 'Fluid compute', 'DDoS Mitigation', 'Traffic & performance insights']], ['Pro', '$20', 'Everything you need to build and scale your app.', 'Start a free trial', ['All Hobby features, plus:', '$20 of included usage credit', 'Advanced spend management', 'Team collaboration & free viewer seats', 'Faster builds + no queues', 'Cold start prevention', 'Enterprise add-ons']], ['Enterprise', 'Custom', 'Critical security, performance, observability, platform SLAs, and support.', 'Get a demo', ['All Pro features, plus:', 'Guest & Team access controls', 'SCIM & Directory Sync', 'Managed WAF Rulesets', 'Multi-region compute & failover', '99.99% SLA', 'Advanced Support']]];
  const rows = [['Deployments', '✓', '✓', '✓'], ['Concurrent builds', '1', '12', 'Custom'], ['Build minutes', '6,000', '24,000', 'Custom'], ['Edge requests', '1M', '10M', 'Custom'], ['Firewall rules', '3', '40', '1000'], ['SAML SSO', '—', 'Add-on', '✓'], ['SLA', '—', '—', '99.99%'], ['Support', 'Community', 'Email', 'Dedicated']];
  let hi = -1; const tbl = h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff' } }); const drawT = () => tbl.replaceChildren(h('tr', {}, h('th', { style: { textAlign: 'left', padding: '12px' } }, 'Compare features'), ...P.map((p) => h('th', { style: { padding: '12px' } }, p[0]))), ...rows.map((r, i) => h('tr', { style: { borderTop: '1px solid #eaeaea', background: i === hi ? '#f0f7ff' : '' }, onmouseenter: () => { hi = i; drawT(); } }, ...r.map((c, j) => h('td', { style: { padding: '10px 12px', textAlign: j ? 'center' : 'left', color: c === '—' ? '#bbb' : '' } }, c)))));
  drawT();
  root.append(nav('▲ Vercel-ish', ['Products', 'Resources', 'Solutions', 'Enterprise', 'Pricing'], [pill('Ask AI', { background: '#fff', border: '1px solid #ddd' }), h('span', {}, 'Log In'), pill('Sign Up', { background: '#171717', color: '#fff' })], { background: '#fff', borderBottom: '1px solid #eaeaea' }), h('div', { style: { maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' } }, h('div', { style: { font: "600 48px/1.05 'Inter Variable'", letterSpacing: '-.04em', marginBottom: '40px' } }, 'Scale your app,', h('br'), 'control your costs'), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '1px solid #eaeaea', background: '#fff' } }, ...P.map(([n, p, d, c, f], i) => h('div', { style: { padding: '24px', borderLeft: i ? '1px solid #eaeaea' : '', display: 'grid', alignContent: 'start', gap: '6px' } }, h('div.k-row', { style: { fontSize: '13px', opacity: .7 } }, n, i === 1 ? h('span', { style: { background: '#e6f0ff', color: '#0060f0', padding: '0 6px', borderRadius: '99px', fontSize: '11px' } }, 'Popular') : ''), h('div', { style: { fontSize: '36px', fontWeight: 600 } }, p, i === 1 ? h('span', { style: { fontSize: '14px', opacity: .6 } }, '/mo + usage') : ''), h('p', { style: { opacity: .6, fontSize: '13px', minHeight: '40px' } }, d), ...f.map((x) => chk(x, '#666')), h('button', { style: { marginTop: '14px', padding: '9px', borderRadius: '99px', border: '1px solid #ddd', background: i === 1 ? '#171717' : '#fff', color: i === 1 ? '#fff' : '#171717', fontWeight: 600 } }, c)))), h('div', { style: { marginTop: '40px', border: '1px solid #eaeaea' } }, tbl)));
  window.__demoProof = async () => { hi = 2; drawT(); return 'tier cards + comparison matrix with row highlight'; };
};
V['pricing-volume-ladder'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#fff', ac: '#fff', dark: true }); scroll(root);
  const STOPS = ['3k', '50k', '100k', '200k', '500k', '1M', '1.5M', '2.5M', '5M', '10M']; const NUM = [3e3, 5e4, 1e5, 2e5, 5e5, 1e6, 1.5e6, 2.5e6, 5e6, 1e7]; let si = 0, kind = 'tx';
  const price = (base, per) => (base === null ? null : Math.round(base + Math.max(0, NUM[si] - per) / 1000 * 0.9));
  const cards = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', maxWidth: '1150px', margin: '30px auto' } });
  const draw = () => { const m = kind === 'tx' ? 1 : 0.8; const C = [['Free', NUM[si] <= 3e3 ? '$0 / mo' : '—', '3,000 emails / mo', ['100 emails / day', '1 domain', 'Ticket support', '1-day data retention']], ['Pro', `$${Math.round(Math.max(20, price(20, 5e4) * m))} / mo`, `${STOPS[Math.max(1, si)]} emails / mo`, ['No daily limit', '10 domains', 'Ticket support', '3-day data retention']], ['Scale', `$${Math.round(Math.max(90, price(90, 1e5) * m))} / mo`, `${STOPS[Math.max(2, si)]} emails / mo`, ['No daily limit', '1,000 domains', 'Slack & ticket support', '7-day data retention', 'Dedicated IP add-on']], ['Enterprise', 'Enterprise', 'Flexible pricing', ['Custom domains', 'Priority support', 'Flexible data retention', 'Dedicated IPs']]]; cards.replaceChildren(...C.map(([n, p, sub, f], i) => h('div', { style: { border: '1px solid #ffffff1c', borderRadius: '14px', padding: '22px', background: i === 1 ? '#0c0c0e' : '' } }, h('div', { style: { fontSize: '13px', opacity: .7 } }, n), h('div', { style: { fontSize: '30px', margin: '24px 0 6px', textAlign: 'center' } }, p), h('div', { style: { fontSize: '12px', opacity: .6, textAlign: 'center', marginBottom: '18px' } }, sub), h('button', { style: { width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ffffff2a', background: i === 1 ? '#fff' : '#111', color: i === 1 ? '#000' : '#fff' } }, i === 3 ? 'Contact us' : 'Get started'), h('div', { style: { marginTop: '18px' } }, ...f.map((x) => chk(x, '#7a7a7a')))))); };
  const rng0 = h('input', { type: 'range', min: 0, max: 9, value: 0, style: { width: '100%', accentColor: '#fff' }, oninput: (e) => { si = +e.target.value; draw(); } });
  root.append(nav('Resend-ish', ['Features', 'Company', 'Resources', 'Help', 'Docs', 'AI', 'Pricing'], [h('span', {}, 'Log in'), pill('Get Started', { background: '#fff', color: '#000' })]), h('div', { style: { textAlign: 'center', paddingTop: '50px' } }, h('div', { style: { font: `400 64px ${SERIF}`, background: 'linear-gradient(#fff,#888)', WebkitBackgroundClip: 'text', color: 'transparent' } }, 'Pricing'), h('p', { style: { opacity: .6 } }, 'Start for free and scale as you grow.'), h('div', { style: { display: 'inline-flex', background: '#111', borderRadius: '10px', padding: '4px', margin: '14px 0' } }, seg([['tx', 'Transactional emails'], ['mk', 'Marketing emails']], 'tx', (v) => { kind = v; draw(); }))), h('div', { style: { maxWidth: '1150px', margin: '20px auto 0' } }, rng0, h('div.k-row', { style: { justifyContent: 'space-between', fontSize: '11px', opacity: .6 } }, ...STOPS.map((x) => h('span', {}, x)))), cards);
  draw();
  window.__demoProof = async () => { si = 5; draw(); const t = cards.textContent.includes('$'); si = 0; draw(); return 'volume slider re-prices tiers ' + t; };
};
V['elegant-checkout-mock'] = (root, T) => {
  theme(root, T, { bg: '#c6c8cf', fg: '#1a1f36', ac: '#635bff', dark: false });
  const opt = (sel, title, sub, feats, art) => h('div', { style: { border: sel ? '2px solid #635bff' : '1px solid #e3e8ee', borderRadius: '10px', padding: '12px', width: '230px', cursor: 'pointer', background: '#fff', boxShadow: sel ? '0 0 0 4px #635bff22' : '' } }, art, h('div', { style: { fontSize: '11px', opacity: .6, marginTop: '10px' } }, sub), h('b', { style: { fontSize: '16px' } }, title), ...feats.map((f) => chk(f, '#635bff')));
  let pickI = 0; const modal = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: '8px', padding: '36px 44px', boxShadow: '0 30px 60px #0003', display: 'grid', gap: '20px', justifyItems: 'center' } });
  const art1 = h('div', { style: { height: '110px', background: 'linear-gradient(135deg,#f5f0ff,#e7e0ff)', borderRadius: '6px', display: 'grid', placeItems: 'center' } }, h('div', { style: { width: '70%', height: '70px', background: '#fff', borderRadius: '4px', boxShadow: '0 4px 10px #0001', display: 'grid', gridTemplateColumns: '1fr 1fr' } }, h('div', { style: { background: '#f7d7b8', margin: '8px' } }), h('div', { style: { padding: '8px', display: 'grid', gap: '4px' } }, h('div', { style: { background: '#e3e8ee', height: '6px' } }), h('div', { style: { background: '#635bff', height: '8px' } }))));
  const art2 = h('div', { style: { height: '110px', display: 'grid', gap: '6px', alignContent: 'center' } }, h('div.k-row', {}, h('span', { style: { background: '#00d66f', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 } }, 'Pay with link'), h('span', { style: { background: '#000', color: '#fff', padding: '4px 14px', borderRadius: '4px', fontSize: '11px' } }, ' Pay')), h('div', { style: { border: '1px solid #e3e8ee', borderRadius: '4px', padding: '6px', fontSize: '11px', opacity: .6 } }, 'Card number  💳'));
  const draw = () => modal.replaceChildren(h('div.k-row', { style: { gap: '20px', alignItems: 'stretch' } }, ...[[art1, 'Full page', 'Pre-built · Low code', ['Customize colors and fonts', 'Supports subscriptions, tax, discounts']], [art2, 'Elements', 'Build · Custom', ['Use custom CSS to match your brand', 'Reduce friction with built-in logic']]].map(([a, t, sb, f], i) => { const o = opt(pickI === i, t, sb, f, a); o.onclick = () => { pickI = i; draw(); }; return o; })), h('button', { style: { background: '#635bff', color: '#fff', border: 0, borderRadius: '4px', padding: '9px 26px', fontWeight: 600 }, onclick: form }, 'Open demo'));
  const form = () => { let card = ''; const err = h('div', { style: { color: '#df1b41', fontSize: '12px', minHeight: '16px' } }); const inp = h('input', { placeholder: '4242 4242 4242 4242', style: { padding: '10px', border: '1px solid #e3e8ee', borderRadius: '6px', width: '100%', font: 'inherit' }, oninput: (e) => { card = e.target.value.replace(/\D/g, '').slice(0, 16); e.target.value = card.replace(/(.{4})/g, '$1 ').trim(); err.textContent = ''; } }); modal.replaceChildren(h('div', { style: { width: '380px', display: 'grid', gap: '10px' } }, h('div.k-row', {}, h('b', {}, 'Pay Pine Co.'), h('span', { style: { flex: 1 } }), h('b', {}, '$129.00')), h('div', { style: { fontSize: '12px', opacity: .6 } }, pickI ? 'Elements embedded in your page' : 'Hosted full-page checkout'), h('input', { placeholder: 'email@example.com', style: { padding: '10px', border: '1px solid #e3e8ee', borderRadius: '6px', font: 'inherit' } }), inp, err, h('button', { style: { background: '#635bff', color: '#fff', border: 0, borderRadius: '6px', padding: '11px', fontWeight: 600 }, onclick: async (e) => { if (card.length < 16) { err.textContent = 'Your card number is incomplete.'; return; } e.target.textContent = 'Processing…'; await sleep(700); modal.replaceChildren(h('div', { style: { textAlign: 'center', padding: '30px' } }, h('div', { style: { fontSize: '40px', color: '#00d66f' } }, '✓'), h('b', {}, 'Payment successful (demo)'), h('div', {}, btn('Back', draw)))); } }, 'Pay $129.00'), btn('← Back', draw))); };
  draw(); root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 30px' } }, h('b', { style: { fontSize: '20px', color: '#635bff' } }, 'stripe-ish'), h('span', { style: { flex: 1 } }), pill('Contact sales', { background: '#635bff', color: '#fff' })), modal);
  window.__demoProof = async () => 'choose Full page / Elements → mock checkout with card validation';
};
V['booking-calendar-slots'] = (root, T) => {
  theme(root, T, { bg: '#f4f4f5', fg: '#111', ac: '#111', dark: false });
  let sel = 17; const SL = ['9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am', '1:00pm', '1:30pm', '2:00pm', '2:30pm', '3:00pm', '3:30pm']; const card = h('div', { style: { position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', background: '#fff', border: '1px solid #e5e5e5', borderRadius: '12px', display: 'grid', gridTemplateColumns: '260px 420px 220px', minHeight: '440px' } });
  const draw = () => { const cal = h('div', { style: { padding: '20px', borderLeft: '1px solid #eee' } }, h('div.k-row', {}, h('b', {}, '9월 2026'), h('span', { style: { flex: 1 } }), '‹  ›'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', marginTop: '14px', fontSize: '12px', textAlign: 'center' } }, ...['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => h('div', { style: { opacity: .6, padding: '6px 0' } }, d)), h('div'), h('div'), ...Array.from({ length: 30 }, (_, i) => { const d = i + 1, av = d >= 15 && (d + 2) % 7 > 1; return h('div', { style: { padding: '14px 0', borderRadius: '6px', background: d === sel ? '#111' : av ? '#f0f0f0' : '', color: d === sel ? '#fff' : av ? '#111' : '#bbb', fontWeight: av ? 600 : 400, cursor: av ? 'pointer' : 'default' }, onclick: () => av && ((sel = d), draw()) }, d); }))); card.replaceChildren(h('div', { style: { padding: '20px', display: 'grid', alignContent: 'start', gap: '8px' } }, h('div', { style: { width: '28px', height: '28px', borderRadius: '50%', background: '#ccc' } }), h('div', { style: { opacity: .6, fontSize: '13px' } }, 'Junbok Wi'), h('b', { style: { fontSize: '20px' } }, '30분 미팅'), h('p', { style: { fontSize: '13px', opacity: .7 } }, '제품 데모와 질문을 위한 30분 통화입니다.'), h('div', { style: { fontSize: '13px' } }, '🕒 30m'), h('div', { style: { fontSize: '13px' } }, '📹 Cal Video'), h('div', { style: { fontSize: '13px' } }, '🌏 Asia/Seoul')), cal, h('div', { style: { padding: '20px', borderLeft: '1px solid #eee', display: 'grid', alignContent: 'start', gap: '8px', overflow: 'auto', maxHeight: '440px' } }, h('div.k-row', {}, h('b', {}, `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(sel + 1) % 7]} ${sel}`), h('span', { style: { flex: 1 } }), h('span', { style: { fontSize: '11px', border: '1px solid #ddd', padding: '2px 6px', borderRadius: '4px' } }, '12h')), ...SL.map((t) => h('button', { style: { padding: '10px', border: '1px solid #e5e5e5', borderRadius: '6px', background: '#fff', fontWeight: 600 }, onclick: () => confirm(t) }, t)))); };
  const confirm = (t) => card.replaceChildren(h('div', { style: { gridColumn: '1/-1', display: 'grid', placeItems: 'center', gap: '10px', padding: '60px' } }, h('div', { style: { fontSize: '36px' } }, '✅'), h('b', { style: { fontSize: '20px' } }, '예약이 확정되었습니다'), h('div', {}, `9월 ${sel}일 ${t} · 30분 미팅`), btn('다른 시간 선택', draw)));
  draw(); root.append(h('div.k-row', { style: { position: 'absolute', top: '14px', right: '24px', fontSize: '12px', gap: '6px' } }, h('span', { style: { border: '1px solid #ddd', padding: '4px 8px', borderRadius: '6px', background: '#fff' } }, '▦ ☰ ⋮')), card, h('b', { style: { position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)' } }, 'Cal.com-ish'));
  window.__demoProof = async () => { sel = 21; draw(); sel = 17; draw(); return 'pick date → slots → confirm'; };
};
V['branded-wallet-flow'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#111', ac: '#111', dark: false }); scroll(root);
  const blob = (x, y, c, sz, face = true) => h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', width: sz + 'px', height: sz + 'px', background: c, borderRadius: '42% 58% 50% 50%', border: '3px solid #111', display: 'grid', placeItems: 'center', fontSize: sz / 3 + 'px', animation: `bob ${2 + Math.random() * 2}s ease-in-out infinite alternate` } }, face ? '◕‿◕' : '');
  const L = [[20, 90, '#57b6ff', 140], [150, 40, '#ff9ecb', 70], [60, 250, '#ffd23f', 80], [190, 200, '#6ee7a8', 60], [-10, 330, '#ff6b4a', 90]], R = [[1200, 80, '#6ee7a8', 130], [1120, 220, '#ffd23f', 90], [1290, 260, '#ff9ecb', 70], [1080, 40, '#ff6b4a', 50], [1250, 340, '#57b6ff', 80]];
  let step = 0; const phone = h('div', { style: { width: '300px', height: '520px', border: '10px solid #111', borderRadius: '40px', margin: '20px auto 80px', padding: '20px', display: 'grid', alignContent: 'start', gap: '12px', background: '#fafafa' } });
  const flows = [() => [h('b', { style: { fontSize: '22px' } }, 'Ξ 2.431'), h('div', { style: { opacity: .6 } }, '$8,210.44'), h('div.k-row', {}, pill('Send', { background: '#111', color: '#fff' }), pill('Receive', { background: '#eee' }))], () => [h('b', {}, 'Send to'), h('input', { value: 'vitalik.eth', style: { padding: '10px', borderRadius: '12px', border: '2px solid #111' } }), h('div', { style: { fontSize: '40px', textAlign: 'center' } }, '0.1 Ξ'), pill('Review', { background: '#111', color: '#fff' })], () => [h('div', { style: { fontSize: '60px', textAlign: 'center' } }, '🎉'), h('b', { style: { textAlign: 'center' } }, 'Sent 0.1 ETH'), pill('Done', { background: '#111', color: '#fff' })]];
  const drawP = () => { phone.replaceChildren(...flows[step]()); phone.querySelectorAll('button').forEach((b) => (b.onclick = () => { step = (step + 1) % 3; drawP(); })); }; drawP();
  root.append(h('style', {}, '@keyframes bob{to{transform:translateY(-12px) rotate(4deg)}}'), nav('▣ Family-ish', ['Developers ▾', 'Resources ▾', '↗ ConnectKit'], [pill('Log In', { background: '#fff', border: '1px solid #ddd' }), pill('Get Started', { background: '#111', color: '#fff' })]), h('div', { style: { position: 'relative', height: '470px' } }, ...L.map((a) => blob(...a)), ...R.map((a) => blob(...a)), h('div', { style: { textAlign: 'center', paddingTop: '90px' } }, h('div', { style: { font: "600 58px/1.05 'Inter Variable'", letterSpacing: '-.03em' } }, 'Your favorite', h('br'), 'crypto wallet.'), h('p', { style: { opacity: .6, maxWidth: '420px', margin: '18px auto' } }, 'Explore Ethereum with the best wallet for iOS. Onboarding with Family has never been easier.'), h('div.k-row', { style: { justifyContent: 'center' } }, pill(' Download for iOS', { background: '#111', color: '#fff' }), pill('▶ Watch the Video', { background: '#f1f1f1' })))), h('div', { style: { textAlign: 'center', fontSize: '30px', fontWeight: 600, marginTop: '30px' } }, 'Explore Ethereum in a whole new way.'), phone);
  window.__demoProof = async () => { step = 1; drawP(); step = 0; drawP(); return 'wallet send flow steps'; };
};
V['cmd-palette-launcher'] = (root, T) => {
  theme(root, T, { bg: '#070708', fg: '#fff', ac: '#ff6363', dark: true });
  const stripes = h('div', { style: { position: 'absolute', left: '50%', top: '40px', width: '900px', height: '600px', marginLeft: '-450px', background: 'repeating-linear-gradient(-55deg,transparent 0 40px,#ff3b3b 40px 70px,transparent 70px 110px)', WebkitMaskImage: 'radial-gradient(ellipse 45% 50% at 50% 45%,#000 20%,transparent 70%)', filter: 'blur(1px)', opacity: .9 } });
  const CMDS = [['🔍', 'Search Files', 'Command'], ['📋', 'Clipboard History', 'Command'], ['🪟', 'Window Management', 'Extension'], ['🧮', 'Calculator', 'Command'], ['😀', 'Search Emoji & Symbols', 'Command'], ['📅', 'My Schedule', 'Calendar'], ['🤖', 'AI Chat', 'AI'], ['⚙️', 'Settings', 'System']];
  let q = '', si = 0; const list = h('div'); const inp = h('input', { placeholder: 'Search for apps and commands…', style: { width: '100%', background: 'none', border: 0, color: '#fff', fontSize: '17px', outline: 'none', padding: '16px' }, oninput: (e) => { q = e.target.value.toLowerCase(); si = 0; drawL(); }, onkeydown: (e) => { const f = CMDS.filter((c) => c[1].toLowerCase().includes(q)); if (e.key === 'ArrowDown') si = Math.min(f.length - 1, si + 1); if (e.key === 'ArrowUp') si = Math.max(0, si - 1); if (e.key === 'Enter' && f[si]) { toast('Run: ' + f[si][1]); close(); } if (e.key === 'Escape') close(); drawL(); } });
  const drawL = () => { const f = CMDS.filter((c) => c[1].toLowerCase().includes(q)); list.replaceChildren(h('div', { style: { fontSize: '11px', opacity: .5, padding: '8px 16px' } }, 'Results'), ...f.map(([ic, n, t], i) => h('div.k-row', { style: { padding: '9px 16px', margin: '0 6px', borderRadius: '8px', background: i === si ? '#ffffff14' : '', gap: '10px' }, onmouseenter: () => { si = i; drawL(); } }, ic, n, h('span', { style: { flex: 1 } }), h('span', { style: { opacity: .5, fontSize: '12px' } }, t))), f.length ? '' : h('div', { style: { padding: '20px', opacity: .5 } }, 'No results')); };
  const pal = h('div', { style: { position: 'absolute', left: '50%', top: '120px', width: '640px', marginLeft: '-320px', background: '#1c1c1ecc', backdropFilter: 'blur(30px)', border: '1px solid #ffffff22', borderRadius: '14px', boxShadow: '0 30px 80px #000', display: 'none', zIndex: 5 } }, inp, h('div', { style: { borderTop: '1px solid #ffffff14' } }), list, h('div.k-row', { style: { borderTop: '1px solid #ffffff14', padding: '8px 16px', fontSize: '12px', opacity: .6 } }, '⌘-ish', h('span', { style: { flex: 1 } }), 'Open ↵', '·', 'Actions ⌘K'));
  const open = () => { pal.style.display = 'block'; q = ''; inp.value = ''; drawL(); setTimeout(() => inp.focus(), 10); }; const close = () => (pal.style.display = 'none');
  addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); } });
  root.append(stripes, nav('◆ Raycast-ish', ['Store', 'Pro', 'AI', 'iOS', 'Windows', 'Teams', 'Developers', 'Blog', 'Pricing'], [h('span', {}, 'Log in'), pill('⬇ Download', { background: '#fff', color: '#000' })], { position: 'relative', zIndex: 2 }), h('div', { style: { position: 'absolute', left: 0, right: 0, top: '380px', textAlign: 'center' } }, h('div', { style: { font: "600 56px/1.1 'Inter Variable'", letterSpacing: '-.02em' } }, 'Your shortcut to', h('br'), 'everything.'), h('p', { style: { opacity: .7, maxWidth: '440px', margin: '16px auto' } }, 'A collection of powerful productivity tools all within an extendable launcher. Fast, ergonomic and reliable.'), h('div', { style: { marginTop: '120px' } }, pill('⌘K  Open launcher', { background: '#fff', color: '#000' }))), pal);
  root.querySelectorAll('button').forEach((b) => b.textContent.includes('Open launcher') && (b.onclick = open));
  window.__demoProof = async () => { open(); inp.value = 'cal'; q = 'cal'; drawL(); await sleep(50); close(); return 'Ctrl/⌘K palette with fuzzy filter + arrows'; };
};
V['elegant-doc-blocks'] = (root, T) => {
  theme(root, T, { bg: '#f7f5f0', fg: '#1b1b1b', ac: '#ff5a1f', dark: false }); scroll(root);
  const blocks = [['h', '프로젝트 노트'], ['p', '이번 주 할 일과 아이디어를 정리합니다.'], ['todo', '디자인 리뷰'], ['todo', 'API 연결'], ['card', '📎 참고 자료'], ['p', '/ 를 눌러 블록을 추가하세요.']];
  const doc = h('div', { style: { padding: '20px 30px', display: 'grid', gap: '6px' } });
  const draw = () => doc.replaceChildren(...blocks.map((b, i) => { const [t, v] = b; const common = { contentEditable: 'true', oninput: (e) => (b[1] = e.target.textContent), onkeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); blocks.splice(i + 1, 0, ['p', '']); draw(); doc.children[i + 1]?.focus(); } if (e.key === '/' ) { e.preventDefault(); blocks.splice(i + 1, 0, ['card', '🧩 새 카드 블록']); draw(); } }, style: { outline: 'none' } }; if (t === 'h') return h('h2', { ...common, style: { ...common.style, margin: '0 0 6px' } }, v); if (t === 'todo') return h('div.k-row', {}, h('input', { type: 'checkbox' }), h('span', common, v)); if (t === 'card') return h('div', { ...common, style: { ...common.style, background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '14px', boxShadow: '0 2px 6px #0001' } }, v); return h('p', { ...common, style: { ...common.style, margin: 0, opacity: v.startsWith('/') ? .5 : 1 } }, v); }));
  draw();
  const cards = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', padding: '10px 20px' } }, ...[['#ffe0e0', '회의록'], ['#e6f3ff', '로드맵'], ['#fff5d6', '읽을거리'], ['#e5f8e8', '여행 계획']].map(([c, t]) => h('div', { style: { background: c, borderRadius: '10px', padding: '12px', height: '80px', fontSize: '13px', fontWeight: 600 } }, t)));
  root.append(h('div', { style: { margin: '14px', borderRadius: '18px', background: 'linear-gradient(#5aa7e8,#a9d6f5 60%,#e8f1f6)', minHeight: '860px', position: 'relative', overflow: 'hidden' } }, nav('CRAFT-ish', ['제품', '솔루션', '리소스', '가격', '다운로드'], [h('span', {}, '로그인'), pill('Craft 무료로 사용하기', { background: '#111', color: '#fff' })], { color: '#111' }), h('div', { style: { textAlign: 'center', padding: '50px 0 30px', color: '#111' } }, h('div', { style: { font: "700 50px/1.2 'Inter Variable'", letterSpacing: '-.02em' } }, '노트, 작업, 아이디어를', h('br'), '위한 나만의 공간'), h('div', { style: { marginTop: '20px' } }, pill('Craft 무료로 체험하기', { background: '#fff' }))), ...[[80, 330, 260], [900, 280, 320], [400, 360, 200]].map(([x, y, w]) => h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: w / 3 + 'px', background: '#fff', borderRadius: '99px', opacity: .8, filter: 'blur(6px)' } })), h('div', { style: { position: 'relative', width: '900px', margin: '60px auto 0', background: '#fbfaf8', borderRadius: '14px', boxShadow: '0 20px 60px #0003', display: 'grid', gridTemplateColumns: '180px 1fr', minHeight: '440px' } }, h('div', { style: { borderRight: '1px solid #eee', padding: '14px', fontSize: '13px', display: 'grid', alignContent: 'start', gap: '8px' } }, h('b', {}, '📂 All Docs'), '📅 Daily Notes', '✅ Tasks', '⭐ Starred', '🗑 Trash'), h('div', {}, cards, doc))));
  window.__demoProof = async () => { blocks.push(['card', '🧩 새 카드 블록']); draw(); blocks.pop(); draw(); return 'editable doc blocks (Enter adds, / inserts card)'; };
};
const tile = (seed, w = 200, hh = 200) => { const r = rng(seed); const hue = Math.floor(r() * 360); const kind = Math.floor(r() * 4); const bg = kind === 0 ? `linear-gradient(${r() * 360}deg,hsl(${hue} 30% 70%),hsl(${hue + 40} 40% 30%))` : kind === 1 ? `radial-gradient(circle at ${r() * 100}% ${r() * 100}%,hsl(${hue} 60% 70%),hsl(${hue} 20% 15%))` : kind === 2 ? `repeating-linear-gradient(${r() * 180}deg,hsl(${hue} 10% 90%) 0 ${4 + r() * 10}px,hsl(${hue} 10% 20%) 0 ${8 + r() * 20}px)` : `hsl(${hue} ${r() * 30}% ${20 + r() * 70}%)`; return { hue, bg, h: Math.round(hh * (0.7 + r() * 0.8)) }; };
V['visual-mosaic-discover'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#111', ac: '#111', dark: false }); scroll(root);
  const CH = ['전체', '건축', '그래픽', '타이포그래피', '패션', '사진', '인테리어', '일러스트', '제품', '자연', '모션', 'UI']; let cat = 0, saved = new Set();
  const grid = h('div', { style: { columns: '6 200px', columnGap: '14px', padding: '0 24px' } });
  const draw = () => grid.replaceChildren(...Array.from({ length: 36 }, (_, i) => { const t = tile(i * 7 + cat * 101); return h('div', { style: { breakInside: 'avoid', marginBottom: '14px', position: 'relative', cursor: 'zoom-in' }, onclick: () => { saved.has(i) ? saved.delete(i) : saved.add(i); toast(saved.has(i) ? '클러스터에 저장됨' : '저장 취소'); draw(); } }, h('div', { style: { height: t.h + 'px', background: t.bg, borderRadius: '4px' } }), saved.has(i) ? h('span', { style: { position: 'absolute', top: '8px', right: '8px', background: '#111', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '99px' } }, '저장됨') : ''); }));
  const chips = h('div.k-row', { style: { padding: '8px 24px', gap: '6px', overflow: 'hidden' } }); const drawC = () => chips.replaceChildren(...CH.map((c, i) => h('span', { style: { padding: '6px 14px', borderRadius: '99px', background: i === cat ? '#111' : '#f2f2f2', color: i === cat ? '#fff' : '#111', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }, onclick: () => { cat = i; drawC(); draw(); } }, c)));
  drawC(); draw();
  root.append(h('div.k-row', { style: { height: '60px', padding: '0 24px', gap: '16px', fontSize: '14px' } }, h('b', { style: { fontSize: '18px' } }, '✺'), h('b', {}, '탐색'), 'Magazine', '가격', h('span', { style: { flex: 1 } }), h('div', { style: { width: '460px', background: '#f2f2f2', borderRadius: '99px', padding: '9px 16px', opacity: .7 } }, '🔍 Cosmos-ish 검색'), h('span', { style: { flex: 1 } }), 'Log in', pill('Sign up', { background: '#111', color: '#fff' })), chips, h('b', { style: { display: 'block', padding: '12px 24px' } }, 'Connect 추천'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '14px', padding: '0 24px 20px' } }, ...Array.from({ length: 6 }, (_, i) => h('div', {}, h('div', { style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2px', height: '110px', borderRadius: '8px', overflow: 'hidden' } }, h('div', { style: { background: tile(900 + i).bg } }), h('div', { style: { display: 'grid', gap: '2px' } }, h('div', { style: { background: tile(950 + i).bg } }), h('div', { style: { background: tile(990 + i).bg } }))), h('div', { style: { fontSize: '12px', fontWeight: 600, marginTop: '6px' } }, ['Sequence 01', 'Softer than the album', 'The group show', 'aesthetic', 'objects', 'light study'][i])))), h('b', { style: { display: 'block', padding: '12px 24px' } }, '최근 인기'), grid);
  window.__demoProof = async () => { cat = 3; drawC(); draw(); cat = 0; drawC(); draw(); return 'category chips re-shuffle masonry; click saves'; };
};
V['visual-similarity-mosaic-search'] = (root, T) => {
  theme(root, T, { bg: '#555555', fg: '#eee', ac: '#fff', dark: true }); scroll(root);
  const all = Array.from({ length: 120 }, (_, i) => ({ i, ...tile(i * 13 + 5) })); let q = null;
  const grid = h('div', { style: { columns: '8 150px', columnGap: '4px', padding: '4px' } });
  const draw = () => { const list = q === null ? all : [...all].sort((a, b) => Math.min(Math.abs(a.hue - q), 360 - Math.abs(a.hue - q)) - Math.min(Math.abs(b.hue - q), 360 - Math.abs(b.hue - q))); grid.replaceChildren(...list.slice(0, 80).map((t) => h('div', { style: { height: t.h * 0.8 + 'px', background: t.bg, marginBottom: '4px', breakInside: 'avoid', cursor: 'pointer', outline: q === t.hue ? '3px solid #fff' : '' }, onclick: () => { q = t.hue; draw(); root.scrollTop = 0; } }))); };
  draw();
  const modal = h('div', { style: { position: 'fixed', inset: 'var(--tg-h,38px) 0 0 0', background: '#555555e8', display: 'grid', placeItems: 'center', zIndex: 20 } }, h('div', { style: { background: '#e8e8e8', color: '#222', width: '420px', padding: '24px', textAlign: 'center', borderRadius: '3px', fontSize: '14px', lineHeight: 1.6 } }, h('div', { style: { fontSize: '16px', marginBottom: '10px' } }, 'Welcome!'), h('p', {}, 'Same Energy-ish is in beta. Click any image to find visually similar images (colour/texture neighbours).'), h('p', {}, 'Thanks for trying the beta!'), h('button', { style: { border: '1px solid #999', background: '#fff', padding: '4px 14px' }, onclick: () => modal.remove() }, 'Close')));
  root.append(h('div.k-row', { style: { height: '40px', padding: '0 12px', fontSize: '13px', gap: '16px', background: '#444' } }, h('b', {}, 'same energy-ish'), 'Feeds', 'Search', h('span', { style: { flex: 1 } }), btn('Reset', () => { q = null; draw(); })), grid, modal);
  window.__demoProof = async () => { q = all[3].hue; draw(); q = null; draw(); return 'click image → mosaic re-sorted by similarity'; };
};
V['spatial-sticky-card-canvas'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#111', ac: '#00d67a', dark: false });
  const board = h('div', { style: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#0000000f 1px,transparent 1px)', backgroundSize: '24px 24px' } });
  const CARDS = [[520, 190, 'Kinopio-ish is a spatial thinking tool', '#b4f5d2'], [680, 190, 'drag cards around', '#fff'], [540, 250, 'double-click to add', '#fff'], [680, 240, '🏷 ideas', '#ffd6f5'], [560, 300, 'connect related thoughts', '#fff'], [700, 300, '📷 moodboard', '#dbeafe'], [520, 360, 'journaling, planning, notes', '#fff'], [700, 360, '🎨 color me', '#fef3c7'], [600, 420, 'try it ↓', '#b4f5d2']];
  const lines = s('svg', { style: 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none' }); board.append(lines); const els = [];
  const link = () => { lines.replaceChildren(...els.slice(1).map((e, i) => { const a = els[i]; return s('path', { d: `M${a.offsetLeft + 60},${a.offsetTop + 14} C${a.offsetLeft + 60},${e.offsetTop - 20} ${e.offsetLeft + 60},${a.offsetTop + 40} ${e.offsetLeft + 60},${e.offsetTop + 14}`, stroke: '#c084fc', fill: 'none', 'stroke-width': 2, opacity: i % 2 ? 0 : .7 }); })); };
  const add = (x, y, t, c = '#fff') => { const el = h('div', { contentEditable: 'true', style: { position: 'absolute', left: x + 'px', top: y + 'px', background: c, border: '1px solid #0002', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', boxShadow: '0 2px 0 #0001', cursor: 'grab', maxWidth: '180px', outline: 'none' } }, t); let ox, oy; drag(el, { start: (e) => { ox = e.clientX - el.offsetLeft; oy = e.clientY - el.offsetTop; }, move: (e) => { el.style.left = e.clientX - ox + 'px'; el.style.top = e.clientY - oy + 'px'; link(); } }); board.append(el); els.push(el); link(); return el; };
  CARDS.forEach((c) => add(...c));
  board.addEventListener('dblclick', (e) => { if (e.target !== board) return; const b = board.getBoundingClientRect(); add(e.clientX - b.left, e.clientY - b.top, 'new card').focus(); });
  root.append(board, h('div', { style: { position: 'absolute', left: '520px', top: '60px' } }, h('div', { style: { font: "900 italic 44px 'Inter Variable'", letterSpacing: '-.03em' } }, 'KINOPIO-ish ', h('span', { style: { fontSize: '14px', fontStyle: 'normal' } }, 'SPATIAL THINKING')), h('div', { style: { fontSize: '12px', opacity: .7 } }, 'For Moodboards, Whiteboards, Mind Maps, and Notes')), h('div.k-row', { style: { position: 'absolute', top: '10px', right: '14px', gap: '6px' } }, pill('Pricing', { background: '#eee', fontSize: '11px' }), pill('Help', { background: '#eee', fontSize: '11px' }), pill('Sign Up / In', { background: '#00d67a', fontSize: '11px' })), h('div', { style: { position: 'absolute', left: '520px', top: '480px', fontSize: '12px', opacity: .8, maxWidth: '360px' } }, 'Double-click anywhere to add a card. Drag cards to arrange your thoughts.'));
  window.__demoProof = async () => { const e = add(900, 500, 'proof card'); e.remove(); els.pop(); link(); return 'draggable cards with connections, dblclick adds'; };
};
V['drifting-art-attic-canvas'] = (root, T) => {
  theme(root, T, { bg: '#efe6d4', fg: '#3a2e22', ac: '#e8b93a', dark: false });
  root.style.backgroundImage = 'radial-gradient(#0000000a 1px,transparent 1px)'; root.style.backgroundSize = '5px 5px';
  const items = []; const W = () => root.clientWidth, H = () => root.clientHeight;
  const card = (x, y, rot, content, w = 200) => { const el = h('div', { style: { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', background: '#fbf6ea', border: '1px solid #d9ccb2', boxShadow: '4px 6px 14px #0002', padding: '12px', transform: `rotate(${rot}deg)`, cursor: 'grab', fontFamily: SERIF } }, content); const it = { el, x, y, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15, rot, held: false }; let ox, oy; drag(el, { start: (e) => { it.held = true; ox = e.clientX - it.x; oy = e.clientY - it.y; root.append(el); }, move: (e) => { it.x = e.clientX - ox; it.y = e.clientY - oy; }, end: () => (it.held = false) }); items.push(it); root.append(el); return it; };
  card(470, 80, -1, h('div', { style: { textAlign: 'center', fontStyle: 'italic' } }, 'The Hearth'), 120);
  card(380, 200, -4, h('div', {}, h('div', { style: { fontSize: '30px', fontStyle: 'italic', color: '#5a3e2a' } }, 'the drifting atelier'), h('div', { style: { fontSize: '11px', opacity: .7, fontFamily: MONO } }, 'a slow room of wandering pictures'), h('div.k-row', { style: { gap: '8px', marginTop: '20px' } }, h('button', { style: { background: '#f3cf58', border: '1px solid #b8942a', padding: '8px 12px' }, onclick: () => spawn() }, '+ hang a drawing'), h('button', { style: { background: '#f3cf58', border: '1px solid #b8942a', padding: '8px 12px' }, onclick: () => items.forEach((i) => { i.vx = (Math.random() - 0.5) * 2; i.vy = (Math.random() - 0.5) * 2; }) }, '≈ stir the air')), h('div', { style: { background: '#f3cf58', border: '1px solid #b8942a', padding: '8px', marginTop: '10px', textAlign: 'center' } }, 'enter →')), 360);
  const spawn = () => { const c = h('canvas', { width: 140, height: 100 }); const g = c.getContext('2d'); const r = rng(Math.random() * 1e6); g.fillStyle = '#fffaf0'; g.fillRect(0, 0, 140, 100); g.strokeStyle = `hsl(${r() * 60 + 10} 50% 35%)`; g.lineWidth = 2; g.beginPath(); for (let k = 0; k < 20; k++) g.lineTo(r() * 140, r() * 100); g.stroke(); card(Math.random() * (W() - 200), Math.random() * (H() - 160), (Math.random() - 0.5) * 12, c, 160); };
  for (let i = 0; i < 5; i++) spawn();
  const loop = () => { items.forEach((it) => { if (!it.held) { it.x += it.vx; it.y += it.vy; it.vx *= 0.995; it.vy *= 0.995; it.vx += (Math.random() - 0.5) * 0.01; it.vy += (Math.random() - 0.5) * 0.01; if (it.x < 0 || it.x > W() - 150) it.vx *= -1; if (it.y < 0 || it.y > H() - 120) it.vy *= -1; } it.el.style.left = it.x + 'px'; it.el.style.top = it.y + 'px'; }); requestAnimationFrame(loop); }; loop();
  window.__demoProof = async () => { spawn(); return 'drifting draggable art cards; hang/stir'; };
};
V['scroll-depth-explorer'] = (root, T) => {
  theme(root, T, { bg: '#7fc4ec', fg: '#fff', ac: '#fff', dark: true }); scroll(root);
  const CREAT = [[200, '🐬 Dolphin'], [500, '🐢 Sea turtle'], [1000, '🦈 Great white shark'], [2000, '🦑 Giant squid'], [3000, '🐋 Sperm whale'], [4000, '🐟 Anglerfish'], [6000, '🦐 Amphipod'], [8000, '🐌 Snailfish'], [10994, '⚓ Challenger Deep']];
  const PX = 0.9; const total = 11000 * PX + 900;
  const col = (d) => { const t = Math.min(1, d / 1200); return `hsl(${200 + t * 20} ${70 - t * 30}% ${Math.max(2, 45 - t * 43)}%)`; };
  const sea = h('div', { style: { position: 'relative', height: total + 'px', background: `linear-gradient(#1aa0b8 0,${col(200)} ${200 * PX}px,${col(600)} ${600 * PX}px,${col(1200)} ${1200 * PX}px,#010308 ${total}px)` } }, ...CREAT.map(([d, n]) => h('div', { style: { position: 'absolute', top: d * PX + 300 + 'px', left: 30 + ((d * 7) % 50) + '%', fontSize: '20px', color: '#dff' } }, h('div', { style: { fontSize: '44px' } }, n.split(' ')[0]), n.split(' ').slice(1).join(' '), h('div', { style: { fontSize: '12px', opacity: .7 } }, d + 'm'))));
  const meter = h('div', { style: { position: 'sticky', top: '20px', marginLeft: 'calc(100% - 140px)', width: '110px', textAlign: 'right', zIndex: 3, font: `600 20px ${MONO}`, height: 0 } }, '0m');
  root.addEventListener('scroll', () => { const d = Math.max(0, Math.round((root.scrollTop - 700) / PX)); meter.textContent = d + 'm'; });
  root.append(meter, h('div', { style: { height: '700px', background: 'linear-gradient(#7fc4ec,#9fd6ef)', position: 'relative', textAlign: 'center' } }, h('b', { style: { position: 'absolute', left: '20px', top: '14px', fontSize: '18px', color: '#123' } }, 'NEAL.FUN-ish'), h('div', { style: { paddingTop: '230px', color: '#1d3557', font: "600 64px 'Inter Variable'" } }, 'The Deep Sea'), h('div', { style: { color: '#1d3557', opacity: .8 } }, 'scroll to dive ↓'), s('svg', { viewBox: '0 0 1440 120', preserveAspectRatio: 'none', style: 'position:absolute;bottom:0;left:0;width:100%;height:160px' }, s('path', { d: 'M0,60 C240,0 480,120 720,60 C960,0 1200,120 1440,60 L1440,120 L0,120Z', fill: '#1aa0b8' }))), sea);
  window.__demoProof = async () => { root.scrollTop = 1500; root.dispatchEvent(new Event('scroll')); await sleep(50); const t = meter.textContent; root.scrollTop = 0; return 'depth meter ' + t; };
};
V['mechanical-watch-explainer'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#333', ac: '#2360c6', dark: false }); scroll(root);
  const c = h('canvas', { width: 1200, height: 800, style: { width: '600px', height: '400px', display: 'block', margin: '0 auto', background: '#f7f7f7', borderRadius: '8px' } }); let speed = 1, t = 0, show = { gears: true, balance: true };
  const gear = (g, x, y, r, n, a, col) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = col; g.beginPath(); for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? r : r + 10; const an = (i / (n * 2)) * Math.PI * 2; g.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } g.closePath(); g.fill(); g.fillStyle = '#f7f7f7'; g.beginPath(); g.arc(0, 0, r * 0.25, 0, 7); g.fill(); for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.fillRect(r * 0.3, -6, r * 0.5, 12); } g.restore(); };
  const draw = () => { t += 0.016 * speed; const g = c.getContext('2d'); g.clearRect(0, 0, 1200, 800); if (show.gears) { gear(g, 450, 420, 150, 30, t * 0.3, '#c9a86a'); gear(g, 650, 280, 70, 14, -t * 0.3 * 30 / 14, '#b8b8c0'); gear(g, 760, 480, 90, 18, t * 0.3 * 30 / 18 * 0.9, '#d4b980'); } if (show.balance) { const a = Math.sin(t * 8) * 1.8; g.save(); g.translate(950, 300); g.rotate(a); g.strokeStyle = '#555'; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 110, 0, 7); g.stroke(); for (let k = 0; k < 3; k++) { g.rotate(Math.PI * 2 / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(110, 0); g.stroke(); } g.restore(); g.strokeStyle = '#2360c6'; g.lineWidth = 2; g.beginPath(); for (let k = 0; k < 400; k++) { const an = k * 0.08, rr = 8 + k * 0.2 * (1 + Math.sin(t * 8) * 0.08); g.lineTo(950 + Math.cos(an) * rr, 300 + Math.sin(an) * rr); } g.stroke(); } requestAnimationFrame(draw); }; draw();
  root.append(h('div', { style: { background: '#2360c6', color: '#fff', padding: '30px 0 18px' } }, h('div', { style: { maxWidth: '640px', margin: '0 auto' } }, h('div', { style: { font: "600 34px 'Inter Variable'" } }, 'Bartosz-style Explainer'), h('div.k-row', { style: { fontSize: '13px', gap: '20px', marginTop: '14px' } }, 'Blog', 'Archives', h('span', { style: { flex: 1 } }), '✉ 𝕏 ◎ ♥ ⚲'))), h('article', { style: { maxWidth: '640px', margin: '0 auto', padding: '30px 0 80px', fontSize: '17px', lineHeight: 1.7 } }, h('div', { style: { fontSize: '13px', opacity: .6 } }, 'May 4, 2022-ish'), h('h1', { style: { fontSize: '30px' } }, 'Mechanical Watch'), h('p', {}, 'In the world of quartz and smartwatches, a purely mechanical watch may seem like a relic. Yet its tiny gear train and oscillating balance wheel keep astonishingly good time.'), h('p', {}, 'Drag the slider to change the speed and toggle parts to see how the gear train and the balance wheel cooperate.'), c, h('div.k-row', { style: { justifyContent: 'center', gap: '20px', margin: '12px 0', fontSize: '14px' } }, slider('Speed', 0, 3, 1, 0.01, (v) => (speed = v)), toggle('Gear train', true, (v) => (show.gears = v)), toggle('Balance wheel', true, (v) => (show.balance = v))), h('p', {}, 'The mainspring stores energy; the escapement releases it in tiny, regular impulses, each one nudging the balance wheel back and forth.')));
  window.__demoProof = async () => { speed = 2; await sleep(100); speed = 1; return 'interactive gear train + balance wheel with slider'; };
};
V['transformer-attention-explainer'] = (root, T) => {
  theme(root, T, { bg: '#f8f4ec', fg: '#2b2b2b', ac: '#b3541e', dark: false }); scroll(root); root.style.fontFamily = SERIF;
  const TOK = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'warm']; let q = 7, head = 0;
  const att = (i, j) => { const r = rng(i * 31 + j * 7 + head * 131); let v = r() * 0.3 + (i === j ? 0.2 : 0); if (head === 0 && i === 7 && j === 5) v += 1.2; if (head === 0 && i === 7 && j === 1) v += 0.7; if (head === 1 && j === i - 1) v += 1; if (j > i) v = 0; return v; };
  const box = h('div'); const draw = () => { const row = TOK.map((_, j) => att(q, j)); const sm = row.reduce((a, b) => a + b, 0); box.replaceChildren(h('div.k-row', { style: { flexWrap: 'wrap', gap: '6px', margin: '14px 0', fontFamily: MONO, fontSize: '14px' } }, ...TOK.map((t, j) => h('span', { style: { padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', border: j === q ? '2px solid #2b2b2b' : '2px solid transparent', background: `rgba(179,84,30,${row[j] / sm * 1.8})` }, onclick: () => { q = j; draw(); } }, t))), h('div', { style: { display: 'grid', gridTemplateColumns: `60px repeat(${TOK.length},1fr)`, gap: '2px', fontFamily: MONO, fontSize: '10px' } }, h('span'), ...TOK.map((t) => h('span', { style: { textAlign: 'center' } }, t)), ...TOK.flatMap((t, i) => { const r0 = TOK.map((_, j) => att(i, j)); const s0 = r0.reduce((a, b) => a + b, 0); return [h('span', { style: { fontWeight: i === q ? 700 : 400 } }, t), ...r0.map((v) => h('span', { style: { height: '22px', background: `rgba(179,84,30,${v / s0 * 1.6})`, outline: i === q ? '1px solid #2b2b2b' : '' } }))]; }))); }; draw();
  root.append(h('div', { style: { maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 200px', gap: '60px', padding: '60px 20px' } }, h('article', { style: { fontSize: '16px', lineHeight: 1.7 } }, h('div', { style: { font: `700 28px ${SERIF}` } }, 'onehop-ish'), h('div', { style: { fontStyle: 'italic', opacity: .7 } }, 'an interactive reading of "Attention Is All You Need"'), h('div', { style: { fontFamily: MONO, fontSize: '11px', opacity: .6, margin: '8px 0 30px' } }, 'READING TIME ~ 12 MIN · INTERACTIVE'), h('p', {}, 'In 2017, a paper from Google proposed discarding recurrence from sequence models entirely. The replacement is ', h('i', {}, 'attention'), ': each token looks at every earlier token and decides how much of it to borrow.'), h('p', {}, 'Click a token below to make it the query. Its row in the matrix shows where it looks. Switch heads to see different learned patterns.'), h('h3', {}, '§1  One hop'), seg([[0, 'Head 0 · coreference'], [1, 'Head 1 · previous token']], 0, (v) => { head = v; draw(); }), box, h('p', {}, 'Notice how “it” attends strongly to “mat” in head 0 — the model resolves the pronoun in a single hop.')), h('aside', { style: { fontFamily: MONO, fontSize: '11px', lineHeight: 1.9, position: 'sticky', top: '30px', alignSelf: 'start', opacity: .8 } }, h('b', {}, 'ON THIS PAGE'), h('div', {}, '§0 Introduction'), h('div', {}, '§1 One hop'), h('div', {}, '§2 Multi-head'), h('div', {}, '§3 Positional encoding'), h('div', {}, '§4 Putting it together'))));
  window.__demoProof = async () => { q = 3; draw(); q = 7; draw(); return 'click-token attention heatmap with head switch'; };
};
V['slide-deck-workspace'] = (root, T) => {
  theme(root, T, { bg: '#5b2bd9', fg: '#fff', ac: '#e3ff5c', dark: true }); scroll(root);
  root.style.background = 'radial-gradient(ellipse at 30% 20%,#8a4dff,transparent 60%),radial-gradient(ellipse at 80% 70%,#3a1fb0,transparent 60%),#5b2bd9';
  const ghosts = Array.from({ length: 14 }, (_, i) => h('div', { style: { position: 'absolute', left: (i * 173) % 1400 + 'px', top: 60 + ((i * 97) % 600) + 'px', width: '180px', height: '100px', background: '#ffffff10', border: '1px solid #ffffff14', borderRadius: '6px' } }));
  const out = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', maxWidth: '980px', margin: '30px auto', position: 'relative' } });
  const LAY = [(t) => [h('div', { style: { fontSize: '22px', fontWeight: 800 } }, t)], (t) => [h('b', {}, 'Problem'), h('div', { style: { fontSize: '11px', opacity: .7 } }, '• ' + t + ' is hard today')], (t) => [h('b', {}, 'Solution'), h('div', { style: { height: '40px', background: '#e3ff5c', borderRadius: '4px' } })], (t) => [h('b', {}, 'Market'), h('div.k-row', { style: { alignItems: 'end', height: '40px', gap: '4px' } }, ...[10, 20, 32, 40].map((v) => h('div', { style: { width: '14px', height: v + 'px', background: '#7c4dff' } })))], (t) => [h('b', {}, 'Traction'), h('div', { style: { fontSize: '28px', fontWeight: 800, color: '#7c4dff' } }, '+240%')], (t) => [h('b', {}, 'Team'), h('div.k-row', {}, ...[1, 2, 3].map(() => h('span', { style: { width: '22px', height: '22px', borderRadius: '50%', background: '#ccc' } })))], (t) => [h('b', {}, 'Roadmap'), h('div', { style: { height: '3px', background: '#7c4dff', marginTop: '20px' } })], (t) => [h('div', { style: { fontSize: '18px', fontWeight: 800 } }, 'Thank you')]];
  const gen = async (t) => { out.replaceChildren(); for (let i = 0; i < 8; i++) { await sleep(90); out.append(h('div', { style: { aspectRatio: '16/9', background: i ? '#fff' : '#1b1b1f', color: i ? '#111' : '#fff', borderRadius: '8px', padding: '12px', display: 'grid', alignContent: 'start', gap: '6px', boxShadow: '0 10px 30px #0003', animation: 'pop .3s' } }, ...LAY[i](t || 'Untitled'))); } };
  const inp = h('textarea', { placeholder: 'Describe a deck: “A pitch deck for a coffee subscription startup”', style: { width: '100%', height: '70px', background: 'none', border: 0, color: '#fff', font: 'inherit', fontSize: '15px', resize: 'none', outline: 'none' } });
  root.append(h('style', {}, '@keyframes pop{from{transform:scale(.9);opacity:0}}'), h('div', { style: { background: '#c9b8ff', color: '#2a1070', textAlign: 'center', fontSize: '12px', padding: '6px' } }, 'New! AI generation is here — try it below →'), ...ghosts, nav('▰ Pitch-ish', ['Product ▾', 'Use Cases ▾', 'Templates ▾', 'Resources ▾', 'Pricing'], [pill('Log in', { background: '#fff', color: '#000' }), pill('Sign up', { background: '#e3ff5c', color: '#000' })], { position: 'relative' }), h('div', { style: { position: 'relative', textAlign: 'center', paddingTop: '60px' } }, h('div', { style: { font: "800 96px/0.95 'Inter Variable'", letterSpacing: '-.04em' } }, 'Create slides', h('br'), 'that win.'), h('div', { style: { width: '560px', margin: '40px auto 0', background: '#ffffff1f', border: '1px solid #ffffff55', borderRadius: '14px', padding: '14px', textAlign: 'left', backdropFilter: 'blur(10px)' } }, inp, h('div.k-row', {}, h('span', { style: { fontSize: '12px', opacity: .8 } }, '▦ 10 slides'), h('span', { style: { flex: 1 } }), h('button', { style: { background: '#c9b8ff', border: 0, borderRadius: '8px', padding: '7px 14px', fontWeight: 700 }, onclick: () => gen(inp.value) }, 'Generate →'))), h('p', { style: { opacity: .8, fontSize: '13px' } }, 'From prompt to presentation. AI-drafted decks you can refine together.')), out);
  window.__demoProof = async () => { await gen('Coffee startup'); const n = out.children.length; out.replaceChildren(); return 'prompt → ' + n + ' slide thumbnails'; };
};

V['sonner-toast-desk'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#161616', panel: '#fcfcfc', ac: '#171717', dark: false });
  scroll(root);
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  css(`
  @keyframes sn-in{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:none}}
  @keyframes sn-out{to{opacity:0;transform:translateY(8px) scale(.96)}}
  .sn-toast{animation:sn-in .35s cubic-bezier(.22,1.2,.36,1) both;pointer-events:auto}
  .sn-toast.leaving{animation:sn-out .22s ease forwards}
  .sn-stack:hover .sn-toast{transform:none!important;margin-bottom:8px!important;scale:1!important}
  `);

  const TYPES = [
    { id: 'default', label: 'Default', title: 'Event has been created', desc: 'Monday, January 3rd at 6:00pm' },
    { id: 'success', label: 'Success', title: 'Event has been created', desc: null, color: '#16a34a' },
    { id: 'error', label: 'Error', title: 'Event has not been created', desc: null, color: '#dc2626' },
    { id: 'warning', label: 'Warning', title: 'Event starts in 5 minutes', desc: null, color: '#ca8a04' },
    { id: 'info', label: 'Info', title: 'Be at the area 10 minutes before', desc: null, color: '#2563eb' },
    { id: 'promise', label: 'Promise', title: 'Loading…', desc: 'Fetching data', color: null },
    { id: 'custom', label: 'Custom', title: 'Custom toast', desc: 'With JSX-ish layout', color: '#7c5cff' },
  ];
  const POS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
  let type = 'default';
  let position = 'bottom-right';
  let richColors = true;
  let expand = false;
  let toasts = [];
  let tid = 1;

  const viewport = h('div.sn-stack', {
    style: {
      position: 'fixed', zIndex: 50, display: 'flex', flexDirection: 'column',
      gap: '0', pointerEvents: 'none', width: '356px', maxWidth: '92vw',
    },
  });

  const placeViewport = () => {
    const [y, x] = position.split('-');
    Object.assign(viewport.style, {
      top: y === 'top' ? '16px' : 'auto',
      bottom: y === 'bottom' ? '16px' : 'auto',
      left: x === 'left' ? '16px' : x === 'center' ? '50%' : 'auto',
      right: x === 'right' ? '16px' : 'auto',
      transform: x === 'center' ? 'translateX(-50%)' : 'none',
      flexDirection: y === 'top' ? 'column' : 'column-reverse',
      alignItems: x === 'left' ? 'flex-start' : x === 'right' ? 'flex-end' : 'center',
    });
  };

  const dismiss = (id) => {
    const el = viewport.querySelector(`[data-id="${id}"]`);
    if (el) {
      el.classList.add('leaving');
      setTimeout(() => { el.remove(); toasts = toasts.filter((t) => t.id !== id); restack(); }, 220);
    } else {
      toasts = toasts.filter((t) => t.id !== id);
      restack();
    }
  };

  const restack = () => {
    const kids = [...viewport.children].filter((c) => !c.classList.contains('leaving'));
    kids.forEach((el, i) => {
      if (expand) {
        el.style.transform = 'none';
        el.style.marginBottom = '8px';
        el.style.scale = '1';
        el.style.opacity = '1';
      } else {
        const stackI = i;
        el.style.transform = `translateY(${(position.startsWith('top') ? 1 : -1) * stackI * -10}px) scale(${1 - stackI * 0.04})`;
        el.style.marginBottom = stackI ? '-42px' : '0';
        el.style.zIndex = String(40 - stackI);
        el.style.opacity = stackI > 2 ? '0' : '1';
      }
    });
  };

  const makeToast = (kind) => {
    const def = TYPES.find((t) => t.id === kind) || TYPES[0];
    const id = tid++;
    const icon = kind === 'success' ? '✓' : kind === 'error' ? '✕' : kind === 'warning' ? '!' : kind === 'info' ? 'ℹ' : kind === 'promise' ? '◌' : '·';
    const border = richColors && def.color ? `1px solid ${def.color}33` : '1px solid #e5e5e5';
    const bg = richColors && def.color && kind !== 'default' && kind !== 'promise' && kind !== 'custom'
      ? `${def.color}10` : '#fff';
    const el = h('div.sn-toast', {
      'data-id': id,
      style: {
        width: '356px', maxWidth: '92vw', background: bg, border, borderRadius: '8px',
        padding: '14px 16px', boxShadow: '0 4px 12px #00000014, 0 1px 2px #0000000a',
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px', alignItems: 'start',
        cursor: 'pointer', position: 'relative', color: '#161616',
      },
      onclick: () => dismiss(id),
    },
      h('span', {
        style: {
          width: '20px', height: '20px', borderRadius: '50%', display: 'grid', placeItems: 'center',
          fontSize: '11px', fontWeight: 700,
          background: def.color || '#eee', color: def.color ? '#fff' : '#666',
          marginTop: '1px',
        },
      }, icon),
      h('div', {},
        h('div', { style: { fontSize: '13px', fontWeight: 560 } }, def.title),
        def.desc ? h('div', { style: { fontSize: '12px', opacity: .55, marginTop: '2px' } }, def.desc) : null,
      ),
      h('button', {
        style: { background: 'none', border: 0, opacity: .4, cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: '0 2px' },
        onclick: (e) => { e.stopPropagation(); dismiss(id); },
      }, '×'),
    );
    toasts.push({ id, kind });
    viewport.prepend(el);
    placeViewport();
    restack();
    if (kind === 'promise') {
      setTimeout(() => {
        if (!viewport.contains(el)) return;
        el.querySelector('div > div').textContent = 'Data loaded';
        el.querySelector('span').textContent = '✓';
        el.querySelector('span').style.background = '#16a34a';
        el.querySelector('span').style.color = '#fff';
      }, 900);
    }
    setTimeout(() => dismiss(id), kind === 'promise' ? 2800 : 4200);
    return id;
  };

  const pushToast = () => makeToast(type);

  // Hero stacked cards decoration
  const stackArt = h('div', {
    style: { position: 'relative', width: '280px', height: '100px', margin: '0 auto 28px' },
  },
    ...[0, 1, 2].map((i) => h('div', {
      style: {
        position: 'absolute', left: '50%', top: (i * 10) + 'px',
        width: (220 - i * 16) + 'px', height: '48px',
        marginLeft: (-(220 - i * 16) / 2) + 'px',
        background: '#fff', borderRadius: '10px',
        boxShadow: '0 8px 24px #00000014',
        border: '1px solid #eee',
        transform: `scale(${1 - i * 0.04})`,
        zIndex: 3 - i,
      },
    })),
  );

  const typeChips = h('div.k-row', { style: { flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '18px' } });
  const paintTypes = () => {
    typeChips.replaceChildren(...TYPES.map((t) => h('button', {
      style: {
        border: type === t.id ? '1px solid #161616' : '1px solid #e5e5e5',
        background: type === t.id ? '#161616' : '#fff',
        color: type === t.id ? '#fff' : '#161616',
        borderRadius: '99px', padding: '6px 12px', fontSize: '12px', fontWeight: 560, cursor: 'pointer',
      },
      onclick: () => { type = t.id; paintTypes(); },
    }, t.label)));
  };
  paintTypes();

  const posSel = h('div.k-row', { style: { flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '12px' } });
  const paintPos = () => {
    posSel.replaceChildren(...POS.map((p) => h('button', {
      style: {
        border: position === p ? '1px solid #161616' : '1px solid #e5e5e5',
        background: position === p ? '#f4f4f5' : '#fff',
        borderRadius: '6px', padding: '5px 9px', fontSize: '11px', cursor: 'pointer',
      },
      onclick: () => { position = p; paintPos(); placeViewport(); restack(); },
    }, p)));
  };
  paintPos();

  const toggles = h('div.k-row', {
    style: { gap: '18px', justifyContent: 'center', marginTop: '16px', fontSize: '13px' },
  },
    toggle('Rich colors', richColors, (v) => { richColors = v; }),
    toggle('Expand', expand, (v) => { expand = v; restack(); }),
  );

  const page = h('div', { style: { maxWidth: '640px', margin: '0 auto', padding: '72px 24px 120px', textAlign: 'center' } },
    stackArt,
    h('h1', { style: { fontSize: '48px', fontWeight: 700, letterSpacing: '-.03em', margin: '0 0 10px' } }, 'Sonner'),
    h('p', { style: { fontSize: '16px', opacity: .65, margin: '0 0 28px' } }, 'An opinionated toast component for React.'),
    h('div.k-row', { style: { gap: '10px', justifyContent: 'center' } },
      h('button', {
        style: {
          background: '#171717', color: '#fff', border: 0, borderRadius: '8px',
          padding: '10px 18px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
        },
        onclick: pushToast,
      }, 'Give me a toast'),
      h('button', {
        style: {
          background: '#f4f4f5', color: '#161616', border: 0, borderRadius: '8px',
          padding: '10px 18px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
        },
        onclick: () => toast('GitHub stub'),
      }, 'GitHub'),
    ),
    h('div', { style: { marginTop: '14px', fontSize: '13px', textDecoration: 'underline', opacity: .55, cursor: 'pointer' } }, 'Documentation'),
    h('div', { style: { marginTop: '28px', fontSize: '12px', opacity: .45, letterSpacing: '.06em' } }, 'TYPE'),
    typeChips,
    h('div', { style: { marginTop: '18px', fontSize: '12px', opacity: .45, letterSpacing: '.06em' } }, 'POSITION'),
    posSel,
    toggles,
    h('div', { style: { marginTop: '56px', textAlign: 'left' } },
      h('h2', { style: { fontSize: '20px', fontWeight: 650, margin: '0 0 12px' } }, 'Installation'),
      h('div', {
        style: {
          background: '#f4f4f5', borderRadius: '8px', padding: '12px 14px',
          fontFamily: "'JetBrains Mono Variable',ui-monospace,monospace", fontSize: '13px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        },
      }, 'npm install sonner', h('span', { style: { opacity: .4, cursor: 'pointer' }, onclick: () => copy('npm install sonner') }, '⧉')),
      h('h2', { style: { fontSize: '20px', fontWeight: 650, margin: '32px 0 12px' } }, 'Usage'),
      h('p', { style: { fontSize: '14px', opacity: .6, margin: '0 0 10px' } }, 'Render the toaster in the root of your app.'),
      h('pre', {
        style: {
          background: '#f4f4f5', border: '1px solid #eee', borderRadius: '8px',
          padding: '16px', textAlign: 'left', fontSize: '12.5px', lineHeight: 1.55,
          fontFamily: "'JetBrains Mono Variable',ui-monospace,monospace", overflow: 'auto',
        },
      }, `import { Toaster, toast } from 'sonner'\n\nfunction App() {\n  return (\n    <div>\n      <Toaster />\n      <button onClick={() => toast('Hello')}>\\n        Give me a toast\\n      </button>\n    </div>\n  )\n}`),
    ),
  );

  placeViewport();
  // Attach viewport to document body-ish via root's parent — use root overlay that escapes scroll
  const overlayHost = h('div', { style: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40 } });
  // Actually fixed viewport needs to be outside scroll — append to root which is absolute full
  root.append(page);
  // Put viewport on document.body for fixed positioning relative to viewport
  document.body.append(viewport);
  // Clean up on remount: store ref
  const prev = window.__sonnerViewport;
  if (prev && prev !== viewport) prev.remove();
  window.__sonnerViewport = viewport;

  window.__demoProof = async () => {
    const prevType = type, prevPos = position, prevRich = richColors, prevExp = expand;
    type = 'success'; makeToast('success');
    type = 'error'; makeToast('error');
    type = 'warning'; makeToast('warning');
    type = 'info'; makeToast('info');
    type = 'promise'; makeToast('promise');
    position = 'top-center'; placeViewport(); restack();
    richColors = true; expand = true; restack();
    await sleep(400);
    type = prevType; position = prevPos; richColors = prevRich; expand = prevExp;
    paintTypes(); paintPos(); placeViewport(); restack();
    // clear remaining
    [...viewport.querySelectorAll('.sn-toast')].forEach((el) => el.remove());
    toasts = [];
    return 'fired success/error/warning/info/promise; toggled position+expand; restored';
  };
};

V['ponpon-interactive-comic'] = (root, T) => {
  theme(root, T, { bg: '#fff6f0', fg: '#171717', panel: '#fffaf4', ac: '#ff6b35', dark: false });
  scroll(root);
  root.style.fontFamily = "'Inter Variable', system-ui, sans-serif";
  root.style.overflow = 'hidden';

  const PAGES = [
    {
      title: 'Ponpon Mania · 1',
      panels: [
        { bg: '#ffe8d6', art: '🐑', caption: 'Ponpon wakes up.', bubble: 'Another day…' },
        { bg: '#ffd6e8', art: '🕶️', caption: 'Sunglasses on.', bubble: 'Cool mode: ON' },
        { bg: '#d6e8ff', art: '🎵', caption: 'Music starts.', bubble: 'Feel that beat?' },
      ],
    },
    {
      title: 'Ponpon Mania · 2',
      panels: [
        { bg: '#e8ffd6', art: '🏙️', caption: 'City stroll.', bubble: 'Where to next?' },
        { bg: '#f0e0ff', art: '🧋', caption: 'Snack stop.', bubble: 'Boba first.' },
        { bg: '#fff0c8', art: '🕺', caption: 'Dance break.', bubble: 'Pon! Pon!' },
      ],
    },
    {
      title: 'Ponpon Mania · 3',
      panels: [
        { bg: '#ffd0d0', art: '🌙', caption: 'Night falls.', bubble: 'Still bouncing.' },
        { bg: '#d0f0ff', art: '✨', caption: 'Stars blink.', bubble: 'One more track.' },
        { bg: '#e8e0ff', art: '💤', caption: 'Soft fade.', bubble: 'See you…' },
      ],
    },
  ];
  const TRACKS = [
    { name: 'Ponpon Theme', notes: [60, 64, 67, 64, 69, 67, 64, 60], bpm: 100 },
    { name: 'City Bounce', notes: [62, 65, 69, 65, 72, 69, 65, 62], bpm: 118 },
    { name: 'Night Soft', notes: [57, 60, 64, 60, 67, 64, 60, 57], bpm: 84 },
  ];

  let page = 0;
  let panel = 0;
  let playing = false;
  let track = 0;
  let noteI = 0;
  let tid = null;
  let cookies = true;

  const stage = h('div', {
    style: {
      position: 'absolute', inset: 0, bottom: '72px',
      display: 'grid', placeItems: 'center', padding: '24px',
      background: '#fff6f0',
    },
  });

  const panelEl = h('div', {
    style: {
      width: 'min(520px, 92vw)', aspectRatio: '4/5', border: '3px solid #171717',
      borderRadius: '8px', position: 'relative', overflow: 'hidden',
      boxShadow: '8px 8px 0 #17171722', background: '#ffe8d6',
      display: 'flex', flexDirection: 'column', cursor: 'pointer',
    },
    onclick: () => advance(),
  });

  const artEl = h('div', {
    style: {
      flex: 1, display: 'grid', placeItems: 'center', fontSize: '96px',
      userSelect: 'none', transition: 'transform .25s',
    },
  }, '🐑');
  const bubble = h('div', {
    style: {
      position: 'absolute', top: '18px', right: '18px', maxWidth: '55%',
      background: '#fff', border: '2.5px solid #171717', borderRadius: '18px',
      padding: '10px 14px', fontWeight: 700, fontSize: '14px',
      boxShadow: '3px 3px 0 #171717',
    },
  }, '…');
  const caption = h('div', {
    style: {
      padding: '12px 16px', borderTop: '3px solid #171717', background: '#fffaf4',
      fontSize: '13px', fontWeight: 600, letterSpacing: '.02em',
    },
  }, '');
  const pageLab = h('div', {
    style: {
      position: 'absolute', top: '14px', left: '14px', fontSize: '11px',
      fontWeight: 800, letterSpacing: '.1em', opacity: .55,
    },
  }, '');

  panelEl.append(pageLab, bubble, artEl, caption);

  const paint = () => {
    const pg = PAGES[page];
    const pn = pg.panels[panel];
    panelEl.style.background = pn.bg;
    artEl.textContent = pn.art;
    artEl.style.transform = 'scale(1.05)';
    setTimeout(() => { artEl.style.transform = 'scale(1)'; }, 180);
    bubble.textContent = pn.bubble;
    caption.textContent = pn.caption;
    pageLab.textContent = `${pg.title} · PANEL ${panel + 1}/${pg.panels.length}`;
    pageChip.textContent = `${page + 1} / ${PAGES.length}`;
  };

  const advance = () => {
    const pg = PAGES[page];
    if (panel < pg.panels.length - 1) panel++;
    else if (page < PAGES.length - 1) { page++; panel = 0; }
    else { page = 0; panel = 0; }
    paint();
    // soft click
    audio();
    blip(220, 0.04, 'square', 0.04);
  };
  const back = () => {
    if (panel > 0) panel--;
    else if (page > 0) { page--; panel = PAGES[page].panels.length - 1; }
    paint();
  };

  const pageChip = h('span', { style: { fontWeight: 800, fontSize: '12px', minWidth: '48px', textAlign: 'center' } }, '1 / 3');

  // music player dock
  const trackLab = h('span', { style: { fontSize: '13px', fontWeight: 700 } }, TRACKS[0].name);
  const playBtn = h('button', {
    style: {
      width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #171717',
      background: '#ff6b35', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '14px',
    },
    onclick: () => toggleMusic(),
  }, '▶');

  const stopMusic = () => { clearInterval(tid); tid = null; playing = false; playBtn.textContent = '▶'; };
  const tickMusic = () => {
    const tr = TRACKS[track];
    const n = tr.notes[noteI % tr.notes.length];
    blip(440 * 2 ** ((n - 69) / 12), 0.16, noteI % 2 ? 'triangle' : 'sine', 0.1);
    noteI++;
  };
  const toggleMusic = () => {
    audio();
    if (playing) { stopMusic(); return; }
    playing = true;
    playBtn.textContent = '❚❚';
    const ms = 60000 / TRACKS[track].bpm;
    tid = setInterval(tickMusic, ms);
  };
  const switchTrack = (i) => {
    track = i;
    noteI = 0;
    trackLab.textContent = TRACKS[i].name;
    if (playing) { stopMusic(); toggleMusic(); }
  };

  const dock = h('div.k-row', {
    style: {
      position: 'absolute', left: 0, right: 0, bottom: 0, height: '72px',
      background: '#171717', color: '#fff', padding: '0 18px', gap: '12px', zIndex: 5,
    },
  },
    h('div', { style: { display: 'grid', gap: '2px' } },
      h('div', { style: { fontSize: '10px', opacity: .45, letterSpacing: '.12em' } }, 'NOW PLAYING'),
      trackLab,
    ),
    h('span', { style: { flex: 1 } }),
    h('button', {
      style: { background: 'none', border: 0, color: '#fff', cursor: 'pointer', fontSize: '16px' },
      onclick: () => switchTrack((track - 1 + TRACKS.length) % TRACKS.length),
    }, '⏮'),
    playBtn,
    h('button', {
      style: { background: 'none', border: 0, color: '#fff', cursor: 'pointer', fontSize: '16px' },
      onclick: () => switchTrack((track + 1) % TRACKS.length),
    }, '⏭'),
    h('span', { style: { width: '1px', height: '28px', background: '#ffffff33', margin: '0 6px' } }),
    h('button', {
      style: { background: '#ffffff14', border: '1px solid #ffffff33', color: '#fff', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' },
      onclick: back,
    }, '◀ Panel'),
    pageChip,
    h('button', {
      style: { background: '#ff6b35', border: 0, color: '#fff', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 800, fontSize: '12px' },
      onclick: advance,
    }, 'Panel ▶'),
  );

  const top = h('div.k-row', {
    style: {
      position: 'absolute', top: 0, left: 0, right: 0, height: '48px',
      padding: '0 18px', zIndex: 4, fontSize: '12px', fontWeight: 700,
    },
  },
    h('b', { style: { letterSpacing: '.06em' } }, 'PONPON MANIA'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: .5 } }, 'Patrick HENG & Justine Soulié'),
  );

  // cookie banner (matches ref chrome)
  const cookie = h('div.k-row', {
    style: {
      position: 'absolute', left: 0, right: 0, bottom: '72px', height: '44px',
      background: '#171717', color: '#fff', padding: '0 16px', gap: '12px', zIndex: 6,
      fontSize: '12px',
    },
  },
    h('span', { style: { flex: 1 } }, 'Hey you ✨ This site uses cookies to measure the traffic.'),
    h('button', {
      style: { background: '#fff', color: '#171717', border: 0, borderRadius: '99px', padding: '6px 14px', fontWeight: 700, cursor: 'pointer' },
      onclick: () => { cookies = true; cookie.remove(); },
    }, 'Accept'),
    h('button', {
      style: { background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '99px', padding: '6px 14px', fontWeight: 700, cursor: 'pointer' },
      onclick: () => { cookies = false; cookie.remove(); },
    }, 'Decline'),
  );

  // need audio/blip in saas — will patch import
  stage.append(panelEl);
  root.append(stage, top, dock, cookie);
  paint();

  window.__demoProof = async () => {
    advance(); advance();
    switchTrack(1);
    toggleMusic();
    await sleep(500);
    stopMusic();
    page = 0; panel = 0; track = 0; noteI = 0;
    trackLab.textContent = TRACKS[0].name;
    paint();
    return 'advanced panels · switched track · played · restored page 1';
  };
};

V['lenis-smooth-scroll-stage'] = (root, T) => {
  theme(root, T, { bg: '#0a0a0a', fg: '#ffffff', panel: '#141010', ac: '#ff8a8a', dark: true, line: '#ffffff14' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter Variable', system-ui, sans-serif";
  root.style.background = '#0a0a0a';

  const ACC = '#ff8a8a';
  let lerpAmt = 0.12;
  let targetY = 0;
  let currentY = 0;

  const particles = h('canvas', {
    style: { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 },
  });
  const pg = particles.getContext('2d');
  const dots = Array.from({ length: 90 }, () => ({
    x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8,
    a: 0.15 + Math.random() * 0.55, s: 0.02 + Math.random() * 0.06,
  }));
  const paintDots = () => {
    const r = root.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    particles.width = Math.max(1, Math.floor(r.width * dpr));
    particles.height = Math.max(1, Math.floor(r.height * dpr));
    pg.setTransform(dpr, 0, 0, dpr, 0, 0);
    pg.clearRect(0, 0, r.width, r.height);
    for (const d of dots) {
      d.y -= d.s * 0.002;
      if (d.y < -0.02) d.y = 1.02;
      pg.beginPath();
      pg.fillStyle = `rgba(255,138,138,${d.a})`;
      pg.arc(d.x * r.width, d.y * r.height, d.r, 0, Math.PI * 2);
      pg.fill();
    }
    requestAnimationFrame(paintDots);
  };

  const viewport = h('div', {
    style: { position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 },
  });
  const scroller = h('div', { style: { willChange: 'transform', paddingBottom: '80px' } });

  const navLink = (t) => h('span', {
    style: { fontSize: '11px', letterSpacing: '.14em', fontWeight: 700, opacity: .85, cursor: 'pointer' },
  }, t);

  const intensityLab = h('span', {
    style: {
      border: '1px solid #ffffff22', borderRadius: '99px', padding: '10px 14px',
      fontSize: '12px', fontFamily: 'monospace', opacity: .7,
    },
  }, 'lerp 0.12');

  const sections = {};

  const nav = h('div', {
    style: {
      display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'start',
      padding: '22px 28px 8px', gap: '12px', position: 'relative', zIndex: 2,
    },
  },
    h('div', { style: { display: 'grid', gap: '6px' } },
      h('div.k-row', { style: { gap: '18px', flexWrap: 'wrap' } }, navLink('SHOWCASE'), navLink('TEMPLATES'), navLink('SUBMIT')),
      h('div', { style: { fontSize: '10px', opacity: .4, letterSpacing: '.06em', maxWidth: '260px' } },
        'THE SMOOTH SCROLL LIBRARY BY ', h('span', { style: { textDecoration: 'underline' } }, 'DARKROOM.ENGINEERING')),
    ),
    h('div', {
      style: {
        width: '42px', height: '42px', background: ACC, borderRadius: '4px',
        display: 'grid', placeItems: 'center', color: '#111',
        fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: '26px', lineHeight: 1,
      },
    }, 'L'),
    h('div', { style: { justifySelf: 'end', display: 'grid', gap: '10px', justifyItems: 'end' } },
      h('div.k-row', { style: { gap: '18px' } }, navLink('DOCUMENTATION'), navLink('SPONSOR')),
      h('div.k-row', { style: { gap: '8px' } },
        h('button', {
          style: {
            background: ACC, color: '#111', border: 0, borderRadius: '99px',
            padding: '10px 16px', fontWeight: 800, fontSize: '11px', letterSpacing: '.08em', cursor: 'pointer',
          },
          onclick: () => toast('Documentation stub'),
        }, '⊞ DOCUMENTATION'),
        h('button', {
          style: {
            background: ACC, color: '#111', border: 0, borderRadius: '99px',
            padding: '10px 16px', fontWeight: 800, fontSize: '11px', letterSpacing: '.08em', cursor: 'pointer',
          },
          onclick: () => { targetY = sections.features.offsetTop; },
        }, '↗ SHOWCASE'),
      ),
    ),
  );

  const hero = h('div', {
    style: {
      display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px',
      padding: '48px 28px 80px', alignItems: 'end', minHeight: '70vh',
    },
  },
    h('div', {},
      h('div', {
        style: {
          fontSize: 'clamp(52px, 11vw, 104px)', fontWeight: 900, lineHeight: 0.92,
          letterSpacing: '-.04em', textTransform: 'uppercase',
        },
      }, 'WHY', h('br'), 'SMOOTH', h('br'), 'SCROLL?'),
    ),
    h('div', { style: { paddingBottom: '12px' } },
      h('div', {
        style: { color: ACC, fontSize: '12px', letterSpacing: '.16em', fontWeight: 800, marginBottom: '12px' },
      }, 'CREATE MORE IMMERSIVE INTERFACES'),
      h('p', {
        style: { fontSize: '14px', lineHeight: 1.65, opacity: .72, margin: 0, maxWidth: '36ch' },
      }, 'Smooth scroll used to be a hard sell — hacky, heavy, inaccessible. Not anymore. Lenis settled the debate and quietly became the standard behind some of the web’s most ambitious work.'),
    ),
  );

  const FEATURES = [
    ['Silky inertia', 'Lerp-driven motion that feels physical, not tweened.'],
    ['Touch ready', 'Trackpad, wheel, and touch all settle into one feel.'],
    ['Nested friendly', 'Scroll containers without fighting the page.'],
    ['Accessibility', 'Respects reduced-motion and keeps focus sane.'],
    ['Tiny footprint', 'Craft-grade feel without a heavyweight runtime.'],
    ['Creative control', 'Tune lerp intensity live — like this stage.'],
  ];

  sections.why = h('section', { style: { padding: '40px 28px 20px' } },
    h('div', { style: { fontSize: '11px', letterSpacing: '.2em', color: ACC, fontWeight: 800, marginBottom: '10px' } }, '01 — WHY'),
    h('h2', { style: { fontSize: '36px', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 12px', maxWidth: '16ch' } }, 'As it should be'),
    h('p', { style: { opacity: .65, maxWidth: '52ch', lineHeight: 1.6 } }, 'Smoothing the scroll pulls users into the flow so deeply they forget they are navigating a page.'),
  );

  sections.features = h('section', { style: { padding: '20px 28px 40px' } },
    h('div', { style: { fontSize: '11px', letterSpacing: '.2em', color: ACC, fontWeight: 800, marginBottom: '16px' } }, '02 — FEATURES'),
    h('div', {
      style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px' },
    }, ...FEATURES.map(([t, d]) => h('div', {
      style: {
        border: '1px solid #ffffff14', borderRadius: '14px', padding: '16px',
        background: '#ffffff06',
      },
    },
      h('div', { style: { fontWeight: 800, marginBottom: '6px' } }, t),
      h('div', { style: { fontSize: '12.5px', opacity: .55, lineHeight: 1.5 } }, d),
    ))),
  );

  sections.feel = h('section', { style: { padding: '20px 28px 100px' } },
    h('div', { style: { fontSize: '11px', letterSpacing: '.2em', color: ACC, fontWeight: 800, marginBottom: '10px' } }, '03 — FEEL'),
    h('h2', { style: { fontSize: '32px', fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 14px' } }, 'Dial the silk'),
    h('p', { style: { opacity: .6, marginBottom: '16px', maxWidth: '48ch' } }, 'CTA toggles lerp intensity. Wheel or trackpad to feel the difference.'),
    h('div.k-row', { style: { gap: '10px', flexWrap: 'wrap' } },
      h('button', {
        style: {
          background: ACC, color: '#111', border: 0, borderRadius: '99px',
          padding: '12px 18px', fontWeight: 800, cursor: 'pointer', letterSpacing: '.06em', fontSize: '12px',
        },
        onclick: () => {
          lerpAmt = lerpAmt < 0.2 ? 0.28 : 0.08;
          intensityLab.textContent = `lerp ${lerpAmt.toFixed(2)}`;
          toast(lerpAmt > 0.2 ? 'snappier' : 'silkier');
        },
      }, 'TOGGLE LERP'),
      intensityLab,
    ),
  );

  scroller.append(nav, hero, sections.why, sections.features, sections.feel);
  viewport.append(scroller);

  const maxY = () => Math.max(0, scroller.scrollHeight - viewport.clientHeight);
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetY = clamp(targetY + e.deltaY, 0, maxY());
  }, { passive: false });

  const tick = () => {
    currentY += (targetY - currentY) * lerpAmt;
    if (Math.abs(targetY - currentY) < 0.05) currentY = targetY;
    scroller.style.transform = `translate3d(0, ${-currentY}px, 0)`;
    requestAnimationFrame(tick);
  };

  const dock = h('div.k-row', {
    style: {
      position: 'absolute', left: '20px', bottom: '18px', zIndex: 5, gap: '10px',
      fontSize: '10px', letterSpacing: '.14em', fontWeight: 700, opacity: .5,
    },
  }, 'SCROLL TO EXPLORE');

  root.append(particles, viewport, dock);
  requestAnimationFrame(paintDots);
  requestAnimationFrame(tick);

  window.__demoProof = async () => {
    const prev = lerpAmt;
    lerpAmt = 0.22; intensityLab.textContent = `lerp ${lerpAmt.toFixed(2)}`;
    targetY = sections.features.offsetTop;
    await sleep(450);
    targetY = sections.feel.offsetTop;
    await sleep(400);
    targetY = 0;
    await sleep(350);
    lerpAmt = prev; intensityLab.textContent = `lerp ${lerpAmt.toFixed(2)}`;
    return 'smooth-scrolled why→features→feel→top · toggled lerp · restored';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['pricing-tier-cards'])(root, T); }
