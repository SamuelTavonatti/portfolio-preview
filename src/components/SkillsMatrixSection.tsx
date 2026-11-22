import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

interface Pillar {
  code: string;
  title: { it: string; en: string };
  skills: string[];
}

const CAPABILITY_PILLARS: Pillar[] = [
  {
    code: '01',
    title: { it: 'UX/UI & Research', en: 'UX/UI & Research' },
    skills: [
      'Figma & Prototyping',
      'Design Systems',
      'Double Diamond',
      'Cognitive Ergonomics',
      'Wireframing & Information Architecture',
      'Usability Testing',
    ],
  },
  {
    code: '02',
    title: { it: 'Front-End & Motion', en: 'Front-End & Motion' },
    skills: [
      'Vue.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'CSS & SVG Motion',
      'Firebase / Firestore',
    ],
  },
  {
    code: '03',
    title: { it: 'Content, SEO & Digital', en: 'Content, SEO & Digital' },
    skills: [
      'Pimcore CMS',
      'Google Analytics 4 (GA4)',
      'SEO & Search Architecture',
      'Multilingual Editorial Workflows',
      'Digital & Prototyping Workflows',
    ],
  },
];

export function SkillsMatrixSection() {
  const { locale } = useLanguage();

  return (
    <section
      id="competenze"
      aria-labelledby="skills-heading"
      className="relative z-10 scroll-mt-20 border-t border-white/[0.08] bg-[#09090B] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
        <ScrollReveal duration={0.85}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl space-y-3">
              <p className="font-mono-num text-[11px] font-medium uppercase tracking-[0.2em] text-[#C8A878]">
                02 — {locale === 'it' ? 'Competenze & Stack' : 'Skills & Stack'}
              </p>
              <h2
                id="skills-heading"
                className="font-display text-3xl font-medium tracking-[-0.03em] text-[#F4F3EF] sm:text-5xl"
              >
                {locale === 'it'
                  ? 'Discipline e strumenti'
                  : 'Disciplines & Tooling'}
              </h2>
            </div>
            <p className="font-mono-num text-[11px] uppercase tracking-[0.18em] text-[#68686C]">
              {locale === 'it'
                ? 'RICERCA · CODICE · CONTENUTI'
                : 'RESEARCH · CODE · CONTENT'}
            </p>
          </div>
        </ScrollReveal>

        {/* Swiss Architectural 3-Column Index (Hairlines, Zero Pills / Zero Icon Circles) */}
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {CAPABILITY_PILLARS.map((pillar, idx) => (
            <ScrollReveal key={pillar.code} delay={idx * 0.08} duration={0.85}>
              <div className="flex h-full flex-col border-t border-white/[0.12] pt-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-medium tracking-[-0.015em] text-[#F4F3EF]">
                    {pillar.title[locale]}
                  </h3>
                  <span className="font-mono-num text-[11px] tracking-[0.16em] text-[#C8A878]">
                    {pillar.code}
                  </span>
                </div>

                <ul className="mt-6 divide-y divide-white/[0.06]">
                  {pillar.skills.map((skill) => (
                    <li
                      key={skill}
                      className="py-2.5 text-sm text-[#9C9B96] transition-colors duration-200 hover:text-[#F4F3EF]"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
