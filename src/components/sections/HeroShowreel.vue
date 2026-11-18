<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

// 25.5s Slow-Paced Editorial Motion Loop (~6.0s–6.5s per phase, STRICTLY ZERO overlap between phases)
// PHASE 01: 0.00s – 5.45s (CREATIVE AI)        | Beam 1: 5.40s – 6.10s (Gold -> Emerald)
// PHASE 02: 6.00s – 11.95s (USER RESEARCH)     | Beam 2: 11.90s – 12.60s (Gold -> Cyan)
// PHASE 03: 12.50s – 18.45s (UX/UI DESIGN)     | Beam 3: 18.40s – 19.10s (Ice White -> Gold)
// PHASE 04: 19.00s – 24.95s (MOTION/FRONT-END) | Beam 4: 24.90s – 25.50s (Closing Beam -> Prompt)

const LOOP_SEC = 25.5
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

// Strictly non-overlapping phase envelope: Phase N exits completely before Phase N+1 enters
const phaseEnvelope = (s, start, end, enterDur = 0.55, exitDur = 0.45) => {
  if (s < start || s >= end) return { visible: false, opacity: 0, y: 12, scale: 0.985 }
  const enterK = easeOutExpo((s - start) / enterDur)
  const exitK = s > end - exitDur ? easeInOutCubic((s - (end - exitDur)) / exitDur) : 0
  const opacity = clamp(enterK * (1 - exitK))
  const y = (1 - enterK) * 14 - exitK * 10
  const scale = 0.985 + enterK * 0.015 - exitK * 0.015
  return { visible: true, opacity, y, scale }
}

// =========================================================
// LUMINOUS COLORED LIGHT BEAMS (4 Phase-Bridge Transitions)
// =========================================================
const beamState = computed(() => {
  const s = sec.value
  const beams = [
    { id: 1, start: 5.3, end: 6.1, theme: 'beam-gold-emerald', label: 'GENERATING RESEARCH TELEMETRY' },
    { id: 2, start: 11.8, end: 12.6, theme: 'beam-gold-cyan', label: 'SYNTHESIZING 2D FIGMA ARCHITECTURE' },
    { id: 3, start: 18.3, end: 19.1, theme: 'beam-white-gold', label: 'COMPILING 60FPS VUE 3 FRONT-END' },
    { id: 4, start: 24.8, end: 25.5, theme: 'beam-emerald-gold', label: 'LOOPING TO CREATIVE AI AGENT' },
  ]
  for (const b of beams) {
    if (s >= b.start && s <= b.end) {
      const p = clamp((s - b.start) / (b.end - b.start))
      const env = Math.sin(p * Math.PI)
      return {
        active: true,
        id: b.id,
        theme: b.theme,
        label: b.label,
        progress: p,
        opacity: clamp(env * 1.25),
        dashOffset: (1 - easeInOutCubic(p)) * 1200,
        orbX: easeInOutCubic(p) * 100,
      }
    }
  }
  return { active: false, id: 0, theme: '', label: '', progress: 0, opacity: 0, dashOffset: 1200, orbX: 0 }
})

// =========================================================
// PHASE 01 (0.00s – 5.48s) — CREATIVE AI (Realistic Prompt Box)
// =========================================================
const FULL_PROMPT = 'Design a high-contrast workout app with zero cognitive friction...'

const p1 = computed(() => phaseEnvelope(sec.value, 0.0, 5.48, 0.5, 0.42))

const hovered = computed(() => sec.value >= 0.45 && sec.value < 5.45)
const focused = computed(() => sec.value >= 0.75 && sec.value < 5.35)

const typedText = computed(() => {
  const p = clamp((sec.value - 0.85) / 2.65)
  const count = Math.floor(p * FULL_PROMPT.length)
  return FULL_PROMPT.slice(0, count)
})

const tokenCount = computed(() => Math.round(typedText.value.length * 1.8))
const submitReady = computed(() => typedText.value.length >= FULL_PROMPT.length - 1)
const submitPressed = computed(() => sec.value >= 4.65 && sec.value < 5.05)
const submitRipple = computed(() => sec.value >= 4.65 && sec.value < 5.45)

// Gentle camera zoom (scale 1.18) as requested
const camZoom = computed(() => {
  const s = sec.value
  const zIn = easeInOutCubic((s - 4.1) / 0.7) * 0.18
  return (1 + zIn) * p1.value.scale
})

const boxW = computed(() => Math.min(680, viewW.value * 0.9))

