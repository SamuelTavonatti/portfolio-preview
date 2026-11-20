<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../../i18n/useI18n'

const { lang, setLang, t } = useI18n()
const route = useRoute()
const isScrolled = ref(false)
const isMobileOpen = ref(false)

const navEl = ref(null)
const pill = ref({ x: 0, w: 0, ready: false })

const activeKey = computed(() => {
  if (route.hash === '#contatti') return 'contact'
  if (route.path.startsWith('/progetti')) return 'projects'
  if (route.path === '/esperienze') return 'experience'
  return 'overview'
})

// Pixel-accurate sliding pill: measured from the live DOM rect of the active link.
const measure = () => {
  const nav = navEl.value
  if (!nav) return
  const el = nav.querySelector(`[data-key="${activeKey.value}"]`)
  if (!el) return
  const n = nav.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  pill.value = { x: r.left - n.left, w: r.width, ready: true }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 24
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isMobileOpen.value) {
    isMobileOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', measure)
  nextTick(measure)
  if (document.fonts?.ready) document.fonts.ready.then(measure)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', measure)
})

watch([activeKey, lang], () => nextTick(measure))

const closeMobile = () => {
  isMobileOpen.value = false
}
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container header-shell">
      <div class="header-bar">
        <router-link to="/" class="brand" @click="closeMobile">
          <span class="brand-mark" aria-hidden="true">ST</span>
          <span class="brand-name">Samuel Tavonatti</span>
        </router-link>

        <nav ref="navEl" class="desktop-nav" aria-label="Main navigation">
          <span
            class="nav-pill"
            :class="{ 'is-ready': pill.ready }"
            :style="{ transform: `translateX(${pill.x}px)`, width: `${pill.w}px` }"
            aria-hidden="true"
          />
          <router-link to="/" data-key="overview" :class="{ active: activeKey === 'overview' }">
            {{ t('nav.overview') }}
          </router-link>
          <router-link to="/progetti" data-key="projects" :class="{ active: activeKey === 'projects' }">
            {{ t('nav.projects') }}
          </router-link>
          <router-link to="/esperienze" data-key="experience" :class="{ active: activeKey === 'experience' }">
            {{ t('nav.experience') }}
          </router-link>
          <router-link
            :to="{ path: '/', hash: '#contatti' }"
            data-key="contact"
            :class="{ active: activeKey === 'contact' }"
          >
            {{ t('nav.contact') }}
          </router-link>
        </nav>

        <div class="header-actions">
          <div class="lang-switch" role="group" aria-label="Language selector">
            <span class="lang-thumb" :class="{ 'is-en': lang === 'en' }" aria-hidden="true" />
            <button type="button" :class="{ active: lang === 'it' }" :aria-pressed="lang === 'it'" @click="setLang('it')">
              IT
            </button>
            <button type="button" :class="{ active: lang === 'en' }" :aria-pressed="lang === 'en'" @click="setLang('en')">
              EN
            </button>
          </div>

          <button
            type="button"
            class="mobile-toggle"
            :aria-expanded="isMobileOpen"
            :aria-label="isMobileOpen ? t('nav.closeMenu') : t('nav.openMenu')"
            @click="isMobileOpen = !isMobileOpen"
          >
            <span class="bar" :class="{ open1: isMobileOpen }" />
            <span class="bar" :class="{ open2: isMobileOpen }" />
          </button>
        </div>
      </div>
    </div>

    <Transition name="drawer">
      <div v-if="isMobileOpen" class="mobile-drawer" @click.self="closeMobile">
        <nav class="mobile-nav" aria-label="Mobile navigation">
          <router-link to="/" @click="closeMobile">{{ t('nav.overview') }}</router-link>
          <router-link to="/progetti" @click="closeMobile">{{ t('nav.projects') }}</router-link>
          <router-link to="/esperienze" @click="closeMobile">{{ t('nav.experience') }}</router-link>
          <router-link :to="{ path: '/', hash: '#contatti' }" @click="closeMobile">{{ t('nav.contact') }}</router-link>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 10px;
  left: 0;
  right: 0;
  z-index: 100;
  pointer-events: none;
}

