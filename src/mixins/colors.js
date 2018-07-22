import * as d3 from 'd3';
/* ignore eslint start */
import variables from '!!sass-variable-loader!@/utils/_variables.scss';
/* ignore eslint end */

export default {
  computed: {
    colorScaleText() {
      const scale = d3.scaleLinear().domain([0, 0.5, 1]).range([
        variables.color1Text,
        variables.color2Text,
        variables.color3Text,
      ]);
      return ratio => d3.color(scale(ratio)).hex();
    },
    colorScalePrimary() {
      const scale = d3.scaleLinear().domain([0, 0.5, 1]).range([
        variables.color1Primary,
        variables.color2Primary,
        variables.color3Primary,
      ]);
      return ratio => d3.color(scale(ratio)).hex();
    },
    colorScaleSecondary() {
      const scale = d3.scaleLinear().domain([0, 0.5, 1]).range([
        variables.color1Secondary,
        variables.color2Secondary,
        variables.color3Secondary,
      ]);
      return ratio => d3.color(scale(ratio)).hex();
    },
  },
};
