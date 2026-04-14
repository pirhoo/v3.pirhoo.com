# Blueprint Subtle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a "blueprint" schematic dialect (hachure, dotted borders, index ratios, corner ticks) to v3.pirhoo.com at **Subtle** intensity, without altering the palette, typography, layout, or stack.

**Architecture:** Add a 3-file primitive layer in `src/utils/` (theme tokens, SCSS mixin, utility classes), then consume the primitives across 8 site surfaces — one commit per surface. Primitives are theme-aware via `currentColor` and CSS variables; hachure is a pure CSS `repeating-linear-gradient`; no new dependencies.

**Tech Stack:** Vue 3 (Composition API, `<script setup>`), SCSS on top of Bootstrap 5.3, GSAP (unchanged), D3 7 (one stroke-attribute update in `useChartDrawing.js`), `vue3-lazyload`. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-04-19-blueprint-subtle-design.md`

---

## File Structure

Phase C — primitive layer (3 files modified):

- **Modify** `src/utils/_theme.scss` — add `--border-dotted`, `--hachure-spacing`, `--hachure-angle` CSS variables to both `:root`/`[data-bs-theme="light"]` and `[data-bs-theme="dark"]`.
- **Modify** `src/utils/_mixins.scss` — append `@mixin hachure`.
- **Modify** `src/utils/_decorative.scss` — append `.border-dotted`, `.border-dotted-b`, `.border-dotted-t`, `.index-ratio`, `.corner-ticks` + `.corner-ticks__marker`, `.hachure-on-hover`.

Phase A — application surfaces (8 surfaces, 9 files touched):

- **Modify** `src/composables/useChartDrawing.js` — dotted year separator in `drawYearSeparators()`.
- **Modify** `src/components/Section/Introduction/Hero.vue` — add `.corner-ticks` + marker span.
- **Modify** `src/components/Section/Introduction/Social.vue` — add `.hachure-on-hover` to each social link.
- **Modify** `src/components/Section/Investigations/Card.vue` — swap `.index-number` for `.index-ratio`; add hover hachure.
- **Modify** `src/components/Section/Oss/Card.vue` — add `.hachure-on-hover`.
- **Modify** `src/components/Section/Projects/Archive.vue` — swap toggle `border-bottom` dashed → dotted.
- **Modify** `src/components/Section/Projects/Archive/Item.vue` — add hover hachure + `.index-ratio` decoration.
- **Modify** `src/components/Section/Projects/Featured/Card.vue` — `.corner-ticks` + marker span when `--active`.
- **Modify** `src/components/Layout/SectionNav/Item.vue` — active-state hachure background + dotted 2px left accent.

---

## Per-task verification (applies to every task below)

After every code change in a task:

1. Run `yarn lint` — must report **no errors**.
2. Run `yarn test` — existing Vitest suite must still pass (expected: 0 test regressions; the project has a single `tests/App.spec.js` that mounts the app).
3. Run `yarn dev` and open `http://localhost:5173/`. Toggle light / dark from the nav theme toggle. Verify the affected surface renders the intended change in **both** themes and that no other surface on the page has regressed.
4. Commit per `AGENTS.md`: conventional commit, single-line body, delegated to the `committer` agent.

Do **not** mark a task complete without confirming the surface in the browser in both themes.

---

## Task 1: Add blueprint tokens and hachure mixin

**Files:**
- Modify: `src/utils/_theme.scss`
- Modify: `src/utils/_mixins.scss`

- [ ] **Step 1: Add three new CSS variables to the light theme block**

In `src/utils/_theme.scss`, inside the `:root, [data-bs-theme="light"] { ... }` block, append the following just before the closing `}` (on line 42 in the current file), after the existing `--overlay-bg` line:

```scss
  // Blueprint primitives
  --border-dotted: rgba(0, 0, 0, 0.45);
  --hachure-spacing: 4px;
  --hachure-angle: 45deg;
```

- [ ] **Step 2: Add the dark-theme override for `--border-dotted`**

In `src/utils/_theme.scss`, inside the `[data-bs-theme="dark"] { ... }` block, append just before the closing `.section { ... }` nested block (around line 71), after the existing `--overlay-bg` line:

```scss
  // Blueprint primitives
  --border-dotted: rgba(255, 255, 255, 0.22);
```

`--hachure-spacing` and `--hachure-angle` are geometric defaults, not colors, so they do not need a dark override.

