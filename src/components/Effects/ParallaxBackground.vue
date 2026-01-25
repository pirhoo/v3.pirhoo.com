<template>
  <div class="parallax-bg">
    <effects-parallax-background-orb
      v-for="orb in orbs"
      :key="orb.index"
      v-bind="orb"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EffectsParallaxBackgroundOrb from './ParallaxBackground/Orb.vue'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { useOrbColors } from '@/composables/useOrbColors'

const { sectionProgress, scrollFactor } = useScrollProgress(4)
const { currentColors } = useOrbColors(sectionProgress)

const baseOpacity = 0.2

const orbs = computed(() => [
  {
    index: 1,
    color: currentColors.value[0],
    x: -20 + scrollFactor.value * 40,
    y: -30 + scrollFactor.value * 60,
    opacity: baseOpacity
  },
  {
    index: 2,
    color: currentColors.value[1],
    x: 20 - scrollFactor.value * 50,
    y: 40 - scrollFactor.value * 30,
    opacity: baseOpacity
  },
  {
    index: 3,
    color: currentColors.value[2],
    x: -10 + scrollFactor.value * 30,
    y: 10 + scrollFactor.value * 20,
    opacity: baseOpacity * 0.7
  }
])
</script>

<style lang="scss">
.parallax-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;

  &__orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(150px);
    transition: background 1.2s ease;

    &--1 {
      width: 60vw;
      height: 60vw;
      top: -10%;
      right: -20%;

      @media (max-width: 768px) {
        width: 80vw;
        height: 80vw;
      }
    }

    &--2 {
      width: 50vw;
      height: 50vw;
      bottom: -10%;
      left: -15%;

      @media (max-width: 768px) {
        width: 70vw;
        height: 70vw;
      }
    }

    &--3 {
      width: 40vw;
      height: 40vw;
      top: 40%;
      left: 30%;

      @media (max-width: 768px) {
        width: 60vw;
        height: 60vw;
      }
    }
  }
}
</style>
