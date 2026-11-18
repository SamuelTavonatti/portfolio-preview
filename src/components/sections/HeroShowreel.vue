<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

// 26.0s Google "Welcome to the Gemini Era" Showreel Choreography
// Strictly ZERO overlapping phases, strictly flat 2D architecture (no rotateX/rotateY),
// 100% English copy, slow readable pacing (~6.5s per phase).
//
// PHASE 01 (0.00s – 5.95s):
//   0.00s – 1.75s: Sub-state A — Accordion Pill Expansion ("UX ✦ UI DESIGN" + expanding pill row)
//   1.80s – 5.95s: Sub-state B — Glowing Halo AI Prompt Composer + Cursor Typing + 1.22x Macro Zoom
// BEAM 01 (5.95s – 6.50s): Luminous Gold-to-Sky-Blue Light Beam Sweep
//
// PHASE 02 (6.50s – 12.45s):
//   6.50s – 7.30s: Sub-state A — Shimmer Skeleton Bars ("Analyzing user flows...")
//   7.30s – 12.45s: Sub-state B — USER RESEARCH Bento + Tactile Filter Pills (Discover | Validate | Simplify)
// BEAM 02 (12.45s – 13.00s): Luminous Cyan-to-Gold Light Beam Sweep
//
// PHASE 03 (13.00s – 18.95s):
//   13.00s – 13.75s: Sub-state A — Iridescent Skeleton Frames ("Synthesizing 8pt design system...")
//   13.75s – 18.95s: Sub-state B — Flat 2D UX/UI DESIGN Figma Canvas + Mode Pills (Wireframe | High-Contrast UI) + "✦ Ship to Front-End"
// BEAM 03 (18.95s – 19.50s): Crisp White-to-Gold Light Beam Sweep
//
// PHASE 04 (19.50s – 26.00s):
//   19.50s – 24.15s: Sub-state A — MOTION & FRONT-END (Hack Squat 120 kg × 6 reps + Overview | Case Studies | Journey | Contact)
//   24.20s – 26.00s: Sub-state B — Iconic Gemini-Era Sign-Off ("Welcome to clarity.") collapsing into ✦ sparkle

const LOOP_SEC = 26.0
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
const easeOutExpo = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * clamp(x)))
const easeInOutCubic = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

const sec = computed(() => (elapsedMs.value % LOOP_MS) / 1000)

// Disjoint envelope helper: returns visible=false outside [start, end)
const subEnvelope = (s, start, end, enterDur = 0.4, exitDur = 0.35) => {
  if (s < start || s >= end) return { visible: false, opacity: 0, y: 10, scale: 0.985 }
  const enterK = easeOutExpo((s - start) / enterDur)
  const exitK = s > end - exitDur ? easeInOutCubic((s - (end - exitDur)) / exitDur) : 0
  return {
    visible: true,
    opacity: clamp(enterK * (1 - exitK)),
    y: (1 - enterK) * 10 - exitK * 8,
    scale: 0.985 + enterK * 0.015 - exitK * 0.012,
  }
}

// =========================================================
// LUMINOUS HORIZONTAL LIGHT-BEAM / SPARKLE-SWEEP TRANSITIONS
// =========================================================
const beamState = computed(() => {
  const s = sec.value
  const beams = [
    { id: 1, start: 5.95, end: 6.5, theme: 'beam-gold-blue', label: '✦ GENERATING USER RESEARCH TELEMETRY' },
    { id: 2, start: 12.45, end: 13.0, theme: 'beam-cyan-gold', label: '✦ SYNTHESIZING FLAT 2D FIGMA SYSTEM' },
    { id: 3, start: 18.95, end: 19.5, theme: 'beam-white-gold', label: '✦ SHIPPING TO 60FPS VUE 3 FRONT-END' },
  ]
  for (const b of beams) {
    if (s >= b.start && s < b.end) {
      const p = clamp((s - b.start) / (b.end - b.start))
      const env = Math.sin(p * Math.PI)
      return {
        active: true,
        id: b.id,
        theme: b.theme,
        label: b.label,
        progress: p,
        opacity: clamp(env * 1.35),
        dashOffset: (1 - easeInOutCubic(p)) * 1200,
        sparkX: 60 + easeInOutCubic(p) * 1080,
      }
    }
  }
  return { active: false, id: 0, theme: '', label: '', progress: 0, opacity: 0, dashOffset: 1200, sparkX: 60 }
})

// =========================================================
// PHASE 01A (0.00s – 1.78s) — HORIZONTAL ACCORDION PILL EXPANSION
// =========================================================
const p1Accordion = computed(() => subEnvelope(sec.value, 0.0, 1.78, 0.32, 0.32))
const accordionOpenK = computed(() => {
  const s = sec.value
  if (s < 0.2) return 0
  if (s < 1.35) return easeOutExpo((s - 0.2) / 0.75)
  return 1 - easeInOutCubic((s - 1.35) / 0.42) * 0.65
})

// =========================================================
// PHASE 01B (1.78s – 5.95s) — GLOWING HALO PROMPT COMPOSER
// =========================================================
const FULL_PROMPT = 'Design a high-contrast workout app with zero cognitive friction'
const p1Prompt = computed(() => subEnvelope(sec.value, 1.78, 5.95, 0.42, 0.35))

const promptLocal = computed(() => Math.max(0, sec.value - 1.78))
const focused = computed(() => sec.value >= 2.1 && sec.value < 5.88)

const typedText = computed(() => {
  const p = clamp((sec.value - 2.2) / 2.25)
  const count = Math.floor(p * FULL_PROMPT.length)
  return FULL_PROMPT.slice(0, count)
})

const tokenCount = computed(() => Math.round(typedText.value.length * 1.8))
const submitReady = computed(() => typedText.value.length >= FULL_PROMPT.length - 1)
const submitPressed = computed(() => sec.value >= 5.2 && sec.value < 5.58)
const submitRipple = computed(() => sec.value >= 5.2 && sec.value < 5.92)

// Smooth 2D Macro Camera Zoom-In (scale 1.22) locked onto ↑ Generate button
const camZoom = computed(() => {
  const s = sec.value
  const zIn = easeInOutCubic((s - 4.7) / 0.65) * 0.22
  return (1 + zIn) * p1Prompt.value.scale
})

const boxW = computed(() => Math.min(680, viewW.value * 0.9))

const bez = (p0, p1, p2, k) => ({
  x: (1 - k) * (1 - k) * p0.x + 2 * (1 - k) * k * p1.x + k * k * p2.x,
  y: (1 - k) * (1 - k) * p0.y + 2 * (1 - k) * k * p1.y + k * k * p2.y,
})

const promptCursor = computed(() => {
  const s = sec.value
  const w = boxW.value
  const start = { x: -w * 0.28, y: 105 }
  const input = { x: -w * 0.1, y: 2 }
  const btn = { x: w / 2 - 64, y: 40 }
  let pos
  if (s < 2.15) {
    pos = bez(start, { x: -w * 0.28, y: 20 }, input, easeInOutCubic((s - 1.78) / 0.37))
  } else if (s < 4.55) {
    pos = { x: input.x + Math.sin(s * 1.5) * 3, y: input.y }
  } else {
    pos = bez(input, { x: w * 0.1, y: -16 }, btn, easeInOutCubic((s - 4.55) / 0.6))
  }
  const ibeam = s >= 2.1 && s < 4.55
  const scale = submitPressed.value ? 0.92 : 1
  return { x: pos.x, y: pos.y, ibeam, scale }
})

