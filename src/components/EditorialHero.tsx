import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

const SCENE_DURATION_MS = 6000;
const CINEMATIC_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ChapterDef {
  id: number;
  num: string;
  title: { it: string; en: string };
  eyebrow: { it: string; en: string };
  summary: { it: string; en: string };
}

const CHAPTERS: ChapterDef[] = [
  {
    id: 0,
    num: '01',
    title: { it: 'UX/UI Design', en: 'UX/UI Design' },
    eyebrow: { it: 'Design System & Auto-Layout', en: 'Design System & Auto-Layout' },
    summary: {
      it: 'Sistemi visivi scalabili, griglia a 8pt e contrasto tipografico WCAG AA verificato.',
      en: 'Scalable design systems, 8pt spatial grid, and verified WCAG AA typographic contrast.',
    },
  },
  {
    id: 1,
    num: '02',
    title: { it: 'User Research', en: 'User Research' },
    eyebrow: { it: 'HCI & Ergonomia Cognitiva', en: 'HCI & Cognitive Ergonomics' },
    summary: {
      it: 'Framework Double Diamond, interviste utente sul campo e riduzione drastica dell’attrito.',
      en: 'Double Diamond framework, field user interviews, and drastic friction reduction.',
    },
  },
  {
    id: 2,
    num: '03',
    title: { it: 'Creative AI', en: 'Creative AI' },
    eyebrow: { it: 'Sintesi Generativa & Motion', en: 'Generative Synthesis & Motion' },
    summary: {
      it: 'Direzione artistica generativa, esplorazione rapida di concept e prototipazione interattiva.',
      en: 'Generative art direction, rapid concept exploration, and interactive prototyping.',
    },
  },
  {
    id: 3,
    num: '04',
    title: { it: 'Front-End & Motion', en: 'Front-End & Motion' },
    eyebrow: { it: 'Ingegneria 60 FPS & VoltRep', en: '60 FPS Engineering & VoltRep' },
    summary: {
      it: 'Componenti React e Vue tipizzati, budget frame di 0.4ms e zero layout shift.',
      en: 'Strictly-typed React & Vue components, 0.4ms frame budget, and zero layout shift.',
    },
  },
];

// Double Diamond SVG tracer points (viewBox 0 0 360 110)
const DD_UPPER = [
  { x: 24, y: 55 },
  { x: 102, y: 18 },
  { x: 180, y: 55 },
  { x: 258, y: 18 },
  { x: 336, y: 55 },
];

const DD_LOWER = [
  { x: 24, y: 55 },
  { x: 102, y: 92 },
  { x: 180, y: 55 },
  { x: 258, y: 92 },
  { x: 336, y: 55 },
];

const DD_NODES = [
  { x: 24, y: 55, label: 'Discover' },
  { x: 102, y: 18, label: 'Define' },
  { x: 180, y: 55, label: 'Develop' },
  { x: 258, y: 18, label: 'Deliver' },
  { x: 336, y: 55, label: '' },
];

