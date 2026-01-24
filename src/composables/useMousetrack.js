import { ref, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { uniqueId } from 'lodash'
import mitt from 'mitt'

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
