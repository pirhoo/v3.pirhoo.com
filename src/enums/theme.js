export const Theme = Object.freeze({
  DARK: 'dark',
  LIGHT: 'light'
})

export const THEMES = Object.freeze([Theme.DARK, Theme.LIGHT])
export const THEME_ATTRIBUTE = 'data-bs-theme'
export const THEME_STORAGE_KEY = 'theme-preference'
export const DEFAULT_THEME = Theme.DARK
