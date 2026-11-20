<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * =========================================================================
 * 20.5s FULL-WIDTH (100vw) LUXURY EDITORIAL HERO SHOWREEL ENGINE
 * Apple · Notion · Linear · Google · 60fps rAF · Dynamic getBoundingClientRect()
 * =========================================================================
 */
const rootRef = ref(null)

let rafId = null

onMounted(() => {
  const root = rootRef.value
  if (!root || typeof window === 'undefined') return

  const q = (id) => root.querySelector(`#${id}`)
  const LOOP_MS = 20500
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const stage = q('stage')
  const introOverlay = q('introOverlay')
  const cursorEl = q('cursor')
  const rippleEl = q('ripple')

  const scenes = {
    1: q('scene1'),
    2: q('scene2'),
    3: q('scene3'),
    4: q('scene4'),
  }

  // Scene 1 refs
  const s1Carousel = q('s1Carousel')
  const s1Artboard = q('s1Artboard')
  const btnValidate = q('btnValidate')

  // Scene 2 refs
  const ddTracePath = q('ddTracePath')
  const DD_LEN = ddTracePath ? ddTracePath.getTotalLength() : 0
  if (ddTracePath) {
    ddTracePath.style.strokeDasharray = `${DD_LEN}`
    ddTracePath.style.strokeDashoffset = `${DD_LEN}`
  }
  const ddPhases = [q('ddPhase1'), q('ddPhase2'), q('ddPhase3'), q('ddPhase4')].filter(Boolean)
  const ddNodeStart = q('ddNodeStart')
  const ddNodeMid = q('ddNodeMid')
  const ddNodeEnd = q('ddNodeEnd')
  const ddTracerDot = q('ddTracerDot')
  const ddTracerHalo = q('ddTracerHalo')
  const frictionCounter = q('frictionCounter')
  const successCounter = q('successCounter')
  const s2RightCard = q('s2RightCard')
  const btnAlign = q('btnAlign')
  const shNodes = [q('sh1'), q('sh2'), q('sh3')].filter(Boolean)

  // Scene 3 refs (Prompt Pill -> Physical Morph into Full Luxury Web App, NO drag-and-drop)
  const s3Camera = q('s3Camera')
  const aiMorphShell = q('aiMorphShell')
  const promptTyped = q('promptTyped')
  const btnSubmitPrompt = q('btnSubmitPrompt')
  const s3Echoes = [q('s3Echo1'), q('s3Echo2'), q('s3Echo3')].filter(Boolean)
  const PROMPT_COPY =
    'Design and build a minimalist luxury workout & habit OS with 8pt grid and 60fps motion.'

  // Scene 4 refs
  const voltrepCard = q('voltrepCard')
  const volPeakBar = q('volPeakBar')
  const prBadge = q('prBadge')
  const btnLogSet = q('btnLogSet')
  const miniNav = q('miniNav')
  const prodCard = q('prodCard')
  const btnReplaySys = q('btnReplaySys')
  const s4Echoes = [q('s4Echo1'), q('s4Echo2'), q('s4Echo3')].filter(Boolean)
  const loopVeil = q('loopVeil')

  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)

  // Dynamic cursor tracking via live getBoundingClientRect()
  const cursor = {
    x: -100,
    y: -100,
    startX: -100,
    startY: -100,
    targetX: -100,
    targetY: -100,
    targetEl: null,
    moveStart: 0,
    duration: 420,
    moving: false,
  }

  function getCenter(el) {
    if (!el || !stage) return { x: 0, y: 0 }
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
    if (!el) return
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

  function snapCursorTo(el) {
    if (!el) return
    const pt = getCenter(el)
    placeCursor(pt.x, pt.y)
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
    if (!el || !rippleEl) return
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
      scenes[idx].classList.remove('is-exiting', 'is-panning-out')
      scenes[idx].classList.toggle('is-active', idx === num)
    })
  }

  function resetAll() {
    if (introOverlay) {
      introOverlay.classList.remove('is-revealed', 'is-docking', 'is-hidden')
    }
    Object.keys(scenes).forEach((k) => {
      const idx = Number(k)
      scenes[idx].classList.remove('is-active', 'is-exiting', 'is-panning-out', 'is-ui-visible')
    })

    // Scene 1
    if (s1Carousel) s1Carousel.dataset.step = '0'
    if (s1Artboard) s1Artboard.classList.remove('is-snapped', 'is-validated-frame')
    if (btnValidate) {
      btnValidate.classList.remove('is-hovered', 'is-pressed', 'is-validated')
      btnValidate.textContent = 'Validate System →'
    }

    // Scene 2
    if (ddTracePath) ddTracePath.style.strokeDashoffset = `${DD_LEN}`
    ddPhases.forEach((p) => p.classList.remove('is-lit'))
    if (ddNodeStart) ddNodeStart.classList.remove('is-lit')
    if (ddNodeMid) ddNodeMid.classList.remove('is-lit')
    if (ddNodeEnd) ddNodeEnd.classList.remove('is-lit')
    if (ddTracerDot) {
      ddTracerDot.classList.remove('is-active')
      ddTracerDot.setAttribute('cx', '36')
      ddTracerDot.setAttribute('cy', '96')
    }
    if (ddTracerHalo) {
      ddTracerHalo.classList.remove('is-active')
      ddTracerHalo.setAttribute('cx', '36')
      ddTracerHalo.setAttribute('cy', '96')
    }
    if (frictionCounter) frictionCounter.textContent = '0% Cognitive Friction'
    if (successCounter) successCounter.textContent = '0.0%'
    if (s2RightCard) s2RightCard.classList.remove('is-morphing')
    if (btnAlign) {
      btnAlign.classList.remove('is-hovered', 'is-pressed', 'is-validated')
      btnAlign.textContent = 'Align Goals'
    }
    shNodes.forEach((n) => n.classList.remove('is-aligned'))

    // Scene 3
    if (s3Camera) s3Camera.classList.remove('is-zoomed', 'is-pulled-back')
    if (aiMorphShell) aiMorphShell.classList.remove('is-app-generated')
    if (promptTyped) promptTyped.textContent = ''
    if (btnSubmitPrompt) btnSubmitPrompt.classList.remove('is-hovered', 'is-pressed')
    s3Echoes.forEach((e) => e.classList.remove('is-firing'))

    // Scene 4
    if (voltrepCard) voltrepCard.classList.remove('is-logged')
    if (volPeakBar) volPeakBar.style.height = '58%'
    if (prBadge) prBadge.classList.remove('is-visible')
    if (btnLogSet) {
      btnLogSet.classList.remove('is-hovered', 'is-pressed', 'is-validated')
      btnLogSet.textContent = 'Log Set'
    }
    if (miniNav) miniNav.classList.remove('is-case-studies')
    if (prodCard) prodCard.classList.remove('is-elevated')
    if (btnReplaySys) btnReplaySys.classList.remove('is-hovered', 'is-pressed')
    s4Echoes.forEach((e) => e.classList.remove('is-firing'))
    if (loopVeil) loopVeil.classList.remove('is-wiping')

    // Cursor
    cursorEl.classList.remove('is-visible', 'is-clicking')
    cursor.moving = false
    cursor.targetEl = null
  }

  const fired = new Set()
  function cue(id, cond, fn) {
    if (cond && !fired.has(id)) {
      fired.add(id)
      fn()
    }
  }

  function renderTimeline(t, now, isFastForward = false) {
    /* =====================================================================
       INTRO (0.0s – 2.2s): BRAND KINETIC LOCK-UP -> GLIDE TO LOWER-LEFT
       ===================================================================== */
    cue('intro_in', t >= 0, () => {
      if (introOverlay) introOverlay.classList.add('is-revealed')
    })
    cue('intro_dock', t >= 1350, () => {
      if (introOverlay) introOverlay.classList.add('is-docking')
    })
    cue('intro_hide', t >= 2150, () => {
      if (introOverlay) introOverlay.classList.add('is-hidden')
    })

    /* =====================================================================
       SCENE 01 (2.2s – 6.7s): UX/UI DESIGN — INLINE PILL + FIGMA CANVAS
       ===================================================================== */
    cue('s1_in', t >= 2200, () => {
      setActiveScene(1)
    })
    cue('s1_word1', t >= 2480, () => {
      if (s1Carousel) s1Carousel.dataset.step = '1'
    })
    cue('s1_word2', t >= 2820, () => {
      if (s1Carousel) s1Carousel.dataset.step = '2'
    })
    // Text-before-UI 180ms lead
    cue('s1_ui', t >= 2380, () => {
      scenes[1].classList.add('is-ui-visible')
    })
    cue('s1_snap', t >= 3050, () => {
      if (s1Artboard) s1Artboard.classList.add('is-snapped')
    })
    cue('s1_glide', t >= 5100, () => {
      const r = stage.getBoundingClientRect()
      placeCursor(r.width * 0.48, r.height * 0.42)
      if (isFastForward) snapCursorTo(btnValidate)
      else glideTo(btnValidate, 450, now)
    })
    cue('s1_hover', t >= 5540, () => {
      if (btnValidate) btnValidate.classList.add('is-hovered')
    })
    cue('s1_click', t >= 5620, () => {
      cursorEl.classList.add('is-clicking')
      if (btnValidate) btnValidate.classList.add('is-pressed')
      if (!isFastForward) fireRipple(btnValidate)
    })
    cue('s1_valid', t >= 5760, () => {
      cursorEl.classList.remove('is-clicking')
      if (btnValidate) {
        btnValidate.classList.remove('is-pressed', 'is-hovered')
        btnValidate.classList.add('is-validated')
        btnValidate.textContent = 'Validated ✓'
      }
      if (s1Artboard) s1Artboard.classList.add('is-validated-frame')
    })
    cue('s1_pan', t >= 6280, () => {
      cursorEl.classList.remove('is-visible')
      scenes[1].classList.add('is-panning-out')
    })

    /* =====================================================================
       SCENE 02 (6.7s – 11.2s): USER RESEARCH — DOUBLE DIAMOND + TELEMETRY
       ===================================================================== */
    cue('s2_in', t >= 6700, () => {
      setActiveScene(2)
    })
    cue('s2_ui', t >= 6880, () => {
      scenes[2].classList.add('is-ui-visible')
      if (ddNodeStart) ddNodeStart.classList.add('is-lit')
      if (ddTracerDot) ddTracerDot.classList.add('is-active')
      if (ddTracerHalo) ddTracerHalo.classList.add('is-active')
    })

    if (t >= 6940 && t <= 9200 && ddTracePath) {
      const p = easeOutCubic(Math.min(1, (t - 6940) / 2050))
      ddTracePath.style.strokeDashoffset = `${DD_LEN * (1 - p)}`
      const pt = ddTracePath.getPointAtLength(p * DD_LEN)
      if (ddTracerDot) {
        ddTracerDot.setAttribute('cx', pt.x.toFixed(1))
        ddTracerDot.setAttribute('cy', pt.y.toFixed(1))
      }
      if (ddTracerHalo) {
        ddTracerHalo.setAttribute('cx', pt.x.toFixed(1))
        ddTracerHalo.setAttribute('cy', pt.y.toFixed(1))
      }
      if (p >= 0.1 && ddPhases[0]) ddPhases[0].classList.add('is-lit')
      if (p >= 0.35 && ddPhases[1]) ddPhases[1].classList.add('is-lit')
      if (p >= 0.5 && ddNodeMid) ddNodeMid.classList.add('is-lit')
      if (p >= 0.65 && ddPhases[2]) ddPhases[2].classList.add('is-lit')
      if (p >= 0.88 && ddPhases[3]) ddPhases[3].classList.add('is-lit')
      if (p >= 0.98 && ddNodeEnd) ddNodeEnd.classList.add('is-lit')

      if (frictionCounter) frictionCounter.textContent = `-${Math.round(p * 42)}% Cognitive Friction`
      if (successCounter) successCounter.textContent = `${(p * 98.4).toFixed(1)}%`
    } else if (t > 9200 && t < 11200) {
      if (ddTracePath) ddTracePath.style.strokeDashoffset = '0'
      if (frictionCounter) frictionCounter.textContent = '-42% Cognitive Friction'
      if (successCounter) successCounter.textContent = '98.4%'
    }

    cue('s2_glide', t >= 9250, () => {
      const r = stage.getBoundingClientRect()
      placeCursor(r.width * 0.62, r.height * 0.45)
      if (isFastForward) snapCursorTo(btnAlign)
      else glideTo(btnAlign, 420, now)
    })
    cue('s2_hover', t >= 9660, () => {
      if (btnAlign) btnAlign.classList.add('is-hovered')
    })
    cue('s2_click', t >= 9740, () => {
      cursorEl.classList.add('is-clicking')
      if (btnAlign) btnAlign.classList.add('is-pressed')
      if (!isFastForward) fireRipple(btnAlign)
    })
    cue('s2_aligned', t >= 9880, () => {
      cursorEl.classList.remove('is-clicking')
      if (btnAlign) {
        btnAlign.classList.remove('is-pressed', 'is-hovered')
        btnAlign.classList.add('is-validated')
        btnAlign.textContent = 'Aligned ✓'
      }
      shNodes.forEach((n) => n.classList.add('is-aligned'))
    })
    cue('s2_morph', t >= 10550, () => {
      cursorEl.classList.remove('is-visible')
      if (s2RightCard) s2RightCard.classList.add('is-morphing')
      scenes[2].classList.add('is-exiting')
    })

    /* =====================================================================
       SCENE 03 (11.2s – 16.0s): CREATIVE AI — MACRO TYPING -> FULL WEB APP
       ===================================================================== */
    cue('s3_in', t >= 11200, () => {
      setActiveScene(3)
    })
    cue('s3_ui', t >= 11360, () => {
      scenes[3].classList.add('is-ui-visible')
      if (s3Camera) s3Camera.classList.add('is-zoomed')
    })

    // Macro Caret Typing (11.4s -> 12.9s)
    if (t >= 11400 && t <= 12920 && promptTyped) {
      const p = Math.min(1, (t - 11400) / 1460)
      promptTyped.textContent = PROMPT_COPY.slice(0, Math.floor(p * PROMPT_COPY.length))
    } else if (t > 12920 && t < 16000 && promptTyped) {
      promptTyped.textContent = PROMPT_COPY
    }

    // Pull back to 1.0 & glide cursor straight to Submit (↑) button
    cue('s3_pullback', t >= 12950, () => {
      if (s3Camera) {
        s3Camera.classList.remove('is-zoomed')
        s3Camera.classList.add('is-pulled-back')
      }
      const r = stage.getBoundingClientRect()
      placeCursor(r.width * 0.56, r.height * 0.62)
      if (isFastForward) snapCursorTo(btnSubmitPrompt)
      else glideTo(btnSubmitPrompt, 300, now)
    })

    cue('s3_hover', t >= 13220, () => {
      if (btnSubmitPrompt) btnSubmitPrompt.classList.add('is-hovered')
    })

    cue('s3_click', t >= 13280, () => {
      cursorEl.classList.add('is-clicking')
      if (btnSubmitPrompt) btnSubmitPrompt.classList.add('is-pressed')
      if (!isFastForward) fireRipple(btnSubmitPrompt)
    })

    // Emit 3 concentric echoes & morph pill directly into full luxury Web App
    cue('s3_morph_app', t >= 13440, () => {
      cursorEl.classList.remove('is-clicking', 'is-visible')
      if (btnSubmitPrompt) btnSubmitPrompt.classList.remove('is-pressed', 'is-hovered')
      s3Echoes.forEach((e) => e.classList.add('is-firing'))
      if (aiMorphShell) aiMorphShell.classList.add('is-app-generated')
    })

    cue('s3_out', t >= 15620, () => {
      scenes[3].classList.add('is-exiting')
    })

    /* =====================================================================
       SCENE 04 (16.0s – 20.5s): MOTION & FRONT-END — VOLTREP + REPLAY LOOP
       ===================================================================== */
    cue('s4_in', t >= 16000, () => {
      s3Echoes.forEach((e) => e.classList.remove('is-firing'))
      setActiveScene(4)
    })
    cue('s4_ui', t >= 16180, () => {
      scenes[4].classList.add('is-ui-visible')
    })
    cue('s4_glide_log', t >= 16480, () => {
      const r = stage.getBoundingClientRect()
      placeCursor(r.width * 0.32, r.height * 0.48)
      if (isFastForward) snapCursorTo(btnLogSet)
      else glideTo(btnLogSet, 400, now)
    })
    cue('s4_click_log', t >= 16900, () => {
      cursorEl.classList.add('is-clicking')
      if (btnLogSet) btnLogSet.classList.add('is-pressed')
      if (!isFastForward) fireRipple(btnLogSet)
    })
    cue('s4_logged', t >= 17050, () => {
      cursorEl.classList.remove('is-clicking')
      if (btnLogSet) {
        btnLogSet.classList.remove('is-pressed')
        btnLogSet.classList.add('is-validated')
        btnLogSet.textContent = 'Set Logged ✓'
      }
      if (voltrepCard) voltrepCard.classList.add('is-logged')
      if (volPeakBar) volPeakBar.style.height = '92%'
      if (prBadge) prBadge.classList.add('is-visible')
    })

    // Elastic Sliding Pill Nav glides to Case Studies (17.55s)
    cue('s4_nav_slide', t >= 17550, () => {
      if (miniNav) miniNav.classList.add('is-case-studies')
      if (prodCard) prodCard.classList.add('is-elevated')
    })

    // Seamless Loop Reset via ▶ Replay System (18.6s -> 20.5s)
    cue('s4_glide_replay', t >= 18600, () => {
      if (isFastForward) snapCursorTo(btnReplaySys)
      else glideTo(btnReplaySys, 440, now)
    })
    cue('s4_click_replay', t >= 19060, () => {
      cursorEl.classList.add('is-clicking')
      if (btnReplaySys) btnReplaySys.classList.add('is-pressed')
      if (!isFastForward) fireRipple(btnReplaySys)
    })
    cue('s4_loop_echo', t >= 19220, () => {
      cursorEl.classList.remove('is-clicking', 'is-visible')
      if (btnReplaySys) btnReplaySys.classList.remove('is-pressed')
      s4Echoes.forEach((e) => e.classList.add('is-firing'))
    })
    cue('s4_wipe', t >= 19850, () => {
      if (loopVeil) loopVeil.classList.add('is-wiping')
    })
  }

  if (prefersReducedMotion) {
    resetAll()
    if (introOverlay) introOverlay.classList.add('is-hidden')
    setActiveScene(1)
    if (s1Carousel) s1Carousel.dataset.step = '2'
    scenes[1].classList.add('is-ui-visible')
    if (s1Artboard) s1Artboard.classList.add('is-snapped')
    return
  }

  const tParam = parseFloat(new URLSearchParams(window.location.search).get('t') || '')
  const seekMs = Number.isFinite(tParam) && tParam >= 0 ? (tParam * 1000) % LOOP_MS : -1

  resetAll()

  if (seekMs >= 0) {
    const now = performance.now()
    for (let step = 0; step <= seekMs; step += 60) {
      renderTimeline(step, now, true)
    }
    renderTimeline(seekMs, now, true)
    return
  }

  const bootTime = performance.now()
  let lastLoop = -1

  function tick(now) {
    const elapsed = now - bootTime
    const loopIdx = Math.floor(elapsed / LOOP_MS)
    const t = elapsed % LOOP_MS

    if (loopIdx !== lastLoop) {
      lastLoop = loopIdx
      fired.clear()
      resetAll()
    }

    renderTimeline(t, now, false)
    updateCursor(now)
    rafId = window.requestAnimationFrame(tick)
  }

  rafId = window.requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (rafId !== null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(rafId)
  }
})
</script>