const bez = (p0, p1, p2, k) => ({
  x: (1 - k) * (1 - k) * p0.x + 2 * (1 - k) * k * p1.x + k * k * p2.x,
  y: (1 - k) * (1 - k) * p0.y + 2 * (1 - k) * k * p1.y + k * k * p2.y,
})

const promptCursor = computed(() => {
  const s = sec.value
  const w = boxW.value
  const start = { x: -w * 0.3, y: 115 }
  const input = { x: -w * 0.12, y: 2 }
  const btn = { x: w / 2 - 64, y: 42 }
  let pos
  if (s < 0.75) {
    pos = bez(start, { x: -w * 0.3, y: 24 }, input, easeInOutCubic(s / 0.75))
  } else if (s < 3.85) {
    pos = { x: input.x + Math.sin(s * 1.4) * 3, y: input.y }
  } else {
    pos = bez(input, { x: w * 0.1, y: -18 }, btn, easeInOutCubic((s - 3.85) / 0.75))
  }
  const ibeam = s >= 0.7 && s < 3.85
  const scale = submitPressed.value ? 0.88 : 1
  return { x: pos.x, y: pos.y, ibeam, scale }
})

// =========================================================
// PHASE 02 (6.00s – 11.98s) — USER RESEARCH (4 Bento Cards + 2.8s Hold)
// =========================================================
const p2 = computed(() => phaseEnvelope(sec.value, 6.0, 11.98, 0.55, 0.45))
const rl = computed(() => Math.max(0, sec.value - 6.0))
const mFriction = computed(() => Math.round(easeOutExpo((rl.value - 0.2) / 1.35) * 42))
const mTask = computed(() => (easeOutExpo((rl.value - 0.25) / 1.4) * 98.4).toFixed(1))
const mSus = computed(() => Math.round(easeOutExpo((rl.value - 0.3) / 1.45) * 91))
const flowStep = computed(() => (rl.value < 1.0 ? 0 : rl.value < 1.9 ? 1 : 2))

// =========================================================
// PHASE 03 (12.50s – 18.48s) — UX/UI DESIGN (Strictly Flat 2D Figma Canvas)
// =========================================================
const p3 = computed(() => phaseEnvelope(sec.value, 12.5, 18.48, 0.55, 0.45))
const fl = computed(() => Math.max(0, sec.value - 12.5))
const figmaHighContrast = computed(() => fl.value >= 2.15)
const figmaCursorK = computed(() => easeInOutCubic((fl.value - 0.9) / 1.15))
const figmaClick = computed(() => fl.value >= 2.0 && fl.value < 2.35)
const readyPulse = computed(() => fl.value >= 3.2)

// =========================================================
// PHASE 04 (19.00s – 24.98s) — MOTION & FRONT-END (Voltrep + Nav + Case Card)
// =========================================================
const p4 = computed(() => phaseEnvelope(sec.value, 19.0, 24.98, 0.55, 0.45))
const pl = computed(() => Math.max(0, sec.value - 19.0))
const voltCheckClick = computed(() => pl.value >= 1.65 && pl.value < 1.98)
const voltDone = computed(() => pl.value >= 1.8)
const navIdx = computed(() => (pl.value < 1.2 ? 0 : pl.value < 2.4 ? 1 : 2))
const caseHover = computed(() => pl.value >= 2.3 && pl.value < 5.3)
const p4CursorPos = computed(() => {
  // Moves from Voltrep checkmark to Case Study card and rests comfortably
  const k = easeInOutCubic((pl.value - 1.85) / 0.95)
  return {
    x: -55 + k * 235,
    y: 12 + k * 24,
  }
})

