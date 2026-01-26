<template>
  <div class="investigations-list">
    <div
      ref="listWrapperRef"
      class="investigations-list__wrapper"
      @mousedown="onDragStart"
    >
      <section-investigations-card
        v-for="(investigation, index) in investigations"
        :key="index"
        :investigation="investigation"
        :index="index"
        :total="investigations.length"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDragScroll } from '@/composables/useDragScroll'
import SectionInvestigationsCard from './Card.vue'

defineProps({
  investigations: {
    type: Array,
    required: true
  }
})

const listWrapperRef = ref(null)
const { onMouseDown: onDragStart } = useDragScroll()

function scrollToEnd() {
  if (listWrapperRef.value) {
    const { scrollWidth, clientWidth } = listWrapperRef.value
    listWrapperRef.value.scrollLeft = scrollWidth - clientWidth
  }
}

onMounted(() => {
  // Use multiple rAF calls to ensure layout is complete
  requestAnimationFrame(() => {
    requestAnimationFrame(scrollToEnd)
  })
})
</script>

<style lang="scss">
@import '@/utils/_settings';

.investigations-list {
  position: relative;

  &__wrapper {
    display: flex;
    gap: $space-5;
    padding: $space-2 $grid-gutter * 2 $space-10;
    margin-top: -$space-2;
    overflow-x: auto;
    overflow-y: visible;
    cursor: grab;

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
      padding: 0 $grid-gutter $space-8;
    }
  }
}
</style>
