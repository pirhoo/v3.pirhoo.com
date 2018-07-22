import Mousetrack from '@/utils/mousetrack';
import colors from './colors';

export default {
  mixins: [colors],
  data() {
    return {
      scrollTopRatio: 0,
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
    updateColors(top = 0) {
      this.scrollTopRatio = top;
      this.$el.style.setProperty('--section-text', this.textColor);
      this.$el.style.setProperty('--section-primary', this.primaryColor);
      this.$el.style.setProperty('--section-secondary', this.secondaryColor);
    },
  },
  computed: {
    mousetrack() {
      return new Mousetrack();
    },
    textColor() {
      return this.colorScaleText(this.scrollTopRatio);
    },
    primaryColor() {
      return this.colorScalePrimary(this.scrollTopRatio);
    },
    secondaryColor() {
      return this.colorScaleSecondary(this.scrollTopRatio);
    },
  },
};
