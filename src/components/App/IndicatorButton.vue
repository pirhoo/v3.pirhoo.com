<template>
  <button
    class="indicator-button"
    :class="{ 'indicator-button--active': active }"
    :style="{ '--indicator-color': color }"
    :aria-label="ariaLabel"
    @click="$emit('click')"
  >
    <svg viewBox="0 0 16 16">
      <defs>
        <pattern
          :id="patternId"
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
            :stroke="color"
            stroke-width="1.5"
          />
        </pattern>
      </defs>
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="3"
        ry="3"
        :fill="active ? `url(#${patternId})` : 'transparent'"
      />
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="3"
        ry="3"
        fill="none"
        class="indicator-button__border"
      />
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#666'
  },
  ariaLabel: {
    type: String,
    default: 'Select'
  },
  id: {
    type: [String, Number],
    default: () => Math.random().toString(36).substr(2, 9)
  }
})

defineEmits(['click'])

const patternId = computed(() => `indicator-hatch-${props.id}`)
</script>

<style lang="scss">
.indicator-button {
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

    .indicator-button__border {
      stroke: var(--indicator-color, var(--section-primary));
      stroke-dasharray: none;
    }
  }
}
</style>
