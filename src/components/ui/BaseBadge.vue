<script setup>
defineProps({
  variant: {
    type: String,
    default: 'neutral', // neutral | accent | live
  },
})
</script>

<template>
  <span class="badge tabular-nums" :class="`badge--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: var(--surface-2);
  color: var(--text-secondary);
}

.badge--accent {
  background: var(--accent-soft);
  border-color: var(--accent-border);
  color: var(--accent);
}

.badge--live {
  background: var(--status-live-soft);
  border-color: rgba(52, 211, 153, 0.28);
  color: var(--status-live);
}
</style>
