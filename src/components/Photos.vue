<template>
  <section class="photos section">
    <div class="wrapper">
      <div class="section__panel">
        <gradient-on-scroll></gradient-on-scroll>
        <h2 aria-section="Photos" class="section__panel__lead">
          I like to take <strong>pictures</strong>
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div class="photos__container">
        <masonry :gutter="25" :cols="{default: 4, 600: 3, 500: 2, 200: 1}">
          <a v-for="photo in photos" class="photos__container__item d-block" :href="photo.link" target="_blank">
            <img v-lazy="photo.images.low_resolution.url" class="mw-100" />
          </a>
        </masonry>
      </div>
    </div>
  </section>
</template>

<script>
import section from '@/mixins/section';
import GradientOnScroll from './GradientOnScroll.vue';

import get from 'lodash/get';
import axios from 'axios';

export default {
  name: 'photos',
  mixins: [section],
  components: {
    GradientOnScroll,
  },
  props: {
    src: {
      type: String,
      default: 'http://api.pirhoo.com/photos',
    },
  },
  data() {
    return {
      photos: [],
    };
  },
  async mounted() {
    this.photos = get(await axios.get(this.src), 'data.photos', []);
  },
};
</script>

<style lang="scss">
  @import '@/utils/_settings.scss';
  @import 'node_modules/bootstrap/scss/bootstrap';

  .photos {

    &__container {
      display: block;
      margin:0 auto;
      text-align: center;
      max-width: 800px;
      padding-top: 25px;

      &__item {
        margin-bottom: 25px;
      }
    }
  }
</style>
