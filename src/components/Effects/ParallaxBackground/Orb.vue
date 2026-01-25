<template>
  <div
    class="parallax-bg__orb"
    :class="`parallax-bg__orb--${index}`"
    :style="{
      background: color,
      transform: `translate(${x}%, ${y}%)`,
      opacity
    }"
  ></div>
</template>

<script setup>
defineProps({
  index: { type: Number, required: true },
  color: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  opacity: { type: Number, required: true }
})
</script>
