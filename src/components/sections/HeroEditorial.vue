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
    <div class="hero-ambient" aria-hidden="true" />

    <div class="container hero-wrapper">
      <div class="hero-grid">
        <!-- Columns 1–8: Left-Aligned Editorial Typography -->
        <div class="hero-main">
          <div class="reveal">
            <BaseBadge variant="live">
              <span class="pulse-dot" aria-hidden="true" />
              {{ profileData.hero[lang].badge }}
            </BaseBadge>
          </div>

          <h1 class="hero-title">
            <span
              v-for="(line, index) in profileData.hero[lang].titleLines"
              :key="`${lang}-${index}`"
              class="mask-line"
            >
              <span
                class="mask-line-inner"
                :style="{ animationDelay: `${index * 85}ms` }"
              >
                {{ line }}
              </span>
            </span>
          </h1>

          <p class="hero-subtitle reveal reveal-d2">
            {{ profileData.hero[lang].subtitle }}
          </p>

          <div class="hero-actions reveal reveal-d3">
            <BaseButton to="/progetti" variant="primary" class="cta-primary">
              <span>{{ profileData.hero[lang].ctaPrimary }}</span>
              <AppIcon name="arrow-right" :size="17" class="cta-arrow" />
            </BaseButton>
            <BaseButton :to="{ path: '/', hash: '#contatti' }" variant="secondary">
              <span>{{ profileData.hero[lang].ctaSecondary }}</span>
            </BaseButton>
          </div>
        </div>

        <!-- Columns 9–12: Subtle Architectural Geometric Anchor -->
        <aside class="hero-anchor reveal reveal-d3" aria-hidden="true">
          <div class="anchor-card">
            <svg viewBox="0 0 260 220" fill="none" class="anchor-svg">
              <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
                <line x1="0" y1="55" x2="260" y2="55" />
                <line x1="0" y1="110" x2="260" y2="110" />
                <line x1="0" y1="165" x2="260" y2="165" />
                <line x1="65" y1="0" x2="65" y2="220" />
                <line x1="130" y1="0" x2="130" y2="220" />
                <line x1="195" y1="0" x2="195" y2="220" />
              </g>
              <circle cx="130" cy="110" r="54" stroke="rgba(194,165,126,0.28)" stroke-width="1" stroke-dasharray="4 4" class="orbit-ring" />
              <circle cx="130" cy="110" r="24" stroke="rgba(194,165,126,0.45)" stroke-width="1.2" />
              <circle cx="130" cy="110" r="3.5" fill="#C2A57E" />
              <line x1="130" y1="40" x2="130" y2="180" stroke="rgba(194,165,126,0.18)" stroke-width="1" />
              <line x1="60" y1="110" x2="200" y2="110" stroke="rgba(194,165,126,0.18)" stroke-width="1" />
            </svg>
            <div class="anchor-meta tabular-nums">
              <span>46.07° N · 11.12° E</span>
              <span>HCI / UI SYSTEM</span>
            </div>
          </div>
        </aside>
      </div>

      <!-- Full-Width Left-Aligned Divider & Metrics Strip -->
      <div class="hero-divider draw-line" aria-hidden="true" />

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
  position: relative;
  padding: 8.5rem 0 4.5rem;
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
}

@media (min-width: 768px) {
  .hero {
    padding: 10.25rem 0 5.5rem;
  }
}

.hero-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(640px 420px at 14% 18%, rgba(194, 165, 126, 0.06), transparent 70%),
    linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: auto, 88px 88px, 88px 88px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent 92%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent 92%);
}

.hero-wrapper {
  position: relative;
  z-index: 1;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: end;
}

@media (min-width: 960px) {
  .hero-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 2rem;
  }
}

.hero-main {
  text-align: left;
}

@media (min-width: 960px) {
  .hero-main {
    grid-column: 1 / 9;
  }
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--status-live);
}

.hero-title {
  margin-top: 1.5rem;
  font-size: clamp(2.1rem, 4.6vw, 3.85rem);
  font-weight: 700;
  line-height: 1.07;
  letter-spacing: -0.035em;
  color: var(--text-primary);
}

.hero-subtitle {
  margin-top: 1.35rem;
  font-size: clamp(1rem, 1.55vw, 1.16rem);
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 62ch;
}

.hero-actions {
  margin-top: 2.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.cta-arrow {
  transition: transform var(--transition-fast);
}

.cta-primary:hover .cta-arrow {
  transform: translateX(3px);
}

/* Columns 9–12: Architectural Anchor */
.hero-anchor {
  display: none;
}

@media (min-width: 960px) {
  .hero-anchor {
    display: block;
    grid-column: 9 / 13;
  }
}

.anchor-card {
  background: rgba(19, 21, 26, 0.72);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 1rem;
  backdrop-filter: blur(8px);
}

.anchor-svg {
  width: 100%;
  height: auto;
  display: block;
}

@keyframes slowSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbit-ring {
  transform-origin: 130px 110px;
  animation: slowSpin 42s linear infinite;
}

.anchor-meta {
  margin-top: 0.75rem;
  padding-top: 0.65rem;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
}

/* Full-width left-aligned divider & metrics */
.hero-divider {
  margin-top: 3.5rem;
  height: 1px;
  width: 100%;
  background: var(--border-subtle);
}

.hero-metrics {
  margin-top: 1.85rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
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
  font-size: 0.84rem;
  color: var(--text-secondary);
}

@media (prefers-reduced-motion: reduce) {
  .orbit-ring {
    animation: none;
  }
}
</style>
