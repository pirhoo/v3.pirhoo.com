import { ref, computed, onMounted, onUnmounted, isRef, unref } from 'vue'
import * as chroma from 'chroma-js'
import { useColors } from './useColors'
import { useMousetrack } from './useMousetrack'

export function useSection(elementRef = null) {
  const { colorScalePrimary, colorScaleSecondary, colorScaleText, normalizedRatio, scss, domains, gradientColors } = useColors()
  const mousetrack = useMousetrack()

  const ratio = ref(0)

  const textColor = computed(() => colorScaleText.value(ratio.value))
  const primaryColor = computed(() => colorScalePrimary.value(ratio.value))
  const secondaryColor = computed(() => colorScaleSecondary.value(ratio.value))
  const primaryContrastColor = computed(() => {
    return chroma.contrast(primaryColor.value, '#fff') < 4.5 ? '#000' : '#fff'
  })

  function updateColors(newRatio = ratio.value) {
    ratio.value = normalizedRatio(newRatio)
    const el = isRef(elementRef) ? unref(elementRef) : elementRef
    if (el) {
      el.style.setProperty('--section-text', textColor.value)
      el.style.setProperty('--section-primary', primaryColor.value)
      el.style.setProperty('--section-secondary', secondaryColor.value)
    }
  }

  onMounted(() => {
    mousetrack.on('update.ratio', ({ top, left }) => updateColors(top * left))
    updateColors()
  })

  onUnmounted(() => {
    mousetrack.unbind()
  })

  return {
    ratio,
    textColor,
    primaryColor,
    secondaryColor,
    primaryContrastColor,
    updateColors,
    mousetrack,
    scss,
    domains,
    gradientColors,
    colorScalePrimary,
    colorScaleSecondary,
    colorScaleText,
    normalizedRatio
  }
}
