<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../../i18n/useI18n'
import BaseButton from '../ui/BaseButton.vue'
import AppIcon from '../ui/AppIcon.vue'

const { lang, t } = useI18n()

const isPlaying = ref(true)
const isMuted = ref(true)
const isExpanded = ref(false)
const elapsedMs = ref(0)

const SCENE_DURATION = 3800
const TOTAL_SCENES = 4

let rafId = null
let lastTs = null
let prevScene = 0
let audioCtx = null

const currentSceneIndex = computed(() => {
  return Math.floor((elapsedMs.value % (SCENE_DURATION * TOTAL_SCENES)) / SCENE_DURATION)
})

const sceneProgress = computed(() => {
  return ((elapsedMs.value % SCENE_DURATION) / SCENE_DURATION) * 100
})

const formattedTimecode = computed(() => {
  const loopMs = elapsedMs.value % (SCENE_DURATION * TOTAL_SCENES)
  const totalSec = Math.floor(loopMs / 1000)
  const mins = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const secs = String(totalSec % 60).padStart(2, '0')
  const frames = String(Math.floor((loopMs % 1000) / 16.67)).padStart(2, '0')
  return `${mins}:${secs}:${frames}`
})

const scenes = computed(() => [
  {
    id: 'ux-ui',
    tag: 'FIGMA_UI',
    kicker: 'DESIGN SYSTEM // V2.0',
    title: 'UX/UI',
    accent: 'DESIGN',
    sub: lang.value === 'it'
      ? 'Sistemi visivi modulari, gerarchia editoriale e micro-interazioni ad alta leggibilità.'
      : 'Modular visual systems, editorial hierarchy, and high-clarity micro-interactions.',
  },
  {
    id: 'user-research',
    tag: 'L-20_HCI',
    kicker: 'HYPOTHESIS // VALIDATED',
    title: 'USER',
    accent: 'RESEARCH',
    sub: lang.value === 'it'
      ? 'Ergonomia cognitiva, mappatura dei flussi e validazione su dati reali.'
      : 'Cognitive ergonomics, user flow mapping, and real-world hypothesis validation.',
  },
  {
    id: 'creative-ai',
    tag: 'PROMPT_UI',
    kicker: 'AI WORKFLOW // PROMPT → PROTOTYPE',
    title: 'CREATIVE',
    accent: 'AI',
    sub: lang.value === 'it'
      ? 'Flussi generativi e agentici per passare dal prompt al prototipo interattivo.'
      : 'Generative and agentic workflows bridging prompt architecture to interactive prototypes.',
  },
  {
    id: 'motion-fe',
    tag: 'VUE3_60FPS',
    kicker: 'CUBIC-BEZIER // (0.16, 1, 0.3, 1)',
    title: 'MOTION &',
    accent: 'FRONT-END',
    sub: lang.value === 'it'
      ? 'Fisica a 60fps, token DOM puliti, font self-hosted e conformità WCAG AA.'
      : '60fps motion physics, clean DOM tokens, self-hosted typography, and WCAG AA contrast.',
  },
])

const activeScene = computed(() => scenes.value[currentSceneIndex.value])

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
    const nextScene = currentSceneIndex.value
    if (nextScene !== prevScene) {
      prevScene = nextScene
      const toneMap = [587.33, 659.25, 783.99, 880.0]
      playTone(toneMap[nextScene] || 620, 0.055)
    }
  }
  lastTs = ts
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

const jumpScene = (idx) => {
  elapsedMs.value = idx * SCENE_DURATION
  prevScene = idx
  playTone(580 + idx * 55, 0.05)
}

const handleKey = (e) => {
  if (e.key === 'Escape' && isExpanded.value) {
    isExpanded.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isPlaying.value = false
    }
    rafId = window.requestAnimationFrame(tick)
    window.addEventListener('keydown', handleKey)
  }
})

onUnmounted(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKey)
  }
  if (audioCtx) {
    audioCtx.close().catch(() => {})
  }
})
</script>

