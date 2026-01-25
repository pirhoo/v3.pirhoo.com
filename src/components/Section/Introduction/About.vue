<template>
  <div class="introduction-about section-border" :style="{ transform: `translateY(${parallaxOffset}px)` }">
    <layout-section-grid>
      <template #label>
        <app-text-reveal
          text="About"
          tag="span"
          class="text-label text-label--section"
          :delay="100"
        />
      </template>
      <template #content>
        <div class="introduction-about__content">
          <p
            class="text-body"
          >
            I'm CTO at the <a href="http://icij.org">International Consortium
              of Investigative Journalists (ICIJ)</a> where I build
            interactive stories, data driven investigations and tools.
          </p>
          <p class="text-body">
            I used to be CTO at <a href="http://jplusplus.org">Journalism++</a>,
            an agency that I co-founded after having been lead developer
            at <a href="http://owni.fr">OWNI</a>. Between 2012 and 2019, I was an Associate Professor
            at Sciences Po and many other journalism schools, where I
            taught programming and interactive storytelling.
          </p>
        </div>
      </template>
    </layout-section-grid>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useParallax } from '@/composables/useParallax'
import LayoutSectionGrid from '@/components/Layout/SectionGrid.vue'
import AppTextReveal from '@/components/App/TextReveal.vue'

const aboutRef = ref(null)
const { offset: parallaxOffset } = useParallax(aboutRef, { speed: 0.1 })
</script>

<style lang="scss">
@import '@/utils/_settings';

.introduction-about {
  padding: $space-20 0;

  @media (max-width: 768px) {
    padding: $space-15 0;
  }

  &__content {
    max-width: 600px;

    p {
      margin: 0 0 $space-5;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
