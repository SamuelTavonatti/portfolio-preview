<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from '../../i18n/useI18n'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

const { t } = useI18n()

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)
const viewW = ref(1440)

const LOOP_SEC = 20
const LOOP_MS = LOOP_SEC * 1000

let rafId = null
let lastTs = null

const layerRef = ref(null)
const boxRef = ref(null)
const btnRef = ref(null)
const camOrigin = ref('50% 50%')

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))
const lerp = (a, b, k) => a + (b - a) * k
const easeOutExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)))
const easeInOutCubic = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}
const easeInOutQuint = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 16 * c ** 5 : 1 - Math.pow(-2 * c + 2, 5) / 2
}

const sec = computed(() => (elapsedMs.value % LOOP_MS) / 1000)

const envelope = (tm, start, end, fin = 0.6, fout = 0.7) => {
  if (tm < start || tm > end) return { visible: false, opacity: 0 }
  const enter = easeOutExpo((tm - start) / fin)
  const exit = tm > end - fout ? easeInOutCubic((tm - (end - fout)) / fout) : 0
  return { visible: true, opacity: clamp(enter * (1 - exit)) }
}

// =========================================================
// SCENE 1 — PROMPT COMPOSER (0 → 7.6s, re-enters 19.0 → 20s)
// =========================================================
const FULL_PROMPT = "Progetta un'interfaccia ad alto contrasto con ergonomia cognitiva..."

const promptState = computed(() => {
  const s = sec.value
  if (s >= 19.0) {
    return { visible: true, opacity: easeOutExpo((s - 19.0) / 0.8), tail: true }
  }
  if (s > 7.6) return { visible: false, opacity: 0, tail: false }
  const exit = s > 6.75 ? easeInOutCubic((s - 6.75) / 0.85) : 0
  return { visible: true, opacity: 1 - exit, tail: false }
})

const hovered = computed(() => !promptState.value.tail && sec.value > 0.9)
const focused = computed(() => !promptState.value.tail && sec.value >= 1.45 && sec.value < 6.8)
const typedText = computed(() => {
  if (promptState.value.tail) return ''
  const p = clamp((sec.value - 1.55) / 3.45)
  // human cadence: slightly accelerating with micro-variation
  const eased = Math.pow(p, 0.94) + Math.sin(p * 38) * 0.006 * (1 - p)
  const count = Math.floor(clamp(eased) * FULL_PROMPT.length)
  return FULL_PROMPT.slice(0, count)
})
const tokenCount = computed(() => Math.round(typedText.value.length * 1.9))
const submitReady = computed(() => typedText.value.length >= FULL_PROMPT.length - 1)
const submitPressed = computed(() => sec.value >= 6.2 && sec.value < 6.55)
const submitRipple = computed(() => sec.value >= 6.2 && sec.value < 7.1)

const camZoom = computed(() => {
  if (promptState.value.tail) return 1
  const s = sec.value
  const zIn = easeInOutCubic((s - 5.0) / 1.05) * 0.42
  const zOut = easeInOutCubic((s - 6.75) / 0.85) * 0.18
  return 1 + zIn + zOut
})

const boxW = computed(() => Math.min(680, viewW.value * 0.94))

const bez = (p0, p1, p2, k) => ({
  x: (1 - k) * (1 - k) * p0.x + 2 * (1 - k) * k * p1.x + k * k * p2.x,
  y: (1 - k) * (1 - k) * p0.y + 2 * (1 - k) * k * p1.y + k * k * p2.y,
})

const promptCursor = computed(() => {
  const s = sec.value
  const w = boxW.value
  const start = { x: -w * 0.34, y: 168 }
  const input = { x: -w * 0.16, y: 4 }
  const btn = { x: w / 2 - 46, y: 2 }
  let pos
  if (s < 1.4) {
    pos = bez(start, { x: -w * 0.34, y: 40 }, input, easeInOutCubic(s / 1.4))
  } else if (s < 5.0) {
    pos = { x: input.x + Math.sin(s * 1.3) * 3, y: input.y }
  } else {
    pos = bez(input, { x: w * 0.1, y: -30 }, btn, easeInOutCubic((s - 5.0) / 1.15))
  }
  const ibeam = s >= 1.0 && s < 5.0
  const scale = submitPressed.value ? 0.84 : 1
  return { x: pos.x, y: pos.y, ibeam, scale }
})

