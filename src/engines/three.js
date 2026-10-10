import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/space-grotesk';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import '@fontsource/press-start-2p';
import { h, s, drag, clamp, toast, sleep, noise2, fitCanvas, blip, audio, rng, pick, css } from '../lib.js';
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

// ---------- Abeto Messenger tiny-planet delivery world (2026-10-05 08:00 KST)
V['abeto-messenger-tiny-planet'] = (root, T) => {
  theme(root, T, { bg: '#65c1bc', fg: '#1d2a28', panel: '#ffffffd9', ac: '#f2c94c', dark: false, line: '#00000022' });
  root.style.overflow = 'hidden';
  root.style.background = 'radial-gradient(circle at 50% 46%, #7fd3cb 0 22%, #69c4be 38%, #61bdb8 70%)';
  const PX = "'Press Start 2P', monospace";
  root.append(h('style', {}, `
    .ab-specks{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(#d9fff8 1.2px,transparent 1.6px),radial-gradient(#bff3ea 1px,transparent 1.4px);background-size:97px 89px,61px 71px;background-position:13px 7px,40px 30px;opacity:.7}
    .ab-cloud{position:absolute;border-radius:50%;background:#7ed3ca;filter:blur(2px);opacity:.55;pointer-events:none}
    .ab-title{position:absolute;left:50%;top:47%;transform:translate(-50%,-50%);display:grid;grid-template-columns:repeat(3,96px);gap:8px 14px;pointer-events:none;z-index:3;transition:opacity .6s, transform .8s}
    .ab-title span{font:400 84px/96px ${PX};text-align:center;color:#f4f2e8;-webkit-text-stroke:3px #2f3433;text-shadow:5px 5px 0 #c9c7bb,6px 6px 0 #2f3433,9px 9px 0 #2f343355}
    .ab-begin{position:absolute;left:50%;top:calc(47% + 268px);transform:translate(-50%,0) rotate(-1.5deg);z-index:4;background:#f2c84b;border:3px solid #a8822b;border-radius:3px;box-shadow:0 5px 0 #a8822b,0 10px 18px #0002;font:400 15px/1 ${PX};color:#fff8e2;-webkit-text-stroke:1px #8a6a20;padding:16px 34px;cursor:pointer;letter-spacing:.06em;transition:transform .15s, opacity .5s}
    .ab-begin:hover{transform:translate(-50%,-3px) rotate(-1.5deg)}
    .ab-load{position:absolute;inset:0;background:#fff;display:grid;place-items:center;z-index:9;transition:opacity .5s}
    .ab-load div{font:400 11px/1 ${PX};color:#555;letter-spacing:.08em;text-align:center}
    .ab-hud{position:absolute;left:18px;top:16px;z-index:5;display:none;gap:10px;align-items:center;background:#fffbea;border:3px solid #2f3433;border-radius:6px;padding:10px 14px;font:400 12px/1 ${PX};color:#2f3433;box-shadow:4px 4px 0 #2f3433}
    .ab-tip{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:5;display:none;font:400 10px/1.6 ${PX};color:#fffbea;text-shadow:2px 2px 0 #2f3433;text-align:center;pointer-events:none}
    .ab-pad{position:absolute;right:28px;bottom:28px;width:120px;height:120px;border-radius:50%;background:#fffbea55;border:3px solid #2f3433aa;z-index:5;display:none;touch-action:none;cursor:grab}
    .ab-pad i{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px;border-radius:50%;background:#f2c84b;border:3px solid #2f3433}
    .ab-menu{position:absolute;right:18px;top:16px;z-index:5;display:none;gap:8px}
    .ab-menu button{font:400 10px/1 ${PX};background:#fffbea;border:3px solid #2f3433;border-radius:6px;padding:9px 10px;cursor:pointer;box-shadow:3px 3px 0 #2f3433;color:#2f3433}
  `));
  root.append(h('div.ab-specks'), ...[[8, 70, 220, 90], [70, 12, 260, 110], [80, 78, 200, 80], [14, 20, 180, 70]].map(([x, y, w, hh]) => h('div.ab-cloud', { style: { left: x + '%', top: y + '%', width: w + 'px', height: hh + 'px' } })));
  const S = stage(root, { alpha: true }); S.r.setClearColor(0x000000, 0); S.r.domElement.style.zIndex = 1;
  const scene = S.scene, cam = S.cam;
  scene.add(new THREE.HemisphereLight(0xfffff4, 0x3f7f78, 1.25)); const sun = new THREE.DirectionalLight(0xffffff, 1.5); sun.position.set(6, 12, 9); scene.add(sun);
  const R = 5; const world = new THREE.Group(); scene.add(world);
  const toon = (c) => new THREE.MeshToonMaterial({ color: c });
  const INK = new THREE.MeshBasicMaterial({ color: 0x2f3433, side: THREE.BackSide });
  const inked = (geo, mat, k = 1.06) => { const g = new THREE.Group(); const m = new THREE.Mesh(geo, mat); const o = new THREE.Mesh(geo, INK); o.scale.setScalar(k); g.add(m, o); return g; };
  // planet with painted patches
  const pg = new THREE.IcosahedronGeometry(R, 5); const nz = noise2(9); const col = []; const pos = pg.attributes.position; const cc = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i); const n = nz(x * 0.35 + 3, y * 0.35 + z * 0.3); const n2 = nz(z * 0.5 + 9, x * 0.5 - y * 0.2);
    cc.set(n > 0.62 ? '#c9b48c' : n2 > 0.68 ? '#b3a989' : n < 0.32 ? '#3f7d45' : '#5c9e4e'); col.push(cc.r, cc.g, cc.b); }
  pg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  const planet = inked(pg, new THREE.MeshToonMaterial({ vertexColors: true }), 1.025); world.add(planet);
  const shallow = new THREE.Mesh(new THREE.SphereGeometry(R * 1.32, 48, 32), new THREE.MeshBasicMaterial({ color: 0x8fdccf, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.BackSide })); shallow.renderOrder = -1; scene.add(shallow);
  const rnd = rng(42); const up = new THREE.Vector3(0, 1, 0);
  const placeOn = (obj, dir, lift = 0) => { dir = dir.clone().normalize(); obj.position.copy(dir).multiplyScalar(R + lift); obj.quaternion.setFromUnitVectors(up, dir); obj.rotateY(rnd() * Math.PI * 2); world.add(obj); return obj; };
  const randDir = () => new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).normalize();
  const WALLS = ['#f4efe2', '#f2c9c0', '#e8e2cf', '#cfe3e6', '#f6dca8', '#d7d1e8'], ROOFS = ['#c9524a', '#8a6e5a', '#4f7da0', '#d98f4e', '#6b8f71'];
  function house(big) { const g = new THREE.Group(); const w = big ? 0.7 + rnd() * 0.35 : 0.6 + rnd() * 0.3, hh = big ? 1.0 + rnd() * 0.9 : 0.55 + rnd() * 0.3;
    const body = inked(new THREE.BoxGeometry(w, hh, w * (0.8 + rnd() * 0.4)), toon(pick(WALLS, rnd)), 1.05); body.position.y = hh / 2; g.add(body);
    if (!big) { const roof = inked(new THREE.ConeGeometry(w * 0.82, 0.5, 4), toon(pick(ROOFS, rnd)), 1.06); roof.position.y = hh + 0.25; roof.rotation.y = Math.PI / 4; g.add(roof); }
    else { for (let k = 0; k < 3; k++) { const win = new THREE.Mesh(new THREE.BoxGeometry(w * 1.01, 0.12, w * 0.5), toon('#4d5b63')); win.position.y = 0.5 + k * hh * 0.28; g.add(win); } const tank = inked(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8), toon('#8fc7a0')); tank.position.set(w * 0.2, hh + 0.15, 0); g.add(tank); }
    return g; }
  function tree() { const g = new THREE.Group(); const t = inked(new THREE.CylinderGeometry(0.06, 0.09, 0.45, 6), toon('#7a5a3c')); t.position.y = 0.22; const c = inked(new THREE.IcosahedronGeometry(0.32 + rnd() * 0.2, 0), toon(pick(['#3f8a46', '#5aa34f', '#2f7a43'], rnd))); c.position.y = 0.62; g.add(t, c); return g; }
  const used = [up.clone(), up.clone()];
  const free = (d, min) => used.every((u) => u.angleTo(d) > min);
  for (let i = 0; i < 26; i++) { let d; let k = 0; do { d = randDir(); } while (!free(d, 0.32) && ++k < 40); used.push(d); placeOn(house(i % 3 === 0), d); }
  for (let i = 0; i < 70; i++) { let d; let k = 0; do { d = randDir(); } while (!free(d, 0.16) && ++k < 30); used.push(d); placeOn(tree(), d); }
  // delivery targets: mailboxes with floating envelopes
  const targets = [];
  const envGeo = new THREE.BoxGeometry(0.5, 0.34, 0.06);
  for (let i = 0; i < 5; i++) { let d; let k = 0; do { d = randDir(); } while ((!free(d, 0.3) || d.y > 0.85) && ++k < 60); used.push(d);
    const g = new THREE.Group(); const hs = house(false); g.add(hs); const post = inked(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), toon('#555')); post.position.set(0.65, 0.25, 0.2); const box = inked(new THREE.BoxGeometry(0.22, 0.18, 0.3), toon('#d64a3a')); box.position.set(0.65, 0.55, 0.2); g.add(post, box);
    const env = new THREE.Group(); const e1 = inked(envGeo, toon('#fffbea'), 1.12); const flap = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.16, 3), toon('#e6dcc0')); flap.rotation.z = Math.PI; flap.position.set(0, 0.06, 0.04); flap.scale.z = 0.2; env.add(e1, flap); env.position.y = 1.9; g.add(env);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.75, 0.95, 32), new THREE.MeshBasicMaterial({ color: 0xf2c84b, transparent: true, opacity: 0.8, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; g.add(ring);
    placeOn(g, d); targets.push({ g, env, ring, dir: d.clone(), done: false }); }
  // courier character (stays at the top of the planet; the world turns beneath)
  const hero = new THREE.Group(); const body = inked(new THREE.CapsuleGeometry(0.22, 0.32, 4, 10), toon('#3c6fb6')); body.position.y = 0.42;
  const head = inked(new THREE.SphereGeometry(0.2, 14, 10), toon('#f2d2b0')); head.position.y = 0.92; const cap = inked(new THREE.CylinderGeometry(0.21, 0.21, 0.1, 14), toon('#e0473a')); cap.position.y = 1.06; const brim = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.16), toon('#e0473a')); brim.position.set(0, 1.03, 0.2);
  const bag = inked(new THREE.BoxGeometry(0.28, 0.24, 0.12), toon('#c99a5b')); bag.position.set(0.18, 0.42, -0.16); bag.rotation.y = 0.4;
  const legs = [-0.09, 0.09].map((x) => { const l = inked(new THREE.CylinderGeometry(0.06, 0.06, 0.24, 6), toon('#2b3d5c')); l.position.set(x, 0.12, 0); return l; });
  hero.add(body, head, cap, brim, bag, ...legs); hero.position.set(0, R, 0); hero.visible = false; scene.add(hero);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.32, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22 })); shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, R + 0.02, 0); shadow.visible = false; scene.add(shadow);
  // UI
  const title = h('div.ab-title', {}, [...'MESSENGER'].map((c) => h('span', {}, c)));
  const begin = h('button.ab-begin', { onclick: () => start() }, 'BEGIN');
  const hud = h('div.ab-hud', {}, h('span', { style: { fontSize: '16px' } }, '✉'), h('span', {}, 'LETTERS '), h('b', {}, '0/5'));
  const tip = h('div.ab-tip', {}, 'WASD / ARROWS or drag the pad to walk', h('br'), 'deliver ✉ to the glowing mailboxes');
  const knob = h('i'); const pad = h('div.ab-pad', {}, knob);
  const menu = h('div.ab-menu', {}, h('button', { onclick: () => reset(true) }, '⟲ TITLE'), h('button', { onclick: () => toast('Messenger — a tiny planet by Abeto') }, 'ⓘ'));
  const load = h('div.ab-load', {}, h('div', {}, s('svg', { width: 60, height: 50, viewBox: '0 0 60 50', style: 'display:block;margin:0 auto 12px' }, s('path', { d: 'M8 12 L52 9 L53 42 L9 44 Z M8 12 L30 30 L52 9', fill: 'none', stroke: '#555', 'stroke-width': 2.4, 'stroke-linejoin': 'round' })), 'LOADING'));
  root.append(title, begin, hud, tip, pad, menu, load);
  setTimeout(() => { load.style.opacity = 0; setTimeout(() => load.remove(), 500); }, 700);
  // state
  let mode = 'title', heading = 0, delivered = 0; const keys = new Set(); const joy = { x: 0, y: 0 };
  const camTitle = { p: new THREE.Vector3(0, 0, 25), l: new THREE.Vector3(0, 0, 0) }, camGame = { p: new THREE.Vector3(0, R + 6.4, 8.6), l: new THREE.Vector3(0, R - 0.8, 0) };
  const camP = camTitle.p.clone(), camL = camTitle.l.clone(); let tw = 0;
  const hudN = hud.querySelector('b');
  function start() { if (mode === 'game') return; mode = 'game'; title.style.opacity = 0; title.style.transform = 'translate(-50%,-50%) scale(1.15)'; begin.style.opacity = 0; begin.style.pointerEvents = 'none'; hero.visible = shadow.visible = true; [hud, menu].forEach((e) => (e.style.display = 'flex')); tip.style.display = 'block'; pad.style.display = 'block'; tw = 0; try { blip(660, 0.12, 'square', 0.05); } catch {} }
  function reset(toTitle) { world.quaternion.identity(); heading = 0; delivered = 0; hudN.textContent = '0/5'; targets.forEach((t) => { t.done = false; t.env.visible = true; t.ring.visible = true; t.env.scale.setScalar(1); }); if (toTitle) { mode = 'title'; title.style.opacity = 1; title.style.transform = 'translate(-50%,-50%)'; begin.style.opacity = 1; begin.style.pointerEvents = ''; hero.visible = shadow.visible = false; [hud, menu, tip, pad].forEach((e) => (e.style.display = 'none')); tw = 0; } }
  addEventListener('keydown', (e) => { const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) { keys.add(k); if (mode === 'game') e.preventDefault(); } if (k === 'enter' && mode === 'title') start(); });
  addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
  drag(pad, { move: (e) => { const r = pad.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / 45, y = (e.clientY - r.top - r.height / 2) / 45; const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; } joy.x = x; joy.y = y; knob.style.transform = `translate(${x * 36}px,${y * 36}px)`; }, end: () => { joy.x = joy.y = 0; knob.style.transform = ''; } });
  // title-mode orbit drag on the canvas
  let spinV = 0.12; drag(S.r.domElement, { move: (e) => { if (mode !== 'title') return; const q = new THREE.Quaternion().setFromAxisAngle(up, e.movementX * 0.01); const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), e.movementY * 0.01); world.quaternion.premultiply(q).premultiply(q2); spinV = 0; }, end: () => (spinV = 0.12) });
  const tmp = new THREE.Vector3(), heroTop = new THREE.Vector3(0, R, 0);
  function step(dt, fwd, turn) { heading += turn * dt * 2.6; hero.rotation.y = heading; if (fwd) { const d = new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading)); const axis = new THREE.Vector3().crossVectors(d, up).normalize(); world.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, (fwd * dt * 2.4) / R)); } }
  function check() { for (const t of targets) { if (t.done) continue; t.g.getWorldPosition(tmp); if (tmp.distanceTo(heroTop) < 1.25) { t.done = true; delivered++; hudN.textContent = `${delivered}/5`; t.ring.visible = false; toast(delivered === 5 ? 'All letters delivered! ✉✉✉✉✉' : `Letter delivered ✉ ${delivered}/5`); try { blip(880, 0.1, 'square', 0.05); blip(1320, 0.12, 'square', 0.05, 0.08); } catch {} } } }
  let last = 0;
  S.on((t) => { const dt = Math.min(0.05, last ? t - last : 0.016); last = t;
    if (mode === 'title') { world.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(up, spinV * dt)); }
    else { const f = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) - joy.y; const tr = (keys.has('a') || keys.has('arrowleft') ? 1 : 0) - (keys.has('d') || keys.has('arrowright') ? 1 : 0) - joy.x; step(dt, clamp(f, -1, 1), clamp(tr, -1, 1)); const walking = Math.abs(f) > 0.05; legs[0].rotation.x = walking ? Math.sin(t * 14) * 0.6 : 0; legs[1].rotation.x = -legs[0].rotation.x; body.position.y = 0.42 + (walking ? Math.abs(Math.sin(t * 14)) * 0.05 : 0); check(); }
    targets.forEach((tg, i) => { if (!tg.done) { tg.env.position.y = 1.9 + Math.sin(t * 2.5 + i) * 0.15; tg.env.rotation.y = t * 1.5; tg.ring.material.opacity = 0.5 + Math.sin(t * 4) * 0.3; } else if (tg.env.visible) { tg.env.position.y += dt * 4; tg.env.scale.multiplyScalar(0.94); if (tg.env.scale.x < 0.05) tg.env.visible = false; } });
    tw = Math.min(1, tw + dt * 0.9); const goal = mode === 'game' ? camGame : camTitle; const k = 1 - Math.pow(1 - tw, 3); camP.lerp(goal.p, 0.04 + k * 0.08); camL.lerp(goal.l, 0.04 + k * 0.08); cam.position.copy(camP); cam.lookAt(camL);
    shallow.visible = mode === 'title' || camP.distanceTo(camTitle.p) < 6; });
  window.__demoProof = async () => {
    start(); await sleep(120);
    // walk forward for a few frames + turn
    for (let i = 0; i < 20; i++) step(0.03, 1, i < 10 ? 0.6 : 0);
    // travel to first mailbox: rotate the world so its normal points up
    const tg = targets[0]; const nWorld = tg.dir.clone().applyQuaternion(world.quaternion).normalize();
    world.quaternion.premultiply(new THREE.Quaternion().setFromUnitVectors(nWorld, up)); check(); await sleep(250);
    const got = delivered;
    reset(true); await sleep(150);
    return `begin → walked tiny planet (rotate world) → delivered ${got}/5 → reset to title`;
  };
};

