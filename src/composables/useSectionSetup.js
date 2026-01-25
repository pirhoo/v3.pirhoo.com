import { ref } from 'vue'
import { useSection } from './useSection'
import { useParallax } from './useParallax'

/**
 * Combined section setup helper.
 *
 * Convenience composable that combines useSection and useParallax setup
 * for page sections, reducing boilerplate in section components.
 *
 * @param {string} sectionId - Section identifier ('introduction', 'investigations', etc.)
 * @param {Object} [options={}] - Setup options
 * @param {number} [options.parallaxSpeed=0.15] - Parallax scroll speed (0-1)
 * @returns {Object} Section setup state
 * @returns {import('vue').Ref<HTMLElement>} returns.sectionRef - Ref to attach to section element
 * @returns {import('vue').Ref<number>} returns.parallaxOffset - Current parallax offset
 * @returns {import('vue').Ref<boolean>} returns.isVisible - Whether section is visible
 * @returns {import('vue').ComputedRef<string>} returns.primaryColor - Section's primary color
 * @returns {import('vue').ComputedRef<string>} returns.primaryContrastColor - Contrasting text color
 *
 * @example
 * const { sectionRef, parallaxOffset, primaryColor } = useSectionSetup('introduction')
 *
 * // In template:
 * // <section ref="sectionRef" :style="{ '--offset': parallaxOffset + 'px' }">
 */
export function useSectionSetup(sectionId, options = {}) {
  const { parallaxSpeed = 0.15 } = options

  const sectionRef = ref(null)

  const { primaryColor, primaryContrastColor } = useSection(sectionRef, sectionId)
  const { offset: parallaxOffset, isVisible } = useParallax(sectionRef, { speed: parallaxSpeed })

  return {
    sectionRef,
    parallaxOffset,
    isVisible,
    primaryColor,
    primaryContrastColor
  }
}
