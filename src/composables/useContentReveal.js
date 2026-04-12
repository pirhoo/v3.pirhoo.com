import { onMounted, onUnmounted, watch, unref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wraps all text nodes inside an element into individual word spans.
 * Preserves inline elements (links, etc.) and skips TextReveal components.
 */
function wrapWords(el) {
  if (el.classList.contains('text-reveal') || el.classList.contains('text-reveal-group')) {
    return []
  }

  const spans = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const textNodes = []

  while (walker.nextNode()) {
    // Skip text nodes inside elements that handle their own animation
    if (walker.currentNode.parentElement.closest('.text-reveal, .text-reveal-group')) {
      continue
    }
    textNodes.push(walker.currentNode)
  }

  for (const node of textNodes) {
    const parts = node.textContent.split(/(\s+)/)
    const fragment = document.createDocumentFragment()

    for (const part of parts) {
      if (!part) continue
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part))
      } else {
        const span = document.createElement('span')
        span.className = 'reveal-word'
        span.textContent = part
        fragment.appendChild(span)
        spans.push(span)
      }
    }

    node.parentNode.replaceChild(fragment, node)
  }

  return spans
}

/**
 * Groups word spans into visual lines by comparing their vertical position.
 */
function groupByLine(spans) {
  if (!spans.length) return []

  const lines = []
  let currentLine = [spans[0]]
  let lastTop = spans[0].getBoundingClientRect().top

  for (let i = 1; i < spans.length; i++) {
    const top = spans[i].getBoundingClientRect().top
    if (Math.abs(top - lastTop) < 3) {
      currentLine.push(spans[i])
    } else {
      lines.push(currentLine)
      currentLine = [spans[i]]
      lastTop = top
    }
  }

  if (currentLine.length) lines.push(currentLine)
  return lines
}

/**
 * Line-by-line content reveal animation driven by scroll.
 *
 * Splits text elements into word spans, detects visual lines,
 * and animates each line with a blur + fade-in effect when the
 * container enters the viewport. Non-text elements are revealed
 * as whole blocks. Recalculates lines on container resize.
 *
 * @param {import('vue').Ref<HTMLElement>} containerRef - Ref to the content container
 * @param {Object} [options]
 * @param {string} [options.start='top 75%'] - ScrollTrigger start position
 * @param {number} [options.lineStagger=0.08] - Delay between each line reveal
 * @param {import('vue').Ref<boolean>} [options.waitFor] - Wait for this ref to become true before playing
 */
export function useContentReveal(containerRef, options = {}) {
  const { start = 'top 75%', lineStagger = 0.08, waitFor = null } = options

  let ctx = null
  let resizeObserver = null
  let stopWatcher = null
  let hasRevealed = false
  // Processed children: { type: 'text' | 'block' | 'skip', words?: span[], element }
  let processed = []

  function cleanup() {
    if (ctx) ctx.revert()
    if (stopWatcher) { stopWatcher(); stopWatcher = null }
  }

  function buildAnimation() {
    const container = unref(containerRef)
    if (!container) return

    const groups = []

    for (const entry of processed) {
      if (entry.type === 'text') {
        const lines = groupByLine(entry.words)
        groups.push(...lines)
      } else if (entry.type === 'block') {
        groups.push([entry.element])
      }
    }

    if (!groups.length) return
    cleanup()

    ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })

      groups.forEach((group, i) => {
        tl.fromTo(group,
          { filter: 'blur(6px)', opacity: 0 },
          {
            filter: 'blur(0px)',
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
          },
          i * lineStagger
        )
      })

      if (waitFor) {
        // Queue after a preceding animation (e.g. title reveal)
        stopWatcher = watch(
          () => unref(waitFor),
          done => {
            if (done) {
              tl.play()
              hasRevealed = true
              if (stopWatcher) { stopWatcher(); stopWatcher = null }
            }
          },
          { immediate: true }
        )
      } else {
        // Trigger independently on scroll
        const reveal = self => { tl.play(); self.kill(); hasRevealed = true }

        ScrollTrigger.create({
          trigger: container,
          start,
          end: 'bottom 20%',
          onEnter: reveal,
          onEnterBack: reveal
        })
      }
    }, container)
  }

  function handleResize() {
    if (hasRevealed) return
    buildAnimation()
  }

  onMounted(() => {
    const container = unref(containerRef)
    if (!container) return

    const children = Array.from(container.children)
    processed = []

    for (const child of children) {
      if (child.classList.contains('text-reveal') || child.classList.contains('text-reveal-group')) {
        processed.push({ type: 'skip', element: child })
        continue
      }

      const words = wrapWords(child)
      if (words.length > 0) {
        processed.push({ type: 'text', element: child, words })
      } else {
        processed.push({ type: 'block', element: child })
      }
    }

    buildAnimation()

    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
  })

  onUnmounted(() => {
    cleanup()
    if (resizeObserver) resizeObserver.disconnect()
  })
}
