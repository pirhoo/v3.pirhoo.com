<template>
  <button class="button-arrow" v-bind="$attrs">
    <slot></slot>
  </button>
</template>

<style lang="scss">
@import '@/utils/_settings';

.button-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--body-color);
  background: var(--body-color);
  color: var(--body-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:disabled {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
