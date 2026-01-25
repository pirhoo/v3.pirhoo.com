import { ref, onUnmounted, watch } from 'vue'

/**
 * Animated number counter with easing.
 *
 * Provides smooth animated counting from 0 to a target value, typically
 * triggered when an element enters the viewport.
 *
 * @param {import('vue').Ref<number>} targetValue - Target number to count to
 * @param {Object} [options={}] - Animation options
 * @param {number} [options.duration=2000] - Animation duration in ms
 * @param {number} [options.delay=0] - Delay before animation starts in ms
 * @param {Function} [options.easing=easeOutExpo] - Easing function
 * @returns {Object} Animation state and controls
 * @returns {import('vue').Ref<number>} returns.currentValue - Current animated value
 * @returns {import('vue').Ref<boolean>} returns.isAnimating - Whether animation is running
 * @returns {import('vue').Ref<boolean>} returns.hasAnimated - Whether animation has completed
 * @returns {Function} returns.startAnimation - Start the animation (no-op if already animated)
 * @returns {Function} returns.reset - Reset to allow re-animation
 *
 * @example
 * const count = ref(100)
 * const { currentValue, startAnimation } = useCountAnimation(count, { duration: 1500 })
 *
 * // Trigger on intersection
 * onVisible(() => startAnimation())
 */
export function useCountAnimation(targetValue, options = {}) {
  const {
    duration = 2000,
    delay = 0,
    easing = easeOutExpo
  } = options

  const currentValue = ref(0)
  const isAnimating = ref(false)
  const hasAnimated = ref(false)
  let animationFrame = null
  let startTime = null

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easing(progress)

    currentValue.value = Math.round(easedProgress * targetValue.value)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    } else {
      currentValue.value = targetValue.value
      isAnimating.value = false
    }
  }

  function startAnimation() {
    if (hasAnimated.value || isAnimating.value) return

    hasAnimated.value = true
    isAnimating.value = true
    startTime = null

    if (delay > 0) {
      setTimeout(() => {
        animationFrame = requestAnimationFrame(animate)
      }, delay)
    } else {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  function reset() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
    currentValue.value = 0
    hasAnimated.value = false
    isAnimating.value = false
    startTime = null
  }

  // Update current value if target changes after animation
  watch(targetValue, newVal => {
    if (hasAnimated.value && !isAnimating.value) {
      currentValue.value = newVal
    }
  })

  onUnmounted(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  })

  return {
    currentValue,
    isAnimating,
    hasAnimated,
    startAnimation,
    reset
  }
}
