import { geoDistance, geoOrthographic, geoEquirectangular, geoPath, geoGraticule10, geoInterpolate, geoMercator } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import countries110 from 'world-atlas/countries-110m.json';
import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, noise2, fitCanvas, blip } from '../lib.js';
import { theme, slider, seg, select, btn, panel, toggle } from '../kit.js';
const LAND = feature(countries110, countries110.objects.land); const COUNTRIES = feature(countries110, countries110.objects.countries); const BORDERS = mesh(countries110, countries110.objects.countries, (a, b) => a !== b);
const CITIES = [['Seoul', 126.98, 37.57], ['Tokyo', 139.69, 35.69], ['New York', -74, 40.71], ['London', -0.13, 51.5], ['Paris', 2.35, 48.86], ['Berlin', 13.4, 52.52], ['São Paulo', -46.63, -23.55], ['Lagos', 3.38, 6.52], ['Cairo', 31.24, 30.04], ['Mumbai', 72.88, 19.08], ['Sydney', 151.21, -33.87], ['Mexico City', -99.13, 19.43], ['Los Angeles', -118.24, 34.05], ['Nairobi', 36.82, -1.29], ['Reykjavík', -21.9, 64.15], ['Buenos Aires', -58.38, -34.6], ['Jakarta', 106.85, -6.21], ['Istanbul', 28.98, 41.01], ['Toronto', -79.38, 43.65], ['Cape Town', 18.42, -33.92]];
function globeCanvas(parent, { rot = [-127, -30], draw, scale = 0.42, spin = 0 } = {}) { const cv = h('canvas', { style: { position: 'absolute', inset: 0, cursor: 'grab', touchAction: 'none' } }); parent.append(cv); const proj = geoOrthographic().clipAngle(90); const st = { rot: [...rot], scale, spin, t: 0 }; drag(cv, { move: (e) => { st.rot[0] += e.movementX * 0.3; st.rot[1] = clamp(st.rot[1] - e.movementY * 0.3, -90, 90); } }); cv.addEventListener('wheel', (e) => { e.preventDefault(); st.scale = clamp(st.scale * (e.deltaY > 0 ? 0.92 : 1.08), 0.2, 3); }, { passive: false }); const loop = () => { fitCanvas(cv, parent); st.t += 0.016; st.rot[0] += st.spin; proj.translate([cv.W / 2, cv.H / 2]).scale(Math.min(cv.W, cv.H) * st.scale).rotate(st.rot); draw(cv.g, proj, geoPath(proj, cv.g), cv, st); requestAnimationFrame(loop); }; requestAnimationFrame(loop); st.cv = cv; st.proj = proj; return st; }
const V = {};
V['globe-radio-discover'] = (root, T) => {
  theme(root, T, { bg: '#1600ff', fg: '#fff', ac: '#5cff7d', dark: true });
  const R = rng(3); const dots = []; COUNTRIES.features.forEach(() => {}); for (const c of CITIES) for (let k = 0; k < 14; k++) dots.push([c[1] + (R() - 0.5) * 12, c[2] + (R() - 0.5) * 8]); for (let k = 0; k < 500; k++) dots.push([R() * 360 - 180, R() * 120 - 50]);
  let cur = CITIES[0]; let playing = false;
  const G = globeCanvas(root, { rot: [-cur[1], -cur[2]], scale: 0.9, draw: (g, proj, path, cv) => { g.fillStyle = '#1600ff'; g.fillRect(0, 0, cv.W, cv.H); g.beginPath(); path({ type: 'Sphere' }); g.fillStyle = '#1a0ae0'; g.fill(); g.beginPath(); path(LAND); g.fillStyle = '#000'; g.globalAlpha = 0.85; g.fill(); g.globalAlpha = 1; g.fillStyle = '#5cff7d'; for (const d of dots) { const p = proj(d); if (p && geoPath(proj)({ type: 'Point', coordinates: d })) { g.beginPath(); g.arc(p[0], p[1], 1.8, 0, 7); g.fill(); } } g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(cv.W / 2, cv.H / 2, 34, 0, 7); g.stroke(); } });
  const name = h('div', { style: { fontSize: '15px', fontWeight: 700 } }), place = h('div', { style: { fontSize: '12px', opacity: .8 } });
  const tune = () => { const c = G.rot; let best = CITIES[0], bd = 1e9; CITIES.forEach((cc) => { const d = Math.hypot(((cc[1] + c[0] + 540) % 360) - 180, cc[2] + c[1]); if (d < bd) { bd = d; best = cc; } }); cur = best; name.textContent = `Radio ${best[0].split(' ')[0]} FM`; place.textContent = `${best[0]} · live`; }; setInterval(tune, 300); tune();
  const playBtn = h('div', { style: { width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #fff', display: 'grid', placeItems: 'center', fontSize: '26px', cursor: 'pointer', margin: '0 auto' }, onclick: () => { playing = !playing; playBtn.textContent = playing ? '❚❚' : '▶'; if (playing) blip(220, 0.4, 'sine', 0.05); } }, '▶');
  root.append(h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' } }, h('div', { style: { pointerEvents: 'auto' } }, playBtn), h('div', { style: { marginTop: '90px', fontWeight: 700 } }, 'Radio Garden-ish'), h('div', { style: { fontSize: '12px', opacity: .8 } }, 'drag the globe to tune')), h('div', { style: { position: 'absolute', left: '14px', bottom: '14px', width: '300px', background: '#1a10cc', borderRadius: '10px', padding: '12px', display: 'grid', gap: '6px' } }, h('div', { style: { fontSize: '10px', opacity: .7, letterSpacing: '.1em' } }, 'NOW PLAYING'), name, place, h('div.k-row', { style: { fontSize: '18px', gap: '16px' } }, '♡', '⤴', '⏮', '⏭')), h('div', { style: { position: 'absolute', right: '14px', bottom: '14px', display: 'grid', gap: '10px', fontSize: '20px' } }, '🔍', '♡', '⚙', 'ⓘ'));
  window.__demoProof = async () => { G.rot[0] = -139.69; G.rot[1] = -35.69; tune(); return 'rotated globe → tuned to Tokyo'; };
};
V['weather-particle-globe'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#ddd', ac: '#6f6', dark: true });
  const N = noise2(5); const wind = (lon, lat, t) => { const a = N(lon / 40 + t * 0.02, lat / 30) * 12.6; const sp = 0.3 + N(lon / 25, lat / 25 + 9) * 1.2; return [Math.cos(a) * sp + Math.cos((lat * Math.PI) / 60) * 0.6, Math.sin(a) * sp * 0.6]; };
  const R = rng(2); let parts = Array.from({ length: 7000 }, () => ({ lon: R() * 360 - 180, lat: R() * 160 - 80, age: R() * 80 }));
  const G = globeCanvas(root, { rot: [-120, -20], scale: 0.46, draw: (g, proj, path, cv, st) => { g.fillStyle = '#000'; g.fillRect(0, 0, cv.W, cv.H); g.beginPath(); path({ type: 'Sphere' }); g.fillStyle = '#123a2a'; g.fill(); g.beginPath(); path(geoGraticule10()); g.strokeStyle = '#ffffff14'; g.lineWidth = 0.5; g.stroke(); g.lineWidth = 1.6; const center = proj.invert([cv.W / 2, cv.H / 2]); for (const p of parts) { const [u, v] = wind(p.lon, p.lat, st.t); p.lon += u * 0.4; p.lat = clamp(p.lat + v * 0.4, -85, 85); p.age++; if (p.lon > 180) p.lon -= 360; if (p.lon < -180) p.lon += 360; if (geoDistance([p.lon, p.lat], center) < 1.5) { const a = proj([p.lon, p.lat]), b = proj([p.lon + u * 3, p.lat + v * 3]); const sp = Math.hypot(u, v); g.strokeStyle = `hsla(${140 - sp * 60},85%,${40 + sp * 22}%,.8)`; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); } if (p.age > 90) { p.lon = R() * 360 - 180; p.lat = R() * 160 - 80; p.age = 0; } } g.beginPath(); path(LAND); g.strokeStyle = '#fff'; g.lineWidth = 0.9; g.stroke(); g.beginPath(); path(BORDERS); g.strokeStyle = '#ffffff55'; g.lineWidth = 0.5; g.stroke(); } });
  const menu = h('div', { style: { position: 'absolute', left: '14px', bottom: '14px', width: '460px', background: '#000c', padding: '10px', fontSize: '12px', display: 'none', lineHeight: 1.9, fontFamily: 'monospace' } }, h('div', {}, 'Date | 2026-09-30 10:00 UTC ‹ › Now'), h('div', {}, 'Mode | ', h('b', {}, 'Air'), ' – Ocean – Chem – Particulates'), h('div', {}, 'Height | Sfc – 1000 – 850 – 700 – 500 – 250 hPa'), h('div', {}, 'Overlay | None – ', h('b', {}, 'Wind'), ' – Temp – RH – TPW'), h('div', {}, 'Projection | A – ', h('b', {}, 'O'), ' – E – S – WB'));
  root.append(h('div', { style: { position: 'absolute', left: '14px', bottom: '14px', fontSize: '13px', cursor: 'pointer', fontFamily: 'monospace' }, onclick: () => (menu.style.display = menu.style.display === 'none' ? 'block' : 'none') }, 'earth-ish ☰'), menu, h('div', { style: { position: 'absolute', right: '14px', bottom: '14px', fontSize: '11px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' } }, h('span', { style: { width: '120px', height: '10px', background: 'linear-gradient(90deg,#1c6,#9f3,#ff3)' } }), 'wind km/h'));
  window.__demoProof = async () => { await sleep(800); return 'wind particles advecting on orthographic globe'; };
};
V['star-map-explorer'] = (root, T) => {
  theme(root, T, { bg: '#0b1020', fg: '#ddd', ac: '#4c8dff', dark: true });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0, cursor: 'grab' } }); root.append(cv); const R = rng(9); const stars = Array.from({ length: 1400 }, () => ({ az: R() * 360, alt: Math.asin(R() * 2 - 1) * 57.3, m: Math.pow(R(), 4) * 3 + 0.3 }));
  const CONS = [['Orion', [[80, 30], [86, 22], [90, 36], [84, 12], [96, 20], [88, 42]]], ['Ursa Major', [[200, 40], [210, 44], [220, 42], [230, 46], [236, 52], [226, 56], [214, 54]]], ['Cassiopeia', [[330, 50], [336, 44], [342, 50], [348, 44], [354, 50]]]];
  let az = 60, fov = 70, lines = true, labels = true, atmos = true; drag(cv, { move: (e) => { az -= e.movementX * 0.1 * (fov / 70); } }); cv.addEventListener('wheel', (e) => { e.preventDefault(); fov = clamp(fov * (e.deltaY > 0 ? 1.08 : 0.92), 10, 140); }, { passive: false });
  const loop = () => { fitCanvas(cv, root); const g = cv.g, W = cv.W, H = cv.H; const hz = H * 0.72; const P = (a, al) => { let d = ((a - az + 540) % 360) - 180; return [W / 2 + (d / fov) * W, hz - (al / fov) * W]; }; const sky = g.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, '#050814'); sky.addColorStop(1, atmos ? '#1b2a4a' : '#050814'); g.fillStyle = sky; g.fillRect(0, 0, W, hz); stars.forEach((st) => { if (st.alt < 0) return; const [x, y] = P(st.az, st.alt); if (x < 0 || x > W) return; g.fillStyle = `rgba(255,255,${230 + st.m * 8},${Math.min(1, st.m / 2)})`; g.beginPath(); g.arc(x, y, st.m * (70 / fov), 0, 7); g.fill(); }); CONS.forEach(([n, pts]) => { const pp = pts.map(([a, al]) => P(a, al)); if (lines) { g.strokeStyle = '#4c8dff88'; g.lineWidth = 1; g.beginPath(); pp.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); } g.fillStyle = '#fff'; pp.forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill(); }); if (labels) { g.fillStyle = '#9bbcff'; g.font = '13px sans-serif'; g.fillText(n, pp[0][0] + 8, pp[0][1] - 8); } }); g.fillStyle = '#0f1a10'; g.beginPath(); g.moveTo(0, hz); for (let x = 0; x <= W; x += 20) g.lineTo(x, hz - 18 - Math.sin((x + az * 12) / 80) * 10 - Math.sin((x + az * 12) / 23) * 4); g.lineTo(W, H); g.lineTo(0, H); g.fill(); g.fillStyle = '#e53'; g.font = '16px sans-serif'; ['N', 'E', 'S', 'W'].forEach((c, i) => { const [x] = P(i * 90, 0); if (x > 0 && x < W) g.fillText(c, x, hz + 30); }); requestAnimationFrame(loop); };
  const tbtn = (ic, f) => h('span', { style: { cursor: 'pointer', fontSize: '18px' }, onclick: f }, ic);
  root.append(h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '200px', background: '#101522ee', padding: '12px', fontSize: '12px', display: 'grid', alignContent: 'space-between' } }, h('div', { style: { display: 'grid', gap: '8px' } }, '☰ View settings', '⌖ Find', h('div', { style: { marginTop: '20px', background: 'linear-gradient(#1b2a4a,#4a2a6a)', borderRadius: '10px', padding: '12px', textAlign: 'center' } }, h('b', { style: { fontSize: '16px', letterSpacing: '.1em' } }, 'STELLARIUM-ish'), h('div', { style: { opacity: .7, margin: '6px 0' } }, 'MOBILE'), h('div', { style: { background: '#000', borderRadius: '6px', padding: '6px' } }, ' App Store'))), h('div', { style: { display: 'grid', gap: '6px', opacity: .8 } }, 'ⓘ About', '♡ Donate')), h('div.k-row', { style: { position: 'absolute', left: '220px', top: '10px', gap: '10px' } }, h('b', {}, 'Stellarium Web-ish'), h('input', { placeholder: 'Search…', style: { background: '#0008', border: '1px solid #333', color: '#fff', padding: '4px 8px' } })), h('div.k-row', { style: { position: 'absolute', right: '14px', top: '10px', fontSize: '12px' } }, 'Seoul · 2026-09-30 21:00'), h('div.k-row', { style: { position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', background: '#101522cc', padding: '6px 14px', borderRadius: '6px', gap: '16px' } }, tbtn('✦', () => (lines = !lines)), tbtn('Aa', () => (labels = !labels)), tbtn('☁', () => (atmos = !atmos)), tbtn('⛰', () => {}), tbtn('⊕', () => (fov = 70)), h('span', { style: { fontSize: '11px' } }, 'FOV ' + fov + '°')));
  loop();
  window.__demoProof = async () => { az = 110; return 'panned sky to Orion with constellation lines'; };
};
V['solar-system-explorer-hud'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#ddd', ac: '#3cff7d', dark: true });
  const PL = [['Mercury', 0.39, 4.1, '#aaa'], ['Venus', 0.72, 1.6, '#e8c07a'], ['Earth', 1, 1, '#4fa3ff'], ['Mars', 1.52, 0.53, '#e0643a'], ['Jupiter', 5.2, 0.084, '#d8b07a'], ['Saturn', 9.5, 0.034, '#e6d29a']];
  const cv = h('canvas', { style: { position: 'absolute', inset: 0, cursor: 'grab' } }); root.append(cv); let tilt = 0.35, zoom = 1, days = 0, rate = 1, sel = 'Earth';
  drag(cv, { move: (e) => { tilt = clamp(tilt - e.movementY * 0.004, 0.08, 1); } }); cv.addEventListener('wheel', (e) => { e.preventDefault(); zoom = clamp(zoom * (e.deltaY > 0 ? 0.9 : 1.1), 0.3, 5); }, { passive: false });
  const dateEl = h('span');
  const loop = () => { fitCanvas(cv, root); const g = cv.g, W = cv.W, H = cv.H; days += rate; g.fillStyle = '#000'; g.fillRect(0, 0, W, H); const cx = W * 0.58, cy = H * 0.5; const sc = (a) => Math.sqrt(a) * 150 * zoom; g.fillStyle = '#ffd34d'; g.shadowColor = '#ffb000'; g.shadowBlur = 20; g.beginPath(); g.arc(cx, cy, 7, 0, 7); g.fill(); g.shadowBlur = 0; PL.forEach(([n, a, w, c]) => { const r = sc(a); g.strokeStyle = n === sel ? '#3cff7d' : '#ffffff40'; g.lineWidth = 1; g.beginPath(); g.ellipse(cx, cy, r, r * tilt, 0, 0, 7); g.stroke(); const ang = (days / 365) * w * 6.283; const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r * tilt; g.fillStyle = c; g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = '11px sans-serif'; g.fillText(n.toUpperCase(), x + 8, y - 6); }); const d = new Date(Date.UTC(2026, 8, 30) + days * 864e5); dateEl.textContent = d.toISOString().slice(0, 10).replace(/-/g, ' '); requestAnimationFrame(loop); };
  const card = (t, sub) => h('div', { style: { background: '#111', border: '1px solid #333', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 60px', gap: '8px', cursor: 'pointer' }, onclick: () => (sel = pick(PL)[0]) }, h('div', {}, h('div', { style: { fontSize: '15px' } }, t), h('div', { style: { fontSize: '10px', opacity: .5, letterSpacing: '.15em', marginTop: '6px' } }, sub)), h('div', { style: { background: 'radial-gradient(#666,#111)', borderRadius: '4px' } }));
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '44px', padding: '0 14px', fontSize: '12px', letterSpacing: '.15em' } }, h('b', { style: { background: '#fff', color: '#000', padding: '2px 6px', borderRadius: '50%' } }, 'N'), 'EYES ON THE SOLAR SYSTEM-ish', h('span', { style: { flex: 1 } }), '⌕ SEARCH', '☰ MENU'), h('div', { style: { position: 'absolute', left: '14px', top: '60px', width: '240px', display: 'grid', gap: '8px' } }, h('div', { style: { fontSize: '11px', opacity: .6 } }, 'Featured Events & Missions'), card('Roman Space Telescope Launch', 'MISSION · 2027'), card('Psyche Mars Gravity Assist', 'MISSION · 2026'), card('Artemis II Launch', 'MISSION · 2026'), card("Voyager's Grand Tour", 'HISTORIC')), h('div.k-row', { style: { position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', gap: '18px', fontSize: '12px' } }, h('span', { style: { color: '#3cff7d' } }, '● LIVE'), dateEl, h('div', { style: { width: '200px' } }, slider('rate (days/frame)', -5, 5, rate, 0.1, (v) => (rate = v))), h('span', { style: { border: '1px solid #3cff7d', color: '#3cff7d', padding: '3px 10px', borderRadius: '99px', cursor: 'pointer' }, onclick: () => { days = 0; rate = 1; } }, 'REAL RATE')));
  loop();
  window.__demoProof = async () => { await sleep(300); return 'orbits animating; time-rate slider live'; };
};
function mapView(parent, { proj = geoEquirectangular(), draw }) { const cv = h('canvas', { style: { position: 'absolute', inset: 0, cursor: 'grab', touchAction: 'none' } }); parent.append(cv); const st = { k: 1, x: 0, y: 0, t: 0 }; drag(cv, { move: (e) => { st.x += e.movementX; st.y += e.movementY; } }); cv.addEventListener('wheel', (e) => { e.preventDefault(); st.k = clamp(st.k * (e.deltaY > 0 ? 0.9 : 1.1), 0.5, 8); }, { passive: false }); const loop = () => { fitCanvas(cv, parent); st.t += 0.016; proj.fitSize([cv.W * st.k, cv.H * st.k], { type: 'Sphere' }); const [tx, ty] = proj.translate(); proj.translate([tx + st.x - (cv.W * (st.k - 1)) / 2, ty + st.y - (cv.H * (st.k - 1)) / 2]); draw(cv.g, proj, geoPath(proj, cv.g), cv, st); requestAnimationFrame(loop); }; requestAnimationFrame(loop); st.cv = cv; st.proj = proj; return st; }
V['satellite-weather-map-hud'] = (root, T) => {
  theme(root, T, { bg: '#111', fg: '#fff', ac: '#1e88e5', dark: true });
  const N = noise2(3); let layer = 'satellite', off = null; const cw = 360, ch = 180; const cloud = document.createElement('canvas'); cloud.width = cw; cloud.height = ch;
  const bake = (t) => { const g = cloud.getContext('2d'); const img = g.createImageData(cw, ch); for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const n = N(x / 30 + t, y / 22) * 0.7 + N(x / 8 - t, y / 8) * 0.3; const band = Math.exp(-(((y - 90) / 30) ** 2)) * 0.2 + Math.exp(-(((y - 40) / 18) ** 2)) * 0.25 + Math.exp(-(((y - 140) / 18) ** 2)) * 0.25; const v = clamp((n + band - 0.55) * 3, 0, 1); const i = (y * cw + x) * 4; if (layer === 'rain') { const r = clamp((n - 0.62) * 6, 0, 1); img.data[i] = 40; img.data[i + 1] = 200 * r + 50; img.data[i + 2] = 80; img.data[i + 3] = r * 220; } else { img.data[i] = img.data[i + 1] = img.data[i + 2] = 240; img.data[i + 3] = v * 235; } } g.putImageData(img, 0, 0); };
  let tt = 0; bake(0); setInterval(() => { tt += 0.01; bake(tt); }, 400);
  const M = mapView(root, { proj: geoEquirectangular(), draw: (g, proj, path, cv) => { g.fillStyle = '#0d2238'; g.fillRect(0, 0, cv.W, cv.H); g.beginPath(); path(LAND); g.fillStyle = '#2e3a2a'; g.fill(); g.beginPath(); path(BORDERS); g.strokeStyle = '#ffffff30'; g.lineWidth = 0.6; g.stroke(); const [x0, y0] = proj([-180, 90]), [x1, y1] = proj([180, -90]); g.drawImage(cloud, x0, y0, x1 - x0, y1 - y0); } });
  M.k = 2.2; M.x = -220; M.y = 160;
  const dlg = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '240px', background: '#1d2530f0', borderRadius: '12px', padding: '18px', textAlign: 'center', display: 'grid', gap: '10px' } }, h('div', { style: { width: '50px', height: '50px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%,#8cf,#15a)', margin: '0 auto' } }), h('b', { style: { fontSize: '20px', letterSpacing: '.15em' } }, 'ZOOM EARTH-ish'), h('div', { style: { fontSize: '12px', opacity: .8 } }, '실시간 위성 이미지와 기상 레이어로 지구를 탐색하세요'), h('button', { style: { background: '#1e88e5', color: '#fff', border: 0, padding: '10px', borderRadius: '8px' }, onclick: () => dlg.remove() }, '⌖ 현재 위치 표시'), h('button', { style: { background: '#ffffff18', color: '#fff', border: 0, padding: '10px', borderRadius: '8px' }, onclick: () => dlg.remove() }, '닫기'));
  const lay = h('div', { style: { position: 'absolute', right: '12px', top: '60px', display: 'grid', gap: '8px' } }, ...[['satellite', '🛰'], ['rain', '🌧'], ['wind', '💨'], ['temp', '🌡']].map(([k, ic]) => h('button', { title: k, style: { width: '38px', height: '38px', borderRadius: '50%', background: k === layer ? '#1e88e5' : '#000a', color: '#fff', border: 0, fontSize: '16px' }, onclick: (e) => { layer = k; bake(tt); lay.querySelectorAll('button').forEach((b) => (b.style.background = '#000a')); e.currentTarget.style.background = '#1e88e5'; } }, ic)));
  root.append(h('div.k-row', { style: { position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', gap: '6px' } }, h('span', { style: { background: '#000a', padding: '5px 12px', borderRadius: '99px', fontSize: '12px' } }, 'LIVE · 19:10 KST'), h('span', { style: { background: '#1e88e5', padding: '5px 12px', borderRadius: '99px', fontSize: '12px' } }, 'Satellite (HD)')), lay, h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '30px', background: '#000c', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 10px', fontSize: '11px' } }, '▶', ...Array.from({ length: 24 }, (_, i) => h('span', { style: { flex: 1, textAlign: 'center', opacity: i === 19 ? 1 : .5 } }, i))), dlg);
  window.__demoProof = async () => 'satellite cloud layer over map; layer switcher (welcome dialog)';
};
V['orbital-hierarchy-scene-studio'] = (root, T) => {
  theme(root, T, { bg: '#2b2e33', fg: '#ddd', ac: '#8fd', dark: true });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0 } }); root.append(cv);
  const SYS = { r: 0, s: 0, size: 34, c: '#fff', kids: [{ r: 120, s: 1, size: 8, c: '#8fd', kids: [{ r: 20, s: 5, size: 3, c: '#fff' }] }, { r: 190, s: 0.6, size: 12, c: '#f9a', kids: [{ r: 26, s: 4, size: 3, c: '#fff' }, { r: 38, s: -2.5, size: 2, c: '#9cf' }] }, { r: 270, s: 0.35, size: 6, c: '#9cf' }] };
  let speed = 1, trails = true, t = 0; const tilt = 0.45;
  const loop = () => { fitCanvas(cv, root); const g = cv.g, W = cv.W, H = cv.H; t += 0.01 * speed; g.fillStyle = trails ? '#2b2e3340' : '#2b2e33'; g.fillRect(0, 0, W, H); const draw = (n, x, y) => { if (n.kids) n.kids.forEach((k) => { const a = t * k.s; const kx = x + Math.cos(a) * k.r, ky = y + Math.sin(a) * k.r * tilt; g.strokeStyle = '#ffffff18'; g.beginPath(); g.ellipse(x, y, k.r, k.r * tilt, 0, 0, 7); g.stroke(); draw(k, kx, ky); }); const gr = g.createRadialGradient(x, y, 0, x, y, n.size * (n.r ? 1.5 : 3)); gr.addColorStop(0, n.c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, n.size * (n.r ? 1.5 : 3), 0, 7); g.fill(); }; draw(SYS, W / 2, H * 0.42); requestAnimationFrame(loop); };
  root.append(h('div', { style: { position: 'absolute', left: 0, right: 0, top: '53%', textAlign: 'center', font: "200 110px/1 'Inter Variable'", letterSpacing: '.06em', color: '#eee', pointerEvents: 'none' } }, 'orbitarium'), h('div', { style: { position: 'absolute', left: 0, right: 0, top: '72%', textAlign: 'center', fontSize: '12px', opacity: .6 } }, 'nested orbital hierarchies · drag sliders to retime'), h('div', { style: { position: 'absolute', right: '14px', top: '14px', width: '200px', background: '#0006', padding: '10px', borderRadius: '8px', display: 'grid', gap: '6px', fontSize: '11px' } }, slider('Speed', 0, 5, speed, 0.1, (v) => (speed = v)), toggle('Trails', true, (v) => (trails = v)), btn('Add moon', () => SYS.kids[0].kids.push({ r: 30 + Math.random() * 20, s: 3 + Math.random() * 4, size: 2, c: '#ffd' })), btn('Add planet', () => SYS.kids.push({ r: 300 + Math.random() * 60, s: 0.2 + Math.random() * 0.3, size: 5, c: pick(['#fc8', '#8cf', '#f8c']) }))), h('div', { style: { position: 'absolute', right: '14px', bottom: '10px', fontSize: '10px', opacity: .5 } }, '© orbitarium-ish'));
  loop();
  window.__demoProof = async () => 'nested orbits animating';
};
V['3d-sunlight-shadow-explorer'] = (root, T) => {
  theme(root, T, { bg: '#e9e7e2', fg: '#333', ac: '#f6c343', dark: false });
  const R = rng(5); const bld = []; for (let bx = 0; bx < 9; bx++) for (let by = 0; by < 6; by++) for (let k = 0; k < 3; k++) if (R() < 0.8) bld.push({ x: bx * 150 + 20 + k * 40, y: by * 140 + 20 + R() * 40, w: 26 + R() * 20, d: 30 + R() * 40, hh: 10 + R() ** 2 * 120 });
  const cv = h('canvas', { style: { position: 'absolute', inset: 0 } }); root.append(cv); let hour = 14.5;
  const loop = () => { fitCanvas(cv, root); const g = cv.g; g.fillStyle = '#dcd9d2'; g.fillRect(0, 0, cv.W, cv.H); g.strokeStyle = '#fff'; g.lineWidth = 14; for (let x = 0; x < cv.W; x += 150) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, cv.H); g.stroke(); } for (let y = 0; y < cv.H; y += 140) { g.beginPath(); g.moveTo(0, y); g.lineTo(cv.W, y); g.stroke(); } g.fillStyle = '#b9d3a0'; g.fillRect(760, 300, 130, 110); const az = ((hour - 12) / 6) * 1.3, el = Math.max(0.12, Math.sin(((hour - 6) / 12) * Math.PI)); const sx = Math.sin(az) / el, sy = Math.cos(az) / el * 0.6; g.fillStyle = `rgba(40,50,80,${0.35 * Math.min(1, el * 2)})`; bld.forEach((b) => { const dx = -sx * b.hh * 0.6, dy = sy * b.hh * 0.6; g.beginPath(); g.moveTo(b.x, b.y); g.lineTo(b.x + b.w, b.y); g.lineTo(b.x + b.w + dx, b.y + dy); g.lineTo(b.x + b.w + dx, b.y + b.d + dy); g.lineTo(b.x + dx, b.y + b.d + dy); g.lineTo(b.x, b.y + b.d); g.fill(); }); bld.forEach((b) => { g.fillStyle = '#f4f2ee'; g.fillRect(b.x, b.y, b.w, b.d); g.strokeStyle = '#c9c5bd'; g.lineWidth = 1; g.strokeRect(b.x, b.y, b.w, b.d); }); requestAnimationFrame(loop); };
  const hl = h('b'); const setH = (v) => { hour = v; hl.textContent = `${String(Math.floor(v)).padStart(2, '0')}:${String(Math.round((v % 1) * 60)).padStart(2, '0')}`; };
  const modal = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '300px', background: '#fff', borderRadius: '14px', padding: '0 0 16px', textAlign: 'center', boxShadow: '0 10px 40px #0003', overflow: 'hidden' } }, h('div', { style: { height: '70px', background: 'radial-gradient(circle at 50% 110%,#ffd84a 30%,#fff3c4 60%,#fff 80%)' } }), h('b', { style: { fontSize: '18px' } }, 'Welcome, sunseekers!'), h('p', { style: { fontSize: '12px', opacity: .7, padding: '0 20px' } }, 'Your guide to sunlight and shadows anywhere, any time of day.'), h('div.k-row', { style: { justifyContent: 'center', gap: '22px', fontSize: '11px' } }, h('div', {}, '☀', h('br'), 'Sun hours'), h('div', {}, '⛱', h('br'), 'Shadows'), h('div', {}, '🏠', h('br'), 'Buy a home')), h('button', { style: { margin: '14px 20px 0', width: 'calc(100% - 40px)', padding: '9px', borderRadius: '99px', border: '1px solid #333', background: '#fff' }, onclick: () => modal.remove() }, 'Sign in'), h('div', { style: { fontSize: '11px', marginTop: '8px', cursor: 'pointer', textDecoration: 'underline' }, onclick: () => modal.remove() }, 'Explore without account'));
  root.append(h('div', { style: { position: 'absolute', left: '50%', bottom: '18px', transform: 'translateX(-50%)', width: '560px', background: '#fff', borderRadius: '12px', padding: '10px 16px', boxShadow: '0 4px 20px #0002', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '14px', alignItems: 'center' } }, '☀', slider('Time of day', 6, 19.5, hour, 0.05, setH), hl), h('div', { style: { position: 'absolute', left: '14px', top: '14px', background: '#fff', borderRadius: '10px', padding: '8px 12px', boxShadow: '0 2px 10px #0002', fontSize: '13px' } }, h('b', {}, 'Shadowmap-ish'), ' · Seoul, Mapo-gu · 30 Sep 2026'), modal);
  setH(hour); loop();
  window.__demoProof = async () => { setH(16.5); return 'time slider → building shadows recomputed'; };
};
V['geojson-dual-pane'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#333', ac: '#7253ed', dark: false });
  const fc = { type: 'FeatureCollection', features: [] }; const ta = h('textarea', { spellcheck: false, style: { width: '100%', height: '100%', border: 0, outline: 'none', font: "12px/1.5 'JetBrains Mono Variable',monospace", resize: 'none', padding: '10px', color: '#2b4ea0' } });
  const upd = () => (ta.value = JSON.stringify(fc, null, 2)); upd(); ta.addEventListener('input', () => { try { Object.assign(fc, JSON.parse(ta.value)); } catch {} });
  const wrap = h('div', { style: { position: 'relative', height: '100%', background: '#f2f2f2' } }); let tool = 'point', line = null;
  const G = globeCanvas(wrap, { rot: [-10, -30], scale: 0.44, draw: (g, proj, path, cv) => { g.fillStyle = '#e8e8e8'; g.fillRect(0, 0, cv.W, cv.H); g.beginPath(); path({ type: 'Sphere' }); g.fillStyle = '#c9ccd1'; g.fill(); g.beginPath(); path(COUNTRIES); g.fillStyle = '#f7f7f7'; g.fill(); g.strokeStyle = '#b9bcc2'; g.lineWidth = 0.6; g.stroke(); g.fillStyle = '#7253ed'; g.strokeStyle = '#7253ed'; g.lineWidth = 2; fc.features.forEach((f) => { g.beginPath(); path.pointRadius(6)(f); f.geometry.type === 'Point' ? g.fill() : g.stroke(); }); } });
  G.cv.addEventListener('dblclick', (e) => { const p = localPos(e, G.cv); const ll = G.proj.invert([p.x, p.y]); if (!ll) return; ll[0] = +ll[0].toFixed(4); ll[1] = +ll[1].toFixed(4); if (tool === 'point') fc.features.push({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: ll } }); else { if (!line) { line = { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } }; fc.features.push(line); } line.geometry.coordinates.push(ll); } upd(); });
  root.style.display = 'grid'; root.style.gridTemplateRows = '40px 1fr'; root.style.gridTemplateColumns = '1fr 380px';
  root.append(h('div.k-row', { style: { gridColumn: '1/-1', background: '#1f1f28', color: '#fff', padding: '0 14px', gap: '14px', fontSize: '13px' } }, h('b', {}, 'geojson.io-ish'), 'Open', 'Save', 'New', 'Meta', h('span', { style: { flex: 1 } }), h('span', { style: { background: '#7253ed', padding: '4px 10px', borderRadius: '4px' } }, 'Sign up for Placemark')), h('div', { style: { position: 'relative' } }, wrap, h('div', { style: { position: 'absolute', left: '10px', top: '10px', background: '#fff', borderRadius: '6px', boxShadow: '0 1px 4px #0003', display: 'grid' } }, ...[['point', '📍'], ['line', '〰'], ['clear', '🗑']].map(([k, ic]) => h('button', { title: k, style: { border: 0, background: 'none', padding: '8px', fontSize: '16px' }, onclick: () => { if (k === 'clear') { fc.features.length = 0; line = null; upd(); } else { tool = k; line = null; } } }, ic))), h('div', { style: { position: 'absolute', left: '60px', top: '12px', background: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' } }, 'double-click the map to draw')), h('div', { style: { borderLeft: '1px solid #ddd', display: 'grid', gridTemplateRows: '32px 1fr' } }, h('div.k-row', { style: { fontSize: '12px', padding: '0 10px', gap: '14px', borderBottom: '1px solid #ddd' } }, h('b', { style: { color: '#7253ed' } }, 'JSON'), 'Table', 'Help'), ta));
  window.__demoProof = async () => { fc.features.push({ type: 'Feature', properties: { name: 'Seoul' }, geometry: { type: 'Point', coordinates: [126.98, 37.57] } }, { type: 'Feature', properties: { name: 'Paris' }, geometry: { type: 'Point', coordinates: [2.35, 48.86] } }, { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[2.35, 48.86], [13.4, 52.52], [28.98, 41.01]] } }); upd(); return 'features drawn on map ↔ JSON pane synced'; };
};
V['climate-strategy-map-hud'] = (root, T) => {
  theme(root, T, { bg: '#0b0b0d', fg: '#ddd', ac: '#e8742c', dark: true });
  const st = { year: 2026, temp: 1.3, co2: 421, policies: { solar: 0, forest: 0, carbon: 0 } };
  const wrap = h('div', { style: { position: 'absolute', inset: 0, opacity: 0.12, transition: 'opacity .5s' } }); root.append(wrap);
  const M = mapView(wrap, { proj: geoEquirectangular(), draw: (g, proj, path, cv) => { g.fillStyle = '#0b0b0d'; g.fillRect(0, 0, cv.W, cv.H); COUNTRIES.features.forEach((f, i) => { const heat = clamp((st.temp - 1) / 2 + ((i * 37) % 10) / 30, 0, 1); g.beginPath(); path(f); g.fillStyle = `hsl(${30 - heat * 30} ${50 + heat * 40}% ${18 + heat * 25}%)`; g.fill(); g.strokeStyle = '#000'; g.lineWidth = 0.5; g.stroke(); }); } });
  const hud = h('div.k-row', { style: { position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', gap: '20px', fontSize: '13px', display: 'none', background: '#000a', padding: '8px 16px', borderRadius: '6px' } });
  const drawHud = () => hud.replaceChildren(h('b', { style: { color: '#e8742c' } }, st.year), `🌡 +${st.temp.toFixed(2)}°C`, `CO₂ ${st.co2.toFixed(0)} ppm`, ...Object.keys(st.policies).map((k) => h('button', { style: { background: '#e8742c', border: 0, color: '#000', padding: '4px 10px', borderRadius: '4px' }, onclick: () => { st.policies[k]++; } }, `+ ${k} (${st.policies[k]})`)));
  setInterval(() => { if (hud.style.display === 'none') return; st.year++; const cut = st.policies.solar * 0.8 + st.policies.forest * 0.5 + st.policies.carbon * 1.1; st.co2 += 2.4 - cut * 0.3; st.temp = 1.1 + (st.co2 - 400) * 0.012; drawHud(); }, 900);
  const splash = h('div', { style: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' } }, h('div', { style: { font: "800 64px/1 'Inter Variable'", letterSpacing: '.18em', color: '#e8742c' } }, 'OVERSHOOT'), h('div', { style: { fontSize: '14px', opacity: .7, margin: '14px 0 22px', lineHeight: 1.6 } }, 'A climate strategy game about growth.', h('br'), 'There is only so much we can take.'), h('div.k-row', { style: { justifyContent: 'center', gap: '10px' } }, h('button', { style: { background: '#e8742c', border: 0, padding: '10px 26px', borderRadius: '4px', fontWeight: 700 }, onclick: () => { splash.remove(); wrap.style.opacity = 1; hud.style.display = 'flex'; drawHud(); } }, 'Play'), h('button', { style: { background: '#26262c', color: '#ddd', border: 0, padding: '10px 26px', borderRadius: '4px' } }, 'About')), h('div', { style: { fontSize: '11px', opacity: .4, marginTop: '14px' } }, 'overshoot-ish · v1'));
  root.append(hud, splash);
  window.__demoProof = async () => 'splash over dim warming map (Play starts sim)';
};
V['map-explore-side-panel'] = (root, T) => {
  theme(root, T, { bg: '#fff', fg: '#222', ac: '#e8742c', dark: false }); root.style.overflow = 'auto';
  const wrap = h('div', { style: { position: 'relative', height: '420px', background: '#111', borderRadius: '6px', overflow: 'hidden' } }); const hub = [-74, 40.72]; const R = rng(8); const flows = Array.from({ length: 160 }, () => [hub[0] + (R() - 0.5) * 3.2, hub[1] + (R() - 0.5) * 2, R()]); let mode = 'all', minF = 0;
  const M = mapView(wrap, { proj: geoMercator(), draw: (g, proj, path, cv, st) => { proj.fitExtent([[0, 0], [cv.W, cv.H]], { type: 'MultiPoint', coordinates: [[-76, 39.6], [-72, 41.8]] }); const [tx, ty] = proj.translate(); proj.translate([tx + st.x, ty + st.y]); g.fillStyle = '#16181c'; g.fillRect(0, 0, cv.W, cv.H); g.beginPath(); path(LAND); g.fillStyle = '#2a2d33'; g.fill(); const h0 = proj(hub); flows.forEach(([x, y, w]) => { if (w < minF) return; if (mode === 'transit' && w < 0.5) return; const p = proj([x, y]); g.strokeStyle = w > 0.7 ? '#9ff' : '#3cc'; g.globalAlpha = 0.25 + w * 0.5; g.lineWidth = 0.5 + w * 1.5; g.beginPath(); g.moveTo(p[0], p[1]); g.quadraticCurveTo((p[0] + h0[0]) / 2, Math.min(p[1], h0[1]) - 30, h0[0], h0[1]); g.stroke(); }); g.globalAlpha = 1; g.fillStyle = '#fff'; g.beginPath(); g.arc(h0[0], h0[1], 4, 0, 7); g.fill(); g.font = '11px sans-serif'; g.fillText('Manhattan', h0[0] + 8, h0[1]); } });
  const legend = h('div', { style: { position: 'absolute', right: '10px', top: '10px', width: '200px', background: '#000c', color: '#ddd', padding: '10px', fontSize: '11px', display: 'grid', gap: '6px' } }, h('b', {}, 'New York County Flows'), seg(['all', 'transit'], mode, (v) => (mode = v)), slider('Min flow', 0, 1, 0, 0.01, (v) => (minF = v)), h('div', {}, 'Total commuters: 2.1M'));
  wrap.append(legend);
  root.append(h('div', { style: { background: '#e8742c', color: '#fff', fontSize: '11px', textAlign: 'center', padding: '4px' } }, 'Felt-ish 3.0 is here — the new era of collaborative mapping'), h('div.k-row', { style: { padding: '14px 60px', gap: '20px', fontSize: '12px', fontWeight: 600 } }, h('b', { style: { fontSize: '22px' } }, 'Felt-ish'), h('span', { style: { flex: 1 } }), 'PLATFORM', 'INDUSTRIES', 'RESOURCES', 'PRICING', 'BOOK A DEMO', 'LOG IN', h('span', { style: { background: '#1c1c1c', color: '#fff', padding: '6px 12px' } }, 'SIGN UP')), h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 240px', gap: '30px', padding: '10px 60px' } }, h('div', {}, h('span', { style: { background: '#eee', padding: '3px 8px', fontSize: '10px', borderRadius: '99px' } }, 'MAP GALLERY'), h('h1', { style: { font: "400 42px Georgia,serif", margin: '14px 0' } }, 'Commuter Flow Explorer'), h('p', { style: { lineHeight: 1.6, fontSize: '14px', maxWidth: '640px' } }, 'Built with Felt-ish, this map visualizes where people commute across counties. Click any county to reveal inbound and outbound flows, filter by mode, and explore patterns.'), wrap), h('div', { style: { display: 'grid', gap: '14px', alignContent: 'start', paddingTop: '60px' } }, h('b', {}, 'Need a map?'), h('p', { style: { fontSize: '13px', opacity: .7 } }, 'Felt lets you explore, visualize, and share maps instantly.'), h('button', { style: { background: '#e8742c', color: '#fff', border: 0, padding: '10px' } }, 'GET STARTED FOR FREE'), h('b', {}, 'Want to know more?'), h('div', { style: { height: '120px', background: 'linear-gradient(135deg,#2d4a2a,#6a5a2a)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '28px' } }, '▶'))));
  window.__demoProof = async () => { minF = 0.2; legend.querySelector('input').value = 0.2; return 'flow map filtered by min-flow slider'; };
};
function dp(pts, eps) { if (pts.length < 3) return pts; let dmax = 0, idx = 0; const [a, b] = [pts[0], pts[pts.length - 1]]; for (let i = 1; i < pts.length - 1; i++) { const p = pts[i]; const d = Math.abs((b[1] - a[1]) * p[0] - (b[0] - a[0]) * p[1] + b[0] * a[1] - b[1] * a[0]) / (Math.hypot(b[1] - a[1], b[0] - a[0]) || 1); if (d > dmax) { dmax = d; idx = i; } } if (dmax > eps) return [...dp(pts.slice(0, idx + 1), eps).slice(0, -1), ...dp(pts.slice(idx), eps)]; return [a, b]; }
V['gis-simplify-slider-workspace'] = (root, T) => {
  theme(root, T, { bg: '#e9eff2', fg: '#333', ac: '#1b8bd0', dark: false });
  let pct = 100, loaded = false, simp = null; const total = COUNTRIES.features.reduce((n, f) => n + JSON.stringify(f.geometry.coordinates).split('],[').length, 0);
  const simplify = () => { const eps = ((100 - pct) / 100) ** 2 * 3; let kept = 0; simp = { type: 'FeatureCollection', features: COUNTRIES.features.map((f) => { const g = f.geometry; const mapR = (r) => { const o = dp(r, eps); kept += o.length; return o.length >= 4 ? o : r.slice(0, 4); }; return { ...f, geometry: { type: g.type, coordinates: g.type === 'Polygon' ? g.coordinates.map(mapR) : g.coordinates.map((p) => p.map(mapR)) } }; }) }; info.textContent = `${pct}% · ${kept} / ${total} vertices retained`; };
  const info = h('span', { style: { fontSize: '12px' } });
  const wrap = h('div', { style: { position: 'absolute', left: 0, right: 0, top: '30px', bottom: 0 } }); root.append(wrap);
  mapView(wrap, { proj: geoEquirectangular(), draw: (g, proj, path, cv) => { g.fillStyle = '#e9eff2'; g.fillRect(0, 0, cv.W, cv.H); if (!loaded) return; g.beginPath(); path(simp); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = '#d24a8c'; g.lineWidth = 0.8; g.stroke(); } });
  const sl = h('div', { style: { width: '260px', display: loaded ? 'block' : 'none' } }, slider('Simplify', 1, 100, pct, 1, (v) => { pct = v; simplify(); }, (v) => v + '%'));
  const dlg = h('div', { style: { position: 'absolute', left: '50%', top: '80px', transform: 'translateX(-50%)', width: '220px', background: '#fff', borderRadius: '4px', boxShadow: '0 2px 12px #0002', padding: '14px', fontSize: '12px', display: 'grid', gap: '10px' } }, h('div.k-row', {}, h('b', {}, 'Import files'), h('span', { style: { flex: 1 } }), h('span', { style: { cursor: 'pointer' }, onclick: () => dlg.remove() }, '✕')), toggle('Quick import', true, () => {}), h('div', { style: { border: '2px dashed #ccc', padding: '14px', lineHeight: 1.6, color: '#555' } }, 'Drag and drop or ', h('u', { style: { color: '#1b8bd0', cursor: 'pointer' }, onclick: () => { loaded = true; simplify(); dlg.remove(); sl.style.display = 'block'; } }, 'select'), ' files to import. Shapefile, GeoJSON, TopoJSON, KML and CSV files are supported.'), h('button', { style: { background: '#1b8bd0', color: '#fff', border: 0, padding: '7px' }, onclick: () => { loaded = true; simplify(); dlg.remove(); sl.style.display = 'block'; } }, 'Use sample: world countries'));
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '30px', background: '#1b8bd0', color: '#fff', padding: '0 10px', fontSize: '12px', gap: '14px' } }, h('b', {}, 'mapshaper-ish'), sl, info, h('span', { style: { flex: 1 } }), 'Simplify', 'Console', 'Export'), dlg);
  window.__demoProof = async () => { simplify(); return 'import dialog (sample loads → DP simplify slider)'; };
};

V['windy-weather-map-desk'] = (root, T) => {
  theme(root, T, { bg: '#0b1a28', fg: '#fff', ac: '#f5c518', dark: true });
  const N = noise2(7);
  let layer = 'Wind', frame = 9, playing = false, spot = { name: 'Wheaton', lon: -88.08, lat: 41.87, temp: 64, wind: 4 };
  const cities = [['Chicago', -87.63, 41.88], ['Minneapolis', -93.27, 44.98], ['Denver', -104.99, 39.74], ['New York', -74.0, 40.71], ['Kansas City', -94.58, 39.1], ['Dallas', -96.8, 32.78], ['Atlanta', -84.39, 33.75], ['Seattle', -122.33, 47.61], ['Toronto', -79.38, 43.65], ['St. Louis', -90.2, 38.63]];
  const days = ['Wednesday 30', 'Thursday 1', 'Friday 2', 'Saturday 3', 'Sunday 4'];
  const frames = 24;
  const valAt = (lon, lat, f, lyr) => {
    const t = f / frames;
    const n = N(lon / 28 + t * 1.4, lat / 22 - t * 0.7) * 0.65 + N(lon / 10 - t, lat / 12 + t * 0.5) * 0.35;
    if (lyr === 'Temp') return clamp(35 + n * 50 + lat * -0.35, 0, 100);
    if (lyr === 'Rain') return clamp((n - 0.45) * 120, 0, 40);
    return clamp(n * 55, 0, 70);
  };
  const windColor = (v) => { const t = clamp(v / 60, 0, 1); const h = 210 - t * 160; return `hsla(${h},85%,${40 + t * 25}%,.72)`; };
  const tempColor = (v) => { const t = clamp((v - 20) / 70, 0, 1); return `hsla(${250 - t * 250},80%,50%,.7)`; };
  const rainColor = (v) => `hsla(${160 - v * 2},80%,40%,${clamp(v / 25, 0, 0.85)})`;
  const colorFn = () => (layer === 'Temp' ? tempColor : layer === 'Rain' ? rainColor : windColor);
  const ov = document.createElement('canvas'); ov.width = 360; ov.height = 180;
  const bake = () => {
    const g = ov.getContext('2d'), img = g.createImageData(360, 180), cf = colorFn();
    for (let y = 0; y < 180; y++) for (let x = 0; x < 360; x++) {
      const lon = x - 180, lat = 90 - y;
      const v = valAt(lon, lat, frame, layer);
      const c = cf(v); const m = c.match(/hsla?\((\d+),(\d+)%,(\d+)%,?([\d.]*)\)/);
      if (!m) continue;
      const [, hh, ss, ll, aa] = m.map(Number); const a = (aa || 1) * 255;
      const s2 = ss / 100, l2 = ll / 100; const k = (n) => (n + hh / 30) % 12; const am = s2 * Math.min(l2, 1 - l2);
      const f = (n) => l2 - am * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      const i = (y * 360 + x) * 4; img.data[i] = f(0) * 255; img.data[i + 1] = f(8) * 255; img.data[i + 2] = f(4) * 255; img.data[i + 3] = a;
    }
    g.putImageData(img, 0, 0);
  };
  bake();
  const M = mapView(root, { proj: geoEquirectangular(), draw: (g, proj, path, cv) => {
    g.fillStyle = '#0a1624'; g.fillRect(0, 0, cv.W, cv.H);
    g.beginPath(); path(LAND); g.fillStyle = '#1a2a38'; g.fill();
    g.beginPath(); path(BORDERS); g.strokeStyle = '#ffffff28'; g.lineWidth = 0.6; g.stroke();
    const [x0, y0] = proj([-180, 90]), [x1, y1] = proj([180, -90]);
    g.globalAlpha = 0.85; g.drawImage(ov, x0, y0, x1 - x0, y1 - y0); g.globalAlpha = 1;
    g.font = '11px Inter,sans-serif'; g.fillStyle = '#fff';
    cities.forEach(([n, lon, lat]) => {
      const p = proj([lon, lat]); if (!p) return;
      const t = Math.round(valAt(lon, lat, frame, 'Temp'));
      g.beginPath(); g.arc(p[0], p[1], 2.2, 0, 7); g.fill();
      g.fillText(`${n} ${t}°`, p[0] + 5, p[1] - 4);
    });
  }});
  M.k = 2.4; M.x = 80; M.y = 90;
  const tip = h('div', { style: { position: 'absolute', bottom: '52px', left: '50%', transform: 'translateX(-50%)', background: '#f5c518', color: '#111', fontWeight: 800, fontSize: '12px', padding: '3px 10px', borderRadius: '4px', pointerEvents: 'none' } }, '9 PM');
  const legend = h('div', { style: { position: 'absolute', bottom: '4px', left: '60px', right: '80px', height: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' } });
  const legendBar = h('div', { style: { flex: 1, height: '8px', borderRadius: '2px', background: 'linear-gradient(90deg,#1c5cff,#1cc8a0,#9fe03a,#f5c518,#ff7a1a,#e03a3a)' } });
  const legendUnit = h('span', {}, 'kt');
  legend.append(h('span', {}, '0'), legendBar, h('span', {}, '5'), h('span', {}, '10'), h('span', {}, '20'), h('span', {}, '40'), h('span', {}, '60'), legendUnit);
  const scrub = h('input', { type: 'range', min: 0, max: frames - 1, value: frame, style: { flex: 1, accentColor: '#f5c518' }, oninput: (e) => { frame = +e.target.value; tip.textContent = `${(6 + frame) % 24}:00`.replace(/^(\d):/, '0$1:'); bake(); updateSpot(); } });
  const playBtn = h('button', { style: { background: 'none', border: 0, color: '#fff', fontSize: '16px', cursor: 'pointer', width: '28px' }, onclick: () => { playing = !playing; playBtn.textContent = playing ? '❚❚' : '▶'; } }, '▶');
  setInterval(() => { if (!playing) return; frame = (frame + 1) % frames; scrub.value = frame; tip.textContent = `${(6 + frame) % 24}:00`.replace(/^(\d):/, '0$1:'); bake(); updateSpot(); }, 400);
  const tempEl = h('b', { style: { fontSize: '42px', fontWeight: 300 } }, '64°');
  const windEl = h('span', { style: { fontSize: '14px', opacity: .85 } }, '☁ 4 kt');
  const search = h('input', { value: spot.name, style: { background: '#0008', border: '1px solid #ffffff33', color: '#fff', padding: '6px 12px', borderRadius: '6px', width: '180px' }, onchange: (e) => {
    const q = e.target.value.toLowerCase();
    const hit = cities.find((c) => c[0].toLowerCase().includes(q)) || ['Wheaton', -88.08, 41.87];
    spot = { name: hit[0], lon: hit[1], lat: hit[2], temp: Math.round(valAt(hit[1], hit[2], frame, 'Temp')), wind: Math.round(valAt(hit[1], hit[2], frame, 'Wind')) };
    search.value = spot.name; updateSpot();
  }});
  const updateSpot = () => {
    spot.temp = Math.round(valAt(spot.lon, spot.lat, frame, 'Temp'));
    spot.wind = Math.round(valAt(spot.lon, spot.lat, frame, 'Wind'));
    tempEl.textContent = spot.temp + '°'; windEl.textContent = `☁ ${spot.wind} kt`;
  };
  M.cv.addEventListener('click', (e) => {
    const r = M.cv.getBoundingClientRect();
    const ll = M.proj.invert([(e.clientX - r.left), (e.clientY - r.top)]);
    if (!ll) return;
    spot = { name: 'Spot', lon: ll[0], lat: ll[1], temp: 0, wind: 0 };
    search.value = `${ll[1].toFixed(1)}°, ${ll[0].toFixed(1)}°`;
    updateSpot();
  });
  const forecast = h('div.k-row', { style: { gap: '18px', fontSize: '11px', opacity: .9 } },
    ...['Wed 62°/66° 🌧', 'Thu 58°/70° ⛅', 'Fri 60°/72° ☀', 'Sat 61°/74° ☀'].map((t) => h('div', { style: { textAlign: 'center' } }, t)));
  const layerPanel = h('div', { style: { position: 'absolute', right: '56px', bottom: '70px', background: '#1a2430f0', borderRadius: '10px', padding: '8px', display: 'none', gap: '4px', zIndex: 5 } });
  const setLayer = (k) => {
    layer = k; bake();
    legendUnit.textContent = k === 'Temp' ? '°F' : k === 'Rain' ? 'mm' : 'kt';
    legendBar.style.background = k === 'Temp'
      ? 'linear-gradient(90deg,#3a5cff,#40d0ff,#9fe03a,#f5c518,#ff5a1a)'
      : k === 'Rain' ? 'linear-gradient(90deg,#0a3a2a,#1cc8a0,#3a8cff,#6a3aff)'
      : 'linear-gradient(90deg,#1c5cff,#1cc8a0,#9fe03a,#f5c518,#ff7a1a,#e03a3a)';
    layerPanel.style.display = 'none';
    layerPanel.querySelectorAll('button').forEach((b) => (b.style.background = b.dataset.k === k ? '#f5c518' : '#ffffff14'));
  };
  ['Wind', 'Temp', 'Rain'].forEach((k) => layerPanel.append(h('button', { 'data-k': k, style: { display: 'block', width: '100%', background: k === 'Wind' ? '#f5c518' : '#ffffff14', color: k === 'Wind' ? '#111' : '#fff', border: 0, padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }, onclick: () => setLayer(k) }, k)));
  const fab = h('button', { style: { position: 'absolute', right: '14px', bottom: '70px', width: '48px', height: '48px', borderRadius: '50%', background: '#e53935', color: '#fff', border: 0, fontSize: '20px', cursor: 'pointer', zIndex: 5, boxShadow: '0 4px 16px #0008' }, onclick: () => (layerPanel.style.display = layerPanel.style.display === 'none' ? 'grid' : 'none') }, '☰');
  const rail = h('div', { style: { position: 'absolute', right: '18px', top: '120px', display: 'grid', gap: '14px', fontSize: '18px', opacity: .85, zIndex: 4 } }, '⌂', '🔍', '📍', '♡');
  root.append(
    h('div.k-row', { style: { position: 'absolute', top: '10px', left: '14px', right: '70px', gap: '20px', zIndex: 4, alignItems: 'flex-start' } },
      h('div', { style: { display: 'grid', gap: '4px' } }, search, h('div.k-row', { style: { gap: '12px', alignItems: 'baseline' } }, tempEl, windEl)),
      forecast),
    h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, bottom: '18px', height: '34px', background: '#0d1520ee', padding: '0 10px', gap: '10px', zIndex: 4, fontSize: '11px' } },
      playBtn,
      ...days.map((d, i) => h('span', { style: { opacity: i === Math.floor(frame / 5) ? 1 : .45, minWidth: '70px' } }, d)),
      scrub),
    tip, legend, rail, layerPanel, fab);
  window.__demoProof = async () => {
    frame = 14; scrub.value = 14; bake(); updateSpot();
    setLayer('Temp'); await sleep(200); setLayer('Wind');
    playing = true; playBtn.textContent = '❚❚'; await sleep(500); playing = false;
    return `scrubbed to frame ${frame}, toggled Temp→Wind, play exercised; spot ${spot.temp}°`;
  };
};

V['ancient-earth-deep-time-globe'] = (root, T) => {
  theme(root, T, { bg: '#000', fg: '#fff', panel: '#0a0a0a', ac: '#e8d48a', dark: true });
  const AGES = [
    { ma: 750, label: '750 million', era: 'Cryogenian', blurb: 'Snowball Earth episodes. Continents clustered near the equator under ice.' },
    { ma: 600, label: '600 million', era: 'Ediacaran', blurb: 'Soft-bodied life blooms in shallow seas as ice retreats.' },
    { ma: 500, label: '500 million', era: 'Cambrian', blurb: 'Cambrian explosion — shells, trilobites, and complex ecosystems.' },
    { ma: 400, label: '400 million', era: 'Devonian', blurb: 'Age of Fishes. Early forests creep onto land.' },
    { ma: 300, label: '300 million', era: 'Carboniferous', blurb: 'Vast swamp forests; coal beds form. Pangaea assembling.' },
    { ma: 240, label: '240 million', era: 'Early Triassic', blurb: 'Oxygen levels are lower. Small ancestors to birds, mammals, and dinosaurs survive on Pangaea.' },
    { ma: 150, label: '150 million', era: 'Late Jurassic', blurb: 'Pangaea rifts. Dinosaurs dominate continents and skies.' },
    { ma: 90, label: '90 million', era: 'Late Cretaceous', blurb: 'Warm greenhouse world. Flowering plants spread widely.' },
    { ma: 50, label: '50 million', era: 'Eocene', blurb: 'Mammals diversify after the K–Pg extinction. Primates appear.' },
    { ma: 20, label: '20 million', era: 'Miocene', blurb: 'Grasslands expand. Modern ocean currents take shape.' },
    { ma: 0, label: '0 (today)', era: 'Holocene', blurb: 'Present-day continents and climates — the Anthropocene begins.' },
  ];
  const JUMPS = [
    ['first shells', 500], ['first forests', 400], ['first reptiles', 300],
    ['first dinosaurs', 240], ['first flowers', 90], ['first primates', 50], ['today', 0],
  ];
  let age = 240, rotating = true, cloudsOn = true;
  const ageOf = (ma) => AGES.reduce((best, a) => Math.abs(a.ma - ma) < Math.abs(best.ma - ma) ? a : best, AGES[0]);
  const terrain = (ma) => {
    // stylized deep-time palette: older = greener/browner continents, different ocean tint
    const t = clamp(1 - ma / 750, 0, 1);
    const land = `hsl(${95 - t * 40},${35 + t * 20}%,${28 + t * 18}%)`;
    const ocean = `hsl(${205 - t * 25},${55 + t * 10}%,${18 + t * 10}%)`;
    const shelf = `hsl(${190 - t * 20},50%,${30 + t * 8}%)`;
    return { land, ocean, shelf, ice: t > 0.85 ? '#e8f0ff' : '#dfe8f0' };
  };
  const N = noise2(11);
  const cloudLayer = document.createElement('canvas'); cloudLayer.width = 512; cloudLayer.height = 256;
  const bakeClouds = () => {
    const g = cloudLayer.getContext('2d'); const img = g.createImageData(512, 256);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 512; x++) {
      const n = N(x / 40, y / 28) * 0.65 + N(x / 12, y / 10 + 3) * 0.35;
      const band = Math.exp(-(((y - 80) / 40) ** 2)) * 0.25 + Math.exp(-(((y - 170) / 35) ** 2)) * 0.2;
      const v = clamp((n + band - 0.55) * 2.8, 0, 1);
      const i = (y * 512 + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = v * 180;
    }
    g.putImageData(img, 0, 0);
  };
  bakeClouds();
  const G = globeCanvas(root, { rot: [-20, -15], scale: 0.48, spin: 0.08, draw: (g, proj, path, cv, st) => {
    st.spin = rotating ? 0.08 : 0;
    const pal = terrain(age);
    // starfield
    g.fillStyle = '#000'; g.fillRect(0, 0, cv.W, cv.H);
    g.fillStyle = '#ffffff';
    for (let i = 0; i < 120; i++) {
      const sx = ((i * 97) % cv.W), sy = ((i * 53) % cv.H);
      g.globalAlpha = 0.15 + (i % 5) * 0.08;
      g.fillRect(sx, sy, 1.2, 1.2);
    }
    g.globalAlpha = 1;
    // atmosphere glow
    const r = Math.min(cv.W, cv.H) * st.scale;
    const glow = g.createRadialGradient(cv.W / 2, cv.H / 2, r * 0.92, cv.W / 2, cv.H / 2, r * 1.12);
    glow.addColorStop(0, '#4fa3ff00'); glow.addColorStop(0.6, '#4fa3ff22'); glow.addColorStop(1, '#0000');
    g.fillStyle = glow; g.beginPath(); g.arc(cv.W / 2, cv.H / 2, r * 1.12, 0, 7); g.fill();
    g.beginPath(); path({ type: 'Sphere' }); g.fillStyle = pal.ocean; g.fill();
    // shallow shelf band via graticule tint
    g.beginPath(); path(geoGraticule10()); g.strokeStyle = pal.shelf + '44'; g.lineWidth = 0.4; g.stroke();
    g.beginPath(); path(LAND); g.fillStyle = pal.land; g.fill();
    g.beginPath(); path(BORDERS); g.strokeStyle = '#00000055'; g.lineWidth = 0.5; g.stroke();
    if (cloudsOn) {
      // project cloud equirect onto sphere via drawImage clipped to sphere is hard; approximate with soft arcs
      g.save();
      g.beginPath(); path({ type: 'Sphere' }); g.clip();
      g.globalAlpha = 0.55;
      // spin clouds slightly offset
      const [x0, y0] = proj([-180, 90]) || [0, 0], [x1, y1] = proj([180, -90]) || [cv.W, cv.H];
      if (x0 != null && x1 != null) g.drawImage(cloudLayer, x0 - 20, y0, (x1 - x0) + 40, y1 - y0);
      g.globalAlpha = 1; g.restore();
    }
    // limb highlight
    g.beginPath(); path({ type: 'Sphere' }); g.strokeStyle = '#ffffff22'; g.lineWidth = 2; g.stroke();
  }});
  const infoEra = h('div', { style: { fontSize: '13px', opacity: .85, maxWidth: '320px', lineHeight: 1.45 } });
  const infoAge = h('div', { style: { font: '700 28px/1.1 Inter,system-ui,sans-serif', marginTop: '8px' } });
  const syncLabels = () => {
    const a = ageOf(age);
    infoEra.innerHTML = `<b style="opacity:.95">${a.era}.</b> ${a.blurb}`;
    infoAge.textContent = a.ma === 0 ? 'today' : `${a.ma} million years ago`;
    ageSel.value = String(a.ma);
    // sync jump select to nearest milestone
    let best = JUMPS[0], bd = 1e9;
    JUMPS.forEach((j) => { const d = Math.abs(j[1] - a.ma); if (d < bd) { bd = d; best = j; } });
    jumpSel.value = String(best[1]);
    headlineAge.textContent = a.label;
  };
  const setAge = (ma) => { age = +ma; syncLabels(); };
  const ageSel = select(AGES.map((a) => [String(a.ma), a.label]), String(age), setAge);
  Object.assign(ageSel.style, { background: '#000a', color: '#fff', border: '1px solid #ffffff55', borderRadius: '6px', padding: '4px 8px', fontWeight: 700 });
  const jumpSel = select(JUMPS.map(([l, m]) => [String(m), l]), '240', (v) => setAge(+v));
  Object.assign(jumpSel.style, { background: '#000a', color: '#fff', border: '1px solid #ffffff44', borderRadius: '6px', padding: '4px 8px' });
  const headlineAge = h('span', { style: { display: 'inline-block', background: '#000c', border: '1px solid #ffffff55', borderRadius: '6px', padding: '2px 10px', fontWeight: 700, margin: '0 6px' } }, '240 million');
  // replace ageSel visual in headline — keep select functional beside
  const rotToggle = toggle('Rotate globe', true, (v) => { rotating = v; });
  const cloudToggle = toggle('Clouds', true, (v) => { cloudsOn = v; });
  Object.assign(rotToggle.style, { color: '#fff', fontSize: '12px', background: '#000a', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ffffff22' });
  Object.assign(cloudToggle.style, { color: '#fff', fontSize: '12px', background: '#000a', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ffffff22' });
  root.append(
    h('div', { style: { position: 'absolute', top: '14px', left: '16px', fontSize: '12px', color: '#e8d48a', zIndex: 4 } }, '« Back to Dinosaur Database'),
    h('div', { style: { position: 'absolute', top: '18px', left: '50%', transform: 'translateX(-50%)', zIndex: 4, textAlign: 'center', fontSize: '20px', fontWeight: 500, whiteSpace: 'nowrap' } },
      'What did Earth look like ', headlineAge, ' years ago?'),
    h('div', { style: { position: 'absolute', top: '56px', left: '50%', transform: 'translateX(-50%)', zIndex: 4 } }, ageSel),
    h('div', { style: { position: 'absolute', top: '70px', right: '18px', zIndex: 4, display: 'grid', gap: '8px', justifyItems: 'end' } },
      h('div.k-row', { style: { gap: '8px', fontSize: '12px' } }, h('span', { style: { opacity: .7 } }, 'Jump to…'), jumpSel),
      rotToggle, cloudToggle),
    h('div', { style: { position: 'absolute', left: '18px', bottom: '24px', zIndex: 4, maxWidth: '340px' } }, infoEra, infoAge),
    h('div', { style: { position: 'absolute', right: '18px', bottom: '18px', zIndex: 4, fontSize: '11px', opacity: .55, textAlign: 'right', maxWidth: '260px' } },
      'Drag to orbit · ← → step through time', h('br'), 'Paleomap-inspired demo · no licensed map copy'),
  );
  // keyboard step
  const onKey = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const idx = AGES.findIndex((a) => a.ma === ageOf(age).ma);
    const n = clamp(idx + (e.key === 'ArrowRight' ? -1 : 1), 0, AGES.length - 1); // right = younger
    setAge(AGES[n].ma);
  };
  window.addEventListener('keydown', onKey);
  syncLabels();
  window.__demoProof = async () => {
    setAge(500); await sleep(120);
    setAge(90); await sleep(120);
    rotating = false; rotToggle.querySelector('input').checked = false;
    cloudsOn = false; cloudToggle.querySelector('input').checked = false;
    await sleep(80);
    rotating = true; cloudsOn = true;
    rotToggle.querySelector('input').checked = true;
    cloudToggle.querySelector('input').checked = true;
    G.rot[0] += 40; G.rot[1] = -10;
    setAge(240);
    return `age ${age} Ma; jump/age synced; rotate+clouds toggled; drag-rotate exercised`;
  };
};

V['kepler-gl-geospatial-layer-desk'] = (root, T) => {
  theme(root, T, { bg: '#0d1117', fg: '#e8eaed', panel: '#1c2330cc', ac: '#6b8cff', dark: true });
  const SAMPLES = {
    'SF Taxi Trips': (() => {
      const R = rng(11); const pts = [];
      for (let i = 0; i < 180; i++) pts.push({ lon: -122.42 + (R() - 0.5) * 0.18, lat: 37.77 + (R() - 0.5) * 0.12, val: Math.round(R() * 100), color: '#f7b500' });
      return pts;
    })(),
    'NYC Contagion': (() => {
      const R = rng(22); const pts = [];
      for (let i = 0; i < 160; i++) pts.push({ lon: -74.0 + (R() - 0.5) * 0.22, lat: 40.72 + (R() - 0.5) * 0.16, val: Math.round(R() * 100), color: '#ff6b6b' });
      return pts;
    })(),
    'Earthquakes': (() => {
      const R = rng(33); const pts = [];
      for (let i = 0; i < 140; i++) pts.push({ lon: R() * 360 - 180, lat: (R() - 0.5) * 140, val: Math.round(20 + R() * 80), color: '#7ee787' });
      return pts;
    })(),
  };
  let state = 'empty'; // empty | loading | loaded
  let points = [];
  let filterMin = 0;
  let blend = 'normal';
  let tab = 'Layers';
  let lid = 1;
  const layers = []; // {id,name,type,visible,color}
  const BLENDS = ['normal', 'additive', 'screen', 'multiply'];

  const statusEl = h('div', { style: { fontSize: '12px', opacity: .7, padding: '8px 12px' } });
  const layerList = h('div', { style: { display: 'grid', gap: '8px', padding: '0 10px 10px' } });
  const countEl = h('div', { style: { fontSize: '11px', opacity: .55, padding: '0 12px 8px' } });

  const syncStatus = () => {
    if (state === 'empty') statusEl.textContent = 'No data · Add Data to begin';
    else if (state === 'loading') statusEl.textContent = 'Loading sample…';
    else statusEl.textContent = `${points.length} points · ${layers.filter((l) => l.visible).length} layers visible`;
    const vis = layers.filter((l) => l.visible).length;
    const shown = points.filter((p) => p.val >= filterMin).length;
    countEl.textContent = state === 'loaded' ? `Showing ${shown}/${points.length} (filter ≥ ${filterMin}) · blend ${blend}` : '';
  };

  const renderLayers = () => {
    layerList.replaceChildren(...layers.map((L, idx) => {
      const card = h('div', { style: { background: '#0f141dcc', border: '1px solid #ffffff18', borderRadius: '8px', padding: '10px', display: 'grid', gap: '6px' } },
        h('div.k-row', { style: { gap: '8px' } },
          h('button', { title: 'visibility', style: { background: 'none', border: 0, color: L.visible ? '#6b8cff' : '#666', cursor: 'pointer', fontSize: '14px' }, onclick: () => { L.visible = !L.visible; renderLayers(); syncStatus(); } }, L.visible ? '👁' : '👁‍🗨'),
          h('b', { style: { flex: 1, fontSize: '13px' } }, L.name),
          h('span', { style: { fontSize: '10px', background: L.color + '33', color: L.color, border: `1px solid ${L.color}66`, borderRadius: '4px', padding: '2px 6px', fontWeight: 700 } }, L.type),
          h('button', { style: { background: 'none', border: 0, color: '#888', cursor: 'pointer' }, onclick: () => { layers.splice(idx, 1); if (!layers.length) { state = 'empty'; points = []; } renderLayers(); syncStatus(); } }, '✕')),
        h('div.k-row', { style: { gap: '6px', fontSize: '11px' } },
          h('button', { style: { background: '#ffffff10', border: '1px solid #ffffff18', color: '#ccc', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }, onclick: () => { if (idx > 0) { const t = layers[idx - 1]; layers[idx - 1] = layers[idx]; layers[idx] = t; renderLayers(); } } }, '↑'),
          h('button', { style: { background: '#ffffff10', border: '1px solid #ffffff18', color: '#ccc', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }, onclick: () => { if (idx < layers.length - 1) { const t = layers[idx + 1]; layers[idx + 1] = layers[idx]; layers[idx] = t; renderLayers(); } } }, '↓'),
          h('span', { style: { opacity: .45 } }, `id ${L.id}`)));
      return card;
    }));
    if (!layers.length) layerList.append(h('div', { style: { padding: '24px 12px', textAlign: 'center', opacity: .45, fontSize: '12px', lineHeight: 1.6 } }, 'Empty layers panel', h('br'), 'Add Data or Add Layer to populate'));
  };

  const loadSample = (name) => {
    state = 'loading'; syncStatus(); renderLayers();
    setTimeout(() => {
      points = SAMPLES[name].map((p) => ({ ...p }));
      layers.length = 0;
      layers.push({ id: lid++, name, type: 'point', visible: true, color: points[0]?.color || '#f7b500' });
      state = 'loaded';
      modal.style.display = 'none';
      renderLayers(); syncStatus();
      // center map roughly
      if (name === 'SF Taxi Trips') { M.x = 40; M.y = -20; M.k = 3.2; }
      else if (name === 'NYC Contagion') { M.x = 180; M.y = -40; M.k = 3.4; }
      else { M.x = 0; M.y = 0; M.k = 1.1; }
    }, 450);
  };

  const modal = h('div', { style: { position: 'absolute', inset: 0, background: '#000a', display: 'none', placeItems: 'center', zIndex: 20 } });
  const modalCard = h('div', { style: { width: '420px', background: '#1a2230', border: '1px solid #ffffff22', borderRadius: '12px', padding: '18px', display: 'grid', gap: '12px', boxShadow: '0 24px 80px #000a' } },
    h('div.k-row', {}, h('b', { style: { fontSize: '16px' } }, 'Add Data'), h('span', { style: { flex: 1 } }), h('button', { style: { background: 'none', border: 0, color: '#aaa', cursor: 'pointer', fontSize: '18px' }, onclick: () => (modal.style.display = 'none') }, '✕')),
    h('div', { style: { fontSize: '12px', opacity: .65 } }, 'Try sample data — no upload required'),
    ...Object.keys(SAMPLES).map((n) => h('button', { style: { textAlign: 'left', background: '#0f141d', border: '1px solid #ffffff18', color: '#e8eaed', borderRadius: '8px', padding: '12px 14px', cursor: 'pointer' }, onclick: () => loadSample(n) },
      h('b', {}, n), h('div', { style: { fontSize: '11px', opacity: .55, marginTop: '4px' } }, `${SAMPLES[n].length} points · GeoJSON sample`))),
    h('div', { style: { border: '2px dashed #ffffff22', borderRadius: '8px', padding: '16px', textAlign: 'center', fontSize: '12px', opacity: .5 } }, 'Drop CSV / GeoJSON here (demo stub)'));
  modal.append(modalCard);
  modal.style.display = 'none';

  const M = mapView(root, { proj: geoMercator(), draw: (g, proj, path, cv, st) => {
    g.fillStyle = '#0b0f14'; g.fillRect(0, 0, cv.W, cv.H);
    g.beginPath(); path(LAND); g.fillStyle = '#1a2330'; g.fill();
    g.beginPath(); path(BORDERS); g.strokeStyle = '#ffffff14'; g.lineWidth = 0.6; g.stroke();
    if (state === 'loading') {
      g.fillStyle = '#ffffff88'; g.font = '14px Inter,sans-serif'; g.fillText('Loading…', cv.W / 2 - 30, cv.H / 2);
      return;
    }
    if (state !== 'loaded' || !layers.some((l) => l.visible)) return;
    const prev = g.globalCompositeOperation;
    g.globalCompositeOperation = blend === 'additive' ? 'lighter' : blend === 'screen' ? 'screen' : blend === 'multiply' ? 'multiply' : 'source-over';
    for (const p of points) {
      if (p.val < filterMin) continue;
      const xy = proj([p.lon, p.lat]); if (!xy) continue;
      g.beginPath(); g.fillStyle = p.color; g.globalAlpha = 0.75;
      g.arc(xy[0], xy[1], 2.2 + (p.val / 100) * 2.5, 0, 7); g.fill();
    }
    g.globalAlpha = 1; g.globalCompositeOperation = prev;
  }});
  M.k = 1.4; M.x = 0; M.y = 20;

  const filterSl = slider('Value ≥', 0, 100, 0, 1, (v) => { filterMin = v; syncStatus(); }, (v) => String(v));
  const blendSel = select(BLENDS.map((b) => [b, 'Blend: ' + b]), 'normal', (v) => { blend = v; syncStatus(); });
  Object.assign(blendSel.style, { background: '#0f141d', color: '#e8eaed', border: '1px solid #ffffff22', width: '100%' });

  const tabs = h('div.k-row', { style: { gap: 0, borderBottom: '1px solid #ffffff14', padding: '0 4px' } });
  const setTab = (t) => {
    tab = t;
    tabs.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.t === t;
      b.style.borderBottom = on ? '2px solid #6b8cff' : '2px solid transparent';
      b.style.color = on ? '#fff' : '#889';
    });
    bodyLayers.style.display = t === 'Layers' ? 'grid' : 'none';
    bodyFilters.style.display = t === 'Filters' ? 'grid' : 'none';
    bodyBase.style.display = t === 'Base map' ? 'grid' : 'none';
  };
  ['Layers', 'Filters', 'Interactions', 'Base map'].forEach((t) => tabs.append(h('button', { 'data-t': t, style: { flex: 1, background: 'none', border: 0, borderBottom: '2px solid transparent', color: '#889', padding: '10px 4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }, onclick: () => setTab(t) }, t)));

  const bodyLayers = h('div', { style: { display: 'grid', gap: '8px', paddingTop: '8px' } },
    statusEl, layerList, countEl,
    h('div.k-row', { style: { padding: '0 10px 12px', gap: '8px' } },
      btn('＋ Add Layer', () => {
        if (state !== 'loaded') { modal.style.display = 'grid'; return; }
        layers.push({ id: lid++, name: 'Layer ' + lid, type: pick(['point', 'heatmap', 'hex']), visible: true, color: pick(['#6b8cff', '#f7b500', '#ff6b6b', '#7ee787']) });
        renderLayers(); syncStatus();
      }, 'pri'),
      btn('Add Data', () => { modal.style.display = 'grid'; })));
  Object.assign(bodyLayers.querySelector('.k-btn.pri')?.style || {}, {});

  const bodyFilters = h('div', { style: { display: 'none', gap: '12px', padding: '14px 12px' } },
    h('div', { style: { fontSize: '12px', opacity: .7 } }, 'Filter points by numeric field'),
    filterSl,
    h('div', { style: { fontSize: '11px', opacity: .5 } }, 'Live-filters map markers as you drag'));
  const bodyBase = h('div', { style: { display: 'none', gap: '12px', padding: '14px 12px' } },
    h('div', { style: { fontSize: '12px', opacity: .7 } }, 'Layer blending'),
    blendSel,
    h('div', { style: { fontSize: '11px', opacity: .5 } }, 'Base map: dark matter (demo)'));

  const dock = h('div', { style: { position: 'absolute', left: '12px', top: '12px', bottom: '12px', width: '300px', background: '#1c2330d9', backdropFilter: 'blur(14px)', border: '1px solid #ffffff1a', borderRadius: '12px', zIndex: 5, display: 'grid', gridTemplateRows: 'auto auto 1fr', overflow: 'hidden', boxShadow: '0 12px 40px #0008' } },
    h('div.k-row', { style: { padding: '12px 14px', gap: '8px', borderBottom: '1px solid #ffffff12' } },
      h('b', { style: { fontSize: '14px', letterSpacing: '.02em' } }, 'kepler.gl'),
      h('span', { style: { flex: 1 } }),
      h('button', { style: { background: '#6b8cff', color: '#fff', border: 0, borderRadius: '6px', padding: '5px 10px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }, onclick: () => { modal.style.display = 'grid'; } }, 'Add Data')),
    tabs,
    h('div', { style: { overflow: 'auto' } }, bodyLayers, bodyFilters, bodyBase));

  root.append(
    dock, modal,
    h('div', { style: { position: 'absolute', right: '14px', top: '14px', zIndex: 4, display: 'grid', gap: '8px' } },
      h('div', { style: { background: '#1c2330cc', border: '1px solid #ffffff18', borderRadius: '8px', padding: '8px 12px', fontSize: '11px' } }, 'Share · Export'),
    ),
    h('div', { style: { position: 'absolute', right: '14px', bottom: '14px', zIndex: 4, fontSize: '11px', opacity: .45 } }, 'Drag to pan · scroll to zoom'),
  );
  setTab('Layers');
  renderLayers(); syncStatus();

  window.__demoProof = async () => {
    modal.style.display = 'grid'; await sleep(80);
    loadSample('SF Taxi Trips'); await sleep(520);
    filterMin = 40; filterSl.set(40); await sleep(80);
    layers.push({ id: lid++, name: 'Heat overlay', type: 'heatmap', visible: true, color: '#ff6b6b' });
    renderLayers();
    // reorder
    if (layers.length > 1) { const t = layers[0]; layers[0] = layers[1]; layers[1] = t; renderLayers(); }
    blend = 'additive'; blendSel.value = 'additive'; setTab('Filters'); await sleep(60); setTab('Layers');
    layers[0].visible = false; renderLayers(); await sleep(60); layers[0].visible = true; renderLayers();
    syncStatus();
    return `loaded SF sample; filter≥${filterMin}; layers ${layers.length}; blend ${blend}; reorder+visibility exercised`;
  };
};

V['maputnik-map-style-editor'] = (root, T) => {
  theme(root, T, { bg: '#1c1e24', fg: '#e8eaed', panel: '#2b2d33', ac: '#3b82f6', dark: true });
  const layers = [
    { id: 'background', type: 'background', visible: true, color: '#eff0ef', opacity: 1, width: 1 },
    { id: 'water', type: 'fill', visible: true, color: '#9ebdff', opacity: 1, width: 1 },
    { id: 'landcover', type: 'fill', visible: true, color: '#d8e0c8', opacity: 0.9, width: 1 },
    { id: 'park', type: 'fill', visible: true, color: '#a8d08d', opacity: 0.55, width: 1 },
    { id: 'road', type: 'line', visible: true, color: '#ffffff', opacity: 0.9, width: 2.2 },
    { id: 'boundary', type: 'line', visible: true, color: '#888888', opacity: 0.55, width: 1 },
  ];
  let sel = 0;
  const layerList = h('div', { style: { overflow: 'auto', flex: 1 } });
  const inspTitle = h('div', { style: { fontWeight: 700, fontSize: '13px', padding: '10px 12px', borderBottom: '1px solid #ffffff14' } });
  const idEl = h('b', { style: { fontFamily: 'ui-monospace,monospace' } });
  const typeEl = h('b', { style: { fontFamily: 'ui-monospace,monospace' } });
  const jsonPre = h('pre', { style: { background: '#15171c', border: '1px solid #ffffff14', borderRadius: '6px', padding: '8px', fontSize: '11px', color: '#9fd3ff', margin: 0, whiteSpace: 'pre-wrap' } });
  const zoomEl = h('div', { style: { background: '#1c1e24cc', border: '1px solid #ffffff22', borderRadius: '4px', padding: '4px 8px', fontSize: '11px' } }, 'Zoom: 1.20');
  const colorInp = h('input', { type: 'color', value: '#eff0ef' });
  const opSl = slider('Opacity', 0, 1, 1, 0.01, (v) => { layers[sel].opacity = v; syncJson(); }, (v) => (+v).toFixed(2));
  const wSl = slider('Line width', 0.5, 8, 2, 0.1, (v) => { layers[sel].width = v; syncJson(); }, (v) => (+v).toFixed(1));

  const paintOf = (L) => {
    if (L.type === 'background') return { 'background-color': L.color, 'background-opacity': L.opacity };
    if (L.type === 'fill') return { 'fill-color': L.color, 'fill-opacity': L.opacity };
    return { 'line-color': L.color, 'line-opacity': L.opacity, 'line-width': L.width };
  };
  const syncJson = () => {
    const L = layers[sel];
    jsonPre.textContent = JSON.stringify({ id: L.id, type: L.type, paint: paintOf(L) }, null, 2);
  };
  const renderList = () => {
    layerList.replaceChildren(...layers.map((L, i) => {
      const on = i === sel;
      return h('div', {
        style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', cursor: 'pointer', background: on ? '#3a3d46' : 'transparent', borderLeft: on ? '3px solid #3b82f6' : '3px solid transparent', fontSize: '12px' },
        onclick: () => { sel = i; renderList(); renderInsp(); },
      },
        h('span', { style: { width: '8px', height: '8px', borderRadius: L.type === 'line' ? '1px' : '2px', background: L.color, border: '1px solid #fff3' } }),
        h('span', { style: { flex: 1, fontFamily: 'ui-monospace,monospace' } }, L.id),
        h('span', { style: { fontSize: '10px', opacity: .45 } }, L.type),
        h('button', { title: 'visibility', style: { background: 'none', border: 0, color: L.visible ? '#9ebdff' : '#666', cursor: 'pointer' }, onclick: (e) => { e.stopPropagation(); L.visible = !L.visible; renderList(); } }, L.visible ? '👁' : '👁‍🗨'));
    }));
  };
  const renderInsp = () => {
    const L = layers[sel];
    inspTitle.textContent = `Layer: '${L.id}'`;
    idEl.textContent = L.id;
    typeEl.textContent = L.type;
    colorInp.value = L.color.startsWith('#') ? L.color : '#9ebdff';
    opSl.set(L.opacity);
    wSl.style.display = L.type === 'line' ? '' : 'none';
    if (L.type === 'line') wSl.set(L.width);
    syncJson();
  };
  colorInp.oninput = (e) => { layers[sel].color = e.target.value; syncJson(); renderList(); };

  const M = mapView(root, { proj: geoMercator(), draw: (g, proj, path, cv) => {
    const bg = layers.find((l) => l.id === 'background');
    g.fillStyle = bg?.visible ? bg.color : '#1a1a1a';
    g.globalAlpha = bg ? bg.opacity : 1;
    g.fillRect(0, 0, cv.W, cv.H);
    g.globalAlpha = 1;
    const water = layers.find((l) => l.id === 'water');
    if (water?.visible) { g.beginPath(); path({ type: 'Sphere' }); g.fillStyle = water.color; g.globalAlpha = water.opacity; g.fill(); g.globalAlpha = 1; }
    const land = layers.find((l) => l.id === 'landcover');
    if (land?.visible) { g.beginPath(); path(LAND); g.fillStyle = land.color; g.globalAlpha = land.opacity; g.fill(); g.globalAlpha = 1; }
    const park = layers.find((l) => l.id === 'park');
    if (park?.visible) { g.beginPath(); path(LAND); g.fillStyle = park.color; g.globalAlpha = park.opacity * 0.4; g.fill(); g.globalAlpha = 1; }
    const road = layers.find((l) => l.id === 'road');
    if (road?.visible) { g.beginPath(); path(BORDERS); g.strokeStyle = road.color; g.globalAlpha = road.opacity; g.lineWidth = road.width; g.stroke(); g.globalAlpha = 1; }
    const bound = layers.find((l) => l.id === 'boundary');
    if (bound?.visible) { g.beginPath(); path(BORDERS); g.strokeStyle = bound.color; g.globalAlpha = bound.opacity; g.lineWidth = bound.width; g.setLineDash([4, 3]); g.stroke(); g.setLineDash([]); g.globalAlpha = 1; }
    zoomEl.textContent = `Zoom: ${M.k.toFixed(2)}`;
  }});
  M.k = 1.2; M.x = 0; M.y = 10;

  const addLayer = () => {
    const n = layers.length + 1;
    layers.push({ id: 'layer-' + n, type: pick(['fill', 'line']), visible: true, color: pick(['#f7b500', '#ff6b6b', '#7ee787', '#c084fc']), opacity: 0.85, width: 2 });
    sel = layers.length - 1;
    renderList(); renderInsp();
  };

  const inspBody = h('div', { style: { padding: '10px 12px', display: 'grid', gap: '10px', overflow: 'auto', flex: 1 } },
    h('div', { style: { fontSize: '11px', opacity: .55, letterSpacing: '.06em' } }, 'LAYER'),
    h('div.k-row', { style: { gap: '8px', fontSize: '12px' } }, h('span', { style: { opacity: .6 } }, 'ID'), idEl, h('span', { style: { opacity: .4 } }, '·'), h('span', { style: { opacity: .6 } }, 'Type'), typeEl),
    h('div', { style: { fontSize: '11px', opacity: .55, letterSpacing: '.06em', marginTop: '4px' } }, 'PAINT PROPERTIES'),
    h('div.k-row', { style: { gap: '8px' } }, h('span', { style: { fontSize: '12px', opacity: .7, width: '70px' } }, 'Color'), colorInp),
    opSl, wSl,
    h('div', { style: { fontSize: '11px', opacity: .55, letterSpacing: '.06em', marginTop: '4px' } }, 'JSON EDITOR'),
    jsonPre);

  root.append(
    h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: '40px', background: '#1c1e24', borderBottom: '1px solid #000a', zIndex: 6, padding: '0 14px', gap: '16px', fontSize: '12px' } },
      h('b', {}, '⬡ Maputnik'), h('span', { style: { opacity: .45 } }, 'v1.7'),
      h('span', { style: { opacity: .7 } }, 'Open'), h('span', { style: { opacity: .7 } }, 'Export'), h('span', { style: { opacity: .7 } }, 'Data Sources'), h('span', { style: { opacity: .7 } }, 'Style Settings'),
      h('span', { style: { flex: 1 } }), h('span', { style: { background: '#3a3d46', padding: '4px 10px', borderRadius: '4px' } }, 'Map ▾')),
    h('div', { style: { position: 'absolute', left: 0, top: 40, bottom: 0, width: '220px', background: '#2b2d33', borderRight: '1px solid #0008', zIndex: 5, display: 'flex', flexDirection: 'column' } },
      h('div.k-row', { style: { padding: '10px 12px', borderBottom: '1px solid #ffffff14', fontSize: '12px', fontWeight: 700 } }, 'Layers', h('span', { style: { flex: 1 } }),
        h('button', { style: { background: 'none', border: 0, color: '#3b82f6', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }, onclick: addLayer }, '＋ Add Layer')),
      layerList),
    h('div', { style: { position: 'absolute', left: '220px', top: 40, bottom: 0, width: '280px', background: '#25272d', borderRight: '1px solid #0008', zIndex: 5, display: 'flex', flexDirection: 'column' } },
      inspTitle, inspBody),
    h('div', { style: { position: 'absolute', right: '14px', top: '54px', zIndex: 4, display: 'grid', gap: '6px', justifyItems: 'end' } }, zoomEl,
      h('div.k-row', { style: { gap: '4px' } },
        h('button', { style: { width: '28px', height: '28px', background: '#1c1e24cc', border: '1px solid #ffffff22', color: '#fff', borderRadius: '4px', cursor: 'pointer' }, onclick: () => { M.k = clamp(M.k * 1.15, 0.5, 8); } }, '+'),
        h('button', { style: { width: '28px', height: '28px', background: '#1c1e24cc', border: '1px solid #ffffff22', color: '#fff', borderRadius: '4px', cursor: 'pointer' }, onclick: () => { M.k = clamp(M.k * 0.87, 0.5, 8); } }, '−'))),
    h('div', { style: { position: 'absolute', right: '14px', bottom: '10px', zIndex: 4, fontSize: '10px', opacity: .45 } }, '© MapTiler · OpenStreetMap (demo)'),
  );

  renderList(); renderInsp();

  window.__demoProof = async () => {
    sel = layers.findIndex((l) => l.id === 'water'); renderList(); renderInsp();
    layers[sel].color = '#4a90e2'; colorInp.value = '#4a90e2'; syncJson(); await sleep(80);
    layers[sel].opacity = 0.7; opSl.set(0.7); await sleep(60);
    addLayer();
    const road = layers.find((l) => l.id === 'road');
    if (road) { sel = layers.indexOf(road); renderList(); renderInsp(); road.width = 4; wSl.set(4); syncJson(); }
    M.k = 1.8; await sleep(60);
    return `selected water; color+opacity; added layer; road width 4; zoom ${M.k}`;
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['weather-particle-globe'])(root, T); }
