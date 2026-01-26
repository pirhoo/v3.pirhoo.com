<template>
  <a
    :href="project.github"
    class="oss-card"
    target="_blank"
    rel="noopener"
  >
    <div class="oss-card__header">
      <icon-book-bookmark class="oss-card__icon" />
      <span class="oss-card__name">{{ project.name }}</span>
    </div>
    <p class="oss-card__description">{{ project.description }}</p>
    <div class="oss-card__meta">
      <span v-if="stats.language" class="oss-card__language">
        <span class="oss-card__language-dot" :style="{ background: stats.languageColor }"></span>
        {{ stats.language }}
      </span>
      <span v-if="stats.stars !== null" class="oss-card__stat">
        <icon-star />
        {{ formatNumber(stats.stars) }}
      </span>
      <span v-if="stats.forks !== null" class="oss-card__stat">
        <icon-fork />
        {{ formatNumber(stats.forks) }}
      </span>
    </div>
  </a>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import IconBookBookmark from '~icons/ph/book-bookmark'
import IconStar from '~icons/ph/star-bold'
import IconFork from '~icons/ph/git-fork-bold'

const props = defineProps({
  project: { type: Object, required: true }
})

const stats = ref({
  stars: null,
  forks: null,
  language: null,
  languageColor: null
})

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return num
}

async function fetchStats() {
  if (!props.project.owner || !props.project.repo) return

  try {
    const response = await fetch(
      `https://api.github.com/repos/${props.project.owner}/${props.project.repo}`
    )
    if (response.ok) {
      const data = await response.json()
      stats.value = {
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        languageColor: getLanguageColor(data.language)
      }
    }
  } catch {
    // Silently fail - stats will remain null
  }
}

function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Ruby: '#701516',
    Java: '#b07219',
    Vue: '#41b883',
    Go: '#00ADD8',
    Rust: '#dea584',
    Shell: '#89e051'
  }
  return colors[language] || '#8b949e'
}

onMounted(() => {
  fetchStats()
})
</script>

<style lang="scss">
@import '@/utils/_settings';

.oss-card {
  display: flex;
  flex-direction: column;
  padding: $space-4;
  background: var(--card-bg);
  border: 1px dashed var(--border-dashed);
  border-radius: $space-2;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, border-style 0.2s ease;
  min-width: 280px;
  flex: 1;

  &:hover {
    border-style: solid;
    border-color: var(--section-primary);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-2;
  }

  &__icon {
    color: var(--text-muted);
    font-size: 1rem;
    flex-shrink: 0;
  }

  &__name {
    font-family: $font-family-mono;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--section-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__description {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--text-muted);
    margin: 0 0 $space-3;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: $space-4;
    font-family: $font-family-mono;
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  &__language {
    display: flex;
    align-items: center;
    gap: $space-1;
  }

  &__language-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 4px;

    svg {
      font-size: 0.875rem;
    }
  }
}
</style>
