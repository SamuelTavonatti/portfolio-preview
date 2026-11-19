<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

// 26.0s Bespoke Architectural Hero Showreel
// Strictly ZERO Google/Gemini symbols (no 4-point sparkles, no color-wheel halos, no "Welcome to...").
// Strictly ZERO clunky connecting lines between phases.
// Strictly ZERO overlapping elements between phases and ZERO 3D card tilts (flat 2D architectural precision).
// Opens immediately with UX/UI DESIGN (Phase 01).
//
// PHASE 01 (0.00s – 6.50s) — UX/UI DESIGN (Immediate Hero Opener)
//   Transition 1 (5.80s – 6.50s): Masked Curtain Wipe (clip-path: inset) + Glassmorphic Scanner Bar
// PHASE 02 (6.50s – 13.00s) — USER RESEARCH (Cognitive Ergonomics & Validation)
//   Transition 2 (12.25s – 13.25s): Center Pill Collapse -> Horizontal Expansion into AI Prompt Composer
// PHASE 03 (13.00s – 19.50s) — CREATIVE AI (AI-Augmented Product Workflows)
//   Transition 3 (18.85s – 19.85s): Soft Radial Light Pulse + Synchronized Horizontal Kinetic Push
// PHASE 04 (19.50s – 26.00s) — MOTION & FRONT-END (Living Portfolio & Voltrep)
//   Transition 4 (25.30s – 26.00s): Center-Outward Curtain Reveal back to UX/UI DESIGN

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
const lerp = (a, b, k) => a + (b - a) * k
const easeOutExpo = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * clamp(x)))
const easeInOutCubic = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

const sec = computed(() => (elapsedMs.value % LOOP_MS) / 1000)

// =========================================================
// PHASE 01 (0.00s – 6.42s) — UX/UI DESIGN (Immediate Hero Opener)
// Exit: Masked Curtain Wipe (clip-path: inset(0 ${wipe}% 0 0)) driven by glassmorphic scanner bar
// =========================================================
const p1State = computed(() => {
  const s = sec.value
  if (s >= 6.42) return { visible: false, opacity: 0, clipPath: 'inset(0 100% 0 0)', scale: 1 }
  // Seamless center-outward curtain arrival at 0.0s – 0.45s
  const enterK = s < 0.45 ? easeOutExpo(s / 0.45) : 1
  // Masked Curtain Wipe exit at 5.75s – 6.40s (wipes from right to left or left to right)
  const wipeK = s > 5.75 ? easeInOutCubic((s - 5.75) / 0.65) : 0
  const leftInset = (wipeK * 100).toFixed(2)
  const enterSide = ((1 - enterK) * 48).toFixed(2)
  const clipPath = s < 0.45
    ? `inset(0 ${enterSide}% 0 ${enterSide}%)`
    : `inset(0 0 0 ${leftInset}%)`
  return {
    visible: true,
    opacity: clamp(1 - Math.max(0, (s - 6.28) / 0.14)),
    clipPath,
    scale: 0.985 + enterK * 0.015,
  }
})

// Glassmorphic scanner bar sweeping across stage during Transition 1 (5.75s – 6.45s)
const scannerBar = computed(() => {
  const s = sec.value
  if (s < 5.72 || s > 6.48) return { active: false, xPct: 0, opacity: 0 }
  const k = easeInOutCubic((s - 5.75) / 0.65)
  const env = Math.sin(clamp((s - 5.72) / 0.76) * Math.PI)
  return {
    active: true,
    xPct: k * 100,
    opacity: clamp(env * 1.35),
  }
})

const p1HighContrast = computed(() => sec.value >= 1.85)
const p1ToggleClick = computed(() => sec.value >= 1.72 && sec.value < 2.02)
const p1CursorPos = computed(() => {
  const s = sec.value
  // Glides from lower-left onto "Production UI" pill toggle in header
  const k = easeInOutCubic(clamp((s - 0.55) / 1.15))
  return {
    x: -115 + k * 172,
    y: 34 - k * 110,
  }
})

