<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

// 18.0s Unified App-Presentation Cause-and-Effect Hero Showreel (4.50s per Act)
// Physics & Motion Rules:
// 1. Continuous Camera Null-Chaining (100% -> 105% Micro-Scale Match Cut, velocity never stops at 0)
// 2. Surgical Shape Morphing (width, height, borderRadius — ZERO scaleX/scaleY distortion)
// 3. "Text Before UI" Eye-Tracing Hierarchy (headline mask reveals 180ms before UI snaps)
// 4. Pixel-Accurate getBoundingClientRect() Cursor + Macro UI Zoom (165% / 170%)
// 5. 100% Free Native Stack, Zero 3D Tilts, Zero Gemini/Google Symbols, Zero Clutter

const LOOP_SEC = 18.0
const LOOP_MS = LOOP_SEC * 1000

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)

let rafId = null
let lastTs = null

// DOM Refs for pixel-accurate getBoundingClientRect() cursor targeting
const viewportRef = ref(null)
const p1BtnRef = ref(null)
const p2BtnRef = ref(null) // `Simplify` node inside 3-node journey
const p3FieldRef = ref(null)
const p3BtnRef = ref(null)
const p4CheckRef = ref(null)
const p4CaseBtnRef = ref(null)

// Measured target centers relative to viewportRef top-left (in px)
const targets = reactive({
  vpW: 1440,
  vpH: 760,
  p1Btn: { x: 880, y: 270 },
  p2Btn: { x: 1020, y: 425 },
  p3Field: { x: 640, y: 390 },
  p3Btn: { x: 910, y: 455 },
  p4Check: { x: 645, y: 445 },
  p4CaseBtn: { x: 860, y: 495 },
})

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))
// Apple / Linear cubic-bezier(0.22, 1, 0.36, 1)-inspired smooth decel
const easeOutQuint = (x) => {
  const c = clamp(x)
  return 1 - Math.pow(1 - c, 5)
}
const easeOutExpo = (x) => (x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * clamp(x)))
const easeInOutQuart = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 8 * c * c * c * c : 1 - Math.pow(-2 * c + 2, 4) / 2
}
// Subtle spring overshoot (stiffness ~380, damping ~24)
const easeSpring = (x) => {
  const c = clamp(x)
  if (c === 0 || c === 1) return c
  return 1 + Math.pow(2, -9 * c) * Math.sin((c * 10 - 0.75) * ((2 * Math.PI) / 3)) * 0.28
}

const sec = computed(() => (elapsedMs.value % LOOP_MS) / 1000)

// Continuous ambient micro-drift so peripheral elements breathe smoothly
const driftY = (seed = 0, amp = 5) => Math.sin(sec.value * 2.1 + seed) * amp
const driftX = (seed = 0, amp = 4) => Math.cos(sec.value * 1.7 + seed) * amp

// =========================================================
// PIXEL-ACCURATE getBoundingClientRect() MEASUREMENT ENGINE
// =========================================================
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
  const vp = viewportRef.value
  if (!vp) return
  const vpRect = vp.getBoundingClientRect()
  if (!vpRect.width) return
  targets.vpW = vpRect.width
  targets.vpH = vpRect.height
  const s = sec.value
  // Measure only while each act is settled at scale(1)
  if (s >= 0.48 && s <= 3.05) {
    targets.p1Btn = centerOf(p1BtnRef.value, vpRect, targets.p1Btn)
  }
  if (s >= 4.75 && s <= 7.45) {
    targets.p2Btn = centerOf(p2BtnRef.value, vpRect, targets.p2Btn)
  }
  if (s >= 9.2 && s <= 12.25) {
    targets.p3Field = centerOf(p3FieldRef.value, vpRect, targets.p3Field)
    targets.p3Btn = centerOf(p3BtnRef.value, vpRect, targets.p3Btn)
  }
  if (s >= 13.7 && s <= 16.85) {
    targets.p4Check = centerOf(p4CheckRef.value, vpRect, targets.p4Check)
    targets.p4CaseBtn = centerOf(p4CaseBtnRef.value, vpRect, targets.p4CaseBtn)
  }
}

const bez = (p0, p1, p2, k) => ({
  x: (1 - k) * (1 - k) * p0.x + 2 * (1 - k) * k * p1.x + k * k * p2.x,
  y: (1 - k) * (1 - k) * p0.y + 2 * (1 - k) * k * p1.y + k * k * p2.y,
})

// =========================================================
// ACT 01 (0.00s – 4.50s) — UX/UI DESIGN
// Text-Before-UI: Headline slides up 180ms before Figma frame
// Click Trigger at 2.85s on `Validate Flow →`
// Transition 1 (3.08s – 4.50s): Macro UI Zoom (165%) into button while rounded pill
//   morphs (width/height/borderRadius) directly into User Research telemetry header.
// =========================================================
const p1Origin = computed(() => `${targets.p1Btn.x.toFixed(0)}px ${targets.p1Btn.y.toFixed(0)}px`)

const p1TextY = computed(() => {
  const s = sec.value
  const k = easeOutQuint(clamp(s / 0.36))
  return `${((1 - k) * 108).toFixed(1)}%`
})

const p1UiReveal = computed(() => {
  const s = sec.value
  // Enters 180ms after text mask begins
  const k = easeOutQuint(clamp((s - 0.18) / 0.38))
  return {
    transform: `translate3d(0, ${((1 - k) * 18).toFixed(1)}px, 0)`,
    opacity: k.toFixed(2),
  }
})

const p1State = computed(() => {
  const s = sec.value
  if (s >= 3.92) {
    return {
      visible: false,
      transform: 'none',
      clipPath: 'inset(0% 0% 0% 0%)',
      periLeft: 'none',
      periRight: 'none',
    }
  }
  if (s < 0.45) {
    // Null-chaining settle from Act 04's card-to-Figma-frame morph (1.05 -> 1.00)
    const k = easeOutQuint(s / 0.45)
    const sc = (1.05 - k * 0.05).toFixed(3)
    const vIn = ((1 - k) * 10).toFixed(2)
    const hIn = ((1 - k) * 12).toFixed(2)
    const rad = ((1 - k) * 14).toFixed(1)
    return {
      visible: true,
      transform: `scale(${sc})`,
      clipPath: `inset(${vIn}% ${hIn}% ${vIn}% ${hIn}% round ${rad}px)`,
      periLeft: `translate3d(${((1 - k) * -36).toFixed(1)}px, 0, 0)`,
      periRight: `translate3d(${((1 - k) * 36).toFixed(1)}px, 0, 0)`,
    }
  }
  if (s > 3.08) {
    // Macro UI Zoom (100% -> 165%) locked onto `Validate Flow →`
    const k = easeInOutQuart((s - 3.08) / 0.84)
    const zoom = (1 + k * 0.65).toFixed(3)
    const iris = s > 3.45 ? ((s - 3.45) / 0.47) * 44 : 0
    return {
      visible: true,
      transform: `scale(${zoom})`,
      clipPath:
        iris > 0
          ? `inset(${iris.toFixed(2)}% ${iris.toFixed(2)}% ${iris.toFixed(2)}% ${iris.toFixed(2)}% round 28px)`
          : 'inset(0% 0% 0% 0%)',
      periLeft: `translate3d(${(-k * 145).toFixed(1)}%, 0, 0)`,
      periRight: `translate3d(${(k * 145).toFixed(1)}%, 0, 0)`,
    }
  }
  return {
    visible: true,
    transform: 'scale(1)',
    clipPath: 'inset(0% 0% 0% 0%)',
    periLeft: 'translate3d(0, 0, 0)',
    periRight: 'translate3d(0, 0, 0)',
  }
})

const p1Hover = computed(() => sec.value >= 2.15 && sec.value < 3.3)
const p1Pressed = computed(() => sec.value >= 2.85 && sec.value < 3.08)
const p1Validated = computed(() => sec.value >= 2.95)
const p1Ripple = computed(() => sec.value >= 2.9 && sec.value < 3.55)

// Luminous SVG Portal Curve + Surgical Pill Morph bridge (3.38s – 4.35s)
const tr1Curve = computed(() => {
  const s = sec.value
  if (s < 3.38 || s > 4.35) return { active: false, dashOffset: 1200, opacity: '0' }
  const k = easeInOutQuart((s - 3.38) / 0.65)
  const dashOffset = Math.round((1 - k) * 1200)
  const fadeOut = s > 4.02 ? 1 - clamp((s - 4.02) / 0.33) : 1
  return { active: true, dashOffset, opacity: fadeOut.toFixed(2) }
})