// =========================================================
// PHASE 02 (6.50s – 12.45s) — USER RESEARCH & COGNITIVE ERGONOMICS
//   6.50s – 7.30s: Shimmer Skeleton Bars ("Analyzing user flows...")
//   7.30s – 12.45s: 2D Bento Dashboard + Interactive Filter Pills (Discover | Validate | Simplify)
// =========================================================
const p2Shimmer = computed(() => subEnvelope(sec.value, 6.5, 7.3, 0.22, 0.22))
const p2Main = computed(() => subEnvelope(sec.value, 7.3, 12.45, 0.42, 0.38))

const rl = computed(() => Math.max(0, sec.value - 7.3))
const mFriction = computed(() => Math.round(easeOutExpo((rl.value - 0.1) / 1.1) * 42))
const mTask = computed(() => (easeOutExpo((rl.value - 0.15) / 1.15) * 98.4).toFixed(1))
const mSus = computed(() => Math.round(easeOutExpo((rl.value - 0.2) / 1.2) * 91))

// Filter pill switching: starts on Validate (1), cursor clicks Simplify (2) at rl >= 1.55s
const researchSimplified = computed(() => rl.value >= 1.55)
const researchPillClick = computed(() => rl.value >= 1.45 && rl.value < 1.75)
const researchCursorK = computed(() => easeInOutCubic((rl.value - 0.65) / 0.85))

// =========================================================
// PHASE 03 (13.00s – 18.95s) — UX/UI DESIGN & FIGMA SYSTEM (Flat 2D)
//   13.00s – 13.75s: Iridescent Skeleton Frames ("Synthesizing 8pt design system...")
//   13.75s – 18.95s: Flat 2D Figma Canvas + Mode Pills (Wireframe | High-Contrast UI) + "✦ Ship to Front-End"
// =========================================================
const p3Shimmer = computed(() => subEnvelope(sec.value, 13.0, 13.75, 0.22, 0.22))
const p3Main = computed(() => subEnvelope(sec.value, 13.75, 18.95, 0.42, 0.38))

const fl = computed(() => Math.max(0, sec.value - 13.75))
const figmaHighContrast = computed(() => fl.value >= 1.45)
const figmaModeClick = computed(() => fl.value >= 1.35 && fl.value < 1.65)
const figmaShipClick = computed(() => fl.value >= 4.4 && fl.value < 4.85)
const figmaZoom = computed(() => {
  const z = easeInOutCubic((fl.value - 4.25) / 0.65) * 0.14
  return (1 + z) * p3Main.value.scale
})
const figmaCursorPos = computed(() => {
  // 0 -> 1.4s: glides to "High-Contrast UI" pill (x: 56, y: -76)
  // 1.4s -> 3.6s: rests near active mode pill
  // 3.6s -> 4.45s: glides down to "✦ Ship to Front-End" pill (x: 105, y: 104)
  if (fl.value < 1.45) {
    const k = easeInOutCubic(fl.value / 1.4)
    return { x: -90 + k * 146, y: 10 - k * 86 }
  }
  if (fl.value < 3.55) {
    return { x: 56, y: -76 }
  }
  const k2 = easeInOutCubic((fl.value - 3.55) / 0.85)
  return { x: 56 + k2 * 48, y: -76 + k2 * 178 }
})

// =========================================================
// PHASE 04 (19.50s – 26.00s) — LIVING PORTFOLIO, VOLTREP & GEMINI SIGN-OFF
//   19.50s – 24.15s: MOTION & FRONT-END (Hack Squat 120 kg × 6 reps + Overview | Case Studies | Journey | Contact)
//   24.15s – 26.00s: Iconic Sign-Off ("Welcome to clarity.") collapsing into ✦ sparkle
// =========================================================
const p4Main = computed(() => subEnvelope(sec.value, 19.5, 24.15, 0.42, 0.38))
const pl = computed(() => Math.max(0, sec.value - 19.5))
const voltCheckClick = computed(() => pl.value >= 1.35 && pl.value < 1.68)
const voltDone = computed(() => pl.value >= 1.5)
const navIdx = computed(() => (pl.value < 1.75 ? 0 : 1)) // glides smoothly from Overview (0) onto Case Studies (1)
const caseHover = computed(() => pl.value >= 1.95)
const p4CursorPos = computed(() => {
  // Glides from Voltrep checkmark to Case Studies card
  const k = easeInOutCubic((pl.value - 1.55) / 0.85)
  return {
    x: -48 + k * 225,
    y: 16 + k * 18,
  }
})

// Iconic Gemini-Era Sign-Off (24.15s – 26.00s)
const p4SignOff = computed(() => {
  const s = sec.value
  if (s < 24.15) return { visible: false, opacity: 0, textScale: 1, collapseK: 0 }
  const enter = easeOutExpo((s - 24.15) / 0.38)
  const collapseK = s > 25.45 ? easeInOutCubic((s - 25.45) / 0.52) : 0
  return {
    visible: true,
    opacity: clamp(enter),
    textOpacity: clamp(1 - collapseK * 1.25),
    textScale: 1 - collapseK * 0.25,
    sparkScale: 1 + Math.sin(clamp((s - 24.15) / 1.85) * Math.PI) * 0.35,
  }
})

