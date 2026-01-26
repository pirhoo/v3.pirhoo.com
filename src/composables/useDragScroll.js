import { ref } from 'vue'

/**
 * Drag-to-scroll functionality for horizontal scroll containers.
 *
 * Enables click-and-drag scrolling on a container element, with automatic
 * cursor changes and click prevention after drag gestures.
 *
 * @returns {Object} Drag scroll state and handlers
 * @returns {import('vue').Ref<boolean>} returns.isDragging - Whether drag is in progress
 * @returns {Function} returns.onMouseDown - Attach to container's @mousedown event
 *
 * @example
 * const { isDragging, onMouseDown } = useDragScroll()
 *
 * // In template:
 * // <div class="scroll-container" @mousedown="onMouseDown" :class="{ dragging: isDragging }">
 */
export function useDragScroll() {
  const isDragging = ref(false)
  let startX = 0
  let scrollLeft = 0
  let element = null
  let hasMoved = false

  function onMouseDown(e) {
    element = e.currentTarget
    isDragging.value = true
    hasMoved = false
    startX = e.clientX
    scrollLeft = element.scrollLeft
    element.style.cursor = 'grabbing'
    element.style.userSelect = 'none'
    element.style.scrollSnapType = 'none'

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onMouseUp() {
    isDragging.value = false
    if (element) {
      element.style.cursor = 'grab'
      element.style.userSelect = ''
      // Enable smooth scroll for snap transition, then restore
      element.style.scrollBehavior = 'smooth'
      element.style.scrollSnapType = ''
      // Remove smooth behavior after snap completes
      setTimeout(() => {
        if (element) {
          element.style.scrollBehavior = ''
        }
      }, 300)
    }

    // If we dragged, prevent the click event on links
    if (hasMoved) {
      const preventClick = e => {
        e.preventDefault()
        e.stopPropagation()
      }
      document.addEventListener('click', preventClick, { capture: true, once: true })
    }

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(e) {
    if (!isDragging.value || !element) return

    e.preventDefault()
    const delta = e.clientX - startX

    // Only consider it a drag if moved more than a few pixels
    if (Math.abs(delta) > 3) {
      hasMoved = true
    }

    element.scrollLeft = scrollLeft - delta
  }

  return {
    isDragging,
    onMouseDown
  }
}
