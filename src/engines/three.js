import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { h, drag, clamp, toast, sleep, noise2, fitCanvas, blip, audio, rng } from '../lib.js';
import { theme, slider, seg, select, btn, toggle } from '../kit.js';
const V = {};
function stage(el, { bg = null, ortho = false, alpha = false } = {}) {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha, preserveDrawingBuffer: true }); r.setPixelRatio(Math.min(2, devicePixelRatio)); el.append(r.domElement); Object.assign(r.domElement.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' });
  const scene = new THREE.Scene(); if (bg) scene.background = new THREE.Color(bg);
  const cam = ortho ? new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200) : new THREE.PerspectiveCamera(45, 1, 0.1, 500);
  const fit = () => { const w = el.clientWidth || 800, hh = el.clientHeight || 600; r.setSize(w, hh, false); if (ortho) { const a = w / hh, z = cam.userData.zoom || 8; Object.assign(cam, { left: -z * a, right: z * a, top: z, bottom: -z }); } else cam.aspect = w / hh; cam.updateProjectionMatrix(); };
  fit(); new ResizeObserver(fit).observe(el); const fns = []; const loop = (t) => { fns.forEach((f) => f(t / 1000)); r.render(scene, cam); requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  return { r, scene, cam, fit, on: (f) => fns.push(f) };
}
const lights = (scene, k = 1) => { scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 0.9 * k)); const d = new THREE.DirectionalLight(0xffffff, 1.6 * k); d.position.set(5, 10, 7); d.castShadow = true; d.shadow.mapSize.set(1024, 1024); scene.add(d); return d; };
V['3d-blob-param-mixer'] = (root, T) => {
  theme(root, T, { bg: '#40686a', fg: '#e8f2f0', ac: '#fff', dark: true });
  const S = stage(root, { bg: '#40686a' }); S.cam.position.set(0, 0, 9); lights(S.scene);
  const P = { speed: 0.4, spikes: 1.2, amp: 0.35, hue: 250 }; const geo = new THREE.IcosahedronGeometry(1, 48); const base = geo.attributes.position.array.slice(); const nz = noise2(3);
  const mat = new THREE.MeshPhysicalMaterial({ color: 0x5b4bd6, roughness: 0.15, metalness: 0.1, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.6 }); const m = new THREE.Mesh(geo, mat); S.scene.add(m);
  S.on((t) => { const a = geo.attributes.position.array; for (let i = 0; i < a.length; i += 3) { const x = base[i], y = base[i + 1], z = base[i + 2]; const n = nz(x * P.spikes + t * P.speed, y * P.spikes + z * P.spikes - t * P.speed); const k = 1 + (n - 0.5) * 2 * P.amp; a[i] = x * k; a[i + 1] = y * k; a[i + 2] = z * k; } geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); m.rotation.y = t * 0.2; mat.color.setHSL(P.hue / 360, 0.6, 0.5); });
  const top = h('div.k-row', { style: { position: 'absolute', top: '14px', left: '20px', right: '20px', fontSize: '12px', letterSpacing: '.05em', zIndex: 2 } }, h('span', {}, 'Blobmixer-ish'), h('span', { style: { flex: 1, textAlign: 'center', cursor: 'pointer' }, onclick: () => { P.speed = Math.random(); P.spikes = 0.5 + Math.random() * 3; P.amp = 0.1 + Math.random() * 0.6; P.hue = Math.random() * 360; } }, 'Shuffle ✦'), h('span', { style: { cursor: 'pointer' }, onclick: () => (panel.style.display = panel.style.display === 'none' ? 'grid' : 'none') }, 'Tweak'));
  const panel = h('div.k-panel', { style: { position: 'absolute', right: '20px', top: '50px', width: '240px', zIndex: 2, background: '#0003', padding: '12px', borderRadius: '10px', display: 'none', gap: '6px' } }, slider('Speed', 0, 2, P.speed, 0.01, (v) => (P.speed = v)), slider('Spikes', 0.2, 5, P.spikes, 0.01, (v) => (P.spikes = v)), slider('Amplitude', 0, 1, P.amp, 0.01, (v) => (P.amp = v)), slider('Hue', 0, 360, P.hue, 1, (v) => (P.hue = v)));
  const joy = h('div', { style: { position: 'absolute', left: '50%', bottom: '70px', width: '110px', height: '110px', marginLeft: '-55px', borderRadius: '50%', border: '1px solid #ffffff55', display: 'grid', placeItems: 'center', zIndex: 2, cursor: 'grab' } }, h('div', { style: { width: '26px', height: '26px', border: '1px solid #fff9', transform: 'rotate(45deg)' } }));
  drag(joy, { move: (e) => { P.spikes = clamp(P.spikes + e.movementX * 0.01, 0.2, 5); P.amp = clamp(P.amp - e.movementY * 0.004, 0, 1); } });
  root.append(top, panel, joy, h('div', { style: { position: 'absolute', left: '20px', bottom: '16px', fontSize: '11px', opacity: .6, zIndex: 2 } }, 'drag the dial to mix · Tweak for params'));
  S.cam.position.z = 17;
  window.__demoProof = async () => { P.amp = 0.5; await sleep(200); return 'blob displaced by noise params'; };
};
V['3d-drivable-portfolio-world'] = (root, T) => {
  theme(root, T, { bg: '#f09b54', fg: '#fff', ac: '#fff', dark: true });
  const S = stage(root, { bg: '#f5a35f' }); S.r.shadowMap.enabled = true; const d = lights(S.scene, 0.9); d.shadow.camera.left = d.shadow.camera.bottom = -30; d.shadow.camera.right = d.shadow.camera.top = 30;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0xf3a15a })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; S.scene.add(ground);
  const box = (w, hh, dd, c, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, dd), new THREE.MeshStandardMaterial({ color: c })); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; S.scene.add(m); return m; };
  const car = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 1.2), new THREE.MeshStandardMaterial({ color: 0xffffff })); body.position.y = 0.6; body.castShadow = true; car.add(body); const cab = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), new THREE.MeshStandardMaterial({ color: 0x333333 })); cab.position.set(-0.2, 1.1, 0); car.add(cab); [[-0.7, 0.6], [0.7, 0.6], [-0.7, -0.6], [0.7, -0.6]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.25, 16), new THREE.MeshStandardMaterial({ color: 0x222 })); w.rotation.x = Math.PI / 2; w.position.set(x, 0.3, z); car.add(w); }); S.scene.add(car);
  const props = []; for (let i = 0; i < 30; i++) { const b = box(1, 1, 1, [0xffffff, 0xe0664a, 0x4a7de0][i % 3], (Math.random() - 0.5) * 60, 0.5, (Math.random() - 0.5) * 60); b.userData.v = new THREE.Vector3(); props.push(b); }
  const txt = (s, x, z) => { const c = document.createElement('canvas'); c.width = 512; c.height = 128; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.font = '900 90px Inter,sans-serif'; g.fillText(s, 10, 100); const m = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.02, z); S.scene.add(m); };
  txt('PORTFOLIO-ish', -3, -6); txt('PROJECTS', 10, 4); txt('CONTACT', -12, 8);
  const K = {}; addEventListener('keydown', (e) => (K[e.key.toLowerCase()] = true)); addEventListener('keyup', (e) => (K[e.key.toLowerCase()] = false)); let sp = 0, ang = 0;
  S.on(() => { const f = (K.w || K.arrowup ? 1 : 0) - (K.s || K.arrowdown ? 1 : 0); sp = sp * 0.95 + f * 0.02; if (Math.abs(sp) > 0.01) ang += ((K.a || K.arrowleft ? 1 : 0) - (K.d || K.arrowright ? 1 : 0)) * 0.04 * Math.sign(sp); car.rotation.y = ang; car.position.x += Math.cos(ang) * sp; car.position.z -= Math.sin(ang) * sp; props.forEach((p) => { const dx = p.position.x - car.position.x, dz = p.position.z - car.position.z; if (dx * dx + dz * dz < 2.2) p.userData.v.set(dx * Math.abs(sp) * 2, 0.2, dz * Math.abs(sp) * 2); p.position.add(p.userData.v); p.userData.v.multiplyScalar(0.9); p.rotation.y += p.userData.v.length(); }); S.cam.position.set(car.position.x + 10, 12, car.position.z + 10); S.cam.lookAt(car.position); });
  root.append(h('div', { style: { position: 'absolute', left: '20px', bottom: '20px', zIndex: 2, fontSize: '13px', fontWeight: 700 } }, 'WASD / ↑↓←→ to drive · bump the crates'), h('div.k-row', { style: { position: 'absolute', right: '20px', bottom: '20px', zIndex: 2, gap: '6px' } }, ...[['▲', 'w'], ['◀', 'a'], ['▼', 's'], ['▶', 'd']].map(([l, k]) => h('button', { style: { width: '42px', height: '42px', borderRadius: '8px', border: '2px solid #fff', background: '#fff3', color: '#fff' }, onpointerdown: () => (K[k] = true), onpointerup: () => (K[k] = false), onpointerleave: () => (K[k] = false) }, l))));
  window.__demoProof = async () => { K.w = true; await sleep(500); K.w = false; return 'car drove to x=' + car.position.x.toFixed(1); };
};
V['voxel-model-editor-workspace'] = (root, T) => {
  theme(root, T, { bg: '#21252b', fg: '#cdd3de', ac: '#3e90ff', dark: true });
  const menu = h('div.k-row', { style: { height: '28px', background: '#1b1e23', fontSize: '12px', padding: '0 10px', gap: '14px' } }, h('b', { style: { color: '#3e90ff' } }, '⬛ Blockbench-ish'), '파일', '편집', '보기', '도구', '도움말');
  const tabs = h('div.k-row', { style: { height: '28px', background: '#282c34', fontSize: '12px', padding: '0 10px' } }, h('span', { style: { background: '#21252b', padding: '6px 12px' } }, '🏠 시작 화면'));
  const body = h('div', { style: { position: 'absolute', top: '56px', left: 0, right: 0, bottom: 0, overflow: 'auto' } });
  const start = h('div', { style: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' } }, h('div', { style: { height: '300px', background: 'linear-gradient(135deg,#4d3a2a,#8b5a3a 40%,#2e4b5e)', position: 'relative', overflow: 'hidden', borderRadius: '2px' } }, ...Array.from({ length: 40 }, (_, i) => h('div', { style: { position: 'absolute', left: (i * 97) % 1000 + 'px', top: (i * 53) % 280 + 'px', width: 20 + (i % 5) * 14 + 'px', height: 20 + (i % 4) * 16 + 'px', background: ['#c4874f', '#6fb3b8', '#e8c07a', '#7b4b2a', '#d65f4a'][i % 5], opacity: .8 } })), h('div', { style: { position: 'absolute', right: '10px', bottom: '8px', fontSize: '11px', background: '#0008', padding: '2px 6px' } }, 'Splash art: voxel tavern')), h('div', { style: { background: '#282c34', padding: '16px', marginTop: '8px' } }, h('h3', { style: { margin: '0 0 12px' } }, '빠른 설정'), h('div.k-row', { style: { gap: '20px', fontSize: '12px' } }, '키 배열', select(['기본 (QWERTY)', 'AZERTY'], '기본 (QWERTY)', () => {}), '언어', select(['한국어', 'English'], '한국어', () => {}))), h('div', { style: { background: '#282c34', padding: '16px', marginTop: '8px' } }, h('h3', { style: { margin: '0 0 12px' } }, '새 모델'), h('div.k-row', { style: { gap: '10px' } }, ...['Generic Model', 'Java Block/Item', 'Bedrock Model', 'Voxel Sculpt'].map((n) => h('button', { style: { background: '#3a3f4b', color: '#cdd3de', border: 0, padding: '14px 18px', cursor: 'pointer' }, onclick: () => editor(n) }, '＋ ' + n)))));
  body.append(start); root.append(menu, tabs, body);
  const editor = (n) => { tabs.append(h('span', { style: { background: '#21252b', padding: '6px 12px', color: '#fff' } }, '🧊 ' + n)); body.replaceChildren(); const vp = h('div', { style: { position: 'absolute', left: '200px', right: '240px', top: 0, bottom: 0 } }); const tools = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '200px', background: '#282c34', padding: '10px', fontSize: '12px', display: 'grid', alignContent: 'start', gap: '8px' } }, h('b', {}, '도구'), seg([['add', '＋ 추가'], ['del', '－ 삭제'], ['paint', '🖌 칠하기']], 'add', (v) => (mode = v))); const pal = ['#e8c07a', '#c4874f', '#6fb3b8', '#d65f4a', '#7bc96f', '#ffffff', '#3a3a3a']; let col = pal[0], mode = 'add'; tools.append(h('div.k-row', { style: { flexWrap: 'wrap', gap: '4px' } }, ...pal.map((c) => h('span', { style: { width: '22px', height: '22px', background: c, cursor: 'pointer', outline: '1px solid #000' }, onclick: () => (col = c) })))); const out = h('div', { style: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '240px', background: '#282c34', padding: '10px', fontSize: '12px' } }, h('b', {}, '아웃라이너')); const list = h('div'); out.append(list); body.append(tools, vp, out);
    const S = stage(vp, { bg: '#1e2127' }); lights(S.scene); S.cam.position.set(10, 10, 12); const oc = new OrbitControls(S.cam, S.r.domElement); S.scene.add(new THREE.GridHelper(16, 16, 0x555555, 0x333333)); const vox = []; const g1 = new THREE.BoxGeometry(1, 1, 1);
    const add = (x, y, z, c) => { const m = new THREE.Mesh(g1, new THREE.MeshStandardMaterial({ color: c })); m.position.set(x + 0.5, y + 0.5, z + 0.5); S.scene.add(m); vox.push(m); list.textContent = `cubes: ${vox.length}`; };
    for (let x = -2; x < 2; x++) for (let z = -2; z < 2; z++) add(x, 0, z, pal[(x + z + 8) % 3]); add(0, 1, 0, pal[3]);
    const ray = new THREE.Raycaster(); const plane = new THREE.Mesh(new THREE.PlaneGeometry(16, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ visible: false })); S.scene.add(plane);
    S.r.domElement.addEventListener('click', (e) => { const b = S.r.domElement.getBoundingClientRect(); ray.setFromCamera({ x: ((e.clientX - b.left) / b.width) * 2 - 1, y: -((e.clientY - b.top) / b.height) * 2 + 1 }, S.cam); const hit = ray.intersectObjects([...vox, plane])[0]; if (!hit) return; if (hit.object === plane) { if (mode === 'add') add(Math.floor(hit.point.x), 0, Math.floor(hit.point.z), col); return; } if (mode === 'del') { S.scene.remove(hit.object); vox.splice(vox.indexOf(hit.object), 1); } else if (mode === 'paint') hit.object.material.color.set(col); else { const p = hit.object.position.clone().add(hit.face.normal); add(p.x - 0.5, p.y - 0.5, p.z - 0.5, col); } list.textContent = `cubes: ${vox.length}`; });
    window.__voxCount = () => vox.length; };
  window.__demoProof = async () => 'start screen with 새 모델 → voxel editor';
};
V['gltf-material-lighting-studio'] = (root, T) => {
  theme(root, T, { bg: '#f0f0f0', fg: '#222', ac: '#3a7bd5', dark: false });
  const vp = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, right: '300px' } }); const S = stage(vp, { bg: '#f0f0f0' }); lights(S.scene); S.cam.position.set(3, 2, 4); new OrbitControls(S.cam, S.r.domElement);
  const hint = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', pointerEvents: 'none', zIndex: 2 } }, h('div', {}, h('div', { style: { fontSize: '20px' } }, 'Drag a glTF or GLB here!'), h('div', { style: { fontSize: '12px', opacity: .7, marginTop: '6px' } }, 'Drop an HDR for lighting · or "Load sample" →')));
  vp.append(hint); let model = null; const mat = new THREE.MeshStandardMaterial({ color: 0xc0a080, metalness: 0.5, roughness: 0.3 });
  const setModel = (o) => { if (model) S.scene.remove(model); model = o; S.scene.add(o); hint.hidden = true; code.textContent = `<model-viewer-ish src="model.glb"\n  exposure="${P.exp}" shadow-intensity="1"\n  camera-controls auto-rotate>\n</model-viewer-ish>`; };
  const P = { exp: 1, rough: 0.3, metal: 0.5, rot: true }; S.on((t) => { S.r.toneMappingExposure = P.exp; if (model && P.rot) model.rotation.y = t * 0.4; });
  S.r.toneMapping = THREE.ACESFilmicToneMapping;
  vp.addEventListener('dragover', (e) => e.preventDefault()); vp.addEventListener('drop', (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (!f) return; new GLTFLoader().load(URL.createObjectURL(f), (g) => setModel(g.scene), undefined, () => toast('Could not load file')); });
  const sec = (t, ...c) => h('div', { style: { borderBottom: '1px solid #333' } }, h('div.k-row', { style: { padding: '8px 12px', fontSize: '12px', fontWeight: 700, background: '#2a2a2a' } }, t, h('span', { style: { flex: 1 } }), '▾'), h('div', { style: { padding: '10px 12px', display: 'grid', gap: '8px' } }, ...c));
  const code = h('pre', { style: { background: '#fff', color: '#222', fontSize: '10px', padding: '8px', margin: 0, whiteSpace: 'pre-wrap' } }, '<model-viewer-ish src="">\n</model-viewer-ish>');
  const side = h('div', { style: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '300px', background: '#1f1f1f', color: '#ddd', overflow: 'auto', fontSize: '12px' } }, h('div.k-row', { style: { padding: '12px', justifyContent: 'center', gap: '8px', fontSize: '14px' } }, '◉', h('b', {}, '<model-viewer-ish>')), h('div.k-row', { style: { justifyContent: 'space-around', padding: '6px', background: '#2a2a2a' } }, '✎', '▣', '◈', '⚲'), sec('Model-viewer snippet', code, btn('Copy code', () => toast('copied'), 'pri')), sec('File manager', btn('Load sample', () => setModel(new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.28, 200, 32), mat)), 'pri'), h('div', { style: { opacity: .7 } }, 'Or drag a .glb onto the viewport')), sec('Lighting', slider('Exposure', 0, 3, 1, 0.01, (v) => (P.exp = v)), slider('Roughness', 0, 1, 0.3, 0.01, (v) => (mat.roughness = v)), slider('Metalness', 0, 1, 0.5, 0.01, (v) => (mat.metalness = v))), sec('Edit Properties', toggle('Auto-rotate', true, (v) => (P.rot = v))));
  root.append(vp, side);
  window.__demoProof = async () => 'empty viewport with drop target; Load sample shows PBR model';
};
V['origami-crease-fold-studio'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#222', ac: '#e0187f', dark: false });
  root.append(h('div.k-row', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: '30px', background: '#333', color: '#fff', fontSize: '12px', padding: '0 12px', gap: '18px', zIndex: 2 } }, h('b', {}, '🦢'), 'File ▾', 'Examples ▾', 'View ▾', 'Folders', h('span', { style: { background: '#666', padding: '4px 8px' } }, 'Animation'), 'About', h('span', { style: { flex: 1 } }), h('span', { style: { opacity: .8 } }, 'Origami Simulator-ish')));
  const vp = h('div', { style: { position: 'absolute', top: '30px', left: 0, right: 0, bottom: '90px' } }); root.append(vp);
  const S = stage(vp, { bg: '#ffffff' }); lights(S.scene); S.cam.position.set(-2, 6, 8); new OrbitControls(S.cam, S.r.domElement);
  const N = 24, M = 18; let fold = 0.6, pattern = 'miura';
  const geo = new THREE.BufferGeometry(); const pos = new Float32Array(N * M * 6 * 3); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xe0187f, side: THREE.DoubleSide, flatShading: true, roughness: 0.6 })); S.scene.add(mesh); const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x7a0a45 })); S.scene.add(edges);
  const vert = (i, j) => { const f = fold * Math.PI / 2.2; const a = 0.45, b = 0.4; const x = (i - N / 2) * a * Math.cos(f * 0.6); const z = (j - M / 2) * b + (pattern === 'miura' && i % 2 ? 0.2 * Math.cos(f) : 0); const y = (pattern === 'miura' ? (j % 2 ? 1 : -1) * (i % 2 ? 1 : 0) : (i + j) % 2 ? 1 : -1) * 0.25 * Math.sin(f) - (x * x + (z * z) * 0.6) * 0.07 * fold; return [x, y, z]; };
  const upd = () => { let k = 0; for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const A = vert(i, j), B = vert(i + 1, j), C = vert(i + 1, j + 1), D = vert(i, j + 1); for (const p of [A, B, C, A, C, D]) { pos[k++] = p[0]; pos[k++] = p[1]; pos[k++] = p[2]; } } geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); edges.geometry.dispose(); edges.geometry = new THREE.EdgesGeometry(geo, 1); };
  upd();
  const lbl = h('output', {}, Math.round(fold * 100) + '%');
  root.append(h('div.k-row', { style: { position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', gap: '30px', fontSize: '11px', textAlign: 'center' } }, h('div', {}, seg([['miura', 'Miura-ori'], ['water', 'Waterbomb']], 'miura', (v) => { pattern = v; upd(); }), h('div', {}, 'Crease Pattern')), h('div', {}, h('div.k-row', {}, 'Flat', h('input', { type: 'range', min: 0, max: 100, value: fold * 100, style: { width: '240px' }, oninput: (e) => { fold = e.target.value / 100; lbl.textContent = e.target.value + '%'; upd(); } }), 'Folded', lbl), h('div', {}, 'Fold Percent')), h('div', {}, btn('Reset', () => { S.cam.position.set(0, 7, 9); S.cam.lookAt(0, 0, 0); }), h('div', {}, 'Camera'))));
  window.__demoProof = async () => { fold = 0.8; upd(); return 'mesh folded 80%'; };
};
V['isometric-cutaway-room-studio'] = (root, T) => {
  theme(root, T, { bg: '#0a0a0a', fg: '#eee', ac: '#e8751a', dark: true });
  const vp = h('div', { style: { position: 'absolute', inset: 0 } }); root.append(vp);
  const S = stage(vp, { bg: '#0a0a0a', ortho: true }); S.cam.userData.zoom = 6; S.fit(); S.cam.position.set(10, 9, 10); S.cam.lookAt(0, 1.2, 0); S.r.shadowMap.enabled = true;
  S.scene.add(new THREE.AmbientLight(0xffe0c0, 1.1)); const lamp = new THREE.PointLight(0xffb060, 30, 12); lamp.position.set(-1, 2.6, 1); lamp.castShadow = true; S.scene.add(lamp); const d = new THREE.DirectionalLight(0xffffff, 0.4); d.position.set(5, 8, 3); S.scene.add(d);
  const M = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }); const W = { floor: M(0x6b4a2e), wall: M(0x4a3020) };
  const box = (w, hh, dd, m, x, y, z, g = S.scene) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, hh, dd), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
  box(6, 0.2, 6, W.floor, 0, -0.1, 0); box(6, 3.5, 0.2, W.wall, 0, 1.75, -3); box(0.2, 3.5, 6, W.wall, -3, 1.75, 0);
  for (let i = 0; i < 14; i++) box(0.05, 3.5, 0.02, M(0x2a1a10), -2.8 + i * 0.42, 1.75, -2.88);
  const furn = new THREE.Group(); S.scene.add(furn);
  const SETS = { cozy: () => { box(2.4, 0.5, 1, M(0x3a3a3a), 0, 0.25, -1.8, furn); box(2.4, 0.6, 0.3, M(0x333333), 0, 0.7, -2.2, furn); box(1.2, 0.3, 0.7, M(0x5a3a22), 0, 0.15, -0.2, furn); box(1.6, 0.9, 0.05, M(0x111111), -2.85, 1.6, 0, furn); box(1.5, 0.8, 0.02, new THREE.MeshBasicMaterial({ color: 0x3aa0e8 }), -2.82, 1.6, 0, furn); box(0.2, 2.2, 0.2, M(0x222222), -2, 1.1, 1.5, furn); box(0.6, 0.4, 0.6, M(0xffcc77), -2, 2.3, 1.5, furn); box(0.4, 2.4, 1.2, M(0x3a2618), 2.5, 1.2, -2.5, furn); box(0.5, 0.9, 0.5, M(0x2d6a3a), 2.2, 0.45, 1.8, furn); box(3, 0.02, 2, M(0x8a7a6a), 0, 0.02, -0.5, furn); }, office: () => { box(2, 0.1, 1, M(0xdddddd), 0, 1, -2.2, furn); box(0.8, 0.9, 0.8, M(0x222222), 0, 0.45, -1.2, furn); box(1, 0.6, 0.05, M(0x111111), 0, 1.45, -2.5, furn); box(0.4, 2.4, 1.2, M(0x999999), 2.5, 1.2, -2.5, furn); }, empty: () => {} };
  let cur = 'cozy'; const set = (k) => { cur = k; furn.clear(); SETS[k](); }; set('cozy');
  const sw = (cs, on) => h('div.k-row', { style: { gap: '6px' } }, ...cs.map((c) => h('span', { style: { width: '22px', height: '22px', borderRadius: '4px', background: c, cursor: 'pointer', border: '1px solid #444' }, onclick: () => on(c) })));
  root.append(h('div', { style: { position: 'absolute', left: '20px', top: '16px', fontSize: '12px', opacity: .7, zIndex: 2 } }, 'Room Studio-ish'), h('div', { style: { position: 'absolute', right: '30px', top: '130px', width: '230px', background: '#1a1a1a', borderRadius: '10px', padding: '14px', display: 'grid', gap: '10px', fontSize: '12px', zIndex: 2 } }, h('div.k-row', {}, h('b', {}, 'Theme'), h('span', { style: { flex: 1 } }), h('span', { style: { background: '#e8751a', padding: '2px 8px', borderRadius: '99px' } }, 'Night')), sw(['#1a1a1a', '#555', '#999', '#ddd', '#fff'], (c) => (S.scene.background = new THREE.Color(c))), 'Walls', sw(['#4a3020', '#8a6a4a', '#d8d0c0', '#2e3e5a', '#6a2a2a'], (c) => W.wall.color.set(c)), 'Floor', sw(['#6b4a2e', '#a07850', '#444', '#ccc'], (c) => W.floor.color.set(c)), 'Furniture', seg([['cozy', 'Cozy'], ['office', 'Office'], ['empty', 'Empty']], 'cozy', set), 'Lamp', h('input', { type: 'range', min: 0, max: 60, value: 30, oninput: (e) => (lamp.intensity = +e.target.value) }), btn('Toggle day / night', () => { const n = lamp.intensity > 0; lamp.intensity = n ? 0 : 30; d.intensity = n ? 1.6 : 0.4; }, 'pri')));
  window.__demoProof = async () => { set('office'); await sleep(100); set('cozy'); return 'room furniture sets swap'; };
};

