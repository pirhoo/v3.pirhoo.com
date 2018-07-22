<template>
  <div class="activity__commits">
    <div class="activity__commits__wrapper">
      <svg class="activity__commits__chart"></svg>
    </div>
    <h3 class="activity__commits__lead mt-2">
      <abbr title="A submission of my latest changes of a source code">
        Commits
      </abbr>
      by month
    </h3>
  </div>
</template>

<script>
import { range, sortBy, reduce, keys, maxBy, minBy } from 'lodash';
import * as d3 from 'd3';
import tip from 'd3-tip';
import commits from '@/assets/json/commits.json';

export default {
  name: 'ActivityCommits',
  data() {
    return {
      padding: 20,
      monthWidth: Math.max(25, (window.innerWidth - 20) / keys(commits.monthsCount).length),
      months: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
    };
  },
  computed: {
    svg() {
      return d3.select(this.$el).select('svg');
    },
    width() {
      return this.monthWidth * this.data.length;
    },
    height() {
      return this.svg.node().getBoundingClientRect().height;
    },
    // To scale x alongside months
    older() {
      return new Date(commits.olderCommit.timestamp * 1000);
    },
    newer() {
      return new Date(commits.newerCommit.timestamp * 1000);
    },
    // List of years
    years() {
      return range(this.older.getFullYear(), this.newer.getFullYear() + 1);
    },
    // Month scale
    xScaleFn() {
      return d3.scaleTime()
        .domain([this.older, this.newer])
        .range([this.padding, this.width - (this.padding * 2)]);
    },
    // Dynamic scale
    yScaleFn() {
      return d3.scaleLinear()
        .domain([this.commitCountMin, this.commitCountMax])
        .range([this.height - (this.padding * 2), this.padding]);
    },
    // Width of a year
    yearWidthFn() {
      return y => this.xScaleFn(new Date(y + 1, 0, 1)) - this.xScaleFn(new Date(y, 0, 1));
    },
    // Data ready to be read by D3
    data() {
      return sortBy(reduce(keys(commits.monthsCount), (data, month) => data.concat([
        {
          month: new Date(month),
          count: commits.monthsCount[month].count,
          repositories: commits.monthsCount[month].repositories,
        },
      ]), []), 'month');
    },
    // Maximum and minimum commits count to calculate scale domain
    commitCountMax() {
      return maxBy(this.data, 'count').count;
    },
    commitCountMin() {
      return minBy(this.data, 'count').count;
    },
    // Function to draw the line
    lineFn() {
      return d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => this.xScaleFn(d.month))
        .y(d => this.yScaleFn(d.count));
    },
    // Build tooltips function
    tipFn() {
      return tip().attr('class', 'd3-tip').html((d) => {
        const projectsCount = keys(d.repositories).length;
        return `${this.months[d.month.getMonth()]} ${d.month.getFullYear()}:
            <strong>${d.count} commits</strong><br />
            on ${projectsCount} project${projectsCount > 1 ? 's' : ''}`;
      });
    },
  },
  mounted() {
    this.drawSvg();
    this.drawYears();
    this.drawCommitsLine();
    this.drawCommitsDots();
  },
  methods: {
    drawSvg() {
      // Set SVG sizes
      this.svg.style('width', `${this.width}px`).call(this.tipFn);
    },
    drawYears() {
      // Draw the grid
      this.svg.selectAll('g.activity__commits__chart__year')
        .data(this.years)
        .enter()
        .append('g')
        .attr('class', 'activity__commits__chart__year')
        .append('rect')
        .attr('x', y => this.xScaleFn(new Date(y, 0, 1)))
        .attr('y', 0)
        .attr('width', this.yearWidthFn)
        .attr('height', this.height);
      // Draw the labels
      this.svg.selectAll('g.activity__commits__chart__year')
        .append('text')
        .attr('class', 'activity__commits__chart__year__label')
        .text(y => y)
        .attr('text-anchor', 'middle')
        .attr('x', (y) => {
          const x = this.xScaleFn(new Date(y, 0, 1)) + (this.yearWidthFn(y) / 2);
          // Avoid label to go outside the svg
          return Math.min(this.width - 25, Math.max(25, x));
        })
        .attr('y', 20);
    },
    drawCommitsLine() {
      // Use a path to render the line
      const path = this.svg.append('path')
        .datum(this.data)
        .attr('class', 'activity__commits__chart__line')
        .attr('d', this.lineFn);
        // Needs the number of nodes to animate the path drawing
      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    },
    drawCommitsDots() {
      this.svg.selectAll('circle.activity__commits__chart__dot')
        .data(this.data)
        .enter()
        .append('circle')
        .attr('class', 'activity__commits__chart__dot')
        .attr('cx', d => this.xScaleFn(d.month))
        .attr('cy', d => this.yScaleFn(d.count))
        .attr('r', 4)
        .on('mouseover', this.tipFn.show)
        .on('mouseout', this.tipFn.hide);
    },
  },
};
</script>

<style lang="scss">
  @import '../utils/_variables.scss';
  @import '../utils/_tip.scss';

  .activity__commits {
    z-index: 0;
    position: relative;

    &__lead {
      font-size: .9rem;
      text-transform: uppercase;
      text-align: center;
    }

    &__wrapper {
      width:100%;
      display: block;
      overflow-x: auto;
      overflow-y: visible;
    }

    &__chart {
      margin: 0 auto;
      margin-top: 40px;
      height: 250px;
      font-family: $font-family-base;

      &__year {
        rect {
          fill: white;
        }

        &:nth-child(odd) rect {
          fill: var(--section-text);
          transition: fill $color-transition-duration;
          opacity: .1;
        }

        &__label {
          fill: var(--section-primary);
          transition: fill $color-transition-duration;
        }
      }

      &__line {
        stroke:var(--section-primary);
        stroke-width:3px;
        fill:transparent;
        transition: stroke $color-transition-duration;
      }

      &__dot {
        fill:var(--section-primary);
        transition: fill $color-transition-duration;
      }
    }
  }
</style>
