import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CASE_STUDIES, UI_COPY } from '../data/content';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { CaseStudy } from '../types/portfolio';
import { LanguageToggle } from './LanguageToggle';
import { ProjectCoverVisual } from './ProjectCoverVisual';
import { ResilientImage } from './ResilientImage';

interface CaseStudySheetProps {
  study: CaseStudy | null;
  notFoundSlug: string | null;
  onClose: () => void;
  onSelectStudy: (study: CaseStudy) => void;
}

interface LightboxImage {
  src: string;
  alt: string;
  caption: string;
}

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function CaseStudySheet({
  study,
  notFoundSlug,
  onClose,
  onSelectStudy,
}: CaseStudySheetProps) {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isOpen = Boolean(study || notFoundSlug);
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);

  const handleCloseAll = () => {
    if (lightbox) {
      setLightbox(null);
      return;
    }
    onClose();
  };

  const sheetRef = useFocusTrap<HTMLDivElement>(isOpen, handleCloseAll);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLightbox(null);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [study?.id]);

  const currentIndex = study
    ? CASE_STUDIES.findIndex((item) => item.id === study.id)
    : -1;
  const prevStudy =
    currentIndex >= 0
      ? CASE_STUDIES[(currentIndex - 1 + CASE_STUDIES.length) % CASE_STUDIES.length]
      : null;
  const nextStudy =
    currentIndex >= 0
      ? CASE_STUDIES[(currentIndex + 1) % CASE_STUDIES.length]
      : null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-sheet-title"
        >
          {/* Scrim backdrop */}
          <motion.div
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Slide-over editorial panel */}
          <motion.div
            ref={sheetRef}
            tabIndex={-1}
            initial={prefersReducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={prefersReducedMotion ? undefined : { x: '100%' }}
            transition={{ duration: 0.36, ease: EDITORIAL_EASE }}
            className="relative z-10 flex h-full w-full max-w-4xl flex-col border-l border-white/[0.08] bg-[#09090B] shadow-2xl"
          >
            {/* Sticky Sheet Header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] bg-[#09090B]/95 px-5 py-4 backdrop-blur-md sm:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={UI_COPY.projects.sheet.close[locale]}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/[0.10] bg-[#111114] text-[#F4F3EF] transition-colors duration-150 hover:border-[#C8A878]/50 hover:text-[#C8A878]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="truncate font-display text-sm font-medium text-[#F4F3EF]">
                  {study ? study.title[locale] : UI_COPY.projects.sheet.notFound[locale]}
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <LanguageToggle compact />
                {study?.liveUrl ? (
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-[#F4F3EF] px-4 font-display text-xs font-medium text-[#09090B] transition-colors duration-150 hover:bg-[#C8A878] whitespace-nowrap"
                  >
                    <span>
                      {study.liveLabel?.[locale] ?? UI_COPY.projects.visitLive[locale]}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Scrollable Editorial Body */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-5 py-8 sm:px-10 sm:py-10"
            >
              {study ? (
                <div className="mx-auto max-w-3xl space-y-10">
                  {/* Header Block */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono-num text-[11px] uppercase tracking-[0.14em] text-[#68686C]">
                      <span className="text-[#C8A878]">{study.categoryLabel[locale]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{study.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{study.organization[locale]}</span>
                    </div>

                    <h2
                      id="case-study-sheet-title"
                      className="font-display text-3xl font-medium tracking-[-0.03em] text-[#F4F3EF] sm:text-4xl"
                    >
                      {study.title[locale]}
                    </h2>

                    <p className="text-base leading-relaxed text-[#9C9B96] sm:text-lg">
                      {study.subtitle[locale]}
                    </p>

                    {study.liveUrl ? (
                      <div className="pt-2 sm:hidden">
                        <a
                          href={study.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-md bg-[#F4F3EF] px-5 font-display text-sm font-medium text-[#09090B] transition-colors hover:bg-[#C8A878]"
                        >
                          <span>
                            {study.liveLabel?.[locale] ?? UI_COPY.projects.visitLive[locale]}
                          </span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </div>
                    ) : null}
                  </div>

                  {/* Authentic Product UI Preview / Territorial Photo Banner */}
                  <div className="relative overflow-hidden rounded-xl border border-white/[0.08]">
                    <ProjectCoverVisual study={study} locale={locale} size="hero" />
                  </div>

                  {/* Structured Metadata Strip */}
                  <dl className="grid grid-cols-1 gap-6 border-y border-white/[0.08] py-6 sm:grid-cols-3">
                    <div>
                      <dt className="font-mono-num text-[11px] uppercase tracking-[0.14em] text-[#68686C]">
                        {UI_COPY.projects.sheet.role[locale]}
                      </dt>
                      <dd className="mt-1.5 text-sm font-medium text-[#F4F3EF]">
                        {study.role[locale]}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono-num text-[11px] uppercase tracking-[0.14em] text-[#68686C]">
                        {UI_COPY.projects.sheet.context[locale]}
                      </dt>
                      <dd className="mt-1.5 text-sm font-medium text-[#F4F3EF]">
                        {study.organization[locale]}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono-num text-[11px] uppercase tracking-[0.14em] text-[#68686C]">
                        {UI_COPY.projects.sheet.year[locale]}
                      </dt>
                      <dd className="mt-1.5 font-mono-num text-sm font-medium text-[#F4F3EF]">
                        {study.year}
                      </dd>
                    </div>
                  </dl>

                  {/* Multi-Photo Project Screens & Visual Gallery */}
                  {study.gallery.length > 0 ? (
                    <section className="space-y-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-mono-num text-[11px] font-medium uppercase tracking-[0.16em] text-[#C8A878]">
                          {UI_COPY.projects.sheet.galleryLabel[locale]}
                        </h3>
                        <span className="text-xs text-[#68686C]">
                          {UI_COPY.projects.sheet.galleryHint[locale]}
                        </span>
                      </div>

                      <div
                        className={`grid grid-cols-1 gap-5 ${
                          study.gallery.length === 3
                            ? 'sm:grid-cols-3'
                            : study.gallery.length > 1
                              ? 'sm:grid-cols-2'
                              : ''
                        }`}
                      >
                        {study.gallery.map((photo) => (
                          <figure key={photo.id} className="flex flex-col space-y-2.5">
                            <button
                              type="button"
                              onClick={() =>
                                setLightbox({
                                  src: photo.src,
                                  alt: photo.alt[locale],
                                  caption: photo.label
                                    ? `${photo.label[locale]} — ${photo.caption[locale]}`
                                    : photo.caption[locale],
                                })
                              }
                              className="group relative block w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#111114] text-left transition-colors duration-200 hover:border-[#C8A878]/50"
                            >
                              <ResilientImage
                                src={photo.src}
                                alt={photo.alt[locale]}
                                fallbackLabel={photo.label?.[locale] ?? study.title[locale]}
                                aspectClass="aspect-[4/3]"
                                width={1200}
                                height={900}
                                className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                              />
                              <span
                                aria-hidden="true"
                                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-[#09090B]/85 text-[#F4F3EF] opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
                              >
                                <Maximize2 className="h-3.5 w-3.5" />
                              </span>
                            </button>
                            <figcaption className="space-y-1">
                              {photo.label ? (
                                <p className="font-display text-sm font-medium text-[#F4F3EF]">
                                  {photo.label[locale]}
                                </p>
                              ) : null}
                              <p className="text-xs leading-relaxed text-[#9C9B96]">
                                {photo.caption[locale]}
                              </p>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {/* Key Focus Areas */}
                  <div className="space-y-3 border-t border-white/[0.08] pt-8">
                    <h3 className="font-mono-num text-[11px] font-medium uppercase tracking-[0.16em] text-[#C8A878]">
                      {UI_COPY.projects.sheet.deliverables[locale]}
                    </h3>
                    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {study.deliverables[locale].map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-[#9C9B96]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-2 shrink-0 bg-[#C8A878]"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Editorial Narrative Chapters */}
                  <div className="space-y-10 pt-2">
                    {study.sections.map((section, idx) => (
                      <section
                        key={section.title.en}
                        className="space-y-4 border-t border-white/[0.08] pt-8"
                      >
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono-num text-xs font-medium text-[#C8A878]">
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-[#F4F3EF]">
                            {section.title[locale]}
                          </h3>
                        </div>
                        <p className="text-[15px] leading-[1.7] text-[#9C9B96] sm:text-base">
                          {section.body[locale]}
                        </p>

                        {section.points ? (
                          <ul className="space-y-2.5 pt-2">
                            {section.points[locale].map((pt) => (
                              <li
                                key={pt}
                                className="flex items-start gap-3 text-[15px] leading-relaxed text-[#D4D3CE]"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-2.5 h-px w-3 shrink-0 bg-[#C8A878]"
                                />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </section>
                    ))}
                  </div>

                  {/* Authentic Territorial Brand Identity Showcase (Trentino Marketing only) */}
                  {study.brandShowcase ? (
                    <section className="space-y-6 border-t border-white/[0.08] pt-8">
                      <div className="space-y-2">
                        <p className="font-mono-num text-[11px] font-medium uppercase tracking-[0.16em] text-[#C8A878]">
                          {UI_COPY.projects.sheet.brandIdentityLabel[locale]}
                        </p>
                        <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-[#F4F3EF]">
                          {study.brandShowcase.title[locale]}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#9C9B96] sm:text-[15px]">
                          {study.brandShowcase.overview[locale]}
                        </p>
                      </div>

                      {/* Official Mark Variants */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex min-h-[164px] flex-col items-center justify-center gap-3 rounded-lg border border-white/[0.08] bg-[#F4F3EF] p-7">
                          <img
                            src={study.brandShowcase.colorSrc}
                            alt={study.brandShowcase.alt[locale]}
                            loading="lazy"
                            decoding="async"
                            className="max-h-16 w-auto max-w-full object-contain"
                          />
                          <span className="font-mono-num text-[11px] font-medium text-[#52525B]">
                            {locale === 'it'
                              ? 'Marchio istituzionale a colori'
                              : 'Full-color institutional mark'}
                          </span>
                        </div>
                        <div className="flex min-h-[164px] flex-col items-center justify-center gap-3 rounded-lg border border-white/[0.08] bg-[#F4F3EF] p-7">
                          <img
                            src={study.brandShowcase.monoSrc}
                            alt={study.brandShowcase.alt[locale]}
                            loading="lazy"
                            decoding="async"
                            className="max-h-16 w-auto max-w-full object-contain"
                          />
                          <span className="font-mono-num text-[11px] font-medium text-[#52525B]">
                            {locale === 'it'
                              ? 'Variante monocromatica Blu Dolomiti'
                              : 'Dolomites Blue monochrome variant'}
                          </span>
                        </div>
                      </div>

                      {/* Official Territorial Palette Swatches */}
                      <div className="space-y-3">
                        <p className="font-mono-num text-[11px] font-medium uppercase tracking-[0.14em] text-[#68686C]">
                          {locale === 'it'
                            ? 'Palette cromatica territoriale'
                            : 'Territorial color palette'}
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                          {study.brandShowcase.swatches.map((swatch) => (
                            <div
                              key={swatch.hex}
                              className="flex flex-col gap-2 rounded-md border border-white/[0.08] bg-[#111114] p-3"
                            >
                              <span
                                aria-hidden="true"
                                className="h-9 w-full rounded-sm border border-white/15"
                                style={{ backgroundColor: swatch.hex }}
                              />
                              <div className="space-y-0.5">
                                <p className="font-display text-xs font-medium text-[#F4F3EF]">
                                  {swatch.name[locale]}
                                </p>
                                <p className="font-mono-num text-[11px] text-[#C8A878]">
                                  {swatch.hex}
                                </p>
                                <p className="text-[11px] leading-snug text-[#68686C]">
                                  {swatch.role[locale]}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Verified Brand Architecture Notes */}
                      <dl className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                        {study.brandShowcase.principles.map((item) => (
                          <div
                            key={item.label.en}
                            className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-6"
                          >
                            <dt className="font-display text-sm font-medium text-[#F4F3EF] sm:col-span-4">
                              {item.label[locale]}
                            </dt>
                            <dd className="text-sm leading-relaxed text-[#9C9B96] sm:col-span-8">
                              {item.detail[locale]}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  ) : null}

                  {/* Calm Takeaway Callout */}
                  <div className="rounded-lg border border-[#C8A878]/25 bg-[#111114] p-6 sm:p-8">
                    <p className="font-mono-num text-[11px] font-medium uppercase tracking-[0.16em] text-[#C8A878]">
                      {UI_COPY.projects.sheet.takeawayLabel[locale]}
                    </p>
                    <p className="mt-3 font-display text-lg font-medium leading-relaxed text-[#F4F3EF]">
                      {study.takeaway[locale]}
                    </p>
                  </div>

                  {/* Previous / Next Case Study Footer Navigation */}
                  {prevStudy && nextStudy ? (
                    <div className="grid grid-cols-1 gap-4 border-t border-white/[0.08] pt-8 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => onSelectStudy(prevStudy)}
                        className="flex min-h-[72px] flex-col items-start justify-center rounded-lg border border-white/[0.08] bg-[#111114] p-4 text-left transition-colors duration-150 hover:border-[#C8A878]/50"
                      >
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#68686C]">
                          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                          {UI_COPY.projects.sheet.previous[locale]}
                        </span>
                        <span className="mt-1 font-display text-sm font-medium text-[#F4F3EF]">
                          {prevStudy.title[locale]}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectStudy(nextStudy)}
                        className="flex min-h-[72px] flex-col items-end justify-center rounded-lg border border-white/[0.08] bg-[#111114] p-4 text-right transition-colors duration-150 hover:border-[#C8A878]/50"
                      >
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#68686C]">
                          {UI_COPY.projects.sheet.next[locale]}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="mt-1 font-display text-sm font-medium text-[#F4F3EF]">
                          {nextStudy.title[locale]}
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
                  <h2
                    id="case-study-sheet-title"
                    className="font-display text-2xl font-medium text-[#F4F3EF]"
                  >
                    {UI_COPY.projects.sheet.notFound[locale]}
                  </h2>
                  <p className="mt-2 font-mono-num text-xs text-[#68686C]">{notFoundSlug}</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#F4F3EF] px-5 font-display text-sm font-medium text-[#09090B] transition-colors hover:bg-[#C8A878]"
                  >
                    {UI_COPY.projects.sheet.backToList[locale]}
                  </button>
                </div>
              )}
            </div>

            {/* Inline Fullscreen Lightbox Viewer */}
            <AnimatePresence>
              {lightbox ? (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setLightbox(null)}
                  className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/92 p-5 backdrop-blur-md sm:p-10"
                >
                  <button
                    type="button"
                    onClick={() => setLightbox(null)}
                    aria-label={locale === 'it' ? 'Chiudi anteprima' : 'Close preview'}
                    className="fixed right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-[#111114] text-[#F4F3EF] hover:border-[#C8A878]"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex max-h-[86vh] max-w-5xl flex-col items-center gap-4"
                  >
                    <img
                      src={lightbox.src}
                      alt={lightbox.alt}
                      className="max-h-[76vh] w-auto max-w-full rounded-lg border border-white/10 object-contain shadow-2xl"
                    />
                    <p className="max-w-2xl text-center text-xs leading-relaxed text-[#9C9B96] sm:text-sm">
                      {lightbox.caption}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
