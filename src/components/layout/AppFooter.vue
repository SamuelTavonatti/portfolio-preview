<script setup>
import { useI18n } from '../../i18n/useI18n'

const { lang, t } = useI18n()
const emit = defineEmits(['open-policy'])
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-left">
        <span class="tabular-nums">© 2026 Samuel Tavonatti — Trento, IT</span>
        <span class="gdpr-pill">
          {{
            lang === 'it'
              ? 'Solo preferenze tecniche locali (IT/EN) • Zero cookie di profilazione'
              : 'Local technical preferences only (IT/EN) • Zero tracking cookies'
          }}
        </span>
      </div>
      <div class="footer-links">
        <button type="button" class="policy-trigger" @click="emit('open-policy', 'privacy')">
          {{ t('footer.privacy') }}
        </button>
        <span class="footer-sep" aria-hidden="true">·</span>
        <button type="button" class="policy-trigger" @click="emit('open-policy', 'cookie')">
          {{ t('footer.cookie') }}
        </button>
        <span class="footer-sep" aria-hidden="true">·</span>
        <button type="button" class="policy-trigger" @click="emit('open-policy', 'terms')">
          {{ t('footer.terms') }}
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border-subtle);
  padding: 2rem 0 2.5rem;
  margin-top: 2rem;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

@media (min-width: 820px) {
  .footer-inner {
    flex-direction: row;
    align-items: center;
  }
}

.footer-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
}

.gdpr-pill {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-secondary);
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.footer-sep {
  color: var(--text-tertiary);
}

.policy-trigger {
  min-height: 44px;
  padding: 0.4rem 0.6rem;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 0.2s ease, transform 0.2s var(--ease-spring);
}

.policy-trigger:hover {
  color: var(--accent);
}

.policy-trigger:active {
  transform: scale(0.96);
}
</style>