// =========================================================
// PHASE 02 (6.45s – 12.62s) — USER RESEARCH (Cognitive Ergonomics & Validation)
// Enter: Uncovered after Masked Curtain Wipe (6.45s – 7.00s)
// Exit: Converges inward into a compact center pill (12.05s – 12.62s)
// =========================================================
const p2State = computed(() => {
  const s = sec.value
  if (s < 6.45 || s >= 12.62) {
    return { visible: false, opacity: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 18px)' }
  }
  const enterK = easeOutExpo((s - 6.45) / 0.55)
  const collapseK = s > 12.05 ? easeInOutCubic((s - 12.05) / 0.55) : 0
  const vInset = (collapseK * 43).toFixed(2)
  const hInset = (collapseK * 36).toFixed(2)
  const radius = Math.round(18 + collapseK * 32)
  const scale = (0.98 + enterK * 0.02) * (1 - collapseK * 0.24)
  return {
    visible: true,
    opacity: clamp(enterK * (1 - Math.pow(collapseK, 1.6))),
    scale,
    clipPath: `inset(${vInset}% ${hInset}% ${vInset}% ${hInset}% round ${radius}px)`,
  }
})

// Transition 2 morphing center pill bridge (12.35s – 13.15s)
const morphPillBridge = computed(() => {
  const s = sec.value
  if (s < 12.32 || s > 13.18) return { active: false, opacity: 0, widthPx: 220 }
  const p = clamp((s - 12.32) / 0.86)
  const env = Math.sin(p * Math.PI)
  const expandK = easeInOutCubic(clamp((s - 12.55) / 0.55))
  const targetW = Math.min(680, viewW.value * 0.9)
  return {
    active: true,
    opacity: clamp(env * 1.25),
    widthPx: lerp(190, targetW, expandK),
    heightPx: lerp(44, 152, expandK),
  }
})

const rl = computed(() => Math.max(0, sec.value - 6.45))
const mFriction = computed(() => Math.round(easeOutExpo((rl.value - 0.15) / 1.15) * 42))
const mTask = computed(() => (easeOutExpo((rl.value - 0.2) / 1.2) * 98.4).toFixed(1))
const mSus = computed(() => Math.round(easeOutExpo((rl.value - 0.25) / 1.25) * 91))
const researchSimplified = computed(() => rl.value >= 1.85)
const researchPillClick = computed(() => rl.value >= 1.72 && rl.value < 2.02)
const researchCursorK = computed(() => easeInOutCubic(clamp((rl.value - 0.75) / 0.95)))

// =========================================================
// PHASE 03 (12.82s – 19.35s) — CREATIVE AI (AI-Augmented Product Workflows)
// Enter: Expands horizontally out of the compact center pill (12.82s – 13.35s)
// Exit: Soft radial light pulse + horizontal kinetic push left (18.80s – 19.35s)
// =========================================================
const FULL_PROMPT = 'Build an accessible workout tracker with zero friction'

const p3State = computed(() => {
  const s = sec.value
  if (s < 12.82 || s >= 19.35) {
    return { visible: false, opacity: 0, x: 0, scaleX: 1, scale: 1 }
  }
  const enterK = easeOutExpo((s - 12.82) / 0.55)
  const pushOutK = s > 18.8 ? easeInOutCubic((s - 18.8) / 0.55) : 0
  return {
    visible: true,
    opacity: clamp(enterK * (1 - pushOutK)),
    x: -pushOutK * 240,
    scaleX: 0.42 + enterK * 0.58,
    scale: 0.94 + enterK * 0.06,
  }
})

// Soft radial light pulse on Generate click (Transition 3: 18.45s – 19.35s)
const radialPulse = computed(() => {
  const s = sec.value
  if (s < 18.45 || s > 19.4) return { active: false, opacity: 0, scale: 0.5 }
  const p = clamp((s - 18.45) / 0.95)
  return {
    active: true,
    opacity: Math.sin(p * Math.PI) * 0.55,
    scale: 0.6 + easeOutExpo(p) * 2.2,
  }
})

const focused = computed(() => sec.value >= 13.35 && sec.value < 18.85)
const typedText = computed(() => {
  const p = clamp((sec.value - 13.45) / 2.65)
  const count = Math.floor(p * FULL_PROMPT.length)
  return FULL_PROMPT.slice(0, count)
})
const tokenCount = computed(() => Math.round(typedText.value.length * 1.8))
const submitReady = computed(() => typedText.value.length >= FULL_PROMPT.length - 1)
const submitPressed = computed(() => sec.value >= 18.35 && sec.value < 18.72)

