import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/space-grotesk';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import '@fontsource/press-start-2p';
import { h, s, drag, clamp, toast, sleep, noise2, fitCanvas, blip, audio, rng, pick, css, localPos, fire } from '../lib.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
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

V['bureau-cool-mono-studio-rotating-glass-ring-live-traffic-labels'] = (root, T) => {
  import('@fontsource/courier-prime/400.css'); import('@fontsource/ibm-plex-mono/600.css'); import('@fontsource/ibm-plex-mono/700.css');
  theme(root, T, { bg: '#dedede', fg: '#000000', ac: '#000000', dark: false });
  const MB = "'ArialMonospaced-Bold','IBM Plex Mono',ui-monospace,monospace", SM = "'CentSchbookMonoBTWXX-Rg','Courier Prime','Courier New',serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  css(`.bc{position:absolute;inset:0;overflow:hidden;background:#dedede;color:#000;font-family:${MB};user-select:none;-webkit-user-select:none;cursor:grab;touch-action:none}
.bc.grab{cursor:grabbing}
.bc canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.bc-hd{position:absolute;left:20px;top:20px;z-index:3;pointer-events:none}
.bc-hd .sr{font:400 73px/1 ${SM};letter-spacing:-.035em;margin:0 0 0 1px;transform:scaleY(1.12);transform-origin:0 100%}
.bc-hd h1{margin:6px 0 0;font:700 68.5px/1.0 ${MB};letter-spacing:-.005em;text-transform:uppercase;max-width:1180px}
.bc-nav{position:absolute;left:20px;top:234px;display:flex;gap:10px;z-index:4}
.bc .bc-pill{position:relative;height:24px;padding:0 11px;border:1.5px solid #000;border-radius:8px;background:transparent;font:700 12.5px/21px ${MB};color:#000;cursor:pointer;letter-spacing:.01em}
.bc .bc-pill:hover,.bc .bc-pill.on{background:#000;color:#dedede}
.bc .bc-pill.soft{border-color:#9b9b9b}
.bc-pill sup{position:absolute;right:-9px;top:-9px;background:#6f6f6f;color:#dedede;border-radius:6px;font:700 7.5px/1 ${MB};padding:2px 3px}
.bc-toast{position:absolute;right:20px;top:26px;height:28px;display:flex;align-items:center;gap:10px;padding:0 6px 0 14px;border-radius:9px;background:#bdbdbd;color:#f2f2f2;font:700 12px/1 ${MB};z-index:4;transition:opacity .3s,transform .3s}
.bc-toast.off{opacity:0;transform:translateY(-8px);pointer-events:none}
.bc .bc-toast button{width:17px;height:17px;border-radius:50%;border:0;background:#4a4a4a;color:#dedede;font:700 11px/17px ${MB};padding:0;cursor:pointer}
.bc-rt{position:absolute;left:20px;top:466px;font:700 12.5px/1 ${MB};z-index:3}
.bc-lb{position:absolute;left:0;top:0;z-index:2;pointer-events:none}
.bc-g{position:absolute;left:0;top:0;will-change:transform;pointer-events:auto;cursor:default}
.bc-g .dot{position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff,#e9e9e9 55%,#bdbdbd);box-shadow:0 1px 2px #0003;transition:transform .2s}
.bc-g .rows{position:absolute;left:12px;top:15px;white-space:nowrap;font:700 12.5px/17.5px ${MB}}
.bc-g .r{display:block;padding:0 3px;margin-left:-3px;transition:background .15s,color .15s}
.bc-g .r i{font-style:normal;color:#9a9a9a}.bc-g .r i.on{color:#000}
.bc-g .r.pop{animation:bcPop .9s cubic-bezier(.2,.9,.3,1.3)}
@keyframes bcPop{0%{opacity:0;transform:translateX(-10px)}30%{background:#000;color:#dedede}100%{opacity:1}}
.bc-g:hover .r,.bc-g.hov .r{background:#000;color:#dedede}.bc-g:hover .r i,.bc-g.hov .r i{color:#bcbcbc}
.bc-g:hover .dot,.bc-g.hov .dot{transform:scale(1.8)}
.bc-g.back{opacity:.55}
.bc-ck{position:absolute;left:20px;bottom:20px;display:flex;gap:6px;z-index:4;transition:opacity .3s}
.bc-ck.off{opacity:0;pointer-events:none}
.bc-ck span{height:24px;padding:0 8px;border:1.5px solid #000;border-radius:8px;font:400 13px/21px ${SM};letter-spacing:-.02em}
.bc-ck span u{cursor:pointer}
.bc-ov{position:absolute;left:20px;right:20px;top:276px;bottom:60px;z-index:5;background:#dededeee;backdrop-filter:blur(6px);font:700 13px/1.5 ${MB};display:none;overflow:auto;padding:10px 0}
.bc-ov.on{display:block;animation:bcIn .3s ease}
@keyframes bcIn{from{opacity:0;transform:translateY(8px)}}
.bc-ov table{border-collapse:collapse;width:100%}.bc-ov td{padding:7px 0;border-top:1.5px solid #000}.bc-ov tr:hover td{background:#000;color:#dedede}
.bc-ov p{font:400 22px/1.3 ${SM};max-width:900px;margin:0 0 16px}
.bc-fail{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:700 12px ${MB};color:#777}
`);
  const el = h('div.bc'); root.append(el);
  // ---------- WebGL glass ring ----------
  let S = null, ring = null, hold = 0;
  try {
    S = stage(el, { bg: '#dedede' }); S.cam.fov = 40; S.cam.updateProjectionMatrix(); S.cam.position.set(0, 0, 12.4);
    const pm = new THREE.PMREMGenerator(S.r); S.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    S.r.toneMapping = THREE.ACESFilmicToneMapping; S.r.toneMappingExposure = 1.05;
    S.scene.add(new THREE.HemisphereLight(0xffffff, 0x9a9a9a, 0.8)); const dl = new THREE.DirectionalLight(0xffffff, 1.4); dl.position.set(-4, 6, 8); S.scene.add(dl);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xf4f4f4, metalness: 0, roughness: 0.18, transmission: 0.92, thickness: 0.35, ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true, opacity: 0.95, envMapIntensity: 1.2 });
    ring = new THREE.Group(); const torus = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.075, 40, 280), mat); ring.add(torus);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.028, 16, 260), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, transparent: true, opacity: 0.35 })); inner.position.z = -0.06; ring.add(inner);
    S.scene.add(ring); S.cam.lookAt(0, 0, 0);
  } catch (e) { el.append(h('div.bc-fail', {}, 'WebGL unavailable — labels still orbit (CSS fallback)')); S = null; }
  // ---------- traffic data ----------
  const TRAFFIC = [
    { a: 112, rows: [['DE', 'ONLINE'], ['BE', '1H AGO'], ['AT', '7H AGO']] },
    { a: 168, rows: [['AE', '9H AGO']] },
    { a: 196, rows: [['IN', '7H AGO'], ['IN', '8H AGO'], ['IN', '10H AGO']] },
    { a: 226, rows: [['CN', '6H AGO'], ['TW', '9H AGO'], ['CN', '10H AGO']] },
    { a: 238, rows: [['SG', '5H AGO']] },
    { a: 262, rows: [['BR', '6H AGO'], ['JP', '11H AGO'], ['JP', '12H AGO']] },
    { a: 352, rows: [['US', 'ONLINE'], ['US', 'ONLINE'], ['US', '22MIN AGO'], ['US', '23MIN AGO'], ['US', '5H AGO'], ['US', '10H AGO']] },
    { a: 48, rows: [['GB', '2H AGO'], ['FR', '3H AGO']] },
    { a: 300, rows: [['KR', '4H AGO']] }];
  const CODES = ['DE', 'US', 'GB', 'FR', 'NL', 'KR', 'JP', 'BR', 'IN', 'SE', 'CH', 'CA', 'AU', 'IT', 'ES'];
  const lb = h('div.bc-lb'); el.append(lb);
  let groups = [];
  const rowEl = ([c, t], pop) => h('span.r' + (pop ? '.pop' : ''), {}, `${c}, `, h('i' + (t === 'ONLINE' ? '.on' : ''), {}, t));
  const build = () => { lb.innerHTML = ''; groups = TRAFFIC.map((g0) => { const rows = h('div.rows', {}, g0.rows.map((r) => rowEl(r))); const e = h('div.bc-g', {}, h('div.dot'), rows); lb.append(e);
    const g = { ...g0, rows: g0.rows.map((r) => [...r]), e, rowsEl: rows }; e.addEventListener('pointerenter', () => { hold++; }); e.addEventListener('pointerleave', () => { hold = Math.max(0, hold - 1); }); return g; }); };
  const age = (t) => (t === 'ONLINE' ? '1MIN AGO' : t);
  const addEntry = (gi = Math.floor(Math.random() * groups.length), code = null) => { const g = groups[gi]; const c = code || (Math.random() < 0.6 ? (g.rows[0]?.[0] || pick(CODES)) : pick(CODES));
    g.rows.forEach((r, i) => { if (i >= 1) r[1] = age(r[1]); }); g.rows.unshift([c, 'ONLINE']); if (g.rows.length > 6) g.rows.pop();
    g.rowsEl.innerHTML = ''; g.rows.forEach((r, i) => g.rowsEl.append(rowEl(r, i === 0))); return { group: gi, code: c, rows: g.rows.length }; };
  // ---------- chrome ----------
  const hd = h('div.bc-hd', {}, h('div.sr', {}, 'BUREAU COOL'), h('h1', {}, 'A BOUTIQUE DESIGN STUDIO AND DIGITAL PARTNER'));
  const ov = h('div.bc-ov');
  const PROJ = [['2026', 'BRUTAL OBJECTS', 'IDENTITY, WEBSITE'], ['2025', 'NORDIC FIELD NOTES', 'EDITORIAL, 3D'], ['2025', 'SOFT MACHINES', 'CAMPAIGN'], ['2024', 'PAPER STEREO', 'PACKAGING, MOTION'], ['2024', 'GLASS HOUSE RECORDS', 'IDENTITY'], ['2023', 'COOL CLUB SHOP', 'E-COMMERCE']];
  let ovKind = null;
  const openOv = (k) => { ovKind = ovKind === k ? null : k; navBtns.forEach((b) => b.classList.toggle('on', b.dataset.k === ovKind)); ov.classList.toggle('on', !!ovKind); ov.innerHTML = '';
    if (ovKind === 'projects') ov.append(h('table', {}, PROJ.map((r) => h('tr', {}, r.map((c) => h('td', {}, c))))));
    if (ovKind === 'information') ov.append(h('p', {}, 'Bureau Cool is a boutique design studio and digital partner working across identity, editorial, interactive and spatial work.'), h('p', {}, 'Every visit leaves a trace — the ring shows where our recent traffic came from, live.'), h('div', {}, 'HELLO@BUREAU.COOL')); };
  const navBtns = [['PROJECTS', 'projects'], ['INFORMATION', 'information']].map(([t, k]) => h('button.bc-pill', { 'data-k': k, onclick: () => openOv(k) }, t));
  const shop = h('button.bc-pill.soft', { onclick: () => toast('Shop — 0 new items') }, 'SHOP', h('sup', {}, 'NEW'));
  const nav = h('div.bc-nav', {}, ...navBtns, shop);
  const tst = h('div.bc-toast', {}, '/0000 NEW ITEMS', h('button', { 'aria-label': 'close', onclick: () => tst.classList.add('off') }, '×'));
  const ck = h('div.bc-ck', {}, h('span', {}, 'THIS WEBSITE USES COOKIES, MORE INFORMATION ', h('u', { onclick: () => openOv('information') }, 'HERE'), '.'), h('button.bc-pill', { style: { background: 'transparent' }, onclick: () => ck.classList.add('off') }, 'ACCEPT'));
  el.append(hd, nav, tst, h('div.bc-rt', {}, 'RECENT TRAFFIC'), ck, ov);
  [hd, nav, tst, ck, ov].forEach((x) => x.addEventListener('pointerdown', (e) => e.stopPropagation()));
  // ---------- motion + drag ----------
  let spin = 0, vel = 0, tiltX = 0, t0 = 0, dragging = false, lastX = 0, lastY = 0, paused = false;
  el.addEventListener('pointerdown', (e) => { if (e.target.closest('.bc-g')) return; dragging = true; lastX = e.clientX; lastY = e.clientY; el.classList.add('grab'); el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; vel = dx * 0.004; tiltX = clamp(tiltX + dy * 0.004, -0.8, 0.8); spin += vel; });
  const endDrag = () => { dragging = false; el.classList.remove('grab'); }; el.addEventListener('pointerup', endDrag); el.addEventListener('pointercancel', endDrag);
  const v3 = S ? new THREE.Vector3() : null;
  let tPrev = 0;
  const frame = (t) => { const dt = Math.min(0.05, t - tPrev || 0.016); tPrev = t; if (!paused) t0 += dt * (hold ? 0.06 : 1) * (RM ? 0.25 : 1);
    if (!dragging) { spin += vel; vel *= 0.95; tiltX *= 0.985; }
    const W = el.clientWidth, H = el.clientHeight;
    const ry = Math.sin(t0 * 0.16) * 0.55 + spin, rx = 0.18 + Math.sin(t0 * 0.11 + 1) * 0.22 + tiltX, rz = t0 * 0.035;
    if (ring) { ring.rotation.set(rx, ry, rz); ring.updateMatrixWorld(); }
    for (const g of groups) { let x, y, z = 0; const a = (g.a * Math.PI) / 180;
      if (ring) { v3.set(Math.cos(a) * 3.25, Math.sin(a) * 3.25, 0); ring.localToWorld(v3); z = v3.z; v3.project(S.cam); x = (v3.x * 0.5 + 0.5) * W; y = (-v3.y * 0.5 + 0.5) * H; }
      else { const R0 = Math.min(W, H) * 0.37, aa = a + rz; x = W / 2 + Math.cos(aa) * R0 * Math.cos(ry); y = H / 2 - Math.sin(aa) * R0; }
      g.e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; g.e.classList.toggle('back', z < -1.2); g.sx = x; g.sy = y; }
    if (!S) requestAnimationFrame((tt) => frame(tt / 1000)); };
  build();
  if (S) S.on(frame); else requestAnimationFrame((tt) => frame(tt / 1000));
  let liveT = setInterval(() => { if (!document.hidden && !hold) addEntry(); }, 5200);
  const reset = () => { build(); spin = 0; vel = 0; tiltX = 0; t0 = 0; hold = 0; paused = false; tst.classList.remove('off'); ck.classList.remove('off'); ovKind = 'x'; openOv('x'); ovKind = null; ov.classList.remove('on'); navBtns.forEach((b) => b.classList.remove('on')); };
  window.__demoProof = async () => { const o = []; reset(); await sleep(120);
    const p0 = groups.map((g) => [g.sx, g.sy]); await sleep(900); const moved = groups.reduce((m, g, i) => Math.max(m, Math.hypot(g.sx - p0[i][0], g.sy - p0[i][1])), 0);
    o.push(`ring ${S ? 'WebGL' : 'CSS-fallback'} rotating: labels reprojected, max drift ${moved.toFixed(1)}px in 0.9s (rot y=${ring ? ring.rotation.y.toFixed(3) : 'n/a'})`);
    const n0 = groups[6].rows.length; const r = addEntry(6, 'US'); await sleep(50); o.push(`new traffic entry → "${groups[6].rowsEl.firstChild.textContent}" popped (${n0}→${r.rows} rows, pop=${groups[6].rowsEl.firstChild.classList.contains('pop')})`);
    const rs0 = [...groups[0].rowsEl.children]; rs0.forEach((r) => (r.style.transition = 'none')); groups[0].e.dispatchEvent(new PointerEvent('pointerenter')); groups[0].e.classList.add('hov'); await sleep(60); o.push(`hover DE group → highlight bg=${getComputedStyle(groups[0].rowsEl.firstChild).backgroundColor}, ring slowed (hold=${hold})`); groups[0].e.classList.remove('hov'); rs0.forEach((r) => (r.style.transition = '')); groups[0].e.dispatchEvent(new PointerEvent('pointerleave'));
    const rect = el.getBoundingClientRect(); const sp0 = spin; el.dispatchEvent(new PointerEvent('pointerdown', { clientX: rect.left + 700, clientY: rect.top + 600, pointerId: 1, bubbles: true })); el.dispatchEvent(new PointerEvent('pointermove', { clientX: rect.left + 820, clientY: rect.top + 610, pointerId: 1, bubbles: true })); el.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, bubbles: true }));
    o.push(`drag spin Δ=${(spin - sp0).toFixed(3)}rad`);
    navBtns[0].click(); o.push(`PROJECTS pill → overlay rows=${ov.querySelectorAll('tr').length}`); navBtns[0].click();
    tst.querySelector('button').click(); o.push(`NEW ITEMS toast closed=${tst.classList.contains('off')}`); ck.querySelector('button').click(); o.push(`cookie ACCEPT hidden=${ck.classList.contains('off')}`);
    reset(); o.push('restored: default traffic, toast + cookie bar back, overlay closed'); return o.join('; '); };
};

V['unseen-audio-enter-gate-spaced-letter-loader-click-hold-drag-world-project-filter'] = (root, T) => {
  import('@fontsource/instrument-serif/400.css'); import('@fontsource/instrument-serif/400-italic.css');
  theme(root, T, { bg: '#efded9', fg: '#1d1d1d', ac: '#ff4a1c', dark: false });
  const SR = "'Instrument Serif','Saol Display',Georgia,serif", GR = "'Inter Variable','Neue Montreal','Helvetica Neue',Arial,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches; const AC = '#ff4a1c';
  const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")`;
  css(`.un{position:absolute;inset:0;background:#efded9;color:#1d1d1d;font-family:${GR};overflow:hidden;cursor:none}
.un *{box-sizing:border-box}.un button{cursor:none}
.un-gl{position:absolute;inset:0}.un-gl canvas{display:block;width:100%;height:100%}
.un-grain{position:absolute;inset:-50%;background-image:${GRAIN};opacity:.16;pointer-events:none;z-index:9;mix-blend-mode:multiply;animation:unGr .5s steps(4) infinite}
@keyframes unGr{0%{transform:translate(0,0)}25%{transform:translate(-3%,2%)}50%{transform:translate(2%,-3%)}75%{transform:translate(-1%,3%)}}
.un-vig{position:absolute;inset:0;pointer-events:none;z-index:8;box-shadow:inset 0 0 160px #6a3f5a30}
.un-hd{position:absolute;left:0;right:0;top:0;height:64px;display:flex;align-items:center;padding:0 22px;z-index:20;pointer-events:none}
.un-hd>*{pointer-events:auto}
.un-wm{font:500 21px ${GR};letter-spacing:-.045em;cursor:none}.un-wm sup{font-size:9px;vertical-align:10px;margin-left:1px}
.un-hd .sp{flex:1}.un-hd nav{display:flex;gap:16px;font:450 13.5px ${GR};margin-right:14px}.un-hd nav a{cursor:none;position:relative}
.un-hd nav a::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:right;transition:transform .3s}.un-hd nav a:hover::after{transform:scaleX(1);transform-origin:left}
.un .un-mb{width:32px;height:32px;border-radius:50%;background:#fff;border:0;display:grid;place-items:center;padding:0;transition:transform .3s}
.un-mb i{display:block;width:12px;height:4px;background:radial-gradient(circle at 2px 2px,#111 1.6px,transparent 2px),radial-gradient(circle at 10px 2px,#111 1.6px,transparent 2px)}
.un.menu .un-mb{transform:rotate(90deg)}
.un-ft{position:absolute;left:0;right:0;bottom:0;height:64px;display:flex;align-items:center;padding:0 22px;gap:10px;z-index:20;pointer-events:none}.un-ft>*{pointer-events:auto}
.un .un-snd{width:32px;height:32px;border-radius:50%;background:#1d1d1d;border:0;display:flex;align-items:center;justify-content:center;gap:2px;padding:0}
.un-snd i{width:2px;height:3px;background:#fff;border-radius:1px;transition:height .2s}.un.snd .un-snd i{animation:unEq .7s ease-in-out infinite alternate}.un-snd i:nth-child(2){animation-delay:-.25s!important}.un-snd i:nth-child(3){animation-delay:-.5s!important}
@keyframes unEq{from{height:3px}to{height:11px}}
.un .un-wr{height:30px;padding:0 14px;border-radius:16px;border:1px solid #ffffffcc;background:#ffffff1a;color:#fff;font:450 12.5px ${GR};backdrop-filter:blur(6px)}
.un-ft .sp{flex:1}.un-cy{font:450 11px ${GR};color:#fff;opacity:.9}
.un .un-glb{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);width:40px;height:40px;border-radius:50%;background:#fff;border:0;display:grid;place-items:center;padding:0;z-index:21}
.un-glb svg.r{position:absolute;inset:-5px;width:50px;height:50px;transform:rotate(-90deg)}
.un-hero{position:absolute;left:0;right:0;top:44%;text-align:center;z-index:5;pointer-events:none;transform:translateY(-50%)}
.un-hero .k{font:500 10.5px ${GR};letter-spacing:.02em;text-transform:uppercase}
.un-hero h1{margin:6px 0 0;font-weight:400;line-height:.82}
.un-hero h1 em{display:block;font:italic 400 92px ${SR};letter-spacing:-.035em;margin-right:-40px}
.un-hero h1 span{display:block;font:400 88px ${GR};letter-spacing:-.065em;margin-top:-10px;margin-left:-30px}
.un .un-vw{pointer-events:auto;margin-top:24px;height:32px;padding:0 15px;border-radius:17px;border:0;background:#fff;color:#111;font:450 12.5px ${GR};transition:background .25s,color .25s}
.un-vw:hover,.un-ent:hover{background:#1d1d1d!important;color:#fff!important}
.un-cur{position:absolute;left:0;top:0;width:0;height:0;z-index:60;pointer-events:none}
.un-cur .d{position:absolute;left:-4px;top:-4px;width:8px;height:8px;border-radius:50%;background:#1d1d1d;transition:transform .25s}
.un-cur svg{position:absolute;left:-34px;top:-34px;width:68px;height:68px;transform:rotate(-90deg);opacity:0;transition:opacity .25s}
.un-cur .t{position:absolute;left:18px;top:14px;font:500 10.5px ${GR};white-space:nowrap;text-transform:uppercase;letter-spacing:.04em;opacity:0;transition:opacity .25s;color:#1d1d1d;background:#ffffffb0;padding:3px 7px;border-radius:9px}
.un-cur.lab svg,.un-cur.lab .t{opacity:1}.un-cur.lab .d{transform:scale(.6)}
.un-cur.ui .d{transform:scale(2.4);background:#1d1d1d30}
.un-gate{position:absolute;inset:0;background:#efded9;z-index:40;display:flex;flex-direction:column;align-items:center;transition:opacity 1s,visibility 1s}
.un-gate.off{opacity:0;visibility:hidden}
.un-ltr{height:96px;margin-top:270px;position:relative;width:140px}
.un-ltr b{position:absolute;inset:0;text-align:center;font:400 62px/96px ${GR};color:#444;letter-spacing:-.02em;opacity:0;transition:opacity .12s}.un-ltr b.on{opacity:1}
.un-row{position:absolute;left:0;right:0;top:300px;text-align:center;font:400 13px ${GR};letter-spacing:1.1em;color:#5558;opacity:0;transition:opacity .4s}
.un-eyes{position:absolute;left:50%;top:274px;width:126px;height:96px;transform:translateX(-50%);opacity:0;transition:opacity .4s}.un-eyes.on{opacity:1}
.un-gate h2{margin:10px 0 0;font:500 14.5px ${GR};letter-spacing:-.03em;color:#2a2a2a}.un-gate h2 sup{font-size:8px}
.un-gate p{margin:8px 0 0;width:300px;text-align:center;font:400 13px/1.25 ${GR};letter-spacing:-.025em;color:#3a3a3a}
.un .un-ent{margin-top:24px;height:36px;padding:0 20px;border-radius:19px;border:0;background:#fff;color:#1d1d1d;font:450 14px ${GR};opacity:0;transform:translateY(8px);transition:opacity .5s,transform .5s,background .25s,color .25s}
.un-gate.ready .un-ent{opacity:1;transform:none}
.un .un-noa{position:absolute;bottom:56px;background:none;border:0;border-bottom:1px solid #1d1d1d;padding:0 0 1px;font:500 9.5px ${GR};letter-spacing:.01em;color:#1d1d1d;text-transform:uppercase;opacity:0;transition:opacity .5s}
.un-gate.ready .un-noa{opacity:1}
.un-flash{position:absolute;inset:0;background:#fff4f2;z-index:30;opacity:0;pointer-events:none;transition:opacity .7s}
.un-wh{position:absolute;left:50%;bottom:76px;transform:translateX(-50%);z-index:22;font:500 11px ${GR};text-transform:uppercase;letter-spacing:.06em;color:#fff;display:flex;gap:12px;align-items:center;opacity:0;transition:opacity .5s;pointer-events:none;text-shadow:0 1px 8px #0004}
.un.world .un-wh{opacity:1}.un.world.menu .un-wh,.un.world.proj .un-wh{opacity:0}.un.world.menu .un-ex,.un.world.proj .un-ex{display:none}.un.world .un-hero{opacity:0}.un-hero{transition:opacity .6s}
.un-wh b{font:italic 400 22px ${SR};text-transform:none;letter-spacing:-.01em}
.un .un-ex{position:absolute;right:22px;bottom:16px;z-index:22;height:30px;padding:0 14px;border-radius:16px;border:0;background:#fff;font:450 12px ${GR};display:none}
.un.world .un-ex{display:block}.un.world .un-cy{display:none}
.un-menu{position:absolute;inset:0;background:#efded9;z-index:18;transform:translateY(-100%);transition:transform .8s cubic-bezier(.7,0,.2,1);display:grid;grid-template-columns:1fr 340px;padding:110px 60px 80px 90px}
.un.menu .un-menu{transform:none}
.un-menu ol{list-style:none;margin:0;padding:0}
.un-menu li{display:flex;align-items:flex-start;gap:14px;cursor:none;width:max-content;overflow:hidden}
.un-menu li small{font:500 12px ${GR};margin-top:22px;width:22px}
.un-menu li span{font:400 128px/.9 ${SR};letter-spacing:-.04em;transition:transform .5s cubic-bezier(.6,0,.2,1),color .3s;display:inline-block}
.un-menu li:hover span{font-style:italic;color:${AC};transform:translateX(18px)}
.un-menu .ct{align-self:end;display:grid;gap:8px;font:450 14px ${GR}}.un-menu .ct a{cursor:none}.un-menu .ct a:hover{color:${AC}}
.un-pj{position:absolute;inset:0;z-index:16;overflow-y:auto;opacity:0;visibility:hidden;transition:opacity .7s,visibility .7s;background:radial-gradient(ellipse 120px 420px at 4% 40%,#fff 0,#fff0 70%),radial-gradient(ellipse 120px 420px at 96% 40%,#fff 0,#fff0 70%),linear-gradient(#efefef,#e4e1e1);scrollbar-width:none}
.un-pj::-webkit-scrollbar{display:none}
.un.proj .un-pj{opacity:1;visibility:visible}
.un-pj h2{margin:62px 0 0;text-align:center;font:400 56px ${GR};letter-spacing:-.05em}
.un-chips{display:flex;gap:4px;justify-content:center;margin:16px auto 0;width:max-content;padding:4px;border-radius:20px;background:#fff}
.un .un-chips button{height:24px;padding:0 11px;border-radius:13px;border:0;background:transparent;font:450 10.5px ${GR};color:#1d1d1d;transition:background .3s,color .3s}
.un-chips button sup{font-size:7px;margin-left:2px}.un-chips button.on{background:#1d1d1d;color:#fff}.un-chips button:not(.on):hover{color:${AC}}
.un-grid{display:grid;grid-template-columns:1fr 1fr;gap:34px 22px;width:1100px;margin:44px auto 80px}
.un-card{transition:transform .5s cubic-bezier(.6,0,.2,1),opacity .4s}.un-card.out{opacity:0;transform:scale(.94)}.un-card.gone{display:none}
.un-card canvas{display:block;width:100%;aspect-ratio:16/8.4;background:#ccc;transition:filter .4s}.un-card:hover canvas{filter:saturate(1.25) brightness(1.06)}
.un-card .m{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #1d1d1d;padding:7px 0 5px}
.un-card b{display:block;font:600 14px ${GR};letter-spacing:-.02em}.un-card span{font:400 13.5px ${GR};letter-spacing:-.02em}
@media (prefers-reduced-motion: reduce){.un-grain{animation:none}.un-menu,.un-card{transition:none}}
`);
  const el = h('div.un'); root.append(el);
  // ---------- WebGL scene (code-built stand-in for the studio's pink surreal set) ----------
  const glw = h('div.un-gl'); el.append(glw);
  const R3 = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); R3.setPixelRatio(Math.min(1.5, devicePixelRatio)); R3.shadowMap.enabled = true; R3.shadowMap.type = THREE.PCFSoftShadowMap; R3.toneMapping = THREE.ACESFilmicToneMapping; R3.toneMappingExposure = 1.05; glw.append(R3.domElement);
  const SC = new THREE.Scene(); SC.fog = new THREE.Fog(0xe9cfd2, 40, 150);
  const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 600);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: {}, vertexShader: 'varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: 'varying vec3 p;void main(){float t=clamp(p.y*1.6+.05,0.,1.);vec3 a=vec3(.98,.86,.88),b=vec3(.72,.78,.95);gl_FragColor=vec4(mix(a,b,pow(t,.8)),1.);}' })); SC.add(sky);
  SC.add(new THREE.HemisphereLight(0xfff0f3, 0xb9a0b8, 1.25));
  const sun = new THREE.DirectionalLight(0xfff2e8, 2.3); sun.position.set(-14, 18, 12); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 80 }); sun.shadow.bias = -0.0008; sun.shadow.radius = 4; SC.add(sun);
  const PINK = new THREE.MeshStandardMaterial({ color: 0xe9c1b9, roughness: 0.96 }), PINK2 = new THREE.MeshStandardMaterial({ color: 0xf0cfc8, roughness: 0.9 });
  const wallShape = (w, hh, holes) => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(w, 0); sh.lineTo(w, hh); sh.lineTo(0, hh); sh.lineTo(0, 0);
    holes.forEach(([x, y, hw, hy, arch]) => { const p = new THREE.Path(); p.moveTo(x, y); p.lineTo(x + hw, y); p.lineTo(x + hw, y + hy); if (arch) p.absarc(x + hw / 2, y + hy, hw / 2, 0, Math.PI, false); else p.lineTo(x, y + hy); p.lineTo(x, y); sh.holes.push(p); }); return sh; };
  const wall = (w, hh, holes, depth, mat) => { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(wallShape(w, hh, holes), { depth, bevelEnabled: false, curveSegments: 24 }), mat); m.castShadow = m.receiveShadow = true; return m; };
  const room = new THREE.Group(); SC.add(room);
  const back = wall(18, 15, [[10.2, 6.4, 2.6, 6.4, 0], [6.2, 2.7, 1.4, 3.2, 0]], 1.2, PINK); back.position.set(-3, -0.5, -5); room.add(back);
  const left = wall(14, 13, [[2.2, 0, 3.2, 5.6, 1], [7.6, 0, 3.2, 5.6, 1]], 1.3, PINK2); left.position.set(-3.6, -0.5, -4.6); left.rotation.y = Math.PI / 2 + 0.62; room.add(left);
  const plat = new THREE.Mesh(new THREE.BoxGeometry(12, 2.7, 3.2), PINK2); plat.position.set(3, 0.85, -3.3); plat.castShadow = plat.receiveShadow = true; room.add(plat);
  for (let i = 0; i < 7; i++) { const hh = (i + 1) * 0.31 + 0.5; const st = new THREE.Mesh(new THREE.BoxGeometry(3.4, hh, 0.5), PINK2); st.position.set(0.2, -0.5 + hh / 2, -1.45 + (6 - i) * 0.5); st.castShadow = st.receiveShadow = true; room.add(st); }
  const pearl = new THREE.Mesh(new THREE.SphereGeometry(1.15, 64, 32), new THREE.MeshPhysicalMaterial({ color: 0xf6f0f4, roughness: 0.12, metalness: 0.15, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [200, 800] })); pearl.position.set(3.3, 3.35, -3.1); pearl.castShadow = true; room.add(pearl);
  const nzR = noise2(9); const rockGeo = (seed, det = 4) => { const g = new THREE.IcosahedronGeometry(1, det), a = g.attributes.position; for (let i = 0; i < a.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(a, i); const n = nzR(v.x * 1.6 + seed, v.y * 1.6 + v.z * 1.3) * 0.5 + nzR(v.x * 5 + seed, v.z * 5) * 0.12; v.multiplyScalar(0.8 + n); a.setXYZ(i, v.x, v.y, v.z); } g.computeVertexNormals(); return g; };
  const ROCK = new THREE.MeshStandardMaterial({ color: 0xd2b7a6, roughness: 1, flatShading: false });
  const rock = new THREE.Mesh(rockGeo(1), ROCK); rock.scale.set(1.7, 1.0, 1.3); rock.position.set(5.6, 0.3, 0.6); rock.castShadow = rock.receiveShadow = true; room.add(rock);
  const rock2 = new THREE.Mesh(rockGeo(7), ROCK); rock2.scale.set(2.4, 0.9, 1.8); rock2.position.set(11.5, 0.1, 3.2); rock2.castShadow = true; room.add(rock2);
  const HILL = new THREE.MeshStandardMaterial({ color: 0xb69bd0, roughness: 1 }); [[-34, -40, 16, 5], [-52, -26, 22, 7], [-20, -60, 20, 6], [-70, -60, 30, 9]].forEach(([x, z, r, hh]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), HILL); m.scale.set(r, hh, r * 0.8); m.position.set(x, -1, z); SC.add(m); });
  const refl = new Reflector(new THREE.PlaneGeometry(400, 400), { textureWidth: 512, textureHeight: 512, color: 0x9c93ae }); refl.rotation.x = -Math.PI / 2; refl.position.y = -0.02; SC.add(refl);
  const tint = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0xcdb5c4, transparent: true, opacity: 0.5, roughness: 0.25, metalness: 0.1 })); tint.rotation.x = -Math.PI / 2; tint.position.y = 0.01; tint.receiveShadow = true; SC.add(tint);
  // the wider "Unseen World": islands of arches, pearls, columns and rocks on endless water
  const world = new THREE.Group(); SC.add(world); const RW_ = rng(77); const PALW = [0xe9c1b9, 0xf3d7cf, 0xd9b2c9, 0xc7c0e6, 0xf1c6a8];
  for (let i = 0; i < 34; i++) { const a = RW_() * Math.PI * 2, d = 18 + RW_() * 62, x = Math.cos(a) * d, z = Math.sin(a) * d - 10; const g = new THREE.Group(); g.position.set(x, 0, z); const mat = new THREE.MeshStandardMaterial({ color: PALW[i % 5], roughness: 0.9 });
    const isl = new THREE.Mesh(new THREE.CylinderGeometry(2.6 + RW_() * 2, 3 + RW_() * 2, 0.6, 40), mat); isl.position.y = 0.1; isl.receiveShadow = true; g.add(isl); const kind = i % 5;
    if (kind === 0) { const ar = wall(4, 5, [[1, 0, 2, 2.6, 1]], 0.8, mat); ar.position.set(-2, 0.3, -0.4); g.add(ar); } else if (kind === 1) { const p = new THREE.Mesh(new THREE.SphereGeometry(1 + RW_() * 0.8, 48, 24), pearl.material); p.position.y = 1.6; p.castShadow = true; g.add(p); }
    else if (kind === 2) { for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2 + k * 1.3, 24), mat); c.position.set(-1.2 + k * 1.2, 1 + k * 0.65, 0); c.castShadow = true; g.add(c); } }
    else if (kind === 3) { const r = new THREE.Mesh(rockGeo(i, 3), ROCK); r.scale.set(1.8, 1.2, 1.5); r.position.y = 0.9; r.castShadow = true; g.add(r); } else { const c = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.2, 4), mat); c.position.y = 1.9; c.rotation.y = RW_(); c.castShadow = true; g.add(c); }
    g.rotation.y = RW_() * 6; world.add(g); }
  // ---------- camera rig: home (parallax) / world (drag + inertia) ----------
  const HOME = { p: new THREE.Vector3(0.6, 3.1, 15.5), t: new THREE.Vector3(1.4, 3.6, -2) };
  let mode = 'gate', wT = new THREE.Vector2(0, 0), wV = new THREE.Vector2(0, 0), trans = null, mx = 0, my = 0, sm = new THREE.Vector2();
  const worldPose = () => ({ p: new THREE.Vector3(wT.x, 26, wT.y + 30), t: new THREE.Vector3(wT.x, 0, wT.y - 4) });
  const fit = () => { const w = glw.clientWidth || 1440, hh = glw.clientHeight || 862; R3.setSize(w, hh, false); cam.aspect = w / hh; cam.updateProjectionMatrix(); };
  fit(); new ResizeObserver(fit).observe(glw);
  let lt = performance.now(), hold = 0, holding = false, frames = 0, hT = performance.now();
  setInterval(() => { const now = performance.now(), d = (now - hT) / 1000; hT = now; if (holding) hold = Math.min(1, hold + d / (RM ? 0.6 : 1.3)); else hold = Math.max(0, hold - d * 2.2); setRing(hold); if (hold >= 1 && holding) { holding = false; hold = 0; setRing(0); enterWorld(); } }, 16);
  const tick = () => { requestAnimationFrame(tick); const now = performance.now(), dt = Math.min(0.5, (now - lt) / 1000); lt = now; const tm = now / 1000;
    if (mode === 'gate' && !trans) { return; }
    sm.x += (mx - sm.x) * 0.05; sm.y += (my - sm.y) * 0.05; pearl.position.y = 3.35 + (RM ? 0 : Math.sin(tm * 0.8) * 0.12);
    if (mode === 'world' && !dragging) { const f = dt * 60; wV.multiplyScalar(RM ? 0 : Math.pow(0.94, f)); wT.addScaledVector(wV, Math.min(f, 30)); if (wT.length() > 70) wT.setLength(70); }
    let P, Tg; if (trans) { const k = clamp((now - trans.t0) / trans.d, 0, 1), e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2; const to = trans.to(); P = trans.from.p.clone().lerp(to.p, e); Tg = trans.from.t.clone().lerp(to.t, e); if (k >= 1) { trans = null; } }
    else if (mode === 'world') { const wp = worldPose(); P = wp.p; Tg = wp.t; } else { P = HOME.p.clone().add(new THREE.Vector3(RM ? 0 : sm.x * 0.9, RM ? 0 : -sm.y * 0.5, 0)); Tg = HOME.t; }
    cam.position.copy(P); cam.lookAt(Tg); R3.render(SC, cam); frames++; };
  requestAnimationFrame(tick);
  // ---------- chrome ----------
  const grain = h('div.un-grain'), vig = h('div.un-vig');
  const hd = h('header.un-hd', {}, h('span.un-wm', { onclick: () => goHome() }, 'unseen studio', h('sup', {}, '°')), h('span.sp'), h('nav', {}, h('a', { onclick: () => goHome() }, 'Index'), h('a', { onclick: () => openProj() }, 'Projects'), h('a', { onclick: () => toggleMenu(true) }, 'Contact')), h('button.un-mb', { 'aria-label': 'Toggle Menu', onclick: () => toggleMenu() }, h('i')));
  const snd = h('button.un-snd', { 'aria-label': 'Toggle Sound', onclick: () => setSound(!soundOn) }, h('i'), h('i'), h('i'));
  const ft = h('footer.un-ft', {}, snd, h('button.un-wr', { onclick: () => toast('Our 2025 Wrapped (demo)') }, 'Our 2025 Wrapped'), h('span.sp'), h('span.un-cy', {}, '©2026'));
  const ringC = 2 * Math.PI * 22;
  const glb = h('button.un-glb', { 'aria-label': 'World', html: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#111" stroke-width="1.2"><circle cx="9" cy="9" r="7"/><path d="M2 9h14M9 2q-4 7 0 14M9 2q4 7 0 14M3.5 5.2h11M3.5 12.8h11"/></svg><svg class="r" viewBox="0 0 50 50"><circle cx="25" cy="25" r="22" fill="none" stroke="${AC}" stroke-width="2.2" stroke-dasharray="${ringC}" stroke-dashoffset="${ringC}" stroke-linecap="round"/></svg>` });
  const hero = h('div.un-hero', {}, h('div.k', {}, 'A brand, digital & motion studio'), h('h1', {}, h('em', {}, 'Creating the'), h('span', {}, 'unexpected')), h('button.un-vw', { onclick: () => openProj() }, 'View our work ↘'));
  const wh = h('div.un-wh', {}, '←', h('b', {}, 'Drag to explore our world'), '→');
  const ex = h('button.un-ex', { onclick: () => goHome() }, 'Exit world ×');
  const flash = h('div.un-flash');
  const cur = h('div.un-cur', { html: `<svg viewBox="0 0 68 68"><circle cx="34" cy="34" r="30" fill="none" stroke="#1d1d1d40" stroke-width="1.5"/><circle class="p" cx="34" cy="34" r="30" fill="none" stroke="${AC}" stroke-width="2.5" stroke-dasharray="${2 * Math.PI * 30}" stroke-dashoffset="${2 * Math.PI * 30}" stroke-linecap="round"/></svg>` }, h('i.d'), h('span.t', {}, 'Click & Hold'));
  const setRing = (v) => { cur.querySelector('.p').setAttribute('stroke-dashoffset', (1 - v) * 2 * Math.PI * 30); glb.querySelector('.r circle').setAttribute('stroke-dashoffset', (1 - v) * ringC); };
  // menu overlay
  const MI = [['01', 'Index', () => goHome()], ['02', 'Projects', () => openProj()], ['03', 'Contact', () => toast('projects@unseen.co')], ['04', 'World', () => { toggleMenu(false); enterWorld(); }]];
  const menu = h('div.un-menu', {}, h('ol', {}, MI.map(([n, t, f]) => h('li', { onclick: () => { f(); if (t !== 'World') toggleMenu(false); } }, h('small', {}, n), h('span', {}, t)))),
    h('div.ct', {}, ['projects@unseen.co', '(+44) 0117 922 6892', 'TWITTER', 'INSTAGRAM', 'LINKEDIN', 'DRIBBBLE', 'BEHANCE'].map((x) => h('a', { onclick: () => toast(x + ' (demo link)') }, '↳ ', x))));
  // projects overlay with filter
  const PJ = [['Nightpool', 'Portfolio Website, Immersive Experience', 'Digital', 'cube'], ['Desk Atlas', 'Website Design', 'Digital', 'desk'], ['Blue Marble', 'Real-time Earth, WebGL', 'Experiment', 'globe'], ['Silk Field', 'Generative Motion System', 'Motion', 'lines'], ['Mono Bloom', 'Brand Identity', 'Branding', 'bloom'], ['Orange Grid', 'Campaign, Motion Toolkit', 'Motion', 'grid'], ['Glasshouse', 'Brand Identity, Packaging', 'Branding', 'bottle'], ['Type Garden', 'Variable Font Playground', 'Experiment', 'type'], ['Tidal', 'App & Website', 'Digital', 'wave'], ['Pearl', 'Launch Film', 'Motion', 'pearl'], ['Northfold', 'Rebrand, Website', 'Branding', 'grid2'], ['Hollow Hills', 'Interactive World', 'Experiment', 'hills']];
  const CATS = ['All', 'Branding', 'Digital', 'Motion', 'Experiment'];
  let filt = 'All';
  const paint = (c, kind, seed) => { const W = c.width = 560, H = c.height = 294, x = c.getContext('2d'); const R = rng(seed + 3); const lg = (a, b, y0 = 0, y1 = H) => { const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
    if (kind === 'cube') { x.fillStyle = lg('#0b1640', '#1d3f8f'); x.fillRect(0, 0, W, H); x.fillStyle = '#0a0f2a'; x.beginPath(); x.moveTo(0, 210); x.quadraticCurveTo(140, 150, 230, 220); x.lineTo(0, 260); x.fill(); x.beginPath(); x.moveTo(W, 200); x.quadraticCurveTo(420, 150, 330, 225); x.lineTo(W, 260); x.fill(); x.fillStyle = lg('#16285e', '#05091f', 220, H); x.fillRect(0, 220, W, H); const g = x.createRadialGradient(280, 140, 10, 280, 140, 150); g.addColorStop(0, '#6fb6ff'); g.addColorStop(1, '#6fb6ff00'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.fillStyle = '#7cc4ff'; x.fillRect(235, 90, 90, 90); x.fillStyle = '#b9e0ff'; x.globalAlpha = 0.5; x.fillRect(235, 90, 90, 16); x.globalAlpha = 0.3; x.fillRect(240, 230, 80, 40); x.globalAlpha = 1; }
    else if (kind === 'desk') { x.fillStyle = lg('#e8d3c3', '#c9a68f'); x.fillRect(0, 0, W, H); x.fillStyle = '#d5b8a4'; for (let i = 0; i < 9; i++) x.fillRect(360 + (i % 3) * 52, 20 + (i / 3 | 0) * 40, 40, 30); x.fillStyle = '#7a5640'; x.fillRect(0, 230, W, 64); x.fillStyle = '#222'; x.fillRect(150, 90, 240, 140); const g = x.createLinearGradient(150, 0, 390, 0); g.addColorStop(0, '#ff6a3d'); g.addColorStop(1, '#8a2be2'); x.fillStyle = g; x.fillRect(156, 96, 228, 128); x.fillStyle = '#fff3'; for (let i = 0; i < 24; i++) x.fillRect(200 + (i % 8) * 22, 112 + (i / 8 | 0) * 30, 16, 22); x.fillStyle = '#4a7a3a'; x.beginPath(); x.ellipse(70, 150, 40, 70, 0, 0, 7); x.fill(); }
    else if (kind === 'globe' || kind === 'pearl') { x.fillStyle = kind === 'globe' ? lg('#0d2c44', '#2a6a8a') : lg('#f4d7dc', '#c9b6dd'); x.fillRect(0, 0, W, H); const g = x.createRadialGradient(250, 120, 10, 280, 150, 120); g.addColorStop(0, kind === 'globe' ? '#9fd4ff' : '#ffffff'); g.addColorStop(0.6, kind === 'globe' ? '#2c6aa0' : '#e6d4ee'); g.addColorStop(1, kind === 'globe' ? '#0b2238' : '#b49ccc'); x.fillStyle = g; x.beginPath(); x.arc(280, 150, 112, 0, 7); x.fill(); if (kind === 'globe') { x.fillStyle = '#c8b27a88'; for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(220 + R() * 120, 90 + R() * 120, 10 + R() * 30, 6 + R() * 18, R() * 3, 0, 7); x.fill(); } } }
    else if (kind === 'lines' || kind === 'wave') { x.fillStyle = kind === 'lines' ? '#1b1712' : '#e9f0f7'; x.fillRect(0, 0, W, H); x.strokeStyle = kind === 'lines' ? '#d8b98a' : '#3d6fb5'; x.lineWidth = 1; for (let k = 0; k < 46; k++) { x.globalAlpha = 0.25 + R() * 0.5; x.beginPath(); for (let i = 0; i <= 60; i++) { const px = i / 60 * W, py = 20 + k * 6 + Math.sin(i * 0.2 + k * 0.4) * 18 * Math.sin(k * 0.13 + i * 0.05); i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); } x.globalAlpha = 1; }
    else if (kind === 'bloom') { x.fillStyle = '#f7e3ea'; x.fillRect(0, 0, W, H); for (let i = 0; i < 12; i++) { x.save(); x.translate(280, 147); x.rotate(i / 12 * 6.283); x.fillStyle = i % 2 ? '#ff9bb5' : '#ff6f91'; x.globalAlpha = 0.75; x.beginPath(); x.ellipse(0, -60, 26, 62, 0, 0, 7); x.fill(); x.restore(); } x.fillStyle = '#ffd25c'; x.beginPath(); x.arc(280, 147, 22, 0, 7); x.fill(); }
    else if (kind === 'grid' || kind === 'grid2') { x.fillStyle = kind === 'grid' ? AC : '#20302a'; x.fillRect(0, 0, W, H); x.strokeStyle = kind === 'grid' ? '#ffffff70' : '#c6f36d80'; for (let i = 0; i < 20; i++) { x.beginPath(); x.moveTo(i * 30, 0); x.lineTo(i * 30, H); x.stroke(); x.beginPath(); x.moveTo(0, i * 16); x.lineTo(W, i * 16); x.stroke(); } x.fillStyle = kind === 'grid' ? '#fff' : '#c6f36d'; x.font = `400 64px ${GR}`; x.fillText(kind === 'grid' ? 'Go loud.' : 'Northfold', 40, 180); }
    else if (kind === 'bottle') { x.fillStyle = lg('#dfe9e3', '#b8cfc4'); x.fillRect(0, 0, W, H); [[200, '#7fb69a'], [280, '#e9a67c'], [360, '#9aa7d8']].forEach(([cx, col]) => { x.fillStyle = col; x.beginPath(); x.roundRect(cx - 28, 110, 56, 150, 14); x.fill(); x.fillRect(cx - 10, 80, 20, 34); x.fillStyle = '#fff8'; x.fillRect(cx - 18, 160, 36, 40); }); }
    else if (kind === 'type') { x.fillStyle = '#f2efe6'; x.fillRect(0, 0, W, H); x.fillStyle = '#1d1d1d'; x.font = `italic 400 170px ${SR}`; x.fillText('Aa', 70, 210); x.font = `400 170px ${GR}`; x.fillStyle = AC; x.fillText('g', 360, 210); }
    else if (kind === 'hills') { x.fillStyle = lg('#f6d9e1', '#bfc7ef'); x.fillRect(0, 0, W, H); ['#b69bd0', '#a689c4', '#93a0d8'].forEach((col, i) => { x.fillStyle = col; x.beginPath(); x.ellipse(120 + i * 170, 260, 180, 70 + i * 10, 0, 0, 7); x.fill(); }); x.fillStyle = '#e9c1b9'; x.fillRect(240, 120, 80, 140); x.fillStyle = '#bfc7ef'; x.beginPath(); x.moveTo(262, 260); x.lineTo(262, 170); x.arc(280, 170, 18, Math.PI, 0); x.lineTo(298, 260); x.fill(); } };
  const cards = PJ.map(([t, sub, cat, kind], i) => { const c = h('canvas'); paint(c, kind, i); return h('div.un-card', { 'data-cat': cat, onclick: () => toast(`${t} — case study (demo)`) }, c, h('div.m', {}, h('div', {}, h('b', {}, t), h('span', {}, sub)), h('span', {}, '↘'))); });
  const chipEls = CATS.map((c) => h('button', { onclick: () => setFilter(c) }, c, h('sup', {}, c === 'All' ? PJ.length : PJ.filter((p) => p[2] === c).length)));
  const grid = h('div.un-grid', {}, cards);
  const pj = h('div.un-pj', {}, h('h2', {}, 'Selected Projects'), h('div.un-chips', {}, chipEls), grid);
  const setFilter = (c) => { filt = c; chipEls.forEach((b, i) => b.classList.toggle('on', CATS[i] === c)); const first = new Map(cards.map((k) => [k, k.getBoundingClientRect()]));
    cards.forEach((k) => { const show = c === 'All' || k.dataset.cat === c; k.classList.toggle('gone', !show); k.classList.toggle('out', !show); });
    if (RM) return; cards.forEach((k) => { if (k.classList.contains('gone')) return; const a = first.get(k), b = k.getBoundingClientRect(); if (!a.width) { k.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.6,0,.2,1)' }); return; } k.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)` }, { transform: 'none' }], { duration: 550, easing: 'cubic-bezier(.6,0,.2,1)' }); }); };
  setFilter('All');
  // gate: spaced-letter loader, eyes, enter with / without audio
  const LET = 'UNSEEN'.split(''); const ltr = h('div.un-ltr', {}, LET.map((c) => h('b', {}, c)));
  const eyes = h('div.un-eyes', { html: `<svg viewBox="0 0 126 96"><g stroke="#1d1d1d" stroke-width="3" fill="#fff"><ellipse cx="40" cy="48" rx="30" ry="38"/><ellipse cx="88" cy="50" rx="31" ry="40"/></g><g class="pu" fill="#111"><ellipse cx="34" cy="50" rx="14" ry="19"/><ellipse cx="82" cy="52" rx="14" ry="19"/></g><g class="ht" fill="${AC}" opacity="0"><path d="M40 62c-14-9-17-16-14-21 3-4 9-4 14 2 5-6 11-6 14-2 3 5 0 12-14 21z"/><path d="M88 66c-15-10-18-17-15-22 3-5 10-5 15 2 5-7 12-7 15-2 3 5 0 12-15 22z"/></g><g class="lid" fill="#efded9" stroke="#1d1d1d" stroke-width="3" opacity="0"><path d="M10 48a30 38 0 0 1 60 0z"/><path d="M57 50a31 40 0 0 1 62 0z"/></g></svg>` });
  const ent = h('button.un-ent', { onclick: () => enter(true), onpointerenter: () => heart(true), onpointerleave: () => heart(false) }, 'Enter ↘');
  const noa = h('button.un-noa', { onclick: () => enter(false) }, 'Enter without audio');
  const gate = h('div.un-gate', {}, ltr, h('div.un-row', {}, 'U N S E E N'), eyes, h('h2', {}, 'UNSEEN STUDIO', h('sup', {}, '®')), h('p', {}, 'A brand, digital and motion studio creating refreshingly unexpected ideas and striking visuals that help bold brands cut through the noise.'), ent, noa);
  el.append(hero, wh, pj, menu, hd, ft, glb, ex, flash, gate, vig, grain, cur);
  const heart = (on) => { eyes.querySelector('.ht').setAttribute('opacity', on ? 1 : 0); eyes.querySelector('.pu').setAttribute('opacity', on ? 0 : 1); };
  let ldT = [], ready = false;
  const runLoader = () => { ldT.forEach(clearTimeout); ldT = []; ready = false; gate.classList.remove('ready', 'off'); eyes.classList.remove('on'); const bs = [...ltr.children]; bs.forEach((b) => b.classList.remove('on')); const row = gate.querySelector('.un-row'); row.style.opacity = 0;
    const step = RM ? 0 : 330; LET.forEach((c, i) => ldT.push(setTimeout(() => { bs.forEach((b, j) => b.classList.toggle('on', j === i)); row.style.opacity = 0.25 + i * 0.12; row.textContent = LET.slice(0, i + 1).join(' '); }, i * step)));
    ldT.push(setTimeout(() => { bs.forEach((b) => b.classList.remove('on')); row.style.opacity = 0; eyes.classList.add('on'); gate.classList.add('ready'); ready = true; }, LET.length * step + (RM ? 0 : 200))); };
  // eyes follow the pointer + blink
  let blinkT = setInterval(() => { if (RM) return; const l = eyes.querySelector('.lid'); l.setAttribute('opacity', 1); setTimeout(() => l.setAttribute('opacity', 0), 140); }, 3200);
  // ---------- audio (Web Audio stand-in: soft pad + water noise) ----------
  let ac = null, mg = null, soundOn = false;
  const startAudio = () => { ac = audio(); if (!ac) return; if (mg) return; mg = ac.createGain(); mg.gain.value = 0; mg.connect(ac.destination); const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(mg);
    [110, 164.8, 220.5, 277.2, 329.6].forEach((f, i) => { const o = ac.createOscillator(); o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.value = f; o.detune.value = (i - 2) * 4; const g = ac.createGain(); g.gain.value = 0.05; o.connect(g).connect(lp); o.start(); const l = ac.createOscillator(), lg2 = ac.createGain(); l.frequency.value = 0.07 + i * 0.03; lg2.gain.value = 0.03; l.connect(lg2).connect(g.gain); l.start(); });
    const nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = nb.getChannelData(0); let b = 0; for (let i = 0; i < d.length; i++) { b = (b + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = b * 3; } const ns = ac.createBufferSource(); ns.buffer = nb; ns.loop = true; const nf = ac.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 500; const ng = ac.createGain(); ng.gain.value = 0.35; ns.connect(nf).connect(ng).connect(mg); ns.start(); };
  const setSound = (on) => { soundOn = on; el.classList.toggle('snd', on); if (on) startAudio(); if (mg) mg.gain.setTargetAtTime(on ? 0.5 : 0, ac.currentTime, 0.4); };
  // ---------- flows ----------
  const enter = (withAudio) => { if (!ready) return; mode = 'home'; gate.classList.add('off'); setSound(withAudio); heart(false); };
  const enterWorld = () => { if (mode === 'world') return; el.classList.remove('proj', 'menu'); flash.style.opacity = 0.85; setTimeout(() => (flash.style.opacity = 0), 380); const from = { p: cam.position.clone(), t: HOME.t.clone() }; wT.set(0, 0); wV.set(0, 0); mode = 'world'; el.classList.add('world'); trans = { from, to: worldPose, t0: performance.now(), d: RM ? 1 : 1700 }; if (soundOn) blip(660, 0.4, 'sine', 0.05); };
  const goHome = () => { el.classList.remove('proj', 'menu'); if (mode === 'world') { const from = { p: cam.position.clone(), t: worldPose().t }; trans = { from, to: () => HOME, t0: performance.now(), d: RM ? 1 : 1500 }; } mode = mode === 'gate' ? 'gate' : 'home'; el.classList.remove('world'); };
  const openProj = () => { el.classList.remove('menu'); el.classList.add('proj'); };
  const toggleMenu = (v) => { el.classList.toggle('menu', v ?? !el.classList.contains('menu')); };
  // pointer: custom cursor, hold-to-enter, drag world with inertia
  let dragging = false, last = null;
  const isUI = (t) => !!t.closest('button,a,nav,.un-menu li,.un-card,.un-chips,.un-gate .un-ent,input');
  el.addEventListener('pointermove', (ev) => { const p = localPos(ev, el); cur.style.transform = `translate(${p.x}px,${p.y}px)`; mx = (p.x / p.w - 0.5) * 2; my = (p.y / p.h - 0.5) * 2;
    const overScene = !el.classList.contains('proj') && !el.classList.contains('menu') && mode !== 'gate' && !isUI(ev.target); cur.classList.toggle('lab', overScene); cur.classList.toggle('ui', isUI(ev.target)); cur.querySelector('.t').textContent = mode === 'world' ? 'Drag' : 'Click & Hold';
    if (mode === 'gate') { const r = eyes.getBoundingClientRect(); const dx = clamp((ev.clientX - r.left - r.width / 2) / 260, -1, 1), dy = clamp((ev.clientY - r.top - r.height / 2) / 200, -1, 1); eyes.querySelector('.pu').setAttribute('transform', `translate(${6 + dx * 8} ${dy * 9})`); }
    if (dragging && last) { const dx = ev.clientX - last[0], dy = ev.clientY - last[1]; last = [ev.clientX, ev.clientY]; const k = 0.06; wV.set(-dx * k, -dy * k); wT.add(wV); } });
  glw.parentNode.addEventListener('pointerdown', (ev) => { if (isUI(ev.target) || mode === 'gate' || el.classList.contains('proj') || el.classList.contains('menu')) { if (ev.target.closest('.un-glb') && mode === 'home') holding = true; return; } if (mode === 'home') holding = true; else if (mode === 'world') { dragging = true; last = [ev.clientX, ev.clientY]; wV.set(0, 0); } });
  addEventListener('pointerup', () => { holding = false; dragging = false; last = null; });
  glb.addEventListener('click', () => { if (mode === 'world') goHome(); });
  // ---------- boot ----------
  runLoader();
  // ---------- demo proof ----------
  const reset = () => { holding = false; hold = 0; cur.classList.remove('lab', 'ui'); cur.style.transform = 'translate(-200px,-200px)'; dragging = false; trans = null; wT.set(0, 0); wV.set(0, 0); el.classList.remove('world', 'proj', 'menu'); setFilter('All'); setSound(false); mode = 'gate'; heart(false); runLoader(); };
  window.__demoProof = async () => { const o = []; reset(); const seen = []; for (let i = 0; i < 40 && !ready; i++) { const on = ltr.querySelector('b.on'); const ix = on ? [...ltr.children].indexOf(on) : -1; if (on && seen[seen.length - 1]?.[0] !== ix) seen.push([ix, on.textContent]); await sleep(60); }
    o.push(`loader letters ${seen.map((x) => x[1]).join(' ')} → eyes=${eyes.classList.contains('on')}, Enter ready=${gate.classList.contains('ready')}`);
    ent.dispatchEvent(new PointerEvent('pointerenter')); o.push(`hover Enter → heart eyes=${eyes.querySelector('.ht').getAttribute('opacity') === '1'}`); ent.dispatchEvent(new PointerEvent('pointerleave'));
    noa.click(); await sleep(250); o.push(`Enter without audio → mode=${mode}, gate hidden=${gate.classList.contains('off')}, sound=${soundOn}`);
    const f0 = frames; await sleep(400); o.push(`WebGL scene rendering (frames +${frames - f0})`);
    fire(el, 'pointermove', 700, 500); o.push(`cursor label "${cur.querySelector('.t').textContent}" visible=${cur.classList.contains('lab')}`);
    glw.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 700, clientY: 500 })); await sleep(650); const mid = hold; await sleep(RM ? 300 : 1000);
    o.push(`click & hold → ring charged ${(mid * 100).toFixed(0)}% → transition fired, mode=${mode}`); dispatchEvent(new PointerEvent('pointerup')); await sleep(1900);
    const t0 = wT.clone(); glw.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 800, clientY: 400 })); for (let i = 1; i <= 8; i++) { fire(el, 'pointermove', 800 - i * 30, 400 - i * 10); await sleep(16); } dispatchEvent(new PointerEvent('pointerup')); const t1 = wT.clone(); await sleep(400);
    o.push(`drag world → pan (${t0.x.toFixed(1)},${t0.y.toFixed(1)})→(${t1.x.toFixed(1)},${t1.y.toFixed(1)}), inertia carried to (${wT.x.toFixed(1)},${wT.y.toFixed(1)})`);
    hd.querySelector('.un-mb').click(); await sleep(100); o.push(`menu open=${el.classList.contains('menu')} items=[${[...menu.querySelectorAll('li')].map((l) => l.textContent).join(' ')}]`);
    menu.querySelectorAll('li')[1].click(); await sleep(100); o.push(`02 Projects → overlay=${el.classList.contains('proj')}`);
    chipEls[1].click(); await sleep(80); o.push(`filter Branding → ${cards.filter((c) => !c.classList.contains('gone')).length}/${cards.length} cards`); chipEls[4].click(); o.push(`filter Experiment → ${cards.filter((c) => !c.classList.contains('gone')).length}`);
    snd.click(); o.push(`sound toggle → ${soundOn} (audio ${ac ? ac.state : 'n/a'})`);
    reset(); await sleep(RM ? 60 : 2400); document.querySelector('.tg-toast')?.classList.remove('on'); o.push(`restored: gate with eyes + Enter, filter All, sound off, world reset`); return o.join('; '); };
};

