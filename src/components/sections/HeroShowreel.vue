<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'
import FigmaFrameBody from './FigmaFrameBody.vue'

// =============================================================================
// 18.0s SPATIAL CARD-CANVAS SHOWREEL  (4.5s per act, seamless loop)
// One rAF clock -> frame(t) is a PURE function of time (no state, no drift).
// - Camera pan (Act 1 -> 2), shape-morph shells (2 -> 3, 4 -> 1), macro zoom +
//   clip-path aperture (3 -> 4). Rounded containers morph width/height/radius only.
// - Cursor coordinates come from live getBoundingClientRect() every frame.
// - Zero 3D tilts, zero Google/Gemini marks, flat 2D depth via scale/opacity/blur.
// =============================================================================

const LOOP = 18
const PROMPT = 'Architect a low-friction workout logger with WCAG AA contrast, 8pt spatial rhythm, and 60fps micro-interactions.'
const rootRef = ref(null)
const vpRef = ref(null)
const figA = ref(null)

const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const prog = (t, a, b) => cl((t - a) / (b - a))
const eOut3 = (x) => 1 - Math.pow(1 - x, 3)
const eOut5 = (x) => 1 - Math.pow(1 - x, 5)
const eIn3 = (x) => x * x * x
const eIO3 = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const eSpring = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + Math.pow(2, -9 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) * 0.22)
const pulse = (t, a, b, c, d) => eIO3(prog(t, a, b)) * (1 - eIO3(prog(t, c, d)))
const bump = (d) => (d <= 0 || d > 0.7 ? 0 : Math.exp(-5 * d) * Math.sin(d * 22) * 0.13)

let R = {}
let vpW = 0
let vpH = 0
let vpRect = null
const zo = { x: 600, y: 300, cy: 300 }
const txt = new Map()

