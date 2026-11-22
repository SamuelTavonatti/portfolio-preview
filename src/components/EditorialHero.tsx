import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function EditorialHero() {
  const { locale } = useLanguage();

  const highlights = [
    {
      label: { it: 'Disciplina', en: 'Discipline' },
      value: { it: 'UX/UI & Ergonomia Cognitiva', en: 'UX/UI & Cognitive Ergonomics' },
    },
    {
      label: { it: 'Ingegneria', en: 'Engineering' },
      value: { it: 'React · Vue · TypeScript', en: 'React · Vue · TypeScript' },
    },
    {
      label: { it: 'Base', en: 'Location' },
      value: { it: 'Trento, Italia · Remoto', en: 'Trento, Italy · Remote' },
    },
  ];

  return (
    <section
      id="panoramica"
      aria-labelledby="hero-heading"
      className="relative scroll-mt-20 bg-[#0B0A09] pb-16 pt-14 sm:pb-22 sm:pt-20"
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-8">
        <div className="max-w-4xl space-y-7">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-[#D0A243]" />
            <p className="font-mono-num text-[11px] font-medium uppercase tracking-[0.2em] text-[#D0A243]">
              {locale === 'it'
                ? 'Trento · UX/UI Design & Front-End'
                : 'Trento · UX/UI Design & Front-End'}
            </p>
          </div>

          <h1
            id="hero-heading"
            className="font-display text-[clamp(2.8rem,6.8vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[#EBE4D4]"
          >
            Samuel Tavonatti
          </h1>

          <p className="max-w-[54ch] text-base leading-[1.7] text-[#BDB6AD] sm:text-lg">
            {locale === 'it'
              ? 'Progetto interfacce essenziali, architetture informative chiare e prodotti web ad alta ergonomia cognitiva — unendo ricerca HCI, design dei sistemi e sviluppo front-end.'
              : 'I design calm interfaces, clear information architectures, and low-friction web products — bridging HCI research, design systems, and front-end engineering.'}
          </p>

          {/* Dual Executive CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a
              href="#progetti"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#D0A243] px-6 font-display text-sm font-semibold text-[#0B0A09] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#DEB252] whitespace-nowrap shadow-[0_4px_20px_rgba(208,162,67,0.22)]"
            >
              <span>{locale === 'it' ? 'Esplora i progetti' : 'Explore projects'}</span>
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href="#contatti"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/[0.14] bg-[#131210] px-6 font-display text-sm font-medium text-[#EBE4D4] transition-all duration-200 hover:border-[#95B1BA]/60 hover:text-[#95B1BA] whitespace-nowrap"
            >
              <span>{locale === 'it' ? 'Parliamone' : 'Get in touch'}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Quiet 3-Column Positioning Strip (Zero Redundant Project Carousel) */}
        <dl className="mt-12 grid grid-cols-1 gap-6 border-t border-white/[0.08] pt-7 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.label.en} className="space-y-1">
              <dt className="font-mono-num text-[10.5px] uppercase tracking-[0.16em] text-[#867F70]">
                {item.label[locale]}
              </dt>
              <dd className="font-display text-sm font-medium text-[#EBE4D4]">
                {item.value[locale]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
