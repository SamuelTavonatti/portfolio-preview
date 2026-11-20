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
  <section id="contatti" class="section-block section-block--closing">
    <div class="container scroll-reveal">
      <div class="section-head">
        <span class="section-kicker tabular-nums">{{ t('sections.contactKicker') }}</span>
        <h2 class="section-heading">{{ t('sections.contactTitle') }}</h2>
      </div>

      <p class="contact-lead">{{ t('contact.lead') }}</p>

      <div class="contact-pills" role="group" :aria-label="t('sections.contactTitle')">
        <BaseButton :href="`mailto:${profileData.email}`" variant="primary" class="contact-pill">
          <AppIcon name="mail" :size="17" />
          <span>Email</span>
        </BaseButton>

        <BaseButton :href="profileData.links.linkedin" external variant="secondary" class="contact-pill">
          <AppIcon name="linkedin" :size="17" />
          <span>LinkedIn</span>
          <AppIcon name="arrow-up-right" :size="15" />
        </BaseButton>

        <BaseButton :href="profileData.links.github" external variant="secondary" class="contact-pill">
          <AppIcon name="github" :size="17" />
          <span>GitHub</span>
          <AppIcon name="arrow-up-right" :size="15" />
        </BaseButton>
      </div>

      <div class="glass-card email-bar">
        <span class="email-label">{{ t('contact.directEmail') }}</span>
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
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-block--closing {
  border-bottom: none;
  padding-bottom: 2.5rem;
}

.contact-lead {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 1.75rem;
  max-width: 62ch;
}

.contact-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.contact-pill {
  border-radius: 999px;
  padding-inline: 1.5rem;
}

.email-bar {
  max-width: 560px;
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.email-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  font-weight: 600;
}

.email-copy-row {
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s var(--ease-spring);
  text-align: left;
}

.email-copy-row:hover,
.email-copy-row.copied {
  border-color: var(--accent-border);
  background: var(--accent-soft);
}

.email-copy-row:active {
  transform: scale(0.98);
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
</style>
