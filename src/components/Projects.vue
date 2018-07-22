<template>
  <section class="projects section">
    <div class="wrapper">
      <div class="section__panel">
        <gradient-on-scroll></gradient-on-scroll>
        <h2 aria-section="Projects" class="section__panel__lead">
          Here’s what I’ve <strong>done</strong>
        </h2>
        <p>
          According to my
          <a href="http://coderstats.net/github/pirhoo/" target="_blank">
            Github Stats
          </a>
          I mostly code in Javascript and Python. Both are my favorite languages.
          Almost all my projects are Open Source and available on
          <a href="https://github.com/pirhoo?tab=activity" target="_blank">
            Github
          </a>.</p>
        </div>
        <div class="projects__cascading">
          <masonry :gutter="25" :cols="3">
            <div class="projects__cascading__item" v-for="(project, index) in projects"
              :key="index"
              :style="{ 'border-color': project.color }">
              <a class="projects__cascading__item__wrapper" :href="project.url">
                <div class="projects__cascading__item__wrapper__ghost">
                  <div :style="{ 'padding-top': project.paddingTop }"></div>
                </div>
                <img class="projects__cascading__item__wrapper__thumbnail"
                  :src="require(`@/${project.thumbnail}`)" />
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
import { map, assign } from 'lodash';

import section from '@/mixins/section';
import projects from '@/assets/json/projects.json';
import GradientOnScroll from './GradientOnScroll.vue';

export default {
  name: 'Projects',
  mixins: [section],
  components: {
    GradientOnScroll,
  },
  data() {
    return {
      projects: map(projects, project => assign(project, {
        paddingTop: `${(project.height / project.width) * 100}%`,
      })),
    };
  },
};
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

      &__item {
        margin-bottom: 25px;
        padding: 15px;
        // opacity:0;
        // transform: translate(0%, 20%) scale(.7);
        transition: .4s;
        border:5px solid black;

        &--in-view {
          opacity: 1;
          transform: translate(0, 0) scale(1);
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
