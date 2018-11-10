<template>
  <section class="photos section">
    <div class="wrapper">
      <div class="section__panel">
        <gradient-on-scroll></gradient-on-scroll>
        <h2 aria-section="Photos" class="section__panel__lead">
          I like taking <strong>photos</strong>
        </h2>
        <p>
          I've been lucky to travel the world many times and my camera never leaves my bags.
        </p>
      </div>
      <div class="photos__container">
        <masonry :gutter="25" :cols="{default: 4, 600: 3, 500: 2, 200: 1}">
          <a v-for="photo in photos" :key="photo.id" class="photos__container__item d-block bg-light" :href="photo.link" target="_blank">
            <div :style="{ paddingTop: photo.heightPercentage }"></div>
            <img v-lazy="photo.images.low_resolution.url" class="w-100 photos__container__item__photo" />
          </a>
        </masonry>
        <a class="photos__container__more btn btn-link-section btn-block btn-lg mt-2 mb-5 text-uppercase font-weight-bold" href="https://instagram.com/pirhoo" target="_blank">
          <fa :icon="['fab', 'instagram']" size="2x" class="mr-2" />
          More on instagram
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import get from 'lodash/get';
import axios from 'axios';

import section from '@/mixins/section';
import GradientOnScroll from './GradientOnScroll.vue';

export default {
  name: 'photos',
  mixins: [section],
  components: {
    GradientOnScroll,
  },
  props: {
    src: {
      type: String,
      default: '//api-pirhoo.herokuapp.com/photos',
    },
  },
  data() {
    return {
      photos: [],
    };
  },
  async mounted() {
    this.photos = get(await axios.get(this.src), 'data.photos', []);
    // Add height percentage
    this.photos.forEach((photo, i) => {
      const { width, height } = photo.images.low_resolution;
      this.photos[i].heightPercentage = `${(height / width) * 100}%`;
    });
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
        position: relative;

        &__photo {
          position: absolute;
          top: 0;
          left: 0;
        }
      }

      &__more.btn {
        border-width: 2px;
      }
    }
  }
</style>
