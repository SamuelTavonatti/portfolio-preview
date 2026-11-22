import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UI_COPY } from '../data/content';
import type { Locale } from '../types/portfolio';

const STORAGE_KEY = 'st_lang';

interface LanguageContextValue {
  locale: Locale;
  isTransitioning: boolean;
  transitionId: number;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'it';
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'it') {
      return saved;
    }
  } catch {
    // Fallback cleanly if storage access is restricted
  }
  return 'it';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionId, setTransitionId] = useState(0);

  const swapTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (swapTimerRef.current !== null) {
      window.clearTimeout(swapTimerRef.current);
      swapTimerRef.current = null;
    }
    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      clearTimers();

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore storage write errors in privacy-restricted frames
      }

      if (prefersReduced) {
        setLocaleState(next);
        setTransitionId((n) => n + 1);
        return;
      }

      // Smooth weighted cross-dissolve without unmounting components or resetting scroll
      setIsTransitioning(true);
      setTransitionId((n) => n + 1);

      swapTimerRef.current = window.setTimeout(() => {
        setLocaleState(next);
        swapTimerRef.current = null;

        settleTimerRef.current = window.setTimeout(() => {
          setIsTransitioning(false);
          settleTimerRef.current = null;
        }, 420);
      }, 220);
    },
    [locale, clearTimers]
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'it' ? 'en' : 'it');
  }, [locale, setLocale]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = UI_COPY.meta.title[locale];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', UI_COPY.meta.description[locale]);
    }
  }, [locale]);

  return (
    <LanguageContext.Provider
      value={{ locale, isTransitioning, transitionId, setLocale, toggleLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
