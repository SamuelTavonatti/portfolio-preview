<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

// =============================================================================
// 16.0s CLEAN-SLATE APP-PRESENTATION HERO SHOWREEL (4.00s per Scene)
// Engineered from scratch per the 49-Video Playbook:
// - Surgical Shape Morphing (width, height, borderRadius — ZERO scaleX/scaleY)
// - "Text Before UI" Eye-Tracing Hierarchy (180ms lead inside overflow:hidden mask)
// - Continuous Camera Null-Chaining & 5% Micro-Scale Match Cut (1.00 <-> 1.05)
// - Pixel-Accurate getBoundingClientRect() Cursor + Macro UI Zoom (165% / 170%)
// - Zero Clutter, Zero 3D Tilts, Zero Gemini/Google Icons, 100% English Copy
// =============================================================================

const LOOP_SEC = 16.0
const LOOP_MS = LOOP_SEC * 1000

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)

let rafId = null
let lastTs = null

// Dynamic getBoundingClientRect() DOM Refs
const stageRef = ref(null)
const s1ProdBtnRef = ref(null)
const s1ValBtnRef = ref(null)
const s2BtnRef = ref(null)
const s3FieldRef = ref(null)
const s3BtnRef = ref(null)
const s4CheckRef = ref(null)
const s4CaseBtnRef = ref(null)

const targets = reactive({
  s1ProdBtn: { x: 640, y: 270 },
  s1ValBtn: { x: 880, y: 270 },
  s2Btn: { x: 960, y: 425 },
  s3Field: { x: 640, y: 390 },
  s3Btn: { x: 910, y: 455 },
  s4Check: { x: 645, y: 445 },
  s4CaseBtn: { x: 860, y: 495 },
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

const driftY = (seed = 0, amp = 5) => Math.sin(sec.value * 2.2 + seed) * amp
const driftX = (seed = 0, amp = 4) => Math.cos(sec.value * 1.8 + seed) * amp

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
  if (s >= 0.42 && s <= 2.92) {
    targets.s1ProdBtn = centerOf(s1ProdBtnRef.value, vpRect, targets.s1ProdBtn)
    targets.s1ValBtn = centerOf(s1ValBtnRef.value, vpRect, targets.s1ValBtn)
  }
  if (s >= 4.2 && s <= 6.85) {
    targets.s2Btn = centerOf(s2BtnRef.value, vpRect, targets.s2Btn)
  }
  if (s >= 8.2 && s <= 11.05) {
    targets.s3Field = centerOf(s3FieldRef.value, vpRect, targets.s3Field)
    targets.s3Btn = centerOf(s3BtnRef.value, vpRect, targets.s3Btn)
  }
  if (s >= 12.2 && s <= 15.05) {
    targets.s4Check = centerOf(s4CheckRef.value, vpRect, targets.s4Check)
    targets.s4CaseBtn = centerOf(s4CaseBtnRef.value, vpRect, targets.s4CaseBtn)
  }
}

const bez = (p0, p1, p2, k) => ({
  x: (1 - k) * (1 - k) * p0.x + 2 * (1 - k) * k * p1.x + k * k * p2.x,
  y: (1 - k) * (1 - k) * p0.y + 2 * (1 - k) * k * p1.y + k * k * p2.y,
})

// =============================================================================
// SCENE 01 (0.00s – 4.00s) — UX/UI DESIGN (Framer Wireframe-to-Live + Figma)
// 1.15s: Cursor clicks `Production UI` -> Blue wireframe (#3B82F6) fills into high-contrast UI
// 2.65s: Cursor clicks `Validate Flow →` -> Macro Zoom (165%) + pill morphs into Scene 02
// =============================================================================
const s1Origin = computed(() => `${targets.s1ValBtn.x.toFixed(0)}px ${targets.s1ValBtn.y.toFixed(0)}px`)
const s1TextY = computed(() => `${((1 - easeOutQuint(clamp(sec.value / 0.34))) * 105).toFixed(1)}%`)
const s1UiReveal = computed(() => {
  const k = easeOutQuint(clamp((sec.value - 0.17) / 0.36))
  return {
    transform: `translate3d(0, ${((1 - k) * 18).toFixed(1)}px, 0)`,
    opacity: k.toFixed(2),
  }
})

const s1ProdHover = computed(() => sec.value >= 0.72 && sec.value < 1.38)
const s1ProdPressed = computed(() => sec.value >= 1.1 && sec.value < 1.32)
const s1IsLive = computed(() => sec.value >= 1.2)
const s1ProdRipple = computed(() => sec.value >= 1.15 && sec.value < 1.75)

const s1ValHover = computed(() => sec.value >= 2.05 && sec.value < 3.05)
const s1ValPressed = computed(() => sec.value >= 2.65 && sec.value < 2.88)
const s1ValActive = computed(() => sec.value >= 2.75)
const s1ValRipple = computed(() => sec.value >= 2.7 && sec.value < 3.35)

const s1State = computed(() => {
  const s = sec.value
  if (s >= 3.55) {
    return { visible: false, transform: 'none', clipPath: 'inset(0% 0% 0% 0%)', periL: 'none', periR: 'none' }
  }
  if (s < 0.42) {
    // Seamless 5% micro-scale match-cut settle from Scene 04's Figma wireframe morph
    const k = easeOutQuint(s / 0.42)
    const sc = (1.05 - k * 0.05).toFixed(3)
    const vIn = ((1 - k) * 10).toFixed(2)
    const hIn = ((1 - k) * 12).toFixed(2)
    const rad = ((1 - k) * 12).toFixed(1)
    return {
      visible: true,
      transform: `scale(${sc})`,
      clipPath: `inset(${vIn}% ${hIn}% ${vIn}% ${hIn}% round ${rad}px)`,
      periL: `translate3d(${((1 - k) * -32).toFixed(1)}px, 0, 0)`,
      periR: `translate3d(${((1 - k) * 32).toFixed(1)}px, 0, 0)`,
    }
  }
  if (s > 2.88) {
    // Macro Camera Zoom (100% -> 165%) into `Validate Flow →`
    const k = easeInOutQuart((s - 2.88) / 0.67)
    const zoom = (1 + k * 0.65).toFixed(3)
    const iris = s > 3.16 ? ((s - 3.16) / 0.39) * 44 : 0
    return {
      visible: true,
      transform: `scale(${zoom})`,
      clipPath:
        iris > 0
          ? `inset(${iris.toFixed(2)}% ${iris.toFixed(2)}% ${iris.toFixed(2)}% ${iris.toFixed(2)}% round 26px)`
          : 'inset(0% 0% 0% 0%)',
      periL: `translate3d(${(-k * 145).toFixed(1)}%, 0, 0)`,
      periR: `translate3d(${(k * 145).toFixed(1)}%, 0, 0)`,
    }
  }
  return {
    visible: true,
    transform: 'scale(1)',
    clipPath: 'inset(0% 0% 0% 0%)',
    periL: 'translate3d(0, 0, 0)',
    periR: 'translate3d(0, 0, 0)',
  }
})

// =============================================================================
// SCENE 02 (4.00s – 8.00s) — USER RESEARCH (Linear / Material Motion Telemetry)
// 2-frame stagger Bento cards; tangled 6-step path snaps to 3 clean nodes on `Simplify` click
// =============================================================================
const s2TextY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 3.55) / 0.34))) * 105).toFixed(1)}%`)

const s2HeaderMorph = computed(() => {
  const k = easeSpring(clamp((sec.value - 3.55) / 0.56))
  const maxW = Math.round(165 + k * 255)
  const rad = Math.round(999 - k * 965)
  return { maxWidth: `${maxW}px`, borderRadius: `${Math.max(34, rad)}px` }
})

const s2BentoStyle = (idx) => {
  const start = 3.74 + idx * 0.034 // ~2-frame stagger
  const k = easeOutQuint(clamp((sec.value - start) / 0.34))
  return {
    transform: `translate3d(0, ${((1 - k) * 20).toFixed(1)}px, 0)`,
    opacity: k.toFixed(2),
  }
}

const s2Hover = computed(() => sec.value >= 5.75 && sec.value < 6.85)
const s2Pressed = computed(() => sec.value >= 6.45 && sec.value < 6.68)
const s2Simplified = computed(() => sec.value >= 6.55)
const s2Ripple = computed(() => sec.value >= 6.5 && sec.value < 7.15)

const s2State = computed(() => {
  const s = sec.value
  if (s < 3.55 || s >= 7.58) {
    return { visible: false, transform: 'none', clipPath: 'inset(0% 0% 0% 0%)', periL: 'none', periR: 'none', arcK: 0 }
  }
  if (s < 4.12) {
    const k = easeOutQuint((s - 3.55) / 0.57)
    const sc = (1.05 - k * 0.05).toFixed(3)
    const vIn = ((1 - k) * 10).toFixed(2)
    const hIn = ((1 - k) * 14).toFixed(2)
    const rad = ((1 - k) * 22).toFixed(1)
    return {
      visible: true,
      transform: `scale(${sc})`,
      clipPath: `inset(${vIn}% ${hIn}% ${vIn}% ${hIn}% round ${rad}px)`,
      periL: 'translate3d(0, 0, 0)',
      periR: 'translate3d(0, 0, 0)',
      arcK: 0,
    }
  }
  if (s > 6.68) {
    const k = easeInOutQuart((s - 6.68) / 0.9)
    const sc = (1 + k * 0.05).toFixed(3)
    const wipeL = Math.min(100, k * 114).toFixed(2)
    return {
      visible: true,
      transform: `scale(${sc})`,
      clipPath: `inset(0% 0% 0% ${wipeL}%)`,
      periL: `translate3d(${(-k * 135).toFixed(1)}%, 0, 0)`,
      periR: `translate3d(${(k * 135).toFixed(1)}%, 0, 0)`,
      arcK: k,
    }
  }
  return {
    visible: true,
    transform: 'scale(1)',
    clipPath: 'inset(0% 0% 0% 0%)',
    periL: 'translate3d(0, 0, 0)',
    periR: 'translate3d(0, 0, 0)',
    arcK: 0,
  }
})

const s2NodeArc = (dir) => {
  const k = s2State.value.arcK
  if (k <= 0) return 'translate3d(0, 0, 0)'
  const arcY = -Math.sin(k * Math.PI) * 22
  return `translate3d(${(dir * k * 54).toFixed(1)}px, ${arcY.toFixed(1)}px, 0)`
}

const s2Clock = computed(() => Math.max(0, sec.value - 3.55))
const mFriction = computed(() => Math.round(easeOutExpo((s2Clock.value - 0.16) / 0.8) * 42))
const mTask = computed(() => (easeOutExpo((s2Clock.value - 0.2) / 0.85) * 98.4).toFixed(1))
const mSus = computed(() => Math.round(easeOutExpo((s2Clock.value - 0.24) / 0.9) * 91))

const tr2Ribbon = computed(() => {
  const s = sec.value
  if (s < 6.72 || s > 7.72) return { active: false, dashOffset: 1400, opacity: '0' }
  const k = easeInOutQuart((s - 6.72) / 0.65)
  const fadeOut = s > 7.42 ? 1 - clamp((s - 7.42) / 0.3) : 1
  return { active: true, dashOffset: Math.round((1 - k) * 1400), opacity: fadeOut.toFixed(2) }
})

// =============================================================================
// SCENE 03 (8.00s – 12.00s) — CREATIVE AI (Command Composer -> Aperture Wipe)
// =============================================================================
const FULL_PROMPT =
  'Architect a low-friction workout logger with WCAG AA contrast, 8pt spatial rhythm, and 60fps micro-interactions.'

const s3Origin = computed(() => `${targets.s3Btn.x.toFixed(0)}px ${targets.s3Btn.y.toFixed(0)}px`)
const s3TextY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 7.58) / 0.34))) * 105).toFixed(1)}%`)

