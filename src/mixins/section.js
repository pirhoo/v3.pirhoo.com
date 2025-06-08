import * as chroma from 'chroma-js';
import Mousetrack from '@/utils/mousetrack';
import colors from './colors';

export default {
  mixins: [colors],
  data() {
    return {
      ratio: 0,
    };
  },
  mounted() {
    this.mousetrack.on('update.ratio', ({ top, left }) => this.updateColors(top * left));
    this.updateColors();
  },
  destroyed() {
    this.mousetrack.unbind();
  },
  methods: {
    updateColors(ratio = this.ratio) {
      this.ratio = this.noramlizedRatio(ratio);
      this.$el.style.setProperty('--section-text', this.textColor);
      this.$el.style.setProperty('--section-primary', this.primaryColor);
      // this.$el.style.setProperty('--section-primary-contrast', this.primaryContrastColor);
      this.$el.style.setProperty('--section-secondary', this.secondaryColor);
    },
  },
  computed: {
    mousetrack() {
      return new Mousetrack();
    },
    textColor() {
      return this.colorScaleText(this.ratio);
    },
    primaryColor() {
      return this.colorScalePrimary(this.ratio);
    },
    primaryContrastColor() {
      return chroma.contrast(this.primaryColor, '#fff') < 4.5 ? '#000' : '#fff';
    },
    secondaryColor() {
      return this.colorScaleSecondary(this.ratio);
    },
  },
};
