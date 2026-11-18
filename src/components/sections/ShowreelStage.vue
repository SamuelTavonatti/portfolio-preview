<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../../i18n/useI18n'

const { lang, t } = useI18n()

const isPlaying = ref(true)
const isMuted = ref(true)
const isExpanded = ref(false)
const elapsedMs = ref(0)

const SCENE_DURATION = 4200
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
  const totalSec = Math.floor(elapsedMs.value / 1000)
  const mins = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const secs = String(totalSec % 60).padStart(2, '0')
  const frames = String(Math.floor((elapsedMs.value % 1000) / 16.67)).padStart(2, '0')
  return `${mins}:${secs}:${frames}`
})

const scenes = computed(() => [
  {
    id: 'ux-ui',
    tag: 'SYSTEM_01',
    kicker: 'DEPLOY // V2.0',
    title: 'UX/UI',
    accent: 'DESIGN',
    sub: lang.value === 'it'
      ? 'Ergonomia cognitiva, gerarchia visiva e sistemi interattivi ad alta leggibilità.'
      : 'Cognitive ergonomics, visual hierarchy, and high-clarity interactive systems.',
  },
  {
    id: 'voltrep',
    tag: 'SYSTEM_02',
    kicker: 'PWA // FIREBASE',
    title: 'VOLTREP',
    accent: 'APP',
    sub: lang.value === 'it'
      ? 'Tracciamento carichi in palestra, calcolo tonnellaggio e mappa anatomica a zero paywall.'
      : 'Gym load tracking, tonnage calculation, and anatomical muscle map with zero paywalls.',
  },
  {
    id: 'pimcore',
    tag: 'SYSTEM_03',
    kicker: 'ENTERPRISE // CMS',
    title: 'PIMCORE',
    accent: 'FLOWS',
    sub: lang.value === 'it'
      ? 'Architetture di interlinking, bonifica 404 e logistica eventi per Trentino Marketing.'
      : 'Strategic interlinking, 404 QA auditing, and event logistics for Trentino Marketing.',
  },
  {
    id: 'frontend',
    tag: 'SYSTEM_04',
    kicker: 'VUE 3 // 60FPS',
    title: 'CLEAN',
    accent: 'CODE',
    sub: lang.value === 'it'
      ? 'Componenti modulari, font self-hosted, zero layout shift e accessibilità WCAG AA.'
      : 'Modular components, self-hosted typography, zero layout shift, and WCAG AA contrast.',
  },
])

const activeScene = computed(() => scenes.value[currentSceneIndex.value])

const playTone = (freq = 520, duration = 0.06) => {
  if (isMuted.value || typeof window === 'undefined') return
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    if (!audioCtx) audioCtx = new AudioContextClass()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    gain.gain.setValueAtTime(0.035, audioCtx.currentTime)
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
      playTone(620, 0.05)
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
    playTone(740, 0.07)
  }
}

