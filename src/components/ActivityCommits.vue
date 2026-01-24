<template>
  <div ref="rootRef" class="activity__commits">
    <div ref="wrapperRef" class="activity__commits__wrapper">
      <svg class="activity__commits__chart" />
    </div>
    <h3 class="activity__commits__lead mt-2">
      <abbr title="A submission of my latest changes of a source code">Commits</abbr>
      by month
    </h3>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { keys, range } from 'lodash'
import * as d3 from 'd3'
import commits from '@/assets/json/commits.json'

const rootRef = ref(null)
const wrapperRef = ref(null)
let tooltip = null

// Configuration
const cellWidth = 40
const cellHeight = 15
const cellGap = 2
const labelWidth = 35
const labelHeight = 20
const padding = 10

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const svg = computed(() => d3.select(rootRef.value).select('svg'))

// Parse dates and find year range
const parsedData = computed(() => {
  const result = {}
  for (const dateStr of keys(commits.monthsCount)) {
    const [year, month] = dateStr.split('-').map(Number)
    if (!result[year]) result[year] = {}
    result[year][month - 1] = commits.monthsCount[dateStr]
  }
  return result
})

const years = computed(() => {
  const allYears = keys(parsedData.value).map(Number)
  const minYear = Math.min(...allYears)
  const maxYear = Math.max(...allYears)
  return range(minYear, maxYear + 1)
})

const grid = computed(() => {
  return years.value.map(year => {
    return range(12).map(month => {
      const data = parsedData.value[year]?.[month]
      return {
        year,
        month,
        count: data?.count || 0,
        repositories: data?.repositories || {}
      }
    })
  })
})

// Get all non-zero counts for quantile scale
const allCounts = computed(() => {
  const counts = []
  for (const yearData of Object.values(parsedData.value)) {
    for (const monthData of Object.values(yearData)) {
      if (monthData.count > 0) counts.push(monthData.count)
    }
  }
  return counts.sort((a, b) => a - b)
})

const colorScale = computed(() => {
  return d3.scaleQuantile()
    .domain(allCounts.value)
    .range(['#9be9a8', '#40c463', '#30a14e', '#216e39'])
})

const width = computed(() => labelWidth + padding + (years.value.length * (cellWidth + cellGap)))
const height = computed(() => labelHeight + padding + (12 * (cellHeight + cellGap)) + padding)

function getTooltipContent(d) {
  const projectsCount = keys(d.repositories).length
  if (d.count === 0) {
    return `No commits in ${monthsFull[d.month]} ${d.year}`
  }
  return `${monthsFull[d.month]} ${d.year}:
      <strong>${d.count} commits</strong><br />
      on ${projectsCount} project${projectsCount > 1 ? 's' : ''}`
}

function createTooltip() {
  tooltip = d3.select('body')
    .append('div')
    .attr('class', 'd3-tip n')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('pointer-events', 'none')
}

function showTooltip(event, d) {
  tooltip
    .html(getTooltipContent(d))
    .style('opacity', 1)
    .style('left', `${event.pageX}px`)
    .style('top', `${event.pageY - 50}px`)
}

function hideTooltip() {
  tooltip.style('opacity', 0)
}

function getCellColor(count) {
  if (count === 0) return '#ebedf0'
  return colorScale.value(count)
}

function drawChart() {
  svg.value
    .style('width', `${width.value}px`)
    .style('height', `${height.value}px`)

  // Draw year labels
  svg.value.selectAll('text.activity__commits__chart__year-label')
    .data(years.value)
    .enter()
    .append('text')
    .attr('class', 'activity__commits__chart__year-label')
    .text(y => y)
    .attr('text-anchor', 'middle')
    .attr('x', (_, i) => labelWidth + padding + (i * (cellWidth + cellGap)) + (cellWidth / 2))
    .attr('y', labelHeight - 5)
    .style('font-size', '10px')
    .style('fill', 'var(--section-primary)')

  // Draw month labels
  svg.value.selectAll('text.activity__commits__chart__month-label')
    .data(monthLabels)
    .enter()
    .append('text')
    .attr('class', 'activity__commits__chart__month-label')
    .text(m => m)
    .attr('text-anchor', 'end')
    .attr('x', labelWidth)
    .attr('y', (_, i) => labelHeight + padding + (i * (cellHeight + cellGap)) + (cellHeight / 2) + 4)
    .style('font-size', '10px')
    .style('fill', 'var(--section-text)')

  // Draw cells
  const yearGroups = svg.value.selectAll('g.activity__commits__chart__year')
    .data(grid.value)
    .enter()
    .append('g')
    .attr('class', 'activity__commits__chart__year')
    .attr('transform', (_, i) => `translate(${labelWidth + padding + (i * (cellWidth + cellGap))}, ${labelHeight + padding})`)

  yearGroups.selectAll('rect.activity__commits__chart__cell')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('class', 'activity__commits__chart__cell')
    .attr('x', 0)
    .attr('y', (_, i) => i * (cellHeight + cellGap))
    .attr('width', cellWidth)
    .attr('height', cellHeight)
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('fill', '#ebedf0')
    .on('mouseover', (event, d) => showTooltip(event, d))
    .on('mouseout', () => hideTooltip())
    .transition()
    .duration(500)
    .delay((d, i, nodes) => {
      // Get parent group index for staggered animation by year
      const parentData = d3.select(nodes[i].parentNode).datum()
      const yearIndex = grid.value.indexOf(parentData)
      return yearIndex * 50 + i * 20
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

onMounted(() => {
  createTooltip()
  drawChart()
  updateScrollbar()
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

      &__month-label {
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