// =========================================================
// SCENE 2 — USER RESEARCH (6.6 → 12.0s)
// =========================================================
const research = computed(() => envelope(sec.value, 6.6, 12.0, 0.7, 0.75))
const rl = computed(() => Math.max(0, sec.value - 6.6))
const mFriction = computed(() => Math.round(easeOutExpo((rl.value - 0.55) / 1.2) * 42))
const mTask = computed(() => (easeOutExpo((rl.value - 0.6) / 1.25) * 98.4).toFixed(1))
const mSus = computed(() => Math.round(easeOutExpo((rl.value - 0.65) / 1.3) * 91))
const researchScale = computed(() => {
  const pull = 1.3 - easeOutExpo(rl.value / 0.95) * 0.3
  const out = easeInOutCubic((rl.value - 4.6) / 0.8) * 0.12
  return pull + out
})
const heatHover = computed(() => rl.value >= 2.2 && rl.value < 4.7)

// =========================================================
// SCENE 3 — FIGMA / UX-UI DESIGN (11.4 → 16.4s)
// =========================================================
const figma = computed(() => envelope(sec.value, 11.4, 16.4, 0.75, 0.75))
const fl = computed(() => Math.max(0, sec.value - 11.4))
const figmaDark = computed(() => fl.value >= 2.15)
const figmaCursorK = computed(() => easeInOutCubic((fl.value - 1.0) / 1.0))
const figmaClick = computed(() => fl.value >= 2.0 && fl.value < 2.35)
const figmaTransform = computed(() => {
  const k = fl.value
  const enter = 0.68 + easeOutExpo(k / 0.85) * 0.32
  const tilt = easeInOutCubic((k - 3.4) / 1.5)
  const scale = enter + tilt * 0.1
  return `perspective(1200px) scale(${scale.toFixed(3)}) rotateX(${(tilt * 8).toFixed(2)}deg) rotateY(${(-tilt * 11).toFixed(2)}deg)`
})

// =========================================================
// SCENE 4 — LIVING PORTFOLIO & VOLTREP (16.0 → 19.9s)
// =========================================================
const portfolio = computed(() => {
  const s = sec.value
  if (s < 16.0 || s >= 19.9) return { visible: false, opacity: 0 }
  const enter = easeOutExpo((s - 16.0) / 0.8)
  const out = easeInOutCubic((s - 18.9) / 0.9)
  return { visible: true, opacity: clamp(enter * (1 - out)) }
})
const pl = computed(() => Math.max(0, sec.value - 16.0))
const voltDone = computed(() => pl.value >= 1.7)
const navIdx = computed(() => (pl.value < 1.1 ? 0 : pl.value < 2.1 ? 1 : 2))
const caseHover = computed(() => pl.value >= 1.9 && pl.value < 3.2)
const portfolioTransform = computed(() => {
  const enter = 0.86 + easeOutExpo(pl.value / 0.85) * 0.14
  const conv = easeInOutCubic((pl.value - 2.9) / 0.9)
  return `scale(${(enter - conv * 0.55).toFixed(3)})`
})
const parallaxA = computed(() => `translate3d(0, ${(Math.sin(pl.value * 1.6) * -7).toFixed(2)}px, 0)`)
const parallaxB = computed(() => `translate3d(0, ${(Math.sin(pl.value * 1.6 + 1.4) * 9).toFixed(2)}px, 0)`)

const ambientTheme = computed(() => {
  const s = sec.value
  if (s < 6.8) return 'ambient-ai'
  if (s < 11.6) return 'ambient-research'
  if (s < 16.2) return 'ambient-figma'
  if (s < 19.0) return 'ambient-frontend'
  return 'ambient-ai'
})

const measureOrigin = () => {
  const layer = layerRef.value
  const box = boxRef.value
  const btn = btnRef.value
  if (!layer || !box || !btn || !layer.offsetHeight) return
  const x = box.offsetLeft + btn.offsetLeft + btn.offsetWidth / 2
  const y = box.offsetTop + btn.offsetTop + btn.offsetHeight / 2
  camOrigin.value = `${x}px ${y}px`
}

const onResize = () => {
  viewW.value = window.innerWidth
  nextTick(measureOrigin)
}