.header-shell {
  pointer-events: none;
}

/* Floating Liquid Glass capsule — edges flush with the editorial grid */
.header-bar {
  pointer-events: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 52px;
  padding: 0.25rem 0.5rem 0.25rem 0.6rem;
  border-radius: 9999px;
  background: rgba(4, 6, 12, 0.78);
  border: 1px solid rgba(148, 197, 255, 0.12);
  box-shadow: var(--specular), 0 10px 30px -12px rgba(4, 6, 12, 0.75);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  transition: background-color var(--transition-base), border-color var(--transition-base);
}

.site-header.is-scrolled .header-bar {
  background: rgba(4, 6, 12, 0.88);
  border-color: rgba(148, 197, 255, 0.18);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 44px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: -0.02em;
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  letter-spacing: 0.02em;
}

.desktop-nav {
  display: none;
  position: relative;
  align-items: center;
  gap: 0.15rem;
  padding: 4px;
  border-radius: 9999px;
  background: rgba(11, 17, 32, 0.55);
  border: 1px solid rgba(148, 197, 255, 0.1);
}

@media (min-width: 820px) {
  .desktop-nav {
    display: flex;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}

/* Sliding pill: width + position are animated directly (no scaleX distortion) */
.nav-pill {
  position: absolute;
  top: 4px;
  left: 0;
  height: calc(100% - 8px);
  border-radius: 9999px;
  background: var(--accent-azure-soft);
  border: 1px solid var(--accent-azure-border);
  box-shadow: var(--specular);
  opacity: 0;
  transition:
    transform 0.5s var(--ease-spring),
    width 0.5s var(--ease-spring),
    opacity 0.2s var(--ease-effects);
  will-change: transform, width;
}

.nav-pill.is-ready {
  opacity: 1;
}

.desktop-nav a {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 1.05rem;
  border-radius: 9999px;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.2s var(--ease-effects);
}

.desktop-nav a:hover,
.desktop-nav a.active {
  color: var(--text-primary);
}

.desktop-nav a.active {
  color: var(--accent-hover);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Elastic IT / EN sliding language toggle */
.lang-switch {
  position: relative;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 3px;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 600;
}

.lang-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(50% - 3px);
  height: calc(100% - 6px);
  border-radius: 9999px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  box-shadow: var(--specular);
  transition: transform 0.45s var(--ease-spring);
}

.lang-thumb.is-en {
  transform: translateX(100%);
}

.lang-switch button {
  position: relative;
  z-index: 1;
  min-width: 44px;
  min-height: 40px;
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: 0.04em;
  padding: 0 0.7rem;
  transition: color 0.2s var(--ease-effects), transform 0.14s var(--ease-out-expo);
}

.lang-switch button:active {
  transform: scale(0.96);
}

.lang-switch button.active,
.lang-switch button:hover {
  color: var(--accent-hover);
}

.mobile-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  z-index: 110;
}

@media (min-width: 820px) {
  .mobile-toggle {
    display: none;
  }
}

.bar {
  display: block;
  width: 20px;
  height: 2px;
  border-radius: 2px;
  background: var(--text-primary);
  transition: transform var(--transition-fast);
}

.bar.open1 { transform: translateY(4px) rotate(45deg); }
.bar.open2 { transform: translateY(-4px) rotate(-45deg); }

.mobile-drawer {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 7, 0.94);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  z-index: 95;
  display: flex;
  align-items: flex-end;
  padding: 0 1.25rem 3rem;
}

/* Thumb-zone: mobile navigation anchored to the lower reach area */
.mobile-nav {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
  width: 100%;
}

.mobile-nav a {
  display: flex;
  align-items: center;
  min-height: 56px;
  padding: 0 1.5rem;
  border-radius: var(--radius-3xl);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--specular);
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: var(--track-display);
  transition: transform 0.14s var(--ease-out-expo), border-color 0.2s var(--ease-effects);
}

.mobile-nav a:active {
  transform: scale(0.96);
}

.mobile-nav a:hover {
  border-color: var(--accent-border);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s var(--ease-effects);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .nav-pill,
  .lang-thumb {
    transition: none;
  }
}
</style>
