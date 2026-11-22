import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UI_COPY } from '../data/content';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { LanguageToggle } from './LanguageToggle';

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type SectionId = 'panoramica' | 'progetti' | 'competenze' | 'percorso' | 'contatti';

const OBSERVED_IDS: SectionId[] = [
  'panoramica',
  'progetti',
  'competenze',
  'percorso',
  'contatti',
];

const NAV_IDS: SectionId[] = ['progetti', 'competenze', 'percorso', 'contatti'];

export function TopNav() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('panoramica');
  const [scrolled, setScrolled] = useState(false);

  const clickLockUntilRef = useRef<number>(0);
  const visibleMapRef = useRef<Map<SectionId, number>>(new Map());

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const drawerRef = useFocusTrap<HTMLDivElement>(mobileOpen, closeMobile);

  useEffect(() => {
    const elements = OBSERVED_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const resolveActiveSection = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 12);

      if (Date.now() < clickLockUntilRef.current) return;

      // Bottom-of-page guarantee so the final section ("Contatti") always activates
      const docHeight = document.documentElement.scrollHeight;
      if (window.innerHeight + scrollY >= docHeight - 64) {
        setActiveSection('contatti');
        return;
      }

      // Viewport trigger line roughly 32% from the top (or 220px max)
      const triggerY = scrollY + Math.min(window.innerHeight * 0.32, 220);

      let current: SectionId = 'panoramica';
      for (const el of elements) {
        const top = el.getBoundingClientRect().top + scrollY;
        if (top <= triggerY) {
          current = el.id as SectionId;
        }
      }

      // Cross-check with IntersectionObserver ratios when near section boundaries
      if (current === 'panoramica' && scrollY > 120) {
        let bestId: SectionId | null = null;
        let bestRatio = 0;
        for (const id of NAV_IDS) {
          const ratio = visibleMapRef.current.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId && bestRatio >= 0.35) {
          current = bestId;
        }
      }

      setActiveSection(current);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          visibleMapRef.current.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        resolveActiveSection();
      },
      {
        rootMargin: '-18% 0px -42% 0px',
        threshold: [0, 0.15, 0.35, 0.55, 0.8],
      }
    );

    elements.forEach((el) => observer.observe(el));

    let rafId = 0;
    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        resolveActiveSection();
      });
    };

    resolveActiveSection();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSelectNav = (id: SectionId) => {
    clickLockUntilRef.current = Date.now() + 700;
    setActiveSection(id);
  };

  const navItems: { id: SectionId; href: string; label: string }[] = [
    {
      id: 'progetti',
      href: '#progetti',
      label: locale === 'it' ? 'Progetti' : 'Projects',
    },
    {
      id: 'competenze',
      href: '#competenze',
      label: locale === 'it' ? 'Competenze' : 'Skills',
    },
    {
      id: 'percorso',
      href: '#percorso',
      label: locale === 'it' ? 'Percorso' : 'Experience',
    },
    {
      id: 'contatti',
      href: '#contatti',
      label: locale === 'it' ? 'Contatti' : 'Contact',
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-16 border-b transition-colors duration-300 backdrop-blur-md ${
          scrolled
            ? 'border-white/[0.10] bg-[#07080B]/92 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
            : 'border-white/[0.06] bg-[#07080B]/80'
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1160px] items-center justify-between gap-4 px-4 sm:px-8">
          {/* Brand Wordmark */}
          <a
            href="#panoramica"
            onClick={() => handleSelectNav('panoramica')}
            className="inline-flex min-w-0 items-center gap-2.5 font-display text-[15px] font-semibold tracking-[-0.02em] text-[#F5F5F7] transition-colors duration-200 hover:text-[#F59E0B] whitespace-nowrap shrink-0"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#F59E0B]/40 bg-[#111318] font-mono-num text-[11px] font-semibold text-[#F59E0B]"
            >
              ST
            </span>
            <span className="truncate">Samuel Tavonatti</span>
          </a>

          {/* Desktop Navigation with Smooth Gliding Semi-Warm Amber Indicator */}
          <nav
            aria-label={locale === 'it' ? 'Navigazione principale' : 'Primary navigation'}
            className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#111318]/85 p-1"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => handleSelectNav(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative z-10 inline-flex min-h-[34px] items-center rounded-full px-4 font-display text-[13px] font-medium transition-colors duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#F5F5F7]'
                      : 'text-[#94A3B8] hover:text-[#F5F5F7]'
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="topnav-active-indicator"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.42, ease: EDITORIAL_EASE }
                      }
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full border border-[#F59E0B]/55 bg-[#F59E0B]/14 shadow-[0_0_16px_rgba(245,158,11,0.16)]"
                    />
                  ) : null}
                  <span>{item.label}</span>
                  {isActive ? (
                    <motion.span
                      layoutId="topnav-active-underline"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.42, ease: EDITORIAL_EASE }
                      }
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-0.5 h-[2px] rounded-full bg-[#F59E0B]"
                    />
                  ) : null}
                </a>
              );
            })}
          </nav>

          {/* Right Controls: Language Switch + Sleek Mobile Menu Pill Trigger (<768px) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <LanguageToggle compact />

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={UI_COPY.nav.openMenu[locale]}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#111318] px-3.5 font-display text-xs font-medium text-[#F5F5F7] transition-colors duration-200 hover:border-[#F59E0B]/55 hover:text-[#F59E0B] md:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
              <span>{locale === 'it' ? 'Menu' : 'Menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Navigation Drawer (<768px) */}
      <AnimatePresence>
        {mobileOpen ? (
          <div
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={locale === 'it' ? 'Menu di navigazione' : 'Navigation menu'}
            id="mobile-nav-drawer"
          >
            <motion.div
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeMobile}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            />
            <motion.div
              ref={drawerRef}
              tabIndex={-1}
              initial={prefersReducedMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={prefersReducedMotion ? undefined : { x: '100%' }}
              transition={{ duration: 0.34, ease: EDITORIAL_EASE }}
              className="fixed inset-y-0 right-0 flex w-full max-w-[300px] flex-col justify-between border-l border-white/[0.10] bg-[#111318] p-6 shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#F59E0B]/40 bg-[#07080B] font-mono-num text-[11px] font-semibold text-[#F59E0B]"
                    >
                      ST
                    </span>
                    <span className="font-display text-sm font-semibold text-[#F5F5F7]">
                      Samuel Tavonatti
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={closeMobile}
                    aria-label={UI_COPY.nav.closeMenu[locale]}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-[#07080B] text-[#F5F5F7] transition-colors hover:border-[#F59E0B]/55 hover:text-[#F59E0B]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <nav className="mt-6 flex flex-col gap-1.5">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        onClick={() => {
                          handleSelectNav(item.id);
                          closeMobile();
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex min-h-[46px] items-center justify-between rounded-xl px-4 font-display text-sm font-medium transition-colors ${
                          isActive
                            ? 'border border-[#F59E0B]/45 bg-[#F59E0B]/12 text-[#F5F5F7]'
                            : 'text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F5F5F7]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive ? (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]"
                          />
                        ) : null}
                      </a>
                    );
                  })}
                </nav>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.08] pt-5">
                <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#64748B]">
                  {locale === 'it' ? 'Lingua' : 'Language'}
                </span>
                <LanguageToggle compact />
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
