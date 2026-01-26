import { computed, onMounted, watch, isRef, unref } from 'vue'
import * as chroma from 'chroma-js'
import { useTheme } from '@/composables/useTheme'
import { getContrastColor } from '@/composables/useContrastColor'

/**
 * Section color management for page sections.
 *
 * Generates random pastel colors at page load and provides reactive color
 * properties for each section. Colors are automatically applied as CSS
 * custom properties on the target element.
 *
 * @module useSection
 */

// Generate 5 distinct pastel colors on page load
function generatePastelColors() {
  // Start with a random hue, then space the others evenly
  const startHue = Math.random() * 360
  const hueStep = 360 / 5  // 72 degrees apart
  const colors = []

  for (let i = 0; i < 5; i++) {
    const hue = (startHue + i * hueStep + (Math.random() - 0.5) * 30) % 360  // Add some variation
    const saturation = 0.45 + Math.random() * 0.2   // 45-65% for pastel
    const lightness = 0.65 + Math.random() * 0.1    // 65-75% for pastel

    colors.push(chroma.hsl(hue, saturation, lightness).hex())
  }

  return colors
}

// Generate section colors once on module load
const colors = generatePastelColors()
export const sectionColors = {
  introduction: colors[0],
  investigations: colors[1],
  activity: colors[2],
  oss: colors[3],
  projects: colors[4]
}

/**
 * Set up section-specific colors on an element.
 *
 * Applies --section-primary and --section-primary-contrast CSS variables
 * to the target element based on the section's assigned color. Automatically
 * updates when theme changes.
 *
 * @param {import('vue').Ref<HTMLElement>|HTMLElement|null} [elementRef=null] - Target element ref
 * @param {string|null} [sectionId=null] - Section ID ('introduction', 'investigations', etc.)
 * @returns {Object} Color properties and update function
 * @returns {import('vue').ComputedRef<string>} returns.primaryColor - Section's primary color
 * @returns {import('vue').ComputedRef<string>} returns.primaryContrastColor - Contrasting text color
 * @returns {Function} returns.updateColors - Manually update CSS variables
 *
 * @example
 * const sectionRef = ref(null)
 * const { primaryColor, primaryContrastColor } = useSection(sectionRef, 'introduction')
 */
export function useSection(elementRef = null, sectionId = null) {
  const { theme } = useTheme()

  const rawColor = computed(() => {
    return sectionId ? sectionColors[sectionId] : '#666'
  })

  const primaryColor = computed(() => {
    return getContrastColor(rawColor.value, theme.value)
  })

  const primaryContrastColor = computed(() => {
    return chroma.contrast(primaryColor.value, '#fff') < 4.5 ? '#000' : '#fff'
  })

  function updateColors() {
    const el = isRef(elementRef) ? unref(elementRef) : elementRef
    if (el) {
      el.style.setProperty('--section-primary', primaryColor.value)
      el.style.setProperty('--section-primary-contrast', primaryContrastColor.value)
    }
  }

  onMounted(() => {
    updateColors()
  })

  // Watch for theme changes and update colors reactively
  watch(theme, () => {
    updateColors()
  })

  return {
    primaryColor,
    primaryContrastColor,
    updateColors
  }
}
