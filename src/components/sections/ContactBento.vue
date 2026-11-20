<script setup>
import { computed, inject, ref } from 'vue'
import { profileData } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import AppIcon from '../ui/AppIcon.vue'

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

const subjects = computed(() =>
  lang.value === 'it'
    ? [
        'Collaborazione UI/UX & Design System',
        'Sviluppo Front-End / Web App',
        'Progetto Motion / Showreel',
        'Stage / Opportunità Lavorativa',
        'Altro',
      ]
    : [
        'UI/UX & Design System Collaboration',
        'Front-End / Web App Engineering',
        'Motion / Showreel Project',
        'Internship / Job Opportunity',
        'Other',
      ]
)

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

const handleSubmit = async () => {
  formError.value = ''
  sentNotice.value = ''

  if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
    formError.value =
      lang.value === 'it'
        ? 'Compila nome, email e messaggio prima di procedere.'
        : 'Please fill in your name, email, and message.'
    return
  }

  if (!gdprAccepted.value) {
    formError.value =
      lang.value === 'it'
        ? 'Conferma di aver letto l’Informativa Privacy per continuare.'
        : 'Please accept the Privacy Policy before sending.'
    return
  }

  const chosenSubject = subjectInput.value || subjects.value[0]
  const formattedBody = `${lang.value === 'it' ? 'Da' : 'From'}: ${nameInput.value.trim()} (${emailInput.value.trim()})\n\n${messageInput.value.trim()}`
  const mailtoUrl = `mailto:${profileData.email}?subject=${encodeURIComponent(chosenSubject)}&body=${encodeURIComponent(formattedBody)}`

  try {
    await navigator.clipboard.writeText(`${chosenSubject}\n\n${formattedBody}`)
  } catch {
    // clipboard optional fallback
  }

  window.location.href = mailtoUrl
  sentNotice.value =
    lang.value === 'it'
      ? 'Client email aperto e messaggio copiato negli appunti ✓'
      : 'Email client opened and message copied to clipboard ✓'
}

const channels = [
  {
    name: 'LINKEDIN',
    handle: '@samuel-tavonatti',
    href: profileData.links.linkedin,
    icon: 'linkedin',
  },
  {
    name: 'GITHUB',
    handle: '@SamuelTavonatti',
    href: profileData.links.github,
    icon: 'github',
  },
  {
    name: 'INSTAGRAM',
    handle: '@samuel.tavonatti',
    href: profileData.links.instagram,
    icon: 'instagram',
  },
]
</script>

<template>
  <section id="contatti" class="section-block section-block--closing">
    <div class="container scroll-reveal">
      <!-- 1. Top Status Header Row -->
      <div class="contact-top-row">
        <div class="section-head">
          <span class="section-kicker tabular-nums">{{ t('sections.contactKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.contactTitle') }}</h2>
        </div>

        <div class="status-pill mono">
          <span class="status-dot" aria-hidden="true"></span>
          <span>
            {{
              lang === 'it'
                ? 'STATUS: DISPONIBILE PER PROGETTI & STAGE'
                : 'STATUS: AVAILABLE FOR SELECT PROJECTS & INTERNSHIPS'
            }}
          </span>
        </div>
      </div>

      <!-- 2. Hero 1-Click Copy Email Banner -->
      <div class="glass-card email-banner">
        <span class="email-banner-addr">{{ profileData.email.toUpperCase() }}</span>
        <button
          type="button"
          class="copy-cta mono"
          :class="{ 'is-copied': copied }"
          :aria-label="t('contact.copyAria')"
          @click="copyEmail"
        >
          <AppIcon :name="copied ? 'check' : 'copy'" :size="15" />
          <span>{{ copied ? (lang === 'it' ? 'Copiato ✓' : 'Copied ✓') : (lang === 'it' ? '1-CLICK COPY' : '1-CLICK COPY') }}</span>
        </button>
      </div>

      <!-- 3. Direct Transmission Form (100% Free Client-Side mailto: + Clipboard) -->
      <form class="glass-card tx-form" novalidate @submit.prevent="handleSubmit">
        <div class="tx-grid-2">
          <label class="tx-field">
            <span class="tx-label mono">{{ lang === 'it' ? 'NOME / AZIENDA' : 'NAME / COMPANY' }}</span>
            <input
              v-model="nameInput"
              type="text"
              required
              :placeholder="lang === 'it' ? 'Mario Rossi — Studio' : 'Alex Morgan — Studio'"
              class="tx-input"
            />
          </label>

          <label class="tx-field">
            <span class="tx-label mono">EMAIL</span>
            <input
              v-model="emailInput"
              type="email"
              required
              placeholder="name@company.com"
              class="tx-input"
            />
          </label>
        </div>

        <label class="tx-field">
          <span class="tx-label mono">{{ lang === 'it' ? 'OGGETTO' : 'SUBJECT' }}</span>
          <select v-model="subjectInput" class="tx-input tx-select">
            <option value="" disabled>
              {{ lang === 'it' ? 'Seleziona un argomento…' : 'Select a subject…' }}
            </option>
            <option v-for="sub in subjects" :key="sub" :value="sub">{{ sub }}</option>
          </select>
        </label>

        <label class="tx-field">
          <span class="tx-label mono">{{ lang === 'it' ? 'MESSAGGIO' : 'MESSAGE' }}</span>
          <textarea
            v-model="messageInput"
            required
            rows="4"
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

      <!-- 4. Full-Width Social Channels Directory -->
      <div class="channels-list" role="list" :aria-label="t('contact.profiles')">
        <a
          v-for="ch in channels"
          :key="ch.name"
          :href="ch.href"
          target="_blank"
          rel="noopener noreferrer"
          class="glass-card channel-row"
          role="listitem"
        >
          <div class="channel-left">
            <AppIcon :name="ch.icon" :size="18" class="channel-icon" />
            <span class="channel-name mono">{{ ch.name }}</span>
            <span class="channel-handle">{{ ch.handle }}</span>
          </div>
          <AppIcon name="arrow-up-right" :size="18" class="channel-arrow" />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-block--closing {
  border-bottom: none;
  padding-bottom: 3rem;
}

