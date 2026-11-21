<script setup>
import { ref, computed } from 'vue'
import { projects } from '../data/projects'
import { useI18n } from '../i18n/useI18n'
import BaseBadge from '../components/ui/BaseBadge.vue'
import StateFeedback from '../components/ui/StateFeedback.vue'
import AppIcon from '../components/ui/AppIcon.vue'

const { lang, t } = useI18n()
const selectedCategory = ref('all')

const categories = computed(() => {
  const unique = [...new Set(projects.map((p) => p.category))]
  return ['all', ...unique]
})

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') return projects
  return projects.filter((p) => p.category === selectedCategory.value)
})
</script>

<template>
  <div class="page-wrapper">
    <header class="page-header">
      <div class="container">
        <span class="kicker tabular-nums">{{ t('projectsPage.kicker') }}</span>
        <h1 class="page-title reveal">{{ t('projectsPage.title') }}</h1>
        <p class="page-subtitle reveal reveal-d1">{{ t('projectsPage.subtitle') }}</p>

        <div class="filter-bar reveal reveal-d2" role="tablist" aria-label="Project categories">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            role="tab"
            :aria-selected="selectedCategory === cat"
            class="filter-pill"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat === 'all' ? t('projectsPage.allFilter') : cat }}
          </button>
        </div>
      </div>
    </header>

    <section class="container projects-section">
      <StateFeedback
        v-if="filteredProjects.length === 0"
        state="empty"
        :title="t('projectsPage.emptyTitle')"
        :description="t('projectsPage.emptyDesc')"
        :action-label="t('projectsPage.emptyAction')"
        @action="selectedCategory = 'all'"
      />

      <div v-else class="projects-grid">
        <article v-for="project in filteredProjects" :key="project.slug" class="project-card">
          <router-link :to="`/progetti/${project.slug}`" class="card-link">
            <div class="card-media">
              <img
                :src="project.coverImage.src"
                :alt="project.coverImage.alt[lang]"
                width="640"
                height="360"
                class="cover-img"
                loading="lazy"
              />
              <div class="media-badge">
                <BaseBadge :variant="project.links.figma ? 'accent' : 'live'">
                  <span v-if="!project.links.figma" class="live-dot" aria-hidden="true" />
                  {{ project.links.figma ? 'Figma Design' : (project.status === 'active' ? t('projectsPage.liveBadge') : project.status) }}
                </BaseBadge>
              </div>
            </div>

            <div class="card-body">
              <div class="card-meta">
                <span class="cat-label">{{ project.category }}</span>
                <span class="year-label tabular-nums">{{ project.year }}</span>
              </div>

              <h2 class="card-title">{{ project.content[lang].title }}</h2>
              <p class="card-outcome">{{ project.content[lang].outcomeHeadline }}</p>
              <p class="card-tldr">{{ project.content[lang].tldr }}</p>

              <div class="stack-row">
                <span
                  v-for="tag in project.content[lang].techArchitecture.stack.slice(0, 4)"
                  :key="tag"
                  class="stack-tag"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="card-cta">
                <span>{{ t('projectsPage.openCaseStudy') }}</span>
                <AppIcon name="arrow-right" :size="16" class="cta-arrow" />
              </div>
            </div>
          </router-link>
        </article>
      </div>

      <div class="pipeline-note">
        <span class="pipeline-dot" aria-hidden="true" />
        <p>{{ t('projectsPage.pipelineNote') }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-wrapper {
  padding-top: 6.5rem;
}

.page-header {
  padding: 2.5rem 0 3rem;
  border-bottom: 1px solid var(--border-subtle);
}

.kicker {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.page-title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--text-primary);
}

.page-subtitle {
  margin-top: 1rem;
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: var(--text-secondary);
  max-width: 65ch;
  line-height: 1.65;
}

.filter-bar {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.filter-pill {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.48rem 0.95rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-pill:hover {
  border-color: var(--accent-border);
  color: var(--text-primary);
}

.filter-pill.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--on-accent);
  font-weight: 600;
}

.projects-section {
  padding: 3.5rem 1.25rem 2rem;
}

@media (min-width: 768px) {
  .projects-section {
    padding: 4rem 2rem 2rem;
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: stretch;
}

@media (min-width: 960px) {
  .projects-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  transition: transform var(--transition-base), border-color var(--transition-base);
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-border);
}

.card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.card-media {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s var(--ease-out-expo);
}

.project-card:hover .cover-img {
  transform: scale(1.03);
}

.media-badge {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
}

.card-body {
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.cat-label {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--accent);
  font-weight: 600;
}

.year-label {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-tertiary);
}

.card-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}

.card-outcome {
  font-size: 0.98rem;
  font-weight: 500;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

.card-tldr {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  flex: 1;
}

.stack-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.25rem;
}

.stack-tag {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-secondary);
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 0.25rem 0.55rem;
}

.card-cta {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.cta-arrow {
  color: var(--accent);
  transition: transform var(--transition-fast);
}

.project-card:hover .cta-arrow {
  transform: translateX(3px);
}

.pipeline-note {
  margin-top: 2.5rem;
  padding: 1.15rem 1.35rem;
  background: var(--surface-1);
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.pipeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}
</style>