<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../../i18n/useI18n'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

const { t } = useI18n()

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)

const LOOP_SEC = 18.0
const LOOP_MS = LOOP_SEC * 1000

let rafId = null
let lastTs = null

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))
const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)))
const easeInOutCubic = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

const sec = computed(() => (elapsedMs.value % LOOP_MS) / 1000)

// Smooth overlapping visibility helper for continuous single-take cross-zoom
const layerEnvelope = (t, start, end, fadeIn = 0.65, fadeOut = 0.7) => {
  if (t < start || t > end) return { visible: false, opacity: 0, enter: 0, exit: 0 }
  const enter = easeOutExpo((t - start) / fadeIn)
  const exit = t > end - fadeOut ? easeInOutCubic((t - (end - fadeOut)) / fadeOut) : 0
  return {
    visible: true,
    opacity: clamp(enter * (1 - exit)),
    enter,
    exit,
  }
}

// =========================================================
// SEQUENCE A (0.0s - 4.6s): CREATIVE AI + PROMPT CAMERA ZOOM
// =========================================================
const seqA = computed(() => layerEnvelope(sec.value, 0.0, 4.6, 0.45, 0.75))
const PROMPT_FULL = 'Progetta interfaccia Voltrep ad alto contrasto...'
const promptTyped = computed(() => {
  const p = clamp(sec.value / 1.9)
  return PROMPT_FULL.slice(0, Math.max(8, Math.floor(p * PROMPT_FULL.length)))
})
const seqACursorMove = computed(() => easeInOutCubic((sec.value - 1.55) / 1.1))
const seqAClicked = computed(() => sec.value >= 2.75 && sec.value < 4.6)
const seqAZoom = computed(() => 1 + easeInOutCubic((sec.value - 2.95) / 1.55) * 0.38)

// =========================================================
// SEQUENCE B (3.95s - 9.1s): USER RESEARCH + ANALYTICS ZOOM
// =========================================================
const seqB = computed(() => layerEnvelope(sec.value, 3.95, 9.1, 0.65, 0.75))
const seqBLocal = computed(() => Math.max(0, sec.value - 3.95))
const metricFriction = computed(() => Math.round(easeOutExpo((seqBLocal.value - 0.35) / 1.2) * 42))
const metricTask = computed(() => (easeOutExpo((seqBLocal.value - 0.4) / 1.25) * 98.4).toFixed(1))
const metricSus = computed(() => Math.round(easeOutExpo((seqBLocal.value - 0.45) / 1.3) * 91))
const seqBZoom = computed(() => {
  const zoomIn = 0.8 + easeOutExpo(seqBLocal.value / 0.75) * 0.2
  const zoomOut = easeInOutCubic((seqBLocal.value - 3.85) / 1.25) * 0.36
  return zoomIn + zoomOut
})

// =========================================================
// SEQUENCE C (8.45s - 13.6s): UX/UI DESIGN + FIGMA WORKSPACE
// =========================================================
const seqC = computed(() => layerEnvelope(sec.value, 8.45, 13.6, 0.65, 0.75))
const seqCLocal = computed(() => Math.max(0, sec.value - 8.45))
const figmaDarkMode = computed(() => seqCLocal.value >= 1.65)
const figmaCodeClicked = computed(() => seqCLocal.value >= 3.55)
const figmaCursorP = computed(() => easeInOutCubic((seqCLocal.value - 2.4) / 1.05))
const seqCTransform = computed(() => {
  const entryScale = 0.82 + easeOutExpo(seqCLocal.value / 0.75) * 0.18
  const exitP = easeInOutCubic((seqCLocal.value - 3.75) / 1.35)
  const scale = entryScale + exitP * 0.32
  const tilt = exitP * 9
  return `perspective(1100px) scale(${scale.toFixed(3)}) rotateX(${tilt.toFixed(2)}deg)`
})

// =========================================================
// SEQUENCE D (12.95s - 18.0s): LIVING PORTFOLIO & VOLTREP FRONT-END
// =========================================================
const seqD = computed(() => layerEnvelope(sec.value, 12.95, 18.0, 0.65, 0.75))
const seqDLocal = computed(() => Math.max(0, sec.value - 12.95))
const voltrepCompleted = computed(() => seqDLocal.value >= 1.85)
const navPillIdx = computed(() => {
  if (seqDLocal.value < 1.3) return 0
  if (seqDLocal.value < 2.45) return 1
  return 2
})
const cardHovered = computed(() => seqDLocal.value >= 2.25 && seqDLocal.value < 4.35)
const seqDTransform = computed(() => {
  const entryScale = 0.84 + easeOutExpo(seqDLocal.value / 0.75) * 0.16
  const pullBack = easeInOutCubic((seqDLocal.value - 3.95) / 1.05) * 0.16
  return `scale(${(entryScale - pullBack).toFixed(3)})`
})