// =========================================================
// ACT 02 (4.50s – 9.00s) — USER RESEARCH
// Text-Before-UI: `USER RESEARCH` reveals 180ms before 3 Bento cards (2-frame stagger)
// Telemetry Header shape-morphs (width/height/borderRadius) from Act 01 pill
// Click Trigger at 7.30s on `Simplify` (`p2BtnRef`)
// Transition 2 (7.52s – 9.00s): 3 journey nodes magnetically converge along an arc
//   and shape-morph (width/height/borderRadius) into the AI Command Composer.
// =========================================================
const p2TextY = computed(() => {
  const s = sec.value
  const k = easeOutQuint(clamp((s - 3.92) / 0.38))
  return `${((1 - k) * 108).toFixed(1)}%`
})

const p2BarMorph = computed(() => {
  const s = sec.value
  // Morphs width/height/borderRadius from pill (170px x 36px) -> full telemetry header
  const k = easeSpring(clamp((s - 3.92) / 0.62))
  const w = Math.round(170 + k * 250)
  const rad = Math.round(999 - k * 965)
  return {
    maxWidth: `${w}px`,
    borderRadius: `${Math.max(34, rad)}px`,
  }
})

// 2-frame (~34ms) stagger for the 3 Bento cards after headline
const p2BentoStyle = (idx) => {
  const s = sec.value
  const start = 4.1 + idx * 0.035
  const k = easeOutQuint(clamp((s - start) / 0.36))
  return {
    transform: `translate3d(0, ${((1 - k) * 20).toFixed(1)}px, 0)`,
    opacity: k.toFixed(2),
  }
}

const p2State = computed(() => {
  const s = sec.value
  if (s < 3.92 || s >= 8.48) {
    return {
      visible: false,
      transform: 'none',
      clipPath: 'inset(0% 0% 0% 0%)',
      periLeft: 'none',
      periRight: 'none',
      convergeK: 0,
    }
  }
  if (s < 4.55) {
    // Micro-scale match cut settle (1.05 -> 1.00)
    const k = easeOutQuint((s - 3.92) / 0.63)
    const sc = (1.05 - k * 0.05).toFixed(3)
    const vIn = ((1 - k) * 10).toFixed(2)
    const hIn = ((1 - k) * 14).toFixed(2)
    const rad = ((1 - k) * 22).toFixed(1)
    return {
      visible: true,
      transform: `scale(${sc})`,
      clipPath: `inset(${vIn}% ${hIn}% ${vIn}% ${hIn}% round ${rad}px)`,
      periLeft: 'translate3d(0, 0, 0)',
      periRight: 'translate3d(0, 0, 0)',
      convergeK: 0,
    }
  }
  if (s > 7.52) {
    // Null-chained micro-scale (1.00 -> 1.05) + nodes magnetically arc inward
    const k = easeInOutQuart((s - 7.52) / 0.96)
    const sc = (1 + k * 0.05).toFixed(3)
    const wipeLeft = Math.min(100, k * 116).toFixed(2)
    return {
      visible: true,
      transform: `scale(${sc})`,
      clipPath: `inset(0% 0% 0% ${wipeLeft}%)`,
      periLeft: `translate3d(${(-k * 135).toFixed(1)}%, 0, 0)`,
      periRight: `translate3d(${(k * 135).toFixed(1)}%, 0, 0)`,
      convergeK: k,
    }
  }
  return {
    visible: true,
    transform: 'scale(1)',
    clipPath: 'inset(0% 0% 0% 0%)',
    periLeft: 'translate3d(0, 0, 0)',
    periRight: 'translate3d(0, 0, 0)',
    convergeK: 0,
  }
})

// Magnetic arc offsets for the 3 nodes (Discover -> center, Validate -> center, Simplify -> center)
const p2NodeArc = (dir) => {
  const k = p2State.value.convergeK
  if (k <= 0) return 'translate3d(0, 0, 0)'
  const arcY = -Math.sin(k * Math.PI) * 24
  const dx = dir * k * 56
  return `translate3d(${dx.toFixed(1)}px, ${arcY.toFixed(1)}px, 0)`
}

const rl = computed(() => Math.max(0, sec.value - 3.92))
const mFriction = computed(() => Math.round(easeOutExpo((rl.value - 0.18) / 0.85) * 42))
const mTask = computed(() => (easeOutExpo((rl.value - 0.22) / 0.9) * 98.4).toFixed(1))
const mSus = computed(() => Math.round(easeOutExpo((rl.value - 0.26) / 0.95) * 91))
const p2Hover = computed(() => sec.value >= 6.55 && sec.value < 7.75)
const p2Pressed = computed(() => sec.value >= 7.3 && sec.value < 7.52)
const p2Triggered = computed(() => sec.value >= 7.38)
const p2Ripple = computed(() => sec.value >= 7.35 && sec.value < 8.0)

// Fluid Horizontal SVG Energy Ribbon sweeping across center stage (7.58s – 8.62s)
const tr2Ribbon = computed(() => {
  const s = sec.value
  if (s < 7.58 || s > 8.62) return { active: false, dashOffset: 1400, opacity: '0' }
  const k = easeInOutQuart((s - 7.58) / 0.68)
  const dashOffset = Math.round((1 - k) * 1400)
  const fadeOut = s > 8.34 ? 1 - clamp((s - 8.34) / 0.28) : 1
  return { active: true, dashOffset, opacity: fadeOut.toFixed(2) }
})

// =========================================================
// ACT 03 (9.00s – 13.50s) — CREATIVE AI
// Text-Before-UI: `CREATIVE AI` reveals 180ms before Prompt Composer
// Surgical Shape Morph: Prompt Composer morphs width (220px -> 720px), height (46px -> auto),
//   and borderRadius (999px -> 20px) — ZERO scaleX/scaleY distortion!
// Click Trigger at 12.15s on `↑ Generate`
// Transition 3 (12.38s – 13.50s): Macro Camera Zoom-In (170%) + horizontal aperture wipe
// =========================================================
const FULL_PROMPT =
  'Architect a low-friction workout logger with WCAG AA contrast, 8pt spatial rhythm, and 60fps micro-interactions.'

const p3Origin = computed(() => `${targets.p3Btn.x.toFixed(0)}px ${targets.p3Btn.y.toFixed(0)}px`)

const p3TextY = computed(() => {
  const s = sec.value
  const k = easeOutQuint(clamp((s - 8.48) / 0.36))
  return `${((1 - k) * 108).toFixed(1)}%`
})

const p3PromptMorph = computed(() => {
  const s = sec.value
  if (s < 8.64 || s >= 9.22) {
    return {}
  }
  // Surgical width + borderRadius spring morph from converged node pill (220px, 999px) -> 720px, 20px
  const k = easeSpring((s - 8.64) / 0.58)
  const maxW = Math.round(220 + k * 500)
  const rad = Math.round(999 - k * 979)
  return {
    maxWidth: `${maxW}px`,
    borderRadius: `${Math.max(20, rad)}px`,
  }
})

const p3State = computed(() => {
  const s = sec.value
  if (s < 8.48 || s >= 13.1) {
    return {
      visible: false,
      transform: 'none',
      clipPath: 'inset(0% 0% 0% 0%)',
      pulseBorder: false,
      apertureTop: 'none',
      apertureBot: 'none',
    }
  }
  if (s < 9.05) {
    // Micro-scale match cut settle (1.05 -> 1.00)
    const k = easeOutQuint((s - 8.48) / 0.57)
    const sc = (1.05 - k * 0.05).toFixed(3)
    return {
      visible: true,
      transform: `scale(${sc})`,
      clipPath: 'inset(0% 0% 0% 0%)',
      pulseBorder: true,
      apertureTop: 'translate3d(0, 0, 0)',
      apertureBot: 'translate3d(0, 0, 0)',
    }
  }
  if (s > 12.38) {
    // Macro Camera Zoom-In (100% -> 170%) + horizontal aperture split
    const k = easeInOutQuart((s - 12.38) / 0.72)
    const zoom = (1 + k * 0.7).toFixed(3)
    const splitY = (k * 180).toFixed(1)
    return {
      visible: true,
      transform: `scale(${zoom})`,
      clipPath: 'inset(0% 0% 0% 0%)',
      pulseBorder: false,
      apertureTop: `translate3d(0, -${splitY}px, 0)`,
      apertureBot: `translate3d(0, ${splitY}px, 0)`,
    }
  }
  return {
    visible: true,
    transform: 'scale(1)',
    clipPath: 'inset(0% 0% 0% 0%)',
    pulseBorder: s < 9.35,
    apertureTop: 'translate3d(0, 0, 0)',
    apertureBot: 'translate3d(0, 0, 0)',
  }
})