<template>
  <div ref="rootRef" class="showreel-root">
    <section id="stage" class="stage" aria-label="Full-Width Interactive Hero Showreel">
      <!-- Luxury Obsidian, Midnight Ice & Champagne Ambient Blooms -->
      <div class="ambient-layer" aria-hidden="true">
        <div class="bloom bloom-ice"></div>
        <div class="bloom bloom-gold"></div>
      </div>

      <!-- ==================================================================
           INTRO (0.0s – 2.2s): BRAND KINETIC LOCK-UP
           ================================================================== -->
      <div id="introOverlay" class="intro-overlay" aria-hidden="true">
        <div class="intro-mask">
          <div class="intro-title">
            <span class="t-alabaster">Samuel</span> <span class="t-gold">Tavonatti</span>
          </div>
        </div>
        <div class="intro-mask">
          <div class="intro-sub mono">UI/UX Designer · Creative AI · Front-End</div>
        </div>
      </div>

      <!-- ==================================================================
           SCENE 01 (2.2s – 6.7s): UX/UI DESIGN — FULL-WIDTH FIGMA CANVAS
           ================================================================== -->
      <div id="scene1" class="scene">
        <header class="scene-head">
          <div class="headline-mask">
            <h1 class="display-title">
              <span class="t-alabaster">UX/UI</span>
              <span class="inline-pill mono">[ + System ]</span>
              <span id="s1Carousel" class="word-carousel" data-step="0" aria-label="DESIGN">
                <span class="wc-track">
                  <span class="wc-word">SYSTEMS</span>
                  <span class="wc-word">INTERFACES</span>
                  <span class="wc-word t-gold">DESIGN</span>
                </span>
              </span>
            </h1>
          </div>
          <span class="scene-tag mono">8pt Optical Rhythm · Flat 2D</span>
        </header>

        <div class="s1-layout">
          <div id="s1Artboard" class="glass-panel s1-foreground">
            <div class="panel-top">
              <span class="panel-title">Figma Auto-Layout Frame</span>
              <span class="ice-badge mono">8pt Grid · WCAG AAA</span>
            </div>

            <div class="figma-canvas">
              <div class="mp-cursor mp-ux" aria-hidden="true"><span>UX</span></div>
              <div class="mp-cursor mp-ui" aria-hidden="true"><span>UI</span></div>

              <div class="redlines mono" aria-hidden="true">
                <span class="rl-chip">16px</span>
                <span class="rl-line"></span>
                <span class="rl-chip">24px</span>
                <span class="rl-line"></span>
                <span class="rl-chip">16px</span>
              </div>

              <div class="mod-row">
                <div class="mod-card c1">
                  <span class="mod-label mono">Surface</span>
                  <div class="mod-bars">
                    <span class="mb-line"></span>
                    <span class="mb-line short"></span>
                    <span class="mb-line ice"></span>
                  </div>
                </div>
                <div class="mod-card c2">
                  <span class="mod-label mono">Hierarchy</span>
                  <div class="mod-bars">
                    <span class="mb-line"></span>
                    <span class="mb-line short"></span>
                    <span class="mb-line gold"></span>
                  </div>
                </div>
                <div class="mod-card c3">
                  <span class="mod-label mono">Motion</span>
                  <div class="mod-bars">
                    <span class="mb-line"></span>
                    <span class="mb-line short"></span>
                    <span class="mb-line ice"></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel-foot">
              <span class="mono muted-meta">Midnight Glass · Specular Edge</span>
              <button id="btnValidate" type="button" class="stage-btn">Validate System →</button>
            </div>
          </div>

          <aside class="glass-panel peripheral-card s1-peripheral" aria-hidden="true">
            <div class="p-kicker mono">Design Tokens</div>
            <div class="p-type-specimen">Inter · -0.04em · tabular-nums</div>
            <div class="p-swatches">
              <div class="sw-item"><span class="sw-dot" style="background:#04060C"></span><span class="mono">#04060C</span></div>
              <div class="sw-item"><span class="sw-dot" style="background:#38BDF8"></span><span class="mono">#38BDF8</span></div>
              <div class="sw-item"><span class="sw-dot" style="background:#E2B878"></span><span class="mono">#E2B878</span></div>
              <div class="sw-item"><span class="sw-dot" style="background:#34D399"></span><span class="mono">#34D399</span></div>
            </div>
            <div class="aaa-pill mono">Contrast 14.8:1 AAA</div>
          </aside>
        </div>
      </div>

      <!-- ==================================================================
           SCENE 02 (6.7s – 11.2s): USER RESEARCH — DOUBLE DIAMOND + TELEMETRY
           ================================================================== -->
      <div id="scene2" class="scene">
        <header class="scene-head">
          <div class="headline-mask">
            <h1 class="display-title">
              <span class="t-alabaster">USER</span> <span class="t-gold">RESEARCH</span>
            </h1>
          </div>
          <span class="scene-tag mono">Double Diamond · Cognitive Ergonomics</span>
        </header>

        <div class="s2-layout">
          <div class="glass-panel s2-left">
            <div class="panel-top">
              <span class="panel-title">Double Diamond Architecture</span>
              <span class="ice-badge mono">Discover → Deliver</span>
            </div>

            <div class="dd-wrap">
              <svg class="dd-svg" viewBox="0 0 600 192" aria-hidden="true">
                <defs>
                  <linearGradient id="iceGoldBeam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#38BDF8" />
                    <stop offset="55%" stop-color="#93C5FD" />
                    <stop offset="100%" stop-color="#E2B878" />
                  </linearGradient>
                </defs>
                <polygon class="dd-poly" points="36,96 168,26 300,96 168,166" />
                <polygon class="dd-poly" points="300,96 432,26 564,96 432,166" />
                <line class="dd-div" x1="168" y1="26" x2="168" y2="166" />
                <line class="dd-div" x1="432" y1="26" x2="432" y2="166" />

                <text id="ddPhase1" class="dd-lbl" x="112" y="16" text-anchor="middle">Discover</text>
                <text id="ddPhase2" class="dd-lbl" x="232" y="16" text-anchor="middle">Define</text>
                <text id="ddPhase3" class="dd-lbl" x="368" y="16" text-anchor="middle">Develop</text>
                <text id="ddPhase4" class="dd-lbl" x="488" y="16" text-anchor="middle">Deliver</text>

                <path id="ddTracePath" class="dd-beam" d="M 36 96 L 168 26 L 300 96 L 432 26 L 564 96" />
                <circle id="ddNodeStart" class="dd-node" cx="36" cy="96" r="5.5" />
                <circle id="ddNodeMid" class="dd-node" cx="300" cy="96" r="6.5" />
                <circle id="ddNodeEnd" class="dd-node" cx="564" cy="96" r="6.5" />

                <circle id="ddTracerHalo" class="dd-halo" cx="36" cy="96" r="12" />
                <circle id="ddTracerDot" class="dd-dot" cx="36" cy="96" r="4.5" />
              </svg>
            </div>
          </div>

          <div id="s2RightCard" class="glass-panel s2-right">
            <div class="panel-top">
              <span class="panel-title">Usability Telemetry</span>
              <span id="frictionCounter" class="ice-badge mono tabular">0% Cognitive Friction</span>
            </div>

            <div class="s2-kpi-row">
              <div class="s2-kpi">
                <span id="successCounter" class="kpi-big tabular">0.0%</span>
                <span class="kpi-sub mono">Task Success</span>
              </div>
              <div class="s2-kpi">
                <span class="kpi-big kpi-ice tabular">91/100</span>
                <span class="kpi-sub mono">SUS Score</span>
              </div>
            </div>

            <div class="sh-row">
              <span id="sh1" class="sh-pill"><span class="sh-dot"></span>Product</span>
              <span id="sh2" class="sh-pill"><span class="sh-dot"></span>Engineering</span>
              <span id="sh3" class="sh-pill"><span class="sh-dot"></span>Users</span>
            </div>

            <div class="panel-foot">
              <span class="mono muted-meta">Zero Dead-Ends</span>
              <button id="btnAlign" type="button" class="stage-btn">Align Goals</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================================================================
           SCENE 03 (11.2s – 16.0s): CREATIVE AI — PROMPT -> FULL WEB APP
           ================================================================== -->
      <div id="scene3" class="scene">
        <header class="scene-head">
          <div class="headline-mask">
            <h1 class="display-title">
              <span class="t-alabaster">CREATIVE</span> <span class="t-gold">AI</span>
            </h1>
          </div>
          <span class="scene-tag mono">Prompt → Live Web Application</span>
        </header>

        <div class="s3-stage">
          <div id="s3Camera" class="s3-camera">
            <div id="s3Echo1" class="pill-echo e1" aria-hidden="true"></div>
            <div id="s3Echo2" class="pill-echo e2" aria-hidden="true"></div>
            <div id="s3Echo3" class="pill-echo e3" aria-hidden="true"></div>

            <!-- Morphing Container: Starts as AI Prompt Pill, morphs into Full Luxury Web App -->
            <div id="aiMorphShell" class="ai-morph-shell">
              <!-- State A: Wide Midnight Glass AI Prompt Pill -->
              <div class="prompt-view">
                <div class="prompt-line">
                  <span id="promptTyped"></span><span class="ice-caret" aria-hidden="true"></span>
                </div>
                <button id="btnSubmitPrompt" type="button" class="submit-orb" aria-label="Submit prompt">
                  ↑
                </button>
              </div>

              <!-- State B: 100% Full-Width Monochrome Skeleton UI (Apple / Notion / Linear) -->
              <div class="webapp-view" aria-label="Generated Minimalist Workout and Habit OS Skeleton">
                <div class="wa-topbar">
                  <div class="wa-dots" aria-hidden="true">
                    <span></span><span></span><span></span>
                  </div>
                  <div class="wa-cmd mono" aria-hidden="true">
                    <span class="sk-bone sk-cmd-bar"></span>
                    <span class="wa-kbd">⌘K</span>
                  </div>
                  <div class="wa-top-tabs" aria-hidden="true">
                    <span class="is-active">Overview</span>
                    <span>Workouts</span>
                    <span>Habits</span>
                  </div>
                </div>

                <div class="wa-body">
                  <aside class="wa-sidebar" aria-hidden="true">
                    <span class="wa-nav-item is-on">Dashboard</span>
                    <span class="wa-nav-item">Routines</span>
                    <span class="wa-nav-item">Analytics</span>
                    <span class="wa-nav-item">Settings</span>
                  </aside>

                  <div class="wa-main">
                    <div class="wa-metrics">
                      <div class="wa-metric-card">
                        <span class="sk-bone sk-lbl"></span>
                        <strong class="tabular wa-m-val">14,820 kg</strong>
                        <span class="sk-bone sk-sub"></span>
                      </div>
                      <div class="wa-metric-card">
                        <span class="sk-bone sk-lbl"></span>
                        <strong class="tabular wa-m-val">21 days</strong>
                        <span class="sk-bone sk-sub"></span>
                      </div>
                      <div class="wa-metric-card">
                        <span class="sk-bone sk-lbl"></span>
                        <strong class="tabular wa-m-val">96%</strong>
                        <span class="sk-bone sk-sub"></span>
                      </div>
                    </div>

                    <div class="wa-bottom-grid">
                      <div class="wa-chart-card">
                        <div class="wa-chart-head">
                          <span class="sk-bone sk-chart-title"></span>
                          <span class="sk-bone sk-chart-pill"></span>
                        </div>
                        <div class="wa-bars" aria-hidden="true">
                          <div class="wa-bar-col"><span style="height:36%"></span></div>
                          <div class="wa-bar-col"><span style="height:50%"></span></div>
                          <div class="wa-bar-col"><span style="height:44%"></span></div>
                          <div class="wa-bar-col"><span style="height:64%"></span></div>
                          <div class="wa-bar-col"><span style="height:74%"></span></div>
                          <div class="wa-bar-col"><span style="height:82%"></span></div>
                          <div class="wa-bar-col"><span class="is-gold" style="height:92%"></span></div>
                        </div>
                      </div>

                      <div class="wa-checklist-card">
                        <div class="wa-chart-head">
                          <span class="sk-bone sk-chart-title"></span>
                          <span class="sk-bone sk-chart-pill"></span>
                        </div>
                        <div class="wa-task-list">
                          <div class="wa-task">
                            <span class="wa-sk-dot is-done"></span>
                            <span class="sk-bone sk-task-bar"></span>
                          </div>
                          <div class="wa-task">
                            <span class="wa-sk-dot is-done"></span>
                            <span class="sk-bone sk-task-bar short"></span>
                          </div>
                          <div class="wa-task">
                            <span class="wa-sk-dot"></span>
                            <span class="sk-bone sk-task-bar"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================================================================
           SCENE 04 (16.0s – 20.5s): MOTION & FRONT-END — VOLTREP + REPLAY
           ================================================================== -->
      <div id="scene4" class="scene">
        <header class="scene-head">
          <div class="headline-mask">
            <h1 class="display-title">
              <span class="t-alabaster">MOTION &amp;</span> <span class="t-gold">FRONT-END</span>
            </h1>
          </div>
          <span class="scene-tag mono">Production UI · 60 FPS Native</span>
        </header>

        <div class="s4-layout">
          <div id="voltrepCard" class="glass-panel s4-card">
            <div class="panel-top">
              <div>
                <div class="p-kicker mono t-gold">VoltRep Live Set Logger</div>
                <div class="vr-title">Hack Squat</div>
                <div class="vr-sub mono tabular"><strong>120 kg</strong> × <strong>6 reps</strong></div>
              </div>
              <span id="prBadge" class="pr-badge mono">+5 kg PR</span>
            </div>

            <div class="vol-bars" aria-hidden="true">
              <div class="vb-col"><div class="vb-bar" style="height: 44%"></div><span class="mono">W1</span></div>
              <div class="vb-col"><div class="vb-bar" style="height: 56%"></div><span class="mono">W2</span></div>
              <div class="vb-col"><div class="vb-bar" style="height: 64%"></div><span class="mono">W3</span></div>
              <div class="vb-col"><div class="vb-bar" style="height: 72%"></div><span class="mono">W4</span></div>
              <div class="vb-col"><div id="volPeakBar" class="vb-bar peak" style="height: 58%"></div><span class="mono t-gold">W5</span></div>
            </div>

            <div class="panel-foot">
              <span class="mono muted-meta">Progressive Overload · Live</span>
              <button id="btnLogSet" type="button" class="stage-btn">Log Set</button>
            </div>
          </div>

          <div id="prodCard" class="glass-panel s4-card s4-right">
            <nav id="miniNav" class="mini-nav" aria-label="Portfolio sections">
              <span class="mini-pill" aria-hidden="true"></span>
              <span class="mini-tab">Overview</span>
              <span class="mini-tab">Case Studies</span>
              <span class="mini-tab">Journey</span>
            </nav>

            <div class="sys-metrics">
              <div class="p-kicker mono t-ice">VoltRep Production System</div>
              <div class="sys-fps mono tabular">60 FPS · 0.4ms</div>
              <div class="sys-scores mono tabular">
                <span><strong>100</strong> Perf</span>
                <span><strong>100</strong> A11y</span>
                <span><strong>100</strong> SEO</span>
              </div>
            </div>

            <div class="panel-foot">
              <span class="mono muted-meta">Zero Bloat · Self-Hosted</span>
              <div class="preview-btn-wrap">
                <div id="s4Echo1" class="loop-echo le1" aria-hidden="true"></div>
                <div id="s4Echo2" class="loop-echo le2" aria-hidden="true"></div>
                <div id="s4Echo3" class="loop-echo le3" aria-hidden="true"></div>
                <button id="btnReplaySys" type="button" class="stage-btn stage-btn--ice">▶ Replay System</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seamless Loop Reset Veil -->
      <div id="loopVeil" class="loop-veil" aria-hidden="true"></div>

      <!-- Protected Lower-Left Safe Zone (Samsung One UI Ergonomics) -->
      <div class="hero-safe-zone">
        <p class="safe-identity">
          <strong>Samuel Tavonatti</strong> <span class="safe-sep" aria-hidden="true">—</span> <span>UI/UX Designer &amp; Front-End</span>
        </p>
        <div class="safe-ctas">
          <a href="#case-study" class="safe-cta safe-cta--primary">Explore Case Studies →</a>
          <a href="#contatti" class="safe-cta safe-cta--glass">Contact Me</a>
        </div>
      </div>

      <!-- Dynamic Vector Cursor & Electric Ice Ripple -->
      <div id="ripple" class="cursor-ripple" aria-hidden="true"></div>
      <div id="cursor" class="vector-cursor" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4.5 3.2L19.2 10.6L12.1 12.6L9.4 19.8L4.5 3.2Z" fill="#F5F7FA" stroke="#04060C" stroke-width="1.6" stroke-linejoin="round" />
        </svg>
      </div>
    </section>
  </div>