// Continuous ambient radial light palette shifting seamlessly with camera
const ambientTheme = computed(() => {
  if (sec.value < 4.3) return 'ambient-ai'
  if (sec.value < 8.8) return 'ambient-research'
  if (sec.value < 13.3) return 'ambient-figma'
  return 'ambient-frontend'
})

const tick = (ts) => {
  if (lastTs !== null && isAutoPlaying.value) {
    elapsedMs.value += ts - lastTs
  }
  lastTs = ts
  rafId = window.requestAnimationFrame(tick)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isAutoPlaying.value = false
      elapsedMs.value = 14800 // Clean static showcase of living portfolio & Voltrep
    } else {
      elapsedMs.value = 1400 // Start mid-typing on the AI prompt so frame 0 is immediately rich
    }
    rafId = window.requestAnimationFrame(tick)
  }
})

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
})
</script>

<template>
  <section class="film-hero" aria-label="Interactive Product Film">
    <div class="film-stage" :class="ambientTheme">
      <!-- Subtle Breathing Obsidian Ambient Blooms (Zero Grid, Zero Checkerboard) -->
      <div class="ambient-layer" aria-hidden="true">
        <div class="bloom bloom-1" />
        <div class="bloom bloom-2" />
      </div>

      <!-- Single-Take Continuous Camera Viewport -->
      <div class="camera-viewport">
        <!-- =========================================================
             SEQUENCE A: CREATIVE AI — PROMPT BAR + CURSOR CLICK ZOOM-IN
             ========================================================= -->
        <div
          v-if="seqA.visible"
          class="camera-layer layer-a"
          :style="{ opacity: seqA.opacity, transform: `scale(${seqAZoom.toFixed(3)})` }"
        >
          <span class="seq-kicker is-indigo">CREATIVE AI</span>
          <h1 class="seq-title">
            <span class="tone-ice">DAL PROMPT</span>
            <span class="tone-gold">AL PRODOTTO.</span>
          </h1>

          <div class="prompt-shell" :class="{ 'is-triggered': seqAClicked }">
            <div class="prompt-input-area">
              <span class="prompt-sparkle" aria-hidden="true">✦</span>
              <span class="prompt-code">{{ promptTyped }}</span>
              <span class="prompt-caret" aria-hidden="true" />
            </div>

            <div class="prompt-submit" :class="{ pressed: seqAClicked }">
              <span>Genera UI</span>
              <span class="enter-key" aria-hidden="true">↵</span>
              <span v-if="seqAClicked" class="click-ripple" aria-hidden="true" />
            </div>

            <!-- Animated Vector Cursor Gliding onto "Genera UI" -->
            <svg
              class="film-cursor"
              :style="{
                transform: `translate3d(${(-110 + seqACursorMove * 110).toFixed(1)}px, ${(46 - seqACursorMove * 46).toFixed(1)}px, 0) scale(${seqAClicked ? 0.84 : 1})`,
              }"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#E2B878" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
          </div>
        </div>

        <!-- =========================================================
             SEQUENCE B: USER RESEARCH — ANALYTICS & HEATMAP FLOW NODES
             ========================================================= -->
        <div
          v-if="seqB.visible"
          class="camera-layer layer-b"
          :style="{ opacity: seqB.opacity, transform: `scale(${seqBZoom.toFixed(3)})` }"
        >
          <span class="seq-kicker is-emerald">USER RESEARCH · ERGONOMIA COGNITIVA</span>
          <h1 class="seq-title">
            <span class="tone-ice">DATI REALI.</span>
            <span class="tone-emerald">ZERO ATTRITO.</span>
          </h1>

          <!-- Live Usability Telemetry Row -->
          <div class="analytics-grid">
            <div class="glass-panel metric-card">
              <span class="metric-num is-emerald tabular-nums">-{{ metricFriction }}%</span>
              <span class="metric-lbl">Attrito Cognitivo</span>
            </div>
            <div class="glass-panel metric-card">
              <span class="metric-num is-ice tabular-nums">{{ metricTask }}%</span>
              <span class="metric-lbl">Task Completion</span>
            </div>
            <div class="glass-panel metric-card">
              <span class="metric-num is-gold tabular-nums">{{ metricSus }}/100</span>
              <span class="metric-lbl">SUS Score</span>
            </div>
          </div>

          <!-- Connected User-Flow Nodes -->
          <div class="flow-rail" aria-hidden="true">
            <div class="flow-node">
              <span class="node-pulse-dot" />
              <span>Ricerca</span>
            </div>
            <div class="flow-connector" />
            <div class="flow-node is-focus">
              <span class="node-pulse-dot is-gold" />
              <span>Architettura</span>
            </div>
            <div class="flow-connector" />
            <div class="flow-node">
              <span class="node-pulse-dot" />
              <span>Validazione</span>
            </div>
          </div>
        </div>

        <!-- =========================================================
             SEQUENCE C: UX/UI DESIGN — MINIMALIST FIGMA WORKSPACE
             ========================================================= -->
        <div
          v-if="seqC.visible"
          class="camera-layer layer-c"
          :style="{ opacity: seqC.opacity, transform: seqCTransform }"
        >
          <div class="figma-window">
            <!-- Figma Top Bar -->
            <div class="figma-topbar">
              <div class="figma-meta">
                <span class="figma-frame-icon" aria-hidden="true">#</span>
                <span class="tabular-nums">Frame 1440 · Auto Layout · 8pt Grid</span>
              </div>

              <div class="figma-present-btn" :class="{ active: figmaCodeClicked }">
                <span>Present / Code</span>
                <span aria-hidden="true">↗</span>
              </div>

              <!-- Cursor clicking Present / Code -->
              <svg
                class="figma-cursor"
                :style="{
                  transform: `translate3d(${(-95 + figmaCursorP * 95).toFixed(1)}px, ${(60 - figmaCursorP * 60).toFixed(1)}px, 0) scale(${figmaCodeClicked ? 0.85 : 1})`,
                }"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                aria-hidden="true"
              >
                <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#6366F1" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>

            <!-- Figma Canvas Interior with Selection Handles & Redlines -->
            <div class="figma-canvas">
              <div class="selection-box">
                <span class="handle h-tl" aria-hidden="true" />
                <span class="handle h-tr" aria-hidden="true" />
                <span class="handle h-bl" aria-hidden="true" />
                <span class="handle h-br" aria-hidden="true" />
                <span class="redline-badge tabular-nums" aria-hidden="true">24px</span>

                <h1 class="figma-headline">
                  <span class="tone-ice">UX/UI</span>
                  <span class="tone-gold">DESIGN</span>
                </h1>
              </div>

              <!-- Token Swatches + Wireframe-to-Dark UI Variant Toggle -->
              <div class="figma-inspector-row">
                <div class="swatch-group" aria-hidden="true">
                  <span class="tok-chip"><i style="background:#050507" />#050507</span>
                  <span class="tok-chip"><i style="background:#E2B878" />#E2B878</span>
                  <span class="tok-chip"><i style="background:#F5F5F7" />#F5F5F7</span>
                </div>

                <div class="variant-pill" :class="{ 'is-dark-ui': figmaDarkMode }">
                  <span class="vp-label">{{ figmaDarkMode ? 'High-Contrast Dark UI' : 'Wireframe Mode' }}</span>
                  <span class="vp-switch" aria-hidden="true"><span class="vp-knob" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             SEQUENCE D: MOTION & FRONT-END — LIVING PORTFOLIO & VOLTREP
             ========================================================= -->
        <div
          v-if="seqD.visible"
          class="camera-layer layer-d"
          :style="{ opacity: seqD.opacity, transform: seqDTransform }"
        >
          <span class="seq-kicker is-gold">MOTION &amp; FRONT-END · 60 FPS</span>

          <!-- Real Portfolio Elastic Sliding Pill Navbar -->
          <div class="live-navbar-pill" aria-hidden="true">
            <span class="nav-pill-thumb" :style="{ transform: `translate3d(${navPillIdx * 100}%, 0, 0)` }" />
            <span class="nav-pill-item" :class="{ active: navPillIdx === 0 }">Panoramica</span>
            <span class="nav-pill-item" :class="{ active: navPillIdx === 1 }">Case Study</span>
            <span class="nav-pill-item" :class="{ active: navPillIdx === 2 }">Percorso</span>
          </div>

          <!-- Layered Real Artifacts: Voltrep Set Tracker + Portfolio Case Study Card -->
          <div class="living-artifacts-grid">
            <!-- Real Voltrep Workout Tracker Fragment -->
            <div class="glass-panel voltrep-live-card" :class="{ 'is-done': voltrepCompleted }">
              <div class="vl-head">
                <span class="vl-brand">VOLTREP</span>
                <span class="vl-status tabular-nums" :class="{ done: voltrepCompleted }">
                  {{ voltrepCompleted ? 'Completato ✓' : 'In corso' }}
                </span>
              </div>
              <div class="vl-exercise">Panca Piana Bilanciere</div>
              <div class="vl-stats tabular-nums">
                <span class="vl-weight">82.5 kg</span>
                <span class="vl-sets">Set {{ voltrepCompleted ? '4 / 4' : '3 / 4' }}</span>
              </div>
              <div class="vl-bar-track" aria-hidden="true">
                <div class="vl-bar-fill" :style="{ width: voltrepCompleted ? '100%' : '75%' }" />
              </div>
            </div>

            <!-- Real Portfolio Case Study Card with Live Hover Lift -->
            <div class="glass-panel case-live-card" :class="{ 'is-hovered': cardHovered }">
              <span class="cl-tag">CASE STUDY · PWA</span>
              <div class="cl-title">Voltrep Fitness App</div>
              <div class="cl-meta">Vue 3 · Firebase · Zero Paywall</div>
              <div class="cl-cta">Esplora progetto →</div>

              <svg
                class="card-cursor"
                :class="{ hovering: cardHovered }"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                aria-hidden="true"
              >
                <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#E2B878" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Clean Bottom-Left Identity & CTA Anchor (Zero Chapter Numbers, Zero Player Chrome) -->
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
      </div>
    </div>
  </section>
