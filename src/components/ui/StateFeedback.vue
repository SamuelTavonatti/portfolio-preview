<script setup>
import AppIcon from './AppIcon.vue'
import BaseButton from './BaseButton.vue'

defineProps({
  state: {
    type: String,
    required: true, // loading | empty | error
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '',
  },
  actionTo: {
    type: [String, Object],
    default: null,
  },
})

defineEmits(['action'])
</script>

<template>
  <div v-if="state === 'loading'" class="skeleton-grid" aria-busy="true" aria-live="polite">
    <div v-for="n in 2" :key="n" class="skeleton-card">
      <div class="skeleton-media" />
      <div class="skeleton-body">
        <div class="skeleton-line short" />
        <div class="skeleton-line title" />
        <div class="skeleton-line" />
        <div class="skeleton-line medium" />
      </div>
    </div>
  </div>

  <div v-else class="feedback-box" role="status" aria-live="polite">
    <div class="feedback-icon" :class="{ 'is-error': state === 'error' }">
      <AppIcon :name="state === 'error' ? 'alert' : 'folder'" :size="22" />
    </div>
    <h3 class="feedback-title">{{ title }}</h3>
    <p v-if="description" class="feedback-desc">{{ description }}</p>
    <div v-if="actionLabel" class="feedback-action">
      <BaseButton v-if="actionTo" :to="actionTo" variant="secondary">
        {{ actionLabel }}
      </BaseButton>
      <BaseButton v-else variant="secondary" @click="$emit('action')">
        {{ actionLabel }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.skeleton-card {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

.skeleton-media {
  aspect-ratio: 16 / 9;
  background: var(--surface-2);
  animation: pulse 1.6s ease-in-out infinite;
}

.skeleton-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: var(--surface-2);
  animation: pulse 1.6s ease-in-out infinite;
}

.skeleton-line.short { width: 32%; }
.skeleton-line.title { width: 68%; height: 20px; }
.skeleton-line.medium { width: 54%; }

@keyframes pulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.9; }
}

.feedback-box {
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-2xl);
  padding: 3rem 1.5rem;
  text-align: center;
  max-width: 520px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
}

.feedback-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-xl);
  background: var(--accent-soft);
  color: var(--accent);
  display: grid;
  place-items: center;
}

.feedback-icon.is-error {
  background: rgba(248, 113, 113, 0.12);
  color: #F87171;
}

.feedback-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
}

.feedback-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

.feedback-action {
  margin-top: 0.5rem;
}
</style>