const p3Focused = computed(() => sec.value >= 9.2 && sec.value < 12.38)
const typedText = computed(() => {
  const p = clamp((sec.value - 9.32) / 2.1)
  const count = Math.floor(p * FULL_PROMPT.length)
  return FULL_PROMPT.slice(0, count)
})
const tokenCount = computed(() => Math.round(typedText.value.length * 1.4))
const p3SubmitReady = computed(() => typedText.value.length >= FULL_PROMPT.length - 1)
const p3Hover = computed(() => sec.value >= 11.82 && sec.value < 12.6)
const p3Pressed = computed(() => sec.value >= 12.15 && sec.value < 12.38)
const p3Ripple = computed(() => sec.value >= 12.2 && sec.value < 12.95)

// =========================================================
// ACT 04 (13.50s – 18.00s) — MOTION & FRONT-END
// Text-Before-UI: `MOTION & FRONT-END` enters 180ms before Voltrep & Case Study cards
// Click Trigger 1 at 14.55s: Voltrep `Log Set ✓` -> emerald `Set Logged ✓`
// Click Trigger 2 at 16.75s: `Inspect System ↗` -> Card border morphs (width/height/borderRadius)
//   into Figma Selection Frame with corner handles, looping seamlessly to 0.00s.
// =========================================================
const p4TextY = computed(() => {
  const s = sec.value
  const k = easeOutQuint(clamp((s - 13.1) / 0.36))
  return `${((1 - k) * 108).toFixed(1)}%`
})

const p4State = computed(() => {
  const s = sec.value
  if (s < 13.1) {
    return {
      visible: false,
      transform: 'none',
      clipPath: 'inset(0% 0% 0% 0%)',
      morphK: 0,
      otherSlideLeft: 'none',
    }
  }
  if (s < 13.58) {
    // Revealed through horizontal aperture as camera settles 1.05 -> 1.00
    const k = easeOutQuint((s - 13.1) / 0.48)
    const sc = (1.05 - k * 0.05).toFixed(3)
    const vAp = ((1 - k) * 44).toFixed(2)
    const rad = ((1 - k) * 20).toFixed(1)
    return {
      visible: true,
      transform: `scale(${sc})`,
      clipPath: `inset(${vAp}% 0% ${vAp}% 0% round ${rad}px)`,
      morphK: 0,
      otherSlideLeft: 'translate3d(0, 0, 0)',
    }
  }
  if (s > 16.98) {
    // Card border morphs into Figma Selection Frame + micro-scale 1.00 -> 1.05 match cut
    const k = easeInOutQuart((s - 16.98) / 1.02)
    const vIn = (k * 10).toFixed(2)
    const hIn = (k * 12).toFixed(2)
    const rad = (k * 14).toFixed(1)
    const sc = (1 + k * 0.05).toFixed(3)
    return {
      visible: true,
      transform: `scale(${sc})`,
      clipPath: `inset(${vIn}% ${hIn}% ${vIn}% ${hIn}% round ${rad}px)`,
      morphK: k,
      otherSlideLeft: `translate3d(${(-k * 125).toFixed(1)}%, 0, 0)`,
    }
  }
  return {
    visible: true,
    transform: 'scale(1)',
    clipPath: 'inset(0% 0% 0% 0%)',
    morphK: 0,
    otherSlideLeft: 'translate3d(0, 0, 0)',
  }
})

const p4CheckHover = computed(() => sec.value >= 14.25 && sec.value < 15.2)
const p4CheckPressed = computed(() => sec.value >= 14.55 && sec.value < 14.78)
const p4VoltDone = computed(() => sec.value >= 14.65)
const p4CheckRipple = computed(() => sec.value >= 14.6 && sec.value < 15.2)
const p4NavIdx = computed(() => (sec.value < 15.3 ? 0 : 1))
const p4CaseHover = computed(() => sec.value >= 16.05 && sec.value < 17.2)
const p4CasePressed = computed(() => sec.value >= 16.75 && sec.value < 16.98)
const p4CaseRipple = computed(() => sec.value >= 16.8 && sec.value < 17.45)

// =========================================================
// UNIFIED STAGE CURSOR (Pixel-Accurate getBoundingClientRect() Targeting)
// =========================================================
const stageCursor = computed(() => {
  const s = sec.value
  const b1 = targets.p1Btn
  const b2 = targets.p2Btn
  const f3 = targets.p3Field
  const b3 = targets.p3Btn
  const c4 = targets.p4Check
  const k4 = targets.p4CaseBtn

  let pos = { x: b1.x, y: b1.y }
  let ibeam = false
  let pressed = false

  if (s < 3.92) {
    // Act 01: Approaches `Validate Flow →` and clicks at 2.85s
    const start = { x: b1.x - 150, y: b1.y + 85 }
    if (s < 2.1) {
      const k = easeInOutQuart(clamp((s - 0.5) / 1.6))
      pos = bez(start, { x: b1.x - 65, y: b1.y + 15 }, b1, k)
    } else {
      pos = { x: b1.x, y: b1.y }
    }
    pressed = p1Pressed.value
  } else if (s < 8.48) {
    // Act 02: Glides dead-center onto `Simplify` node and clicks at 7.30s
    if (s < 6.5) {
      const k = easeInOutQuart(clamp((s - 4.7) / 1.8))
      pos = bez(b1, { x: (b1.x + b2.x) / 2, y: Math.min(b1.y, b2.y) - 36 }, b2, k)
    } else {
      pos = { x: b2.x, y: b2.y }
    }
    pressed = p2Pressed.value
  } else if (s < 13.1) {
    // Act 03: Glides into prompt input (I-beam), types, then glides dead-center onto `↑ Generate`
    if (s < 9.25) {
      const k = easeInOutQuart(clamp((s - 8.6) / 0.65))
      pos = bez(b2, { x: f3.x - 40, y: f3.y - 30 }, f3, k)
    } else if (s < 11.45) {
      pos = { x: f3.x + Math.sin(s * 3) * 4, y: f3.y }
      ibeam = true
    } else if (s < 11.95) {
      const k = easeInOutQuart(clamp((s - 11.45) / 0.5))
      pos = bez(f3, { x: (f3.x + b3.x) / 2, y: f3.y - 24 }, b3, k)
    } else {
      pos = { x: b3.x, y: b3.y }
    }
    pressed = p3Pressed.value
  } else {
    // Act 04: Clicks Voltrep `Log Set ✓`, then glides dead-center onto `Inspect System ↗`
    if (s < 14.3) {
      const k = easeInOutQuart(clamp((s - 13.35) / 0.95))
      pos = bez(b3, { x: (b3.x + c4.x) / 2, y: c4.y - 40 }, c4, k)
    } else if (s < 15.2) {
      pos = { x: c4.x, y: c4.y }
    } else if (s < 16.05) {
      const k = easeInOutQuart(clamp((s - 15.2) / 0.85))
      pos = bez(c4, { x: (c4.x + k4.x) / 2, y: c4.y - 28 }, k4, k)
    } else {
      pos = { x: k4.x, y: k4.y }
    }
    pressed = p4CheckPressed.value || p4CasePressed.value
  }

  return {
    x: pos.x,
    y: pos.y,
    ibeam,
    scale: pressed ? 0.86 : 1,
  }
})

const ambientTheme = computed(() => {
  const s = sec.value
  if (s < 3.92) return 'ambient-design'
  if (s < 8.48) return 'ambient-research'
  if (s < 13.1) return 'ambient-ai'
  return 'ambient-frontend'
})

