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
      <polyline points="15 18 9 12 15 6" />
    </svg>
  </button-arrow>
</template>

<script setup>
import ButtonArrow from './ButtonArrow.vue'
</script>
