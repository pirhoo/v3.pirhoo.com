import { computed } from 'vue'
import * as chroma from 'chroma-js'
import { sectionColors } from '@/composables/useSection'

/**
 * Orb color generation for parallax background.
 *
 * Generates color palettes for background orbs based on section colors,
 * with smooth interpolation between sections as user scrolls.
 *
 * @module useOrbColors
 */

function generateOrbColors(hex) {
  const base = chroma.default(hex)
  return [
    base.alpha(0.8).css(),
    base.darken(1).alpha(0.6).css(),
    base.darken(2).alpha(0.4).css()
  ]
}

const colorPalettes = [
  generateOrbColors(sectionColors.introduction),
  generateOrbColors(sectionColors.investigations),
  generateOrbColors(sectionColors.activity),
  generateOrbColors(sectionColors.projects)
]

function lerpColor(color1, color2, t) {
  return chroma.default.mix(color1, color2, t).css()
}

/**
 * Interpolated orb colors based on scroll progress.
 *
 * @param {import('vue').ComputedRef<{index: number, progress: number}>} sectionProgress - Current section and progress
 * @returns {Object} Color state
 * @returns {import('vue').ComputedRef<Array<string>>} returns.currentColors - Current interpolated orb colors (CSS)
 * @returns {number} returns.paletteCount - Number of color palettes (sections)
 *
 * @example
 * const { sectionProgress } = useScrollProgress(4)
 * const { currentColors } = useOrbColors(sectionProgress)
 * // currentColors.value = ['rgba(255,100,100,0.8)', 'rgba(200,50,50,0.6)', ...]
 */
export function useOrbColors(sectionProgress) {
  const currentColors = computed(() => {
    const { index, progress } = sectionProgress.value
    const current = colorPalettes[index]
    const next = colorPalettes[Math.min(index + 1, colorPalettes.length - 1)]

    return current.map((color, i) => {
      return lerpColor(color, next[i], progress)
    })
  })

  return { currentColors, paletteCount: colorPalettes.length }
}