const onResize = () => {
  nextTick(measureTargets)
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
    elapsedMs.value = 1800
  } else {
    elapsedMs.value = 1200 // opens cleanly on Act 01: UX/UI DESIGN
  }
  nextTick(() => {
    measureTargets()
    window.setTimeout(measureTargets, 120)
    window.setTimeout(measureTargets, 350)
  })
  rafId = window.requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
  if (typeof window !== 'undefined') window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="film-hero" aria-label="UX/UI Design & Front-End App Presentation Showreel">
    <div class="film-stage" :class="ambientTheme">
      <!-- Ambient Obsidian & Champagne Light Blooms + Depth-Blurred Bokeh Orbs -->
      <div class="ambient-layer" aria-hidden="true">
        <div class="bloom bloom-1" />
        <div class="bloom bloom-2" />
        <div class="bokeh-orb bokeh-1" />
        <div class="bokeh-orb bokeh-2" />
        <div class="bokeh-orb bokeh-3" />
      </div>

      <div ref="viewportRef" class="camera-viewport">
        <!-- =========================================================
             ACT 01 (0.0s – 4.5s) — UX/UI DESIGN
             Text-Before-UI + Notion-style UI pills + `Validate Flow →`
             ========================================================= -->
        <div
          v-show="p1State.visible"
          class="camera-layer"
          :style="{
            clipPath: p1State.clipPath,
            transform: p1State.transform,
            transformOrigin: p1Origin,
          }"
        >
          <!-- PERIPHERAL FLOATING WIDGETS -->
          <div
            class="peri-card peri-top-left"
            :style="{ transform: `${p1State.periLeft} translate3d(${driftX(0.4).toFixed(1)}px, ${driftY(0.4).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">TYPOGRAPHY SCALE</span>
            <span class="peri-value tabular-nums">Inter · -0.03em · tabular-nums</span>
          </div>

          <div
            class="peri-card peri-top-right"
            :style="{ transform: `${p1State.periRight} translate3d(${driftX(1.6).toFixed(1)}px, ${driftY(1.6).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">CONTRAST TOKEN</span>
            <span class="peri-value is-emerald tabular-nums">14.8:1 AAA · Passed ✓</span>
          </div>

          <div
            class="peri-card peri-mid-left"
            :style="{ transform: `${p1State.periLeft} translate3d(${driftX(2.5).toFixed(1)}px, ${driftY(2.5).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">SPATIAL RHYTHM</span>
            <span class="peri-value tabular-nums">8pt Grid · Auto Layout v4</span>
          </div>

          <div
            class="peri-card peri-bottom-right"
            :style="{ transform: `${p1State.periRight} translate3d(${driftX(3.4).toFixed(1)}px, ${driftY(3.4).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">SEMANTIC COLOR TOKENS</span>
            <div class="peri-swatches">
              <span class="p-sw"><i style="background:#050507" />#050507</span>
              <span class="p-sw"><i style="background:#E2B878" />#E2B878</span>
              <span class="p-sw"><i style="background:#34D399" />#34D399</span>
            </div>
          </div>

          <div class="kicker-mask">
            <span class="seq-kicker is-gold" :style="{ transform: `translate3d(0, ${p1TextY}, 0)` }">
              8pt Grid · WCAG AA Contrast · Design Tokens
            </span>
          </div>
          <div class="title-mask">
            <h1 class="seq-title" :style="{ transform: `translate3d(0, ${p1TextY}, 0)` }">
              <span class="tone-ice">UX/UI</span>
              <span class="tone-gold">DESIGN</span>
              <span class="notion-pills" aria-hidden="true">
                <span class="n-pill">8pt Grid</span>
                <span class="n-pill is-gold">WCAG AA</span>
              </span>
            </h1>
          </div>

          <div class="figma-workspace" :style="p1UiReveal">
            <div class="figma-header">
              <div class="fh-left">
                <span class="fh-dots" aria-hidden="true"><i /><i /><i /></span>
                <span class="fh-file tabular-nums">Frame / Voltrep_System · 8pt Grid · WCAG AA</span>
              </div>

              <!-- Cause-and-Effect Trigger Button -->
              <button
                ref="p1BtnRef"
                type="button"
                tabindex="-1"
                class="trigger-pill is-gold-trigger is-target-btn"
                :class="{
                  'is-hover': p1Hover,
                  'is-active': p1Validated,
                  'is-pressed': p1Pressed,
                }"
              >
                <span class="btn-label">Validate Flow →</span>
                <span v-if="p1Ripple" class="click-ripple" aria-hidden="true" />
              </button>
            </div>

            <div class="figma-body">
              <div class="figma-panel" aria-hidden="true">
                <div class="fp-title">COMPONENT TREE</div>
                <div class="layer-item is-active"><span class="li-icon">#</span> Frame / Hero</div>
                <div class="layer-item"><span class="li-icon">⊞</span> Auto Layout</div>
                <div class="layer-item"><span class="li-icon">⬡</span> 8pt Grid</div>
              </div>

              <div class="figma-stage-center">
                <div class="selection-frame is-polished">
                  <span class="handle h-tl" aria-hidden="true" />
                  <span class="handle h-tr" aria-hidden="true" />
                  <span class="handle h-bl" aria-hidden="true" />
                  <span class="handle h-br" aria-hidden="true" />
                  <span class="redline r-top tabular-nums" aria-hidden="true">24px</span>
                  <span class="redline r-side tabular-nums" aria-hidden="true">16px</span>

                  <div class="ui-preview-card is-hc">
                    <div class="upc-row">
                      <span class="upc-kicker">VOLTREP · PRODUCTION TOKEN</span>
                      <span class="upc-chip tabular-nums">14.8:1 AAA ✓</span>
                    </div>
                    <div class="upc-title">Hack Squat · 120 kg × 6 reps</div>
                    <div class="upc-bar"><div class="upc-bar-fill" /></div>
                  </div>
                </div>
              </div>

              <div class="figma-panel" aria-hidden="true">
                <div class="fp-title">UI TOKENS</div>
                <div class="token-row"><i class="sw" style="background:#050507" /><span>#050507</span></div>
                <div class="token-row"><i class="sw" style="background:#E2B878" /><span>#E2B878</span></div>
                <div class="token-row"><i class="sw" style="background:#34D399" /><span>#34D399</span></div>
                <div class="token-spec">Inter · tabular-nums</div>
              </div>
            </div>
          </div>
        </div>

        <!-- TRANSITION 1: LUMINOUS CHAMPAGNE-GOLD SVG PORTAL CURVE -->
        <svg
          v-if="tr1Curve.active"
          class="transition-svg-overlay"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          :style="{ opacity: tr1Curve.opacity }"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="goldCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#E2B878" stop-opacity="0.2" />
              <stop offset="50%" stop-color="#E2B878" stop-opacity="1" />
              <stop offset="100%" stop-color="#34D399" stop-opacity="0.95" />
            </linearGradient>
          </defs>
          <path
            d="M 80 460 C 320 460, 420 120, 620 280 C 800 420, 920 160, 1140 140"
            fill="none"
            stroke="url(#goldCurveGrad)"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="1200"
            :stroke-dashoffset="tr1Curve.dashOffset"
            style="filter: drop-shadow(0 0 14px rgba(226, 184, 120, 0.85));"
          />
        </svg>

        <!-- =========================================================
             ACT 02 (4.5s – 9.0s) — USER RESEARCH
             2-Frame Bento Stagger + `Simplify` node click -> Magnetic Arc Converge
             ========================================================= -->
        <div
          v-show="p2State.visible"
          class="camera-layer"
          :style="{
            clipPath: p2State.clipPath,
            transform: p2State.transform,
          }"
        >
          <!-- PERIPHERAL FLOATING WIDGETS -->
          <div
            class="peri-card peri-top-left"
            :style="{ transform: `${p2State.periLeft} translate3d(${driftX(0.8).toFixed(1)}px, ${driftY(0.8).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">HEURISTIC EVALUATION</span>
            <span class="peri-value is-emerald">Heuristic Audit Passed ✓</span>
          </div>

          <div
            class="peri-card peri-top-right"
            :style="{ transform: `${p2State.periRight} translate3d(${driftX(1.9).toFixed(1)}px, ${driftY(1.9).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">DECISION LATENCY</span>
            <span class="peri-value tabular-nums">1.2s Avg Interaction Time</span>
          </div>

          <div
            class="peri-card peri-mid-left"
            :style="{ transform: `${p2State.periLeft} translate3d(${driftX(2.7).toFixed(1)}px, ${driftY(2.7).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">SAMPLE COHORT</span>
            <span class="peri-value tabular-nums">N = 48 Active Athletes</span>
          </div>

          <div
            class="peri-card peri-bottom-right"
            :style="{ transform: `${p2State.periRight} translate3d(${driftX(3.8).toFixed(1)}px, ${driftY(3.8).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">ATTENTION TELEMETRY</span>
            <span class="peri-value is-gold tabular-nums">94.2% Primary CTA Fixation</span>
          </div>

          <div class="kicker-mask">
            <span class="seq-kicker is-emerald" :style="{ transform: `translate3d(0, ${p2TextY}, 0)` }">
              -42% Cognitive Friction · 98.4% Task Completion · SUS Score 91/100
            </span>
          </div>
          <div class="title-mask">
            <h1 class="seq-title" :style="{ transform: `translate3d(0, ${p2TextY}, 0)` }">
              <span class="tone-ice">USER</span>
              <span class="tone-emerald">RESEARCH</span>
            </h1>
          </div>

          <!-- Telemetry Header morphed surgically from Act 01 pill -->
          <div class="research-action-bar" :style="p2BarMorph">
            <span class="ra-journey" aria-hidden="true">Telemetry Verified · Cognitive Ergonomics</span>
            <span class="ra-badge is-emerald" aria-hidden="true">98.4% Flow ✓</span>
          </div>

          <!-- Wide 3-Column Bento Layout with 2-frame stagger -->
          <div class="bento-research-3col">
            <div class="glass-panel bento-card" :style="p2BentoStyle(0)">
              <div class="bc-top">
                <span class="bc-tag">COGNITIVE FRICTION</span>
                <span class="bc-trend">↓ Optimal</span>
              </div>
              <div class="bc-main-row">
                <span class="bc-num is-emerald tabular-nums">-{{ mFriction }}%</span>
                <svg class="sparkline-svg" viewBox="0 0 110 34" fill="none" aria-hidden="true">
                  <path d="M4 6 L32 12 L58 10 L82 24 L106 29" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="106" cy="29" r="3.5" fill="#34D399" />
                </svg>
              </div>
              <span class="bc-sub">Friction reduction across active set logging</span>
            </div>

            <div class="glass-panel bento-card" :style="p2BentoStyle(1)">
              <div class="bc-top">
                <span class="bc-tag">TASK COMPLETION</span>
                <span class="bc-sus tabular-nums">SUS {{ mSus }}/100</span>
              </div>
              <div class="bc-main-row">
                <span class="bc-num is-ice tabular-nums">{{ mTask }}%</span>
                <span class="bc-badge-gold">Benchmark</span>
              </div>
              <div class="sus-bar-track" aria-hidden="true">
                <div class="sus-bar-fill" :style="{ width: `${mSus}%` }" />
              </div>
            </div>

            <div class="glass-panel bento-card" :style="p2BentoStyle(2)">
              <div class="bc-top">
                <span class="bc-tag">VALIDATED JOURNEY</span>
                <span class="bc-flow-status simplified">3 Ergonomic Nodes ✓</span>
              </div>
              <div class="flow-row is-clean">
                <span class="f-node" :style="{ transform: p2NodeArc(1) }">
                  <i class="f-dot ice" />Discover
                </span>
                <span class="f-connector" :style="{ opacity: (1 - p2State.convergeK).toFixed(2) }" />
                <span class="f-node is-gold" :style="{ transform: p2NodeArc(0) }">
                  <i class="f-dot gold" />Validate
                </span>
                <span class="f-connector" :style="{ opacity: (1 - p2State.convergeK).toFixed(2) }" />
                <button
                  ref="p2BtnRef"
                  type="button"
                  tabindex="-1"
                  class="f-node is-emerald is-target-btn is-node-btn"
                  :class="{
                    'is-hover': p2Hover,
                    'is-active': p2Triggered,
                    'is-pressed': p2Pressed,
                  }"
                  :style="{ transform: p2NodeArc(-1) }"
                >
                  <i class="f-dot emerald" />
                  <span class="btn-label">Simplify</span>
                  <span v-if="p2Ripple" class="click-ripple is-emerald" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TRANSITION 2: FLUID HORIZONTAL SVG ENERGY RIBBON -->
        <svg
          v-if="tr2Ribbon.active"
          class="transition-svg-overlay"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          :style="{ opacity: tr2Ribbon.opacity }"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#34D399" stop-opacity="0.3" />
              <stop offset="50%" stop-color="#E2B878" stop-opacity="1" />
              <stop offset="100%" stop-color="#F5F5F7" stop-opacity="0.9" />
            </linearGradient>
          </defs>
          <path
            d="M -40 315 Q 300 265, 600 315 T 1240 315"
            fill="none"
            stroke="url(#ribbonGrad)"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="1400"
            :stroke-dashoffset="tr2Ribbon.dashOffset"
            style="filter: drop-shadow(0 0 18px rgba(226, 184, 120, 0.9));"
          />
        </svg>

        <!-- =========================================================
             ACT 03 (9.0s – 13.5s) — CREATIVE AI
             Surgical Shape Morph (width / borderRadius) -> Prompt Composer
             Click Trigger: `↑ Generate` -> Macro Zoom (170%) + Aperture Wipe
             ========================================================= -->
        <div
          v-show="p3State.visible"
          class="camera-layer"
          :style="{
            clipPath: p3State.clipPath,
            transform: p3State.transform,
            transformOrigin: p3Origin,
          }"
        >
          <!-- PERIPHERAL FLOATING CONTEXT CHIPS -->
          <div
            class="peri-card peri-top-left"
            :style="{ transform: `${p3State.apertureTop} translate3d(${driftX(1.1).toFixed(1)}px, ${driftY(1.1).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">CONTEXT ATTACHMENT 01</span>
            <span class="peri-value is-gold">Design Tokens · 8pt Rhythm</span>
          </div>

          <div
            class="peri-card peri-top-right"
            :style="{ transform: `${p3State.apertureTop} translate3d(${driftX(2.1).toFixed(1)}px, ${driftY(2.1).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">CONTEXT ATTACHMENT 02</span>
            <span class="peri-value is-emerald">User Telemetry · -42% Friction</span>
          </div>

          <div
            class="peri-card peri-mid-left"
            :style="{ transform: `${p3State.apertureBot} translate3d(${driftX(3.0).toFixed(1)}px, ${driftY(3.0).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">ACCESSIBILITY CONSTRAINTS</span>
            <span class="peri-value tabular-nums">A11y Rules · WCAG AA 14.8:1</span>
          </div>

          <div
            class="peri-card peri-bottom-right"
            :style="{ transform: `${p3State.apertureBot} translate3d(${driftX(4.1).toFixed(1)}px, ${driftY(4.1).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">OUTPUT TARGET</span>
            <span class="peri-value tabular-nums">Vue 3 SFC · 60fps GPU Transforms</span>
          </div>

          <div class="kicker-mask" :style="{ transform: p3State.apertureTop }">
            <span class="seq-kicker is-gold" :style="{ transform: `translate3d(0, ${p3TextY}, 0)` }">
              System Prompt → Component Architecture → Token Validation
            </span>
          </div>
          <div class="title-mask" :style="{ transform: p3State.apertureTop }">
            <h1 class="seq-title" :style="{ transform: `translate3d(0, ${p3TextY}, 0)` }">
              <span class="tone-ice">CREATIVE</span>
              <span class="tone-gold">AI</span>
            </h1>
          </div>

          <div
            class="prompt-box"
            :class="{
              'is-focus': p3Focused,
              'is-pulse': p3State.pulseBorder,
            }"
            :style="p3PromptMorph"
          >
            <div class="prompt-top" :style="{ transform: p3State.apertureTop }">
              <span class="model-pill"><span class="pill-dot" aria-hidden="true" />System Architecture Prompt</span>
              <span class="ctx-pill tabular-nums" :class="{ lit: typedText.length > 0 }">
                {{ tokenCount }} tok · Validated
              </span>
            </div>

            <div ref="p3FieldRef" class="prompt-field" :style="{ transform: p3State.apertureTop }">
              <span class="prompt-text">{{ typedText }}</span><span class="prompt-caret" :class="{ on: p3Focused }" aria-hidden="true" />
            </div>

            <div class="prompt-bottom" :style="{ transform: p3State.apertureBot }">
              <div class="chip-group" aria-hidden="true">
                <span class="attach-chip">Design Tokens</span>
                <span class="attach-chip">A11y Rules</span>
                <span class="attach-chip">User Telemetry</span>
              </div>
              <button
                ref="p3BtnRef"
                type="button"
                tabindex="-1"
                class="submit-btn is-target-btn"
                :class="{
                  ready: p3SubmitReady,
                  'is-hover': p3Hover,
                  pressed: p3Pressed,
                }"
              >
                <span aria-hidden="true">↑</span>
                <span class="btn-label">Generate</span>
                <span v-if="p3Ripple" class="click-ripple" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <!-- =========================================================
             ACT 04 (13.5s – 18.0s) — MOTION & FRONT-END
             Click Trigger 1: Voltrep `Log Set ✓` -> emerald `Set Logged ✓`
             Click Trigger 2: `Inspect System ↗` -> Morphs card into Figma Selection Frame
             ========================================================= -->
        <div
          v-show="p4State.visible"
          class="camera-layer"
          :style="{
            clipPath: p4State.clipPath,
            transform: p4State.transform,
          }"
        >
          <!-- PERIPHERAL FLOATING TELEMETRY -->
          <div
            class="peri-card peri-top-left"
            :style="{ transform: `${p4State.otherSlideLeft} translate3d(${driftX(0.6).toFixed(1)}px, ${driftY(0.6).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">FRAME TIMING</span>
            <span class="peri-value is-emerald tabular-nums">60 FPS · 16.6ms GPU Composited</span>
          </div>

          <div
            class="peri-card peri-top-right"
            :style="{ transform: `${p4State.otherSlideLeft} translate3d(${driftX(1.7).toFixed(1)}px, ${driftY(1.7).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">LAYOUT STABILITY</span>
            <span class="peri-value tabular-nums">CLS 0.00 · Zero Layout Shift</span>
          </div>

          <div
            class="peri-card peri-mid-left"
            :style="{ transform: `${p4State.otherSlideLeft} translate3d(${driftX(2.9).toFixed(1)}px, ${driftY(2.9).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">PRODUCTION STACK</span>
            <span class="peri-value tabular-nums">Vue 3 · Vite · Semantic HTML5</span>
          </div>

          <div
            class="peri-card peri-bottom-right"
            :style="{ transform: `${p4State.otherSlideLeft} translate3d(${driftX(3.6).toFixed(1)}px, ${driftY(3.6).toFixed(1)}px, 0)` }"
            aria-hidden="true"
          >
            <span class="peri-label">SPRING PHYSICS</span>
            <span class="peri-value is-gold tabular-nums">cubic-bezier(0.22, 1, 0.36, 1)</span>
          </div>

          <div class="kicker-mask" :style="{ transform: p4State.otherSlideLeft }">
            <span class="seq-kicker is-gold" :style="{ transform: `translate3d(0, ${p4TextY}, 0)` }">
              Voltrep Production UI · 60 FPS GPU Compositing · Zero Layout Shift
            </span>
          </div>
          <div class="title-mask" :style="{ transform: p4State.otherSlideLeft }">
            <h1 class="seq-title" :style="{ transform: `translate3d(0, ${p4TextY}, 0)` }">
              <span class="tone-gold">MOTION &amp;</span>
              <span class="tone-ice">FRONT-END</span>
            </h1>
          </div>

          <!-- Elastic Sliding Pill Navbar: Overview | Case Studies | Journey -->
          <div class="live-navbar-pill" :style="{ transform: p4State.otherSlideLeft }" aria-hidden="true">
            <span class="nav-thumb" :style="{ transform: `translate3d(${p4NavIdx * 100}%, 0, 0)` }" />
            <span class="nav-item" :class="{ active: p4NavIdx === 0 }">Overview</span>
            <span class="nav-item" :class="{ active: p4NavIdx === 1 }">Case Studies</span>
            <span class="nav-item">Journey</span>
          </div>

          <div class="frontend-showcase">
            <!-- Left/Center: Voltrep Workout Set Logger -->
            <div
              class="glass-panel volt-card"
              :class="{ done: p4VoltDone }"
              :style="{ transform: p4State.otherSlideLeft }"
            >
              <div class="vc-head">
                <span class="vc-brand">VOLTREP · PRODUCTION WORKOUT LOGGER</span>
                <span class="vc-status tabular-nums" :class="{ done: p4VoltDone }">
                  {{ p4VoltDone ? 'Set Logged ✓' : 'Set 4 / 4' }}
                </span>
              </div>

              <div class="vc-exercise">Hack Squat</div>

              <div class="vc-logger-row">
                <div class="vc-metric tabular-nums">
                  <span class="vc-val">120 kg × 6 reps</span>
                  <span class="vc-sub">RPE 8.5 · Cognitive Ergonomics</span>
                </div>
                <button
                  ref="p4CheckRef"
                  type="button"
                  tabindex="-1"
                  class="vc-check-btn is-target-btn"
                  :class="{
                    'is-hover': p4CheckHover && !p4VoltDone,
                    clicked: p4CheckPressed,
                    done: p4VoltDone,
                  }"
                >
                  <span class="btn-label">Log Set ✓</span>
                  <span v-if="p4CheckRipple" class="click-ripple is-emerald" aria-hidden="true" />
                </button>
              </div>

              <div class="vc-track" aria-hidden="true">
                <div class="vc-fill" :style="{ width: p4VoltDone ? '100%' : '75%' }" />
              </div>
            </div>

            <!-- Right: Case Study Card (Morphs into Figma Selection Frame on click of Inspect System ↗) -->
            <div
              class="glass-panel case-card"
              :class="{
                hover: p4CaseHover,
                'is-figma-morph': p4State.morphK > 0.05,
              }"
              :style="{
                transform: p4State.morphK > 0
                  ? `translate3d(${(-p4State.morphK * 175).toFixed(1)}px, 0, 0)`
                  : 'none',
                borderRadius: p4State.morphK > 0 ? `${Math.round(20 - p4State.morphK * 16)}px` : undefined,
              }"
            >
              <template v-if="p4State.morphK > 0.08">
                <span class="handle h-tl" aria-hidden="true" />
                <span class="handle h-tr" aria-hidden="true" />
                <span class="handle h-bl" aria-hidden="true" />
                <span class="handle h-br" aria-hidden="true" />
                <span class="redline r-top tabular-nums" aria-hidden="true">Frame / Voltrep_System</span>
              </template>

              <div class="cc-top">
                <span class="cc-tag">FEATURED CASE STUDY</span>
                <span class="cc-pill">60 FPS · Semantic Code</span>
              </div>
              <div class="cc-title">Voltrep Case Study</div>
              <div class="cc-specs">WCAG AA Contrast · 8pt Spatial Rhythm · Zero Paywall</div>
              <button
                ref="p4CaseBtnRef"
                type="button"
                tabindex="-1"
                class="cc-inspect-btn is-target-btn"
                :class="{
                  'is-hover': p4CaseHover,
                  'is-pressed': p4CasePressed,
                }"
              >
                <span class="btn-label">Inspect System ↗</span>
                <span v-if="p4CaseRipple" class="click-ripple" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <!-- =========================================================
             GLOBAL PIXEL-ACCURATE VECTOR CURSOR (Dead-Center Targeting)
             ========================================================= -->
        <div
          class="global-cursor"
          :style="{
            transform: `translate3d(${stageCursor.x.toFixed(1)}px, ${stageCursor.y.toFixed(1)}px, 0) scale(${stageCursor.scale})`,
          }"
          aria-hidden="true"
        >
          <svg
            class="g-cur g-arrow"
            :class="{ hide: stageCursor.ibeam }"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
          >
            <path
              d="M2 2L19 10.5L11.5 13L8.5 20.5L2 2Z"
              fill="#E2B878"
              stroke="#050507"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            class="g-cur g-ibeam"
            :class="{ show: stageCursor.ibeam }"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
          >
            <path d="M9 4h6M9 20h6M12 4v16" stroke="#F5F5F7" stroke-width="1.9" stroke-linecap="round" />
          </svg>
        </div>
      </div>

      <!-- Lower-left identity & CTA anchor (Safe Zone) -->
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
  padding: 4.7rem 0 1.4rem;
}

