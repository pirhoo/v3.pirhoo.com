<template>
  <a
    :href="project.url"
    class="archive-item"
    :style="{ '--item-color': project.color, '--animation-delay': `${index * 20}ms` }"
  >
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
  </a>
</template>

<script setup>
defineProps({
  project: { type: Object, required: true },
  thumbnailUrl: { type: String, required: true },
  index: { type: Number, required: true }
})
</script>

<style lang="scss">
@import '@/utils/_settings';

.archive-item {
  display: flex;
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
}

@keyframes archiveItemIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