.contact-top-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-bottom: clamp(1.75rem, 3.5vw, 2.5rem);
}

.contact-top-row .section-head {
  margin-bottom: 0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.48rem 0.95rem;
  border-radius: 9999px;
  background: rgba(11, 17, 32, 0.78);
  border: 1px solid rgba(52, 211, 153, 0.34);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--text-primary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--status-live);
  box-shadow: 0 0 10px rgba(52, 211, 153, 0.65);
}

/* Hero 1-Click Copy Email Banner */
.email-banner {
  width: 100%;
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.email-banner-addr {
  font-size: clamp(1.1rem, 2.8vw, 2.15rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  word-break: break-all;
}

.copy-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 48px;
  padding: 0 1.25rem;
  border-radius: 9999px;
  border: 1px solid var(--accent-azure-border);
  background: var(--accent-azure-soft);
  color: var(--accent-lumina-bright);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: transform 0.18s var(--ease-spring), background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.copy-cta:hover {
  border-color: var(--accent-lumina);
  transform: translateY(-1px);
}

.copy-cta:active {
  transform: scale(0.95);
}

.copy-cta.is-copied {
  background: var(--status-live);
  border-color: var(--status-live);
  color: #04060C;
}

/* Direct Transmission Form */
.tx-form {
  width: 100%;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tx-grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 720px) {
  .tx-grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.tx-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.tx-label {
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--accent-lumina-bright);
  font-weight: 600;
}

.tx-input {
  width: 100%;
  min-height: 48px;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background: rgba(4, 6, 12, 0.72);
  border: 1px solid rgba(148, 197, 255, 0.14);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.94rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.tx-input::placeholder {
  color: var(--text-tertiary);
}

.tx-input:focus {
  outline: none;
  border-color: var(--accent-lumina);
  box-shadow: 0 0 0 3px var(--accent-lumina-glow);
}

.tx-textarea {
  min-height: 140px;
  resize: vertical;
  line-height: 1.6;
}

.tx-consent-row {
  display: flex;
  align-items: flex-start;
}

.gdpr-check-label {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  cursor: pointer;
}

.gdpr-checkbox {
  width: 18px;
  height: 18px;
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
  font-size: 0.86rem;
  font-weight: 500;
}
.tx-feedback.is-error { color: #FCA5A5; }
.tx-feedback.is-ok { color: var(--status-live); }

.tx-actions {
  display: flex;
  justify-content: flex-start;
}

.tx-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 1.65rem;
  border-radius: 9999px;
  border: none;
  background: var(--accent);
  color: #04060C;
  font-family: var(--font-sans);
  font-size: 0.94rem;
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

/* Full-Width Social Channels Directory */
.channels-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.channel-row {
  width: 100%;
  min-height: 60px;
  padding: 0.95rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-decoration: none;
  color: var(--text-primary);
  border-radius: var(--radius-xl);
}

.channel-row:hover {
  transform: translateX(4px);
  border-color: var(--accent-azure-border);
  background: var(--surface-2);
}

.channel-left {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  min-width: 0;
}

.channel-icon {
  color: var(--accent-lumina-bright);
  flex-shrink: 0;
}

.channel-name {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-primary);
}

.channel-handle {
  font-size: 0.88rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-arrow {
  color: var(--accent-lumina-bright);
  flex-shrink: 0;
  transition: transform 0.2s var(--ease-spring);
}

.channel-row:hover .channel-arrow {
  transform: translate(2px, -2px);
}
</style>
