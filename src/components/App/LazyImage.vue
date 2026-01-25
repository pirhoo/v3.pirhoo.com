<template>
  <img
    v-lazy="src"
    :alt="alt"
    class="lazy-image"
  />
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss">
.lazy-image {
  opacity: 0;
  transition: opacity 0.4s ease;

  &[lazy=loaded] {
    opacity: 1;
  }

  &[lazy=loading] {
    opacity: 0.3;
  }

  &[lazy=error] {
    opacity: 0.5;
  }
}
</style>
