<template>
  <div class="projects-archive">
    <layout-section-grid>
      <template #label>
        <span class="text-label text-label--section">Archive</span>
        <span class="text-meta">({{ archivedProjects.length }})</span>
      </template>
      <template #content>
        <button class="projects-archive__toggle" @click="isExpanded = !isExpanded">
          <span class="text-meta">{{ isExpanded ? 'Hide archive' : 'View all projects' }}</span>
          <span class="projects-archive__toggle__icon" :class="{ 'projects-archive__toggle__icon--open': isExpanded }">+</span>
        </button>
        <transition name="archive-expand">
          <div v-if="isExpanded" class="projects-archive__items">
            <section-projects-archive-item
              v-for="(project, index) in archivedProjects"
              :key="index"
              :project="project"
              :thumbnail-url="getThumbnailUrl(project.thumbnail)"
              :index="index"
            />
          </div>
        </transition>
      </template>
    </layout-section-grid>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { filter } from 'lodash'
import projectsData from '@/assets/json/projects.json'
import { useTheme } from '@/composables/useTheme'
import { getContrastColor } from '@/composables/useContrastColor'
import LayoutSectionGrid from '@/components/Layout/SectionGrid.vue'
import SectionProjectsArchiveItem from './Archive/Item.vue'

const { theme } = useTheme()

const thumbnails = import.meta.glob('@/assets/images/thumbnails/*.png', {
  eager: true,
  query: '?url',
  import: 'default'
})

const isExpanded = ref(false)
const archivedProjects = computed(() => {
  return filter(projectsData, p => !p.featured).map(project => ({
    ...project,
    adjustedColor: getContrastColor(project.color, theme.value)
  }))
})

function getThumbnailUrl(thumbnail) {
  const key = `/src/${thumbnail}`
  return thumbnails[key] || ''
}
</script>

<style lang="scss">
@import '@/utils/_settings';

.projects-archive {
  &__toggle {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3 0;
    background: transparent;
    border: none;
    border-bottom: 1px dashed var(--border-dashed);
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;

    &:hover {
      color: var(--body-color);
    }

    &__icon {
      font-family: $font-family-mono;
      font-size: 1rem;
      transition: transform 0.3s ease;

      &--open {
        transform: rotate(45deg);
      }
    }
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $space-4;
    margin-top: $space-6;
  }
}

.archive-expand-enter-active,
.archive-expand-leave-active {
  transition: all 0.3s ease;
}

.archive-expand-enter-from,
.archive-expand-leave-to {
  opacity: 0;
  transform: translateY(-$space-2);
}
</style>
