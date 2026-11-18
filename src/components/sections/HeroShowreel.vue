<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

// 16.0s unbroken single-take product launch film
// PART 01: 0.0s – 4.0s (CREATIVE AI & THE PROMPT BOX)
// PART 02: 4.0s – 8.0s (USER RESEARCH & COGNITIVE TELEMETRY)
// PART 03: 8.0s – 12.0s (UX/UI DESIGN & FIGMA WORKSPACE)
// PART 04: 12.0s – 16.0s (MOTION & FRONT-END — LIVING PORTFOLIO & VOLTREP)

const LOOP_SEC = 16
const LOOP_MS = LOOP_SEC * 1000

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)
const viewW = ref(1440)

let rafId = null
let lastTs = null

const layerRef = ref(null)
const boxRef = ref(null)
const btnRef = ref(null)
const camOrigin = ref('78% 66%')

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))
const lerp = (a, b, k) => a + (b - a) * k
const easeOutExpo = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * clamp(x)))
const easeInOutCubic = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

const sec = computed(() => (elapsedMs.value % LOOP_MS) / 1000)

// =========================================================
// PART 01 (0.0s – 4.0s, re-emerges 15.2s – 16.0s)
// CREATIVE AI & THE PROMPT BOX
// =========================================================
const FULL_PROMPT = 'Design a high-contrast workout tracker with cognitive ergonomics...'

const promptState = computed(() => {
  const s = sec.value
  // Infinite loop reset tail (15.2s -> 16.0s): Voltrep card folds back into the Prompt Composer
  if (s >= 15.2) {
    const k = easeOutExpo((s - 15.2) / 0.8)
    return {
      visible: true,
      opacity: k,
      scale: lerp(0.84, 1, k),
      tail: true,
    }
  }
  if (s > 4.45) return { visible: false, opacity: 0, scale: 1, tail: false }
  const exit = s > 3.7 ? easeInOutCubic((s - 3.7) / 0.75) : 0
  return { visible: true, opacity: 1 - exit, scale: 1, tail: false }
})

const hovered = computed(() => !promptState.value.tail && sec.value > 0.35)
const focused = computed(() => !promptState.value.tail && sec.value >= 0.55 && sec.value < 3.9)

const typedText = computed(() => {
  if (promptState.value.tail) return ''
  const p = clamp((sec.value - 0.6) / 2.25)
  const eased = Math.pow(p, 0.94) + Math.sin(p * 36) * 0.005 * (1 - p)
  const count = Math.floor(clamp(eased) * FULL_PROMPT.length)
  return FULL_PROMPT.slice(0, count)
})

const tokenCount = computed(() => Math.round(typedText.value.length * 1.9))
const submitReady = computed(() => typedText.value.length >= FULL_PROMPT.length - 1)
const submitPressed = computed(() => sec.value >= 3.35 && sec.value < 3.65)
const submitRipple = computed(() => sec.value >= 3.35 && sec.value < 4.25)

// Screen-Studio camera zoom locked onto ↑ Generate button (scale 1.35)
const camZoom = computed(() => {
  if (promptState.value.tail) return promptState.value.scale
  const s = sec.value
  const zIn = easeInOutCubic((s - 2.85) / 0.7) * 0.35
  const zCarry = easeInOutCubic((s - 3.65) / 0.75) * 0.22
  return 1 + zIn + zCarry
})

const boxW = computed(() => Math.min(660, viewW.value * 0.9))

const bez = (p0, p1, p2, k) => ({
  x: (1 - k) * (1 - k) * p0.x + 2 * (1 - k) * k * p1.x + k * k * p2.x,
  y: (1 - k) * (1 - k) * p0.y + 2 * (1 - k) * k * p1.y + k * k * p2.y,
})

const promptCursor = computed(() => {
  const s = sec.value
  const w = boxW.value
  const start = { x: -w * 0.32, y: 120 }
  const input = { x: -w * 0.14, y: 4 }
  const btn = { x: w / 2 - 58, y: 38 }
  let pos
  if (s < 0.55) {
    pos = bez(start, { x: -w * 0.32, y: 24 }, input, easeInOutCubic(s / 0.55))
  } else if (s < 2.85) {
    pos = { x: input.x + Math.sin(s * 1.8) * 3, y: input.y }
  } else {
    pos = bez(input, { x: w * 0.12, y: -22 }, btn, easeInOutCubic((s - 2.85) / 0.5))
  }
  const ibeam = s >= 0.5 && s < 2.85
  const scale = submitPressed.value ? 0.84 : 1
  return { x: pos.x, y: pos.y, ibeam, scale }
})