// Gentle 2D camera zoom (scale 1.18) locked onto Generate button
const camZoom = computed(() => {
  const s = sec.value
  const zIn = easeInOutCubic(clamp((s - 17.75) / 0.65)) * 0.18
  const zRelease = s > 18.8 ? easeInOutCubic((s - 18.8) / 0.5) * 0.18 : 0
  return (1 + zIn - zRelease) * p3State.value.scale
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
  if (s < 13.4) {
    pos = bez(start, { x: -w * 0.28, y: 20 }, input, easeInOutCubic(clamp((s - 12.9) / 0.5)))
  } else if (s < 17.4) {
    pos = { x: input.x + Math.sin(s * 1.5) * 3, y: input.y }
  } else {
    pos = bez(input, { x: w * 0.1, y: -16 }, btn, easeInOutCubic(clamp((s - 17.4) / 0.85)))
  }
  const ibeam = s >= 13.35 && s < 17.4
  const scale = submitPressed.value ? 0.94 : 1
  return { x: pos.x, y: pos.y, ibeam, scale }
})

// =========================================================
// PHASE 04 (19.38s – 26.00s) — MOTION & FRONT-END (Living Portfolio & Voltrep)
// Enter: Synchronized horizontal kinetic push in from the right (19.38s – 19.95s)
// Exit: Center-outward curtain wipe back to pure obsidian #050507 (25.35s – 26.00s)
// =========================================================
const p4State = computed(() => {
  const s = sec.value
  if (s < 19.38) {
    return { visible: false, opacity: 0, x: 220, clipPath: 'inset(0% 0% 0% 0%)' }
  }
  const enterK = easeOutExpo((s - 19.38) / 0.6)
  const curtainOutK = s > 25.35 ? easeInOutCubic((s - 25.35) / 0.62) : 0
  const sideInset = (curtainOutK * 50).toFixed(2)
  return {
    visible: true,
    opacity: clamp(enterK * (1 - curtainOutK)),
    x: (1 - enterK) * 220,
    clipPath: `inset(0% ${sideInset}% 0% ${sideInset}%)`,
  }
})

const pl = computed(() => Math.max(0, sec.value - 19.38))
const voltCheckClick = computed(() => pl.value >= 1.55 && pl.value < 1.88)
const voltDone = computed(() => pl.value >= 1.7)
const navIdx = computed(() => (pl.value < 1.95 ? 0 : 1)) // Overview -> Case Studies
const caseHover = computed(() => pl.value >= 2.15)
const p4CursorPos = computed(() => {
  const k = easeInOutCubic(clamp((pl.value - 1.75) / 0.9))
  return {
    x: -48 + k * 225,
    y: 16 + k * 18,
  }
})

