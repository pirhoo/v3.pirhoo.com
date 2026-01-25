import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Scroll-based parallax effect.
 *
 * Calculates an offset value based on element position relative to the viewport,
 * creating a parallax scrolling effect. Uses requestAnimationFrame for smooth updates.
 *
 * @param {import('vue').Ref<HTMLElement>} elementRef - Target element ref
 * @param {Object} [options={}] - Parallax options
 * @param {number} [options.speed=0.1] - Parallax intensity (0-1, higher = more movement)
 * @param {string} [options.direction='up'] - Movement direction ('up' or 'down')
 * @returns {Object} Parallax state
 * @returns {import('vue').Ref<number>} returns.offset - Current parallax offset in pixels
 * @returns {import('vue').Ref<boolean>} returns.isVisible - Whether element is in viewport
 *
 * @example
 * const elementRef = ref(null)
 * const { offset } = useParallax(elementRef, { speed: 0.2, direction: 'up' })
 *
 * // In template: :style="{ transform: `translateY(${offset}px)` }"
 */
export function useParallax(elementRef, options = {}) {
  const {
    speed = 0.1,
    direction = 'up'
  } = options

  const offset = ref(0)
  const isVisible = ref(false)
  let ticking = false

  function updateParallax() {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // Check if element is in viewport
    if (rect.top < windowHeight && rect.bottom > 0) {
      isVisible.value = true
      // Calculate how far through the viewport the element is
      const progress = (windowHeight - rect.top) / (windowHeight + rect.height)
      // Apply parallax offset
      const multiplier = direction === 'up' ? -1 : 1
      offset.value = (progress - 0.5) * 100 * speed * multiplier
    } else {
      isVisible.value = false
    }

    ticking = false
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax)
      ticking = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    updateParallax()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return {
    offset,
    isVisible
  }
}
