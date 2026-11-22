import { useLanguage } from '../context/LanguageContext';
import type { Locale } from '../types/portfolio';

interface LanguageToggleProps {
  compact?: boolean;
}

const OPTIONS: { value: Locale; label: string }[] = [
  { value: 'it', label: 'IT' },
  { value: 'en', label: 'EN' },
];

export function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label={locale === 'it' ? 'Selezione lingua' : 'Language selector'}
      className="inline-flex items-center gap-1"
    >
      {OPTIONS.map((opt, idx) => {
        const isActive = locale === opt.value;
        return (
          <span key={opt.value} className="inline-flex items-center">
            {idx > 0 ? (
              <span aria-hidden="true" className="mx-1 text-[11px] text-[#867F70]/60">
                /
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setLocale(opt.value)}
              aria-pressed={isActive}
              className={`font-mono-num whitespace-nowrap shrink-0 transition-colors duration-200 ${
                compact ? 'min-h-[36px] px-1.5 text-[11px]' : 'min-h-[40px] px-2 text-xs'
              } tracking-[0.12em] ${
                isActive
                  ? 'font-semibold text-[#D0A243]'
                  : 'text-[#867F70] hover:text-[#EBE4D4]'
              }`}
            >
              {opt.label}
            </button>
          </span>
        );
      })}
    </div>
  );
}
