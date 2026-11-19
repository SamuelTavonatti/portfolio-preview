<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

// =============================================================================
// 19.2s ARTICULATED EXPLAINER HERO SHOWREEL (4.80s per Act)
// Motion DNA:
// - Dotted SVG Guide-Track Pipelines (stroke-dasharray: 2 6) + gliding geometric tokens
// - Concentric Counter-Rotating Orbital Rings with 3 Satellite Nodes -> aligned row
// - Morphing Geometric Dot-Matrix Wave (squares -> circles -> diamonds)
// - Oversized Tactile Capsule Toggles, 3-Track Parameter Sliders & Checkmark Sequences
// - Multi-Card Fanning & 3-Column Grid Audit
// - Pixel-Accurate getBoundingClientRect() Cursor + Zero 3D Tilts + Zero Google/Gemini Icons
// =============================================================================

const LOOP_SEC = 19.2
const LOOP_MS = LOOP_SEC * 1000

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)

let rafId = null
let lastTs = null

// Dynamic getBoundingClientRect() DOM Refs
const stageRef = ref(null)
const a1BtnRef = ref(null)
const a2BtnRef = ref(null)
const a3FieldRef = ref(null)
const a3BtnRef = ref(null)
const a4ToggleRef = ref(null)

const targets = reactive({
  a1Btn: { x: 880, y: 265 },
  a2Btn: { x: 720, y: 280 },
  a3Field: { x: 640, y: 390 },
  a3Btn: { x: 910, y: 455 },
  a4Toggle: { x: 635, y: 440 },
})

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))
const easeOutQuint = (x) => 1 - Math.pow(1 - clamp(x), 5)
const easeOutExpo = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * clamp(x)))
const easeInOutQuart = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 8 * c * c * c * c : 1 - Math.pow(-2 * c + 2, 4) / 2
}
const easeSpring = (x) => {
  const c = clamp(x)
  if (c === 0 || c === 1) return c
  return 1 + Math.pow(2, -9 * c) * Math.sin((c * 10 - 0.75) * ((2 * Math.PI) / 3)) * 0.25
}

const sec = computed(() => (elapsedMs.value % LOOP_MS) / 1000)

const centerOf = (el, vpRect, fallback) => {
  if (!el || !vpRect || !vpRect.width) return fallback
  const r = el.getBoundingClientRect()
  if (!r.width && !r.height) return fallback
  return {
    x: r.left - vpRect.left + r.width / 2,
    y: r.top - vpRect.top + r.height / 2,
  }
}

const measureTargets = () => {
  const vp = stageRef.value
  if (!vp) return
  const vpRect = vp.getBoundingClientRect()
  if (!vpRect.width) return
  const s = sec.value
  if (s >= 0.45 && s <= 3.7) {
    targets.a1Btn = centerOf(a1BtnRef.value, vpRect, targets.a1Btn)
  }
  if (s >= 5.15 && s <= 8.4) {
    targets.a2Btn = centerOf(a2BtnRef.value, vpRect, targets.a2Btn)
  }
  if (s >= 9.95 && s <= 13.35) {
    targets.a3Field = centerOf(a3FieldRef.value, vpRect, targets.a3Field)
    targets.a3Btn = centerOf(a3BtnRef.value, vpRect, targets.a3Btn)
  }
  if (s >= 14.75 && s <= 18.25) {
    targets.a4Toggle = centerOf(a4ToggleRef.value, vpRect, targets.a4Toggle)
  }
}

const bez = (p0, p1, p2, k) => ({
  x: (1 - k) * (1 - k) * p0.x + 2 * (1 - k) * k * p1.x + k * k * p2.x,
  y: (1 - k) * (1 - k) * p0.y + 2 * (1 - k) * k * p1.y + k * k * p2.y,
})

// =============================================================================
// ACT 01 (0.00s – 4.80s) — UX/UI DESIGN
// Dotted Guide-Track Pipelines drop tokens -> Figma Frame spawns 3 fanned cards ->
// Cursor clicks `Validate Flow →` (2.80s) -> Emerald checkmarks + compress to 3 satellites
// =============================================================================
const a1TextY = computed(() => `${((1 - easeOutQuint(clamp(sec.value / 0.36))) * 105).toFixed(1)}%`)
const a1PipeProgress = computed(() => easeOutQuint(clamp(sec.value / 0.85)))
const a1FanProgress = computed(() => easeSpring(clamp((sec.value - 0.55) / 0.72)))

const a1Hover = computed(() => sec.value >= 2.25 && sec.value < 3.4)
const a1Pressed = computed(() => sec.value >= 2.8 && sec.value < 3.04)
const a1Validated = computed(() => sec.value >= 2.92)
const a1Ripple = computed(() => sec.value >= 2.86 && sec.value < 3.55)

const a1State = computed(() => {
  const s = sec.value
  if (s >= 4.35) {
    return { visible: false, transform: 'none', clipPath: 'inset(0% 0% 0% 0%)', compressK: 1 }
  }
  if (s < 0.45) {
    const k = easeOutQuint(s / 0.45)
    return {
      visible: true,
      transform: `scale(${(1.04 - k * 0.04).toFixed(3)})`,
      clipPath: `inset(${((1 - k) * 12).toFixed(2)}% 0% ${((1 - k) * 12).toFixed(2)}% 0% round ${((1 - k) * 16).toFixed(1)}px)`,
      compressK: 0,
    }
  }
  if (s > 3.65) {
    // Aligned cards compress along horizontal dotted rails into 3 orbital satellites
    const k = easeInOutQuart((s - 3.65) / 0.7)
    return {
      visible: true,
      transform: `scale(${(1 - k * 0.06).toFixed(3)})`,
      clipPath: `inset(0% ${(k * 44).toFixed(2)}% 0% ${(k * 44).toFixed(2)}% round ${(k * 999).toFixed(0)}px)`,
      compressK: k,
    }
  }
  return { visible: true, transform: 'scale(1)', clipPath: 'inset(0% 0% 0% 0%)', compressK: 0 }
})

const a1CardStyle = (idx) => {
  // Fan out smoothly from center (idx: -1, 0, 1), then compress back inward on transition
  const fan = a1FanProgress.value
  const comp = a1State.value.compressK
  const offsetX = (idx - 1) * (1 - fan) * -110 + (idx - 1) * comp * -140
  const offsetY = (1 - fan) * 26
  return {
    transform: `translate3d(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px, 0) scale(${(0.88 + fan * 0.12 - comp * 0.2).toFixed(3)})`,
    opacity: clamp(fan * 1.4 - comp * 0.7).toFixed(2),
  }
}

