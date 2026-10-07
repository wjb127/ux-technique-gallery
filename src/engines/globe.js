import { geoArea, geoCentroid, geoDistance, geoOrthographic, geoEquirectangular, geoPath, geoGraticule10, geoInterpolate, geoMercator } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import countries110 from 'world-atlas/countries-110m.json';
import { h, s, drag, localPos, clamp, copy, toast, sleep, rng, pick, noise2, fitCanvas, blip, fire } from '../lib.js';
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


V['musicmap-genre-carta-desk'] = (root, T) => {
  theme(root, T, { bg: '#1a1820', fg: '#f2f0f5', panel: '#24222c', ac: '#ffd166', dark: true });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, Georgia, serif';

  const SUPERS = [
    { id: 'blues', name: 'BLUES', color: '#4ea8de' },
    { id: 'jazz', name: 'JAZZ', color: '#5e60ce' },
    { id: 'gospel', name: 'GOSPEL', color: '#7b2cbf' },
    { id: 'country', name: 'COUNTRY', color: '#f4a261' },
    { id: 'rock', name: 'ROCK', color: '#e9c46a' },
    { id: 'metal', name: 'METAL', color: '#e76f51' },
    { id: 'pop', name: 'POP', color: '#ef476f' },
    { id: 'hiphop', name: 'HIP-HOP', color: '#06d6a0' },
    { id: 'reggae', name: 'REGGAE', color: '#118ab2' },
    { id: 'electronic', name: 'ELECTRONIC', color: '#ff006e' },
    { id: 'dance', name: 'DANCE', color: '#8338ec' },
    { id: 'ambient', name: 'AMBIENT', color: '#3a86ff' },
  ];
  const GENRES = [
    { name: 'Worksong / Spiritual', year: 1860, s: 0, links: [1, 2] },
    { name: 'Ragtime', year: 1897, s: 1, links: [2] },
    { name: 'Delta Blues', year: 1920, s: 0, links: [3, 4] },
    { name: 'Swing', year: 1935, s: 1, links: [5] },
    { name: 'Gospel', year: 1930, s: 2, links: [6] },
    { name: 'Honky Tonk', year: 1940, s: 3, links: [7] },
    { name: 'Rhythm & Blues', year: 1945, s: 0, links: [7, 8] },
    { name: 'Rock & Roll', year: 1954, s: 4, links: [9, 10] },
    { name: 'Soul', year: 1958, s: 2, links: [11] },
    { name: 'Surf Rock', year: 1961, s: 4, links: [12] },
    { name: 'Motown', year: 1961, s: 6, links: [11] },
    { name: 'Folk Rock', year: 1965, s: 4, links: [13] },
    { name: 'Psychedelic Rock', year: 1966, s: 4, links: [14, 15] },
    { name: 'Funk', year: 1967, s: 6, links: [16, 19] },
    { name: 'Prog Rock', year: 1969, s: 4, links: [17] },
    { name: 'Hard Rock', year: 1968, s: 4, links: [17, 18] },
    { name: 'Reggae', year: 1968, s: 8, links: [20] },
    { name: 'Heavy Metal', year: 1970, s: 5, links: [21] },
    { name: 'Glam Rock', year: 1971, s: 4, links: [22] },
    { name: 'Disco', year: 1974, s: 6, links: [23, 24] },
    { name: 'Dub', year: 1973, s: 8, links: [25] },
    { name: 'Punk Rock', year: 1976, s: 4, links: [26, 27] },
    { name: 'New Wave', year: 1978, s: 6, links: [28] },
    { name: 'Hip-Hop', year: 1979, s: 7, links: [29, 30] },
    { name: 'House', year: 1984, s: 10, links: [31] },
    { name: 'Techno', year: 1985, s: 10, links: [31, 32] },
    { name: 'Hardcore Punk', year: 1980, s: 4, links: [27] },
    { name: 'Post-Punk', year: 1978, s: 4, links: [28, 33] },
    { name: 'Synthpop', year: 1980, s: 6, links: [32] },
    { name: 'Electro', year: 1982, s: 7, links: [30] },
    { name: 'Gangsta Rap', year: 1988, s: 7, links: [34] },
    { name: 'Trance', year: 1991, s: 10, links: [35] },
    { name: 'Ambient Techno', year: 1992, s: 11, links: [35] },
    { name: 'Shoegaze', year: 1990, s: 4, links: [36] },
    { name: 'Trip-Hop', year: 1993, s: 7, links: [36] },
    { name: 'Drum & Bass', year: 1993, s: 10, links: [37] },
    { name: 'Indie Rock', year: 1994, s: 4, links: [37] },
    { name: 'Dubstep', year: 2002, s: 10, links: [] },
  ].map((g, i) => ({ ...g, i }));

  const Y0 = 1850, Y1 = 2015;
  const colW = 140, rowH = 2.2;
  const worldW = SUPERS.length * colW;
  const worldH = (Y1 - Y0) * rowH + 80;

  const posOf = (g) => ({
    x: g.s * colW + colW / 2,
    y: 40 + (g.year - Y0) * rowH,
  });

  let cam = { x: worldW / 2, y: worldH * 0.45, k: 0.85 };
  let hover = null, sel = null;

  const cv = h('canvas', { style: { position: 'absolute', inset: 0, cursor: 'grab', touchAction: 'none' } });
  const panelEl = h('div', { style: { position: 'absolute', right: '16px', top: '56px', width: '300px', maxHeight: 'calc(100% - 80px)', overflow: 'auto', background: '#1e1c26f2', border: '1px solid #ffffff18', borderRadius: '12px', padding: '14px 16px', display: 'none', zIndex: 4, backdropFilter: 'blur(10px)' } });
  const zoomLab = h('div', { style: { position: 'absolute', left: '14px', bottom: '14px', background: '#0008', border: '1px solid #ffffff22', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', zIndex: 4, fontFamily: 'ui-monospace,monospace' } }, 'Zoom 0.85');

  const project = (x, y, W, H) => [(x - cam.x) * cam.k + W / 2, (y - cam.y) * cam.k + H / 2];
  const unproject = (sx, sy, W, H) => [(sx - W / 2) / cam.k + cam.x, (sy - H / 2) / cam.k + cam.y];

  const draw = () => {
    fitCanvas(cv, root);
    const g = cv.g, W = cv.W, H = cv.H;
    g.fillStyle = '#16141c'; g.fillRect(0, 0, W, H);

    // decade lines
    for (let y = 1860; y <= 2010; y += 10) {
      const yy = 40 + (y - Y0) * rowH;
      const [, py] = project(0, yy, W, H);
      g.strokeStyle = y % 20 === 0 ? '#ffffff22' : '#ffffff10';
      g.lineWidth = y % 20 === 0 ? 1.2 : 0.6;
      g.beginPath(); g.moveTo(0, py); g.lineTo(W, py); g.stroke();
      if (cam.k > 0.55 && y % 20 === 0) {
        g.fillStyle = '#ffffff55'; g.font = '11px ui-monospace,monospace';
        g.fillText(String(y), 10, py - 4);
      }
    }

    // super-genre bands
    SUPERS.forEach((S, i) => {
      const [x0] = project(i * colW, 0, W, H);
      const [x1] = project((i + 1) * colW, 0, W, H);
      g.fillStyle = S.color + '18';
      g.fillRect(x0, 0, Math.max(2, x1 - x0), H);
      if (cam.k < 1.15) {
        g.fillStyle = S.color;
        g.font = `700 ${Math.max(10, 12 * cam.k)}px Inter Variable,sans-serif`;
        g.save();
        g.translate((x0 + x1) / 2, 28);
        g.fillText(S.name, -g.measureText(S.name).width / 2, 0);
        g.restore();
      }
    });

    // links
    const linkAlpha = cam.k < 0.7 ? 0.08 : 0.28;
    GENRES.forEach((a) => {
      const pa = posOf(a);
      a.links.forEach((bi) => {
        const b = GENRES[bi]; if (!b) return;
        const pb = posOf(b);
        const [ax, ay] = project(pa.x, pa.y, W, H);
        const [bx, by] = project(pb.x, pb.y, W, H);
        const hi = hover && (hover.i === a.i || hover.i === b.i || (hover.links || []).includes(a.i) || a.links.includes(hover.i));
        g.strokeStyle = hi ? '#ffd166cc' : `rgba(255,255,255,${linkAlpha})`;
        g.lineWidth = hi ? 2 : 1;
        g.beginPath(); g.moveTo(ax, ay); g.bezierCurveTo(ax, (ay + by) / 2, bx, (ay + by) / 2, bx, by); g.stroke();
      });
    });

    // nodes
    GENRES.forEach((ge) => {
      const p = posOf(ge);
      const [x, y] = project(p.x, p.y, W, H);
      if (x < -40 || y < -40 || x > W + 40 || y > H + 40) return;
      const col = SUPERS[ge.s].color;
      const hi = hover?.i === ge.i || sel?.i === ge.i;
      const r = hi ? 6.5 : 4.5;
      g.beginPath(); g.arc(x, y, r, 0, 7);
      g.fillStyle = col; g.fill();
      if (hi) { g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.stroke(); }
      if (cam.k > 0.75 || hi) {
        g.fillStyle = hi ? '#fff' : '#ffffffcc';
        g.font = `${hi ? 700 : 500} ${Math.max(9, 11 * Math.min(cam.k, 1.4))}px Inter Variable,sans-serif`;
        g.fillText(ge.name, x + 8, y + 3);
      }
    });

    zoomLab.textContent = `Zoom ${cam.k.toFixed(2)} · drag pan · wheel zoom`;
  };

  const hit = (sx, sy) => {
    const W = cv.W, H = cv.H;
    let best = null, bd = 16;
    GENRES.forEach((ge) => {
      const p = posOf(ge);
      const [x, y] = project(p.x, p.y, W, H);
      const d = Math.hypot(x - sx, y - sy);
      if (d < bd) { bd = d; best = ge; }
    });
    return best;
  };

  const openPanel = (ge) => {
    sel = ge;
    const S = SUPERS[ge.s];
    const tracks = ['Example Track A', 'Example Track B', 'Example Track C'].map((t, i) => `${t} — Artist ${String.fromCharCode(65 + (ge.i + i) % 12)}`);
    panelEl.style.display = 'block';
    panelEl.replaceChildren(
      h('div.k-row', { style: { gap: '8px', marginBottom: '8px' } },
        h('b', { style: { flex: 1, fontSize: '16px' } }, ge.name),
        h('button', { style: { background: 'none', border: 0, color: '#fff', cursor: 'pointer', fontSize: '18px' }, onclick: () => { panelEl.style.display = 'none'; sel = null; draw(); } }, '–')),
      h('div', { style: { fontSize: '12px', opacity: .7, marginBottom: '6px' } }, String(ge.year)),
      h('span', { style: { display: 'inline-block', background: S.color + '33', color: S.color, border: `1px solid ${S.color}66`, borderRadius: '999px', padding: '2px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '.04em' } }, S.name),
      h('p', { style: { fontSize: '13px', lineHeight: 1.55, opacity: .85, margin: '12px 0' } },
        `${ge.name} emerges around ${ge.year} within the ${S.name} super-genre. Stub blurb for clone practice — sociological context and sonic traits would live here on the real Carta.`),
      h('div', { style: { fontSize: '11px', opacity: .5, letterSpacing: '.08em', marginBottom: '6px' } }, 'PLAYLIST STUB'),
      ...tracks.map((t) => h('div', { style: { fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #ffffff10' } }, '♪ ', t)),
    );
    draw();
  };

  drag(cv, {
    start: () => { cv.style.cursor = 'grabbing'; },
    move: (e) => { cam.x -= e.movementX / cam.k; cam.y -= e.movementY / cam.k; draw(); },
    end: () => { cv.style.cursor = 'grab'; },
  });
  cv.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    cam.k = clamp(cam.k * factor, 0.35, 2.4);
    draw();
  }, { passive: false });
  cv.addEventListener('mousemove', (e) => {
    const p = localPos(e, cv);
    const n = hit(p.x, p.y);
    if (n?.i !== hover?.i) { hover = n; draw(); }
  });
  cv.addEventListener('click', (e) => {
    const p = localPos(e, cv);
    const n = hit(p.x, p.y);
    if (n) openPanel(n);
  });

  root.append(
    h('div.k-row', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: '44px', padding: '0 16px', background: '#121018ee', borderBottom: '1px solid #ffffff12', zIndex: 5, gap: '12px' } },
      h('b', { style: { letterSpacing: '.04em' } }, 'musicmap'),
      h('span', { style: { opacity: .45, fontSize: '12px' } }, 'Carta · genre genealogy'),
      h('span', { style: { flex: 1 } }),
      h('span', { style: { fontSize: '11px', opacity: .4 } }, 'look-alike · 12 super-genres')),
    cv, panelEl, zoomLab,
  );

  const loop = () => { draw(); requestAnimationFrame(loop); };
  // single draws on interaction; initial + rAF once for fit
  requestAnimationFrame(() => { draw(); });

  window.__demoProof = async () => {
    cam.k = 1.2; cam.x = worldW * 0.55; cam.y = worldH * 0.55; draw(); await sleep(60);
    hover = GENRES.find((g) => g.name === 'Rock & Roll'); draw(); await sleep(60);
    openPanel(GENRES.find((g) => g.name === 'House') || GENRES[24]); await sleep(60);
    cam.k = 0.5; draw(); await sleep(40); cam.k = 1.1; draw();
    return `carta zoom ${cam.k}; hovered Rock & Roll; opened House panel`;
  };
};

V['truesize-country-compare-map'] = (root, T) => {
  theme(root, T, { bg: '#d8e4ef', fg: '#1b2430', panel: '#ffffff', ac: '#e4572e', dark: false, line: '#00000014' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter Variable', system-ui, sans-serif";

  // Approximate areas (km²) for labels
  const AREA = {
    'Greenland': 2166086, 'Africa': 30370000, 'Russia': 17098246, 'Canada': 9984670,
    'United States of America': 9833517, 'China': 9596961, 'Brazil': 8515767,
    'Australia': 7692024, 'India': 3287263, 'Argentina': 2780400, 'Kazakhstan': 2724900,
    'Algeria': 2381741, 'Mexico': 1964375, 'Indonesia': 1904569, 'Sudan': 1861484,
    'Libya': 1759540, 'Iran': 1648195, 'Mongolia': 1564116, 'Peru': 1285216,
    'Chad': 1284000, 'Niger': 1267000, 'Angola': 1246700, 'Mali': 1240192,
    'South Africa': 1221037, 'Colombia': 1141748, 'Ethiopia': 1104300, 'Bolivia': 1098581,
    'Egypt': 1002450, 'Tanzania': 945087, 'Nigeria': 923768, 'Venezuela': 916445,
    'Namibia': 825615, 'Mozambique': 801590, 'Pakistan': 881913, 'Turkey': 783562,
    'Chile': 756102, 'France': 551695, 'Spain': 505992, 'Japan': 377975,
    'Germany': 357114, 'Norway': 385207, 'Sweden': 450295, 'Finland': 338145,
    'United Kingdom': 242495, 'Italy': 301340, 'South Korea': 100210, 'Iceland': 103000,
  };

  // Synthetic Africa multipolygon proxy: use union of African countries by name list
  const AFRICA_NAMES = new Set(['Algeria','Angola','Benin','Botswana','Burkina Faso','Burundi','Cameroon','Central African Rep.','Chad','Congo','Dem. Rep. Congo','Djibouti','Egypt','Equatorial Guinea','Eritrea','eSwatini','Ethiopia','Gabon','Gambia','Ghana','Guinea','Guinea-Bissau','Ivory Coast','Kenya','Lesotho','Liberia','Libya','Madagascar','Malawi','Mali','Mauritania','Morocco','Mozambique','Namibia','Niger','Nigeria','Rwanda','Senegal','Sierra Leone','Somalia','South Africa','S. Sudan','Sudan','Tanzania','Togo','Tunisia','Uganda','Zambia','Zimbabwe','W. Sahara','Côte d\'Ivoire','Congo','Central African Republic','South Sudan']);

  const byName = new Map();
  for (const f of COUNTRIES.features) {
    const n = f.properties?.name;
    if (n) byName.set(n, f);
  }

  // Build Africa as MultiPolygon feature from matching countries
  const africaPolys = [];
  for (const f of COUNTRIES.features) {
    const n = f.properties?.name;
    if (!n || !AFRICA_NAMES.has(n)) continue;
    const g = f.geometry;
    if (!g) continue;
    if (g.type === 'Polygon') africaPolys.push(g.coordinates);
    else if (g.type === 'MultiPolygon') africaPolys.push(...g.coordinates);
  }
  const AfricaFeat = { type: 'Feature', properties: { name: 'Africa' }, geometry: { type: 'MultiPolygon', coordinates: africaPolys } };

  const PRESET_NAMES = ['Greenland', 'Russia', 'Canada', 'United States of America', 'China', 'Brazil', 'Australia', 'India', 'Argentina', 'Mexico', 'Algeria', 'Kazakhstan', 'France', 'Japan', 'United Kingdom', 'South Korea', 'Iceland', 'Norway'];
  const catalog = PRESET_NAMES.filter((n) => byName.has(n)).map((n) => ({ name: n, feature: byName.get(n), area: AREA[n] || 0 }));
  catalog.unshift({ name: 'Africa', feature: AfricaFeat, area: AREA.Africa });

  // placed outlines: {name, feature, dx, dy, color, area}
  const placed = [];
  let active = -1;
  let searchQ = '';
  const COLORS = ['#e4572eaa', '#2e86abbb', '#f6ae2daa', '#8ac926aa', '#8338ecaa', '#ff006eaa'];

  const status = h('div', { style: { fontSize: '12px', opacity: .7 } }, 'Search a country, then drag its outline to compare areas.');
  const listEl = h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } });
  const search = h('input', {
    placeholder: 'Search country…',
    style: { width: '220px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #0002', background: '#fff', font: '13px Inter Variable' },
    oninput: (e) => { searchQ = e.target.value.trim().toLowerCase(); renderSuggest(); },
  });
  const suggest = h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '420px' } });

  const drop = (item) => {
    if (placed.some((p) => p.name === item.name)) { toast(item.name + ' already on map'); return; }
    placed.push({ name: item.name, feature: item.feature, dx: 0, dy: 0, color: COLORS[placed.length % COLORS.length], area: item.area });
    active = placed.length - 1;
    syncList();
    status.textContent = `${item.name} · ${(item.area / 1e6).toFixed(2)} M km² — drag to compare`;
  };

  const renderSuggest = () => {
    const hits = catalog.filter((c) => !searchQ || c.name.toLowerCase().includes(searchQ)).slice(0, 8);
    suggest.replaceChildren(...hits.map((c) => h('button.k-btn', {
      style: { padding: '5px 10px', fontSize: '12px', borderRadius: '999px' },
      onclick: () => { drop(c); search.value = ''; searchQ = ''; renderSuggest(); },
    }, c.name)));
  };

  const syncList = () => {
    listEl.replaceChildren(...placed.map((p, i) => h('button', {
      style: {
        padding: '5px 10px', borderRadius: '999px', border: i === active ? '2px solid #1b2430' : '1px solid #0002',
        background: p.color, color: '#fff', fontWeight: 700, fontSize: '11px', cursor: 'pointer',
      },
      onclick: () => { active = i; syncList(); status.textContent = `${p.name} selected · drag outline`; },
    }, `${p.name} · ${(p.area / 1e6).toFixed(1)}M`)));
  };

  const presets = h('div.k-row', { style: { gap: '8px', flexWrap: 'wrap' } },
    btn('Greenland vs Africa', () => {
      placed.length = 0;
      const g = catalog.find((c) => c.name === 'Greenland');
      const a = catalog.find((c) => c.name === 'Africa');
      if (a) drop(a);
      if (g) { drop(g); placed[placed.length - 1].dx = 80; placed[placed.length - 1].dy = 40; }
      status.textContent = 'Preset: Greenland over Africa — Mercator makes Greenland look huge; true areas differ.';
    }, 'pri'),
    btn('Russia vs Africa', () => {
      placed.length = 0;
      const r = catalog.find((c) => c.name === 'Russia');
      const a = catalog.find((c) => c.name === 'Africa');
      if (a) drop(a);
      if (r) { drop(r); placed[placed.length - 1].dx = -40; placed[placed.length - 1].dy = 60; }
      status.textContent = 'Preset: Russia vs Africa';
    }),
    btn('Clear', () => { placed.length = 0; active = -1; syncList(); status.textContent = 'Cleared.'; }),
  );

  const M = mapView(root, {
    proj: geoMercator(),
    draw: (g, proj, path, cv) => {
      g.fillStyle = '#b9d0e4';
      g.fillRect(0, 0, cv.W, cv.H);
      // ocean tint + land
      g.beginPath(); path(LAND);
      g.fillStyle = '#e7e0d2';
      g.fill();
      g.beginPath(); path(BORDERS);
      g.strokeStyle = '#00000022';
      g.lineWidth = 0.6;
      g.stroke();

      for (let i = 0; i < placed.length; i++) {
        const p = placed[i];
        g.save();
        g.translate(p.dx, p.dy);
        g.beginPath();
        path(p.feature);
        g.fillStyle = p.color;
        g.fill();
        g.strokeStyle = i === active ? '#1b2430' : '#ffffffaa';
        g.lineWidth = i === active ? 2 : 1;
        g.stroke();
        // label at centroid-ish of projected bbox
        try {
          const b = path.bounds(p.feature);
          const lx = (b[0][0] + b[1][0]) / 2;
          const ly = (b[0][1] + b[1][1]) / 2;
          g.fillStyle = '#1b2430';
          g.font = '700 12px Inter Variable';
          g.textAlign = 'center';
          g.fillText(`${p.name}`, lx, ly - 6);
          g.font = '11px Inter Variable';
          g.fillStyle = '#1b2430cc';
          g.fillText(`${(p.area / 1e6).toFixed(2)} M km²`, lx, ly + 10);
        } catch {}
        g.restore();
      }
    },
  });
  M.k = 1.05; M.x = 0; M.y = 20;

  // drag active outline (pointer on canvas when holding Alt or when an outline is active — use overlay hit via shift+drag on map for outline move)
  // Simpler: dedicated drag mode when active>=0 and user holds Space / uses "Move outline" — bind secondary drag with Alt
  let modeMove = true;
  const toggleMove = btn('Move outlines: ON', () => {
    modeMove = !modeMove;
    toggleMove.textContent = 'Move outlines: ' + (modeMove ? 'ON' : 'OFF');
    M.cv.style.cursor = modeMove ? 'move' : 'grab';
  });
  toggleMove.classList.add('pri');

  // Intercept: when modeMove and active>=0, consume drag to move outline instead of pan
  const native = M.cv;
  let moving = false;
  native.addEventListener('pointerdown', (e) => {
    if (!modeMove || active < 0 || e.button) return;
    moving = true;
    e.stopImmediatePropagation();
    try { native.setPointerCapture(e.pointerId); } catch {}
    const mv = (ev) => {
      if (!moving || active < 0) return;
      placed[active].dx += ev.movementX;
      placed[active].dy += ev.movementY;
    };
    const up = () => {
      moving = false;
      native.removeEventListener('pointermove', mv);
      native.removeEventListener('pointerup', up);
    };
    native.addEventListener('pointermove', mv);
    native.addEventListener('pointerup', up);
  }, true);

  root.append(
    h('div', {
      style: {
        position: 'absolute', left: '14px', top: '14px', zIndex: 5,
        background: '#ffffffee', border: '1px solid #00000014', borderRadius: '14px',
        padding: '14px', display: 'grid', gap: '10px', maxWidth: '460px',
        boxShadow: '0 12px 30px #1b243018',
      },
    },
      h('div.k-row', {}, h('b', {}, 'True Size-ish'), h('span', { style: { flex: 1 } }),
        h('span', { style: { fontSize: '10px', padding: '3px 8px', borderRadius: '999px', background: '#e4572e18', color: '#e4572e' } }, 'Mercator compare')),
      h('div.k-row', { style: { gap: '8px' } }, search, toggleMove),
      suggest,
      h('div.k-h', {}, 'On map'),
      listEl,
      h('div.k-h', {}, 'Presets'),
      presets,
      status,
    ),
    h('div', { style: { position: 'absolute', right: '14px', bottom: '12px', zIndex: 4, fontSize: '11px', opacity: .55, background: '#ffffffaa', padding: '4px 8px', borderRadius: '6px' } }, 'look-alike · drag outlines to expose Mercator distortion'),
  );

  renderSuggest();
  // default seed
  drop(catalog.find((c) => c.name === 'Africa'));
  const gr = catalog.find((c) => c.name === 'Greenland');
  if (gr) { drop(gr); placed[1].dx = 90; placed[1].dy = 30; }

  window.__demoProof = async () => {
    placed.length = 0;
    const a = catalog.find((c) => c.name === 'Africa');
    const g = catalog.find((c) => c.name === 'Greenland');
    const r = catalog.find((c) => c.name === 'Russia');
    if (a) drop(a);
    if (g) { drop(g); placed[placed.length - 1].dx = 70; placed[placed.length - 1].dy = 20; }
    await sleep(80);
    if (r) { drop(r); placed[placed.length - 1].dx = -30; placed[placed.length - 1].dy = 50; }
    active = placed.length - 1; syncList();
    if (active >= 0) { placed[active].dx += 40; placed[active].dy += 20; }
    await sleep(60);
    searchQ = 'japan'; search.value = 'japan'; renderSuggest();
    const j = catalog.find((c) => c.name === 'Japan');
    if (j) drop(j);
    await sleep(40);
    return `placed ${placed.map((p) => p.name).join(', ')}; drag+search exercised`;
  };
};


// ---------- citylines.co: transit history map with year playback (2026-10-05 20:00 KST)
V['citylines-transit-history-map'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#222', ac: '#2b7de9', dark: false });
  root.style.fontFamily = "'Roboto Flex Variable','Inter Variable',Arial,sans-serif";
  root.append(h('style', {}, `
    .cl{position:absolute;inset:0;display:grid;grid-template-rows:40px 1fr;font:14px/1.35 'Roboto Flex Variable',Arial,sans-serif;color:#222}
    .cl header{background:#111;color:#fff;display:flex;align-items:center;gap:12px;padding-right:20px}
    .cl header .hb{width:40px;height:40px;background:#7a96a8;display:grid;place-items:center;font-size:18px;cursor:pointer}
    .cl header .brand{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:500}.cl header .brand i{width:22px;height:22px;border:2px solid #fff;border-radius:50%;font-style:normal;display:grid;place-items:center;font-size:11px}
    .cl header .r{margin-left:auto;display:flex;gap:26px;font-size:13.5px}.cl header .r span{cursor:pointer}
    .cl .body{display:grid;grid-template-columns:270px 1fr;min-height:0}
    .cl aside{overflow:auto;padding:14px 12px 80px;border-right:1px solid #ddd;background:#fff}
    .cl aside h2{font-weight:400;font-size:20px;margin:4px 0 12px}.cl .lk{display:flex;gap:10px;font-size:12px;color:#2b7de9;margin-bottom:14px}.cl .lk span{cursor:pointer}
    .cl .yr{display:flex;border:1px solid #ccc;border-radius:3px;overflow:hidden;height:30px}.cl .yr input{all:unset;flex:1;padding:0 8px;font-size:13px}.cl .yr button{all:unset;width:30px;background:#e9e9e9;display:grid;place-items:center;cursor:pointer;color:#555;border-left:1px solid #ccc}
    .cl input[type=range]{width:100%;margin:10px 0 8px;accent-color:#888}
    .cl .bdg{display:inline-block;font-size:11px;font-weight:600;color:#fff;border-radius:3px;padding:3px 6px;margin:0 0 4px}
    .cl .sys{margin-top:14px}.cl .sys .sh{display:flex;align-items:center;gap:6px;color:#2b7de9;font-size:13px;cursor:pointer;margin:10px 0 4px}.cl .sys .sh .cv{color:#777;font-size:10px;transition:transform .2s}.cl .sys .closed .cv{transform:rotate(-90deg)}.cl .sys .closed .lines{display:none}
    .cl .ln{display:flex;align-items:center;gap:8px;font-size:12.5px;padding:3px 0 3px 18px;cursor:pointer}.cl .ln:hover{background:#f5f7fa}
    .cl .sw{display:inline-block;width:30px;height:12px;border-radius:7px;background:var(--c);position:relative;flex:none;transition:background .2s}.cl .sw::after{content:'';position:absolute;right:-2px;top:-3px;width:17px;height:17px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0006;transition:right .2s}
    .cl .ln.off .sw{background:#bbb}.cl .ln.off .sw::after{right:15px}.cl .ln.off{color:#999}
    .cl .ln small{margin-left:auto;color:#999;font-size:10.5px}
    .cl main{position:relative;overflow:hidden;background:#f3f3f1;cursor:grab}.cl main.drag{cursor:grabbing}
    .cl main svg{position:absolute;inset:0;width:100%;height:100%}
    .cl .ctl{position:absolute;right:8px;top:8px;display:flex;flex-direction:column;background:#fff;border-radius:4px;box-shadow:0 0 0 2px #0001}.cl .ctl button{all:unset;width:29px;height:29px;display:grid;place-items:center;cursor:pointer;font-size:16px;border-bottom:1px solid #ddd}
    .cl .tip{position:absolute;pointer-events:none;background:#fff;border-radius:3px;box-shadow:0 1px 6px #0004;padding:6px 9px;font-size:12px;display:none;z-index:4;white-space:nowrap}.cl .tip b{display:block}
    .cl .ck{position:absolute;left:0;right:0;bottom:0;background:#f1efe6;padding:12px 16px;font-size:13px;display:flex;align-items:center;z-index:6}.cl .ck u{color:#2b7de9;display:block}.cl .ck button{all:unset;margin-left:auto;background:#2b7de9;color:#fff;border-radius:3px;padding:7px 12px;cursor:pointer}
    .cl .bigyr{position:absolute;left:18px;bottom:66px;font:700 64px/1 'Roboto Flex Variable';color:#0000001c;font-variant-numeric:tabular-nums;pointer-events:none}
    .cl path.line{fill:none;stroke-linecap:round;stroke-linejoin:round}
  `));
  // Stylised Tokyo network (practice data: approximate opening years, hand-drawn geometry, not survey-accurate)
  const SYS = [
    ['JR East', [['Yamanote Line', '#9acd32', 1925, [[440, 120], [560, 110], [650, 150], [690, 250], [680, 360], [640, 440], [560, 500], [470, 500], [400, 450], [370, 360], [370, 250], [400, 160], [440, 120]]], ['Chuo Line', '#f15a22', 1904, [[40, 270], [200, 285], [370, 300], [470, 310], [600, 300], [690, 300]]], ['Keihin-Tohoku Line', '#00b2e5', 1914, [[620, 20], [650, 150], [700, 260], [690, 380], [650, 460], [610, 560], [580, 700]]]]],
    ['Tokyo Metro', [['Ginza Line', '#f39700', 1927, [[420, 440], [480, 400], [560, 380], [610, 330], [660, 260], [720, 200], [770, 170]]], ['Marunouchi Line', '#e60012', 1954, [[90, 330], [250, 315], [370, 300], [470, 270], [560, 230], [620, 290], [640, 360], [590, 420], [520, 380], [470, 300], [430, 210], [400, 120]]], ['Hibiya Line', '#9caeb7', 1961, [[330, 520], [420, 470], [520, 450], [600, 420], [650, 340], [700, 260], [780, 190], [860, 150]]], ['Tozai Line', '#009bbf', 1964, [[20, 220], [180, 230], [330, 240], [470, 250], [610, 330], [720, 380], [860, 400], [1000, 420]]], ['Chiyoda Line', '#00a650', 1969, [[340, 470], [430, 380], [520, 340], [590, 310], [650, 230], [710, 140], [760, 40]]], ['Yurakucho Line', '#c1a470', 1974, [[120, 40], [280, 110], [400, 180], [500, 240], [590, 330], [650, 430], [720, 520], [800, 560]]], ['Hanzomon Line', '#8f76d6', 1978, [[300, 480], [420, 420], [520, 360], [600, 330], [680, 300], [790, 280], [900, 230]]], ['Namboku Line', '#00ada9', 1991, [[340, 560], [400, 470], [450, 400], [510, 300], [560, 200], [600, 100], [620, 10]]], ['Fukutoshin Line', '#9c5e31', 2008, [[130, 60], [300, 130], [400, 170], [380, 280], [370, 380], [400, 470]]]]],
    ['Toei Subway', [['Asakusa Line', '#e85298', 1960, [[380, 640], [460, 560], [560, 500], [640, 430], [700, 330], [760, 230], [820, 190]]], ['Mita Line', '#0079c2', 1968, [[330, 600], [420, 520], [500, 420], [560, 330], [580, 230], [560, 120], [530, 20]]], ['Shinjuku Line', '#6cbb5a', 1978, [[60, 300], [220, 300], [370, 300], [480, 280], [600, 300], [720, 300], [880, 330], [1000, 340]]], ['Oedo Line', '#b6007a', 1991, [[100, 140], [230, 220], [370, 290], [400, 380], [470, 480], [560, 520], [650, 470], [700, 380], [690, 270], [620, 190], [520, 180], [430, 230], [370, 290]]]]],
    ['Rinkai / Yurikamome', [['Yurikamome', '#1a6ba8', 1995, [[600, 470], [650, 540], [720, 600], [820, 620], [880, 560]]], ['Rinkai Line', '#00418e', 1996, [[440, 640], [560, 650], [700, 640], [820, 600], [900, 520]]]]],
  ];
  const cr = (pts) => { let d = `M ${pts[0][0]} ${pts[0][1]}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`; } return d; };
  const KM_PER_UNIT = 0.034;
  const lines = []; SYS.forEach(([sys, ls]) => ls.forEach(([n, c, y, pts]) => lines.push({ sys, n, c, y, d: cr(pts), on: true })));
  const W = 1000, H = 700; const R = rng(11);
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid slice' });
  const g = s('g');
  // basemap: land, bay, river, grey street mesh, district labels
  g.append(s('rect', { x: -500, y: -500, width: 2000, height: 1700, fill: '#f2f2ef' }));
  const streets = s('g', { stroke: '#e1e1dc', 'stroke-width': 1.2, fill: 'none' }); for (let i = 0; i < 70; i++) { const x = R() * W, y = R() * H, a = R() * Math.PI, l = 60 + R() * 220; streets.append(s('path', { d: `M ${x} ${y} q ${Math.cos(a) * l / 2 + (R() - .5) * 40} ${Math.sin(a) * l / 2} ${Math.cos(a) * l} ${Math.sin(a) * l}` })); }
  [[0, 330, 1000, 360], [470, 0, 520, 700], [0, 200, 1000, 120]].forEach(([x1, y1, x2, y2]) => streets.append(s('path', { d: `M ${x1} ${y1} L ${x2} ${y2}`, stroke: '#d9d9d2', 'stroke-width': 3 })));
  g.append(streets);
  g.append(s('path', { d: 'M 640 700 C 660 600, 700 560, 760 520 C 800 480, 860 470, 900 430 C 940 390, 1000 380, 1200 380 L 1200 900 L 640 900 Z', fill: '#aad3f0' }));
  g.append(s('path', { d: 'M 700 650 l 60 -20 l 30 30 l -50 25 Z M 800 590 l 50 -15 l 20 40 l -55 10 Z M 880 520 l 40 -10 l 15 30 l -45 10 Z', fill: '#e9e9e4', stroke: '#d7d7d0' }));
  g.append(s('path', { d: 'M 760 0 C 740 120, 780 220, 760 320 C 750 380, 720 450, 730 520', stroke: '#aad3f0', 'stroke-width': 12, fill: 'none' }));
  [['新宿 Shinjuku', 300, 300], ['渋谷 Shibuya', 340, 470], ['池袋 Ikebukuro', 360, 120], ['東京 Tokyo', 620, 320], ['上野 Ueno', 640, 180], ['品川 Shinagawa', 520, 610], ['お台場 Odaiba', 780, 560], ['浅草 Asakusa', 740, 160]].forEach(([t, x, y]) => g.append(s('text', { x, y, 'font-size': 11, fill: '#9a9a92', 'font-family': 'Roboto Flex Variable,sans-serif' }, t)));
  const lg = s('g'), stg = s('g'); g.append(lg, stg); svg.append(g);
  lines.forEach((L) => { L.casing = s('path', { d: L.d, class: 'line', stroke: '#fff', 'stroke-width': 7.5 }); L.el = s('path', { d: L.d, class: 'line', stroke: L.c, 'stroke-width': 4.5 }); L.hit = s('path', { d: L.d, class: 'line', stroke: 'transparent', 'stroke-width': 16, style: 'cursor:pointer' }); lg.append(L.casing, L.el, L.hit); });
  const main = h('main', {}, svg); const tip = h('div.tip'); main.append(tip);
  const bigyr = h('div.bigyr'); main.append(bigyr);
  requestAnimationFrame(() => lines.forEach((L) => { L.len = L.el.getTotalLength(); L.km = L.len * KM_PER_UNIT; for (const p of [L.el, L.casing]) { p.style.strokeDasharray = L.len; p.style.strokeDashoffset = L.len; } L.st = []; const n = Math.max(4, Math.round(L.len / 55)); for (let i = 0; i <= n; i++) { const pt = L.el.getPointAtLength((L.len * i) / n); const c = s('circle', { cx: pt.x, cy: pt.y, r: 3.2, fill: '#fff', stroke: '#222', 'stroke-width': 1.4, opacity: 0, style: 'cursor:pointer' }); c._L = L; c._name = `${L.n} · Station ${i + 1}`; c._y = L.y + Math.round((i / n) * Math.min(12, 2026 - L.y)); stg.append(c); L.st.push(c); } }) || setYear(year, true));
  // sidebar
  let year = 2026, playing = false, raf = 0;
  const yIn = h('input', { value: year, onchange: () => setYear(clamp(+yIn.value || 2026, 1900, 2026)) });
  const playB = h('button', { onclick: () => toggle() }, '▶');
  const range = h('input', { type: 'range', min: 1900, max: 2026, value: year, oninput: () => { stop(); setYear(+range.value); } });
  const opB = h('span.bdg', { style: { background: '#4caf50' } }), ucB = h('span.bdg', { style: { background: '#3c4043' } }), stB = h('div', { style: { fontSize: '11px', color: '#666', marginTop: '4px' } });
  const sysEl = h('div.sys', {}, ...SYS.map(([sys]) => { const ls = lines.filter((l) => l.sys === sys); const box = h('div'); const hdr = h('div.sh', { onclick: () => box.classList.toggle('closed') }, h('span.cv', {}, '❯'), sys, h('small', { style: { marginLeft: '6px', color: '#999' } }, `${ls.length}`)); const allRow = h('div.ln', { onclick: () => { const on = !ls.every((l) => l.on); ls.forEach((l) => (l.on = on)); paintList(); setYear(year, true); } }, h('span.sw', { style: { '--c': '#999' } }), 'All the lines'); box.append(hdr, h('div.lines', {}, allRow, ...ls.map((L) => (L.row = h('div.ln', { onclick: () => { L.on = !L.on; paintList(); setYear(year, true); }, onmouseenter: () => hl(L), onmouseleave: () => hl(null) }, h('span.sw', { style: { '--c': L.c } }), L.n, h('small', {}, L.y)))))); return box; }));
  const paintList = () => lines.forEach((L) => L.row.classList.toggle('off', !L.on));
  const aside = h('aside', {}, h('h2', {}, 'Tokyo'), h('div.lk', {}, ...['Edit', 'Compare', 'Data', 'Settings', 'Share'].map((x) => h('span', { onclick: () => toast(x + ' (demo)') }, x))), h('div.yr', {}, yIn, playB), range, h('div', {}, opB), h('div', {}, ucB), stB, sysEl,
    h('div', { style: { fontSize: '10.5px', color: '#999', marginTop: '18px' } }, 'Clone-practice data: approximate opening years, stylised geometry.'));
  const hl = (L) => lines.forEach((x) => { x.el.style.opacity = !L || x === L ? 1 : 0.25; x.casing.style.opacity = !L || x === L ? 1 : 0.25; });
  const setYear = (y, instant) => {
    year = Math.round(y); yIn.value = year; range.value = year; bigyr.textContent = year;
    let km = 0, uc = 0, st = 0, open = 0;
    lines.forEach((L) => { if (L.len == null) return; const vis = L.on && L.y <= year; const building = L.on && !vis && L.y - year <= 4;
      const off = vis ? 0 : L.len; for (const p of [L.el, L.casing]) { p.style.transition = instant ? 'none' : 'stroke-dashoffset 1.1s cubic-bezier(.3,.7,.2,1)'; p.style.strokeDashoffset = off; }
      L.hit.style.display = vis ? '' : 'none';
      L.st.forEach((c) => { const sv = vis && c._y <= year; c.setAttribute('opacity', sv ? 1 : 0); if (sv) st++; });
      if (vis) { km += L.km; open++; } else if (building) uc += L.km; });
    opB.textContent = `Operative: ${Math.round(km).toLocaleString('en')} km`; ucB.textContent = `Under construction: ${Math.round(uc)} km`; stB.textContent = `${open} lines · ${st} stations`;
    return { km, st, open };
  };
  const tick = () => { if (!playing) return; if (year >= 2026) { stop(); return; } setYear(year + 1); raf = setTimeout(tick, 140); };
  const toggle = () => (playing ? stop() : play());
  const play = () => { if (year >= 2026) setYear(1900, true); playing = true; playB.textContent = '❚❚'; tick(); };
  const stop = () => { playing = false; playB.textContent = '▶'; clearTimeout(raf); };
  // hover tooltip
  const showTip = (e, html) => { const r = main.getBoundingClientRect(); tip.innerHTML = html; tip.style.display = 'block'; tip.style.left = e.clientX - r.left + 12 + 'px'; tip.style.top = e.clientY - r.top + 12 + 'px'; };
  svg.addEventListener('pointermove', (e) => { const t = e.target; if (t._L) showTip(e, `<b>${t._name}</b>opened ${t._y}`); else { const L = lines.find((l) => l.hit === t); if (L) { showTip(e, `<b style="color:${L.c}">${L.n}</b>${L.sys} · opened ${L.y} · ${L.km.toFixed(1)} km`); hl(L); } else { tip.style.display = 'none'; hl(null); } } });
  svg.addEventListener('pointerleave', () => { tip.style.display = 'none'; hl(null); });
  // pan + zoom
  let vx = 0, vy = 0, z = 1; const xf = () => g.setAttribute('transform', `translate(${vx} ${vy}) scale(${z})`);
  const zoom = (f, cx = W / 2, cy = H / 2) => { const nz = clamp(z * f, 0.7, 4); vx = cx - (cx - vx) * (nz / z); vy = cy - (cy - vy) * (nz / z); z = nz; xf(); };
  main.addEventListener('wheel', (e) => { e.preventDefault(); const r = svg.getBoundingClientRect(); const sc = Math.max(W / r.width, H / r.height); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, (e.clientX - r.left) * sc, (e.clientY - r.top) * sc); }, { passive: false });
  let p0 = null; main.addEventListener('pointerdown', (e) => { if (e.target.closest('.ctl')) return; p0 = { x: e.clientX, y: e.clientY, vx, vy }; main.classList.add('drag'); });
  addEventListener('pointermove', (e) => { if (!p0) return; const r = svg.getBoundingClientRect(); const sc = Math.max(W / r.width, H / r.height); vx = p0.vx + (e.clientX - p0.x) * sc; vy = p0.vy + (e.clientY - p0.y) * sc; xf(); });
  addEventListener('pointerup', () => { p0 = null; main.classList.remove('drag'); });
  main.append(h('div.ctl', {}, h('button', { onclick: () => zoom(1.3) }, '+'), h('button', { onclick: () => zoom(1 / 1.3) }, '−'), h('button', { onclick: () => { vx = vy = 0; z = 1; xf(); } }, '⟲')));
  const ck = h('div.ck', {}, h('div', {}, 'This website uses cookies. If you continue to use this website you accept our cookies policy.', h('u', {}, 'Information about our cookies policy')), h('button', { onclick: () => ck.remove() }, 'Accept'));
  const hdr = h('header', {}, h('div.hb', {}, '☰'), h('div.brand', {}, h('i', {}, '✲'), 'citylines.co'), h('div.r', {}, h('span', {}, 'Compare'), h('span', {}, 'Data'), h('span', {}, 'Log in')));
  root.append(h('div.cl', {}, hdr, h('div.body', {}, aside, main), ck));
  window.__demoProof = async () => {
    await sleep(50); const a = setYear(1950, true); await sleep(20); const b = setYear(1995, true); const c = setYear(2026);
    lines[0].on = false; paintList(); const d = setYear(2026, true); lines[0].on = true; paintList(); setYear(2026, true);
    play(); await sleep(450); const py = year; stop(); setYear(2026, true);
    return `1950: ${a.open} lines ${Math.round(a.km)} km → 1995: ${b.open} lines → 2026: ${c.open} lines ${Math.round(c.km)} km, ${c.st} stations; Yamanote toggle off → ${d.open}; playback reached ${py}`;
  };
};