- [ ] **Step 3: Append the `hachure` mixin**

In `src/utils/_mixins.scss`, append the following block at the end of the file (after the `vendor-prefix` mixin):

```scss
// Blueprint hachure fill. Theme-aware via currentColor; alpha carried by arg.
// Uses color-mix() so that `currentColor` can be alpha-blended without
// requiring a concrete RGB value from the consumer.
@mixin hachure($angle: 45deg, $spacing: 4px, $opacity: 0.12) {
  background-image: repeating-linear-gradient(
    $angle,
    color-mix(in srgb, currentColor #{$opacity * 100%}, transparent) 0 1px,
    transparent 1px $spacing
  );
}
```

- [ ] **Step 4: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors. SCSS does not lint through ESLint in this repo, but `yarn lint` must still succeed on the JS/Vue files.

- [ ] **Step 5: Verify the app still builds and runs**

Run:

```bash
yarn dev
```

Open `http://localhost:5173/`. The page should render identically to before (no primitive is consumed yet). Toggle light/dark to confirm no regression from the new CSS vars.

- [ ] **Step 6: Commit**

Stage and commit via the `committer` agent. Expected message:

```
feat(theme): add blueprint primitive tokens and hachure mixin
```

Files in commit: `src/utils/_theme.scss`, `src/utils/_mixins.scss`.

---

## Task 2: Add blueprint utility classes

**Files:**
- Modify: `src/utils/_decorative.scss`

- [ ] **Step 1: Append the utility classes**

At the end of `src/utils/_decorative.scss`, after the existing `.card-accent` block, append:

```scss
// Dotted-border utilities (paired with existing `.border-dashed` lineage).
.border-dotted {
  border: 1px dotted var(--border-dotted);
}

.border-dotted-b {
  border-bottom: 1px dotted var(--border-dotted);
}

.border-dotted-t {
  border-top: 1px dotted var(--border-dotted);
}

// Index ratio: `03/12` style. Mono, tabular, compact. Consumer writes
// markup: `<span class="index-ratio">03<span>/</span>12</span>`.
.index-ratio {
  font-family: $font-family-mono;
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: $letter-spacing-wide;
  color: var(--bs-secondary-color);
  text-transform: uppercase;

  > span {
    margin: 0 2px;
    opacity: 0.5;
  }
}

// Corner ticks: 6px L-shaped marks at all four corners.
// Consumer must include `<span class="corner-ticks__marker"></span>` as a
// direct child to supply the two bottom corners (::before/::after on the
// parent cover the two top corners).
.corner-ticks {
  position: relative;

  &::before,
  &::after,
  > .corner-ticks__marker::before,
  > .corner-ticks__marker::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    pointer-events: none;
  }

  &::before {
    top: 0;
    left: 0;
    border-top: 1px solid currentColor;
    border-left: 1px solid currentColor;
  }

  &::after {
    top: 0;
    right: 0;
    border-top: 1px solid currentColor;
    border-right: 1px solid currentColor;
  }

  > .corner-ticks__marker {
    position: absolute;
    inset: 0;
    pointer-events: none;

    &::before {
      bottom: 0;
      left: 0;
      border-bottom: 1px solid currentColor;
      border-left: 1px solid currentColor;
    }

    &::after {
      bottom: 0;
      right: 0;
      border-bottom: 1px solid currentColor;
      border-right: 1px solid currentColor;
    }
  }
}

// Applies hachure on hover or keyboard focus. Opacity 0.08 is intentionally
// low to keep a "drafted paper" feel.
.hachure-on-hover {
  transition: background-image var(--motion-hover) ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      @include hachure($opacity: 0.08);
    }
  }

  &:focus-visible {
    @include hachure($opacity: 0.08);
  }
}
```

- [ ] **Step 2: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 3: Verify the app still builds and runs**

Run:

```bash
yarn dev
```

The page should render identically to before (no consumer has been updated yet).

- [ ] **Step 4: Commit**

Expected message:

```
feat(decorative): add dotted-border, index-ratio, corner-ticks, hachure utilities
```

Files in commit: `src/utils/_decorative.scss`.

---

## Task 3: Activity — dotted year separator in the commits heatmap

**Files:**
- Modify: `src/composables/useChartDrawing.js`

- [ ] **Step 1: Update `drawYearSeparators()` to render a dotted stroke**

