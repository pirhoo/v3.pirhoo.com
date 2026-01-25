<template>
  <div class="projects-featured">
    <layout-section-grid>
      <template #label>
        <span class="text-label text-label--section">Featured</span>
        <span class="text-meta">({{ totalItems }})</span>
      </template>
      <template #content>
        <div class="projects-featured__content">
          <div
            class="projects-featured__stack"
            tabindex="0"
            @keydown="handleKeydown"
            @click="handleClick"
          >
            <section-projects-featured-card
              v-for="(project, index) in visibleItems"
              :key="project.url"
              :project="project"
              :thumbnail-url="getThumbnailUrl(project.thumbnail)"
              :is-active="index === 0"
              :is-dragging="isDragging && index === 0"
              :card-style="getCardStyle(index, project)"
              @drag-start="handleDragStart"
              @drag-move="handleDragMove"
              @drag-end="handleDragEnd"
            />
          </div>
          <section-projects-featured-indicators
            :items="featuredProjects"
            :current-index="currentIndex"
            @select="goTo"
          />
        </div>
      </template>
    </layout-section-grid>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { filter } from 'lodash'
import { useSwipeCards } from '@/composables/useSwipeCards'
import { useTheme } from '@/composables/useTheme'
import { getContrastColor } from '@/composables/useContrastColor'
import projectsData from '@/assets/json/projects.json'
import LayoutSectionGrid from '@/components/Layout/SectionGrid.vue'
import SectionProjectsFeaturedCard from './Featured/Card.vue'
import SectionProjectsFeaturedIndicators from './Featured/Indicators.vue'

const { theme } = useTheme()

const thumbnails = import.meta.glob('@/assets/images/thumbnails/*.png', {
  eager: true,
  query: '?url',
  import: 'default'
})

const featuredProjects = computed(() => {
  return filter(projectsData, p => p.featured).map(project => ({
    ...project,
    adjustedColor: getContrastColor(project.color, theme.value)
  }))
})

const {
  currentIndex, visibleItems, totalItems, isDragging, dragOffset,
  goTo, handleKeydown, handleDragStart, handleDragMove, handleDragEnd, handleClick
} = useSwipeCards(featuredProjects)

function getThumbnailUrl(thumbnail) {
  const key = `/src/${thumbnail}`
  return thumbnails[key] || ''
}

const cardTilts = ref([
  { rotation: 0, xOffset: 0 },
  { rotation: (Math.random() - 0.5) * 4, xOffset: (Math.random() - 0.5) * 8 },
  { rotation: (Math.random() - 0.5) * 4, xOffset: (Math.random() - 0.5) * 8 }
])

watch(currentIndex, () => {
  cardTilts.value = [
    { rotation: 0, xOffset: 0 },
    { rotation: (Math.random() - 0.5) * 4, xOffset: (Math.random() - 0.5) * 8 },
    { rotation: (Math.random() - 0.5) * 4, xOffset: (Math.random() - 0.5) * 8 }
  ]
})

function getCardStyle(stackIndex, project) {
  const offset = stackIndex * 25
  const scale = 1 - stackIndex * 0.05
  const zIndex = 10 - stackIndex
  const { rotation, xOffset } = cardTilts.value[stackIndex] || { rotation: 0, xOffset: 0 }

  let transform = `translateX(${xOffset}px) translateY(${offset}px) rotate(${rotation}deg) scale(${scale})`

  if (stackIndex === 0 && isDragging.value) {
    const dragRotation = dragOffset.value * 0.015
    transform = `translateX(${dragOffset.value}px) rotate(${dragRotation}deg) scale(${scale})`
  }

  return { transform, zIndex, '--card-color': project?.adjustedColor || '#666' }
}
</script>

<style lang="scss">
@import '@/utils/_settings';

.projects-featured {
  &__content {
    max-width: 600px;
    overflow: visible;
  }

  &__stack {
    position: relative;
    height: 520px;
    cursor: pointer;
    outline: none;
    overflow: visible;

    @media (max-width: 576px) {
      height: 460px;
    }
  }
}
</style>
