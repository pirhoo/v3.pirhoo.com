import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'theme-preference'
const THEMES = ['auto', 'light', 'dark']

// Shared state across all components
const theme = ref('auto')

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getEffectiveTheme() {
  return theme.value === 'auto' ? getSystemTheme() : theme.value
}

function applyTheme() {
  const effective = getEffectiveTheme()
  document.documentElement.setAttribute('data-theme', effective)
}

export function useTheme() {
  function setTheme(newTheme) {
    if (THEMES.includes(newTheme)) {
      theme.value = newTheme
      localStorage.setItem(STORAGE_KEY, newTheme)
      applyTheme()
    }
  }

  function cycleTheme() {
    const currentIndex = THEMES.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % THEMES.length
    setTheme(THEMES[nextIndex])
  }

  onMounted(() => {
    // Load saved preference
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && THEMES.includes(saved)) {
      theme.value = saved
    }
    applyTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme.value === 'auto') {
        applyTheme()
      }
    })
  })

  return {
    theme,
    setTheme,
    cycleTheme,
    THEMES
  }
}
