import { bisector } from 'd3';
import * as chroma from 'chroma-js';
import { range, first, last, reduce, map, shuffle, identity } from 'lodash';
import gradients from '@/assets/json/gradients.json';
/* ignore eslint start */
import scss from '!!sass-variable-loader!@/utils/_variables.scss';
/* ignore eslint end */

// Only create the slice once
export const gradientsSlice = shuffle(gradients).slice(0, 16);

// Export colors from here to avoid ignoring eslint again...
export { scss };

export default {
  computed: {
    colorScaleText() {
      return ratio => chroma.mix(this.colorScalePrimary(ratio), scss.bodyColor, 0.8);
    },
    colorScalePrimary() {
      const scale = chroma.scale(map(this.gradients, first));
      return ratio => scale(ratio).hex();
    },
    colorScaleSecondary() {
      const scale = chroma.scale(map(this.gradients, last));
      return ratio => scale(ratio).hex();
    },
    gradients() {
      return reduce(gradientsSlice, (all, gradient) => all.concat([gradient.colors]), []);
    },
    domains() {
      const tick = 1 / this.gradients.length;
      return range(0, 1 + tick, tick);
    },
    scss() {
      return scss;
    },
  },
  methods: {
    noramlizedRatio(ratio) {
      const index = bisector(identity).left(this.domains, ratio);
      return this.domains[index];
    },
  },
};
