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

export function mount(root, variant, opts, T) { (V[variant] || V['pricing-tier-cards'])(root, T); }
