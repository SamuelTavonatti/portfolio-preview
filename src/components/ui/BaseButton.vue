<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // primary | secondary | ghost
  },
  to: {
    type: [String, Object],
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  external: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <router-link v-if="to" :to="to" class="btn" :class="`btn--${variant}`">
    <slot />
  </router-link>
  <a
    v-else-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="btn"
    :class="`btn--${variant}`"
  >
    <slot />
  </a>
  <button v-else type="button" class="btn" :class="`btn--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.925rem;
  font-weight: 600;
  padding: 0.75rem 1.35rem;
  border-radius: var(--radius-xl);
  border: 1px solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition: transform var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
  white-space: nowrap;
}

.btn:active {
  transform: scale(0.98);
}

.btn--primary {
  background-color: var(--accent);
  color: #0B0C0E;
}

.btn--primary:hover {
  background-color: var(--accent-hover);
  transform: translateY(-1px);
}

.btn--secondary {
  background-color: var(--surface-1);
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.btn--secondary:hover {
  background-color: var(--surface-2);
  border-color: var(--accent-border);
  transform: translateY(-1px);
}

.btn--ghost {
  background-color: transparent;
  color: var(--text-secondary);
  padding: 0.5rem 0.75rem;
}

.btn--ghost:hover {
  color: var(--text-primary);
  background-color: var(--surface-1);
}
</style>
