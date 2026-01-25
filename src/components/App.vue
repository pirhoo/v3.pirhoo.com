<template>
  <div class="app">
    <effects-parallax-background />
    <layout-section-nav />
    <layout-mobile-nav />
    <main class="app__main">
      <section-introduction />
      <section-investigations />
      <section-activity />
      <section-projects />
    </main>
    <layout-footer />
  </div>
</template>

<script setup>
import SectionIntroduction from '@/components/Section/Introduction.vue'
import SectionInvestigations from '@/components/Section/Investigations.vue'
import SectionActivity from '@/components/Section/Activity.vue'
import SectionProjects from '@/components/Section/Projects.vue'
import LayoutSectionNav from '@/components/Layout/SectionNav.vue'
import LayoutMobileNav from '@/components/Layout/MobileNav.vue'
import LayoutFooter from '@/components/Layout/Footer.vue'
import EffectsParallaxBackground from '@/components/Effects/ParallaxBackground.vue'
</script>

<style lang="scss">
@import '@/utils/_settings.scss';
@import 'bootstrap/scss/bootstrap';
@import '@/utils/_theme.scss';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  &__main {
    flex: 1;
  }
}

// Section base styles - simplified for editorial layout
.section {
  display: block;
  margin: 0;
  position: relative;

  --section-primary: #666;
  --section-primary-contrast: white;
  --section-text: var(--body-color);
}

// Remove old panel styles - components now handle their own layouts
</style>
