import { onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'

/**
 * D3-based tooltip management.
 *
 * Creates a fixed-position tooltip element that follows the cursor and
 * automatically repositions to stay within viewport bounds.
 *
 * @returns {Object} Tooltip controls
 * @returns {Function} returns.showTooltip - Show tooltip with content at mouse position
 * @returns {Function} returns.hideTooltip - Hide the tooltip
 *
 * @example
 * const { showTooltip, hideTooltip } = useD3Tooltip()
 *
 * // On element hover
 * element.on('mouseover', (event, d) => showTooltip(event, `<strong>${d.name}</strong>`))
 * element.on('mouseout', () => hideTooltip())
 */
export function useD3Tooltip() {
  let tooltip = null

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

  function showTooltip(event, content) {
    tooltip.html(content).style('opacity', 1)

    const tooltipNode = tooltip.node()
    const tooltipWidth = tooltipNode.offsetWidth
    const tooltipHeight = tooltipNode.offsetHeight

    let left = event.clientX - (tooltipWidth / 2)
    let top = event.clientY - tooltipHeight - 10

    const padding = 8
    left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, left))
    top = Math.max(padding, top)

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

  function destroyTooltip() {
    if (tooltip) {
      tooltip.remove()
      tooltip = null
    }
  }

  onMounted(() => {
    createTooltip()
  })

  onUnmounted(() => {
    destroyTooltip()
  })

  return {
    showTooltip,
    hideTooltip
  }
}
