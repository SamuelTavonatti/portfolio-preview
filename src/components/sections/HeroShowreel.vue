<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../../i18n/useI18n'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

const { t } = useI18n()

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)

const ACT_DURATION = 4000
const LOOP_DURATION = 16000

let rafId = null
let lastTs = null

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))
const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)))
const easeInOutCubic = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

const loopSec = computed(() => (elapsedMs.value % LOOP_DURATION) / 1000)
const currentAct = computed(() => Math.floor(loopSec.value / 4))
const actTime = computed(() => loopSec.value % 4) // 0..4.0s

// =========================================================
// ACT 01 (0.0s - 4.0s): + Nuova Idea -> UX/UI DESIGN + Voltrep App Card -> Node Bridge
// =========================================================
const act1PillPhase = computed(() => currentAct.value === 0 && actTime.value < 0.72)
const act1Clicked = computed(() => currentAct.value === 0 && actTime.value >= 0.42)
const act1TabIndex = computed(() => {
  if (currentAct.value !== 0) return 0
  if (actTime.value < 1.7) return 0
  if (actTime.value < 2.55) return 1
  return 2
})
const act1BridgeProgress = computed(() => {
  if (currentAct.value !== 0) return 0
  return clamp((actTime.value - 3.32) / 0.68)
})

// =========================================================
// ACT 02 (4.0s - 8.0s): USER RESEARCH + Flow Map + Telemetry + Wireframe-to-UI Slider -> Prompt Bar Bridge
// =========================================================
const act2Friction = computed(() => {
  if (currentAct.value !== 1) return 42
  return Math.round(easeOutExpo((actTime.value - 0.55) / 1.1) * 42)
})
const act2Clarity = computed(() => {
  if (currentAct.value !== 1) return 98
  return Math.round(easeOutExpo((actTime.value - 0.55) / 1.1) * 98)
})
const act2SliderPct = computed(() => {
  if (currentAct.value !== 1) return 50
  const p = clamp((actTime.value - 0.85) / 1.9)
  return Math.round(12 + easeInOutCubic(p) * 78)
})
const act2BridgeProgress = computed(() => {
  if (currentAct.value !== 1) return 0
  return clamp((actTime.value - 3.35) / 0.65)
})

// =========================================================
// ACT 03 (8.0s - 12.0s): Prompt Bar -> CREATIVE AI + 3 Spatial App Concept Cards -> Swipe Pill Bridge
// =========================================================
const AI_PROMPT = 'Genera prototipo accessibile...'
const act3Typed = computed(() => {
  if (currentAct.value !== 2) return AI_PROMPT
  const p = clamp(actTime.value / 0.75)
  return AI_PROMPT.slice(0, Math.max(4, Math.floor(p * AI_PROMPT.length)))
})
const act3PaletteStep = computed(() => {
  if (currentAct.value !== 2) return 0
  return actTime.value < 2.0 ? 0 : 1
})
const act3BridgeProgress = computed(() => {
  if (currentAct.value !== 2) return 0
  return clamp((actTime.value - 3.35) / 0.65)
})

// =========================================================
// ACT 04 (12.0s - 16.0s): Swipe Wipe -> MOTION & FRONT-END + Dock & Responsive Morph -> + Nuova Idea Loop Bridge
// =========================================================
const act4DockIndex = computed(() => {
  if (currentAct.value !== 3) return 0
  if (actTime.value < 1.55) return 0
  if (actTime.value < 2.45) return 1
  return 2
})
const act4IsMobileFrame = computed(() => currentAct.value === 3 && actTime.value >= 1.75 && actTime.value < 3.35)
const act4LoopBridge = computed(() => {
  if (currentAct.value !== 3) return 0
  return clamp((actTime.value - 3.35) / 0.65)
})

const chapters = [
  { id: 'ux-ui', num: '01', label: 'UX/UI Design' },
  { id: 'user-research', num: '02', label: 'User Research' },
  { id: 'creative-ai', num: '03', label: 'Creative AI' },
  { id: 'motion-fe', num: '04', label: 'Motion & Front-End' },
]

