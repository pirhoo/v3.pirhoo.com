<template>
  <layout-section-grid ref="gridRef" :parallax-offset="parallaxOffset">
    <template #label>
      <span class="text-label text-label--section">{{ label }}</span>
    </template>
    <template #content>
      <app-text-reveal-group ref="titleGroupRef" tag="h2" class="text-heading">
        <app-text-reveal
          :text="title"
          tag="span"
          :delay="0"
          :stagger="50"
        /><br />
        <app-text-reveal
          v-if="subtitle"
          :text="subtitle"
          tag="span"
          class="text-dimmed"
          :delay="200"
          :stagger="60"
        />
      </app-text-reveal-group>
      <slot></slot>
    </template>
  </layout-section-grid>
</template>

<script setup>
import { ref, computed } from 'vue'
import LayoutSectionGrid from './SectionGrid.vue'
import AppTextReveal from '@/components/App/TextReveal.vue'
import AppTextRevealGroup from '@/components/App/TextRevealGroup.vue'
import { useContentReveal } from '@/composables/useContentReveal'

const gridRef = ref(null)
const titleGroupRef = ref(null)
const contentRef = computed(() => gridRef.value?.$el?.querySelector('.section-grid__content'))
const titleRevealed = computed(() => titleGroupRef.value?.revealed ?? false)
useContentReveal(contentRef, { waitFor: titleRevealed })

defineProps({
  label: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  parallaxOffset: {
    type: Number,
    default: 0
  }
})
</script>
