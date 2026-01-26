<template>
  <div ref="rootRef" class="activity-commits">
    <span
      ref="yearLabelRef"
      class="activity-commits__sticky-year"
      :style="{ transform: `translateX(${scrollOffset}px)` }"
    >
      {{ visibleYear }}
    </span>
    <div class="activity-commits__wrapper">
      <svg class="activity-commits__svg" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { useD3Tooltip } from '@/composables/useD3Tooltip'
import { useCommitsData } from '@/composables/useCommitsData'
import { useChartDrawing } from '@/composables/useChartDrawing'
import { CELL_SIZE, CELL_GAP, LABEL_WIDTH, PADDING } from './config.js'

const rootRef = ref(null)
const yearLabelRef = ref(null)
const visibleYear = ref('')
const scrollOffset = ref(0)
let scrollContainer = null

const { showTooltip, hideTooltip } = useD3Tooltip()
const {
  weeks,
  yearBoundaries,
  monthBoundaries,
  chartWidth,
  chartHeight,
  formatDisplayDate,
  getCellIntensity,
  getYearSeparatorPath
} = useCommitsData()

const svg = computed(() => d3.select(rootRef.value).select('.activity-commits__svg'))

const {
  createPatterns,
  drawMonthLabels,
  drawDayLabels,
  drawYearSeparators,
  drawCells,
  updateColors
} = useChartDrawing(svg, { weeks, yearBoundaries, monthBoundaries, getCellIntensity, getYearSeparatorPath })

function getYearAtScrollPosition(scrollLeft) {
  // Find which year is visible at the current scroll position
  for (let i = yearBoundaries.value.length - 1; i >= 0; i--) {
    const boundary = yearBoundaries.value[i]
    const yearX = LABEL_WIDTH + PADDING + (boundary.weekIndex * (CELL_SIZE + CELL_GAP))
    if (scrollLeft >= yearX - LABEL_WIDTH) {
      return boundary.year
    }
  }
  return yearBoundaries.value[0]?.year || ''
}

function updateVisibleYear() {
  if (scrollContainer) {
    const scrollLeft = scrollContainer.scrollLeft
    scrollOffset.value = scrollLeft
    visibleYear.value = getYearAtScrollPosition(scrollLeft)
  }
}

function getTooltipContent(d) {
  if (d.count === 0) {
    return `No commits on ${formatDisplayDate(d.date)}`
  }
  return `<strong>${d.count} commit${d.count > 1 ? 's' : ''}</strong> on ${formatDisplayDate(d.date)}`
}

function drawChart() {
  svg.value
    .style('width', `${chartWidth.value}px`)
    .style('min-width', `${chartWidth.value}px`)
    .style('height', `${chartHeight.value}px`)

  const defs = svg.value.append('defs')
  createPatterns(defs)
  drawMonthLabels()
  drawDayLabels()
  drawYearSeparators()
  drawCells(showTooltip, hideTooltip, getTooltipContent)
}

function scrollToEnd() {
  const scrollContainer = rootRef.value?.closest('.activity__commits__chart')
  if (scrollContainer) {
    const scrollWidth = scrollContainer.scrollWidth
    const clientWidth = scrollContainer.clientWidth
    scrollContainer.scrollTo(scrollWidth - clientWidth, 0)
  }
}

onMounted(() => {
  drawChart()

  scrollContainer = rootRef.value?.closest('.activity__commits__chart')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', updateVisibleYear, { passive: true })
  }

  // Use multiple rAF calls to ensure layout is complete
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToEnd()
      updateVisibleYear()
    })
  })

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'data-bs-theme') {
        updateColors()
      }
    }
  })
  observer.observe(document.documentElement, { attributes: true })
})

onUnmounted(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', updateVisibleYear)
  }
})
</script>

<style lang="scss">
@import '@/utils/_variables.scss';
@import '@/utils/_tip.scss';

.activity-commits {
  z-index: 0;
  position: relative;
  width: 100%;
  max-width: 100%;

  &__sticky-year {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    height: 18px;
    font-size: 10px;
    font-family: $font-family-mono;
    color: var(--section-primary);
    transition: color $color-transition-duration;
    white-space: nowrap;
    z-index: 1;
    background: linear-gradient(to right, var(--body-bg) 80%, transparent);
    padding-right: 20px;
    width: fit-content;
  }

  &__wrapper {
    width: max-content;
    display: block;
    position: relative;
  }

  &__svg {
    display: block;
    font-family: $font-family-mono;
    max-width: none !important;
    flex-shrink: 0;
    overflow: visible !important;
  }

  &__day-label {
    transition: fill $color-transition-duration;
  }

  &__month-label {
    transition: fill $color-transition-duration;
  }

  &__cell {
    transition: fill 0.2s ease, stroke 0.2s ease;
    cursor: pointer;

    &:hover {
      stroke: var(--section-primary) !important;
      stroke-width: 2px !important;
      stroke-dasharray: none !important;
    }
  }
}
</style>
