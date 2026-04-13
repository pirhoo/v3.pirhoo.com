<template>
  <button
    class="theme-toggle"
    :aria-label="`Theme: ${theme} (click to change)`"
    @click="$emit('toggle')"
  >
    <icon-sun v-if="theme === 'light'" />
    <icon-moon v-else />
  </button>
</template>

<script setup>
import IconSun from '~icons/ph/sun-fill'
import IconMoon from '~icons/ph/moon-fill'

defineProps({
  theme: { type: String, required: true }
})

defineEmits(['toggle'])
</script>

<style lang="scss">
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 1px dashed var(--border-dashed);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  color: var(--bs-secondary-color);
  position: absolute;
  bottom: 16px;
  z-index: 1;
  transition:
    color var(--motion-hover) ease,
    border-color var(--motion-hover) ease,
    transform var(--motion-press) var(--ease-out);

  svg {
    font-size: 0.75rem;
    transition: transform var(--motion-popover) var(--ease-out);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--bs-body-color);
      border-color: var(--bs-body-color);
      border-style: solid;
      transform: scale(1.15);
    }
  }

  &:active {
    transform: scale(0.92);
  }
}
</style>
