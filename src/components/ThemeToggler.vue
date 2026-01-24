<template>
  <button
    class="theme-toggler"
    :title="`Theme: ${theme} (click to change)`"
    @click="cycleTheme"
  >
    <icon-sun v-if="theme === 'light'" />
    <icon-moon v-else-if="theme === 'dark'" />
    <icon-circle-half-stroke v-else />
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import IconSun from '~icons/fa6-solid/sun'
import IconMoon from '~icons/fa6-solid/moon'
import IconCircleHalfStroke from '~icons/fa6-solid/circle-half-stroke'

const { theme, cycleTheme } = useTheme()
</script>

<style lang="scss">
.theme-toggler {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: var(--theme-toggler-bg, rgba(255, 255, 255, 0.9));
  color: var(--theme-toggler-color, #505050);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.3s ease, color 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
