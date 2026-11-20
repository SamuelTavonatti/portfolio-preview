<script setup>
import { profileData } from '../data/profile'
import { experiences } from '../data/experience'
import { useI18n } from '../i18n/useI18n'
import { useScrollReveal } from '../composables/useScrollReveal'
import HeroShowreel from '../components/sections/HeroShowreel.vue'
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
    <HeroShowreel />

    <FeaturedWork />

    <!-- 02. CHI SONO -->
    <section id="chi-sono" class="section-block">
      <div class="container scroll-reveal">
        <div class="section-head">
          <span class="section-kicker tabular-nums">{{ t('sections.aboutKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.aboutTitle') }}</h2>
        </div>

        <div class="about-grid">
          <div class="glass-card about-main">
            <div class="about-header-row">
              <img
                :src="`${baseUrl}assets/avatar.webp`"
                alt="Samuel Tavonatti"
                width="60"
                height="60"
                loading="lazy"
                class="about-avatar"
              />
              <p class="about-lead">{{ profileData.about[lang].lead }}</p>
            </div>

            <div class="about-paragraphs">
              <p v-for="(p, idx) in profileData.about[lang].paragraphs" :key="idx" class="about-body">
                {{ p }}
              </p>
            </div>
          </div>

          <aside class="glass-card about-highlights" aria-label="Highlights">
            <div v-for="item in profileData.highlights" :key="item.value" class="highlight-row">
              <span class="highlight-val tabular-nums">{{ item.value }}</span>
              <span class="highlight-lbl">{{ item.label[lang] }}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- 02.B DOMINI & PASSIONI / DOMAIN KNOWLEDGE -->
    <section id="domini" class="section-block">
      <div class="container scroll-reveal">
        <div class="section-head">
          <span class="section-kicker tabular-nums">{{ profileData.domains.header[lang].kicker }}</span>
          <h2 class="section-heading">{{ profileData.domains.header[lang].title }}</h2>
          <p class="section-subtitle">{{ profileData.domains.header[lang].subtitle }}</p>
        </div>

        <div class="domain-single-wrap">
          <article class="glass-card domain-editorial-card">
            <div class="dec-main">
              <div class="dec-badge-row">
                <span class="domain-badge mono">{{ profileData.domains.item.badge[lang] }}</span>
                <span class="dec-kicker mono">{{ lang === 'it' ? 'FOCUS ERGONOMIA SUL CAMPO' : 'FIELD ERGONOMICS FOCUS' }}</span>
              </div>
              <h3 class="dec-title">{{ profileData.domains.item.title[lang] }}</h3>
              <div class="dec-paragraphs">
                <p
                  v-for="(p, pIdx) in profileData.domains.item.paragraphs[lang]"
                  :key="pIdx"
                  class="dec-body"
                >
                  {{ p }}
                </p>
              </div>
              <div class="dec-tags">
                <span v-for="tag in profileData.domains.item.tags" :key="tag" class="domain-tag mono">{{ tag }}</span>
              </div>
            </div>

            <aside class="dec-sidebar">
              <div class="dec-sidebar-inner">
                <div class="dec-proof-stack">
                  <div
                    v-for="(stat, sIdx) in profileData.domains.item.stats[lang]"
                    :key="sIdx"
                    class="dec-proof-row"
                  >
                    <span class="proof-val tabular-nums">{{ stat.val }}</span>
                    <span class="proof-lbl">{{ stat.lbl }}</span>
                  </div>
                </div>
              </div>
            </aside>
          </article>
        </div>
      </div>
    </section>

    <!-- 03. METODO & COMPETENZE (3-STEP UX PROCESS) -->
    <section id="competenze" class="section-block">
      <div class="container scroll-reveal">
        <div class="section-head">
          <span class="section-kicker tabular-nums">{{ t('sections.processKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.processTitle') }}</h2>
        </div>

        <div class="skills-grid">
          <article v-for="(skill, idx) in profileData.skills" :key="skill.icon" class="glass-card skill-card">
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
      <div class="container scroll-reveal">
        <div class="section-head">
          <span class="section-kicker tabular-nums">{{ t('sections.timelineKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.timelineTitle') }}</h2>
        </div>

        <div class="timeline-stack">
          <article v-for="exp in experiences.slice(0, 1)" :key="exp.id" class="glass-card timeline-card is-featured">
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

          <article v-for="edu in profileData.education" :key="edu.degree.it" class="glass-card timeline-card">
            <div class="tl-head">
              <div class="tl-edu-head">
                <img
                  v-if="edu.logo"
                  :src="edu.logo"
                  :alt="edu.institution[lang]"
                  width="40"
                  height="40"
                  loading="lazy"
                  class="tl-logo"
                />
                <div>
                  <h3 class="tl-role">{{ edu.institution[lang] }}</h3>
                  <p class="tl-org">{{ edu.degree[lang] }}</p>
                </div>
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
.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: stretch;
}

