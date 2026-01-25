<template>
  <svg class="nav-patterns" aria-hidden="true">
    <defs>
      <pattern
        v-for="section in sections"
        :id="`hatch-${section.id}`"
        :key="section.id"
        patternUnits="userSpaceOnUse"
        width="4"
        height="4"
        patternTransform="rotate(45)"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="4"
          :stroke="section.color"
          stroke-width="1.5"
        />
      </pattern>
    </defs>
  </svg>
</template>

<script setup>
defineProps({
  sections: { type: Array, required: true }
})
</script>

<style lang="scss">
.nav-patterns {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
