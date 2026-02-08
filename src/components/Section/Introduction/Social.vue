<template>
  <div class="introduction-social section-border" :style="{ transform: `translateY(${parallaxOffset}px)` }">
    <layout-section-grid>
      <template #label>
        <app-text-reveal
          text="Contact"
          tag="span"
          class="text-label text-label--section"
          :delay="100"
        />
      </template>
      <template #content>
        <div class="introduction-social__links">
          <a
            v-for="link in socialLinks"
            :key="link.platform"
            :href="link.url"
            class="introduction-social__link"
            :rel="link.rel"
          >
            <component :is="link.icon" class="introduction-social__link__icon" />
            <span class="introduction-social__link__text">
              <span class="text-meta">{{ link.handle }}</span>
              <span class="text-tiny-display">{{ link.platform }}</span>
            </span>
          </a>
        </div>
      </template>
    </layout-section-grid>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { useParallax } from '@/composables/useParallax'
import LayoutSectionGrid from '@/components/Layout/SectionGrid.vue'
import AppTextReveal from '@/components/App/TextReveal.vue'
import IconBluesky from '~icons/fa6-brands/bluesky'
import IconMastodon from '~icons/ph/mastodon-logo-fill'
import IconGithub from '~icons/ph/github-logo-fill'
import IconKey from '~icons/ph/key-fill'
import IconEnvelope from '~icons/ph/envelope-fill'

const socialRef = ref(null)
const { offset: parallaxOffset } = useParallax(socialRef, { speed: 0.08 })

const socialLinks = [
  { platform: 'Bluesky', handle: '@pirhoo.com', url: 'https://bsky.app/profile/pirhoo.com', icon: markRaw(IconBluesky) },
  { platform: 'Mastodon', handle: '@pirhoo', url: 'https://mastodon.social/@pirhoo', icon: markRaw(IconMastodon), rel: 'me' },
  { platform: 'Github', handle: '@pirhoo', url: 'https://github.com/pirhoo', icon: markRaw(IconGithub) },
  { platform: 'Keybase', handle: '@pirhoo', url: 'https://keybase.io/pirhoo', icon: markRaw(IconKey) },
  { platform: 'Email', handle: 'hello@pirhoo.com', url: 'mailto:hello@pirhoo.com', icon: markRaw(IconEnvelope) }
]
</script>

<style lang="scss">
@import '@/utils/_settings';

.introduction-social {
  padding: $space-15 0;

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3 $space-5;
    background: var(--card-bg);
    border: 1px solid var(--bs-border-color);
    border-radius: $space-1;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--section-primary);
    }

    &__icon {
      font-size: 1.25rem;
      color: var(--section-primary);
      transition: color 0.2s ease;
    }

    &__text {
      display: flex;
      flex-direction: column;
      gap: $space-1 / 2;

      .text-meta {
        color: var(--bs-body-color);
      }
    }
  }
}
</style>
