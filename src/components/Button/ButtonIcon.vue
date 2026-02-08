<template>
  <component
    :is="tag"
    class="button-icon"
    :class="[
      `button-icon--${variant}`,
      `button-icon--${size}`,
      { 'button-icon--icon-left': iconPosition === 'left' }
    ]"
    v-bind="$attrs"
  >
    <span v-if="iconPosition === 'left'" class="button-icon__icon">
      <slot name="icon">
        <component :is="icon" v-if="icon" />
      </slot>
    </span>
    <span class="button-icon__label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="iconPosition === 'right'" class="button-icon__icon">
      <slot name="icon">
        <component :is="icon" v-if="icon" />
      </slot>
    </span>
  </component>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  iconPosition: {
    type: String,
    default: 'right',
    validator: value => ['left', 'right'].includes(value)
  },
  variant: {
    type: String,
    default: 'outline',
    validator: value => ['outline', 'solid', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value)
  },
  tag: {
    type: String,
    default: 'button'
  }
})
</script>

<style lang="scss">
@import '@/utils/_settings';

.button-icon {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-family: $font-family-mono;
  text-decoration: none;
  border-radius: $space-1;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &--icon-left {
    flex-direction: row;
  }

  // Sizes
  &--sm {
    padding: $space-1 $space-2;
    font-size: 0.6875rem;

    .button-icon__icon {
      font-size: 0.75rem;
    }
  }

  &--md {
    padding: $space-2 $space-3;
    font-size: 0.75rem;

    .button-icon__icon {
      font-size: 0.875rem;
    }
  }

  &--lg {
    padding: $space-3 $space-4;
    font-size: 0.875rem;

    .button-icon__icon {
      font-size: 1rem;
    }
  }

  // Variants
  &--outline {
    background: transparent;
    color: var(--button-color, var(--bs-body-color));
    border: 1px solid var(--button-color, var(--bs-border-color));

    &:hover {
      background: var(--button-color, var(--bs-body-color));
      color: var(--bs-body-bg);
    }
  }

  &--solid {
    background: var(--button-color, var(--bs-body-color));
    color: var(--bs-body-bg);
    border: 1px solid var(--button-color, var(--bs-body-color));

    &:hover {
      opacity: 0.9;
    }
  }

  &--ghost {
    background: transparent;
    color: var(--button-color, var(--bs-body-color));
    border: 1px solid transparent;

    &:hover {
      background: var(--bs-border-color);
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    transition: color 0.2s ease;
  }

  &__label {
    display: flex;
    align-items: center;
  }
}
</style>
