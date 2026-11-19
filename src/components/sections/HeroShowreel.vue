<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

// =============================================================================
// 20.0s SEAMLESS HERO SHOWREEL (4SCjXcBeW1E Motion Mechanics + Rich Peripheral Graphics)
// - Scene 01 (0.0s – 5.0s) : UX/UI DESIGN
//   · Inline Pill `[ + System ]` + Vertical Word Carousel (`Systems` -> `Interfaces` -> `DESIGN`)
//   · Spatial 2D Figma Auto-Layout Frame (`8pt Grid · WCAG AA`) with live redline guides (16px/24px)
//   · Multiplayer Live Cursors (`UX`, `UI`, `Dev`) snapping modular style grid components
//   · Peripheral Typography Scale, Color Token Swatches (#050507, #E2B878, #34D399), Contrast 14.8:1 AAA
//   · Cursor clicks `Validate Flow →` -> `Validated ✓` + horizontal spatial pan & capsule wave
// - Scene 02 (5.0s – 10.0s): USER RESEARCH
//   · Text-First reveal + Staggered Dark-Glass UX Outline & Telemetry Stack:
//     Row 1: `Cognitive Load Audit` -> `-42% Friction` (tabular-nums counter + sparkline)
//     Row 2: `Usability Benchmark` -> `98.4% Task Completion · SUS 91/100` (progress fill)
//     Row 3: `User Journey Architecture` -> `Simplify Flow` -> `Simplified ✓` (3 ergonomic nodes)
//   · Peripheral heuristic pills (`Card Sorting`, `Heuristic Audit`, `Zero Dead-Ends`) & dashed guide tracks
//   · Cursor clicks `Simplify Flow` then `Next →`, collapsing stack (width/height/borderRadius) into AI Prompt Pill
// - Scene 03 (10.0s – 15.0s): CREATIVE AI (NO Robot / NO Binary Stream)
//   · Glassmorphic AI Prompt Pill Composer (#0F1117, #E2B878 focus ring, rounded-full)
//   · Macro Close-Up Caret Typing (scale 1.32) streaming senior copy
//   · Camera pulls back (scale 1.0) revealing peripheral cards (`Voltrep_Tokens.fig`, `A11y_Rules.json`, `UX_Telemetry`)
//   · Cursor drags `Voltrep_Tokens.fig` and drops it inside prompt pill as inline chip `[Voltrep_Tokens.fig ×]`
//   · Cursor clicks `↑ Generate` -> morphs width/height/borderRadius into `Generating...` capsule +
//     3 expanding concentric pill outline echoes + pulsing vertical equalizer bar wave into Scene 04
// - Scene 04 (15.0s – 20.0s): MOTION & FRONT-END
//   · Peripheral physics telemetry (`60 FPS · GPU Compositing · cubic-bezier(0.16, 1, 0.3, 1)`)
//   · Left/Center Foreground: Voltrep Live Logger (`Hack Squat · 120 kg × 6 reps`) + `Log Set` -> `Set Logged ✓`
//   · Right Foreground: Portfolio Sliding Pill Navbar (`Overview | Case Studies | Journey`) +
//     `Voltrep Case Study` (`60 FPS · Semantic Code`) + `▶ Preview System`
//   · Cursor clicks `▶ Preview System` -> 3 concentric pill outline echoes wipe to `[ + System ]` at 0.0s
// =============================================================================

const LOOP_SEC = 20.0
const LOOP_MS = LOOP_SEC * 1000

const PROMPT_TEXT =
  'Architect a low-friction workout logger with WCAG AA contrast, 8pt spatial rhythm, and 60fps micro-interactions.'

const elapsedMs = ref(0)
const isAutoPlaying = ref(true)

let rafId = null
let lastTs = null

// Live DOM Refs for getBoundingClientRect() cursor targeting
const stageRef = ref(null)
const s1ValidateBtnRef = ref(null)
const s2SimplifyBtnRef = ref(null)
const s2NextBtnRef = ref(null)
const s3DragCardRef = ref(null)
const s3DropZoneRef = ref(null)
const s3GenerateBtnRef = ref(null)
const s4LogBtnRef = ref(null)
const s4PreviewBtnRef = ref(null)

const targets = reactive({
  s1Validate: { x: 720, y: 440 },
  s2Simplify: { x: 780, y: 405 },
  s2Next: { x: 885, y: 465 },
  s3DragCard: { x: 260, y: 360 },
  s3DropZone: { x: 470, y: 315 },
  s3Generate: { x: 890, y: 365 },
  s4Log: { x: 525, y: 435 },
  s4Preview: { x: 895, y: 435 },
})

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))
const lerp = (a, b, k) => a + (b - a) * k
const easeOutCubic = (x) => 1 - Math.pow(1 - clamp(x), 3)
const easeOutQuint = (x) => 1 - Math.pow(1 - clamp(x), 5)
const easeInOutCubic = (x) => {
  const c = clamp(x)
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}
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
    targets.s1Validate = centerOf(s1ValidateBtnRef.value, vpRect, targets.s1Validate)
  } else if (s < 10.0) {
    targets.s2Simplify = centerOf(s2SimplifyBtnRef.value, vpRect, targets.s2Simplify)
    targets.s2Next = centerOf(s2NextBtnRef.value, vpRect, targets.s2Next)
  } else if (s < 15.0) {
    targets.s3DragCard = centerOf(s3DragCardRef.value, vpRect, targets.s3DragCard)
    targets.s3DropZone = centerOf(s3DropZoneRef.value, vpRect, targets.s3DropZone)
    targets.s3Generate = centerOf(s3GenerateBtnRef.value, vpRect, targets.s3Generate)
  } else {
    targets.s4Log = centerOf(s4LogBtnRef.value, vpRect, targets.s4Log)
    targets.s4Preview = centerOf(s4PreviewBtnRef.value, vpRect, targets.s4Preview)
  }
}

const bez = (p0, p1, p2, k) => ({
  x: (1 - k) * (1 - k) * p0.x + 2 * (1 - k) * k * p1.x + k * k * p2.x,
  y: (1 - k) * (1 - k) * p0.y + 2 * (1 - k) * k * p1.y + k * k * p2.y,
})

// =============================================================================
// SCENE 01 (0.00s – 5.00s) — UX/UI DESIGN
// Inline Pill `[ + System ]` + Vertical Word Carousel -> Spatial Figma Canvas
// =============================================================================
const s1State = computed(() => {
  const s = sec.value
  if (s >= 5.0) {
    return { visible: false, opacity: '0', transform: 'none' }
  }
  if (s < 0.35) {
    const k = easeOutQuint(s / 0.35)
    return {
      visible: true,
      opacity: k.toFixed(3),
      transform: `scale(${(1.04 - k * 0.04).toFixed(4)})`,
    }
  }
  if (s < 4.42) {
    return {
      visible: true,
      opacity: '1',
      transform: 'translate3d(0, 0, 0) scale(1)',
    }
  }
  // 4.42s -> 5.00s: Horizontal spatial pan + capsule wave clears Scene 01
  const k = easeInOutQuart((s - 4.42) / 0.58)
  return {
    visible: true,
    opacity: (1 - k).toFixed(3),
    transform: `translate3d(${(-k * 140).toFixed(1)}px, 0, 0) scale(${(1 - k * 0.04).toFixed(4)})`,
  }
})

// Vertical word carousel index: 0 = Systems (0.0-0.42s), 1 = Interfaces (0.42-0.84s), 2 = DESIGN (0.84s+)
const s1WordIndex = computed(() => {
  const s = sec.value
  if (s < 0.42) return 0
  if (s < 0.84) return 1
  return 2
})

const s1CarouselOffsetEm = computed(() => {
  const s = sec.value
  let pos = 0
  if (s < 0.42) {
    pos = easeInOutCubic(clamp((s - 0.12) / 0.3)) * 1
  } else if (s < 0.88) {
    pos = 1 + easeSpring(clamp((s - 0.42) / 0.44)) * 1
  } else {
    pos = 2
  }
  return (-pos * 1.18).toFixed(3)
})

// Camera pulls back at 0.9s – 1.45s to reveal Figma Auto-Layout Frame & peripheral tokens
const s1CanvasReveal = computed(() => easeOutQuint(clamp((sec.value - 0.65) / 0.7)))

// Modular style grid toggle: Wireframe -> Production UI when multiplayer cursors align (2.1s)
const s1ProductionMode = computed(() => sec.value >= 2.05)

// Multiplayer Live Cursors (`UX`, `UI`, `Dev`)
const s1PeerCursors = computed(() => {
  const s = clamp(sec.value, 0, 5)
  const k = easeInOutCubic(clamp((s - 1.0) / 1.15))
  const floatA = Math.sin(s * 2.8) * 4
  const floatB = Math.cos(s * 2.5) * 4
  return {
    ux: {
      x: lerp(28, 128, k) + floatA,
      y: lerp(96, 48, k) - floatB,
    },
    ui: {
      x: lerp(390, 315, k) - floatB,
      y: lerp(124, 68, k) + floatA,
    },
    dev: {
      x: lerp(210, 248, k) + floatB,
      y: lerp(164, 134, k) - floatA,
    },
  }
})

const s1Hover = computed(() => sec.value >= 3.55 && sec.value < 4.55)
const s1Pressed = computed(() => sec.value >= 3.92 && sec.value < 4.08)
const s1Validated = computed(() => sec.value >= 4.0)
const s1Ripple = computed(() => sec.value >= 3.96 && sec.value < 4.55)

