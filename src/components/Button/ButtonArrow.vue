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
  border: 1px solid var(--bs-body-bg);
  background: var(--bs-emphasis-color);
  color: var(--bs-body-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    opacity var(--motion-hover) ease,
    transform var(--motion-press) var(--ease-out);

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:disabled {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
