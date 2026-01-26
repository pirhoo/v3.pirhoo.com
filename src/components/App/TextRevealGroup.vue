<template>
  <component :is="tag" class="text-reveal-group">
    <slot />
  </component>
</template>

<script setup>
import { provide, nextTick } from 'vue'

defineProps({
  tag: {
    type: String,
    default: 'div'
  }
})

const revealCallbacks = []
let hasRevealed = false

function register(callback) {
  revealCallbacks.push(callback)
  // If already revealed, trigger immediately
  if (hasRevealed) {
    callback()
  }
}

function reveal() {
  if (hasRevealed) return
  hasRevealed = true
  // Defer to ensure all children have registered
  nextTick(() => {
    revealCallbacks.forEach(cb => cb())
  })
}

// Provide registration and reveal function to child TextReveal components
provide('textRevealGroup', {
  register,
  reveal
})
</script>

<style lang="scss">
.text-reveal-group {
  display: block;
}
</style>
