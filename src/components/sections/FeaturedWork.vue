<script setup>
import { ref } from 'vue'
import { projects } from '../../data/projects'
import { useI18n } from '../../i18n/useI18n'
import BaseBadge from '../ui/BaseBadge.vue'
import AppIcon from '../ui/AppIcon.vue'
import CaseStudyDrawer from '../modals/CaseStudyDrawer.vue'

const { lang, t } = useI18n()
const featured = projects.filter((p) => p.featured)
const activeProject = ref(null)
</script>

<template>
  <section class="section-block">
    <div class="container scroll-reveal">
      <div class="section-header">
        <div>
          <span class="section-kicker tabular-nums">{{ t('sections.workKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.workTitle') }}</h2>
        </div>
        <router-link to="/progetti" class="view-all-link">
          <span>{{ t('sections.viewAll') }}</span>
          <AppIcon name="arrow-right" :size="16" />
        </router-link>
      </div>

      <div class="work-grid">
        <article v-for="project in featured" :key="project.slug" class="work-card">
          <button
            type="button"
            class="work-card-btn"
            @click="activeProject = project"
          >
            <div class="card-top">
              <BaseBadge variant="accent">{{ project.category }}</BaseBadge>
              <span class="year tabular-nums">{{ project.year }}</span>
            </div>

            <h3 class="card-title">{{ project.content[lang].title }}</h3>
            <p class="card-outcome">{{ project.content[lang].outcomeHeadline }}</p>
            <p class="card-tldr">{{ project.content[lang].tldr }}</p>

            <div class="card-metrics">
              <div v-for="m in project.metrics" :key="m.value" class="card-metric">
                <span class="m-val tabular-nums">{{ m.value }}</span>
                <span class="m-lbl">{{ m.label[lang] }}</span>
              </div>
            </div>

            <div class="card-footer">
              <span class="read-more">{{ t('sections.readCaseStudy') }}</span>
              <AppIcon name="arrow-up-right" :size="18" class="card-arrow" />
            </div>
          </button>
        </article>
      </div>
    </div>

    <CaseStudyDrawer :project="activeProject" @close="activeProject = null" />
  </section>
</template>

<style scoped>
.section-block {
  padding: 4.5rem 0;
  border-bottom: 1px solid var(--border-subtle);
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.25rem;
}

.section-kicker {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.section-heading {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.view-all-link:hover {
  color: var(--accent);
}

.work-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 820px) {
  .work-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.work-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  transition: transform var(--transition-base), border-color var(--transition-base), background-color var(--transition-base);
}

.work-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent-border);
  background: var(--surface-2);
}

.work-card-btn {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
  background: none;
  border: none;
  text-align: left;
  font-family: inherit;
  color: inherit;
  cursor: pointer;
}

.card-top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.year {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-tertiary);
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 0.45rem;
}

.card-outcome {
  font-size: 1rem;
  font-weight: 500;
  color: var(--accent);
  margin-bottom: 0.85rem;
  line-height: 1.45;
}

.card-tldr {
  font-size: 0.925rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
}

.card-metrics {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 1.25rem;
}

.card-metric {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.m-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.m-lbl {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.card-footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-arrow {
  color: var(--accent);
  transition: transform var(--transition-fast);
}

.work-card:hover .card-arrow {
  transform: translate(2px, -2px);
}
</style>