const jumpScene = (idx) => {
  elapsedMs.value = idx * SCENE_DURATION
  prevScene = idx
  playTone(580, 0.05)
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
  <section class="showreel-section" aria-label="Interactive Showreel">
    <div class="container">
      <div class="showreel-stage" :class="{ 'is-expanded': isExpanded }">
        <!-- Subtle 1px Architectural Grid -->
        <div class="stage-grid" aria-hidden="true" />

        <!-- Top Bar HUD -->
        <div class="stage-top">
          <div class="status-pill">
            <span class="status-dot" :class="{ paused: !isPlaying }" />
            <span class="tabular-nums">{{ t('showreel.pill') }}</span>
          </div>

          <div class="scene-dots" role="tablist" aria-label="Showreel scenes">
            <button
              v-for="(sc, idx) in scenes"
              :key="sc.id"
              type="button"
              role="tab"
              :aria-selected="currentSceneIndex === idx"
              :aria-label="`Scene ${idx + 1}: ${sc.title}`"
              class="scene-dot-btn"
              :class="{ active: currentSceneIndex === idx }"
              @click="jumpScene(idx)"
            >
              <span class="tabular-nums">0{{ idx + 1 }}</span>
            </button>
          </div>
        </div>

        <!-- Center Kinetic Canvas -->
        <div class="stage-center">
          <!-- Floating Micro-Components -->
          <div class="float-badge" aria-hidden="true">+</div>
          <div class="float-pill" aria-hidden="true">
            <span>&lt;</span>
            <span>&gt;</span>
            <span>↓</span>
            <span>•••</span>
          </div>

          <Transition name="scene-swap" mode="out-in">
            <div :key="activeScene.id" class="scene-content">
              <div class="cursor-tag tabular-nums">
                <span class="tag-kicker">{{ activeScene.kicker }}</span>
                <span class="tag-arrow">→</span>
                <span class="tag-code">[{{ activeScene.tag }}]</span>
              </div>

              <h2 class="kinetic-title">
                <span class="title-solid">{{ activeScene.title }}</span>
                <span class="title-dotmatrix">{{ activeScene.accent }}</span>
              </h2>

              <p class="scene-sub">{{ activeScene.sub }}</p>
            </div>
          </Transition>
        </div>

        <!-- Bottom HUD Controls -->
        <div class="stage-bottom">
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
  </section>
</template>

<style scoped>
.showreel-section {
  padding: 0 0 4.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.showreel-stage {
  position: relative;
  width: 100%;
  min-height: 360px;
  aspect-ratio: 16 / 10;
  background-color: #0D0E11;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.15rem;
  box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.75);
}

@media (min-width: 768px) {
  .showreel-stage {
    aspect-ratio: 16 / 9;
    padding: 1.75rem 2rem;
  }
}

.showreel-stage.is-expanded {
  position: fixed;
  inset: 1rem;
  z-index: 250;
  width: auto;
  height: auto;
  aspect-ratio: auto;
  box-shadow: 0 0 0 100vmax rgba(5, 6, 8, 0.86);
}

.stage-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 56px 56px;
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
  gap: 0.5rem;
  background: rgba(19, 21, 26, 0.85);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.04em;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--status-live);
  transition: background-color 0.2s ease;
}

.status-dot.paused {
  background: var(--accent);
}

.scene-dots {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.scene-dot-btn {
  background: rgba(19, 21, 26, 0.8);
  border: 1px solid var(--border-subtle);
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.28rem 0.55rem;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem 0.5rem;
}

.float-badge,
.float-pill {
  display: none;
}

@media (min-width: 768px) {
  .float-badge {
    position: absolute;
    left: 6%;
    top: 12%;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--surface-1);
    border: 1px solid var(--border-strong);
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 1rem;
    display: grid;
    place-items: center;
    animation: floatSlow 5s ease-in-out infinite;
  }

  .float-pill {
    position: absolute;
    right: 6%;
    top: 14%;
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.4rem 0.85rem;
    border-radius: 999px;
    background: var(--surface-1);
    border: 1px solid var(--border-strong);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-secondary);
    animation: floatSlow 6s ease-in-out infinite reverse;
  }
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.scene-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  max-width: 760px;
}

.cursor-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.28rem 0.7rem;
  border-radius: 8px;
  background: rgba(194, 165, 126, 0.1);
  border: 1px solid var(--accent-border);
  color: var(--accent);
}

.tag-arrow {
  color: var(--text-tertiary);
}

.kinetic-title {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.45rem 0.85rem;
  font-size: clamp(2.1rem, 6.8vw, 5.1rem);
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.04em;
}

.title-solid {
  color: var(--text-primary);
}

.title-dotmatrix {
  color: transparent;
  background-image: radial-gradient(var(--accent) 1.5px, transparent 1.5px);
  background-size: 5px 5px;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-stroke: 1px rgba(194, 165, 126, 0.55);
}

.scene-sub {
  font-size: clamp(0.88rem, 1.5vw, 1.02rem);
  color: var(--text-secondary);
  line-height: 1.55;
  max-width: 52ch;
}

.stage-bottom {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .stage-bottom {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.timecode-wrap {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.timecode {
  font-family: var(--font-mono);
  font-size: 0.8rem;
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
  gap: 0.45rem;
}

.hud-btn {
  background: rgba(19, 21, 26, 0.88);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.42rem 0.68rem;
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
  .float-pill {
    animation: none;
  }
}
</style>