V['cobe-globe-demo-carousel'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#111', ac: '#1f3dff', dark: false });
  const M = "'JetBrains Mono Variable',ui-monospace,monospace", BLUE = '#1f3dff';
  root.classList.add('scroll'); Object.assign(root.style, { overflow: 'auto', background: '#fff', color: '#222', fontFamily: M });
  root.append(h('style', {}, `.cb-lab{position:absolute;transform:translate(-50%,-100%);font:600 9px ${M};letter-spacing:.08em;padding:4px 6px;white-space:nowrap;pointer-events:none;transition:opacity .2s}.cb-lab:after{content:'';position:absolute;left:50%;bottom:-6px;width:5px;height:5px;border-radius:50%;background:${BLUE};transform:translateX(-50%)}.cb-arcl{position:absolute;transform:translate(-50%,-50%);font:600 8.5px ${M};letter-spacing:.08em;padding:4px 6px;background:#fff;color:${BLUE};box-shadow:0 1px 6px #0002;white-space:nowrap;pointer-events:none}.cb-nav{width:30px;height:30px;border:1px solid #ccc;background:#fff;cursor:pointer;font:14px ${M};color:#333}.cb-nav:hover{border-color:${BLUE};color:${BLUE}}.cb-tab{font:10px ${M};padding:6px 10px;cursor:pointer;color:#b8c3ff;letter-spacing:.04em}.cb-tab.on{color:#fff}.cb-lnk{color:${BLUE};text-decoration:none;cursor:pointer}.cb-lnk:hover{text-decoration:underline}`));
  // land mask -> dot list (equal-area-ish sampling)
  const mask = document.createElement('canvas'); mask.width = 720; mask.height = 360; const mx = mask.getContext('2d');
  mx.fillStyle = '#000'; mx.beginPath(); geoPath(geoEquirectangular().scale(720 / (2 * Math.PI)).translate([360, 180]), mx)(LAND); mx.fill();
  const md = mx.getImageData(0, 0, 720, 360).data; const DOTS = []; const inv = md[((180 - 20) * 720 + (360 + 40)) * 4 + 3] < 100; // Chad (20E,10N) must be land; flip if winding inverted
  for (let lat = -58; lat <= 82; lat += 1.55) { const step = 1.55 / Math.max(0.2, Math.cos((lat * Math.PI) / 180)); for (let lon = -180; lon < 180; lon += step) { const x = Math.floor(((lon + 180) / 360) * 720), y = Math.floor(((90 - lat) / 180) * 360); if ((md[(y * 720 + x) * 4 + 3] > 100) !== inv) DOTS.push([lon, lat]); } }
  const PL = { sf: ['SAN FRANCISCO', -122.42, 37.77], ny: ['NEW YORK', -74, 40.71], sp: ['SÃO PAULO', -46.63, -23.55], tk: ['TOKYO', 139.69, 35.69], ld: ['LONDON', -0.13, 51.5], sy: ['SYDNEY', 151.2, -33.87], sl: ['SEOUL', 126.98, 37.57], lg: ['LAGOS', 3.38, 6.52], mb: ['MUMBAI', 72.88, 19.08] };
  const DEMOS = [
    { n: 'COBE V2', labels: ['sf', 'ny', 'sp'], arcs: [['sf', 'tk', 'SF → TOKYO'], ['ny', 'ld', 'NYC → LONDON']], ring: true, word: true },
    { n: 'STICKERS', stickers: { sf: '🌉', ny: '🗽', ld: '💂', tk: '🗼', sy: '🦘', sp: '⚽' } },
    { n: 'LABELS', labels: ['sf', 'ny', 'ld', 'tk', 'sl', 'sp'] },
    { n: 'FLIGHTS', arcs: [['sf', 'tk', 'SFO → HND'], ['ny', 'ld', 'JFK → LHR'], ['ld', 'mb', 'LHR → BOM'], ['sp', 'lg', 'GRU → LOS']], planes: true },
    { n: 'PULSE', pulse: ['sf', 'ny', 'ld', 'tk', 'sy', 'sp', 'lg', 'mb', 'sl'] },
    { n: 'WEATHER', weather: { sf: '☀ 18°', ny: '☁ 12°', ld: '☂ 9°', tk: '☀ 21°', sy: '⛅ 24°', sp: '☂ 26°' } },
    { n: 'DARK', dark: true, labels: ['ny', 'ld'], ring: true },
    { n: 'GLOW', glow: true, pulse: ['tk', 'sl', 'sy'] },
    { n: 'RINGS', ring: true, word: true },
    { n: 'SATELLITE', sat: true },
    { n: 'HEATMAP', heat: true },
    { n: 'MONO', mono: true, labels: ['sf', 'tk'] },
    { n: 'SUNRISE', sun: true, pulse: ['ld', 'lg'] },
  ];
  let di = 0; const st = { lam: 72, phi: -18, v: 0.18, vy: 0 }, W = 560, Hh = 460, cx = W / 2, cy = Hh / 2 - 6, R = 150;
  const cv = h('canvas', { width: W * 2, height: Hh * 2, style: { width: W + 'px', height: Hh + 'px', display: 'block', cursor: 'grab', touchAction: 'none' } }); const g = cv.getContext('2d'); g.scale(2, 2);
  const layer = h('div', { style: { position: 'absolute', inset: 0, pointerEvents: 'none' } });
  const word = h('div', { style: { position: 'absolute', left: '50%', top: cy + 'px', transform: 'translate(-50%,-50%)', font: `300 64px ${M}`, letterSpacing: '.12em', color: 'transparent', WebkitTextStroke: `1.2px ${BLUE}`, backgroundImage: `repeating-linear-gradient(0deg, ${BLUE} 0 1.5px, transparent 1.5px 4px)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', pointerEvents: 'none', transition: 'opacity .3s' } }, 'COBE');
  const stage = h('div', { style: { position: 'relative', width: W + 'px', height: Hh + 'px', margin: '28px auto 0' } }, cv, word, layer);
  let dragging = false, lx = 0, ly = 0;
  drag(cv, { start: (e) => { dragging = true; lx = e.clientX; ly = e.clientY; st.v = 0; cv.style.cursor = 'grabbing'; }, move: (e) => { const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; st.lam += dx * 0.35; st.phi = clamp(st.phi - dy * 0.25, -60, 60); st.v = dx * 0.35; st.vy = -dy * 0.25; }, end: () => { dragging = false; cv.style.cursor = 'grab'; } });
  const proj = geoOrthographic().clipAngle(90).translate([cx, cy]);
  const labEls = {}; const arcEls = [];
  const ringTxt = 'THE 5KB GLOBE LIB · THE 5KB GLOBE LIB · THE 5KB GLOBE LIB · ';
  let t0 = performance.now();
  const frame = (now) => {
    if (!root.isConnected) return; const t = (now - t0) / 1000, D = DEMOS[di];
    if (!dragging) { st.lam += st.v; st.v += (0.18 - st.v) * 0.02; st.phi += st.vy; st.vy *= 0.92; st.phi += (-18 - st.phi) * 0.004; }
    proj.rotate([st.lam, st.phi]).scale(R); const ctr = [-st.lam, -st.phi];
    g.clearRect(0, 0, W, Hh);
    const dark = !!D.dark; const dotC = D.mono ? '#1f3dff' : dark ? '#e8ecff' : '#111';
    // halo + sphere
    const halo = g.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.28); halo.addColorStop(0, D.glow ? '#7d8dff66' : dark ? '#1f3dff33' : '#00000012'); halo.addColorStop(1, '#0000'); g.fillStyle = halo; g.beginPath(); g.arc(cx, cy, R * 1.28, 0, 7); g.fill();
    const sph = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R * 1.02); if (dark) { sph.addColorStop(0, '#2a2f45'); sph.addColorStop(1, '#0b0d16'); } else if (D.sun) { sph.addColorStop(0, '#fff6e6'); sph.addColorStop(1, '#f2d7c2'); } else { sph.addColorStop(0, '#ffffff'); sph.addColorStop(0.7, '#f4f4f6'); sph.addColorStop(1, '#e2e2e6'); }
    g.fillStyle = sph; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill(); g.strokeStyle = dark ? '#3a4060' : '#ffffff'; g.lineWidth = 3; g.stroke();
    // dots
    for (let i = 0; i < DOTS.length; i++) { const p = DOTS[i]; const d = geoDistance(p, ctr); if (d > 1.52) continue; const xy = proj(p); if (!xy) continue; const f = Math.cos(d); let c = dotC; if (D.heat) { const hv = (Math.sin(p[0] * 0.07 + t) + Math.cos(p[1] * 0.09)) * 0.5; c = hv > 0.45 ? '#ff3b30' : hv > 0 ? '#ff9f0a' : '#1f3dff'; } g.globalAlpha = 0.25 + 0.75 * f; g.fillStyle = c; g.fillRect(xy[0] - 0.8, xy[1] - 0.8, 1.2 + f * 0.6, 1.2 + f * 0.6); }
    g.globalAlpha = 1;
    // ring text (tilted ellipse) — marquee ribbon
    if (D.ring) { g.font = `600 8px ${M}`; g.fillStyle = BLUE; const n = ringTxt.length; for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2 + t * 0.35; const x = cx + Math.cos(a) * R * 1.13, y = cy + Math.sin(a) * R * 0.36 + Math.cos(a) * 18; const front = Math.sin(a) > 0; g.globalAlpha = front ? 1 : 0.28; g.save(); g.translate(x, y); g.rotate(Math.atan2(Math.cos(a) * R * 0.36, -Math.sin(a) * R * 1.13) + Math.PI); g.fillText(ringTxt[k], 0, 0); g.restore(); } g.globalAlpha = 1; }
    // satellite orbit
    if (D.sat) { const a = t * 0.9; g.strokeStyle = '#1f3dff55'; g.setLineDash([2, 4]); g.beginPath(); g.ellipse(cx, cy, R * 1.25, R * 0.45, -0.4, 0, 7); g.stroke(); g.setLineDash([]); const x = cx + Math.cos(a) * R * 1.25 * Math.cos(-0.4) - Math.sin(a) * R * 0.45 * Math.sin(-0.4), y = cy + Math.cos(a) * R * 1.25 * Math.sin(-0.4) + Math.sin(a) * R * 0.45 * Math.cos(-0.4); g.fillStyle = BLUE; g.fillRect(x - 6, y - 2, 12, 4); g.fillRect(x - 2, y - 4, 4, 8); }
    // arcs
    const arcs = D.arcs || []; arcs.forEach(([a, b, lab], ai) => { const A = PL[a], B = PL[b]; const ip = geoInterpolate([A[1], A[2]], [B[1], B[2]]); g.strokeStyle = BLUE; g.lineWidth = 1.4; g.beginPath(); let pen = false, mid = null; for (let k = 0; k <= 48; k++) { const u = k / 48, pt = ip(u), alt = 1 + 0.32 * Math.sin(Math.PI * u); const vis = geoDistance(pt, ctr) < 1.57 + (alt - 1) * 1.2; const xy = proj(pt); if (!xy || !vis) { pen = false; continue; } const x = cx + (xy[0] - cx) * alt, y = cy + (xy[1] - cy) * alt; pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; if (k === 24) mid = [x, y]; } g.stroke();
      if (D.planes) { const u = (t * 0.25 + ai * 0.27) % 1, pt = ip(u), alt = 1 + 0.32 * Math.sin(Math.PI * u), xy = proj(pt); if (xy && geoDistance(pt, ctr) < 1.6) { g.fillStyle = BLUE; g.beginPath(); g.arc(cx + (xy[0] - cx) * alt, cy + (xy[1] - cy) * alt, 3, 0, 7); g.fill(); } }
      const el = arcEls[ai] || (arcEls[ai] = layer.appendChild(h('div.cb-arcl'))); el.textContent = lab; el.style.display = mid ? 'block' : 'none'; if (mid) { el.style.left = mid[0] + 'px'; el.style.top = mid[1] - 12 + 'px'; } });
    arcEls.forEach((el, i) => { if (i >= arcs.length) el.style.display = 'none'; });
    // pulses
    (D.pulse || []).forEach((k, i) => { const p = [PL[k][1], PL[k][2]]; if (geoDistance(p, ctr) > 1.5) return; const [x, y] = proj(p); const ph = (t * 0.8 + i * 0.13) % 1; g.strokeStyle = D.glow ? '#7d8dff' : BLUE; g.globalAlpha = 1 - ph; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, 3 + ph * 16, 0, 7); g.stroke(); g.globalAlpha = 1; g.fillStyle = BLUE; g.beginPath(); g.arc(x, y, 2.6, 0, 7); g.fill(); });
    if (D.sun) { const sx = cx - R * 0.95, sy = cy - R * 0.95; const sg = g.createRadialGradient(sx, sy, 0, sx, sy, 70); sg.addColorStop(0, '#ffb34788'); sg.addColorStop(1, '#ffb34700'); g.fillStyle = sg; g.beginPath(); g.arc(sx, sy, 70, 0, 7); g.fill(); }
    // HTML labels / stickers / weather pinned to positions
    const want = {}; (D.labels || []).forEach((k) => (want[k] = { t: PL[k][0], kind: 'lab' })); Object.entries(D.stickers || {}).forEach(([k, e]) => (want[k] = { t: e, kind: 'stk' })); Object.entries(D.weather || {}).forEach(([k, e]) => (want[k] = { t: `${PL[k][0]}  ${e}`, kind: 'wx' }));
    for (const k of Object.keys(PL)) { const w = want[k]; let el = labEls[k]; if (!w) { if (el) el.style.opacity = 0; continue; } if (!el) el = labEls[k] = layer.appendChild(h('div.cb-lab')); const p = [PL[k][1], PL[k][2]]; const d = geoDistance(p, ctr); const xy = proj(p); el.textContent = w.t; Object.assign(el.style, w.kind === 'stk' ? { background: 'transparent', color: '#000', fontSize: '22px', padding: 0 } : w.kind === 'wx' ? { background: '#fff', color: '#111', border: `1px solid ${BLUE}`, fontSize: '9px', padding: '4px 6px' } : { background: BLUE, color: '#fff', fontSize: '9px', padding: '4px 6px' }); el.style.opacity = d < 1.45 && xy ? 1 : 0; if (xy) { el.style.left = xy[0] + 'px'; el.style.top = xy[1] - 8 + 'px'; } }
    word.style.opacity = D.word ? 1 : 0; root.style.background = dark ? '#05060c' : '#fff'; titleEl.style.color = dark ? '#9fb0ff' : BLUE;
    requestAnimationFrame(frame);
  };
  // carousel
  const titleEl = h('div', { style: { textAlign: 'center', font: `500 11px ${M}`, letterSpacing: '.08em', color: BLUE, marginTop: '4px' } });
  const dotsRow = h('div', { style: { display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '16px' } });
  const prog = h('div', { style: { height: '2px', background: BLUE, width: '0%' } });
  const count = h('span', { style: { font: `10px ${M}`, color: '#666', minWidth: '52px', textAlign: 'center' } });
  let autoT = performance.now(); const AUTO = 7000;
  const go = (i) => { di = (i + DEMOS.length) % DEMOS.length; autoT = performance.now(); titleEl.textContent = DEMOS[di].n; count.textContent = `${di + 1} / ${DEMOS.length}`; [...dotsRow.children].forEach((d, k) => (d.style.background = k === di ? BLUE : '#d6d6dc')); };
  DEMOS.forEach((d, i) => dotsRow.append(h('span', { title: d.n, onclick: () => go(i), style: { width: '6px', height: '6px', borderRadius: '50%', cursor: 'pointer', transition: 'background .2s' } })));
  const tick = () => { if (!root.isConnected) return; const u = (performance.now() - autoT) / AUTO; if (u >= 1) go(di + 1); prog.style.width = Math.min(100, u * 100) + '%'; requestAnimationFrame(tick); };
  root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(di + 1); if (e.key === 'ArrowLeft') go(di - 1); }); root.tabIndex = 0;
  // install pill
  const CMD = { prompt: 'Add cobe@latest (https://cobe.vercel.app) to my app.', npm: 'npm i cobe', pnpm: 'pnpm add cobe', yarn: 'yarn add cobe', bun: 'bun add cobe' };
  let tab = 'prompt'; const cmdEl = h('span', { style: { flex: 1 } });
  const tabs = h('div', { style: { display: 'flex', background: BLUE, padding: '0 4px' } }, ...[['prompt', 'Copy Prompt'], ['npm', 'npm'], ['pnpm', 'pnpm'], ['yarn', 'yarn'], ['bun', 'bun']].map(([k, l]) => h('span.cb-tab', { 'data-k': k, onclick: () => setTab(k) }, l)));
  const setTab = (k) => { tab = k; cmdEl.textContent = CMD[k]; [...tabs.children].forEach((c) => c.classList.toggle('on', c.dataset.k === k)); };
  const code = h('pre', { style: { margin: '18px 0 0', font: `11.5px/1.7 ${M}`, color: '#333', background: '#f6f7ff', border: '1px solid #e1e5ff', padding: '16px 18px', overflow: 'auto' }, html: `<span style="color:${BLUE}">import</span> createGlobe <span style="color:${BLUE}">from</span> <span style="color:#0a7d3c">'cobe'</span>\n\n<span style="color:${BLUE}">const</span> globe = createGlobe(canvas, {\n  devicePixelRatio: 2, width: 1000, height: 1000,\n  phi: 0, theta: 0.3, dark: 0, diffuse: 1.2,\n  mapSamples: 16000, mapBrightness: 6,\n  baseColor: [1, 1, 1], markerColor: [0.12, 0.24, 1],\n  markers: [{ location: [37.77, -122.42], size: 0.05 }],\n  onRender: (state) => { state.phi += 0.005 },\n})` });
  root.append(stage, titleEl, dotsRow, h('div', { style: { width: '142px', height: '2px', background: '#e4e4ea', margin: '10px auto 0' } }, prog),
    h('div', { style: { display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginTop: '10px' } }, h('button.cb-nav', { onclick: () => go(di - 1), 'aria-label': 'prev' }, '←'), count, h('button.cb-nav', { onclick: () => go(di + 1), 'aria-label': 'next' }, '→')),
    h('div', { style: { textAlign: 'center', marginTop: '34px', font: `14px 'Inter Variable',sans-serif`, color: '#555' } }, 'COBE: The 5KB WebGL globe'),
    h('div', { style: { textAlign: 'center', marginTop: '14px', font: `11px 'Inter Variable',sans-serif`, color: '#aaa' } }, h('a.cb-lnk', { href: 'https://github.com/shuding/cobe', target: '_blank' }, 'GitHub'), '  /  ', h('a.cb-lnk', { href: 'https://twitter.com/shuding_', target: '_blank' }, '@shuding'), '  /  ', h('a.cb-lnk', { onclick: () => code.scrollIntoView({ behavior: 'smooth' }) }, 'Tech Details →')),
    h('div', { style: { width: '456px', margin: '30px auto 70px' } }, h('div', { style: { border: `1px solid ${BLUE}` } }, tabs, h('div', { style: { display: 'flex', alignItems: 'center', padding: '12px 12px', font: `11px ${M}`, color: '#222' } }, cmdEl, h('span', { style: { cursor: 'pointer', fontSize: '9px', color: '#666', letterSpacing: '.06em' }, onclick: () => copy(CMD[tab], 'Copied') }, 'COPY'))), code));
  setTab('prompt'); go(0); requestAnimationFrame(frame); requestAnimationFrame(tick);
  window.__demoProof = async () => { const l0 = st.lam; go(3); const c3 = count.textContent; fire(cv, 'pointerdown', 200, 200); fire(cv, 'pointermove', 260, 210); fire(cv, 'pointerup', 260, 210); await sleep(60); const spun = st.lam !== l0; setTab('pnpm'); const pn = cmdEl.textContent; setTab('prompt'); go(0); await sleep(120); const labs = layer.querySelectorAll('.cb-lab').length; return `carousel→${c3} (${DEMOS[3].n}), drag spins=${spun}, tab pnpm="${pn}", dots=${DOTS.length}, labels=${labs}; restored to 1 / 13`; };
};

V['globle-hot-cold-3d-globe-guess-game'] = (root, T) => {
  import('@fontsource/montserrat/400.css'); import('@fontsource/montserrat/500.css'); import('@fontsource/noto-sans/400.css'); import('@fontsource/noto-sans/700.css');
  theme(root, T, { bg: '#bfe6ee', fg: '#111', ac: '#1a47e5', dark: false }); root.classList.add('scroll'); root.style.overflow = 'auto';
  const MS = "'Montserrat',system-ui,sans-serif", NS = "'Noto Sans',system-ui,sans-serif";
  const ALIAS = { 'United States of America': 'United States', 'Dem. Rep. Congo': 'DR Congo', 'Dominican Rep.': 'Dominican Republic', 'Central African Rep.': 'Central African Republic', 'Eq. Guinea': 'Equatorial Guinea', 'Bosnia and Herz.': 'Bosnia and Herzegovina', 'S. Sudan': 'South Sudan', 'Solomon Is.': 'Solomon Islands', 'Falkland Is.': 'Falkland Islands', 'Fr. S. Antarctic Lands': 'French Southern Lands', 'W. Sahara': 'Western Sahara', 'N. Cyprus': 'Northern Cyprus', 'eSwatini': 'Eswatini', 'Macedonia': 'North Macedonia' };
  const norm = (x) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const EXTRA = { usa: 'United States', us: 'United States', america: 'United States', uk: 'United Kingdom', britain: 'United Kingdom', greatbritain: 'United Kingdom', drc: 'DR Congo', korea: 'South Korea', czechrepublic: 'Czechia', ivorycoast: "Côte d'Ivoire", uae: 'United Arab Emirates', burma: 'Myanmar', swaziland: 'Eswatini', holland: 'Netherlands' };
  const ICE = new Set(['Antarctica', 'Greenland', 'French Southern Lands']);
  const DESERT = new Set(['Algeria', 'Libya', 'Egypt', 'Mali', 'Niger', 'Chad', 'Mauritania', 'Western Sahara', 'Sudan', 'Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Iraq', 'Iran', 'Jordan', 'Syria', 'Afghanistan', 'Pakistan', 'Turkmenistan', 'Uzbekistan', 'Kazakhstan', 'Mongolia', 'Australia', 'Namibia', 'Botswana', 'Somalia', 'Djibouti', 'Eritrea', 'Tunisia', 'Morocco', 'Israel', 'Palestine']);
  const JUNGLE = new Set(['Brazil', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Guyana', 'Suriname', 'DR Congo', 'Congo', 'Gabon', 'Cameroon', 'Central African Republic', 'Equatorial Guinea', 'Indonesia', 'Papua New Guinea', 'Malaysia', 'Myanmar', 'Laos', 'Vietnam', 'Cambodia', 'Thailand', 'Liberia', 'Sierra Leone', 'Guinea', "Côte d'Ivoire", 'Ghana', 'Nigeria', 'Madagascar']);
  const biome = (n, lat) => ICE.has(n) ? '#eef2f3' : DESERT.has(n) ? (lat > 35 ? '#b8a578' : '#cdae7c') : JUNGLE.has(n) ? '#3f6f35' : Math.abs(lat) > 58 ? '#8e9878' : Math.abs(lat) > 45 ? '#6f8a52' : '#628c47';
  const mainPart = (f) => { if (f.geometry.type !== 'MultiPolygon') return f; const ps = f.geometry.coordinates.map((c) => ({ c, a: geoArea({ type: 'Polygon', coordinates: c }), m: geoCentroid({ type: 'Polygon', coordinates: c }) })); const big = ps.reduce((a, b) => (b.a > a.a ? b : a)); return { type: 'Feature', properties: f.properties, geometry: { type: 'MultiPolygon', coordinates: ps.filter((p) => geoDistance(p.m, big.m) < 0.2).map((p) => p.c) } }; };
  const C = COUNTRIES.features.filter((f) => f.geometry).map((f) => { const name = ALIAS[f.properties.name] || f.properties.name; const mp = mainPart(f); const cen = geoCentroid(mp); const pts = []; const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates; for (const p of polys) for (const ring of p) for (const [lo, la] of ring) { const a = (la * Math.PI) / 180, b = (lo * Math.PI) / 180; pts.push(Math.sin(a), Math.cos(a), b); } return { f, mp, name, key: norm(name), cen, pts, col: biome(name, cen[1]) }; });
  const byKey = new Map(C.map((c) => [c.key, c])); for (const [k, v] of Object.entries(EXTRA)) byKey.set(k, byKey.get(norm(v)));
  const findC = (q) => byKey.get(norm(q)) || null;
  const km = (A, B) => { if (A === B) return 0; let best = -2; const a = A.pts, b = B.pts; for (let i = 0; i < a.length; i += 3) for (let j = 0; j < b.length; j += 3) { const c = a[i] * b[j] + a[i + 1] * b[j + 1] * Math.cos(a[i + 2] - b[j + 2]); if (c > best) best = c; } return best > 0.9999999 ? 0 : Math.acos(Math.min(1, best)) * 6371; };
  const STOPS = ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'];
  const heat = (d) => { const t = clamp(1 - Math.sqrt(Math.min(d, 15000) / 15000), 0, 1) * (STOPS.length - 1); const i = Math.min(STOPS.length - 2, Math.floor(t)), u = t - i; const A = STOPS[i], B = STOPS[i + 1]; const p = (x, o) => parseInt(x.slice(o, o + 2), 16); return '#' + [1, 3, 5].map((o) => Math.round(p(A, o) + (p(B, o) - p(A, o)) * u).toString(16).padStart(2, '0')).join(''); };
  const POOL = ['Japan', 'Kenya', 'Canada', 'Peru', 'Norway', 'Vietnam', 'Egypt', 'Mexico', 'Australia', 'India', 'Turkey', 'Argentina', 'Thailand', 'Morocco', 'Poland', 'Iran', 'Chile', 'Nigeria', 'Spain', 'Mongolia', 'Indonesia', 'Colombia', 'Sweden', 'Ethiopia', 'Madagascar', 'Kazakhstan', 'Italy', 'Germany', 'South Africa', 'Brazil'];
  const DAY = Math.floor((Date.now() + 9 * 3600e3) / 864e5), DAYS = new Date(DAY * 864e5).toISOString().slice(0, 10);
  const mystery = findC(POOL[DAY % POOL.length]);
  const KS = 'tg-globle-stats', KG = 'tg-globle-day';
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  let stats = load(KS, { won: 0, streak: 0, best: 0, last: null, guessesTotal: 0 });
  let guesses = []; let won = false; let unit = 'km'; let statT = 0; let byOrder = false;
  // ---------- texture (mottled land) ----------
  const tex = document.createElement('canvas'); tex.width = tex.height = 192; { const g = tex.getContext('2d'); const N = noise2(11); const im = g.createImageData(192, 192); for (let y = 0; y < 192; y++) for (let x = 0; x < 192; x++) { const n = N(x / 9, y / 9) - 0.5, k = (y * 192 + x) * 4, c = n > 0 ? [196, 172, 118] : [34, 66, 30]; im.data[k] = c[0]; im.data[k + 1] = c[1]; im.data[k + 2] = c[2]; im.data[k + 3] = Math.min(255, Math.abs(n) * 600); } g.putImageData(im, 0, 0); }
  const drawGlobe = (cv, rot, R, halo) => { const g = cv.getContext('2d'); const W = cv.width / cv.dpr, H = cv.height / cv.dpr; g.setTransform(cv.dpr, 0, 0, cv.dpr, 0, 0); g.clearRect(0, 0, W, H); const cx = W / 2, cy = H / 2;
    const proj = geoOrthographic().clipAngle(90).translate([cx, cy]).scale(R).rotate(rot); const path = geoPath(proj, g);
    if (halo) { g.beginPath(); g.arc(cx, cy, R + 16, 0, 7); g.fillStyle = 'rgba(150,212,234,.55)'; g.fill(); }
    const oc = g.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R); oc.addColorStop(0, '#2b7fc2'); oc.addColorStop(0.7, '#135a9a'); oc.addColorStop(1, '#0a4580');
    g.beginPath(); path({ type: 'Sphere' }); g.fillStyle = oc; g.fill();
    const gm = new Map(guesses.map((x) => [x.c, x]));
    for (const c of C) { if (gm.has(c)) continue; g.beginPath(); path(c.f); g.fillStyle = c.col; g.fill(); }
    g.save(); g.beginPath(); path(LAND); g.clip(); g.globalAlpha = 0.32; g.fillStyle = cv.pat || (cv.pat = g.createPattern(tex, 'repeat')); g.fillRect(0, 0, W, H); g.restore();
    g.beginPath(); path(BORDERS); g.strokeStyle = 'rgba(40,60,30,.25)'; g.lineWidth = 0.5; g.stroke();
    for (const x of guesses) { g.beginPath(); path(x.c.f); g.fillStyle = x.col; g.fill(); g.strokeStyle = '#000'; g.lineWidth = 1.4; g.stroke(); }
    const sh = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.05, cx, cy, R * 1.02); sh.addColorStop(0, 'rgba(255,255,255,.16)'); sh.addColorStop(0.55, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(0,18,48,.42)');
    g.beginPath(); path({ type: 'Sphere' }); g.fillStyle = sh; g.fill(); };
  const mkCv = (px) => { const c = h('canvas'); c.dpr = Math.min(2, devicePixelRatio || 1); c.width = px * c.dpr; c.height = px * c.dpr; c.style.width = c.style.height = px + 'px'; return c; };
  // ---------- styles ----------
  root.append(h('style', {}, `.gb{min-height:100%;position:relative;overflow:hidden;background:linear-gradient(180deg,#86d5ee 0%,#a9def0 28%,#c4e6e2 58%,#d9e6cc 82%,#ece9d2 100%);color:#111;font:400 15px/1.55 ${NS}}
.gb-cl{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.55),rgba(255,255,255,0));filter:blur(6px);pointer-events:none}
.gb-in{position:relative;width:min(680px,calc(100% - 32px));margin:0 auto;padding:22px 0 30px}
.gb-hd{display:flex;align-items:center;border-bottom:1.5px solid #333;padding-bottom:2px}.gb-hd h1{flex:1;text-align:center;margin:0;font:400 34px/1.2 ${MS};letter-spacing:.06em;cursor:pointer}
.gb-ic{width:24px;height:24px;border-radius:50%;display:inline-block;margin-right:12px;box-shadow:inset -3px -3px 5px #0004}.gb-ib{width:30px;height:30px;border:0;background:none;cursor:pointer;display:grid;place-items:center;padding:0}
.gb h2{font:400 25px ${MS};text-align:center;margin:16px 0 18px}.gb p{margin:0 0 18px}.gb .hot{color:#d7301f;font-weight:700}
.gb-ex{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:26px 0 22px;text-align:center;font-weight:700}.gb-ex svg{display:block;margin:0 auto 6px}
.gb-mini{display:grid;justify-items:center;gap:10px;margin:40px 0 46px;font-weight:700;cursor:pointer}.gb-mini canvas{transition:transform .25s}.gb-mini:hover canvas{transform:scale(1.06)}
.gb-ft{font-size:12.5px;display:flex;justify-content:space-between;margin-top:28px}.gb-ft a{color:inherit}.gb-ft .v{color:#999;text-align:right}
.gb-row{display:flex;justify-content:center;gap:14px;margin-top:16px}.gb-row input{width:250px;height:42px;border:1px solid #777;border-radius:3px;padding:0 10px;font:400 16px ${NS};background:#fff}.gb-row button{height:42px;padding:0 20px;border:0;border-radius:4px;background:#1a47e5;color:#fff;font:700 16px ${NS};cursor:pointer}.gb-row button:active{transform:translateY(1px)}
.gb-msg{text-align:center;font-weight:700;margin:12px 0 4px;min-height:24px}.gb-msg.win{color:#15803d}
.gb-stage{position:relative;display:grid;place-items:center;margin-top:4px}.gb-stage canvas{cursor:grab;touch-action:none}.gb-stage canvas:active{cursor:grabbing}
.gb-list{width:300px;margin:10px auto 0}.gb-list h3{font:700 18px ${NS};text-align:center;margin:0 0 8px}.gb-list ul{list-style:none;margin:0;padding:0}.gb-list li{display:flex;align-items:center;gap:10px;padding:3px 0;cursor:pointer}.gb-list li i{width:18px;height:18px;border-radius:50%;border:1px solid #0006;flex:none}.gb-list li small{margin-left:auto;color:#444;font-variant-numeric:tabular-nums}
.gb-bd{text-align:center;margin:12px 0 4px;display:flex;justify-content:center;align-items:center;gap:10px}.gb-sw{display:inline-flex;align-items:center;gap:6px;font-size:13px}.gb-sw span{width:34px;height:18px;border-radius:9px;background:#7aa1f0;position:relative;cursor:pointer}.gb-sw span:after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:left .2s}.gb-sw.mi span:after{left:18px}
.gb-ord{display:flex;justify-content:center;gap:8px;font-size:14px;align-items:center}.gb-ord input{width:16px;height:16px}
.gb-mod{position:fixed;inset:var(--tg-h,38px) 0 0 0;background:#0005;display:none;place-items:center;z-index:30}.gb-mod.on{display:grid}.gb-mod>div{background:#fff;border-radius:10px;padding:22px 26px;width:360px;box-shadow:0 20px 50px #0004}.gb-mod h3{font:500 22px ${MS};text-align:center;margin:0 0 14px}.gb-mod table{width:100%;border-collapse:collapse;font-size:14px}.gb-mod td{padding:6px 0;border-bottom:1px solid #eee}.gb-mod td:last-child{text-align:right;font-weight:700;font-size:18px}.gb-mod .bt{display:flex;gap:10px;margin-top:16px}.gb-mod .bt button{flex:1;height:36px;border-radius:5px;border:1px solid #1a47e5;background:#fff;color:#1a47e5;font:700 14px ${NS};cursor:pointer}.gb-mod .bt button.p{background:#1a47e5;color:#fff}`));
  const gb = h('div.gb'); const R0 = rng(4); for (let i = 0; i < 9; i++) gb.append(h('div.gb-cl', { style: { left: R0() * 100 - 10 + '%', top: 30 + R0() * 70 + '%', width: 220 + R0() * 260 + 'px', height: 90 + R0() * 80 + 'px' } }));
  const inner = h('div.gb-in'); gb.append(inner); root.append(gb);
  const statsSvg = `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" stroke="#111" stroke-width="2"><path d="M2 19V11h5v8M7 19V3h6v16M13 19V8h6v11M1 19h20"/></svg>`;
  const gearSvg = `<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#111" d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3h-4l-.4 2.7a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.5 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1L11 21h4l.4-2.7a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg>`;
  const modal = h('div.gb-mod', { onclick: (e) => e.target === modal && modal.classList.remove('on') }); gb.append(modal);
  const showStats = () => { const avg = stats.won ? (stats.guessesTotal / stats.won).toFixed(1) : '–'; modal.replaceChildren(h('div', {}, h('h3', {}, 'Statistics'), h('table', {}, [['Games won', stats.won], ['Current streak', stats.streak], ['Max streak', stats.best], ['Avg. guesses', avg], ["Today's guesses", guesses.length]].map(([a, b]) => h('tr', {}, h('td', {}, a), h('td', {}, String(b))))), h('div.bt', {}, h('button', { onclick: () => { stats = { won: 0, streak: 0, best: 0, last: null, guessesTotal: 0 }; localStorage.setItem(KS, JSON.stringify(stats)); showStats(); } }, 'Reset'), h('button.p', { onclick: () => copy(`🌎 ${DAYS} 🌍\n🔥 ${stats.streak} | Avg. Guesses: ${avg}\n${guesses.map((x) => (x.d === 0 ? '🟥' : x.d < 2000 ? '🟧' : '🟨')).join('')} = ${guesses.length}\n\ngloble-game.com (clone)`, 'Score copied') }, 'Share')))); modal.classList.add('on'); };
  const showSettings = () => { modal.replaceChildren(h('div', {}, h('h3', {}, 'Settings'), h('div.gb-ord', { style: { justifyContent: 'space-between' } }, 'Distance unit', unitSw()), h('p', { style: { fontSize: '13px', color: '#555', margin: '14px 0 0' } }, 'Mystery country rotates daily (KST). Progress is saved in this browser (localStorage).'), h('div.bt', {}, h('button.p', { onclick: () => modal.classList.remove('on') }, 'Done')))); modal.classList.add('on'); };
  const hd = h('div.gb-hd', {}, h('span.gb-ic', { title: 'Globle: Capitals', style: { background: 'radial-gradient(circle at 35% 35%,#ffd36b,#e8582b 45%,#b0311b 70%,#3f62c9 71%,#21409b)' } }), h('span.gb-ic', { title: 'Globle: Leagues', style: { background: 'radial-gradient(circle at 35% 35%,#ffe58a,#42a3d9 40%,#2066b3 65%,#f2b02f 66%,#d56a1b)' } }),
    h('h1', { onclick: () => go('intro') }, 'GLOBLE'), h('button.gb-ib', { 'aria-label': 'Statistics', html: statsSvg, onclick: showStats }), h('button.gb-ib', { 'aria-label': 'Settings', html: gearSvg, onclick: showSettings }));
  // ---------- intro ----------
  const silo = (name, col) => { const c = findC(name); const W = 120, H = 92; const pr = geoMercator().fitSize([W, H], c.mp); return h('div', {}, h('div', { html: `<svg width="${W}" height="${H}"><path d="${geoPath(pr)(c.mp)}" fill="${col}" stroke="#000" stroke-width="1"/></svg>` }), name); };
  const miniCv = mkCv(96); let miniRot = [60, -10];
  const intro = h('div', {}, h('h2', {}, 'How to Play'),
    h('p', { html: 'Every day, there is a new Mystery Country. Your goal is to guess which country it is using as few guesses as possible. Each incorrect guess will appear on the globe with a colour indicating how close it is to the Mystery Country. The <span class="hot">hotter</span> the colour, the closer you are to the answer.' }),
    h('p', { html: 'For example, if the Mystery Country is <b>Japan</b>, then the following countries would appear with these colours if guessed:' }),
    h('div.gb-ex', {}, ['France', 'Nepal', 'Mongolia', 'South Korea'].map((n) => silo(n, heat(km(findC(n), findC('Japan')))))),
    h('p', {}, 'A new Mystery Country will be available every day!'),
    h('div.gb-mini', { onclick: () => go('game') }, miniCv, 'Click the globe to play!'),
    h('p', { style: { fontSize: '13.5px' }, html: 'Already found today\'s Mystery Country? Find the world\'s capital cities with <u>Globle: Capitals</u> or play against your friends with <u>Globle: Leagues</u>!' }));
  // ---------- game ----------
  const inp = h('input', { placeholder: 'Enter country name here', list: 'gb-dl', autocomplete: 'off', onkeydown: (e) => { if (e.key === 'Enter') submit(); } });
  const dl = h('datalist', { id: 'gb-dl' }, C.map((c) => h('option', { value: c.name })).sort((a, b) => a.value.localeCompare(b.value)));
  const msg = h('div.gb-msg'); const SZ = 560, GR = 228; const big = mkCv(SZ); let rot = [-10, -20], tween = null, R = GR;
  let dragS = null; big.addEventListener('pointerdown', (e) => { dragS = [e.clientX, e.clientY]; tween = null; big.setPointerCapture?.(e.pointerId); }); big.addEventListener('pointermove', (e) => { if (!dragS) return; const k = 0.32 * (GR / R); rot = [rot[0] + (e.clientX - dragS[0]) * k, clamp(rot[1] - (e.clientY - dragS[1]) * k, -85, 85)]; dragS = [e.clientX, e.clientY]; }); big.addEventListener('pointerup', () => (dragS = null));
  big.addEventListener('wheel', (e) => { e.preventDefault(); R = clamp(R * (e.deltaY > 0 ? 0.92 : 1.08), 150, 900); }, { passive: false });
  const listUl = h('ul'), border = h('b'), list = h('div.gb-list', { style: { display: 'none' } });
  const swEl = []; const unitSw = () => { const el = h('label.gb-sw' + (unit === 'mi' ? '.mi' : ''), {}, 'km', h('span', { onclick: () => setUnit(unit === 'km' ? 'mi' : 'km') }), 'miles'); swEl.push(el); return el; };
  const ordCb = h('input', { type: 'checkbox', onchange: () => { byOrder = ordCb.checked; drawList(); } });
  list.append(h('h3', {}, 'Closest'), listUl, h('div.gb-bd', {}, h('span', {}, 'Closest border: ', border), unitSw()), h('label.gb-ord', {}, ordCb, 'Sort by order of guesses'));
  const fmt = (d) => (unit === 'km' ? Math.round(d) : Math.round(d * 0.621371)).toLocaleString('en-US');
  const setUnit = (u) => { unit = u; swEl.forEach((el) => el.classList.toggle('mi', u === 'mi')); drawList(); };
  const drawList = () => { list.style.display = guesses.length ? '' : 'none'; const arr = byOrder ? guesses : [...guesses].sort((a, b) => a.d - b.d); listUl.replaceChildren(...arr.map((x) => h('li', { onclick: () => spinTo(x.c) }, h('i', { style: { background: x.col } }), x.c.name, h('small', {}, `${fmt(x.d)} ${unit}`)))); const m = Math.min(...guesses.map((x) => x.d)); border.textContent = guesses.length ? fmt(m) : '–'; };
  const spinTo = (c) => { const to = [-c.cen[0], clamp(-c.cen[1], -70, 70)]; const from = [...rot]; let dl0 = to[0] - from[0]; dl0 = ((dl0 + 540) % 360) - 180; tween = { from, to: [from[0] + dl0, to[1]], t0: performance.now(), dur: 1100 }; };
  const save = () => localStorage.setItem(KG, JSON.stringify({ day: DAYS, guesses: guesses.map((x) => x.c.name) }));
  const add = (c, silent) => { const d = km(c, mystery); const prev = guesses[guesses.length - 1]; guesses.push({ c, d, col: c === mystery ? '#7f0000' : heat(d) });
    if (c === mystery) { won = true; msg.className = 'gb-msg win'; msg.textContent = `🎉 The Mystery Country is ${c.name}! (${guesses.length} guesses)`; inp.disabled = true; if (!silent) { stats.won++; stats.guessesTotal += guesses.length; stats.streak = stats.last === DAY - 1 ? stats.streak + 1 : 1; stats.best = Math.max(stats.best, stats.streak); stats.last = DAY; localStorage.setItem(KS, JSON.stringify(stats)); statT = setTimeout(showStats, 1400); } }
    else { msg.className = 'gb-msg'; msg.textContent = prev ? `${c.name} is ${d < prev.d ? 'warmer' : 'cooler'}` : `${c.name} is ${d < 1500 ? 'hot' : d < 5000 ? 'warm' : 'cold'}`; }
    spinTo(c); drawList(); save(); };
  const submit = () => { const q = inp.value.trim(); if (!q || won) return; const c = findC(q); if (!c) { msg.className = 'gb-msg'; msg.textContent = `"${q}" not found in database.`; return; } if (guesses.some((x) => x.c === c)) { msg.className = 'gb-msg'; msg.textContent = `Already guessed ${c.name}!`; inp.value = ''; return; } inp.value = ''; add(c); };
  const game = h('div', {}, h('div.gb-row', {}, inp, dl, h('button', { onclick: submit }, 'Enter')), msg, h('div.gb-stage', {}, big), list);
  const foot = h('div.gb-ft', {}, h('div', {}, h('div', {}, 'by Trainwreck Labs ▦'), h('div', { style: { marginTop: '8px' } }, 'Find TWL on Discord ◉')), h('div.v', {}, h('div', { style: { color: '#111' } }, 'Have a question?'), h('u', { style: { color: '#111' } }, 'Check out the FAQ'), h('div', { style: { marginTop: '8px' } }, 'v1.10.8 (clone) · ', h('u', {}, 'Update'))));
  const body = h('div'); inner.append(hd, body, foot);
  let screen = 'intro'; const go = (sc) => { screen = sc; body.replaceChildren(sc === 'intro' ? intro : game); if (sc === 'game') setTimeout(() => inp.focus(), 50); };
  // restore today's progress
  const saved = load(KG, null); if (saved && saved.day === DAYS) for (const n of saved.guesses) { const c = findC(n); if (c && !guesses.some((x) => x.c === c)) add(c, true); }
  if (!guesses.length) msg.textContent = '';
  const loop = (now) => { if (!root.isConnected) return; if (screen === 'intro') { miniRot[0] += 0.35; drawGlobe(miniCv, miniRot, 44, false); } else { if (tween) { const u = clamp((now - tween.t0) / tween.dur, 0, 1), e = 1 - Math.pow(1 - u, 3); rot = [tween.from[0] + (tween.to[0] - tween.from[0]) * e, tween.from[1] + (tween.to[1] - tween.from[1]) * e]; if (u >= 1) tween = null; } drawGlobe(big, rot, R, true); } requestAnimationFrame(loop); };
  go('intro'); requestAnimationFrame(loop);
  window.__demoProof = async () => { const snapS = localStorage.getItem(KS), snapG = localStorage.getItem(KG); const g0 = guesses.slice(), w0 = won, rot0 = [...rot];
    go('game'); guesses = []; won = false; inp.disabled = false; const tries = ['France', 'Brazil', 'Japan', 'Mexico'].filter((n) => findC(n) !== mystery).slice(0, 3); const log = [];
    for (const n of tries) { inp.value = n; submit(); log.push(msg.textContent); await sleep(250); }
    await sleep(1000); const last = findC(tries[2]); const rotOk = Math.abs((((rot[0] + last.cen[0]) % 360) + 540) % 360 - 180) < 3;
    const listN = listUl.children.length, bd = border.textContent; setUnit('mi'); const bdMi = border.textContent; setUnit('km'); ordCb.checked = true; ordCb.dispatchEvent(new Event('change')); const firstByOrder = listUl.firstChild?.textContent; ordCb.checked = false; ordCb.dispatchEvent(new Event('change'));
    inp.value = 'Atlantis'; submit(); const bad = msg.textContent; inp.value = mystery.name; submit(); const winMsg = msg.textContent;
    await sleep(80); clearTimeout(statT); modal.classList.remove('on');
    guesses = g0; won = w0; inp.disabled = w0; rot = rot0; tween = null; msg.textContent = ''; msg.className = 'gb-msg'; drawList(); if (snapS == null) localStorage.removeItem(KS); else localStorage.setItem(KS, snapS); if (snapG == null) localStorage.removeItem(KG); else localStorage.setItem(KG, snapG); stats = load(KS, stats); go('intro');
    return `guesses ${tries.join('/')} → [${log.join(' | ')}]; globe rotated to ${last.name}=${rotOk}; Closest list=${listN}, closest border ${bd} km / ${bdMi} mi; order-sort first=${firstByOrder}; invalid → "${bad}"; win → "${winMsg}"; restored intro + localStorage`; };
};

export function mount(root, variant, opts, T) { (V[variant] || V['weather-particle-globe'])(root, T); }

