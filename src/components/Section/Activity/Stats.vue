<template>
  <div class="activity-stats">
    <layout-section-grid>
      <template #label>
        <span class="text-label text-label--section">Stats</span>
      </template>
      <template #content>
        <div class="activity-stats__items">
          <app-stat-card
            v-for="stat in stats"
            :key="stat.label"
            v-bind="stat"
          />
        </div>
      </template>
    </layout-section-grid>
  </div>
</template>

<script setup>
import { computed, markRaw } from 'vue'
import LayoutSectionGrid from '@/components/Layout/SectionGrid.vue'
import AppStatCard from '@/components/App/StatCard.vue'
import IconCode from '~icons/ph/code-fill'
import IconGraduationCap from '~icons/ph/graduation-cap-fill'
import IconTrophy from '~icons/ph/trophy-fill'

import { hoursCount, countriesCount } from '@/assets/json/trainings.json'
import { awardsCount, projectsCount } from '@/assets/json/awards.json'
import { commitsCount, repositoriesCount } from '@/assets/json/commits.json'

function formatNumber(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const stats = computed(() => [
  {
    icon: markRaw(IconCode),
    value: commitsCount,
    label: 'commits authored',
    sub: `over ${formatNumber(repositoriesCount)} projects`
  },
  {
    icon: markRaw(IconGraduationCap),
    value: hoursCount,
    suffix: '+',
    label: 'hours of training',
    sub: `in ${formatNumber(countriesCount)} countries`
  },
  {
    icon: markRaw(IconTrophy),
    value: awardsCount,
    label: 'prizes awarded',
    sub: `for ${formatNumber(projectsCount)} projects`
  }
])
</script>

<style lang="scss">
@import '@/utils/_settings';

.activity-stats {
  margin-bottom: $space-20;

  @media (max-width: 768px) {
    margin-bottom: $space-15;
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $space-6;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
