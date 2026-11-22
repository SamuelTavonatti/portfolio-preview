import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDownRight, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SHOWREEL_BEATS, UI_COPY } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';

const CINEMATIC_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SLIDE_DURATION_MS = 6000;

interface PhaseTypography {
  lead: string;
  accent: string;
}

const PHASE_WORDS: PhaseTypography[] = [
  { lead: 'Samuel', accent: 'Tavonatti' },
  { lead: 'UX UI', accent: 'Designer' },
  { lead: 'UX', accent: 'Research' },
  { lead: 'AI', accent: 'Creative' },
  { lead: 'Web', accent: 'Developer' },
];

// Double Diamond SVG coordinates for UX Research visual (viewBox 0 0 360 112)
const DIAMOND_NODES = [
  { x: 24, y: 62, label: 'Discover' },
  { x: 102, y: 24, label: 'Define' },
  { x: 180, y: 62, label: 'Develop' },
  { x: 258, y: 24, label: 'Deliver' },
  { x: 336, y: 62, label: '' },
];

const DEV_CODE_LINES = [
  { num: '01', text: 'export function Interface() {', tone: 'cobalt' as const },
  { num: '02', text: '  const warmth = "#E8A866";', tone: 'warm' as const },
  { num: '03', text: '  return <Layout a11y="AA" fps={60} />;', tone: 'plain' as const },
  { num: '04', text: '}', tone: 'cobalt' as const },
];

