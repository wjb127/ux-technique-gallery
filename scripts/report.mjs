// Builds report/manifest.json and report/ux-technique-gallery-report.pdf
// Usage: node scripts/report.mjs [prodUrl]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
const PROD = process.argv[2] || 'https://ux-technique-gallery.vercel.app';
const REPO = 'https://github.com/wjb127/ux-technique-gallery';
const T = JSON.parse(fs.readFileSync('data/techniques.json', 'utf8'));
const ref = fs.existsSync('report/ref-status.json') ? JSON.parse(fs.readFileSync('report/ref-status.json', 'utf8')) : {};
const impl = fs.existsSync('report/impl-status.json') ? JSON.parse(fs.readFileSync('report/impl-status.json', 'utf8')) : {};
// Optional independent review results (written by a separate reviewer; read-only here)
const RV = 'report/review';
const reviewSummary = fs.existsSync(`${RV}/summary.json`) ? JSON.parse(fs.readFileSync(`${RV}/summary.json`, 'utf8')) : null;
const reviewOf = (slug) => { let r = null; const f = `${RV}/${slug}.json`; if (fs.existsSync(f)) { try { r = JSON.parse(fs.readFileSync(f, 'utf8')); } catch {} }
  if (!r && reviewSummary) { const arr = Array.isArray(reviewSummary) ? reviewSummary : reviewSummary.items || reviewSummary.results || reviewSummary.pages || null; if (Array.isArray(arr)) r = arr.find((x) => x.slug === slug) || null; else if (reviewSummary[slug]) r = reviewSummary[slug]; }
  if (!r) return null; const score = r.score ?? r.similarity ?? r.overall ?? r.total ?? null; const pass = r.pass ?? r.passed ?? (r.verdict ? /pass/i.test(r.verdict) : score != null ? score >= 90 : null);
  return { score, pass, verdict: r.verdict || null, notes: r.notes || r.summary || r.reason || (Array.isArray(r.issues) ? r.issues.join('; ') : null) }; };