Open `src/composables/useChartDrawing.js`. Locate `function drawYearSeparators()` (around line 101). It currently ends with `.style('opacity', 0.8)`.

Replace the entire function body with:

```js
  function drawYearSeparators() {
    svg.value.selectAll('path.activity-commits__year-separator')
      .data(yearBoundaries.value.slice(1))
      .enter()
      .append('path')
      .attr('class', 'activity-commits__year-separator')
      .attr('d', d => getYearSeparatorPath(d))
      .attr('fill', 'none')
      .attr('stroke', 'var(--bs-body-color)')
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', '1 4')
      .style('opacity', 0.8)
  }
```

The only additions are `.attr('stroke-dasharray', '1 4')` before the `.style('opacity', 0.8)` line. Combined with the existing `stroke-linecap: round`, this renders as true dots (1px dashes with rounded endcaps spaced 4px apart).

- [ ] **Step 2: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 3: Verify tests pass**

Run:

```bash
yarn test
```

Expected: all existing tests pass. The heatmap is rendered imperatively in D3 and is not covered by Vitest.

- [ ] **Step 4: Verify in browser (both themes)**

Run `yarn dev`, scroll to the Activity section. The vertical year separators in the commits heatmap should now read as dotted lines instead of solid. Confirm both light and dark themes.

- [ ] **Step 5: Commit**

Expected message:

```
feat(activity): dotted stroke on commits heatmap year separators
```

Files in commit: `src/composables/useChartDrawing.js`.

---

## Task 4: Introduction Hero — corner ticks

**Files:**
- Modify: `src/components/Section/Introduction/Hero.vue`

- [ ] **Step 1: Add `.corner-ticks` class and marker span to the hero content container**

In `src/components/Section/Introduction/Hero.vue`, the current template starts:

```vue
<template>
  <div class="introduction-hero">
    <div class="introduction-hero__content">
      <app-text-reveal-group ...>
```

Update the `__content` div to apply `.corner-ticks` and include the marker span. Replace the existing opening `<div class="introduction-hero__content">` line with:

```vue
    <div class="introduction-hero__content corner-ticks">
      <span class="corner-ticks__marker" aria-hidden="true"></span>
```

The closing `</div>` for `__content` is unchanged. The marker span must be a direct child of the `.corner-ticks` element; the existing content (`app-text-reveal-group`, `__roles`) follows it.

- [ ] **Step 2: Add a small padding override so ticks don't clip into the text**

In the same file's `<style>` block, inside the `&__content { max-width: 900px; }` rule, update to:

```scss
  &__content {
    max-width: 900px;
    padding: $space-3 $space-4;
  }
```

This creates a small inset so the 6px corner ticks have visible breathing room inside the frame without shifting the hero layout meaningfully.

- [ ] **Step 3: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 4: Verify tests pass**

Run:

```bash
yarn test
```

Expected: all tests pass (the hero is mounted by `tests/App.spec.js`; the additional DOM node must not break assertions).

- [ ] **Step 5: Verify in browser (both themes)**

Run `yarn dev`. At the top of the page, the hero's name + roles container should now show four 6px L-shaped ticks in its corners. Ticks inherit `currentColor` (the body text color), so they render dark on light and light on dark. Confirm both themes.

- [ ] **Step 6: Commit**

Expected message:

```
feat(hero): add corner ticks to introduction content frame
```

Files in commit: `src/components/Section/Introduction/Hero.vue`.

---

## Task 5: Introduction Social — hachure on hover

**Files:**
- Modify: `src/components/Section/Introduction/Social.vue`

- [ ] **Step 1: Add `.hachure-on-hover` to each social link**

In `src/components/Section/Introduction/Social.vue`, update the `<a>` inside the `v-for`. The current template:

```vue
<a
  v-for="link in socialLinks"
  :key="link.platform"
  :href="link.url"
  class="introduction-social__link"
  :rel="link.rel"
>
```

Change the `class` to include `hachure-on-hover`:

```vue
<a
  v-for="link in socialLinks"
  :key="link.platform"
  :href="link.url"
  class="introduction-social__link hachure-on-hover"
  :rel="link.rel"
>
```

- [ ] **Step 2: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 3: Verify tests pass**

Run:

```bash
yarn test
```

Expected: all tests pass.

- [ ] **Step 4: Verify in browser (both themes)**

Run `yarn dev`. Scroll to the Contact / Social section. Hover over each social link — the hachure pattern should fill the link background at low opacity (0.08). The existing border-color hover transition should also continue working. Confirm both themes.