V['threejs-scene-editor-desk'] = (root, T) => {
  theme(root, T, { bg: '#c0c0c0', fg: '#222', ac: '#3d7eff', dark: false });
  root.style.display = 'grid'; root.style.gridTemplateRows = '28px 1fr 28px'; root.style.background = '#c0c0c0';
  let mode = 'translate', playing = false, tab = 'SCENE', fogOn = false, bgMode = 'DEFAULT';
  const objs = []; let selected = null; let tc = null;
  const addMenu = h('div', { style: { display: 'none', position: 'absolute', top: '24px', left: 0, background: '#eee', border: '1px solid #aaa', minWidth: '140px', zIndex: 20 } },
    ...[['Box', 'box'], ['Sphere', 'sphere'], ['Plane', 'plane'], ['DirectionalLight', 'light']].map(([lab, k]) => h('div', { style: { padding: '6px 12px', cursor: 'pointer' }, onmouseenter: (e) => (e.currentTarget.style.background = '#cde'), onmouseleave: (e) => (e.currentTarget.style.background = ''), onclick: () => addObj(k) }, lab)));
  const menu = h('div.k-row', { style: { height: '28px', background: '#ddd', fontSize: '12px', padding: '0 10px', gap: '14px', borderBottom: '1px solid #bbb' } },
    h('span', { style: { cursor: 'pointer' } }, 'File'), h('span', {}, 'Edit'),
    h('span', { style: { cursor: 'pointer', position: 'relative' }, onmouseenter: () => (addMenu.style.display = 'block'), onmouseleave: () => (addMenu.style.display = 'none') }, 'Add ▾', addMenu),
    h('span', {}, 'View'), h('span', {}, 'Help'),
    h('span', { style: { flex: 1 } }),
    h('label.k-row', { style: { gap: '4px', fontSize: '11px' } }, h('input', { type: 'checkbox', checked: true }), 'autosave'),
    h('span', { style: { opacity: .55, fontSize: '11px' } }, 'r186'));
  const body = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 300px', minHeight: 0, position: 'relative' } });
  const vp = h('div', { style: { position: 'relative', background: '#aaa', overflow: 'hidden' } });
  const S = stage(vp, { bg: '#aaaaaa' }); lights(S.scene, 0.85); S.cam.position.set(5, 4, 7); S.cam.lookAt(0, 0, 0);
  const oc = new OrbitControls(S.cam, S.r.domElement); oc.enableDamping = true;
  S.scene.add(new THREE.GridHelper(30, 30, 0x666666, 0x888888));
  const axes = new THREE.AxesHelper(1.2); axes.position.set(0, 0.01, 0); // world hint only
  // viewport chrome
  const stats = h('div', { style: { position: 'absolute', left: '8px', bottom: '8px', fontSize: '11px', color: '#fff', textShadow: '0 1px 2px #0008', lineHeight: 1.5, zIndex: 3, pointerEvents: 'none' } }, '0 objects', h('br'), '0 vertices', h('br'), '0 triangles');
  const updStats = () => {
    let v = 0, t = 0; objs.forEach((o) => { const g = o.geometry; if (!g) return; v += g.attributes.position?.count || 0; t += (g.index ? g.index.count : (g.attributes.position?.count || 0)) / 3; });
    stats.replaceChildren(`${objs.length} objects`, h('br'), `${v} vertices`, h('br'), `${Math.round(t)} triangles`);
  };
  const gizmoBar = h('div.k-row', { style: { position: 'absolute', left: '50%', bottom: '16px', transform: 'translateX(-50%)', gap: '4px', zIndex: 4 } });
  const setMode = (m) => {
    mode = m;
    if (tc) tc.setMode(m);
    [...gizmoBar.children].forEach((b) => (b.style.background = b.dataset.m === m ? '#3d7eff' : '#ddd'));
  };
  [['translate', '✥'], ['rotate', '↻'], ['scale', '⤢']].forEach(([m, ic]) => gizmoBar.append(h('button', { 'data-m': m, style: { width: '36px', height: '36px', border: '1px solid #999', background: m === 'translate' ? '#3d7eff' : '#ddd', cursor: 'pointer', fontSize: '16px', color: m === 'translate' ? '#fff' : '#222' }, onclick: () => setMode(m) }, ic)));
  vp.append(h('div.k-row', { style: { position: 'absolute', right: '10px', top: '8px', gap: '6px', zIndex: 3, fontSize: '11px' } },
    h('span', { style: { background: '#ddd', padding: '4px 8px', border: '1px solid #999' } }, 'CAMERA ▾'),
    h('span', { style: { background: '#ddd', padding: '4px 8px', border: '1px solid #999' } }, 'SOLID ▾'),
    h('span', { style: { color: '#e33', marginLeft: '6px' } }, 'X'), h('span', { style: { color: '#3a3' } }, 'Y'), h('span', { style: { color: '#36f' } }, 'Z')), stats, gizmoBar);
  tc = new TransformControls(S.cam, S.r.domElement);
  tc.addEventListener('dragging-changed', (e) => { oc.enabled = !e.value; });
  try { S.scene.add(tc.getHelper ? tc.getHelper() : tc); } catch { S.scene.add(tc); }
  const selectObj = (o) => {
    selected = o;
    if (tc) { if (o) { tc.attach(o); tc.setMode(mode); } else tc.detach(); }
    renderSide();
  };
  const ray = new THREE.Raycaster();
  S.r.domElement.addEventListener('pointerdown', (e) => {
    if (tc && tc.dragging) return;
    const b = S.r.domElement.getBoundingClientRect();
    ray.setFromCamera({ x: ((e.clientX - b.left) / b.width) * 2 - 1, y: -((e.clientY - b.top) / b.height) * 2 + 1 }, S.cam);
    const hit = ray.intersectObjects(objs, false)[0];
    selectObj(hit ? hit.object : null);
  });
  function addObj(kind) {
    let mesh;
    if (kind === 'box') mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    else if (kind === 'sphere') mesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 16), new THREE.MeshStandardMaterial({ color: 0xaaccee }));
    else if (kind === 'plane') mesh = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide }));
    else { const l = new THREE.DirectionalLight(0xffffff, 1.2); l.position.set(3, 5, 2); S.scene.add(l); toast('DirectionalLight added'); return; }
    mesh.position.set((Math.random() - 0.5) * 2, 0.5, (Math.random() - 0.5) * 2);
    mesh.name = kind[0].toUpperCase() + kind.slice(1) + objs.filter((o) => o.userData.kind === kind).length;
    mesh.userData.kind = kind;
    S.scene.add(mesh); objs.push(mesh); selectObj(mesh); updStats();
  }
  const side = h('div', { style: { background: '#ddd', borderLeft: '1px solid #bbb', display: 'flex', flexDirection: 'column', fontSize: '12px', overflow: 'auto' } });
  function renderSide() {
    const tabs = h('div.k-row', { style: { borderBottom: '1px solid #bbb' } },
      ...['SCENE', 'PROJECT', 'SETTINGS'].map((t) => h('span', { style: { padding: '8px 12px', cursor: 'pointer', background: tab === t ? '#eee' : 'transparent', fontWeight: tab === t ? 700 : 400 }, onclick: () => { tab = t; renderSide(); } }, t)));
    const tree = h('div', { style: { background: '#fff', margin: '8px', border: '1px solid #bbb', padding: '6px', minHeight: '100px' } },
      h('div', { style: { padding: '3px 4px' } }, h('span', { style: { color: '#e33' } }, '● '), 'Camera'),
      h('div', { style: { padding: '3px 4px' } }, h('span', { style: { color: '#36f' } }, '● '), 'Scene'),
      ...objs.map((o) => h('div', { style: { padding: '3px 14px', cursor: 'pointer', background: selected === o ? '#cde' : 'transparent' }, onclick: () => selectObj(o) }, '◻ ' + o.name)));
    const fields = h('div', { style: { padding: '8px 12px', display: 'grid', gap: '8px' } },
      h('div.k-row', {}, h('span', { style: { width: '90px' } }, 'Background'), select(['DEFAULT', 'Color', 'Texture'], bgMode, (v) => { bgMode = v; S.scene.background = new THREE.Color(v === 'Color' ? 0x334455 : 0xaaaaaa); })),
      h('div.k-row', {}, h('span', { style: { width: '90px' } }, 'Environment'), select(['DEFAULT', 'None'], 'DEFAULT', () => {})),
      h('div.k-row', {}, h('span', { style: { width: '90px' } }, 'Fog'), select(['NONE', 'Linear', 'Exponential'], fogOn ? 'Linear' : 'NONE', (v) => { fogOn = v !== 'NONE'; S.scene.fog = fogOn ? new THREE.Fog(0xaaaaaa, 8, 40) : null; })));
    if (selected && selected.isMesh) {
      const p = selected.position, r = selected.rotation, sc = selected.scale;
      const num = (label, obj, key, step = 0.1) => h('div.k-row', {}, h('span', { style: { width: '70px' } }, label), h('input', { type: 'number', step, value: +obj[key].toFixed(2), style: { width: '70px' }, oninput: (e) => { obj[key] = +e.target.value; } }));
      fields.append(h('b', { style: { marginTop: '8px' } }, selected.name),
        num('pos.x', p, 'x'), num('pos.y', p, 'y'), num('pos.z', p, 'z'),
        num('rot.x', r, 'x'), num('rot.y', r, 'y'), num('rot.z', r, 'z'),
        num('scl.x', sc, 'x'),
        h('div.k-row', {}, h('span', { style: { width: '70px' } }, 'color'), h('input', { type: 'color', value: '#' + selected.material.color.getHexString(), oninput: (e) => selected.material.color.set(e.target.value) })));
    }
    side.replaceChildren(tabs, tree, fields);
  }
  renderSide();
  const playbar = h('div.k-row', { style: { height: '28px', background: '#333', color: '#ddd', fontSize: '12px', padding: '0 12px', gap: '12px' } },
    h('span', { style: { cursor: 'pointer' }, onclick: () => { playing = true; } }, '▶'),
    h('span', { style: { cursor: 'pointer' }, onclick: () => { playing = false; } }, '❚❚'),
    h('span', { style: { cursor: 'pointer' }, onclick: () => { playing = false; if (selected) selected.rotation.set(0, 0, 0); } }, '■'),
    h('span', {}, '0.00 / 0.00'), h('span', { style: { flex: 1 } }), h('span', {}, 'Time Scale 1.00'));
  S.on(() => { oc.update(); if (playing && selected) selected.rotation.y += 0.02; });
  body.append(vp, side);
  root.append(menu, body, playbar);
  // expose for proof
  window.__addBox = () => addObj('box');
  window.__demoProof = async () => {
    addObj('box'); addObj('sphere');
    await sleep(100);
    setMode('rotate'); await sleep(80); setMode('scale'); await sleep(80); setMode('translate');
    if (selected) selected.material.color.set('#ff6644');
    S.scene.background = new THREE.Color(0x445566); bgMode = 'Color';
    S.scene.fog = new THREE.Fog(0x445566, 10, 40); fogOn = true;
    playing = true; await sleep(300); playing = false;
    renderSide(); updStats();
    return `added ${objs.length} meshes; transform modes; color+fog+bg; play spin`;
  };
};