const ambientTheme = computed(() => {
  const s = sec.value
  if (s < 6.45) return 'ambient-design'
  if (s < 12.8) return 'ambient-research'
  if (s < 19.35) return 'ambient-ai'
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
    elapsedMs.value = 2400 // static fallback showing UX/UI DESIGN immediately
  } else {
    elapsedMs.value = 600 // opens immediately on Phase 01: UX/UI DESIGN
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
  <section class="film-hero" aria-label="UX/UI Design & Front-End Product Showreel">
    <div class="film-stage" :class="ambientTheme">
      <!-- Subtle bespoke ambient light blooms (Obsidian, Champagne Gold, Alabaster, Emerald) -->
      <div class="ambient-layer" aria-hidden="true">
        <div class="bloom bloom-1" />
        <div class="bloom bloom-2" />
      </div>

      <div class="camera-viewport">
        <!-- =========================================================
             TRANSITION 1 OVERLAY: Glassmorphic Curtain Scanner Bar
             ========================================================= -->
        <div
          v-if="scannerBar.active"
          class="curtain-scanner-wrap"
          :style="{ opacity: scannerBar.opacity }"
          aria-hidden="true"
        >
          <div
            class="curtain-scanner-bar"
            :style="{ transform: `translate3d(${scannerBar.xPct.toFixed(2)}%, 0, 0)` }"
          >
            <div class="scanner-line" />
          </div>
        </div>

        <!-- =========================================================
             TRANSITION 2 OVERLAY: Compact Center Pill Morphing into Prompt Box
             ========================================================= -->
        <div
          v-if="morphPillBridge.active"
          class="morph-pill-overlay"
          :style="{ opacity: morphPillBridge.opacity }"
          aria-hidden="true"
        >
          <div
            class="morph-pill-shell"
            :style="{
              width: `${morphPillBridge.widthPx.toFixed(0)}px`,
              height: `${morphPillBridge.heightPx.toFixed(0)}px`,
            }"
          />
        </div>

        <!-- =========================================================
             TRANSITION 3 OVERLAY: Soft Radial Champagne Light Pulse
             ========================================================= -->
        <div
          v-if="radialPulse.active"
          class="radial-pulse-overlay"
          :style="{
            opacity: radialPulse.opacity,
            transform: `scale(${radialPulse.scale.toFixed(2)})`,
          }"
          aria-hidden="true"
        />

        <!-- =========================================================
             PHASE 01 (0.0s – 6.5s) — UX/UI DESIGN (IMMEDIATE HERO OPENER)
             ========================================================= -->
        <div
          v-if="p1State.visible"
          class="camera-layer"
          :style="{
            opacity: p1State.opacity,
            clipPath: p1State.clipPath,
            transform: `scale(${p1State.scale.toFixed(3)})`,
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
                <span class="fh-file tabular-nums">Frame / Hero · 8pt Grid</span>
              </div>

              <!-- Pill Toggle: Wireframe -> Production UI -->
              <div class="mode-pills">
                <span class="mode-pill" :class="{ active: !p1HighContrast }">Wireframe</span>
                <span
                  class="mode-pill"
                  :class="{ 'active-hc': p1HighContrast, pressed: p1ToggleClick }"
                >
                  Production UI
                </span>
              </div>

              <span class="fh-wcag">WCAG AA · 14.8:1</span>
            </div>

            <div class="figma-body">
              <!-- Left Component Tree -->
              <div class="figma-panel" aria-hidden="true">
                <div class="fp-title">COMPONENT TREE</div>
                <div class="layer-item is-active"><span class="li-icon">#</span> Frame / Hero</div>
                <div class="layer-item"><span class="li-icon">⊞</span> Auto Layout</div>
                <div class="layer-item"><span class="li-icon">⬡</span> 8pt Grid</div>
              </div>

              <!-- Center Interactive Component Frame -->
              <div class="figma-stage-center">
                <div class="selection-frame" :class="{ 'is-polished': p1HighContrast }">
                  <span class="handle h-tl" aria-hidden="true" />
                  <span class="handle h-tr" aria-hidden="true" />
                  <span class="handle h-bl" aria-hidden="true" />
                  <span class="handle h-br" aria-hidden="true" />
                  <span class="redline r-top tabular-nums" aria-hidden="true">24px</span>
                  <span class="redline r-side tabular-nums" aria-hidden="true">16px</span>

                  <div class="ui-preview-card" :class="{ 'is-hc': p1HighContrast }">
                    <div class="upc-row">
                      <span class="upc-kicker">{{ p1HighContrast ? 'VOLTREP · PRODUCTION TOKEN' : 'WIREFRAME · LOW-FI SKELETON' }}</span>
                      <span class="upc-chip tabular-nums">{{ p1HighContrast ? 'WCAG AA ✓' : 'Draft' }}</span>
                    </div>
                    <div class="upc-title">Hack Squat · 120 kg × 6 reps</div>
                    <div class="upc-bar"><div class="upc-bar-fill" /></div>
                  </div>
                </div>

                <!-- Vector Cursor clicking Production UI toggle -->
                <svg
                  class="figma-cursor"
                  :style="{ transform: `translate3d(${p1CursorPos.x.toFixed(1)}px, ${p1CursorPos.y.toFixed(1)}px, 0) scale(${p1ToggleClick ? 0.88 : 1})` }"
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
                <div class="fp-title">UI TOKENS</div>
                <div class="token-row"><i class="sw" style="background:#050507" /><span>#050507</span></div>
                <div class="token-row"><i class="sw" style="background:#E2B878" /><span>#E2B878</span></div>
                <div class="token-row"><i class="sw" style="background:#F5F5F7" /><span>#F5F5F7</span></div>
                <div class="token-spec">WCAG AA · 8pt Grid</div>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             PHASE 02 (6.5s – 13.0s) — USER RESEARCH (COGNITIVE ERGONOMICS)
             ========================================================= -->
        <div
          v-if="p2State.visible"
          class="camera-layer"
          :style="{
            opacity: p2State.opacity,
            clipPath: p2State.clipPath,
            transform: `scale(${p2State.scale.toFixed(3)})`,
          }"
        >
          <span class="seq-kicker is-emerald">COGNITIVE ERGONOMICS // EMPIRICAL VALIDATION</span>
          <h1 class="seq-title">
            <span class="tone-ice">USER</span>
            <span class="tone-emerald">RESEARCH</span>
          </h1>

          <!-- Interactive Flow Filter (Discover | Validate | Simplify) -->
          <div class="filter-pill-bar">
            <span class="filter-pill">Discover</span>
            <span class="filter-pill" :class="{ 'is-active-gold': !researchSimplified }">Validate</span>
            <span
              class="filter-pill"
              :class="{ 'is-active-emerald': researchSimplified, 'is-pressed': researchPillClick }"
            >
              Simplify
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
            <!-- Card 1: -42% Cognitive Friction -->
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

            <!-- Card 2: 98.4% Task Completion + SUS Score 91/100 -->
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

            <!-- Card 3: 6-node journey condensing into 3-step path on Simplify -->
            <div class="glass-panel bento-card bento-wide">
              <div class="bc-top">
                <span class="bc-tag">USER JOURNEY ARCHITECTURE</span>
                <span class="bc-flow-status" :class="{ simplified: researchSimplified }">
                  {{ researchSimplified ? 'Simplified · 3 Intuitive Steps ✓' : 'Unfiltered Journey · 6 Nodes' }}
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
                <span class="f-node"><i class="f-dot ice" />1. Select Exercise</span>
                <span class="f-connector" />
                <span class="f-node is-gold"><i class="f-dot gold" />2. One-Tap Set Log</span>
                <span class="f-connector" />
                <span class="f-node is-emerald"><i class="f-dot emerald" />3. Instant Rest Sync ✓</span>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             PHASE 03 (13.0s – 19.5s) — CREATIVE AI (BESPOKE PROMPT COMPOSER)
             ========================================================= -->
        <div
          v-show="p3State.visible"
          ref="layerRef"
          class="camera-layer layer-prompt"
          :style="{
            opacity: p3State.opacity,
            transform: `translate3d(${p3State.x.toFixed(1)}px, 0, 0) scaleX(${p3State.scaleX.toFixed(3)}) scale(${camZoom.toFixed(3)})`,
            transformOrigin: camOrigin,
          }"
        >
          <span class="seq-kicker is-gold">AI-AUGMENTED WORKFLOWS // BESPOKE INTERFACE ENGINE</span>
          <h1 class="seq-title">
            <span class="tone-ice">CREATIVE</span>
            <span class="tone-gold">AI</span>
          </h1>

          <div
            ref="boxRef"
            class="prompt-box"
            :class="{ 'is-focus': focused }"
          >
            <div class="prompt-top">
              <span class="model-pill"><span class="pill-dot" aria-hidden="true" />UI Architecture Agent</span>
              <span class="ctx-pill tabular-nums" :class="{ lit: typedText.length > 0 }">
                {{ tokenCount }} tok · Ready
              </span>
            </div>

            <div class="prompt-field">
              <span class="prompt-text">{{ typedText }}</span><span class="prompt-caret" :class="{ on: focused }" aria-hidden="true" />
              <span v-if="!typedText && !focused" class="prompt-placeholder">Specify interface constraints and ergonomics…</span>
            </div>

            <div class="prompt-bottom">
              <div class="chip-group" aria-hidden="true">
                <span class="attach-chip">8pt Grid</span>
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
             PHASE 04 (19.5s – 26.0s) — MOTION & FRONT-END (LIVING PORTFOLIO & VOLTREP)
             ========================================================= -->
        <div
          v-if="p4State.visible"
          class="camera-layer"
          :style="{
            opacity: p4State.opacity,
            clipPath: p4State.clipPath,
            transform: `translate3d(${p4State.x.toFixed(1)}px, 0, 0)`,
          }"
        >
          <span class="seq-kicker is-gold">PRODUCTION ENGINEERING // 60FPS SEMANTIC FRONT-END</span>
          <h1 class="seq-title">
            <span class="tone-gold">MOTION &amp;</span>
            <span class="tone-ice">FRONT-END</span>
          </h1>

          <!-- Elastic sliding pill tab: Overview | Case Studies | Journey -->
          <div class="live-navbar-pill" aria-hidden="true">
            <span class="nav-thumb" :style="{ transform: `translate3d(${navIdx * 100}%, 0, 0)` }" />
            <span class="nav-item" :class="{ active: navIdx === 0 }">Overview</span>
            <span class="nav-item" :class="{ active: navIdx === 1 }">Case Studies</span>
            <span class="nav-item">Journey</span>
          </div>

          <div class="frontend-showcase">
            <!-- Voltrep Workout Card (Hack Squat · 120 kg × 6 reps -> Set Logged) -->
            <div class="glass-panel volt-card" :class="{ done: voltDone }">
              <div class="vc-head">
                <span class="vc-brand">VOLTREP · LIVE WORKOUT LOGGER</span>
                <span class="vc-status tabular-nums" :class="{ done: voltDone }">
                  {{ voltDone ? 'Set Logged' : 'Active Set' }}
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

            <!-- Portfolio Case Study Preview Card (60 FPS · Semantic Code) -->
            <div class="glass-panel case-card" :class="{ hover: caseHover }">
              <div class="cc-top">
                <span class="cc-tag">CASE STUDY PREVIEW</span>
                <span class="cc-pill">Vue 3 · PWA</span>
              </div>
              <div class="cc-title">Voltrep — UX/UI &amp; Front-End Architecture</div>
              <div class="cc-specs">60 FPS · Semantic Code · WCAG AA</div>
              <div class="cc-cta">Explore Case Study →</div>
            </div>

            <!-- Shared cursor clicking Voltrep checkmark then lifting Case Study card -->
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