- [ ] **Step 5: Commit**

Expected message:

```
feat(social): hachure on hover for social links
```

Files in commit: `src/components/Section/Introduction/Social.vue`.

---

## Task 6: Investigations Card — hover hachure + index-ratio

**Files:**
- Modify: `src/components/Section/Investigations/Card.vue`

- [ ] **Step 1: Replace `.index-number` with `.index-ratio` markup in the template**

In `src/components/Section/Investigations/Card.vue`, the current index markup is:

```vue
<div class="investigation-card__index">
  <span class="index-number">{{ formattedIndex }}</span>
</div>
```

Replace with:

```vue
<div class="investigation-card__index">
  <span class="index-ratio">{{ formattedIndex }}<span>/</span>{{ formattedTotal }}</span>
</div>
```

- [ ] **Step 2: Add the `formattedTotal` computed in the `<script setup>` block**

In the same file's `<script setup>`, the existing `formattedIndex` computed is:

```js
const formattedIndex = computed(() => {
  return String(props.total - props.index).padStart(2, '0')
})
```

Add, directly below it:

```js
const formattedTotal = computed(() => {
  return String(props.total).padStart(2, '0')
})
```

- [ ] **Step 3: Update the card's SCSS — drop `.index-number` styling, add hover hachure**

In the same file's `<style>` block, the `&__index` rule currently reads:

```scss
&__index {
  position: absolute;
  top: $space-4;
  right: $space-4;
  z-index: 10;

  .index-number {
    font-family: $font-family-mono;
    font-size: 0.8125rem;
    color: var(--card-text-muted);
    background: var(--card-bg);
    padding: $space-1 $space-2;
    border-radius: $space-1;
  }
}
```

Replace the inner `.index-number { ... }` block with `.index-ratio` so the existing positioned container keeps its chip-style background:

```scss
&__index {
  position: absolute;
  top: $space-4;
  right: $space-4;
  z-index: 10;

  .index-ratio {
    color: var(--card-text-muted);
    background: var(--card-bg);
    padding: $space-1 $space-2;
    border-radius: $space-1;
  }
}
```

Font-family, font-size, letter-spacing, and tabular-nums come from `.index-ratio` itself in `_decorative.scss` (Task 2). Only card-specific overrides (color, background chip, padding) remain.

Then inside the existing `@media (hover: hover) and (pointer: fine) { &:hover { ... } }` block (around lines 93-101 before the change), add the hachure include. Current block:

```scss
@media (hover: hover) and (pointer: fine) {
  &:hover {
    transform: translateY(-4px);

    .investigation-card__image {
      opacity: 0.8;
    }
  }
}
```

Replace with:

```scss
@media (hover: hover) and (pointer: fine) {
  &:hover {
    transform: translateY(-4px);
    @include hachure($opacity: 0.08);

    .investigation-card__image {
      opacity: 0.8;
    }
  }
}
```

- [ ] **Step 4: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 5: Verify tests pass**

Run:

```bash
yarn test
```

Expected: all tests pass.

- [ ] **Step 6: Verify in browser (both themes)**

Run `yarn dev`. Scroll to the Investigations section. Each card's top-right index badge should now read `01/12`, `02/12`, etc. (mono, tabular, the slash dimmed). Hover a card — the card background should show the hachure pattern at low opacity in addition to the existing lift + image-opacity transitions. Confirm both themes.

- [ ] **Step 7: Commit**

Expected message:

```
feat(investigations): hover hachure and index-ratio on cards
```

Files in commit: `src/components/Section/Investigations/Card.vue`.

---

## Task 7: OSS Card — hover hachure

**Files:**
- Modify: `src/components/Section/Oss/Card.vue`

- [ ] **Step 1: Add `.hachure-on-hover` to the OSS card root**

In `src/components/Section/Oss/Card.vue`, the current root element:

```vue
<a
  :href="project.github"
  class="oss-card"
  target="_blank"
  rel="noopener"
>
```

Change the `class` to include `hachure-on-hover`:

```vue
<a
  :href="project.github"
  class="oss-card hachure-on-hover"
  target="_blank"
  rel="noopener"
>
```

OSS cards have no leading index number, so no `.index-ratio` change is added here. The existing `border-style: dashed → solid` hover transition is left untouched.

- [ ] **Step 2: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 3: Verify tests pass**

Run:

```bash
yarn test
```

Expected: all tests pass.

- [ ] **Step 4: Verify in browser (both themes)**

Run `yarn dev`. Scroll to the OSS section. Hover each OSS card — the hachure pattern should appear in the card background at 0.08 opacity alongside the existing border color + border-style transition. Confirm both themes.

- [ ] **Step 5: Commit**

Expected message:

```
feat(oss): hover hachure on cards
```

Files in commit: `src/components/Section/Oss/Card.vue`.

---

## Task 8: Projects Archive — dotted toggle + item hover hachure + index-ratio

**Files:**
- Modify: `src/components/Section/Projects/Archive.vue`
- Modify: `src/components/Section/Projects/Archive/Item.vue`

This task covers two files. Commit both in a single atomic commit since they describe the same surface.

- [ ] **Step 1: Swap the toggle button's dashed border for dotted**

In `src/components/Section/Projects/Archive.vue`, the `&__toggle` rule currently contains:

```scss
border-bottom: 1px dashed var(--border-dashed);
```

Replace with:

```scss
border-bottom: 1px dotted var(--border-dotted);
```

This is the only change inside `Archive.vue`.

- [ ] **Step 2: Pass the archive length into each item**

In the same `Archive.vue` file, locate the `<section-projects-archive-item ... />` element inside the `v-for`. Current props:

```vue
<section-projects-archive-item
  v-for="(project, index) in archivedProjects"
  :key="index"
  :project="project"
  :thumbnail-url="getThumbnailUrl(project.thumbnail)"
  :index="index"
/>
```

Add a `:total` prop:

```vue
<section-projects-archive-item
  v-for="(project, index) in archivedProjects"
  :key="index"
  :project="project"
  :thumbnail-url="getThumbnailUrl(project.thumbnail)"
  :index="index"
  :total="archivedProjects.length"
/>
```

- [ ] **Step 3: Accept the `total` prop in the Archive Item**

In `src/components/Section/Projects/Archive/Item.vue`, the current `defineProps` call is:

```js
const props = defineProps({
  project: { type: Object, required: true },
  thumbnailUrl: { type: String, required: true },
  index: { type: Number, required: true }
})
```

Replace with:

```js
const props = defineProps({
  project: { type: Object, required: true },
  thumbnailUrl: { type: String, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true }
})
```

Then, immediately below the existing `buttonLabel`/`buttonIcon` computeds, add:

```js
const formattedIndex = computed(() => String(props.index + 1).padStart(2, '0'))
const formattedTotal = computed(() => String(props.total).padStart(2, '0'))
```

Note: `computed` is already imported at the top of the file.

- [ ] **Step 4: Add the index-ratio span to the item template**

In `src/components/Section/Projects/Archive/Item.vue`, the current template is:

```vue
<a
  :href="project.url"
  class="archive-item"
  :style="{ '--item-color': project.adjustedColor || project.color, '--animation-delay': `${index * 20}ms` }"
  target="_blank"
>
  <div class="archive-item__header">
    <div class="archive-item__image">
      <img v-if="project.thumbnail" v-lazy="thumbnailUrl" :alt="project.title" />
    </div>
    <div class="archive-item__content">
      <span class="archive-item__year text-tiny-display">{{ project.year }}</span>
      <span class="archive-item__title">{{ project.title }}</span>
    </div>
  </div>
  <span class="archive-item__button">
    {{ buttonLabel }}
    <component :is="buttonIcon" />
  </span>
</a>
```

Modify the root `<a>` to add `hachure-on-hover`, and add an index-ratio span at the top of the content block:

```vue
<a
  :href="project.url"
  class="archive-item hachure-on-hover"
  :style="{ '--item-color': project.adjustedColor || project.color, '--animation-delay': `${index * 20}ms` }"
  target="_blank"
>
  <div class="archive-item__header">
    <div class="archive-item__image">
      <img v-if="project.thumbnail" v-lazy="thumbnailUrl" :alt="project.title" />
    </div>
    <div class="archive-item__content">
      <span class="archive-item__ratio index-ratio">{{ formattedIndex }}<span>/</span>{{ formattedTotal }}</span>
      <span class="archive-item__year text-tiny-display">{{ project.year }}</span>
      <span class="archive-item__title">{{ project.title }}</span>
    </div>
  </div>
  <span class="archive-item__button">
    {{ buttonLabel }}
    <component :is="buttonIcon" />
  </span>
</a>
```

