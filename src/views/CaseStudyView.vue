<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { projects } from '../data/projects'
import { useI18n } from '../i18n/useI18n'
import BaseBadge from '../components/ui/BaseBadge.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import StateFeedback from '../components/ui/StateFeedback.vue'
import AppIcon from '../components/ui/AppIcon.vue'

const { lang, t } = useI18n()
const route = useRoute()

const project = computed(() => {
  return projects.find((p) => p.slug === route.params.slug) || null
})
</script>

<template>
  <div class="page-wrapper">
    <div v-if="!project" class="container not-found-wrap">
      <StateFeedback
        state="error"
        :title="t('caseStudyPage.notFoundTitle')"
        :description="t('caseStudyPage.notFoundDesc')"
        :action-label="t('caseStudyPage.notFoundAction')"
        action-to="/progetti"
      />
    </div>

    <article v-else class="case-study">
      <header class="cs-header">
        <div class="container cs-header-inner">
          <router-link to="/progetti" class="back-link">
            <AppIcon name="arrow-left" :size="16" />
            <span>{{ t('caseStudyPage.backToAll') }}</span>
          </router-link>

          <div class="cs-badges">
            <BaseBadge variant="accent">{{ project.category }}</BaseBadge>
            <BaseBadge variant="neutral">{{ project.year }}</BaseBadge>
          </div>

          <h1 class="cs-title">{{ project.content[lang].title }}</h1>
          <p class="cs-outcome">{{ project.content[lang].outcomeHeadline }}</p>

          <div v-if="project.links.live || project.links.repo || project.links.figma" class="cs-actions">
            <BaseButton v-if="project.links.live" :href="project.links.live" external variant="primary">
              <span>{{ t('caseStudyPage.openLive') }}</span>
              <AppIcon name="arrow-up-right" :size="16" />
            </BaseButton>
            <BaseButton v-if="project.links.figma" :href="project.links.figma" external variant="primary">
              <span>{{ lang === 'it' ? 'Apri Prototipo / Design Figma' : 'Open Figma Prototype / Design' }}</span>
              <AppIcon name="arrow-up-right" :size="16" />
            </BaseButton>
            <BaseButton v-if="project.links.repo" :href="project.links.repo" external variant="secondary">
              <AppIcon name="github" :size="16" />
              <span>{{ t('caseStudyPage.sourceCode') }}</span>
            </BaseButton>
          </div>

          <div class="cs-metrics-strip">
            <div v-for="m in project.metrics" :key="m.value" class="cs-metric">
              <span class="cs-metric-val tabular-nums">{{ m.value }}</span>
              <span class="cs-metric-lbl">{{ m.label[lang] }}</span>
            </div>
          </div>
        </div>
      </header>

      <div class="container cs-body">
        <section class="cs-section tldr-box">
          <span class="cs-kicker">TL;DR</span>
          <p class="cs-lead">{{ project.content[lang].tldr }}</p>
        </section>

        <section class="cs-section">
          <h2 class="cs-h2">{{ t('caseStudyPage.problem') }}</h2>
          <p class="cs-p">{{ project.content[lang].problem }}</p>
        </section>

        <section class="cs-section">
          <h2 class="cs-h2">{{ t('caseStudyPage.objectives') }}</h2>
          <ul class="cs-list">
            <li v-for="(obj, i) in project.content[lang].objectives" :key="i">{{ obj }}</li>
          </ul>
        </section>

        <section class="cs-section">
          <h2 class="cs-h2">{{ t('caseStudyPage.designChoices') }}</h2>
          <ul class="cs-list">
            <li v-for="(choice, i) in project.content[lang].designChoices" :key="i">{{ choice }}</li>
          </ul>
        </section>

        <section class="cs-section">
          <h2 class="cs-h2">{{ t('caseStudyPage.techSolution') }}</h2>
          <p class="cs-p">{{ project.content[lang].techArchitecture.details }}</p>
          <div class="cs-stack">
            <span v-for="tech in project.content[lang].techArchitecture.stack" :key="tech" class="tech-chip">
              {{ tech }}
            </span>
          </div>
        </section>

        <section class="cs-section">
          <h2 class="cs-h2">{{ t('caseStudyPage.results') }}</h2>
          <ul class="cs-list">
            <li v-for="(res, i) in project.content[lang].results" :key="i">{{ res }}</li>
          </ul>
        </section>

        <!-- Interactive Screen Gallery / Visual Preview -->
        <section v-if="project.gallery?.length" class="cs-section cs-gallery-section">
          <h2 class="cs-h2">{{ lang === 'it' ? 'Galleria Interfacce & Flussi Figma' : 'Interface Gallery & Figma Flows' }}</h2>
          <div class="cs-gallery-grid">
            <figure v-for="(item, idx) in project.gallery" :key="idx" class="cs-gallery-figure">
              <div class="cs-gallery-img-wrap">
                <img
                  :src="item.src"
                  :alt="item.caption[lang]"
                  width="960"
                  height="540"
                  loading="lazy"
                  class="cs-gallery-img"
                />
              </div>
              <figcaption class="cs-gallery-caption mono">
                {{ item.caption[lang] }}
              </figcaption>
            </figure>
          </div>
        </section>
      </div>
    </article>
  </div>
</template>

<style scoped>
.page-wrapper {
  padding-top: 6rem;
}

.not-found-wrap {
  padding: 4rem 1.25rem;
}

.cs-header {
  padding: 2rem 0 3.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.cs-header-inner {
  max-width: 860px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
  margin-bottom: 1.75rem;
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--accent);
}

.cs-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.15rem;
}

.cs-title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--text-primary);
}

.cs-outcome {
  margin-top: 0.85rem;
  font-size: clamp(1.1rem, 2.2vw, 1.35rem);
  color: var(--accent);
  font-weight: 500;
  line-height: 1.45;
}

.cs-actions {
  margin-top: 1.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.cs-metrics-strip {
  margin-top: 2.5rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--border-subtle);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.cs-metric {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.cs-metric-val {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.cs-metric-lbl {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.cs-body {
  max-width: 860px;
  padding-top: 3rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.tldr-box {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 1.5rem 1.75rem;
}

.cs-kicker {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.cs-lead {
  font-size: 1.05rem;
  color: var(--text-primary);
  line-height: 1.65;
}

.cs-h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.015em;
  margin-bottom: 0.85rem;
}

.cs-p {
  font-size: 0.98rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.cs-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cs-list li {
  position: relative;
  padding-left: 1.35rem;
  font-size: 0.96rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

.cs-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: 700;
}

.cs-stack {
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-chip {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-primary);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 0.35rem 0.7rem;
}

/* Gallery Section */
.cs-gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .cs-gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.cs-gallery-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  padding: 0.85rem;
  transition: border-color var(--transition-base), transform var(--transition-base);
}

.cs-gallery-figure:hover {
  border-color: var(--accent-lumina);
  transform: translateY(-2px);
}

.cs-gallery-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--surface-2);
}

.cs-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cs-gallery-caption {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--text-secondary);
  padding: 0.15rem 0.4rem 0.35rem;
}
</style>
