<template>
  <component :is="tag" ref="groupRef" class="text-reveal-group">
    <slot />
  </component>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'div'
  },
  threshold: {
    type: Number,
    default: 0.2
  },
  rootMargin: {
    type: String,
    default: '0px 0px -50px 0px'
  }
})

const groupRef = ref(null)
const isVisible = ref(false)

// Provide visibility state to child TextReveal components
provide('textRevealGroup', {
  isVisible
})

let observer = null

function handleIntersect(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isVisible.value = true
      observer.disconnect()
    }
  })
}

onMounted(() => {
  observer = new IntersectionObserver(handleIntersect, {
    threshold: props.threshold,
    rootMargin: props.rootMargin
  })

  if (groupRef.value) {
    observer.observe(groupRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss">
.text-reveal-group {
  display: block;
}
</style>