/* =========================================================
   BESPOKE AMBIENT BLOOMS (#050507, #E2B878, #F5F5F7, #34D399)
   ========================================================= */
.ambient-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bloom {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
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

.ambient-design .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-design .bloom-2 { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }
.ambient-research .bloom-1 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }
.ambient-research .bloom-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .bloom-2 { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }
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
  gap: 0.85rem;
  will-change: transform, opacity, clip-path;
}

@media (min-width: 768px) {
  .camera-layer {
    gap: 1.05rem;
  }
}

/* =========================================================
   ARCHITECTURAL SPATIAL TRANSITION OVERLAYS (NO LINES)
   ========================================================= */
.curtain-scanner-wrap {
  position: relative;
  grid-area: 1 / 1;
  z-index: 12;
  width: min(820px, calc(100vw - 2.5rem));
  height: 340px;
  pointer-events: none;
  overflow: hidden;
}

.curtain-scanner-bar {
  position: absolute;
  inset: 0;
  will-change: transform;
}

.scanner-line {
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, #E2B878 22%, #F5F5F7 50%, #E2B878 78%, transparent 100%);
  box-shadow:
    0 0 24px 4px rgba(226, 184, 120, 0.55),
    -18px 0 36px rgba(226, 184, 120, 0.18);
}

