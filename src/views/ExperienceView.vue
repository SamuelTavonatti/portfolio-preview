<script setup>
import { experiences } from '../data/experience'
import { profileData } from '../data/profile'
import { useI18n } from '../i18n/useI18n'
import BaseBadge from '../components/ui/BaseBadge.vue'

const { lang, t } = useI18n()
</script>

<template>
  <div class="page-wrapper">
    <header class="page-header">
      <div class="container">
        <span class="kicker tabular-nums">{{ t('experiencePage.kicker') }}</span>
        <h1 class="page-title reveal">{{ t('experiencePage.title') }}</h1>
        <p class="page-subtitle reveal reveal-d1">{{ t('experiencePage.subtitle') }}</p>
      </div>
    </header>

    <div class="container content-stack">
      <section class="grid-layout">
        <div class="col-left">
          <span class="sec-num tabular-nums">01 /</span>
          <h2 class="sec-title">{{ t('experiencePage.expTitle') }}</h2>
        </div>

        <div class="col-right cards-stack">
          <article
            v-for="exp in experiences"
            :key="exp.id"
            class="exp-card"
            :class="{ 'is-featured': exp.featured }"
          >
            <div class="exp-top">
              <div>
                <h3 class="exp-role">{{ exp.role[lang] }}</h3>
                <p class="exp-company">{{ exp.company }} • {{ exp.location }}</p>
              </div>
              <BaseBadge :variant="exp.featured ? 'accent' : 'neutral'">
                {{ exp.period[lang] }}
              </BaseBadge>
            </div>

            <ul class="exp-list">
              <li v-for="(item, i) in exp.highlights[lang]" :key="i">{{ item }}</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="grid-layout last-section">
        <div class="col-left">
          <span class="sec-num tabular-nums">02 /</span>
          <h2 class="sec-title">{{ t('experiencePage.eduTitle') }}</h2>
        </div>

        <div class="col-right cards-stack">
          <article v-for="edu in profileData.education" :key="edu.degree.it" class="exp-card">
            <div class="edu-row">
              <div class="edu-logo-wrap">
                <img :src="edu.logo" :alt="edu.institution[lang]" width="48" height="48" loading="lazy" />
              </div>
              <div class="edu-content">
                <div class="exp-top">
                  <div>
                    <h3 class="exp-role">{{ edu.institution[lang] }}</h3>
                    <p class="exp-company">{{ edu.degree[lang] }}</p>
                  </div>
                  <BaseBadge variant="neutral">
                    {{ lang === 'it' ? edu.period : edu.periodEn }}
                  </BaseBadge>
                </div>
                <p class="edu-detail">{{ edu.detail[lang] }}</p>
              </div>
            </div>
          </article>

          <article class="exp-card">
            <h3 class="cert-heading">{{ t('experiencePage.certTitle') }}</h3>
            <ul class="cert-list">
              <li v-for="cert in profileData.certifications" :key="cert.title">
                <strong>{{ cert.title }}</strong> — {{ cert.issuer }}
              </li>
            </ul>
          </article>
        </div>
      </section>
    </div>
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
}

.page-subtitle {
  margin-top: 1rem;
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: var(--text-secondary);
  max-width: 65ch;
  line-height: 1.65;
}

.content-stack {
  padding-top: 1rem;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 3.5rem 0;
  border-bottom: 1px solid var(--border-subtle);
}

.last-section {
  border-bottom: none;
}

@media (min-width: 860px) {
  .grid-layout {
    grid-template-columns: 260px 1fr;
    gap: 3.5rem;
  }
}

.sec-num {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.sec-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.cards-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.exp-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 1.5rem 1.75rem;
}

.exp-card.is-featured {
  border-color: var(--accent-border);
}

.exp-top {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .exp-top {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.exp-role {
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--text-primary);
}

.exp-company {
  font-size: 0.9rem;
  color: var(--accent);
  margin-top: 0.2rem;
}

.exp-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

.exp-list li {
  position: relative;
  padding-left: 1.25rem;
  font-size: 0.94rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.exp-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.edu-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 560px) {
  .edu-row {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.25rem;
  }
}

.edu-logo-wrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: #f8fafc;
  padding: 6px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.edu-logo-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.edu-content {
  flex: 1;
}

.edu-detail {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

.cert-heading {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.cert-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.92rem;
  color: var(--text-secondary);
}

.cert-list strong {
  color: var(--text-primary);
}
</style>