V['donmccurdy-gltf-drop-viewer'] = (root, T) => {
  theme(root, T, { bg: '#191919', fg: '#f0f0f0', panel: '#252525', ac: '#7c5cff', dark: true });
  root.style.overflow = 'hidden';
  const vp = h('div', { style: { position: 'absolute', inset: 0 } });
  const S = stage(vp, { bg: '#191919' });
  lights(S.scene, 1.1);
  S.cam.position.set(2.6, 1.8, 3.4);
  const oc = new OrbitControls(S.cam, S.r.domElement);
  oc.enableDamping = true;
  oc.autoRotate = false;
  oc.autoRotateSpeed = 1.4;
  S.on(() => oc.update());

  let model = null;
  let wire = false;
  let env = 'dark';
  let info = { name: '—', tris: 0 };
  const mats = [];

  const empty = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)',
      width: 'min(420px,86vw)', zIndex: 4, textAlign: 'center', pointerEvents: 'none',
    },
  },
    h('div', {
      style: {
        border: '1px dashed #ffffff28', borderRadius: '14px', padding: '48px 28px',
        background: '#111111cc', color: '#ddd', fontSize: '15px', marginBottom: '14px',
      },
    }, 'Drag glTF 2.0 file or folder here'),
    h('div', { style: { pointerEvents: 'auto' } },
      btn('Choose sample model', () => loadSample(), 'pri')),
  );
  empty.querySelector('.k-btn') && Object.assign(empty.querySelector('.k-btn').style, {
    background: '#2a2a2a', color: '#eee', border: '1px solid #ffffff22',
  });

  const badge = h('div', {
    style: {
      position: 'absolute', left: '14px', bottom: '14px', zIndex: 5,
      background: '#000a', border: '1px solid #ffffff18', borderRadius: '10px',
      padding: '10px 12px', fontSize: '11px', fontFamily: 'ui-monospace,monospace',
      lineHeight: 1.55, display: 'none', minWidth: '160px',
    },
  });
  const header = h('div.k-row', {
    style: {
      position: 'absolute', left: 0, right: 0, top: 0, height: '40px', zIndex: 6,
      padding: '0 14px', background: '#222', borderBottom: '1px solid #ffffff10', gap: '12px',
    },
  },
    h('b', { style: { fontSize: '13px', fontWeight: 600 } }, 'glTF Viewer'),
    h('span', { style: { flex: 1 } }),
  );
  const chrome = h('div.k-row', {
    style: {
      position: 'absolute', right: '14px', top: '52px', zIndex: 5, gap: '8px', flexWrap: 'wrap',
      justifyContent: 'flex-end', maxWidth: '320px',
    },
  });

  const countTris = (obj) => {
    let t = 0;
    obj.traverse((o) => {
      if (!o.isMesh || !o.geometry) return;
      const g = o.geometry;
      t += (g.index ? g.index.count : (g.attributes.position?.count || 0)) / 3;
    });
    return Math.round(t);
  };
  const setWire = (on) => {
    wire = on;
    mats.forEach((m) => { m.wireframe = on; });
  };
  const setEnv = (k) => {
    env = k;
    const map = { dark: 0x191919, studio: 0x2a3140, warm: 0x2a2218 };
    S.scene.background = new THREE.Color(map[k] || 0x191919);
  };
  const updBadge = () => {
    badge.style.display = model ? 'block' : 'none';
    badge.replaceChildren(
      h('div', {}, h('span', { style: { opacity: .55 } }, 'name '), info.name),
      h('div', {}, h('span', { style: { opacity: .55 } }, 'triangles '), String(info.tris)),
      h('div', {}, h('span', { style: { opacity: .55 } }, 'env '), env),
    );
  };
  const clearModel = () => {
    if (model) { S.scene.remove(model); model = null; }
    mats.length = 0;
  };
  const setModel = (group, name) => {
    clearModel();
    model = group;
    S.scene.add(model);
    mats.length = 0;
    model.traverse((o) => {
      if (o.isMesh) {
        if (!Array.isArray(o.material)) mats.push(o.material);
        else mats.push(...o.material);
      }
    });
    setWire(wire);
    info = { name, tris: countTris(model) };
    empty.style.display = 'none';
    updBadge();
  };
  const loadSample = () => {
    const g = new THREE.Group();
    const gold = new THREE.MeshStandardMaterial({ color: 0xc4a46a, metalness: 0.55, roughness: 0.28 });
    const accent = new THREE.MeshStandardMaterial({ color: 0x5b7cff, metalness: 0.2, roughness: 0.45 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), gold);
    box.position.set(-0.85, 0.55, 0);
    const sph = new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 32), accent);
    sph.position.set(0.7, 0.55, 0.2);
    const tor = new THREE.Mesh(new THREE.TorusKnotGeometry(0.42, 0.14, 128, 24), gold);
    tor.position.set(0.1, 1.35, -0.3);
    g.add(box, sph, tor);
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 64),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9, metalness: 0.05 }),
    );
    floor.rotation.x = -Math.PI / 2;
    g.add(floor);
    setModel(g, 'sample-primitives.glb');
    toast('Sample model loaded');
  };

  // controls
  chrome.append(
    toggle('Auto-rotate', false, (v) => { oc.autoRotate = v; }),
    toggle('Wireframe', false, (v) => { setWire(v); updBadge(); }),
    seg([['dark', 'Dark'], ['studio', 'Studio'], ['warm', 'Warm']], 'dark', (v) => { setEnv(v); updBadge(); }),
    btn('Sample', loadSample, 'pri'),
  );

  const foot = h('div', {
    style: {
      position: 'absolute', right: '14px', bottom: '12px', zIndex: 5,
      fontSize: '11px', opacity: .45, fontFamily: 'ui-monospace,monospace',
    },
  }, 'three.js · help & feedback · github');

  vp.addEventListener('dragover', (e) => e.preventDefault());
  vp.addEventListener('drop', (e) => {
    e.preventDefault();
    // Real GLB optional; fall back to sample on any drop
    const f = e.dataTransfer?.files?.[0];
    if (f && /\.glb?$/i.test(f.name)) {
      try {
        new GLTFLoader().load(URL.createObjectURL(f), (gltf) => {
          setModel(gltf.scene, f.name);
          toast('Loaded ' + f.name);
        }, undefined, () => { loadSample(); toast('Parse failed → sample'); });
      } catch { loadSample(); }
    } else loadSample();
  });

  root.append(vp, header, empty, chrome, badge, foot);
  window.__demoProof = async () => {
    loadSample(); await sleep(120);
    oc.autoRotate = true; await sleep(200);
    setWire(true); await sleep(80);
    setEnv('studio'); await sleep(60);
    setWire(false); setEnv('dark');
    oc.autoRotate = false;
    updBadge();
    return `model ${info.name}; tris ${info.tris}; orbit+wire+env exercised`;
  };
};


