import { computed } from 'vue'
import { bisector } from 'd3'
import * as chroma from 'chroma-js'
import {
  range, first, last, reduce, map, shuffle, identity, filter
} from 'lodash'
import gradients from '@/assets/json/gradients.json'
import scss from '@/utils/variables.js'

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

  const colorScaleSecondary = computed(() => {
    const scale = chroma.scale(map(gradientColors.value, last))
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
    colorScaleSecondary,
    colorScaleText,
    normalizedRatio
  }
}
