import { ref, computed, onMounted, isRef, unref } from 'vue'
import * as chroma from 'chroma-js'
import { useColors, colorRatio } from './useColors'

function isDarkMode() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

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
      // In dark mode, use white text; in light mode, use computed text color
      const effectiveTextColor = isDarkMode() ? '#fff' : textColor.value
      // In dark mode, use lighter color for links; in light mode, use primary
      const effectiveLinkColor = isDarkMode() ? secondaryColor.value : primaryColor.value
      el.style.setProperty('--section-text', effectiveTextColor)
      el.style.setProperty('--section-primary', primaryColor.value)
      el.style.setProperty('--section-secondary', secondaryColor.value)
      el.style.setProperty('--section-link-color', effectiveLinkColor)
    }
  }

  onMounted(() => {
    updateColors()

    // Watch for theme changes
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') {
          updateColors()
        }
      }
    })
    observer.observe(document.documentElement, { attributes: true })
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