V['zdog-pseudo3d-illo-playground'] = (root, T) => {
  theme(root, T, { bg: '#ffffff', fg: '#636', panel: '#FFF0E0', ac: '#E62', dark: false, line: '#e8ddd0' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'system-ui, Inter Variable, sans-serif';

  const COLORS = ['#E62', '#C25', '#636', '#EA0', '#19F', '#5C5', '#E62'];
  let rotX = -0.35, rotY = 0.55, spinning = true, selected = 0;
  let strokeW = 18, color = '#C25';
  const shapes = [
    { kind: 'ellipse', x: 0, y: -20, z: 0, w: 70, h: 70, stroke: 16, color: '#EA0' },
    { kind: 'rect', x: 0, y: 40, z: 0, w: 50, h: 70, stroke: 14, color: '#C25' },
    { kind: 'ellipse', x: -55, y: 20, z: 10, w: 36, h: 36, stroke: 12, color: '#636' },
    { kind: 'ellipse', x: 55, y: 20, z: -10, w: 36, h: 36, stroke: 12, color: '#19F' },
    { kind: 'rect', x: 0, y: 90, z: 0, w: 90, h: 18, stroke: 10, color: '#E62' },
  ];

  const stageWrap = h('div', {
    style: {
      position: 'absolute', left: '50%', top: '48%', transform: 'translate(-50%,-52%)',
      width: 'min(520px,86vw)', height: 'min(520px,70vh)', background: '#FFF0E0',
      borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 0 #0001',
    },
  });
  const cv = h('canvas', { style: { width: '100%', height: '100%', display: 'block', cursor: 'grab', touchAction: 'none' } });
  stageWrap.append(cv);

  const project = (x, y, z) => {
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;
    let y1 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;
    return { x: x1, y: y1, z: z2, depth: z2 };
  };

  const draw = () => {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = stageWrap.clientWidth || 480, H = stageWrap.clientHeight || 480;
    if (cv.width !== Math.floor(W * dpr) || cv.height !== Math.floor(H * dpr)) {
      cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr);
    }
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    g.fillStyle = '#FFF0E0';
    g.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2 + 10;
    const drawn = shapes.map((sh, i) => {
      const p = project(sh.x, sh.y, sh.z);
      return { sh, i, p, depth: p.depth };
    }).sort((a, b) => a.depth - b.depth);
    for (const { sh, i, p } of drawn) {
      g.save();
      g.translate(cx + p.x, cy + p.y);
      // foreshorten slightly by depth
      const sc = 1 + p.depth * 0.0012;
      g.scale(sc, sc);
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.strokeStyle = sh.color;
      g.lineWidth = sh.stroke;
      g.fillStyle = 'transparent';
      if (i === selected) {
        g.shadowColor = sh.color;
        g.shadowBlur = 10;
      }
      g.beginPath();
      if (sh.kind === 'ellipse') {
        g.ellipse(0, 0, sh.w / 2, sh.h / 2, 0, 0, Math.PI * 2);
      } else {
        const rw = sh.w, rh = sh.h;
        g.roundRect(-rw / 2, -rh / 2, rw, rh, Math.min(sh.stroke, 12));
      }
      g.stroke();
      g.restore();
    }
  };

  let raf = 0;
  const loop = () => {
    if (spinning) rotY += 0.012;
    draw();
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  drag(cv, {
    start: () => { cv.style.cursor = 'grabbing'; },
    move: (e) => {
      rotY += e.movementX * 0.01;
      rotX = clamp(rotX + e.movementY * 0.01, -1.2, 1.2);
    },
    end: () => { cv.style.cursor = 'grab'; },
  });

  const addShape = (kind) => {
    const ang = Math.random() * Math.PI * 2;
    const r = 30 + Math.random() * 50;
    shapes.push({
      kind,
      x: Math.cos(ang) * r,
      y: (Math.random() - 0.4) * 80,
      z: Math.sin(ang) * r,
      w: kind === 'ellipse' ? 40 + Math.random() * 40 : 36 + Math.random() * 40,
      h: kind === 'ellipse' ? 40 + Math.random() * 40 : 28 + Math.random() * 50,
      stroke: strokeW,
      color,
    });
    selected = shapes.length - 1;
  };
  const applyStroke = (v) => {
    strokeW = v;
    if (shapes[selected]) shapes[selected].stroke = v;
  };
  const applyColor = (c) => {
    color = c;
    if (shapes[selected]) shapes[selected].color = c;
  };

  const swatch = h('div.k-row', { style: { gap: '6px', flexWrap: 'wrap' } },
    ...COLORS.map((c) => h('button', {
      style: {
        width: '26px', height: '26px', borderRadius: '50%', background: c,
        border: c === color ? '3px solid #222' : '2px solid #fff',
        boxShadow: '0 0 0 1px #0002', cursor: 'pointer', padding: 0,
      },
      onclick: (e) => {
        applyColor(c);
        swatch.querySelectorAll('button').forEach((b) => { b.style.border = '2px solid #fff'; });
        e.currentTarget.style.border = '3px solid #222';
      },
    })),
  );

  const toolbar = h('div', {
    style: {
      position: 'absolute', left: '50%', bottom: '18px', transform: 'translateX(-50%)',
      display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
      background: '#fff', border: '1px solid #e8ddd0', borderRadius: '14px',
      padding: '10px 14px', zIndex: 5, boxShadow: '0 8px 28px #0001',
      maxWidth: '92vw', justifyContent: 'center',
    },
  },
    toggle('Spin', true, (v) => { spinning = v; }),
    btn('＋ Ellipse', () => addShape('ellipse'), 'pri'),
    btn('＋ Rect', () => addShape('rect')),
    h('div', { style: { width: '150px' } }, slider('Stroke', 4, 36, strokeW, 1, applyStroke, (v) => v + 'px')),
    swatch,
  );
  toolbar.querySelectorAll('.k-btn').forEach((b) => {
    Object.assign(b.style, {
      background: b.classList.contains('pri') ? '#E62' : '#FFF0E0',
      color: b.classList.contains('pri') ? '#fff' : '#636',
      border: '0', borderRadius: '10px', fontWeight: '700',
    });
  });

  const head = h('div', {
    style: {
      position: 'absolute', top: '16px', left: '20px', right: '20px', zIndex: 4,
      display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap',
    },
  },
    h('b', { style: { fontSize: '34px', color: '#EA0', letterSpacing: '-.02em', fontWeight: 800 } }, 'Zdog'),
    h('span', { style: { color: '#636', fontSize: '14px', maxWidth: '420px', lineHeight: 1.35 } },
      'Round, flat, designer-friendly pseudo-3D illustration playground'),
  );

  const hint = h('div', {
    style: {
      position: 'absolute', top: '64px', left: '22px', zIndex: 4,
      fontSize: '12px', color: '#6369',
    },
  }, 'drag to rotate · Spin for auto Y · add shapes');

  root.append(head, hint, stageWrap, toolbar);

  const snap = () => ({
    rotX, rotY, spinning, selected, strokeW, color,
    shapes: shapes.map((s) => ({ ...s })),
  });
  const restore = (s) => {
    rotX = s.rotX; rotY = s.rotY; spinning = s.spinning; selected = s.selected;
    strokeW = s.strokeW; color = s.color;
    shapes.length = 0; s.shapes.forEach((x) => shapes.push({ ...x }));
  };

  window.__demoProof = async () => {
    const before = snap();
    spinning = true;
    addShape('ellipse');
    applyColor('#19F');
    rotY += 0.4; rotX -= 0.1;
    await sleep(180);
    restore(before);
    return 'spin on, shape added, color+drag-rotate exercised, restored';
  };
};


V['spline-browser-3d-craft-desk'] = (root, T) => {
  theme(root, T, { bg: '#f4f5f7', fg: '#1a1d23', panel: '#ffffff', ac: '#5b6cff', dark: false, line: '#e4e6ec' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "Inter Variable, system-ui, sans-serif";

  const objs = [];
  let selected = null;
  let stateMode = 'default'; // default | hover
  let uid = 1;

  const shell = h('div', { style: { position: 'absolute', inset: 0, display: 'grid', gridTemplateRows: '44px 1fr 26px', background: '#eef0f4' } });
  const top = h('div.k-row', {
    style: {
      padding: '0 14px', gap: '10px', background: '#fff', borderBottom: '1px solid #e4e6ec',
      boxShadow: '0 1px 0 #00000006',
    },
  },
    h('b', { style: { fontSize: '13px', letterSpacing: '-.01em' } }, '✦ Craft Desk'),
    h('span', { style: { width: '1px', height: '18px', background: '#e4e6ec' } }),
    h('span', { style: { fontSize: '12px', opacity: .55 } }, 'Scene · Untitled'),
    h('span', { style: { flex: 1 } }),
  );
  const addBar = h('div.k-row', { style: { gap: '6px' } });
  top.append(addBar);

  const body = h('div', { style: { display: 'grid', gridTemplateColumns: '220px 1fr 280px', minHeight: 0 } });
  const treeWrap = h('div', {
    style: {
      background: '#fff', borderRight: '1px solid #e4e6ec', display: 'grid',
      gridTemplateRows: '36px 1fr', minHeight: 0,
    },
  });
  const treeHead = h('div.k-row', {
    style: { padding: '0 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', opacity: .45 },
  }, 'Objects');
  const tree = h('div', { style: { overflow: 'auto', padding: '6px 8px', display: 'grid', gap: '2px', alignContent: 'start' } });
  treeWrap.append(treeHead, tree);

  const vp = h('div', { style: { position: 'relative', minHeight: 0, background: '#dfe3ea' } });
  const S = stage(vp, { bg: '#d8dde6' });
  S.cam.position.set(4.2, 3.2, 5.4);
  lights(S.scene, 1.05);
  const hemi = new THREE.HemisphereLight(0xffffff, 0xb0b8c8, 0.55);
  S.scene.add(hemi);
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(8, 64),
    new THREE.MeshStandardMaterial({ color: 0xcfd5df, roughness: 0.95, metalness: 0.02 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  floor.receiveShadow = true;
  S.scene.add(floor);
  const grid = new THREE.GridHelper(10, 20, 0xb8c0ce, 0xc9d0db);
  grid.position.y = 0.001;
  S.scene.add(grid);
  const oc = new OrbitControls(S.cam, S.r.domElement);
  oc.enableDamping = true;
  oc.enablePan = true;
  oc.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  S.on(() => oc.update());

  const insp = h('div', {
    style: {
      background: '#fff', borderLeft: '1px solid #e4e6ec', display: 'grid',
      gridTemplateRows: '36px 1fr', minHeight: 0, overflow: 'hidden',
    },
  });
  const inspHead = h('div.k-row', {
    style: { padding: '0 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', opacity: .45 },
  }, 'Inspector');
  const inspBody = h('div', { style: { overflow: 'auto', padding: '10px 12px', display: 'grid', gap: '10px', alignContent: 'start' } });
  insp.append(inspHead, inspBody);

  const foot = h('div.k-row', {
    style: { padding: '0 14px', fontSize: '11px', background: '#fff', borderTop: '1px solid #e4e6ec', opacity: .55, gap: '14px' },
  }, h('span', {}, 'Orbit · wheel zoom · right-drag pan'), h('span', { style: { flex: 1 } }), h('span', {}, 'Craft Desk · look-alike'));

  const geoOf = (kind) => {
    if (kind === 'sphere') return new THREE.SphereGeometry(0.55, 48, 32);
    if (kind === 'plane') return new THREE.PlaneGeometry(1.6, 1.6);
    return new THREE.BoxGeometry(1, 1, 1);
  };
  const matOf = (hex = '#7c8cff') => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(hex), metalness: 0.15, roughness: 0.35, transparent: true, opacity: 1,
    clearcoat: 0.4, clearcoatRoughness: 0.35,
  });

  const selectObj = (o) => {
    selected = o;
    objs.forEach((x) => {
      if (x.userData.outline) x.userData.outline.visible = x === o;
    });
    renderTree();
    renderInsp();
  };

  const applyState = (o) => {
    if (!o) return;
    const def = o.userData.def;
    const hov = o.userData.hov;
    const use = stateMode === 'hover' ? hov : def;
    o.material.color.set(use.color);
    o.scale.setScalar(use.scale);
  };

  const addPrim = (kind) => {
    const mat = matOf(kind === 'sphere' ? '#ff7ab8' : kind === 'plane' ? '#6ee7c5' : '#7c8cff');
    const mesh = new THREE.Mesh(geoOf(kind), mat);
    mesh.name = kind.charAt(0).toUpperCase() + kind.slice(1) + ' ' + uid++;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set((Math.random() - 0.5) * 1.6, kind === 'plane' ? 0.02 : 0.5, (Math.random() - 0.5) * 1.6);
    if (kind === 'plane') mesh.rotation.x = -Math.PI / 2;
    const outline = new THREE.Mesh(
      mesh.geometry.clone(),
      new THREE.MeshBasicMaterial({ color: 0x5b6cff, wireframe: true, transparent: true, opacity: 0.55 }),
    );
    outline.scale.setScalar(1.02);
    outline.visible = false;
    mesh.add(outline);
    mesh.userData = {
      kind,
      outline,
      def: { color: '#' + mat.color.getHexString(), scale: 1 },
      hov: { color: '#ffd166', scale: 1.12 },
    };
    S.scene.add(mesh);
    objs.push(mesh);
    selectObj(mesh);
    return mesh;
  };

  const renderTree = () => {
    tree.replaceChildren(...objs.map((o) => h('div.k-row', {
      style: {
        padding: '7px 8px', borderRadius: '8px', cursor: 'pointer', gap: '8px',
        background: o === selected ? '#5b6cff14' : 'transparent',
        outline: o === selected ? '1px solid #5b6cff44' : 'none',
      },
      onclick: () => selectObj(o),
    },
      h('span', { style: { width: '8px', height: '8px', borderRadius: '3px', background: '#' + o.material.color.getHexString() } }),
      h('span', { style: { fontSize: '12px', fontWeight: o === selected ? 700 : 500 } }, o.name),
      h('span', { style: { flex: 1 } }),
      h('span', { style: { fontSize: '10px', opacity: .4, textTransform: 'uppercase' } }, o.userData.kind),
    )));
  };

  const numRow = (label, get, set, step = 0.05) => h('div.k-row', {},
    h('span', { style: { width: '54px', fontSize: '11px', opacity: .6 } }, label),
    h('input', {
      type: 'number', step, value: +get().toFixed(2),
      style: { flex: 1, padding: '5px 7px', borderRadius: '7px', border: '1px solid #e4e6ec', background: '#f7f8fb' },
      oninput: (e) => { set(+e.target.value); },
    }),
  );

  const renderInsp = () => {
    if (!selected) {
      inspBody.replaceChildren(h('div', { style: { opacity: .5, fontSize: '12px', padding: '8px 0' } }, 'Select an object in the tree or add a primitive.'));
      return;
    }
    const o = selected;
    const m = o.material;
    const colorInp = h('input', {
      type: 'color', value: '#' + m.color.getHexString(),
      style: { width: '100%', height: '34px', border: '1px solid #e4e6ec', borderRadius: '8px', background: '#fff', padding: 0 },
      oninput: (e) => {
        m.color.set(e.target.value);
        o.userData.def.color = e.target.value;
        if (stateMode === 'default') applyState(o);
        renderTree();
      },
    });
    inspBody.replaceChildren(
      h('b', { style: { fontSize: '13px' } }, o.name),
      h('div.k-h', {}, 'Transform'),
      numRow('pos.x', () => o.position.x, (v) => { o.position.x = v; }),
      numRow('pos.y', () => o.position.y, (v) => { o.position.y = v; }),
      numRow('pos.z', () => o.position.z, (v) => { o.position.z = v; }),
      numRow('rot.y', () => o.rotation.y, (v) => { o.rotation.y = v; }, 0.05),
      numRow('scl', () => o.scale.x, (v) => {
        o.scale.setScalar(v);
        o.userData.def.scale = v;
      }, 0.05),
      h('div.k-h', {}, 'Material'),
      h('div.k-row', {}, h('span', { style: { width: '54px', fontSize: '11px', opacity: .6 } }, 'color'), colorInp),
      slider('Metalness', 0, 1, m.metalness, 0.01, (v) => { m.metalness = v; }),
      slider('Roughness', 0, 1, m.roughness, 0.01, (v) => { m.roughness = v; }),
      slider('Opacity', 0.1, 1, m.opacity, 0.01, (v) => { m.opacity = v; m.transparent = v < 1; }),
      h('div.k-h', {}, 'States'),
      seg([['default', 'Default'], ['hover', 'Hover']], stateMode, (v) => {
        stateMode = v;
        objs.forEach(applyState);
        renderInsp();
      }),
      h('div', { style: { fontSize: '11px', opacity: .5, lineHeight: 1.45 } },
        stateMode === 'hover'
          ? 'Hover preview: scale ×1.12 + warm accent color.'
          : 'Default state — edits write to the base look.'),
    );
  };

  [['box', 'Cube'], ['sphere', 'Sphere'], ['plane', 'Plane']].forEach(([k, lab]) => {
    addBar.append(btn('+ ' + lab, () => addPrim(k), k === 'box' ? 'pri' : ''));
  });

  // seed scene
  addPrim('box');
  objs[0].position.set(-0.7, 0.5, 0.2);
  addPrim('sphere');
  objs[1].position.set(0.9, 0.55, -0.3);
  selectObj(objs[0]);

  // click-to-select in viewport
  const ray = new THREE.Raycaster();
  S.r.domElement.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    const b = S.r.domElement.getBoundingClientRect();
    ray.setFromCamera({
      x: ((e.clientX - b.left) / b.width) * 2 - 1,
      y: -((e.clientY - b.top) / b.height) * 2 + 1,
    }, S.cam);
    const hit = ray.intersectObjects(objs, false)[0];
    if (hit) selectObj(hit.object);
  });

  body.append(treeWrap, vp, insp);
  shell.append(top, body, foot);
  root.append(shell);

  window.__demoProof = async () => {
    const before = { mode: stateMode, n: objs.length, sel: selected?.name };
    addPrim('box');
    addPrim('sphere');
    selectObj(objs[0]);
    objs[0].material.color.set('#ff5c8a');
    objs[0].userData.def.color = '#ff5c8a';
    objs[0].material.roughness = 0.18;
    objs[0].material.metalness = 0.55;
    stateMode = 'hover';
    objs.forEach(applyState);
    renderTree(); renderInsp();
    oc.object.position.x += 0.4;
    await sleep(160);
    stateMode = 'default';
    objs.forEach(applyState);
    renderInsp();
    return `tree+add (${before.n}→${objs.length}); material live; hover state; orbit ready`;
  };
};

V['floorsjs-isometric-room-desk'] = (root, T) => {
  theme(root, T, { bg: '#09090b', fg: '#f0f0f0', panel: '#141418', ac: '#7c5cff', dark: true, line: '#2a2a32' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'system-ui, Inter Variable, sans-serif';

  const style = {
    back: '#c4b5a0', left: '#a89880', floorDark: '#8a7355', floorLight: '#b8a07a', trim: '#5a4634',
    pattern: 'Checkerboard', window: 'Cross', showTrim: true, showDoors: true,
  };
  const WALLS = ['#c4b5a0', '#e8dcc8', '#8fa8b8', '#b87a7a', '#6a8a6a', '#d4c4a8', '#9a8ab0', '#f0e6d8'];
  const FLOORS = ['#8a7355', '#b8a07a', '#5a5048', '#c8b898', '#6b4a2e', '#a07850', '#444444', '#ddd0c0'];
  const TRIMS = ['#5a4634', '#2a2a2a', '#f5f0e8', '#8a6a4a', '#3a5068', '#ffffff'];

  const FURN = [
    { id: 'bed', label: 'Bed', w: 2.2, d: 1.4, color: '#5b6a8a' },
    { id: 'desk', label: 'Desk', w: 1.6, d: 0.8, color: '#6b4a2e' },
    { id: 'chair', label: 'Chair', w: 0.7, d: 0.7, color: '#3a3a3a' },
    { id: 'plant', label: 'Plant', w: 0.55, d: 0.55, color: '#2d6a3a' },
    { id: 'lamp', label: 'Lamp', w: 0.45, d: 0.45, color: '#ffcc77' },
    { id: 'shelf', label: 'Shelf', w: 1.4, d: 0.4, color: '#8a6a4a' },
    { id: 'sofa', label: 'Sofa', w: 2.0, d: 0.9, color: '#7a4a5a' },
    { id: 'rug', label: 'Rug', w: 1.8, d: 1.2, color: '#c45a4a' },
  ];
  let items = [
    { uid: 1, kind: 'bed', ix: 1.2, iy: 1.0 },
    { uid: 2, kind: 'desk', ix: 3.2, iy: 2.4 },
    { uid: 3, kind: 'plant', ix: 4.2, iy: 0.8 },
  ];
  let nextUid = 10;
  let selected = null;
  let dragState = null; // {uid|paletteKind, ox, oy}

  const stage = h('div', {
    style: {
      position: 'absolute', left: 0, top: 0, right: '280px', bottom: 0,
      background: 'radial-gradient(ellipse at 50% 40%, #1a1a22 0%, #09090b 70%)',
    },
  });
  const cv = h('canvas', { style: { width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'default' } });
  stage.append(cv);

  const iso = (ix, iy, iz = 0) => {
    const s = 42;
    return { x: (ix - iy) * s * 0.866, y: (ix + iy) * s * 0.5 - iz * s };
  };

  const drawRoom = (g, ox, oy) => {
    const ROOM = 5;
    // floor diamond
    const corners = [[0, 0], [ROOM, 0], [ROOM, ROOM], [0, ROOM]].map(([a, b]) => iso(a, b));
    g.save();
    g.translate(ox, oy);
    // back wall (top of diamond view — wall along iy=0)
    const bw = [iso(0, 0, 0), iso(ROOM, 0, 0), iso(ROOM, 0, 2.4), iso(0, 0, 2.4)];
    g.beginPath();
    g.moveTo(bw[0].x, bw[0].y); bw.slice(1).forEach((p) => g.lineTo(p.x, p.y));
    g.closePath();
    g.fillStyle = style.back;
    g.fill();
    // left wall (ix=0)
    const lw = [iso(0, 0, 0), iso(0, ROOM, 0), iso(0, ROOM, 2.4), iso(0, 0, 2.4)];
    g.beginPath();
    g.moveTo(lw[0].x, lw[0].y); lw.slice(1).forEach((p) => g.lineTo(p.x, p.y));
    g.closePath();
    g.fillStyle = style.left;
    g.fill();

    // floor with pattern
    const cells = 8;
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        const a = i / cells * ROOM, b = j / cells * ROOM;
        const s = ROOM / cells;
        const p0 = iso(a, b), p1 = iso(a + s, b), p2 = iso(a + s, b + s), p3 = iso(a, b + s);
        let col = style.floorLight;
        if (style.pattern === 'Checkerboard') col = (i + j) % 2 ? style.floorDark : style.floorLight;
        else if (style.pattern === 'Solid') col = style.floorLight;
        else if (style.pattern === 'Striped') col = i % 2 ? style.floorDark : style.floorLight;
        else if (style.pattern === 'Diagonal') col = ((i + j * 2) % 3 === 0) ? style.floorDark : style.floorLight;
        g.beginPath();
        g.moveTo(p0.x, p0.y); g.lineTo(p1.x, p1.y); g.lineTo(p2.x, p2.y); g.lineTo(p3.x, p3.y);
        g.closePath();
        g.fillStyle = col;
        g.fill();
      }
    }

    // window on back wall
    if (style.window !== 'None') {
      const wx = ROOM * 0.35, ww = ROOM * 0.3;
      const base = 0.9, top = 2.0;
      const w0 = iso(wx, 0.02, base), w1 = iso(wx + ww, 0.02, base), w2 = iso(wx + ww, 0.02, top), w3 = iso(wx, 0.02, top);
      g.beginPath();
      if (style.window === 'Arched') {
        g.moveTo(w0.x, w0.y); g.lineTo(w1.x, w1.y); g.lineTo(w2.x, w2.y);
        const mid = iso(wx + ww / 2, 0.02, top + 0.35);
        g.quadraticCurveTo(mid.x, mid.y, w3.x, w3.y);
      } else {
        g.moveTo(w0.x, w0.y); g.lineTo(w1.x, w1.y); g.lineTo(w2.x, w2.y); g.lineTo(w3.x, w3.y);
      }
      g.closePath();
      g.fillStyle = '#7ec8e8aa';
      g.fill();
      g.strokeStyle = style.trim;
      g.lineWidth = 2;
      g.stroke();
      if (style.window === 'Cross' || style.window === 'Double') {
        const mx = iso(wx + ww / 2, 0.02, base), my = iso(wx + ww / 2, 0.02, top);
        g.beginPath(); g.moveTo(mx.x, mx.y); g.lineTo(my.x, my.y); g.stroke();
        if (style.window === 'Cross') {
          const mh = iso(wx, 0.02, (base + top) / 2), mh2 = iso(wx + ww, 0.02, (base + top) / 2);
          g.beginPath(); g.moveTo(mh.x, mh.y); g.lineTo(mh2.x, mh2.y); g.stroke();
        }
      }
    }

    // trim / doors
    if (style.showTrim) {
      g.strokeStyle = style.trim;
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(iso(0, 0, 0).x, iso(0, 0, 0).y);
      g.lineTo(iso(ROOM, 0, 0).x, iso(ROOM, 0, 0).y);
      g.lineTo(iso(ROOM, ROOM, 0).x, iso(ROOM, ROOM, 0).y);
      g.lineTo(iso(0, ROOM, 0).x, iso(0, ROOM, 0).y);
      g.closePath();
      g.stroke();
    }
    if (style.showDoors) {
      const d0 = iso(0.02, ROOM * 0.55, 0), d1 = iso(0.02, ROOM * 0.55 + 1.0, 0), d2 = iso(0.02, ROOM * 0.55 + 1.0, 2.0), d3 = iso(0.02, ROOM * 0.55, 2.0);
      g.beginPath();
      g.moveTo(d0.x, d0.y); g.lineTo(d1.x, d1.y); g.lineTo(d2.x, d2.y); g.lineTo(d3.x, d3.y);
      g.closePath();
      g.fillStyle = '#5a4030';
      g.fill();
      g.strokeStyle = style.trim;
      g.stroke();
    }

    // furniture sorted by depth
    const sorted = [...items].sort((a, b) => (a.ix + a.iy) - (b.ix + b.iy));
    for (const it of sorted) {
      const def = FURN.find((f) => f.id === it.kind) || FURN[0];
      const p = iso(it.ix, it.iy, 0);
      const hgt = it.kind === 'lamp' ? 1.4 : it.kind === 'shelf' ? 1.6 : it.kind === 'plant' ? 1.1 : 0.7;
      const top = iso(it.ix, it.iy, hgt);
      // simple iso box footprint
      const hw = def.w / 2, hd = def.d / 2;
      const c = [
        iso(it.ix - hw, it.iy - hd, 0),
        iso(it.ix + hw, it.iy - hd, 0),
        iso(it.ix + hw, it.iy + hd, 0),
        iso(it.ix - hw, it.iy + hd, 0),
      ];
      const ct = c.map((pt, i) => ({ x: pt.x, y: pt.y - (hgt * 42) }));
      // top
      g.beginPath();
      g.moveTo(ct[0].x, ct[0].y); ct.slice(1).forEach((p2) => g.lineTo(p2.x, p2.y));
      g.closePath();
      g.fillStyle = def.color;
      g.fill();
      // left face
      g.beginPath();
      g.moveTo(c[3].x, c[3].y); g.lineTo(c[0].x, c[0].y); g.lineTo(ct[0].x, ct[0].y); g.lineTo(ct[3].x, ct[3].y);
      g.closePath();
      g.fillStyle = shade(def.color, -25);
      g.fill();
      // right face
      g.beginPath();
      g.moveTo(c[0].x, c[0].y); g.lineTo(c[1].x, c[1].y); g.lineTo(ct[1].x, ct[1].y); g.lineTo(ct[0].x, ct[0].y);
      g.closePath();
      g.fillStyle = shade(def.color, -12);
      g.fill();
      if (selected === it.uid) {
        g.strokeStyle = '#7c5cff';
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(ct[0].x, ct[0].y); ct.slice(1).forEach((p2) => g.lineTo(p2.x, p2.y));
        g.closePath();
        g.stroke();
      }
      // label tiny
      g.fillStyle = '#ffffffaa';
      g.font = '10px system-ui';
      g.textAlign = 'center';
      g.fillText(def.label, top.x, top.y - 6);
    }
    g.restore();
  };

  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g2 = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = clamp(r, 0, 255); g2 = clamp(g2, 0, 255); b = clamp(b, 0, 255);
    return '#' + ((1 << 24) + (r << 16) + (g2 << 8) + b).toString(16).slice(1);
  };

  const screenToIso = (sx, sy, ox, oy) => {
    const s = 42;
    const x = sx - ox, y = sy - oy;
    const ix = (x / (s * 0.866) + y / (s * 0.5)) / 2;
    const iy = (y / (s * 0.5) - x / (s * 0.866)) / 2;
    return { ix: clamp(ix, 0.3, 4.7), iy: clamp(iy, 0.3, 4.7) };
  };

  const hitItem = (sx, sy, ox, oy) => {
    const sorted = [...items].sort((a, b) => (b.ix + b.iy) - (a.ix + a.iy));
    for (const it of sorted) {
      const def = FURN.find((f) => f.id === it.kind) || FURN[0];
      const p = iso(it.ix, it.iy, 0.35);
      const dx = sx - (ox + p.x), dy = sy - (oy + p.y);
      if (Math.hypot(dx, dy) < 28 + def.w * 8) return it;
    }
    return null;
  };

  const draw = () => {
    fitCanvas(cv, stage);
    const g = cv.g, W = cv.W, H = cv.H;
    g.clearRect(0, 0, W, H);
    const ox = W * 0.52, oy = H * 0.28;
    drawRoom(g, ox, oy);
    g.fillStyle = '#ffffff55';
    g.font = '11px system-ui';
    g.textAlign = 'left';
    g.fillText('tiny-home diorama · drag furniture · delete selected', 16, H - 16);
  };

  let raf = 0;
  const loop = () => { draw(); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);

  cv.addEventListener('pointerdown', (e) => {
    const rect = cv.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    fitCanvas(cv, stage);
    const ox = cv.W * 0.52, oy = cv.H * 0.28;
    const hit = hitItem(sx, sy, ox, oy);
    if (hit) {
      selected = hit.uid;
      dragState = { uid: hit.uid };
      cv.setPointerCapture(e.pointerId);
    } else {
      selected = null;
    }
  });
  cv.addEventListener('pointermove', (e) => {
    if (!dragState || dragState.uid == null) return;
    const rect = cv.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    const ox = cv.W * 0.52, oy = cv.H * 0.28;
    const p = screenToIso(sx, sy, ox, oy);
    const it = items.find((x) => x.uid === dragState.uid);
    if (it) { it.ix = p.ix; it.iy = p.iy; }
  });
  cv.addEventListener('pointerup', () => { dragState = null; });

  window.addEventListener('keydown', (e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selected != null) {
      items = items.filter((x) => x.uid !== selected);
      selected = null;
    }
  });

  const chipRow = (colors, onPick, cur) => h('div.k-row', { style: { flexWrap: 'wrap', gap: '6px' } },
    ...colors.map((c) => h('span', {
      style: {
        width: '22px', height: '22px', borderRadius: '5px', background: c, cursor: 'pointer',
        border: c === cur ? '2px solid #7c5cff' : '1px solid #ffffff33',
      },
      onclick: () => onPick(c),
    })));

  let wallTarget = 'back';
  const wallSeg = seg([['back', 'Back'], ['left', 'Left']], 'back', (v) => { wallTarget = v; });
  const patternSeg = seg(
    [['Checkerboard', 'Checker'], ['Solid', 'Solid'], ['Striped', 'Stripe'], ['Diagonal', 'Diag']],
    'Checkerboard',
    (v) => { style.pattern = v; },
  );
  const windowSeg = seg(
    [['Cross', 'Cross'], ['Arched', 'Arch'], ['Double', 'Double'], ['None', 'None']],
    'Cross',
    (v) => { style.window = v; },
  );

  const furnPalette = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' } },
    ...FURN.map((f) => h('button', {
      draggable: true,
      style: {
        background: '#1c1c24', border: '1px solid #ffffff18', color: '#eee', borderRadius: '8px',
        padding: '8px 6px', fontSize: '11px', cursor: 'grab', textAlign: 'left',
      },
      ondragstart: (e) => { e.dataTransfer.setData('text/plain', f.id); },
      onclick: () => {
        const it = { uid: nextUid++, kind: f.id, ix: 2 + Math.random() * 1.5, iy: 2 + Math.random() * 1.5 };
        items.push(it);
        selected = it.uid;
        toast('placed ' + f.label);
      },
    }, h('span', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: f.color, marginRight: '6px' } }), f.label)));

  stage.addEventListener('dragover', (e) => e.preventDefault());
  stage.addEventListener('drop', (e) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData('text/plain');
    if (!kind) return;
    const rect = cv.getBoundingClientRect();
    fitCanvas(cv, stage);
    const ox = cv.W * 0.52, oy = cv.H * 0.28;
    const p = screenToIso(e.clientX - rect.left, e.clientY - rect.top, ox, oy);
    const it = { uid: nextUid++, kind, ix: p.ix, iy: p.iy };
    items.push(it);
    selected = it.uid;
  });

  const panelEl = h('div', {
    style: {
      position: 'absolute', right: 0, top: 0, bottom: 0, width: '280px',
      background: '#141418', borderLeft: '1px solid #ffffff12', padding: '14px',
      display: 'grid', gap: '10px', alignContent: 'start', overflow: 'auto', fontSize: '12px', zIndex: 3,
    },
  },
    h('b', { style: { fontSize: '14px' } }, 'Room Style'),
    h('div', { style: { opacity: .55, fontSize: '10px', letterSpacing: '.08em' } }, 'WALL'),
    wallSeg,
    chipRow(WALLS, (c) => { style[wallTarget] = c; }, style.back),
    h('div', { style: { opacity: .55, fontSize: '10px', letterSpacing: '.08em' } }, 'FLOOR DARK / LIGHT'),
    chipRow(FLOORS, (c) => { style.floorDark = c; }, style.floorDark),
    chipRow(FLOORS, (c) => { style.floorLight = c; }, style.floorLight),
    h('div', { style: { opacity: .55, fontSize: '10px', letterSpacing: '.08em' } }, 'TRIM'),
    chipRow(TRIMS, (c) => { style.trim = c; }, style.trim),
    h('div', { style: { opacity: .55, fontSize: '10px', letterSpacing: '.08em' } }, 'FLOOR PATTERN'),
    patternSeg,
    h('div', { style: { opacity: .55, fontSize: '10px', letterSpacing: '.08em' } }, 'WINDOW STYLE'),
    windowSeg,
    h('div.k-row', { style: { gap: '8px' } },
      toggle('Show trim', style.showTrim, (v) => { style.showTrim = v; }),
      toggle('Show doors', style.showDoors, (v) => { style.showDoors = v; }),
    ),
    h('b', { style: { marginTop: '6px' } }, 'Furniture'),
    furnPalette,
    h('div.k-row', { style: { gap: '6px' } },
      btn('Delete selected', () => { if (selected != null) { items = items.filter((x) => x.uid !== selected); selected = null; } }),
      btn('Clear all', () => { items = []; selected = null; }),
    ),
  );

  root.append(stage, panelEl);

  window.__demoProof = async () => {
    const before = {
      pattern: style.pattern, window: style.window, back: style.back,
      items: items.map((x) => ({ ...x })),
    };
    style.pattern = 'Striped';
    style.window = 'Arched';
    style.back = '#8fa8b8';
    style.left = '#6a8a6a';
    const plant = { uid: nextUid++, kind: 'lamp', ix: 3.5, iy: 3.5 };
    items.push(plant);
    selected = plant.uid;
    await sleep(200);
    items = items.filter((x) => x.uid !== plant.uid);
    style.pattern = before.pattern;
    style.window = before.window;
    style.back = before.back;
    items = before.items.map((x) => ({ ...x }));
    selected = null;
    return 'pattern+window+wall chips + place/delete furniture exercised, restored';
  };
};


