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
  color: var(--text-muted);
  transition: all 0.25s ease;
  position: absolute;
  bottom: 16px;
  z-index: 1;

  svg {
    font-size: 0.75rem;
  }

  &:hover {
    color: var(--body-color);
    border-color: var(--body-color);
    border-style: solid;
    transform: scale(1.15);
  }
}
</style>
