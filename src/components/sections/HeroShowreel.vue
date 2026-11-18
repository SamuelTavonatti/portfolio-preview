<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../../i18n/useI18n'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

const { t } = useI18n()

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)

const BEAT_DURATION = 4000
const LOOP_DURATION = 16000

let rafId = null
let lastTs = null

const loopMs = computed(() => elapsedMs.value % LOOP_DURATION)
const currentBeat = computed(() => Math.floor(loopMs.value / BEAT_DURATION))
const beatTime = computed(() => (loopMs.value % BEAT_DURATION) / 1000) // 0..4.0s within current beat

// Beat 01 phases
const b1WordIndex = computed(() => {
  if (currentBeat.value !== 0) return -1
  if (beatTime.value < 0.30) return 0 // Chiarezza.
  if (beatTime.value < 0.60) return 1 // Gerarchia.
  if (beatTime.value < 0.92) return 2 // Precisione.
  return 3 // Hero Lock-Up
})

const b1ToggleActive = computed(() => currentBeat.value === 0 && beatTime.value >= 1.65)

// Beat 02 animated counter (-42%)
const b2Counter = computed(() => {
  if (currentBeat.value !== 1) return 42
  const p = Math.min(1, Math.max(0, (beatTime.value - 0.85) / 0.85))
  const eased = 1 - Math.pow(1 - p, 3)
  return Math.round(eased * 42)
})

// Beat 03 typing prompt
const PROMPT_TEXT = 'Design system accessibile ad alto contrasto...'
const b3TypedPrompt = computed(() => {
  if (currentBeat.value !== 2) return ''
  const p = Math.min(1, Math.max(0, beatTime.value / 0.82))
  const count = Math.floor(p * PROMPT_TEXT.length)
  return PROMPT_TEXT.slice(0, count)
})

const chapters = [
  { id: 'ux-ui', num: '01', label: 'UX/UI Design' },
  { id: 'user-research', num: '02', label: 'User Research' },
  { id: 'creative-ai', num: '03', label: 'Creative AI' },
  { id: 'motion-fe', num: '04', label: 'Motion & Front-End' },
]

// Ambient orb palette shifting smoothly per chapter
const activeOrbTheme = computed(() => `theme-beat-${currentBeat.value + 1}`)

const tick = (ts) => {
  if (lastTs !== null && isAutoPlaying.value) {
    elapsedMs.value += ts - lastTs
  }
  lastTs = ts
  rafId = window.requestAnimationFrame(tick)
}

const jumpToBeat = (idx) => {
  // Jump directly to the Hero Lock-Up moment of the selected beat
  const lockOffsets = [1350, 1100, 1050, 950]
  elapsedMs.value = idx * BEAT_DURATION + (lockOffsets[idx] || 1000)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isAutoPlaying.value = false
      elapsedMs.value = 1650
    } else {
      // Start at 0s for the rapid staccato intro
      elapsedMs.value = 0
    }
    rafId = window.requestAnimationFrame(tick)
  }
})

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
})
</script>