V['minitokyo3d-realtime-3d-transit-map-underground-mode-playback-clock-tracking-camera-modes'] = (root, T) => {
  theme(root, T, { bg: '#26262c', fg: '#fff', ac: '#33b5e5', dark: true });
  const SANS = "'Inter Variable','Helvetica Neue',Arial,sans-serif", BLUE = '#33b5e5';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  css(`.mt{position:absolute;inset:0;background:#26262c;font-family:${SANS};overflow:hidden;user-select:none}
.mt *{box-sizing:border-box}
.mt-lbl{position:absolute;left:0;top:0;pointer-events:none;z-index:2}
.mt-lbl b{position:absolute;transform:translate(-50%,-140%);font:700 10.5px ${SANS};color:#fff;white-space:nowrap;text-shadow:0 0 2px #000,0 0 3px #000,0 0 4px #000;transition:opacity .4s}
.mt-lbl i{position:absolute;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 1px 4px #0006;transition:opacity .4s}
.mt-clk{position:absolute;left:8px;top:8px;z-index:5;background:#000000b8;color:#fff;border-radius:6px;padding:6px 8px 7px;min-width:110px;backdrop-filter:blur(2px)}
.mt-clk .d{font:400 11px ${SANS};opacity:.95}.mt-clk .t{font:400 18px/1.25 ${SANS};letter-spacing:.01em;font-variant-numeric:tabular-nums}
.mt-clk .pb{display:none;margin-top:6px;gap:6px;flex-direction:column}.mt.play .mt-clk .pb{display:flex}
.mt-clk .pb button{background:#ffffff14;border:1px solid #ffffff38;color:#fff;border-radius:4px;font:400 11px ${SANS};height:26px;cursor:pointer;padding:0 8px}
.mt-clk .pb .sp{display:flex;align-items:center;border:1px solid #ffffff38;border-radius:4px;height:28px}
.mt-clk .pb .sp button{border:0;background:none;width:28px;height:26px;font-size:16px;padding:0}.mt-clk .pb .sp span{flex:1;text-align:center;font:400 11px ${SANS};border-left:1px solid #ffffff38;border-right:1px solid #ffffff38;line-height:26px}
.mt-clk .ed{display:none;gap:4px}.mt-clk .ed.on{display:flex}.mt-clk .ed input{width:100%;font:11px ${SANS};background:#111;color:#fff;border:1px solid #ffffff40;border-radius:3px;padding:3px}
.mt-al{position:absolute;left:8px;top:58px;z-index:5;width:40px;height:44px;background:#000000b8;border-radius:6px;display:grid;place-items:center;color:#fff;font:400 7.5px ${SANS};cursor:pointer;padding-top:3px;transition:top .25s}
.mt.play .mt-al{top:130px}
.mt-al svg{display:block;margin:0 auto}.mt-al em{position:absolute;right:-4px;top:-5px;background:#e33;color:#fff;font:700 9px ${SANS};border-radius:9px;min-width:15px;height:15px;display:grid;place-items:center;font-style:normal}
.mt-rail{position:absolute;right:8px;top:8px;z-index:5;display:flex;flex-direction:column;gap:8px}
.mt-grp{background:#fff;border-radius:6px;box-shadow:0 0 0 2px #0000001a;display:flex;flex-direction:column;overflow:hidden}
.mt-grp button{width:29px;height:29px;border:0;background:#fff;display:grid;place-items:center;cursor:pointer;padding:0;color:#333}
.mt-grp button+button{border-top:1px solid #ddd}.mt-grp button:hover{background:#f2f2f2}.mt-grp button.on{color:${BLUE}}
.mt-grp svg{width:18px;height:18px;fill:currentColor}
.mt-pop{position:absolute;z-index:6;background:#000000d0;color:#fff;border-radius:6px;padding:10px 12px;font:400 12px ${SANS};display:none;backdrop-filter:blur(3px)}
.mt-pop.on{display:block}
.mt-trk{left:50%;top:50%;width:270px;transform:translate(-50%,-44%);padding:8px 8px 6px}
.mt-trk h5{margin:0 0 6px;font:700 12.5px ${SANS};display:flex;align-items:center;padding:6px 0 4px}.mt-trk h5 span{flex:1}.mt-trk h5 button{background:none;border:0;color:#fff;font-size:18px;cursor:pointer;line-height:1}
.mt-trk .r{display:flex;align-items:center;gap:8px;padding:3px 0;cursor:pointer;font:400 12px ${SANS}}
.mt-trk .r i{width:36px;height:36px;border:1px solid #ffffff60;border-radius:4px;display:grid;place-items:center;background:#000}
.mt-trk .r.on i{border:2px solid ${BLUE};box-shadow:0 0 6px ${BLUE}88}.mt-trk .r i svg{width:24px;height:24px;fill:#fff}
.mt-srch{right:46px;top:8px;width:240px}.mt-srch input{width:100%;font:13px ${SANS};padding:6px 8px;border-radius:4px;border:0;margin-bottom:6px}
.mt-srch div{padding:4px 2px;cursor:pointer;border-radius:3px}.mt-srch div:hover{background:#ffffff1c}
.mt-lay{right:46px;top:250px;width:190px}.mt-lay label{display:flex;gap:8px;align-items:center;padding:3px 0;cursor:pointer}
.mt-abt{left:50%;top:50%;transform:translate(-50%,-50%);width:340px;line-height:1.5}
.mt-info{position:absolute;left:8px;bottom:30px;z-index:5;background:#000000c8;color:#fff;border-radius:6px;padding:8px 10px;font:400 11.5px/1.45 ${SANS};min-width:220px;display:none}
.mt-info.on{display:block}.mt-info .ln{display:flex;align-items:center;gap:6px;font-weight:700;font-size:12.5px}.mt-info .ln i{width:12px;height:12px;border-radius:3px}
.mt-attr{position:absolute;right:4px;bottom:2px;z-index:5;font:400 10px ${SANS};color:#ccc;background:#0007;padding:1px 6px;border-radius:3px}
.mt-wm{position:absolute;left:8px;bottom:6px;z-index:5;font:700 13px ${SANS};color:#fff;opacity:.85;letter-spacing:-.01em;text-shadow:0 1px 3px #000}
.mt-wm span{font-weight:400;opacity:.8}
.mt-ug{position:absolute;left:50%;top:10px;transform:translateX(-50%);z-index:5;background:#000000b8;color:#fff;font:400 11px ${SANS};border-radius:12px;padding:4px 12px;opacity:0;transition:opacity .4s;pointer-events:none}.mt.ug .mt-ug{opacity:1}
`);
  const el = h('div.mt'); root.append(el);
  const S = stage(el, { bg: '#26262c' }); S.scene.fog = new THREE.Fog(0x26262c, 16, 42);
  S.cam.fov = 38; S.cam.near = 0.05; S.cam.far = 200; S.cam.updateProjectionMatrix();
  // ---------- ground (code-drawn dark map texture) ----------
  const GW = 44, TX = 2048; const cv = document.createElement('canvas'); cv.width = cv.height = TX; const g = cv.getContext('2d');
  const toT = (x, z) => [(x / GW + 0.5) * TX, (z / GW + 0.5) * TX]; const R = rng(9);
  g.fillStyle = '#34343c'; g.fillRect(0, 0, TX, TX);
  for (let k = 0; k < 2600; k++) { g.fillStyle = `rgba(${R() < 0.5 ? '60,60,70' : '44,44,52'},.55)`; const [x, y] = [R() * TX, R() * TX]; g.fillRect(x, y, 6 + R() * 26, 6 + R() * 26); }
  g.strokeStyle = '#3e3e48'; g.lineWidth = 1.2; for (let k = 0; k < 900; k++) { const [x, y] = [R() * TX, R() * TX], a = (R() < 0.5 ? 0 : Math.PI / 2) + (R() - 0.5) * 0.5, l = 30 + R() * 120; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
  g.strokeStyle = '#4a4a55'; g.lineWidth = 3; for (let k = 0; k < 60; k++) { g.beginPath(); let [x, y] = [R() * TX, R() * TX]; g.moveTo(x, y); for (let s2 = 0; s2 < 6; s2++) { x += (R() - 0.5) * 340; y += (R() - 0.5) * 340; g.lineTo(x, y); } g.stroke(); }
  const blob = (pts, fill) => { g.fillStyle = fill; g.beginPath(); pts.forEach(([x, z], i) => { const [a, b] = toT(x, z); i ? g.lineTo(a, b) : g.moveTo(a, b); }); g.closePath(); g.fill(); };
  blob([[-2.2, -1.4], [-0.9, -1.5], [-0.6, -0.4], [-0.8, 0.5], [-2.0, 0.6], [-2.4, -0.4]], '#2c372f'); // Imperial Palace
  blob([[-7.6, 0.2], [-6.9, 0.0], [-6.8, 1.3], [-7.7, 1.4]], '#2c372f'); blob([[-1.0, -4.6], [-0.2, -4.7], [-0.1, -3.9], [-0.9, -3.8]], '#2c372f'); blob([[-5.6, -0.6], [-4.9, -0.7], [-4.8, 0.0], [-5.6, 0.1]], '#2c372f'); blob([[-3.0, 1.4], [-2.4, 1.2], [-2.3, 2.0], [-3.0, 2.1]], '#2c372f');
  blob([[3.4, 22], [3.2, 6], [5.5, 3.6], [9, 2.8], [22, 3.2], [22, 22]], '#1f2636'); // bay
  g.strokeStyle = '#222a3a'; g.lineCap = 'round'; const river = (pts, w) => { g.lineWidth = w; g.beginPath(); pts.forEach(([x, z], i) => { const [a, b] = toT(x, z); i ? g.lineTo(a, b) : g.moveTo(a, b); }); g.stroke(); };
  river([[2.6, -14], [2.4, -7], [1.9, -4.5], [2.2, -2.5], [1.6, -0.5], [1.9, 1.5], [2.4, 3.2], [3.4, 5]], 34); river([[4.6, -14], [4.9, -6], [5.6, -2], [7, 1], [8, 3]], 26); river([[-0.6, -1.9], [1.8, -2.1]], 10); river([[-11, -1.9], [-6, -1.6], [-3, -1.9], [-0.6, -1.9]], 8); river([[-2, 4.5], [0.2, 3.4], [1.8, 2.6]], 10);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const groundMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true }); const ground = new THREE.Mesh(new THREE.PlaneGeometry(GW, GW), groundMat); ground.rotation.x = -Math.PI / 2; S.scene.add(ground);
  S.scene.add(new THREE.HemisphereLight(0xdfe4ff, 0x2a2a30, 1.1)); const dl = new THREE.DirectionalLight(0xffffff, 1.4); dl.position.set(-6, 12, 8); S.scene.add(dl);
  // ---------- buildings (instanced) ----------
  const CEN = [[-0.2, 0.1, 1, 0.9], [-6.6, -1.1, 0.85, 1.0], [-6.4, 2.0, 0.6, 0.7], [-6.1, -5.0, 0.55, 0.7], [-2.4, 5.5, 0.5, 0.7], [-3.6, 2.6, 0.55, 0.8], [-1.6, 1.6, 0.55, 0.8], [0.4, -2.4, 0.35, 0.6], [1.4, 2.8, 0.4, 0.7]];
  const bGeo = new THREE.BoxGeometry(1, 1, 1); bGeo.translate(0, 0.5, 0);
  const bMat = new THREE.MeshStandardMaterial({ color: 0xa4a6b0, roughness: 0.8, metalness: 0.1, transparent: true });
  const NB = 1100, bld = new THREE.InstancedMesh(bGeo, bMat, NB), M4 = new THREE.Matrix4(), q = new THREE.Quaternion(), BR = rng(4); let nb = 0;
  for (let k = 0; k < 6000 && nb < NB; k++) { const c = CEN[Math.floor(BR() * CEN.length)]; const r = Math.abs((BR() + BR() + BR() - 1.5) / 1.5) * 2.4 * c[3], a = BR() * 6.283; const x = c[0] + Math.cos(a) * r, z = c[1] + Math.sin(a) * r; const ht = (0.05 + BR() ** 3 * 0.9 * c[2]) * Math.max(0.15, 1 - r / 2.6); const w = 0.05 + BR() * 0.12; q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (BR() - 0.5) * 0.4); M4.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(w, ht, w * (0.6 + BR() * 0.8))); bld.setMatrixAt(nb, M4); bld.setColorAt(nb, new THREE.Color().setHSL(0.63, 0.05, 0.5 + BR() * 0.35)); nb++; }
  bld.count = nb; S.scene.add(bld);
  // ---------- stations + lines (stylised Tokyo, km-ish units; x east, z south) ----------
  const ST = { Tokyo: [0, 0], Kanda: [0, -1.3], Akihabara: [0.1, -2.2], Okachimachi: [0.05, -3.1], Ueno: [-0.2, -3.8], Nippori: [-0.8, -5.2], Tabata: [-1.8, -6.2], Komagome: [-3, -6.3], Sugamo: [-4, -5.9], Otsuka: [-5, -5.5], Ikebukuro: [-6.2, -5], Mejiro: [-6.6, -4], Takadanobaba: [-6.7, -3], 'Shin-Okubo': [-6.6, -2.2], Shinjuku: [-6.5, -1.2], Yoyogi: [-6.4, -0.5], Harajuku: [-6.6, 0.6], Shibuya: [-6.5, 2], Ebisu: [-5.8, 3.2], Meguro: [-5.6, 4.6], Gotanda: [-4.8, 5.4], Osaki: [-3.8, 5.8], Shinagawa: [-2.4, 5.6], Tamachi: [-1.6, 4.2], Hamamatsucho: [-1, 2.8], Shimbashi: [-0.6, 1.6], Yurakucho: [-0.3, 0.7], Ochanomizu: [-1, -1.6], Iidabashi: [-3, -2], Yotsuya: [-4, -0.8], Nakano: [-10, -2], Omotesando: [-5.4, 1.2], 'Akasaka-mitsuke': [-3.6, 0.2], Toranomon: [-1.8, 1.4], Ginza: [-0.1, 1.0], Nihombashi: [0.5, -0.3], Asakusa: [1.8, -4.0], Korakuen: [-2.5, -3.2], Otemachi: [-0.3, -0.5], Kasumigaseki: [-1.2, 0.8], Roppongi: [-3.6, 2.6], Hibiya: [-0.6, 0.4], Tsukiji: [0.6, 1.6], Kayabacho: [1.2, -0.4], 'Minami-senju': [0.6, -6], 'Monzen-nakacho': [2.6, 0.6], Toyocho: [4, 1], Daimon: [-1.4, 2.8], Kachidoki: [1, 2.8], Tsukishima: [1.6, 2.2], Ryogoku: [2, -1.8], Kudanshita: [-1.8, -1.4], 'Kiyosumi-shirakawa': [2.4, 0], Oshiage: [3.2, -3], 'Kita-senju': [1, -7.6], Mita: [-2, 3.6], Asakusabashi: [1.2, -2], 'Azabu-juban': [-3, 3.2], Nagatacho: [-2.8, 0.2], 'Naka-meguro': [-6.4, 4.2], 'Ichigaya': [-3.6, -1.5], Shiodome: [-0.4, 2.1], Toyosu: [2.8, 3.6], 'Takanawa Gateway': [-2.1, 4.9] };
  const P = (n) => (Array.isArray(n) ? n : ST[n]);
  const LINES = [
    ['JR Yamanote Line', '#80c241', 0, ['Tokyo', 'Kanda', 'Akihabara', 'Okachimachi', 'Ueno', 'Nippori', 'Tabata', 'Komagome', 'Sugamo', 'Otsuka', 'Ikebukuro', 'Mejiro', 'Takadanobaba', 'Shin-Okubo', 'Shinjuku', 'Yoyogi', 'Harajuku', 'Shibuya', 'Ebisu', 'Meguro', 'Gotanda', 'Osaki', 'Shinagawa', 'Takanawa Gateway', 'Tamachi', 'Hamamatsucho', 'Shimbashi', 'Yurakucho'], true, 5],
    ['JR Chuo Line Rapid', '#f15a22', 0, ['Tokyo', 'Kanda', 'Ochanomizu', 'Ichigaya', 'Yotsuya', 'Shinjuku', 'Nakano', [-16, -2.4]], false, 3],
    ['JR Keihin-Tohoku Line', '#00b2e5', 0, [[1.2, -14], [0.6, -8], 'Tabata', [-0.6, -5.3], [0, -3.8], [0.25, -2.2], [0.15, -1.3], [0.12, 0], [-0.4, 1.6], [-0.85, 2.8], [-1.45, 4.2], [-2.3, 5.7], [-5, 10], [-6, 16]], false, 3],
    ['JR Sobu Line', '#ffd400', 0, [[-16, -2.6], 'Nakano', 'Shinjuku', 'Yotsuya', 'Ichigaya', 'Iidabashi', 'Ochanomizu', 'Akihabara', 'Asakusabashi', 'Ryogoku', [6, -1.5], [14, -1.2]], false, 3],
    ['Ginza Line', '#f39700', 1, ['Shibuya', 'Omotesando', 'Akasaka-mitsuke', 'Toranomon', 'Shimbashi', 'Ginza', 'Nihombashi', 'Kanda', 'Ueno', 'Asakusa'], false, 2],
    ['Marunouchi Line', '#e60012', 1, ['Ikebukuro', 'Korakuen', 'Ochanomizu', 'Otemachi', 'Tokyo', 'Ginza', 'Kasumigaseki', 'Akasaka-mitsuke', 'Yotsuya', 'Shinjuku', [-11, -1.6]], false, 2],
    ['Hibiya Line', '#9caeb7', 1, ['Naka-meguro', 'Ebisu', 'Roppongi', 'Kasumigaseki', 'Hibiya', 'Ginza', 'Tsukiji', 'Kayabacho', 'Akihabara', 'Ueno', 'Minami-senju', 'Kita-senju'], false, 2],
    ['Tozai Line', '#009bbf', 1, ['Nakano', 'Takadanobaba', 'Iidabashi', 'Kudanshita', 'Otemachi', 'Nihombashi', 'Kayabacho', 'Monzen-nakacho', 'Toyocho', [9, 1.6], [16, 2.4]], false, 2],
    ['Oedo Line', '#b6007a', 1, ['Shinjuku', 'Yoyogi', 'Roppongi', 'Azabu-juban', 'Daimon', 'Shiodome', 'Tsukiji', 'Kachidoki', 'Tsukishima', 'Monzen-nakacho', 'Kiyosumi-shirakawa', 'Ryogoku', 'Asakusabashi', 'Okachimachi', 'Korakuen', 'Iidabashi', 'Ichigaya', [-5.2, -1.6], 'Shinjuku'], false, 2],
    ['Hanzomon Line', '#8f76d6', 1, ['Shibuya', 'Omotesando', 'Nagatacho', 'Kudanshita', 'Otemachi', [0.6, -0.6], 'Kiyosumi-shirakawa', [2.9, -1.6], 'Oshiage'], false, 2],
    ['Chiyoda Line', '#00bb85', 1, [[-8.2, 1.2], 'Omotesando', 'Akasaka-mitsuke', 'Kasumigaseki', 'Hibiya', 'Otemachi', [-0.6, -2.2], [-0.8, -4.4], 'Nippori', 'Kita-senju'], false, 2],
    ['Asakusa Line', '#e85298', 1, ['Gotanda', 'Mita', 'Daimon', 'Shimbashi', [0.3, 0.9], 'Nihombashi', 'Asakusabashi', 'Asakusa', 'Oshiage'], false, 2],
    ['Namboku Line', '#00ac9b', 1, ['Meguro', 'Azabu-juban', [-2.4, 1.6], 'Nagatacho', 'Yotsuya', 'Ichigaya', 'Iidabashi', 'Korakuen', 'Komagome', [-2.8, -9]], false, 2],
    ['Fukutoshin Line', '#9c5e31', 1, ['Shibuya', [-6.1, 0.6], [-6.0, -1.2], [-6.2, -3.2], 'Ikebukuro'], false, 2],
    ['Yurikamome', '#1a5ba6', 0, ['Shimbashi', 'Shiodome', [0.2, 3.6], [1.2, 4.6], 'Toyosu'], false, 1],
  ];
  const lineObjs = [], trains = [], labels = [], LBL = h('div.mt-lbl'); el.append(LBL);
  const Y0 = 0.035;
  LINES.forEach(([name, col, sub, stops, loop, nTr], li) => {
    const pts = stops.map((n) => { const [x, z] = P(n); return new THREE.Vector3(x, 0, z); });
    const curve = new THREE.CatmullRomCurve3(pts, loop, 'centripetal', 0.3);
    const tubeGeo = new THREE.TubeGeometry(curve, Math.max(80, pts.length * 26), sub ? 0.034 : 0.05, 6, loop);
    const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: sub ? 0.42 : 1, fog: true });
    const mesh = new THREE.Mesh(tubeGeo, mat); mesh.position.y = sub ? Y0 : 0.07; mesh.scale.y = 0.35; S.scene.add(mesh);
    const lo = { name, col, sub, curve, mesh, mat, len: curve.getLength(), loop }; lineObjs.push(lo);
    for (let k = 0; k < nTr; k++) {
      const grp = new THREE.Group(); const cars = []; const nc = sub ? 3 : 4;
      for (let c = 0; c < nc; c++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.085, 0.24), new THREE.MeshStandardMaterial({ color: col, emissive: new THREE.Color(col).multiplyScalar(0.35), roughness: 0.4, transparent: true })); m.userData.train = trains.length; cars.push(m); grp.add(m); }
      S.scene.add(grp);
      trains.push({ lo, grp, cars, u: (k + 0.5 * (li % 2)) / nTr, dir: k % 2 && !loop ? -1 : 1, speed: (sub ? 0.32 : 0.42) / lo.len, id: `${name.split(' ').slice(-2, -1)[0] || 'T'}${1000 + li * 37 + k * 11}`, mats: cars.map((m) => m.material) });
    }
  });
  // station nodes + labels
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }); const nodeGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.035, 22); const nodes = [];
  Object.entries(ST).forEach(([n, [x, z]]) => { const m = new THREE.Mesh(nodeGeo, nodeMat); m.position.set(x, 0.09, z); m.scale.set(1, 1, 0.62); S.scene.add(m); nodes.push(m); const b = h('b', {}, n); LBL.append(b); labels.push({ el: b, v: new THREE.Vector3(x, 0.12, z), kind: 'st', name: n }); });
  const CAMS = [[-0.2, -2.6], [0.3, -1.6], [-0.1, 0.4], [-0.9, 1.9], [-3.2, -4.9], [3.6, -1.2], [-5.6, -6.2], [-0.4, 3.7], [1.2, -3.2]];
  const CAMSVG = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 6h12a2 2 0 0 1 2 2v2.5l4-3v9l-4-3V16a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="#111"/></svg>';
  CAMS.forEach(([x, z]) => { const i = h('i', { html: CAMSVG }); LBL.append(i); labels.push({ el: i, v: new THREE.Vector3(x, 0.4, z), kind: 'cam' }); });
  // ---------- camera / controls ----------
  const ctl = new OrbitControls(S.cam, S.r.domElement); ctl.enableDamping = true; ctl.dampingFactor = 0.08; ctl.screenSpacePanning = false; ctl.maxPolarAngle = 1.32; ctl.minDistance = 1.2; ctl.maxDistance = 30;
  ctl.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
  const HOME = { tgt: new THREE.Vector3(-0.5, 0, 0.2), pos: new THREE.Vector3(1.2, 4.4, 7.0) };
  const home = () => { ctl.target.copy(HOME.tgt); S.cam.position.copy(HOME.pos); ctl.update(); };
  home();
  // ---------- UI ----------
  const IC = {
    search: '<path d="M10 3a7 7 0 0 1 5.6 11.2l5.1 5.1-1.4 1.4-5.1-5.1A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>', plus: '<path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/>', minus: '<path d="M5 11h14v2H5z"/>',
    compass: '<path d="M12 2l4 9h-8z" fill="#333"/><path d="M12 22l-4-9h8z" fill="#aaa"/>', full: '<path d="M3 3h6v2H6.4l4 4L9 10.4l-4-4V9H3zm12 0h6v6h-2V6.4l-4 4L13.6 9l4-4H15zM3 15h2v2.6l4-4 1.4 1.4-4 4H9v2H3zm16 0h2v6h-6v-2h2.6l-4-4 1.4-1.4 4 4z"/>',
    eye: '<path d="M12 5c5 0 9 4.5 10 7-1 2.5-5 7-10 7S3 14.5 2 12c1-2.5 5-7 10-7zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>', play: '<circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4z" fill="#fff"/>',
    eco: '<path d="M4 7h14a2 2 0 0 1 2 2v1h2v4h-2v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm0 2v6h14V9zm2 1h6v4H6z"/>', layers: '<path d="M12 2l10 5-10 5L2 7zm-7.6 8.2L12 14l7.6-3.8L22 11.4 12 16.4 2 11.4zm0 4.4L12 18.4l7.6-3.8L22 15.8l-10 5-10-5z"/>',
    track: '<path d="M3 6h12a2 2 0 0 1 2 2v2.5l4-3v9l-4-3V16a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>', info: '<circle cx="12" cy="12" r="10"/><path d="M11 10h2v7h-2zm0-4h2v2h-2z" fill="#fff"/>',
  };
  const B = {}; const mk = (k, title, fn) => (B[k] = h('button', { title, onclick: fn, html: `<svg viewBox="0 0 24 24">${IC[k]}</svg>` }));
  const st = { ug: false, play: false, eco: false, speed: 1, offset: 0, track: null, mode: 'position', layers: { bld: true, lbl: true, cam: true } };
  const SPEEDS = [1, 2, 4, 10, 30, 60, 120, 300, 600, 1800, 3600];
  const rail = h('div.mt-rail', {},
    h('div.mt-grp', {}, mk('search', 'Station search', () => pop(srch))),
    h('div.mt-grp', {}, mk('plus', 'Zoom in', () => zoom(0.7)), mk('minus', 'Zoom out', () => zoom(1.4)), mk('compass', 'Reset bearing to north', () => home())),
    h('div.mt-grp', {}, mk('full', 'Enter fullscreen', () => { const d = document; if (d.fullscreenElement) d.exitFullscreen?.(); else el.requestFullscreen?.().catch(() => toast('Fullscreen not available')); })),
    h('div.mt-grp', {}, mk('eye', 'Enter underground', () => setUG(!st.ug)), mk('play', 'Enter playback', () => setPlay(!st.play)), mk('eco', 'Enter eco mode', () => { st.eco = !st.eco; B.eco.classList.toggle('on', st.eco); B.eco.title = st.eco ? 'Exit eco mode' : 'Enter eco mode'; toast(st.eco ? 'Eco mode: 1 fps train updates' : 'Eco mode off'); })),
    h('div.mt-grp', {}, mk('layers', 'Select layers', () => pop(lay)), mk('track', 'Select tracking mode', () => pop(trk)), mk('info', 'About Mini Tokyo 3D', () => pop(abt))));
  const clkD = h('div.d'), clkT = h('div.t'); const spdL = h('span', {}, '1x speed');
  const edDate = h('input', { type: 'date' }), edTime = h('input', { type: 'time', step: 1 }); const ed = h('div.ed', {}, edDate, edTime);
  const applyEd = () => { if (!edDate.value || !edTime.value) return; const tgt = new Date(`${edDate.value}T${edTime.value}${edTime.value.length === 5 ? ':00' : ''}+09:00`).getTime(); if (!isNaN(tgt)) st.offset = tgt - Date.now(); };
  edDate.onchange = applyEd; edTime.onchange = applyEd;
  const clk = h('div.mt-clk', {}, clkD, clkT, h('div.pb', {}, h('button', { onclick: () => { ed.classList.toggle('on'); const d = now(); edDate.value = fmt(d, { year: 'numeric', month: '2-digit', day: '2-digit' }, 'sv-SE'); edTime.value = fmt(d, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }, 'sv-SE'); } }, 'Edit date & time'), ed,
    h('div.sp', {}, h('button', { title: 'Slower', onclick: () => setSpeed(-1) }, '−'), spdL, h('button', { title: 'Faster', onclick: () => setSpeed(1) }, '+'))));
  const al = h('div.mt-al', { title: 'Train status', onclick: () => toast('운행 정보 · 7 lines with delays (demo)'), html: '<svg width="20" height="18" viewBox="0 0 24 22"><path d="M12 1l11 20H1z" fill="#fff"/><path d="M11 8h2v6h-2zm0 8h2v2h-2z" fill="#000"/></svg><span>Status</span><em>7</em>' });
  const MODES = [['position', 'Position only', '<circle cx="12" cy="12" r="7" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="2.5"/><path d="M12 1v5M12 18v5M1 12h5M18 12h5" stroke="#fff" stroke-width="2"/>'], ['back', 'Back', '<path d="M8 3h8l3 18H5z" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M7 8h10M6.5 12h11M6 16h12" stroke="#fff" stroke-width="1.6"/>'], ['topback', 'Top-back', '<path d="M12 2l8 10h-5v10H9V12H4z"/>'], ['front', 'Front', '<rect x="5" y="2" width="14" height="16" rx="3" fill="none" stroke="#fff" stroke-width="2"/><rect x="7.5" y="5" width="9" height="5"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/><path d="M7 22l2-4M17 22l-2-4" stroke="#fff" stroke-width="2"/>'], ['topfront', 'Top-front', '<path d="M12 22l8-10h-5V2H9v10H4z"/>'], ['heli', 'Helicopter', '<path d="M2 5h20v1.6H2z"/><path d="M11 6h2v2h-2z"/><path d="M6 9h9a5 5 0 0 1 0 8H8a3 3 0 0 1-3-3zM15 12h7v1.6h-7zM8 19h9v1.4H8z"/>'], ['drone', 'Drone', '<path d="M1 7h8v1.5H1zM15 7h8v1.5h-8zM4 8h1.5v3H4zM18.5 8H20v3h-1.5zM4 11h16v2.5H4zM9 13.5h6l-1 3h-4z"/>'], ['bird', 'Bird', '<path d="M3 6c4 0 7 2 8 6 1-6 5-9 10-9-1 6-4 10-9 11l-2 7-2-6c-3-2-5-5-5-9z"/>']];
  const trk = h('div.mt-pop.mt-trk', {}, h('h5', {}, h('span', {}, 'Tracking modes'), h('button', { onclick: () => pop(null) }, '✕')), ...MODES.map(([k, l, ic]) => h('div.r', { 'data-k': k, onclick: () => { setMode(k); if (st.track == null) startTrack(0); pop(null); } }, h('i', { html: `<svg viewBox="0 0 24 24">${ic}</svg>` }), l)));
  const srchIn = h('input', { placeholder: 'Search station', oninput: () => listS() }), srchL = h('div'); const srch = h('div.mt-pop.mt-srch', {}, srchIn, srchL);
  const listS = () => srchL.replaceChildren(...Object.keys(ST).filter((n) => n.toLowerCase().includes(srchIn.value.toLowerCase())).slice(0, 7).map((n) => h('div', { onclick: () => { flyTo(ST[n]); pop(null); } }, n))); listS();
  const lay = h('div.mt-pop.mt-lay', {}, h('b', {}, 'Layers'), ...[['bld', '3D buildings'], ['lbl', 'Station names'], ['cam', 'Live cameras']].map(([k, l]) => h('label', {}, h('input', { type: 'checkbox', checked: true, onchange: (e) => { st.layers[k] = e.target.checked; if (k === 'bld') bld.visible = e.target.checked; } }), l)));
  const abt = h('div.mt-pop.mt-abt', {}, h('b', {}, 'Mini Tokyo 3D — practice clone'), h('p', { style: { margin: '6px 0' } }, 'A real-time 3D digital map of Tokyo\'s public transport. Everything here is code-drawn: stylised geography, schematic rail lines and simulated trains (not live timetable data).'), h('button.k-btn', { onclick: () => pop(null), style: { color: '#fff' } }, 'Close'));
  const info = h('div.mt-info');
  const ugBadge = h('div.mt-ug', {}, 'Underground mode');
  el.append(rail, clk, al, trk, srch, lay, abt, info, ugBadge, h('div.mt-wm', {}, 'mini tokyo 3d', h('span', {}, '-ish')), h('div.mt-attr', {}, '© code-drawn map · schematic lines · simulated trains'));
  function pop(p) { [trk, srch, lay, abt].forEach((x) => x.classList.toggle('on', x === p && !x.classList.contains('on'))); if (p === srch && srch.classList.contains('on')) srchIn.focus(); }
  const fmt = (d, o, loc = 'en-US') => new Intl.DateTimeFormat(loc, { timeZone: 'Asia/Tokyo', ...o }).format(d);
  let simT = Date.now(), lastW = performance.now();
  const now = () => new Date(simT);
  function setSpeed(d) { const i = clamp(SPEEDS.indexOf(st.speed) + d, 0, SPEEDS.length - 1); st.speed = SPEEDS[i]; spdL.textContent = `${st.speed}x speed`; }
  function setPlay(on) { st.play = on; el.classList.toggle('play', on); B.play.classList.toggle('on', on); B.play.title = on ? 'Exit playback' : 'Enter playback'; if (!on) { st.speed = 1; st.offset = 0; spdL.textContent = '1x speed'; ed.classList.remove('on'); simT = Date.now(); } }
  const UGK = { k: 0 };
  function setUG(on) { st.ug = on; el.classList.toggle('ug', on); B.eye.classList.toggle('on', on); B.eye.title = on ? 'Exit underground' : 'Enter underground'; }
  function zoom(f) { const off = S.cam.position.clone().sub(ctl.target).multiplyScalar(f); if (off.length() < ctl.minDistance || off.length() > ctl.maxDistance) return; S.cam.position.copy(ctl.target).add(off); }
  let fly = null; function flyTo([x, z]) { stopTrack(); const off = S.cam.position.clone().sub(ctl.target).setLength(4.5); fly = { t0: performance.now(), a: ctl.target.clone(), b: new THREE.Vector3(x, 0, z), pa: S.cam.position.clone(), pb: new THREE.Vector3(x, 0, z).add(off) }; }
  function setMode(k) { st.mode = k; trk.querySelectorAll('.r').forEach((r) => r.classList.toggle('on', r.dataset.k === k)); }
  setMode('position');
  function startTrack(i) { st.track = i; ctl.enabled = false; info.classList.add('on'); B.track.classList.add('on'); trackOff = null; }
  function stopTrack() { if (st.track == null) return; st.track = null; ctl.enabled = true; info.classList.remove('on'); B.track.classList.remove('on'); ctl.target.copy(tmpP); }
  let trackOff = null;
  // pick a train by click (not drag)
  const ray = new THREE.Raycaster(), mv = new THREE.Vector2(); let downAt = null;
  S.r.domElement.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; });
  S.r.domElement.addEventListener('pointerup', (e) => { if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 4) return; const r = S.r.domElement.getBoundingClientRect(); mv.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(mv, S.cam); const hit = ray.intersectObjects(trains.flatMap((t) => t.cars))[0]; if (hit) startTrack(hit.object.userData.train); else stopTrack(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { stopTrack(); pop(null); } });
  // ---------- animation ----------
  const tmpP = new THREE.Vector3(), tmpD = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0), v3 = new THREE.Vector3();
  let ecoAcc = 0, lastF = performance.now();
  const placeTrain = (t) => { const L = t.lo; for (let c = 0; c < t.cars.length; c++) { let u = t.u - t.dir * c * 0.262 / L.len; u = L.loop ? ((u % 1) + 1) % 1 : clamp(u, 0, 1); L.curve.getPointAt(u, v3); L.curve.getTangentAt(u, tmpD); const m = t.cars[c]; m.position.set(v3.x, (L.sub ? 0.06 : 0.1) + UGK.k * (L.sub ? 0.28 : 0), v3.z); m.lookAt(v3.x + tmpD.x * t.dir, m.position.y, v3.z + tmpD.z * t.dir); } };
  S.on((ts) => {
    const nowP = performance.now(), dt = Math.min(0.1, (nowP - lastF) / 1000); lastF = nowP;
    simT += dt * 1000 * (st.play ? st.speed : 1); if (!st.play) simT = Date.now(); if (st.play && st.offset) { simT += st.offset; st.offset = 0; }
    const d = now(); clkD.textContent = fmt(d, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }); clkT.textContent = fmt(d, { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    // underground blend
    UGK.k += ((st.ug ? 1 : 0) - UGK.k) * (RM ? 1 : Math.min(1, dt * 4.5)); const k = UGK.k;
    groundMat.color.setScalar(1 - k * 0.92); bMat.opacity = 1 - k * 0.94; bld.visible = st.layers.bld && bMat.opacity > 0.03; nodeMat.opacity = 0.55 + k * 0.25;
    S.scene.background.setRGB(0.149 * (1 - k), 0.149 * (1 - k), 0.172 * (1 - k)); S.scene.fog.color.copy(S.scene.background);
    for (const L of lineObjs) { L.mat.opacity = L.sub ? 0.42 + k * 0.58 : 1 - k * 0.82; L.mesh.position.y = L.sub ? Y0 + k * 0.28 : 0.07; }
    nodes.forEach((n) => (n.position.y = 0.09 + k * 0.28));
    // trains
    ecoAcc += dt; const step = st.eco ? (ecoAcc >= 1 ? ecoAcc : 0) : dt; if (!st.eco || ecoAcc >= 1) ecoAcc = 0;
    const mul = st.play ? Math.min(st.speed, 60) : 1;
    if (step) for (const t of trains) { t.u += t.dir * t.speed * step * mul; if (t.lo.loop) t.u = ((t.u % 1) + 1) % 1; else if (t.u > 1 || t.u < 0) { t.dir *= -1; t.u = clamp(t.u, 0, 1); } placeTrain(t); }
    for (const t of trains) { const op = t.lo.sub ? 0.55 + k * 0.45 : 1 - k * 0.8; t.mats.forEach((m) => (m.opacity = op)); }
    // camera
    if (fly) { const e = Math.min(1, (nowP - fly.t0) / 1200), s2 = e * e * (3 - 2 * e); ctl.target.lerpVectors(fly.a, fly.b, s2); S.cam.position.lerpVectors(fly.pa, fly.pb, s2); if (e >= 1) fly = null; }
    if (st.track != null) {
      const t = trains[st.track]; const lead = t.cars[0]; tmpP.copy(lead.position); tmpD.set(0, 0, 1).applyQuaternion(lead.quaternion).setY(0).normalize();
      const T2 = ts; let cp, look = tmpP.clone();
      switch (st.mode) {
        case 'back': cp = tmpP.clone().addScaledVector(tmpD, -1.0).addScaledVector(UP, 0.35); look = tmpP.clone().addScaledVector(tmpD, 1.2); break;
        case 'topback': cp = tmpP.clone().addScaledVector(tmpD, -1.4).addScaledVector(UP, 2.4); break;
        case 'front': cp = tmpP.clone().addScaledVector(tmpD, 1.0).addScaledVector(UP, 0.35); look = tmpP.clone().addScaledVector(tmpD, -1.2); break;
        case 'topfront': cp = tmpP.clone().addScaledVector(tmpD, 1.4).addScaledVector(UP, 2.4); break;
        case 'heli': cp = tmpP.clone().add(v3.set(Math.cos(T2 * 0.35) * 2.2, 1.6, Math.sin(T2 * 0.35) * 2.2)); break;
        case 'drone': cp = tmpP.clone().add(v3.set(Math.cos(T2 * 0.12) * 4.2, 3.4, Math.sin(T2 * 0.12) * 4.2)); break;
        case 'bird': cp = tmpP.clone().addScaledVector(tmpD, -2.2).add(v3.set(Math.sin(T2 * 0.6) * 0.8, 1.3 + Math.sin(T2 * 0.9) * 0.4, 0)); break;
        default: if (!trackOff) trackOff = S.cam.position.clone().sub(ctl.target); cp = tmpP.clone().add(trackOff);
      }
      S.cam.position.lerp(cp, RM ? 1 : 0.12); ctl.target.lerp(look, RM ? 1 : 0.18); S.cam.lookAt(ctl.target);
      const L = t.lo; const near = Object.entries(ST).reduce((b, [n, [x, z]]) => { const dd = Math.hypot(x - tmpP.x, z - tmpP.z); return dd < b[1] ? [n, dd] : b; }, ['', 1e9])[0];
      info.replaceChildren(h('div.ln', {}, h('i', { style: { background: L.col } }), L.name), h('div', {}, `Train ${t.id} · ${t.lo.loop ? (t.dir > 0 ? 'Outer loop' : 'Inner loop') : t.dir > 0 ? 'Outbound' : 'Inbound'}`), h('div', { style: { opacity: .8 } }, `Near ${near} · ${st.mode === 'position' ? 'Position only' : MODES.find((m) => m[0] === st.mode)[1]} view`), h('div', { style: { opacity: .6, fontSize: '10.5px' } }, 'Esc or click the map to stop tracking'));
    } else ctl.update();
    // labels
    const W = el.clientWidth, H = el.clientHeight; const cd = S.cam.position.distanceTo(ctl.target);
    for (const l of labels) { v3.copy(l.v); if (l.kind === 'st') v3.y += k * 0.28; const dist = S.cam.position.distanceTo(v3); v3.project(S.cam); const vis = v3.z < 1 && Math.abs(v3.x) < 1.05 && Math.abs(v3.y) < 1.05 && dist < 17 && (l.kind === 'st' ? st.layers.lbl : st.layers.cam && k < 0.5); l.el.style.opacity = vis ? (l.kind === 'cam' ? 1 : clamp(1.6 - dist / 11, 0.2, 1)) : 0; if (vis) l.el.style.transform = `translate(${(v3.x * 0.5 + 0.5) * W}px,${(-v3.y * 0.5 + 0.5) * H}px)`; }
  });
  window.__demoProof = async () => {
    const o = []; const wait = (ms) => sleep(RM ? 30 : ms);
    // trains move
    const t0 = trains[0].cars[0].position.clone(); await wait(400); o.push(`train moved ${(trains[0].cars[0].position.distanceTo(t0) > 0.001)}`);
    setUG(true); await wait(900); o.push(`underground: ground=${groundMat.color.r.toFixed(2)} subwayOpacity=${lineObjs.find((l) => l.sub).mat.opacity.toFixed(2)} buildings=${bMat.opacity.toFixed(2)}`); setUG(false);
    setPlay(true); setSpeed(1); setSpeed(1); const c1 = clkT.textContent; await wait(600); o.push(`playback ${spdL.textContent}, clock ${c1}→${clkT.textContent}, controls=${getComputedStyle(clk.querySelector('.pb')).display}`); setPlay(false);
    pop(trk); o.push(`tracking panel rows=${trk.querySelectorAll('.r').length}`); trk.querySelector('[data-k="heli"]').click(); await wait(900); o.push(`tracking ${trains[st.track]?.lo.name} mode=${st.mode} info=${info.classList.contains('on')}`);
    stopTrack(); setMode('position'); home(); await wait(200); o.push('restored default view'); return o.join('; ');
  };
};

