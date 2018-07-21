import * as d3 from 'd3';
import { noop, uniqueId } from 'lodash';
import Vue from 'vue';

class Scrolltrack {
  constructor(container = window) {
    // Event disaptcher
    this.bus = new Vue();
    // The scroll container
    this.container = container;
    // Create a unique event name to bind the window
    this.eventId = `scroll.scrolltrack-${uniqueId()}`;
    // Bind the scroll event
    this.bind();
  }
  unbind() {
    return d3.select(this.container).on(this.eventId, null);
  }
  bind() {
    this.unbind();
    // Bind scroll on container (and remove any other one)
    return d3.select(this.container).on(this.eventId, this.scroll.bind(this));
  }
  scroll() {
    this.bus.$emit('scroll', this.containerScroll);
    this.bus.$emit('scroll.ratio', this.containerScrollRatio);
  }
  on(typenames, callback = noop) {
    return this.bus.$on(typenames, callback);
  }
  get containerScroll() {
    return {
      top: this.container.scrollY,
      left: this.container.scrollX,
    };
  }
  get containerScrollRatio() {
    const { top, left } = this.containerScroll;
    return {
      top: top / Math.max(1, Scrolltrack.documentHeight - document.documentElement.clientHeight),
      left: left / Math.max(1, Scrolltrack.documentWidth - document.documentElement.clientWidth),
    };
  }
  static get documentHeight() {
    return Math.max(
      document.body.clientHeight,
      document.body.offsetHeight,
      document.body.scrollHeight,
    );
  }
  static get documentWidth() {
    return Math.max(
      document.body.clientWidth,
      document.body.offsetWidth,
      document.body.scrollWidth,
    );
  }
}

export default Scrolltrack;