const ambientTheme = computed(() => {
  const s = sec.value
  if (s < 5.8) return 'ambient-ai'
  if (s < 12.25) return 'ambient-research'
  if (s < 18.75) return 'ambient-figma'
  return 'ambient-frontend'
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
    elapsedMs.value = 22200
  } else {
    elapsedMs.value = 2300 // starts mid-typing with champagne-gold focus ring active
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
             LUMINOUS COLORED LIGHT BEAM TRANSITION LAYER
             Sweeps cleanly across the stage between phases (zero overlap)
             ========================================================= -->
        <div
          v-if="beamState.active"
          class="beam-stage"
          :class="beamState.theme"
          :style="{ opacity: beamState.opacity }"
          aria-hidden="true"
        >
          <svg class="beam-svg" viewBox="0 0 1200 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradGoldEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#E2B878" stop-opacity="0" />
                <stop offset="45%" stop-color="#E2B878" stop-opacity="1" />
                <stop offset="85%" stop-color="#34D399" stop-opacity="1" />
                <stop offset="100%" stop-color="#F5F5F7" stop-opacity="0.95" />
              </linearGradient>
              <linearGradient id="gradGoldCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#34D399" stop-opacity="0" />
                <stop offset="45%" stop-color="#E2B878" stop-opacity="1" />
                <stop offset="85%" stop-color="#38BDF8" stop-opacity="1" />
                <stop offset="100%" stop-color="#F5F5F7" stop-opacity="0.95" />
              </linearGradient>
              <linearGradient id="gradWhiteGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#E2B878" stop-opacity="0" />
                <stop offset="45%" stop-color="#F5F5F7" stop-opacity="1" />
                <stop offset="88%" stop-color="#E2B878" stop-opacity="1" />
                <stop offset="100%" stop-color="#34D399" stop-opacity="0.95" />
              </linearGradient>
              <linearGradient id="gradEmeraldGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#34D399" stop-opacity="0" />
                <stop offset="50%" stop-color="#34D399" stop-opacity="1" />
                <stop offset="90%" stop-color="#E2B878" stop-opacity="1" />
                <stop offset="100%" stop-color="#F5F5F7" stop-opacity="0.95" />
              </linearGradient>
            </defs>

            <!-- Soft outer energy ribbon -->
            <path
              class="beam-glow-path"
              d="M 40 135 C 340 45, 860 175, 1160 85"
              fill="none"
              stroke-width="10"
              stroke-linecap="round"
              :style="{ strokeDasharray: 1200, strokeDashoffset: beamState.dashOffset }"
            />
            <!-- Razor-sharp inner core -->
            <path
              class="beam-core-path"
              d="M 40 135 C 340 45, 860 175, 1160 85"
              fill="none"
              stroke-width="3"
              stroke-linecap="round"
              :style="{ strokeDasharray: 1200, strokeDashoffset: beamState.dashOffset }"
            />
          </svg>
          <div class="beam-badge">
            <span class="beam-spark" />
            <span>{{ beamState.label }}</span>
          </div>
        </div>

        <!-- =========================================================
             PHASE 01 (0.0s – 5.5s) — CREATIVE AI & THE PROMPT BOX
             ========================================================= -->
        <div
          v-show="p1.visible"
          ref="layerRef"
          class="camera-layer layer-prompt"
          :style="{
            opacity: p1.opacity,
            transform: `translate3d(0, ${p1.y.toFixed(1)}px, 0) scale(${camZoom.toFixed(3)})`,
            transformOrigin: camOrigin,
          }"
        >
          <span class="seq-kicker is-gold">CREATIVE AI // GENERATIVE UI WORKFLOW</span>
          <h1 class="seq-title">
            <span class="tone-ice">CREATIVE</span>
            <span class="tone-gold">AI.</span>
          </h1>

          <div
            ref="boxRef"
            class="prompt-box"
            :class="{ 'is-hover': hovered, 'is-focus': focused }"
          >
            <div class="prompt-top">
              <span class="model-pill"><span aria-hidden="true">✦</span> AI Design Agent</span>
              <span class="ctx-pill tabular-nums" :class="{ lit: typedText.length > 0 }">
                {{ tokenCount }} tokens · Ready
              </span>
            </div>

            <div class="prompt-field">
              <span class="prompt-text">{{ typedText }}</span><span class="prompt-caret" :class="{ on: focused }" aria-hidden="true" />
              <span v-if="!typedText && !focused" class="prompt-placeholder">Describe a high-contrast interface…</span>
            </div>

            <div class="prompt-bottom">
              <div class="chip-group" aria-hidden="true">
                <span class="attach-chip">❖ Figma Tokens</span>
                <span class="attach-chip">✓ WCAG AA</span>
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

            <!-- High-DPI Screen-Studio vector cursor -->
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
             PHASE 02 (6.0s – 12.0s) — USER RESEARCH (4 Bento Cards)
             ========================================================= -->
        <div
          v-if="p2.visible"
          class="camera-layer"
          :style="{
            opacity: p2.opacity,
            transform: `translate3d(0, ${p2.y.toFixed(1)}px, 0) scale(${p2.scale.toFixed(3)})`,
          }"
        >
          <span class="seq-kicker is-emerald">COGNITIVE ERGONOMICS // EMPIRICAL VALIDATION</span>
          <h1 class="seq-title">
            <span class="tone-ice">USER</span>
            <span class="tone-emerald">RESEARCH</span>
          </h1>

          <div class="bento-research">
            <!-- Card 1: KPI Card + Sparkline -->
            <div class="glass-panel bento-card">
              <div class="bc-top">
                <span class="bc-tag">KPI · COGNITIVE LOAD</span>
                <span class="bc-trend is-emerald">↓ Optimal</span>
              </div>
              <div class="bc-main-row">
                <span class="bc-num is-emerald tabular-nums">-{{ mFriction }}%</span>
                <svg class="sparkline-svg" viewBox="0 0 110 34" fill="none" aria-hidden="true">
                  <path d="M4 6 L32 12 L58 10 L82 24 L106 29" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="106" cy="29" r="3.5" fill="#34D399" />
                </svg>
              </div>
              <span class="bc-sub">Cognitive Friction across primary workout flows</span>
            </div>

            <!-- Card 2: Usability Card + SUS Progress Bar -->
            <div class="glass-panel bento-card">
              <div class="bc-top">
                <span class="bc-tag">USABILITY BENCHMARK</span>
                <span class="bc-Sus tabular-nums">SUS Score {{ mSus }}/100</span>
              </div>
              <div class="bc-main-row">
                <span class="bc-num is-ice tabular-nums">{{ mTask }}%</span>
                <span class="bc-badge-gold">Task Completion</span>
              </div>
              <div class="sus-bar-track" aria-hidden="true">
                <div class="sus-bar-fill" :style="{ width: `${mSus}%` }" />
              </div>
            </div>

            <!-- Card 3: 3-Node Horizontal User Flow Map -->
            <div class="glass-panel bento-card bento-wide">
              <div class="bc-top">
                <span class="bc-tag">USER JOURNEY ARCHITECTURE</span>
                <span class="bc-meta tabular-nums">3 Validated Stages</span>
              </div>
              <div class="journey-map">
                <svg class="journey-line" viewBox="0 0 500 16" preserveAspectRatio="none" aria-hidden="true">
                  <line x1="20" y1="8" x2="480" y2="8" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
                  <line x1="20" y1="8" x2="480" y2="8" stroke="url(#jGrad)" stroke-width="2.5" class="journey-active-line" />
                  <defs>
                    <linearGradient id="jGrad" x1="0" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#34D399" />
                      <stop offset="1" stop-color="#E2B878" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="journey-nodes">
                  <span class="j-node" :class="{ lit: flowStep >= 0 }"><i class="j-dot" />1. Discover</span>
                  <span class="j-node" :class="{ lit: flowStep >= 1 }"><i class="j-dot gold" />2. Validate</span>
                  <span class="j-node" :class="{ lit: flowStep >= 2 }"><i class="j-dot emerald" />3. Simplify ✓</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 4: Heuristic Insight Pill -->
          <div class="heuristic-pill">
            <span class="hp-check" aria-hidden="true">✓</span>
            <span>Zero Dead-Ends · Clear Visual Hierarchy · High-Contrast Readability</span>
          </div>
        </div>

        <!-- =========================================================
             PHASE 03 (12.5s – 18.5s) — UX/UI DESIGN (Strictly Flat 2D Figma Workspace)
             ========================================================= -->
        <div
          v-if="p3.visible"
          class="camera-layer"
          :style="{
            opacity: p3.opacity,
            transform: `translate3d(0, ${p3.y.toFixed(1)}px, 0) scale(${p3.scale.toFixed(3)})`,
          }"
        >
          <span class="seq-kicker is-gold">DESIGN SYSTEMS // FLAT 2D ARCHITECTURAL PRECISION</span>
          <h1 class="seq-title">
            <span class="tone-ice">UX/UI</span>
            <span class="tone-gold">DESIGN</span>
          </h1>

          <div class="figma-workspace">
            <div class="figma-header">
              <div class="fh-left">
                <span class="fh-dots" aria-hidden="true"><i /><i /><i /></span>
                <span class="fh-file tabular-nums">Voltrep_Design_System.fig</span>
              </div>
              <div class="fh-center tabular-nums">Auto Layout · 8pt Grid · WCAG AA</div>
              <span class="fh-dev-badge" :class="{ pulse: readyPulse }">
                <i class="dev-dot" />Ready for Dev
              </span>
            </div>

            <div class="figma-body">
              <!-- Left Mini Layers Panel -->
              <div class="figma-panel figma-layers" aria-hidden="true">
                <div class="fp-title">LAYERS</div>
                <div class="layer-item is-active"><span class="li-icon">#</span> Frame / Hero</div>
                <div class="layer-item"><span class="li-icon">⊞</span> Auto Layout</div>
                <div class="layer-item"><span class="li-icon">❖</span> Design Tokens</div>
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
                      <span class="upc-kicker">WORKOUT TRACKER COMPONENT</span>
                      <span class="upc-chip tabular-nums">{{ figmaHighContrast ? 'Contrast 14.8:1 ✓' : 'Wireframe Draft' }}</span>
                    </div>
                    <div class="upc-title">Barbell Bench Press · 85 kg × 8</div>
                    <div class="upc-bar"><div class="upc-bar-fill" /></div>
                  </div>
                </div>

                <!-- Live Toggle Switch + Cursor -->
                <div class="toggle-bar">
                  <div class="variant-switch" :class="{ active: figmaHighContrast, pressed: figmaClick }">
                    <span class="vs-label" :class="{ dim: figmaHighContrast }">Wireframe</span>
                    <span class="vs-track"><span class="vs-thumb" /></span>
                    <span class="vs-label" :class="{ gold: figmaHighContrast }">High-Contrast UI</span>

                    <svg
                      class="figma-cursor"
                      :style="{ transform: `translate3d(${(-90 + figmaCursorK * 84).toFixed(1)}px, ${(44 - figmaCursorK * 38).toFixed(1)}px, 0)` }"
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

              <!-- Right Design Token Swatches -->
              <div class="figma-panel figma-tokens" aria-hidden="true">
                <div class="fp-title">TOKENS</div>
                <div class="token-row"><i class="sw" style="background:#050507" /><span>#050507</span></div>
                <div class="token-row"><i class="sw" style="background:#E2B878" /><span>#E2B878</span></div>
                <div class="token-row"><i class="sw" style="background:#F5F5F7" /><span>#F5F5F7</span></div>
                <div class="token-spec">rounded-2xl · 8pt Grid</div>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             PHASE 04 (19.0s – 25.0s) — MOTION & FRONT-END (Voltrep + Portfolio)
             ========================================================= -->
        <div
          v-if="p4.visible"
          class="camera-layer"
          :style="{
            opacity: p4.opacity,
            transform: `translate3d(0, ${p4.y.toFixed(1)}px, 0) scale(${p4.scale.toFixed(3)})`,
          }"
        >
          <span class="seq-kicker is-gold">PRODUCTION ENGINEERING // 60FPS INTERACTIVE UI</span>
          <h1 class="seq-title">
            <span class="tone-gold">MOTION &amp;</span>
            <span class="tone-ice">FRONT-END</span>
          </h1>

          <!-- Elastic sliding pill navigation -->
          <div class="live-navbar-pill" aria-hidden="true">
            <span class="nav-thumb" :style="{ transform: `translate3d(${navIdx * 100}%, 0, 0)` }" />
            <span class="nav-item" :class="{ active: navIdx === 0 }">Overview</span>
            <span class="nav-item" :class="{ active: navIdx === 1 }">Case Studies</span>
            <span class="nav-item" :class="{ active: navIdx === 2 }">Journey</span>
          </div>

          <div class="frontend-showcase">
            <!-- Voltrep Workout Card -->
            <div class="glass-panel volt-card" :class="{ done: voltDone }">
              <div class="vc-head">
                <span class="vc-brand">VOLTREP · WORKOUT LOGGER</span>
                <span class="vc-status tabular-nums" :class="{ done: voltDone }">
                  {{ voltDone ? 'Completed ✓' : 'Set 4 of 4' }}
                </span>
              </div>

              <div class="vc-exercise">Barbell Bench Press</div>

              <div class="vc-logger-row">
                <div class="vc-metric tabular-nums">
                  <span class="vc-val">85 kg × 8 reps</span>
                  <span class="vc-sub">RPE 8.5 · Zero Rest Friction</span>
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
                <div class="vc-fill" :style="{ width: voltDone ? '100%' : '75%' }" />
              </div>
            </div>

            <!-- Portfolio Case Study Preview Card -->
            <div class="glass-panel case-card" :class="{ hover: caseHover }">
              <div class="cc-top">
                <span class="cc-tag">FEATURED CASE STUDY</span>
                <span class="cc-pill">Vue 3 · PWA</span>
              </div>
              <div class="cc-title">Voltrep &amp; Enterprise Design Systems</div>
              <div class="cc-specs">60 FPS · WCAG AA · Semantic Code</div>
              <div class="cc-cta">Explore Full Architecture →</div>
            </div>

            <!-- Shared cursor gliding from Voltrep checkmark to Case Study card -->
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

