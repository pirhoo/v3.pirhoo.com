# AGENTS.md

This file provides guidance to Code Agents when working with code in this repository.

## Project Overview

Personal portfolio website (pirhoo.com) built with Vue 3 and Vite. Showcases investigative journalism work, coding projects, and professional activities with interactive data visualizations.

## Commands

```bash
yarn install              # Install dependencies
yarn dev                  # Development server with hot-reload
yarn build                # Production build
yarn lint                 # Lint and fix files
yarn test                 # Run tests with Vitest
yarn csv                  # Generate JSON from CSV data files
```

## Data Pipeline

CSV files in `/data/` are the source of truth. The `yarn csv` command runs a zx script that processes them:

1. **CSV → JSON conversion**: `/data/*.csv` → `/src/assets/json/*.json`
2. **Commits collection**: Scans parent directory for git repos, extracts commit history
3. **Color extraction**: Uses node-vibrant to extract colors from project thumbnails
4. **Image sizing**: Reads thumbnail dimensions into JSON

Pipeline steps: trainings → commits → count → investigations → projects → awards → sizes → colors

## Limit Token Usage

The `./data/commits.csv` and `./src/assets/json/commits.json` files are huge. You must avoid reading their full content to limit token usage and increasing context.

## Architecture

**Build Tools**:
- Vite 7.x for development and build
- ESLint with @stylistic for code style
- Vitest for testing

**Component structure** (`/src/components/`):
- `App.vue` - Root component orchestrating sections
- Section components: `Introduction.vue`, `Investigations.vue`, `Activity.vue`, `Projects.vue`, `Photos.vue`
- `ActivityCommits.vue` - D3.js 7.x commit visualization
- `GradientOnScroll.vue` - Granim-based gradient animations

All components use Vue 3 Composition API with `<script setup>` syntax.

**Composables** (`/src/composables/`):
- `useColors.js` - Color scale management for gradient effects
- `useSection.js` - Section styling with mouse tracking
- `useMousetrack.js` - Mouse position tracking for interactivity

**Styling**:
- SCSS with Bootstrap 5.3.x base
- Shared utilities in `/src/utils/`: `_variables.scss`, `_mixins.scss`, `_animations.scss`
- JavaScript variables exported in `/src/utils/variables.js` for use in components

**Icons**:
- Iconify via unplugin-icons
- Import icons like: `import IconName from '~icons/fa6-brands/icon-name'`

**Interactivity**:
- Mouse position tracking via composables drives gradient effects
- Vue3-lazyload for image lazy loading
- Vue-masonry-css for grid layouts
- mitt for event bus

## CI/CD

GitHub Actions workflows:
- `.github/workflows/ci.yml` - Runs lint, test, and build on push/PR
- `.github/workflows/deploy.yml` - Deploys to GitHub Pages on release

## Commit Style

* Uses conventional commits: `build:`, `feat:`, `fix:`, `chore:`, `test:`, `ci:`
* Never add a body to commits (they must be on one single line)
* Use @agent-Committer to commits
