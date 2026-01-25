import { ref, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { uniqueId } from 'lodash'
import mitt from 'mitt'

/**
 * Mouse position tracking with event bus.
 *
 * Tracks mouse movement within a container and emits position updates
 * via an event bus. Automatically disabled on mobile devices.
 *
 * @module useMousetrack
 */

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

function getClientDimensions() {
  return {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
  }
}

function getValues(event) {
  return {
    top: event.clientY,
    left: event.clientX
  }
}

function getValuesRatio(event) {
  const { top, left } = getValues(event)
  const { height, width } = getClientDimensions()
  return {
    top: top / Math.max(1, height),
    left: left / Math.max(1, width)
  }
}

/**
 * Set up mouse tracking on a container element.
 *
 * @param {Window|HTMLElement} [container=window] - Container to track mouse within
 * @returns {Object} Mouse tracking utilities
 * @returns {boolean} returns.isMobile - Whether device is mobile (tracking disabled)
 * @returns {import('vue').Ref<boolean>} returns.isActive - Whether tracking is currently active
 * @returns {Function} returns.bind - Start tracking mouse movement
 * @returns {Function} returns.unbind - Stop tracking mouse movement
 * @returns {Function} returns.on - Subscribe to events ('update', 'update.ratio')
 * @returns {Function} returns.getClientDimensions - Get viewport dimensions
 * @returns {Function} returns.getValues - Get absolute mouse position from event
 * @returns {Function} returns.getValuesRatio - Get mouse position as 0-1 ratio from event
 *
 * @example
 * const { on, isActive } = useMousetrack()
 *
 * on('update.ratio', ({ top, left }) => {
 *   // top and left are 0-1 ratios
 *   console.log(`Mouse at ${left * 100}% horizontal`)
 * })
 */
export function useMousetrack(container = window) {
  const bus = mitt()
  const eventId = `mousemove.mousetrack-${uniqueId()}`
  const isActive = ref(false)

  function update(event) {
    bus.emit('update', getValues(event))
    bus.emit('update.ratio', getValuesRatio(event))
  }

  function bind() {
    unbind()
    d3.select(container).on(eventId, event => update(event))
    isActive.value = true
  }

  function unbind() {
    d3.select(container).on(eventId, null)
    isActive.value = false
  }

  function on(typenames, callback) {
    return bus.on(typenames, callback)
  }

  onMounted(() => {
    if (!isMobile) {
      bind()
    }
  })

  onUnmounted(() => {
    unbind()
  })

  return {
    isMobile,
    isActive,
    bind,
    unbind,
    on,
    getClientDimensions,
    getValues,
    getValuesRatio
  }
}