// =============================================================================
// ACT 02 (4.80s – 9.60s) — USER RESEARCH
// Counter-rotating concentric orbital rings with 3 satellites -> uncoil onto track ->
// Cursor clicks `Simplify Flow` (7.15s) -> 3 Parameter Sliders glide & checkboxes snap ✓ ->
// Morphing Geometric Dot-Matrix Wave (squares -> circles -> diamonds) sweeps into Act 03
// =============================================================================
const a2TextY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 4.35) / 0.36))) * 105).toFixed(1)}%`)
const a2RotOuter = computed(() => ((sec.value - 4.35) * 28).toFixed(1))
const a2RotInner = computed(() => (-(sec.value - 4.35) * 38).toFixed(1))
const a2Uncoil = computed(() => easeSpring(clamp((sec.value - 5.25) / 0.65)))

const a2Hover = computed(() => sec.value >= 6.55 && sec.value < 7.65)
const a2Pressed = computed(() => sec.value >= 7.15 && sec.value < 7.38)
const a2Simplified = computed(() => sec.value >= 7.26)
const a2Ripple = computed(() => sec.value >= 7.22 && sec.value < 7.88)

const a2SliderK = computed(() => easeSpring(clamp((sec.value - 7.28) / 0.65)))
const a2FrictionVal = computed(() => Math.round(14 + a2SliderK.value * 28)) // -14% -> -42%
const a2SuccessVal = computed(() => (81.2 + a2SliderK.value * 17.2).toFixed(1)) // 81.2% -> 98.4%
const a2SusVal = computed(() => Math.round(74 + a2SliderK.value * 17)) // 74 -> 91

const a2State = computed(() => {
  const s = sec.value
  if (s < 4.35 || s >= 9.2) {
    return { visible: false, transform: 'none', clipPath: 'inset(0% 0% 0% 0%)' }
  }
  if (s < 4.95) {
    const k = easeOutQuint((s - 4.35) / 0.6)
    return {
      visible: true,
      transform: `scale(${(0.92 + k * 0.08).toFixed(3)})`,
      clipPath: `inset(${((1 - k) * 16).toFixed(2)}% ${((1 - k) * 20).toFixed(2)}% ${((1 - k) * 16).toFixed(2)}% ${((1 - k) * 20).toFixed(2)}% round ${((1 - k) * 40).toFixed(0)}px)`,
    }
  }
  if (s > 8.4) {
    const k = easeInOutQuart((s - 8.4) / 0.8)
    return {
      visible: true,
      transform: 'scale(1)',
      clipPath: `inset(0% 0% 0% ${Math.min(100, k * 112).toFixed(2)}%)`,
    }
  }
  return { visible: true, transform: 'scale(1)', clipPath: 'inset(0% 0% 0% 0%)' }
})

// Morphing Geometric Dot-Matrix Wave (squares -> circles -> diamonds, 8.25s – 9.75s)
const DOT_MATRIX = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  col: i % 12,
  row: Math.floor(i / 12),
}))

const dotMatrixActive = computed(() => sec.value >= 8.25 && sec.value <= 9.75)
const dotMatrixCellStyle = (col, row) => {
  const p = clamp((sec.value - 8.25) / 1.2)
  const wave = clamp(p * 2.1 - (col / 11) * 0.85 - (row / 3) * 0.25)
  // Shape morph: 0 -> square (2px), 0.5 -> circle (50%), 1 -> diamond (45deg rotate + 3px)
  const isGold = (col + row) % 2 === 0
  const rot = wave > 0.55 ? (wave - 0.55) * 100 : 0
  const rad = wave < 0.5 ? `${Math.round(wave * 100)}%` : `${Math.round((1 - (wave - 0.5) * 2) * 50)}%`
  const sc = Math.sin(wave * Math.PI) * 1.15
  return {
    transform: `scale(${sc.toFixed(2)}) rotate(${rot.toFixed(0)}deg)`,
    borderRadius: rad,
    backgroundColor: isGold ? '#E2B878' : '#34D399',
    opacity: clamp(Math.sin(wave * Math.PI) * 1.35).toFixed(2),
  }
}

// =============================================================================
// ACT 03 (9.60s – 14.40s) — CREATIVE AI
// Prompt Composer connected to dotted input/output pipelines ->
// Cursor clicks `↑ Generate` (12.95s) -> Camera Zoom (145%) + colored capsule packets stream out
// =============================================================================
const FULL_PROMPT =
  'Architect a low-friction workout logger with WCAG AA contrast, 8pt spatial rhythm, and 60fps micro-interactions.'

const a3Origin = computed(() => `${targets.a3Btn.x.toFixed(0)}px ${targets.a3Btn.y.toFixed(0)}px`)
const a3TextY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 9.2) / 0.36))) * 105).toFixed(1)}%`)

const a3State = computed(() => {
  const s = sec.value
  if (s < 9.2 || s >= 14.0) {
    return { visible: false, transform: 'none', clipPath: 'inset(0% 0% 0% 0%)', streamK: 0 }
  }
  if (s < 9.75) {
    const k = easeOutQuint((s - 9.2) / 0.55)
    return {
      visible: true,
      transform: `scale(${(0.94 + k * 0.06).toFixed(3)})`,
      clipPath: `inset(0% ${((1 - k) * 35).toFixed(1)}% 0% ${((1 - k) * 35).toFixed(1)}% round ${((1 - k) * 28).toFixed(0)}px)`,
      streamK: 0,
    }
  }
  if (s > 13.15) {
    // 2D Camera Zoom (145%) + right-side capsule packet stream
    const k = easeInOutQuart((s - 13.15) / 0.85)
    return {
      visible: true,
      transform: `scale(${(1 + k * 0.45).toFixed(3)})`,
      clipPath: `inset(0% ${(k * 100).toFixed(1)}% 0% 0%)`,
      streamK: k,
    }
  }
  return { visible: true, transform: 'scale(1)', clipPath: 'inset(0% 0% 0% 0%)', streamK: 0 }
})

const a3Focused = computed(() => sec.value >= 9.85 && sec.value < 13.15)
const typedText = computed(() => {
  const p = clamp((sec.value - 9.95) / 2.2)
  return FULL_PROMPT.slice(0, Math.floor(p * FULL_PROMPT.length))
})
const tokenCount = computed(() => Math.round(typedText.value.length * 1.4))
const a3Ready = computed(() => typedText.value.length >= FULL_PROMPT.length - 1)
const a3Hover = computed(() => sec.value >= 12.55 && sec.value < 13.35)
const a3Pressed = computed(() => sec.value >= 12.95 && sec.value < 13.18)
const a3Ripple = computed(() => sec.value >= 13.0 && sec.value < 13.65)