@media (min-width: 768px) {
  .film-stage {
    min-height: 94vh;
    padding: 5.3rem 0 2.05rem;
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
  transition: background 1.1s cubic-bezier(0.16, 1, 0.3, 1);
  animation: breathe 8s ease-in-out infinite alternate;
}

.bloom-1 {
  width: 56vw;
  height: 56vw;
  max-width: 780px;
  max-height: 780px;
  top: 6%;
  left: 18%;
  opacity: 0.09;
}

.bloom-2 {
  width: 46vw;
  height: 46vw;
  max-width: 600px;
  max-height: 600px;
  bottom: 5%;
  right: 10%;
  opacity: 0.075;
  animation-duration: 10s;
  animation-direction: alternate-reverse;
}

@keyframes breathe {
  0% { transform: scale(0.96) translate3d(0, 0, 0); }
  100% { transform: scale(1.07) translate3d(2%, -2%, 0); }
}

.ambient-design .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-design .bloom-2 { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }
.ambient-research .bloom-1 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }
.ambient-research .bloom-2 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-ai .bloom-2 { background: radial-gradient(circle, #F5F5F7 0%, transparent 70%); }
.ambient-frontend .bloom-1 { background: radial-gradient(circle, #E2B878 0%, transparent 70%); }
.ambient-frontend .bloom-2 { background: radial-gradient(circle, #34D399 0%, transparent 70%); }

/* =========================================================
   FULL-BLEED 100VW VIEWPORT STAGE
   ========================================================= */
.camera-viewport {
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
  .camera-viewport {
    padding: 0.85rem 2.5rem;
  }
}

.camera-layer {
  position: relative;
  grid-area: 1 / 1;
  width: 100%;
  min-height: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.8rem;
  will-change: transform, clip-path;
}

@media (min-width: 768px) {
  .camera-layer {
    min-height: 520px;
    gap: 0.95rem;
  }
}

/* =========================================================
   PERIPHERAL FLOATING UI WIDGETS (LEFT, RIGHT, UPPER, LOWER-RIGHT)
   ========================================================= */
.peri-card {
  display: none;
  position: absolute;
  z-index: 1;
  padding: 0.55rem 0.85rem;
  border-radius: 14px;
  background: rgba(15, 17, 23, 0.78);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.11);
  box-shadow: 0 18px 40px -16px rgba(0, 0, 0, 0.85);
  flex-direction: column;
  align-items: flex-start;
  gap: 0.18rem;
  text-align: left;
  pointer-events: none;
  will-change: transform;
}

@media (min-width: 1120px) {
  .peri-card {
    display: flex;
  }
}

.peri-top-left {
  top: 2%;
  left: 1%;
}

.peri-top-right {
  top: 2%;
  right: 1%;
}

.peri-mid-left {
  bottom: 14%;
  left: 1%;
}

.peri-bottom-right {
  bottom: 4%;
  right: 1%;
}

.peri-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #8B92A0;
}

.peri-value {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  color: #E5E7EB;
}

.peri-value.is-emerald { color: #6EE7B7; }
.peri-value.is-gold { color: #E2B878; }

.peri-swatches {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.p-sw {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: #D1D5DB;
}

.p-sw i {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  display: inline-block;
}

/* =========================================================
   GLOBAL PIXEL-ACCURATE VECTOR CURSOR & CLICK RIPPLES
   ========================================================= */
.global-cursor {
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  margin-left: -2px;
  margin-top: -2px;
  pointer-events: none;
  z-index: 30;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.85));
  will-change: transform;
}

.g-cur {
  position: absolute;
  inset: 0;
  transition: opacity 140ms ease, transform 140ms ease;
}

.g-arrow.hide { opacity: 0; transform: scale(0.7); }
.g-ibeam { opacity: 0; transform: scale(0.7); margin-left: -10px; margin-top: -10px; }
.g-ibeam.show { opacity: 1; transform: scale(1); }

.is-target-btn {
  position: relative;
  overflow: visible;
}

.click-ripple {
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  border: 2px solid #E2B878;
  pointer-events: none;
  animation: rippleOut 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.click-ripple.is-emerald {
  border-color: #34D399;
}

@keyframes rippleOut {
  0% { transform: scale(0.95); opacity: 0.95; }
  100% { transform: scale(1.75); opacity: 0; }
}

/* =========================================================
   SHARED TYPOGRAPHY & CARDS
   ========================================================= */
.seq-kicker {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
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

.kicker-mask,
.title-mask {
  overflow: hidden;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.seq-kicker {
  display: inline-block;
  will-change: transform;
}

.seq-title {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.25rem 0.65rem;
  font-size: clamp(2.1rem, 4.9vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.04;
  will-change: transform;
}

.notion-pills {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: 0.15rem;
  vertical-align: middle;
}

.n-pill {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.24rem 0.58rem;
  border-radius: 999px;
  background: rgba(245, 245, 247, 0.08);
  border: 1px solid rgba(245, 245, 247, 0.22);
  color: #F5F5F7;
  line-height: 1;
}

.n-pill.is-gold {
  background: rgba(226, 184, 120, 0.14);
  border-color: rgba(226, 184, 120, 0.45);
  color: #E2B878;
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
  padding: 0.24rem 0.74rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 200ms ease, border-color 200ms ease, color 200ms ease;
}

.mode-pill.active {
  background: rgba(255, 255, 255, 0.08);
  color: #F5F5F7;
}

.mode-pill.is-hover {
  border-color: rgba(226, 184, 120, 0.55);
  color: #F5F5F7;
}

.mode-pill.active-hc {
  background: rgba(226, 184, 120, 0.2);
  border-color: #E2B878;
  color: #F5F5F7;
  box-shadow: 0 0 18px rgba(226, 184, 120, 0.3);
}

.mode-pill.is-pressed {
  transform: scale(0.92);
}

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
  gap: 0.68rem;
  padding: 0.95rem 0.9rem;
  align-items: center;
}

@media (min-width: 720px) {
  .figma-body {
    grid-template-columns: 150px 1fr 154px;
    padding: 1.15rem 1.1rem;
  }
}

.figma-panel {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.38rem;
  padding: 0.42rem 0.6rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

@media (min-width: 720px) {
  .figma-panel {
    flex-direction: column;
    align-items: stretch;
    gap: 0.4rem;
    padding: 0.62rem 0.72rem;
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
  .fp-title { margin-right: 0; margin-bottom: 0.1rem; }
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
  padding: 0.35rem 0.6rem 0.15rem;
}

.selection-frame {
  position: relative;
  width: 100%;
  max-width: 390px;
  padding: 0.82rem 0.95rem;
  border: 1.5px dashed rgba(255, 255, 255, 0.32);
  transition: border-color 240ms ease, background-color 240ms ease;
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
  gap: 0.42rem;
  padding: 0.68rem 0.82rem;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.03);
  transition: all 240ms ease;
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
  white-space: nowrap;
  flex-shrink: 0;
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
  transition: width 280ms ease;
}

.ui-preview-card.is-hc .upc-bar-fill {
  width: 100%;
  background: linear-gradient(90deg, #E2B878, #34D399);
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
   PHASE 02: USER RESEARCH 3-COLUMN BENTO & FLOW FILTER
   ========================================================= */
.filter-pill-bar {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.45rem;
  border-radius: 999px;
  background: #0F1117;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.filter-pill {
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  font-family: inherit;
  font-size: 0.74rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 200ms ease, border-color 200ms ease, color 200ms ease;
}

.filter-pill.is-active-gold {
  background: rgba(226, 184, 120, 0.16);
  border-color: #E2B878;
  color: #F5F5F7;
}

.filter-pill.is-hover {
  border-color: rgba(52, 211, 153, 0.55);
  color: #F5F5F7;
}

.filter-pill.is-active-emerald {
  background: rgba(52, 211, 153, 0.2);
  border-color: #34D399;
  color: #F5F5F7;
  box-shadow: 0 0 20px rgba(52, 211, 153, 0.3);
}

.filter-pill.is-pressed { transform: scale(0.92); }

.bento-research-3col {
  position: relative;
  z-index: 2;
  width: min(880px, calc(100vw - 2.5rem));
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
  text-align: left;
}

@media (min-width: 768px) {
  .bento-research-3col {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
  }
}

.bento-card {
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.45rem;
}

.bc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.bc-tag {
  font-family: var(--font-mono);
  font-size: 0.64rem;
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
  font-size: 0.68rem;
  font-weight: 700;
  color: #E2B878;
}

.bc-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}

.bc-num {
  font-size: clamp(1.45rem, 2.3vw, 1.9rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.bc-num.is-emerald { color: #34D399; }
.bc-num.is-ice { color: #F5F5F7; }

.sparkline-svg {
  width: 86px;
  height: 28px;
}

.bc-badge-gold {
  font-size: 0.69rem;
  font-weight: 700;
  padding: 0.16rem 0.5rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.14);
  color: #E2B878;
}

.bc-sub {
  font-size: 0.71rem;
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
  font-size: 0.65rem;
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
  gap: 0.24rem;
  flex-wrap: nowrap;
}

.f-chip {
  padding: 0.2rem 0.42rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.16);
  font-size: 0.66rem;
  color: #9CA3AF;
}

.f-node {
  display: inline-flex;
  align-items: center;
  gap: 0.26rem;
  padding: 0.22rem 0.46rem;
  border-radius: 999px;
  background: #08090D;
  border: 1px solid rgba(245, 245, 247, 0.28);
  font-size: 0.65rem;
  font-weight: 600;
  color: #F5F5F7;
  white-space: nowrap;
  flex-shrink: 0;
}

.f-node.is-gold { border-color: rgba(226, 184, 120, 0.6); }
.f-node.is-emerald { border-color: rgba(52, 211, 153, 0.6); color: #D1FAE5; }

.f-connector {
  flex: 1;
  min-width: 8px;
  height: 2px;
  background: linear-gradient(90deg, #E2B878, #34D399);
}

.f-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.f-dot.ice { background: #F5F5F7; }
.f-dot.gold { background: #E2B878; }
.f-dot.emerald { background: #34D399; }

/* =========================================================
   PHASE 03: SENIOR AI PROMPT COMPOSER (#0F1117 + #E2B878)
   ========================================================= */
.prompt-box {
  position: relative;
  z-index: 2;
  width: min(720px, calc(100vw - 2.5rem));
  padding: 0.9rem 1.05rem 0.85rem 1.15rem;
  border-radius: 20px;
  background: #0F1117;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 26px 60px -22px rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  gap: 0.68rem;
  text-align: left;
  transition: box-shadow 220ms ease, border-color 220ms ease;
}

.prompt-box.is-focus,
.prompt-box.is-pulse {
  border-color: #E2B878;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 0 2px #E2B878,
    0 20px 52px rgba(226, 184, 120, 0.2);
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
  min-height: 3.1rem;
  font-size: clamp(0.86rem, 1.55vw, 1.02rem);
  line-height: 1.48;
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

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.attach-chip {
  font-size: 0.69rem;
  font-weight: 600;
  color: #D1D5DB;
  padding: 0.22rem 0.54rem;
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
  border: 1px solid transparent;
  background: rgba(226, 184, 120, 0.28);
  color: rgba(5, 5, 7, 0.78);
  font-family: inherit;
  font-size: 0.81rem;
  font-weight: 700;
  transition: background-color 200ms ease, color 200ms ease, transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease;
}

.submit-btn.ready,
.submit-btn.is-hover {
  background: #E2B878;
  color: #050507;
  box-shadow: 0 0 20px rgba(226, 184, 120, 0.38);
}

.submit-btn.pressed { transform: scale(0.92); }

/* =========================================================
   PHASE 04: MOTION & FRONT-END (VOLTREP & PORTFOLIO ECOSYSTEM)
   ========================================================= */
.live-navbar-pill {
  position: relative;
  z-index: 2;
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
  transition: transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item {
  position: relative;
  z-index: 1;
  padding: 0.34rem 0;
  font-size: 0.73rem;
  font-weight: 600;
  color: #9CA3AF;
  transition: color 200ms ease;
}

.nav-item.active { color: #F5F5F7; }

.frontend-showcase {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
}

.volt-card,
.case-card {
  position: relative;
  width: min(345px, calc(100vw - 2.5rem));
  padding: 0.9rem 1.05rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1), border-color 260ms ease, box-shadow 260ms ease;
}

.volt-card.done {
  border-color: rgba(52, 211, 153, 0.65);
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
  font-size: 0.64rem;
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
  white-space: nowrap;
  flex-shrink: 0;
}

.vc-status.done {
  background: rgba(52, 211, 153, 0.2);
  border: 1px solid rgba(52, 211, 153, 0.45);
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
  font-size: 1.15rem;
  font-weight: 800;
  color: #E2B878;
}

.vc-sub {
  font-size: 0.7rem;
  color: #9CA3AF;
}

.vc-check-btn {
  padding: 0.38rem 0.72rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #E5E7EB;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}

.vc-check-btn.is-hover {
  border-color: #34D399;
  color: #F5F5F7;
}

.vc-check-btn.clicked { transform: scale(0.92); }
.vc-check-btn.done {
  background: #34D399;
  border-color: #34D399;
  color: #050507;
  box-shadow: 0 0 18px rgba(52, 211, 153, 0.45);
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
  transition: width 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

.case-card.hover {
  transform: translate3d(0, -5px, 0);
  border-color: rgba(226, 184, 120, 0.68);
  box-shadow: 0 28px 58px -18px rgba(226, 184, 120, 0.3);
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
  font-size: 0.7rem;
  color: #6EE7B7;
}

.cc-inspect-btn {
  align-self: flex-start;
  margin-top: 0.14rem;
  padding: 0.34rem 0.72rem;
  border-radius: 999px;
  border: 1px solid rgba(226, 184, 120, 0.45);
  background: rgba(226, 184, 120, 0.12);
  color: #E2B878;
  font-family: inherit;
  font-size: 0.74rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}

.cc-inspect-btn.is-hover {
  background: #E2B878;
  border-color: #E2B878;
  color: #050507;
}

.cc-inspect-btn.is-pressed {
  transform: scale(0.92);
}

.case-card.is-figma-morph {
  border: 1.5px solid #E2B878 !important;
  border-radius: 4px !important;
  background: rgba(226, 184, 120, 0.04) !important;
  box-shadow: 0 0 38px -8px rgba(226, 184, 120, 0.45) !important;
  z-index: 16;
}

.case-card.is-figma-morph .handle {
  border-color: #E2B878;
}

/* =========================================================
   CAUSE-AND-EFFECT TRIGGER PILLS & SVG ENERGY OVERLAYS
   ========================================================= */
.trigger-pill {
  padding: 0.34rem 0.85rem;
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}

.trigger-pill.is-gold-trigger {
  border: 1px solid rgba(226, 184, 120, 0.55);
  background: rgba(226, 184, 120, 0.14);
  color: #E2B878;
}

.trigger-pill.is-gold-trigger.is-hover,
.trigger-pill.is-gold-trigger.is-active {
  background: #E2B878;
  border-color: #E2B878;
  color: #050507;
  box-shadow: 0 0 22px rgba(226, 184, 120, 0.45);
}

.trigger-pill.is-emerald-trigger {
  border: 1px solid rgba(52, 211, 153, 0.55);
  background: rgba(52, 211, 153, 0.14);
  color: #6EE7B7;
}

.trigger-pill.is-emerald-trigger.is-hover,
.trigger-pill.is-emerald-trigger.is-active {
  background: #34D399;
  border-color: #34D399;
  color: #050507;
  box-shadow: 0 0 22px rgba(52, 211, 153, 0.45);
}

.trigger-pill.is-pressed {
  transform: scale(0.95);
}

.is-target-btn .btn-label {
  display: inline-block;
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.is-target-btn.is-hover .btn-label {
  transform: translate3d(0, -1px, 0);
}

.research-action-bar {
  position: relative;
  z-index: 2;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.28rem 0.36rem 0.28rem 0.85rem;
  border-radius: 999px;
  background: #0F1117;
  border: 1px solid rgba(52, 211, 153, 0.35);
  box-shadow: 0 12px 32px -16px rgba(52, 211, 153, 0.35);
  overflow: hidden;
  white-space: nowrap;
}

.ra-journey {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: #D1D5DB;
}

.ra-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.62rem;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.16);
  color: #6EE7B7;
  border: 1px solid rgba(52, 211, 153, 0.4);
}

.transition-svg-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 22;
}

/* =========================================================
   LOWER-LEFT IDENTITY & CTA SAFE ZONE
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
  gap: 0.6rem;
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
  .click-ripple {
    animation: none !important;
  }
}
</style>
