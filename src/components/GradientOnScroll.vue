<template>
  <div class="gradient-on-scroll">
    <canvas ref="canvasRef" class="gradient-on-scroll__canvas"></canvas>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Granim from 'granim'
import { reduce, assign } from 'lodash'
import { useColors } from '@/composables/useColors'
import { useMousetrack } from '@/composables/useMousetrack'

export default {
  name: 'GradientOnScroll',
  setup() {
    const canvasRef = ref(null)
    const granim = ref(null)

    const {
      scss,
      domains,
      colorScalePrimary,
      colorScaleSecondary,
      normalizedRatio
    } = useColors()

    const mousetrack = useMousetrack()

    function ratioState(ratio) {
      return `state-${normalizedRatio(ratio)}`
    }

    const granimStates = computed(() => {
      return reduce(domains.value, (states, ratio) => assign(states, {
        [ratioState(ratio)]: {
          loop: true,
          transitionSpeed: parseInt(scss.colorTransitionSpeed, 10),
          gradients: [
            [colorScalePrimary.value(ratio), colorScaleSecondary.value(ratio)],
            [colorScaleSecondary.value(ratio), colorScalePrimary.value(ratio)]
          ]
        }
      }), {})
    })

    onMounted(() => {
      granim.value = new Granim({
        element: canvasRef.value,
        direction: 'diagonal',
        defaultStateName: ratioState(0),
        opacity: [1, 1],
        stateTransitionSpeed: parseInt(scss.colorTransitionDuration, 10),
        states: granimStates.value,
        isPausedWhenNotInView: false
      })

      if (mousetrack.isMobile) {
        granim.value.pause()
      } else {
        mousetrack.on('update.ratio', ({ top, left }) => {
          granim.value.changeState(ratioState(top * left))
        })
      }
    })

    onUnmounted(() => {
      if (granim.value) {
        granim.value.destroy()
      }
    })

    return {
      canvasRef
    }
  }
}
</script>

<style lang="scss">
  .gradient-on-scroll {
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    z-index: -1;
    background: transparent;

    &__canvas {
      width: 100%;
      height: 100%;
    }
  }
</style>
