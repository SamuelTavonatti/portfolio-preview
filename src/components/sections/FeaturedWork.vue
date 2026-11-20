<script setup>
import { ref } from 'vue'
import { projects } from '../../data/projects'
import { useI18n } from '../../i18n/useI18n'
import BaseBadge from '../ui/BaseBadge.vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'
import CaseStudyDrawer from '../modals/CaseStudyDrawer.vue'

const { lang, t } = useI18n()
const featured = projects.filter((p) => p.featured)
const activeProject = ref(null)

const previewMetrics = (project) => {
  if (project.slug === 'voltrep') {
    return project.metrics.filter((m) => m.value !== 'Firestore').slice(0, 3)
  }
  return project.metrics.slice(0, 3)
}
</script>

<template>
  <section id="case-study" class="section-block">
    <div class="container scroll-reveal">
      <div class="section-head section-head--split">
        <div>
          <span class="section-kicker tabular-nums">{{ t('sections.workKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.workTitle') }}</h2>
        </div>
        <router-link to="/progetti" class="view-all-link">
          <span>{{ t('sections.viewAll') }}</span>
          <AppIcon name="arrow-right" :size="16" />
        </router-link>
      </div>

      <div class="work-bento">
        <article
          v-for="(project, idx) in featured"
          :key="project.slug"
          class="glass-card work-card"
          :class="idx === 0 ? 'work-card--lead' : 'work-card--secondary'"
        >
          <div class="card-media">
            <img
              :src="project.coverImage.src"
              :alt="project.coverImage.alt[lang]"
              width="640"
              height="360"
              loading="lazy"
              class="card-cover"
            />
          </div>

          <div class="card-body">
            <div class="card-top">
              <div class="card-badges">
                <BaseBadge variant="accent">{{ project.category }}</BaseBadge>
                <BaseBadge v-if="project.links.live" variant="live">
                  <span class="live-dot" aria-hidden="true" />
                  {{ t('projectsPage.liveBadge') }}
                </BaseBadge>
              </div>
              <span class="year tabular-nums">{{ project.year }}</span>
            </div>

            <h3 class="card-title">{{ project.content[lang].title }}</h3>
            <p class="card-outcome">{{ project.content[lang].outcomeHeadline }}</p>

            <div class="card-metrics">
              <div v-for="m in previewMetrics(project)" :key="m.value" class="card-metric">
                <span class="m-val tabular-nums">{{ m.value }}</span>
                <span class="m-lbl">{{ m.label[lang] }}</span>
              </div>
            </div>

            <div class="card-actions">
              <BaseButton variant="secondary" @click="activeProject = project">
                <span>{{ t('sections.readCaseStudy') }}</span>
                <AppIcon name="arrow-right" :size="16" />
              </BaseButton>
              <BaseButton
                v-if="project.links.live"
                :href="project.links.live"
                external
                variant="primary"
              >
                <span>{{ t('caseStudyPage.openLive') }}</span>
                <AppIcon name="arrow-up-right" :size="16" />
              </BaseButton>
            </div>
          </div>
        </article>
      </div>
    </div>

    <CaseStudyDrawer :project="activeProject" @close="activeProject = null" />
  </section>
</template>

<style scoped>
.section-head--split {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 48px;
  padding: 0 0.25rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.92rem;
  font-weight: 500;
  transition: color 0.2s ease, transform 0.2s var(--ease-spring);
}

.view-all-link:hover {
  color: var(--accent);
}

.view-all-link:active {
  transform: scale(0.96);
}

.work-bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 960px) {
  .work-bento {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .work-card--lead {
    grid-column: span 7;
  }

  .work-card--secondary {
    grid-column: span 5;
  }
}

.work-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.work-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-azure-border);
  background: var(--surface-2);
}

.card-media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg-base);
  border-bottom: 1px solid var(--border-subtle);
}

.card-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s var(--ease-effects);
}

.work-card:hover .card-cover {
  transform: scale(1.02);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.1rem;
}

.card-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--status-live);
}

.year {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.card-title {
  font-size: clamp(1.3rem, 2vw, 1.55rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
}

.card-outcome {
  font-size: 0.98rem;
  font-weight: 500;
  color: var(--accent);
  line-height: 1.45;
  margin-bottom: 1.35rem;
  flex: 1;
}

.card-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 0.95rem 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 1.35rem;
}

.card-metric {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.m-val {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--accent-lumina-bright);
}

.m-lbl {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  .work-card:hover,
  .work-card:hover .card-cover {
    transform: none;
  }
}
</style>
