import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ROLES = {
  it: [
    'UX/UI Designer',
    'UX Research',
    'AI Creative',
    'Web Developer',
  ],
  en: [
    'UX/UI Designer',
    'UX Research',
    'AI Creative',
    'Web Developer',
  ],
} as const;

export function RotatingRoleText() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [isInView, setIsInView] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  const items = ROLES[locale];

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => setIsInView(Boolean(entries[0]?.isIntersecting)),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setIsTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isInView || !isTabVisible) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isInView, isTabVisible, items.length]);

  const activeText = items[index % items.length];

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium sm:text-sm"
    >
      <span className="text-[#8E9CAD]">
        {locale === 'it' ? 'Trento, Italia' : 'Trento, Italy'}
      </span>
      <span aria-hidden="true" className="text-[#8E9CAD]">
        ·
      </span>

      {/* Fixed-height mask container prevents layout shift while rotating */}
      <span
        className="relative inline-flex h-6 min-w-[210px] items-center overflow-hidden sm:min-w-[240px]"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={`${locale}-${activeText}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.85, ease: EDITORIAL_EASE }}
            className="font-display font-medium text-[var(--accent-warm)] whitespace-nowrap"
          >
            {activeText}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
