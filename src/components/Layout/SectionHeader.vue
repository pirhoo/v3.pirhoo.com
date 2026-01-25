<template>
  <layout-section-grid :parallax-offset="parallaxOffset">
    <template #label>
      <app-text-reveal
        :text="label"
        tag="span"
        class="text-label text-label--section"
        :delay="100"
      />
    </template>
    <template #content>
      <h2 class="text-heading">
        <app-text-reveal
          :text="title"
          tag="span"
          :delay="200"
          :stagger="50"
        /><br />
        <app-text-reveal
          v-if="subtitle"
          :text="subtitle"
          tag="span"
          class="text-dimmed"
          :delay="400"
          :stagger="60"
        />
      </h2>
      <slot></slot>
    </template>
  </layout-section-grid>
</template>

<script setup>
import LayoutSectionGrid from './SectionGrid.vue'
import AppTextReveal from '@/components/App/TextReveal.vue'

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
