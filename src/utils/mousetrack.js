import * as d3 from 'd3'
import { noop, uniqueId } from 'lodash'
import mitt from 'mitt'

class Mousetrack {
  constructor({ container } = { container: window }) {
    // Event dispatcher using mitt
    this.bus = mitt()
    // The mouse container
    this.container = container
    // Create a unique event name to bind the window
    this.eventId = `mousemove.mousetrack-${uniqueId()}`
    // Disable on mobile
    if (!Mousetrack.isMobile) {
      // Bind the mouse event
      this.bind()
    }
  }

  unbind() {
    d3.select(this.container).on(this.eventId, null)
  }

  bind() {
    this.unbind()
    // Bind mouse on container (and remove any other one)
    return d3.select(this.container).on(this.eventId, event => this.update(event))
  }

  update(event) {
    this.bus.emit('update', Mousetrack.getValues(event))
    this.bus.emit('update.ratio', Mousetrack.getValuesRatio(event))
  }

  on(typenames, callback = noop) {
    return this.bus.on(typenames, callback)
  }

  static get clientHeight() {
    return document.documentElement.clientHeight
  }

  static get clientWidth() {
    return document.documentElement.clientWidth
  }

  static get isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }

  static getValues(event) {
    return {
      top: event.clientY,
      left: event.clientX
    }
  }

  static getValuesRatio(event) {
    const { top, left } = Mousetrack.getValues(event)
    return {
      top: top / Math.max(1, Mousetrack.clientHeight),
      left: left / Math.max(1, Mousetrack.clientWidth)
    }
  }
}

export default Mousetrack
