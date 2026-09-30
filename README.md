# UX Technique Gallery

One website with a live, interactive subpage for every technique in the UX daily ledger.

- **Live:** https://ux-technique-gallery.vercel.app (subpages: `/t/<slug>/`)
- **Repo:** https://github.com/wjb127/ux-technique-gallery (push to `main` → Vercel auto-deploys, project `seungbeen-wis-projects/ux-technique-gallery`)
- **Report:** `report/ux-technique-gallery-report.pdf`, `report/manifest.json`

## Data
| Path | What |
|---|---|
| `/home/box/agent-data/agents/76ff2f7d-…/ux-daily-ledger.json` | source ledger (override with `UX_LEDGER`) |
| `/workspace/briefings`, `/workspace/ux-briefing` | briefing markdown → checkpoints (override with `UX_BRIEF_DIRS`) |
| `data/ledger-techniques.json` | extracted techniques (`scripts/extract.mjs`) |
| `data/assign.json` | engine → slugs |
| `data/ref-palettes.json` | colour theme per slug from its ref screenshot (`scripts/palette.py`) |
| `data/techniques.json` | final registry (`scripts/gen-pages.mjs`) |

**Dedup rule:** a technique id appears once; the first appearance (earliest briefing date/slot) wins. `slug = id` with the `clone-` prefix removed.

## Architecture
Vite 5 multi-page app. `scripts/gen-pages.mjs` writes `t/<slug>/index.html` (gitignored; regenerated on every build).
`src/page.js` loads `src/engines/<engine>.js` and calls `mount(root, variant, opts, T)`.
Shared helpers: `src/lib.js` (DOM `h()/s()`, drag, colour, audio, noise, canvas) and `src/kit.js` (theme, slider, seg, select, btn, toggle…).

Engines: gradient, paint, seq, nodes, palette, cssfx, svggen, imagefx, type, pixel, sim, gen, code, globe, chart, puzzle, audio, desk, three, saas, ux.

## Commands
```bash
npm run build                                   # gen pages + vite build → dist/
npx vite preview --port 4173                    # local preview
node scripts/shoot.mjs ref  [--only=a,b] [--missing]          # reference screenshots → report/ref/
node scripts/shoot.mjs impl <baseUrl> [--only=a,b]            # page screenshots → report/impl/ + impl-status.json
python3 scripts/compare.py <engine>             # side-by-side ref|impl contact sheets → /tmp/cmp-<engine>-N.jpg
node scripts/report.mjs [prodUrl]               # manifest.json + PDF (includes report/review/* if present)
node scripts/sync.mjs [--no-deploy] [--no-push] [--skip-ref] [--only-new]   # full pipeline for new ledger entries
```

## Verification
An impl page counts as OK when HTTP 200, `#demo` has >3 nodes after `window.__demoProof()` runs, and there are no page errors.
