<template>
  <a
    :href="project.url"
    class="archive-item"
    :style="{ '--item-color': project.adjustedColor || project.color, '--animation-delay': `${index * 20}ms` }"
    target="_blank"
  >
    <div class="archive-item__header">
      <div class="archive-item__image">
        <img
          v-if="project.thumbnail"
          v-lazy="thumbnailUrl"
          :alt="project.title"
        />
      </div>
      <div class="archive-item__content">
        <span class="archive-item__year text-tiny-display">{{ project.year }}</span>
        <span class="archive-item__title">{{ project.title }}</span>
      </div>
    </div>
    <span class="archive-item__button">
      {{ buttonLabel }}
      <component :is="buttonIcon" />
    </span>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import IconArrowOut from '~icons/ph/arrow-square-out'
import IconArchive from '~icons/ph/archive'

const props = defineProps({
  project: { type: Object, required: true },
  thumbnailUrl: { type: String, required: true },
  index: { type: Number, required: true }
})

const isArchive = computed(() => props.project.url?.includes('web.archive.org'))
const buttonLabel = computed(() => isArchive.value ? 'Archive' : 'Visit')
const buttonIcon = computed(() => isArchive.value ? IconArchive : IconArrowOut)
</script>

<style lang="scss">
@import '@/utils/_settings';

.archive-item {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-3;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  opacity: 0;
  transform: translateY($space-2);
  animation: archiveItemIn 0.3s ease forwards;
  animation-delay: var(--animation-delay);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--item-color, var(--body-color));

    .archive-item__title {
      color: var(--body-color);
    }
  }

  &__header {
    display: flex;
    gap: $space-3;
  }

  &__image {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: $space-1;
    overflow: hidden;
    background: var(--border-color);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;

      &[lazy=loaded] {
        opacity: 1;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__year {
    font-size: 0.6875rem;
    color: var(--text-muted);
  }

  &__title {
    font-family: $font-family-display;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-muted);
    line-height: 1.3;
    transition: color 0.2s ease;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    width: fit-content;
    margin-left: calc(48px + #{$space-3});
    padding: $space-1 $space-2;
    font-family: $font-family-mono;
    font-size: 0.6875rem;
    color: var(--body-color);
    border: 1px solid var(--border-color);
    border-radius: $space-1;
    transition: all 0.2s ease;

    svg {
      font-size: 0.75rem;
    }
  }

  &:hover &__button {
    background: var(--body-color);
    color: var(--body-bg);
  }
}

@keyframes archiveItemIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
