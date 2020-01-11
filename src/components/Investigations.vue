<template>
  <section class="investigations section d-flex flex-column">
    <div class="wrapper d-flex flex-column flex-grow-1">
      <div class="investigations__body section__panel">
        <gradient-on-scroll></gradient-on-scroll>
        <h2 aria-section="Investigations" class="section__panel__lead">
          Investigating <strong>broken systems</strong>
          <br/>and <strong>abuses of power</strong>
        </h2>
        <p>
          I do beleive technology and data can help jounalists solve issues of
          global importance. Since 10 years I'm taking part in cross-border
          investigations. Here is a selection of the ones I'm the most proud of.
        </p>
      </div>
      <div class="flex-grow-1 d-flex flex-column justify-content-center investigations__list">
        <vue-perfect-scrollbar class="investigations__list__wrapper d-flex flex-nowrap">
          <a v-for="(investigation, index) in investigations"
            :key="index"
            :aria-year="investigation.year"
            :aria-organization="investigation.organization"
            :href="investigation.url"
            :style="{ ...investigation }"
            class="investigations__list__item d-block d-flex flex-column-reverse justify-content-between"
            target="_blank">
            <h4 class="investigations__list__item__heading">{{ investigation.title }}</h4>
            <p class="investigations__list__item__lead flex-grow-1">{{ investigation.description }}</p>
          </a>
        </vue-perfect-scrollbar>
      </div>
    </div>
  </section>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';

import investigations from '@/assets/json/investigations.json';
import section from '@/mixins/section';
import GradientOnScroll from './GradientOnScroll.vue';

export default {
  name: 'Investigations',
  mixins: [section],
  components: {
    GradientOnScroll,
    VuePerfectScrollbar,
  },
  data() {
    return {
      investigations,
    };
  },
};
</script>

<style lang="scss">
  @import '../utils/_settings';

  .investigations {

    &__list {

      &__wrapper {
        padding-right: 20px;
        padding-bottom: 20px;
        overflow: hidden;
      }

      &__item {
        padding: $spacer;
        min-width: 330px;
        max-width: 330px;
        margin: 0 0 0 20px;
        position: relative;

        &:before {
          font-size: 0.9rem;
          content:attr(aria-organization);
        }

        &:after {
          font-size: 0.9rem;
          content:attr(aria-year);
          position: absolute;
          right: $spacer;
          bottom: $spacer;
        }

        &:hover {
          text-decoration: none;
        }

        &__heading {
          margin: 0 0 $spacer * 0.5;
          padding: $spacer * 0.5 0;
          border-bottom: 1px solid currentColor;
        }

        &__lead {
          margin: 0;
          opacity: 0;
          transform: translateY(-10%);
          transition: 300ms;
        }

        &:hover &__lead {
          transform: translateY(0%);
          opacity: 1;
        }
      }
    }
  }
</style>
