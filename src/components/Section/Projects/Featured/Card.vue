<template>
  <div
    class="featured-card"
    :class="{
      'featured-card--dragging': isDragging,
      'featured-card--active': isActive
    }"
    :style="cardStyle"
    @mousedown="isActive && $emit('dragStart', $event)"
    @mousemove="isActive && $emit('dragMove', $event)"
    @mouseup="isActive && $emit('dragEnd')"
    @mouseleave="isActive && $emit('dragEnd')"
    @touchstart="isActive && $emit('dragStart', $event)"
    @touchmove="isActive && $emit('dragMove', $event)"
    @touchend="isActive && $emit('dragEnd')"
  >
    <div class="featured-card__image">
      <img :src="thumbnailUrl" :alt="project.title" />
    </div>
    <div class="featured-card__content">
      <div class="featured-card__meta">
        <span class="text-label" :style="{ color: project.adjustedColor }">Project</span>
        <span class="text-tiny-display">{{ project.year }}</span>
      </div>
      <h3 class="featured-card__title">{{ project.title }}</h3>
      <a
        v-if="isActive"
        :href="project.url"
        class="featured-card__button"
        :style="{ '--button-color': project.adjustedColor }"
        target="_blank"
        @click.stop
      >
        <span>Visit</span>
        <icon-arrow-out />
      </a>
    </div>
  </div>
</template>

<script setup>
import IconArrowOut from '~icons/ph/arrow-square-out-fill'

defineProps({
  project: { type: Object, required: true },
  thumbnailUrl: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  isDragging: { type: Boolean, default: false },
  cardStyle: { type: Object, default: () => ({}) }
})

defineEmits(['dragStart', 'dragMove', 'dragEnd'])
</script>

<style lang="scss">
@import '@/utils/_settings';

.featured-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border-radius: $space-2;
  overflow: hidden;
  box-shadow: 0 0 0 1px var(--card-color, var(--bs-border-color));
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), min-height 0.4s ease;
  user-select: none;
  touch-action: pan-y;

  @media (max-width: 576px) {
    min-height: 360px;
  }

  &--dragging {
    transition: none;
    cursor: grabbing;
  }

  &--active {
    cursor: default;
  }

  &__image {
    position: relative;
    overflow: hidden;
    background: var(--bs-body-bg);
    height: 260px;
    flex-shrink: 0;

    @media (max-width: 576px) {
      height: 200px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
    }
  }

  &__content {
    padding: $space-5;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-2;
  }

  &__title {
    font-family: $font-family-display;
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--bs-body-color);
    line-height: 1.3;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    margin-top: $space-4;
    padding: $space-2 + $space-1 $space-4;
    background: transparent;
    border: 1px solid var(--button-color, var(--bs-border-color));
    border-radius: $space-1;
    color: var(--bs-body-color);
    font-family: $font-family-mono;
    font-size: 0.8125rem;
    text-decoration: none;
    transition: all 0.2s ease;

    svg {
      font-size: 1rem;
      color: var(--button-color, var(--bs-secondary-color));
      transition: color 0.2s ease;
    }

    &:hover {
      background: var(--button-color);
      border-color: var(--button-color);
      color: var(--bs-body-bg);

      svg {
        color: var(--bs-body-bg);
      }
    }
  }
}
</style>
