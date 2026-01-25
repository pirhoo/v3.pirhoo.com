<template>
  <div class="featured-indicators">
    <svg class="featured-indicators__patterns" aria-hidden="true">
      <defs>
        <pattern
          v-for="(item, index) in items"
          :id="`indicator-hatch-${index}`"
          :key="index"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="4"
            :stroke="item.adjustedColor"
            stroke-width="1.5"
          />
        </pattern>
      </defs>
    </svg>
    <button
      v-for="(item, index) in items"
      :key="index"
      class="featured-indicators__button"
      :class="{ 'featured-indicators__button--active': index === currentIndex }"
      :style="{ '--indicator-color': item.adjustedColor }"
      :aria-label="`Go to ${item.title}`"
      @click.stop="$emit('select', index)"
    >
      <svg viewBox="0 0 16 16">
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          rx="3"
          ry="3"
          :fill="index === currentIndex ? `url(#indicator-hatch-${index})` : 'transparent'"
        />
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          rx="3"
          ry="3"
          fill="none"
          class="featured-indicators__button__border"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  currentIndex: { type: Number, required: true }
})

defineEmits(['select'])
</script>

<style lang="scss">
.featured-indicators {
  display: flex;
  justify-content: center;
  gap: 6px;

  &__patterns {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  &__button {
    width: 1rem;
    height: 1rem;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: transform 0.2s ease;

    svg {
      width: 100%;
      height: 100%;
    }

    &__border {
      stroke: var(--border-dashed);
      stroke-width: 1;
      stroke-dasharray: 2 2;
      transition: stroke 0.2s ease, stroke-dasharray 0.2s ease;
    }

    &--active &__border {
      stroke: var(--indicator-color, var(--section-primary));
      stroke-dasharray: none;
    }

    &:hover {
      transform: scale(1.15);

      .featured-indicators__button__border {
        stroke: var(--indicator-color, var(--section-primary));
        stroke-dasharray: none;
      }
    }
  }
}
</style>
