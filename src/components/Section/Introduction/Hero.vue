<template>
  <div class="introduction-hero">
    <div class="introduction-hero__content">
      <app-text-reveal-group tag="h1" class="introduction-hero__name text-display">
        <app-text-reveal text="Pierre" tag="span" :delay="0" /><br />
        <app-text-reveal text="Romera" tag="span" :delay="150" /><br />
        <app-text-reveal text="Zhang" tag="span" :delay="300" />
      </app-text-reveal-group>
      <div class="introduction-hero__roles">
        <app-text-reveal
          v-for="(role, index) in roles"
          :key="role"
          :text="role"
          tag="span"
          class="introduction-hero__role"
          :delay="750 + index * 100"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppTextReveal from '@/components/App/TextReveal.vue'
import AppTextRevealGroup from '@/components/App/TextRevealGroup.vue'

const roles = ['CTO', 'Developer', 'Datajournalist']
</script>

<style lang="scss">
@import '@/utils/_settings';

.introduction-hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: $space-20 + $space-5 $grid-gutter * 2 $space-15;
  max-width: $content-max-width;
  margin: 0 auto;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    padding: $space-20 $grid-gutter $space-10;
  }

  &__content {
    max-width: 900px;
  }

  &__name {
    margin: 0 0 $space-8;
    color: var(--bs-body-color);
    text-transform: none;
  }

  &__roles {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-wrap: wrap;

    &::after {
      content: none;
    }
  }

  &__role {
    font-family: $font-family-mono;
    font-size: 0.875rem;
    color: var(--section-primary);
    text-transform: uppercase;
    letter-spacing: $letter-spacing-wide;

    &:not(:last-child)::after {
      content: '/';
      margin-left: $space-3;
      color: var(--border-dashed);
    }
  }
}
</style>
