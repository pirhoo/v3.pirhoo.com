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
          <div class="projects__cascading__item" v-for="project in projects" :key="project.title">
            <a class="projects__cascading__item__wrapper" :href="project.url">
              <div class="projects__cascading__item__wrapper__ghost">
                <div :style="{ 'padding-top': project.height / project.width * 100 + '%' }"></div>
              </div>
              <img class="projects__cascading__item__wrapper__thumbnail" :src="project.thumbnail" />
              <div class="projects__cascading__item__wrapper__title">
                {{ project.title }}
              </div>
            </a>
          </div>
        </div>
    </div>
  </section>
</template>

<script>
import section from '@/mixins/section';
import GradientOnScroll from './GradientOnScroll.vue';

export default {
  name: 'Projects',
  mixins: [section],
  components: {
    GradientOnScroll,
  },
  data() {
    return {
      projects: [],
    };
  },
};
</script>

<style lang="scss">
  @import '../utils/_settings';
</style>