const T = (el, s) => { if (el && txt.get(el) !== s) { txt.set(el, s); el.textContent = s } }
const CL = (el, n, on) => { if (el) el.classList.toggle(n, !!on) }
const V = (el, on) => { if (el) el.style.visibility = on ? '' : 'hidden' }
const S = (el, x = 0, y = 0, s = 1, o = 1, b = 0) => {
  if (!el) return
  const st = el.style
  st.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${s.toFixed(4)})`
  st.opacity = o.toFixed(3)
  st.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none'
  st.visibility = o <= 0.001 ? 'hidden' : ''
}
const M = (el, k, ke = 0) => { if (el) el.style.transform = `translate3d(0,${((1 - k) * 105 - ke * 105).toFixed(2)}%,0)` }
const rel = (el) => {
  const r = el.getBoundingClientRect()
  return { x: r.left - vpRect.left, y: r.top - vpRect.top, w: r.width, h: r.height, cx: r.left - vpRect.left + r.width / 2, cy: r.top - vpRect.top + r.height / 2 }
}
// Depth-of-field: k=0 peripheral (0.86 / 0.42 / blur 3.5), k=1 focus (1 / 1 / 0)
const depth = (el, x, y, appear, k) => S(el, x, y + (1 - appear) * 22, 0.86 + 0.14 * k, appear * (0.42 + 0.58 * k), 3.5 * (1 - k))

// Button state machine (pure function of t)
const bt = (el, lblEl, t, o) => {
  if (!el) return
  const flipped = t >= o.f && t < o.e
  CL(el, 'flipped', flipped)
  CL(el, 'hover', t >= o.h && t < o.hEnd)
  T(lblEl, flipped ? o.on : o.off)
  const lift = -2 * (eOut3(prog(t, o.h, o.h + 0.15)) - eOut3(prog(t, o.hEnd, o.hEnd + 0.2)))
  const press = t >= o.c && t < o.c + 0.11 ? 0.93 : 1 + (flipped ? bump(t - o.f) : 0)
  el.style.transform = `translate3d(0,${lift.toFixed(2)}px,0) scale(${press.toFixed(4)})`
}

// Cursor choreography ---------------------------------------------------------
const CLICKS = [2.9, 7.2, 9.8, 11.9, 15.0, 16.9]
const A1 = { el: 'a1b' }
const A2 = { el: 'a2b' }
const CMP = { el: 'cmp', ox: 0.2 }
const GEN = { el: 'gen' }
const A4L = { el: 'a4b' }
const A4I = { el: 'a4i' }
const off = (r, dx, dy) => ({ ...r, dx, dy })
const SEGS = [
  { a: 1.8, b: 2.4, f: off(A1, 300, 240), t: off(A1, 70, 55), in: 1, ease: eOut3 },
  { a: 2.4, b: 2.82, f: off(A1, 70, 55), t: A1, arc: 26 },
  { a: 2.82, b: 3.35, f: A1, t: A1 },
  { a: 3.35, b: 3.62, f: A1, t: off(A1, 80, 60), out: 1 },

  { a: 6.0, b: 6.55, f: off(A2, 260, -190), t: off(A2, 70, 55), in: 1, ease: eOut3 },
  { a: 6.55, b: 6.97, f: off(A2, 70, 55), t: A2, arc: 26 },
  { a: 6.97, b: 7.75, f: A2, t: A2 },
  { a: 7.75, b: 8.0, f: A2, t: off(A2, 80, 60), out: 1 },

  { a: 9.2, b: 9.8, f: { fx: 0.16, fy: 1.05 }, t: CMP, in: 1, ease: eOut3, arc: 40 },
  { a: 9.8, b: 11.45, f: CMP, t: CMP },
  { a: 11.45, b: 11.88, f: CMP, t: GEN, arc: 30 },
  { a: 11.88, b: 12.45, f: GEN, t: GEN },
  { a: 12.45, b: 12.65, f: GEN, t: off(GEN, 60, 50), out: 1 },

  { a: 14.1, b: 14.5, f: off(A4L, 280, 200), t: off(A4L, 70, 55), in: 1, ease: eOut3 },
  { a: 14.5, b: 14.93, f: off(A4L, 70, 55), t: A4L, arc: 26 },
  { a: 14.93, b: 16.3, f: A4L, t: A4L },
  { a: 16.3, b: 16.72, f: A4L, t: A4I, arc: 30 },
  { a: 16.72, b: 17.15, f: A4I, t: A4I },
  { a: 17.15, b: 17.4, f: A4I, t: off(A4I, 70, 50), out: 1 },
]
const P = (r) => {
  if (!r.el) return { x: r.fx * vpW, y: r.fy * vpH }
  const q = rel(R[r.el])
  return { x: q.x + q.w * (r.ox ?? 0.5) + (r.dx || 0), y: q.y + q.h * (r.oy ?? 0.5) + (r.dy || 0) }
}
const cursor = (t) => {
  for (const s of SEGS) {
    if (t >= s.a && t < s.b) {
      const k = (t - s.a) / (s.b - s.a)
      const e = (s.ease || eIO3)(k)
      const f = P(s.f)
      const g = P(s.t)
      let x = f.x + (g.x - f.x) * e
      let y = f.y + (g.y - f.y) * e
      if (s.arc) {
        const dx = g.x - f.x
        const dy = g.y - f.y
        const len = Math.hypot(dx, dy) || 1
        x += (-dy / len) * s.arc * Math.sin(Math.PI * k)
        y += (dx / len) * s.arc * Math.sin(Math.PI * k)
      }
      return { x, y, o: s.in ? k : s.out ? 1 - k : 1 }
    }
  }
  return null
}

// Journey graph (Act 02) ------------------------------------------------------
const TAN = [[14, 72], [34, 24], [52, 80], [72, 22], [88, 64]]
const CLEAN = [[17, 50], [33, 50], [50, 50], [67, 50], [83, 50]]
const TAN_ORDER = [0, 3, 1, 4, 2]
const TAN_LBL = ['Land', 'Browse', 'Filter', 'Retry', 'Pay']
const NEW_LBL = { 0: 'Discover', 2: 'Validate', 4: 'Ship' }
const lerp = (a, b, k) => a + (b - a) * k

function frame(t) {
  const vp = vpRef.value
  if (!vp || !R.world) return
  vpW = vp.clientWidth
  vpH = vp.clientHeight
  vpRect = vp.getBoundingClientRect()
  const D = vpW

  // ---- CAMERA --------------------------------------------------------------
  const panK = t >= 17.5 ? 0 : eIO3(prog(t, 3.6, 4.5))
  const camX = -D * panK
  R.world.style.transform = `translate3d(${camX.toFixed(2)}px,0,0)`
  V(R.act1, t < 4.6 || t >= 17.75)
  V(R.act2, t >= 3.4 && t < 9.05)
  V(R.act3, t >= 8.0 && t < 13.6)
  V(R.act4, t >= 12.6 && t < 17.6)

  // ---- MACRO ZOOM (Act 03) -------------------------------------------------
  let z = 1
  if (t >= 12 && t < 13.5) z = t < 12.6 ? 1 + 0.42 * eIO3(prog(t, 12, 12.6)) : 1.42 - 0.42 * eIO3(prog(t, 12.6, 13.5))
  if (t >= 9.2 && t < 13.6) {
    R.zoomer.style.transform = 'none'
    const g = rel(R.gen)
    const c = rel(R.chips)
    zo.x = g.cx; zo.y = g.cy; zo.cy = c.cy
  }
  R.zoomer.style.transformOrigin = `${zo.x}px ${zo.y}px`
  R.zoomer.style.transform = z === 1 ? 'none' : `scale(${z.toFixed(4)})`

  // =========================================================================
  // ACT 01 · UX/UI DESIGN (0.0 – 4.5)
  // =========================================================================
  const a1on = t < 4.6
  M(R.t1a, a1on ? eOut5(prog(t, 0, 0.55)) : 0)
  M(R.t1b, a1on ? eOut5(prog(t, 0.08, 0.63)) : 0)
  R.a1cl.style.transform = `scale(${(1 + 0.14 * (1 - eOut5(prog(t, 0, 0.9)))).toFixed(4)})`
  S(R.a1badge, 0, 0, 0.6 + 0.4 * eSpring(prog(t, 0.35, 0.95)), a1on ? prog(t, 0.35, 0.6) : 0)
  const par1 = -panK * D * 0.1
  const sideA = a1on ? eOut5(prog(t, 0.3, 1.0)) : 0
  depth(R.a1L, -40 * (1 - sideA) + par1, 0, sideA, pulse(t, 1.2, 1.6, 2.0, 2.4))
  depth(R.a1R, 40 * (1 - sideA) + par1, 0, sideA, pulse(t, 3.05, 3.35, 3.7, 4.2))
  ;['a1t1', 'a1t2', 'a1t3'].forEach((k, i) => {
    const a = a1on ? eOut5(prog(t, 0.7 + i * 0.15, 1.3 + i * 0.15)) : 0
    S(R[k], par1 * 1.4, (1 - a) * 12, 0.9 + 0.1 * a, a)
  })
  R.a1frame.style.opacity = t < 4.6 ? '1' : t >= 17.75 ? prog(t, 17.75, 18).toFixed(3) : '0'
  R.a1frame.style.setProperty('--rl', a1on ? eOut3(prog(t, 1.1, 1.7)).toFixed(3) : '0')
  bt(R.a1b, R.a1bL, t, { h: 2.72, hEnd: 3.4, c: 2.9, f: 3.0, e: 4.6, off: 'Validate Flow →', on: 'Validated ✓' })

  // =========================================================================
  // ACT 02 · USER RESEARCH (4.5 – 9.0)
  // =========================================================================
  const kt = eOut5(prog(t, 4.3, 4.85))
  const ke = eIn3(prog(t, 8.1, 8.5))
  M(R.t2a, kt, ke)
  M(R.t2b, eOut5(prog(t, 4.38, 4.93)), ke)
  R.a2cl.style.transform = `scale(${(1 + 0.14 * (1 - eOut5(prog(t, 4.3, 5.2)))).toFixed(4)})`
  S(R.a2badge, 0, 0, 0.6 + 0.4 * eSpring(prog(t, 4.75, 5.3)), prog(t, 4.75, 5.0) * (1 - ke))
  T(R.a2val, `${(98.4 * eOut3(prog(t, 5.0, 6.4))).toFixed(1)}%`)
  ;['a2c0', 'a2c1', 'a2c2'].forEach((k, i) => {
    const a = eOut5(prog(t, 4.8 + i * 0.1, 5.4 + i * 0.1))
    S(R[k], 0, (1 - a) * 14 - ke * 10, 1, a * (1 - ke))
  })
  const s1 = eIO3(prog(t, 5.95, 6.5))
  const s2 = eIO3(prog(t, 6.5, 6.95))
  const foc = [1 - s1, s1 - s2, s2]
  // carousel track offset (centers focused card when the track is wider than its container)
  const cw = R.c1.offsetWidth
  const gap = 20
  const total = 3 * cw + 2 * gap
  const cwid = R.car.clientWidth
  const fi = s1 + s2
  const trk = total <= cwid + 1 ? 0 : cwid / 2 - (fi * (cw + gap) + cw / 2)
  R.trk.style.transform = `translate3d(${trk.toFixed(2)}px,0,0)`
  ;['c1', 'c2', 'c3'].forEach((k, i) => {
    const a = eOut5(prog(t, 4.55 + i * 0.1, 5.3 + i * 0.1))
    let x = 180 * (1 - a)
    let o = a
    if (i < 2) { x -= eIn3(prog(t, 8.1, 8.8)) * D * 1.3 }
    if (i === 2 && t >= 8.08) o = 0
    S(R[k], x, 0, 0.94 + 0.06 * foc[i], o * (0.74 + 0.26 * foc[i]))
  })
  // card 1 · friction
  const f1 = eOut3(prog(t, 5.3, 6.3))
  T(R.c1v, `-${Math.round(42 * f1)}%`)
  R.c1p.style.strokeDashoffset = (1 - f1).toFixed(3)
  // card 2 · completion + SUS
  const f2 = eOut3(prog(t, 5.95, 6.9))
  T(R.c2v, `${(98.4 * f2).toFixed(1)}%`)
  T(R.c2s, `${Math.round(91 * f2)}/100`)
  R.c2f.style.transform = `scaleX(${(0.91 * f2).toFixed(4)})`
  // card 3 · journey (5 tangled nodes -> 3 clean)
  const sk = eIO3(prog(t, 7.3, 7.95))
  const foot = 1 - prog(t, 7.85, 8.08)
  R.c3h.style.opacity = foot.toFixed(3)
  R.a2b.style.opacity = foot.toFixed(3)
  T(R.c3hv, sk > 0.5 ? '3 steps · ergonomic' : '5 steps · tangled')
  const pos = []
  for (let i = 0; i < 5; i++) {
    const clean = i % 2 === 0
    const x = lerp(TAN[i][0], CLEAN[i][0], sk)
    const y = lerp(TAN[i][1], CLEAN[i][1], sk)
    pos.push([x, y])
    const el = R[`n${i}`]
    el.style.left = `${x.toFixed(2)}%`
    el.style.top = `${y.toFixed(2)}%`
    el.style.transform = `translate(-50%,-50%) scale(${(clean ? 1 : 1 - sk).toFixed(3)})`
    el.style.opacity = (clean ? 1 : 1 - Math.min(1, sk * 1.5)).toFixed(3)
    T(el, clean && sk > 0.5 ? NEW_LBL[i] : TAN_LBL[i])
    CL(el, 'ok', clean && sk > 0.5)
  }
  R.pTan.setAttribute('d', TAN_ORDER.map((n, i) => `${i ? 'L' : 'M'}${pos[n][0].toFixed(2)} ${pos[n][1].toFixed(2)}`).join(' '))
  R.pTan.style.opacity = ((1 - sk) * foot).toFixed(3)
  R.pClean.setAttribute('d', `M${pos[0][0].toFixed(2)} ${pos[0][1].toFixed(2)} L${pos[2][0].toFixed(2)} ${pos[2][1].toFixed(2)} L${pos[4][0].toFixed(2)} ${pos[4][1].toFixed(2)}`)
  R.pClean.style.opacity = sk.toFixed(3)
  bt(R.a2b, R.a2bL, t, { h: 6.97, hEnd: 7.8, c: 7.2, f: 7.3, e: 8.2, off: 'Simplify Flow', on: 'Simplified ✓' })

  // ---- SHELL A · journey nodes -> AI command bar (8.1 – 9.0) -----------------
  if (t >= 8.05 && t < 9.02) {
    const k = eIO3(prog(t, 8.1, 8.95))
    const a = rel(R.c3)
    const b = rel(R.cmp)
    const st = R.shA.style
    st.visibility = 'visible'
    st.left = `${lerp(a.x, b.x, k).toFixed(2)}px`
    st.top = `${lerp(a.y, b.y, k).toFixed(2)}px`
    st.width = `${lerp(a.w, b.w, k).toFixed(2)}px`
    st.height = `${lerp(a.h, b.h, k).toFixed(2)}px`
    st.borderRadius = `${lerp(16, 32, k).toFixed(2)}px`
    R.shAin.style.opacity = (1 - prog(k, 0.45, 0.8)).toFixed(3)
  } else if (R.shA) R.shA.style.visibility = 'hidden'

  // =========================================================================
  // ACT 03 · CREATIVE AI (9.0 – 13.5)
  // =========================================================================
  const a3on = t >= 9.0 && t < 13.6
  M(R.t3a, a3on ? eOut5(prog(t, 9.0, 9.55)) : 0)
  M(R.t3b, a3on ? eOut5(prog(t, 9.08, 9.63)) : 0)
  R.a3cl.style.transform = `scale(${(1 + 0.14 * (1 - eOut5(prog(t, 9.0, 9.9)))).toFixed(4)})`
  S(R.a3badge, 0, 0, 0.6 + 0.4 * eSpring(prog(t, 9.3, 9.85)), a3on ? prog(t, 9.3, 9.55) : 0)
  S(R.cmp, 0, 0, 1, t >= 13.6 ? 0 : prog(t, 8.75, 9.0))
  const fo = eOut3(prog(t, 9.8, 10.1))
  R.cmp.style.setProperty('--fo', fo.toFixed(3))
  const n = Math.floor(PROMPT.length * prog(t, 10.0, 11.7))
  T(R.typed, PROMPT.slice(0, n))
  const typing = t > 10.0 && t < 11.75
  const caretOn = t >= 9.8 && t < 12.1 && (typing || Math.floor(t * 2.2) % 2 === 0)
  R.caret.style.opacity = caretOn ? '1' : '0'
  R.ph.style.opacity = (1 - prog(t, 10.0, 10.12)).toFixed(3)
  ;['cp1', 'cp2', 'cp3'].forEach((k, i) => {
    const ap = a3on ? eOut5(prog(t, 9.3 + i * 0.1, 9.9 + i * 0.1)) : 0
    depth(R[k], 0, 0, ap, pulse(t, 10.3 + i * 0.6, 10.55 + i * 0.6, 11.1 + i * 0.6, 11.5 + i * 0.6))
  })
  bt(R.gen, R.genL, t, { h: 11.7, hEnd: 12.5, c: 11.9, f: 12.0, e: 13.6, off: '↑ Generate', on: 'Generated ✓' })

  // =========================================================================
  // ACT 04 · MOTION & FRONT-END (13.5 – 18.0)
  // =========================================================================
  const e4 = eIn3(prog(t, 17.1, 17.5))
  const a4on = t >= 13.5 && t < 17.6
  M(R.t4a, a4on ? eOut5(prog(t, 13.5, 14.05)) : 0, e4)
  M(R.t4b, a4on ? eOut5(prog(t, 13.58, 14.13)) : 0, e4)
  R.a4cl.style.transform = `scale(${(1 + 0.14 * (1 - eOut5(prog(t, 13.5, 14.4)))).toFixed(4)})`
  S(R.a4badge, 0, 0, (0.6 + 0.4 * eSpring(prog(t, 13.8, 14.3))) * (1 + 0.04 * Math.sin(t * 5)), a4on ? prog(t, 13.8, 14.05) * (1 - e4) : 0)
  // filter chips reveal inside the aperture (12.7 – 13.2)
  const ec = eOut5(prog(t, 12.7, 13.2))
  ;['ch0', 'ch1', 'ch2'].forEach((k, i) => S(R[k], (i - 1) * 90 * (1 - ec), 0, 1, ec * (1 - e4), e4 * 6))
  const ap4 = (d) => eOut5(prog(t, 13.68 + d, 14.4 + d))
  const exit4 = (el, x, y, a, k) => {
    S(el, x, y + (1 - a) * 24 - e4 * 10, 1, a * (1 - e4), e4 * 6 + 0)
  }
  void exit4
  S(R.a4V, 0, (1 - ap4(0)) * 24 - e4 * 10, 1, ap4(0) * (1 - e4), e4 * 6)
  S(R.a4R, 0, (1 - ap4(0.1)) * 24 - e4 * 10, 1, ap4(0.1) * (1 - e4), e4 * 6)
  depth(R.a4L, -30 * (1 - ap4(0.2)), -e4 * 10, ap4(0.2) * (1 - e4), pulse(t, 14.6, 14.9, 15.3, 15.7))
  depth(R.a4P, 30 * (1 - ap4(0.3)), -e4 * 10, ap4(0.3) * (1 - e4), pulse(t, 16.0, 16.3, 16.7, 17.0))
  // Voltrep
  bt(R.a4b, R.a4bL, t, { h: 14.93, hEnd: 16.4, c: 15.0, f: 15.05, e: 17.6, off: 'Log Set', on: 'Set Logged ✓' })
  CL(R.dot4, 'on', t >= 15.05 && t < 17.6)
  // nav pill + case card
  const nk = eSpring(prog(t, 15.6, 16.2))
  const t0 = R.tab0
  const t1 = R.tab1
  R.ind.style.transform = `translate3d(${lerp(t0.offsetLeft, t1.offsetLeft, nk).toFixed(2)}px,0,0)`
  R.ind.style.width = `${Math.max(0, lerp(t0.offsetWidth, t1.offsetWidth, nk)).toFixed(2)}px`
  CL(t0, 'on', nk < 0.5)
  CL(t1, 'on', nk >= 0.5)
  const el4 = eOut3(prog(t, 15.9, 16.4))
  R.a4case.style.transform = `translate3d(0,${(-6 * el4).toFixed(2)}px,0)`
  R.a4case.style.opacity = t >= 17.1 ? '0' : '1'
  R.a4case.style.setProperty('--el', el4.toFixed(3))
  const ip = eSpring(prog(t, 16.0, 16.35))
  R.a4i.style.opacity = prog(t, 16.0, 16.15).toFixed(3)
  const press = t >= 16.9 && t < 17.01 ? 0.93 : 1
  R.a4i.style.transform = `scale(${((0.8 + 0.2 * ip) * press).toFixed(4)})`
  CL(R.a4i, 'hover', t >= 16.72 && t < 17.1)

  // ---- SHELL B · case-study card -> Figma frame (17.1 – 18.0) ----------------
  if (t >= 17.1) {
    const k = eIO3(prog(t, 17.1, 18.0))
    const a = rel(R.a4case)
    const b = rel(R.a1frame)
    const fx = a.x - (camX + D) // case card in camera(-D) coords
    const tx = b.x - camX // frame in camera(0) coords
    const st = R.shB.style
    st.visibility = t < 18 ? 'visible' : 'hidden'
    st.left = `${lerp(fx, tx, k).toFixed(2)}px`
    st.top = `${lerp(a.y, b.y, k).toFixed(2)}px`
    st.width = `${lerp(a.w, b.w, k).toFixed(2)}px`
    st.height = `${lerp(a.h, b.h, k).toFixed(2)}px`
    st.borderRadius = '16px'
    R.shBcase.style.opacity = (1 - prog(k, 0.15, 0.5)).toFixed(3)
    R.shBfig.style.opacity = prog(k, 0.5, 0.85).toFixed(3)
  } else R.shB.style.visibility = 'hidden'

  // =========================================================================
  // CURSOR (live getBoundingClientRect targets) + click ripple
  // =========================================================================
  const c = cursor(t)
  if (c) {
    const pressed = CLICKS.some((k) => t >= k && t < k + 0.11)
    R.cur.style.opacity = c.o.toFixed(3)
    R.cur.style.transform = `translate3d(${(c.x - 3).toFixed(2)}px,${(c.y - 2).toFixed(2)}px,0) scale(${pressed ? 0.93 : 1})`
    const rk = CLICKS.find((k) => t >= k + 0.05 && t < k + 0.7)
    if (rk !== undefined) {
      const e = eOut3((t - rk - 0.05) / 0.65)
      R.rip.style.opacity = (0.45 * (1 - e)).toFixed(3)
      R.rip.style.transform = `translate3d(${c.x.toFixed(2)}px,${c.y.toFixed(2)}px,0) scale(${(0.3 + 2.3 * e).toFixed(3)})`
    } else R.rip.style.opacity = '0'
  } else {
    R.cur.style.opacity = '0'
    R.rip.style.opacity = '0'
  }
}

// ---- Engine ------------------------------------------------------------------
let raf = null
let clock = 0
let prev = null
let running = true
let frozen = false
let io = null

const tick = (ts) => {
  if (prev !== null && running && !frozen) clock = (clock + Math.min(0.1, (ts - prev) / 1000)) % LOOP
  prev = ts
  frame(clock)
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  R = {}
  rootRef.value.querySelectorAll('[data-r]').forEach((el) => { R[el.dataset.r] = el })
  R.a1b = figA.value.btn
  R.a1bL = R.a1b.querySelector('.lbl')
  ;['a2b', 'gen', 'a4b', 'a4i'].forEach((k) => { R[`${k}L`] = R[k].querySelector('.lbl') })
  const q = new URLSearchParams(window.location.search).get('t')
  if (q !== null && !Number.isNaN(Number(q))) {
    frozen = true
    clock = Number(q)
  } else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    frozen = true
    clock = 1.7
  } else {
    clock = 0.02
  }
  io = new IntersectionObserver(([e]) => { running = e.isIntersecting }, { threshold: 0 })
  io.observe(rootRef.value)
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (io) io.disconnect()
})
</script>

<template>
  <section ref="rootRef" class="exp-hero" aria-label="UX/UI Design, User Research, Creative AI and Front-End showreel">
    <div class="exp-stage">
      <div class="ambient" aria-hidden="true"><i class="bl g" /><i class="bl a" /><i class="bl e" /></div>
      <p class="sr-only">Showreel: UX/UI Design, User Research, Creative AI, and Motion &amp; Front-End work by Samuel Tavonatti.</p>

      <div ref="vpRef" class="vp" aria-hidden="true">
        <div class="zoomer" data-r="zoomer">
          <div class="world" data-r="world">
            <!-- ================= ACT 01 · UX/UI DESIGN ================= -->
            <div class="act a1" data-r="act1">
              <div class="col">
                <div class="title-wrap" data-r="a1cl">
                  <div class="ttl"><span class="mask"><span class="mi" data-r="t1a">UX/UI</span></span><span class="mask"><span class="mi gold" data-r="t1b">DESIGN</span></span></div>
                  <span class="sbadge" data-r="a1badge"><i class="dot" />Figma · 8pt</span>
                </div>
                <div class="row">
                  <div class="card side" data-r="a1L">
                    <div class="lab">Color Tokens</div>
                    <div class="sw"><i style="background:#050507;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)" /><span>#050507</span><em>Obsidian</em></div>
                    <div class="sw"><i style="background:#E2B878" /><span>#E2B878</span><em>Champagne</em></div>
                    <div class="sw"><i style="background:#34D399" /><span>#34D399</span><em>Emerald</em></div>
                  </div>
                  <div class="card frame" data-r="a1frame"><FigmaFrameBody ref="figA" /></div>
                  <div class="card side" data-r="a1R">
                    <div class="lab">Contrast Ratio</div>
                    <div class="big">14.8:1</div>
                    <span class="chip gold-chip">WCAG AAA</span>
                    <div class="bar"><i style="width:94%" /></div>
                  </div>
                  <span class="tag t-a" data-r="a1t1"><span class="fl">8pt Grid</span></span>
                  <span class="tag t-b" data-r="a1t2"><span class="fl">Auto Layout</span></span>
                  <span class="tag t-c" data-r="a1t3"><span class="fl">Zero Clutter</span></span>
                </div>
              </div>
            </div>

            <!-- ================= ACT 02 · USER RESEARCH ================= -->
            <div class="act a2" data-r="act2">
              <div class="col">
                <div class="title-wrap" data-r="a2cl">
                  <div class="ttl"><span class="mask"><span class="mi" data-r="t2a">USER</span></span><span class="mask"><span class="mi gold" data-r="t2b">RESEARCH</span></span></div>
                  <span class="sbadge beside" data-r="a2badge"><i class="live" /><span data-r="a2val">0.0%</span></span>
                </div>
                <div class="chips">
                  <span class="chip" data-r="a2c0">Cognitive Ergonomics</span>
                  <span class="chip" data-r="a2c1">Heuristic Audit</span>
                  <span class="chip" data-r="a2c2">Task Flow</span>
                </div>
                <div class="carousel" data-r="car">
                  <div class="track" data-r="trk">
                    <div class="card rc" data-r="c1">
                      <div class="lab">Cognitive Friction</div>
                      <div class="big num" data-r="c1v">-0%</div>
                      <svg class="trend" viewBox="0 0 200 56" preserveAspectRatio="none"><path data-r="c1p" d="M2 8 C 40 10, 60 30, 100 32 S 160 46, 198 50" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" /></svg>
                      <div class="cap">vs. baseline checkout flow</div>
                    </div>
                    <div class="card rc" data-r="c2">
                      <div class="lab">Task Completion</div>
                      <div class="big num" data-r="c2v">0.0%</div>
                      <div class="sus"><span>SUS Score</span><b class="num" data-r="c2s">0/100</b></div>
                      <div class="bar"><i data-r="c2f" style="width:100%;transform:scaleX(0);transform-origin:left" /></div>
                      <div class="cap">n = 48 moderated sessions</div>
                    </div>
                    <div class="card rc" data-r="c3">
                      <div class="rc-h" data-r="c3h"><span class="lab">User Journey</span><span class="cap" data-r="c3hv">5 steps · tangled</span></div>
                      <div class="nodes">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path data-r="pTan" d="" />
                          <path data-r="pClean" class="clean" d="" />
                        </svg>
                        <span class="nd" data-r="n0">Land</span><span class="nd" data-r="n1">Browse</span><span class="nd" data-r="n2">Filter</span><span class="nd" data-r="n3">Retry</span><span class="nd" data-r="n4">Pay</span>
                      </div>
                      <div class="pill-btn" data-r="a2b"><span class="lbl">Simplify Flow</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= ACT 03 · CREATIVE AI ================= -->
            <div class="act a3" data-r="act3">
              <div class="col">
                <div class="title-wrap" data-r="a3cl">
                  <div class="ttl"><span class="mask"><span class="mi" data-r="t3a">CREATIVE</span></span><span class="mask"><span class="mi gold" data-r="t3b">AI</span></span></div>
                  <span class="sbadge" data-r="a3badge"><i class="dot" />System Prompt</span>
                </div>
                <div class="cmp-wrap">
                  <div class="composer" data-r="cmp">
                    <i class="spk" />
                    <div class="cmp-text">
                      <span class="ph" data-r="ph">Describe the interface you want to build…</span>
                      <span class="sizer">Architect a low-friction workout logger with WCAG AA contrast, 8pt spatial rhythm, and 60fps micro-interactions.</span>
                      <span class="typed"><span data-r="typed" /><i class="caret" data-r="caret" /></span>
                    </div>
                    <div class="pill-btn gen" data-r="gen"><span class="lbl">↑ Generate</span></div>
                  </div>
                  <div class="ctx-row">
                    <span class="chip cp cp1" data-r="cp1">Design System v2</span>
                    <span class="chip cp cp2" data-r="cp2">A11y Constraints</span>
                    <span class="chip cp cp3" data-r="cp3">User Telemetry</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= ACT 04 · MOTION & FRONT-END ================= -->
            <div class="act a4" data-r="act4">
              <div class="col">
                <div class="title-wrap" data-r="a4cl">
                  <div class="ttl"><span class="mask"><span class="mi" data-r="t4a">MOTION &amp;</span></span><span class="mask"><span class="mi gold" data-r="t4b">FRONT-END</span></span></div>
                  <span class="sbadge" data-r="a4badge"><i class="live" />60 FPS</span>
                </div>
                <div class="chips" data-r="chips">
                  <span class="chip on" data-r="ch0">Production UI</span>
                  <span class="chip on" data-r="ch1">60fps Physics</span>
                  <span class="chip on" data-r="ch2">Voltrep</span>
                </div>
                <div class="row r4">
                  <div class="card side" data-r="a4L">
                    <div class="lab">Design Tokens</div>
                    <div class="code">--gold: #E2B878;<br />--ok: #34D399;<br />--space: 8px;<br />--ease: cubic-bezier(.22,1,.36,1);</div>
                  </div>
                  <div class="card vol" data-r="a4V">
                    <div class="vol-h"><span class="lab">Voltrep · Workout</span><span class="cap">Set 4 of 4</span></div>
                    <div class="ex">Hack Squat</div>
                    <div class="stat num">120 kg × 6 reps</div>
                    <div class="dots"><i class="on" /><i class="on" /><i class="on" /><i data-r="dot4" /></div>
                    <div class="pill-btn" data-r="a4b"><span class="lbl">Log Set</span></div>
                  </div>
                  <div class="rcol" data-r="a4R">
                    <div class="nav" data-r="nav"><i class="ind" data-r="ind" /><span class="tab on" data-r="tab0">Overview</span><span class="tab" data-r="tab1">Case Studies</span><span class="tab" data-r="tab2">Journey</span></div>
                    <div class="card case" data-r="a4case">
                      <div class="cs-h">Voltrep Case Study</div>
                      <div class="cs-m">60 FPS · WCAG AA · Semantic Code</div>
                      <div class="pill-btn ghost" data-r="a4i"><span class="lbl">Inspect System ↗</span></div>
                    </div>
                  </div>
                  <div class="card side" data-r="a4P">
                    <div class="lab">Core Web Vitals</div>
                    <div class="big num">100</div>
                    <div class="cap">Performance · A11y · SEO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overlay: morph shells, ripple, cursor -->
        <div class="overlay">
          <div class="card shell" data-r="shA">
            <div class="sh-a" data-r="shAin"><span class="nd ok st">Discover</span><span class="nd ok st">Validate</span><span class="nd ok st">Ship</span></div>
          </div>
          <div class="card shell" data-r="shB">
            <div class="sh-case" data-r="shBcase">
              <div class="case">
                <div class="cs-h">Voltrep Case Study</div>
                <div class="cs-m">60 FPS · WCAG AA · Semantic Code</div>
                <div class="pill-btn ghost hover"><span class="lbl">Inspect System ↗</span></div>
              </div>
            </div>
            <div class="sh-fig" data-r="shBfig"><FigmaFrameBody /></div>
          </div>
          <div class="ripple" data-r="rip" />
          <svg class="cursor" data-r="cur" viewBox="0 0 22 22" width="22" height="22">
            <path d="M3 2 L3 18.5 L7.2 14.7 L10 21 L12.7 19.8 L9.9 13.6 L15.6 13.3 Z" fill="#FFFFFF" stroke="#050507" stroke-width="1.5" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <!-- Protected lower-left safe zone -->
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
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.exp-stage {
  --fw: 340px;
  position: relative; width: 100%; min-height: 94vh; min-height: 94svh; background: #050507; overflow: hidden;
  display: flex; flex-direction: column; padding: 4.7rem 0 36px; color: #F5F5F7;
  font-family: Inter, 'SF Pro Display', system-ui, sans-serif;
}
@media (min-width: 768px) { .exp-stage { padding-top: 5.3rem; } }
@media (max-width: 480px) { .exp-stage { --fw: 290px; } }

/* Ambient light blooms (slow parallax drift) */
.ambient { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.bl { position: absolute; border-radius: 50%; will-change: transform; }
.bl.g { width: 56vw; height: 56vw; max-width: 780px; max-height: 780px; top: 2%; left: 10%; background: radial-gradient(circle, #E2B878 0%, transparent 66%); opacity: 0.07; animation: dg 16s ease-in-out infinite alternate; }
.bl.a { width: 46vw; height: 46vw; max-width: 640px; max-height: 640px; top: 30%; right: 22%; background: radial-gradient(circle, #F5F5F7 0%, transparent 66%); opacity: 0.05; animation: da 20s ease-in-out infinite alternate; }
.bl.e { width: 44vw; height: 44vw; max-width: 600px; max-height: 600px; bottom: 0; right: 4%; background: radial-gradient(circle, #34D399 0%, transparent 66%); opacity: 0.06; animation: de 18s ease-in-out infinite alternate; }
@keyframes dg { to { transform: translate3d(7vw, 5vh, 0) scale(1.08); } }
@keyframes da { to { transform: translate3d(-9vw, -4vh, 0) scale(0.94); } }
@keyframes de { to { transform: translate3d(-6vw, -6vh, 0) scale(1.1); } }

/* Spatial stage */
.vp { position: relative; z-index: 2; flex: 1; width: 100%; min-height: 520px; overflow: hidden; }
.zoomer, .world { position: absolute; inset: 0; will-change: transform; }
.act { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.a2, .a3, .a4 { left: 100%; }
.a4 { background: #050507; }
.col { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(14px, 2.2vh, 26px); padding: 0 16px; }

/* Kinetic typography */
.title-wrap { position: relative; display: inline-block; will-change: transform; }
.ttl { display: flex; flex-wrap: wrap; justify-content: center; gap: 0 0.26em; margin: 0; font-weight: 800; letter-spacing: -0.03em; line-height: 1.02; font-size: clamp(2.8rem, 6vw, 5.5rem); color: #F5F5F7; text-align: center; }
.mask { display: inline-block; overflow: hidden; padding: 0.04em 0.02em 0.1em; }
.mi { display: inline-block; will-change: transform; }
.gold { color: #E2B878; }
.sbadge { position: absolute; top: -1.35rem; right: -0.4rem; display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 999px; background: #0F1117; border: 1px solid rgba(226, 184, 120, 0.5); color: #F5F5F7; font-size: 0.72rem; font-weight: 600; letter-spacing: 0; white-space: nowrap; font-variant-numeric: tabular-nums; box-shadow: 0 8px 24px -8px rgba(226, 184, 120, 0.4); }
@media (min-width: 1000px) { .sbadge.beside { top: 50%; right: auto; left: 100%; margin: -15px 0 0 18px; } }
.dot, .live { width: 7px; height: 7px; border-radius: 50%; background: #E2B878; }
.live { background: #34D399; box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.2); }

/* Cards */
.card { background: #0E1015; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.04); color: #F5F5F7; will-change: transform, opacity; }
.row { position: relative; display: flex; align-items: center; justify-content: center; gap: clamp(16px, 3vw, 56px); width: 100%; }
.side { flex: 0 0 clamp(190px, 17vw, 250px); padding: 16px; min-height: 150px; display: flex; flex-direction: column; gap: 8px; }
@media (max-width: 899px) { .side, .tag { display: none; } }
.frame { width: var(--fw); overflow: visible; flex: 0 0 auto; }
.lab { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: #A1A7B3; font-weight: 600; }
.big { font-size: 2.3rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: #F5F5F7; }
.num { font-variant-numeric: tabular-nums; }
.cap { font-size: 0.7rem; color: #7C8392; }
.sw { display: grid; grid-template-columns: 18px auto 1fr; align-items: center; gap: 8px; font-size: 0.74rem; }
.sw i { width: 18px; height: 18px; border-radius: 50%; }
.sw span { font-family: ui-monospace, monospace; color: #F5F5F7; }
.sw em { font-style: normal; color: #7C8392; text-align: right; }
.bar { height: 5px; border-radius: 999px; background: rgba(255, 255, 255, 0.08); overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #E2B878, #34D399); }
.chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.chip { display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 999px; background: #0F1117; border: 1px solid rgba(255, 255, 255, 0.14); font-size: 0.76rem; color: #D5D8E0; white-space: nowrap; will-change: transform, opacity; }
.chip.on { border-color: rgba(226, 184, 120, 0.5); color: #E2B878; }
.chip.on::before { content: '✓'; margin-right: 6px; font-weight: 800; }
.gold-chip { align-self: flex-start; color: #E2B878; border-color: rgba(226, 184, 120, 0.5); }

/* Floating orbit tags (outer = JS transform, inner = CSS float) */
.tag { position: absolute; z-index: 2; will-change: transform, opacity; }
.tag .fl { display: inline-block; padding: 5px 11px; border-radius: 999px; background: #0F1117; border: 1px solid rgba(226, 184, 120, 0.4); color: #E2B878; font-size: 0.7rem; font-weight: 600; animation: floaty 5s ease-in-out infinite alternate; }
.t-a { left: 3%; top: -16px; }
.t-b { right: 3%; bottom: -16px; }
.t-c { left: 50%; bottom: -30px; margin-left: -48px; }
.t-b .fl { animation-delay: -1.7s; }
.t-c .fl { animation-delay: -3.1s; }
@keyframes floaty { to { transform: translate3d(0, -5px, 0); } }

/* Act 02 */
.carousel { width: min(1060px, 100%); }
.track { display: flex; gap: 20px; width: max-content; margin: 0 auto; will-change: transform; }
.rc { flex: 0 0 clamp(250px, 24vw, 310px); min-height: 212px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.rc-h { display: flex; justify-content: space-between; align-items: center; }
.trend { width: 100%; height: 56px; }
.trend path { fill: none; stroke: #34D399; stroke-width: 2.5; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.sus { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.8rem; color: #A1A7B3; }
.sus b { color: #F5F5F7; font-size: 1.05rem; }
.nodes { position: relative; flex: 1; min-height: 100px; }
.nodes svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.nodes path { fill: none; stroke: rgba(226, 184, 120, 0.55); stroke-width: 1.4; stroke-dasharray: 3 4; vector-effect: non-scaling-stroke; }
.nodes path.clean { stroke: #34D399; stroke-dasharray: none; stroke-width: 2; }
.nd { position: absolute; padding: 4px 10px; border-radius: 999px; background: #151821; border: 1px solid rgba(255, 255, 255, 0.18); font-size: 0.68rem; font-weight: 600; white-space: nowrap; color: #D5D8E0; }
.nd.ok { border-color: #34D399; color: #34D399; }
.nd.st { position: static; }

.pill-btn { height: 44px; border-radius: 999px; display: grid; place-items: center; background: #E2B878; color: #050507; font-weight: 700; font-size: 0.9rem; border: 1px solid transparent; transition: background-color 0.18s, color 0.18s, box-shadow 0.18s, border-color 0.18s; will-change: transform; }
.pill-btn.hover { box-shadow: 0 0 0 1px rgba(226, 184, 120, 0.7), 0 8px 28px -6px rgba(226, 184, 120, 0.55); }
.pill-btn.flipped { background: #34D399; color: #04130C; }
.pill-btn.ghost { background: rgba(255, 255, 255, 0.08); color: #F5F5F7; border-color: rgba(255, 255, 255, 0.18); height: 38px; font-size: 0.82rem; }
.pill-btn.ghost.hover { border-color: #E2B878; }

/* Act 03 */
.cmp-wrap { position: relative; width: min(780px, 100%); display: flex; flex-direction: column; align-items: center; gap: 14px; }
.composer { --fo: 0; width: 100%; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 14px 14px 14px 22px; background: #0F1117; border-radius: 32px; border: 1px solid rgba(226, 184, 120, calc(0.12 + var(--fo) * 0.33)); box-shadow: 0 0 calc(var(--fo) * 34px) rgba(226, 184, 120, calc(var(--fo) * 0.28)), 0 24px 60px -24px rgba(0, 0, 0, 0.8); will-change: opacity; }
.spk { width: 10px; height: 10px; border-radius: 50%; background: #E2B878; flex: 0 0 auto; }
.cmp-text { flex: 1 1 260px; display: grid; font-size: 0.98rem; line-height: 1.45; text-align: left; min-width: 0; }
.cmp-text > * { grid-area: 1 / 1; }
.sizer { visibility: hidden; }
.ph { color: #6B7280; }
.typed { color: #F5F5F7; }
.caret { display: inline-block; width: 2px; height: 1.1em; margin-left: 2px; vertical-align: text-bottom; background: #E2B878; opacity: 0; }
.gen { flex: 0 0 auto; min-width: 128px; padding: 0 20px; }
.ctx-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
@media (min-width: 1000px) {
  .cp1 { position: absolute; right: calc(100% + 18px); top: 26px; }
  .cp2 { position: absolute; left: calc(100% + 18px); top: 26px; }
}

/* Act 04 */
.r4 { align-items: flex-start; gap: clamp(14px, 2vw, 32px); }
.vol { flex: 0 0 clamp(270px, 22vw, 310px); padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.vol-h { display: flex; justify-content: space-between; align-items: center; }
.ex { font-size: 1.3rem; font-weight: 700; letter-spacing: -0.02em; margin-top: 6px; }
.stat { font-size: 1.05rem; color: #34D399; font-weight: 600; }
.dots { display: flex; gap: 6px; margin: 6px 0; }
.dots i { width: 22px; height: 6px; border-radius: 999px; background: rgba(255, 255, 255, 0.12); transition: background-color 0.3s; }
.dots i.on { background: #E2B878; }
.rcol { flex: 0 0 clamp(280px, 25vw, 340px); display: flex; flex-direction: column; gap: 14px; }
.nav { position: relative; display: flex; align-self: flex-start; padding: 4px; border-radius: 999px; background: #0E1015; border: 1px solid rgba(255, 255, 255, 0.12); }
.ind { position: absolute; left: 0; top: 4px; bottom: 4px; width: 0; border-radius: 999px; background: #E2B878; will-change: transform, width; }
.tab { position: relative; z-index: 1; padding: 7px 14px; font-size: 0.78rem; font-weight: 600; color: #A1A7B3; white-space: nowrap; transition: color 0.2s; }
.tab.on { color: #050507; }
.case { --el: 0; padding: 16px; display: flex; flex-direction: column; gap: 8px; border-color: rgba(226, 184, 120, calc(0.12 + var(--el) * 0.4)); }
.cs-h { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.02em; }
.cs-m { font-size: 0.78rem; color: #34D399; font-family: ui-monospace, monospace; }
.code { font-family: ui-monospace, monospace; font-size: 0.7rem; line-height: 1.7; color: #A1A7B3; }
@media (max-width: 899px) {
  .r4 { flex-direction: column; align-items: center; gap: 12px; }
  .vol, .rcol { flex: 0 0 auto; width: min(320px, 100%); }
  .vol { padding: 12px 16px; gap: 4px; }
  .vol .ex { margin-top: 2px; }
  .rcol { gap: 10px; }
  .nav { display: none; }
  .case { padding: 12px 16px; }
}
@media (max-width: 899px) { .rc { min-height: 200px; } }
@media (max-width: 480px) { .chips { gap: 6px; } .chip { font-size: 0.68rem; padding: 5px 8px; } }

/* Overlay */
.overlay { position: absolute; inset: 0; pointer-events: none; z-index: 20; }
.shell { position: absolute; left: 0; top: 0; z-index: 30; overflow: hidden; visibility: hidden; padding: 0; }
.sh-a { position: absolute; inset: 0; display: flex; align-items: center; justify-content: space-around; padding: 0 6%; }
.sh-case { position: absolute; inset: 0; }
.sh-case .case { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.sh-fig { position: absolute; left: 50%; top: 50%; width: var(--fw); transform: translate(-50%, -50%); opacity: 0; }
.ripple { position: absolute; left: 0; top: 0; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; border: 2px solid #E2B878; background: rgba(226, 184, 120, 0.18); opacity: 0; z-index: 45; }
.cursor { position: absolute; left: 0; top: 0; z-index: 50; transform-origin: 3px 2px; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)); opacity: 0; will-change: transform; }

/* Lower-left safe zone */
.safe-zone { position: relative; z-index: 3; padding: 14px 0 0 clamp(24px, 5vw, 64px); display: flex; justify-content: flex-start; }
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
  .bl, .tag .fl { animation: none !important; }
}
</style>
