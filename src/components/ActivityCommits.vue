<template>
  <div ref="rootRef" class="activity__commits" @show="drawCommits">
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
import { range, sortBy, reduce, keys, maxBy, minBy } from 'lodash'
import * as d3 from 'd3'
import commits from '@/assets/json/commits.json'

const rootRef = ref(null)
const wrapperRef = ref(null)
let tooltip = null

const padding = 20
const monthWidth = Math.max(25, (window.innerWidth - 20) / keys(commits.monthsCount).length)
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const svg = computed(() => d3.select(rootRef.value).select('svg'))

const data = computed(() => {
  return sortBy(reduce(keys(commits.monthsCount), (arr, month) => arr.concat([
    {
      month: new Date(month),
      count: commits.monthsCount[month].count,
      repositories: commits.monthsCount[month].repositories
    }
  ]), []), 'month')
})

const width = computed(() => monthWidth * data.value.length)
const height = computed(() => svg.value.node()?.getBoundingClientRect().height || 250)

const older = computed(() => new Date(commits.olderCommit.timestamp * 1000))
const newer = computed(() => new Date(commits.newerCommit.timestamp * 1000))

const commitCountMax = computed(() => maxBy(data.value, 'count').count)
const commitCountMin = computed(() => minBy(data.value, 'count').count)

const years = computed(() => range(older.value.getFullYear(), newer.value.getFullYear() + 1))

const xScaleFn = computed(() => {
  return d3.scaleTime()
    .domain([older.value, newer.value])
    .range([padding, width.value - (padding * 2)])
})

const yScaleFn = computed(() => {
  return d3.scaleLinear()
    .domain([commitCountMin.value, commitCountMax.value])
    .range([height.value - (padding * 2), padding])
})

const yearWidthFn = computed(() => {
  return y => xScaleFn.value(new Date(y + 1, 0, 1)) - xScaleFn.value(new Date(y, 0, 1))
})

const lineFn = computed(() => {
  return d3.line()
    .curve(d3.curveMonotoneX)
    .x(d => xScaleFn.value(d.month))
    .y(d => yScaleFn.value(d.count))
})

function getTooltipContent(d) {
  const projectsCount = keys(d.repositories).length
  return `${months[d.month.getMonth()]} ${d.month.getFullYear()}:
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
    .style('top', `${event.pageY - 40}px`)
}

function hideTooltip() {
  tooltip.style('opacity', 0)
}

function drawSvg() {
  svg.value.style('width', `${width.value}px`)
}

function drawYears() {
  svg.value.selectAll('g.activity__commits__chart__year')
    .data(years.value)
    .enter()
    .append('g')
    .attr('class', 'activity__commits__chart__year')
    .append('rect')
    .attr('x', y => xScaleFn.value(new Date(y, 0, 1)))
    .attr('y', 0)
    .attr('width', yearWidthFn.value)
    .attr('height', height.value)

  svg.value.selectAll('g.activity__commits__chart__year')
    .append('text')
    .attr('class', 'activity__commits__chart__year__label')
    .text(y => y)
    .attr('text-anchor', 'middle')
    .attr('x', y => {
      const x = xScaleFn.value(new Date(y, 0, 1)) + (yearWidthFn.value(y) / 2)
      return Math.min(width.value - 25, Math.max(25, x))
    })
    .attr('y', 20)
}

function drawCommitsLine() {
  const path = svg.value.append('path')
    .datum(data.value)
    .attr('class', 'activity__commits__chart__line')
    .attr('d', lineFn.value)

  const totalLength = path.node().getTotalLength()
  path
    .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0)
}

function drawCommitsDots() {
  svg.value.selectAll('circle.activity__commits__chart__dot')
    .data(data.value)
    .enter()
    .append('circle')
    .attr('opacity', 0)
    .attr('class', 'activity__commits__chart__dot')
    .attr('cx', d => xScaleFn.value(d.month))
    .attr('cy', d => yScaleFn.value(d.count))
    .attr('r', 4)
    .on('mouseover', (event, d) => showTooltip(event, d))
    .on('mouseout', () => hideTooltip())
    .transition()
    .duration(100)
    .delay((_, i) => 2000 * (i / data.value.length))
    .ease(d3.easeLinear)
    .attr('opacity', 1)
}

function drawCommits() {
  drawCommitsLine()
  drawCommitsDots()
}

function updateScrollbar() {
  if (wrapperRef.value) {
    const x = wrapperRef.value.offsetWidth
    wrapperRef.value.scrollTo(x, 0)
  }
}

onMounted(() => {
  createTooltip()
  drawSvg()
  drawYears()
  drawCommits()
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
      width:100%;
      display: block;
      overflow: hidden;
      position: relative;
      padding-bottom: $spacer;
    }

    &__chart {
      margin: 0 auto;
      margin-top: 40px;
      height: 250px;
      font-family: $font-family-base;

      &__year {

        rect {
          fill: white;
        }

        &:nth-child(odd) rect {
          fill: var(--section-text);
          transition: fill $color-transition-duration;
          opacity: .1;
        }

        &__label {
          fill: var(--section-primary);
          transition: fill $color-transition-duration;
        }
      }

      &__line {
        stroke:var(--section-primary);
        stroke-width:3px;
        fill:transparent;
        transition: stroke $color-transition-duration;
      }

      &__dot {
        fill:var(--section-primary);
        transition: fill $color-transition-duration;
      }
    }
  }
</style>