const activeTheme = computed(() => `theme-act-${currentAct.value + 1}`)

const tick = (ts) => {
  if (lastTs !== null && isAutoPlaying.value) {
    elapsedMs.value += ts - lastTs
  }
  lastTs = ts
  rafId = window.requestAnimationFrame(tick)
}

const jumpToAct = (idx) => {
  const offsets = [1450, 1650, 1500, 1400]
  elapsedMs.value = idx * ACT_DURATION + (offsets[idx] || 1400)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isAutoPlaying.value = false
      elapsedMs.value = 1600
    } else {
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
  <section class="keynote-hero" aria-label="Hero Match-Cut Showreel">
    <div class="keynote-stage" :class="activeTheme">
      <!-- Subtle Breathing Ambient Radial Light Blooms (Zero Grid / Checkerboard) -->
      <div class="ambient-blooms" aria-hidden="true">
        <div class="bloom bloom-a" />
        <div class="bloom bloom-b" />
      </div>

      <!-- Center Spatial Stage -->
      <div class="stage-viewport">
        <!-- =========================================================
             ACT 01: + NUOVA IDEA -> UX/UI DESIGN + MOBILE APP CARD
             ========================================================= -->
        <div v-if="currentAct === 0" class="act-layer act-01" :class="{ 'is-bridging': act1BridgeProgress > 0 }">
          <!-- Opening Pill + Animated Cursor Click (0.0s - 0.72s) -->
          <div v-if="act1PillPhase" class="idea-pill-stage">
            <div class="idea-pill" :class="{ clicked: act1Clicked }">
              <span class="idea-plus" aria-hidden="true">+</span>
              <span>Nuova Idea</span>
            </div>
            <svg class="act1-cursor" :class="{ clicking: act1Clicked }" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#E2B878" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
          </div>

          <!-- UX/UI DESIGN Lock-Up + Real Mobile App Interface Card (0.72s - 4.0s) -->
          <div v-else class="act-grid act-01-grid">
            <div class="act-copy-col">
              <span class="act-kicker is-gold">Idea → Interfaccia</span>
              <h1 class="act-headline">
                <span class="mask-clip"><span class="mask-rise tone-ice">UX/UI</span></span>
                <span class="mask-clip"><span class="mask-rise delay-1 tone-gold">DESIGN</span></span>
              </h1>
            </div>

            <!-- Real Tactile Mobile App Card (Voltrep / Apple-Grade UI) -->
            <div class="app-frame-card" :style="{ transform: act1BridgeProgress > 0 ? `scale(${1 - act1BridgeProgress * 0.14}) translate3d(${act1BridgeProgress * 32}px, 0, 0)` : undefined }">
              <div class="app-header">
                <span class="app-brand-dot" aria-hidden="true" />
                <span class="app-title">Voltrep</span>
                <span class="app-badge tabular-nums">8pt Grid</span>
              </div>

              <!-- Sliding Segmented Control -->
              <div class="segmented-bar" aria-hidden="true">
                <span class="seg-thumb" :style="{ transform: `translate3d(${act1TabIndex * 100}%, 0, 0)` }" />
                <span class="seg-item" :class="{ active: act1TabIndex === 0 }">Scheda</span>
                <span class="seg-item" :class="{ active: act1TabIndex === 1 }">Volume</span>
                <span class="seg-item" :class="{ active: act1TabIndex === 2 }">Mappa</span>
              </div>

              <!-- Workout Load Card -->
              <div class="workout-mini-card">
                <div class="wk-top">
                  <span class="wk-name">Panca Piana</span>
                  <span class="wk-delta tabular-nums">+4.2%</span>
                </div>
                <div class="wk-metrics tabular-nums">
                  <span class="wk-load">82.5 kg</span>
                  <span class="wk-sets">4 × 8 rep</span>
                </div>
                <div class="wk-bar-track" aria-hidden="true">
                  <div class="wk-bar-fill" />
                </div>
              </div>
            </div>

            <!-- Match-Cut Bridge Object: Detaching Research Node + SVG Bezier Path -->
            <div v-if="act1BridgeProgress > 0" class="bridge-node-shot" :style="{ transform: `translate3d(${(act1BridgeProgress - 0.5) * 260}px, 0, 0) scale(${0.6 + act1BridgeProgress * 0.7})`, opacity: Math.min(1, act1BridgeProgress * 2) }" aria-hidden="true" />
          </div>
        </div>

        <!-- =========================================================
             ACT 02: USER RESEARCH + FLOW MAP + TELEMETRY + WIREFRAME-TO-UI SLIDER
             ========================================================= -->
        <div v-else-if="currentAct === 1" class="act-layer act-02">
          <!-- Luminous SVG User-Journey Path Split -->
          <svg class="journey-svg" viewBox="0 0 900 180" fill="none" aria-hidden="true">
            <path class="journey-path" d="M60 110 C 240 20, 380 160, 460 90 C 560 15, 720 140, 840 70" stroke="url(#journeyGrad)" stroke-width="2" stroke-linecap="round" />
            <circle cx="60" cy="110" r="5" fill="#34D399" />
            <circle cx="460" cy="90" r="6" fill="#E2B878" />
            <circle cx="840" cy="70" r="5" fill="#34D399" />
            <defs>
              <linearGradient id="journeyGrad" x1="60" y1="110" x2="840" y2="70" gradientUnits="userSpaceOnUse">
                <stop stop-color="#34D399" stop-opacity="0.25" />
                <stop offset="0.5" stop-color="#34D399" stop-opacity="0.95" />
                <stop offset="1" stop-color="#E2B878" stop-opacity="0.45" />
              </linearGradient>
            </defs>
          </svg>

          <div class="act-stack">
            <span class="act-kicker is-emerald">Ergonomia Cognitiva &amp; Flussi</span>
            <h1 class="act-headline">
              <span class="mask-clip"><span class="mask-rise tone-ice">USER</span></span>
              <span class="mask-clip"><span class="mask-rise delay-1 tone-emerald">RESEARCH</span></span>
            </h1>

            <!-- 3 Tangible UX Research Artifacts -->
            <div class="research-artifacts">
              <!-- Artifact 1: User Flow / Card Sorting Map -->
              <div class="glass-card flow-card">
                <div class="flow-nodes">
                  <span class="f-node active">Scoperta</span>
                  <span class="f-line" aria-hidden="true" />
                  <span class="f-node active">Flusso</span>
                  <span class="f-line" aria-hidden="true" />
                  <span class="f-node is-accent">Azione</span>
                </div>
              </div>

              <!-- Artifact 2: Usability Telemetry Pill -->
              <div class="glass-card telemetry-pill tabular-nums">
                <span class="tel-em">-{{ act2Friction }}%</span>
                <span class="tel-lbl">Attrito</span>
                <span class="tel-sep" aria-hidden="true">·</span>
                <span class="tel-gold">{{ act2Clarity }}%</span>
                <span class="tel-lbl">Chiarezza</span>
              </div>

              <!-- Artifact 3: Wireframe-to-UI Comparison Slider -->
              <div
                class="glass-card compare-card"
                :style="{ transform: act2BridgeProgress > 0 ? `rotate(${act2BridgeProgress * 90}deg) scale(${1 - act2BridgeProgress * 0.2})` : undefined }"
              >
                <!-- Low-Fi Wireframe Base -->
                <div class="compare-layer compare-lowfi" aria-hidden="true">
                  <div class="wf-box-lg" />
                  <div class="wf-box-sm" />
                </div>
                <!-- Polished High-Contrast UI Reveal -->
                <div class="compare-layer compare-hifi" :style="{ clipPath: `inset(0 ${100 - act2SliderPct}% 0 0)` }">
                  <span class="hifi-title">UI Validata</span>
                  <span class="hifi-badge">WCAG AA</span>
                </div>
                <!-- Animated Vertical Slider Handle -->
                <div class="compare-handle" :style="{ left: `${act2SliderPct}%` }" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             ACT 03: PROMPT BAR -> CREATIVE AI + 3 SPATIAL APP CONCEPT CARDS
             ========================================================= -->
        <div v-else-if="currentAct === 2" class="act-layer act-03">
          <div class="act-stack">
            <!-- Morphing Prompt Bar (Continues from rotated Act 02 slider) -->
            <div class="glass-card prompt-command-bar">
              <span class="prompt-star" aria-hidden="true">✦</span>
              <span class="prompt-str">{{ act3Typed }}</span>
              <span class="prompt-caret" aria-hidden="true" />
            </div>

            <h1 class="act-headline">
              <span class="mask-clip"><span class="mask-rise tone-ice">CREATIVE</span></span>
              <span class="mask-clip"><span class="mask-rise delay-1 tone-iridescent">AI</span></span>
            </h1>

            <!-- 3 Modular Spatial App Concept Cards -->
            <div class="concept-stack" :class="{ 'is-converging': act3BridgeProgress > 0 }">
              <div class="glass-card concept-card card-left">
                <div class="swatch-row" aria-hidden="true">
                  <span class="swatch" :style="{ background: act3PaletteStep === 0 ? '#E2B878' : '#34D399' }" />
                  <span class="swatch" style="background: #F5F5F7" />
                  <span class="swatch" style="background: #1A1D24" />
                </div>
                <span class="concept-title">Design Token Generator</span>
                <span class="concept-meta tabular-nums">WCAG AA · 11.4:1</span>
              </div>

              <div class="glass-card concept-card card-center">
                <div class="layout-preview" aria-hidden="true">
                  <span class="lp-col" />
                  <span class="lp-col is-wide" />
                </div>
                <span class="concept-title">Adaptive Layout</span>
                <span class="concept-meta">Desktop ↔ Mobile</span>
              </div>

              <div class="glass-card concept-card card-right">
                <div class="copy-pill-preview" aria-hidden="true">Esplora →</div>
                <span class="concept-title">Smart Micro-Copy</span>
                <span class="concept-meta">Chiarezza UX</span>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             ACT 04: SWIPE WIPE -> MOTION & FRONT-END + DOCK & RESPONSIVE MORPH
             ========================================================= -->
        <div v-else class="act-layer act-04">
          <div v-if="act4LoopBridge > 0.65" class="idea-pill-stage">
            <div class="idea-pill">
              <span class="idea-plus" aria-hidden="true">+</span>
              <span>Nuova Idea</span>
            </div>
          </div>

          <div v-else class="act-stack" :style="{ opacity: 1 - act4LoopBridge * 0.9, transform: `scale(${1 - act4LoopBridge * 0.12})` }">
            <span class="act-kicker is-gold">60 FPS · WCAG AA · ZERO BLOAT</span>
            <h1 class="act-headline is-compact">
              <span class="mask-clip"><span class="mask-rise tone-gold">MOTION &amp;</span></span>
              <span class="mask-clip"><span class="mask-rise delay-1 tone-ice">FRONT-END</span></span>
            </h1>

            <!-- Interactive App Dock + Responsive Desktop-to-Mobile Frame Morph -->
            <div class="motion-stage-row">
              <!-- Live Elastic Apple Dock -->
              <div class="glass-card elastic-dock" aria-hidden="true">
                <span class="dock-pill-bg" :style="{ transform: `translate3d(${act4DockIndex * 100}%, 0, 0)` }" />
                <span class="dock-item" :class="{ active: act4DockIndex === 0 }">UI</span>
                <span class="dock-item" :class="{ active: act4DockIndex === 1 }">Code</span>
                <span class="dock-item" :class="{ active: act4DockIndex === 2 }">60fps</span>
              </div>

              <!-- Desktop-to-Mobile Responsive Frame Morph -->
              <div class="glass-card morph-device" :class="{ 'is-mobile': act4IsMobileFrame }" aria-hidden="true">
                <div class="md-topbar">
                  <span class="md-dot" />
                  <span class="md-dot" />
                </div>
                <div class="md-body">
                  <span class="md-hero-bar" />
                  <span class="md-sub-bar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Safe-Zone Anchor: Identity + CTAs (Left) & Minimalist Chapter Pills (Right) -->
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

        <div class="chapter-pills" role="tablist" aria-label="Showreel chapters">
          <button
            v-for="(ch, idx) in chapters"
            :key="ch.id"
            type="button"
            role="tab"
            :aria-selected="currentAct === idx"
            :aria-label="`${ch.num} ${ch.label}`"
            class="chapter-pill"
            :class="{ active: currentAct === idx }"
            @click="jumpToAct(idx)"
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
  padding: 5.25rem 0 1.65rem;
}

