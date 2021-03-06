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
          global importance. Since {{ currentYear - 2010 }} years I'm taking part in cross-border
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
            :style="investigationStyle(investigation)"
            class="investigations__list__item d-block d-flex flex-column-reverse justify-content-between"
            target="_blank">
            <div class="investigations__list__item__image" :style="{ backgroundImage: `url(${investigationImage(investigation)})` }"></div>
            <h4 class="investigations__list__item__heading">
              {{ investigation.title }}
            </h4>
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
  methods: {
    investigationStyle({ color, backgroundColor }) {
      return { color, backgroundColor };
    },
    investigationImage({ image }) {
      // eslint-disable-next-line
      return image ? require(`@/assets/images/investigations/${image}`) : null;
    },
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
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
          font-weight: bold;
          content:attr(aria-organization);
          position: relative;
          z-index: 100;
        }

        &:after {
          font-size: 0.9rem;
          content:attr(aria-year);
          position: absolute;
          right: $spacer;
          bottom: $spacer;
          z-index: 100;
        }

        &:hover {
          text-decoration: none;
        }

        &__image {
          background-size: cover;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.5;
          z-index: 50;

          &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            @include gradient-directional(rgba(black, 0.5), transparent);
          }
        }

        &__heading {
          margin: 0 0 $spacer * 0.5;
          padding: $spacer * 0.5 0;
          border-bottom: 2px solid currentColor;
          position: relative;
          z-index: 100;
        }

        &__lead {
          margin: 0;
          opacity: 0;
          transform: translateY(-10%);
          transition: 300ms;
          position: relative;
          z-index: 100;
        }

        &:hover &__lead {
          transform: translateY(0%);
          opacity: 1;
        }
      }
    }
  }
</style>
