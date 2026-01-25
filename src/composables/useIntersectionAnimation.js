import { ref, onMounted, onUnmounted, isRef, unref } from 'vue'

/**
 * Intersection Observer-based visibility detection for animations.
 *
 * Tracks when an element enters the viewport to trigger entrance animations.
 * By default, triggers once and disconnects.
 *
 * @param {import('vue').Ref<HTMLElement>|HTMLElement} elementRef - Target element ref
 * @param {Object} [options={}] - Observer options
 * @param {number} [options.threshold=0.1] - Visibility threshold (0-1)
 * @param {string} [options.rootMargin='0px 0px -50px 0px'] - Root margin for trigger offset
 * @param {boolean} [options.once=true] - Only trigger once then disconnect
 * @returns {Object} Visibility state
 * @returns {import('vue').Ref<boolean>} returns.isVisible - Whether element is currently visible
 * @returns {import('vue').Ref<boolean>} returns.hasAnimated - Whether animation has been triggered
 *
 * @example
 * const elementRef = ref(null)
 * const { isVisible, hasAnimated } = useIntersectionAnimation(elementRef)
 *
 * // Use with CSS class: :class="{ 'fade-in': hasAnimated }"
 */
export function useIntersectionAnimation(elementRef, options = {}) {
  const isVisible = ref(false)
  const hasAnimated = ref(false)

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    once: true
  }

  const mergedOptions = { ...defaultOptions, ...options }
  let observer = null

  function handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true
        hasAnimated.value = true

        if (mergedOptions.once && observer) {
          observer.unobserve(entry.target)
        }
      } else if (!mergedOptions.once) {
        isVisible.value = false
      }
    })
  }

  onMounted(() => {
    const el = isRef(elementRef) ? unref(elementRef) : elementRef
    if (!el) return

    observer = new IntersectionObserver(handleIntersection, {
      threshold: mergedOptions.threshold,
      rootMargin: mergedOptions.rootMargin
    })

    observer.observe(el)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isVisible,
    hasAnimated
  }
}