const VOLTREP_SETS = [
  { id: 'W1', reps: '82.5 kg × 8', tag: 'RPE 7.5' },
  { id: 'W2', reps: '85.0 kg × 8', tag: 'RPE 8.0' },
  { id: 'W3', reps: '87.5 kg × 7', tag: 'RPE 8.5' },
  { id: 'W4', reps: '90.0 kg × 6', tag: 'RPE 9.0' },
  { id: 'W5', reps: '92.5 kg × 6', tag: 'PR ✓' },
];

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function PointerSvg() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" className="drop-shadow-md">
      <path
        d="M2.5 2L16.5 11.4L10.2 12.6L7.3 18.8L2.5 2Z"
        fill="#EBE4D4"
        stroke="#0B0A09"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EditorialHero() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeScene, setActiveScene] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(() => (prefersReducedMotion ? 1 : 0));
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(true);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);

  const sceneStartRef = useRef<number>(0);
  const elapsedOffsetRef = useRef<number>(0);
  const activeSceneRef = useRef<number>(0);
  activeSceneRef.current = activeScene;

  // Reduced motion synchronization
  useEffect(() => {
    if (prefersReducedMotion) {
      setSceneProgress(1);
    }
  }, [prefersReducedMotion]);

  // Pause automatically when scrolled out of viewport (Performance optimization)
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Pause automatically when browser tab is inactive
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const selectScene = useCallback((idx: number) => {
    activeSceneRef.current = idx;
    sceneStartRef.current = performance.now();
    elapsedOffsetRef.current = 0;
    setActiveScene(idx);
    setSceneProgress(0);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      if (!prev) {
        // Pausing: save current elapsed progress
        return true;
      } else {
        // Resuming: reset start time taking current progress into account
        const now = performance.now();
        sceneStartRef.current = now - sceneProgress * SCENE_DURATION_MS;
        return false;
      }
    });
  }, [sceneProgress]);

  const restartShowreel = useCallback(() => {
    selectScene(0);
    setIsPaused(false);
  }, [selectScene]);

  const shouldAnimate =
    isInView && isTabVisible && !isPaused && !prefersReducedMotion;

  // Single Master 60fps RAF Clock
  useEffect(() => {
    if (!shouldAnimate) return;

    sceneStartRef.current = performance.now() - sceneProgress * SCENE_DURATION_MS;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - sceneStartRef.current;

      if (elapsed >= SCENE_DURATION_MS) {
        const next = (activeSceneRef.current + 1) % CHAPTERS.length;
        activeSceneRef.current = next;
        sceneStartRef.current = now;
        setActiveScene(next);
        setSceneProgress(0);
      } else {
        setSceneProgress(elapsed / SCENE_DURATION_MS);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [shouldAnimate, activeScene]);

  const t = prefersReducedMotion ? 0.95 : sceneProgress;

  /* --------------------------------------------------------------------------
     SCENE 01: UX/UI DESIGN (Figma Auto-Layout & Cursor Simulation)
     -------------------------------------------------------------------------- */
  const s1Grid = clamp(t / 0.25);
  const s1ActiveBadge = t < 0.28 ? 0 : t < 0.58 ? 1 : 2;
  const s1CursorIn = !prefersReducedMotion && t >= 0.38 && t <= 0.88;
  const s1Pressed = t >= 0.58 && t <= 0.65;
  const s1Validated = t >= 0.62;

  /* --------------------------------------------------------------------------
     SCENE 02: USER RESEARCH (Double Diamond Path Trace & Usability Metric)
     -------------------------------------------------------------------------- */
  const ddLen = 352;
  const ddDraw = clamp(t / 0.8);
  const ddOffset = Math.max(0, ddLen * (1 - ddDraw));
  const s2TaskSuccess = Math.round(52 + clamp(t / 0.75) * (98.4 - 52));

  /* --------------------------------------------------------------------------
     SCENE 03: CREATIVE AI (Prompt Bar Simulation & Generative Flow)
     -------------------------------------------------------------------------- */
  const aiPromptFull =
    locale === 'it'
      ? 'Progetta un sistema workout e abitudini minimalista, griglia 8pt e motion 60fps...'
      : 'Design a minimalist luxury workout & habit OS with 8pt grid and 60fps motion...';
  const aiTyped = aiPromptFull.slice(0, Math.round(clamp(t / 0.45) * aiPromptFull.length));
  const aiGenerativeReady = t >= 0.48;

  /* --------------------------------------------------------------------------
     SCENE 04: FRONT-END & MOTION (VoltRep Ticker & Animated Harmonic Wave)
     -------------------------------------------------------------------------- */
  const s4LoggedSets = Math.min(5, Math.max(1, Math.ceil(clamp(t / 0.7) * 5)));
  const s4WavePath = (() => {
    const pts: string[] = [];
    const phase = t * 14;
    for (let x = 0; x <= 280; x += 10) {
      const y = 18 + Math.sin(x * 0.05 + phase) * 6 + Math.cos(x * 0.09 - phase * 0.7) * 2.5;
      pts.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  })();

  const currentChapter = CHAPTERS[activeScene];

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
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative scroll-mt-20 bg-[#0B0A09] pb-16 pt-12 sm:pb-24 sm:pt-16"
    >
      {/* Soft Ambient Glow in Natural Autumn Palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] overflow-hidden"
      >
        <div className="absolute -top-32 left-1/4 h-[440px] w-[580px] rounded-full bg-[#D0A243]/[0.05] blur-[120px]" />
        <div className="absolute top-10 right-1/4 h-[380px] w-[500px] rounded-full bg-[#20505D]/[0.08] blur-[110px]" />
        <div className="absolute top-48 left-1/2 -translate-x-1/2 h-[300px] w-[460px] rounded-full bg-[#A8532C]/[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1160px] px-4 sm:px-8">
        {/* Main 12-Column Hero Split: Left Text + Right 60fps Interactive Stage */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT COLUMN: Authority, Value Proposition & Chapter Switcher */}
          <div className="flex flex-col space-y-7 lg:col-span-6">
            {/* Location & Live Availability Badge */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="h-px w-6 bg-[#D0A243]" />
                <p className="font-mono-num text-[11px] font-medium uppercase tracking-[0.2em] text-[#D0A243]">
                  Trento · UX/UI & Front-End
                </p>
              </div>

              {/* Live Availability Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#97A78C]/35 bg-[#97A78C]/12 px-3 py-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#97A78C] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#97A78C]" />
                </span>
                <span className="font-mono-num text-[10.5px] font-medium text-[#EBE4D4]">
                  {locale === 'it' ? 'Disponibile 2026' : 'Available 2026'}
                </span>
              </div>
            </div>

            {/* Authoritative Main Name Heading */}
            <div className="space-y-2">
              <h1
                id="hero-heading"
                className="font-display text-[clamp(2.6rem,5.6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-[#EBE4D4]"
              >
                Samuel Tavonatti
              </h1>
              <p className="font-mono-num text-xs uppercase tracking-[0.16em] text-[#95B1BA]">
                UX/UI Designer · HCI Researcher · Front-End
              </p>
            </div>

            {/* Value Proposition Description */}
            <p className="max-w-[48ch] text-base leading-[1.7] text-[#BDB6AD] sm:text-[17px]">
              {locale === 'it'
                ? 'Progetto interfacce essenziali, architetture informative chiare e prodotti web ad alta ergonomia cognitiva — unendo ricerca sul campo, sistemi modulari e codice ad alte prestazioni.'
                : 'I design calm interfaces, clear information architectures, and low-friction web products — bridging field research, modular design systems, and high-performance engineering.'}
            </p>

            {/* Dual Executive CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <a
                href="#progetti"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#D0A243] px-6 font-display text-sm font-semibold text-[#0B0A09] shadow-[0_4px_20px_rgba(208,162,67,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#DEB252] hover:shadow-[0_8px_26px_rgba(208,162,67,0.32)] active:translate-y-0 whitespace-nowrap"
              >
                <span>{locale === 'it' ? 'Esplora i progetti' : 'Explore projects'}</span>
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href="#contatti"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/[0.14] bg-[#131210] px-6 font-display text-sm font-medium text-[#EBE4D4] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#95B1BA]/60 hover:text-[#95B1BA] active:translate-y-0 whitespace-nowrap"
              >
                <span>{locale === 'it' ? 'Parliamone' : 'Get in touch'}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Interactive Chapter Switcher with Live Progress Bars */}
            <div className="pt-3">
              <div className="flex items-center justify-between pb-2">
                <span className="font-mono-num text-[10.5px] uppercase tracking-[0.16em] text-[#867F70]">
                  {locale === 'it' ? 'Capitoli di Competenza' : 'Discipline Chapters'}
                </span>

                {/* Showreel Controls (Pause / Play & Replay) */}
                <div className="flex items-center gap-1.5 text-[#867F70]">
                  <button
                    type="button"
                    onClick={togglePause}
                    aria-label={
                      isPaused
                        ? locale === 'it'
                          ? 'Riproduci showreel'
                          : 'Play showreel'
                        : locale === 'it'
                          ? 'Metti in pausa showreel'
                          : 'Pause showreel'
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-[#131210] text-[#BDB6AD] transition-colors hover:border-[#D0A243]/50 hover:text-[#D0A243]"
                  >
                    {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={restartShowreel}
                    aria-label={
                      locale === 'it' ? 'Riavvia showreel' : 'Restart showreel'
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-[#131210] text-[#BDB6AD] transition-colors hover:border-[#D0A243]/50 hover:text-[#D0A243]"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* 4 Interactive Discipline Tabs */}
              <div
                role="tablist"
                aria-label={locale === 'it' ? 'Selettore capitoli' : 'Chapter selector'}
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {CHAPTERS.map((ch) => {
                  const isActive = activeScene === ch.id;
                  const itemProgress = isActive ? sceneProgress : activeScene > ch.id ? 1 : 0;

                  return (
                    <button
                      key={ch.id}
                      role="tab"
                      id={`tab-chapter-${ch.id}`}
                      aria-selected={isActive}
                      aria-controls={`panel-chapter-${ch.id}`}
                      onClick={() => selectScene(ch.id)}
                      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-2.5 text-left transition-all duration-300 ${
                        isActive
                          ? 'border-[#D0A243]/45 bg-[#1A1815]'
                          : 'border-white/[0.07] bg-[#131210]/70 hover:border-white/[0.14] hover:bg-[#131210]'
                      }`}
                    >
                      {/* Top code and title */}
                      <div className="space-y-0.5">
                        <span
                          className={`font-mono-num text-[10px] font-semibold transition-colors ${
                            isActive ? 'text-[#D0A243]' : 'text-[#867F70]'
                          }`}
                        >
                          {ch.num}
                        </span>
                        <p
                          className={`font-display text-[11.5px] font-medium leading-snug transition-colors line-clamp-1 ${
                            isActive ? 'text-[#EBE4D4]' : 'text-[#BDB6AD]'
                          }`}
                        >
                          {ch.title[locale]}
                        </p>
                      </div>

                      {/* Progress Line */}
                      <div className="mt-2.5 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.08]">
                        <div
                          className="h-full bg-[#D0A243] transition-[width] duration-100 ease-linear"
                          style={{
                            width: `${Math.round(itemProgress * 100)}%`,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The 60fps Interactive Stage */}
          <div className="relative lg:col-span-6">
            {/* Studio Frame with Apple-grade frosted glass & warm rim */}
            <div
              id={`panel-chapter-${activeScene}`}
              role="tabpanel"
              aria-labelledby={`tab-chapter-${activeScene}`}
              className="relative min-h-[440px] w-full overflow-hidden rounded-2xl border border-white/[0.09] bg-[#131210]/90 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl sm:min-h-[470px] sm:p-6"
            >
              {/* Stage Header: Active Scene Eyebrow + Live Indicator */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D0A243]" />
                  <span className="font-mono-num text-[11px] font-medium uppercase tracking-wider text-[#D0A243]">
                    {currentChapter.eyebrow[locale]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[10.5px] text-[#867F70]">
                    {currentChapter.num} / 04
                  </span>
                  <span className="rounded border border-[#20505D]/50 bg-[#20505D]/20 px-1.5 py-0.5 font-mono-num text-[9.5px] text-[#95B1BA]">
                    60 FPS
                  </span>
                </div>
              </div>

              {/* Dynamic Stage Content Area */}
              <div className="relative mt-4 flex min-h-[350px] flex-col justify-between">
                <AnimatePresence mode="wait">
                  {/* ==============================================================
                      SCENE 01: UX/UI DESIGN (Design System & Auto-Layout)
                      ============================================================== */}
                  {activeScene === 0 ? (
                    <motion.div
                      key="scene-ux-ui"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
                      className="space-y-4"
                    >
                      {/* Grid guidelines preview */}
                      <div className="relative rounded-xl border border-white/[0.08] bg-[#0B0A09]/80 p-4">
                        {/* Spacing rulers and spec chips */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                          <span className="font-mono-num text-[10.5px] text-[#95B1BA]">
                            Auto-Layout Frame
                          </span>
                          <div className="flex items-center gap-1.5 font-mono-num text-[10px]">
                            {(['8px', '16px', '24px'] as const).map((pad, idx) => {
                              const active = s1ActiveBadge === idx;
                              return (
                                <span
                                  key={pad}
                                  className={`rounded px-2 py-0.5 transition-colors ${
                                    active
                                      ? 'border border-[#D0A243]/60 bg-[#D0A243]/20 text-[#D0A243]'
                                      : 'border border-white/[0.08] bg-[#131210] text-[#867F70]'
                                  }`}
                                >
                                  {pad}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive UI Component Preview */}
                        <div className="mt-3.5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-display text-xs font-semibold text-[#EBE4D4]">
                              Token: Midnight Obsidian
                            </span>
                            <span className="font-mono-num text-[10px] text-[#97A78C]">
                              WCAG AAA · 7.8:1
                            </span>
                          </div>

                          {/* Morphing Component Card */}
                          <div className="relative rounded-lg border border-[#20505D]/50 bg-[#131210] p-3 shadow-inner">
                            <div className="space-y-2">
                              <div className="h-2 w-3/5 rounded bg-[#EBE4D4]/80" />
                              <div className="h-1.5 w-full rounded bg-white/10" />
                              <div className="h-1.5 w-4/5 rounded bg-white/10" />
                            </div>

                            {/* Action Button & Cursor simulation */}
                            <div className="mt-3.5 flex items-center justify-between pt-1">
                              <div
                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-display text-[11px] font-medium transition-all duration-200 ${
                                  s1Pressed
                                    ? 'scale-95 bg-[#DEB252] text-[#0B0A09]'
                                    : s1Validated
                                      ? 'bg-[#D0A243] text-[#0B0A09]'
                                      : 'bg-[#D0A243]/90 text-[#0B0A09]'
                                }`}
                              >
                                {s1Validated ? <Check className="h-3 w-3" /> : null}
                                <span>{s1Validated ? 'Validato ✓' : 'Verifica Token'}</span>
                              </div>

                              <span className="font-mono-num text-[10px] text-[#867F70]">
                                pad: 16px · gap: 12px
                              </span>
                            </div>

                            {/* Simulated Mouse Pointer */}
                            {s1CursorIn ? (
                              <motion.div
                                initial={{ x: 180, y: 80, opacity: 0 }}
                                animate={{
                                  x: s1Pressed ? 65 : 70,
                                  y: s1Pressed ? 72 : 68,
                                  opacity: 1,
                                }}
                                transition={{ duration: 0.45, ease: CINEMATIC_EASE }}
                                className="pointer-events-none absolute z-20"
                              >
                                <PointerSvg />
                              </motion.div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* 3 Architecture Pillar Mini-Cards */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <div className="rounded-lg border border-white/[0.07] bg-[#0B0A09]/60 p-2.5">
                          <p className="font-mono-num text-[9.5px] uppercase text-[#867F70]">Superficie</p>
                          <p className="font-display text-xs font-semibold text-[#EBE4D4]">Dark Glass L2</p>
                          <p className="font-mono-num text-[9px] text-[#95B1BA]">blur(24px)</p>
                        </div>
                        <div className="rounded-lg border border-white/[0.07] bg-[#0B0A09]/60 p-2.5">
                          <p className="font-mono-num text-[9.5px] uppercase text-[#867F70]">Gerarchia</p>
                          <p className="font-display text-xs font-semibold text-[#EBE4D4]">Inter Display</p>
                          <p className="font-mono-num text-[9px] text-[#D0A243]">-0.04em</p>
                        </div>
                        <div className="rounded-lg border border-white/[0.07] bg-[#0B0A09]/60 p-2.5">
                          <p className="font-mono-num text-[9.5px] uppercase text-[#867F70]">Fisica</p>
                          <p className="font-display text-xs font-semibold text-[#EBE4D4]">Spring Bezier</p>
                          <p className="font-mono-num text-[9px] text-[#97A78C]">60 FPS</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}

                  {/* ==============================================================
                      SCENE 02: USER RESEARCH (Double Diamond & HCI Telemetry)
                      ============================================================== */}
                  {activeScene === 1 ? (
                    <motion.div
                      key="scene-research"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
                      className="space-y-4"
                    >
                      {/* Double Diamond Tracer SVG */}
                      <div className="rounded-xl border border-white/[0.08] bg-[#0B0A09]/80 p-4">
                        <div className="flex items-center justify-between pb-2">
                          <span className="font-mono-num text-[10.5px] uppercase tracking-wider text-[#95B1BA]">
                            Double Diamond Framework
                          </span>
                          <span className="font-mono-num text-[10px] text-[#D0A243]">
                            Fase: Deliver
                          </span>
                        </div>

                        <svg viewBox="0 0 360 110" className="h-auto w-full py-1" role="img" aria-label="Double diamond process">
                          <defs>
                            <linearGradient id="heroDdGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#20505D" />
                              <stop offset="50%" stopColor="#95B1BA" />
                              <stop offset="100%" stopColor="#D0A243" />
                            </linearGradient>
                          </defs>

                          {/* Base Guideline */}
                          <path
                            d="M24 55 L102 18 L180 55 L102 92 Z M180 55 L258 18 L336 55 L258 92 Z"
                            fill="none"
                            stroke="rgba(149, 177, 186, 0.15)"
                            strokeWidth="1.2"
                            strokeDasharray="3 4"
                          />

                          {/* Active Animated Tracer */}
                          <path
                            d="M24 55 L102 18 L180 55 L258 18 L336 55"
                            fill="none"
                            stroke="url(#heroDdGrad)"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray={ddLen}
                            strokeDashoffset={ddOffset}
                          />

                          {/* Phase Nodes */}
                          {DD_NODES.map((node, i) => {
                            const reached = ddDraw >= i / 4;
                            return (
                              <g key={node.x}>
                                {node.label ? (
                                  <text
                                    x={node.x + (i === 0 ? 14 : 0)}
                                    y={10}
                                    textAnchor="middle"
                                    fill={reached ? '#EBE4D4' : '#867F70'}
                                    fontSize="9.5"
                                    fontFamily="JetBrains Mono, monospace"
                                  >
                                    {node.label}
                                  </text>
                                ) : null}
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r={reached ? 4.5 : 3}
                                  fill={reached ? '#D0A243' : '#1A1815'}
                                  stroke={reached ? '#D0A243' : 'rgba(235, 228, 212, 0.25)'}
                                  strokeWidth="1.5"
                                />
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* Live Telemetry & 4 Research Methods */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="rounded-xl border border-[#20505D]/50 bg-[#20505D]/15 p-3">
                          <p className="font-mono-num text-[10px] text-[#95B1BA]">Usabilità Validata</p>
                          <p className="mt-0.5 font-display text-xl font-semibold text-[#EBE4D4]">
                            {s2TaskSuccess}%
                          </p>
                          <p className="font-mono-num text-[9.5px] text-[#97A78C]">
                            Frizione cognitiva -64%
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.08] bg-[#0B0A09]/80 p-3">
                          <p className="font-mono-num text-[10px] text-[#867F70]">Metodologia HCI</p>
                          <p className="mt-0.5 font-display text-sm font-semibold text-[#EBE4D4]">
                            DiPSCo Univ. Trento
                          </p>
                          <p className="font-mono-num text-[9.5px] text-[#D0A243]">
                            Interviste & Euristiche
                          </p>
                        </div>
                      </div>

                      {/* 4 sequential steps */}
                      <div className="grid grid-cols-4 gap-1.5 pt-0.5 font-mono-num text-[9.5px]">
                        {[
                          { num: '01', name: 'Interviste' },
                          { num: '02', name: 'Mappatura' },
                          { num: '03', name: 'Euristiche' },
                          { num: '04', name: 'Test Usabilità' },
                        ].map((m) => (
                          <div
                            key={m.num}
                            className="rounded border border-white/[0.06] bg-[#0B0A09]/40 p-1.5 text-center"
                          >
                            <span className="text-[#D0A243]">{m.num}</span>{' '}
                            <span className="text-[#BDB6AD]">{m.name}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}

                  {/* ==============================================================
                      SCENE 03: CREATIVE AI (Generative Pipeline & Studio Concept)
                      ============================================================== */}
                  {activeScene === 2 ? (
                    <motion.div
                      key="scene-ai"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
                      className="space-y-4"
                    >
                      {/* Simulated Prompt Command Bar */}
                      <div className="rounded-xl border border-[#D0A243]/35 bg-[#0B0A09]/90 p-3.5 shadow-lg">
                        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 text-[10.5px] font-mono-num text-[#D0A243]">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>AI Prompt & Generative Direction</span>
                        </div>
                        <div className="mt-2.5 flex min-h-[44px] items-center rounded-lg border border-white/[0.08] bg-[#131210] px-3 font-mono-num text-xs text-[#EBE4D4]">
                          <span className="mr-1 text-[#D0A243]">›</span>
                          <span className="line-clamp-2">{aiTyped}</span>
                          <span className="inline-block h-4 w-1.5 animate-pulse bg-[#D0A243] ml-1" />
                        </div>
                      </div>

                      {/* Generative Synthesis Cascade */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="rounded-xl border border-white/[0.08] bg-[#0B0A09]/80 p-3">
                          <p className="font-mono-num text-[10px] text-[#867F70]">01. Concept</p>
                          <p className="mt-1 font-display text-xs font-semibold text-[#EBE4D4]">
                            Layout Dark Glass
                          </p>
                          <p className="font-mono-num text-[9.5px] text-[#D0A243]">
                            {aiGenerativeReady ? 'Generato ✓' : 'In elaborazione...'}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.08] bg-[#0B0A09]/80 p-3">
                          <p className="font-mono-num text-[10px] text-[#867F70]">02. Asset</p>
                          <p className="mt-1 font-display text-xs font-semibold text-[#EBE4D4]">
                            Vettori & Icone
                          </p>
                          <p className="font-mono-num text-[9.5px] text-[#95B1BA]">
                            SVG Ottimizzati
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.08] bg-[#0B0A09]/80 p-3">
                          <p className="font-mono-num text-[10px] text-[#867F70]">03. Motion</p>
                          <p className="mt-1 font-display text-xs font-semibold text-[#EBE4D4]">
                            Spring Curves
                          </p>
                          <p className="font-mono-num text-[9.5px] text-[#97A78C]">
                            60 FPS Physics
                          </p>
                        </div>
                      </div>

                      {/* Generative Neural Waveform */}
                      <div className="rounded-xl border border-white/[0.07] bg-[#0B0A09]/70 p-3">
                        <div className="flex items-center justify-between pb-1 font-mono-num text-[10px] text-[#867F70]">
                          <span>Segnale di sintesi neurale</span>
                          <span className="text-[#D0A243]">Temperatura 0.2</span>
                        </div>
                        <svg viewBox="0 0 320 40" className="h-8 w-full" aria-hidden="true">
                          <path
                            d="M0 20 Q40 5, 80 20 T160 20 T240 20 T320 20"
                            fill="none"
                            stroke="#D0A243"
                            strokeWidth="1.8"
                            strokeOpacity="0.8"
                          />
                          <path
                            d="M0 20 Q40 32, 80 20 T160 20 T240 20 T320 20"
                            fill="none"
                            stroke="#20505D"
                            strokeWidth="1.4"
                            strokeDasharray="4 4"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  ) : null}

                  {/* ==============================================================
                      SCENE 04: FRONT-END & MOTION (VoltRep Ticker & 60 FPS)
                      ============================================================== */}
                  {activeScene === 3 ? (
                    <motion.div
                      key="scene-frontend"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
                      className="space-y-4"
                    >
                      {/* VoltRep Live Workout Set Ticker */}
                      <div className="rounded-xl border border-white/[0.08] bg-[#0B0A09]/80 p-4">
                        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#D0A243]" />
                            <span className="font-mono-num text-[11px] font-semibold text-[#EBE4D4]">
                              VoltRep · Live Workout Telemetry
                            </span>
                          </div>
                          <span className="font-mono-num text-[10px] text-[#97A78C]">
                            Serie 3/5 · RPE 8.5
                          </span>
                        </div>

                        {/* Interactive Sets List */}
                        <div className="mt-3 space-y-2 font-mono-num text-xs">
                          {VOLTREP_SETS.slice(0, s4LoggedSets).map((set, idx) => (
                            <div
                              key={set.id}
                              className={`flex items-center justify-between rounded-lg border px-3 py-1.5 transition-all duration-300 ${
                                idx === s4LoggedSets - 1
                                  ? 'border-[#D0A243]/50 bg-[#D0A243]/15 text-[#EBE4D4]'
                                  : 'border-white/[0.05] bg-[#131210]/60 text-[#BDB6AD]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] text-[#867F70]">{set.id}</span>
                                <span className="font-semibold">{set.reps}</span>
                              </div>
                              <span
                                className={`text-[10px] ${
                                  idx === s4LoggedSets - 1 ? 'text-[#D0A243]' : 'text-[#867F70]'
                                }`}
                              >
                                {set.tag}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 60 FPS Telemetry + Harmonic Frequency Curve */}
                      <div className="grid grid-cols-12 items-center gap-3">
                        <div className="col-span-4 rounded-xl border border-[#20505D]/50 bg-[#20505D]/15 p-3">
                          <p className="font-mono-num text-[9.5px] uppercase text-[#95B1BA]">
                            Frame Budget
                          </p>
                          <p className="font-mono-num text-lg font-bold text-[#EBE4D4]">
                            0.4 <span className="text-xs font-normal text-[#867F70]">/ 16.6ms</span>
                          </p>
                          <p className="font-mono-num text-[9.5px] text-[#97A78C]">
                            Zero Dropped Frames
                          </p>
                        </div>

                        <div className="col-span-8 rounded-xl border border-white/[0.08] bg-[#0B0A09]/80 p-3">
                          <div className="flex items-center justify-between pb-1 font-mono-num text-[10px] text-[#867F70]">
                            <span>Harmonic Motion Curve</span>
                            <span className="text-[#D0A243]">60 FPS</span>
                          </div>
                          <svg viewBox="0 0 280 36" className="h-7 w-full overflow-visible" aria-hidden="true">
                            <path
                              d={s4WavePath}
                              fill="none"
                              stroke="#95B1BA"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Stage Footer: Summary Caption */}
              <div className="mt-4 border-t border-white/[0.07] pt-3 text-xs text-[#BDB6AD]">
                <p className="font-body leading-relaxed">{currentChapter.summary[locale]}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet 3-Column Positioning Strip */}
        <dl className="mt-14 grid grid-cols-1 gap-6 border-t border-white/[0.08] pt-8 sm:grid-cols-3">
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
