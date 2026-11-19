<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

// =============================================================================
// 20.0s 4-SCENE HERO SHOWREEL (5.00s per Scene) — PRECISION VISUAL & COPY POLISH
// - Scene 01 (0.0s – 5.0s) : UX/UI DESIGN
//   · Status pill: `DESIGN SYSTEM // V2.0 → [WCAG_AA · 8PT_GRID]`
//   · Subtitle tag: `Cognitive Ergonomics & Interface Architecture`
//   · Top-left spec tag: `GRID: 8PT // CONTRAST 14.8:1`
//   · Color token dots (`#050507`, `#86EFAC`, `#E2B878`) near toolbar
//   · Pixel-LED illumination gradients (#86EFAC <-> #E2B878) + SVG Liquid Columns
// - Scene 02 (5.0s – 10.0s): MOTION & FRONT-END
//   · Crosshair micro-label: `60FPS // GPU_SPRING` + live counter (`0007 → 0060`)
//   · Voltrep pill: `VOLTREP LIVE · 120 KG × 6 REPS ✓`
//   · Equalizer wave + live physics curve telemetry (`cubic-bezier(0.16, 1, 0.3, 1)`)
//   · 3-node rotating triangle with luminous vertex rings
// - Scene 03 (10.0s – 15.0s): AI CREATIVE
//   · Monospace prompt-output tag: `PROMPT → TOKENIZED_UI // ZERO_BLOAT`
//   · Binary stream + 4 glassmorphic output artifacts (`Sparkle Pulse`,
//     `UX Sparkline`, `Wireframe Contour`, `Typography Token`) with connector ticks
// - Scene 04 (15.0s – 20.0s): USER RESEARCH
//   · Telemetry pills: `-42% Cognitive Friction` & `98.4% Task Completion · SUS 91/100`
//   · Heuristic micro-tags: `A11y Verified` & `Flow Simplified`
//   · Expressive tracking eyes + gooey metaball collision stage on high-contrast
//     lighter studio stage (WCAG AA/AAA verified)
// =============================================================================

const LOOP_SEC = 20.0
const LOOP_MS = LOOP_SEC * 1000

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)

let rafId = null
let lastTs = null

// Dynamic getBoundingClientRect() DOM Refs
const stageRef = ref(null)
const s1BtnRef = ref(null)
const s2BtnRef = ref(null)
const s3BtnRef = ref(null)
const s4BtnRef = ref(null)

const targets = reactive({
  s1Btn: { x: 720, y: 465 },
  s2Btn: { x: 720, y: 465 },
  s3Btn: { x: 520, y: 235 },
  s4Btn: { x: 860, y: 390 },
})

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))
const easeOutQuint = (x) => 1 - Math.pow(1 - clamp(x), 5)
const easeOutCubic = (x) => 1 - Math.pow(1 - clamp(x), 3)
const easeInOutQuart = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 8 * c * c * c * c : 1 - Math.pow(-2 * c + 2, 4) / 2
}
const easeSpring = (x) => {
  const c = clamp(x)
  if (c === 0 || c === 1) return c
  return 1 + Math.pow(2, -9 * c) * Math.sin((c * 10 - 0.75) * ((2 * Math.PI) / 3)) * 0.22
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
  if (s < 5.0) {
    targets.s1Btn = centerOf(s1BtnRef.value, vpRect, targets.s1Btn)
  } else if (s < 10.0) {
    targets.s2Btn = centerOf(s2BtnRef.value, vpRect, targets.s2Btn)
  } else if (s < 15.0) {
    targets.s3Btn = centerOf(s3BtnRef.value, vpRect, targets.s3Btn)
  } else {
    targets.s4Btn = centerOf(s4BtnRef.value, vpRect, targets.s4Btn)
  }
}

const bez = (p0, p1, p2, k) => ({
  x: (1 - k) * (1 - k) * p0.x + 2 * (1 - k) * k * p1.x + k * k * p2.x,
  y: (1 - k) * (1 - k) * p0.y + 2 * (1 - k) * k * p1.y + k * k * p2.y,
})

// =============================================================================
// SCENE 01 (0.00s – 5.00s) — UX/UI DESIGN
// =============================================================================
const s1State = computed(() => {
  const s = sec.value
  if (s >= 5.0) {
    return { visible: false, clipPath: 'inset(0% 0% 100% 0%)', transform: 'none' }
  }
  if (s < 0.45) {
    const k = easeOutQuint(s / 0.45)
    return {
      visible: true,
      clipPath: `inset(${((1 - k) * 14).toFixed(2)}% 0% ${((1 - k) * 14).toFixed(2)}% 0% round ${((1 - k) * 18).toFixed(1)}px)`,
      transform: `scale(${(1.03 - k * 0.03).toFixed(4)})`,
    }
  }
  if (s < 4.35) {
    return {
      visible: true,
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      transform: 'scale(1)',
    }
  }
  // Shutter / Morph Wipe exit (4.35s -> 5.00s)
  const k = easeInOutQuart((s - 4.35) / 0.65)
  return {
    visible: true,
    clipPath: `inset(0% ${(k * 100).toFixed(2)}% 0% 0% round ${(k * 20).toFixed(1)}px)`,
    transform: `translate3d(${(-k * 28).toFixed(1)}px, 0, 0) scale(${(1 - k * 0.03).toFixed(4)})`,
  }
})

const s1TitleY = computed(() => `${((1 - easeOutQuint(clamp(sec.value / 0.42))) * 105).toFixed(1)}%`)
const s1Hover = computed(() => sec.value >= 2.65 && sec.value < 3.95)
const s1Pressed = computed(() => sec.value >= 3.2 && sec.value < 3.38)
const s1Locked = computed(() => sec.value >= 3.3)
const s1Ripple = computed(() => sec.value >= 3.26 && sec.value < 3.95)

// 7 Liquid Columns with smooth harmonic oscillation + click boost
const LIQUID_COLS = [
  { id: 0, label: '4pt', base: 44, phase: 0.2 },
  { id: 1, label: '8pt', base: 68, phase: 1.1 },
  { id: 2, label: '16pt', base: 84, phase: 2.0 },
  { id: 3, label: '24pt', base: 92, phase: 2.9 },
  { id: 4, label: '32pt', base: 76, phase: 3.8 },
  { id: 5, label: '48pt', base: 62, phase: 4.7 },
  { id: 6, label: '64pt', base: 86, phase: 5.5 },
]

const s1ColumnHeights = computed(() => {
  const s = sec.value
  const enterK = easeOutCubic(clamp((s - 0.25) / 0.65))
  const lockBoost = s1Locked.value ? 10 : 0
  return LIQUID_COLS.map((c) => {
    const wave = Math.sin(s * 3.4 + c.phase) * 9
    return clamp((c.base + wave + lockBoost) * enterK, 14, 98)
  })
})

// Pixel-LED 16-dot illumination bar
const LED_CELLS = Array.from({ length: 16 }, (_, i) => i)