V['townscaper-procedural-town-builder'] = (root, T) => {
  theme(root, T, { bg: '#bfe0dc', fg: '#24474a', ac: '#e8846b', dark: false });
  root.style.fontFamily = "'Roboto Flex Variable','Inter Variable',system-ui,sans-serif";
  const BG = 0xbfe0dc; const S = stage(root, { bg: '#bfe0dc' }); S.scene.fog = new THREE.Fog(BG, 24, 62);
  S.r.shadowMap.enabled = true; S.r.shadowMap.type = THREE.PCFSoftShadowMap;
  const d = lights(S.scene, 1.05); d.position.set(9, 15, 6); Object.assign(d.shadow.camera, { left: -14, bottom: -14, right: 14, top: 14 }); d.shadow.bias = -0.0006;
  const HOME = [13, 11, 15]; S.cam.position.set(...HOME);
  const ctl = new OrbitControls(S.cam, S.r.domElement); ctl.enableDamping = true; ctl.target.set(0.5, 1, 0.5); ctl.minDistance = 7; ctl.maxDistance = 45; ctl.maxPolarAngle = 1.42; ctl.enablePan = false; ctl.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: -1 };
  const water = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0x8fd0c9, roughness: 0.3, metalness: 0.05 })); water.rotation.x = -Math.PI / 2; water.receiveShadow = true; S.scene.add(water);
  const N = 7; const grid = new THREE.GridHelper(N * 2, N * 2, 0xffffff, 0xffffff); grid.material.transparent = true; grid.material.opacity = 0.22; grid.position.set(0, 0.012, 0); S.scene.add(grid);
  const PAL = ['#f6e7c8', '#f4b8a2', '#ea8d7c', '#f6d67a', '#b9d98d', '#8fc6d9', '#aaa6e2', '#fbf7ef', '#d8b48e'];
  let cur = 1; const town = new Map(); const K = (x, y, z) => `${x},${y},${z}`; const has = (x, y, z) => town.has(K(x, y, z));
  const mats = {}; const mat = (c) => (mats[c] ||= new THREE.MeshStandardMaterial({ color: c, roughness: 0.82 }));
  const darker = (c, k = 0.72) => '#' + new THREE.Color(c).multiplyScalar(k).getHexString();
  const G = { box: new THREE.BoxGeometry(1, 1, 1), plinth: new THREE.BoxGeometry(1.1, 0.16, 1.1), win: new THREE.BoxGeometry(0.24, 0.32, 0.05), sill: new THREE.BoxGeometry(0.32, 0.05, 0.09), post: new THREE.BoxGeometry(0.06, 0.24, 0.06), rail: new THREE.BoxGeometry(1, 0.05, 0.05), slab: new THREE.BoxGeometry(1.06, 0.08, 1.06), chim: new THREE.BoxGeometry(0.16, 0.36, 0.16) };
  const arch = new THREE.Shape(); arch.moveTo(-0.5, -0.5); arch.lineTo(-0.5, 0.5); arch.lineTo(0.5, 0.5); arch.lineTo(0.5, -0.5); arch.lineTo(0.32, -0.5); arch.absarc(0, -0.5, 0.32, 0, Math.PI, false); arch.lineTo(-0.5, -0.5);
  G.arch = new THREE.ExtrudeGeometry(arch, { depth: 1, bevelEnabled: false, curveSegments: 18 }); G.arch.translate(0, 0, -0.5);
  const tri = new THREE.Shape(); tri.moveTo(-0.6, 0); tri.lineTo(0.6, 0); tri.lineTo(0, 0.56); tri.lineTo(-0.6, 0); G.roof = new THREE.ExtrudeGeometry(tri, { depth: 1.12, bevelEnabled: false }); G.roof.translate(0, 0, -0.56);
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]; const hash = (x, y, z) => Math.abs((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) % 97;
  const townG = new THREE.Group(); S.scene.add(townG); let groups = new Map(); const anims = [];
  const part = (g, geo, color, x, y, z, ry = 0) => { const m = new THREE.Mesh(geo, mat(color)); m.position.set(x, y, z); m.rotation.y = ry; m.castShadow = m.receiveShadow = true; g.add(m); return m; };
  const build = (popKey) => {
    townG.clear(); groups = new Map();
    for (const [key, ci] of town) {
      const [x, y, z] = key.split(',').map(Number); const c = PAL[ci]; const g = new THREE.Group(); g.position.set(x + 0.5, y + 0.5, z + 0.5); g.userData.key = key;
      const below = y > 0 && !has(x, y - 1, z), above = has(x, y + 1, z);
      if (below) { const alongX = has(x - 1, y, z) || has(x + 1, y, z); part(g, G.arch, c, 0, 0, 0, alongX ? 0 : Math.PI / 2); }
      else part(g, G.box, c, 0, 0, 0);
      if (y === 0) part(g, G.plinth, '#d9d2c3', 0, -0.47, 0);
      for (const [dx, dz] of DIRS) if (!has(x + dx, y, z + dz) && !below) { const w = part(g, G.win, '#3e5a63', dx * 0.5, 0.06, dz * 0.5, dx ? Math.PI / 2 : 0); const sl = part(g, G.sill, '#ffffff', dx * 0.52, -0.13, dz * 0.52, dx ? Math.PI / 2 : 0); w.castShadow = sl.castShadow = false; }
      if (!above) {
        const terrace = DIRS.some(([dx, dz]) => has(x + dx, y + 1, z + dz));
        if (terrace) { part(g, G.slab, '#efe9dc', 0, 0.52, 0); for (const [dx, dz] of DIRS) if (!has(x + dx, y + 1, z + dz) && !has(x + dx, y, z + dz)) { part(g, G.rail, '#ffffff', dx * 0.48, 0.78, dz * 0.48, dx ? Math.PI / 2 : 0); for (const o of [-0.42, 0, 0.42]) part(g, G.post, '#ffffff', dx * 0.48 + (dx ? 0 : o), 0.66, dz * 0.48 + (dz ? 0 : o)); } }
        else { const hh = hash(x, y, z); part(g, G.roof, darker(ci === 2 ? '#c75a48' : '#d26a52', 1 - (hh % 3) * 0.06), 0, 0.5, 0, hh % 2 ? Math.PI / 2 : 0); if (hh % 4 === 0) part(g, G.chim, '#b8b0a2', 0.22, 0.86, 0.18); }
      }
      townG.add(g); groups.set(key, g);
      if (key === popKey) { g.scale.setScalar(0.01); anims.push({ g, t0: performance.now(), kind: 'in' }); }
    }
  };
  const cursor = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.02, 1.02), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false })); cursor.visible = false; S.scene.add(cursor);
  const ray = new THREE.Raycaster(), mv = new THREE.Vector2();
  const target = (e, remove) => {
    const r = S.r.domElement.getBoundingClientRect(); mv.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(mv, S.cam);
    const hit = ray.intersectObjects([townG, water], true)[0]; if (!hit) return null;
    if (hit.object === water) { const x = Math.floor(hit.point.x), z = Math.floor(hit.point.z); if (remove || x < -N || x >= N || z < -N || z >= N) return null; return { add: [x, 0, z] }; }
    let o = hit.object; while (o && !o.userData.key) o = o.parent; if (!o) return null; const [bx, by, bz] = o.userData.key.split(',').map(Number);
    if (remove) return { del: o.userData.key, at: [bx, by, bz] };
    const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld); let t;
    if (n.y > 0.45) t = [bx, by + 1, bz]; else if (n.y < -0.6) t = [bx, by - 1, bz]; else t = Math.abs(n.x) > Math.abs(n.z) ? [bx + Math.sign(n.x), by, bz] : [bx, by, bz + Math.sign(n.z)];
    if (t[1] < 0 || t[1] > 9 || t[0] < -N || t[0] >= N || t[2] < -N || t[2] >= N || has(...t)) return null; return { add: t };
  };
  const addAt = (x, y, z, ci = cur) => { town.set(K(x, y, z), ci); build(K(x, y, z)); blip(480 + y * 70 + Math.random() * 40, 0.09, 'triangle', 0.07); upd(); };
  const delAt = (key) => { const g = groups.get(key); town.delete(key); if (g) { townG.remove(g); S.scene.add(g); anims.push({ g, t0: performance.now(), kind: 'out' }); } build(); blip(260, 0.08, 'sine', 0.06); upd(); };
  let down = null; const cv = S.r.domElement; cv.style.cursor = 'pointer';
  cv.addEventListener('contextmenu', (e) => e.preventDefault());
  cv.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY, b: e.button }));
  cv.addEventListener('pointerup', (e) => { if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5, b = down.b; down = null; if (moved) return; const t = target(e, b === 2 || e.shiftKey); if (!t) return; t.del ? delAt(t.del) : addAt(...t.add); });
  cv.addEventListener('pointermove', (e) => { if (e.buttons) { cursor.visible = false; return; } const t = target(e, false); cursor.visible = !!t; if (t) cursor.position.set(t.add[0] + 0.5, t.add[1] + 0.5, t.add[2] + 0.5); });
  cv.addEventListener('pointerleave', () => (cursor.visible = false));
  S.on((t) => { ctl.target.y = 1 + Math.sin(t * 0.7) * 0.09; ctl.update(); const now = performance.now();
    for (let i = anims.length - 1; i >= 0; i--) { const a = anims[i], k = (now - a.t0) / 1000; if (a.kind === 'in') { const sc = k > 1.2 ? 1 : 1 - Math.exp(-7 * k) * Math.cos(13 * k); a.g.scale.setScalar(Math.max(0.01, sc)); if (k > 1.2) anims.splice(i, 1); } else { const sc = Math.max(0.01, 1 - k / 0.2) * (1 + Math.sin(Math.min(1, k / 0.2) * Math.PI) * 0.15); a.g.scale.setScalar(sc); if (k > 0.2) { S.scene.remove(a.g); anims.splice(i, 1); } } } });
  const SEED = [[0, 0, 0, 0], [1, 0, 0, 1], [2, 0, 0, 2], [0, 0, 1, 3], [1, 0, 1, 0], [-1, 0, 0, 4], [-1, 1, 0, 4], [0, 1, 0, 7], [0, 2, 0, 7], [2, 0, 1, 5], [2, 1, 1, 5], [3, 0, 1, 1], [3, 1, 1, 1], [4, 1, 1, 7], [5, 0, 1, 6], [5, 1, 1, 6], [-2, 0, 2, 6], [-1, 0, 2, 6], [-1, 0, 3, 2], [1, 1, 1, 0], [1, 2, 1, 3], [-2, 0, -1, 8], [-2, 1, -1, 8], [-3, 0, -1, 3], [0, 0, -2, 1], [1, 0, -2, 1], [1, 1, -2, 2]];
  const seed = () => { town.clear(); SEED.forEach(([x, y, z, c]) => town.set(K(x, y, z), c)); build(); upd(); };
  const resetView = () => { S.cam.position.set(...HOME); ctl.target.set(0.5, 1, 0.5); ctl.update(); };
  const sw = PAL.map((c, i) => h('button', { title: c, onclick: () => { cur = i; sw.forEach((b, j) => (b.style.transform = j === cur ? 'translateY(-8px) scale(1.12)' : '')); blip(660 + i * 30, 0.05, 'sine', 0.04); }, style: { width: '38px', height: '38px', borderRadius: '50%', border: '3px solid #fff', background: c, boxShadow: '0 4px 10px #2a4f5233', transition: 'transform .25s cubic-bezier(.3,1.6,.5,1)', padding: 0 } }));
  sw[cur].style.transform = 'translateY(-8px) scale(1.12)';
  const count = h('span');
  const upd = () => (count.textContent = `${town.size} blocks`);
  const chip = (t, on) => h('button', { onclick: on, style: { border: 0, background: '#ffffffcc', color: '#24474a', borderRadius: '99px', padding: '8px 14px', fontWeight: 700, fontSize: '12px', boxShadow: '0 4px 12px #2a4f5222' } }, t);
  root.append(
    h('div', { style: { position: 'absolute', left: '22px', top: '18px', zIndex: 2, color: '#fff', textShadow: '0 2px 8px #2a4f5244' } }, h('div', { style: { font: "900 26px 'Press Start 2P',monospace", letterSpacing: '.18em', fontSize: '18px' } }, 'TOWNSCAPER-ish'), h('div', { style: { fontSize: '12px', marginTop: '8px', opacity: .95, fontWeight: 600 } }, '클릭 = 블록 놓기 · 블록 위 클릭 = 쌓기 · 우클릭(Shift+클릭) = 지우기 · 드래그 = 회전 · 휠 = 줌')),
    h('div.k-row', { style: { position: 'absolute', right: '20px', top: '18px', zIndex: 2 } }, h('span', { style: { fontSize: '12px', fontWeight: 700, color: '#24474a', marginRight: '6px' } }, count), chip('⟲ 시점 리셋', resetView), chip('🏝 예시 마을', seed), chip('🗑 모두 지우기', () => { town.clear(); build(); upd(); })),
    h('div.k-row', { style: { position: 'absolute', left: '50%', bottom: '22px', transform: 'translateX(-50%)', zIndex: 2, gap: '12px', background: '#ffffff55', padding: '12px 18px 10px', borderRadius: '99px', backdropFilter: 'blur(6px)' } }, ...sw));
  seed();
  window.__demoProof = async () => { const n0 = town.size; addAt(-5, 0, -4, 5); await sleep(120); addAt(-5, 1, -4, 2); await sleep(120); const roofed = !has(-5, 2, -4); addAt(-4, 1, -4, 7); await sleep(120); const archOk = town.has(K(-4, 1, -4)) && !has(-4, 0, -4); const n1 = town.size; delAt(K(-4, 1, -4)); delAt(K(-5, 1, -4)); delAt(K(-5, 0, -4)); await sleep(300); seed(); resetView(); return `placed 3 blocks (stack + arch=${archOk}, roof on top=${roofed}) ${n0}→${n1}, removed them → ${town.size}; restored seed town`; };
};

