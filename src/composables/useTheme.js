import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'theme-preference'
const THEMES = ['dark', 'light']

// Load saved preference immediately at module load time
const savedTheme = localStorage.getItem(STORAGE_KEY)
const initialTheme = savedTheme && THEMES.includes(savedTheme) ? savedTheme : 'dark'

// Shared state across all components
const theme = ref(initialTheme)

function getEffectiveTheme() {
  return theme.value
}

function applyTheme() {
  const effective = getEffectiveTheme()
  document.documentElement.setAttribute('data-theme', effective)
}

// Apply theme immediately before any component mounts
applyTheme()

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
    // Theme is already applied at module load time
  })

  return {
    theme,
    setTheme,
    cycleTheme,
    THEMES
  }
}