// =============================================================================
// SCENE 02 (5.00s – 10.00s) — MOTION & FRONT-END
// =============================================================================
const s2State = computed(() => {
  const s = sec.value
  if (s < 5.0 || s >= 10.0) {
    return { visible: false, clipPath: 'inset(0% 0% 0% 100%)', transform: 'none' }
  }
  const local = s - 5.0
  if (local < 0.5) {
    const k = easeOutQuint(local / 0.5)
    return {
      visible: true,
      clipPath: `inset(0% 0% 0% ${((1 - k) * 100).toFixed(2)}% round ${((1 - k) * 20).toFixed(1)}px)`,
      transform: `translate3d(${((1 - k) * 28).toFixed(1)}px, 0, 0)`,
    }
  }
  if (local < 4.35) {
    return {
      visible: true,
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      transform: 'translate3d(0, 0, 0)',
    }
  }
  // Vertical shutter wipe exit (9.35s -> 10.00s)
  const k = easeInOutQuart((local - 4.35) / 0.65)
  return {
    visible: true,
    clipPath: `inset(${(k * 50).toFixed(2)}% 0% ${(k * 50).toFixed(2)}% 0% round ${(k * 22).toFixed(1)}px)`,
    transform: `scale(${(1 - k * 0.03).toFixed(4)})`,
  }
})

const s2TitleY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 5.05) / 0.42))) * 105).toFixed(1)}%`)
const s2Hover = computed(() => sec.value >= 7.65 && sec.value < 8.95)
const s2Pressed = computed(() => sec.value >= 8.2 && sec.value < 8.38)
const s2Locked = computed(() => sec.value >= 8.3)
const s2Ripple = computed(() => sec.value >= 8.26 && sec.value < 8.95)

// Live tabular-nums frame counter: 0007 -> 0060
const s2FrameCounter = computed(() => {
  const k = easeOutCubic(clamp((sec.value - 5.25) / 3.05))
  const n = Math.round(7 + 53 * k)
  return String(n).padStart(4, '0')
})

// Rotating 3-node triangle vertices in 2D SVG (center 90, 90, radius 56)
const s2TriNodes = computed(() => {
  const local = clamp(sec.value - 5.0, 0, 5)
  const baseAngle = local * 1.15 - Math.PI / 2
  const r = 54
  const cx = 90
  const cy = 90
  return [0, 1, 2].map((i) => {
    const a = baseAngle + (i * 2 * Math.PI) / 3
    return {
      id: i,
      label: ['N1', 'N2', 'N3'][i],
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
      color: i === 0 ? '#86EFAC' : i === 1 ? '#E2B878' : '#F5F5F7',
    }
  })
})

const s2TriPoints = computed(() =>
  s2TriNodes.value.map((n) => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(' ')
)

// Equalizer Wave bars (18 harmonic bars)
const EQ_BARS = Array.from({ length: 18 }, (_, i) => i)
const s2EqHeights = computed(() => {
  const s = sec.value
  return EQ_BARS.map((i) => {
    const h1 = Math.sin(s * 5.2 + i * 0.48) * 18
    const h2 = Math.cos(s * 3.1 - i * 0.3) * 10
    const env = Math.sin(((i + 1) / 19) * Math.PI)
    return clamp(18 + (28 + h1 + h2) * env, 10, 62)
  })
})

// =============================================================================
// SCENE 03 (10.00s – 15.00s) — AI CREATIVE
// =============================================================================
const s3State = computed(() => {
  const s = sec.value
  if (s < 10.0 || s >= 15.0) {
    return { visible: false, clipPath: 'inset(50% 0% 50% 0%)', transform: 'none' }
  }
  const local = s - 10.0
  if (local < 0.5) {
    const k = easeOutQuint(local / 0.5)
    const p = (1 - k) * 48
    return {
      visible: true,
      clipPath: `inset(${p.toFixed(2)}% 0% ${p.toFixed(2)}% 0% round ${((1 - k) * 22).toFixed(1)}px)`,
      transform: `scale(${(0.97 + k * 0.03).toFixed(4)})`,
    }
  }
  if (local < 4.35) {
    return {
      visible: true,
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      transform: 'scale(1)',
    }
  }
  // Iris / Shutter morph wipe into Scene 04 (14.35s -> 15.00s)
  const k = easeInOutQuart((local - 4.35) / 0.65)
  return {
    visible: true,
    clipPath: `inset(0% 0% 0% ${(k * 100).toFixed(2)}% round ${(k * 24).toFixed(1)}px)`,
    transform: `translate3d(${(-k * 24).toFixed(1)}px, 0, 0)`,
  }
})

const s3TitleY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 10.05) / 0.42))) * 105).toFixed(1)}%`)
const s3Hover = computed(() => sec.value >= 12.55 && sec.value < 13.95)
const s3Pressed = computed(() => sec.value >= 13.1 && sec.value < 13.28)
const s3Locked = computed(() => sec.value >= 13.2)
const s3Ripple = computed(() => sec.value >= 13.16 && sec.value < 13.95)

const BINARY_ROWS = [
  '01001101 · 10110100 · TOK_GRID_8PT',
  '11010010 · 01101101 · A11Y_14.8_AAA',
  '01110100 · 10011011 · GPU_60FPS_SPRING',
  '10101110 · 01010011 · ZERO_BLOAT_DOM',
]

const AI_ARTIFACTS = [
  {
    id: 'pulse',
    code: 'OUT_01',
    title: 'Sparkle Pulse',
    meta: 'Harmonic Luminance · 60Hz',
    accent: '#86EFAC',
  },
  {
    id: 'spark',
    code: 'OUT_02',
    title: 'UX Sparkline',
    meta: '+38.4% Flow Velocity',
    accent: '#E2B878',
  },
  {
    id: 'wire',
    code: 'OUT_03',
    title: 'Wireframe Contour',
    meta: 'Auto-Layout · 8pt Matrix',
    accent: '#86EFAC',
  },
  {
    id: 'type',
    code: 'OUT_04',
    title: 'Typography Token',
    meta: 'Inter 800 · -0.03em Scale',
    accent: '#E2B878',
  },
]

// =============================================================================
// SCENE 04 (15.00s – 20.00s) — USER RESEARCH
// =============================================================================
const s4State = computed(() => {
  const s = sec.value
  if (s < 15.0) {
    return { visible: false, clipPath: 'inset(0% 100% 0% 0%)', transform: 'none' }
  }
  const local = s - 15.0
  if (local < 0.5) {
    const k = easeOutQuint(local / 0.5)
    return {
      visible: true,
      clipPath: `inset(0% ${((1 - k) * 100).toFixed(2)}% 0% 0% round ${((1 - k) * 24).toFixed(1)}px)`,
      transform: `translate3d(${((1 - k) * 24).toFixed(1)}px, 0, 0)`,
    }
  }
  if (local < 4.35) {
    return {
      visible: true,
      clipPath: 'inset(0% 0% 0% 0% round 0px)',
      transform: 'translate3d(0, 0, 0)',
    }
  }
  // Shutter / Morph wipe loop reset back to Scene 01 (19.35s -> 20.00s)
  const k = easeInOutQuart((local - 4.35) / 0.65)
  return {
    visible: true,
    clipPath: `inset(${(k * 16).toFixed(2)}% ${(k * 16).toFixed(2)}% ${(k * 16).toFixed(2)}% ${(k * 16).toFixed(2)}% round ${(k * 24).toFixed(1)}px)`,
    transform: `scale(${(1 - k * 0.04).toFixed(4)})`,
  }
})

