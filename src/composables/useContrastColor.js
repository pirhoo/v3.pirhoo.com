import { computed } from 'vue'
import * as chroma from 'chroma-js'
import { useTheme } from './useTheme'

/**
 * Color contrast utilities for WCAG compliance.
 *
 * Ensures colors meet WCAG AA contrast requirements (4.5:1) against
 * the current theme's background color.
 *
 * @module useContrastColor
 */

const LIGHT_BG = '#fafafa'
const DARK_BG = '#000000'
const MIN_CONTRAST_RATIO = 4.5

/**
 * Reactive color adjustment for current theme.
 *
 * @param {import('vue').Ref<string>} colorRef - Ref containing a color value
 * @returns {Object} Adjusted color
 * @returns {import('vue').ComputedRef<string>} returns.adjustedColor - Color adjusted for current theme
 *
 * @example
 * const color = ref('#ff0000')
 * const { adjustedColor } = useContrastColor(color)
 * // adjustedColor automatically lightens/darkens based on theme
 */
export function useContrastColor(colorRef) {
  const { theme } = useTheme()

  const adjustedColor = computed(() => {
    const color = colorRef.value
    if (!color) return color

    try {
      const bgColor = theme.value === 'dark' ? DARK_BG : LIGHT_BG
      return ensureContrast(color, bgColor)
    } catch {
      return color
    }
  })

  return { adjustedColor }
}

/**
 * Adjust color to meet WCAG AA contrast requirements.
 *
 * @param {string} color - Color to adjust (hex)
 * @param {string} bgColor - Background color to contrast against
 * @returns {string} Adjusted color meeting 4.5:1 contrast ratio
 */
export function ensureContrast(color, bgColor) {
  try {
    const colorObj = chroma.default(color)
    const bgObj = chroma.default(bgColor)
    const currentContrast = chroma.default.contrast(colorObj, bgObj)

    if (currentContrast >= MIN_CONTRAST_RATIO) {
      return color
    }

    const bgLuminance = bgObj.luminance()
    const isDarkBg = bgLuminance < 0.5

    // Adjust color to meet contrast requirements
    let adjusted = colorObj
    const maxIterations = 20
    let iterations = 0

    while (chroma.default.contrast(adjusted, bgObj) < MIN_CONTRAST_RATIO && iterations < maxIterations) {
      if (isDarkBg) {
        // On dark background, lighten the color
        adjusted = adjusted.brighten(0.2)
      } else {
        // On light background, darken the color
        adjusted = adjusted.darken(0.2)
      }
      iterations++
    }

    return adjusted.hex()
  } catch {
    return color
  }
}

/**
 * Get contrast-safe color for a given theme.
 *
 * @param {string} color - Color to adjust
 * @param {string} theme - Theme name ('light' or 'dark')
 * @returns {string} Adjusted color meeting contrast requirements
 */
export function getContrastColor(color, theme) {
  if (!color) return color
  const bgColor = theme === 'dark' ? DARK_BG : LIGHT_BG
  return ensureContrast(color, bgColor)
}

/**
 * Determine optimal text color (black or white) for a background.
 *
 * @param {string} bgColor - Background color
 * @returns {string} '#ffffff' for dark backgrounds, '#000000' for light
 */
export function getTextColorForBackground(bgColor) {
  if (!bgColor) return '#ffffff'
  try {
    const bg = chroma.default(bgColor)
    const luminance = bg.luminance()
    // Use white text on dark backgrounds, black text on light backgrounds
    return luminance < 0.5 ? '#ffffff' : '#000000'
  } catch {
    return '#ffffff'
  }
}

/**
 * Get text color with opacity for a background.
 *
 * @param {string} bgColor - Background color
 * @param {number} [opacity=1] - Opacity value (0-1)
 * @returns {string} Text color with opacity applied (CSS rgba)
 */
export function getTextColorWithOpacity(bgColor, opacity = 1) {
  const textColor = getTextColorForBackground(bgColor)
  if (opacity === 1) return textColor
  try {
    return chroma.default(textColor).alpha(opacity).css()
  } catch {
    return textColor
  }
}
