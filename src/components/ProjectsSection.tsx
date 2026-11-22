import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CASE_STUDIES } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { CaseStudy, CaseStudyCategory } from '../types/portfolio';
import { ProjectCoverVisual } from './ProjectCoverVisual';
import { ScrollReveal } from './ScrollReveal';

interface ProjectsSectionProps {
  onSelectCaseStudy: (study: CaseStudy) => void;
}

const FILTER_OPTIONS: {
  key: CaseStudyCategory;
  label: { it: string; en: string };
}[] = [
  { key: 'all', label: { it: 'Tutti', en: 'All' } },
  {
    key: 'product',
    label: { it: 'Product Design & Front-End', en: 'Product Design & Front-End' },
  },
  {
    key: 'hci',
    label: { it: 'HCI & Interaction Design', en: 'HCI & Interaction Design' },
  },
  {
    key: 'content',
    label: {
      it: 'CMS Architecture & Content UX',
      en: 'CMS Architecture & Content UX',
    },
  },
];

const PROJECT_META: Record<string, { it: string; en: string }> = {
  voltrep: {
    it: 'PRODOTTO WEB · 2025–2026',
    en: 'WEB PRODUCT · 2025–2026',
  },
  'esu-hci': {
    it: 'RICERCA & HCI · 2025',
    en: 'RESEARCH & HCI · 2025',
  },
  'trentino-marketing': {
    it: 'CMS & EVENT UX · AGO–OTT 2026',
    en: 'CMS & EVENT UX · AUG–OCT 2026',
  },
};

const PROJECT_KPIS: Record<string, { it: string[]; en: string[] }> = {
  voltrep: {
    it: ['0€ Infrastructure', 'Real-Time Firestore', 'Mobile-First'],
    en: ['0€ Infrastructure', 'Real-Time Firestore', 'Mobile-First'],
  },
  'esu-hci': {
    it: ['Double Diamond', 'Cognitive Ergonomics', 'Usability Validated'],
    en: ['Double Diamond', 'Cognitive Ergonomics', 'Usability Validated'],
  },
  'trentino-marketing': {
    it: ['Pimcore CMS', '6-Language Editorial', 'GA4 & SEO QA'],
    en: ['Pimcore CMS', '6-Language Editorial', 'GA4 & SEO QA'],
  },
};

export function ProjectsSection({ onSelectCaseStudy }: ProjectsSectionProps) {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<CaseStudyCategory>('all');

  const filtered =
    activeFilter === 'all'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((study) => study.category === activeFilter);

  return (
    <section
      id="progetti"
      aria-labelledby="projects-heading"
      className="relative z-10 scroll-mt-20 border-t border-white/[0.08] bg-[#0B0A09] py-20 sm:py-26"
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-8">
        <ScrollReveal duration={0.85}>
          <div className="space-y-7">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono-num text-[11px] font-medium uppercase tracking-[0.2em] text-[#D0A243]">
                01 — {locale === 'it' ? 'Archivio Lavori' : 'Work Archive'}
              </p>
              <h2
                id="projects-heading"
                className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#EBE4D4] sm:text-5xl"
              >
                {locale === 'it' ? 'Case Study & Progetti' : 'Case Studies & Projects'}
              </h2>
              <p className="text-sm leading-relaxed text-[#BDB6AD] sm:text-base">
                {locale === 'it'
                  ? 'Tre progetti reali tra prodotto web indipendente, ricerca HCI universitaria e architettura editoriale su CMS.'
                  : 'Three real projects spanning independent web product engineering, university HCI research, and enterprise CMS architecture.'}
              </p>
            </div>

            {/* Clean Underlined Category Filter Tabs */}
            <div
              role="group"
              aria-label={locale === 'it' ? 'Filtra case study' : 'Filter case studies'}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/[0.08]"
            >
              {FILTER_OPTIONS.map((opt) => {
                const selected = activeFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setActiveFilter(opt.key)}
                    aria-pressed={selected}
                    className={`relative min-h-[42px] pb-3 font-display text-xs font-medium transition-colors duration-200 whitespace-nowrap sm:text-sm ${
                      selected
                        ? 'text-[#EBE4D4]'
                        : 'text-[#867F70] hover:text-[#BDB6AD]'
                    }`}
                  >
                    <span>{opt.label[locale]}</span>
                    {selected ? (
                      <motion.span
                        layoutId="projects-filter-underline"
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
                        }
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-px h-[2px] bg-[#D0A243]"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Unified Responsive 3-Column Editorial Showcase Grid */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {filtered.map((study, idx) => {
            const kpis = PROJECT_KPIS[study.id]?.[locale] ?? [];
            const metaLine =
              PROJECT_META[study.id]?.[locale] ??
              `${study.categoryLabel[locale]} · ${study.year}`;

            return (
              <ScrollReveal
                key={study.id}
                delay={idx * 0.08}
                duration={0.85}
                className="h-full"
              >
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#131210] transition-[border-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#D0A243]/45 hover:shadow-[0_22px_54px_rgba(0,0,0,0.5)]">
                  {/* Authentic Product UI Preview (VoltRep & ESU) / Dolomites Photo (Trentino) */}
                  <button
                    type="button"
                    onClick={() => onSelectCaseStudy(study)}
                    aria-label={`${locale === 'it' ? 'Apri caso studio' : 'Open case study'}: ${study.title[locale]}`}
                    className="block w-full border-b border-white/[0.08] text-left focus-visible:outline-none"
                  >
                    <ProjectCoverVisual study={study} locale={locale} size="card" />
                  </button>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <p className="font-mono-num text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#D0A243]">
                        {metaLine}
                      </p>

                      <h3 className="mt-2.5 font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-[#EBE4D4]">
                        {study.title[locale]}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-[#BDB6AD]">
                        {study.summary[locale]}
                      </p>

                      {/* 3 Concise KPI Pills */}
                      {kpis.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {kpis.map((kpi, kIdx) => (
                            <span
                              key={kpi}
                              className={`rounded-full border px-2.5 py-1 font-mono-num text-[10.5px] font-medium ${
                                kIdx === 0
                                  ? 'border-[#20505D]/60 bg-[#20505D]/20 text-[#95B1BA]'
                                  : 'border-white/[0.09] bg-[#0B0A09] text-[#BDB6AD]'
                              }`}
                            >
                              {kpi}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {/* Direct Actions: Leggi Case Study + Apri Live ↗ */}
                    <div className="mt-6 flex min-h-[42px] flex-wrap items-center justify-between gap-2.5 border-t border-white/[0.08] pt-4">
                      <button
                        type="button"
                        onClick={() => onSelectCaseStudy(study)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 font-display text-xs font-semibold text-[#EBE4D4] transition-colors duration-200 hover:text-[#D0A243] whitespace-nowrap sm:text-sm"
                      >
                        <span>
                          {locale === 'it' ? 'Leggi Case Study' : 'Read Case Study'}
                        </span>
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </button>

                      {study.liveUrl ? (
                        <a
                          href={study.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-[#D0A243]/40 bg-[#D0A243]/10 px-3 font-display text-xs font-semibold text-[#D0A243] transition-colors duration-200 hover:bg-[#D0A243] hover:text-[#0B0A09] whitespace-nowrap"
                        >
                          <span>{locale === 'it' ? 'Apri Live' : 'Open Live'}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