const s4TitleY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 15.05) / 0.42))) * 105).toFixed(1)}%`)
const s4Hover = computed(() => sec.value >= 17.55 && sec.value < 18.95)
const s4Pressed = computed(() => sec.value >= 18.1 && sec.value < 18.28)
const s4Locked = computed(() => sec.value >= 18.2)
const s4Ripple = computed(() => sec.value >= 18.16 && sec.value < 18.95)

// Gooey Metaball Collision trajectory (two outer blobs merge into center on Simplify)
const s4MetaballOffset = computed(() => {
  const s = sec.value
  if (s < 15.0) return 58
  const local = s - 15.0
  if (local < 2.2) {
    // Smooth approach & oscillation
    const k = easeOutCubic(local / 2.2)
    return 62 - k * 34 + Math.sin(local * 4.2) * 5
  }
  if (local < 3.2) {
    return 28 + Math.sin(local * 4.5) * 4
  }
  // On click (18.2s), merge into unified ergonomic core
  const m = easeSpring(clamp((local - 3.2) / 0.65))
  return 28 * (1 - m)
})

// Expressive Tracking Eyes pupil offset (follows cursor/metaball motion cleanly)
const s4Pupil = computed(() => {
  const s = sec.value
  const local = clamp(s - 15.0, 0, 5)
  const px = Math.sin(local * 2.1) * 7 + (s4Hover.value ? 6 : 0)
  const py = Math.cos(local * 1.7) * 3.5 + (s4Pressed.value ? 2 : 0)
  return { x: px.toFixed(2), y: py.toFixed(2) }
})

// =============================================================================
// UNIFIED PIXEL-ACCURATE VECTOR CURSOR (getBoundingClientRect() live tracking)
// =============================================================================
const stageCursor = computed(() => {
  const s = sec.value
  let x = targets.s1Btn.x
  let y = targets.s1Btn.y
  let scale = 1
  let opacity = 0

  // Scene 01 cursor glide & click (2.05s -> 4.10s)
  if (s >= 2.05 && s < 4.1) {
    const b = targets.s1Btn
    const start = { x: b.x + 170, y: b.y + 85 }
    if (s < 2.75) {
      const k = easeOutQuint((s - 2.05) / 0.7)
      opacity = clamp((s - 2.05) / 0.25)
      const p = bez(start, { x: b.x + 65, y: b.y - 28 }, b, k)
      x = p.x
      y = p.y
    } else if (s < 3.7) {
      opacity = 1
      x = b.x
      y = b.y
      if (s >= 3.2 && s < 3.38) scale = 0.91
    } else {
      const k = easeOutCubic((s - 3.7) / 0.4)
      opacity = 1 - k
      x = b.x + k * 48
      y = b.y + k * 24
    }
  }
  // Scene 02 cursor glide & click (7.05s -> 9.10s)
  else if (s >= 7.05 && s < 9.1) {
    const b = targets.s2Btn
    const start = { x: b.x - 160, y: b.y + 75 }
    if (s < 7.75) {
      const k = easeOutQuint((s - 7.05) / 0.7)
      opacity = clamp((s - 7.05) / 0.25)
      const p = bez(start, { x: b.x - 50, y: b.y - 30 }, b, k)
      x = p.x
      y = p.y
    } else if (s < 8.7) {
      opacity = 1
      x = b.x
      y = b.y
      if (s >= 8.2 && s < 8.38) scale = 0.91
    } else {
      const k = easeOutCubic((s - 8.7) / 0.4)
      opacity = 1 - k
      x = b.x + k * 48
      y = b.y - k * 22
    }
  }
  // Scene 03 cursor glide & click (11.95s -> 14.10s)
  else if (s >= 11.95 && s < 14.1) {
    const b = targets.s3Btn
    const start = { x: b.x - 150, y: b.y + 95 }
    if (s < 12.65) {
      const k = easeOutQuint((s - 11.95) / 0.7)
      opacity = clamp((s - 11.95) / 0.25)
      const p = bez(start, { x: b.x - 40, y: b.y + 25 }, b, k)
      x = p.x
      y = p.y
    } else if (s < 13.7) {
      opacity = 1
      x = b.x
      y = b.y
      if (s >= 13.1 && s < 13.28) scale = 0.91
    } else {
      const k = easeOutCubic((s - 13.7) / 0.4)
      opacity = 1 - k
      x = b.x + k * 55
      y = b.y + k * 20
    }
  }
  // Scene 04 cursor glide & click (16.95s -> 19.10s)
  else if (s >= 16.95 && s < 19.1) {
    const b = targets.s4Btn
    const start = { x: b.x + 140, y: b.y + 80 }
    if (s < 17.65) {
      const k = easeOutQuint((s - 16.95) / 0.7)
      opacity = clamp((s - 16.95) / 0.25)
      const p = bez(start, { x: b.x + 50, y: b.y - 24 }, b, k)
      x = p.x
      y = p.y
    } else if (s < 18.7) {
      opacity = 1
      x = b.x
      y = b.y
      if (s >= 18.1 && s < 18.28) scale = 0.91
    } else {
      const k = easeOutCubic((s - 18.7) / 0.4)
      opacity = 1 - k
      x = b.x - k * 45
      y = b.y + k * 25
    }
  }

  return {
    opacity: opacity.toFixed(3),
    transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale})`,
  }
})

