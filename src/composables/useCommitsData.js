import { computed } from 'vue'
import * as d3 from 'd3'
import commits from '@/assets/json/commits.json'
import {
  CELL_SIZE,
  CELL_GAP,
  CELL_RADIUS,
  LABEL_WIDTH,
  YEAR_LABEL_HEIGHT,
  MONTH_LABEL_HEIGHT,
  PADDING,
  MONTH_NAMES
} from '@/components/Section/Activity/Commits/config.js'

/**
 * Commit data processing for heatmap visualization.
 *
 * Processes raw commit JSON data into weekly grid format suitable for
 * D3 rendering, with computed dimensions and intensity scaling.
 *
 * @returns {Object} Processed commit data and utilities
 * @returns {import('vue').ComputedRef<Array<Array<Object>>>} returns.weeks - 2D array of day objects grouped by week
 * @returns {import('vue').ComputedRef<Array<Object>>} returns.yearBoundaries - Year boundary positions for separators
 * @returns {import('vue').ComputedRef<number>} returns.chartWidth - Total chart width in pixels
 * @returns {import('vue').ComputedRef<number>} returns.chartHeight - Total chart height in pixels
 * @returns {Function} returns.formatDisplayDate - Format date for tooltip display
 * @returns {Function} returns.getCellIntensity - Get intensity level (0-5) for commit count
 * @returns {Function} returns.getYearSeparatorPath - Generate SVG path string for year boundary
 *
 * @example
 * const { weeks, chartWidth, chartHeight, getCellIntensity } = useCommitsData()
 */
export function useCommitsData() {
  const dateRange = computed(() => {
    const older = new Date(commits.olderCommit.timestamp * 1000)
    const newer = new Date(commits.newerCommit.timestamp * 1000)

    const start = new Date(older)
    start.setDate(start.getDate() - start.getDay())
    start.setHours(0, 0, 0, 0)

    const end = new Date(newer)
    end.setDate(end.getDate() + (6 - end.getDay()))
    end.setHours(23, 59, 59, 999)

    return { start, end }
  })

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

  const yearBoundaries = computed(() => {
    const boundaries = []
    let currentYear = null

    weeks.value.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0].date
      const year = firstDayOfWeek.getFullYear()

      if (year !== currentYear) {
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

  const monthBoundaries = computed(() => {
    const boundaries = []
    let currentMonth = null

    weeks.value.forEach((week, weekIndex) => {
      // Check first day of the week
      const firstDayOfWeek = week[0].date
      const month = firstDayOfWeek.getMonth()
      const year = firstDayOfWeek.getFullYear()
      const monthKey = `${year}-${month}`

      if (monthKey !== currentMonth) {
        boundaries.push({
          month,
          year,
          weekIndex,
          label: MONTH_NAMES[month]
        })
        currentMonth = monthKey
      }
    })

    return boundaries
  })

  const allCounts = computed(() => {
    return Object.values(commits.daysCount).filter(v => v > 0).sort((a, b) => a - b)
  })

  const intensityScale = computed(() => {
    if (allCounts.value.length === 0) return () => 1
    const maxCount = Math.max(...allCounts.value)
    // Exponential scale with 5 buckets for better distribution of high-activity days
    return d3.scalePow()
      .exponent(0.4)
      .domain([1, maxCount])
      .range([1, 5])
  })

  const chartWidth = computed(() => {
    return LABEL_WIDTH + PADDING + (weeks.value.length * (CELL_SIZE + CELL_GAP)) + PADDING
  })

  const chartHeight = computed(() => {
    return YEAR_LABEL_HEIGHT + MONTH_LABEL_HEIGHT + PADDING + (7 * (CELL_SIZE + CELL_GAP))
  })

  function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function formatDisplayDate(date) {
    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  function getCellIntensity(count) {
    if (count === 0) return 0
    return Math.round(intensityScale.value(count))
  }

  function getYearSeparatorPath(boundary) {
    const { weekIndex, startDayOfWeek } = boundary
    const x = LABEL_WIDTH + PADDING + (weekIndex * (CELL_SIZE + CELL_GAP)) - (CELL_GAP / 2)
    const topY = YEAR_LABEL_HEIGHT + MONTH_LABEL_HEIGHT + PADDING - (CELL_GAP / 2)
    const bottomY = YEAR_LABEL_HEIGHT + MONTH_LABEL_HEIGHT + PADDING + (7 * (CELL_SIZE + CELL_GAP)) - (CELL_GAP / 2)
    const stepX = x - (CELL_SIZE + CELL_GAP)
    const stepY = topY + (startDayOfWeek * (CELL_SIZE + CELL_GAP))
    const r = CELL_RADIUS

    if (startDayOfWeek === 0) {
      return `M ${x} ${topY} L ${x} ${bottomY}`
    }

    return `M ${x} ${topY}
            L ${x} ${stepY - r}
            Q ${x} ${stepY} ${x - r} ${stepY}
            L ${stepX + r} ${stepY}
            Q ${stepX} ${stepY} ${stepX} ${stepY + r}
            L ${stepX} ${bottomY}`
  }

  return {
    weeks,
    yearBoundaries,
    monthBoundaries,
    chartWidth,
    chartHeight,
    formatDisplayDate,
    getCellIntensity,
    getYearSeparatorPath
  }
}
