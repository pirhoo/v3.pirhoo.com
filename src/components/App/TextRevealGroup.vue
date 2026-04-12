<template>
  <component :is="tag" ref="groupRef" class="text-reveal-group">
    <slot></slot>
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

const groupRef = ref(null)
const revealed = ref(false)

let pendingCount = 0
let completedCount = 0

function registerAnimation() {
  pendingCount++
  return () => {
    completedCount++
    if (completedCount >= pendingCount) {
      revealed.value = true
    }
  }
}

provide('textRevealGroup', { element: groupRef, registerAnimation })
defineExpose({ revealed })
</script>

<style lang="scss">
.text-reveal-group {
  display: block;
}
</style>