export function HeroShowreel() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeBeat, setActiveBeat] = useState<number>(0);
  const [progress, setProgress] = useState<number>(() => (prefersReducedMotion ? 1 : 0));
  const [isInView, setIsInView] = useState<boolean>(true);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);

  const elapsedRef = useRef<number>(0);
  const lastFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(1);
    }
  }, [prefersReducedMotion]);

  // Pause automatically when scrolled out of viewport
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.18 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Pause automatically when browser tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const shouldAnimate = isInView && isTabVisible && !prefersReducedMotion;

  // Single master 6-second RAF clock synchronizing BOTH left text showreel & right visual showreel
  useEffect(() => {
    if (!shouldAnimate) {
      lastFrameRef.current = null;
      return;
    }

    let rafId = 0;

    const tick = (now: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = now;
      }
      const delta = Math.min(now - lastFrameRef.current, 100);
      lastFrameRef.current = now;
      elapsedRef.current += delta;

      const nextProgress = Math.min(elapsedRef.current / SLIDE_DURATION_MS, 1);
      setProgress(nextProgress);

      if (elapsedRef.current >= SLIDE_DURATION_MS) {
        elapsedRef.current = 0;
        lastFrameRef.current = null;
        setProgress(0);
        setActiveBeat((prev) => (prev + 1) % SHOWREEL_BEATS.length);
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      lastFrameRef.current = null;
    };
  }, [shouldAnimate, activeBeat]);

  const currentBeat = SHOWREEL_BEATS[activeBeat];
  const currentWords = PHASE_WORDS[activeBeat];
  const effectiveProgress = prefersReducedMotion ? 1 : progress;

  // Synchronized sub-animation curves for the right-hand method visuals
  const compassTrace = Math.min(1, effectiveProgress * 1.45);
  const researchTrace = Math.min(1, effectiveProgress / 0.76);
  const diamondTotalLen = 352;
  const diamondOffset = Math.max(0, diamondTotalLen * (1 - researchTrace));
  const aiWaveProgress = Math.min(1, effectiveProgress * 1.38);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={UI_COPY.showreel.ariaLabel[locale]}
      className="mt-8 grid grid-cols-1 items-center gap-12 sm:mt-10 lg:mt-14 lg:grid-cols-12 lg:gap-14"
    >
      {/* LEFT COLUMN: Morphing Text Showreel + Hero CTAs */}
      <div className="flex flex-col justify-between space-y-9 lg:col-span-6 lg:py-4">
        <div className="min-h-[196px] flex flex-col justify-center sm:min-h-[224px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${currentBeat.id}-${locale}`}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: 20, filter: 'blur(6px)' }
              }
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, y: -18, filter: 'blur(6px)' }
              }
              transition={{ duration: 0.95, ease: CINEMATIC_EASE }}
              className="space-y-5"
            >
              <h1
                id="hero-heading"
                className="font-display text-[clamp(2.45rem,5vw,4rem)] font-semibold leading-[1.04] tracking-tight text-[#F3F5F8]"
              >
                <span>{currentWords.lead} </span>
                <span className="text-[var(--accent-warm)]">{currentWords.accent}</span>
              </h1>

              <p className="max-w-[46ch] text-[16px] leading-[1.7] text-[#B8C2CF] sm:text-[18px]">
                {currentBeat.caption[locale]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Clean Primary Hero Actions */}
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a
            href="#progetti"
            className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 font-display text-sm font-semibold text-white shadow-[0_4px_16px_rgba(37,99,235,0.28)] transition-[background-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-[0_8px_24px_rgba(37,99,235,0.38)] active:translate-y-0 active:scale-[0.98] whitespace-nowrap sm:w-auto"
          >
            <span>{UI_COPY.hero.primaryCta[locale]}</span>
            <ArrowDownRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </a>

          <a
            href="#contatti"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-white/15 bg-[#151921] px-6 font-display text-sm font-semibold text-[#F3F5F8] transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[var(--accent-warm-border)] hover:bg-[#1C222D] hover:text-[var(--accent-warm-hover)] hover:shadow-[0_8px_24px_rgba(232,168,102,0.12)] active:translate-y-0 active:scale-[0.98] whitespace-nowrap sm:w-auto"
          >
            {UI_COPY.hero.secondaryCta[locale]}
          </a>
        </div>
      </div>

      {/* RIGHT COLUMN: Synchronized Visual Discipline & Method Showreel (Chromeless, Floating in Space) */}
      <div className="relative flex min-h-[300px] items-center justify-center sm:min-h-[340px] lg:col-span-6">
        {/* Soft ambient warm & cobalt aura behind the floating visual */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 rounded-full blur-3xl opacity-75"
          style={{
            background:
              activeBeat === 0 || activeBeat === 3
                ? 'radial-gradient(ellipse 65% 58% at 62% 40%, rgba(232, 168, 102, 0.14), transparent 72%), radial-gradient(ellipse 56% 52% at 32% 68%, rgba(79, 139, 255, 0.12), transparent 72%)'
                : 'radial-gradient(ellipse 66% 56% at 35% 40%, rgba(79, 139, 255, 0.14), transparent 70%), radial-gradient(ellipse 56% 50% at 72% 66%, rgba(232, 168, 102, 0.12), transparent 72%)',
          }}
        />

        <div className="relative z-10 w-full">
          <AnimatePresence mode="wait">
            {/* SYNC 01 — SAMUEL TAVONATTI: Multidisciplinary Identity Compass */}
            {activeBeat === 0 ? (
              <motion.div
                key={`right-identity-${locale}`}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 18, scale: 0.98, filter: 'blur(6px)' }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: -16, scale: 0.98, filter: 'blur(6px)' }
                }
                transition={{ duration: 0.95, ease: CINEMATIC_EASE }}
                className="flex flex-col items-center justify-center py-2"
              >
                <svg
                  viewBox="0 0 420 270"
                  className="h-auto w-full max-w-[440px]"
                  role="img"
                  aria-label={
                    locale === 'it'
                      ? 'Mappa visiva delle quattro discipline: UX UI, Research, AI Creative, Web Dev'
                      : 'Visual discipline map: UX UI, Research, AI Creative, Web Dev'
                  }
                >
                  <defs>
                    <linearGradient id="compassRing" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F8BFF" stopOpacity="0.8" />
                      <stop offset="55%" stopColor="#E8A866" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#4F8BFF" stopOpacity="0.45" />
                    </linearGradient>
                  </defs>

                  {/* Subtle axes */}
                  <line
                    x1="210"
                    y1="26"
                    x2="210"
                    y2="244"
                    stroke="rgba(226,232,240,0.08)"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                  />
                  <line
                    x1="56"
                    y1="135"
                    x2="364"
                    y2="135"
                    stroke="rgba(226,232,240,0.08)"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                  />

                  {/* Concentric orbits */}
                  <circle
                    cx="210"
                    cy="135"
                    r="94"
                    fill="none"
                    stroke="rgba(147,197,253,0.14)"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                  />
                  <motion.circle
                    cx="210"
                    cy="135"
                    r="62"
                    fill="none"
                    stroke="url(#compassRing)"
                    strokeWidth="1.6"
                    initial={prefersReducedMotion ? false : { pathLength: 0 }}
                    animate={{ pathLength: compassTrace }}
                    transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
                  />

                  {/* Center Core Mark */}
                  <circle cx="210" cy="135" r="22" fill="#131926" stroke="#E8A866" strokeWidth="1.2" />
                  <text
                    x="210"
                    y="140"
                    textAnchor="middle"
                    fill="#F3F5F8"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="Inter, sans-serif"
                    letterSpacing="-0.02em"
                  >
                    ST
                  </text>

                  {/* 4 Discipline Orbit Nodes */}
                  {[
                    { x: 210, y: 41, label: 'UX UI Design', warm: false, dx: 0, dy: -14 },
                    { x: 304, y: 135, label: 'UX Research', warm: true, dx: 14, dy: 4, anchor: 'start' as const },
                    { x: 210, y: 229, label: 'Web Dev', warm: false, dx: 0, dy: 20 },
                    { x: 116, y: 135, label: 'AI Creative', warm: true, dx: -14, dy: 4, anchor: 'end' as const },
                  ].map((node, i) => {
                    const active = effectiveProgress >= i * 0.16 + 0.08;
                    return (
                      <g key={node.label}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={active ? 9 : 5}
                          fill={node.warm ? 'rgba(232,168,102,0.16)' : 'rgba(79,139,255,0.16)'}
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={active ? 4 : 2.5}
                          fill={node.warm ? '#E8A866' : '#4F8BFF'}
                        />
                        <text
                          x={node.x + node.dx}
                          y={node.y + node.dy}
                          textAnchor={node.anchor ?? 'middle'}
                          fill={active ? '#F3F5F8' : '#8E9CAD'}
                          fontSize="11"
                          fontWeight="500"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </motion.div>
            ) : null}

            {/* SYNC 02 — UX UI DESIGNER: Live Design System, Auto-Layout & Token Anatomy */}
            {activeBeat === 1 ? (
              <motion.div
                key={`right-design-${locale}`}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 18, scale: 0.98, filter: 'blur(6px)' }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: -16, scale: 0.98, filter: 'blur(6px)' }
                }
                transition={{ duration: 0.95, ease: CINEMATIC_EASE }}
                className="space-y-5 rounded-[22px] border border-white/[0.09] bg-[#111622]/70 p-6 backdrop-blur-lg"
              >
                {/* Artboard Specification Header */}
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
                  <span className="font-mono-num text-[11px] uppercase tracking-wider text-[var(--accent-warm)]">
                    {locale === 'it' ? 'Design System · Auto-Layout' : 'Design System · Auto-Layout'}
                  </span>
                  <span className="font-mono-num text-[11px] tracking-wider text-[#8E9CAD]">
                    8px · WCAG AA
                  </span>
                </div>

                {/* Live Component Anatomy + Spacing Rulers */}
                <div className="grid grid-cols-12 gap-3.5">
                  {/* Typographic Scale & Swatches */}
                  <div className="col-span-5 flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0D121D]/90 p-3.5">
                    <div>
                      <p className="font-display text-3xl font-semibold tracking-tight text-[#F3F5F8]">
                        Aa
                      </p>
                      <p className="mt-1 font-mono-num text-[10px] tracking-wider text-[#8E9CAD]">
                        Inter · Display
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-[#2563EB]" title="#2563EB" />
                      <span className="h-5 w-5 rounded-md bg-[var(--accent-warm)]" title="#E8A866" />
                      <span className="h-5 w-5 rounded-md border border-white/20 bg-[#151921]" title="#151921" />
                    </div>
                  </div>

                  {/* Interactive UI Card Wireframe Morphing into Fidelity */}
                  <div className="col-span-7 space-y-3 rounded-xl border border-[#4F8BFF]/25 bg-[#0D121D]/90 p-3.5">
                    <div className="flex items-center justify-between font-mono-num text-[10px] text-[#93C5FD]">
                      <span>pad: 16px</span>
                      <span className="text-[var(--accent-warm)]">gap: 12px</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2.5 w-3/4 rounded-full bg-[#F3F5F8]/80" />
                      <div className="h-2 w-full rounded-full bg-white/15" />
                      <div className="h-2 w-5/6 rounded-full bg-white/10" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-7 w-24 rounded-lg bg-[#2563EB]/90" />
                      <span
                        className={`inline-flex items-center gap-1 font-mono-num text-[10px] transition-colors duration-500 ${
                          effectiveProgress >= 0.55 ? 'text-[var(--accent-warm)]' : 'text-[#8E9CAD]'
                        }`}
                      >
                        <Check className="h-3 w-3" aria-hidden="true" />
                        <span>AA 7.2:1</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Method Tags Line (Unboxed, Zero Pills) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono-num text-[11px] text-[#B8C2CF]">
                  <span>Wireframe → High-Fi</span>
                  <span className="text-[var(--accent-warm)]">Figma · Tokens · Motion</span>
                </div>
              </motion.div>
            ) : null}

            {/* SYNC 03 — UX RESEARCH: Double Diamond + User Research Methods Matrix */}
            {activeBeat === 2 ? (
              <motion.div
                key={`right-research-${locale}`}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 18, scale: 0.98, filter: 'blur(6px)' }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: -16, scale: 0.98, filter: 'blur(6px)' }
                }
                transition={{ duration: 0.95, ease: CINEMATIC_EASE }}
                className="space-y-4 rounded-[22px] border border-white/[0.09] bg-[#111622]/70 p-6 backdrop-blur-lg"
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                  <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#93C5FD]">
                    {locale === 'it' ? 'Metodi UX Research · Double Diamond' : 'UX Research Methods · Double Diamond'}
                  </span>
                  <span className="font-mono-num text-[11px] tracking-wider text-[var(--accent-warm)]">
                    HCI
                  </span>
                </div>

                {/* Live Double Diamond SVG Trace */}
                <svg
                  viewBox="0 0 360 108"
                  className="h-auto w-full"
                  role="img"
                  aria-label="Double Diamond UX Research process: Discover, Define, Develop, Deliver"
                >
                  <defs>
                    <linearGradient id="syncResearchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F8BFF" />
                      <stop offset="56%" stopColor="#93C5FD" />
                      <stop offset="100%" stopColor="#E8A866" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M24 62 L102 24 L180 62 L102 96 Z M180 62 L258 24 L336 62 L258 96 Z"
                    fill="none"
                    stroke="rgba(147,197,253,0.16)"
                    strokeWidth="1.25"
                    strokeDasharray="3 4"
                  />
                  <path
                    d="M24 62 L102 24 L180 62 L258 24 L336 62"
                    fill="none"
                    stroke="url(#syncResearchGrad)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={diamondTotalLen}
                    strokeDashoffset={diamondOffset}
                  />
                  {DIAMOND_NODES.map((node, i) => {
                    const reached = researchTrace >= i / 4;
                    const isWarm = i === 2 || i === 4;
                    return (
                      <g key={`${node.x}-${node.y}`}>
                        {node.label ? (
                          <text
                            x={node.x + (i === 0 ? 18 : 0)}
                            y={13}
                            textAnchor="middle"
                            fill={reached ? '#F3F5F8' : '#8E9CAD'}
                            fontSize="9.5"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {node.label}
                          </text>
                        ) : null}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={reached ? 4.8 : 3.2}
                          fill={reached ? (isWarm ? '#E8A866' : '#93C5FD') : '#1C222D'}
                          stroke={reached ? (isWarm ? '#E8A866' : '#4F8BFF') : 'rgba(226,232,240,0.35)'}
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Sequential User Research Methods Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {[
                    {
                      step: '01',
                      name: locale === 'it' ? 'Interviste Utenti' : 'User Interviews',
                      threshold: 0.12,
                    },
                    {
                      step: '02',
                      name: locale === 'it' ? 'Mappatura Flussi' : 'Journey Mapping',
                      threshold: 0.34,
                    },
                    {
                      step: '03',
                      name: locale === 'it' ? 'Valutazione Euristica' : 'Heuristic Audit',
                      threshold: 0.54,
                    },
                    {
                      step: '04',
                      name: locale === 'it' ? 'Test di Usabilità' : 'Usability Testing',
                      threshold: 0.72,
                    },
                  ].map((method) => {
                    const active = effectiveProgress >= method.threshold;
                    return (
                      <div
                        key={method.step}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors duration-500 ${
                          active
                            ? 'border-[var(--accent-warm-border)] bg-[#0D121D]/90 text-[#F3F5F8]'
                            : 'border-white/[0.07] bg-[#0D121D]/45 text-[#8E9CAD]'
                        }`}
                      >
                        <span
                          className={`font-mono-num text-[10px] ${
                            active ? 'text-[var(--accent-warm)]' : 'text-[#8E9CAD]'
                          }`}
                        >
                          {method.step}
                        </span>
                        <span className="font-display text-xs font-medium">{method.name}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}

            {/* SYNC 04 — AI CREATIVE: Generative Synthesis Waves & Creative Direction Frames */}
            {activeBeat === 3 ? (
              <motion.div
                key={`right-ai-${locale}`}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 18, scale: 0.98, filter: 'blur(6px)' }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: -16, scale: 0.98, filter: 'blur(6px)' }
                }
                transition={{ duration: 0.95, ease: CINEMATIC_EASE }}
                className="space-y-4 rounded-[22px] border border-white/[0.09] bg-[#111622]/70 p-6 backdrop-blur-lg"
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                  <span className="font-mono-num text-[11px] uppercase tracking-wider text-[var(--accent-warm)]">
                    {locale === 'it' ? 'Sintesi Generativa · Art Direction' : 'Generative Synthesis · Art Direction'}
                  </span>
                  <span className="font-mono-num text-[11px] tracking-wider text-[#93C5FD]">
                    AI Studio
                  </span>
                </div>

                {/* Generative Neural Signal Flow */}
                <div className="rounded-xl border border-white/[0.07] bg-[#0D121D]/90 px-3 py-2.5">
                  <svg viewBox="0 0 360 88" className="h-auto w-full" aria-hidden="true">
                    <defs>
                      <linearGradient id="syncAiWave" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F8BFF" />
                        <stop offset="52%" stopColor="#E8A866" />
                        <stop offset="100%" stopColor="#F3BE86" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M12 52 C74 14, 132 82, 184 44 C236 6, 294 76, 348 34"
                      fill="none"
                      stroke="url(#syncAiWave)"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      initial={prefersReducedMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: aiWaveProgress }}
                      transition={{ duration: 0.85, ease: CINEMATIC_EASE }}
                    />
                    <motion.path
                      d="M12 36 C82 78, 140 12, 192 48 C244 82, 298 18, 348 52"
                      fill="none"
                      stroke="rgba(79,139,255,0.42)"
                      strokeWidth="1.4"
                      strokeDasharray="4 4"
                      initial={prefersReducedMotion ? false : { pathLength: 0 }}
                      animate={{ pathLength: Math.min(1, aiWaveProgress * 0.94) }}
                      transition={{ duration: 0.85, ease: CINEMATIC_EASE }}
                    />
                    {[
                      { cx: 56, cy: 40, warm: false },
                      { cx: 184, cy: 44, warm: true },
                      { cx: 306, cy: 42, warm: true },
                    ].map((pt, idx) => {
                      const active = effectiveProgress >= idx * 0.22 + 0.1;
                      return (
                        <g key={pt.cx}>
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r={active ? 10 : 5}
                            fill={pt.warm ? 'rgba(232,168,102,0.16)' : 'rgba(79,139,255,0.16)'}
                          />
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r={active ? 4.2 : 2.6}
                            fill={pt.warm ? '#E8A866' : '#4F8BFF'}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* 3 Generative Visual Pipeline Stages */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      title: 'Prompt',
                      sub: locale === 'it' ? 'Direzione' : 'Direction',
                      threshold: 0.15,
                    },
                    {
                      title: 'Concept',
                      sub: locale === 'it' ? 'Variazioni' : 'Iterations',
                      threshold: 0.42,
                    },
                    {
                      title: 'Motion',
                      sub: locale === 'it' ? 'Prototipo' : 'Prototype',
                      threshold: 0.66,
                    },
                  ].map((stage) => {
                    const active = effectiveProgress >= stage.threshold;
                    return (
                      <div
                        key={stage.title}
                        className={`rounded-xl border p-3 transition-colors duration-500 ${
                          active
                            ? 'border-[var(--accent-warm-border)] bg-[#0D121D]/90'
                            : 'border-white/[0.07] bg-[#0D121D]/45'
                        }`}
                      >
                        <p
                          className={`font-display text-xs font-semibold ${
                            active ? 'text-[#F3F5F8]' : 'text-[#8E9CAD]'
                          }`}
                        >
                          {stage.title}
                        </p>
                        <p className="mt-1 font-mono-num text-[10px] text-[var(--accent-warm)]">
                          {stage.sub}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}

            {/* SYNC 05 — WEB DEVELOPER: Live Code-to-DOM Architecture */}
            {activeBeat === 4 ? (
              <motion.div
                key={`right-dev-${locale}`}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 18, scale: 0.98, filter: 'blur(6px)' }
                }
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={
                  prefersReducedMotion
                    ? undefined
                    : { opacity: 0, y: -16, scale: 0.98, filter: 'blur(6px)' }
                }
                transition={{ duration: 0.95, ease: CINEMATIC_EASE }}
                className="space-y-4 rounded-[22px] border border-white/[0.09] bg-[#111622]/70 p-6 backdrop-blur-lg"
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                  <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#93C5FD]">
                    {locale === 'it' ? 'Architettura Front-end · React & TS' : 'Front-end Architecture · React & TS'}
                  </span>
                  <span className="font-mono-num text-[11px] tracking-wider text-[#34D399]">
                    60 FPS
                  </span>
                </div>

                {/* Live TypeScript Syntax Reveal */}
                <div className="space-y-2 rounded-xl border border-white/[0.07] bg-[#0B101A]/95 p-4 font-mono-num text-xs">
                  {DEV_CODE_LINES.map((line, idx) => {
                    const revealed = prefersReducedMotion || effectiveProgress >= idx * 0.16;
                    return (
                      <div
                        key={line.num}
                        className={`flex items-baseline gap-3 transition-opacity duration-500 ${
                          revealed ? 'opacity-100' : 'opacity-20'
                        }`}
                      >
                        <span className="select-none text-[#8E9CAD]/55">{line.num}</span>
                        <span
                          className={
                            line.tone === 'warm'
                              ? 'text-[var(--accent-warm)]'
                              : line.tone === 'cobalt'
                                ? 'text-[#93C5FD]'
                                : 'text-[#E4E9F0]'
                          }
                        >
                          {line.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Live DOM Output Telemetry Row */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { k: 'TypeScript', v: 'Strict', threshold: 0.24 },
                    { k: 'Accessibilità', v: 'WCAG AA', threshold: 0.48 },
                    { k: 'Build', v: locale === 'it' ? 'Verificata' : 'Verified', threshold: 0.68 },
                  ].map((metric) => {
                    const active = effectiveProgress >= metric.threshold;
                    return (
                      <div
                        key={metric.k}
                        className={`rounded-xl border px-3 py-2.5 transition-colors duration-500 ${
                          active
                            ? 'border-[#4F8BFF]/35 bg-[#0D121D]/90'
                            : 'border-white/[0.07] bg-[#0D121D]/45'
                        }`}
                      >
                        <p className="font-mono-num text-[10px] text-[#8E9CAD]">{metric.k}</p>
                        <p
                          className={`mt-0.5 font-display text-xs font-semibold ${
                            active ? 'text-[#F3F5F8]' : 'text-[#8E9CAD]'
                          }`}
                        >
                          {metric.v}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
