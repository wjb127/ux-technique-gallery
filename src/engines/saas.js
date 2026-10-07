import '@fontsource/lora';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
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


// ---------- Aesop editorial fragrance shop: PDP + mega-menu + bag drawer (2026-10-05 16:00 KST)
V['aesop-editorial-fragrance-shop'] = (root, T) => {
  theme(root, T, { bg: '#fffef2', fg: '#333', ac: '#333', dark: false });
  const SANS = "'Inter Variable', 'Helvetica Neue', Arial, sans-serif", SERIF = "'Fraunces Variable', Georgia, serif";
  root.style.background = '#fffef2'; root.style.color = '#333'; root.style.fontFamily = SANS; root.style.minHeight = 'calc(100vh - 38px)';
  root.append(h('style', {}, `
    .ae{font:400 13px/1.5 ${SANS};color:#333;position:relative;overflow-x:hidden}
    .ae button{font:inherit;color:inherit}
    .ae .ann{background:#333;color:#fffef2;text-align:center;font-size:12px;height:30px;line-height:30px;position:relative}
    .ae .ann u{font-weight:600;cursor:pointer}.ae .ann .x{all:unset;position:absolute;right:16px;top:0;cursor:pointer;font-size:18px}
    .ae .hd{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:16px 52px 4px;font-size:11.5px}
    .ae .hd .r{justify-self:end;display:flex;gap:20px}.ae .hd .l{display:flex;gap:16px}
    .ae .hd span{cursor:pointer}.ae .hd span:hover{text-decoration:underline}
    .ae .logo{font:380 36px/1 ${SERIF};font-variation-settings:'opsz' 72,'SOFT' 0,'WONK' 0;letter-spacing:-.01em;color:#333;cursor:pointer}
    .ae .logo sup{font-size:10px;vertical-align:top;margin-left:1px}
    .ae .nav{display:flex;justify-content:center;gap:26px;padding:14px 0 10px;font-size:12px;position:relative;z-index:6}
    .ae .nav span{cursor:pointer;padding-bottom:6px;border-bottom:1px solid transparent}.ae .nav span.on,.ae .nav span:hover{border-color:#333}
    .ae .nav .sep{width:1px;background:#ccc;height:34px;margin-top:-10px;border:0;cursor:default}
    .ae .mega{position:absolute;left:0;right:0;top:100%;background:#fffef2;border-top:1px solid #e3e1d6;border-bottom:1px solid #e3e1d6;display:none;grid-template-columns:200px 200px 1fr;gap:40px;padding:30px 120px 40px;z-index:5;box-shadow:0 30px 40px -30px #0002}
    .ae .mega.on{display:grid;animation:aeIn .25s ease}@keyframes aeIn{from{opacity:0;transform:translateY(-6px)}}
    .ae .mega h5{font:600 11px ${SANS};margin:0 0 12px;color:#666;letter-spacing:.02em}.ae .mega a{display:block;margin:0 0 9px;cursor:pointer;font-size:13px}.ae .mega a:hover{text-decoration:underline}
    .ae .mega .gift{background:#ebeadf;padding:20px;display:flex;gap:18px;align-items:center}
    .ae .crumb{padding:4px 96px 0;font-size:10.5px;color:#555;display:flex;gap:8px}.ae .crumb span{cursor:pointer}
    .ae .pdp{display:grid;grid-template-columns:1.25fr 1fr;gap:20px;padding:0 96px 0 40px;min-height:500px}
    .ae .stage{display:grid;place-items:center;position:relative;height:480px;background:radial-gradient(ellipse at 50% 60%,#f6f4e8,#fffef2 70%)}
    .ae .btl{position:relative;width:160px;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
    .ae .cap{height:110px;width:140px;margin:0 auto;background:linear-gradient(90deg,#0b0b0b,#2a2a2a 30%,#111 60%,#000);border-radius:3px 3px 0 0}
    .ae .glass{height:240px;border-radius:2px 2px 16px 16px;position:relative;background:linear-gradient(90deg,var(--g1),var(--g2) 25%,var(--g3) 55%,var(--g1));box-shadow:0 30px 30px -20px #0004}
    .ae .glass::before{content:'';position:absolute;left:14px;top:8px;bottom:20px;width:10px;background:linear-gradient(#ffffff40,transparent);border-radius:8px}
    .ae .lab{position:absolute;inset:26px 0 0;text-align:center;color:#f4ede0}
    .ae .lab .lg{font:380 22px ${SERIF}}.ae .lab .nm{font:300 15px ${SANS};margin-top:22px}.ae .lab .ty{font:500 6.5px ${SANS};position:absolute;bottom:30px;left:0;right:0}
    .ae .shadow{position:absolute;bottom:34px;width:300px;height:30px;background:radial-gradient(ellipse,#0002,transparent 70%)}
    .ae .thumbs{position:absolute;left:20px;top:40px;display:flex;flex-direction:column;gap:8px}.ae .thumbs i{width:6px;height:6px;border-radius:50%;border:1px solid #333;cursor:pointer}.ae .thumbs i.on{background:#333}
    .ae .info{padding-top:6px;max-width:300px}
    .ae .info h2{font:400 24px/1.3 ${SANS};margin:0 0 14px}.ae .price{font-size:19px;margin-bottom:20px}
    .ae .sizes{display:grid;gap:8px;margin-bottom:12px}
    .ae .sz{border:1px solid #c6c4b8;padding:8px;text-align:center;cursor:pointer;background:transparent}.ae .sz b{display:block;font-weight:600}.ae .sz small{color:#666}
    .ae .sz.on{border:2px solid #333;padding:7px}
    .ae .add{all:unset;display:block;text-align:center;background:#333;color:#fffef2!important;padding:9px 0;cursor:pointer;margin-bottom:14px;transition:background .2s;box-sizing:border-box;width:100%}.ae .add:hover{background:#000}
    .ae .promo{background:#ebeadf;padding:8px 10px;font-size:10.5px;font-weight:600;line-height:1.35}
    .ae .acc{margin-top:22px;border-top:1px solid #d6d4c8}.ae .acc details{border-bottom:1px solid #d6d4c8;padding:11px 0}.ae .acc summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;font-weight:500}.ae .acc summary::after{content:'+'}.ae .acc details[open] summary::after{content:'−'}.ae .acc p{margin:8px 0 0;color:#555}
    .ae .fam{padding:60px 96px 30px;border-top:1px solid #e3e1d6;margin-top:30px}
    .ae .fam h3{font:400 26px ${SANS};margin:0 0 6px}.ae .fam .chips{display:flex;gap:8px;margin:18px 0 26px}
    .ae .chip{border:1px solid #333;padding:6px 14px;border-radius:30px;cursor:pointer;background:transparent;font-size:12px}.ae .chip.on{background:#333;color:#fffef2}
    .ae .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
    .ae .card{cursor:pointer}.ae .card .ph{height:220px;background:#f4f2e6;display:grid;place-items:center;margin-bottom:10px;transition:background .3s}.ae .card:hover .ph{background:#ebe9db}
    .ae .card .mini{width:60px;height:110px;position:relative}.ae .card .mini::before{content:'';position:absolute;left:6px;right:6px;top:0;height:36px;background:#111}.ae .card .mini::after{content:'';position:absolute;left:0;right:0;top:36px;bottom:0;background:var(--g);border-radius:0 0 6px 6px}
    .ae .card b{display:block;font-weight:500}.ae .card small{color:#666}
    .ae .ed{display:grid;grid-template-columns:1fr 1fr;gap:60px;padding:50px 96px 90px}.ae .ed q{font:380 30px/1.25 ${SERIF};quotes:none;display:block}.ae .ed p{color:#555;font-size:14px;line-height:1.7}
    .ae .scrim{position:fixed;inset:38px 0 0;background:#0005;opacity:0;pointer-events:none;transition:opacity .3s;z-index:40}.ae .scrim.on{opacity:1;pointer-events:auto}
    .ae .bag{position:fixed;top:38px;right:0;bottom:0;width:380px;background:#fffef2;z-index:41;transform:translateX(100%);transition:transform .45s cubic-bezier(.2,.7,.2,1);padding:26px 28px;display:flex;flex-direction:column}
    .ae .bag.on{transform:none}.ae .bag h4{font:400 18px ${SANS};margin:0 0 20px;display:flex;justify-content:space-between}.ae .bag h4 span{cursor:pointer}
    .ae .line{display:grid;grid-template-columns:56px 1fr auto;gap:12px;padding:14px 0;border-bottom:1px solid #e3e1d6;align-items:center}
    .ae .line .mini{width:28px;height:56px;margin:auto;position:relative}.ae .line .mini::before{content:'';position:absolute;inset:0 3px 38px;background:#111}.ae .line .mini::after{content:'';position:absolute;left:0;right:0;top:18px;bottom:0;background:var(--g);border-radius:0 0 4px 4px}
    .ae .qty{display:flex;gap:10px;align-items:center;margin-top:4px}.ae .qty span{cursor:pointer;border:1px solid #ccc;width:20px;text-align:center}
    .ae .tot{margin-top:auto;border-top:1px solid #333;padding-top:14px;display:flex;justify-content:space-between;font-size:15px}
    .ae .chat{position:fixed;right:10px;bottom:16px;background:#333;color:#fff;border-radius:6px;padding:12px 14px;font-size:12px;width:190px;z-index:30;cursor:pointer}
  `));
  const P = [
    { n: '우라논 오 드 퍼퓸', en: 'Ouranon', fam: 'woody', g: ['#4a1f05', '#8a4310', '#6a3008'], note: '우디 · 레더리 · 앰버', d: '고대 신화에서 영감을 받은, 수지와 가죽 향이 감도는 깊은 우디 향.' },
    { n: '휠 오 드 퍼퓸', en: 'Hwyl', fam: 'woody', g: ['#3b1a06', '#7b3d0e', '#5a2a08'], note: '우디 · 스모키 · 그린', d: '일본 숲의 사찰에서 영감을 받은, 연기와 이끼의 향.' },
    { n: '테싯 오 드 퍼퓸', en: 'Tacit', fam: 'fresh', g: ['#4d2305', '#93501a', '#6d360b'], note: '시트러스 · 허브 · 그린', d: '유자와 바질이 어우러진 맑고 생기 있는 향.' },
    { n: '로주 오 드 퍼퓸', en: 'Rōzu', fam: 'floral', g: ['#4f2207', '#9a521b', '#71380c'], note: '플로럴 · 프레시 · 우디', d: '장미 정원을 거니는 듯한 섬세하고 푸른 플로럴 향.' },
    { n: '마라케시 인텐스', en: 'Marrakech Intense', fam: 'opulent', g: ['#401a04', '#86400f', '#5f2b07'], note: '스파이시 · 우디 · 플로럴', d: '향신료 시장의 온기를 담은 풍부하고 관능적인 향.' },
    { n: '글롬 오 드 퍼퓸', en: 'Gloam', fam: 'floral', g: ['#4a2006', '#8e4914', '#673209'], note: '플로럴 · 스파이시 · 파우더리', d: '해 질 녘의 고요함을 닮은 파우더리 플로럴 향.' },
    { n: '카르스트 오 드 퍼퓸', en: 'Karst', fam: 'fresh', g: ['#45200a', '#8c4a16', '#64330c'], note: '아쿠아틱 · 우디 · 스파이시', d: '바닷바람과 석회암 해안을 떠올리게 하는 향.' },
    { n: '미라세티 오 드 퍼퓸', en: 'Miraceti', fam: 'opulent', g: ['#3d1803', '#7f3a0c', '#5a2806'], note: '앰버 · 우디 · 스파이시', d: '바다의 전설에서 영감을 받은 따뜻한 앰버 향.' }];
  const FAM = { all: '전체', woody: '우디', floral: '플로럴', fresh: '프레시', opulent: '오퓰런트' };
  let cur = 0, size = 50, fam = 'woody', bag = [];
  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const priceOf = (sz) => (sz === 50 ? 225000 : 330000);
  const wrap = h('div.ae');
  const ann = h('div.ann', {}, '한정 기간 전 구매 대상, 신제품 언포어신 아에르 오 드 퍼퓸 시향지 증정 (주문 건당 증정) ', h('u', { onclick: () => toast('프로모션 상세 (demo)') }, '자세히 알아보기'), h('button.x', { onclick: () => ann.remove() }, '×'));
  const bagCount = h('span', { onclick: () => openBag(true) }, '장바구니 (0)');
  const hd = h('div.hd', {}, h('div.l', {}, h('span', {}, '매장 찾기'), h('span', {}, '문의하기')), h('div.logo', { onclick: () => scrollTo({ top: 0, behavior: 'smooth' }) }, 'Aēsop', h('sup', {}, '.')), h('div.r', {}, h('span', {}, '마이페이지'), bagCount));
  // mega menu (fragrance)
  const mega = h('div.mega', {},
    h('div', {}, h('h5', {}, '향 계열'), ...Object.entries(FAM).filter(([k]) => k !== 'all').map(([k, v]) => h('a', { onclick: () => { setFam(k); closeMega(); fs.scrollIntoView({ behavior: 'smooth' }); } }, v))),
    h('div', {}, h('h5', {}, '향수'), ...P.slice(0, 6).map((p, i) => h('a', { onclick: () => { setCur(i); closeMega(); } }, p.en))),
    h('div.gift', {}, h('div.mini', { style: { '--g': '#7b3d0e', width: '40px', height: '80px', position: 'relative' } }), h('div', {}, h('b', {}, '기프트 파인더'), h('div', { style: { color: '#555', margin: '4px 0 10px' } }, '받는 분의 취향에 맞는 향을 찾아보세요.'), h('button.chip', { onclick: () => { closeMega(); setFam(pick(['woody', 'floral', 'fresh', 'opulent'])); fs.scrollIntoView({ behavior: 'smooth' }); toast('추천 향 계열을 골랐어요'); } }, '시작하기'))));
  const NAV = ['기프트 가이드', '신제품 & 추천 제품', '스킨 케어', '핸드 & 바디', '향수', '홈', '헤어', '트래블', '라이브러리', '경험하기'];
  let megaT; const openMega = () => { clearTimeout(megaT); mega.classList.add('on'); }; const closeMega = () => { mega.classList.remove('on'); };
  const nav = h('div.nav', { onmouseleave: () => { megaT = setTimeout(closeMega, 150); } }, ...NAV.map((n) => h('span' + (n === '향수' ? '.on' : ''), n === '향수' ? { onmouseenter: openMega, onclick: () => mega.classList.toggle('on') } : { onmouseenter: () => { megaT = setTimeout(closeMega, 150); } }, n)), h('span.sep'), h('span', {}, '⌕  검색'), mega);
  mega.addEventListener('mouseenter', openMega);
  const crumb = h('div.crumb');
  const btl = h('div.btl'), title = h('h2'), price = h('div.price'), sizes = h('div.sizes'), addBtn = h('button.add', { onclick: () => addToBag() }), acc = h('div.acc');
  const thumbs = h('div.thumbs', {}, ...[0, 1, 2].map((i) => h('i' + (i ? '' : '.on'), { onclick: (e) => { [...thumbs.children].forEach((x) => x.classList.remove('on')); e.target.classList.add('on'); btl.style.transform = ['none', 'rotate(-6deg) scale(1.08)', 'translateY(-10px) scale(.9)'][i]; } })));
  const pdp = h('div.pdp', {}, h('div.stage', {}, thumbs, h('div.shadow'), btl), h('div.info', {}, title, price, sizes, addBtn, h('div.promo', {}, '☐ 한정 기간 5만 원 이상 구매 시, 신제품 언포어신 아에르 오 드 퍼퓸 바이알 샘플을 선물로 드립니다. *주문 건당 1개 증정'), acc));
  const chips = h('div.chips'), grid = h('div.grid');
  const fs = h('div.fam', {}, h('h3', {}, '향 계열로 찾아보기'), h('div', { style: { color: '#666' } }, '우디, 플로럴, 프레시, 오퓰런트 — 계열을 선택해 향을 비교해 보세요.'), chips, grid);
  const ed = h('div.ed', {}, h('q', {}, '“향은 기억의 가장 오래된 언어입니다.”'), h('p', {}, '각각의 향은 문학과 건축, 여행에서 받은 영감을 바탕으로 조향사와 함께 오랜 시간 다듬어집니다. 매장에서 직접 시향해 보시거나, 온라인 상담을 통해 취향에 맞는 향을 찾아보세요. (클론 연습용 예시 문구)'));
  const scrim = h('div.scrim', { onclick: () => openBag(false) }), bagEl = h('div.bag');
  const chat = h('div.chat', { onclick: () => toast('상담 연결 (demo)') }, '도움이 필요하신가요?', h('br'), '저희가 도와드리겠습니다.');
  wrap.append(ann, hd, nav, crumb, pdp, fs, ed, scrim, bagEl, chat);
  root.append(wrap);
  const setCur = (i) => { cur = i; renderPdp(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const setFam = (f) => { fam = f; renderFam(); };
  const renderPdp = () => { const p = P[cur];
    crumb.replaceChildren(...['홈', '향수', FAM[p.fam], p.n].flatMap((x, i, a) => [h('span', { onclick: i === 2 ? () => { setFam(p.fam); fs.scrollIntoView({ behavior: 'smooth' }); } : null }, x), i < a.length - 1 ? h('span', {}, '❯') : null]).filter(Boolean));
    btl.style.setProperty('--g1', p.g[0]); btl.style.setProperty('--g2', p.g[1]); btl.style.setProperty('--g3', p.g[2]);
    btl.replaceChildren(h('div.cap'), h('div.glass', {}, h('div.lab', {}, h('div.lg', {}, 'Aēsop.'), h('div.nm', {}, p.en), h('div.ty', {}, 'Eau de Parfum'))));
    title.textContent = p.n; price.textContent = won(priceOf(size));
    sizes.replaceChildren(...[50, 100].map((sz) => h('button.sz' + (sz === size ? '.on' : ''), { onclick: () => { size = sz; renderPdp(); } }, h('b', {}, `${sz} mL`), h('small', {}, won(priceOf(sz))))));
    addBtn.textContent = `${won(priceOf(size))}  —  장바구니에 담기`;
    acc.replaceChildren(h('details', { open: true }, h('summary', {}, '제품 설명'), h('p', {}, p.d)), h('details', {}, h('summary', {}, '향 노트'), h('p', {}, p.note)), h('details', {}, h('summary', {}, '사용 방법'), h('p', {}, '맥박이 뛰는 부위에 가볍게 분사하세요.')));
  };
  const renderFam = () => {
    chips.replaceChildren(...Object.entries(FAM).map(([k, v]) => h('button.chip' + (k === fam ? '.on' : ''), { onclick: () => setFam(k) }, v)));
    grid.replaceChildren(...P.map((p, i) => [p, i]).filter(([p]) => fam === 'all' || p.fam === fam).map(([p, i]) => h('div.card', { onclick: () => setCur(i) }, h('div.ph', {}, h('div.mini', { style: { '--g': p.g[1] } })), h('b', {}, p.n), h('small', {}, `${FAM[p.fam]} · ${p.note}`), h('div', {}, won(225000)))));
  };
  const addToBag = () => { const p = P[cur]; const ex = bag.find((b) => b.i === cur && b.sz === size); ex ? ex.q++ : bag.push({ i: cur, sz: size, q: 1 }); addBtn.textContent = '장바구니에 담았습니다 ✓'; setTimeout(renderPdp, 900); renderBag(); openBag(true); };
  const openBag = (on) => { bagEl.classList.toggle('on', on); scrim.classList.toggle('on', on); };
  const renderBag = () => { const n = bag.reduce((a, b) => a + b.q, 0); bagCount.textContent = `장바구니 (${n})`;
    bagEl.replaceChildren(h('h4', {}, `장바구니 (${n})`, h('span', { onclick: () => openBag(false) }, '×')),
      ...(bag.length ? bag.map((b, k) => h('div.line', {}, h('div.mini', { style: { '--g': P[b.i].g[1] } }), h('div', {}, h('div', {}, P[b.i].n), h('small', { style: { color: '#666' } }, `${b.sz} mL`), h('div.qty', {}, h('span', { onclick: () => { b.q--; if (!b.q) bag.splice(k, 1); renderBag(); } }, '−'), b.q, h('span', { onclick: () => { b.q++; renderBag(); } }, '+'))), h('div', {}, won(priceOf(b.sz) * b.q)))) : [h('p', { style: { color: '#666' } }, '장바구니가 비어 있습니다.')]),
      h('div.tot', {}, h('span', {}, '소계'), h('b', {}, won(bag.reduce((a, b) => a + priceOf(b.sz) * b.q, 0)))),
      h('button.add', { style: { marginTop: '14px' }, onclick: () => toast('결제 단계 (demo) — 실제 결제 없음') }, '결제하기'));
  };
  renderPdp(); renderFam(); renderBag();
  window.__demoProof = async () => { size = 100; renderPdp(); addToBag(); await sleep(60); const c = bagCount.textContent; bag = []; renderBag(); openBag(false); size = 50; setFam('floral'); const n = grid.children.length; setFam('woody'); renderPdp(); openMega(); await sleep(30); const m = mega.classList.contains('on'); closeMega(); return `100 mL added → ${c}; floral chip shows ${n} cards; mega-menu opens=${m}`; };
};


// ---------- Flighty: live flight notification hero (2026-10-05 20:00 KST)
V['flighty-live-flight-notification-hero'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#0b0b0f', ac: '#ffcc00', dark: false });
  root.style.overflow = 'auto'; root.style.background = '#fff';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.append(h('style', {}, `
    .fl{font:400 15px/1.5 'Inter Variable',system-ui,sans-serif;color:#0b0b0f;min-height:100%;position:relative}
    .fl .ann{background:linear-gradient(90deg,#1e1b7a,#2c2a9c 50%,#1e1b7a);color:#fff;font-size:13px;font-weight:600;height:36px;display:flex;align-items:center;justify-content:center;gap:10px;position:relative}
    .fl .ann b{font-weight:600;opacity:.9}.fl .ann u{text-decoration:none;cursor:pointer}.fl .ann .x{all:unset;position:absolute;right:18px;cursor:pointer;font-size:20px}
    .fl nav{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;max-width:1100px;margin:0 auto;padding:16px 28px}
    .fl .logo{display:flex;align-items:center;gap:9px;font-weight:700;font-size:17px}.fl .logo i{width:28px;height:28px;border-radius:7px;background:#111;display:grid;place-items:center;color:#fff;font-style:normal;font-size:15px}
    .fl nav .mid{display:flex;gap:32px;font-size:13.5px;color:#333}.fl nav .mid span{cursor:pointer}.fl nav .mid span:hover{color:#000}
    .fl nav .r{justify-self:end;font-size:13.5px;font-weight:600;cursor:pointer}
    .fl h1{font:700 clamp(40px,5.4vw,74px)/1.05 'Inter Variable';letter-spacing:-.035em;text-align:center;margin:26px 0 18px}
    .fl .lede{max-width:600px;margin:0 auto;text-align:center;color:#444;font-size:16px;line-height:1.55}
    .fl .awards{display:flex;justify-content:center;gap:40px;margin:22px 0 30px;font-size:12px}.fl .awards div{display:flex;gap:9px;align-items:center}.fl .awards b{display:block;font-weight:600}.fl .awards small{color:#666}
    .fl .awards i{width:26px;height:26px;border-radius:7px;display:grid;place-items:center;font-style:normal}
    .fl .stage{position:relative;height:560px;max-width:1180px;margin:0 auto;overflow:hidden}
    .fl .phone{position:absolute;left:50%;top:20px;width:250px;height:520px;margin-left:-125px;border-radius:42px;background:#111;padding:9px;box-shadow:0 40px 80px -30px #0007,inset 0 0 0 2px #444;z-index:3}
    .fl .scr{width:100%;height:100%;border-radius:34px;overflow:hidden;position:relative;background:#cfe7f7}
    .fl .scr .sb{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;padding:10px 22px;font:600 11px 'Inter Variable';z-index:2}
    .fl .scr svg{position:absolute;inset:0}
    .fl .sheet{position:absolute;left:0;right:0;bottom:0;height:56%;background:#fff;border-radius:20px 20px 0 0;padding:12px;box-shadow:0 -6px 20px #0002;z-index:2}
    .fl .sheet h4{margin:0 0 8px;font-size:15px;font-weight:700}.fl .sheet .q{background:#f1f1f4;border-radius:9px;padding:6px 10px;font-size:10px;color:#888;margin-bottom:10px}
    .fl .lv{border-radius:14px;background:#0f1115;color:#fff;padding:10px 11px;font-variant-numeric:tabular-nums}
    .fl .lv .row{display:flex;justify-content:space-between;align-items:baseline}.fl .lv .big{font:700 22px 'Inter Variable';letter-spacing:-.02em}.fl .lv small{font-size:9px;opacity:.6}
    .fl .lv .st{font-size:10px;font-weight:700}.fl .lv .bar{height:4px;background:#ffffff26;border-radius:4px;margin:9px 0 6px;position:relative}.fl .lv .bar b{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:var(--sc)}.fl .lv .bar i{position:absolute;top:-7px;font-style:normal;font-size:12px;transform:translateX(-50%) rotate(45deg)}
    .fl .lv .ap{display:flex;justify-content:space-between;font:700 11px 'Inter Variable'}.fl .lv .ap span small{display:block;font-weight:500}
    .fl .fl2{margin-top:8px;display:flex;justify-content:space-between;font-size:10px;color:#333;padding:8px 2px;border-top:1px solid #eee}
    .fl .nt{position:absolute;width:300px;background:#fffffff2;border-radius:16px;box-shadow:0 10px 30px -8px #0003,0 0 0 1px #0000000a;padding:12px 14px;display:flex;gap:12px;align-items:center;font-size:13px;z-index:2;transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .7s,filter .7s}
    .fl .nt b{display:block;font-weight:600;font-size:14px}.fl .nt span{color:#555}.fl .nt .ic{width:34px;height:34px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:16px}
    .fl .nt.in{opacity:1}.fl .nt.out{opacity:0;transform:translateY(24px) scale(.96)}.fl .nt.faint{opacity:.35;filter:blur(.2px);box-shadow:none}
    .fl .tabs{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);background:#111111e6;backdrop-filter:blur(10px);border-radius:14px;padding:5px;display:flex;gap:4px;z-index:5}
    .fl .tabs button{all:unset;cursor:pointer;color:#ddd;font-size:12.5px;font-weight:600;padding:8px 14px;border-radius:10px;display:flex;gap:7px;align-items:center;transition:background .25s,color .25s}.fl .tabs button.on{background:#ffc400;color:#111}
    .fl .feat{max-width:1100px;margin:70px auto 30px;padding:0 28px}.fl .feat h2{font:700 40px/1.1 'Inter Variable';letter-spacing:-.03em;margin:0 0 30px;text-align:center}
    .fl .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
    .fl .fc{border-radius:24px;background:#f5f5f7;padding:24px;min-height:210px;opacity:0;transform:translateY(30px);transition:opacity .7s,transform .7s cubic-bezier(.2,.8,.2,1)}.fl .fc.vis{opacity:1;transform:none}
    .fl .fc .k{font:800 44px/1 'Inter Variable';letter-spacing:-.04em;font-variant-numeric:tabular-nums}.fl .fc h3{margin:16px 0 6px;font-size:17px}.fl .fc p{margin:0;color:#555;font-size:14px}
    .fl .cookie{position:absolute;right:16px;bottom:16px;width:250px;background:#fff;border-radius:12px;box-shadow:0 8px 30px #0002;padding:14px;font-size:12px;display:flex;gap:10px;align-items:center;z-index:6}
    .fl .cookie button{all:unset;background:#eee;border-radius:8px;padding:6px 12px;cursor:pointer;font-weight:600}
    .fl .rm{position:absolute;right:20px;top:110px;font-size:11px;color:#666;display:flex;gap:6px;align-items:center;cursor:pointer;z-index:6}
    @media (prefers-reduced-motion: reduce){.fl .nt,.fl .fc{transition:none}}
  `));
  const SC = { on: '#30d158', delay: '#ff9f0a', cancel: '#ff453a' };
  const SETS = {
    pre: [['🛫', '#e8f0ff', 'AUS ✈ ORD • 70° ☀️', 'Good morning! Your flight today is on time.', 'on'], ['🧾', '#fff1f1', 'Check In is now open', 'You can check-in at united.com', 'on'], ['⏱', '#fff4e5', 'AUS ✈ ORD • Delayed 45m', '↗ Inbound from DEN 6:30pm (45m late)', 'delay'], ['🛩', '#eef8ff', 'Your plane is on its way', 'N37502 departed DEN for AUS', 'on'], ['👩', '#ffeef3', 'Mom booked AUS ✈ ORD', 'Shared her flight with you', 'on']],
    air: [['🚪', '#eef5ff', 'Gate changed', 'Changed to ORD Terminal 2 • Gate 7', 'delay'], ['🎫', '#ecfbef', 'Boarding started', 'Group 3 boards in ~12m', 'on'], ['🛄', '#f4f4f6', 'AUS ✈ ORD • Departed Gate', 'Taxiing for 13m, for take off at 5:34PM', 'on'], ['⚠️', '#fff0ef', 'AUS ✈ DFW • Cancelled', 'We found 3 rebooking options', 'cancel'], ['🛬', '#fff4e5', 'Arrival forecast', 'Likely 12m early based on winds', 'on']],
    land: [['🛬', '#ecfbef', 'AUS ✈ ORD • Landed', "It's 6:32am (22m early) and ☀️ 88°", 'on'], ['🧳', '#f4f4f6', 'Bags on Carousel 6', 'Arriving in ~9 minutes', 'on'], ['👩', '#ffeef3', 'Mom landed in New York', '6:32am (22m early) and ☀️ 88°', 'on'], ['🚕', '#fff8e0', 'Connection is tight', 'ORD ✈ JFK leaves in 48m from B12', 'delay'], ['🏆', '#eef5ff', 'Passport updated', '214 flights • 312,450 miles', 'on']],
  };
  const POS = [[-470, 30], [-520, 110], [-490, 195], [-540, 280], [-470, 370], [180, 40], [215, 125], [175, 205], [225, 290], [190, 375]];
  const wrap = h('div.fl'); const stage = h('div.stage');
  const ann = h('div.ann', {}, '🗼', h('b', {}, 'NEW! Flighty Airports'), h('span', { style: { opacity: .5 } }, '|'), h('u', { onclick: () => toast('Airports (demo)') }, 'View Live →'), h('button.x', { onclick: () => ann.remove() }, '×'));
  const nav = h('nav', {}, h('div.logo', {}, h('i', {}, '✈'), 'Flighty'), h('div.mid', {}, ...['Pricing', 'Gift Cards', 'Passport', 'Airports', 'Help Center'].map((x) => h('span', {}, x))), h('div.r', {}, 'Get the app ▯'));
  // phone: map + live activity card
  const W = 232, Hm = 230; const route = 'M 46 150 C 90 70, 160 60, 188 92';
  const map = s('svg', { viewBox: `0 0 ${W} ${Hm}`, preserveAspectRatio: 'xMidYMid slice' },
    s('rect', { width: W, height: Hm, fill: '#b9dcf2' }),
    s('path', { d: 'M -10 60 C 30 30, 90 20, 150 30 C 200 36, 240 60, 250 80 L 250 200 C 200 220, 150 210, 120 200 C 80 190, 40 210, -10 190 Z', fill: '#d5e8b8' }),
    s('path', { d: 'M 20 120 C 60 100, 100 130, 130 110 C 160 95, 190 120, 230 110 L 230 200 L 20 200 Z', fill: '#c8dfa3', opacity: .8 }),
    s('path', { d: 'M 120 40 C 150 60, 170 50, 210 60', stroke: '#9cc6e6', 'stroke-width': 6, fill: 'none', opacity: .6 }),
    s('text', { x: 60, y: 60, 'font-size': 9, 'font-weight': 700, fill: '#7a8a6a', 'letter-spacing': 2 }, 'NORTH AMERICA'),
    s('path', { d: route, stroke: '#5b7bd6', 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '4 3' }),
    s('circle', { cx: 46, cy: 150, r: 3.5, fill: '#fff', stroke: '#2b4bb0', 'stroke-width': 1.5 }), s('circle', { cx: 188, cy: 92, r: 3.5, fill: '#fff', stroke: '#2b4bb0', 'stroke-width': 1.5 }));
  const planeG = s('text', { 'font-size': 13, 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, '✈'); map.append(planeG);
  const pathEl = map.querySelector('path[stroke-dasharray]');
  const lvBig = h('span.big'), lvSt = h('span.st'), lvBar = h('b'), lvPlane = h('i', {}, '✈'), lvSmall = h('small');
  const lv = h('div.lv', {}, h('div.row', {}, h('span', {}, lvBig, ' ', lvSmall), lvSt), h('div.bar', {}, lvBar, lvPlane), h('div.ap', {}, h('span', {}, 'AUS', h('small', { style: { color: SC.on } }, '17:10')), h('span', { style: { textAlign: 'right' } }, 'ORD', h('small', { style: { color: SC.on } }, '20:05'))));
  const phone = h('div.phone', {}, h('div.scr', {}, h('div.sb', {}, '09:41', h('span', {}, '▂▄▆ ◉')), map, h('div.sheet', {}, h('h4', {}, 'My Flights ⌄'), h('div.q', {}, '⌕  Search to add flights'), lv, h('div.fl2', {}, h('span', {}, 'UA 1693  SFO 09:10 → JFK 17:25'), h('span', { style: { color: SC.on, fontWeight: 700 } }, 'On Time')))));
  stage.append(phone);
  let tab = 'pre', nts = [], timers = [];
  const statusText = { on: 'On Time', delay: 'Delayed', cancel: 'Cancelled' };
  const mkNote = ([ic, bg, t, d, st], i) => { const [x, y] = POS[i]; const n = h('div.nt.out', { style: { left: `calc(50% + ${x}px)`, top: y + 'px' } }, h('div.ic', { style: { background: bg } }, ic), h('div', {}, h('b', {}, t), h('span', { style: st !== 'on' ? { color: SC[st], fontWeight: 600 } : {} }, d))); n.dataset.st = st; return n; };
  const showSet = (k, instant) => {
    tab = k; timers.forEach(clearTimeout); timers = []; nts.forEach((n) => { n.classList.add('out'); setTimeout(() => n.remove(), 700); });
    const items = SETS[k]; nts = [...items, ...items.slice().reverse()].slice(0, 10).map((it, i) => mkNote(it, i)); nts.forEach((n) => stage.append(n));
    const order = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9];
    order.forEach((idx, j) => { const go = () => { nts[idx]?.classList.remove('out'); if (j >= 5) nts[idx]?.classList.add('faint'); if (j > 0 && j < 5) nts[order[j - 1]]?.classList.add('faint'); }; instant ? go() : timers.push(setTimeout(go, 250 + j * 520)); });
    tabsEl.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.k === k));
    // flight phase drives the live activity
    phase = { pre: 0.0, air: 0.08, land: 1 }[k]; status = k === 'pre' ? 'delay' : 'on'; t0 = performance.now();
  };
  const tabsEl = h('div.tabs', {}, ...[['pre', '🛫 Preflight'], ['air', '🧳 At the airport'], ['land', '🛬 After landing'], ['dl', '▦ Download']].map(([k, l]) => h('button', { 'data-k': k, onclick: () => (k === 'dl' ? toast('App Store (demo)') : showSet(k)) }, l)));
  stage.append(tabsEl);
  let phase = 0, status = 'delay', t0 = performance.now(), auto = true;
  const L = pathEl.getTotalLength ? pathEl : null;
  const render = () => {
    const el = (performance.now() - t0) / 1000;
    let p = phase; if (tab === 'air') p = clamp(0.08 + el * 0.04, 0, 0.98);
    const st = status; lvBar.style.width = (p * 100).toFixed(1) + '%'; lvBar.style.setProperty('--sc', SC[st]); root.style.setProperty('--sc', SC[st]); lvBar.style.background = SC[st]; lvPlane.style.left = (p * 100).toFixed(1) + '%';
    const minsLeft = Math.max(0, Math.round((1 - p) * 175)); const hh = Math.floor(minsLeft / 60), mm = minsLeft % 60;
    lvBig.textContent = tab === 'pre' ? `${1 + Math.floor((3600 - (el % 3600)) / 3600)}h ${String(59 - Math.floor(el / 60) % 60).padStart(2, '0')}m` : tab === 'land' ? 'Landed' : `${hh}h ${String(mm).padStart(2, '0')}m`;
    lvSmall.textContent = tab === 'pre' ? 'until departure' : tab === 'land' ? '22m early' : 'remaining';
    lvSt.textContent = tab === 'pre' ? 'Delayed 45m' : statusText[st]; lvSt.style.color = SC[st];
    if (L) { const pt = L.getPointAtLength(L.getTotalLength() * Math.max(p, 0.001)); planeG.setAttribute('x', pt.x); planeG.setAttribute('y', pt.y); }
    if (!RM) requestAnimationFrame(render);
  };
  // auto-cycle tabs like the site's hero carousel
  let cyc = setInterval(() => { if (!auto || RM) return; const ks = ['pre', 'air', 'land']; showSet(ks[(ks.indexOf(tab) + 1) % 3]); }, 9000);
  tabsEl.addEventListener('click', () => { auto = false; });
  const STATS = [['8,500+', 'Predicted delays before the airline', 'Flighty watches your inbound plane, so you know about delays up to 6 hours earlier.'], ['15s', 'Fastest alerts', 'Gate changes, boarding and baggage — pushed seconds after they happen.'], ['Live', 'Live Activities', 'Your flight on the Lock Screen and Dynamic Island, with a countdown to every step.'], ['214', 'Flighty Passport', 'Every flight you have ever taken, mapped and summarised beautifully.'], ['3', 'Rebooking options', 'When a flight cancels, see alternatives before the queue forms.'], ['Free', 'Share with friends', 'Friends get updates on your flights without downloading anything.']];
  const fcs = STATS.map(([k, t, d]) => h('div.fc', {}, h('div.k', {}, k), h('h3', {}, t), h('p', {}, d)));
  const feat = h('div.feat', {}, h('h2', {}, 'Everything about your flight, before anyone else'), h('div.cards', {}, ...fcs));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { const i = fcs.indexOf(e.target); setTimeout(() => e.target.classList.add('vis'), RM ? 0 : (i % 3) * 120); io.unobserve(e.target); } }), { root, threshold: 0.2 });
  fcs.forEach((f) => io.observe(f));
  const cookie = h('div.cookie', {}, h('div', {}, 'We use cookies to personalize content, run ads, and analyze traffic.'), h('button', { onclick: () => cookie.remove() }, 'Okay'));
  wrap.append(ann, nav, h('h1', {}, 'Get the truth when you travel'), h('p.lede', {}, "The only app that tells you everything about your flight. Get real-time updates, the fastest alerts, and delay predictions so you're always the first to know and rebook—all in a sleek, easy-to-use app. Perfect for frequent flyers and simple enough for everyone."),
    h('div.awards', {}, h('div', {}, h('i', { style: { background: '#f1f1f1' } }, '⬡'), h('div', {}, h('b', {}, 'Apple Design Award'), h('small', {}, '❨ Winner 2023 ❩'))), h('div', {}, h('i', { style: { background: '#1f6bff', color: '#fff' } }, 'A'), h('div', {}, h('b', {}, 'App of the Year'), h('small', {}, '❨ Finalist 2023 ❩')))),
    stage, feat, cookie);
  root.append(wrap);
  showSet('pre', RM); render(); if (RM) { render(); fcs.forEach((f) => f.classList.add('vis')); }
  window.__demoProof = async () => {
    auto = false; showSet('air'); await sleep(2900); const shown = nts.filter((n) => !n.classList.contains('out')).length; const amber = nts.some((n) => n.dataset.st === 'delay' && !n.classList.contains('out'));
    await sleep(300); const w = parseFloat(lvBar.style.width); showSet('land'); await sleep(200); const landed = lvBig.textContent;
    fcs.forEach((f) => f.classList.add('vis')); showSet('pre');
    return `at-airport: ${shown} toasts stacked (amber gate-change=${amber}), progress ${w.toFixed(0)}%; after-landing card="${landed}"; reducedMotion=${RM}`;
  };
};

V['rsw-random-essay-page-gallery'] = (root, T) => {
  theme(root, T, { bg: '#f05a4f', fg: '#fff', ac: '#fff', dark: true });
  const SANS = "'Inter Variable',system-ui,sans-serif"; root.style.fontFamily = SANS;
  root.style.background = 'linear-gradient(180deg,#f45d52 0%,#e9473f 100%)';
  const st = document.createElement('style'); st.textContent = `.rsw-card{transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s,opacity .7s,translate .7s}.rsw-card.hid{opacity:0;translate:0 40px}.rsw-card:hover{transform:translateY(-6px);box-shadow:0 28px 50px #7a120d55}.rsw-col::-webkit-scrollbar{display:none}.rsw-li{transition:opacity .3s,color .3s}.rsw-li:hover{opacity:1!important}@keyframes rsw-in{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:none}}`; root.append(st);
  const E = [
    { t: 'Assassins of the Mind', a: 'Christopher Hitchens', y: 2009, pub: 'Vanity Fair', sec: "WRITERS' BLOC", dek: 'On the long shadow of a fatwa, and why the quiet habit of self-censorship may be the more lasting injury.', u: 'https://www.vanityfair.com/news/2009/02/hitchens200902' },
    { t: 'How to Do Great Work', a: 'Paul Graham', y: 2023, pub: 'paulgraham.com', sec: 'ESSAY', dek: 'A long attempt to describe what the most ambitious people actually do, from choosing a field to following curiosity past the point of reason.', u: 'https://paulgraham.com/greatwork.html' },
    { t: 'Situated Software', a: 'Clay Shirky', y: 2004, pub: 'shirky.com', sec: 'NETWORKS, ECONOMICS, AND CULTURE', dek: 'Small programs written for one group of people, in one place, and why they can succeed precisely because they do not scale.', u: 'https://gwern.net/doc/technology/2004-03-30-shirky-situatedsoftware.html' },
    { t: 'Black Triangles', a: 'Jay Barnson', y: 2004, pub: 'Rampant Games', sec: 'GAME DEVELOPMENT', dek: 'A single triangle on a screen that looked like nothing, and represented the whole engine finally working underneath it.', u: 'https://rampantgames.com/blog/?p=7745' },
    { t: 'Treat your to-read pile like a river, not a bucket', a: 'Oliver Burkeman', y: 2021, pub: 'The Imperfectionist', sec: 'NEWSLETTER', dek: 'A gentler way to think about the books and articles piling up: let them flow past, and dip in when something catches you.', u: 'https://www.oliverburkeman.com/river' },
    { t: 'The Cathedral and the Bazaar', a: 'Eric S. Raymond', y: 1997, pub: 'catb.org', sec: 'SOFTWARE', dek: 'Two ways of building software, one planned from the top and one grown in public, and what the second taught its author.', u: 'http://www.catb.org/~esr/writings/cathedral-bazaar/' },
    { t: 'You and Your Research', a: 'Richard Hamming', y: 1986, pub: 'Bell Communications Research', sec: 'TALK', dek: 'A famous talk on why some scientists do important work and most do not, and what the difference usually comes down to.', u: 'https://www.cs.virginia.edu/~robins/YouAndYourResearch.html' },
    { t: 'The Tyranny of the Marginal User', a: 'Ivan Vendrov', y: 2023, pub: 'Nothing Human', sec: 'ESSAY', dek: 'Why software that tries to please everyone drifts, release by release, toward pleasing the least engaged person in the room.', u: 'https://nothinghuman.substack.com/p/the-tyranny-of-the-marginal-user' },
    { t: 'Do Things that Don’t Scale', a: 'Paul Graham', y: 2013, pub: 'paulgraham.com', sec: 'ESSAY', dek: 'Startups take off because founders make them take off, often by doing small, manual, unglamorous things by hand.', u: 'https://paulgraham.com/ds.html' },
    { t: 'Choose Boring Technology', a: 'Dan McKinley', y: 2015, pub: 'mcfunley.com', sec: 'ENGINEERING', dek: 'Every team gets a few innovation tokens; spend them on what makes you different, and keep the rest of the stack well understood.', u: 'https://mcfunley.com/choose-boring-technology' }];
  const BODY = (e) => [`${e.dek.split(',')[0]} — this card is a placeholder first page written for the gallery demo, not the original text. Open the original to read the real opening.`, `The real site renders each essay's first page as if it were printed: masthead label, headline, a thin rule, a byline in the accent colour, then a drop-capped first paragraph that runs off the bottom of the page.`, `Pages are reshuffled on every visit so the collection feels like a stack of clippings rather than a list.`];
  const saved = new Set(JSON.parse(localStorage.getItem('rsw-saved') || '[]')); const persist = () => localStorage.setItem('rsw-saved', JSON.stringify([...saved]));
  let seed = (Date.now() % 100000) | 0, order = [], active = 0;
  const shuffle = (sd) => { const r = rng(sd); const a = E.map((_, i) => i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const page = (e, big = false) => h('div', { style: { background: '#fff', color: '#1d1d1d', padding: big ? '48px 54px' : '40px 38px', height: big ? 'auto' : '100%', overflow: 'hidden', boxSizing: 'border-box', position: 'relative' } },
    h('div', { style: { fontSize: '9px', fontWeight: 700, letterSpacing: '.12em' } }, h('span', { style: { color: '#e9473f' } }, e.sec), h('span', { style: { opacity: .55, marginLeft: '12px' } }, `${e.pub.toUpperCase()} · ${e.y}`)),
    h('div', { style: { fontFamily: SERIF, fontWeight: 800, fontSize: big ? '34px' : '24px', lineHeight: 1.12, margin: '14px 0 18px', letterSpacing: '-.01em' } }, e.t), h('div', { style: { width: '60px', height: '2px', background: '#e9473f', marginBottom: '18px' } }),
    h('p', { style: { fontSize: '12px', lineHeight: 1.6, margin: '0 0 18px' } }, e.dek),
    h('div', { style: { fontSize: '9px', fontWeight: 700, letterSpacing: '.12em', marginBottom: '6px' } }, 'BY ', h('span', { style: { color: '#e9473f' } }, e.a.toUpperCase())), h('div', { style: { fontSize: '9px', letterSpacing: '.1em', opacity: .55, marginBottom: '22px' } }, String(e.y)),
    ...BODY(e).map((p, i) => h('p', { style: { fontFamily: SERIF, fontSize: '13px', lineHeight: 1.75, margin: '0 0 10px' } }, i === 0 ? h('span', { style: { float: 'left', fontSize: '52px', lineHeight: '44px', color: '#e9473f', fontWeight: 700, margin: '4px 8px 0 0' } }, p[0]) : null, i === 0 ? p.slice(1) : p)),
    big ? h('a', { href: e.u, target: '_blank', rel: 'noopener', style: { display: 'inline-block', marginTop: '14px', color: '#e9473f', fontWeight: 700, fontSize: '13px', fontFamily: SANS } }, `원문 읽기 → ${new URL(e.u).hostname}`) : h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '70px', background: 'linear-gradient(#fff0,#fff)' } }));
  const col = h('div.rsw-col', { style: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: '440px', marginLeft: '-220px', overflowY: 'auto', scrollSnapType: 'y mandatory', scrollbarWidth: 'none', padding: '0 15px' } });
  const list = h('div', { style: { display: 'grid', gap: '12px', marginTop: '40px' } });
  const yearEl = h('div', { style: { fontSize: '14px', opacity: .9 } }), titleEl = h('div', { style: { fontSize: '25px', fontWeight: 700, lineHeight: 1.2, margin: '8px 0 6px' } }), authEl = h('div', { style: { fontSize: '17px', opacity: .85 } });
  const saveB = h('button', { onclick: () => toggleSave(), style: { border: 0, background: '#ffffff40', color: '#fff', borderRadius: '6px', height: '40px', padding: '0 16px', fontWeight: 600, fontSize: '13px', fontFamily: SANS } });
  const linkB = h('button', { title: 'Copy link', onclick: () => copy(E[order[active]].u, 'Link copied'), style: { border: 0, background: '#ffffff40', color: '#fff', borderRadius: '6px', width: '40px', height: '40px', fontSize: '16px' } }, '🔗');
  const toggleSave = (force) => { const k = E[order[active]].t; const on = force ?? !saved.has(k); on ? saved.add(k) : saved.delete(k); persist(); meta(); };
  const meta = () => { const e = E[order[active]]; yearEl.textContent = e.y; titleEl.textContent = e.t; authEl.textContent = e.a; saveB.textContent = saved.has(e.t) ? '✓ Saved to Read Later' : 'Save to Read Later'; saveB.style.background = saved.has(e.t) ? '#fff' : '#ffffff40'; saveB.style.color = saved.has(e.t) ? '#e9473f' : '#fff'; [...list.children].forEach((li, i) => { const d = Math.abs(i - active); li.style.opacity = i === active ? 1 : Math.max(0.18, 0.62 - d * 0.07); li.style.fontWeight = i === active ? 600 : 500; }); };
  const goto = (i, smooth = true) => { const c = col.querySelectorAll('.rsw-card')[i]; active = i; meta(); if (c) col.scrollTo({ top: c.offsetTop - (col.clientHeight - c.offsetHeight) / 2, behavior: smooth ? 'smooth' : 'auto' }); };
  const overlay = h('div', { onclick: (e) => { if (e.target === overlay) closeO(); }, style: { position: 'absolute', inset: 0, background: '#5a0f0bcc', display: 'none', overflow: 'auto', zIndex: 8, padding: '40px 0', backdropFilter: 'blur(3px)' } });
  const openO = (i) => { const e = E[order[i]]; overlay.replaceChildren(h('div', { style: { width: '620px', margin: '0 auto', boxShadow: '0 30px 80px #0006', animation: 'rsw-in .35s cubic-bezier(.2,.8,.2,1)', position: 'relative' } }, h('button', { onclick: closeO, style: { position: 'absolute', right: '12px', top: '10px', border: 0, background: 'none', fontSize: '20px', color: '#999', zIndex: 2 } }, '✕'), page(e, true))); overlay.style.display = 'block'; };
  const closeO = () => (overlay.style.display = 'none');
  let io;
  const render = () => {
    order = shuffle(seed); active = 0; io?.disconnect();
    list.replaceChildren(...order.map((oi, i) => h('div.rsw-li', { onclick: () => goto(i), style: { cursor: 'pointer', fontSize: '13px', lineHeight: 1.35, maxWidth: '190px' } }, E[oi].t)));
    col.replaceChildren(h('div', { style: { height: 'calc(50% - 250px)' } }), ...order.map((oi, i) => { const c = h('div.rsw-card.hid', { onclick: () => openO(i), style: { height: '500px', margin: '0 0 40px', scrollSnapAlign: 'center', cursor: 'zoom-in', border: '4px solid #ffffff55', boxShadow: '0 18px 40px #7a120d40', transitionDelay: `${(i % 3) * 90}ms` } }, page(E[oi])); c.dataset.i = i; return c; }), h('div', { style: { height: 'calc(50% - 250px)' } }));
    io = new IntersectionObserver((ents) => ents.forEach((en) => en.isIntersecting && en.target.classList.remove('hid')), { root: col, threshold: 0.15 }); [...col.querySelectorAll('.rsw-card')].forEach((c) => io.observe(c));
    col.scrollTop = 0; seedEl.textContent = `seed #${seed}`; meta();
  };
  col.addEventListener('scroll', () => { const mid = col.scrollTop + col.clientHeight / 2; let best = 0, bd = 1e9; [...col.querySelectorAll('.rsw-card')].forEach((c, i) => { const d = Math.abs(c.offsetTop + c.offsetHeight / 2 - mid); if (d < bd) { bd = d; best = i; } }); if (best !== active) { active = best; meta(); } });
  const seedEl = h('span');
  root.append(
    h('div', { style: { position: 'absolute', left: '40px', top: '34px', bottom: '24px', width: '230px', display: 'flex', flexDirection: 'column', zIndex: 2 } }, h('div', { style: { fontFamily: SERIF, fontWeight: 800, fontSize: '25px', lineHeight: 1.05 } }, 'Read', h('br'), 'Something', h('br'), 'Wonderful-ish'), h('p', { style: { fontSize: '12px', lineHeight: 1.5, opacity: .85, margin: '14px 0 0', maxWidth: '200px' } }, '인터넷에서 가장 오래 남을 글들. 방문할 때마다 순서가 섞입니다. 한 장을 골라 천천히 읽어 보세요.'), list, h('span', { style: { flex: 1 } }), h('div.k-row', { style: { gap: '10px', fontSize: '15px' } }, h('span', { style: { width: '28px', height: '28px', borderRadius: '6px', background: '#fff', color: '#e9473f', display: 'grid', placeItems: 'center', fontWeight: 900 } }, 'M'), 'Matter-ish'), h('div', { style: { fontSize: '10px', opacity: .7, marginTop: '6px' } }, 'Curated by the Matter-ish team · 에세이 선정 크레딧')),
    col,
    h('div', { style: { position: 'absolute', right: '46px', top: '50%', transform: 'translateY(-50%)', width: '250px', zIndex: 2 } }, yearEl, titleEl, authEl, h('div.k-row', { style: { marginTop: '22px', gap: '8px' } }, linkB, saveB), h('div.k-row', { style: { marginTop: '28px', gap: '10px', fontSize: '11px', opacity: .85 } }, h('button', { onclick: () => { seed = (seed * 7 + 13) % 100000; render(); }, style: { border: '1px solid #ffffff88', background: 'none', color: '#fff', borderRadius: '99px', padding: '6px 12px', fontWeight: 600, fontSize: '11px' } }, '⤮ 다시 섞기'), seedEl)),
    h('button', { style: { position: 'absolute', right: '26px', bottom: '22px', width: '30px', height: '30px', borderRadius: '50%', border: 0, background: '#ffffff40', color: '#fff', zIndex: 2 } }, '?'), overlay);
  render();
  window.__demoProof = async () => { const s0 = seed, first = order[0]; seed = 4242; render(); const reshuffled = order.join() !== shuffle(s0).join() || first !== order[0]; goto(2, false); col.dispatchEvent(new Event('scroll')); await sleep(80); const act = active; toggleSave(true); const persisted = JSON.parse(localStorage.getItem('rsw-saved')).includes(E[order[act]].t); openO(act); const opened = overlay.style.display === 'block' && !!overlay.querySelector('a[href]'); closeO(); toggleSave(false); seed = s0; render(); await sleep(50); return `reshuffle=${reshuffled}, scrolled to card ${act + 1} (right meta synced), save→localStorage=${persisted}, reader overlay with outbound link=${opened}; restored`; };
};

V['nothing-dotmatrix-brand-store'] = (root, T) => {
  theme(root, T, { bg: '#f3f3f3', fg: '#000', ac: '#d71921', dark: false }); scroll(root);
  const RED = '#d71921', LORA = "'Lora',Georgia,serif", MO = "'JetBrains Mono Variable',ui-monospace,monospace";
  const G5 = { A: '01110100011000111111100011000110001', B: '11110100011000111110100011000111110', C: '01110100011000010000100001000101110', D: '11110100011000110001100011000111110', E: '11111100001000011110100001000011111', F: '11111100001000011110100001000010000', G: '01110100011000010111100011000101111', H: '10001100011000111111100011000110001', I: '01110001000010000100001000010001110', J: '00111000100001000010000101001001100', K: '10001100101010011000101001001010001', L: '10000100001000010000100001000011111', M: '10001110111010110101100011000110001', N: '10001100011100110101100111000110001', O: '01110100011000110001100011000101110', P: '11110100011000111110100001000010000', Q: '01110100011000110001101011001001101', R: '11110100011000111110101001001010001', S: '01111100001000001110000010000111110', T: '11111001000010000100001000010000100', U: '10001100011000110001100011000101110', V: '10001100011000110001100010101000100', W: '10001100011000110101101011010101010', X: '10001100010101000100010101000110001', Y: '10001100011000101010001000010000100', Z: '11111000010001000100010001000011111', 0: '01110100011001110101110011000101110', 1: '00100011000010000100001000010001110', 2: '01110100010000100010001000100011111', 3: '11111000100010000010000011000101110', 4: '00010001100101010010111110001000010', 5: '11111100001111000001000011000101110', 6: '00110010001000011110100011000101110', 7: '11111000010001000100010000100001000', 8: '01110100011000101110100011000101110', 9: '01110100011000101111000010001001100', '(': '00010001000100001000010000010000010', ')': '01000001000001000010000100010001000', '.': '00000000000000000000000000110001100', '%': '11000110010001000100010001001100011', '-': '00000000000000011111000000000000000', '°': '01100100101001001100000000000000000' };
  const dotText = (text, d = 6, color = '#000', r = 0.42) => { const cs = [...text.toUpperCase()]; let x = 0; const circ = []; cs.forEach((c) => { if (c === ' ') { x += 4; return; } const g = G5[c]; if (!g) { x += 6; return; } for (let k = 0; k < 35; k++) if (g[k] === '1') circ.push(s('circle', { cx: (x + (k % 5)) * d + d / 2, cy: Math.floor(k / 5) * d + d / 2, r: d * r, fill: color })); x += 6; }); return s('svg', { width: Math.max(1, x - 1) * d, height: 7 * d, viewBox: `0 0 ${Math.max(1, x - 1) * d} ${7 * d}`, style: 'display:block;overflow:visible' }, ...circ); };
  root.append(h('style', {}, `.nt-dotbg{background-color:#f3f3f3;background-image:radial-gradient(#c9c9c9 1px,transparent 1.4px);background-size:80px 80px;background-position:22px 22px}.nt-btn{font:500 11px ${MO};letter-spacing:.06em;border:0;background:#000;color:#fff;padding:11px 14px;cursor:pointer;display:inline-flex;gap:10px;align-items:center;text-transform:uppercase}.nt-btn.w{background:#fff;color:#000}.nt-btn:hover{background:${RED};color:#fff}.nt-lk{font:500 11px ${MO};letter-spacing:.04em;text-decoration:underline;text-underline-offset:3px;cursor:pointer;color:#111;text-transform:uppercase}.nt-tile{position:relative;background:linear-gradient(180deg,#eef0f3,#e3e6ea);aspect-ratio:1/0.87;overflow:hidden;cursor:pointer}.nt-tile .a,.nt-tile .b{position:absolute;inset:0;display:grid;place-items:center;transition:opacity .35s,transform .5s}.nt-tile .b{opacity:0;transform:scale(1.04)}.nt-tile:hover .a,.nt-tile.swap .a{opacity:0;transform:scale(.97)}.nt-tile:hover .b,.nt-tile.swap .b{opacity:1;transform:none}.nt-cat{cursor:pointer}.nt-cat.on .nt-lk{color:${RED}}.nt-tape{position:absolute;background:linear-gradient(180deg,#f1f0ecee,#e4e2dcee);box-shadow:0 2px 6px #0003;display:flex;align-items:center;justify-content:space-around;transition:transform .25s ease-out}`));
  // product art (svg stand-ins)
  const art = {
    earbuds: (alt) => s('svg', { viewBox: '0 0 200 170', width: 170 }, s('g', { transform: alt ? 'rotate(-18 100 85)' : '' }, s('rect', { x: 52, y: 22, width: 34, height: 56, rx: 16, fill: '#f5d90a' }), s('rect', { x: 64, y: 70, width: 12, height: 64, rx: 6, fill: '#e9e9ea', stroke: '#bbb' }), s('circle', { cx: 69, cy: 46, r: 5, fill: RED }), s('rect', { x: 108, y: 64, width: 34, height: 56, rx: 16, fill: '#f0f0f0', stroke: '#ccc' }), s('rect', { x: 120, y: 112, width: 12, height: 46, rx: 6, fill: '#ddd' }), s('circle', { cx: 125, cy: 86, r: 5, fill: RED }))),
    headphones: (alt) => s('svg', { viewBox: '0 0 200 170', width: 170 }, ...[['#d9d9d9', 60, 40], ['#f5d90a', 112, 52], ['#222', 74, 92], ['#f2b6c6', 120, 108], ['#eee', 84, 132]].map(([c, x, y], i) => s('g', { transform: `rotate(${(alt ? -1 : 1) * (i * 23 - 30)} ${x} ${y})` }, s('rect', { x: x - 24, y: y - 18, width: 48, height: 36, rx: 12, fill: c, stroke: '#9995' }), s('circle', { cx: x + 12, cy: y - 6, r: 4, fill: '#fff8' })))),
    phones: (alt) => s('svg', { viewBox: '0 0 200 170', width: 180 }, ...[['#e8c3cf', 30], ['#cfd2d6', 74], ['#2b2b2d', 118]].map(([c, x], i) => s('g', { transform: alt ? `translate(${(1 - i) * -6} ${i * 4})` : '' }, s('rect', { x, y: 18 + (i === 1 ? -8 : 6), width: 52, height: 128, rx: 9, fill: c, stroke: '#0003' }), s('circle', { cx: x + 14, cy: 36 + (i === 1 ? -8 : 6), r: 7, fill: '#111', stroke: '#fff6', 'stroke-width': 2 }), s('circle', { cx: x + 32, cy: 36 + (i === 1 ? -8 : 6), r: 7, fill: '#111', stroke: '#fff6', 'stroke-width': 2 }), alt ? s('rect', { x: x + 10, y: 70, width: 32, height: 3, fill: '#fff9' }) : null))),
    watch: (alt) => s('svg', { viewBox: '0 0 200 170', width: 150 }, s('rect', { x: 78, y: 6, width: 44, height: 158, rx: 14, fill: alt ? '#2d2d2d' : '#f04a1a' }), s('circle', { cx: 100, cy: 85, r: 44, fill: '#2a2a2a', stroke: '#555', 'stroke-width': 6 }), s('line', { x1: 100, y1: 85, x2: 100, y2: 56, stroke: '#fff', 'stroke-width': 3 }), s('line', { x1: 100, y1: 85, x2: 122, y2: 92, stroke: RED, 'stroke-width': 2 }), s('text', { x: 100, y: 112, 'text-anchor': 'middle', fill: '#fff', 'font-size': 9, 'font-family': 'monospace' }, '10:10')),
    phone3: (alt) => s('svg', { viewBox: '0 0 200 170', width: 120 }, s('rect', { x: 66, y: 10, width: 68, height: 150, rx: 10, fill: alt ? '#f4f4f4' : '#1d1d1f', stroke: '#0004' }), ...Array.from({ length: 24 }, (_, i) => s('circle', { cx: 82 + (i % 6) * 7, cy: 28 + Math.floor(i / 6) * 7, r: 1.6, fill: alt ? '#111' : '#fff' })), s('circle', { cx: 110, cy: 100, r: 12, fill: 'none', stroke: RED, 'stroke-width': 2 })),
    hp: (alt) => s('svg', { viewBox: '0 0 200 170', width: 160 }, s('path', { d: 'M50 110 C50 30 150 30 150 110', fill: 'none', stroke: alt ? '#f5f5f5' : '#2a2a2a', 'stroke-width': 10 }), s('rect', { x: 34, y: 96, width: 34, height: 52, rx: 12, fill: alt ? '#eee' : '#1b1b1b' }), s('rect', { x: 132, y: 96, width: 34, height: 52, rx: 12, fill: alt ? '#eee' : '#1b1b1b' }), s('circle', { cx: 149, cy: 112, r: 3, fill: RED })),
  };
  // --- nav pill + drawer
  const drawer = h('div', { style: { position: 'fixed', left: '50%', top: '84px', transform: 'translateX(-50%) translateY(-8px)', width: '410px', background: '#ffffffee', backdropFilter: 'blur(14px)', borderRadius: '6px', padding: '18px 22px', zIndex: 30, opacity: 0, pointerEvents: 'none', transition: '.25s', boxShadow: '0 10px 30px #0002' } }, ...['Sale', 'Phones', 'Audio', 'CMF by Nothing', 'Accessories', 'Community', 'Support'].map((l, i) => h('div', { style: { font: `${i ? 400 : 600} 22px ${LORA}`, padding: '8px 0', borderBottom: '1px solid #0001', color: i ? '#111' : RED, cursor: 'pointer' } }, l)));
  let menu = false; const tgl = () => { menu = !menu; Object.assign(drawer.style, { opacity: menu ? 1 : 0, pointerEvents: menu ? 'auto' : 'none', transform: `translateX(-50%) translateY(${menu ? 0 : -8}px)` }); burger.textContent = menu ? '✕' : '☰'; };
  const burger = h('span', { style: { cursor: 'pointer', fontSize: '13px', width: '20px' }, onclick: () => tgl() }, '☰'); let cartN = 0; const cartEl = h('span', { style: { fontSize: '11px', font: `11px ${MO}` } }, '🛍');
  const navP = h('div', { style: { position: 'sticky', top: '8px', zIndex: 31, width: '410px', margin: '0 auto -48px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: '#ffffffcc', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '6px', boxShadow: '0 1px 6px #0001' } }, burger, h('span', { style: { font: `500 13px ${MO}`, letterSpacing: '.08em' } }, 'NOTHING (R)'), cartEl);
  // --- hero (cardboard + tapes)
  const tape = (txt, st, d = 13) => h('div.nt-tape', { style: st }, dotText(txt, d, '#111', 0.4), dotText(txt, d, '#111', 0.4));
  const tapes = [tape('SALE', { left: '-8%', top: '6%', width: '70%', height: '200px', transform: 'rotate(38deg)' }), tape('SALE', { left: '30%', top: '42%', width: '95%', height: '210px', transform: 'rotate(-32deg)' }), tape('SALE', { left: '58%', top: '0%', width: '60%', height: '170px', transform: 'rotate(58deg)' })];
  const icon = (p) => s('svg', { viewBox: '0 0 40 40', width: 52, height: 52 }, s('rect', { x: 2, y: 2, width: 36, height: 36, fill: 'none', stroke: RED, 'stroke-width': 2.5 }), s('path', { d: p, fill: 'none', stroke: RED, 'stroke-width': 2.6, 'stroke-linecap': 'round' }));
  const fragile = h('div', { style: { position: 'absolute', right: '1.5%', top: '-3%', width: '370px', background: '#fff', border: `5px solid ${RED}`, transform: 'rotate(-6deg)', padding: '6px 16px 14px', boxShadow: '0 6px 16px #0003', color: RED, textAlign: 'center', transition: 'transform .25s' } }, h('div', { style: { font: `900 54px 'Inter Variable',sans-serif`, letterSpacing: '.02em', lineHeight: 1 } }, 'FRAGILE'), h('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center', margin: '8px 0' } }, icon('M12 26 A8 8 0 0 1 28 26 M14 26v6 M26 26v6'), icon('M14 30V12 M10 16l4-5 4 5 M26 30V12 M22 16l4-5 4 5'), icon('M10 22c4 6 16 6 20 0 M14 22v-8 M26 22v-8'), icon('M8 20 A12 12 0 0 1 32 20 Z M20 20v12 M20 32c0 3-4 3-4 0')), h('div', { style: { font: `800 25px 'Inter Variable',sans-serif` } }, 'CONTAINS NOTHING'));
  const label = h('div', { style: { position: 'absolute', left: '-1%', top: '34%', width: '420px', background: '#fafafa', transform: 'rotate(4deg)', boxShadow: '0 6px 14px #0003', padding: '0 0 14px', transition: 'transform .25s' } }, h('div', { style: { height: '22px', background: RED, borderBottom: '6px solid #fff', boxShadow: `0 6px 0 #3b5bcc` } }), h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 18px 0' } }, h('div', { style: { font: `900 italic 22px 'Inter Variable',sans-serif`, color: '#2c3f8f', lineHeight: 1 } }, 'NOTHING TECH', h('br'), 'POSTAL SERVICE®'), h('div', { style: { width: '2px', height: '64px', background: '#2c3f8f' } }), h('div', { style: { color: RED, font: `900 28px 'Inter Variable',sans-serif`, lineHeight: 1, textAlign: 'center' } }, 'NOTHING®', h('br'), 'MAIL', h('div', { style: { font: `700 11px 'Inter Variable',sans-serif`, marginTop: '8px' } }, 'VISIT US AT NOTHING.TECH', h('br'), 'ORDER FROM THE SALE NOW'))));
  const blue = h('div', { style: { position: 'absolute', left: '26%', top: '64%', background: '#2448c9', color: '#fff', borderRadius: '10px', padding: '12px 22px', transform: 'rotate(-8deg)', boxShadow: '0 4px 12px #0004', font: `800 33px 'Inter Variable',sans-serif`, lineHeight: 1, transition: 'transform .25s' } }, 'SALE NOW', h('div', { style: { font: `italic 600 19px 'Inter Variable',sans-serif` } }, 'soldes en cours'), h('div', { style: { font: `600 12px 'Inter Variable',sans-serif`, textAlign: 'right', marginTop: '4px' } }, 'Nothing Mail®'));
  const stamp = h('div', { style: { position: 'absolute', left: '1%', top: '56%', width: '200px', height: '200px', border: `6px solid ${RED}cc`, borderRadius: '30% 34% 28% 36%', transform: 'rotate(-12deg)', color: `${RED}cc`, display: 'grid', placeItems: 'center', font: `900 64px 'Inter Variable',sans-serif` } }, '✈', h('div', { style: { position: 'absolute', bottom: '-46px', left: '10px', font: `900 30px 'Inter Variable',sans-serif`, letterSpacing: '.1em' } }, 'SALE 123'));
  const hero = h('div', { style: { position: 'relative', height: '900px', overflow: 'hidden', backgroundColor: '#b88758', backgroundImage: 'radial-gradient(ellipse at 30% 20%,#c99a6a 0,transparent 60%),radial-gradient(ellipse at 80% 70%,#a77748 0,transparent 55%),repeating-linear-gradient(92deg,#0000 0 3px,#00000008 3px 4px)' } }, ...tapes, label, stamp, blue, fragile);
  hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5; tapes.forEach((t, i) => (t.style.translate = `${dx * (10 + i * 6)}px ${dy * (8 + i * 5)}px`)); [label, blue, fragile].forEach((el, i) => (el.style.translate = `${dx * -(14 + i * 8)}px ${dy * -(12 + i * 6)}px`)); });
  // --- sale story
  const story = h('div.nt-dotbg', { style: { padding: '60px 8.7% 30px' } }, h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' } }, h('div', {}, dotText('AUTUMN SALE', 2.6, '#111', 0.46)), h('div', {}, h('div', { style: { font: `400 34px ${LORA}`, letterSpacing: '-.01em' } }, 'Your parcel has arrived'), h('p', { style: { font: `14px/1.5 'Inter Variable',sans-serif`, color: '#555', maxWidth: '590px' } }, 'You’re on the way home. Your little treat for the season is on your doorstep. Well, it’s not. But it could be. Shop up to 30% off at our Autumn Sale.'), h('button.nt-btn', { onclick: () => toast('Shop sale (demo)') }, 'SHOP SALE ›'))));
  // --- categories + product tiles
  const CATS = [['Earbuds', 'earbuds'], ['Headphones', 'headphones'], ['Phones', 'phones'], ['CMF', 'watch']];
  const PRODUCTS = [['Ear (3)', 'Earbuds', 'earbuds', '£179'], ['Headphone (1) Pro', 'Headphones', 'hp', '£299'], ['Phone (3)', 'Phones', 'phone3', '£799'], ['Phone (3a)', 'Phones', 'phones', '£329'], ['CMF Watch 3 Pro', 'CMF', 'watch', '£99'], ['Ear (open)', 'Earbuds', 'headphones', '£129']];
  let cat = null; const catEls = []; const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginTop: '18px' } });
  const drawGrid = () => { grid.replaceChildren(...PRODUCTS.filter((p) => !cat || p[1] === cat).map(([n, c, a, pr]) => h('div', {}, h('div.nt-tile', {}, h('div.a', {}, art[a](false)), h('div.b', {}, art[a](true)), h('span', { style: { position: 'absolute', left: '12px', top: '10px', font: `10px ${MO}`, color: RED } }, c.toUpperCase())), h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px' } }, h('span', { style: { font: `17px ${LORA}` } }, n), h('span', { style: { font: `11px ${MO}` } }, pr)), h('div', { style: { display: 'flex', gap: '18px', marginTop: '8px' } }, h('span.nt-lk', { onclick: () => toast(`Discover ${n}`) }, 'Discover ›'), h('span.nt-lk', { onclick: () => { cartN++; cartEl.textContent = `🛍 ${cartN}`; toast(`${n} added to bag`); } }, 'Add to bag +'))))); prodTitle.textContent = cat ? `${cat} — ${grid.children.length} products` : 'Featured products'; };
  const prodTitle = h('div', { style: { font: `400 26px ${LORA}` } });
  const catRow = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginTop: '30px' } }, ...CATS.map(([n, a]) => { const el = h('div.nt-cat', { onclick: () => { cat = cat === n ? null : n; catEls.forEach((c) => c.classList.toggle('on', c.dataset.c === cat)); drawGrid(); } }, h('div.nt-tile', {}, h('div.a', {}, art[a](false)), h('div.b', {}, art[a](true))), h('div', { style: { marginTop: '12px' } }, h('span.nt-lk', {}, `${n} ›`))); el.dataset.c = n; catEls.push(el); return el; }));
  const shop = h('div.nt-dotbg', { style: { padding: '40px 8.7% 70px' } }, h('div', { style: { textAlign: 'center', font: `400 38px ${LORA}` } }, 'Shop by category'), catRow, h('div', { style: { marginTop: '64px', display: 'flex', alignItems: 'center', gap: '16px' } }, prodTitle, h('span', { style: { flex: 1 } }), h('span.nt-lk', { onclick: () => { cat = null; catEls.forEach((c) => c.classList.remove('on')); drawGrid(); } }, 'View all')), grid);
  // --- dark feature
  const feat = h('div', { style: { background: '#000', color: '#fff', textAlign: 'center', padding: '44px 0 0', position: 'relative', overflow: 'hidden', backgroundImage: 'radial-gradient(#333 1px,transparent 1.4px)', backgroundSize: '80px 80px' } }, h('div', { style: { display: 'flex', justifyContent: 'center' } }, dotText('HEADPHONE (1) PRO', 2.4, '#fff', 0.46)), h('div', { style: { font: `400 40px/1.15 ${LORA}`, margin: '22px 0 26px' } }, 'Studio-level precision for our', h('br'), 'most advanced headphone ever.'), h('button.nt-btn.w', { onclick: () => toast('Discover Headphone (1) Pro') }, 'DISCOVER ›'), h('div', { style: { display: 'flex', justifyContent: 'center', marginTop: '10px', opacity: 0.9 } }, s('svg', { viewBox: '0 0 400 260', width: 520 }, s('path', { d: 'M90 240 C70 40 330 40 310 240', fill: 'none', stroke: '#3a3a3a', 'stroke-width': 26 }), s('path', { d: 'M90 240 C70 40 330 40 310 240', fill: 'none', stroke: '#777', 'stroke-width': 2 }), s('rect', { x: 50, y: 170, width: 76, height: 90, rx: 24, fill: '#1c1c1c', stroke: '#555' }), s('rect', { x: 274, y: 170, width: 76, height: 90, rx: 24, fill: '#1c1c1c', stroke: '#555' }), s('circle', { cx: 330, cy: 196, r: 4, fill: RED }))));
  // --- benefits, newsletter, footer
  const bIcon = (p) => s('svg', { viewBox: '0 0 24 24', width: 22, height: 22 }, s('path', { d: p, fill: 'none', stroke: '#111', 'stroke-width': 1.4 }));
  const benefits = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd', background: '#fff' } }, ...[['Free delivery', 'On all orders over £50', 'M2 7h12v9H2z M14 10h4l3 3v3h-7 M6 19a2 2 0 1 0 0-.1 M17 19a2 2 0 1 0 0-.1'], ['30-day returns', 'Change of mind? No problem', 'M4 12a8 8 0 1 0 2.3-5.7 M4 4v4h4'], ['Price match', 'Seen it cheaper? We’ll match it', 'M3 12l9-9 9 9-9 9z M9 12h6'], ['2-year warranty', 'Covered, inside and out', 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z']].map(([t, d, p], i) => h('div', { style: { padding: '26px 28px', display: 'flex', gap: '14px', alignItems: 'flex-start', borderLeft: i ? '1px solid #ddd' : '' } }, bIcon(p), h('div', {}, h('div', { style: { font: `500 12px ${MO}`, textTransform: 'uppercase', letterSpacing: '.04em' } }, t), h('div', { style: { font: `13px 'Inter Variable',sans-serif`, color: '#777', marginTop: '4px' } }, d)))));
  const email = h('input', { type: 'email', placeholder: 'Email address', style: { flex: 1, border: 0, borderBottom: '1px solid #111', background: 'transparent', font: `14px 'Inter Variable',sans-serif`, padding: '10px 0', outline: 0 } });
  const nlMsg = h('div', { style: { font: `12px ${MO}`, marginTop: '12px', minHeight: '16px' } });
  const nlForm = h('form', { novalidate: true, style: { display: 'flex', gap: '16px', alignItems: 'center', marginTop: '20px' }, onsubmit: (e) => { e.preventDefault(); const ok = /.+@.+\..+/.test(email.value); nlMsg.style.color = ok ? '#111' : RED; nlMsg.textContent = ok ? `● You’re in. Check ${email.value} for 10% off your first order.` : '● Please enter a valid email address.'; if (ok) nlForm.style.display = 'none'; } }, email, h('button.nt-btn', { type: 'submit' }, 'SUBSCRIBE ›'));
  const news = h('div.nt-dotbg', { style: { padding: '70px 8.7%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' } }, h('div', {}, dotText('STAY IN THE LOOP', 2.4, '#111', 0.46), h('div', { style: { font: `400 30px ${LORA}`, marginTop: '18px' } }, 'Launches, drops and the occasional surprise.')), h('div', {}, nlForm, nlMsg));
  const store = h('select', { style: { background: '#111', color: '#fff', border: '1px solid #444', font: `11px ${MO}`, padding: '8px', textTransform: 'uppercase' }, onchange: (e) => toast(`Store switched to ${e.target.value}`) }, ...['United Kingdom · English', 'United States · English', 'Korea · 한국어', 'France · Français', 'Japan · 日本語'].map((o) => h('option', {}, o)));
  const foot = h('div', { style: { background: '#000', color: '#bbb', padding: '50px 8.7% 40px', font: `12px 'Inter Variable',sans-serif` } }, h('div', { style: { display: 'grid', gridTemplateColumns: '1.2fr repeat(3,1fr)', gap: '30px' } }, h('div', {}, dotText('NOTHING', 3, '#fff', 0.46), h('div', { style: { marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' } }, h('span', { style: { width: '7px', height: '7px', borderRadius: '50%', background: RED } }), store)), ...[['Shop', ['Phones', 'Audio', 'CMF', 'Accessories']], ['Support', ['Order status', 'Returns', 'Warranty', 'Contact']], ['Company', ['About', 'Careers', 'Press', 'Community']]].map(([t, ls]) => h('div', {}, h('div', { style: { font: `11px ${MO}`, color: '#fff', marginBottom: '12px', textTransform: 'uppercase' } }, t), ...ls.map((l) => h('div', { style: { padding: '4px 0' } }, l))))), h('div', { style: { marginTop: '40px', font: `10px ${MO}`, color: '#666' } }, '© NOTHING TECHNOLOGY LIMITED — CLONE PRACTICE DEMO'));
  root.append(navP, drawer, hero, story, shop, feat, benefits, news, foot); drawGrid();
  window.__demoProof = async () => { const dots = root.querySelectorAll('circle').length; catEls[2].click(); const nPh = grid.children.length; const t = grid.querySelector('.nt-tile'); t.classList.add('swap'); await sleep(40); const swapped = getComputedStyle(t.querySelector('.b')).opacity !== ''; t.classList.remove('swap'); catEls[2].click(); email.value = 'bad'; nlForm.requestSubmit(); const err = nlMsg.textContent.includes('valid'); email.value = 'junbok@example.com'; nlForm.requestSubmit(); const ok = nlMsg.textContent.includes('in.'); nlForm.style.display = 'flex'; nlMsg.textContent = ''; email.value = ''; tgl(); const open = drawer.style.opacity === '1'; tgl(); root.scrollTop = 0; return `dot-matrix circles=${dots}, Phones filter→${nPh} tiles, hover swap=${swapped}, newsletter invalid=${err} success=${ok}, menu drawer=${open}; restored`; };
};

V['mymind-manifesto-masonry-landing'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#25272c', ac: '#ff5924', dark: false }); scroll(root);
  const SF = "'Fraunces Variable',Georgia,serif", SA = "'Inter Variable',system-ui,sans-serif";
  root.append(h('style', {}, `.mm-in{opacity:0;transform:translateY(18px);filter:blur(6px);animation:mmIn 1.1s cubic-bezier(.2,.7,.2,1) forwards}@keyframes mmIn{to{opacity:1;transform:none;filter:none}}.mm-pill{display:inline-block;border:1px solid currentColor;border-radius:99px;padding:2px 12px;margin:3px 2px;font-size:14px;cursor:pointer;transition:.2s}.mm-pill:hover,.mm-pill.on{background:currentColor}.mm-pill:hover span,.mm-pill.on span{color:#fff}.mm-board{columns:5 200px;column-gap:14px}.mm-card{break-inside:avoid;margin:0 0 14px;border-radius:6px;background:#fff;box-shadow:0 1px 3px #0000000f,0 0 0 1px #0000000a;overflow:hidden;position:relative;transition:transform .25s,box-shadow .25s,opacity .3s;cursor:pointer}.mm-card:hover,.mm-card.lift{transform:translateY(-4px);box-shadow:0 14px 30px #0000001f}.mm-tags{display:flex;gap:4px;flex-wrap:wrap;padding:0 10px;max-height:0;overflow:hidden;transition:max-height .3s,padding .3s}.mm-card:hover .mm-tags,.mm-card.lift .mm-tags{max-height:60px;padding:8px 10px 10px}.mm-tag{font:11px ${SA};background:#f1f2f5;color:#666;border-radius:99px;padding:2px 8px}.mm-w{opacity:.12;transition:opacity .4s,color .4s}.mm-w.on{opacity:1}.mm-no{position:relative;display:inline-block;font:400 44px/1.25 ${SF};color:#25272c;cursor:pointer}.mm-no::after{content:'';position:absolute;left:-2%;top:54%;height:3px;width:0;background:#ff5924;transition:width .6s cubic-bezier(.6,0,.2,1)}.mm-no.x::after{width:104%}.mm-no.x{color:#25272c88}.mm-nav a{cursor:pointer;color:#555;text-decoration:none}.mm-nav a:hover{color:#000}`));
  const dot = (c) => h('span', { style: { width: '5px', height: '5px', borderRadius: '50%', background: c, display: 'inline-block', marginRight: '7px', verticalAlign: 'middle' } });
  const logo = h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', font: `600 17px ${SA}`, letterSpacing: '-.02em' } }, s('svg', { viewBox: '0 0 24 24', width: 20, height: 20 }, s('circle', { cx: 12, cy: 12, r: 9.5, fill: 'none', stroke: '#25272c', 'stroke-width': 1.6 }), s('path', { d: 'M9 7c3 2 3 8 0 10M13 8c2 2 2 6 0 8', fill: 'none', stroke: '#25272c', 'stroke-width': 1.6, 'stroke-linecap': 'round' })), 'mymind', h('sup', { style: { fontSize: '8px' } }, '®'));
  const nav = h('div.mm-nav', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '86px', display: 'flex', alignItems: 'center', padding: '0 4.1%', zIndex: 3, font: `15px ${SA}` } }, logo, h('span', { style: { flex: 1 } }), ...[['What', '#ff5924'], ['Why', '#f5c400'], ['How', '#ff6fa8']].map(([t, c]) => h('a', { style: { margin: '0 14px' }, onclick: () => { const tgt = { What: board, Why: mani, How: promise }[t]; root.scrollTo({ top: tgt.offsetTop - 40, behavior: 'smooth' }); } }, dot(c), t)), h('span', { style: { flex: 1 } }), h('a', { style: { marginRight: '14px' } }, dot('#34c759'), 'Log in'), h('button', { style: { background: '#ff5924', color: '#fff', border: 0, borderRadius: '99px', padding: '9px 17px', font: `500 14px ${SA}`, cursor: 'pointer' }, onclick: () => toast('Sign up (demo)') }, 'Sign up'));
  const PILLS = [['notes', '#ff8a3d'], ['bookmarks', '#f06aa8'], ['inspiration', '#7cc4f0'], ['articles', '#f05a4a'], ['images', '#f0c419']];
  const pill = ([t, c]) => h('span.mm-pill', { style: { color: c }, onclick: () => { qIn.value = t.replace(/s$/, ''); filt(); root.scrollTo({ top: board.offsetTop - 60, behavior: 'smooth' }); } }, h('span', { style: { color: c } }, t));
  const appBtn = (ic, t) => h('button', { style: { border: 0, background: '#f3f3f5', borderRadius: '99px', padding: '11px 18px', font: `15px ${SA}`, color: '#444', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }, onclick: () => toast(`${t} (demo)`) }, h('span', {}, ic), t);
  const hero = h('div', { style: { position: 'relative', height: '820px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 36%,#fff 0 37%,#ffd8c4 41%,#ff9a6a 47%,#ff6d6d 54%,#ffc9b6 64%,#fff 76%)' } }, nav,
    h('div', { style: { position: 'absolute', left: '50%', top: '40px', transform: 'translateX(-50%)', width: '1030px', height: '1030px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 120px 60px #ffffffaa' } }),
    h('div', { style: { position: 'relative', textAlign: 'center', paddingTop: '128px' } }, h('div.mm-in', { style: { font: `400 112px/.92 ${SF}`, letterSpacing: '-.035em', fontVariationSettings: '"opsz" 144,"SOFT" 30,"WONK" 0' } }, 'Remember everything.'), h('div.mm-in', { style: { font: `400 112px/1.02 ${SF}`, letterSpacing: '-.035em', animationDelay: '.25s', fontVariationSettings: '"opsz" 144,"SOFT" 30' } }, 'Organize nothing.'),
      h('div.mm-in', { style: { font: `17px/2 ${SA}`, color: '#555', maxWidth: '340px', margin: '22px auto 0', animationDelay: '.5s' } }, 'All your ', pill(PILLS[0]), pill(PILLS[1]), pill(PILLS[2]), pill(PILLS[3]), ' and ', pill(PILLS[4]), ' in one single, private place.'),
      h('div.mm-in', { style: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '72px', animationDelay: '.7s' } }, appBtn('', 'iPhone app'), appBtn('◕', 'Browser Extension'), appBtn('▶', 'Android app'))));
  // board
  const R = rng(7); const CARDS = [
    ['note', { t: 'ADD NEW NOTE', body: 'Start typing here…' }, ['note']], ['img', { g: 'linear-gradient(160deg,#d9d4cc,#8f8a80)', hh: 220, price: '$22' }, ['image', 'product', 'beige']], ['img', { g: 'linear-gradient(200deg,#c7c2ba,#efece6)', hh: 160, price: '$450' }, ['image', 'chair', 'grey']], ['quote', { t: '“The details are not the details. They make the design.”', a: 'Charles Eames' }, ['quote', 'design']], ['img', { g: 'radial-gradient(circle at 30% 30%,#3b62d8,#0d1a52)', hh: 250 }, ['image', 'blue', 'space']],
    ['link', { t: 'How to build a second brain', d: 'fortelabs.com' }, ['article', 'productivity']], ['color', { c: ['#ff5924', '#ffb38a', '#ffe7d6', '#25272c'] }, ['color', 'orange', 'palette']], ['img', { g: 'linear-gradient(180deg,#f6c7a8,#e2735a)', hh: 190 }, ['image', 'orange', 'sunset']], ['quote', { t: '“Simplicity is the ultimate sophistication.”', a: 'Leonardo da Vinci' }, ['quote']], ['link', { t: 'The case for slow software', d: 'essay · 9 min read' }, ['article', 'essay']],
    ['img', { g: 'linear-gradient(140deg,#9ad1b0,#2f6d55)', hh: 230 }, ['image', 'green', 'plant']], ['note', { t: 'NOTE', body: 'Gift idea for Mina: ceramic mug, the speckled one.' }, ['note', 'gift']], ['color', { c: ['#3b62d8', '#7cc4f0', '#eaf4ff', '#0d1a52'] }, ['color', 'blue', 'palette']], ['img', { g: 'linear-gradient(170deg,#f2e6c9,#c9a86a)', hh: 170, price: '$89' }, ['image', 'product', 'beige']], ['link', { t: 'Typography in ten minutes', d: 'practicaltypography.com' }, ['article', 'type']],
  ];
  const cardEl = ([k, d, tags]) => { let inner; if (k === 'img') inner = h('div', { style: { height: d.hh + 'px', background: d.g, position: 'relative' } }, d.price ? h('span', { style: { position: 'absolute', right: '8px', top: '8px', background: '#fff', borderRadius: '4px', font: `600 11px ${SA}`, padding: '3px 6px' } }, d.price) : null); else if (k === 'quote') inner = h('div', { style: { padding: '22px 18px', font: `italic 400 19px/1.35 ${SF}`, textAlign: 'center' } }, h('div', { style: { fontSize: '30px', lineHeight: 1 } }, '“'), d.t.replace(/[“”]/g, ''), h('div', { style: { font: `11px ${SA}`, color: '#999', marginTop: '10px', fontStyle: 'normal' } }, '— ' + d.a)); else if (k === 'note') inner = h('div', { style: { padding: '14px', minHeight: '120px' } }, h('div', { style: { font: `600 10px ${SA}`, color: '#ff5924', letterSpacing: '.08em' } }, d.t), h('div', { style: { font: `14px/1.5 ${SA}`, color: '#777', marginTop: '10px' } }, d.body)); else if (k === 'link') inner = h('div', {}, h('div', { style: { height: '90px', background: `linear-gradient(135deg,hsl(${R() * 360},40%,88%),hsl(${R() * 360},40%,76%))` } }), h('div', { style: { padding: '10px 12px' } }, h('div', { style: { font: `500 14px/1.3 ${SA}` } }, d.t), h('div', { style: { font: `11px ${SA}`, color: '#999', marginTop: '4px' } }, d.d))); else inner = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', height: '110px' } }, ...d.c.map((c) => h('div', { style: { background: c }, title: c })));
    const el = h('div.mm-card', {}, inner, h('div.mm-tags', {}, ...tags.map((t) => h('span.mm-tag', {}, '#' + t)))); el.dataset.tags = [...tags, k === 'link' ? 'bookmark' : k === 'img' ? 'inspiration' : ''].join(' '); return el; };
  const els = CARDS.map(cardEl); const grid = h('div.mm-board', {}, ...els);
  const cnt = h('span', { style: { font: `12px ${SA}`, color: '#999' } });
  const filt = () => { const q = qIn.value.trim().toLowerCase(); const first = new Map(els.map((e) => [e, e.getBoundingClientRect()])); let n = 0; els.forEach((e) => { const m = !q || e.dataset.tags.includes(q); e.style.display = m ? '' : 'none'; n += m; }); cnt.textContent = q ? `${n} of ${els.length} for “${q}”` : `${els.length} items`; els.forEach((e) => { if (e.style.display === 'none') return; const a = first.get(e), b = e.getBoundingClientRect(); if (!a.width) return; e.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)` }, { transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' }); }); };
  const qIn = h('input', { placeholder: 'Search my mind...', oninput: filt, style: { border: 0, outline: 0, background: 'transparent', width: '100%', font: `italic 300 44px ${SF}`, color: '#25272c', padding: '10px 0' } });
  const tabs = h('div', { style: { display: 'flex', gap: '26px', justifyContent: 'flex-end', font: `13px ${SA}`, color: '#888' } }, ...['Everything', 'Spaces', 'Serendipity'].map((t, i) => h('span', { style: { color: i ? '' : '#25272c', borderTop: i ? '' : '3px solid #ff5924', paddingTop: '6px', cursor: 'pointer' }, onclick: () => toast(`${t} (demo)`) }, t)));
  const swatches = h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, h('span', { style: { font: `12px ${SA}`, color: '#999' } }, 'Filter:'), ...[['orange', '#ff5924'], ['blue', '#3b62d8'], ['green', '#2f6d55'], ['beige', '#c9a86a']].map(([n, c]) => h('span', { title: n, style: { width: '16px', height: '16px', borderRadius: '50%', background: c, cursor: 'pointer', boxShadow: '0 0 0 2px #fff,0 0 0 3px #0001' }, onclick: () => { qIn.value = qIn.value === n ? '' : n; filt(); } })), h('span', { style: { flex: 1 } }), cnt);
  const board = h('div', { style: { position: 'relative', margin: '-130px auto 0', width: '76%', background: '#f1f2f5', borderRadius: '6px 6px 0 0', padding: '14px 4% 40px', boxShadow: '0 -10px 40px #0000000d', zIndex: 2 } }, tabs, qIn, h('div', { style: { borderTop: '1px solid #dcdde2', margin: '6px 0 14px' } }), swatches, h('div', { style: { height: '14px' } }), grid);
  // manifesto word reveal
  const TXT = 'We built mymind for people who collect, not people who organize. Save anything with one click and let the mind tag, sort and resurface it for you. No folders to maintain, no labels to invent, no feeds pulling at your attention. Just a quiet place that remembers, so you can think.';
  const words = TXT.split(' ').map((w) => h('span.mm-w', {}, w + ' '));
  const mani = h('div', { style: { padding: '160px 14% 120px', background: '#fff' } }, h('div', { style: { font: `600 11px ${SA}`, letterSpacing: '.16em', color: '#ff5924', marginBottom: '26px' } }, '● OUR MANIFESTO'), h('div', { style: { font: `400 46px/1.25 ${SF}`, letterSpacing: '-.02em' } }, ...words));
  const reveal = () => { const r = mani.getBoundingClientRect(), vh = root.clientHeight || innerHeight; const p = clamp((vh * 0.85 - r.top) / (r.height * 0.8), 0, 1); const k = Math.round(p * words.length); words.forEach((w, i) => w.classList.toggle('on', i < k)); };
  root.addEventListener('scroll', reveal, { passive: true });
  // promises
  const NOS = ['No ads.', 'No tracking.', 'No likes.', 'No followers.', 'No folders.', 'No collaboration.'];
  const noEls = NOS.map((t) => h('div', {}, h('span.mm-no', { onclick: (e) => e.currentTarget.classList.toggle('x') }, t)));
  const promise = h('div', { style: { padding: '100px 14% 140px', background: 'linear-gradient(180deg,#fff,#fff4ee)' } }, h('div', { style: { font: `400 22px ${SF}`, color: '#888', marginBottom: '18px', fontStyle: 'italic' } }, 'We promise no…'), ...noEls, h('div', { style: { font: `15px ${SA}`, color: '#777', marginTop: '28px' } }, 'Your mind is private by design — not a social network.'));
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) noEls.forEach((n, i) => setTimeout(() => n.firstChild.classList.add('x'), 250 + i * 220)); }), { root, threshold: 0.4 }); io.observe(promise);
  const foot = h('div', { style: { padding: '40px 4.1%', display: 'flex', font: `13px ${SA}`, color: '#999', borderTop: '1px solid #eee' } }, logo.cloneNode(true), h('span', { style: { flex: 1 } }), 'Privacy · Terms · Manifesto · Clone practice demo');
  root.append(hero, board, mani, promise, foot); filt(); reveal();
  window.__demoProof = async () => { qIn.value = 'blue'; filt(); const shown = els.filter((e) => e.style.display !== 'none').length; qIn.value = ''; filt(); els[3].classList.add('lift'); await sleep(320); const lifted = getComputedStyle(els[3]).transform !== 'none'; els[3].classList.remove('lift'); root.scrollTop = mani.offsetTop - 200; reveal(); const lit = words.filter((w) => w.classList.contains('on')).length; noEls.forEach((n) => n.firstChild.classList.add('x')); const struck = root.querySelectorAll('.mm-no.x').length; noEls.forEach((n) => n.firstChild.classList.remove('x')); root.scrollTop = 0; reveal(); return `filter blue→${shown}/${els.length} cards, hover lift=${lifted}, manifesto words lit=${lit}/${words.length}, strikethrough=${struck}; restored`; };
};
V['partiful-invite-theme-customizer'] = (root, T) => {
  theme(root, T, { bg: '#0b0b12', fg: '#ffffff', ac: '#ffffff', dark: true }); scroll(root);
  const F = "'Inter Variable',system-ui,sans-serif";
  root.append(h('style', {}, `.pf{font:500 15px/1.4 ${F};color:#fff;background:#0b0b12;min-height:100%}.pf a{color:inherit;text-decoration:none}.pf button{font-family:${F};cursor:pointer}.pf-ann{height:26px;background:#f5b3e6;color:#1a0b16;display:flex;align-items:center;justify-content:center;gap:8px;font:600 11px ${F}}.pf-ann i{font-style:normal;background:#e2457b;color:#fff;border-radius:4px;padding:0 6px;font-size:9px}.pf-hero{position:relative;height:620px;overflow:hidden;background:linear-gradient(100deg,#3c5fe6 0%,#7a4fe0 32%,#b544c7 46%,#2a1530 64%,#120a10 100%)}.pf-hero canvas{position:absolute;inset:0;width:100%;height:100%}.pf-hero .veil{position:absolute;inset:0;background:linear-gradient(90deg,#3d63f0 0%,#7b52e3ee 28%,#b14bd0aa 44%,transparent 66%);pointer-events:none}.pf-nav{position:relative;z-index:3;height:72px;display:flex;align-items:center;gap:22px;padding:0 26px}.pf-logo{display:flex;align-items:center;gap:6px;font:800 20px ${F};letter-spacing:-.03em}.pf-logo b{width:20px;height:20px;border-radius:6px 10px 10px 2px;border:3px solid #fff;border-right-color:transparent;transform:rotate(-12deg)}.pf-links{flex:1;display:flex;justify-content:center;gap:16px;font:700 13px ${F}}.pf-links a:first-child{color:#ffb35c}.pf-btn{border:0;border-radius:4px;padding:10px 16px;font:700 13px ${F}}.pf-login{background:#1c1c22;color:#fff;border:1px solid #ffffff22}.pf-create{background:#fff;color:#111}.pf-copy{position:absolute;z-index:3;left:44px;top:160px;max-width:420px}.pf-rate{display:inline-flex;gap:8px;align-items:center;background:#ffffff2a;border-radius:99px;padding:5px 12px;font:600 12px ${F};backdrop-filter:blur(6px)}.pf-copy h1{font:850 84px/0.9 ${F};letter-spacing:-.055em;margin:26px 0 26px}.pf-copy p{font:700 19px/1.2 ${F};margin:0 0 26px;letter-spacing:-.01em}.pf-cta{background:#fff;color:#111;border:0;border-radius:4px;padding:12px 18px;font:700 14px ${F};transition:transform .2s}.pf-cta:hover{transform:translateY(-2px) rotate(-1deg)}.pf-tilt{position:absolute;z-index:3;right:20px;bottom:40px;width:240px;transform:rotate(-8deg);transition:transform .5s cubic-bezier(.2,.9,.2,1.2)}.pf-tilt:hover{transform:rotate(-2deg) scale(1.04)}.pf-tilt .poster{height:110px;border-radius:14px 14px 0 0;background:linear-gradient(135deg,#bfe9ff,#f7c6ff 50%,#c9ffd9);display:flex;align-items:center;justify-content:center;font:800 16px ${F};color:#e2457b;letter-spacing:-.02em}.pf-tilt .note{background:#fff;color:#111;border-radius:0 0 14px 14px;padding:10px 12px;display:flex;align-items:center;gap:10px;font:700 12px ${F};box-shadow:0 20px 40px #0006}.pf-tilt .note span{color:#666;font-weight:500;display:block}.pf-tilt .note button{margin-left:auto;background:#2f7bf6;color:#fff;border:0;border-radius:99px;padding:5px 12px;font:700 11px ${F}}.pf-sec{background:linear-gradient(180deg,#e8e0f0,#f6f1ea);color:#111;padding:70px 40px 60px;text-align:center}.pf-sec h2{font:850 40px/1 ${F};letter-spacing:-.045em;margin:0 0 26px}.pf-tabs{display:inline-flex;gap:6px;background:#fff;border-radius:99px;padding:5px;box-shadow:0 4px 20px #0001}.pf-tabs button{border:0;background:transparent;border-radius:99px;padding:9px 18px;font:700 13px ${F};color:#555}.pf-tabs button.on{background:#111;color:#fff}.pf-stage{display:grid;grid-template-columns:260px 380px;gap:40px;justify-content:center;align-items:center;margin-top:36px}.pf-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.pf-opt{height:72px;border-radius:12px;border:2px solid transparent;display:flex;align-items:flex-end;padding:6px 8px;font:700 11px ${F};color:#fff;text-shadow:0 1px 3px #0008;box-shadow:0 2px 10px #0001}.pf-opt.on{border-color:#111;transform:scale(1.04)}.pf-card{position:relative;height:500px;border-radius:26px;overflow:hidden;box-shadow:0 30px 60px #2a124a33;transition:background .5s}.pf-card canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.pf-card .in{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;padding:26px 22px;text-align:left}.pf-card .poster{height:170px;border-radius:16px;background:#fff3;margin-bottom:18px;display:flex;align-items:center;justify-content:center;font-size:64px;transition:.4s}.pf-card h3{margin:0;font-size:38px;line-height:1;letter-spacing:-.03em;transition:font .3s}.pf-card .meta{margin-top:12px;font:600 14px ${F};opacity:.85}.pf-rsvp{margin-top:auto;display:flex;gap:8px}.pf-rsvp button{flex:1;border:0;border-radius:14px;padding:10px 0;background:#ffffff33;color:inherit;font:700 12px ${F};backdrop-filter:blur(6px);transition:transform .2s}.pf-rsvp button em{display:block;font-style:normal;font-size:22px}.pf-rsvp button.on{background:#fff;color:#111;transform:translateY(-3px)}.pf-mq{background:#111;color:#fff;overflow:hidden;white-space:nowrap;padding:22px 0;font:800 22px ${F};letter-spacing:-.02em}.pf-mq div{display:inline-block;animation:pfmq 30s linear infinite}.pf-mq span{margin:0 34px}.pf-mq span i{font-style:normal;opacity:.5;font:600 13px ${F};margin-left:10px}@keyframes pfmq{to{transform:translateX(-50%)}}.pf-tr{background:#f6f1ea;color:#111;padding:60px 40px 80px}.pf-tr h2{font:850 36px ${F};letter-spacing:-.04em;margin:0 0 24px}.pf-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.pf-tc{border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 6px 24px #0001;cursor:pointer;transition:transform .25s}.pf-tc:hover{transform:translateY(-4px) rotate(-1deg)}.pf-tc .pv{height:190px;display:flex;align-items:center;justify-content:center;font-size:54px}.pf-tc b{display:block;padding:12px 14px 2px;font:800 15px ${F}}.pf-tc small{display:block;padding:0 14px 14px;color:#777;font-size:11px;font-family:'JetBrains Mono Variable',monospace}.pf-ed{position:fixed;inset:38px 0 0;background:#0009;z-index:60;display:none;align-items:center;justify-content:center}.pf-ed.on{display:flex}.pf-ed .box{background:#fff;color:#111;border-radius:22px;padding:22px;width:560px;display:grid;grid-template-columns:1fr 210px;gap:18px;text-align:left}.pf-ed code{display:block;background:#f1eef6;border-radius:8px;padding:8px 10px;font:12px 'JetBrains Mono Variable',monospace;word-break:break-all;margin:10px 0}`));
  const BG = { 'Disco': 'linear-gradient(160deg,#ff5fa2,#7b3df0 55%,#1b0b3a)', 'Sunset': 'linear-gradient(170deg,#ffb35c,#ff5f6d 60%,#6a1b4d)', 'Matcha': 'linear-gradient(165deg,#d8f5c4,#7ccf8e 60%,#1f5c3a)', 'Midnight': 'radial-gradient(circle at 30% 20%,#3d63f0,#0b0b2a 70%)', 'Y2K Chrome': 'linear-gradient(135deg,#e8e8f0,#9aa4c0 40%,#f7f7ff 55%,#7c86a8)', 'Bubblegum': 'linear-gradient(160deg,#ffd1ec,#ff9ad5 60%,#ff5fa2)' };
  const FONTS = { 'Classic': `800 38px/1 ${F}`, 'Fancy': `italic 600 40px/1 'Fraunces Variable',serif`, 'Typewriter': `600 30px/1.1 'JetBrains Mono Variable',monospace`, 'Storybook': `400 40px/1 'Lora',serif`, 'Shout': `900 44px/0.9 ${F}`, 'Retro': `700 34px/1 'Fraunces Variable',serif` };
  const FX = { 'Confetti': '🎊', 'Hearts': '💖', 'Ghosts': '👻', 'Bubbles': '🫧', 'Stars': '⭐', 'None': '—' };
  const POST = { 'Disco ball': '🪩', 'Cake': '🎂', 'Pumpkin': '🎃', 'Cocktail': '🍸', 'Balloon': '🎈', 'Pizza': '🍕' };
  const st = { bg: 'Disco', font: 'Classic', fx: 'Confetti', poster: 'Disco ball', rsvp: -1 }; let fxPlays = 0;
  // hero party scene: warm bokeh lights + silhouettes
  const hc = h('canvas'); const hero = h('div.pf-hero', {}, hc, h('div.veil'));
  const drawHero = (t) => { const r = hero.getBoundingClientRect(); if (!r.width) return; if (hc.width !== Math.round(r.width)) { hc.width = r.width; hc.height = r.height; } const g = hc.getContext('2d'), w = hc.width, H = hc.height; g.clearRect(0, 0, w, H); for (let i = 0; i < 26; i++) { const x = w * (0.45 + ((i * 0.137) % 0.55)), y = H * ((i * 0.071) % 0.45) + Math.sin(t * 0.8 + i) * 6, rr = 8 + (i % 5) * 5; const gr = g.createRadialGradient(x, y, 0, x, y, rr * 2); gr.addColorStop(0, i % 3 ? '#ffb26bdd' : '#ff6a3dcc'); gr.addColorStop(1, '#ff6a3d00'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr * 2, 0, 7); g.fill(); } g.save(); g.filter = 'blur(14px)'; [[0.58, 0.42, 150, '#e0a98f', '#c98a4e'], [0.8, 0.46, 160, '#f0c3ad', '#f2d6a8']].forEach(([cx, cy, rr, skin, hair], k) => { const bx = w * cx + Math.sin(t * 1.2 + k) * 10, by = H * cy + Math.cos(t * 0.9 + k) * 6; g.fillStyle = hair; for (let j = 0; j < 9; j++) { g.beginPath(); g.ellipse(bx + Math.cos(j * 0.9 + t * 0.5) * rr * 0.75, by + Math.sin(j * 1.3) * rr * 0.6, rr * 0.38, rr * 0.85, j * 0.5 + Math.sin(t + j) * 0.15, 0, 7); g.fill(); } g.fillStyle = skin; g.beginPath(); g.ellipse(bx, by + rr * 0.15, rr * 0.55, rr * 0.7, -0.25 + k * 0.4, 0, 7); g.fill(); g.fillStyle = '#d98fa0'; g.beginPath(); g.ellipse(bx + rr * 0.1, by + rr * 1.15, rr * 0.9, rr * 0.45, 0, 0, 7); g.fill(); }); g.restore(); const vg = g.createLinearGradient(0, H * 0.6, 0, H); vg.addColorStop(0, '#0000'); vg.addColorStop(1, '#0b0610cc'); g.fillStyle = vg; g.fillRect(0, 0, w, H); };
  const nav = h('div.pf-nav', {}, h('a.pf-logo', { href: '#' }, h('b'), 'partiful'), h('div.pf-links', {}, ...['Halloween', 'Birthdays', 'Dinners', 'Housewarmings', 'For Orgs', 'Sell Tickets', 'Explore'].map((l) => h('a', { href: '#', onclick: (e) => e.preventDefault() }, l))), h('button.pf-btn.pf-login', { onclick: () => toast('Login (demo)') }, 'Login'), h('button.pf-btn.pf-create', { onclick: () => stage.scrollIntoView({ behavior: 'smooth' }) }, 'Create'));
  const copy = h('div.pf-copy', {}, h('span.pf-rate', {}, '★ ★ ★ ★ ★', h('span', {}, '200k+ ratings')), h('h1', {}, 'Parties', h('br'), 'are back'), h('p', {}, 'The easiest way to get your guests', h('br'), 'on the same page'), h('button.pf-cta', { onclick: () => stage.scrollIntoView({ behavior: 'smooth' }) }, 'Create invite'));
  const tilt = h('div.pf-tilt', {}, h('div.poster', {}, "I'M TURNING 28 🎂"), h('div.note', {}, h('b', { style: { fontSize: '18px' } }, 'P'), h('div', {}, "RSVP to Jess's 28th", h('span', {}, "You're invited!")), h('button', { onclick: () => toast('Opening invite…') }, 'Open')));
  hero.append(nav, copy, tilt);
  // customizer
  const tabs = ['Backgrounds', 'Fonts', 'Animations', 'Posters']; let tab = 'Backgrounds';
  const tabRow = h('div.pf-tabs'); const opts = h('div.pf-opts');
  const fxC = h('canvas'); const posterEl = h('div.poster'); const title = h('h3', {}, "Jess's 28th 🎉"); const meta = h('div.meta', {}, 'Sat, Oct 24 · 9:00 PM', h('br'), 'Hosted by Jess & Mia · Bushwick, NY');
  const rsvpBtns = [['👍', 'Going'], ['🤔', 'Maybe'], ['😢', "Can't go"]].map(([e, l], i) => h('button', { onclick: () => { st.rsvp = st.rsvp === i ? -1 : i; paint(); if (st.rsvp === 0) playFx(); } }, h('em', {}, e), l));
  const card = h('div.pf-card', {}, fxC, h('div.in', {}, posterEl, title, meta, h('div.pf-rsvp', {}, ...rsvpBtns)));
  const KEY = { Backgrounds: ['bg', BG], Fonts: ['font', FONTS], Animations: ['fx', FX], Posters: ['poster', POST] };
  const drawTabs = () => { tabRow.replaceChildren(...tabs.map((t) => h('button', { class: t === tab ? 'on' : '', onclick: () => { tab = t; drawTabs(); drawOpts(); playFx(); } }, t))); };
  const drawOpts = () => { const [k, M] = KEY[tab]; opts.replaceChildren(...Object.keys(M).map((n) => { const o = h('button', { class: 'pf-opt' + (st[k] === n ? ' on' : ''), 'data-k': n, onclick: () => { st[k] = n; drawOpts(); paint(); playFx(); } }, n); if (k === 'bg') o.style.background = M[n]; else if (k === 'font') { o.style.background = '#2b2240'; o.style.font = M[n].replace(/\d+px\/[\d.]+/, '18px/1'); o.style.alignItems = 'center'; o.style.justifyContent = 'center'; } else { o.style.background = 'linear-gradient(160deg,#fff,#efe6ff)'; o.style.color = '#111'; o.style.textShadow = 'none'; o.style.flexDirection = 'column'; o.style.alignItems = 'center'; o.style.justifyContent = 'center'; o.prepend(h('span', { style: { fontSize: '24px' } }, M[n])); } return o; })); };
  const paint = () => { card.style.background = BG[st.bg]; card.style.color = st.bg === 'Matcha' || st.bg === 'Y2K Chrome' || st.bg === 'Bubblegum' ? '#1b1b1b' : '#fff'; title.style.font = FONTS[st.font]; posterEl.textContent = POST[st.poster]; rsvpBtns.forEach((b, i) => b.classList.toggle('on', st.rsvp === i)); };
  let parts = []; const playFx = () => { fxPlays++; const r = card.getBoundingClientRect(); fxC.width = r.width || 380; fxC.height = r.height || 500; parts = []; if (st.fx === 'None') return; const ch = FX[st.fx]; for (let i = 0; i < 46; i++) parts.push({ x: st.fx === 'Confetti' ? fxC.width / 2 : Math.random() * fxC.width, y: st.fx === 'Confetti' ? fxC.height * 0.55 : -20 - Math.random() * 300, vx: st.fx === 'Confetti' ? (Math.random() - 0.5) * 9 : (Math.random() - 0.5) * 0.6, vy: st.fx === 'Confetti' ? -6 - Math.random() * 7 : 1.2 + Math.random() * 1.8, r: Math.random() * 6, c: ['#ff5fa2', '#ffd23f', '#3dd6ff', '#7cf08e', '#fff'][i % 5], ch, life: 1 }); };
  const tickFx = () => { const g = fxC.getContext('2d'); g.clearRect(0, 0, fxC.width, fxC.height); for (const p of parts) { p.x += p.vx; p.y += p.vy; if (st.fx === 'Confetti') { p.vy += 0.22; p.vx *= 0.99; p.r += 0.2; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-4, -2, 8, 5); g.restore(); } else { g.font = '22px serif'; g.globalAlpha = p.y > fxC.height * 0.85 ? Math.max(0, 1 - (p.y - fxC.height * 0.85) / 60) : 1; g.fillText(p.ch, p.x, p.y); g.globalAlpha = 1; } } parts = parts.filter((p) => p.y < fxC.height + 40); };
  const stage = h('div.pf-sec', {}, h('h2', {}, 'Fun, modern invites in 1 click'), tabRow, h('div.pf-stage', {}, opts, card));
  const Q = [['“The best way to invite people to anything.”', 'The Verge'], ['“Gen Z’s favorite party app.”', 'NYT'], ['“Evites, but make it cool.”', 'Vogue'], ['“Partiful is having a moment.”', 'TechCrunch'], ['“The un-boring invite.”', 'Bustle']];
  const mq = h('div.pf-mq', {}, h('div', {}, ...[...Q, ...Q].map(([q, s0]) => h('span', {}, q, h('i', {}, s0)))));
  const TPL = [['Spooky Season', '🎃', 'Ghosts', 'Shout', 'Pumpkin', 'Midnight'], ['Dinner Party', '🍷', 'None', 'Fancy', 'Cocktail', 'Sunset'], ['Birthday Bash', '🎂', 'Confetti', 'Classic', 'Cake', 'Disco'], ['Galentines', '💖', 'Hearts', 'Storybook', 'Balloon', 'Bubblegum'], ['Game Night', '🎲', 'Stars', 'Typewriter', 'Pizza', 'Matcha'], ['Y2K Rave', '🪩', 'Bubbles', 'Retro', 'Disco ball', 'Y2K Chrome'], ['Housewarming', '🏡', 'Confetti', 'Storybook', 'Balloon', 'Matcha'], ['Watch Party', '🍿', 'Stars', 'Shout', 'Pizza', 'Midnight']];
  const ed = h('div.pf-ed', { onclick: (e) => { if (e.target === ed) ed.classList.remove('on'); } });
  let lastUrl = '';
  const openTpl = (tp) => { const [n, , fx, font, poster, bg] = tp; Object.assign(st, { fx, font, poster, bg }); const q = new URLSearchParams({ effect: fx.toLowerCase(), titleFont: font.toLowerCase(), poster: poster.toLowerCase().replace(/ /g, '-'), theme: bg.toLowerCase().replace(/ /g, '-') }); lastUrl = `partiful.com/create?${q}`; const prevCard = h('div', { style: { borderRadius: '18px', height: '260px', background: BG[bg], color: '#fff', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' } }, h('div', { style: { fontSize: '50px' } }, POST[poster]), h('div', { style: { font: FONTS[font].replace(/\d+px\/[\d.]+/, '26px/1') } }, n)); ed.replaceChildren(h('div.box', {}, h('div', {}, h('b', { style: { fontSize: '22px', letterSpacing: '-.03em' } }, `Editor · ${n}`), h('code', {}, lastUrl), h('div', { style: { fontSize: '13px', color: '#555' } }, `Preset applied → effect ${fx}, font ${font}, poster ${poster}, background ${bg}.`), h('div', { style: { display: 'flex', gap: '8px', marginTop: '18px' } }, h('button.pf-btn', { style: { background: '#111', color: '#fff' }, onclick: () => { ed.classList.remove('on'); tab = 'Backgrounds'; drawTabs(); drawOpts(); paint(); playFx(); stage.scrollIntoView({ behavior: 'smooth' }); } }, 'Customize'), h('button.pf-btn', { style: { background: '#eee' }, onclick: () => ed.classList.remove('on') }, 'Close'))), prevCard)); ed.classList.add('on'); paint(); };
  const tr = h('div.pf-tr', {}, h('h2', {}, 'Trending templates'), h('div.pf-grid', {}, ...TPL.map((tp) => h('div.pf-tc', { onclick: () => openTpl(tp) }, h('div.pv', { style: { background: BG[tp[5]] } }, tp[1]), h('b', {}, tp[0]), h('small', {}, `?effect=${tp[2].toLowerCase()}&titleFont=${tp[3].toLowerCase()}`)))));
  root.append(h('div.pf', {}, h('div.pf-ann', {}, h('i', {}, '🎟'), 'New! Sell tickets on Partiful', h('i', {}, '🎟')), hero, stage, mq, tr), ed);
  drawTabs(); drawOpts(); paint(); setTimeout(playFx, 300);
  const loop = (now) => { drawHero(now / 1000); tickFx(); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  window.__demoProof = async () => { const out = []; const save = { ...st }; const p0 = fxPlays; tabRow.children[1].click(); out.push(`tab=${tab}`); opts.querySelector('[data-k="Fancy"]').click(); out.push(`title font=${title.style.fontFamily.split(',')[0]}`); tabRow.children[0].click(); opts.querySelector('[data-k="Sunset"]').click(); out.push(`card bg=${st.bg}`); tabRow.children[2].click(); opts.querySelector('[data-k="Hearts"]').click(); await sleep(250); out.push(`effect replays=${fxPlays - p0}, particles=${parts.length}`); rsvpBtns[0].click(); out.push(`rsvp=${rsvpBtns[0].classList.contains('on')}`); rsvpBtns[0].click(); tr.querySelector('.pf-tc').click(); out.push(`template editor open=${ed.classList.contains('on')} url=${lastUrl}`); ed.classList.remove('on'); Object.assign(st, save); tab = 'Backgrounds'; drawTabs(); drawOpts(); paint(); root.scrollTop = 0; return out.join('; ') + '; restored'; };
};
V['oxide-ascii-figure-product-page'] = (root, T) => {
  theme(root, T, { bg: '#080f11', fg: '#e7e7e8', ac: '#48d597', dark: true }); scroll(root);
  const F = "'Inter Variable',system-ui,sans-serif", M = MONO;
  root.append(h('style', {}, `.ox{background:#080f11;color:#e7e7e8;font:400 15px/1.5 ${F};min-height:100%}.ox button{cursor:pointer;font-family:${M}}.ox .mono{font:500 11px/1.4 ${M};letter-spacing:.06em;text-transform:uppercase}.ox-nav{position:sticky;top:0;z-index:20;height:44px;display:flex;align-items:center;gap:28px;padding:0 28px;background:#080f11e6;backdrop-filter:blur(8px);border-bottom:1px solid #1c2225}.ox-logo{font:600 20px ${M};color:#48d597;letter-spacing:-.02em}.ox-links{flex:1;display:flex;justify-content:center;gap:34px;color:#a1a4a5}.ox-links span:hover{color:#fff}.ox-b{border:1px solid #2b3134;background:transparent;color:#e7e7e8;border-radius:3px;padding:6px 9px}.ox-b.g{background:#112d24;border-color:#112d24;color:#48d597}.ox-hero{position:relative;height:720px;overflow:hidden;border-bottom:1px solid #1c2225}.ox-dots{position:absolute;inset:0;width:100%;height:100%}.ox-term{position:absolute;left:40px;top:42px;width:400px;height:250px;background:#0f1618ee;border:1px solid #1f2729;border-radius:4px;overflow:hidden}.ox-term .tb{display:flex;gap:2px;padding:0 10px;border-bottom:1px solid #1f2729;height:30px;align-items:stretch}.ox-term .tb button{background:none;border:0;color:#7d8385;padding:0 9px;border-bottom:1px solid transparent}.ox-term .tb button.on{color:#48d597;border-bottom-color:#48d597}.ox-term .tb i{flex:1}.ox-term .tb em{align-self:center;width:46px;height:6px;border-radius:3px;background:#2b3134}.ox-term canvas{position:absolute;left:0;top:31px;width:100%;height:219px;opacity:.6}.ox-term pre{position:absolute;left:16px;right:16px;bottom:14px;margin:0;font:400 13px/1.5 ${M};color:#e7e7e8;white-space:pre-wrap}.ox-term pre .d{color:#7d8385}.ox-term pre .c{background:#48d597;color:#48d597}.ox-fig{position:absolute;right:40px;top:150px;border:1px solid #2b3134;padding:3px 6px;color:#a1a4a5}.ox-fig b{color:#e7e7e8;font-weight:500}.ox-rack{position:absolute;right:40px;top:190px;width:560px;height:630px}.ox-lead{position:absolute;left:440px;top:225px;width:340px;height:130px;pointer-events:none}.ox-h1{position:absolute;z-index:2;left:40px;bottom:120px;font:300 66px/1.04 ${F};letter-spacing:-.025em;margin:0;color:#e7e7e8}.ox-pw{position:absolute;left:0;right:0;bottom:0;height:76px;background:#080f11;z-index:0;display:flex;align-items:center;gap:44px;padding:0 28px;border-top:1px solid #1c2225;color:#7d8385}.ox-pw b{font:700 17px ${F};color:#a1a4a5;letter-spacing:-.01em}.ox-w{max-width:1040px;margin:0 auto;padding:0 28px}.ox-sec{padding:80px 0;border-bottom:1px solid #1c2225}.ox-sec h2{font:300 34px/1.1 ${F};letter-spacing:-.02em;margin:10px 0 28px}.ox-cap{color:#48d597}.ox-boot{display:grid;grid-template-columns:330px 1fr;gap:40px;align-items:start}.ox-card{border:1px solid #1f2729;background:#0f1618;border-radius:6px;padding:22px}.ox-card .st{display:flex;align-items:center;gap:8px;margin-bottom:12px}.ox-card .st i{width:8px;height:8px;border-radius:50%;background:#48d597;box-shadow:0 0 10px #48d597}.ox-card h3{margin:0 0 6px;font:400 22px ${F}}.ox-steps{margin:14px 0;padding:0;list-style:none}.ox-steps li{display:flex;gap:10px;padding:5px 0;color:#7d8385}.ox-steps li.ok{color:#e7e7e8}.ox-steps li.ok::before{content:'✓';color:#48d597}.ox-steps li:not(.ok)::before{content:'·'}.ox-sso{width:100%;background:#48d597;color:#08130e;border:0;border-radius:3px;padding:10px;font:600 12px ${M};letter-spacing:.06em}.ox-cmp{display:grid;grid-template-columns:1fr 1fr;gap:24px}.ox-col{border:1px solid #1f2729;border-radius:6px;padding:20px}.ox-col h4{margin:0 0 14px;font:400 18px ${F}}.ox-bar{display:grid;grid-template-columns:150px 1fr 42px;gap:12px;align-items:center;padding:5px 0;font:400 12px ${M};color:#a1a4a5}.ox-bar span.h{color:#48d597;white-space:pre;overflow:hidden}.ox-col.pc .ox-bar span.h{color:#f5b944}.ox-con{display:grid;grid-template-columns:190px 1fr;border:1px solid #1f2729;border-radius:6px;overflow:hidden;background:#0b1214;height:400px}.ox-side{border-right:1px solid #1f2729;padding:14px 10px;font:400 13px ${F};color:#a1a4a5}.ox-side .pj{border:1px solid #1f2729;border-radius:4px;padding:8px;margin-bottom:14px;color:#e7e7e8}.ox-side div.it{padding:6px 8px;border-radius:3px;cursor:pointer;display:flex;gap:8px}.ox-side div.it.on{background:#112d24;color:#48d597}.ox-main{padding:16px 20px;overflow:auto}.ox-main .hd{display:flex;align-items:center;gap:10px;margin-bottom:14px}.ox-main .hd h5{margin:0;font:400 20px ${F};flex:1}.ox-tbl{width:100%;border-collapse:collapse;font:400 13px ${F}}.ox-tbl th{text-align:left;font:500 10px ${M};letter-spacing:.06em;text-transform:uppercase;color:#7d8385;padding:8px;border-bottom:1px solid #1f2729}.ox-tbl td{padding:9px 8px;border-bottom:1px solid #161d20}.ox-tbl td.n{color:#e7e7e8}.ox-pill{font:500 10px ${M};letter-spacing:.06em;text-transform:uppercase;padding:2px 7px;border-radius:3px;cursor:pointer}.ox-pill.running{background:#112d24;color:#48d597}.ox-pill.stopped{background:#2a2215;color:#f5b944}.ox-pill.starting,.ox-pill.stopping{background:#1b2533;color:#8ba1ff}.ox-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}.ox-chips span{border:1px solid #2b3134;border-radius:3px;padding:7px 11px;color:#a1a4a5;transition:.2s}.ox-chips span:hover{border-color:#48d597;color:#48d597}.ox-ck{position:fixed;right:16px;bottom:16px;width:280px;background:#0f1618;border:1px solid #2b3134;border-radius:4px;padding:14px;font-size:11px;color:#a1a4a5;z-index:40}.ox-ck div{display:flex;gap:8px;margin-top:10px;justify-content:flex-end}`));
  // ASCII dot-field (draws chars on a grid; density from a moving noise wave)
  const dotField = (c, mode) => { const g = c.getContext('2d'); return (t) => { const r = c.getBoundingClientRect(); if (!r.width) return; if (c.width !== Math.round(r.width)) { c.width = r.width; c.height = r.height; } const w = c.width, H = c.height; g.clearRect(0, 0, w, H); g.font = `10px ${M}`; const cs = 9; const CH = ' .·:-=+*#'; for (let y = 0; y < H; y += cs + 2) for (let x = 0; x < w; x += cs) { let v; if (mode === 0) v = Math.sin(x * 0.03 + t) * Math.cos(y * 0.05 - t * 0.7); else if (mode === 1) v = Math.sin(Math.hypot(x - w / 2, y - H / 2) * 0.06 - t * 2); else v = Math.sin(x * 0.02 + y * 0.03 + t * 1.3) * Math.sin(y * 0.02 - t); const k = Math.max(0, Math.floor((v * 0.5 + 0.5) * CH.length)); if (k < 2) continue; g.fillStyle = k > 6 ? '#48d59799' : '#3a4447'; g.fillText(CH[Math.min(CH.length - 1, k)], x, y + 10); } }; };
  const heroBg = h('canvas.ox-dots'); const bgDraw = (() => { const g = heroBg.getContext('2d'); return (t) => { const r = heroBg.getBoundingClientRect(); if (!r.width) return; if (heroBg.width !== Math.round(r.width)) { heroBg.width = r.width; heroBg.height = r.height; } const w = heroBg.width, H = heroBg.height; g.clearRect(0, 0, w, H); g.fillStyle = '#1d2a2a'; for (let y = 6; y < H; y += 9) for (let x = w * 0.52; x < w; x += 9) { const v = Math.sin(x * 0.012 + t * 0.5) + Math.cos(y * 0.015 - t * 0.4); if (v > 0.6) g.fillRect(x, y, 1.5, 1.5); } }; })();
  const termC = h('canvas'); const pre = h('pre'); let tabI = 0; let tDraw = dotField(termC, 0);
  const SCRIPTS = [[['-> ', 'oxide auth login'], ['d', 'Enter code'], ['', 'LU8A-9AMP'], ['', ''], ['-> ', 'oxide instance list --project prod']], [['-> ', 'curl -X POST /v1/instances'], ['d', '  -d \'{"name":"db-01","ncpus":8}\''], ['', '{ "id": "a3f1…", "run_state":'], ['', '  "starting" }']], [['d', 'console.oxide.computer'], ['', '▣ Instances  12 running'], ['', '▣ Disks      48 attached'], ['', '▣ VPCs       3']]];
  let typed = 0; const renderTerm = () => { const lines = SCRIPTS[tabI]; let left = typed; pre.innerHTML = ''; for (const [p, txt] of lines) { const full = (p === 'd' ? '' : p) + txt; const show = full.slice(0, Math.max(0, left)); left -= full.length; const sp = h('span', { class: p === 'd' ? 'd' : '' }, show); pre.append(sp, '\n'); if (left < 0) { pre.append(h('span.c', {}, '▌')); return false; } } pre.append(h('span.c', {}, '▌')); return true; };
  const tabBtns = ['CLI', 'API', 'Console'].map((t, i) => h('button', { class: i === 0 ? 'on' : '', onclick: () => setTab(i) }, t.toUpperCase()));
  const setTab = (i) => { tabI = i; typed = 0; tDraw = dotField(termC, i); tabBtns.forEach((b, j) => b.classList.toggle('on', j === i)); };
  const term = h('div.ox-term', {}, h('div.tb', {}, ...tabBtns, h('i'), h('em')), termC, pre);
  // rack figure (canvas)
  const rack = h('canvas.ox-rack'); const drawRack = (t) => { if (rack.width !== 800) { rack.width = 800; rack.height = 900; } const g = rack.getContext('2d'); g.clearRect(0, 0, 800, 900); const cols = [[30, 60], [270, 40], [500, 30]]; cols.forEach(([x0, y0], ci) => { g.fillStyle = ci === 2 ? '#15191b' : '#0f1214'; g.fillRect(x0, y0, 260, 860 - y0); g.strokeStyle = '#2b3134'; g.strokeRect(x0, y0, 260, 860 - y0); for (let r = 0; r < 26; r++) { const y = y0 + 40 + r * 30; if (r === 12 || r === 13) { g.fillStyle = '#3a4045'; for (let k = 0; k < 6; k++) g.fillRect(x0 + 20 + k * 38, y + 6, 34, 16); continue; } for (let k = 0; k < 4; k++) { const on = (Math.sin(t * 2 + r * 1.7 + k * 2.3 + ci) + 1) / 2; g.fillStyle = on > 0.85 ? '#7ff0bd' : '#2fae76'; g.fillRect(x0 + 18 + k * 56, y, 50, 20); g.fillStyle = '#0b2a1d'; for (let q = 0; q < 6; q++) g.fillRect(x0 + 20 + k * 56 + q * 8, y + 3, 3, 14); } } }); g.fillStyle = '#48d597'; g.font = `600 36px ${M}`; g.fillText('0xide', 600, 470); for (let i = 0; i < 40; i++) { g.fillStyle = '#1f2527'; g.fillRect(720 + (i % 5) * 12, 120 + Math.floor(i / 5) * 12, 8, 8); } };
  const lead = s('svg', { class: 'ox-lead', viewBox: '0 0 340 130' }, s('path', { d: 'M0 4 H110 L230 126 H340', fill: 'none', stroke: '#3a4447', 'stroke-width': 1 }));
  const nav = h('div.ox-nav', {}, h('span.ox-logo', {}, '0×ide'), h('div.ox-links.mono', {}, ...['Product ⌄', 'Solutions ⌄', 'Resources ⌄', 'Company ⌄', 'Podcasts ⌄', 'Blog'].map((l) => h('span', {}, l))), h('button.ox-b.mono', { onclick: () => toast('Try now (demo)') }, 'Try now'), h('button.ox-b.g.mono', { onclick: () => toast('Contact sales (demo)') }, 'Contact sales'));
  const hero = h('div.ox-hero', {}, heroBg, term, lead, h('div.ox-fig.mono', {}, 'Fig. 1 ', h('b', {}, ' Oxide Cloud Computer')), rack, h('h1.ox-h1', {}, 'On-prem that feels', h('br'), 'like the public cloud'), h('div.ox-pw', {}, h('span.mono', {}, 'Powering the best teams'), ...['STOKE', 'Lawrence Livermore', 'INL', 'Shopify', 'CoreWeave'].map((n) => h('b', {}, n))));
  // boot card
  const STEPS = ['Power on 32 sleds', 'Verify root of trust', 'Bring up control plane', 'Rack 6 initialized']; let stepN = 4, signed = false;
  const stepsEl = h('ul.ox-steps'); const sso = h('button.ox-sso', { onclick: () => doSSO() }, 'SIGN IN WITH SSO'); const who = h('div.mono', { style: { color: '#7d8385', marginTop: '10px' } }, 'idp: okta · silo: engineering');
  const drawSteps = () => stepsEl.replaceChildren(...STEPS.map((t, i) => h('li', { class: i < stepN ? 'ok' : '' }, t)), h('li', { class: signed ? 'ok' : '' }, signed ? 'Signed in as ops@acme.dev' : 'Authenticate operator'));
  const doSSO = async () => { if (signed) { signed = false; sso.textContent = 'SIGN IN WITH SSO'; drawSteps(); return; } sso.textContent = 'REDIRECTING TO IDP…'; await sleep(500); signed = true; sso.textContent = 'OPEN CONSOLE →'; drawSteps(); };
  const boot = h('div.ox-sec', {}, h('div.ox-w.ox-boot', {}, h('div.ox-card', {}, h('div.st', {}, h('i'), h('span.mono.ox-cap', {}, 'Online')), h('h3', {}, 'Rack 6 Initialized'), h('div', { style: { color: '#7d8385', fontSize: '13px' } }, '2,048 cores · 32 TiB DRAM · 1 PiB NVMe'), stepsEl, sso, who), h('div', {}, h('span.mono.ox-cap', {}, 'Fig. 2 — Day one'), h('h2', {}, 'From loading dock to first VM in hours, not months.'), h('p', { style: { color: '#a1a4a5', maxWidth: '520px' } }, 'Hardware and software designed together: the rack arrives integrated, boots its own control plane, and hands developers a cloud API on first login.'))));
  // comparison with ASCII bars
  const ROWS = [['Time to provision', 22, 95, 90], ['Cost predictability', 30, 92, 40], ['Data sovereignty', 90, 96, 35], ['Developer API', 25, 94, 98], ['Power efficiency', 40, 88, 60]];
  const bars = []; const bar = (lbl, v, k) => { const hs = h('span.h'); bars.push([hs, v]); return h('div.ox-bar', {}, h('span', {}, lbl), hs, h('span', { style: { textAlign: 'right' } }, v + '%')); };
  const colTrad = h('div.ox-col', {}, h('h4', {}, 'Traditional on-prem'), ...ROWS.map((r) => bar(r[0], r[1]))), colOx = h('div.ox-col', { style: { borderColor: '#48d59755' } }, h('h4', { style: { color: '#48d597' } }, 'Oxide'), ...ROWS.map((r) => bar(r[0], r[2]))), colPc = h('div.ox-col.pc', {}, h('h4', {}, 'Public cloud'), ...ROWS.map((r) => bar(r[0], r[3])));
  let barsDone = 0; const growBars = () => { barsDone = 1; let f = 0; const step = () => { f = Math.min(1, f + 0.05); bars.forEach(([el, v]) => { el.textContent = '#'.repeat(Math.round((v / 100) * 22 * f)); }); if (f < 1) requestAnimationFrame(step); }; step(); };
  const cmpSeg = h('div', { style: { display: 'flex', gap: '6px', marginBottom: '16px' } }); let cmpMode = 0; const cmpGrid = h('div.ox-cmp');
  const drawCmp = () => { cmpSeg.replaceChildren(...['vs Traditional on-prem', 'vs Public cloud'].map((t, i) => h('button', { class: 'ox-b mono' + (i === cmpMode ? ' g' : ''), onclick: () => { cmpMode = i; drawCmp(); growBars(); } }, t))); cmpGrid.replaceChildren(cmpMode ? colPc : colTrad, colOx); };
  const cmp = h('div.ox-sec', {}, h('div.ox-w', {}, h('span.mono.ox-cap', {}, 'Fig. 3 — Comparison'), h('h2', {}, 'The best of both, without the trade-offs.'), cmpSeg, cmpGrid));
  // mock web console
  const INST = [['db-primary', 16, '64 GiB', 'running'], ['db-replica', 16, '64 GiB', 'running'], ['api-gateway', 4, '8 GiB', 'running'], ['ci-runner-03', 8, '16 GiB', 'stopped'], ['analytics', 32, '128 GiB', 'running'], ['staging-web', 2, '4 GiB', 'stopped']].map(([n, c, m, s0]) => ({ n, c, m, s: s0 }));
  const SIDE = ['Instances', 'Disks', 'Snapshots', 'Images', 'VPCs', 'Floating IPs', 'Access']; let sideI = 0;
  const side = h('div.ox-side'); const main = h('div.ox-main');
  const drawSide = () => side.replaceChildren(h('div.pj', {}, h('div.mono', { style: { color: '#7d8385' } }, 'Project'), 'prod-east'), ...SIDE.map((t, i) => h('div', { class: 'it' + (i === sideI ? ' on' : ''), onclick: () => { sideI = i; drawSide(); drawMain(); } }, '▢', t)));
  const toggleInst = async (it) => { const to = it.s === 'running' ? 'stopped' : 'running'; it.s = to === 'running' ? 'starting' : 'stopping'; drawMain(); await sleep(600); it.s = to; drawMain(); };
  const drawMain = () => { if (sideI !== 0) { main.replaceChildren(h('div.hd', {}, h('h5', {}, SIDE[sideI])), h('div', { style: { color: '#7d8385', font: `12px ${M}`, padding: '30px 0' } }, `${SIDE[sideI].toUpperCase()} · mock view`)); return; } const run = INST.filter((i) => i.s === 'running').length; main.replaceChildren(h('div.hd', {}, h('h5', {}, 'Instances'), h('span.mono', { style: { color: '#7d8385' } }, `${run}/${INST.length} running`), h('button.ox-b.g.mono', { onclick: () => { INST.push({ n: 'new-instance-' + INST.length, c: 2, m: '4 GiB', s: 'starting' }); drawMain(); setTimeout(() => { INST[INST.length - 1].s = 'running'; drawMain(); }, 700); } }, 'New instance')), h('table.ox-tbl', {}, h('tr', {}, ...['Name', 'CPU', 'Memory', 'State', ''].map((t) => h('th', {}, t))), ...INST.map((it) => h('tr', {}, h('td.n', {}, it.n), h('td', {}, it.c + ' vCPU'), h('td', {}, it.m), h('td', {}, h('span', { class: 'ox-pill ' + it.s, title: 'click to start/stop', onclick: () => toggleInst(it) }, it.s)), h('td', { style: { color: '#7d8385' } }, '⋯'))))); };
  const CH = ['Elastic Storage', 'NVMe', 'Triple-Mirror', 'Hardware Root of Trust', 'Open Firmware', '15 kW rack', 'DC Bus Bar', 'IAM + SSO', 'Terraform'];
  const con = h('div.ox-sec', {}, h('div.ox-w', {}, h('span.mono.ox-cap', {}, 'Fig. 4 — Web console'), h('h2', {}, 'A console your developers already know.'), h('div.ox-con', {}, side, main), h('div.ox-chips.mono', {}, ...CH.map((c) => h('span', {}, c)))));
  const ck = h('div.ox-ck', {}, 'We use our own and third-party cookies to enhance your experience and analyze use of our website.', h('div', {}, h('button.ox-b.mono', { onclick: () => ck.remove() }, 'Reject optional'), h('button.ox-b.mono', { onclick: () => ck.remove() }, 'Accept all')));
  root.append(h('div.ox', {}, nav, hero, boot, cmp, con, h('div.ox-w.mono', { style: { padding: '40px 28px', color: '#7d8385' } }, '© Oxide clone · practice build')), ck);
  drawSteps(); drawCmp(); drawSide(); drawMain();
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !barsDone) growBars(); }), { root, threshold: 0.3 }); io.observe(cmp);
  let lastType = 0; const loop = (now) => { const t = now / 1000; bgDraw(t); tDraw(t); drawRack(t); if (now - lastType > 45) { lastType = now; typed++; if (renderTerm() && typed > 400) typed = 0; } requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  window.__demoProof = async () => { const out = []; setTab(1); await sleep(400); out.push(`tab API typed="${pre.textContent.slice(0, 18)}"`); setTab(2); out.push(`tab Console active=${tabBtns[2].classList.contains('on')}`); setTab(0); await sleep(200); await doSSO(); out.push(`SSO signed=${signed}`); await doSSO(); cmpSeg.children[1].click(); await sleep(500); out.push(`compare=${cmpGrid.firstChild.querySelector('h4').textContent}, bar="${bars[0][0].textContent.length}#"`); cmpSeg.children[0].click(); const it = INST[3]; await toggleInst(it); out.push(`ci-runner-03 → ${it.s}`); await toggleInst(it); out.push(`back → ${it.s}`); side.children[2].click(); out.push(`sidebar → ${SIDE[sideI]}`); side.children[1].click(); out.push(`nav sticky=${getComputedStyle(nav).position}`); root.scrollTop = 0; return out.join('; ') + '; restored'; };
};
V['pudding-sticker-story-index'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#000000', ac: '#000000', dark: false }); scroll(root);
  const SR = "'Fraunces Variable',Georgia,serif", SA = "'Inter Variable',system-ui,sans-serif";
  root.append(h('style', {}, `.pd{background:#fff;color:#000;font:400 15px/1.45 ${SA};min-height:100%}.pd button{cursor:pointer}.pd-w{max-width:1260px;margin:0 auto;padding:0 20px}.pd-top{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:28px 0 20px}.pd-tag{font:500 14px/1.4 ${SA}}.pd-tag b{display:block;font-weight:800;min-height:1.4em}.pd-tag b span{display:inline-block;transition:transform .35s,opacity .35s}.pd-tag b span.out{transform:translateY(-8px);opacity:0}.pd-mark{width:230px;height:104px;cursor:pointer;transition:transform .3s cubic-bezier(.2,.9,.2,1.4)}.pd-mark:hover{transform:rotate(-4deg) scale(1.05)}.pd-stk{display:flex;gap:12px;justify-content:flex-end}.pd-st{position:relative;font:900 15px/1 ${SA};letter-spacing:-.02em;padding:6px 10px;background:#fff;border:2.5px solid #000;border-radius:99px;box-shadow:2px 2px 0 #000;transform:rotate(-3deg);transition:transform .25s cubic-bezier(.2,.9,.2,1.5),box-shadow .25s;overflow:hidden}.pd-st:nth-child(2){transform:rotate(4deg)}.pd-st::after{content:'';position:absolute;right:-1px;bottom:-1px;width:0;height:0;background:linear-gradient(135deg,#ddd 50%,#fff 50%);box-shadow:-2px -2px 3px #0003;transition:width .25s,height .25s}.pd-st:hover{transform:rotate(0) translate(-1px,-3px) scale(1.06);box-shadow:4px 6px 0 #000}.pd-st:hover::after{width:12px;height:12px}.pd-bar{display:flex;align-items:center;gap:10px;padding:16px 0 30px}.pd-bar .q{font-size:26px}.pd-bar input{border:1.5px solid #999;border-radius:4px;padding:7px 9px;font:14px ${SA};width:160px}.pd-bar .sp{flex:1}.pd-f{white-space:nowrap;display:flex;align-items:center;gap:6px;border:0;background:none;font:500 12px 'JetBrains Mono Variable',monospace;letter-spacing:.04em;text-transform:uppercase;padding:4px 6px;border-radius:99px;color:#000}.pd-f em{font-style:normal;font-size:17px;filter:grayscale(1) brightness(.35) contrast(1.4);transition:transform .25s}.pd-f.on{background:#000;color:#fff}.pd-f.on em{filter:none;transform:rotate(-10deg) scale(1.15)}.pd-f:hover em{transform:rotate(-10deg) scale(1.15)}.pd-grid{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:56px 32px;padding-bottom:60px}.pd-c{cursor:pointer;will-change:transform}.pd-c .r{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font:500 13px 'JetBrains Mono Variable',monospace;letter-spacing:.05em}.pd-c .n{border:1.5px solid #000;border-radius:99px;padding:3px 7px}.pd-c .im{position:relative;aspect-ratio:1/1;overflow:hidden}.pd-c .im canvas{width:100%;height:100%;display:block;transition:transform .5s}.pd-c:hover .im canvas{transform:scale(1.04)}.pd-c .pl{position:absolute;inset:0;display:grid;place-items:center;font-size:40px;color:#fff;text-shadow:0 2px 10px #0008}.pd-c h3{font:800 28px/1.05 ${SR};letter-spacing:-.025em;margin:12px 0 6px;text-transform:lowercase}.pd-c p{margin:0;color:#555;font-size:15px}.pd-nl{grid-column:span 3;border:2.5px solid #000;border-radius:14px;padding:22px 26px;display:flex;align-items:center;gap:22px;background:#fdf0b2;box-shadow:5px 5px 0 #000}.pd-nl h4{margin:0;font:800 22px ${SR}}.pd-nl input{flex:1;border:2px solid #000;border-radius:6px;padding:9px;font:13px ${SA}}.pd-nl button{border:2px solid #000;background:#000;color:#fff;border-radius:6px;padding:9px 14px;font:700 12px ${SA}}.pd-mobile .pd-w{max-width:390px;border:10px solid #111;border-radius:36px;margin-top:10px;padding-top:6px}.pd-mobile .pd-top{grid-template-columns:1fr;justify-items:center;gap:10px}.pd-mobile .pd-stk{justify-content:center}.pd-mobile .pd-bar{flex-wrap:wrap;justify-content:center}.pd-mobile .pd-bar .sp{display:none}.pd-mobile .pd-grid{grid-template-columns:1fr;gap:22px}.pd-mobile .pd-c{display:grid;grid-template-columns:110px 1fr;gap:4px 12px}.pd-mobile .pd-c .r{grid-column:span 2;margin:0}.pd-mobile .pd-c h3{font-size:17px;margin:2px 0}.pd-mobile .pd-nl{grid-column:span 1;flex-direction:column;align-items:stretch}.pd-dev{position:fixed;left:14px;bottom:14px;z-index:30;display:flex;border:2px solid #000;border-radius:99px;overflow:hidden;background:#fff;box-shadow:2px 2px 0 #000}.pd-dev button{border:0;background:none;padding:6px 12px;font:700 11px ${SA}}.pd-dev button.on{background:#000;color:#fff}`));
  // sticker wordmark: stacked text strokes (black offset shadow, white outline, black fill)
  const mark = s('svg', { class: 'pd-mark', viewBox: '0 0 380 170' }); const word = (dx, dy, fill, stroke, sw) => [s('text', { x: 92 + dx, y: 40 + dy, 'font-family': 'Fraunces Variable, serif', 'font-style': 'italic', 'font-weight': 900, 'font-size': 34, fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'round', transform: 'rotate(-8 170 80)' }, 'The'), s('text', { x: 18 + dx, y: 118 + dy, 'font-family': 'Fraunces Variable, serif', 'font-style': 'italic', 'font-weight': 900, 'font-size': 84, fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'round', 'letter-spacing': -3, transform: 'rotate(-8 170 80)' }, 'Pudding')];
  mark.append(...word(5, 6, '#000', '#000', 16), ...word(0, 0, '#fff', '#000', 16), ...word(0, 0, '#fff', '#fff', 8), ...word(0, 0, '#000', 'none', 0));
  const ENDS = ['explains ideas with visual essays', 'debates with data', 'makes the internet weirder', 'turns spreadsheets into stories', 'asks you to play along']; let ei = 0;
  const endSp = h('span', {}, ENDS[0]); const cycle = async () => { endSp.classList.add('out'); await sleep(350); ei = (ei + 1) % ENDS.length; endSp.textContent = ENDS[ei]; endSp.classList.remove('out'); };
  const tagEl = h('div.pd-tag', {}, 'A digital publication that…', h('b', {}, endSp)); const cyc = setInterval(() => { if (!root.isConnected) return clearInterval(cyc); cycle(); }, 2600);
  const stk = h('div.pd-stk', {}, ...['ABOUT', 'SUBSCRIBE ✈', 'MORE ≡'].map((t) => h('button.pd-st', { onclick: () => toast(t.split(' ')[0] + ' (demo)') }, t)));
  // stories: [num, month, title, tease, bg, tags, kind]
  const S = [[225, 'OCT 2026', 'life after death?', 'A room of thousands of humans wrestling with what comes after it all.', '#8e3fa8', 'faves popular input', 'crowd'], [224, 'AUG 2026', 'mowing experiment', 'Why some people mow a lawn better than others.', '#f7c948', 'popular', 'heat'], [223, 'JUL 2026', 'english vocab lists', 'How the words we teach English language learners changed.', '#f08ce6', 'faves updating', 'ribbon'], [222, 'JUN 2026', 'the sound of cities', 'Press play on a block-by-block soundscape of five cities.', '#2f6fdb', 'audio input', 'wave'], [221, 'JUN 2026', 'tiny house, big feelings', 'A short film about 200 square feet.', '#ff6b4a', 'video faves', 'film'], [220, 'JUN 2026', 'every pixel of pop', 'Which album covers share a palette? All of them, kinda.', '#28b07a', 'popular updating', 'grid'], [219, 'MAY 2026', 'how loud is a crowd', 'We measured 400 stadium chants. You can add yours.', '#1e1e1e', 'audio input popular', 'wave'], [218, 'APR 2026', 'the nap atlas', 'Where the world sleeps in the afternoon.', '#7fd1f0', 'faves', 'dots'], [217, 'MAR 2026', 'film trailers, decoded', 'Two minutes, a hundred cuts: the anatomy of a trailer.', '#ffb3c1', 'video', 'film']];
  const draw = (c, kind, bg, seed) => { c.width = 300; c.height = 300; const g = c.getContext('2d'); const R = rng(seed); g.fillStyle = bg; g.fillRect(0, 0, 300, 300); g.fillStyle = '#111'; g.fillRect(48, 48, 204, 204); if (kind === 'crowd') { for (let i = 0; i < 60; i++) { const x = 60 + R() * 180, y = 150 + R() * 90, sc = 0.5 + (y - 150) / 90; g.fillStyle = i % 9 ? '#c79cf0' : '#ffe27a'; g.beginPath(); g.arc(x, y - 10 * sc, 4 * sc, 0, 7); g.fill(); g.fillRect(x - 3 * sc, y - 6 * sc, 6 * sc, 14 * sc); } g.fillStyle = '#fff'; for (let i = 0; i < 7; i++) g.fillRect(70 + i * 26, 70, 2, 2); } else if (kind === 'heat') { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const v = R(); g.fillStyle = `hsl(${300 + v * 40},70%,${35 + v * 35}%)`; g.fillRect(64 + x * 10, 110 + y * 10, 9, 9); g.fillRect(160 + x * 10, 110 + y * 10, 9, 9); } g.fillStyle = '#ddd'; for (let i = 0; i < 5; i++) g.fillRect(64, 70 + i * 6, 170 - i * 12, 2); } else if (kind === 'ribbon') { g.fillStyle = '#f6f0e6'; g.fillRect(48, 48, 204, 204); for (let i = 0; i < 8; i++) { g.strokeStyle = ['#ff9f43', '#d47ff0', '#e8dcc6'][i % 3]; g.lineWidth = 9; g.beginPath(); g.moveTo(70, 70 + i * 22); g.bezierCurveTo(140, 70 + i * 22, 160, 70 + ((i * 5) % 8) * 22, 250, 70 + ((i * 3) % 8) * 22); g.stroke(); } } else if (kind === 'wave') { g.strokeStyle = bg === '#1e1e1e' ? '#ff6b4a' : '#7fd1f0'; g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); for (let x = 60; x < 240; x += 3) g.lineTo(x, 90 + k * 24 + Math.sin(x * 0.08 + k) * (6 + R() * 8)); g.stroke(); } } else if (kind === 'film') { g.fillStyle = bg; for (let i = 0; i < 6; i++) { g.fillRect(56, 58 + i * 32, 10, 14); g.fillRect(234, 58 + i * 32, 10, 14); } g.fillStyle = '#444'; g.fillRect(76, 80, 148, 140); } else if (kind === 'grid') { for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) { g.fillStyle = `hsl(${R() * 360},65%,55%)`; g.fillRect(60 + x * 31, 60 + y * 31, 28, 28); } } else { for (let i = 0; i < 140; i++) { g.fillStyle = `hsla(${190 + R() * 40},80%,70%,${0.4 + R() * 0.6})`; g.beginPath(); g.arc(60 + R() * 180, 80 + R() * 150, 1 + R() * 4, 0, 7); g.fill(); } } };
  const cards = S.map(([n, mo, ti, te, bg, tags, kind]) => { const c = h('canvas'); draw(c, kind, bg, n); const el = h('div.pd-c', { 'data-n': n, onclick: () => toast(`#${n} ${ti} (demo)`) }, h('div.r', {}, h('span.n', {}, '#' + n), h('span', {}, mo)), h('div.im', {}, c, tags.includes('video') ? h('div.pl', {}, '▶') : null), h('div', {}, h('h3', {}, ti), h('p', {}, te))); el.tags = tags + ' all'; el.text = (ti + ' ' + te).toLowerCase(); return el; });
  const nl = h('div.pd-nl', {}, h('div', {}, h('h4', {}, 'get the pudding in your inbox'), h('div', { style: { fontSize: '12px' } }, 'one email a month · no spam, just stories')), h('input', { placeholder: 'you@email.com' }), h('button', { onclick: () => toast('Subscribed (demo)') }, 'Subscribe'));
  const grid = h('div.pd-grid');
  const FL = [['faves', '💖', 'Our faves'], ['popular', '😜', 'Popular'], ['updating', '⚡', 'Updating'], ['input', '👆', 'Your input'], ['video', '🎥', 'Video'], ['audio', '🎵', 'Audio'], ['all', '✳', 'All']]; let filt = 'all', query = '';
  const fbtns = FL.map(([k, e, l]) => h('button', { class: 'pd-f' + (k === filt ? ' on' : ''), onclick: () => setFilter(k) }, h('em', {}, e), l));
  const visible = () => cards.filter((c) => c.tags.includes(filt) && (!query || c.text.includes(query))).sort((a, b) => b.dataset.n - a.dataset.n);
  // FLIP: record old rects, re-layout, invert, play; leaving cards fade out, entering fade in
  const layout = (anim = true) => { const old = new Map(); [...grid.children].forEach((el) => old.set(el, el.getBoundingClientRect())); const vis = visible(); const kids = [...vis]; kids.splice(Math.min(3, kids.length), 0, nl); grid.replaceChildren(...kids); if (!anim) return; kids.forEach((el) => { const o = old.get(el); const n = el.getBoundingClientRect(); if (o) { const dx = o.left - n.left, dy = o.top - n.top; if (dx || dy) el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' }); } else el.animate([{ opacity: 0, transform: 'scale(.85) rotate(-3deg)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.9,.2,1.3)' }); }); };
  const setFilter = (k) => { filt = k; fbtns.forEach((b, i) => b.classList.toggle('on', FL[i][0] === k)); layout(); };
  const search = h('input', { placeholder: 'Find a story…', oninput: (e) => { query = e.target.value.toLowerCase().trim(); layout(); } });
  const pd = h('div.pd', {}, h('div.pd-w', {}, h('div.pd-top', {}, tagEl, mark, stk), h('div.pd-bar', {}, h('span.q', {}, '🔍'), search, h('span.sp'), ...fbtns), grid));
  const dev = h('div.pd-dev', {}, ...['Desktop', 'Mobile'].map((t, i) => h('button', { class: i ? '' : 'on', onclick: (e) => { pd.classList.toggle('pd-mobile', i === 1); [...dev.children].forEach((b) => b.classList.toggle('on', b === e.currentTarget)); } }, t)));
  root.append(pd, dev); layout(false);
  window.__demoProof = async () => { const out = []; const e0 = endSp.textContent; await cycle(); out.push(`tagline cycled "${e0}" → "${endSp.textContent}"`); setFilter('video'); await sleep(500); out.push(`filter video → ${visible().map((c) => '#' + c.dataset.n).join(',')}`); setFilter('audio'); const nums = visible().map((c) => +c.dataset.n); out.push(`audio order desc=${nums.every((v, i) => !i || v < nums[i - 1])}`); search.value = 'pixel'; search.dispatchEvent(new Event('input')); setFilter('all'); out.push(`search "pixel" → ${visible().length}`); search.value = ''; search.dispatchEvent(new Event('input')); out.push(`newsletter in grid=${grid.contains(nl)}`); dev.children[1].click(); out.push(`mobile layout=${pd.classList.contains('pd-mobile')}`); dev.children[0].click(); setFilter('all'); root.scrollTop = 0; return out.join('; ') + '; restored'; };
};
V['paper-shaders-live-tile-gallery-props-panel'] = (root, T) => {
  theme(root, T, { bg: '#f4f2ec', fg: '#1c1c1c', ac: '#3b82f6', dark: false }); scroll(root);
  const F = "'Inter Variable',system-ui,sans-serif";
  root.append(h('style', {}, `.ps{font:400 14px/1.45 ${F};color:#1f1f1f;background:linear-gradient(#efede6,#f7f6f2 380px,#fcfcfb 900px);min-height:100%;padding-bottom:80px}.ps a{color:inherit;text-decoration:none}.ps button{font-family:${F};cursor:pointer}
.ps-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 34px}.ps-logo{display:flex;align-items:center;gap:7px;font:500 21px ${F};letter-spacing:-.02em}.ps-logo i{width:19px;height:19px;position:relative;display:inline-block}.ps-logo i:before{content:'';position:absolute;inset:0 6px 6px 0;background:#3b82f6;border-radius:2px}.ps-logo i:after{content:'';position:absolute;inset:6px 0 0 6px;background:#a6c8ff;border-radius:2px;mix-blend-mode:multiply}
.ps-hero{text-align:center;padding:4px 0 34px}.ps-hero h1{font:300 27px ${F};letter-spacing:-.01em;margin:0 0 6px}.ps-hero p{margin:0;color:#6b6b6b;font-size:13px;line-height:1.55}.ps-npm{display:inline-flex;margin-top:16px;border:1px solid #dcdad3;border-radius:7px;background:#fff;overflow:hidden;font:12.5px 'JetBrains Mono Variable',monospace}.ps-npm span{padding:9px 12px}.ps-npm button{border:0;border-left:1px solid #dcdad3;background:#fff;width:36px}
.ps-sec{padding:0 34px;max-width:1440px;margin:0 auto}.ps-sec h2{font:400 18px ${F};margin:26px 0 14px;letter-spacing:-.005em}.ps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px 34px}.ps-tile{cursor:pointer}.ps-tile canvas{width:100%;aspect-ratio:4/3;border-radius:10px;display:block;background:#ddd;transition:transform .25s}.ps-tile:hover canvas{transform:scale(1.015)}.ps-tile div{text-align:center;font-size:12.5px;margin-top:8px;color:#333}
.ps-det{max-width:1100px;margin:0 auto;padding:0 34px}.ps-back{font-size:12.5px;color:#666;display:inline-block;margin:4px 0 10px}.ps-det h1{font:300 26px ${F};margin:0 0 14px}.ps-stage{position:relative;height:520px;border-radius:12px;overflow:hidden;background:#ccc}.ps-stage>canvas{width:100%;height:100%;display:block}
.lv{position:absolute;top:12px;right:12px;width:290px;background:#181c20;color:#8c92a4;border-radius:10px;font:11px/1 ${F};box-shadow:0 8px 30px #0005;user-select:none}.lv-t{height:26px;display:flex;align-items:center;justify-content:center;cursor:grab;color:#535760;letter-spacing:2px;border-bottom:1px solid #22262c}.lv-b{padding:8px 10px;display:flex;flex-direction:column;gap:6px}.lv-r{display:grid;grid-template-columns:86px 1fr;align-items:center;gap:8px;min-height:24px}.lv-r label{color:#8c92a4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lv-c{display:flex;gap:6px;align-items:center}.lv-c input[type=range]{flex:1;accent-color:#007bff;height:3px}.lv-n{width:46px;background:#373c4b;border:0;border-radius:2px;color:#fefefe;font:11px 'JetBrains Mono Variable',monospace;padding:5px 4px;text-align:left}.lv-sw{width:22px;height:22px;border-radius:2px;border:0;padding:0;overflow:hidden;position:relative}.lv-sw input{opacity:0;position:absolute;inset:0;cursor:pointer}.lv-hex{flex:1;background:#373c4b;border-radius:2px;color:#fefefe;font:11px 'JetBrains Mono Variable',monospace;padding:6px}.lv select{flex:1;background:#373c4b;color:#fefefe;border:0;border-radius:2px;font:11px ${F};padding:5px}
.ps-pre{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.ps-pre button{border:1px solid #d9d6cd;background:#fff;border-radius:7px;padding:7px 12px;font-size:12.5px;display:flex;align-items:center;gap:8px}.ps-pre button i{width:14px;height:14px;border-radius:50%;display:inline-block}.ps-pre button.on{border-color:#1f1f1f}
.ps-code{position:relative;background:#fff;border:1px solid #e2dfd7;border-radius:10px;padding:16px 18px;font:12.5px/1.7 'JetBrains Mono Variable',monospace;white-space:pre;overflow:auto;color:#333}.ps-code .k{color:#a43a8c}.ps-code .c{color:#2f6bdf}.ps-code .a{color:#6d5bd0}.ps-code .v{color:#2a8a52}.ps-code button{position:absolute;top:10px;right:10px;border:1px solid #e2dfd7;background:#faf9f6;border-radius:6px;font:12px ${F};padding:5px 10px}
.ps-props{width:100%;border-collapse:collapse;margin-top:18px;font-size:12.5px}.ps-props th{text-align:left;font-weight:500;color:#777;border-bottom:1px solid #e2dfd7;padding:8px 6px}.ps-props td{border-bottom:1px solid #eeebe4;padding:8px 6px;vertical-align:top}.ps-props td:first-child{font-family:'JetBrains Mono Variable',monospace}`));
  // procedural flower photo used as the image-filter source (stand-in for Paper's flower photo)
  const photo = document.createElement('canvas'); photo.width = 600; photo.height = 400;
  { const g = photo.getContext('2d'); const sky = g.createLinearGradient(0, 0, 0, 400); sky.addColorStop(0, '#d9ecf7'); sky.addColorStop(1, '#f4f7f6'); g.fillStyle = sky; g.fillRect(0, 0, 600, 400); const r = rng(11);
    const flower = (x, y, s, blur) => { g.filter = `blur(${blur}px)`; g.strokeStyle = '#4c6b3c'; g.lineWidth = 2.2 * s; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 30 * (r() - 0.5), y + 120, x + 40 * (r() - 0.5), 420); g.stroke(); for (let k = 0; k < 9; k++) { g.save(); g.translate(x, y); g.rotate((k / 9) * Math.PI * 2 + r()); g.fillStyle = k % 2 ? '#f2a218' : '#f7b733'; g.beginPath(); g.ellipse(18 * s, 0, 17 * s, 7 * s, 0, 0, Math.PI * 2); g.fill(); g.restore(); } g.fillStyle = '#5a3a12'; g.beginPath(); g.arc(x, y, 7 * s, 0, Math.PI * 2); g.fill(); g.filter = 'none'; };
    const bud = (x, y) => { g.strokeStyle = '#4c6b3c'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 8, 420); g.stroke(); g.fillStyle = '#3d4a2c'; g.beginPath(); g.ellipse(x, y, 4, 9, 0.3, 0, Math.PI * 2); g.fill(); };
    for (let i = 0; i < 12; i++) bud(40 + r() * 520, 120 + r() * 200);
    [[120, 330, 1.3, 4], [480, 90, 1.25, 0], [540, 200, 1.0, 1], [80, 200, 0.6, 2], [300, 260, 0.7, 3], [380, 330, 0.9, 1], [250, 120, 0.55, 5]].forEach(([x, y, sc, b]) => flower(x, y, sc, b)); }
  const HDR = `precision highp float;varying vec2 uv;uniform float t;uniform vec2 R;uniform sampler2D img;uniform vec3 c1,c2,c3;uniform vec4 p,p2;uniform float scl;
float hash(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
float fbm(vec2 q){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(q);q*=2.03;a*=.5;}return v;}
vec2 cover(vec2 u){float ar=R.x/R.y;vec2 c=u-.5;if(ar>1.5)c.y*=1.5/ar;else c.x*=ar/1.5;return c+.5;}
vec3 tex(vec2 u){return texture2D(img,cover(clamp(u,0.,1.))).rgb;}
float bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
float bayer4(vec2 a){return bayer2(.5*a)*.25+bayer2(a);}
float bayer8(vec2 a){return bayer4(.5*a)*.25+bayer2(a);}
vec2 asp(vec2 u){return (u-.5)*vec2(R.x/R.y,1.);}
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float shape(vec2 q,float k){if(k<.5)return length(q)-.3;if(k<1.5)return abs(q.x)+abs(q.y)-.38;if(k<2.5){vec2 a=vec2(sin(t*.7)*.16,cos(t*.5)*.08);float d1=length(q-a)-.19,d2=length(q+a)-.17;float hh=clamp(.5+.5*(d2-d1)/.12,0.,1.);return mix(d2,d1,hh)-.12*hh*(1.-hh);}float an=atan(q.y,q.x);return length(q)-(.27+.06*sin(an*6.));}
`;
  const SH = [
    { id: 'paper-texture', comp: 'PaperTexture', cat: 'image filters', colors: [['colorFront', '#9fadbc'], ['colorBack', '#ffffff']], params: [['contrast', 0, 0, 1, 0.3], ['roughness', 1, 0, 1, 0.4], ['fiber', 2, 0, 1, 0.3], ['crumples', 3, 0, 1, 0.3]], speed: 0, frag: `void main(){vec2 q=asp(uv)*scl;float cr=fbm(q*4.+3.);float fo=(1.-smoothstep(0.,.012,abs(q.x-.02+q.y*.06)))+(1.-smoothstep(0.,.012,abs(q.y+.03-q.x*.04)));float fib=noise(q*vec2(260.,30.))*p.z;float ro=(hash(floor(uv*R))-.5)*p.y*.2;vec3 col=tex(uv+(vec2(cr)-.5)*p.w*.02);float light=.93+(cr-.5)*p.w*.6+(q.x>.02?.05:-.03)*(1.+p.x)+(q.y>-.03?.03:-.02)-fo*.1+fib*.08+ro;col=mix(col,c2,.22)*light;col=mix(col,c1,.06*p.x);gl_FragColor=vec4(col,1.);}` },
    { id: 'fluted-glass', comp: 'FlutedGlass', cat: 'image filters', colors: [['colorHighlight', '#ffffff']], params: [['count', 0, 4, 40, 14, 1], ['distortion', 1, 0, 1, 0.5], ['highlights', 2, 0, 1, 0.3], ['angle', 3, 0, 180, 0, 1]], speed: 0.3, frag: `void main(){float a=p.w*3.14159/180.;vec2 c=uv-.5;vec2 r=rot(a)*c;float f=fract(r.x*p.x+t*.03);float d=f-.5;vec2 off=vec2(cos(a),-sin(a))*d*p.y*.18;vec3 col=tex(uv+off)*.5+tex(uv+off*1.2+vec2(.003,0.))*.5;col+=c1*pow(1.-abs(d*2.),10.)*p.z*.35;col-=smoothstep(.44,.5,abs(d))*.07;gl_FragColor=vec4(col,1.);}` },
    { id: 'water', comp: 'Water', cat: 'image filters', colors: [['colorHighlight', '#ffffff']], params: [['caustic', 0, 0, 1, 0.4], ['distortion', 1, 0, 1, 0.5], ['layering', 2, 0, 1, 0.5], ['highlights', 3, 0, 1, 0.2]], speed: 1, frag: `void main(){vec2 q=asp(uv)*scl*4.;float n=fbm(q+vec2(t*.3,t*.2));float m=fbm(q*1.7-vec2(t*.25,0.)+n*2.*p.z);vec2 off=(vec2(n,m)-.5)*p.y*.07;vec3 col=tex(uv+off);float ca=pow(1.-abs(sin((n+m)*9.)),8.)*p.x;col+=c1*ca*.35+pow(m,5.)*p.w;gl_FragColor=vec4(col,1.);}` },
    { id: 'image-dithering', comp: 'ImageDithering', cat: 'image filters', colors: [['colorFront', '#2a3d63'], ['colorBack', '#b8f28c']], params: [['pxSize', 0, 1, 8, 2, 1], ['contrast', 2, 0.5, 3, 1.4]], enums: [['type', 1, ['2x2', '4x4', '8x8'], '4x4']], speed: 0.2, frag: `void main(){vec2 px=floor(uv*R/p.x);vec2 u=(px*p.x+.5*p.x)/R;float l=dot(tex(u),vec3(.299,.587,.114));l=clamp((l-.68)*p.z+.5+(noise(px*.04+t)-.5)*.06,0.,1.);float th=p.y<.5?bayer2(px):(p.y<1.5?bayer4(px):bayer8(px));gl_FragColor=vec4(mix(c1,c2,step(th,l)),1.);}` },
    { id: 'halftone-dots', comp: 'HalftoneDots', cat: 'image filters', colors: [['colorFront', '#2b2b2b'], ['colorBack', '#f2efe6']], params: [['size', 0, 3, 16, 6, 1], ['radius', 1, 0.2, 1.4, 0.9], ['grain', 3, 0, 1, 0.3]], speed: 0, frag: `void main(){float cs=p.x;mat2 m=rot(.785),mi=rot(-.785);vec2 g=m*(uv*R);vec2 cell=floor(g/cs);vec2 f=fract(g/cs)-.5;vec2 cu=(mi*((cell+.5)*cs))/R;vec3 s0=tex(cu);float l=dot(s0,vec3(.299,.587,.114));float r=(.18+(1.-l)*.9)*p.y*.6;float dt=1.-smoothstep(r-.07,r+.07,length(f));vec3 col=mix(c2,mix(c1,s0,.45),dt);col+=(hash(uv*R)-.5)*p.w*.12;gl_FragColor=vec4(col,1.);}` },
    { id: 'liquid-metal', comp: 'LiquidMetal', cat: 'logo animations', colors: [['colorBack', '#aaaaac'], ['colorTint', '#ffffff']], params: [['repetition', 0, 1, 10, 4], ['softness', 1, 0, 1, 0.3], ['distortion', 2, 0, 1, 0.1], ['angle', 4, 0, 360, 70, 1]], enums: [['shape', 3, ['circle', 'diamond', 'metaballs', 'daisy'], 'diamond']], speed: 1, frag: `void main(){vec2 q=asp(uv)/scl;float d=shape(q,p.w);float msk=1.-smoothstep(-.004-p.y*.03,.004+p.y*.03,d);vec2 rq=rot(p2.x*3.14159/180.)*q;float n=fbm(q*3.+t*.2)*p.z*3.;float e=clamp(-d*5.,0.,1.);float st=rq.y*p.x+n+pow(1.-e,2.)*1.2-t*.25;vec3 w=vec3(sin(st*6.283),sin((st+.025)*6.283),sin((st+.05)*6.283))*.5+.5;vec3 metal=mix(vec3(.12,.13,.15),c2,w);metal=mix(metal,c2,pow(1.-e,4.)*.6);gl_FragColor=vec4(mix(c1,metal,msk),1.);}` },
    { id: 'heatmap', comp: 'Heatmap', cat: 'logo animations', colors: [['colorBack', '#0b0d1c']], params: [['contour', 0, 0, 1, 0.5], ['noise', 2, 0, 1, 0.4], ['innerGlow', 3, 0, 1, 0.5]], speed: 1, frag: `vec3 ramp(float x){vec3 a=vec3(.05,.1,.9),b=vec3(.1,.8,.95),c=vec3(1.,.9,.2),d=vec3(1.,.4,.1),e=vec3(.95,.1,.2);if(x<.25)return mix(a,b,x*4.);if(x<.5)return mix(b,c,x*4.-1.);if(x<.75)return mix(c,d,x*4.-2.);return mix(d,e,x*4.-3.);}void main(){vec2 q=asp(uv)/scl;float d=shape(q,3.);float hh=clamp(-d*3.2*(1.+p.w)+(fbm(q*3.+t*.4)-.5)*p.y*1.2+sin(t+q.x*4.)*.06,0.,1.);hh=mix(hh,floor(hh*8.)/8.,p.x*.6);float glow=exp(-max(d,0.)*18.);vec3 col=mix(c1,ramp(.05),glow*.5);col=mix(col,ramp(hh),step(d,0.));gl_FragColor=vec4(col,1.);}` },
    { id: 'mesh-gradient', comp: 'MeshGradient', cat: 'effects', colors: [['color1', '#e0eaff'], ['color2', '#241d9a'], ['color3', '#f75092']], params: [['distortion', 0, 0, 1, 0.8], ['swirl', 1, 0, 1, 0.1]], speed: 1, frag: `void main(){vec2 q=asp(uv)/scl;q+=(vec2(fbm(q*2.+t*.1),fbm(q*2.-t*.1+4.))-.5)*p.x;float a=length(q)*p.y*4.;q=rot(a)*q;vec2 P1=vec2(sin(t*.4),cos(t*.3))*.4,P2=vec2(cos(t*.35+2.),sin(t*.45))*.42,P3=vec2(sin(t*.3+4.),cos(t*.5+1.))*.4,P4=vec2(cos(t*.25+1.),sin(t*.2+3.))*.45;float w1=1./(.02+dot(q-P1,q-P1)),w2=1./(.02+dot(q-P2,q-P2)),w3=1./(.02+dot(q-P3,q-P3)),w4=.6/(.02+dot(q-P4,q-P4));vec3 col=(c1*w1+c2*w2+c3*w3+vec3(.62,.79,.96)*w4)/(w1+w2+w3+w4);gl_FragColor=vec4(col,1.);}` },
    { id: 'grain-gradient', comp: 'GrainGradient', cat: 'effects', colors: [['colorBack', '#0a0a2e'], ['color1', '#7300ff'], ['color2', '#eba8ff']], params: [['softness', 0, 0, 1, 0.5], ['intensity', 1, 0, 1, 0.5], ['grainSize', 2, 1, 4, 1.5]], speed: 1, frag: `void main(){vec2 q=asp(uv)/scl;float n=fbm(q*2.2+vec2(t*.15,-t*.1));float g=clamp(length(q-vec2(sin(t*.3)*.2,-.2))*1.3+(n-.5)*p.x*1.4,0.,1.);vec3 col=g<.5?mix(c3,c2,g*2.):mix(c2,c1,g*2.-1.);float gr=hash(floor(uv*R/p.z)+floor(t*24.));col+=(gr-.5)*p.y*.45;gl_FragColor=vec4(col,1.);}` },
    { id: 'dot-orbit', comp: 'DotOrbit', cat: 'effects', colors: [['colorBack', '#0d0d10'], ['color1', '#ffc95c'], ['color2', '#5ca9ff']], params: [['size', 0, 6, 40, 16, 1], ['dotSize', 1, 0.2, 1.4, 0.7], ['spread', 2, 0, 1, 0.6]], speed: 1, frag: `void main(){vec2 g=uv*R/p.x;vec2 id=floor(g);vec2 f=fract(g)-.5;float hh=hash(id);float a=t*(.5+hh)+hh*6.28;vec2 o=vec2(cos(a),sin(a))*p.z*.28;float k=1.-smoothstep(p.y*.22-.03,p.y*.22+.03,length(f-o));vec3 dc=mix(c2,c3,hash(id+3.));gl_FragColor=vec4(mix(c1,dc,k),1.);}` },
    { id: 'warp', comp: 'Warp', cat: 'effects', colors: [['color1', '#121212'], ['color2', '#9470ff'], ['color3', '#ffd1e0']], params: [['proportion', 0, 0, 1, 0.45], ['softness', 1, 0, 1, 1], ['distortion', 2, 0, 1, 0.25], ['swirl', 3, 0.2, 3, 0.8]], speed: 1, frag: `void main(){vec2 q=asp(uv)*scl*2.;vec2 w=vec2(fbm(q+t*.1),fbm(q+5.2-t*.1));vec2 w2=vec2(fbm(q+4.*w+1.7+t*.05),fbm(q+4.*w+9.2));float f=fbm(q+p.z*4.*w2);float s=sin((f+p.x)*6.283*p.w*2.)*.5+.5;s=smoothstep(.5-p.y*.5-.01,.5+p.y*.5+.01,s);vec3 col=mix(c1,c2,s);col=mix(col,c3,clamp(length(w2)*.9-.5,0.,1.));gl_FragColor=vec4(col,1.);}` },
    { id: 'voronoi', comp: 'Voronoi', cat: 'effects', colors: [['colorGap', '#2e0000'], ['color1', '#ff8247'], ['color2', '#ffe53d']], params: [['count', 0, 2, 12, 5, 1], ['gap', 1, 0, 1, 0.3], ['glow', 2, 0, 1, 0.5]], speed: 1, frag: `void main(){vec2 q=asp(uv)*scl*p.x;vec2 i=floor(q),f=fract(q);float m1=8.,m2=8.,hc=0.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 b=vec2(float(x),float(y));float hh=hash(i+b);vec2 o=.5+.5*sin(t*.6+6.28*vec2(hh,hash(i+b+7.)));vec2 r=b+o-f;float d=dot(r,r);if(d<m1){m2=m1;m1=d;hc=hh;}else if(d<m2){m2=d;}}float e=sqrt(m2)-sqrt(m1);float edge=smoothstep(0.,p.y*.15+.01,e);vec3 cc=mix(c2,c3,hc);cc*=1.-sqrt(m1)*p.z*.6;gl_FragColor=vec4(mix(c1,cc,edge),1.);}` },
  ];
  const PRESETS = { 'liquid-metal': { Default: {}, Noir: { colorBack: '#0e0e10', colorTint: '#d8dbe3', repetition: 6, softness: 0.1, distortion: 0.25, angle: 20 }, Gold: { colorBack: '#f3ead7', colorTint: '#ffcc66', repetition: 3, softness: 0.5, distortion: 0.05, angle: 120 }, Wobbly: { colorBack: '#c9d4ff', colorTint: '#ffffff', repetition: 8, softness: 0.8, distortion: 0.9, angle: 300 } } };
  const DESC = { repetition: 'Density of the reflection stripes', softness: 'Edge blur of the shape mask', distortion: 'Noise strength applied to stripes', angle: 'Direction of the stripes, degrees', shape: 'Built-in mask shape', speed: 'Animation speed multiplier; 0 pauses', scale: 'Zoom of the pattern', colorBack: 'Background color', colorTint: 'Reflection tint', count: 'Number of flutes / cells', contrast: 'Luminance contrast', type: 'Bayer matrix size', pxSize: 'Dither pixel size' };
  const defs = (sh) => { const v = { speed: sh.speed, scale: 1 }; sh.colors.forEach(([k, c]) => (v[k] = c)); sh.params.forEach(([k, , , , d]) => (v[k] = d)); (sh.enums || []).forEach(([k, , , d]) => (v[k] = d)); return v; };
  const VAL = Object.fromEntries(SH.map((sh) => [sh.id, defs(sh)]));
  const tAcc = Object.fromEntries(SH.map((sh) => [sh.id, 1.5]));
  // one shared WebGL context renders every tile, then blits into each 2D tile canvas
  const glc = document.createElement('canvas'); const gl = glc.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
  const prog = {}; let glOk = !!gl; let texReady = false; const uloc = {};
  if (gl) {
    const mk = (type, src) => { const s0 = gl.createShader(type); gl.shaderSource(s0, src); gl.compileShader(s0); if (!gl.getShaderParameter(s0, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s0)); return null; } return s0; };
    const vs = mk(gl.VERTEX_SHADER, 'attribute vec2 a;varying vec2 uv;void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}');
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    for (const sh of SH) { const fs = mk(gl.FRAGMENT_SHADER, HDR + sh.frag); if (!fs) continue; const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) continue; prog[sh.id] = pr; uloc[sh.id] = Object.fromEntries(['t', 'R', 'img', 'c1', 'c2', 'c3', 'p', 'p2', 'scl'].map((n) => [n, gl.getUniformLocation(pr, n)])); const al = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0); }
    const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, photo); [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.LINEAR)); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE)); texReady = true;
  }
  const rgb = (hx) => { const n = parseInt(hx.slice(1), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
  let renders = 0;
  const render = (sh, w, hh, ctx) => {
    const v = VAL[sh.id];
    if (!glOk || !prog[sh.id]) { ctx.fillStyle = v[sh.colors[0][0]]; ctx.fillRect(0, 0, w, hh); ctx.drawImage(photo, 0, 0, w, hh); return; }
    if (glc.width !== w || glc.height !== hh) { glc.width = w; glc.height = hh; }
    const L = uloc[sh.id]; gl.useProgram(prog[sh.id]); gl.viewport(0, 0, w, hh);
    gl.uniform1f(L.t, tAcc[sh.id]); gl.uniform2f(L.R, w, hh); gl.uniform1i(L.img, 0); gl.uniform1f(L.scl, v.scale);
    const cs = sh.colors.map(([k]) => rgb(v[k])); while (cs.length < 3) cs.push([1, 1, 1]); gl.uniform3fv(L.c1, cs[0]); gl.uniform3fv(L.c2, cs[1]); gl.uniform3fv(L.c3, cs[2]);
    const P = [0, 0, 0, 0, 0, 0, 0, 0]; sh.params.forEach(([k, slot]) => (P[slot] = v[k])); (sh.enums || []).forEach(([k, slot, opts]) => (P[slot] = opts.indexOf(v[k])));
    gl.uniform4f(L.p, P[0], P[1], P[2], P[3]); gl.uniform4f(L.p2, P[4], P[5], P[6], P[7]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); ctx.drawImage(glc, 0, 0, w, hh); renders++;
  };
  // gallery
  const TW = 256, TH = 192; const tiles = [];
  const gallery = h('div', {});
  for (const cat of ['image filters', 'logo animations', 'effects']) {
    const grid = h('div.ps-grid');
    for (const sh of SH.filter((x) => x.cat === cat)) { const c = h('canvas', { width: TW, height: TH }); const el = h('a.ps-tile', { href: '#/' + sh.id, 'data-id': sh.id, 'data-live': '0' }, c, h('div', {}, sh.id.replace(/-/g, ' '))); tiles.push({ sh, c, el, ctx: c.getContext('2d'), vis: false }); grid.append(el); }
    gallery.append(h('div.ps-sec', {}, h('h2', {}, cat), grid));
  }
  const npm = 'npm i @paper-design/shaders-react';
  const home = h('div', {}, h('div.ps-hero', {}, h('h1', {}, 'paper shaders'), h('p', {}, 'ultra fast zero-dependency', h('br'), 'shaders for your designs'), h('div.ps-npm', {}, h('span', {}, npm), h('button', { title: 'copy', onclick: () => copy(npm) }, s('svg', { viewBox: '0 0 16 16', width: 14, height: 14 }, s('rect', { x: 5, y: 5, width: 8, height: 8, rx: 1.5, fill: 'none', stroke: '#555', 'stroke-width': 1.3 }), s('path', { d: 'M3 10.5V4a1 1 0 0 1 1-1h6.5', fill: 'none', stroke: '#555', 'stroke-width': 1.3 }))))), gallery);
  // detail route
  const det = h('div.ps-det', { style: { display: 'none' } }); let cur = null; let dctx = null, dcan = null; const ctrls = {};
  const codeEl = h('div.ps-code'); const preRow = h('div.ps-pre'); let jsx = '';
  const fmtV = (k, v) => (typeof v === 'string' ? `<span class="v">"${v}"</span>` : `{<span class="v">${+(+v).toFixed(2)}</span>}`);
  const syncCode = () => { if (!cur) return; const v = VAL[cur.id]; const keys = [...cur.colors.map(([k]) => k), ...cur.params.map(([k]) => k), ...(cur.enums || []).map(([k]) => k), 'speed', 'scale']; jsx = `import { ${cur.comp} } from '@paper-design/shaders-react';\n\n<${cur.comp}\n  width={1280}\n  height={720}\n${keys.map((k) => `  ${k}=${typeof v[k] === 'string' ? `"${v[k]}"` : `{${+(+v[k]).toFixed(2)}}`}`).join('\n')}\n/>`; codeEl.innerHTML = `<span class="k">import</span> { <span class="c">${cur.comp}</span> } <span class="k">from</span> <span class="v">'@paper-design/shaders-react'</span>;\n\n&lt;<span class="c">${cur.comp}</span>\n  <span class="a">width</span>={<span class="v">1280</span>}\n  <span class="a">height</span>={<span class="v">720</span>}\n${keys.map((k) => `  <span class="a">${k}</span>=${fmtV(k, v[k])}`).join('\n')}\n/&gt;`; codeEl.append(h('button', { onclick: () => copy(jsx, 'Code copied') }, 'Copy code')); };
  const syncCtrls = () => { if (!cur) return; const v = VAL[cur.id]; for (const [k, c] of Object.entries(ctrls)) c.set(v[k]); syncCode(); };
  const lvRow = (label, ctl) => h('div.lv-r', {}, h('label', { title: label }, label), h('div.lv-c', {}, ctl));
  const mkSlider = (sh, k, mn, mx, st) => { const v = VAL[sh.id]; const r = h('input', { type: 'range', min: mn, max: mx, step: st, value: v[k] }); const n = h('input.lv-n', { value: v[k] }); const on = (x) => { v[k] = clamp(+x, mn, mx); r.value = v[k]; n.value = +(+v[k]).toFixed(2); syncCode(); }; r.oninput = () => on(r.value); n.onchange = () => on(n.value); ctrls[k] = { set: (x) => { r.value = x; n.value = +(+x).toFixed(2); }, input: r }; return [r, n]; };
  const mkColor = (sh, k) => { const v = VAL[sh.id]; const ci = h('input', { type: 'color', value: v[k] }); const sw = h('div.lv-sw', { style: { background: v[k] } }, ci); const hx = h('div.lv-hex', {}, v[k]); ci.oninput = () => { v[k] = ci.value; sw.style.background = ci.value; hx.textContent = ci.value; syncCode(); }; ctrls[k] = { set: (x) => { ci.value = x; sw.style.background = x; hx.textContent = x; }, input: ci }; return [sw, hx]; };
  const mkEnum = (sh, k, opts) => { const v = VAL[sh.id]; const se = h('select', {}, ...opts.map((o) => h('option', { value: o, selected: o === v[k] }, o))); se.onchange = () => { v[k] = se.value; syncCode(); }; ctrls[k] = { set: (x) => (se.value = x), input: se }; return [se]; };
  const lerpHex = (a, b, k) => { const A = rgb(a), B = rgb(b); return '#' + A.map((x, i) => Math.round((x + (B[i] - x) * k) * 255).toString(16).padStart(2, '0')).join(''); };
  let tweening = null;
  const applyPreset = (name) => { const target = { ...defs(cur), ...(PRESETS[cur.id]?.[name] || {}) }; const v = VAL[cur.id]; const from = { ...v }; const t0 = performance.now(); preRow.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.p === name)); tweening = name;
    const step = (now) => { const k = Math.min(1, (now - t0) / 450), e = 1 - (1 - k) ** 3; for (const key of Object.keys(target)) { if (typeof target[key] === 'number') v[key] = from[key] + (target[key] - from[key]) * e; else if (/^#/.test(target[key])) v[key] = lerpHex(from[key], target[key], e); else if (k >= 1) v[key] = target[key]; } syncCtrls(); if (k < 1) requestAnimationFrame(step); else tweening = null; }; requestAnimationFrame(step); };
  const openDetail = (id) => { const sh = SH.find((x) => x.id === id); if (!sh) return showHome(); cur = sh; for (const k in ctrls) delete ctrls[k];
    dcan = h('canvas'); dctx = dcan.getContext('2d');
    const body = h('div.lv-b', {}, ...sh.colors.map(([k]) => lvRow(k, mkColor(sh, k))), ...sh.params.map(([k, , mn, mx, , st]) => lvRow(k, mkSlider(sh, k, mn, mx, st || 0.01))), ...(sh.enums || []).map(([k, , opts]) => lvRow(k, mkEnum(sh, k, opts))), lvRow('speed', mkSlider(sh, 'speed', 0, 3, 0.05)), lvRow('scale', mkSlider(sh, 'scale', 0.3, 2.5, 0.01)));
    const lv = h('div.lv', {}, h('div.lv-t', {}, '• • • • •'), body);
    { const tb = lv.firstChild; let sx, sy, ox, oy; tb.onpointerdown = (e) => { sx = e.clientX; sy = e.clientY; const r = lv.getBoundingClientRect(), pr = lv.parentElement.getBoundingClientRect(); ox = r.left - pr.left; oy = r.top - pr.top; tb.setPointerCapture(e.pointerId); }; tb.onpointermove = (e) => { if (sx == null) return; lv.style.left = ox + e.clientX - sx + 'px'; lv.style.top = oy + e.clientY - sy + 'px'; lv.style.right = 'auto'; }; tb.onpointerup = () => (sx = null); }
    const pres = PRESETS[sh.id] || { Default: {}, Calm: { speed: 0.4, scale: 1.3 }, Busy: { speed: 2, scale: 0.7 } };
    preRow.replaceChildren(h('span', { style: { alignSelf: 'center', fontSize: '12.5px', color: '#777', marginRight: '4px' } }, 'Presets'), ...Object.keys(pres).map((n) => h('button', { 'data-p': n, onclick: () => applyPreset(n) }, h('i', { style: { background: (pres[n].colorTint || pres[n].colorBack || (n === 'Default' ? VAL[sh.id][sh.colors[0][0]] : '#999')) } }), n)));
    if (!PRESETS[sh.id]) PRESETS[sh.id] = pres;
    const allK = [...sh.colors.map(([k]) => [k, 'string']), ...sh.params.map(([k]) => [k, 'number']), ...(sh.enums || []).map(([k, , o]) => [k, o.map((x) => `'${x}'`).join(' | ')]), ['speed', 'number'], ['scale', 'number']];
    det.replaceChildren(h('a.ps-back', { href: '#/' }, '← all shaders'), h('h1', {}, sh.id.replace(/-/g, ' ')), h('div.ps-stage', {}, dcan, lv), preRow, codeEl, h('table.ps-props', {}, h('tr', {}, h('th', {}, 'Name'), h('th', {}, 'Description'), h('th', {}, 'Type')), ...allK.map(([k, ty]) => h('tr', {}, h('td', {}, k), h('td', {}, DESC[k] || '—'), h('td', {}, ty)))));
    home.style.display = 'none'; det.style.display = 'block'; root.scrollTop = 0; syncCode(); };
  const showHome = () => { cur = null; det.style.display = 'none'; home.style.display = 'block'; };
  const route = () => { const m = location.hash.match(/^#\/([\w-]+)/); if (m) openDetail(m[1]); else showHome(); };
  window.addEventListener('hashchange', route);
  const nav = h('div.ps-nav', {}, h('a.ps-logo', { href: '#/' }, h('i'), 'Paper'), h('a', { href: '#', title: 'GitHub', onclick: (e) => { e.preventDefault(); toast('github.com/paper-design/shaders'); } }, s('svg', { viewBox: '0 0 24 24', width: 22, height: 22 }, s('path', { fill: '#111', d: 'M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.770 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.680 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z' }))));
  root.append(h('div.ps', {}, nav, home, det));
  // static first frame for every tile (the "fallback image"), then visibility-gated animation
  tiles.forEach((tl) => render(tl.sh, TW, TH, tl.ctx));
  const io = new IntersectionObserver((es) => es.forEach((e) => { const tl = tiles.find((x) => x.el === e.target); tl.vis = e.isIntersecting; tl.el.dataset.live = e.isIntersecting ? '1' : '0'; }), { root, threshold: 0.05 });
  tiles.forEach((tl) => io.observe(tl.el));
  let last = performance.now(), frame = 0;
  const loop = (now) => { const dt = Math.min(0.05, (now - last) / 1000); last = now; frame++;
    if (cur) { const v = VAL[cur.id]; tAcc[cur.id] += dt * v.speed; const r = dcan.getBoundingClientRect(); const w = Math.min(960, Math.round(r.width)), hh = Math.round(w * (r.height / Math.max(1, r.width))); if (w > 0) { if (dcan.width !== w) { dcan.width = w; dcan.height = hh; } render(cur, w, hh, dctx); } }
    else if (frame % 2 === 0) for (const tl of tiles) { if (!tl.vis) continue; tAcc[tl.sh.id] += dt * 2 * (VAL[tl.sh.id].speed || 0); if (VAL[tl.sh.id].speed > 0 || frame % 30 === 0) render(tl.sh, TW, TH, tl.ctx); }
    requestAnimationFrame(loop); };
  requestAnimationFrame(loop); route();
  window.__demoProof = async () => { const out = [`webgl=${glOk}, programs=${Object.keys(prog).length}/${SH.length}`]; const hash0 = location.hash; out.push(`live tiles=${tiles.filter((t) => t.el.dataset.live === '1').length}/${tiles.length}`);
    location.hash = '#/liquid-metal'; route(); await sleep(60); out.push(`detail=${cur?.id}`); const save = { ...VAL['liquid-metal'] }; ctrls.repetition.input.value = 7; ctrls.repetition.input.dispatchEvent(new Event('input')); out.push(`code has repetition={7}: ${jsx.includes('repetition={7}')}`);
    ctrls.shape.input.value = 'metaballs'; ctrls.shape.input.dispatchEvent(new Event('change')); out.push(`shape→${jsx.match(/shape="(\w+)"/)?.[1]}`);
    applyPreset('Noir'); await sleep(550); out.push(`preset Noir tweened colorBack=${VAL['liquid-metal'].colorBack}`); const r0 = renders; await sleep(120); out.push(`frames rendered=${renders - r0 > 0}`);
    Object.assign(VAL['liquid-metal'], save); syncCtrls(); history.replaceState(null, '', location.pathname + hash0); route(); root.scrollTop = 0; return out.join('; ') + '; restored'; };
};
V['granola-notes-enhance-toggle-hero'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#1f1f1c', ac: '#b9d43a', dark: false }); scroll(root);
  const F = "'Inter Variable',system-ui,sans-serif", SF = "'Fraunces Variable',Georgia,serif";
  root.append(h('style', {}, `.gr{font:400 15px/1.45 ${F};color:#232320;background:#fff;min-height:100%;overflow-x:hidden}.gr a{color:inherit;text-decoration:none}.gr button{font-family:${F};cursor:pointer}
.gr-nav{display:flex;align-items:center;padding:12px 86px;gap:20px;position:sticky;top:0;z-index:20;background:#ffffffe8;backdrop-filter:blur(8px)}.gr-logo{display:flex;align-items:center;gap:6px;font:700 17px ${F};letter-spacing:-.03em}.gr-links{flex:1;display:flex;justify-content:center;gap:19px;font-size:12px;color:#3b3b37}.gr-pill{border:1px solid #dcdcd5;background:#fff;border-radius:999px;padding:7px 11px;font-size:12px}.gr-dl{border:0;background:#f0f0ea;border-radius:999px;padding:8px 14px;font-size:12px;display:flex;gap:6px;align-items:center}
.gr-hero{position:relative;display:grid;grid-template-columns:470px 1fr;min-height:560px;padding:0 0 0 86px}.gr-copy{padding-top:82px;position:relative;z-index:3}.gr-new{display:inline-flex;align-items:center;gap:8px;background:#f2f2ec;border-radius:999px;padding:4px 10px 4px 4px;font-size:10.5px;font-weight:500}.gr-new b{background:#c6dc3b;border-radius:999px;padding:2px 7px;font-weight:600;font-size:9.5px}.gr-copy h1{font:400 64px/0.92 ${SF};letter-spacing:-.02em;margin:22px 0 22px;font-variation-settings:'SOFT' 0,'WONK' 0,'opsz' 144;color:#232320}.gr-copy p{font-size:15.5px;line-height:1.35;margin:0 0 22px;color:#2a2a26}.gr-cta{display:flex;gap:10px;align-items:center}.gr-cta button{border:0;border-radius:999px;padding:12px 20px;font-weight:600;font-size:13.5px}.gr-cta .g{background:#b9d43a;color:#1c1f08}.gr-cta .o{background:#fff;border:1px solid #d8d8d0}.gr-free{font-size:11px;color:#7a7a72;margin-top:12px}
.gr-art{position:relative;height:560px}.gr-lime{position:absolute;left:0;top:70px;width:160px;height:370px;background:#c3d93a;background-image:repeating-linear-gradient(115deg,#0000 0 22px,#ffffff22 22px 23px)}.gr-paint{position:absolute;left:130px;top:6px;right:0;height:520px;background:#141626}.gr-paint canvas{width:100%;height:100%;display:block}
.gr-pad{position:absolute;left:66px;top:28px;width:328px;height:468px;background:#f6f6f1;border:1px solid #e3e3db;border-radius:12px;box-shadow:0 20px 50px #0002,0 2px 6px #0001;padding:14px 14px 0;display:flex;flex-direction:column;z-index:4}.gr-tl{display:flex;gap:6px}.gr-tl i{width:8px;height:8px;border-radius:50%;background:#ff5f57}.gr-tl i:nth-child(2){background:#febc2e}.gr-tl i:nth-child(3){background:#28c840}.gr-pad h3{font:400 19px ${SF};margin:24px 6px 10px;font-variation-settings:'SOFT' 0,'WONK' 0}.gr-chips{display:flex;gap:6px;margin:0 3px 10px}.gr-chips span{border:1px solid #deded6;border-radius:999px;padding:3px 8px;font-size:9.5px;display:flex;gap:5px;align-items:center;background:#fafaf6}
.gr-st{height:22px;margin:0 -2px 8px;display:flex;align-items:center;gap:7px;border:1px solid #e1e1d9;background:#fff;border-radius:999px;padding:0 10px;font-size:9.5px;color:#55554d;box-shadow:0 1px 3px #0000000a;transition:opacity .3s}.gr-st .sp{width:9px;height:9px;border:1.6px solid #6c8f1b;border-right-color:transparent;border-radius:50%;animation:grsp .8s linear infinite}@keyframes grsp{to{transform:rotate(360deg)}}.gr-st .wv{display:flex;gap:1.5px;align-items:center;height:10px}.gr-st .wv i{width:2px;background:#6c8f1b;border-radius:2px;animation:grwv .9s ease-in-out infinite}@keyframes grwv{0%,100%{height:2px}50%{height:10px}}.gr-st.tr{animation:grpl 1.6s ease-in-out infinite}@keyframes grpl{50%{box-shadow:0 0 0 4px #b9d43a33}}
.gr-st.en span{background:linear-gradient(90deg,#55554d 30%,#c9c9bf 50%,#55554d 70%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:grsh 1.2s linear infinite}@keyframes grsh{from{background-position:100% 0}to{background-position:-100% 0}}
.gr-body{flex:1;overflow:hidden;padding:2px 6px;font-size:9.5px;line-height:1.55;position:relative}.gr-body .u{color:#232320}.gr-body .ai{color:#8b8b82}.gr-body h5{font:600 10.5px ${F};margin:9px 0 3px;color:#232320}.gr-body li{margin:0 0 2px 12px;list-style:disc}.gr-body ul{margin:0;padding:0}.gr-body .ln{margin:0 0 9px}.gr-body .cur:after{content:'|';color:#6c8f1b;animation:grbl 1s steps(1) infinite}@keyframes grbl{50%{opacity:0}}.gr-body .ns li{list-style:none;margin-left:0}.gr-body .ns li:before{content:'☐ ';color:#8b8b82}.gr-body .ow{color:#6c8f1b;font-weight:600}
.gr-body .rv{opacity:0;transform:translateY(4px);transition:opacity .35s,transform .35s}.gr-body .rv.on{opacity:1;transform:none}
.gr-bar{display:flex;align-items:center;gap:8px;padding:10px 0 12px;border-top:1px solid #ebebe3;margin:0 -2px}.gr-tg{display:flex;background:#ebebe4;border-radius:999px;padding:2px}.gr-tg button{border:0;background:none;border-radius:999px;padding:4px 9px;font-size:9.5px;color:#66665e}.gr-tg button.on{background:#fff;color:#232320;box-shadow:0 1px 3px #0002}.gr-ask{flex:1;border:1px solid #e1e1d9;border-radius:999px;padding:5px 10px;font-size:9.5px;color:#9a9a90;background:#fff}
.gr-call{position:absolute;right:26px;bottom:20px;width:92px;background:#1d1d1d;border-radius:10px;padding:3px;z-index:5;box-shadow:0 10px 30px #0004}.gr-call div{height:86px;border-radius:7px;margin-bottom:3px;position:relative;overflow:hidden}.gr-call div:after{content:'';position:absolute;left:50%;top:22%;width:30px;height:30px;margin-left:-15px;border-radius:50%;background:#e9c8ad;box-shadow:0 34px 0 14px #6b7f95}.gr-call div.b:after{background:#d9b08f;box-shadow:0 34px 0 14px #3f4b3b}.gr-call nav{display:flex;justify-content:center;gap:5px;padding:3px}.gr-call nav i{width:14px;height:8px;border-radius:4px;background:#444}.gr-call nav i:last-child{background:#ff3b30}
.gr-logos{display:flex;justify-content:center;gap:52px;padding:30px 0 60px;color:#9a9a92;font:600 17px ${F};letter-spacing:-.02em;border-bottom:1px solid #efefe8;margin:0 86px}
.gr-sec{padding:70px 86px}.gr-sec h2{font:400 44px/1 ${SF};margin:0 0 10px;letter-spacing:-.02em;font-variation-settings:'SOFT' 0,'WONK' 0}.gr-sec>p{color:#66665e;margin:0 0 26px}.gr-tabs{display:flex;gap:6px;margin-bottom:24px}.gr-tabs button{border:1px solid #dcdcd5;background:#fff;border-radius:999px;padding:8px 16px;font-size:13px}.gr-tabs button.on{background:#232320;color:#fff;border-color:#232320}.gr-split{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}.gr-split h4{font:400 26px ${SF};margin:0 0 10px}.gr-split p{color:#55554d;margin:0}.gr-stage{position:relative;height:500px;background:#eef3d4;border-radius:16px;overflow:hidden}.gr-stage .gr-pad{left:50%;margin-left:-164px;top:16px}
.gr-brief{background:#fff;border:1px solid #e1e1d9;border-radius:10px;padding:10px;margin:4px 0 10px;font-size:9.5px}.gr-brief b{display:block;font-size:10.5px;margin-bottom:4px}.gr-ans{background:#fff;border:1px solid #e1e1d9;border-radius:10px;padding:9px;font-size:9.5px;margin-top:8px}
.gr-in{opacity:0;transform:translateY(24px);transition:opacity .7s,transform .7s}.gr-in.vis{opacity:1;transform:none}.gr-foot{padding:40px 86px;color:#8a8a82;font-size:12px;display:flex;gap:24px;border-top:1px solid #efefe8}`));
  const logo = () => h('a.gr-logo', { href: '#' }, s('svg', { viewBox: '0 0 24 24', width: 19, height: 19 }, s('path', { d: 'M12 3a9 9 0 1 0 9 9 7 7 0 0 0-7-7 5 5 0 0 0-5 5 3 3 0 0 0 3 3 1.5 1.5 0 0 0 1.5-1.5', fill: 'none', stroke: '#232320', 'stroke-width': 2.3, 'stroke-linecap': 'round' })), 'granola');
  const RAW = ['Deal stalls - sales input', 'Q3 messaging rollout, are teams ready??', 'pricing pg v2 → legal', 'maya owns sec FAQ'];
  const ENH = [['h', 'Pipeline & deal stalls'], ['u', 'Deal stalls - sales input'], ['ai', 'Three enterprise deals are waiting on security review; sales wants a shared FAQ'], ['h', 'Q3 messaging rollout'], ['u', 'are teams ready??'], ['ai', 'Marketing is ready for launch; CS asked for an enablement deck first'], ['ai', 'Pricing page v2 goes to legal before the announcement'], ['h', 'Next steps'], ['ns', 'Maya', 'Draft the security FAQ for sales'], ['ns', 'Tom', 'Book CS enablement session'], ['ns', 'Priya', 'Send pricing page v2 to legal']];
  // reusable notepad mock
  const mkPad = (title = 'Q3 GTM sync') => {
    const st = h('div.gr-st', {}); const body = h('div.gr-body'); const tg = h('div.gr-tg'); const ask = h('div.gr-ask', {}, 'Ask anything');
    const pad = h('div.gr-pad', {}, h('div.gr-tl', {}, h('i'), h('i'), h('i')), h('h3', {}, title), h('div.gr-chips', {}, h('span', {}, '📅', 'Today'), h('span', {}, '👥', '4'), h('span', {}, '📁')), st, body, h('div.gr-bar', {}, tg, ask));
    const P = { el: pad, view: 'mine', typed: RAW.length, busy: false, run: 0 };
    const setStatus = (kind) => { st.className = 'gr-st' + (kind ? ' ' + kind : ''); st.style.opacity = kind ? 1 : 0; st.replaceChildren(...(kind === 'tr' ? [h('div.wv', {}, ...[0, 1, 2, 3].map((i) => h('i', { style: { animationDelay: i * 0.12 + 's' } }))), h('span', {}, 'Transcribing')] : kind === 'en' ? [h('div.sp'), h('span', {}, 'Enhancing notes')] : [])); };
    const drawTg = () => tg.replaceChildren(...[['mine', 'My notes'], ['enh', 'Enhanced']].map(([k, l]) => h('button', { class: P.view === k ? 'on' : '', onclick: () => setView(k) }, l)));
    const rawView = (n, partial) => RAW.slice(0, n).map((l, i) => h('div.ln.u' + (i === n - 1 && partial != null ? '.cur' : ''), {}, i === n - 1 && partial != null ? l.slice(0, partial) : l));
    const enhView = () => { const out = []; let ul = null; for (const e of ENH) { if (e[0] === 'h') { out.push(h('h5.rv', {}, e[1])); ul = null; continue; } if (!ul) { ul = h('ul.rv' + (e[0] === 'ns' ? '.ns' : '')); out.push(ul); } ul.append(e[0] === 'ns' ? h('li.ai', {}, h('span.ow', {}, e[1] + ' '), e[2]) : h('li.' + e[0], {}, e[1])); } return out; };
    const setView = async (k, anim = true) => { P.view = k; drawTg(); if (k === 'mine') { P.run++; P.typed = RAW.length; body.replaceChildren(...rawView(RAW.length)); setStatus(null); return; } const run = ++P.run; if (anim) { setStatus('en'); body.style.opacity = 0.45; await sleep(1100); if (run !== P.run) return; body.style.opacity = 1; } setStatus(null); const els = enhView(); body.replaceChildren(...els); [...body.querySelectorAll('.rv')].forEach((e, i) => setTimeout(() => e.classList.add('on'), anim ? 80 + i * 110 : 0)); };
    const typeDemo = async (stay) => { const run = ++P.run; P.view = 'mine'; drawTg(); setStatus('tr'); for (let n = 1; n <= RAW.length; n++) { for (let c = 0; c <= RAW[n - 1].length; c++) { if (run !== P.run) return; P.typed = n; body.replaceChildren(...rawView(n, c)); await sleep(38); } await sleep(260); } body.replaceChildren(...rawView(RAW.length)); if (stay) { setStatus('tr'); return; } await sleep(500); if (run !== P.run) return; await setView('enh'); };
    drawTg(); body.replaceChildren(...rawView(RAW.length)); setStatus(null);
    Object.assign(P, { setView, typeDemo, setStatus, body, ask, st }); return P;
  };
  // painting backdrop
  const pc = h('canvas', { width: 520, height: 520 });
  { const g = pc.getContext('2d'); const r = rng(5); g.fillStyle = '#121527'; g.fillRect(0, 0, 520, 520); for (let i = 0; i < 260; i++) { const x = 260 + (r() - 0.5) * 520, y = 300 + (r() - 0.5) * 400, a = r() * Math.PI * 2, L = 30 + r() * 120; g.strokeStyle = pick(['#ff6b3d', '#ffb347', '#4cc9f0', '#f72585', '#7209b7', '#e9ecef', '#3a86ff', '#ffd166'], r) + 'cc'; g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * L * 0.5 + 20, y + Math.sin(a) * L * 0.5, x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } }
  const hero = mkPad();
  const call = h('div.gr-call', {}, h('div', { style: { background: '#c9cfd6' } }), h('div.b', { style: { background: '#b8b2a6' } }), h('nav', {}, h('i'), h('i'), h('i')));
  const art = h('div.gr-art', {}, h('div.gr-lime'), h('div.gr-paint', {}, pc), hero.el, call);
  const nav = h('div.gr-nav', {}, logo(), h('div.gr-links', {}, ...['Features', 'Enterprise', 'Pricing', 'Blog', 'Careers'].map((l) => h('a', { href: '#', onclick: (e) => e.preventDefault() }, l))), h('button.gr-pill', { onclick: () => toast('Talk to sales (demo)') }, 'Talk to sales'), h('button.gr-dl', { onclick: () => toast('Download (demo)') }, '', 'Download'));
  const copyEl = h('div.gr-copy', {}, h('a.gr-new', { href: '#' }, h('b', {}, 'New'), 'Granola for Apple Watch', h('span', {}, '→')), h('h1', {}, 'The AI notepad for back-to-back meetings'), h('p', {}, 'Notes, actions and memory.', h('br'), 'Without a meeting bot.'), h('div.gr-cta', {}, h('button.g', { onclick: () => hero.typeDemo() }, 'Download now'), h('button.o', { onclick: () => hero.typeDemo() }, '▶ Replay demo')), h('div.gr-free', {}, 'Free to get started · Mac, Windows & iPhone'));
  const heroEl = h('div.gr-hero', {}, copyEl, art);
  const logos = h('div.gr-logos.gr-in', {}, ...['Northwind', 'Acme Co', 'Globex', 'Initech', 'Hooli', 'Vandelay'].map((l) => h('span', {}, l)));
  // Before / During / After
  const tabsPad = mkPad('Weekly sync w/ Maya');
  const TABS = { Before: ['Walk in prepared', 'A brief of who you are meeting and what happened last time, ready before the call starts.'], During: ['Type your own notes', 'Jot what matters. Granola transcribes the computer audio in the background — no bot joins.'], After: ['Get enhanced notes', 'Your notes become structured notes with next steps. Ask anything about the meeting.'] };
  let tabK = 'During'; const tabRow = h('div.gr-tabs'); const tabTxt = h('div');
  const setTab = async (k) => { tabK = k; tabRow.replaceChildren(...Object.keys(TABS).map((n) => h('button', { class: n === k ? 'on' : '', onclick: () => setTab(n) }, n))); tabTxt.replaceChildren(h('h4', {}, TABS[k][0]), h('p', {}, TABS[k][1])); tabsPad.run++;
    if (k === 'Before') { tabsPad.setStatus(null); tabsPad.body.replaceChildren(h('div.gr-brief', {}, h('b', {}, 'Coming up in 5 min'), h('div.ai', {}, 'Maya Chen · Head of Sales'), h('div.ai', { style: { marginTop: '6px' } }, 'Last time: agreed to trial the new lead-routing rules; Maya to report back on win rate.')), h('div.gr-brief', {}, h('b', {}, 'Open items'), h('div.ai', {}, '☐ Security FAQ draft'), h('div.ai', {}, '☐ Q3 rollout readiness'))); tabsPad.ask.textContent = 'Ask anything'; }
    else if (k === 'During') { tabsPad.ask.textContent = 'Ask anything'; tabsPad.typeDemo(true); }
    else { await tabsPad.setView('enh'); if (tabK !== 'After') return; tabsPad.ask.textContent = 'What did we decide on pricing?'; tabsPad.body.append(h('div.gr-ans', {}, h('b', {}, 'Pricing page v2 '), 'goes to legal before the announcement — Priya owns it.')); } };
  const sec = h('div.gr-sec.gr-in', {}, h('h2', {}, 'Built for the whole meeting'), h('p', {}, 'Before, during and after — the same notepad.'), tabRow, h('div.gr-split', {}, tabTxt, h('div.gr-stage', {}, tabsPad.el)));
  const sec2 = h('div.gr-sec.gr-in', { style: { background: '#f7f7f2' } }, h('h2', {}, 'No bots in your calls'), h('p', {}, 'Granola listens to your computer audio directly. Nobody gets an awkward meeting-bot invite.'));
  root.append(h('div.gr', {}, nav, heroEl, logos, sec, sec2, h('div.gr-foot', {}, logo(), h('span', {}, 'Privacy'), h('span', {}, 'Terms'), h('span', {}, 'Security'))));
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('vis')), { root, threshold: 0.12 });
  root.querySelectorAll('.gr-in').forEach((e) => io.observe(e));
  setTab('During'); hero.typeDemo();
  window.__demoProof = async () => { const out = []; hero.run++; await hero.setView('enh', false); out.push(`enhanced: headings=${hero.body.querySelectorAll('h5').length}, user lines=${hero.body.querySelectorAll('.u').length}, ai lines=${hero.body.querySelectorAll('.ai').length}`); await hero.setView('mine'); out.push(`my notes lines=${hero.body.querySelectorAll('.ln').length}`); const pr = hero.setView('enh'); await sleep(50); out.push(`status pill="${hero.st.textContent}"`); await pr; await setTab('After'); out.push(`After ask="${tabsPad.ask.textContent}" answer=${!!tabsPad.body.querySelector('.gr-ans')}`); await setTab('Before'); out.push(`Before brief cards=${tabsPad.body.querySelectorAll('.gr-brief').length}`); setTab('During'); hero.run++; await hero.setView('mine', false); root.scrollTop = 0; return out.join('; ') + '; restored'; };
};
V['playdate-yellow-handheld-spoiler-reveal'] = (root, T) => {
  theme(root, T, { bg: '#7b7f87', fg: '#ffffff', ac: '#ffc500', dark: true }); scroll(root);
  const F = "'Inter Variable',system-ui,sans-serif"; const Y = '#ffc500', INK = '#1a1a18', LCD0 = '#b5b2a9', LCD1 = '#2f2d27';
  root.append(h('style', {}, `.pd{font:500 16px/1.4 ${F};color:#fff;min-height:100%;background:radial-gradient(ellipse at 50% 30%,#a7aab0 0,#81858c 40%,#6f737a 75%) 0 0/100% 1000px no-repeat,#6f737a}.pd a{color:inherit;text-decoration:none}.pd button{font-family:${F};cursor:pointer}
.pd-nav{display:flex;align-items:center;padding:6px 56px;gap:14px;position:sticky;top:0;z-index:30}.pd-logo{font:800 24px ${F};letter-spacing:-.045em;flex:1}.pd-nav a.l{display:flex;gap:4px;align-items:center;font:700 14px ${F};letter-spacing:-.01em}.pd-shop{background:#7d2cf6;border:0;color:#fff;border-radius:999px;padding:5px 12px;font:700 14px ${F}}
.pd-hero{position:relative;height:720px}.pd-dev{position:absolute;left:50%;top:115px;margin-left:-200px;width:396px;height:410px;border-radius:24px;background:linear-gradient(160deg,#ffd43a,${Y} 40%,#f2b400);box-shadow:inset 0 -6px 0 #e3a900,inset 0 2px 0 #ffe27a,0 30px 60px #0004}.pd-bez{position:absolute;left:6px;top:6px;width:346px;height:222px;background:#1d1d1b;border-radius:14px;padding:16px 18px}.pd-bez canvas{width:100%;height:100%;image-rendering:pixelated;display:block;border-radius:2px}
.pd-dpad{position:absolute;left:38px;top:262px;width:106px;height:106px}.pd-dpad:before,.pd-dpad:after{content:'';position:absolute;background:linear-gradient(160deg,#ffd43a,#f0b000);border-radius:9px;box-shadow:0 4px 0 #d79e00,0 6px 10px #0003}.pd-dpad:before{left:36px;top:0;width:34px;height:106px}.pd-dpad:after{left:0;top:36px;width:106px;height:34px}.pd-btn{position:absolute;width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#ffe06a,#f2b400);box-shadow:0 4px 0 #d79e00,0 6px 10px #0003;color:#fff8;display:grid;place-items:center;font:800 16px ${F};border:2px solid #ffd85a;cursor:pointer}.pd-btn:active{transform:translateY(3px);box-shadow:0 1px 0 #d79e00}.pd-scr{position:absolute;width:20px;height:20px;border-radius:50%;background:radial-gradient(#bbb 20%,#555 30%,#2a2a2a 60%)}.pd-spk{position:absolute;right:16px;top:90px;width:9px;height:50px;border-radius:5px;background:repeating-linear-gradient(#333 0 3px,#888 3px 5px)}.pd-mb{position:absolute;right:12px;top:12px;width:24px;height:24px;border-radius:50%;background:radial-gradient(#ddd,#666 70%)}.pd-mb2{position:absolute;right:12px;top:46px;width:24px;height:24px;border-radius:50%;background:radial-gradient(#fff4b0,#e2a800 70%)}
.pd-crk{position:absolute;right:-30px;top:186px;width:30px;height:150px}.pd-crk .dock{position:absolute;left:0;top:0;width:16px;height:150px;border-radius:0 8px 8px 0;background:linear-gradient(90deg,#c4c4c4,#7a7a7a);box-shadow:inset -2px 0 0 #555}.pd-crk .arm{position:absolute;left:6px;top:20px;width:24px;height:96px;transform-origin:10px 10px;cursor:grab}.pd-stick{position:absolute;left:132px;top:96px;transform:rotate(-12deg);background:#111;color:#fff;border:4px solid #fff;border-radius:12px;padding:8px 14px 6px;font:800 26px/1 ${F};letter-spacing:-.03em;box-shadow:0 10px 24px #0005}.pd-stick b{color:${Y};font-size:58px;vertical-align:-10px;margin-left:4px}.pd-stick div{background:#fff;color:#111;margin:4px -10px -2px;padding:3px 6px;font-size:18px;border-radius:4px;text-align:center}
.pd-h1{position:absolute;left:0;right:0;top:560px;text-align:center;font:800 40px/1.12 ${F};letter-spacing:-.03em;padding:0 150px}.pd-h1 span{transition:color .3s;color:#c3c6cb}.pd-h1 span.on{color:#fff}
.pd-ch{background:${Y};color:${INK};padding:90px 120px;position:relative}.pd-ch:nth-of-type(even){background:#ffd23f}.pd-ch h2{font:800 76px/0.95 ${F};letter-spacing:-.05em;margin:0 0 20px}.pd-ch p{font:600 20px/1.4 ${F};max-width:640px;margin:0 0 14px}.pd-row{display:grid;grid-template-columns:1fr 360px;gap:60px;align-items:center}.pd-lcd{width:360px;height:216px;background:#1d1d1b;border-radius:14px;padding:12px}.pd-lcd canvas{width:100%;height:100%;image-rendering:pixelated;display:block}.pd-deg{font:700 14px 'JetBrains Mono Variable',monospace;margin-top:10px;text-align:center}
.pd-bigcrank{width:360px;height:220px;touch-action:none;cursor:grab;display:block;margin-top:16px}.pd-games{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-top:26px;transition:filter .5s,max-height .7s;overflow:hidden}.pd-games.hide{filter:blur(14px) grayscale(1);max-height:180px;pointer-events:none}.pd-games:not(.hide){max-height:1400px}.pd-g{position:relative;border-radius:8px;overflow:hidden;background:${INK};aspect-ratio:1}.pd-g canvas{width:100%;height:100%;image-rendering:pixelated;display:block}.pd-g .ov{position:absolute;inset:0;background:#000c;color:#fff;padding:10px;display:flex;flex-direction:column;justify-content:flex-end;opacity:0;transition:opacity .2s;font-size:12px}.pd-g .ov b{font-size:14px}.pd-g:hover .ov,.pd-g.hv .ov{opacity:1}.pd-show{background:${INK};color:${Y};border:0;border-radius:999px;padding:16px 28px;font:800 20px ${F};letter-spacing:-.02em}
.pd-price{position:sticky;bottom:18px;z-index:25;display:flex;align-items:flex-start;justify-content:flex-end;padding:0 24px;pointer-events:none;height:0;overflow:visible}.pd-price>div{pointer-events:auto;transform:translateY(-100%);background:#fff;color:${INK};border-radius:18px;padding:14px 16px;display:flex;align-items:center;gap:14px;box-shadow:0 12px 40px #0004}.pd-price b{font:800 26px ${F};letter-spacing:-.03em}.pd-price small{display:block;font-size:12px;color:#555;font-weight:600}.pd-price button{background:#7d2cf6;color:#fff;border:0;border-radius:999px;padding:10px 16px;font:800 15px ${F}}
.pd-foot{background:${INK};color:#ddd;padding:50px 120px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px;font-size:14px}.pd-foot h6{color:${Y};font:800 14px ${F};margin:0 0 10px}.pd-foot a{display:block;margin:4px 0;color:#bbb}`));
  // 1-bit LCD renderer (400x240 native) with ordered dithering
  const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const lcd = (cv, scene) => { const W = cv.width, H = cv.height, g = cv.getContext('2d'); const id = g.createImageData(W, H); const L0 = [181, 178, 169], L1 = [47, 45, 39];
    return (t, a) => { const d = id.data; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const v = scene(x / W, y / H, t, a); const on = v * 16 > B4[(y & 3) * 4 + (x & 3)] + 0.5; const c = on ? L0 : L1, i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; } g.putImageData(id, 0, 0); }; };
  // hero scene: moonlit hills scrolling, little figure
  const heroScene = (x, y, t, a) => { const mx = (x - 0.76) * 1.67, my = y - 0.26, md = Math.hypot(mx, my); if (md < 0.1) return md > 0.085 ? 0 : 0.92 - (mx + 0.05 > 0.04 ? 0.35 : 0); const hill1 = 0.6 + 0.06 * Math.sin((x + t * 0.05 + a * 0.002) * 9); const hill2 = 0.76 + 0.04 * Math.sin((x + t * 0.11 + a * 0.004) * 15 + 2); if (y > hill2) return Math.abs(y - hill2) < 0.012 ? 0 : 0.2; if (y > hill1) return Math.abs(y - hill1) < 0.012 ? 0 : 0.55; const fx = 0.32, fy = hill2 - 0.08 - Math.abs(Math.sin(t * 5)) * 0.04; if (Math.abs(x - fx) < 0.02 && y > fy && y < fy + 0.08) return 0; return 0.97; };
  // crank scene: bucket on a rope down a well; crank angle raises it
  const crankScene = (x, y, t, a) => { const depth = 0.85 - ((a % 1440 + 1440) % 1440) / 1440 * 0.7; if (y < 0.12) return 0.85; if (Math.abs(x - 0.5) < 0.22) { if (Math.abs(x - 0.5) < 0.004 && y < depth) return 1; if (Math.abs(x - 0.5) < 0.06 && y > depth && y < depth + 0.12) return Math.abs(x - 0.5) > 0.045 || y > depth + 0.1 ? 1 : 0.55; return 0.08 + 0.04 * Math.sin(y * 40); } const brick = ((Math.floor(y * 18) % 2 ? x * 12 + 0.5 : x * 12) % 1 < 0.06) || (y * 18) % 1 < 0.08; return brick ? 0.2 : 0.5; };
  const hc = h('canvas', { width: 200, height: 120 }); const heroLcd = lcd(hc, heroScene);
  const nav = h('div.pd-nav', {}, h('a.pd-logo', { href: '#' }, 'playdate'), ...[['⌕', ''], ['✦', 'Games'], ['▦', 'Dev'], ['❦', 'Education'], ['◉', 'Help'], ['▣', 'Sign In']].map(([i, l]) => h('a.l', { href: '#', onclick: (e) => e.preventDefault() }, h('span', {}, i), l)), h('button.pd-shop', { onclick: () => toast('Shop (demo)') }, '🛍 Shop'));
  let crankA = 0; const arm = s('svg', { class: 'arm', viewBox: '0 0 24 96', width: 24, height: 96 }, s('rect', { x: 6, y: 6, width: 8, height: 80, rx: 4, fill: '#9a9a9a', stroke: '#666' }), s('circle', { cx: 10, cy: 10, r: 6, fill: '#bbb', stroke: '#666' }), s('rect', { x: 3, y: 74, width: 18, height: 20, rx: 6, fill: '#d9d9d9', stroke: '#777' }));
  const dev = h('div.pd-dev', {}, h('div.pd-bez', {}, hc), h('div.pd-dpad'), h('div.pd-btn', { style: { left: '216px', top: '268px' }, onclick: () => press('B') }, 'B'), h('div.pd-btn', { style: { left: '292px', top: '268px' }, onclick: () => press('A') }, 'A'), h('div.pd-mb'), h('div.pd-mb2'), h('div.pd-spk'), ...[[10, 380], [366, 380]].map(([l, tp]) => h('div.pd-scr', { style: { left: l + 'px', top: tp + 'px' } })), h('div.pd-crk', {}, h('div.dock'), arm));
  let presses = 0; const press = (k) => { presses++; toast(`${k} pressed`); };
  const words = "It's a new, tiny handheld game system with a bunch of brand-new games.".split(' ').map((w) => h('span', {}, w + ' '));
  const hero = h('div.pd-hero', {}, dev, h('div.pd-stick', {}, 'Season', h('b', {}, '3'), h('div', {}, 'PRE-ORDER IT!')), h('div.pd-h1', {}, ...words));
  // chapters
  const cc = h('canvas', { width: 200, height: 120 }); const crankLcd = lcd(cc, crankScene); const deg = h('div.pd-deg', {}, '↻ 0°');
  const big = s('svg', { class: 'pd-bigcrank', viewBox: '0 0 360 220' }, s('rect', { x: 0, y: 70, width: 210, height: 80, rx: 14, fill: '#1a1a18' }), s('circle', { cx: 210, cy: 110, r: 34, fill: '#d8d8d8', stroke: '#1a1a18', 'stroke-width': 6 }));
  const bigArm = s('g', {}, s('rect', { x: 200, y: 100, width: 130, height: 20, rx: 10, fill: '#efefef', stroke: '#1a1a18', 'stroke-width': 5 }), s('rect', { x: 312, y: 84, width: 38, height: 52, rx: 14, fill: '#fff', stroke: '#1a1a18', 'stroke-width': 5 }), s('circle', { cx: 210, cy: 110, r: 10, fill: '#1a1a18' })); big.append(bigArm);
  const setCrank = (a) => { crankA = a; arm.style.transform = `rotate(${a}deg)`; bigArm.setAttribute('transform', `rotate(${a} 210 110)`); deg.textContent = `↻ ${Math.round(a)}°`; };
  { let last = null; const ang = (e) => { const r = big.getBoundingClientRect(); const cx = r.left + (210 / 360) * r.width, cy = r.top + r.height / 2; return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI; };
    big.addEventListener('pointerdown', (e) => { last = ang(e); big.setPointerCapture(e.pointerId); }); big.addEventListener('pointermove', (e) => { if (last == null) return; const a = ang(e); let d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360; last = a; setCrank(crankA + d); }); big.addEventListener('pointerup', () => (last = null)); }
  const ch = (title, ...kids) => h('section.pd-ch', {}, h('h2', {}, title), ...kids);
  // games
  const NAMES = ['Moon Mop', 'Tiny Lighthouse', 'Crate Courier', 'Owl Post', 'Pebble Golf', 'Night Ferry', 'Dungeon Snack', 'Kite Cartel', 'Bellhop', 'Rust Bucket', 'Snail Mail', 'Haunt Tour', 'Skyline Knit', 'Mole Patrol', 'Cloud Garden', 'Bolt & Nut', 'Paper Tiger', 'Lamp Light', 'Slow Rally', 'Frog Choir', 'Deep Fryer', 'Comet Kid', 'Tin Opera', 'Last Bus'];
  const cover = (i) => { const c = h('canvas', { width: 64, height: 64 }); const g = c.getContext('2d'); const r = rng(i * 97 + 3); const im = g.createImageData(64, 64); const cx = r() * 64, cy = r() * 64, k = 2 + r() * 6, mode = i % 4;
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { let v; if (mode === 0) v = 0.5 + 0.5 * Math.sin(Math.hypot(x - cx, y - cy) / k); else if (mode === 1) v = y / 64 + 0.3 * Math.sin(x / k + i); else if (mode === 2) v = Math.hypot(x - 32, y - 28) < 14 + 6 * r() ? 0.9 : 0.25 + (y > 46 ? 0.4 : 0); else v = ((Math.floor(x / (k * 2)) + Math.floor(y / (k * 2))) % 2 ? 0.75 : 0.2) * (1 - y / 120); const on = v * 16 > B4[(y & 3) * 4 + (x & 3)] + 0.5; const j = (y * 64 + x) * 4; const col = on ? [181, 178, 169] : [47, 45, 39]; im.data[j] = col[0]; im.data[j + 1] = col[1]; im.data[j + 2] = col[2]; im.data[j + 3] = 255; }
    g.putImageData(im, 0, 0); return c; };
  const cards = NAMES.map((n, i) => h('div.pd-g', {}, cover(i), h('div.ov', {}, h('b', {}, n), h('span', {}, `Sample studio ${String(i + 1).padStart(2, '0')} · week ${Math.floor(i / 2) + 1}`))));
  const grid = h('div.pd-games.hide', {}, ...cards); let shown = false;
  const showBtn = h('button.pd-show', { onclick: () => toggleGames() }, 'Show me the games!');
  const toggleGames = (v = !shown) => { shown = v; grid.classList.toggle('hide', !shown); showBtn.textContent = shown ? 'Wait! No spoilers, please!' : 'Show me the games!'; };
  let dsgn = null;
  const chapters = [
    ch('The System.', h('p', {}, 'A handheld with a black-and-white screen, a d-pad, A and B — and a crank. It plays games made just for it.'), h('p', {}, 'No ads, no in-app purchases. Games show up over the air.')),
    ch('The Design.', h('div.pd-row', {}, h('div', {}, h('p', {}, 'Designed with Teenage Engineering. Small enough for a pocket, bright enough to feel like a toy.'), h('p', {}, 'Every pixel on the reflective 1-bit screen is either on or off — the games lean into it.')), h('div.pd-lcd', {}, (() => { const c2 = h('canvas', { width: 200, height: 120 }); dsgn = lcd(c2, heroScene); return c2; })()))),
    ch('The Crank.', h('div.pd-row', {}, h('div', {}, h('p', {}, 'Some games use it, some don\u2019t. Turn it to wind the bucket up the well — drag the crank, or just scroll.'), big), h('div', {}, h('div.pd-lcd', {}, cc), deg))),
    ch('The Season.', h('p', {}, 'Season One: 24 games, two a week for twelve weeks. Each one is a surprise.'), showBtn, grid),
  ];
  const price = h('div.pd-price', {}, h('div', {}, h('div', {}, h('b', {}, '$229'), h('small', {}, 'Season One included')), h('button', { onclick: () => toast('Shop Now (demo)') }, 'Shop Now')));
  const foot = h('footer.pd-foot', {}, ...[['Playdate', ['Shop', 'Games', 'Season']], ['Developers', ['SDK', 'Pulp', 'Catalog']], ['Support', ['Help', 'Contact', 'Warranty']], ['Panic', ['About', 'Press', 'Careers']]].map(([t, ls]) => h('div', {}, h('h6', {}, t), ...ls.map((l) => h('a', { href: '#', onclick: (e) => e.preventDefault() }, l)))));
  root.append(h('div.pd', {}, nav, hero, ...chapters, price, foot));
  // scroll: hero words reveal + crank rotates with scroll
  let lastScroll = 0; const onScroll = () => { const st = root.scrollTop; const k = clamp(st / 260, 0, 1); words.forEach((w, i) => w.classList.toggle('on', i < 6 + k * (words.length - 6))); setCrank(crankA + (st - lastScroll) * 0.6); lastScroll = st; };
  root.addEventListener('scroll', onScroll); onScroll();
  const loop = (now) => { const t = now / 1000; heroLcd(t, crankA); if (dsgn) dsgn(t * 0.7 + 3, 0); crankLcd(t, crankA); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  window.__demoProof = async () => { const out = []; const a0 = crankA; setCrank(a0 + 540); await sleep(60); out.push(`crank ${Math.round(a0)}°→${deg.textContent}`); setCrank(a0); toggleGames(true); out.push(`button="${showBtn.textContent}", games=${grid.children.length}, hidden=${grid.classList.contains('hide')}`); cards[0].classList.add('hv'); out.push(`hover overlay=${getComputedStyle(cards[0].querySelector('.ov')).opacity !== ''}`); cards[0].classList.remove('hv'); toggleGames(false); out.push(`toggle back="${showBtn.textContent}"`); root.scrollTop = 300; onScroll(); out.push(`words lit=${words.filter((w) => w.classList.contains('on')).length}/${words.length}`); out.push(`sticky price=${getComputedStyle(price).position}`); root.scrollTop = 0; onScroll(); return out.join('; ') + '; restored'; };
};
V['puzzmo-daily-puzzle-newspaper-hub'] = (root, T) => {
  import('@fontsource/poppins/300.css'); import('@fontsource/poppins/400.css'); import('@fontsource/poppins/500.css'); import('@fontsource/poppins/600.css'); import('@fontsource/poppins/700.css'); import('@fontsource/poppins/800.css'); import('@fontsource/poppins/400-italic.css'); import('@fontsource-variable/fraunces/wght-italic.css');
  theme(root, T, { bg: '#f2f2f2', fg: '#1b1d29', ac: '#ffaaac', dark: false }); scroll(root);
  const P = 'Poppins,system-ui,sans-serif', Z = "'Fraunces Variable',Georgia,serif", INK = '#1b1d29';
  root.append(h('style', {}, `.pz{font:400 13px/1.45 ${P};color:${INK};background:#f2f2f2;min-height:100%}.pz button{font-family:${P};cursor:pointer}
.pz-top{height:64px;background:${INK};display:flex;align-items:stretch;padding:0 12px;position:sticky;top:0;z-index:20}
.pz-brand{display:flex;flex-direction:column;justify-content:center;padding-right:16px;border-right:1px solid #ffffff38;margin:9px 0}
.pz-logo{font:800 29px/.86 ${P};color:#ffd23f;letter-spacing:-.035em;text-shadow:0 2px 0 #c99a12;position:relative}.pz-logo sup{font-size:12px;color:#fff;position:absolute;right:-12px;top:-4px}
.pz-by{color:#fff;font:400 11px ${P};margin-top:4px}
.pz-dl{position:relative;display:flex;align-items:center;gap:8px;padding:0 14px;margin-left:12px;color:#fff;font:600 16.5px ${P};cursor:pointer;border-bottom:3px solid #ffaaac;user-select:none}
.pz-dl svg{flex:none}.pz-dl .dd{font:500 11px ${P};color:#ffd23f;margin-left:4px}
.pz-menu{position:absolute;top:64px;left:0;background:#fff;color:${INK};border-radius:0 0 10px 10px;box-shadow:0 14px 30px #0003;min-width:260px;padding:6px;display:none;font:500 14px ${P};z-index:30}
.pz-menu.on{display:block}.pz-menu div{padding:9px 12px;border-radius:6px;display:flex;justify-content:space-between;gap:16px}.pz-menu div:hover{background:#f2f2f2}.pz-menu div.on{background:#ffaaac66}.pz-menu small{color:#888;font-size:11px}
.pz-right{margin-left:auto;display:flex;align-items:center;gap:10px}.pz-pill{background:#ffaaac;color:${INK};border:0;border-radius:6px;padding:7px 13px;font:600 13px ${P}}
.pz-sub{height:42px;display:flex;align-items:center;padding:0 12px;font:italic 400 15px ${P};color:#555;border-bottom:1px solid #d6d6d6}
.pz-cols{display:grid;grid-template-columns:1fr 1fr 1fr}
.pz-col{padding:30px 24px 40px;min-width:0}.pz-col+.pz-col{border-left:8px solid #fafafa;box-shadow:inset 1px 0 0 #dedede,-1px 0 0 #dedede}
.pz-card{padding-bottom:30px;margin-bottom:30px;border-bottom:1px dashed #c4c4c4}
.pz-hd{display:flex;align-items:center;gap:10px;font:700 15px ${Z};letter-spacing:-.005em}.pz-hd .ic{width:20px;height:20px;display:inline-flex}.pz-hd .rule{flex:1;height:1px;background:#8a8a8a}
.pz-hd .st{font:italic 400 11.5px ${P};color:#333;transition:color .3s}.pz-hd .st.prog{color:#c4565a}.pz-hd .st.done{color:#2f7d4a;font-style:normal;font-weight:600}
.pz-bonus{display:flex;align-items:center;gap:8px;margin:6px 0 0 30px;font:700 12.5px ${Z};color:#999}.pz-bonus b{background:#8c8c8c;color:#fff;padding:0 4px}.pz-bonus .rule{flex:1;border-top:1px dashed #ccc}.pz-bonus i{font:italic 400 11px ${P}}
.pz-title{font:italic 800 25px ${Z};margin:18px 0 4px;letter-spacing:-.01em}
.pz-by2{font-size:13.5px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:14px}.pz-av{width:16px;height:16px;border-radius:50%;display:inline-block;box-shadow:inset 0 -3px 0 #0002}
.cw{display:grid;border:2px solid ${INK};user-select:none}.cw b{aspect-ratio:1;background:#fff;display:flex;align-items:center;justify-content:center;font:500 17px ${P};position:relative;cursor:pointer;box-shadow:inset 0 0 0 .5px #cfcfcf;transition:background .15s}
.cw b.alt{background:#ebebeb}.cw b.blk{background:${INK};cursor:default;box-shadow:none}.cw b.word{background:#ffd9da}.cw b.sel{background:#ffaaac}.cw b small{position:absolute;top:1px;left:3px;font:500 8px ${P};color:#444}.cw.sm b{font-size:12px}.cw.sm b small{font-size:6px}
.cw-clue{margin-top:10px;font:400 12.5px ${P};color:#555;min-height:18px}.cw-clue b{font-weight:600;color:${INK}}
.fa{position:relative;margin:24px auto 0;width:max-content;perspective:900px}.fa-in{position:absolute;background:repeating-linear-gradient(45deg,#fff 0 3px,#e4e4e4 3px 4px);outline:2px solid ${INK}}
.fa-tab{position:absolute;background:${INK}}.fa-pc{position:absolute;cursor:pointer;transition:transform .55s cubic-bezier(.5,1.6,.4,1);transform-style:preserve-3d}.fa-pc i{position:absolute;display:block}.fa-pc:hover{filter:brightness(1.06)}
.fa-msg{text-align:center;font:500 12px ${P};color:#666;margin-top:12px}
.hc{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:16px}.hc i{aspect-ratio:1;border-radius:4px;cursor:pointer;position:relative;transition:transform .2s,box-shadow .2s,background-color .35s}.hc i.lock:after{content:'';position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px;border-radius:50%;background:#fff}.hc i.pick{transform:scale(.86);box-shadow:0 0 0 3px ${INK}}
.pz-ad{margin:4px auto 30px;border:1px solid #333;background:#fffdf7;text-align:center;padding:20px;width:76%}.pz-ad h5{font:600 20px ${P};margin:6px 0 10px}.pz-ad h5 span{color:#f2b31b;font-style:italic}.pz-ad ul{list-style:none;padding:0;margin:0 0 12px;text-align:left;display:inline-block;font-size:13px}.pz-ad .plus{background:#ffc928;border:0;border-radius:6px;padding:8px 14px;font:700 13px ${P}}
.pz-rm{display:block;margin:-22px auto 30px;background:#ffc928;width:76%;text-align:center;border-radius:3px;font:600 12px ${P};padding:4px}
.pz-cd{background:#fff;border-radius:10px;box-shadow:0 2px 10px #0000001a;padding:30px 18px 18px;position:relative;margin:10px 0 34px}
.pz-rib{position:absolute;left:-6px;right:-6px;top:-4px;height:13px;background:#d298ff;border-radius:3px}.pz-bow{position:absolute;left:50%;top:-22px;transform:translateX(-50%)}
.pz-cd h4{display:flex;gap:10px;align-items:flex-start;margin:0 0 12px;font:700 14.5px/1.35 ${Z}}.pz-cd h4 span:first-child{font-size:26px;line-height:1}
.pz-clock{background:${INK};border-radius:8px;color:#fff;display:flex;justify-content:center;align-items:flex-start;gap:12px;padding:9px 0 6px}.pz-clock div{text-align:center;min-width:44px}.pz-clock b{display:block;font:500 22px/1 ${P};font-variant-numeric:tabular-nums;letter-spacing:.04em}.pz-clock small{font:500 8.5px ${P};letter-spacing:.14em;color:#aaa}.pz-clock em{font:500 20px ${P};font-style:normal}
.pz-cta{display:block;width:100%;margin-top:10px;border:0;border-radius:4px;background:#d298ff;color:${INK};font:600 13px ${P};padding:8px}
.ci{display:grid;grid-template-columns:1fr 1fr 1fr;gap:13px 10px;margin-top:4px}.ci div{height:54px;border-radius:4px;display:flex;align-items:center;justify-content:center;font:700 14px ${P};text-transform:uppercase;position:relative;text-align:center;padding:0 4px}
.ci .g{background:#d6d6d6}.ci .e{background:#fff;border:2px solid ${INK};cursor:text}.ci .e.on{box-shadow:0 0 0 3px #ffaaac}.ci .e.ok{background:#bfe3c6;border-color:#bfe3c6;animation:ciok .5s}.ci .r:after{content:'▸';position:absolute;right:-10px;font-size:10px;color:${INK}}.ci .d:before{content:'▾';position:absolute;bottom:-14px;font-size:10px}
@keyframes ciok{40%{transform:scale(1.08)}}.ci input{all:unset;width:100%;text-align:center;font:700 14px ${P};text-transform:uppercase}
.yn h3{font:700 16px ${Z};margin:0 0 12px}.yn p{display:flex;gap:10px;margin:0 0 12px;font-size:13.5px;align-items:flex-start}.yn p span{font-size:18px;line-height:1}.yn .more{display:none}.yn.open .more{display:flex}.yn-b{display:flex;gap:26px;justify-content:center;align-items:center}.yn-b button{border:0;background:none;font:600 12px ${P}}.yn-b .rc{background:#ffaaac;border-radius:3px;padding:4px 8px}
.ts{position:relative;height:230px;margin-top:14px;overflow:hidden;user-select:none}.ts-band{position:absolute;left:0;right:0;top:92px;height:46px;background:#fff;transition:background .3s}.ts-band.hit{background:#ffd9da}
.ts-cols{position:absolute;inset:0;display:flex;justify-content:center;gap:12px}.ts-col{width:46px;position:relative;cursor:ns-resize}.ts-col>div{position:absolute;left:0;right:0;transition:transform .32s cubic-bezier(.3,1.4,.5,1)}.ts-col span{display:block;height:46px;line-height:46px;text-align:center;font:300 34px ${P};color:#a9a9a9}.ts-col span.c{color:${INK};font-weight:400}
.ts-f{display:flex;flex-wrap:wrap;gap:6px;min-height:24px;font:600 11px ${P}}.ts-f b{background:${INK};color:#ffd23f;border-radius:4px;padding:3px 7px;animation:ciok .4s}
.lb{padding:40px 24px 30px;border-top:1px solid #ddd}.lb h2{font:700 34px ${Z};color:#515151;margin:0 0 24px}.lb-g{display:grid;grid-template-columns:1fr 1fr;gap:34px 48px}.lb h4{font:700 19px ${Z};margin:0;display:flex;align-items:flex-end;gap:12px;border-bottom:1px solid #999;padding-bottom:4px}.lb h4 span{flex:1}
.lb-t{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;margin-top:10px;font-size:12.5px}.lb-t div{display:flex;gap:6px;align-items:center;background:#fff;padding:2px 10px}.lb-t div:nth-child(even){background:#fafafa}.lb-t b{width:28px}.lb-t em{margin-left:auto;font-style:normal;font-variant-numeric:tabular-nums}
.pz-games{background:#e8e8e8;padding:22px 24px;display:flex;flex-wrap:wrap;gap:14px 40px}.pz-games span{display:flex;align-items:center;gap:10px;font-size:13px;width:120px}.pz-games i{width:30px;height:30px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center}
.pz-foot{background:#e8e8e8;padding:0 24px 40px}.pz-foot .lg{display:inline-block;border:3px solid ${INK};border-radius:30px;padding:2px 14px;font:800 22px ${P};color:#fff;background:${INK};letter-spacing:-.03em;margin:20px 0 10px}`));
  const ICON = {
    cw: `<svg viewBox="0 0 20 20" width="20" height="20"><rect x="1.5" y="1.5" width="17" height="17" fill="#fff" stroke="${INK}" stroke-width="2"/><rect x="10" y="2" width="8" height="8" fill="${INK}"/><rect x="2" y="10" width="8" height="8" fill="${INK}"/><rect x="11" y="11" width="6" height="6" fill="#fff"/></svg>`,
    fa: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="${INK}" stroke-width="2"><rect x="2" y="2" width="16" height="16"/><path d="M6 6h8v8M6 6v8h4"/></svg>`,
    ci: `<svg viewBox="0 0 20 20" width="20" height="20"><path d="M11 1 4 11h5l-1 8 8-11h-5z" fill="${INK}"/></svg>`,
    hc: `<svg viewBox="0 0 20 20" width="20" height="20"><rect x="2" y="2" width="7" height="7" fill="${INK}"/><rect x="11" y="2" width="7" height="7" fill="#888"/><rect x="2" y="11" width="7" height="7" fill="#bbb"/><rect x="11" y="11" width="7" height="7" fill="none" stroke="${INK}" stroke-width="2"/></svg>`,
    ts: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="${INK}" stroke-width="2"><rect x="2" y="2" width="16" height="16" rx="2"/><path d="M6 6h8M10 6v9"/></svg>`,
  };
  const DATES = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2026, 9, 7 - i)).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' }));
  const TITLES = [['🍬', 'Stretching the Joke'], ['👡', 'Kicks In'], ['🍜', 'Use Your Noodle'], ['🎈', 'Hot Air'], ['🧦', 'Odd Socks'], ['🪐', 'Ring Leaders'], ['🧇', 'Waffle On'], ['🦷', 'Sweet Tooth'], ['🎻', 'Fine Tuning'], ['🌮', 'Shell Game'], ['🧲', 'Opposites Attract'], ['🐝', 'Busy Bodies'], ['🍋', 'Squeeze Play'], ['🗝️', 'Lock Step'], ['🧊', 'Break the Ice'], ['🎯', 'Dead Center'], ['🛼', 'Rolling Start'], ['🥐', 'Flaky Friends'], ['🪁', 'Loose Strings'], ['🦩', 'Pink Slip'], ['🍩', 'Hole Story']];
  const PEOPLE = [['kangareuben', '#7fd3e6'], ['Olivia Mitra Framke', '#9ccf8a'], ['Ryan Mathiason', '#f6c26b'], ['Madeline Kaplan', '#f9b38a'], ['Elliot Caroll', '#f48a8a'], ['brooke', '#e46a8f'], ['Matthew Stock', '#b49cf5'], ['Sam Ezersky', '#8ad1b4']];
  const person = ([n, c]) => [h('span.pz-av', { style: { background: `radial-gradient(circle at 50% 38%,#ffe1c4 0 32%,${c} 33%)` } }), n];
  const byline = (a, e) => h('div.pz-by2', {}, h('span', {}, 'By'), ...person(a).map((x) => (typeof x === 'string' ? h('span', {}, x) : x)), h('span', {}, '•'), h('span', {}, 'Edited by'), ...person(e).map((x) => (typeof x === 'string' ? h('span', {}, x) : x)));
  const setSt = (st, kind) => { if (!st) return; st.textContent = kind === 'prog' ? 'In progress' : kind === 'done' ? 'Solved ✓' : 'Unplayed'; st.className = 'st' + (kind ? ' ' + kind : ''); };
  const card = (icon, name, kids, bonus) => { const st = h('span.st', {}, 'Unplayed'); const el = h('div.pz-card', {}, h('div.pz-hd', {}, h('span.ic', { html: ICON[icon] }), h('span', { html: name }), h('span.rule'), st), bonus ? h('div.pz-bonus', {}, '•', h('b', {}, 'Bonus'), bonus, h('span.rule'), h('i', {}, 'Bonus')) : null, ...kids); el.st = st; return el; };
  // ---- crossword (selectable cells, type to fill, across/down toggle) ----
  let activeCW = null; const cws = [];
  const crossword = (n, rows, seed, sm) => {
    const r = rng(seed); const blk = new Set(); const want = Math.round(n * rows * 0.16);
    while (blk.size < want) { const x = Math.floor(r() * n), y = Math.floor(r() * rows); if ((x === 0 && y === 0)) continue; blk.add(y * n + x); blk.add((rows - 1 - y) * n + (n - 1 - x)); }
    const g = h('div.cw' + (sm ? '.sm' : ''), { style: { gridTemplateColumns: `repeat(${n},1fr)` } }); const clue = h('div.cw-clue', {}, 'Tap a square to start'); const cells = []; let num = 1; const nums = {};
    const CL = ['Not quite right', 'Punchline setup', 'Circus performer', 'Stretch out', 'Kind of joke', 'Laughs, informally', 'Comic bit', 'Sitcom staple', 'Groan inducer', 'Tickle', 'Wordplay', 'Ham it up'];
    const W = { cells, n, rows, blk, k: -1, dir: 'a', g, clue };
    for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++) { const k = y * n + x; const b = blk.has(k); const el = h('b' + (b ? '.blk' : (x + y) % 2 ? '' : '.alt')); if (!b) { const sA = (x === 0 || blk.has(k - 1)) && x < n - 1 && !blk.has(k + 1); const sD = (y === 0 || blk.has(k - n)) && y < rows - 1 && !blk.has(k + n); if (sA || sD) nums[k] = num++; el.append(h('span')); el.onclick = () => sel(W, k); } cells.push(el); g.append(el); }
    W.word = (k, dir) => { const st = dir === 'a' ? 1 : n; const ok = (j) => j >= 0 && j < n * rows && !blk.has(j) && (dir === 'd' || Math.floor(j / n) === Math.floor(k / n)); let a = k; while (ok(a - st)) a -= st; const out = []; for (let j = a; ok(j); j += st) out.push(j); return out; };
    W.clueText = () => { const w = W.word(W.k, W.dir); return h('span', {}, h('b', {}, `${nums[w[0]] || '·'}${W.dir === 'a' ? 'A' : 'D'} `), CL[(w[0] + (W.dir === 'a' ? 0 : 5)) % CL.length]); };
    cws.push(W); return W;
  };
  const paint = (W) => { const w = W.k < 0 ? [] : W.word(W.k, W.dir); W.cells.forEach((c, j) => { c.classList.toggle('word', w.includes(j)); c.classList.toggle('sel', j === W.k); }); if (W.k >= 0) W.clue.replaceChildren(W.clueText()); };
  const sel = (W, k) => { if (activeCW && activeCW !== W) { activeCW.k = -1; paint(activeCW); } if (W.k === k) W.dir = W.dir === 'a' ? 'd' : 'a'; W.k = k; activeCW = W; paint(W); };
  const typeCW = (W, ch) => { if (!W || W.k < 0) return; const cell = W.cells[W.k].querySelector('span'); const w = W.word(W.k, W.dir); const i = w.indexOf(W.k);
    if (ch === 'Backspace') { cell.textContent = ''; if (i > 0) W.k = w[i - 1]; } else { cell.textContent = ch.toUpperCase(); if (i < w.length - 1) W.k = w[i + 1]; }
    paint(W); const filled = W.cells.filter((c) => !c.classList.contains('blk') && c.querySelector('span').textContent).length; setSt(W.st, filled ? 'prog' : ''); };
  const onKey = (e) => { if (!root.isConnected) return document.removeEventListener('keydown', onKey); if (e.target.tagName === 'INPUT' || !activeCW || activeCW.k < 0) return; if (/^[a-z]$/i.test(e.key) || e.key === 'Backspace') { e.preventDefault(); typeCW(activeCW, e.key); } else if (e.key === ' ' || e.key === 'Tab') { e.preventDefault(); sel(activeCW, activeCW.k); } };
  document.addEventListener('keydown', onKey);
  // ---- flipart (click a piece to flip it in 3D; solved when all face up) ----
  const flipart = (seed) => {
    const C = 43, r = rng(seed); const wrap = h('div.fa', { style: { width: 8 * C + 'px', height: 9 * C + 'px' } }); const msg = h('div.fa-msg', {}, 'Tap a piece to flip it');
    wrap.append(h('div.fa-in', { style: { left: C + 'px', top: C + 'px', width: 6 * C + 'px', height: 7 * C + 'px' } }));
    [[3, 0], [7, 2], [0, 4], [0, 5], [7, 7], [3, 8]].forEach(([x, y]) => wrap.append(h('div.fa-tab', { style: { left: x * C + 'px', top: y * C + 'px', width: C + 'px', height: C + 'px' } })));
    const PCS = [['#ffaaac', [[2, 0], [2, 1]]], ['#fac16c', [[3, 0], [4, 0], [5, 0], [3, 1], [4, 1], [5, 1]]], ['#98b389', [[2, 2], [3, 2], [3, 3]]], ['#5dbafc', [[0, 2], [0, 3], [1, 3]]], ['#5dbafc', [[4, 2], [5, 2], [4, 3], [5, 4]]], ['#fac16c', [[0, 4]]], ['#98b389', [[4, 4], [3, 4]]], ['#5dbafc', [[0, 5], [0, 6], [1, 6]]], ['#ffaaac', [[2, 6]]], ['#fac16c', [[5, 5], [5, 6], [4, 6]]]];
    const pcs = PCS.map(([col, cells]) => { const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]); const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0 + 1, hh = Math.max(...ys) - y0 + 1;
      const el = h('div.fa-pc', { style: { left: (x0 + 1) * C + 'px', top: (y0 + 1) * C + 'px', width: w * C + 'px', height: hh * C + 'px' } }, ...cells.map(([x, y]) => h('i', { style: { left: (x - x0) * C + 'px', top: (y - y0) * C + 'px', width: C + 'px', height: C + 'px', background: col } })));
      const pc = { el, flipped: w > 1 && r() < 0.5, axis: w > 1 ? 'Y' : 'X' }; const show = () => (el.style.transform = pc.flipped ? `rotate${pc.axis}(180deg)` : 'none'); pc.show = show; show();
      el.onclick = () => { pc.flipped = !pc.flipped; show(); check(); }; wrap.append(el); return pc; });
    const F = { wrap, msg, pcs };
    const check = () => { const left = pcs.filter((p) => p.flipped).length; msg.textContent = left ? `${left} piece${left > 1 ? 's' : ''} still face-down` : 'Picture complete!'; setSt(F.st, left ? 'prog' : 'done'); };
    F.check = check; return F;
  };
  // ---- hue complete me (swap tiles to finish the gradient) ----
  const huecm = (seed) => {
    const r = rng(seed); const N = 5; const cs = [[255, 154, 172], [250, 193, 108], [93, 186, 252], [152, 120, 255]];
    const col = (x, y) => { const u = x / (N - 1), v = y / (N - 1); const m = (a, b, t) => a.map((q, i) => q + (b[i] - q) * t); const c = m(m(cs[0], cs[1], u), m(cs[2], cs[3], u), v); return `rgb(${c.map(Math.round).join(',')})`; };
    const target = Array.from({ length: N * N }, (_, i) => col(i % N, Math.floor(i / N))); const lock = new Set([0, N - 1, N * (N - 1), N * N - 1, 12]);
    const order = target.map((_, i) => i); const free = order.filter((i) => !lock.has(i)); for (let i = free.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [free[i], free[j]] = [free[j], free[i]]; } let fi = 0; const cur = order.map((i) => (lock.has(i) ? i : free[fi++]));
    const grid = h('div.hc'); let pick = -1; const tiles = cur.map((t, i) => h('i' + (lock.has(i) ? '.lock' : ''), { style: { backgroundColor: target[t] }, onclick: () => tap(i) })); grid.append(...tiles);
    const HC = { grid, cur, target, lock }; const draw = () => tiles.forEach((el, i) => { el.style.backgroundColor = target[cur[i]]; el.classList.toggle('pick', i === pick); });
    const tap = (i) => { if (lock.has(i)) return; if (pick < 0) pick = i; else { [cur[pick], cur[i]] = [cur[i], cur[pick]]; pick = -1; } draw(); const ok = cur.every((t, i) => t === i); setSt(HC.st, ok ? 'done' : 'prog'); };
    HC.tap = tap; HC.solved = () => cur.every((t, i) => t === i); return HC;
  };
  // ---- circuits (fill the blank links of the word chain) ----
  const LAY = [['SKY', 'g r'], ['HIGH', 'e r d'], ['OCTANE', 'g'], ['MOON', 'g r'], ['LIGHT', 'e r d'], ['YEAR', 'g'], ['BUS', 'g r'], ['STOP', 'e r d'], ['WATCH', 'g'], ['SLOW', 'e r d'], ['MOTION', 'e r d'], ['PICTURE', 'g'], ['DOWN', 'g'], ['SICKNESS', 'g'], ['', '']];
  const circuits = () => { const grid = h('div.ci'); const blanks = []; const CI = { grid, blanks };
    LAY.forEach(([w, k]) => { const cls = k.split(' ').filter(Boolean); if (!w) return grid.append(h('span')); if (cls[0] === 'g') return grid.append(h('div.g' + (cls.includes('r') ? '.r' : ''), {}, w));
      const inp = h('input', { maxlength: 9, 'aria-label': 'circuit link' }); const el = h('div.e' + cls.slice(1).map((c) => '.' + c).join(''), {}, inp); const b = { el, inp, w, ok: false };
      const test = () => { if (inp.value.trim().toUpperCase() === w) { b.ok = true; el.classList.add('ok'); inp.disabled = true; inp.value = w; } const n = blanks.filter((x) => x.ok).length; setSt(CI.st, n === blanks.length ? 'done' : n || blanks.some((x) => x.inp.value) ? 'prog' : ''); };
      inp.oninput = test; inp.onfocus = () => el.classList.add('on'); inp.onblur = () => el.classList.remove('on'); b.test = test; blanks.push(b); grid.append(el); });
    CI.reset = () => blanks.forEach((b) => { b.ok = false; b.inp.disabled = false; b.inp.value = ''; b.el.classList.remove('ok'); }); return CI; };
  // ---- typeshift (slide letter columns; centre band spells words) ----
  const TSC = [['S', 'B', 'T'], ['L', 'P', 'E', 'H', 'O'], ['A', 'E', 'O'], ['R', 'N', 'A', 'K'], ['S', 'E', 'K', 'Y']];
  const WORDS = new Set(['SPARE', 'SLAKE', 'SHARK', 'TEARS', 'SPANK', 'SHAKE', 'BEARS', 'BOARS', 'SPARK', 'SPEAK', 'BLEAK', 'BEAKS', 'TEAKS', 'BEANS', 'SPARS', 'BLARE', 'SHARE', 'SHAKY']);
  const typeshift = () => { const off = [0, 1, 1, 0, 2]; const band = h('div.ts-band'); const found = h('div.ts-f'); const got = new Set(); const TS = { off, got, band, found };
    const cols = TSC.map((letters, i) => { const strip = h('div', {}, ...letters.map((L) => h('span', {}, L))); const col = h('div.ts-col', { onclick: (e) => { const rr = col.getBoundingClientRect(); shift(i, e.clientY - rr.top < rr.height / 2 ? -1 : 1); } }, strip); return { col, strip }; });
    const word = () => TSC.map((l, i) => l[off[i]]).join('');
    const draw = () => { cols.forEach(({ strip }, i) => { strip.style.transform = `translateY(${(2 - off[i]) * 46}px)`; [...strip.children].forEach((s0, j) => s0.classList.toggle('c', j === off[i])); }); const w = word(); const hit = WORDS.has(w); band.classList.toggle('hit', hit); if (hit && !got.has(w)) { got.add(w); found.append(h('b', {}, w)); setSt(TS.st, got.size >= 5 ? 'done' : 'prog'); } };
    const shift = (i, d) => { off[i] = clamp(off[i] + d, 0, TSC[i].length - 1); draw(); };
    TS.el = h('div', {}, h('div.ts', {}, band, h('div.ts-cols', {}, ...cols.map((c) => c.col))), found); TS.shift = shift; TS.word = word; TS.draw = draw; draw(); return TS; };
  // ---- layout ----
  let di = 0; const menu = h('div.pz-menu'); const ddLabel = h('span.dd');
  const dl = h('div.pz-dl', { onclick: (e) => { e.stopPropagation(); menu.classList.toggle('on'); } }, 'Your dailies', h('span', { html: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" stroke-width="1.6"><rect x="2.5" y="3.5" width="13" height="12" rx="2"/><path d="M2.5 7.5h13M6 2v3M12 2v3M6 10.5h2M10 10.5h2M6 13h2"/></svg>' }), ddLabel, h('span', { html: '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="#fff" stroke-width="1.8" fill="none"/></svg>' }), menu);
  root.addEventListener('click', () => menu.classList.remove('on'));
  const cols = [h('div.pz-col'), h('div.pz-col'), h('div.pz-col')];
  let W1, W2, W3, FA, HC, CI, TS, YN;
  const clockEls = {}; const TARGET = Date.parse('2026-10-14T01:00:00+09:00');
  const tick = () => { let s0 = Math.max(0, Math.floor((TARGET - Date.now()) / 1000)); const d = Math.floor(s0 / 86400); s0 -= d * 86400; const hh = Math.floor(s0 / 3600); s0 -= hh * 3600; const m = Math.floor(s0 / 60); const sec = s0 - m * 60; [['d', d], ['h', hh], ['m', m], ['s', sec]].forEach(([k, v]) => clockEls[k] && (clockEls[k].textContent = String(v).padStart(2, '0'))); };
  const unit = (k, l) => h('div', {}, (clockEls[k] = h('b', {}, '00')), h('small', {}, l));
  const countdown = h('div.pz-cd', {}, h('div.pz-rib'), h('div.pz-bow', { html: '<svg width="46" height="38" viewBox="0 0 46 38"><path d="M23 16C14 2 2 4 4 14s13 6 19 2zM23 16c9-14 21-12 19-2s-13 6-19 2z" fill="#d298ff" stroke="#9a5fd0" stroke-width="1.5"/><path d="M21 17l-8 18 5-3 3 5 2-20zM25 17l8 18-5-3-3 5-2-20z" fill="#c084f5" stroke="#9a5fd0" stroke-width="1.2"/><circle cx="23" cy="16" r="4.5" fill="#b07ce6" stroke="#9a5fd0" stroke-width="1.5"/></svg>' }),
    h('h4', {}, h('span', {}, '🥳'), h('span', {}, 'Puzzmo is turning 3 this fall! The party starts in…')), h('div.pz-clock', {}, unit('d', 'DAYS'), h('em', {}, ':'), unit('h', 'HOURS'), h('em', {}, ':'), unit('m', 'MINS'), h('em', {}, ':'), unit('s', 'SECS')), h('button.pz-cta', { onclick: () => toast('You’re on the party list 🎉') }, 'Sign up to get updates'));
  tick(); const iv = setInterval(() => (root.isConnected ? tick() : clearInterval(iv)), 1000);
  const NEWS = [['♞', '8 players completed Really Bad Chess losing only <b>4</b> pieces.'], ['▦', '4 players tied for the <u>longest</u> word in SpellTower: <b>18</b> letters.'], ['♞', '9 players completed Really Hard Chess losing only <b>5</b> pieces.'], ['⚡', '312 players solved Circuits without a single hint.'], ['▣', 'The fastest Cross|word solve was <b>1:52</b> by paradox.'], ['🎶', 'devilfan found Bongo’s top word: <b>BOUNCED</b>.']];
  const render = () => {
    activeCW = null; cws.length = 0; const r = rng(di * 31 + 7); const t3 = [0, 1, 2].map((k) => TITLES[(di * 3 + k) % TITLES.length]); const ppl = () => PEOPLE[Math.floor(r() * PEOPLE.length)];
    W1 = crossword(10, 10, 101 + di, false); W2 = crossword(15, 13, 202 + di, true); W3 = crossword(5, 5, 303 + di, false);
    const c1 = card('cw', 'Cross|word', [h('div.pz-title', {}, `${t3[0][0]} `, t3[0][1]), byline(PEOPLE[(di) % 8], PEOPLE[(di + 1) % 8]), W1.g, W1.clue]); W1.st = c1.st;
    const c2 = card('cw', 'Big Cross|word', [h('div.pz-title', {}, `${t3[1][0]} `, t3[1][1]), byline(PEOPLE[(di + 2) % 8], PEOPLE[(di + 3) % 8]), W2.g, W2.clue]); W2.st = c2.st;
    const c3 = card('cw', 'Mini Cross|word', [h('div.pz-title', {}, `${t3[2][0]} `, t3[2][1]), byline(PEOPLE[(di + 4) % 8], PEOPLE[5]), h('div', { style: { width: '62%' } }, W3.g), W3.clue]); W3.st = c3.st;
    cols[0].replaceChildren(c1, c2, c3);
    FA = flipart(500 + di); const c4 = card('fa', 'Flipart', [FA.wrap, FA.msg], 'Flipart'); FA.st = c4.st;
    HC = huecm(700 + di); const c5 = card('hc', 'Hue Complete Me', [HC.grid, h('div.fa-msg', {}, 'Swap tiles to complete the gradient · dots are fixed')], 'Hue Complete Me Small'); HC.st = c5.st;
    const ad = h('div', {}, h('div.pz-ad', {}, h('div', { style: { fontSize: '22px' } }, '✨'), h('h5', {}, 'Enjoy ', h('span', {}, 'more'), ' Puzzmo!'), h('ul', {}, h('li', {}, '🧩  Our whole archive'), h('li', {}, '🔔  Exclusive experimental games'), h('li', {}, '🚫  No ads')), h('div', { style: { fontWeight: 600, marginBottom: '8px' } }, 'Every game, every day'), h('button.plus', {}, 'Puzzmo Plus')), h('span.pz-rm', {}, 'Remove ads'));
    cols[1].replaceChildren(c4, ad, c5);
    CI = circuits(); const c6 = card('ci', 'Circuits', [h('div', { style: { height: '14px' } }), byline(PEOPLE[6], PEOPLE[3]), CI.grid]); CI.st = c6.st;
    YN = h('div.yn.pz-card', {}, h('h3', {}, 'Yesterday’s News'), ...NEWS.map(([i, t], k) => h('p' + (k > 2 ? '.more' : ''), {}, h('span', {}, i), h('span', { html: t }))), h('div.yn-b', {}, h('button', { onclick: (e) => { YN.classList.toggle('open'); e.currentTarget.textContent = YN.classList.contains('open') ? '▴  Show less' : '▾  Show more'; } }, '▾  Show more'), h('button.rc', { onclick: () => toast('Full recap opens on puzzmo.com') }, 'See full recap')));
    TS = typeshift(); const c7 = card('ts', 'Typeshift', [TS.el], 'Comparative shift'); TS.st = c7.st;
    cols[2].replaceChildren(countdown, c6, YN, c7); FA.check(); setSt(FA.st, ''); ddLabel.textContent = di ? DATES[di].replace(/^\w+, /, '') : '';
    menu.replaceChildren(...DATES.map((d, i) => h('div' + (i === di ? '.on' : ''), { onclick: (e) => { e.stopPropagation(); menu.classList.remove('on'); di = i; render(); } }, d, h('small', {}, i ? `${i}d ago` : 'Today'))));
  };
  const lbRows = [['paradox', 46609], ['devilfan', 45641], ['rickaay', 44413], ['mnemonica', 42879], ['ekdar123', 42819], ['anak', 42315], ['reyirion', 42014], ['jake', 41674], ['l-ron', 41252], ['slopecutter', 40602]];
  const spark = () => h('span', { html: '<svg width="44" height="22" viewBox="0 0 44 22"><path d="M0 22 L6 18 10 12 14 14 18 6 22 3 26 9 30 8 34 14 40 18 44 22Z" fill="#ffaaac"/></svg>' });
  const board = (title, k) => h('div', {}, h('h4', {}, h('span', {}, title), spark()), h('div.lb-t', {}, ...[0, 5, 1, 6, 2, 7, 3, 8, 4, 9].map((i) => { const [n, v] = lbRows[(i + k) % 10]; return h('div', {}, h('b', {}, `#${i + 1}`), ...person(PEOPLE[(i + k) % 8]).slice(0, 1), n, h('em', {}, Math.round(v * (1 - k * 0.12) - i * 37).toLocaleString('en-US'))); })));
  const GAMES = [['Flipart', '#ffaaac'], ['Pile-Up Poker', '#5dbafc'], ['Typeshift', '#d298ff'], ['Crossword', '#5dbafc'], ['CubeClear', '#ddd'], ['Really Bad Chess', '#ffd23f'], ['SpellTower', '#ddd'], ['Bongo', '#fff'], ['Memoku', '#fff'], ['Circuits', '#c8f0d0']];
  const pz = h('div.pz', {}, h('div.pz-top', {}, h('div.pz-brand', {}, h('div.pz-logo', {}, 'Puzzmo', h('sup', {}, '✦')), h('div.pz-by', {}, 'by Orta, Zach & Friends')), dl, h('div.pz-right', {}, h('button.pz-pill', {}, 'Log in'), h('button.pz-pill', {}, 'Join'))),
    h('div.pz-sub', {}, 'Play your first game!'), h('div.pz-cols', {}, ...cols),
    h('div.lb', {}, h('h2', {}, 'Leaderboards'), h('div.lb-g', {}, board('Today’s daily score', 0), board('Today’s top 3 game scores', 3), board('Best Wednesday daily score ever', 5), board('Best October score total', 7))),
    h('div.pz-games', {}, ...GAMES.map(([n, c]) => h('span', {}, h('i', { style: { background: c, border: '1px solid #0002' }, html: ICON.cw }), n))),
    h('div.pz-foot', {}, h('div.lg', {}, 'Puzzmo'), h('div', {}, 'The (new) place for thoughtful puzzles.'), h('div', { style: { fontSize: '12px', marginTop: '24px', color: '#555' } }, '© 2026 Puzzmo, Inc. · Dictionary powered by Wordnik')));
  render(); root.append(pz);
  window.__demoProof = async () => {
    const out = []; const t0 = cols[0].querySelector('.pz-title').textContent;
    dl.click(); out.push(`menu open=${menu.classList.contains('on')}`); menu.children[1].click(); await sleep(50); out.push(`date→"${DATES[1]}" title "${t0.trim()}"→"${cols[0].querySelector('.pz-title').textContent.trim()}"`);
    di = 0; render();
    const k = W1.cells.findIndex((c) => !c.classList.contains('blk')); sel(W1, k); typeCW(W1, 'p'); typeCW(W1, 'u'); out.push(`crossword typed "${W1.cells[k].textContent.replace(/\d/g, '')}" sel=${W1.k} status=${W1.st.textContent}`);
    const before = FA.pcs.filter((p) => p.flipped).length; FA.pcs.filter((p) => p.flipped).forEach((p) => p.el.click()); await sleep(600); out.push(`flipart flipped ${before} → ${FA.msg.textContent} (${FA.st.textContent})`);
    const fx = HC.cur.findIndex((t, i) => t !== i); if (fx >= 0) { const j = HC.cur.indexOf(fx); HC.tap(fx); HC.tap(j); } out.push(`hue swap tile ok=${HC.cur[fx] === fx}`);
    CI.blanks[0].inp.value = 'high'; CI.blanks[0].test(); out.push(`circuits HIGH ok=${CI.blanks[0].ok} status=${CI.st.textContent}`);
    TS.shift(2, -1); const w = TS.word(); out.push(`typeshift word=${w} found=[${[...TS.got].join(',')}]`);
    const s1 = clockEls.s.textContent; await sleep(1100); out.push(`countdown ${s1}→${clockEls.s.textContent}`);
    YN.querySelector('.yn-b button').click(); out.push(`news more=${YN.classList.contains('open')}`);
    di = 0; render(); root.scrollTop = 0; return out.join('; ') + '; restored';
  };
};
V['gumroad-pink-coin-brutalist-landing'] = (root, T) => {
  import('@fontsource-variable/dm-sans');
  theme(root, T, { bg: '#f4f4f0', fg: '#000', ac: '#ff90e8', dark: false }); scroll(root);
  const F = "'DM Sans Variable',Avenir,Montserrat,sans-serif", PINK = '#ff90e8', YEL = '#ffc900';
  root.append(h('style', {}, `.gr{font:400 16px/1.45 ${F};color:#000;background:#f4f4f0;min-height:100%;overflow-x:hidden;letter-spacing:-.005em}.gr button,.gr input{font-family:${F}}.gr button{cursor:pointer}
.gr-nav{position:sticky;top:0;z-index:20;height:80px;background:#fff;border-bottom:1px solid #000;display:flex;align-items:center;padding-left:32px}
.gr-logo{font:800 34px/1 ${F};letter-spacing:-.045em;text-transform:uppercase;transform:scaleY(.92)}
.gr-gh{display:inline-flex;align-items:center;gap:6px;border:1px solid #000;border-radius:99px;padding:4px 10px;font-size:13.5px;margin-left:8px}
.gr-links{position:relative;display:flex;margin-left:auto;margin-right:24px}.gr-links a{position:relative;z-index:1;padding:10px 18px;border-radius:99px;font-size:17px;cursor:pointer;transition:color .25s}.gr-links a.on{color:#fff}.gr-links a:not(.on):hover{box-shadow:inset 0 0 0 1px #000}
.gr-ind{position:absolute;top:0;height:100%;background:#000;border-radius:99px;transition:left .35s cubic-bezier(.4,1.4,.5,1),width .35s}
.gr-login{height:100%;display:flex;align-items:center;padding:0 24px;border-left:1px solid #000;font-size:17px}.gr-ss{height:100%;display:flex;align-items:center;padding:0 26px;background:#000;color:#fff;font-size:17px;transition:background .2s,color .2s;cursor:pointer}.gr-ss:hover{background:${PINK};color:#000}
.gr-hero{position:relative;height:700px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.gr-hero h1{font:400 98px/1.05 ${F};letter-spacing:-.03em;margin:0 0 28px}.gr-hero p{font-size:23px;line-height:1.4;max-width:760px;margin:0 0 32px}
.gr-cta{display:flex;gap:16px;align-items:center}.gr-btn{background:#000;color:#fff;border:1px solid #000;border-radius:4px;padding:0 40px;height:64px;font-size:20px;transition:transform .15s,box-shadow .15s,background .15s}.gr-btn:hover{transform:translate(-4px,-4px);box-shadow:4px 4px 0 #000;background:${PINK};color:#000}
.gr-search{display:flex;align-items:center;width:420px;height:64px;border:1px solid #000;border-radius:4px;background:#f4f4f0;padding:0 12px 0 30px;gap:8px}.gr-search input{all:unset;flex:1;font-size:20px;text-align:left}.gr-search input::placeholder{color:#777}.gr-search button{width:42px;height:42px;border:1px solid #000;border-radius:4px;background:#fff;display:flex;align-items:center;justify-content:center}
.gr-fork{margin-top:30px;font-size:15px;color:#777}.gr-fork u{text-underline-offset:2px}
.gr-coin{position:absolute;will-change:transform;transition:transform .5s cubic-bezier(.2,.7,.3,1);z-index:4}.gr-coin>div{animation:grfl 5s ease-in-out infinite}.gr-coin svg{display:block;width:100%;height:auto;cursor:pointer;overflow:visible}.gr-coin.spin svg{animation:grsp .9s cubic-bezier(.3,.8,.4,1)}
@keyframes grfl{50%{transform:translateY(-14px) rotate(3deg)}}@keyframes grsp{to{transform:rotateY(360deg)}}
.gr-wrap{max-width:1240px;margin:0 auto;padding:0 40px}.gr-feat{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:0;position:relative;z-index:3}
.gr-card{background:#fff;border:1px solid #000;border-radius:8px;padding:34px;min-height:420px;position:relative;overflow:hidden;transition:transform .15s,box-shadow .15s}.gr-card:hover{transform:translate(-4px,-4px);box-shadow:4px 4px 0 #000}.gr-card h2{font:400 36px/1.15 ${F};margin:0 0 16px;letter-spacing:-.02em}.gr-card p{font-size:16px;max-width:340px}.gr-card.w2{grid-column:span 2}
.gr-mock{position:absolute;border:1.5px solid #000;border-radius:8px;background:#fff;box-shadow:4px 4px 0 #000;overflow:hidden;font-size:12px}.gr-mock .bar{height:16px;border-bottom:1.5px solid #000;display:flex;gap:3px;align-items:center;padding-left:6px}.gr-mock .bar i{width:5px;height:5px;border-radius:50%;background:#ff5f57}.gr-mock .bar i+i{background:#febc2e}.gr-mock .bar i+i+i{background:#28c840}
.gr-li{display:flex;gap:12px;align-items:flex-start;margin:14px 0;font-size:15px}.gr-li i{flex:none;width:22px;height:22px;border-radius:50%;background:${PINK};border:1.5px solid #000;position:relative}.gr-li i:after{content:'';position:absolute;inset:6px;border-radius:50%;background:#000}
.gr-ills{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0 0}.gr-ill{background:#fff;border:1px solid #000;border-radius:8px;height:440px;position:relative;overflow:hidden}
.gr-bub{position:absolute;background:#fff;border:1.5px solid #000;border-radius:10px;padding:10px 16px;font-size:15px;box-shadow:3px 3px 0 #000;z-index:2}
.gr-h2{font:400 56px/1.15 ${F};text-align:center;letter-spacing:-.025em;margin:120px 0 60px}
.gw{position:relative;width:1000px;height:260px;margin:0 auto;background:${YEL};border:1px solid #000;border-radius:130px}.gw svg.track{position:absolute;inset:0}
.gw-l{position:absolute;transform:translate(-50%,-50%);background:${YEL};border:0;border-radius:99px;padding:6px 14px;font:500 17px ${F};white-space:nowrap;transition:background .25s,color .25s}.gw-l.tab:hover{box-shadow:inset 0 0 0 1px #000}.gw-l.on{background:#000;color:#fff}.gw-l.ttl{cursor:default}
.gw-guy{position:absolute;left:0;top:0;width:58px;height:81px;offset-anchor:50% 62%;offset-rotate:0deg;transition:offset-distance 1.1s cubic-bezier(.45,.05,.3,1);pointer-events:none;z-index:3}
.gw-copy{text-align:center;max-width:860px;margin:40px auto 0;min-height:250px}.gw-copy h2{font:400 54px/1.12 ${F};letter-spacing:-.025em;margin:0 0 20px;animation:gwin .45s}.gw-copy p{font-size:19px;max-width:620px;margin:0 auto 26px;animation:gwin .45s .05s both}
@keyframes gwin{from{opacity:0;transform:translateY(14px)}}.gr-sbtn{background:#000;color:#fff;border:1px solid #000;border-radius:4px;padding:14px 26px;font-size:17px;transition:transform .15s,box-shadow .15s,background .15s}.gr-sbtn:hover{transform:translate(-4px,-4px);box-shadow:4px 4px 0 #000;background:${PINK};color:#000}
.gr-stat{text-align:center;margin:120px 0 50px}.gr-stat b{display:block;font:400 190px/1 ${F};letter-spacing:-.045em;font-variant-numeric:tabular-nums}.gr-stat p{font-size:24px;max-width:470px;margin:18px auto 0;line-height:1.3}
.mq{overflow:hidden;padding:10px 0;-webkit-mask:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}.mq-t{display:flex;gap:24px;width:max-content;animation:mq 60s linear infinite}.mq.rev .mq-t{animation-direction:reverse}.mq.paused .mq-t{animation-play-state:paused}@keyframes mq{to{transform:translateX(-50%)}}
.gr-tst{width:520px;flex:none;background:#fff;border:1px solid #000;border-radius:8px;padding:28px;font-size:16px;transition:transform .15s,box-shadow .15s}.gr-tst:hover{transform:translate(-4px,-4px);box-shadow:4px 4px 0 #000}.gr-tst q{display:block;quotes:none;margin-bottom:20px}.gr-tst q:before{content:'❝';display:block;font-size:22px;line-height:1;margin-bottom:8px}.gr-tst .who{display:flex;gap:12px;align-items:center}.gr-tst .who i{width:42px;height:42px;border-radius:50%;border:1px solid #000}.gr-tst small{display:block;font-size:12.5px;color:#555}
.gr-tag{display:flex;align-items:center;gap:10px;font-size:18px;white-space:nowrap;padding:4px 6px;border-radius:99px;transition:background .2s}.gr-tag:hover{background:#fff;box-shadow:inset 0 0 0 1px #000}.gr-tag i{width:30px;height:30px;border-radius:6px;border:1.5px solid #000;display:inline-block}
.gr-end{text-align:center;padding:110px 0 120px}.gr-end h2{font:400 64px/1.1 ${F};letter-spacing:-.03em;margin:0 0 34px}
.gr-foot{background:#000;color:#fff;padding:60px 40px;display:flex;gap:40px;align-items:flex-start}.gr-foot h3{font:400 40px/1.1 ${F};margin:0;max-width:520px;letter-spacing:-.02em}.gr-foot .em{display:flex;margin-left:auto;border:1px solid #fff;border-radius:4px;overflow:hidden}.gr-foot input{all:unset;padding:16px;width:280px;font-size:17px}.gr-foot button{background:${PINK};border:0;padding:0 22px;font-size:17px}`));
  // 3D G-coin: back rim, side band and tilted face with a black G
  const coin = (id) => s('svg', { viewBox: '0 0 220 200' }, s('defs', {}, s('clipPath', { id: 'gc' + id }, s('ellipse', { cx: 104, cy: 92, rx: 92, ry: 72 }))),
    s('path', { d: 'M12 92 L12 116 A92 72 0 0 0 196 116 L196 92 Z', fill: PINK, stroke: '#000', 'stroke-width': 3, 'stroke-linejoin': 'round' }),
    ...[30, 50, 70, 90, 110, 130, 150, 170].map((x) => s('line', { x1: x, y1: 92 + 72 * Math.sqrt(1 - ((x - 104) / 92) ** 2), x2: x, y2: 116 + 72 * Math.sqrt(1 - ((x - 104) / 92) ** 2), stroke: '#000', 'stroke-width': 1.4, opacity: 0.55 })),
    s('ellipse', { cx: 104, cy: 92, rx: 92, ry: 72, fill: PINK, stroke: '#000', 'stroke-width': 3 }), s('ellipse', { cx: 104, cy: 92, rx: 78, ry: 60, fill: 'none', stroke: '#000', 'stroke-width': 1.2, opacity: 0.25 }),
    s('text', { x: 104, y: 92, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-family': F, 'font-weight': 900, 'font-size': 104, transform: 'translate(104 92) scale(1 .8) skewX(-8) translate(-104 -92)' }, 'G'));
  const COINS = [[30, 150, 190, -28, 0.6], [-40, 390, 230, 12, 1.1], [1200, 90, 150, 18, 0.5], [1300, 400, 200, 62, 0.9], [1010, 540, 190, -14, 0.8]];
  const coins = COINS.map(([x, y, w, rot, depth], i) => { const el = h('div.gr-coin', { style: { left: x + 'px', top: y + 'px', width: w + 'px' } }, h('div', { style: { animationDelay: `${-i * 1.3}s`, animationDuration: `${4.4 + i * 0.7}s` } }, h('div', { style: { transform: `rotate(${rot}deg)` } }, coin(i)))); el.depth = depth; el.querySelector('svg').onclick = () => { el.classList.remove('spin'); void el.offsetWidth; el.classList.add('spin'); }; return el; });
  const hero = h('div.gr-hero', {}, ...coins, h('h1', {}, 'Go from 0 to $1'), h('p', {}, 'Anyone can earn their first dollar online. Just start with what you know, see what sticks, and get paid. It’s that easy.'),
    h('div.gr-cta', {}, h('button.gr-btn', { onclick: () => toast('Let’s make your first product ✦') }, 'Start selling'), h('label.gr-search', {}, h('input', { placeholder: 'Search marketplace ...' }), h('button', { html: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#000" stroke-width="2"><circle cx="8.5" cy="8.5" r="6"/><path d="M13 13l5 5"/></svg>' }))),
    h('div.gr-fork', { html: 'Contribute or fork on <svg width="13" height="13" viewBox="0 0 16 16" style="vertical-align:-2px"><path fill="#777" d="M8 0a8 8 0 0 0-2.5 15.6c.4 0 .5-.2.5-.4v-1.5C3.8 14.2 3.3 12.6 3.3 12.6c-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7 0-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1 0-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.8-3.6 4 .3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 8 0z"/></svg> <u>GitHub</u>' }));
  let mx = 0, my = 0; const parallax = (e) => { const r = hero.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5; coins.forEach((c) => (c.style.transform = `translate(${mx * -60 * c.depth}px,${my * -50 * c.depth}px)`)); };
  hero.addEventListener('pointermove', parallax); hero.addEventListener('pointerleave', () => coins.forEach((c) => (c.style.transform = '')));
  // nav with sliding black pill
  const LINKS = ['Discover', 'Blog', 'Pricing', 'Features', 'About', 'Gumclaw']; const ind = h('div.gr-ind'); let navOn = 4;
  const links = LINKS.map((l, i) => h('a', { onclick: () => setNav(i) }, l)); const linkBox = h('div.gr-links', {}, ind, ...links);
  const setNav = (i) => { navOn = i; links.forEach((a, j) => a.classList.toggle('on', j === i)); ind.style.left = links[i].offsetLeft + 'px'; ind.style.width = links[i].offsetWidth + 'px'; };
  const nav = h('div.gr-nav', {}, h('div.gr-logo', {}, 'Gumroad'), h('span.gr-gh', { html: '<svg width="15" height="15" viewBox="0 0 16 16"><path d="M8 0a8 8 0 0 0-2.5 15.6c.4 0 .5-.2.5-.4v-1.5C3.8 14.2 3.3 12.6 3.3 12.6c-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7 0-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1 0-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.8-3.6 4 .3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 8 0z"/></svg>9.7K ★' }), linkBox, h('a.gr-login', {}, 'Log in'), h('a.gr-ss', {}, 'Start selling'));
  // feature cards with illustrations
  const blob = (w, col = PINK) => s('svg', { viewBox: '0 0 100 140', width: w }, s('path', { d: 'M50 6c22 0 36 16 30 34-3 10 8 16 4 30-4 12-18 12-24 8v20h-20V78c-8 4-22 2-24-10-3-12 8-18 4-28C12 22 28 6 50 6z', fill: col, stroke: '#000', 'stroke-width': 3 }), s('circle', { cx: 42, cy: 44, r: 7, fill: '#fff', stroke: '#000', 'stroke-width': 2.5 }), s('circle', { cx: 44, cy: 45, r: 3 }), s('path', { d: 'M30 140V112q20-10 40 0v28', fill: YEL, stroke: '#000', 'stroke-width': 3 }));
  const prodMock = h('div.gr-mock', { style: { left: '330px', top: '24px', width: '380px', height: '300px' } }, h('div.bar', {}, h('i'), h('i'), h('i')), h('div', { style: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', height: '100%' } }, h('div', { style: { padding: '12px', borderRight: '1.5px solid #000' } }, h('div', { style: { fontSize: '11px' } }, 'My Product'), h('div', { style: { fontSize: '17px', margin: '4px 0 10px' } }, 'How to Play Ukelele'), h('div', { style: { background: '#23a094', border: '1.5px solid #000', borderRadius: '4px', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden' } }, blob(90))), h('div', { style: { padding: '12px' } }, ...['#23a094', '#ffc900', '#ff90e8'].map((c) => h('div', { style: { height: '44px', border: '1.5px solid #000', borderRadius: '4px', background: c, marginBottom: '8px' } })))));
  const tag$ = h('div.gr-mock', { style: { left: '520px', top: '250px', width: '150px', padding: '8px', transform: 'rotate(-4deg)' } }, h('div', { style: { fontSize: '12px' } }, 'How to Play Ukelele'), h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '6px' } }, h('span', {}, 'Add to cart'), h('b', { style: { background: PINK, padding: '0 6px', border: '1px solid #000' } }, '$5')));
  const chart = h('div.gr-mock', { style: { left: '34px', right: '-20px', top: '200px', height: '200px', padding: '14px' } }, h('div', { style: { display: 'flex', gap: '24px', fontSize: '13px' } }, h('div', {}, h('b', { style: { fontSize: '20px', fontWeight: 400 } }, '481'), h('div', {}, '● Sales')), h('div', {}, h('b', { style: { fontSize: '20px', fontWeight: 400 } }, '$201,083'), h('div', {}, '● Revenue'))), s('svg', { viewBox: '0 0 300 100', width: '100%', height: 110 }, s('path', { d: 'M0 80 L30 60 60 70 90 40 120 55 150 30 180 46 210 22 240 38 270 18 300 26', fill: 'none', stroke: PINK, 'stroke-width': 3 }), ...[30, 90, 150, 210, 270].map((x) => s('circle', { cx: x, cy: { 30: 60, 90: 40, 150: 30, 210: 22, 270: 18 }[x], r: 4, fill: PINK, stroke: '#000', 'stroke-width': 1.5 }))));
  const apps = h('div', { style: { position: 'absolute', right: '30px', top: '30px', display: 'grid', gap: '12px' } }, ...[['#23a094', 'G'], ['#ff5c3a', '✱'], [YEL, '☀'], ['#90a8ed', 'W']].map(([c, t]) => h('div', { style: { width: '48px', height: '48px', borderRadius: '10px', border: '1.5px solid #000', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', boxShadow: '3px 3px 0 #000' } }, t)));
  const store = h('div.gr-mock', { style: { right: '110px', top: '40px', width: '300px', height: '170px', padding: '10px' } }, h('div', { style: { fontWeight: 800, letterSpacing: '-.04em', fontSize: '18px' } }, 'GUMROAD'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginTop: '10px' } }, ...[PINK, '#23a094', YEL].map((c) => h('div', { style: { height: '90px', border: '1.5px solid #000', borderRadius: '4px', background: c } }))));
  const feat = h('div.gr-feat', {}, h('div.gr-card.w2', {}, h('h2', {}, 'Sell anything'), h('p', { style: { marginTop: '250px', maxWidth: '300px' } }, 'Video lessons. Monthly subscriptions. Whatever! Gumroad was created to help you experiment with all kinds of ideas and formats.'), prodMock, tag$),
    h('div.gr-card', {}, h('h2', {}, 'Make your own road'), h('p', {}, 'Whether you need more balance, flexibility, or just a different gig, we make it easy to chart a new path.'), chart),
    h('div.gr-card', {}, h('h2', {}, 'Sell to anyone'), ...['Go from 0 to $1 and automated workflows.', 'Let your customers pay in their own currency.', 'Choose between one-time, recurring, or fixed-length payments in your currency of choice.'].map((t) => h('div.gr-li', {}, h('i'), t))),
    h('div.gr-card.w2', {}, h('h2', {}, 'Sell anywhere'), h('p', { style: { marginTop: '200px', maxWidth: '360px' } }, 'Create and customize your storefront with our all-in-one platform or choose to use your personal site instead. Seamlessly connect your Gumroad account to thousands of apps in your current stack.'), store, apps));
  const ill = (bubA, bubB, bg, flip) => h('div.gr-ill', {}, h('div', { style: { position: 'absolute', left: '50%', top: '50%', width: '360px', height: '360px', margin: '-180px', borderRadius: '50%', background: bg, border: '1.5px solid #000' } }), h('div', { style: { position: 'absolute', left: '50%', bottom: '40px', transform: `translateX(-50%) ${flip ? 'scaleX(-1)' : ''}` } }, blob(170)), h('div.gr-bub', { style: { left: '40px', top: '40px' } }, bubA), bubB ? h('div.gr-bub', { style: { right: '40px', bottom: '40px' } }, bubB) : null);
  // The Gumroad Way racetrack + tabs + walking character
  const L = 1988, TABS = [['Start Small', 560, 720, 30, 'We want you to try them, lots of them, and find out what works.', 'You don’t have to be a tech expert or even understand how to start a business. You just gotta take what you know and sell it.'], ['Learn Quickly', 1114, 720, 230, 'Ship it, see what sticks, and keep what works.', 'Every sale is feedback. Watch what people buy, tweak the price or format, and try again tomorrow — no committee required.'], ['Get Better Together', 1554, 280, 230, 'Grow alongside creators who are doing the same thing.', 'Swap notes, share audiences and bundle up. Your first customers are often other creators who get it.']];
  const guy = h('div.gw-guy', { style: { offsetPath: "path('M160 30 H840 A100 100 0 0 1 840 230 H160 A100 100 0 0 1 160 30 Z')" } }, blob(58)); let wayOn = 0, dist = 450;
  const copyBox = h('div.gw-copy');
  const tabEls = TABS.map(([n, d, x, y], i) => h('button.gw-l.tab', { style: { left: x + 'px', top: y + 'px' }, onclick: () => setWay(i) }, n));
  const setWay = (i, instant) => { const d = TABS[i][1] - 110; let delta = (d - (dist % L) + L) % L; if (i === wayOn && !instant) delta = 0; dist += delta; if (instant) { guy.style.transition = 'none'; dist = d; } guy.style.offsetDistance = dist + 'px'; if (instant) { void guy.offsetWidth; guy.style.transition = ''; } wayOn = i; tabEls.forEach((t, j) => t.classList.toggle('on', j === i)); copyBox.replaceChildren(h('h2', {}, TABS[i][4]), h('p', {}, TABS[i][5]), h('button.gr-sbtn', {}, 'Find out how')); };
  const way = h('div.gw', {}, s('svg', { class: 'track', viewBox: '0 0 1000 260', width: 1000, height: 260 }, s('path', { d: 'M160 30 H840 A100 100 0 0 1 840 230 H160 A100 100 0 0 1 160 30 Z', fill: 'none', stroke: '#000', 'stroke-width': 1.5 }), ...[[420, 30, 0], [600, 230, 180], [940, 130, 90], [60, 130, 270]].map(([x, y, a]) => s('path', { d: 'M-7 -6 L4 0 L-7 6', fill: 'none', stroke: '#000', 'stroke-width': 1.5, transform: `translate(${x} ${y}) rotate(${a})` }))), h('span.gw-l.ttl', { style: { left: '250px', top: '30px' } }, 'The Gumroad Way'), ...tabEls, guy);
  // stat count-up
  const statB = h('b', {}, '$0'); const TARGETV = 2276095; let counted = false;
  const runCount = (instant) => { counted = true; const t0 = performance.now(); const st = (now) => { const k = instant ? 1 : Math.min(1, (now - t0) / 1600); statB.textContent = '$' + Math.round(TARGETV * (1 - (1 - k) ** 4)).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); if (instant) statB.textContent = '$' + TARGETV.toLocaleString('en-US'); };
  const stat = h('div.gr-stat', {}, statB, h('p', {}, 'The amount of income earned by Gumroad digital entrepreneurs last week.'));
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && !counted && runCount()), { root, threshold: 0.4 }); io.observe(stat);
  // marquees (pause on hover)
  const TST = [['I launched MaxPacks as an experimental side gig; but within 2 years those Procreate brushes were earning more than my 6-figure salary in CG.', 'Max Ulichney', 'Sells Procreate brush packs', '#f1c27d'], ['For years, I had a goal to develop ‘passive’ income streams, but struggled to make that a reality. Last year I started selling informational products and have made $10k+ per month.', 'Steph Smith', 'Sells content tutorials', '#c8a2c8'], ['Originally, I took pre-orders for my Trend Reports on Gumroad. But I received... exactly $0. So I changed tactics: half free, half paid. Today, 99% of revenue is recurring.', 'trendsvc', 'Sells business insights and expertise', '#23a094'], ['I love Gumroad because it can’t be any simpler. I upload a file, set a price, and I can start selling on the internet. The money lands in my bank account every Friday.', 'Daniel Vassallo', 'Sells business insights and expertise', '#e9a05b']];
  const marquee = (items, rev) => { const m = h('div.mq' + (rev ? '.rev' : ''), {}, h('div.mq-t', {}, ...items, ...items.map((n) => n.cloneNode(true)))); m.addEventListener('mouseenter', () => m.classList.add('paused')); m.addEventListener('mouseleave', () => m.classList.remove('paused')); return m; };
  const mqT = marquee(TST.map(([q, n, r, c]) => h('div.gr-tst', {}, h('q', {}, q), h('div.who', {}, h('i', { style: { background: c } }), h('div', {}, h('b', { style: { fontWeight: 500 } }, n), h('small', {}, r))))));
  const TAGS = ['blender', 'meditation', 'comic', 'notion template', 'textures', 'procreate', '3d model', 'hypnosis', 'manga', 'investing', 'mockup', 'brushes', 'spark ar', 'anime', 'instagram', 'font', 'art', 'after effects', 'education', 'fitness', 'sci-fi', 'vrchat', 'ableton', 'vj loops', 'poetry', 'sample pack', 'luts', 'yoga', 'fiction', 'sheet music'];
  const TC = [PINK, '#23a094', YEL, '#90a8ed', '#ff7051', '#e2d2ff'];
  const tagRow = (off, rev) => marquee(TAGS.slice(off).concat(TAGS.slice(0, off)).map((t, i) => h('span.gr-tag', {}, h('i', { style: { background: TC[(i + off) % TC.length], borderRadius: i % 3 ? '6px' : '50%' } }), t)), rev);
  const gr = h('div.gr', {}, nav, hero, h('div.gr-wrap', {}, feat, h('div.gr-ills', {}, ill('Instead of building a company...', null, '#23a094'), ill('...start selling a side project!', 'SALES!', YEL, true)), h('div.gr-h2', {}, 'You know all those great ideas you have?'), way, copyBox, stat), mqT,
    h('div', { style: { textAlign: 'center', margin: '110px 0 30px' } }, h('div', { style: { font: `400 56px ${F}`, letterSpacing: '-.025em' } }, 'Unlimited possibilities'), h('p', { style: { fontSize: '20px' } }, 'Discover the best-selling products and creators on Gumroad')), tagRow(0), tagRow(11, true), tagRow(21),
    h('div.gr-wrap', {}, h('div.gr-ills', { style: { marginTop: '90px' } }, h('div.gr-ill', { style: { display: 'flex', alignItems: 'flex-end', padding: '40px', height: '300px' } }, h('div', { style: { font: `400 44px/1.1 ${F}` } }, 'Don’t take risks.', h('br'), 'That’s scary!')), h('div.gr-ill', { style: { display: 'flex', alignItems: 'flex-end', padding: '40px', height: '300px', background: YEL } }, h('div', { style: { font: `400 44px/1.1 ${F}` } }, 'Place small bets.', h('br'), 'That’s exciting!')))),
    h('div.gr-end', {}, h('h2', {}, 'Share your work.', h('br'), 'Someone out there needs it.'), h('button.gr-btn', {}, 'Start selling')),
    h('div.gr-foot', {}, h('h3', {}, 'Subscribe to get tips and tactics to grow the way you want.'), h('div.em', {}, h('input', { placeholder: 'Your email address' }), h('button', {}, '→'))));
  root.append(gr); requestAnimationFrame(() => setNav(navOn)); document.fonts?.ready.then(() => setNav(navOn)); setTimeout(() => setNav(navOn), 600); window.addEventListener('resize', () => setNav(navOn)); setWay(0, true);
  window.__demoProof = async () => {
    const out = []; setNav(2); await sleep(400); out.push(`nav pill → ${links[2].textContent} (left=${ind.style.left})`); setNav(4);
    const r = hero.getBoundingClientRect(); parallax({ clientX: r.left + r.width * 0.9, clientY: r.top + r.height * 0.8 }); out.push(`coin parallax ${coins[0].style.transform}`);
    coins[1].querySelector('svg').dispatchEvent(new MouseEvent('click', { bubbles: true })); out.push(`coin spin=${coins[1].classList.contains('spin')}`);
    const h0 = copyBox.querySelector('h2').textContent; setWay(1); await sleep(80); out.push(`way tab "Learn Quickly": "${h0.slice(0, 22)}…"→"${copyBox.querySelector('h2').textContent.slice(0, 22)}…" guy@${guy.style.offsetDistance}`); setWay(2); out.push(`→ Get Better Together active=${tabEls[2].classList.contains('on')}`);
    mqT.dispatchEvent(new MouseEvent('mouseenter')); out.push(`marquee hover paused=${getComputedStyle(mqT.firstChild).animationPlayState}`); mqT.dispatchEvent(new MouseEvent('mouseleave'));
    runCount(true); out.push(`stat=${statB.textContent}`);
    coins.forEach((c) => { c.style.transform = ''; c.classList.remove('spin'); }); setWay(0, true); root.scrollTop = 0; return out.join('; ') + '; restored';
  };
};
V['things-app-tour-mac-ios-toggle'] = (root, T) => {
  import('@fontsource-variable/roboto-flex');
  theme(root, T, { bg: '#d5d9de', fg: '#303336', ac: '#3d82f6', dark: false }); scroll(root);
  const F = "-apple-system,BlinkMacSystemFont,'Roboto Flex Variable',Roboto,sans-serif", BLUE = '#3d82f6';
  root.append(h('style', {}, `.th{font:400 18px/1.55 ${F};color:#303336;background:#d5d9de;min-height:100%}.th button{font-family:${F};cursor:pointer}
.th-in{width:900px;margin:0 auto}.th-nav{display:flex;align-items:center;height:68px;border-bottom:1px solid #b9bec5;margin-top:4px}.th-nav b{display:flex;align-items:center;gap:8px;font-size:20px;color:#2c3138}.th-nav nav{margin-left:auto;display:flex;gap:24px;font-size:15px;color:#6b7178}.th-nav nav a{cursor:pointer}.th-nav nav a:hover{color:#2c3138}
.th h1,.th h2{font:700 36px/1.22 ${F};color:#2c3138;text-align:center;margin:0}.th h1 em{font-style:italic}.th .lead{max-width:440px;margin:18px auto 0;text-align:center;color:#4a4f55;font-size:18.5px;line-height:1.5}
.th-hero{padding:110px 0 0}.th-dev{position:relative;height:880px;margin-top:80px}
.mw{position:absolute;background:#fff;border-radius:7px;box-shadow:0 0 0 .5px #0000002e,0 18px 50px #0000002b,0 3px 8px #0000001a;overflow:hidden;font:13px/1.35 ${F};color:#2c3138;display:flex;flex-direction:column}
.mw-tb{height:22px;display:flex;align-items:center;gap:5px;padding:0 8px;flex:none;position:absolute;left:0;right:0;top:0}.mw-tb i{width:9px;height:9px;border-radius:50%;box-shadow:inset 0 0 0 1px #c4c6ca}.mw-tb span{margin:0 auto;font-size:10.5px;color:#888}
.mw-b{display:flex;flex:1;min-height:0}.mw-sb{width:150px;background:#f4f5f7;padding:28px 8px 8px;font-size:11.5px;flex:none;overflow:hidden}.mw-sb div{display:flex;align-items:center;gap:7px;padding:3px 6px;border-radius:4px;cursor:pointer;white-space:nowrap}.mw-sb div:hover{background:#e9ebef}.mw-sb div.on{background:#dfe2e7}.mw-sb div em{margin-left:auto;font-style:normal;color:#999;font-size:10.5px}.mw-sb .gap{height:10px;pointer-events:none}.mw-sb .area{font-weight:600;margin-top:4px}
.bd{background:#f97597;color:#fff;border-radius:7px;padding:0 5px;font-size:9.5px;margin-left:auto}
.mw-main{flex:1;padding:36px 34px 10px;overflow:hidden;position:relative}.mw-h{display:flex;align-items:center;gap:9px;font:700 21px ${F};margin-bottom:8px}.mw-note{font-size:11.5px;color:#555;max-width:380px;margin-bottom:12px}
.chips{display:flex;gap:6px;margin-bottom:12px;font-size:10.5px;color:#888}.chips span{padding:1px 7px;border-radius:9px}.chips span.on{background:#bfc3c9;color:#fff}
.hd{color:${BLUE};font-weight:700;font-size:12px;border-bottom:1px solid #e4e6ea;padding:12px 0 5px;margin-bottom:5px;display:flex}.hd span{margin-left:auto;letter-spacing:1px}
.td{display:flex;align-items:flex-start;gap:9px;padding:3.5px 0;font-size:12px;cursor:default;border-radius:4px;transition:opacity .3s}.td .cb{flex:none;width:12px;height:12px;border:1.2px solid #b9bcc2;border-radius:3px;margin-top:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,border-color .2s}.td.done .cb{background:${BLUE};border-color:${BLUE}}.td.done .cb:after{content:'';width:3px;height:6px;border:solid #fff;border-width:0 1.6px 1.6px 0;transform:rotate(45deg) translate(-.5px,-1px)}.td.done .tx{color:#9a9da3}
.td small{display:block;font-size:9.5px;color:#9a9da3;line-height:1.2}.td .tag{border:1px solid #d5d7db;color:#999;border-radius:7px;padding:0 6px;font-size:9.5px;margin-left:4px}.td .date{background:#e8eaed;color:#555;border-radius:3px;padding:0 4px;font-size:10px;margin-right:4px}.td .fl{margin-left:auto;color:#f04a63;font-size:10px;white-space:nowrap}
.cal{background:#f1f2f4;border-radius:5px;padding:6px 9px;font-size:10.5px;line-height:1.45;margin-bottom:12px}.cal b{font-weight:500}.cal .t1{color:#4a90d9}.cal .t2{color:#7cb342}.cal .t3{color:#f5a623}
.ev{font-size:11.5px;color:#9a9da3;margin:8px 0 6px;display:flex;align-items:center;gap:6px;font-weight:700}.ev:before{content:'☾';color:${BLUE};font-size:13px}
.ph{position:absolute;background:#1b1c1f;border-radius:34px;padding:9px;box-shadow:0 20px 50px #0000003a,inset 0 0 0 2px #3a3b3f}.ph-s{background:#fff;border-radius:26px;height:100%;overflow:hidden;position:relative;font:12px/1.35 ${F};color:#2c3138;padding:0 14px}
.ph-st{display:flex;justify-content:space-between;align-items:center;height:30px;font-size:10.5px;font-weight:600;padding:0 10px}.ph-is{position:absolute;left:50%;top:7px;width:70px;height:20px;margin-left:-35px;background:#000;border-radius:12px}
.ph-fab{position:absolute;right:14px;bottom:20px;width:34px;height:34px;border-radius:50%;background:${BLUE};color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 10px #3d82f680}
.ipad{position:absolute;background:#1b1c1f;border-radius:26px;padding:12px;box-shadow:0 20px 50px #0000003a}.watch{position:absolute;width:150px;height:180px;background:#1b1c1f;border-radius:38px;padding:10px;box-shadow:0 20px 50px #0000003a}
.watch>div{background:#000;border-radius:30px;height:100%;color:#fff;font:11px ${F};display:flex;flex-direction:column;align-items:center;padding-top:12px}
.band{padding:100px 0}.band.b1{background:#eceef1}.band.b2{background:#f4f5f7}.band.b3{background:#e3e6ea}.band.b4{background:#eef0f3}
.ic{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0;flex:none}.ttl{display:flex;align-items:center;justify-content:center;gap:12px}
.card{background:#e3e6ea;border-radius:12px;padding:16px 20px;font-size:14.5px;line-height:1.5;color:#3a3e44}.b2 .card,.b4 .card{background:#e6e9ed}.card b{display:block;color:#2c3138}
.exp{width:400px;margin:60px auto 0;background:transparent;border-radius:6px;transition:background .35s,box-shadow .35s,padding .35s;padding:6px 14px;cursor:pointer;font:15px/1.4 ${F}}.exp.on{background:#fff;box-shadow:0 10px 34px #00000024,0 1px 3px #0000001a;padding:16px 18px;cursor:default}
.exp-r{display:flex;align-items:center;gap:12px}.exp-r i{width:14px;height:14px;border:1.4px solid #aaa;border-radius:3px}.exp-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.3,.7,.3,1)}.exp.on .exp-body{grid-template-rows:1fr}.exp-body>div{overflow:hidden;padding-left:26px}
.exp-ck{border-top:1px solid #eee;margin-top:10px}.exp-ck div{display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid #eee;cursor:pointer}.exp-ck div:before{content:'';width:9px;height:9px;border-radius:50%;border:2px solid ${BLUE}}.exp-ck div.ok:before{background:${BLUE}}.exp-ck div.ok{color:#aaa;text-decoration:line-through}
.exp-ft{display:flex;align-items:center;gap:8px;margin-top:14px;color:#2c3138}.exp-ft span{margin-left:auto;display:flex;gap:12px;color:#aaa}
.play{display:flex;align-items:center;justify-content:center;gap:6px;color:${BLUE};font-size:16px;margin:46px auto 0;background:none;border:0}.play i{width:22px;height:22px;border-radius:50%;background:${BLUE};display:inline-flex;align-items:center;justify-content:center}.play i:after{content:'';border-left:7px solid #fff;border-top:5px solid transparent;border-bottom:5px solid transparent;margin-left:2px}.play.run{opacity:.5}
.cards2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:40px;align-items:start}
.seg{display:flex;width:340px;margin:40px auto 0;background:#c9ced5;border-radius:8px;padding:2px;position:relative}.seg button{flex:1;border:0;background:none;padding:5px;font-size:14.5px;font-weight:500;color:#3a3e44;position:relative;z-index:1;transition:color .25s}.seg button.on{color:#fff}.seg i{position:absolute;top:2px;bottom:2px;left:2px;width:calc(50% - 2px);background:${BLUE};border-radius:6px;transition:transform .35s cubic-bezier(.4,1.3,.5,1)}.seg.ios i{transform:translateX(100%)}
.stage{display:grid;grid-template-columns:310px 1fr;gap:40px;margin-top:40px;align-items:center}.stage .cards{display:flex;flex-direction:column;gap:12px}.dv{position:relative;height:560px}.dv>*{transition:opacity .45s,transform .45s cubic-bezier(.3,.7,.3,1)}.dv .off{opacity:0;transform:translateY(24px) scale(.97);pointer-events:none}
.up-day{border-top:1px solid #e6e8eb;padding:8px 0 6px;min-height:48px;transition:background .2s}.up-day.over{background:#eef4ff}.up-day h5{margin:0 0 4px;display:flex;align-items:baseline;gap:6px;font:700 19px ${F}}.up-day h5 small{font-size:11px;color:#777;font-weight:500}.up-ev{font-size:10.5px;line-height:1.4}.up-day .td{cursor:grab;padding:3px 4px}.up-day .td:hover{background:#f3f5f8}
.ghost{position:fixed;z-index:99;pointer-events:none;background:#fff;box-shadow:0 8px 24px #0003;border-radius:5px;padding:4px 10px;font:12px ${F};transform:rotate(-2deg)}
.th-foot{text-align:center;padding:60px 0 80px;font-size:13px;color:#7a7f86}`));
  const logo = (sz = 20) => h('span', { html: `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="4.5" fill="${BLUE}"/><rect x="4" y="4" width="12" height="12" rx="2.5" fill="#fff"/><path d="M6.8 10.2l2.3 2.3 4.4-5" stroke="${BLUE}" stroke-width="2" fill="none" stroke-linecap="round"/></svg>` });
  const ico = (k, sz = 14) => ({ inbox: `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" rx="3" fill="#3d82f6"/><path d="M3.5 7.5h2l1 1.5h1l1-1.5h2" stroke="#fff" stroke-width="1.2" fill="none"/></svg>`, today: `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14"><path d="M7 1l1.8 3.8 4.2.5-3.1 2.9.8 4.1L7 10.3 3.3 12.3l.8-4.1L1 5.3l4.2-.5z" fill="#ffd02b"/></svg>`, upcoming: `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14"><rect x="1" y="2" width="12" height="11" rx="2.5" fill="#f2405f"/><rect x="3" y="6" width="8" height="5" rx="1" fill="#fff"/></svg>`, anytime: `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14"><path d="M1 4l6-3 6 3-6 3z" fill="#2fb3a1"/><path d="M1 7l6 3 6-3M1 10l6 3 6-3" stroke="#2fb3a1" stroke-width="1.5" fill="none"/></svg>`, someday: `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14"><rect x="1" y="2" width="12" height="10" rx="2" fill="#e7c86b"/><rect x="1" y="2" width="12" height="3.5" fill="#d4b44e"/></svg>`, logbook: `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14"><rect x="2" y="1" width="10" height="12" rx="2" fill="#53b54a"/><path d="M4.5 7l1.6 1.6L9.5 5" stroke="#fff" stroke-width="1.4" fill="none"/></svg>`, area: `<svg width="${sz}" height="${sz}" viewBox="0 0 14 14"><path d="M2 5l5-3 5 3v5l-5 3-5-3z" fill="none" stroke="#888" stroke-width="1.2"/></svg>` }[k]);
  const pie = (f, c = BLUE, sz = 12) => `<svg width="${sz}" height="${sz}" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="${c}" stroke-width="1.3"/><path d="M6 6V2.4A3.6 3.6 0 ${f > 0.5 ? 1 : 0} 1 ${6 + 3.6 * Math.sin(f * 6.283)} ${6 - 3.6 * Math.cos(f * 6.283)}Z" fill="${c}"/></svg>`;
  // ---- data ----
  const CAL = [['', 'Marc’s birthday'], ['t1', '7:00 AM Hit the gym with Alex'], ['t1', '8:30 AM Coffee with Sarah'], ['t2', '11:00 AM Team meeting'], ['t3', '3:30 PM Budget review']];
  const TODAY = [['Borrow Sarah’s travel guide', 'Vacation in Rome'], ['Finish expense report', 'Work', 'today'], ['Review quarterly data with Olivia', 'Prepare Presentation'], ['Organize catering', 'Plan Yearly Retreat'], ['Get car inspected', 'Family'], ['Confirm conference call for Wednesday', 'Work']];
  const EVE = [['Book a hotel room', 'Vacation in Rome'], ['Read article about nutrition', 'Run a Marathon'], ['Buy party decorations', 'Throw Party for Eve']];
  const LISTS = {
    Inbox: { ic: 'inbox', items: [['Call back the dentist'], ['Pick up dry cleaning']] },
    Today: { ic: 'today', today: true },
    Upcoming: { ic: 'upcoming', items: [['Make reservation for dinner', 'Throw Party for Eve'], ['Get copy of signed contract', 'Onboard James'], ['Call Mom and Dad', 'Family']] },
    Anytime: { ic: 'anytime', items: [['Research flights', 'Vacation in Rome'], ['Update résumé'], ['Clean out garage', 'Family']] },
    Someday: { ic: 'someday', items: [['Learn to play the ukulele'], ['Visit Iceland'], ['Build a treehouse']] },
    Logbook: { ic: 'logbook', items: [['Send invoice', 'Work', null, true], ['Renew passport', null, null, true]] },
    'Prepare Presentation': { pie: 0.35, note: 'Keep the talk and slides simple: what are the three things about this that everyone should remember?', heads: [['Slides and notes', [['Revise introduction'], ['Simplify slide layouts'], ['★ Review quarterly data with Olivia'], ['Print handouts for attendees', null, null, false, 'Nov 13']]], ['Preparation', [['Email John for presentation tips'], ['Check out book recommendations'], ['Time a full rehearsal', null, 'Important'], ['Do a practice run with Eric'], ['Confirm presentation time', null, 'Important']]], ['Facilities', [['Book the conference room']]]] },
  };
  const AREAS = [['Family', ['Vacation in Rome', 'Buy a New Car', 'Throw Party for Eve']], ['Work', ['Prepare Presentation', 'Onboard James', 'Attend Conference', 'Order Team T-Shirts']], ['Hobbies', ['Learn Basic Italian', 'Run a Marathon']]];
  const todo = ([t, sub, flag, done, date]) => { const el = h('div.td' + (done ? '.done' : ''), {}, h('span.cb', { onclick: (e) => { e.stopPropagation(); el.classList.toggle('done'); } }), h('div.tx', { style: { flex: 1 } }, date ? h('span.date', {}, date) : null, t.startsWith('★') ? [h('span', { style: { color: '#f5c518' } }, '★ '), t.slice(2)] : t, flag && flag !== 'today' ? h('span.tag', {}, flag) : null, sub ? h('small', {}, sub) : null), flag === 'today' ? h('span.fl', {}, '⚑ today') : null); return el; };
  const calBlock = () => h('div.cal', {}, ...CAL.map(([c, t]) => h('div', {}, c ? h('b', { class: c }, t.split(' ').slice(0, 2).join(' ') + ' ') : h('b', { style: { color: '#4a90d9' } }, '▍'), c ? t.split(' ').slice(2).join(' ') : t)));
  const todayList = () => [calBlock(), ...TODAY.map(todo), h('div.ev', {}, 'This Evening'), ...EVE.map(todo)];
  const mainFor = (name) => { const L0 = LISTS[name] || { pie: 0.6, items: [['Plan next steps'], ['Share notes with the team'], ['Follow up by Friday']] }; const head = h('div.mw-h', {}, L0.ic ? h('span', { html: ico(L0.ic, 20) }) : h('span', { html: pie(L0.pie ?? 0.5, BLUE, 18) }), name, L0.ic ? null : h('span', { style: { color: '#aaa', fontWeight: 400, fontSize: '16px' } }, '···'));
    if (L0.today) return [head, ...todayList()];
    if (L0.heads) return [head, h('div.mw-note', {}, L0.note), h('div.chips', {}, h('span.on', {}, 'All'), h('span', {}, 'Important'), h('span', {}, 'Diane'), h('span', {}, '···')), ...L0.heads.flatMap(([hd, items]) => [h('div.hd', {}, hd, h('span', {}, '···')), ...items.map(todo)])];
    return [head, ...L0.items.map(todo)]; };
  // ---- Mac window with clickable sidebar ----
  const macWin = (start, opts = {}) => { const main = h('div.mw-main'); const sb = h('div.mw-sb'); const W = { cur: start, main, sb };
    const item = (name, icon, extra) => { const d = h('div' + (name === W.cur ? '.on' : ''), { 'data-n': name, onclick: () => W.open(name) }, h('span', { html: icon }), name, extra); return d; };
    sb.append(item('Inbox', ico('inbox', 13), h('em', {}, '2')), h('div.gap'), item('Today', ico('today', 13), [h('span.bd', {}, '1'), h('em', { style: { marginLeft: '4px' } }, '8')]), item('Upcoming', ico('upcoming', 13)), item('Anytime', ico('anytime', 13)), item('Someday', ico('someday', 13)), h('div.gap'), item('Logbook', ico('logbook', 13)), h('div.gap'),
      ...AREAS.flatMap(([a, ps]) => [h('div.area', {}, h('span', { html: ico('area', 13) }), a), ...ps.map((p, i) => item(p, pie(0.2 + i * 0.25, '#9a9da3', 11))), h('div.gap')]));
    W.open = (name) => { W.cur = name; [...sb.querySelectorAll('[data-n]')].forEach((d) => d.classList.toggle('on', d.dataset.n === name)); main.replaceChildren(...mainFor(name)); };
    W.el = h('div.mw', { style: opts.style || {} }, h('div.mw-tb', {}, h('i'), h('i'), h('i'), opts.title ? h('span', {}, opts.title) : null), h('div.mw-b', {}, opts.noSidebar ? null : sb, main)); W.open(start); return W; };
  const phone = (style, content, title = ['today', 'Today']) => h('div.ph', { style }, h('div.ph-s', {}, h('div.ph-is'), h('div.ph-st', {}, '9:41', h('span', {}, '▂▄▆ ᯤ ▭')), h('div', { style: { display: 'flex', justifyContent: 'space-between', color: '#999', margin: '2px 0 8px', fontSize: '15px' } }, h('span', {}, '‹'), h('span', {}, '◌')), h('div.mw-h', { style: { fontSize: '19px' } }, h('span', { html: ico(title[0], 18) }), title[1]), ...content, h('div.ph-fab', {}, '+')));
  // ---- hero ----
  const heroMac = macWin('Prepare Presentation', { style: { left: '310px', top: '0', width: '590px', height: '390px' } });
  const heroPhone = phone({ left: '10px', top: '84px', width: '230px', height: '470px' }, todayList());
  const ipad = h('div.ipad', { style: { left: '0', top: '600px', width: '690px', height: '300px' } }, (() => { const w = macWin('Today', { style: { position: 'relative', width: '100%', height: '100%', borderRadius: '14px', boxShadow: 'none' } }); return w.el; })());
  const watch = h('div.watch', { style: { left: '730px', top: '640px' } }, h('div', {}, h('div', { style: { alignSelf: 'flex-start', marginLeft: '18px', color: BLUE, fontWeight: 600 } }, 'Today'), h('div', { html: `<svg width="70" height="70" viewBox="0 0 70 70" style="margin-top:12px"><circle cx="35" cy="35" r="29" fill="none" stroke="#1d3d6b" stroke-width="6"/><circle cx="35" cy="35" r="29" fill="none" stroke="${BLUE}" stroke-width="6" stroke-dasharray="182 200" transform="rotate(-90 35 35)" stroke-linecap="round"/><path d="M24 36l7 7 15-16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/></svg>` }), h('b', { style: { marginTop: '8px', fontWeight: 600 } }, 'All Done'), h('small', { style: { color: '#999', fontSize: '9.5px' } }, '12 to-dos completed')));
  const hero = h('div.th-hero', {}, h('div.th-in', {}, h('h1', {}, 'What’s new in', h('br'), 'the ', h('em', {}, 'all-new'), ' Things?'), h('p.lead', {}, 'In one word: everything. The app has been completely rebuilt from the ground up – with a timeless new design, delightful interactions, and powerful new features.'), h('div.th-dev', {}, ipad, watch, heroMac.el, heroPhone)));
  // ---- beautiful to-dos (row expands into paper card) ----
  const ck = ['London from June 3', 'Paris from June 10', 'Berlin from June 17'].map((t) => h('div', { onclick: (e) => { e.stopPropagation(); e.currentTarget.classList.toggle('ok'); } }, t));
  const exp = h('div.exp', {}, h('div.exp-r', {}, h('i'), 'Book hotels'), h('div.exp-body', {}, h('div', {}, h('div', { style: { marginTop: '8px', color: '#3a3e44' } }, 'Make sure they are central, have Wifi, and are close to a subway station.'), h('div.exp-ck', {}, ...ck), h('div.exp-ft', {}, h('span', { html: ico('today', 15), style: { margin: 0, color: 'inherit' } }), 'Today', h('span', { html: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#aaa" stroke-width="1.3"><path d="M2 8.5V2.5h6l6 6-6 6z"/><circle cx="5.5" cy="5.5" r="1"/></svg><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#aaa" stroke-width="1.3"><path d="M3 14V2.5h9l-2 3 2 3H3"/></svg>' })))));
  const setExp = (on) => exp.classList.toggle('on', on); exp.onclick = () => { if (!exp.classList.contains('on')) setExp(true); }; exp.querySelector('.exp-r').onclick = (e) => { if (exp.classList.contains('on')) { e.stopPropagation(); setExp(false); } };
  root.addEventListener('click', (e) => { if (!exp.contains(e.target) && !e.target.closest('.play')) setExp(false); });
  const playBtn = (fn) => { const b = h('button.play', { onclick: async () => { if (b.classList.contains('run')) return; b.classList.add('run'); await fn(); b.classList.remove('run'); } }, h('i'), 'Play'); return b; };
  const icCircle = (bg, inner) => h('div.ic', { style: { background: bg }, html: inner });
  const design = h('div.band.b1', {}, h('div.th-in', {}, h('div.ttl', {}, h('span', { html: '<svg width="46" height="46" viewBox="0 0 46 46"><circle cx="23" cy="15" r="11" fill="#3d82f6" opacity=".9"/><circle cx="15" cy="28" r="11" fill="#f2405f" opacity=".85"/><circle cx="31" cy="28" r="11" fill="#ffd02b" opacity=".85"/></svg>' }), h('h2', {}, 'All-New Design')), h('p.lead', {}, 'The all-new Things sports an all-new design. Not just how it looks – but also how it works, and how it ', h('em', {}, 'feels'), '. The interactions are delightful. The animations are smooth. The content is more structured. The concepts are clearer.'),
    exp, playBtn(async () => { setExp(true); await sleep(900); ck[0].classList.add('ok'); await sleep(500); ck[0].classList.remove('ok'); await sleep(500); setExp(false); await sleep(400); }),
    h('div.cards2', {}, h('div.card', {}, h('b', {}, 'Beautiful To-Dos'), 'Just take a look at the basic building block of Things – its to-dos. You immediately get a sense of how the new apps feel. When you open a to-do, it smoothly transforms into a clear white piece of paper, ready for your thoughts.'), h('div.card', {}, h('b', {}, 'Design Is Not an Afterthought'), 'It’s a way of building apps, and we live by it. There’s a lot of thought, and trial, and error, that went into making these new apps simple to use while at the same time putting in all the powerful features.'))));
  // ---- segmented Mac / iOS toggle that swaps the device mock ----
  const segToggle = (onChange, start = 'mac') => { const bm = h('button', {}, 'Mac'), bi = h('button', {}, 'iOS'); const el = h('div.seg', {}, h('i'), bm, bi); const set = (m) => { el.classList.toggle('ios', m === 'ios'); bm.classList.toggle('on', m === 'mac'); bi.classList.toggle('on', m === 'ios'); el.mode = m; onChange(m); }; bm.onclick = () => set('mac'); bi.onclick = () => set('ios'); el.set = set; return el; };
  const swap = (mac, ios) => (m) => { mac.classList.toggle('off', m !== 'mac'); ios.classList.toggle('off', m !== 'ios'); };
  const tMac = macWin('Today', { noSidebar: true, title: 'Today ⌃', style: { left: '120px', top: '0', width: '330px', height: '540px' } }).el;
  const tIos = phone({ left: '160px', top: '0', width: '250px', height: '520px' }, todayList());
  const todaySeg = segToggle(swap(tMac, tIos));
  const today = h('div.band.b2', {}, h('div.th-in', {}, h('div.ttl', {}, icCircle('#ffd02b', '<svg width="24" height="24" viewBox="0 0 14 14"><path d="M7 1l1.8 3.8 4.2.5-3.1 2.9.8 4.1L7 10.3 3.3 12.3l.8-4.1L1 5.3l4.2-.5z" fill="#fff"/></svg>'), h('h2', {}, 'Today and This Evening')), h('p.lead', {}, 'Once you’ve made your plan in the morning, the Today list is your go-to place for all daily activities. Calendar events now display together with your to-dos, giving an outline of your schedule.'), todaySeg,
    h('div.stage', {}, h('div.cards', {}, h('div.card', {}, h('b', {}, 'Calendar Events'), 'Decide which calendars you want to see in Things: Personal, Family, Work, and more. The events are neatly grouped at the top of your Today list.'), h('div.card', {}, h('b', {}, 'This Evening'), 'There are often to-dos you won’t get to until later in the day – such as things you can only do when you get home. So we added This Evening, which allows you to keep these to-dos separate.')), h('div.dv', {}, tMac, tIos))));
  // ---- Upcoming with drag-to-reschedule ----
  const DAYS = [[17, 'Tomorrow', [['t1', '10:00 Interview with Lydia'], ['t2', '13:00 Benefits presentation']]], [18, 'Thursday', [['t3', '▍Work from home'], ['t1', '15:00 Monthly conference call']]], [19, 'Friday', [['t1', '17:00 Electrician comes'], ['t2', '19:30 Volunteer at the library']]], [20, 'Saturday', []]];
  const UP = [{ id: 1, t: 'Make reservation for dinner', sub: 'Throw Party for Eve', d: 17 }, { id: 2, t: 'Buy movie tickets for Friday', d: 17 }, { id: 3, t: 'Get copy of signed contract', sub: 'Onboard James', d: 18 }, { id: 4, t: 'Call Mom and Dad', sub: 'Family', d: 18 }, { id: 5, t: 'Order a cake', sub: 'Throw Party for Eve', d: 18 }];
  const UP0 = UP.map((u) => ({ ...u }));
  const upBodies = []; const renderUp = () => upBodies.forEach(({ body, day }) => body.replaceChildren(...UP.filter((u) => u.d === day).map((u) => { const el = todo([u.t, u.sub]); el.dataset.id = u.id; el.addEventListener('pointerdown', (e) => startDrag(e, u, el)); return el; })));
  const moveTodo = (id, day) => { const u = UP.find((x) => x.id === id); if (u) { u.d = day; renderUp(); } };
  let ghost = null; const startDrag = (e, u, el) => { if (e.target.classList.contains('cb')) return; e.preventDefault(); ghost = h('div.ghost', {}, u.t); document.body.append(ghost); el.style.opacity = '.35'; let over = null;
    const mv = (ev) => { ghost.style.left = ev.clientX + 8 + 'px'; ghost.style.top = ev.clientY - 10 + 'px'; const d = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.up-day'); if (over !== d) { over?.classList.remove('over'); over = d; over?.classList.add('over'); } };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); ghost.remove(); ghost = null; el.style.opacity = ''; if (over) { over.classList.remove('over'); moveTodo(u.id, +over.dataset.day); } };
    mv(e); window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); };
  const upList = (phoneMode) => [h('div.mw-h', { style: { fontSize: phoneMode ? '19px' : '18px' } }, h('span', { html: ico('upcoming', 18) }), 'Upcoming'), h('div.chips', {}, h('span.on', {}, 'All'), h('span', {}, 'Important')), ...DAYS.map(([d, wd, evs]) => { const body = h('div'); upBodies.push({ body, day: d }); return h('div.up-day', { 'data-day': d }, h('h5', {}, d, h('small', {}, wd)), ...evs.map(([c, t]) => h('div.up-ev', {}, h('span', { class: 'cal ' + c, style: { background: 'none', padding: 0 } }, h('b', { class: c }, t.split(' ')[0]), ' ' + t.split(' ').slice(1).join(' ')))), body); })];
  const uMac = h('div.mw', { style: { left: '0', top: '0', width: '370px', height: '540px' } }, h('div.mw-tb', {}, h('i'), h('i'), h('i'), h('span', {}, 'Upcoming ⌃')), h('div.mw-b', {}, h('div.mw-main', { style: { padding: '34px 22px 10px' } }, ...upList())));
  const uIos = phone({ left: '40px', top: '0', width: '250px', height: '520px' }, upList(true), ['upcoming', 'Upcoming']); uIos.querySelector('.ph-s').children[3].remove();
  const upSeg = segToggle(swap(uMac, uIos)); renderUp();
  const upPlay = playBtn(async () => { const u = UP.find((x) => x.id === 2); const from = u.d; await sleep(200); moveTodo(2, 19); await sleep(1200); moveTodo(2, from); await sleep(300); });
  const upcoming = h('div.band.b3', {}, h('div.th-in', {}, h('div.ttl', {}, icCircle('#f2405f', '<svg width="22" height="22" viewBox="0 0 14 14"><rect x="1" y="2" width="12" height="11" rx="2.5" fill="#fff"/><rect x="3" y="6" width="8" height="5" rx="1" fill="#f2405f"/></svg>'), h('h2', {}, 'Upcoming')), h('p.lead', {}, 'Plan your week ahead with the new Upcoming list. It shows everything on your agenda for the coming days: scheduled to-dos, repeating to-dos, deadlines, and calendar events.'), upSeg,
    h('div.stage', { style: { gridTemplateColumns: '1fr 310px' } }, h('div', {}, h('div.dv', {}, uMac, uIos), upPlay), h('div.cards', {}, h('div.card', {}, 'A quick peek at this list is all it takes to stay on top of your schedule – and if your plans change, re-scheduling your to-dos is as easy as drag and drop.'), h('div.card', { style: { fontSize: '13px', color: '#6b7178' } }, '↕ Try it: drag a to-do onto another day.')))));
  const th = h('div.th', {}, h('div.th-in', {}, h('div.th-nav', {}, h('b', {}, logo(20), 'Things'), h('nav', {}, h('a', {}, 'Features'), h('a', {}, 'Support'), h('a', {}, 'Blog')))), hero, h('div', { style: { height: '60px' } }), design, today, upcoming, h('div.th-foot', {}, logo(16), h('div', {}, 'Things · Cultured Code GmbH & Co. KG')));
  root.append(th); todaySeg.set('mac'); upSeg.set('mac');
  window.__demoProof = async () => {
    const out = []; heroMac.open('Today'); out.push(`sidebar → "${heroMac.main.querySelector('.mw-h').textContent}" (${heroMac.main.querySelectorAll('.td').length} to-dos)`); const td = heroMac.main.querySelector('.td'); td.querySelector('.cb').click(); out.push(`check done=${td.classList.contains('done')}`); heroMac.open('Prepare Presentation');
    exp.click(); await sleep(450); out.push(`to-do expanded=${exp.classList.contains('on')} h=${Math.round(exp.getBoundingClientRect().height)}px`); setExp(false);
    todaySeg.set('ios'); await sleep(500); out.push(`today toggle=${todaySeg.mode} phoneVisible=${!tIos.classList.contains('off')} macHidden=${tMac.classList.contains('off')}`); todaySeg.set('mac');
    const n19 = () => UP.filter((u) => u.d === 19).length; const a = n19(); moveTodo(1, 19); out.push(`reschedule: Friday ${a}→${n19()} to-dos (DOM ${upBodies.filter((b) => b.day === 19).map((b) => b.body.children.length).join('/')})`);
    upSeg.set('ios'); out.push(`upcoming toggle=${upSeg.mode}`); upSeg.set('mac');
    UP.forEach((u, i) => Object.assign(u, UP0[i])); renderUp(); root.scrollTop = 0; return out.join('; ') + '; restored';
  };
};
V['duolingo-mascot-onboarding-quiz-flow'] = (root, T) => {
  import('@fontsource-variable/nunito');
  theme(root, T, { bg: '#ffffff', fg: '#4b4b4b', ac: '#58cc02', dark: false });
  const F = "'Nunito Variable','Nunito',system-ui,sans-serif", G = '#58cc02', GD = '#58a700', INK = '#4b4b4b', LN = '#e5e5e5', MUT = '#afafaf';
  root.append(h('style', {}, `.du{position:absolute;inset:0;background:#fff;color:${INK};font:700 17px/1.3 ${F};overflow:hidden}.du button{font-family:${F};cursor:pointer}
.du-pick{position:absolute;inset:0;overflow:auto}.du-hd{max-width:990px;margin:0 auto;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 4px}
.du-logo{display:flex;align-items:center;gap:6px;color:${G};font:800 34px/1 ${F};letter-spacing:-.035em}.du-logo svg{width:40px;height:44px}
.du-lang{font:800 15px ${F};color:${MUT};letter-spacing:.06em;display:flex;align-items:center;gap:10px;cursor:pointer}
.du-pick h1{text-align:center;font:800 32px ${F};margin:62px 0 64px;letter-spacing:-.01em}
.du-grid{display:grid;grid-template-columns:repeat(4,200px);gap:16px;justify-content:center;padding-bottom:60px}
.du-card{height:217px;border:2px solid ${LN};border-bottom-width:4px;border-radius:16px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;transition:background .15s,transform .1s}
.du-card:hover{background:#f7f7f7}.du-card:active{transform:translateY(2px);border-bottom-width:2px}.du-card svg{width:82px;height:62px;margin-bottom:14px}
.du-card b{font:800 17px ${F};color:${INK}}.du-card small{font:600 16px ${F};color:#777}
.du-flow{position:absolute;inset:0;display:none}.du-flow.on{display:block}
.du-top{position:absolute;left:0;right:0;top:34px;height:20px;display:flex;align-items:center;gap:22px;padding:0 202px 0 206px}
.du-back{border:0;background:none;padding:0;width:26px;height:26px;color:${MUT};display:flex}.du-back:hover{color:#777}
.du-prog{flex:1;height:16px;border-radius:8px;background:${LN};overflow:hidden}.du-prog i{display:block;height:100%;width:0;background:${G};border-radius:8px;position:relative;transition:width .5s cubic-bezier(.4,1.3,.6,1)}
.du-prog i:after{content:'';position:absolute;left:8px;right:8px;top:4px;height:4px;border-radius:2px;background:#ffffff40}
.du-q{position:absolute;left:230px;top:92px;display:flex;align-items:center;gap:18px}.du-q svg{width:92px;height:104px}
.bub{position:relative;border:2px solid ${LN};border-radius:14px;padding:11px 16px;font:600 17px ${F};color:${INK};background:#fff;white-space:nowrap;min-height:48px}
.bub:before,.bub:after{content:'';position:absolute;border:solid transparent}.du-q .bub:before{left:-14px;top:50%;margin-top:-8px;border-width:8px 14px 8px 0;border-right-color:${LN}}.du-q .bub:after{left:-10px;top:50%;margin-top:-6px;border-width:6px 11px 6px 0;border-right-color:#fff}
.bub .cur{display:inline-block;width:1px}
.du-big{position:absolute;left:50%;top:274px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:16px}.du-big svg{width:150px;height:168px;animation:dubob 2.4s ease-in-out infinite}
.du-big .bub:before{left:50%;bottom:-14px;margin-left:-8px;border-width:14px 8px 0;border-top-color:${LN}}.du-big .bub:after{left:50%;bottom:-10px;margin-left:-6px;border-width:11px 6px 0;border-top-color:#fff}
@keyframes dubob{50%{transform:translateY(-6px)}}
.du-body{position:absolute;left:0;right:0;top:232px;bottom:150px;overflow:auto;display:flex;justify-content:center;align-items:flex-start}
.du-opts{display:grid;gap:20px 12px}.du-opts.c2{grid-template-columns:364px 364px;margin-left:-14px}.du-opts.c1{grid-template-columns:480px;gap:14px}
.du-opt{display:flex;align-items:center;gap:18px;min-height:74px;padding:0 18px;border:2px solid ${LN};border-bottom-width:4px;border-radius:12px;background:#fff;font:700 17px ${F};color:${INK};text-align:left;transition:background .12s,border-color .12s,color .12s}
.du-opt:hover{background:#f7f7f7}.du-opt:active{transform:translateY(2px);border-bottom-width:2px}.du-opt .em{font:30px/1 'Noto Color Emoji','Apple Color Emoji',sans-serif;width:40px;text-align:center}
.du-opt.sel{background:#ddf4ff;border-color:#84d8ff;color:#1899d6}.du-opts.c1 .du-opt{min-height:58px}.du-opt .rt{margin-left:auto;font-weight:600;color:#777}.du-opt.sel .rt{color:#1899d6}
.du-bars{display:flex;align-items:flex-end;gap:3px;height:22px;width:34px}.du-bars i{width:5px;border-radius:2px;background:#cfe9fb}.du-bars i.f{background:#1cb0f6}
.du-path{display:grid;gap:22px;grid-template-columns:484px}.du-path .du-opt{min-height:130px;gap:22px;align-items:center}.du-path .du-opt .em{font-size:44px;width:52px}.du-path b{display:block;font:800 19px ${F};margin-bottom:6px}.du-path span{font:600 16px ${F};color:#777}.du-path .sel span{color:#1899d6}
.du-ov{width:430px}.du-ov div{display:flex;gap:20px;align-items:center;padding:22px 0;border-bottom:2px solid ${LN}}.du-ov div:last-child{border:0}.du-ov .em{font:34px/1 'Noto Color Emoji',sans-serif}.du-ov b{display:block;font:800 18px ${F}}.du-ov span{font:600 15px ${F};color:#777}
.du-foot{position:absolute;left:0;right:0;bottom:0;height:140px;border-top:2px solid ${LN};display:flex;align-items:center;justify-content:flex-end;padding:0 174px}
.du-cont{min-width:150px;height:50px;border-radius:16px;border:0;font:800 15px ${F};letter-spacing:.8px;text-transform:uppercase;background:${LN};color:${MUT};cursor:default!important;transition:background .15s,color .15s}
.du-cont.on{background:${G};color:#fff;box-shadow:0 4px 0 ${GD};cursor:pointer!important}.du-cont.on:hover{filter:brightness(1.05)}.du-cont.on:active{transform:translateY(4px);box-shadow:none}
.du-step{animation:dufade .35s ease}@keyframes dufade{from{opacity:0;transform:translateX(18px)}}
`));
  const owl = (book) => `<svg viewBox="0 0 120 134" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="126" rx="40" ry="8" fill="#e5e5e5"/>
<path d="M18 46 Q16 18 34 14 L44 22 Q60 18 76 22 L86 14 Q104 18 102 46 L104 84 Q104 120 60 120 Q16 120 16 84Z" fill="${G}"/>
<path d="M30 26 Q40 22 46 28 Q60 24 74 28 Q80 22 90 26 Q88 34 76 34 Q60 30 44 34 Q32 34 30 26Z" fill="#89e219"/>
<ellipse cx="60" cy="92" rx="28" ry="22" fill="#89e219"/><path d="M50 82 q4 4 0 8 M60 80 q4 4 0 8 M70 82 q4 4 0 8" stroke="${G}" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M17 66 Q4 84 14 104 Q22 96 24 80Z" fill="${GD}"/><path d="M103 66 Q116 84 106 104 Q98 96 96 80Z" fill="${GD}"/>
<circle cx="42" cy="54" r="17" fill="#fff"/><circle cx="78" cy="54" r="17" fill="#fff"/><circle cx="45" cy="57" r="9" fill="${INK}"/><circle cx="75" cy="57" r="9" fill="${INK}"/><circle cx="48" cy="53" r="3" fill="#fff"/><circle cx="78" cy="53" r="3" fill="#fff"/>
<path d="M50 68 Q60 62 70 68 Q66 82 60 84 Q54 82 50 68Z" fill="#ffc800"/><path d="M52 72 Q60 76 68 72 Q64 82 60 84 Q56 82 52 72Z" fill="#ff9600"/>
<ellipse cx="46" cy="120" rx="9" ry="5" fill="#ff9600"/><ellipse cx="74" cy="120" rx="9" ry="5" fill="#ff9600"/>
${book ? `<g transform="rotate(-12 34 98)"><rect x="18" y="84" width="26" height="30" rx="3" fill="#ce8b4a"/><rect x="20" y="86" width="22" height="26" rx="2" fill="#cc6a00"/></g><g transform="rotate(38 92 90)"><rect x="86" y="70" width="10" height="38" rx="3" fill="#ffc800"/><path d="M86 108 L91 118 L96 108Z" fill="#f9d7a1"/><rect x="86" y="66" width="10" height="7" rx="2" fill="#ff86d0"/></g>` : ''}</svg>`;
  const rr = (body) => `<svg viewBox="0 0 82 62"><defs><clipPath id="fc"><rect width="82" height="62" rx="9"/></clipPath></defs><g clip-path="url(#fc)">${body}</g></svg>`;
  const tri = (a, b, c, v) => rr(v ? `<rect width="28" height="62" fill="${a}"/><rect x="27" width="28" height="62" fill="${b}"/><rect x="54" width="28" height="62" fill="${c}"/>` : `<rect width="82" height="21" fill="${a}"/><rect y="20" width="82" height="22" fill="${b}"/><rect y="41" width="82" height="21" fill="${c}"/>`);
  const FLAG = {
    Spanish: rr(`<rect width="82" height="62" fill="#ff4b4b"/><rect y="15" width="82" height="32" fill="#ffc800"/><rect x="14" y="22" width="12" height="18" rx="4" fill="#ff4b4b" stroke="#fff" stroke-width="2"/><rect x="9" y="24" width="3" height="14" fill="#fff"/><rect x="28" y="24" width="3" height="14" fill="#fff"/>`),
    French: tri('#1cb0f6', '#f1f1f1', '#ff4b4b', 1), Italian: tri('#58cc02', '#f1f1f1', '#ff4b4b', 1), German: tri('#4b4b4b', '#ff4b4b', '#ffc800'), Russian: tri('#f1f1f1', '#1cb0f6', '#ff4b4b'), Hindi: rr(`<rect width="82" height="21" fill="#ff9600"/><rect y="20" width="82" height="22" fill="#f1f1f1"/><rect y="41" width="82" height="21" fill="#58cc02"/><circle cx="41" cy="31" r="7" fill="none" stroke="#1cb0f6" stroke-width="2.5"/>`),
    English: rr(`<rect width="82" height="62" fill="#f1f1f1"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect y="${i * 11}" width="82" height="6" fill="#ff4b4b"/>`).join('')}<rect width="36" height="30" fill="#1cb0f6"/>${[[7, 7], [18, 7], [29, 7], [7, 19], [18, 19], [29, 19]].map(([x, y]) => `<path transform="translate(${x} ${y})" d="M0-4 1.2-1.2 4-1.2 1.8.6 2.6 3.6 0 1.8-2.6 3.6-1.8.6-4-1.2-1.2-1.2Z" fill="#fff"/>`).join('')}`),
    Japanese: rr(`<rect width="82" height="62" fill="#f1f1f1"/><circle cx="41" cy="31" r="14" fill="#ff4b4b"/>`),
    Korean: rr(`<rect width="82" height="62" fill="#f1f1f1"/><path d="M27 31a14 14 0 0 1 28 0a7 7 0 0 1-14 0a7 7 0 0 0-14 0Z" fill="#ff4b4b"/><path d="M55 31a14 14 0 0 1-28 0a7 7 0 0 1 14 0a7 7 0 0 0 14 0Z" fill="#1cb0f6"/><g stroke="#4b4b4b" stroke-width="2.5"><path d="M12 14l8-6M14 17l8-6M16 20l8-6M58 8l8 6M60 11l8 6M62 14l8 6M12 48l8 6M14 45l8 6M58 54l8-6M60 51l8-6"/></g>`),
    'Chinese (Simplified)': rr(`<rect width="82" height="62" fill="#ff4b4b"/><path transform="translate(18 20) scale(2.6)" d="M0-4 1.2-1.2 4-1.2 1.8.6 2.6 3.6 0 1.8-2.6 3.6-1.8.6-4-1.2-1.2-1.2Z" fill="#ffc800"/>${[[34, 10], [40, 18], [40, 28], [34, 35]].map(([x, y]) => `<path transform="translate(${x} ${y})" d="M0-4 1.2-1.2 4-1.2 1.8.6 2.6 3.6 0 1.8-2.6 3.6-1.8.6-4-1.2-1.2-1.2Z" fill="#ffc800"/>`).join('')}`),
    Chess: `<svg viewBox="0 0 82 62"><rect x="6" y="4" width="70" height="54" rx="9" fill="#00c58e"/><path d="M28 18h6v4h4v-4h6v4h4v-4h6v12l-3 3v6H31v-6l-3-3Z" fill="#fff"/><rect x="27" y="42" width="28" height="6" rx="2" fill="#fff"/></svg>`,
    Math: `<svg viewBox="0 0 82 62"><rect x="6" y="4" width="70" height="54" rx="9" fill="#1cb0f6"/><path d="M27 20h12M33 14v12M45 20h12M28 36l9 9M37 36l-9 9M45 41h12" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="51" cy="35.5" r="2" fill="#fff"/><circle cx="51" cy="46.5" r="2" fill="#fff"/></svg>`,
    Arabic: rr(`<rect width="82" height="62" fill="#58cc02"/><path d="M22 30h38" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M24 40h30l4 4" stroke="#fff" stroke-width="3" fill="none"/>`),
    Portuguese: rr(`<rect width="82" height="62" fill="#58cc02"/><path d="M41 8 74 31 41 54 8 31Z" fill="#ffc800"/><circle cx="41" cy="31" r="12" fill="#1cb0f6"/><path d="M30 29q11-4 22 4" stroke="#f1f1f1" stroke-width="2.5" fill="none"/>`),
    Turkish: rr(`<rect width="82" height="62" fill="#ff4b4b"/><circle cx="32" cy="31" r="13" fill="#f1f1f1"/><circle cx="36" cy="31" r="10.5" fill="#ff4b4b"/><path transform="translate(52 31) scale(1.6)" d="M0-4 1.2-1.2 4-1.2 1.8.6 2.6 3.6 0 1.8-2.6 3.6-1.8.6-4-1.2-1.2-1.2Z" fill="#f1f1f1"/>`),
    Dutch: tri('#ff4b4b', '#f1f1f1', '#1cb0f6'),
  };
  const COURSES = [['Spanish', '42M'], ['French', '22.7M'], ['Chess', ''], ['English', '19.8M'], ['Japanese', '17.9M'], ['German', '15.9M'], ['Math', ''], ['Hindi', '13.6M'], ['Korean', '12.1M'], ['Italian', '10.2M'], ['Chinese (Simplified)', '9.22M'], ['Russian', '7.88M'], ['Arabic', '6.56M'], ['Portuguese', '4.63M'], ['Turkish', '3.99M'], ['Dutch', '2.69M']];
  let course = 'Spanish';
  const STEPS = ['welcome', 'welcome2', 'hdyhau', 'learningReason', 'proficiency', 'courseOverview', 'dailyGoal', 'choosePath', 'done'];
  const PCT = { hdyhau: 10, learningReason: 25, proficiency: 40, courseOverview: 55, dailyGoal: 70, choosePath: 85, done: 100 };
  const lang = () => (course === 'Chess' || course === 'Math' ? course.toLowerCase() : course);
  const Q = () => ({
    welcome: ['Hi there! I’m Duo!'], welcome2: ['Just 7 quick questions before we start your first lesson!'],
    hdyhau: ['How did you hear about Duolingo?', [['👪', 'Friends/family'], ['🎵', 'TikTok'], ['✏️', 'Brawl Stars'], ['📺', 'TV'], ['📰', 'News/article/blog'], ['📸', 'Facebook/Instagram'], ['▶️', 'YouTube'], ['🔍', 'Google Search'], ['💬', 'Other']], 'Thanks for letting us know!'],
    learningReason: [`Why are you learning ${lang()}?`, [['💼', 'Boost my career'], ['✈️', 'Prepare for travel'], ['📚', 'Support my education'], ['🧠', 'Spend time productively'], ['🎉', 'Just for fun'], ['🤝', 'Connect with people'], ['💬', 'Other']], ['Career goals? Love it!', 'Best thing to pack is the local language!', 'Smart students learn daily!', 'Every minute counts!', 'Fun is the best motivator!', 'Let’s make some friends!', 'Great, let’s get started!']],
    proficiency: [`How much ${lang()} do you know?`, [`I’m new to ${lang()}`, 'I know some common words', 'I can have basic conversations', 'I can talk about various topics', 'I can discuss most topics in detail'], ['Okay, we’ll start fresh!', 'Okay, we’ll build on what you know!']],
    courseOverview: ['Here’s what you can achieve!', [['💬', 'Converse with confidence', 'Stress-free speaking and listening exercises'], ['🔤', 'Build a large vocabulary', 'Common words and practical phrases'], ['⏰', 'Develop a learning habit', 'Smart reminders, fun challenges, and more']]],
    dailyGoal: ['What’s your daily learning goal?', [['5 min / day', 'Casual'], ['10 min / day', 'Regular'], ['15 min / day', 'Serious'], ['20 min / day', 'Intense']], (i) => `That’s ${[35, 70, 105, 140][i]} words in your first week!`],
    choosePath: ['Now let’s find the best place to start!', [['📒', 'Start from scratch', `Take the easiest lesson of the ${lang()} course`], ['🧭', 'Find my level', 'Let Duo recommend where you should start learning']]],
    done: [`You’re all set! Your first ${lang()} lesson is ready.`],
  });
  let si = 0, sel = -1, answers = {}, typer = 0;
  const typeIn = (el, text) => { clearInterval(typer); el.textContent = ''; let k = 0; const cur = h('span.cur', {}, ''); el.append(document.createTextNode(''), cur); typer = setInterval(() => { k++; el.firstChild.textContent = text.slice(0, k); if (k >= text.length) clearInterval(typer); }, 28); el.dataset.full = text; };
  const backIc = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M20 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const progI = h('i'), back = h('button.du-back', { html: backIc, title: 'Back', onclick: () => goBack() });
  const top = h('div.du-top', {}, back, h('div.du-prog', {}, progI));
  const bub = h('div.bub'), qrow = h('div.du-q'), big = h('div.du-big'), body = h('div.du-body'), cont = h('button.du-cont', { onclick: () => next() }, 'Continue');
  const flow = h('div.du-flow', {}, top, qrow, big, body, h('div.du-foot', {}, cont));
  const say = (t) => typeIn(bub, t);
  const setCont = (on, label = 'Continue') => { cont.classList.toggle('on', on); cont.disabled = !on; cont.textContent = label; };
  const setUrl = (st) => { try { const u = new URL(location.href); if (st) u.searchParams.set('welcomeStep', st); else u.searchParams.delete('welcomeStep'); history.replaceState(null, '', u); } catch {} };
  const optBtn = (cls, kids, i, onPick) => h('button.du-opt' + cls, { onclick: () => onPick(i) }, ...kids);
  const pickFn = (st) => (i) => { sel = i; answers[st] = i; [...body.querySelectorAll('.du-opt')].forEach((b, k) => b.classList.toggle('sel', k === i)); const q = Q()[st]; const r = q[2]; if (r) say(typeof r === 'function' ? r(i) : Array.isArray(r) ? r[Math.min(i, r.length - 1)] : r); setCont(true); };
  const render = () => {
    const st = STEPS[si], q = Q()[st]; sel = answers[st] ?? -1; setUrl(st === 'welcome2' ? 'welcome' : st);
    const isBig = st === 'welcome' || st === 'welcome2' || st === 'done'; top.style.visibility = isBig && st !== 'done' ? 'hidden' : 'visible';
    progI.style.width = (PCT[st] || 0) + '%'; big.replaceChildren(); qrow.replaceChildren(); body.replaceChildren();
    if (isBig) { big.append(bub, h('div', { html: owl(false) })); say(q[0]); setCont(true, st === 'done' ? 'Restart demo' : 'Continue'); return; }
    qrow.append(h('div', { html: owl(true) }), bub); say(q[0]);
    let box;
    if (st === 'hdyhau' || st === 'learningReason') box = h('div.du-opts.c2.du-step', {}, q[1].map(([e, t], i) => optBtn('', [h('span.em', {}, e), t], i, pickFn(st))));
    else if (st === 'proficiency') box = h('div.du-opts.c1.du-step', {}, q[1].map((t, i) => optBtn('', [h('span.du-bars', {}, [0, 1, 2, 3].map((b) => h('i' + (b < i ? '.f' : ''), { style: { height: 7 + b * 5 + 'px' } }))), t], i, pickFn(st))));
    else if (st === 'courseOverview') box = h('div.du-ov.du-step', {}, q[1].map(([e, b, s2]) => h('div', {}, h('span.em', {}, e), h('div', { style: { display: 'block', border: 0, padding: 0 } }, h('b', {}, b), h('span', {}, s2)))));
    else if (st === 'dailyGoal') box = h('div.du-opts.c1.du-step', {}, q[1].map(([a, b], i) => optBtn('', [a, h('span.rt', {}, b)], i, pickFn(st))));
    else if (st === 'choosePath') box = h('div.du-path.du-step', {}, q[1].map(([e, b, s2], i) => optBtn('', [h('span.em', {}, e), h('div', {}, h('b', {}, b), h('span', {}, s2))], i, pickFn(st))));
    body.append(box); body.style.top = st === 'courseOverview' ? '250px' : '232px';
    if (sel >= 0) [...body.querySelectorAll('.du-opt')][sel]?.classList.add('sel');
    setCont(st === 'courseOverview' || sel >= 0);
  };
  const pick = h('div.du-pick', {}, h('div.du-hd', {}, h('div.du-logo', { html: `<svg viewBox="0 0 120 134">${owl(false).replace(/^<svg[^>]*>|<\/svg>$/g, '').replace(/<ellipse cx="60" cy="126"[^>]*\/>/, '')}</svg><span>duolingo</span>` }), h('div.du-lang', { onclick: () => toast('Site language: English') }, 'SITE LANGUAGE: ENGLISH', h('span', { html: '<svg width="14" height="9" viewBox="0 0 14 9"><path d="M1 1l6 6 6-6" fill="none" stroke="#afafaf" stroke-width="2.4" stroke-linecap="round"/></svg>' }))),
    h('h1', {}, 'I want to learn...'), h('div.du-grid', {}, COURSES.map(([n, c]) => h('button.du-card', { onclick: () => start(n) }, h('span', { html: FLAG[n] || FLAG.Spanish }), h('b', {}, n), c ? h('small', {}, `${c} learners`) : null))));
  const du = h('div.du', {}, pick, flow); root.append(du);
  const start = (n) => { course = n; answers = {}; si = 0; pick.style.display = 'none'; flow.classList.add('on'); render(); };
  const next = () => { if (!cont.classList.contains('on')) return; if (STEPS[si] === 'done') return reset(); si = Math.min(STEPS.length - 1, si + 1); render(); };
  const goBack = () => { if (si <= 2) { si = 0; } else si--; render(); };
  const reset = () => { clearInterval(typer); answers = {}; si = 0; flow.classList.remove('on'); pick.style.display = ''; pick.scrollTop = 0; setUrl(null); };
  window.__demoProof = async () => {
    const out = []; pick.querySelectorAll('.du-card')[0].click(); await sleep(60); out.push(`course=${course} step=${STEPS[si]} url=${new URL(location.href).searchParams.get('welcomeStep')}`);
    await sleep(700); out.push(`bubble typed "${bub.textContent}"`);
    next(); next(); out.push(`step=${STEPS[si]} continue disabled=${!cont.classList.contains('on')} progress=${progI.style.width}`);
    body.querySelectorAll('.du-opt')[6].click(); out.push(`picked YouTube → continue on=${cont.classList.contains('on')}`); next();
    body.querySelectorAll('.du-opt')[1].click(); await sleep(1400); out.push(`reason travel → "${bub.textContent}"`); next();
    body.querySelectorAll('.du-opt')[2].click(); out.push(`proficiency bars filled=${body.querySelectorAll('.du-opt.sel .f').length}`); next();
    out.push(`overview items=${body.querySelectorAll('.du-ov>div').length} cont=${cont.classList.contains('on')}`); next();
    body.querySelectorAll('.du-opt')[1].click(); out.push(`goal=${body.querySelector('.sel').textContent}`); next();
    out.push(`choosePath cards=${body.querySelectorAll('.du-opt').length} progress=${progI.style.width}`); goBack(); out.push(`back → ${STEPS[si]} (kept sel=${answers.dailyGoal})`); next();
    body.querySelectorAll('.du-opt')[0].click(); next(); out.push(`final=${STEPS[si]} ${progI.style.width}`);
    reset(); await sleep(50); out.push(`reset picker visible=${pick.style.display === ''}`); return out.join('; ') + '; restored';
  };
};
V['slowroads-zen-title-procedural-drive'] = (root, T) => {
  import('@fontsource-variable/space-grotesk'); import('@fontsource-variable/sono');
  theme(root, T, { bg: '#3a3a34', fg: '#f4f2ed', ac: '#f4f2ed', dark: true });
  const SG = "'Space Grotesk Variable','Space Grotesk',Helvetica,sans-serif", SO = "'Sono Variable','Sono',monospace", CR = '#f4f2ed', CRA = 'rgba(244,242,237,.753)';
  root.append(h('style', {}, `.sr{position:absolute;inset:0;overflow:hidden;background:#6b4a3a;color:${CR};font:300 16px ${SG};user-select:none}.sr canvas{position:absolute;inset:0;display:block}
.sr-ov{position:absolute;inset:0;background:linear-gradient(#1a120c38,#16181a52 55%,#0a0a0a70);transition:opacity 1.4s ease;z-index:3}.sr-ov.off{opacity:0;pointer-events:none}
.sr-logo{position:absolute;left:50%;top:132px;width:150px;height:150px;margin-left:-75px;filter:drop-shadow(0 0 6px #fff9) drop-shadow(0 0 18px #ffffff66)}
.sr-word{position:absolute;left:0;right:0;top:318px;text-align:center;font:300 72px/1 ${SG};letter-spacing:.36em;text-indent:.36em;color:${CR};text-shadow:0 0 14px #ffffffa0,0 0 34px #ffffff55;white-space:pre}
.sr-av{position:absolute;left:0;right:0;top:418px;text-align:center;font:300 22.5px ${SG};letter-spacing:.9px;text-shadow:0 0 10px #0006}
.sr-begin{position:absolute;left:50%;top:510px;width:210px;height:62px;margin-left:-105px;border:0;border-radius:99px;background:${CR};color:#343c3e;font:400 16px ${SO};cursor:pointer;box-shadow:0 0 0 0 #fff0;transition:box-shadow .3s,transform .2s}.sr-begin:hover{box-shadow:0 0 24px 2px #ffffff66;transform:scale(1.03)}
.sr-feat{position:absolute;left:32px;top:548px;font:300 24px ${SO};letter-spacing:2px}.sr-feat ul{list-style:none;margin:14px 0 0;padding:0 0 0 10px;font:200 12.8px/1.9 ${SO};letter-spacing:.4px;color:${CRA}}.sr-feat ul b{font-weight:400;color:${CR}}
.sr-steam{position:absolute;left:32px;top:750px;width:304px;height:50px;border:2px solid ${CR};border-radius:99px;background:none;color:${CR};font:400 16px ${SO};display:flex;align-items:center;gap:22px;padding:0 14px;cursor:pointer;letter-spacing:.5px}.sr-steam:hover{background:#ffffff1a}
.sr-mid{position:absolute;left:0;right:0;top:712px;display:flex;justify-content:center;gap:110px;align-items:flex-start;text-align:center;color:${CRA}}.sr-mid>div{width:160px;display:flex;flex-direction:column;align-items:center;gap:6px;font:300 19.2px/1.3 ${SG};cursor:pointer}.sr-mid>div:hover{color:${CR}}.sr-mid .ab{font-size:24px;margin-top:-10px}
.sr-ft{position:absolute;left:8px;right:8px;bottom:6px;display:flex;justify-content:space-between;align-items:flex-end;font:400 12.8px ${SG};color:rgba(244,242,237,.5)}.sr-ft b{color:${CRA};font-weight:500}.sr-ft .v{text-align:right;line-height:1.5}
.sr-hud{position:absolute;inset:0;z-index:2;opacity:0;transition:opacity 1.2s .6s;pointer-events:none}.sr-hud.on{opacity:1}.sr-hud.on .pe{pointer-events:auto}
.sr-spd{position:absolute;left:34px;bottom:30px;font:300 64px/1 ${SG};text-shadow:0 0 16px #0007;font-variant-numeric:tabular-nums}.sr-spd small{font:300 16px ${SO};margin-left:8px;opacity:.8}
.sr-chips{position:absolute;left:36px;bottom:110px;display:flex;gap:8px}.sr-chip{border:1.5px solid ${CRA};border-radius:99px;background:#0003;color:${CR};font:400 12px ${SO};letter-spacing:1px;padding:6px 12px;cursor:pointer;text-transform:uppercase}.sr-chip.on{background:${CR};color:#343c3e;border-color:${CR}}
.sr-tr{position:absolute;right:22px;top:20px;display:flex;gap:10px}.sr-ib{width:42px;height:42px;border-radius:50%;border:1.5px solid ${CRA};background:#0003;color:${CR};font:18px ${SO};cursor:pointer;display:flex;align-items:center;justify-content:center}
.sr-help{position:absolute;right:26px;bottom:24px;font:300 12.8px/1.7 ${SO};color:${CRA};text-align:right}
.sr-set{position:absolute;right:0;top:0;bottom:0;width:320px;background:#1d1f1fd9;backdrop-filter:blur(10px);transform:translateX(100%);transition:transform .45s cubic-bezier(.3,.8,.3,1);z-index:5;padding:26px 24px;font:300 14px ${SO}}.sr-set.on{transform:none}
.sr-set h3{font:300 24px ${SG};letter-spacing:2px;margin:0 0 22px;display:flex;justify-content:space-between}.sr-set h3 button{background:none;border:0;color:${CR};font-size:20px;cursor:pointer}
.sr-set label{display:block;margin:18px 0 6px;color:${CRA};letter-spacing:1px;text-transform:uppercase;font-size:11.5px}.sr-set input[type=range]{width:100%;accent-color:${CR}}
.sr-seg{display:flex;border:1.5px solid ${CRA};border-radius:99px;overflow:hidden}.sr-seg button{flex:1;background:none;border:0;color:${CR};font:400 13px ${SO};padding:7px;cursor:pointer}.sr-seg button.on{background:${CR};color:#343c3e}
.sr-set .rs{margin-top:28px;background:none;border:1.5px solid ${CRA};color:${CR};border-radius:99px;padding:8px 16px;font:400 13px ${SO};cursor:pointer}
.sr-paused{position:absolute;left:0;right:0;top:40px;text-align:center;font:300 14px ${SO};letter-spacing:6px;color:${CRA};display:none}.sr-ov.paused .sr-paused{display:block}
.sr-ld{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:300 14px ${SO};letter-spacing:4px;z-index:1}
`));
  const ICON = {
    discord: '<svg width="38" height="30" viewBox="0 0 24 19" fill="currentColor"><path d="M20.3 1.6A19.6 19.6 0 0 0 15.4 0l-.6 1.3a18 18 0 0 0-5.6 0L8.6 0a19.6 19.6 0 0 0-4.9 1.6C.6 6.3-.3 10.8.1 15.3a19.8 19.8 0 0 0 6 3l1.3-2.1a12.8 12.8 0 0 1-2-1l.5-.4a14 14 0 0 0 12.2 0l.5.4-2 1 1.3 2.1a19.7 19.7 0 0 0 6-3c.5-5.2-.8-9.7-3.6-13.7ZM8 12.5c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z"/></svg>',
    steam: (s2) => `<svg width="${s2}" height="${s2}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="currentColor"/><circle cx="15.6" cy="8.6" r="3.4" fill="none" stroke="#3b3b36" stroke-width="1.6"/><circle cx="15.6" cy="8.6" r="1.6" fill="#3b3b36"/><path d="M0.6 14.6 7 17.2a2.8 2.8 0 1 0 1.8-3.4L12.6 11" stroke="#3b3b36" stroke-width="1.6" fill="none"/></svg>`,
  };
  const logo = `<svg viewBox="0 0 150 150" class="sr-logo"><circle cx="75" cy="75" r="68" fill="none" stroke="${CR}" stroke-width="9"/><path d="M108 40 C88 18 44 26 46 52 C48 76 104 70 108 96 C111 116 92 132 70 140" fill="none" stroke="${CR}" stroke-width="9" stroke-linecap="round"/></svg>`;
  const cvHolder = h('div', { style: { position: 'absolute', inset: 0 } }), ld = h('div.sr-ld', {}, 'generating road…');
  const begin = h('button.sr-begin', { onclick: () => start() }, 'begin');
  const ov = h('div.sr-ov', {}, h('div.sr-paused', {}, 'PAUSED'), h('div', { html: logo }), h('div.sr-word', {}, 'slow roads'), h('div.sr-av', {}, 'Available now on Steam'), begin,
    h('div.sr-feat', {}, 'Steam Features', h('ul', {}, h('li', {}, '- New ', h('b', {}, 'California location')), h('li', {}, '- New ', h('b', {}, 'vehicles')), h('li', {}, '- ', h('b', {}, 'Combustion engines'), ' and ', h('b', {}, 'manual gears')), h('li', {}, '- In-game ', h('b', {}, 'music/radio player')), h('li', {}, '- Configurable ', h('b', {}, 'traffic')), h('li', { style: { marginLeft: '-10px', color: CR } }, '...and more'))),
    h('button.sr-steam', { onclick: () => toast('store.steampowered.com — slow roads') }, h('span', { html: ICON.steam(26) }), 'Visit the Steam page'),
    h('div.sr-mid', {}, h('div', { onclick: () => toast('discord.gg/slowroads') }, h('span', { html: ICON.discord }), 'Join the Discord'), h('div', { onclick: () => toast('About · changelog 2.4.2 — 15th June 2026') }, h('span.ab', {}, 'About'), h('span', { style: { fontSize: '26px', lineHeight: 1 } }, '▾')), h('div', { onclick: () => toast('Available now on Steam') }, h('span', { html: ICON.steam(32) }), 'Available now on Steam')),
    h('div.sr-ft', {}, h('div', {}, 'from ', h('b', {}, 'topograph.io'), ' © 2026   ·   ', h('b', {}, 'privacy policy'), '   ·   ', h('b', {}, 'press kit')), h('div.v', {}, h('b', {}, '2.4.2'), h('br'), 'This work is licensed under a ', h('b', {}, 'CC BY-NC-ND 4.0'), ' International License')));
  const spdN = h('span', {}, '0'), unitL = h('small', {}, 'km/h');
  const chipAuto = h('button.sr-chip.pe.on', { onclick: () => setAuto(!S.auto) }, 'autodrive'), chipSteer = h('button.sr-chip.pe', { onclick: () => setSteer(S.steer === 'mouse' ? 'keys' : 'mouse') }, 'keys');
  const set = h('div.sr-set');
  const hud = h('div.sr-hud', {}, h('div.sr-spd', {}, spdN, unitL), h('div.sr-chips', {}, chipAuto, chipSteer), h('div.sr-tr', {}, h('button.sr-ib.pe', { title: 'Settings', onclick: () => set.classList.toggle('on') }, '⚙'), h('button.sr-ib.pe', { title: 'Pause (Esc)', onclick: () => pause() }, '❚❚')),
    h('div.sr-help', {}, '↑ ↓  speed   ← →  steer', h('br'), 'A  autodrive   esc  pause'));
  const sr = h('div.sr', { tabindex: 0 }, cvHolder, ld, hud, ov, set); root.append(sr);
  // ---- settings (persisted) ----
  const KEY = 'slowroads-clone-settings', DEF = { tod: 62, fog: 50, units: 'kmh', auto: true, steer: 'keys' };
  let S = { ...DEF }; try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
  const todR = h('input', { type: 'range', min: 0, max: 100, value: S.tod, oninput: (e) => { S.tod = +e.target.value; applyEnv(); save(); } });
  const fogR = h('input', { type: 'range', min: 0, max: 100, value: S.fog, oninput: (e) => { S.fog = +e.target.value; applyEnv(); save(); } });
  const unitSeg = h('div.sr-seg', {}, [['kmh', 'km/h'], ['mph', 'mph']].map(([k, l]) => h('button' + (S.units === k ? '.on' : ''), { 'data-k': k, onclick: () => setUnits(k) }, l)));
  set.append(h('h3', {}, 'settings', h('button', { onclick: () => set.classList.remove('on') }, '×')), h('label', {}, 'time of day'), todR, h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: CRA } }, h('span', {}, 'noon'), h('span', {}, 'dusk'), h('span', {}, 'night')), h('label', {}, 'fog'), fogR, h('label', {}, 'units'), unitSeg, h('button.rs', { onclick: () => resetSettings() }, 'reset to defaults'), h('div', { style: { marginTop: '18px', fontSize: '11px', color: CRA, lineHeight: 1.6 } }, 'Settings are saved in this browser (localStorage).'));
  const setUnits = (k) => { S.units = k; [...unitSeg.children].forEach((b) => b.classList.toggle('on', b.dataset.k === k)); unitL.textContent = k === 'kmh' ? 'km/h' : 'mph'; save(); };
  const setAuto = (on) => { S.auto = on; chipAuto.classList.toggle('on', on); save(); };
  const setSteer = (m) => { S.steer = m; chipSteer.textContent = m; chipSteer.classList.toggle('on', m === 'mouse'); save(); };
  const resetSettings = () => { S = { ...DEF }; todR.value = S.tod; fogR.value = S.fog; setUnits(S.units); setAuto(S.auto); setSteer(S.steer); applyEnv(); try { localStorage.removeItem(KEY); } catch {} };
  // ---- world ----
  const L = 2400, TAU = Math.PI * 2;
  const rx = (d) => 58 * Math.sin(TAU * d / L) + 26 * Math.sin(TAU * 3 * d / L + 1) + 9 * Math.sin(TAU * 7 * d / L + 2);
  const ry = (d) => 9 * Math.sin(TAU * 2 * d / L + .4) + 4 * Math.sin(TAU * 6 * d / L + .5) + 1.5 * Math.sin(TAU * 13 * d / L);
  const hill = (u, d) => { const x = u + rx(d); return 16 * Math.sin(x * 0.011 + TAU * 2 * d / L) * Math.cos(TAU * 3 * d / L + x * 0.004) + 9 * Math.sin(x * 0.027 - TAU * 5 * d / L + 1.3) + 4 * Math.sin(x * 0.07 + TAU * 17 * d / L) + 1.4 * Math.sin(x * 0.21 + TAU * 41 * d / L); };
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const terrainY = (u, d) => { const a = Math.abs(u); const w = smooth(6, 34, a); return ry(d) - 0.35 + w * (hill(u, d) + 6 + a * 0.06) - (1 - w) * 0.1 + smooth(5, 9, a) * 0.25; };
  const PAL = { day: { top: [111, 160, 205], hor: [206, 220, 224], fog: [196, 208, 210], sun: [255, 244, 225], amb: 1.15 }, dusk: { top: [122, 80, 60], hor: [172, 112, 80], fog: [140, 98, 76], sun: [255, 196, 150], amb: 0.85 }, night: { top: [10, 14, 28], hor: [38, 46, 66], fog: [30, 36, 52], sun: [120, 140, 200], amb: 0.35 } };
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const envAt = (tod) => { const t = tod / 100; const [A, B, k] = t < 0.62 ? [PAL.day, PAL.dusk, t / 0.62] : [PAL.dusk, PAL.night, (t - 0.62) / 0.38]; return { top: mix(A.top, B.top, k), hor: mix(A.hor, B.hor, k), fog: mix(A.fog, B.fog, k), sun: mix(A.sun, B.sun, k), amb: A.amb + (B.amb - A.amb) * k }; };
  let THREE, renderer, scene, cam, car, sky, skyCtx, fog, hemi, sunL, mtn, ready = false, applyEnv = () => {};
  let d = 120, u = -1.9, speed = 13, target = 13, keys = {}, mouseX = 0.5, running = false, paused = false, lastT = performance.now(), dist = 0;
  const rgb = (c) => `rgb(${c.join(',')})`;
  import('three').then((M) => {
    THREE = M; const W0 = sr.clientWidth || 1440, H0 = sr.clientHeight || 860;
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(1); renderer.setSize(W0, H0); renderer.outputColorSpace = THREE.SRGBColorSpace; cvHolder.append(renderer.domElement);
    scene = new THREE.Scene(); cam = new THREE.PerspectiveCamera(52, W0 / H0, 0.3, 4000);
    const sc = document.createElement('canvas'); sc.width = 4; sc.height = 256; skyCtx = sc.getContext('2d'); sky = new THREE.CanvasTexture(sc); sky.colorSpace = THREE.SRGBColorSpace; scene.background = sky;
    fog = new THREE.FogExp2(0x926852, 0.0019); scene.fog = fog;
    hemi = new THREE.HemisphereLight(0xffd8bc, 0x2e3a28, 0.9); scene.add(hemi); sunL = new THREE.DirectionalLight(0xffc496, 1.1); sunL.position.set(0.6, 0.7, 0.8); scene.add(sunL);
    // road-aligned terrain: u columns dense near the road
    const US = []; for (let x = 4.6; x < 700; x *= 1.11) US.push(x); const UU = [...US.slice().reverse().map((x) => -x), ...US.map((x) => x)].sort((a, b) => a - b);
    const NV = 420, colA = new THREE.Color('#525d38'), colB = new THREE.Color('#646e3e'), colC = new THREE.Color('#3c4842'), colD = new THREE.Color('#6d6a4c'), tmp = new THREE.Color();
    const buildTerrain = () => { const pos = [], col = [], idx = []; const R = rng(11);
      for (let j = 0; j <= NV; j++) { const dd = (j / NV) * L; for (const uu of UU) { const y = terrainY(uu, dd); pos.push(rx(dd) + uu, y, -dd); const far = smooth(40, 400, Math.abs(uu)); tmp.copy(colA).lerp(colB, 0.5 + 0.5 * Math.sin(uu * 0.3 + dd * 0.05) * R()).lerp(colC, far * 0.85); if (Math.abs(uu) < 7) tmp.lerp(colD, 0.5); col.push(tmp.r, tmp.g, tmp.b); } }
      const C = UU.length; for (let j = 0; j < NV; j++) for (let i = 0; i < C - 1; i++) { const a = j * C + i, b = a + 1, c2 = a + C, e = c2 + 1; idx.push(a, b, c2, b, e, c2); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
    const tg = buildTerrain(), tm = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: false });
    // road ribbon with canvas texture (edge lines + centre dashes)
    const rc = document.createElement('canvas'); rc.width = 128; rc.height = 256; const r2 = rc.getContext('2d'); r2.fillStyle = '#3d4044'; r2.fillRect(0, 0, 128, 256);
    for (let i = 0; i < 900; i++) { r2.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '0,0,0'},${Math.random() * 0.06})`; r2.fillRect(Math.random() * 128, Math.random() * 256, 2, 2); }
    r2.fillStyle = '#d9d8d2'; r2.fillRect(6, 0, 2, 256); r2.fillRect(120, 0, 2, 256); r2.fillRect(62, 0, 3, 110);
    const rt = new THREE.CanvasTexture(rc); rt.wrapS = rt.wrapT = THREE.RepeatWrapping; rt.colorSpace = THREE.SRGBColorSpace; rt.anisotropy = 8;
    const buildRoad = () => { const pos = [], uv = [], idx = []; const N = 1600; for (let j = 0; j <= N; j++) { const dd = (j / N) * L; for (const [uu, s2] of [[-4.4, 0], [4.4, 1]]) { pos.push(rx(dd) + uu, ry(dd) + 0.04, -dd); uv.push(s2, dd / 14); } } for (let j = 0; j < N; j++) { const a = j * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; };
    const rg = buildRoad(), rm = new THREE.MeshLambertMaterial({ map: rt });
    for (const k of [0, 1]) { const grp = new THREE.Group(); grp.position.z = -k * L; grp.add(new THREE.Mesh(tg, tm), new THREE.Mesh(rg, rm)); scene.add(grp); }
    // distant mountain band following the camera
    const mp = [], mi = [], NS = 220; for (let i = 0; i <= NS; i++) { const a = (i / NS) * TAU; const hh = 150 + 90 * Math.sin(a * 3 + 1) + 60 * Math.sin(a * 7 + 2) + 25 * Math.sin(a * 17); mp.push(Math.cos(a) * 1500, -60, Math.sin(a) * 1500, Math.cos(a) * 1500, hh, Math.sin(a) * 1500); }
    for (let i = 0; i < NS; i++) { const a = i * 2; mi.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.Float32BufferAttribute(mp, 3)); mg.setIndex(mi); mtn = new THREE.Mesh(mg, new THREE.MeshBasicMaterial({ color: 0x55605a, fog: false, side: THREE.DoubleSide })); scene.add(mtn);
    // car (white coupe)
    car = new THREE.Group(); const white = new THREE.MeshLambertMaterial({ color: 0xe8e5de }), dark = new THREE.MeshLambertMaterial({ color: 0x1b1d20 }), glass = new THREE.MeshLambertMaterial({ color: 0x2a2f36 });
    const bx = (w, hh, l, m, x, y, z) => { const me = new THREE.Mesh(new THREE.BoxGeometry(w, hh, l), m); me.position.set(x, y, z); car.add(me); return me; };
    bx(1.9, 0.5, 4.5, white, 0, 0.62, 0); bx(1.84, 0.22, 4.2, white, 0, 0.98, 0.1); const cab = bx(1.56, 0.5, 2.3, glass, 0, 1.32, 0.3); { const pa = cab.geometry.attributes.position; for (let i = 0; i < pa.count; i++) if (pa.getY(i) > 0) { pa.setX(i, pa.getX(i) * 0.84); pa.setZ(i, pa.getZ(i) * 0.62 - 0.1); } pa.needsUpdate = true; cab.geometry.computeVertexNormals(); } bx(1.28, 0.05, 1.35, white, 0, 1.58, 0.22);
    bx(1.7, 0.08, 0.06, new THREE.MeshBasicMaterial({ color: 0xff3a2a }), 0, 0.96, 2.24); bx(0.5, 0.14, 0.04, new THREE.MeshBasicMaterial({ color: 0xf2c84b }), 0, 0.68, 2.26); bx(1.9, 0.22, 0.05, dark, 0, 0.42, 2.25);
    for (const [x, z] of [[-0.86, -1.45], [0.86, -1.45], [-0.86, 1.4], [0.86, 1.4]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.3, 18), dark); w.rotation.z = Math.PI / 2; w.position.set(x, 0.37, z); car.add(w); }
    scene.add(car);
    applyEnv = () => { const e = envAt(S.tod); const g = skyCtx.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, rgb(e.top)); g.addColorStop(0.55, rgb(mix(e.top, e.hor, 0.7))); g.addColorStop(1, rgb(e.hor)); skyCtx.fillStyle = g; skyCtx.fillRect(0, 0, 4, 256); sky.needsUpdate = true;
      fog.color.setRGB(...e.fog.map((v) => v / 255), THREE.SRGBColorSpace); fog.density = 0.0003 + (S.fog / 100) * 0.002; hemi.intensity = e.amb * 2.2; sunL.color.setRGB(...e.sun.map((v) => v / 255), THREE.SRGBColorSpace); sunL.intensity = e.amb * 2.0;
      mtn.material.color.setRGB(...mix([70, 84, 80], e.fog, 0.35).map((v) => v / 255), THREE.SRGBColorSpace); sr.style.background = rgb(e.hor); };
    applyEnv(); ready = true; ld.remove();
    new ResizeObserver(() => { const w = sr.clientWidth, hh = sr.clientHeight; if (!w) return; renderer.setSize(w, hh); cam.aspect = w / hh; cam.updateProjectionMatrix(); }).observe(sr);
    requestAnimationFrame(loop);
  }).catch((e) => { ld.textContent = 'WebGL unavailable — ' + e.message; });
  const v3 = (dd, uu, y = 0) => new THREE.Vector3(rx(dd) + uu, ry(dd) + y, -dd);
  const camPos = new (class { constructor() { this.v = null; } })();
  const loop = (now) => { const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    if (!paused) {
      if (!running) target = 13; else if (S.auto) target = 22; else { if (keys.up) target = Math.min(42, target + dt * 9); if (keys.down) target = Math.max(0, target - dt * 16); }
      speed += (target - speed) * Math.min(1, dt * 0.9);
      if (running && !S.auto) { if (S.steer === 'mouse') u += ((mouseX - 0.5) * 8 - u) * Math.min(1, dt * 2); else u += ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * dt * 3.2 * Math.min(1, speed / 6); }
      else u += (-1.9 - u) * Math.min(1, dt * 0.8);
      u = Math.max(-3.6, Math.min(3.6, u)); d += speed * dt; dist += speed * dt; if (d > L) d -= L;
    }
    const p = v3(d, u, 0), ahead = v3(d + 3, u, 0); car.position.copy(p); car.lookAt(ahead.x, p.y + (ahead.y - p.y), ahead.z); car.rotateY(Math.PI);
    const cp = v3(d - 10.5, u + 3.2, 3.5); if (!camPos.v) camPos.v = cp.clone(); camPos.v.lerp(cp, Math.min(1, dt * 3)); cam.position.copy(camPos.v); const la = v3(d + 16, u + 1.6, 1.6); cam.lookAt(la);
    mtn.position.set(cam.position.x, 0, cam.position.z);
    const shown = S.units === 'kmh' ? speed * 3.6 : speed * 2.237; spdN.textContent = Math.round(shown);
    renderer.render(scene, cam); requestAnimationFrame(loop); };
  const start = () => { hud.style.transition = ''; running = true; paused = false; ov.classList.add('off'); ov.classList.remove('paused'); hud.classList.add('on'); begin.textContent = 'continue'; sr.focus(); };
  const pause = () => { paused = true; ov.classList.remove('off'); ov.classList.add('paused'); hud.classList.remove('on'); };
  const KM = { ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA0: 'left', ArrowRight: 'right', KeyD: 'right' };
  sr.addEventListener('keydown', (e) => { if (e.code === 'Escape') { running && !paused ? pause() : start(); return; } if (e.code === 'KeyA') { setAuto(!S.auto); return; } const k = KM[e.code]; if (k) { keys[k] = true; if (S.auto && running) setAuto(false); e.preventDefault(); } });
  sr.addEventListener('keyup', (e) => { const k = KM[e.code]; if (k) keys[k] = false; });
  sr.addEventListener('mousemove', (e) => { const r = sr.getBoundingClientRect(); mouseX = (e.clientX - r.left) / r.width; });
  setUnits(S.units); setAuto(S.auto); setSteer(S.steer);
  window.__demoProof = async () => {
    const out = []; for (let i = 0; i < 80 && !ready; i++) await sleep(100); out.push(`webgl ready=${ready}`);
    const prevLS = localStorage.getItem(KEY); const d0 = dist; start(); await sleep(400); out.push(`begin → overlay hidden=${ov.classList.contains('off')} hud=${hud.classList.contains('on')}`);
    out.push(`moved ${(dist - d0).toFixed(1)}m speed=${spdN.textContent}${unitL.textContent}`);
    setAuto(false); const u0 = u; sr.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' })); await sleep(350); sr.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' })); out.push(`manual steer u ${u0.toFixed(2)}→${u.toFixed(2)}`); setAuto(true);
    setUnits('mph'); await sleep(40); out.push(`units → ${spdN.textContent} ${unitL.textContent}`);
    set.classList.add('on'); const bg0 = sr.style.background; todR.value = 10; todR.dispatchEvent(new Event('input')); out.push(`settings open, tod→noon sky ${bg0}→${sr.style.background}`);
    out.push(`persisted=${JSON.parse(localStorage.getItem(KEY) || '{}').tod === 10}`);
    sr.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' })); out.push(`esc pause overlay=${!ov.classList.contains('off')}`);
    hud.style.transition = 'none'; resetSettings(); set.classList.remove('on'); if (prevLS) localStorage.setItem(KEY, prevLS); running = false; paused = false; ov.classList.remove('paused', 'off'); hud.classList.remove('on'); begin.textContent = 'begin';
    return out.join('; ') + '; restored';
  };
};
V['pixelthoughts-star-shrink-60s-ritual'] = (root, T) => {
  import('@fontsource/coming-soon'); import('@fontsource-variable/nunito'); import('@fontsource/lato/700.css');
  theme(root, T, { bg: '#0f141c', fg: '#ffffff', ac: '#e0681d', dark: true });
  const CS = "'Coming Soon',cursive", NU = "'Nunito Variable',sans-serif";
  root.append(h('style', {}, `.pt{position:absolute;inset:0;overflow:hidden;background:radial-gradient(120% 90% at 55% 100%,#1d2d3c 0%,#141c27 45%,#0d1016 100%);color:#fff;user-select:none}
.pt canvas{position:absolute;inset:0;width:100%;height:100%}
.pt-intro{position:absolute;left:0;right:0;top:300px;text-align:center;transition:opacity 2s ease;pointer-events:none}.pt-intro h1{font:400 80px/1.1 ${CS};margin:0;color:#ffffffa6}.pt-intro p{font:400 25px ${CS};margin:12px 0 0;color:#ffffff8c}
.pt-main{position:absolute;inset:0;transition:opacity 2s ease}
.pt-prompt{position:absolute;left:0;right:0;top:118px;text-align:center;font:400 40px ${CS};color:#ffffff8f;transition:opacity 1.6s ease;pointer-events:none;padding:0 40px}
.pt-starw{position:absolute;left:50%;top:412px;width:0;height:0}
.pt-star{position:absolute;left:-150px;top:-150px;width:300px;height:300px;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;
background:radial-gradient(circle at 50% 50%,#e4e4e4 0 52%,#d6d6d6 70%,#ededed 92%,#c9c9c9 100%);
box-shadow:0 0 6px 3px #e8742a,0 0 22px 8px #d0581acc,0 0 60px 18px #c1501a55,inset 0 0 26px #00000026;will-change:transform;cursor:pointer}
.pt-star span{font:700 36px/1.18 Lato,'Helvetica Neue',sans-serif;color:#000;padding:0 40px;max-height:240px;overflow:hidden;word-break:break-word}
.pt-form{position:absolute;left:50%;top:684px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:30px;transition:opacity 3s}
.pt-form input{width:462px;height:40px;border:0;border-radius:6px;background:#fff;padding:0 12px;font:400 15px ${NU};color:#333;outline:none;box-shadow:0 0 0 2px #ffffff22}.pt-form input::placeholder{color:#888}
.pt-done{width:138px;height:42px;border:0;border-radius:6px;background:#b65a2b;color:#fff;font:300 16px ${NU};letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:background .2s}.pt-done:hover{background:#c9662f}
.pt-end{position:absolute;left:0;right:0;top:330px;text-align:center;font:400 32px/1.5 ${CS};color:#ffffffd9;opacity:0;transition:opacity 2.5s;pointer-events:none}.pt-end.on{opacity:1;pointer-events:auto}
.pt-end button{margin-top:34px;background:none;border:1px solid #ffffff55;border-radius:6px;color:#fff;font:300 15px ${NU};letter-spacing:2px;padding:10px 22px;cursor:pointer;text-transform:uppercase}.pt-end button:hover{background:#ffffff14}
.pt-snd{position:absolute;right:26px;top:22px;width:40px;height:40px;border-radius:50%;border:1px solid #ffffff33;background:#ffffff0d;color:#ffffffb0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:opacity .4s}.pt-snd.on{color:#fff;border-color:#e8742a99}
.pt-time{position:absolute;left:0;right:0;bottom:0;height:3px;background:#ffffff0d}.pt-time i{display:block;height:100%;width:0;background:#e8742a88}
`));
  const cv = h('canvas'), ctx = cv.getContext('2d');
  const PROMPTS = [[0, 'Put a stressful thought in the star'], [6, 'Relax and watch your thought'], [11, 'Take a deep breath in....'], [15, '....and breathe out'], [21, 'Of course you feel pulled in every direction'], [29, 'Your mind is holding them all at once'], [37, 'That is why it feels so big'], [44, ''], [50, 'Watch it shrink.... and take the crowding with it'], [58, 'It is just one thought among many'], [63, '']];
  const DUR = 66;
  const intro = h('div.pt-intro', {}, h('h1', {}, 'Pixel Thoughts'), h('p', {}, 'A 60-second meditation tool to help clear your mind'));
  const prompt = h('div.pt-prompt', {}, PROMPTS[0][1]);
  const txt = h('span'), star = h('div.pt-star', { title: 'Click the star to type', onclick: () => inp.focus() }, txt), starw = h('div.pt-starw', {}, star);
  const inp = h('input', { placeholder: 'What’s bothering you?...', maxlength: 80, oninput: () => { txt.textContent = inp.value; fit(); }, onkeydown: (e) => { if (e.key === 'Enter') begin(); } });
  const form = h('div.pt-form', {}, inp, h('button.pt-done', { onclick: () => begin() }, 'Done'));
  const main = h('div.pt-main', {}, prompt, starw, form);
  const end = h('div.pt-end', {}, 'Hope you feel less stressed', h('br'), 'and more connected', h('br'), h('button', { onclick: () => replay() }, '↻  Clear another thought'));
  const bar = h('i'), timeBar = h('div.pt-time', {}, bar);
  let snd = false, AC = null, gain = null;
  const sndBtn = h('button.pt-snd', { title: 'Ambient sound', html: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path class="w" d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></svg>', onclick: () => setSound(!snd) });
  const setSound = (on) => { snd = on; sndBtn.classList.toggle('on', on); sndBtn.querySelector('.w').style.opacity = on ? 1 : 0.25;
    try { if (on && !AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); gain = AC.createGain(); gain.gain.value = 0; const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700; f.connect(gain); gain.connect(AC.destination);
        [110, 164.8, 220, 277.2].forEach((fr, i) => { const o = AC.createOscillator(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = fr; const g = AC.createGain(); g.gain.value = 0.05; const l = AC.createOscillator(); l.frequency.value = 0.07 + i * 0.03; const lg = AC.createGain(); lg.gain.value = 0.035; l.connect(lg); lg.connect(g.gain); l.start(); o.connect(g); g.connect(f); o.start(); }); }
      if (AC) { AC.resume?.(); const t = AC.currentTime; gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(gain.gain.value, t); gain.gain.linearRampToValueAtTime(on ? 0.5 : 0, t + 2.5); } } catch {} };
  sndBtn.querySelector('.w').style.opacity = 0.25;
  const pt = h('div.pt', {}, cv, intro, main, end, sndBtn, timeBar); root.append(pt);
  const fit = () => { const n = txt.textContent.length; txt.style.fontSize = (n < 26 ? 36 : n < 44 ? 30 : n < 60 ? 25 : 21) + 'px'; };
  // starfield
  const R = rng(7); let W = 0, H = 0; const stars = Array.from({ length: 300 }, () => ({ x: R() * 2 - 1, y: R() * 2 - 1, z: 0.25 + R() * 0.75, s: R() < 0.14 ? 2.6 : R() < 0.5 ? 1.8 : 1.2, p: R() * 6.28, sp: 0.6 + R() * 2 }));
  const size = () => { const r = pt.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * devicePixelRatio; cv.height = H * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
  new ResizeObserver(size).observe(pt); size();
  let phase = 'intro', t0 = performance.now(), tm = 0, zoom = 1, lastP = -1;
  const scaleAt = (t) => (t <= 3 ? 1 : Math.max(0.035, Math.pow(Math.max(0, 1 - (t - 3) / 57), 0.8)));
  const setPrompt = (s2) => { if (prompt.dataset.t === s2) return; prompt.dataset.t = s2; prompt.style.opacity = 0; clearTimeout(prompt._t); prompt._t = setTimeout(() => { prompt.textContent = s2; prompt.style.opacity = s2 ? 1 : 0; }, 1000); };
  const seek = (t) => { tm = t; const sc = scaleAt(t); star.style.transform = `scale(${sc.toFixed(4)})`; star.style.opacity = t > 61 ? Math.max(0, 1 - (t - 61) / 2) : 1; bar.style.width = Math.min(100, (t / 60) * 100) + '%';
    let k = 0; PROMPTS.forEach(([s2], i) => { if (t >= s2) k = i; }); if (k !== lastP) { lastP = k; setPrompt(PROMPTS[k][1]); }
    if (t >= DUR && phase === 'run') { phase = 'end'; end.classList.add('on'); prompt.style.opacity = 0; if (snd) setSound(false); } };
  const begin = () => { if (phase !== 'input') return; if (!inp.value.trim()) { inp.focus(); inp.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 260 }); return; } txt.textContent = inp.value.trim(); fit(); inp.blur(); form.style.opacity = 0; form.style.pointerEvents = 'none'; phase = 'run'; t0 = performance.now(); lastP = 0; prompt.dataset.t = PROMPTS[0][1]; };
  const toInput = () => { phase = 'input'; intro.style.opacity = 0; main.style.opacity = 1; main.style.pointerEvents = 'auto'; };
  const replay = () => { end.classList.remove('on'); txt.textContent = ''; inp.value = ''; form.style.opacity = 1; form.style.pointerEvents = 'auto'; star.style.transition = 'none'; seek(0); tm = 0; lastP = -1; prompt.dataset.t = ''; prompt.textContent = PROMPTS[0][1]; prompt.style.opacity = 1; bar.style.width = 0; zoom = 1; phase = 'input'; };
  const toIntro = () => { replay(); phase = 'intro'; t0 = performance.now(); intro.style.transition = main.style.transition = 'none'; intro.style.opacity = 1; main.style.opacity = 0; main.style.pointerEvents = 'none'; void main.offsetWidth; intro.style.transition = main.style.transition = ''; };
  toIntro();
  let prev = performance.now();
  const loop = (now) => { const dt = Math.min(0.1, (now - prev) / 1000); prev = now;
    if (phase === 'intro' && now - t0 > 5200) toInput();
    if (phase === 'run') { seek(tm + dt); zoom += dt * 0.012; } else if (phase === 'end') zoom += dt * 0.004;
    ctx.clearRect(0, 0, W, H); const cx = W * 0.5, cy = H * 0.48, ts = now / 1000;
    for (const st of stars) { const k = (zoom - 1) * st.z * 2.2; let x = st.x * (1 + k), y = st.y * (1 + k); if (Math.abs(x) > 1.05 || Math.abs(y) > 1.05) { st.x = (R() * 2 - 1) * 0.3; st.y = (R() * 2 - 1) * 0.3; st.x /= 1 + k; st.y /= 1 + k; x = st.x * (1 + k); y = st.y * (1 + k); }
      const a = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(ts * st.sp + st.p)); ctx.globalAlpha = a * (0.35 + st.z * 0.65); ctx.fillStyle = '#fff'; const sz = st.s * (0.8 + st.z * 0.4); ctx.fillRect(cx + x * W * 0.55 - sz / 2, cy + y * H * 0.6 - sz / 2, sz, sz); }
    ctx.globalAlpha = 1; requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  window.__demoProof = async () => {
    const out = []; out.push(`intro visible=${intro.style.opacity === '1'}`); toInput(); out.push(`input phase, prompt="${prompt.textContent}"`);
    inp.value = 'I have too many deadlines'; inp.dispatchEvent(new Event('input')); out.push(`star text="${txt.textContent}"`);
    inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); out.push(`phase=${phase} form hidden=${form.style.opacity === '0'}`);
    const sc = []; for (const t of [0, 15, 30, 45, 59]) { seek(t); sc.push(`${t}s:${(+star.style.transform.match(/[\d.]+/)[0]).toFixed(2)}`); } out.push(`star scale ${sc.join(' ')}`);
    seek(16); await sleep(1100); const p1 = prompt.textContent; seek(30); await sleep(1100); out.push(`prompts "${p1}" → "${prompt.textContent}"`);
    setSound(true); out.push(`sound=${snd}`); setSound(false);
    seek(DUR + 0.1); out.push(`end screen=${end.classList.contains('on')} "${end.textContent.slice(0, 27)}"`);
    toIntro(); await sleep(50); return out.join('; ') + '; restored';
  };
};
V['ia-writer-focus-mode-typewriter-hero'] = (root, T) => {
  import('@fontsource/ibm-plex-mono/400.css'); import('@fontsource/ibm-plex-mono/500.css');
  import('@fontsource/ibm-plex-sans/400.css'); import('@fontsource/ibm-plex-sans/500.css'); import('@fontsource/ibm-plex-sans/600.css'); import('@fontsource/ibm-plex-sans/700.css');
  theme(root, T, { bg: '#f7f7f7', fg: '#222', ac: '#1ea6e8', dark: false }); scroll(root);
  const SANS = "'IBM Plex Sans',system-ui,sans-serif", MN = "'IBM Plex Mono',ui-monospace,monospace", CY = '#19b6e9', BLUE = '#1ea6e8';
  root.append(h('style', {}, `.ia{background:#f7f7f7;color:#222;font:400 17px/1.65 ${SANS};min-height:100%}.ia button{font-family:${SANS};cursor:pointer}
.ia-nav{position:sticky;top:0;z-index:5;height:48px;background:#f7f7f7e8;backdrop-filter:blur(10px)}.ia-nav>div{max-width:1024px;margin:0 auto;height:100%;display:flex;align-items:center;gap:22px;font-size:17px}
.ia-nav a{color:#222;text-decoration:none;cursor:pointer}.ia-nav .sp{flex:1}.ia-get{background:${BLUE};color:#fff!important;font-weight:700;border-radius:99px;padding:3px 17px;letter-spacing:.05em;font-size:15.5px}
.ia-hero{text-align:center;padding:44px 0 0}.ia-hero h1{font:700 58px/1 ${SANS};letter-spacing:-.012em;margin:0;display:inline-flex;align-items:center;gap:20px}
.ia-ic{width:50px;height:50px;border-radius:12px;background:linear-gradient(#fff,#f1f1f1);box-shadow:0 1px 2px #0002,0 6px 14px #0000001a;display:flex;align-items:center;justify-content:center}.ia-ic i{width:6px;height:27px;border-radius:3px;background:linear-gradient(#5fd4ff,${BLUE})}
.ia-hero p{font:500 22.5px/1.38 ${SANS};margin:26px auto 0;max-width:420px}
.ia-card{position:relative;max-width:1024px;height:760px;margin:62px auto 0;background:#f9f9f9;border-radius:10px;box-shadow:0 40px 70px -30px #0000003a,0 2px 8px #0000000f;overflow:hidden;cursor:text}
.ia-view{position:absolute;inset:0 0 58px 0;overflow:hidden}
.ia-col{position:absolute;left:50%;width:684px;margin-left:-342px;top:110px;transition:transform .2s cubic-bezier(.2,.7,.3,1)}
.ia-r,.ia-ta{font:400 18px/30px ${MN};white-space:pre-wrap;overflow-wrap:break-word;word-break:normal;margin:0;padding:0;border:0;width:100%;letter-spacing:0;tab-size:4;font-variant-ligatures:none}
.ia-r{color:#1c1c1c}.ia-ta{position:absolute;inset:0;background:transparent;color:transparent;caret-color:transparent;resize:none;outline:none;overflow:hidden;display:block}.ia-ta::selection{background:${BLUE}38;color:transparent}
.ia-r span{transition:color .3s}.ia-r .d{color:#c9c9c9}.ia-r .p{color:#2f8fd8}.ia-r .p.d{color:#b9d9f2}.ia-r .s{text-decoration:line-through;text-decoration-thickness:1.5px;text-decoration-color:#a0a0a0;color:#8b8b8b}.ia-r .s.d{color:#d5d5d5}
.ia-car{display:inline-block;width:0;height:30px;vertical-align:top;position:relative}.ia-car:after{content:'';position:absolute;left:1px;top:3px;width:3px;height:25px;border-radius:1px;background:${CY};animation:iabl 1.06s steps(1) infinite}
.ia-card.typing .ia-car:after{animation:none}@keyframes iabl{50%{opacity:0}}
.ia-bar{position:absolute;left:0;right:0;bottom:0;height:58px;display:flex;align-items:center;gap:18px;padding:0 26px;font:500 13px ${SANS};color:#a3a3a3;border-top:1px solid #00000008;background:#f9f9f9}
.ia-seg{display:flex;gap:2px;background:#efefef;border-radius:7px;padding:2px}.ia-seg button,.ia-tg{border:0;background:none;color:#9a9a9a;font:500 13px ${SANS};padding:4px 10px;border-radius:5px}
.ia-seg button.on{background:#fff;color:#222;box-shadow:0 1px 2px #0002}.ia-tg{display:flex;align-items:center;gap:7px;padding:4px 4px}.ia-tg i{width:24px;height:14px;border-radius:7px;background:#ddd;position:relative;transition:background .2s}.ia-tg i:after{content:'';position:absolute;top:2px;left:2px;width:10px;height:10px;border-radius:50%;background:#fff;transition:transform .2s}
.ia-tg.on{color:#222}.ia-tg.on i{background:${BLUE}}.ia-tg.on i:after{transform:translateX(10px)}.ia-paste{border:1px solid #e3e3e3;background:#fff;color:#2f8fd8;border-radius:6px;padding:4px 10px;font:500 12.5px ${SANS};display:none}.ia-paste.on{display:block}
.ia-bar .sp{flex:1}.ia-wc{font-variant-numeric:tabular-nums}
.ia-band{background:#2a2a2a;color:#fff;margin-top:110px;padding:80px 0 76px;text-align:center}.ia-band h2{font:700 44px/1.1 ${SANS};margin:0}.ia-band p{color:#bdbdbd;font-size:19px;margin:12px 0 44px}
.ia-dl{display:flex;justify-content:center;gap:18px}.ia-dl div{display:flex;flex-direction:column;align-items:center;gap:12px}.ia-dl button{height:53px;border:0;border-radius:99px;background:#f7f7f7;color:#222;font:600 18.5px ${SANS};padding:0 26px;display:flex;align-items:center;gap:9px;transition:transform .15s}.ia-dl button:hover{transform:translateY(-2px)}.ia-dl small{font-size:12px;color:#9a9a9a}
.ia-min{text-align:center;padding:84px 20px 120px}.ia-min h2{font:700 44px/1.08 ${SANS};margin:0 0 26px}.ia-min p{font:400 21px/1.5 ${SANS};max-width:560px;margin:0 auto 18px;color:#333}.ia-min .k{font-size:17px;color:#666;max-width:620px}
`));
  const P0 = 'Writing well is not a matter of the right app, the perfect font or a certain tool. It requires focus—good writing needs your full, undivided attention. If you want to write well—in fact, if you want to do anything well—you need to concentrate.\n\nThere are many ways to succeed at writing, and there are even more ways to fail. However, successful writing is never a matter of luck. To write well, you need to be fully awake, dead serious and unconditionally enjoy what you do—like a child, when it plays.';
  const AI = ' Honestly, writing is basically just a really powerful tool that can actually unlock a lot of value in order to help you thrive.';
  const FILLER = /\b(very|really|just|actually|basically|literally|quite|simply|totally|honestly|in order to|a lot|kind of|sort of)\b/gi;
  let mode = 'paragraph', tw = true, authOn = false, styleOn = false, auth = Array(P0.length).fill(0), typT = 0;
  const r = h('div.ia-r'), ta = h('textarea.ia-ta', { spellcheck: false, 'aria-label': 'iA Writer editor' }); ta.value = P0;
  const col = h('div.ia-col', {}, r, ta), view = h('div.ia-view', {}, col);
  const segB = ['Sentence', 'Paragraph', 'Off'].map((m) => h('button', { onclick: () => setMode(m.toLowerCase()) }, m));
  const tg = (label, get, set) => { const b = h('button.ia-tg', { onclick: () => { set(!get()); } }, h('i'), label); return b; };
  const twB = tg('Typewriter', () => tw, (v) => { tw = v; render(); }), auB = tg('Authorship', () => authOn, (v) => { authOn = v; render(); }), stB = tg('Style Check', () => styleOn, (v) => { styleOn = v; render(); });
  const pasteB = h('button.ia-paste', { onclick: (e) => { e.stopPropagation(); pasteAI(); } }, '⌘V  Paste AI text'), wc = h('span.ia-wc');
  const bar = h('div.ia-bar', { onmousedown: (e) => e.preventDefault() }, h('span', {}, 'Focus'), h('div.ia-seg', {}, segB), twB, auB, pasteB, stB, h('span.sp'), wc);
  const card = h('div.ia-card', { onmousedown: (e) => { if (e.target === ta || bar.contains(e.target)) return; e.preventDefault(); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); render(); } }, view, bar);
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let act = [0, 0];
  const activeRange = (v, c) => {
    if (mode === 'off') return [0, v.length];
    const ps = v.lastIndexOf('\n', c - 1) + 1; let pe = v.indexOf('\n', c); if (pe < 0) pe = v.length;
    if (mode === 'paragraph') return [ps, pe];
    const para = v.slice(ps, pe), rel = c - ps, re = /[^.!?…]*[.!?…]+[”"'’)\]]*\s*|[^.!?…]+$/g, arr = []; let m;
    while ((m = re.exec(para)) && m[0].length) arr.push([m.index, m.index + m[0].length]);
    const f = arr.find(([x, y]) => rel >= x && rel < y) || arr[arr.length - 1] || [0, 0];
    return [ps + f[0], ps + f[1]];
  };
  const render = () => {
    const v = ta.value, collapsed = ta.selectionStart === ta.selectionEnd, c = ta.selectionEnd;
    act = activeRange(v, c); const [a, b] = act;
    const sty = new Uint8Array(v.length); if (styleOn) for (const m of v.matchAll(FILLER)) sty.fill(1, m.index, m.index + m[0].length);
    let html = '', cur = -1, buf = '';
    const flush = () => { if (buf) html += cur ? `<span class="${[cur & 1 ? 'd' : '', cur & 2 ? 'p' : '', cur & 4 ? 's' : ''].join(' ').trim()}">${esc(buf)}</span>` : esc(buf); buf = ''; };
    for (let i = 0; i <= v.length; i++) {
      if (i === c && collapsed) { flush(); html += '<span class="ia-car"></span>'; }
      if (i === v.length) break;
      const f = (i < a || i >= b ? 1 : 0) | (authOn && auth[i] ? 2 : 0) | (sty[i] ? 4 : 0);
      if (f !== cur) { flush(); cur = f; } buf += v[i];
    }
    flush(); r.innerHTML = html + '\u200b';
    ta.style.height = r.offsetHeight + 'px';
    const car = r.querySelector('.ia-car'), center = (view.clientHeight || 700) / 2;
    col.style.transform = tw && car ? `translateY(${Math.round(center - 15 - 110 - car.offsetTop)}px)` : 'none';
    view.scrollTop = 0;
    const words = v.trim() ? v.trim().split(/\s+/).length : 0; wc.textContent = `${words} words · ${Math.max(1, Math.round(words / 220))} min`;
    segB.forEach((x) => x.classList.toggle('on', x.textContent.toLowerCase() === mode)); twB.classList.toggle('on', tw); auB.classList.toggle('on', authOn); stB.classList.toggle('on', styleOn); pasteB.classList.toggle('on', authOn);
  };
  const setMode = (m) => { mode = m; render(); };
  let prev = ta.value;
  ta.addEventListener('input', (e) => {
    const v = ta.value; let p = 0; while (p < prev.length && p < v.length && prev[p] === v[p]) p++;
    let s = 0; while (s < prev.length - p && s < v.length - p && prev[prev.length - 1 - s] === v[v.length - 1 - s]) s++;
    const ins = v.length - p - s, flag = e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop' ? 1 : 0;
    auth = auth.slice(0, p).concat(Array(ins).fill(flag), auth.slice(prev.length - s)); prev = v;
    card.classList.add('typing'); clearTimeout(typT); typT = setTimeout(() => card.classList.remove('typing'), 650); render();
  });
  ['keyup', 'click', 'select', 'focus'].forEach((ev) => ta.addEventListener(ev, () => render()));
  ta.addEventListener('blur', () => card.classList.add('blur')); ta.addEventListener('focus', () => card.classList.remove('blur'));
  document.addEventListener('selectionchange', () => { if (document.activeElement === ta) render(); });
  view.addEventListener('scroll', () => { view.scrollTop = 0; });
  ta.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); setMode(mode === 'off' ? 'sentence' : mode === 'sentence' ? 'paragraph' : 'off'); } });
  const insert = (text, type) => { const st = ta.selectionStart, en = ta.selectionEnd; ta.setRangeText(text, st, en, 'end'); ta.dispatchEvent(new InputEvent('input', { inputType: type, data: text, bubbles: true })); };
  const pasteAI = () => { ta.focus(); insert(AI, 'insertFromPaste'); };
  const icon = (d) => `<svg width="17" height="19" viewBox="0 0 17 20" fill="currentColor">${d}</svg>`;
  const APPLE = icon('<path d="M14 10.6c0-2.5 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C3.700 5 2.100 6 1.200 7.500-.6 10.700.7 15.400 2.500 18c.9 1.200 1.900 2.600 3.200 2.500 1.300-.1 1.800-.8 3.300-.8s2 .8 3.300.8c1.400 0 2.300-1.300 3.100-2.500 1-1.400 1.400-2.800 1.400-2.900 0 0-2.800-1-2.800-4.500ZM11.600 3.200c.7-.8 1.200-2 1-3.200-1 0-2.300.7-3 1.500-.7.700-1.300 1.900-1.100 3.100 1.200.1 2.300-.6 3.100-1.400Z"/>'), WIN = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 0h7.4v7.4H0zM8.6 0H16v7.4H8.6zM0 8.6h7.4V16H0zM8.6 8.6H16V16H8.6z"/></svg>';
  const dl = h('div.ia-dl', {}, [['Mac', APPLE, 'Free Trial'], ['Windows', WIN, 'Free Trial'], ['iPad/iPhone', APPLE, 'One-time payment']].map(([n, ic, s2]) => h('div', {}, h('button', { onclick: () => toast(`${n}: ${s2}`) }, h('span', { html: ic, style: { display: 'flex' } }), n), h('small', {}, s2))));
  const ia = h('div.ia', {},
    h('div.ia-nav', {}, h('div', {}, h('a', {}, h('b', {}, 'iA'), ' / Writer'), h('span.sp'), h('a', {}, 'How To'), h('a', {}, 'Support'), h('a.ia-get', { onclick: () => dl.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 'GET'))),
    h('div.ia-hero', {}, h('h1', {}, h('span.ia-ic', {}, h('i')), 'iA Writer'), h('p', {}, 'Keep your hands on the keys and your mind in the text.')),
    card,
    h('div.ia-band', {}, h('h2', {}, '7-Day Free Trial'), h('p', {}, 'Download now. No credit card required.'), dl),
    h('div.ia-min', {}, h('h2', {}, 'Minimal Design', h('br'), 'Maximum Focus'), h('p', {}, 'Every feature in iA Writer earns its place. Nothing competes with your words.'),
      h('p.k', {}, 'Focus Mode keeps you in the flow. It highlights the sentence or paragraph you’re working on and fades everything else. Try it above — Focus: Sentence, Paragraph or Off (⌘D), Typewriter keeps the current line centered.')));
  root.append(ia);
  ta.setSelectionRange(ta.value.length, ta.value.length); requestAnimationFrame(render); render();
  const dimChars = () => [...r.querySelectorAll('.d')].reduce((n, e) => n + e.textContent.length, 0);
  const caretY = () => { const c = r.querySelector('.ia-car'); return c ? Math.round(c.getBoundingClientRect().top - view.getBoundingClientRect().top) : -1; };
  window.__demoProof = async () => {
    const out = [], end = () => ta.value.length; const place = (i) => { ta.setSelectionRange(i, i); render(); };
    setMode('paragraph'); place(end()); out.push(`paragraph mode: caret in ¶2, dimmed=${dimChars()} chars (¶1 length ${P0.indexOf('\n')})`);
    place(20); out.push(`caret→¶1: dimmed=${dimChars()} active="${ta.value.slice(...act).slice(0, 24)}…"`);
    setMode('sentence'); place(P0.indexOf('However') + 5); out.push(`sentence mode active="${ta.value.slice(...act).trim()}"`);
    setMode('off'); out.push(`off → dimmed=${dimChars()}`); setMode('sentence');
    ta.focus(); place(end()); insert(' Write every day.', 'insertText'); out.push(`typed → active="${ta.value.slice(...act).trim()}" words=${wc.textContent}`);
    const y0 = caretY(); insert('\n\nA new paragraph begins here and keeps the caret where your eyes are.\n\nAnd another one, line after line, the page moves — not your eyes.', 'insertText'); await sleep(260);
    out.push(`typewriter: caret y ${y0}px → ${caretY()}px (view center ${Math.round(view.clientHeight / 2 - 15)}), col shift=${col.style.transform}`);
    tw = false; render(); await sleep(260); out.push(`typewriter off → caret y=${caretY()}px`); tw = true;
    authOn = true; render(); pasteAI(); out.push(`authorship: pasted chars colored=${[...r.querySelectorAll('.p')].reduce((n, e) => n + e.textContent.length, 0)}`);
    styleOn = true; render(); out.push(`style check strikes=${[...r.querySelectorAll('.s')].map((e) => e.textContent.trim()).join(',')}`);
    ta.value = P0; prev = P0; auth = Array(P0.length).fill(0); mode = 'paragraph'; tw = true; authOn = false; styleOn = false; ta.blur(); place(P0.length); await sleep(250);
    return out.join('; ') + '; restored';
  };
};
V['devouring-details-scroll-ruler-reference-manual'] = (root, T) => {
  theme(root, T, { bg: '#ededed', fg: '#171717', ac: '#ff5c00', dark: false }); scroll(root);
  const F = "'Inter Variable',-apple-system,system-ui,sans-serif", O = '#ff5500', SER = "'Fraunces Variable',Georgia,serif";
  root.append(h('style', {}, `.dd{background:#ededed;min-height:100%;padding:128px 0 180px;font:450 24px/40px ${F};color:#000;letter-spacing:-.018em;font-feature-settings:'ss01','cv11'}.dd button{font-family:${F};cursor:pointer}
.dd-sheet{width:1152px;margin:0 auto;background:#fff;padding:127px 128px 140px;position:relative}
.dd-top{display:grid;grid-template-columns:464px 1fr}.dd-dot{width:20px;height:20px;border-radius:50%;background:${O};margin:6px 0 0 -2px}
.dd-nav a{display:block;font:500 24px/32px ${F};color:#171717;cursor:pointer;width:max-content;transition:color .15s}.dd-nav a:hover{color:${O}}
.dd-intro{display:grid;grid-template-columns:464px 1fr;margin-top:104px}.dd-intro p{margin:0;max-width:432px}
.dd-media{margin-top:100px;height:540px;border:1px solid #f0f0f0;background:#fbfbfb;border-radius:24px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
.dd-cap{text-align:center;font:400 16px/24px ${F};color:#666;margin:18px 0 0;letter-spacing:-.01em}
.dd-play{position:absolute;width:64px;height:64px;border-radius:50%;border:0;background:#e3e3e3;display:flex;align-items:center;justify-content:center;transition:transform .15s,background .15s}.dd-play:hover{background:#dadada;transform:scale(1.05)}.dd-play:active{transform:scale(.96)}
.dd h2{font:450 30px/1.3 ${F};margin:120px 0 26px;letter-spacing:-.02em;position:relative}.dd h2 .o{position:absolute;left:-30px;top:13px;width:14px;height:14px;border-radius:50%;background:${O}}
.dd p.b{font:450 22px/36px ${F};margin:0 0 24px}.dd p.b em{font:italic 400 23px ${SER}}.dd .mu{color:#8f8f8f}
.dd-logos{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:110px}.dd-logos div{height:180px;border-radius:16px;background:#f6f6f6;display:flex;align-items:center;justify-content:center;color:#888;transition:background .2s,color .2s}.dd-logos div:hover{background:#efefef;color:#555}
.dd-logos b{font:700 33px ${F};letter-spacing:-.04em}.dd-cap2{display:flex;justify-content:center;align-items:center;gap:7px;font:400 16px ${F};color:#666;margin-top:20px}.dd-cap2 i{width:10px;height:10px;border-radius:50%;background:${O}}
.dd-tst{font:500 29px/47px ${F};margin-top:110px;letter-spacing:-.02em}.dd-tst span{transition:filter .25s,opacity .25s}.dd-tst span.g{color:#8c8c8c}.dd-av{display:inline-block;width:26px;height:26px;border-radius:50%;vertical-align:-3px;margin-right:6px;border:2px solid #fff;box-shadow:0 0 0 1px #0001}
.dd-rt{display:inline-flex;margin-top:26px;font:500 15px ${F};border:1px solid #e5e5e5;border-radius:99px;padding:6px 16px;color:#333;background:#fff}
.dd-grid8{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:30px 0 56px}.dd-chip{height:96px;border-radius:12px;background:#f6f6f6;font:500 11.5px/1.2 'JetBrains Mono Variable',monospace;letter-spacing:.06em;color:#6b6b6b;padding:14px;display:flex;align-items:flex-end;position:relative;transition:background .2s,color .2s;cursor:pointer}.dd-chip:hover{background:#efefef;color:#111}
.dd-free{position:absolute;right:10px;top:10px;font:600 10px 'JetBrains Mono Variable',monospace;color:${O};border:1px solid ${O}55;border-radius:4px;padding:2px 5px}
.dd-pgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:34px 0 56px}.dd-card{position:relative;height:360px;border-radius:18px;background:#f6f6f6;overflow:hidden}.dd-card>label{position:absolute;left:18px;bottom:16px;font:500 12px 'JetBrains Mono Variable',monospace;letter-spacing:.08em;color:#6b6b6b;pointer-events:none}
.dd-check{display:flex;gap:12px;align-items:center;font:450 22px/36px ${F};margin:6px 0}.dd-check svg{flex:none}
.dd-cta{display:flex;align-items:center;height:124px;border-radius:62px;background:${O};color:#fff;margin:44px 0 0;padding:0 22px 0 40px;font:450 50px/1 ${F};letter-spacing:-.035em;cursor:pointer;border:0;width:100%;transition:filter .2s}.dd-cta:hover{filter:brightness(1.05)}.dd-cta .sp{flex:1}
.dd-cta .ar{width:88px;height:88px;border-radius:50%;background:#fff;color:#000;display:flex;align-items:center;justify-content:center;margin-left:30px;overflow:hidden;position:relative}.dd-cta .ar svg{transition:transform .35s cubic-bezier(.3,.7,.2,1)}.dd-cta:hover .ar svg{transform:translateX(6px)}
.dd-faq{margin-top:20px}.dd-q{border:0;background:none;width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 0;font:450 23px/36px ${F};color:#000;text-align:left;letter-spacing:-.018em}
.dd-q svg{transition:transform .3s cubic-bezier(.3,.7,.2,1);transform:rotate(45deg);flex:none}.dd-it.on .dd-q svg{transform:rotate(0)}
.dd-a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s cubic-bezier(.3,.7,.2,1),opacity .3s;opacity:0}.dd-it.on .dd-a{grid-template-rows:1fr;opacity:1}.dd-a>div{overflow:hidden}.dd-a p{font:450 22px/36px ${F};color:#7a7a7a;margin:0 0 16px}
.dd-foot{margin-top:90px;font:500 12px 'JetBrains Mono Variable',monospace;letter-spacing:.08em;color:${O};cursor:pointer}
.dd-rul{position:fixed;left:32px;width:44px;z-index:30}.dd-tk{position:absolute;left:0;height:9px;width:44px;cursor:pointer;display:flex;align-items:center}.dd-tk i{display:block;height:1px;width:18px;background:#9b9b9b;transform-origin:left center;transition:width .18s cubic-bezier(.3,.7,.2,1),background .18s}
.dd-tk.mj i{width:32px;background:#3a3a3a}.dd-tk:hover i{background:${O}}.dd-tk .tt{position:absolute;left:44px;font:500 10px 'JetBrains Mono Variable',monospace;letter-spacing:.08em;color:${O};opacity:0;transition:opacity .15s;white-space:nowrap;pointer-events:none}.dd-tk:hover .tt{opacity:1}
.dd-line{position:fixed;left:14px;right:0;height:1px;background:${O};z-index:29;pointer-events:none;opacity:.85}.dd-line:before{content:'';position:absolute;left:0;top:-4px;border:4.5px solid transparent;border-left:6px solid ${O};border-right:0}
.dd-tag{position:absolute;top:0;font:500 11px/16px 'JetBrains Mono Variable',monospace;letter-spacing:.08em;background:${O};color:#fff;padding:0 7px;pointer-events:auto;cursor:pointer}
.dd-ms{position:absolute;inset:0}.dd-ms .tk{position:absolute;bottom:50%;width:1px;background:#999;transform-origin:bottom;transition:transform .12s}.dd-ms .pl{position:absolute;top:30%;bottom:25%;width:1px;background:${O}}.dd-ms .pl:before{content:'';position:absolute;left:-3px;top:-6px;border:3.5px solid transparent;border-top:5px solid ${O}}
.dd-strip{position:absolute;left:0;top:50%;margin-top:-34px;display:flex;gap:4px;transition:transform .5s cubic-bezier(.2,.7,.3,1)}.dd-strip i{flex:none;width:44px;height:68px;border-radius:2px}
.dd-morph{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;box-shadow:0 1px 2px #0000001a,0 4px 14px #0000000f;border-radius:20px;width:220px;height:40px;overflow:hidden;transition:width .45s cubic-bezier(.3,1.25,.4,1),height .45s cubic-bezier(.3,1.25,.4,1),border-radius .45s}
.dd-morph.on{width:330px;height:190px;border-radius:16px}.dd-morph .row{display:flex;align-items:center;gap:8px;height:40px;padding:0 14px;font:500 13px ${F};white-space:nowrap}.dd-morph .row i{width:12px;height:12px;border-radius:50%;background:${O}}.dd-morph .row button{margin-left:auto;border:0;background:none;color:#777;font:500 13px ${F}}
.dd-morph textarea{display:block;margin:0 14px;width:calc(100% - 28px);height:94px;border:0;resize:none;outline:none;font:400 14px/1.5 ${F};background:#f7f7f7;border-radius:8px;padding:8px 10px;opacity:0;transition:opacity .2s}.dd-morph.on textarea{opacity:1;transition-delay:.15s}
.dd-morph .snd{position:absolute;right:14px;bottom:10px;border:0;background:#111;color:#fff;border-radius:7px;padding:4px 12px;font:500 12px ${F};opacity:0;transition:opacity .2s}.dd-morph.on .snd{opacity:1;transition-delay:.2s}
.dd-tm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;perspective:800px;cursor:pointer}.dd-tm div{position:absolute;width:210px;height:130px;border-radius:12px;background:#fff;box-shadow:0 1px 3px #0001,0 10px 24px #0000000d;transition:transform .5s cubic-bezier(.3,.7,.2,1),opacity .5s;font:500 12px 'JetBrains Mono Variable',monospace;color:#999;padding:12px}
`));
  const sheet = h('div.dd-sheet'), dd = h('div.dd', {}, sheet); root.append(dd);
  const sec = {}, go = (k, beh = 'smooth') => { const el = sec[k]; if (el) root.scrollTo({ top: el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 140, behavior: beh }); };
  const navI = ['Platform', 'Structure', 'Register', 'FAQ', 'Login'];
  sheet.append(h('div.dd-top', {}, h('div.dd-dot'), h('nav.dd-nav', {}, navI.map((n) => h('a', { onclick: () => (n === 'Login' ? toast('Login → platform (demo)') : go(n)) }, n)))),
    h('div.dd-intro', {}, h('p', {}, 'Have you ever noticed that some animation sequences can be improved with just a touch of delay? Or that some interactions just feel better without any motion at all?'), h('p', {}, 'Devouring Details is an interactive reference manual for interaction-curious designers, containing 23 chapters with 23 downloadable React components.')));
  // radial timeline
  const EV = [['Sketchpad', 1963], ['Mother of All Demos', 1968], ['Xerox Alto', 1973], ['Mac Icons', 1984], ['World Wide Web', 1989], ['Palm Pilot', 1996], ['Infinite Scroll', 2006], ['Hashtag', 2007], ['Like Button', 2009], ['Figma', 2016], ['iPhone X', 2017], ['Vision Pro', 2024]];
  const N = 180, R0 = 168, CX = 300, CY = 270, ang = (y) => ((y - 1961) / 66) * Math.PI * 2 - Math.PI / 2;
  const svgNS = 'http://www.w3.org/2000/svg', rt = document.createElementNS(svgNS, 'svg'); rt.setAttribute('viewBox', '0 0 600 540'); rt.setAttribute('width', '600'); rt.setAttribute('height', '540');
  const ticks = []; for (let i = 0; i < N; i++) { const a = (i / N) * Math.PI * 2 - Math.PI / 2, l = i % 5 ? 7 : 12, ln = document.createElementNS(svgNS, 'line'); ln.setAttribute('x1', CX + Math.cos(a) * R0); ln.setAttribute('y1', CY + Math.sin(a) * R0); ln.setAttribute('x2', CX + Math.cos(a) * (R0 + l)); ln.setAttribute('y2', CY + Math.sin(a) * (R0 + l)); ln.setAttribute('stroke', '#c9c9c9'); ln.setAttribute('stroke-width', '1'); rt.append(ln); ticks.push([ln, a, l]); }
  const labs = EV.map(([n, y]) => { const a = ang(y), g = document.createElementNS(svgNS, 'g'), r1 = R0 + 14, r2 = R0 + 38, x = CX + Math.cos(a) * (r2 + 8), yy = CY + Math.sin(a) * (r2 + 8), anc = Math.cos(a) > .3 ? 'start' : Math.cos(a) < -.3 ? 'end' : 'middle';
    g.innerHTML = `<line x1="${CX + Math.cos(a) * r1}" y1="${CY + Math.sin(a) * r1}" x2="${CX + Math.cos(a) * r2}" y2="${CY + Math.sin(a) * r2}" stroke="#333" stroke-width="1"/><text x="${x}" y="${yy}" text-anchor="${anc}" font-family="${SER.replace(/"/g, '')}" font-style="italic" font-size="11" fill="#555">${n}</text><text x="${x}" y="${yy + 13}" text-anchor="${anc}" font-family="${SER.replace(/"/g, '')}" font-style="italic" font-size="10" fill="#999">${y}</text>`; rt.append(g); return [g, a]; });
  let head = -Math.PI / 2, playing = false, hoverA = null;
  const paintRT = () => { const hA = hoverA ?? head; for (const [ln, a, l] of ticks) { let d = Math.abs(Math.atan2(Math.sin(a - hA), Math.cos(a - hA))); const k = Math.max(0, 1 - d / 0.22); ln.setAttribute('x2', CX + Math.cos(a) * (R0 + l + k * 16)); ln.setAttribute('y2', CY + Math.sin(a) * (R0 + l + k * 16)); ln.setAttribute('stroke', k > 0.05 ? (k > .8 ? O : '#555') : '#c9c9c9'); }
    for (const [g, a] of labs) { const d = Math.abs(Math.atan2(Math.sin(a - hA), Math.cos(a - hA))); g.style.opacity = d < 0.3 ? 1 : 0.55; } };
  const playIc = '<svg width="18" height="20" viewBox="0 0 18 20"><path d="M2 1.5v17L17 10Z" fill="#111"/></svg>', pauseIc = '<svg width="16" height="18" viewBox="0 0 16 18"><rect x="1" width="5" height="18" rx="1" fill="#111"/><rect x="10" width="5" height="18" rx="1" fill="#111"/></svg>';
  const play = h('button.dd-play', { html: playIc, title: 'Play', onclick: () => setPlay(!playing) });
  const setPlay = (v) => { playing = v; play.innerHTML = v ? pauseIc : playIc; };
  const media = h('div.dd-media', { onmousemove: (e) => { const b = rt.getBoundingClientRect(), x = e.clientX - b.left - CX * b.width / 600, y = e.clientY - b.top - CY * b.height / 540, r = Math.hypot(x, y); hoverA = r > 120 && r < 260 ? Math.atan2(y, x) : null; paintRT(); }, onmouseleave: () => { hoverA = null; paintRT(); } }, rt, play);
  sheet.append(media, h('p.dd-cap', {}, 'All footage is recorded of React components'));
  // platform
  const h2 = (k, dot) => { const e = h('h2', {}, dot ? h('span.o') : null, k); sec[k] = e; return e; };
  const mockTwo = h('div.dd-media', { style: { height: '470px', marginTop: '40px', justifyContent: 'stretch', alignItems: 'stretch', display: 'grid', gridTemplateColumns: '1fr 1fr' } },
    h('div', { style: { padding: '26px 28px', font: `450 12.5px/1.75 ${F}`, color: '#bbb', letterSpacing: '-.005em' } }, h('div', { style: { color: '#666', fontSize: '11px', marginBottom: '22px' } }, '▢  Principles  ·  Responsive interfaces'), h('p', { style: { margin: '0 0 12px' } }, 'Similarly, nearly all interactions you perform on a software system must respond with some form of feedback.'),
      h('div', { style: { color: '#999', font: "500 10px 'JetBrains Mono Variable',monospace", letterSpacing: '.08em', margin: '40px 0 10px', display: 'flex', alignItems: 'center', gap: '8px' } }, h('i', { style: { width: '8px', height: '8px', borderRadius: '50%', background: O } }), 'INPUT-RESPONSE LOOP'),
      h('p', { style: { color: '#222', margin: '0 0 12px' } }, 'This "input-response" loop is why the text caret starts blinking when you stop typing—it communicates that the system is still responsive to your next input, and did not suddenly freeze.'), h('p', { style: { color: '#222' } }, 'Loading indicators communicate that the system understood you and is currently thinking of a response.'),
      h('div', { style: { color: '#bbb', font: "500 10px 'JetBrains Mono Variable',monospace", letterSpacing: '.08em', margin: '40px 0 10px' } }, 'EXAGGERATION'), h('p', {}, 'We can say that an interaction is jarring when the response on the screen was not appropriate for the input…')),
    h('div', { style: { background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px', font: `450 30px ${F}`, letterSpacing: '-.03em' } }, h('div', { html: 'the caret<span style="display:inline-block;width:2px;height:32px;background:' + O + ';vertical-align:-6px;margin:0 2px;animation:iabl2 1s steps(1) infinite"></span>is blinking' }), h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', color: '#555' } }, 'please', h('span', { style: { width: '90px', height: '2px', background: `linear-gradient(90deg,${O} 40%,#ddd 40%)`, backgroundSize: '200% 100%', animation: 'ddload 1.6s linear infinite' } }), 'stand by')));
  root.append(h('style', {}, '@keyframes iabl2{50%{opacity:0}}@keyframes ddload{from{background-position:100% 0}to{background-position:-100% 0}}'));
  sheet.append(h2('Platform'), h('p.b', {}, 'Before working on this I thought to myself: “how have I learned myself?”'), h('p.b', { html: 'By trying to build an idea and realising it sucks in practice. With enough iterations and sometimes by accident I’ll get to a place where it feels really good and I\'ll suddenly be able to reason <em>why</em> it sucked.' }), h('p.b', {}, 'Devouring Details is your shortcut to those learning moments.'),
    h('p.b', {}, 'This is not a course in the sense that it is not linearly progressive. You won’t solve code challenges, answer quizzes, or follow step-by-step tutorials. Instead, you’ll interact with prototypes on a custom platform and be exposed to details that I pay attention to.'), mockTwo, h('p.dd-cap', {}, 'Two column layouts offer better navigation through long-form content'),
    h('p.b', { style: { marginTop: '48px' } }, 'Each chapter is digestible with bite-sized efforts through a scrollable experience that doesn\'t ask for too much at once.'), h('p.b', {}, 'I myself use this as a reference manual that I periodically revisit while designing. I would often return to copy some code or to reinforce my understanding of a concept.'));
  const LOGO = [h('span', { html: '<svg width="34" height="40" viewBox="0 0 17 20" fill="currentColor"><path d="M14 10.6c0-2.5 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C3.7 5 2.1 6 1.2 7.5-.6 10.7.7 15.4 2.5 18c.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.8-1-2.8-4.5ZM11.6 3.2c.7-.8 1.2-2 1-3.2-1 0-2.3.7-3 1.5-.7.7-1.3 1.9-1.1 3.1 1.2.1 2.3-.6 3.1-1.4Z"/></svg>' }), h('b', {}, 'OpenAI'),
    h('span', { html: '<svg width="40" height="44" viewBox="0 0 40 44" fill="none" stroke="currentColor" stroke-width="3.2"><path d="M20 4c-3 0-4 3-7 10L5 31c-2 5 1 9 5 9 4 0 7-3 10-7 3 4 6 7 10 7 4 0 7-4 5-9l-8-17C24 7 23 4 20 4Z"/><path d="M20 33c-4-5-6-9-6-12a6 6 0 0 1 12 0c0 3-2 7-6 12Z"/></svg>' }), h('b', { style: { fontSize: '38px', letterSpacing: '-.05em' } }, 'stripe'),
    h('span', { html: '<svg width="30" height="44" viewBox="0 0 30 44" fill="none" stroke="currentColor" stroke-width="3.2"><path d="M8 2h7v13H8a6.5 6.5 0 0 1 0-13ZM15 2h7a6.5 6.5 0 0 1 0 13h-7ZM8 15h7v13H8a6.5 6.5 0 0 1 0-13ZM15 28v7.5A6.5 6.5 0 1 1 8 28Z"/><circle cx="21.5" cy="21.5" r="6.5"/></svg>' })];
  sheet.append(h('div.dd-logos', {}, LOGO.map((l) => h('div', {}, l))), h('div.dd-cap2', {}, h('i'), 'DD is used by designers on world-class teams'));
  const TST = [['Better than a course, it\'s a reference manual to making great work full of tactical secrets I haven\'t seen anywhere else.', '#f6c', '#fd5'], ['Notification came in. I didn’t hesitate. You shouldn’t either.', '#ddd', '#999'], ['Rauno is undoubtedly one of the best in the world at what he does. Strongly recommend his course.', '#c96', '#642'], ['This lowkey changed how I think about building software.', '#a6f', '#226'], ['I need to frame this at the office, wonderful work.', '#68a', '#234'], ['I started reading the intro and found myself opening the inspector like crazy.', '#999', '#333'], ['If even 1/10 of this craft rubs off on work I do, it\'s worth it.', '#d9b', '#965'], ['It\'s kind of like reading a beautifully designed interactive Medium article.', '#9cf', '#36a'], ['The bar he sets is ridiculous. Every company I know wants to work with him.', '#fb8', '#a52']];
  const tst = h('div.dd-tst', {}, TST.map(([t, a, b], i) => h('span' + (i % 2 ? '.g' : ''), {}, h('i.dd-av', { style: { background: `linear-gradient(135deg,${a},${b})` } }), t + ' ')));
  sheet.append(tst, h('div', {}, h('span.dd-rt', {}, 'Read testimonials')));
  sheet.append(h2('Hello'), h('p.b', {}, 'My name is Rauno. I work as a Staff Design Engineer at Vercel on our platform, design system, marketing pages, and Next.js Dev Tools. Previously, I was at The Browser Company designing and building the Arc browser.'), h('p.b', { html: 'I have written acclaimed design essays like <u style="text-decoration-color:#ccc;text-underline-offset:5px">Invisible Details of Interaction Design</u> and shipped open source software like <u style="text-decoration-color:#ccc;text-underline-offset:5px">cmdk</u> that is downloaded millions of times per week to power command menu interfaces for the most modern productivity apps on the web.' }));
  // structure
  const chips = (arr) => h('div.dd-grid8', {}, arr.map((t) => h('div.dd-chip', { onclick: () => toast(`${t.replace(' FREE', '')} — chapter preview (demo)`) }, t.replace(' FREE', ''), /FREE/.test(t) ? h('span.dd-free', {}, 'FREE') : null)));
  sheet.append(h2('Structure'), h('p.b', { html: 'Devouring Details is split into 3 units—<span class="mu">Principles</span>, <span class="mu">Prototypes</span>, and <span class="mu">Resources</span>.' }), h('p.b', { html: '<span class="mu">Principles</span> explores a design concept in depth with different examples from custom interfaces and production apps.' }),
    chips(['INFERRING INTENT', 'INTERACTION METAPHORS', 'ERGONOMIC INTERACTIONS', 'SIMULATING PHYSICS', 'MOTION CHOREOGRAPHY', 'RESPONSIVE INTERFACES', 'CONTAINED GESTURES', 'DRAWING INSPIRATION']),
    h('p.b', { html: '<span class="mu">Prototypes</span> are deep dives into a single component with references to <span class="mu">Principles</span> and <span class="mu">Resources</span>. Everything you see here includes downloadable source code.' }));
  // prototype cards
  const card = (label, body, extra = {}) => h('div.dd-card', extra, body, h('label', {}, label));
  const ms = h('div.dd-ms'), msT = [...Array(44)].map((_, i) => { const t = h('i.tk', { style: { left: 70 + i * 7 + 'px', height: (i % 6 === 0 ? 30 : 20) + 'px', marginBottom: '-12px' } }); ms.append(t); return t; }), msP = h('i.pl', { style: { left: '70px' } }); ms.append(msP);
  const msAt = (x) => { msP.style.left = x + 'px'; msT.forEach((t, i) => { const d = Math.abs(70 + i * 7 - x), k = Math.max(0, 1 - d / 36); t.style.transform = `scaleY(${1 + k * 0.9})`; t.style.background = k > .85 ? '#222' : '#9a9a9a'; }); };
  const strip = h('div.dd-strip', {}, [...Array(30)].map((_, i) => h('i', { style: { background: `linear-gradient(${i * 37}deg,hsl(0 0% ${30 + ((i * 47) % 60)}%),hsl(0 0% ${70 + ((i * 13) % 28)}%))`, width: (i % 3 ? 44 : 30) + 'px' } })));
  const mini = document.createElementNS(svgNS, 'svg'); mini.setAttribute('viewBox', '-110 -110 220 220'); Object.assign(mini.style, { position: 'absolute', left: '50%', top: '50%', width: '220px', height: '220px', margin: '-120px 0 0 -110px', transition: 'transform .8s cubic-bezier(.3,.7,.2,1)' });
  mini.innerHTML = [...Array(96)].map((_, i) => { const a = (i / 96) * Math.PI * 2, l = i % 8 ? 5 : 11; return `<line x1="${Math.cos(a) * 80}" y1="${Math.sin(a) * 80}" x2="${Math.cos(a) * (80 + l)}" y2="${Math.sin(a) * (80 + l)}" stroke="${i % 8 ? '#bbb' : '#333'}"/>`; }).join('');
  const morph = h('div.dd-morph'), mRow = h('div.row', {}, h('i'), 'Morph Surface', h('button', { onclick: (e) => { e.stopPropagation(); setMorph(!morph.classList.contains('on')); } }, 'Feedback')), mTa = h('textarea', { placeholder: 'Your feedback…' }), mSnd = h('button.snd', { onclick: (e) => { e.stopPropagation(); setMorph(false); toast('Feedback sent — thanks!'); } }, 'Send');
  morph.append(mRow, mTa, mSnd); const setMorph = (v) => { morph.classList.toggle('on', v); mRow.lastChild.textContent = v ? 'Close' : 'Feedback'; if (v) setTimeout(() => mTa.focus({ preventScroll: true }), 200); };
  const GP = [40, 52, 48, 70, 66, 90, 84, 110, 104, 130, 118, 150, 142, 170], gx = (i) => 60 + i * 34, gy = (v) => 280 - v;
  const graph = h('div', { style: { position: 'absolute', inset: 0 }, html: `<svg width="100%" height="100%" viewBox="0 0 560 360" preserveAspectRatio="none"><polyline fill="none" stroke="#222" stroke-width="1.5" points="${GP.map((v, i) => gx(i) + ',' + gy(v)).join(' ')}"/><line class="gl" x1="0" x2="0" y1="70" y2="290" stroke="${O}" stroke-width="1" opacity="0"/><circle class="gd" r="4" fill="${O}" opacity="0"/><text class="gt" font-family="JetBrains Mono Variable,monospace" font-size="11" fill="#555" opacity="0"></text></svg>` });
  const gMove = (e) => { const b = graph.getBoundingClientRect(), x = ((e.clientX - b.left) / b.width) * 560, i = Math.max(0, Math.min(GP.length - 1, Math.round((x - 60) / 34))); const [l, d, t] = ['.gl', '.gd', '.gt'].map((s2) => graph.querySelector(s2)); l.setAttribute('x1', gx(i)); l.setAttribute('x2', gx(i)); d.setAttribute('cx', gx(i)); d.setAttribute('cy', gy(GP[i])); t.setAttribute('x', gx(i) + 8); t.setAttribute('y', gy(GP[i]) - 10); t.textContent = `W${i + 1} · ${GP[i]}`; [l, d, t].forEach((n) => n.setAttribute('opacity', 1)); };
  let tmI = 0; const tm = h('div.dd-tm', { onclick: () => { tmI++; paintTM(); } }, [...Array(4)].map((_, i) => h('div', {}, `SNAPSHOT ${['10:42', '10:31', '10:18', '09:57'][i]}`)));
  const paintTM = () => [...tm.children].forEach((c, i) => { const k = (i - tmI % 4 + 4) % 4; c.style.transform = `translate(${k * 14}px,${-k * 14}px) scale(${1 - k * 0.06})`; c.style.zIndex = 10 - k; c.style.opacity = 1 - k * 0.2; }); paintTM();
  sheet.append(h('div.dd-pgrid', {},
    card('LINE MINIMAP', ms, { onmousemove: (e) => msAt(Math.max(70, Math.min(371, e.clientX - e.currentTarget.getBoundingClientRect().left))) }),
    card('SCROLL STRIP', strip, { onmousemove: (e) => { const b = e.currentTarget.getBoundingClientRect(); strip.style.transform = `translateX(${-((e.clientX - b.left) / b.width) * 700}px)`; } }),
    card('RADIAL TIMELINE', mini, { onmouseenter: () => { mini.style.transform = 'rotate(90deg)'; }, onmouseleave: () => { mini.style.transform = 'none'; } }),
    card('MORPH SURFACE', morph), card('LINE GRAPH', graph, { onmousemove: gMove }), card('TIME MACHINE', tm)));
  sheet.append(h('p.b', { html: '<span class="mu">Resources</span> contains useful code snippets, insights into my design process, private bookmarks, a downloadable component library, and more.' }),
    chips(['BEHIND SCENES FREE', 'CODE SNIPPETS', 'DESIGN WORKFLOW', 'COMPONENT LIBRARY', 'PUBLIC BOOKMARKS', 'FREQUENT QUESTIONS', 'DESIGN PHILOSOPHIES', 'REACT HANDBOOK']));
  const ck = '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 10.5l4.5 4.5L17 4" fill="none" stroke="' + O + '" stroke-width="2"/></svg>';
  sheet.append(h2('Register'), h('p.b', {}, 'Upon registering, you\'ll receive immediate access to:'), ['23 chapters with source code for 23 components', 'Future updates to Principles, Prototypes, and Resources', 'Private community to ask me questions and receive feedback', 'Behind the scenes of what I am working on'].map((t) => h('div.dd-check', {}, h('span', { html: ck, style: { display: 'flex' } }), t)),
    h('button.dd-cta', { onclick: () => toast('Register Now — $249 (demo checkout)') }, 'Register Now', h('span.sp'), '$249', h('span.ar', { html: '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M4 12h15m-6-7 7 7-7 7" fill="none" stroke="#000" stroke-width="2.2"/></svg>' })));
  const FAQ = [['Who is this for?', 'For designers and engineers. There are a lot of code examples included. You can download many of the interactive components built with React, Tailwind, and Motion React (prev. Framer Motion). The code examples assume some knowledge of the web ecosystem, React, and Motion React.', 'That being said, the content will not go over your head if you\'re not familiar with said tools. The concepts and code examples can be applied in another language or framework.'], ['How do I use this?', 'Read it like a reference manual: jump to a principle or prototype when you need it, interact with the demos, then copy the source.'], ['What does this not cover?', 'It is not a step-by-step course on React fundamentals or a visual design curriculum.'], ['What format can I expect?', 'Long-form interactive chapters with embedded prototypes and downloadable components.'], ['Can I preview the platform?', 'Yes — a few chapters are marked FREE above.'], ['Is this a one-time purchase?', 'Yes, a single payment.'], ['Do I receive an invoice?', 'An invoice is issued with your purchase.'], ['Can I use this on mobile?', 'It is designed for larger screens, but it is readable on mobile.']];
  const items = FAQ.map(([q, ...a]) => { const it = h('div.dd-it', {}, h('button.dd-q', { onclick: () => it.classList.toggle('on') }, q, h('span', { html: '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3 3 13" stroke="#111" stroke-width="1.6"/></svg>', style: { display: 'flex' } })), h('div.dd-a', {}, h('div', {}, a.map((p) => h('p', {}, p))))); return it; });
  sheet.append(h2('FAQ', true), h('div.dd-faq', {}, items), h('div.dd-foot', { onclick: () => go('Register') }, 'REGISTER NOW'));
  // ruler + scroll line
  const RT = 254, RH = 316, NT = 33, rul = h('div.dd-rul', { style: { height: RH + 'px' } }), line = h('div.dd-line'), tag = h('span.dd-tag', { onclick: () => go('Register') }, 'REGISTER NOW'); line.append(tag); root.append(rul, line);
  const SECS = ['Platform', 'Hello', 'Structure', 'Register', 'FAQ'];
  const max = () => Math.max(1, root.scrollHeight - root.clientHeight);
  const secFrac = (k) => (sec[k].getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 140) / max();
  const buildRuler = () => { const maj = new Map(SECS.map((k) => [Math.max(0, Math.min(NT - 1, Math.round(secFrac(k) * (NT - 1)))), k]));
    rul.replaceChildren(...[...Array(NT)].map((_, i) => { const k = maj.get(i); return h('div.dd-tk' + (k ? '.mj' : ''), { style: { top: (i / (NT - 1)) * RH - 4 + 'px' }, onclick: () => (k ? go(k) : root.scrollTo({ top: (i / (NT - 1)) * max(), behavior: 'smooth' })) }, h('i'), k ? h('span.tt', {}, k.toUpperCase()) : null); })); };
  const place = () => { const rb = root.getBoundingClientRect(), top = rb.top + RT; rul.style.top = top + 'px'; const p = Math.min(1, root.scrollTop / max()); line.style.top = top + p * RH + 'px'; const sb = sheet.getBoundingClientRect(); tag.style.left = sb.right - 63 - 14 + 'px';
    const vh = rb.bottom; [...tst.children].forEach((sp) => { const b = sp.getBoundingClientRect(), k = Math.max(0, Math.min(1, (b.top - (vh - 260)) / 220)); sp.style.filter = k > 0.02 ? `blur(${(k * 5).toFixed(1)}px)` : ''; sp.style.opacity = 1 - k * 0.6; });
    [...rul.children].forEach((t, i) => { const d = Math.abs(i / (NT - 1) - p) * (NT - 1), k = Math.max(0, 1 - d / 2.5); t.firstChild.style.width = (t.classList.contains('mj') ? 32 : 18) + k * 10 + 'px'; }); return p; };
  let raf = 0; root.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); }, { passive: true }); window.addEventListener('resize', () => { buildRuler(); place(); });
  const loop = (t) => { if (playing) { head += 0.012; paintRT(); } requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  requestAnimationFrame(() => { buildRuler(); place(); msAt(110); paintRT(); }); setTimeout(() => { buildRuler(); place(); }, 800);
  window.__demoProof = async () => {
    const out = [], lt = () => Math.round(parseFloat(line.style.top)); buildRuler();
    root.scrollTo({ top: 0, behavior: 'instant' }); place(); const t0 = lt(); out.push(`ruler ticks=${rul.children.length} majors=${rul.querySelectorAll('.mj').length} line@top y=${t0}`);
    root.scrollTo({ top: max() / 2, behavior: 'instant' }); const p = place(); out.push(`scroll 50% → line y=${lt()} (Δ${lt() - t0}px of ${RH}, p=${p.toFixed(2)})`);
    const faqTk = [...rul.querySelectorAll('.mj')].find((t) => t.textContent === 'FAQ'); go('FAQ', 'instant'); place(); out.push(`FAQ major tick present=${!!faqTk} → scrolled to FAQ, line y=${lt()}, section top≈${Math.round(sec.FAQ.getBoundingClientRect().top - root.getBoundingClientRect().top)}px`);
    items[0].querySelector('.dd-q').click(); await sleep(400); out.push(`accordion open=${items[0].classList.contains('on')} answer h=${Math.round(items[0].querySelector('.dd-a').getBoundingClientRect().height)}px`);
    items[0].querySelector('.dd-q').click(); await sleep(400); out.push(`closed h=${Math.round(items[0].querySelector('.dd-a').getBoundingClientRect().height)}px`);
    setMorph(true); await sleep(500); out.push(`morph surface ${Math.round(morph.getBoundingClientRect().width)}×${Math.round(morph.getBoundingClientRect().height)}`); setMorph(false);
    setPlay(true); await sleep(400); out.push(`radial timeline playing head=${head.toFixed(2)}rad`); setPlay(false); head = -Math.PI / 2; paintRT();
    tmI = 0; paintTM(); root.scrollTo({ top: 0, behavior: 'instant' }); place(); await sleep(60); out.push(`back to top line y=${lt()}`);
    return out.join('; ') + '; restored';
  };
};
V['hey-screener-yes-no-gradient-inbox'] = (root, T) => {
  import('@fontsource-variable/outfit'); import('@fontsource/lato/400.css'); import('@fontsource/lato/700.css'); import('@fontsource/lato/400-italic.css');
  theme(root, T, { bg: '#ffffff', fg: '#231c33', ac: '#5522fa', dark: false }); scroll(root);
  const D = "'Outfit Variable','Outfit',system-ui,sans-serif", B = "'Lato',system-ui,sans-serif", INK = '#231c33', P = '#5522fa', GR = 'linear-gradient(135deg,rgb(85,34,250),rgb(236,133,128))';
  root.append(h('style', {}, `.hy{background:#fff;color:${INK};font:400 19px/1.45 ${B};min-height:100%;padding:31px 0 120px}.hy button{cursor:pointer;font-family:${D}}
.hy .gt{background:${GR};-webkit-background-clip:text;background-clip:text;color:transparent}
.hy-nav{position:sticky;top:31px;z-index:20;width:1147px;margin:0 auto;height:82px;background:#fff;border-radius:22px;box-shadow:0 6px 24px #231c3314,0 1px 3px #231c330d;display:flex;align-items:center;padding:0 20px 0 22px;gap:22px;font:500 18.5px ${D}}
.hy-logo{display:flex;align-items:flex-end;gap:2px;color:${P};font:900 30px/1 ${D};letter-spacing:-.04em}.hy-logo small{display:block;font:600 8px ${D};letter-spacing:0;color:${INK};margin:0 0 2px 4px}
.hy-nav a{color:${INK};cursor:pointer;position:relative}.hy-nav a:hover{color:${P}}.hy-new{position:absolute;left:-10px;top:-24px;background:#f0604f;color:#fff;font:800 10.5px ${D};padding:2px 6px;border-radius:7px;transform:rotate(-8deg)}
.hy-nav .sp{flex:1}.hy-pill{border:0;border-radius:99px;font:800 14px ${D};letter-spacing:.06em;text-transform:uppercase;padding:0 22px;height:44px}.hy-si{background:#edeae6;color:${INK}}.hy-tr{background:${P};color:#fff}.hy-tr:hover,.hy-cta:hover{filter:brightness(1.08)}
.hy-panel{width:1376px;margin:-50px auto 0;background:#f6f4f1;border-radius:44px;padding:88px 48px 70px}
.hy-hero{background:#fff;border-radius:30px;box-shadow:0 30px 60px -36px #231c3340;padding:56px 0 0;text-align:center;overflow:hidden}
.hy-q{display:flex;justify-content:center;gap:74px;font:italic 400 17px ${B};color:${INK}}.hy-q div{display:flex;flex-direction:column;align-items:center;gap:6px}.hy-q b{color:#f3c623;letter-spacing:3px;font:16px sans-serif}
.hy h1{font:900 87px/.97 ${D};letter-spacing:-.04em;margin:30px auto 18px;max-width:960px}
.hy-sub{font:800 41px/1.12 ${D};letter-spacing:-.025em;max-width:1070px;margin:0 auto}
.hy-cta{display:inline-flex;align-items:center;height:62px;border-radius:99px;border:0;background:${GR};color:#fff;font:800 20px ${D};letter-spacing:.04em;text-transform:uppercase;padding:0 30px;margin-top:38px}
.hy-no{font:italic 400 16px ${B};color:#555;margin:14px 0 40px}
.hy-mock{position:relative;width:896px;margin:0 auto;height:420px;border-radius:26px 26px 0 0;overflow:hidden;background:#fff;text-align:left}
.hy-mock .ov{position:absolute;inset:0;background:${GR};opacity:.82;mix-blend-mode:normal}.hy-see{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);z-index:2;height:52px;border:0;border-radius:99px;background:#fff;font:700 20px ${D};color:${INK};padding:0 26px;display:flex;align-items:center;gap:10px;box-shadow:0 6px 20px #0002}
.hy-ml{padding:22px 60px}.hy-ml .t{display:flex;justify-content:space-between;align-items:center;font:600 13px ${B};color:#666}.hy-ml .scr{background:#eef0ff;border-radius:99px;padding:4px 12px;color:${P};cursor:pointer;position:relative;z-index:3}
.hy-ml h3{text-align:center;font:800 30px ${D};margin:6px 0 14px;position:relative}.hy-ml h3 svg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
.hy-row{display:flex;align-items:center;gap:14px;padding:9px 0;border-bottom:1px solid #eee;font:14px ${B};color:#444}.hy-row .av{width:30px;height:30px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font:800 11px ${D};color:#231c33}.hy-row b{font-weight:700;color:#222}.hy-row .dt{margin-left:auto;font-size:12px;color:#999;flex:none}
.hy-sec{text-align:center;margin-top:120px}.hy h2{font:900 50px/1.08 ${D};letter-spacing:-.035em;margin:0 0 22px}.hy-sec>p{font:400 22px/1.42 ${B};max-width:560px;margin:0 auto}.hy-sec>p b{font-weight:700}
.hy-ts{display:grid;grid-template-columns:repeat(3,1fr);gap:44px 44px;margin-top:56px;text-align:left}.hy-tb{position:relative;background:linear-gradient(180deg,#dcecff,#eef5ff);border-radius:24px;padding:42px 30px 28px;font:400 16px/1.55 ${B};box-shadow:0 14px 24px -18px #2a4a9a40}.hy-tb .nm{position:absolute;left:-12px;top:-18px;display:flex;align-items:center;gap:8px;background:#fff;border-radius:99px;padding:4px 14px 4px 4px;font:700 13px ${B};box-shadow:0 2px 8px #0001}.hy-tb .nm i{width:30px;height:30px;border-radius:50%}
.hy-sq{display:block;margin:70px auto 0}
.hy-app{width:1152px;margin:48px auto 0;background:#fff;border-radius:22px;box-shadow:0 20px 50px -30px #231c3366,0 1px 3px #0000000d;text-align:left;overflow:hidden}
.hy-chrome{height:58px;display:flex;align-items:center;gap:18px;padding:0 20px;font:500 15px ${B}}.hy-back{border:0;background:#c9f5e4;color:#0f5b45;border-radius:99px;height:34px;padding:0 14px;font:700 15px ${D};display:flex;align-items:center;gap:6px}
.hy-chrome .ctr{flex:1;display:flex;justify-content:center;align-items:center;gap:6px;color:${P};font:900 21px ${D};letter-spacing:-.04em}.hy-me{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#d9a46a,#6a4b2e)}
.hy-scr{width:1000px;margin:8px auto 0;background:#fff;border-radius:22px 22px 0 0;box-shadow:0 -4px 30px #231c3312;padding:20px 50px 30px;position:relative;min-height:420px}
.hy-done{border:0;background:#c9f5e4;color:#0f5b45;border-radius:99px;height:34px;padding:0 15px;font:700 15px ${D}}.hy-scr h4{text-align:center;font:800 38px ${D};margin:-12px 0 8px;letter-spacing:-.015em}.hy-scr .ex{text-align:center;font:400 17px/1.45 ${B};color:#333;margin:0 0 30px}
.hy-want{display:flex;align-items:center;gap:12px;font:800 13.5px ${D};letter-spacing:.03em;color:${INK}}.hy-want:after{content:'';flex:1;height:1px;background:#8d7dfa;order:1}.hy-want a{order:2;color:${P};font:500 14px ${B};letter-spacing:0;cursor:pointer}
.hy-sr{display:flex;gap:18px;align-items:center;padding:12px 0;border-bottom:1px solid #e9e9ee;transition:transform .38s cubic-bezier(.4,0,.2,1),opacity .38s,max-height .38s .1s,padding .38s .1s;max-height:120px;overflow:visible;position:relative}
.hy-sr.yes{transform:translateX(70px);opacity:0}.hy-sr.no{transform:translateX(-70px);opacity:0;filter:grayscale(1)}.hy-sr.gone{max-height:0;padding:0;border:0;overflow:hidden}
.hy-yn{flex:none;width:76px;height:76px;border:0;border-radius:6px;background:#efecff;color:${P};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font:700 13px ${D};position:relative;transition:background .15s,transform .1s}.hy-yn:hover{background:#e2dcff}.hy-yn:active{transform:scale(.96)}
.hy-dd{position:absolute;right:4px;top:3px;border:0;background:none;color:${P};padding:2px;width:auto;height:auto}.hy-dest{font:600 10px ${B};color:#7a6ad8;margin-top:-2px}
.hy-menu{position:absolute;left:0;top:84px;z-index:9;background:#fff;border-radius:12px;box-shadow:0 10px 30px #231c3330;padding:8px;width:250px;display:none}.hy-menu.on{display:block}.hy-menu div{padding:8px 10px;border-radius:8px;cursor:pointer;font:500 14px ${B};display:flex;gap:8px}.hy-menu div:hover{background:#f2efff}.hy-menu div small{display:block;color:#888;font-size:12px}.hy-menu .ck{width:14px;color:${P}}
.hy-sr .av{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font:900 15px ${D};color:${INK};margin-left:8px}.hy-sr .tx{min-width:0;font:400 15px/1.35 ${B};color:#222}.hy-sr .tx b{font:700 16px ${B}}.hy-sr .tx .em{color:#666}.hy-sr .tx .pv{color:#444;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.hy-empty{text-align:center;padding:40px 0 10px;font:700 22px ${D};color:${INK}}.hy-empty a{display:block;margin-top:8px;color:${P};font:500 15px ${B};cursor:pointer}
.hy-counts{display:flex;justify-content:center;gap:10px;margin:28px 0 0}.hy-cnt{border:0;border-radius:99px;background:#fff;padding:9px 16px;font:700 15px ${D};color:${INK};box-shadow:0 1px 3px #0000001a;display:flex;gap:8px;align-items:center;transition:transform .2s}.hy-cnt b{min-width:22px;height:22px;border-radius:11px;background:#efecff;color:${P};font:800 13px ${D};display:inline-flex;align-items:center;justify-content:center;padding:0 6px}.hy-cnt.on{background:${INK};color:#fff}.hy-cnt.on b{background:#ffffff26;color:#fff}.hy-cnt.bump{transform:scale(1.12)}
.hy-box{width:1000px;margin:8px auto 0;background:#fff;border-radius:22px 22px 0 0;box-shadow:0 -4px 30px #231c3312;padding:22px 50px 30px;min-height:360px}.hy-box h4{text-align:center;font:800 38px ${D};margin:0 0 18px}
.hy-new4{display:flex;align-items:center;gap:12px;font:800 13px ${D};letter-spacing:.03em;margin:8px 0 4px}.hy-new4:after{content:'';flex:1;height:1px;background:#8d7dfa}
.hy-bi{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid #eee;font:15px ${B};animation:hyin .45s cubic-bezier(.2,.7,.3,1)}.hy-bi .av{width:38px;height:38px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font:900 13px ${D}}.hy-bi .dot{width:8px;height:8px;border-radius:50%;background:#f0604f;flex:none;margin-left:-22px}.hy-bi .dt{margin-left:auto;color:#999;font-size:13px;flex:none}.hy-bi .un{border:0;background:none;color:${P};font:600 13px ${B};margin-left:10px;white-space:nowrap;flex:none}.hy-bi>div{flex:1}.hy-bi .pv2{color:#777;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.hy-app,.hy-sec{scroll-margin-top:130px}
.hy-feed{display:grid;grid-template-columns:1fr 1fr;gap:16px}.hy-fc{border:1px solid #eee;border-radius:14px;padding:16px;font:15px/1.45 ${B};animation:hyin .45s}.hy-fc b{display:block;font:800 17px ${D};margin:6px 0}
@keyframes hyin{from{opacity:0;transform:translateY(-10px)}}
.hy-sticky{position:fixed;right:34px;bottom:30px;z-index:40;height:62px;border:0;border-radius:99px;background:${GR};color:#fff;font:800 19px ${D};letter-spacing:.05em;padding:0 28px 0 18px;display:flex;align-items:center;gap:10px;box-shadow:0 10px 30px #5522fa40;transition:transform .2s}.hy-sticky:hover{transform:translateY(-2px)}
`));
  const hand = (c = '#fff', s2 = 30) => `<svg width="${s2}" height="${s2}" viewBox="0 0 32 32" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17V7.5a1.8 1.8 0 0 1 3.6 0V15M13.6 14V5.2a1.8 1.8 0 0 1 3.6 0V14M17.2 14V6.3a1.8 1.8 0 0 1 3.6 0V16M20.8 15.5v-6a1.8 1.8 0 0 1 3.6 0V19c0 5-3.4 9-8.4 9-3.4 0-5.6-1.6-7.4-4.4L5 18.4a1.9 1.9 0 0 1 3.1-2.1L10 19"/><path d="M4 9c.6-2 1.6-3.4 3-4.4M26.5 4.5c1.6 1 2.6 2.6 3 4.5"/></svg>`;
  const thumb = (up) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${P}" stroke-width="1.7" stroke-linejoin="round" style="${up ? '' : 'transform:scaleY(-1)'}"><path d="M7 11v9H4v-9zM7 11l4-8c1.5 0 2.5 1 2.2 2.6L12.6 9H19a2 2 0 0 1 2 2.3l-1.2 6.8a2 2 0 0 1-2 1.9H7"/></svg>`;
  const BOX = { imbox: 'Imbox', feed: 'The Feed', paper: 'Paper Trail', out: 'Screened Out' };
  const SEND0 = [
    { n: 'Sunny Vacations', e: 'sunnyvacations@example.com', s: 'Timeshare Investment Opportunity', p: 'Mrs. Young, Are timeshares a good investment? We think they are! We would love to speak with you about why we think that you and your family…', i: 'SV', c: '#d6f06a', to: 'imbox' },
    { n: 'Luxe Salon Texas', e: 'luxesalontexas@gmail.com', s: 'Luxe Salon New Update', p: 'Hello all, We are reaching out to give you an update! We are offering color kits, shine bombs, and toners! If you are in need, please contact your stylist…', i: 'LST', c: '#f39a86', to: 'feed' },
    { n: 'Todd Markham', e: 'bestinsurancepricingintexas@gmail.com', s: 'Re: Life Insurance Quote', p: 'Hello Mrs. Young, I hope all is well with you. I wanted to touch base with you on our conversation a few weeks ago. I’ve tried calling a few times…', i: 'TM', c: '#f6cf45', to: 'imbox' },
    { n: 'Mr. Jeff Wolfe', e: '2ndgradestabes@gmail.com', s: 'Re: Cooper’s Parent/Teacher Conference', p: 'Mr. & Mrs. Young, This is just a reminder to schedule your parent/teacher conference with me. You can feel free to do that here…', i: 'MJW', c: '#f5e156', to: 'imbox' },
    { n: 'Metro Transit', e: 'receipts@metrotransit.example', s: 'Your receipt — 30-day pass', p: 'Thanks for riding with us. Order #48213 · $98.00 charged to Visa ending 4242. Your pass is active until Nov 6.', i: 'MT', c: '#b9c8ff', to: 'paper' },
  ];
  const SEED = { imbox: [['Dinner Reservations Tonight', 'Jasmine Velasquez', 'Our dinner reservations for Clark’s is attached. Can’t wait to see you soon!', 'Sep 14', 'JV', '#ffd1dc'], ['Miami Airbnb Itinerary', 'Russell Young', 'Your reservation is confirmed — check-in after 3pm.', 'Sep 13', 'RY', '#cde7ff'], ['Piano Lessons (3)', 'Bruce Evans', 'I received your form submission. Our teacher Sara is available on Friday mornings.', 'Sep 12', 'BE', '#d8f5d0']],
    feed: [['Field Notes Weekly', 'The quiet joy of a paper notebook', 'Fall edition is out: three new colors and a note from our founder…', 'Sep 14', 'FN', '#ffe6a8'], ['Kottke', 'The best links from around the web', 'A map of every tree in the city, a 1970s synth demo and more…', 'Sep 12', 'K', '#e0d7ff']],
    paper: [['Your Lyft receipt', 'Lyft', '$18.40 · Sep 13 · Downtown → Home', 'Sep 13', 'L', '#ffd0ef'], ['Order shipped', 'Bookshop', 'Your order #10233 is on its way.', 'Sep 11', 'B', '#d9f2ff']], out: [] };
  let senders = SEND0.map((x) => ({ ...x })), boxes = { imbox: [], feed: [], paper: [], out: [] }, view = 'imbox';
  // nav + hero
  const scrollTo = (el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const sticky = h('button.hy-sticky', { html: hand('#fff', 30) + 'TRY HEY FREE', onclick: () => toast('Try HEY free for 30 days (demo)') });
  const scrCountMock = h('span');
  const mockRows = [['Dinner Reservations Tonight', 'Jasmine Velasquez — Hey Julie- Our dinner reservations for Clark’s is attached. Can’t wait to see you soon!', 'Sep 14'], ['Miami Airbnb Itinerary', 'Russell Young — “ [ Airbnb ] Your reservation is confirmed. Check-in after 3pm…', 'Sep 13'], ['Les Misérables Tickets', 'Caroline Doubois — I’m so excited that you could join us for the show next month…', 'Sep 13'], ['Piano Lessons (3)', 'Bruce Evans — Hi Julie- I received your form submission. Our teacher Sara is available…', 'Sep 12'], ['Completed: Please DocuSign: Lucky Strike Event Contract', 'Adobe Andersen via DocuSign — Your document has been completed…', 'Sep 14']];
  const hero = h('div.hy-hero', {},
    h('div.hy-q', {}, ['Finally a privacy-respecting inbox', 'Email has been re-invented', 'I’m loving the HEY Calendar app'].map((q) => h('div', {}, h('b', {}, '★★★★★'), `“${q}”`))),
    h('h1.gt', {}, 'We finally fixed your email + calendar!'),
    h('div.hy-sub', {}, 'Gmail, Outlook, and Apple got complacent and took their eye off the ball. Then along came HEY.'),
    h('button.hy-cta', { onclick: () => toast('Try HEY free for 30-days (demo)') }, 'Try HEY free for 30-days'), h('div.hy-no', {}, 'No obligation, no CC required.'),
    h('div.hy-mock', {}, h('div.hy-ml', {}, h('div.t', {}, h('span.scr', { onclick: () => scrollTo(appEl) }, '👍 Screen ', scrCountMock, ' first-time senders'), h('span', {}, '＋ Write')),
      h('h3', { html: 'Imbox<svg width="130" height="46" viewBox="0 0 130 46"><ellipse cx="65" cy="23" rx="62" ry="19" fill="none" stroke="#5522fa" stroke-width="3" transform="rotate(-2 65 23)"/></svg>' }),
      h('div.hy-new4', { style: { color: '#666' } }, 'NEW FOR YOU'), mockRows.map(([s2, p, d]) => h('div.hy-row', {}, h('span.av', { style: { background: '#e8e3ff' } }, s2[0]), h('div', {}, h('b', {}, s2), h('div', { style: { fontSize: '12.5px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px' } }, p)), h('span.dt', {}, d)))),
      h('div.ov'), h('button.hy-see', { html: '<svg width="14" height="16" viewBox="0 0 14 16"><path d="M1 1v14l12-7Z" fill="#231c33"/></svg>See how HEY works', onclick: () => toast('▶ See how HEY works (video demo)') })));
  const TS = [['Ryan Hoover', 'Just got a demo of HEY with <u>@jasonfried</u>. ❤️ <b>The level of product thinking</b> that’s gone into rebuilding email from scratch.', '#f8b26a'], ['Ezra Klein', 'Gmail and virtually all of its competitors assume anyone should be able to email you and then you should store and sort and search and categorize those messages. <b>HEY assumes that only the people you want email from should be able to email you.</b>', '#7a8ba3'], ['Kevin Rose', 'I just got an early demo of HEY from <u>@jasonfried</u>. I can confirm this will be my new default email over Gmail… <b>it’s a beautiful rethinking of everything wrong with email.</b>', '#9aa36b'], ['Darya Rose', 'In positive news, HEY seems to have finally solved email (!!!). <b>The relief is so real.</b> 🙌', '#c9876b'], ['Mike Davidson', 'If you designed email from scratch such that it vigorously protected your privacy and your time, <b>this is what it would look like.</b> 🏆', '#6b8fc9'], ['Andy Baio', 'Happy to say that HEY is every bit as clever as I expected, <b>a radical rethinking of email</b> and dramatically better in a dozen ways.', '#b36bc9']];
  // screener
  const list = h('div'), counts = h('div.hy-counts'), boxEl = h('div.hy-box'), boxH2 = h('h2.gt'), boxP = h('p');
  let menuOpen = -1;
  const renderScreener = () => {
    scrCountMock.textContent = senders.length;
    if (!senders.length) { list.replaceChildren(h('div.hy-empty', {}, 'You’re all caught up! 🎉', h('a', { onclick: () => reset() }, '↺ Reset the Screener demo'))); return; }
    list.replaceChildren(...senders.map((x, i) => h('div.hy-sr', { 'data-i': i },
      h('button.hy-yn', { title: `Yes — send to ${BOX[x.to]}`, onclick: () => decide(i, true) }, h('span', { html: thumb(true), style: { display: 'flex' } }), 'Yes', h('span.hy-dest', {}, x.to === 'imbox' ? '' : BOX[x.to].replace('The ', '')),
        h('span.hy-dd', { html: '<svg width="11" height="7" viewBox="0 0 11 7"><path d="M1 1l4.5 4.5L10 1" stroke="#5522fa" stroke-width="1.6" fill="none"/></svg>', onclick: (e) => { e.stopPropagation(); menuOpen = menuOpen === i ? -1 : i; renderScreener(); } })),
      h('button.hy-yn', { title: 'No — screen out', onclick: () => decide(i, false) }, h('span', { html: thumb(false), style: { display: 'flex' } }), 'No'),
      h('div.hy-menu' + (menuOpen === i ? '.on' : ''), {}, [['imbox', 'Imbox', 'Important people & services'], ['feed', 'The Feed', 'Newsletters & long reads'], ['paper', 'Paper Trail', 'Receipts & transactions']].map(([k, t, d]) => h('div', { onclick: (e) => { e.stopPropagation(); setDest(i, k); } }, h('span.ck', {}, x.to === k ? '✓' : ''), h('span', {}, `Yes → ${t}`, h('small', {}, d))))),
      h('span.av', { style: { background: x.c } }, x.i), h('div.tx', {}, h('div', {}, h('b', {}, x.n), ' ', h('span.em', {}, `<${x.e}>`)), h('div.pv', {}, h('span', { style: { fontWeight: 700 } }, x.s), ' – ', x.p)))));
  };
  const setDest = (i, k) => { senders[i].to = k; menuOpen = -1; renderScreener(); };
  let busy = Promise.resolve();
  const decide = (i, yes) => { const x = senders[i], row = list.querySelector(`[data-i="${i}"]`); if (!x || !row) return; menuOpen = -1; row.classList.add(yes ? 'yes' : 'no'); row.querySelectorAll('button').forEach((b) => (b.disabled = true));
    busy = new Promise((res) => setTimeout(() => { row.classList.add('gone'); setTimeout(() => { senders = senders.filter((s2) => s2 !== x); const k = yes ? x.to : 'out'; boxes[k].unshift({ ...x, at: k }); renderScreener(); renderBoxes(k); toast(yes ? `✓ ${x.n} → ${BOX[k]}` : `✕ ${x.n} screened out — you won’t hear from them again`); res(); }, 260); }, 340)); return busy; };
  const undo = (k, x) => { boxes[k] = boxes[k].filter((y) => y !== x); const o = SEND0.findIndex((s2) => s2.n === x.n); senders.push({ ...SEND0[o], to: x.to === 'out' ? SEND0[o].to : x.to }); senders.sort((a, b) => SEND0.findIndex((s2) => s2.n === a.n) - SEND0.findIndex((s2) => s2.n === b.n)); renderScreener(); renderBoxes(); };
  const COPY = { imbox: ['The Imbox is for your important email', 'When you say “Yes”, their email lands in the <b>Imbox</b> by default. It’s the place for emails you actually want to read, from <b>im</b>portant people and services you absolutely want to hear from.'], feed: ['The Feed is for your casual, whenever reads', 'The Feed turns newsletters and long-reads into a browsable, casual newsfeed. Just scroll, everything’s open already.'], paper: ['A Paper Trail for receipts and transactions', 'Keep transactional email clutter in one place, out of your face. When you need to refer to a receipt, order confirmation, or service notification, just head over to the Paper Trail.'], out: ['Screened Out — never hear from them again', 'Say “No” in the Screener and that sender is gone. Changed your mind? Undo puts them back in The Screener.'] };
  const renderBoxes = (bump) => {
    counts.replaceChildren(...[['screener', 'The Screener', senders.length], ...Object.entries(BOX).map(([k, t]) => [k, t, boxes[k].length + (SEED[k] || []).length])].map(([k, t, n]) => { const b = h('button.hy-cnt' + (k === view ? '.on' : '') + (k === bump ? '.bump' : ''), { onclick: () => (k === 'screener' ? scrollTo(appEl) : (view = k, renderBoxes())) }, t, h('b', {}, String(n))); return b; }));
    if (bump) setTimeout(() => counts.querySelector('.bump')?.classList.remove('bump'), 260);
    boxH2.textContent = COPY[view][0]; boxP.innerHTML = COPY[view][1];
    const fresh = boxes[view], seed = SEED[view] || [];
    const item = (x) => h('div.hy-bi', {}, h('span.dot'), h('span.av', { style: { background: x.c } }, x.i), h('div', { style: { minWidth: 0 } }, h('b', {}, x.s), h('div.pv2', {}, `${x.n} — ${x.p}`)), h('span.dt', {}, 'Just now'), h('button.un', { onclick: () => undo(view, x) }, '↩ Undo'));
    const seedRow = ([s2, n, p, d, i, c]) => h('div.hy-bi', { style: { animation: 'none' } }, h('span.av', { style: { background: c } }, i), h('div', { style: { minWidth: 0 } }, h('b', {}, s2), h('div.pv2', {}, `${n} — ${p}`)), h('span.dt', {}, d));
    let body;
    if (view === 'feed') body = h('div.hy-feed', {}, fresh.map((x) => h('div.hy-fc', {}, h('span', { style: { font: '700 12px Lato', color: '#5522fa' } }, 'NEW · ' + x.n), h('b', {}, x.s), x.p, h('div', {}, h('button.un', { style: { border: 0, background: 'none', color: P, padding: 0, marginTop: '8px', cursor: 'pointer' }, onclick: () => undo(view, x) }, '↩ Undo')))), seed.map(([s2, n, p]) => h('div.hy-fc', { style: { animation: 'none' } }, h('span', { style: { font: '700 12px Lato', color: '#999' } }, s2), h('b', {}, n), p)));
    else body = h('div', {}, fresh.length ? h('div.hy-new4', {}, view === 'out' ? 'JUST SCREENED OUT' : 'NEW FOR YOU') : null, fresh.map(item), seed.length ? h('div.hy-new4', { style: { color: '#999', marginTop: '18px' } }, 'PREVIOUSLY SEEN') : null, seed.map(seedRow), !fresh.length && !seed.length ? h('div.hy-empty', { style: { color: '#999', fontSize: '17px' } }, 'Nobody here yet — say “No” to someone in The Screener.') : null);
    boxEl.replaceChildren(h('h4', {}, BOX[view]), body);
  };
  const reset = () => { senders = SEND0.map((x) => ({ ...x })); boxes = { imbox: [], feed: [], paper: [], out: [] }; view = 'imbox'; menuOpen = -1; renderScreener(); renderBoxes(); };
  const appEl = h('div.hy-app', {}, h('div.hy-chrome', {}, h('button.hy-back', { onclick: () => scrollTo(boxSec) }, '‹ Imbox'), h('span', {}, '⌕  Search'), h('span.ctr', { html: '<svg width="24" height="18" viewBox="0 0 24 18"><rect x="1" y="1" width="22" height="16" rx="2" fill="#eef" stroke="#c9c2f5"/></svg> · ✉HEY <svg width="11" height="7" viewBox="0 0 11 7"><path d="M1 1l4.5 4.5L10 1" stroke="#5522fa" stroke-width="1.6" fill="none"/></svg>' }), h('span.hy-me')),
    h('div.hy-scr', { onclick: () => { if (menuOpen >= 0) { menuOpen = -1; renderScreener(); } } }, h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, h('button.hy-done', { onclick: () => scrollTo(boxSec) }, 'Done'), h('span', { html: '<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11.5" fill="none" stroke="#5522fa" stroke-width="1.6"/><circle cx="10.5" cy="10.5" r="3.5" fill="none" stroke="#5522fa" stroke-width="1.6"/><path d="M13 13l6 6m-2-2 2-2" stroke="#5522fa" stroke-width="1.6"/></svg>' })),
      h('h4', {}, 'The Screener'), h('p.ex', { html: 'The people below are trying to email you for the first time.<br>You get to decide if you want to hear from them.' }), h('div.hy-want', {}, 'WANT TO GET EMAILS FROM THEM?', h('a', { onclick: async () => { for (let k = senders.length - 1; k >= 0; k--) { decide(k, false); } } }, 'Clear all...')), list));
  const boxSec = h('div.hy-sec', {}, boxH2, boxP, counts, h('div.hy-app', { style: { marginTop: '30px' } }, h('div.hy-chrome', {}, h('span', {}, '⌕  Search'), h('span.ctr', { html: '✉HEY' }), h('span.hy-me')), boxEl));
  const hy = h('div.hy', {}, h('div.hy-nav', {}, h('div.hy-logo', { html: `${hand('#5522fa', 34)}<span>HEY<small>by 37signals</small></span>` }), h('span', { style: { width: '14px' } }), ...['Features', 'AI Agents & CLI', 'Calendar', 'For domains', 'Pricing', 'FAQs'].map((t) => h('a', { onclick: () => (t === 'Features' ? scrollTo(appEl) : toast(t)) }, t === 'AI Agents & CLI' ? h('span.hy-new', {}, 'NEW!') : null, t)), h('span.sp'), h('button.hy-pill.hy-si', {}, 'Sign in'), h('button.hy-pill.hy-tr', { onclick: () => toast('Try HEY free (demo)') }, 'Try HEY free')),
    h('div.hy-panel', {}, hero,
      h('div.hy-sec', {}, h('h2', { html: 'People <i>*really*</i> like HEY' }), h('p', { html: '<i>Tens of thousands</i> of people have already made the switch from Gmail, Yahoo Mail, Outlook, and other email + calendar services.' }),
        h('div.hy-ts', {}, TS.map(([n, t, c]) => h('div.hy-tb', {}, h('span.nm', {}, h('i', { style: { background: `linear-gradient(135deg,${c},#333)` } }), n), h('div', { html: t })))),
        h('span', { html: '<svg class="hy-sq" width="176" height="14" viewBox="0 0 176 14"><path d="M2 7q5.5-6 11 0t11 0 11 0 11 0 11 0 11 0 11 0 11 0 11 0 11 0 11 0 11 0 11 0 11 0 11 0 11 0" fill="none" stroke="#ccc" stroke-width="3" stroke-linecap="round"/></svg>' })),
      h('div.hy-sec', { style: { marginTop: '60px' } }, h('h2.gt', {}, 'Screen emails like you screen your calls'), h('p', { html: 'The first time someone emails you they land in <b>The Screener</b>. You decide if you want to hear from them or not. <b>Yes</b> and they’re in, <b>No</b> and you’ll never hear from them again. You’re in control.' }), appEl),
      boxSec), sticky);
  root.append(hy); renderScreener(); renderBoxes();
  window.__demoProof = async () => {
    const out = [], c = () => [...counts.children].map((b) => `${b.firstChild.textContent}:${b.lastChild.textContent}`).join(' ');
    out.push(`screener rows=${list.querySelectorAll('.hy-sr').length}; ${c()}`);
    await decide(0, true); out.push(`Yes(Sunny) → imbox new=${boxes.imbox.length}`);
    list.querySelectorAll('.hy-dd')[1].click(); out.push(`dest menu open=${!!list.querySelector('.hy-menu.on')}`); setDest(1, 'paper'); await decide(1, true); out.push(`Todd→Paper Trail new=${boxes.paper.length}`);
    await decide(0, true); out.push(`Luxe(dest Feed) → feed new=${boxes.feed.length}`);
    await decide(0, false); out.push(`No(Jeff) → screened out=${boxes.out.length}`);
    view = 'feed'; renderBoxes(); out.push(`box switch Feed h2="${boxH2.textContent}" cards=${boxEl.querySelectorAll('.hy-fc').length}`);
    view = 'out'; renderBoxes(); boxEl.querySelector('.un').click(); out.push(`undo → screener rows=${senders.length}; ${c()}`);
    const gradOk = getComputedStyle(root.querySelector('h1.gt')).backgroundImage.includes('rgb(85, 34, 250)'); out.push(`h1 gradient=${gradOk} sticky pill=${getComputedStyle(sticky).position}`);
    reset(); await sleep(50); return out.join('; ') + '; restored';
  };
};
V['stripe-press-3d-book-stack-catalog'] = (root, T) => {
  import('@fontsource/lora/400.css'); import('@fontsource/lora/400-italic.css'); import('@fontsource/lora/600.css'); import('@fontsource/lora/700.css'); import('@fontsource/lora/600-italic.css');
  theme(root, T, { bg: '#201819', fg: '#f4ece6', ac: '#e8d7a8', dark: true }); scroll(root);
  const SR = "'Lora',Georgia,serif", SN = "'Inter Variable',system-ui,sans-serif";
  const marble = 'repeating-radial-gradient(ellipse at 20% 40%,#16878f 0 7px,#c9844a 7px 11px,#1e3c73 11px 17px,#2cb3b3 17px 21px),linear-gradient(90deg,#1b5f86,#2aa7a9)';
  // [title, author, spine bg, ink, font, cover bg (detail page), accent, blurb]
  const B = [
    ['Built to Grow', 'Stephanie Friedman', marble, '#f6efe0', SR, '#2b2738', '#e8d7a8', 'A Handbook for High-Performance Sales Teams', 'Startup founders often wish for a playbook for building and scaling a sales function. This book is that playbook — a structured and repeatable methodology for building a high-performing sales function from a company’s earliest days.'],
    ['Poor Charlie’s Almanack', 'Peter D. Kaufman', 'linear-gradient(180deg,#d8c98f,#c4b276)', '#3a3424', SR, '#2a2a1c', '#e6d58c', 'The Essential Wit and Wisdom of Charles T. Munger', 'Charlie Munger’s speeches and talks, gathered into one volume about multidisciplinary thinking, mental models, and a life of rational optimism.'],
    ['Maintenance: Of Everything', 'Stewart Brand', 'linear-gradient(180deg,#eadfc4,#d9cba8)', '#3b3326', SR, '#2f2a22', '#f1d48a', 'Part One', 'A history of how things are kept working — ships, motorcycles, rifles, and civilizations — and why maintenance is the neglected half of progress.'],
    ['The Origins of Efficiency', 'Brian Potter', 'linear-gradient(180deg,#2b3747,#222c39)', '#c8d6e8', SN, '#1c2531', '#9fc0e8', '', 'Why some things get cheaper and better over time — a tour of the production methods and process improvements that underpin the modern world.'],
    ['The Scaling Era', 'Dwarkesh Patel with Gavin Leech', 'linear-gradient(180deg,#6a6a6a,#5a5a5a)', '#ececec', SR, '#262626', '#dcdcdc', 'An Oral History of AI, 2019–2025', 'Interviews with the researchers, founders, and skeptics who built — and are still building — the large language model era.'],
    ['BOOM', 'Hobart and Huber', 'radial-gradient(circle at 30% 50%,#ffffff22 0 1px,transparent 2px) 0 0/38px 22px,linear-gradient(180deg,#7a2140,#661a35)', '#f3c9d7', SN, '#3a0f1f', '#ff9fc2', 'Bubbles and the End of Stagnation', 'An argument that financial bubbles, for all their wreckage, can fund the bold coordinated bets that move technology forward.'],
    ['SCALING PEOPLE', 'Claire Hughes Johnson', 'linear-gradient(180deg,#a5754a,#906340)', '#fbe9d6', SN, '#3a271a', '#f6c08c', 'Tactics for Management and Company Building', 'A practical operating manual for managers: frameworks, templates, and lessons from scaling Stripe and Google.'],
    ['Pieces of the Action', 'Vannevar Bush', 'linear-gradient(180deg,#1c1c1f,#141416)', '#9a9aa2', SR, '#141418', '#a6b8ff', '', 'The memoir of the engineer who organized American science in the Second World War and imagined the memex.'],
    ['Where Is My Flying Car?', 'J. Storrs Hall', 'linear-gradient(180deg,#9aa0a6,#868c92)', '#1d2328', SN, '#1d2730', '#9ad1ff', '', 'A sweeping look at why the technological future we were promised in the 1960s stalled — and how to get it back.'],
    ['The Big Score', 'Michael S. Malone', 'linear-gradient(180deg,#e9e4d6,#d6d0bf)', '#242424', SR, '#2a2620', '#f0c96a', 'The Billion-Dollar Story of Silicon Valley', 'The classic chronicle of the people and companies that built Silicon Valley.'],
    ['Scientific Freedom', 'Donald W. Braben', 'linear-gradient(180deg,#c9c9c9,#b5b5b5)', '#1e1e1e', SR, '#232323', '#f2f2f2', 'The Elixir of Civilization', 'A case for funding unconstrained, curiosity-driven research — and a blueprint for doing it.'],
    ['WORKING IN PUBLIC', 'Nadia Eghbal', 'linear-gradient(115deg,#e8392f 0 62%,#ffb229 62% 72%,#1b2b5a 72% 74%,#ffb229 74% 82%,#e8392f 82%)', '#1b2b5a', MONO, '#2a1312', '#ffb229', 'The Making and Maintenance of Open Source Software', 'How open source software is actually produced today — by individual creators rather than communities.'],
    ['The Art of Doing Science and Engineering', 'Richard W. Hamming', 'linear-gradient(180deg,#4f5a42,#434d38)', '#e9c46a', SR, '#232a1c', '#e9c46a', 'Learning to Learn', 'Hamming’s legendary course on how to do great work, delivered to generations of engineers.'],
    ['The Making of Prince of Persia', 'Jordan Mechner', 'linear-gradient(180deg,#2367bd,#1d58a3)', '#e9f1ff', MONO, '#14284a', '#9cc4ff', 'Journals 1985 — 1993', 'The private journals of a young game designer building one of the most influential games ever made.'],
    ['Get Together', 'Bailey Richardson, Kevin Huynh, Kai Elmer Sotto', 'linear-gradient(90deg,#f6c21c,#f08a1a 60%,#e8521a)', '#b8161c', SR, '#3a1508', '#ffcf3f', 'How to Build a Community With Your People', 'A guide to building community, drawn from the people who have done it — from running clubs to software projects.'],
    ['An Elegant Puzzle', 'Will Larson', 'linear-gradient(180deg,#e8e2d2,#d4cdb8)', '#3a5a40', SR, '#1f2a20', '#b9d7a8', 'Systems of Engineering Management', 'A field guide to the hard problems of engineering management: sizing teams, technical debt, succession planning.'],
    ['The Revolt of the Public', 'Martin Gurri', 'linear-gradient(180deg,#d8d8d8,#c8c8c8)', '#c0262d', SN, '#2b1415', '#ff8d8d', 'And the Crisis of Authority in the New Millennium', 'How the information tsunami has undermined the authority of elites and institutions.'],
    ['Stubborn Attachments', 'Tyler Cowen', 'linear-gradient(180deg,#f3f0e6,#e3dfd2)', '#1b3c6b', SR, '#14223a', '#a9c6f5', 'A Vision for a Society of Free, Prosperous, and Responsible Individuals', 'An argument that sustainable economic growth is the moral imperative of our time.'],
    ['The Dream Machine', 'M. Mitchell Waldrop', 'linear-gradient(180deg,#132f5c,#0f264b)', '#f2d16b', SR, '#0e1d36', '#f2d16b', '', 'The story of J.C.R. Licklider and the revolution that made computing personal.'],
    ['High Growth Handbook', 'Elad Gil', 'linear-gradient(180deg,#f1f1f1,#e0e0e0)', '#e3352b', SN, '#2b1b1a', '#ffb3a8', 'Scaling Startups from 10 to 10,000 People', 'The playbook for the chaotic stage after product-market fit: hiring, boards, M&A, and building an executive team.'],
  ];
  const N = B.length, SPINE = 58, GAP = 112, logo = (c, s2 = 26) => `<svg width="${s2}" height="${Math.round(s2 * .62)}" viewBox="0 0 26 16" fill="none" stroke="${c}" stroke-width="1.6"><path d="M13 8c-2-3.4-4-5.5-6.6-5.5A5.5 5.5 0 0 0 1 8a5.5 5.5 0 0 0 5.4 5.5C9 13.5 11 11.4 13 8zm0 0c2 3.4 4 5.5 6.6 5.5A5.5 5.5 0 0 0 25 8a5.5 5.5 0 0 0-5.4-5.5C17 2.5 15 4.6 13 8z"/><path d="M8.5 8c0-1.6.9-2.6 2.2-2.6M17.5 8c0 1.6-.9 2.6-2.2 2.6" opacity=".7"/></svg>`;
  const mark = (c = '#f4ece6') => `<svg width="22" height="34" viewBox="0 0 22 34" fill="none" stroke="${c}" stroke-width="1.5"><path d="M18 6.5C16.5 3.5 14 2 11 2 6.8 2 4 4.4 4 7.8c0 3.4 2.6 5 7 6.4 4.4 1.4 7 3.2 7 6.8 0 3.6-3 6-7.2 6C6.6 27 4 25 3 22"/><path d="M15.4 7.6C14.5 6 13 5.2 11 5.2c-2.4 0-4 1.2-4 2.9s1.6 2.6 4.5 3.5c4.6 1.5 9.5 3.6 9.5 9.2 0 5.6-4.6 9.2-10.2 9.2C5.6 30 2 27.8 1 24.4"/><path d="M7 22.5c.8 1.5 2.3 2.3 4 2.3 2.4 0 4-1.1 4-3s-2-2.8-4.4-3.6"/></svg>`;
  root.append(h('style', {}, `.sp{background:#201819;color:#f4ece6;font:400 17px/1.55 ${SR}}
.sp-top{position:fixed;top:calc(var(--tg-h,0px) + 16px);left:18px;z-index:30;display:flex;gap:12px;align-items:center;transition:opacity .4s}.sp-top b{display:block;font:700 15px/1.2 ${SR}}.sp-top i{font:600 italic 13px/1.2 ${SR}}
.sp-rule{position:fixed;left:22px;top:calc(var(--tg-h,0px) + 50%);transform:translateY(-38%);z-index:30;display:flex;flex-direction:column;gap:6.6px}
.sp-rule i{display:block;width:12px;height:2px;background:#f4ece655;transition:width .25s,background .25s;cursor:pointer}.sp-rule i.on{width:14px;background:#fff}.sp-rule i:hover{background:#f4ece6aa}
.sp-rule .ic{color:#f4ece666;font:11px ${SN};margin-top:4px;cursor:pointer}.sp-back{position:absolute;left:-2px;top:-36px;border:0;background:none;color:#f4ece6;font:20px ${SN};cursor:pointer;opacity:0;pointer-events:none;transition:opacity .3s}.sp.det .sp-back{opacity:1;pointer-events:auto}
.sp-q{position:fixed;left:22px;bottom:24px;z-index:30;border:0;background:none;color:#f4ece6;font:400 20px ${SR};cursor:pointer}
.sp-track{position:relative}.sp-stage{position:sticky;top:0;height:var(--vh);overflow:hidden;perspective:1400px;perspective-origin:50% 30%}
.sp-stack{position:absolute;left:50%;top:0;width:470px;margin-left:-235px;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.sp-bk{position:absolute;left:0;width:100%;transform-style:preserve-3d;cursor:pointer;transition:filter .2s}.sp-bk:hover{filter:brightness(1.1)}
.sp-sp{position:relative;height:${SPINE}px;display:grid;grid-template-columns:1.2fr 2fr 40px;align-items:center;padding:0 18px;font-size:12.5px;border-radius:2px;box-shadow:inset 0 1px 0 #ffffff30,inset 0 -2px 0 #0000003a,0 1px 0 #0003;overflow:hidden}
.sp-sp:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,#ffffff07 0 1px,transparent 1px 3px),linear-gradient(180deg,#ffffff18,transparent 40%,#00000022);pointer-events:none}
.sp-sp .ti{text-align:center;line-height:1.2;font-size:13.5px}.sp-sp .lg{display:flex;justify-content:flex-end;position:relative;z-index:1}
.sp-cv{height:0;transform-origin:top;margin:0 3px;border-radius:0 0 3px 3px;filter:brightness(.62);position:relative;overflow:hidden}.sp-cv:after{content:'STRIPE PRESS';position:absolute;left:50%;bottom:10px;transform:translateX(-50%);font:600 7px ${SN};letter-spacing:.3em;opacity:.35}
.sp-tail{height:var(--vh);display:grid;place-items:center}.sp-about{max-width:560px;margin:0 auto 140px;color:#f4ece6cc;font-size:18px}
.sp-det{position:fixed;inset:var(--tg-h,0px) 0 0 0;z-index:25;display:grid;grid-template-columns:1fr 1fr;align-items:start;padding:120px 90px 0 120px;gap:60px;opacity:0;pointer-events:none;transition:opacity .45s,background .6s;overflow:auto}
.sp.det .sp-det{opacity:1;pointer-events:auto}.sp-3d{perspective:1300px;display:grid;place-items:center;padding-top:10px}
.sp-book{width:270px;height:370px;position:relative;transform-style:preserve-3d;transform:rotateY(-62deg) rotateX(8deg) translateZ(-120px) scale(.7);opacity:0;transition:transform .9s cubic-bezier(.2,.75,.25,1),opacity .4s}
.sp.det .sp-book{transform:rotateY(-24deg) rotateX(6deg) rotateZ(-1.5deg);opacity:1}.sp-book .f{position:absolute;inset:0;border-radius:2px 5px 5px 2px;box-shadow:inset 6px 0 10px -6px #0008,0 30px 60px #0007;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;font:600 15px/1.15 ${SR};overflow:hidden}
.sp-book .f .tl{display:flex;justify-content:space-between;align-items:flex-end;gap:12px}.sp-book .s{position:absolute;top:0;left:0;width:34px;height:100%;transform-origin:left;transform:rotateY(90deg);filter:brightness(.7)}.sp-book .pg{position:absolute;top:4px;right:0;width:32px;height:calc(100% - 8px);transform-origin:right;transform:rotateY(-90deg);background:repeating-linear-gradient(90deg,#efe8d8 0 1px,#d8cfbc 1px 2px)}
.sp-book .bdg{position:absolute;right:10px;top:10px;width:24px;height:26px;background:#ddd;border-radius:2px;display:grid;place-items:center}
.sp-txt h2{font:700 30px/1.3 ${SR};margin:10px 0 6px}.sp-txt .au{font:italic 600 17px ${SR}}.sp-txt hr{width:48px;border:0;border-top:1.5px solid currentColor;margin:28px 0;opacity:.6}.sp-txt p{color:#f4ece6dd;max-width:420px;margin:0 0 18px;font-size:17px}
.sp-buy{display:flex;gap:10px;margin-top:10px}.sp-buy button{border:1px solid currentColor;background:none;color:inherit;font:600 13px ${SN};padding:9px 16px;border-radius:99px;cursor:pointer}`));
  const vh = () => root.clientHeight || 800; root.style.setProperty('--vh', vh() + 'px');
  const stack = h('div.sp-stack'), rule = h('div.sp-rule', {}, h('button.sp-back', { title: 'Back', onclick: () => close() }, '←'), B.map((b, i) => h('i', { title: b[0], onclick: () => jump(i) })), h('span.ic', {}, '▶'), h('span.ic', {}, '◎'));
  const ticks = [...rule.querySelectorAll('i')];
  const bks = B.map((b, i) => { const cv = h('div.sp-cv', { style: { background: b[2] } }); const el = h('div.sp-bk', { onclick: () => open(i) }, h('div.sp-sp', { style: { background: b[2], color: b[3], fontFamily: b[4] } }, h('span', { style: { fontSize: '11.5px', fontStyle: b[4] === SR ? 'italic' : 'normal', letterSpacing: b[4] === MONO ? '.04em' : 0 } }, b[1].split(',')[0]), h('span.ti', {}, b[0], b[7] && /Era|Prince|Hamming|Doing/.test(b[0]) ? h('div', { style: { fontSize: '11px', opacity: .85 } }, b[7]) : null), h('span.lg', { html: logo(b[3]) })), cv); el._cv = cv; stack.append(el); return el; });
  const stage = h('div.sp-stage', {}, stack), track = h('div.sp-track', { style: { height: (N * GAP + vh() * 1.3) + 'px' } }, stage);
  let active = 0, tiltX = 0, tiltY = 0, last = 0;
  const layout = () => { const H = vh(), y = root.scrollTop, spread = clamp(y / (H * .55), 0, 1), gap = SPINE + 2 + spread * (GAP - SPINE - 2), center = H * .5;
    const off = H * .28 - Math.max(0, y - H * .55 * spread) * (spread >= 1 ? 1 : 0) - (spread < 1 ? 0 : 0); let best = 0, bd = 1e9;
    bks.forEach((el, i) => { const ty = off + i * gap, taper = 1 - Math.min(i, 9) * .012 * (1 - spread); el.style.transform = `translateY(${ty}px) scaleX(${taper})`; el._cv.style.height = (spread * (GAP - SPINE - 18)) + 'px'; const d = Math.abs(ty + SPINE / 2 - center); if (d < bd) { bd = d; best = i; } });
    active = spread < .2 ? 0 : best; ticks.forEach((t, i) => t.classList.toggle('on', i === active));
    stack.style.transform = `rotateX(${(-tiltY * 6 + (1 - spread) * 4).toFixed(2)}deg) rotateY(${(tiltX * 9).toFixed(2)}deg)`; };
  const jump = (i) => { const H = vh(), g = GAP; root.scrollTo({ top: H * .55 + i * g + H * .28 - H * .5 + SPINE / 2 + 4, behavior: 'smooth' }); };
  stage.addEventListener('mousemove', (e) => { const r = stage.getBoundingClientRect(); tiltX = (e.clientX - r.left) / r.width - .5; tiltY = (e.clientY - r.top) / r.height - .5; layout(); });
  stage.addEventListener('mouseleave', () => { tiltX = tiltY = 0; layout(); });
  root.addEventListener('scroll', layout, { passive: true }); window.addEventListener('resize', () => { root.style.setProperty('--vh', vh() + 'px'); layout(); });
  const cover = h('div.sp-book'), txt = h('div.sp-txt'), det = h('div.sp-det', {}, h('div.sp-3d', {}, cover), txt);
  const open = (i) => { const b = B[i]; last = root.scrollTop; active = i; ticks.forEach((t, k) => t.classList.toggle('on', k === i));
    det.style.background = b[5]; det.style.color = b[6];
    cover.replaceChildren(h('div.s', { style: { background: b[2] } }), h('div.pg'), h('div.f', { style: { background: i === 0 ? 'repeating-radial-gradient(ellipse at 50% 110%,#1d5d9b 0 6px,#d39a5a 6px 9px,#2aa6b0 9px 14px,#163e78 14px 18px)' : b[2], color: b[3] } }, h('span.bdg', { html: mark('#555').replace('width="22" height="34"', 'width="12" height="18"') }), h('div.tl', {}, h('span', { style: { fontFamily: b[4], fontSize: '17px' } }, b[0]), h('span', { style: { fontSize: '13px', textAlign: 'right' } }, b[1].split(',')[0]))));
    txt.replaceChildren(h('h2', {}, b[0] + (b[7] ? ': ' + b[7] : '')), h('div.au', {}, b[1]), h('hr'), h('p', {}, b[8]), h('p', {}, 'Stripe Press publishes books about technological, economic, and scientific advancement. Each edition is designed as an object — cloth, foil, and paper chosen for the idea inside.'), h('div.sp-buy', {}, h('button', { onclick: () => toast('Hardcover · $30 (demo)') }, 'Hardcover'), h('button', { onclick: () => toast('Ebook · $10 (demo)') }, 'Ebook'), h('button', { onclick: () => toast('Audiobook (demo)') }, 'Audiobook')));
    det.scrollTop = 0; sp.classList.add('det'); history.replaceState(null, '', '#' + b[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')); };
  const close = () => { sp.classList.remove('det'); history.replaceState(null, '', location.pathname); root.scrollTop = last; layout(); };
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && sp.classList.contains('det')) close(); });
  const sp = h('div.sp', {}, h('div.sp-top', { html: `${mark()}<div><b>Stripe Press</b><i>Ideas for progress</i></div>` }), rule, h('button.sp-q', { onclick: () => toast('Stripe Press highlights ideas that we think can be broadly useful.') }, '?'), track,
    h('div.sp-about', {}, h('p', {}, 'Stripe partners with millions of the world’s most innovative businesses. These businesses are the result of many different inputs. Perhaps the most important ingredient is “ideas.”'), h('p', {}, 'Stripe Press highlights ideas that we think can be broadly useful. Some books contain entirely new material, some are collections of existing work reimagined, and others are republications of previous works that have remained relevant over time.')), det);
  root.append(sp); layout();
  window.__demoProof = async () => { const out = [], H = vh(); const g0 = bks[1].getBoundingClientRect().top - bks[0].getBoundingClientRect().top; out.push(`books=${bks.length} restGap=${Math.round(g0)}`);
    root.scrollTop = H * .55 + 3 * GAP; layout(); await sleep(60); const g1 = bks[1].getBoundingClientRect().top - bks[0].getBoundingClientRect().top; out.push(`scroll spread gap=${Math.round(g1)} cover=${parseInt(bks[0]._cv.style.height)}px activeTick=${ticks.findIndex((t) => t.classList.contains('on'))}`);
    const sTop = root.scrollTop; bks[0].click(); await sleep(950); out.push(`detail open bg=${getComputedStyle(det).backgroundColor} title="${txt.querySelector('h2').textContent.slice(0, 30)}" cover=${getComputedStyle(cover).transform !== 'none'}`);
    close(); await sleep(80); out.push(`back restores scroll=${Math.abs(root.scrollTop - sTop) < 2}`); root.scrollTop = 0; layout(); return out.join('; ') + '; restored'; };
};
V['airpods-pro-highlights-carousel-sticky-localnav'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#1d1d1f', ac: '#0071e3', dark: false }); scroll(root);
  const F = "'Inter Variable',-apple-system,'SF Pro Display',system-ui,sans-serif", INK = '#1d1d1f', BL = '#0071e3';
  const iri = 'conic-gradient(from 0deg,#fff 0 8%,#ffd6f0 12%,#b7e3ff 18%,#fff 24%,#fff1b8 30%,#e8c8ff 36%,#fff 44%,#c7ffe9 52%,#ffd0d0 60%,#fff 68%,#cfe0ff 76%,#ffe9c2 84%,#fff 92%)';
  root.append(h('style', {}, `.ap{font-family:${F};color:${INK};background:#fff;-webkit-font-smoothing:antialiased;letter-spacing:-.01em}
.ap-g{height:44px;display:flex;justify-content:center;gap:34px;align-items:center;font-size:12px;color:#1d1d1fcc;background:#fafafc}.ap-g span{cursor:pointer}.ap-g span:hover{color:#000}
.ap-l{position:sticky;top:0;z-index:30;height:52px;display:flex;align-items:center;padding:0 max(22px,calc(50% - 490px));gap:22px;font-size:12px;background:#fffc;transition:background .3s,box-shadow .3s}.ap-l.stuck{background:#fbfbfdcc;backdrop-filter:saturate(180%) blur(20px);box-shadow:0 1px 0 #0000001f}
.ap-l b{font:600 21px ${F};letter-spacing:.01em;margin-right:auto}.ap-l a{color:#1d1d1fcc;cursor:pointer;padding:15px 0;border-bottom:1px solid transparent}.ap-l a.on{color:${INK};border-color:${INK}}.ap-l a:hover{color:${BL}}
.ap-l .buy,.ap-buy b{background:${BL};color:#fff;border:0;border-radius:99px;font:400 12px ${F};padding:4px 11px;cursor:pointer}
.ap-hero{position:relative;height:740px;overflow:hidden;background:radial-gradient(ellipse at 52% 40%,#fff,#f2f2f4 60%,#e9e9ec)}
.ap-ring{position:absolute;border-radius:50%;background:${iri};-webkit-mask:radial-gradient(closest-side,transparent calc(100% - var(--w)),#000 calc(100% - var(--w) + 1px),#000 99%,transparent);mask:radial-gradient(closest-side,transparent calc(100% - var(--w)),#000 calc(100% - var(--w) + 1px),#000 99%,transparent);filter:drop-shadow(0 0 6px #fff);opacity:.9;animation:aprot 28s linear infinite}
@keyframes aprot{to{rotate:360deg}}
.ap-fig{position:absolute;left:50%;top:40px;width:380px;height:680px;transform:translateX(-50%);background:radial-gradient(ellipse 17% 9% at 50% 11%,#111 96%,transparent),radial-gradient(ellipse 30% 26% at 52% 38%,#141414 96%,transparent),radial-gradient(ellipse 40% 6% at 30% 47%,#161616 95%,transparent),radial-gradient(ellipse 15% 32% at 40% 72%,#1b1b1b 95%,transparent),radial-gradient(ellipse 16% 34% at 62% 74%,#1b1b1b 95%,transparent);-webkit-mask:linear-gradient(#000 58%,transparent 92%);mask:linear-gradient(#000 58%,transparent 92%)}
.ap-pause{position:absolute;right:max(22px,calc(50% - 490px));top:22px;width:36px;height:36px;border-radius:50%;border:0;background:#e8e8edcc;color:#333;font-size:13px;cursor:pointer;z-index:3}
.ap-h{position:absolute;left:max(64px,calc(50% - 450px));bottom:46px;z-index:2}.ap-h .k{font:600 24px ${F};margin-bottom:12px}.ap-h h1{font:600 56px/1.07 ${F};letter-spacing:-.015em;margin:0 0 14px}.ap-h p{font:600 14px ${F};margin:0}
.ap-buy{position:absolute;right:max(64px,calc(50% - 450px));bottom:70px;z-index:2;display:flex;align-items:center;gap:18px;background:#e8e8edd9;backdrop-filter:blur(10px);border-radius:99px;padding:8px 8px 8px 20px;font:600 14px ${F}}.ap-buy b{font-size:14px;padding:8px 16px}
.ap-sec{max-width:980px;margin:0 auto;padding:110px 0 0}.ap-sec h2{font:600 48px/1.08 ${F};letter-spacing:-.003em;margin:0}.ap-hd{display:flex;align-items:baseline;justify-content:space-between}.ap-hd a{color:${BL};font-size:17px;cursor:pointer}
.ap-car{position:relative;margin-top:44px;overflow:hidden;padding-left:max(20px,calc(50% - 490px))}.ap-rail{display:flex;gap:20px;transition:transform .9s cubic-bezier(.4,0,.2,1)}
.ap-sl{flex:none;width:980px;height:600px;border-radius:28px;position:relative;overflow:hidden;background:#fff;box-shadow:inset 0 0 0 1px #0000000d;cursor:pointer}.ap-sl .cap{position:absolute;top:44px;left:0;right:0;text-align:center;font:600 21px/1.24 ${F};z-index:2;padding:0 160px}.ap-sl.dk{color:#f5f5f7}.ap-sl .art{position:absolute;inset:0}
.ap-ctl{position:sticky;bottom:24px;display:flex;justify-content:center;gap:12px;margin:-80px 0 36px;z-index:5}.ap-dots{display:flex;gap:10px;align-items:center;height:56px;padding:0 22px;border-radius:99px;background:#e8e8edcc;backdrop-filter:blur(14px)}
.ap-dot{width:8px;height:8px;border-radius:99px;background:#00000042;position:relative;overflow:hidden;cursor:pointer;transition:width .5s cubic-bezier(.4,0,.2,1)}.ap-dot.on{width:48px;background:#00000029}.ap-dot i{position:absolute;inset:0 auto 0 0;width:0;background:#1d1d1fcc;border-radius:99px}
.ap-pp{width:56px;height:56px;border-radius:50%;border:0;background:#e8e8edcc;backdrop-filter:blur(14px);font-size:16px;color:#1d1d1f;cursor:pointer}
.ap-look{background:#f5f5f7;margin-top:40px;height:560px;position:relative;overflow:hidden;display:grid;place-items:center}
.ap-bud{position:absolute;width:150px;height:220px}.ap-bud .st{position:absolute;left:52px;top:92px;width:40px;height:124px;border-radius:20px;background:linear-gradient(90deg,#d9d9dc,#fff 40%,#cfcfd3);box-shadow:0 20px 30px #0002;transform:rotate(-14deg)}.ap-bud .hd{position:absolute;left:0;top:0;width:120px;height:118px;border-radius:50% 50% 46% 54%;background:radial-gradient(circle at 36% 30%,#fff,#e9e9ec 55%,#bfbfc4);box-shadow:0 24px 40px #0002}.ap-bud .tip{position:absolute;left:18px;top:22px;width:58px;height:58px;border-radius:50%;background:radial-gradient(circle,#555 0 28%,#888 30% 46%,#cfcfd3 48%)}
.ap-big{position:relative;height:680px;display:grid;place-items:center;text-align:center;overflow:hidden}.ap-big .rg{position:absolute;width:780px;height:780px;border-radius:50%;background:${iri};-webkit-mask:radial-gradient(closest-side,transparent 70%,#000 73%,#000 86%,transparent 97%);mask:radial-gradient(closest-side,transparent 70%,#000 73%,#000 86%,transparent 97%);filter:blur(2px) saturate(1.5);animation:aprot 40s linear infinite}
.ap-big .sp{position:absolute;width:820px;height:820px;border-radius:50%;background:repeating-conic-gradient(#ffffff 0 1deg,transparent 1deg 3deg);-webkit-mask:radial-gradient(closest-side,transparent 84%,#000 88%,transparent 100%);mask:radial-gradient(closest-side,transparent 84%,#000 88%,transparent 100%);opacity:.9;filter:blur(1px) drop-shadow(0 0 4px #c9b8ff)}
.ap-big .k{font:600 21px ${F};position:relative}.ap-big h2{font:600 64px/1.06 ${F};position:relative;margin:6px 0 0}
.ap-cp{max-width:980px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:20px 0 0}.ap-cp p{grid-column:1;font:600 21px/1.38 ${F};color:#6e6e73;margin:0 0 70px}.ap-cp p b{color:${INK}}
.ap-st{border-top:1px solid #d2d2d7;padding-top:18px;width:220px;font:600 17px/1.3 ${F};color:#6e6e73}.ap-st .n{font:600 56px/1.05 ${F};color:${INK};letter-spacing:-.01em;margin:4px 0}.ap-st small{font-size:14px;display:block;color:#6e6e73;font-weight:600}
.ap-fr{display:flex;gap:24px;overflow-x:auto;scroll-behavior:smooth;padding:70px max(20px,calc(50% - 490px)) 10px;scrollbar-width:none}.ap-fr::-webkit-scrollbar{display:none}
.ap-fc{flex:none;width:310px;font:400 14px/1.45 ${F};color:#6e6e73}.ap-fc .im{height:300px;border-radius:22px;margin-bottom:20px;position:relative;overflow:hidden}.ap-fc b{color:${INK};font-weight:600}
.ap-nav2{display:flex;justify-content:flex-end;gap:16px;max-width:980px;margin:18px auto 120px}.ap-nav2 button{width:36px;height:36px;border-radius:50%;border:0;background:#e8e8ed;color:#1d1d1f;font-size:15px;cursor:pointer}.ap-nav2 button:disabled{opacity:.42;cursor:default}`));
  const ring = (x, y, w, hh, bw, r = 0) => h('div', { style: { position: 'absolute', left: x, top: y, width: w, height: hh, transform: `rotate(${r}deg) perspective(900px) rotateX(64deg)` } }, h('div.ap-ring', { style: { inset: 0, '--w': bw } }));
  const local = h('div.ap-l', {}, h('b', {}, 'AirPods Pro 3'), ...['Overview', 'Hearing Health', 'Tech Specs', 'Compare'].map((t, i) => h('a' + (i ? '' : '.on'), { onclick: () => toast(t) }, t)), h('button.buy', { onclick: () => toast('Buy AirPods Pro 3 — $249 (demo)') }, 'Buy'));
  let heroPlay = true; const hero = h('div.ap-hero', {}, ring('-160px', '-240px', '760px', '640px', '80px', -14), ring('780px', '-120px', '560px', '720px', '64px', 28), h('div.ap-fig'),
    h('button.ap-pause', { title: 'Pause hero', onclick: (e) => { heroPlay = !heroPlay; e.currentTarget.textContent = heroPlay ? '❚❚' : '▶'; hero.querySelectorAll('.ap-ring').forEach((r) => (r.style.animationPlayState = heroPlay ? 'running' : 'paused')); } }, '❚❚'),
    h('div.ap-h', {}, h('div.k', {}, 'AirPods Pro 3'), h('h1', { html: 'The world’s best in‑ear<br>Active Noise Cancellation.' }), h('p', {}, 'Up to 2x more than AirPods Pro 2.¹')),
    h('div.ap-buy', {}, '$249', h('b', { onclick: () => toast('Buy (demo)') }, 'Buy')));
  const SL = [
    ['An exceptional spatial listening experience, with high-definition, three-dimensional audio.⁴', 0, `radial-gradient(ellipse 22% 34% at 50% 78%,#0e0e0e 96%,transparent),radial-gradient(ellipse 9% 10% at 50% 46%,#0e0e0e 96%,transparent),radial-gradient(circle at 50% 62%,transparent 38%,#fff 39%,transparent 41%,#ffd9f3 43%,transparent 46%,#c9ecff 48%,transparent 52%),#fff`],
    ['All-new heart rate sensing. Now you can track your heart rate and calories burned during workouts.⁵', 1, `radial-gradient(circle at 50% 66%,#ff2d55 0 6%,#ff2d5566 7%,transparent 24%),radial-gradient(ellipse at 50% 120%,#3a0a14,#000 70%)`],
    ['Redesigned from the inside out for a more secure fit and better acoustic performance.²', 0, `radial-gradient(circle at 44% 64%,#fff 0 9%,#e4e4e8 10% 15%,transparent 16%),radial-gradient(circle at 58% 60%,#fff 0 8%,#dcdce0 9% 13%,transparent 14%),linear-gradient(#f5f5f7,#e8e8ed)`],
    ['Live Translation helps you communicate across languages.⁶', 1, `linear-gradient(90deg,transparent 18%,#0a84ff22 18% 48%,transparent 48% 52%,#30d15822 52% 82%,transparent 82%),radial-gradient(ellipse at 50% 100%,#1c1c1e,#000)`],
    ['Hearing Aid capability⁷ now features automatic Conversation Boost⁸ and 67% more battery life in Transparency.⁹', 0, `repeating-radial-gradient(circle at 50% 70%,#fff 0 14px,#f0f0f3 14px 15px),#fff`],
    ['Get up to 8 hours of listening time with Active Noise Cancellation on a single charge.³', 1, `radial-gradient(ellipse 34% 8% at 50% 74%,#30d158 98%,transparent),radial-gradient(ellipse 36% 10% at 50% 74%,#2c2c2e 98%,transparent),#000`]];
  const DUR = 5200; let cur = 0, playing = true, t0 = performance.now(), elapsed = 0;
  const rail = h('div.ap-rail', {}, SL.map(([c, dk, bg], i) => h('div.ap-sl' + (dk ? '.dk' : ''), { onclick: () => go(i) }, h('div.cap', {}, c), h('div.art', { style: { background: bg } }))));
  const dots = SL.map((_, i) => h('div.ap-dot', { title: `Slide ${i + 1}`, onclick: () => go(i) }, h('i')));
  const pp = h('button.ap-pp', { title: 'Pause', onclick: () => toggle() }, '❚❚');
  const render = () => { rail.style.transform = `translateX(${-cur * 1000}px)`; dots.forEach((d, i) => { d.classList.toggle('on', i === cur); if (i !== cur) d.firstChild.style.width = '0'; }); };
  const tick = (now) => { if (playing) { const p = clamp((elapsed + now - t0) / DUR, 0, 1); dots[cur].firstChild.style.width = (p * 100) + '%'; if (p >= 1) { if (cur < SL.length - 1) go(cur + 1); else { playing = false; elapsed = 0; pp.textContent = '↺'; pp.title = 'Replay'; } } } requestAnimationFrame(tick); };
  const go = (i) => { cur = clamp(i, 0, SL.length - 1); elapsed = 0; t0 = performance.now(); dots[cur].firstChild.style.width = '0'; render(); };
  const toggle = () => { if (pp.textContent === '↺') { playing = true; pp.textContent = '❚❚'; go(0); return; } if (playing) { elapsed += performance.now() - t0; playing = false; pp.textContent = '▶'; pp.title = 'Play'; } else { t0 = performance.now(); playing = true; pp.textContent = '❚❚'; pp.title = 'Pause'; } };
  const bud = (x, y, r) => h('div.ap-bud', { style: { left: x, top: y, transform: `rotate(${r}deg)` } }, h('div.st'), h('div.hd'), h('div.tip'));
  const FC = [['New ultra-low-noise microphones.', 'Using advanced computational audio to remove more noise around you than ever, AirPods Pro 3 let you zone in (or out) when you need to.', 'radial-gradient(ellipse 22% 60% at 50% 20%,#222 96%,transparent),linear-gradient(#f2f2f4,#fff)'],
    ['Voice Isolation.', 'AirPods Pro 3 reduce background noise and isolate voices during calls. So whether you’re on the bus or in a café, every conversation is loud and clear.¹⁵', 'radial-gradient(circle at 56% 34%,#fff 0 16%,#ddd 17% 19%,transparent 20%),linear-gradient(#e9e9ec,#fafafa)'],
    ['Adaptive Audio.', 'AirPods Pro 3 combine Active Noise Cancellation with next-level Transparency, intelligently adapting to your environment.¹⁵', 'repeating-linear-gradient(35deg,#1f6f3a 0 8px,#2c8a4a 8px 16px),#2c8a4a'],
    ['Conversation Awareness.', 'Start talking and AirPods Pro 3 lower your media volume and enhance the voices in front of you.', 'radial-gradient(circle at 30% 60%,#ffb38a 0 14%,transparent 15%),radial-gradient(circle at 70% 52%,#8ab4ff 0 14%,transparent 15%),#f5f5f7'],
    ['Loud Sound Reduction.', 'Continuously reduces exposure to loud environmental noise, at concerts or on a busy street.', 'repeating-radial-gradient(circle at 50% 50%,#ff9f0a 0 3px,transparent 3px 16px),#1c1c1e'],
    ['Personalized Volume.', 'Machine learning understands your listening preferences over time and fine-tunes the media experience.', 'linear-gradient(90deg,#0a84ff 0 62%,#d2d2d7 62%) 50% 50%/70% 8px no-repeat,#fff']];
  const fr = h('div.ap-fr', {}, FC.map(([b, t, bg]) => h('div.ap-fc', {}, h('div.im', { style: { background: bg } }), h('span', {}, h('b', {}, b), ' ', t))));
  const prev = h('button', { title: 'Previous', onclick: () => fr.scrollBy({ left: -334 }) }, '‹'), next = h('button', { title: 'Next', onclick: () => fr.scrollBy({ left: 334 }) }, '›');
  const upd = () => { prev.disabled = fr.scrollLeft < 4; next.disabled = fr.scrollLeft > fr.scrollWidth - fr.clientWidth - 4; }; fr.addEventListener('scroll', upd);
  const ap = h('div.ap', {}, h('div.ap-g', { html: '<span style="font-size:15px">●</span>' + ['Store', 'Mac', 'iPad', 'iPhone', 'Watch', 'Vision', 'AirPods', 'TV &amp; Home', 'Entertainment', 'Accessories', 'Support'].map((t) => `<span>${t}</span>`).join('') + '<span>⌕</span><span>▢</span>' }), local, hero,
    h('div.ap-sec', {}, h('div.ap-hd', {}, h('h2', {}, 'Get the highlights.'), h('a', { onclick: () => toast('Watch the film (demo)') }, 'Watch the film ⊕'))),
    h('div.ap-car', {}, rail), h('div.ap-ctl', {}, h('div.ap-dots', {}, dots), pp),
    h('div.ap-sec', { style: { paddingTop: '60px' } }, h('h2', {}, 'Take a closer look.')), h('div.ap-look', {}, bud('38%', '150px', -8), bud('52%', '200px', 14)),
    h('div.ap-big', {}, h('div.sp'), h('div.rg'), h('div', {}, h('div.k', {}, 'Intelligent noise control'), h('h2', { html: 'The best thing<br>you’ve never<br>heard.' }))),
    h('div.ap-cp', {}, h('p', { html: 'Introducing <b>the world’s best in-ear Active Noise Cancellation</b> for the most immersive listening experience ever.¹³ Designed with an upgraded acoustic seal, AirPods Pro 3 automatically adapt to your environment and preferences. And new ultra-low-noise microphones remove even more unwanted sound.' }), h('span'),
      h('div.ap-st', {}, 'Removes up to', h('div.n', {}, '2x more'), h('small', {}, 'unwanted noise than AirPods Pro 2¹')), h('div.ap-st', {}, 'Removes up to', h('div.n', {}, '4x more'), h('small', {}, 'unwanted noise than original AirPods Pro¹⁴'))),
    fr, h('div.ap-nav2', {}, prev, next));
  root.append(ap); render(); requestAnimationFrame(tick); setTimeout(upd, 50);
  root.addEventListener('scroll', () => local.classList.toggle('stuck', root.scrollTop > 44), { passive: true });
  window.__demoProof = async () => { const out = []; root.scrollTop = 400; await sleep(40); out.push(`localnav sticky=${getComputedStyle(local).position} top=${Math.round(local.getBoundingClientRect().top - root.getBoundingClientRect().top)} stuck=${local.classList.contains('stuck')}`);
    go(0); await sleep(700); out.push(`autoplay progress=${parseFloat(dots[0].firstChild.style.width).toFixed(0)}%`); go(2); await sleep(600); out.push(`dot jump active=${dots.findIndex((d) => d.classList.contains('on'))} width=${dots[2].getBoundingClientRect().width.toFixed(0)}px`);
    toggle(); const w = dots[2].firstChild.style.width; await sleep(300); out.push(`paused holds=${w === dots[2].firstChild.style.width}`); toggle();
    fr.style.scrollBehavior = 'auto'; fr.scrollLeft = 0; fr.scrollBy({ left: 334 }); await sleep(80); out.push(`rail next scrollLeft=${Math.round(fr.scrollLeft)}`); fr.scrollLeft = 0; fr.style.scrollBehavior = ''; root.scrollTop = 0; go(0); upd(); return out.join('; ') + '; restored'; };
};
V['opal-scroll-word-reveal-odometer-gems'] = (root, T) => {
  theme(root, T, { bg: '#040404', fg: '#ffffff', ac: '#ffffff', dark: true }); scroll(root);
  const F = "'Inter Variable',system-ui,sans-serif";
  root.append(h('style', {}, `.op{background:#040404;color:#fff;font:400 16px/1.5 ${F};-webkit-font-smoothing:antialiased;overflow-x:clip}
.op-nav{position:sticky;top:14px;z-index:30;width:1100px;max-width:calc(100% - 40px);margin:14px auto 0;height:52px;border-radius:14px;background:#0d0d0dcc;backdrop-filter:blur(16px);display:flex;align-items:center;gap:28px;padding:0 10px 0 18px;font-size:13px;color:#ffffffa8}
.op-nav .lg{font:700 22px ${F};color:#fff;letter-spacing:-.04em;margin-right:auto;display:flex;align-items:center}.op-nav .lg i{display:inline-block;width:17px;height:17px;border:3.5px solid #fff;border-radius:50%;margin-right:1px}.op-nav a{cursor:pointer}.op-nav a:hover{color:#fff}
.op-try{border:0;border-radius:99px;background:#fff;color:#000;font:600 13px ${F};height:34px;padding:0 16px;cursor:pointer}
.op-hero{position:relative;height:780px;margin-top:-66px;display:grid;place-items:center;text-align:center;overflow:hidden}
.op-cave{position:absolute;inset:-40px;background:radial-gradient(ellipse 40% 50% at 50% 42%,#040404 30%,transparent 72%),radial-gradient(ellipse at 50% 120%,#000 30%,transparent 60%)}
.op-cave svg{position:absolute;inset:0;width:100%;height:100%;opacity:.95}
.op-hero .in{position:relative;z-index:2;margin-top:-60px}.op-hero h1{font:700 76px/1.02 ${F};letter-spacing:-.035em;margin:0 0 22px}.op-hero p{max-width:400px;margin:0 auto 26px;font-size:15px;color:#ffffffc8}
.op-bd{display:flex;gap:10px;justify-content:center}.op-bd button{height:44px;border-radius:9px;border:1px solid #ffffff55;background:#000;color:#fff;font:600 15px/1 ${F};padding:0 14px;display:flex;align-items:center;gap:8px;cursor:pointer;text-align:left}.op-bd small{display:block;font:500 9px ${F};opacity:.8;margin-bottom:2px}.op-bd button:hover{border-color:#fff}
.op-aw{display:flex;gap:40px;justify-content:center;align-items:center;margin-top:30px;font-size:10px;color:#ffffffb0}.op-aw .la{display:flex;align-items:center;gap:6px;font:600 10px/1.2 ${F};text-align:center}.op-aw .la span{font-size:22px;opacity:.8}.op-aw b{font-size:14px;margin-right:6px}.op-aw .st{color:#fff;letter-spacing:2px}
.op-vid{position:relative;z-index:2;text-align:center;margin-top:-90px}.op-vid .l{font-size:13px;color:#ffffffd0;margin-bottom:14px;cursor:pointer}.op-vc{width:780px;height:440px;margin:0 auto;border-radius:16px;background:radial-gradient(circle at 30% 20%,#9fc3e8,#476a92 40%,#18273a);position:relative;overflow:hidden;cursor:pointer}
.op-vc:before{content:'WHO WINS\\ATHE AI ERA?';white-space:pre;position:absolute;left:24px;bottom:50px;font:900 54px/1 ${F};text-align:left;letter-spacing:-.02em}.op-vc:after{content:'▶';position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:#000c;display:grid;place-items:center;font-size:22px}
.op-pill{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:40;display:flex;align-items:center;gap:8px;height:34px;padding:0 14px;border-radius:99px;background:#1a1a1acc;backdrop-filter:blur(14px);box-shadow:inset 0 0 0 1px #ffffff14;font:500 12px ${F};color:#ffffffb8}
.op-odo{display:flex;font:600 12px/18px ${F};color:#fff;font-variant-numeric:tabular-nums}.op-odo .c{height:18px;overflow:hidden;width:.62em;text-align:center}.op-odo .c>div{transition:transform .7s cubic-bezier(.3,1.3,.5,1)}.op-odo .c>div>span{display:block;height:18px}.op-odo .sep{width:.6em}
.op-say{height:220vh;position:relative}.op-say .stk{position:sticky;top:0;height:var(--vh);display:grid;place-items:center}.op-say p{max-width:860px;text-align:center;font:500 40px/1.38 ${F};letter-spacing:-.015em;margin:0;padding:0 30px}.op-say p span{color:#ffffff38;transition:color .35s}.op-say p span.on{color:#fff}
.op-ft{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:60px;max-width:1000px;margin:0 auto;padding:110px 0}.op-ft.rv .ph{order:2}
.op-tag{display:inline-block;border-radius:99px;background:#ffffff12;box-shadow:inset 0 0 0 1px #ffffff1a;font:500 12px ${F};padding:4px 10px;color:#ffffffc0}.op-ft h3,.op-gm h3{font:700 34px/1.15 ${F};letter-spacing:-.025em;margin:14px 0 10px}.op-ft p{color:#ffffffa0;max-width:380px;margin:0}
.op-ph{position:relative;width:280px;height:560px;margin:0 auto;border-radius:46px;background:#0b0b0c;box-shadow:inset 0 0 0 7px #2a2a2c,inset 0 0 0 9px #555,0 40px 80px #000;padding:52px 20px 20px}.op-ph:before{content:'';position:absolute;left:50%;top:16px;width:84px;height:24px;border-radius:12px;background:#000;transform:translateX(-50%)}
.op-glow{position:absolute;inset:-80px;border-radius:50%;filter:blur(60px);opacity:.5;z-index:-1}.ph{position:relative;z-index:0}
.op-sc{display:grid;place-items:center;margin-top:30px}.op-sc .ring{width:170px;height:170px;border-radius:50%;display:grid;place-items:center;font:700 54px ${F}}.op-sc small{display:block;font:500 12px ${F};color:#ffffff90;text-align:center}
.op-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.op-tiles div{height:96px;border-radius:16px;background:#1b1c1f;padding:12px;font:600 12px ${F};color:#ffffffc0;cursor:pointer;transition:background .2s}.op-tiles div.on{background:#2a3a2e;color:#9ef0b1}.op-tiles small{display:block;font-weight:400;opacity:.7;margin-top:28px}
.op-tm{display:grid;place-items:center;margin-top:24px;gap:16px}.op-tm button{border:0;border-radius:99px;background:#fff;color:#000;font:600 14px ${F};padding:10px 26px;cursor:pointer}
.op-gm{text-align:center;padding:90px 0 40px}.op-mq{overflow:hidden;margin-top:36px;-webkit-mask:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.op-row{display:flex;gap:18px;width:max-content;animation:opmq 60s linear infinite;padding:10px 0}.op-row.r{animation-direction:reverse}.op-mq:hover .op-row{animation-play-state:paused}@keyframes opmq{to{transform:translateX(-50%)}}
.op-gem{width:140px;height:170px;border-radius:20px;background:#0f0f10;box-shadow:inset 0 0 0 1px #ffffff12;display:grid;place-items:center;align-content:center;gap:12px;font:500 12px ${F};color:#ffffffb0;cursor:pointer;transition:transform .2s}.op-gem:hover{transform:translateY(-4px);color:#fff}
.op-gem i{display:block;width:62px;height:62px;clip-path:polygon(50% 0,90% 22%,100% 60%,50% 100%,0 60%,10% 22%);filter:drop-shadow(0 0 14px var(--g))}
.op-stats{max-width:1000px;margin:0 auto;padding:100px 0 60px;text-align:center}.op-stats h4{font:500 15px ${F};color:#ffffffa0;margin:0 0 18px}.op-big{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.op-big div{font:700 56px/1.05 ${F};letter-spacing:-.03em}.op-big small{display:block;font:500 15px ${F};color:#ffffff90;letter-spacing:0;margin-top:6px}
.op-pct{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:70px;text-align:left}.op-pct div{border-radius:20px;background:#0e0e0f;box-shadow:inset 0 0 0 1px #ffffff10;padding:26px}.op-pct b{display:block;font:700 48px ${F};letter-spacing:-.03em}.op-pct em{display:block;font:600 17px ${F};font-style:normal;margin:4px 0 8px}.op-pct span{color:#ffffff88;font-size:14px}
.op-end{text-align:center;padding:60px 0 140px}.op-end h3{font:700 44px/1.1 ${F};letter-spacing:-.03em;margin:0 0 24px}`));
  const vh = () => root.clientHeight || 800; root.style.setProperty('--vh', vh() + 'px');
  const cave = h('div.op-cave', { html: `<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><filter id="opn"><feTurbulence type="fractalNoise" baseFrequency=".008 .02" numOctaves="5" seed="7"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .55  0 0 0 0 .56  0 0 0 2.4 -1.25"/></filter><filter id="opn2"><feTurbulence type="turbulence" baseFrequency=".012 .004" numOctaves="4" seed="3"/><feColorMatrix values="0 0 0 0 .8  0 0 0 0 .8  0 0 0 0 .82  0 0 0 -3 1.6"/></filter><rect width="1440" height="900" filter="url(#opn)"/><rect width="1440" height="900" filter="url(#opn2)" opacity=".35"/></svg>` });
  // odometer
  let base = 628491618, extra = 0; const odo = h('div.op-odo');
  const digits = () => { const n = String(base + extra).padStart(9, '0'); return n.replace(/(\d{3})(\d{3})(\d{3})/, '$1,$2,$3'); };
  const cols = []; digits().split('').forEach((c) => { if (c === ',') { odo.append(h('span.sep', {}, ',')); return; } const strip = h('div', {}, [...'0123456789'].map((d) => h('span', {}, d))); cols.push(strip); odo.append(h('span.c', {}, strip)); });
  const paint = () => { const ds = digits().replace(/,/g, ''); cols.forEach((s2, i) => (s2.style.transform = `translateY(${-18 * +ds[i]}px)`)); };
  const pill = h('div.op-pill', {}, odo, 'hours saved with Opal');
  // scroll word reveal
  const SAY = '5 to 6 hours. That’s the average time you’ll spend on your phone today — often without realizing. It’s time to fight back.'.split(' ');
  const words = SAY.map((w) => h('span', {}, w + ' ')), say = h('div.op-say', {}, h('div.stk', {}, h('p', {}, words)));
  const reveal = () => { const r = say.getBoundingClientRect(), rr = root.getBoundingClientRect(), p = clamp((rr.top - r.top) / (say.offsetHeight - vh()), 0, 1); const n = Math.round(p * 1.15 * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); return n; };
  // features
  let rules = [true, false, true, false], timer = 0, tmLeft = 25 * 60, tmId = 0; const tiles = h('div.op-tiles'), tmRing = h('div.ring', { style: { width: '190px', height: '190px', borderRadius: '50%', display: 'grid', placeItems: 'center', font: `700 40px ${F}` } }), tmBtn = h('button', { onclick: () => startT() }, 'Start Focus');
  const drawTiles = () => tiles.replaceChildren(...[['Morning Focus', '9:00 – 12:00'], ['No Social', 'All day'], ['Deep Work', 'Weekdays'], ['Wind Down', '22:00 – 7:00']].map(([t, d], i) => h('div' + (rules[i] ? '.on' : ''), { onclick: () => { rules[i] = !rules[i]; drawTiles(); } }, (rules[i] ? '🔒 ' : '○ ') + t, h('small', {}, rules[i] ? `Blocking · ${d}` : 'Off'))));
  const drawT = () => { const p = 1 - tmLeft / 1500; tmRing.style.background = `radial-gradient(closest-side,#0b0b0c 86%,transparent 87%),conic-gradient(#ffb547 ${p * 360}deg,#26262a 0)`; tmRing.textContent = `${String(Math.floor(tmLeft / 60)).padStart(2, '0')}:${String(tmLeft % 60).padStart(2, '0')}`; };
  const startT = () => { if (tmId) { clearInterval(tmId); tmId = 0; tmBtn.textContent = 'Start Focus'; return; } tmBtn.textContent = 'Give up'; tmId = setInterval(() => { tmLeft = Math.max(0, tmLeft - 15); drawT(); if (!tmLeft) startT(); }, 60); };
  const phone = (glow, ...kids) => h('div.ph', {}, h('div.op-glow', { style: { background: glow } }), h('div.op-ph', {}, h('div', { style: { display: 'flex', justifyContent: 'space-between', font: `600 12px ${F}`, color: '#fff', marginTop: '-30px', marginBottom: '20px' } }, '9:41', '●●●'), ...kids));
  const feat = (tag, t, p, ph, rv) => h('div.op-ft' + (rv ? '.rv' : ''), {}, ph, h('div', {}, h('span.op-tag', {}, tag + ' ®'), h('h3', {}, t), h('p', {}, p)));
  const GEMS = [['Soulful', '#ff7ab6'], ['Committed', '#7ad7ff'], ['Driven', '#ffb547'], ['Unwavering', '#9d7aff'], ['Motivated', '#5cf2a6'], ['Loyal', '#ff6a5c'], ['Determined', '#ffe15c'], ['Skilled', '#5cb8ff'], ['Diligent', '#c3ff5c'], ['First', '#ffffff'], ['Original', '#ff9a5c'], ['Dutiful', '#5cffe1'], ['Balanced', '#e05cff'], ['Devoted', '#ff5c8a'], ['Popular', '#ffd27a']];
  const HOL = [['Earth', '#4fd38a'], ['Easter', '#f7b2ff'], ['Holi', '#ff5cd1'], ['Love', '#ff4d6d'], ['Passover', '#8ab4ff'], ['Ramadan', '#ffd27a'], ['Spring', '#9effa8'], ['Summer', '#ffb347'], ['Winter', '#bfe8ff']];
  const gem = ([n, c], k) => h('div.op-gem', { onclick: () => toast(`${n} Gem — unlocked after ${(k % 9 + 1) * 10} focus hours`) }, h('i', { style: { '--g': c, background: `linear-gradient(160deg,#fff 0 8%,${c} 30%,#000 60%,${c} 85%)` } }), `${n} Gem`);
  const row = (L, r) => h('div.op-row' + (r ? '.r' : ''), {}, [...L, ...L].map(gem));
  const cnt = (el, to, fmt) => { const t1 = performance.now(); const f = (now) => { const p = clamp((now - t1) / 1400, 0, 1), e = 1 - (1 - p) ** 3; el.textContent = fmt(Math.round(to * e)); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  const pcts = [[94, 'Less distracted', 'Stay focused and minimize disruptions with proven, effective results.'], [93, 'More productive', 'Achieve significantly more each day with enhanced efficiency.'], [90, 'Improved mental health', 'Experience a substantial boost in mental well-being and overall life balance.']];
  const pctEls = pcts.map(() => h('b', {}, '0%')); const minEl = h('div', {}, '0h 00m'); let counted = false;
  const stats = h('div.op-stats', {}, h('h4', {}, 'Average time saved thanks to Opal'), h('div.op-big', {}, h('div', {}, minEl, h('small', {}, 'saved daily')), h('div', {}, '1 month', h('small', {}, 'saved each year')), h('div', {}, '6 years', h('small', {}, 'of life reclaimed'))),
    h('div', { style: { fontSize: '11px', color: '#ffffff55', marginTop: '18px' } }, '*Calculated on the basis of daily Screen Time before and after Opal for over N=300,000'),
    h('div.op-pct', {}, pcts.map(([, t, d], i) => h('div', {}, pctEls[i], h('em', {}, t), h('span', {}, d)))));
  const countUp = () => { counted = true; cnt(minEl, 83, (v) => `${Math.floor(v / 60)}h ${String(v % 60).padStart(2, '0')}m`); pcts.forEach(([v], i) => cnt(pctEls[i], v, (x) => x + '%')); };
  new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !counted) countUp(); }), { root, threshold: .35 }).observe(stats);
  const op = h('div.op', {}, h('div.op-nav', {}, h('span.lg', {}, h('i'), 'pal'), ...['Our Story', 'Use Cases', 'Pricing', 'For Schools', 'Support'].map((t) => h('a', { onclick: () => toast(t) }, t)), h('button.op-try', { onclick: () => toast('Try Opal free (demo)') }, 'Try for free')),
    h('div.op-hero', {}, cave, h('div.in', {}, h('h1', { html: 'Attention<br>on autopilot.' }), h('p', {}, 'Opal protects your focus automatically, so you can make technology work for you, not against you.'),
      h('div.op-bd', {}, [['', 'Download on the', 'App Store'], ['▶', 'GET IT ON', 'Google Play'], ['▭', 'Download for', 'for macOS']].map(([i, s1, s2]) => h('button', { onclick: () => toast(s2 + ' (demo)') }, h('span', { style: { fontSize: '20px' } }, i), h('span', {}, h('small', {}, s1), s2.replace('for for', 'for'))))),
      h('div.op-aw', {}, h('div.la', {}, h('span', {}, '❦'), h('div', { html: 'Apple Design Awards<br>Social Impact' }), h('span', { style: { transform: 'scaleX(-1)' } }, '❦')), h('div', {}, h('b', {}, '4.8'), h('span.st', {}, '★★★★★'), h('div', { style: { letterSpacing: '.1em' } }, '150K+ APP RATINGS'))))),
    h('div.op-vid', {}, h('div.l', { onclick: () => toast('Launch video (demo)') }, '▶  Watch our new launch video'), h('div.op-vc', { onclick: () => toast('Launch video (demo)') })),
    say,
    feat('Opal Score', 'Your day in one score', 'Opal Score combines signals from your sleep, focus, and rest into a single measure of how technology aligns with your wellbeing.', phone('radial-gradient(#d4ff5c,transparent 70%)', h('div.op-sc', {}, h('div.ring', { style: { background: 'radial-gradient(closest-side,#0b0b0c 84%,transparent 85%),conic-gradient(#c8ff5c 306deg,#26262a 0)' } }, '85'), h('small', { style: { marginTop: '14px' } }, 'Opal Score · Great'), h('small', {}, 'Sleep 7h 40m · Focus 3h 12m')))),
    feat('Focus Rules', 'Set your Rules', 'Take control of your day by blocking the apps of your choice, whether it’s on your phone or desktop.', phone('radial-gradient(#5cf2a6,transparent 70%)', h('div', { style: { font: `700 20px ${F}` } }, 'Rules'), tiles), true),
    feat('Focus Timer', 'Tap into focus', 'Choose what you want to focus on, set the length, and lock in until the timer runs out.', phone('radial-gradient(#ffb547,transparent 70%)', h('div.op-tm', {}, h('small', { style: { color: '#ffffff90' } }, 'Deep Work · 25 min'), tmRing, tmBtn))),
    h('div.op-gm', {}, h('span.op-tag', {}, 'Focus Gems ®'), h('h3', {}, 'Unlock precious Milestones'), h('p', { style: { color: '#ffffffa0', margin: 0 } }, 'Discover beautiful rewards that celebrate every moment of focus'), h('div.op-mq', {}, row(GEMS, false), row(HOL, true))),
    stats, h('div.op-end', {}, h('h3', { html: 'Available on iPhone,<br>Mac and Android' }), h('button.op-try', { style: { height: '46px', padding: '0 26px', fontSize: '15px' }, onclick: () => toast('Try Opal free (demo)') }, 'Try for free')), pill);
  root.append(op); drawTiles(); drawT(); paint();
  const onScroll = () => { extra = Math.floor(root.scrollTop / 9); paint(); reveal(); }; root.addEventListener('scroll', onScroll, { passive: true });
  const live = setInterval(() => { base += 1; paint(); }, 2600);
  window.__demoProof = async () => { const out = [], d0 = digits(); root.scrollTop = say.offsetTop + (say.offsetHeight - vh()) * .45; onScroll(); await sleep(60); const n1 = words.filter((w) => w.classList.contains('on')).length;
    out.push(`odometer ${d0} → ${digits()} rolled=${d0 !== digits()}`); out.push(`word reveal ${n1}/${words.length} white at 45%`);
    root.scrollTop = say.offsetTop + say.offsetHeight; onScroll(); await sleep(40); out.push(`all words=${words.every((w) => w.classList.contains('on'))}`);
    rules[1] = true; drawTiles(); out.push(`rule toggle on=${tiles.querySelectorAll('.on').length}`); rules = [true, false, true, false]; drawTiles();
    startT(); await sleep(250); out.push(`timer running ${tmRing.textContent}`); startT(); tmLeft = 1500; drawT();
    countUp(); await sleep(1500); out.push(`stats ${minEl.textContent} / ${pctEls.map((e) => e.textContent).join(' ')}`); out.push(`gems=${op.querySelectorAll('.op-gem').length}`);
    root.scrollTop = 0; onScroll(); return out.join('; ') + '; restored'; };
};
V['polestar-4-configurator-swatch-gallery-price-rail'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#101010', ac: '#ff7500', dark: false }); scroll(root);
  // Stand-in for Polestar Unica: Inter Variable with tight tracking
  const F = "'Inter Variable','Helvetica Neue',Arial,sans-serif", OR = '#ff7500', INK = '#101010', MU = '#6e6e6e', LN = '#d9d9d9';
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const MOT = [['rear', 'Rear motor', 31400, 56400, ['Power¹: 200 kW / 272 hp', '0–60 mph¹: 6.9 seconds', 'Torque¹: 253 lb-ft', 'Range up to¹ ²: 310 mi (EPA)'], ['20-inch Aero wheels', 'Dynamic standard chassis', 'Anodized brake callipers']],
    ['dual', 'Dual motor', 37900, 62900, ['Power¹: 400 kW / 544 hp', '0–60 mph¹: 3.6 seconds', 'Torque¹: 506 lb-ft', 'Range up to¹ ²: 300 mi (EPA)'], ['20-inch Aero wheels', 'Dual-motor all-wheel drive', 'Anodized brake callipers']]];
  // [id, name, hex, price, matte, description]
  const COL = [['lightning', 'Lightning', '#c3c5c7', 0, 0, 'Silver metallic. Sharp and technical, with a cool, reflective finish.'], ['aurora', 'Aurora', '#aebab8', 1300, 0, 'Green-grey metallic. Inspired by the northern lights, subtle and calm.'],
    ['stratus', 'Stratus', '#6a707a', 1300, 0, 'Blue-grey metallic. Deep and atmospheric, like a dense cloud layer.'], ['space', 'Space', '#0b0b0c', 1300, 0, 'Black metallic. Dark and intense, with a deep, glossy finish.'],
    ['ozone', 'Ozone', '#aab1c9', 1300, 0, 'Lavender metallic. Fresh and light, with a soft violet undertone.'], ['snow', 'Snow', '#f1f1ef', 1300, 0, 'White metallic. Modern, pure, with a luxurious multi-layered pearl effect.'],
    ['electron', 'Electron', '#b7bdd3', 2000, 1, 'Matte lavender. A satin finish with a calm, technical character.'], ['magnesium', 'Magnesium', '#7d8184', 2000, 1, 'Matte grey. Industrial and raw, with a soft-touch satin finish.']];
  const WHL = [['aero', '20" Aero', 'Cast alloy and diamond cut', 0, 0, ''], ['sport', '21" Sport', 'Forged alloy and laser-etched', 1800, 0, ''], ['perf', '22" Performance', 'Forged alloy and laser-etched', 0, 1, 'Range up to: 255 mi']];
  const INT = [['charcoal', 'Charcoal Embossed Textile', '#2c2d2f', 0], ['zinc', 'Zinc Bio-attributed MicroTech', '#9b9a96', 0], ['nappa', 'Charcoal Nappa leather', '#1b1b1c', 4000]];
  const PACK = [['plus', 'Plus pack', 4000, 'Harman Kardon audio, Pixel LED headlights, 22-speaker system'], ['perf', 'Performance pack', 2000, 'Brembo brakes, Öhlins dampers, Swedish gold details, 22" wheels']];
  const DEST = 1400; const DEF = { m: 'rear', c: 'lightning', w: 'aero', i: 'charcoal', p: [] };
  let st = { ...DEF, p: [] };
  try { const q = new URLSearchParams(location.search).get('state'); if (q) st = { ...DEF, ...JSON.parse(atob(q)) }; } catch {}
  const price = (s2) => MOT.find((m) => m[0] === s2.m)[2] + COL.find((c) => c[0] === s2.c)[3] + WHL.find((w) => w[0] === s2.w)[3] + INT.find((i) => i[0] === s2.i)[3] + s2.p.reduce((a, k) => a + PACK.find((p) => p[0] === k)[2], 0) + DEST;
  root.append(h('style', {}, `.ps{font:400 14px/1.35 ${F};color:${INK};background:#fff;letter-spacing:-.012em;-webkit-font-smoothing:antialiased;min-height:100%}
.ps button{font:inherit;letter-spacing:inherit;color:inherit}
.ps-nav{position:sticky;top:0;z-index:20;height:58px;background:#fff;border-bottom:1px solid #e6e6e6;display:flex;align-items:center;padding:0 max(88px,calc(50% - 632px));gap:26px}
.ps-nav b{font:400 25px ${F};letter-spacing:-.04em;margin-right:auto}.ps-nav a{font-size:14px;cursor:pointer}.ps-nav a:hover{text-decoration:underline}.ps-nav .ic{width:18px;text-align:center;cursor:pointer}
.ps-main{display:grid;grid-template-columns:1fr 392px;gap:24px;padding:20px 24px 0 24px;max-width:1500px;margin:0 auto}
.ps-stage{position:sticky;top:78px;height:calc(var(--vh) - 98px);background:#efefef;overflow:hidden}
.ps-view{position:absolute;inset:0;display:grid;place-items:center;transition:opacity .55s}.ps-car{width:88%;transition:transform .8s cubic-bezier(.3,.7,.2,1);transform-origin:50% 50%}
.ps-car .bd{transition:fill .6s}.ps-int{opacity:0;pointer-events:none}
.ps-arr{position:absolute;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:50%;border:0;background:#fff;box-shadow:0 1px 4px #0002;cursor:pointer;font-size:16px;z-index:3;display:grid;place-items:center}.ps-arr:hover{background:#f6f6f6}
.ps-pg{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:flex;gap:4px;z-index:3}.ps-pg span{width:24px;height:22px;display:grid;place-items:center;font-size:11px;color:${MU};cursor:pointer;border-bottom:2px solid transparent}.ps-pg span.on{color:${INK};border-color:${INK}}
.ps-col{position:relative;padding:6px 0 0}.ps-col h1{font:400 26px/1.1 ${F};letter-spacing:-.035em;margin:0 0 20px}.ps-col .ey{font-size:14px;margin-bottom:2px}
.ps-card{border:1px solid ${LN};padding:16px 12px 16px 12px;margin:0 6px 8px;cursor:pointer;transition:border-color .2s,background .2s;position:relative}.ps-card:hover{border-color:#999}.ps-card.on{border-color:${OR};background:#f5f5f5;box-shadow:inset 0 0 0 1px ${OR}}
.ps-card .tp{display:flex;justify-content:space-between;align-items:flex-start}.ps-card .pr{text-align:right}.ps-card .pr s{color:${MU};display:block}.ps-tag{display:inline-block;background:#ececec;font-size:10px;padding:2px 6px;margin-bottom:4px}
.ps-card .sp{margin-top:14px;color:${MU};font-size:13.5px;line-height:1.1}.ps-card .sp b{font-weight:400;color:${INK}}.ps-card ul{margin:18px 0 14px;padding-left:12px;color:${MU};font-size:13.5px;line-height:1.1}.ps-card u{color:${MU};font-size:13.5px}
.ps-lk{display:flex;gap:8px;align-items:center;margin:16px 6px 18px;cursor:pointer}.ps-lk:hover{text-decoration:underline}
.ps-off{background:#ececec;margin:0 6px;padding:24px 26px 30px}.ps-off h3{font:400 21px/1.15 ${F};letter-spacing:-.03em;margin:0 0 12px}
.ps-sec{margin:0 6px;padding:34px 0 30px;border-top:1px solid #c9c9c9}.ps-sec:first-of-type{border:0}.ps-sec h2{font:400 26px ${F};letter-spacing:-.035em;margin:0 0 12px}.ps-sec .sub{color:${MU};font-size:13.5px;margin:10px 0 8px}.ps-sec .sub u{color:${INK};cursor:pointer}
.ps-sw{display:flex;gap:6px;flex-wrap:wrap}.ps-sw button{width:56px;height:56px;border:0;padding:0;cursor:pointer;position:relative;outline-offset:0;box-shadow:inset 0 0 0 1px #0000000d}.ps-sw button.on{outline:2px solid ${OR};outline-offset:-1px;box-shadow:inset 0 0 0 3px #fff}
.ps-sw button.lock:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(135deg,#ffffff00 0 6px,#ffffff28 6px 7px)}
.ps-sel{display:grid;grid-template-columns:1fr auto;gap:16px;margin-top:18px}.ps-sel div{color:${MU};font-size:13.5px}.ps-sel b{font-weight:400;color:${INK};display:block}
.ps-wh{display:grid;grid-template-columns:96px 1fr;border:1px solid ${LN};margin-bottom:8px;cursor:pointer;min-height:96px;transition:border-color .2s}.ps-wh:hover{border-color:#999}.ps-wh.on{border-color:${OR};box-shadow:inset 0 0 0 1px ${OR};background:#f6f6f6}
.ps-wh .th{background:#ddd;overflow:hidden}.ps-wh .tx{padding:12px 12px 10px;display:flex;flex-direction:column;color:${MU};font-size:13.5px;line-height:1.1}.ps-wh .tx b{font-weight:400;color:${INK}}.ps-wh .tx .r{margin-top:auto;text-align:right;color:${INK}}
.ps-pk{display:flex;justify-content:space-between;gap:12px;border:1px solid ${LN};padding:14px 12px;margin-bottom:8px;cursor:pointer}.ps-pk.on{border-color:${OR};box-shadow:inset 0 0 0 1px ${OR};background:#f6f6f6}.ps-pk div div{color:${MU};font-size:13px;margin-top:6px;max-width:250px}
.ps-rail{position:sticky;bottom:0;z-index:5;background:#fff;border-top:1px solid #c9c9c9;padding:16px 0 18px;margin-top:20px}
.ps-rl{display:flex;justify-content:space-between;align-items:flex-start;min-height:34px}.ps-rl .l{color:${MU}}.ps-rl .l div{color:${INK}}.ps-rl .r{text-align:right}.ps-rl .r u{color:${MU};cursor:pointer;display:block}
.ps-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.ps-btns button{height:40px;border:1px solid ${INK};background:#fff;text-align:left;padding:0 12px;cursor:pointer;display:flex;align-items:center;gap:8px}.ps-btns .go{background:${INK};color:#fff}.ps-btns .go i{color:${OR};font-style:normal}
.ps-btns .go:disabled{background:#9a9a9a;border-color:#9a9a9a;color:#ddd;cursor:default}
.ps-sk{display:inline-block;height:12px;border-radius:1px;background:linear-gradient(90deg,#e8e8e8 0,#f6f6f6 40%,#e8e8e8 80%) 0 0/200% 100%;animation:pssk 1s linear infinite;vertical-align:middle}@keyframes pssk{to{background-position:-200% 0}}
.ps-spin{width:10px;height:10px;border:1.5px solid #ddd;border-top-color:transparent;border-radius:50%;animation:psrot .7s linear infinite;display:inline-block}@keyframes psrot{to{transform:rotate(1turn)}}
.ps-help{position:fixed;right:20px;bottom:118px;z-index:9;width:40px;height:40px;border-radius:50%;background:#333;color:#fff;border:0;display:grid;place-items:center;cursor:pointer;font-size:16px}
.ps-dr{position:fixed;inset:var(--tg-h,0px) 0 0 0;z-index:40;pointer-events:none}.ps-dr .bg{position:absolute;inset:0;background:#000b;opacity:0;transition:opacity .4s}.ps-dr .pn{position:absolute;right:0;top:0;bottom:0;width:640px;background:#fff;transform:translateX(100%);transition:transform .5s cubic-bezier(.3,.7,.2,1);padding:70px 26px 30px;overflow:auto}
.ps-dr.on{pointer-events:auto}.ps-dr.on .bg{opacity:1}.ps-dr.on .pn{transform:none}.ps-dr h3{font:400 26px ${F};letter-spacing:-.035em;margin:0 0 22px}.ps-dr input{width:100%;height:40px;border:0;border-bottom:1px solid #999;background:#f1f1f1;font:inherit;padding:0 12px;margin:6px 0 16px;box-sizing:border-box}
.ps-dr .rt{display:flex;justify-content:space-between;border-bottom:1px solid #e3e3e3;padding:14px 0;cursor:pointer}.ps-dr .rt:hover{background:#fafafa}.ps-dr .rt span{color:${MU}}.ps-dr .x{position:absolute;right:22px;top:20px;border:0;background:none;font-size:24px;cursor:pointer}`));
  root.style.setProperty('--vh', (root.clientHeight || 860) + 'px');
  // --- car (side profile SVG, body recolourable) ---
  const rim = (cx, cy, kind) => { const sp = []; const R = 46;
    if (kind === 'aero') { for (let k = 0; k < 5; k++) { const a = k * 72; sp.push(`<path transform="rotate(${a} ${cx} ${cy})" d="M${cx - 7},${cy - 12} L${cx - 13},${cy - R + 5} A${R - 4},${R - 4} 0 0 1 ${cx + 17},${cy - R + 7} L${cx + 7},${cy - 12} Z" fill="#26282a"/>`); } return `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#c9ccce"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#psRim)"/>${sp.join('')}<circle cx="${cx}" cy="${cy}" r="10" fill="#303234"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#8d9092" stroke-width="2"/>`; }
    const dark = kind === 'perf'; for (let k = 0; k < 6; k++) { const a = k * 60; sp.push(`<g transform="rotate(${a} ${cx} ${cy})"><path d="M${cx - 3},${cy - 9} L${cx - 9},${cy - R + 3} L${cx - 2},${cy - R + 3} L${cx + 3},${cy - 9}Z" fill="${dark ? '#3a3c3e' : '#d7d9db'}"/><path d="M${cx + 3},${cy - 9} L${cx + 9},${cy - R + 3} L${cx + 15},${cy - R + 5} L${cx + 6},${cy - 8}Z" fill="${dark ? '#55585a' : '#9da0a3'}"/></g>`); }
    return `${dark ? `<rect x="${cx + 8}" y="${cy - 34}" width="22" height="30" rx="5" fill="#e6a531"/>` : ''}<circle cx="${cx}" cy="${cy}" r="${R}" fill="${dark ? '#121314' : '#1c1d1f'}"/>${dark ? `<rect x="${cx + 8}" y="${cy - 34}" width="22" height="30" rx="5" fill="#e6a531" opacity=".9"/>` : ''}${sp.join('')}<circle cx="${cx}" cy="${cy}" r="9" fill="#111"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#5a5d60" stroke-width="2"/>`; };
  const wheel = (cx, cy, kind) => `<g class="wh"><circle cx="${cx}" cy="${cy}" r="63" fill="#151515"/><circle cx="${cx}" cy="${cy}" r="60" fill="none" stroke="#2a2a2a" stroke-width="3"/>${rim(cx, cy, kind)}</g>`;
  const BODY = 'M70,292 L72,256 Q76,234 118,226 L300,199 Q362,160 432,141 Q522,124 612,130 Q724,141 832,187 L884,200 Q906,207 909,234 L905,292 L828,292 A68,68 0 0 0 692,292 L298,292 A68,68 0 0 0 162,292 Z';
  const carSvg = (col, wk) => `<svg viewBox="40 90 900 290" class="ps-car"><defs><linearGradient id="psSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".32" stop-color="#fff" stop-opacity=".08"/><stop offset=".55" stop-color="#000" stop-opacity=".02"/><stop offset=".72" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
<radialGradient id="psRim"><stop offset=".2" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#000" stop-opacity=".15"/></radialGradient><radialGradient id="psFl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="490" cy="350" rx="460" ry="22" fill="url(#psFl)"/>
<path d="M150,300 A80,80 0 0 1 310,300 Z M680,300 A80,80 0 0 1 840,300 Z" fill="#0d0d0d"/>
<path class="bd" d="${BODY}" fill="${col}"/><path d="${BODY}" fill="url(#psSh)"/>
<path d="M298,270 L692,266 L692,292 L298,292 Z M70,276 L162,280 L162,292 L70,292 Z M828,280 L907,274 L905,292 L828,292 Z" fill="#161616"/>
<path d="M334,197 Q384,163 442,149 Q522,135 602,139 Q692,147 782,183 L772,191 L344,203 Z" fill="#131416"/><path d="M350,198 Q392,170 444,156 L470,152 L452,199 Z" fill="#2b2e33" opacity=".75"/>
<path d="M556,140 L548,201" stroke="${col}" stroke-width="7" opacity=".9"/><path d="M300,199 L338,201" stroke="#0005" stroke-width="1.2"/>
<path d="M330,206 L330,268 M548,203 L552,266 M760,196 L770,232" stroke="#0004" stroke-width="1.3" fill="none"/>
<rect x="452" y="214" width="34" height="5" rx="2.5" fill="#0003"/><rect x="664" y="212" width="32" height="5" rx="2.5" fill="#0003"/>
<path d="M78,240 Q100,234 136,232 L132,238 Q102,240 80,246 Z" fill="#f4f4f4" stroke="#0006" stroke-width="1"/><path d="M84,252 L116,250" stroke="#ddd" stroke-width="2"/>
<path d="M872,206 L905,214 L905,219 L872,212 Z" fill="#d1121e"/><path d="M886,232 L907,232" stroke="#0005"/>
<path d="M610,250 Q640,244 690,246" stroke="#ffffff55" stroke-width="2" fill="none"/><text x="600" y="246" font-size="7" fill="#0005" font-family="${F}">POLESTAR</text>
${wheel(230, 300, wk)}${wheel(760, 300, wk)}</svg>`;
  const intSvg = (c) => `<svg viewBox="0 0 900 520" style="width:94%"><defs><linearGradient id="psCab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4c50"/><stop offset="1" stop-color="#1b1c1e"/></linearGradient></defs>
<rect width="900" height="520" fill="url(#psCab)"/><path d="M0,250 Q450,170 900,250 L900,320 L0,320Z" fill="#232427"/><rect x="330" y="180" width="240" height="140" rx="10" fill="#0c0d0f" stroke="#555" stroke-width="2"/><rect x="342" y="192" width="216" height="116" rx="5" fill="#16202c"/>
<text x="360" y="230" fill="#9fb4cc" font-size="16" font-family="${F}">Polestar 4</text><text x="360" y="258" fill="#fff" font-size="26" font-family="${F}">310 mi</text><rect x="360" y="276" width="160" height="5" rx="2" fill="#2b3a4c"/><rect x="360" y="276" width="118" height="5" rx="2" fill="${OR}"/>
<path d="M90,520 Q100,330 230,320 L330,330 Q380,360 360,520Z M810,520 Q800,330 670,320 L570,330 Q520,360 540,520Z" fill="${c}"/><path d="M120,520 Q130,360 230,350 L310,358 Q340,380 330,520Z M780,520 Q770,360 670,350 L590,358 Q560,380 570,520Z" fill="#fff" opacity=".07"/>
<circle cx="250" cy="300" r="70" fill="none" stroke="#111" stroke-width="16"/><rect x="200" y="292" width="100" height="14" rx="7" fill="#111"/><path d="M0,190 Q450,120 900,190" stroke="#e6a531" stroke-width="2" fill="none" opacity=".0"/></svg>`;
  // views: [transform for car, interior?]
  const VIEWS = [['scale(1)', 0], ['scaleX(-1)', 0], ['scale(3.1) translate(28.9%,-22%)', 0], ['scale(2.6) translate(42%,-2%)', 0], ['scale(2.2) translate(-8%,22%)', 0], ['scaleX(-1) scale(2.8) translate(-44%,7%)', 0], ['', 1], ['', 1], ['scale(1.6) translate(-14%,4%)', 0]];
  let view = 0; const carV = h('div.ps-view'), intV = h('div.ps-view.ps-int');
  const pager = h('div.ps-pg', {}, VIEWS.map((_, i) => h('span', { onclick: () => go(i) }, String(i + 1))));
  const stage = h('div.ps-stage', {}, carV, intV, h('button.ps-arr', { style: { left: '14px' }, title: 'Previous', onclick: () => go((view + VIEWS.length - 1) % VIEWS.length) }, '‹'), h('button.ps-arr', { style: { right: '14px' }, title: 'Next', onclick: () => go((view + 1) % VIEWS.length) }, '›'), pager);
  const drawCar = () => { const c = COL.find((x) => x[0] === st.c); const old = carV.querySelector('.bd'); if (old && carV.dataset.w === st.w) { old.setAttribute('fill', c[2]); carV.querySelector('path[stroke-width="7"]').setAttribute('stroke', c[2]); } else { carV.innerHTML = carSvg(c[2], st.w); carV.dataset.w = st.w; }
    intV.innerHTML = intSvg(INT.find((x) => x[0] === st.i)[2]); applyView(); };
  const applyView = () => { const [tf, inn] = VIEWS[view]; const car = carV.querySelector('.ps-car'); if (car && !inn) car.style.transform = tf; carV.style.opacity = inn ? 0 : 1; intV.style.opacity = inn ? 1 : 0; [...pager.children].forEach((p, i) => p.classList.toggle('on', i === view)); };
  const go = (i) => { view = i; applyView(); };
  // --- price rail with skeleton ---
  const prEl = h('b', { style: { fontWeight: 400 } }), delEl = h('div', {}, 'Delivered by retailer');
  const goBtn = h('button.go', { onclick: () => dr.classList.add('on') }, 'Continue ', h('i', {}, '→'));
  let busy = 0, shown = price(st);
  const rail = h('div.ps-rail', {}, h('div.ps-rl', {}, h('div.l', {}, 'Estimated delivery', delEl), h('div.r', {}, prEl, h('u', { onclick: () => toast('Change payment: Lease · Loan · Cash (demo)') }, 'Change payment'))),
    h('div.ps-btns', {}, h('button', { onclick: () => toast('Ask a question — a Polestar specialist will reply (demo)') }, 'Ask a question ', h('span', { style: { fontSize: '18px', lineHeight: 0 } }, '+')), goBtn));
  const paintPrice = () => { if (busy) { prEl.replaceChildren(h('span.ps-sk', { style: { width: '62px' } })); delEl.replaceChildren(h('span.ps-sk', { style: { width: '48px' } })); goBtn.disabled = true; goBtn.replaceChildren('Continue ', h('span.ps-spin')); }
    else { prEl.textContent = fmt(shown); delEl.textContent = 'Delivered by retailer'; goBtn.disabled = false; goBtn.replaceChildren('Continue ', h('i', {}, '→')); } };
  let recalcT = 0; const recalc = () => { busy = 1; paintPrice(); clearTimeout(recalcT); recalcT = setTimeout(() => { busy = 0; shown = price(st); paintPrice(); }, 700); };
  // --- options column ---
  const motorBox = h('div'), colBox = h('div'), whBox = h('div'), intBox = h('div'), pkBox = h('div');
  const hasPerf = () => st.p.includes('perf');
  const save = () => { const q = btoa(JSON.stringify(st)); history.replaceState(null, '', JSON.stringify(st) === JSON.stringify(DEF) ? location.pathname : `?state=${q}`); };
  const set = (patch, jumpTo) => { Object.assign(st, patch); if (!hasPerf() && (COL.find((c) => c[0] === st.c)[4] || st.w === 'perf')) { st.p = [...st.p, 'perf']; toast('Performance pack added'); }
    if (patch.p && !hasPerf()) { if (COL.find((c) => c[0] === st.c)[4]) st.c = 'lightning'; if (st.w === 'perf') st.w = 'aero'; }
    draw(); drawCar(); if (jumpTo != null) go(jumpTo); recalc(); save(); };
  const draw = () => {
    motorBox.replaceChildren(...MOT.map(([id, n, p, was, specs, feat]) => h('div.ps-card' + (st.m === id ? '.on' : ''), { onclick: () => st.m !== id && set({ m: id }) }, h('div.tp', {}, h('div', {}, n), h('div.pr', {}, h('span.ps-tag', {}, 'Limited offer'), h('div', {}, fmt(p)), h('s', {}, fmt(was)))),
      st.m === id ? [h('div.sp', {}, specs.map((s2) => { const [k, v] = s2.split(': '); return h('div', {}, k + ': ', h('b', {}, v)); })), h('ul', {}, feat.map((f) => h('li', {}, f))), h('u', {}, 'Discover ' + n)] : null)));
    const c = COL.find((x) => x[0] === st.c);
    const sw = (L) => h('div.ps-sw', {}, L.map((x) => h('button' + (st.c === x[0] ? '.on' : '') + (x[4] && !hasPerf() ? '.lock' : ''), { title: x[1], 'aria-label': x[1], style: { background: x[2] }, onclick: () => st.c !== x[0] && set({ c: x[0] }, 0) })));
    colBox.replaceChildren(h('h2', {}, 'Exterior'), h('div.sub', { style: { marginTop: 0 } }, 'Metallic'), sw(COL.filter((x) => !x[4])), h('div.sub', { style: { marginTop: '18px' } }, 'Matte', h('br'), 'Only available with ', h('u', { onclick: () => set({ p: hasPerf() ? st.p : [...st.p, 'perf'] }) }, 'Performance'), ' pack'), sw(COL.filter((x) => x[4])),
      h('div.ps-sel', {}, h('div', {}, h('b', {}, c[1]), c[5]), h('div', { style: { color: INK } }, c[3] ? fmt(c[3]) : 'Included')));
    whBox.replaceChildren(h('h2', {}, 'Wheels'), ...WHL.map(([id, n, d, p, perf, x], k) => [perf ? h('div.sub', {}, 'Only available with ', h('u', {}, 'Performance'), ' pack') : null, h('div.ps-wh' + (st.w === id ? '.on' : ''), { onclick: () => set({ w: id }, 2) }, h('div.th', { html: `<svg viewBox="172 242 116 116" width="96" height="96">${wheel(230, 300, id)}</svg>` }), h('div.tx', {}, h('b', {}, n), d, x ? h('span', {}, x) : null, h('span.r', {}, p ? fmt(p) : perf ? 'Included with Performance pack' : 'Included')))]).flat().filter(Boolean));
    intBox.replaceChildren(h('h2', {}, 'Interior'), h('div.ps-sw', {}, INT.map(([id, n, hex]) => h('button' + (st.i === id ? '.on' : ''), { title: n, style: { background: `linear-gradient(135deg,${hex},${hex} 60%,#ffffff22)` }, onclick: () => set({ i: id }, 6) }))), h('div.ps-sel', {}, h('div', {}, h('b', {}, INT.find((x) => x[0] === st.i)[1]), 'Ventilated front seats, heated rear seats'), h('div', { style: { color: INK } }, INT.find((x) => x[0] === st.i)[3] ? fmt(INT.find((x) => x[0] === st.i)[3]) : 'Included')));
    pkBox.replaceChildren(h('h2', {}, 'Packs'), ...PACK.map(([id, n, p, d]) => h('div.ps-pk' + (st.p.includes(id) ? '.on' : ''), { onclick: () => set({ p: st.p.includes(id) ? st.p.filter((k) => k !== id) : [...st.p, id] }, id === 'perf' ? 2 : null) }, h('div', {}, n, h('div', {}, d)), h('span', {}, '+' + fmt(p)))));
  };
  const col = h('div.ps-col', {}, h('div.ey', {}, 'Configure'), h('h1', {}, 'Polestar 4 coupe'), motorBox, h('div.ps-lk', { onclick: () => toast('Compare specifications (demo)') }, '⇄', 'Compare specifications'),
    h('div.ps-off', {}, h('h3', {}, 'Explore lease and purchase offers. Combine limited-time incentives available until November 2nd.'), h('span', { style: { cursor: 'pointer' } }, 'Shop available cars ↗')), h('div', { style: { height: '60px' } }),
    h('div.ps-sec', {}, colBox), h('div.ps-sec', {}, whBox), h('div.ps-sec', {}, intBox), h('div.ps-sec', {}, pkBox), rail);
  const RT = [['Polestar Los Angeles', 'Santa Monica, CA'], ['Polestar San Francisco', 'San Francisco, CA'], ['Polestar New York', 'Manhattan, NY'], ['Polestar Miami', 'Miami, FL'], ['Polestar Chicago', 'Chicago, IL'], ['Polestar Austin', 'Austin, TX'], ['Polestar Seattle', 'Bellevue, WA']];
  const list = h('div'); const drawRt = (q = '') => list.replaceChildren(...RT.filter((r) => (r[0] + r[1]).toLowerCase().includes(q.toLowerCase())).map(([n, a]) => h('div.rt', { onclick: () => { dr.classList.remove('on'); toast(`${n} selected (demo)`); } }, n, h('span', {}, a))));
  const dr = h('div.ps-dr', {}, h('div.bg', { onclick: () => dr.classList.remove('on') }), h('div.pn', {}, h('button.x', { onclick: () => dr.classList.remove('on') }, '×'), h('div', { style: { fontSize: '11px' } }, 'Polestar 4 coupe'), h('h3', {}, 'Select retailer'), h('div', { style: { color: MU } }, 'Search for a location'), h('input', { oninput: (e) => drawRt(e.target.value) }), h('div', { style: { margin: '0 0 12px' } }, 'Use my location ', h('span', { style: { color: OR } }, '→')), list)); drawRt();
  const ps = h('div.ps', {}, h('div.ps-nav', {}, h('b', {}, 'Polestar'), ...['Polestar 2', 'Polestar 3', 'Polestar 4', 'Pre-owned', 'Shopping tools', 'Ownership', 'More'].map((t) => h('a', { onclick: () => toast(t + ' (demo)') }, t)), h('span.ic', { html: '<svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="#101010" stroke-width="1.4"><path d="M7 15s5-5.2 5-8.6A5 5 0 0 0 2 6.4C2 9.8 7 15 7 15z"/><circle cx="7" cy="6.4" r="1.8"/></svg>' }), h('span.ic', { html: '<svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="#101010" stroke-width="1.4"><circle cx="7" cy="5" r="3.2"/><path d="M1.5 15c.4-3.4 2.6-5 5.5-5s5.1 1.6 5.5 5z"/></svg>' })),
    h('div.ps-main', {}, stage, col), h('button.ps-help', { title: 'Help', onclick: () => toast('Chat with a Polestar specialist (demo)') }, '?'), dr);
  root.append(ps); draw(); drawCar(); paintPrice();
  addEventListener('keydown', (e) => { if (e.key === 'Escape') dr.classList.remove('on'); });
  window.__demoProof = async () => { const out = [], car = () => carV.querySelector('.bd').getAttribute('fill');
    out.push(`base price=${prEl.textContent} car=${car()}`);
    colBox.querySelector('button[title="Snow"]').click(); await sleep(80); out.push(`snow click → car=${car()} skeleton=${!!rail.querySelector('.ps-sk')} continueDisabled=${goBtn.disabled}`);
    await sleep(800); out.push(`recalc price=${prEl.textContent}`);
    whBox.querySelectorAll('.ps-wh')[1].click(); await sleep(900); out.push(`21in Sport → view=${view + 1} transform=${carV.querySelector('.ps-car').style.transform} price=${prEl.textContent}`);
    out.push(`url state=${location.search.startsWith('?state=')}`);
    colBox.querySelector('button[title="Electron"]').click(); await sleep(800); out.push(`matte → perf pack auto=${hasPerf()} price=${prEl.textContent}`);
    goBtn.click(); await sleep(100); out.push(`continue drawer=${dr.classList.contains('on')}`); dr.classList.remove('on');
    st = { ...DEF, p: [] }; clearTimeout(recalcT); busy = 0; shown = price(st); draw(); carV.innerHTML = ''; drawCar(); go(0); paintPrice(); save(); root.scrollTop = 0;
    return out.join('; ') + `; restored price=${prEl.textContent}`; };
};
V['mercury-demo-banking-dashboard-persona-tour'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#1e1f2a', ac: '#5266eb', dark: false });
  // Stand-in for Arcadia Text / arcadiaDisplay: DM Sans Variable
  const F = "'DM Sans Variable','Inter Variable',system-ui,sans-serif", BL = '#5266eb', INK = '#1e1f2a', MU = '#70707d', LN = '#e9e9ee', GR = '#188a4f';
  const money = (n, sign = false) => { const neg = n < 0, a = Math.abs(n), [i, c] = a.toFixed(2).split('.'); return h('span.mc-m', {}, (neg ? '−' : sign ? '' : '') + '$' + (+i).toLocaleString('en-US'), h('sup', {}, '.' + c)); };
  const moneyTxt = (n) => (n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  root.append(h('style', {}, `.mc{position:absolute;inset:0;display:grid;grid-template-rows:44px 1fr;font:400 14px/1.4 ${F};color:${INK};background:#fff;-webkit-font-smoothing:antialiased;letter-spacing:-.003em}
.mc button{font:inherit;color:inherit;cursor:pointer}.mc .mc-m sup{font-size:.58em;vertical-align:.62em;margin-left:1px}
.mc-top{background:#272830;color:#f1f1f5;display:flex;align-items:center;gap:12px;padding:0 38px 0 34px}.mc-top .lg{width:26px;height:26px;border-radius:50%;border:1.5px solid #ddd;display:grid;place-items:center;font-size:12px}.mc-top u{color:#c9c9d6;cursor:pointer;margin-left:8px}
.mc-top .va{margin-left:auto;background:#3a3b45;border:0;border-radius:99px;padding:5px 14px;color:#e4e4ea}.mc-top .oa{background:${BL};border:0;border-radius:99px;padding:6px 14px;color:#fff;font-weight:500}
.mc-body{display:grid;grid-template-columns:176px 1fr;min-height:0}
.mc-sb{border-right:1px solid ${LN};padding:8px 7px;overflow:auto;background:#fff;font-size:13.5px}.mc-sb .org{display:flex;align-items:center;gap:8px;padding:2px 2px 12px;font-weight:500;font-size:12.5px;white-space:nowrap}.mc-sb .org i{width:20px;height:20px;border-radius:5px;background:#1e1f2a;display:inline-block}.mc-sb .org b{margin-left:auto;background:#1e1f2a;color:#fff;font-size:11px;padding:1px 6px;border-radius:4px;font-weight:500}
.mc-seg{display:grid;grid-template-columns:1fr 1fr;background:#f0f0f3;border-radius:8px;padding:3px;margin-bottom:12px}.mc-seg button{border:0;background:none;border-radius:6px;padding:4px 0;font-size:13px;color:${MU}}.mc-seg button.on{background:#fff;color:${INK};box-shadow:0 1px 2px #0001}
.mc-ni{display:flex;align-items:center;gap:9px;padding:5px 6px;border-radius:7px;cursor:pointer;color:#33343f;margin-bottom:1px}.mc-ni:hover{background:#f4f4f6}.mc-ni.on{background:#ececf0;color:${INK};font-weight:500}.mc-ni .ic{width:14px;text-align:center;color:#6b6c78;font-size:11px}.mc-ni .ct{margin-left:auto;font-size:11px;color:${MU}}.mc-ni .nw{margin-left:auto;font-size:10.5px;background:#ececf0;border-radius:4px;padding:1px 6px}
.mc-ni.sub{padding-left:26px;font-size:13px;border-left:1px solid ${LN};margin-left:12px;border-radius:0 7px 7px 0}.mc-sb hr{border:0;border-top:1px solid ${LN};margin:10px -7px}.mc-sb .bm{font-size:11px;color:${MU};padding:12px 6px 6px;display:flex;justify-content:space-between}.mc-ni small{display:block;color:${MU};font-size:11.5px}
.mc-main{display:grid;grid-template-rows:44px 1fr;min-height:0;position:relative}.mc-bar{display:flex;align-items:center;gap:20px;padding:0 28px 0 18px;color:#33343f}.mc-bar input{border:0;outline:0;font:inherit;flex:1;color:${INK};background:none}.mc-bar .mm{margin-left:auto;display:flex;gap:6px;align-items:center;cursor:pointer}.mc-bar .ib{cursor:pointer;opacity:.75}.mc-bar .ib.on{opacity:1;color:${BL}}
.mc-av{width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 50% 36%,#e7c7a8 0 28%,transparent 29%),radial-gradient(ellipse at 50% 100%,#3a3f48 0 50%,transparent 51%),#cfd3da}
.mc-pg{overflow:auto;padding:16px 32px 80px}.mc-pg h1{font:400 25px/1.2 ${F};letter-spacing:-.015em;margin:14px 0 18px}
.mc-acts{display:flex;gap:8px;align-items:center;margin-bottom:18px}.mc-acts button{border:0;border-radius:99px;background:#efeff3;padding:6px 14px;font-size:13.5px;display:flex;gap:6px;align-items:center}.mc-acts button:hover{background:#e6e6ec}.mc-acts .pri{background:${BL};color:#fff}.mc-acts .pri:hover{background:#4256df}.mc-acts .cz{margin-left:auto;background:none}
.mc-grid{display:grid;grid-template-columns:1.45fr 1fr;gap:20px}.mc-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:20px}
.mc-cd{border:1px solid ${LN};border-radius:12px;padding:18px 20px;background:#fff;position:relative}.mc-cd .hd{display:flex;align-items:center;gap:8px;color:#33343f}.mc-cd .big{font:400 25px/1.2 ${F};letter-spacing:-.01em;margin:4px 0 12px}
.mc-tg{margin-left:auto;display:flex;border:1px solid ${LN};border-radius:8px;overflow:hidden}.mc-tg button{border:0;background:#fff;width:32px;height:30px;color:#555}.mc-tg button.on{background:#f0f0f6;color:${BL}}
.mc-dl{display:flex;justify-content:space-between;font-size:13px}.mc-dl .d{display:flex;gap:14px}.mc-ch{position:relative;height:150px;margin:14px -20px 0;cursor:crosshair}.mc-ch svg{width:100%;height:100%;display:block}.mc-ax{display:flex;justify-content:space-around;font-size:10.5px;color:${MU};padding:4px 30px 0}
.mc-tb{width:100%;border-collapse:collapse;font-size:12.5px;margin-top:8px}.mc-tb td{padding:5px 0;border-bottom:1px solid #f1f1f4}.mc-tb td:last-child{text-align:right}
.mc-ac{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:13.5px}.mc-ac i{width:22px;height:22px;border-radius:50%;border:1.5px solid #6b6c78;display:inline-block;background:repeating-radial-gradient(circle,#fff 0 2px,#6b6c78 2px 3px)}.mc-ac b{margin-left:auto;font-weight:400}
.mc-rnd{width:28px;height:28px;border-radius:50%;border:0;background:#f0f0f3;display:grid;place-items:center;font-size:12px}
.mc-bar2{height:7px;border-radius:9px;background:#e9e9f0;overflow:hidden;margin:6px 0 6px}.mc-bar2 i{display:block;height:100%;width:31%;background:${BL};border-radius:9px}
.mc-k{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;font-size:12px;color:${MU}}.mc-k b{display:block;color:${INK};font-weight:400;font-size:13.5px;margin-top:4px}
.mc-tour{position:absolute;right:22px;top:118px;width:372px;background:#fff;border:1px solid ${LN};border-radius:14px;box-shadow:0 12px 40px #1e1f2a1f;padding:16px 18px 18px;z-index:10;transition:opacity .25s,transform .25s}.mc-tour.off{opacity:0;transform:translateY(10px);pointer-events:none}
.mc-tour .tt{display:flex;justify-content:space-between;align-items:center;font-size:15px;margin-bottom:14px}.mc-tour .tt button{border:0;background:none;font-size:14px;transition:transform .25s}.mc-tour.min .tt button{transform:rotate(180deg)}.mc-tour.min .bd{display:none}
.mc-pt{display:flex;gap:8px;margin-bottom:14px}.mc-pt button{border:1px solid ${LN};background:#fff;border-radius:7px;padding:4px 10px;font-size:13px}.mc-pt button.on{background:#ededf2;border-color:#ededf2}
.mc-tl{border:1px solid ${LN};border-radius:10px;overflow:hidden}.mc-tl div{display:flex;align-items:center;gap:12px;padding:12px 14px;border-top:1px solid ${LN};cursor:pointer;font-size:14px;transition:background .15s}.mc-tl div:first-child{border:0}.mc-tl div:hover{background:#f7f7fa}.mc-tl .ic{width:18px;text-align:center;color:#555;font-size:12px}.mc-tl .go{margin-left:auto;width:20px;height:20px;border-radius:50%;background:#f0f0f3;display:grid;place-items:center;font-size:11px}
.mc-tl div.done{color:${MU}}.mc-tl div.done .go{background:#dff3e7;color:${GR}}.mc-ud{display:flex;align-items:center;gap:12px;border:1px solid ${LN};border-radius:10px;padding:10px 12px 10px 14px;margin-top:12px}.mc-ud button{margin-left:auto;border:0;background:#f0f0f3;border-radius:99px;padding:5px 12px}
.mc-fab{position:absolute;right:22px;bottom:18px;z-index:11;width:40px;height:40px;border-radius:50%;border:1px solid ${LN};background:#fff;color:${BL};font-size:16px;box-shadow:0 2px 8px #0001}
.mc-cm{position:absolute;z-index:30;width:176px;background:#1e1f26;color:#e8e8ee;border-radius:8px;padding:12px 14px;font-size:12px;line-height:1.45;box-shadow:0 8px 24px #0004;transition:opacity .2s}.mc-cm b{display:block;font:500 13.5px/1.35 ${F};color:#fff;margin-bottom:8px;padding-right:12px}.mc-cm .x{position:absolute;right:8px;top:8px;border:0;background:none;color:#ccc;font-size:13px}.mc-cm u{display:inline-block;margin-top:8px;color:#fff;cursor:pointer}.mc-cm .st{float:right;margin-top:8px;color:#9a9aa8}
.mc-cm:before{content:'';position:absolute;width:10px;height:10px;background:#1e1f26;transform:rotate(45deg);left:var(--ax,20px);top:-5px}.mc-cm.up:before{top:auto;bottom:-5px}.mc-ring{position:absolute;z-index:29;border-radius:10px;box-shadow:0 0 0 3px ${BL}88,0 0 0 9999px #1e1f2a14;pointer-events:none;transition:all .25s}
.mc-tx h1{display:flex;align-items:center}.mc-tx h1 button{margin-left:auto;border:0;background:#efeff3;border-radius:99px;padding:6px 14px;font-size:13.5px}
.mc-fl{display:flex;gap:8px;align-items:center;border-bottom:1px solid ${LN};padding-bottom:12px}.mc-fl button{border:1px solid ${LN};background:#fff;border-radius:8px;padding:5px 10px;font-size:13px;display:flex;gap:6px}.mc-fl button.on{border-color:${BL};color:${BL};background:#f3f4ff}.mc-fl .rt{margin-left:auto;display:flex;gap:18px;color:#444}
.mc-sum{display:flex;gap:36px;padding:16px 0 12px;border-bottom:1px solid ${LN}}.mc-sum div{font-size:12.5px;color:#444;cursor:pointer;border-radius:8px;padding:4px 8px;margin:-4px -8px}.mc-sum div.on{background:#f3f4ff}.mc-sum b{display:block;font:400 17px ${F};color:${INK};margin-top:2px}.mc-sum .g b{color:${GR}}
.mc-tt{width:100%;border-collapse:collapse;font-size:13.5px}.mc-tt th{font-weight:400;font-size:11.5px;color:${MU};text-align:left;padding:12px 6px;border-bottom:1px solid ${LN}}.mc-tt td{padding:9px 6px;border-bottom:1px solid #f1f1f4;white-space:nowrap}.mc-tt tr:hover td{background:#fafafc}
.mc-tt .amt{text-align:right}.mc-tt .pos{color:${GR}}.mc-tt .fail{text-decoration:line-through;color:${GR}}.mc-tt .ini{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#e5ebf6;font-size:8.5px;margin-right:12px;vertical-align:middle;color:#445}
.mc-tt .ftag{border:1px solid #f2b8bf;color:#c23b4b;border-radius:4px;font-size:10.5px;padding:1px 6px;margin-left:8px}.mc-tt select{border:1px solid ${LN};border-radius:7px;font:inherit;font-size:12.5px;padding:5px 6px;background:#fff;width:136px;color:${INK}}.mc-tt .mu{color:#555}
.mc-ph{display:grid;place-items:center;height:300px;border:1px dashed ${LN};border-radius:12px;color:${MU}}
.mc.hide .mc-m,.mc.hide .mc-hid{filter:blur(6px)}`));
  // balance series
  const N = 31, r = rng(41), base = new Date(2026, 8, 7); const AN = [[0, 4180000], [8, 4290000], [15, 4375501.7], [22, 4690000], [27, 4980000], [30, 5216471.18]]; const ser = Array.from({ length: N }, (_, i) => { const k = AN.findIndex(([x]) => x >= i); if (AN[k][0] === i) return AN[k][1]; const [x0, y0] = AN[k - 1], [x1, y1] = AN[k]; return y0 + (y1 - y0) * (i - x0) / (x1 - x0) + (r() - .5) * 70000; });
  const dates = ser.map((_, i) => new Date(base.getTime() + i * 864e5));
  const dLong = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), dShort = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  // state
  let route = 'home', persona = 'Startup', chartMode = 'line', hidden = false, txFilter = 'all', q = '', done = new Set();
  const app = h('div.mc'); const pg = h('div.mc-pg'); const main = h('div.mc-main');
  const NAV = [['Home', '⌂'], ['Tasks', '◎', '10'], ['Command', '›_', null, 'New'], 0, ['Accounts', '▥'], ['Transactions', '⇄'], ['Cards', '▭'], ['Team Spend', '⁘'], ['Payments', '➤'], ['Invoicing', '▤'], ['Accounting', '◫']];
  const sbNav = h('div'); const drawNav = () => sbNav.replaceChildren(...NAV.flatMap((n) => { if (!n) return [h('hr')]; const id = n[0].toLowerCase().replace(/ /g, '');
    const el = h('div.mc-ni' + (route === id ? '.on' : ''), { 'data-nav': id, onclick: () => nav(id) }, h('span.ic', {}, n[1]), n[0], n[2] ? h('span.ct', {}, n[2]) : null, n[3] ? h('span.nw', {}, n[3]) : null);
    return id === 'transactions' && route === 'transactions' ? [el, h('div.mc-ni.sub', { onclick: () => toast('Insights (demo)') }, 'Insights')] : [el]; }));
  let books = false; const seg = h('div.mc-seg', {}, h('button.on', { onclick: (e) => { books = false; seg.children[0].classList.add('on'); seg.children[1].classList.remove('on'); } }, '🏛 Banking'), h('button', { onclick: () => { books = true; seg.children[1].classList.add('on'); seg.children[0].classList.remove('on'); toast('Mercury Books — AI-powered accounting (demo)'); } }, 'Books'));
  const sb = h('div.mc-sb', {}, h('div.org', {}, h('i'), 'Mercury Demo', h('b', {}, 'Pro')), seg, sbNav, h('div.bm', {}, 'Bookmarks', h('span', {}, '⊞')),
    ...[['Ops / Payroll', 2023267.12], ['Credit Card'], ['Bill Pay'], ['Insights']].map(([n, b]) => h('div.mc-ni', { onclick: () => nav(n === 'Credit Card' ? 'cards' : n === 'Ops / Payroll' ? 'accounts' : n === 'Bill Pay' ? 'payments' : 'transactions') }, h('span.ic', {}, '⌑'), h('div', {}, n, b ? h('small.mc-hid', {}, moneyTxt(b)) : null))));
  const search = h('input', { placeholder: 'Search for anything', oninput: (e) => { q = e.target.value; if (route !== 'transactions' && q) nav('transactions'); else if (route === 'transactions') drawTx(); } });
  const eye = h('span.ib', { title: 'Hide balances', onclick: () => { hidden = !hidden; app.classList.toggle('hide', hidden); eye.classList.toggle('on', hidden); } }, '◌̸');
  const bar = h('div.mc-bar', {}, h('span', {}, '⌕'), search, h('span.mm', { onclick: () => toast('Move money: Send · Transfer · Deposit (demo)') }, '⇄ ', 'Move money'), eye, h('span.ib', {}, '⚙'), h('span.ib', {}, '🔔'), h('div.mc-av', { 'data-t': 'avatar' }));
  // --- coach mark / tour engine ---
  const ring = h('div.mc-ring', { style: { display: 'none' } }), cm = h('div.mc-cm', { style: { display: 'none' } });
  let tour = null; const closeCm = () => { cm.style.display = 'none'; ring.style.display = 'none'; tour = null; };
  const place = () => { if (!tour) return; const step = tour.steps[tour.i]; const tgt = app.querySelector(step.sel); if (!tgt) return closeCm(); const ar = app.getBoundingClientRect(), tr = tgt.getBoundingClientRect();
    ring.style.display = ''; Object.assign(ring.style, { left: tr.left - ar.left - 4 + 'px', top: tr.top - ar.top - 4 + 'px', width: tr.width + 8 + 'px', height: tr.height + 8 + 'px' });
    cm.style.display = ''; cm.replaceChildren(h('button.x', { onclick: closeCm }, '✕'), h('b', {}, step.t), step.d, h('div', {}, h('u', { onclick: () => { if (tour.i < tour.steps.length - 1) { tour.i++; place(); } else { done.add(tour.id); closeCm(); drawTour(); } } }, tour.i < tour.steps.length - 1 ? 'Next ›' : 'Got it ›'), tour.steps.length > 1 ? h('span.st', {}, `${tour.i + 1} of ${tour.steps.length}`) : null));
    const below = tr.bottom - ar.top + 12, left = clamp(tr.left - ar.left + tr.width / 2 - 30, 8, ar.width - 190); const up = below + 150 > ar.height; cm.classList.toggle('up', up);
    Object.assign(cm.style, { left: left + 'px', top: (up ? tr.top - ar.top - 12 - cm.offsetHeight : below) + 'px' }); cm.style.setProperty('--ax', clamp(tr.left - ar.left + tr.width / 2 - left - 5, 12, 160) + 'px'); };
  const startTour = (id, steps, routeTo) => { if (routeTo && route !== routeTo) nav(routeTo); if (routeTo === 'transactions') { tourP.classList.add('off'); fab.textContent = '▦'; } tour = { id, steps, i: 0 }; requestAnimationFrame(place); };
  const TASKS = { Startup: [['$', 'Send money to contractors', [{ sel: '[data-act=send]', t: 'Pay contractors in a few clicks', d: 'Send by ACH, wire, or check — Mercury saves the recipient for next time.' }, { sel: '[data-nav=payments]', t: 'Track every payment', d: 'Scheduled and recurring payments live under Payments.' }]],
    ['☺', 'Invite your team members', [{ sel: '[data-t=avatar]', t: 'Invite teammates', d: 'Open Settings → Team to invite admins, bookkeepers, or card-only users.' }]], ['▭', 'Create cards for your team', [{ sel: '[data-nav=cards]', t: 'Issue virtual or physical cards', d: 'Set limits per card and freeze any card instantly.' }]],
    ['▤', 'Request vendor payment details', [{ sel: '[data-act=request]', t: 'Request details securely', d: 'Vendors fill in their bank details — no more emailing account numbers.' }]], ['⚖', 'Issue SAFE to investors', [{ sel: '[data-nav=command]', t: 'Mercury Command', d: 'Draft, sign, and track SAFEs alongside your banking.' }]]],
    Ecommerce: [['$', 'Pay suppliers internationally', [{ sel: '[data-act=send]', t: 'International wires', d: 'Send USD or local currency wires to suppliers in 50+ countries.' }]], ['⇄', 'Review payout deposits', [{ sel: '[data-nav=transactions]', t: 'See every payout', d: 'Marketplace payouts land in Transactions, auto-categorized.' }]], ['▭', 'Create cards for ad spend', [{ sel: '[data-nav=cards]', t: 'Dedicated ad cards', d: 'Give each channel its own card and limit.' }]], ['▤', 'Upload and pay a bill', [{ sel: '[data-act=upload]', t: 'Upload a bill', d: 'Drop a PDF — Mercury reads the amount and due date.' }]]],
    Agency: [['▤', 'Send invoices to clients', [{ sel: '[data-nav=invoicing]', t: 'Invoicing', d: 'Send branded invoices and get paid by card or ACH.' }]], ['⁘', 'Set team spend policies', [{ sel: '[data-nav=teamspend]', t: 'Team Spend', d: 'Policies and reimbursements in one place.' }]], ['$', 'Pay freelancers in bulk', [{ sel: '[data-act=send]', t: 'Bulk payments', d: 'Upload a CSV to pay many freelancers at once.' }]]],
    More: [['▥', 'Open a Treasury account', [{ sel: '[data-nav=accounts]', t: 'Accounts', d: 'Treasury, checking, and savings accounts live here.' }]], ['◫', 'Connect your accounting software', [{ sel: '[data-nav=accounting]', t: 'Accounting sync', d: 'Sync transactions to your ledger automatically.' }]]] };
  const tl = h('div.mc-tl'), pt = h('div.mc-pt');
  const drawTour = () => { pt.replaceChildren(...Object.keys(TASKS).map((p) => h('button' + (p === persona ? '.on' : ''), { onclick: () => { persona = p; drawTour(); } }, p)));
    tl.replaceChildren(...TASKS[persona].map(([ic, t, steps]) => h('div' + (done.has(t) ? '.done' : ''), { onclick: () => startTour(t, steps, steps[0].sel.includes('data-act') ? 'home' : null) }, h('span.ic', {}, ic), t, h('span.go', {}, done.has(t) ? '✓' : '›')))); };
  const tourP = h('div.mc-tour', {}, h('div.tt', {}, 'Try out Mercury for yourself', h('button', { title: 'Collapse', onclick: () => tourP.classList.toggle('min') }, '⌄')), h('div.bd', {}, pt, tl,
    h('div.mc-ud', {}, h('span.ic', {}, '↗'), 'Understand your data', h('button', { onclick: () => startTour('data', [{ sel: '.mc-tt th:nth-child(7)', t: 'We categorized past transactions for you', d: 'Update or add your own categories to help improve your business insights.' }], 'transactions') }, 'Try Command'))));
  const fab = h('button.mc-fab', { title: 'Toggle demo guide', onclick: () => { tourP.classList.toggle('off'); fab.textContent = tourP.classList.contains('off') ? '▦' : '✕'; } }, '✕');
  // --- home ---
  const chartBox = h('div.mc-ch'), bigBal = h('div.big'), dl = h('div.mc-dl');
  const setBal = (i) => { if (i == null) { bigBal.replaceChildren(money(ser[N - 1])); dl.replaceChildren(h('span', {}, 'Last 30 days ⌄'), h('span.d', {}, h('span', {}, h('span', { style: { color: GR } }, '↗ '), h('span.mc-hid', {}, '$1.8M')), h('span', {}, h('span', { style: { color: '#d4475a' } }, '↘ '), h('span.mc-hid', {}, '−$479K')))); }
    else { bigBal.replaceChildren(money(ser[i])); const d = ser[i] - (ser[i - 1] ?? ser[i]); dl.replaceChildren(h('span', {}, dLong(dates[i])), h('span', {}, h('span', { style: { color: d >= 0 ? GR : '#d4475a' } }, d >= 0 ? '↗ ' : '↘ '), h('span.mc-hid', {}, moneyTxt(Math.abs(d))))); } };
  const drawChart = () => { if (chartMode === 'table') { chartBox.style.height = 'auto'; chartBox.replaceChildren(h('table.mc-tb', { style: { margin: '0 20px', width: 'calc(100% - 40px)' } }, ser.slice(-7).reverse().map((x, k) => h('tr', {}, h('td', {}, dShort(dates[N - 1 - k])), h('td', {}, money(x)))))); return; }
    chartBox.style.height = '150px'; const W = 560, H = 150, mn = Math.min(...ser) * .985, mx = Math.max(...ser) * 1.005; const X = (i) => i / (N - 1) * W, Y = (y) => H - (y - mn) / (mx - mn) * (H - 18) - 4;
    const d = ser.map((y, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(y).toFixed(1)}`).join('');
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none' }, s('defs', {}, s('linearGradient', { id: 'mcF', x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: 0, 'stop-color': '#7b80e0', 'stop-opacity': .32 }), s('stop', { offset: 1, 'stop-color': '#7b80e0', 'stop-opacity': .03 }))),
      s('path', { d: d + `L${W},${H}L0,${H}Z`, fill: 'url(#mcF)' }), s('path', { d, fill: 'none', stroke: '#6c72d8', 'stroke-width': 1.6, 'vector-effect': 'non-scaling-stroke' }));
    const vl = h('div', { style: { position: 'absolute', top: 0, bottom: 0, width: '1px', background: '#6c72d8', display: 'none' } }), dot = h('div', { style: { position: 'absolute', width: '9px', height: '9px', borderRadius: '50%', border: '1.5px solid #6c72d8', background: '#fff', transform: 'translate(-50%,-50%)', display: 'none' } });
    chartBox.replaceChildren(svg, vl, dot); chartBox._hover = (i) => { if (i == null) { vl.style.display = dot.style.display = 'none'; setBal(null); return; } const w = chartBox.clientWidth, x = X(i) / W * w; vl.style.display = dot.style.display = ''; vl.style.left = x + 'px'; dot.style.left = x + 'px'; dot.style.top = Y(ser[i]) / H * chartBox.clientHeight + 'px'; setBal(i); };
    chartBox.onmousemove = (e) => { const rr = chartBox.getBoundingClientRect(); chartBox._hover(clamp(Math.round((e.clientX - rr.left) / rr.width * (N - 1)), 0, N - 1)); }; chartBox.onmouseleave = () => chartBox._hover(null); };
  const tg = h('div.mc-tg', {}, h('button.on', { title: 'Balance graph', onclick: () => { chartMode = 'line'; tg.children[0].classList.add('on'); tg.children[1].classList.remove('on'); drawChart(); } }, '⟋'), h('button', { title: 'Balance table', onclick: () => { chartMode = 'table'; tg.children[1].classList.add('on'); tg.children[0].classList.remove('on'); drawChart(); } }, '▦'));
  const ACC = [['Credit Card', 12505.87], ['Treasury', 200000], ['Ops / Payroll', 2023267.12], ['AP', 226767.82], ['AR', 0]];
  const home = () => [h('h1', {}, 'Welcome, Jane'),
    h('div.mc-acts', {}, h('button.pri', { 'data-act': 'send', onclick: () => toast('Send money — choose a recipient (demo)') }, '➤ Send'), h('button', { onclick: () => toast('Transfer between accounts (demo)') }, '↔ Transfer'), h('button', { onclick: () => toast('Deposit a check (demo)') }, '+ Deposit'), h('button', { 'data-act': 'request', onclick: () => toast('Request a payment (demo)') }, '⇤ Request'), h('button', { 'data-act': 'upload', onclick: () => toast('Upload bill (demo)') }, '⇡ Upload bill'), h('button.cz', {}, '⋮ Customize')),
    h('div.mc-grid', {}, h('div.mc-cd', {}, h('div.hd', {}, 'Mercury balance', h('span', { style: { color: BL, fontSize: '12px' } }, '◈'), tg), bigBal, dl, chartBox, chartMode === 'line' ? h('div.mc-ax', {}, ['Sep 12', 'Sep 17', 'Sep 22', 'Sep 27', 'Oct 2'].map((t) => h('span', {}, t))) : null),
      h('div.mc-cd', {}, h('div.hd', {}, 'Accounts', h('span', { style: { marginLeft: 'auto' } }, h('button.mc-rnd', {}, '+')), h('span', {}, '⋮')), ...ACC.map(([n, b]) => h('div.mc-ac', {}, h('i'), n, h('b', {}, money(b)))), h('div.mc-ac', { style: { color: '#33343f', cursor: 'pointer' }, onclick: () => nav('accounts') }, h('button.mc-rnd', { style: { fontSize: '9px' } }, '+2'), 'View all accounts'))),
    h('div.mc-grid3', {}, h('div.mc-cd', {}, h('div.hd', {}, 'Credit Card', h('span', { style: { marginLeft: 'auto' } }, h('button.mc-rnd', {}, '▭')), '⋮'), h('div.big', {}, money(12505.87)), h('div.mc-bar2', {}, h('i')), h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: MU } }, h('span', {}, 'Balance ', h('span', { style: { color: BL } }, '●'), '  Pending ', h('span', { style: { color: '#a9b0f2' } }, '●')), h('span.mc-hid', {}, '$21,249 available')), h('div.mc-k', { style: { marginTop: '18px', gridTemplateColumns: '1fr auto' } }, h('div', {}, '↻ Autopay', h('b', {}, 'Oct 12')), h('button', { style: { border: 0, background: '#f0f0f3', borderRadius: '99px', padding: '5px 14px', alignSelf: 'end' }, onclick: () => toast('Pay credit card (demo)') }, 'Pay'))),
      h('div.mc-cd', {}, h('div.hd', {}, 'Bill Pay', h('span', { style: { marginLeft: 'auto' } }, h('button.mc-rnd', {}, '⇡')), '⋮'), h('div.mc-k', { style: { marginTop: '22px' } }, h('div', {}, 'Outstanding', h('b', {}, '11')), h('div', {}, 'Overdue', h('b', {}, '1')), h('div', {}, 'Due soon', h('b', {}, '-'))), h('div', { style: { borderTop: `1px solid ${LN}`, marginTop: '14px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' } }, h('span', {}, 'Inbox', h('br'), '3 items · $10K'), h('span', { style: { color: BL, alignSelf: 'end', cursor: 'pointer' } }, 'View ›'))),
      h('div.mc-cd', {}, h('div.hd', {}, 'Invoicing', h('span', { style: { marginLeft: 'auto' } }, h('button.mc-rnd', {}, '⇤')), '⋮'), h('div.mc-k', { style: { marginTop: '22px', gridTemplateColumns: '1fr 1fr' } }, h('div', {}, 'Overdue', h('b', {}, '4 · ', money(950))), h('div', {}, 'Paid', h('b', {}, '12 · $6K'))), h('div', { style: { borderTop: `1px solid ${LN}`, marginTop: '14px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' } }, h('span', {}, 'Open', h('br'), '12 items · $12.3K'), h('span', { style: { color: BL, alignSelf: 'end', cursor: 'pointer' } }, 'View ›'))))];
  // --- transactions ---
  const CATS = ['', 'Business Clothing', 'Office Supplies', 'Meals & Entertainment', 'Software', 'Travel', 'Payroll', 'Transfer'];
  const TX = [['Oct 7', 'Mercury Working Capital', 'logo', -2200, 'Ops / Payroll', '', ''], ['Oct 7', 'Payment from NASA', 'P', 419, 'AR', '→ Request or Invoice P…', '', 1], ['Oct 7', 'Payment from Acme Corp', 'P', 200, 'AR', '→ Request or Invoice P…', ''], ['Oct 7', 'To Ops / Payroll', 'logo', -55810.16, 'AR', '← Transfer', 'Transfer'],
    ['Oct 7', 'From AR', 'logo', 55810.16, 'Ops / Payroll', '→ Transfer', 'Transfer'], ['Oct 7', 'Lily’s Eatery', 'LE', 0.93, 'Ops / Payroll', '▭ Alice C. ••1234', ''], ['Oct 7', 'Deli 77', 'D7', 63.53, 'Credit account', '▭ Mary M. ••0332', 'Business Clothing'], ['Oct 7', 'Deli 77', 'D7', 214.06, 'Ops / Payroll', '▭ Jane B. ••6112', 'Business Clothing'],
    ['Oct 7', 'Office Stop Co.', 'OS', -287.89, 'Ops / Payroll', '▭ Jessica A. ••9914', 'Office Supplies'], ['Oct 6', 'Figma', 'FI', -720, 'Credit account', '▭ Jane B. ••6112', 'Software'], ['Oct 6', 'Gusto Payroll', 'GP', -148320.4, 'Ops / Payroll', '→ ACH', 'Payroll'], ['Oct 6', 'Stripe Payout', 'SP', 18452.11, 'AR', '← ACH', ''], ['Oct 5', 'United Airlines', 'UA', -1284.6, 'Credit account', '▭ Alice C. ••1234', 'Travel']];
  let txBody = null, sum = null;
  const drawTx = () => { if (!txBody) return; const L = TX.filter((t) => (txFilter === 'all' || (txFilter === 'in' ? t[3] > 0 : t[3] < 0)) && (!q || t[1].toLowerCase().includes(q.toLowerCase())));
    txBody.replaceChildren(...L.map((t) => h('tr', {}, h('td', {}, h('input', { type: 'checkbox' })), h('td', {}, t[0]), h('td', {}, t[2] === 'logo' ? h('span.ini', { style: { background: 'repeating-radial-gradient(circle,#fff 0 2px,#555 2px 3px)' } }) : h('span.ini', {}, t[2]), t[1], t[7] ? h('span.ftag', {}, 'Failed') : null),
      h('td.amt' + (t[7] ? '.fail' : t[3] > 0 ? '.pos' : ''), {}, money(t[3])), h('td.mu', {}, t[4]), h('td.mu', {}, t[5]), h('td', {}, h('select', { onchange: (e) => { t[6] = e.target.value; toast(`Categorized “${t[1]}” as ${e.target.value || 'Uncategorized'}`); } }, CATS.map((c) => h('option', { value: c, selected: c === t[6] }, c || 'Select category')))))));
    [...sum.children].forEach((d) => d.classList.toggle('on', txFilter !== 'all' && d.dataset.f === txFilter)); };
  const txPage = () => { txBody = h('tbody'); sum = h('div.mc-sum', {}, h('div', { 'data-f': 'all', onclick: () => { txFilter = 'all'; drawTx(); } }, 'Net change this month', h('b', {}, money(-78943.52))), h('div.g', { 'data-f': 'in', onclick: () => { txFilter = txFilter === 'in' ? 'all' : 'in'; drawTx(); } }, 'Money in', h('b', {}, money(370822.92))), h('div', { 'data-f': 'out', onclick: () => { txFilter = txFilter === 'out' ? 'all' : 'out'; drawTx(); } }, 'Money out', h('b', {}, money(-449766.44))));
    const el = h('div.mc-tx', {}, h('h1', {}, 'Transactions', h('button', { onclick: () => toast('Match receipts to transactions (demo)') }, '▤ Match receipts')),
      h('div.mc-fl', {}, ['Saved views', 'Filters', 'Date', 'Keyword', 'Amount'].map((f) => h('button', { onclick: () => (f === 'Keyword' ? search.focus() : toast(f + ' (demo)')) }, f === 'Filters' ? '☰ ' + f : f, ' ⌄')), h('span.rt', {}, '▦', '⇅', '☷', h('span', { style: { cursor: 'pointer' }, onclick: () => toast('Export all as CSV (demo)') }, '⇩ Export all'))), sum,
      h('table.mc-tt', {}, h('thead', {}, h('tr', {}, h('th', { style: { width: '24px' } }, h('input', { type: 'checkbox' })), h('th', {}, 'Date ↓'), h('th', {}, 'To/From'), h('th', { style: { textAlign: 'right' } }, 'Amount'), h('th', {}, 'Account'), h('th', {}, 'Method'), h('th', {}, 'Category'))), txBody));
    setTimeout(drawTx); return [el]; };
  const nav = (id) => { route = id; closeCm(); drawNav(); txBody = null; if (id === 'home') { pg.replaceChildren(...home()); setBal(null); drawChart(); } else if (id === 'transactions') pg.replaceChildren(...txPage());
    else pg.replaceChildren(h('h1', {}, NAV.find((n) => n && n[0].toLowerCase().replace(/ /g, '') === id)?.[0] || id), h('div.mc-ph', {}, 'This section is part of the full Mercury demo — open Home or Transactions here.')); pg.scrollTop = 0; };
  pg.addEventListener('scroll', () => tour && place(), { passive: true });
  main.append(bar, pg, tourP, fab);
  app.append(h('div.mc-top', {}, h('span.lg', {}, '⚙'), 'Explore the Mercury Demo.', h('u', { onclick: () => { tourP.classList.remove('off', 'min'); fab.textContent = '✕'; } }, 'Customize your experience'), h('button.va', { onclick: () => toast('Viewing as: Admin · Bookkeeper · Card-only (demo)') }, 'Viewing as Admin ⌄'), h('button.oa', { onclick: () => toast('Open account (demo)') }, 'Open account')),
    h('div.mc-body', {}, sb, main), ring, cm);
  root.append(app); drawTour(); nav('home');
  window.__demoProof = async () => { const out = []; out.push(`welcome="${pg.querySelector('h1').textContent}" balance=${bigBal.textContent}`);
    chartBox._hover(15); await sleep(30); out.push(`chart scrub → ${bigBal.textContent} ${dl.firstChild.textContent}`); chartBox._hover(null);
    pt.children[1].click(); out.push(`persona Ecommerce tasks=${tl.children.length} first="${tl.children[0].textContent.replace('›', '')}"`); pt.children[0].click();
    tl.children[0].click(); await sleep(60); out.push(`coach-mark "${cm.querySelector('b')?.textContent}" ring=${ring.style.display !== 'none'}`); cm.querySelector('u').click(); await sleep(30); out.push(`step2 → "${cm.querySelector('b')?.textContent}"`); cm.querySelector('u').click(); out.push(`task done=${tl.children[0].classList.contains('done')}`);
    sbNav.querySelector('[data-nav=transactions]').click(); await sleep(30); out.push(`route Transactions rows=${txBody.children.length}`); sum.children[1].click(); out.push(`Money in filter rows=${txBody.children.length}`); sum.children[1].click();
    tourP.querySelector('.mc-ud button').click(); await sleep(60); out.push(`coach-mark "${cm.querySelector('b')?.textContent}"`); cm.querySelector('.x').click();
    eye.click(); out.push(`hide balances=${app.classList.contains('hide')}`); eye.click();
    tourP.classList.remove('off', 'min'); fab.textContent = '✕'; done.clear(); persona = 'Startup'; chartMode = 'line'; txFilter = 'all'; q = ''; search.value = ''; drawTour(); nav('home'); return out.join('; ') + '; restored'; };
};
V['zed-blueprint-grid-kbd-hint-command-palette'] = (root, T) => {
  import('@fontsource/ibm-plex-serif/400.css'); import('@fontsource/ibm-plex-serif/400-italic.css'); import('@fontsource/ibm-plex-serif/500-italic.css'); import('@fontsource/ibm-plex-mono/400.css'); import('@fontsource/ibm-plex-sans/400.css'); import('@fontsource/ibm-plex-sans/500.css');
  theme(root, T, { bg: '#f5f4f0', fg: '#262626', ac: '#0751cf', dark: false }); scroll(root);
  const SANS = "'IBM Plex Sans',system-ui,sans-serif", PM = "'IBM Plex Mono',ui-monospace,monospace", PS = "'IBM Plex Serif',Georgia,serif";
  root.append(h('style', {}, `.zd{--bg:#f5f4f0;--fg:#262626;--mu:#5f5f5c;--ln:#dedcd5;--bl:#0751cf;--hb:#2b5fe0;--pn:#ffffff;--kb:#ffffff;--hi:#efeeea;--grid:#00000008;background:var(--bg);color:var(--fg);font:400 14px/1.6 ${SANS};min-height:100%;position:relative;transition:background .35s,color .35s;overflow-x:clip}
.zd.dark{--bg:#0e0f11;--fg:#e8e8e6;--mu:#a2a29c;--ln:#2a2b2f;--bl:#3d7bff;--hb:#7da2ff;--pn:#17181b;--kb:#1d1e22;--hi:#24262b;--grid:#ffffff07}
.zd button{font:inherit;color:inherit;cursor:pointer}
.zd-fr{position:absolute;inset:0;pointer-events:none;z-index:0}.zd-fr .v{position:absolute;top:0;bottom:0;width:1px;background:var(--ln)}.zd-fr .hz{position:absolute;left:0;right:0;height:1px;background:var(--ln)}.zd-fr .x{position:absolute;width:9px;height:9px;margin:-4px 0 0 -4px;border:1px solid var(--ln);border-radius:50%;background:var(--bg)}
.zd-in{position:relative;z-index:1;width:min(1180px,calc(100% - 128px));margin:0 auto}
.zd-nav{height:46px;display:flex;align-items:center;gap:22px;font-size:13.5px}.zd-lg{display:flex;align-items:center;gap:7px;font:500 19px ${SANS};letter-spacing:-.02em;margin-right:8px}.zd-lg i{width:22px;height:22px;background:var(--bl);border-radius:3px;display:grid;place-items:center;color:#fff;font-size:13px;font-style:normal;font-weight:700}
.zd-nav a{cursor:pointer;color:var(--fg);opacity:.92}.zd-nav a:hover{opacity:1;text-decoration:underline;text-underline-offset:3px}.zd-nav .sep{width:1px;height:18px;background:var(--ln)}.zd-nav .sp{margin-left:auto}
.zd kbd{display:inline-grid;place-items:center;min-width:16px;height:17px;padding:0 4px;border:1px solid var(--ln);border-bottom-width:2px;border-radius:3px;background:var(--kb);font:400 10px ${PM};color:var(--mu);vertical-align:middle;box-sizing:border-box}
.zd-sch{display:flex;align-items:center;gap:8px;cursor:pointer;color:var(--mu)}.zd-sch kbd{padding:0 6px}
.zd-su{display:flex;align-items:center;gap:8px;cursor:pointer;border:0;background:none;padding:0}.zd-dl{display:flex;align-items:center;gap:9px;background:var(--bl);color:#fff !important;border:1px solid #0000;border-radius:3px;padding:4px 8px 4px 10px;box-shadow:inset 0 1px 0 #ffffff30}.zd-dl kbd{background:#ffffff1f;border-color:#ffffff40;color:#e8eeff}
.zd-news{height:30px;display:flex;justify-content:center;align-items:center;gap:6px;font:400 13.5px ${PS};border-top:1px solid var(--ln);border-bottom:1px solid var(--ln);cursor:pointer}.zd-news b{color:var(--bl);font-weight:400}.zd-news:hover span{text-decoration:underline}
.zd-hero{position:relative;height:360px;display:grid;place-items:center;text-align:center;overflow:hidden;border-bottom:1px solid var(--ln);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:14px 14px}
.zd-hero svg{position:absolute;left:50%;top:50%;width:760px;transform:translate(-50%,-50%);opacity:.5}
.zd-hero .in{position:relative}.zd-hero h1{font:400 italic 47px/1.1 ${PS};letter-spacing:-.025em;color:var(--hb);margin:0 0 20px}.zd-hero p{font:400 15px/1.55 ${PM};color:var(--mu);margin:0 0 24px;letter-spacing:-.01em}
.zd-cta{display:flex;gap:6px;justify-content:center}.zd-cta button{display:flex;align-items:center;gap:9px;height:30px;padding:0 6px 0 12px;border-radius:3px;font:500 13.5px ${PM};letter-spacing:-.02em;transition:transform .12s,box-shadow .12s}
.zd-cta .p{background:var(--bl);border:1px solid #0003;color:#fff;box-shadow:inset 0 1px 0 #ffffff33,0 1px 2px #0751cf55}.zd-cta .p kbd{background:#ffffff22;border-color:#ffffff44;color:#e8eeff}.zd-cta .s{background:var(--pn);border:1px solid var(--ln);box-shadow:0 1px 1px #0000000d}
.zd .fire{transform:translateY(1px) scale(.97);box-shadow:0 0 0 3px #0751cf44 !important}.zd-av{font:400 12px ${PM};color:var(--mu);margin-top:14px}
.zd-cols{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--ln)}.zd-cols div{padding:16px 18px 20px;border-left:1px solid var(--ln)}.zd-cols div:first-child{border:0}.zd-cols h3{font:400 16px ${PS};margin:0 0 6px}.zd-cols p{font:400 13px/1.55 ${PM};color:var(--mu);margin:0}
.zd-ed{position:relative;margin:14px 0 0;border:1px solid var(--ln);border-radius:8px 8px 0 0;background:var(--pn);height:430px;display:grid;grid-template-columns:205px 295px 1fr;grid-template-rows:22px 1fr;font:400 11.5px/1.5 ${PM};overflow:hidden;box-shadow:0 20px 60px #0751cf14}
.zd-ed .tb{grid-column:1/-1;display:flex;align-items:center;gap:6px;padding:0 8px;border-bottom:1px solid var(--ln);background:var(--hi);font-size:10.5px;color:var(--mu)}.zd-ed .tb i{width:9px;height:9px;border-radius:50%;display:inline-block}
.zd-wd{position:absolute;left:50%;top:-12px;transform:translateX(-50%);z-index:3;background:var(--pn);border:1px solid var(--ln);border-radius:3px;padding:3px 10px;font:400 12px ${PM};box-shadow:0 4px 16px #0001;cursor:pointer}
.zd-th{border-right:1px solid var(--ln);overflow:hidden}.zd-th .t{padding:5px 9px;cursor:pointer;border-bottom:1px solid #0000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.zd-th .t.on{background:var(--hi)}.zd-th .t small{display:block;color:var(--mu);font-size:10px}.zd-th .g{padding:6px 9px 2px;color:var(--mu);font-size:10.5px}
.zd-ag{border-right:1px solid var(--ln);padding:8px;display:flex;flex-direction:column;gap:8px}.zd-ag .q{border:1px solid var(--ln);border-radius:4px;padding:8px;background:var(--bg)}.zd-ag .a{color:var(--mu)}.zd-ag .tl{border:1px solid var(--ln);border-radius:4px;padding:5px 8px;font-size:10.5px}
.zd-cd{display:grid;grid-template-rows:24px 1fr;min-width:0}.zd-tabs{display:flex;border-bottom:1px solid var(--ln);background:var(--hi)}.zd-tabs span{padding:3px 14px;border-right:1px solid var(--ln);cursor:pointer;color:var(--mu)}.zd-tabs span.on{background:var(--pn);color:var(--fg)}
.zd-code{padding:8px 0;overflow:hidden;white-space:pre;counter-reset:ln}.zd-code div{padding-left:44px;position:relative}.zd-code div:before{counter-increment:ln;content:counter(ln);position:absolute;left:0;width:30px;text-align:right;color:#a3a39d}
.zd .k{color:#a626a4}.zd .st{color:#50a14f}.zd .fn{color:#4078f2}.zd .cm{color:#a0a1a7;font-style:italic}.zd .ty{color:#c18401}.zd.dark .k{color:#c678dd}.zd.dark .st{color:#98c379}.zd.dark .fn{color:#61afef}.zd.dark .ty{color:#e5c07b}
.zd-pal-bg{position:fixed;inset:var(--tg-h,0px) 0 0 0;z-index:50;background:color-mix(in srgb,var(--bg) 62%,transparent);backdrop-filter:blur(1.5px);display:none}.zd-pal-bg.on{display:block}
.zd-pal{position:absolute;left:50%;top:52px;transform:translateX(-50%);width:460px;background:var(--pn);border:1px solid var(--ln);border-radius:6px;box-shadow:0 18px 50px #0000002a;overflow:hidden;font:400 13px ${PM}}
.zd-pal input{width:100%;box-sizing:border-box;height:40px;border:0;border-bottom:1px solid var(--ln);background:none;color:var(--fg);font:400 14px ${PM};padding:0 10px;outline:0}
.zd-pal .ls{max-height:320px;overflow:auto;padding:4px}.zd-pal .sc{font:400 10px ${PM};letter-spacing:.08em;text-transform:uppercase;color:var(--mu);padding:8px 6px 4px}.zd-pal .sc:not(:first-child){border-top:1px solid var(--ln);margin:4px -4px 0;padding-left:10px}
.zd-pal .it{padding:6px 6px;border-radius:3px;cursor:pointer;display:flex;justify-content:space-between}.zd-pal .it.on{background:var(--hi)}.zd-pal .it small{color:var(--mu)}.zd-pal .em{padding:16px 8px;color:var(--mu)}
.zd-pal .ft{display:flex;justify-content:flex-end;align-items:center;gap:6px;border-top:1px solid var(--ln);padding:6px 8px;font-size:11px;color:var(--mu)}.zd-pal .ft i{width:1px;height:14px;background:var(--ln);margin:0 6px}
.zd-mod{position:fixed;inset:var(--tg-h,0px) 0 0 0;z-index:49;display:none;place-items:center;background:#0003}.zd-mod.on{display:grid}.zd-mod div{background:var(--pn);border:1px solid var(--ln);border-radius:6px;padding:22px 24px;width:340px;font:400 13px ${PM}}.zd-mod h3{font:400 italic 24px ${PS};color:var(--hb);margin:0 0 12px}.zd-mod button{width:100%;height:32px;margin-top:8px;border:1px solid var(--ln);border-radius:3px;background:var(--bg)}`));
  // blueprint frame: vertical guides + horizontal rules with crosshair markers
  const fr = h('div.zd-fr'); const vx = ['40px', 'calc(50% - min(590px,50% - 64px))', 'calc(50% + min(590px,50% - 64px))', 'calc(100% - 40px)'];
  const zed = h('div.zd'); const lines = []; const mkFrame = () => { const ys = [46, 77, 437, 520]; fr.replaceChildren(...vx.map((x) => h('div.v', { style: { left: x } })), ...ys.map((y) => h('div.hz', { style: { top: y + 'px' } })), ...ys.flatMap((y) => vx.map((x) => h('div.x', { style: { left: x, top: y + 'px' } })))); };
  const art = `<svg viewBox="0 0 400 400" fill="none" stroke="currentColor" stroke-width=".5" style="color:var(--ln)">${Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2, r1 = 60, r2 = 190; return `<path d="M${200 + Math.cos(a) * r1},${200 + Math.sin(a) * r1} L${200 + Math.cos(a + 1.1) * r2},${200 + Math.sin(a + 1.1) * r2}"/>`; }).join('')}<rect x="120" y="120" width="160" height="160"/><rect x="90" y="90" width="220" height="220" transform="rotate(12 200 200)"/><path d="M140 150h120L140 250h120"/></svg>`;
  const flags = { download: 0, signup: 0, clone: null };
  const fire = (el) => { el.classList.add('fire'); setTimeout(() => el.classList.remove('fire'), 220); };
  const modal = h('div.zd-mod', { onclick: (e) => e.target === modal && modal.classList.remove('on') });
  const doDownload = (src) => { flags.download++; fire(src); toast('Downloading Zed for Linux (x86_64)… (demo)'); };
  const doSignup = (src) => { flags.signup++; fire(src); modal.replaceChildren(h('div', {}, h('h3', {}, 'Sign in to Zed'), h('p', { style: { color: 'var(--mu)', margin: '0 0 8px' } }, 'Collaborate with your team and use Zed AI.'), h('button', { onclick: () => { modal.classList.remove('on'); toast('GitHub OAuth (demo)'); } }, 'Continue with GitHub'), h('button', { onclick: () => modal.classList.remove('on') }, 'Cancel'))); modal.classList.add('on'); };
  const doClone = (src) => { fire(src); flags.clone = 'https://github.com/zed-industries/zed'; window.open(flags.clone, '_blank', 'noopener'); };
  const dlNav = h('button.zd-dl', { onclick: (e) => doDownload(e.currentTarget) }, 'Download', h('kbd', {}, 'D')), suNav = h('button.zd-su', { onclick: (e) => doSignup(e.currentTarget) }, 'Sign up', h('kbd', {}, 'S'));
  const dlBtn = h('button.p', { onclick: (e) => doDownload(e.currentTarget) }, '⇩ Download now', h('kbd', {}, 'D')), clBtn = h('button.s', { onclick: (e) => doClone(e.currentTarget) }, '◉ Clone source', h('kbd', {}, 'C'));
  // command palette
  let dark = false, palOpen = false, act = 0, items = [];
  const CMDS = () => [["Switch theme", [[dark ? 'Turn dark mode off' : 'Turn dark mode on', () => setDark(!dark)], ["Follow the System's settings", () => setDark(matchMedia('(prefers-color-scheme: dark)').matches)]]],
    ["Zed's brand", [['Copy logo as SVG', () => copy('<svg><!-- zed logo --></svg>', 'Logo SVG copied')], ['Copy wordmark as SVG', () => copy('<svg><!-- zed wordmark --></svg>', 'Wordmark SVG copied')], ['View brand guidelines', () => toast('→ /brand (demo)')]]],
    ['Navigation', ['Home', 'Download', 'Extensions', 'Docs', 'Pricing', 'Blog', 'Releases', 'Careers'].map((n) => [n, () => (n === 'Home' ? (root.scrollTop = 0) : n === 'Download' ? doDownload(dlBtn) : toast(`→ /${n.toLowerCase()} (demo)`)), '↵'])]];
  const inp = h('input', { placeholder: 'Navigate…', oninput: () => { act = 0; drawPal(); } }), ls = h('div.ls');
  const pal = h('div.zd-pal', {}, inp, ls, h('div.ft', {}, h('kbd', {}, 'esc'), 'to dismiss', h('i'), h('kbd', {}, 'return'), 'to select'));
  const palBg = h('div.zd-pal-bg', { onclick: (e) => e.target === palBg && closePal() }, pal);
  const drawPal = () => { const qq = inp.value.trim().toLowerCase(); items = []; const kids = [];
    for (const [sec, L] of CMDS()) { const m = L.filter(([n]) => !qq || n.toLowerCase().includes(qq) || sec.toLowerCase().includes(qq)); if (!m.length) continue; kids.push(h('div.sc', {}, sec));
      for (const [n, fn] of m) { const k = items.length; items.push([n, fn]); kids.push(h('div.it' + (k === act ? '.on' : ''), { onmousemove: () => { if (act !== k) { act = k; drawPal(); } }, onclick: () => run(k) }, n)); } }
    ls.replaceChildren(...(kids.length ? kids : [h('div.em', {}, 'No results.')])); ls.querySelector('.it.on')?.scrollIntoView({ block: 'nearest' }); };
  const openPal = () => { palOpen = true; act = 0; inp.value = ''; drawPal(); palBg.classList.add('on'); setTimeout(() => inp.focus()); };
  const closePal = () => { palOpen = false; palBg.classList.remove('on'); };
  const run = (k) => { const it = items[k]; closePal(); it && it[1](); };
  const setDark = (d) => { dark = d; zed.classList.toggle('dark', d); root.style.setProperty('--bg', d ? '#0e0f11' : '#f5f4f0'); };
  const onKey = (e) => { const tag = (e.target.tagName || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') { e.preventDefault(); palOpen ? closePal() : openPal(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPal(); return; }
    if (palOpen) { if (e.key === 'Escape') { e.preventDefault(); closePal(); } else if (e.key === 'ArrowDown') { e.preventDefault(); act = (act + 1) % Math.max(1, items.length); drawPal(); } else if (e.key === 'ArrowUp') { e.preventDefault(); act = (act - 1 + items.length) % Math.max(1, items.length); drawPal(); } else if (e.key === 'Enter') { e.preventDefault(); run(act); } return; }
    if (e.key === 'Escape') modal.classList.remove('on');
    if (tag === 'input' || tag === 'textarea' || e.ctrlKey || e.metaKey || e.altKey || modal.classList.contains('on')) return;
    const k = e.key.toLowerCase(); if (k === 'd') doDownload(dlBtn); else if (k === 's') doSignup(suNav); else if (k === 'c') doClone(clBtn); };
  addEventListener('keydown', onKey);
  // editor mock
  const THR = [['zed', [['Add AccessKit support to GPUI elements', 'gpui-accesskit / main · 4m'], ['Fix panic in buffer rope on large paste', 'rope-panic-fix · 12m'], ['Add vim motion for surround pairs', '+23 −2 · 48m'], ['Workspace close button hidden with single tab', '2h'], ['GPUI text shaping perf regression', 'text-shaping-opt · 5h'], ['LSP hover tooltip positioning off-screen', '1d']]],
    ['cloud', [['Migrate billing endpoints to axum router', 'axum-billing · +43 −11 · 8m'], ['Add TanStack query keys for team settings', '+2 −127 · 1h'], ['Fix stale cache on org membership change', '6h']]], ['zed.dev', [['Break out page sections into components', 'parallel-agents-page · 2m'], ['Fix hydration mismatch in blog layout', '45m']]]];
  const FILES = { 'scheduler.tsx': ['<span class="st">"use client"</span>', '', '<span class="k">import</span> * <span class="k">as</span> React <span class="k">from</span> <span class="st">"react"</span>', '<span class="k">import</span> { useQuery } <span class="k">from</span> <span class="st">"@tanstack/react-query"</span>', '', '<span class="k">export function</span> <span class="fn">Scheduler</span>({ teamId }: { teamId: <span class="ty">string</span> }) {', '  <span class="k">const</span> { data } = <span class="fn">useQuery</span>({ queryKey: [<span class="st">"team"</span>, teamId] })', '  <span class="cm">// render one lane per agent</span>', '  <span class="k">return</span> (', '    &lt;<span class="ty">Lanes</span> items={data?.agents ?? []} /&gt;', '  )', '}'],
    'catware.rs': ['<span class="k">use</span> gpui::{<span class="ty">App</span>, <span class="ty">Context</span>, <span class="ty">Window</span>};', '', '<span class="k">pub struct</span> <span class="ty">Catware</span> {', '    lives: <span class="ty">u8</span>,', '}', '', '<span class="k">impl</span> <span class="ty">Catware</span> {', '    <span class="k">pub fn</span> <span class="fn">nap</span>(&amp;<span class="k">mut</span> self, cx: &amp;<span class="k">mut</span> <span class="ty">Context</span>&lt;Self&gt;) {', '        <span class="cm">// purr at 120fps</span>', '        cx.<span class="fn">notify</span>();', '    }', '}'] };
  let file = 'scheduler.tsx', thr = 0; const code = h('div.zd-code'), tabs = h('div.zd-tabs'), thl = h('div.zd-th'), agT = h('div');
  const drawEd = () => { tabs.replaceChildren(...Object.keys(FILES).map((f) => h('span' + (f === file ? '.on' : ''), { onclick: () => { file = f; drawEd(); } }, f)), h('span', {}, '⎇ Uncommitted'));
    code.replaceChildren(h('div', { style: { color: 'var(--mu)', paddingLeft: '10px' }, class: 'np' }), ...FILES[file].map((l) => h('div', { html: l || ' ' }))); code.firstChild.remove();
    let k = 0; thl.replaceChildren(h('div', { style: { padding: '4px 8px', borderBottom: '1px solid var(--ln)', color: 'var(--mu)' } }, '⌕ Search…'), ...THR.flatMap(([g, L]) => [h('div.g', {}, g), ...L.map(([t, m]) => { const id = k++; return h('div.t' + (id === thr ? '.on' : ''), { onclick: () => { thr = id; drawEd(); } }, (id === thr ? '● ' : '◌ ') + t, h('small', {}, m)); })]));
    const all = THR.flatMap(([, L]) => L); agT.textContent = all[thr][0]; };
  const ed = h('div.zd-ed', {}, h('div.tb', {}, h('i', { style: { background: '#ff5f57' } }), h('i', { style: { background: '#febc2e' } }), h('i', { style: { background: '#28c840' } }), h('span', { style: { marginLeft: '8px' } }, 'zed  ⎇ main  /  ⑂ main')), thl,
    h('div.zd-ag', {}, h('div', { style: { fontWeight: 500 } }, agT), h('div.q', {}, 'I want to add AccessKit support to GPUI so screen readers can traverse the element tree. Can you start by figuring out where the accessibility tree should be built?'), h('div.a', {}, 'I’ll start by reading the GPUI element trait and the window draw path.'), h('div.tl', {}, '⌕ Searched “trait Element” · 14 results'), h('div.tl', {}, '▤ Read crates/gpui/src/element.rs'), h('div.a', {}, 'The tree should be built during prepaint, after layout, so bounds are known…')),
    h('div.zd-cd', {}, tabs, h('div', { style: { overflow: 'hidden' } }, h('div', { style: { padding: '4px 10px', color: 'var(--mu)', borderBottom: '1px solid var(--ln)' } }, 'src/components/' + 'scheduler.tsx'), code)));
  const wd = h('div.zd-wd', { onclick: () => toast('Watch Demo — 2:14 product film (demo)') }, '▶ Watch Demo');
  zed.append(fr, h('div.zd-in', {}, h('div.zd-nav', {}, h('span.zd-lg', {}, h('i', {}, 'Z'), 'Zed'), ...['Product ⌄', 'Resources ⌄', 'Extensions', 'Docs', 'Pricing'].map((t) => h('a', { onclick: () => toast(t.replace(' ⌄', '') + ' (demo)') }, t)), h('span.sep'), h('a', { onclick: () => toast('Delta (demo)') }, '△ Delta'),
      h('span.sp'), h('span.zd-sch', { title: 'Open command palette', onclick: () => openPal() }, '⌕', h('kbd', {}, 'Ctrl + Shift + P')), h('span.sep'), suNav, dlNav),
    h('div.zd-news', { onclick: () => toast('Delta public beta (demo)') }, h('b', {}, 'News:'), h('span', {}, 'Delta is now in public beta. Try it today.'), '→'),
    h('div.zd-hero', { html: art }, h('div.in', {}, h('h1', {}, 'Your last next editor'), h('p', { html: 'Zed is a minimal code editor crafted for<br>speed and collaboration with humans and AI.' }), h('div.zd-cta', {}, dlBtn, clBtn), h('div.zd-av', {}, 'Available for macOS, Linux, and Windows'))),
    h('div.zd-cols', {}, [['Fast', 'Written from scratch in Rust to efficiently leverage multiple CPU cores and your GPU.'], ['Agentic', 'Run agents in parallel to smoothly edit files, navigate code, and run tools at native speed.'], ['Collaborative', 'Chat with teammates, code together, and share your screen and project.']].map(([t, p]) => h('div', {}, h('h3', {}, t), h('p', {}, p)))),
    h('div', { style: { position: 'relative', marginTop: '26px' } }, wd, ed), h('div', { style: { height: '80px' } })), palBg, modal);
  // move hero art behind text
  const heroEl = zed.querySelector('.zd-hero'); heroEl.prepend(heroEl.querySelector('svg'));
  root.append(zed); mkFrame(); drawEd();
  window.__demoProof = async () => { const out = [], key = (k, o = {}) => window.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...o }));
    const wo = window.open; window.open = (u) => { flags.opened = u; return null; };
    try {
      key('d'); key('s'); await sleep(30); out.push(`D→download=${flags.download} S→signup modal=${modal.classList.contains('on')}`); key('Escape'); key('c'); out.push(`C→open ${flags.opened}`);
      key('P', { ctrlKey: true, shiftKey: true }); await sleep(40); out.push(`Ctrl+Shift+P palette=${palOpen} sections=${[...ls.querySelectorAll('.sc')].map((x) => x.textContent).join('/')} items=${items.length}`);
      key('ArrowDown'); key('ArrowDown'); out.push(`arrow highlight="${ls.querySelector('.it.on')?.textContent}"`);
      inp.value = 'dark'; inp.dispatchEvent(new Event('input')); out.push(`filter "dark" → ${items.map((i) => i[0]).join('|')}`); key('Enter'); await sleep(400);
      out.push(`return → dark=${dark} bg=${getComputedStyle(zed).backgroundColor} palette=${palOpen}`);
      key('P', { ctrlKey: true, shiftKey: true }); inp.value = 'dark'; inp.dispatchEvent(new Event('input')); out.push(`label now "${items[0][0]}"`); key('Enter'); key('P', { ctrlKey: true, shiftKey: true }); key('Escape'); out.push(`esc closes=${!palOpen} dark=${dark}`);
    } finally { window.open = wo; }
    modal.classList.remove('on'); setDark(false); closePal(); file = 'scheduler.tsx'; thr = 0; drawEd(); root.scrollTop = 0; return out.join('; ') + '; restored'; };
};
V['arc-stitched-banner-grain-blue-quote-marquee'] = (root, T) => {
  import('@fontsource-variable/nunito');
  theme(root, T, { bg: '#3139fb', fg: '#fff', ac: '#3139fb', dark: false }); scroll(root);
  const RS = "'Nunito Variable','Marlin Soft SQ',system-ui,sans-serif", EX = "'Fraunces Variable','Exposure VAR',Georgia,serif", IN = "'Inter Variable',system-ui,sans-serif";
  const CREAM = '#fffcec', BLUE = '#3139fb';
  const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 -.12'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E")`;
  const wave = (fill, flip) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8'%3E%3Cpath d='${flip ? 'M0 8 L0 4 Q3.5 0 7 4 T14 4 L14 8Z' : 'M0 0 L0 4 Q3.5 8 7 4 T14 4 L14 0Z'}' fill='${fill.replace('#', '%23')}'/%3E%3C/svg%3E")`;
  root.append(h('style', {}, `.ar{background:${BLUE};color:#fff;font:400 15px/1.5 ${RS};min-height:100%;position:relative}
.ar-g{background-color:${BLUE};background-image:${grain};background-size:220px}
.ar-nav{position:sticky;top:0;z-index:20;height:76px;display:flex;align-items:center;gap:30px;padding:0 44px;font:600 14px ${IN}}.ar-nav a{color:#fff;cursor:pointer;display:flex;gap:6px;align-items:center}.ar-nav a:hover{opacity:.8}
.ar-dia{position:sticky;top:76px;z-index:19;background:${CREAM};color:#111;transition:padding .35s}
.ar-dia:before,.ar-dia:after{content:'';position:absolute;left:0;right:0;height:8px;background-repeat:repeat-x}.ar-dia:before{top:-7px;background-image:${wave(CREAM, true)}}.ar-dia:after{bottom:-7px;background-image:${wave(CREAM, false)};opacity:0;transition:opacity .2s}
.ar-dia .glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(30% 60% at 0% 10%,#ffc2ec99,transparent),radial-gradient(30% 60% at 100% 10%,#ffd4a899,transparent);transition:opacity .35s}
.ar-dia .row{position:relative;max-width:1100px;margin:0 auto;display:flex;flex-direction:column;align-items:center;text-align:center;padding:40px 24px 26px;gap:0;transition:padding .35s}
.ar-dia h2{font:600 40px/1.15 ${EX};letter-spacing:-.02em;margin:0;font-variation-settings:'opsz' 72,'SOFT' 50;transition:font-size .35s}
.ar-dia p{font:400 19px ${IN};color:#555;margin:14px 0 22px;max-height:40px;overflow:hidden;transition:all .3s}
.ar .ar-try{white-space:nowrap;flex:none;display:inline-flex;align-items:center;gap:14px;background:#222;color:#fff;border:0;border-radius:14px;padding:7px 18px 7px 7px;font:500 22px ${IN};cursor:pointer;box-shadow:0 8px 24px #0003;transition:transform .15s}.ar .ar-try:hover{transform:translateY(-1px)}.ar .ar-try i{width:46px;height:46px;border-radius:10px;background:#fff;display:grid;place-items:center}.ar .ar-try i b{width:34px;height:34px;border-radius:50% 50% 30% 30%;background:linear-gradient(180deg,#7cb4ff 10%,#ff8f8f 55%,#ffcf4a 85%)}
.ar-dia.mini .row{flex-direction:row;justify-content:space-between;padding:16px 140px;text-align:left}.ar-dia.mini h2{font-size:32px}.ar-dia.mini p{max-height:0;margin:0;opacity:0}.ar-dia.mini .ar .ar-try{font-size:17px;padding:5px 14px 5px 5px}.ar-dia.mini .ar .ar-try i{width:36px;height:36px}.ar-dia.mini .ar .ar-try i b{width:26px;height:26px}.ar-dia.mini:after{opacity:1}
.ar-diab{background:linear-gradient(180deg,${CREAM} 55%,#e4e2ff);position:relative;padding:4px 0 60px;color:#111}.ar-diab:after{content:'';position:absolute;left:0;right:0;bottom:-7px;height:8px;background-image:${wave(CREAM, false)};background-repeat:repeat-x}
.ar-win{max-width:880px;margin:0 auto;border-radius:12px;background:#fff;box-shadow:0 30px 70px #3139fb2a,0 0 0 1px #0000000f;display:grid;grid-template-columns:180px 1fr;overflow:hidden;font:400 12px ${IN};height:250px}
.ar-win .sb{background:#f3f4f7;padding:10px;display:flex;flex-direction:column;gap:8px}.ar-win .tl{display:flex;gap:5px}.ar-win .tl i{width:8px;height:8px;border-radius:50%;background:#d8d8dc}
.ar-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.ar-tiles span{height:34px;border-radius:7px;background:#fff;display:grid;place-items:center;font-size:14px}
.ar-sbi{padding:6px 8px;border-radius:7px;display:flex;gap:7px;align-items:center}.ar-sbi.on{background:#fff;box-shadow:0 1px 2px #0001}
.ar-chat{padding:12px 30px;display:flex;flex-direction:column;gap:12px}.ar-bub{align-self:flex-end;background:#a9d4f5;border-radius:16px;padding:9px 16px;font-size:12.5px}.ar-chat h4{font:500 17px/1.35 ${IN};margin:0}.ar-chat small{color:#999}
.ar-hero{position:relative;text-align:center;padding:70px 24px 0}.ar-q{font:800 62px/1.08 ${RS};letter-spacing:-.025em;max-width:980px;margin:0 auto}.ar-verge{font:900 19px ${IN};letter-spacing:-.06em;margin:22px 0 30px;transform:scaleY(1.2)}
.ar-fyi{font:800 12px/1.3 ${RS};letter-spacing:.06em;max-width:330px;margin:0 auto 32px}
.ar-dl{display:flex;gap:12px;justify-content:center}.ar .ar-dl button{height:38px;padding:0 50px;border-radius:5px;border:0;font:500 13.5px ${IN};cursor:pointer;display:flex;align-items:center;gap:10px;transition:transform .12s}.ar .ar-dl button:hover{transform:translateY(-1px)}.ar .ar-dl .w{background:#fff;color:${BLUE}}.ar .ar-dl .m{background:#2d12d6;color:#fff}
.ar-mock{position:relative;max-width:830px;margin:44px auto 0;background:#ff8a91;border-radius:10px 10px 0 0;padding:8px 8px 0;display:grid;grid-template-columns:166px 1fr;height:330px;text-align:left;color:#111;font:500 12px ${IN};box-shadow:0 30px 60px #0003}
.ar-mock .sb{padding:4px 6px;display:flex;flex-direction:column;gap:10px}.ar-mock .url{background:#ffffff4d;border-radius:7px;padding:7px 8px;font-size:11px}.ar-mock .pg{background:#fff;border-radius:6px 6px 0 0;padding:16px 18px;overflow:hidden}
.ar-mock .ph{height:250px;border-radius:12px;margin-top:20px;background:radial-gradient(7% 11% at 46% 36%,#ff4f7b,#c8164a 70%,transparent 72%),radial-gradient(8% 12% at 56% 30%,#f2386a,#b3123f 70%,transparent 72%),radial-gradient(7% 10% at 62% 44%,#ff6b8f,#d01c50 70%,transparent 72%),radial-gradient(8% 12% at 50% 52%,#e02a5c,#a50f38 70%,transparent 72%),radial-gradient(6% 9% at 40% 50%,#ff8aa8,#d93366 70%,transparent 72%),radial-gradient(4% 30% at 52% 80%,#3d6b3a,transparent 70%),radial-gradient(22% 40% at 30% 85%,#241c22,transparent 70%),linear-gradient(180deg,#8fb4d0,#b9b7b0 70%,#c9b49a)}
.ar-more{position:absolute;right:-90px;top:110px;font:600 10px ${IN};letter-spacing:.14em;color:#fff;text-align:center;line-height:1.3}
.ar-mq{position:relative;background:${CREAM};color:${BLUE};height:62px;overflow:hidden;display:flex;align-items:center;z-index:2}.ar-mq:before,.ar-mq:after{content:'';position:absolute;left:0;right:0;height:8px;background-repeat:repeat-x}
.ar-mqw{position:relative;z-index:3}.ar-mqw:before,.ar-mqw:after{content:'';position:absolute;left:0;right:0;height:8px;background-repeat:repeat-x;z-index:4}.ar-mqw:before{top:-7px;background-image:${wave(CREAM, true)}}.ar-mqw:after{bottom:-7px;background-image:${wave(CREAM, false)}}
.ar-trk{display:flex;gap:44px;white-space:nowrap;animation:marquee 46s linear infinite;font:800 16px ${RS};padding-left:20px;will-change:transform}.ar-mq:hover .ar-trk{animation-play-state:paused}.ar-trk span{display:flex;align-items:center;gap:16px}.ar-trk b{font:900 15px ${IN};letter-spacing:-.04em}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-25%)}}
.ar-w{background:#fff;color:#222;padding:90px 24px 70px;text-align:center}.ar-w h3{font:800 34px/1.15 ${RS};color:${BLUE};letter-spacing:-.02em;margin:0 0 10px}.ar-w .sub{font:400 15px ${IN};color:#666;margin:0 0 36px}.ar-w .sub b{color:#222}
.ar-col{max-width:820px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:120px 120px;gap:8px;padding:10px;background:#fff;border-radius:10px;box-shadow:0 20px 50px #0002}.ar-col div{border-radius:4px}
.ar-sp{max-width:820px;margin:0 auto;border-radius:12px;display:grid;grid-template-columns:170px 1fr;height:300px;overflow:hidden;text-align:left;font:500 12px ${IN};box-shadow:0 26px 60px #0002;transition:background .35s;padding:7px}.ar-sp .sb{padding:6px;display:flex;flex-direction:column;gap:7px}.ar-sp .pg{border-radius:6px;overflow:hidden;transition:background .35s;padding:22px;color:#fff;font:900 30px/1 ${IN}}
.ar-dots{display:flex;gap:8px;justify-content:center;margin-top:16px}.ar .ar-dots button{border:1px solid #ddd;background:#fff;border-radius:99px;padding:6px 14px;font:600 12px ${IN};cursor:pointer;color:#333}.ar .ar-dots button.on{background:${BLUE};color:#fff;border-color:${BLUE}}
.ar-split{max-width:820px;margin:0 auto;display:grid;gap:7px;padding:7px;border-radius:12px;background:#7fe0b4;height:260px;transition:grid-template-columns .45s;box-shadow:0 26px 60px #0002}.ar-split div{border-radius:6px;background:#fff;text-align:left;padding:14px;font:500 12px ${IN};overflow:hidden}
.ar-tw{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;max-width:1080px;margin:0 auto}.ar-tw div{background:${CREAM};border-radius:14px;padding:18px;text-align:left;font:700 16px/1.35 ${RS};color:#222}.ar-tw small{display:block;margin-top:14px;font:700 11px ${IN};letter-spacing:.08em;color:${BLUE}}
.ar-end{text-align:center;padding:80px 24px 50px}.ar-end h3{font:800 46px ${RS};margin:0 0 24px}.ar-ft{display:flex;gap:80px;justify-content:center;font:500 12px/2 ${IN};padding:40px 0 60px;opacity:.9}.ar-ft b{display:block;font-size:11px;letter-spacing:.12em;opacity:.7}`));
  const logo = h('span', { html: `<svg width="30" height="28" viewBox="0 0 30 28"><path d="M4 22C2 14 8 4 15 4s12 8 11 16" fill="none" stroke="#ff4f5e" stroke-width="7" stroke-linecap="round"/><path d="M6 21c3-6 10-9 18-6" fill="none" stroke="#ffd23f" stroke-width="5" stroke-linecap="round"/><circle cx="15" cy="16" r="4" fill="#fff"/></svg>` });
  const ar = h('div.ar'); root.append(ar);
  const nav = h('div.ar-nav.ar-g', {}, logo, ...[['Max', '◈'], ['Mobile', '▯'], ['Developers'], ['Students'], ['Blog']].map(([t, i]) => h('a', { onclick: () => toast(`→ arc.net/${t.toLowerCase()} (demo)`) }, t, i ? h('span', { style: { opacity: .8, fontSize: '12px' } }, i) : null)));
  let tries = 0; const tryBtn = h('button.ar-try', { onclick: () => { tries++; toast('Opening diabrowser.com… (demo)'); } }, h('i', {}, h('b')), 'Try Dia', h('span', { style: { opacity: .7 } }, '→'));
  const dia = h('div.ar-dia', {}, h('div.glow'), h('div.row', {}, h('div', {}, h('h2', {}, 'Meet Dia, the next evolution of Arc'), h('p', {}, 'Weekly security updates, SOC 2 certification, and the Arc DNA you know (and love).')), tryBtn));
  const diaBody = h('div.ar-diab', {}, h('div.ar-win', {}, h('div.sb', {}, h('div.k-row', { style: { justifyContent: 'space-between' } }, h('div.tl', {}, h('i'), h('i'), h('i')), h('span', { style: { background: '#5aa8e6', color: '#fff', borderRadius: '5px', padding: '2px 10px', fontSize: '11px' } }, 'Work ⌄')), h('div.ar-tiles', {}, ...['✉️', '📓', '🔵', '📅', '🎵', '🐙'].map((e) => h('span', {}, e))), h('div.ar-sbi.on', {}, '💬 New Chat'), h('div.ar-sbi', {}, '# Slack'), h('div.ar-sbi', {}, '◆ Figma')), h('div', {}, h('div', { style: { padding: '8px 12px', borderBottom: '1px solid #eee', color: '#999', fontSize: '11px' } }, '‹  ›  ↻   Dia / New Chat'), h('div.ar-chat', {}, h('div.ar-bub', {}, 'what are my priorities this week based on my 📑 Tabs?'), h('small', {}, 'Thought for 5 seconds ›'), h('h4', {}, 'Your priorities this week are GTM/marketing work, revenue alignment, and staying on top of comms.'), h('span', { style: { color: '#999' } }, 'Looking at your open tabs, it seems like the week is orbiting three cores: the calendar, GTM/marketing, and revenue.')))));
  const squig = h('div', { html: `<svg width="16" height="90" viewBox="0 0 16 90" fill="none" stroke="#fff" stroke-width="1.3"><path d="M8 0c6 6-6 10 0 16s-6 10 0 16-6 10 0 16-6 10 0 16 0 14 0 20M2 78l6 8 6-8"/></svg>`, style: { marginTop: '8px' } });
  let dls = 0; const dl = (os) => () => { dls++; toast(`Downloading Arc for ${os}… (demo)`); };
  const hero = h('div.ar-hero.ar-g', {}, h('div.ar-q', {}, '“Arc is the Chrome replacement I’ve been waiting for.”'), h('div.ar-verge', {}, 'THE VERGE'),
    h('div.ar-fyi', {}, 'FYI: Arc receives Chromium updates only. For active security patches and enterprise-grade protection, download Dia instead.'),
    h('div.ar-dl', {}, h('button.w', { onclick: dl('Windows') }, h('span', {}, '⊞'), 'Download Arc for Windows'), h('button.m', { onclick: dl('Mac') }, h('span', {}, ''), 'Download Arc for Mac')),
    h('div.ar-mock', {}, h('div.sb', {}, h('div.k-row', { style: { gap: '6px', color: '#0007', fontSize: '11px' } }, '● ● ●   ▭   ←  →  ↻'), h('div.url', {}, 'mmmhome.io'), h('div.ar-tiles', {}, h('span', { style: { background: '#ffffff55' } }, '◐'), h('span', { style: { background: '#ffffff55' } }, '✉'), h('span', { style: { background: '#ffffff55' } }, 'ⅰ')), h('small', { style: { opacity: .6 } }, 'Personal'), h('div', {}, '🟢 Spotify'), h('div', {}, '📁 Merida Trip'), h('div', { style: { paddingLeft: '14px' } }, '📁 Travel Docs')), h('div.pg', {}, h('div.k-row', { style: { justifyContent: 'space-between' } }, h('b', { style: { letterSpacing: '.35em', color: '#ff7c86', fontSize: '15px' } }, 'MMMHOME'), h('span', { style: { color: '#666', fontSize: '10px', wordSpacing: '30px' } }, 'Shop Travel Art 🛍')), h('div.ph'))), h('div.ar-more', {}, 'MORE', h('br'), 'DETAILS', squig));
  hero.querySelector('.ar-mock').append(hero.querySelector('.ar-more'));
  const QUOTES = [['Rethinking the fundamentals of how we use the web.', 'Bloomberg'], ['Arc is the best browser to come out in the last decade.', 'INVERSE'], ['Arc is the new browser I’ve most enjoyed using.', 'FAST COMPANY'], ['Arc is a great name.', 'THE VERGE']];
  const trk = h('div.ar-trk', {}, ...Array.from({ length: 4 }, () => QUOTES.map(([q, s]) => h('span.q', {}, `“${q}”`, h('b', {}, s)))).flat());
  const mq = h('div.ar-mqw', {}, h('div.ar-mq', {}, trk));
  // feature sections
  const pics = ['linear-gradient(160deg,#c9b89a,#6f8aa0)', 'linear-gradient(180deg,#e9eef0,#8a9aa6)', 'linear-gradient(170deg,#5d7b4f,#a7b98d)', 'linear-gradient(180deg,#2d2a26,#6a5f52)', 'linear-gradient(180deg,#1f1b18,#7b6b55)', 'linear-gradient(180deg,#b9d3e6,#d8c6a6 60%,#8a7f6a)', 'linear-gradient(180deg,#ddd5c8,#9b8a75)'];
  const col = h('div.ar-col', {}, h('div', { style: { background: pics[0], gridRow: '1/3' } }), h('div', { style: { background: pics[1] } }), h('div', { style: { background: pics[2] } }), h('div', { style: { background: pics[3] } }), h('div', { style: { background: pics[5], gridColumn: '2/4' } }), h('div', { style: { background: pics[6] } }));
  const SPACES = { Work: ['#c9c6ff', '#3b2fd6', 'ONETWO3 LOS ANGELES, CA 07.25.23', ['Year End Planning', 'Brainstorms', 'Q2 Planning', 'Workflows']], Personal: ['#ffd0c2', '#ff6a3d', 'MERIDA TRIP · 12 SAVED PLACES', ['Spotify', 'Merida Trip', 'Travel Docs', 'Recipes']], Hobbies: ['#bff0d4', '#0f8f5f', 'MF ZINE v.013 — TAKE ROOT', ['Plant Shop', 'Zine Drafts', 'Moodboard', 'Climbing']] };
  let space = 'Work'; const spSb = h('div.sb'), spPg = h('div.pg'), sp = h('div.ar-sp', {}, spSb, spPg);
  const spBtns = h('div.ar-dots'); const setSpace = (k) => { space = k; const [bg, ac, title, items] = SPACES[k]; sp.style.background = bg; spPg.style.background = ac; spPg.textContent = title; spSb.replaceChildren(h('div', { style: { opacity: .6 } }, '● ● ●   ←  →'), h('div', { style: { background: '#ffffff88', borderRadius: '6px', padding: '6px 8px' } }, `${k.toLowerCase()}.arc`), h('small', { style: { opacity: .6 } }, k), ...items.map((n) => h('div', {}, '📁 ', n))); [...spBtns.children].forEach((b) => b.classList.toggle('on', b.textContent === k)); };
  Object.keys(SPACES).forEach((k) => spBtns.append(h('button', { onclick: () => setSpace(k) }, k)));
  let split = true; const splitEl = h('div.ar-split', {}, h('div', {}, h('b', {}, 'Take Root: nine homes with gorgeous gardens for sale'), h('div', { style: { height: '120px', marginTop: '10px', borderRadius: '6px', background: pics[2] } })), h('div', { style: { background: '#fff8d6', fontFamily: 'monospace', fontSize: '22px', color: '#7a6cd8' } }, 'mf', h('br'), 'zine', h('br'), 'v.013'));
  const setSplit = (v) => { split = v; splitEl.style.gridTemplateColumns = v ? '1fr 1fr' : '1fr 0fr'; };
  const splitBtn = h('div.ar-dots', {}, h('button.on', { onclick: (e) => { setSplit(!split); e.currentTarget.classList.toggle('on', split); e.currentTarget.textContent = split ? 'Split View: on' : 'Split View: off'; } }, 'Split View: on'));
  const sec = (title, sub, ...kids) => h('div.ar-w', {}, h('h3', {}, title), h('p.sub', { html: sub }), ...kids);
  ar.append(nav, dia, diaBody, hero, mq,
    sec('A browser that doesn’t just meet your needs — it anticipates them.', 'Clean and calm, Arc shapes itself to how you use the internet.', col),
    sec('Space for the different sides of you.', 'Effortlessly organize everything you do online — work, study, hobbies — all in one window with <b>Spaces</b> and <b>Profiles</b>.', sp, spBtns),
    sec('Your perfect setup.', 'Find your perfect setup with <b>Split View</b>, <b>Themes</b>, and more.', splitEl, splitBtn),
    sec('The comfort of privacy.', 'Arc is built from the ground up to be private and secure. We don’t know what sites you visit or what you search for.<br><a style="color:#3139fb;font-weight:600;cursor:pointer">Learn more about privacy in Arc →</a>', h('div.ar-tw', {}, [['Way more powerful than Chrome. Arc looks like the future of browsers.', '@BEEBOMCO'], ['Arc brought order to the chaos that was my online life. There’s no going back.', '@KATELAURIELEE'], ['Arc lives up to the hype. So intuitive, playful and pretty.', '@FIVEBOIII'], ['I just tried using a computer without Arc and it was miserable.', '@MARKFISHMAN_XYZ']].map(([q, a]) => h('div', {}, q, h('small', {}, a))))),
    h('div.ar-end.ar-g', {}, h('h3', {}, 'Enter your new home on the internet'), h('div.ar-dl', {}, h('button.w', { onclick: dl('Windows') }, h('span', {}, '⊞'), 'Download Arc for Windows')), h('div.ar-ft', {}, h('div', {}, h('b', {}, 'PRODUCT'), 'Download', h('br'), 'Privacy Policy', h('br'), 'Terms of Use', h('br'), 'Arc Max'), h('div', {}, h('b', {}, 'RESOURCES'), 'Resource Center', h('br'), 'Release Notes', h('br'), 'Students', h('br'), 'FAQ'), h('div', {}, h('b', {}, 'COMPANY'), 'Careers @ BCNY', h('br'), 'Arc for iPhone', h('br'), 'Integrations', h('br'), 'Credits'))));
  setSpace('Work'); setSplit(true);
  const onScroll = () => dia.classList.toggle('mini', root.scrollTop > 40); root.addEventListener('scroll', onScroll); onScroll();
  window.__demoProof = async () => { const s0 = root.scrollTop, sp0 = space; const frames = [];
    for (const y of [0, 600, 1200, 1800, 2600]) { root.scrollTop = y; onScroll(); await sleep(120); const r = dia.getBoundingClientRect(), n = nav.getBoundingClientRect(), d = root.getBoundingClientRect(); frames.push(`${y}:${Math.round(r.top - d.top)}${dia.classList.contains('mini') ? 'm' : ''}`); }
    const pinned = frames.slice(1).every((f) => f.split(':')[1] === '76m');
    const anim = getComputedStyle(trk).animationName, qn = trk.querySelectorAll('.q').length; const x1 = new DOMMatrix(getComputedStyle(trk).transform).m41; await sleep(400); const x2 = new DOMMatrix(getComputedStyle(trk).transform).m41;
    setSpace('Hobbies'); const hb = spPg.textContent; setSpace(sp0); setSplit(false); setSplit(true);
    root.scrollTop = s0; onScroll();
    return `banner top per scrollY [${frames.join(', ')}] pinned=${pinned}; marquee animation=${anim}, quotes=${qn} (4×${QUOTES.length}), moving=${x2 < x1}; space Hobbies → "${hb}"; split toggled; restored scroll + Work space`; };
};
V['screen-studio-editor-timeline-hero-tabbed-zoom-clips'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#fff', ac: '#4d2ff5', dark: true }); scroll(root);
  const IN = "'Inter Variable','SF Pro Display',system-ui,sans-serif", VI = '#4d2ff5', AM = '#cc8c14';
  root.append(h('style', {}, `.sx{background:#000;color:#fff;font:400 15px/1.5 ${IN};min-height:100%;position:relative;letter-spacing:-.005em}
.sx button{cursor:pointer}
.sx-nav{position:sticky;top:8px;z-index:20;width:min(820px,calc(100% - 32px));margin:8px auto 0;height:44px;display:flex;align-items:center;gap:22px;padding:0 10px 0 14px;border-radius:12px;border:1px solid transparent;transition:background .3s,border-color .3s,backdrop-filter .3s}
.sx-nav.glass{background:#18181bd9;border-color:#ffffff14;backdrop-filter:blur(14px);box-shadow:0 10px 30px #0008}
.sx-nav .lg{display:flex;align-items:center;gap:8px;font:600 16px ${IN};letter-spacing:-.02em;margin-right:auto}.sx-nav a{color:#bbb;font-size:13px;cursor:pointer}.sx-nav a:hover{color:#fff}
.sx .sx-ex{border:1px solid #ffffff24;background:#0b0b0d;color:#ddd;border-radius:7px;height:28px;padding:0 10px;font-size:13px}.sx .sx-cta{background:${VI};color:#fff;border:0;border-radius:6px;height:28px;padding:0 12px;font:500 13px ${IN};box-shadow:inset 0 1px 0 #ffffff30}.sx .sx-cta:hover{filter:brightness(1.1)}
.sx-menu{position:absolute;right:120px;top:50px;background:#141416;border:1px solid #ffffff1a;border-radius:12px;padding:16px 18px;display:none;grid-template-columns:repeat(3,160px);gap:12px;font-size:13px;box-shadow:0 30px 60px #000a}.sx-menu.on{display:grid}.sx-menu b{display:block;color:#888;font-size:11px;font-weight:600;margin-bottom:6px}.sx-menu div div{color:#ddd;padding:3px 0;cursor:pointer}.sx-menu div div:hover{color:#fff}
.sx-ring{width:64px;height:64px;border-radius:50%;margin:46px auto 22px;background:conic-gradient(from 200deg,#6d4dff,#c39bff,#6d4dff,#3b1fd6,#6d4dff);-webkit-mask:radial-gradient(circle,transparent 15px,#000 16px);mask:radial-gradient(circle,transparent 15px,#000 16px);filter:drop-shadow(0 0 22px #7b5cff)}
.sx-glow{position:absolute;left:50%;top:40px;width:160px;height:120px;transform:translateX(-50%);background:radial-gradient(closest-side,#5b3cff55,transparent);pointer-events:none}
.sx-pill{display:table;margin:0 auto;border:1px solid #ffffff2a;background:#141416;border-radius:99px;padding:4px 12px;font:500 13px ${IN};color:#ddd}
.sx h1{font:600 64px/1.08 ${IN};letter-spacing:-.035em;text-align:center;margin:18px auto 22px;max-width:720px}
.sx-sub{text-align:center;color:#8a8a8f;font-size:19px;line-height:1.35;max-width:620px;margin:0 auto 30px}.sx-sub b{color:#fff;font-weight:500}
.sx .sx-big{display:flex;align-items:center;gap:10px;margin:0 auto;background:${VI};border:0;color:#fff;border-radius:8px;height:44px;padding:0 24px;font:500 16px ${IN};box-shadow:0 0 0 1px #ffffff1a inset,0 10px 30px #4d2ff544}.sx-os{text-align:center;color:#666;font-size:11px;margin-top:8px}
.sx-ed{position:relative;width:min(1080px,calc(100% - 48px));margin:44px auto 0;border-radius:22px;background:radial-gradient(120% 90% at 30% 0%,#2a2747,#121121 60%,#0b0b12);border:1px solid #ffffff14;padding:14px;box-shadow:0 40px 120px #2b1d8a44}
.sx-ed .tb{display:flex;align-items:center;gap:12px;color:#888;font-size:11px;padding:2px 6px 12px}.sx-ed .tb i{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:4px}.sx-ed .tb .fn{margin:0 auto;color:#aaa}.sx .sx-ed .ex{background:${VI};color:#fff;border:0;border-radius:5px;padding:3px 10px;font-size:11px}
.sx-body{display:grid;grid-template-columns:32px 1fr 230px;gap:12px;height:390px}
.sx-rail{display:flex;flex-direction:column;gap:12px;align-items:center;color:#777;font-size:13px;padding-top:6px}
.sx-cv{position:relative;border-radius:10px;overflow:hidden;transition:background .4s}.sx-cv .win{position:absolute;background:#f6f7f9;border-radius:9px;box-shadow:0 20px 50px #0007;overflow:hidden;color:#222;font:400 10px ${IN};transform-origin:50% 50%}
.sx-sh{display:grid;grid-template-columns:40px repeat(5,1fr);font-size:9.5px}.sx-sh span{border-right:1px solid #e3e3e3;border-bottom:1px solid #e3e3e3;padding:2px 5px;white-space:nowrap;overflow:hidden}.sx-sh .hl{background:#d5e3fb}
.sx-cam{position:absolute;width:118px;height:118px;border-radius:22px;background:radial-gradient(circle at 50% 38%,#e7b48f 0 16%,transparent 17%),radial-gradient(ellipse at 50% 92%,#1d1d1f 0 34%,transparent 35%),linear-gradient(160deg,#c9d3dc,#8d9aa8);box-shadow:0 10px 30px #0006;left:14px;bottom:14px}
.sx-cap{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);background:#000;color:#fff;font:500 15px ${IN};padding:4px 10px;border-radius:6px;transition:opacity .2s}
.sx-cur{position:absolute;width:14px;height:20px;pointer-events:none;z-index:3}.sx-cur:before{content:'';position:absolute;inset:0;background:#111;clip-path:polygon(0 0,0 85%,28% 64%,46% 100%,60% 94%,43% 60%,78% 60%);filter:drop-shadow(0 0 1px #fff) drop-shadow(0 1px 1px #fff)}
.sx-ins{background:#121219;border:1px solid #ffffff12;border-radius:10px;padding:10px;font-size:11px;color:#aaa;display:flex;flex-direction:column;gap:9px}.sx-ins .tabs{display:flex;gap:4px}.sx-ins .tabs span{padding:2px 7px;border-radius:5px}.sx-ins .tabs span.on{background:#ffffff1a;color:#fff}
.sx-sw{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}.sx-sw i{height:24px;border-radius:5px;cursor:pointer;border:2px solid transparent}.sx-sw i.on{border-color:#fff}
.sx-ins input[type=range]{width:100%;accent-color:${VI}}
.sx-tl{position:relative;margin-top:12px;height:96px;border-radius:10px;background:#0c0c12;border:1px solid #ffffff10;cursor:pointer;user-select:none;overflow:hidden}.sx-tl .ru{position:absolute;left:0;right:0;top:4px;height:14px;font-size:9px;color:#666}.sx-tl .ru span{position:absolute;transform:translateX(-50%)}
.sx-tl .clip{position:absolute;left:1%;right:1%;top:24px;height:30px;border-radius:7px;background:linear-gradient(180deg,#e09c1c,${AM});box-shadow:inset 0 0 0 1.5px #ffd27a88;font-size:10px;color:#0008;display:grid;place-items:center}
.sx-tl .zm{position:absolute;top:60px;height:26px;border-radius:7px;background:linear-gradient(180deg,#5b40f0,#4426d6);font-size:10px;color:#fffc;display:grid;place-items:center}
.sx-tl .ph{position:absolute;top:0;bottom:0;width:2px;background:#6b52ff;box-shadow:0 0 8px #6b52ff}.sx-tl .ph:before{content:'';position:absolute;left:-5px;top:0;width:12px;height:12px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#6b52ff}
.sx-ctl{display:flex;align-items:center;justify-content:center;gap:14px;color:#aaa;font-size:12px;margin-top:8px}.sx .sx-ctl button{background:#ffffff12;border:0;color:#fff;border-radius:50%;width:30px;height:30px}
.sx-used{text-align:center;color:#666;font-size:13px;margin:60px 0 18px}.sx-logos{display:flex;justify-content:center;gap:46px;color:#777;font:700 18px ${IN};letter-spacing:-.03em}
.sx-h2{font:600 46px/1.1 ${IN};letter-spacing:-.03em;text-align:center;margin:0 auto 14px;max-width:760px}.sx-p{text-align:center;color:#8a8a8f;font-size:18px;max-width:560px;margin:0 auto 34px}.sx-p b{color:#fff;font-weight:500}.sx-k{text-align:center;color:#8b74ff;font:500 15px ${IN};margin-bottom:8px}
.sx-show{overflow:hidden;margin-bottom:20px;-webkit-mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}.sx-show .tr{display:flex;gap:16px;width:max-content;animation:sxmq 60s linear infinite}.sx-show:hover .tr{animation-play-state:paused}
@keyframes sxmq{to{transform:translateX(-50%)}}.sx-card{width:300px;height:190px;border-radius:14px;padding:12px;display:flex;flex-direction:column;justify-content:flex-end;font-size:12px;color:#fff;border:1px solid #ffffff14}.sx-card b{font-size:14px}
.sx-stage{position:relative;width:min(1100px,calc(100% - 48px));height:520px;margin:0 auto;border-radius:24px;overflow:hidden;background:#0d0d10;border:1px solid #ffffff14}
.sx-seg{position:absolute;left:50%;top:22px;transform:translateX(-50%);z-index:5;display:flex;gap:2px;padding:3px;border-radius:10px;background:#1c1c1fcc;backdrop-filter:blur(10px);border:1px solid #ffffff14}.sx .sx-seg button{border:0;background:none;color:#ccc;border-radius:7px;padding:5px 15px;font-size:13px}.sx .sx-seg button.on{background:#f4f4f5;color:#111}
.sx .sx-pp{position:absolute;right:22px;top:22px;z-index:5;width:36px;height:36px;border-radius:50%;border:0;background:#2a2a2ecc;color:#fff;font-size:12px}
.sx-clip{position:absolute;inset:0;opacity:0;transition:opacity .35s;pointer-events:none}.sx-clip.on{opacity:1;pointer-events:auto}
.sx-pr{position:absolute;inset:0;background:#0b0b0e;transform-origin:0 0;padding:110px 70px 0}.sx-pr .sl{position:relative;height:4px;background:#333;border-radius:2px;margin:0 60px}.sx-pr .sl i{position:absolute;left:0;top:0;bottom:0;background:#ddd;border-radius:2px}.sx-pr .sl b{position:absolute;top:-7px;width:18px;height:18px;border-radius:50%;background:#eee;transform:translateX(-50%)}
.sx-pr .tk{display:flex;justify-content:space-between;margin:16px 46px 0;color:#777;font-size:11px}.sx-pr .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:40px}.sx-pr .cards div{border:1px solid #ffffff14;border-radius:12px;height:230px;text-align:center;padding-top:22px;color:#888;font-size:13px}.sx-pr .cards div.on{border-color:#ffffff33;background:#141417;color:#fff}.sx-pr .cards em{display:block;font:400 32px ${IN};font-style:normal;margin:24px 0 10px;color:inherit}
.sx-lens{position:absolute;width:190px;height:190px;border-radius:50%;overflow:hidden;border:3px solid #fff;box-shadow:0 20px 40px #000c;display:none;z-index:4}.sx-lens .sx-pr{transform-origin:0 0}
.sx-note{position:absolute;left:44px;bottom:30px;max-width:460px;font-size:15px;color:#ddd;z-index:4}.sx-zt{position:absolute;right:30px;bottom:26px;z-index:5;display:flex;gap:8px}.sx .sx-zt button{border:1px solid #ffffff2a;background:#0b0b0d;color:#ddd;border-radius:6px;padding:5px 12px;font-size:13px}.sx .sx-zt button.on{background:#fff;color:#111}
.sx-edc{position:absolute;inset:0;background:#030407}.sx-edc .trk{position:absolute;left:170px;right:-40px;top:200px;height:118px;border-radius:14px;background:linear-gradient(180deg,#e2a020,${AM});box-shadow:inset 0 0 0 2px #ffe0a0aa}.sx-edc .trk i{position:absolute;top:0;bottom:0;width:2px;background:#ffffff40}
.sx-edc .zz{position:absolute;left:165px;right:-40px;top:350px;height:116px;border-radius:14px;background:#1a1640}.sx-edc .drop{position:absolute;top:350px;height:116px;border-radius:14px;background:linear-gradient(180deg,#5b40f0,#4426d6);width:260px;display:grid;place-items:center;font:500 16px ${IN};color:#fffd}
.sx-edc .tag{position:absolute;left:136px;top:186px;width:58px;height:58px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#e0a72a;display:grid;place-items:center}.sx-edc .tag span{transform:rotate(45deg);font:700 13px ${IN};color:#111;text-align:center;line-height:1.1}
.sx-edc .t5{position:absolute;left:640px;top:166px;font:500 30px ${IN};color:#888}.sx-edc .hd{position:absolute;top:240px;font-size:70px;color:#fff;line-height:1;-webkit-text-stroke:6px #fff;color:transparent}
.sx-cla{position:absolute;inset:0;background:#e9e7e2;overflow:hidden}.sx-cla .lay{position:absolute;inset:0;color:#1a1a1a;padding:60px 0 0 0}.sx-cla .lay.org{filter:blur(2.6px) contrast(.9)}.sx-cla .lay.enh{clip-path:inset(0 0 0 var(--x))}
.sx-cla .pills{display:flex;gap:20px;padding-left:10px}.sx-cla .pills span{height:150px;border-radius:80px;background:#f7f6f3;box-shadow:inset 0 -6px 12px #0001,0 6px 16px #0002;display:grid;place-items:center;font:500 64px ${IN};padding:0 46px}
.sx-cla h3{font:600 96px/1 ${IN};letter-spacing:-.03em;margin:80px 0 0 0;white-space:nowrap}.sx-cla h4{font:500 84px/1 ${IN};margin:40px 0 0;white-space:nowrap;color:#3a3a3a}
.sx-cla .div{position:absolute;top:0;bottom:0;width:2px;background:#fff;left:var(--x);box-shadow:0 0 10px #0004}.sx-cla .lb{position:absolute;top:240px;background:#3a3a3acc;color:#fff;font-size:13px;padding:3px 10px;border-radius:6px}
.sx-cla:after{content:'';position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(transparent,#000b);z-index:1}.sx-up{z-index:2;position:absolute;left:50%;bottom:72px;transform:translateX(-50%);background:#2a2a2acc;color:#fff;font-size:13px;padding:3px 10px;border-radius:6px}.sx-cc{z-index:2;position:absolute;left:0;right:0;bottom:26px;text-align:center;color:#ddd;font-size:15px;padding:0 60px}.sx-cc b{color:#fff}
.sx-3{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;width:min(1100px,calc(100% - 48px));margin:36px auto 0;color:#8a8a8f;font-size:14.5px}.sx-3 b{color:#fff;font-weight:500}
.sx-price{display:grid;grid-template-columns:1fr 1fr;gap:16px;width:min(760px,calc(100% - 48px));margin:0 auto}.sx-price div{border:1px solid #ffffff1a;border-radius:16px;padding:24px;background:#0c0c0f}.sx-price em{font:600 40px ${IN};font-style:normal;display:block;margin:6px 0}
.sx-faq{width:min(760px,calc(100% - 48px));margin:0 auto}.sx-faq details{border-bottom:1px solid #ffffff14;padding:14px 0}.sx-faq summary{cursor:pointer;font-weight:500}.sx-faq p{color:#8a8a8f;margin:10px 0 0}
.sx-ck{position:fixed;left:0;right:0;bottom:0;z-index:30;background:#161618f2;border-top:1px solid #ffffff14;display:flex;align-items:center;justify-content:center;gap:24px;padding:12px 20px;font-size:12px;color:#aaa}.sx-ck p{max-width:680px;margin:0}.sx .sx-ck button{border:1px solid #ffffff24;background:#0b0b0d;color:#fff;border-radius:6px;padding:7px 12px;font-size:13px}.sx .sx-ck button.a{background:${VI};border-color:${VI}}`));
  const sx = h('div.sx'); root.append(sx);
  const ringLogo = `<svg width="22" height="22" viewBox="0 0 22 22"><defs><linearGradient id="sxg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c09bff"/><stop offset="1" stop-color="#5b3cff"/></linearGradient></defs><circle cx="11" cy="11" r="8" fill="none" stroke="url(#sxg)" stroke-width="4"/><path d="M5 13c4-1 8-3 12-6" stroke="#000" stroke-width="2"/></svg>`;
  const menu = h('div.sx-menu', {}, [['Screen Studio', ['Download for Mac', 'What’s new', 'Roadmap', 'Screen Studio Beta', 'Suggest a feature']], ['Help', ['Screen Studio Guide', 'Get in touch', 'Educational discount', 'I lost my license key', 'Telegram group']], ['Account', ['Manage your account', 'Manage subscription', 'Affiliate program', 'Brand materials']]].map(([t, L]) => h('div', {}, h('b', {}, t), L.map((l) => h('div', { onclick: () => { menu.classList.remove('on'); toast(`→ ${l} (demo)`); } }, l)))));
  const nav = h('div.sx-nav', {}, h('div.lg', { html: ringLogo + 'Screen Studio' }), h('a', {}, 'Pricing'), h('a', {}, 'Account'), h('button.sx-ex', { onclick: (e) => { e.stopPropagation(); menu.classList.toggle('on'); } }, 'Explore ⌄'), h('button.sx-cta', { onclick: () => toast('Downloading Screen Studio.dmg… (demo)') }, ' Download for Mac'), menu);
  sx.addEventListener('click', () => menu.classList.remove('on'));
  // ---------- editor mock ----------
  const WALL = ['linear-gradient(135deg,#2d3a8c,#7b3fa0 50%,#e0607e)', 'linear-gradient(135deg,#0f2027,#2c5364)', 'linear-gradient(135deg,#ff9a8b,#ff6a88 55%,#ff99ac)', 'linear-gradient(135deg,#43cea2,#185a9d)', 'linear-gradient(160deg,#f7b733,#fc4a1a)', 'linear-gradient(135deg,#1d1b31,#4d2ff5)', 'radial-gradient(circle at 30% 20%,#7ee8fa,#80ff72)', 'linear-gradient(135deg,#232526,#414345)', 'linear-gradient(135deg,#ee9ca7,#ffdde1)', 'linear-gradient(135deg,#8e2de2,#4a00e0)', 'linear-gradient(135deg,#c79081,#dfa579)', 'linear-gradient(135deg,#000428,#004e92)'];
  let wall = 0, pad = 9, t = 0, playing = true; const DUR = 10, ZS = 2.2, ZE = 6.6;
  const rows = [['Date', 'Description', 'Account', 'Category', 'Expense'], ['2017-05-12', 'Rent', 'Chequing', 'Household', '500.00'], ['2017-05-12', 'Weekly groceries', 'Chequing', 'Groceries', '100.00'], ['2017-05-12', 'Coffee and cake', 'Chequing', 'Restaurants', '10.00'], ['2017-05-12', 'Tomato sauce', 'Chequing', 'Groceries', '10.00'], ['2017-05-12', 'Fuel', 'Chequing', 'Car', '100.00'], ['2017-05-12', 'Strings', 'Chequing', 'Hobbies', '80.00'], ['2017-05-12', 'Dinner', 'Chequing', 'Restaurants', '45.00']];
  const sheet = h('div.sx-sh', {}, rows.flatMap((r, i) => [h('span', {}, String(i + 1)), ...r.map((c, j) => h('span' + (j === 4 && i ? '.hl' : ''), { style: i ? {} : { fontWeight: 600 } }, c))]), Array.from({ length: 36 }, () => h('span', {}, ' ')));
  const cur = h('div.sx-cur'); const cap = h('div.sx-cap', {}, 'now you can');
  const win = h('div.win', {}, h('div', { style: { padding: '6px 10px', background: '#fff', borderBottom: '1px solid #e5e5e5', display: 'flex', gap: '10px', alignItems: 'center' } }, h('b', { style: { color: '#188038', fontSize: '13px' } }, '▦'), h('b', { style: { fontSize: '12px' } }, 'Expenses'), h('span', { style: { color: '#666' } }, 'File  Edit  View  Insert  Format  Data  Tools'), h('span', { style: { marginLeft: 'auto', background: '#c2e7ff', borderRadius: '12px', padding: '2px 10px' } }, 'Upgrade')), h('div', { style: { padding: '4px 10px', color: '#666', borderBottom: '1px solid #e5e5e5' } }, '↶ ↷ 🖨  100%  $  %  .0  123   Arial  10  B I S'), sheet, cur);
  const cam = h('div.sx-cam'); const cv = h('div.sx-cv', {}, win, cam, cap);
  const sw = h('div.sx-sw', {}, WALL.map((w, i) => h('i', { style: { background: w }, onclick: () => setWall(i) })));
  const padIn = h('input', { type: 'range', min: 0, max: 22, value: pad, oninput: (e) => { pad = +e.target.value; } });
  const setWall = (i) => { wall = i; cv.style.background = WALL[i]; [...sw.children].forEach((el, k) => el.classList.toggle('on', k === i)); };
  const ins = h('div.sx-ins', {}, h('div.tabs', {}, h('span.on', {}, 'Wallpaper'), h('span', {}, 'Gradient'), h('span', {}, 'Color'), h('span', {}, 'Image')), h('div', {}, 'macOS · Spring · Sunset · Radiant'), sw, h('div', { style: { color: '#7b6bff' } }, '⟳ Pick random wallpaper'), h('div', {}, 'Padding'), padIn, h('div', {}, 'Background blur'), h('input', { type: 'range', min: 0, max: 10, value: 0 }));
  const ph = h('div.ph'), timeEl = h('span', {}, '0:00'); const tl = h('div.sx-tl', {}, h('div.ru', {}, Array.from({ length: 11 }, (_, i) => h('span', { style: { left: (1 + i * 9.8) + '%' } }, `0:${String(i).padStart(2, '0')}`))), h('div.clip', {}, '1× ⏱'), h('div.zm', { style: { left: (1 + ZS / DUR * 98) + '%', width: ((ZE - ZS) / DUR * 98) + '%' } }, '🔍 2× · Auto'), ph);
  const scrub = (e) => { const r = tl.getBoundingClientRect(); t = clamp(((e.clientX - r.left) / r.width - 0.01) / 0.98, 0, 1) * DUR; };
  drag(tl, { start: (e) => { scrub(e); }, move: (e) => scrub(e) });
  const playBtn = h('button', { onclick: () => { playing = !playing; playBtn.textContent = playing ? '❚❚' : '▶'; } }, '❚❚');
  const ed = h('div.sx-ed', {}, h('div.tb', {}, h('span', {}, h('i', { style: { background: '#ff5f57' } }), h('i', { style: { background: '#febc2e' } }), h('i', { style: { background: '#28c840' } })), '🗀  🗑', h('span.fn', {}, 'Expenses.screenstudio'), '⤺ ⤻', '☼ Presets ⌄', h('button.ex', { onclick: () => toast('Exporting MP4 1080p 60fps… (demo)') }, '⇪ Export')),
    h('div.sx-body', {}, h('div.sx-rail', {}, '🔍', '⊕', '▭', '◫', '☺', '▣', '✂', '⌨'), cv, ins), tl, h('div.sx-ctl', {}, timeEl, playBtn, h('span', {}, '1×  ⛶')));
  const path = [[0.62, 0.2], [0.45, 0.32], [0.58, 0.46], [0.78, 0.42], [0.66, 0.6], [0.62, 0.2]];
  let zoomV = 0; const curAt = (tt) => { const u = (tt / DUR) * (path.length - 1), i = Math.min(path.length - 2, Math.floor(u)), f = u - i, e = f * f * (3 - 2 * f); return [path[i][0] + (path[i + 1][0] - path[i][0]) * e, path[i][1] + (path[i + 1][1] - path[i][1]) * e]; };
  const renderEd = () => { const r = cv.getBoundingClientRect(); const W = r.width, H = r.height; const ins0 = pad * 4; win.style.left = ins0 + 'px'; win.style.top = ins0 * 0.7 + 'px'; win.style.width = W - ins0 * 2 + 'px'; win.style.height = H - ins0 * 1.4 + 'px';
    const [cx, cy] = curAt(t); cur.style.left = cx * 100 + '%'; cur.style.top = cy * 100 + '%'; const want = t > ZS && t < ZE ? 1 : 0; zoomV += (want - zoomV) * 0.08; const sc = 1 + 0.75 * zoomV; win.style.transformOrigin = `${cx * 100}% ${cy * 100}%`; win.style.transform = `scale(${sc})`;
    cap.style.opacity = t > 3 && t < 7.5 ? 1 : 0; ph.style.left = (1 + (t / DUR) * 98) + '%'; timeEl.textContent = `0:${String(Math.floor(t)).padStart(2, '0')}.${Math.floor((t % 1) * 10)} / 0:10`; };
  // ---------- showcase ----------
  const SHOW = [['Stripe', '@stripe', '#635bff'], ['Notion', '@NotionHQ', '#ededed'], ['Pitch', '@Pitch', '#ff6a3d'], ['GitHub', '@github', '#2b3137'], ['Y Combinator', '@ycombinator', '#ff6600'], ['Framer', '@framer', '#0055ff'], ['Shopify', '@Shopify', '#5e8e3e'], ['Tailwind CSS', '@tailwindcss', '#0ea5e9'], ['Supabase', '@supabase', '#3ecf8e'], ['Sentry', '@sentry', '#362d59'], ['v0', '@v0', '#111'], ['Webflow', '@webflow', '#146ef5']];
  const showTr = h('div.tr', {}, [...SHOW, ...SHOW].map(([n, at, c]) => h('div.sx-card', { style: { background: `linear-gradient(160deg,${c},#0b0b0f 85%)` } }, h('b', {}, n), h('span', { style: { color: '#aaa' } }, at))));
  // ---------- feature stage with 3 clips ----------
  const mkPricing = () => { const sl = h('div.sl', {}, h('i'), h('b')); return h('div.sx-pr', {}, h('div', { style: { textAlign: 'center', color: '#888', marginBottom: '26px', fontSize: '13px' } }, 'Start for free and scale as you grow.'), sl, h('div.tk', {}, ['3,000', '50,000', '100,000', '200,000', '500,000', '1,000,000', '1,500,000', '2,500,000', '3,000,000+'].map((x) => h('span', {}, x))), h('div.cards', {}, [['Free', '$0 / mo', '3,000 emails / mo'], ['Pro', '$20 / mo', '50,000 emails / mo'], ['Scale', '$90 / mo', '100,000 emails / mo'], ['Custom', 'Enterprise', 'Performance at any scale']].map(([a, b, c], i) => h('div' + (i === 1 ? '.on' : ''), {}, a, i === 1 ? h('div', { style: { color: '#4ade80', fontSize: '11px', marginTop: '6px' } }, 'Recommended') : null, h('em', {}, b), c)))); };
  const prA = mkPricing(), prB = mkPricing(), zcur = h('div.sx-cur', { style: { transform: 'scale(1.6)', zIndex: 6 } }); const lens = h('div.sx-lens', {}, prB);
  let loupe = false; const zt = h('div.sx-zt', {}, h('button.on', { onclick: () => setLoupe(false) }, 'Classic zoom'), h('button', { onclick: () => setLoupe(true) }, 'Loupe zoom'));
  const setLoupe = (v) => { loupe = v; [...zt.children].forEach((b, i) => b.classList.toggle('on', i === (v ? 1 : 0))); };
  const zoomClip = h('div.sx-clip', {}, h('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden' } }, prA), lens, zcur, h('div.sx-note', {}, 'Every zoom is balanced and animated for you. Screen Studio has two beautiful types of zoom to choose from.'), zt);
  const drop = h('div.drop', {}, '🔍 2× Zoom'); const tag = h('div.tag', {}, h('span', {}, '0.2s', h('br'), '✂'));
  const editClip = h('div.sx-clip', {}, h('div.sx-edc', {}, h('div', { style: { position: 'absolute', left: '170px', top: '30px', fontSize: '40px', color: '#aaa' } }, '✂'), h('div.t5', {}, '0:05'), h('div.trk', {}, [25, 50, 75].map((x) => h('i', { style: { left: x + '%' } }))), h('div.zz'), drop, tag, h('div.hd', { style: { left: '96px' } }, '◁'), h('div.hd', { style: { left: '206px' } }, '▷'), h('div', { style: { position: 'absolute', right: '30px', bottom: '30px', textAlign: 'right', color: '#ddd' } }, 'Every animation is created automatically.', h('br'), 'Adding a zoom is as easy as dropping it on the timeline.')));
  const layer = (cls) => h('div.lay.' + cls, {}, h('div.pills', {}, h('span', {}, '⇪ ···'), h('span', {}, '⧉'), h('span', {}, '⌕ Search')), h('h3', {}, 'Welcome to Apple Park'), h('h4', {}, 'Cupertino, California'));
  const claBox = h('div.sx-cla', {}, layer('org'), layer('enh'), h('div.div'), h('div.lb', { style: { left: '28px' } }, 'Original'), h('div.lb', { style: { right: '28px' } }, 'Enhanced'), h('div.sx-up', {}, '6.5× upscale'), h('div.sx-cc', { html: '<b>Our own real-time upscaler.</b> Trained on over 5,000 macOS screenshots and SwiftUI apps we generated, it runs entirely on your Mac.' }));
  const clarClip = h('div.sx-clip', {}, claBox);
  const CL = { Zoom: { el: zoomClip, t: 0, dur: 8, playing: false }, Editing: { el: editClip, t: 0, dur: 6, playing: false }, Clarity: { el: clarClip, t: 0, dur: 7, playing: false } };
  CL.Zoom.render = (tt) => { const u = tt / 8; const k = u < 0.25 ? u / 0.25 : u < 0.75 ? 1 : 1 - (u - 0.75) / 0.25; const e = k * k * (3 - 2 * k); const drag2 = clamp((u - 0.3) / 0.35, 0, 1); const sl = prA.querySelector('.sl'); const pos = 0.14 + drag2 * 0.3; [prA, prB].forEach((p) => { p.querySelector('.sl i').style.width = pos * 100 + '%'; p.querySelector('.sl b').style.left = pos * 100 + '%'; });
    const st = zoomClip.getBoundingClientRect(); const tx = sl.offsetLeft + pos * sl.offsetWidth, ty = sl.offsetTop + 2; const cx = tx + (1 - e) * 120, cy = ty + (1 - e) * 140;
    if (!loupe) { const s = 1 + 0.9 * e; prA.style.transform = `translate(${cx}px,${cy}px) scale(${s}) translate(${-cx}px,${-cy}px)`; lens.style.display = 'none'; zcur.style.left = cx + 'px'; zcur.style.top = cy + 'px'; }
    else { prA.style.transform = 'none'; lens.style.display = e > 0.05 ? 'block' : 'none'; lens.style.left = cx - 95 + 'px'; lens.style.top = cy - 95 + 'px'; prB.style.width = st.width + 'px'; prB.style.height = st.height + 'px'; prB.style.transform = `translate(${95 - cx * 2.2}px,${95 - cy * 2.2}px) scale(2.2)`; zcur.style.left = cx + 'px'; zcur.style.top = cy + 'px'; } };
  CL.Editing.render = (tt) => { const u = (tt % 6) / 6; const k = clamp((u - 0.15) / 0.35, 0, 1), e = 1 - Math.pow(1 - k, 3); drop.style.left = 300 + 60 * Math.sin(u * 6.28) * (1 - e) + 'px'; drop.style.transform = `translateY(${(1 - e) * -170}px) rotate(${(1 - e) * -4}deg)`; drop.style.opacity = u > 0.92 ? 1 - (u - 0.92) / 0.08 : 1; tag.style.left = 136 + Math.sin(u * 3.14) * 30 + 'px'; };
  CL.Clarity.render = (tt) => { const x = 50 + Math.sin((tt / 7) * Math.PI * 2) * 30; claBox.style.setProperty('--x', x + '%'); };
  const segBtns = {}; let cur0 = 'Zoom';
  const pp = h('button.sx-pp', { onclick: () => { const c = CL[cur0]; c.playing = !c.playing; syncClips(); } }, '❚❚');
  const syncClips = () => { for (const [k, c] of Object.entries(CL)) { c.el.classList.toggle('on', k === cur0); c.el.dataset.state = c.playing ? 'playing' : 'paused'; segBtns[k].classList.toggle('on', k === cur0); } pp.textContent = CL[cur0].playing ? '❚❚' : '▶'; };
  const selectTab = (k) => { CL[cur0].playing = false; cur0 = k; CL[k].t = 0; CL[k].playing = true; CL[k].render(0); syncClips(); };
  const seg = h('div.sx-seg', {}, Object.keys(CL).map((k) => (segBtns[k] = h('button', { onclick: () => selectTab(k) }, k))));
  const stage = h('div.sx-stage', {}, zoomClip, editClip, clarClip, seg, pp);
  const ck = h('div.sx-ck', {}, h('p', { html: 'This website uses cookies, local storage and pixel tags for performance, personalization, and marketing purposes. We use our own cookies and some from third parties. Only essential cookies are turned on by default. <a style="color:#8b74ff">Learn more ›</a>' }), h('button', { onclick: () => ck.remove() }, 'Essential only'), h('button.a', { onclick: () => ck.remove() }, 'Allow all'));
  sx.append(nav, h('div', { style: { position: 'relative' } }, h('div.sx-glow'), h('div.sx-ring'), h('div.sx-pill', {}, 'Screen Studio 4.0 released'), h('h1', {}, 'Beautiful screen recordings, in minutes.'), h('p.sx-sub', { html: 'The screen recorder for Mac that handles the hard parts: <b>zooms, motion, sound, and framing.</b> Every demo and tutorial comes out polished.' }), h('button.sx-big', { onclick: () => toast('Downloading Screen Studio.dmg… (demo)') }, '', 'Download for Mac'), h('div.sx-os', {}, 'macOS 13.1 or later recommended')), ed,
    h('div.sx-used', {}, 'Used by people at'), h('div.sx-logos', {}, ['stripe', 'Notion', 'GitHub', 'Shopify', 'Framer', 'Y Combinator'].map((x) => h('span', {}, x))),
    h('div', { style: { marginTop: '110px' } }, h('div.sx-h2', {}, 'Made with Screen Studio.'), h('p.sx-p', {}, 'Thousands of people use Screen Studio for product demos, courses, tutorials, and social posts.'), h('div.sx-show', {}, showTr)),
    h('div', { style: { marginTop: '110px' } }, h('div.sx-k', {}, 'Focus and zoom'), h('div.sx-h2', {}, 'Nothing stays too small to read.'), h('p.sx-p', { html: 'Pick the parts worth a closer look. <b>Screen Studio animates every zoom and lays out the frame for you.</b>' }), stage,
      h('div.sx-3', {}, h('div', { html: '<b>Smart framing.</b> Zooms are balanced so your webcam never covers the cursor.' }), h('div', { html: '<b>Automatic zoom.</b> Screen Studio looks at what you did while recording, like where you clicked, and zooms in on the moments that matter.' }), h('div', { html: '<b>Manual zoom.</b> Want to show one specific part of the screen? Add a zoom and point it right there.' }))),
    h('div', { style: { marginTop: '120px' } }, h('div.sx-k', {}, 'Pricing'), h('div.sx-h2', {}, 'Everything included.'), h('p.sx-p', {}, 'Every Screen Studio feature is available in every plan.'), h('div.sx-price', {}, h('div', {}, 'Yearly ', h('span', { style: { color: '#4ade80', fontSize: '12px' } }, 'Save 69%'), h('em', {}, '$9/mo.'), h('div', { style: { color: '#888', fontSize: '13px' } }, 'All Screen Studio features · Export up to 4K at 60 fps · Shareable links'), h('button.sx-cta', { style: { marginTop: '16px', height: '34px', width: '100%' } }, 'Get started')), h('div', {}, 'Monthly', h('em', {}, '$29/mo.'), h('div', { style: { color: '#888', fontSize: '13px' } }, 'All Screen Studio features · Cloud transcript · Sharing projects'), h('button.sx-ex', { style: { marginTop: '16px', height: '34px', width: '100%' } }, 'Get started')))),
    h('div', { style: { margin: '110px 0 0' } }, h('div.sx-h2', {}, 'Questions & answers.'), h('div.sx-faq', {}, [['How is Screen Studio different from other screen recording apps?', 'It records your screen ignoring the mouse cursor, then adds the cursor back in the final video, so cursor effects can be applied after recording.'], ['Is the Windows version ready?', 'No, and there are no near-future plans to add Windows support.'], ['Is Screen Studio privacy-focused?', 'Yes. Recordings are stored and processed locally on your computer.'], ['What macOS version is required?', 'macOS Ventura 13.1 or higher is recommended.']].map(([q, a]) => h('details', {}, h('summary', {}, q), h('p', {}, a))))),
    h('div', { style: { textAlign: 'center', padding: '120px 0 140px' } }, h('div.sx-h2', {}, 'Beautiful screen recordings, in minutes.'), h('button.sx-big', {}, '', 'Download for Mac'), h('div', { style: { color: '#555', fontSize: '12px', marginTop: '40px' } }, 'Copyright © 2026 Adam Pietrasiak. All rights reserved. · clone for practice')), ck);
  setWall(0); selectTab('Zoom');
  const onScroll = () => nav.classList.toggle('glass', root.scrollTop > 20); root.addEventListener('scroll', onScroll);
  let last = performance.now(); const loop = (now) => { if (!root.isConnected) return; const dt = clamp((now - last) / 1000, 0, 0.05); last = now; if (playing) t = (t + dt) % DUR; renderEd(); const c = CL[cur0]; if (c.playing) { c.t = (c.t + dt) % c.dur; c.render(c.t); } requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  window.__demoProof = async () => { const s0 = root.scrollTop, out = [];
    playing = false; t = 4; await sleep(700); const zoomed = parseFloat(win.style.transform.replace('scale(', '')) > 1.3; setWall(3); const wl = cv.style.background.includes('67, 206, 162') || cv.style.background.includes('#43cea2'); setWall(0); playing = true; playBtn.textContent = '❚❚';
    root.scrollTop = 1600; onScroll(); await sleep(60); const glass = nav.classList.contains('glass');
    selectTab('Editing'); await sleep(250); out.push(`Editing: Zoom=${CL.Zoom.el.dataset.state}, Editing=${CL.Editing.el.dataset.state}`); const tE = CL.Editing.t;
    selectTab('Clarity'); await sleep(250); out.push(`Clarity: Editing=${CL.Editing.el.dataset.state}(t frozen=${CL.Editing.t === tE || CL.Editing.t < tE + 0.01}), Clarity=${CL.Clarity.el.dataset.state}`);
    pp.click(); const paused = CL.Clarity.el.dataset.state; pp.click();
    selectTab('Zoom'); setLoupe(true); CL.Zoom.t = 3; CL.Zoom.render(3); const lensOn = lens.style.display === 'block'; setLoupe(false); CL.Zoom.render(3); const classic = prA.style.transform.includes('scale'); selectTab('Zoom');
    root.scrollTop = s0; onScroll();
    return `editor auto-zoom at 0:04=${zoomed}, wallpaper swap=${wl}; nav glass on scroll=${glass}; ${out.join('; ')}; pause button → ${paused}; loupe lens=${lensOn}, classic scale=${classic}; restored Zoom tab playing + top`; };
};

V['flocus-gradient-focus-dashboard-mode-toggle'] = (root, T) => {
  import('@fontsource-variable/outfit'); import('@fontsource-variable/dm-sans');
  theme(root, T, { bg: '#0e0f1a', fg: '#fff', ac: '#7c3aed', dark: true });
  const DG = "'Outfit Variable','Degular','Degular Clock',system-ui,sans-serif", UI = "'DM Sans Variable','Inter Variable',system-ui,sans-serif";
  const PUR = '#7433ff', LS = 'flocus-demo-v1';
  const ic = (d, sz = 16) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    tasks: ic('<path d="M3 6l2 2 3-3"/><path d="M12 6h9"/><rect x="3" y="14" width="5" height="5" rx="1"/><path d="M12 17h9"/>'), music: ic('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
    pen: ic('<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>'), cloud: ic('<path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z"/>'),
    home: ic('<path d="M4 10.5 12 4l8 6.5V20H4z"/>'), bulb: ic('<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z"/>'),
    gear: ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>'),
    full: ic('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'), play: ic('<path d="M7 4.5v15l12-7.5z"/>', 18), pause: ic('<path d="M8 4v16M16 4v16"/>', 18),
    reset: ic('<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/>', 18), pip: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="12" y="12" width="7" height="5" rx="1" fill="currentColor"/>', 18),
    x: ic('<path d="M18 6 6 18M6 6l12 12"/>', 20), chev: ic('<path d="m6 9 6 6 6-6"/>', 16),
    palette: ic('<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7h2A5.6 5.6 0 0 0 22 11c0-5-4.5-9-10-9Z"/>'),
    clock: ic('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'), timer: ic('<circle cx="12" cy="14" r="8"/><path d="M12 10v4l2 2M10 2h4M12 2v4"/>'), stats: ic('<path d="M4 20v-6M10 20V10M16 20V4M22 20h-20"/>'),
    quote: ic('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>'), extras: ic('<path d="m12 3 1.9 5.8H20l-4.9 3.6 1.9 5.8-5-3.6-5 3.6 1.9-5.8L4 8.8h6.1Z"/>'),
    user: ic('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.7a6 6 0 0 1 10 0"/>'), help: ic('<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>'), rocket: ic('<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1Z"/><path d="m12 15-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2Z"/>'),
  };
  // theme library (CSS backgrounds; scenic ones are painted placeholders, not the real photos)
  const MESH = 'radial-gradient(24% 40% at 46% 4%,#0e0f1a 0 50%,transparent 100%),radial-gradient(20% 34% at 58% 30%,#0e0f1aee 0 30%,transparent 100%),radial-gradient(14% 22% at 52% 50%,#1a1036aa,transparent 100%),radial-gradient(30% 40% at 0% 6%,#d0606e,transparent 100%),radial-gradient(42% 52% at 100% 100%,#e6c4b0,transparent 100%),radial-gradient(38% 46% at 86% 62%,#dc6a58,transparent 100%),radial-gradient(34% 46% at 52% 104%,#d0607a,transparent 100%),radial-gradient(30% 50% at 10% 70%,#5112b6,transparent 100%),linear-gradient(115deg,#7a2bb0 0%,#6214d4 22%,#3c1599 48%,#6a1ccc 64%,#c45a6a 86%,#e0a090 100%)';
  const TH = [
    ['Thermal', 'grad', MESH, false], ['Aurora', 'grad', 'radial-gradient(50% 60% at 20% 30%,#22d3a6,transparent),radial-gradient(50% 60% at 80% 20%,#6d28d9,transparent),radial-gradient(60% 60% at 60% 90%,#0ea5e9,transparent),#0b1026', true], ['Ember', 'grad', 'radial-gradient(60% 60% at 30% 30%,#f97316,transparent),radial-gradient(60% 60% at 80% 70%,#be123c,transparent),radial-gradient(50% 50% at 20% 90%,#fbbf24,transparent),#1c0a0a', true],
    ['Pastel Swirl', 'grad', 'radial-gradient(50% 60% at 25% 30%,#c4b5fd,transparent),radial-gradient(50% 60% at 75% 40%,#fbcfe8,transparent),radial-gradient(60% 60% at 50% 90%,#bae6fd,transparent),#ede9fe', false], ['Midnight', 'grad', 'radial-gradient(60% 70% at 70% 20%,#1e3a8a,transparent),radial-gradient(60% 70% at 20% 90%,#312e81,transparent),#05060f', false], ['Peach Fuzz', 'grad', 'radial-gradient(60% 60% at 30% 20%,#fdba74,transparent),radial-gradient(60% 60% at 80% 80%,#fb7185,transparent),#fde68a', true],
    ['Lofi Clouds', 'scenic', 'radial-gradient(18% 10% at 30% 62%,#fff8,transparent),radial-gradient(26% 12% at 70% 55%,#ffe4f3aa,transparent),radial-gradient(40% 14% at 50% 72%,#ffffffaa,transparent),linear-gradient(180deg,#a78bfa 0%,#f0abfc 45%,#fbcfe8 70%,#e9d5ff 100%)', false],
    ['Dusk Peak', 'scenic', 'linear-gradient(160deg,transparent 52%,#3b3a7a 52.5%,#2a2860 70%,transparent 70.5%),linear-gradient(200deg,transparent 48%,#4c4a92 48.5%,#2e2c6a 72%,transparent 72.5%),linear-gradient(180deg,#312e81 0%,#7c6fd0 45%,#f0a5c8 80%,#2a2860 81%)', true],
    ['Tuscan Village', 'scenic', 'linear-gradient(90deg,transparent 30%,#d8a066 30% 46%,transparent 46% 58%,#c98a52 58% 70%,transparent 70%),linear-gradient(180deg,#f6c38a 0%,#e09060 50%,#8a5a3c 51%,#5a3a28 100%)', true],
    ['Cotton Candy Sky', 'scenic', 'radial-gradient(30% 20% at 30% 60%,#fff9,transparent),radial-gradient(40% 25% at 70% 70%,#ffd6e8,transparent),linear-gradient(180deg,#c084fc,#f9a8d4 60%,#fde2e4)', true],
    ['Enchanted Forest', 'nature', 'FOREST', false], ['Misty Pines', 'nature', 'linear-gradient(170deg,transparent 60%,#1f3b33 60.5%),linear-gradient(190deg,transparent 55%,#2c4a40 55.5%),linear-gradient(180deg,#c7d6d2,#8fa9a2 55%,#1a2e28)', false],
    ['Night Rain', 'urban', 'repeating-linear-gradient(100deg,#ffffff10 0 1px,transparent 1px 9px),radial-gradient(20% 30% at 30% 80%,#f59e0b88,transparent),radial-gradient(20% 30% at 70% 75%,#ec489988,transparent),linear-gradient(180deg,#0f172a,#1e1b4b)', true],
    ['Cozy Library', 'interior', 'repeating-linear-gradient(90deg,#7c2d12 0 18px,#9a3412 18px 30px,#78350f 30px 44px,#451a03 44px 48px),linear-gradient(#0000,#0008)', true],
  ];
  const CATS = [['all', 'All'], ['grad', 'Gradients & Colors'], ['abstract', 'Abstract'], ['scenic', 'Scenic'], ['nature', 'Nature'], ['urban', 'Urban'], ['interior', 'Interior'], ['animated', 'Animated']];
  const QUOTES = [['Hard work beats talent when', 'talent doesn’t work hard'], ['Focus on the step in front of you.', 'Not the whole staircase.'], ['Embrace the now'], ['Small steps every day.']];
  const GREET = [['Your dedication knows', 'no time, Flocus User!'], ['Time is just a number, Flocus User.', 'Your passion counts!']];
  const DEF = { mode: 'home', themes: { home: 'Thermal', focus: 'Thermal', ambient: 'Enchanted Forest' }, tasks: ['', '', ''], done: [false, false, false], h24: false, dur: [25, 5, 15], note: '' };
  let st; try { st = { ...DEF, ...JSON.parse(localStorage.getItem(LS) || '{}') }; } catch { st = { ...DEF }; }
  st = JSON.parse(JSON.stringify(st)); const save = () => { try { localStorage.setItem(LS, JSON.stringify(st)); } catch {} };
  // forest illustration (painted SVG placeholder for the real ambient artwork)
  const forest = () => { const r = rng(7); let fl = ''; for (let i = 0; i < 90; i++) { const x = r() * 1440, y = 560 + r() * 340, s0 = 3 + r() * 7, c = r() < .62 ? '#f4f1e6' : r() < .5 ? '#e879a6' : '#f2c94c'; fl += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${c === '#f4f1e6' ? [0, 1, 2, 3, 4, 5].map((k) => `<ellipse rx="${(s0 * .5).toFixed(1)}" ry="${(s0 * .22).toFixed(1)}" transform="rotate(${k * 60}) translate(${(s0 * .5).toFixed(1)} 0)" fill="${c}" opacity=".9"/>`).join('') + `<circle r="${(s0 * .28).toFixed(1)}" fill="#f2c94c"/>` : `<circle r="${(s0 * .45).toFixed(1)}" fill="${c}" opacity=".85"/>`}</g>`; }
    let sp = ''; for (let i = 0; i < 140; i++) sp += `<circle cx="${(r() * 1440).toFixed(0)}" cy="${(r() * 700).toFixed(0)}" r="${(r() * 1.6 + .4).toFixed(1)}" fill="#e9f5a8" opacity="${(r() * .6 + .2).toFixed(2)}"/>`;
    let fern = ''; for (let i = 0; i < 26; i++) { const x = r() * 1440, y = 480 + r() * 420, sc = .6 + r() * 1.2, rot = -40 + r() * 80, c = pick(['#2f5a24', '#3f7a2c', '#4f8f34', '#28461f', '#5f9a3a'], r); fern += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)}) scale(${sc.toFixed(2)})">${Array.from({ length: 9 }, (_, k) => `<ellipse cx="${k * 9}" cy="0" rx="9" ry="3.4" transform="rotate(${k % 2 ? 35 : -35} ${k * 9} 0)" fill="${c}"/>`).join('')}<path d="M0 0H84" stroke="${c}" stroke-width="2"/></g>`; }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" width="1440" height="900"><defs><radialGradient id="flg" cx="58%" cy="42%" r="45%"><stop offset="0" stop-color="#b8d47a" stop-opacity=".55"/><stop offset=".5" stop-color="#5f8a3a" stop-opacity=".25"/><stop offset="1" stop-color="#0d1a10" stop-opacity="0"/></radialGradient><linearGradient id="fls" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a140e"/><stop offset=".55" stop-color="#1c3420"/><stop offset="1" stop-color="#0f1f12"/></linearGradient></defs>
<rect width="1440" height="900" fill="url(#fls)"/><rect width="1440" height="900" fill="url(#flg)"/>
<g fill="#14261a" opacity=".9"><ellipse cx="200" cy="120" rx="420" ry="220"/><ellipse cx="760" cy="40" rx="520" ry="200"/><ellipse cx="1280" cy="140" rx="380" ry="260"/></g>
<g fill="#22401f"><ellipse cx="420" cy="170" rx="260" ry="120"/><ellipse cx="1000" cy="200" rx="300" ry="120"/><ellipse cx="640" cy="90" rx="200" ry="80"/></g>
<path d="M120 900C150 640 120 380 60 120L190 100C220 360 260 640 300 900Z" fill="#3a3a1c"/><path d="M1180 900c20-260 0-520-60-760l120-10c40 260 60 520 50 770z" fill="#2f3218"/>
<ellipse cx="460" cy="420" rx="190" ry="160" fill="#2c4a22"/><radialGradient id="flh"><stop offset="0" stop-color="#020302"/><stop offset=".7" stop-color="#0b140b"/><stop offset="1" stop-color="#2c4a22"/></radialGradient><ellipse cx="460" cy="440" rx="130" ry="120" fill="url(#flh)"/>
<path d="M640 900 C700 700 760 560 820 470 L860 470 C880 560 900 700 1000 900Z" fill="#a8956a" opacity=".42"/>
<g fill="#2b4d22"><ellipse cx="120" cy="620" rx="260" ry="140"/><ellipse cx="1320" cy="600" rx="280" ry="170"/><ellipse cx="720" cy="900" rx="520" ry="150"/></g>
<g fill="#3e6a2b" opacity=".9"><ellipse cx="300" cy="760" rx="260" ry="120"/><ellipse cx="1140" cy="780" rx="300" ry="120"/></g>${fern}${sp}${fl}
<rect width="1440" height="900" fill="#000" opacity=".18"/></svg>`; };
  const FOREST_URL = `url("data:image/svg+xml,${encodeURIComponent(forest())}") center/cover`;
  const bgOf = (name) => { const t = TH.find((x) => x[0] === name) || TH[0]; return t[2] === 'FOREST' ? FOREST_URL : t[2]; };
  root.append(h('style', {}, `.fl{position:absolute;inset:0;overflow:hidden;color:#fff;font:500 14px/1.35 ${UI};-webkit-font-smoothing:antialiased}
.fl-bg{position:absolute;inset:-6%;transition:opacity .9s ease;background-size:cover!important}.fl-bg.mesh{animation:fldrift 26s ease-in-out infinite alternate;filter:blur(28px)}
@keyframes fldrift{0%{transform:scale(1) translate(0,0)}50%{transform:scale(1.05) translate(-1.2%,1%)}100%{transform:scale(1.03) translate(1.4%,-1%)}}
.fl-logo{position:absolute;left:44px;top:34px;font:650 36px/1 ${DG};letter-spacing:-.035em;z-index:3}
.fl-quote{position:absolute;right:44px;top:44px;text-align:right;font:550 19px/1.3 ${DG};letter-spacing:-.01em;max-width:420px;z-index:3;transition:opacity .4s}
.fl-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-56%);text-align:center;z-index:2;transition:opacity .45s,transform .45s}
.fl-center.off{opacity:0;pointer-events:none;transform:translate(-50%,-52%) scale(.97)}
.fl-greet{font:550 24px/1.3 ${DG};letter-spacing:-.01em}.fl-clock{font:700 118px/1 ${DG};letter-spacing:-.03em;font-variant-numeric:tabular-nums;margin-top:6px}
.fl-q{font:550 22px/1.3 ${DG}}.fl-tabs{display:flex;gap:16px;justify-content:center;margin-top:22px}.fl .fl-tabs button{background:none;border:0;color:#ffffff8c;font:600 15px ${DG};letter-spacing:.01em;padding:2px 0}.fl .fl-tabs button.on{color:#fff}
.fl-dots{display:flex;gap:6px;justify-content:center;margin:10px 0 2px}.fl-dots i{width:6px;height:6px;border-radius:50%;background:#ffffff66}.fl-dots i.on{background:#fff}
.fl-timer{font:700 112px/1.05 ${DG};letter-spacing:-.03em;font-variant-numeric:tabular-nums}.fl-ctl{display:flex;gap:10px;justify-content:center;margin-top:10px}
.fl .gbtn{width:48px;height:48px;border-radius:9px;border:0;background:#2a0f5c66;color:#fff;display:grid;place-items:center;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:background .15s}.fl .gbtn:hover{background:#ffffff2a}
.fl-amb{position:absolute;right:44px;top:44px;width:212px;padding:18px 0 16px;border-radius:12px;background:#1a2a1e55;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);text-align:center;z-index:3;transition:opacity .5s,transform .5s}
.fl-amb.off{opacity:0;transform:translateY(-8px);pointer-events:none}.fl-amb small{font:600 15px ${DG};letter-spacing:.02em}.fl-amb .t{font:400 56px/1.1 ${DG};font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.fl-dock{position:absolute;bottom:30px;display:flex;gap:8px;align-items:center;z-index:4}.fl-dock.l{left:44px}.fl-dock.r{right:44px}
.fl .dbtn{width:36px;height:36px;border-radius:9px;border:0;background:#28104f80;color:#fff;display:grid;place-items:center;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:background .15s,transform .15s}.fl .dbtn:hover{background:#ffffff2e}.fl .dbtn.on{background:${PUR}}
.fl-seg{display:flex;align-items:center;gap:2px;border-radius:10px;background:#ffffff38;padding:0 2px;height:36px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);position:relative}
.fl .fl-seg button{width:32px;height:32px;border-radius:50%;border:0;background:none;color:#fff;display:grid;place-items:center;position:relative;z-index:1;transition:color .2s}
.fl-seg .knob{position:absolute;top:-2px;width:40px;height:40px;border-radius:50%;background:${PUR};transition:left .32s cubic-bezier(.3,1.4,.5,1);box-shadow:0 4px 14px #7433ff66}
.fl-mlabel{position:absolute;top:44px;font:600 13px ${UI};white-space:nowrap;transform:translateX(-50%);transition:left .32s cubic-bezier(.3,1.4,.5,1)}
.fl-streak{height:36px;padding:0 12px;border-radius:9px;background:#ffffff38;display:flex;align-items:center;gap:6px;font:700 15px ${UI};backdrop-filter:blur(6px);transition:opacity .3s}
.fl-panel{position:absolute;left:28px;bottom:80px;width:460px;border-radius:12px;background:#121626f2;border:1px solid #ffffff14;box-shadow:0 20px 60px #0006;z-index:6;transform-origin:bottom left;transition:opacity .22s,transform .22s}
.fl-panel.off{opacity:0;transform:translateY(10px) scale(.98);pointer-events:none}.fl-ph{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid #ffffff14;font:650 15px ${UI}}.fl-ph i{width:30px;height:30px;border-radius:7px;background:#ffffff14;display:grid;place-items:center;color:#a78bfa}
.fl-row{display:flex;align-items:center;gap:14px;margin:10px 12px;padding:0 16px 0 40px;height:46px;border-radius:10px;background:#1a1f30;border:1px solid #ffffff12}.fl-row input[type=checkbox]{appearance:none;width:17px;height:17px;border:1.5px solid #ffffffaa;border-radius:4px;margin:0;cursor:pointer;display:grid;place-items:center}.fl-row input[type=checkbox]:checked{background:${PUR};border-color:${PUR}}.fl-row input[type=checkbox]:checked:after{content:'✓';font-size:12px;color:#fff}
.fl-row input[type=text]{flex:1;background:none;border:0;outline:none;color:#fff;font:500 14px ${UI}}.fl-row input[type=text]::placeholder{color:#ffffff5c}.fl-row.done input[type=text]{text-decoration:line-through;opacity:.5}
.fl-add{border-top:1px solid #ffffff14;margin-top:12px;padding:18px;text-align:center}.fl .fl-add button{background:none;border:0;color:#fff;font:600 15px ${UI}}.fl-plus{display:inline-flex;gap:4px;align-items:center;background:#5b21b655;color:#c4b5fd;border-radius:5px;padding:2px 7px;font:700 11px ${UI};letter-spacing:.04em;margin:14px 0 6px}
.fl-upsell{font:500 13px/1.5 ${UI};color:#ffffffb0}.fl-upsell a{color:#fff;font-weight:700;text-decoration:underline;cursor:pointer}
.fl-tip{position:absolute;bottom:84px;width:240px;padding:16px 18px;border-radius:12px;background:#2b1d2ef0;box-shadow:0 10px 30px #0005;z-index:7;font:500 13px/1.45 ${UI};color:#ffffffd0;transition:opacity .25s}.fl-tip.off{opacity:0;pointer-events:none}.fl-tip b{display:block;font:700 17px/1.25 ${UI};color:#fff;margin-bottom:8px}.fl-tip a{display:inline-block;margin-top:12px;color:#fff;font-weight:700;text-decoration:underline;cursor:pointer}.fl-tip:after{content:'';position:absolute;bottom:-7px;width:14px;height:14px;background:inherit;transform:rotate(45deg)}
.fl-tip.tr{right:40px}.fl-tip.tr:after{right:90px}.fl-tip.tl{left:40px;background:#1c0f3af2}.fl-tip.tl:after{left:52px}.fl .fl-sp{display:inline-block;margin-top:12px;background:${PUR};border:0;color:#fff;border-radius:99px;padding:7px 12px;font:700 13px ${UI}}
.fl-note{position:absolute;left:28px;bottom:80px;width:360px;height:280px;border-radius:12px;background:#121626f2;border:1px solid #ffffff14;z-index:6;display:flex;flex-direction:column;transition:opacity .22s,transform .22s}.fl-note.off{opacity:0;transform:translateY(10px);pointer-events:none}.fl-note textarea{flex:1;background:none;border:0;outline:none;resize:none;color:#fff;padding:14px 18px;font:500 14px/1.6 ${UI}}
.fl-scrim{position:absolute;inset:0;background:#0009;z-index:20;transition:opacity .3s}.fl-scrim.off{opacity:0;pointer-events:none}
.fl-drawer{position:absolute;top:0;bottom:0;right:0;width:68%;min-width:780px;display:grid;grid-template-columns:260px 1fr;z-index:21;transition:transform .38s cubic-bezier(.2,.8,.2,1);box-shadow:-20px 0 60px #0008}.fl-drawer.off{transform:translateX(102%)}
.fl-nav{background:#0d0d10;padding:18px 16px;display:flex;flex-direction:column;gap:2px;overflow:auto}.fl .fl-nav .x{align-self:flex-start;background:none;border:0;color:#fff;padding:4px 6px;margin-bottom:12px}
.fl .fl-nav .it{display:flex;align-items:center;gap:14px;background:none;border:0;color:#fff;padding:10px 14px;border-radius:7px;font:600 14.5px ${UI};text-align:left}.fl .fl-nav .it i{color:#8b5cf6;display:grid}.fl .fl-nav .it.on{background:#1f1d2b}.fl .fl-nav .it:hover{background:#18171f}
.fl-new{background:#14532d;color:#4ade80;border-radius:4px;padding:2px 6px;font:800 10px ${UI};letter-spacing:.04em}.fl-dot{width:6px;height:6px;border-radius:50%;background:#ef4444}
.fl .fl-up{margin:24px 0;background:${PUR};border:0;color:#fff;border-radius:6px;padding:11px;font:600 16px ${UI}}
.fl-out{margin-top:auto;border:1px solid #ffffff1c;border-radius:9px;padding:16px;text-align:center;background:#131318;font:500 13px/1.4 ${UI};color:#ffffff99}.fl-out b{display:block;color:#fff;font-size:15px;margin-bottom:6px}.fl .fl-out button{margin:10px 0;background:#1e1b4b;color:#fff;border:1px solid #4c1d95;border-radius:6px;padding:8px 14px;font:500 13px ${UI}}
.fl-main{background:#000;overflow:auto;padding:30px 46px 60px}.fl-main h2{font:700 36px/1.1 ${UI};margin:0;letter-spacing:-.01em}.fl-main .sub{color:#ffffffa0;font:500 16px ${UI};margin:10px 0 22px}
.fl-mt{display:inline-flex;background:#1c1c22;border:1px solid #ffffff1c;border-radius:9px;padding:3px}.fl .fl-mt button{background:none;border:0;color:#ffffffb0;padding:7px 18px;border-radius:6px;font:600 14px ${UI}}.fl .fl-mt button.on{background:${PUR};color:#fff}
.fl-prev{position:relative;height:240px;border-radius:9px;margin:26px 0 22px;overflow:hidden;display:grid;place-items:center}.fl-prev b{font:700 42px ${DG};text-shadow:0 2px 14px #0004;position:relative}.fl-prev span{position:absolute;left:10px;bottom:10px;background:#1e0b3ad0;border-radius:5px;padding:3px 8px;font:700 11px ${UI}}
.fl-card{border:1px solid #ffffff1f;border-radius:9px;padding:24px 26px;margin-bottom:16px;background:#050507}.fl-card h3{font:700 21px ${UI};margin:0;display:flex;align-items:center;gap:10px}.fl-chips{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 22px}.fl .fl-chips button{background:#1a1a20;border:0;color:#ffffffc0;border-radius:99px;padding:8px 15px;font:500 14px ${UI}}.fl .fl-chips button.on{background:${PUR};color:#fff}
.fl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 16px}.fl .fl-th{background:none;border:0;padding:0;color:#fff;font:500 14px ${UI};text-align:center}.fl-th div{height:110px;border-radius:7px;position:relative;border:2px solid transparent;margin-bottom:10px;transition:transform .15s;background-size:cover!important}.fl .fl-th:hover div{transform:translateY(-2px)}.fl-th.on div{border-color:#fff}.fl-th em{position:absolute;left:8px;top:8px;font:800 10px ${UI};font-style:normal;background:#5b21b6;border-radius:4px;padding:3px 6px}
.fl-modal{position:absolute;left:50%;top:50%;width:600px;transform:translate(-50%,-50%);border-radius:22px;background:#1a0d33d9;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid #ffffff14;padding:48px 60px 34px;text-align:center;z-index:30;transition:opacity .35s,transform .35s}.fl-modal.off{opacity:0;transform:translate(-50%,-46%);pointer-events:none}
.fl-modal h3{font:700 40px/1.15 ${UI};letter-spacing:-.02em;margin:0}.fl-modal p{color:#ffffffa8;font:500 18px ${UI};margin:18px 0 26px}.fl .fl-modal .g{width:270px;height:40px;border-radius:4px;border:0;background:#fff;color:#222;font:500 14px ${UI}}.fl .fl-modal .e{width:270px;height:50px;border-radius:9px;border:1px solid #ffffff55;background:none;color:#fff;font:600 16px ${UI}}.fl-modal .or{width:270px;margin:16px auto;border-top:1px solid #ffffff22;font:700 11px ${UI};color:#ffffff88;line-height:0;padding-top:0}.fl-modal .or span{background:#2a1450;padding:0 8px}
.fl-modal a{color:#fff;text-decoration:underline;cursor:pointer;font:600 15px ${UI}}.fl-modal small{display:block;margin-top:24px;color:#ffffff80;font-size:11px}
.fl-ups{position:absolute;left:50%;top:50%;width:420px;transform:translate(-50%,-50%);border-radius:16px;background:#14121f;border:1px solid #ffffff1c;padding:28px;z-index:31;text-align:center;transition:opacity .25s}.fl-ups.off{opacity:0;pointer-events:none}.fl-ups h4{font:700 22px ${UI};margin:10px 0 6px}.fl-ups p{color:#ffffffa0;margin:0 0 18px}.fl .fl-ups button{border:0;border-radius:8px;padding:10px 16px;font:700 14px ${UI};margin:0 4px}
.fl-set{display:grid;gap:14px;max-width:460px}.fl-set label{display:flex;justify-content:space-between;align-items:center;background:#111116;border:1px solid #ffffff1a;border-radius:9px;padding:14px 16px;font:600 14px ${UI}}.fl-set input[type=number]{width:70px;background:#1c1c22;border:1px solid #ffffff2a;color:#fff;border-radius:6px;padding:6px 8px;font:600 14px ${UI}}`));
  const fl = h('div.fl'); root.append(fl);
  const bgA = h('div.fl-bg.mesh'), bgB = h('div.fl-bg', { style: { opacity: 0 } }); let bgFront = bgA;
  const setBg = (css0) => { const back = bgFront === bgA ? bgB : bgA; back.style.background = css0; back.classList.toggle('mesh', !css0.startsWith('url(')); back.style.opacity = 1; bgFront.style.opacity = 0; bgFront = back; };
  bgA.style.background = bgOf(st.themes[st.mode]); bgA.classList.toggle('mesh', !bgOf(st.themes[st.mode]).startsWith('url('));
  // quote + greeting
  let qi = 0; const quote = h('div.fl-quote'); const drawQuote = () => { const q = QUOTES[qi % QUOTES.length]; quote.replaceChildren(...q.map((l, i) => h('div', {}, (i === 0 ? '“' : '') + l + (i === q.length - 1 ? '”' : '')))); };
  const clock = h('div.fl-clock'); const greet = h('div.fl-greet', {}, ...GREET[0].map((l) => h('div', {}, l)));
  const fmt = (d) => { let hh = d.getHours(); const mm = String(d.getMinutes()).padStart(2, '0'); if (!st.h24) hh = hh % 12 || 12; return `${st.h24 ? String(hh).padStart(2, '0') : hh}:${mm}`; };
  const tick = () => { clock.textContent = fmt(new Date()); }; tick(); const clockIv = setInterval(tick, 1000);
  const home = h('div.fl-center', {}, greet, clock);
  // focus timer
  const KINDS = ['FOCUS', 'SHORT BREAK', 'LONG BREAK']; let kind = 0, left = st.dur[0] * 60, running = false, iv = null, sessions = 0;
  const tTxt = h('div.fl-timer'), aTxt = h('div.t'), aKind = h('small'); const mmss = (s0) => `${String(Math.floor(s0 / 60)).padStart(2, '0')}:${String(s0 % 60).padStart(2, '0')}`;
  const tabs = h('div.fl-tabs'), dots = h('div.fl-dots', {}, ...[0, 1, 2, 3].map((i) => h('i', { class: i === 0 ? 'on' : '' })));
  const playB = h('button.gbtn', { title: 'Start', html: I.play, onclick: () => toggleRun() }), aPlay = h('button.gbtn', { title: 'Start', html: I.play, style: { margin: '10px auto 0', width: '42px', height: '42px', background: '#0000003a' }, onclick: () => toggleRun() });
  const drawT = () => { tTxt.textContent = aTxt.textContent = mmss(left); aKind.textContent = KINDS[kind]; [...tabs.children].forEach((b, i) => b.classList.toggle('on', i === kind)); playB.innerHTML = aPlay.innerHTML = running ? I.pause : I.play; [...dots.children].forEach((d, i) => d.classList.toggle('on', i === sessions % 4)); };
  const setKind = (k) => { kind = k; left = st.dur[k] * 60; stopRun(); drawT(); };
  KINDS.forEach((k, i) => tabs.append(h('button', { onclick: () => setKind(i) }, k)));
  const stopRun = () => { running = false; clearInterval(iv); iv = null; };
  const toggleRun = () => { if (running) { stopRun(); drawT(); return; } running = true; iv = setInterval(() => { left = Math.max(0, left - 1); if (!left) { stopRun(); if (kind === 0) sessions++; toast(kind === 0 ? 'Focus session complete — take a break' : 'Break over — back to focus'); setKind(kind === 0 ? 1 : 0); } drawT(); }, 1000); drawT(); };
  const focus = h('div.fl-center.off', {}, h('div.fl-q', {}, 'What do you want to focus on?'), tabs, dots, tTxt, h('div.fl-ctl', {}, playB, h('button.gbtn', { title: 'Reset', html: I.reset, onclick: () => setKind(kind) }), h('button.gbtn', { title: 'Picture-in-Picture', html: I.pip, onclick: () => toast('Picture-in-Picture timer (demo)') })));
  const amb = h('div.fl-amb.off', {}, aKind, aTxt, aPlay); drawT();
  // docks
  const panels = {}; const dockL = h('div.fl-dock.l'); const dbtn = (k, icon, title) => { const b = h('button.dbtn', { title, html: icon, onclick: () => openPanel(k) }); dockL.append(b); return b; };
  const bTasks = dbtn('tasks', I.tasks, 'Tasks'), bMusic = dbtn('music', I.music, 'Music'), bNote = dbtn('note', I.pen, 'Notepad');
  const rows = h('div'); const drawRows = () => rows.replaceChildren(...st.tasks.map((t, i) => h('div.fl-row', { class: 'fl-row' + (st.done[i] ? ' done' : '') }, h('input', { type: 'checkbox', checked: !!st.done[i], onchange: (e) => { st.done[i] = e.target.checked; save(); drawRows(); } }), h('input', { type: 'text', value: t, placeholder: 'Type your priority', oninput: (e) => { st.tasks[i] = e.target.value; save(); } }))));
  drawRows();
  const ups = h('div.fl-ups.off', {}, h('div', { style: { fontSize: '34px' } }, '🔓'), h('h4', {}, 'Tasks Unlocked'), h('p', {}, 'Get infinite task slots, subtasks, task ETAs and emojis with Flocus Plus.'), h('button', { style: { background: PUR, color: '#fff' }, onclick: () => toast('Upgrade flow (demo)') }, '⚡ Upgrade to Plus'), h('button', { style: { background: '#ffffff1a', color: '#fff' }, onclick: () => ups.classList.add('off') }, 'Maybe later'));
  panels.tasks = h('div.fl-panel.off', {}, h('div.fl-ph', {}, h('i', { html: I.tasks }), 'Tasks'), rows, h('div.fl-add', {}, h('button', { onclick: () => ups.classList.remove('off') }, '+ Add Task'), h('br'), h('span.fl-plus', {}, '⚡ PLUS'), h('div.fl-upsell', {}, 'Want subtasks, task ETAs, infinite task slots, emojis, and emojis? ', h('a', { onclick: () => ups.classList.remove('off') }, 'Check it out →'))));
  panels.music = h('div.fl-tip.tl.off', { style: { bottom: '78px' } }, 'Log in to Spotify web player, then refresh to enjoy our playlists in full!', h('br'), h('button.fl-sp', { onclick: () => toast('Opens Spotify login (demo)') }, 'Connect Spotify'), h('br'), h('a', { onclick: () => openPanel(null) }, 'Skip for now'));
  const noteTa = h('textarea', { placeholder: 'Jot something down…', value: st.note, oninput: (e) => { st.note = e.target.value; save(); } });
  panels.note = h('div.fl-note.off', {}, h('div.fl-ph', {}, h('i', { html: I.pen }), 'Notepad'), noteTa);
  let openK = null; const openPanel = (k) => { openK = openK === k ? null : k; for (const [kk, p] of Object.entries(panels)) p.classList.toggle('off', kk !== openK); bTasks.classList.toggle('on', openK === 'tasks'); bMusic.classList.toggle('on', openK === 'music'); bNote.classList.toggle('on', openK === 'note'); };
  // mode toggle
  const MODES = [['ambient', I.cloud, 'Ambient'], ['home', I.home, 'Home'], ['focus', I.bulb, 'Focus']];
  const knob = h('span.knob'), mlabel = h('span.fl-mlabel'), seg0 = h('div.fl-seg', {}, knob, ...MODES.map(([k, icon, n]) => h('button', { title: n, html: icon, onclick: () => setMode(k) })), mlabel);
  const streak = h('div.fl-streak', {}, '🔥', h('span', {}, '0'));
  const tour = h('div.fl-tip.tr', {}, h('b', {}, 'Go to Timer or Switch Modes'), 'Use the toggle to flip between Home, Focus Mode, and Ambient Mode.', h('br'), h('a', { onclick: () => tour.classList.add('off') }, 'Okay, got it!'));
  const setMode = (m, quiet) => { st.mode = m; if (!quiet) save(); const i = MODES.findIndex((x) => x[0] === m); knob.style.left = `${2 + i * 34 - 4}px`; mlabel.style.left = `${2 + i * 34 + 16}px`; mlabel.textContent = MODES[i][2];
    [...seg0.querySelectorAll('button')].forEach((b, j) => b.style.color = '#fff');
    home.classList.toggle('off', m !== 'home'); focus.classList.toggle('off', m !== 'focus'); amb.classList.toggle('off', m !== 'ambient'); quote.style.opacity = m === 'ambient' ? 0 : 1;
    streak.style.display = m === 'focus' ? 'flex' : 'none'; setBg(bgOf(st.themes[m])); tour.classList.add('off'); };
  const dockR = h('div.fl-dock.r', {}, streak, seg0, h('button.dbtn', { title: 'Settings', html: I.gear, onclick: () => openSettings(true), style: { background: '#ffffff38' } }), h('button.dbtn', { title: 'Fullscreen', html: I.full, style: { background: '#ffffff38' }, onclick: () => { (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen?.())?.catch?.(() => toast('Fullscreen blocked in this frame')); } }));
  // settings drawer
  let tab = 'home', cat = 'all', navK = 'Themes'; const main = h('div.fl-main');
  const NAV = [['Themes', I.palette, 'new'], ['Clock', I.clock, 'new'], ['Focus Timer', I.timer], ['Stats', I.stats], ['Quotes', I.quote], ['Extras', I.extras], ['Account', I.user, 'dot'], ['Support', I.help], ['What’s New', I.rocket]];
  const navCol = h('div.fl-nav'); const drawNav = () => navCol.replaceChildren(h('button.x', { html: I.x, title: 'Close', onclick: () => openSettings(false) }), ...NAV.map(([n, icon, b]) => h('button.it', { class: 'it' + (n === navK ? ' on' : ''), onclick: () => { navK = n; drawNav(); drawMain(); } }, h('i', { html: icon }), n, b === 'new' ? h('span.fl-new', {}, 'NEW') : b === 'dot' ? h('span.fl-dot') : '')), h('button.fl-up', { onclick: () => toast('Upgrade flow (demo)') }, '⚡ Upgrade to Plus'), h('div.fl-out', {}, h('b', {}, 'You’re signed out!'), 'Keep your layout, stats, and more.', h('br'), h('button', { onclick: () => toast('Sign up (demo)') }, 'Sign up with email'), h('br'), 'Already have an account? ', h('a', { style: { color: '#a5b4fc', textDecoration: 'underline' } }, 'Sign in')));
  const drawMain = () => {
    if (navK === 'Clock') { main.replaceChildren(h('h2', {}, 'Clock'), h('div.sub', {}, 'Choose how the home clock looks.'), h('div.fl-set', {}, h('label', {}, '24-hour clock', h('input', { type: 'checkbox', checked: st.h24, onchange: (e) => { st.h24 = e.target.checked; save(); tick(); } })), h('label', {}, 'Preview', h('b', { style: { font: `700 26px ${DG}` } }, fmt(new Date()))))); return; }
    if (navK === 'Focus Timer') { main.replaceChildren(h('h2', {}, 'Focus Timer'), h('div.sub', {}, 'Set your intervals (minutes).'), h('div.fl-set', {}, ...KINDS.map((k, i) => h('label', {}, k[0] + k.slice(1).toLowerCase(), h('input', { type: 'number', min: 1, max: 90, value: st.dur[i], onchange: (e) => { st.dur[i] = clamp(+e.target.value || 1, 1, 90); save(); if (i === kind && !running) setKind(i); } }))))); return; }
    if (navK !== 'Themes') { main.replaceChildren(h('h2', {}, navK), h('div.sub', {}, 'This section isn’t part of the clone demo.')); return; }
    const cur = st.themes[tab]; const list = TH.filter((t) => cat === 'all' || t[1] === cat);
    const groups = cat === 'all' ? CATS.slice(1).map(([k, n]) => [n, list.filter((t) => t[1] === k)]).filter((g) => g[1].length) : [[CATS.find((c) => c[0] === cat)[1], list]];
    main.replaceChildren(h('h2', {}, 'Themes'), h('div.sub', {}, 'Pick your theme for each mode.'),
      h('div.fl-mt', {}, ...['home', 'focus', 'ambient'].map((m) => h('button', { class: m === tab ? 'on' : '', onclick: () => { tab = m; drawMain(); } }, m[0].toUpperCase() + m.slice(1)))),
      h('div.fl-prev', { style: { background: bgOf(cur), backgroundSize: 'cover' } }, h('b', {}, tab === 'focus' ? '25:00' : fmt(new Date())), h('span', {}, cur)),
      h('div.fl-card', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 26px' } }, h('h3', {}, 'Custom Background', h('span.fl-plus', { style: { margin: 0 } }, '⚡ PLUS')), h('span', { html: I.chev })),
      h('div.fl-card', {}, h('h3', {}, 'Theme Library', h('span.fl-new', {}, 'NEW')), h('div.fl-chips', {}, ...CATS.map(([k, n]) => h('button', { class: k === cat ? 'on' : '', onclick: () => { cat = k; drawMain(); } }, n))),
        ...(groups.length ? groups : [['Nothing here yet', []]]).map(([n, ts]) => h('div', { style: { marginBottom: '22px' } }, h('div', { style: { font: `700 17px ${UI}`, margin: '0 0 14px', display: 'flex', justifyContent: 'space-between' } }, n, h('span', { style: { fontWeight: 500, fontSize: '13px', opacity: .8 } }, ts.length ? `See all (${ts.length * 4})` : '')),
          h('div.fl-grid', {}, ...ts.map(([tn, , , plus]) => h('button.fl-th', { class: 'fl-th' + (tn === cur ? ' on' : ''), 'data-theme': tn, onclick: () => applyTheme(tn, plus) }, h('div', { style: { background: bgOf(tn), backgroundSize: 'cover' } }, plus ? h('em', {}, 'PLUS') : ''), tn)))))));
  };
  const applyTheme = (tn, plus) => { if (plus) toast(`${tn} is a Plus theme — previewing (demo)`); st.themes[tab] = tn; save(); if (tab === st.mode) setBg(bgOf(tn)); drawMain(); };
  const scrim = h('div.fl-scrim.off', { onclick: () => openSettings(false) }), drawer = h('div.fl-drawer.off', {}, navCol, main);
  const openSettings = (on) => { if (on) { tab = st.mode; drawNav(); drawMain(); openPanel(null); } scrim.classList.toggle('off', !on); drawer.classList.toggle('off', !on); };
  // login gate (real app shows it first; "Stay logged out" continues)
  const gate = h('div.fl-modal', {}, h('h3', {}, 'Your dashboard is ready', h('br'), '✨'), h('p', {}, 'Save your themes, stats, and more.'), h('button.g', { onclick: () => toast('Google sign-in (demo)') }, h('b', { style: { color: '#4285f4' } }, 'G'), '  Continue with Google'), h('div.or', {}, h('span', {}, 'OR')), h('button.e', { onclick: () => toast('Email sign-up (demo)') }, '✉  Sign up with email'), h('div', { style: { margin: '28px 0 22px' } }, h('a', { onclick: () => closeGate() }, 'Stay logged out  →')), h('div', { style: { font: `600 14px ${UI}` } }, 'Have an account? ', h('a', { style: { fontSize: '14px' } }, 'Log in')), h('small', {}, 'By proceeding, you agree to our Terms and Privacy Policy.'));
  const gateBlur = h('div', { style: { position: 'absolute', inset: 0, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 29, transition: 'opacity .35s' } });
  const closeGate = () => { gate.classList.add('off'); gateBlur.style.opacity = 0; gateBlur.style.pointerEvents = 'none'; try { sessionStorage.setItem(LS + '-gate', '1'); } catch {} };
  fl.append(bgA, bgB, h('div.fl-logo', {}, 'flocus'), quote, home, focus, amb, dockL, dockR, panels.tasks, panels.music, panels.note, tour, scrim, drawer, ups, gateBlur, gate);
  drawQuote(); const qIv = setInterval(() => { if (st.mode !== 'ambient') { qi++; quote.style.opacity = 0; setTimeout(() => { drawQuote(); quote.style.opacity = 1; }, 400); } }, 12000);
  try { if (sessionStorage.getItem(LS + '-gate')) closeGate(); } catch {}
  setMode(st.mode, true); bgA.style.opacity = 1; bgB.style.opacity = 0; bgFront = bgA; bgA.style.background = bgOf(st.themes[st.mode]); bgA.classList.toggle('mesh', !bgOf(st.themes[st.mode]).startsWith('url('));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { openSettings(false); openPanel(null); ups.classList.add('off'); } });
  window.__demoProof = async () => { const snap = JSON.stringify(st), out = [];
    closeGate(); await sleep(60); out.push(`gate closed=${gate.classList.contains('off')}`);
    setMode('focus', true); await sleep(80); out.push(`focus: tabs=[${[...tabs.children].map((b) => b.textContent).join('/')}] timer=${tTxt.textContent}`);
    setKind(1); out.push(`short break=${tTxt.textContent}`); setKind(0); toggleRun(); await sleep(1150); const after = tTxt.textContent; stopRun(); setKind(0); out.push(`ran 1s → ${after}, reset → ${tTxt.textContent}`);
    setMode('ambient', true); await sleep(80); out.push(`ambient: widget=${!amb.classList.contains('off')} ${aKind.textContent} ${aTxt.textContent} bg=${bgFront.style.background.startsWith('url(') ? 'forest-illustration' : 'gradient'} label=${mlabel.textContent}`);
    setMode('home', true); openPanel('tasks'); const ti = panels.tasks.querySelector('input[type=text]'); ti.value = 'Ship the clone'; ti.dispatchEvent(new Event('input')); out.push(`tasks panel open=${!panels.tasks.classList.contains('off')} rows=${panels.tasks.querySelectorAll('.fl-row').length} first="${st.tasks[0]}"`);
    panels.tasks.querySelector('.fl-add button').click(); out.push(`+Add Task upsell=${!ups.classList.contains('off')}`); ups.classList.add('off'); openPanel(null);
    openSettings(true); tab = 'home'; cat = 'scenic'; drawMain(); const th = main.querySelector('[data-theme="Lofi Clouds"]'); th.click(); await sleep(60); out.push(`settings drawer open=${!drawer.classList.contains('off')} scenic thumbs=${main.querySelectorAll('.fl-th').length} applied=${st.themes.home}`);
    cat = 'all'; navK = 'Themes'; openSettings(false);
    st = JSON.parse(snap); st.mode = 'home'; save(); drawRows(); noteTa.value = st.note; setMode('home', true); setBg(bgOf(st.themes.home)); kind = 0; left = st.dur[0] * 60; drawT(); await sleep(100);
    return out.join('; ') + '; restored Home + Thermal'; };
  root._cleanup = () => { clearInterval(clockIv); clearInterval(qIv); stopRun(); };
};
V['dinamo-favorit-fullscreen-variable-axis-tester'] = (root, T) => {
  import('@fontsource-variable/roboto-flex/full.css');
  theme(root, T, { bg: '#ffffff', fg: '#000', ac: '#0015ba', dark: false }); scroll(root);
  const FV = "'Roboto Flex Variable','ABC Favorit','ABCFavoritWidthsVariable',system-ui,sans-serif", MO = "'JetBrains Mono Variable','ABC Favorit Mono',monospace";
  const HERO = '#0045ad', BAND = '#085ddd', CARD = '#0015ba', BAR = '#001df5', PILL = '#e6e9eb';
  const AX = { slnt: [-10, 0, 0], wdth: [25, 151, 100], wght: [100, 1000, 400] }; // [min,max,default] — Roboto Flex ranges (Favorit Widths uses its own)
  const LBL = { slnt: 'Slant', wdth: 'Width', wght: 'Weight' };
  const FAMS = [['Favorit', 100], ['Favorit Compressed', 30], ['Favorit Condensed', 62], ['Favorit Extended', 130], ['Favorit Expanded', 151], ['Favorit Lining', 100], ['Favorit Mono', 100]];
  const STY = [['Light', 300], ['Book', 350], ['Regular', 400], ['Medium', 500], ['Bold', 700], ['Extrabold', 800], ['Black', 900], ['Ultra', 1000]];
  const fvs = (v) => `'wdth' ${v.wdth.toFixed(1)}, 'wght' ${v.wght.toFixed(0)}, 'slnt' ${v.slnt.toFixed(2)}, 'opsz' 144`;
  root.append(h('style', {}, `.dn{font:400 16px/1.3 ${FV};color:#000;background:#fff;min-height:100%;position:relative;font-variation-settings:'wdth' 108,'opsz' 28}
.dn-top{position:absolute;top:0;left:0;right:0;z-index:30}.dn-top .in{display:flex;align-items:center;justify-content:space-between;padding:10px 12px}
.dn .p{border:0;border-radius:99px;background:${PILL};color:#000;font:400 15px/1 ${FV};padding:4px 9px 5px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:5px;transition:background .15s,color .15s}.dn .p:hover{background:#fff}.dn .p.k{background:#000;color:#fff}.dn .p.b{background:${HERO};color:#fff}.dn .p.on{background:#000;color:#fff}
.dn-logo{font:450 19px ${FV};letter-spacing:.02em;color:#fff;font-variation-settings:'wdth' 110;display:flex;gap:6px;align-items:center}.dn-logo sup{font-size:9px}
.dn-hero{background:${HERO};height:700px;display:grid;place-items:center;position:relative}
.dn .dn-fam{border:0;background:#f0f4f6;border-radius:999px;padding:18px 58px 22px 64px;font:400 104px/1 ${FV};letter-spacing:-.01em;font-variation-settings:'wdth' 112,'wght' 410,'opsz' 32;display:flex;align-items:center;gap:26px;cursor:pointer;transition:transform .2s,font-variation-settings .4s}.dn .dn-fam:hover{transform:scale(1.02)}
.dn-arr{display:flex;flex-direction:column;font-size:26px;line-height:.9}
.dn-dd{position:absolute;top:calc(50% + 100px);left:50%;transform:translateX(-50%);background:#f0f4f6;border-radius:28px;padding:10px;display:grid;gap:2px;min-width:420px;z-index:5;box-shadow:0 20px 60px #0004;transition:opacity .18s}.dn-dd.off{opacity:0;pointer-events:none}.dn .dn-dd button{border:0;background:none;text-align:left;padding:8px 18px;border-radius:18px;font:400 26px ${FV};cursor:pointer}.dn .dn-dd button:hover,.dn .dn-dd button.on{background:#fff}
.dn-band{background:${BAND};color:#fff;padding:58px 0 40px}.dn-tabs{position:sticky;top:0;z-index:20;display:flex;gap:4px;justify-content:center;padding:14px 0;margin-bottom:-58px;height:58px;box-sizing:border-box}
.dn-names{display:flex;gap:44px;white-space:nowrap;overflow:hidden;font:400 84px/1.05 ${FV};padding:6px 0 24px;margin-left:-12px}.dn-names span{display:inline-flex;align-items:flex-start;gap:8px;cursor:pointer}.dn-names i{font:400 11px/1 ${MO};font-style:normal;border:1px solid #fff;border-radius:99px;padding:3px 6px;margin-top:52px}
.dn-trk{display:flex;gap:44px;animation:dnmq 60s linear infinite}.dn-names:hover .dn-trk{animation-play-state:paused}@keyframes dnmq{to{transform:translateX(-50%)}}
.dn-sty{display:grid;grid-template-columns:repeat(4,1fr);gap:4px 30px;padding:20px 40px 0}.dn-sty div{font:400 34px/1.5 ${FV};border-top:1px solid #ffffff44;padding-top:6px;cursor:default}.dn-sty small{display:block;font:400 11px ${MO};opacity:.75}
.dn-sec{padding:70px 0 40px;position:relative}.dn-h{text-align:center;font:400 13px ${MO};letter-spacing:.06em;margin-bottom:20px;text-transform:uppercase}
.dn-card{margin:0 96px;height:740px;border-radius:72px;background:${CARD};color:#fff;position:relative;display:flex;flex-direction:column;align-items:center;cursor:zoom-in;overflow:hidden}
.dn-card .lab{margin-top:30px;font:400 14px ${FV}}.dn-txt{flex:1;display:flex;align-items:center;justify-content:center;text-align:center;outline:none;padding:0 60px;font-family:${FV};line-height:1.08;cursor:text;word-break:break-word;caret-color:#fff}
.dn-card .dn-txt{font-size:170px}.dn-sls{display:flex;gap:26px;margin-bottom:44px;font:400 10.5px ${MO}}.dn-sls label{display:flex;align-items:center;gap:14px;white-space:nowrap}.dn-sls b{font-weight:400;min-width:62px}
.dn input[type=range]{appearance:none;-webkit-appearance:none;background:none;width:112px;height:16px;cursor:pointer;margin:0}.dn input[type=range]::-webkit-slider-runnable-track{height:1.5px;background:currentColor}.dn input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:currentColor;margin-top:-5.75px}
.dn input[type=range]::-moz-range-track{height:1.5px;background:currentColor}.dn input[type=range]::-moz-range-thumb{width:13px;height:13px;border:0;border-radius:50%;background:currentColor}
.dn-fs{position:fixed;left:0;right:0;bottom:0;top:var(--tg-h,38px);background:${CARD};color:#fff;z-index:60;display:flex;flex-direction:column}.dn-fs.off{display:none}
.dn-fs .bar{display:flex;align-items:center;justify-content:space-between;padding:10px 12px}.dn-fs select{appearance:none;-webkit-appearance:none;background:#f0f4f6 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='12'%3E%3Cpath d='M1 5l3-3 3 3M1 7l3 3 3-3' fill='none' stroke='%23000'/%3E%3C/svg%3E") no-repeat right 8px center;border:0;border-radius:7px;padding:4px 34px 4px 8px;font:400 15px ${FV};width:220px;cursor:pointer}
.dn .x{width:56px;height:30px;border-radius:99px;border:0;background:#000;color:#fff;display:grid;place-items:center;cursor:pointer}.dn-help{display:flex;align-items:center;gap:8px;font:400 15px ${FV}}.dn-help .p{padding:4px 14px 5px}
.dn-pop{position:absolute;right:12px;top:48px;width:340px;background:#fff;color:#000;border-radius:22px;padding:18px 20px;font:400 15px/1.4 ${FV};box-shadow:0 20px 60px #0005;transition:opacity .2s}.dn-pop.off{opacity:0;pointer-events:none}
.dn-fs .dn-txt{font-size:clamp(64px,11.6vw,200px);line-height:1.22}
.dn-cap{align-self:center;display:flex;gap:6px;background:${BAR};padding:5px;border-radius:99px;margin-bottom:38px}.dn-cap>*{background:#fff;color:#000;border-radius:99px;height:32px;display:flex;align-items:center;border:0}.dn-cap button{width:56px;justify-content:center;cursor:pointer}
.dn-cap label{padding:0 10px 0 9px;gap:10px;font:400 11px ${MO};width:200px;white-space:nowrap}.dn-cap label b{font-weight:400;min-width:76px}.dn-card input[type=range]{color:#fff}.dn-cap input[type=range]{width:96px;color:#000}
.dn-cookie{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);width:560px;background:#ff0;border-radius:24px;padding:16px 20px 12px;z-index:40;font:400 11.5px/1.35 ${MO};transition:transform .5s cubic-bezier(.5,-.4,.6,1),opacity .4s}.dn-cookie.off{transform:translate(-50%,160%);opacity:0;pointer-events:none}.dn-cookie .row{display:flex;gap:6px;justify-content:center;margin-top:12px}.dn-cookie .p{font-size:14px}
.dn-hand{position:fixed;left:0;bottom:-6px;width:380px;z-index:39;pointer-events:none;transition:transform .7s cubic-bezier(.5,-.3,.6,1),opacity .5s}.dn-hand.off{transform:translate(-60px,240px) rotate(-12deg);opacity:0}.dn-hand .ck{transform-origin:200px 120px;animation:dnck 3s ease-in-out infinite alternate}@keyframes dnck{to{transform:translateY(-8px) rotate(-4deg)}}
.dn-feat{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0 96px}.dn-feat>div{background:#f0f4f6;border-radius:40px;height:300px;display:flex;flex-direction:column;align-items:center;padding:20px;position:relative;overflow:hidden}.dn-feat .t{font:400 13px ${FV}}.dn-feat .g{flex:1;display:grid;place-items:center;font:400 120px/1 ${FV};transition:font-variation-settings .35s}.dn-feat>div:hover .g{font-variation-settings:'wght' 900,'wdth' 140}
.dn-gl{display:grid;grid-template-columns:420px 1fr;gap:20px;margin:0 96px}.dn-gbig{background:${CARD};color:#fff;border-radius:40px;display:grid;place-items:center;font:400 300px/1 ${FV};height:460px}.dn-gg{display:grid;grid-template-columns:repeat(12,1fr);gap:4px;align-content:start}.dn-gg span{aspect-ratio:1;display:grid;place-items:center;border-radius:12px;background:#f0f4f6;font:400 26px ${FV};cursor:pointer;transition:background .1s}.dn-gg span:hover,.dn-gg span.on{background:${CARD};color:#fff}
.dn-ft{margin-top:80px;background:#000;color:#fff;padding:40px 40px 80px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px;font:400 15px/1.6 ${FV}}.dn-ft b{display:block;font:400 11px ${MO};opacity:.6;margin-bottom:8px}`));
  const dn = h('div.dn'); root.append(dn);
  const val = { slnt: 0, wdth: 100, wght: 400 }; let text = 'He tried her best', playing = true, open = false, fam = 'Favorit', famW = 100, fsFamily = 'Favorit Widths Variable';
  // nav
  const bag = h('button.p.k', { onclick: () => toast('Bag is empty (demo)') }, 'Bag (0)');
  const top = h('div.dn-top', {}, h('div.in', {}, h('button.p.k', { style: { padding: '3px 12px' }, title: 'Menu', onclick: () => toast('Menu: Typefaces · Customize fonts · About · Client Work…') }, h('span', { style: { fontSize: '13px', letterSpacing: '-1px' } }, '☰')), h('div.dn-logo', {}, 'DINAMO', h('sup', {}, '®'), h('span', { style: { fontSize: '18px' } }, '👄')), h('div', { style: { display: 'flex', gap: '4px' } }, h('button.p', {}, h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#2bd36b' } }), '43 online'), h('button.p', {}, 'Trial fonts'), h('button.p', {}, 'Login'), h('button.p', { style: { padding: '4px 13px' } }, '⌕'), bag)));
  // hero family switcher
  const famBtn = h('button.dn-fam', { onclick: (e) => { e.stopPropagation(); dd.classList.toggle('off'); } }, h('span.n', {}, 'Favorit'), h('span.dn-arr', {}, '▲', h('span', {}, '▼')));
  const dd = h('div.dn-dd.off'); const drawDd = () => dd.replaceChildren(...FAMS.map(([n, w]) => h('button', { class: n === fam ? 'on' : '', style: { fontVariationSettings: `'wdth' ${w}` }, onclick: () => setFam(n, w) }, n)));
  const setFam = (n, w) => { fam = n; famW = w; famBtn.querySelector('.n').textContent = n; famBtn.style.fontVariationSettings = `'wdth' ${w}`; famBtn.style.fontFamily = n === 'Favorit Mono' ? MO : ''; dd.classList.add('off'); drawDd(); };
  drawDd(); dn.addEventListener('click', () => dd.classList.add('off'));
  const hero = h('div.dn-hero', {}, famBtn, dd);
  // sticky tabs
  const TABS = ['Families', 'Try', 'Features', 'Info', 'Glyphs', 'In Use']; const secs = {};
  const tabs = h('div.dn-tabs', {}, h('button.p', { onclick: () => go('Families') }, '☰ Families'), ...TABS.slice(1).map((t) => h('button.p', { 'data-tab': t, onclick: () => (t === 'Try' ? openFs() : go(t)) }, t)), h('button.p.b', { onclick: () => toast('PDF Specimen download (demo)') }, '↘ PDF Specimen'), h('button.p.b', { onclick: () => toast('Trial fonts download (demo)') }, '↘ Trial fonts'), h('button.p.k', { onclick: () => toast('Buy Favorit (demo)') }, 'Buy'));
  const go = (k) => { const el = secs[k]; if (el) root.scrollTo({ top: el.offsetTop - 50, behavior: 'smooth' }); };
  const names = h('div.dn-names', {}, h('div.dn-trk', {}, ...[0, 1].flatMap(() => FAMS.map(([n, w]) => h('span', { style: { fontVariationSettings: `'wdth' ${w}`, fontFamily: n === 'Favorit Mono' ? MO : '' }, onclick: () => { setFam(n, w); root.scrollTo({ top: 0, behavior: 'smooth' }); } }, n, h('i', {}, '16'))))));
  const sty = h('div.dn-sty', {}, ...STY.flatMap(([n, w]) => [h('div', { style: { fontVariationSettings: `'wght' ${w}` } }, h('small', {}, `Favorit ${n}`), n), h('div', { style: { fontVariationSettings: `'wght' ${w}, 'slnt' -10`, fontStyle: 'oblique 10deg' } }, h('small', {}, `Favorit ${n} Italic`), `${n} Italic`)]).slice(0, 8));
  const band = h('div.dn-band', {}, names, sty); secs.Families = band;
  // tester card
  const sl = {}; const mkSl = (k, cap) => { const b = h('b'), inp = h('input', { type: 'range', min: AX[k][0], max: AX[k][1], step: 1, value: val[k] });
    inp.addEventListener('pointerdown', () => { if (cap) setPlay(false); }); inp.addEventListener('input', (e) => { val[k] = +e.target.value; if (cap) setPlay(false); apply(); }); inp.addEventListener('click', (e) => e.stopPropagation());
    (sl[k] ||= []).push([b, inp]); return h('label', { onclick: (e) => e.stopPropagation() }, b, inp); };
  const cardTxt = h('div.dn-txt', { contenteditable: 'plaintext-only', spellcheck: 'false', onclick: (e) => e.stopPropagation(), oninput: (e) => { text = e.target.innerText; fsTxt.innerText = text; } }, text);
  const card = h('div.dn-card', { title: 'Click to try fullscreen', onclick: () => openFs() }, h('div.lab', {}, 'Favorit Widths Variable'), cardTxt, h('div.dn-sls', {}, mkSl('slnt'), mkSl('wdth'), mkSl('wght')));
  const trySec = h('div.dn-sec', {}, h('div.dn-h', {}, 'Try me'), card); secs.Try = trySec;
  // fullscreen tester
  const fsTxt = h('div.dn-txt', { contenteditable: 'plaintext-only', spellcheck: 'false', oninput: (e) => { text = e.target.innerText; cardTxt.innerText = text; } }, text);
  const playBtn = h('button', { title: 'Pause', onclick: () => setPlay(!playing) }); const ICP = '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="1.5" width="2.6" height="9" fill="#000"/><rect x="7.4" y="1.5" width="2.6" height="9" fill="#000"/></svg>', ICPL = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 1.5v9l8-4.5z" fill="#000"/></svg>';
  const setPlay = (p) => { playing = p; playBtn.innerHTML = p ? ICP : ICPL; playBtn.title = p ? 'Pause' : 'Play'; last = performance.now(); };
  const pop = h('div.dn-pop.off', {}, h('b', {}, 'Variable fonts'), h('br'), 'One font file that contains a continuous design space. Instead of picking a fixed weight, you can set any value along each axis — here Slant, Width and Weight — and animate between them.');
  const sel = h('select', { onchange: (e) => { fsFamily = e.target.value; apply(); } }, ...['Favorit Widths Variable', 'Favorit Variable', 'Favorit Mono Variable'].map((n) => h('option', { value: n }, n)));
  const fs0 = h('div.dn-fs.off', {}, h('div.bar', {}, sel, h('button.x', { title: 'Close (Esc)', onclick: () => closeFs(), html: '<svg width="14" height="14" viewBox="0 0 14 14" stroke="#fff" stroke-width="1.6"><path d="M2 2l10 10M12 2 2 12"/></svg>' }), h('div.dn-help', {}, 'What are Variable Fonts? Asking for a friend', h('button.p', { onclick: () => pop.classList.toggle('off') }, '?'))), pop, fsTxt,
    h('div.dn-cap', {}, playBtn, h('button', { title: 'Reset', onclick: () => resetAx(), html: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/></svg>' }), mkSl('slnt', true), mkSl('wdth', true), mkSl('wght', true)));
  const apply = () => { const v = fsFamily === 'Favorit Variable' ? { ...val, wdth: 100 } : val; const f = fvs(v);
    cardTxt.style.fontVariationSettings = fsTxt.style.fontVariationSettings = f; const mono = fsFamily === 'Favorit Mono Variable'; fsTxt.style.fontFamily = mono ? MO : ''; fsTxt.style.fontWeight = mono ? Math.min(800, val.wght) : '';
    for (const k of Object.keys(sl)) for (const [b, inp] of sl[k]) { b.textContent = `${LBL[k]} ${Math.round(val[k])}`; if (document.activeElement !== inp) inp.value = val[k]; } };
  // auto-animation: each axis follows its own sine; phase is solved so playback continues from the current value
  const PER = { slnt: 7.3, wdth: 11.1, wght: 8.7 }; const ph = {}; const cen = (k) => (AX[k][0] + AX[k][1]) / 2, amp = (k) => (AX[k][1] - AX[k][0]) / 2;
  const syncPhase = () => { for (const k in AX) ph[k] = Math.asin(clamp((val[k] - cen(k)) / amp(k), -1, 1)); };
  let last = performance.now(), raf = 0; const loop = (now) => { raf = requestAnimationFrame(loop); const dt = Math.min(.1, (now - last) / 1000); last = now; if (!open || !playing) return; for (const k in AX) { ph[k] += dt * 2 * Math.PI / PER[k]; val[k] = cen(k) + amp(k) * Math.sin(ph[k]); } apply(); };
  const resetAx = () => { for (const k in AX) val[k] = AX[k][2]; syncPhase(); apply(); };
  const openFs = () => { if (open) return; open = true; syncPhase(); fs0.classList.remove('off'); fsTxt.innerText = text; const r = card.getBoundingClientRect(), W = innerWidth, H = innerHeight, tg = fs0.getBoundingClientRect().top;
    fs0.animate([{ clipPath: `inset(${r.top - tg}px ${W - r.right}px ${H - r.bottom}px ${r.left}px round 72px)` }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' }); setPlay(true); last = performance.now(); };
  const closeFs = () => { if (!open) return; const r = card.getBoundingClientRect(), W = innerWidth, H = innerHeight, tg = fs0.getBoundingClientRect().top; pop.classList.add('off');
    const a = fs0.animate([{ clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: `inset(${Math.max(0, r.top - tg)}px ${W - r.right}px ${Math.max(0, H - r.bottom)}px ${r.left}px round 72px)` }], { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)' }); open = false; a.onfinish = () => { if (!open) fs0.classList.add('off'); }; };
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFs(); });
  // features + glyphs
  const FEAT = [['Alternate Ampersand', '&', 'ss01'], ['Alternate at', '@', 'ss02'], ['Alternate ?', '?', 'ss03'], ['Alternate a & y', 'Variety', 'ss04'], ['Alternate Capital R', 'RR', 'ss05'], ['Slashed Zero, Tabular Figures', 'Coffee 01', 'zero'], ['Oldstyle Figures', '0123', 'onum']];
  const feat = h('div.dn-sec', {}, h('div.dn-h', {}, 'Features'), h('div.dn-feat', {}, ...FEAT.slice(0, 6).map(([n, g, f]) => h('div', {}, h('div.t', {}, n), h('div.g', { style: { fontSize: g.length > 3 ? '78px' : '' } }, g), h('button.p', { onclick: () => copy(`font-feature-settings: "${f}" 1;`, 'CSS copied') }, 'Copy CSS Code'))))); secs.Features = feat;
  const big = h('div.dn-gbig', {}, 'a'); const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&@?!(){}#%'.split('');
  const gg = h('div.dn-gg', {}, ...GL.map((c, i) => h('span', { class: c === 'a' ? 'on' : '', onmouseenter: (e) => { big.textContent = c; gg.querySelectorAll('.on').forEach((x) => x.classList.remove('on')); e.currentTarget.classList.add('on'); } }, c)));
  const glyph = h('div.dn-sec', {}, h('div.dn-h', {}, 'Glyphs'), h('div.dn-gl', {}, big, gg)); secs.Glyphs = glyph;
  const info = h('div.dn-sec', {}, h('div.dn-h', {}, 'Info'), h('p', { style: { margin: '0 96px', font: `400 34px/1.3 ${FV}` } }, 'Favorit is a contemporary grotesk with a disarming, slightly quirky personality — released 2015, now 7 families and 112 styles from Compressed to Expanded.')); secs.Info = info; secs['In Use'] = info;
  // cookie banner + fortune-cookie hand (illustrated stand-in)
  const hand = h('div.dn-hand', { html: `<svg viewBox="0 0 380 330" width="380" height="330"><defs><linearGradient id="dsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d2b4"/><stop offset="1" stop-color="#e2ad8c"/></linearGradient></defs>
<path d="M-30 330 L-30 300 L70 238 L118 276 L60 330Z" fill="#1d2230"/><path d="M62 236 l20-14 46 40-18 18z" fill="#f7f7f5" stroke="#ddd"/>
<g stroke="url(#dsk)" stroke-linecap="round" fill="none"><path d="M120 252 C150 236 200 228 262 226" stroke-width="19"/><path d="M122 262 C160 252 212 246 268 244" stroke-width="18"/><path d="M126 272 C164 266 210 262 258 262" stroke-width="17"/><path d="M132 282 C166 280 200 278 238 279" stroke-width="15"/><path d="M128 250 C140 230 160 214 186 200" stroke-width="20"/></g>
<ellipse cx="140" cy="262" rx="40" ry="24" fill="url(#dsk)"/><g stroke="#cf9676" stroke-width="1.4" fill="none" opacity=".8"><path d="M196 236c20-2 40-2 60-1"/><path d="M200 254c20-1 40-1 58 0"/><path d="M150 252c14-6 30-8 44-8"/></g>
<g class="ck"><path d="M150 168c14-44 82-66 120-36 16 13 16 34 0 46-20 15-56 14-78 6 4-10 0-20-10-24-10-4-22 0-32 8z" fill="#f2b56a"/><path d="M150 168c10-8 22-12 32-8 10 4 14 14 10 24-22-2-38-6-42-16z" fill="#d68f45"/><path d="M196 140c10-4 30-6 44 0" stroke="#e7a55a" stroke-width="3" fill="none"/>
<path d="M176 128l120-30 9 32-118 28z" fill="#fff" stroke="#ccc"/><text x="190" y="142" transform="rotate(-14 190 142)" font-family="system-ui,Arial" font-size="15" fill="#111">Accept Cookies?</text></g></svg>` });
  const cookie = h('div.dn-cookie', {}, 'By continuing to browse this site, you agree to the use of cookies to identify your session and to remember your login after you close the browser (authentication cookies).', h('div.row', {}, h('button.p', { onclick: () => toast('Cookie policy (demo)') }, 'Learn more'), h('button.p.k', { onclick: () => agree() }, 'Agree & Close')));
  const agree = () => { cookie.classList.add('off'); hand.classList.add('off'); };
  const ft = h('div.dn-ft', {}, h('div', {}, h('b', {}, 'DINAMO'), 'Typefaces', h('br'), 'Customize fonts', h('br'), 'About'), h('div', {}, h('b', {}, 'SERVICES'), 'Client Work', h('br'), 'Hardware', h('br'), 'Events'), h('div', {}, h('b', {}, 'INFO'), 'Students', h('br'), 'Blog', h('br'), 'Licensing'), h('div', {}, h('b', {}, 'NEWSLETTER'), 'Stay in the loop ↗'));
  dn.append(top, hero, tabs, band, trySec, feat, glyph, info, ft, fs0, hand, cookie);
  // tab highlight on scroll (Try turns black once the tester is in view)
  const onScroll = () => { const y = root.scrollTop + 120; let cur = null; for (const k of ['Families', 'Try', 'Features', 'Glyphs', 'Info']) if (secs[k].offsetTop <= y) cur = k; tabs.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === cur)); };
  root.addEventListener('scroll', onScroll); setPlay(true); apply(); raf = requestAnimationFrame(loop);
  window.__demoProof = async () => { const out = [];
    famBtn.click(); out.push(`family dropdown=${!dd.classList.contains('off')} (${dd.children.length})`); setFam('Favorit Condensed', 62); out.push(`pill="${famBtn.querySelector('.n').textContent}"`); setFam('Favorit', 100);
    openFs(); await sleep(650); const a = { ...val }; await sleep(700); const b = { ...val }; out.push(`fullscreen open=${!fs0.classList.contains('off')} autoplay drift wdth ${a.wdth.toFixed(0)}→${b.wdth.toFixed(0)} wght ${a.wght.toFixed(0)}→${b.wght.toFixed(0)} slnt ${a.slnt.toFixed(1)}→${b.slnt.toFixed(1)}`);
    const w = sl.wght[1][1]; w.dispatchEvent(new Event('pointerdown')); w.value = 900; w.dispatchEvent(new Event('input')); out.push(`drag weight → playing=${playing} label="${sl.wght[1][0].textContent}" fvs=${getComputedStyle(fsTxt).fontVariationSettings}`);
    fsTxt.innerText = 'Junbok clones Dinamo'; fsTxt.dispatchEvent(new Event('input')); out.push(`typed → card text="${cardTxt.innerText}"`);
    resetAx(); out.push(`reset → ${sl.slnt[1][0].textContent}/${sl.wdth[1][0].textContent}/${sl.wght[1][0].textContent}`);
    closeFs(); await sleep(450); text = 'He tried her best'; cardTxt.innerText = fsTxt.innerText = text; resetAx(); setPlay(true); agree(); cookie.classList.remove('off'); hand.classList.remove('off'); root.scrollTop = 0;
    return out.join('; ') + `; closed=${fs0.classList.contains('off')}; restored defaults`; };
  root._cleanup = () => cancelAnimationFrame(raf);
};
V['rhode-lip-tint-pdp-swatch-route-cart-drawer'] = (root, T) => {
  import('@fontsource-variable/roboto-flex/full.css');
  theme(root, T, { bg: '#ffffff', fg: '#56534e', ac: '#67645e', dark: false }); scroll(root);
  const RK = "'Roboto Flex Variable','Rektorat','Rektorat Heavy',system-ui,sans-serif", SW = "'Inter Variable','Swiss','Helvetica Neue',Arial,sans-serif";
  const INK = '#56534e', TTL = '#67645e', CARD = '#f1f0ed', LS = 'rhode-demo-cart-v1';
  const SH = [
    { k: 'maple', d: 'shimmery copper', c: '#9f4b16', lim: true, isNew: true }, { k: 'watermelon', d: 'sheer coral pink', c: '#e98096', lim: true, out: true },
    { k: 'jelly bean', d: 'shimmery sheer pink', c: '#d682a8' }, { k: 'ribbon', d: 'sheer pink', c: '#cb7687' }, { k: 'pretzel', d: 'shimmery warm mauve', c: '#ab6379' }, { k: 'toast', d: 'sheer warm nude', c: '#a56559' },
    { k: 'cinnamon', d: 'sheer rosy brown', c: '#a05f65' }, { k: 'raspberry jelly', d: 'sheer berry', c: '#6f1238' }, { k: 'cherry cola', d: 'sheer deep red', c: '#622125' }, { k: 'espresso', d: 'sheer deep brown', c: '#572e23' }];
  const slug = (s0) => s0.k.replace(/\s+/g, '-');
  const mix = (a, b, t) => { const p = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  // illustrated product shots (placeholders for rhode's photography)
  const shot = (s0, n) => { const c = s0.c, lt = mix(c, '#ffffff', .45), dk = mix(c, '#000000', .35), tube = mix(c, '#f6d6e2', .6), sh = s0.d.includes('shimmer');
    const sp = sh ? Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 97) % 720}" cy="${(i * 53) % 900}" r="${1 + (i % 3)}" fill="#fff" opacity="${.25 + (i % 4) * .15}"/>`).join('') : '';
    const bgs = [`<radialGradient id="b" cx="45%" cy="40%" r="75%"><stop offset="0" stop-color="#f3d5c4"/><stop offset=".6" stop-color="#d8a892"/><stop offset="1" stop-color="#8a5a48"/></radialGradient>`, `<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9e7e4"/><stop offset="1" stop-color="#b9b4ae"/></linearGradient>`, `<linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4efe8"/><stop offset="1" stop-color="#e2d9cd"/></linearGradient>`, `<radialGradient id="b" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="${lt}"/><stop offset="1" stop-color="${dk}"/></radialGradient>`][n];
    const body = [
      `<filter id="sf"><feGaussianBlur stdDeviation="2.2"/></filter><radialGradient id="lg" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="${lt}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${dk}"/></radialGradient><g filter="url(#sf)"><path d="M120 420c80-90 200-120 250-80 50-40 170-10 250 80-60 120-170 190-250 190s-190-70-250-190z" fill="url(#lg)"/><path d="M120 420c90 30 170 36 250 26 80 10 160 4 250-26-30 20-120 60-250 60s-220-40-250-60z" fill="${dk}" opacity=".55"/><path d="M200 380c40-30 100-40 150-20" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".55"/><path d="M420 520c50-6 90-26 120-56" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".45"/></g>${sp}<g transform="rotate(-14 330 760)"><rect x="250" y="470" width="150" height="520" rx="70" fill="${tube}"/><rect x="250" y="470" width="150" height="120" rx="70" fill="${mix(tube, '#ffffff', .3)}"/><text x="345" y="900" transform="rotate(-90 345 900)" font-family="Arial" font-weight="700" font-size="34" fill="${mix(c, '#ffffff', .25)}" letter-spacing="2">PEPTIDES</text></g>`,
      `<rect x="285" y="250" width="150" height="620" rx="64" fill="${tube}"/><g fill="none" stroke="${mix(tube, '#000', .12)}" stroke-width="10">${[0, 1, 2, 3, 4].map((i) => `<path d="M285 ${600 + i * 22}h150"/>`).join('')}</g><path d="M300 270c0-80 120-80 120 0" fill="${tube}"/><ellipse cx="335" cy="250" rx="70" ry="62" fill="${c}"/><ellipse cx="315" cy="232" rx="22" ry="14" fill="#fff" opacity=".5"/>${sh ? sp.replace(/r="/g, 'r="0.') : ''}<text x="390" y="820" transform="rotate(-90 390 820)" font-family="Arial" font-size="22" fill="${mix(tube, '#000', .25)}">RH-05-TB15 · 30% PCR</text>`,
      `<path d="M90 520c60-110 220-150 360-120 120 26 200 10 250-30-20 120-160 230-330 240-150 8-250-20-280-90z" fill="${c}"/><path d="M140 500c90-70 210-80 330-56" stroke="${lt}" stroke-width="18" stroke-linecap="round" opacity=".6"/>${sp}<rect x="430" y="140" width="90" height="330" rx="42" fill="${tube}" transform="rotate(28 475 300)"/>`,
      `${sp}${sp.replace(/cx="/g, 'cx="1')}<circle cx="360" cy="450" r="240" fill="#fff" opacity=".08"/>`][n];
    return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 900" preserveAspectRatio="xMidYMid slice"><defs>${bgs}</defs><rect width="720" height="900" fill="url(#b)"/>${body}</svg>`)}") center/cover`; };
  root.append(h('style', {}, `.rh{font:400 15px/1.55 ${SW};color:${INK};background:#fff;padding:15px 32px 0;min-height:100%}
.rh-strip{height:40px;border-radius:10px;background:${CARD};display:grid;place-items:center;font:700 12px ${SW};letter-spacing:.02em;overflow:hidden;position:relative}.rh-strip span{position:absolute;transition:transform .5s,opacity .5s}
.rh-nav{margin-top:17px;height:90px;border-radius:14px;background:${CARD};display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 32px;font:500 16px ${SW};letter-spacing:.045em;position:sticky;top:0;z-index:20}
.rh-nav .l,.rh-nav .r{display:flex;gap:48px}.rh-nav .r{justify-content:flex-end}.rh-nav a{cursor:pointer;color:${INK}}.rh-nav a:hover{opacity:.65}.rh-logo{font:800 44px/1 ${RK};letter-spacing:-.02em;color:${TTL};font-variation-settings:'wdth' 112,'wght' 820}
.rh-main{display:grid;grid-template-columns:727px 1fr;gap:30px;margin-top:5px}
.rh-img{position:relative;height:760px;border-radius:14px;overflow:hidden;background:#ddd}.rh-img .ph{position:absolute;inset:0;transition:opacity .45s}
.rh-rail{position:absolute;left:32px;top:404px;display:flex;flex-direction:column;gap:12px;z-index:2}.rh .rh-rail button{width:52px;height:36px;border-radius:9px;border:1.5px solid transparent;padding:0;cursor:pointer;background-size:cover!important;opacity:.85;transition:opacity .15s,border-color .15s}.rh .rh-rail button.on{border-color:#fff;opacity:1}
.rh-info{background:${CARD};border-radius:14px;padding:30px 28px 26px;align-self:start}
.rh-t{font:900 58px/1 ${RK};color:${TTL};letter-spacing:-.02em;font-variation-settings:'wdth' 96,'wght' 1000,'opsz' 72,'YTUC' 640;margin:8px 0 22px}
.rh-sub{display:flex;justify-content:space-between;align-items:center;font:700 16px ${SW};letter-spacing:.03em;color:#4a4740}.rh-sub small{font:400 14px ${SW};letter-spacing:0;color:${INK}}
.rh-desc{margin:26px 0 28px;font-size:16.5px;line-height:1.6;padding-bottom:28px;border-bottom:1px solid #d9d6d0}
.rh-shade{font-size:16px;display:flex;gap:10px;align-items:baseline}.rh-shade u{text-decoration:none;border-bottom:1px solid ${INK};cursor:pointer;padding-bottom:1px}.rh-shade u b{font-weight:700}
.rh-lab{margin:18px 0 8px;font-size:16px}.rh-chips{display:flex;gap:13px;flex-wrap:wrap}
.rh .rh-chip{width:31px;height:31px;border-radius:50%;border:0;padding:0;cursor:pointer;position:relative;transition:transform .15s,box-shadow .15s;box-shadow:inset 0 0 0 1px #0000001a}.rh .rh-chip:hover{transform:scale(1.08)}.rh .rh-chip.on{box-shadow:0 0 0 2.5px ${CARD},0 0 0 4px ${TTL}}
.rh-chip.out:after{content:'';position:absolute;left:50%;top:-2px;bottom:-2px;width:1.5px;background:${INK};transform:rotate(45deg)}.rh-chip em{position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);background:#3f3c37;color:#fff;font:700 9px/1 ${SW};font-style:normal;padding:2px 5px;border-radius:5px}
.rh-chip .tip{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);background:${TTL};color:#fff;white-space:nowrap;padding:3px 9px;border-radius:6px;font:500 12px ${SW};opacity:0;pointer-events:none;transition:opacity .12s}.rh-chip:hover .tip{opacity:1}
.rh .rh-buy{width:100%;height:50px;border-radius:99px;margin-top:22px;color:#fff;font:500 17px ${SW};letter-spacing:.02em;cursor:pointer;transition:background .35s,filter .15s,transform .1s}.rh .rh-buy:hover{filter:brightness(.96)}.rh .rh-buy:active{transform:scale(.99)}.rh .rh-buy b{font-weight:700}
.rh-aft{font-size:12px;margin-top:12px;display:flex;align-items:center;gap:6px}.rh-aft i{font-style:normal;background:#111;color:#fff;border-radius:5px;padding:0 5px;font-weight:800}
.rh-sec{background:${CARD};border-radius:14px;margin-top:30px;padding:46px 46px}.rh-meet{font:400 44px/1.2 ${SW};letter-spacing:-.02em;color:#3f3c37;max-width:1100px}
.rh-ben{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:30px}.rh-ben li{margin:6px 0}
.rh-rt{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:22px}.rh-rt>div{background:#fff;border-radius:14px;padding:16px}.rh-rt .im{height:240px;border-radius:10px;margin-bottom:12px;background-size:cover!important}.rh-rt b{display:block;font:700 15px ${SW};letter-spacing:.04em}
.rh-ft{margin:30px 0 0;padding:40px 46px 60px;background:${CARD};border-radius:14px 14px 0 0;display:flex;justify-content:space-between;align-items:flex-end}.rh-ft .rh-logo{font-size:120px}
.rh-scrim{position:fixed;inset:var(--tg-h,38px) 0 0 0;background:#000000a6;z-index:50;transition:opacity .3s}.rh-scrim.off{opacity:0;pointer-events:none}
.rh-cart{position:fixed;top:var(--tg-h,38px);right:0;bottom:0;width:min(680px,47vw);background:${CARD};z-index:51;display:flex;flex-direction:column;padding:18px 18px 16px;transition:transform .4s cubic-bezier(.2,.8,.2,1)}.rh-cart.off{transform:translateX(100%)}
.rh-ch{text-align:center;font:400 18px ${SW};position:relative;margin:8px 0 12px}.rh .rh-ch button{position:absolute;right:4px;top:-4px;border:0;background:none;font-size:24px;color:${INK}}
.rh-pb{height:9px;border-radius:99px;border:1.5px solid ${INK};margin:0 80px;overflow:hidden;background:#fff}.rh-pb i{display:block;height:100%;background:#84827e;transition:width .45s}
.rh-pm{text-align:center;font-size:15px;margin:8px 0 14px}.rh-pm b{font-weight:800}
.rh-items{flex:1;overflow:auto;border-top:1px solid #e0ddd7}.rh-it{display:grid;grid-template-columns:76px 1fr auto;gap:14px;padding:20px 12px;border-bottom:1px solid #e0ddd7}.rh-it .th{height:70px;border-radius:8px;background-size:cover!important}
.rh-it b{font:600 17px ${SW};letter-spacing:.04em;color:#4a4740;display:block}.rh-it small{font-size:13px}.rh-st{display:inline-flex;align-items:center;gap:18px;border:1.5px solid ${INK};border-radius:99px;padding:3px 8px;margin-top:10px}.rh .rh-st button{width:20px;height:20px;border-radius:50%;border:0;background:${INK};color:#fff;font:700 14px/1 ${SW};display:grid;place-items:center;padding:0}
.rh-rh{text-align:center;font:400 22px ${SW};margin:16px 0 14px}.rh-rh b{font-weight:800}
.rh-up{background:#fff;border-radius:16px;display:grid;grid-template-columns:62px 1fr auto;gap:12px;align-items:center;padding:18px 14px}.rh-up .th{height:56px;border-radius:8px;background:radial-gradient(40% 50% at 50% 55%,#b07a5a,#8a5a40 70%,transparent 72%),#fff}.rh-up b{font:600 17px ${SW};letter-spacing:.04em;color:#4a4740;display:block}.rh-up select{border:0;border-bottom:1.5px solid ${INK};background:none;font:600 13px ${SW};color:${INK};padding:0 2px}
.rh .pill{border:0;border-radius:99px;background:${TTL};color:#fff;font:500 15px ${SW};padding:9px 24px;letter-spacing:.02em;cursor:pointer}.rh .pill:hover{filter:brightness(1.1)}
.rh-tot{display:flex;justify-content:space-between;font-size:15px;margin:16px 0 4px}.rh-tot b{font-weight:700}.rh .ck{width:100%;height:50px;margin-top:10px;font-size:16px}.rh .ck.o{background:none;border:1.5px solid ${INK};color:${INK}}
.rh-cookie{position:fixed;left:0;right:0;bottom:0;background:${CARD};z-index:40;display:flex;align-items:center;gap:30px;padding:16px 24px 18px;font:400 13.5px/1.5 ${SW};color:#3f3c37;transition:transform .35s}.rh-cookie.off{transform:translateY(110%)}.rh-cookie a{text-decoration:underline;cursor:pointer}.rh .rh-cookie .pill{min-width:240px;padding:9px 20px}.rh .rh-cookie .x{position:absolute;right:14px;top:-14px;width:30px;height:30px;border-radius:50%;border:1.5px solid ${INK};background:#fff;color:${INK};font-size:16px}`));
  const rh = h('div.rh'); root.append(rh);
  const fromHash = () => { const m = location.hash.match(/peptide-lip-tint-([a-z-]+)/); return m && SH.find((s0) => slug(s0) === m[1]); };
  let cur = fromHash() || SH.find((s0) => s0.k === 'pretzel'), imgI = 0; const DEF_SH = 'pretzel';
  let cart; try { cart = JSON.parse(localStorage.getItem(LS) || '[]'); } catch { cart = []; } const saveCart = () => { try { localStorage.setItem(LS, JSON.stringify(cart)); } catch {} };
  // strip rotator
  const MSG = ['FREE US SHIPPING ON ORDERS OVER $45', 'COMPLETE YOUR ROUTINE · SHOP THE DUOS', 'FREE US SHIPPING ON ORDERS OVER $45'];
  const strip = h('div.rh-strip', {}, h('span', {}, MSG[0])); let mi = 0; const sIv = setInterval(() => { const o = strip.firstChild; mi = (mi + 1) % MSG.length; const n = h('span', { style: { transform: 'translateY(30px)', opacity: 0 } }, MSG[mi]); strip.append(n); requestAnimationFrame(() => { o.style.transform = 'translateY(-30px)'; o.style.opacity = 0; n.style.transform = ''; n.style.opacity = 1; }); setTimeout(() => o.remove(), 600); }, 5000);
  const cartLink = h('a', { onclick: () => openCart(true) }, 'CART (0)');
  const nav = h('div.rh-nav', {}, h('div.l', {}, ...['SHOP', 'ABOUT', 'FUTURES'].map((t) => h('a', { onclick: () => toast(`${t} menu (demo)`) }, t))), h('div.rh-logo', {}, 'rhode'), h('div.r', {}, h('a', { onclick: () => toast('Search (demo)') }, 'SEARCH'), h('a', { onclick: () => toast('Account (demo)') }, 'ACCOUNT'), cartLink));
  // gallery
  const phA = h('div.ph'), phB = h('div.ph', { style: { opacity: 0 } }); let phF = phA; const rail = h('div.rh-rail');
  const setImg = (i, fade = true) => { imgI = i; const bg = shot(cur, i); if (fade) { const back = phF === phA ? phB : phA; back.style.background = bg; back.style.opacity = 1; phF.style.opacity = 0; phF = back; } else { phF.style.background = bg; } [...rail.children].forEach((b, j) => b.classList.toggle('on', j === i)); };
  const drawRail = () => rail.replaceChildren(...[0, 1, 2, 3].map((i) => h('button', { class: i === imgI ? 'on' : '', style: { background: shot(cur, i) }, title: `Image ${i + 1}`, onclick: () => setImg(i) })));
  const img = h('div.rh-img', {}, phA, phB, rail);
  // info
  const shadeName = h('b'), shadeDesc = h('span'), buyBtn = h('button.rh-buy', { onclick: () => buy() }); const chipsLim = h('div.rh-chips'), chipsCore = h('div.rh-chips');
  const chip = (s0) => h('button.rh-chip', { class: 'rh-chip' + (s0 === cur ? ' on' : '') + (s0.out ? ' out' : ''), 'data-shade': slug(s0), style: { background: s0.isNew ? `linear-gradient(135deg,${s0.c} 45%,${mix(s0.c, '#f3c39a', .5)} 50%,${s0.c} 56%)` : s0.c }, 'aria-label': s0.k, onclick: () => selectShade(s0) }, h('span.tip', {}, s0.k + (s0.out ? ' · sold out' : '')), s0.isNew ? h('em', {}, 'new') : '');
  const desc = h('div.rh-desc'); const meet = h('div.rh-meet');
  const drawInfo = () => { shadeName.textContent = cur.k + ' -'; shadeDesc.textContent = ' ' + cur.d; chipsLim.replaceChildren(...SH.filter((s0) => s0.lim).map(chip)); chipsCore.replaceChildren(...SH.filter((s0) => !s0.lim).map(chip));
    const bc = mix(cur.c, '#ffffff', .22); buyBtn.style.background = cur.out ? '#bdb9b2' : bc; buyBtn.style.border = `1px solid ${cur.out ? '#a9a59e' : mix(cur.c, '#000', .12)}`; buyBtn.replaceChildren(...(cur.out ? ['SOLD OUT - ', h('b', {}, 'NOTIFY ME')] : ['BUY LIP TINT - ', h('b', {}, '$20.00')]));
    const Cap = cur.k.replace(/\b\w/g, (m) => m.toUpperCase()); desc.textContent = `Peptide Lip Tint in ${Cap} ${cur.k === 'pretzel' ? 'has joined the rhode lineup forever. It’s' : 'is'} a nourishing formula with a hint of tint${cur.d.includes('shimmer') ? ' and shimmer' : ''} that hydrates and replenishes lips while leaving a glossy, high-shine finish.${cur.k === 'pretzel' ? ' Smells like a caramel-glazed pretzel.' : ''} Size: 10 ml / 0.3 fl oz.`;
    meet.textContent = `meet ${cur.k} — a ${cur.d} tint that melts onto lips for a glossy, cushiony finish. wear it alone for sheer color or layered over pocket blush and peptide lip shape.`; };
  const selectShade = (s0, push = true) => { if (s0 === cur) return; cur = s0; if (push) history.pushState({ shade: slug(s0) }, '', `${location.pathname}${location.search}#/products/peptide-lip-tint-${slug(s0)}`); drawInfo(); drawRail(); setImg(0); document.title = `peptide lip tint ${s0.k} | rhode`; };
  addEventListener('popstate', () => { const s0 = fromHash() || SH.find((x) => x.k === DEF_SH); selectShade(s0, false); });
  const info = h('div.rh-info', {}, h('div.rh-t', {}, 'peptide lip tint'), h('div.rh-sub', {}, 'THE TINTED LIP LAYER', h('small', {}, h('span', { style: { letterSpacing: '1px', color: '#4a4740' } }, '★★★★', h('span', { style: { opacity: .45 } }, '★')), '  (16,684)')), desc,
    h('div.rh-shade', {}, 'Shade:', h('u', { onclick: () => toast('Shade list ▾ (demo — use the swatches)') }, shadeName, shadeDesc, '  ▾')), h('div.rh-lab', {}, 'Limited Edition'), chipsLim, h('div.rh-lab', { style: { marginTop: '22px' } }, 'Core Shades'), chipsCore, buyBtn,
    h('div.rh-aft', {}, 'or 4 interest-free payments of ', h('b', {}, '$5.00'), ' with ', h('i', {}, 'S'), h('b', {}, 'Afterpay'), ' ⓘ'));
  // cart drawer
  const items = h('div.rh-items'), cnt = h('span'), pbI = h('i'), pm = h('div.rh-pm'), sub = h('b'); const blush = h('select', {}, ...['piggy', 'freckle', 'sweetpea', 'toasted teddy'].map((n) => h('option', {}, n)));
  const total = () => cart.reduce((a, it) => a + it.price * it.qty, 0);
  const drawCart = () => { const n = cart.reduce((a, it) => a + it.qty, 0), t = total(); cartLink.textContent = `CART (${n})`; cnt.textContent = `${n} item${n === 1 ? '' : 's'}`; pbI.style.width = `${Math.min(100, t / 45 * 100)}%`;
    pm.replaceChildren(...(t >= 45 ? ['you’ve unlocked ', h('b', {}, 'FREE'), ' shipping!'] : [`add $${(45 - t).toFixed(2)} more for `, h('b', {}, 'FREE'), ' shipping'])); sub.textContent = `$${t.toFixed(2)}`;
    items.replaceChildren(...cart.map((it) => h('div.rh-it', {}, h('div.th', { style: { background: it.kind === 'lip' ? shot(SH.find((s0) => s0.k === it.variant) || cur, 1) : 'radial-gradient(35% 45% at 50% 55%,#b07a5a,#8a5a40 70%,transparent 72%),#fff' } }), h('div', {}, h('b', {}, it.name), h('small', {}, it.variant), h('br'), h('div.rh-st', {}, h('button', { onclick: () => qty(it, -1) }, '−'), h('span', {}, it.qty), h('button', { onclick: () => qty(it, 1) }, '+'))), h('b', { style: { fontWeight: 600 } }, `$${(it.price * it.qty).toFixed(2)}`))), cart.length ? '' : h('div', { style: { textAlign: 'center', padding: '50px 0', opacity: .7 } }, 'your cart is empty')); };
  const qty = (it, d) => { it.qty += d; if (it.qty <= 0) cart = cart.filter((x) => x !== it); saveCart(); drawCart(); };
  const add = (kind, name, variant, price) => { const f = cart.find((x) => x.name === name && x.variant === variant); if (f) f.qty++; else cart.push({ kind, name, variant, price, qty: 1 }); saveCart(); drawCart(); };
  const buy = () => { if (cur.out) { toast(`We’ll email you when ${cur.k} is back (demo)`); return; } add('lip', 'PEPTIDE LIP TINT', cur.k, 20); openCart(true); };
  const scrim = h('div.rh-scrim.off', { onclick: () => openCart(false) });
  const drawer = h('div.rh-cart.off', {}, h('div.rh-ch', {}, cnt, h('button', { onclick: () => openCart(false), title: 'Close' }, '✕')), h('div.rh-pb', {}, pbI), pm, items,
    h('div.rh-rh', {}, 'Complete your rhode ', h('b', {}, 'ROUTINE')), h('div.rh-up', {}, h('div.th'), h('div', {}, h('b', {}, 'POCKET BLUSH'), blush), h('button.pill', { onclick: () => add('blush', 'POCKET BLUSH', blush.value, 25) }, 'ADD - $25.00')),
    h('div.rh-tot', {}, 'subtotal', sub), h('div', { style: { fontSize: '12px' } }, '*shipping, taxes, and discounts calculated at checkout.'), h('button.pill.ck', { onclick: () => toast('Checkout is disabled in this clone') }, 'CHECKOUT'), h('button.pill.ck.o', { onclick: () => toast('Checkout is disabled in this clone') }, 'CHECKOUT WITH PACKAGE PROTECTION'), h('div', { style: { textAlign: 'center', fontSize: '11px', marginTop: '8px' } }, '+$0.98 for coverage on lost, damaged, or delayed orders. ⓘ'));
  const openCart = (on) => { scrim.classList.toggle('off', !on); drawer.classList.toggle('off', !on); };
  addEventListener('keydown', (e) => { if (e.key === 'Escape') openCart(false); });
  // below the fold
  const RT = [['POCKET BRONZE', 'Long-wearing warmth', '$25.00', 'radial-gradient(30% 40% at 50% 50%,#9a5a3a,#6a3a24 70%,transparent 72%),linear-gradient(#efe9e2,#dcd2c6)'], ['PEPTIDE LIP SHAPE', 'The contouring lip shaper', '$24.00', 'linear-gradient(60deg,transparent 44%,#8a5a4a 44% 56%,transparent 56%),linear-gradient(#f1ece6,#ddd3c8)'], ['SNAP-ON LIP CASE', 'Lip holder with MagSafe', '$46.00', 'radial-gradient(30% 45% at 50% 50%,#d9c8ba,#bfae9f 70%,transparent 72%),linear-gradient(#ece7e1,#d6cdc2)']];
  const below = [h('div.rh-sec', {}, meet, h('div.rh-ben', {}, h('div', {}, h('b', { style: { letterSpacing: '.06em' } }, 'BENEFITS'), h('ul', {}, ...['Sheer-but-buildable color melts onto lips', 'Helps immediately lock in moisture', 'Nourishes, hydrates, and replenishes dry lips', 'Leaves lips feeling pillowy-soft'].map((x) => h('li', {}, x)))), h('div', {}, h('b', { style: { letterSpacing: '.06em' } }, 'HOW TO USE'), h('p', {}, 'Apply to lips on its own or over Peptide Lip Shape. Reapply as needed throughout the day.')))),
    h('div.rh-sec', {}, h('b', { style: { letterSpacing: '.06em', fontSize: '16px' } }, 'COMPLETE YOUR ROUTINE'), h('div.rh-rt', {}, ...RT.map(([n, d, p, bg]) => h('div', {}, h('div.im', { style: { background: bg } }), h('b', {}, n), d, h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' } }, p, h('button.pill', { onclick: () => { add('blush', n, '', +p.slice(1)); openCart(true); } }, 'ADD')))))),
    h('div.rh-ft', {}, h('div.rh-logo', {}, 'rhode'), h('div', { style: { textAlign: 'right', fontSize: '13px' } }, 'SHOP · ABOUT · FUTURES · FAQ', h('br'), '© rhode-style clone · demo only'))];
  const cookie = h('div.rh-cookie', {}, h('div', { style: { flex: 1 } }, 'This website utilizes technologies such as cookies to enable essential site functionality, as well as for analytics, personalization, and targeted advertising. To learn more, view the following link: ', h('a', {}, 'Cookie Policy'), '  |  ', h('a', {}, 'Privacy Policy')), h('button.pill', { onclick: () => toast('Cookie preferences (demo)') }, 'PREFERENCES'), h('button.x', { title: 'Close', onclick: () => cookie.classList.add('off') }, '✕'));
  rh.append(strip, nav, h('div.rh-main', {}, img, info), ...below, scrim, drawer, cookie);
  drawInfo(); drawRail(); setImg(0, false); drawCart();
  window.__demoProof = async () => { const out = [], cart0 = JSON.stringify(cart), base = SH.find((s0) => s0.k === DEF_SH);
    if (cur !== base) selectShade(base, false);
    const p0 = phF.style.background; rhChipClick('jelly-bean'); await sleep(80); out.push(`swatch jelly bean → url=${location.hash} label="${shadeName.textContent}${shadeDesc.textContent}" hero swapped=${phF.style.background !== p0 && phF.style.background !== ''} button=${buyBtn.style.background}`);
    rhChipClick('watermelon'); out.push(`sold-out → "${buyBtn.textContent}"`); rhChipClick('jelly-bean');
    const n0 = cart.reduce((a, it) => a + it.qty, 0); buyBtn.click(); await sleep(60); out.push(`buy → drawer open=${!drawer.classList.contains('off')} ${cnt.textContent}, progress=${pbI.style.width}, "${pm.textContent}", nav ${cartLink.textContent}`);
    drawer.querySelector('.rh-up .pill').click(); out.push(`+ pocket blush → subtotal ${sub.textContent}, "${pm.textContent}"`); const plus = items.querySelector('.rh-st button:last-child'); plus.click(); out.push(`stepper + → ${cnt.textContent}`);
    openCart(false); cart = JSON.parse(cart0); saveCart(); drawCart(); history.replaceState(null, '', location.pathname + location.search); selectShade(base, false); document.title = 'peptide lip tint pretzel | rhode';
    void n0; return out.join('; ') + `; restored pretzel + cart(${cart.length}) + url`; };
  const rhChipClick = (k) => rh.querySelector(`[data-shade="${k}"]`).click();
  root._cleanup = () => clearInterval(sIv);
};
export function mount(root, variant, opts, T) { (V[variant] || V['pricing-tier-cards'])(root, T); }
