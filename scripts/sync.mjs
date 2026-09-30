// End-to-end sync: pick up new ledger techniques, build, shoot, report, publish.
// Usage: node scripts/sync.mjs [--no-deploy] [--no-push] [--skip-ref]
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const PROD = 'https://ux-technique-gallery.vercel.app';
const args = new Set(process.argv.slice(2));
const run = (c) => { console.log('$ ' + c); execSync(c, { stdio: 'inherit', env: { ...process.env, PATH: `/home/box/.local/bin:${process.env.PATH}` } }); };
// 1. extract ledger + briefings -> data/ledger-techniques.json
run('node scripts/extract.mjs');
const led = JSON.parse(fs.readFileSync('data/ledger-techniques.json', 'utf8'));
const assign = JSON.parse(fs.readFileSync('data/assign.json', 'utf8'));
const known = new Set(Object.values(assign).flat());
const fresh = led.filter((t) => !known.has(t.slug));
// 2. scaffold: keyword -> engine heuristic (first match wins). Engines fall back to a generic variant until a V[slug] is written.
const RULES = [['ux', (t) => t.lens === 'foundational-principle' || !t.id.startsWith('clone-')], ['gradient', /gradient|mesh grad/i], ['palette', /palette|colou?r|hue|contrast/i], ['audio', /synth|audio|music|sound|piano|melody|instrument|radio|beat|drum|ambient/i], ['seq', /sequencer|step|pattern/i], ['nodes', /node|graph|patch|circuit|logic|flow/i], ['type', /font|type|glyph|kerning|letter/i], ['pixel', /pixel|tile|ascii|keymap|sprite|voxel art/i], ['globe', /map|globe|earth|star|orbit|planet/i], ['saas', /pricing|checkout|wallet|booking|calendar|palette launcher|command|deck|doc|mosaic|explainer|scroll/i], ['cssfx', /css|clip|shadow|glass|neumorph|radius|bezier|easing/i], ['svggen', /svg|wave|blob|shape|qr|icon|avatar|pattern/i], ['imagefx', /photo|image|dither|duotone|mockup|screenshot/i], ['puzzle', /puzzle|game|level|quiz/i], ['code', /code|repl|editor|regex|shader/i], ['three', /3d|mesh|origami|isometric|gltf/i], ['desk', /desktop|\bos\b|win9|retro|winamp/i], ['sim', /sim|sand|fluid|diffusion|physics|particle/i], ['chart', /chart|timeline|data|scrub/i], ['gen', /generat|procedural|noise|flow field/i], ['paint', /paint|brush|draw|sketch|canvas/i]];
for (const t of fresh) { const hit = RULES.find(([, r]) => (typeof r === 'function' ? r(t) : r.test(`${t.name} ${t.slug}`))); const e = hit ? hit[0] : 'gen'; (assign[e] ||= []).push(t.slug); console.log(`+ ${t.slug} -> ${e}`); }
fs.writeFileSync('data/assign.json', JSON.stringify(assign, null, 1));
const freshSlugs = fresh.map((t) => t.slug).join(',');
// 3. reference shots + palettes for new techniques
if (!args.has('--skip-ref') && fresh.some((t) => t.url)) { run(`node scripts/shoot.mjs ref --only=${fresh.filter((t) => t.url).map((t) => t.slug).join(',')}`); run('python3 scripts/palette.py'); }
// 4. build (gen-pages + vite)
run('npm run build');
// 5. publish: push to main (Vercel Git integration auto-deploys); optional explicit prod deploy
if (!args.has('--no-push')) { run('git add -A'); try { run(`git commit -m "sync: ${fresh.length} new technique(s) ${new Date().toISOString().slice(0, 10)}"`); } catch { console.log('nothing to commit'); } run('git push'); }
if (!args.has('--no-deploy')) run('vercel --prod --yes');
// 6. impl shots from live URL (all, or only new with --only-new) + report
run(`node scripts/shoot.mjs impl ${PROD}${args.has('--only-new') && freshSlugs ? ' --only=' + freshSlugs : ''}`);
run(`node scripts/report.mjs ${PROD}`);
if (!args.has('--no-push')) { run('git add -A'); try { run('git commit -m "sync: screenshots + report"'); run('git push'); } catch { console.log('nothing to commit'); } }
console.log(`done. new: ${fresh.length}${fresh.length ? ' (' + freshSlugs + ') — write faithful V[slug] variants in src/engines/<engine>.js' : ''}`);