</template>

<style scoped>
.film-hero {
  width: 100%;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.film-stage {
  position: relative;
  width: 100%;
  min-height: 94vh;
  min-height: 94svh;
  background-color: #050507;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5.25rem 0 1.75rem;
}

@media (min-width: 768px) {
  .film-stage {
    min-height: 95vh;
    padding: 5.75rem 0 2.25rem;
  }
}

/* Subtle Breathing Ambient Blooms (Zero Grid, Zero Checkerboard) */
.ambient-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bloom {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  will-change: transform, opacity;
  transition: background 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.bloom-1 {
  width: 58vw;
  height: 58vw;
  max-width: 780px;
  max-height: 780px;
  top: 8%;
  left: 20%;
  opacity: 0.095;
}

.bloom-2 {
  width: 44vw;
  height: 44vw;
  max-width: 600px;
  max-height: 600px;
  bottom: 6%;
  right: 12%;
  opacity: 0.075;
}

.ambient-ai .bloom-1 { background: radial-gradient(circle, #6366F1 0%, transparent 70%); }
.ambient-ai .bloom-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }

.ambient-research .bloom-1 { background: radial-gradient(circle, #34D399 0%, transparent 70%); transform: translate3d(-4%, 3%, 0); }
.ambient-research .bloom-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }

.ambient-figma .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); transform: translate3d(4%, -2%, 0); }
.ambient-figma .bloom-2 { background: radial-gradient(circle, #6366F1 0%, transparent 70%); }

.ambient-frontend .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-frontend .bloom-2 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }

/* Single-Take Camera Viewport */
.camera-viewport {
  position: relative;
  z-index: 2;
  flex: 1;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  padding: 1rem 1.25rem;
}

@media (min-width: 768px) {
  .camera-viewport {
    padding: 1.5rem 2.5rem;
  }
}

.camera-layer {
  grid-area: 1 / 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.25rem;
  will-change: transform, opacity;
}

/* Shared Typography */
.seq-kicker {
  display: inline-flex;
  align-items: center;
  padding: 0.34rem 0.9rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.seq-kicker.is-indigo {
  background: rgba(99, 102, 241, 0.14);
  border: 1px solid rgba(99, 102, 241, 0.42);
  color: #A5B4FC;
}

.seq-kicker.is-emerald {
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.38);
  color: #6EE7B7;
}

.seq-kicker.is-gold {
  background: rgba(226, 184, 120, 0.12);
  border: 1px solid rgba(226, 184, 120, 0.38);
  color: #E2B878;
}

.seq-title {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 0.85rem;
  font-size: clamp(2.4rem, 6.2vw, 5.4rem);
  font-weight: 800;
  letter-spacing: -0.038em;
  line-height: 0.98;
}

.tone-ice { color: #F5F5F7; }
.tone-gold { color: #E2B878; }
.tone-emerald { color: #34D399; }

.glass-panel {
  background: rgba(17, 18, 23, 0.84);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  box-shadow: 0 24px 52px -20px rgba(0, 0, 0, 0.82);
}

/* =========================================================
   SEQUENCE A: AI PROMPT COMMAND BAR
   ========================================================= */
.prompt-shell {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: min(640px, 94vw);
  padding: 0.65rem 0.7rem 0.65rem 1.15rem;
  border-radius: 18px;
  background: rgba(18, 19, 25, 0.88);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 26px 60px -20px rgba(0, 0, 0, 0.85);
  transition: border-color 300ms ease, box-shadow 300ms ease;
}

.prompt-shell.is-triggered {
  border-color: rgba(226, 184, 120, 0.65);
  box-shadow: 0 0 42px -10px rgba(226, 184, 120, 0.4);
}

.prompt-input-area {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-mono);
  font-size: clamp(0.72rem, 1.45vw, 0.86rem);
  color: #F5F5F7;
  text-align: left;
  flex: 1;
  min-width: 180px;
}

.prompt-sparkle { color: #E2B878; }

.prompt-caret {
  width: 2px;
  height: 1.05em;
  background: #E2B878;
  animation: blinkCaret 0.75s step-end infinite;
}

@keyframes blinkCaret {
  50% { opacity: 0; }
}

.prompt-submit {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: 12px;
  background: #E2B878;
  color: #050507;
  font-size: 0.78rem;
  font-weight: 700;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.prompt-submit.pressed {
  transform: scale(0.92);
}

.click-ripple {
  position: absolute;
  inset: -6px;
  border-radius: 16px;
  border: 2px solid #E2B878;
  animation: rippleOut 520ms ease-out forwards;
}

@keyframes rippleOut {
  0% { transform: scale(0.95); opacity: 0.9; }
  100% { transform: scale(1.35); opacity: 0; }
}

.film-cursor {
  position: absolute;
  right: 34px;
  bottom: -14px;
  pointer-events: none;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.65));
}

/* =========================================================
   SEQUENCE B: USER RESEARCH ANALYTICS & FLOW
   ========================================================= */
.analytics-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
}

.metric-card {
  min-width: 155px;
  padding: 0.95rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.metric-num {
  font-size: clamp(1.45rem, 2.8vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.metric-num.is-emerald { color: #34D399; }
.metric-num.is-ice { color: #F5F5F7; }
.metric-num.is-gold { color: #E2B878; }

.metric-lbl {
  font-size: 0.76rem;
  color: #A1A7B3;
}

.flow-rail {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.flow-node {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.42rem 0.85rem;
  border-radius: 999px;
  background: rgba(18, 19, 25, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.78rem;
  font-weight: 600;
  color: #D1D5DB;
}

.flow-node.is-focus {
  border-color: rgba(226, 184, 120, 0.55);
  color: #F5F5F7;
  box-shadow: 0 0 24px -6px rgba(226, 184, 120, 0.35);
}

.node-pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34D399;
}

.node-pulse-dot.is-gold { background: #E2B878; }

.flow-connector {
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, rgba(52, 211, 153, 0.5), rgba(226, 184, 120, 0.6));
}

/* =========================================================
   SEQUENCE C: FIGMA WORKSPACE
   ========================================================= */
.figma-window {
  width: min(740px, 94vw);
  border-radius: 22px;
  background: rgba(15, 16, 21, 0.9);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow: 0 32px 70px -22px rgba(0, 0, 0, 0.88);
  overflow: hidden;
}

.figma-topbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.figma-meta {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #9CA3AF;
}

.figma-frame-icon {
  color: #6366F1;
  font-weight: 700;
}

.figma-present-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.34rem 0.75rem;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.18);
  border: 1px solid rgba(99, 102, 241, 0.48);
  color: #E0E7FF;
  font-size: 0.74rem;
  font-weight: 600;
  transition: transform 200ms ease, background-color 200ms ease;
}

.figma-present-btn.active {
  background: #6366F1;
  color: #FFFFFF;
  transform: scale(0.94);
}

.figma-cursor {
  position: absolute;
  right: 28px;
  top: 22px;
  pointer-events: none;
}

.figma-canvas {
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.selection-box {
  position: relative;
  padding: 0.75rem 1.5rem;
  border: 1.5px solid #6366F1;
}

.handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #F5F5F7;
  border: 1.5px solid #6366F1;
}
.h-tl { top: -5px; left: -5px; }
.h-tr { top: -5px; right: -5px; }
.h-bl { bottom: -5px; left: -5px; }
.h-br { bottom: -5px; right: -5px; }

.redline-badge {
  position: absolute;
  top: -22px;
  right: 0;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: #6366F1;
  color: #FFFFFF;
}

.figma-headline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 0.7rem;
  font-size: clamp(2.2rem, 5.2vw, 4.1rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1;
}

.figma-inspector-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.swatch-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tok-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #D1D5DB;
}

.tok-chip i {
  width: 11px;
  height: 11px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: inline-block;
}

.variant-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.34rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.72rem;
  font-weight: 600;
  color: #D1D5DB;
  transition: border-color 300ms ease, color 300ms ease;
}

.variant-pill.is-dark-ui {
  border-color: rgba(226, 184, 120, 0.5);
  color: #E2B878;
}

.vp-switch {
  width: 30px;
  height: 17px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  padding: 2px;
  display: flex;
  align-items: center;
  transition: background-color 280ms ease;
}

.variant-pill.is-dark-ui .vp-switch {
  background: #34D399;
}

.vp-knob {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #FFFFFF;
  transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.variant-pill.is-dark-ui .vp-knob {
  transform: translate3d(13px, 0, 0);
}

/* =========================================================
   SEQUENCE D: LIVING PORTFOLIO & VOLTREP ARTIFACTS
   ========================================================= */
.live-navbar-pill {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 102px);
  padding: 4px;
  border-radius: 999px;
  background: rgba(18, 19, 25, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.nav-pill-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 102px;
  height: calc(100% - 8px);
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.2);
  border: 1px solid rgba(226, 184, 120, 0.5);
  transition: transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-pill-item {
  position: relative;
  z-index: 1;
  padding: 0.42rem 0;
  font-size: 0.76rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: color 240ms ease;
}

.nav-pill-item.active { color: #F5F5F7; }

.living-artifacts-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.voltrep-live-card,
.case-live-card {
  width: min(300px, 90vw);
  padding: 1.15rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1), border-color 320ms ease, box-shadow 320ms ease;
}

.voltrep-live-card.is-done {
  border-color: rgba(52, 211, 153, 0.5);
  box-shadow: 0 24px 52px -18px rgba(52, 211, 153, 0.22);
}

.vl-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vl-brand {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: #E2B878;
  letter-spacing: 0.06em;
}

.vl-status {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.16rem 0.52rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  color: #D1D5DB;
}

.vl-status.done {
  background: rgba(52, 211, 153, 0.16);
  color: #6EE7B7;
}

.vl-exercise {
  font-size: 0.94rem;
  font-weight: 700;
  color: #F5F5F7;
}

.vl-stats {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.vl-weight {
  font-size: 1.35rem;
  font-weight: 800;
  color: #E2B878;
}

.vl-sets {
  font-size: 0.78rem;
  color: #A1A7B3;
}

.vl-bar-track {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.vl-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #E2B878, #34D399);
  transition: width 450ms cubic-bezier(0.16, 1, 0.3, 1);
}

.case-live-card {
  position: relative;
}

.case-live-card.is-hovered {
  transform: translate3d(0, -6px, 0);
  border-color: rgba(226, 184, 120, 0.55);
  box-shadow: 0 28px 58px -18px rgba(226, 184, 120, 0.24);
}

.cl-tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  color: #9CA3AF;
}

.cl-title {
  font-size: 1rem;
  font-weight: 700;
  color: #F5F5F7;
}

.cl-meta {
  font-size: 0.78rem;
  color: #A1A7B3;
}

.cl-cta {
  margin-top: 0.3rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #E2B878;
}

.card-cursor {
  position: absolute;
  right: 18px;
  bottom: 14px;
  pointer-events: none;
  opacity: 0.7;
  transform: translate3d(18px, 14px, 0);
  transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease;
}

.card-cursor.hovering {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* =========================================================
   BOTTOM-LEFT IDENTITY & CTA ANCHOR (ZERO CHAPTER NUMBERS)
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
  align-items: flex-end;
  justify-content: flex-start;
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

@media (prefers-reduced-motion: reduce) {
  .prompt-caret,
  .click-ripple {
    animation: none !important;
  }
}
</style>