const tick = (ts) => {
  if (lastTs !== null && isAutoPlaying.value) {
    elapsedMs.value += ts - lastTs
  }
  lastTs = ts
  rafId = window.requestAnimationFrame(tick)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  viewW.value = window.innerWidth
  window.addEventListener('resize', onResize, { passive: true })
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isAutoPlaying.value = false
    elapsedMs.value = 17600
  } else {
    elapsedMs.value = 2600 // frame 0 already mid-typing with focus ring
  }
  nextTick(() => {
    measureOrigin()
    window.setTimeout(measureOrigin, 400)
  })
  rafId = window.requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
  if (typeof window !== 'undefined') window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="film-hero" aria-label="Interactive Product Film">
    <div class="film-stage" :class="ambientTheme">
      <div class="ambient-layer" aria-hidden="true">
        <div class="bloom bloom-1" />
        <div class="bloom bloom-2" />
      </div>

      <div class="camera-viewport">
        <!-- =========================================================
             SCENE 1: AI PROMPT COMPOSER + CURSOR + CAMERA FOLLOW-ZOOM
             ========================================================= -->
        <div
          v-show="promptState.visible"
          ref="layerRef"
          class="camera-layer layer-prompt"
          :style="{
            opacity: promptState.opacity,
            transform: `scale(${camZoom.toFixed(3)})`,
            transformOrigin: camOrigin,
          }"
        >
          <span class="seq-kicker is-indigo">CREATIVE AI</span>
          <h1 class="seq-title">
            <span class="tone-ice">DAL PROMPT</span>
            <span class="tone-gold">AL PRODOTTO.</span>
          </h1>

          <div
            ref="boxRef"
            class="prompt-box"
            :class="{ 'is-hover': hovered, 'is-focus': focused }"
          >
            <div class="prompt-top">
              <span class="model-pill"><span aria-hidden="true">✦</span> AI Design Agent</span>
              <span class="ctx-pill tabular-nums" :class="{ lit: typedText.length > 0 }">
                {{ tokenCount }} tok
              </span>
            </div>

            <div class="prompt-field">
              <span class="prompt-text">{{ typedText }}</span><span class="prompt-caret" :class="{ on: focused }" aria-hidden="true" />
              <span v-if="!typedText && !focused" class="prompt-placeholder">Descrivi l'interfaccia da progettare…</span>
            </div>

            <div class="prompt-bottom">
              <span class="attach-chip" aria-hidden="true">＋ Allega</span>
              <button
                ref="btnRef"
                type="button"
                tabindex="-1"
                class="submit-btn"
                :class="{ ready: submitReady, pressed: submitPressed }"
                aria-hidden="true"
              >
                <span aria-hidden="true">↑</span> Genera
                <span v-if="submitRipple" class="shockwave" aria-hidden="true" />
              </button>
            </div>

            <!-- High-DPI vector cursor (arrow ↔ I-beam morph) -->
            <div
              v-if="!promptState.tail"
              class="cursor-anchor"
              :style="{ transform: `translate3d(${promptCursor.x.toFixed(1)}px, ${promptCursor.y.toFixed(1)}px, 0) scale(${promptCursor.scale})` }"
              aria-hidden="true"
            >
              <svg class="cur cur-arrow" :class="{ hide: promptCursor.ibeam }" viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#F5F5F7" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
              <svg class="cur cur-ibeam" :class="{ show: promptCursor.ibeam }" viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path d="M9 4h6M9 20h6M12 4v16" stroke="#F5F5F7" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <!-- =========================================================
             SCENE 2: USER RESEARCH
             ========================================================= -->
        <div
          v-if="research.visible"
          class="camera-layer"
          :style="{ opacity: research.opacity, transform: `scale(${researchScale.toFixed(3)})` }"
        >
          <span class="seq-kicker is-emerald">ERGONOMIA COGNITIVA · UX ANALYTICS</span>
          <h1 class="seq-title is-large">
            <span class="mask-clip"><span class="mask-rise tone-ice">USER</span></span>
            <span class="mask-clip"><span class="mask-rise delay tone-emerald">RESEARCH</span></span>
          </h1>

          <div class="analytics-grid">
            <div class="glass-panel metric-card">
              <span class="metric-num is-emerald tabular-nums">-{{ mFriction }}%</span>
              <span class="metric-lbl">Attrito Cognitivo</span>
            </div>
            <div class="glass-panel metric-card">
              <span class="metric-num is-ice tabular-nums">{{ mTask }}%</span>
              <span class="metric-lbl">Task Completion</span>
            </div>
            <div class="glass-panel metric-card">
              <span class="metric-num is-gold tabular-nums">{{ mSus }}/100</span>
              <span class="metric-lbl">SUS Score</span>
            </div>
          </div>

          <div class="flow-wrap">
            <svg class="flow-svg" viewBox="0 0 520 28" preserveAspectRatio="none" aria-hidden="true">
              <path class="flow-path" d="M10 14 C 90 2, 150 26, 260 14 S 430 2, 510 14" stroke="url(#fg)" stroke-width="2" fill="none" stroke-linecap="round" />
              <defs>
                <linearGradient id="fg" x1="0" y1="0" x2="520" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#34D399" stop-opacity="0.85" />
                  <stop offset="1" stop-color="#E2B878" stop-opacity="0.85" />
                </linearGradient>
              </defs>
            </svg>
            <div class="flow-rail">
              <span class="flow-node"><i class="dot" />Ricerca</span>
              <span class="flow-node is-focus"><i class="dot gold" />Architettura</span>
              <span class="flow-node"><i class="dot" />Validazione</span>
            </div>
          </div>

          <div class="heat-row">
            <div class="heat-pill" :class="{ hover: heatHover }">
              <span class="heat-dot" aria-hidden="true" />
              Heatmap · 82% attenzione sulla CTA primaria
              <svg class="heat-cursor" :class="{ show: heatHover }" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#F5F5F7" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <!-- =========================================================
             SCENE 3: FIGMA WORKSPACE — UX/UI DESIGN
             ========================================================= -->
        <div
          v-if="figma.visible"
          class="camera-layer"
          :style="{ opacity: figma.opacity, transform: figmaTransform }"
        >
          <div class="figma-window">
            <div class="figma-topbar">
              <div class="figma-meta tabular-nums">
                <span class="figma-hash" aria-hidden="true">#</span>
                Auto Layout · 8pt Grid · WCAG AA
              </div>
              <span class="figma-tag">Frame 1440</span>
            </div>

            <div class="figma-canvas">
              <div class="selection-box">
                <span class="handle h-tl" aria-hidden="true" />
                <span class="handle h-tr" aria-hidden="true" />
                <span class="handle h-bl" aria-hidden="true" />
                <span class="handle h-br" aria-hidden="true" />
                <span class="redline r-top tabular-nums" aria-hidden="true">24</span>
                <span class="redline r-side tabular-nums" aria-hidden="true">16</span>
                <h1 class="figma-headline">
                  <span class="tone-ice">UX/UI</span>
                  <span class="tone-gold">DESIGN</span>
                </h1>
              </div>

              <div class="inspector-row">
                <div class="swatch-group" aria-hidden="true">
                  <span class="tok"><i style="background:#050507" />#050507</span>
                  <span class="tok"><i style="background:#E2B878" />#E2B878</span>
                  <span class="tok"><i style="background:#F5F5F7" />#F5F5F7</span>
                </div>

                <div class="variant-pill" :class="{ dark: figmaDark, pressed: figmaClick }">
                  <span>{{ figmaDark ? 'Polished UI' : 'Wireframe' }}</span>
                  <span class="vp-switch" aria-hidden="true"><span class="vp-knob" /></span>
                  <svg
                    class="figma-cursor"
                    :style="{ transform: `translate3d(${(-120 + figmaCursorK * 112).toFixed(1)}px, ${(64 - figmaCursorK * 56).toFixed(1)}px, 0)` }"
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
        </div>

        <!-- =========================================================
             SCENE 4: LIVING PORTFOLIO + VOLTREP — MOTION & FRONT-END
             ========================================================= -->
        <div
          v-if="portfolio.visible"
          class="camera-layer"
          :style="{ opacity: portfolio.opacity, transform: portfolioTransform }"
        >
          <h1 class="seq-title is-large">
            <span class="mask-clip"><span class="mask-rise tone-gold">MOTION &amp;</span></span>
            <span class="mask-clip"><span class="mask-rise delay tone-ice">FRONT-END</span></span>
          </h1>

          <div class="live-navbar-pill" aria-hidden="true">
            <span class="nav-thumb" :style="{ transform: `translate3d(${navIdx * 100}%, 0, 0)` }" />
            <span class="nav-item" :class="{ active: navIdx === 0 }">Panoramica</span>
            <span class="nav-item" :class="{ active: navIdx === 1 }">Case Study</span>
            <span class="nav-item" :class="{ active: navIdx === 2 }">Percorso</span>
          </div>

          <div class="artifacts-row">
            <div class="glass-panel volt-card" :class="{ done: voltDone }" :style="{ transform: parallaxA }">
              <div class="vc-head">
                <span class="vc-brand">VOLTREP</span>
                <span class="vc-badge tabular-nums" :class="{ done: voltDone }">{{ voltDone ? 'Completato ✓' : 'In corso' }}</span>
              </div>
              <div class="vc-name">Panca Piana Bilanciere</div>
              <div class="vc-stats tabular-nums">
                <span class="vc-weight">82.5 kg</span>
                <span class="vc-sets">Set {{ voltDone ? '4 / 4' : '3 / 4' }}</span>
              </div>
              <div class="vc-track" aria-hidden="true">
                <div class="vc-fill" :style="{ width: voltDone ? '100%' : '75%' }" />
              </div>
            </div>

            <div class="glass-panel case-card" :class="{ hover: caseHover }" :style="{ transform: parallaxB }">
              <span class="cc-tag">CASE STUDY · PWA</span>
              <div class="cc-title">Voltrep Fitness App</div>
              <div class="cc-meta">Vue 3 · Firebase · Zero Paywall</div>
              <div class="cc-cta">Esplora progetto →</div>
              <svg class="card-cursor" :class="{ show: caseHover }" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#E2B878" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

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
  transition: background 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  animation: breathe 9s ease-in-out infinite alternate;
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
  animation-duration: 11s;
  animation-direction: alternate-reverse;
}

