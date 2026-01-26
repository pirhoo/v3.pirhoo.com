<template>
  <component :is="tag" class="text-reveal-group">
    <span ref="sentinelRef" class="text-reveal-group__sentinel" />
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

const sentinelRef = ref(null)
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

  // Observe the sentinel at the top of the group
  if (sentinelRef.value) {
    observer.observe(sentinelRef.value)
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
  position: relative;

  &__sentinel {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    pointer-events: none;
  }
}
</style>
