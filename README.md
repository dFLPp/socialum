# Socialum

Socialum is a minimalist typing-survival game built with React, Vite, and canvas rendering. Type each incoming word before it reaches the player, clear levels, and unlock the full run.

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs with Vite and is configured to listen on `0.0.0.0`.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm test` | Run the Vitest test suite. |
| `npm run build` | Build the static production site into `dist/`. |
| `npm run preview` | Preview the production build locally. |

## Project Structure

| Path | Purpose |
| --- | --- |
| `src/game/` | Game loop, spawning, scoring, input, audio, canvas rendering, and tests. |
| `src/screens/` | React screens for start, how-to, level select, results, and victory. |
| `src/styles/` | Global UI styling and game screen styles. |
| `public/assets/` | Optional game assets for sprites, fonts, music, and sound effects. |
| `scripts/inject-sw-manifest.mjs` | Adds built asset URLs to the service worker cache manifest after `vite build`. |

## Assets

The game works without custom assets by using visual fallbacks and silent audio handling. Optional files can be placed under `public/assets/`; see `public/assets/README.md` for the expected paths.

## GitHub Pages

This project builds to static HTML/CSS/JS in `dist/` and deploys through GitHub Actions. The workflow is defined in `.github/workflows/pages.yml`.

To enable Pages for the repository, set the Pages source to **GitHub Actions** in GitHub repo settings, or run:

```bash
gh api \
  --method PUT \
  repos/:owner/:repo/pages \
  -f build_type=workflow
```

After Pages is enabled, every push to `main` runs tests, builds the app, uploads `dist/`, and deploys the static site.

## Notes

- `dist/` is generated output and intentionally ignored by git.
- Vite uses `base: './'` so built asset paths work from a GitHub Pages project URL such as `/socialum/`.
