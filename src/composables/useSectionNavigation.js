import { ref, computed, onMounted, onUnmounted } from 'vue'
import { sectionColors } from '@/composables/useSection'
import { SectionId, SectionLabel, SectionLabelShort, SECTION_IDS } from '@/enums'

/**
 * Section-based navigation with scroll tracking.
 *
 * Provides reactive state and methods for navigating between page sections
 * with automatic scroll position tracking to highlight the active section.
 *
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.useShortLabels=false] - Use abbreviated section labels
 * @param {number} [options.scrollDelay=0] - Delay before scrolling (ms), useful for closing menus first
 * @param {Function} [options.onBeforeNavigate] - Callback invoked before navigation starts
 * @returns {Object} Navigation state and methods
 * @returns {import('vue').ComputedRef<Array<{id: string, label: string, color: string}>>} returns.sections - Array of section objects
 * @returns {import('vue').Ref<string>} returns.activeSection - Currently active section ID
 * @returns {Function} returns.scrollToSection - Function to scroll to a section by ID
 *
 * @example
 * // Desktop nav with short labels
 * const { sections, activeSection, scrollToSection } = useSectionNavigation({
 *   useShortLabels: true
 * })
 *
 * @example
 * // Mobile nav with delay for closing menu
 * const { sections, activeSection, scrollToSection } = useSectionNavigation({
 *   scrollDelay: 300,
 *   onBeforeNavigate: () => closeMenu()
 * })
 */
export function useSectionNavigation(options = {}) {
  const { useShortLabels = false, scrollDelay = 0, onBeforeNavigate = null } = options

  const sections = computed(() => {
    const labels = useShortLabels ? SectionLabelShort : SectionLabel
    return SECTION_IDS.map(id => ({
      id,
      label: labels[id],
      color: sectionColors[id]
    }))
  })

  const activeSection = ref(SectionId.INTRODUCTION)

  function updateActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 3
    for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
      const element = document.querySelector(`.${SECTION_IDS[i]}`)
      if (element && element.offsetTop <= scrollPosition) {
        activeSection.value = SECTION_IDS[i]
        break
      }
    }
  }

  function scrollToSection(sectionId) {
    const element = document.querySelector(`.${sectionId}`)
    if (!element) return

    if (onBeforeNavigate) {
      onBeforeNavigate()
    }

    const scroll = () => element.scrollIntoView({ behavior: 'smooth', block: 'start' })

    if (scrollDelay > 0) {
      setTimeout(scroll, scrollDelay)
    } else {
      scroll()
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    updateActiveSection()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveSection)
  })

  return { sections, activeSection, scrollToSection }
}
