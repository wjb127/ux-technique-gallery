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
export function mount(root, variant, opts, T) { (V[variant] || V['pricing-tier-cards'])(root, T); }