// =============================================================================
// ACT 04 (14.40s – 19.20s) — MOTION & FRONT-END
// Streaming capsules materialize into Voltrep (oversized capsule toggle) + Sliding Pill Navbar ->
// Cursor clicks toggle (`Set Complete` ✓) at 16.05s -> Vertical dotted guide sweeps upward
// =============================================================================
const a4TextY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 14.0) / 0.36))) * 105).toFixed(1)}%`)
const a4ToggleHover = computed(() => sec.value >= 15.65 && sec.value < 16.65)
const a4TogglePressed = computed(() => sec.value >= 16.05 && sec.value < 16.28)
const a4ToggleOn = computed(() => sec.value >= 16.15)
const a4ToggleRipple = computed(() => sec.value >= 16.1 && sec.value < 16.75)
const a4NavIdx = computed(() => (sec.value < 16.85 ? 0 : 1))

const a4State = computed(() => {
  const s = sec.value
  if (s < 14.0) {
    return { visible: false, transform: 'none', clipPath: 'inset(0% 0% 0% 0%)', sweepUp: 0 }
  }
  if (s < 14.55) {
    const k = easeOutQuint((s - 14.0) / 0.55)
    return {
      visible: true,
      transform: `scale(${(1.06 - k * 0.06).toFixed(3)})`,
      clipPath: `inset(0% 0% 0% ${((1 - k) * 95).toFixed(1)}%)`,
      sweepUp: 0,
    }
  }
  if (s > 18.25) {
    // Vertical dotted guide line sweeps upward, folding cards into Act 01 at 0.0s
    const k = easeInOutQuart((s - 18.25) / 0.95)
    return {
      visible: true,
      transform: `scale(${(1 + k * 0.04).toFixed(3)})`,
      clipPath: `inset(0% 0% ${(k * 100).toFixed(1)}% 0%)`,
      sweepUp: k,
    }
  }
  return { visible: true, transform: 'scale(1)', clipPath: 'inset(0% 0% 0% 0%)', sweepUp: 0 }
})

// =============================================================================
// UNIFIED STAGE CURSOR (Pixel-Accurate getBoundingClientRect() Targeting)
// =============================================================================
const stageCursor = computed(() => {
  const s = sec.value
  const b1 = targets.a1Btn
  const b2 = targets.a2Btn
  const f3 = targets.a3Field
  const b3 = targets.a3Btn
  const t4 = targets.a4Toggle

  let pos = { x: b1.x, y: b1.y }
  let ibeam = false
  let pressed = false

  if (s < 4.35) {
    if (s < 2.2) {
      const k = easeInOutQuart(clamp((s - 0.5) / 1.7))
      pos = bez({ x: b1.x - 140, y: b1.y + 85 }, { x: b1.x - 60, y: b1.y + 16 }, b1, k)
    } else {
      pos = { x: b1.x, y: b1.y }
    }
    pressed = a1Pressed.value
  } else if (s < 9.2) {
    if (s < 6.5) {
      const k = easeInOutQuart(clamp((s - 4.7) / 1.8))
      pos = bez(b1, { x: (b1.x + b2.x) / 2, y: Math.min(b1.y, b2.y) - 36 }, b2, k)
    } else {
      pos = { x: b2.x, y: b2.y }
    }
    pressed = a2Pressed.value
  } else if (s < 14.0) {
    if (s < 9.95) {
      const k = easeInOutQuart(clamp((s - 9.3) / 0.65))
      pos = bez(b2, { x: f3.x - 36, y: f3.y - 26 }, f3, k)
    } else if (s < 12.15) {
      pos = { x: f3.x + Math.sin(s * 3) * 4, y: f3.y }
      ibeam = true
    } else if (s < 12.55) {
      const k = easeInOutQuart(clamp((s - 12.15) / 0.4))
      pos = bez(f3, { x: (f3.x + b3.x) / 2, y: f3.y - 24 }, b3, k)
    } else {
      pos = { x: b3.x, y: b3.y }
    }
    pressed = a3Pressed.value
  } else {
    if (s < 15.65) {
      const k = easeInOutQuart(clamp((s - 14.3) / 1.35))
      pos = bez(b3, { x: (b3.x + t4.x) / 2, y: t4.y - 38 }, t4, k)
    } else {
      pos = { x: t4.x, y: t4.y }
    }
    pressed = a4TogglePressed.value
  }

  return { x: pos.x, y: pos.y, ibeam, scale: pressed ? 0.88 : 1 }
})

const ambientTheme = computed(() => {
  const s = sec.value
  if (s < 4.35) return 'ambient-design'
  if (s < 9.2) return 'ambient-research'
  if (s < 14.0) return 'ambient-ai'
  return 'ambient-frontend'
})

const onResize = () => nextTick(measureTargets)

const tick = (ts) => {
  if (lastTs !== null && isAutoPlaying.value) {
    elapsedMs.value += ts - lastTs
  }
  lastTs = ts
  measureTargets()
  rafId = window.requestAnimationFrame(tick)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('resize', onResize, { passive: true })
  const params = new URLSearchParams(window.location.search)
  const tParam = params.get('t')
  if (tParam !== null && !Number.isNaN(Number(tParam))) {
    isAutoPlaying.value = false
    elapsedMs.value = Number(tParam) * 1000
  } else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isAutoPlaying.value = false
    elapsedMs.value = 1800
  } else {
    elapsedMs.value = 1300 // opens cleanly on Act 01: UX/UI DESIGN
  }
  nextTick(() => {
    measureTargets()
    window.setTimeout(measureTargets, 120)
    window.setTimeout(measureTargets, 320)
  })
  rafId = window.requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
  if (typeof window !== 'undefined') window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="exp-hero" aria-label="UX/UI Design & Front-End Interactive Showreel">
    <div class="exp-stage" :class="ambientTheme">
      <!-- Ambient Obsidian Radial Blooms (Zero Checkerboard, Zero Google Logos) -->
      <div class="ambient-bg" aria-hidden="true">
        <div class="rad-bloom b-gold" />
        <div class="rad-bloom b-em" />
      </div>

      <div ref="stageRef" class="exp-viewport">
        <!-- =========================================================
             ACT 01 (0.0s – 4.8s) — UX/UI DESIGN
             Dotted Guide-Track Pipelines + Fanned 3-Card Grid Audit
             ========================================================= -->
        <div
          v-show="a1State.visible"
          class="act-layer"
          :style="{
            clipPath: a1State.clipPath,
            transform: a1State.transform,
          }"
        >
          <!-- Dotted Guide-Track Pipelines with Gliding Geometric Tokens -->
          <svg class="guide-svg" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="150" x2="1200" y2="150" class="dotted-rail" />
            <line x1="0" y1="430" x2="1200" y2="430" class="dotted-rail" />
            <line x1="220" y1="0" x2="220" y2="560" class="dotted-rail" />
            <line x1="980" y1="0" x2="980" y2="560" class="dotted-rail" />
            <!-- Gliding geometric tokens along rails -->
            <circle :cx="140 + a1PipeProgress * 220" cy="150" r="6" fill="#E2B878" />
            <rect :x="1040 - a1PipeProgress * 240" y="143" width="28" height="14" rx="7" fill="#34D399" />
            <rect
              x="213"
              :y="40 + a1PipeProgress * 180"
              width="14"
              height="14"
              rx="3"
              fill="#F5F5F7"
              :transform="`rotate(45 220 ${47 + a1PipeProgress * 180})`"
            />
            <rect :x="300 + a1PipeProgress * 460" y="424" width="42" height="12" rx="6" fill="#E2B878" opacity="0.85" />
          </svg>

          <div class="mask-box">
            <span class="act-kicker is-gold" :style="{ transform: `translate3d(0, ${a1TextY}, 0)` }">
              8pt Grid · WCAG AA Contrast · Design Tokens
            </span>
          </div>
          <div class="mask-box">
            <h1 class="act-title" :style="{ transform: `translate3d(0, ${a1TextY}, 0)` }">
              <span class="c-ice">UX/UI</span>
              <span class="c-gold">DESIGN</span>
            </h1>
          </div>

          <!-- Central Figma Design System Frame -->
          <div class="ds-frame">
            <div class="ds-bar">
              <div class="ds-left">
                <span class="ds-dots" aria-hidden="true"><i /><i /><i /></span>
                <span class="ds-name tabular-nums">Design System · 8pt Grid · Auto Layout</span>
              </div>
              <button
                ref="a1BtnRef"
                type="button"
                tabindex="-1"
                class="tactile-pill is-gold is-target"
                :class="{ 'is-hover': a1Hover, 'is-active': a1Validated, 'is-pressed': a1Pressed }"
              >
                <span>Validate Flow →</span>
                <span v-if="a1Ripple" class="t-ripple" aria-hidden="true" />
              </button>
            </div>

            <!-- 3 Fanned & Aligned Component Cards -->
            <div class="ds-cards-grid">
              <div class="comp-card" :class="{ verified: a1Validated }" :style="a1CardStyle(0)">
                <div class="cc-top">
                  <span class="cc-kicker">TYPOGRAPHY SCALE</span>
                  <span class="cc-check" :class="{ on: a1Validated }">✓</span>
                </div>
                <div class="cc-main tabular-nums">Inter · -0.03em</div>
                <div class="cc-sub">tabular-nums · 1.04 line-height</div>
              </div>

              <div class="comp-card" :class="{ verified: a1Validated }" :style="a1CardStyle(1)">
                <div class="cc-top">
                  <span class="cc-kicker">COLOR TOKENS</span>
                  <span class="cc-check" :class="{ on: a1Validated }">✓</span>
                </div>
                <div class="cc-swatches">
                  <span class="sw-pill"><i style="background:#050507" />#050507</span>
                  <span class="sw-pill"><i style="background:#E2B878" />#E2B878</span>
                  <span class="sw-pill"><i style="background:#34D399" />#34D399</span>
                </div>
                <div class="cc-sub">Obsidian · Champagne · Emerald</div>
              </div>

              <div class="comp-card" :class="{ verified: a1Validated }" :style="a1CardStyle(2)">
                <div class="cc-top">
                  <span class="cc-kicker">CONTRAST AUDIT</span>
                  <span class="cc-check" :class="{ on: a1Validated }">✓</span>
                </div>
                <div class="cc-main is-em tabular-nums">14.8:1 AAA</div>
                <div class="cc-sub">WCAG Verified · Zero Glare</div>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             ACT 02 (4.8s – 9.6s) — USER RESEARCH
             Counter-Rotating Concentric Orbital Rings + 3-Track Parameter Sliders
             ========================================================= -->
        <div
          v-show="a2State.visible"
          class="act-layer"
          :style="{
            clipPath: a2State.clipPath,
            transform: a2State.transform,
          }"
        >
          <!-- Concentric Dashed Orbital Rings with 3 Glowing Satellites -->
          <div class="orbital-stage" aria-hidden="true">
            <svg class="orbital-svg" viewBox="0 0 360 150">
              <circle
                cx="180"
                cy="75"
                r="66"
                fill="none"
                stroke="rgba(52, 211, 153, 0.35)"
                stroke-width="1.2"
                stroke-dasharray="4 6"
                :transform="`rotate(${a2RotOuter} 180 75)`"
              />
              <circle
                cx="180"
                cy="75"
                r="44"
                fill="none"
                stroke="rgba(226, 184, 120, 0.4)"
                stroke-width="1.2"
                stroke-dasharray="2 5"
                :transform="`rotate(${a2RotInner} 180 75)`"
              />
              <circle cx="180" cy="75" r="16" fill="rgba(52, 211, 153, 0.14)" stroke="#34D399" stroke-width="1.4" />
            </svg>
            <div class="satellites-row" :style="{ gap: `${(0.35 + a2Uncoil * 0.55).toFixed(2)}rem` }">
              <span class="sat-pill"><i class="s-dot ice" />Journey</span>
              <span class="sat-pill is-gold"><i class="s-dot gold" />Heatmap</span>
              <span class="sat-pill is-em"><i class="s-dot em" />A11y</span>
            </div>
          </div>

          <div class="mask-box">
            <span class="act-kicker is-em" :style="{ transform: `translate3d(0, ${a2TextY}, 0)` }">
              Cognitive Ergonomics · Usability Telemetry · SUS 91/100
            </span>
          </div>
          <div class="mask-box">
            <h1 class="act-title" :style="{ transform: `translate3d(0, ${a2TextY}, 0)` }">
              <span class="c-ice">USER</span>
              <span class="c-em">RESEARCH</span>
            </h1>
          </div>

          <button
            ref="a2BtnRef"
            type="button"
            tabindex="-1"
            class="tactile-pill is-em is-target"
            :class="{ 'is-hover': a2Hover, 'is-active': a2Simplified, 'is-pressed': a2Pressed }"
          >
            <span>Simplify Flow</span>
            <span v-if="a2Ripple" class="t-ripple is-em" aria-hidden="true" />
          </button>

          <!-- 3 Oversized Tactile Parameter Sliders & Checkboxes -->
          <div class="sliders-grid">
            <div class="slider-card" :class="{ ok: a2Simplified }">
              <div class="sl-head">
                <span class="sl-label">COGNITIVE FRICTION</span>
                <span class="sl-check" :class="{ on: a2Simplified }">✓</span>
              </div>
              <div class="sl-val is-em tabular-nums">-{{ a2FrictionVal }}%</div>
              <div class="sl-track">
                <div class="sl-fill is-em" :style="{ width: `${42 + a2SliderK * 46}%` }" />
                <span class="sl-thumb" :style="{ left: `${42 + a2SliderK * 46}%` }" />
              </div>
            </div>

            <div class="slider-card" :class="{ ok: a2Simplified }">
              <div class="sl-head">
                <span class="sl-label">TASK SUCCESS</span>
                <span class="sl-check" :class="{ on: a2Simplified }">✓</span>
              </div>
              <div class="sl-val tabular-nums">{{ a2SuccessVal }}%</div>
              <div class="sl-track">
                <div class="sl-fill is-gold" :style="{ width: `${58 + a2SliderK * 36}%` }" />
                <span class="sl-thumb" :style="{ left: `${58 + a2SliderK * 36}%` }" />
              </div>
            </div>

            <div class="slider-card" :class="{ ok: a2Simplified }">
              <div class="sl-head">
                <span class="sl-label">SUS BENCHMARK</span>
                <span class="sl-check" :class="{ on: a2Simplified }">✓</span>
              </div>
              <div class="sl-val is-gold tabular-nums">{{ a2SusVal }}/100</div>
              <div class="sl-track">
                <div class="sl-fill is-em" :style="{ width: `${55 + a2SliderK * 36}%` }" />
                <span class="sl-thumb" :style="{ left: `${55 + a2SliderK * 36}%` }" />
              </div>
            </div>
          </div>
        </div>

        <!-- GEOMETRIC DOT-MATRIX WAVE (SQUARES -> CIRCLES -> DIAMONDS, ACT 02 -> ACT 03) -->
        <div v-if="dotMatrixActive" class="dot-matrix-overlay" aria-hidden="true">
          <div
            v-for="cell in DOT_MATRIX"
            :key="cell.id"
            class="dm-cell"
            :style="dotMatrixCellStyle(cell.col, cell.row)"
          />
        </div>

        <!-- =========================================================
             ACT 03 (9.6s – 14.4s) — CREATIVE AI
             Prompt Composer + Dotted Input/Output Capsule Pipeline
             ========================================================= -->
        <div
          v-show="a3State.visible"
          class="act-layer"
          :style="{
            clipPath: a3State.clipPath,
            transform: a3State.transform,
            transformOrigin: a3Origin,
          }"
        >
          <!-- Lateral Dotted Input/Output Capsule Pipeline -->
          <svg class="guide-svg" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="295" x2="230" y2="295" class="dotted-rail" />
            <line x1="970" y1="295" x2="1200" y2="295" class="dotted-rail" />
            <!-- Input capsules -->
            <rect x="65" y="288" width="34" height="14" rx="7" fill="#E2B878" opacity="0.85" />
            <rect x="135" y="288" width="26" height="14" rx="7" fill="#34D399" opacity="0.85" />
            <!-- High-velocity output capsules on Generate click -->
            <rect :x="980 + a3State.streamK * 190" y="288" width="38" height="14" rx="7" fill="#E2B878" />
            <rect :x="1030 + a3State.streamK * 220" y="288" width="30" height="14" rx="7" fill="#34D399" />
            <rect :x="1075 + a3State.streamK * 250" y="288" width="24" height="14" rx="7" fill="#F5F5F7" />
          </svg>

          <div class="mask-box">
            <span class="act-kicker is-gold" :style="{ transform: `translate3d(0, ${a3TextY}, 0)` }">
              Design Tokens · User Telemetry · WCAG Rules
            </span>
          </div>
          <div class="mask-box">
            <h1 class="act-title" :style="{ transform: `translate3d(0, ${a3TextY}, 0)` }">
              <span class="c-ice">CREATIVE</span>
              <span class="c-gold">AI</span>
            </h1>
          </div>

          <div class="prompt-composer" :class="{ 'is-focus': a3Focused }">
            <div class="pc-top">
              <span class="pc-model"><i class="pc-dot" />System Architecture Prompt</span>
              <span class="pc-tok tabular-nums" :class="{ lit: typedText.length > 0 }">
                {{ tokenCount }} tok · Validated
              </span>
            </div>

            <div ref="a3FieldRef" class="pc-field">
              <span>{{ typedText }}</span><span class="pc-caret" :class="{ on: a3Focused }" aria-hidden="true" />
            </div>

            <div class="pc-bottom">
              <div class="pc-chips" aria-hidden="true">
                <span class="pc-chip">Design Tokens</span>
                <span class="pc-chip">User Telemetry</span>
                <span class="pc-chip">WCAG Rules</span>
              </div>
              <button
                ref="a3BtnRef"
                type="button"
                tabindex="-1"
                class="pc-submit is-target"
                :class="{ ready: a3Ready, 'is-hover': a3Hover, 'is-pressed': a3Pressed }"
              >
                <span aria-hidden="true">↑</span>
                <span>Generate</span>
                <span v-if="a3Ripple" class="t-ripple" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <!-- =========================================================
             ACT 04 (14.4s – 19.2s) — MOTION & FRONT-END
             Voltrep Sliding Capsule Toggle (`Set Complete`) + Sliding Pill Navbar
             ========================================================= -->
        <div
          v-show="a4State.visible"
          class="act-layer"
          :style="{
            clipPath: a4State.clipPath,
            transform: a4State.transform,
          }"
        >
          <!-- Vertical Dotted Loop Guide Line sweeping upward -->
          <svg
            v-if="a4State.sweepUp > 0"
            class="guide-svg"
            viewBox="0 0 1200 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="600" y1="560" x2="600" :y2="560 - a4State.sweepUp * 560" class="dotted-rail is-gold" />
            <circle cx="600" :cy="560 - a4State.sweepUp * 560" r="8" fill="#E2B878" />
          </svg>

          <div class="mask-box">
            <span class="act-kicker is-gold" :style="{ transform: `translate3d(0, ${a4TextY}, 0)` }">
              Voltrep Production UI · 60 FPS GPU Compositing · Zero Shift
            </span>
          </div>
          <div class="mask-box">
            <h1 class="act-title" :style="{ transform: `translate3d(0, ${a4TextY}, 0)` }">
              <span class="c-gold">MOTION &amp;</span>
              <span class="c-ice">FRONT-END</span>
            </h1>
          </div>

          <div class="nav-pill" aria-hidden="true">
            <span class="np-thumb" :style="{ transform: `translate3d(${a4NavIdx * 100}%, 0, 0)` }" />
            <span class="np-item" :class="{ active: a4NavIdx === 0 }">Overview</span>
            <span class="np-item" :class="{ active: a4NavIdx === 1 }">Case Studies</span>
            <span class="np-item">Journey</span>
          </div>

          <div class="fe-grid">
            <!-- Voltrep Workout Logger + Oversized Sliding Capsule Toggle -->
            <div class="fe-card volt-box" :class="{ done: a4ToggleOn }">
              <div class="vb-head">
                <span class="vb-brand">VOLTREP · WORKOUT LOGGER</span>
                <span class="vb-badge tabular-nums" :class="{ done: a4ToggleOn }">
                  {{ a4ToggleOn ? 'Completed ✓' : 'Set 4 / 4' }}
                </span>
              </div>
              <div class="vb-ex">Hack Squat</div>
              <div class="vb-row">
                <div class="vb-nums tabular-nums">
                  <span class="vb-val">120 kg × 6 reps</span>
                  <span class="vb-sub">RPE 8.5 · Cognitive Ergonomics</span>
                </div>

                <!-- Oversized Google-style Sliding Capsule Toggle -->
                <button
                  ref="a4ToggleRef"
                  type="button"
                  tabindex="-1"
                  class="capsule-toggle is-target"
                  :class="{ 'is-hover': a4ToggleHover, 'is-on': a4ToggleOn, 'is-pressed': a4TogglePressed }"
                  aria-label="Set Complete"
                >
                  <span class="ct-label">{{ a4ToggleOn ? 'Set Complete' : 'Log Set' }}</span>
                  <span class="ct-switch">
                    <span class="ct-thumb">{{ a4ToggleOn ? '✓' : '' }}</span>
                  </span>
                  <span v-if="a4ToggleRipple" class="t-ripple is-em" aria-hidden="true" />
                </button>
              </div>
              <div class="vb-track" aria-hidden="true">
                <div class="vb-fill" :style="{ width: a4ToggleOn ? '100%' : '75%' }" />
              </div>
            </div>

            <!-- Voltrep Case Study Card -->
            <div class="fe-card cs-box" :class="{ lifted: a4NavIdx === 1 }">
              <div class="cs-head">
                <span class="cs-tag">FEATURED CASE STUDY</span>
                <span class="cs-pill">60 FPS · Semantic Code</span>
              </div>
              <div class="cs-title">Voltrep Case Study</div>
              <div class="cs-specs">WCAG AA Contrast · 8pt Spatial Rhythm · Zero Paywall</div>
              <div class="cs-metrics tabular-nums">
                <span>SUS 91/100</span>
                <span>·</span>
                <span>-42% Friction</span>
                <span>·</span>
                <span>CLS 0.00</span>
              </div>
            </div>
          </div>
        </div>

        <!-- PIXEL-ACCURATE VECTOR CURSOR -->
        <div
          class="exp-cursor"
          :style="{
            transform: `translate3d(${stageCursor.x.toFixed(1)}px, ${stageCursor.y.toFixed(1)}px, 0) scale(${stageCursor.scale})`,
          }"
          aria-hidden="true"
        >
          <svg class="ec-svg" :class="{ hide: stageCursor.ibeam }" viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M2 2L19 10.5L11.5 13L8.5 20.5L2 2Z" fill="#E2B878" stroke="#050507" stroke-width="1.6" stroke-linejoin="round" />
          </svg>
          <svg class="ec-svg ec-ibeam" :class="{ show: stageCursor.ibeam }" viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M9 4h6M9 20h6M12 4v16" stroke="#F5F5F7" stroke-width="1.9" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!-- LOWER-LEFT SAFE ZONE -->
      <div class="safe-zone">
        <div class="id-wrap">
          <div class="id-row">
            <span class="id-name">Samuel Tavonatti</span>
            <span class="id-sep" aria-hidden="true">—</span>
            <span class="id-role">UI/UX Designer &amp; Front-End</span>
          </div>
          <div class="id-actions">
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
.exp-hero { width: 100%; margin: 0; padding: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }

.exp-stage {
  position: relative;
  width: 100%;
  min-height: 94vh;
  min-height: 94svh;
  background-color: #050507;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4.7rem 0 1.4rem;
}
@media (min-width: 768px) { .exp-stage { padding: 5.3rem 0 2rem; } }

.ambient-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.rad-bloom { position: absolute; border-radius: 50%; filter: blur(115px); transition: background 1s cubic-bezier(0.22, 1, 0.36, 1); animation: bloomPulse 9s ease-in-out infinite alternate; }
.b-gold { width: 54vw; height: 54vw; max-width: 740px; max-height: 740px; top: 6%; left: 16%; opacity: 0.09; }
.b-em { width: 44vw; height: 44vw; max-width: 560px; max-height: 560px; bottom: 5%; right: 10%; opacity: 0.075; animation-direction: alternate-reverse; }
@keyframes bloomPulse { 0% { transform: scale(0.96); } 100% { transform: scale(1.06); } }

.ambient-design .b-gold { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-design .b-em { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }
.ambient-research .b-gold { background: radial-gradient(circle, #34D399 0%, transparent 70%); }
.ambient-research .b-em { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .b-gold { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .b-em { background: radial-gradient(circle, #34D399 0%, transparent 70%); }
.ambient-frontend .b-gold { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-frontend .b-em { background: radial-gradient(circle, #34D399 0%, transparent 70%); }

.exp-viewport {
  position: relative;
  z-index: 2;
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  padding: 0.5rem 1.25rem;
}
@media (min-width: 768px) { .exp-viewport { padding: 0.85rem 2.5rem; } }

.act-layer {
  position: relative;
  grid-area: 1 / 1;
  width: 100%;
  min-height: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.78rem;
  will-change: transform, clip-path;
}
@media (min-width: 768px) { .act-layer { min-height: 520px; } }

/* DOTTED GUIDE-TRACK PIPELINES */
.guide-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.dotted-rail { stroke: rgba(245, 245, 247, 0.22); stroke-width: 1.2; stroke-dasharray: 2 6; }
.dotted-rail.is-gold { stroke: rgba(226, 184, 120, 0.65); stroke-width: 1.6; }

/* TYPOGRAPHY LEAD-IN */
.mask-box { overflow: hidden; display: flex; justify-content: center; position: relative; z-index: 2; }
.act-kicker { display: inline-block; padding: 0.25rem 0.78rem; border-radius: 999px; font-family: var(--font-mono); font-size: 0.67rem; font-weight: 600; letter-spacing: 0.04em; will-change: transform; }
.act-kicker.is-gold { background: rgba(226, 184, 120, 0.12); border: 1px solid rgba(226, 184, 120, 0.38); color: #E2B878; }
.act-kicker.is-em { background: rgba(52, 211, 153, 0.12); border: 1px solid rgba(52, 211, 153, 0.38); color: #6EE7B7; }

.act-title { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.25rem 0.62rem; font-size: clamp(2.05rem, 4.8vw, 4.1rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.04; will-change: transform; }
.c-ice { color: #F5F5F7; }
.c-gold { color: #E2B878; }
.c-em { color: #34D399; }

/* TACTILE PILL BUTTONS */
.is-target { position: relative; }
.is-target.is-pressed { transform: scale(0.94) !important; }
.tactile-pill {
  position: relative;
  z-index: 2;
  padding: 0.34rem 0.85rem;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.73rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: transform 140ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 200ms ease, color 200ms ease, box-shadow 200ms ease;
}
.tactile-pill.is-gold { border: 1px solid rgba(226, 184, 120, 0.55); background: rgba(226, 184, 120, 0.14); color: #E2B878; }
.tactile-pill.is-gold.is-hover, .tactile-pill.is-gold.is-active { background: #E2B878; border-color: #E2B878; color: #050507; box-shadow: 0 0 22px rgba(226, 184, 120, 0.45); }
.tactile-pill.is-em { border: 1px solid rgba(52, 211, 153, 0.55); background: rgba(52, 211, 153, 0.14); color: #6EE7B7; }
.tactile-pill.is-em.is-hover, .tactile-pill.is-em.is-active { background: #34D399; border-color: #34D399; color: #050507; box-shadow: 0 0 22px rgba(52, 211, 153, 0.45); }

.t-ripple { position: absolute; inset: -4px; border-radius: 999px; border: 2px solid #E2B878; animation: tRip 0.62s cubic-bezier(0.16, 1, 0.3, 1) forwards; pointer-events: none; }
.t-ripple.is-em { border-color: #34D399; }
@keyframes tRip { 0% { transform: scale(0.85); opacity: 0.95; } 100% { transform: scale(1.7); opacity: 0; } }

/* ACT 01: DESIGN SYSTEM FRAME & 3 FANNED CARDS */
.ds-frame { position: relative; z-index: 2; width: min(840px, calc(100vw - 2.5rem)); border-radius: 18px; background: #0F1117; border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 28px 64px -22px rgba(0, 0, 0, 0.9); overflow: hidden; text-align: left; }
.ds-bar { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; padding: 0.55rem 0.95rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.02); }
.ds-left { display: flex; align-items: center; gap: 0.5rem; }
.ds-dots { display: inline-flex; gap: 4px; }
.ds-dots i { width: 7px; height: 7px; border-radius: 50%; background: rgba(255, 255, 255, 0.22); }
.ds-name { font-family: var(--font-mono); font-size: 0.68rem; color: #9CA3AF; }

.ds-cards-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.68rem; padding: 0.95rem; }
@media (min-width: 720px) { .ds-cards-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 1.05rem; } }

.comp-card { padding: 0.78rem 0.88rem; border-radius: 12px; background: #08090D; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; gap: 0.38rem; transition: border-color 240ms ease, box-shadow 240ms ease; }
.comp-card.verified { border-color: rgba(52, 211, 153, 0.5); box-shadow: 0 12px 28px -14px rgba(52, 211, 153, 0.25); }
.cc-top { display: flex; align-items: center; justify-content: space-between; gap: 0.35rem; }
.cc-kicker { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em; color: #9CA3AF; }
.cc-check { width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; font-size: 0.65rem; font-weight: 800; background: rgba(255, 255, 255, 0.07); color: transparent; transition: all 220ms cubic-bezier(0.34, 1.4, 0.64, 1); }
.cc-check.on { background: #34D399; color: #050507; transform: scale(1.08); }
.cc-main { font-size: 1.05rem; font-weight: 700; color: #F5F5F7; }
.cc-main.is-em { color: #34D399; }
.cc-sub { font-size: 0.7rem; color: #9CA3AF; }
.cc-swatches { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.sw-pill { display: inline-flex; align-items: center; gap: 0.24rem; font-family: var(--font-mono); font-size: 0.62rem; color: #D1D5DB; padding: 0.12rem 0.36rem; border-radius: 6px; background: rgba(255, 255, 255, 0.05); }
.sw-pill i { width: 8px; height: 8px; border-radius: 2px; border: 1px solid rgba(255, 255, 255, 0.25); }

/* ACT 02: CONCENTRIC ORBITALS & 3-TRACK PARAMETER SLIDERS */
.orbital-stage { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.orbital-svg { width: 280px; height: 108px; overflow: visible; }
.satellites-row { display: inline-flex; align-items: center; justify-content: center; flex-wrap: wrap; }
.sat-pill { display: inline-flex; align-items: center; gap: 0.28rem; padding: 0.22rem 0.56rem; border-radius: 999px; background: #0F1117; border: 1px solid rgba(245, 245, 247, 0.25); font-size: 0.66rem; font-weight: 600; color: #F5F5F7; }
.sat-pill.is-gold { border-color: rgba(226, 184, 120, 0.55); color: #E2B878; }
.sat-pill.is-em { border-color: rgba(52, 211, 153, 0.55); color: #6EE7B7; }
.s-dot { width: 6px; height: 6px; border-radius: 50%; }
.s-dot.ice { background: #F5F5F7; }
.s-dot.gold { background: #E2B878; }
.s-dot.em { background: #34D399; }

.sliders-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.7rem; width: min(840px, calc(100vw - 2.5rem)); position: relative; z-index: 2; }
@media (min-width: 768px) { .sliders-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.slider-card { padding: 0.85rem 0.95rem; border-radius: 14px; background: #0F1117; border: 1px solid rgba(255, 255, 255, 0.12); display: flex; flex-direction: column; gap: 0.44rem; text-align: left; transition: border-color 240ms ease; }
.slider-card.ok { border-color: rgba(52, 211, 153, 0.45); }
.sl-head { display: flex; align-items: center; justify-content: space-between; }
.sl-label { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em; color: #9CA3AF; }
.sl-check { width: 18px; height: 18px; border-radius: 5px; border: 1px solid rgba(255, 255, 255, 0.22); display: grid; place-items: center; font-size: 0.66rem; font-weight: 800; color: transparent; transition: all 220ms cubic-bezier(0.34, 1.4, 0.64, 1); }
.sl-check.on { background: #34D399; border-color: #34D399; color: #050507; }
.sl-val { font-size: 1.7rem; font-weight: 800; letter-spacing: -0.04em; color: #F5F5F7; line-height: 1; }
.sl-val.is-em { color: #34D399; }
.sl-val.is-gold { color: #E2B878; }
.sl-track { position: relative; width: 100%; height: 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.08); margin-top: 0.2rem; }
.sl-fill { height: 100%; border-radius: 999px; }
.sl-fill.is-em { background: #34D399; }
.sl-fill.is-gold { background: linear-gradient(90deg, #E2B878, #34D399); }
.sl-thumb { position: absolute; top: 50%; width: 14px; height: 14px; border-radius: 50%; background: #F5F5F7; border: 2px solid #050507; transform: translate(-50%, -50%); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6); }

/* GEOMETRIC DOT-MATRIX WAVE */
.dot-matrix-overlay { position: absolute; inset: 0; z-index: 20; display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(4, 1fr); place-items: center; padding: 3rem 1.5rem; pointer-events: none; }
.dm-cell { width: 18px; height: 18px; will-change: transform, opacity, border-radius; }

/* ACT 03: PROMPT COMPOSER */
.prompt-composer { position: relative; z-index: 2; width: min(720px, calc(100vw - 2.5rem)); padding: 0.92rem 1.08rem; border-radius: 20px; background: #0F1117; border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 26px 60px -22px rgba(0, 0, 0, 0.88); display: flex; flex-direction: column; gap: 0.68rem; text-align: left; transition: box-shadow 220ms ease, border-color 220ms ease; }
.prompt-composer.is-focus { border-color: #E2B878; box-shadow: 0 0 0 2px #E2B878, 0 20px 52px rgba(226, 184, 120, 0.22); }
.pc-top, .pc-bottom { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; }
.pc-model { display: inline-flex; align-items: center; gap: 0.42rem; padding: 0.24rem 0.7rem; border-radius: 999px; background: rgba(226, 184, 120, 0.13); border: 1px solid rgba(226, 184, 120, 0.42); color: #E2B878; font-size: 0.73rem; font-weight: 600; }
.pc-dot { width: 7px; height: 7px; border-radius: 50%; background: #E2B878; }
.pc-tok { padding: 0.2rem 0.58rem; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.1); font-family: var(--font-mono); font-size: 0.67rem; color: #9CA3AF; }
.pc-tok.lit { color: #6EE7B7; border-color: rgba(52, 211, 153, 0.35); }
.pc-field { min-height: 2.9rem; font-size: clamp(0.9rem, 1.3vw, 1.04rem); line-height: 1.5; color: #F5F5F7; }
.pc-caret { display: inline-block; width: 2px; height: 1.1em; vertical-align: -0.18em; margin-left: 2px; background: #E2B878; opacity: 0; }
.pc-caret.on { opacity: 1; animation: blink 0.85s steps(1) infinite; }
@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
.pc-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.pc-chip { padding: 0.2rem 0.52rem; border-radius: 8px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.67rem; color: #9CA3AF; }
.pc-submit { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.38rem 0.88rem; border-radius: 999px; border: 1px solid rgba(226, 184, 120, 0.35); background: rgba(226, 184, 120, 0.14); color: #E2B878; font-family: inherit; font-size: 0.77rem; font-weight: 700; transition: transform 140ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 200ms ease, color 200ms ease; }
.pc-submit.ready, .pc-submit.is-hover { background: #E2B878; border-color: #E2B878; color: #050507; box-shadow: 0 0 22px rgba(226, 184, 120, 0.45); }

/* ACT 04: VOLTREP CAPSULE TOGGLE & SLIDING PILL NAVBAR */
.nav-pill { position: relative; z-index: 2; display: inline-grid; grid-template-columns: repeat(3, 1fr); padding: 0.24rem; border-radius: 999px; background: #0F1117; border: 1px solid rgba(255, 255, 255, 0.12); width: min(330px, calc(100vw - 2.5rem)); }
.np-thumb { position: absolute; top: 0.24rem; left: 0.24rem; bottom: 0.24rem; width: calc((100% - 0.48rem) / 3); border-radius: 999px; background: rgba(226, 184, 120, 0.18); border: 1px solid rgba(226, 184, 120, 0.5); transition: transform 420ms cubic-bezier(0.34, 1.4, 0.64, 1); }
.np-item { position: relative; z-index: 1; padding: 0.32rem 0.4rem; font-size: 0.72rem; font-weight: 600; color: #9CA3AF; text-align: center; }
.np-item.active { color: #F5F5F7; }

.fe-grid { position: relative; z-index: 2; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.85rem; width: fit-content; max-width: 100%; margin: 0 auto; }
.fe-card { width: min(355px, calc(100vw - 2.5rem)); padding: 0.92rem 1.05rem; border-radius: 16px; background: #0F1117; border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 22px 48px -20px rgba(0, 0, 0, 0.85); display: flex; flex-direction: column; gap: 0.44rem; text-align: left; transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1), border-color 260ms ease, box-shadow 260ms ease; }
.volt-box.done { border-color: rgba(52, 211, 153, 0.65); box-shadow: 0 24px 52px -18px rgba(52, 211, 153, 0.28); }
.cs-box.lifted { transform: translate3d(0, -4px, 0); border-color: rgba(226, 184, 120, 0.65); box-shadow: 0 26px 56px -18px rgba(226, 184, 120, 0.28); }

.vb-head, .cs-head { display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; }
.vb-brand, .cs-tag { font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700; color: #E2B878; letter-spacing: 0.05em; }
.vb-badge { font-size: 0.67rem; font-weight: 700; padding: 0.14rem 0.5rem; border-radius: 999px; background: rgba(255, 255, 255, 0.07); color: #D1D5DB; white-space: nowrap; }
.vb-badge.done { background: rgba(52, 211, 153, 0.2); border: 1px solid rgba(52, 211, 153, 0.45); color: #6EE7B7; }
.vb-ex, .cs-title { font-size: 0.96rem; font-weight: 700; color: #F5F5F7; }
.vb-row { display: flex; align-items: center; justify-content: space-between; gap: 0.55rem; flex-wrap: wrap; }
.vb-nums { display: flex; flex-direction: column; }
.vb-val { font-size: 1.15rem; font-weight: 800; color: #E2B878; }
.vb-sub { font-size: 0.69rem; color: #9CA3AF; }

/* OVERSIZED GOOGLE-STYLE SLIDING CAPSULE TOGGLE */
.capsule-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.24rem 0.28rem 0.24rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #E5E7EB;
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  transition: transform 140ms cubic-bezier(0.34, 1.4, 0.64, 1), border-color 220ms ease, background-color 220ms ease;
}
.capsule-toggle.is-hover { border-color: #34D399; }
.capsule-toggle.is-on { border-color: #34D399; background: rgba(52, 211, 153, 0.16); color: #D1FAE5; }
.ct-switch { position: relative; width: 40px; height: 22px; border-radius: 999px; background: rgba(255, 255, 255, 0.18); transition: background-color 240ms ease; }
.capsule-toggle.is-on .ct-switch { background: #34D399; }
.ct-thumb { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; border-radius: 50%; background: #F5F5F7; color: #050507; font-size: 0.65rem; font-weight: 900; display: grid; place-items: center; transition: transform 320ms cubic-bezier(0.34, 1.4, 0.64, 1); }
.capsule-toggle.is-on .ct-thumb { transform: translate3d(18px, 0, 0); }

.vb-track { width: 100%; height: 5px; border-radius: 999px; background: rgba(255, 255, 255, 0.08); overflow: hidden; }
.vb-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #E2B878, #34D399); transition: width 360ms cubic-bezier(0.16, 1, 0.3, 1); }

.cs-pill { font-family: var(--font-mono); font-size: 0.63rem; padding: 0.14rem 0.5rem; border-radius: 999px; background: rgba(226, 184, 120, 0.14); color: #E2B878; white-space: nowrap; }
.cs-specs { font-family: var(--font-mono); font-size: 0.7rem; color: #6EE7B7; }
.cs-metrics { display: flex; gap: 0.45rem; font-family: var(--font-mono); font-size: 0.68rem; color: #D1D5DB; margin-top: 0.15rem; }

/* PIXEL-ACCURATE VECTOR CURSOR */
.exp-cursor { position: absolute; top: 0; left: 0; width: 24px; height: 24px; z-index: 40; pointer-events: none; transform-origin: 2px 2px; filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.65)); will-change: transform; }
.ec-svg { position: absolute; inset: 0; transition: opacity 120ms ease; }
.ec-svg.hide { opacity: 0; }
.ec-ibeam { opacity: 0; }
.ec-ibeam.show { opacity: 1; }

/* LOWER-LEFT SAFE ZONE */
.safe-zone { position: relative; z-index: 3; width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 1.25rem; display: flex; align-items: flex-end; justify-content: flex-start; }
@media (min-width: 768px) { .safe-zone { padding: 0 2.5rem; } }
.id-wrap { display: flex; flex-direction: column; align-items: flex-start; gap: 0.6rem; }
.id-row { display: flex; flex-direction: column; align-items: flex-start; gap: 0.1rem; font-size: 0.9rem; }
.id-name { font-weight: 700; color: #F5F5F7; }
.id-sep { display: none; color: #6B7280; }
@media (min-width: 520px) { .id-row { flex-direction: row; align-items: center; gap: 0.45rem; } .id-sep { display: inline; } }
.id-role { color: #A1A7B3; }
.id-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.cta-gold { background-color: #E2B878 !important; color: #050507 !important; border-color: #E2B878 !important; padding: 0.56rem 1.05rem !important; font-size: 0.84rem !important; }
.cta-glass { background-color: #121318 !important; border-color: rgba(255, 255, 255, 0.14) !important; padding: 0.56rem 1.05rem !important; font-size: 0.84rem !important; }

@media (prefers-reduced-motion: reduce) {
  .rad-bloom, .pc-caret.on, .t-ripple { animation: none !important; }
}
</style>
