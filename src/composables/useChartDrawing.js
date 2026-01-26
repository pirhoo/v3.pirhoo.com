import * as d3 from 'd3'
import {
  CELL_SIZE,
  CELL_GAP,
  CELL_RADIUS,
  LABEL_WIDTH,
  MONTH_LABEL_HEIGHT,
  PADDING,
  DAY_LABELS,
  VISIBLE_DAYS,
  HATCH_PATTERNS
} from '@/components/Section/Activity/Commits/config.js'

/**
 * D3-based chart drawing utilities for commit heatmap.
 *
 * Provides functions to render SVG elements for a GitHub-style contribution
 * calendar including patterns, labels, separators, and interactive cells.
 *
 * @param {import('vue').Ref<SVGSVGElement>} svg - Ref to SVG element
 * @param {Object} data - Chart data and utilities
 * @param {import('vue').ComputedRef<Array>} data.weeks - Week data arrays
 * @param {import('vue').ComputedRef<Array>} data.yearBoundaries - Year boundary positions
 * @param {Function} data.getCellIntensity - Get hatch intensity for commit count
 * @param {Function} data.getYearSeparatorPath - Generate SVG path for year separator
 * @returns {Object} Drawing functions
 * @returns {Function} returns.createPatterns - Create SVG hatch patterns in defs
 * @returns {Function} returns.drawYearLabels - Render year labels at top
 * @returns {Function} returns.drawDayLabels - Render day-of-week labels
 * @returns {Function} returns.drawYearSeparators - Render year boundary lines
 * @returns {Function} returns.drawCells - Render commit cells with tooltips
 * @returns {Function} returns.updateColors - Update colors (e.g., on theme change)
 *
 * @example
 * const { createPatterns, drawCells } = useChartDrawing(svgRef, {
 *   weeks, yearBoundaries, getCellIntensity, getYearSeparatorPath
 * })
 */
