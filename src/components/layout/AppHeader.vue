<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../../i18n/useI18n'
import { profileData } from '../../data/profile'
import AppIcon from '../ui/AppIcon.vue'

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
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})

watch([activeKey, lang], () => nextTick(measure))

watch(isMobileOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

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
      <div v-if="isMobileOpen" class="mobile-drawer-overlay" @click.self="closeMobile">
        <aside
          class="side-drawer"
          role="dialog"
          aria-modal="true"
          :aria-label="lang === 'it' ? 'Indice di navigazione' : 'Navigation index'"
        >
          <!-- Top Header -->
          <div class="drawer-header">
            <span class="drawer-kicker mono">{{ lang === 'it' ? 'INDICE' : 'INDEX' }}</span>
            <button
              type="button"
              class="drawer-close"
              :aria-label="t('nav.closeMenu')"
              @click="closeMobile"
            >
              <AppIcon name="close" :size="18" />
            </button>
          </div>

          <!-- Middle Navigation (Numbered Items) -->
          <nav class="drawer-nav" aria-label="Mobile navigation">
            <router-link
              to="/"
              data-key="overview"
              :class="{ active: activeKey === 'overview' }"
              @click="closeMobile"
            >
              <span class="nav-num mono">01</span>
              <span class="nav-label">{{ t('nav.overview') }}</span>
              <span v-if="activeKey === 'overview'" class="nav-active-pip" aria-hidden="true" />
            </router-link>
            <router-link
              to="/progetti"
              data-key="projects"
              :class="{ active: activeKey === 'projects' }"
              @click="closeMobile"
            >
              <span class="nav-num mono">02</span>
              <span class="nav-label">{{ t('nav.projects') }}</span>
              <span v-if="activeKey === 'projects'" class="nav-active-pip" aria-hidden="true" />
            </router-link>
            <router-link
              to="/esperienze"
              data-key="experience"
              :class="{ active: activeKey === 'experience' }"
              @click="closeMobile"
            >
              <span class="nav-num mono">03</span>
              <span class="nav-label">{{ t('nav.experience') }}</span>
              <span v-if="activeKey === 'experience'" class="nav-active-pip" aria-hidden="true" />
            </router-link>
            <router-link
              :to="{ path: '/', hash: '#contatti' }"
              data-key="contact"
              :class="{ active: activeKey === 'contact' }"
              @click="closeMobile"
            >
              <span class="nav-num mono">04</span>
              <span class="nav-label">{{ t('nav.contact') }}</span>
              <span v-if="activeKey === 'contact'" class="nav-active-pip" aria-hidden="true" />
            </router-link>
          </nav>

          <!-- Bottom Utility Footer -->
          <div class="drawer-footer">
            <div class="drawer-lang-switch" role="group" aria-label="Language selector">
              <button
                type="button"
                :class="{ active: lang === 'it' }"
                :aria-pressed="lang === 'it'"
                @click="setLang('it')"
              >
                IT
              </button>
              <span class="lang-divider" aria-hidden="true">/</span>
              <button
                type="button"
                :class="{ active: lang === 'en' }"
                :aria-pressed="lang === 'en'"
                @click="setLang('en')"
              >
                EN
              </button>
            </div>

            <div class="drawer-socials">
              <a
                :href="profileData.links.github"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                class="drawer-social-pill"
              >
                <AppIcon name="github" :size="16" />
              </a>
              <a
                :href="profileData.links.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                class="drawer-social-pill"
              >
                <AppIcon name="linkedin" :size="16" />
              </a>
              <a
                :href="`mailto:${profileData.email}`"
                aria-label="Email"
                class="drawer-social-pill"
              >
                <AppIcon name="mail" :size="16" />
              </a>
            </div>
          </div>
        </aside>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 160;
  padding-top: 10px;
  padding-bottom: 14px;
  pointer-events: none;
  background: linear-gradient(180deg, #04060C 0%, rgba(5, 8, 17, 0.96) 62%, rgba(5, 8, 17, 0) 100%);
}

.header-shell {
  pointer-events: none;
}

/* Floating Liquid Glass capsule — edges flush with the editorial grid */
.header-bar {
  pointer-events: auto;
  position: relative;
  z-index: 165;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 52px;
  padding: 0.25rem 0.5rem 0.25rem 0.6rem;
  border-radius: 9999px;
  background: rgba(5, 8, 17, 0.94);
  border: 1px solid rgba(148, 197, 255, 0.14);
  box-shadow: var(--specular), 0 12px 32px -10px rgba(4, 6, 12, 0.88);
  backdrop-filter: blur(20px) saturate(185%);
  -webkit-backdrop-filter: blur(20px) saturate(185%);
  transition: background-color var(--transition-base), border-color var(--transition-base);
}

.site-header.is-scrolled .header-bar {
  background: rgba(5, 8, 17, 0.97);
  border-color: rgba(148, 197, 255, 0.22);
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
  border: 1px solid rgba(56, 189, 248, 0.45);
  box-shadow: var(--specular), 0 0 18px var(--accent-lumina-glow);
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
  background: var(--accent-azure-soft);
  border: 1px solid rgba(56, 189, 248, 0.45);
  box-shadow: var(--specular), 0 0 14px var(--accent-lumina-glow);
  transition: transform 0.45s var(--ease-spring);
}

.lang-thumb.is-en {
  transform: translateX(100%);
}

.lang-switch button {
  position: relative;
  z-index: 1;
  min-width: 44px;
  min-height: 44px;
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

.lang-switch button::after {
  content: '';
  position: absolute;
  inset: -2px;
}

.lang-switch button:active {
  transform: scale(0.96);
}

.lang-switch button.active,
.lang-switch button:hover {
  color: var(--accent-lumina-bright);
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

.mobile-drawer-overlay {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(4, 6, 12, 0.38);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
}

.side-drawer {
  width: min(80vw, 320px);
  height: calc(100dvh - 24px);
  margin: 12px;
  border-radius: 24px;
  background: rgba(11, 17, 32, 0.92);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), -12px 0 40px rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem 1.2rem;
  box-sizing: border-box;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-kicker {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--accent-azure);
}

.drawer-close {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.18s ease, transform 0.18s var(--ease-spring);
}

.drawer-close:active {
  transform: scale(0.92);
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1.5rem 0;
  flex: 1;
}

.drawer-nav a {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-height: 52px;
  padding: 0 1.15rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  transition: transform 0.18s var(--ease-spring), color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  animation: drawerItemIn 0.36s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.drawer-nav a:nth-child(1) { animation-delay: 0ms; }
.drawer-nav a:nth-child(2) { animation-delay: 40ms; }
.drawer-nav a:nth-child(3) { animation-delay: 80ms; }
.drawer-nav a:nth-child(4) { animation-delay: 120ms; }

@keyframes drawerItemIn {
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.drawer-nav a:active {
  transform: scale(0.97);
}

.drawer-nav a.active {
  color: var(--text-primary);
  background: rgba(56, 189, 248, 0.08);
  border-color: rgba(56, 189, 248, 0.38);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 20px rgba(56, 189, 248, 0.15);
}

.drawer-nav a.active .nav-num {
  color: var(--accent-azure);
}

.nav-num {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-tertiary);
  font-weight: 600;
}

.nav-label {
  flex: 1;
}

.nav-active-pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-azure);
  box-shadow: 0 0 8px var(--accent-azure);
}

.drawer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer-lang-switch button {
  background: none;
  border: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 2px 4px;
  transition: color 0.18s ease;
}

.drawer-lang-switch button.active {
  color: var(--accent-azure);
}

.lang-divider {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-tertiary);
  opacity: 0.5;
}

.drawer-socials {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.drawer-social-pill {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s var(--ease-spring);
}

.drawer-social-pill:hover,
.drawer-social-pill:focus-visible {
  color: var(--accent-azure);
  border-color: rgba(56, 189, 248, 0.35);
  transform: translateY(-1px);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.28s var(--ease-out-expo);
}

.drawer-enter-active .side-drawer,
.drawer-leave-active .side-drawer {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .side-drawer,
.drawer-leave-to .side-drawer {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .nav-pill,
  .lang-thumb {
    transition: none;
  }
  .drawer-nav a {
    animation: none;
  }
}
</style>