</template>

<style scoped>
.showreel-root {
  --bg-midnight: #04060C;
  --glass-bg: rgba(11, 17, 32, 0.74);
  --glass-active: rgba(17, 26, 46, 0.86);
  --border-subtle-w: rgba(255, 255, 255, 0.08);
  --specular-w: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  --alabaster: #F5F7FA;
  --slate: #94A3B8;
  --ice: #38BDF8;
  --ice-soft: rgba(56, 189, 248, 0.12);
  --ice-border: rgba(56, 189, 248, 0.38);
  --gold: #E2B878;
  --gold-bright: #F5D59E;
  --emerald: #34D399;
  --emerald-soft: rgba(52, 211, 153, 0.16);
  --ease-spatial: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.45, 0.64, 1);
  width: 100%;
  overflow: hidden;
  color: var(--alabaster);
}

.mono { font-family: var(--font-mono); }
.tabular { font-variant-numeric: tabular-nums; }
.t-alabaster { color: var(--alabaster); }
.t-gold { color: var(--gold); }
.t-ice { color: var(--ice); }

/* 1. FULL-BLEED 100vw STAGE */
.stage {
  position: relative;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 100vw;
  margin: 0;
  min-height: 93vh;
  overflow: hidden;
  box-sizing: border-box;
  background: radial-gradient(ellipse 90% 75% at 50% 42%, #0C162B 0%, #050812 58%, #04060C 100%);
  border-bottom: 1px solid var(--border-subtle-w);
}

.ambient-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.bloom {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  will-change: transform;
}

.bloom-ice {
  width: 52vw;
  height: 52vw;
  top: -18%;
  left: -8%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%);
  animation: floatBloom 14s ease-in-out infinite alternate;
}