V['igloo-scroll-ice-world'] = (root, T) => {
  theme(root, T, { bg: '#a3a8b3', fg: '#ffffff', ac: '#ffffff', dark: true });
  const MONO = "'JetBrains Mono Variable',ui-monospace,monospace";
  root.append(h('style', {}, `.ig-hud{position:absolute;inset:0;pointer-events:none;z-index:3;font:500 11px/1.35 ${MONO};color:#fff;text-transform:uppercase;letter-spacing:.06em}.ig-logo{position:absolute;left:44px;top:34px;font:800 34px/1 'Space Grotesk Variable',sans-serif;letter-spacing:.02em;color:transparent;-webkit-text-stroke:2px #fff;text-shadow:0 0 12px #fff6}.ig-blk{position:absolute;display:flex;flex-direction:column;gap:3px}.ig-blk span{display:inline-block;width:max-content}.ig-blk .inv{background:#fff;color:#4a4f5b;padding:1px 4px}.ig-blk .bar{background:#2b2f38cc;color:#fff;padding:1px 4px}.ig-title{position:absolute;left:50%;top:15%;transform:translateX(-50%);text-align:center;font:600 13px/1.4 ${MONO};letter-spacing:.24em;white-space:pre}.ig-title b{display:block;font:700 30px/1.15 'Space Grotesk Variable',sans-serif;letter-spacing:.12em;margin-bottom:8px;text-shadow:0 0 18px #fff8}.ig-cue{position:absolute;left:50%;bottom:44px;transform:translateX(-50%);text-align:center;transition:opacity .5s}.ig-cue i{display:block;width:1px;height:34px;margin:10px auto 0;background:linear-gradient(#fff,#fff0);animation:igc 1.6s infinite}@keyframes igc{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}.ig-num{position:absolute;font:600 10px ${MONO};color:#fff;transform:translate(6px,-14px);text-shadow:0 0 4px #0008}.ig-btn{pointer-events:auto;cursor:pointer;background:none;border:0;color:#fff;font:inherit;letter-spacing:inherit;padding:0;text-transform:uppercase}.ig-prog{position:absolute;right:44px;bottom:40px;width:160px;text-align:right}.ig-prog .tr{height:2px;background:#ffffff40;margin-top:6px}.ig-prog .tr i{display:block;height:100%;background:#fff;width:0}.ig-tip{position:absolute;pointer-events:none;z-index:4;font:600 10px ${MONO};letter-spacing:.14em;color:#4a4f5b;background:#fff;padding:3px 7px;transform:translate(14px,14px);display:none;text-transform:uppercase}.ig-card{position:absolute;right:6%;top:50%;transform:translate(30px,-50%);width:340px;background:#f4f6f9ee;color:#2e333d;backdrop-filter:blur(10px);padding:26px 26px 22px;z-index:5;opacity:0;pointer-events:none;transition:.5s cubic-bezier(.2,.8,.2,1);font:13px/1.55 ${MONO}}.ig-card.on{opacity:1;transform:translate(0,-50%);pointer-events:auto}.ig-card h3{font:700 22px/1.1 'Space Grotesk Variable',sans-serif;letter-spacing:.06em;margin:6px 0 12px}.ig-card .x{position:absolute;right:14px;top:12px;cursor:pointer;border:0;background:none;font-size:18px;color:#2e333d}.ig-card .meta{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:11px;margin-top:14px;text-transform:uppercase}`));
  const S = stage(root, { bg: '#a3a8b3' }); const { scene, cam } = S;
  scene.fog = new THREE.FogExp2(0xa3a8b3, 0.0115);
  scene.add(new THREE.HemisphereLight(0xf4f7ff, 0x7a808c, 1.6)); const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(-20, 30, 10); scene.add(sun);
  // snowy terrain (value-noise heightfield)
  const nz = noise2(11); const tg = new THREE.PlaneGeometry(260, 260, 140, 140); tg.rotateX(-Math.PI / 2); const ta = tg.attributes.position;
  for (let i = 0; i < ta.count; i++) { const x = ta.getX(i), z = ta.getZ(i); const d = Math.hypot(x, z); const hill = (nz(x * 0.03 + 3, z * 0.03) - 0.4) * 30 * clamp((d - 14) / 30, 0, 1) + (nz(x * 0.09, z * 0.09) - 0.5) * 3 * clamp((d - 9) / 10, 0, 1) + (nz(x * 0.2, z * 0.2) - 0.5) * 0.8; const far = clamp((d - 70) / 60, 0, 1) * 22 * nz(x * 0.01, z * 0.012); ta.setY(i, hill + far - 0.2 * clamp(1 - d / 14, 0, 1)); }
  tg.computeVertexNormals(); scene.add(new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ color: 0xd0d4dc, roughness: 1 })));
  // igloo: rings of slightly jittered ice blocks + entrance tunnel, glowing from inside
  const igloo = new THREE.Group(); scene.add(igloo); const R = rng(4);
  const iceM = new THREE.MeshStandardMaterial({ color: 0xeef2f8, roughness: 0.6, emissive: 0xb8c8e6, emissiveIntensity: 0.18 });
  const blockGeo = new RoundedBoxGeometry(1, 1, 1, 3, 0.16);
  const RAD = 5.2, rows = 7;
  for (let r = 0; r < rows; r++) { const phi = (r + 0.5) / rows * Math.PI / 2 * 0.98; const ringR = RAD * Math.cos(phi), y = RAD * Math.sin(phi); const n = Math.max(3, Math.round(2 * Math.PI * ringR / 1.9)); for (let k = 0; k < n; k++) { const th = (k + (r % 2) * 0.5) / n * Math.PI * 2; if (r < 2 && Math.abs(((th - Math.PI / 2 + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.42) continue; const m = new THREE.Mesh(blockGeo, iceM); const bw = 2 * Math.PI * ringR / n * 0.92; m.scale.set(bw, 1.25, 0.85); m.position.set(Math.cos(th) * ringR, y, Math.sin(th) * ringR); m.lookAt(0, y * 0.4, 0); m.rotateX(-phi * 0.9); m.rotation.z += (R() - 0.5) * 0.12; igloo.add(m); } }
  const cap = new THREE.Mesh(blockGeo, iceM); cap.scale.set(1.7, 0.7, 1.7); cap.position.y = RAD + 0.05; igloo.add(cap);
  for (let i = 0; i < 3; i++) for (let k = 0; k < 5; k++) { const a = Math.PI * (k / 4); const m = new THREE.Mesh(blockGeo, iceM); m.scale.set(1.1, 0.8, 1.2); m.position.set(Math.cos(a) * 1.9, 0.4 + Math.sin(a) * 1.9, 5 + i * 1.15); m.rotation.z = a - Math.PI / 2; igloo.add(m); }
  const glow = new THREE.PointLight(0xdfe9ff, 60, 18, 1.6); glow.position.set(0, 2, 0); igloo.add(glow);
  const core = new THREE.Mesh(new THREE.SphereGeometry(4.6, 24, 16), new THREE.MeshBasicMaterial({ color: 0xf6f9ff })); core.position.y = 0.2; igloo.add(core);
  // floating ice shards (project blocks) high above
  const PROJ = [{ n: 'Pudgy Penguins', k: 'Consumer IP', y: '2021', d: 'A frozen collectible character brand — the shard holds its mascot.' }, { n: 'Abstract', k: 'Network', y: '2024', d: 'Consumer-first chain infrastructure, encased as a crystalline lattice.' }, { n: 'Overpass', k: 'IP licensing', y: '2025', d: 'Licensing marketplace — an ice ring that keeps spinning.' }];
  const shardM = new THREE.MeshPhysicalMaterial({ color: 0xe6edf6, roughness: 0.18, metalness: 0, transparent: true, opacity: 0.55, clearcoat: 1, side: THREE.DoubleSide, flatShading: true });
  const shards = PROJ.map((p, i) => { const g = new THREE.Group(); const geo = new THREE.IcosahedronGeometry(2.6, 1); const a = geo.attributes.position; const r2 = rng(9 + i); for (let j = 0; j < a.count; j++) a.setXYZ(j, a.getX(j) * (0.8 + r2() * 0.35), a.getY(j) * (1.25 + r2() * 0.3), a.getZ(j) * (0.8 + r2() * 0.3)); geo.computeVertexNormals(); const shell = new THREE.Mesh(geo, shardM); const inner = new THREE.Mesh(i === 0 ? new THREE.CapsuleGeometry(0.8, 1.1, 6, 12) : i === 1 ? new THREE.OctahedronGeometry(1.2, 0) : new THREE.TorusGeometry(1, 0.32, 12, 32), new THREE.MeshStandardMaterial({ color: 0xf2f4f8, roughness: 0.7, emissive: 0x8090b0, emissiveIntensity: 0.2 })); g.add(inner, shell); g.position.set((i - 1) * 9, 42 + (i % 2) * 2, 0); g.userData = { i, inner, shell }; scene.add(g); return g; });
  // camera stops
  const STOPS = [
    { pos: [3, 5, 23], look: [0, 3.2, 0], t: 'IGLOO INC.', s: 'BUILDING CONSUMER CRYPTO\nFROM THE COLDEST PLACE ON-CHAIN' },
    { pos: [0, 43, 26], look: [0, 43, 0], t: 'PORTFOLIO', s: 'CLICK TO EXPLORE AN ICE BLOCK' },
    { pos: [-8, 70, 20], look: [0, 70, 0], t: 'NETWORK', s: 'SIGNALS · HOLDERS · BLOCKS\nSCROLL FASTER TO STIR THE PLEXUS' },
    { pos: [46, 34, 70], look: [0, 2, 0], t: 'MANIFESTO', s: 'WE BUILD WORLDS PEOPLE WANT TO LIVE IN\nHELLO@IGLOO.INC' },
  ];
  const posC = new THREE.CatmullRomCurve3(STOPS.map((s0) => new THREE.Vector3(...s0.pos)), false, 'centripetal'), lookC = new THREE.CatmullRomCurve3(STOPS.map((s0) => new THREE.Vector3(...s0.look)));
  // plexus particles across the whole path
  const NP = 150, P = new Float32Array(NP * 3), VEL = []; const pr = rng(21);
  for (let i = 0; i < NP; i++) { P[i * 3] = (pr() - 0.5) * 50; P[i * 3 + 1] = pr() * 82 + 2; P[i * 3 + 2] = (pr() - 0.5) * 30; VEL.push([(pr() - 0.5), (pr() - 0.5), (pr() - 0.5)]); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(P, 3)); scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.22, transparent: true, opacity: 0.9 })));
  const MAXL = 900, LP = new Float32Array(MAXL * 6); const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(LP, 3)); const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 })); scene.add(lines);
  // HUD
  const hud = h('div.ig-hud'); const nums = Array.from({ length: 9 }, (_, i) => h('div.ig-num', {}, String(10 + ((i * 37) % 190))));
  const title = h('div.ig-title'); const cue = h('div.ig-cue', {}, 'Scroll down to discover.', h('i'));
  const sndBtn = h('button.ig-btn', {}, 'SOUND: OFF'); const stopLbl = h('span', {}, '01 / 04'); const bar = h('i');
  hud.append(h('div.ig-logo', {}, 'IGLOO'), h('div.ig-blk', { style: { left: '44px', top: '84px' } }, h('span.bar', {}, 'VENTURE STUDIO / EST. 2024'), h('span.inv', {}, 'NETWORK · IP · CONSUMER')), h('div.ig-blk', { style: { right: '44px', top: '34px', alignItems: 'flex-end' } }, h('span.bar', {}, 'SYSTEM STATUS ▮▮▮▮▯'), h('span.inv', {}, 'TEMP −41.6°C'), h('span.inv', {}, 'WIND 12 KN · N/NE'), h('span.inv', {}, 'BLOCKS ONLINE 128')), h('div.ig-blk', { style: { left: '44px', bottom: '40px' } }, h('span.inv', {}, 'ABETO × IGLOO'), sndBtn), h('div.ig-prog', {}, stopLbl, h('div.tr', {}, bar)), title, cue, ...nums);
  const tip = h('div.ig-tip', {}, 'Click to explore'); const card = h('div.ig-card'); root.append(hud, tip, card);
  // scramble-decode title
  const GL = '▮▯/\\<>#*+=01ABCDEFGHJKLMNPQRSTUVWXYZ'; let scrT = 0, curStop = -1;
  const decode = (i) => { const st = STOPS[i]; const full = st.t + '\n' + st.s; const t0 = performance.now(); const my = ++scrT; const step = () => { if (my !== scrT) return; const k = clamp((performance.now() - t0) / 700, 0, 1); const out = [...full].map((c, j) => (c === '\n' || c === ' ' || j / full.length < k ? c : GL[(Math.random() * GL.length) | 0])).join(''); const [a, ...b] = out.split('\n'); title.replaceChildren(h('b', {}, a), b.join('\n')); title.dataset.done = k >= 1 ? '1' : '0'; if (k < 1) requestAnimationFrame(step); }; step(); };
  // scroll state
  let target = 0, prog = 0, vel = 0, focus = null, lastT = 0; const N = STOPS.length - 1;
  root.addEventListener('wheel', (e) => { e.preventDefault(); if (focus) return; target = clamp(target + e.deltaY * 0.0011, 0, N); }, { passive: false });
  let ty = null; root.addEventListener('touchstart', (e) => (ty = e.touches[0].clientY), { passive: true }); root.addEventListener('touchmove', (e) => { if (ty == null || focus) return; const y = e.touches[0].clientY; target = clamp(target + (ty - y) * 0.004, 0, N); ty = y; }, { passive: true });
  window.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' || e.key === 'PageDown') target = clamp(Math.round(target) + 1, 0, N); if (e.key === 'ArrowUp' || e.key === 'PageUp') target = clamp(Math.round(target) - 1, 0, N); if (e.key === 'Escape') closeCard(); });
  // sound: brown-noise wind + soft drone, volume follows scroll velocity
  let snd = null;
  const setSound = (on) => { if (on && !snd) { const ac = audio(); if (!ac) return; const len = ac.sampleRate * 2, b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < len; i++) { l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; } const src = ac.createBufferSource(); src.buffer = b; src.loop = true; const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600; const g = ac.createGain(); g.gain.value = 0; const o1 = ac.createOscillator(), o2 = ac.createOscillator(); o1.frequency.value = 110; o2.frequency.value = 164.8; o1.type = o2.type = 'sine'; const og = ac.createGain(); og.gain.value = 0.18; o1.connect(og); o2.connect(og); og.connect(g); src.connect(f).connect(g).connect(ac.destination); src.start(); o1.start(); o2.start(); snd = { g, f, stop: () => { [src, o1, o2].forEach((n) => n.stop()); g.disconnect(); } }; } else if (!on && snd) { snd.stop(); snd = null; } sndBtn.textContent = snd ? 'SOUND: ON ▮▮▯' : 'SOUND: OFF'; };
  sndBtn.onclick = () => setSound(!snd);
  // ice-block picking
  const ray = new THREE.Raycaster(), mp = new THREE.Vector2(); let hover = null;
  const pickAt = (e) => { const r = S.r.domElement.getBoundingClientRect(); mp.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(mp, cam); const hit = ray.intersectObjects(shards.map((g) => g.userData.shell))[0]; return hit ? hit.object.parent : null; };
  S.r.domElement.addEventListener('pointermove', (e) => { hover = focus ? null : pickAt(e); S.r.domElement.style.cursor = hover ? 'pointer' : ''; tip.style.display = hover ? 'block' : 'none'; const r = root.getBoundingClientRect(); tip.style.left = e.clientX - r.left + 'px'; tip.style.top = e.clientY - r.top + 'px'; });
  S.r.domElement.addEventListener('click', (e) => { const g = pickAt(e); if (g && !focus) openCard(g); });
  const openCard = (g) => { focus = g; target = 1; tip.style.display = 'none'; const p = PROJ[g.userData.i]; card.replaceChildren(h('button.x', { onclick: closeCard }, '×'), h('div', { style: { fontSize: '10px', letterSpacing: '.2em' } }, `BLOCK 0${g.userData.i + 1} / 03`), h('h3', {}, p.n.toUpperCase()), h('div', {}, p.d), h('div.meta', {}, 'TYPE', p.k, 'SINCE', p.y, 'STATUS', 'LIVE ●')); card.classList.add('on'); };
  const closeCard = () => { focus = null; card.classList.remove('on'); };
  // frame loop
  const tmp = new THREE.Vector3(), tl = new THREE.Vector3(), lookNow = new THREE.Vector3(0, 3, 0);
  S.on((t) => {
    const dt = Math.min(0.1, t - (lastT || t)); lastT = t; const kk = 1 - Math.pow(0.94, dt * 60); const prev = prog; prog += (target - prog) * kk; if (Math.abs(target - prog) < 1e-4) prog = target; vel = vel * Math.pow(0.9, dt * 60) + Math.abs(prog - prev) * 12;
    posC.getPoint(prog / N, tmp); lookC.getPoint(prog / N, tl);
    if (focus) { const fp = focus.position; tmp.set(fp.x + 2.2, fp.y, fp.z + 8.5); tl.copy(fp); }
    cam.position.lerp(tmp, focus ? kk * 1.3 : 1); lookNow.lerp(tl, focus ? kk * 1.3 : 1); cam.lookAt(lookNow);
    const si = Math.round(prog); if (si !== curStop && Math.abs(prog - si) < 0.18) { curStop = si; decode(si); } title.style.opacity = clamp(1 - Math.abs(prog - Math.round(prog)) * 4, 0, 1);
    cue.style.opacity = prog < 0.15 ? 1 : 0; stopLbl.textContent = `0${Math.round(prog) + 1} / 0${N + 1}`; bar.style.width = (prog / N) * 100 + '%';
    shards.forEach((g, i) => { g.rotation.y = t * 0.25 + i; g.userData.inner.rotation.y = -t * 0.6; g.position.y = 42 + (i % 2) * 2 + Math.sin(t + i) * 0.4; const s2 = g === hover || g === focus ? 1.12 : 1; g.scale.lerp(tmp.set(s2, s2, s2), 0.12); });
    core.material.color.setHSL(0.6, 0.4, 0.93 + Math.sin(t * 2) * 0.03);
    // plexus: drift faster with scroll velocity, connect near neighbours
    const sp = 0.01 + vel * 0.5; for (let i = 0; i < NP; i++) { P[i * 3] += VEL[i][0] * sp; P[i * 3 + 1] += VEL[i][1] * sp; P[i * 3 + 2] += VEL[i][2] * sp; if (Math.abs(P[i * 3]) > 25) VEL[i][0] *= -1; if (P[i * 3 + 1] < 2 || P[i * 3 + 1] > 84) VEL[i][1] *= -1; if (Math.abs(P[i * 3 + 2]) > 15) VEL[i][2] *= -1; }
    pg.attributes.position.needsUpdate = true; let L = 0; const D2 = (6.5 + vel * 6) ** 2;
    for (let i = 0; i < NP && L < MAXL; i++) for (let j = i + 1; j < NP && L < MAXL; j++) { const dx = P[i * 3] - P[j * 3], dy = P[i * 3 + 1] - P[j * 3 + 1], dz = P[i * 3 + 2] - P[j * 3 + 2]; if (dx * dx + dy * dy + dz * dz < D2) { LP.set([P[i * 3], P[i * 3 + 1], P[i * 3 + 2], P[j * 3], P[j * 3 + 1], P[j * 3 + 2]], L * 6); L++; } }
    lg.setDrawRange(0, L * 2); lg.attributes.position.needsUpdate = true; lines.userData.count = L;
    const W = root.clientWidth, H = root.clientHeight; nums.forEach((el, k) => { const i = (k * 16 + 3) % NP; tmp.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]); const dist = tmp.distanceTo(cam.position); tmp.project(cam); const vis = tmp.z < 1 && Math.abs(tmp.x) < 0.95 && Math.abs(tmp.y) < 0.9 && dist < 45; el.style.display = vis ? '' : 'none'; if (vis) { el.style.left = (tmp.x + 1) / 2 * W + 'px'; el.style.top = (1 - tmp.y) / 2 * H + 'px'; if (vel > 0.05 && Math.random() < 0.2) el.textContent = String((Math.random() * 240) | 0); } });
    if (snd) { const ac = audio(); snd.g.gain.setTargetAtTime(clamp(0.05 + vel * 1.5, 0, 0.35), ac.currentTime, 0.1); snd.f.frequency.setTargetAtTime(400 + vel * 3000, ac.currentTime, 0.1); }
  });
  window.__demoProof = async () => {
    const out = []; target = 2; await sleep(1800); out.push(`scroll→stop ${Math.round(prog) + 1} (prog=${prog.toFixed(2)}), cam.y=${cam.position.y.toFixed(1)}`);
    await sleep(800); out.push(`title decoded=${title.dataset.done === '1'} "${title.querySelector('b')?.textContent}"`, `plexus lines=${lines.userData.count}`);
    target = prog = 1; await sleep(120); const sp2 = shards[1].position.clone().project(cam); const r = S.r.domElement.getBoundingClientRect(); const ev = { clientX: r.left + (sp2.x + 1) / 2 * r.width, clientY: r.top + (1 - sp2.y) / 2 * r.height, bubbles: true };
    S.r.domElement.dispatchEvent(new PointerEvent('pointermove', ev)); const hov = !!hover && tip.style.display === 'block'; S.r.domElement.dispatchEvent(new MouseEvent('click', ev)); await sleep(700); out.push(`hover tip=${hov}, click opened card=${card.classList.contains('on')} (${card.querySelector('h3')?.textContent})`);
    closeCard(); setSound(true); const sOn = sndBtn.textContent.includes('ON'); setSound(false); out.push(`sound toggle=${sOn}→off`);
    S.r.domElement.dispatchEvent(new PointerEvent('pointermove', { clientX: 0, clientY: 0, bubbles: true })); target = prog = 0; await sleep(900); out.push(`restored stop ${Math.round(prog) + 1}`); return out.join('; ');
  };
};

