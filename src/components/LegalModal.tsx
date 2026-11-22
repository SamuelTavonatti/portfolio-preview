import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UI_COPY } from '../data/content';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { LegalTab } from '../types/portfolio';
import { LanguageToggle } from './LanguageToggle';

interface LegalModalProps {
  activeTab: LegalTab | null;
  onChangeTab: (tab: LegalTab) => void;
  onClose: () => void;
}

const LEGAL_TABS: LegalTab[] = ['privacy', 'cookies', 'terms'];
const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function LegalModal({ activeTab, onChangeTab, onClose }: LegalModalProps) {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isOpen = activeTab !== null;
  const dialogRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  const sections = activeTab ? UI_COPY.legal.content[activeTab][locale] : [];

  return (
    <AnimatePresence>
      {isOpen && activeTab ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <motion.div
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: EDITORIAL_EASE }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-white/[0.10] bg-[#111114] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-7">
              <div className="min-w-0">
                <h2
                  id="legal-modal-title"
                  className="truncate font-display text-base font-medium text-[#F4F3EF] sm:text-lg"
                >
                  {UI_COPY.legal.modalTitle[locale]}
                </h2>
                <p className="mt-0.5 text-xs text-[#68686C]">
                  {UI_COPY.legal.updated[locale]}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <LanguageToggle compact />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={UI_COPY.legal.close[locale]}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/[0.10] bg-[#09090B] text-[#F4F3EF] transition-colors hover:border-[#C8A878]/50 hover:text-[#C8A878]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Quiet Underlined Tab Bar */}
            <div
              role="tablist"
              aria-label={UI_COPY.legal.modalTitle[locale]}
              className="flex items-center gap-6 overflow-x-auto border-b border-white/[0.08] bg-[#09090B] px-5 sm:px-7"
            >
              {LEGAL_TABS.map((tab) => {
                const selected = tab === activeTab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    id={`legal-tab-${tab}`}
                    aria-selected={selected}
                    aria-controls={`legal-panel-${tab}`}
                    onClick={() => onChangeTab(tab)}
                    className={`relative min-h-[44px] py-3 font-display text-xs font-medium transition-colors duration-200 whitespace-nowrap shrink-0 ${
                      selected
                        ? 'text-[#F4F3EF]'
                        : 'text-[#68686C] hover:text-[#9C9B96]'
                    }`}
                  >
                    <span>{UI_COPY.legal.tabs[tab][locale]}</span>
                    {selected ? (
                      <motion.span
                        layoutId="legal-active-underline"
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { duration: 0.35, ease: EDITORIAL_EASE }
                        }
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-px bg-[#C8A878]"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div
              role="tabpanel"
              id={`legal-panel-${activeTab}`}
              aria-labelledby={`legal-tab-${activeTab}`}
              className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7"
            >
              {sections.map((section) => (
                <div key={section.heading} className="space-y-2">
                  <h3 className="font-display text-base font-medium text-[#F4F3EF]">
                    {section.heading}
                  </h3>
                  <p className="text-sm leading-[1.7] text-[#9C9B96]">{section.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