- [ ] **Step 5: Add small styling for the ratio chip**

In the same `Item.vue`'s `<style>` block, inside the `&__content { ... }` rule (currently `display: flex; flex-direction: column; gap: 2px; min-width: 0;`), no change is needed — flex-direction already stacks children vertically. Below the existing `&__year` rule, append:

```scss
  &__ratio {
    margin-bottom: 2px;
  }
```

- [ ] **Step 6: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 7: Verify tests pass**

Run:

```bash
yarn test
```

Expected: all tests pass.

- [ ] **Step 8: Verify in browser (both themes)**

Run `yarn dev`. Scroll to the Projects section, click "View all projects" to expand the archive. Each archive item should show a small `01/NN` index ratio above the year and title. The "View all projects" button's bottom seam should read as dotted (small round pips) instead of dashed. Hover each item — the hachure pattern should fill the card background at 0.08 opacity. Confirm both themes.

- [ ] **Step 9: Commit**

Expected message:

```
feat(archive): dotted toggle, hover hachure, and index-ratio on items
```

Files in commit: `src/components/Section/Projects/Archive.vue`, `src/components/Section/Projects/Archive/Item.vue`.

---

## Task 9: Projects Featured — corner ticks on active card

**Files:**
- Modify: `src/components/Section/Projects/Featured/Card.vue`

- [ ] **Step 1: Add the marker span to the template, keyed to `isActive`**

In `src/components/Section/Projects/Featured/Card.vue`, the current root is:

```vue
<div
  class="featured-card"
  :class="{
    'featured-card--dragging': isDragging,
    'featured-card--active': isActive
  }"
  :style="cardStyle"
  @mousedown="..."
  ...
>
  <div class="featured-card__image">
```

Immediately after the opening `<div class="featured-card" ...>` (i.e. before `<div class="featured-card__image">`), insert a conditional marker span:

```vue
<span v-if="isActive" class="corner-ticks__marker" aria-hidden="true"></span>
```

The full template head becomes:

```vue
<div
  class="featured-card"
  :class="{
    'featured-card--dragging': isDragging,
    'featured-card--active': isActive
  }"
  :style="cardStyle"
  @mousedown="isActive && $emit('dragStart', $event)"
  @mousemove="isActive && $emit('dragMove', $event)"
  @mouseup="isActive && $emit('dragEnd')"
  @mouseleave="isActive && $emit('dragEnd')"
  @touchstart="isActive && $emit('dragStart', $event)"
  @touchmove="isActive && $emit('dragMove', $event)"
  @touchend="isActive && $emit('dragEnd')"
>
  <span v-if="isActive" class="corner-ticks__marker" aria-hidden="true"></span>
  <div class="featured-card__image">
```

- [ ] **Step 2: Add `.corner-ticks` behavior only when the card is active**

In the same file's `<style>` block, locate the existing `&--active { cursor: default; }` rule (around line 85). Replace it with:

```scss
&--active {
  cursor: default;

  // Apply corner-ticks behavior only when the card is active. Since the
  // base `.featured-card` already has `position: relative`, we only need
  // the ::before/::after definitions here; the marker span (in template)
  // supplies the bottom two corners via `> .corner-ticks__marker`.
  &::before,
  &::after,
  > .corner-ticks__marker::before,
  > .corner-ticks__marker::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    pointer-events: none;
    z-index: 2;
    color: var(--bs-body-color);
  }

  &::before {
    top: 0;
    left: 0;
    border-top: 1px solid currentColor;
    border-left: 1px solid currentColor;
  }

  &::after {
    top: 0;
    right: 0;
    border-top: 1px solid currentColor;
    border-right: 1px solid currentColor;
  }

  > .corner-ticks__marker {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 6px;
      height: 6px;
      border-bottom: 1px solid currentColor;
      border-left: 1px solid currentColor;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 6px;
      height: 6px;
      border-bottom: 1px solid currentColor;
      border-right: 1px solid currentColor;
    }
  }
}
```

Note: we inline the corner-ticks geometry here rather than adding `.corner-ticks` to the root class list. Reason: the featured card uses `overflow: hidden` on itself, and the ticks must be pinned above the image. Inlining allows us to fully control `z-index: 2` and `color` on the ticks without conflicting with the base `.corner-ticks` utility. The utility stays available for simpler consumers (Task 4).

- [ ] **Step 3: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 4: Verify tests pass**