const onResize = () => {
  measureTargets()
}

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
    elapsedMs.value = 2200
  } else {
    elapsedMs.value = 900
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
  <section class="pol-hero" aria-label="UX/UI Design, Motion & Front-End, AI Creative, and User Research Interactive Showreel">
    <div class="pol-stage">
      <!-- Ambient Obsidian Radial Light Blooms -->
      <div class="ambient-bg" aria-hidden="true">
        <div class="rad-bloom b-mint" />
        <div class="rad-bloom b-gold" />
      </div>

      <!-- Shared SVG Defs (Pixel-LED Gradients, Liquid Column Gradients, Gooey Metaball Filter) -->
      <svg class="svg-defs" width="0" height="0" aria-hidden="true">
        <defs>
          <linearGradient id="ledMintGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#86EFAC" />
            <stop offset="52%" stop-color="#34D399" />
            <stop offset="100%" stop-color="#E2B878" />
          </linearGradient>
          <linearGradient id="liquidColGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#86EFAC" stop-opacity="0.96" />
            <stop offset="55%" stop-color="#E2B878" stop-opacity="0.88" />
            <stop offset="100%" stop-color="#0E1218" stop-opacity="0.45" />
          </linearGradient>
          <filter id="gooeyMetaball" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <!-- =====================================================================
           MAIN INTERACTIVE VIEWPORT (20.0s 4-Scene Loop)
           ===================================================================== -->
      <div ref="stageRef" class="pol-viewport">
        <!-- ===================================================================
             SCENE 01 (0.0s – 5.0s) — UX/UI DESIGN
             =================================================================== -->
        <div
          v-show="s1State.visible"
          class="scene-layer s1-layer"
          :style="{
            clipPath: s1State.clipPath,
            transform: s1State.transform,
          }"
        >
          <!-- Peripheral Top Bar: Left Coordinate/Grid Spec Tag + Right Toolbar Color Token Dots -->
          <div class="periph-topbar">
            <div class="spec-chip">
              <span class="spec-dot mint" />
              <span class="spec-mono">GRID: 8PT // CONTRAST 14.8:1</span>
            </div>

            <div class="toolbar-cluster">
              <span class="tb-label">TOKENS</span>
              <span class="token-dot d-obs" title="#050507"><b>#050507</b></span>
              <span class="token-dot d-mint" title="#86EFAC"><b>#86EFAC</b></span>
              <span class="token-dot d-gold" title="#E2B878"><b>#E2B878</b></span>
            </div>
          </div>

          <!-- Center Focal Typography with 8% Radial Rim Glow & Pixel-LED Strip -->
          <div class="focal-head">
            <div class="title-rim-glow" aria-hidden="true" />
            <div class="subtitle-tag">Cognitive Ergonomics &amp; Interface Architecture</div>
            <h1 class="display-title">
              <span class="t-mask">
                <span class="t-inner" :style="{ transform: `translate3d(0, ${s1TitleY}, 0)` }">
                  <span class="c-alabaster">UX/UI</span>
                  <span class="c-led-grad">DESIGN</span>
                </span>
              </span>
            </h1>

            <!-- Pixel-LED Illumination Matrix Bar (#86EFAC <-> #E2B878) -->
            <div class="led-matrix-strip" aria-hidden="true">
              <span
                v-for="idx in LED_CELLS"
                :key="idx"
                class="led-cell"
                :class="{ 'is-lit': s1Locked || idx < 12 }"
                :style="{ animationDelay: `${idx * 45}ms` }"
              />
            </div>
          </div>

          <!-- Spatial Stage: Left Spec Card + Center SVG Liquid Columns + Right Token Card -->
          <div class="s1-workbench">
            <aside class="periph-card p-left">
              <div class="pc-kicker">SPATIAL RHYTHM</div>
              <div class="pc-val tabular">8pt Baseline</div>
              <div class="pc-sub">Auto-Layout v2 · Zero Reflow</div>
            </aside>

            <!-- Liquid Columns Showcase Card -->
            <div class="surface-card liquid-stage-card" :class="{ 'is-energized': s1Locked }">
              <div class="lsc-header">
                <span class="lsc-title">Dynamic Token Columns</span>
                <span class="lsc-badge tabular">{{ s1Locked ? 'VALIDATED · AAA' : 'LIVE_AUDIT' }}</span>
              </div>
              <div class="liquid-cols-wrap">
                <div v-for="(col, idx) in LIQUID_COLS" :key="col.id" class="liq-col-item">
                  <div class="liq-track">
                    <svg class="liq-svg" viewBox="0 0 32 100" preserveAspectRatio="none">
                      <rect
                        x="2"
                        :y="(100 - s1ColumnHeights[idx]).toFixed(1)"
                        width="28"
                        :height="s1ColumnHeights[idx].toFixed(1)"
                        rx="9"
                        fill="url(#liquidColGrad)"
                      />
                      <line
                        x1="7"
                        :y1="(104 - s1ColumnHeights[idx]).toFixed(1)"
                        x2="25"
                        :y2="(104 - s1ColumnHeights[idx]).toFixed(1)"
                        stroke="#F5F5F7"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-opacity="0.7"
                      />
                    </svg>
                  </div>
                  <span class="liq-lbl tabular">{{ col.label }}</span>
                </div>
              </div>
            </div>

            <aside class="periph-card p-right">
              <div class="pc-kicker">A11Y AUDIT</div>
              <div class="pc-val tabular c-mint">14.8 : 1</div>
              <div class="pc-sub">WCAG AAA Luminance</div>
            </aside>
          </div>

          <!-- Interactive Status Pill (Cursor Click Target) -->
          <div class="action-bar">
            <button
              ref="s1BtnRef"
              type="button"
              class="status-pill-btn"
              :class="{ 'is-hover': s1Hover, 'is-pressed': s1Pressed, 'is-locked': s1Locked }"
            >
              <span class="sp-led" />
              <span class="sp-text">DESIGN SYSTEM // V2.0 → [WCAG_AA · 8PT_GRID]</span>
              <span class="sp-check" aria-hidden="true">{{ s1Locked ? '✓' : '↗' }}</span>
              <span v-if="s1Ripple" class="click-ripple" />
            </button>
          </div>
        </div>

        <!-- ===================================================================
             SCENE 02 (5.0s – 10.0s) — MOTION & FRONT-END
             =================================================================== -->
        <div
          v-show="s2State.visible"
          class="scene-layer s2-layer"
          :style="{
            clipPath: s2State.clipPath,
            transform: s2State.transform,
          }"
        >
          <!-- Peripheral Top Bar: Crosshair Micro-Label + Live Tabular-Nums Frame Counter -->
          <div class="periph-topbar">
            <div class="crosshair-chip">
              <svg class="ch-icon" viewBox="0 0 16 16" width="14" height="14">
                <circle cx="8" cy="8" r="5.5" fill="none" stroke="#86EFAC" stroke-width="1.4" />
                <path d="M8 1v14M1 8h14" stroke="#E2B878" stroke-width="1.3" stroke-linecap="round" />
              </svg>
              <span class="ch-label">60FPS // GPU_SPRING</span>
            </div>

            <div class="frame-counter-chip tabular">
              <span class="fc-tag">FRAME</span>
              <span class="fc-num">0007 → {{ s2FrameCounter }}</span>
            </div>
          </div>

          <!-- Center Focal Title -->
          <div class="focal-head">
            <div class="title-rim-glow" aria-hidden="true" />
            <div class="subtitle-tag">Deterministic Physics &amp; Zero-Layout-Thrash</div>
            <h2 class="display-title">
              <span class="t-mask">
                <span class="t-inner" :style="{ transform: `translate3d(0, ${s2TitleY}, 0)` }">
                  <span class="c-alabaster">MOTION &amp;</span>
                  <span class="c-led-grad">FRONT-END</span>
                </span>
              </span>
            </h2>
          </div>

          <!-- Spatial Stage: Equalizer Wave + Physics Curve Telemetry + 3-Node Rotating Triangle -->
          <div class="s2-workbench">
            <!-- Equalizer Wave & Live Physics Curve Telemetry -->
            <div class="surface-card eq-card">
              <div class="eq-head">
                <span class="lsc-title">Harmonic Equalizer Wave</span>
                <span class="bezier-tag">cubic-bezier(0.16, 1, 0.3, 1)</span>
              </div>
              <div class="eq-body">
                <svg class="eq-svg" viewBox="0 0 260 72" preserveAspectRatio="none">
                  <g v-for="(h, i) in s2EqHeights" :key="i">
                    <line
                      :x1="12 + i * 13.8"
                      :y1="(36 - h / 2).toFixed(1)"
                      :x2="12 + i * 13.8"
                      :y2="(36 + h / 2).toFixed(1)"
                      :stroke="i % 2 === 0 ? '#86EFAC' : '#E2B878'"
                      stroke-width="4.5"
                      stroke-linecap="round"
                    />
                  </g>
                </svg>
                <!-- Mini Physics Curve Graph -->
                <div class="curve-box">
                  <svg viewBox="0 0 84 56" class="curve-svg">
                    <path d="M8 48 H76 M8 8 V48" stroke="rgba(255,255,255,0.14)" stroke-width="1" fill="none" />
                    <path
                      d="M8 48 C 20 8, 36 8, 76 8"
                      fill="none"
                      stroke="url(#ledMintGold)"
                      stroke-width="2.4"
                      stroke-linecap="round"
                    />
                    <circle cx="26" cy="14" r="3.5" fill="#86EFAC" />
                    <circle cx="76" cy="8" r="3.5" fill="#E2B878" />
                  </svg>
                  <span class="curve-cap tabular">16.6ms lock</span>
                </div>
              </div>
            </div>

            <!-- 3-Node Rotating Triangle with Luminous Vertex Rings -->
            <div class="surface-card tri-card">
              <div class="eq-head">
                <span class="lsc-title">Vector Mesh Rig</span>
                <span class="lsc-badge tabular">2D_COMPOSITED</span>
              </div>
              <div class="tri-stage">
                <svg class="tri-svg" viewBox="0 0 180 180">
                  <circle
                    cx="90"
                    cy="90"
                    r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    stroke-width="1"
                    stroke-dasharray="3 5"
                  />
                  <polygon
                    :points="s2TriPoints"
                    fill="rgba(134, 239, 172, 0.06)"
                    stroke="url(#ledMintGold)"
                    stroke-width="2"
                    stroke-linejoin="round"
                  />
                  <g v-for="node in s2TriNodes" :key="node.id">
                    <!-- Outer Luminous Vertex Ring -->
                    <circle
                      :cx="node.x.toFixed(1)"
                      :cy="node.y.toFixed(1)"
                      r="11"
                      fill="rgba(5, 5, 7, 0.85)"
                      :stroke="node.color"
                      stroke-width="1.8"
                    />
                    <circle
                      :cx="node.x.toFixed(1)"
                      :cy="node.y.toFixed(1)"
                      r="4.2"
                      :fill="node.color"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <!-- Clean Voltrep Pill (Cursor Click Target) -->
          <div class="action-bar">
            <button
              ref="s2BtnRef"
              type="button"
              class="status-pill-btn voltrep-pill"
              :class="{ 'is-hover': s2Hover, 'is-pressed': s2Pressed, 'is-locked': s2Locked }"
            >
              <span class="sp-led" />
              <span class="sp-text tabular">VOLTREP LIVE · 120 KG × 6 REPS ✓</span>
              <span class="sp-tag">{{ s2Locked ? 'SET_SYNCED' : '60FPS' }}</span>
              <span v-if="s2Ripple" class="click-ripple" />
            </button>
          </div>
        </div>

        <!-- ===================================================================
             SCENE 03 (10.0s – 15.0s) — AI CREATIVE
             =================================================================== -->
        <div
          v-show="s3State.visible"
          class="scene-layer s3-layer"
          :style="{
            clipPath: s3State.clipPath,
            transform: s3State.transform,
          }"
        >
          <!-- Focal Header + Monospace Prompt-Output Tag -->
          <div class="focal-head">
            <div class="title-rim-glow" aria-hidden="true" />
            <div class="subtitle-tag">Deterministic Generative Design Pipelines</div>
            <h2 class="display-title">
              <span class="t-mask">
                <span class="t-inner" :style="{ transform: `translate3d(0, ${s3TitleY}, 0)` }">
                  <span class="c-alabaster">AI</span>
                  <span class="c-led-grad">CREATIVE</span>
                </span>
              </span>
            </h2>

            <!-- Monospace Prompt-Output Tag (Cursor Click Target) -->
            <button
              ref="s3BtnRef"
              type="button"
              class="status-pill-btn prompt-token-pill"
              :class="{ 'is-hover': s3Hover, 'is-pressed': s3Pressed, 'is-locked': s3Locked }"
            >
              <span class="sp-led" />
              <span class="sp-text">PROMPT → TOKENIZED_UI // ZERO_BLOAT</span>
              <span class="sp-check" aria-hidden="true">{{ s3Locked ? '✓' : '⚡' }}</span>
              <span v-if="s3Ripple" class="click-ripple" />
            </button>
          </div>

          <!-- Split Stage: Binary Stream Left + 4 Glassmorphic Output Artifacts Right -->
          <div class="s3-workbench">
            <!-- Binary Stream Console Card -->
            <div class="surface-card binary-card">
              <div class="eq-head">
                <span class="lsc-title">Tokenized Binary Stream</span>
                <span class="lsc-badge tabular">AST_COMPILER</span>
              </div>
              <div class="binary-rows">
                <div v-for="(row, rIdx) in BINARY_ROWS" :key="rIdx" class="bin-row tabular">
                  <span class="bin-idx">0{{ rIdx + 1 }}</span>
                  <span class="bin-code">{{ row }}</span>
                  <span class="bin-dot" :class="{ 'is-active': s3Locked || rIdx < 2 }" />
                </div>
              </div>
              <div class="bin-footer">
                <span>Schema: DesignTokens.v2</span>
                <span class="c-mint tabular">{{ s3Locked ? '4/4 ARTIFACTS READY' : 'STREAMING…' }}</span>
              </div>
            </div>

            <!-- 4 Glassmorphic Output Artifacts with Connector Ticks -->
            <div class="artifacts-grid">
              <div
                v-for="(art, aIdx) in AI_ARTIFACTS"
                :key="art.id"
                class="artifact-frame"
                :class="{ 'is-energized': s3Locked }"
              >
                <!-- Crisp Connector Tick -->
                <div class="conn-tick" aria-hidden="true">
                  <span class="ct-line" />
                  <span class="ct-dot" :style="{ background: art.accent }" />
                </div>

                <div class="af-top">
                  <span class="af-code tabular">{{ art.code }}</span>
                  <span class="af-status" :style="{ color: art.accent }">✓ Deliverable</span>
                </div>

                <div class="af-visual">
                  <!-- Artifact 1: Sparkle Pulse (Harmonic Radial Wave) -->
                  <svg v-if="art.id === 'pulse'" viewBox="0 0 120 34" class="af-svg">
                    <path
                      d="M4 17 Q 18 4, 32 17 T 60 17 T 88 17 T 116 17"
                      fill="none"
                      stroke="#86EFAC"
                      stroke-width="2.2"
                      stroke-linecap="round"
                    />
                    <circle cx="60" cy="17" r="5" fill="#E2B878" />
                  </svg>
                  <!-- Artifact 2: UX Sparkline -->
                  <svg v-else-if="art.id === 'spark'" viewBox="0 0 120 34" class="af-svg">
                    <polyline
                      points="4,28 28,23 52,25 76,13 102,9 116,5"
                      fill="none"
                      stroke="#E2B878"
                      stroke-width="2.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <circle cx="116" cy="5" r="4" fill="#86EFAC" />
                  </svg>
                  <!-- Artifact 3: Wireframe Contour -->
                  <svg v-else-if="art.id === 'wire'" viewBox="0 0 120 34" class="af-svg">
                    <rect x="4" y="4" width="34" height="26" rx="4" fill="none" stroke="#86EFAC" stroke-width="1.6" />
                    <rect x="44" y="4" width="72" height="11" rx="3" fill="rgba(226,184,120,0.22)" stroke="#E2B878" stroke-width="1.4" />
                    <rect x="44" y="19" width="48" height="11" rx="3" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.4" />
                  </svg>
                  <!-- Artifact 4: Typography Token -->
                  <div v-else class="af-type-preview">
                    <span class="af-aa">Aa</span>
                    <span class="af-scale tabular">clamp(2.8rem, 6vw, 5.5rem)</span>
                  </div>
                </div>

                <div class="af-title">{{ art.title }}</div>
                <div class="af-meta">{{ art.meta }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             SCENE 04 (15.0s – 20.0s) — USER RESEARCH
             =================================================================== -->
        <div
          v-show="s4State.visible"
          class="scene-layer s4-layer"
          :style="{
            clipPath: s4State.clipPath,
            transform: s4State.transform,
          }"
        >
          <!-- Focal Title + Upgraded Floating Telemetry Pills (tabular-nums) -->
          <div class="focal-head">
            <div class="title-rim-glow" aria-hidden="true" />
            <div class="subtitle-tag">Empirical Validation &amp; Behavioral Telemetry</div>
            <h2 class="display-title">
              <span class="t-mask">
                <span class="t-inner" :style="{ transform: `translate3d(0, ${s4TitleY}, 0)` }">
                  <span class="c-alabaster">USER</span>
                  <span class="c-led-grad">RESEARCH</span>
                </span>
              </span>
            </h2>

            <!-- Floating Telemetry Pills Beside USER RESEARCH -->
            <div class="telemetry-row">
              <div class="telemetry-pill tp-mint tabular">
                <span class="tp-dot mint" />
                <strong>-42% Cognitive Friction</strong>
              </div>
              <div class="telemetry-pill tp-gold tabular">
                <span class="tp-dot gold" />
                <strong>98.4% Task Completion · SUS 91/100</strong>
              </div>
            </div>
          </div>

          <!-- Lighter Studio Backdrop Stage with Expressive Tracking Eyes, Gooey Metaball Collision & Heuristic Micro-Tags -->
          <div class="s4-studio-wrap">
            <!-- Left Heuristic Validation Micro-Tag -->
            <div class="heuristic-tag h-left">
              <span class="ht-check">✓</span>
              <div class="ht-copy">
                <strong>A11y Verified</strong>
                <span>WCAG AA/AAA Contrast</span>
              </div>
            </div>

            <!-- Lighter Studio Backdrop Card (High Contrast Deep Obsidian Ink #07080C on #EDF0F5) -->
            <div class="studio-collision-card" :class="{ 'is-merged': s4Locked }">
              <div class="scc-top">
                <span class="scc-kicker">BEHAVIORAL COLLISION STAGE</span>
                <span class="scc-state tabular">{{ s4Locked ? 'ERGONOMIC_SYNTHESIS ✓' : 'EYE_TRACKING_ACTIVE' }}</span>
              </div>

              <div class="scc-visual-row">
                <!-- Expressive Tracking Eyes (Crisp Anti-Aliased SVG) -->
                <div class="eyes-pod" aria-hidden="true">
                  <svg viewBox="0 0 132 58" class="eyes-svg" shape-rendering="geometricPrecision">
                    <!-- Left Eye -->
                    <rect x="6" y="6" width="52" height="46" rx="23" fill="#FFFFFF" stroke="#07080C" stroke-width="2.5" />
                    <g :transform="`translate(${s4Pupil.x}, ${s4Pupil.y})`">
                      <circle cx="32" cy="29" r="11.5" fill="#07080C" />
                      <circle cx="28.5" cy="25.5" r="3.2" fill="#FFFFFF" />
                    </g>
                    <!-- Right Eye -->
                    <rect x="74" y="6" width="52" height="46" rx="23" fill="#FFFFFF" stroke="#07080C" stroke-width="2.5" />
                    <g :transform="`translate(${s4Pupil.x}, ${s4Pupil.y})`">
                      <circle cx="100" cy="29" r="11.5" fill="#07080C" />
                      <circle cx="96.5" cy="25.5" r="3.2" fill="#FFFFFF" />
                    </g>
                  </svg>
                  <span class="pod-caption">Gaze Vector Lock</span>
                </div>

                <!-- Gooey Metaball Collision Stage -->
                <div class="metaball-pod" aria-hidden="true">
                  <svg viewBox="0 0 220 82" class="metaball-svg" shape-rendering="geometricPrecision">
                    <g filter="url(#gooeyMetaball)">
                      <circle
                        :cx="(110 - s4MetaballOffset).toFixed(1)"
                        cy="41"
                        r="24"
                        fill="#059669"
                      />
                      <circle
                        :cx="(110 + s4MetaballOffset).toFixed(1)"
                        cy="41"
                        r="24"
                        fill="#D97706"
                      />
                      <circle
                        v-if="s4Locked"
                        cx="110"
                        cy="41"
                        r="28"
                        fill="#047857"
                      />
                    </g>
                    <!-- Crisp Specular Rim Overlay -->
                    <circle
                      :cx="(110 - s4MetaballOffset).toFixed(1)"
                      cy="41"
                      r="23"
                      fill="none"
                      stroke="#07080C"
                      stroke-width="1.5"
                      stroke-opacity="0.28"
                    />
                    <circle
                      :cx="(110 + s4MetaballOffset).toFixed(1)"
                      cy="41"
                      r="23"
                      fill="none"
                      stroke="#07080C"
                      stroke-width="1.5"
                      stroke-opacity="0.28"
                    />
                  </svg>
                  <span class="pod-caption">{{ s4Locked ? '1 Unified Task Node' : 'Friction Synthesis' }}</span>
                </div>
              </div>

              <!-- Interactive Heuristic Validation Button (Cursor Click Target) -->
              <div class="scc-footer">
                <span class="scc-note tabular">n = 48 moderated usability sessions</span>
                <button
                  ref="s4BtnRef"
                  type="button"
                  class="studio-action-pill"
                  :class="{ 'is-hover': s4Hover, 'is-pressed': s4Pressed, 'is-locked': s4Locked }"
                >
                  <span class="sap-dot" />
                  <span class="sap-lbl">Flow Simplified</span>
                  <span class="sap-icon">{{ s4Locked ? '✓' : '→' }}</span>
                  <span v-if="s4Ripple" class="click-ripple dark-ripple" />
                </button>
              </div>
            </div>

            <!-- Right Heuristic Validation Micro-Tag -->
            <div class="heuristic-tag h-right" :class="{ 'is-active': s4Locked }">
              <span class="ht-check">✓</span>
              <div class="ht-copy">
                <strong>Flow Simplified</strong>
                <span>5 Steps → 3 Ergonomic Nodes</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             PIXEL-ACCURATE VECTOR CURSOR (getBoundingClientRect() tracked)
             =================================================================== -->
        <div
          class="pol-cursor"
          :style="{
            opacity: stageCursor.opacity,
            transform: stageCursor.transform,
          }"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path
              d="M2.5 2.5L9.5 20.5L12.7 13.3L19.9 10.1L2.5 2.5Z"
              fill="#F5F5F7"
              stroke="#050507"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <!-- =====================================================================
           PROTECTED LOWER-LEFT SAFE ZONE (Identity + Primary & Secondary CTAs)
           ===================================================================== -->
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
.pol-hero {
  width: 100%;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.pol-stage {
  position: relative;
  width: 100%;
  min-height: 94vh;
  min-height: 94svh;
  background-color: #050507;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4.8rem 0 1.6rem;
  color: #F5F5F7;
}
@media (min-width: 768px) {
  .pol-stage {
    padding: 5.2rem 0 2.1rem;
  }
}

/* Ambient Radial Blooms */
.ambient-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.rad-bloom {
  position: absolute;
  border-radius: 50%;
  filter: blur(115px);
  animation: bloomDrift 14s ease-in-out infinite alternate;
}
.b-mint {
  width: 50vw;
  height: 50vw;
  max-width: 700px;
  max-height: 700px;
  top: 5%;
  left: 12%;
  opacity: 0.075;
  background: radial-gradient(circle, #86EFAC 0%, transparent 70%);
}
.b-gold {
  width: 48vw;
  height: 48vw;
  max-width: 680px;
  max-height: 680px;
  bottom: 4%;
  right: 10%;
  opacity: 0.08;
  background: radial-gradient(circle, #E2B878 0%, transparent 70%);
  animation-direction: alternate-reverse;
}
@keyframes bloomDrift {
  0% { transform: translate3d(-2%, -1%, 0) scale(0.96); }
  100% { transform: translate3d(2%, 2%, 0) scale(1.06); }
}

/* Viewport & Scene Layer */
.pol-viewport {
  position: relative;
  z-index: 2;
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  padding: 0.4rem 1rem;
}
@media (min-width: 768px) {
  .pol-viewport {
    padding: 0.75rem 2.25rem;
  }
}

.scene-layer {
  position: relative;
  grid-area: 1 / 1;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  min-height: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  will-change: transform, clip-path;
}

.tabular {
  font-variant-numeric: tabular-nums;
}

/* Elevated Surface & Specular Lighting Polish */
.surface-card,
.periph-card,
.spec-chip,
.toolbar-cluster,
.crosshair-chip,
.frame-counter-chip,
.artifact-frame,
.heuristic-tag,
.telemetry-pill {
  background: linear-gradient(180deg, rgba(22, 25, 34, 0.92) 0%, rgba(12, 14, 20, 0.94) 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 22px 48px -18px rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(12px);
}

/* Peripheral Top Bar */
.periph-topbar {
  width: 100%;
  max-width: 1160px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.spec-chip,
.crosshair-chip,
.frame-counter-chip,
.toolbar-cluster {
  display: inline-flex;
  align-items: center;
  gap: 0.48rem;
  padding: 0.34rem 0.72rem;
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: #E5E7EB;
}

.spec-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.spec-dot.mint {
  background: #86EFAC;
  box-shadow: 0 0 8px rgba(134, 239, 172, 0.65);
}

.tb-label {
  color: #9CA3AF;
  font-weight: 600;
  margin-right: 0.15rem;
}
.token-dot {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  padding: 0.12rem 0.42rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.65rem;
  color: #D1D5DB;
}
.token-dot::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.token-dot.d-obs::before {
  background: #050507;
  box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.5);
}
.token-dot.d-mint::before {
  background: #86EFAC;
}
.token-dot.d-gold::before {
  background: #E2B878;
}
.token-dot b {
  font-weight: 600;
}
@media (max-width: 640px) {
  .token-dot b {
    display: none;
  }
}

/* Focal Head & Ambient Rim Glow */
.focal-head {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.42rem;
}

.title-rim-glow {
  position: absolute;
  inset: -28px -60px;
  background: radial-gradient(ellipse at center, rgba(134, 239, 172, 0.08) 0%, rgba(226, 184, 120, 0.08) 45%, transparent 72%);
  pointer-events: none;
  z-index: 0;
}

.subtitle-tag {
  position: relative;
  z-index: 1;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #D1D5DB;
}

.display-title {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: clamp(1.85rem, 5.4vw, 4.75rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.04;
}

.t-mask {
  display: inline-block;
  overflow: hidden;
  padding: 0.04em 0.08em 0.1em;
}
.t-inner {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.24em;
  will-change: transform;
}

.c-alabaster {
  color: #F5F5F7;
}
.c-led-grad {
  background: linear-gradient(92deg, #86EFAC 0%, #E2B878 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.c-mint {
  color: #86EFAC;
}

/* Pixel-LED Illumination Matrix Strip */
.led-matrix-strip {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(15, 17, 24, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.led-cell {
  width: 11px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.14);
  transition: background 240ms ease, box-shadow 240ms ease;
}
.led-cell.is-lit {
  background: linear-gradient(90deg, #86EFAC, #E2B878);
  box-shadow: 0 0 8px rgba(134, 239, 172, 0.45);
}

/* Scene 01 Workbench */
.s1-workbench {
  width: 100%;
  max-width: 1140px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
  align-items: center;
}
@media (min-width: 960px) {
  .s1-workbench {
    grid-template-columns: 210px 1fr 210px;
    gap: 1.15rem;
  }
}

.periph-card {
  padding: 0.9rem 1rem;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
}
@media (max-width: 959px) {
  .periph-card {
    display: none;
  }
}
.pc-kicker {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #9CA3AF;
}
.pc-val {
  font-size: 1.35rem;
  font-weight: 800;
  color: #F5F5F7;
}
.pc-sub {
  font-size: 0.74rem;
  color: #D1D5DB;
}

.liquid-stage-card {
  padding: 0.95rem 1.2rem;
  border-radius: 16px;
  transition: border-color 260ms ease, box-shadow 260ms ease;
}
.liquid-stage-card.is-energized {
  border-color: rgba(134, 239, 172, 0.45);
}

.lsc-header,
.eq-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}
.lsc-title {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #E5E7EB;
}
.lsc-badge {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.66rem;
  padding: 0.15rem 0.52rem;
  border-radius: 999px;
  background: rgba(134, 239, 172, 0.12);
  border: 1px solid rgba(134, 239, 172, 0.35);
  color: #86EFAC;
}

.liquid-cols-wrap {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.55rem;
  align-items: end;
}
.liq-col-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.32rem;
}
.liq-track {
  width: 100%;
  max-width: 36px;
  height: 92px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2px;
  overflow: hidden;
}
.liq-svg {
  width: 100%;
  height: 100%;
  display: block;
}
.liq-lbl {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.66rem;
  color: #D1D5DB;
}

/* Status Pill Button */
.action-bar {
  display: flex;
  justify-content: center;
}

.status-pill-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  gap: 0.5rem;
  padding: 0.6rem 1.05rem;
  border-radius: 999px;
  background: linear-gradient(180deg, #171A24 0%, #0E1017 100%);
  border: 1px solid rgba(226, 184, 120, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 14px 32px -12px rgba(0, 0, 0, 0.85);
  color: #F5F5F7;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: clamp(0.64rem, 1.3vw, 0.8rem);
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: transform 140ms ease, border-color 220ms ease, background 220ms ease, box-shadow 220ms ease;
}
.status-pill-btn.is-hover {
  transform: translate3d(0, -2px, 0);
  border-color: #86EFAC;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 24px rgba(134, 239, 172, 0.24);
}
.status-pill-btn.is-pressed {
  transform: scale(0.93);
}
.status-pill-btn.is-locked {
  background: linear-gradient(92deg, rgba(134, 239, 172, 0.18) 0%, rgba(226, 184, 120, 0.2) 100%);
  border-color: #86EFAC;
  color: #FFFFFF;
}

.sp-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #86EFAC, #E2B878);
  box-shadow: 0 0 10px rgba(134, 239, 172, 0.75);
  flex-shrink: 0;
}
.sp-check,
.sp-tag {
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  background: rgba(134, 239, 172, 0.16);
  color: #86EFAC;
  font-size: 0.68rem;
  font-weight: 700;
}

.click-ripple {
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 2px solid #86EFAC;
  animation: rippleOut 580ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  pointer-events: none;
}
.click-ripple.dark-ripple {
  border-color: #059669;
}
@keyframes rippleOut {
  0% { opacity: 0.7; transform: scale(0.96); }
  100% { opacity: 0; transform: scale(1.14); }
}

/* Scene 02 Workbench */
.ch-label {
  color: #86EFAC;
  font-weight: 700;
}
.fc-tag {
  color: #9CA3AF;
}
.fc-num {
  color: #E2B878;
  font-weight: 700;
}

.s2-workbench {
  width: 100%;
  max-width: 980px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}
@media (min-width: 820px) {
  .s2-workbench {
    grid-template-columns: 1.45fr 1fr;
    gap: 1.1rem;
  }
}

.eq-card,
.tri-card {
  padding: 0.9rem 1.05rem;
  border-radius: 16px;
  min-width: 0;
  max-width: 100%;
}

.bezier-tag {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.64rem;
  padding: 0.14rem 0.5rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.14);
  border: 1px solid rgba(226, 184, 120, 0.38);
  color: #E2B878;
  white-space: nowrap;
}

.eq-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  min-width: 0;
}
.eq-svg {
  flex: 1 1 0%;
  min-width: 0;
  width: 100%;
  height: 76px;
}
.curve-box {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.32rem 0.45rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.curve-svg {
  width: 78px;
  height: 48px;
}
.curve-cap {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.62rem;
  color: #86EFAC;
}

.tri-stage {
  display: grid;
  place-items: center;
}
.tri-svg {
  width: 122px;
  height: 122px;
}

/* Scene 03 Workbench */
.s3-workbench {
  width: 100%;
  max-width: 1080px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
  align-items: stretch;
}
@media (min-width: 880px) {
  .s3-workbench {
    grid-template-columns: 0.92fr 1.28fr;
    gap: 1.15rem;
  }
}

.binary-card {
  padding: 0.9rem 1.05rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.6rem;
}
@media (max-width: 640px) {
  .binary-card {
    display: none;
  }
}

.binary-rows {
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
}
.bin-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.32rem 0.55rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.68rem;
}
.bin-idx {
  color: #E2B878;
  font-weight: 700;
}
.bin-code {
  color: #D1D5DB;
}
.bin-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}
.bin-dot.is-active {
  background: #86EFAC;
  box-shadow: 0 0 8px rgba(134, 239, 172, 0.7);
}
.bin-footer {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.66rem;
  color: #9CA3AF;
}

.artifacts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
}

.artifact-frame {
  position: relative;
  padding: 0.7rem 0.85rem 0.7rem 1.05rem;
  border-radius: 12px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  transition: border-color 240ms ease, transform 240ms ease;
}
.artifact-frame.is-energized {
  border-color: rgba(134, 239, 172, 0.45);
}

.conn-tick {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}
.ct-line {
  width: 7px;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.32);
}
.ct-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.af-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.62rem;
}
.af-code {
  color: #9CA3AF;
}
.af-status {
  font-weight: 700;
}
.af-visual {
  height: 34px;
  display: flex;
  align-items: center;
}
.af-svg {
  width: 100%;
  height: 32px;
}
.af-type-preview {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
}
.af-aa {
  font-size: 1.25rem;
  font-weight: 800;
  color: #E2B878;
}
.af-scale {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.62rem;
  color: #D1D5DB;
}
.af-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #F5F5F7;
}
.af-meta {
  font-size: 0.68rem;
  color: #D1D5DB;
}

