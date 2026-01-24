<template>
  <section class="activity section">
    <div class="wrapper">
      <div class="activity__body section__panel">
        <gradient-on-scroll />
        <h2 aria-section="Activity" class="section__panel__lead">
          I’ve been busy,<br />
          <strong>let the data talk</strong>
        </h2>
        <p>
          My time is shared between coding, investigating and teaching.
          I’m better with numbers so let the figures below speak for themselves.
        </p>
      </div>
      <div class="activity__figures section__footer">
        <gradient-on-scroll />
        <div class="container-fluid">
          <div class="row">
            <div class="activity__figures__item section__footer__item col-md">
              <fa
                icon="code"
                class="activity__figures__item__icon section__footer__item__icon"
              />
              I authored <strong>{{ formatNumber(commits.commitsCount) }}</strong>
              <abbr title="A submission of my latest changes of a source code">
                commits
              </abbr>
              <br class="d-none d-md-inline" />
              over <strong>{{ formatNumber(commits.repositoriesCount) }}</strong> projects
            </div>
            <div class="activity__figures__item section__footer__item col-md">
              <fa
                icon="graduation-cap"
                class=" activity__figures__item__icon section__footer__item__icon"
              />
              I gave ±<strong>{{ formatNumber(trainings.hoursCount) }}</strong>&nbsp;hours
              <br class="d-none d-md-inline" />of training in
              <strong>{{ formatNumber(trainings.countriesCount) }}</strong>&nbsp;countries
            </div>
            <div class="activity__figures__item section__footer__item col-md">
              <fa
                icon="trophy"
                class="activity__figures__item__icon section__footer__item__icon"
              />
              <strong>{{ formatNumber(awards.awardsCount) }}</strong>&nbsp;prizes awarded
              <br class="d-none d-md-inline" />
              for <strong>{{ formatNumber(awards.projectsCount) }}</strong>&nbsp;projects I worked on
            </div>
          </div>
        </div>
      </div>
      <activity-commits />
    </div>
  </section>
</template>

<script>
import section from '@/mixins/section'
import ActivityCommits from './ActivityCommits.vue'
import GradientOnScroll from './GradientOnScroll.vue'

import { hoursCount, countriesCount, customersCount } from '../assets/json/trainings.json'
import { awardsCount, projectsCount } from '../assets/json/awards.json'
import { commitsCount, repositoriesCount } from '../assets/json/commits.json'

export default {
  name: 'Activity',
  components: {
    ActivityCommits,
    GradientOnScroll
  },
  mixins: [section],
  data() {
    return {
      activityInView: false,
      commits: {
        commitsCount,
        repositoriesCount
      },
      awards: {
        awardsCount,
        countriesCount,
        projectsCount
      },
      trainings: {
        hoursCount,
        countriesCount,
        customersCount
      }
    }
  },
  methods: {
    formatNumber(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