const s3PromptMorph = computed(() => {
  const s = sec.value
  if (s < 7.74 || s >= 8.32) return {}
  // Surgical width + borderRadius spring morph (ZERO scaleX/scaleY distortion)
  const k = easeSpring((s - 7.74) / 0.58)
  const maxW = Math.round(210 + k * 510)
  const rad = Math.round(999 - k * 979)
  return { maxWidth: `${maxW}px`, borderRadius: `${Math.max(20, rad)}px` }
})

const s3State = computed(() => {
  const s = sec.value
  if (s < 7.58 || s >= 11.7) {
    return { visible: false, transform: 'none', clipPath: 'inset(0% 0% 0% 0%)', apTop: 'none', apBot: 'none' }
  }
  if (s < 8.14) {
    const k = easeOutQuint((s - 7.58) / 0.56)
    return {
      visible: true,
      transform: `scale(${(1.05 - k * 0.05).toFixed(3)})`,
      clipPath: 'inset(0% 0% 0% 0%)',
      apTop: 'translate3d(0, 0, 0)',
      apBot: 'translate3d(0, 0, 0)',
    }
  }
  if (s > 11.02) {
    // Macro Camera Zoom (100% -> 170%) + horizontal aperture split
    const k = easeInOutQuart((s - 11.02) / 0.68)
    const splitY = (k * 185).toFixed(1)
    return {
      visible: true,
      transform: `scale(${(1 + k * 0.7).toFixed(3)})`,
      clipPath: 'inset(0% 0% 0% 0%)',
      apTop: `translate3d(0, -${splitY}px, 0)`,
      apBot: `translate3d(0, ${splitY}px, 0)`,
    }
  }
  return {
    visible: true,
    transform: 'scale(1)',
    clipPath: 'inset(0% 0% 0% 0%)',
    apTop: 'translate3d(0, 0, 0)',
    apBot: 'translate3d(0, 0, 0)',
  }
})

const s3Focused = computed(() => sec.value >= 8.2 && sec.value < 11.02)
const typedText = computed(() => {
  const p = clamp((sec.value - 8.32) / 1.92)
  return FULL_PROMPT.slice(0, Math.floor(p * FULL_PROMPT.length))
})
const tokenCount = computed(() => Math.round(typedText.value.length * 1.4))
const s3Ready = computed(() => typedText.value.length >= FULL_PROMPT.length - 1)
const s3Hover = computed(() => sec.value >= 10.5 && sec.value < 11.25)
const s3Pressed = computed(() => sec.value >= 10.8 && sec.value < 11.02)
const s3Ripple = computed(() => sec.value >= 10.85 && sec.value < 11.55)

