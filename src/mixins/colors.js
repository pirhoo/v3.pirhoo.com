import * as d3 from 'd3';
/* ignore eslint start */
import variables from '!!sass-variable-loader!@/utils/_variables.scss';
/* ignore eslint end */

export default {
  computed: {
    colorScaleText() {
      const scale = d3.scaleLinear().domain([0, 0.5, 1]).range([
        variables.introductionText,
        variables.activityText,
        variables.projectsText,
      ]);
      return ratio => d3.color(scale(ratio)).hex();
    },
    colorScalePrimary() {
      const scale = d3.scaleLinear().domain([0, 0.5, 1]).range([
        variables.introductionPrimary,
        variables.activityPrimary,
        variables.projectsPrimary,
      ]);
      return ratio => d3.color(scale(ratio)).hex();
    },
    colorScaleSecondary() {
      const scale = d3.scaleLinear().domain([0, 0.5, 1]).range([
        variables.introductionSecondary,
        variables.activitySecondary,
        variables.projectsSecondary,
      ]);
      return ratio => d3.color(scale(ratio)).hex();
    },
  },
};