export function useChartDrawing(svg, { weeks, yearBoundaries, monthBoundaries, getCellIntensity, getYearSeparatorPath }) {
  function createPatterns(defs) {
    HATCH_PATTERNS.forEach(({ id, spacing }) => {
      const pattern = defs.append('pattern')
        .attr('id', id)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', spacing)
        .attr('height', spacing)
        .attr('patternTransform', 'rotate(45)')

      pattern.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', spacing)
        .attr('stroke', 'var(--section-primary)')
        .attr('stroke-width', 1)
    })
  }

  function drawYearLabels() {
    svg.value.selectAll('text.activity-commits__year-label')
      .data(yearBoundaries.value)
      .enter()
      .append('text')
      .attr('class', 'activity-commits__year-label')
      .text(d => d.year)
      .attr('x', d => LABEL_WIDTH + PADDING + (d.weekIndex * (CELL_SIZE + CELL_GAP)))
      .attr('y', YEAR_LABEL_HEIGHT - 3)
      .style('font-size', '10px')
      .style('font-family', 'var(--font-family-mono)')
      .style('fill', 'var(--section-primary)')
  }

  function drawMonthLabels() {
    svg.value.selectAll('text.activity-commits__month-label')
      .data(monthBoundaries.value)
      .enter()
      .append('text')
      .attr('class', 'activity-commits__month-label')
      .text(d => d.label)
      .attr('x', d => LABEL_WIDTH + PADDING + (d.weekIndex * (CELL_SIZE + CELL_GAP)))
      .attr('y', MONTH_LABEL_HEIGHT - 3)
      .style('font-size', '9px')
      .style('font-family', 'var(--font-family-mono)')
      .style('fill', 'var(--text-muted)')
  }

  function drawDayLabels() {
    svg.value.selectAll('text.activity-commits__day-label')
      .data(VISIBLE_DAYS)
      .enter()
      .append('text')
      .attr('class', 'activity-commits__day-label')
      .text(i => DAY_LABELS[i])
      .attr('text-anchor', 'end')
      .attr('x', LABEL_WIDTH - 2)
      .attr('y', i => MONTH_LABEL_HEIGHT + PADDING + (i * (CELL_SIZE + CELL_GAP)) + CELL_SIZE - 2)
      .style('font-size', '9px')
      .style('font-family', 'var(--font-family-mono)')
      .style('fill', 'var(--text-muted)')
  }

  function drawYearSeparators() {
    svg.value.selectAll('path.activity-commits__year-separator')
      .data(yearBoundaries.value.slice(1))
      .enter()
      .append('path')
      .attr('class', 'activity-commits__year-separator')
      .attr('d', d => getYearSeparatorPath(d))
      .attr('fill', 'none')
      .attr('stroke', 'var(--body-color)')
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .style('opacity', 0.8)
  }

  function drawCells(showTooltip, hideTooltip, getTooltipContent) {
    const weekGroups = svg.value.selectAll('g.activity-commits__week')
      .data(weeks.value)
      .enter()
      .append('g')
      .attr('class', 'activity-commits__week')
      .attr('transform', (_, i) => `translate(${LABEL_WIDTH + PADDING + (i * (CELL_SIZE + CELL_GAP))}, ${MONTH_LABEL_HEIGHT + PADDING})`)

    // Store week index on each cell, start hidden for reveal animation
    weekGroups.selectAll('rect.activity-commits__cell')
      .data((d, weekIndex) => d.map(day => ({ ...day, weekIndex })))
      .enter()
      .append('rect')
      .attr('class', 'activity-commits__cell')
      .attr('x', CELL_SIZE / 2)
      .attr('y', d => d.dayOfWeek * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2)
      .attr('width', 0)
      .attr('height', 0)
      .attr('rx', CELL_RADIUS)
      .attr('ry', CELL_RADIUS)
      .attr('fill', 'transparent')
      .attr('stroke', 'var(--border-dashed)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', d => d.count === 0 ? '2,2' : 'none')
      .style('opacity', 0)
      .on('mouseover', (event, d) => showTooltip(event, getTooltipContent(d)))
      .on('mouseout', () => hideTooltip())
  }

  function revealCells(scrollContainer) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cells = svg.value.selectAll('rect.activity-commits__cell')

    // Calculate visible range if scroll container provided
    let visibleStart = 0
    let visibleEnd = weeks.value.length - 1

    if (scrollContainer) {
      const scrollLeft = scrollContainer.scrollLeft
      const clientWidth = scrollContainer.clientWidth
      const cellStep = CELL_SIZE + CELL_GAP
      visibleStart = Math.max(0, Math.floor((scrollLeft - LABEL_WIDTH - PADDING) / cellStep) - 2)
      visibleEnd = Math.min(weeks.value.length - 1, Math.ceil((scrollLeft + clientWidth - LABEL_WIDTH - PADDING) / cellStep) + 2)
    }

    // Helper to get final cell attributes
    const getFinalAttrs = d => ({
      x: 0,
      y: d.dayOfWeek * (CELL_SIZE + CELL_GAP),
      width: CELL_SIZE,
      height: CELL_SIZE,
      opacity: 1,
      fill: getCellIntensity(d.count) === 0 ? 'transparent' : `url(#hatch-${getCellIntensity(d.count)})`,
      stroke: d.count > 0 ? 'var(--section-primary)' : 'var(--border-dashed)'
    })

    if (prefersReducedMotion) {
      // No animation - just set final state
      cells
        .attr('x', d => getFinalAttrs(d).x)
        .attr('y', d => getFinalAttrs(d).y)
        .attr('width', d => getFinalAttrs(d).width)
        .attr('height', d => getFinalAttrs(d).height)
        .style('opacity', 1)
        .attr('fill', d => getFinalAttrs(d).fill)
        .attr('stroke', d => getFinalAttrs(d).stroke)
      return
    }

    // Animate visible cells, instant reveal for off-screen
    cells.each(function (d) {
      const cell = d3.select(this)
      const attrs = getFinalAttrs(d)
      const isVisible = d.weekIndex >= visibleStart && d.weekIndex <= visibleEnd

      if (isVisible) {
        // Animate with wave from right to left
        const delay = (visibleEnd - d.weekIndex) * 8 + d.dayOfWeek * 15
        cell.transition()
          .duration(400)
          .delay(delay)
          .ease(d3.easeBackOut.overshoot(1.2))
          .attr('x', attrs.x)
          .attr('y', attrs.y)
          .attr('width', attrs.width)
          .attr('height', attrs.height)
          .style('opacity', attrs.opacity)
          .attr('fill', attrs.fill)
          .attr('stroke', attrs.stroke)
      } else {
        // Instant reveal for off-screen cells
        cell
          .attr('x', attrs.x)
          .attr('y', attrs.y)
          .attr('width', attrs.width)
          .attr('height', attrs.height)
          .style('opacity', attrs.opacity)
          .attr('fill', attrs.fill)
          .attr('stroke', attrs.stroke)
      }
    })
  }

  function updateColors() {
    svg.value.selectAll('rect.activity-commits__cell')
      .attr('fill', d => {
        const intensity = getCellIntensity(d.count)
        if (intensity === 0) return 'transparent'
        return `url(#hatch-${intensity})`
      })
      .attr('stroke', d => d.count > 0 ? 'var(--section-primary)' : 'var(--border-dashed)')

    svg.value.selectAll('path.activity-commits__year-separator')
      .attr('stroke', 'var(--body-color)')

    svg.value.selectAll('defs pattern line')
      .attr('stroke', 'var(--section-primary)')
  }

  return {
    createPatterns,
    drawYearLabels,
    drawMonthLabels,
    drawDayLabels,
    drawYearSeparators,
    drawCells,
    revealCells,
    updateColors
  }
}
