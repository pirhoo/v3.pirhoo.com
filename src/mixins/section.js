import Scrolltrack from '@/utils/scrolltrack';
import colors from './colors';

export default {
  mixins: [colors],
  data() {
    return {
      scrollTopRatio: 0,
    };
  },
  mounted() {
    this.scrolltrack.on('scroll.ratio', ({ top }) => this.updateColors(top));
    this.updateColors();
  },
  destroyed() {
    this.scrolltrack.unbind();
  },
  methods: {
    updateColors(top = this.scrolltrack.containerScrollRatio.top) {
      this.scrollTopRatio = top;
      this.$el.style.setProperty('--section-text', this.textColor);
      this.$el.style.setProperty('--section-primary', this.primaryColor);
      this.$el.style.setProperty('--section-secondary', this.secondaryColor);
    },
  },
  computed: {
    scrolltrack() {
      return new Scrolltrack();
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