.bloom-gold {
  width: 46vw;
  height: 46vw;
  bottom: -16%;
  right: -8%;
  background: radial-gradient(circle, rgba(226, 184, 120, 0.07) 0%, transparent 70%);
  animation: floatBloom 16s ease-in-out infinite alternate-reverse;
}

@keyframes floatBloom {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(24px, -18px, 0); }
}

/* INTRO KINETIC LOCK-UP (0.0s – 2.2s) */
.intro-overlay {
  position: absolute;
  inset: 0;
  z-index: 18;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  pointer-events: none;
  transition: transform 0.78s var(--ease-spatial), opacity 0.55s var(--ease-spatial);
}

.intro-mask {
  overflow: hidden;
  padding: 2px 4px;
}

.intro-title {
  font-size: clamp(2.4rem, 5.4vw, 4.6rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  transform: translateY(110%);
  transition: transform 0.72s var(--ease-spatial);
}

.intro-sub {
  font-size: clamp(0.78rem, 1.15vw, 0.96rem);
  color: var(--slate);
  letter-spacing: 0.02em;
  transform: translateY(110%);
  transition: transform 0.72s var(--ease-spatial) 0.1s;
}

.intro-overlay.is-revealed .intro-title,
.intro-overlay.is-revealed .intro-sub {
  transform: translateY(0%);
}

.intro-overlay.is-docking {
  transform: translate3d(-26vw, 32vh, 0) scale(0.45);
  opacity: 0;
}

.intro-overlay.is-hidden {
  opacity: 0;
  visibility: hidden;
}

/* 2. SCENES (100vw EDGE-TO-EDGE) */
.scene {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 2.6vh, 30px);
  padding: clamp(82px, 9.5vh, 98px) clamp(24px, 4.5vw, 64px) clamp(136px, 17vh, 162px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translate3d(44px, 0, 0);
  transition:
    opacity 0.48s var(--ease-spatial),
    transform 0.64s var(--ease-spatial),
    visibility 0s linear 0.48s;
}

.scene.is-active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translate3d(0, 0, 0);
  transition:
    opacity 0.48s var(--ease-spatial),
    transform 0.64s var(--ease-spatial),
    visibility 0s linear 0s;
}

