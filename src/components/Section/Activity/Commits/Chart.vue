<template>
  <div ref="rootRef" class="activity-commits">
    <div class="activity-commits__wrapper">
      <svg class="activity-commits__svg" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as d3 from 'd3'
import { useD3Tooltip } from '@/composables/useD3Tooltip'
import { useCommitsData } from '@/composables/useCommitsData'
import { useChartDrawing } from '@/composables/useChartDrawing'

const rootRef = ref(null)

const { showTooltip, hideTooltip } = useD3Tooltip()
const {
  weeks,
  yearBoundaries,
  chartWidth,
  chartHeight,
  formatDisplayDate,
  getCellIntensity,
  getYearSeparatorPath
} = useCommitsData()

const svg = computed(() => d3.select(rootRef.value).select('.activity-commits__svg'))

const {
  createPatterns,
  drawYearLabels,
  drawDayLabels,
  drawYearSeparators,
  drawCells,
  updateColors
} = useChartDrawing(svg, { weeks, yearBoundaries, getCellIntensity, getYearSeparatorPath })

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
  drawYearLabels()
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

onMounted(async () => {
  drawChart()
  await nextTick()
  scrollToEnd()

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'data-bs-theme') {
        updateColors()
      }
    }
  })
  observer.observe(document.documentElement, { attributes: true })
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

  &__wrapper {
    width: max-content;
    display: block;
    position: relative;
  }

  &__svg {
    display: block;
    margin-top: 20px;
    font-family: $font-family-mono;
    max-width: none !important;
    flex-shrink: 0;
    overflow: visible !important;
  }

  &__year-label {
    transition: fill $color-transition-duration;
  }

  &__day-label {
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
