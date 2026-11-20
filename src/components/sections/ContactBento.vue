<script setup>
import { computed, inject, ref, watch } from 'vue'
import { profileData } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import AppIcon from '../ui/AppIcon.vue'
import BaseDropdown from '../ui/BaseDropdown.vue'

const { lang, t } = useI18n()
const openPolicy = inject('openPolicy', null)

const copied = ref(false)
const nameInput = ref('')
const emailInput = ref('')
const subjectInput = ref('')
const messageInput = ref('')
const gdprAccepted = ref(false)
const formError = ref('')
const sentNotice = ref('')

const subjectsIT = [
  'Collaborazione UI/UX & Design System',
  'Sviluppo Front-End / Web App',
  'Progetto Motion / Showreel',
  'Stage / Opportunità Lavorativa',
  'Altro',
]

const subjectsEN = [
  'UI/UX & Design System Collaboration',
  'Front-End / Web App Engineering',
  'Motion / Showreel Project',
  'Internship / Job Opportunity',
  'Other',
]

const subjects = computed(() => (lang.value === 'it' ? subjectsIT : subjectsEN))

watch(lang, (newLang, oldLang) => {
  if (!subjectInput.value) return
  if (oldLang === 'it' && newLang === 'en') {
    const idx = subjectsIT.indexOf(subjectInput.value)
    if (idx !== -1) subjectInput.value = subjectsEN[idx]
  } else if (oldLang === 'en' && newLang === 'it') {
    const idx = subjectsEN.indexOf(subjectInput.value)
    if (idx !== -1) subjectInput.value = subjectsIT[idx]
  }
})

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(profileData.email)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2200)
  } catch {
    copied.value = false
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const handleSubmit = async () => {
  formError.value = ''
  sentNotice.value = ''

  const rawName = nameInput.value.replace(/[\r\n]+/g, ' ').trim()
  const rawEmail = emailInput.value.replace(/[\r\n]+/g, ' ').trim()
  const rawMsg = messageInput.value.trim()

  if (!rawName || !rawEmail || !rawMsg) {
    formError.value =
      lang.value === 'it'
        ? 'Compila nome, email e messaggio prima di procedere.'
        : 'Please fill in your name, email, and message.'
    return
  }

  if (!EMAIL_REGEX.test(rawEmail)) {
    formError.value =
      lang.value === 'it'
        ? 'Inserisci un indirizzo email valido (es. nome@dominio.com).'
        : 'Please enter a valid email address (e.g. name@domain.com).'
    return
  }

  if (!gdprAccepted.value) {
    formError.value =
      lang.value === 'it'
        ? 'Conferma di aver letto l’Informativa Privacy per continuare.'
        : 'Please accept the Privacy Policy before sending.'
    return
  }

  const chosenSubject = (subjectInput.value || subjects.value[0]).replace(/[\r\n]+/g, ' ').trim()
  const formattedBody = `${lang.value === 'it' ? 'Da' : 'From'}: ${rawName} (${rawEmail})\n\n${rawMsg}`
  const mailtoUrl = `mailto:${profileData.email}?subject=${encodeURIComponent(chosenSubject)}&body=${encodeURIComponent(formattedBody)}`

  let copySuccess = false
  try {
    await navigator.clipboard.writeText(`${chosenSubject}\n\n${formattedBody}`)
    copySuccess = true
  } catch {
    copySuccess = false
  }

  try {
    window.location.href = mailtoUrl
  } catch {
    // window location fallback
  }

  sentNotice.value = copySuccess
    ? (lang.value === 'it'
        ? 'Client email avviato e messaggio copiato negli appunti ✓'
        : 'Email client launched and message copied to clipboard ✓')
    : (lang.value === 'it'
        ? 'Client email avviato ✓'
        : 'Email client launched ✓')
}

const socialLinks = [
  {
    name: 'LinkedIn',
    href: profileData.links.linkedin,
    icon: 'linkedin',
  },
  {
    name: 'GitHub',
    href: profileData.links.github,
    icon: 'github',
  },
  {
    name: 'Instagram',
    href: profileData.links.instagram,
    icon: 'instagram',
  },
]
</script>

<template>
  <section id="contatti" class="section-block section-block--closing">
    <div class="container scroll-reveal">
      <div class="contact-split-bento">
        <!-- LEFT COLUMN: Editorial Direct Info & Channels -->
        <article class="glass-card contact-info-card">
          <div class="info-top-block">
            <span class="section-kicker tabular-nums">{{ t('sections.contactKicker') }}</span>
            <h2 class="contact-title">{{ t('sections.contactTitle') }}</h2>
            <p class="contact-subtitle">{{ t('contact.lead') }}</p>

            <div class="status-pill mono">
              <span class="status-dot" aria-hidden="true"></span>
              <span>
                {{
                  lang === 'it'
                    ? 'Disponibile per progetti & stage'
                    : 'Available for projects & internships'
                }}
              </span>
            </div>
          </div>

          <div class="info-bottom-block">
            <!-- Normal-Scale Lowercase Email Row -->
            <div class="contact-email-row">
              <a :href="`mailto:${profileData.email}`" class="email-address mono">
                {{ profileData.email.toLowerCase() }}
              </a>
              <button
                type="button"
                class="copy-btn mono"
                :class="{ 'is-copied': copied }"
                :aria-label="t('contact.copyAria')"
                @click="copyEmail"
              >
                <AppIcon :name="copied ? 'check' : 'copy'" :size="14" />
                <span>{{ copied ? (lang === 'it' ? 'Copiato ✓' : 'Copied ✓') : (lang === 'it' ? 'Copia' : 'Copy') }}</span>
              </button>
            </div>

            <!-- Minimalist Social Pills Row -->
            <div class="social-pills-row" role="list" :aria-label="t('contact.profiles')">
              <a
                v-for="item in socialLinks"
                :key="item.name"
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
                class="social-pill"
                role="listitem"
              >
                <AppIcon :name="item.icon" :size="14" class="social-icon" />
                <span>{{ item.name }}</span>
                <span class="social-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </article>

        <!-- RIGHT COLUMN: Clean Minimalist Message Form -->
        <form class="glass-card contact-form-card" novalidate @submit.prevent="handleSubmit">
          <div class="form-header">
            <span class="form-kicker mono">{{ lang === 'it' ? 'TRASMISSIONE DIRETTA' : 'DIRECT TRANSMISSION' }}</span>
          </div>

          <div class="tx-grid-2">
            <label class="tx-field" for="tx-name">
              <span class="tx-label mono">{{ lang === 'it' ? 'NOME / AZIENDA' : 'NAME / COMPANY' }}</span>
              <input
                id="tx-name"
                v-model="nameInput"
                type="text"
                required
                maxlength="80"
                :placeholder="lang === 'it' ? 'Mario Rossi — Studio' : 'Alex Morgan — Studio'"
                class="tx-input"
              />
            </label>

            <label class="tx-field" for="tx-email">
              <span class="tx-label mono">EMAIL</span>
              <input
                id="tx-email"
                v-model="emailInput"
                type="email"
                required
                maxlength="100"
                placeholder="name@company.com"
                class="tx-input"
              />
            </label>
          </div>

          <div class="tx-field">
            <label class="tx-label mono" for="tx-subject">{{ lang === 'it' ? 'OGGETTO' : 'SUBJECT' }}</label>
            <BaseDropdown
              id="tx-subject"
              v-model="subjectInput"
              :options="subjects"
              :placeholder="lang === 'it' ? 'Seleziona un argomento…' : 'Select a subject…'"
              :aria-label="lang === 'it' ? 'Oggetto della trasmissione' : 'Transmission subject'"
            />
          </div>

          <label class="tx-field" for="tx-msg">
            <span class="tx-label mono">{{ lang === 'it' ? 'MESSAGGIO' : 'MESSAGE' }}</span>
            <textarea
              id="tx-msg"
              v-model="messageInput"
              required
              rows="4"
              maxlength="2000"
              :placeholder="lang === 'it' ? 'Raccontami il tuo progetto o opportunità…' : 'Tell me about your project or opportunity…'"
              class="tx-input tx-textarea"
            />
          </label>

          <div class="tx-consent-row">
            <label class="gdpr-check-label">
              <input v-model="gdprAccepted" type="checkbox" class="gdpr-checkbox" />
              <span>
                {{ lang === 'it' ? 'Ho letto e accetto l’' : 'I have read and accept the ' }}
                <button
                  type="button"
                  class="inline-policy-link"
                  @click="openPolicy ? openPolicy('privacy') : null"
                >
                  {{ t('footer.privacy') }}
                </button>
                {{ lang === 'it' ? ' (invio diretto client-side, nessun dato salvato).' : ' (client-side mailto only, no data stored).' }}
              </span>
            </label>
          </div>

          <p v-if="formError" class="tx-feedback is-error" role="alert">{{ formError }}</p>
          <p v-if="sentNotice" class="tx-feedback is-ok" role="status">{{ sentNotice }}</p>

          <div class="tx-actions">
            <button type="submit" class="tx-submit">
              <span>{{ lang === 'it' ? 'Invia Messaggio →' : 'Send Message →' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-block--closing {
  border-bottom: none;
  padding-bottom: 4rem;
}

.contact-split-bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: stretch;
  width: 100%;
}

@media (min-width: 900px) {
  .contact-split-bento {
    grid-template-columns: 0.85fr 1.15fr;
  }
}

/* Left Card: Info & Editorial */
.contact-info-card {
  padding: clamp(1.75rem, 3vw, 2.5rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  height: 100%;
  box-sizing: border-box;
  border-radius: var(--radius-2xl);
}

.info-top-block {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.contact-title {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  line-height: 1.15;
  margin: 0;
}

.contact-subtitle {
  font-size: 0.98rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  max-width: 44ch;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  background: rgba(11, 17, 32, 0.75);
  border: 1px solid rgba(52, 211, 153, 0.3);
  font-size: 0.72rem;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  width: fit-content;
  margin-top: 0.4rem;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--status-live);
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
}

.info-bottom-block {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* Normal-Scale Lowercase Email Row */
.contact-email-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  border-radius: var(--radius-lg);
  background: rgba(4, 6, 12, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: border-color 0.2s ease;
}

.contact-email-row:hover {
  border-color: rgba(56, 189, 248, 0.3);
}

.email-address {
  font-size: 0.92rem;
  color: var(--text-primary);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.email-address:hover {
  color: var(--accent-lumina-bright);
}

.copy-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--accent-azure-border);
  background: var(--accent-azure-soft);
  color: var(--accent-lumina-bright);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.18s var(--ease-spring), background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.copy-btn::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 9999px;
}

.copy-btn:hover {
  border-color: var(--accent-lumina);
  transform: translateY(-1px);
}

.copy-btn:active {
  transform: scale(0.95);
}

.copy-btn.is-copied {
  background: var(--status-live);
  border-color: var(--status-live);
  color: #04060C;
}

/* Minimalist Social Pills */
.social-pills-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.social-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-pill:hover {
  color: var(--text-primary);
  border-color: rgba(56, 189, 248, 0.4);
  background: rgba(56, 189, 248, 0.06);
  transform: translateY(-1px);
}

.social-icon {
  color: var(--accent-lumina-bright);
}

.social-arrow {
  font-size: 0.85rem;
  opacity: 0.7;
  transition: transform 0.2s var(--ease-spring);
}

.social-pill:hover .social-arrow {
  opacity: 1;
  transform: translate(1px, -1px);
}

/* Right Card: Clean Minimalist Message Form */
.contact-form-card {
  padding: clamp(1.75rem, 3vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  height: 100%;
  box-sizing: border-box;
  border-radius: var(--radius-2xl);
}

.form-header {
  margin-bottom: 0.25rem;
}

.form-kicker {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: var(--accent-lumina-bright);
  font-weight: 600;
}

.tx-grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.15rem;
}

@media (min-width: 640px) {
  .tx-grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.tx-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.tx-label {
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  font-weight: 600;
}

.tx-input {
  width: 100%;
  min-height: 44px;
  padding: 0.7rem 0.95rem;
  border-radius: var(--radius-md);
  background: rgba(4, 6, 12, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.92rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.tx-input::placeholder {
  color: var(--text-tertiary);
}

.tx-input:focus {
  outline: none;
  border-color: var(--accent-lumina);
  box-shadow: 0 0 0 3px var(--accent-lumina-glow);
}

.tx-select {
  cursor: pointer;
}

.tx-textarea {
  min-height: 116px;
  resize: vertical;
  line-height: 1.55;
}

.tx-consent-row {
  display: flex;
  align-items: flex-start;
  margin-top: 0.2rem;
}

.gdpr-check-label {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
  cursor: pointer;
}

.gdpr-checkbox {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: var(--accent-lumina);
  flex-shrink: 0;
  cursor: pointer;
}

.inline-policy-link {
  background: none;
  border: none;
  padding: 0;
  color: var(--accent-lumina-bright);
  font-family: inherit;
  font-size: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.tx-feedback {
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
}
.tx-feedback.is-error {
  color: #FCA5A5;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.65rem 0.95rem;
  border-radius: var(--radius-md);
}
.tx-feedback.is-ok {
  color: var(--status-live);
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.35);
  padding: 0.65rem 0.95rem;
  border-radius: var(--radius-md);
}

.tx-actions {
  display: flex;
  justify-content: flex-start;
  padding-top: 0.25rem;
}

.tx-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 1.6rem;
  border-radius: 9999px;
  border: none;
  background: var(--accent);
  color: #04060C;
  font-family: var(--font-sans);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.32);
  transition: transform 0.2s var(--ease-spring), background-color 0.2s ease;
}

.tx-submit:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.tx-submit:active {
  transform: scale(0.96);
}
</style>
