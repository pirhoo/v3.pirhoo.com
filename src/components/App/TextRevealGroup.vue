<template>
  <component :is="tag" class="text-reveal-group">
    <slot />
  </component>
</template>

<script setup>
import { ref, provide } from 'vue'

defineProps({
  tag: {
    type: String,
    default: 'div'
  }
})

const isVisible = ref(false)

function reveal() {
  isVisible.value = true
}

// Provide visibility state and reveal function to child TextReveal components
provide('textRevealGroup', {
  isVisible,
  reveal
})
</script>

<style lang="scss">
.text-reveal-group {
  display: block;
}
</style>
