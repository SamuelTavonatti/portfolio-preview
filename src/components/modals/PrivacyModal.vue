<script setup>
import { useI18n } from '../../i18n/useI18n'
import AppIcon from '../ui/AppIcon.vue'

defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])
const { lang } = useI18n()
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="policy-title">
        <div class="modal-header">
          <h2 id="policy-title">
            {{ lang === 'it' ? 'Note Legali, Privacy & Cookie Policy' : 'Legal Notice, Privacy & Cookie Policy' }}
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

        <div class="modal-body">
          <div class="modal-badge-row">
            <span class="status-badge">GDPR Compliant • Reg. (UE) 2016/679</span>
            <span class="modal-date tabular-nums">
              {{ lang === 'it' ? 'Aggiornamento: Novembre 2026' : 'Updated: November 2026' }}
            </span>
          </div>

          <template v-if="lang === 'it'">
            <section class="policy-section">
              <h3>1. Titolare del Trattamento</h3>
              <p>
                Il Titolare del trattamento è <strong>Samuel Tavonatti</strong>, domiciliato a Trento (TN), Italia, contattabile all’indirizzo email
                <a href="mailto:samuel.tavonatti05@gmail.com" class="link-highlight">samuel.tavonatti05@gmail.com</a>.
              </p>
            </section>

            <section class="policy-section">
              <h3>2. Minimizzazione dei Dati &amp; Assenza di Cookie di Profilazione</h3>
              <p>
                Questo portfolio è una Single Page Application statica. Non utilizza cookie di profilazione, analytics di tracciamento comportamentale né moduli con salvataggio su database. I font tipografici (<em>Inter</em>) sono ospitati localmente (self-hosted) senza richieste a server terzi.
              </p>
              <ul>
                <li><strong>Preferenza lingua:</strong> La scelta IT/EN viene salvata localmente nel browser (<code>localStorage</code>) al solo scopo tecnico di mantenere la lingua selezionata.</li>
                <li><strong>Comunicazioni volontarie:</strong> L’eventuale invio spontaneo di email comporta il trattamento dell’indirizzo e del messaggio esclusivamente per rispondere alla richiesta.</li>
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
              <h3>2. Data Minimization &amp; No Tracking Cookies</h3>
              <p>
                This portfolio is a static Single Page Application. It does not use profiling cookies, behavioral analytics, or server-side contact form databases. Typefaces (<em>Inter</em>) are self-hosted with zero third-party font requests.
              </p>
              <ul>
                <li><strong>Language preference:</strong> Your IT/EN choice is stored locally in <code>localStorage</code> strictly to preserve interface language.</li>
                <li><strong>Voluntary emails:</strong> Any email you initiate is processed solely to respond to your inquiry.</li>
              </ul>
            </section>

            <section class="policy-section">
              <h3>3. Hosting</h3>
              <ul>
                <li><strong>GitHub Pages (GitHub, Inc.):</strong> Static hosting and content delivery; processes standard network access logs for security and delivery.</li>
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
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(5, 6, 8, 0.78);
  backdrop-filter: blur(8px);
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-header h2 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-close {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-2);
  color: var(--text-secondary);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.btn-close:hover {
  color: var(--text-primary);
  border-color: var(--accent-border);
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
</style>