@media (min-width: 768px) {
  .keynote-stage {
    min-height: 95vh;
    padding: 5.75rem 0 2.15rem;
  }
}

/* Subtle Ambient Radial Blooms (Zero Grid / Zero Checkerboard) */
.ambient-blooms {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bloom {
  position: absolute;
  border-radius: 50%;
  filter: blur(95px);
  will-change: transform, opacity;
  transition: background 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.bloom-a {
  width: 56vw;
  height: 56vw;
  max-width: 760px;
  max-height: 760px;
  top: 12%;
  left: 20%;
  opacity: 0.095;
}

.bloom-b {
  width: 42vw;
  height: 42vw;
  max-width: 580px;
  max-height: 580px;
  bottom: 10%;
  right: 12%;
  opacity: 0.075;
}

.theme-act-1 .bloom-a { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.theme-act-1 .bloom-b { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }

.theme-act-2 .bloom-a { background: radial-gradient(circle, #34D399 0%, transparent 70%); transform: translate3d(-4%, 3%, 0); }
.theme-act-2 .bloom-b { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }

.theme-act-3 .bloom-a { background: radial-gradient(circle, #6366F1 0%, transparent 70%); transform: translate3d(5%, -3%, 0); }
.theme-act-3 .bloom-b { background: radial-gradient(circle, #34D399 0%, transparent 70%); }

.theme-act-4 .bloom-a { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.theme-act-4 .bloom-b { background: radial-gradient(circle, #34D399 0%, transparent 70%); }

/* Stage Viewport */
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
  padding: 1rem 1.25rem;
}

@media (min-width: 768px) {
  .stage-viewport {
    padding: 1.5rem 2.5rem;
  }
}

.act-layer {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Opening / Loop Pill: + Nuova Idea */
.idea-pill-stage {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.idea-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1.65rem;
  border-radius: 999px;
  background: rgba(18, 19, 24, 0.9);
  border: 1px solid rgba(226, 184, 120, 0.45);
  color: #F5F5F7;
  font-size: clamp(1.05rem, 2.2vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  box-shadow: 0 20px 50px -15px rgba(226, 184, 120, 0.25);
  transition: transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 200ms ease;
}

.idea-pill.clicked {
  transform: scale(0.92);
  background: rgba(226, 184, 120, 0.16);
}

.idea-plus {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #E2B878;
  color: #050507;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.act1-cursor {
  position: absolute;
  right: -12px;
  bottom: -14px;
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.act1-cursor.clicking {
  transform: translate3d(-14px, -12px, 0) scale(0.84);
}

/* Shared Typography */
.act-kicker {
  display: inline-flex;
  align-items: center;
  padding: 0.34rem 0.85rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.act-kicker.is-gold {
  background: rgba(226, 184, 120, 0.12);
  border: 1px solid rgba(226, 184, 120, 0.38);
  color: #E2B878;
}

.act-kicker.is-emerald {
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.36);
  color: #6EE7B7;
}

.act-headline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.2rem 0.8rem;
  font-size: clamp(2.65rem, 6.8vw, 6.2rem);
  font-weight: 800;
  letter-spacing: -0.038em;
  line-height: 0.96;
}

.act-headline.is-compact {
  font-size: clamp(2.35rem, 6vw, 5.5rem);
}

.mask-clip {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.08em;
}

.mask-rise {
  display: inline-block;
  animation: maskRise 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.mask-rise.delay-1 {
  animation-delay: 85ms;
}

@keyframes maskRise {
  0% { opacity: 0; transform: translate3d(0, 105%, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}

.tone-ice { color: #F5F5F7; }
.tone-gold { color: #E2B878; }
.tone-emerald { color: #34D399; }

.tone-iridescent {
  background: linear-gradient(110deg, #F5F5F7 10%, #E2B878 52%, #34D399 90%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Glass Card Base */
.glass-card {
  background: rgba(17, 18, 23, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  box-shadow: 0 22px 48px -20px rgba(0, 0, 0, 0.78);
}

/* =========================================================
   ACT 01 LAYOUT & MOBILE APP CARD (VOLTREP)
   ========================================================= */
.act-01-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

@media (min-width: 960px) {
  .act-01-grid {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2.5rem;
  }

  .act-copy-col {
    align-items: flex-start !important;
    text-align: left !important;
  }

  .act-copy-col .act-headline {
    justify-content: flex-start;
  }
}

.act-copy-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.9rem;
}

.app-frame-card {
  width: min(330px, 90vw);
  padding: 1.15rem;
  border-radius: 22px;
  background: rgba(17, 18, 23, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 28px 60px -22px rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  animation: springCard 560ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes springCard {
  0% { opacity: 0; transform: translate3d(0, 22px, 0) scale(0.9); }
  100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}

.app-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #E2B878;
}

.app-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #F5F5F7;
  margin-right: auto;
}

.app-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #9CA3AF;
  padding: 0.18rem 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
}

.segmented-bar {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 3px;
}

.seg-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc((100% - 6px) / 3);
  height: calc(100% - 6px);
  border-radius: 8px;
  background: rgba(226, 184, 120, 0.22);
  border: 1px solid rgba(226, 184, 120, 0.45);
  transition: transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.seg-item {
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: #9CA3AF;
  padding: 0.34rem 0;
}

.seg-item.active {
  color: #F5F5F7;
}

.workout-mini-card {
  padding: 0.85rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.wk-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wk-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #F5F5F7;
}

.wk-delta {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: #34D399;
}

.wk-metrics {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.wk-load {
  font-size: 1.25rem;
  font-weight: 800;
  color: #E2B878;
}

.wk-sets {
  font-size: 0.75rem;
  color: #9CA3AF;
}

.wk-bar-track {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.wk-bar-fill {
  width: 78%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #E2B878, #34D399);
}

.bridge-node-shot {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #34D399;
  box-shadow: 0 0 28px 6px rgba(52, 211, 153, 0.6);
  pointer-events: none;
}

/* =========================================================
   ACT 02: USER RESEARCH + ARTIFACTS
   ========================================================= */
.act-stack {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.15rem;
  width: 100%;
}

.journey-svg {
  position: absolute;
  width: min(880px, 96vw);
  height: auto;
  pointer-events: none;
  opacity: 0.55;
}

.journey-path {
  stroke-dasharray: 1050;
  stroke-dashoffset: 1050;
  animation: drawJourney 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes drawJourney {
  to { stroke-dashoffset: 0; }
}

.research-artifacts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.flow-card {
  padding: 0.58rem 0.9rem;
}

.flow-nodes {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.f-node {
  font-size: 0.74rem;
  font-weight: 600;
  padding: 0.24rem 0.55rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: #D1D5DB;
}

.f-node.is-accent {
  background: rgba(52, 211, 153, 0.16);
  color: #6EE7B7;
}

.f-line {
  width: 14px;
  height: 2px;
  background: rgba(52, 211, 153, 0.5);
}

.telemetry-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
}

.tel-em { font-weight: 700; color: #34D399; }
.tel-gold { font-weight: 700; color: #E2B878; }
.tel-lbl { color: #D1D5DB; }
.tel-sep { color: #6B7280; }

/* Wireframe-to-UI Comparison Slider */
.compare-card {
  position: relative;
  width: 196px;
  height: 54px;
  overflow: hidden;
  transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.compare-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.85rem;
}

.compare-lowfi {
  background: rgba(255, 255, 255, 0.03);
}

.wf-box-lg {
  width: 66px;
  height: 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.16);
}

.wf-box-sm {
  width: 44px;
  height: 16px;
  border-radius: 999px;
  border: 1px dashed rgba(255, 255, 255, 0.26);
}

.compare-hifi {
  background: linear-gradient(90deg, rgba(226, 184, 120, 0.18), rgba(52, 211, 153, 0.16));
}

.hifi-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: #F5F5F7;
}

.hifi-badge {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 700;
  color: #050507;
  background: #34D399;
  padding: 0.16rem 0.45rem;
  border-radius: 999px;
}

.compare-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #E2B878;
  box-shadow: 0 0 10px #E2B878;
}

/* =========================================================
   ACT 03: CREATIVE AI + 3 SPATIAL CONCEPT CARDS
   ========================================================= */
.prompt-command-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.52rem 1rem;
  font-family: var(--font-mono);
  font-size: clamp(0.72rem, 1.4vw, 0.82rem);
  color: #F5F5F7;
  border-color: rgba(226, 184, 120, 0.4);
}

.prompt-star { color: #E2B878; }

.prompt-caret {
  width: 2px;
  height: 1em;
  background: #34D399;
  animation: blinkCaret 0.75s step-end infinite;
}

@keyframes blinkCaret {
  50% { opacity: 0; }
}

.concept-stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.concept-stack.is-converging {
  transform: scale(0.84);
  opacity: 0.45;
}

.concept-card {
  width: 190px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
  text-align: left;
  animation: springCard 500ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.card-center { animation-delay: 90ms; border-color: rgba(226, 184, 120, 0.42); }
.card-right { animation-delay: 180ms; }

.swatch-row {
  display: flex;
  gap: 0.35rem;
}

.swatch {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: background-color 400ms ease;
}

.layout-preview {
  display: flex;
  gap: 0.3rem;
  width: 100%;
}

.lp-col {
  height: 16px;
  flex: 1;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.14);
}

.lp-col.is-wide {
  flex: 2;
  background: rgba(226, 184, 120, 0.32);
}

.copy-pill-preview {
  font-size: 0.7rem;
  font-weight: 700;
  color: #050507;
  background: #E2B878;
  padding: 0.18rem 0.6rem;
  border-radius: 999px;
}

.concept-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #F5F5F7;
}

.concept-meta {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #9CA3AF;
}

/* =========================================================
   ACT 04: MOTION & FRONT-END + DOCK & RESPONSIVE MORPH
   ========================================================= */
.motion-stage-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.elastic-dock {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 68px);
  padding: 5px;
  border-radius: 999px;
}

.dock-pill-bg {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 68px;
  height: calc(100% - 10px);
  border-radius: 999px;
  background: #E2B878;
  transition: transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dock-item {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0.42rem 0;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  color: #A1A7B3;
  transition: color 250ms ease;
}

.dock-item.active {
  color: #050507;
}

.morph-device {
  width: 148px;
  height: 68px;
  padding: 0.55rem;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition: width 520ms cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 520ms ease;
}

.morph-device.is-mobile {
  width: 64px;
  border-radius: 18px;
  border-color: rgba(52, 211, 153, 0.5);
}

.md-topbar {
  display: flex;
  gap: 0.25rem;
}

.md-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
}

.md-body {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.md-hero-bar {
  width: 82%;
  height: 10px;
  border-radius: 4px;
  background: rgba(226, 184, 120, 0.45);
}

.md-sub-bar {
  width: 56%;
  height: 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.16);
}

/* =========================================================
   BOTTOM SAFE-ZONE FOOTER
   ========================================================= */
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

.chapter-pills {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.chapter-pill {
  background: rgba(18, 19, 24, 0.78);
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
  .mask-rise,
  .app-frame-card,
  .concept-card,
  .journey-path,
  .prompt-caret {
    animation: none !important;
    stroke-dashoffset: 0 !important;
  }
}
</style>
