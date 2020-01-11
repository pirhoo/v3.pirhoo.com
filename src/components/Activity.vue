<template>
  <section class="activity section d-flex flex-column">
    <div class="wrapper d-flex flex-column flex-grow-1">
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
      <div class="activity__figures section__footer w-100">
        <gradient-on-scroll></gradient-on-scroll>
        <div class="container-fluid">
          <div class="row">
            <div class="activity__figures__item section__footer__item col-md">
              <fa icon="code"
                class="activity__figures__item__icon section__footer__item__icon" />
              I authored <strong>{{ commits.commitsCount | number }}</strong>
              <abbr title="A submission of my latest changes of a source code">
                commits
              </abbr>
              <br class="d-none d-md-inline" />
              over <strong>{{ commits.repositoriesCount | number }}</strong> projects
            </div>
            <div class="activity__figures__item section__footer__item col-md">
              <fa icon="graduation-cap"
                class=" activity__figures__item__icon section__footer__item__icon" />
              I gave ±<strong>{{ trainings.hoursCount | number }}</strong>&nbsp;hours
              <br class="d-none d-md-inline" />of training in
              <strong>{{ trainings.countriesCount | number }}</strong>&nbsp;countries
            </div>
            <div class="activity__figures__item section__footer__item col-md">
              <fa icon="trophy"
                class="activity__figures__item__icon section__footer__item__icon" />
              <strong>{{ awards.awardsCount | number }}</strong>&nbsp;prizes awarded
              <br class="d-none d-md-inline" />
              for <strong>{{ awards.projectsCount | number }}</strong>&nbsp;projects I worked on
            </div>
          </div>
        </div>
      </div>
      <div class="flex-grow-1 d-flex flex-column justify-content-center">
        <activity-commits></activity-commits>
      </div>
    </div>
  </section>
</template>

<script>
import section from '@/mixins/section';
import ActivityCommits from './ActivityCommits.vue';
import GradientOnScroll from './GradientOnScroll.vue';

import { hoursCount, countriesCount, customersCount } from '../assets/json/trainings.json';
import { awardsCount, projectsCount } from '../assets/json/awards.json';
import { commitsCount, repositoriesCount } from '../assets/json/commits.json';


export default {
  name: 'Activity',
  mixins: [section],
  components: {
    ActivityCommits,
    GradientOnScroll,
  },
  data() {
    return {
      activityInView: false,
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
  filters: {
    number(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
};
</script>