// Capsule wave transition bridge between Scene 01 and Scene 02 (4.35s – 5.25s)
const s12CapsuleWave = computed(() => {
  const s = sec.value
  if (s < 4.32 || s >= 5.28) return { visible: false, progress: 0 }
  const k = (s - 4.32) / 0.96
  return { visible: true, progress: k }
})

// =============================================================================
// SCENE 02 (5.00s – 10.00s) — USER RESEARCH
// Staggered Dark-Glass UX Outline & Telemetry Stack + Simplify Flow -> Next -> Morph
// =============================================================================
const s2State = computed(() => {
  const s = sec.value
  if (s < 5.0 || s >= 10.0) {
    return { visible: false, opacity: '0', transform: 'none' }
  }
  const local = s - 5.0
  if (local < 0.48) {
    const k = easeOutQuint(local / 0.48)
    return {
      visible: true,
      opacity: k.toFixed(3),
      transform: `translate3d(${((1 - k) * 95).toFixed(1)}px, 0, 0)`,
    }
  }
  if (local < 4.3) {
    return {
      visible: true,
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    }
  }
  // 9.30s -> 10.00s: Stack collapses via width/height/borderRadius spring into Scene 03 Prompt Pill
  const k = easeInOutQuart((local - 4.3) / 0.7)
  return {
    visible: true,
    opacity: (1 - k * 0.92).toFixed(3),
    transform: `translate3d(0, ${(-k * 12).toFixed(1)}px, 0)`,
  }
})

const s2TitleY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 5.04) / 0.42))) * 105).toFixed(1)}%`)

const s2RowReveal = (idx) => {
  const k = easeSpring(clamp((sec.value - (5.22 + idx * 0.14)) / 0.55))
  return {
    opacity: clamp((sec.value - (5.22 + idx * 0.14)) / 0.3).toFixed(3),
    transform: `translate3d(0, ${((1 - k) * 22).toFixed(1)}px, 0)`,
  }
}

const s2FrictionVal = computed(() => {
  const k = easeOutCubic(clamp((sec.value - 5.35) / 1.15))
  return Math.round(42 * k)
})

const s2CompletionVal = computed(() => {
  const k = easeOutCubic(clamp((sec.value - 5.5) / 1.25))
  return (98.4 * k).toFixed(1)
})

const s2SusVal = computed(() => {
  const k = easeOutCubic(clamp((sec.value - 5.5) / 1.25))
  return Math.round(91 * k)
})

const s2SimplifyHover = computed(() => sec.value >= 7.3 && sec.value < 8.15)
const s2SimplifyPressed = computed(() => sec.value >= 7.72 && sec.value < 7.88)
const s2Simplified = computed(() => sec.value >= 7.8)
const s2SimplifyRipple = computed(() => sec.value >= 7.76 && sec.value < 8.3)

const s2NextHover = computed(() => sec.value >= 8.55 && sec.value < 9.35)
const s2NextPressed = computed(() => sec.value >= 8.88 && sec.value < 9.04)
const s2NextClicked = computed(() => sec.value >= 8.95)
const s2NextRipple = computed(() => sec.value >= 8.92 && sec.value < 9.45)

// Surgical width / height / borderRadius morph on Scene 02 Stack -> Scene 03 Prompt Pill (9.15s – 9.95s)
const s2StackMorphStyle = computed(() => {
  const s = sec.value
  if (s < 9.15) {
    return {
      maxWidth: '760px',
      borderRadius: '20px',
    }
  }
  const k = easeInOutQuart(clamp((s - 9.15) / 0.8))
  return {
    maxWidth: `${lerp(760, 680, k).toFixed(1)}px`,
    maxHeight: `${lerp(310, 74, k).toFixed(1)}px`,
    borderRadius: `${lerp(20, 999, k).toFixed(1)}px`,
    overflow: 'hidden',
  }
})

// =============================================================================
// SCENE 03 (10.00s – 15.00s) — CREATIVE AI (NO Robot / NO Binary Stream)
// Macro Close-Up Caret Typing + Drag-and-Drop Context Chip + Concentric Submit Echo
// + Capsule-to-Equalizer Wave into Scene 04
// =============================================================================
const s3State = computed(() => {
  const s = sec.value
  if (s < 10.0 || s >= 15.0) {
    return { visible: false, opacity: '0', transform: 'none' }
  }
  const local = s - 10.0
  if (local < 0.38) {
    const k = easeOutQuint(local / 0.38)
    return {
      visible: true,
      opacity: k.toFixed(3),
      transform: 'translate3d(0, 0, 0)',
    }
  }
  if (local < 4.4) {
    return {
      visible: true,
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    }
  }
  const k = easeInOutQuart((local - 4.4) / 0.6)
  return {
    visible: true,
    opacity: (1 - k).toFixed(3),
    transform: `scale(${(1 + k * 0.05).toFixed(4)})`,
  }
})

const s3TitleY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 10.02) / 0.4))) * 105).toFixed(1)}%`)

// Macro camera zoom onto the blinking caret (10.18s – 11.45s: scale 1.32 -> 1.00)
const s3MacroZoomStyle = computed(() => {
  const s = sec.value
  let sc = 1
  if (s >= 10.12 && s < 10.52) {
    sc = lerp(1, 1.32, easeOutCubic((s - 10.12) / 0.4))
  } else if (s >= 10.52 && s < 11.28) {
    sc = 1.32
  } else if (s >= 11.28 && s < 11.72) {
    sc = lerp(1.32, 1, easeInOutCubic((s - 11.28) / 0.44))
  }
  return {
    transform: `scale(${sc.toFixed(4)})`,
  }
})

// Live senior prompt typing (10.22s – 11.65s)
const s3TypedCopy = computed(() => {
  const s = sec.value
  if (s < 10.2) return ''
  const k = clamp((s - 10.2) / 1.42)
  const chars = Math.floor(k * PROMPT_TEXT.length)
  return PROMPT_TEXT.slice(0, chars)
})

// Peripheral context cards reveal as camera pulls back (11.35s+)
const s3ContextReveal = computed(() => easeOutQuint(clamp((sec.value - 11.25) / 0.55)))

// Drag-and-drop sequence for `Voltrep_Tokens.fig`:
// 11.78s -> 12.42s: Cursor grabs `Voltrep_Tokens.fig` and drags it into the prompt pill
// 12.42s+: Attached inline as `[Voltrep_Tokens.fig ×]`
const s3IsDraggingChip = computed(() => sec.value >= 11.82 && sec.value < 12.42)
const s3ChipAttached = computed(() => sec.value >= 12.42)

const s3DragCardStyle = computed(() => {
  const s = sec.value
  if (s >= 12.42) {
    return {
      opacity: '0.28',
      transform: 'scale(0.92)',
    }
  }
  if (s >= 11.82 && s < 12.42) {
    const k = easeInOutCubic((s - 11.82) / 0.6)
    const dx = (targets.s3DropZone.x - targets.s3DragCard.x) * k
    const dy = (targets.s3DropZone.y - targets.s3DragCard.y) * k
    const sc = lerp(1, 0.88, k)
    return {
      zIndex: 35,
      opacity: '1',
      transform: `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${sc.toFixed(3)})`,
      borderColor: '#E2B878',
      boxShadow: '0 18px 40px rgba(226, 184, 120, 0.32)',
    }
  }
  return {
    opacity: s3ContextReveal.value.toFixed(3),
    transform: `translate3d(0, ${((1 - s3ContextReveal.value) * 16).toFixed(1)}px, 0) scale(0.95)`,
  }
})

// Submit click & `Generating...` pill morph (13.05s+)
const s3GenHover = computed(() => sec.value >= 12.7 && sec.value < 13.45)
const s3GenPressed = computed(() => sec.value >= 13.02 && sec.value < 13.18)
const s3IsGenerating = computed(() => sec.value >= 13.12)
const s3GenRipple = computed(() => sec.value >= 13.08 && sec.value < 13.7)

// Prompt Pill width / height / borderRadius morph into compact `Generating...` capsule (13.15s – 13.75s)
const s3PromptMorphStyle = computed(() => {
  const s = sec.value
  if (s < 13.15) {
    return {
      maxWidth: '790px',
      borderRadius: '999px',
    }
  }
  const k = easeInOutQuart(clamp((s - 13.15) / 0.55))
  return {
    maxWidth: `${lerp(790, 290, k).toFixed(1)}px`,
    borderRadius: '999px',
  }
})

// 3 Concentric Expanding Pill Outline Echoes on `Generating...` (13.18s – 14.35s)
const s3ConcentricEchoes = computed(() => {
  const s = sec.value
  if (s < 13.16 || s >= 14.45) return []
  return [0, 1, 2].map((i) => {
    const k = clamp((s - (13.16 + i * 0.16)) / 0.85)
    const e = easeOutCubic(k)
    return {
      id: i,
      opacity: ((1 - e) * (k > 0 ? 0.78 : 0)).toFixed(3),
      width: `${lerp(280, 760 + i * 110, e).toFixed(1)}px`,
      height: `${lerp(62, 168 + i * 44, e).toFixed(1)}px`,
    }
  })
})

// Capsule-to-Equalizer Bar Wave Bridge (13.95s – 15.25s)
const EQ_WAVE_BARS = Array.from({ length: 24 }, (_, i) => i)
const s34EqualizerBridge = computed(() => {
  const s = sec.value
  if (s < 13.92 || s >= 15.22) return { visible: false, bars: [] }
  const local = (s - 13.92) / 1.3
  const env = Math.sin(clamp(local) * Math.PI)
  const bars = EQ_WAVE_BARS.map((i) => {
    const centerDist = Math.abs(i - 11.5) / 11.5
    const phase = Math.sin(s * 9.5 - i * 0.45) * 0.5 + 0.5
    const h = clamp((24 + phase * 150 * (1 - centerDist * 0.45)) * env, 12, 180)
    return {
      id: i,
      height: `${h.toFixed(1)}px`,
      opacity: clamp(env * 1.25, 0, 0.95).toFixed(3),
      isGold: i % 2 === 0,
    }
  })
  return { visible: true, bars }
})

