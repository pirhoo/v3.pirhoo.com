import { ref } from 'vue'

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

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function onMouseUp() {
    isDragging.value = false
    if (element) {
      element.style.cursor = 'grab'
      element.style.userSelect = ''
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