// =========================================================
// PART 02 (4.0s – 8.0s)
// USER RESEARCH & COGNITIVE TELEMETRY
// Expanding ripple morphs into USER RESEARCH // COGNITIVE ERGONOMICS
// One validated metric card scales up & transforms border into Figma vector bounding box
// =========================================================
const researchState = computed(() => {
  const s = sec.value
  if (s < 3.65 || s > 8.45) return { visible: false, opacity: 0, transform: 'scale(1)' }
  const enter = easeOutExpo((s - 3.65) / 0.65)
  const exit = s > 7.65 ? easeInOutCubic((s - 7.65) / 0.8) : 0
  // Pull back from button ripple zoom into stage, then scale up validated card into Figma frame
  const pullScale = 1.24 - easeOutExpo((s - 3.65) / 0.75) * 0.24
  const bridgeScale = easeInOutCubic((s - 7.35) / 0.85) * 0.26
  const scale = pullScale + bridgeScale
  return {
    visible: true,
    opacity: clamp(enter * (1 - exit)),
    transform: `scale(${scale.toFixed(3)})`,
  }
})

const rl = computed(() => Math.max(0, sec.value - 3.85))
const mFriction = computed(() => Math.round(easeOutExpo((rl.value - 0.25) / 1.05) * 42))
const mTask = computed(() => (easeOutExpo((rl.value - 0.3) / 1.1) * 98.4).toFixed(1))
const mSus = computed(() => Math.round(easeOutExpo((rl.value - 0.35) / 1.15) * 91))
const heatHover = computed(() => rl.value >= 1.5 && rl.value < 3.4)
const figmaBridgeMorph = computed(() => sec.value >= 6.85 && sec.value <= 8.45)

// =========================================================
// PART 03 (8.0s – 12.0s)
// UX/UI DESIGN & FIGMA WORKSPACE
// Bounding box locks into Figma Design Canvas; cursor toggles wireframe -> polished UI;
// Frame tilts into 3D perspective(1200px) rotateY(-8deg) rotateX(4deg) and glides forward
// =========================================================
const figmaState = computed(() => {
  const s = sec.value
  if (s < 7.65 || s > 12.45) return { visible: false, opacity: 0, transform: 'none' }
  const enter = easeOutExpo((s - 7.65) / 0.65)
  const exit = s > 11.65 ? easeInOutCubic((s - 11.65) / 0.8) : 0
  const fl = Math.max(0, s - 7.65)
  const scaleIn = 0.78 + easeOutExpo(fl / 0.7) * 0.22
  const tilt = easeInOutCubic((s - 10.6) / 1.1)
  const swipeX = easeInOutCubic((s - 11.55) / 0.85) * -140
  const scale = scaleIn + tilt * 0.06
  const rx = (tilt * 4).toFixed(2)
  const ry = (-tilt * 8).toFixed(2)
  return {
    visible: true,
    opacity: clamp(enter * (1 - exit)),
    transform: `perspective(1200px) translate3d(${swipeX.toFixed(1)}px, 0, 0) scale(${scale.toFixed(3)}) rotateY(${ry}deg) rotateX(${rx}deg)`,
  }
})

const fl = computed(() => Math.max(0, sec.value - 7.85))
const figmaDark = computed(() => fl.value >= 1.65)
const figmaCursorK = computed(() => easeInOutCubic((fl.value - 0.65) / 0.9))
const figmaClick = computed(() => fl.value >= 1.5 && fl.value < 1.85)

// =========================================================
// PART 04 (12.0s – 16.0s)
// MOTION & FRONT-END (Living Portfolio & Voltrep)
// 3D frame slides horizontally like an Apple swipe gesture;
// Foreground Voltrep card converges & folds back into the AI Prompt Composer
// =========================================================
const portfolioState = computed(() => {
  const s = sec.value
  if (s < 11.65) return { visible: false, opacity: 0, transform: 'none' }
  const enter = easeOutExpo((s - 11.65) / 0.65)
  const foldK = easeInOutCubic((s - 15.05) / 0.85)
  const slideInX = (1 - easeOutExpo((s - 11.65) / 0.75)) * 130
  const scale = lerp(1, 0.76, foldK)
  return {
    visible: true,
    opacity: clamp(enter * (1 - foldK)),
    transform: `translate3d(${slideInX.toFixed(1)}px, 0, 0) scale(${scale.toFixed(3)})`,
    foldK,
  }
})