.morph-pill-overlay {
  position: relative;
  grid-area: 1 / 1;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.morph-pill-shell {
  border-radius: 24px;
  background: #0F1117;
  border: 1.5px solid rgba(226, 184, 120, 0.7);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 24px 56px -14px rgba(226, 184, 120, 0.25);
  will-change: width, height;
}

.radial-pulse-overlay {
  position: relative;
  grid-area: 1 / 1;
  z-index: 9;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(226, 184, 120, 0.36) 0%, rgba(226, 184, 120, 0.1) 45%, transparent 72%);
  pointer-events: none;
  will-change: transform, opacity;
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
  font-size: clamp(2.1rem, 5.1vw, 4.35rem);
  font-weight: 800;
  letter-spacing: -0.036em;
  line-height: 1;
}

.tone-ice { color: #F5F5F7; }
.tone-gold { color: #E2B878; }
.tone-emerald { color: #34D399; }

.glass-panel {
  background: #0F1117;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 22px 48px -20px rgba(0, 0, 0, 0.85);
}

/* =========================================================
   PHASE 01: FLAT 2D UX/UI DESIGN & FIGMA WORKSPACE
   ========================================================= */
.figma-workspace {
  width: min(780px, calc(100vw - 2.5rem));
  border-radius: 18px;
  background: #0F1117;
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
  padding: 0.55rem 0.95rem;
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
  background: #08090D;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.mode-pill {
  padding: 0.22rem 0.7rem;
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
  box-shadow: 0 0 16px rgba(226, 184, 120, 0.26);
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
  padding: 1rem 0.9rem;
  align-items: center;
}

@media (min-width: 720px) {
  .figma-body {
    grid-template-columns: 152px 1fr 156px;
    padding: 1.25rem 1.15rem;
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
    gap: 0.42rem;
    padding: 0.65rem 0.75rem;
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
  padding: 0.22rem 0.46rem;
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.6rem 0.15rem;
}

.selection-frame {
  position: relative;
  width: 100%;
  max-width: 390px;
  padding: 0.85rem 1rem;
  border: 1.5px dashed rgba(255, 255, 255, 0.32);
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
  border: 1.5px solid #8B92A0;
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
  background: #E2B878;
  color: #050507;
}
.r-top { top: -19px; left: 50%; transform: translateX(-50%); }
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
  transition: all 300ms ease;
}

.ui-preview-card.is-hc {
  border-style: solid;
  border-color: rgba(226, 184, 120, 0.55);
  background: #050507;
  box-shadow: 0 12px 28px -12px rgba(226, 184, 120, 0.28);
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
  width: 60%;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  transition: width 340ms ease;
}

.ui-preview-card.is-hc .upc-bar-fill {
  width: 100%;
  background: linear-gradient(90deg, #E2B878, #34D399);
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
   PHASE 02: USER RESEARCH & INTERACTIVE FLOW FILTER
   ========================================================= */
.filter-pill-bar {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.32rem 0.45rem;
  border-radius: 999px;
  background: #0F1117;
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
}

.filter-pill.is-active-emerald {
  background: rgba(52, 211, 153, 0.18);
  border-color: #34D399;
  color: #F5F5F7;
  box-shadow: 0 0 20px rgba(52, 211, 153, 0.28);
}

.filter-pill.is-pressed { transform: scale(0.94); }

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
  background: #08090D;
  border: 1px solid rgba(245, 245, 247, 0.28);
  font-size: 0.72rem;
  font-weight: 600;
  color: #F5F5F7;
}

.f-node.is-gold { border-color: rgba(226, 184, 120, 0.6); }
.f-node.is-emerald { border-color: rgba(52, 211, 153, 0.6); color: #D1FAE5; }

.f-connector {
  flex: 1;
  min-width: 14px;
  height: 2px;
  background: linear-gradient(90deg, #E2B878, #34D399);
}

.f-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.f-dot.ice { background: #F5F5F7; }
.f-dot.gold { background: #E2B878; }
.f-dot.emerald { background: #34D399; }

/* =========================================================
   PHASE 03: BESPOKE AI PROMPT COMPOSER (#0F1117 + #E2B878)
   ========================================================= */
.prompt-box {
  position: relative;
  width: min(680px, calc(100vw - 2.5rem));
  padding: 0.9rem 1rem 0.85rem 1.1rem;
  border-radius: 20px;
  background: #0F1117;
  border: 1px solid rgba(255, 255, 255, 0.13);
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
  border-color: rgba(226, 184, 120, 0.78);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 0 2px #E2B878,
    0 20px 50px rgba(226, 184, 120, 0.16);
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
  gap: 0.42rem;
  padding: 0.24rem 0.7rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.13);
  border: 1px solid rgba(226, 184, 120, 0.42);
  color: #E2B878;
  font-size: 0.73rem;
  font-weight: 600;
}

.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #E2B878;
}

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
  gap: 0.38rem;
}

.attach-chip {
  font-size: 0.7rem;
  font-weight: 600;
  color: #D1D5DB;
  padding: 0.24rem 0.56rem;
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

.submit-btn.pressed { transform: scale(0.94); }

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
   PHASE 04: MOTION & FRONT-END (LIVING PORTFOLIO & VOLTREP)
   ========================================================= */
.live-navbar-pill {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 102px);
  padding: 4px;
  border-radius: 999px;
  background: #0F1117;
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
  padding: 0.36rem 0;
  font-size: 0.73rem;
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
  box-shadow: 0 24px 52px -18px rgba(52, 211, 153, 0.26);
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
  .prompt-caret.on {
    animation: none !important;
  }
}
</style>