// =============================================================================
// SCENE 04 (15.00s – 20.00s) — MOTION & FRONT-END
// Voltrep Live Logger + Portfolio Sliding Pill Navbar + Concentric Echo Loop Reset
// =============================================================================
const s4State = computed(() => {
  const s = sec.value
  if (s < 15.0) {
    return { visible: false, opacity: '0', transform: 'none' }
  }
  const local = s - 15.0
  if (local < 0.45) {
    const k = easeOutQuint(local / 0.45)
    return {
      visible: true,
      opacity: k.toFixed(3),
      transform: `translate3d(0, ${((1 - k) * 24).toFixed(1)}px, 0)`,
    }
  }
  if (local < 4.35) {
    return {
      visible: true,
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    }
  }
  // 19.35s -> 20.00s: Concentric Echo Loop Reset wipes cleanly into `[ + System ]` at 0.0s
  const k = easeInOutQuart((local - 4.35) / 0.65)
  return {
    visible: true,
    opacity: (1 - k).toFixed(3),
    transform: `scale(${(1 - k * 0.04).toFixed(4)})`,
  }
})

const s4TitleY = computed(() => `${((1 - easeOutQuint(clamp((sec.value - 15.04) / 0.42))) * 105).toFixed(1)}%`)

const s4LogHover = computed(() => sec.value >= 16.05 && sec.value < 16.95)
const s4LogPressed = computed(() => sec.value >= 16.45 && sec.value < 16.61)
const s4SetLogged = computed(() => sec.value >= 16.52)
const s4LogRipple = computed(() => sec.value >= 16.49 && sec.value < 17.05)

// Sliding Pill Navbar: glides from `Overview` (index 0) to `Case Studies` (index 1) at 16.85s
const s4NavCaseStudiesActive = computed(() => sec.value >= 16.85)

const s4PreviewHover = computed(() => sec.value >= 18.15 && sec.value < 19.1)
const s4PreviewPressed = computed(() => sec.value >= 18.58 && sec.value < 18.74)
const s4PreviewClicked = computed(() => sec.value >= 18.65)
const s4PreviewRipple = computed(() => sec.value >= 18.62 && sec.value < 19.25)

// 3 Concentric Expanding Pill Outline Echoes on `▶ Preview System` (18.66s – 19.95s)
const s4LoopEchoes = computed(() => {
  const s = sec.value
  if (s < 18.66) return []
  return [0, 1, 2].map((i) => {
    const k = clamp((s - (18.66 + i * 0.16)) / 0.92)
    const e = easeOutCubic(k)
    return {
      id: i,
      opacity: ((1 - e) * (k > 0 ? 0.82 : 0)).toFixed(3),
      width: `${lerp(220, 820 + i * 140, e).toFixed(1)}px`,
      height: `${lerp(52, 220 + i * 56, e).toFixed(1)}px`,
    }
  })
})

