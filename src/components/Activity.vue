<template>
  <section class="activity section">
    <div class="wrapper">
      <div class="activity__body section__panel">
        <gradient-on-scroll></gradient-on-scroll>
        <h2 aria-section="Activity" class="section__panel__lead">
          I’ve been busy,<br>
          <strong>let the data talk</strong>
        </h2>
        <p>
          My time is split between coding, investigating and teaching.
          I’m better with numbers so let the figures below speak for themselves.
        </p>
      </div>
      <div class="activity__figures section__footer">
        <gradient-on-scroll></gradient-on-scroll>
        <div class="container-fluid">
          <div class="row">
            <div class="activity__figures__item section__footer__item col-md">
              <fa icon="code"
                class="activity__figures__item__icon section__footer__item__icon" />
              I authored <strong>{{ commits.commitsCount }}</strong>&nbsp;
              <abbr title="A submission of my latest changes of a source code">commits</abbr>
              <br class="d-none d-md-inline" />
              over<strong>{{ commits.repositoriesCount }}</strong>&nbsp;projects
            </div>
            <div class="activity__figures__item section__footer__item col-md">
              <fa icon="graduation-cap"
                class=" activity__figures__item__icon section__footer__item__icon" />
              I gave ±<strong>{{ trainings.hoursCount }}</strong>&nbsp;hours
              <br class="d-none d-md-inline" />of training in
              <strong>{{ trainings.countriesCount }}</strong>&nbsp;countries
            </div>
            <div class="activity__figures__item section__footer__item col-md">
              <fa icon="trophy"
                class="activity__figures__item__icon section__footer__item__icon" />
              <strong>{{ awards.awardsCount }}</strong>&nbsp;prizes awarded
              <br class="d-none d-md-inline" />
              for <strong>{{ awards.projectsCount }}</strong>&nbsp;projects I worked on
            </div>
          </div>
        </div>
      </div>
      <div class="activity__chart-wrapper">
        <!--activity commits="commits" ng-if="commits &amp;&amp; projectsInView"></activity-->
      </div>
    </div>
  </section>
</template>

<script>
import section from '@/mixins/section';
import GradientOnScroll from './GradientOnScroll.vue';
import { hoursCount, countriesCount, customersCount } from '../assets/json/trainings.json';
import { awardsCount, projectsCount } from '../assets/json/awards.json';
import { commitsCount, repositoriesCount } from '../assets/json/commits.json';


export default {
  name: 'Activity',
  mixins: [section],
  components: {
    GradientOnScroll,
  },
  data() {
    return {
      commits: {
        commitsCount,
        repositoriesCount,
      },
      awards: {
        awardsCount,
        countriesCount,
        projectsCount,
      },
      trainings: {
        hoursCount,
        countriesCount,
        customersCount,
      },
    };
  },
};
</script>

<style lang="scss">
  @import '../utils/_settings';
</style>
