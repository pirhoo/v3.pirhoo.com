<template>
  <div class="gradient-on-scroll">
    <canvas class="gradient-on-scroll__canvas"></canvas>
  </div>
</template>

<script>
import Granim from 'granim';
import { reduce, assign } from 'lodash';

import Mousetrack from '@/utils/mousetrack';
import colors from '@/mixins/colors';

export default {
  name: 'GradientOnScroll',
  mixins: [colors],
  data() {
    return {
      granim: null,
    };
  },
  mounted() {
    this.granim = new Granim({
      element: this.$el.querySelector('.gradient-on-scroll__canvas'),
      direction: 'diagonal',
      defaultStateName: this.ratioState(0),
      opacity: [1, 1],
      stateTransitionSpeed: parseInt(this.scss.colorTransitionDuration, 10),
      states: this.granimStates,
      isPausedWhenNotInView: false,
    });

    if (Mousetrack.isMobile) {
      this.granim.pause();
    } else {
      this.mousetrack.on('update.ratio', ({ top, left }) => {
        this.granim.changeState(this.ratioState(top * left));
      });
    }
  },
  destroyed() {
    this.mousetrack.unbind();
    this.granim.destroy();
  },
  methods: {
    ratioState(ratio) {
      return `state-${this.noramlizedRatio(ratio)}`;
    },
  },
  computed: {
    mousetrack() {
      return new Mousetrack();
    },
    granimStates() {
      return reduce(this.domains, (states, ratio) => assign(states, {
        [this.ratioState(ratio)]: {
          loop: true,
          transitionSpeed: parseInt(this.scss.colorTransitionSpeed, 10),
          gradients: [
            [this.colorScalePrimary(ratio), this.colorScaleSecondary(ratio)],
            [this.colorScaleSecondary(ratio), this.colorScalePrimary(ratio)],
          ],
        },
      }), {});
    },
  },
};
</script>

<style lang="scss">
  .gradient-on-scroll {
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    z-index: -1;
    background: transparent;

    &__canvas {
      width: 100%;
      height: 100%;
    }
  }
</style>
