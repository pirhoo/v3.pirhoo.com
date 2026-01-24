<template>
  <section ref="sectionRef" class="projects section">
    <div class="wrapper">
      <div class="section__panel">
        <gradient-on-scroll />
        <h2 aria-section="Projects" class="section__panel__lead">
          Here's what I've <strong>done</strong>
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
        <masonry-grid :columns="{ default: 4, 768: 3, 576: 2, 400: 1 }" :gutter="25">
          <masonry-grid-item
            v-for="(project, index) in projects"
            :key="index"
          >
            <div
              class="projects__cascading__item"
              :style="{ 'border-color': project.color }"
            >
              <a class="projects__cascading__item__wrapper" :href="project.url">
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
          </masonry-grid-item>
        </masonry-grid>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { map, assign } from 'lodash'
import { MasonryGrid, MasonryGridItem } from 'vue3-masonry-css'
import { useSection } from '@/composables/useSection'
import projectsData from '@/assets/json/projects.json'
import GradientOnScroll from './GradientOnScroll.vue'

// Import all thumbnails using Vite's glob import
const thumbnails = import.meta.glob('@/assets/images/thumbnails/*.png', { eager: true, query: '?url', import: 'default' })

const sectionRef = ref(null)
useSection(sectionRef)

const projects = map(projectsData, project => assign({}, project, {
  paddingTop: `${(project.height / project.width) * 100}%`
}))

function getThumbnailUrl(thumbnail) {
  const key = `/src/${thumbnail}`
  return thumbnails[key] || ''
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
      margin: 0 auto;
      padding: 0 0 $spacer;
      text-align: center;
      max-width: 800px;
      overflow: hidden;

      @media (max-width: 800px) {
        margin: 0 20px;
        padding: 0 12.5px;
      }

      &__item {
        transition: .4s;
        padding: 15px;
        border: 3px solid black;
        border-radius: $border-radius-lg;
        overflow: hidden;

        &__wrapper {
          display: block;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          border-radius: $border-radius;

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
            font-size:10px;
            font-weight: lighter;
            display: block;
            text-align: center;
            text-decoration: none;
            color: var(--body-color);
          }
        }
      }
    }

  }
</style>