/* Scene 04 Workbench (Telemetry Pills + Lighter Studio Stage + Heuristic Micro-Tags) */
.telemetry-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.55rem;
  margin-top: 0.15rem;
}
.telemetry-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.36rem 0.82rem;
  border-radius: 999px;
  font-size: 0.76rem;
  color: #F5F5F7;
}
.tp-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.tp-dot.mint {
  background: #86EFAC;
}
.tp-dot.gold {
  background: #E2B878;
}

.s4-studio-wrap {
  width: 100%;
  max-width: 1120px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
  align-items: center;
}
@media (min-width: 960px) {
  .s4-studio-wrap {
    grid-template-columns: 205px 1fr 205px;
    gap: 1rem;
  }
}

.heuristic-tag {
  padding: 0.78rem 0.9rem;
  border-radius: 14px;
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  text-align: left;
}
@media (max-width: 959px) {
  .heuristic-tag {
    display: none;
  }
}
.heuristic-tag.is-active {
  border-color: #86EFAC;
}
.ht-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(134, 239, 172, 0.16);
  color: #86EFAC;
  display: grid;
  place-items: center;
  font-size: 0.74rem;
  font-weight: 800;
  flex-shrink: 0;
}
.ht-copy {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
}
.ht-copy strong {
  font-size: 0.8rem;
  color: #F5F5F7;
}
.ht-copy span {
  font-size: 0.68rem;
  color: #D1D5DB;
}

