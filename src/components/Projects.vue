<template>
  <section class="projects section">
    <div class="wrapper">
      <div class="section__panel">
        <gradient-on-scroll />
        <h2 aria-section="Projects" class="section__panel__lead">
          Here’s what I’ve <strong>done</strong>
        </h2>
        <p>
          I mostly code in Javascript and Ruby. Both are my favorite languages.
          Almost all my projects are Open Source and available on
          <a href="https://github.com/pirhoo?tab=activity" target="_blank">
            Github
          </a>.
        </p>
      </div>
      <div class="projects__cascading">
        <masonry :gutter="25" :cols="{default: 4, 600: 3, 500: 2, 250: 1}">
          <div
            v-for="(project, index) in projects"
            :key="index"
            class="projects__cascading__item"
            :style="{ 'border-color': project.color }"
          >
            <a class="projects__cascading__item__wrapper bg-light" :href="project.url">
              <div class="projects__cascading__item__wrapper__ghost">
                <div :style="{ 'padding-top': project.paddingTop }"></div>
              </div>
              <img
                v-lazy="getThumbnailUrl(project.thumbnail)"
                class="projects__cascading__item__wrapper__thumbnail"
              />
              <div class="projects__cascading__item__wrapper__title">
                {{ project.title }}
              </div>
            </a>
          </div>
        </masonry>
      </div>
    </div>
  </section>
</template>

<script>
import { map, assign } from 'lodash'

import section from '@/mixins/section'
import projects from '@/assets/json/projects.json'
import GradientOnScroll from './GradientOnScroll.vue'

// Import all thumbnails using Vite's glob import
const thumbnails = import.meta.glob('@/assets/images/thumbnails/*.png', { eager: true, query: '?url', import: 'default' })

export default {
  name: 'Projects',
  components: {
    GradientOnScroll
  },
  mixins: [section],
  data() {
    return {
      projects: map(projects, project => assign(project, {
        paddingTop: `${(project.height / project.width) * 100}%`
      }))
    }
  },
  methods: {
    getThumbnailUrl(thumbnail) {
      // Convert path like 'assets/images/thumbnails/name.png' to the glob key
      const key = `/src/${thumbnail}`
      return thumbnails[key] || ''
    }
  }
}
</script>

<style lang="scss">
  @import '../utils/_settings';

  .projects {
    margin:0;
    display: block;
    overflow: visible;

    &__cascading {
      position: relative;
      display: block;
      margin:0 auto;
      text-align: center;
      max-width: 800px;
      overflow: hidden;

      @media (max-width: 800px) {
        margin:0 20px;
      }

      &__item {
        margin-bottom: 25px;
        padding: 15px;
        // opacity:0;
        // transform: translate(0%, 20%) scale(.7);
        transition: .4s;
        border:5px solid black;

        &--in-view {
          // opacity: 1;
          // transform: translate(0, 0) scale(1);
        }

        &__wrapper {
          display: block;
          position: relative;
          overflow: hidden;
          text-decoration: none;

          img {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            opacity: 0;
            transition: .4s;

            &[lazy=loaded] {
              opacity: 1;
            }
          }

          &__title {
            padding:5px;
            color:inherit;
            font-size:10px;
            font-weight: lighter;
            display: block;
            background: white;
            text-align: center;
            text-decoration: none;
            color:$body-color;
          }
        }
      }
    }

  }
</style>
