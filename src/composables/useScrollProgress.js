import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Scroll progress tracking for section-based animations.
 *
 * Tracks scroll position relative to document height and calculates
 * which section is currently active with interpolated progress.
 *
 * @param {number} sectionCount - Total number of sections to divide page into
 * @returns {Object} Scroll state
 * @returns {import('vue').ComputedRef<{index: number, progress: number}>} returns.sectionProgress - Current section index and progress (0-1) within section
 * @returns {import('vue').ComputedRef<number>} returns.scrollFactor - Overall scroll progress (0-1)
 *
 * @example
 * const { sectionProgress, scrollFactor } = useScrollProgress(4)
 *
 * // sectionProgress.value = { index: 1, progress: 0.5 }
 * // means we're halfway through section 1 (0-indexed)
 */
export function useScrollProgress(sectionCount) {
  const scrollY = ref(0)
  const windowHeight = ref(1000)
  const docHeight = ref(4000)

  function updateScroll() {
    scrollY.value = window.scrollY
    windowHeight.value = window.innerHeight
    docHeight.value = document.documentElement.scrollHeight
  }

  onMounted(() => {
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll, { passive: true })
    updateScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateScroll)
    window.removeEventListener('resize', updateScroll)
  })

  const sectionProgress = computed(() => {
    const totalScroll = docHeight.value - windowHeight.value
    if (totalScroll <= 0) return { index: 0, progress: 0 }

    const scrollRatio = scrollY.value / totalScroll
    const exactSection = scrollRatio * sectionCount
    const index = Math.min(Math.floor(exactSection), sectionCount - 1)
    const progress = exactSection - index

    return { index, progress }
  })

  const scrollFactor = computed(() => {
    const totalScroll = docHeight.value - windowHeight.value
    return totalScroll > 0 ? scrollY.value / totalScroll : 0
  })

  return { sectionProgress, scrollFactor }
}
