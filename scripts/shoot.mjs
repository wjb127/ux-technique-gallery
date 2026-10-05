// Usage: node scripts/shoot.mjs ref|impl [baseUrl] [--only slug,slug] [--missing]
// ref  -> screenshots each original reference URL to report/ref/<slug>.png
// impl -> screenshots <baseUrl>/t/<slug>/ (after running the page's window.__demoProof())
import fs from 'node:fs';
import { chromium } from 'playwright';
const [mode = 'impl', base = 'http://localhost:4173'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg ? onlyArg.slice(7).split(',') : null;
const missing = process.argv.includes('--missing');
const list = JSON.parse(fs.readFileSync(mode === 'ref' ? 'data/ledger-techniques.json' : 'data/techniques.json', 'utf8'));
const outDir = `report/${mode}`; fs.mkdirSync(outDir, { recursive: true });
const statusFile = `report/${mode}-status.json`;
const status = fs.existsSync(statusFile) ? JSON.parse(fs.readFileSync(statusFile, 'utf8')) : {};
let jobs = list.filter((t) => (!only || only.includes(t.slug)) && (mode !== 'ref' || t.url));
if (missing) jobs = jobs.filter((t) => !fs.existsSync(`${outDir}/${t.slug}.png`));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'ko-KR', timezoneId: 'Asia/Seoul' });
async function one(t) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e)));
  const url = mode === 'ref' ? t.url : `${base}/t/${t.slug}/`;
  const rec = { url, ok: false, at: new Date().toISOString() };
  try {
    const r = await page.goto(url, { waitUntil: 'load', timeout: 35000 }).catch((e) => { rec.navError = String(e.message).slice(0, 160); return null; });
    rec.http = r ? r.status() : null;
    await page.waitForTimeout(mode === 'ref' ? +(process.env.REF_WAIT || 4000) : 900);
    if (mode === 'impl') {
      rec.proof = await page.evaluate(async () => (window.__demoProof ? await window.__demoProof() : 'no-proof-hook')).catch((e) => 'proof-error: ' + e.message);
      await page.waitForTimeout(500);
      rec.demoNodes = await page.evaluate(() => document.querySelector('#demo')?.querySelectorAll('*').length || 0);
    }
    await page.screenshot({ path: `${outDir}/${t.slug}.png`, timeout: 20000 });
    rec.ok = mode === 'ref' ? (rec.http != null && rec.http < 400) : (rec.http === 200 && rec.demoNodes > 3 && !errors.length);
  } catch (e) { rec.error = String(e.message).slice(0, 200); }
  rec.errors = errors.slice(0, 3);
  status[t.slug] = rec; await page.close();
  process.stdout.write(`${rec.ok ? 'OK ' : 'ERR'} ${t.slug} ${rec.http ?? ''} ${rec.error || rec.navError || errors[0] || ''}\n`);
}
const N = Number(process.env.CONC || 6);
let i = 0;
await Promise.all(Array.from({ length: N }, async () => { while (i < jobs.length) await one(jobs[i++]); }));
fs.writeFileSync(statusFile, JSON.stringify(status, null, 1));
await browser.close();
console.log('done', jobs.length);