const FLAGS = {
  '3d-drivable-portfolio-world': 'Reference (bruno-simon.com) failed to render in headless capture (blank WebGL); comparison must use the live site manually.',
  'shapedivider-preview-export': 'Reference screenshot shows a bot-verification interstitial, not the app.',
  'heraldic-flag-canvas-desk': 'Reference screenshot shows a bot-verification interstitial, not the app.',
  'canvas-fx-param-export': 'Reference screenshot shows a bot-verification interstitial, not the app.',
  'hardware-keymap-layer-configurator': 'Reference (Oryx / configure.zsa.io) returned 404 page at capture time.',
  'isometric-island-hotbar-builder': 'Reference screenshot shows only a start/modal screen, not gameplay.',
  'styled-qr-param-studio': 'QR output is decorative (styled module pattern), not a spec-compliant scannable encoder.',
};
const manifest = T.map((t) => { const r = ref[t.slug] || {}; const i = impl[t.slug] || {}; return { slug: t.slug, name: t.name, date: t.date || null, slot: t.slot || null, engine: t.engine, refUrl: t.url || null, subpageUrl: `${PROD}/t/${t.slug}/`, checkpoints: t.checkpoints || [], refShot: t.url && fs.existsSync(`report/ref/${t.slug}.png`) ? `report/ref/${t.slug}.png` : null, implShot: fs.existsSync(`report/impl/${t.slug}.png`) ? `report/impl/${t.slug}.png` : null, refOk: t.url ? !!r.ok : null, implOk: !!i.ok, implProof: i.proof || null, implErrors: i.errors || [], flag: FLAGS[t.slug] || (t.url && r.ok === false ? 'Reference capture failed' : null), foundational: !t.url, review: reviewOf(t.slug) }; });
fs.writeFileSync('report/manifest.json', JSON.stringify({ generatedAt: new Date().toISOString(), prodUrl: PROD, repoUrl: REPO, total: manifest.length, items: manifest }, null, 1));
// JPEG thumbnails for the PDF
const J = '/tmp/report-jpg'; fs.mkdirSync(J, { recursive: true });
execFileSync('python3', ['-c', `
import os,sys
from PIL import Image
for d in ('ref','impl'):
  os.makedirs('${J}/'+d, exist_ok=True)
  for f in os.listdir('report/'+d):
    if not f.endswith('.png'): continue
    o='${J}/'+d+'/'+f[:-4]+'.jpg'
    if os.path.exists(o) and os.path.getmtime(o)>os.path.getmtime('report/'+d+'/'+f): continue
    im=Image.open('report/'+d+'/'+f).convert('RGB'); im.thumbnail((1100,700)); im.save(o,'JPEG',quality=72)
`]);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const kst = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false }) + ' KST';
const dates = manifest.map((m) => m.date).filter(Boolean).sort();
const okN = manifest.filter((m) => m.implOk).length; const cov = ((okN / manifest.length) * 100).toFixed(1);
const img = (p) => (p ? `<img src="file://${path.resolve(J, p.replace('report/', '').replace('.png', '.jpg'))}">` : '<div class="noimg">No reference (foundational principle)</div>');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:A4;margin:12mm}body{font:10px/1.45 'Noto Sans KR','Noto Sans CJK KR',sans-serif;color:#1d2330}
h1{font-size:30px;margin:0 0 8px}.cover{height:260mm;display:flex;flex-direction:column;justify-content:center}
.kv{font-size:13px;line-height:2}table{width:100%;border-collapse:collapse;font-size:8.5px}td,th{border-bottom:1px solid #e5e7eb;padding:3px 4px;text-align:left;vertical-align:top}
.sec{page-break-before:always}.sec h2{font-size:14px;margin:0 0 4px}.meta{color:#555;margin-bottom:4px;word-break:break-all}.flag{background:#fff4ce;padding:4px 6px;margin:4px 0;border-radius:4px}
.imgs{display:grid;gap:4mm}.imgs figure{margin:0}.imgs img{width:170mm;border:1px solid #ddd}.imgs figcaption{font-weight:700;margin-bottom:2px}.noimg{width:170mm;height:40mm;display:grid;place-items:center;background:#f3f4f6;color:#888}
ul{margin:2px 0 4px 14px;padding:0}.ok{color:#137333}.bad{color:#b3261e}
</style></head><body>
<div class="cover"><div style="font-size:12px;letter-spacing:.2em;color:#666">UX DAILY LEDGER</div><h1>UX Technique Gallery — Build Report</h1>
<div class="kv">Techniques: <b>${manifest.length}</b> (${manifest.filter((m) => m.refUrl).length} with reference URL · ${manifest.filter((m) => !m.refUrl).length} foundational)<br>
Briefing range: <b>${dates[0]} → ${dates[dates.length - 1]}</b><br>Pages passing smoke check: <b>${okN}/${manifest.length} (${cov}%)</b><br>
Production: <b>${PROD}</b><br>Repository: <b>${REPO}</b><br>Generated: ${kst}</div>
<p style="max-width:150mm;color:#555">Each section shows the reference site's main screen (captured headless at 1440×900) above the gallery subpage (captured from the production URL after running the page's demo proof hook). ${reviewSummary ? `Independent review results (report/review/) are included: ${manifest.filter((m) => m.review?.pass).length}/${manifest.filter((m) => m.review).length} reviewed pages pass.` : 'Similarity review is performed separately; its results are included automatically when report/review/summary.json exists.'}</p></div>
<div class="sec"><h2>Coverage</h2><table><tr><th>#</th><th>Technique</th><th>Date</th><th>Subpage</th><th>Ref</th><th>Impl</th><th>Review</th></tr>
${manifest.map((m, i) => `<tr><td>${i + 1}</td><td>${esc(m.slug)}</td><td>${m.date || '—'}</td><td>/t/${esc(m.slug)}/</td><td>${m.refUrl ? (m.refOk && !m.flag ? '✓' : '⚠') : '—'}</td><td class="${m.implOk ? 'ok' : 'bad'}">${m.implOk ? '✓' : '✗'}</td><td>${m.review ? `${m.review.score ?? ''}${m.review.pass === true ? ' ✓' : m.review.pass === false ? ' ✗' : ''}` : '—'}</td></tr>`).join('')}</table></div>
${manifest.map((m, i) => `<div class="sec"><h2>${i + 1}. ${esc(m.slug)}</h2><div class="meta">${esc(m.name)}<br>${m.date || 'foundational'} ${m.slot || ''} · engine: ${m.engine} · ref: ${esc(m.refUrl || '—')}<br>subpage: ${esc(m.subpageUrl)}</div>
${m.review ? `<div class="flag" style="background:${m.review.pass ? '#e6f4ea' : '#fdecea'}">Review: ${esc(m.review.score ?? '')} ${m.review.pass ? 'PASS' : m.review.pass === false ? 'FAIL' : ''} ${esc(m.review.verdict || '')} — ${esc(m.review.notes || '')}</div>` : ''}${m.flag ? `<div class="flag">⚠ ${esc(m.flag)}</div>` : ''}${m.checkpoints.length ? `<ul>${m.checkpoints.slice(0, 6).map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
<div class="imgs"><figure><figcaption>Reference</figcaption>${img(m.refShot)}</figure><figure><figcaption>Implementation <span class="${m.implOk ? 'ok' : 'bad'}">${m.implOk ? '✓' : '✗'}</span> <span style="font-weight:400;color:#666">${esc(m.implProof || '')}</span></figcaption>${img(m.implShot)}</figure></div></div>`).join('')}
</body></html>`;
fs.writeFileSync('/tmp/report.html', html);
const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file:///tmp/report.html', { waitUntil: 'load', timeout: 180000 });
await p.pdf({ path: 'report/ux-technique-gallery-report.pdf', format: 'A4', printBackground: true, timeout: 300000 }); await b.close();
console.log('manifest', manifest.length, 'ok', okN, 'coverage', cov + '%', 'pdf', fs.statSync('report/ux-technique-gallery-report.pdf').size);
