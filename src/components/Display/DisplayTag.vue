<template>
  <span
    class="display-tag"
    :class="[
      `display-tag--${variant}`,
      { 'display-tag--uppercase': uppercase }
    ]"
    :style="tagStyle"
  >
    <slot>{{ value }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number],
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'muted', 'primary'].includes(value)
  },
  uppercase: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: null
  }
})

const tagStyle = computed(() => {
  if (props.color) {
    return { '--tag-color': props.color }
  }
  return {}
})
</script>

<style lang="scss">
@import '@/utils/_settings';

.display-tag {
  display: inline-block;
  font-family: $font-family-display;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.4;

  &--uppercase {
    text-transform: uppercase;
  }

  &--default {
    color: var(--tag-color, var(--body-color));
  }

  &--muted {
    color: var(--tag-color, var(--text-muted));
  }

  &--primary {
    color: var(--tag-color, var(--section-primary));
  }
}
</style>
