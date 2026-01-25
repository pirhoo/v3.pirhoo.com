<template>
  <button
    class="nav-item"
    :class="{ 'nav-item--active': active }"
    :style="{ '--nav-color': color }"
    :aria-label="`Navigate to ${label}`"
    :aria-current="active ? 'true' : undefined"
    @click="$emit('click')"
  >
    <svg class="nav-item__cell" viewBox="0 0 20 20">
      <rect
        x="1"
        y="1"
        width="18"
        height="18"
        rx="4"
        ry="4"
        class="nav-item__cell__bg"
        :fill="active ? `url(#hatch-${id})` : 'transparent'"
      />
      <rect
        x="1"
        y="1"
        width="18"
        height="18"
        rx="4"
        ry="4"
        class="nav-item__cell__border"
        fill="none"
      />
    </svg>
    <span class="nav-item__label">{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  color: { type: String, required: true },
  active: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<style lang="scss">
@import '@/utils/_settings';

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;

  &:hover {
    .nav-item__cell {
      transform: scale(1.15);
    }

    .nav-item__cell__border {
      stroke: var(--nav-color);
      stroke-dasharray: none;
    }

    .nav-item__label {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &--active {
    .nav-item__cell__border {
      stroke: var(--nav-color);
      stroke-dasharray: none;
    }
  }

  &__cell {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;

    &__bg {
      transition: fill 0.2s ease;
    }

    &__border {
      stroke: var(--border-dashed);
      stroke-width: 1;
      stroke-dasharray: 2 2;
      transition: stroke 0.2s ease, stroke-dasharray 0.2s ease;
    }
  }

  &__label {
    position: absolute;
    left: 100%;
    margin-left: $space-5;
    font-family: $font-family-mono;
    font-size: 0.6875rem;
    letter-spacing: $letter-spacing-label;
    text-transform: uppercase;
    color: var(--text-muted);
    background: var(--body-bg);
    padding: $space-1 $space-2;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-$space-2);
    transition: all 0.25s ease;
    pointer-events: none;
  }
}
</style>
