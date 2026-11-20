import { nextTick, onMounted, onUnmounted, watch } from 'vue'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(containerRef, isOpenRef, onClose) {
  let previousActiveElement = null

  const getFocusableElements = () => {
    if (!containerRef.value) return []
    return Array.from(containerRef.value.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetParent !== null && !el.hasAttribute('aria-hidden')
    )
  }

  const handleKeydown = (e) => {
    if (!isOpenRef.value) return

    if (e.key === 'Escape') {
      e.preventDefault()
      if (typeof onClose === 'function') onClose()
      return
    }

    if (e.key === 'Tab') {
      const focusables = getFocusableElements()
      if (!focusables.length) {
        e.preventDefault()
        return
      }

      const firstEl = focusables[0]
      const lastEl = focusables[focusables.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstEl || !containerRef.value.contains(document.activeElement)) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        if (document.activeElement === lastEl || !containerRef.value.contains(document.activeElement)) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }
  }

  watch(
    () => isOpenRef.value,
    async (isOpen) => {
      if (typeof document === 'undefined') return

      if (isOpen) {
        previousActiveElement = document.activeElement
        await nextTick()
        // Wait a frame for transition/render
        requestAnimationFrame(() => {
          const focusables = getFocusableElements()
          if (focusables.length > 0) {
            focusables[0].focus()
          } else if (containerRef.value) {
            containerRef.value.focus()
          }
        })
      } else {
        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
          previousActiveElement.focus()
          previousActiveElement = null
        }
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus()
      previousActiveElement = null
    }
  })
}