.ambient-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bloom {
  position: absolute;
  border-radius: 50%;
  filter: blur(105px);
  will-change: transform, opacity;
  transition: background 1.4s cubic-bezier(0.16, 1, 0.3, 1);
  animation: breathe 10s ease-in-out infinite alternate;
}

.bloom-1 {
  width: 56vw;
  height: 56vw;
  max-width: 760px;
  max-height: 760px;
  top: 8%;
  left: 20%;
  opacity: 0.085;
}

.bloom-2 {
  width: 44vw;
  height: 44vw;
  max-width: 580px;
  max-height: 580px;
  bottom: 6%;
  right: 12%;
  opacity: 0.07;
  animation-duration: 12s;
  animation-direction: alternate-reverse;
}

@keyframes breathe {
  0% { transform: scale(0.96) translate3d(0, 0, 0); }
  100% { transform: scale(1.06) translate3d(2%, -2%, 0); }
}

.ambient-ai .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .bloom-2 { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }
.ambient-research .bloom-1 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }
.ambient-research .bloom-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-figma .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-figma .bloom-2 { background: radial-gradient(circle, #38BDF8 0%, transparent 70%); }
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
  gap: 0.9rem;
  will-change: transform, opacity;
}

@media (min-width: 768px) {
  .camera-layer {
    gap: 1.05rem;
  }
}

/* =========================================================
   LUMINOUS COLORED LIGHT BEAM TRANSITION SYSTEM
   ========================================================= */
.beam-stage {
  position: relative;
  grid-area: 1 / 1;
  z-index: 10;
  width: min(960px, calc(100vw - 2.5rem));
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  will-change: opacity;
}

.beam-svg {
  width: 100%;
  height: 150px;
  overflow: visible;
}

.beam-glow-path {
  filter: blur(8px);
  opacity: 0.65;
}

.beam-core-path {
  filter: drop-shadow(0 0 14px rgba(226, 184, 120, 0.75));
}

.beam-gold-emerald .beam-glow-path,
.beam-gold-emerald .beam-core-path { stroke: url(#gradGoldEmerald); }

.beam-gold-cyan .beam-glow-path,
.beam-gold-cyan .beam-core-path { stroke: url(#gradGoldCyan); }

.beam-white-gold .beam-glow-path,
.beam-white-gold .beam-core-path { stroke: url(#gradWhiteGold); }

.beam-emerald-gold .beam-glow-path,
.beam-emerald-gold .beam-core-path { stroke: url(#gradEmeraldGold); }

.beam-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: rgba(14, 16, 21, 0.92);
  border: 1px solid rgba(226, 184, 120, 0.45);
  box-shadow: 0 0 30px rgba(226, 184, 120, 0.25);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #F5F5F7;
}

.beam-spark {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #E2B878;
  box-shadow: 0 0 12px #E2B878;
}

/* =========================================================
   TYPOGRAPHY & SHARED CARDS
   ========================================================= */
.seq-kicker {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.69rem;
  font-weight: 600;
  letter-spacing: 0.06em;
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
  gap: 0.2rem 0.7rem;
  font-size: clamp(2.1rem, 5.1vw, 4.35rem);
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
   PHASE 01: PROMPT COMPOSER
   ========================================================= */
.prompt-box {
  position: relative;
  width: min(680px, calc(100vw - 2.5rem));
  padding: 0.9rem 1rem 0.85rem 1.1rem;
  border-radius: 18px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 26px 60px -22px rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
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
  border-color: rgba(226, 184, 120, 0.78);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 0 2px #E2B878,
    0 20px 52px rgba(226, 184, 120, 0.16);
}

.prompt-top,
.prompt-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.model-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.24rem 0.65rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.13);
  border: 1px solid rgba(226, 184, 120, 0.38);
  color: #E2B878;
  font-size: 0.73rem;
  font-weight: 600;
}

.ctx-pill {
  padding: 0.2rem 0.58rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #9CA3AF;
}

.ctx-pill.lit {
  color: #6EE7B7;
  border-color: rgba(52, 211, 153, 0.45);
}

.prompt-field {
  position: relative;
  min-height: 3.1rem;
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
  background: #E2B878;
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
  gap: 0.4rem;
}

.attach-chip {
  font-size: 0.71rem;
  font-weight: 600;
  color: #D1D5DB;
  padding: 0.25rem 0.58rem;
  border-radius: 8px;
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

.submit-btn.pressed { transform: scale(0.92); }

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
  100% { transform: scale(3.8); opacity: 0; }
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
   PHASE 02: USER RESEARCH BENTO GRID
   ========================================================= */
.bento-research {
  width: min(740px, calc(100vw - 2.5rem));
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
  text-align: left;
}

@media (min-width: 640px) {
  .bento-research {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
  .bento-wide {
    grid-column: 1 / -1;
  }
}

.bento-card {
  padding: 0.85rem 1.05rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.bc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.bc-tag {
  font-family: var(--font-mono);
  font-size: 0.66rem;
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

.bc-Sus {
  font-family: var(--font-mono);
  font-size: 0.7rem;
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
  font-size: clamp(1.5rem, 2.7vw, 2.05rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.bc-num.is-emerald { color: #34D399; }
.bc-num.is-ice { color: #F5F5F7; }

.sparkline-svg {
  width: 96px;
  height: 30px;
}

.bc-badge-gold {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.14);
  color: #E2B878;
}

.bc-sub {
  font-size: 0.73rem;
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
  transition: width 300ms ease-out;
}

.bc-meta {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: #A1A7B3;
}

.journey-map {
  position: relative;
  padding-top: 0.15rem;
}

.journey-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  width: 100%;
  height: 14px;
  transform: translateY(-50%);
  pointer-events: none;
}

.journey-active-line {
  stroke-dasharray: 480;
  stroke-dashoffset: 480;
  animation: drawJ 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
}

@keyframes drawJ { to { stroke-dashoffset: 0; } }

.journey-nodes {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.j-node {
  display: inline-flex;
  align-items: center;
  gap: 0.36rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: #0B0D12;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.73rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: border-color 280ms ease, color 280ms ease;
}

.j-node.lit {
  border-color: rgba(226, 184, 120, 0.5);
  color: #F5F5F7;
}

.j-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #38BDF8;
}
.j-dot.gold { background: #E2B878; }
.j-dot.emerald { background: #34D399; }

.heuristic-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.38rem 0.9rem;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.38);
  font-size: 0.74rem;
  font-weight: 600;
  color: #D1FAE5;
}

.hp-check {
  color: #34D399;
  font-weight: 800;
}

/* =========================================================
   PHASE 03: FLAT 2D FIGMA WORKSPACE (ZERO 3D TILT)
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
  padding: 0.6rem 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.fh-left {
  display: flex;
  align-items: center;
  gap: 0.55rem;
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
  font-size: 0.7rem;
  font-weight: 600;
  color: #D1D5DB;
}

.fh-center {
  display: none;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #9CA3AF;
}

@media (min-width: 640px) {
  .fh-center { display: block; }
}

.fh-dev-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.14);
  border: 1px solid rgba(52, 211, 153, 0.42);
  font-family: var(--font-mono);
  font-size: 0.67rem;
  font-weight: 700;
  color: #6EE7B7;
  transition: box-shadow 300ms ease, transform 300ms ease;
}

.fh-dev-badge.pulse {
  box-shadow: 0 0 18px rgba(52, 211, 153, 0.45);
}

.dev-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34D399;
}

.figma-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
  padding: 1.15rem 1rem 1.05rem;
  align-items: center;
}

@media (min-width: 720px) {
  .figma-body {
    grid-template-columns: 148px 1fr 156px;
    padding: 1.35rem 1.15rem 1.2rem;
  }
}

.figma-panel {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.65rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

@media (min-width: 720px) {
  .figma-panel {
    flex-direction: column;
    align-items: stretch;
    gap: 0.42rem;
    padding: 0.65rem 0.75rem;
    border-radius: 12px;
  }
}

.fp-title {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  color: #8B92A0;
  letter-spacing: 0.08em;
  margin-right: 0.25rem;
}

@media (min-width: 720px) {
  .fp-title {
    margin-right: 0;
    margin-bottom: 0.15rem;
  }
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.22rem 0.45rem;
  border-radius: 6px;
  font-size: 0.69rem;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  padding: 0 0.6rem;
}

.selection-frame {
  position: relative;
  width: 100%;
  max-width: 390px;
  padding: 0.85rem 1rem;
  border: 1.5px dashed rgba(99, 102, 241, 0.75);
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
  border: 1.5px solid #6366F1;
}
.selection-frame.is-polished .handle { border-color: #E2B878; }
.h-tl { top: -5px; left: -5px; }
.h-tr { top: -5px; right: -5px; }
.h-bl { bottom: -5px; left: -5px; }
.h-br { bottom: -5px; right: -5px; }

.redline {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.06rem 0.34rem;
  border-radius: 4px;
  background: #F43F5E;
  color: #FFFFFF;
}
.r-top { top: -20px; left: 50%; transform: translateX(-50%); }
.r-side { left: -16px; top: 50%; transform: translateY(-50%); }

@media (min-width: 520px) {
  .r-side { left: -28px; }
}

.ui-preview-card {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.7rem 0.85rem;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.03);
  transition: all 320ms ease;
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
  font-size: 0.62rem;
  font-weight: 700;
  color: #9CA3AF;
}

.upc-chip {
  font-family: var(--font-mono);
  font-size: 0.63rem;
  font-weight: 700;
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  color: #D1D5DB;
}

.ui-preview-card.is-hc .upc-chip {
  background: rgba(52, 211, 153, 0.16);
  color: #6EE7B7;
}

.upc-title {
  font-size: 0.88rem;
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
  width: 65%;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  transition: width 360ms ease, background-color 360ms ease;
}

.ui-preview-card.is-hc .upc-bar-fill {
  width: 100%;
  background: linear-gradient(90deg, #E2B878, #34D399);
}

.toggle-bar {
  display: flex;
  justify-content: center;
}

.variant-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.32rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.13);
  font-size: 0.72rem;
  font-weight: 600;
  transition: transform 200ms ease, border-color 280ms ease;
}

.variant-switch.pressed { transform: scale(0.94); }
.variant-switch.active { border-color: rgba(226, 184, 120, 0.55); }

.vs-label { color: #D1D5DB; transition: color 240ms ease; }
.vs-label.dim { color: #6B7280; }
.vs-label.gold { color: #E2B878; }

.vs-track {
  width: 30px;
  height: 17px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  padding: 2px;
  display: flex;
  align-items: center;
  transition: background-color 260ms ease;
}

.variant-switch.active .vs-track { background: #34D399; }

.vs-thumb {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #FFFFFF;
  transition: transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.variant-switch.active .vs-thumb { transform: translate3d(13px, 0, 0); }

.figma-cursor {
  position: absolute;
  right: 8px;
  bottom: -14px;
  pointer-events: none;
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.7));
}

.token-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: #D1D5DB;
}

.sw {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  display: inline-block;
}

.token-spec {
  margin-top: 0.2rem;
  padding-top: 0.35rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  color: #E2B878;
}

/* =========================================================
   PHASE 04: MOTION & FRONT-END
   ========================================================= */
.live-navbar-pill {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 102px);
  padding: 4px;
  border-radius: 999px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.13);
}

.nav-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 102px;
  height: calc(100% - 8px);
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.22);
  border: 1px solid rgba(226, 184, 120, 0.55);
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

.frontend-showcase {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
  width: 100%;
}

.volt-card,
.case-card {
  position: relative;
  width: min(325px, calc(100vw - 2.5rem));
  padding: 0.95rem 1.1rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease, box-shadow 300ms ease;
}

.volt-card.done {
  border-color: rgba(52, 211, 153, 0.58);
  box-shadow: 0 24px 52px -18px rgba(52, 211, 153, 0.25);
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
  font-size: 0.66rem;
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
  background: rgba(52, 211, 153, 0.18);
  color: #6EE7B7;
}

.vc-exercise,
.cc-title {
  font-size: 0.95rem;
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
  font-size: 1.18rem;
  font-weight: 800;
  color: #E2B878;
}

.vc-sub {
  font-size: 0.71rem;
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

.vc-check-btn.clicked { transform: scale(0.88); }
.vc-check-btn.done {
  background: #34D399;
  border-color: #34D399;
  color: #050507;
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
  transition: width 460ms cubic-bezier(0.16, 1, 0.3, 1);
}

.case-card.hover {
  transform: translate3d(0, -4px, 0);
  border-color: rgba(226, 184, 120, 0.65);
  box-shadow: 0 28px 58px -18px rgba(226, 184, 120, 0.28);
}

.cc-pill {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  padding: 0.14rem 0.5rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.14);
  color: #E2B878;
}

.cc-specs {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #6EE7B7;
}

.cc-cta {
  margin-top: 0.15rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #E2B878;
}

.fe-cursor {
  position: absolute;
  left: 50%;
  top: 52%;
  pointer-events: none;
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.75));
  transition: transform 120ms linear;
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
  .bloom,
  .prompt-caret.on,
  .journey-active-line,
  .shockwave {
    animation: none !important;
    stroke-dashoffset: 0 !important;
  }
}
</style>
