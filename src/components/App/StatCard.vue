<template>
  <div ref="cardRef" class="stat-card">
    <div class="stat-card__icon">
      <component :is="icon" />
    </div>
    <div class="stat-card__content">
      <span class="stat-card__value">{{ displayValue }}</span>
      <span class="stat-card__label">{{ label }}</span>
      <span v-if="sub" class="stat-card__sub">{{ sub }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCountAnimation } from '@/composables/useCountAnimation'

const props = defineProps({
  icon: {
    type: Object,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  sub: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  }
})

const cardRef = ref(null)
const numericValue = computed(() => typeof props.value === 'number' ? props.value : parseInt(props.value, 10) || 0)

const { currentValue, startAnimation } = useCountAnimation(numericValue, {
  duration: 1500,
  delay: 100
})

function formatNumber(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const displayValue = computed(() => {
  const formatted = formatNumber(currentValue.value)
  return formatted + props.suffix
})

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAnimation()
          observer.disconnect()
        }
      })
    },
    { threshold: 0.3 }
  )

  if (cardRef.value) {
    observer.observe(cardRef.value)
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

.stat-card {
  display: flex;
  gap: $space-4;
  padding: $space-6;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: $space-2;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--body-color);
  }

  &__icon {
    font-size: 1.5rem;
    color: var(--section-primary, var(--text-muted));
    flex-shrink: 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__value {
    font-family: $font-family-mono;
    font-size: 2rem;
    font-weight: 500;
    line-height: 1;
    color: var(--body-color);
    font-variant-numeric: tabular-nums;
  }

  &__label {
    font-family: $font-family-display;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--body-color);
  }

  &__sub {
    font-size: 0.8125rem;
    color: var(--text-muted);
  }
}
</style>
