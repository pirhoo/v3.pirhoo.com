<template>
  <component
    :is="tag"
    ref="elementRef"
    class="text-reveal"
    :class="{ 'text-reveal--visible': isVisible }"
  >
    <span
      v-for="(word, index) in words"
      :key="index"
      class="text-reveal__word"
      :style="{ transitionDelay: `${delay + index * stagger}ms` }"
    >{{ word }}<span v-if="index < words.length - 1">&nbsp;</span></span>
  </component>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    default: 'span'
  },
  delay: {
    type: Number,
    default: 0
  },
  stagger: {
    type: Number,
    default: 80
  }
})

const elementRef = ref(null)
const isVisible = ref(false)

// Check if we're inside a TextRevealGroup
const group = inject('textRevealGroup', null)

let observer = null

const words = computed(() => props.text.split(' '))

function handleIntersect(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (group) {
        // Trigger reveal for all siblings in the group
        group.reveal()
      } else {
        isVisible.value = true
      }
      observer.disconnect()
    }
  })
}

onMounted(() => {
  // Register with group so reveal() can trigger this component
  if (group) {
    group.register(() => {
      isVisible.value = true
    })
  }

  observer = new IntersectionObserver(handleIntersect, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  })

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss">
.text-reveal {
  display: inline;

  &__word {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
    padding-bottom: 0.15em;
    margin-bottom: -0.15em;
    transform: translateY(100%);
    opacity: 0;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
  }

  &--visible &__word {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
