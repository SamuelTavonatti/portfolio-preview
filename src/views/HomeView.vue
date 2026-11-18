<script setup>
import { profileData } from '../data/profile'
import { experiences } from '../data/experience'
import { useI18n } from '../i18n/useI18n'
import { useScrollReveal } from '../composables/useScrollReveal'
import HeroEditorial from '../components/sections/HeroEditorial.vue'
import ShowreelStage from '../components/sections/ShowreelStage.vue'
import FeaturedWork from '../components/sections/FeaturedWork.vue'
import ContactBento from '../components/sections/ContactBento.vue'
import BaseBadge from '../components/ui/BaseBadge.vue'
import AppIcon from '../components/ui/AppIcon.vue'

const { lang, t } = useI18n()
const baseUrl = import.meta.env.BASE_URL
useScrollReveal()
</script>

<template>
  <div>
    <HeroEditorial />

    <ShowreelStage />

    <FeaturedWork />

    <!-- 02. CHI SONO -->
    <section id="chi-sono" class="section-block">
      <div class="container grid-layout scroll-reveal">
        <div class="col-left">
          <span class="section-kicker tabular-nums">{{ t('sections.aboutKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.aboutTitle') }}</h2>
        </div>

        <div class="col-right about-stack">
          <div class="about-header-row">
            <img
              :src="`${baseUrl}assets/avatar.webp`"
              alt="Samuel Tavonatti"
              width="56"
              height="56"
              loading="lazy"
              class="about-avatar"
            />
            <p class="about-lead">{{ profileData.about[lang].lead }}</p>
          </div>

          <p v-for="(p, idx) in profileData.about[lang].paragraphs" :key="idx" class="about-body">
            {{ p }}
          </p>
        </div>
      </div>
    </section>

    <!-- 03. METODO & COMPETENZE (3-STEP UX PROCESS) -->
    <section id="competenze" class="section-block">
      <div class="container grid-layout scroll-reveal">
        <div class="col-left">
          <span class="section-kicker tabular-nums">{{ t('sections.processKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.processTitle') }}</h2>
        </div>

        <div class="col-right skills-grid">
          <article v-for="(skill, idx) in profileData.skills" :key="skill.icon" class="skill-card">
            <div class="skill-top-row">
              <div class="skill-icon-box">
                <AppIcon :name="skill.icon" :size="20" />
              </div>
              <span class="step-num tabular-nums">0{{ idx + 1 }}</span>
            </div>
            <h3 class="skill-title">{{ skill[lang].title }}</h3>
            <p class="skill-desc">{{ skill[lang].desc }}</p>
            <span class="skill-context">{{ skill[lang].context }}</span>
          </article>
        </div>
      </div>
    </section>

    <!-- 04. PERCORSO & ESPERIENZE -->
    <section id="percorso" class="section-block">
      <div class="container grid-layout scroll-reveal">
        <div class="col-left">
          <span class="section-kicker tabular-nums">{{ t('sections.timelineKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.timelineTitle') }}</h2>
        </div>

        <div class="col-right timeline-stack">
          <article v-for="exp in experiences.slice(0, 1)" :key="exp.id" class="timeline-card is-featured">
            <div class="tl-head">
              <div>
                <h3 class="tl-role">{{ exp.role[lang] }}</h3>
                <p class="tl-org">{{ exp.company }} • {{ exp.location }}</p>
              </div>
              <BaseBadge variant="accent">{{ exp.period[lang] }}</BaseBadge>
            </div>
            <ul class="tl-list">
              <li v-for="(item, i) in exp.highlights[lang]" :key="i">{{ item }}</li>
            </ul>
          </article>

          <article v-for="edu in profileData.education" :key="edu.degree.it" class="timeline-card">
            <div class="tl-head">
              <div>
                <h3 class="tl-role">{{ edu.institution[lang] }}</h3>
                <p class="tl-org">{{ edu.degree[lang] }}</p>
              </div>
              <BaseBadge variant="neutral">{{ lang === 'it' ? edu.period : edu.periodEn }}</BaseBadge>
            </div>
            <p class="tl-detail">{{ edu.detail[lang] }}</p>
          </article>
        </div>
      </div>
    </section>

    <ContactBento />
  </div>
</template>

<style scoped>
.section-block {
  padding: 4.5rem 0;
  border-bottom: 1px solid var(--border-subtle);
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 860px) {
  .grid-layout {
    grid-template-columns: 260px 1fr;
    gap: 3.5rem;
  }
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
  font-size: clamp(1.45rem, 2.8vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

.about-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 68ch;
}

.about-header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.about-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
  border: 1px solid var(--accent-border);
  flex-shrink: 0;
}

.about-lead {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
}

.about-body {
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 720px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.skill-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color var(--transition-fast);
}

.skill-card:hover {
  border-color: var(--accent-border);
}

.skill-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skill-icon-box {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background: var(--accent-soft);
  color: var(--accent);
  display: grid;
  place-items: center;
}

.step-num {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-tertiary);
}

.skill-title {
  font-size: 1.02rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.35;
}

.skill-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

.skill-context {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-tertiary);
  padding-top: 0.65rem;
  border-top: 1px solid var(--border-subtle);
}

.timeline-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.timeline-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 1.5rem 1.75rem;
}

.timeline-card.is-featured {
  border-color: var(--accent-border);
}

.tl-head {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 0.9rem;
}

@media (min-width: 640px) {
  .tl-head {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.tl-role {
  font-size: 1.08rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tl-org {
  font-size: 0.9rem;
  color: var(--accent);
  margin-top: 0.2rem;
}

.tl-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--border-subtle);
}

.tl-list li {
  position: relative;
  padding-left: 1.2rem;
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

.tl-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.tl-detail {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.55;
}
</style>