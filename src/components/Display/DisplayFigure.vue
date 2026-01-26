<template>
  <span
    ref="figureRef"
    class="display-figure"
    :class="[
      `display-figure--${size}`,
      { 'display-figure--mono': mono }
    ]"
  >
    <slot :value="displayValue">{{ displayValue }}</slot>
  </span>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, toRef } from 'vue'
import { useCountAnimation } from '@/composables/useCountAnimation'

const props = defineProps({
  value: {
    type: [Number, String],
    required: true
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  animate: {
    type: Boolean,
    default: false
  },
  animationDuration: {
    type: Number,
    default: 1500
  },
  animationDelay: {
    type: Number,
    default: 0
  },
  animationThreshold: {
    type: Number,
    default: 0.3
  },
  format: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  mono: {
    type: Boolean,
    default: true
  }
})

const figureRef = ref(null)
const numericValue = computed(() => {
  const val = typeof props.value === 'number' ? props.value : parseFloat(props.value)
  return isNaN(val) ? 0 : val
})

const { currentValue, startAnimation } = useCountAnimation(numericValue, {
  duration: props.animationDuration,
  delay: props.animationDelay
})

function formatNumber(value) {
  if (!props.format) return value.toString()
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const displayValue = computed(() => {
  const value = props.animate ? currentValue.value : numericValue.value
  const formatted = formatNumber(Math.round(value))
  return props.prefix + formatted + props.suffix
})

let observer = null

onMounted(() => {
  if (props.animate && figureRef.value) {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAnimation()
            observer.disconnect()
          }
        })
      },
      { threshold: props.animationThreshold }
    )
    observer.observe(figureRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss">
@import '@/utils/_settings';

.display-figure {
  display: inline-block;
  font-weight: 500;
  line-height: 1;
  color: var(--body-color);
  font-variant-numeric: tabular-nums;

  &--mono {
    font-family: $font-family-mono;
  }

  &--sm {
    font-size: 1rem;
  }

  &--md {
    font-size: 1.5rem;
  }

  &--lg {
    font-size: 2rem;
  }

  &--xl {
    font-size: 3rem;
  }
}
</style>
