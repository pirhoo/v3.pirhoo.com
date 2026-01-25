<template>
  <section ref="sectionRef" class="introduction section">
    <section-introduction-hero />
    <section-introduction-about />
    <section-introduction-social />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useSection } from '@/composables/useSection'
import SectionIntroductionHero from './Introduction/Hero.vue'
import SectionIntroductionAbout from './Introduction/About.vue'
import SectionIntroductionSocial from './Introduction/Social.vue'

const sectionRef = ref(null)
useSection(sectionRef, 'introduction')
</script>

<style lang="scss">
.introduction {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
