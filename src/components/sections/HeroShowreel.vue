<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../../i18n/useI18n'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

const { t } = useI18n()

const stageRef = ref(null)
const canvasRef = ref(null)

const isPlaying = ref(true)
const isMuted = ref(true)
const isExpanded = ref(false)
const elapsedMs = ref(0)

const BEAT_DURATION = 4000
const TOTAL_BEATS = 4
const LOOP_DURATION = BEAT_DURATION * TOTAL_BEATS

let rafId = null
let lastTs = null
let prevBeat = 0
let audioCtx = null
let resizeObs = null
let ctx = null
let viewW = 1440
let viewH = 900

const currentBeatIndex = computed(() => {
  return Math.floor((elapsedMs.value % LOOP_DURATION) / BEAT_DURATION)
})

const totalProgress = computed(() => {
  return ((elapsedMs.value % LOOP_DURATION) / LOOP_DURATION) * 100
})

const formattedTimecode = computed(() => {
  const loopMs = elapsedMs.value % LOOP_DURATION
  const totalSec = Math.floor(loopMs / 1000)
  const mins = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const secs = String(totalSec % 60).padStart(2, '0')
  const frames = String(Math.floor((loopMs % 1000) / 16.67)).padStart(2, '0')
  return `${mins}:${secs}:${frames}`
})

const beats = [
  { id: 'ux-ui', label: 'UX/UI DESIGN' },
  { id: 'user-research', label: 'USER RESEARCH' },
  { id: 'creative-ai', label: 'CREATIVE AI' },
  { id: 'motion-fe', label: 'MOTION & FRONT-END' },
]

// Easing helpers
const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v))
const lerp = (a, b, t) => a + (b - a) * t
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)))
const easeOutBack = (t) => {
  const x = clamp(t)
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}
const easeInOutCubic = (t) => {
  const x = clamp(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

// 5x7 Pixel LED bitmap font for kinetic dot-matrix letters
const LED_FONT = {
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
}

const drawDotMatrixText = (c, text, cx, cy, dotPitch, waveProgress, colorPrimary, colorGlow) => {
  const chars = text.split('')
  const charCols = 5
  const charGap = 1.6
  const totalCols = chars.length * charCols + (chars.length - 1) * charGap
  const totalW = totalCols * dotPitch
  const totalH = 7 * dotPitch
  const startX = cx - totalW / 2
  const startY = cy - totalH / 2
  const radius = Math.max(1.6, dotPitch * 0.36)

  chars.forEach((ch, ci) => {
    const map = LED_FONT[ch]
    if (!map) return
    const offsetCol = ci * (charCols + charGap)
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (map[row][col] !== '1') continue
        const px = startX + (offsetCol + col) * dotPitch + dotPitch / 2
        const py = startY + row * dotPitch + dotPitch / 2
        const normX = (offsetCol + col) / totalCols
        const lit = clamp((waveProgress - normX * 0.55) / 0.25)

        // Unlit base dot
        c.fillStyle = 'rgba(255, 255, 255, 0.08)'
        c.beginPath()
        c.arc(px, py, radius * 0.82, 0, Math.PI * 2)
        c.fill()

        if (lit > 0.02) {
          c.save()
          c.globalAlpha = lit
          c.fillStyle = (ci + row) % 3 === 0 ? colorGlow : colorPrimary
          c.shadowColor = (ci + row) % 3 === 0 ? colorGlow : colorPrimary
          c.shadowBlur = dotPitch * 0.9 * lit
          c.beginPath()
          c.arc(px, py, radius * (0.85 + 0.18 * lit), 0, Math.PI * 2)
          c.fill()
          c.restore()
        }
      }
    }
  })
}

const drawRoundRect = (c, x, y, w, h, r) => {
  const rad = Math.min(r, w / 2, h / 2)
  c.beginPath()
  c.moveTo(x + rad, y)
  c.lineTo(x + w - rad, y)
  c.quadraticCurveTo(x + w, y, x + w, y + rad)
  c.lineTo(x + w, y + h - rad)
  c.quadraticCurveTo(x + w, y + h, x + w - rad, y + h)
  c.lineTo(x + rad, y + h)
  c.quadraticCurveTo(x, y + h, x, y + h - rad)
  c.lineTo(x, y + rad)
  c.quadraticCurveTo(x, y, x + rad, y)
  c.closePath()
}

