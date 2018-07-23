import Vue from 'vue';
import { scss } from '@/mixins/colors';

class MockFactory {
  constructor() {
    // Event disaptcher
    this.bus = new Vue();
    // Create a interval for each instance
    this.mockInterval = setInterval(this.randomTick.bind(this), MockFactory.mockSpeed);
  }
  randomTick() {
    const [top, left] = [Math.random(), Math.random()];
    this.bus.$emit('update', { top, left });
  }
  clear() {
    this.mockInterval = clearInterval(this.mockInterval);
  }
  static get mockSpeed() {
    return parseInt(scss.colorTransitionSpeed, 10);
  }
}

export default MockFactory;
