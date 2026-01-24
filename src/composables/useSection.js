import { ref, computed, onMounted, isRef, unref } from 'vue'
import * as chroma from 'chroma-js'
import { useColors, colorRatio } from './useColors'

export function useSection(elementRef = null) {
  const { colorScalePrimary, colorScaleSecondary, colorScaleText, normalizedRatio, scss, domains, gradientColors } = useColors()

  // Use shared color ratio set once on page load
  const ratio = ref(normalizedRatio(colorRatio))

  const textColor = computed(() => colorScaleText.value(ratio.value))
  const primaryColor = computed(() => colorScalePrimary.value(ratio.value))
  const secondaryColor = computed(() => colorScaleSecondary.value(ratio.value))
  const primaryContrastColor = computed(() => {
    return chroma.contrast(primaryColor.value, '#fff') < 4.5 ? '#000' : '#fff'
  })

  function updateColors() {
    const el = isRef(elementRef) ? unref(elementRef) : elementRef
    if (el) {
      el.style.setProperty('--section-text', textColor.value)
      el.style.setProperty('--section-primary', primaryColor.value)
      el.style.setProperty('--section-secondary', secondaryColor.value)
    }
  }

  onMounted(() => {
    updateColors()
  })

  return {
    ratio,
    textColor,
    primaryColor,
    secondaryColor,
    primaryContrastColor,
    updateColors,
    scss,
    domains,
    gradientColors,
    colorScalePrimary,
    colorScaleSecondary,
    colorScaleText,
    normalizedRatio
  }
}