.scene.is-panning-out {
  opacity: 0;
  transform: translate3d(-72px, 0, 0);
}

.scene.is-exiting {
  opacity: 0;
  transform: translate3d(0, -14px, 0);
}

.scene-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-shrink: 0;
}

.headline-mask {
  overflow: hidden;
  padding-bottom: 4px;
}

.display-title {
  margin: 0;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.65rem;
  font-size: clamp(1.95rem, 4.3vw, 3.9rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  transform: translateY(105%);
  transition: transform 0.65s var(--ease-spatial);
}

.scene.is-active .display-title { transform: translateY(0%); }

.inline-pill {
  font-size: clamp(0.75rem, 1.1vw, 0.95rem);
  font-weight: 500;
  color: var(--ice);
  background: var(--glass-bg);
  border: 1px solid var(--ice-border);
  box-shadow: var(--specular-w);
  border-radius: 9999px;
  padding: 0.32em 0.85em;
  letter-spacing: 0.01em;
}

.word-carousel {
  display: inline-block;
  height: 1.12em;
  line-height: 1.12em;
  overflow: hidden;
  vertical-align: bottom;
}

.wc-track {
  display: flex;
  flex-direction: column;
  transition: transform 0.52s var(--ease-spring);
}

.word-carousel[data-step='0'] .wc-track { transform: translateY(0); }
.word-carousel[data-step='1'] .wc-track { transform: translateY(-1.12em); }
.word-carousel[data-step='2'] .wc-track { transform: translateY(-2.24em); }

.wc-word {
  flex: 0 0 1.12em;
  height: 1.12em;
  line-height: 1.12em;
  display: flex;
  align-items: center;
}

.scene-tag {
  font-size: 0.75rem;
  color: var(--slate);
  background: var(--glass-bg);
  border: 1px solid var(--border-subtle-w);
  border-radius: 9999px;
  padding: 0.45rem 0.95rem;
  white-space: nowrap;
}

/* SHARED LIQUID GLASS PANELS */
.glass-panel {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid var(--border-subtle-w);
  border-radius: 24px;
  box-shadow: var(--specular-w);
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.15rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s var(--ease-spatial), transform 0.62s var(--ease-spatial), border-color 0.25s ease;
}

.scene.is-ui-visible .glass-panel {
  opacity: 1;
  transform: translateY(0);
}

.peripheral-card {
  opacity: 0;
  filter: blur(2px);
  transform: scale(0.9);
  transition: opacity 0.6s var(--ease-spatial) 0.12s, transform 0.65s var(--ease-spatial) 0.12s;
}

.scene.is-ui-visible .peripheral-card {
  opacity: 0.54;
  transform: scale(0.9);
}

.panel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--alabaster);
}

