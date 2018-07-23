import * as d3 from 'd3';
import { noop, uniqueId } from 'lodash';
import Vue from 'vue';
import MockFactory from '@/utils/mockFactory';

const mockFactory = new MockFactory();

class Mousetrack {
  constructor({ container } = { container: window }) {
    // Event disaptcher
    this.bus = new Vue();
    // The mouse container
    this.container = container;
    // Create a unique event name to bind the window
    this.eventId = `mousemove.mousetrack-${uniqueId()}`;
    // Different behavior on mobile
    if (Mousetrack.isMobile) {
      // This while mock mousemove
      this.mock();
    } else {
      // Bind the mouse event
      this.bind();
    }
  }
  unbind() {
    d3.select(this.container).on(this.eventId, null);
    this.mockFactory = null;
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
  mock() {
    this.mockFactory = mockFactory.bus.$on('update', (value) => {
      if (this.mockFactory) {
        this.randomTick(value);
      }
    });
  }
  randomTick({ top, left }) {
    this.bus.$emit('update', {
      top: top * Mousetrack.clientHeight,
      left: left * Mousetrack.clientWidth,
    });
    this.bus.$emit('update.ratio', { top, left });
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
