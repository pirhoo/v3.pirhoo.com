<template>
  <section ref="sectionRef" class="investigations section section-border">
    <layout-section-header
      label="Investigations"
      title="Investigating broken systems"
      subtitle="and abuses of power"
      :parallax-offset="parallaxOffset"
    >
      <p class="text-body investigations__intro pb-5">
        I believe technology and data can help journalists solve issues of
        global importance. Since {{ yearsOfExperience }} years I'm taking part in cross-border
        investigations.
      </p>
    </layout-section-header>
    <section-investigations-list :investigations="investigations" />
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import investigationsData from '@/assets/json/investigations.json'
import { useSection } from '@/composables/useSection'
import { useParallax } from '@/composables/useParallax'
import { useTheme } from '@/composables/useTheme'
import { getContrastColor } from '@/composables/useContrastColor'
import LayoutSectionHeader from '@/components/Layout/SectionHeader.vue'
import SectionInvestigationsList from './Investigations/List.vue'

const { theme } = useTheme()

const sectionRef = ref(null)
useSection(sectionRef, 'investigations')
const { offset: parallaxOffset } = useParallax(sectionRef, { speed: 0.15 })

const investigations = computed(() => {
  return [...investigationsData].reverse().map(inv => ({
    ...inv,
    adjustedBgColor: getContrastColor(inv.backgroundColor, theme.value)
  }))
})

const yearsOfExperience = computed(() => new Date().getFullYear() - 2010)
</script>

<style lang="scss">
@import '@/utils/_settings';

.investigations {
  padding: $space-25 0;

  @media (max-width: 768px) {
    padding: $space-15 0;
  }

  &__intro {
    max-width: 500px;
    margin-top: $space-6;
  }
}
</style>