const auroraTheme = computed(() => {
  const s = sec.value
  if (s < 6.2) return 'aurora-gold-blue'
  if (s < 12.7) return 'aurora-emerald-cyan'
  if (s < 19.2) return 'aurora-gold-white'
  return 'aurora-gemini'
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
    elapsedMs.value = 21800
  } else {
    elapsedMs.value = 0 // starts right at the iconic [00:00:02] Horizontal Accordion Pill Expansion
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
  <section class="film-hero" aria-label="Google Gemini-Era Product Showreel">
    <div class="film-stage" :class="auroraTheme">
      <!-- Bottom Aurora Wave Glow ([00:00:44] reference) -->
      <div class="aurora-horizon" aria-hidden="true">
        <div class="aurora-wave aurora-wave-1" />
        <div class="aurora-wave aurora-wave-2" />
      </div>

      <div class="camera-viewport">
        <!-- =========================================================
             LUMINOUS HORIZONTAL LIGHT-BEAM / SPARKLE-SWEEP TRANSITIONS
             ========================================================= -->
        <div
          v-if="beamState.active"
          class="beam-stage"
          :class="beamState.theme"
          :style="{ opacity: beamState.opacity }"
          aria-hidden="true"
        >
          <svg class="beam-svg" viewBox="0 0 1200 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gGoldBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#E2B878" stop-opacity="0" />
                <stop offset="40%" stop-color="#E2B878" stop-opacity="1" />
                <stop offset="80%" stop-color="#60A5FA" stop-opacity="1" />
                <stop offset="100%" stop-color="#34D399" stop-opacity="0.95" />
              </linearGradient>
              <linearGradient id="gCyanGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#34D399" stop-opacity="0" />
                <stop offset="40%" stop-color="#60A5FA" stop-opacity="1" />
                <stop offset="85%" stop-color="#E2B878" stop-opacity="1" />
                <stop offset="100%" stop-color="#F5F5F7" stop-opacity="0.95" />
              </linearGradient>
              <linearGradient id="gWhiteGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#60A5FA" stop-opacity="0" />
                <stop offset="45%" stop-color="#F5F5F7" stop-opacity="1" />
                <stop offset="88%" stop-color="#E2B878" stop-opacity="1" />
                <stop offset="100%" stop-color="#34D399" stop-opacity="0.95" />
              </linearGradient>
            </defs>

            <path
              class="beam-glow-path"
              d="M 40 90 C 380 55, 820 125, 1160 90"
              fill="none"
              stroke-width="12"
              stroke-linecap="round"
              :style="{ strokeDasharray: 1200, strokeDashoffset: beamState.dashOffset }"
            />
            <path
              class="beam-core-path"
              d="M 40 90 C 380 55, 820 125, 1160 90"
              fill="none"
              stroke-width="3.2"
              stroke-linecap="round"
              :style="{ strokeDasharray: 1200, strokeDashoffset: beamState.dashOffset }"
            />
          </svg>
          <div class="beam-badge">
            <span>{{ beamState.label }}</span>
          </div>
        </div>

        <!-- =========================================================
             PHASE 01A (0.0s – 1.78s) — HORIZONTAL ACCORDION PILL EXPANSION ([00:00:02])
             ========================================================= -->
        <div
          v-if="p1Accordion.visible"
          class="camera-layer"
          :style="{
            opacity: p1Accordion.opacity,
            transform: `translate3d(0, ${p1Accordion.y.toFixed(1)}px, 0) scale(${p1Accordion.scale.toFixed(3)})`,
          }"
        >
          <span class="seq-kicker is-halo">✦ WELCOME TO COGNITIVE CLARITY</span>

          <div class="accordion-headline">
            <span
              class="acc-word tone-ice"
              :style="{ transform: `translate3d(${(-accordionOpenK * 18).toFixed(1)}px, 0, 0)` }"
            >UX</span>
            <span
              class="acc-sparkle"
              :style="{ transform: `scale(${(0.75 + accordionOpenK * 0.35).toFixed(2)}) rotate(${(accordionOpenK * 45).toFixed(1)}deg)` }"
              aria-hidden="true"
            >
              <svg viewBox="0 0 36 36" width="46" height="46" fill="none">
                <defs>
                  <linearGradient id="spGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#E2B878" />
                    <stop offset="55%" stop-color="#60A5FA" />
                    <stop offset="100%" stop-color="#34D399" />
                  </linearGradient>
                </defs>
                <path d="M18 2 C19.5 13, 23 16.5, 34 18 C23 19.5, 19.5 23, 18 34 C16.5 23, 13 19.5, 2 18 C13 16.5, 16.5 13, 18 2 Z" fill="url(#spGrad1)" />
              </svg>
            </span>
            <span
              class="acc-word tone-gold"
              :style="{ transform: `translate3d(${(accordionOpenK * 18).toFixed(1)}px, 0, 0)` }"
            >UI DESIGN</span>
          </div>

          <div
            class="accordion-pill-row"
            :style="{
              gap: `${(0.25 + accordionOpenK * 0.45).toFixed(2)}rem`,
              transform: `scaleX(${(0.86 + accordionOpenK * 0.14).toFixed(3)})`,
            }"
          >
            <span class="acc-pill">User Research</span>
            <span class="acc-pill is-sparkle" aria-hidden="true">✦</span>
            <span class="acc-pill is-active">Design Systems</span>
            <span class="acc-pill">Creative AI</span>
            <span class="acc-pill">Front-End</span>
          </div>
        </div>

        <!-- =========================================================
             PHASE 01B (1.78s – 5.95s) — GLOWING HALO PROMPT COMPOSER ([00:00:15])
             ========================================================= -->
        <div
          v-show="p1Prompt.visible"
          ref="layerRef"
          class="camera-layer layer-prompt"
          :style="{
            opacity: p1Prompt.opacity,
            transform: `translate3d(0, ${p1Prompt.y.toFixed(1)}px, 0) scale(${camZoom.toFixed(3)})`,
            transformOrigin: camOrigin,
          }"
        >
          <span class="seq-kicker is-halo">✦ CREATIVE AI // GENERATIVE PRODUCT ENGINE</span>
          <h1 class="seq-title">
            <span class="tone-ice">FROM PROMPT</span>
            <span class="tone-gold">TO INTERFACE.</span>
          </h1>

          <div
            ref="boxRef"
            class="prompt-box"
            :class="{ 'is-focus': focused }"
          >
            <div class="prompt-top">
              <span class="model-pill"><span class="spark-icon" aria-hidden="true">✦</span> Creative AI</span>
              <span class="ctx-pill tabular-nums" :class="{ lit: typedText.length > 0 }">
                {{ tokenCount }} tokens · Gemini Era Workflow
              </span>
            </div>

            <div class="prompt-field">
              <span class="prompt-text">{{ typedText }}</span><span class="prompt-caret" :class="{ on: focused }" aria-hidden="true" />
              <span v-if="!typedText && !focused" class="prompt-placeholder">Ask Creative AI to architect an interface…</span>
            </div>

            <div class="prompt-bottom">
              <div class="chip-group" aria-hidden="true">
                <span class="attach-chip">User Research</span>
                <span class="attach-chip">Design Systems</span>
                <span class="attach-chip">WCAG AA</span>
              </div>
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

            <!-- High-DPI Vector Cursor -->
            <div
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
             PHASE 02A (6.50s – 7.30s) — SHIMMER SKELETON BARS ([00:00:32])
             ========================================================= -->
        <div
          v-if="p2Shimmer.visible"
          class="camera-layer"
          :style="{
            opacity: p2Shimmer.opacity,
            transform: `translate3d(0, ${p2Shimmer.y.toFixed(1)}px, 0) scale(${p2Shimmer.scale.toFixed(3)})`,
          }"
          aria-hidden="true"
        >
          <div class="shimmer-panel">
            <div class="shimmer-head">
              <span class="spark-spin">✦</span>
              <span>Analyzing user flows...</span>
            </div>
            <div class="shimmer-bar w-92" />
            <div class="shimmer-bar w-76 delay-1" />
            <div class="shimmer-bar w-64 delay-2" />
          </div>
        </div>

        <!-- =========================================================
             PHASE 02B (7.30s – 12.45s) — USER RESEARCH & FILTER PILLS ([00:00:33])
             ========================================================= -->
        <div
          v-if="p2Main.visible"
          class="camera-layer"
          :style="{
            opacity: p2Main.opacity,
            transform: `translate3d(0, ${p2Main.y.toFixed(1)}px, 0) scale(${p2Main.scale.toFixed(3)})`,
          }"
        >
          <span class="seq-kicker is-emerald">✦ COGNITIVE ERGONOMICS // EMPIRICAL TELEMETRY</span>
          <h1 class="seq-title">
            <span class="tone-ice">USER</span>
            <span class="tone-emerald">RESEARCH</span>
          </h1>

          <!-- Tactile Segmented Filter Pills ([00:00:33]) -->
          <div class="filter-pill-bar">
            <span class="filter-pill">Discover</span>
            <span class="filter-pill" :class="{ 'is-active-gold': !researchSimplified }">Validate</span>
            <span
              class="filter-pill"
              :class="{ 'is-active-emerald': researchSimplified, 'is-pressed': researchPillClick }"
            >
              ✦ Simplify
            </span>

            <svg
              class="pill-cursor"
              :style="{ transform: `translate3d(${(-42 + researchCursorK * 98).toFixed(1)}px, ${(36 - researchCursorK * 24).toFixed(1)}px, 0) scale(${researchPillClick ? 0.9 : 1})` }"
              viewBox="0 0 24 24"
              width="21"
              height="21"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#F5F5F7" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
          </div>

          <div class="bento-research">
            <!-- Card 1: Cognitive Friction Card -->
            <div class="glass-panel bento-card">
              <div class="bc-top">
                <span class="bc-tag">COGNITIVE FRICTION</span>
                <span class="bc-trend">↓ Validated</span>
              </div>
              <div class="bc-main-row">
                <span class="bc-num is-emerald tabular-nums">-{{ mFriction }}%</span>
                <svg class="sparkline-svg" viewBox="0 0 110 34" fill="none" aria-hidden="true">
                  <path d="M4 6 L32 12 L58 10 L82 24 L106 29" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="106" cy="29" r="3.5" fill="#34D399" />
                </svg>
              </div>
              <span class="bc-sub">Decision latency across active workout logging</span>
            </div>

            <!-- Card 2: Usability Metrics Card -->
            <div class="glass-panel bento-card">
              <div class="bc-top">
                <span class="bc-tag">USABILITY BENCHMARK</span>
                <span class="bc-sus tabular-nums">SUS Score {{ mSus }}/100</span>
              </div>
              <div class="bc-main-row">
                <span class="bc-num is-ice tabular-nums">{{ mTask }}%</span>
                <span class="bc-badge-gold">Task Completion</span>
              </div>
              <div class="sus-bar-track" aria-hidden="true">
                <div class="sus-bar-fill" :style="{ width: `${mSus}%` }" />
              </div>
            </div>

            <!-- Card 3: User-Flow Diagram (6-step cluttered -> 3-step ergonomic flow on "Simplify") -->
            <div class="glass-panel bento-card bento-wide">
              <div class="bc-top">
                <span class="bc-tag">USER-FLOW ARCHITECTURE</span>
                <span class="bc-flow-status" :class="{ simplified: researchSimplified }">
                  {{ researchSimplified ? '✦ Simplified · 3 Ergonomic Steps' : 'Legacy Flow · 6 Cluttered Steps' }}
                </span>
              </div>

              <div v-if="!researchSimplified" class="flow-row is-cluttered">
                <span class="f-chip">Splash</span>
                <span class="f-arr">→</span>
                <span class="f-chip">Menu</span>
                <span class="f-arr">→</span>
                <span class="f-chip">Category</span>
                <span class="f-arr">→</span>
                <span class="f-chip">Modal</span>
                <span class="f-arr">→</span>
                <span class="f-chip">Input</span>
                <span class="f-arr">→</span>
                <span class="f-chip">Save</span>
              </div>

              <div v-else class="flow-row is-clean">
                <span class="f-node"><i class="f-dot blue" />1. Select Exercise</span>
                <span class="f-connector" />
                <span class="f-node is-gold"><i class="f-dot gold" />2. One-Tap Set Log</span>
                <span class="f-connector" />
                <span class="f-node is-emerald"><i class="f-dot emerald" />3. Instant Rest Sync ✓</span>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             PHASE 03A (13.00s – 13.75s) — IRIDESCENT SKELETON FRAMES ([00:00:16])
             ========================================================= -->
        <div
          v-if="p3Shimmer.visible"
          class="camera-layer"
          :style="{
            opacity: p3Shimmer.opacity,
            transform: `translate3d(0, ${p3Shimmer.y.toFixed(1)}px, 0) scale(${p3Shimmer.scale.toFixed(3)})`,
          }"
          aria-hidden="true"
        >
          <div class="shimmer-panel is-iridescent">
            <div class="shimmer-head">
              <span class="spark-spin">✦</span>
              <span>Materializing 2D Figma components &amp; tokens...</span>
            </div>
            <div class="skeleton-grid">
              <div class="skel-card" />
              <div class="skel-card is-main" />
              <div class="skel-card" />
            </div>
          </div>
        </div>

        <!-- =========================================================
             PHASE 03B (13.75s – 18.95s) — FLAT 2D UX/UI DESIGN & FIGMA SYSTEM
             ========================================================= -->
        <div
          v-if="p3Main.visible"
          class="camera-layer"
          :style="{
            opacity: p3Main.opacity,
            transform: `translate3d(0, ${p3Main.y.toFixed(1)}px, 0) scale(${figmaZoom.toFixed(3)})`,
          }"
        >
          <span class="seq-kicker is-gold">✦ DESIGN SYSTEMS // FLAT 2D ARCHITECTURAL PRECISION</span>
          <h1 class="seq-title">
            <span class="tone-ice">UX/UI</span>
            <span class="tone-gold">DESIGN</span>
          </h1>

          <div class="figma-workspace">
            <div class="figma-header">
              <div class="fh-left">
                <span class="fh-dots" aria-hidden="true"><i /><i /><i /></span>
                <span class="fh-file tabular-nums">Frame / Voltrep · 8pt Grid</span>
              </div>

              <!-- Top Mode Pills ([00:00:33] style): Wireframe | High-Contrast UI -->
              <div class="mode-pills">
                <span class="mode-pill" :class="{ active: !figmaHighContrast }">Wireframe</span>
                <span
                  class="mode-pill"
                  :class="{ 'active-hc': figmaHighContrast, pressed: figmaModeClick }"
                >
                  ✦ High-Contrast UI
                </span>
              </div>

              <span class="fh-wcag">WCAG AA · 14.8:1</span>
            </div>

            <div class="figma-body">
              <!-- Left Mini Layers Panel -->
              <div class="figma-panel" aria-hidden="true">
                <div class="fp-title">LAYERS</div>
                <div class="layer-item is-active"><span class="li-icon">#</span> Frame / Voltrep</div>
                <div class="layer-item"><span class="li-icon">⊞</span> Auto Layout</div>
                <div class="layer-item"><span class="li-icon">❖</span> 8pt Grid</div>
              </div>

              <!-- Center Flat 2D Component Frame -->
              <div class="figma-stage-center">
                <div class="selection-frame" :class="{ 'is-polished': figmaHighContrast }">
                  <span class="handle h-tl" aria-hidden="true" />
                  <span class="handle h-tr" aria-hidden="true" />
                  <span class="handle h-bl" aria-hidden="true" />
                  <span class="handle h-br" aria-hidden="true" />
                  <span class="redline r-top tabular-nums" aria-hidden="true">24px</span>
                  <span class="redline r-side tabular-nums" aria-hidden="true">16px</span>

                  <div class="ui-preview-card" :class="{ 'is-hc': figmaHighContrast }">
                    <div class="upc-row">
                      <span class="upc-kicker">{{ figmaHighContrast ? 'VOLTREP · PRODUCTION TOKEN' : 'WIREFRAME · LOW-FI BLOCK' }}</span>
                      <span class="upc-chip tabular-nums">{{ figmaHighContrast ? 'WCAG AA ✓' : 'Draft' }}</span>
                    </div>
                    <div class="upc-title">Hack Squat · 120 kg × 6 reps</div>
                    <div class="upc-bar"><div class="upc-bar-fill" /></div>
                  </div>
                </div>

                <!-- Glowing Ship to Front-End Action Pill -->
                <div class="ship-row">
                  <span class="ship-pill" :class="{ pressed: figmaShipClick }">
                    <span class="spark-icon">✦</span> Ship to Front-End →
                  </span>
                </div>

                <!-- Vector Cursor clicking High-Contrast UI then Ship to Front-End -->
                <svg
                  class="figma-cursor"
                  :style="{ transform: `translate3d(${figmaCursorPos.x.toFixed(1)}px, ${figmaCursorPos.y.toFixed(1)}px, 0) scale(${figmaModeClick || figmaShipClick ? 0.88 : 1})` }"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#E2B878" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
              </div>

              <!-- Right Design Tokens Panel -->
              <div class="figma-panel" aria-hidden="true">
                <div class="fp-title">TOKENS</div>
                <div class="token-row"><i class="sw" style="background:#050507" /><span>#050507</span></div>
                <div class="token-row"><i class="sw" style="background:#E2B878" /><span>#E2B878</span></div>
                <div class="token-row"><i class="sw" style="background:#F5F5F7" /><span>#F5F5F7</span></div>
                <div class="token-spec">WCAG AA · 8pt Grid</div>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             PHASE 04A (19.50s – 24.15s) — LIVING PORTFOLIO & VOLTREP FRONT-END
             ========================================================= -->
        <div
          v-if="p4Main.visible"
          class="camera-layer"
          :style="{
            opacity: p4Main.opacity,
            transform: `translate3d(0, ${p4Main.y.toFixed(1)}px, 0) scale(${p4Main.scale.toFixed(3)})`,
          }"
        >
          <span class="seq-kicker is-gold">✦ PRODUCTION FRONT-END // 60FPS VUE 3 ARCHITECTURE</span>
          <h1 class="seq-title">
            <span class="tone-gold">MOTION &amp;</span>
            <span class="tone-ice">FRONT-END</span>
          </h1>

          <!-- Portfolio Navigation Pill ([00:00:38] style: Overview | Case Studies | Journey | Contact) -->
          <div class="live-navbar-pill" aria-hidden="true">
            <span class="nav-thumb" :style="{ transform: `translate3d(${navIdx * 100}%, 0, 0)` }" />
            <span class="nav-item" :class="{ active: navIdx === 0 }">Overview</span>
            <span class="nav-item" :class="{ active: navIdx === 1 }">Case Studies</span>
            <span class="nav-item">Journey</span>
            <span class="nav-item">Contact</span>
          </div>

          <div class="frontend-showcase">
            <!-- Voltrep Live Card (Hack Squat · 120 kg × 6 reps -> Set Logged ✓) -->
            <div class="glass-panel volt-card" :class="{ done: voltDone }">
              <div class="vc-head">
                <span class="vc-brand">VOLTREP · LIVE WORKOUT LOGGER</span>
                <span class="vc-status tabular-nums" :class="{ done: voltDone }">
                  {{ voltDone ? 'Set Logged ✓' : 'Active Set' }}
                </span>
              </div>

              <div class="vc-exercise">Hack Squat</div>

              <div class="vc-logger-row">
                <div class="vc-metric tabular-nums">
                  <span class="vc-val">120 kg × 6 reps</span>
                  <span class="vc-sub">High-Contrast Ergonomic UI</span>
                </div>
                <button
                  type="button"
                  tabindex="-1"
                  class="vc-check-btn"
                  :class="{ clicked: voltCheckClick, done: voltDone }"
                  aria-hidden="true"
                >
                  ✓
                </button>
              </div>

              <div class="vc-track" aria-hidden="true">
                <div class="vc-fill" :style="{ width: voltDone ? '100%' : '72%' }" />
              </div>
            </div>

            <!-- Portfolio Case Study Preview Card -->
            <div class="glass-panel case-card" :class="{ hover: caseHover }">
              <div class="cc-top">
                <span class="cc-tag">CASE STUDY PREVIEW</span>
                <span class="cc-pill">60 FPS · Live</span>
              </div>
              <div class="cc-title">Voltrep — UX/UI &amp; Front-End · 60 FPS</div>
              <div class="cc-specs">Vue 3 · Cognitive Ergonomics · WCAG AA</div>
              <div class="cc-cta">Explore Case Study →</div>
            </div>

            <!-- Shared cursor clicking Voltrep checkmark then highlighting Case Study card -->
            <svg
              class="fe-cursor"
              :style="{ transform: `translate3d(${p4CursorPos.x.toFixed(1)}px, ${p4CursorPos.y.toFixed(1)}px, 0) scale(${voltCheckClick ? 0.88 : 1})` }"
              viewBox="0 0 24 24"
              width="23"
              height="23"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 3L19 11L12 13L9 20L4 3Z" fill="#E2B878" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
          </div>
        </div>

        <!-- =========================================================
             PHASE 04B (24.15s – 26.00s) — ICONIC GEMINI-ERA SIGN-OFF ([00:00:55])
             ========================================================= -->
        <div
          v-if="p4SignOff.visible"
          class="camera-layer signoff-layer"
          :style="{ opacity: p4SignOff.opacity }"
        >
          <span
            class="signoff-sparkle"
            :style="{ transform: `scale(${p4SignOff.sparkScale.toFixed(2)})` }"
            aria-hidden="true"
          >
            <svg viewBox="0 0 36 36" width="44" height="44" fill="none">
              <defs>
                <linearGradient id="spGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F5F5F7" />
                  <stop offset="50%" stop-color="#E2B878" />
                  <stop offset="100%" stop-color="#60A5FA" />
                </linearGradient>
              </defs>
              <path d="M18 2 C19.5 13, 23 16.5, 34 18 C23 19.5, 19.5 23, 18 34 C16.5 23, 13 19.5, 2 18 C13 16.5, 16.5 13, 18 2 Z" fill="url(#spGrad2)" />
            </svg>
          </span>
          <h1
            class="signoff-title"
            :style="{
              opacity: p4SignOff.textOpacity,
              transform: `scale(${p4SignOff.textScale.toFixed(3)})`,
            }"
          >
            Welcome to clarity.
          </h1>
        </div>
      </div>

      <!-- Lower-left identity & CTA anchor -->
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
  padding: 4.8rem 0 1.45rem;
}