/* Lighter Studio Backdrop Card (High WCAG AA/AAA Contrast: #07080C ink on #EEF1F6) */
.studio-collision-card {
  background: linear-gradient(180deg, #F4F6FA 0%, #E6EAF2 100%);
  color: #07080C;
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    0 24px 55px -18px rgba(0, 0, 0, 0.85);
  border-radius: 18px;
  padding: 0.95rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.68rem;
  font-weight: 700;
}
.scc-kicker {
  color: #1F2937;
  letter-spacing: 0.08em;
}
.scc-state {
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: #07080C;
  color: #86EFAC;
}

.scc-visual-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
  align-items: center;
}
@media (min-width: 600px) {
  .scc-visual-row {
    grid-template-columns: 0.9fr 1.1fr;
  }
}

.eyes-pod,
.metaball-pod {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.45rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(7, 8, 12, 0.12);
}
.eyes-svg {
  width: 126px;
  height: 54px;
}
.metaball-svg {
  width: 200px;
  height: 70px;
}
.pod-caption {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.66rem;
  font-weight: 700;
  color: #111827;
}

.scc-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.scc-note {
  font-size: 0.72rem;
  font-weight: 600;
  color: #1F2937;
}

.studio-action-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: #07080C;
  color: #F5F5F7;
  border: 1.5px solid #07080C;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 140ms ease, background 200ms ease, color 200ms ease;
}
.studio-action-pill.is-hover {
  transform: translate3d(0, -2px, 0);
  box-shadow: 0 8px 20px -6px rgba(7, 8, 12, 0.45);
}
.studio-action-pill.is-pressed {
  transform: scale(0.93);
}
.studio-action-pill.is-locked {
  background: #065F46;
  border-color: #047857;
  color: #FFFFFF;
}
.sap-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #86EFAC;
}

