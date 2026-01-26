<template>
  <component :is="tag" class="text-reveal-group">
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

const isVisible = ref(false)
const registeredElements = []

let observer = null

function register(element) {
  if (element && !registeredElements.includes(element)) {
    registeredElements.push(element)
    if (observer) {
      observer.observe(element)
    }
  }
}

function unregister(element) {
  const index = registeredElements.indexOf(element)
  if (index > -1) {
    registeredElements.splice(index, 1)
    if (observer) {
      observer.unobserve(element)
    }
  }
}

// Provide visibility state and registration to child TextReveal components
provide('textRevealGroup', {
  isVisible,
  register,
  unregister
})

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

  // Observe all registered elements
  registeredElements.forEach(el => observer.observe(el))
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
