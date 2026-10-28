# SITE x SITE — Project Context

## Overview

Static Create React App (CRA, `react-scripts` 5.0.1) site for the MAS/RPA "SITE x SITE" report
(NYC soft-site / CEQR study). Two parts: an interactive Mapbox map with case studies, and a
text primer. Legacy code — inherited, not written by the current maintainer. Maintainer does
not know React, so explanations must be plain-language and changes kept small.

## Deployment plan

- Target: internal display only, GitHub Pages, served from `docs/` on `main`.
- `HashRouter` is already used (`src/index.js`) — good for Pages, no 404 rewrite needed.
- `package.json` has `"homepage": "https://cankadir.github.io/site-x-site"`, so the build emits
  `/site-x-site/...` paths. Build with `npm run build:docs` (sets `BUILD_PATH=./docs`,
  `GENERATE_SOURCEMAP=false`). Output is ~12 MB, mostly images.
- Pages setting still to flip in the GitHub UI: Settings -> Pages -> Source: "Deploy from a branch",
  branch `main`, folder `/docs`.
- The old `build/` folder was tracked despite being gitignored and contained no JS/CSS. It has been
  removed from git and from disk. Do not resurrect it; `docs/` is the deployed artifact.
- If the repo is renamed or moved to an org, update `homepage` in `package.json` and rebuild.

## Architecture facts

- No CMS. **Contentful is not used anywhere.** All copy is hard-coded JSX.
- Data CSVs are served locally from `public/data/` (copied from `data/` at authoring time), fetched
  in `components/Dotchart` via `${process.env.PUBLIC_URL}/data/puma_displacement.csv`. No runtime
  dependency on GitHub raw URLs anymore.
- Source data kept in `data/` for provenance, not shipped to the site: `pluto_rec_dev12_2.csv`,
  `puma_displacement.csv`, `puma_percent_dev_no_soft.csv` (the last is referenced nowhere).
- Map tiles and styles are hosted on a Mapbox account named `prattsavi` (`mapbox://styles/prattsavi/...`).
  Public token is hard-coded in `src/components/Map/mapboxToken.js`.
- Images live in `src/public/images/` (non-standard CRA location; imported as modules, so they
  are bundled and hashed). `public/` holds only favicon/logos/manifest.
- Fonts: Adobe Typekit stylesheet from `use.typekit.net` in `public/index.html`.
- Styling: `styled-components` v5 + `styled-system`, plus a 1.2k-line `src/styles/globals.css`
  and full Bootstrap 5 CSS import. Bootstrap JS is imported only for its side effect (see below).
- Routing: `react-router-dom` v6, `HashRouter`, routes in `src/App.js`.

## Gotchas / do not break

- `import { Collapse } from "bootstrap"` in `components/Sidebar/index.jsx` looks unused, but the
  import is what registers Bootstrap's `data-bs-toggle="collapse"` click handler. All sidebar
  accordions depend on it. Remove only if accordions are rewritten in React state.
- `Dotchart` relies on d3 v4 APIs (`d3.csv` callback, `d3.nest`, `d3.map`). Upgrading d3 to v7
  requires rewriting that chart, not just bumping the version.
- `src/components/Map/mapViews.js` map layer/visibility functions are all still used. Not dead code.
- Sidebar sliders previously filtered the map with the previous (stale) state value. Fixed: the
  slider handlers now pass the new value into `handleMapFilter(lot, far)`.

## Zombie inventory — cleaned 2026-10-28

Removed: `components/Boxchart/index_d3.jsx`, `components/Grid/`,
`components/NavPill/FooterNavPill.jsx`, `utils/romanUnicodes.js`, `styles/sidebar.module.css`,
`public/favicon_old.ico`, 16 unused images (~2.3 MB), the `displayLegend` context key, unused
imports in `Boxchart`/`mapIntro`/`useOnClickOutside`, and the deps `@testing-library/*`,
`web-vitals`, `underscore`.

Still present, deliberately:
- `data/puma_percent_dev_no_soft.csv` — unused, but it is source data, not site output (4 KB).
- `src/styles/globals.css` — 1.2k lines, heavily commented, but every rule still applies.
- commented-out blocks in `mapViews.js`, `Navigation`, `part1/index.jsx` (old hexmap feature).
  Harmless; trim only when touching those files.

## Security / dependency posture

- `react-scripts` now lives in `devDependencies`, so `npm audit --omit=dev` reports the runtime
  surface honestly: **4 findings**
  - `d3` 4.13.0 -> `d3-color` ReDoS (GHSA-36jr-mh4h-2g58). Only reachable via untrusted color
    strings; colors are hardcoded. Low practical risk, but bumping is blocked by d3 v4 API use in
    `Dotchart`.
  - `react-router-dom` 6.6.1 -> open redirect + SSR deserialize advisories. No user-controlled
    links, no SSR. Low practical risk; fix is `npm i react-router-dom@7`.
- The other 31 findings are build tooling (jest, webpack-dev-server, svgo/nth-check, postcss,
  serialize-javascript, workbox, uuid/sockjs) and never reach the static bundle.
- `npm audit fix --force` is a trap: it proposes `react-scripts@0.0.0`, which destroys the build.
- Mapbox token is public by design, but should be URL-restricted in the Mapbox account. Maps break
  if the `prattsavi` account changes.
- `mapViews.js` injects Mapbox feature properties into `innerHTML` (8 places). Trusted tile data
  only, but it is an injection surface.

## Local dev gotcha

- The repo lives on a WSL-mounted `/mnt/c` path. An already-running `npm start` may not pick up
  file changes (inotify does not always fire across the Windows mount). Restart it if edits do not
  appear. Do not start a second dev server.

## Conventions

- Keep JS (no TypeScript). Small diffs. No new dependencies without asking.
- Do not run the full production build every change; one build before handoff. Build takes ~60s.
- Prefer plain React + CSS over adding libraries.
- Line endings: git stores LF. The working tree was materialized from Windows with CRLF, which made
  `git status` list every file as modified. Normalized to LF on 2026-10-28. Keep it LF; do not add
  a `.gitattributes` that forces CRLF.
- On this WSL `/mnt/c` mount, `git status` can report byte-identical files as modified until the
  index stat cache is refreshed. `git add -A` clears it; nothing bogus is committed because the
  content comparison still happens.

## Verification baseline

`npm run build:docs` succeeds on Node 22 with warnings only. Output: ~459 kB gzip JS, ~30 kB gzip
CSS, ~12 MB on disk including images. Verified by serving `docs/` from a sub-path
(`/site-x-site/`): index, JS, CSS, all 54 media files, `data/puma_displacement.csv`, favicon and
manifest return 200.
