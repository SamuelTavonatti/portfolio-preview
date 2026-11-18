<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../../i18n/useI18n'

const { lang, setLang, t } = useI18n()
const route = useRoute()
const isScrolled = ref(false)
const isMobileOpen = ref(false)

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
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeyDown)
})

const closeMobile = () => {
  isMobileOpen.value = false
}
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container header-inner">
      <router-link to="/" class="brand" @click="closeMobile">
        <span class="brand-mark" aria-hidden="true">ST</span>
        <span class="brand-name">Samuel Tavonatti</span>
      </router-link>

      <nav class="desktop-nav" aria-label="Main navigation">
        <router-link to="/" :class="{ active: route.path === '/' && !route.hash }">
          {{ t('nav.overview') }}
        </router-link>
        <router-link to="/progetti" :class="{ active: route.path.startsWith('/progetti') }">
          {{ t('nav.projects') }}
        </router-link>
        <router-link to="/esperienze" :class="{ active: route.path === '/esperienze' }">
          {{ t('nav.experience') }}
        </router-link>
        <router-link :to="{ path: '/', hash: '#contatti' }" :class="{ active: route.hash === '#contatti' }">
          {{ t('nav.contact') }}
        </router-link>
      </nav>

      <div class="header-actions">
        <div class="lang-switch" role="group" aria-label="Language selector">
          <button type="button" :class="{ active: lang === 'it' }" @click="setLang('it')">
            IT
          </button>
          <span class="divider" aria-hidden="true">/</span>
          <button type="button" :class="{ active: lang === 'en' }" @click="setLang('en')">
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
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1.15rem 0;
  border-bottom: 1px solid transparent;
  transition: padding var(--transition-base), background-color var(--transition-base), border-color var(--transition-base);
}

.site-header.is-scrolled {
  padding: 0.85rem 0;
  background-color: var(--surface-glass);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom-color: var(--border-subtle);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}

.brand-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--surface-2);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  font-size: 0.72rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  letter-spacing: 0.02em;
}

.desktop-nav {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 820px) {
  .desktop-nav {
    display: flex;
  }
}

.desktop-nav a {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.25rem 0;
  position: relative;
  transition: color var(--transition-fast);
}

.desktop-nav a:hover,
.desktop-nav a.active {
  color: var(--text-primary);
}

.desktop-nav a::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1.5px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition-base);
}

.desktop-nav a.active::after,
.desktop-nav a:hover::after {
  transform: scaleX(1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  padding: 0.28rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 600;
}

.lang-switch button {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  transition: color var(--transition-fast);
}

.lang-switch button.active,
.lang-switch button:hover {
  color: var(--accent);
}

.divider {
  color: var(--border-strong);
}

.mobile-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  z-index: 110;
}

@media (min-width: 820px) {
  .mobile-toggle {
    display: none;
  }
}

.bar {
  display: block;
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: var(--text-primary);
  transition: transform var(--transition-fast);
}

.bar.open1 { transform: translateY(4px) rotate(45deg); }
.bar.open2 { transform: translateY(-4px) rotate(-45deg); }

.mobile-drawer {
  position: fixed;
  inset: 0;
  background: rgba(11, 12, 14, 0.96);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  z-index: 95;
  display: grid;
  place-items: center;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
}

.mobile-nav a {
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.mobile-nav a:hover {
  color: var(--accent);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
</style>