// =============================================================================
// UNIFIED PIXEL-ACCURATE DYNAMIC CURSOR (`getBoundingClientRect()`)
// =============================================================================
const stageCursor = computed(() => {
  const s = sec.value
  let x = targets.s1Validate.x
  let y = targets.s1Validate.y
  let scale = 1
  let opacity = 0

  // SCENE 01: Glide to `Validate Flow →` & click (3.10s – 4.45s)
  if (s >= 3.1 && s < 4.45) {
    const b = targets.s1Validate
    const start = { x: b.x + 150, y: b.y + 80 }
    if (s < 3.65) {
      const k = easeOutQuint((s - 3.1) / 0.55)
      opacity = clamp((s - 3.1) / 0.22)
      const p = bez(start, { x: b.x + 55, y: b.y - 24 }, b, k)
      x = p.x
      y = p.y
    } else if (s < 4.18) {
      opacity = 1
      x = b.x
      y = b.y
      if (s >= 3.92 && s < 4.08) scale = 0.92
    } else {
      const k = easeOutCubic((s - 4.18) / 0.27)
      opacity = 1 - k
      x = b.x - k * 45
      y = b.y + k * 15
    }
  }
  // SCENE 02: Glide to `Simplify Flow` (7.10s), click (7.75s), then glide to `Next →` (8.55s) & click (8.92s)
  else if (s >= 7.05 && s < 9.45) {
    const b1 = targets.s2Simplify
    const b2 = targets.s2Next
    const start = { x: b1.x + 140, y: b1.y - 70 }
    if (s < 7.55) {
      const k = easeOutQuint((s - 7.05) / 0.5)
      opacity = clamp((s - 7.05) / 0.2)
      const p = bez(start, { x: b1.x + 48, y: b1.y - 24 }, b1, k)
      x = p.x
      y = p.y
    } else if (s < 8.15) {
      opacity = 1
      x = b1.x
      y = b1.y
      if (s >= 7.72 && s < 7.88) scale = 0.92
    } else if (s < 8.65) {
      opacity = 1
      const k = easeInOutCubic((s - 8.15) / 0.5)
      const p = bez(b1, { x: (b1.x + b2.x) / 2 + 18, y: (b1.y + b2.y) / 2 - 14 }, b2, k)
      x = p.x
      y = p.y
    } else if (s < 9.18) {
      opacity = 1
      x = b2.x
      y = b2.y
      if (s >= 8.88 && s < 9.04) scale = 0.92
    } else {
      const k = easeOutCubic((s - 9.18) / 0.27)
      opacity = 1 - k
      x = b2.x + k * 35
      y = b2.y + k * 20
    }
  }
  // SCENE 03: Grab `Voltrep_Tokens.fig` (11.50s), drag into prompt pill (11.82s-12.42s), glide to `↑ Generate` (12.85s) & click (13.05s)
  else if (s >= 11.45 && s < 13.75) {
    const card = targets.s3DragCard
    const drop = targets.s3DropZone
    const gen = targets.s3Generate
    const start = { x: card.x - 70, y: card.y + 70 }
    if (s < 11.82) {
      const k = easeOutQuint((s - 11.45) / 0.37)
      opacity = clamp((s - 11.45) / 0.18)
      x = lerp(start.x, card.x, k)
      y = lerp(start.y, card.y, k)
    } else if (s < 12.42) {
      opacity = 1
      scale = 0.93
      const k = easeInOutCubic((s - 11.82) / 0.6)
      x = lerp(card.x, drop.x, k)
      y = lerp(card.y, drop.y, k)
    } else if (s < 12.88) {
      opacity = 1
      const k = easeInOutCubic((s - 12.42) / 0.46)
      const p = bez(drop, { x: (drop.x + gen.x) / 2, y: drop.y - 26 }, gen, k)
      x = p.x
      y = p.y
    } else if (s < 13.42) {
      opacity = 1
      x = gen.x
      y = gen.y
      if (s >= 13.02 && s < 13.18) scale = 0.92
    } else {
      const k = easeOutCubic((s - 13.42) / 0.33)
      opacity = 1 - k
      x = gen.x + k * 40
      y = gen.y + k * 20
    }
  }
  // SCENE 04: Glide to `Log Set` (15.85s), click (16.48s), then glide to `▶ Preview System` (18.25s) & click (18.62s)
  else if (s >= 15.8 && s < 19.15) {
    const bLog = targets.s4Log
    const bPrev = targets.s4Preview
    const start = { x: bLog.x - 130, y: bLog.y + 70 }
    if (s < 16.28) {
      const k = easeOutQuint((s - 15.8) / 0.48)
      opacity = clamp((s - 15.8) / 0.2)
      const p = bez(start, { x: bLog.x - 40, y: bLog.y - 22 }, bLog, k)
      x = p.x
      y = p.y
    } else if (s < 17.15) {
      opacity = 1
      x = bLog.x
      y = bLog.y
      if (s >= 16.45 && s < 16.61) scale = 0.92
    } else if (s < 18.25) {
      opacity = 1
      const k = easeInOutCubic((s - 17.15) / 1.1)
      const p = bez(bLog, { x: (bLog.x + bPrev.x) / 2, y: Math.min(bLog.y, bPrev.y) - 38 }, bPrev, k)
      x = p.x
      y = p.y
    } else if (s < 18.88) {
      opacity = 1
      x = bPrev.x
      y = bPrev.y
      if (s >= 18.58 && s < 18.74) scale = 0.92
    } else {
      const k = easeOutCubic((s - 18.88) / 0.27)
      opacity = 1 - k
      x = bPrev.x + k * 36
      y = bPrev.y - k * 20
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
    elapsedMs.value = 2400
  } else {
    elapsedMs.value = 150
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
  <section
    class="vids-hero"
    aria-label="UX/UI Design, User Research, Creative AI, and Motion & Front-End Interactive Showreel"
  >
    <div class="vids-stage">
      <!-- Ambient Obsidian Radial Light Blooms + Subtle Dashed Precision Guides -->
      <div class="ambient-bg" aria-hidden="true">
        <div class="rad-bloom b-gold" />
        <div class="rad-bloom b-mint" />
        <div class="rad-bloom b-alabaster" />
        <svg class="precision-guides" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <line x1="88" y1="60" x2="88" y2="620" stroke="rgba(226,184,120,0.14)" stroke-dasharray="3 7" />
          <line x1="1352" y1="60" x2="1352" y2="620" stroke="rgba(52,211,153,0.14)" stroke-dasharray="3 7" />
          <line x1="120" y1="92" x2="1320" y2="92" stroke="rgba(255,255,255,0.06)" stroke-dasharray="2 8" />
        </svg>
      </div>

      <!-- =====================================================================
           MAIN INTERACTIVE VIEWPORT (20.0s 4-Scene Seamless Loop)
           ===================================================================== -->
      <div ref="stageRef" class="vids-viewport">
        <!-- ===================================================================
             SCENE 01 (0.0s – 5.0s) — UX/UI DESIGN
             Inline Pill `[ + System ]` + Vertical Word Carousel + Multiplayer Figma Canvas
             =================================================================== -->
        <div
          v-show="s1State.visible"
          class="scene-layer s1-layer"
          :style="{
            opacity: s1State.opacity,
            transform: s1State.transform,
          }"
        >
          <!-- Peripheral Top Telemetry Bar -->
          <div class="periph-topbar">
            <div class="periph-pill">
              <span class="pp-dot gold" />
              <span class="tabular">FIGMA AUTO-LAYOUT // 8PT_GRID</span>
            </div>
            <div class="periph-pill">
              <span class="pp-dot mint" />
              <span class="tabular">CONTRAST 14.8:1 · WCAG AAA</span>
            </div>
          </div>

          <!-- Inline Pill Opener + Vertical Word Carousel ([00:00:01]–[00:00:03] mechanic) -->
          <div class="opener-headline-bar">
            <h1 class="inline-pill-title">
              <span class="ipt-word">UX/UI</span>
              <span class="inline-sys-pill">
                <span class="isp-plus">+</span>
                <span>System</span>
              </span>
              <span class="word-carousel-viewport">
                <span
                  class="word-carousel-track"
                  :style="{ transform: `translate3d(0, ${s1CarouselOffsetEm}em, 0)` }"
                >
                  <span class="wc-item muted" :class="{ active: s1WordIndex === 0 }">Systems</span>
                  <span class="wc-item muted" :class="{ active: s1WordIndex === 1 }">Interfaces</span>
                  <span class="wc-item gold" :class="{ active: s1WordIndex === 2 }">DESIGN</span>
                </span>
              </span>
            </h1>
          </div>

          <!-- Spatial Figma Canvas + Rich Peripheral Elements -->
          <div
            class="s1-spatial-grid"
            :style="{
              opacity: s1CanvasReveal.toFixed(3),
              transform: `translate3d(0, ${((1 - s1CanvasReveal) * 20).toFixed(1)}px, 0) scale(${(0.96 + s1CanvasReveal * 0.04).toFixed(3)})`,
            }"
          >
            <!-- Left Peripheral Card: Typography Scale & Token Swatches -->
            <aside class="periph-depth-card p-left">
              <div class="pdc-kicker">TYPOGRAPHY SCALE</div>
              <div class="pdc-title">Inter · -0.03em</div>
              <div class="pdc-mono tabular">clamp(2.2rem, 5vw, 4.4rem) · tabular-nums</div>
              <div class="swatch-list">
                <div class="sw-row">
                  <span class="sw-circle obs" />
                  <span class="sw-hex tabular">#050507</span>
                  <span class="sw-name">Obsidian</span>
                </div>
                <div class="sw-row">
                  <span class="sw-circle gold" />
                  <span class="sw-hex tabular">#E2B878</span>
                  <span class="sw-name">Champagne</span>
                </div>
                <div class="sw-row">
                  <span class="sw-circle mint" />
                  <span class="sw-hex tabular">#34D399</span>
                  <span class="sw-name">Emerald</span>
                </div>
              </div>
            </aside>

            <!-- Center Foreground: Flat 2D Figma Auto-Layout Frame with Multiplayer Cursors -->
            <div class="figma-canvas-card" :class="{ 'is-prod': s1ProductionMode, 'is-validated': s1Validated }">
              <div class="fcc-toolbar">
                <div class="fcc-dots"><i /><i /><i /></div>
                <span class="fcc-frame-name">Frame · Voltrep_Design_System</span>
                <span class="fcc-mode-chip tabular">
                  {{ s1ProductionMode ? 'PRODUCTION_UI · 8PT' : 'WIREFRAME_GRID' }}
                </span>
              </div>

              <!-- Modular Style Grid with Redline Spacing Guides (16px / 24px) & Multiplayer Cursors -->
              <div class="fcc-stage">
                <!-- Redline 24px Left Padding Guide -->
                <div class="redline-h rl-24" aria-hidden="true">
                  <span>24px</span>
                </div>

                <!-- Modular Component Grid -->
                <div class="mod-style-grid">
                  <div class="mod-tile" :class="{ 'tile-live': s1ProductionMode }">
                    <div class="mt-top">
                      <span class="mt-tag">TOKEN_01</span>
                      <span class="mt-status">{{ s1ProductionMode ? 'AA ✓' : 'DRAFT' }}</span>
                    </div>
                    <div class="mt-headline">Workout Set Card</div>
                    <div class="mt-sub tabular">120 kg × 6 reps · 8pt rhythm</div>
                  </div>

                  <div class="mod-tile" :class="{ 'tile-live': s1ProductionMode }">
                    <div class="mt-top">
                      <span class="mt-tag">TOKEN_02</span>
                      <span class="mt-status">{{ s1ProductionMode ? 'AAA ✓' : 'GRID' }}</span>
                    </div>
                    <div class="mt-headline">Tactile Pill Control</div>
                    <div class="mt-sub tabular">14.8:1 Contrast · 60fps spring</div>
                  </div>
                </div>

                <!-- Redline 16px Vertical Gap Guide -->
                <div class="redline-v rl-16" aria-hidden="true">
                  <span>16px</span>
                </div>

                <!-- Primary Action Pill Button inside Figma Frame (Cursor Click Target) -->
                <div class="fcc-footer">
                  <span class="fcc-spec tabular">Auto-Layout · Gap 16px · Padding 24px</span>
                  <button
                    ref="s1ValidateBtnRef"
                    type="button"
                    class="pill-cta"
                    :class="{
                      'is-hover': s1Hover,
                      'is-pressed': s1Pressed,
                      'is-flipped': s1Validated,
                    }"
                  >
                    <span class="p-dot" />
                    <span>{{ s1Validated ? 'Validated ✓' : 'Validate Flow →' }}</span>
                    <span v-if="s1Ripple" class="btn-ripple" />
                  </button>
                </div>

                <!-- Multiplayer Live Cursors (`UX`, `UI`, `Dev`) -->
                <div
                  class="peer-cursor pc-ux"
                  :style="{ transform: `translate3d(${s1PeerCursors.ux.x.toFixed(1)}px, ${s1PeerCursors.ux.y.toFixed(1)}px, 0)` }"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 16 16" width="13" height="13">
                    <path d="M2 2L7 14L9.2 9.2L14 7L2 2Z" fill="#E2B878" />
                  </svg>
                  <span class="pc-badge gold">UX</span>
                </div>

                <div
                  class="peer-cursor pc-ui"
                  :style="{ transform: `translate3d(${s1PeerCursors.ui.x.toFixed(1)}px, ${s1PeerCursors.ui.y.toFixed(1)}px, 0)` }"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 16 16" width="13" height="13">
                    <path d="M2 2L7 14L9.2 9.2L14 7L2 2Z" fill="#34D399" />
                  </svg>
                  <span class="pc-badge mint">UI</span>
                </div>

                <div
                  class="peer-cursor pc-dev"
                  :style="{ transform: `translate3d(${s1PeerCursors.dev.x.toFixed(1)}px, ${s1PeerCursors.dev.y.toFixed(1)}px, 0)` }"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 16 16" width="13" height="13">
                    <path d="M2 2L7 14L9.2 9.2L14 7L2 2Z" fill="#F5F5F7" />
                  </svg>
                  <span class="pc-badge alabaster">Dev</span>
                </div>
              </div>
            </div>

            <!-- Right Peripheral Card: Contrast 14.8:1 AAA & Equalizer Micro-Telemetry -->
            <aside class="periph-depth-card p-right">
              <div class="pdc-kicker">A11Y TELEMETRY</div>
              <div class="pdc-big tabular">14.8:1</div>
              <span class="pdc-chip">Contrast 14.8:1 AAA</span>
              <div class="mini-eq-bars" aria-hidden="true">
                <i style="height: 45%" /><i style="height: 80%" /><i style="height: 60%" /><i style="height: 95%" /><i style="height: 70%" /><i style="height: 85%" />
              </div>
              <div class="pdc-mono">Zero Visual Clutter · 8pt Rhythm</div>
            </aside>
          </div>
        </div>

        <!-- Capsule Wave Bridge between Scene 01 and Scene 02 -->
        <div v-if="s12CapsuleWave.visible" class="capsule-wave-overlay" aria-hidden="true">
          <span
            v-for="n in 5"
            :key="n"
            class="cw-pill"
            :class="{ mint: n % 2 === 0 }"
            :style="{
              transform: `translate3d(${((0.5 - s12CapsuleWave.progress) * (280 + n * 55)).toFixed(1)}px, ${((n - 3) * 34).toFixed(1)}px, 0)`,
              opacity: Math.sin(clamp(s12CapsuleWave.progress) * Math.PI).toFixed(3),
            }"
          />
        </div>

        <!-- ===================================================================
             SCENE 02 (5.0s – 10.0s) — USER RESEARCH
             Staggered Dark-Glass UX Outline & Telemetry Stack + Simplify Flow -> Next ->
             =================================================================== -->
        <div
          v-show="s2State.visible"
          class="scene-layer s2-layer"
          :style="{
            opacity: s2State.opacity,
            transform: s2State.transform,
          }"
        >
          <!-- Peripheral Heuristic Pills -->
          <div class="periph-topbar">
            <div class="heuristic-pills-group">
              <span class="periph-pill"><span class="pp-dot gold" />Card Sorting</span>
              <span class="periph-pill"><span class="pp-dot mint" />Heuristic Audit</span>
              <span class="periph-pill"><span class="pp-dot alabaster" />Zero Dead-Ends</span>
            </div>
            <div class="periph-pill tabular">
              <span>N = 48 MODERATED SESSIONS</span>
            </div>
          </div>

          <!-- Display Headline -->
          <div class="scene-head">
            <h2 class="display-title">
              <span class="t-mask">
                <span class="t-inner" :style="{ transform: `translate3d(0, ${s2TitleY}, 0)` }">
                  <span class="c-alabaster">USER</span>
                  <span class="c-gold">RESEARCH</span>
                </span>
              </span>
            </h2>
          </div>

          <!-- Spatial Stage: Left Peripheral Telemetry + Center Staggered UX Outline Stack + Right Peripheral Card -->
          <div class="s2-spatial-grid">
            <aside class="periph-depth-card p-left">
              <div class="pdc-kicker">COGNITIVE ERGONOMICS</div>
              <div class="pdc-big tabular c-mint">-{{ s2FrictionVal }}%</div>
              <div class="pdc-mono">Decision Latency Reduction</div>
            </aside>

            <!-- Staggered Dark-Glass UX Outline & Telemetry Stack (Morphs into AI Prompt Pill) -->
            <div class="ux-outline-stack" :style="s2StackMorphStyle">
              <div class="uos-header">
                <span class="uos-kicker">EMPIRICAL RESEARCH OUTLINE</span>
                <span class="uos-status tabular">{{ s2Simplified ? '3/3 NODES VALIDATED' : 'AUDIT_IN_PROGRESS' }}</span>
              </div>

              <!-- Row 1: Cognitive Load Audit -> -42% Friction -->
              <div class="uos-row" :style="s2RowReveal(0)">
                <div class="ur-left">
                  <span class="ur-index tabular">01</span>
                  <div class="ur-copy">
                    <span class="ur-label">Cognitive Load Audit</span>
                    <span class="ur-sub">Checkout &amp; Workout Logging Friction</span>
                  </div>
                </div>
                <div class="ur-right">
                  <svg class="ur-spark" viewBox="0 0 88 26">
                    <path
                      d="M2 5 C 24 6, 38 18, 60 20 L 86 23"
                      fill="none"
                      stroke="#34D399"
                      stroke-width="2.2"
                      stroke-linecap="round"
                    />
                  </svg>
                  <span class="ur-metric mint tabular">-{{ s2FrictionVal }}% Friction</span>
                </div>
              </div>

              <!-- Row 2: Usability Benchmark -> 98.4% Task Completion · SUS 91/100 -->
              <div class="uos-row" :style="s2RowReveal(1)">
                <div class="ur-left">
                  <span class="ur-index tabular">02</span>
                  <div class="ur-copy">
                    <span class="ur-label">Usability Benchmark</span>
                    <div class="ur-progress-track">
                      <div class="ur-progress-fill" :style="{ width: `${s2CompletionVal}%` }" />
                    </div>
                  </div>
                </div>
                <div class="ur-right">
                  <span class="ur-metric gold tabular">
                    {{ s2CompletionVal }}% Task Completion · SUS {{ s2SusVal }}/100
                  </span>
                </div>
              </div>

              <!-- Row 3: User Journey Architecture -> Simplify Flow + Next -> -->
              <div class="uos-row uos-journey-row" :style="s2RowReveal(2)">
                <div class="ur-left">
                  <span class="ur-index tabular">03</span>
                  <div class="ur-copy">
                    <span class="ur-label">User Journey Architecture</span>
                    <div class="journey-nodes-inline">
                      <span class="jn-chip ok">Discover</span>
                      <span class="jn-arrow">→</span>
                      <span v-if="!s2Simplified" class="jn-chip tangled">Retry</span>
                      <span v-if="!s2Simplified" class="jn-arrow">→</span>
                      <span class="jn-chip ok">Validate</span>
                      <span class="jn-arrow">→</span>
                      <span v-if="!s2Simplified" class="jn-chip tangled">Filter</span>
                      <span v-if="!s2Simplified" class="jn-arrow">→</span>
                      <span class="jn-chip ok">Ship</span>
                    </div>
                  </div>
                </div>

                <div class="ur-actions">
                  <button
                    ref="s2SimplifyBtnRef"
                    type="button"
                    class="pill-cta compact"
                    :class="{
                      'is-hover': s2SimplifyHover,
                      'is-pressed': s2SimplifyPressed,
                      'is-flipped': s2Simplified,
                    }"
                  >
                    <span class="p-dot" />
                    <span>{{ s2Simplified ? 'Simplified ✓' : 'Simplify Flow' }}</span>
                    <span v-if="s2SimplifyRipple" class="btn-ripple" />
                  </button>

                  <button
                    ref="s2NextBtnRef"
                    type="button"
                    class="pill-cta ghost compact"
                    :class="{
                      'is-hover': s2NextHover,
                      'is-pressed': s2NextPressed,
                      'is-flipped': s2NextClicked,
                    }"
                  >
                    <span>Next →</span>
                    <span v-if="s2NextRipple" class="btn-ripple" />
                  </button>
                </div>
              </div>
            </div>

            <aside class="periph-depth-card p-right">
              <div class="pdc-kicker">TASK VELOCITY</div>
              <div class="pdc-big tabular c-gold">3 Steps</div>
              <div class="pdc-mono">Discover → Validate → Ship</div>
            </aside>
          </div>
        </div>

        <!-- ===================================================================
             SCENE 03 (10.0s – 15.0s) — CREATIVE AI (NO Robot / NO Binary Stream)
             Macro Caret Typing + Drag-and-Drop Context Chip + Concentric Submit Echo
             =================================================================== -->
        <div
          v-show="s3State.visible"
          class="scene-layer s3-layer"
          :style="{
            opacity: s3State.opacity,
            transform: s3State.transform,
          }"
        >
          <!-- Peripheral Telemetry Header -->
          <div class="periph-topbar">
            <div class="periph-pill">
              <span class="pp-dot gold" />
              <span>AI PROMPT COMPOSER // CONTEXT-AWARE UI</span>
            </div>
            <div class="periph-pill tabular">
              <span class="pp-dot mint" />
              <span>{{ s3ChipAttached ? '1 CONTEXT ASSET ATTACHED' : 'DRAG & DROP TOKENS' }}</span>
            </div>
          </div>

          <!-- Display Headline -->
          <div class="scene-head">
            <h2 class="display-title">
              <span class="t-mask">
                <span class="t-inner" :style="{ transform: `translate3d(0, ${s3TitleY}, 0)` }">
                  <span class="c-alabaster">CREATIVE</span>
                  <span class="c-gold">AI</span>
                </span>
              </span>
            </h2>
          </div>

          <!-- Macro Zoom Stage: AI Prompt Pill + Drag-and-Drop Peripheral Context Cards -->
          <div class="s3-composer-stage">
            <!-- Concentric Expanding Pill Outline Echoes ([00:00:13] & [00:01:16] mechanic) -->
            <div class="echo-rings-layer" aria-hidden="true">
              <span
                v-for="echo in s3ConcentricEchoes"
                :key="echo.id"
                class="concentric-pill-echo"
                :style="{
                  width: echo.width,
                  height: echo.height,
                  opacity: echo.opacity,
                }"
              />
            </div>

            <!-- Macro Camera Wrapper (Zooms 1.32x onto Caret during typing, pulls back to 1.0x for drag-and-drop) -->
            <div class="s3-macro-camera" :style="s3MacroZoomStyle">
              <div
                class="ai-prompt-pill"
                :class="{
                  'is-drop-ready': s3IsDraggingChip,
                  'is-generating': s3IsGenerating,
                }"
                :style="s3PromptMorphStyle"
              >
                <!-- Morphs cleanly into luminous `Generating...` capsule on Submit -->
                <template v-if="!s3IsGenerating">
                  <div ref="s3DropZoneRef" class="app-input-area">
                    <span class="app-status-orb" />

                    <!-- Inline Attachment Chip dropped via Drag-and-Drop -->
                    <span v-if="s3ChipAttached" class="attached-context-chip">
                      <span class="acc-dot" />
                      <span>[Voltrep_Tokens.fig ×]</span>
                    </span>

                    <div class="app-typed-wrap">
                      <span class="app-typed-text">{{ s3TypedCopy }}</span>
                      <span class="app-caret" aria-hidden="true">|</span>
                    </div>
                  </div>

                  <button
                    ref="s3GenerateBtnRef"
                    type="button"
                    class="pill-cta submit-gen-btn"
                    :class="{
                      'is-hover': s3GenHover,
                      'is-pressed': s3GenPressed,
                    }"
                  >
                    <span>↑ Generate</span>
                    <span v-if="s3GenRipple" class="btn-ripple" />
                  </button>
                </template>

                <template v-else>
                  <div class="generating-capsule-body">
                    <span class="gen-pulse-orb" />
                    <span class="gen-label">Generating...</span>
                    <span class="gen-bars" aria-hidden="true">
                      <i /><i /><i /><i />
                    </span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Peripheral Context Asset Cards (Revealed on pullback; left card is dragged into prompt pill) -->
            <div class="s3-context-cards-row">
              <!-- Draggable Card 1: Voltrep_Tokens.fig -->
              <div
                ref="s3DragCardRef"
                class="context-asset-card draggable-card"
                :class="{ 'is-dragging': s3IsDraggingChip, 'is-dropped': s3ChipAttached }"
                :style="s3DragCardStyle"
              >
                <div class="cac-top">
                  <span class="cac-badge gold">FIGMA TOKENS</span>
                  <span class="cac-action">{{ s3ChipAttached ? 'Attached ✓' : 'Drag to Prompt ↗' }}</span>
                </div>
                <div class="cac-filename">Voltrep_Tokens.fig</div>
                <div class="cac-meta tabular">8pt Grid · #E2B878 · #34D399</div>
              </div>

              <!-- Context Card 2: A11y_Rules.json -->
              <div
                class="context-asset-card periph-blur-card"
                :style="{ opacity: (s3ContextReveal * 0.78).toFixed(3) }"
              >
                <div class="cac-top">
                  <span class="cac-badge mint">WCAG AA/AAA</span>
                  <span class="cac-action">Constraint</span>
                </div>
                <div class="cac-filename">A11y_Rules.json</div>
                <div class="cac-meta tabular">Contrast ≥ 14.8:1 · Focus Rings</div>
              </div>

              <!-- Context Card 3: UX_Telemetry -->
              <div
                class="context-asset-card periph-blur-card"
                :style="{ opacity: (s3ContextReveal * 0.78).toFixed(3) }"
              >
                <div class="cac-top">
                  <span class="cac-badge alabaster">USER TELEMETRY</span>
                  <span class="cac-action">Dataset</span>
                </div>
                <div class="cac-filename">UX_Telemetry</div>
                <div class="cac-meta tabular">-42% Friction · 98.4% Success</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Capsule-to-Equalizer Bar Wave Transition Bridge (13.95s – 15.22s) -->
        <div v-if="s34EqualizerBridge.visible" class="equalizer-wave-bridge" aria-hidden="true">
          <span
            v-for="bar in s34EqualizerBridge.bars"
            :key="bar.id"
            class="ewb-bar"
            :class="{ gold: bar.isGold, mint: !bar.isGold }"
            :style="{
              height: bar.height,
              opacity: bar.opacity,
            }"
          />
        </div>

        <!-- ===================================================================
             SCENE 04 (15.0s – 20.0s) — MOTION & FRONT-END
             Voltrep Live Logger + Portfolio Sliding Pill Navbar + Concentric Echo Loop Reset
             =================================================================== -->
        <div
          v-show="s4State.visible"
          class="scene-layer s4-layer"
          :style="{
            opacity: s4State.opacity,
            transform: s4State.transform,
          }"
        >
          <!-- Peripheral Physics Telemetry Header -->
          <div class="periph-topbar">
            <div class="periph-pill">
              <span class="pp-dot mint" />
              <span class="tabular">60 FPS · GPU COMPOSITING</span>
            </div>
            <div class="periph-pill">
              <span class="pp-dot gold" />
              <span class="tabular">cubic-bezier(0.16, 1, 0.3, 1)</span>
            </div>
          </div>

          <!-- Display Headline -->
          <div class="scene-head">
            <h2 class="display-title">
              <span class="t-mask">
                <span class="t-inner" :style="{ transform: `translate3d(0, ${s4TitleY}, 0)` }">
                  <span class="c-alabaster">MOTION &amp;</span>
                  <span class="c-gold">FRONT-END</span>
                </span>
              </span>
            </h2>
          </div>

          <!-- Concentric Expanding Pill Outline Echoes on Loop Reset (18.66s – 20.0s) -->
          <div class="echo-rings-layer" aria-hidden="true">
            <span
              v-for="echo in s4LoopEchoes"
              :key="echo.id"
              class="concentric-pill-echo"
              :style="{
                width: echo.width,
                height: echo.height,
                opacity: echo.opacity,
              }"
            />
          </div>

          <!-- Full-Viewport Spatial Workbench: Left Peripheral + Voltrep Live Logger + Portfolio Navbar/Case Study + Right Peripheral -->
          <div class="s4-spatial-grid">
            <aside class="periph-depth-card p-left">
              <div class="pdc-kicker">SPRING TELEMETRY</div>
              <div class="pdc-title">16.6ms Frame Lock</div>
              <svg viewBox="0 0 120 42" class="pdc-curve-svg">
                <path d="M4 36 C 24 6, 48 6, 116 6" fill="none" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" />
                <circle cx="34" cy="11" r="3.5" fill="#E2B878" />
              </svg>
              <div class="pdc-mono">Zero Layout Thrash</div>
            </aside>

            <!-- Left/Center Foreground: Voltrep Live Logger (#0E1015, rounded-2xl) -->
            <div class="voltrep-logger-card" :class="{ 'is-logged': s4SetLogged }">
              <div class="vlc-header">
                <span class="vlc-kicker">VOLTREP LIVE LOGGER</span>
                <span class="vlc-set tabular">SET 04 / 04</span>
              </div>
              <div class="vlc-exercise">Hack Squat</div>
              <div class="vlc-metrics tabular">120 kg × 6 reps</div>
              <div class="vlc-bars">
                <i class="done" /><i class="done" /><i class="done" /><i :class="{ done: s4SetLogged }" />
              </div>
              <div class="vlc-footer">
                <span class="vlc-rpe tabular">RPE 8.5 · Rest 120s</span>
                <button
                  ref="s4LogBtnRef"
                  type="button"
                  class="pill-cta"
                  :class="{
                    'is-hover': s4LogHover,
                    'is-pressed': s4LogPressed,
                    'is-flipped': s4SetLogged,
                  }"
                >
                  <span class="p-dot" />
                  <span>{{ s4SetLogged ? 'Set Logged ✓' : 'Log Set' }}</span>
                  <span v-if="s4LogRipple" class="btn-ripple" />
                </button>
              </div>
            </div>

            <!-- Right Foreground: Portfolio Sliding Pill Navbar & Voltrep Case Study Card -->
            <div class="portfolio-showcase-col">
              <!-- Elastic Sliding Pill Navbar (`Overview | Case Studies | Journey`) -->
              <div class="sliding-pill-navbar">
                <div
                  class="spn-indicator"
                  :class="{ 'at-cases': s4NavCaseStudiesActive }"
                />
                <span class="spn-tab" :class="{ active: !s4NavCaseStudiesActive }">Overview</span>
                <span class="spn-tab" :class="{ active: s4NavCaseStudiesActive }">Case Studies</span>
                <span class="spn-tab">Journey</span>
              </div>

              <!-- Voltrep Case Study Card -->
              <div class="case-study-card" :class="{ 'is-elevated': s4NavCaseStudiesActive }">
                <div class="csc-top">
                  <span class="csc-tag">PRODUCTION CASE STUDY</span>
                  <span class="csc-fps tabular">60 FPS · Semantic Code</span>
                </div>
                <div class="csc-title">Voltrep Case Study</div>
                <div class="csc-desc">Low-friction workout architecture with tactile 60fps micro-interactions.</div>
                <div class="csc-footer">
                  <span class="csc-a11y tabular">WCAG AA · Vue 3 + SVG</span>
                  <button
                    ref="s4PreviewBtnRef"
                    type="button"
                    class="pill-cta"
                    :class="{
                      'is-hover': s4PreviewHover,
                      'is-pressed': s4PreviewPressed,
                      'is-flipped': s4PreviewClicked,
                    }"
                  >
                    <span>▶ Preview System</span>
                    <span v-if="s4PreviewRipple" class="btn-ripple" />
                  </button>
                </div>
              </div>
            </div>

            <aside class="periph-depth-card p-right">
              <div class="pdc-kicker">WEB VITALS</div>
              <div class="pdc-big tabular c-mint">100</div>
              <div class="pdc-mono">Performance · A11y · SEO</div>
            </aside>
          </div>
        </div>

        <!-- ===================================================================
             PIXEL-ACCURATE DYNAMIC VECTOR CURSOR (`getBoundingClientRect()`)
             =================================================================== -->
        <div
          class="vids-cursor"
          :style="{
            opacity: stageCursor.opacity,
            transform: stageCursor.transform,
          }"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" width="23" height="23" fill="none">
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
.vids-hero {
  width: 100%;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.vids-stage {
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
  font-family: Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif;
}
@media (min-width: 768px) {
  .vids-stage {
    padding: 5.2rem 0 2.1rem;
  }
}

.tabular {
  font-variant-numeric: tabular-nums;
}

/* Ambient Radial Blooms & Precision Guides */
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
  animation: bloomDrift 15s ease-in-out infinite alternate;
}
.b-gold {
  width: 52vw;
  height: 52vw;
  max-width: 740px;
  max-height: 740px;
  top: 4%;
  left: 10%;
  opacity: 0.075;
  background: radial-gradient(circle, #E2B878 0%, transparent 68%);
}
.b-mint {
  width: 46vw;
  height: 46vw;
  max-width: 650px;
  max-height: 650px;
  bottom: 4%;
  right: 8%;
  opacity: 0.065;
  background: radial-gradient(circle, #34D399 0%, transparent 68%);
  animation-direction: alternate-reverse;
}
.b-alabaster {
  width: 40vw;
  height: 40vw;
  max-width: 560px;
  max-height: 560px;
  top: 28%;
  right: 24%;
  opacity: 0.045;
  background: radial-gradient(circle, #F5F5F7 0%, transparent 68%);
}
@keyframes bloomDrift {
  0% { transform: translate3d(-2%, -1%, 0) scale(0.96); }
  100% { transform: translate3d(2%, 2%, 0) scale(1.06); }
}

.precision-guides {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Viewport & Scene Layers */
.vids-viewport {
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
  .vids-viewport {
    padding: 0.7rem 2.25rem;
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
  will-change: transform, opacity;
}

/* Peripheral Top Bar & Pills */
.periph-topbar {
  width: 100%;
  max-width: 1180px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.heuristic-pills-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.periph-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.32rem 0.74rem;
  border-radius: 999px;
  background: rgba(15, 17, 23, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #E5E7EB;
}

.pp-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.pp-dot.gold {
  background: #E2B878;
  box-shadow: 0 0 8px rgba(226, 184, 120, 0.6);
}
.pp-dot.mint {
  background: #34D399;
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
}
.pp-dot.alabaster {
  background: #F5F5F7;
}

/* SCENE 01: Inline Pill + Vertical Word Carousel Opener */
.opener-headline-bar {
  display: flex;
  justify-content: center;
  width: 100%;
}

.inline-pill-title {
  margin: 0;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.28em;
  font-size: clamp(1.9rem, 5.1vw, 4.4rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.12;
  color: #F5F5F7;
}

.inline-sys-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.32em;
  padding: 0.14em 0.55em;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(24, 27, 36, 0.96) 0%, rgba(14, 16, 22, 0.96) 100%);
  border: 1.5px solid rgba(226, 184, 120, 0.55);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 10px 28px -8px rgba(226, 184, 120, 0.35);
  font-size: 0.52em;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #E2B878;
  vertical-align: middle;
}
.isp-plus {
  display: inline-grid;
  place-items: center;
  width: 1.35em;
  height: 1.35em;
  border-radius: 50%;
  background: rgba(226, 184, 120, 0.18);
  color: #F5F5F7;
  font-weight: 800;
}

.word-carousel-viewport {
  display: inline-block;
  height: 1.18em;
  overflow: hidden;
  vertical-align: bottom;
}
.word-carousel-track {
  display: flex;
  flex-direction: column;
  will-change: transform;
}
.wc-item {
  height: 1.18em;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.wc-item.muted {
  color: #9CA3AF;
}
.wc-item.gold {
  color: #E2B878;
}

/* Shared Display Titles for Scenes 02, 03, 04 */
.scene-head {
  text-align: center;
}
.display-title {
  margin: 0;
  font-size: clamp(1.9rem, 5.2vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.05;
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
.c-gold {
  color: #E2B878;
}
.c-mint {
  color: #34D399;
}

/* Spatial Grids & Peripheral Depth Cards */
.s1-spatial-grid,
.s2-spatial-grid {
  width: 100%;
  max-width: 1180px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  align-items: center;
}
@media (min-width: 1024px) {
  .s1-spatial-grid,
  .s2-spatial-grid {
    grid-template-columns: 220px 1fr 220px;
    gap: 1.15rem;
  }
}

.periph-depth-card {
  padding: 0.95rem 1.05rem;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(18, 20, 28, 0.88) 0%, rgba(11, 13, 18, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 20px 45px -20px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
  transform: scale(0.94);
  opacity: 0.86;
}
@media (max-width: 1023px) {
  .periph-depth-card {
    display: none;
  }
}

.pdc-kicker {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #9CA3AF;
}
.pdc-title {
  font-size: 0.96rem;
  font-weight: 700;
  color: #F5F5F7;
}
.pdc-big {
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: #F5F5F7;
}
.pdc-mono {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.66rem;
  color: #D1D5DB;
}
.pdc-chip {
  align-self: flex-start;
  padding: 0.16rem 0.55rem;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.14);
  border: 1px solid rgba(52, 211, 153, 0.4);
  color: #86EFAC;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.65rem;
  font-weight: 700;
}

.swatch-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.2rem;
}
.sw-row {
  display: grid;
  grid-template-columns: 14px auto 1fr;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.7rem;
}
.sw-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
.sw-circle.obs {
  background: #050507;
  box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.45);
}
.sw-circle.gold {
  background: #E2B878;
}
.sw-circle.mint {
  background: #34D399;
}
.sw-hex {
  font-family: var(--font-mono, ui-monospace, monospace);
  color: #F5F5F7;
}
.sw-name {
  color: #9CA3AF;
  text-align: right;
}

.mini-eq-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 26px;
  margin: 0.15rem 0;
}
.mini-eq-bars i {
  flex: 1;
  border-radius: 999px;
  background: linear-gradient(180deg, #86EFAC, #E2B878);
}

/* Center Figma Auto-Layout Frame */
.figma-canvas-card {
  position: relative;
  border-radius: 18px;
  background: linear-gradient(180deg, #141720 0%, #0D0F15 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 26px 60px -22px rgba(0, 0, 0, 0.88);
  overflow: hidden;
  transition: border-color 240ms ease;
}
.figma-canvas-card.is-validated {
  border-color: rgba(52, 211, 153, 0.55);
}

.fcc-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}
.fcc-dots {
  display: flex;
  gap: 6px;
}
.fcc-dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}
.fcc-frame-name {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.7rem;
  color: #D1D5DB;
}
.fcc-mode-chip {
  padding: 0.14rem 0.55rem;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.14);
  border: 1px solid rgba(226, 184, 120, 0.4);
  color: #E2B878;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.64rem;
  font-weight: 700;
}

.fcc-stage {
  position: relative;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.redline-h,
.redline-v {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.62rem;
  font-weight: 700;
  color: #E2B878;
  pointer-events: none;
}
.redline-h.rl-24 {
  position: absolute;
  left: 0;
  top: 50%;
  width: 24px;
  border-top: 1px dashed #E2B878;
  text-align: center;
}
.redline-h.rl-24 span {
  position: relative;
  top: -12px;
  font-size: 0.58rem;
}
.redline-v.rl-16 {
  display: inline-flex;
  align-items: center;
  align-self: center;
  gap: 6px;
  padding: 1px 8px;
  border-radius: 999px;
  background: rgba(226, 184, 120, 0.12);
  border: 1px dashed rgba(226, 184, 120, 0.45);
}

.mod-style-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 600px) {
  .mod-style-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.mod-tile {
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.22);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  transition: background 260ms ease, border 260ms ease, box-shadow 260ms ease;
}
.mod-tile.tile-live {
  background: rgba(20, 24, 34, 0.92);
  border: 1px solid rgba(226, 184, 120, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
.mt-top {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.62rem;
}
.mt-tag {
  color: #9CA3AF;
}
.mt-status {
  color: #34D399;
  font-weight: 700;
}
.mt-headline {
  font-size: 0.92rem;
  font-weight: 700;
  color: #F5F5F7;
}
.mt-sub {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.68rem;
  color: #D1D5DB;
}

.fcc-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding-top: 0.2rem;
}
.fcc-spec {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.68rem;
  color: #9CA3AF;
}

/* Multiplayer Live Cursors */
.peer-cursor {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  pointer-events: none;
  will-change: transform;
}
.pc-badge {
  padding: 1px 6px;
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.58rem;
  font-weight: 800;
  color: #050507;
}
.pc-badge.gold {
  background: #E2B878;
}
.pc-badge.mint {
  background: #34D399;
}
.pc-badge.alabaster {
  background: #F5F5F7;
}

/* Shared Interactive Pill CTAs */
.pill-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.58rem 1.15rem;
  border-radius: 999px;
  background: #E2B878;
  color: #050507;
  border: 1px solid #E2B878;
  font-family: Inter, system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 130ms ease, background 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.pill-cta.compact {
  padding: 0.45rem 0.92rem;
  font-size: 0.76rem;
}
.pill-cta.ghost {
  background: rgba(255, 255, 255, 0.08);
  color: #F5F5F7;
  border-color: rgba(255, 255, 255, 0.22);
}
.pill-cta.is-hover {
  transform: translate3d(0, -2px, 0);
  box-shadow: 0 0 24px rgba(226, 184, 120, 0.45);
}
.pill-cta.is-pressed {
  transform: scale(0.93);
}
.pill-cta.is-flipped {
  background: #34D399;
  border-color: #34D399;
  color: #04130C;
}

.p-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.btn-ripple {
  position: absolute;
  inset: -5px;
  border-radius: 999px;
  border: 2px solid #34D399;
  animation: rippleExpand 540ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  pointer-events: none;
}
@keyframes rippleExpand {
  0% { opacity: 0.75; transform: scale(0.95); }
  100% { opacity: 0; transform: scale(1.18); }
}

/* Capsule Wave Bridge (Scene 01 -> Scene 02) */
.capsule-wave-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 25;
  display: grid;
  place-items: center;
}
.cw-pill {
  position: absolute;
  width: 220px;
  height: 26px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(226, 184, 120, 0.35), rgba(52, 211, 153, 0.35));
  border: 1px solid rgba(226, 184, 120, 0.55);
  backdrop-filter: blur(8px);
}
.cw-pill.mint {
  border-color: rgba(52, 211, 153, 0.55);
}

/* SCENE 02: Staggered Dark-Glass UX Outline & Telemetry Stack */
.ux-outline-stack {
  width: 100%;
  margin: 0 auto;
  padding: 1rem 1.2rem;
  background: linear-gradient(180deg, rgba(20, 23, 32, 0.95) 0%, rgba(12, 14, 20, 0.96) 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 26px 60px -22px rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  transition: border-color 240ms ease;
}

.uos-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.68rem;
}
.uos-kicker {
  color: #9CA3AF;
  letter-spacing: 0.08em;
  font-weight: 700;
}
.uos-status {
  color: #34D399;
  font-weight: 700;
}

.uos-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  padding: 0.68rem 0.9rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.ur-left {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-align: left;
  flex: 1 1 240px;
}
.ur-index {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: rgba(226, 184, 120, 0.14);
  border: 1px solid rgba(226, 184, 120, 0.35);
  color: #E2B878;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.68rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ur-copy {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  flex: 1;
}
.ur-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: #F5F5F7;
}
.ur-sub {
  font-size: 0.72rem;
  color: #9CA3AF;
}

.ur-right {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.ur-spark {
  width: 78px;
  height: 24px;
}
.ur-metric {
  padding: 0.24rem 0.65rem;
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.72rem;
  font-weight: 700;
}
.ur-metric.mint {
  background: rgba(52, 211, 153, 0.14);
  border: 1px solid rgba(52, 211, 153, 0.38);
  color: #86EFAC;
}
.ur-metric.gold {
  background: rgba(226, 184, 120, 0.14);
  border: 1px solid rgba(226, 184, 120, 0.38);
  color: #E2B878;
}

.ur-progress-track {
  width: 100%;
  max-width: 180px;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.ur-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #E2B878, #34D399);
}

.journey-nodes-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.28rem;
}
.jn-chip {
  padding: 0.12rem 0.48rem;
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.64rem;
  font-weight: 600;
}
.jn-chip.ok {
  background: rgba(52, 211, 153, 0.14);
  border: 1px solid rgba(52, 211, 153, 0.4);
  color: #86EFAC;
}
.jn-chip.tangled {
  background: rgba(255, 255, 255, 0.06);
  border: 1px dashed rgba(255, 255, 255, 0.25);
  color: #9CA3AF;
}
.jn-arrow {
  color: #6B7280;
  font-size: 0.7rem;
}

.ur-actions {
  display: flex;
  align-items: center;
  gap: 0.48rem;
}

/* SCENE 03: CREATIVE AI (Macro Caret Typing + Drag-and-Drop Chip + Concentric Submit Echo) */
.s3-composer-stage {
  position: relative;
  width: 100%;
  max-width: 1020px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.15rem;
}

.s3-macro-camera {
  width: 100%;
  display: flex;
  justify-content: center;
  transform-origin: 38% 50%;
  will-change: transform;
}

.ai-prompt-pill {
  position: relative;
  z-index: 5;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem 0.75rem 1.25rem;
  background: #0F1117;
  border: 1.5px solid rgba(226, 184, 120, 0.55);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 0 36px rgba(226, 184, 120, 0.22),
    0 26px 60px -20px rgba(0, 0, 0, 0.88);
  transition: border-color 220ms ease, box-shadow 220ms ease;
}
.ai-prompt-pill.is-drop-ready {
  border-color: #34D399;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 42px rgba(52, 211, 153, 0.32);
}
.ai-prompt-pill.is-generating {
  justify-content: center;
  padding: 0.85rem 1.6rem;
  border-color: #34D399;
  box-shadow:
    0 0 45px rgba(52, 211, 153, 0.38),
    0 20px 50px -15px rgba(0, 0, 0, 0.85);
}

.app-input-area {
  flex: 1 1 260px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  text-align: left;
  min-width: 0;
}
.app-status-orb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #E2B878;
  box-shadow: 0 0 10px rgba(226, 184, 120, 0.8);
  flex-shrink: 0;
}

.attached-context-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.22rem 0.62rem;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.16);
  border: 1px solid rgba(52, 211, 153, 0.55);
  color: #86EFAC;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.72rem;
  font-weight: 700;
  animation: chipPopIn 280ms cubic-bezier(0.34, 1.45, 0.64, 1) forwards;
}
@keyframes chipPopIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.acc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34D399;
}