V['georgeandjonathan-album-experience'] = (root, T) => {
  theme(root, T, { bg: '#0b0617', fg: '#e8e4f0', panel: '#120a24', ac: '#c8a0ff', dark: true });
  root.style.overflow = 'hidden';
  root.style.fontFamily = 'Inter Variable, system-ui, sans-serif';

  const TRACKS = [
    { name: 'Heaven', bpm: 92, notes: [60, 64, 67, 72, 67, 64] },
    { name: 'Jamn', bpm: 110, notes: [62, 65, 69, 74, 69, 65] },
    { name: 'Puppy Love', bpm: 88, notes: [57, 60, 64, 69, 64, 60] },
    { name: 'R U IN 2 IT?', bpm: 120, notes: [55, 59, 62, 67, 62, 59] },
    { name: 'Everyday Problems', bpm: 98, notes: [58, 62, 65, 70, 65, 62] },
    { name: 'Canopy', bpm: 84, notes: [53, 57, 60, 65, 60, 57] },
    { name: 'A Brief Moment Of Clarity', bpm: 76, notes: [52, 55, 59, 64, 59, 55] },
    { name: 'Rock', bpm: 130, notes: [60, 63, 67, 70, 67, 63] },
    { name: 'Hurtful Things', bpm: 90, notes: [56, 59, 63, 68, 63, 59] },
    { name: 'Crystal', bpm: 100, notes: [61, 64, 68, 73, 68, 64] },
  ];
  const COLORS = [0xff8ec8, 0x7ee0c8, 0xffe08a, 0xa78bfa, 0x7dd3fc, 0xf9a8d4, 0x86efac, 0xfde68a, 0xc4b5fd, 0xfca5a5];

  let ti = 0, playing = false, noteI = 0, lastBlip = 0, started = false;
  let camYaw = 0.35, camPitch = 0.45, camDist = 14;
  let dragOn = false, lx = 0, ly = 0;

  const world = h('div', { style: { position: 'absolute', inset: 0, bottom: '72px', cursor: 'grab' } });
  const S = stage(world, { bg: '#0b0617' });
  S.cam.position.set(0, 4, 14);
  lights(S.scene, 0.55);
  // soft fill
  const amb = new THREE.AmbientLight(0x4a3080, 0.55); S.scene.add(amb);

  // starfield
  {
    const N = 900;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    S.scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.7 })));
  }

  const noteGroup = new THREE.Group(); S.scene.add(noteGroup);
  const bars = [];
  const rebuildNotes = () => {
    while (noteGroup.children.length) noteGroup.remove(noteGroup.children[0]);
    bars.length = 0;
    const tr = TRACKS[ti];
    const n = 28;
    for (let i = 0; i < n; i++) {
      const hgt = 0.3 + (tr.notes[i % tr.notes.length] % 12) * 0.18 + (i % 5) * 0.08;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, hgt, 0.12),
        new THREE.MeshStandardMaterial({
          color: COLORS[i % COLORS.length],
          emissive: COLORS[i % COLORS.length],
          emissiveIntensity: 0.35,
          metalness: 0.2,
          roughness: 0.45,
        }),
      );
      const ang = (i / n) * Math.PI * 2;
      const rad = 3.2 + (i % 4) * 0.35;
      mesh.position.set(Math.cos(ang) * rad, hgt / 2 + Math.sin(i * 0.7) * 0.4, Math.sin(ang) * rad * 0.7);
      mesh.rotation.y = -ang;
      mesh.userData.baseY = mesh.position.y;
      mesh.userData.phase = i * 0.4;
      noteGroup.add(mesh);
      bars.push(mesh);
    }
  };
  rebuildNotes();

  const updateCam = () => {
    S.cam.position.set(
      Math.sin(camYaw) * Math.cos(camPitch) * camDist,
      Math.sin(camPitch) * camDist * 0.85 + 2,
      Math.cos(camYaw) * Math.cos(camPitch) * camDist,
    );
    S.cam.lookAt(0, 1.2, 0);
  };
  updateCam();

  world.addEventListener('pointerdown', (e) => {
    dragOn = true; lx = e.clientX; ly = e.clientY; world.style.cursor = 'grabbing';
    if (!started) begin();
  });
  window.addEventListener('pointerup', () => { dragOn = false; world.style.cursor = 'grab'; });
  world.addEventListener('pointermove', (e) => {
    if (!dragOn) return;
    camYaw -= (e.clientX - lx) * 0.006;
    camPitch = clamp(camPitch + (e.clientY - ly) * 0.004, 0.12, 1.2);
    lx = e.clientX; ly = e.clientY;
    updateCam();
  });
  world.addEventListener('wheel', (e) => {
    e.preventDefault();
    camDist = clamp(camDist + e.deltaY * 0.01, 7, 28);
    updateCam();
  }, { passive: false });

  const titleLab = h('b', { style: { fontSize: '14px', letterSpacing: '.04em' } }, `1. ${TRACKS[0].name.toUpperCase()}`);
  const timeLab = h('span', { style: { fontSize: '12px', opacity: .7, fontVariantNumeric: 'tabular-nums' } }, '0:00');
  const endLab = h('span', { style: { fontSize: '12px', opacity: .7 } }, '1:19');
  const prog = h('div', { style: { flex: 1, height: '3px', background: '#ffffff22', borderRadius: '2px', position: 'relative', maxWidth: '280px' } },
    h('div', { style: { position: 'absolute', left: 0, top: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: '#fff' } }));
  const playBtn = h('button', {
    style: { background: 'none', border: 0, color: '#fff', fontSize: '16px', cursor: 'pointer', padding: '4px 8px' },
    onclick: () => { if (!started) begin(); else { playing = !playing; playBtn.textContent = playing ? '❚❚' : '▶'; } },
  }, '▶');

  const dock = h('div.k-row', {
    style: {
      position: 'absolute', left: 0, right: 0, bottom: 0, height: '72px',
      background: '#000', padding: '0 22px', gap: '16px', zIndex: 5,
    },
  },
    titleLab,
    h('span', { style: { flex: 1 } }),
    playBtn,
    h('button', { style: { background: 'none', border: 0, color: '#fff', cursor: 'pointer', fontSize: '14px' }, onclick: () => switchTrack((ti - 1 + TRACKS.length) % TRACKS.length) }, '⏮'),
    h('button', { style: { background: 'none', border: 0, color: '#fff', cursor: 'pointer', fontSize: '14px' }, onclick: () => switchTrack((ti + 1) % TRACKS.length) }, '⏭'),
    timeLab, prog, endLab,
    h('span', { style: { flex: 1 } }),
    h('span', { style: { fontSize: '18px', opacity: .85 } }, '☝️'),
  );

  const landing = h('div', {
    style: {
      position: 'absolute', inset: 0, bottom: '72px', zIndex: 4,
      display: 'grid', placeItems: 'center', background: '#0b0617cc', cursor: 'pointer',
    },
    onclick: () => begin(),
  },
    h('div', { style: { textAlign: 'center', display: 'grid', gap: '14px' } },
      h('div', { style: { fontSize: '64px', opacity: .85 } }, '▶'),
      h('div', { style: { fontSize: '14px', opacity: .75 } }, 'Please turn up your volume'),
      h('div', { style: { fontSize: '13px', opacity: .45 } }, "You're listening to George & Jonathan III"),
      h('div', { style: { fontSize: '11px', opacity: .35, marginTop: '8px' } }, 'drag to orbit · click track list'),
    ),
  );

  const list = h('div', {
    style: {
      position: 'absolute', right: '16px', top: '56px', bottom: '88px', width: '220px',
      overflow: 'auto', zIndex: 3, fontSize: '12px', opacity: .9,
      background: '#0b0617aa', borderRadius: '10px', padding: '10px 8px',
      border: '1px solid #ffffff10', backdropFilter: 'blur(8px)',
    },
  });
  const paintList = () => {
    list.replaceChildren(
      h('div', { style: { fontSize: '10px', letterSpacing: '.12em', opacity: .45, padding: '4px 8px 10px' } }, 'ALBUM III'),
      ...TRACKS.map((t, i) => h('div', {
        style: {
          padding: '8px 10px', borderRadius: '6px', cursor: 'pointer',
          background: i === ti ? '#ffffff14' : 'transparent',
          fontWeight: i === ti ? 700 : 500,
        },
        onclick: () => { switchTrack(i); if (!started) begin(); },
      }, `${i + 1}. ${t.name}`)),
      h('div', {
        style: { marginTop: '14px', padding: '10px', fontSize: '11px', opacity: .4, lineHeight: 1.5, borderTop: '1px solid #ffffff10' },
      }, 'Soft pastel note blocks float in the dark. Drag the stage to move the camera. Each track loops a short Web Audio melody — no external files.'),
    );
  };
  paintList();

  const topBar = h('div.k-row', {
    style: { position: 'absolute', top: 0, left: 0, right: 0, height: '48px', padding: '0 18px', zIndex: 3, fontSize: '12px', opacity: .7 },
  },
    h('b', { style: { letterSpacing: '.14em' } }, 'GEORGE & JONATHAN'),
    h('span', { style: { flex: 1 } }),
    h('span', {}, 'III · interactive album'),
  );

  const switchTrack = (i) => {
    ti = i;
    noteI = 0;
    titleLab.textContent = `${i + 1}. ${TRACKS[i].name.toUpperCase()}`;
    rebuildNotes();
    paintList();
  };

  const begin = () => {
    started = true;
    playing = true;
    playBtn.textContent = '❚❚';
    landing.style.display = 'none';
    audio();
  };

  S.on((t) => {
    noteGroup.rotation.y = t * 0.08;
    bars.forEach((m, i) => {
      const pulse = playing ? Math.sin(t * 3 + m.userData.phase) * 0.15 : 0;
      m.position.y = m.userData.baseY + pulse;
      m.scale.y = 1 + (playing ? Math.abs(Math.sin(t * 4 + i)) * 0.2 : 0);
    });
    if (playing) {
      const tr = TRACKS[ti];
      const step = 60 / tr.bpm;
      if (t - lastBlip >= step) {
        lastBlip = t;
        const midiN = tr.notes[noteI % tr.notes.length];
        blip(440 * 2 ** ((midiN - 69) / 12), 0.14, 'triangle', 0.08);
        noteI++;
        const secs = noteI * step;
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        timeLab.textContent = `${m}:${String(s).padStart(2, '0')}`;
        const pct = Math.min(100, (secs % 79) / 79 * 100);
        prog.firstChild.style.left = `calc(${pct}% - 4px)`;
      }
    }
  });

  root.append(world, topBar, list, landing, dock);

  window.__demoProof = async () => {
    begin();
    switchTrack(2);
    camYaw += 0.8; camPitch = 0.55; updateCam();
    await sleep(200);
    switchTrack(0);
    playing = false; playBtn.textContent = '▶';
    landing.style.display = 'grid'; started = false;
    camYaw = 0.35; camPitch = 0.45; camDist = 14; updateCam();
    return 'orbit camera + track switch + melody; restored landing';
  };
};

