<template>
  <div ref="aboutRef" class="introduction-about section-border" :style="{ transform: `translateY(${parallaxOffset}px)` }">
    <layout-section-grid>
      <template #label>
        <span class="text-label text-label--section">About</span>
      </template>
      <template #content>
        <p class="introduction-about__paragraph text-body">
          I'm CTO at the <a href="http://icij.org">International Consortium
            of Investigative Journalists (ICIJ)</a> where I build
          interactive stories, data driven investigations and tools.
        </p>
        <p class="introduction-about__paragraph text-body">
          I used to be CTO at <a href="http://jplusplus.org">Journalism++</a>,
          an agency that I co-founded after having been lead developer
          at <a href="http://owni.pirhoo.com">OWNI</a>. Between 2012 and 2019, I was an Associate Professor
          at Sciences Po and many other journalism schools, where I
          taught programming and interactive storytelling.
        </p>
      </template>
    </layout-section-grid>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useParallax } from '@/composables/useParallax'
import { useContentReveal } from '@/composables/useContentReveal'
import LayoutSectionGrid from '@/components/Layout/SectionGrid.vue'

const aboutRef = ref(null)
const contentRef = computed(() => aboutRef.value?.querySelector('.section-grid__content'))
const { offset: parallaxOffset } = useParallax(aboutRef, { speed: 0.1 })
useContentReveal(contentRef)
</script>

<style lang="scss">
@import '@/utils/_settings';

.introduction-about {
  padding: $space-20 0;

  @media (max-width: 768px) {
    padding: $space-15 0;
  }

  &__paragraph {
    max-width: 600px;
    margin: 0 0 $space-5;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
