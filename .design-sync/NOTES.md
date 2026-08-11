# design-sync notes — Aiaru Site DS

## Setup

- Source package: `ds/` (`@aiaru/site-ds`), a hand-built React+TS component library extracted from the static site's own markup/CSS specifically so design-sync had something to ingest — the live site (`index.html` etc.) is plain HTML/CSS/JS and was not touched.
- Build: `cd ds && npm run build` (tsup, esbuild-based). Converter entry: `./ds/dist/index.js`. `--node-modules ./ds/node_modules`.
- Converter deps live in `.ds-sync/` (staged copy of the skill scripts + esbuild/ts-morph/@types/react/playwright as devDeps there — gitignored, `npm i` needed fresh on a new clone before re-running).
- Playwright: installed `playwright@1.62.1` (not `playwright-core`) + `npx playwright install chromium` inside `.ds-sync/` — `package-validate.mjs` imports the `playwright` package specifically.

## Component set (7, all real, none invented)

`Nav`, `Footer`, `Eyebrow`, `Portrait`, `ProjectRow`, `StatBlock`, `BigNumber`. A `Button` component was deliberately excluded — `.btn`/`.btn.solid`/`.btn.ghost` and several other classes (`.ctas`, `.nav-cta`, `.corner-nav`, `.home-work*`, `.pageframe`, `.hero`) exist in the original `styles.css` but are dead CSS, unused by any of the 4 real pages (confirmed via `grep -ni 'btn' *.html` → no matches).

## Known fixes applied

- **`[FONT_MISSING]` → `[FONT_REMOTE]`**: `ds/src/styles.css` now has `@import url('https://fonts.googleapis.com/css2?family=Montserrat...')` at the top, mirroring how the real site actually loads Montserrat (a `<link>` in each page's `<head>`, not self-hosted). This is intentional — do not "fix" by trying to self-host woff2 files that don't exist in this repo.
- **`[GRID_OVERFLOW]` on `Nav` and `ProjectRow`**: both are full-width components that don't fit a multi-column grid cell. `cfg.overrides` sets `cardMode: "column"` for both — this is permanent, not a one-time fix; keep it if these components are ever regenerated.
- **`StatBlock`**: the original site's `.dstats div/b/span` CSS is descendant-scoped to a `.dstats` wrapper, which breaks when design-sync's render-check mounts the component solo. `ds/src/styles.css` has a deliberately-added self-contained `.stat-block` class carrying the same visual rules. `.dstats` itself is preserved as the plain flex wrapper class — compose multiple `<StatBlock>`s inside a `<div className="dstats">` (see the `Group` preview export).

## Preview scope

All 7 components got authored previews (not floor cards) — small enough to do everything up front. Portrait previews import the real site photos (`images/DSC07091.jpg`, `images/DSC06855_2.webp`) via relative import — esbuild's `dataurl` loader inlines them automatically, no extra config needed. ProjectRow previews port the 3 real projects' copy verbatim from `work.html`.

## Known render warns (triaged, not new)

- None outstanding — final validate run was 0 warnings after the FONT_REMOTE + GRID_OVERFLOW fixes above.

## Re-sync risks — what could go stale

- **Portrait preview images** are inlined at preview-compile time from `images/*` at the repo root. If those files are renamed/moved/deleted, the `Portrait` preview will fail to resolve on next build — not caught by anything except actually rebuilding.
- **The Montserrat remote `@import`** assumes Google Fonts stays reachable from wherever previews render. If the DS ever needs to work offline/self-hosted, this needs revisiting (see `[FONT_REMOTE]` above).
- **`ds/` and the live site are NOT wired together.** If the real site's `styles.css`/HTML changes (new components, changed copy, restyled `.proj`/`.nav` etc.), `ds/src/*` won't automatically reflect that — it was a one-time manual extraction. A future re-sync will only pick up changes made directly to `ds/`.
- **No docs directory** — every `.prompt.md` was synthesized from `.d.ts` + JSDoc + the authored preview, not from real component documentation (none exists for this site).
