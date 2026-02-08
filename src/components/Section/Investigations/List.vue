<template>
  <div class="investigations-list">
    <button-arrow-left class="investigations-list__arrow investigations-list__arrow--left" :disabled="!canScrollLeft" @click="scrollLeft" />
    <div
      ref="listWrapperRef"
      class="investigations-list__wrapper"
      @mousedown="onDragStart"
      @scroll="updateScrollState"
    >
      <section-investigations-card
        v-for="(investigation, index) in investigations"
        :key="index"
        :investigation="investigation"
        :index="index"
        :total="investigations.length"
      />
    </div>
    <button-arrow-right class="investigations-list__arrow investigations-list__arrow--right" :disabled="!canScrollRight" @click="scrollRight" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useDragScroll } from '@/composables/useDragScroll'
import SectionInvestigationsCard from './Card.vue'
import ButtonArrowLeft from '@/components/Button/ButtonArrowLeft.vue'
import ButtonArrowRight from '@/components/Button/ButtonArrowRight.vue'

defineProps({
  investigations: {
    type: Array,
    required: true
  }
})

const listWrapperRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const { onMouseDown: onDragStart } = useDragScroll()

function updateScrollState() {
  if (!listWrapperRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = listWrapperRef.value
  canScrollLeft.value = scrollLeft > 1
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1
}

function getCardScrollDistance() {
  if (!listWrapperRef.value) return 360
  const card = listWrapperRef.value.querySelector('.investigation-card')
  if (!card) return 360
  const style = getComputedStyle(listWrapperRef.value)
  const gap = parseFloat(style.gap) || 20
  return card.offsetWidth + gap
}

function scrollLeft() {
  if (!listWrapperRef.value) return
  listWrapperRef.value.scrollBy({ left: -getCardScrollDistance(), behavior: 'smooth' })
}

function scrollRight() {
  if (!listWrapperRef.value) return
  listWrapperRef.value.scrollBy({ left: getCardScrollDistance(), behavior: 'smooth' })
}

function scrollToEnd() {
  if (listWrapperRef.value) {
    const { scrollWidth, clientWidth } = listWrapperRef.value
    listWrapperRef.value.scrollLeft = scrollWidth - clientWidth
  }
}

onMounted(() => {
  // Use multiple rAF calls to ensure layout is complete
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToEnd()
      nextTick(updateScrollState)
    })
  })
})
</script>

<style lang="scss">
@import '@/utils/_settings';

.investigations-list {
  position: relative;

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;

    &--left {
      left: $grid-gutter;
    }

    &--right {
      right: $grid-gutter;
    }
  }

  &__wrapper {
    display: flex;
    gap: $space-5;
    padding: $space-3 $grid-gutter * 2 $space-10;
    overflow: hidden;
    cursor: grab;
    scroll-snap-type: x mandatory;
    scroll-padding-left: $grid-gutter * 2;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: var(--border-color);
    }

    &::-webkit-scrollbar-thumb {
      background: var(--border-dashed);
      border-radius: 2px;
    }

    @media (max-width: 768px) {
      padding: $space-3 $grid-gutter $space-8;
      scroll-padding-left: $grid-gutter;
    }

  }
}
</style>