<template>
  <section class="keynote-hero" aria-label="Hero Keynote Showcase">
    <div class="keynote-stage" :class="activeOrbTheme">
      <!-- Subtle Breathing Ambient Radial Light Blooms (No Grid, No Checkerboard) -->
      <div class="ambient-blooms" aria-hidden="true">
        <div class="bloom bloom-primary" />
        <div class="bloom bloom-secondary" />
      </div>

      <!-- Center Keynote Motion Stage -->
      <div class="stage-viewport">
        <!-- =========================================================
             BEAT 01: UX/UI DESIGN (0.0s - 4.0s)
             ========================================================= -->
        <div v-if="currentBeat === 0" class="beat-layer beat-01">
          <!-- Staccato Word Flashes (0.0s - 0.92s) -->
          <div v-if="b1WordIndex >= 0 && b1WordIndex < 3" class="staccato-wrap">
            <span v-if="b1WordIndex === 0" key="w0" class="staccato-word">Chiarezza.</span>
            <span v-else-if="b1WordIndex === 1" key="w1" class="staccato-word">Gerarchia.</span>
            <span v-else-if="b1WordIndex === 2" key="w2" class="staccato-word is-gold">Precisione.</span>
          </div>

          <!-- Hero Lock-Up + Glassmorphic UI Assembly (0.92s - 4.0s) -->
          <div v-else class="lockup-composition">
            <!-- Floating UI Prop 1: Token Card (Top-Left of stage) -->
            <div class="glass-prop prop-tokens">
              <span class="prop-dot is-gold" aria-hidden="true" />
              <span class="tabular-nums">8pt Grid · WCAG AA · 60fps</span>
            </div>

            <!-- Floating UI Prop 2: Interactive Apple Pill Toggle (Top-Right of stage) -->
            <div class="glass-prop prop-toggle" :class="{ 'is-on': b1ToggleActive }">
              <span class="toggle-label">High-Contrast UI</span>
              <span class="apple-switch" :class="{ active: b1ToggleActive }" aria-hidden="true">
                <span class="switch-knob" />
              </span>
            </div>

            <!-- Massive Two-Tone Display Lock-Up -->
            <h1 class="keynote-headline">
              <span class="mask-clip">
                <span class="mask-rise tone-ice">UX/UI</span>
              </span>
              <span class="mask-clip">
                <span class="mask-rise delay-1 tone-gold">DESIGN</span>
              </span>
            </h1>

            <!-- Floating UI Prop 3: Mobile Viewport Wireframe Card -->
            <div class="glass-prop prop-wireframe" aria-hidden="true">
              <div class="wf-notch" />
              <div class="wf-row-lg" />
              <div class="wf-row-sm" />
              <div class="wf-pill-accent" />
            </div>
          </div>
        </div>

        <!-- =========================================================
             BEAT 02: USER RESEARCH (4.0s - 8.0s)
             ========================================================= -->
        <div v-else-if="currentBeat === 1" class="beat-layer beat-02">
          <!-- Animated SVG Bezier Node Paths -->
          <svg class="research-svg" viewBox="0 0 800 300" fill="none" aria-hidden="true">
            <path
              class="bezier-draw"
              d="M110 190 C 230 60, 350 60, 400 150 C 450 240, 570 240, 690 110"
              stroke="url(#researchGrad)"
              stroke-width="2"
              stroke-linecap="round"
            />
            <circle class="node-pulse" cx="110" cy="190" r="6" fill="#34D399" />
            <circle class="node-pulse delay-n1" cx="400" cy="150" r="7" fill="#E2B878" />
            <circle class="node-pulse delay-n2" cx="690" cy="110" r="6" fill="#34D399" />
            <defs>
              <linearGradient id="researchGrad" x1="110" y1="190" x2="690" y2="110" gradientUnits="userSpaceOnUse">
                <stop stop-color="#34D399" stop-opacity="0.2" />
                <stop offset="0.5" stop-color="#34D399" stop-opacity="0.9" />
                <stop offset="1" stop-color="#E2B878" stop-opacity="0.4" />
              </linearGradient>
            </defs>
          </svg>

          <div class="lockup-composition">
            <div class="sub-pill is-emerald">
              <span>Ergonomia Cognitiva &amp; Usabilità</span>
            </div>

            <h1 class="keynote-headline">
              <span class="mask-clip">
                <span class="mask-rise tone-ice">USER</span>
              </span>
              <span class="mask-clip">
                <span class="mask-rise delay-1 tone-emerald">RESEARCH</span>
              </span>
            </h1>

            <div class="insight-row">
              <div class="glass-prop insight-badge">
                <span class="insight-metric tabular-nums">-{{ b2Counter }}%</span>
                <span class="insight-text">Attrito Cognitivo</span>
              </div>

              <div class="glass-prop insight-badge delay-b1">
                <svg class="check-svg" viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
                  <path class="check-draw" d="M4 10.5L8 14.5L16 6.5" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="insight-text">User Flow Validato</span>
              </div>

              <div class="glass-prop insight-badge delay-b2">
                <span class="orbit-cluster" aria-hidden="true">
                  <span class="orbit-dot d1" />
                  <span class="orbit-dot d2" />
                </span>
                <span class="insight-text">Architettura Intuitiva</span>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             BEAT 03: CREATIVE AI (8.0s - 12.0s)
             ========================================================= -->
        <div v-else-if="currentBeat === 2" class="beat-layer beat-03">
          <div class="lockup-composition">
            <!-- Prompt-to-UI Glassmorphic Input Bar -->
            <div class="glass-prop prompt-bar">
              <span class="prompt-sparkle" aria-hidden="true">✦</span>
              <span class="prompt-text">{{ b3TypedPrompt }}</span>
              <span class="prompt-caret" aria-hidden="true" />
            </div>

            <h1 class="keynote-headline">
              <span class="mask-clip">
                <span class="mask-rise tone-ice">CREATIVE</span>
              </span>
              <span class="mask-clip">
                <span class="mask-rise delay-1 tone-iridescent">AI</span>
              </span>
            </h1>

            <!-- Generative Component Matrix -->
            <div class="matrix-row">
              <div class="glass-prop matrix-card">
                <span class="matrix-step">01</span>
                <span class="matrix-label">Prompt</span>
              </div>
              <span class="matrix-arrow" aria-hidden="true">→</span>
              <div class="glass-prop matrix-card delay-b1 is-highlighted">
                <span class="matrix-step">02</span>
                <span class="matrix-label">Prototipo</span>
              </div>
              <span class="matrix-arrow" aria-hidden="true">→</span>
              <div class="glass-prop matrix-card delay-b2">
                <span class="matrix-step">03</span>
                <span class="matrix-label">Iterazione</span>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             BEAT 04: MOTION & FRONT-END (12.0s - 16.0s)
             ========================================================= -->
        <div v-else class="beat-layer beat-04">
          <div class="lockup-composition">
            <div class="sub-pill is-gold">
              <span>60fps GPU-Accelerated Execution</span>
            </div>

            <h1 class="keynote-headline is-compact">
              <span class="mask-clip">
                <span class="mask-rise tone-gold">MOTION &amp;</span>
              </span>
              <span class="mask-clip">
                <span class="mask-rise delay-1 tone-ice">FRONT-END</span>
              </span>
            </h1>

            <!-- Spring Curve & Semantic Code Parity Dock -->
            <div class="dock-row">
              <div class="glass-prop dock-curve-card">
                <svg viewBox="0 0 120 44" width="108" height="38" fill="none" aria-hidden="true">
                  <path d="M8 36 C 28 36, 36 8, 112 8" stroke="#E2B878" stroke-width="2.2" stroke-linecap="round" />
                  <circle class="curve-runner" cx="112" cy="8" r="4" fill="#34D399" />
                </svg>
                <span class="dock-mono">cubic-bezier(0.16, 1, 0.3, 1)</span>
              </div>

              <div class="glass-prop dock-parity-card delay-b1">
                <span class="parity-tag">Design ↔ Code Parity</span>
                <span class="parity-sub">Vue 3 · TypeScript · Zero CLS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Safe-Zone Anchor: Identity & CTAs (Left) + Minimalist Chapter Pills (Right) -->
      <div class="hud-container stage-footer">
        <div class="identity-cta-block">
          <div class="identity-line">
            <span class="identity-name">{{ t('showreel.identity') }}</span>
            <span class="identity-sep" aria-hidden="true">—</span>
            <span class="identity-role">{{ t('showreel.role') }}</span>
          </div>

          <div class="hero-ctas">
            <BaseButton to="/progetti" variant="primary" class="cta-gold">
              <span>{{ t('showreel.ctaPrimary') }}</span>
              <AppIcon name="arrow-right" :size="15" />
            </BaseButton>
            <BaseButton :to="{ path: '/', hash: '#contatti' }" variant="secondary" class="cta-glass">
              <span>{{ t('showreel.ctaSecondary') }}</span>
            </BaseButton>
          </div>
        </div>

        <!-- Ultra-Minimalist Interactive Chapter Pills -->
        <div class="chapter-pills" role="tablist" aria-label="Keynote chapters">
          <button
            v-for="(ch, idx) in chapters"
            :key="ch.id"
            type="button"
            role="tab"
            :aria-selected="currentBeat === idx"
            :aria-label="`${ch.num} ${ch.label}`"
            class="chapter-pill"
            :class="{ active: currentBeat === idx }"
            @click="jumpToBeat(idx)"
          >
            <span class="tabular-nums">{{ ch.num }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.keynote-hero {
  width: 100%;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.keynote-stage {
  position: relative;
  width: 100%;
  min-height: 94vh;
  min-height: 94svh;
  background-color: #050507;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5.5rem 0 1.75rem;
}

@media (min-width: 768px) {
  .keynote-stage {
    min-height: 95vh;
    padding: 6rem 0 2.25rem;
  }
}

/* Subtle Ambient Radial Blooms (Zero Grid, Zero Checkerboard) */
.ambient-blooms {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bloom {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  will-change: transform, opacity;
  transition: background 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.bloom-primary {
  width: 58vw;
  height: 58vw;
  max-width: 780px;
  max-height: 780px;
  top: 10%;
  left: 22%;
  opacity: 0.09;
  animation: breatheSlow 9s ease-in-out infinite alternate;
}

.bloom-secondary {
  width: 44vw;
  height: 44vw;
  max-width: 600px;
  max-height: 600px;
  bottom: 8%;
  right: 14%;
  opacity: 0.07;
  animation: breatheSlow 11s ease-in-out infinite alternate-reverse;
}

.theme-beat-1 .bloom-primary {
  background: radial-gradient(circle, #E2B878 0%, transparent 70%);
}
.theme-beat-1 .bloom-secondary {
  background: radial-gradient(circle, #F5F5F7 0%, transparent 70%);
}

.theme-beat-2 .bloom-primary {
  background: radial-gradient(circle, #34D399 0%, transparent 70%);
  transform: translate3d(-4%, 4%, 0);
}
.theme-beat-2 .bloom-secondary {
  background: radial-gradient(circle, #E2B878 0%, transparent 70%);
}

.theme-beat-3 .bloom-primary {
  background: radial-gradient(circle, #6366F1 0%, transparent 70%);
  transform: translate3d(5%, -3%, 0);
}
.theme-beat-3 .bloom-secondary {
  background: radial-gradient(circle, #E2B878 0%, transparent 70%);
}

.theme-beat-4 .bloom-primary {
  background: radial-gradient(circle, #E2B878 0%, transparent 70%);
  transform: translate3d(0, 2%, 0);
}
.theme-beat-4 .bloom-secondary {
  background: radial-gradient(circle, #34D399 0%, transparent 70%);
}

@keyframes breatheSlow {
  0% { transform: scale(0.96) translate3d(0, 0, 0); }
  100% { transform: scale(1.06) translate3d(2%, -2%, 0); }
}

/* Center Stage Viewport */
.stage-viewport {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
}

@media (min-width: 768px) {
  .stage-viewport {
    padding: 2rem 2.5rem;
  }
}

.beat-layer {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Staccato Flash Words */
.staccato-wrap {
  display: grid;
  place-items: center;
  min-height: 160px;
}

.staccato-word {
  font-size: clamp(3rem, 8.5vw, 6.8rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #F5F5F7;
  animation: scalePunch 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.staccato-word.is-gold {
  color: #E2B878;
}

@keyframes scalePunch {
  0% {
    opacity: 0.92;
    transform: scale(1.1);
    filter: blur(3px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

/* Hero Lock-Up Typography */
.lockup-composition {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.35rem;
  width: 100%;
}

.keynote-headline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 0.9rem;
  font-size: clamp(3.1rem, 7.6vw, 6.9rem);
  font-weight: 800;
  letter-spacing: -0.038em;
  line-height: 0.96;
}

.keynote-headline.is-compact {
  font-size: clamp(2.55rem, 6.6vw, 6rem);
}

.mask-clip {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.08em;
}

.mask-rise {
  display: inline-block;
  animation: maskRise 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.mask-rise.delay-1 {
  animation-delay: 90ms;
}

@keyframes maskRise {
  0% {
    opacity: 0;
    transform: translate3d(0, 108%, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.tone-ice {
  color: #F5F5F7;
}

.tone-gold {
  color: #E2B878;
}

.tone-emerald {
  color: #34D399;
}

.tone-iridescent {
  background: linear-gradient(110deg, #F5F5F7 10%, #E2B878 55%, #F5F5F7 90%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: maskRise 560ms cubic-bezier(0.16, 1, 0.3, 1) 90ms both, shimmerText 3.2s linear infinite;
}

@keyframes shimmerText {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

/* Glassmorphic Apple-Grade UI Props */
.glass-prop {
  background: rgba(18, 19, 24, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 20px 44px -18px rgba(0, 0, 0, 0.7);
  animation: springPop 520ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes springPop {
  0% {
    opacity: 0;
    transform: translate3d(0, 16px, 0) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

/* Beat 01 Props */
.prop-tokens {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.45rem 0.9rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: #D1D5DB;
  animation-delay: 140ms;
}

.prop-dot.is-gold {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #E2B878;
}

.prop-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #F5F5F7;
  animation-delay: 240ms;
  transition: border-color 300ms ease, box-shadow 300ms ease;
}

.prop-toggle.is-on {
  border-color: rgba(52, 211, 153, 0.45);
  box-shadow: 0 0 28px -6px rgba(52, 211, 153, 0.35);
}

.apple-switch {
  width: 38px;
  height: 22px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  padding: 2px;
  display: flex;
  align-items: center;
  transition: background-color 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.apple-switch.active {
  background: #34D399;
}

.switch-knob {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #F5F5F7;
  transform: translate3d(0, 0, 0);
  transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.apple-switch.active .switch-knob {
  transform: translate3d(16px, 0, 0);
}

.prop-wireframe {
  width: 120px;
  padding: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
  animation-delay: 320ms;
}

.wf-notch {
  width: 32px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  margin: 0 auto 0.2rem;
}

.wf-row-lg {
  width: 100%;
  height: 7px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.16);
}

.wf-row-sm {
  width: 68%;
  height: 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.wf-pill-accent {
  width: 52%;
  height: 10px;
  border-radius: 999px;
  background: #E2B878;
  margin-top: 0.2rem;
}

@media (min-width: 900px) {
  .prop-tokens {
    position: absolute;
    left: 4%;
    top: -18%;
  }
  .prop-toggle {
    position: absolute;
    right: 4%;
    top: -12%;
  }
  .prop-wireframe {
    position: absolute;
    right: 8%;
    bottom: -48%;
  }
}

/* Beat 02: User Research */
.research-svg {
  position: absolute;
  width: min(820px, 95vw);
  height: auto;
  pointer-events: none;
  opacity: 0.72;
}

.bezier-draw {
  stroke-dasharray: 920;
  stroke-dashoffset: 920;
  animation: drawStroke 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes drawStroke {
  to { stroke-dashoffset: 0; }
}

.node-pulse {
  animation: pulseScale 2s ease-in-out infinite;
  transform-origin: center;
}

.sub-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.38rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  animation: springPop 450ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.sub-pill.is-emerald {
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.35);
  color: #6EE7B7;
}

.sub-pill.is-gold {
  background: rgba(226, 184, 120, 0.12);
  border: 1px solid rgba(226, 184, 120, 0.38);
  color: #E2B878;
}

.insight-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
}

.insight-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
  color: #F5F5F7;
}

.insight-metric {
  font-weight: 700;
  color: #34D399;
}

.delay-b1 { animation-delay: 140ms; }
.delay-b2 { animation-delay: 260ms; }

.check-draw {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: drawStroke 550ms cubic-bezier(0.16, 1, 0.3, 1) 240ms forwards;
}

.orbit-cluster {
  position: relative;
  width: 14px;
  height: 14px;
  display: inline-block;
}

.orbit-dot {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #E2B878;
}

.orbit-dot.d1 { top: 0; left: 4px; }
.orbit-dot.d2 { bottom: 0; right: 2px; background: #34D399; }

/* Beat 03: Creative AI */
.prompt-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.52rem 1rem;
  max-width: 92vw;
  font-family: var(--font-mono);
  font-size: clamp(0.7rem, 1.4vw, 0.82rem);
  color: #E5E7EB;
}

.prompt-sparkle {
  color: #E2B878;
}

.prompt-caret {
  width: 2px;
  height: 1em;
  background: #E2B878;
  animation: blinkCaret 0.8s step-end infinite;
}

@keyframes blinkCaret {
  50% { opacity: 0; }
}

.matrix-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
}

.matrix-card {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.95rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #F5F5F7;
}

.matrix-card.is-highlighted {
  border-color: rgba(226, 184, 120, 0.45);
}

.matrix-step {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: #E2B878;
}

.matrix-arrow {
  color: rgba(255, 255, 255, 0.35);
  font-family: var(--font-mono);
}

/* Beat 04: Motion & Front-End */
.dock-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.dock-curve-card {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
}

.dock-mono {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #D1D5DB;
}

.dock-parity-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0.55rem 1rem;
}

.parity-tag {
  font-size: 0.8rem;
  font-weight: 600;
  color: #F5F5F7;
}

.parity-sub {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #9CA3AF;
}

/* Bottom Safe-Zone Footer */
.hud-container {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

@media (min-width: 768px) {
  .hud-container {
    padding: 0 2.5rem;
  }
}

.stage-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .stage-footer {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.identity-cta-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
}

.identity-line {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.12rem;
  font-size: 0.92rem;
}

.identity-name {
  font-weight: 700;
  color: #F5F5F7;
}

.identity-sep {
  display: none;
  color: #6B7280;
}

@media (min-width: 520px) {
  .identity-line {
    flex-direction: row;
    align-items: center;
    gap: 0.45rem;
  }

  .identity-sep {
    display: inline;
  }
}

.identity-role {
  color: #A1A7B3;
}

.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.cta-gold {
  background-color: #E2B878 !important;
  color: #050507 !important;
  border-color: #E2B878 !important;
  padding: 0.58rem 1.05rem !important;
  font-size: 0.85rem !important;
}

.cta-glass {
  background-color: #121318 !important;
  border-color: rgba(255, 255, 255, 0.14) !important;
  padding: 0.58rem 1.05rem !important;
  font-size: 0.85rem !important;
}

/* Minimalist Chapter Pills (01 02 03 04) */
.chapter-pills {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.chapter-pill {
  background: rgba(18, 19, 24, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #737986;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.34rem 0.62rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
}

.chapter-pill:hover {
  color: #F5F5F7;
  border-color: rgba(255, 255, 255, 0.25);
}

.chapter-pill.active {
  background: rgba(226, 184, 120, 0.16);
  border-color: rgba(226, 184, 120, 0.5);
  color: #E2B878;
}

@media (prefers-reduced-motion: reduce) {
  .bloom,
  .staccato-word,
  .mask-rise,
  .glass-prop,
  .bezier-draw,
  .check-draw,
  .prompt-caret {
    animation: none !important;
    stroke-dashoffset: 0 !important;
  }
}
</style>
