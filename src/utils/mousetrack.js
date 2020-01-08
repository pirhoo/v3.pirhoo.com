import * as d3 from 'd3';
import { noop, uniqueId } from 'lodash';
import Vue from 'vue';

class Mousetrack {
  constructor({ container } = { container: window }) {
    // Event disaptcher
    this.bus = new Vue();
    // The mouse container
    this.container = container;
    // Create a unique event name to bind the window
    this.eventId = `mousemove.mousetrack-${uniqueId()}`;
    // Disable on mobile
    if (!Mousetrack.isMobile) {
      // Bind the mouse event
      this.bind();
    }
  }

  unbind() {
    d3.select(this.container).on(this.eventId, null);
  }

  bind() {
    this.unbind();
    // Bind mouse on container (and remove any other one)
    return d3.select(this.container).on(this.eventId, this.update.bind(this));
  }

  update() {
    this.bus.$emit('update', Mousetrack.values);
    this.bus.$emit('update.ratio', Mousetrack.valuesRatio);
  }

  on(typenames, callback = noop) {
    return this.bus.$on(typenames, callback);
  }

  static get clientHeight() {
    return document.documentElement.clientHeight;
  }

  static get clientWidth() {
    return document.documentElement.clientWidth;
  }

  static get isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  static get values() {
    return {
      top: d3.event.clientY,
      left: d3.event.clientX,
    };
  }

  static get valuesRatio() {
    const { top, left } = Mousetrack.values;
    return {
      top: top / Math.max(1, Mousetrack.clientHeight),
      left: left / Math.max(1, Mousetrack.clientWidth),
    };
  }
}

export default Mousetrack;