// =============================================================================
// SCENE 04 (12.00s – 16.00s) — MOTION & FRONT-END (Living Voltrep & Portfolio)
// 12.95s: Clicks Voltrep `Log Set ✓` -> emerald `Set Logged ✓`
// 14.85s: Clicks `Inspect System ↗` -> Card morphs back into blue Figma wireframe box
// =============================================================================
const s4TextY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 11.7) / 0.34))) * 105).toFixed(1)}%`)

const s4State = computed(() => {
  const s = sec.value
  if (s < 11.7) {
    return { visible: false, transform: 'none', clipPath: 'inset(0% 0% 0% 0%)', morphK: 0, otherExit: 'none' }
  }
  if (s < 12.16) {
    const k = easeOutQuint((s - 11.7) / 0.46)
    const vAp = ((1 - k) * 44).toFixed(2)
    const rad = ((1 - k) * 20).toFixed(1)
    return {
      visible: true,
      transform: `scale(${(1.05 - k * 0.05).toFixed(3)})`,
      clipPath: `inset(${vAp}% 0% ${vAp}% 0% round ${rad}px)`,
      morphK: 0,
      otherExit: 'translate3d(0, 0, 0)',
    }
  }
  if (s > 15.05) {
    // Card border morphs into blue Figma wireframe frame + 5% micro-scale match cut
    const k = easeInOutQuart((s - 15.05) / 0.95)
    const vIn = (k * 10).toFixed(2)
    const hIn = (k * 12).toFixed(2)
    const rad = (k * 12).toFixed(1)
    return {
      visible: true,
      transform: `scale(${(1 + k * 0.05).toFixed(3)})`,
      clipPath: `inset(${vIn}% ${hIn}% ${vIn}% ${hIn}% round ${rad}px)`,
      morphK: k,
      otherExit: `translate3d(${(-k * 125).toFixed(1)}%, 0, 0)`,
    }
  }
  return {
    visible: true,
    transform: 'scale(1)',
    clipPath: 'inset(0% 0% 0% 0%)',
    morphK: 0,
    otherExit: 'translate3d(0, 0, 0)',
  }
})

const s4CheckHover = computed(() => sec.value >= 12.68 && sec.value < 13.55)
const s4CheckPressed = computed(() => sec.value >= 12.95 && sec.value < 13.16)
const s4VoltDone = computed(() => sec.value >= 13.04)
const s4CheckRipple = computed(() => sec.value >= 13.0 && sec.value < 13.6)
const s4NavIdx = computed(() => (sec.value < 13.55 ? 0 : 1))
const s4CaseHover = computed(() => sec.value >= 14.32 && sec.value < 15.25)
const s4CasePressed = computed(() => sec.value >= 14.85 && sec.value < 15.05)
const s4CaseRipple = computed(() => sec.value >= 14.9 && sec.value < 15.5)

// =============================================================================
// UNIFIED STAGE CURSOR (Pixel-Accurate getBoundingClientRect() Targeting)
// =============================================================================
const stageCursor = computed(() => {
  const s = sec.value
  const p1 = targets.s1ProdBtn
  const v1 = targets.s1ValBtn
  const b2 = targets.s2Btn
  const f3 = targets.s3Field
  const b3 = targets.s3Btn
  const c4 = targets.s4Check
  const k4 = targets.s4CaseBtn

  let pos = { x: p1.x, y: p1.y }
  let ibeam = false
  let pressed = false

  if (s < 3.55) {
    // Scene 01: Clicks `Production UI` (1.15s) -> glides to `Validate Flow →` (2.65s)
    if (s < 0.72) {
      const k = easeInOutQuart(clamp((s - 0.25) / 0.47))
      pos = bez({ x: p1.x - 110, y: p1.y + 65 }, { x: p1.x - 40, y: p1.y + 12 }, p1, k)
    } else if (s < 1.38) {
      pos = { x: p1.x, y: p1.y }
    } else if (s < 2.05) {
      const k = easeInOutQuart(clamp((s - 1.38) / 0.67))
      pos = bez(p1, { x: (p1.x + v1.x) / 2, y: p1.y - 24 }, v1, k)
    } else {
      pos = { x: v1.x, y: v1.y }
    }
    pressed = s1ProdPressed.value || s1ValPressed.value
  } else if (s < 7.58) {
    // Scene 02: Glides dead-center onto `Simplify` (6.45s)
    if (s < 5.75) {
      const k = easeInOutQuart(clamp((s - 4.1) / 1.65))
      pos = bez(v1, { x: (v1.x + b2.x) / 2, y: Math.min(v1.y, b2.y) - 34 }, b2, k)
    } else {
      pos = { x: b2.x, y: b2.y }
    }
    pressed = s2Pressed.value
  } else if (s < 11.7) {
    // Scene 03: Glides into prompt input (I-beam), types, glides dead-center onto `↑ Generate`
    if (s < 8.25) {
      const k = easeInOutQuart(clamp((s - 7.7) / 0.55))
      pos = bez(b2, { x: f3.x - 35, y: f3.y - 25 }, f3, k)
    } else if (s < 10.18) {
      pos = { x: f3.x + Math.sin(s * 3) * 4, y: f3.y }
      ibeam = true
    } else if (s < 10.55) {
      const k = easeInOutQuart(clamp((s - 10.18) / 0.37))
      pos = bez(f3, { x: (f3.x + b3.x) / 2, y: f3.y - 22 }, b3, k)
    } else {
      pos = { x: b3.x, y: b3.y }
    }
    pressed = s3Pressed.value
  } else {
    // Scene 04: Clicks Voltrep `Log Set ✓` (12.95s) -> glides onto `Inspect System ↗` (14.85s)
    if (s < 12.68) {
      const k = easeInOutQuart(clamp((s - 11.95) / 0.73))
      pos = bez(b3, { x: (b3.x + c4.x) / 2, y: c4.y - 36 }, c4, k)
    } else if (s < 13.55) {
      pos = { x: c4.x, y: c4.y }
    } else if (s < 14.32) {
      const k = easeInOutQuart(clamp((s - 13.55) / 0.77))
      pos = bez(c4, { x: (c4.x + k4.x) / 2, y: c4.y - 26 }, k4, k)
    } else {
      pos = { x: k4.x, y: k4.y }
    }
    pressed = s4CheckPressed.value || s4CasePressed.value
  }

  return { x: pos.x, y: pos.y, ibeam, scale: pressed ? 0.88 : 1 }
})

const ambientTheme = computed(() => {
  const s = sec.value
  if (s < 3.55) return 'ambient-design'
  if (s < 7.58) return 'ambient-research'
  if (s < 11.7) return 'ambient-ai'
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
    elapsedMs.value = 1600
  } else {
    elapsedMs.value = 1400 // opens cleanly on Scene 01: UX/UI DESIGN
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
  <section class="showreel-hero" aria-label="UX/UI Design & Front-End App Presentation Showreel">
    <div class="showreel-stage" :class="ambientTheme">
      <!-- Deep Obsidian Ambient Aurora & Depth-Blurred Bokeh Orbs -->
      <div class="aurora-layer" aria-hidden="true">
        <div class="aurora-bloom a-1" />
        <div class="aurora-bloom a-2" />
        <div class="depth-bokeh b-1" />
        <div class="depth-bokeh b-2" />
        <div class="depth-bokeh b-3" />
      </div>

      <div ref="stageRef" class="stage-viewport">
        <!-- =========================================================
             SCENE 01 (0.0s – 4.0s) — UX/UI DESIGN
             Framer Wireframe (#3B82F6) -> Live Production UI -> `Validate Flow →`
             ========================================================= -->
        <div
          v-show="s1State.visible"
          class="scene-layer"
          :style="{
            clipPath: s1State.clipPath,
            transform: s1State.transform,
            transformOrigin: s1Origin,
          }"
        >
          <div
            class="peri-token pt-tl"
            :style="{ transform: `${s1State.periL} translate3d(${driftX(0.3).toFixed(1)}px, ${driftY(0.3).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">TYPOGRAPHY TOKEN</span>
            <span class="pt-val tabular-nums">Inter · -0.03em · tabular-nums</span>
          </div>

          <div
            class="peri-token pt-tr"
            :style="{ transform: `${s1State.periR} translate3d(${driftX(1.4).toFixed(1)}px, ${driftY(1.4).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">CONTRAST AUDIT</span>
            <span class="pt-val is-emerald tabular-nums">14.8:1 Contrast · WCAG AAA</span>
          </div>

          <div
            class="peri-token pt-bl"
            :style="{ transform: `${s1State.periL} translate3d(${driftX(2.4).toFixed(1)}px, ${driftY(2.4).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">SPATIAL RHYTHM</span>
            <span class="pt-val tabular-nums">8pt Grid · Auto Layout v4</span>
          </div>

          <div
            class="peri-token pt-br"
            :style="{ transform: `${s1State.periR} translate3d(${driftX(3.3).toFixed(1)}px, ${driftY(3.3).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">PALETTE TOKENS</span>
            <span class="pt-swatches">
              <i><em style="background:#050507" />#050507</i>
              <i><em style="background:#E2B878" />#E2B878</i>
              <i><em style="background:#34D399" />#34D399</i>
            </span>
          </div>

          <div class="mask-clip">
            <span class="scene-kicker is-gold" :style="{ transform: `translate3d(0, ${s1TextY}, 0)` }">
              8pt Grid · WCAG AA Contrast · Design Tokens
            </span>
          </div>
          <div class="mask-clip">
            <h1 class="scene-title" :style="{ transform: `translate3d(0, ${s1TextY}, 0)` }">
              <span class="t-ice">UX/UI</span>
              <span class="t-gold">DESIGN</span>
              <span class="notion-pills" aria-hidden="true">
                <span class="n-pill">8pt Grid</span>
                <span class="n-pill is-gold">WCAG AA</span>
              </span>
            </h1>
          </div>

          <div class="figma-canvas" :style="s1UiReveal">
            <div class="fc-bar">
              <div class="fc-left">
                <span class="fc-dots" aria-hidden="true"><i /><i /><i /></span>
                <span class="fc-name tabular-nums">Frame / Voltrep_System</span>
              </div>

              <div class="fc-actions">
                <button
                  ref="s1ProdBtnRef"
                  type="button"
                  tabindex="-1"
                  class="pill-btn is-blue-toggle is-target"
                  :class="{ 'is-hover': s1ProdHover, 'is-active': s1IsLive, 'is-pressed': s1ProdPressed }"
                >
                  <span class="btn-txt">Production UI</span>
                  <span v-if="s1ProdRipple" class="btn-ripple is-blue" aria-hidden="true" />
                </button>

                <button
                  ref="s1ValBtnRef"
                  type="button"
                  tabindex="-1"
                  class="pill-btn is-gold-action is-target"
                  :class="{ 'is-hover': s1ValHover, 'is-active': s1ValActive, 'is-pressed': s1ValPressed }"
                >
                  <span class="btn-txt">Validate Flow →</span>
                  <span v-if="s1ValRipple" class="btn-ripple" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div class="fc-grid">
              <div class="fc-side" aria-hidden="true">
                <span class="fc-side-title">LAYERS</span>
                <span class="fc-layer is-on"># Frame / Hero</span>
                <span class="fc-layer">⊞ Auto Layout</span>
                <span class="fc-layer">⬡ 8pt Grid</span>
              </div>

              <div class="fc-center">
                <!-- Framer Wireframe (#3B82F6) -> High-Contrast Live UI Morph -->
                <div class="wireframe-box" :class="{ 'is-live': s1IsLive }">
                  <span class="wf-handle tl" aria-hidden="true" />
                  <span class="wf-handle tr" aria-hidden="true" />
                  <span class="wf-handle bl" aria-hidden="true" />
                  <span class="wf-handle br" aria-hidden="true" />
                  <span class="wf-badge tabular-nums" aria-hidden="true">
                    {{ s1IsLive ? '24px · Live Token' : '1px #3B82F6 Wireframe' }}
                  </span>

                  <div class="wf-card" :class="{ 'is-live': s1IsLive }">
                    <div class="wfc-top">
                      <span class="wfc-tag">VOLTREP · PRODUCTION UI</span>
                      <span class="wfc-chip tabular-nums">14.8:1 AAA ✓</span>
                    </div>
                    <div class="wfc-title">Hack Squat · 120 kg × 6 reps</div>
                    <div class="wfc-track"><div class="wfc-fill" /></div>
                  </div>
                </div>
              </div>

              <div class="fc-side" aria-hidden="true">
                <span class="fc-side-title">TOKENS</span>
                <span class="fc-tok"><i style="background:#050507" />#050507</span>
                <span class="fc-tok"><i style="background:#E2B878" />#E2B878</span>
                <span class="fc-tok"><i style="background:#34D399" />#34D399</span>
              </div>
            </div>
          </div>
        </div>

        <!-- =========================================================
             SCENE 02 (4.0s – 8.0s) — USER RESEARCH
             2-frame Bento stagger; tangled 6-step path snaps to 3 nodes on `Simplify`
             ========================================================= -->
        <div
          v-show="s2State.visible"
          class="scene-layer"
          :style="{
            clipPath: s2State.clipPath,
            transform: s2State.transform,
          }"
        >
          <div
            class="peri-token pt-tl"
            :style="{ transform: `${s2State.periL} translate3d(${driftX(0.7).toFixed(1)}px, ${driftY(0.7).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">HEURISTIC AUDIT</span>
            <span class="pt-val is-emerald">10/10 Ergonomic Rules ✓</span>
          </div>

          <div
            class="peri-token pt-tr"
            :style="{ transform: `${s2State.periR} translate3d(${driftX(1.7).toFixed(1)}px, ${driftY(1.7).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">DECISION LATENCY</span>
            <span class="pt-val tabular-nums">1.2s Avg Set Log Time</span>
          </div>

          <div
            class="peri-token pt-bl"
            :style="{ transform: `${s2State.periL} translate3d(${driftX(2.6).toFixed(1)}px, ${driftY(2.6).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">TEST COHORT</span>
            <span class="pt-val tabular-nums">N = 48 Active Athletes</span>
          </div>

          <div
            class="peri-token pt-br"
            :style="{ transform: `${s2State.periR} translate3d(${driftX(3.5).toFixed(1)}px, ${driftY(3.5).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">PRIMARY CTA FIXATION</span>
            <span class="pt-val is-gold tabular-nums">94.2% Eye-Tracking</span>
          </div>

          <div class="mask-clip">
            <span class="scene-kicker is-emerald" :style="{ transform: `translate3d(0, ${s2TextY}, 0)` }">
              -42% Cognitive Friction · 98.4% Task Completion · SUS 91/100
            </span>
          </div>
          <div class="mask-clip">
            <h1 class="scene-title" :style="{ transform: `translate3d(0, ${s2TextY}, 0)` }">
              <span class="t-ice">USER</span>
              <span class="t-emerald">RESEARCH</span>
            </h1>
          </div>

          <!-- Morph-target Header from Scene 01 `Validate Flow →` -->
          <div class="telemetry-header-pill" :style="s2HeaderMorph">
            <span class="thp-text">Telemetry Verified · Cognitive Ergonomics</span>
            <span class="thp-badge">98.4% Flow ✓</span>
          </div>

          <div class="bento-grid-3">
            <div class="glass-card bento-item" :style="s2BentoStyle(0)">
              <div class="bi-head">
                <span class="bi-tag">COGNITIVE FRICTION</span>
                <span class="bi-ok">↓ Optimal</span>
              </div>
              <div class="bi-metric-row">
                <span class="bi-num is-emerald tabular-nums">-{{ mFriction }}%</span>
                <svg class="bi-spark" viewBox="0 0 110 34" fill="none" aria-hidden="true">
                  <path d="M4 6 L32 12 L58 10 L82 24 L106 29" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" />
                  <circle cx="106" cy="29" r="3.5" fill="#34D399" />
                </svg>
              </div>
              <span class="bi-sub">Reduced cognitive load during active sets</span>
            </div>

            <div class="glass-card bento-item" :style="s2BentoStyle(1)">
              <div class="bi-head">
                <span class="bi-tag">TASK COMPLETION</span>
                <span class="bi-sus tabular-nums">SUS {{ mSus }}/100</span>
              </div>
              <div class="bi-metric-row">
                <span class="bi-num is-ice tabular-nums">{{ mTask }}%</span>
                <span class="bi-bench">Benchmark</span>
              </div>
              <div class="sus-track" aria-hidden="true">
                <div class="sus-fill" :style="{ width: `${mSus}%` }" />
              </div>
            </div>

            <div class="glass-card bento-item" :style="s2BentoStyle(2)">
              <div class="bi-head">
                <span class="bi-tag">USER JOURNEY</span>
                <span class="bi-status" :class="{ clean: s2Simplified }">
                  {{ s2Simplified ? '3 Clean Nodes ✓' : '6 Friction Steps' }}
                </span>
              </div>

              <!-- Tangled 6-step path snaps into 3 clean nodes on `Simplify` click -->
              <div v-if="!s2Simplified" class="tangled-row">
                <span class="t-step">Auth</span>
                <span class="t-step">Menu</span>
                <span class="t-step">Filter</span>
                <span class="t-step">Edit</span>
                <span class="t-step">Save</span>
                <button
                  ref="s2BtnRef"
                  type="button"
                  tabindex="-1"
                  class="j-node is-emerald is-target is-simplify-btn"
                  :class="{ 'is-hover': s2Hover, 'is-pressed': s2Pressed }"
                >
                  <i class="j-dot emerald" />
                  <span class="btn-txt">Simplify</span>
                  <span v-if="s2Ripple" class="btn-ripple is-emerald" aria-hidden="true" />
                </button>
              </div>

              <div v-else class="clean-journey-row">
                <span class="j-node" :style="{ transform: s2NodeArc(1) }">
                  <i class="j-dot ice" />Discover
                </span>
                <span class="j-line" :style="{ opacity: (1 - s2State.arcK).toFixed(2) }" />
                <span class="j-node is-gold" :style="{ transform: s2NodeArc(0) }">
                  <i class="j-dot gold" />Validate
                </span>
                <span class="j-line" :style="{ opacity: (1 - s2State.arcK).toFixed(2) }" />
                <button
                  ref="s2BtnRef"
                  type="button"
                  tabindex="-1"
                  class="j-node is-emerald is-active is-target is-simplify-btn"
                  :style="{ transform: s2NodeArc(-1) }"
                >
                  <i class="j-dot emerald" />
                  <span class="btn-txt">Simplify</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- HORIZONTAL ENERGY RIBBON (SCENE 02 -> SCENE 03) -->
        <svg
          v-if="tr2Ribbon.active"
          class="ribbon-overlay"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          :style="{ opacity: tr2Ribbon.opacity }"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="apRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#34D399" stop-opacity="0.3" />
              <stop offset="50%" stop-color="#E2B878" stop-opacity="1" />
              <stop offset="100%" stop-color="#F5F5F7" stop-opacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d="M -40 315 Q 300 265, 600 315 T 1240 315"
            fill="none"
            stroke="url(#apRibbon)"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="1400"
            :stroke-dashoffset="tr2Ribbon.dashOffset"
            style="filter: drop-shadow(0 0 18px rgba(226, 184, 120, 0.9));"
          />
        </svg>

        <!-- =========================================================
             SCENE 03 (8.0s – 12.0s) — CREATIVE AI
             Raycast/Linear Command Composer -> Macro Zoom (170%) + Aperture Wipe
             ========================================================= -->
        <div
          v-show="s3State.visible"
          class="scene-layer"
          :style="{
            clipPath: s3State.clipPath,
            transform: s3State.transform,
            transformOrigin: s3Origin,
          }"
        >
          <div
            class="peri-token pt-tl"
            :style="{ transform: `${s3State.apTop} translate3d(${driftX(1.1).toFixed(1)}px, ${driftY(1.1).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">CONTEXT 01</span>
            <span class="pt-val is-gold">Design System v2 · 8pt</span>
          </div>

          <div
            class="peri-token pt-tr"
            :style="{ transform: `${s3State.apTop} translate3d(${driftX(2.1).toFixed(1)}px, ${driftY(2.1).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">CONTEXT 02</span>
            <span class="pt-val is-emerald">User Telemetry · -42% Friction</span>
          </div>

          <div
            class="peri-token pt-bl"
            :style="{ transform: `${s3State.apBot} translate3d(${driftX(3.0).toFixed(1)}px, ${driftY(3.0).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">A11Y AUDIT</span>
            <span class="pt-val tabular-nums">WCAG AA · 14.8:1 Contrast</span>
          </div>

          <div
            class="peri-token pt-br"
            :style="{ transform: `${s3State.apBot} translate3d(${driftX(4.1).toFixed(1)}px, ${driftY(4.1).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">RUNTIME TARGET</span>
            <span class="pt-val tabular-nums">Vue 3 · 60fps GPU Composited</span>
          </div>

          <div class="mask-clip" :style="{ transform: s3State.apTop }">
            <span class="scene-kicker is-gold" :style="{ transform: `translate3d(0, ${s3TextY}, 0)` }">
              System Prompt → Component Architecture → Token Validation
            </span>
          </div>
          <div class="mask-clip" :style="{ transform: s3State.apTop }">
            <h1 class="scene-title" :style="{ transform: `translate3d(0, ${s3TextY}, 0)` }">
              <span class="t-ice">CREATIVE</span>
              <span class="t-gold">AI</span>
            </h1>
          </div>

          <div class="command-composer" :class="{ 'is-focus': s3Focused }" :style="s3PromptMorph">
            <div class="cc-header" :style="{ transform: s3State.apTop }">
              <span class="cc-model"><i class="cc-dot" />System Architecture Prompt</span>
              <span class="cc-tokens tabular-nums" :class="{ lit: typedText.length > 0 }">
                {{ tokenCount }} tok · Validated
              </span>
            </div>

            <div ref="s3FieldRef" class="cc-input" :style="{ transform: s3State.apTop }">
              <span>{{ typedText }}</span><span class="cc-caret" :class="{ on: s3Focused }" aria-hidden="true" />
            </div>

            <div class="cc-footer" :style="{ transform: s3State.apBot }">
              <div class="cc-chips" aria-hidden="true">
                <span class="cc-chip">Design System v2</span>
                <span class="cc-chip">A11y Audit</span>
                <span class="cc-chip">User Telemetry</span>
              </div>
              <button
                ref="s3BtnRef"
                type="button"
                tabindex="-1"
                class="cc-submit is-target"
                :class="{ ready: s3Ready, 'is-hover': s3Hover, 'is-pressed': s3Pressed }"
              >
                <span aria-hidden="true">↑</span>
                <span class="btn-txt">Generate</span>
                <span v-if="s3Ripple" class="btn-ripple" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <!-- =========================================================
             SCENE 04 (12.0s – 16.0s) — MOTION & FRONT-END
             Voltrep `Log Set ✓` + Sliding Pill Navbar + `Inspect System ↗`
             ========================================================= -->
        <div
          v-show="s4State.visible"
          class="scene-layer"
          :style="{
            clipPath: s4State.clipPath,
            transform: s4State.transform,
          }"
        >
          <div
            class="peri-token pt-tl"
            :style="{ transform: `${s4State.otherExit} translate3d(${driftX(0.6).toFixed(1)}px, ${driftY(0.6).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">FRAME BUDGET</span>
            <span class="pt-val is-emerald tabular-nums">60 FPS · 16.6ms GPU</span>
          </div>

          <div
            class="peri-token pt-tr"
            :style="{ transform: `${s4State.otherExit} translate3d(${driftX(1.7).toFixed(1)}px, ${driftY(1.7).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">LAYOUT STABILITY</span>
            <span class="pt-val tabular-nums">CLS 0.00 · Zero Shift</span>
          </div>

          <div
            class="peri-token pt-bl"
            :style="{ transform: `${s4State.otherExit} translate3d(${driftX(2.9).toFixed(1)}px, ${driftY(2.9).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">PRODUCTION STACK</span>
            <span class="pt-val tabular-nums">Vue 3 · Vite · Semantic Code</span>
          </div>

          <div
            class="peri-token pt-br"
            :style="{ transform: `${s4State.otherExit} translate3d(${driftX(3.6).toFixed(1)}px, ${driftY(3.6).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="pt-label">SPRING PHYSICS</span>
            <span class="pt-val is-gold tabular-nums">cubic-bezier(0.16, 1, 0.3, 1)</span>
          </div>

          <div class="mask-clip" :style="{ transform: s4State.otherExit }">
            <span class="scene-kicker is-gold" :style="{ transform: `translate3d(0, ${s4TextY}, 0)` }">
              Voltrep Production UI · 60 FPS GPU Compositing · Zero Layout Shift
            </span>
          </div>
          <div class="mask-clip" :style="{ transform: s4State.otherExit }">
            <h1 class="scene-title" :style="{ transform: `translate3d(0, ${s4TextY}, 0)` }">
              <span class="t-gold">MOTION &amp;</span>
              <span class="t-ice">FRONT-END</span>
            </h1>
          </div>

          <div class="pill-navbar" :style="{ transform: s4State.otherExit }" aria-hidden="true">
            <span class="pn-thumb" :style="{ transform: `translate3d(${s4NavIdx * 100}%, 0, 0)` }" />
            <span class="pn-item" :class="{ active: s4NavIdx === 0 }">Overview</span>
            <span class="pn-item" :class="{ active: s4NavIdx === 1 }">Case Studies</span>
            <span class="pn-item">Journey</span>
          </div>

          <div class="fe-row">
            <div class="glass-card volt-logger" :class="{ done: s4VoltDone }" :style="{ transform: s4State.otherExit }">
              <div class="vl-top">
                <span class="vl-brand">VOLTREP · WORKOUT LOGGER</span>
                <span class="vl-status tabular-nums" :class="{ done: s4VoltDone }">
                  {{ s4VoltDone ? 'Set Logged ✓' : 'Set 4 / 4' }}
                </span>
              </div>
              <div class="vl-ex">Hack Squat</div>
              <div class="vl-mid">
                <div class="vl-nums tabular-nums">
                  <span class="vl-val">120 kg × 6 reps</span>
                  <span class="vl-sub">RPE 8.5 · Cognitive Ergonomics</span>
                </div>
                <button
                  ref="s4CheckRef"
                  type="button"
                  tabindex="-1"
                  class="vl-btn is-target"
                  :class="{ 'is-hover': s4CheckHover && !s4VoltDone, 'is-pressed': s4CheckPressed, done: s4VoltDone }"
                >
                  <span class="btn-txt">Log Set ✓</span>
                  <span v-if="s4CheckRipple" class="btn-ripple is-emerald" aria-hidden="true" />
                </button>
              </div>
              <div class="vl-bar" aria-hidden="true">
                <div class="vl-fill" :style="{ width: s4VoltDone ? '100%' : '75%' }" />
              </div>
            </div>

            <div
              class="glass-card case-study-card"
              :class="{ hover: s4CaseHover, 'is-wireframe-morph': s4State.morphK > 0.05 }"
              :style="{
                transform: s4State.morphK > 0 ? `translate3d(${(-s4State.morphK * 175).toFixed(1)}px, 0, 0)` : 'none',
                borderRadius: s4State.morphK > 0 ? `${Math.round(16 - s4State.morphK * 12)}px` : undefined,
              }"
            >
              <template v-if="s4State.morphK > 0.08">
                <span class="wf-handle tl" aria-hidden="true" />
                <span class="wf-handle tr" aria-hidden="true" />
                <span class="wf-handle bl" aria-hidden="true" />
                <span class="wf-handle br" aria-hidden="true" />
                <span class="wf-badge tabular-nums" aria-hidden="true">1px #3B82F6 Wireframe</span>
              </template>

              <div class="cs-top">
                <span class="cs-tag">FEATURED CASE STUDY</span>
                <span class="cs-pill">60 FPS · Semantic Code</span>
              </div>
              <div class="cs-title">Voltrep Case Study</div>
              <div class="cs-specs">WCAG AA Contrast · 8pt Spatial Rhythm · Zero Paywall</div>
              <button
                ref="s4CaseBtnRef"
                type="button"
                tabindex="-1"
                class="cs-btn is-target"
                :class="{ 'is-hover': s4CaseHover, 'is-pressed': s4CasePressed }"
              >
                <span class="btn-txt">Inspect System ↗</span>
                <span v-if="s4CaseRipple" class="btn-ripple" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <!-- GLOBAL PIXEL-ACCURATE VECTOR CURSOR -->
        <div
          class="stage-cursor"
          :style="{
            transform: `translate3d(${stageCursor.x.toFixed(1)}px, ${stageCursor.y.toFixed(1)}px, 0) scale(${stageCursor.scale})`,
          }"
          aria-hidden="true"
        >
          <svg class="cur-svg" :class="{ hide: stageCursor.ibeam }" viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M2 2L19 10.5L11.5 13L8.5 20.5L2 2Z" fill="#E2B878" stroke="#050507" stroke-width="1.6" stroke-linejoin="round" />
          </svg>
          <svg class="cur-svg cur-ibeam" :class="{ show: stageCursor.ibeam }" viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M9 4h6M9 20h6M12 4v16" stroke="#F5F5F7" stroke-width="1.9" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!-- LOWER-LEFT SAFE ZONE (ISOLATED FROM STAGE ANIMATIONS) -->
      <div class="safe-footer">
        <div class="identity-block">
          <div class="id-line">
            <span class="id-name">Samuel Tavonatti</span>
            <span class="id-sep" aria-hidden="true">—</span>
            <span class="id-role">UI/UX Designer &amp; Front-End</span>
          </div>
          <div class="id-ctas">
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
.showreel-hero {
  width: 100%;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.showreel-stage {
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

@media (min-width: 768px) {
  .showreel-stage {
    padding: 5.3rem 0 2rem;
  }
}

/* AMBIENT OBSIDIAN AURORA & DEPTH BOKEH (backdrop-filter: blur(24px)) */
.aurora-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.aurora-bloom {
  position: absolute;
  border-radius: 50%;
  filter: blur(115px);
  will-change: transform, opacity;
  transition: background 1s cubic-bezier(0.16, 1, 0.3, 1);
  animation: auroraBreathe 9s ease-in-out infinite alternate;
}

.a-1 { width: 55vw; height: 55vw; max-width: 760px; max-height: 760px; top: 6%; left: 16%; opacity: 0.09; }
.a-2 { width: 45vw; height: 45vw; max-width: 580px; max-height: 580px; bottom: 5%; right: 10%; opacity: 0.075; animation-direction: alternate-reverse; }

@keyframes auroraBreathe {
  0% { transform: scale(0.96) translate3d(0, 0, 0); }
  100% { transform: scale(1.06) translate3d(2%, -2%, 0); }
}

.ambient-design .a-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-design .a-2 { background: radial-gradient(circle, #3B82F6 0%, transparent 70%); }
.ambient-research .a-1 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }
.ambient-research .a-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .a-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .a-2 { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }
.ambient-frontend .a-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-frontend .a-2 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }

.depth-bokeh {
  position: absolute;
  border-radius: 50%;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.045);
  animation: auroraBreathe 12s ease-in-out infinite alternate;
}
.b-1 { width: 150px; height: 150px; top: 15%; left: 6%; background: radial-gradient(circle, rgba(226, 184, 120, 0.13) 0%, transparent 70%); }
.b-2 { width: 190px; height: 190px; bottom: 18%; right: 7%; background: radial-gradient(circle, rgba(52, 211, 153, 0.11) 0%, transparent 70%); animation-delay: -4s; }
.b-3 { width: 100px; height: 100px; top: 52%; left: 10%; background: radial-gradient(circle, rgba(245, 245, 247, 0.08) 0%, transparent 70%); animation-delay: -7s; }

/* FULL-BLEED 100VW VIEWPORT */
.stage-viewport {
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

@media (min-width: 768px) {
  .stage-viewport { padding: 0.85rem 2.5rem; }
}

.scene-layer {
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

@media (min-width: 768px) {
  .scene-layer { min-height: 520px; }
}

/* PERIPHERAL FLOATING TOKENS */
.peri-token {
  display: none;
  position: absolute;
  z-index: 1;
  padding: 0.58rem 0.82rem;
  border-radius: 12px;
  background: rgba(15, 17, 23, 0.84);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.85);
  text-align: left;
  pointer-events: none;
  flex-direction: column;
  gap: 0.18rem;
}

@media (min-width: 1180px) {
  .peri-token { display: flex; }
}

.pt-tl { top: 8%; left: 0.5rem; }
.pt-tr { top: 8%; right: 0.5rem; }
.pt-bl { bottom: 16%; left: 0.5rem; }
.pt-br { bottom: 14%; right: 0.5rem; }

.pt-label { font-family: var(--font-mono); font-size: 0.57rem; font-weight: 700; letter-spacing: 0.08em; color: #8B92A0; }
.pt-val { font-family: var(--font-mono); font-size: 0.71rem; font-weight: 600; color: #F5F5F7; }
.pt-val.is-gold { color: #E2B878; }
.pt-val.is-emerald { color: #6EE7B7; }
.pt-swatches { display: flex; gap: 0.45rem; font-family: var(--font-mono); font-size: 0.65rem; color: #D1D5DB; }
.pt-swatches i { display: inline-flex; align-items: center; gap: 0.24rem; font-style: normal; }
.pt-swatches em { width: 8px; height: 8px; border-radius: 2px; border: 1px solid rgba(255, 255, 255, 0.25); }

/* TEXT-BEFORE-UI MASKED TYPOGRAPHY */
.mask-clip {
  overflow: hidden;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.scene-kicker {
  display: inline-block;
  padding: 0.25rem 0.78rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.67rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  will-change: transform;
}

.scene-kicker.is-gold { background: rgba(226, 184, 120, 0.12); border: 1px solid rgba(226, 184, 120, 0.38); color: #E2B878; }
.scene-kicker.is-emerald { background: rgba(52, 211, 153, 0.12); border: 1px solid rgba(52, 211, 153, 0.38); color: #6EE7B7; }

.scene-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.25rem 0.62rem;
  font-size: clamp(2.05rem, 4.8vw, 4.1rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.04;
  will-change: transform;
}

.t-ice { color: #F5F5F7; }
.t-gold { color: #E2B878; }
.t-emerald { color: #34D399; }

.notion-pills { display: inline-flex; align-items: center; gap: 0.35rem; margin-left: 0.12rem; }
.n-pill {
  font-family: var(--font-mono);
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.24rem 0.56rem;
  border-radius: 999px;
  background: rgba(245, 245, 247, 0.08);
  border: 1px solid rgba(245, 245, 247, 0.22);
  color: #F5F5F7;
  line-height: 1;
}
.n-pill.is-gold { background: rgba(226, 184, 120, 0.14); border-color: rgba(226, 184, 120, 0.45); color: #E2B878; }

.glass-card {
  background: #0F1117;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 22px 48px -20px rgba(0, 0, 0, 0.85);
}

/* SHARED TACTILE BUTTON PHYSICS */
.is-target { position: relative; }
.is-target .btn-txt { display: inline-block; transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1); }
.is-target.is-hover .btn-txt { transform: translate3d(0, -1px, 0); }
.is-target.is-pressed { transform: scale(0.95) !important; }

.btn-ripple {
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 2px solid #E2B878;
  animation: rippleOut 0.62s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  pointer-events: none;
}
.btn-ripple.is-blue { border-color: #3B82F6; }
.btn-ripple.is-emerald { border-color: #34D399; }

@keyframes rippleOut {
  0% { transform: scale(0.85); opacity: 0.95; }
  100% { transform: scale(1.7); opacity: 0; }
}

/* SCENE 01: FRAMER WIREFRAME -> LIVE UI + FIGMA */
.figma-canvas {
  position: relative;
  z-index: 2;
  width: min(760px, calc(100vw - 2.5rem));
  border-radius: 18px;
  background: #0F1117;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 28px 64px -22px rgba(0, 0, 0, 0.9);
  overflow: hidden;
  text-align: left;
}

.fc-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.55rem 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.fc-left { display: flex; align-items: center; gap: 0.5rem; }
.fc-dots { display: inline-flex; gap: 4px; }
.fc-dots i { width: 7px; height: 7px; border-radius: 50%; background: rgba(255, 255, 255, 0.22); }
.fc-name { font-family: var(--font-mono); font-size: 0.68rem; color: #9CA3AF; }
.fc-actions { display: inline-flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; }

.pill-btn {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.71rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: transform 140ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}

.pill-btn.is-blue-toggle { border: 1px solid rgba(59, 130, 246, 0.55); background: rgba(59, 130, 246, 0.14); color: #93C5FD; }
.pill-btn.is-blue-toggle.is-hover,
.pill-btn.is-blue-toggle.is-active { background: #3B82F6; border-color: #3B82F6; color: #FFFFFF; box-shadow: 0 0 18px rgba(59, 130, 246, 0.45); }

.pill-btn.is-gold-action { border: 1px solid rgba(226, 184, 120, 0.55); background: rgba(226, 184, 120, 0.14); color: #E2B878; }
.pill-btn.is-gold-action.is-hover,
.pill-btn.is-gold-action.is-active { background: #E2B878; border-color: #E2B878; color: #050507; box-shadow: 0 0 22px rgba(226, 184, 120, 0.45); }

.fc-grid { display: grid; grid-template-columns: 1fr; gap: 0.68rem; padding: 0.95rem 0.9rem; align-items: center; }
@media (min-width: 720px) {
  .fc-grid { grid-template-columns: 145px 1fr 145px; padding: 1.15rem 1.1rem; }
}

.fc-side { display: flex; flex-direction: row; flex-wrap: wrap; gap: 0.36rem; padding: 0.42rem 0.58rem; border-radius: 10px; background: rgba(255, 255, 255, 0.025); border: 1px solid rgba(255, 255, 255, 0.07); }
@media (min-width: 720px) {
  .fc-side { flex-direction: column; padding: 0.6rem 0.7rem; border-radius: 12px; }
}

.fc-side-title { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700; color: #8B92A0; letter-spacing: 0.08em; }
.fc-layer { padding: 0.18rem 0.42rem; border-radius: 6px; font-size: 0.67rem; color: #9CA3AF; }
.fc-layer.is-on { background: rgba(226, 184, 120, 0.14); color: #F5F5F7; font-weight: 600; }
.fc-tok { display: flex; align-items: center; gap: 0.38rem; font-family: var(--font-mono); font-size: 0.67rem; color: #D1D5DB; }
.fc-tok i { width: 9px; height: 9px; border-radius: 2px; border: 1px solid rgba(255, 255, 255, 0.25); }

.fc-center { display: flex; justify-content: center; padding: 0.4rem 0.4rem 0.15rem; }

.wireframe-box {
  position: relative;
  width: 100%;
  max-width: 390px;
  padding: 0.85rem 0.95rem;
  border: 1px solid #3B82F6;
  background: rgba(59, 130, 246, 0.05);
  transition: border-color 280ms ease, background-color 280ms ease;
}
.wireframe-box.is-live {
  border-color: #E2B878;
  background: rgba(226, 184, 120, 0.04);
}

.wf-handle { position: absolute; width: 8px; height: 8px; background: #F5F5F7; border: 1.5px solid #3B82F6; transition: border-color 280ms ease; }
.wireframe-box.is-live .wf-handle,
.case-study-card.is-wireframe-morph .wf-handle { border-color: #3B82F6; }
.wf-handle.tl { top: -5px; left: -5px; }
.wf-handle.tr { top: -5px; right: -5px; }
.wf-handle.bl { bottom: -5px; left: -5px; }
.wf-handle.br { bottom: -5px; right: -5px; }

.wf-badge {
  position: absolute;
  top: -19px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  font-weight: 700;
  padding: 0.06rem 0.36rem;
  border-radius: 4px;
  background: #3B82F6;
  color: #FFFFFF;
  white-space: nowrap;
  transition: background-color 280ms ease, color 280ms ease;
}
.wireframe-box.is-live .wf-badge { background: #E2B878; color: #050507; }

.wf-card {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  padding: 0.68rem 0.82rem;
  border-radius: 12px;
  border: 1px dashed rgba(59, 130, 246, 0.55);
  background: rgba(59, 130, 246, 0.06);
  transition: all 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
.wf-card.is-live {
  border-style: solid;
  border-color: rgba(226, 184, 120, 0.55);
  background: #050507;
  box-shadow: 0 12px 28px -12px rgba(226, 184, 120, 0.28);
}

.wfc-top { display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; }
.wfc-tag { font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700; color: #93C5FD; }
.wf-card.is-live .wfc-tag { color: #9CA3AF; }
.wfc-chip {
  font-family: var(--font-mono);
  font-size: 0.61rem;
  font-weight: 700;
  padding: 0.1rem 0.42rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.16);
  color: #93C5FD;
  white-space: nowrap;
  flex-shrink: 0;
}
.wf-card.is-live .wfc-chip { background: rgba(52, 211, 153, 0.16); color: #6EE7B7; }
.wfc-title { font-size: 0.88rem; font-weight: 700; color: #E5E7EB; }
.wf-card.is-live .wfc-title { color: #F5F5F7; }
.wfc-track { width: 100%; height: 5px; border-radius: 999px; background: rgba(255, 255, 255, 0.08); overflow: hidden; }
.wfc-fill { width: 45%; height: 100%; background: #3B82F6; transition: width 320ms cubic-bezier(0.16, 1, 0.3, 1); }
.wf-card.is-live .wfc-fill { width: 100%; background: linear-gradient(90deg, #E2B878, #34D399); }

/* SCENE 02: USER RESEARCH */
.telemetry-header-pill {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.35rem 0.55rem;
  max-width: calc(100vw - 2.5rem);
  padding: 0.28rem 0.48rem 0.28rem 0.78rem;
  background: #0F1117;
  border: 1px solid rgba(52, 211, 153, 0.38);
  box-shadow: 0 12px 32px -16px rgba(52, 211, 153, 0.35);
  overflow: hidden;
}
.thp-text { font-family: var(--font-mono); font-size: 0.67rem; color: #D1D5DB; }
.thp-badge { font-family: var(--font-mono); font-size: 0.66rem; font-weight: 700; padding: 0.18rem 0.55rem; border-radius: 999px; background: rgba(52, 211, 153, 0.16); color: #6EE7B7; border: 1px solid rgba(52, 211, 153, 0.4); white-space: nowrap; }

.bento-grid-3 { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.72rem; width: min(860px, calc(100vw - 2.5rem)); position: relative; z-index: 2; }
@media (min-width: 768px) {
  .bento-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.bento-item { min-width: 0; padding: 0.88rem 0.96rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.46rem; text-align: left; }
.bi-head { display: flex; align-items: center; justify-content: space-between; gap: 0.35rem; }
.bi-tag { font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700; letter-spacing: 0.07em; color: #9CA3AF; }
.bi-ok, .bi-status.clean { font-family: var(--font-mono); font-size: 0.64rem; font-weight: 700; color: #6EE7B7; }
.bi-status { font-family: var(--font-mono); font-size: 0.64rem; font-weight: 600; color: #9CA3AF; }
.bi-sus { font-family: var(--font-mono); font-size: 0.67rem; font-weight: 700; color: #E2B878; }
.bi-metric-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.bi-num { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
.bi-num.is-emerald { color: #34D399; }
.bi-num.is-ice { color: #F5F5F7; }
.bi-spark { width: 92px; height: 30px; }
.bi-sub { font-size: 0.73rem; color: #9CA3AF; }
.bi-bench { font-family: var(--font-mono); font-size: 0.64rem; font-weight: 700; padding: 0.16rem 0.46rem; border-radius: 999px; background: rgba(226, 184, 120, 0.14); color: #E2B878; border: 1px solid rgba(226, 184, 120, 0.32); }
.sus-track { width: 100%; height: 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.08); overflow: hidden; }
.sus-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #E2B878, #34D399); }

.tangled-row { display: flex; align-items: center; justify-content: flex-start; gap: 0.24rem; flex-wrap: wrap; }
.clean-journey-row { display: flex; align-items: center; justify-content: space-between; gap: 0.22rem; flex-wrap: nowrap; }
.t-step { padding: 0.16rem 0.32rem; border-radius: 6px; background: rgba(255, 255, 255, 0.04); border: 1px dashed rgba(255, 255, 255, 0.18); font-size: 0.6rem; color: #9CA3AF; white-space: nowrap; }

.j-node {
  display: inline-flex;
  align-items: center;
  gap: 0.24rem;
  padding: 0.2rem 0.46rem;
  border-radius: 999px;
  background: #08090D;
  border: 1px solid rgba(245, 245, 247, 0.28);
  font-size: 0.64rem;
  font-weight: 600;
  color: #F5F5F7;
  white-space: nowrap;
  flex-shrink: 0;
}
.j-node.is-gold { border-color: rgba(226, 184, 120, 0.6); }
.j-node.is-emerald { border-color: rgba(52, 211, 153, 0.6); color: #D1FAE5; }
.is-simplify-btn { font-family: inherit; transition: transform 140ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 200ms ease, color 200ms ease; }
.is-simplify-btn.is-hover,
.is-simplify-btn.is-active { background: #34D399; border-color: #34D399; color: #050507; box-shadow: 0 0 18px rgba(52, 211, 153, 0.45); }
.is-simplify-btn.is-hover .j-dot,
.is-simplify-btn.is-active .j-dot { background: #050507; }

.j-line { flex: 1; min-width: 8px; height: 2px; background: linear-gradient(90deg, #E2B878, #34D399); }
.j-dot { width: 6px; height: 6px; border-radius: 50%; }
.j-dot.ice { background: #F5F5F7; }
.j-dot.gold { background: #E2B878; }
.j-dot.emerald { background: #34D399; }

.ribbon-overlay { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 22; }

/* SCENE 03: CREATIVE AI COMMAND COMPOSER */
.command-composer {
  position: relative;
  z-index: 2;
  width: min(720px, calc(100vw - 2.5rem));
  padding: 0.9rem 1.05rem;
  border-radius: 20px;
  background: #0F1117;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 26px 60px -22px rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  gap: 0.68rem;
  text-align: left;
  transition: box-shadow 220ms ease, border-color 220ms ease;
}
.command-composer.is-focus { border-color: #E2B878; box-shadow: 0 0 0 2px #E2B878, 0 20px 52px rgba(226, 184, 120, 0.22); }

.cc-header, .cc-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; }
.cc-model { display: inline-flex; align-items: center; gap: 0.42rem; padding: 0.24rem 0.7rem; border-radius: 999px; background: rgba(226, 184, 120, 0.13); border: 1px solid rgba(226, 184, 120, 0.42); color: #E2B878; font-size: 0.73rem; font-weight: 600; }
.cc-dot { width: 7px; height: 7px; border-radius: 50%; background: #E2B878; }
.cc-tokens { padding: 0.2rem 0.58rem; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.1); font-family: var(--font-mono); font-size: 0.67rem; color: #9CA3AF; }
.cc-tokens.lit { color: #6EE7B7; border-color: rgba(52, 211, 153, 0.35); }

.cc-input { min-height: 2.9rem; font-size: clamp(0.9rem, 1.3vw, 1.04rem); line-height: 1.5; color: #F5F5F7; }
.cc-caret { display: inline-block; width: 2px; height: 1.1em; vertical-align: -0.18em; margin-left: 2px; background: #E2B878; opacity: 0; }
.cc-caret.on { opacity: 1; animation: caretBlink 0.85s steps(1) infinite; }
@keyframes caretBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

.cc-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.cc-chip { padding: 0.2rem 0.52rem; border-radius: 8px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.67rem; color: #9CA3AF; }

.cc-submit {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.38rem 0.88rem;
  border-radius: 999px;
  border: 1px solid rgba(226, 184, 120, 0.3);
  background: rgba(226, 184, 120, 0.14);
  color: #E2B878;
  font-family: inherit;
  font-size: 0.77rem;
  font-weight: 700;
  transition: transform 140ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 200ms ease, color 200ms ease;
}
.cc-submit.ready, .cc-submit.is-hover { background: #E2B878; border-color: #E2B878; color: #050507; box-shadow: 0 0 22px rgba(226, 184, 120, 0.45); }

/* SCENE 04: MOTION & FRONT-END */
.pill-navbar { position: relative; z-index: 2; display: inline-grid; grid-template-columns: repeat(3, 1fr); padding: 0.24rem; border-radius: 999px; background: #0F1117; border: 1px solid rgba(255, 255, 255, 0.12); width: min(330px, calc(100vw - 2.5rem)); }
.pn-thumb { position: absolute; top: 0.24rem; left: 0.24rem; bottom: 0.24rem; width: calc((100% - 0.48rem) / 3); border-radius: 999px; background: rgba(226, 184, 120, 0.18); border: 1px solid rgba(226, 184, 120, 0.5); transition: transform 420ms cubic-bezier(0.34, 1.4, 0.64, 1); }
.pn-item { position: relative; z-index: 1; padding: 0.32rem 0.4rem; font-size: 0.72rem; font-weight: 600; color: #9CA3AF; text-align: center; }
.pn-item.active { color: #F5F5F7; }

.fe-row { position: relative; z-index: 2; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.8rem; width: fit-content; max-width: 100%; margin: 0 auto; }
.volt-logger, .case-study-card { position: relative; width: min(345px, calc(100vw - 2.5rem)); padding: 0.9rem 1.05rem; text-align: left; display: flex; flex-direction: column; gap: 0.42rem; transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1), border-color 260ms ease, box-shadow 260ms ease; }
.volt-logger.done { border-color: rgba(52, 211, 153, 0.65); box-shadow: 0 24px 52px -18px rgba(52, 211, 153, 0.28); }

.vl-top, .cs-top { display: flex; justify-content: space-between; align-items: center; gap: 0.4rem; }
.vl-brand, .cs-tag { font-family: var(--font-mono); font-size: 0.63rem; font-weight: 700; color: #E2B878; letter-spacing: 0.05em; }
.vl-status { font-size: 0.68rem; font-weight: 700; padding: 0.14rem 0.52rem; border-radius: 999px; background: rgba(255, 255, 255, 0.07); color: #D1D5DB; white-space: nowrap; flex-shrink: 0; }
.vl-status.done { background: rgba(52, 211, 153, 0.2); border: 1px solid rgba(52, 211, 153, 0.45); color: #6EE7B7; }
.vl-ex, .cs-title { font-size: 0.95rem; font-weight: 700; color: #F5F5F7; }
.vl-mid { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; }
.vl-nums { display: flex; flex-direction: column; }
.vl-val { font-size: 1.15rem; font-weight: 800; color: #E2B878; }
.vl-sub { font-size: 0.7rem; color: #9CA3AF; }

.vl-btn { padding: 0.38rem 0.72rem; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.06); color: #E5E7EB; font-family: inherit; font-size: 0.72rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; transition: transform 140ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 200ms ease, color 200ms ease; }
.vl-btn.is-hover { border-color: #34D399; color: #F5F5F7; }
.vl-btn.done { background: #34D399; border-color: #34D399; color: #050507; box-shadow: 0 0 18px rgba(52, 211, 153, 0.45); }
.vl-bar { width: 100%; height: 5px; border-radius: 999px; background: rgba(255, 255, 255, 0.08); overflow: hidden; }
.vl-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #E2B878, #34D399); transition: width 360ms cubic-bezier(0.16, 1, 0.3, 1); }

.case-study-card.hover { transform: translate3d(0, -4px, 0); border-color: rgba(226, 184, 120, 0.68); box-shadow: 0 28px 58px -18px rgba(226, 184, 120, 0.3); }
.case-study-card.is-wireframe-morph { border: 1px solid #3B82F6 !important; background: rgba(59, 130, 246, 0.05) !important; box-shadow: 0 0 36px -8px rgba(59, 130, 246, 0.45) !important; z-index: 16; }
.cs-pill { font-family: var(--font-mono); font-size: 0.64rem; padding: 0.14rem 0.5rem; border-radius: 999px; background: rgba(226, 184, 120, 0.14); color: #E2B878; white-space: nowrap; }
.cs-specs { font-family: var(--font-mono); font-size: 0.7rem; color: #6EE7B7; }
.cs-btn { align-self: flex-start; margin-top: 0.14rem; padding: 0.34rem 0.72rem; border-radius: 999px; border: 1px solid rgba(226, 184, 120, 0.45); background: rgba(226, 184, 120, 0.12); color: #E2B878; font-family: inherit; font-size: 0.74rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem; transition: transform 140ms cubic-bezier(0.34, 1.4, 0.64, 1), background-color 200ms ease, color 200ms ease; }
.cs-btn.is-hover { background: #E2B878; border-color: #E2B878; color: #050507; }

/* GLOBAL PIXEL-ACCURATE VECTOR CURSOR */
.stage-cursor {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  z-index: 40;
  pointer-events: none;
  transform-origin: 2px 2px;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.65));
  will-change: transform;
}
.cur-svg { position: absolute; inset: 0; transition: opacity 120ms ease; }
.cur-svg.hide { opacity: 0; }
.cur-ibeam { opacity: 0; }
.cur-ibeam.show { opacity: 1; }

/* LOWER-LEFT SAFE ZONE */
.safe-footer { position: relative; z-index: 3; width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 1.25rem; display: flex; align-items: flex-end; justify-content: flex-start; }
@media (min-width: 768px) { .safe-footer { padding: 0 2.5rem; } }
.identity-block { display: flex; flex-direction: column; align-items: flex-start; gap: 0.6rem; }
.id-line { display: flex; flex-direction: column; align-items: flex-start; gap: 0.1rem; font-size: 0.9rem; }
.id-name { font-weight: 700; color: #F5F5F7; }
.id-sep { display: none; color: #6B7280; }
@media (min-width: 520px) { .id-line { flex-direction: row; align-items: center; gap: 0.45rem; } .id-sep { display: inline; } }
.id-role { color: #A1A7B3; }
.id-ctas { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.cta-gold { background-color: #E2B878 !important; color: #050507 !important; border-color: #E2B878 !important; padding: 0.56rem 1.05rem !important; font-size: 0.84rem !important; }
.cta-glass { background-color: #121318 !important; border-color: rgba(255, 255, 255, 0.14) !important; padding: 0.56rem 1.05rem !important; font-size: 0.84rem !important; }

@media (prefers-reduced-motion: reduce) {
  .aurora-bloom, .depth-bokeh, .cc-caret.on, .btn-ripple { animation: none !important; }
}
</style>
