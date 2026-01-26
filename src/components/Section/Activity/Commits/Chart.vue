<template>
  <div ref="rootRef" class="activity-commits">
    <div class="activity-commits__years">
      <span
        v-for="(boundary, index) in yearBoundaries"
        :key="boundary.year"
        class="activity-commits__year-label"
        :style="getYearLabelStyle(boundary, index)"
      >
        {{ boundary.year }}
      </span>
    </div>
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
const scrollLeft = ref(0)
const navOffset = ref(0)
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

function getYearLabelX(weekIndex) {
  return LABEL_WIDTH + PADDING + (weekIndex * (CELL_SIZE + CELL_GAP))
}

function getYearLabelStyle(boundary, index) {
  const originalX = getYearLabelX(boundary.weekIndex)
  const nextBoundary = yearBoundaries.value[index + 1]
  const nextX = nextBoundary ? getYearLabelX(nextBoundary.weekIndex) : Infinity

  // Calculate where this label should be positioned
  let x = originalX

  // Account for nav offset when sticking
  const stickyPosition = scrollLeft.value + navOffset.value

  // If scrolled past the original position, stick to the left (scroll position + nav offset)
  if (stickyPosition > originalX) {
    x = stickyPosition
  }

  // But don't overlap with the next year label - stop before it
  const labelWidth = 40 // approximate width of year label
  if (x + labelWidth > nextX) {
    x = nextX - labelWidth
  }

  return { transform: `translateX(${x}px)` }
}

function updateScrollPosition() {
  if (scrollContainer) {
    scrollLeft.value = scrollContainer.scrollLeft
  }
}

function updateNavOffset() {
  if (!scrollContainer) return
  // Calculate how much of the scroll container is hidden behind the nav
  const containerRect = scrollContainer.getBoundingClientRect()
  const nav = document.querySelector('.section-nav__band')
  if (nav) {
    const navRect = nav.getBoundingClientRect()
    // If nav overlaps the container, calculate the overlap
    navOffset.value = Math.max(0, navRect.right - containerRect.left)
  } else {
    navOffset.value = 0
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
    scrollContainer.addEventListener('scroll', updateScrollPosition, { passive: true })
  }

  window.addEventListener('resize', updateNavOffset, { passive: true })
  updateNavOffset()

  // Use multiple rAF calls to ensure layout is complete
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToEnd()
      updateScrollPosition()
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
    scrollContainer.removeEventListener('scroll', updateScrollPosition)
  }
  window.removeEventListener('resize', updateNavOffset)
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

  &__years {
    position: absolute;
    left: 0;
    top: 0;
    height: 18px;
    width: 100%;
    z-index: 1;
    pointer-events: none;
  }

  &__year-label {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 10px;
    font-family: $font-family-mono;
    color: var(--section-primary);
    transition: color $color-transition-duration;
    white-space: nowrap;
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
