import { useLanguage } from '../context/LanguageContext';
import { STUDIO_ASSETS, UI_COPY } from '../data/content';
import { ResilientImage } from './ResilientImage';
import { ScrollReveal } from './ScrollReveal';

export function CraftSection() {
  const { locale } = useLanguage();

  return (
    <section
      id="approccio"
      aria-labelledby="craft-heading"
      className="scroll-mt-24 border-t border-white/[0.08] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Editorial Domain Narrative */}
          <ScrollReveal duration={0.95} className="lg:col-span-7">
            <div className="flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <p className="font-mono-num text-xs font-medium uppercase tracking-wider text-[var(--accent-warm)]">
                  {UI_COPY.craft.sectionNumber}
                </p>
                <h2
                  id="craft-heading"
                  className="font-display text-3xl font-semibold tracking-tight text-[#F3F5F8] sm:text-4xl"
                >
                  {UI_COPY.craft.heading[locale]}
                </h2>
                <p className="font-display text-lg font-medium leading-relaxed text-[#E4E9F0]">
                  {UI_COPY.craft.intro[locale]}
                </p>
                <p className="max-w-[66ch] text-[15px] leading-[1.7] text-[#B8C2CF] sm:text-base">
                  {UI_COPY.craft.body1[locale]}
                </p>
                <p className="max-w-[66ch] text-[15px] leading-[1.7] text-[#B8C2CF] sm:text-base">
                  {UI_COPY.craft.body2[locale]}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Studio Material Detail */}
          <ScrollReveal delay={0.14} duration={0.95} className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#151921]">
              <ResilientImage
                src={STUDIO_ASSETS.craft}
                alt={
                  locale === 'it'
                    ? 'Fotografia editoriale di una palestra minimalista con bilanciere olimpico su pedana da bodybuilding, luce calda radente e attrezzatura sportiva sullo sfondo.'
                    : 'Editorial photograph of a minimalist gym with an Olympic barbell on a lifting platform in warm side light alongside multi-sport gear in the background.'
                }
                fallbackLabel={
                  locale === 'it'
                    ? 'Sport, fitness e allenamento in palestra'
                    : 'Sport, fitness & bodybuilding'
                }
                aspectClass="aspect-[16/10] lg:aspect-[4/3]"
                width={1200}
                height={900}
                priority
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0E1116]/55 to-transparent"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Three Disciplined Craft Principles — Clean horizontal hairline row */}
        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-white/[0.08] pt-12 md:grid-cols-3">
          {UI_COPY.craft.principles.map((principle, idx) => (
            <ScrollReveal
              key={principle.title.en}
              delay={idx * 0.1}
              duration={0.85}
              className="space-y-3"
            >
              <span className="font-mono-num text-xs font-medium uppercase tracking-wider text-[var(--accent-warm)]">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight text-[#F3F5F8]">
                {principle.title[locale]}
              </h3>
              <p className="text-sm leading-relaxed text-[#B8C2CF]">
                {principle.desc[locale]}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
