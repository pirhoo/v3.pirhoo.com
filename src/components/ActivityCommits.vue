<template>
  <div ref="rootRef" class="activity__commits">
    <div
      ref="wrapperRef"
      class="activity__commits__wrapper"
      style="cursor: grab"
      @mousedown="onDragStart"
    >
      <svg class="activity__commits__chart" />
    </div>
    <h3 class="activity__commits__lead mt-2">
      <abbr title="A submission of my latest changes of a source code">Commits</abbr>
      by day
    </h3>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as d3 from 'd3'
import * as chroma from 'chroma-js'
import commits from '@/assets/json/commits.json'
import { useColors, colorRatio } from '@/composables/useColors'
import { useDragScroll } from '@/composables/useDragScroll'

const { colorScalePrimary } = useColors()
const primaryColor = colorScalePrimary.value(colorRatio)

const rootRef = ref(null)
const wrapperRef = ref(null)
let tooltip = null

const { onMouseDown: onDragStart } = useDragScroll()

// Configuration
const cellSize = 16
const cellGap = 3
const cellRadius = 3
const labelWidth = 30
const yearLabelHeight = 18
const padding = 5

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const svg = computed(() => d3.select(rootRef.value).select('svg'))

// Get date range from commits
const dateRange = computed(() => {
  const older = new Date(commits.olderCommit.timestamp * 1000)
  const newer = new Date(commits.newerCommit.timestamp * 1000)

  // Start from the beginning of the week containing the older commit
  const start = new Date(older)
  start.setDate(start.getDate() - start.getDay())
  start.setHours(0, 0, 0, 0)

  // End at the end of the week containing the newer commit
  const end = new Date(newer)
  end.setDate(end.getDate() + (6 - end.getDay()))
  end.setHours(23, 59, 59, 999)

  return { start, end }
})

// Generate all weeks
const weeks = computed(() => {
  const result = []
  const current = new Date(dateRange.value.start)

  while (current <= dateRange.value.end) {
    const week = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(current)
      const dateStr = formatDate(date)
      week.push({
        date,
        dateStr,
        count: commits.daysCount[dateStr] || 0,
        dayOfWeek: i
      })
      current.setDate(current.getDate() + 1)
    }
    result.push(week)
  }

  return result
})

// Get year boundaries for labels and separators
const yearBoundaries = computed(() => {
  const boundaries = []
  let currentYear = null

  weeks.value.forEach((week, weekIndex) => {
    const firstDayOfWeek = week[0].date
    const year = firstDayOfWeek.getFullYear()

    if (year !== currentYear) {
      // Find which day of the week Jan 1st falls on
      const jan1 = new Date(year, 0, 1)
      const jan1DayOfWeek = jan1.getDay()

      boundaries.push({
        year,
        weekIndex,
        startDayOfWeek: jan1DayOfWeek
      })
      currentYear = year
    }
  })

  return boundaries
})

// Generate path for year separators with rounded corners
function getYearSeparatorPath(boundary) {
  const { weekIndex, startDayOfWeek } = boundary
  const x = labelWidth + padding + (weekIndex * (cellSize + cellGap)) - (cellGap / 2)
  const topY = yearLabelHeight + padding - (cellGap / 2)
  const bottomY = yearLabelHeight + padding + (7 * (cellSize + cellGap)) - (cellGap / 2)
  const stepX = x - (cellSize + cellGap)
  const stepY = topY + (startDayOfWeek * (cellSize + cellGap))
  const r = cellRadius // corner radius

  if (startDayOfWeek === 0) {
    // Year starts on Sunday - simple vertical line
    return `M ${x} ${topY} L ${x} ${bottomY}`
  }

  // Stepped path with rounded corners using quadratic Bezier curves
  return `M ${x} ${topY}
          L ${x} ${stepY - r}
          Q ${x} ${stepY} ${x - r} ${stepY}
          L ${stepX + r} ${stepY}
          Q ${stepX} ${stepY} ${stepX} ${stepY + r}
          L ${stepX} ${bottomY}`
}

// Get all non-zero counts for quantile scale
const allCounts = computed(() => {
  return Object.values(commits.daysCount).filter(v => v > 0).sort((a, b) => a - b)
})

// Create color scale from light to primary color
const colorRange = chroma.scale(['#ebedf0', primaryColor]).mode('lab').colors(4)

const colorScale = computed(() => {
  return d3.scaleQuantile()
    .domain(allCounts.value)
    .range(colorRange)
})

const width = computed(() => labelWidth + padding + (weeks.value.length * (cellSize + cellGap)))
const height = computed(() => yearLabelHeight + padding + (7 * (cellSize + cellGap)) + padding)

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDisplayDate(date) {
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function getTooltipContent(d) {
  if (d.count === 0) {
    return `No commits on ${formatDisplayDate(d.date)}`
  }
  return `<strong>${d.count} commit${d.count > 1 ? 's' : ''}</strong> on ${formatDisplayDate(d.date)}`
}

function createTooltip() {
  tooltip = d3.select('body')
    .append('div')
    .attr('class', 'd3-tip')
    .style('opacity', 0)
    .style('position', 'fixed')
    .style('pointer-events', 'none')
    .style('z-index', '9999')
    .style('white-space', 'nowrap')
}

function showTooltip(event, d) {
  tooltip.html(getTooltipContent(d)).style('opacity', 1)

  // Need to get dimensions after making visible and setting content
  const tooltipNode = tooltip.node()
  const tooltipWidth = tooltipNode.offsetWidth
  const tooltipHeight = tooltipNode.offsetHeight

  // Calculate centered position above the cell
  let left = event.clientX - (tooltipWidth / 2)
  let top = event.clientY - tooltipHeight - 10

  // Clamp to viewport bounds
  const padding = 8
  left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, left))
  top = Math.max(padding, top)

  // If not enough space above, show below
  if (top < padding) {
    top = event.clientY + 15
  }

  tooltip
    .style('left', `${left}px`)
    .style('top', `${top}px`)
}