const pl = computed(() => Math.max(0, sec.value - 11.85))
const voltDone = computed(() => pl.value >= 1.45)
const navIdx = computed(() => (pl.value < 0.95 ? 0 : pl.value < 1.9 ? 1 : 2))
const caseHover = computed(() => pl.value >= 1.6 && pl.value < 3.1)
const parallaxA = computed(() => {
  const fold = portfolioState.value.foldK || 0
  const y = Math.sin(pl.value * 1.8) * -6 * (1 - fold)
  const x = fold * 90
  return `translate3d(${x.toFixed(1)}px, ${y.toFixed(2)}px, 0)`
})
const parallaxB = computed(() => {
  const fold = portfolioState.value.foldK || 0
  const y = Math.sin(pl.value * 1.8 + 1.4) * 7 * (1 - fold)
  const x = fold * -90
  return `translate3d(${x.toFixed(1)}px, ${y.toFixed(2)}px, 0)`
})

const ambientTheme = computed(() => {
  const s = sec.value
  if (s < 3.9) return 'ambient-ai'
  if (s < 7.9) return 'ambient-research'
  if (s < 11.9) return 'ambient-figma'
  if (s < 15.2) return 'ambient-frontend'
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
  const params = new URLSearchParams(window.location.search)
  const tParam = params.get('t')
  if (tParam !== null && !Number.isNaN(Number(tParam))) {
    isAutoPlaying.value = false
    elapsedMs.value = Number(tParam) * 1000
  } else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isAutoPlaying.value = false
    elapsedMs.value = 13600
  } else {
    elapsedMs.value = 1850 // starts mid-typing with champagne-gold focus ring active
  }
  nextTick(() => {
    measureOrigin()
    window.setTimeout(measureOrigin, 350)
  })
  rafId = window.requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
  if (typeof window !== 'undefined') window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="film-hero" aria-label="Product Launch Showreel">
    <div class="film-stage" :class="ambientTheme">
      <div class="ambient-layer" aria-hidden="true">
        <div class="bloom bloom-1" />
        <div class="bloom bloom-2" />
      </div>

      <div class="camera-viewport">
        <!-- =========================================================
             PART 01 (0.0s – 4.0s) — CREATIVE AI & THE PROMPT BOX
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
          <span class="seq-kicker is-indigo">CREATIVE AI // GENERATIVE UI</span>
          <h1 class="seq-title">
            <span class="tone-ice">FROM PROMPT</span>
            <span class="tone-gold">TO PRODUCT.</span>
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
              <span v-if="!typedText && !focused" class="prompt-placeholder">Describe a high-contrast product interface…</span>
            </div>

            <div class="prompt-bottom">
              <span class="attach-chip" aria-hidden="true">＋ Context · WCAG AA</span>
              <button
                ref="btnRef"
                type="button"
                tabindex="-1"
                class="submit-btn"
                :class="{ ready: submitReady, pressed: submitPressed }"
                aria-hidden="true"
              >
                <span aria-hidden="true">↑</span> Generate
                <span v-if="submitRipple" class="shockwave" aria-hidden="true" />
              </button>
            </div>

            <!-- High-DPI Screen-Studio vector cursor -->
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
             PART 02 (4.0s – 8.0s) — USER RESEARCH & COGNITIVE TELEMETRY
             ========================================================= -->
        <div
          v-if="researchState.visible"
          class="camera-layer"
          :style="{ opacity: researchState.opacity, transform: researchState.transform }"
        >
          <span class="seq-kicker is-emerald">USER RESEARCH // COGNITIVE ERGONOMICS</span>
          <h1 class="seq-title is-large">
            <span class="mask-clip"><span class="mask-rise tone-ice">USER</span></span>
            <span class="mask-clip"><span class="mask-rise delay tone-emerald">RESEARCH</span></span>
          </h1>

          <div class="analytics-grid">
            <div class="glass-panel metric-card">
              <span class="metric-num is-emerald tabular-nums">-{{ mFriction }}%</span>
              <span class="metric-lbl">Cognitive Friction</span>
            </div>
            <div class="glass-panel metric-card" :class="{ 'is-bounding-morph': figmaBridgeMorph }">
              <span v-if="figmaBridgeMorph" class="handle h-tl" aria-hidden="true" />
              <span v-if="figmaBridgeMorph" class="handle h-tr" aria-hidden="true" />
              <span v-if="figmaBridgeMorph" class="handle h-bl" aria-hidden="true" />
              <span v-if="figmaBridgeMorph" class="handle h-br" aria-hidden="true" />
              <span class="metric-num is-ice tabular-nums">{{ mTask }}%</span>
              <span class="metric-lbl">Task Completion</span>
            </div>
            <div class="glass-panel metric-card">
              <span class="metric-num is-gold tabular-nums">SUS {{ mSus }}/100</span>
              <span class="metric-lbl">SUS Score 91/100</span>
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
              <span class="flow-node"><i class="dot" />Discovery</span>
              <span class="flow-node is-focus"><i class="dot gold" />Information Architecture</span>
              <span class="flow-node"><i class="dot" />Heuristic Validated ✓</span>
            </div>
          </div>

          <div class="heat-row">
            <div class="heat-pill" :class="{ hover: heatHover }">
              <span class="heat-dot" aria-hidden="true" />
              Attention Telemetry · 82% Fixation on Primary Action
              <svg class="heat-cursor" :class="{ show: heatHover }" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#F5F5F7" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <!-- =========================================================
             PART 03 (8.0s – 12.0s) — UX/UI DESIGN & FIGMA WORKSPACE
             ========================================================= -->
        <div
          v-if="figmaState.visible"
          class="camera-layer"
          :style="{ opacity: figmaState.opacity, transform: figmaState.transform }"
        >
          <div class="figma-window">
            <div class="figma-topbar">
              <div class="figma-meta tabular-nums">
                <span class="figma-hash" aria-hidden="true">#</span>
                Auto Layout · 8pt Grid · WCAG AA
              </div>
              <span class="figma-tag">Figma Canvas · 1440</span>
            </div>

            <div class="figma-canvas">
              <div class="selection-box" :class="{ 'is-polished': figmaDark }">
                <span class="handle h-tl" aria-hidden="true" />
                <span class="handle h-tr" aria-hidden="true" />
                <span class="handle h-bl" aria-hidden="true" />
                <span class="handle h-br" aria-hidden="true" />
                <span class="redline r-top tabular-nums" aria-hidden="true">24px</span>
                <span class="redline r-side tabular-nums" aria-hidden="true">16px</span>
                <h1 class="figma-headline">
                  <span class="tone-ice">UX/UI</span>
                  <span class="tone-gold">DESIGN</span>
                </h1>
                <div class="component-preview" :class="{ 'is-polished': figmaDark }">
                  <div class="cp-wire-bar" />
                  <div class="cp-pill">{{ figmaDark ? 'Active Set · 82.5 kg × 8' : 'Wireframe Component' }}</div>
                </div>
              </div>

              <div class="inspector-row">
                <div class="swatch-group" aria-hidden="true">
                  <span class="tok"><i style="background:#050507" />#050507</span>
                  <span class="tok"><i style="background:#E2B878" />#E2B878</span>
                  <span class="tok"><i style="background:#F5F5F7" />#F5F5F7</span>
                </div>

                <div class="variant-pill" :class="{ dark: figmaDark, pressed: figmaClick }">
                  <span>{{ figmaDark ? 'Polished Dark UI' : 'Lo-Fi Wireframe' }}</span>
                  <span class="vp-switch" aria-hidden="true"><span class="vp-knob" /></span>
                  <svg
                    class="figma-cursor"
                    :style="{ transform: `translate3d(${(-112 + figmaCursorK * 106).toFixed(1)}px, ${(54 - figmaCursorK * 48).toFixed(1)}px, 0)` }"
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
             PART 04 (12.0s – 16.0s) — MOTION & FRONT-END (Living Portfolio & Voltrep)
             ========================================================= -->
        <div
          v-if="portfolioState.visible"
          class="camera-layer"
          :style="{ opacity: portfolioState.opacity, transform: portfolioState.transform }"
        >
          <span class="seq-kicker is-gold">60FPS WEB ANIMATIONS // VUE 3 ARCHITECTURE</span>
          <h1 class="seq-title is-large">
            <span class="mask-clip"><span class="mask-rise tone-gold">MOTION &amp;</span></span>
            <span class="mask-clip"><span class="mask-rise delay tone-ice">FRONT-END</span></span>
          </h1>

          <div class="live-navbar-pill" aria-hidden="true">
            <span class="nav-thumb" :style="{ transform: `translate3d(${navIdx * 100}%, 0, 0)` }" />
            <span class="nav-item" :class="{ active: navIdx === 0 }">Overview</span>
            <span class="nav-item" :class="{ active: navIdx === 1 }">Case Studies</span>
            <span class="nav-item" :class="{ active: navIdx === 2 }">Journey</span>
          </div>

          <div class="artifacts-row">
            <div class="glass-panel volt-card" :class="{ done: voltDone }" :style="{ transform: parallaxA }">
              <div class="vc-head">
                <span class="vc-brand">VOLTREP · LIVE PWA</span>
                <span class="vc-badge tabular-nums" :class="{ done: voltDone }">{{ voltDone ? 'Set Completed ✓' : 'Active Set' }}</span>
              </div>
              <div class="vc-name">Barbell Bench Press</div>
              <div class="vc-stats tabular-nums">
                <span class="vc-weight">82.5 kg × 8</span>
                <span class="vc-sets">Set {{ voltDone ? '4 / 4' : '3 / 4' }}</span>
              </div>
              <div class="vc-track" aria-hidden="true">
                <div class="vc-fill" :style="{ width: voltDone ? '100%' : '75%' }" />
              </div>
            </div>

            <div class="glass-panel case-card" :class="{ hover: caseHover }" :style="{ transform: parallaxB }">
              <span class="cc-tag">CASE STUDY · PRODUCT DESIGN</span>
              <div class="cc-title">Voltrep Workout Tracker</div>
              <div class="cc-meta">Vue 3 · Cognitive Ergonomics · Zero Paywall</div>
              <div class="cc-cta">Explore Case Study →</div>
              <svg class="card-cursor" :class="{ show: caseHover }" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#E2B878" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Lower-left identity & CTA anchor (strictly English as requested) -->
      <div class="hud-container stage-footer">
        <div class="identity-cta-block">
          <div class="identity-line">
            <span class="identity-name">Samuel Tavonatti</span>
            <span class="identity-sep" aria-hidden="true">—</span>
            <span class="identity-role">UI/UX Designer &amp; Front-End</span>
          </div>

          <div class="hero-ctas">
            <BaseButton to="/progetti" variant="primary" class="cta-gold">
              <span>Explore Case Studies</span>
              <AppIcon name="arrow-right" :size="15" />
            </BaseButton>
            <BaseButton :to="{ path: '/', hash: '#contatti' }" variant="secondary" class="cta-glass">
              <span>Contact Me</span>
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
  padding: 4.85rem 0 1.5rem;
}