<template>
  <section class="hero-showreel-section" aria-label="Hero Showreel">
    <div class="container">
      <div class="showreel-stage" :class="{ 'is-expanded': isExpanded }">
        <!-- Subtle 1px Architectural Grid + Ambient Glow -->
        <div class="stage-grid" aria-hidden="true" />
        <div class="stage-glow" aria-hidden="true" />

        <!-- Top HUD Bar -->
        <div class="stage-top">
          <div class="status-pill">
            <span class="status-dot" :class="{ paused: !isPlaying }" aria-hidden="true" />
            <span class="pill-play" aria-hidden="true">▶</span>
            <span class="tabular-nums">{{ t('showreel.pill') }}</span>
          </div>

          <div class="scene-dots" role="tablist" aria-label="Showreel chapters">
            <button
              v-for="(sc, idx) in scenes"
              :key="sc.id"
              type="button"
              role="tab"
              :aria-selected="currentSceneIndex === idx"
              :aria-label="`Scene ${idx + 1}: ${sc.title} ${sc.accent}`"
              class="scene-dot-btn"
              :class="{ active: currentSceneIndex === idx }"
              @click="jumpScene(idx)"
            >
              <span class="tabular-nums">0{{ idx + 1 }}</span>
            </button>
          </div>
        </div>

        <!-- Center Motion Stage -->
        <div class="stage-center">
          <!-- Floating Micro-Components (Signature Aesthetic) -->
          <div class="float-badge" aria-hidden="true">+</div>
          <div class="float-pill" aria-hidden="true">
            <span>&lt;</span>
            <span>&gt;</span>
            <span>↓</span>
            <span>•••</span>
          </div>

          <Transition name="scene-swap" mode="out-in">
            <div :key="activeScene.id" class="scene-content">
              <!-- Animated System Tag Pill + Live Cursor in Scene 01 -->
              <div class="cursor-pill-wrap">
                <div class="cursor-tag tabular-nums" :class="{ 'is-green': activeScene.id === 'ux-ui' || activeScene.id === 'user-research' }">
                  <span class="tag-dot" aria-hidden="true" />
                  <span class="tag-kicker">{{ activeScene.kicker }}</span>
                  <span class="tag-arrow">→</span>
                  <span class="tag-code">[{{ activeScene.tag }}]</span>
                </div>

                <!-- Animated Live Cursor -->
                <svg
                  v-if="activeScene.id === 'ux-ui'"
                  class="live-cursor"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 3L19 11L12 13L9 20L4 3Z"
                    fill="#34D399"
                    stroke="#0D0E11"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <!-- Kinetic Headline (H1 on Hero) -->
              <h1 class="kinetic-title">
                <span class="title-solid">{{ activeScene.title }}</span>
                <span class="title-dotmatrix">{{ activeScene.accent }}</span>
              </h1>

              <p class="scene-sub">{{ activeScene.sub }}</p>

              <!-- Scene-Specific Telemetry / Visual Props -->
              <div v-if="activeScene.id === 'user-research'" class="scene-telemetry" aria-hidden="true">
                <div class="telemetry-chip">
                  <span class="chip-label">TASK SUCCESS</span>
                  <span class="chip-val tabular-nums">98.4%</span>
                </div>
                <div class="telemetry-chip">
                  <span class="chip-label">COGNITIVE LOAD</span>
                  <span class="chip-val tabular-nums">-42%</span>
                </div>
                <div class="telemetry-chip">
                  <span class="chip-label">HEATMAP NODES</span>
                  <span class="chip-val tabular-nums">12 / GRID</span>
                </div>
              </div>

              <div v-else-if="activeScene.id === 'creative-ai'" class="scene-telemetry" aria-hidden="true">
                <div class="ai-morph-card">
                  <span class="ai-prompt">PROMPT: "Ergonomic gym tracker"</span>
                  <span class="ai-arrow">→</span>
                  <span class="ai-output">PROTOTYPE // VOLTREP_UI</span>
                </div>
              </div>

              <div v-else-if="activeScene.id === 'motion-fe'" class="scene-telemetry" aria-hidden="true">
                <div class="code-token-pill">
                  <code>&lt;Motion ease="0.16, 1, 0.3, 1" fps={60} wcag="AA" /&gt;</code>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Bottom Stage Footer: Identity Bar + CTA (Left) & Timecode + HUD Controls (Right) -->
        <div class="stage-bottom">
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
                <div class="progress-fill" :style="{ width: `${sceneProgress}%` }" />
              </div>
            </div>

            <div class="hud-controls">
              <button type="button" class="hud-btn" @click="togglePlay">
                [{{ isPlaying ? t('showreel.pause') : t('showreel.play') }}]
              </button>
              <button type="button" class="hud-btn" @click="toggleMute">
                [{{ isMuted ? t('showreel.unmute') : t('showreel.mute') }}]
              </button>
              <button type="button" class="hud-btn" @click="isExpanded = !isExpanded">
                [{{ isExpanded ? t('showreel.close') : t('showreel.expand') }}]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-showreel-section {
  padding: 5.25rem 0 4rem;
  border-bottom: 1px solid var(--border-subtle);
}

.showreel-stage {
  position: relative;
  width: 100%;
  min-height: clamp(540px, 84vh, 840px);
  background-color: #0D0E11;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem;
  box-shadow: 0 28px 70px -26px rgba(0, 0, 0, 0.85);
}

@media (min-width: 768px) {
  .showreel-stage {
    padding: 1.75rem 2.25rem;
  }
}

