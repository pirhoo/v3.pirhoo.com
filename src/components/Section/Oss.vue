<template>
  <section ref="sectionRef" class="oss section section-border">
    <layout-section-header
      label="Open Source"
      title="Building in the open"
      :parallax-offset="parallaxOffset"
    >
      <p class="text-body oss__intro pb-5">
        I'm a strong believer in open source software development. Here are some projects I've created
        or contributed to significantly. They range from data journalism tools to
        developer utilities.
      </p>
    </layout-section-header>
    <div class="oss__grid">
      <section-oss-card
        v-for="project in projects"
        :key="project.name"
        :project="project"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useSection } from '@/composables/useSection'
import { useParallax } from '@/composables/useParallax'
import LayoutSectionHeader from '@/components/Layout/SectionHeader.vue'
import SectionOssCard from './Oss/Card.vue'
import projects from '@/assets/json/oss.json'

const sectionRef = ref(null)
useSection(sectionRef, 'oss')
const { offset: parallaxOffset } = useParallax(sectionRef, { speed: 0.15 })
</script>

<style lang="scss">
@import '@/utils/_settings';

.oss {
  padding: $space-25 0;

  @media (max-width: 768px) {
    padding: $space-15 0;
  }

  &__intro {
    max-width: 500px;
    margin-top: $space-6;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: $space-4;
    padding: 0 $grid-gutter * 2;
    max-width: $content-max-width + $grid-gutter * 4;
    margin: 0 auto;

    @media (max-width: 768px) {
      padding: 0 $grid-gutter;
      grid-template-columns: 1fr;
    }
  }
}
</style>