@media (min-width: 768px) {
  .film-stage {
    min-height: 94vh;
    padding: 5.5rem 0 2.15rem;
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
  opacity: 0.09;
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

.ambient-ai .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .bloom-2 { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }
.ambient-research .bloom-1 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }
.ambient-research .bloom-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-figma .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-figma .bloom-2 { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }
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
  padding: 0.75rem 1.25rem;
  overflow: visible;
}

@media (min-width: 768px) {
  .camera-viewport {
    padding: 1.25rem 2.5rem;
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
  gap: 0.95rem;
  will-change: transform, opacity;
}

@media (min-width: 768px) {
  .camera-layer {
    gap: 1.15rem;
  }
}

.seq-kicker {
  display: inline-flex;
  align-items: center;
  padding: 0.32rem 0.85rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.seq-kicker.is-indigo {
  background: rgba(226, 184, 120, 0.12);
  border: 1px solid rgba(226, 184, 120, 0.38);
  color: #E2B878;
}

.seq-kicker.is-emerald {
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.38);
  color: #6EE7B7;
}

.seq-kicker.is-gold {
  background: rgba(226, 184, 120, 0.13);
  border: 1px solid rgba(226, 184, 120, 0.4);
  color: #E2B878;
}

.seq-title {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.2rem 0.75rem;
  font-size: clamp(2.1rem, 5.4vw, 4.7rem);
  font-weight: 800;
  letter-spacing: -0.038em;
  line-height: 0.98;
}

.seq-title.is-large {
  font-size: clamp(2.45rem, 6.6vw, 6.1rem);
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
  animation: maskRise 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.mask-rise.delay { animation-delay: 80ms; }

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
   PART 01: PROMPT COMPOSER
   ========================================================= */
.prompt-box {
  position: relative;
  width: min(660px, calc(100vw - 2.5rem));
  padding: 0.85rem 0.95rem 0.8rem 1.05rem;
  border-radius: 18px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 26px 60px -22px rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  text-align: left;
  transition:
    transform 340ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 300ms ease,
    border-color 300ms ease;
}

.prompt-box.is-hover {
  transform: translate3d(0, -2px, 0);
}

.prompt-box.is-focus {
  border-color: rgba(226, 184, 120, 0.72);
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
  padding: 0.22rem 0.62rem;
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
  min-height: 3.1rem;
  font-size: clamp(0.86rem, 1.65vw, 1.02rem);
  line-height: 1.48;
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
  font-size: 0.72rem;
  font-weight: 600;
  color: #8B92A0;
  padding: 0.26rem 0.58rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.submit-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.48rem 0.95rem;
  border-radius: 999px;
  border: none;
  background: rgba(226, 184, 120, 0.28);
  color: rgba(5, 5, 7, 0.75);
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  transition: background-color 240ms ease, color 240ms ease, transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
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
  animation: shock 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shock {
  0% { transform: scale(1); opacity: 0.95; }
  100% { transform: scale(4.4); opacity: 0; }
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
  transition: opacity 180ms ease, transform 180ms ease;
}

.cur-arrow.hide { opacity: 0; transform: scale(0.7); }
.cur-ibeam { opacity: 0; transform: scale(0.7); }
.cur-ibeam.show { opacity: 1; transform: scale(1); }

/* =========================================================
   PART 02: USER RESEARCH & COGNITIVE TELEMETRY
   ========================================================= */
.analytics-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
}

.metric-card {
  position: relative;
  min-width: 138px;
  padding: 0.75rem 1.05rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1), border-color 320ms ease, border-radius 320ms ease;
}

.metric-card.is-bounding-morph {
  border: 1.5px solid #6366F1;
  border-radius: 6px;
  transform: scale(1.08);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
}

.metric-num {
  font-size: clamp(1.25rem, 2.5vw, 1.85rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.metric-num.is-emerald { color: #34D399; }
.metric-num.is-ice { color: #F5F5F7; }
.metric-num.is-gold { color: #E2B878; }

.metric-lbl {
  font-size: 0.72rem;
  color: #A1A7B3;
}

.flow-wrap {
  position: relative;
  width: min(540px, calc(100vw - 2.5rem));
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flow-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.75;
  pointer-events: none;
}

.flow-path {
  stroke-dasharray: 620;
  stroke-dashoffset: 620;
  animation: drawFlow 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
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
  gap: 0.38rem;
  padding: 0.34rem 0.72rem;
  border-radius: 999px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.73rem;
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
  padding: 0.42rem 0.9rem;
  border-radius: 999px;
  background: rgba(17, 18, 23, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.75rem;
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
  transition: opacity 240ms ease, transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.7));
}

.heat-cursor.show {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* =========================================================
   PART 03: UX/UI DESIGN & FIGMA WORKSPACE
   ========================================================= */
.figma-window {
  width: min(720px, calc(100vw - 2.5rem));
  border-radius: 20px;
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
  padding: 0.65rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.figma-meta {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #9CA3AF;
}

.figma-hash { color: #818CF8; font-weight: 700; margin-right: 0.3rem; }

.figma-tag {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  padding: 0.18rem 0.52rem;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.16);
  color: #C7D2FE;
}

.figma-canvas {
  padding: 1.75rem 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.selection-box {
  position: relative;
  padding: 0.75rem 1.35rem 0.85rem;
  border: 1.5px dashed rgba(99, 102, 241, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  transition: border-color 300ms ease, background-color 300ms ease;
}

.selection-box.is-polished {
  border-style: solid;
  border-color: #E2B878;
  background: rgba(226, 184, 120, 0.04);
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
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.08rem 0.36rem;
  border-radius: 4px;
  background: #F43F5E;
  color: #FFFFFF;
}
.r-top { top: -22px; left: 50%; transform: translateX(-50%); }
.r-side { left: -34px; top: 50%; transform: translateY(-50%); }

@media (max-width: 480px) {
  .r-side { left: -24px; }
}

.figma-headline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.2rem 0.65rem;
  font-size: clamp(2.1rem, 5.2vw, 3.9rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1;
}

.component-preview {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.38rem 0.75rem;
  border-radius: 10px;
  border: 1px dashed rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.74rem;
  color: #9CA3AF;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.component-preview.is-polished {
  border-style: solid;
  border-color: rgba(52, 211, 153, 0.5);
  background: rgba(14, 16, 21, 0.95);
  color: #F5F5F7;
  box-shadow: 0 10px 24px -10px rgba(52, 211, 153, 0.35);
}

.cp-wire-bar {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
}

.component-preview.is-polished .cp-wire-bar {
  background: #34D399;
  box-shadow: 0 0 8px #34D399;
}

.inspector-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
}

.swatch-group { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.38rem; }

.tok {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  padding: 0.26rem 0.54rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  font-family: var(--font-mono);
  font-size: 0.65rem;
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
  gap: 0.55rem;
  padding: 0.32rem 0.68rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.72rem;
  font-weight: 600;
  color: #D1D5DB;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 280ms ease, color 280ms ease;
}

.variant-pill.pressed { transform: scale(0.93); }
.variant-pill.dark { border-color: rgba(226, 184, 120, 0.55); color: #E2B878; }

.vp-switch {
  width: 30px;
  height: 17px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  padding: 2px;
  display: flex;
  align-items: center;
  transition: background-color 260ms ease;
}

.variant-pill.dark .vp-switch { background: #34D399; }

.vp-knob {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #FFFFFF;
  transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
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
   PART 04: LIVING PORTFOLIO & VOLTREP
   ========================================================= */
.live-navbar-pill {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 98px);
  padding: 4px;
  border-radius: 999px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.nav-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 98px;
  height: calc(100% - 8px);
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.2);
  border: 1px solid rgba(226, 184, 120, 0.5);
  transition: transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item {
  position: relative;
  z-index: 1;
  padding: 0.38rem 0;
  font-size: 0.74rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: color 220ms ease;
}

.nav-item.active { color: #F5F5F7; }

.artifacts-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
  width: 100%;
}

.volt-card,
.case-card {
  position: relative;
  width: min(295px, calc(100vw - 2.5rem));
  padding: 0.95rem 1.05rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  transition: border-color 300ms ease, box-shadow 300ms ease;
}

.volt-card.done {
  border-color: rgba(52, 211, 153, 0.55);
  box-shadow: 0 24px 52px -18px rgba(52, 211, 153, 0.25);
}

.vc-head { display: flex; justify-content: space-between; align-items: center; }

.vc-brand {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  color: #E2B878;
  letter-spacing: 0.06em;
}

.vc-badge {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  color: #D1D5DB;
}

.vc-badge.done { background: rgba(52, 211, 153, 0.18); color: #6EE7B7; }

.vc-name { font-size: 0.92rem; font-weight: 700; color: #F5F5F7; }

.vc-stats { display: flex; align-items: baseline; justify-content: space-between; }
.vc-weight { font-size: 1.25rem; font-weight: 800; color: #E2B878; }
.vc-sets { font-size: 0.76rem; color: #A1A7B3; }

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
  transition: width 460ms cubic-bezier(0.16, 1, 0.3, 1);
}

.case-card.hover {
  border-color: rgba(226, 184, 120, 0.6);
  box-shadow: 0 28px 58px -18px rgba(226, 184, 120, 0.26);
}

.cc-tag { font-family: var(--font-mono); font-size: 0.66rem; font-weight: 700; color: #9CA3AF; }
.cc-title { font-size: 0.96rem; font-weight: 700; color: #F5F5F7; }
.cc-meta { font-size: 0.76rem; color: #A1A7B3; }
.cc-cta { margin-top: 0.2rem; font-size: 0.78rem; font-weight: 700; color: #E2B878; }

.card-cursor {
  position: absolute;
  right: 16px;
  bottom: 12px;
  opacity: 0;
  transform: translate3d(22px, 16px, 0);
  transition: opacity 260ms ease, transform 440ms cubic-bezier(0.16, 1, 0.3, 1);
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
  gap: 0.65rem;
}

.identity-line {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.12rem;
  font-size: 0.9rem;
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
  padding: 0.56rem 1.05rem !important;
  font-size: 0.84rem !important;
}

.cta-glass {
  background-color: #121318 !important;
  border-color: rgba(255, 255, 255, 0.14) !important;
  padding: 0.56rem 1.05rem !important;
  font-size: 0.84rem !important;
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
