<template>
  <section ref="sectionRef" class="photos section">
    <div class="wrapper">
      <div class="section__panel">
        <gradient-on-scroll />
        <h2 aria-section="Photos" class="section__panel__lead">
          I like taking <strong>photos</strong>
        </h2>
        <p>
          I've been lucky to travel the world many times and my camera never leaves my bags.
        </p>
      </div>
      <div class="photos__container">
        <MasonryGrid :columns="{ default: 4, 600: 3, 500: 2, 200: 1 }" gutter="25px">
          <MasonryGridItem
            v-for="photo in photos"
            :key="photo.id"
          >
            <a
              class="photos__container__item d-block bg-light"
              :href="photo.link"
              target="_blank"
            >
              <div :style="{ paddingTop: photo.heightPercentage }"></div>
              <img v-lazy="photo.images.low_resolution.url" class="w-100 photos__container__item__photo" />
            </a>
          </MasonryGridItem>
        </MasonryGrid>
        <a class="photos__container__more btn btn-link-section btn-block btn-lg mt-2 mb-5 text-uppercase font-weight-bold" href="https://instagram.com/pirhoo" target="_blank">
          <IconInstagram class="me-2" style="font-size: 2em" />
          More on instagram
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import get from 'lodash/get'
import axios from 'axios'
import { MasonryGrid, MasonryGridItem } from 'vue3-masonry-css'
import { useSection } from '@/composables/useSection'
import GradientOnScroll from './GradientOnScroll.vue'
import IconInstagram from '~icons/fa6-brands/instagram'

const props = defineProps({
  src: {
    type: String,
    default: '//api-pirhoo.herokuapp.com/photos'
  }
})

const sectionRef = ref(null)
const photos = ref([])

useSection(sectionRef)

onMounted(async () => {
  const response = await axios.get(props.src)
  const photoData = get(response, 'data.photos', [])
  photos.value = photoData.map(photo => ({
    ...photo,
    heightPercentage: `${(photo.images.low_resolution.height / photo.images.low_resolution.width) * 100}%`
  }))
})
</script>

<style lang="scss">
  @import '@/utils/_settings.scss';
  @import 'bootstrap/scss/bootstrap';

  .photos {

    &__container {
      display: block;
      margin:0 auto;
      text-align: center;
      max-width: 800px;
      padding-top: 25px;

      @media (max-width: 800px) {
        margin:0 20px;
      }

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
