<script setup>
import { profileData } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import BaseBadge from '../ui/BaseBadge.vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

const { lang } = useI18n()
</script>

<template>
  <section class="hero">
    <div class="container hero-container">
      <div class="reveal">
        <BaseBadge variant="live">
          <span class="pulse-dot" aria-hidden="true" />
          {{ profileData.hero[lang].badge }}
        </BaseBadge>
      </div>

      <h1 class="hero-title reveal reveal-d1">
        {{ profileData.hero[lang].title }}
      </h1>

      <p class="hero-subtitle reveal reveal-d2">
        {{ profileData.hero[lang].subtitle }}
      </p>

      <div class="hero-actions reveal reveal-d3">
        <BaseButton to="/progetti" variant="primary">
          <span>{{ profileData.hero[lang].ctaPrimary }}</span>
          <AppIcon name="arrow-right" :size="17" />
        </BaseButton>
        <BaseButton :to="{ path: '/', hash: '#contatti' }" variant="secondary">
          <span>{{ profileData.hero[lang].ctaSecondary }}</span>
        </BaseButton>
      </div>

      <div class="hero-metrics reveal reveal-d4">
        <div v-for="item in profileData.highlights" :key="item.value" class="metric-item">
          <span class="metric-value tabular-nums">{{ item.value }}</span>
          <span class="metric-label">{{ item.label[lang] }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 8.5rem 0 4.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

@media (min-width: 768px) {
  .hero {
    padding: 10.5rem 0 6rem;
  }
}

.hero-container {
  max-width: 880px;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--status-live);
}

.hero-title {
  margin-top: 1.5rem;
  font-size: clamp(2.15rem, 5.2vw, 3.85rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.035em;
  color: var(--text-primary);
}

.hero-subtitle {
  margin-top: 1.35rem;
  font-size: clamp(1.02rem, 1.8vw, 1.2rem);
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 68ch;
}

.hero-actions {
  margin-top: 2.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.hero-metrics {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  max-width: 620px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.metric-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: -0.01em;
}

.metric-label {
  font-size: 0.82rem;
  color: var(--text-secondary);
}
</style>
