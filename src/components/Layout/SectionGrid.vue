<template>
  <div class="section-grid" :style="style">
    <div class="section-grid__label">
      <slot name="label"></slot>
    </div>
    <div class="section-grid__content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  parallaxOffset: {
    type: Number,
    default: 0
  }
})

const style = computed(() => ({
  transform: props.parallaxOffset ? `translateY(${props.parallaxOffset}px)` : undefined
}))
</script>

<style lang="scss">
@import '@/utils/_settings';

.section-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: $space-10;
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 0 $grid-gutter * 2;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: $space-6;
    padding: 0 $grid-gutter;
  }

  &__label {
    padding-top: $space-2;
  }
}
</style>
