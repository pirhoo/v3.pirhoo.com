import { ref, onMounted } from 'vue'
import { THEMES, THEME_ATTRIBUTE, THEME_STORAGE_KEY, DEFAULT_THEME } from '@/enums'

/**
 * Theme management with localStorage persistence.
 *
 * Provides reactive theme state and methods for switching between light/dark modes.
 * Theme is applied immediately at module load time to prevent flash of wrong theme.
 *
 * @returns {Object} Theme state and controls
 * @returns {import('vue').Ref<string>} returns.theme - Current theme ('light' or 'dark')
 * @returns {Function} returns.setTheme - Set theme directly by name
 * @returns {Function} returns.cycleTheme - Cycle to next theme in list
 * @returns {Array<string>} returns.THEMES - Available theme names
 *
 * @example
 * const { theme, setTheme, cycleTheme } = useTheme()
 *
 * // Set specific theme
 * setTheme('dark')
 *
 * // Toggle between themes
 * cycleTheme()
 */

// Load saved preference immediately at module load time
const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
const initialTheme = savedTheme && THEMES.includes(savedTheme) ? savedTheme : DEFAULT_THEME

// Shared state across all components
const theme = ref(initialTheme)

function getEffectiveTheme() {
  return theme.value
}

function applyTheme() {
  const effective = getEffectiveTheme()
  document.documentElement.setAttribute(THEME_ATTRIBUTE, effective)
}

// Apply theme immediately before any component mounts
applyTheme()

export function useTheme() {
  function setTheme(newTheme) {
    if (THEMES.includes(newTheme)) {
      theme.value = newTheme
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
      applyTheme()
    }
  }

  function cycleTheme() {
    const currentIndex = THEMES.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % THEMES.length
    setTheme(THEMES[nextIndex])
  }

  onMounted(() => {
    // Theme is already applied at module load time
  })

  return {
    theme,
    setTheme,
    cycleTheme,
    THEMES
  }
}
