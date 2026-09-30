# SKILL (draft): Maintain the UX Technique Gallery

**Use when:** new techniques land in the UX daily ledger and each one needs a faithful, interactive look-alike subpage, screenshots, a report and a deployment.

## Inputs / paths
- Ledger: `/home/box/agent-data/agents/76ff2f7d-ccdd-4eea-8f51-f49812542a5d/ux-daily-ledger.json`
- Briefings (checkpoints): `/workspace/briefings`, `/workspace/ux-briefing`
- Project: `/workspace/ux-technique-gallery` (GitHub `wjb127/ux-technique-gallery`, Vercel `seungbeen-wis-projects/ux-technique-gallery`)
- Tools: `gh` (authed wjb127), Vercel CLI `/home/box/.local/bin/vercel` (authed wjb127), Playwright Chromium, Python PIL, poppler.

## Procedure
1. `node scripts/sync.mjs --no-deploy --no-push` — extracts, dedups (first appearance wins; slug = id minus `clone-`), assigns new slugs to an engine by keyword heuristic, captures ref screenshots, derives palettes, builds.
2. For each new slug, **view its ref screenshot** (`report/ref/<slug>.png`) and add a `V['<slug>']` variant in `src/engines/<engine>.js`:
   - `export function mount(root, variant, opts, T)`; call `theme(root, T, { bg, fg, ac, dark })` first.
   - Reproduce the ref's main screen: layout, colour, typography, chrome (nav bars, panels) and the **core interaction** from the checkpoints. Use Korean/English copy as fits the user.
   - Never set `root.style.position` (root is `position:fixed`); use `root.classList.add('scroll')` for scrolling pages.
   - Define `window.__demoProof = async () => '<what was proven>'` that exercises the interaction **and restores the default state** (the screenshot is taken after it runs).
3. `npx vite build && node scripts/shoot.mjs impl http://localhost:4173 --only=<slugs> && python3 scripts/compare.py <engine>`; look at the contact sheet, tweak until it matches the ref at a glance.
4. Publish: `git push` (auto-deploys), confirm with `vercel ls ux-technique-gallery --scope seungbeen-wis-projects` or curl 200.
5. Shoot from live: `node scripts/shoot.mjs impl https://ux-technique-gallery.vercel.app`, then `node scripts/report.mjs`.
6. Commit/push screenshots + report. Do not write into `report/review/` (owned by the independent reviewer); the report picks it up automatically.

## Gotchas
- WebGL refs (e.g. bruno-simon.com) may render blank headless; bot-verification pages (shapedivider, tennessine, canvascodegenerator) and 404s (configure.zsa.io) must be flagged in `scripts/report.mjs` `FLAGS`.
- `h()` sets textarea `value` as a property; `drag()` tolerates missing pointer capture.
- `noise2(seed)` returns a function `(x, y) => 0..1`.
- `.vercelignore` excludes `report/` so deploys stay small.

## Delivery checklist
Prod URL, repo URL, total/built/coverage %, failures + flags, PDF path, SKILL path, auth status, times in KST.
