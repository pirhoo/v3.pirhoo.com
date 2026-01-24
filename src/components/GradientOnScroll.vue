<template>
  <div class="gradient-on-scroll">
    <canvas ref="canvasRef" class="gradient-on-scroll__canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Granim from 'granim'
import { useColors, colorRatio } from '@/composables/useColors'

const canvasRef = ref(null)
let granim = null

const {
  scss,
  colorScalePrimary,
  colorScaleSecondary
} = useColors()

// Use shared color ratio
const ratio = colorRatio

onMounted(() => {
  granim = new Granim({
    element: canvasRef.value,
    direction: 'diagonal',
    opacity: [1, 1],
    states: {
      'default-state': {
        loop: true,
        transitionSpeed: parseInt(scss.colorTransitionSpeed, 10),
        gradients: [
          [colorScalePrimary.value(ratio), colorScaleSecondary.value(ratio)],
          [colorScaleSecondary.value(ratio), colorScalePrimary.value(ratio)]
        ]
      }
    },
    isPausedWhenNotInView: false
  })
})

onUnmounted(() => {
  if (granim) {
    granim.destroy()
  }
})
</script>

<style lang="scss">
  @import '@/utils/_settings.scss';

  .gradient-on-scroll {
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    z-index: -1;
    background: transparent;
    border-radius: $border-radius-lg;
    overflow: hidden;

    &__canvas {
      width: 100%;
      height: 100%;
    }
  }
</style>