.panel-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--border-subtle-w);
}

.muted-meta { font-size: 0.74rem; color: var(--slate); }

.ice-badge {
  font-size: 0.72rem;
  color: var(--ice);
  background: var(--ice-soft);
  border: 1px solid var(--ice-border);
  border-radius: 9999px;
  padding: 0.3rem 0.75rem;
}

.stage-btn {
  min-height: 40px;
  padding: 0.55rem 1.2rem;
  border-radius: 9999px;
  border: 1px solid var(--border-subtle-w);
  background: var(--glass-active);
  color: var(--alabaster);
  font-family: var(--font-sans);
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s var(--ease-spring), background-color 0.22s ease, border-color 0.22s ease, color 0.22s ease;
}

.stage-btn--ice { border-color: var(--ice-border); color: var(--ice); }
.stage-btn.is-hovered { border-color: var(--ice); background: rgba(56, 189, 248, 0.18); }
.stage-btn.is-pressed { transform: scale(0.93); }
.stage-btn.is-validated { background: var(--emerald); border-color: var(--emerald); color: #04060C; }

/* SCENE 01 */
.s1-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 64fr) minmax(0, 32fr);
  gap: 4%;
  align-items: center;
}

.s1-foreground.is-validated-frame { border-color: rgba(52, 211, 153, 0.45); }

.figma-canvas {
  position: relative;
  background: rgba(4, 6, 12, 0.65);
  border: 1px solid var(--border-subtle-w);
  border-radius: 16px;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
}

.mp-cursor {
  position: absolute;
  top: 14px;
  z-index: 4;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-weight: 600;
  transition: transform 0.75s var(--ease-spatial);
}

.mp-ux { left: 14%; background: var(--ice); color: #04060C; }
.mp-ui { right: 18%; background: var(--gold); color: #04060C; }
.s1-foreground.is-snapped .mp-ux { transform: translate3d(38px, 28px, 0); }
.s1-foreground.is-snapped .mp-ui { transform: translate3d(-44px, 34px, 0); }

.redlines { display: flex; align-items: center; gap: 0.5rem; font-size: 0.66rem; color: var(--ice); }
.rl-chip { padding: 0.15rem 0.45rem; border-radius: 999px; border: 1px solid var(--ice-border); background: var(--ice-soft); }
.rl-line { flex: 1; height: 1px; background: repeating-linear-gradient(90deg, rgba(56, 189, 248, 0.5) 0 4px, transparent 4px 8px); }

.mod-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }

.mod-card {
  background: var(--glass-active);
  border: 1px solid var(--border-subtle-w);
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transform: translateY(10px);
  transition: transform 0.6s var(--ease-spring), border-color 0.3s ease;
}

.s1-foreground.is-snapped .mod-card { transform: translateY(0); border-color: var(--ice-border); }
.mod-label { font-size: 0.72rem; text-transform: uppercase; color: var(--slate); }
.mod-bars { display: flex; flex-direction: column; gap: 0.45rem; }
.mb-line { display: block; height: 6px; border-radius: 999px; background: rgba(245, 247, 250, 0.18); }
.mb-line.short { width: 65%; }
.mb-line.ice { width: 48%; background: var(--ice); }
.mb-line.gold { width: 48%; background: var(--gold); }

.p-kicker { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--slate); }
.p-type-specimen { font-size: 1.02rem; font-weight: 600; letter-spacing: -0.03em; color: var(--alabaster); }
.p-swatches { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.65rem; }
.sw-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; color: var(--slate); }
.sw-dot { width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.22); flex-shrink: 0; }
.aaa-pill { align-self: flex-start; font-size: 0.72rem; color: var(--emerald); background: var(--emerald-soft); border: 1px solid rgba(52, 211, 153, 0.34); border-radius: 9999px; padding: 0.3rem 0.75rem; }

/* SCENE 02 */
.s2-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 58fr) minmax(0, 38fr);
  gap: 4%;
  align-items: center;
}

