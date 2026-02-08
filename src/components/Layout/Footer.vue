<template>
  <footer class="layout-footer section-border">
    <div class="layout-footer__content">
      <span class="text-meta">&copy; {{ currentYear }} Pierre Romera Zhang</span>
      <span class="layout-footer__divider">/</span>
      <a href="https://github.com/pirhoo/v3.pirhoo.com" class="text-meta">Source code</a>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss">
@import '@/utils/_settings';

.layout-footer {
  padding: 40px $grid-gutter * 2;

  @media (max-width: 768px) {
    padding: 30px $grid-gutter;
  }

  &__content {
    max-width: $content-max-width;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    a {
      color: var(--bs-secondary-color);
      text-decoration: none;

      &:hover {
        color: var(--section-primary);
      }
    }
  }

  &__divider {
    color: var(--border-dashed);
  }
}
</style>