V['shopify-editions-3d-cover-shelf-season-timeline-archive'] = (root, T) => {
  import('@fontsource-variable/inter-tight'); import('@fontsource/pinyon-script/400.css'); import('@fontsource/barlow-condensed/600.css'); import('@fontsource/barlow-condensed/700.css'); import('@fontsource/ibm-plex-mono/500.css');
  theme(root, T, { bg: '#e4e4e6', fg: '#1d1d1f', ac: '#000', dark: false });
  const SN = "'Inter Tight Variable','Inter Variable',system-ui,sans-serif", BC = "'Barlow Condensed','Arial Narrow',sans-serif", PM = "'IBM Plex Mono',monospace", SC = "'Pinyon Script',cursive";
  css(`.se{position:absolute;inset:0;overflow:hidden;font:400 14px ${SN};color:#1d1d1f;background:radial-gradient(70% 55% at 50% 42%,#f9f9fa 0%,#ececed 45%,#d9d9db 80%,#cfcfd1 100%)}
.se-top{position:absolute;left:0;right:0;top:0;height:50px;display:flex;align-items:center;padding:0 16px;gap:56px;z-index:8}
.se-brand{display:flex;align-items:center;gap:9px;font:500 15px ${SN};letter-spacing:-.005em;cursor:pointer}
.se-search{all:unset;cursor:pointer;display:flex;align-items:center;gap:7px;font:500 15px ${SN}}
.se-search input{all:unset;width:0;transition:width .3s;border-bottom:1px solid #0003;font:400 14px ${SN}}
.se-search.on input{width:180px}
.se-r{margin-left:auto;display:flex;align-items:center;gap:26px;font:500 15px ${SN}}
.se-r a{cursor:pointer}
.se-cta{all:unset;cursor:pointer;background:#000;color:#fff;border-radius:999px;padding:9px 15px;font:500 15px ${SN};transition:background .2s}
.se-cta:hover{background:#333}
.se-sub{position:absolute;left:16px;top:58px;font:400 15px/1.3 ${SN};color:#55565a;z-index:8}
.se-mute{all:unset;cursor:pointer;position:absolute;right:17px;top:60px;width:40px;height:40px;border-radius:50%;background:#e4e4e6;display:grid;place-items:center;z-index:8;box-shadow:inset 0 0 0 1px #0000000d;transition:background .2s}
.se-mute:hover{background:#d9d9db}
.se-scene{position:absolute;left:0;right:0;top:0;height:720px;perspective:1700px;perspective-origin:50% 38%}
.se-world{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.se-glow{position:absolute;left:150px;right:150px;height:150px;border-radius:50%;background:radial-gradient(closest-side,#ffffffee,#ffffff00);filter:blur(10px);pointer-events:none}
.se-plank{position:absolute;left:134px;width:1172px;height:9px;background:linear-gradient(#fdfdfd,#ececec);border-radius:1px;box-shadow:0 1px 0 #d7d7d9,0 18px 26px -6px #0000002e,0 40px 70px -10px #0000001f;transform-style:preserve-3d}
.se-plank::before{content:'';position:absolute;left:0;right:0;bottom:100%;height:16px;background:linear-gradient(#e9e9ea,#ffffff);transform-origin:bottom;transform:rotateX(78deg)}
.se-c{position:absolute;width:198px;height:198px;transform-style:preserve-3d;transform-origin:50% 100%;cursor:pointer;opacity:0;transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .6s ease,filter .3s}
.se.ready .se-c{opacity:1}
.se-c canvas{position:absolute;inset:0;width:100%;height:100%;border-radius:1px;box-shadow:0 1px 1px #0002,6px 10px 18px -6px #00000059;transition:box-shadow .45s}
.se-c::after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,#ffffff38 0%,#ffffff00 38%,#ffffff00 70%,#ffffff1a);pointer-events:none;mix-blend-mode:screen}
.se-c.hov canvas{box-shadow:0 2px 3px #0002,14px 30px 40px -8px #00000070}
.se-c.dim{filter:saturate(.35) brightness(1.06) opacity(.55)}
.se-tag{position:absolute;left:50%;top:-34px;transform:translateX(-50%) translateY(6px);background:#000;color:#fff;font:500 12px ${SN};padding:6px 10px;border-radius:999px;white-space:nowrap;opacity:0;transition:opacity .25s,transform .25s;pointer-events:none}
.se-c.hov .se-tag{opacity:1;transform:translateX(-50%)}
.se-tl{position:absolute;left:16px;right:16px;top:778px;border-top:1px solid #0000001a;height:84px;z-index:6}
.se-tl button{all:unset;cursor:pointer;position:absolute;top:22px;font:400 12.5px/1.2 ${SN};color:#1d1d1f;transition:opacity .25s,transform .25s}
.se-tl button span{display:block;color:#7b7c80}
.se-tl button b{font-weight:500;display:block;margin-top:1px}
.se-tl button::before{content:'';position:absolute;left:0;top:-23px;height:2px;width:0;background:#000;transition:width .3s}
.se-tl button.on::before{width:100%}
.se-tl.hl button:not(.on){opacity:.32}
.se-tl button.flt{text-decoration:underline;text-underline-offset:3px}
.se-load{position:absolute;inset:0;z-index:30;display:grid;place-items:center;background:#e9e9ea;transition:opacity .6s .1s}
.se-load.out{opacity:0;pointer-events:none}
.se-load div{width:180px;height:2px;background:#0000001a;overflow:hidden;border-radius:2px}
.se-load i{display:block;height:100%;width:0;background:#000;transition:width .8s cubic-bezier(.3,.7,.3,1)}
.se-feat{position:absolute;inset:0;z-index:20;background:#e9e9eaE6;backdrop-filter:blur(6px);display:grid;grid-template-columns:auto 360px;align-items:center;justify-content:center;gap:60px;opacity:0;pointer-events:none;transition:opacity .35s}
.se-feat.on{opacity:1;pointer-events:auto}
.se-feat .cv{width:420px;height:420px;position:relative;transform:perspective(1200px) rotateY(-14deg) rotateX(4deg) translateZ(-60px) scale(.8);transition:transform .7s cubic-bezier(.2,.8,.2,1);box-shadow:30px 50px 80px -20px #00000070}
.se-feat.on .cv{transform:perspective(1200px) rotateY(-8deg) rotateX(2deg)}
.se-feat .cv canvas{width:100%;height:100%;display:block}
.se-feat .lbl{position:absolute;left:-14px;top:22px;background:#fff;color:#000;font:500 13px ${PM};padding:7px 11px;box-shadow:0 6px 18px #0002;transform:rotate(-3deg)}
.se-feat h3{margin:0 0 6px;font:600 44px/1.02 ${SN};letter-spacing:-.025em}
.se-feat .meta{font:500 13px ${SN};color:#6b6c70;letter-spacing:.02em;text-transform:uppercase;margin-bottom:18px}
.se-feat p{margin:0 0 22px;font:400 16px/1.5 ${SN};color:#3a3b3f}
.se-feat .row{display:flex;gap:10px}
.se-feat .row button{all:unset;cursor:pointer;padding:11px 18px;border-radius:999px;font:500 14px ${SN};background:#000;color:#fff}
.se-feat .row button.alt{background:transparent;color:#000;box-shadow:inset 0 0 0 1px #0003}
.se-x{all:unset;cursor:pointer;position:absolute;right:22px;top:62px;width:40px;height:40px;border-radius:50%;background:#fff;display:grid;place-items:center;font:400 22px/1 ${SN};box-shadow:0 4px 14px #0001}`);
  // ---- procedural album-cover art (400×400 canvas each) ----
  const R0 = rng(4242);
  const ART = {
    everywhere(g) { const gr = g.createLinearGradient(0, 0, 0, 400); gr.addColorStop(0, '#b78ad8'); gr.addColorStop(.45, '#7fa3a0'); gr.addColorStop(1, '#2e5a2a'); g.fillStyle = gr; g.fillRect(0, 0, 400, 400);
      for (let k = 0; k < 40; k++) { const x = R0() * 400; g.fillStyle = `rgba(${30 + R0() * 40},${60 + R0() * 60},${40 + R0() * 30},${.25 + R0() * .4})`; g.fillRect(x, 60 + R0() * 120, 3 + R0() * 9, 400); }
      for (let k = 0; k < 2600; k++) { g.fillStyle = `hsla(${R0() < .5 ? 300 : 120},${50 + R0() * 40}%,${50 + R0() * 40}%,${R0() * .55})`; g.fillRect(R0() * 400, R0() * 400, 2, 2); }
      g.fillStyle = '#fff'; g.font = `300 46px ${SN}`; g.fillText('Everywhere', 78, 238); g.font = `300 30px ${SN}`; g.globalAlpha = .55; g.fillText('a  r  y  w  h', 60, 196); g.fillText('E   e', 40, 270); g.globalAlpha = 1;
      const bg2 = g.createRadialGradient(70, 64, 4, 70, 64, 42); bg2.addColorStop(0, '#ffd1f0'); bg2.addColorStop(.6, '#c79cff'); bg2.addColorStop(1, '#8fd6ff'); g.fillStyle = bg2; g.beginPath(); g.arc(70, 64, 40, 0, 7); g.fill(); g.fillStyle = '#5b2a73'; g.font = `700 13px ${SN}`; g.textAlign = 'center'; g.fillText('NOW', 70, 61); g.fillText('PLAYING', 70, 76); g.textAlign = 'left'; },
    renaissance(g) { const gr = g.createLinearGradient(0, 0, 0, 400); gr.addColorStop(0, '#2c3a26'); gr.addColorStop(.35, '#5d6a4a'); gr.addColorStop(.6, '#b7a98a'); gr.addColorStop(1, '#6b4c3a'); g.fillStyle = gr; g.fillRect(0, 0, 400, 400);
      for (let k = 0; k < 26; k++) { g.fillStyle = `rgba(${20 + R0() * 30},${40 + R0() * 30},${20 + R0() * 20},.7)`; g.beginPath(); g.ellipse(R0() * 400, R0() * 140, 30 + R0() * 50, 18 + R0() * 30, 0, 0, 7); g.fill(); }
      g.fillStyle = '#3a2e22'; g.fillRect(70, 60, 9, 200); g.fillRect(300, 40, 8, 220);
      for (let k = 0; k < 160; k++) { g.fillStyle = ['#e8a2b8', '#f4d4c8', '#c45c7a', '#f7efe0'][k % 4]; g.globalAlpha = .7; g.beginPath(); g.arc(R0() * 400, 300 + R0() * 100, 2 + R0() * 6, 0, 7); g.fill(); } g.globalAlpha = 1;
      const hand = (x, y, flip) => { g.save(); g.translate(x, y); g.scale(flip ? -1 : 1, 1); g.fillStyle = '#e6c2a2'; g.strokeStyle = '#a07a5a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-120, 30); g.quadraticCurveTo(-40, 0, 0, 2); g.quadraticCurveTo(14, 2, 18, -4); g.lineTo(20, 4); g.quadraticCurveTo(-10, 18, -30, 30); g.quadraticCurveTo(-60, 52, -120, 60); g.closePath(); g.fill(); g.stroke(); g.restore(); };
      hand(170, 270, false); hand(300, 150, true); g.fillStyle = '#fff'; g.font = `500 15px ${SN}`; g.textAlign = 'center'; g.fillText('The   Renaissance   Edition', 200, 196); g.textAlign = 'left'; },
    horizons(g) { const gr = g.createLinearGradient(0, 0, 0, 400); gr.addColorStop(0, '#1f1a5c'); gr.addColorStop(.55, '#6b3fb8'); gr.addColorStop(.78, '#e46fd0'); gr.addColorStop(.8, '#2a1f6a'); gr.addColorStop(1, '#3d2a8a'); g.fillStyle = gr; g.fillRect(0, 0, 400, 400);
      for (let k = 0; k < 160; k++) { g.fillStyle = `rgba(255,255,255,${R0() * .8})`; g.fillRect(R0() * 400, R0() * 300, 1.5, 1.5); }
      for (let k = 0; k < 8; k++) { g.fillStyle = `rgba(255,170,240,${.08 + k * .02})`; g.fillRect(0, 322 + k * 9, 400, 2); }
      g.save(); g.translate(200, 200); g.rotate(-.08); g.font = `400 128px ${SC}`; g.textAlign = 'center'; g.shadowColor = '#ff7ae0'; g.shadowBlur = 18; g.lineWidth = 5; g.strokeStyle = '#fff'; g.strokeText('Horizons', 0, 30); g.fillStyle = '#fff'; g.fillText('Horizons', 0, 30); g.restore(); },
    boring(g) { g.fillStyle = '#f4f3ee'; g.fillRect(0, 0, 400, 400); g.fillStyle = '#9a9a96';
      for (let y = 70; y < 400; y += 9) for (let x = 14; x < 390; x += 0) { const w = 10 + R0() * 40; if (R0() > .12) g.fillRect(x, y, w, 3); x += w + 5; }
      g.fillStyle = '#fff'; g.fillRect(24, 14, 352, 46); g.strokeStyle = '#222'; g.lineWidth = 2; g.strokeRect(24, 14, 352, 46); g.fillStyle = '#111'; g.font = `500 21px ${PM}`; g.fillText('The Boring Edition', 70, 45);
      g.fillStyle = '#2b2b2b'; g.fillRect(80, 100, 260, 210); g.fillStyle = '#4a4a4a'; g.fillRect(96, 300, 228, 18); const sc = g.createLinearGradient(0, 120, 0, 290); sc.addColorStop(0, '#6a2bd8'); sc.addColorStop(1, '#1ca8ff'); g.fillStyle = sc; g.fillRect(98, 118, 224, 172);
      g.save(); g.translate(210, 205); g.rotate(-.12); g.font = `700 64px ${BC}`; g.textAlign = 'center'; g.lineWidth = 10; g.strokeStyle = '#ff3fa4'; g.strokeText('BORING', 0, 18); g.fillStyle = '#ffe600'; g.fillText('BORING', 0, 18); g.restore(); },
    unified(g) { g.fillStyle = '#0b0b0c'; g.fillRect(0, 0, 400, 400); g.fillStyle = '#fff'; g.font = `600 92px ${BC}`; g.textAlign = 'center'; g.fillText('UNIFIED', 200, 92); g.textAlign = 'left';
      const orb = (x, y, r, c1, c2) => { const gg = g.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); gg.addColorStop(0, '#fff'); gg.addColorStop(.25, c1); gg.addColorStop(1, c2); g.fillStyle = gg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
      orb(250, 190, 64, '#9b8cff', '#120a3a'); g.fillStyle = '#5b4cff'; g.fillRect(186, 176, 128, 24); g.fillStyle = '#fff'; g.font = `700 12px ${SN}`; g.fillText('SHOPIFY  ·  ONE', 204, 193); orb(120, 330, 52, '#666', '#050505'); orb(330, 340, 40, '#7a7a8a', '#0a0a0c');
      g.strokeStyle = '#fff'; g.lineWidth = 1.4; for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; g.beginPath(); g.moveTo(110 + Math.cos(a) * 8, 190 + Math.sin(a) * 8); g.lineTo(110 + Math.cos(a) * (36 + (k % 3) * 8), 190 + Math.sin(a) * (36 + (k % 3) * 8)); g.stroke(); } },
    foundations(g) { const gr = g.createLinearGradient(0, 0, 400, 400); gr.addColorStop(0, '#b9c3ff'); gr.addColorStop(1, '#e7d9ff'); g.fillStyle = gr; g.fillRect(0, 0, 400, 400); g.fillStyle = '#1a1d4a'; g.font = `500 50px ${SN}`; g.fillText('FOUNDATIONS', 16, 62);
      const box = (x, y, w, hh, d) => { g.fillStyle = '#f4f2ff'; g.fillRect(x, y, w, hh); g.fillStyle = '#d7d2ff'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + d, y - d * .6); g.lineTo(x + w + d, y - d * .6); g.lineTo(x + w, y); g.fill(); g.fillStyle = '#b4abf2'; g.beginPath(); g.moveTo(x + w, y); g.lineTo(x + w + d, y - d * .6); g.lineTo(x + w + d, y + hh - d * .6); g.lineTo(x + w, y + hh); g.fill(); };
      box(40, 270, 120, 100, 40); box(170, 230, 150, 140, 46); box(250, 330, 110, 50, 30); g.fillStyle = '#4b44c8'; g.font = `600 44px ${PM}`; g.fillText('</>', 205, 315);
      const gg = g.createRadialGradient(300, 140, 4, 300, 140, 48); gg.addColorStop(0, '#fff'); gg.addColorStop(1, '#a8a3ff'); g.fillStyle = gg; g.beginPath(); g.arc(300, 140, 46, 0, 7); g.fill(); g.fillStyle = '#6a63e0'; g.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, r = k % 2 ? 14 : 40; g.lineTo(90 + Math.cos(a) * r, 150 + Math.sin(a) * r); } g.fill(); },
    imagine(g) { g.fillStyle = '#060608'; g.fillRect(0, 0, 400, 400); g.fillStyle = '#fff'; g.font = `600 42px ${BC}`; g.textAlign = 'center'; g.fillText('IMAGINE MY BUSINESS', 200, 58); g.textAlign = 'left';
      for (let k = 0; k < 9; k++) { const x = 40 + k * 38, w = 26 - Math.abs(k - 4) * 2, top = 100 + Math.abs(k - 4) * 10; const gg = g.createLinearGradient(0, top, 0, 380); gg.addColorStop(0, '#ff8a2a'); gg.addColorStop(.5, '#e0369a'); gg.addColorStop(1, '#5a2bd8'); g.fillStyle = gg; g.beginPath(); g.moveTo(x, 380); g.lineTo(x, top + w); g.quadraticCurveTo(x + w / 2, top - 8, x + w, top + w); g.lineTo(x + w, 380); g.fill(); g.fillStyle = '#0006'; g.fillRect(x + w * .6, top + w, w * .4, 380 - top - w); }
      g.fillStyle = '#fff'; g.beginPath(); g.arc(320, 290, 30, 0, 7); g.fill(); g.fillStyle = '#111'; g.font = `700 11px ${SN}`; g.textAlign = 'center'; g.fillText('SHOPIFY', 320, 294); g.textAlign = 'left'; },
    built(g) { g.fillStyle = '#ffa31a'; g.fillRect(0, 0, 400, 400); g.fillStyle = '#fff'; g.font = `700 54px ${BC}`; g.fillText('BUILT TO LAST', 22, 66);
      g.fillStyle = '#f6efe2'; g.fillRect(90, 120, 290, 280); g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; g.strokeRect(90, 120, 290, 280);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = ['#9ad0ec', '#ffd36b', '#f28fb0', '#b6e3a8'][(r + c) % 4]; g.fillRect(104 + c * 68, 136 + r * 64, 56, 48); g.strokeRect(104 + c * 68, 136 + r * 64, 56, 48); g.fillStyle = '#333'; g.beginPath(); g.arc(120 + c * 68 + (r % 2) * 18, 170 + r * 64, 6, 0, 7); g.fill(); }
      g.fillStyle = '#5c8a4a'; g.fillRect(14, 300, 70, 100); g.fillStyle = '#e6553a'; g.fillRect(30, 250, 40, 50); },
    connect(g) { const gr = g.createLinearGradient(0, 0, 0, 400); gr.addColorStop(0, '#d7b8ff'); gr.addColorStop(1, '#a98bf2'); g.fillStyle = gr; g.fillRect(0, 0, 400, 400); g.font = `700 40px ${BC}`; g.lineWidth = 6; g.strokeStyle = '#ff5cc8'; g.strokeText('CONNECT TO CONSUMER', 14, 54); g.fillStyle = '#fff'; g.fillText('CONNECT TO CONSUMER', 14, 54);
      const card = (x, y, c, t) => { g.save(); g.translate(x, y); g.rotate(-.06); g.fillStyle = '#00000022'; g.fillRect(6, 8, 74, 92); g.fillStyle = c; g.fillRect(0, 0, 74, 92); g.fillStyle = '#fff'; g.fillRect(8, 8, 58, 40); g.fillStyle = '#3b2a7a'; g.font = `700 11px ${SN}`; g.fillText(t, 10, 70); g.restore(); };
      card(40, 110, '#9fe3ff', 'B2B'); card(140, 90, '#ffd1ef', 'MARKETS'); card(250, 110, '#a8ffd8', 'SHOP'); card(60, 240, '#fff0a8', 'POS'); card(170, 220, '#b8f0ff', 'POINT OF SALE'); card(280, 250, '#ffc2e0', 'BUNDLES'); },
  };
  const ED = [
    ['everywhere', '2026', 'Spring', 'Everywhere', 'The Everywhere Edition', '150+ product updates that put Shopify everywhere your customers are — agentic commerce, Sidekick and new POS hardware.'],
    ['renaissance', '2026', 'Winter', 'Renaissance', 'The Renaissance Edition', 'A creative rebirth for commerce: AI store building, a new theme editor and checkout extensibility.'],
    ['horizons', '2025', 'Summer', 'Horizons', 'Horizons Edition', 'New horizons for merchants: Horizon themes, AI-generated blocks and a reimagined Shopify Magic.'],
    ['boring', '2025', 'Winter', 'Boring', 'The Boring Edition', 'Over 150 updates that make the unglamorous parts of commerce reliably, beautifully boring.'],
    ['unified', '2024', 'Summer', 'Unified', 'Unified Edition', 'One platform, one view of your business — unified commerce across online, retail and B2B.'],
    ['foundations', '2024', 'Winter', 'Foundations', 'Foundations Edition', 'Doubling down on the core: speed, reliability and the building blocks merchants rely on daily.'],
    ['imagine', '2023', 'Summer', 'Imagine My Business', 'Imagine My Business', 'Sidekick, Shopify Magic and a glimpse of what commerce could feel like with AI built in.'],
    ['built', '2023', 'Winter', 'Built to Last', 'Built to Last', 'Durable tools for durable brands: checkout, payments and inventory that scale with you.'],
    ['connect', '2022', 'Summer', 'Connect to Consumer', 'Connect to Consumer', 'Reach buyers on every surface — Shopify Markets, Shop app, YouTube shopping and Twitter.'],
  ].map(([k, y, se, n, full, d], i) => ({ i, k, y, se, n, full, d }));
  const POS = [[281, 213], [510, 213], [733, 213], [956, 213], [169, 452], [395, 452], [620, 452], [845, 452], [1067, 452]];
  const TLX = [174, 291, 414, 518, 608, 705, 829, 998, 1117];
  const wrap = h('div.se'); root.append(wrap);
  const logo = (c = '#000') => s('svg', { width: 15, height: 17, viewBox: '0 0 15 17' }, s('path', { d: 'M5 4.2C5 2 6 .8 7.4.8S9.8 2 9.8 4.2', fill: 'none', stroke: c, 'stroke-width': 1.3 }), s('path', { fill: c, d: 'M1.6 4.2h11.8l1.1 12H.5Z' }), s('path', { d: 'M9.3 7.4c-.5-.4-1.1-.6-1.8-.6-1 0-1.7.5-1.7 1.3 0 1.6 3.3 1.2 3.3 3.2 0 1-1 1.8-2.2 1.8-.8 0-1.6-.3-2.1-.8', fill: 'none', stroke: '#fff', 'stroke-width': 1.1 }));
  const searchI = h('input', { placeholder: 'Search editions', oninput: () => filterQ(searchI.value) });
  const search = h('button.se-search', { onclick: (e) => { if (e.target === searchI) return; search.classList.toggle('on'); if (search.classList.contains('on')) searchI.focus(); else { searchI.value = ''; filterQ(''); } } }, 'Search', s('svg', { width: 13, height: 13, viewBox: '0 0 13 13', fill: 'none', stroke: '#000', 'stroke-width': 1.7 }, s('circle', { cx: 5.5, cy: 5.5, r: 4.3 }), s('path', { d: 'M8.7 8.7 12 12' })), searchI);
  wrap.append(h('div.se-top', {}, h('div.se-brand', { onclick: () => closeFeat() }, logo(), 'Shopify Editions'), search, h('div.se-r', {}, h('a', {}, 'Shopify.com'), h('button.se-cta', { onclick: () => toast('Start for free → free trial') }, 'Start for free'))),
    h('div.se-sub', {}, 'Everything new across Shopify.', h('br'), 'Every six months.'));
  let sound = false; const muteIco = () => s('svg', { width: 15, height: 13, viewBox: '0 0 15 13', fill: 'none', stroke: '#333', 'stroke-width': 1.3, 'stroke-linejoin': 'round' }, s('path', { d: 'M1 4.5h3l4-3.5v11L4 8.5H1Z', fill: '#333' }), ...(sound ? [s('path', { d: 'M10.5 4c1 1.4 1 3.6 0 5M12.5 2.5c1.9 2.3 1.9 5.7 0 8' })] : [s('path', { d: 'M10 4.5l4 4M14 4.5l-4 4' })]));
  const mute = h('button.se-mute', { title: 'Sound', onclick: () => { sound = !sound; mute.replaceChildren(muteIco()); if (sound) blip(523, .2, 'sine', .05); } }, muteIco()); wrap.append(mute);
  const scene = h('div.se-scene'); const world = h('div.se-world'); scene.append(world); wrap.append(scene);
  world.append(h('div.se-glow', { style: { top: '170px' } }), h('div.se-glow', { style: { top: '410px' } }), h('div.se-plank', { style: { top: '410px' } }), h('div.se-plank', { style: { top: '650px' } }));
  const covers = ED.map((e) => { const c = h('canvas', { width: 400, height: 400 }); const el = h('div.se-c', { 'data-k': e.k, style: { left: POS[e.i][0] + 'px', top: POS[e.i][1] + 'px' } }, c, e.i === 3 ? null : h('div.se-tag', {}, e.full)); el.cv = c; el.ed = e; world.append(el); return el; });
  const paintAll = () => covers.forEach((el) => { const g = el.cv.getContext('2d'); g.clearRect(0, 0, 400, 400); ART[el.ed.k](g); });
  const rest = (i) => `rotateX(-3deg) translateZ(${i === 3 ? 6 : 0}px)`;
  covers.forEach((el, i) => { el.style.transform = rest(i); el.style.transitionDelay = `${i * 70}ms`; });
  const tl = h('div.se-tl'); const tls = ED.map((e) => h('button', { style: { left: TLX[e.i] + 'px' }, onmouseenter: () => hover(e.i), onmouseleave: () => hover(null), onclick: () => openFeat(e.i) }, h('span', {}, e.y), h('span', {}, e.se), h('b', {}, e.n)));
  tl.append(...tls); wrap.append(tl);
  // ---- hover sync + per-cover 3D tilt ----
  let hovI = null, q = '';
  const hover = (i, tilt = { x: 0, y: 0 }) => { hovI = i; covers.forEach((el, k) => { const on = k === i; el.classList.toggle('hov', on); el.style.transitionDelay = '0ms'; el.style.zIndex = on ? 5 : '';
      el.style.transform = on ? `translateZ(70px) translateY(-14px) rotateX(${4 - tilt.y * 10}deg) rotateY(${tilt.x * 16}deg)` : rest(k); });
    tls.forEach((b, k) => b.classList.toggle('on', k === i)); tl.classList.toggle('hl', i != null); if (i != null && sound) blip(392 + i * 40, .12, 'sine', .03); };
  covers.forEach((el, k) => { el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); const t = { x: (e.clientX - r.left) / r.width - .5, y: (e.clientY - r.top) / r.height - .5 }; if (hovI !== k) hover(k, t); else el.style.transform = `translateZ(70px) translateY(-14px) rotateX(${4 - t.y * 10}deg) rotateY(${t.x * 16}deg)`; });
    el.addEventListener('pointerleave', () => hover(null)); el.addEventListener('click', () => openFeat(k)); });
  // whole-scene parallax tilt following the pointer
  wrap.addEventListener('pointermove', (e) => { if (feat.classList.contains('on')) return; const r = wrap.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; world.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 3}deg)`; });
  wrap.addEventListener('pointerleave', () => { world.style.transform = ''; });
  // ---- search filter (dims non-matching covers and timeline entries) ----
  const filterQ = (v) => { q = v.trim().toLowerCase(); let n = 0; covers.forEach((el, k) => { const e = ED[k]; const m = !q || `${e.y} ${e.se} ${e.n} ${e.full}`.toLowerCase().includes(q); el.classList.toggle('dim', !m); tls[k].style.opacity = m ? '' : .25; if (m) n++; }); return n; };
  // ---- featured edition: cover pulls forward with label tag ----
  const feat = h('div.se-feat', { onclick: (e) => { if (e.target === feat) closeFeat(); } }); wrap.append(feat); let featI = null;
  const openFeat = (i) => { featI = i; const e = ED[i]; const c = h('canvas', { width: 400, height: 400 }); ART[e.k](c.getContext('2d'));
    feat.replaceChildren(h('button.se-x', { onclick: closeFeat }, '×'), h('div.cv', {}, c, h('div.lbl', {}, e.full)),
      h('div', {}, h('div.meta', {}, `${e.se} ’${e.y.slice(2)} Edition`), h('h3', {}, e.full), h('p', {}, e.d), h('div.row', {}, h('button', { onclick: () => toast(`Opening ${e.full}…`) }, 'Explore edition'), h('button.alt', { onclick: () => openFeat((i + 1) % ED.length) }, 'Next edition →'))));
    feat.classList.add('on'); hover(i); if (sound) blip(660, .25, 'sine', .05); return feat; };
  const closeFeat = () => { feat.classList.remove('on'); featI = null; hover(null); };
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFeat(); if (featI != null && e.key === 'ArrowRight') openFeat((featI + 1) % ED.length); if (featI != null && e.key === 'ArrowLeft') openFeat((featI + ED.length - 1) % ED.length); });
  // ---- loading state ----
  const bar = h('i'); const load = h('div.se-load', {}, h('div', {}, bar)); wrap.append(load);
  const start = async () => { await (document.fonts?.ready || Promise.resolve()); try { await Promise.all([document.fonts.load(`400 40px ${SC}`), document.fonts.load(`600 40px ${BC}`), document.fonts.load(`500 20px ${PM}`)]); } catch {} paintAll(); bar.style.width = '100%'; await sleep(650); load.classList.add('out'); wrap.classList.add('ready'); setTimeout(() => covers.forEach((el) => (el.style.transitionDelay = '0ms')), 1400); };
  requestAnimationFrame(() => { bar.style.width = '35%'; }); start();
  window.__demoProof = async () => { const out = []; await sleep(1200); out.push(`covers=${covers.length}, ready=${wrap.classList.contains('ready')}`);
    const r = covers[2].getBoundingClientRect(); covers[2].dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: r.left + r.width * .8, clientY: r.top + r.height * .3 })); await sleep(500);
    out.push(`hover Horizons → lifted=${covers[2].classList.contains('hov')}, timeline active="${tl.querySelector('.on b')?.textContent}"`); hover(null);
    tls[6].dispatchEvent(new MouseEvent('mouseenter')); out.push(`timeline hover → cover "${covers.find((c) => c.classList.contains('hov'))?.ed.n}"`); hover(null);
    search.click(); searchI.value = '2024'; out.push(`search "2024" → ${filterQ('2024')} covers`); searchI.value = ''; filterQ(''); search.classList.remove('on');
    openFeat(3); await sleep(400); out.push(`featured: ${feat.querySelector('.lbl').textContent}`); closeFeat(); await sleep(300);
    mute.click(); out.push(`sound=${sound}`); mute.click(); world.style.transform = ''; return out.join('; ') + '; restored'; };
};

V['robin-noguier-curved-webgl-project-ribbon-serif-title-dot-pager'] = (root, T) => {
  import('@fontsource/playfair-display/900.css'); import('@fontsource-variable/dm-sans');
  theme(root, T, { bg: '#3d6681', fg: '#d5dedd', ac: '#d5dedd', dark: true });
  const SN = "'DM Sans Variable','Silka',system-ui,sans-serif", SR = "'Playfair Display','Eksell Display',Didot,serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PJ = [
    { t: 'Fun', d: 'Designing a new video-only dating app 💖 with Brian Norgard (ex-CPO-Tinder) and Farb Nivi.', bg: '#3d6681', c: ['#f6d7c3', '#f0a3b5', '#87c7e8', '#fff3c4'], kind: 'portrait' },
    { t: 'Esperanto', d: 'A language-learning companion built around tiny daily rituals and soft gradients.', bg: '#2f5a55', c: ['#e9d8a6', '#94d2bd', '#0a9396', '#ee9b00'], kind: 'meet' },
    { t: 'Blurr', d: 'Brand identity and motion system for a camera app that films the world out of focus.', bg: '#6e3b33', c: ['#ffb4a2', '#e5989b', '#6d6875', '#ffcdb2'], kind: 'blur' },
    { t: 'Ueno', d: 'Interaction design for an award-winning agency site with playful scroll moments.', bg: '#23304a', c: ['#ffd166', '#ef476f', '#06d6a0', '#118ab2'], kind: 'shapes' },
    { t: 'Airbnb', d: 'Prototyping new ways to discover experiences hosted by locals around the world.', bg: '#7d3a46', c: ['#ff5a5f', '#ffb3b5', '#fce1e4', '#00a699'], kind: 'portrait' },
    { t: 'Google', d: 'Explorations for an assistant surface that feels calm, glanceable and human.', bg: '#33503f', c: ['#4285f4', '#ea4335', '#fbbc05', '#34a853'], kind: 'shapes' },
    { t: 'SnickSnack', d: 'A snack-sized quiz game for friends, from first sketch to App Store launch.', bg: '#99602d', c: ['#ffe066', '#f25f5c', '#247ba0', '#70c1b3'], kind: 'meet' },
    { t: 'Iv-Skaya', d: 'Editorial portfolio for a fashion photographer — slow images, big type.', bg: '#463c58', c: ['#e0aaff', '#c77dff', '#9d4edd', '#f8edeb'], kind: 'blur' },
    { t: 'Eagle Films', d: 'Website for a Parisian production house, built around full-bleed reels.', bg: '#4a4a48', c: ['#f4f1de', '#e07a5f', '#3d405b', '#81b29a'], kind: 'portrait' }];
  // ---------- procedural "photo" textures ----------
  const R = rng(808);
  const paintTex = (p, i, W = 640, H = 480) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); const [a, b, cc, d] = p.c;
    let gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, a); gr.addColorStop(0.55, b); gr.addColorStop(1, cc); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let k = 0; k < 26; k++) { const x = R() * W, y = R() * H, r = 20 + R() * 120; const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, d + 'cc'); rg.addColorStop(1, d + '00'); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
    if (p.kind === 'portrait') { g.fillStyle = '#00000022'; g.beginPath(); g.ellipse(W * 0.52, H * 0.42, W * 0.14, H * 0.2, 0, 0, 7); g.fill(); g.fillStyle = cc + 'aa'; g.beginPath(); g.ellipse(W * 0.52, H * 1.02, W * 0.3, H * 0.42, 0, 0, 7); g.fill();
      g.strokeStyle = '#ffffffaa'; g.lineWidth = 3; for (let k = 0; k < 40; k++) { g.beginPath(); const x0 = W * 0.38 + R() * W * 0.08; g.moveTo(x0, H * 0.22); g.bezierCurveTo(x0 - 30, H * 0.5, x0 + 10, H * 0.7, x0 - 40 + R() * 30, H); g.stroke(); }
      g.fillStyle = '#ffffff30'; for (let k = 0; k < 6; k++) { g.fillRect(R() * W, 0, 4 + R() * 30, H); } }
    if (p.kind === 'meet') { g.fillStyle = '#0000002a'; g.fillRect(W * 0.32, 0, W * 0.36, H); g.fillStyle = '#ffffff22'; g.fillRect(W * 0.36, H * 0.05, W * 0.28, H * 0.9);
      [[0.18, 0.45], [0.82, 0.5]].forEach(([x, y]) => { g.fillStyle = '#1a1a1acc'; g.beginPath(); g.arc(W * x, H * y, H * 0.12, 0, 7); g.fill(); g.beginPath(); g.ellipse(W * x, H * (y + 0.42), H * 0.22, H * 0.3, 0, 0, 7); g.fill(); }); }
    if (p.kind === 'shapes') { for (let k = 0; k < 7; k++) { g.fillStyle = p.c[k % 4]; g.globalAlpha = 0.85; const x = R() * W, y = R() * H, r = 30 + R() * 90; if (k % 2) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } else { g.save(); g.translate(x, y); g.rotate(R() * 3); g.fillRect(-r, -r / 2, r * 2, r); g.restore(); } } g.globalAlpha = 1; }
    if (p.kind === 'blur') { g.filter = 'blur(18px)'; for (let k = 0; k < 9; k++) { g.fillStyle = p.c[k % 4]; g.beginPath(); g.arc(R() * W, R() * H, 40 + R() * 110, 0, 7); g.fill(); } g.filter = 'none'; }
    const id = g.getImageData(0, 0, W, H), px = id.data; for (let k = 0; k < px.length; k += 4) { const n = (R() - 0.5) * 18; px[k] += n; px[k + 1] += n; px[k + 2] += n; } g.putImageData(id, 0, 0);
    g.fillStyle = '#ffffffd9'; g.font = `900 ${Math.round(H * 0.075)}px ${SR}`; g.fillText(String(i + 1).padStart(2, '0'), W * 0.05, H * 0.93); return c; };
  // ---------- DOM ----------
  css(`.rn{position:absolute;inset:0;overflow:hidden;background:#0d0d0d;font-family:${SN};color:#fff;user-select:none;-webkit-user-select:none;cursor:grab;touch-action:none}
.rn.grab{cursor:grabbing}
.rn-bg{position:absolute;inset:0;background:#3d6681;transition:background-color .9s cubic-bezier(.4,0,.2,1)}
.rn-edge{position:absolute;left:0;top:0;bottom:0;width:7px;background:#d5dedd;transition:background-color .9s}
.rn canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.rn-top{position:absolute;left:90px;right:90px;top:38px;display:flex;justify-content:space-between;font:700 13px/1 ${SN};letter-spacing:.14em;text-transform:uppercase;z-index:3}
.rn-top a{color:#fff;text-decoration:none;cursor:pointer}
.rn-l{position:absolute;left:90px;top:calc(50% - 205px);width:560px;z-index:3;pointer-events:none}
.rn-t{position:relative;height:150px;overflow:hidden}
.rn-t h1{position:absolute;left:0;top:0;margin:0;font:900 135px/1.08 ${SR};color:#d5dedd;letter-spacing:-.02em;white-space:nowrap;transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .5s}
.rn-t h1.out{transform:translateY(-105%);opacity:0}.rn-t h1.in{transform:translateY(105%);opacity:0}
.rn-d{font:400 20px/1.6 ${SN};color:#fff;margin:22px 0 0;max-width:540px;min-height:64px;transition:opacity .45s,transform .45s}
.rn-d.f{opacity:0;transform:translateY(8px)}
.rn-o{display:inline-flex;align-items:center;gap:12px;margin-top:34px;font:700 16px/1 ${SN};letter-spacing:.12em;text-transform:uppercase;color:#fff;pointer-events:auto;cursor:pointer}
.rn-o svg{transition:transform .3s}.rn-o:hover svg{transform:translateX(5px)}
.rn-dots{position:absolute;right:86px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:20px;z-index:3}
.rn-dots button{all:unset;width:8px;height:14px;border-radius:3px;background:#ffffff59;cursor:pointer;transition:background .35s,height .35s}
.rn-dots button.on{background:#ffffffee}
.rn-dots button:hover{background:#ffffffaa}
.rn-th{position:absolute;left:90px;bottom:32px;width:236px;height:136px;border:3px solid #d5dedd;border-radius:2px;overflow:hidden;z-index:3;background:#8e5cc8;pointer-events:auto;cursor:pointer;box-shadow:0 10px 30px #0003}
.rn-th canvas{position:absolute;inset:0}
.rn-th .ph{position:absolute;left:50%;top:6px;width:60px;height:118px;margin-left:-30px;border-radius:9px;border:2px solid #fff;overflow:hidden;box-shadow:0 4px 12px #0004}
.rn-hint{position:absolute;right:90px;bottom:30px;font:500 12px/1 ${SN};letter-spacing:.1em;text-transform:uppercase;color:#ffffff80;z-index:3}
.rn-fb{position:absolute;inset:0;perspective:1200px}
.rn-fb canvas{position:absolute;width:560px;height:420px;left:auto;top:auto;transition:transform .8s cubic-bezier(.2,.8,.2,1),filter .8s}
@media (max-width:900px){.rn-l{left:28px;width:auto;right:28px}.rn-t h1{font-size:84px}.rn-top{left:28px;right:28px}}
`);
  const el = h('div.rn'); const bg = h('div.rn-bg'); const edge = h('div.rn-edge'); el.append(bg); root.append(el);
  const top = h('div.rn-top', {}, h('a', {}, 'Robin Noguier'), h('a', { onclick: () => toast('About page (demo)') }, 'About'));
  let h1 = h('h1', {}, PJ[0].t); const tbox = h('div.rn-t', {}, h1); const desc = h('p.rn-d', {}, PJ[0].d);
  const open = h('a.rn-o', { onclick: () => toast(`Open case study: ${PJ[cur].t}`) }, 'Open case study', h('span', { html: '<svg width="16" height="14" viewBox="0 0 16 14"><path d="M1 7h13M8.5 1.5 14 7l-5.5 5.5" fill="none" stroke="#fff" stroke-width="1.8"/></svg>' }));
  const left = h('div.rn-l', {}, tbox, desc, open);
  const dots = h('div.rn-dots', {}, PJ.map((p, i) => h('button', { title: p.t, 'aria-label': p.t, onclick: (e) => { e.stopPropagation(); go(i); } })));
  const thumb = h('div.rn-th', { onclick: (e) => { e.stopPropagation(); toast('Case study video (demo)'); } }); const thc = paintTex({ ...PJ[0], c: ['#8e5cc8', '#a77be0', '#7446b0', '#c9a6f5'], kind: 'shapes' }, 0, 236, 136); thc.style.cssText = 'width:100%;height:100%'; const phc = paintTex(PJ[0], 0, 60, 118); phc.style.cssText = 'width:100%;height:100%;position:static'; thumb.append(thc, h('div.ph', {}, phc));
  const hint = h('div.rn-hint', {}, 'scroll / drag ↕');
  el.append(edge);
  const texC = PJ.map((p, i) => paintTex(p, i));
  // ---------- WebGL ribbon ----------
  let renderer = null, scene0, cam, mats = [], meshes = [];
  const CW = 560, CH = 420, GAP = 470;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); el.append(renderer.domElement);
    scene0 = new THREE.Scene(); cam = new THREE.PerspectiveCamera(35, 1, 10, 6000);
    const geo = new THREE.PlaneGeometry(CW, CH, 48, 36);
    const vs = `uniform float uOff; uniform float uVel; uniform float uTime; varying vec2 vUv; varying float vD;
      void main(){ vUv=uv; vec3 p=position; float y=p.y+uOff;
        float bend = 0.00042 + abs(uVel)*0.0009;
        float z = -bend*y*y - abs(y)*0.18;
        float x = p.x + y*0.30 - abs(y)*0.12;
        float yy = y + p.x*0.085*(uv.y) + uVel*sin(uv.x*3.14159)*60.0;
        z += -p.x*0.20 + sin(uv.y*3.14159)*abs(uVel)*-40.0;
        vD = clamp(abs(uOff)/${GAP}.0,0.0,1.0);
        gl_Position = projectionMatrix*modelViewMatrix*vec4(x,yy,z,1.0); }`;
    const fs = `uniform sampler2D uTex; uniform float uHover; uniform vec3 uTint; varying vec2 vUv; varying float vD;
      void main(){ vec2 o=vec2(uHover*0.012,0.0); vec4 c=texture2D(uTex,vUv); float r=texture2D(uTex,vUv+o).r; float b=texture2D(uTex,vUv-o).b; vec3 col=vec3(r,c.g,b);
        float g=dot(col,vec3(.299,.587,.114)); vec3 gray=mix(vec3(g),uTint,0.35); col=mix(col,gray,smoothstep(0.15,0.75,vD)*(1.0-uHover*0.0));
        gl_FragColor=vec4(col,1.0); }`;
    PJ.forEach((p, i) => { const tx = new THREE.CanvasTexture(texC[i]); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
      const m = new THREE.ShaderMaterial({ uniforms: { uTex: { value: tx }, uOff: { value: 0 }, uVel: { value: 0 }, uTime: { value: 0 }, uHover: { value: 0 }, uTint: { value: new THREE.Color(p.bg) } }, vertexShader: vs, fragmentShader: fs, side: THREE.DoubleSide, transparent: false });
      const me = new THREE.Mesh(geo, m); scene0.add(me); mats.push(m); meshes.push(me); });
  } catch (e) { renderer = null; }
  let fb = null; if (!renderer) { fb = h('div.rn-fb'); texC.forEach((c) => fb.append(c)); el.append(fb); }
  el.append(top, left, dots, thumb, hint);
  // ---------- motion state ----------
  let pos = 0, tgt = 0, vel = 0, cur = 0, W = 1, H = 1, hover = 0, hoverT = 0, mx = -1, my = -1;
  const size = () => { const r = el.getBoundingClientRect(); W = r.width; H = r.height; if (renderer) { renderer.setSize(W, H, false); cam.aspect = W / H; cam.position.set(0, 0, H / 2 / Math.tan((cam.fov * Math.PI) / 360)); cam.updateProjectionMatrix(); } };
  new ResizeObserver(size).observe(el); size();
  const setTitle = (i) => { if (i === cur) return; const dir = i > cur ? 1 : -1; cur = i; const old = h1; const nu = h('h1.' + (dir > 0 ? 'in' : 'out'), {}, PJ[i].t); tbox.append(nu);
    requestAnimationFrame(() => { old.className = dir > 0 ? 'out' : 'in'; nu.className = ''; }); setTimeout(() => old.remove(), RM ? 0 : 750); h1 = nu;
    desc.classList.add('f'); setTimeout(() => { desc.textContent = PJ[i].d; desc.classList.remove('f'); }, RM ? 0 : 260);
    bg.style.backgroundColor = PJ[i].bg; [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i)); };
  [...dots.children][0].classList.add('on');
  const go = (i) => { tgt = clamp(i, 0, PJ.length - 1); };
  let snapT = 0; const kick = () => { clearTimeout(snapT); snapT = setTimeout(() => { tgt = clamp(Math.round(tgt), 0, PJ.length - 1); }, 140); };
  el.addEventListener('wheel', (e) => { e.preventDefault(); tgt = clamp(tgt + e.deltaY / 700, -0.25, PJ.length - 0.75); kick(); }, { passive: false });
  let dragY = null, dragT0 = 0;
  el.addEventListener('pointerdown', (e) => { if (e.target.closest('.rn-dots,.rn-th,.rn-o,.rn-top')) return; dragY = e.clientY; dragT0 = tgt; el.classList.add('grab'); try { el.setPointerCapture(e.pointerId); } catch {} });
  el.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; if (dragY == null) return; tgt = clamp(dragT0 + (dragY - e.clientY) / 380, -0.3, PJ.length - 0.7); });
  const endDrag = () => { if (dragY == null) return; dragY = null; el.classList.remove('grab'); tgt = clamp(Math.round(tgt + vel * 4), 0, PJ.length - 1); };
  el.addEventListener('pointerup', endDrag); el.addEventListener('pointercancel', endDrag); el.addEventListener('pointerleave', () => { mx = -1; });
  window.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' || e.key === 'PageDown') go(Math.round(tgt) + 1); if (e.key === 'ArrowUp' || e.key === 'PageUp') go(Math.round(tgt) - 1); });
  // hover test: active card's screen rect (approx)
  const overActive = () => { if (mx < 0) return false; const r = el.getBoundingClientRect(); const cx = r.left + W * 0.69, cy = r.top + H * 0.5; return Math.abs(mx - cx) < CW * 0.5 && Math.abs(my - cy) < CH * 0.5 && Math.abs(pos - Math.round(pos)) < 0.2; };
  let raf = 0, last = performance.now();
  const frame = (now) => { const dt = Math.min(0.05, (now - last) / 1000); last = now; const prev = pos; pos += (tgt - pos) * (RM ? 1 : 1 - Math.pow(0.0025, dt)); vel = (pos - prev) / Math.max(dt, 1e-3) / 8; if (RM) vel = 0; vel = clamp(vel, -1.2, 1.2);
    const ni = clamp(Math.round(pos), 0, PJ.length - 1); if (ni !== cur) setTitle(ni);
    hoverT = overActive() ? 1 : 0; hover += (hoverT - hover) * 0.12;
    if (renderer) { const ox = W * 0.69 - W / 2, oy = 0; meshes.forEach((m, i) => { const off = (pos - i) * GAP; m.position.set(ox, oy, 0); const u = mats[i].uniforms; u.uOff.value = off; u.uVel.value = vel; u.uTime.value = now / 1000; u.uHover.value = i === cur ? hover : 0; m.visible = Math.abs(off) < GAP * 2.2; });
      renderer.render(scene0, cam); }
    else texC.forEach((c, i) => { const off = (pos - i) * GAP; c.style.left = W * 0.69 - CW / 2 + 'px'; c.style.top = H / 2 - CH / 2 + 'px'; c.style.transition = 'none'; c.style.transform = `translate(${off * 0.3 - Math.abs(off) * 0.12}px,${-off}px) translateZ(${-Math.abs(off) * 0.5}px) rotateX(${off * -0.02}deg) rotateY(-14deg) skewY(-4deg)`; c.style.filter = i === cur ? 'none' : 'grayscale(1) brightness(.8)'; });
    raf = requestAnimationFrame(frame); };
  raf = requestAnimationFrame(frame);
  window.__demoProof = async () => { const o = []; tgt = 0; pos = 0; setTitle(0); await sleep(60);
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: 700, bubbles: true, cancelable: true })); await sleep(1300); o.push(`wheel ↓ → project ${cur + 1}/9 "${PJ[cur].t}", title="${tbox.querySelector('h1:last-child').textContent}", active dot=${[...dots.children].findIndex((d) => d.classList.contains('on')) + 1}`);
    const r = el.getBoundingClientRect(); const x = r.left + W * 0.5, y = r.top + H * 0.6; el.dispatchEvent(new PointerEvent('pointerdown', { clientX: x, clientY: y, bubbles: true, pointerId: 5 }));
    for (let k = 1; k <= 10; k++) { el.dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: y - k * 40, bubbles: true, pointerId: 5 })); await sleep(16); }
    o.push(`drag ↑ mid-flight velocity bend=${vel.toFixed(2)}`); el.dispatchEvent(new PointerEvent('pointerup', { clientX: x, clientY: y - 400, bubbles: true, pointerId: 5 })); await sleep(1300); o.push(`drag release → "${PJ[cur].t}"`);
    dots.children[6].click(); await sleep(1500); o.push(`dot 7 → "${PJ[cur].t}", bg=${getComputedStyle(bg).backgroundColor}`);
    o.push(`renderer=${renderer ? 'webgl' : 'css-fallback'}`);
    go(0); await sleep(1600); o.push(`restored → "${PJ[cur].t}"`); return o.join('; '); };
};

export function mount(root, variant, opts, T) { (V[variant] || V['3d-blob-param-mixer'])(root, T); }
