// Shared tiny helpers for all demo engines (no framework).
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export function h(tag, attrs = {}, ...kids) {
  const [t, ...cls] = tag.split('.');
  const e = document.createElement(t || 'div');
  if (cls.length) e.className = cls.join(' ');
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') e.innerHTML = v;
    else if (k in e && k !== 'list' && typeof v !== 'string') e[k] = v;
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(9)) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(String(k)));
  return e;
}
export const svgNS = 'http://www.w3.org/2000/svg';
export function s(tag, attrs = {}, ...kids) {
  const e = document.createElementNS(svgNS, tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null) continue;
    if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v); else e.setAttribute(k, v);
  }
  for (const k of kids.flat(9)) if (k != null) e.append(k.nodeType ? k : document.createTextNode(String(k)));
  return e;
}
export function css(text) { const st = document.createElement('style'); st.textContent = text; document.head.append(st); return st; }
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export function rng(seed = 1) { let x = seed >>> 0 || 1; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296); }
export const pick = (arr, r = Math.random) => arr[Math.floor(r() * arr.length)];
export function toast(msg, root = document.body) {
  let t = document.querySelector('.tg-toast');
  if (!t) { t = h('div.tg-toast'); document.body.append(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 1600);
}
export async function copy(text, label = 'Copied') { try { await navigator.clipboard.writeText(text); } catch {} toast(`${label} ✓`); }
export function drag(el, { start, move, end } = {}) {
  el.addEventListener('pointerdown', (e) => {
    if (e.button && e.button !== 0) return;
    const r = start?.(e); if (r === false) return;
    el.setPointerCapture?.(e.pointerId);
    const mv = (ev) => move?.(ev, e); const up = (ev) => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); end?.(ev); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up);
  });
}
export function localPos(e, el) { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height }; }
// ---- color
export function hexToRgb(hex) { hex = hex.replace('#', ''); if (hex.length === 3) hex = [...hex].map((c) => c + c).join(''); const n = parseInt(hex, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export const rgbToHex = (r, g, b) => '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
export function hsl(hh, ss, ll) { ss /= 100; ll /= 100; const k = (n) => (n + hh / 30) % 12; const a = ss * Math.min(ll, 1 - ll); const f = (n) => ll - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return rgbToHex(255 * f(0), 255 * f(8), 255 * f(4)); }
export function rgbToHsl(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let hh = 0, ss = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; ss = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; } return [hh, ss * 100, l * 100]; }
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
export function oklchToHex(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s2 = s_ ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2, g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2, bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s2;
  return rgbToHex(255 * gam(clamp(r, 0, 1)), 255 * gam(clamp(g, 0, 1)), 255 * gam(clamp(bb, 0, 1)));
}
export function hexToOklch(hex) {
  const [R, G, B] = hexToRgb(hex).map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s2 = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s2, a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s2, b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s2;
  return [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
}
export function luminance(hex) { const [r, g, b] = hexToRgb(hex).map((v) => lin(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
export function contrast(a, b) { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }
export const randHex = () => hsl(Math.random() * 360, 40 + Math.random() * 50, 35 + Math.random() * 40);
// ---- audio (lazy, gesture-safe)
let AC;
export function audio() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch { AC = null; } } if (AC?.state === 'suspended') AC.resume(); return AC; }
export function blip(freq = 440, dur = 0.18, type = 'sine', vol = 0.15, when = 0) {
  const ac = audio(); if (!ac) return; const t = ac.currentTime + when; const o = ac.createOscillator(); const g = ac.createGain();
  o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.05);
}
export function drum(kind = 'kick', when = 0) {
  const ac = audio(); if (!ac) return; const t = ac.currentTime + when; const g = ac.createGain(); g.connect(ac.destination);
  if (kind === 'kick') { const o = ac.createOscillator(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3); o.connect(g); o.start(t); o.stop(t + 0.3); return; }
  const len = kind === 'hat' ? 0.05 : 0.18; const buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = ac.createBufferSource(); src.buffer = buf; const f = ac.createBiquadFilter(); f.type = kind === 'hat' ? 'highpass' : 'bandpass'; f.frequency.value = kind === 'hat' ? 7000 : 1800;
  g.gain.value = kind === 'hat' ? 0.2 : 0.35; src.connect(f).connect(g); src.start(t);
}
export const midi = (n) => 440 * 2 ** ((n - 69) / 12);
export const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
// ---- canvas
export function canvas(parent, w, h2, cls = '') {
  const c = h('canvas' + (cls ? '.' + cls : '')); const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = w * dpr; c.height = h2 * dpr; c.style.width = w + 'px'; c.style.height = h2 + 'px'; const g = c.getContext('2d'); g.scale(dpr, dpr); parent?.append(c); c.g = g; c.W = w; c.H = h2; return c;
}
export function fitCanvas(c, parent) {
  const r = parent.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1);
  c.width = Math.max(1, r.width * dpr); c.height = Math.max(1, r.height * dpr); c.style.width = r.width + 'px'; c.style.height = r.height + 'px';
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); c.g = g; c.W = r.width; c.H = r.height; return c;
}
export function noise2(seed = 7) { // value noise
  const R = rng(seed); const p = Array.from({ length: 512 }, () => R());
  const f = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; const hsh = (a, b) => p[((a * 73856093) ^ (b * 19349663)) & 511]; const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return lerp(lerp(hsh(xi, yi), hsh(xi + 1, yi), u), lerp(hsh(xi, yi + 1), hsh(xi + 1, yi + 1), u), v); };
  return (x, y) => f(x, y) * 0.6 + f(x * 2.1, y * 2.1) * 0.3 + f(x * 4.3, y * 4.3) * 0.1;
}
// simulate pointer gestures (used by __demoProof hooks to prove interactions in screenshots)
export function fire(el, type, x, y, extra = {}) {
  const r = el.getBoundingClientRect();
  const ev = new PointerEvent(type, { bubbles: true, cancelable: true, clientX: r.left + x, clientY: r.top + y, pointerId: 1, pointerType: 'mouse', button: 0, buttons: type === 'pointerup' ? 0 : 1, ...extra });
  el.dispatchEvent(ev);
  const mt = { pointerdown: 'mousedown', pointermove: 'mousemove', pointerup: 'mouseup' }[type];
  if (mt && extra.mouse) el.dispatchEvent(new MouseEvent(mt, { bubbles: true, clientX: r.left + x, clientY: r.top + y, buttons: 1 }));
}
export async function gesture(el, pts, delay = 8) {
  fire(el, 'pointerdown', pts[0][0], pts[0][1]);
  for (const [x, y] of pts.slice(1)) { fire(el, 'pointermove', x, y); if (delay) await new Promise((r) => setTimeout(r, delay)); }
  fire(el, 'pointerup', ...pts[pts.length - 1]);
}
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export function wave(n, fn) { return Array.from({ length: n }, (_, i) => fn(i / (n - 1), i)); }