function hideTooltip() {
  tooltip.style('opacity', 0)
}

function getCellColor(count) {
  if (count === 0) return getComputedStyle(document.documentElement).getPropertyValue('--activity-cell-empty').trim() || '#ebedf0'
  return colorScale.value(count)
}

function drawChart() {
  svg.value
    .style('width', `${width.value}px`)
    .style('height', `${height.value}px`)

  // Draw year labels
  svg.value.selectAll('text.activity__commits__chart__year-label')
    .data(yearBoundaries.value)
    .enter()
    .append('text')
    .attr('class', 'activity__commits__chart__year-label')
    .text(d => d.year)
    .attr('x', d => labelWidth + padding + (d.weekIndex * (cellSize + cellGap)))
    .attr('y', yearLabelHeight - 3)
    .style('font-size', '10px')
    .style('fill', 'var(--section-primary)')

  // Draw day labels (only Mon, Wed, Fri for space)
  const visibleDays = [1, 3, 5] // Mon, Wed, Fri
  svg.value.selectAll('text.activity__commits__chart__day-label')
    .data(visibleDays)
    .enter()
    .append('text')
    .attr('class', 'activity__commits__chart__day-label')
    .text(i => dayLabels[i])
    .attr('text-anchor', 'end')
    .attr('x', labelWidth - 2)
    .attr('y', i => yearLabelHeight + padding + (i * (cellSize + cellGap)) + cellSize - 2)
    .style('font-size', '9px')
    .style('fill', 'var(--section-text)')

  // Draw year separators (skip first year)
  svg.value.selectAll('path.activity__commits__chart__year-separator')
    .data(yearBoundaries.value.slice(1))
    .enter()
    .append('path')
    .attr('class', 'activity__commits__chart__year-separator')
    .attr('d', d => getYearSeparatorPath(d))
    .attr('fill', 'none')
    .attr('stroke', 'var(--year-separator-color)')
    .attr('stroke-width', 2)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')

  // Draw cells
  const weekGroups = svg.value.selectAll('g.activity__commits__chart__week')
    .data(weeks.value)
    .enter()
    .append('g')
    .attr('class', 'activity__commits__chart__week')
    .attr('transform', (_, i) => `translate(${labelWidth + padding + (i * (cellSize + cellGap))}, ${yearLabelHeight + padding})`)

  weekGroups.selectAll('rect.activity__commits__chart__cell')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('class', 'activity__commits__chart__cell')
    .attr('x', 0)
    .attr('y', d => d.dayOfWeek * (cellSize + cellGap))
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('rx', cellRadius)
    .attr('ry', cellRadius)
    .attr('fill', () => getCellColor(0))
    .on('mouseover', (event, d) => showTooltip(event, d))
    .on('mouseout', () => hideTooltip())
    .transition()
    .duration(500)
    .delay((_, i, nodes) => {
      const parentData = d3.select(nodes[i].parentNode).datum()
      const weekIndex = weeks.value.indexOf(parentData)
      return weekIndex * 2
    })
    .attr('fill', d => getCellColor(d.count))
}

function updateScrollbar() {
  if (wrapperRef.value) {
    const scrollWidth = wrapperRef.value.scrollWidth
    const clientWidth = wrapperRef.value.clientWidth
    wrapperRef.value.scrollTo(scrollWidth - clientWidth, 0)
  }
}

function updateChartColors() {
  // Update cell colors
  svg.value.selectAll('rect.activity__commits__chart__cell')
    .attr('fill', d => getCellColor(d.count))

  // Update year separator colors
  svg.value.selectAll('path.activity__commits__chart__year-separator')
    .attr('stroke', 'var(--year-separator-color)')
}

onMounted(async () => {
  createTooltip()
  drawChart()
  await nextTick()
  updateScrollbar()

  // Watch for theme changes
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'data-theme') {
        updateChartColors()
      }
    }
  })
  observer.observe(document.documentElement, { attributes: true })
})

onUnmounted(() => {
  if (tooltip) {
    tooltip.remove()
  }
})
</script>

<style lang="scss">
  @import '../utils/_variables.scss';
  @import '../utils/_tip.scss';
  @import '../utils/_mixins.scss';
  @import '../utils/_animations.scss';

  .activity__commits {
    z-index: 0;
    position: relative;

    &__lead {
      font-size: .9rem;
      text-transform: uppercase;
      text-align: center;
    }

    &__wrapper {
      width: 100%;
      display: block;
      overflow-x: auto;
      overflow-y: hidden;
      position: relative;
      padding-bottom: $spacer;
    }

    &__chart {
      display: block;
      margin: 0 auto;
      margin-top: 20px;
      font-family: $font-family-base;

      &__year-label {
        transition: fill $color-transition-duration;
      }

      &__day-label {
        transition: fill $color-transition-duration;
      }

      &__cell {
        transition: fill 0.2s ease;
        cursor: pointer;

        &:hover {
          stroke: var(--section-primary);
          stroke-width: 1px;
        }
      }
    }
  }
</style>
