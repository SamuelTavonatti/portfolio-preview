<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from '../../i18n/useI18n'
import AppIcon from '../ui/AppIcon.vue'

const props = defineProps({
  isOpen: Boolean,
  activeTab: {
    type: String,
    default: 'privacy', // 'privacy' | 'cookie'
  },
})

const emit = defineEmits(['close'])
const { lang, t } = useI18n()
const currentTab = ref(props.activeTab)

watch(
  () => props.activeTab,
  (val) => {
    currentTab.value = val || 'privacy'
  },
  { immediate: true }
)

watch(
  () => props.isOpen,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
  },
  { immediate: true }
)

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="policy-title">
        <div class="modal-header">
          <h2 id="policy-title">
            {{
              currentTab === 'cookie'
                ? t('footer.cookie')
                : t('footer.privacy')
            }}
          </h2>
          <button
            type="button"
            class="btn-close"
            :aria-label="lang === 'it' ? 'Chiudi' : 'Close'"
            @click="emit('close')"
          >
            <AppIcon name="close" :size="18" />
          </button>
        </div>

        <div class="modal-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            :aria-selected="currentTab === 'privacy'"
            class="modal-tab"
            :class="{ 'is-active': currentTab === 'privacy' }"
            @click="currentTab = 'privacy'"
          >
            {{ t('footer.privacy') }}
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="currentTab === 'cookie'"
            class="modal-tab"
            :class="{ 'is-active': currentTab === 'cookie' }"
            @click="currentTab = 'cookie'"
          >
            {{ t('footer.cookie') }}
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-badge-row">
            <span class="status-badge">GDPR Compliant • Reg. (UE) 2016/679</span>
            <span class="modal-date tabular-nums">
              {{ lang === 'it' ? 'Aggiornamento: Novembre 2026' : 'Updated: November 2026' }}
            </span>
          </div>

          <!-- PRIVACY POLICY -->
          <template v-if="currentTab === 'privacy'">
            <template v-if="lang === 'it'">
              <section class="policy-section">
                <h3>1. Titolare del Trattamento</h3>
                <p>
                  Il Titolare del trattamento è <strong>Samuel Tavonatti</strong>, domiciliato a Trento (TN), Italia, contattabile all’indirizzo email
                  <a href="mailto:samuel.tavonatti05@gmail.com" class="link-highlight">samuel.tavonatti05@gmail.com</a>.
                </p>
              </section>

              <section class="policy-section">
                <h3>2. Minimizzazione dei Dati</h3>
                <p>
                  Questo portfolio è una Single Page Application statica. Non raccoglie dati personali tramite moduli, non utilizza Google Analytics o sistemi di tracciamento comportamentale e non effettua richieste a CDN esterni per i font (<em>Inter</em> e <em>JetBrains Mono</em> sono self-hosted).
                </p>
                <ul>
                  <li><strong>Comunicazioni volontarie:</strong> L’invio spontaneo di email all’indirizzo indicato comporta il trattamento dell’indirizzo e del contenuto esclusivamente per rispondere alla richiesta.</li>
                </ul>
              </section>

              <section class="policy-section">
                <h3>3. Hosting</h3>
                <ul>
                  <li><strong>GitHub Pages (GitHub, Inc.):</strong> Hosting statico e distribuzione dei contenuti; tratta i log tecnici di rete (IP, User-Agent) per sicurezza e routing.</li>
                </ul>
              </section>

              <section class="policy-section">
                <h3>4. Diritti dell’Interessato (Artt. 15–22 GDPR)</h3>
                <p>
                  È possibile esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione o opposizione scrivendo a
                  <a href="mailto:samuel.tavonatti05@gmail.com" class="link-highlight">samuel.tavonatti05@gmail.com</a>.
                </p>
              </section>
            </template>

            <template v-else>
              <section class="policy-section">
                <h3>1. Data Controller</h3>
                <p>
                  The Data Controller is <strong>Samuel Tavonatti</strong>, based in Trento, Italy, reachable at
                  <a href="mailto:samuel.tavonatti05@gmail.com" class="link-highlight">samuel.tavonatti05@gmail.com</a>.
                </p>
              </section>

              <section class="policy-section">
                <h3>2. Data Minimization</h3>
                <p>
                  This portfolio is a static Single Page Application. It collects no form data, uses no Google Analytics or behavioral tracking, and makes zero third-party font requests (<em>Inter</em> and <em>JetBrains Mono</em> are self-hosted).
                </p>
                <ul>
                  <li><strong>Voluntary emails:</strong> Any email you initiate is processed solely to respond to your inquiry.</li>
                </ul>
              </section>

              <section class="policy-section">
                <h3>3. Hosting</h3>
                <ul>
                  <li><strong>GitHub Pages (GitHub, Inc.):</strong> Static hosting and content delivery; processes standard network access logs for security and routing.</li>
                </ul>
              </section>

              <section class="policy-section">
                <h3>4. Your Rights (GDPR Arts. 15–22)</h3>
                <p>
                  You may request access, rectification, or erasure at any time by writing to
                  <a href="mailto:samuel.tavonatti05@gmail.com" class="link-highlight">samuel.tavonatti05@gmail.com</a>.
                </p>
              </section>
            </template>
          </template>

          <!-- COOKIE POLICY -->
          <template v-else>
            <template v-if="lang === 'it'">
              <section class="policy-section">
                <h3>1. Zero Cookie di Profilazione o Terze Parti</h3>
                <p>
                  Questo sito <strong>non installa cookie di profilazione, marketing o analytics</strong> (né propri né di terze parti). Non è pertanto necessario un banner di consenso ai sensi delle Linee Guida del Garante Privacy.
                </p>
              </section>

              <section class="policy-section">
                <h3>2. Archiviazione Locale Tecnica (localStorage)</h3>
                <p>
                  Viene utilizzato esclusivamente <code>localStorage</code> del browser per memorizzare la preferenza linguistica selezionata (<code>it</code> o <code>en</code>) al fine tecnico di mantenere l’interfaccia nella lingua scelta tra una visita e l’altra.
                </p>
                <ul>
                  <li><strong>Chiave tecnica:</strong> <code>st_lang</code> (preferenza lingua locale) — durata: persistente fino a rimozione manuale da parte dell’utente.</li>
                  <li><strong>Rimozione:</strong> È possibile cancellare i dati locali in qualsiasi momento dalle impostazioni del browser.</li>
                </ul>
              </section>
            </template>

            <template v-else>
              <section class="policy-section">
                <h3>1. Zero Tracking or Third-Party Cookies</h3>
                <p>
                  This website <strong>sets no profiling, advertising, or analytics cookies</strong> (first-party or third-party). No cookie consent banner is required under EU ePrivacy and GDPR rules.
                </p>
              </section>

              <section class="policy-section">
                <h3>2. Strictly Necessary Local Storage</h3>
                <p>
                  The browser’s <code>localStorage</code> is used solely to remember your selected interface language (<code>it</code> or <code>en</code>) across sessions.
                </p>
                <ul>
                  <li><strong>Technical key:</strong> Interface language preference — persists until manually cleared by the user.</li>
                  <li><strong>Removal:</strong> You can clear site storage at any time via your browser settings.</li>
                </ul>
              </section>
            </template>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 220;
  background: rgba(5, 5, 7, 0.8);
  backdrop-filter: blur(12px);
  display: grid;
  place-items: center;
  padding: 1.25rem;
}

.modal-container {
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  background: var(--surface-1);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-2xl);
  box-shadow: var(--specular);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-header h2 {
  font-size: 1.08rem;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-close {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-2);
  color: var(--text-secondary);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s var(--ease-spring);
}

.btn-close:hover {
  color: var(--text-primary);
  border-color: var(--accent-border);
}

.btn-close:active {
  transform: scale(0.96);
}

.modal-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-base);
}

.modal-tab {
  min-height: 40px;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.modal-tab.is-active {
  background: var(--accent-soft);
  border-color: var(--accent-border);
  color: var(--accent);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.status-badge {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  color: var(--accent);
}

.modal-date {
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.policy-section h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.45rem;
}

.policy-section p,
.policy-section li {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.policy-section ul {
  padding-left: 1.2rem;
  margin-top: 0.45rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.link-highlight {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