@media (min-width: 768px) {
  .film-stage {
    min-height: 94vh;
    padding: 5.4rem 0 2.1rem;
  }
}

/* =========================================================
   BOTTOM AURORA WAVE GLOW ([00:00:44])
   ========================================================= */
.aurora-horizon {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.aurora-wave {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  will-change: transform, opacity;
  transition: background 1.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: auroraBreathe 9s ease-in-out infinite alternate;
}

.aurora-wave-1 {
  width: 72vw;
  height: 36vw;
  max-width: 980px;
  max-height: 440px;
  bottom: -14%;
  left: 14%;
  opacity: 0.1;
}

.aurora-wave-2 {
  width: 52vw;
  height: 32vw;
  max-width: 720px;
  max-height: 380px;
  top: 8%;
  right: 12%;
  opacity: 0.075;
  animation-duration: 12s;
  animation-direction: alternate-reverse;
}

@keyframes auroraBreathe {
  0% { transform: scale(0.96) translate3d(0, 0, 0); }
  100% { transform: scale(1.06) translate3d(2%, -2%, 0); }
}

.aurora-gold-blue .aurora-wave-1 { background: radial-gradient(ellipse, #E2B878 0%, #60A5FA 45%, transparent 72%); }
.aurora-gold-blue .aurora-wave-2 { background: radial-gradient(circle, #60A5FA 0%, transparent 70%); }

.aurora-emerald-cyan .aurora-wave-1 { background: radial-gradient(ellipse, #34D399 0%, #60A5FA 45%, transparent 72%); }
.aurora-emerald-cyan .aurora-wave-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }

.aurora-gold-white .aurora-wave-1 { background: radial-gradient(ellipse, #E2B878 0%, #F5F5F7 40%, transparent 72%); }
.aurora-gold-white .aurora-wave-2 { background: radial-gradient(circle, #60A5FA 0%, transparent 70%); }

.aurora-gemini .aurora-wave-1 { background: radial-gradient(ellipse, #E2B878 0%, #34D399 48%, transparent 72%); }
.aurora-gemini .aurora-wave-2 { background: radial-gradient(circle, #60A5FA 0%, transparent 70%); }

.camera-viewport {
  position: relative;
  z-index: 2;
  flex: 1;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  padding: 0.65rem 1.25rem;
}

@media (min-width: 768px) {
  .camera-viewport {
    padding: 1.1rem 2.5rem;
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
  gap: 0.85rem;
  will-change: transform, opacity;
}

@media (min-width: 768px) {
  .camera-layer {
    gap: 1.05rem;
  }
}

/* =========================================================
   LUMINOUS LIGHT-BEAM / SPARKLE-SWEEP TRANSITION
   ========================================================= */
.beam-stage {
  position: relative;
  grid-area: 1 / 1;
  z-index: 10;
  width: min(960px, calc(100vw - 2.5rem));
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  will-change: opacity;
}

.beam-svg {
  width: 100%;
  height: 130px;
  overflow: visible;
}

.beam-glow-path {
  filter: blur(9px);
  opacity: 0.7;
}

.beam-core-path {
  filter: drop-shadow(0 0 14px rgba(226, 184, 120, 0.8));
}

.beam-gold-blue .beam-glow-path,
.beam-gold-blue .beam-core-path { stroke: url(#gGoldBlue); }

.beam-cyan-gold .beam-glow-path,
.beam-cyan-gold .beam-core-path { stroke: url(#gCyanGold); }

.beam-white-gold .beam-glow-path,
.beam-white-gold .beam-core-path { stroke: url(#gWhiteGold); }

.beam-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.34rem 0.92rem;
  border-radius: 999px;
  background: rgba(14, 16, 21, 0.94);
  border: 1px solid rgba(226, 184, 120, 0.5);
  box-shadow: 0 0 32px rgba(96, 165, 250, 0.25);
  font-family: var(--font-mono);
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #F5F5F7;
}

/* =========================================================
   PHASE 01A: HORIZONTAL ACCORDION PILL EXPANSION ([00:00:02])
   ========================================================= */
.accordion-headline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  font-size: clamp(2.5rem, 6.2vw, 5.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}

.acc-word {
  display: inline-block;
  will-change: transform;
}

.acc-sparkle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(2rem, 4.8vw, 3.9rem);
  background: linear-gradient(135deg, #E2B878 0%, #60A5FA 55%, #34D399 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 18px rgba(226, 184, 120, 0.55));
  will-change: transform;
}

.accordion-pill-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  background: rgba(14, 16, 21, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow: 0 22px 48px -18px rgba(0, 0, 0, 0.85);
  will-change: transform;
}

.acc-pill {
  padding: 0.38rem 0.88rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.78rem;
  font-weight: 600;
  color: #D1D5DB;
}

.acc-pill.is-sparkle {
  background: linear-gradient(135deg, rgba(226, 184, 120, 0.22), rgba(96, 165, 250, 0.22));
  border-color: rgba(226, 184, 120, 0.55);
  color: #E2B878;
}

.acc-pill.is-active {
  background: rgba(226, 184, 120, 0.15);
  border-color: rgba(226, 184, 120, 0.55);
  color: #F5F5F7;
}

/* =========================================================
   SHIMMER SKELETON BARS & IRIDESCENT PLACEHOLDERS ([00:00:16] & [00:00:32])
   ========================================================= */
.shimmer-panel {
  width: min(640px, calc(100vw - 2.5rem));
  padding: 1.25rem 1.35rem;
  border-radius: 20px;
  background: rgba(14, 16, 21, 0.92);
  border: 1px solid rgba(226, 184, 120, 0.35);
  box-shadow: 0 0 40px rgba(96, 165, 250, 0.14);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  text-align: left;
}

.shimmer-head {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 600;
  color: #E2B878;
}

.spark-spin {
  display: inline-block;
  color: #60A5FA;
}

.shimmer-bar {
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(226, 184, 120, 0.14) 0%,
    rgba(96, 165, 250, 0.42) 50%,
    rgba(52, 211, 153, 0.22) 100%
  );
  background-size: 200% 100%;
  animation: shimmerPulse 1.1s linear infinite;
}

.shimmer-bar.w-92 { width: 92%; }
.shimmer-bar.w-76 { width: 76%; }
.shimmer-bar.w-64 { width: 64%; }

@keyframes shimmerPulse {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

.skeleton-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr 1fr;
  gap: 0.65rem;
}

.skel-card {
  height: 78px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(
    120deg,
    rgba(226, 184, 120, 0.12),
    rgba(96, 165, 250, 0.24),
    rgba(52, 211, 153, 0.14)
  );
}

/* =========================================================
   SHARED TYPOGRAPHY & CARDS
   ========================================================= */
.seq-kicker {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.seq-kicker.is-halo {
  background: linear-gradient(90deg, rgba(226, 184, 120, 0.14), rgba(96, 165, 250, 0.14));
  border: 1px solid rgba(226, 184, 120, 0.45);
  color: #F5F5F7;
}

.seq-kicker.is-gold {
  background: rgba(226, 184, 120, 0.12);
  border: 1px solid rgba(226, 184, 120, 0.38);
  color: #E2B878;
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
  gap: 0.2rem 0.65rem;
  font-size: clamp(2rem, 4.9vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -0.036em;
  line-height: 1;
}

.tone-ice { color: #F5F5F7; }
.tone-gold { color: #E2B878; }
.tone-emerald { color: #34D399; }

.glass-panel {
  background: rgba(15, 17, 22, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 22px 48px -20px rgba(0, 0, 0, 0.85);
}

/* =========================================================
   PHASE 01B: GLOWING HALO PROMPT COMPOSER ([00:00:15])
   ========================================================= */
.prompt-box {
  position: relative;
  width: min(680px, calc(100vw - 2.5rem));
  padding: 0.9rem 1rem 0.85rem 1.1rem;
  border-radius: 22px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 26px 60px -22px rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  gap: 0.68rem;
  text-align: left;
  transition: box-shadow 300ms ease, border-color 300ms ease;
}

.prompt-box.is-focus {
  border-color: #E2B878;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 2px #E2B878,
    -14px 0 38px -10px rgba(226, 184, 120, 0.25),
    0 12px 42px -8px rgba(96, 165, 250, 0.22),
    14px 0 38px -10px rgba(52, 211, 153, 0.22);
}

.prompt-top,
.prompt-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.model-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.24rem 0.68rem;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(226, 184, 120, 0.18), rgba(96, 165, 250, 0.16));
  border: 1px solid rgba(226, 184, 120, 0.45);
  color: #F5F5F7;
  font-size: 0.73rem;
  font-weight: 600;
}

.spark-icon { color: #E2B878; }

.ctx-pill {
  padding: 0.2rem 0.58rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-mono);
  font-size: 0.67rem;
  color: #9CA3AF;
}

.ctx-pill.lit {
  color: #6EE7B7;
  border-color: rgba(52, 211, 153, 0.45);
}

.prompt-field {
  position: relative;
  min-height: 2.95rem;
  font-size: clamp(0.88rem, 1.65vw, 1.04rem);
  line-height: 1.5;
  color: #F5F5F7;
  word-break: break-word;
}

.prompt-text { white-space: pre-wrap; }

.prompt-caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: #60A5FA;
  opacity: 0;
}

.prompt-caret.on {
  opacity: 1;
  animation: blinkCaret 0.9s step-end infinite;
}

@keyframes blinkCaret { 50% { opacity: 0; } }

.prompt-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  color: #6B7280;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.38rem;
}

.attach-chip {
  font-size: 0.7rem;
  font-weight: 600;
  color: #D1D5DB;
  padding: 0.24rem 0.56rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.11);
}

.submit-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.48rem 1rem;
  border-radius: 999px;
  border: none;
  background: rgba(226, 184, 120, 0.28);
  color: rgba(5, 5, 7, 0.75);
  font-family: inherit;
  font-size: 0.81rem;
  font-weight: 700;
  transition: background-color 240ms ease, color 240ms ease, transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.submit-btn.ready {
  background: #E2B878;
  color: #050507;
}

.submit-btn.pressed { transform: scale(0.94); }

.shockwave {
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 2px solid #60A5FA;
  pointer-events: none;
  animation: shock 620ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shock {
  0% { transform: scale(1); opacity: 0.95; }
  100% { transform: scale(3.6); opacity: 0; }
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
   PHASE 02B: TACTILE FILTER PILLS & USER RESEARCH BENTO ([00:00:33])
   ========================================================= */
.filter-pill-bar {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.32rem 0.45rem;
  border-radius: 999px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.filter-pill {
  padding: 0.32rem 0.85rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.74rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: all 240ms ease;
}

.filter-pill.is-active-gold {
  background: rgba(226, 184, 120, 0.16);
  border-color: #E2B878;
  color: #F5F5F7;
  box-shadow: 0 0 18px rgba(226, 184, 120, 0.25);
}

.filter-pill.is-active-emerald {
  background: rgba(52, 211, 153, 0.18);
  border-color: #34D399;
  color: #F5F5F7;
  box-shadow: 0 0 22px rgba(52, 211, 153, 0.35);
}

.filter-pill.is-pressed {
  transform: scale(0.94);
}

.pill-cursor {
  position: absolute;
  left: 50%;
  top: 50%;
  pointer-events: none;
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.75));
}

.bento-research {
  width: min(740px, calc(100vw - 2.5rem));
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.62rem;
  text-align: left;
}

@media (min-width: 640px) {
  .bento-research {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  .bento-wide {
    grid-column: 1 / -1;
  }
}

.bento-card {
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
}

.bc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bc-tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: #9CA3AF;
  letter-spacing: 0.05em;
}

.bc-trend {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  color: #34D399;
}

.bc-sus {
  font-family: var(--font-mono);
  font-size: 0.69rem;
  font-weight: 700;
  color: #E2B878;
}

.bc-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.bc-num {
  font-size: clamp(1.45rem, 2.5vw, 1.95rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.bc-num.is-emerald { color: #34D399; }
.bc-num.is-ice { color: #F5F5F7; }

.sparkline-svg {
  width: 94px;
  height: 28px;
}

.bc-badge-gold {
  font-size: 0.71rem;
  font-weight: 700;
  padding: 0.18rem 0.54rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.14);
  color: #E2B878;
}

.bc-sub {
  font-size: 0.72rem;
  color: #A1A7B3;
}

.sus-bar-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.sus-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #E2B878, #34D399);
}

.bc-flow-status {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 600;
  color: #9CA3AF;
}

.bc-flow-status.simplified {
  color: #6EE7B7;
}

.flow-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.32rem;
  flex-wrap: wrap;
  padding-top: 0.1rem;
}

.f-chip {
  padding: 0.22rem 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.16);
  font-size: 0.68rem;
  color: #9CA3AF;
}

.f-arr {
  font-size: 0.7rem;
  color: #6B7280;
}

.f-node {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.68rem;
  border-radius: 999px;
  background: #0B0D12;
  border: 1px solid rgba(96, 165, 250, 0.45);
  font-size: 0.72rem;
  font-weight: 600;
  color: #F5F5F7;
}

.f-node.is-gold { border-color: rgba(226, 184, 120, 0.55); }
.f-node.is-emerald { border-color: rgba(52, 211, 153, 0.55); color: #D1FAE5; }

.f-connector {
  flex: 1;
  min-width: 14px;
  height: 2px;
  background: linear-gradient(90deg, #60A5FA, #34D399);
}

.f-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.f-dot.blue { background: #60A5FA; }
.f-dot.gold { background: #E2B878; }
.f-dot.emerald { background: #34D399; }

/* =========================================================
   PHASE 03B: FLAT 2D FIGMA WORKSPACE & MODE PILLS
   ========================================================= */
.figma-workspace {
  width: min(780px, calc(100vw - 2.5rem));
  border-radius: 18px;
  background: rgba(14, 16, 21, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 28px 64px -22px rgba(0, 0, 0, 0.9);
  overflow: hidden;
  text-align: left;
}

.figma-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.55rem 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.fh-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fh-dots {
  display: inline-flex;
  gap: 4px;
}

.fh-dots i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
}

.fh-file {
  font-family: var(--font-mono);
  font-size: 0.69rem;
  font-weight: 600;
  color: #D1D5DB;
}

.mode-pills {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 3px;
  border-radius: 999px;
  background: #0A0C10;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.mode-pill {
  padding: 0.22rem 0.65rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.69rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: all 240ms ease;
}

.mode-pill.active {
  background: rgba(255, 255, 255, 0.08);
  color: #F5F5F7;
}

.mode-pill.active-hc {
  background: rgba(226, 184, 120, 0.18);
  border-color: #E2B878;
  color: #F5F5F7;
  box-shadow: 0 0 16px rgba(226, 184, 120, 0.3);
}

.mode-pill.pressed { transform: scale(0.94); }

.fh-wcag {
  display: none;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 700;
  color: #6EE7B7;
}

@media (min-width: 640px) {
  .fh-wcag { display: inline-block; }
}

.figma-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
  padding: 0.95rem 0.9rem;
  align-items: center;
}

@media (min-width: 720px) {
  .figma-body {
    grid-template-columns: 148px 1fr 156px;
    padding: 1.2rem 1.1rem;
  }
}

.figma-panel {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.38rem;
  padding: 0.45rem 0.6rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

@media (min-width: 720px) {
  .figma-panel {
    flex-direction: column;
    align-items: stretch;
    gap: 0.4rem;
    padding: 0.65rem 0.72rem;
    border-radius: 12px;
  }
}

.fp-title {
  font-family: var(--font-mono);
  font-size: 0.61rem;
  font-weight: 700;
  color: #8B92A0;
  letter-spacing: 0.08em;
  margin-right: 0.25rem;
}

@media (min-width: 720px) {
  .fp-title { margin-right: 0; margin-bottom: 0.12rem; }
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 0.34rem;
  padding: 0.2rem 0.44rem;
  border-radius: 6px;
  font-size: 0.68rem;
  color: #9CA3AF;
}

.layer-item.is-active {
  background: rgba(226, 184, 120, 0.14);
  color: #F5F5F7;
  font-weight: 600;
}

.li-icon {
  font-family: var(--font-mono);
  color: #E2B878;
}

.figma-stage-center {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.6rem;
}

.selection-frame {
  position: relative;
  width: 100%;
  max-width: 390px;
  padding: 0.8rem 0.95rem;
  border: 1.5px dashed rgba(96, 165, 250, 0.75);
  transition: border-color 300ms ease, background-color 300ms ease;
}

.selection-frame.is-polished {
  border-style: solid;
  border-color: #E2B878;
  background: rgba(226, 184, 120, 0.04);
}

.handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #F5F5F7;
  border: 1.5px solid #60A5FA;
}
.selection-frame.is-polished .handle { border-color: #E2B878; }
.h-tl { top: -5px; left: -5px; }
.h-tr { top: -5px; right: -5px; }
.h-bl { bottom: -5px; left: -5px; }
.h-br { bottom: -5px; right: -5px; }

.redline {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.59rem;
  font-weight: 700;
  padding: 0.05rem 0.32rem;
  border-radius: 4px;
  background: #F43F5E;
  color: #FFFFFF;
}
.r-top { top: -19px; left: 50%; transform: translateX(-50%); }
.r-side { left: -16px; top: 50%; transform: translateY(-50%); }

@media (min-width: 520px) {
  .r-side { left: -28px; }
}

.ui-preview-card {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  padding: 0.65rem 0.8rem;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.03);
  transition: all 300ms ease;
}

.ui-preview-card.is-hc {
  border-style: solid;
  border-color: rgba(226, 184, 120, 0.55);
  background: #0B0D12;
  box-shadow: 0 12px 28px -12px rgba(226, 184, 120, 0.3);
}

.upc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.upc-kicker {
  font-family: var(--font-mono);
  font-size: 0.61rem;
  font-weight: 700;
  color: #9CA3AF;
}

.upc-chip {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.1rem 0.42rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  color: #D1D5DB;
}

.ui-preview-card.is-hc .upc-chip {
  background: rgba(52, 211, 153, 0.16);
  color: #6EE7B7;
}

.upc-title {
  font-size: 0.86rem;
  font-weight: 700;
  color: #F5F5F7;
}

.upc-bar {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.upc-bar-fill {
  width: 60%;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  transition: width 340ms ease;
}

.ui-preview-card.is-hc .upc-bar-fill {
  width: 100%;
  background: linear-gradient(90deg, #E2B878, #34D399);
}

.ship-row {
  display: flex;
  justify-content: center;
}

.ship-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.85rem;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(226, 184, 120, 0.18), rgba(52, 211, 153, 0.16));
  border: 1px solid rgba(226, 184, 120, 0.55);
  font-size: 0.72rem;
  font-weight: 700;
  color: #F5F5F7;
  box-shadow: 0 0 20px rgba(226, 184, 120, 0.2);
  transition: transform 180ms ease;
}

.ship-pill.pressed {
  transform: scale(0.93);
}

.figma-cursor {
  position: absolute;
  left: 50%;
  top: 50%;
  pointer-events: none;
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.75));
}

.token-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: #D1D5DB;
}

.sw {
  width: 11px;
  height: 11px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  display: inline-block;
}

.token-spec {
  font-family: var(--font-mono);
  font-size: 0.63rem;
  color: #E2B878;
}

/* =========================================================
   PHASE 04A: LIVING PORTFOLIO & VOLTREP FRONT-END ([00:00:38])
   ========================================================= */
.live-navbar-pill {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 84px);
  padding: 4px;
  border-radius: 999px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.13);
}

@media (min-width: 520px) {
  .live-navbar-pill {
    grid-template-columns: repeat(4, 98px);
  }
}

.nav-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 84px;
  height: calc(100% - 8px);
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.22);
  border: 1px solid rgba(226, 184, 120, 0.55);
  box-shadow: 0 0 18px rgba(226, 184, 120, 0.25);
  transition: transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (min-width: 520px) {
  .nav-thumb { width: 98px; }
}

.nav-item {
  position: relative;
  z-index: 1;
  padding: 0.36rem 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: color 220ms ease;
}

.nav-item.active { color: #F5F5F7; }

.frontend-showcase {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
}

.volt-card,
.case-card {
  position: relative;
  width: min(330px, calc(100vw - 2.5rem));
  padding: 0.9rem 1.05rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease, box-shadow 300ms ease;
}

.volt-card.done {
  border-color: rgba(52, 211, 153, 0.62);
  box-shadow: 0 24px 52px -18px rgba(52, 211, 153, 0.28);
}

.vc-head,
.cc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
}

.vc-brand,
.cc-tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: #E2B878;
  letter-spacing: 0.05em;
}

.vc-status {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.14rem 0.52rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  color: #D1D5DB;
}

.vc-status.done {
  background: rgba(52, 211, 153, 0.2);
  border: 1px solid rgba(52, 211, 153, 0.45);
  color: #6EE7B7;
}

.vc-exercise,
.cc-title {
  font-size: 0.94rem;
  font-weight: 700;
  color: #F5F5F7;
}

.vc-logger-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.vc-metric {
  display: flex;
  flex-direction: column;
}

.vc-val {
  font-size: 1.15rem;
  font-weight: 800;
  color: #E2B878;
}

.vc-sub {
  font-size: 0.7rem;
  color: #9CA3AF;
}

.vc-check-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: #9CA3AF;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease, background-color 240ms ease, color 240ms ease, border-color 240ms ease;
}

.vc-check-btn.clicked { transform: scale(0.9); }
.vc-check-btn.done {
  background: #34D399;
  border-color: #34D399;
  color: #050507;
  box-shadow: 0 0 16px rgba(52, 211, 153, 0.45);
}

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
  transition: width 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.case-card.hover {
  transform: translate3d(0, -4px, 0);
  border-color: rgba(226, 184, 120, 0.65);
  box-shadow: 0 28px 58px -18px rgba(226, 184, 120, 0.28);
}

.cc-pill {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 0.14rem 0.5rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.14);
  color: #E2B878;
}

.cc-specs {
  font-family: var(--font-mono);
  font-size: 0.71rem;
  color: #6EE7B7;
}

.cc-cta {
  margin-top: 0.12rem;
  font-size: 0.77rem;
  font-weight: 700;
  color: #E2B878;
}

.fe-cursor {
  position: absolute;
  left: 50%;
  top: 52%;
  pointer-events: none;
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.75));
}

/* =========================================================
   PHASE 04B: ICONIC GEMINI-ERA SIGN-OFF ([00:00:55])
   ========================================================= */
.signoff-layer {
  gap: 0.7rem;
}

.signoff-sparkle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(2.1rem, 4.5vw, 3.4rem);
  color: #E2B878;
  filter: drop-shadow(0 0 22px rgba(226, 184, 120, 0.65));
}

.signoff-title {
  font-size: clamp(2.4rem, 6vw, 5.1rem);
  font-weight: 800;
  letter-spacing: -0.038em;
  line-height: 1.04;
  background: linear-gradient(92deg, #F5F5F7 15%, #E2B878 88%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
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
  gap: 0.62rem;
}

.identity-line {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
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
  .aurora-wave,
  .prompt-caret.on,
  .shimmer-bar,
  .shockwave {
    animation: none !important;
  }
}
</style>