@keyframes breathe {
  0% { transform: scale(0.96) translate3d(0, 0, 0); }
  100% { transform: scale(1.07) translate3d(2%, -2%, 0); }
}

.ambient-ai .bloom-1 { background: radial-gradient(circle, #6366F1 0%, transparent 70%); }
.ambient-ai .bloom-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-research .bloom-1 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }
.ambient-research .bloom-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-figma .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-figma .bloom-2 { background: radial-gradient(circle, #6366F1 0%, transparent 70%); }
.ambient-frontend .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-frontend .bloom-2 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }

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
  overflow: visible;
}

@media (min-width: 768px) {
  .camera-viewport {
    padding: 1.5rem 2.5rem;
  }
}

.camera-layer {
  position: relative;
  grid-area: 1 / 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.15rem;
  will-change: transform, opacity;
}

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

.seq-title {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.2rem 0.85rem;
  font-size: clamp(2.3rem, 5.6vw, 4.9rem);
  font-weight: 800;
  letter-spacing: -0.038em;
  line-height: 0.98;
}

.seq-title.is-large {
  font-size: clamp(3rem, 7vw, 6.5rem);
}

.tone-ice { color: #F5F5F7; }
.tone-gold { color: #E2B878; }
.tone-emerald { color: #34D399; }

.mask-clip {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.08em;
}

.mask-rise {
  display: inline-block;
  animation: maskRise 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.mask-rise.delay { animation-delay: 90ms; }

@keyframes maskRise {
  0% { opacity: 0; transform: translate3d(0, 108%, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}

.glass-panel {
  background: rgba(17, 18, 23, 0.86);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  box-shadow: 0 24px 52px -20px rgba(0, 0, 0, 0.82);
}

/* =========================================================
   PROMPT COMPOSER
   ========================================================= */
.prompt-box {
  position: relative;
  width: min(680px, 94vw);
  padding: 0.85rem 0.9rem 0.8rem 1.1rem;
  border-radius: 20px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 26px 60px -22px rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  text-align: left;
  transition:
    transform 360ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 320ms ease,
    border-color 320ms ease;
}

.prompt-box.is-hover {
  transform: translate3d(0, -2px, 0);
}

.prompt-box.is-focus {
  border-color: rgba(226, 184, 120, 0.7);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 0 2px #E2B878,
    0 20px 50px rgba(226, 184, 120, 0.15);
}

.prompt-top,
.prompt-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.model-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.12);
  border: 1px solid rgba(226, 184, 120, 0.34);
  color: #E2B878;
  font-size: 0.72rem;
  font-weight: 600;
}

.ctx-pill {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #8B92A0;
  transition: color 240ms ease, border-color 240ms ease;
}

.ctx-pill.lit {
  color: #6EE7B7;
  border-color: rgba(52, 211, 153, 0.45);
}

.prompt-field {
  position: relative;
  min-height: 3.4rem;
  font-size: clamp(0.88rem, 1.7vw, 1.02rem);
  line-height: 1.5;
  color: #F5F5F7;
  word-break: break-word;
}

.prompt-text { white-space: pre-wrap; }

.prompt-caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: #E2B878;
  opacity: 0;
}

.prompt-caret.on {
  opacity: 1;
  animation: blinkCaret 0.9s step-end infinite;
}

@keyframes blinkCaret {
  50% { opacity: 0; }
}

.prompt-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  color: #6B7280;
}

.attach-chip {
  font-size: 0.74rem;
  font-weight: 600;
  color: #8B92A0;
  padding: 0.28rem 0.6rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.submit-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: none;
  background: rgba(226, 184, 120, 0.28);
  color: rgba(5, 5, 7, 0.75);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  transition: background-color 260ms ease, color 260ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.submit-btn.ready {
  background: #E2B878;
  color: #050507;
}

.submit-btn.pressed {
  transform: scale(0.92);
}

.shockwave {
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 2px solid #E2B878;
  pointer-events: none;
  animation: shock 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shock {
  0% { transform: scale(1); opacity: 0.95; }
  100% { transform: scale(4.2); opacity: 0; }
}

.cursor-anchor {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 24px;
  height: 24px;
  margin: -4px 0 0 -4px;
  pointer-events: none;
  z-index: 5;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.7));
  will-change: transform;
}

.cur {
  position: absolute;
  inset: 0;
  transition: opacity 200ms ease, transform 200ms ease;
}

.cur-arrow.hide { opacity: 0; transform: scale(0.7); }
.cur-ibeam { opacity: 0; transform: scale(0.7); }
.cur-ibeam.show { opacity: 1; transform: scale(1); }

/* =========================================================
   RESEARCH
   ========================================================= */
.analytics-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.metric-card {
  min-width: 150px;
  padding: 0.85rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.metric-num {
  font-size: clamp(1.4rem, 2.6vw, 1.95rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.metric-num.is-emerald { color: #34D399; }
.metric-num.is-ice { color: #F5F5F7; }
.metric-num.is-gold { color: #E2B878; }

.metric-lbl {
  font-size: 0.74rem;
  color: #A1A7B3;
}

.flow-wrap {
  position: relative;
  width: min(520px, 90vw);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  pointer-events: none;
}

.flow-path {
  stroke-dasharray: 620;
  stroke-dashoffset: 620;
  animation: drawFlow 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
}

@keyframes drawFlow { to { stroke-dashoffset: 0; } }

.flow-rail {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 0.4rem;
  width: 100%;
  flex-wrap: wrap;
}

.flow-node {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.38rem 0.8rem;
  border-radius: 999px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.76rem;
  font-weight: 600;
  color: #D1D5DB;
}

.flow-node.is-focus {
  border-color: rgba(226, 184, 120, 0.55);
  color: #F5F5F7;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34D399;
}

.dot.gold { background: #E2B878; }

.heat-row {
  display: flex;
  justify-content: center;
}

.heat-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  background: rgba(17, 18, 23, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.78rem;
  font-weight: 600;
  color: #E5E7EB;
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), border-color 320ms ease, box-shadow 320ms ease;
}

.heat-pill.hover {
  transform: translate3d(0, -3px, 0);
  border-color: rgba(226, 184, 120, 0.6);
  box-shadow: 0 16px 36px -14px rgba(226, 184, 120, 0.3);
}

.heat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F97316;
  box-shadow: 0 0 12px 2px rgba(249, 115, 22, 0.6);
}

.heat-cursor {
  position: absolute;
  right: -8px;
  bottom: -14px;
  opacity: 0;
  transform: translate3d(16px, 12px, 0);
  transition: opacity 260ms ease, transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.7));
}

.heat-cursor.show {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* =========================================================
   FIGMA
   ========================================================= */
.figma-window {
  width: min(740px, 94vw);
  border-radius: 22px;
  background: rgba(15, 16, 21, 0.92);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow: 0 32px 70px -22px rgba(0, 0, 0, 0.88);
}

.figma-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.7rem 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.figma-meta {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: #9CA3AF;
}

.figma-hash { color: #818CF8; font-weight: 700; margin-right: 0.3rem; }

.figma-tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.16);
  color: #C7D2FE;
}

.figma-canvas {
  padding: 2.1rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.selection-box {
  position: relative;
  padding: 0.7rem 1.5rem;
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

.redline {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  font-weight: 700;
  padding: 0.08rem 0.38rem;
  border-radius: 4px;
  background: #F43F5E;
  color: #FFFFFF;
}
.r-top { top: -24px; left: 50%; transform: translateX(-50%); }
.r-side { left: -30px; top: 50%; transform: translateY(-50%); }

.figma-headline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.2rem 0.7rem;
  font-size: clamp(2.3rem, 5.4vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1;
}

.inspector-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.swatch-group { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.tok {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.58rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: #D1D5DB;
}

.tok i {
  width: 11px;
  height: 11px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: inline-block;
}

.variant-pill {
  position: relative;
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
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 300ms ease, color 300ms ease;
}

.variant-pill.pressed { transform: scale(0.94); }
.variant-pill.dark { border-color: rgba(226, 184, 120, 0.55); color: #E2B878; }

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

.variant-pill.dark .vp-switch { background: #34D399; }

.vp-knob {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #FFFFFF;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.variant-pill.dark .vp-knob { transform: translate3d(13px, 0, 0); }

.figma-cursor {
  position: absolute;
  right: -6px;
  bottom: -14px;
  pointer-events: none;
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.7));
}

/* =========================================================
   LIVING PORTFOLIO
   ========================================================= */
.live-navbar-pill {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 100px);
  padding: 4px;
  border-radius: 999px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.nav-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 100px;
  height: calc(100% - 8px);
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.2);
  border: 1px solid rgba(226, 184, 120, 0.5);
  transition: transform 460ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item {
  position: relative;
  z-index: 1;
  padding: 0.42rem 0;
  font-size: 0.76rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: color 240ms ease;
}

.nav-item.active { color: #F5F5F7; }

.artifacts-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  width: 100%;
}

.volt-card,
.case-card {
  position: relative;
  width: min(300px, 90vw);
  padding: 1.1rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 320ms ease, box-shadow 320ms ease;
}

.volt-card.done {
  border-color: rgba(52, 211, 153, 0.55);
  box-shadow: 0 24px 52px -18px rgba(52, 211, 153, 0.25);
}

.vc-head { display: flex; justify-content: space-between; align-items: center; }

.vc-brand {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: #E2B878;
  letter-spacing: 0.06em;
}

.vc-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.16rem 0.52rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  color: #D1D5DB;
}

.vc-badge.done { background: rgba(52, 211, 153, 0.18); color: #6EE7B7; }

.vc-name { font-size: 0.94rem; font-weight: 700; color: #F5F5F7; }

.vc-stats { display: flex; align-items: baseline; justify-content: space-between; }
.vc-weight { font-size: 1.35rem; font-weight: 800; color: #E2B878; }
.vc-sets { font-size: 0.78rem; color: #A1A7B3; }

.vc-track {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.vc-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #E2B878, #34D399);
  transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

.case-card.hover {
  border-color: rgba(226, 184, 120, 0.6);
  box-shadow: 0 28px 58px -18px rgba(226, 184, 120, 0.26);
}

.cc-tag { font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700; color: #9CA3AF; }
.cc-title { font-size: 1rem; font-weight: 700; color: #F5F5F7; }
.cc-meta { font-size: 0.78rem; color: #A1A7B3; }
.cc-cta { margin-top: 0.25rem; font-size: 0.8rem; font-weight: 700; color: #E2B878; }

.card-cursor {
  position: absolute;
  right: 16px;
  bottom: 12px;
  opacity: 0;
  transform: translate3d(22px, 16px, 0);
  transition: opacity 280ms ease, transform 480ms cubic-bezier(0.16, 1, 0.3, 1);
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.7));
  pointer-events: none;
}

.card-cursor.show {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* =========================================================
   LOWER-LEFT IDENTITY & CTA
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
  .hud-container { padding: 0 2.5rem; }
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

.identity-name { font-weight: 700; color: #F5F5F7; }
.identity-sep { display: none; color: #6B7280; }

@media (min-width: 520px) {
  .identity-line { flex-direction: row; align-items: center; gap: 0.45rem; }
  .identity-sep { display: inline; }
}

.identity-role { color: #A1A7B3; }

.hero-ctas { display: flex; flex-wrap: wrap; gap: 0.6rem; }

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
  .bloom,
  .prompt-caret.on,
  .mask-rise,
  .flow-path,
  .shockwave {
    animation: none !important;
    stroke-dashoffset: 0 !important;
  }
}
</style>
