import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CASE_STUDIES, EXPERIENCE_ITEMS } from '../data/content';
import type { CaseStudy } from '../types/portfolio';
import { ScrollReveal } from './ScrollReveal';

interface ExperienceSectionProps {
  onSelectCaseStudy?: (study: CaseStudy) => void;
}

export function ExperienceSection({ onSelectCaseStudy }: ExperienceSectionProps) {
  const { locale } = useLanguage();
  const trentinoCaseStudy = CASE_STUDIES.find((c) => c.id === 'trentino-marketing');

  return (
    <section
      id="percorso"
      aria-labelledby="experience-heading"
      className="relative z-10 scroll-mt-20 border-t border-white/[0.08] bg-[#0B0A09] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
        <ScrollReveal duration={0.85}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono-num text-[11px] font-medium uppercase tracking-[0.2em] text-[#D0A243]">
                03 — {locale === 'it' ? 'Percorso' : 'Experience'}
              </p>
              <h2
                id="experience-heading"
                className="font-display text-3xl font-medium tracking-[-0.03em] text-[#EBE4D4] sm:text-5xl"
              >
                {locale === 'it'
                  ? 'Esperienza & Formazione'
                  : 'Experience & Education'}
              </h2>
              <p className="text-sm leading-relaxed text-[#BDB6AD] sm:text-base">
                {locale === 'it'
                  ? 'Tirocinio curriculare da 419h in Trentino Marketing, formazione HCI a Trento ed esperienza operativa sul campo.'
                  : '419-hour curricular internship at Trentino Marketing, HCI studies in Trento, and hands-on operational background.'}
              </p>
            </div>

            <p className="font-mono-num text-[11px] uppercase tracking-[0.18em] text-[#867F70]">
              2024 — 2026 · TRENTO
            </p>
          </div>
        </ScrollReveal>

        {/* Quiet Editorial Index Separated by 1px Horizontal Hairlines */}
        <ol className="mt-14 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {EXPERIENCE_ITEMS.map((item, idx) => {
            const isTrentino = item.id === 'trentino-marketing';
            return (
              <li key={item.id} className="py-8 sm:py-10">
                <ScrollReveal delay={idx * 0.06} duration={0.85}>
                  <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
                    {/* Period & Organization */}
                    <div className="space-y-1.5 lg:col-span-4">
                      <p className="font-mono-num text-xs font-medium tracking-[0.06em] text-[#D0A243]">
                        {item.period[locale]}
                      </p>
                      <p className="font-display text-lg font-medium text-[#EBE4D4]">
                        {item.organization}
                      </p>
                      <p className="font-mono-num text-[11px] uppercase tracking-[0.12em] text-[#867F70]">
                        {item.type[locale]} · {item.location}
                      </p>
                    </div>

                    {/* Role, Summary & Quiet Inline Focus Areas */}
                    <div className="space-y-3 lg:col-span-6">
                      <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-[#EBE4D4]">
                        {item.role[locale]}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#BDB6AD]">
                        {item.summary[locale]}
                      </p>
                      <p className="pt-1 font-mono-num text-[11px] leading-relaxed text-[#867F70]">
                        {item.focusAreas[locale].join(' · ')}
                      </p>
                    </div>

                    {/* Action / Index */}
                    <div className="flex lg:col-span-2 lg:justify-end">
                      {isTrentino && trentinoCaseStudy && onSelectCaseStudy ? (
                        <button
                          type="button"
                          onClick={() => onSelectCaseStudy(trentinoCaseStudy)}
                          className="group inline-flex min-h-[40px] items-center gap-1.5 border-b border-[#D0A243]/60 pb-0.5 font-display text-xs font-medium text-[#D0A243] transition-colors duration-200 hover:border-[#EBE4D4] hover:text-[#EBE4D4] whitespace-nowrap"
                        >
                          <span>
                            {locale === 'it' ? 'Apri caso studio' : 'Read case study'}
                          </span>
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        <span className="font-mono-num text-[11px] tracking-[0.16em] text-[#867F70]">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
