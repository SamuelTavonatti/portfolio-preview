<script setup>
import { onUnmounted, ref, toRef, watch } from 'vue'
import { useI18n } from '../../i18n/useI18n'
import { useFocusTrap } from '../../composables/useFocusTrap'
import AppIcon from '../ui/AppIcon.vue'

const props = defineProps({
  isOpen: Boolean,
  activeTab: {
    type: String,
    default: 'privacy', // 'privacy' | 'cookie' | 'terms'
  },
})

const emit = defineEmits(['close'])
const { lang, t } = useI18n()
const currentTab = ref(props.activeTab)
const modalContainerRef = ref(null)

useFocusTrap(modalContainerRef, toRef(props, 'isOpen'), () => emit('close'))

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

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div
        ref="modalContainerRef"
        class="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-title"
        tabindex="-1"
      >
        <div class="modal-header">
          <h2 id="policy-title">
            {{
              currentTab === 'cookie'
                ? t('footer.cookie')
                : currentTab === 'terms'
                  ? t('footer.terms')
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
          <button
            type="button"
            role="tab"
            :aria-selected="currentTab === 'terms'"
            class="modal-tab"
            :class="{ 'is-active': currentTab === 'terms' }"
            @click="currentTab = 'terms'"
          >
            {{ t('footer.terms') }}
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-badge-row">
            <span class="status-badge">GDPR Compliant • Reg. (UE) 2016/679</span>
            <span class="modal-date tabular-nums">
              {{ lang === 'it' ? 'Aggiornamento: Novembre 2026' : 'Updated: November 2026' }}
            </span>
          </div>

          <!-- 1. PRIVACY POLICY -->
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
                <h3>2. Minimizzazione dei Dati &amp; Zero Tracciamento</h3>
                <p>
                  Questo portfolio è una Single Page Application statica. Non utilizza sistemi di analisi comportamentale, script di tracciamento né richieste a CDN esterni per i font (<em>Inter Variable</em> e <em>JetBrains Mono</em> sono self-hosted). La verifica di proprietà su Google Search Console avviene tramite un meta-tag HTML passivo che non raccoglie alcun dato dei visitatori.
                </p>
                <ul>
                  <li><strong>Comunicazioni volontarie (Art. 6.1.b/f GDPR):</strong> L’invio spontaneo di email all’indirizzo indicato comporta il trattamento dell’indirizzo e del messaggio esclusivamente per rispondere alla richiesta.</li>
                </ul>
              </section>

              <section class="policy-section">
                <h3>3. Hosting Statico</h3>
                <ul>
                  <li><strong>GitHub Pages (GitHub, Inc.):</strong> Hosting statico e distribuzione dei contenuti; tratta i log tecnici di rete (IP, User-Agent) per sicurezza e routing.</li>
                </ul>
              </section>

              <section class="policy-section">
                <h3>4. Diritti dell’Interessato (Artt. 15–22 GDPR)</h3>
                <p>
                  È possibile esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione, limitazione e opposizione scrivendo a
                  <a href="mailto:samuel.tavonatti05@gmail.com" class="link-highlight">samuel.tavonatti05@gmail.com</a>, oltre al diritto di proporre reclamo al
                  <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" class="link-highlight">Garante per la Protezione dei Dati Personali</a>.
                </p>
              </section>
            </template>

            <template v-else>
              <section class="policy-section">
                <h3>1. Data Controller</h3>
                <p>
                  The Data Controller is <strong>Samuel Tavonatti</strong>, based in Trento (TN), Italy, reachable at
                  <a href="mailto:samuel.tavonatti05@gmail.com" class="link-highlight">samuel.tavonatti05@gmail.com</a>.
                </p>
              </section>

              <section class="policy-section">
                <h3>2. Data Minimization &amp; Zero Tracking</h3>
                <p>
                  This portfolio is a static Single Page Application. It uses zero behavioral analytics, zero tracking scripts, and zero third-party font CDNs (<em>Inter Variable</em> and <em>JetBrains Mono</em> are self-hosted). Google Search Console ownership verification relies solely on a passive static HTML meta tag that collects no visitor data.
                </p>
                <ul>
                  <li><strong>Voluntary inquiries (GDPR Art. 6.1.b/f):</strong> Any email you initiate is processed strictly to respond to your message.</li>
                </ul>
              </section>

              <section class="policy-section">
                <h3>3. Static Hosting</h3>
                <ul>
                  <li><strong>GitHub Pages (GitHub, Inc.):</strong> Static hosting and content delivery; processes standard network access logs (IP, User-Agent) for security and routing.</li>
                </ul>
              </section>

              <section class="policy-section">
                <h3>4. Your Rights (GDPR Arts. 15–22)</h3>
                <p>
                  You may request access, rectification, erasure, restriction, or objection at any time by writing to
                  <a href="mailto:samuel.tavonatti05@gmail.com" class="link-highlight">samuel.tavonatti05@gmail.com</a>, or lodge a complaint with the Italian Data Protection Authority (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" class="link-highlight">Garante Privacy</a>).
                </p>
              </section>
            </template>
          </template>

          <!-- 2. COOKIE POLICY -->
          <template v-else-if="currentTab === 'cookie'">
            <template v-if="lang === 'it'">
              <section class="policy-section">
                <h3>1. Zero Cookie di Profilazione o Terze Parti</h3>
                <p>
                  Questo sito <strong>non installa cookie di profilazione, pubblicitari o analytics</strong> (né propri né di terze parti). Non è pertanto necessario un banner di consenso ai sensi delle Linee Guida del Garante Privacy e della normativa ePrivacy.
                </p>
              </section>

              <section class="policy-section">
                <h3>2. Archiviazione Locale Tecnica (localStorage)</h3>
                <p>
                  Viene utilizzato esclusivamente <code>localStorage</code> del browser per memorizzare la preferenza linguistica selezionata (<code>it</code> o <code>en</code>) al solo scopo tecnico di mantenere l’interfaccia nella lingua scelta tra una visita e l’altra.
                </p>
                <ul>
                  <li><strong>Chiave tecnica:</strong> <code>st_lang</code> — durata: persistente fino a rimozione manuale da parte dell’utente.</li>
                  <li><strong>Come cancellarla:</strong> È possibile eliminare i dati locali in qualsiasi momento dalle impostazioni del browser (<em>Privacy e sicurezza → Cancella dati di navigazione / Archiviazione sito</em>).</li>
                </ul>
              </section>
            </template>

            <template v-else>
              <section class="policy-section">
                <h3>1. Zero Profiling or Third-Party Cookies</h3>
                <p>
                  This website <strong>sets no profiling, advertising, or analytics cookies</strong> (first-party or third-party). No cookie consent banner is required under EU ePrivacy and GDPR guidelines.
                </p>
              </section>

              <section class="policy-section">
                <h3>2. Strictly Necessary Local Storage</h3>
                <p>
                  The browser’s <code>localStorage</code> is used solely to remember your selected interface language (<code>it</code> or <code>en</code>) across sessions.
                </p>
                <ul>
                  <li><strong>Technical key:</strong> <code>st_lang</code> — duration: persistent until manually cleared by the user.</li>
                  <li><strong>How to clear:</strong> You can remove site data anytime in your browser settings (<em>Privacy &amp; Security → Clear site data / Local storage</em>).</li>
                </ul>
              </section>
            </template>
          </template>

          <!-- 3. TERMS OF USE -->
          <template v-else>
            <template v-if="lang === 'it'">
              <section class="policy-section">
                <h3>1. Oggetto e Utilizzo del Sito</h3>
                <p>
                  Questo sito ha finalità esclusivamente informative e di presentazione professionale del portfolio di <strong>Samuel Tavonatti</strong>. I contenuti e i case study non costituiscono un’offerta commerciale vincolante.
                </p>
              </section>

              <section class="policy-section">
                <h3>2. Proprietà Intellettuale &amp; Copyright</h3>
                <p>
                  Salvo diversa indicazione, tutti i testi, i case study (incluso <em>VoltRep</em>), i design UI/UX, la grafica e gli snippet originali sono di proprietà di <strong>© 2026 Samuel Tavonatti</strong>. È vietata la riproduzione o redistribuzione commerciale senza consenso scritto.
                </p>
              </section>

              <section class="policy-section">
                <h3>3. Uso Accettabile, Link Esterni &amp; Legge Applicabile</h3>
                <ul>
                  <li><strong>Uso accettabile:</strong> È vietato qualsiasi tentativo di scraping automatizzato abusivo o alterazione del servizio statico.</li>
                  <li><strong>Link esterni:</strong> Il sito contiene collegamenti a piattaforme terze (GitHub, LinkedIn, Instagram, demo live); il Titolare non risponde dei relativi contenuti o policy.</li>
                  <li><strong>Legge applicabile:</strong> I presenti Termini sono regolati dalla legge italiana ed europea vigente.</li>
                </ul>
              </section>
            </template>

            <template v-else>
              <section class="policy-section">
                <h3>1. Scope &amp; Purpose</h3>
                <p>
                  This website serves strictly informational and professional portfolio purposes for <strong>Samuel Tavonatti</strong>. Case studies and descriptions do not constitute a binding commercial offer.
                </p>
              </section>

              <section class="policy-section">
                <h3>2. Intellectual Property &amp; Copyright</h3>
                <p>
                  Unless otherwise stated, all copy, case studies (including <em>VoltRep</em>), UI/UX designs, visual assets, and original code snippets are owned by <strong>© 2026 Samuel Tavonatti</strong>. Commercial reproduction without prior written consent is prohibited.
                </p>
              </section>

              <section class="policy-section">
                <h3>3. Acceptable Use, External Links &amp; Governing Law</h3>
                <ul>
                  <li><strong>Acceptable use:</strong> Abusive automated scraping or interference with static hosting delivery is prohibited.</li>
                  <li><strong>External links:</strong> Links to third-party platforms (GitHub, LinkedIn, Instagram, live demos) are provided for reference; the owner is not responsible for external content or policies.</li>
                  <li><strong>Governing law:</strong> These Terms are governed by applicable Italian and European Union law.</li>
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
  background: rgba(4, 6, 12, 0.84);
  backdrop-filter: blur(14px);
  display: grid;
  place-items: center;
  padding: 1.25rem;
}

.modal-container {
  width: 100%;
  max-width: 700px;
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
  border-color: var(--accent-azure-border);
}

.btn-close:active {
  transform: scale(0.96);
}

.modal-tabs {
  display: flex;
  flex-wrap: wrap;
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
  font-size: 0.84rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.modal-tab.is-active {
  background: var(--accent-azure-soft);
  border-color: var(--accent-azure-border);
  color: var(--accent-lumina-bright);
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
  background: var(--accent-azure-soft);
  border: 1px solid var(--accent-azure-border);
  color: var(--accent-lumina-bright);
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
  color: var(--accent-lumina-bright);
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