.dd-wrap { width: 100%; padding: 0.5rem 0; }
.dd-svg { width: 100%; height: auto; display: block; }
.dd-poly { fill: rgba(56, 189, 248, 0.04); stroke: rgba(148, 197, 255, 0.22); stroke-width: 1.2; }
.dd-div { stroke: rgba(148, 197, 255, 0.14); stroke-dasharray: 4 4; }
.dd-lbl { font-family: var(--font-mono); font-size: 11px; fill: var(--slate); transition: fill 0.3s ease; }
.dd-lbl.is-lit { fill: var(--alabaster); }
.dd-beam { fill: none; stroke: url(#iceGoldBeam); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.dd-node { fill: #0B1120; stroke: rgba(148, 197, 255, 0.4); stroke-width: 2; transition: fill 0.3s ease, stroke 0.3s ease; }
.dd-node.is-lit { fill: var(--gold); stroke: var(--alabaster); }
.dd-halo { fill: rgba(56, 189, 248, 0.28); opacity: 0; }
.dd-dot { fill: var(--ice); opacity: 0; }
.dd-halo.is-active, .dd-dot.is-active { opacity: 1; }

.s2-right {
  transition: width 0.55s var(--ease-spatial), height 0.55s var(--ease-spatial), border-radius 0.55s var(--ease-spatial), opacity 0.5s var(--ease-spatial), transform 0.55s var(--ease-spatial);
}
.s2-right.is-morphing { border-radius: 9999px; border-color: var(--ice-border); }

.s2-kpi-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: 0.9rem 1rem;
  background: rgba(4, 6, 12, 0.55);
  border: 1px solid var(--border-subtle-w);
  border-radius: 16px;
}

.s2-kpi { display: flex; flex-direction: column; gap: 0.2rem; }
.kpi-big { font-size: clamp(1.45rem, 2.2vw, 1.9rem); font-weight: 700; letter-spacing: -0.03em; color: var(--gold); }
.kpi-ice { color: var(--ice); }
.kpi-sub { font-size: 0.72rem; color: var(--slate); }

.sh-row { display: flex; flex-wrap: wrap; gap: 0.55rem; }
.sh-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  color: var(--slate);
  background: rgba(4, 6, 12, 0.6);
  border: 1px solid var(--border-subtle-w);
  transition: border-color 0.25s ease, color 0.25s ease;
}
.sh-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--slate); transition: background-color 0.25s ease; }
.sh-pill.is-aligned { border-color: rgba(52, 211, 153, 0.5); color: var(--alabaster); }
.sh-pill.is-aligned .sh-dot { background: var(--emerald); }

/* SCENE 03: CREATIVE AI — PROMPT PILL -> FULL LUXURY WEB APP MORPH */
.s3-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.s3-camera {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.75s var(--ease-spatial);
  will-change: transform;
}

.s3-camera.is-zoomed { transform: scale(1.24); }
.s3-camera.is-pulled-back { transform: scale(1); }

/* Anti-distortion geometric morph on width, height, and border-radius */
.ai-morph-shell {
  position: relative;
  width: min(92vw, 820px);
  max-width: calc(100vw - 32px);
  margin-inline: auto;
  box-sizing: border-box;
  height: 78px;
  border-radius: 9999px;
  background: rgba(11, 17, 32, 0.9);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid var(--ice-border);
  box-shadow: var(--specular-w), 0 0 36px rgba(56, 189, 248, 0.16), 0 0 56px rgba(226, 184, 120, 0.08);
  overflow: hidden;
  transition:
    width 0.72s var(--ease-spatial),
    height 0.72s var(--ease-spatial),
    border-radius 0.72s var(--ease-spatial),
    border-color 0.45s ease;
}

.ai-morph-shell.is-app-generated {
  width: 100%;
  max-width: 100%;
  height: clamp(340px, 46vh, 430px);
  border-radius: 24px;
  background: rgba(11, 17, 32, 0.78);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.prompt-view {
  height: 100%;
  padding: 0 0.85rem 0 1.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  opacity: 1;
  transition: opacity 0.25s ease;
}

.ai-morph-shell.is-app-generated .prompt-view {
  opacity: 0;
  pointer-events: none;
  position: absolute;
  inset: 0;
}

.prompt-line {
  flex: 1;
  min-width: 0;
  font-size: clamp(0.88rem, 1.25vw, 1.04rem);
  color: var(--alabaster);
  line-height: 1.4;
}

.ice-caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--ice);
  vertical-align: middle;
  margin-left: 2px;
  animation: blinkCaret 0.9s steps(2) infinite;
}

@keyframes blinkCaret { 50% { opacity: 0; } }

.submit-orb {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--gold);
  color: #04060C;
  font-size: 1.15rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.18s var(--ease-spring), background-color 0.2s ease;
}

.submit-orb.is-hovered { background: var(--gold-bright); }
.submit-orb.is-pressed { transform: scale(0.93); }

/* 100% Full-Width Monochrome Skeleton UI */
.webapp-view {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(14px);
  pointer-events: none;
  transition: opacity 0.45s var(--ease-spatial) 0.22s, transform 0.55s var(--ease-spatial) 0.22s;
}

.ai-morph-shell.is-app-generated .webapp-view {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

@keyframes skShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.sk-bone {
  display: block;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(245, 247, 250, 0.06) 25%, rgba(245, 247, 250, 0.14) 50%, rgba(245, 247, 250, 0.06) 75%);
  background-size: 200% 100%;
  animation: skShimmer 2.8s ease-in-out infinite;
}

.wa-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.78rem 1.35rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(4, 6, 12, 0.45);
}

.wa-dots {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wa-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(245, 247, 250, 0.16);
}

