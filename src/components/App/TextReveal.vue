<template>
  <component
    :is="tag"
    ref="elementRef"
    class="text-reveal"
  >
    <span
      v-for="(char, index) in characters"
      :key="index"
      class="text-reveal__char"
      :class="{ 'text-reveal__char--space': char === ' ' }"
    >{{ char === ' ' ? '\u00A0' : char }}</span>
  </component>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    default: 'span'
  },
  delay: {
    type: Number,
    default: 0
  }
})

const elementRef = ref(null)
const group = inject('textRevealGroup', null)
const characters = computed(() => props.text.split(''))

let ctx = null

onMounted(() => {
  const trigger = group?.element?.value || elementRef.value
  if (!trigger) return

  const charEls = elementRef.value.querySelectorAll('.text-reveal__char')
  if (!charEls.length) return

  // Convert delay prop to scroll offset for cascading between TextReveal instances
  const delayOffset = props.delay * 0.02
  const startPct = Math.max(80 - delayOffset, 50)

  const onComplete = group?.registerAnimation?.()

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => { if (onComplete) onComplete() }
    })

    tl.fromTo(charEls,
      { filter: 'blur(8px)', opacity: 0 },
      {
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.4,
        stagger: 0.03,
        ease: 'power2.out'
      },
      0
    )

    const reveal = self => { tl.play(); self.kill() }

    ScrollTrigger.create({
      trigger,
      start: `top ${startPct}%`,
      end: 'bottom 20%',
      onEnter: reveal,
      onEnterBack: reveal
    })
  }, elementRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style lang="scss">
.text-reveal {
  display: inline;

  &__char {
    display: inline;
    will-change: filter, opacity;
  }
}
</style>
