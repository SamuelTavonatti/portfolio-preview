import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal(selector = '.scroll-reveal') {
  let observer = null

  onMounted(() => {
    const targets = document.querySelectorAll(selector)
    if (!targets.length) return

    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    targets.forEach((el) => observer.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}