.wa-cmd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: min(280px, 34%);
  padding: 0.32rem 0.65rem;
  border-radius: 999px;
  background: rgba(245, 247, 250, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sk-cmd-bar {
  width: 68%;
  height: 8px;
}

.wa-kbd {
  font-size: 0.65rem;
  color: var(--slate);
}

.wa-top-tabs {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 3px;
  border-radius: 999px;
  background: rgba(4, 6, 12, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
  color: var(--slate);
}

.wa-top-tabs span {
  padding: 0.26rem 0.75rem;
  border-radius: 999px;
}

.wa-top-tabs span.is-active {
  color: var(--alabaster);
  border-bottom: 1px solid var(--ice);
  background: rgba(245, 247, 250, 0.06);
}

.wa-body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
}

.wa-sidebar {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: rgba(4, 6, 12, 0.26);
}

.wa-nav-item {
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  font-size: 0.8rem;
  color: var(--slate);
}

.wa-nav-item.is-on {
  background: rgba(245, 247, 250, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--alabaster);
  font-weight: 600;
}

.wa-main {
  padding: 1.05rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.wa-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
}

.wa-metric-card {
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(4, 6, 12, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.sk-lbl { width: 52%; height: 7px; }
.sk-sub { width: 38%; height: 6px; opacity: 0.65; }
.wa-m-val { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.025em; color: var(--alabaster); }

.wa-bottom-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: 0.85rem;
}

.wa-chart-card,
.wa-checklist-card {
  min-height: 0;
  padding: 0.95rem 1.1rem;
  border-radius: 14px;
  background: rgba(4, 6, 12, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.7rem;
}

.wa-chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sk-chart-title { width: 44%; height: 8px; }
.sk-chart-pill { width: 18%; height: 8px; }

.wa-bars {
  flex: 1;
  min-height: 112px;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.6rem;
  align-items: end;
}

.wa-bar-col {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.wa-bar-col span {
  display: block;
  width: 100%;
  border-radius: 6px;
  background: rgba(245, 247, 250, 0.14);
}

.wa-bar-col span.is-gold { background: var(--gold); }

.wa-task-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.55rem;
}

.wa-task {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  background: rgba(245, 247, 250, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wa-sk-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid rgba(245, 247, 250, 0.28);
  flex-shrink: 0;
}

.wa-sk-dot.is-done {
  background: rgba(245, 247, 250, 0.22);
  border-color: rgba(245, 247, 250, 0.35);
}

.sk-task-bar { width: 72%; height: 8px; }
.sk-task-bar.short { width: 54%; }

.pill-echo {
  position: absolute;
  width: 280px;
  height: 78px;
  border-radius: 9999px;
  border: 1.5px solid rgba(56, 189, 248, 0.55);
  opacity: 0;
  pointer-events: none;
}

.pill-echo.is-firing { animation: echoExpand 1.2s var(--ease-spatial) forwards; }
.pill-echo.e2.is-firing { animation-delay: 0.12s; border-color: rgba(226, 184, 120, 0.45); }
.pill-echo.e3.is-firing { animation-delay: 0.24s; }

@keyframes echoExpand {
  0% { width: 280px; height: 78px; opacity: 0.85; }
  100% { width: 96vw; height: 420px; opacity: 0; }
}

/* SCENE 04 */
.s4-layout {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4%;
  align-items: center;
}

.s4-card.is-logged { border-color: rgba(52, 211, 153, 0.5); }
.vr-title { font-size: 1.45rem; font-weight: 700; letter-spacing: -0.025em; margin-top: 0.25rem; }
.vr-sub { font-size: 0.88rem; color: var(--slate); margin-top: 0.15rem; }
.vr-sub strong { color: var(--alabaster); }

.pr-badge {
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--emerald);
  background: var(--emerald-soft);
  border: 1px solid rgba(52, 211, 153, 0.4);
  border-radius: 9999px;
  padding: 0.3rem 0.75rem;
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.35s ease, transform 0.4s var(--ease-spring);
}
.pr-badge.is-visible { opacity: 1; transform: scale(1); }

.vol-bars {
  height: 150px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
  align-items: end;
  padding: 1rem;
  background: rgba(4, 6, 12, 0.55);
  border: 1px solid var(--border-subtle-w);
  border-radius: 16px;
}

.vb-col { height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 0.45rem; font-size: 0.72rem; color: var(--slate); }
.vb-bar { width: 100%; max-width: 44px; border-radius: 8px; background: rgba(148, 197, 255, 0.2); transition: height 0.65s var(--ease-spring); }
.vb-bar.peak { background: linear-gradient(180deg, var(--gold-bright), var(--gold)); }

.mini-nav {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 4px;
  border-radius: 9999px;
  background: rgba(4, 6, 12, 0.75);
  border: 1px solid var(--border-subtle-w);
}

.mini-pill {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(33.333% - 3px);
  height: calc(100% - 8px);
  border-radius: 9999px;
  background: var(--ice-soft);
  border: 1px solid var(--ice-border);
  transition: transform 0.55s var(--ease-spring);
}

.mini-nav.is-case-studies .mini-pill { transform: translateX(100%); }
.mini-tab { position: relative; z-index: 2; text-align: center; font-size: 0.78rem; font-weight: 500; color: var(--alabaster); padding: 0.5rem 0.25rem; }
.s4-right.is-elevated { border-color: var(--ice-border); box-shadow: var(--specular-w), 0 18px 50px rgba(56, 189, 248, 0.09); }

.sys-metrics { display: flex; flex-direction: column; gap: 0.6rem; padding: 1.15rem; background: rgba(4, 6, 12, 0.55); border: 1px solid var(--border-subtle-w); border-radius: 16px; }
.sys-fps { font-size: 1.3rem; font-weight: 700; color: var(--alabaster); }
.sys-scores { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.8rem; color: var(--slate); }
.sys-scores strong { color: var(--gold); }

.preview-btn-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; }

.loop-echo {
  position: absolute;
  width: 150px;
  height: 40px;
  border-radius: 9999px;
  border: 1.5px solid var(--ice);
  opacity: 0;
  pointer-events: none;
}
.loop-echo.is-firing { animation: loopRipple 1.05s var(--ease-spatial) forwards; }
.loop-echo.le2.is-firing { animation-delay: 0.12s; }
.loop-echo.le3.is-firing { animation-delay: 0.24s; }

@keyframes loopRipple {
  0% { width: 150px; height: 40px; opacity: 0.85; }
  100% { width: 520px; height: 180px; opacity: 0; }
}

.loop-veil {
  position: absolute;
  inset: 0;
  z-index: 30;
  background: radial-gradient(circle at 75% 75%, rgba(11, 17, 32, 0.95), #04060C 70%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.55s var(--ease-spatial);
}
.loop-veil.is-wiping { opacity: 1; }

/* 3. PROTECTED LOWER-LEFT SAFE ZONE */
.hero-safe-zone {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(28px, 4.5vh, 48px);
  width: 100%;
  max-width: 100vw;
  margin: 0;
  padding-inline: clamp(24px, 4.5vw, 64px);
  box-sizing: border-box;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  pointer-events: none;
}

.hero-safe-zone > * {
  pointer-events: auto;
}

.safe-identity { margin: 0; font-size: 0.88rem; line-height: 1.35; color: var(--slate); }
.safe-identity strong { color: var(--alabaster); font-weight: 600; }
.safe-sep { margin-inline: 0.3rem; opacity: 0.55; }
.safe-ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 0.7rem; }

.safe-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 1.4rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s var(--ease-spring), background-color 0.2s ease, border-color 0.2s ease;
}
.safe-cta:active { transform: scale(0.95); }
.safe-cta--primary { background: var(--gold); color: #04060C; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35); }
.safe-cta--primary:hover { background: var(--gold-bright); transform: translateY(-1px); }
.safe-cta--glass {
  background: rgba(11, 17, 32, 0.8);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--border-subtle-w);
  box-shadow: var(--specular-w);
  color: var(--alabaster);
}
.safe-cta--glass:hover { border-color: var(--ice-border); transform: translateY(-1px); }

/* 4. VECTOR CURSOR & RIPPLE */
.vector-cursor {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 36;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  will-change: transform;
}
.vector-cursor.is-visible { opacity: 1; }
.vector-cursor.is-clicking svg { transform: scale(0.86); }
.vector-cursor svg { transition: transform 0.12s var(--ease-spring); }

.cursor-ripple {
  position: absolute;
  z-index: 35;
  width: 14px;
  height: 14px;
  margin-left: -7px;
  margin-top: -7px;
  border-radius: 50%;
  border: 2px solid var(--ice);
  opacity: 0;
  pointer-events: none;
}
.cursor-ripple.is-popping { animation: clickRipple 0.48s var(--ease-spatial) forwards; }
@keyframes clickRipple {
  0% { transform: scale(0.6); opacity: 0.9; }
  100% { transform: scale(4.2); opacity: 0; }
}

/* 5. RESPONSIVE (MOBILE 390x844 — ZERO CLIPPING, ZERO OVERLAP) */
@media (max-width: 900px) {
  .scene {
    padding: 80px 20px 148px;
    gap: 12px;
  }
  .scene-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }
  .scene-tag { display: none; }
  .s1-layout, .s2-layout, .s4-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .glass-panel { padding: 1.1rem 1.15rem; gap: 0.85rem; }
  .figma-canvas { padding: 0.9rem; gap: 0.75rem; }
  .s1-peripheral, .s2-left, .s4-right { display: none; }
  .mod-row { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; }
  .mod-card { padding: 0.65rem 0.55rem; gap: 0.5rem; }
  .mod-label { font-size: 0.62rem; }
  .s3-camera.is-zoomed { transform: scale(1.03); }
  .ai-morph-shell { width: calc(100vw - 32px); max-width: 100%; min-height: 92px; height: auto; border-radius: 28px; }
  .ai-morph-shell.is-app-generated { width: 100%; height: 370px; }
  .prompt-view { padding: 12px 14px 12px 18px; }
  .prompt-line { overflow-wrap: break-word; word-break: normal; text-align: left; }
  .wa-body { grid-template-columns: 1fr; }
  .wa-sidebar, .wa-cmd, .wa-checklist-card { display: none; }
  .wa-bottom-grid { grid-template-columns: 1fr; }
  .wa-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .wa-metrics .wa-metric-card:last-child { display: none; }
  .vol-bars { height: 92px; }
  .hero-safe-zone { bottom: 20px; padding-inline: 20px; }
  .safe-cta { padding: 0 1.05rem; font-size: 0.82rem; }
}

@media (prefers-reduced-motion: reduce) {
  .bloom, .ice-caret, .pill-echo, .loop-echo { animation: none !important; }
  .vector-cursor, .cursor-ripple, .loop-veil, .intro-overlay { display: none !important; }
  .scene, .glass-panel, .display-title, .ai-morph-shell { transition: none !important; }
}
</style>
