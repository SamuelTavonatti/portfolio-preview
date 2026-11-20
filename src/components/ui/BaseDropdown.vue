<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Seleziona…',
  },
  id: {
    type: String,
    default: () => `dropdown-${Math.random().toString(36).slice(2, 9)}`,
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const highlightedIndex = ref(-1)
const rootRef = ref(null)
const triggerRef = ref(null)
const listboxRef = ref(null)

const normalizedOptions = computed(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value ?? opt.label, label: opt.label ?? opt.value }
    }
    return { value: opt, label: opt }
  })
})

const selectedOption = computed(() => {
  return normalizedOptions.value.find((opt) => opt.value === props.modelValue) || null
})

const openDropdown = () => {
  if (props.disabled || isOpen.value) return
  isOpen.value = true
  const curIdx = normalizedOptions.value.findIndex((opt) => opt.value === props.modelValue)
  highlightedIndex.value = curIdx >= 0 ? curIdx : 0
  nextTick(() => {
    scrollHighlightedIntoView()
    if (listboxRef.value) {
      listboxRef.value.focus()
    }
  })
}

const closeDropdown = (returnFocus = true) => {
  if (!isOpen.value) return
  isOpen.value = false
  highlightedIndex.value = -1
  if (returnFocus && triggerRef.value) {
    triggerRef.value.focus()
  }
}

const toggleOpen = () => {
  if (props.disabled) return
  if (isOpen.value) {
    closeDropdown(true)
  } else {
    openDropdown()
  }
}

const selectOption = (opt) => {
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  closeDropdown(true)
}

const scrollHighlightedIntoView = () => {
  if (!listboxRef.value || highlightedIndex.value < 0) return
  const items = listboxRef.value.querySelectorAll('[role="option"]')
  const current = items[highlightedIndex.value]
  if (current) {
    current.scrollIntoView({ block: 'nearest' })
  }
}

const highlightNext = () => {
  if (highlightedIndex.value < normalizedOptions.value.length - 1) {
    highlightedIndex.value++
  } else {
    highlightedIndex.value = 0
  }
  scrollHighlightedIntoView()
}

const highlightPrev = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  } else {
    highlightedIndex.value = normalizedOptions.value.length - 1
  }
  scrollHighlightedIntoView()
}

const onTriggerKeydown = (e) => {
  if (props.disabled) return

  switch (e.key) {
    case 'Enter':
    case ' ':
    case 'ArrowDown':
      e.preventDefault()
      if (!isOpen.value) {
        openDropdown()
      } else if (e.key === 'ArrowDown') {
        highlightNext()
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (!isOpen.value) {
        openDropdown()
      } else {
        highlightPrev()
      }
      break
    case 'Escape':
      if (isOpen.value) {
        e.preventDefault()
        closeDropdown(true)
      }
      break
    case 'Tab':
      if (isOpen.value) {
        closeDropdown(false)
      }
      break
  }
}

const onListboxKeydown = (e) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightNext()
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightPrev()
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (highlightedIndex.value >= 0 && highlightedIndex.value < normalizedOptions.value.length) {
        selectOption(normalizedOptions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      e.preventDefault()
      closeDropdown(true)
      break
    case 'Tab':
      closeDropdown(false)
      break
  }
}

const onClickOutside = (e) => {
  if (rootRef.value && !rootRef.value.contains(e.target)) {
    closeDropdown(false)
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onClickOutside)
})
</script>

<template>
  <div ref="rootRef" class="custom-dropdown-root">
    <button
      :id="id"
      ref="triggerRef"
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="'listbox'"
      :aria-controls="`${id}-listbox`"
      :aria-label="ariaLabel || placeholder"
      :disabled="disabled"
      class="dropdown-trigger"
      :class="{ 'is-open': isOpen, 'has-value': !!selectedOption }"
      @click="toggleOpen"
      @keydown="onTriggerKeydown"
    >
      <span class="trigger-label">
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>

      <svg
        class="dropdown-chevron"
        :class="{ 'is-flipped': isOpen }"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Transition name="dropdown-pop">
      <div
        v-if="isOpen"
        :id="`${id}-listbox`"
        ref="listboxRef"
        role="listbox"
        tabindex="-1"
        :aria-labelledby="id"
        class="dropdown-popover"
        @keydown="onListboxKeydown"
      >
        <div class="options-wrapper">
          <div
            v-for="(opt, idx) in normalizedOptions"
            :id="`${id}-opt-${idx}`"
            :key="opt.value"
            role="option"
            :aria-selected="modelValue === opt.value"
            class="option-row"
            :class="{
              'is-selected': modelValue === opt.value,
              'is-highlighted': highlightedIndex === idx,
            }"
            @click="selectOption(opt)"
            @pointerenter="highlightedIndex = idx"
          >
            <span class="opt-text">{{ opt.label }}</span>
            <span v-if="modelValue === opt.value" class="opt-check" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.custom-dropdown-root {
  position: relative;
  width: 100%;
}

.dropdown-trigger {
  width: 100%;
  height: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 1.1rem;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.4;
  color: var(--text-tertiary);
  background: rgba(11, 17, 32, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--radius-md);
  cursor: pointer;
  box-sizing: border-box;
  text-align: left;
  user-select: none;
  transition:
    border-color var(--transition-fast),
    background var(--transition-fast),
    box-shadow var(--transition-fast);
}

.dropdown-trigger.has-value {
  color: var(--text-primary);
}

.dropdown-trigger:hover:not(:disabled) {
  border-color: rgba(56, 189, 248, 0.35);
  background: rgba(15, 23, 42, 0.88);
}

.dropdown-trigger:focus-visible,
.dropdown-trigger.is-open {
  outline: none;
  border-color: rgba(56, 189, 248, 0.6);
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
  background: rgba(15, 23, 42, 0.92);
}

.dropdown-trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.trigger-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-chevron {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), color var(--transition-fast);
}

.dropdown-trigger:hover .dropdown-chevron,
.dropdown-trigger.is-open .dropdown-chevron {
  color: var(--accent-lumina);
}

.dropdown-chevron.is-flipped {
  transform: rotate(180deg);
}

.dropdown-popover {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 60;
  background: rgba(11, 17, 32, 0.94);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(56, 189, 248, 0.24);
  border-radius: 16px;
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.65),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
  padding: 0.375rem;
  max-height: 280px;
  overflow-y: auto;
  outline: none;
  scrollbar-width: thin;
  scrollbar-color: rgba(56, 189, 248, 0.3) transparent;
}

.options-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-row {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--text-primary);
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.option-row.is-highlighted {
  background: rgba(56, 189, 248, 0.12);
  color: var(--accent-lumina-bright);
}

.option-row.is-selected {
  background: rgba(56, 189, 248, 0.16);
  color: var(--accent-lumina-bright);
  font-weight: 500;
}

.opt-text {
  flex: 1;
}

.opt-check {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-lumina);
}

/* Apple Spring Scale/Fade Entrance */
.dropdown-pop-enter-active {
  transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-pop-leave-active {
  transition: opacity 120ms ease-out, transform 120ms ease-out;
}

.dropdown-pop-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}

.dropdown-pop-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(-2px);
}
</style>