V['notboring-playful-app-catalog-3d-icon-cards-serial-labels-skins-series-shelf'] = (root, T) => {
  import('@fontsource-variable/archivo/wdth.css'); import('@fontsource-variable/inter-tight'); import('@fontsource/barlow-condensed/500.css');
  theme(root, T, { bg: '#ffffff', fg: '#111', ac: '#7f7cf6', dark: false }); root.classList.add('scroll'); root.style.overflow = 'auto';
  const WIDE = "'Archivo Variable',Arial Black,sans-serif", GR = "'Inter Tight Variable','Inter Variable',Arial,sans-serif", MONO = "'JetBrains Mono Variable',monospace", NAV = "'Barlow Condensed',Arial Narrow,sans-serif";
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  css(`.nb{background:#fff;color:#111;font-family:${GR};position:relative}.nb *{box-sizing:border-box}.nb button{font-family:inherit;cursor:pointer}
.nb-nav{position:sticky;top:0;height:0;z-index:30}.nb-nav>div{height:100px;display:flex;align-items:center;padding:0 128px 0 100px;gap:44px;font:500 16.5px ${NAV};letter-spacing:.1em}
.nb-nav .lg{flex:1}.nb-nav a{color:#111;text-decoration:none}.nb-nav a:hover{text-decoration:underline;text-underline-offset:4px}
.nb .nb-dl{height:46px;padding:0 30px;background:#111;color:#fff;border:0;border-radius:3px;font:700 18px ${GR};letter-spacing:-.01em}
.nb-hero{position:relative;height:630px;display:grid;place-items:center;overflow:hidden}
.nb-hero h1{margin:0;font:900 172px/1 ${WIDE};font-stretch:125%;font-variation-settings:'wdth' 125;color:#7f7cf6;letter-spacing:-.02em;transform:translateY(34px);user-select:none}
.nb-hero canvas{position:absolute;inset:0;width:100%!important;height:100%!important;pointer-events:none}
.nb-band{background:#e0e0e0;padding:110px 0 120px}.nb-w{width:864px;margin:0 auto}
.nb h2{margin:0;font:700 44px/1.18 ${GR};letter-spacing:-.02em}.nb .lede{margin:14px 0 0;font:400 40px/1.25 ${GR};letter-spacing:-.015em;color:#222}
.nb-play{padding:110px 0 70px;text-align:center}.nb-play>h2{font-size:74px;letter-spacing:-.03em;margin-bottom:60px}
.nb-apps{display:grid;grid-template-columns:repeat(3,472px);justify-content:center;row-gap:60px}
.nb-app{display:flex;flex-direction:column;align-items:center;cursor:pointer}
.nb-tile{width:242px;height:258px;perspective:900px}.nb-tile>div{width:100%;height:100%;transition:transform .35s cubic-bezier(.2,.9,.3,1.3);transform-style:preserve-3d}
.nb-tile svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 18px 18px #0000)}.nb-app:hover .nb-tile svg{filter:drop-shadow(0 26px 24px #0002)}
.nb-app.boop .nb-tile>div{animation:nbBoop .5s cubic-bezier(.3,1.6,.5,1)}@keyframes nbBoop{30%{transform:scale(1.08,.9)}60%{transform:scale(.96,1.06)}}
.nb-lab{margin-top:62px;font:400 12.5px/1.6 ${MONO};letter-spacing:.06em;text-transform:uppercase}.nb-lab{text-align:center}.nb-lab b{display:block;font-weight:800}.nb-lab i{display:block;font-style:normal;color:#9a9a9a;text-transform:none}
.nb .nb-ow{margin-top:40px;height:58px;padding:0 34px;border:2.5px solid #111;background:#fff;border-radius:3px;font:700 21px ${GR};transition:background .2s,color .2s}.nb .nb-ow:hover{background:#111;color:#fff}
.nb-st{padding:80px 0}.nb-st p{margin:12px 0 0;font:400 40px/1.3 ${GR};letter-spacing:-.015em;color:#222}
.nb-deco{height:520px;position:relative}.nb-deco canvas{position:absolute;left:50%;top:0;width:520px;height:520px;margin-left:-260px}
.nb-ser{padding:60px 0 50px}.nb-ser h3{width:864px;margin:0 auto 46px;font:700 40px ${GR};letter-spacing:-.02em}
.nb-skins{display:grid;grid-template-columns:repeat(3,420px);justify-content:center;gap:0}
.nb-sk{display:flex;flex-direction:column;align-items:center;cursor:pointer;border-radius:18px;padding:14px 0 18px;transition:background .2s}
.nb-sk:hover{background:#f6f6f6}.nb-sk.on{background:#f1f0ff}.nb-sk canvas{width:240px;height:240px;transition:transform .3s}.nb-sk:hover canvas{transform:translateY(-6px) rotate(-2deg)}
.nb-sk .nb-lab{margin-top:26px}.nb-sk.on .nb-lab b::after{content:'  ● ON';color:#7f7cf6}
.nb-wid{padding:70px 0 40px}.nb-wg{display:flex;gap:22px;margin-top:40px;align-items:flex-start}
.nb-wg>div{background:#333;color:#fff;border-radius:26px;padding:18px 22px;font:800 15px/1 ${GR};letter-spacing:.02em}
.nb-foot{padding:100px 0 60px;text-align:center}.nb-foot h2{font-size:56px}.nb-foot p{font:400 22px ${GR};color:#555}.nb-foot small{display:block;margin-top:70px;font:400 12px ${MONO};letter-spacing:.08em;color:#888}
`);
  const el = h('div.nb'); root.append(el);
  const logo = `<svg width="66" height="26" viewBox="0 0 66 26"><path d="M2 13h6" stroke="#ff4f4f" stroke-width="3" stroke-linecap="round"/><ellipse cx="20" cy="13" rx="7" ry="9" transform="rotate(20 20 13)" fill="none" stroke="#ffbd2e" stroke-width="3.4"/><circle cx="32" cy="9" r="3" fill="#3d7bff"/><ellipse cx="45" cy="13" rx="7" ry="9" transform="rotate(20 45 13)" fill="none" stroke="#ff8fb0" stroke-width="3.4"/><path d="M58 13h6" stroke="#3d7bff" stroke-width="3" stroke-linecap="round"/></svg>`;
  el.append(h('div.nb-nav', {}, h('div', {}, h('div.lg', { html: logo }), ...['APPS', 'SHOP', 'WORDS', 'PLANS', 'SUPPORT'].map((t) => h('a', { href: '#', onclick: (e) => { e.preventDefault(); if (t === 'APPS') play.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); else toast(`${t} (demo)`); } }, t)), h('button.nb-dl', { onclick: () => toast('Download on the App Store (demo)') }, 'Download'))));
  const hero = h('section.nb-hero', {}, h('h1', {}, '!BORING')); el.append(hero);
  el.append(h('section.nb-band', {}, h('div.nb-w', {}, h('h2', { html: "Playful software for life's<br>boring routines." }), h('p.lede', { html: 'Most apps help you save time.<br>We help you savor it 😊' }))));
  // ---------- Let's Play: clay app-icon cards ----------
  const tile = (inner, id) => `<svg viewBox="0 0 242 258"><defs><linearGradient id="nbT${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1ebe1"/><stop offset="1" stop-color="#e8e0d3"/></linearGradient><radialGradient id="nbS${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#cbbfae" stop-opacity=".7"/><stop offset="1" stop-color="#cbbfae" stop-opacity="0"/></radialGradient></defs><rect x="0" y="16" width="242" height="242" rx="58" fill="#d8ccb9"/><rect x="0" y="0" width="242" height="242" rx="58" fill="url(#nbT${id})"/><rect x="2" y="2" width="238" height="120" rx="56" fill="#fff" opacity=".18"/>${inner}</svg>`;
  const APPS = [
    ['!CAMERA', 'LOVE OF PHOTOGRAPHY', 'APPx006', `<path d="M0 58a58 58 0 0 1 58-58h126a58 58 0 0 1 58 58v8H0z" fill="#e0d6c6"/><circle cx="104" cy="138" r="70" fill="#d3c6b2" opacity=".6"/>${Array.from({ length: 24 }, (_, i) => `<circle cx="${112 + Math.cos(i / 24 * 6.283) * 62}" cy="${126 + Math.sin(i / 24 * 6.283) * 62}" r="10" fill="#f6bb10"/>`).join('')}<circle cx="112" cy="126" r="62" fill="#f8c51c"/><circle cx="112" cy="126" r="48" fill="#222"/><circle cx="112" cy="126" r="30" fill="#3a3540"/><circle cx="112" cy="126" r="18" fill="#5c4f6e"/><circle cx="100" cy="114" r="6" fill="#fff" opacity=".7"/><rect x="176" y="22" width="40" height="40" rx="6" fill="#222"/><path d="M184 30h18v18z" fill="#444"/>`],
    ['!VIBES', 'MUSIC TO FOCUS, RELAX, SLEEP', 'APPx005', `<ellipse cx="121" cy="178" rx="78" ry="6" fill="#cbbfae"/><path d="M42 118c18-30 46-30 66-8s44 26 62 0 42-22 42 4" fill="none" stroke="#2fb4c8" stroke-width="30" stroke-linecap="round"/><path d="M42 110c18-30 46-30 66-8s44 26 62 0 42-22 42 4" fill="none" stroke="#5ad7ea" stroke-width="26" stroke-linecap="round"/><circle cx="196" cy="104" r="5" fill="#fff"/>`],
    ['!HABITS', 'MASTER A NEW HABIT', 'APPx004', `<path d="M64 128l120-40-56 120z" fill="#cbbfae" opacity=".8" transform="translate(-10 14)"/><path d="M64 118L190 66 128 196 110 140z" fill="#ff5a73"/><path d="M110 140L190 66 128 196z" fill="#e23a55"/><path d="M64 118l46 22 80-74z" fill="#ff7a8e"/>`],
    ['!WEATHER', 'PLAY THE WEATHER', 'APPx002', `<ellipse cx="110" cy="160" rx="80" ry="34" fill="#d3c6b2" opacity=".7"/><circle cx="142" cy="84" r="46" fill="#f7b500"/><path d="M142 38a46 46 0 0 1 0 92z" fill="#f9c63a" opacity=".6"/><circle cx="96" cy="124" r="40" fill="#1a7fd8"/><circle cx="144" cy="128" r="34" fill="#1f8fe6"/><circle cx="182" cy="134" r="22" fill="#2196ea"/><circle cx="46" cy="150" r="13" fill="#1a7fd8"/><rect x="60" y="130" width="140" height="34" rx="17" fill="#1a7fd8"/><circle cx="90" cy="112" r="20" fill="#3aa2f0" opacity=".6"/>`],
    ['!TIMER', 'PLAY WITH TIME', 'APPx001', `<circle cx="112" cy="128" r="70" fill="#d3c6b2" opacity=".8"/><circle cx="121" cy="120" r="70" fill="#f99898"/><circle cx="121" cy="120" r="70" fill="none" stroke="#f47e80" stroke-width="3"/><path d="M114 120L121 40 128 120z" fill="#1673d0"/><circle cx="121" cy="124" r="16" fill="#1a7fd8"/><circle cx="117" cy="120" r="5" fill="#5aaef5"/>`],
    ['!CALCULATOR', 'PLAY WITH NUMBERS', 'APPx003', `<path d="M86 60h62v52h52v62h-52v52H86v-52H34v-62h52z" fill="#cbbfae" opacity=".8" transform="translate(-8 8)"/><path d="M90 50h62v52h52v62h-52v52H90v-52H38v-62h52z" fill="#c4a8f5"/><path d="M90 50h62L121 133zM204 102v62L121 133zM152 216H90L121 133zM38 164v-62L121 133z" fill="#b391ee"/><path d="M90 102V50l31 83zM152 102h52l-83 31zM152 164v52l-31-83zM90 164H38l83-31z" fill="#a47de6"/>`],
  ];
  const appGrid = h('div.nb-apps', {}, APPS.map(([n, t, s2, inner], i) => { const inn = h('div', { html: tile(inner, i) }); const c = h('div.nb-app', {}, h('div.nb-tile', {}, inn), h('div.nb-lab', {}, h('b', {}, n), t, h('i', {}, s2)));
    c.onpointermove = (e) => { const r = inn.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; inn.style.transform = `translateY(-10px) rotateX(${(-y * 18).toFixed(1)}deg) rotateY(${(x * 22).toFixed(1)}deg)`; };
    c.onpointerleave = () => (inn.style.transform = ''); c.onclick = () => { c.classList.remove('boop'); void c.offsetWidth; c.classList.add('boop'); blip(520 + i * 90, 0.12, 'triangle', 0.08); }; return c; }));
  const play = h('section.nb-play', {}, h('h2', {}, "Let's Play"), appGrid, h('button.nb-ow', { onclick: () => toast('All Works (demo)') }, 'See all Works')); el.append(play);
  const deco = h('div.nb-deco');
  el.append(h('section.nb-st', {}, h('div.nb-w', {}, h('h2', { html: 'Built like a game,<br>Runs like an app.' }), h('p', {}, 'Beautifully designed like a game using 3D, animation, physics, haptics, and sounds. All while getting stuff done with the speed and utility of an app.'))), deco,
    h('section.nb-st', {}, h('div.nb-w', {}, h('h2', { html: 'Just what you need,<br>Not a button more.' }), h('p', {}, 'Apps that do one thing exceptionally well with boldness and clarity. No menus. No unnecessary features. Just simple swipes and taps.'))),
    h('section.nb-st', {}, h('div.nb-w', {}, h('h2', {}, 'Skins for every occasion'), h('p', {}, 'New collections and artist collaborations every season.'))));
  // ---------- three.js: shared offscreen renderer for skin cubes + hero sphere ----------
  const R3 = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); R3.setPixelRatio(1); R3.setSize(240, 240, false); R3.setClearColor(0, 0);
  const pm = new THREE.PMREMGenerator(R3); const ENV = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const sc3 = new THREE.Scene(); sc3.environment = ENV; const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50); cam.position.set(0, 0, 7.4);
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 5, 6); sc3.add(key, new THREE.AmbientLight(0xffffff, 0.5));
  const cube = new RoundedBoxGeometry(2.1, 2.1, 2.1, 6, 0.42); const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.1, 2.1, 2.1)), new THREE.LineBasicMaterial({ color: 0x111111 }));
  const tex = (draw) => { const c = document.createElement('canvas'); c.width = c.height = 256; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
  const dice = tex((g) => { g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#111'; [[64, 64], [192, 64], [128, 128], [64, 192], [192, 192]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 22, 0, 7); g.fill(); }); });
  const eye = tex((g) => { g.fillStyle = '#4fd8ea'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#fff'; g.beginPath(); g.arc(150, 120, 52, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(160, 124, 26, 0, 7); g.fill(); });
  const cedar = tex((g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#3b7a3a'); gr.addColorStop(0.5, '#6d6a2a'); gr.addColorStop(1, '#c0412c'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
  const halves = tex((g) => { g.fillStyle = '#111'; g.fillRect(0, 0, 128, 256); g.fillStyle = '#f4f4f4'; g.fillRect(128, 0, 128, 256); });
  const M = { depth: () => new THREE.ShaderMaterial({ vertexShader: 'varying float vZ; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vZ = -mv.z; gl_Position = projectionMatrix * mv; }', fragmentShader: 'varying float vZ; void main(){ float d = smoothstep(5.7, 7.3, vZ); gl_FragColor = vec4(vec3(mix(0.97, 0.18, d)), 1.0); }' }), normal: () => new THREE.MeshNormalMaterial(), wire: () => null, cedar: () => new THREE.MeshPhysicalMaterial({ map: cedar, roughness: 0.35, clearcoat: 1 }), karat: () => new THREE.MeshStandardMaterial({ color: 0xf1c33a, metalness: 1, roughness: 0.22 }), monsters: () => new THREE.MeshPhysicalMaterial({ map: eye, roughness: 0.3, clearcoat: 1 }),
    mem: () => new THREE.MeshPhysicalMaterial({ map: dice, roughness: 0.5 }), chroma: () => new THREE.MeshPhysicalMaterial({ color: 0x3b2bd8, roughness: 0.15, metalness: 0.3, iridescence: 1, iridescenceIOR: 2.1, clearcoat: 1 }), card: () => new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6 }),
    andy: () => new THREE.MeshPhysicalMaterial({ color: 0xffa400, roughness: 0.25, clearcoat: 1 }), graphite: () => new THREE.MeshStandardMaterial({ color: 0x3a3a3c, metalness: 0.8, roughness: 0.38 }), opal: () => new THREE.MeshPhysicalMaterial({ color: 0xd8e4ff, roughness: 0.1, iridescence: 1, iridescenceIOR: 1.8, clearcoat: 1, sheen: 1, sheenColor: new THREE.Color(0xffc0ef) }), halves: () => new THREE.MeshStandardMaterial({ map: halves, roughness: 0.35 }) };
  const SER = [['The Debug Series', [['DEPTH', 'REVEAL THE SPACE', 'SKNx009', 'depth'], ['NORMAL', 'REVEAL THE CONTOUR', 'SKNx010', 'normal'], ['WIREFRAME', 'REVEAL THE STRUCTURE', 'SKNx011', 'wire']]], ['The Artist Series', [['CEDAR', 'ERAN HILLELI', 'SKNx008', 'cedar'], ['KARAT', 'LIVE RICH', 'SKNx007', 'karat'], ['MONSTERS', 'LIVE FUN', 'SKNx006', 'monsters']]], ['Andy x Presstube', [['MEM', 'ANDY X PRESSTUBE', 'SKNx005', 'mem'], ['CHROMA', 'BAKE IN THE RAYS', 'SKNx004', 'chroma'], ['COLLECTOR CARD 002', 'ANDY X PRESSTUBE', 'CRDx002', 'card']]], ['The Creator Series', [['ANDY', 'MATERIAL OF MAKING', 'SKNx002', 'andy'], ['GRAPHITE', 'MATERIAL OF CREATION', 'SKNx001', 'graphite'], ['OPAL', 'MATERIAL OF INSPIRATION', 'SKNx003', 'opal']]]];
  const views = []; let skin = null;
  const mesh = new THREE.Mesh(cube); sc3.add(mesh, edges); const cardGeo = new THREE.BoxGeometry(1.7, 2.4, 0.06);
  SER.forEach(([title, list]) => el.append(h('section.nb-ser', {}, h('h3', {}, title), h('div.nb-skins', {}, list.map(([n, t, sn, k]) => { const cv = h('canvas', { width: 240, height: 240 }); const card = h('div.nb-sk', { title: `Apply ${n} skin`, onclick: () => setSkin(k) }, cv, h('div.nb-lab', {}, h('b', {}, n), t, h('i', {}, sn))); views.push({ k, cv, ctx: cv.getContext('2d'), mat: M[k](), card, vis: false, hov: 0, rot: Math.random() * 6 }); card.onpointerenter = () => (views.find((v) => v.card === card).hov = 1); card.onpointerleave = () => (views.find((v) => v.card === card).hov = 0); return card; })))));
  const io = new IntersectionObserver((es) => es.forEach((e) => { const v = views.find((x) => x.cv === e.target) || (e.target === dcv ? dv : null); if (v) v.vis = e.isIntersecting; }), { root });
  const dcv = h('canvas', { width: 520, height: 520 }); deco.append(dcv); const dv = { cv: dcv, ctx: dcv.getContext('2d'), vis: false, rot: 0 }; io.observe(dcv); views.forEach((v) => io.observe(v.cv));
  const torus = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.5, 48, 96), new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.85 }));
  el.append(h('section.nb-wid', {}, h('div.nb-w', {}, h('h2', {}, 'Widgets to upgrade your homescreen.'), h('p.lede', { style: { fontSize: '28px' } }, 'Put play at your fingertips. See the weather or start a preset timer in a single tap.'), h('div.nb-wg', {}, h('div', { html: 'SEATTLE<br><span style="font-size:42px">65</span><br><br>☁︎ ⁄⁄⁄', style: { width: '160px', height: '160px' } }), h('div', { html: '<span style="font-size:60px;line-height:.8">+</span>', style: { width: '74px', height: '74px', display: 'grid', placeItems: 'center', background: '#222' } }), h('div', { html: 'SEATTLE<br><span style="font-size:50px;line-height:1.1">65</span> &nbsp;LIGHT RAIN', style: { width: '340px', height: '160px' } })))),
    h('section.nb-foot', {}, h('h2', {}, 'Ditch the defaults, support interesting.'), h('p', {}, '100% independently-owned software couture house.'), h('button.nb-ow', { onclick: () => toast('Get Updates (demo)') }, 'Get Updates'), h('small', {}, '2026 © NOT BORING SOFTWARE LTD.')));
  // hero renderer (own canvas): floating half-black / half-white sphere that wears the chosen skin
  const HR = new THREE.WebGLRenderer({ antialias: true, alpha: true }); HR.setPixelRatio(Math.min(2, devicePixelRatio)); hero.append(HR.domElement);
  const hs = new THREE.Scene(); hs.environment = ENV; const hc = new THREE.PerspectiveCamera(32, 1, 0.1, 100); hc.position.set(0, 0, 16); hs.add(key.clone(), new THREE.AmbientLight(0xffffff, 0.5));
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 48), M.halves()); ball.position.set(3.3, 1.6, 0); hs.add(ball); const wireBall = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(1.5, 18, 12)), new THREE.LineBasicMaterial({ color: 0x111111 })); wireBall.visible = false; ball.add(wireBall);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.4, 40), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.12 })); shadow.position.set(3.3, -2.2, -1); shadow.scale.y = 0.18; hs.add(shadow);
  const fitH = () => { const w = hero.clientWidth, hh = hero.clientHeight; HR.setSize(w, hh, false); hc.aspect = w / hh; hc.updateProjectionMatrix(); }; fitH(); new ResizeObserver(fitH).observe(hero);
  let px = 0, py = 0; hero.onpointermove = (e) => { const r = hero.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - 0.5; py = (e.clientY - r.top) / r.height - 0.5; };
  function setSkin(k) { skin = k; views.forEach((v) => v.card.classList.toggle('on', v.k === k)); const v = views.find((x) => x.k === k); ball.material = k ? (k === 'wire' ? new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }) : v.mat) : M.halves(); wireBall.visible = k === 'wire'; if (k) { blip(660, 0.1, 'triangle', 0.06); toast(`${v.card.querySelector('b').textContent} skin applied to the hero ball`); } }
  let t0 = performance.now(), frames = 0;
  const loop = (now) => { const t = (now - t0) / 1000; frames++;
    ball.position.y = 1.6 + (RM ? 0 : Math.sin(t * 1.4) * 0.25); ball.rotation.y = (RM ? 0 : t * 0.5) + px * 2; ball.rotation.x = py * 1.2; shadow.scale.x = 1 - (ball.position.y - 1.6) * 0.3; HR.render(hs, hc);
    for (const v of views) { if (!v.vis) continue; v.rot += RM ? 0 : 0.012 + v.hov * 0.05; const isCard = v.k === 'card'; mesh.geometry = isCard ? cardGeo : cube; mesh.visible = v.k !== 'wire'; edges.visible = v.k === 'wire'; if (v.mat) mesh.material = v.mat;
      const o = v.k === 'wire' ? edges : mesh; o.rotation.set(0.5 + Math.sin(v.rot) * 0.1, 0.7 + v.rot * (isCard ? 0.6 : 1), 0); if (isCard) o.rotation.z = 0.3; else o.rotation.z = 0; R3.render(sc3, cam); v.ctx.clearRect(0, 0, 240, 240); v.ctx.drawImage(R3.domElement, 0, 0, 240, 240); }
    if (dv.vis) { mesh.geometry = torus.geometry; mesh.material = torus.material; mesh.visible = true; edges.visible = false; dv.rot += RM ? 0 : 0.008; mesh.rotation.set(1.1 + Math.sin(dv.rot) * 0.2, dv.rot, 0.2); R3.render(sc3, cam); dv.ctx.clearRect(0, 0, 520, 520); dv.ctx.drawImage(R3.domElement, 0, 0, 520, 520); }
    requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  window.__demoProof = async () => { const o = [], w = (ms) => sleep(RM ? 30 : ms);
    const a = appGrid.children[0], inn = a.querySelector('.nb-tile>div'), r = inn.getBoundingClientRect(); a.dispatchEvent(new PointerEvent('pointermove', { clientX: r.right - 20, clientY: r.top + 20, bubbles: true })); o.push(`hover tilt: ${inn.style.transform}`); a.dispatchEvent(new PointerEvent('pointerleave')); a.click(); o.push(`app cards=${appGrid.children.length} serials=${[...appGrid.querySelectorAll('.nb-lab i')].map((x) => x.textContent).join(',')}`);
    views[1].card.scrollIntoView(); await w(500); const px2 = views[1].ctx.getImageData(120, 120, 1, 1).data; o.push(`skin canvases=${views.length} NORMAL cube pixel rgba(${[...px2].join(',')})`);
    views[1].card.click(); o.push(`hero ball skin→${ball.material.type}`); views[2].card.click(); o.push(`→wire=${wireBall.visible}`); setSkin(null); document.querySelectorAll('.tg-toast').forEach((x) => x.classList.remove('on'));
    root.scrollTop = 0; await w(200); o.push(`restored: ball ${ball.material.type}, skin=${skin}, scrollTop=${root.scrollTop}, frames=${frames}`); return o.join('; '); };
};