.app-typed-wrap {
  flex: 1 1 220px;
  font-size: clamp(0.82rem, 1.35vw, 0.96rem);
  line-height: 1.42;
  color: #F5F5F7;
}
.app-caret {
  display: inline-block;
  margin-left: 2px;
  color: #E2B878;
  font-weight: 800;
  animation: caretBlink 650ms steps(2, start) infinite;
}
@keyframes caretBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.submit-gen-btn {
  flex-shrink: 0;
}

.generating-capsule-body {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: #F5F5F7;
}
.gen-pulse-orb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #34D399;
  box-shadow: 0 0 12px #34D399;
}
.gen-bars {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 14px;
}
.gen-bars i {
  width: 3px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #34D399, #E2B878);
}

/* Concentric Expanding Pill Outline Echoes */
.echo-rings-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: grid;
  place-items: center;
  z-index: 1;
}
.concentric-pill-echo {
  position: absolute;
  border-radius: 999px;
  border: 1.8px solid #E2B878;
  box-shadow: 0 0 24px rgba(226, 184, 120, 0.25);
  pointer-events: none;
}

/* Peripheral Context Asset Cards (Scene 03) */
.s3-context-cards-row {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}
@media (min-width: 768px) {
  .s3-context-cards-row {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

.context-asset-card {
  padding: 0.8rem 1rem;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(20, 23, 32, 0.92) 0%, rgba(12, 14, 20, 0.94) 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.26rem;
  will-change: transform, opacity;
}
.periph-blur-card {
  filter: blur(0.6px);
  transform: scale(0.95);
}
@media (max-width: 767px) {
  .periph-blur-card {
    display: none;
  }
}
.cac-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.62rem;
}
.cac-badge {
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  font-weight: 700;
}
.cac-badge.gold {
  background: rgba(226, 184, 120, 0.16);
  color: #E2B878;
}
.cac-badge.mint {
  background: rgba(52, 211, 153, 0.16);
  color: #86EFAC;
}
.cac-badge.alabaster {
  background: rgba(255, 255, 255, 0.12);
  color: #F5F5F7;
}
.cac-action {
  color: #9CA3AF;
}
.cac-filename {
  font-size: 0.88rem;
  font-weight: 700;
  color: #F5F5F7;
}
.cac-meta {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.68rem;
  color: #D1D5DB;
}

/* Capsule-to-Equalizer Wave Bridge (Scene 03 -> Scene 04) */
.equalizer-wave-bridge {
  position: absolute;
  inset: 0;
  z-index: 28;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(5px, 1vw, 12px);
  padding: 0 2rem;
}
.ewb-bar {
  width: clamp(6px, 0.9vw, 11px);
  border-radius: 999px;
  will-change: height, opacity;
}
.ewb-bar.gold {
  background: linear-gradient(180deg, #E2B878, rgba(226, 184, 120, 0.25));
  box-shadow: 0 0 14px rgba(226, 184, 120, 0.45);
}
.ewb-bar.mint {
  background: linear-gradient(180deg, #34D399, rgba(52, 211, 153, 0.25));
  box-shadow: 0 0 14px rgba(52, 211, 153, 0.45);
}

/* SCENE 04: MOTION & FRONT-END (Voltrep Logger + Sliding Pill Navbar + Case Study) */
.s4-spatial-grid {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  align-items: stretch;
}
@media (min-width: 768px) {
  .s4-spatial-grid {
    grid-template-columns: 1fr 1.15fr;
  }
}
@media (min-width: 1120px) {
  .s4-spatial-grid {
    grid-template-columns: 195px 1fr 1.15fr 195px;
    gap: 1rem;
    align-items: center;
  }
}

.pdc-curve-svg {
  width: 100%;
  height: 36px;
}

.voltrep-logger-card,
.case-study-card {
  padding: 1.05rem 1.2rem;
  border-radius: 16px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 24px 55px -20px rgba(0, 0, 0, 0.86);
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.55rem;
  transition: border-color 240ms ease, transform 240ms ease;
}
.voltrep-logger-card.is-logged {
  border-color: rgba(52, 211, 153, 0.55);
}
.case-study-card.is-elevated {
  border-color: rgba(226, 184, 120, 0.55);
  transform: translate3d(0, -3px, 0);
}

.vlc-header,
.csc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.66rem;
}
.vlc-kicker,
.csc-tag {
  color: #9CA3AF;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.vlc-set {
  color: #E2B878;
  font-weight: 700;
}
.csc-fps {
  color: #34D399;
  font-weight: 700;
}

.vlc-exercise,
.csc-title {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #F5F5F7;
}
.vlc-metrics {
  font-size: 1.02rem;
  font-weight: 700;
  color: #34D399;
}
.vlc-bars {
  display: flex;
  gap: 6px;
}
.vlc-bars i {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  transition: background 240ms ease;
}
.vlc-bars i.done {
  background: linear-gradient(90deg, #E2B878, #34D399);
}

.vlc-footer,
.csc-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.25rem;
}
.vlc-rpe,
.csc-a11y {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.68rem;
  color: #9CA3AF;
}

.portfolio-showcase-col {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.sliding-pill-navbar {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 4px;
  border-radius: 999px;
  background: #0E1015;
  border: 1px solid rgba(255, 255, 255, 0.14);
}
.spn-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / 3);
  border-radius: 999px;
  background: #E2B878;
  transition: transform 380ms cubic-bezier(0.34, 1.4, 0.64, 1);
}
.spn-indicator.at-cases {
  transform: translate3d(100%, 0, 0);
}
.spn-tab {
  position: relative;
  z-index: 1;
  padding: 0.34rem 0.5rem;
  font-size: 0.74rem;
  font-weight: 700;
  color: #9CA3AF;
  text-align: center;
  transition: color 200ms ease;
}
.spn-tab.active {
  color: #050507;
}

.csc-desc {
  font-size: 0.8rem;
  line-height: 1.4;
  color: #D1D5DB;
}

/* Pixel-Accurate Dynamic Vector Cursor */
.vids-cursor {
  position: absolute;
  top: 0;
  left: 0;
  width: 23px;
  height: 23px;
  z-index: 50;
  pointer-events: none;
  transform-origin: 2px 2px;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.68));
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
  .app-caret,
  .btn-ripple {
    animation: none !important;
  }
}
</style>
