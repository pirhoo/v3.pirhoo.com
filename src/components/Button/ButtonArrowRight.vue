<template>
  <button-arrow v-bind="$attrs">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  </button-arrow>
</template>

<script setup>
import ButtonArrow from './ButtonArrow.vue'
</script>
