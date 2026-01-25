<template>
  <div class="mobile-nav">
    <button
      class="mobile-nav__trigger"
      type="button"
      aria-label="Open navigation menu"
      @click="openOffcanvas"
    >
      <icon-list class="mobile-nav__icon" />
    </button>

    <div
      ref="offcanvasRef"
      class="offcanvas offcanvas-start mobile-nav__offcanvas"
      tabindex="-1"
      aria-labelledby="mobileNavLabel"
    >
      <div class="offcanvas-header">
        <span id="mobileNavLabel" class="text-label">Navigation</span>
        <button
          type="button"
          class="mobile-nav__close ms-auto"
          aria-label="Close"
          @click="closeOffcanvas"
        >
          <icon-x />
        </button>
      </div>
      <div class="offcanvas-body">
        <nav class="mobile-nav__menu">
          <button
            v-for="section in sections"
            :key="section.id"
            class="mobile-nav__item"
            :class="{ 'mobile-nav__item--active': activeSection === section.id }"
            :style="{ '--nav-color': section.color }"
            @click="scrollToSection(section.id)"
          >
            <svg class="mobile-nav__item__indicator" viewBox="0 0 16 16">
              <defs>
                <pattern
                  :id="`mobile-hatch-${section.id}`"
                  patternUnits="userSpaceOnUse"
                  width="4"
                  height="4"
                  patternTransform="rotate(45)"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="4"
                    :stroke="section.color"
                    stroke-width="1.5"
                  />
                </pattern>
              </defs>
              <rect
                x="1"
                y="1"
                width="14"
                height="14"
                rx="3"
                :fill="activeSection === section.id ? `url(#mobile-hatch-${section.id})` : 'transparent'"
                :stroke="activeSection === section.id ? section.color : 'var(--border-dashed)'"
                stroke-width="1"
                :stroke-dasharray="activeSection === section.id ? 'none' : '2 2'"
              />
            </svg>
            <span class="mobile-nav__item__label">{{ section.label }}</span>
          </button>
        </nav>
        <div class="mobile-nav__footer">
          <button class="mobile-nav__theme" @click="cycleTheme">
            <icon-sun v-if="theme === 'light'" />
            <icon-moon v-else />
            <span>{{ theme === 'light' ? 'Light' : 'Dark' }} mode</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Offcanvas from 'bootstrap/js/dist/offcanvas'
import { useTheme } from '@/composables/useTheme'
import { useSectionNavigation } from '@/composables/useSectionNavigation'
import { Duration } from '@/enums'
import IconSun from '~icons/ph/sun-fill'
import IconMoon from '~icons/ph/moon-fill'
import IconList from '~icons/ph/list-bold'
import IconX from '~icons/ph/x-bold'

const { theme, cycleTheme } = useTheme()

const offcanvasRef = ref(null)
let offcanvasInstance = null

function openOffcanvas() {
  offcanvasInstance?.show()
}

function closeOffcanvas() {
  offcanvasInstance?.hide()
}

const { sections, activeSection, scrollToSection } = useSectionNavigation({
  scrollDelay: Duration.OFFCANVAS_CLOSE,
  onBeforeNavigate: closeOffcanvas
})

onMounted(() => {
  offcanvasInstance = new Offcanvas(offcanvasRef.value)
})

onUnmounted(() => {
  offcanvasInstance?.dispose()
})
</script>

<style lang="scss">
@import '@/utils/_settings';

.mobile-nav {
  display: none;

  @media (max-width: 1100px) {
    display: block;
  }

  &__trigger {
    position: fixed;
    right: $space-5;
    top: $space-5;
    z-index: 99;
    width: 48px;
    height: 48px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bs-body-bg);
    border: 1px dashed var(--border-dashed);
    border-radius: $space-2;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-style: solid;
      border-color: var(--bs-body-color);
      transform: scale(1.05);
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
    color: var(--bs-body-color);
  }

  &__offcanvas {
    background: var(--bs-body-bg);
    border-right: 1px dashed var(--border-dashed);
    max-width: 280px;

    .offcanvas-header {
      border-bottom: 1px dashed var(--border-dashed);
      padding: $space-5;
    }

    .offcanvas-body {
      padding: $space-5;
      display: flex;
      flex-direction: column;
    }
  }

  &__close {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px dashed var(--border-dashed);
    border-radius: $space-1;
    cursor: pointer;
    color: var(--bs-body-color);
    transition: all 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      border-style: solid;
      border-color: var(--bs-body-color);
    }
  }

  &__menu {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    flex: 1;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3 $space-4;
    background: transparent;
    border: 1px dashed var(--border-dashed);
    border-radius: $space-2;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;

    &:hover {
      border-style: solid;
      border-color: var(--nav-color);
    }

    &--active {
      border-style: solid;
      border-color: var(--nav-color);
    }

    &__indicator {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    &__label {
      font-family: $font-family-mono;
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: $letter-spacing-label;
      color: var(--bs-body-color);
    }
  }

  &__footer {
    margin-top: auto;
    padding-top: $space-5;
    border-top: 1px dashed var(--border-dashed);
  }

  &__theme {
    display: flex;
    align-items: center;
    gap: $space-3;
    width: 100%;
    padding: $space-3 $space-4;
    background: transparent;
    border: 1px dashed var(--border-dashed);
    border-radius: $space-2;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--bs-body-color);
    font-family: $font-family-mono;
    font-size: 0.8125rem;

    svg {
      font-size: 1rem;
    }

    &:hover {
      border-style: solid;
      border-color: var(--bs-body-color);
    }
  }
}
</style>
