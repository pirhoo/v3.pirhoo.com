import { computed } from 'vue'
import { bisector } from 'd3'
import * as chroma from 'chroma-js'
import {
  range, first, last, reduce, map, shuffle, identity
} from 'lodash'
import gradients from '@/assets/json/gradients.json'
import scss from '@/utils/variables.js'

// Only create the slice once
export const gradientsSlice = shuffle(gradients).slice(0, 16)

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