/* Pixel-Accurate Vector Cursor */
.pol-cursor {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  z-index: 40;
  pointer-events: none;
  transform-origin: 2px 2px;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.65));
  will-change: transform, opacity;
}

/* Protected Lower-Left Safe Zone */
.safe-zone {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}
@media (min-width: 768px) {
  .safe-zone {
    padding: 0 2.5rem;
  }
}
.id-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.55rem;
}
.id-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  font-size: 0.9rem;
}
.id-name {
  font-weight: 700;
  color: #F5F5F7;
}
.id-sep {
  display: none;
  color: #9CA3AF;
}
@media (min-width: 520px) {
  .id-row {
    flex-direction: row;
    align-items: center;
    gap: 0.45rem;
  }
  .id-sep {
    display: inline;
  }
}
.id-role {
  color: #D1D5DB;
}
.id-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.cta-gold {
  background-color: #E2B878 !important;
  color: #050507 !important;
  border-color: #E2B878 !important;
  padding: 0.56rem 1.05rem !important;
  font-size: 0.84rem !important;
  font-weight: 700 !important;
}
.cta-glass {
  background-color: #121318 !important;
  color: #F5F5F7 !important;
  border-color: rgba(255, 255, 255, 0.18) !important;
  padding: 0.56rem 1.05rem !important;
  font-size: 0.84rem !important;
}

@media (prefers-reduced-motion: reduce) {
  .rad-bloom,
  .click-ripple {
    animation: none !important;
  }
}
</style>
