<script setup>
import { ref } from 'vue'
import { profileData } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import BaseBadge from '../ui/BaseBadge.vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

const { lang } = useI18n()

const magStyle = ref({ transform: 'translate3d(0, 0, 0)' })

const onMagMove = (e) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6
  magStyle.value = { transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)` }
}

const onMagLeave = () => {
  magStyle.value = { transform: 'translate3d(0, 0, 0)' }
}
</script>

<template>
  <section class="hero">
    <div class="hero-ambient" aria-hidden="true" />

    <div class="container hero-wrapper">
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
              :class="{ 'accent-line': index === 1 }"
              :style="{ animationDelay: `${index * 95}ms` }"
            >
              {{ line }}
            </span>
          </span>
        </h1>

        <p class="hero-subtitle reveal reveal-d2">
          {{ profileData.hero[lang].subtitle }}
        </p>

        <div class="hero-actions reveal reveal-d3">
          <div
            class="magnetic-wrap"
            :style="magStyle"
            @mousemove="onMagMove"
            @mouseleave="onMagLeave"
          >
            <BaseButton to="/progetti" variant="primary" class="cta-primary">
              <span>{{ profileData.hero[lang].ctaPrimary }}</span>
              <AppIcon name="arrow-right" :size="17" class="cta-arrow" />
            </BaseButton>
          </div>
          <BaseButton :to="{ path: '/', hash: '#contatti' }" variant="secondary">
            <span>{{ profileData.hero[lang].ctaSecondary }}</span>
          </BaseButton>
        </div>
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
  padding: 8.5rem 0 3.75rem;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hero {
    padding: 10.25rem 0 4.25rem;
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

.hero-main {
  text-align: left;
  max-width: 900px;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--status-live);
}

.hero-title {
  margin-top: 1.5rem;
  font-size: clamp(2.5rem, 6vw, 4.65rem);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.04em;
  color: var(--text-primary);
}

.accent-line {
  color: var(--accent);
}

.hero-subtitle {
  margin-top: 1.45rem;
  font-size: clamp(1.02rem, 1.55vw, 1.18rem);
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 62ch;
}

.hero-actions {
  margin-top: 2.25rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
}

.magnetic-wrap {
  display: inline-block;
  transition: transform 0.25s var(--ease-out-expo);
  will-change: transform;
}

.cta-arrow {
  transition: transform var(--transition-fast);
}

.cta-primary:hover .cta-arrow {
  transform: translateX(3px);
}

/* Full-width left-aligned divider & metrics */
.hero-divider {
  margin-top: 3.25rem;
  height: 1px;
  width: 100%;
  background: var(--border-subtle);
}

.hero-metrics {
  margin-top: 1.75rem;
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
</style>