.showreel-stage.is-expanded {
  position: fixed;
  inset: 1rem;
  z-index: 250;
  width: auto;
  min-height: 0;
  height: auto;
  box-shadow: 0 0 0 100vmax rgba(5, 6, 8, 0.88);
}

.stage-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.042) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.042) 1px, transparent 1px);
  background-size: 56px 56px;
}

.stage-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 50% 42%, rgba(194, 165, 126, 0.08) 0%, rgba(52, 211, 153, 0.03) 35%, transparent 70%);
}

.stage-top {
  position: relative;
  z-index: 2;
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
  background: rgba(19, 21, 26, 0.88);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  padding: 0.38rem 0.85rem;
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
  transition: background-color 0.2s ease;
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
  background: rgba(19, 21, 26, 0.85);
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

.stage-center {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 0.5rem;
}

.float-badge,
.float-pill {
  display: none;
}

@media (min-width: 768px) {
  .float-badge {
    position: absolute;
    left: 4%;
    top: 14%;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--surface-1);
    border: 1px solid var(--border-strong);
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 1.05rem;
    display: grid;
    place-items: center;
    animation: floatSlow 5s ease-in-out infinite;
  }

  .float-pill {
    position: absolute;
    right: 4%;
    top: 16%;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.42rem 0.9rem;
    border-radius: 999px;
    background: var(--surface-1);
    border: 1px solid var(--border-strong);
    font-family: var(--font-mono);
    font-size: 0.74rem;
    color: var(--text-secondary);
    animation: floatSlow 6s ease-in-out infinite reverse;
  }
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

.scene-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 860px;
}

.cursor-pill-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.cursor-tag {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  padding: 0.3rem 0.68rem;
  border-radius: 8px;
  background: rgba(194, 165, 126, 0.1);
  border: 1px solid var(--accent-border);
  color: var(--accent);
}

@media (min-width: 640px) {
  .cursor-tag {
    font-size: 0.74rem;
    padding: 0.32rem 0.78rem;
  }
}

.cursor-tag.is-green {
  background: rgba(52, 211, 153, 0.1);
  border-color: rgba(52, 211, 153, 0.35);
  color: #6EE7B7;
}

.tag-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.tag-arrow {
  color: var(--text-tertiary);
}

.live-cursor {
  position: absolute;
  right: -14px;
  bottom: -14px;
  pointer-events: none;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
  animation: cursorSnap 2.4s var(--ease-out-expo) infinite;
}

@keyframes cursorSnap {
  0% { transform: translate(26px, 20px) scale(1); opacity: 0; }
  25% { transform: translate(0, 0) scale(1); opacity: 1; }
  45% { transform: translate(0, 0) scale(0.86); opacity: 1; }
  65% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(-8px, -4px) scale(1); opacity: 0; }
}

.kinetic-title {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.45rem 0.9rem;
  font-size: clamp(2.4rem, 7.2vw, 5.5rem);
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.045em;
}

.title-solid {
  color: var(--text-primary);
}

.title-dotmatrix {
  color: transparent;
  background-image: radial-gradient(var(--accent) 1.6px, transparent 1.6px);
  background-size: 5px 5px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-stroke: 1px rgba(194, 165, 126, 0.6);
}

.scene-sub {
  font-size: clamp(0.92rem, 1.5vw, 1.06rem);
  color: var(--text-secondary);
  line-height: 1.55;
  max-width: 54ch;
}

.scene-telemetry {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
  margin-top: 0.25rem;
}

.telemetry-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.38rem 0.78rem;
  border-radius: 8px;
  background: rgba(19, 21, 26, 0.9);
  border: 1px solid var(--border-subtle);
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

.chip-label {
  color: var(--text-tertiary);
}

.chip-val {
  color: var(--status-live);
  font-weight: 600;
}

.ai-morph-card {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  background: rgba(19, 21, 26, 0.92);
  border: 1px solid var(--accent-border);
  font-family: var(--font-mono);
  font-size: 0.73rem;
}

.ai-prompt {
  color: var(--text-secondary);
}

.ai-arrow {
  color: var(--accent);
}

.ai-output {
  color: var(--accent);
  font-weight: 600;
}

.code-token-pill {
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  background: rgba(19, 21, 26, 0.92);
  border: 1px solid var(--border-strong);
  font-family: var(--font-mono);
  font-size: 0.73rem;
  color: var(--text-secondary);
}

/* Bottom Identity + HUD Bar */
.stage-bottom {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--border-subtle);
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
  width: 96px;
  height: 3px;
  border-radius: 999px;
  background: var(--border-subtle);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
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

.scene-swap-enter-active,
.scene-swap-leave-active {
  transition: opacity 0.28s var(--ease-out-expo), transform 0.28s var(--ease-out-expo);
}

.scene-swap-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.scene-swap-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .float-badge,
  .float-pill,
  .live-cursor {
    animation: none;
  }
}
</style>