V['toootegram-playlist-zoo'] = (root, T) => {
  theme(root, T, { bg: '#fc8dd1', fg: '#141414', panel: '#cabdff', ac: '#fae76e', dark: false });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter Variable', system-ui, sans-serif";

  const ANIMALS = [
    { name: 'Mochi Bear', emoji: '🐻', color: 0xffb4a2, notes: [60, 64, 67, 72, 67, 64], bpm: 96 },
    { name: 'Lulu Fox', emoji: '🦊', color: 0xff9f6b, notes: [62, 65, 69, 74, 69, 65], bpm: 110 },
    { name: 'Pudding Cat', emoji: '🐱', color: 0xfae76e, notes: [57, 60, 64, 69, 64, 60], bpm: 88 },
    { name: 'Boba Bunny', emoji: '🐰', color: 0xcabdff, notes: [55, 59, 62, 67, 62, 59], bpm: 120 },
    { name: 'Soda Bird', emoji: '🐦', color: 0x69b5db, notes: [64, 67, 71, 76, 71, 67], bpm: 104 },
    { name: 'Mango Dog', emoji: '🐶', color: 0xffd27a, notes: [53, 57, 60, 65, 60, 57], bpm: 100 },
    { name: 'Gummy Frog', emoji: '🐸', color: 0x86efac, notes: [58, 62, 65, 70, 65, 62], bpm: 92 },
    { name: 'Taro Panda', emoji: '🐼', color: 0xe8e0f8, notes: [52, 55, 59, 64, 59, 55], bpm: 84 },
  ];

  let ti = 0;
  let playing = false;
  let noteI = 0;
  let lastBlip = 0;
  let inZoo = false;

  // kaleidoscope landing
  const landing = h('div', {
    style: {
      position: 'absolute', inset: 0, zIndex: 6, display: 'grid', placeItems: 'center',
      background: `
        repeating-conic-gradient(from 0deg at 50% 50%,
          #fc8dd1 0deg 20deg, #69b5db 20deg 40deg, #fae76e 40deg 60deg,
          #cabdff 60deg 80deg, #ffb4a2 80deg 100deg, #e8e0f8 100deg 120deg)`,
      cursor: 'pointer',
    },
    onclick: () => enterZoo(),
  },
    h('div', { style: { textAlign: 'center', display: 'grid', gap: '14px', padding: '24px' } },
      h('div', { style: { fontSize: '12px', letterSpacing: '.2em', opacity: .55, fontWeight: 700 } }, 'THIS IS A'),
      h('div', { style: { fontSize: '42px', fontWeight: 900, color: '#3dd6ff', letterSpacing: '-.02em', textShadow: '2px 2px 0 #fff' } }, 'NON-VERBAL PLAYABLE'),
      h('div', { style: { fontSize: '36px', fontWeight: 700, color: '#fae76e', fontFamily: 'Georgia,serif', marginTop: '-8px' } }, 'Playlist Site.'),
      h('div', { style: { fontSize: '12px', lineHeight: 1.7, opacity: .65, fontWeight: 600, marginTop: '8px' } },
        'EVERY TAP TWIST OR SOUND', h('br'), 'LEADS TO A NEW DISCOVERY', h('br'), h('br'),
        'TOUCH THE SCREEN', h('br'), 'FEEL THE RHYTHM', h('br'), 'AND FIND WHAT\'S HIDDEN INSIDE'),
      h('button', {
        style: {
          margin: '18px auto 0', background: '#fae76e', border: '3px solid #5b3cff',
          color: '#5b3cff', fontWeight: 900, fontSize: '18px', padding: '12px 36px',
          cursor: 'pointer', letterSpacing: '.04em',
        },
        onclick: (e) => { e.stopPropagation(); enterZoo(); },
      }, '◀ enter zoo ▶'),
    ),
  );

  const world = h('div', { style: { position: 'absolute', inset: 0, bottom: '78px' } });
  const S = stage(world, { bg: '#1a1028' });
  S.cam.position.set(0, 6, 14);
  lights(S.scene, 0.7);
  S.scene.add(new THREE.AmbientLight(0xff88cc, 0.45));

  // ground disk
  {
    const g = new THREE.Mesh(
      new THREE.CircleGeometry(9, 48),
      new THREE.MeshStandardMaterial({ color: 0x2a1840, roughness: 0.85 }),
    );
    g.rotation.x = -Math.PI / 2;
    g.receiveShadow = true;
    S.scene.add(g);
  }

  const group = new THREE.Group();
  S.scene.add(group);
  const meshes = [];

  const makeAnimal = (a, i) => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 24, 24),
      new THREE.MeshStandardMaterial({ color: a.color, roughness: 0.45, metalness: 0.05 }),
    );
    body.scale.set(1, 0.9, 1.1);
    body.castShadow = true;
    g.add(body);
    // ears / accents
    const earGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const earMat = new THREE.MeshStandardMaterial({ color: a.color, roughness: 0.5 });
    const earL = new THREE.Mesh(earGeo, earMat); earL.position.set(-0.35, 0.5, 0.1); g.add(earL);
    const earR = new THREE.Mesh(earGeo, earMat); earR.position.set(0.35, 0.5, 0.1); g.add(earR);
    // eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x141414 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat); eyeL.position.set(-0.18, 0.15, 0.48); g.add(eyeL);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), eyeMat); eyeR.position.set(0.18, 0.15, 0.48); g.add(eyeR);
    // ring pedestal
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.05, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0xfae76e, emissive: 0xfae76e, emissiveIntensity: 0.2 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.55;
    g.add(ring);

    const ang = (i / ANIMALS.length) * Math.PI * 2;
    const rad = 4.2;
    g.position.set(Math.cos(ang) * rad, 0.7, Math.sin(ang) * rad);
    g.userData.i = i;
    g.userData.baseY = 0.7;
    g.userData.phase = i * 0.7;
    group.add(g);
    meshes.push(g);
    return g;
  };
  ANIMALS.forEach(makeAnimal);

  // raycast select
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  world.addEventListener('pointerdown', (e) => {
    if (!inZoo) return;
    const r = world.getBoundingClientRect();
    ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(ptr, S.cam);
    const hits = ray.intersectObjects(meshes, true);
    if (hits.length) {
      let obj = hits[0].object;
      while (obj && obj.userData.i == null) obj = obj.parent;
      if (obj) selectTrack(obj.userData.i, true);
    }
  });

  const titleLab = h('b', { style: { fontSize: '14px' } }, `${ANIMALS[0].emoji} ${ANIMALS[0].name}`);
  const playBtn = h('button', {
    style: { background: '#fae76e', border: '2px solid #141414', borderRadius: '99px', width: '42px', height: '42px', fontSize: '16px', cursor: 'pointer', fontWeight: 800 },
    onclick: () => togglePlay(),
  }, '▶');

  const dock = h('div.k-row', {
    style: {
      position: 'absolute', left: 0, right: 0, bottom: 0, height: '78px',
      background: '#141414', color: '#fff', padding: '0 20px', gap: '14px', zIndex: 5,
    },
  },
    titleLab,
    h('span', { style: { flex: 1, fontSize: '11px', opacity: .45 } }, 'TOOOTEGRAM · playable playlist zoo'),
    h('button', { style: { background: 'none', border: 0, color: '#fff', fontSize: '18px', cursor: 'pointer' }, onclick: () => selectTrack((ti - 1 + ANIMALS.length) % ANIMALS.length, true) }, '⏮'),
    playBtn,
    h('button', { style: { background: 'none', border: 0, color: '#fff', fontSize: '18px', cursor: 'pointer' }, onclick: () => selectTrack((ti + 1) % ANIMALS.length, true) }, '⏭'),
  );

  const chips = h('div', {
    style: {
      position: 'absolute', left: '14px', top: '54px', zIndex: 4, display: 'grid', gap: '6px',
      maxHeight: 'calc(100% - 140px)', overflow: 'auto',
    },
  });
  const paintChips = () => {
    chips.replaceChildren(...ANIMALS.map((a, i) => h('button', {
      style: {
        border: i === ti ? '2px solid #141414' : '2px solid #ffffff55',
        background: i === ti ? '#fae76e' : '#ffffffcc',
        color: '#141414', borderRadius: '99px', padding: '6px 12px',
        fontWeight: 700, fontSize: '12px', cursor: 'pointer', textAlign: 'left',
        backdropFilter: 'blur(6px)',
      },
      onclick: () => selectTrack(i, true),
    }, `${a.emoji} ${a.name}`)));
  };
  paintChips();

  const topBar = h('div.k-row', {
    style: { position: 'absolute', top: 0, left: 0, right: 0, height: '48px', padding: '0 16px', zIndex: 4, fontSize: '12px', fontWeight: 800 },
  },
    h('span', { style: { background: '#fae76e', border: '2px solid #141414', padding: '4px 10px' } }, 'TOOOTEGRAM'),
    h('span', { style: { flex: 1 } }),
    h('span', { style: { opacity: .7 } }, 'tap an animal · next / prev'),
  );

  const selectTrack = (i, autoPlay = false) => {
    ti = i;
    noteI = 0;
    titleLab.textContent = `${ANIMALS[i].emoji} ${ANIMALS[i].name}`;
    paintChips();
    if (autoPlay) { playing = true; playBtn.textContent = '❚❚'; audio(); }
  };
  const togglePlay = () => {
    audio();
    playing = !playing;
    playBtn.textContent = playing ? '❚❚' : '▶';
  };
  const enterZoo = () => {
    inZoo = true;
    landing.style.display = 'none';
    audio();
    playing = true;
    playBtn.textContent = '❚❚';
  };

  S.on((t) => {
    group.rotation.y = t * 0.12;
    meshes.forEach((m, i) => {
      const sel = i === ti && playing;
      m.position.y = m.userData.baseY + Math.sin(t * 2 + m.userData.phase) * (sel ? 0.35 : 0.12);
      m.scale.setScalar(sel ? 1.18 : 1);
      m.rotation.y = sel ? t * 1.5 : Math.sin(t + i) * 0.2;
    });
    S.cam.position.x = Math.sin(t * 0.15) * 2;
    S.cam.lookAt(0, 0.8, 0);
    if (playing && inZoo) {
      const tr = ANIMALS[ti];
      const step = 60 / tr.bpm;
      if (t - lastBlip >= step) {
        lastBlip = t;
        const n = tr.notes[noteI % tr.notes.length];
        blip(440 * 2 ** ((n - 69) / 12), 0.14, 'triangle', 0.09);
        noteI++;
      }
    }
  });

  root.append(world, topBar, chips, dock, landing);

  window.__demoProof = async () => {
    enterZoo();
    selectTrack(2, true);
    await sleep(400);
    selectTrack(5, true);
    await sleep(200);
    playing = false; playBtn.textContent = '▶';
    selectTrack(0, false);
    landing.style.display = 'grid'; inZoo = false;
    return 'entered zoo · switched animals · melody · restored landing';
  };
};

