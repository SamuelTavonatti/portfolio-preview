<script setup>
import { ref } from 'vue'
import { profileData } from '../../data/profile'
import { useI18n } from '../../i18n/useI18n'
import AppIcon from '../ui/AppIcon.vue'
import BaseButton from '../ui/BaseButton.vue'

const { t } = useI18n()
const copied = ref(false)

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
</script>

<template>
  <section id="contatti" class="section-block">
    <div class="container">
      <div class="grid-layout">
        <div class="col-left">
          <span class="section-kicker tabular-nums">{{ t('sections.contactKicker') }}</span>
          <h2 class="section-heading">{{ t('sections.contactTitle') }}</h2>
        </div>

        <div class="col-right">
          <p class="contact-lead">{{ t('contact.lead') }}</p>

          <div class="bento-grid">
            <div class="bento-card">
              <span class="card-label">{{ t('contact.directEmail') }}</span>
              <button
                type="button"
                class="email-copy-row"
                :class="{ copied }"
                :aria-label="t('contact.copyAria')"
                @click="copyEmail"
              >
                <span class="email-text">{{ profileData.email }}</span>
                <span class="copy-pill">
                  <AppIcon :name="copied ? 'check' : 'copy'" :size="15" />
                  <span>{{ copied ? t('contact.copied') : t('contact.copy') }}</span>
                </span>
              </button>

              <div class="mail-actions">
                <BaseButton :href="`mailto:${profileData.email}`" variant="primary">
                  <AppIcon name="mail" :size="16" />
                  <span>{{ t('contact.sendEmail') }}</span>
                </BaseButton>
              </div>
            </div>

            <div class="bento-card">
              <span class="card-label">{{ t('contact.profiles') }}</span>
              <div class="social-list">
                <a :href="profileData.links.github" target="_blank" rel="noopener noreferrer" class="social-row">
                  <span class="social-left">
                    <AppIcon name="github" :size="17" />
                    <span>GitHub</span>
                  </span>
                  <AppIcon name="arrow-up-right" :size="16" class="ext-arrow" />
                </a>
                <a :href="profileData.links.linkedin" target="_blank" rel="noopener noreferrer" class="social-row">
                  <span class="social-left">
                    <AppIcon name="linkedin" :size="17" />
                    <span>LinkedIn</span>
                  </span>
                  <AppIcon name="arrow-up-right" :size="16" class="ext-arrow" />
                </a>
                <a :href="profileData.links.instagram" target="_blank" rel="noopener noreferrer" class="social-row">
                  <span class="social-left">
                    <AppIcon name="instagram" :size="17" />
                    <span>Instagram</span>
                  </span>
                  <AppIcon name="arrow-up-right" :size="16" class="ext-arrow" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-block {
  padding: 4.5rem 0 2rem;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 860px) {
  .grid-layout {
    grid-template-columns: 260px 1fr;
    gap: 3.5rem;
  }
}

.section-kicker {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.section-heading {
  font-size: clamp(1.45rem, 2.8vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.contact-lead {
  font-size: clamp(1.08rem, 2vw, 1.3rem);
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 1.75rem;
  max-width: 58ch;
}

.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 720px) {
  .bento-grid {
    grid-template-columns: 1.25fr 1fr;
  }
}

.bento-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.card-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent);
  font-weight: 600;
}

.email-copy-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 0.8rem 0.95rem;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.83rem;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
  text-align: left;
}

.email-copy-row:hover,
.email-copy-row.copied {
  border-color: var(--accent-border);
  background: var(--accent-soft);
}

.email-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--accent);
  flex-shrink: 0;
}

.mail-actions {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
}

.social-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.social-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.78rem 0.95rem;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: var(--text-primary);
  font-size: 0.92rem;
  font-weight: 500;
  transition: border-color var(--transition-fast), transform var(--transition-fast);
}

.social-row:hover {
  border-color: var(--accent-border);
  transform: translateY(-1px);
}

.social-left {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--text-primary);
}

.social-left :deep(.app-icon) {
  color: var(--accent);
}

.ext-arrow {
  color: var(--text-tertiary);
}
</style>