const drawCursor = (c, x, y, scale = 1, clickPulse = 0) => {
  c.save()
  c.translate(x, y)

  if (clickPulse > 0) {
    c.save()
    c.strokeStyle = '#34D399'
    c.lineWidth = 2
    c.globalAlpha = 1 - clickPulse
    c.beginPath()
    c.arc(0, 0, 10 + clickPulse * 28, 0, Math.PI * 2)
    c.stroke()
    c.restore()
  }

  c.scale(scale, scale)
  c.shadowColor = 'rgba(0, 0, 0, 0.55)'
  c.shadowBlur = 12
  c.shadowOffsetY = 4

  c.beginPath()
  c.moveTo(0, 0)
  c.lineTo(24, 11)
  c.lineTo(13, 14)
  c.lineTo(9, 25)
  c.closePath()
  c.fillStyle = '#34D399'
  c.fill()
  c.lineWidth = 2
  c.strokeStyle = '#0B0C0E'
  c.stroke()
  c.restore()
}

const drawScene = (ms) => {
  if (!ctx) return
  const w = viewW
  const h = viewH
  const isMobile = w < 640
  const loopMs = ms % LOOP_DURATION
  const beat = Math.floor(loopMs / BEAT_DURATION)
  const bt = (loopMs % BEAT_DURATION) / BEAT_DURATION // 0..1 within current beat

  // Base background #0B0C0E
  ctx.fillStyle = '#0B0C0E'
  ctx.fillRect(0, 0, w, h)

  // Edge-to-edge architectural grid (#1B1D22)
  const gridSize = isMobile ? 42 : 56
  ctx.strokeStyle = '#1B1D22'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let gx = (w % gridSize) / 2; gx <= w; gx += gridSize) {
    const px = Math.round(gx) + 0.5
    ctx.moveTo(px, 0)
    ctx.lineTo(px, h)
  }
  for (let gy = (h % gridSize) / 2; gy <= h; gy += gridSize) {
    const py = Math.round(gy) + 0.5
    ctx.moveTo(0, py)
    ctx.lineTo(w, py)
  }
  ctx.stroke()

  // Subtle ambient radial focus glow
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.48, 20, w * 0.5, h * 0.48, Math.max(w, h) * 0.46)
  grad.addColorStop(0, 'rgba(52, 211, 153, 0.075)')
  grad.addColorStop(0.45, 'rgba(194, 165, 126, 0.04)')
  grad.addColorStop(1, 'rgba(11, 12, 14, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  const cx = w * 0.5
  const cy = isMobile ? h * 0.44 : h * 0.48
  const fontScale = clamp(w / 1280, 0.42, 1.15)
  const dotPitch = Math.max(4.4, Math.round(10 * fontScale))

  // Exit fade/wipe at end of each beat (last 12%)
  const beatOut = bt > 0.88 ? 1 - easeInOutCubic((bt - 0.88) / 0.12) : 1
  const beatIn = easeOutExpo(bt / 0.2)
  const alpha = beatIn * beatOut

  // =========================================================
  // BEAT 01: UX / UI DESIGN
  // =========================================================
  if (beat === 0) {
    ctx.save()
    ctx.globalAlpha = alpha

    // 1. Oversized white toolbar pill (< > ↓ •••) sliding down above typography
    const pillW = isMobile ? 210 : 272
    const pillH = isMobile ? 42 : 52
    const pillY = cy - (isMobile ? 102 : 148) + (1 - easeOutBack(bt / 0.25)) * -30
    const pillX = cx - pillW / 2

    ctx.save()
    ctx.fillStyle = '#F3F4F6'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 10
    drawRoundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2)
    ctx.fill()
    ctx.restore()

    // Active highlight on '>' button when cursor clicks (~0.38..0.55)
    const clickProgress = clamp((bt - 0.36) / 0.14)
    const gtX = pillX + pillW * 0.37
    if (clickProgress > 0) {
      ctx.save()
      ctx.fillStyle = '#0B0C0E'
      ctx.globalAlpha = alpha * Math.sin(clamp(clickProgress) * Math.PI) * 0.16 + (bt > 0.42 ? 0.12 : 0)
      drawRoundRect(ctx, gtX - 18, pillY + 6, 36, pillH - 12, 14)
      ctx.fill()
      ctx.restore()
    }

    ctx.fillStyle = '#0B0C0E'
    ctx.font = `700 ${isMobile ? 15 : 18}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('<', pillX + pillW * 0.17, pillY + pillH / 2 + 1)
    ctx.fillText('>', gtX, pillY + pillH / 2 + 1)
    ctx.fillText('↓', pillX + pillW * 0.58, pillY + pillH / 2 + 1)
    ctx.fillText('•••', pillX + pillW * 0.81, pillY + pillH / 2 + 1)

    // 2. Massive Dot-Matrix LED "UX/UI" + Elastic "DESIGN"
    const titleY = cy - (isMobile ? 28 : 42)
    drawDotMatrixText(ctx, 'UX/UI', cx, titleY, dotPitch, clamp(bt / 0.45), '#F3F4F6', '#34D399')

    const designY = cy + (isMobile ? 38 : 54)
    const snap = easeOutBack(clamp((bt - 0.08) / 0.3))
    ctx.save()
    ctx.translate(cx, designY)
    ctx.scale(0.88 + 0.12 * snap, 0.88 + 0.12 * snap)
    ctx.fillStyle = '#F3F4F6'
    ctx.font = `800 ${Math.round((isMobile ? 54 : 112) * clamp(w / 1200, 0.72, 1.08))}px "Inter Variable", Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('DESIGN', 0, 0)
    ctx.restore()

    // 3. Mint/Lime System Card triggered after cursor clicks '>'
    const cardTrigger = easeOutBack(clamp((bt - 0.42) / 0.25))
    if (cardTrigger > 0.01) {
      const cardW = isMobile ? 290 : 370
      const cardH = isMobile ? 42 : 48
      const cardX = cx - cardW / 2
      const cardY = cy + (isMobile ? 92 : 136) + (1 - cardTrigger) * 18

      ctx.save()
      ctx.globalAlpha = alpha * clamp(cardTrigger)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.14)'
      ctx.strokeStyle = '#34D399'
      ctx.lineWidth = 1.5
      drawRoundRect(ctx, cardX, cardY, cardW, cardH, 12)
      ctx.fill()
      ctx.stroke()

      // Live green dot
      ctx.fillStyle = '#34D399'
      ctx.beginPath()
      ctx.arc(cardX + 20, cardY + cardH / 2, 4.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#6EE7B7'
      ctx.font = `600 ${isMobile ? 11.5 : 13.5}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('UX/UI SYSTEM // V2.0  →  [FIGMA_01]', cx + 8, cardY + cardH / 2)
      ctx.restore()
    }

    // 4. Oversized '+' circle badge on left
    const plusX = isMobile ? w * 0.14 : cx - 340 * fontScale
    const plusY = cy - (isMobile ? 128 : 40)
    const plusSize = isMobile ? 42 : 58
    ctx.save()
    ctx.fillStyle = '#F3F4F6'
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.shadowBlur = 18
    ctx.beginPath()
    ctx.arc(plusX, plusY + Math.sin(bt * Math.PI * 2) * 5, plusSize / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0B0C0E'
    ctx.font = `700 ${isMobile ? 22 : 28}px "Inter Variable", Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('+', plusX, plusY + Math.sin(bt * Math.PI * 2) * 5 + 1)
    ctx.restore()

    // 5. Animated Vector Cursor sweeping to '>' and clicking, then moving to card
    const cMove1 = easeInOutCubic(clamp(bt / 0.36))
    const cMove2 = easeInOutCubic(clamp((bt - 0.5) / 0.3))
    let curX = lerp(cx + 220 * fontScale, gtX, cMove1)
    let curY = lerp(cy + 110, pillY + pillH / 2 + 4, cMove1)
    if (bt > 0.5) {
      curX = lerp(gtX, cx + 110 * fontScale, cMove2)
      curY = lerp(pillY + pillH / 2 + 4, cy + (isMobile ? 112 : 156), cMove2)
    }
    const clickScale = bt > 0.36 && bt < 0.46 ? 0.82 : 1
    const ripple = bt > 0.38 && bt < 0.62 ? (bt - 0.38) / 0.24 : 0
    drawCursor(ctx, curX, curY, (isMobile ? 0.95 : 1.25) * clickScale, ripple)

    ctx.restore()
  }

  // =========================================================
  // BEAT 02: USER RESEARCH (Ergonomia Cognitiva & Node Flow)
  // =========================================================
  else if (beat === 1) {
    ctx.save()
    ctx.globalAlpha = alpha

    // Interactive cognitive ergonomics node-flow diagram
    const nodeSpan = isMobile ? w * 0.34 : Math.min(340, w * 0.25)
    const nodes = [
      { x: cx - nodeSpan, y: cy - (isMobile ? 110 : 120), label: 'INPUT' },
      { x: cx, y: cy - (isMobile ? 145 : 165), label: 'COGNITION' },
      { x: cx + nodeSpan, y: cy - (isMobile ? 110 : 120), label: 'ACTION' },
    ]

    // Draw animated bezier paths between nodes
    const pathDraw = easeOutExpo(clamp(bt / 0.55))
    ctx.save()
    ctx.strokeStyle = '#34D399'
    ctx.lineWidth = 2.2
    ctx.setLineDash([8, 6])
    ctx.lineDashOffset = -bt * 120
    ctx.globalAlpha = alpha * pathDraw * 0.85

    ctx.beginPath()
    ctx.moveTo(nodes[0].x, nodes[0].y)
    ctx.quadraticCurveTo((nodes[0].x + nodes[1].x) / 2, nodes[0].y - 45, nodes[1].x, nodes[1].y)
    ctx.quadraticCurveTo((nodes[1].x + nodes[2].x) / 2, nodes[2].y - 45, nodes[2].x, nodes[2].y)
    ctx.stroke()
    ctx.restore()

    // Heatmap pulses & glowing anchor nodes
    nodes.forEach((n, idx) => {
      const nAppear = easeOutBack(clamp((bt - idx * 0.08) / 0.25))
      const pulse = (bt * 2 + idx * 0.3) % 1

      ctx.save()
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)'
      ctx.lineWidth = 1.5
      ctx.globalAlpha = alpha * (1 - pulse) * 0.7
      ctx.beginPath()
      ctx.arc(n.x, n.y, 12 + pulse * 26, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.fillStyle = '#0B0C0E'
      ctx.strokeStyle = '#34D399'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(n.x, n.y, 10 * nAppear, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#A1A7B3'
      ctx.font = `600 ${isMobile ? 10 : 11}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textAlign = 'center'
      ctx.fillText(n.label, n.x, n.y - 20)
      ctx.restore()
    })

    // Massive Kinetic "USER" + Dot-Matrix "RESEARCH"
    const userY = cy - (isMobile ? 22 : 30)
    const snap = easeOutBack(clamp(bt / 0.28))
    ctx.save()
    ctx.translate(cx, userY)
    ctx.scale(0.9 + 0.1 * snap, 0.9 + 0.1 * snap)
    ctx.fillStyle = '#F3F4F6'
    ctx.font = `800 ${Math.round((isMobile ? 54 : 108) * clamp(w / 1200, 0.72, 1.08))}px "Inter Variable", Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('USER', 0, 0)
    ctx.restore()

    const resY = cy + (isMobile ? 38 : 60)
    drawDotMatrixText(ctx, 'RESEARCH', cx, resY, Math.max(3.8, dotPitch * 0.85), clamp((bt - 0.08) / 0.45), '#F3F4F6', '#34D399')

    // Validation Metric Pill
    const valTrigger = easeOutBack(clamp((bt - 0.25) / 0.25))
    const valW = isMobile ? 260 : 340
    const valH = isMobile ? 40 : 46
    const valX = cx - valW / 2
    const valY = cy + (isMobile ? 92 : 138) + (1 - valTrigger) * 16

    ctx.save()
    ctx.globalAlpha = alpha * clamp(valTrigger)
    ctx.fillStyle = 'rgba(194, 165, 126, 0.12)'
    ctx.strokeStyle = 'rgba(194, 165, 126, 0.5)'
    ctx.lineWidth = 1.5
    drawRoundRect(ctx, valX, valY, valW, valH, 12)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#C2A57E'
    ctx.font = `700 ${isMobile ? 11.5 : 13.5}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('98.4% TASK FLOW  •  L-20 HCI', cx, valY + valH / 2)
    ctx.restore()

    // Cursor clicking center Cognition node
    const curX = lerp(nodes[0].x, nodes[1].x, easeInOutCubic(clamp(bt / 0.5)))
    const curY = lerp(nodes[0].y + 20, nodes[1].y + 8, easeInOutCubic(clamp(bt / 0.5)))
    drawCursor(ctx, curX, curY, isMobile ? 0.95 : 1.25, bt > 0.45 && bt < 0.7 ? (bt - 0.45) / 0.25 : 0)

    ctx.restore()
  }

  // =========================================================
  // BEAT 03: CREATIVE AI (Prompt -> Prototype Morphing)
  // =========================================================
  else if (beat === 2) {
    ctx.save()
    ctx.globalAlpha = alpha

    // Top Prompt-to-Prototype morphing bar
    const barW = isMobile ? 290 : 420
    const barH = isMobile ? 40 : 48
    const barX = cx - barW / 2
    const barY = cy - (isMobile ? 120 : 158)

    ctx.save()
    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)'
    ctx.strokeStyle = '#34D399'
    ctx.lineWidth = 1.5
    drawRoundRect(ctx, barX, barY, barW, barH, 12)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#6EE7B7'
    ctx.font = `600 ${isMobile ? 11.5 : 14}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('AI WORKFLOW // PROMPT  →  PROTOTYPE', cx, barY + barH / 2)
    ctx.restore()

    // Kinetic "CREATIVE" + Pulsing Dot-Matrix "AI"
    const creY = cy - (isMobile ? 34 : 42)
    const snap = easeOutBack(clamp(bt / 0.26))
    ctx.save()
    ctx.translate(cx, creY)
    ctx.scale(0.9 + 0.1 * snap, 0.9 + 0.1 * snap)
    ctx.fillStyle = '#F3F4F6'
    ctx.font = `800 ${Math.round((isMobile ? 46 : 98) * clamp(w / 1200, 0.72, 1.08))}px "Inter Variable", Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('CREATIVE', 0, 0)
    ctx.restore()

    const aiY = cy + (isMobile ? 36 : 56)
    drawDotMatrixText(ctx, 'AI', cx, aiY, dotPitch * 1.1, clamp((bt - 0.05) / 0.35), '#34D399', '#F3F4F6')

    // 3 Modular Wireframe Cards assembling below in sync
    const cards = ['SYSTEM', 'TOKENS', 'LAYOUT']
    const cardW = isMobile ? 86 : 124
    const cardH = isMobile ? 46 : 58
    const gap = isMobile ? 10 : 18
    const totalCardsW = cards.length * cardW + (cards.length - 1) * gap
    const startCardX = cx - totalCardsW / 2
    const cardY = cy + (isMobile ? 96 : 136)

    cards.forEach((lbl, idx) => {
      const cProg = easeOutBack(clamp((bt - 0.18 - idx * 0.1) / 0.26))
      const x = startCardX + idx * (cardW + gap)
      const y = cardY + (1 - cProg) * 28

      ctx.save()
      ctx.globalAlpha = alpha * clamp(cProg)
      ctx.fillStyle = '#13151A'
      ctx.strokeStyle = idx === 1 ? '#34D399' : 'rgba(255,255,255,0.18)'
      ctx.lineWidth = 1.5
      drawRoundRect(ctx, x, y, cardW, cardH, 10)
      ctx.fill()
      ctx.stroke()

      // Mini wireframe lines inside card
      ctx.fillStyle = idx === 1 ? '#34D399' : '#C2A57E'
      drawRoundRect(ctx, x + 10, y + 10, cardW * 0.45, 5, 2.5)
      ctx.fill()

      ctx.fillStyle = '#A1A7B3'
      ctx.font = `600 ${isMobile ? 9.5 : 11}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textAlign = 'left'
      ctx.fillText(lbl, x + 10, y + cardH - 12)
      ctx.restore()
    })

    ctx.restore()
  }

  // =========================================================
  // BEAT 04: MOTION & FRONT-END (Spring Physics & DOM Ready)
  // =========================================================
  else {
    ctx.save()
    ctx.globalAlpha = alpha

    // Top Token Pill
    const tokW = isMobile ? 250 : 340
    const tokH = isMobile ? 38 : 44
    const tokX = cx - tokW / 2
    const tokY = cy - (isMobile ? 116 : 150)

    ctx.save()
    ctx.fillStyle = '#13151A'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1.5
    drawRoundRect(ctx, tokX, tokY, tokW, tokH, tokH / 2)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#F3F4F6'
    ctx.font = `600 ${isMobile ? 11.5 : 13.5}px ui-monospace, SFMono-Regular, Menlo, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('60FPS // DOM_READY  •  WCAG AA', cx, tokY + tokH / 2)
    ctx.restore()

    // Kinetic "MOTION &" + Bold "FRONT-END"
    const mY = cy - (isMobile ? 32 : 42)
    const snap = easeOutBack(clamp(bt / 0.25))
    ctx.save()
    ctx.translate(cx, mY)
    ctx.scale(0.92 + 0.08 * snap, 0.92 + 0.08 * snap)
    ctx.fillStyle = '#C2A57E'
    ctx.font = `800 ${Math.round((isMobile ? 40 : 84) * clamp(w / 1200, 0.72, 1.08))}px "Inter Variable", Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('MOTION &', 0, 0)
    ctx.restore()

    const feY = cy + (isMobile ? 32 : 52)
    const snap2 = easeOutBack(clamp((bt - 0.1) / 0.28))
    ctx.save()
    ctx.translate(cx, feY)
    ctx.scale(0.92 + 0.08 * snap2, 0.92 + 0.08 * snap2)
    ctx.fillStyle = '#F3F4F6'
    ctx.font = `800 ${Math.round((isMobile ? 42 : 94) * clamp(w / 1200, 0.72, 1.08))}px "Inter Variable", Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('FRONT-END', 0, 0)
    ctx.restore()

    // Spring-physics bezier curve visualizer below
    const curveW = isMobile ? 220 : 320
    const curveY = cy + (isMobile ? 108 : 148)
    const progress = clamp((bt - 0.15) / 0.55)

    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx - curveW / 2, curveY + 18)
    ctx.bezierCurveTo(cx - curveW * 0.25, curveY - 26, cx + curveW * 0.1, curveY - 22, cx + curveW / 2, curveY - 22)
    ctx.stroke()

    const dotX = lerp(cx - curveW / 2, cx + curveW / 2, easeOutExpo(progress))
    const dotY = lerp(curveY + 18, curveY - 22, easeOutExpo(progress))
    ctx.fillStyle = '#34D399'
    ctx.shadowColor = '#34D399'
    ctx.shadowBlur = 14
    ctx.beginPath()
    ctx.arc(dotX, dotY, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    ctx.restore()
  }
}

const syncCanvasSize = () => {
  if (!canvasRef.value || !stageRef.value) return
  const rect = stageRef.value.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  viewW = Math.max(320, rect.width)
  viewH = Math.max(480, rect.height)
  canvasRef.value.width = Math.round(viewW * dpr)
  canvasRef.value.height = Math.round(viewH * dpr)
  ctx = canvasRef.value.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  drawScene(elapsedMs.value)
}

const playTone = (freq = 520, duration = 0.06, type = 'sine') => {
  if (isMuted.value || typeof window === 'undefined') return
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    if (!audioCtx) audioCtx = new AudioContextClass()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    gain.gain.setValueAtTime(0.032, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + duration)
  } catch {
    // Ignore audio errors when blocked by browser autoplay policy
  }
}

const tick = (ts) => {
  if (lastTs !== null && isPlaying.value) {
    elapsedMs.value += ts - lastTs
    const nextBeat = currentBeatIndex.value
    if (nextBeat !== prevBeat) {
      prevBeat = nextBeat
      const toneMap = [587.33, 659.25, 783.99, 880.0]
      playTone(toneMap[nextBeat] || 620, 0.055)
    }
  }
  lastTs = ts
  drawScene(elapsedMs.value)
  rafId = window.requestAnimationFrame(tick)
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  playTone(isPlaying.value ? 660 : 440, 0.05)
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (!isMuted.value) {
    playTone(740, 0.08, 'triangle')
  }
}

const jumpBeat = (idx) => {
  elapsedMs.value = idx * BEAT_DURATION + 450
  prevBeat = idx
  drawScene(elapsedMs.value)
  playTone(580 + idx * 55, 0.05)
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  window.requestAnimationFrame(syncCanvasSize)
}

const handleKey = (e) => {
  if (e.key === 'Escape' && isExpanded.value) {
    isExpanded.value = false
    window.requestAnimationFrame(syncCanvasSize)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isPlaying.value = false
      elapsedMs.value = 1850
    }
    syncCanvasSize()
    if (window.ResizeObserver && stageRef.value) {
      resizeObs = new ResizeObserver(syncCanvasSize)
      resizeObs.observe(stageRef.value)
    }
    rafId = window.requestAnimationFrame(tick)
    window.addEventListener('keydown', handleKey)
  }
})

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
  if (resizeObs) resizeObs.disconnect()
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKey)
  }
  if (audioCtx) {
    audioCtx.close().catch(() => {})
  }
})
</script>

<template>
  <section class="hero-showreel-fullbleed" aria-label="Hero Showreel">
    <div ref="stageRef" class="showreel-stage" :class="{ 'is-expanded': isExpanded }">
      <!-- Full-Bleed 60fps Kinetic Motion Canvas -->
      <canvas ref="canvasRef" class="showreel-canvas" aria-hidden="true" />

      <!-- Top HUD Bar (below floating navbar) -->
      <div class="hud-container stage-top">
        <div class="status-pill">
          <span class="status-dot" :class="{ paused: !isPlaying }" aria-hidden="true" />
          <span class="pill-play" aria-hidden="true">▶</span>
          <span class="tabular-nums">{{ t('showreel.pill') }}</span>
        </div>

        <div class="scene-dots" role="tablist" aria-label="Showreel chapters">
          <button
            v-for="(b, idx) in beats"
            :key="b.id"
            type="button"
            role="tab"
            :aria-selected="currentBeatIndex === idx"
            :aria-label="`Beat ${idx + 1}: ${b.label}`"
            class="scene-dot-btn"
            :class="{ active: currentBeatIndex === idx }"
            @click="jumpBeat(idx)"
          >
            <span class="tabular-nums">0{{ idx + 1 }}</span>
          </button>
        </div>
      </div>

      <!-- Bottom HUD Bar: Identity + CTAs (Left) & Timecode + Controls (Right) -->
      <div class="hud-container stage-bottom">
        <div class="identity-cta-block">
          <div class="identity-line">
            <span class="identity-name">{{ t('showreel.identity') }}</span>
            <span class="identity-sep" aria-hidden="true">—</span>
            <span class="identity-role">{{ t('showreel.role') }}</span>
          </div>

          <div class="hero-ctas">
            <BaseButton to="/progetti" variant="primary" class="hero-cta-btn">
              <span>{{ t('showreel.ctaPrimary') }}</span>
              <AppIcon name="arrow-right" :size="15" />
            </BaseButton>
            <BaseButton :to="{ path: '/', hash: '#contatti' }" variant="secondary" class="hero-cta-btn">
              <span>{{ t('showreel.ctaSecondary') }}</span>
            </BaseButton>
          </div>
        </div>

        <div class="hud-right-stack">
          <div class="timecode-wrap">
            <span class="timecode tabular-nums">{{ formattedTimecode }}</span>
            <div class="progress-track" aria-hidden="true">
              <div class="progress-fill" :style="{ width: `${totalProgress}%` }" />
            </div>
          </div>

          <div class="hud-controls">
            <button type="button" class="hud-btn" @click="togglePlay">
              [{{ isPlaying ? t('showreel.pause') : t('showreel.play') }}]
            </button>
            <button type="button" class="hud-btn" @click="toggleMute">
              [{{ isMuted ? t('showreel.unmute') : t('showreel.mute') }}]
            </button>
            <button type="button" class="hud-btn" @click="toggleExpand">
              [{{ isExpanded ? t('showreel.close') : t('showreel.expand') }}]
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-showreel-fullbleed {
  width: 100%;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--border-subtle);
}

.showreel-stage {
  position: relative;
  width: 100%;
  min-height: 94vh;
  min-height: 94svh;
  background-color: #0B0C0E;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5.25rem 0 1.5rem;
}

@media (min-width: 768px) {
  .showreel-stage {
    min-height: 96vh;
    padding: 5.75rem 0 2rem;
  }
}

.showreel-stage.is-expanded {
  position: fixed;
  inset: 0;
  z-index: 250;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  padding: 1.5rem 0;
}

.showreel-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.hud-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

@media (min-width: 768px) {
  .hud-container {
    padding: 0 2.5rem;
  }
}

.stage-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(19, 21, 26, 0.86);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  padding: 0.36rem 0.85rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.05em;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--status-live);
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.65);
}

.status-dot.paused {
  background: var(--accent);
  box-shadow: none;
}

.pill-play {
  color: var(--status-live);
  font-size: 0.65rem;
}

.scene-dots {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.scene-dot-btn {
  background: rgba(19, 21, 26, 0.86);
  border: 1px solid var(--border-subtle);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.scene-dot-btn:hover {
  color: var(--text-primary);
  border-color: var(--accent-border);
}

.scene-dot-btn.active {
  background: var(--accent-soft);
  border-color: var(--accent-border);
  color: var(--accent);
}

/* Bottom Identity + HUD Bar */
.stage-bottom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
}

@media (min-width: 960px) {
  .stage-bottom {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.identity-cta-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
}

.identity-line {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  font-size: 0.9rem;
}

.identity-name {
  font-weight: 700;
  color: var(--text-primary);
}

.identity-sep {
  display: none;
  color: var(--text-tertiary);
}

@media (min-width: 520px) {
  .identity-line {
    flex-direction: row;
    align-items: center;
    gap: 0.45rem;
  }

  .identity-sep {
    display: inline;
  }
}

.identity-role {
  color: var(--text-secondary);
}

.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.hero-cta-btn {
  padding: 0.55rem 1rem !important;
  font-size: 0.85rem !important;
}

.hud-right-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
}

@media (min-width: 960px) {
  .hud-right-stack {
    align-items: flex-end;
  }
}

.timecode-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.timecode {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}

.progress-track {
  width: 108px;
  height: 3px;
  border-radius: 999px;
  background: var(--border-subtle);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--status-live);
  transition: width 80ms linear;
}

.hud-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.hud-btn {
  background: rgba(19, 21, 26, 0.9);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.71rem;
  font-weight: 600;
  padding: 0.4rem 0.65rem;
  border-radius: 8px;
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast), background-color var(--transition-fast);
}

.hud-btn:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-soft);
}
</style>
