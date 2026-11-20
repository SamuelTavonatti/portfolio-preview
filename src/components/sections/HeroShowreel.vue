<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * =========================================================================
 * 20.5-SECOND SEAMLESS APPLE KEYNOTE / GOOGLE LAUNCH HERO SHOWREEL ENGINE
 * 4 Scenes · Native 60fps requestAnimationFrame · Exact Cursor Physics
 * Ported directly from user's portfolio_hero_showreel.html
 * =========================================================================
 */
const rootRef = ref(null)

let rafId = null
let resizeHandler = null

onMounted(() => {
  const root = rootRef.value
  if (!root || typeof window === 'undefined') return

  const q = (id) => root.querySelector(`#${id}`)

  const LOOP_MS = 20500
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const stage = q('stage')
  const introBrand = q('introBrand')
  const cursorEl = q('cursor')
  const rippleEl = q('ripple')
  const loopSweep = q('loopSweep')

  const scenes = {
    1: q('scene1'),
    2: q('scene2'),
    3: q('scene3'),
    4: q('scene4'),
  }

  const headlineMasks = {
    1: scenes[1].querySelector('.headline-mask'),
    2: scenes[2].querySelector('.headline-mask'),
    3: scenes[3].querySelector('.headline-mask'),
    4: scenes[4].querySelector('.headline-mask'),
  }

  // Easing curves
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
  const easeOutQuint = (x) => 1 - Math.pow(1 - x, 5)

  // Scene 1 refs
  const s1Artboard = q('s1Artboard')
  const btnValidate = q('btnValidate')

  // Scene 2 refs (Double Diamond, Telemetry, Stakeholders, Constraints)
  const ddTracePath = q('ddTracePath')
  const DD_LEN = ddTracePath.getTotalLength()
  ddTracePath.style.strokeDasharray = `${DD_LEN}`
  ddTracePath.style.strokeDashoffset = `${DD_LEN}`

  const ddPhases = [
    q('ddPhase1'),
    q('ddPhase2'),
    q('ddPhase3'),
    q('ddPhase4'),
  ]
  const ddNodeStart = q('ddNodeStart')
  const ddNodeMid = q('ddNodeMid')
  const ddNodeEnd = q('ddNodeEnd')
  const ddLabelMid = q('ddLabelMid')
  const ddLabelEnd = q('ddLabelEnd')
  const ddTracerDot = q('ddTracerDot')
  const ddTracerHalo = q('ddTracerHalo')

  const bezierPath = q('bezierPath')
  const BEZIER_LEN = bezierPath.getTotalLength()
  bezierPath.style.strokeDasharray = `${BEZIER_LEN}`
  bezierPath.style.strokeDashoffset = `${BEZIER_LEN}`
  const bezierArea = q('bezierArea')
  const tracerDot = q('tracerDot')
  const tracerHalo = q('tracerHalo')
  const frictionCounter = q('frictionCounter')

  const ringProgress = q('ringProgress')
  const RING_CIRC = 2 * Math.PI * 74
  ringProgress.style.strokeDasharray = `${RING_CIRC}`
  ringProgress.style.strokeDashoffset = `${RING_CIRC}`
  const ringCounter = q('ringCounter')

  const btnAlign = q('btnAlign')
  const shNodes = [q('sh1'), q('sh2'), q('sh3'), q('sh4')]
  const shConns = [q('shc1'), q('shc2'), q('shc3')]
  const constraints = [q('con1'), q('con2'), q('con3'), q('con4')]

  // Scene 3 refs (Apple Intelligence Prompt Pill + Generated Website Preview)
  const s3Camera = q('s3Camera')
  const aiPillWrap = q('aiPillWrap')
  const aiSitePreview = q('aiSitePreview')
  const promptTyped = q('promptTyped')
  const btnAiSubmit = q('btnAiSubmit')
  const echoes = [q('echo1'), q('echo2'), q('echo3')]
  const PROMPT_COPY = 'Architect an accessible design system with 8pt rhythm & 60fps native motion.'

  // Scene 4 refs (Code, Frame-Time Telemetry, Lighthouse Rings, Voltrep Card)
  const codeScanner = q('codeScanner')
  const fpsSvg = q('fpsSvg')
  fpsSvg.innerHTML = ''
  const fpsBars = []
  const SVG_NS = 'http://www.w3.org/2000/svg'
  for (let i = 0; i < 24; i++) {
    const rect = document.createElementNS(SVG_NS, 'rect')
    rect.setAttribute('x', String(i * 9.2 + 1))
    rect.setAttribute('y', '24')
    rect.setAttribute('width', '5.5')
    rect.setAttribute('height', '42')
    rect.setAttribute('rx', '2.5')
    rect.setAttribute('fill', i % 4 === 0 ? '#E2B878' : 'rgba(245, 245, 247, 0.24)')
    fpsSvg.appendChild(rect)
    fpsBars.push(rect)
  }

  const lhRings = [
    { el: q('lhPerf'), num: q('lhPerfNum') },
    { el: q('lhA11y'), num: q('lhA11yNum') },
    { el: q('lhSeo'), num: q('lhSeoNum') },
  ]

  const segmentedNav = q('segmentedNav')
  const voltrepCard = q('voltrepCard')
  const volPeakBar = q('volPeakBar')
  const prBadge = q('prBadge')
  const btnLogSet = q('btnLogSet')

  // Dynamic cursor state
  const cursor = {
    x: -120,
    y: -120,
    startX: -120,
    startY: -120,
    targetX: -120,
    targetY: -120,
    targetEl: null,
    moveStart: 0,
    duration: 450,
    moving: false,
  }

  function getCenter(el) {
    const sRect = stage.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    return {
      x: r.left - sRect.left + r.width / 2,
      y: r.top - sRect.top + r.height / 2,
    }
  }

  function placeCursor(x, y) {
    cursor.x = x
    cursor.y = y
    cursor.moving = false
    cursorEl.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  function glideTo(el, duration, now) {
    const pt = getCenter(el)
    cursor.startX = cursor.x
    cursor.startY = cursor.y
    cursor.targetX = pt.x
    cursor.targetY = pt.y
    cursor.targetEl = el
    cursor.moveStart = now
    cursor.duration = duration
    cursor.moving = true
    cursorEl.classList.add('is-visible')
  }

  function updateCursor(now) {
    if (!cursor.moving) return
    if (cursor.targetEl) {
      const live = getCenter(cursor.targetEl)
      cursor.targetX = live.x
      cursor.targetY = live.y
    }
    const p = Math.min(1, Math.max(0, (now - cursor.moveStart) / cursor.duration))
    const e = easeOutCubic(p)
    cursor.x = cursor.startX + (cursor.targetX - cursor.startX) * e
    cursor.y = cursor.startY + (cursor.targetY - cursor.startY) * e
    cursorEl.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`
    if (p >= 1) cursor.moving = false
  }

  function fireRipple(el) {
    const pt = getCenter(el)
    rippleEl.style.left = `${pt.x}px`
    rippleEl.style.top = `${pt.y}px`
    rippleEl.classList.remove('is-popping')
    void rippleEl.offsetWidth
    rippleEl.classList.add('is-popping')
  }

  function setActiveScene(num) {
    Object.keys(scenes).forEach((k) => {
      const idx = Number(k)
      scenes[idx].classList.remove('is-exiting')
      scenes[idx].classList.toggle('is-active', idx === num)
    })
  }

  // Compute untransformed layout offset inside a scene (immune to scene scale/blur)
  function getOffsetInScene(el, sceneEl) {
    let left = 0
    let top = 0
    let curr = el
    while (curr && curr !== sceneEl) {
      left += curr.offsetLeft
      top += curr.offsetTop
      curr = curr.offsetParent
    }
    return { left, top, width: el.offsetWidth, height: el.offsetHeight }
  }

  // FLIP: Place a scene's headline dead-center & gently scaled up before docking
  function centerHeadline(num) {
    const mask = headlineMasks[num]
    const sceneEl = scenes[num]
    if (!mask || !sceneEl) return
    mask.classList.remove('is-docking')
    const box = getOffsetInScene(mask, sceneEl)
    const sw = stage.clientWidth
    const sh = stage.clientHeight
    const maxScale = (sw * 0.86) / Math.max(box.width, 1)
    const heroScale = Math.min(1.36, Math.max(1.0, maxScale))
    const dx = sw / 2 - (box.left + box.width / 2)
    const dy = sh / 2 - (box.top + box.height / 2)
    mask.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${heroScale.toFixed(3)})`
  }

  // Smoothly glide & scale the centered headline into its docked top-left header slot
  function dockHeadline(num) {
    const mask = headlineMasks[num]
    if (!mask) return
    mask.classList.add('is-docking')
    mask.style.transform = 'translate3d(0, 0, 0) scale(1)'
  }

  function resetAll() {
    Object.keys(scenes).forEach((k) => {
      const idx = Number(k)
      scenes[idx].classList.remove('is-active', 'is-exiting', 'is-content-visible')
      centerHeadline(idx)
    })

    // Scene 1 reset
    s1Artboard.classList.remove('is-snapped', 'is-swept')
    btnValidate.classList.remove('is-hovered', 'is-pressed', 'is-validated')
    btnValidate.textContent = 'Validate System →'

    // Scene 2 reset
    ddTracePath.style.strokeDashoffset = `${DD_LEN}`
    ddPhases.forEach((ph) => ph.classList.remove('is-lit'))
    ddNodeStart.classList.remove('is-lit')
    ddNodeMid.classList.remove('is-lit')
    ddNodeEnd.classList.remove('is-lit')
    ddLabelMid.classList.remove('is-lit')
    ddLabelEnd.classList.remove('is-lit')
    ddTracerDot.classList.remove('is-active')
    ddTracerHalo.classList.remove('is-active')
    ddTracerDot.setAttribute('cx', '44')
    ddTracerDot.setAttribute('cy', '95')
    ddTracerHalo.setAttribute('cx', '44')
    ddTracerHalo.setAttribute('cy', '95')

    bezierPath.style.strokeDashoffset = `${BEZIER_LEN}`
    bezierArea.classList.remove('is-visible')
    tracerDot.classList.remove('is-active')
    tracerHalo.classList.remove('is-active')
    tracerDot.setAttribute('cx', '6')
    tracerDot.setAttribute('cy', '22')
    tracerHalo.setAttribute('cx', '6')
    tracerHalo.setAttribute('cy', '22')
    frictionCounter.textContent = '0% Friction'
    ringProgress.style.strokeDashoffset = `${RING_CIRC}`
    ringCounter.textContent = '0.0%'

    btnAlign.classList.remove('is-hovered', 'is-pressed', 'is-validated')
    btnAlign.textContent = 'Align Goals'
    shNodes.forEach((n) => n.classList.remove('is-aligned'))
    shConns.forEach((c) => c.classList.remove('is-lit'))
    constraints.forEach((c) => c.classList.remove('is-locked'))

    // Scene 3 reset
    s3Camera.classList.remove('is-zoomed', 'is-dismissed')
    aiPillWrap.classList.remove('is-synthesizing')
    aiSitePreview.classList.remove('is-built', 'is-swept')
    promptTyped.textContent = ''
    btnAiSubmit.classList.remove('is-hovered', 'is-pressed')
    echoes.forEach((e) => e.classList.remove('is-firing'))

    // Scene 4 reset
    codeScanner.classList.remove('is-on')
    codeScanner.style.top = '18%'
    lhRings.forEach((r) => {
      r.el.classList.remove('is-full')
      r.num.textContent = '0'
    })
    segmentedNav.classList.remove('at-liveset')
    voltrepCard.classList.remove('is-logged')
    volPeakBar.style.height = '58%'
    prBadge.classList.remove('is-visible')
    btnLogSet.classList.remove('is-hovered', 'is-pressed', 'is-validated')
    btnLogSet.textContent = 'Log Set'

    // Sweep & Cursor
    loopSweep.classList.remove('is-sweeping')
    cursorEl.classList.remove('is-visible', 'is-clicking')
    cursor.moving = false
    cursor.targetEl = null
  }

  /* =======================================================================
     DETERMINISTIC CHOREOGRAPHY TIMELINE
     ======================================================================= */
  const fired = new Set()

  function cue(id, cond, fn) {
    if (cond && !fired.has(id)) {
      fired.add(id)
      fn()
    }
  }

  function renderTimeline(t, now) {
    /* -------------------------------------------------------------------
       SCENE 1 (0.0s - 4.5s): UX/UI DESIGNER — CENTER TITLE -> DOCK -> UI
       ------------------------------------------------------------------- */
    cue('s1_in', t >= 0, () => {
      setActiveScene(1)
    })

    cue('s1_dock', t >= 700, () => {
      dockHeadline(1)
    })

    cue('s1_content', t >= 920, () => {
      scenes[1].classList.add('is-content-visible')
    })

    cue('s1_snap', t >= 1320, () => {
      s1Artboard.classList.add('is-snapped')
    })

    cue('s1_glide', t >= 2100, () => {
      const r = stage.getBoundingClientRect()
      placeCursor(r.width * 0.62, r.height * 0.48)
      glideTo(btnValidate, 480, now)
    })

    cue('s1_hover', t >= 2580, () => {
      btnValidate.classList.add('is-hovered')
    })

    cue('s1_click', t >= 2650, () => {
      cursorEl.classList.add('is-clicking')
      btnValidate.classList.add('is-pressed')
      fireRipple(btnValidate)
    })

    cue('s1_valid', t >= 2790, () => {
      cursorEl.classList.remove('is-clicking')
      btnValidate.classList.remove('is-pressed', 'is-hovered')
      btnValidate.classList.add('is-validated')
      btnValidate.textContent = 'Validated ✓'
      s1Artboard.classList.add('is-swept')
    })

    cue('s1_out', t >= 4120, () => {
      cursorEl.classList.remove('is-visible')
      scenes[1].classList.add('is-exiting')
    })

    /* -------------------------------------------------------------------
       SCENE 2 (4.5s - 9.0s): USER RESEARCH — DOUBLE DIAMOND & TELEMETRY
       ------------------------------------------------------------------- */
    cue('s2_in', t >= 4500, () => {
      setActiveScene(2)
    })

    cue('s2_dock', t >= 5200, () => {
      dockHeadline(2)
    })

    cue('s2_content', t >= 5420, () => {
      scenes[2].classList.add('is-content-visible')
      bezierArea.classList.add('is-visible')
      ddNodeStart.classList.add('is-lit')
      ddTracerDot.classList.add('is-active')
      ddTracerHalo.classList.add('is-active')
      tracerDot.classList.add('is-active')
      tracerHalo.classList.add('is-active')
    })

    // Continuous Double Diamond, Radial Ring & Bezier Telemetry (5.48s -> 7.18s)
    if (t >= 5480 && t <= 7240) {
      const p = easeOutCubic(Math.min(1, (t - 5480) / 1700))

      // Double Diamond path + glowing tracer
      ddTracePath.style.strokeDashoffset = `${DD_LEN * (1 - p)}`
      const ddPt = ddTracePath.getPointAtLength(p * DD_LEN)
      ddTracerDot.setAttribute('cx', ddPt.x.toFixed(1))
      ddTracerDot.setAttribute('cy', ddPt.y.toFixed(1))
      ddTracerHalo.setAttribute('cx', ddPt.x.toFixed(1))
      ddTracerHalo.setAttribute('cy', ddPt.y.toFixed(1))

      if (p >= 0.08) ddPhases[0].classList.add('is-lit')
      if (p >= 0.34) ddPhases[1].classList.add('is-lit')
      if (p >= 0.5) {
        ddNodeMid.classList.add('is-lit')
        ddLabelMid.classList.add('is-lit')
      }
      if (p >= 0.64) ddPhases[2].classList.add('is-lit')
      if (p >= 0.86) ddPhases[3].classList.add('is-lit')
      if (p >= 0.98) {
        ddNodeEnd.classList.add('is-lit')
        ddLabelEnd.classList.add('is-lit')
      }

      // Bezier area chart + friction counter
      bezierPath.style.strokeDashoffset = `${BEZIER_LEN * (1 - p)}`
      const bPt = bezierPath.getPointAtLength(p * BEZIER_LEN)
      tracerDot.setAttribute('cx', bPt.x.toFixed(1))
      tracerDot.setAttribute('cy', bPt.y.toFixed(1))
      tracerHalo.setAttribute('cx', bPt.x.toFixed(1))
      tracerHalo.setAttribute('cy', bPt.y.toFixed(1))
      frictionCounter.textContent = `-${Math.round(p * 42)}% Friction`

      // Radial Ring Gauge (0% -> 98.4%)
      const pct = p * 98.4
      ringProgress.style.strokeDashoffset = `${RING_CIRC * (1 - pct / 100)}`
      ringCounter.textContent = `${pct.toFixed(1)}%`
    }

    // Staggered Non-Negotiable Constraints lock-in
    cue('s2_con1', t >= 5920, () => constraints[0].classList.add('is-locked'))
    cue('s2_con2', t >= 6140, () => constraints[1].classList.add('is-locked'))
    cue('s2_con3', t >= 6360, () => constraints[2].classList.add('is-locked'))
    cue('s2_con4', t >= 6580, () => constraints[3].classList.add('is-locked'))

    // Stakeholder Alignment interactive click
    cue('s2_glide', t >= 6820, () => {
      const r = stage.getBoundingClientRect()
      placeCursor(r.width * 0.34, r.height * 0.56)
      glideTo(btnAlign, 440, now)
    })

    cue('s2_hover', t >= 7260, () => {
      btnAlign.classList.add('is-hovered')
    })

    cue('s2_click', t >= 7330, () => {
      cursorEl.classList.add('is-clicking')
      btnAlign.classList.add('is-pressed')
      fireRipple(btnAlign)
    })

    cue('s2_aligned', t >= 7460, () => {
      cursorEl.classList.remove('is-clicking')
      btnAlign.classList.remove('is-pressed', 'is-hovered')
      btnAlign.classList.add('is-validated')
      btnAlign.textContent = 'Aligned ✓'
      shNodes.forEach((n) => n.classList.add('is-aligned'))
      shConns.forEach((c) => c.classList.add('is-lit'))
    })

    cue('s2_out', t >= 8620, () => {
      cursorEl.classList.remove('is-visible')
      scenes[2].classList.add('is-exiting')
    })

    /* -------------------------------------------------------------------
       SCENE 3 (9.0s - 16.0s): CREATIVE AI — PROMPT -> LIVE GENERATED SITE
       ------------------------------------------------------------------- */
    cue('s3_in', t >= 9000, () => {
      setActiveScene(3)
    })

    cue('s3_dock', t >= 9700, () => {
      dockHeadline(3)
    })

    cue('s3_content', t >= 9920, () => {
      scenes[3].classList.add('is-content-visible')
    })

    cue('s3_zoom', t >= 10220, () => {
      s3Camera.classList.add('is-zoomed')
    })

    // Smooth Macro Prompt Typing (10.28s -> 11.75s)
    if (t >= 10280 && t <= 11780) {
      const p = Math.min(1, (t - 10280) / 1470)
      promptTyped.textContent = PROMPT_COPY.slice(0, Math.floor(p * PROMPT_COPY.length))
    } else if (t > 11780 && t < 16000) {
      promptTyped.textContent = PROMPT_COPY
    }

    // Pull back smoothly to 1.0 & glide cursor straight to circular Submit button
    cue('s3_pullback', t >= 11820, () => {
      s3Camera.classList.remove('is-zoomed')
      const r = stage.getBoundingClientRect()
      placeCursor(r.width * 0.54, r.height * 0.64)
      glideTo(btnAiSubmit, 380, now)
    })

    cue('s3_hover', t >= 12200, () => {
      btnAiSubmit.classList.add('is-hovered')
    })

    cue('s3_click', t >= 12270, () => {
      cursorEl.classList.add('is-clicking')
      btnAiSubmit.classList.add('is-pressed')
      fireRipple(btnAiSubmit)
    })

    cue('s3_morph', t >= 12400, () => {
      cursorEl.classList.remove('is-clicking', 'is-visible')
      btnAiSubmit.classList.remove('is-pressed', 'is-hovered')
      aiPillWrap.classList.add('is-synthesizing')
      echoes.forEach((e) => e.classList.add('is-firing'))
    })

    // Synthesizing pill smoothly gives way to the Live Generated Website
    cue('s3_build_site', t >= 13180, () => {
      s3Camera.classList.add('is-dismissed')
      aiSitePreview.classList.add('is-built')
    })

    // Specular gold sheen sweep across the generated site
    cue('s3_site_sweep', t >= 14550, () => {
      aiSitePreview.classList.add('is-swept')
    })

    cue('s3_out', t >= 15620, () => {
      scenes[3].classList.add('is-exiting')
    })

    /* -------------------------------------------------------------------
       SCENE 4 (16.0s - 20.5s): WEB DEVELOPER — CENTER TITLE -> DOCK -> UI
       ------------------------------------------------------------------- */
    cue('s4_in', t >= 16000, () => {
      echoes.forEach((e) => e.classList.remove('is-firing'))
      setActiveScene(4)
    })

    cue('s4_dock', t >= 16700, () => {
      dockHeadline(4)
    })

    cue('s4_content', t >= 16920, () => {
      scenes[4].classList.add('is-content-visible')
      codeScanner.classList.add('is-on')
      codeScanner.style.top = '18%'
      lhRings.forEach((r) => r.el.classList.add('is-full'))
    })

    // Animate Lighthouse counters (16.98s -> 18.05s) & Live 60 FPS frame bars
    if (t >= 16980 && t <= 18100) {
      const p = easeOutQuint(Math.min(1, (t - 16980) / 1070))
      const val = Math.round(p * 100)
      lhRings.forEach((r) => {
        r.num.textContent = String(val)
      })
    } else if (t > 18100) {
      lhRings.forEach((r) => {
        r.num.textContent = '100'
      })
    }

    if (t >= 16920 && t < 20500) {
      const phase = (t - 16920) * 0.006
      for (let i = 0; i < fpsBars.length; i++) {
        const h = 42 + Math.sin(phase + i * 0.55) * 4.5
        fpsBars[i].setAttribute('height', h.toFixed(1))
        fpsBars[i].setAttribute('y', (66 - h).toFixed(1))
      }
    }

    cue('s4_scan2', t >= 17400, () => {
      codeScanner.style.top = '48%'
      segmentedNav.classList.add('at-liveset')
    })

    cue('s4_scan3', t >= 17900, () => {
      codeScanner.style.top = '72%'
    })

    cue('s4_glide', t >= 18250, () => {
      const r = stage.getBoundingClientRect()
      placeCursor(r.width * 0.64, r.height * 0.44)
      glideTo(btnLogSet, 460, now)
    })

    cue('s4_hover', t >= 18710, () => {
      btnLogSet.classList.add('is-hovered')
    })

    cue('s4_click', t >= 18770, () => {
      cursorEl.classList.add('is-clicking')
      btnLogSet.classList.add('is-pressed')
      fireRipple(btnLogSet)
    })

    cue('s4_logged', t >= 18910, () => {
      cursorEl.classList.remove('is-clicking')
      btnLogSet.classList.remove('is-pressed', 'is-hovered')
      btnLogSet.classList.add('is-validated')
      btnLogSet.textContent = 'Set Logged ✓'
      voltrepCard.classList.add('is-logged')
      volPeakBar.style.height = '92%'
      prBadge.classList.add('is-visible')
    })

    cue('s4_sweep', t >= 19900, () => {
      cursorEl.classList.remove('is-visible')
      loopSweep.classList.add('is-sweeping')
    })
  }

  /* =======================================================================
     MASTER 60FPS ANIMATION LOOP (CENTERED NAME INTRO -> DOCK -> 20.5s LOOP)
     ======================================================================= */
  const params = new URLSearchParams(window.location.search)
  const tParam = params.get('t')

  if (tParam !== null && !Number.isNaN(Number(tParam))) {
    // Deterministic QA snapshot mode (?t=seconds into the 20.5s loop)
    introBrand.classList.add('is-revealed', 'is-docking')
    introBrand.style.transform = 'translate3d(0, 0, 0) scale(1)'
    resetAll()
    const targetMs = (Number(tParam) * 1000) % LOOP_MS
    const now = performance.now()
    // Step through timeline so all preceding cues fire in order
    for (let step = 0; step <= targetMs; step += 40) {
      renderTimeline(step, now + step)
    }
    renderTimeline(targetMs, now + targetMs)
    if (cursor.targetEl) {
      const pt = getCenter(cursor.targetEl)
      placeCursor(pt.x, pt.y)
    }
  } else if (!prefersReducedMotion) {
    const INTRO_REVEAL_MS = 120
    const INTRO_DOCK_MS = 2050
    const SHOWREEL_START_MS = 2550

    // FLIP: Position the name dead-center & scaled up before docking to top-left
    function positionBrandAtCenter() {
      const sRect = stage.getBoundingClientRect()
      const bRect = introBrand.getBoundingClientRect()
      const maxScale = (sRect.width * 0.82) / Math.max(bRect.width, 1)
      const introScale = Math.min(2.6, Math.max(1.35, maxScale))
      const dx = sRect.width / 2 - (bRect.left - sRect.left + bRect.width / 2)
      const dy = sRect.height / 2 - (bRect.top - sRect.top + bRect.height / 2)
      introBrand.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${introScale.toFixed(3)})`
    }

    positionBrandAtCenter()
    resetAll()

    resizeHandler = () => {
      Object.keys(headlineMasks).forEach((k) => {
        const idx = Number(k)
        if (!headlineMasks[idx].classList.contains('is-docking')) {
          centerHeadline(idx)
        }
      })
    }
    window.addEventListener('resize', resizeHandler, { passive: true })

    const bootTime = performance.now()
    let introRevealed = false
    let introDocked = false
    let lastLoop = -1

    function tick(now) {
      const sinceBoot = now - bootTime

      // Phase 1: Reveal centered name & role
      if (!introRevealed && sinceBoot >= INTRO_REVEAL_MS) {
        introRevealed = true
        introBrand.classList.add('is-revealed')
      }

      // Phase 2: Glide & scale name smoothly into docked top-left slot
      if (!introDocked && sinceBoot >= INTRO_DOCK_MS) {
        introDocked = true
        introBrand.classList.add('is-docking')
        introBrand.style.transform = 'translate3d(0, 0, 0) scale(1)'
      }

      // Phase 3: Launch the seamless 20.5-second 4-scene loop
      if (sinceBoot >= SHOWREEL_START_MS) {
        const elapsed = sinceBoot - SHOWREEL_START_MS
        const loopIdx = Math.floor(elapsed / LOOP_MS)
        const t = elapsed % LOOP_MS

        if (loopIdx !== lastLoop) {
          lastLoop = loopIdx
          fired.clear()
          resetAll()
        }

        renderTimeline(t, now)
        updateCursor(now)
      }

      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
  }
})

onUnmounted(() => {
  if (rafId !== null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(rafId)
  }
  if (resizeHandler && typeof window !== 'undefined') {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<template>
  <div ref="rootRef" class="showreel-host">
    <section id="stage" class="stage" aria-label="Full-Screen Hero Showreel">
      <!-- Subtle Ambient Light Blooms -->
      <div class="ambient-layer" aria-hidden="true">
        <div class="bloom bloom-gold"></div>
        <div class="bloom bloom-alabaster"></div>
      </div>

      <!-- Opening Identity Intro -> Smoothly Docks to Top-Left -->
      <div id="introBrand" class="intro-brand" aria-label="Samuel Tavonatti">
        <div class="intro-name-mask">
          <span class="intro-name"><span class="metallic">Samuel</span> <span class="gold">Tavonatti</span></span>
        </div>
        <div id="introRole" class="intro-role mono">UI/UX Designer · Creative AI · Web Developer</div>
      </div>

      <!-- ======================================================================
           SCENE 1 (0.0s - 4.5s): UX/UI DESIGNER — APPLE DESIGN SYSTEM BENTO
           ====================================================================== -->
      <section id="scene1" class="scene">
        <div class="stage-hairlines" aria-hidden="true">
          <div class="stage-hl h-top"></div>
          <div class="stage-hl h-bot"></div>
          <div class="stage-hl v-left"></div>
          <div class="stage-hl v-right"></div>
        </div>

        <header class="scene-header">
          <div class="headline-mask">
            <h1 class="headline"><span class="metallic">UX/UI</span> <span class="gold">DESIGNER</span></h1>
          </div>
          <span class="header-tag mono">Design Systems · 8pt Optical Rhythm</span>
        </header>

        <div class="s1-grid">
          <!-- Left Bento Card: Design System Tokens (Typography Scale + 4 Color Swatches + AAA) -->
          <div class="bento s1-tokens-bento">
            <div class="type-block">
              <div class="bento-eyebrow mono">Design System Tokens</div>
              <div class="type-head">
                <div class="specimen-aa">Aa</div>
                <div class="specimen-meta mono">Inter · -0.045em · tabular-nums</div>
              </div>
              <div class="type-rows">
                <div class="type-row">
                  <span class="tr-name">H1 Display</span>
                  <span class="tr-spec mono">72px / 700 · -0.045em</span>
                </div>
                <div class="type-row">
                  <span class="tr-name">Body UI</span>
                  <span class="tr-spec mono">16px / 500 · 1.50 lh</span>
                </div>
                <div class="type-row">
                  <span class="tr-name mono">Mono Data</span>
                  <span class="tr-spec mono">13px / 500 · tabular</span>
                </div>
              </div>
            </div>

            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <div class="bento-eyebrow mono">Color Palette</div>
                <span class="contrast-pill mono">Contrast 14.8:1 AAA</span>
              </div>
              <div class="swatch-row">
                <div class="swatch-unit">
                  <div class="swatch-orb obs"></div>
                  <span class="swatch-code mono">#050507</span>
                  <span class="swatch-name">Obsidian</span>
                </div>
                <div class="swatch-unit">
                  <div class="swatch-orb gls"></div>
                  <span class="swatch-code mono">#0D0F14</span>
                  <span class="swatch-name">Glass</span>
                </div>
                <div class="swatch-unit">
                  <div class="swatch-orb ala"></div>
                  <span class="swatch-code mono">#F5F5F7</span>
                  <span class="swatch-name">Alabaster</span>
                </div>
                <div class="swatch-unit">
                  <div class="swatch-orb gld"></div>
                  <span class="swatch-code mono">#E2B878</span>
                  <span class="swatch-name">Gold</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Bento Card: Magnetic Auto-Layout Frame -->
          <div id="s1Artboard" class="bento s1-main-bento">
            <div class="specular-sweep" aria-hidden="true"></div>

            <div class="artboard-top">
              <span class="artboard-heading">Magnetic Auto-Layout Frame</span>
              <div class="spacing-badges mono">
                <span class="space-badge">8pt Grid · WCAG AA</span>
              </div>
            </div>

            <div class="artboard-canvas">
              <div class="guide-line h1" aria-hidden="true"></div>
              <div class="guide-line h2" aria-hidden="true"></div>
              <div class="guide-line v1" aria-hidden="true"></div>
              <div class="guide-line v2" aria-hidden="true"></div>

              <div class="ui-header-strip">
                <div class="ui-pill-row">
                  <span class="mini-dot gold"></span>
                  <span class="mini-dot"></span>
                  <span class="mini-dot"></span>
                </div>
                <span class="mono" style="font-size: 0.72rem; color: var(--titanium);">Auto-Layout · Flat 2D</span>
              </div>

              <div class="redline-row mono" aria-hidden="true">
                <div class="redline-seg">
                  <span class="redline-bar"></span>
                  <span class="redline-tag">16px</span>
                  <span class="redline-bar"></span>
                </div>
                <div class="redline-seg">
                  <span class="redline-bar"></span>
                  <span class="redline-tag">24px</span>
                  <span class="redline-bar"></span>
                </div>
                <div class="redline-seg">
                  <span class="redline-bar"></span>
                  <span class="redline-tag">16px</span>
                  <span class="redline-bar"></span>
                </div>
              </div>

              <div class="ui-card-row">
                <div class="sys-card c1">
                  <div class="sys-label mono">Surface</div>
                  <div>
                    <div class="sk-line"></div>
                    <div class="sk-line short"></div>
                    <div class="sk-line accent"></div>
                  </div>
                </div>
                <div class="sys-card c2">
                  <div class="sys-label mono">Hierarchy</div>
                  <div>
                    <div class="sk-line"></div>
                    <div class="sk-line short"></div>
                    <div class="sk-line accent"></div>
                  </div>
                </div>
                <div class="sys-card c3">
                  <div class="sys-label mono">Motion</div>
                  <div>
                    <div class="sk-line"></div>
                    <div class="sk-line short"></div>
                    <div class="sk-line accent"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="artboard-bottom">
              <span class="mono" style="font-size: 0.74rem; color: var(--titanium);">16px / 24px Spatial Rhythm</span>
              <button id="btnValidate" type="button" class="action-pill">Validate System →</button>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================================
           SCENE 2 (4.5s - 9.0s): USER RESEARCH — DOUBLE DIAMOND & GUARDRAILS
           ====================================================================== -->
      <section id="scene2" class="scene">
        <header class="scene-header">
          <div class="headline-mask">
            <h1 class="headline"><span class="metallic">USER</span> <span class="gold">RESEARCH</span></h1>
          </div>
          <span class="header-tag mono">Double Diamond · Stakeholders · Constraints</span>
        </header>

        <div class="s2-grid">
          <!-- Top-Left Wide Bento: Interactive SVG Double Diamond -->
          <div class="bento s2-card">
            <div class="s2-card-head">
              <div class="bento-eyebrow mono">Double Diamond Methodology</div>
              <span class="sus-pill mono">Diverge · <span>Converge</span></span>
            </div>

            <div class="diamond-wrap">
              <svg class="diamond-svg" viewBox="0 0 600 190" aria-hidden="true">
                <defs>
                  <linearGradient id="ddGoldGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#F5F5F7" stop-opacity="0.78" />
                    <stop offset="50%" stop-color="#E2B878" stop-opacity="1" />
                    <stop offset="100%" stop-color="#F5DAB0" stop-opacity="1" />
                  </linearGradient>
                </defs>

                <!-- Two Sleek Geometric Diamonds -->
                <polygon class="dd-outline" points="44,95 172,26 300,95 172,164" />
                <polygon class="dd-outline" points="300,95 428,26 556,95 428,164" />

                <!-- Vertical Phase Dividers -->
                <line class="dd-divider" x1="172" y1="26" x2="172" y2="164" />
                <line class="dd-divider" x1="428" y1="26" x2="428" y2="164" />

                <!-- Phase Labels -->
                <text id="ddPhase1" class="dd-phase-label" x="116" y="16" text-anchor="middle">Discover</text>
                <text id="ddPhase2" class="dd-phase-label" x="232" y="16" text-anchor="middle">Define</text>
                <text id="ddPhase3" class="dd-phase-label" x="368" y="16" text-anchor="middle">Develop</text>
                <text id="ddPhase4" class="dd-phase-label" x="484" y="16" text-anchor="middle">Deliver</text>

                <!-- Diverge / Converge micro labels -->
                <text class="dd-sub-label" x="116" y="182" text-anchor="middle">Diverge</text>
                <text class="dd-sub-label" x="232" y="182" text-anchor="middle">Converge</text>
                <text class="dd-sub-label" x="368" y="182" text-anchor="middle">Diverge</text>
                <text class="dd-sub-label" x="484" y="182" text-anchor="middle">Converge</text>

                <!-- Luminous Champagne-Gold Animated Path Across All 4 Phases -->
                <path
                  id="ddTracePath"
                  class="dd-trace"
                  d="M 44 95 L 172 26 L 300 95 L 428 26 L 556 95"
                />

                <!-- Milestone Nodes -->
                <circle id="ddNodeStart" class="dd-node" cx="44" cy="95" r="5" />
                <circle id="ddNodeMid" class="dd-node" cx="300" cy="95" r="6.5" />
                <circle id="ddNodeEnd" class="dd-node" cx="556" cy="95" r="6.5" />

                <!-- Central & Final Milestone Labels -->
                <text id="ddLabelMid" class="dd-milestone" x="300" y="120" text-anchor="middle">Problem Defined</text>
                <text id="ddLabelEnd" class="dd-milestone" x="556" y="120" text-anchor="end">Solution Validated</text>

                <!-- Glowing Tracer Dot -->
                <circle id="ddTracerHalo" class="dd-tracer-halo" cx="44" cy="95" r="11" />
                <circle id="ddTracerDot" class="dd-tracer-dot" cx="44" cy="95" r="4.5" />
              </svg>
            </div>
          </div>

          <!-- Top-Right Bento: Radial Ring Gauge + Smooth Bezier Area Chart -->
          <div class="bento s2-card delay-2 telemetry-card">
            <div class="s2-card-head">
              <div class="bento-eyebrow mono">Usability Telemetry</div>
              <span id="frictionCounter" class="friction-pill mono tabular">0% Friction</span>
            </div>

            <div class="telemetry-combo">
              <div class="ring-mini-col">
                <div class="ring-stage">
                  <svg class="ring-svg" viewBox="0 0 180 180" aria-hidden="true">
                    <defs>
                      <linearGradient id="ringGoldGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#F6DFB7" />
                        <stop offset="100%" stop-color="#E2B878" />
                      </linearGradient>
                    </defs>
                    <circle class="ring-track" cx="90" cy="90" r="74" />
                    <circle id="ringProgress" class="ring-progress" cx="90" cy="90" r="74" />
                  </svg>

                  <div class="ring-center">
                    <div id="ringCounter" class="ring-value tabular">0.0%</div>
                    <div class="ring-label">Task Success</div>
                  </div>
                </div>
                <div class="sus-pill mono">SUS <span>91/100</span></div>
              </div>

              <div class="bezier-col">
                <div class="bento-eyebrow mono" style="font-size: 0.64rem;">Cognitive Friction</div>
                <div class="bezier-wrap">
                  <svg class="bezier-svg" viewBox="0 0 280 110" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#E2B878" stop-opacity="0.34" />
                        <stop offset="90%" stop-color="#E2B878" stop-opacity="0.02" />
                        <stop offset="100%" stop-color="#E2B878" stop-opacity="0" />
                      </linearGradient>
                      <linearGradient id="goldStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stop-color="#F5F5F7" stop-opacity="0.7" />
                        <stop offset="50%" stop-color="#E2B878" stop-opacity="1" />
                        <stop offset="100%" stop-color="#F5DAB0" stop-opacity="1" />
                      </linearGradient>
                    </defs>

                    <line class="chart-grid-line" x1="0" y1="22" x2="280" y2="22" />
                    <line class="chart-grid-line" x1="0" y1="56" x2="280" y2="56" />
                    <line class="chart-grid-line" x1="0" y1="90" x2="280" y2="90" />

                    <path
                      id="bezierArea"
                      class="area-fill"
                      d="M 6 22 C 55 24, 92 40, 136 58 C 180 76, 224 84, 274 88 L 274 108 L 6 108 Z"
                      fill="url(#goldAreaGrad)"
                    />

                    <path
                      id="bezierPath"
                      class="bezier-stroke"
                      d="M 6 22 C 55 24, 92 40, 136 58 C 180 76, 224 84, 274 88"
                    />

                    <circle id="tracerHalo" class="tracer-halo" cx="6" cy="22" r="8" />
                    <circle id="tracerDot" class="tracer-dot" cx="6" cy="22" r="3.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom-Left Bento: Stakeholder Alignment -->
          <div class="bento s2-card delay-3">
            <div class="s2-card-head">
              <div class="bento-eyebrow mono">Stakeholder Alignment</div>
              <button id="btnAlign" type="button" class="action-pill">Align Goals</button>
            </div>

            <div id="stakeholderTrack" class="stakeholder-track">
              <span id="sh1" class="sh-node"><span class="sh-dot"></span>Product</span>
              <span id="shc1" class="sh-conn"></span>
              <span id="sh2" class="sh-node"><span class="sh-dot"></span>Engineering</span>
              <span id="shc2" class="sh-conn"></span>
              <span id="sh3" class="sh-node"><span class="sh-dot"></span>Business</span>
              <span id="shc3" class="sh-conn"></span>
              <span id="sh4" class="sh-node"><span class="sh-dot"></span>Users</span>
            </div>
          </div>

          <!-- Bottom-Right Bento: Non-Negotiable Constraints -->
          <div class="bento s2-card delay-4">
            <div class="s2-card-head">
              <div class="bento-eyebrow mono">Non-Negotiable Constraints</div>
              <span class="bento-eyebrow gold mono">Guardrails</span>
            </div>

            <div class="constraints-grid">
              <div id="con1" class="constraint-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <span>WCAG AA Contrast</span>
              </div>
              <div id="con2" class="constraint-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <span>Zero Dead-Ends</span>
              </div>
              <div id="con3" class="constraint-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <span>Tech Feasibility</span>
              </div>
              <div id="con4" class="constraint-pill">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <span class="mono">&lt; 100ms Latency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================================
           SCENE 3 (9.0s - 16.0s): CREATIVE AI — APPLE INTELLIGENCE PROMPT PILL
           ====================================================================== -->
      <section id="scene3" class="scene">
        <header class="scene-header">
          <div class="headline-mask">
            <h1 class="headline"><span class="metallic">CREATIVE</span> <span class="gold">AI</span></h1>
          </div>
          <span class="header-tag mono">Generative Product Synthesis</span>
        </header>

        <div class="s3-stage">
          <div id="s3Camera" class="s3-camera">
            <!-- 3 Massive Concentric Edge-to-Edge Expanding Rings -->
            <div id="echo1" class="echo-ring r1" aria-hidden="true"></div>
            <div id="echo2" class="echo-ring r2" aria-hidden="true"></div>
            <div id="echo3" class="echo-ring r3" aria-hidden="true"></div>

            <!-- Sculptural Glassmorphic AI Prompt Pill with Rotating Luminous Halo -->
            <div id="aiPillWrap" class="pill-halo-wrap">
              <div class="ai-pill-inner">
                <div class="pill-input-area">
                  <div class="prompt-text-wrap">
                    <span id="promptTyped"></span>
                    <span class="gold-caret" aria-hidden="true"></span>
                  </div>
                </div>

                <button id="btnAiSubmit" type="button" class="ai-submit-btn" aria-label="Submit prompt">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19V5" />
                    <path d="M5 12l7-7 7 7" />
                  </svg>
                </button>

                <div class="synth-view">
                  <div class="wave-bars" aria-hidden="true">
                    <span class="wave-bar"></span>
                    <span class="wave-bar"></span>
                    <span class="wave-bar"></span>
                    <span class="wave-bar"></span>
                    <span class="wave-bar"></span>
                  </div>
                  <span>Synthesizing…</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Live Generated Website Preview Window -->
          <div id="aiSitePreview" class="bento ai-site-preview" aria-label="AI Generated Website Preview">
            <div class="specular-sweep" aria-hidden="true"></div>

            <div class="site-chrome">
              <div class="site-dots" aria-hidden="true">
                <span class="site-dot gold"></span>
                <span class="site-dot"></span>
                <span class="site-dot"></span>
              </div>
              <div class="site-url mono">https://aether-system.studio</div>
              <div class="site-live-badge mono">Generated · 0.6s</div>
            </div>

            <div class="site-body">
              <div class="site-nav">
                <div class="site-brand">Aether<span>.</span></div>
                <div class="site-nav-links">
                  <span>Architecture</span>
                  <span>Tokens</span>
                  <span>Motion</span>
                </div>
                <span class="site-nav-cta">Launch</span>
              </div>

              <div class="site-hero">
                <div class="site-hero-copy">
                  <div class="bento-eyebrow gold mono">8pt Optical Rhythm · WCAG AAA</div>
                  <div class="site-hero-title">Spatial Interfaces, <span>Engineered.</span></div>
                  <div class="site-hero-sub">Adaptive design systems compiled from natural language with native 60fps transitions and zero layout shift.</div>
                  <div class="site-hero-actions">
                    <span class="site-btn-primary">Deploy System</span>
                    <span class="site-btn-ghost">Inspect Tokens</span>
                  </div>
                </div>

                <div class="site-hero-visual">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span class="bento-eyebrow mono" style="font-size: 0.64rem;">Live Layout Matrix</span>
                    <span class="mono" style="font-size: 0.68rem; color: var(--gold);">60 FPS</span>
                  </div>
                  <div class="site-vis-bars" aria-hidden="true">
                    <div class="site-vis-bar" style="height: 46%;"></div>
                    <div class="site-vis-bar" style="height: 68%;"></div>
                    <div class="site-vis-bar gold" style="height: 94%;"></div>
                    <div class="site-vis-bar" style="height: 62%;"></div>
                    <div class="site-vis-bar" style="height: 78%;"></div>
                  </div>
                </div>
              </div>

              <div class="site-features">
                <div class="site-feat-card">
                  <span class="site-feat-title">Adaptive 8pt Grid</span>
                  <span class="site-feat-meta mono">Fluid clamp() · 0px overflow</span>
                </div>
                <div class="site-feat-card">
                  <span class="site-feat-title">Semantic Tokens</span>
                  <span class="site-feat-meta mono">Obsidian · Alabaster · Gold</span>
                </div>
                <div class="site-feat-card">
                  <span class="site-feat-title">Native Motion</span>
                  <span class="site-feat-meta mono">GPU-composited · 14.8:1 AAA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================================
           SCENE 4 (16.0s - 20.5s): WEB DEVELOPER — XCODE / LINEAR TELEMETRY
           ====================================================================== -->
      <section id="scene4" class="scene">
        <header class="scene-header">
          <div class="headline-mask">
            <h1 class="headline"><span class="metallic">WEB</span> <span class="gold">DEVELOPER</span></h1>
          </div>
          <span class="header-tag mono">Semantic Code · 60 FPS Telemetry · Production UI</span>
        </header>

        <div class="s4-grid">
          <!-- Left Column: Clean Code + Real-Time Telemetry -->
          <div class="s4-left-stack">
            <div class="bento code-bento">
              <div class="code-head mono">
                <span>VoltrepSet.tsx</span>
                <span style="color: var(--gold);">TypeScript · Native 60fps</span>
              </div>

              <div class="code-lines mono">
                <div id="codeScanner" class="code-scanner" aria-hidden="true"></div>
                <div class="c-line"><span class="c-num">1</span><span><span class="t-tag">&lt;VoltrepSet</span></span></div>
                <div class="c-line"><span class="c-num">2</span><span>&nbsp;&nbsp;<span class="t-attr">exercise</span>=<span class="t-val">"Hack Squat"</span></span></div>
                <div class="c-line"><span class="c-num">3</span><span>&nbsp;&nbsp;<span class="t-attr">load</span>=<span class="t-val">{120}</span> <span class="t-attr">reps</span>=<span class="t-val">{6}</span></span></div>
                <div class="c-line"><span class="c-num">4</span><span>&nbsp;&nbsp;<span class="t-attr">physics</span>=<span class="t-val">"apple-spring"</span></span></div>
                <div class="c-line"><span class="c-num">5</span><span>&nbsp;&nbsp;<span class="t-attr">onLog</span>=<span class="t-val">{commitVolumePR}</span></span></div>
                <div class="c-line"><span class="c-num">6</span><span><span class="t-tag">/&gt;</span></span></div>
              </div>
            </div>

            <div class="bento telemetry-bento">
              <div class="fps-panel">
                <div>
                  <div class="bento-eyebrow mono">Frame-Time Budget</div>
                  <div class="fps-badge mono"><span>60 FPS</span> · 0.4ms</div>
                </div>
                <svg id="fpsSvg" class="fps-svg" viewBox="0 0 222 66" preserveAspectRatio="none" aria-hidden="true"></svg>
              </div>

              <div class="lighthouse-row">
                <div class="lh-item">
                  <div class="lh-ring-box">
                    <svg class="lh-svg" viewBox="0 0 60 60" aria-hidden="true">
                      <circle class="lh-track" cx="30" cy="30" r="25" />
                      <circle id="lhPerf" class="lh-fill" cx="30" cy="30" r="25" />
                    </svg>
                    <span id="lhPerfNum" class="lh-num mono">0</span>
                  </div>
                  <span class="lh-label mono">Perf</span>
                </div>

                <div class="lh-item">
                  <div class="lh-ring-box">
                    <svg class="lh-svg" viewBox="0 0 60 60" aria-hidden="true">
                      <circle class="lh-track" cx="30" cy="30" r="25" />
                      <circle id="lhA11y" class="lh-fill alabaster" cx="30" cy="30" r="25" />
                    </svg>
                    <span id="lhA11yNum" class="lh-num mono">0</span>
                  </div>
                  <span class="lh-label mono">A11y</span>
                </div>

                <div class="lh-item">
                  <div class="lh-ring-box">
                    <svg class="lh-svg" viewBox="0 0 60 60" aria-hidden="true">
                      <circle class="lh-track" cx="30" cy="30" r="25" />
                      <circle id="lhSeo" class="lh-fill" cx="30" cy="30" r="25" />
                    </svg>
                    <span id="lhSeoNum" class="lh-num mono">0</span>
                  </div>
                  <span class="lh-label mono">SEO</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Live Rendered Voltrep Interactive Card -->
          <div id="voltrepCard" class="bento voltrep-bento">
            <nav id="segmentedNav" class="segmented-nav" aria-label="Voltrep Views">
              <div class="seg-indicator"></div>
              <div class="seg-tab">Overview</div>
              <div class="seg-tab">Live Set</div>
              <div class="seg-tab">Analytics</div>
            </nav>

            <div class="voltrep-mid">
              <div class="workout-top">
                <div>
                  <div class="bento-eyebrow gold mono">Voltrep Live Logger</div>
                  <div class="workout-title">Hack Squat</div>
                  <div class="workout-stats mono"><strong>120 kg</strong> × <strong>6 reps</strong></div>
                </div>
                <span id="prBadge" class="pr-badge mono">+5 kg PR</span>
              </div>

              <div class="volume-chart" aria-label="Volume Progression Chart">
                <div class="vol-col">
                  <div class="vol-bar" style="height: 44%;"></div>
                  <span class="vol-lbl mono">W1</span>
                </div>
                <div class="vol-col">
                  <div class="vol-bar" style="height: 54%;"></div>
                  <span class="vol-lbl mono">W2</span>
                </div>
                <div class="vol-col">
                  <div class="vol-bar" style="height: 62%;"></div>
                  <span class="vol-lbl mono">W3</span>
                </div>
                <div class="vol-col">
                  <div class="vol-bar" style="height: 70%;"></div>
                  <span class="vol-lbl mono">W4</span>
                </div>
                <div class="vol-col">
                  <div id="volPeakBar" class="vol-bar peak" style="height: 58%;"></div>
                  <span class="vol-lbl mono" style="color: var(--gold);">W5</span>
                </div>
              </div>
            </div>

            <div class="voltrep-foot">
              <span class="mono" style="font-size: 0.74rem; color: var(--titanium);">Volume Progression · Live State</span>
              <button id="btnLogSet" type="button" class="action-pill">Log Set</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Silky Full-Screen Obsidian & Champagne-Gold Loop Reset Sweep -->
      <div id="loopSweep" class="loop-sweep" aria-hidden="true"></div>

      <!-- High-DPI Vector Cursor & Champagne-Gold Ripple -->
      <div id="ripple" class="ripple" aria-hidden="true"></div>
      <div id="cursor" class="cursor" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4.5 3.2L19.2 10.6L12.1 12.6L9.4 19.8L4.5 3.2Z" fill="#F5F5F7" stroke="#050507" stroke-width="1.6" stroke-linejoin="round" />
        </svg>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ==========================================================================
   1. DESIGN TOKENS — PURE 3-TONE APPLE KEYNOTE PALETTE (ZERO GREEN)
   ========================================================================== */
.showreel-host {
  --bg-obsidian: #050507;
  --bento-bg: #0D0F14;
  --bento-surface: rgba(13, 15, 20, 0.84);
  --surface-subtle: rgba(255, 255, 255, 0.035);
  --border-hairline: rgba(255, 255, 255, 0.09);
  --border-specular: rgba(255, 255, 255, 0.16);

  --alabaster: #F5F5F7;
  --titanium: #8E8E93;
  --dim: #48484D;

  --gold: #E2B878;
  --gold-bright: #F2D29B;
  --gold-soft: rgba(226, 184, 120, 0.12);
  --gold-border: rgba(226, 184, 120, 0.44);
  --gold-glow: rgba(226, 184, 120, 0.32);

  --ease-apple: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

  width: 100%;
  background-color: var(--bg-obsidian);
  color: var(--alabaster);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.showreel-host *,
.showreel-host *::before,
.showreel-host *::after {
  box-sizing: border-box;
}

.mono {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.tabular {
  font-variant-numeric: tabular-nums;
}

/* ==========================================================================
   2. FULL-BLEED STAGE (100vw x 100vh) & AMBIENT LIGHT BLOOMS
   ========================================================================== */
.stage {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100svh;
  background-color: var(--bg-obsidian);
  overflow: hidden;
  isolation: isolate;
  user-select: none;
}

.ambient-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.bloom {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  will-change: transform, opacity;
}

.bloom-gold {
  width: 54vw;
  height: 54vw;
  max-width: 800px;
  max-height: 800px;
  top: -24%;
  right: -14%;
  background: radial-gradient(circle, rgba(226, 184, 120, 0.10) 0%, rgba(226, 184, 120, 0) 70%);
  animation: driftGold 16s ease-in-out infinite alternate;
}

.bloom-alabaster {
  width: 50vw;
  height: 50vw;
  max-width: 740px;
  max-height: 740px;
  bottom: -26%;
  left: -12%;
  background: radial-gradient(circle, rgba(245, 245, 247, 0.05) 0%, rgba(245, 245, 247, 0) 70%);
  animation: driftAlabaster 20s ease-in-out infinite alternate;
}

@keyframes driftGold {
  0%   { transform: translate3d(0, 0, 0) scale(1); opacity: 0.72; }
  100% { transform: translate3d(-7%, 9%, 0) scale(1.12); opacity: 1; }
}

@keyframes driftAlabaster {
  0%   { transform: translate3d(0, 0, 0) scale(0.96); opacity: 0.55; }
  100% { transform: translate3d(6%, -8%, 0) scale(1.08); opacity: 0.92; }
}

/* ==========================================================================
   2B. OPENING IDENTITY INTRO -> DOCKS SMOOTHLY TO TOP-LEFT
   ========================================================================== */
.intro-brand {
  position: absolute;
  top: clamp(16px, 2.2vh, 24px);
  left: clamp(20px, 3.6vw, 52px);
  z-index: 30;
  pointer-events: none;
  transform-origin: center center;
  will-change: transform, opacity;
}

.intro-brand.is-docking {
  opacity: 0;
  transition: transform 1.05s var(--ease-apple), opacity 0.42s var(--ease-smooth) 0.52s;
}

.intro-name-mask {
  overflow: hidden;
  padding-bottom: 2px;
}

.intro-name {
  display: inline-block;
  font-size: clamp(0.96rem, 1.35vw, 1.2rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
  white-space: nowrap;
  transform: translateY(115%);
  opacity: 0;
  transition: transform 0.85s var(--ease-apple), opacity 0.45s var(--ease-smooth);
  will-change: transform, opacity;
}

.intro-name .metallic {
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(245, 245, 247, 0.78) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.intro-name .gold {
  background: linear-gradient(180deg, #F5DAB0 0%, #E2B878 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.intro-brand.is-revealed .intro-name {
  transform: translateY(0%);
  opacity: 1;
}

.intro-role {
  position: absolute;
  top: calc(100% + 7px);
  left: 50%;
  transform: translate3d(-50%, 8px, 0);
  font-size: 0.48rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--titanium);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.55s var(--ease-smooth) 0.22s, transform 0.72s var(--ease-apple) 0.22s;
}

.intro-brand.is-revealed .intro-role {
  opacity: 1;
  transform: translate3d(-50%, 0, 0);
}

.intro-brand.is-docking .intro-role {
  opacity: 0;
  transform: translate3d(-50%, -6px, 0);
  transition: opacity 0.32s var(--ease-smooth) 0s, transform 0.36s var(--ease-apple) 0s;
}

/* ==========================================================================
   3. SCENE ISOLATION & APPLE-STYLE SPATIAL CROSS-MORPHS
   ========================================================================== */
.scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: clamp(54px, 7.6vh, 80px) clamp(20px, 3.6vw, 52px) clamp(20px, 3.6vw, 52px);
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.4vh, 28px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: scale(0.96);
  filter: blur(6px);
  transition:
    opacity 0.44s var(--ease-apple),
    transform 0.68s var(--ease-apple),
    filter 0.48s var(--ease-apple),
    visibility 0s linear 0.48s;
  will-change: transform, opacity, filter;
  z-index: 2;
}

.scene.is-active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: scale(1);
  filter: blur(0px);
  transition:
    opacity 0.44s var(--ease-apple),
    transform 0.68s var(--ease-apple),
    filter 0.48s var(--ease-apple),
    visibility 0s linear 0s;
  z-index: 5;
}

.scene.is-exiting {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: scale(0.96);
  filter: blur(6px);
  z-index: 3;
}

/* Display Header */
.scene-header {
  position: relative;
  z-index: 12;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;
}

.headline-mask {
  overflow: hidden;
  padding-bottom: 4px;
  transform-origin: center center;
  will-change: transform;
}

.headline-mask.is-docking {
  transition: transform 0.78s var(--ease-apple);
}

.headline {
  margin: 0;
  font-size: clamp(2.1rem, 4.8vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1;
  transform: translateY(112%);
  opacity: 0;
  transition: transform 0.62s var(--ease-apple), opacity 0.34s var(--ease-smooth);
  will-change: transform, opacity;
}

.headline .metallic {
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(245, 245, 247, 0.72) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.headline .gold {
  background: linear-gradient(180deg, #F5DAB0 0%, #E2B878 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.scene.is-active .headline {
  transform: translateY(0%);
  opacity: 1;
}

.header-tag {
  padding: 8px 15px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-hairline);
  color: var(--titanium);
  font-size: 0.75rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(10px);
  transition: transform 0.6s var(--ease-apple) 0.08s, opacity 0.4s var(--ease-smooth) 0.08s;
}

.scene.is-content-visible .header-tag {
  opacity: 1;
  transform: translateY(0);
}

/* Brushed Dark Glass Bento Surface */
.bento {
  position: relative;
  background:
    radial-gradient(120% 80% at 50% 0%, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0) 60%),
    var(--bento-surface);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid var(--border-hairline);
  border-radius: 24px;
  box-shadow:
    inset 0 1px 0 var(--border-specular),
    0 24px 60px rgba(0, 0, 0, 0.52);
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}

.bento-eyebrow {
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--titanium);
}

.bento-eyebrow.gold {
  color: var(--gold);
}

/* Action Pill Button */
.action-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 9999px;
  background: rgba(245, 245, 247, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: var(--alabaster);
  font-family: var(--font-sans);
  font-size: 0.84rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  flex-shrink: 0;
  transition:
    transform 0.16s var(--ease-apple),
    background-color 0.32s var(--ease-apple),
    border-color 0.32s var(--ease-apple),
    color 0.32s var(--ease-apple),
    box-shadow 0.32s var(--ease-apple);
  will-change: transform;
}

.action-pill.is-hovered {
  background: rgba(245, 245, 247, 0.14);
  border-color: var(--gold-border);
}

.action-pill.is-pressed {
  transform: scale(0.92);
}

.action-pill.is-validated {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--bg-obsidian);
  box-shadow: 0 0 32px rgba(226, 184, 120, 0.44);
}

/* Specular Sheen Sweep */
.specular-sweep {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    108deg,
    transparent 25%,
    rgba(226, 184, 120, 0.16) 46%,
    rgba(245, 245, 247, 0.14) 50%,
    transparent 68%
  );
  transform: translateX(-120%);
  z-index: 10;
}

.bento.is-swept .specular-sweep {
  transition: transform 0.88s var(--ease-apple);
  transform: translateX(120%);
}

/* ==========================================================================
   4. SCENE 1: UX/UI DESIGNER — APPLE DESIGN SYSTEM BENTO
   ========================================================================== */
.stage-hairlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.6s var(--ease-apple) 0.12s;
}

.scene.is-content-visible .stage-hairlines {
  opacity: 1;
}

.stage-hl {
  position: absolute;
  background: rgba(255, 255, 255, 0.045);
}

.stage-hl.h-top { left: 0; right: 0; top: clamp(46px, 6.4vh, 66px); height: 1px; }
.stage-hl.h-bot { left: 0; right: 0; bottom: clamp(20px, 3.6vw, 52px); height: 1px; }
.stage-hl.v-left { top: 0; bottom: 0; left: clamp(20px, 3.6vw, 52px); width: 1px; }
.stage-hl.v-right { top: 0; bottom: 0; right: clamp(20px, 3.6vw, 52px); width: 1px; }

.s1-grid {
  position: relative;
  z-index: 2;
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr);
  gap: clamp(16px, 2.2vw, 28px);
}

.s1-main-bento {
  padding: clamp(20px, 2.4vw, 32px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  opacity: 0;
  transform: translateY(20px);
  transition: transform 0.72s var(--ease-apple) 0.06s, opacity 0.45s var(--ease-smooth) 0.06s;
}

.scene.is-content-visible .s1-main-bento {
  opacity: 1;
  transform: translateY(0);
}

.artboard-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-hairline);
}

.artboard-heading {
  font-size: 0.98rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.spacing-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.42s var(--ease-smooth), transform 0.56s var(--ease-apple);
}

.s1-main-bento.is-snapped .spacing-badges {
  opacity: 1;
  transform: translateY(0);
}

.space-badge {
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--gold-soft);
  border: 1px solid var(--gold-border);
  color: var(--gold);
  font-size: 0.7rem;
  font-weight: 600;
}

/* Interactive UI System Artboard with Magnetic 8pt Alignment Hairlines */
.artboard-canvas {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(5, 5, 7, 0.56);
  border: 1px solid var(--border-hairline);
  overflow: hidden;
}

.guide-line {
  position: absolute;
  background: rgba(226, 184, 120, 0.34);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.48s var(--ease-apple);
}

.guide-line.h1 { left: 0; right: 0; top: 18px; height: 1px; }
.guide-line.h2 { left: 0; right: 0; bottom: 18px; height: 1px; }
.guide-line.v1 { top: 0; bottom: 0; left: 18px; width: 1px; }
.guide-line.v2 { top: 0; bottom: 0; right: 18px; width: 1px; }

.s1-main-bento.is-snapped .guide-line {
  opacity: 1;
}

.ui-header-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 14px;
  background: var(--surface-subtle);
  border: 1px solid var(--border-hairline);
  transform: translate3d(-12px, -10px, 0);
  transition: transform 0.76s var(--ease-apple), border-color 0.48s var(--ease-apple);
}

.s1-main-bento.is-snapped .ui-header-strip {
  transform: translate3d(0, 0, 0);
  border-color: rgba(226, 184, 120, 0.32);
}

.ui-pill-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(245, 245, 247, 0.22);
}

.mini-dot.gold {
  background: var(--gold);
}

.ui-card-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.sys-card {
  padding: 16px;
  border-radius: 14px;
  background: var(--surface-subtle);
  border: 1px solid var(--border-hairline);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 112px;
  transition: transform 0.76s var(--ease-apple), border-color 0.48s var(--ease-apple);
  will-change: transform;
}

.sys-card.c1 { transform: translate3d(-16px, 16px, 0); }
.sys-card.c2 { transform: translate3d(0, 22px, 0); }
.sys-card.c3 { transform: translate3d(16px, -14px, 0); }

.s1-main-bento.is-snapped .sys-card {
  transform: translate3d(0, 0, 0);
  border-color: rgba(255, 255, 255, 0.14);
}

/* Champagne-gold 16px / 24px spacing redlines between modular blocks */
.redline-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  opacity: 0;
  transform: scaleX(0.94);
  transition: opacity 0.5s var(--ease-apple) 0.18s, transform 0.6s var(--ease-apple) 0.18s;
}

.s1-main-bento.is-snapped .redline-row {
  opacity: 1;
  transform: scaleX(1);
}

.redline-seg {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.redline-bar {
  flex: 1;
  height: 1px;
  background: repeating-linear-gradient(
    90deg,
    rgba(226, 184, 120, 0.72) 0 4px,
    transparent 4px 8px
  );
}

.redline-tag {
  font-size: 0.66rem;
  color: var(--gold);
  background: var(--gold-soft);
  border: 1px solid var(--gold-border);
  padding: 2px 7px;
  border-radius: 999px;
  white-space: nowrap;
}

.sys-label {
  font-size: 0.7rem;
  color: var(--titanium);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.sk-line {
  height: 6px;
  border-radius: 99px;
  background: rgba(245, 245, 247, 0.14);
  margin-top: 8px;
}

.sk-line.short {
  width: 66%;
  background: rgba(245, 245, 247, 0.08);
}

.sk-line.accent {
  width: 42%;
  background: rgba(226, 184, 120, 0.45);
}

.artboard-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-hairline);
}

/* Left Single Cohesive Design System Tokens Bento Card */
.s1-tokens-bento {
  padding: clamp(20px, 2.4vw, 30px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: transform 0.72s var(--ease-apple) 0.12s, opacity 0.45s var(--ease-smooth) 0.12s;
}

.scene.is-content-visible .s1-tokens-bento {
  opacity: 1;
  transform: translateY(0);
}

.type-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-hairline);
}

.type-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.specimen-aa {
  font-size: clamp(2.8rem, 4.8vw, 4.2rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 0.92;
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(245, 245, 247, 0.56) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.specimen-meta {
  font-size: 0.72rem;
  color: var(--titanium);
}

.type-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.type-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 10px;
  background: var(--surface-subtle);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.74rem;
}

.type-row .tr-name {
  color: var(--alabaster);
  font-weight: 600;
}

.type-row .tr-spec {
  color: var(--titanium);
}

.swatch-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 8px;
}

.swatch-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.swatch-orb {
  width: clamp(34px, 3.4vw, 44px);
  height: clamp(34px, 3.4vw, 44px);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform 0.45s var(--ease-apple), box-shadow 0.45s var(--ease-apple);
}

.swatch-orb.obs {
  background: radial-gradient(circle at 32% 28%, #1C1E26 0%, #050507 75%);
}

.swatch-orb.gls {
  background: radial-gradient(circle at 32% 28%, #252A36 0%, #0D0F14 80%);
}

.swatch-orb.ala {
  background: radial-gradient(circle at 32% 28%, #FFFFFF 0%, #D2D2D7 85%);
  box-shadow: 0 0 18px rgba(245, 245, 247, 0.16);
}

.swatch-orb.gld {
  background: radial-gradient(circle at 32% 28%, #F6DFB7 0%, #E2B878 80%);
  border-color: var(--gold);
  box-shadow: 0 0 24px rgba(226, 184, 120, 0.34);
}

.swatch-code {
  font-size: 0.66rem;
  color: var(--titanium);
  text-align: center;
}

.swatch-name {
  font-size: 0.64rem;
  color: var(--dim);
  text-align: center;
}

.contrast-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--gold-soft);
  border: 1px solid var(--gold-border);
  color: var(--gold);
  font-size: 0.72rem;
  font-weight: 600;
}

/* ==========================================================================
   5. SCENE 2: USER RESEARCH — DOUBLE DIAMOND & TELEMETRY
   ========================================================================== */
.s2-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.38fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1.18fr) minmax(0, 0.82fr);
  gap: clamp(14px, 1.8vw, 22px);
}

.s2-card {
  padding: clamp(16px, 2vw, 26px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  opacity: 0;
  transform: translateY(18px);
  transition: transform 0.68s var(--ease-apple) 0.06s, opacity 0.44s var(--ease-smooth) 0.06s;
}

.scene.is-content-visible .s2-card {
  opacity: 1;
  transform: translateY(0);
}

.s2-card.delay-2 { transition-delay: 0.15s; }
.s2-card.delay-3 { transition-delay: 0.2s; }
.s2-card.delay-4 { transition-delay: 0.24s; }

.s2-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
}

/* Top-Left: Interactive SVG Double Diamond */
.diamond-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.diamond-svg {
  width: 100%;
  height: 100%;
  max-height: 220px;
  overflow: visible;
}

.dd-outline {
  fill: rgba(255, 255, 255, 0.025);
  stroke: rgba(255, 255, 255, 0.14);
  stroke-width: 1.4;
  stroke-linejoin: round;
}

.dd-divider {
  stroke: rgba(255, 255, 255, 0.09);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}

.dd-trace {
  fill: none;
  stroke: url(#ddGoldGrad);
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 10px rgba(226, 184, 120, 0.52));
}

.dd-node {
  fill: #0D0F14;
  stroke: rgba(255, 255, 255, 0.28);
  stroke-width: 2;
  transition: fill 0.4s var(--ease-apple), stroke 0.4s var(--ease-apple);
}

.dd-node.is-lit {
  fill: var(--gold);
  stroke: #F5F5F7;
  filter: drop-shadow(0 0 10px rgba(226, 184, 120, 0.75));
}

.dd-phase-label {
  fill: var(--titanium);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: fill 0.36s ease;
}

.dd-phase-label.is-lit {
  fill: var(--gold);
}

.dd-sub-label {
  fill: var(--dim);
  font-family: var(--font-sans);
  font-size: 9.5px;
}

.dd-milestone {
  fill: var(--titanium);
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  transition: fill 0.4s ease;
}

.dd-milestone.is-lit {
  fill: var(--alabaster);
}

.dd-tracer-halo {
  fill: rgba(226, 184, 120, 0.28);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dd-tracer-dot {
  fill: #F5F5F7;
  stroke: var(--gold);
  stroke-width: 2.5;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dd-tracer-halo.is-active,
.dd-tracer-dot.is-active {
  opacity: 1;
}

/* Top-Right: Combined Ring Gauge + Smooth Bezier Area Chart */
.telemetry-combo {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 14px;
  align-items: center;
}

.ring-mini-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ring-stage {
  position: relative;
  width: clamp(104px, 12.5vh, 136px);
  height: clamp(104px, 12.5vh, 136px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  overflow: visible;
}

.ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 11;
}

.ring-progress {
  fill: none;
  stroke: url(#ringGoldGrad);
  stroke-width: 11;
  stroke-linecap: round;
  filter: drop-shadow(0 0 10px rgba(226, 184, 120, 0.44));
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.ring-value {
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--alabaster);
}

.ring-label {
  font-size: 0.62rem;
  color: var(--titanium);
  margin-top: 2px;
}

.sus-pill {
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--surface-subtle);
  border: 1px solid var(--border-hairline);
  color: var(--alabaster);
  font-size: 0.68rem;
  white-space: nowrap;
}

.sus-pill span {
  color: var(--gold);
  font-weight: 600;
}

.bezier-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 108px;
  gap: 8px;
}

.friction-pill {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--gold-soft);
  border: 1px solid var(--gold-border);
  color: var(--gold);
  font-size: 0.7rem;
  font-weight: 600;
}

.bezier-wrap {
  position: relative;
  flex: 1;
  min-height: 76px;
  display: flex;
  align-items: flex-end;
}

.bezier-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.chart-grid-line {
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 1;
}

.area-fill {
  opacity: 0;
  transition: opacity 0.9s var(--ease-apple) 0.18s;
}

.area-fill.is-visible {
  opacity: 1;
}

.bezier-stroke {
  fill: none;
  stroke: url(#goldStrokeGrad);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 8px rgba(226, 184, 120, 0.45));
}

.tracer-halo {
  fill: rgba(226, 184, 120, 0.28);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tracer-dot {
  fill: #F5F5F7;
  stroke: var(--gold);
  stroke-width: 2.2;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tracer-dot.is-active,
.tracer-halo.is-active {
  opacity: 1;
}

/* Bottom-Left: Stakeholder Alignment */
.stakeholder-track {
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0;
}

.sh-node {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--titanium);
  font-size: clamp(0.72rem, 0.95vw, 0.84rem);
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  transition:
    background-color 0.44s var(--ease-apple),
    border-color 0.44s var(--ease-apple),
    color 0.44s var(--ease-apple),
    box-shadow 0.44s var(--ease-apple);
}

.sh-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dim);
  transition: background-color 0.4s ease, box-shadow 0.4s ease;
}

.sh-node.is-aligned {
  background: var(--gold-soft);
  border-color: var(--gold-border);
  color: var(--alabaster);
  box-shadow: 0 0 22px rgba(226, 184, 120, 0.16);
}

.sh-node.is-aligned .sh-dot {
  background: var(--gold);
  box-shadow: 0 0 10px rgba(226, 184, 120, 0.85);
}

.sh-conn {
  flex: 1;
  height: 2px;
  min-width: 8px;
  margin: 0 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  position: relative;
  overflow: hidden;
}

.sh-conn::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.46s var(--ease-apple);
  box-shadow: 0 0 10px rgba(226, 184, 120, 0.65);
}

.sh-conn.is-lit::after {
  transform: scaleX(1);
}

/* Bottom-Right: Non-Negotiable Constraints */
.constraints-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  align-content: center;
}

.constraint-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.10);
  color: var(--titanium);
  font-size: clamp(0.7rem, 0.88vw, 0.8rem);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition:
    background-color 0.44s var(--ease-apple),
    border-color 0.44s var(--ease-apple),
    color 0.44s var(--ease-apple),
    box-shadow 0.44s var(--ease-apple);
}

.constraint-pill svg {
  flex-shrink: 0;
  color: var(--dim);
  transition: color 0.4s ease;
}

.constraint-pill.is-locked {
  background: var(--gold-soft);
  border-color: var(--gold-border);
  color: var(--alabaster);
  box-shadow: 0 0 18px rgba(226, 184, 120, 0.14);
}

.constraint-pill.is-locked svg {
  color: var(--gold);
}

/* ==========================================================================
   6. SCENE 3: CREATIVE AI — APPLE INTELLIGENCE PROMPT PILL
   ========================================================================== */
.s3-stage {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  opacity: 0;
  transform: translateY(22px) scale(0.97);
  transition: transform 0.72s var(--ease-apple), opacity 0.46s var(--ease-smooth);
}

.scene.is-content-visible .s3-stage {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.s3-camera {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.85s var(--ease-apple);
  will-change: transform;
}

.s3-camera.is-zoomed {
  transform: scale(1.18);
}

.s3-camera.is-dismissed {
  opacity: 0;
  transform: translateY(-22px) scale(0.92);
  pointer-events: none;
  transition: transform 0.56s var(--ease-apple), opacity 0.36s var(--ease-smooth);
}

/* Live Generated Website Preview Window (Scene 3 Reveal) */
.ai-site-preview {
  position: absolute;
  inset: 0;
  z-index: 6;
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  transform: translateY(28px) scale(0.95);
  transition:
    opacity 0.52s var(--ease-apple),
    transform 0.78s var(--ease-apple),
    border-color 0.5s var(--ease-apple);
  will-change: transform, opacity;
}

.ai-site-preview.is-built {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
  border-color: var(--gold-border);
  box-shadow:
    inset 0 1px 0 rgba(226, 184, 120, 0.32),
    0 30px 80px rgba(0, 0, 0, 0.72),
    0 0 48px rgba(226, 184, 120, 0.12);
}

.site-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-hairline);
  background: rgba(255, 255, 255, 0.025);
  flex-shrink: 0;
}

.site-dots {
  display: flex;
  align-items: center;
  gap: 7px;
}

.site-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(245, 245, 247, 0.16);
}

.site-dot.gold {
  background: var(--gold);
  box-shadow: 0 0 8px rgba(226, 184, 120, 0.55);
}

.site-url {
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(5, 5, 7, 0.62);
  border: 1px solid var(--border-hairline);
  font-size: 0.7rem;
  color: var(--titanium);
  letter-spacing: 0.01em;
}

.site-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px;
  border-radius: 999px;
  background: var(--gold-soft);
  border: 1px solid var(--gold-border);
  color: var(--gold-bright);
  font-size: 0.68rem;
  font-weight: 600;
}

.site-body {
  flex: 1;
  min-height: 0;
  padding: clamp(16px, 2.2vw, 28px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(14px, 2vh, 22px);
  background:
    radial-gradient(70% 60% at 85% 15%, rgba(226, 184, 120, 0.08) 0%, rgba(226, 184, 120, 0) 70%),
    rgba(5, 5, 7, 0.44);
}

.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.46s var(--ease-apple) 0.14s, transform 0.56s var(--ease-apple) 0.14s;
}

.ai-site-preview.is-built .site-nav {
  opacity: 1;
  transform: translateY(0);
}

.site-brand {
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--alabaster);
}

.site-brand span {
  color: var(--gold);
}

.site-nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 0.74rem;
  color: var(--titanium);
}

.site-nav-cta {
  padding: 6px 13px;
  border-radius: 999px;
  background: rgba(245, 245, 247, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--alabaster);
  font-size: 0.72rem;
  font-weight: 600;
}

.site-hero {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.95fr);
  gap: clamp(16px, 2.4vw, 32px);
  align-items: center;
}

.site-hero-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.54s var(--ease-apple) 0.24s, transform 0.66s var(--ease-apple) 0.24s;
}

.ai-site-preview.is-built .site-hero-copy {
  opacity: 1;
  transform: translateY(0);
}

.site-hero-title {
  font-size: clamp(1.45rem, 2.9vw, 2.55rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--alabaster);
}

.site-hero-title span {
  background: linear-gradient(180deg, #F5DAB0 0%, #E2B878 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.site-hero-sub {
  font-size: clamp(0.76rem, 1vw, 0.9rem);
  line-height: 1.5;
  color: var(--titanium);
  max-width: 44ch;
}

.site-hero-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.site-btn-primary {
  padding: 8px 16px;
  border-radius: 999px;
  background: linear-gradient(180deg, #F5DAB0 0%, #E2B878 100%);
  color: var(--bg-obsidian);
  font-size: 0.76rem;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(226, 184, 120, 0.28);
}

.site-btn-ghost {
  padding: 8px 15px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-hairline);
  color: var(--alabaster);
  font-size: 0.76rem;
  font-weight: 500;
}

.site-hero-visual {
  height: 100%;
  min-height: 132px;
  max-height: 220px;
  border-radius: 18px;
  padding: 16px;
  background:
    radial-gradient(circle at 75% 24%, rgba(226, 184, 120, 0.20) 0%, rgba(226, 184, 120, 0) 60%),
    rgba(13, 15, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 0;
  transform: translateY(18px) scale(0.96);
  transition: opacity 0.56s var(--ease-apple) 0.34s, transform 0.7s var(--ease-apple) 0.34s;
}

.ai-site-preview.is-built .site-hero-visual {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.site-vis-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 74px;
}

.site-vis-bar {
  flex: 1;
  border-radius: 8px 8px 3px 3px;
  background: rgba(245, 245, 247, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.09);
  transform-origin: bottom;
  transform: scaleY(0.15);
  transition: transform 0.72s var(--ease-apple) 0.46s;
}

.site-vis-bar.gold {
  background: linear-gradient(180deg, #F5DAB0 0%, #E2B878 100%);
  border-color: var(--gold);
  box-shadow: 0 0 18px rgba(226, 184, 120, 0.32);
}

.ai-site-preview.is-built .site-vis-bar {
  transform: scaleY(1);
}

.site-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  flex-shrink: 0;
}

.site-feat-card {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border-hairline);
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.48s var(--ease-apple), transform 0.6s var(--ease-apple);
}

.ai-site-preview.is-built .site-feat-card:nth-child(1) { opacity: 1; transform: translateY(0); transition-delay: 0.42s; }
.ai-site-preview.is-built .site-feat-card:nth-child(2) { opacity: 1; transform: translateY(0); transition-delay: 0.50s; }
.ai-site-preview.is-built .site-feat-card:nth-child(3) { opacity: 1; transform: translateY(0); transition-delay: 0.58s; }

.site-feat-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--alabaster);
}

.site-feat-meta {
  font-size: 0.68rem;
  color: var(--titanium);
}

/* 3 Concentric Expanding Rings */
.echo-ring {
  position: absolute;
  width: min(76vw, 820px);
  height: 78px;
  border-radius: 9999px;
  border: 1.5px solid rgba(226, 184, 120, 0.52);
  pointer-events: none;
  opacity: 0;
  transform: scale(0.92);
  will-change: transform, opacity;
}

.echo-ring.is-firing {
  animation: echoExpand 1.15s var(--ease-apple) forwards;
}

.echo-ring.r2.is-firing {
  animation-delay: 0.14s;
  border-color: rgba(245, 245, 247, 0.34);
}

.echo-ring.r3.is-firing {
  animation-delay: 0.28s;
  border-color: rgba(226, 184, 120, 0.28);
}

@keyframes echoExpand {
  0%   { transform: scale(0.96); opacity: 0.9; }
  100% { transform: scale(2.65); opacity: 0; }
}

/* Sculptural Glassmorphic AI Prompt Pill with Rotating Halo */
.pill-halo-wrap {
  position: relative;
  z-index: 4;
  width: min(76vw, 820px);
  height: 76px;
  padding: 1.5px;
  border-radius: 9999px;
  overflow: hidden;
  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.72),
    0 0 46px rgba(226, 184, 120, 0.16);
  transition:
    width 0.68s var(--ease-apple),
    height 0.68s var(--ease-apple),
    box-shadow 0.5s var(--ease-apple);
  will-change: width, height;
}

.pill-halo-wrap::before {
  content: "";
  position: absolute;
  inset: -140%;
  background: conic-gradient(
    from 0deg,
    rgba(226, 184, 120, 0.08) 0deg,
    rgba(245, 218, 176, 0.85) 68deg,
    rgba(245, 245, 247, 0.68) 125deg,
    rgba(226, 184, 120, 0.08) 210deg,
    rgba(226, 184, 120, 0.55) 300deg,
    rgba(226, 184, 120, 0.08) 360deg
  );
  animation: rotateHalo 6.5s linear infinite;
  pointer-events: none;
}

@keyframes rotateHalo {
  to { transform: rotate(360deg); }
}

.pill-halo-wrap.is-synthesizing {
  width: 248px;
  height: 62px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(226, 184, 120, 0.38);
}

.ai-pill-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: rgba(11, 13, 18, 0.94);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 0 12px 0 28px;
  overflow: hidden;
}

.pill-input-area {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: opacity 0.25s ease;
}

.prompt-text-wrap {
  font-size: clamp(0.9rem, 1.35vw, 1.12rem);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--alabaster);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-flex;
  align-items: center;
}

.gold-caret {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  margin-left: 3px;
  border-radius: 2px;
  background: var(--gold);
  box-shadow: 0 0 10px var(--gold-glow);
  animation: blinkCaret 0.9s steps(2, start) infinite;
  flex-shrink: 0;
}

@keyframes blinkCaret {
  0%, 49%  { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.ai-submit-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(226, 184, 120, 0.45);
  background: linear-gradient(180deg, #F5DAB0 0%, #E2B878 100%);
  color: var(--bg-obsidian);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 22px rgba(226, 184, 120, 0.34);
  transition: transform 0.16s var(--ease-apple), box-shadow 0.28s var(--ease-apple), opacity 0.25s ease;
}

.ai-submit-btn.is-hovered {
  box-shadow: 0 0 32px rgba(226, 184, 120, 0.58);
  transform: scale(1.04);
}

.ai-submit-btn.is-pressed {
  transform: scale(0.91);
}

.synth-view {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--gold-bright);
  opacity: 0;
  pointer-events: none;
  transform: scale(0.92);
  transition: opacity 0.36s var(--ease-apple) 0.12s, transform 0.42s var(--ease-apple) 0.12s;
}

.pill-halo-wrap.is-synthesizing .pill-input-area,
.pill-halo-wrap.is-synthesizing .ai-submit-btn {
  opacity: 0;
  pointer-events: none;
}

.pill-halo-wrap.is-synthesizing .synth-view {
  opacity: 1;
  transform: scale(1);
}

.wave-bars {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 18px;
}

.wave-bar {
  width: 3px;
  height: 8px;
  border-radius: 99px;
  background: var(--gold);
  animation: wavePulse 0.72s ease-in-out infinite alternate;
}

.wave-bar:nth-child(2) { animation-delay: 0.12s; }
.wave-bar:nth-child(3) { animation-delay: 0.24s; }
.wave-bar:nth-child(4) { animation-delay: 0.36s; }
.wave-bar:nth-child(5) { animation-delay: 0.48s; }

@keyframes wavePulse {
  0%   { height: 5px; opacity: 0.55; }
  100% { height: 18px; opacity: 1; }
}

/* ==========================================================================
   7. SCENE 4: WEB DEVELOPER — XCODE / LINEAR TELEMETRY
   ========================================================================== */
.s4-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.15fr);
  gap: clamp(16px, 2.2vw, 28px);
}

.s4-left-stack {
  display: grid;
  grid-template-rows: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(14px, 1.8vw, 22px);
  min-height: 0;
}

.code-bento {
  padding: clamp(18px, 2.2vw, 28px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 0;
  transform: translateY(18px);
  transition: transform 0.68s var(--ease-apple) 0.06s, opacity 0.44s var(--ease-smooth) 0.06s;
}

.scene.is-content-visible .code-bento {
  opacity: 1;
  transform: translateY(0);
}

.code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-hairline);
  font-size: 0.74rem;
  color: var(--titanium);
}

.code-lines {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  padding: 10px 4px 2px;
  font-size: clamp(0.76rem, 1.02vw, 0.9rem);
  line-height: 1.4;
}

.code-scanner {
  position: absolute;
  left: -8px;
  right: -8px;
  top: 18%;
  height: 26px;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(226, 184, 120, 0.14), rgba(226, 184, 120, 0.03));
  border-left: 2px solid var(--gold);
  pointer-events: none;
  opacity: 0;
  transition: top 0.48s var(--ease-apple), opacity 0.36s ease;
}

.code-scanner.is-on {
  opacity: 1;
}

.c-line {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  white-space: nowrap;
}

.c-num {
  width: 16px;
  text-align: right;
  color: var(--dim);
  font-size: 0.72rem;
}

.t-tag  { color: var(--gold); }
.t-attr { color: var(--alabaster); }
.t-val  { color: var(--gold-bright); }

.telemetry-bento {
  padding: clamp(18px, 2.2vw, 28px);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  opacity: 0;
  transform: translateY(18px);
  transition: transform 0.68s var(--ease-apple) 0.14s, opacity 0.44s var(--ease-smooth) 0.14s;
}

.scene.is-content-visible .telemetry-bento {
  opacity: 1;
  transform: translateY(0);
}

.fps-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  height: 100%;
}

.fps-badge {
  font-size: clamp(0.86rem, 1.15vw, 1rem);
  font-weight: 700;
  color: var(--alabaster);
}

.fps-badge span {
  color: var(--gold);
}

.fps-svg {
  width: 100%;
  height: 64px;
  display: block;
  overflow: visible;
}

.lighthouse-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  align-items: center;
}

.lh-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.lh-ring-box {
  position: relative;
  width: clamp(50px, 5vw, 62px);
  height: clamp(50px, 5vw, 62px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lh-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.lh-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 4.5;
}

.lh-fill {
  fill: none;
  stroke: var(--gold);
  stroke-width: 4.5;
  stroke-linecap: round;
  stroke-dasharray: 157.08;
  stroke-dashoffset: 157.08;
  transition: stroke-dashoffset 1.05s var(--ease-apple);
  filter: drop-shadow(0 0 6px rgba(226, 184, 120, 0.42));
}

.lh-fill.alabaster {
  stroke: var(--alabaster);
  filter: drop-shadow(0 0 6px rgba(245, 245, 247, 0.28));
}

.lh-fill.is-full {
  stroke-dashoffset: 0;
}

.lh-num {
  position: absolute;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--alabaster);
}

.lh-label {
  font-size: 0.64rem;
  color: var(--titanium);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.voltrep-bento {
  padding: clamp(20px, 2.4vw, 32px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  opacity: 0;
  transform: translateY(20px);
  transition:
    transform 0.72s var(--ease-apple) 0.1s,
    opacity 0.44s var(--ease-smooth) 0.1s,
    border-color 0.48s var(--ease-apple),
    box-shadow 0.48s var(--ease-apple);
}

.scene.is-content-visible .voltrep-bento {
  opacity: 1;
  transform: translateY(0);
}

.voltrep-bento.is-logged {
  border-color: var(--gold-border);
  box-shadow:
    inset 0 1px 0 rgba(226, 184, 120, 0.34),
    0 28px 70px rgba(0, 0, 0, 0.62),
    0 0 42px rgba(226, 184, 120, 0.12);
}

.segmented-nav {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid var(--border-hairline);
}

.seg-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / 3);
  border-radius: 9999px;
  background: rgba(245, 245, 247, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.16);
  transition: transform 0.56s var(--ease-apple);
}

.segmented-nav.at-liveset .seg-indicator {
  transform: translateX(100%);
  background: var(--gold-soft);
  border-color: var(--gold-border);
}

.seg-tab {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 7px 10px;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--titanium);
  transition: color 0.36s ease;
}

.segmented-nav.at-liveset .seg-tab:nth-child(3) {
  color: var(--gold-bright);
}

.voltrep-mid {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
}

.workout-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.workout-title {
  font-size: clamp(1.5rem, 2.6vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  margin-top: 6px;
  color: var(--alabaster);
}

.workout-stats {
  margin-top: 6px;
  font-size: clamp(0.88rem, 1.2vw, 1.05rem);
  color: var(--titanium);
}

.workout-stats strong {
  color: var(--alabaster);
  font-weight: 600;
}

.pr-badge {
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--gold-soft);
  border: 1px solid var(--gold-border);
  color: var(--gold-bright);
  font-size: 0.74rem;
  font-weight: 600;
  opacity: 0;
  transform: translateY(8px) scale(0.92);
  transition: opacity 0.42s var(--ease-apple), transform 0.48s var(--ease-apple);
}

.pr-badge.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.volume-chart {
  flex: 1;
  min-height: 110px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  align-items: end;
  padding: 16px 14px 10px;
  border-radius: 18px;
  background: rgba(5, 5, 7, 0.54);
  border: 1px solid var(--border-hairline);
}

.vol-col {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.vol-bar {
  width: 100%;
  max-width: 44px;
  border-radius: 10px 10px 4px 4px;
  background: rgba(245, 245, 247, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: height 0.68s var(--ease-apple), box-shadow 0.48s var(--ease-apple);
}

.vol-bar.peak {
  background: linear-gradient(180deg, #F3D5A0 0%, #E2B878 100%);
  border-color: var(--gold);
  box-shadow: 0 0 24px rgba(226, 184, 120, 0.38);
}

.vol-lbl {
  font-size: 0.66rem;
  color: var(--dim);
}

.voltrep-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-hairline);
}

/* Full-Screen Obsidian & Champagne Gold Loop Reset Sweep */
.loop-sweep {
  position: absolute;
  inset: 0;
  z-index: 25;
  pointer-events: none;
  background: linear-gradient(
    112deg,
    transparent 0%,
    rgba(226, 184, 120, 0.22) 22%,
    var(--bg-obsidian) 36%,
    var(--bg-obsidian) 100%
  );
  transform: translate3d(118vw, 0, 0);
  will-change: transform;
}

.loop-sweep.is-sweeping {
  transition: transform 0.72s var(--ease-apple);
  transform: translate3d(-16vw, 0, 0);
}

/* ==========================================================================
   8. DYNAMIC HIGH-DPI VECTOR CURSOR & CHAMPAGNE-GOLD RIPPLE
   ========================================================================== */
.cursor {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0;
  transform: translate3d(-120px, -120px, 0);
  will-change: transform, opacity;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.68));
  transition: opacity 0.24s ease;
}

.cursor.is-visible {
  opacity: 1;
}

.cursor svg {
  display: block;
  transition: transform 0.14s var(--ease-apple);
}

.cursor.is-clicking svg {
  transform: scale(0.86);
}

.ripple {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid var(--gold);
  pointer-events: none;
  z-index: 39;
  transform: translate(-50%, -50%) scale(0.4);
  opacity: 0;
}

.ripple.is-popping {
  animation: ripplePop 0.56s var(--ease-apple) forwards;
}

@keyframes ripplePop {
  0%   { transform: translate(-50%, -50%) scale(0.4); opacity: 0.94; }
  100% { transform: translate(-50%, -50%) scale(3.8); opacity: 0; }
}

/* ==========================================================================
   9. RESPONSIVE ADAPTATION (TABLET 768px & MOBILE 390x844 — ZERO OVERLAP)
   ========================================================================== */
@media (max-width: 960px) {
  .s1-grid,
  .s2-grid,
  .s4-grid {
    grid-template-columns: 1fr;
  }
  .site-hero {
    grid-template-columns: 1fr;
  }
  .site-hero-visual {
    display: none;
  }
  .s2-grid {
    grid-template-rows: auto;
  }
  .s4-left-stack {
    grid-template-rows: auto;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .scene-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .header-tag {
    font-size: 0.66rem;
    padding: 5px 11px;
  }
  .s1-tokens-bento,
  .s4-left-stack {
    display: none;
  }
  .site-nav-links,
  .site-features {
    display: none;
  }
  .ui-card-row {
    grid-template-columns: 1fr;
  }
  .sys-card {
    min-height: 68px;
    padding: 12px;
  }
  .s2-card.telemetry-card {
    display: none;
  }
  .stakeholder-track {
    flex-wrap: wrap;
    gap: 6px;
  }
  .sh-node {
    padding: 6px 9px;
    font-size: 0.66rem;
  }
  .pill-halo-wrap {
    height: 64px;
  }
  .ai-submit-btn {
    width: 44px;
    height: 44px;
  }
}

/* ==========================================================================
   10. PREFERS-REDUCED-MOTION CLEAN STATIC FALLBACK
   ========================================================================== */
@media (prefers-reduced-motion: reduce) {
  .bloom, .pill-halo-wrap::before, .wave-bar, .gold-caret {
    animation: none !important;
  }
  .cursor, .ripple, .echo-ring, .loop-sweep {
    display: none !important;
  }
  .intro-brand {
    transform: none !important;
  }
  .intro-name {
    transform: none !important;
    opacity: 1 !important;
  }
  .intro-role {
    display: none !important;
  }
  #scene1 {
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    filter: none !important;
  }
  #scene1 .headline-mask,
  #scene1 .headline,
  #scene1 .header-tag,
  #scene1 .s1-main-bento,
  #scene1 .s1-tokens-bento,
  #scene1 .ui-header-strip,
  #scene1 .sys-card,
  #scene1 .spacing-badges,
  #scene1 .redline-row,
  #scene1 .guide-line {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
