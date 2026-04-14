# Blueprint Subtle — Design Spec

**Date:** 2026-04-19
**Scope:** Polish pass on v3.pirhoo.com. Amplify the existing editorial language with a "blueprint" schematic dialect — hachure textures, dotted borders, index ratios, corner ticks — applied at **Subtle** intensity (interaction/active states only). No palette, typography, layout, or stack changes.

## Goals

- Strengthen the existing visual identity without altering it.
- Introduce a reusable "blueprint" primitive layer (tokens, mixin, utilities) that any section can adopt.
- Apply the primitives across every section at low contrast, so the additions reward close inspection but never dominate a first glance.

## Non-goals

- No palette, font, or layout changes.
- No new Vue components, no new dependencies, no new GSAP work.
- No changes to `Footer.vue`, `Activity/Commits` cells, or `_animations.scss`.
- No redesign of the information architecture.

## Phase sequence

1. **Phase C — Primitives.** Tokens, mixin, utility classes only. Ships independently.
2. **Phase A — Application.** Consume the primitives across eight surfaces, one commit per surface, smallest blast radius first.

## Phase C — Primitive layer

All additions live in `src/utils/_theme.scss`, `src/utils/_mixins.scss`, and `src/utils/_decorative.scss`.

### New CSS variables

Added to both `:root` / `[data-bs-theme="light"]` and `[data-bs-theme="dark"]`:

```
--border-dotted        light: rgba(0, 0, 0, 0.45)       dark: rgba(255, 255, 255, 0.22)
--hachure-color        currentColor (consumer-controlled)
--hachure-spacing      4px
--hachure-angle        45deg
```

### New SCSS mixin (`_mixins.scss`)

```scss
@mixin hachure(
  $angle: var(--hachure-angle, 45deg),
  $spacing: var(--hachure-spacing, 4px),
  $color: currentColor,
  $alpha: 0.12
) {
  background-image: repeating-linear-gradient(
    $angle,
    rgba($color, $alpha) 0 1px,
    transparent 1px $spacing
  );
}
```

Alpha stays 0.08–0.15 across the site — drafted paper, not wallpaper.

### New utility classes (`_decorative.scss`)

- `.border-dotted` — `border: 1px dotted var(--border-dotted)`.
- `.border-dotted-b` — `border-bottom: 1px dotted var(--border-dotted)`.
- `.border-dotted-t` — `border-top: 1px dotted var(--border-dotted)`.
- `.index-ratio` — mono, tabular-nums, uppercase; formats `03/12` with a thin slash.
- `.corner-ticks` — 6px L-shaped ticks at the four corners of the container via `::before`/`::after` on the element and on a child helper span. Inherits `currentColor`.
- `.hachure-on-hover` — applies `@include hachure(...)` on `:hover` and `:focus-visible`.

All primitives are theme-aware through existing tokens (`--bs-border-color`, `--border-dashed`, new `--border-dotted`, `currentColor`). No per-theme overrides inside the primitives.

## Phase A — Application map

Ordered by blast radius (smallest → largest). One commit per surface, conventional style per `AGENTS.md`.

1. **`Section/Activity` — year separator in the commits heatmap.** The separator is rendered by D3 in `src/composables/useChartDrawing.js::drawYearSeparators` as an SVG `<path>` with a solid 1px stroke. Change it to a dotted stroke via `stroke-dasharray: '1 4'` + `stroke-linecap: 'round'` so it reads as a true dotted line. No CSS border change (there is no dashed CSS border here); the blueprint cue is applied in the SVG where the separator actually lives. `--border-dotted` CSS token is validated in Phase A step 6 (Archive toggle border swap).
2. **`Section/Introduction/Hero`** — `.corner-ticks` on `.introduction-hero__content`. Static, decorative; reads as a drafted frame without affecting the H1 or roles.
3. **`Section/Introduction/Social`** — social icon buttons gain `.hachure-on-hover`. First consumer of the hachure mixin.
4. **`Section/Investigations/Card`** — hover hachure (`angle: 45deg`, `alpha: 0.08`). Leading number element swaps `.index-number` (current `(01)` format) for `.index-ratio` (`01/12` format), using existing `index` + `total` props. Card is a plain `<a>` with no active/selected state, so no dotted accent.
5. **`Section/Oss/Card`** — hover hachure only (`angle: 45deg`, `alpha: 0.08`). OSS cards have no leading index number, so the `.index-ratio` change does not apply here. Investigations and OSS read as the same family through shared hover behavior.
6. **`Section/Projects/Archive`** — `.hachure-on-hover` on archive items (matches Investigations / OSS card hover family). `.projects-archive__toggle` swaps its `border-bottom: 1px dashed` for `1px dotted` — one strategic token replacement on the archive's visible seam. A small `.index-ratio` element (e.g. `03/24`) is added to each item's content using the existing `index` prop + archive length; decorative, no layout impact.
7. **`Section/Projects/Featured`** — `.corner-ticks` on the front/active card only (identified via the existing `isActive` prop in `Featured.vue`). Stack siblings unaffected.
8. **`Layout/SectionNav/Item`** — active nav item gets a hachure background (alpha 0.10) and a 2px dotted inset accent on the left edge. Band divider stays `dashed` to avoid over-homogenizing.

Section label counts (`.text-meta`) are **not** swapped for `.index-ratio` — a single count (`12`) is a different semantic unit from a ratio (`03/12`), and changing it would blur the primitive's intent.

Every step is independently revertable.

## Verification

Per step:

- `yarn dev` — visual confirmation in **both** light and dark.
- `yarn lint` — must pass.
- `yarn test` — existing Vitest suite must pass (no snapshot updates expected; if any snapshot drifts, review before accepting).
- Reduced-motion respected (no motion was added, but verify hover transitions still honor the existing `prefers-reduced-motion` block in `_theme.scss`).

No step is claimed complete without confirming the surface in-browser in both themes.

## Stopping criteria

- Every Phase C primitive is consumed at least once in Phase A.
- First-glance identity of every section reads the same as before the pass.
- Light/dark parity verified on every surface.
- Lint + tests green on the final commit.

## Risks and mitigations

- **Hachure over-rendering on low-DPI displays.** Mitigation: test at 1x / 2x; the 4px spacing at 0.12 alpha is deliberately chosen to remain readable on 1x without moiré. If moiré appears on specific surfaces, widen spacing to 5–6px locally.
- **Dotted borders reading as dashed at small sizes.** Mitigation: `.border-dotted` uses 1px; `border-style: dotted` at 1px is distinguishable from `dashed` in all major browsers on Chrome/Safari/Firefox current versions. If a surface looks ambiguous, bump to 2px locally.
- **Active-state hachure fighting the section's accent color.** Mitigation: hachure uses `currentColor`, so it inherits the section's text color rather than the amber accent. No fight.

## Open questions

None at the time of writing.

## Commit style

Conventional commits, single-line body per `AGENTS.md`. Delegate each commit to the `committer` agent. Example first commits:

- `feat(theme): add blueprint primitive tokens and hachure mixin`
- `feat(decorative): add dotted-border, index-ratio, corner-ticks utilities`
- `feat(activity): swap year divider from dashed to dotted`