@media (min-width: 960px) {
  .about-grid {
    grid-template-columns: minmax(0, 1.8fr) minmax(0, 1.2fr);
    align-items: stretch;
  }
}

.about-main {
  padding: 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  box-sizing: border-box;
}

.about-header-row {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}

.about-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
  border: 1px solid var(--accent-border);
  flex-shrink: 0;
}

.about-lead {
  font-size: clamp(1.12rem, 2vw, 1.35rem);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.about-paragraphs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 68ch;
}

.about-body {
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.about-highlights {
  padding: 2rem 2.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  box-sizing: border-box;
}

.highlight-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.35rem;
  padding: 1.35rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex: 1;
}

.highlight-row:first-child {
  padding-top: 0.2rem;
}

.highlight-row:last-child {
  padding-bottom: 0.2rem;
  border-bottom: none;
}

.highlight-val {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-lumina-bright);
}

.highlight-lbl {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 820px) {
  .skills-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.skill-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: transform 0.25s var(--ease-spring), border-color 0.2s ease, background-color 0.2s ease;
}

.skill-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-border);
  background: var(--surface-2);
}

.skill-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skill-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  display: grid;
  place-items: center;
}

.step-num {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-tertiary);
}

.skill-title {
  font-size: 1.08rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--text-primary);
  line-height: 1.35;
}

.skill-desc {
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

.skill-context {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--text-tertiary);
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-subtle);
}

.timeline-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.timeline-card {
  padding: 1.75rem 2rem;
}

.timeline-card.is-featured {
  border-color: var(--accent-border);
}

.tl-head {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .tl-head {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
}

.tl-edu-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.tl-logo {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  object-fit: contain;
  background: rgba(255, 255, 255, 0.92);
  padding: 0.25rem;
  flex-shrink: 0;
}

.tl-role {
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tl-org {
  font-size: 0.92rem;
  color: var(--accent-lumina-bright);
  margin-top: 0.2rem;
}

.tl-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

.tl-list li {
  position: relative;
  padding-left: 1.25rem;
  font-size: 0.94rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.tl-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.tl-detail {
  font-size: 0.94rem;
  color: var(--text-secondary);
  line-height: 1.6;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border-subtle);
}

.section-subtitle {
  font-size: 0.98rem;
  color: var(--text-secondary);
  margin-top: 0.45rem;
  max-width: 62ch;
  line-height: 1.5;
}

.domain-single-wrap {
  width: 100%;
}

.domain-editorial-card {
  padding: clamp(1.4rem, 2.5vw, 2.25rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: stretch;
  width: 100%;
  border-radius: var(--radius-2xl);
  box-sizing: border-box;
  transition: border-color 0.2s ease, transform 0.25s var(--ease-spring);
}

.domain-editorial-card:hover {
  transform: translateY(-2px);
  border-color: rgba(56, 189, 248, 0.35);
}

@media (min-width: 860px) {
  .domain-editorial-card {
    grid-template-columns: 1.45fr 0.55fr;
  }
}

.dec-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
}

.dec-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.domain-badge {
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent-lumina-bright);
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.32);
  border-radius: 9999px;
  padding: 0.35rem 0.9rem;
}

.dec-kicker {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
}

.dec-title {
  font-size: clamp(1.4rem, 2.2vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  line-height: 1.25;
  margin: 0;
}

.dec-paragraphs {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 1;
}

.dec-body {
  font-size: 0.98rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin: 0;
}

.dec-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

.domain-tag {
  font-size: 0.7rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  padding: 0.28rem 0.65rem;
}

.dec-sidebar {
  display: flex;
  align-items: stretch;
}

.dec-sidebar-inner {
  width: 100%;
  height: 100%;
  padding: 1.5rem 1.6rem;
  border-radius: var(--radius-xl);
  background: rgba(4, 6, 12, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.dec-proof-stack {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 0.5rem;
}

.dec-proof-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex: 1;
}

.dec-proof-row:first-child {
  padding-top: 0.2rem;
}

.dec-proof-row:last-child {
  padding-bottom: 0.2rem;
  border-bottom: none;
}

.proof-val {
  font-family: var(--font-mono);
  font-size: clamp(1.4rem, 2vw, 1.7rem);
  font-weight: 700;
  color: var(--accent-lumina-bright);
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.proof-lbl {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

@media (prefers-reduced-motion: reduce) {
  .skill-card:hover,
  .domain-editorial-card:hover {
    transform: none;
  }
}
</style>