V['henryheffernan-bios-boot-start-gate-3d-desk-camera-zoom-into-crt-monitor-os'] = (root, T) => {
  import('@fontsource/ibm-plex-mono/400.css');
  theme(root, T, { bg: '#000', fg: '#fff', ac: '#fff', dark: true });
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MONO = "'IBM Plex Mono','DejaVu Sans Mono',Menlo,monospace", W95 = "Tahoma,Verdana,'DejaVu Sans','Segoe UI',sans-serif", TIMES = "'Times New Roman',Times,'Liberation Serif',serif";
  css(`.hh{position:absolute;inset:0;background:#000;color:#fff;overflow:hidden;font:400 13px/1.25 ${MONO}}
.hh *{box-sizing:border-box}.hh button{font:inherit;color:inherit;cursor:pointer}
.hh-gate{position:absolute;inset:0;display:grid;place-items:center;z-index:30;background:#000;transition:opacity .5s}
.hh-gate .box{border:5px solid #fff;padding:18px 18px 18px;min-width:330px;max-width:92vw;background:#000;font:400 13px/1.05 ${MONO};letter-spacing:.02em}
.hh-gate .cur{display:inline-block;width:8px;border-bottom:2px solid #fff;margin-left:6px;animation:hhBl 1s steps(1) infinite}@keyframes hhBl{50%{opacity:0}}
.hh-gate .st{display:block;margin:13px auto 0;border:2px solid #fff;background:#000;padding:6px 6px;font:400 13px ${MONO};letter-spacing:.04em}
.hh-gate .st:hover,.hh-gate .st:focus-visible{background:#fff;color:#000;outline:none}
.hh-boot{position:absolute;inset:0;z-index:25;background:#000;padding:28px 34px;white-space:pre-wrap;font:400 14px/1.45 ${MONO};color:#ddd;transition:opacity .6s;overflow:hidden}
.hh-boot .es{position:absolute;right:34px;top:26px;border:2px solid #ddd;padding:6px 10px;text-align:center;font:700 12px/1.2 ${MONO};color:#ddd}
.hh-boot .es b{display:block;font-size:22px;letter-spacing:.08em}
.hh-boot .bar{color:#fff}
.hh-sc{position:absolute;inset:0;z-index:1;opacity:0;transition:opacity 1.6s ease}.hh-sc.on{opacity:1}.hh-sc canvas{display:block;width:100%!important;height:100%!important}
.hh-hud{position:absolute;inset:0;pointer-events:none;z-index:5;transition:opacity .4s}.hh-hud>*{pointer-events:auto}
.hh-name{position:absolute;left:22px;top:20px;background:#000;padding:10px 14px 9px;border:0;font:400 12px/1.4 ${MONO}}.hh-name b{display:block;font:700 22px/1.1 ${MONO};letter-spacing:.02em}
.hh-hint{position:absolute;left:50%;bottom:28px;transform:translateX(-50%);background:#000c;border:1px solid #fff6;padding:7px 12px;font-size:12px;white-space:nowrap;animation:hhPulse 2.4s ease-in-out infinite}@keyframes hhPulse{50%{opacity:.45}}
.hh-snd{position:absolute;left:22px;bottom:22px;width:40px;height:40px;background:#000;border:2px solid #fff;display:grid;place-items:center}
.hh-snd:hover{background:#fff;color:#000}
.hh-clock{position:absolute;right:22px;top:20px;background:#000;padding:8px 12px;font-size:12px}
.hh-exit{position:absolute;right:12px;top:12px;z-index:60;background:#000;border:2px solid #fff;padding:6px 10px;font:400 12px ${MONO};opacity:0;pointer-events:none;transition:opacity .3s}
.hh.os .hh-exit{opacity:1;pointer-events:auto}
.hh-os{position:absolute;inset:0;z-index:50;opacity:0;pointer-events:none;transition:opacity .35s;background:#008080;font:400 12px/1.3 ${W95};color:#000;overflow:hidden;user-select:none}
.hh.os .hh-os{opacity:1;pointer-events:auto}
.hh-os::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(#0000 0 2px,#0000000d 2px 3px),radial-gradient(120% 120% at 50% 50%,#0000 60%,#0006);z-index:999}
.hh-ic{position:absolute;width:84px;display:grid;justify-items:center;gap:4px;padding:4px;color:#fff;text-align:center;font-size:11.5px;cursor:default}
.hh-ic span{padding:1px 3px}.hh-ic.sel span{background:#000080;outline:1px dotted #fff}.hh-ic.sel svg{filter:brightness(.6) sepia(1) hue-rotate(190deg) saturate(4)}
.hh-win{position:absolute;background:#c0c0c0;border:2px solid;border-color:#fff #000 #000 #fff;box-shadow:inset -1px -1px #808080,inset 1px 1px #dfdfdf;padding:3px;display:flex;flex-direction:column;min-width:240px}
.hh-win .tb{height:22px;display:flex;align-items:center;gap:4px;padding:0 3px 0 5px;background:linear-gradient(90deg,#000080,#1084d0);color:#fff;font-weight:700;cursor:move;flex-shrink:0}
.hh-win:not(.act) .tb{background:linear-gradient(90deg,#808080,#b5b5b5)}
.hh-win .tb span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hh-win .tb button,.hh-tbar button,.hh-bv{background:#c0c0c0;border:2px solid;border-color:#fff #000 #000 #fff;box-shadow:inset -1px -1px #808080;color:#000;padding:0;font:700 11px/1 ${W95}}
.hh-win .tb button{width:18px;height:16px;display:grid;place-items:center}
.hh-win .tb button:active,.hh-tbar button:active,.hh-tbar button.on,.hh-bv:active{border-color:#000 #fff #fff #000;box-shadow:inset 1px 1px #808080}
.hh-win .bd{flex:1;background:#fff;margin-top:3px;border:2px solid;border-color:#808080 #fff #fff #808080;overflow:auto;min-height:0}
.hh-tbar{position:absolute;left:0;right:0;bottom:0;height:34px;background:#c0c0c0;border-top:2px solid #fff;display:flex;align-items:center;gap:4px;padding:0 4px;z-index:900}
.hh-tbar .start{height:26px;padding:0 8px;display:flex;align-items:center;gap:5px;font-weight:700;font-size:12.5px}
.hh-tbar .tk{height:26px;min-width:140px;max-width:180px;padding:0 8px;text-align:left;font-weight:400;font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hh-tbar .tray{margin-left:auto;height:26px;padding:0 10px;display:flex;align-items:center;gap:8px;border:1px solid;border-color:#808080 #fff #fff #808080;font-size:11.5px}
.hh-sm{position:absolute;left:4px;bottom:34px;width:220px;background:#c0c0c0;border:2px solid;border-color:#fff #000 #000 #fff;display:flex;z-index:950}
.hh-sm .side{width:26px;background:linear-gradient(#000080,#1084d0);color:#c0c0c0;writing-mode:vertical-rl;transform:rotate(180deg);font:900 17px ${W95};padding:6px 0;text-align:right}
.hh-sm .it{flex:1;display:flex;flex-direction:column;padding:2px}.hh-sm .it button{background:none;border:0;text-align:left;padding:8px 10px;font:400 12.5px ${W95};display:flex;gap:10px;align-items:center}.hh-sm .it button:hover{background:#000080;color:#fff}
.hh-sm hr{border:0;border-top:1px solid #808080;border-bottom:1px solid #fff;margin:2px 0}
.hh-sh{display:flex;height:100%;font-family:${TIMES};color:#000}
.hh-sh.home{display:grid;place-items:center;text-align:center;background:#fff}
.hh-sh.home h1{margin:0;font:700 clamp(30px,5vw,64px)/1 ${TIMES}}.hh-sh.home h2{margin:10px 0 34px;font:400 clamp(16px,2vw,24px) ${TIMES}}
.hh-sh nav{display:flex;gap:26px;flex-wrap:wrap;justify-content:center}.hh-sh nav a,.hh-sh .side a{font:700 15px ${TIMES};color:#000;cursor:pointer;text-decoration:underline;text-transform:uppercase}
.hh-sh nav a:hover,.hh-sh .side a:hover{color:#00f}.hh-sh .side a.on{color:#00f}
.hh-sh .side{width:230px;flex-shrink:0;padding:30px 26px;border-right:1px solid #ddd;display:flex;flex-direction:column;gap:14px}.hh-sh .side h1{margin:0 0 18px;font:700 30px/1 ${TIMES}}
.hh-sh .ct{padding:30px 34px;overflow:auto;font:400 16px/1.5 ${TIMES}}.hh-sh .ct h3{margin:0 0 12px;font:700 34px ${TIMES}}.hh-sh .ct .row{border-top:1px solid #ddd;padding:12px 0}.hh-sh .ct .row b{display:block;font-size:19px}
.hh-sh .pj{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}.hh-sh .pj div{border:2px solid #000;padding:10px;min-height:100px;cursor:pointer}.hh-sh .pj div:hover{background:#000;color:#fff}
.hh-dlg{padding:16px;display:grid;gap:12px;font:400 12px ${W95}}.hh-dlg .r{display:flex;gap:12px;align-items:center}
.hh-bv{padding:5px 18px;font-weight:400;font-size:12px;justify-self:center}
.hh-hn{display:grid;gap:6px;padding:14px;justify-content:center}.hh-hn .g{display:grid;grid-template-columns:repeat(5,34px);gap:4px}.hh-hn .g i{height:34px;border:2px solid #999;display:grid;place-items:center;font:700 18px ${W95};font-style:normal;text-transform:uppercase}
.hh-hn .g i.c{background:#6aaa64;color:#fff;border-color:#6aaa64}.hh-hn .g i.p{background:#c9b458;color:#fff;border-color:#c9b458}.hh-hn .g i.x{background:#787c7e;color:#fff;border-color:#787c7e}
.hh-hn input{font:700 16px ${W95};text-transform:uppercase;padding:4px;width:100%;border:2px solid;border-color:#808080 #fff #fff #808080}
.hh-fb{position:absolute;inset:0;display:grid;place-items:center;color:#888;font-size:12px}
@media (max-width:640px){.hh-name b{font-size:16px}.hh-name{padding:8px 10px}.hh-ic{width:70px;font-size:10.5px}.hh-tbar .tk{min-width:80px}.hh-sh .side{display:none}.hh-sh .ct{padding:18px}.hh-sh nav{gap:14px}.hh-clock{display:none}.hh-gate .box{min-width:0}}
${RM ? '.hh *{animation:none!important;transition:none!important}' : ''}`);
  const el = h('div.hh'); root.append(el);
  // ---------------- state
  let state = 'gate', sound = false, speed = 1;
  // ---------------- gate
  const startB = h('button.st', { onclick: () => start() }, 'START');
  const gate = h('div.hh-gate', {}, h('div.box', {}, h('div', {}, 'Henry Heffernan Portfolio Showcase 2022'), h('div', {}, 'Click start to begin', h('span.cur', {}, '\u00a0')), startB));
  el.append(gate);
  const boot = h('div.hh-boot', { style: { display: 'none' } });
  el.append(boot);
  // ---------------- three.js scene
  const sc = h('div.hh-sc'); el.append(sc);
  const hud = h('div.hh-hud', { style: { opacity: 0 } }); el.append(hud);
  const clockEl = h('div.hh-clock');
  const sndB = h('button.hh-snd', { title: 'Toggle sound', onclick: () => toggleSound() });
  const hint = h('div.hh-hint', {}, '▸ Click the monitor to enter');
  hud.append(h('div.hh-name', {}, h('b', {}, 'HENRY HEFFERNAN'), 'Software Engineer'), clockEl, hint, sndB);
  const drawSnd = () => { sndB.innerHTML = sound ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3 7h3l5-4v14l-5-4H3z"/><path d="M13.5 6.5a5 5 0 010 7M15.8 4.2a8.2 8.2 0 010 11.6" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>' : '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3 7h3l5-4v14l-5-4H3z"/><path d="M13.5 7.5l5 5m0-5l-5 5" stroke="currentColor" stroke-width="1.6"/></svg>'; };
  drawSnd();
  const tick = () => { const d = new Date(); clockEl.textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); osClock && (osClock.textContent = clockEl.textContent); };
  let osClock = null; setInterval(tick, 10000);
  let R = null; // renderer bundle
  function buildScene() {
    if (R) return R;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); } catch (e) { sc.append(h('div.hh-fb', {}, 'WebGL unavailable — click anywhere to use the computer')); sc.onclick = () => zoomIn(); R = { fallback: true }; return R; }
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    sc.append(renderer.domElement);
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#000'); scene.fog = new THREE.Fog('#000', 4, 11);
    const cam = new THREE.PerspectiveCamera(38, 1, 0.01, 50);
    const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, metalness: 0.02, ...o });
    const add = (geo, mat, x, y, z, parent = scene, shadow = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m; };
    const BEIGE = M('#d9d0bc', { roughness: 0.6 }), BEIGE2 = M('#c8bea8', { roughness: 0.65 }), DARK = M('#2a2724'), WOOD = M('#4a3322', { roughness: 0.55 });
    // floor + desk
    add(new THREE.PlaneGeometry(30, 30), M('#0d0d0d', { roughness: 1 }), 0, 0, 0, scene, false).rotation.x = -Math.PI / 2;
    add(new RoundedBoxGeometry(2.8, 0.07, 1.3, 2, 0.015), WOOD, 0, 0.735, 0.15);
    for (const [x, z] of [[-1.3, -0.4], [1.3, -0.4], [-1.3, 0.7], [1.3, 0.7]]) add(new THREE.BoxGeometry(0.07, 0.7, 0.07), WOOD, x, 0.35, z);
    // computer case + CRT
    const pc = new THREE.Group(); scene.add(pc);
    add(new RoundedBoxGeometry(1.02, 0.17, 0.82, 2, 0.02), BEIGE2, 0, 0.855, -0.05, pc);
    add(new THREE.BoxGeometry(0.34, 0.012, 0.01), DARK, 0.26, 0.86, 0.366, pc, false); add(new THREE.BoxGeometry(0.34, 0.012, 0.01), DARK, 0.26, 0.82, 0.366, pc, false);
    add(new THREE.BoxGeometry(0.03, 0.03, 0.01), M('#3c8f3c', { emissive: '#2f8f2f', emissiveIntensity: 1.4 }), -0.42, 0.85, 0.366, pc, false);
    add(new THREE.CylinderGeometry(0.2, 0.24, 0.05, 24), BEIGE, 0, 0.965, -0.08, pc);
    const mon = new THREE.Group(); mon.position.set(0, 1.33, -0.1); pc.add(mon);
    add(new RoundedBoxGeometry(0.9, 0.74, 0.5, 3, 0.04), BEIGE, 0, 0, 0, mon);
    const back = add(new THREE.CylinderGeometry(0.36, 0.22, 0.42, 4, 1), BEIGE2, 0, -0.02, -0.42, mon); back.rotation.x = Math.PI / 2; back.rotation.y = Math.PI / 4; back.scale.set(1.25, 1, 1);
    add(new THREE.BoxGeometry(0.76, 0.58, 0.02), M('#14130f', { roughness: 0.4 }), 0, 0.03, 0.245, mon, false);
    add(new THREE.BoxGeometry(0.1, 0.018, 0.01), DARK, 0.3, -0.31, 0.252, mon, false);
    // screen texture
    const scrC = document.createElement('canvas'); scrC.width = 1024; scrC.height = 768; const sg = scrC.getContext('2d');
    const tex = new THREE.CanvasTexture(scrC); tex.colorSpace = THREE.SRGBColorSpace;
    const SW = 0.7, SH = 0.525;
    const screen = add(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), 0, 0.03, 0.257, mon, false); screen.castShadow = false;
    const drawScreen = (t = 0) => { sg.fillStyle = '#008080'; sg.fillRect(0, 0, 1024, 768); const ic = ['My Showcase', 'Oregon Trail', 'Doom', 'Henordle', 'Credits']; ic.forEach((n, i) => { sg.fillStyle = '#c0c0c0'; sg.fillRect(34, 26 + i * 104, 52, 44); sg.fillStyle = '#000080'; sg.fillRect(40, 32 + i * 104, 40, 28); sg.fillStyle = '#fff'; sg.font = '15px Tahoma, Verdana, sans-serif'; sg.textAlign = 'center'; sg.fillText(n, 60, 90 + i * 104); });
      sg.fillStyle = '#c0c0c0'; sg.fillRect(160, 60, 760, 560); sg.fillStyle = '#000080'; sg.fillRect(166, 66, 748, 30); sg.fillStyle = '#fff'; sg.textAlign = 'left'; sg.font = 'bold 17px Tahoma, Verdana, sans-serif'; sg.fillText('Henry Heffernan - Showcase 2022', 176, 87); sg.fillStyle = '#fff'; sg.fillRect(170, 102, 740, 512);
      sg.fillStyle = '#000'; sg.textAlign = 'center'; sg.font = 'bold 62px "Times New Roman", serif'; sg.fillText('Henry Heffernan', 540, 320); sg.font = '28px "Times New Roman", serif'; sg.fillText('Software Engineer', 540, 365); sg.font = 'bold 18px "Times New Roman", serif'; ['HOME', 'ABOUT', 'EXPERIENCE', 'PROJECTS', 'CONTACT'].forEach((n, i) => sg.fillText(n, 300 + i * 120, 430));
      sg.fillStyle = '#c0c0c0'; sg.fillRect(0, 728, 1024, 40); sg.fillStyle = '#fff'; sg.fillRect(0, 728, 1024, 2); sg.fillStyle = '#000'; sg.font = 'bold 18px Tahoma, sans-serif'; sg.textAlign = 'left'; sg.fillText('▣ Start', 12, 755); sg.textAlign = 'right'; sg.font = '16px Tahoma, sans-serif'; sg.fillText(clockEl.textContent || '12:00 PM', 1006, 755);
      sg.fillStyle = 'rgba(0,0,0,.12)'; for (let y = 0; y < 768; y += 3) sg.fillRect(0, y, 1024, 1); const gr = sg.createRadialGradient(512, 384, 200, 512, 384, 700); gr.addColorStop(0, 'rgba(255,255,255,.06)'); gr.addColorStop(1, 'rgba(0,0,0,.45)'); sg.fillStyle = gr; sg.fillRect(0, 0, 1024, 768);
      if (Math.floor(t * 1.2) % 2) { sg.fillStyle = '#000'; sg.fillRect(540 + 2, 440, 12, 3); } tex.needsUpdate = true; };
    // keyboard, mouse, mug, books, papers
    const kb = add(new RoundedBoxGeometry(0.82, 0.035, 0.26, 2, 0.01), BEIGE, -0.05, 0.79, 0.58); kb.rotation.x = 0.05;
    const keyG = new THREE.BoxGeometry(0.042, 0.018, 0.04); const keys = new THREE.InstancedMesh(keyG, M('#e8e1d1', { roughness: 0.5 }), 15 * 5); let ki = 0; const dm = new THREE.Object3D();
    for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) { dm.position.set(-0.05 - 0.36 + c * 0.0515, 0.815, 0.58 - 0.09 + r * 0.047); dm.updateMatrix(); keys.setMatrixAt(ki++, dm.matrix); } keys.castShadow = true; scene.add(keys);
    add(new RoundedBoxGeometry(0.07, 0.03, 0.12, 3, 0.012), BEIGE, 0.55, 0.785, 0.6); add(new THREE.BoxGeometry(0.28, 0.004, 0.23), M('#1a2a4a'), 0.55, 0.771, 0.6, scene, false);
    add(new THREE.CylinderGeometry(0.055, 0.05, 0.12, 24), M('#7a1f1f', { roughness: 0.35 }), -0.85, 0.83, 0.42); const hdl = add(new THREE.TorusGeometry(0.03, 0.009, 8, 16), M('#7a1f1f'), -0.91, 0.83, 0.42); hdl.rotation.y = Math.PI / 2;
    [['#29405e', 0.06], ['#7d6a3a', 0.05], ['#3d5a3a', 0.055]].forEach(([c, hh], i) => { const b = add(new THREE.BoxGeometry(0.34 - i * 0.02, hh, 0.25), M(c), 0.95, 0.77 + 0.03 + i * 0.058, -0.25); b.rotation.y = 0.15 * (i - 1); });
    const pap = add(new THREE.PlaneGeometry(0.22, 0.3), M('#efe9da', { roughness: 0.9 }), -0.75, 0.772, 0.05, scene, false); pap.rotation.set(-Math.PI / 2, 0, 0.25);
    // lights
    scene.add(new THREE.AmbientLight('#8fa3c0', 0.12));
    const spot = new THREE.SpotLight('#ffe6c4', 38, 9, 0.62, 0.65, 1.6); spot.position.set(0.9, 3.4, 1.6); spot.target.position.set(0, 0.8, 0); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0004; scene.add(spot, spot.target);
    const glow = new THREE.PointLight('#5fc8d8', 1.2, 2.2, 1.5); glow.position.set(0, 1.35, 0.6); scene.add(glow);
    const rim = new THREE.DirectionalLight('#6b7fa8', 0.35); rim.position.set(-3, 2, -2); scene.add(rim);
    // camera rig
    const HOME = { pos: new THREE.Vector3(0.72, 1.72, 2.75), look: new THREE.Vector3(0, 1.08, 0) };
    const scrCenter = new THREE.Vector3(); const camPos = HOME.pos.clone(), camLook = HOME.look.clone();
    let mode = 'room', tw = null, ptr = { x: 0, y: 0 }, hover = false, intro = 0;
    const ray = new THREE.Raycaster(), v2 = new THREE.Vector2();
    const zoomPose = () => { screen.getWorldPosition(scrCenter); const a = cam.aspect, half = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)); const d = Math.max((SH / 2) / half, (SW / 2) / (half * a)) * 0.985; return { pos: scrCenter.clone().add(new THREE.Vector3(0, 0, d)), look: scrCenter.clone() }; };
    const resize = () => { const r = sc.getBoundingClientRect(); if (!r.width) return; renderer.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.fov = cam.aspect < 0.8 ? 58 : 38; cam.updateProjectionMatrix(); };
    new ResizeObserver(resize).observe(sc); resize();
    const pick = (e) => { const r = renderer.domElement.getBoundingClientRect(); v2.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(v2, cam); return ray.intersectObject(mon, true).length > 0; };
    renderer.domElement.addEventListener('pointermove', (e) => { const r = renderer.domElement.getBoundingClientRect(); ptr.x = (e.clientX - r.left) / r.width - 0.5; ptr.y = (e.clientY - r.top) / r.height - 0.5; hover = mode === 'room' && pick(e); renderer.domElement.style.cursor = hover ? 'pointer' : 'default'; });
    renderer.domElement.addEventListener('click', (e) => { if (mode === 'room' && pick(e)) zoomIn(); });
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
    const tween = (to, dur) => new Promise((res) => { tw = { fromP: camPos.clone(), fromL: camLook.clone(), to, t0: performance.now(), dur: RM ? 1 : dur, res }; });
    let t = 0, lastT = performance.now(), lastScr = -1;
    const loop = (now) => { const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now; t += dt; intro = Math.min(1, intro + dt / 2.2);
      if (tw) { const p = Math.min(1, (now - tw.t0) / tw.dur), e = ease(p); camPos.lerpVectors(tw.fromP, tw.to.pos, e); camLook.lerpVectors(tw.fromL, tw.to.look, e); if (p >= 1) { const r2 = tw.res; tw = null; r2(); } }
      else if (mode === 'room') { const k = RM ? 0 : 1; const ie = 1 - ease(intro); const tgt = HOME.pos.clone().add(new THREE.Vector3(Math.sin(t * 0.17) * 0.16 * k + ptr.x * 0.35 * k + ie * 1.4, Math.sin(t * 0.13) * 0.05 * k - ptr.y * 0.18 * k + ie * 0.8, Math.cos(t * 0.11) * 0.08 * k + ie * 1.8)); camPos.lerp(tgt, 0.06); camLook.lerp(HOME.look, 0.06); }
      else if (mode === 'zoomed') { const z = zoomPose(); camPos.copy(z.pos); camLook.copy(z.look); }
      cam.position.copy(camPos); cam.lookAt(camLook);
      glow.intensity = 1.1 + Math.sin(t * 7) * 0.04 + (hover ? 0.9 : 0);
      if (Math.floor(t * 1.2) !== lastScr) { lastScr = Math.floor(t * 1.2); drawScreen(t); }
      if (el.isConnected && state !== 'gate' && state !== 'boot') renderer.render(scene, cam); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    R = { renderer, scene, cam, get mode() { return mode; }, set mode(v) { mode = v; }, tween, zoomPose, HOME, camPos, camLook, resetIntro: () => { intro = 0; camPos.copy(HOME.pos).add(new THREE.Vector3(1.4, 0.8, 1.8)); } };
    drawScreen(0); return R;
  }
  // ---------------- OS overlay (HeffernanOS look-alike)
  const os = h('div.hh-os'); el.append(os);
  const exitB = h('button.hh-exit', { onclick: () => zoomOut() }, '← Exit to room (Esc)'); el.append(exitB);
  const ICON = {
    pc: '<svg width="34" height="34" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="4" width="26" height="18" fill="#c0c0c0" stroke="#000"/><rect x="6" y="7" width="20" height="12" fill="#008080"/><rect x="11" y="23" width="10" height="2" fill="#808080"/><rect x="6" y="25" width="20" height="3" fill="#c0c0c0" stroke="#000"/></svg>',
    trail: '<svg width="34" height="34" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="2" y="20" width="28" height="6" fill="#7a5a2a"/><path d="M6 20 Q16 4 26 20Z" fill="#f2f2e6" stroke="#000"/><circle cx="9" cy="26" r="3" fill="#333"/><circle cx="23" cy="26" r="3" fill="#333"/></svg>',
    doom: '<svg width="34" height="34" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="8" width="26" height="16" fill="#8b0000" stroke="#000"/><text x="16" y="21" font-size="10" font-weight="900" text-anchor="middle" fill="#ffcc00" font-family="Impact,sans-serif">DOOM</text></svg>',
    word: '<svg width="34" height="34" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="3" width="8" height="8" fill="#6aaa64"/><rect x="12" y="3" width="8" height="8" fill="#c9b458"/><rect x="21" y="3" width="8" height="8" fill="#787c7e"/><rect x="3" y="12" width="8" height="8" fill="#787c7e"/><rect x="12" y="12" width="8" height="8" fill="#6aaa64"/><rect x="21" y="12" width="8" height="8" fill="#6aaa64"/><rect x="3" y="21" width="26" height="8" fill="#fff" stroke="#000"/></svg>',
    credits: '<svg width="34" height="34" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="7" y="3" width="18" height="26" fill="#fff" stroke="#000"/><path d="M10 9h12M10 13h12M10 17h9M10 21h12" stroke="#000080"/></svg>',
    win: '<svg width="16" height="14" viewBox="0 0 16 14" shape-rendering="crispEdges"><rect x="1" y="1" width="6" height="5" fill="#f00"/><rect x="8" y="1" width="6" height="5" fill="#0a0"/><rect x="1" y="7" width="6" height="5" fill="#00f"/><rect x="8" y="7" width="6" height="5" fill="#fc0"/></svg>',
  };
  const wins = []; let zTop = 10, tbTasks = null, startMenu = null;
  const PAGES = {
    about: ['About', [['Hi, I’m Henry.', 'A software engineer who builds playful, interactive things for the web — like this 3D desk you just zoomed into. (Look-alike placeholder copy.)'], ['Interests', 'Three.js, creative coding, retro computing, music.']]],
    experience: ['Experience', [['Studio A — Software Engineer', 'Placeholder role · front-end + 3D web experiences.'], ['Company B — Engineering Intern', 'Placeholder role · internal tools and UI.'], ['University', 'Placeholder · Computer Science.']]],
    projects: ['Projects', null],
    contact: ['Contact', [['Send a message', 'Name · Email · Message — the real site has a form here.'], ['Elsewhere', 'GitHub · LinkedIn · Resume (placeholders)']]],
  };
  function showcaseBody(page = 'home') {
    const nav = (tag) => h(tag, {}, ...['home', 'about', 'experience', 'projects', 'contact'].map((p) => h('a' + (p === page ? '.on' : ''), { onclick: () => setBody(showcaseBody(p)) }, p)));
    let setBody; const wrap = h('div', { style: { height: '100%' } }); setBody = (n) => { wrap.replaceChildren(n); wrap.dataset.page = n.dataset.page; };
    if (page === 'home') { const n = h('div.hh-sh.home', { 'data-page': 'home' }, h('div', {}, h('h1', {}, 'Henry Heffernan'), h('h2', {}, 'Software Engineer'), nav('nav'))); wrap.append(n); wrap.dataset.page = 'home'; return wrap; }
    const [tt, rows] = PAGES[page];
    const ct = h('div.ct', {}, h('h3', {}, tt), rows ? rows.map(([a, b]) => h('div.row', {}, h('b', {}, a), b)) : h('div.pj', {}, ...['Software', 'Music', 'Art', '3D Desk', 'Games', 'Tools'].map((p) => h('div', { onclick: () => openDialog(p, `“${p}” projects would open here.`) }, h('b', {}, p), h('br'), h('small', {}, 'click to open')))));
    const n = h('div.hh-sh', { 'data-page': page }, h('div.side', {}, h('h1', {}, 'Henry', h('br'), 'Heffernan'), ...nav('div').children), ct); wrap.append(n); wrap.dataset.page = page; return wrap;
  }
  function win(id, title, body, { x, y, w, hh }) {
    const ex = wins.find((o) => o.id === id); if (ex) { ex.el.style.display = ''; focusW(ex); return ex; }
    const bd = h('div.bd', {}, body); const tb = h('div.tb', {}, h('span', {}, title), h('button', { title: 'Minimize', onclick: (e) => { e.stopPropagation(); o.el.style.display = 'none'; drawTasks(); } }, '_'), h('button', { title: 'Maximize', onclick: (e) => { e.stopPropagation(); o.max = !o.max; Object.assign(o.el.style, o.max ? { left: '0', top: '0', width: '100%', height: 'calc(100% - 34px)' } : o.geo); } }, '□'), h('button', { title: 'Close', onclick: (e) => { e.stopPropagation(); closeW(o); } }, '×'));
    const geo = { left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px' };
    const o = { id, title, el: h('div.hh-win', { style: { ...geo }, onpointerdown: () => focusW(o) }, tb, bd), geo, bd };
    drag(tb, { start: (e) => { if (e.target.closest('button') || o.max) return false; o.d = { x: e.clientX, y: e.clientY, l: o.el.offsetLeft, t: o.el.offsetTop }; }, move: (e) => { const r = os.getBoundingClientRect(); o.el.style.left = clamp(o.d.l + e.clientX - o.d.x, -o.el.offsetWidth + 60, r.width - 60) + 'px'; o.el.style.top = clamp(o.d.t + e.clientY - o.d.y, 0, r.height - 60) + 'px'; }, end: () => { o.geo = { ...o.geo, left: o.el.style.left, top: o.el.style.top }; } });
    os.append(o.el); wins.push(o); focusW(o); return o;
  }
  const focusW = (o) => { wins.forEach((x) => x.el.classList.toggle('act', x === o)); o.el.style.zIndex = ++zTop; drawTasks(); };
  const closeW = (o) => { o.el.remove(); wins.splice(wins.indexOf(o), 1); drawTasks(); };
  const geoFor = (fw, fh) => { const r = os.getBoundingClientRect(); const w = Math.min(fw, r.width - 16), hh = Math.min(fh, r.height - 50); return { x: Math.max(8, (r.width - w) / 2 + (wins.length % 4) * 22), y: Math.max(8, (r.height - 34 - hh) / 2 + (wins.length % 4) * 18), w, hh }; };
  function openShowcase() { return win('showcase', 'Henry Heffernan - Showcase 2022', showcaseBody('home'), geoFor(Math.max(560, os.clientWidth * 0.72), Math.max(380, os.clientHeight * 0.76))); }
  function openDialog(title, msg) { return win('dlg-' + title, title, h('div.hh-dlg', {}, h('div.r', {}, h('span', { html: ICON.pc }), h('span', {}, msg)), h('button.hh-bv', { onclick: () => { const o = wins.find((x) => x.id === 'dlg-' + title); o && closeW(o); } }, 'OK')), geoFor(340, 150)); }
  function openHenordle() { const ANS = 'SHELL'; const g = h('div.g'); const rows = []; for (let i = 0; i < 30; i++) g.append(h('i')); let row = 0; const inp = h('input', { maxlength: 5, placeholder: 'type a 5-letter word ⏎', onkeydown: (e) => { if (e.key !== 'Enter') return; const v = inp.value.toUpperCase().replace(/[^A-Z]/g, ''); if (v.length !== 5 || row > 5) return; [...v].forEach((c, i) => { const cell = g.children[row * 5 + i]; cell.textContent = c; cell.className = ANS[i] === c ? 'c' : ANS.includes(c) ? 'p' : 'x'; }); row++; inp.value = ''; if (v === ANS) toast('Henordle solved!'); } }); return win('henordle', 'Henordle', h('div.hh-hn', {}, g, inp), geoFor(260, 360)); }
  const OPEN = { showcase: openShowcase, trail: () => openDialog('Oregon Trail', 'You have died of dysentery. (Game not included in this look-alike.)'), doom: () => openDialog('Doom', 'Loading DOOM.WAD … just kidding — game not bundled.'), henordle: openHenordle, credits: () => openDialog('Credits', 'Original: henryheffernan.com · this is a practice clone.') };
  const ICONS = [['showcase', 'My Showcase', ICON.pc], ['trail', 'Oregon Trail', ICON.trail], ['doom', 'Doom', ICON.doom], ['henordle', 'Henordle', ICON.word], ['credits', 'Credits', ICON.credits]];
  ICONS.forEach(([k, n, svg], i) => { const ic = h('div.hh-ic', { style: { left: '10px', top: 12 + i * 86 + 'px' }, onclick: () => { os.querySelectorAll('.hh-ic').forEach((x) => x.classList.remove('sel')); ic.classList.add('sel'); }, ondblclick: () => { OPEN[k](); click(); } }, h('div', { html: svg }), h('span', {}, n)); ic.dataset.k = k; os.append(ic); });
  osClock = h('span'); tbTasks = h('div', { style: { display: 'flex', gap: '4px', overflow: 'hidden' } });
  const startBtn = h('button.start', { onclick: (e) => { e.stopPropagation(); toggleStart(); } }, h('span', { html: ICON.win }), 'Start');
  os.append(h('div.hh-tbar', {}, startBtn, tbTasks, h('div.tray', {}, h('span', { title: 'Sound', style: { cursor: 'pointer' }, onclick: () => toggleSound() }, '🔈'), osClock)));
  os.addEventListener('pointerdown', (e) => { if (startMenu && !e.target.closest('.hh-sm,.start')) toggleStart(false); if (!e.target.closest('.hh-ic')) os.querySelectorAll('.hh-ic').forEach((x) => x.classList.remove('sel')); if (sound) click(); });
  function toggleStart(v) { const on = v ?? !startMenu; startMenu?.remove(); startMenu = null; startBtn.classList.toggle('on', on); if (!on) return; startMenu = h('div.hh-sm', {}, h('div.side', {}, 'Heffernan', h('b', { style: { color: '#fff' } }, 'OS')), h('div.it', {}, ...[['showcase', '🖥  My Showcase'], ['henordle', '🟩  Henordle'], ['credits', '📄  Credits']].map(([k, t]) => h('button', { onclick: () => { toggleStart(false); OPEN[k](); } }, t)), h('hr'), h('button', { onclick: () => { toggleStart(false); zoomOut(); } }, '⏻  Shut Down…'))); os.append(startMenu); }
  function drawTasks() { tbTasks.replaceChildren(...wins.map((o) => h('button.tk' + (o.el.classList.contains('act') && o.el.style.display !== 'none' ? '.on' : ''), { onclick: () => { if (o.el.style.display === 'none') { o.el.style.display = ''; focusW(o); } else if (o.el.classList.contains('act')) { o.el.style.display = 'none'; o.el.classList.remove('act'); drawTasks(); } else focusW(o); } }, o.title))); }
  // ---------------- sound
  let amb = null;
  function click() { if (!sound) return; blip(1800, 0.03, 'square', 0.04); blip(900, 0.04, 'square', 0.03, 0.03); }
  function toggleSound(v) { sound = v ?? !sound; drawSnd(); const ac = audio(); if (!ac) return; if (sound && !amb) { const len = ac.sampleRate * 2; const buf = ac.createBuffer(1, len, ac.sampleRate); const d = buf.getChannelData(0); let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } const src = ac.createBufferSource(); src.buffer = buf; src.loop = true; const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; const g = ac.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(0.12, ac.currentTime, 0.4); const hum = ac.createOscillator(); hum.frequency.value = 60; const hg = ac.createGain(); hg.gain.value = 0.012; hum.connect(hg).connect(g); src.connect(lp).connect(g).connect(ac.destination); src.start(); hum.start(); amb = { src, hum, g }; }
    else if (!sound && amb) { const a = amb; amb = null; a.g.gain.setTargetAtTime(0, ac.currentTime, 0.15); setTimeout(() => { try { a.src.stop(); a.hum.stop(); } catch {} }, 600); } }
  // ---------------- flow
  const BOOT = [
    ['HHOS(R) Modular BIOS v1.0nb, An Energy Star Ally', 0], ['Copyright (C) 2000-2022, Heffernan Megatrends Inc.', 0], ['', 0], ['HSP S13 2000-2022 Special UC131S', 0], ['', 0],
    ['HSP Showcase(tm) XX 113', 120], ['Checking RAM : 14000 MB ........ OK', 260], ['', 0], ['Press DEL to enter SETUP', 160], ['', 0],
    ['Detecting Primary Master   ... WebGL Renderer', 200], ['Detecting Primary Slave    ... three.js', 160], ['Detecting Secondary Master ... Audio Context', 160], ['', 0],
  ];
  const ASSETS = ['textures/desk_wood.jpg', 'textures/crt_bezel.png', 'models/computer.glb', 'models/keyboard.glb', 'models/mug.glb', 'models/books.glb', 'audio/office_ambience.mp3', 'audio/keyboard_clicks.mp3', 'audio/startup.mp3', 'os/heffernan_os.html', 'fonts/ms_sans_serif.woff'];
  let runId = 0;
  async function start() {
    if (state !== 'gate') return; state = 'boot'; const my = ++runId; click();
    gate.style.opacity = '0'; await sleep(RM ? 0 : 250 / speed); gate.style.display = 'none';
    boot.style.display = ''; boot.style.opacity = '1'; boot.textContent = '';
    boot.append(h('div.es', {}, h('b', {}, 'HHOS'), 'energy', h('br'), 'ally'));
    const log = h('div'); boot.append(log);
    const line = (t) => { log.append(t + '\n'); };
    buildScene();
    for (const [t, d] of BOOT) { if (my !== runId) return; line(t); await sleep(d / speed); }
    const bar = h('span.bar'); const lab = h('span'); log.append(lab, '\n', bar, '\n');
    for (let i = 0; i < ASSETS.length; i++) { if (my !== runId) return; const p = Math.round(((i + 1) / ASSETS.length) * 100); lab.textContent = `Loading assets: ${ASSETS[i]} (${i + 1}/${ASSETS.length})`; bar.textContent = '[' + '#'.repeat(Math.round(p / 3.4)) + '.'.repeat(30 - Math.round(p / 3.4)) + `] ${p}%`; await sleep(110 / speed); }
    line(''); line("All Content Loaded, launching 'Henry Heffernan Portfolio Showcase' V2.0"); await sleep(700 / speed); if (my !== runId) return;
    boot.style.opacity = '0'; state = 'room'; tick(); R?.resetIntro?.(); sc.classList.add('on'); await sleep(RM ? 0 : 600 / speed); boot.style.display = 'none'; hud.style.opacity = '1';
  }
  async function zoomIn() {
    if (state !== 'room') return; state = 'zooming'; hud.style.opacity = '0'; click();
    if (sound) { blip(220, 0.5, 'sine', 0.05); }
    if (R && !R.fallback) { await R.tween(R.zoomPose(), 1500 / speed); R.mode = 'zoomed'; }
    state = 'os'; el.classList.add('os'); if (!wins.length) openShowcase();
  }
  async function zoomOut() {
    if (state !== 'os') return; state = 'zooming'; toggleStart(false); el.classList.remove('os'); await sleep(RM ? 0 : 250 / speed);
    if (R && !R.fallback) { R.mode = 'room'; await R.tween({ pos: R.HOME.pos.clone(), look: R.HOME.look.clone() }, 1300 / speed); }
    state = 'room'; hud.style.opacity = '1';
  }
  addEventListener('keydown', (e) => { if (e.key === 'Escape') zoomOut(); if ((e.key === 'Enter' || e.key === ' ') && state === 'gate' && document.activeElement === document.body) start(); });
  function reset() { runId++; state = 'gate'; el.classList.remove('os'); wins.slice().forEach(closeW); toggleStart(false); hud.style.opacity = '0'; sc.classList.remove('on'); boot.style.display = 'none'; gate.style.display = ''; gate.style.opacity = '1'; if (R && !R.fallback) { R.mode = 'room'; R.camPos.copy(R.HOME.pos); R.camLook.copy(R.HOME.look); } if (sound) toggleSound(false); }
  window.__hh = { start, zoomIn, zoomOut, reset, get state() { return state; } };
  window.__demoProof = async () => {
    const o = []; speed = 8;
    reset(); await start(); o.push(`gate→boot→${state} webgl=${!!(R && !R.fallback)}`);
    await sleep(150); toggleSound(true); o.push(`sound=${sound}`);
    await zoomIn(); o.push(`zoom→${state} osVisible=${el.classList.contains('os')} windows=${wins.length}`);
    const sw = wins.find((w) => w.id === 'showcase'); sw.bd.querySelector('a:nth-child(4)')?.click(); o.push(`showcase page=${sw.bd.firstChild.dataset.page}`);
    toggleStart(true); o.push(`startmenu=${!!startMenu}`); toggleStart(false);
    OPEN.henordle(); const inp = os.querySelector('.hh-hn input'); inp.value = 'shelf'; inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); o.push(`henordle row1=${[...os.querySelectorAll('.hh-hn .g i')].slice(0, 5).map((i) => i.className).join('')}`);
    const l0 = sw.el.offsetLeft; const tsp = sw.el.querySelector('.tb span'); fire(tsp, 'pointerdown', 20, 10); for (const [x, y] of [[60, 30], [120, 40]]) { fire(tsp, 'pointermove', x, y); await sleep(10); } fire(tsp, 'pointerup', 120, 40); o.push(`drag dx=${sw.el.offsetLeft - l0}`);
    await zoomOut(); o.push(`exit→${state}`);
    toggleSound(false); reset(); speed = 1; o.push(`restored state=${state} windows=${wins.length} sound=${sound}`);
    return o.join('; ');
  };
};

export function mount(root, variant, opts, T) { (V[variant] || V['3d-blob-param-mixer'])(root, T); }
