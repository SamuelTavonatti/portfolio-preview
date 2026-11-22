import { useLanguage } from '../context/LanguageContext';
import { UI_COPY } from '../data/content';
import type { LegalTab } from '../types/portfolio';
import { ScrollReveal } from './ScrollReveal';

interface FooterProps {
  onOpenLegal: (tab: LegalTab) => void;
}

export function Footer({ onOpenLegal }: FooterProps) {
  const { locale } = useLanguage();

  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#0B0A09] py-12">
      <ScrollReveal distance={12} duration={0.85}>
        <div className="mx-auto flex max-w-[1160px] flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center">
          <div className="space-y-1">
            <p className="font-display text-sm font-medium text-[#EBE4D4]">
              Samuel Tavonatti
            </p>
            <p className="text-xs text-[#867F70]">
              © 2026 {UI_COPY.footer.rights[locale]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="min-h-[40px] text-xs font-medium text-[#BDB6AD] transition-colors duration-200 hover:text-[#D0A243]"
            >
              {UI_COPY.footer.privacy[locale]}
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('cookies')}
              className="min-h-[40px] text-xs font-medium text-[#BDB6AD] transition-colors duration-200 hover:text-[#D0A243]"
            >
              {UI_COPY.footer.cookies[locale]}
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="min-h-[40px] text-xs font-medium text-[#BDB6AD] transition-colors duration-200 hover:text-[#D0A243]"
            >
              {UI_COPY.footer.terms[locale]}
            </button>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
