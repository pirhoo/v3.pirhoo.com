import { onMounted, onUnmounted, unref, watch, isRef } from 'vue'

/**
 * Declarative event listener with automatic cleanup.
 *
 * Attaches an event listener to a target (element or ref) and automatically
 * removes it on unmount. Handles ref changes by re-attaching listeners.
 *
 * @param {import('vue').Ref<HTMLElement>|HTMLElement|Window} target - Event target
 * @param {string} event - Event name (e.g., 'click', 'scroll')
 * @param {Function} handler - Event handler function
 * @param {Object} [options={}] - addEventListener options (passive, capture, etc.)
 * @returns {Object} Cleanup utilities
 * @returns {Function} returns.remove - Manually remove the event listener
 *
 * @example
 * const buttonRef = ref(null)
 * const { remove } = useEventListener(buttonRef, 'click', () => console.log('Clicked'))
 *
 * // Manually remove if needed
 * remove()
 */
export function useEventListener(target, event, handler, options = {}) {
  let cleanup = null

  function add() {
    const el = unref(target)
    if (!el) return

    el.addEventListener(event, handler, options)
    cleanup = () => el.removeEventListener(event, handler, options)
  }

  function remove() {
    cleanup?.()
    cleanup = null
  }

  if (isRef(target)) {
    watch(target, (newVal, oldVal) => {
      if (oldVal) remove()
      if (newVal) add()
    }, { immediate: true })
  } else {
    onMounted(add)
  }

  onUnmounted(remove)

  return { remove }
}
