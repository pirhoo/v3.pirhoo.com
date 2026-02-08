<template>
  <section ref="sectionRef" class="activity section section-border">
    <layout-section-header
      label="Activity"
      title="I've been busy"
      class="pb-5"
      subtitle="let the data talk"
      :parallax-offset="parallaxOffset"
    />
    <section-activity-stats />
    <div class="activity__commits">
      <div class="activity__commits__label">
        <span class="text-label text-label--section">Commits</span>
      </div>
      <div class="activity__commits__chart" @mousedown="onDragStart">
        <section-activity-commits />
      </div>
      <h3 class="activity__commits__lead">
        <abbr title="A submission of my latest changes of a source code">Commits</abbr>
        by day
      </h3>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useSection } from '@/composables/useSection'
import { useParallax } from '@/composables/useParallax'
import { useDragScroll } from '@/composables/useDragScroll'
import LayoutSectionHeader from '@/components/Layout/SectionHeader.vue'
import SectionActivityStats from './Activity/Stats.vue'
import SectionActivityCommits from './Activity/Commits/Chart.vue'

const sectionRef = ref(null)
useSection(sectionRef, 'activity')
const { offset: parallaxOffset } = useParallax(sectionRef, { speed: 0.15 })
const { onMouseDown: onDragStart } = useDragScroll()
</script>

<style lang="scss">
@import '@/utils/_settings';

.activity {
  padding: $space-25 0;

  @media (max-width: 768px) {
    padding: $space-15 0;
  }

  &__commits {
    width: 100%;

    &__label {
      padding: 0 $grid-gutter * 2 $space-4;
      max-width: $content-max-width;
      margin: 0 auto;

      @media (max-width: 768px) {
        padding: 0 $grid-gutter $space-4;
      }
    }

    &__chart {
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0 $grid-gutter * 2 $space-5;
      width: 100%;
      cursor: grab;

      @media (max-width: 768px) {
        padding: 0 $grid-gutter $space-5;
      }

      &::-webkit-scrollbar {
        height: 4px;
      }

      &::-webkit-scrollbar-track {
        background: var(--bs-border-color);
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border-dashed);
        border-radius: 2px;
      }
    }

    &__lead {
      font-family: $font-family-mono;
      font-size: .75rem;
      text-transform: uppercase;
      text-align: center;
      letter-spacing: 0.1em;
      color: var(--bs-secondary-color);
      margin: $space-2 0 0;
    }
  }
}
</style>
