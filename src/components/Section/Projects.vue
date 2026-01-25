<template>
  <section ref="sectionRef" class="projects section section-border">
    <layout-section-header
      label="Projects"
      title="Selected work"
      subtitle="featured projects"
      :parallax-offset="parallaxOffset"
    >
      <p class="text-body projects__intro pb-5">
        I mostly code in Javascript and Ruby. Both are my favorite languages.
        Almost all my projects are Open Source and available on
        <a href="https://github.com/pirhoo?tab=activity" target="_blank">Github</a>.
      </p>
    </layout-section-header>
    <section-projects-featured />
    <div class="projects__divider">
      <hr class="divider divider--medium divider--centered" />
    </div>
    <section-projects-archive />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useSection } from '@/composables/useSection'
import { useParallax } from '@/composables/useParallax'
import LayoutSectionHeader from '@/components/Layout/SectionHeader.vue'
import SectionProjectsFeatured from './Projects/Featured.vue'
import SectionProjectsArchive from './Projects/Archive.vue'

const sectionRef = ref(null)
useSection(sectionRef, 'projects')
const { offset: parallaxOffset } = useParallax(sectionRef, { speed: 0.15 })
</script>

<style lang="scss">
@import '@/utils/_settings';

.projects {
  padding: $space-25 0;

  @media (max-width: 768px) {
    padding: $space-15 0;
  }

  &__intro {
    max-width: 500px;
    margin-top: $space-6;
  }

  &__divider {
    padding: $space-15 0;

    @media (max-width: 768px) {
      padding: $space-10 0;
    }
  }
}
</style>
