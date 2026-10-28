# History

## 2026-10-28 — Initial audit

- Read the whole `src/` tree (inherited CRA app, ~8.9k lines incl. CSS).
- Confirmed **no Contentful / no CMS**: all content is hard-coded JSX. The only runtime remote
  fetch is two CSVs pulled from raw.githubusercontent.com, used by the Dotchart (and by dead code
  in `Boxchart/index_d3.jsx`).
- Confirmed `HashRouter` already in place, but `homepage` missing from `package.json`, so a
  GitHub Pages subpath deploy would 404 on assets.
- Ran `npm run build` (Node 22.22.2) — succeeds, warnings only; 459 kB gzip JS, 30 kB gzip CSS.
  Build prints "assuming hosted at /", confirming the Pages path problem.
- Ran `npm audit` — 35 findings, all but two in build tooling. Runtime ones: d3 4.13.0 (d3-color
  ReDoS) and react-router-dom 6.6.1 (redirect/SSR advisories). Neither is practically exploitable
  in this static, no-input site.
- Found committed `build/` is tracked despite being gitignored, and is missing its own bundles.
- Inventoried dead code: `Boxchart/index_d3.jsx`, `Grid`, `FooterNavPill`, `romanUnicodes`,
  `sidebar.module.css`, `puma_percent_dev_no_soft.csv`, 16 unused images (~2.3 MB), unused context
  key `displayLegend`, unused imports in several files, unused test/web-vitals/underscore deps.
- Found a real interaction bug: sidebar sliders call `handleMapFilter()` right after setState, so
  the filter applies the previous slider value.
- Found one thing that looks dead but is not: `import { Collapse } from "bootstrap"` is load-bearing
  (registers the accordion data-api handlers).
- Created this knowledge base. No source changes made yet.

## 2026-10-28 — Cleanup and GitHub Pages prep

Approved scope: remove zombies, prepare `docs/` deploy. Not a refactor.

- `package.json`: added `homepage` (`https://cankadir.github.io/site-x-site`), added
  `build:docs` (`GENERATE_SOURCEMAP=false BUILD_PATH=./docs`), moved `react-scripts` to
  devDependencies, removed `@testing-library/*`, `web-vitals`, `underscore`.
- Moved the live chart data to `public/data/puma_displacement.csv`; `Dotchart` now fetches it via
  `process.env.PUBLIC_URL`. GitHub raw URLs are gone from the bundle (verified by grep).
- Deleted dead files and 16 unused images (2.3 MB), plus `public/favicon_old.ico`.
- Fixed the slider stale-state bug in `SecOneloadSizeFarSideBar` (`handleMapFilter(lot, far)`).
- Dropped the `displayLegend` context key, the ignored `far_value`/`lot_value` props on `Boxchart`,
  dead imports in `mapIntro`, `Boxchart`, `useOnClickOutside`, and fixed `alignItem` -> `alignItems`
  in `Footer`.
- `robots.txt` now `Disallow: /` (internal site, keep it out of search results).
- Untracked and deleted `build/`; built `docs/` instead. Verified under a `/site-x-site/` sub-path:
  index, bundles, all 54 media files, CSV, favicon, manifest return 200. Source maps disabled.
- Runtime `npm audit --omit=dev` is now 4 findings (d3, d3-color, react-router, react-router-dom),
  all practically unreachable in this app. Left alone per scope.
- Open: visual check in a browser (map tiles depend on the Mapbox account), and flipping the Pages
  setting in the GitHub UI. Existing `npm start` on :3000 may be stale due to WSL file watching.

### Line endings

The working tree had CRLF (copied from a Windows machine) while git stored LF, so `git status`
listed ~90 files as modified, including ones nobody had touched. Normalized all tracked text files
to LF; the diff is now only the real changes. Also hit a WSL mount quirk where `git status` kept
reporting byte-identical files as modified — `git add -A` clears it.

Final artifact: `docs/` rebuilt from the normalized source, 12 MB, bundle `main.55558a3c.js`,
CSS `main.cb752806.css`, no source maps. Re-verified 200s through `/site-x-site/`.
