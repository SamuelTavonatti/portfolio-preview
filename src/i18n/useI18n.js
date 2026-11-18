import { ref } from 'vue'
import { messages } from './messages'

const STORAGE_KEY = 'st_lang'

const getInitialLang = () => {
  if (typeof window === 'undefined') return 'it'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'en' ? 'en' : 'it'
}

const lang = ref(getInitialLang())

if (typeof document !== 'undefined') {
  document.documentElement.lang = lang.value
}

export function useI18n() {
  const setLang = (next) => {
    const normalized = next === 'en' ? 'en' : 'it'
    lang.value = normalized
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, normalized)
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = normalized
    }
  }

  const t = (path) => {
    const keys = path.split('.')
    let current = messages[lang.value]
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return path
      }
    }
    return current
  }

  return {
    lang,
    setLang,
    t,
  }
}