V['lusion-3d-studio-stage'] = (root, T) => {
  theme(root, T, { bg: '#e8e6ec', fg: '#121214', panel: '#f4f3f7', ac: '#2f6bff', dark: false, line: '#00000014' });
  root.style.overflow = 'hidden';
  root.style.fontFamily = "'Inter Variable', system-ui, sans-serif";
  root.style.background = '#e8e6ec';

  const ACCENTS = [
    { id: 'blue', label: 'Electric', hex: 0x2f6bff, chip: '#2f6bff' },
    { id: 'coral', label: 'Coral', hex: 0xff5c6c, chip: '#ff5c6c' },
    { id: 'mint', label: 'Mint', hex: 0x3dd6a5, chip: '#3dd6a5' },
    { id: 'violet', label: 'Violet', hex: 0x7c5cff, chip: '#7c5cff' },
  ];
  let accentI = 0;
  let seed = 7;
  const rand = rng(seed);

  const frame = h('div', {
    style: {
      position: 'absolute', left: '4%', right: '4%', top: '11%', bottom: '14%',
      borderRadius: '36px', overflow: 'hidden', background: '#0c0c0e',
      boxShadow: '0 28px 80px #00000022, 0 2px 0 #ffffff88 inset',
    },
  });
  const S = stage(frame, { bg: '#0c0c0e' });
  S.cam.position.set(0, 1.2, 7.2);
  S.cam.fov = 42; S.cam.updateProjectionMatrix();
  S.r.toneMapping = THREE.ACESFilmicToneMapping;
  S.r.toneMappingExposure = 1.15;
  S.r.shadowMap.enabled = true;

  S.scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4.5, 8, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  S.scene.add(key);
  const fill = new THREE.DirectionalLight(0xa8b4ff, 0.55);
  fill.position.set(-5, 2, -3); S.scene.add(fill);
  const rim = new THREE.PointLight(0xffffff, 18, 20);
  rim.position.set(-2, 3, 4); S.scene.add(rim);

  const cluster = new THREE.Group();
  S.scene.add(cluster);
  const pieces = [];

  const matFor = (c) => new THREE.MeshPhysicalMaterial({
    color: c, metalness: 0.15, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08,
    reflectivity: 0.9,
  });

  const makeJack = (color, scale = 1) => {
    const g = new THREE.Group();
    const arm = (axis) => {
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 1.35 * scale, 24),
        matFor(color),
      );
      cyl.castShadow = true; cyl.receiveShadow = true;
      if (axis === 'x') cyl.rotation.z = Math.PI / 2;
      if (axis === 'z') cyl.rotation.x = Math.PI / 2;
      g.add(cyl);
      // flat end caps with recessed hole
      [-1, 1].forEach((s) => {
        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22 * scale, 0.22 * scale, 0.06 * scale, 24),
          matFor(color),
        );
        cap.castShadow = true;
        if (axis === 'y') cap.position.y = s * 0.68 * scale;
        if (axis === 'x') { cap.rotation.z = Math.PI / 2; cap.position.x = s * 0.68 * scale; }
        if (axis === 'z') { cap.rotation.x = Math.PI / 2; cap.position.z = s * 0.68 * scale; }
        g.add(cap);
        const hole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.07 * scale, 0.07 * scale, 0.08 * scale, 16),
          new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 }),
        );
        if (axis === 'y') hole.position.y = s * 0.7 * scale;
        if (axis === 'x') { hole.rotation.z = Math.PI / 2; hole.position.x = s * 0.7 * scale; }
        if (axis === 'z') { hole.rotation.x = Math.PI / 2; hole.position.z = s * 0.7 * scale; }
        g.add(hole);
      });
    };
    arm('x'); arm('y'); arm('z');
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.28 * scale, 24, 24), matFor(color));
    core.castShadow = true; g.add(core);
    return g;
  };

  const COLORS = () => [0x111111, 0xf4f4f6, ACCENTS[accentI].hex];

  const rebuild = (newSeed = seed) => {
    seed = newSeed;
    const r = rng(seed);
    while (pieces.length) {
      const p = pieces.pop();
      cluster.remove(p);
      p.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose?.(); });
    }
    const cols = COLORS();
    const N = 11;
    for (let i = 0; i < N; i++) {
      const c = cols[i % cols.length];
      const jack = makeJack(c, 0.55 + r() * 0.55);
      const ang = r() * Math.PI * 2;
      const rad = 0.3 + r() * 1.9;
      jack.position.set(Math.cos(ang) * rad, (r() - 0.45) * 1.6, Math.sin(ang) * rad * 0.85);
      jack.rotation.set(r() * Math.PI, r() * Math.PI, r() * Math.PI);
      cluster.add(jack);
      pieces.push(jack);
    }
  };
  rebuild();

  const oc = new OrbitControls(S.cam, S.r.domElement);
  oc.enableDamping = true; oc.dampingFactor = 0.06;
  oc.minDistance = 4; oc.maxDistance = 14;
  oc.autoRotate = true; oc.autoRotateSpeed = 0.55;
  oc.target.set(0, 0.2, 0);
  S.on(() => oc.update());

  const wordmark = h('div', {
    style: {
      position: 'absolute', top: '22px', left: '28px', zIndex: 4,
      fontWeight: 800, letterSpacing: '.18em', fontSize: '13px', color: '#121214',
    },
  }, 'LUSION');

  const chips = h('div.k-row', {
    style: {
      position: 'absolute', left: '50%', bottom: '28px', transform: 'translateX(-50%)',
      gap: '8px', zIndex: 4, flexWrap: 'wrap', justifyContent: 'center',
    },
  });
  const paintChips = () => {
    chips.replaceChildren(
      ...ACCENTS.map((a, i) => h('button', {
        style: {
          border: i === accentI ? '2px solid #121214' : '1px solid #00000022',
          background: i === accentI ? a.chip : '#ffffffcc',
          color: i === accentI ? '#fff' : '#121214',
          borderRadius: '99px', padding: '8px 14px', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        },
        onclick: () => { accentI = i; rebuild(seed); paintChips(); toast(a.label + ' accent'); },
      }, a.label)),
      h('button', {
        style: {
          border: '1px solid #00000022', background: '#121214', color: '#fff',
          borderRadius: '99px', padding: '8px 14px', fontWeight: 700, fontSize: '12px', cursor: 'pointer',
        },
        onclick: () => { rebuild((seed * 1103515245 + 12345) >>> 0); toast('reshuffled'); },
      }, 'Reshuffle ✦'),
    );
  };
  paintChips();

  const hint = h('div', {
    style: {
      position: 'absolute', right: '28px', top: '22px', zIndex: 4,
      fontSize: '11px', opacity: .45, fontWeight: 600, letterSpacing: '.04em',
    },
  }, 'drag to orbit · chips recolor');

  const foot = h('div', {
    style: {
      position: 'absolute', left: '28px', bottom: '28px', zIndex: 4,
      fontSize: '11px', opacity: .4, fontWeight: 600,
    },
  }, 'Studio stage · glossy jack cluster');

  root.append(wordmark, frame, chips, hint, foot);

  window.__demoProof = async () => {
    const prev = accentI;
    const prevSeed = seed;
    accentI = 1; rebuild(42); paintChips();
    oc.autoRotateSpeed = 1.4;
    await sleep(350);
    accentI = 2; rebuild(99); paintChips();
    await sleep(200);
    accentI = prev; rebuild(prevSeed); paintChips();
    oc.autoRotateSpeed = 0.55;
    return 'orbit stage · accent chips · reshuffle · restored';
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['3d-blob-param-mixer'])(root, T); }
