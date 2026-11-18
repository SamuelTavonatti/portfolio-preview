<script setup>
import { useI18n } from '../../i18n/useI18n'

const { t } = useI18n()
const emit = defineEmits(['open-privacy'])
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <span class="tabular-nums">© 2026 Samuel Tavonatti — Trento, IT</span>
      <div class="footer-links">
        <button type="button" class="privacy-trigger" @click="emit('open-privacy')">
          {{ t('footer.privacy') }}
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border-subtle);
  padding: 2rem 0;
  margin-top: 4rem;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

@media (min-width: 640px) {
  .footer-inner {
    flex-direction: row;
  }
}

.privacy-trigger {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color var(--transition-fast);
}

.privacy-trigger:hover {
  color: var(--accent);
}
</style>
