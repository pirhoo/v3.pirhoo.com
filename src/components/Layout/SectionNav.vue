<template>
  <nav class="section-nav" aria-label="Section navigation">
    <layout-section-nav-patterns :sections="sections" />
    <div class="section-nav__band">
      <div class="section-nav__track">
        <layout-section-nav-item
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          :label="section.label"
          :color="section.color"
          :active="activeSection === section.id"
          @click="scrollToSection(section.id)"
        />
      </div>
      <layout-section-nav-theme-toggle :theme="theme" @toggle="cycleTheme" />
    </div>
  </nav>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'
import { useSectionNavigation } from '@/composables/useSectionNavigation'
import LayoutSectionNavPatterns from './SectionNav/Patterns.vue'
import LayoutSectionNavItem from './SectionNav/Item.vue'
import LayoutSectionNavThemeToggle from './SectionNav/ThemeToggle.vue'

const { theme, cycleTheme } = useTheme()
const { sections, activeSection, scrollToSection } = useSectionNavigation({
  useShortLabels: true
})
</script>

<style lang="scss">
@import '@/utils/_settings';

.section-nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: stretch;

  @media (max-width: 1100px) {
    display: none;
  }

  &__band {
    width: $nav-width;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--body-bg);
    border-right: 1px dashed var(--border-dashed);
    position: relative;
  }

  &__track {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-2;
    position: relative;
    z-index: 1;
  }
}
</style>