Run:

```bash
yarn test
```

Expected: all tests pass.

- [ ] **Step 5: Verify in browser (both themes)**

Run `yarn dev`. Scroll to the Projects / Featured section. Only the front card should show four 6px corner ticks at its corners. Swipe to the next card — ticks should disappear from the now-inactive card and reappear on the newly-active one. Stack siblings should never show ticks. Confirm both themes.

- [ ] **Step 6: Commit**

Expected message:

```
feat(featured): corner ticks on active card
```

Files in commit: `src/components/Section/Projects/Featured/Card.vue`.

---

## Task 10: SectionNav Item — active hachure + dotted left accent

**Files:**
- Modify: `src/components/Layout/SectionNav/Item.vue`

- [ ] **Step 1: Extend the `&--active` rule with hachure and a dotted left accent**

In `src/components/Layout/SectionNav/Item.vue`, the current active-state rule is:

```scss
&--active {
  .nav-item__cell__border {
    stroke: var(--nav-color);
    stroke-dasharray: none;
  }
}
```

Replace with:

```scss
&--active {
  .nav-item__cell__border {
    stroke: var(--nav-color);
    stroke-dasharray: none;
  }

  // Blueprint cue on the active nav item: subtle hachure fill behind the
  // cell + a 2px dotted vertical accent to the left of the cell.
  @include hachure($opacity: 0.10);
  background-size: 18px 18px;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 2px;
    width: 0;
    height: 16px;
    transform: translateY(-50%);
    border-left: 2px dotted var(--border-dotted);
    pointer-events: none;
  }
}
```

Why `background-size/position/repeat`: the hachure fill is a repeating gradient that would otherwise tile across the entire button (which is as tall as the band). Constraining it to an 18px square centered on the cell confines the visual to the cell area.

Why `::before` instead of `border-left` on the button: adding a real border would shift the flex children (cell + label) right, throwing off the visual centering of the cell in the 48px band. A positioned `::before` renders the dotted accent without altering the button's layout. The `.nav-item` already has `position: relative` on line 58, so no extra rule is needed.

- [ ] **Step 2: Verify lint passes**

Run:

```bash
yarn lint
```

Expected: no errors.

- [ ] **Step 3: Verify tests pass**

Run:

```bash
yarn test
```

Expected: all tests pass.

- [ ] **Step 4: Verify in browser (both themes)**

Run `yarn dev`. On desktop (`width ≥ 1101px`), the left section nav is visible. Scroll through the page so different sections become active. The active nav item should:

- Show a subtle hachure fill behind its cell (not across the whole nav band).
- Have a 2px dotted accent along its left edge.
- Keep its existing cell-border stroke change.

Non-active items must look identical to before the change. The band's right-edge dashed divider stays dashed (not dotted). Confirm both themes.

- [ ] **Step 5: Commit**

Expected message:

```
feat(nav): hachure and dotted left accent on active item
```

Files in commit: `src/components/Layout/SectionNav/Item.vue`.

---

## Stopping criteria (run after Task 10)

- [ ] All 10 task commits landed on the branch.
- [ ] `yarn lint`, `yarn test`, `yarn build` all green on the final commit.
- [ ] Light/dark parity confirmed on every surface touched (Hero corner ticks, Social hachure, Investigations card ratio/hachure, OSS card hachure, Archive toggle/items, Featured active card ticks, Nav active item hachure/accent, Activity year separators).
- [ ] First-glance identity of each section reads the same as before the pass; blueprint additions only reward close inspection.
- [ ] Every Phase C primitive is consumed at least once in Phase A:
  - `@mixin hachure` consumed by `.hachure-on-hover` + SectionNav active item (direct include) + Investigations card hover (direct include).
  - `.border-dotted` consumed by Archive toggle border (via `var(--border-dotted)` in the replacement rule).
  - `.index-ratio` consumed by Investigations card + Archive item.
  - `.corner-ticks` + `.corner-ticks__marker` consumed by Introduction Hero; Featured active card inlines the same geometry (intentional, documented in Task 9).
  - `.hachure-on-hover` consumed by Social, OSS card, Archive item.
  - `.border-dotted-b` / `.border-dotted-t` utilities are added but not consumed in this pass. Keep them for future use; do not delete.

## Rollback

Each task is an independent commit. To roll back any surface, `git revert <commit-sha>` of that task's commit. No cross-task state is carried.
