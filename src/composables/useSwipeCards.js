import { ref, computed } from 'vue'

/**
 * Swipeable card stack navigation.
 *
 * Manages a stack of cards with touch/mouse swipe support, keyboard navigation,
 * and circular indexing. Handles drag gestures and click-to-advance.
 *
 * @param {import('vue').Ref<Array>} items - Array of card items
 * @returns {Object} Card state and handlers
 * @returns {import('vue').Ref<number>} returns.currentIndex - Index of top card
 * @returns {import('vue').ComputedRef<Object>} returns.currentItem - Current top card item
 * @returns {import('vue').ComputedRef<Array>} returns.visibleItems - Top 3 cards with stackIndex
 * @returns {import('vue').ComputedRef<number>} returns.totalItems - Total number of cards
 * @returns {import('vue').Ref<boolean>} returns.isDragging - Whether a drag is in progress
 * @returns {import('vue').Ref<number>} returns.dragOffset - Current drag offset in pixels
 * @returns {Function} returns.next - Advance to next card
 * @returns {Function} returns.prev - Go to previous card
 * @returns {Function} returns.goTo - Jump to specific index
 * @returns {Function} returns.handleKeydown - Keyboard event handler (arrows)
 * @returns {Function} returns.handleDragStart - Touch/mouse start handler
 * @returns {Function} returns.handleDragMove - Touch/mouse move handler
 * @returns {Function} returns.handleDragEnd - Touch/mouse end handler
 * @returns {Function} returns.handleClick - Click handler (advances if no swipe)
 *
 * @example
 * const cards = ref([{ title: 'Card 1' }, { title: 'Card 2' }])
 * const { currentItem, handleDragStart, handleDragMove, handleDragEnd } = useSwipeCards(cards)
 */
export function useSwipeCards(items) {
  const currentIndex = ref(0)
  const isDragging = ref(false)
  const dragOffset = ref(0)
  const dragStartX = ref(0)
  const dragStartY = ref(0)
  const isHorizontalDrag = ref(null)
  const didSwipe = ref(false)

  const totalItems = computed(() => items.value?.length || 0)

  const currentItem = computed(() => items.value?.[currentIndex.value])

  const visibleItems = computed(() => {
    if (!items.value || items.value.length === 0) return []
    const result = []
    for (let i = 0; i < Math.min(3, items.value.length); i++) {
      const index = (currentIndex.value + i) % items.value.length
      result.push({ ...items.value[index], stackIndex: i })
    }
    return result
  })

  function next() {
    if (totalItems.value > 0) {
      currentIndex.value = (currentIndex.value + 1) % totalItems.value
    }
  }

  function prev() {
    if (totalItems.value > 0) {
      currentIndex.value = (currentIndex.value - 1 + totalItems.value) % totalItems.value
    }
  }

  function goTo(index) {
    if (index >= 0 && index < totalItems.value) {
      currentIndex.value = index
    }
  }

  function handleKeydown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      next()
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      prev()
    }
  }

  function handleDragStart(event) {
    isDragging.value = true
    isHorizontalDrag.value = null
    const touch = event.type.includes('touch') ? event.touches[0] : event
    dragStartX.value = touch.clientX
    dragStartY.value = touch.clientY
    dragOffset.value = 0
  }

  function handleDragMove(event) {
    if (!isDragging.value) return

    const touch = event.type.includes('touch') ? event.touches[0] : event
    const deltaX = touch.clientX - dragStartX.value
    const deltaY = touch.clientY - dragStartY.value

    // Determine drag direction on first significant movement
    if (isHorizontalDrag.value === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      isHorizontalDrag.value = Math.abs(deltaX) > Math.abs(deltaY)
    }

    // Only handle horizontal drags, let vertical scroll through
    if (isHorizontalDrag.value === false) {
      return
    }

    // Prevent page scrolling only for horizontal drags
    if (isHorizontalDrag.value) {
      event.preventDefault()
    }

    dragOffset.value = deltaX
  }

  function handleDragEnd() {
    if (!isDragging.value) return
    isDragging.value = false

    const threshold = 30
    if (isHorizontalDrag.value && dragOffset.value > threshold) {
      didSwipe.value = true
      next()
    } else if (isHorizontalDrag.value && dragOffset.value < -threshold) {
      didSwipe.value = true
      prev()
    } else {
      didSwipe.value = false
    }
    dragOffset.value = 0
    isHorizontalDrag.value = null
  }

  function handleClick() {
    // Only advance if we didn't just swipe
    if (!didSwipe.value) {
      next()
    }
    didSwipe.value = false
  }

  return {
    currentIndex,
    currentItem,
    visibleItems,
    totalItems,
    isDragging,
    dragOffset,
    next,
    prev,
    goTo,
    handleKeydown,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleClick
  }
}
