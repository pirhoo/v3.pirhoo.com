import { computed } from 'vue'
import { bisector } from 'd3'
import * as chroma from 'chroma-js'
import {
  range, first, reduce, map, shuffle, identity, filter
} from 'lodash'
import gradients from '@/assets/json/gradients.json'
import scss from '@/utils/variables.js'

/**
 * Color scale management for gradient effects.
 *
 * Loads gradient color sets from JSON, filters out garish colors, and provides
 * interpolation functions for smooth color transitions based on scroll position
 * or other ratios.
 *
 * @module useColors
 */

// Filter out garish colors (yellow, orange - high saturation warm hues)
function isGarishColor(hex) {
  const [h, s, l] = chroma.default(hex).hsl()
  // Yellow/orange hues (20-80) with high saturation and lightness
  return h >= 20 && h <= 80 && s > 0.5 && l > 0.4
}

function hasGarishColors(gradient) {
  return gradient.colors.some(isGarishColor)
}

// Filter gradients to only sober colors, then shuffle and slice
const soberGradients = filter(gradients, g => !hasGarishColors(g))
export const gradientsSlice = shuffle(soberGradients).slice(0, 16)

// Random ratio set once on page load, shared across components
export const colorRatio = Math.random()

/**
 * Access color scales and gradient utilities.
 *
 * @returns {Object} Color utilities and scales
 * @returns {Object} returns.scss - SCSS variables exported to JS
 * @returns {import('vue').ComputedRef<Array<Array<string>>>} returns.gradientColors - Nested array of gradient color sets
 * @returns {import('vue').ComputedRef<Array<number>>} returns.domains - Domain values for color scale interpolation
 * @returns {import('vue').ComputedRef<Function>} returns.colorScalePrimary - Function(ratio) returning hex color
 * @returns {import('vue').ComputedRef<Function>} returns.colorScaleText - Function(ratio) returning text-appropriate color
 * @returns {Function} returns.normalizedRatio - Snap ratio to nearest domain boundary
 *
 * @example
 * const { colorScalePrimary, normalizedRatio } = useColors()
 * const color = colorScalePrimary.value(0.5) // Get color at midpoint
 */
export function useColors() {
  const gradientColors = computed(() => {
    return reduce(gradientsSlice, (all, gradient) => all.concat([gradient.colors]), [])
  })

  const domains = computed(() => {
    const tick = 1 / gradientColors.value.length
    return range(0, 1 + tick, tick)
  })

  const colorScalePrimary = computed(() => {
    const scale = chroma.scale(map(gradientColors.value, first))
    return ratio => scale(ratio).hex()
  })

  const colorScaleText = computed(() => {
    return ratio => chroma.mix(colorScalePrimary.value(ratio), scss.bodyColor, 0.8)
  })

  function normalizedRatio(ratio) {
    const index = bisector(identity).left(domains.value, ratio)
    return domains.value[index]
  }

  return {
    scss,
    gradientColors,
    domains,
    colorScalePrimary,
    colorScaleText,
    normalizedRatio
  }
}
