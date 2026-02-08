<template>
  <a
    :href="investigation.url"
    class="investigation-card"
    :style="{
      '--card-bg': contentBgColor,
      '--card-text': textColor,
      '--card-text-muted': textColorMuted,
      '--card-text-subtle': textColorSubtle
    }"
    target="_blank"
    draggable="false"
    @dragstart.prevent
  >
    <div class="investigation-card__index">
      <span class="index-number">{{ formattedIndex }}</span>
    </div>
    <div
      class="investigation-card__image"
      :style="{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }"
    ></div>
    <div class="investigation-card__content">
      <div class="investigation-card__meta">
        <span class="text-label">{{ investigation.organization }}</span>
        <span class="text-tiny-display">{{ investigation.year }}</span>
      </div>
      <h3 class="investigation-card__title">{{ investigation.title }}</h3>
      <p class="investigation-card__description">{{ investigation.description }}</p>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { useImageAssets } from '@/composables/useImageAssets'
import { getTextColorForBackground, getTextColorWithOpacity } from '@/composables/useContrastColor'

const props = defineProps({
  investigation: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const { getImageUrl } = useImageAssets('investigations')

const formattedIndex = computed(() => {
  return String(props.total - props.index).padStart(2, '0')
})

const imageUrl = computed(() => {
  return getImageUrl(props.investigation.image)
})

const contentBgColor = computed(() => props.investigation.backgroundColor || '#1a1a1a')
const textColor = computed(() => getTextColorForBackground(contentBgColor.value))
const textColorMuted = computed(() => getTextColorWithOpacity(contentBgColor.value, 0.7))
const textColorSubtle = computed(() => getTextColorWithOpacity(contentBgColor.value, 0.6))
</script>

<style lang="scss">
@import '@/utils/_settings';

.investigation-card {
  flex-shrink: 0;
  width: 340px;
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--bs-body-color);
  border-radius: $space-2;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  position: relative;
  scroll-snap-align: start;

  @media (max-width: 576px) {
    width: calc(100vw - $grid-gutter * 2);
  }

  &:hover {
    transform: translateY(-4px);

    .investigation-card__image {
      opacity: 0.8;
    }
  }

  &__index {
    position: absolute;
    top: $space-4;
    right: $space-4;
    z-index: 10;

    .index-number {
      font-family: $font-family-mono;
      font-size: 0.8125rem;
      color: var(--card-text-muted);
      background: var(--card-bg);
      padding: $space-1 $space-2;
      border-radius: $space-1;
    }
  }

  &__image {
    height: 180px;
    background-size: cover;
    background-position: center;
    background-color: var(--card-bg, #1a1a1a);
    opacity: 0.6;
    transition: opacity 0.3s ease;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 50%, var(--card-bg));
    }
  }

  &__content {
    padding: $space-5;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--card-bg);
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-3;
    font-size: 0.8125rem;

    .text-label,
    .text-tiny-display {
      font-size: inherit;
      color: var(--card-text-muted);
    }
  }

  &__title {
    font-family: $font-family-display;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
    margin: 0 0 $space-2;
    color: var(--card-text);
  }

  &__description {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--card-text-muted);
    margin: 0;
    flex: 1;
  }
}
</style>
