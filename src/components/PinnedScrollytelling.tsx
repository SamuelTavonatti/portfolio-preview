import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Layers, Plus, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

const EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';
const AI_PROMPT = 'Architect dark glass UI with zero-cost telemetry...';

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function rangeProgress(p: number, start: number, end: number) {
  return clamp((p - start) / (end - start), 0, 1);
}

function stageOpacity(p: number, start: number, inEnd: number, outStart: number, end: number) {
  if (p <= start || p >= end) return 0;
  if (p < inEnd) return clamp((p - start) / (inEnd - start));
  if (p > outStart) return clamp((end - p) / (end - outStart));
  return 1;
}

// Double Diamond architectural geometry (upper & lower divergence/convergence paths)
const DD_UPPER = [
  { x: 36, y: 92 },
  { x: 146, y: 24 },
  { x: 256, y: 92 },
  { x: 366, y: 24 },
  { x: 476, y: 92 },
];

const DD_LOWER = [
  { x: 36, y: 92 },
  { x: 146, y: 160 },
  { x: 256, y: 92 },
  { x: 366, y: 160 },
  { x: 476, y: 92 },
];

function samplePath(pts: { x: number; y: number }[], t: number) {
  const c = clamp(t);
  const segs = pts.length - 1;
  const scaled = c * segs;
  const idx = Math.min(segs - 1, Math.floor(scaled));
  const local = scaled - idx;
  const a = pts[idx];
  const b = pts[idx + 1];
  return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
}

const RESEARCH_MILESTONES = [
  {
    id: 'stakeholder',
    label: 'Stakeholder Mapping',
    phase: 'DISCOVER → DEFINE',
    metric: '14 interviews',
    peak: 0.25,
  },
  {
    id: 'constraints',
    label: 'Non-Negotiable Constraints',
    phase: 'DEFINE GATE',
    metric: '3 core gates',
    peak: 0.5,
  },
  {
    id: 'journey',
    label: 'User Journey Map',
    phase: 'DEVELOP → DELIVER',
    metric: '92% task fit',
    peak: 0.78,
  },
];

const ENGINEER_LINES = [
  { num: '01', code: '<GlassShell radius={24} blur="24px">', color: '#93C5FD', threshold: 0.08 },
  { num: '02', code: '  <Header title="VoltRep" fps={60} />', color: '#E2E8F0', threshold: 0.24 },
  { num: '03', code: '  <MetricGrid tokens={[8, 16, 24]} />', color: '#F59E0B', threshold: 0.44 },
  { num: '04', code: '  <ActionBar accent="#F59E0B" />', color: '#34D399', threshold: 0.64 },
  { num: '05', code: '</GlassShell>', color: '#93C5FD', threshold: 0.78 },
];

const STACK_BADGES = ['Vue.js', 'TypeScript', 'Tailwind', 'Firestore'];

type DesignPhase = 0 | 1 | 2;
const DESIGN_PHASES: {
  id: DesignPhase;
  label: string;
  radius: number;
  spacing: string;
  pill: string;
  elevation: string;
}[] = [
  {
    id: 0,
    label: 'GRID',
    radius: 14,
    spacing: '8px',
    pill: '8PT BASELINE',
    elevation: '0 22px 60px rgba(59, 130, 246, 0.22), inset 0 1px 0 rgba(255,255,255,0.09)',
  },
  {
    id: 1,
    label: 'MORPH',
    radius: 22,
    spacing: '16px',
    pill: 'ELEVATION L2',
    elevation: '0 32px 84px rgba(59, 130, 246, 0.30), inset 0 1px 0 rgba(255,255,255,0.12)',
  },
  {
    id: 2,
    label: 'FOCUS',
    radius: 28,
    spacing: '24px',
    pill: 'AMBER ACTIVE',
    elevation: '0 34px 88px rgba(245, 158, 11, 0.26), inset 0 1px 0 rgba(255,255,255,0.12)',
  },
];

export function PinnedScrollytelling() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const runwayRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Unified 60fps clock (in seconds) driving continuous self-playing loops across visible chapters
  const [clockSec, setClockSec] = useState<number>(0);
  const aiEpochRef = useRef<number>(0);

  // Interactive overrides
  const [manualDesignPhase, setManualDesignPhase] = useState<DesignPhase | null>(null);
  const [gridSnap, setGridSnap] = useState<boolean>(true);
  const [lockedResearchId, setLockedResearchId] = useState<string | null>(null);

  // Scroll-scrubbed 60fps RAF engine mapped to --scroll-progress
  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway) return;

    let rafId = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = runway.getBoundingClientRect();
      const scrollable = Math.max(1, runway.offsetHeight - window.innerHeight);
      const scrolled = clamp(-rect.top / scrollable, 0, 1);
      runway.style.setProperty('--scroll-progress', scrolled.toFixed(4));
      setProgress(scrolled);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Continuous 60fps self-playing choreography clock while inside the kinetic showcase
  const inShowcase = progress >= 0.08 && progress <= 1;
  useEffect(() => {
    if (prefersReducedMotion || !inShowcase) return;
    let rafId = 0;
    const tick = (now: number) => {
      setClockSec(now * 0.001);
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [inShowcase, prefersReducedMotion]);

  const replayAiSequence = useCallback(() => {
    aiEpochRef.current = performance.now() * 0.001;
    setClockSec(aiEpochRef.current + 0.001);
  }, []);

  const scrollToFraction = useCallback(
    (fraction: number) => {
      const runway = runwayRef.current;
      if (!runway) return;
      const top = runway.getBoundingClientRect().top + window.scrollY;
      const scrollable = Math.max(1, runway.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: top + scrollable * fraction,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [prefersReducedMotion]
  );

  /* ==========================================================================
     STAGE PROGRESS MATH (ZERO IRIS APERTURE — 5 SMOOTH PINNED STAGES)
     Hero     (0.00 - 0.17): Volumetric Darkness & SAMUEL TAVONATTI Reveal
     Ch. 01   (0.17 - 0.38): UX / UI DESIGN (Laser Grid + Spatial Component Morph)
     Ch. 02   (0.38 - 0.59): USER RESEARCH (Architectural Double Diamond Flow)
     Ch. 03   (0.59 - 0.80): CREATIVE AI (Google Vids Macro Camera-Tracking Cinema)
     Ch. 04   (0.80 - 1.00): WEB ENGINEERING (Live Code-to-UI + 60fps Telemetry)
     ========================================================================== */
  const heroOpacity = stageOpacity(progress, -0.05, 0.0, 0.12, 0.19);
  const heroT = rangeProgress(progress, 0.0, 0.18);

  const designOpacity = stageOpacity(progress, 0.15, 0.2, 0.34, 0.4);
  const designScrollT = rangeProgress(progress, 0.17, 0.38);

  const researchOpacity = stageOpacity(progress, 0.36, 0.41, 0.55, 0.61);
  const researchScrollT = rangeProgress(progress, 0.38, 0.59);

  const aiOpacity = stageOpacity(progress, 0.57, 0.62, 0.76, 0.82);
  const aiScrollT = rangeProgress(progress, 0.59, 0.8);

  const engOpacity = stageOpacity(progress, 0.78, 0.83, 0.99, 1.06);
  const engScrollT = rangeProgress(progress, 0.8, 1.0);

  /* --------------------------------------------------------------------------
     CHAPTER 01 — UX / UI DESIGN CONTINUOUS MORPH MATH
     -------------------------------------------------------------------------- */
  const designCycle = (clockSec % 8.4) / 8.4; // 0..1 continuous loop
  const autoDesignPhase: DesignPhase =
    designCycle < 0.33 ? 0 : designCycle < 0.67 ? 1 : 2;
  const activeDesignPhase: DesignPhase =
    manualDesignPhase !== null ? manualDesignPhase : autoDesignPhase;
  const designSpec = DESIGN_PHASES[activeDesignPhase];
  const laserDraw = prefersReducedMotion ? 1 : clamp((clockSec % 2.8) / 0.95, 0.25, 1);
  const tokenPulseIndex = Math.floor(clockSec / 1.4) % 3;

  /* --------------------------------------------------------------------------
     CHAPTER 02 — ARCHITECTURAL DOUBLE DIAMOND CONTINUOUS PULSE MATH
     -------------------------------------------------------------------------- */
  const ddPhase = prefersReducedMotion ? 0.78 : (clockSec % 6.8) / 6.8; // 0 -> 1 continuous wave
  const ddTailPhase = clamp(ddPhase - 0.06, 0, 1);
  const ddUpperHead = samplePath(DD_UPPER, ddPhase);
  const ddUpperTail = samplePath(DD_UPPER, ddTailPhase);
  const ddLowerHead = samplePath(DD_LOWER, ddPhase);
  const ddLowerTail = samplePath(DD_LOWER, ddTailPhase);

  /* --------------------------------------------------------------------------
     CHAPTER 03 — CREATIVE AI (GOOGLE VIDS MACRO CAMERA-TRACKING LOOP, 9.6s)
     0.00 - 0.40 : Macro scale(2.1) zoomed on glowing caret, typing word-by-word & panning L->R
     0.40 - 0.50 : Cobalt Blue "+ Design System Tokens" chip snaps into prompt pill
     0.50 - 0.64 : White/Graphite SVG cursor glides onto Amber "Genera →", clicks scale(0.92), concentric ripples fire
     0.64 - 0.74 : Camera smoothly zooms out scale(2.1 -> 1.0)
     0.74 - 1.00 : Modular Skeleton UI cascades in & resolves into crisp wireframe + "UI Generated"
     -------------------------------------------------------------------------- */
  const aiLoopDur = 9.6;
  const aiT = prefersReducedMotion
    ? 0.92
    : (((clockSec - aiEpochRef.current) % aiLoopDur) + aiLoopDur) % aiLoopDur / aiLoopDur;

  const aiTypeT = clamp(aiT / 0.4);
  const aiTypedText = AI_PROMPT.slice(0, Math.round(aiTypeT * AI_PROMPT.length));

  // Virtual camera tracking: stays tightly zoomed at scale(2.1) tracking the caret left-to-right, then eases smoothly out to scale(1)
  const rawZoomOutT = clamp((aiT - 0.64) / 0.12);
  const aiZoomOutT = 1 - Math.pow(1 - rawZoomOutT, 3);
  const aiInMacro = !prefersReducedMotion && aiT < 0.76;
  const aiCameraScale = prefersReducedMotion ? 1 : 2.1 - aiZoomOutT * 1.1;

  // Pan horizontally from +24% (left caret focus) across to -22% (right chip + submit button focus), then smoothly back to 0% on zoom-out
  const macroPanX =
    aiT < 0.4
      ? 24 - aiTypeT * 34
      : aiT < 0.64
        ? -10 - clamp((aiT - 0.4) / 0.14) * 14
        : -24 * (1 - aiZoomOutT);
  const macroPanY = aiInMacro ? 26 * (1 - aiZoomOutT) : 0;

  const aiChipVisible = aiT >= 0.41;
  const aiCursorVisible = !prefersReducedMotion && aiT >= 0.49 && aiT <= 0.69;
  const aiCursorArrived = aiT >= 0.55;
  const aiBtnPress = aiT >= 0.57 && aiT <= 0.625;
  const aiRippleActive = aiT >= 0.575 && aiT <= 0.74;

  const aiRow1 = aiT >= 0.71;
  const aiRow2 = aiT >= 0.77;
  const aiRow3 = aiT >= 0.83;
  const aiResolved = aiT >= 0.89;

  /* --------------------------------------------------------------------------
     CHAPTER 04 — WEB ENGINEERING LIVE CODE-TO-UI & 60FPS TELEMETRY
     -------------------------------------------------------------------------- */
  const engCycle = prefersReducedMotion ? 0.95 : (clockSec % 7.6) / 7.6;
  const engWavePath = (() => {
    const pts: string[] = [];
    const phase = clockSec * 3.1;
    for (let x = 0; x <= 320; x += 8) {
      const y =
        19 +
        Math.sin(x * 0.048 + phase) * 5.8 +
        Math.cos(x * 0.095 - phase * 0.65) * 2.4;
      pts.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  })();

  // Right-edge minimal scrubber stops (Hero + 4 Kinetic Chapters)
  const activeStageIdx =
    progress < 0.17
      ? 0
      : progress < 0.38
        ? 1
        : progress < 0.59
          ? 2
          : progress < 0.8
            ? 3
            : 4;

  const stageStops = [
    { label: '00', name: 'Hero', frac: 0.0 },
    { label: '01', name: 'Design', frac: 0.27 },
    { label: '02', name: 'Research', frac: 0.48 },
    { label: '03', name: 'Creative AI', frac: 0.69 },
    { label: '04', name: 'Engineer', frac: 0.92 },
  ];

  return (
    <div
      ref={runwayRef}
      className="relative h-[560vh] w-full bg-[#07080B] sm:h-[640vh]"
      style={{ ['--scroll-progress' as string]: '0' }}
    >
      {/* Anchor so TopNav "Capitoli / Chapters" lands cleanly inside Chapter 01 (UX/UI Design) */}
      <div
        id="capitoli"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[24%] h-px w-px"
      />

      {/* LOCKED 100SVH STICKY HARDWARE VIEWPORT */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#07080B]">
        {/* Whisper-thin right-edge interactive stage scrub rail (desktop) */}
        <nav
          aria-label={locale === 'it' ? 'Scansione capitoli' : 'Scrollytelling stage scrubber'}
          className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
          style={{
            opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
            pointerEvents: progress > 0.01 && progress < 0.99 ? 'auto' : 'none',
            transition: 'opacity 320ms ease',
          }}
        >
          {stageStops.map((stop, i) => {
            const active = i === activeStageIdx;
            return (
              <button
                key={stop.label}
                type="button"
                onClick={() => scrollToFraction(stop.frac)}
                aria-label={`${stop.label} ${stop.name}`}
                className="group flex h-5 w-5 items-center justify-center"
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: active ? '6px' : '4px',
                    height: active ? '20px' : '4px',
                    backgroundColor: active ? '#F59E0B' : 'rgba(148,163,184,0.35)',
                    boxShadow: active ? '0 0 12px rgba(245,158,11,0.58)' : 'none',
                  }}
                />
              </button>
            );
          })}
        </nav>

        {/* ====================================================================
            STAGE 00 — MONUMENTAL VOLUMETRIC HERO ("SAMUEL TAVONATTI" + ↓)
            ==================================================================== */}
        <section
          aria-labelledby="hero-heading"
          className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center will-change-transform sm:px-8"
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity > 0.2 ? 'auto' : 'none',
            transform: `translate3d(0, ${-heroT * 30}px, 0) scale(${1 + heroT * 0.08})`,
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMin slice"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="vidsBeamCobalt" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
                <stop offset="45%" stopColor="#3B82F6" stopOpacity="0.09" />
                <stop offset="100%" stopColor="#07080B" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="vidsBeamAmber" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.20" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#07080B" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="vidsHorizonRim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                <stop offset="28%" stopColor="#3B82F6" stopOpacity="0.82" />
                <stop offset="50%" stopColor="#F8FAFC" stopOpacity="0.92" />
                <stop offset="72%" stopColor="#F59E0B" stopOpacity="0.82" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
              <filter id="vidsBeamBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="28" />
              </filter>
            </defs>

            <polygon
              points="580,0 860,0 1160,720 720,860 280,720"
              fill="url(#vidsBeamCobalt)"
              filter="url(#vidsBeamBlur)"
            />
            <polygon
              points="640,0 800,0 990,640 720,760 450,640"
              fill="url(#vidsBeamAmber)"
              filter="url(#vidsBeamBlur)"
            />
            <path d="M -80 760 Q 720 560 1520 760 L 1520 920 L -80 920 Z" fill="#0B0D12" />
            <path
              d="M -40 752 Q 720 556 1480 752"
              fill="none"
              stroke="url(#vidsHorizonRim)"
              strokeWidth="2.2"
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center">
            <h1
              id="hero-heading"
              className="titanium-text font-display text-[clamp(3.1rem,8.8vw,8.4rem)] font-semibold uppercase leading-[0.94] tracking-[-0.045em]"
            >
              SAMUEL
              <br />
              TAVONATTI
            </h1>
          </div>

          <button
            type="button"
            onClick={() => scrollToFraction(0.27)}
            aria-label={locale === 'it' ? 'Scorri ai capitoli cinetici' : 'Scroll to kinetic showcase'}
            className="group absolute bottom-10 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#111318]/80 text-[#F3F5F8] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F59E0B]/65 hover:text-[#F59E0B] hover:shadow-[0_0_28px_rgba(245,158,11,0.28)] active:scale-[0.94]"
          >
            <ArrowDown
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1"
              aria-hidden="true"
            />
          </button>
        </section>

        {/* ====================================================================
            CHAPTER 01 — UX / UI DESIGN (KINETIC DESIGN SYSTEM & SPATIAL MORPH)
            ==================================================================== */}
        <section
          aria-hidden={designOpacity < 0.05}
          className="absolute inset-0 flex items-center justify-center px-5 pt-14 sm:px-8"
          style={{
            opacity: designOpacity,
            pointerEvents: designOpacity > 0.3 ? 'auto' : 'none',
          }}
        >
          {/* Z-10: Giant Metallic "DESIGN" Backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none"
            style={{
              transform: `translate3d(${(0.5 - designScrollT) * 40}px, 0, 0) scale(${0.96 + designScrollT * 0.07})`,
            }}
          >
            <span className="titanium-backdrop-word font-display text-[clamp(5.2rem,20vw,15.5rem)] font-bold uppercase leading-none tracking-[-0.055em]">
              DESIGN
            </span>
          </div>

          {/* Z-20: Live Continuously Animated Dark-Glass Design System Showcase */}
          <div className="relative z-20 w-full max-w-[620px]">
            {/* 1px Cobalt Blue Architectural Laser Guides Drawing Across Canvas */}
            <svg
              aria-hidden="true"
              viewBox="0 0 640 420"
              className="pointer-events-none absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]"
              preserveAspectRatio="none"
            >
              {/* Horizontal 1px Cobalt laser guides */}
              <line
                x1="0"
                y1="24"
                x2={640 * laserDraw}
                y2="24"
                stroke="rgba(59,130,246,0.42)"
                strokeWidth="1"
              />
              <line
                x1={640 * (1 - laserDraw)}
                y1="396"
                x2="640"
                y2="396"
                stroke="rgba(59,130,246,0.34)"
                strokeWidth="1"
              />
              {/* Vertical 1px Cobalt laser guides */}
              <line
                x1="24"
                y1="0"
                x2="24"
                y2={420 * laserDraw}
                stroke="rgba(59,130,246,0.38)"
                strokeWidth="1"
              />
              <line
                x1="616"
                y1={420 * (1 - laserDraw)}
                x2="616"
                y2="420"
                stroke="rgba(245,158,11,0.32)"
                strokeWidth="1"
              />
            </svg>

            {/* Floating Morphing Glass UI Hardware Card */}
            <div
              className="relative border bg-[#111318]/86 p-6 backdrop-blur-2xl transition-all duration-700 sm:p-7"
              style={{
                transitionTimingFunction: EASE_CSS,
                borderRadius: `${designSpec.radius}px`,
                borderColor:
                  activeDesignPhase === 2
                    ? 'rgba(245, 158, 11, 0.56)'
                    : 'rgba(59, 130, 246, 0.45)',
                boxShadow: designSpec.elevation,
                transform: `perspective(1200px) rotateX(${(0.5 - designScrollT) * 5}deg) translate3d(0, ${(0.5 - designScrollT) * 14}px, 0)`,
              }}
            >
              {/* Top micro-header + live spacing token indicators */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono-num text-[11px] uppercase tracking-[0.16em] text-[#F59E0B]">
                    01 / UX &amp; UI DESIGN
                  </span>
                  <span className="rounded-full border border-[#F59E0B]/45 bg-[#F59E0B]/15 px-2.5 py-0.5 font-mono-num text-[10px] font-medium text-[#F59E0B] transition-all duration-500">
                    {designSpec.pill}
                  </span>
                </div>

                {/* Pulsing Spacing Tokens: 8px, 16px, 24px */}
                <div className="flex items-center gap-1.5">
                  {(['8px', '16px', '24px'] as const).map((sp, i) => {
                    const pulsed = tokenPulseIndex === i || designSpec.spacing === sp;
                    return (
                      <span
                        key={sp}
                        className="rounded-md border px-2 py-0.5 font-mono-num text-[10px] transition-all duration-500"
                        style={{
                          borderColor: pulsed
                            ? 'rgba(59,130,246,0.72)'
                            : 'rgba(255,255,255,0.1)',
                          backgroundColor: pulsed
                            ? 'rgba(59,130,246,0.20)'
                            : 'rgba(7,8,11,0.65)',
                          color: pulsed ? '#93C5FD' : '#64748B',
                          boxShadow: pulsed ? '0 0 14px rgba(59,130,246,0.28)' : 'none',
                        }}
                      >
                        {sp}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Morphing Dark-Glass Component Surface */}
              <div
                className="relative mt-5 overflow-hidden border border-white/[0.08] bg-[#07080B]/88 transition-all duration-700"
                style={{
                  transitionTimingFunction: EASE_CSS,
                  borderRadius: `${Math.max(10, designSpec.radius - 6)}px`,
                  padding: activeDesignPhase === 0 ? '14px' : activeDesignPhase === 1 ? '20px' : '24px',
                  backgroundImage: gridSnap
                    ? 'linear-gradient(to right, rgba(59,130,246,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.12) 1px, transparent 1px)'
                    : 'none',
                  backgroundSize: '24px 24px',
                }}
              >
                <div
                  className="grid grid-cols-12 transition-all duration-700"
                  style={{
                    transitionTimingFunction: EASE_CSS,
                    gap: activeDesignPhase === 0 ? '10px' : activeDesignPhase === 1 ? '14px' : '18px',
                  }}
                >
                  {/* Adaptive Typographic Specimen Tile */}
                  <div
                    className={`border bg-[#111318]/92 p-4 transition-all duration-700 ${
                      activeDesignPhase === 2 ? 'col-span-12 sm:col-span-6' : 'col-span-5'
                    }`}
                    style={{
                      transitionTimingFunction: EASE_CSS,
                      borderRadius: `${Math.max(8, designSpec.radius - 10)}px`,
                      borderColor:
                        activeDesignPhase === 2
                          ? 'rgba(245,158,11,0.45)'
                          : 'rgba(59,130,246,0.35)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-num text-[10px] text-[#8E9CAD]">
                        R-{designSpec.radius}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                    </div>
                    <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#F3F5F8]">
                      Aa
                    </p>
                    <p className="mt-1 font-mono-num text-[10px] text-[#93C5FD]">
                      SPACE · {designSpec.spacing}
                    </p>
                  </div>

                  {/* Adaptive Elevation & State Control Tile */}
                  <div
                    className={`flex flex-col justify-between border bg-[#111318]/92 p-4 transition-all duration-700 ${
                      activeDesignPhase === 2 ? 'col-span-12 sm:col-span-6' : 'col-span-7'
                    }`}
                    style={{
                      transitionTimingFunction: EASE_CSS,
                      borderRadius: `${Math.max(8, designSpec.radius - 10)}px`,
                      borderColor:
                        activeDesignPhase === 1
                          ? 'rgba(59,130,246,0.52)'
                          : activeDesignPhase === 2
                            ? 'rgba(245,158,11,0.52)'
                            : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="h-2.5 rounded-full transition-all duration-700"
                          style={{
                            width: activeDesignPhase === 0 ? '62%' : activeDesignPhase === 1 ? '82%' : '94%',
                            backgroundColor: activeDesignPhase === 2 ? '#F59E0B' : '#3B82F6',
                          }}
                        />
                        <span className="font-mono-num text-[10px] text-[#F59E0B]">
                          {activeDesignPhase === 2 ? 'ACTIVE' : 'READY'}
                        </span>
                      </div>
                      <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
                      <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 pt-2">
                      <span className="font-mono-num text-[10px] text-[#8E9CAD]">WCAG AA 7.8:1</span>
                      <span
                        className="rounded-full px-2.5 py-0.5 font-mono-num text-[10px] font-semibold transition-all duration-500"
                        style={{
                          backgroundColor:
                            activeDesignPhase === 2 ? '#F59E0B' : 'rgba(59,130,246,0.2)',
                          color: activeDesignPhase === 2 ? '#07080B' : '#93C5FD',
                        }}
                      >
                        {designSpec.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Controls (Auto-looping by default; tap any state or toggle 8PT SNAP) */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-[#07080B] p-1">
                  {DESIGN_PHASES.map((phase) => {
                    const selected = activeDesignPhase === phase.id;
                    return (
                      <button
                        key={phase.label}
                        type="button"
                        onClick={() =>
                          setManualDesignPhase((prev) => (prev === phase.id ? null : phase.id))
                        }
                        className={`rounded-lg px-3 py-1.5 font-mono-num text-[11px] font-medium uppercase transition-all ${
                          selected
                            ? phase.id === 2
                              ? 'bg-[#F59E0B] text-[#07080B]'
                              : 'bg-[#3B82F6] text-white'
                            : 'text-[#8E9CAD] hover:text-[#F3F5F8]'
                        }`}
                      >
                        {phase.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setGridSnap((v) => !v)}
                  className={`rounded-lg border px-2.5 py-1.5 font-mono-num text-[10px] uppercase tracking-wider transition-colors ${
                    gridSnap
                      ? 'border-[#3B82F6]/55 bg-[#3B82F6]/15 text-[#93C5FD]'
                      : 'border-white/15 bg-white/5 text-[#8E9CAD]'
                  }`}
                >
                  8PT LASER: {gridSnap ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Z-30: Ghosted Titanium Stroke Foreground Slice */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden select-none"
            style={{
              transform: `translate3d(${(0.5 - designScrollT) * 40}px, 0, 0) scale(${0.96 + designScrollT * 0.07})`,
            }}
          >
            <span className="titanium-stroke-front font-display text-[clamp(5.2rem,20vw,15.5rem)] font-bold uppercase leading-none tracking-[-0.055em]">
              DESIGN
            </span>
          </div>
        </section>

        {/* ====================================================================
            CHAPTER 02 — USER RESEARCH (ARCHITECTURAL GLASS DOUBLE DIAMOND)
            ==================================================================== */}
        <section
          aria-hidden={researchOpacity < 0.05}
          className="absolute inset-0 flex items-center justify-center px-5 pt-14 sm:px-8"
          style={{
            opacity: researchOpacity,
            pointerEvents: researchOpacity > 0.3 ? 'auto' : 'none',
          }}
        >
          {/* Z-10: Giant Metallic "RESEARCH" Backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none"
            style={{
              transform: `translate3d(${(researchScrollT - 0.5) * 44}px, 0, 0) scale(${0.96 + researchScrollT * 0.07})`,
            }}
          >
            <span className="titanium-backdrop-word font-display text-[clamp(4.4rem,16.5vw,13.5rem)] font-bold uppercase leading-none tracking-[-0.055em]">
              RESEARCH
            </span>
          </div>

          {/* Z-20: Multi-Layered Glassmorphic Double Diamond Optical Schematic */}
          <div className="relative z-20 w-full max-w-[640px] rounded-[26px] border border-white/[0.12] bg-[#111318]/84 p-6 shadow-[0_32px_84px_rgba(0,0,0,0.64)] backdrop-blur-2xl sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
              <span className="font-mono-num text-[11px] uppercase tracking-[0.16em] text-[#F59E0B]">
                02 / USER RESEARCH · DOUBLE DIAMOND
              </span>
              <span className="font-mono-num text-[11px] text-[#93C5FD]">
                {ddPhase < 0.25
                  ? 'DISCOVER'
                  : ddPhase < 0.5
                    ? 'DEFINE'
                    : ddPhase < 0.75
                      ? 'DEVELOP'
                      : 'DELIVER'}
              </span>
            </div>

            {/* Multi-Layered Optical Schematic SVG */}
            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-[#07080B]/90 px-2.5 py-3.5 sm:px-4">
              <svg viewBox="0 0 512 184" className="h-auto w-full">
                <defs>
                  <linearGradient id="ddGlassFacet1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.03" />
                  </linearGradient>
                  <linearGradient id="ddGlassFacet2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.18" />
                  </linearGradient>
                  <linearGradient id="ddStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="52%" stopColor="#93C5FD" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                  <filter id="pulseGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Architectural coordinate hairlines & vertical phase dividers */}
                <line x1="20" y1="92" x2="492" y2="92" stroke="rgba(148,163,184,0.14)" strokeWidth="1" strokeDasharray="3 4" />
                {[146, 256, 366].map((vx) => (
                  <line
                    key={vx}
                    x1={vx}
                    y1="20"
                    x2={vx}
                    y2="168"
                    stroke="rgba(148,163,184,0.10)"
                    strokeWidth="1"
                    strokeDasharray="2 5"
                  />
                ))}

                {/* Layered Glass Diamond Facets */}
                <polygon
                  points="36,92 146,24 256,92 146,160"
                  fill="url(#ddGlassFacet1)"
                  stroke="rgba(59,130,246,0.34)"
                  strokeWidth="1.2"
                />
                <polygon
                  points="256,92 366,24 476,92 366,160"
                  fill="url(#ddGlassFacet2)"
                  stroke="rgba(245,158,11,0.32)"
                  strokeWidth="1.2"
                />
                {/* Inner concentric optical wireframes */}
                <polygon
                  points="62,92 146,42 230,92 146,142"
                  fill="none"
                  stroke="rgba(147,197,253,0.18)"
                  strokeWidth="0.9"
                />
                <polygon
                  points="282,92 366,42 450,92 366,142"
                  fill="none"
                  stroke="rgba(245,158,11,0.18)"
                  strokeWidth="0.9"
                />

                {/* High-precision upper & lower rails */}
                <path
                  d="M36 92 L146 24 L256 92 L366 24 L476 92"
                  fill="none"
                  stroke="url(#ddStrokeGrad)"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.88"
                />
                <path
                  d="M36 92 L146 160 L256 92 L366 160 L476 92"
                  fill="none"
                  stroke="url(#ddStrokeGrad)"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.65"
                />

                {/* Vertex optical rings */}
                {[
                  { x: 36, y: 92, active: ddPhase < 0.14 },
                  { x: 146, y: 24, active: Math.abs(ddPhase - 0.25) < 0.11 },
                  { x: 256, y: 92, active: Math.abs(ddPhase - 0.5) < 0.12 },
                  { x: 366, y: 24, active: Math.abs(ddPhase - 0.75) < 0.11 },
                  { x: 476, y: 92, active: ddPhase > 0.88 },
                ].map((v, i) => (
                  <g key={i}>
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r={v.active ? 9 : 4.5}
                      fill={v.active ? 'rgba(245,158,11,0.22)' : 'rgba(59,130,246,0.15)'}
                      stroke={v.active ? '#F59E0B' : '#93C5FD'}
                      strokeWidth="1.2"
                    />
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r="2.4"
                      fill={v.active ? '#F59E0B' : '#F3F5F8'}
                    />
                  </g>
                ))}

                {/* Phase micro-labels */}
                {[
                  { x: 92, t: 'Discover', active: ddPhase < 0.28 },
                  { x: 202, t: 'Define', active: ddPhase >= 0.25 && ddPhase < 0.54 },
                  { x: 312, t: 'Develop', active: ddPhase >= 0.5 && ddPhase < 0.78 },
                  { x: 422, t: 'Deliver', active: ddPhase >= 0.75 },
                ].map((lbl) => (
                  <text
                    key={lbl.t}
                    x={lbl.x}
                    y="14"
                    textAnchor="middle"
                    fill={lbl.active ? '#F59E0B' : '#8E9CAD'}
                    fontSize="10.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {lbl.t}
                  </text>
                ))}

                {/* Continuous Glowing Cobalt Blue & Amber Energy Pulses */}
                <line
                  x1={ddUpperTail.x}
                  y1={ddUpperTail.y}
                  x2={ddUpperHead.x}
                  y2={ddUpperHead.y}
                  stroke="#93C5FD"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  filter="url(#pulseGlow)"
                />
                <circle cx={ddUpperHead.x} cy={ddUpperHead.y} r="5" fill="#3B82F6" filter="url(#pulseGlow)" />
                <circle cx={ddUpperHead.x} cy={ddUpperHead.y} r="2.4" fill="#FFFFFF" />

                <line
                  x1={ddLowerTail.x}
                  y1={ddLowerTail.y}
                  x2={ddLowerHead.x}
                  y2={ddLowerHead.y}
                  stroke="#F59E0B"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  filter="url(#pulseGlow)"
                />
                <circle cx={ddLowerHead.x} cy={ddLowerHead.y} r="4.5" fill="#F59E0B" filter="url(#pulseGlow)" />
                <circle cx={ddLowerHead.x} cy={ddLowerHead.y} r="2.1" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Elevating Glass Badges with Semi-Warm Amber Validation Rings & Micro-Metrics */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {RESEARCH_MILESTONES.map((m) => {
                const waveHit = Math.abs(ddPhase - m.peak) < 0.16;
                const lit = lockedResearchId === m.id || (lockedResearchId === null && waveHit);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onMouseEnter={() => setLockedResearchId(m.id)}
                    onMouseLeave={() => setLockedResearchId(null)}
                    onClick={() =>
                      setLockedResearchId((prev) => (prev === m.id ? null : m.id))
                    }
                    className="rounded-xl border p-3.5 text-left transition-all duration-500"
                    style={{
                      transitionTimingFunction: EASE_CSS,
                      transform: lit ? 'translate3d(0, -4px, 0)' : 'translate3d(0, 0, 0)',
                      borderColor: lit ? 'rgba(245,158,11,0.62)' : 'rgba(255,255,255,0.09)',
                      backgroundColor: lit ? 'rgba(245,158,11,0.11)' : 'rgba(7,8,11,0.78)',
                      boxShadow: lit
                        ? '0 14px 32px rgba(245,158,11,0.18), 0 0 0 1px rgba(245,158,11,0.28)'
                        : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-num text-[9.5px] uppercase tracking-wider text-[#8E9CAD]">
                        {m.phase}
                      </span>
                      <span
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-300"
                        style={{
                          borderColor: lit ? '#F59E0B' : 'rgba(255,255,255,0.18)',
                          backgroundColor: lit ? 'rgba(245,158,11,0.24)' : 'transparent',
                          boxShadow: lit ? '0 0 10px rgba(245,158,11,0.5)' : 'none',
                        }}
                      >
                        {lit ? <Check className="h-2.5 w-2.5 text-[#F59E0B]" aria-hidden="true" /> : null}
                      </span>
                    </div>
                    <p
                      className={`mt-1.5 font-display text-xs font-semibold transition-colors ${
                        lit ? 'text-[#F3F5F8]' : 'text-[#94A3B8]'
                      }`}
                    >
                      {m.label}
                    </p>
                    <p
                      className={`mt-1 font-mono-num text-[10px] transition-colors ${
                        lit ? 'text-[#F59E0B]' : 'text-[#64748B]'
                      }`}
                    >
                      {m.metric}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Z-30: Ghosted Titanium Foreground Slice */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden select-none"
            style={{
              transform: `translate3d(${(researchScrollT - 0.5) * 44}px, 0, 0) scale(${0.96 + researchScrollT * 0.07})`,
            }}
          >
            <span className="titanium-stroke-front font-display text-[clamp(4.4rem,16.5vw,13.5rem)] font-bold uppercase leading-none tracking-[-0.055em]">
              RESEARCH
            </span>
          </div>
        </section>

        {/* ====================================================================
            CHAPTER 03 — CREATIVE AI (GOOGLE VIDS MACRO CAMERA-TRACKING CINEMA)
            ==================================================================== */}
        <section
          aria-hidden={aiOpacity < 0.05}
          className="absolute inset-0 flex items-center justify-center px-5 pt-14 sm:px-8"
          style={{
            opacity: aiOpacity,
            pointerEvents: aiOpacity > 0.3 ? 'auto' : 'none',
          }}
        >
          {/* Z-10: Giant Metallic "CREATIVE AI" Backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none text-center"
            style={{
              transform: `translate3d(${(0.5 - aiScrollT) * 38}px, 0, 0) scale(${0.96 + aiScrollT * 0.07})`,
            }}
          >
            <span className="titanium-backdrop-word font-display text-[clamp(3.6rem,13vw,11.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.05em]">
              CREATIVE AI
            </span>
          </div>

          {/* Z-20: Macro Camera-Tracking Prompt Pill, Context Chip, Concentric Ripple Click & Skeleton UI */}
          <div
            onClick={replayAiSequence}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                replayAiSequence();
              }
            }}
            aria-label={
              locale === 'it'
                ? 'Clicca per riavviare la sequenza Creative AI'
                : 'Click to replay Creative AI sequence'
            }
            className="relative z-20 h-[400px] w-full max-w-[650px] cursor-pointer overflow-hidden rounded-[26px] border border-white/[0.12] bg-[#0B0D12]/90 shadow-[0_36px_96px_rgba(0,0,0,0.72)] backdrop-blur-2xl sm:h-[430px]"
          >
            {/* Fixed Subtle Stage Chrome */}
            <div className="pointer-events-none absolute inset-x-5 top-4 z-30 flex items-center justify-between font-mono-num text-[10px] uppercase tracking-[0.16em]">
              <span className="text-[#F59E0B]">03 / CREATIVE AI</span>
              <span className="text-[#64748B]">
                {aiT < 0.4
                  ? 'MACRO 2.1× · TRACKING'
                  : aiT < 0.51
                    ? '+ CONTEXT CHIP'
                    : aiT < 0.65
                      ? 'EXECUTE PROMPT'
                      : 'SYNTHESIZING UI'}
              </span>
            </div>

            {/* VIRTUAL CAMERA LAYER — Smooth 2.1x Macro Tracking -> 1.0x Full Workspace Reveal */}
            <div
              className="flex h-full w-full flex-col justify-center px-5 pt-9 pb-5 will-change-transform sm:px-7"
              style={{
                transformOrigin: 'center center',
                transform: `translate3d(${macroPanX}%, ${macroPanY}%, 0) scale(${aiCameraScale})`,
                transition: `transform 180ms linear`,
              }}
            >
              {/* Dark-Glass Prompt Pill with Tall Glowing Caret, Cobalt Context Chip & Amber Genera CTA */}
              <div className="relative mx-auto flex w-full max-w-[580px] flex-wrap items-center justify-between gap-2 rounded-full border border-white/15 bg-[#121620]/96 py-2 pl-4 pr-2 shadow-[0_18px_46px_rgba(0,0,0,0.62)]">
                {/* Typing track */}
                <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#F59E0B]" aria-hidden="true" />
                  <div className="flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap font-mono-num text-[11px] text-[#F3F5F8] sm:text-xs">
                    <span>{aiTypedText}</span>
                    {aiT < 0.62 ? (
                      <span
                        aria-hidden="true"
                        className="kinetic-caret ml-0.5 inline-block h-5 w-[2.5px] shrink-0 rounded-full bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.95)]"
                      />
                    ) : null}
                  </div>
                </div>

                {/* Step 2: Cobalt Blue Context Chip Snap */}
                <div
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#3B82F6]/60 bg-[#3B82F6]/18 px-2 py-0.5 font-mono-num text-[9.5px] font-medium text-[#93C5FD] transition-all duration-400 sm:px-2.5 sm:py-1 sm:text-[10px]"
                  style={{
                    transitionTimingFunction: EASE_CSS,
                    opacity: aiChipVisible ? 1 : 0,
                    transform: aiChipVisible
                      ? 'translate3d(0,0,0) scale(1)'
                      : 'translate3d(10px,0,0) scale(0.82)',
                  }}
                >
                  <Plus className="h-3 w-3 text-[#3B82F6]" aria-hidden="true" />
                  <span>Design System Tokens</span>
                </div>

                {/* Step 3: Semi-Warm Amber Submit Button + Concentric Ripples + High-Contrast White/Graphite Cursor (z-50) */}
                <div className="relative shrink-0">
                  {/* Concentric Light-Wave Ripples on Click */}
                  {aiRippleActive ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="ripple-wave-1 pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 rounded-full border-2 border-[#F59E0B]/80 shadow-[0_0_24px_rgba(245,158,11,0.55)]"
                      />
                      <span
                        aria-hidden="true"
                        className="ripple-wave-2 pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 rounded-full border border-[#3B82F6]/75 shadow-[0_0_20px_rgba(59,130,246,0.45)]"
                      />
                    </>
                  ) : null}

                  <div
                    className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full bg-[#F59E0B] px-3.5 font-display text-xs font-semibold text-[#07080B] transition-all duration-200"
                    style={{
                      transform: aiBtnPress ? 'scale(0.92)' : 'scale(1)',
                      boxShadow: aiCursorArrived
                        ? '0 0 26px rgba(245,158,11,0.78)'
                        : '0 4px 14px rgba(245,158,11,0.32)',
                    }}
                  >
                    <span>{locale === 'it' ? 'Genera' : 'Generate'}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>

                  {/* High-Contrast White/Graphite SVG Cursor (z-50 inside transformed stage) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-50 will-change-transform"
                    style={{
                      opacity: aiCursorVisible ? 1 : 0,
                      transform: aiCursorArrived
                        ? `translate3d(-4px, 4px, 0) scale(${aiBtnPress ? 0.86 : 1})`
                        : 'translate3d(46px, 34px, 0) scale(1)',
                      transition: `transform 460ms ${EASE_CSS}, opacity 240ms ease`,
                    }}
                  >
                    <svg width="22" height="24" viewBox="0 0 20 22" fill="none">
                      <path
                        d="M2.5 2L16.5 11.4L10.2 12.6L7.3 18.8L2.5 2Z"
                        fill="#FFFFFF"
                        stroke="#07080B"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 4: Staggered Modular Skeleton UI Assembly -> Resolved Crisp Wireframe */}
              <div className="mx-auto mt-5 w-full max-w-[580px] space-y-2.5">
                {/* Row 1: App Bar Skeleton -> Resolved Wireframe Header */}
                <div
                  className="flex items-center justify-between rounded-xl border px-4 py-2.5 transition-all duration-500"
                  style={{
                    transitionTimingFunction: EASE_CSS,
                    opacity: aiRow1 ? 1 : 0,
                    transform: aiRow1 ? 'translate3d(0,0,0)' : 'translate3d(0,16px,0)',
                    borderColor: aiResolved ? 'rgba(59,130,246,0.38)' : 'rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(17,19,24,0.92)',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
                    {aiResolved ? (
                      <span className="font-mono-num text-[11px] font-medium text-[#F3F5F8]">
                        DarkGlassWorkspace.tsx
                      </span>
                    ) : (
                      <div className="skeleton-shimmer h-2.5 w-28 rounded-full bg-white/15" />
                    )}
                  </div>

                  <div
                    className="inline-flex items-center gap-1 rounded-full border border-[#F59E0B]/45 bg-[#F59E0B]/15 px-2.5 py-0.5 font-mono-num text-[10px] font-medium text-[#F59E0B] transition-all duration-400"
                    style={{
                      opacity: aiResolved ? 1 : 0,
                      transform: aiResolved ? 'scale(1)' : 'scale(0.88)',
                    }}
                  >
                    <Check className="h-3 w-3" aria-hidden="true" />
                    <span>UI Generated</span>
                  </div>
                </div>

                {/* Row 2 + 3: Sidebar + Bento Telemetry Cards */}
                <div className="grid grid-cols-12 gap-2.5">
                  <div
                    className="col-span-4 space-y-2 rounded-xl border p-3 transition-all duration-500"
                    style={{
                      transitionTimingFunction: EASE_CSS,
                      opacity: aiRow2 ? 1 : 0,
                      transform: aiRow2 ? 'translate3d(0,0,0)' : 'translate3d(0,18px,0)',
                      borderColor: aiResolved ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
                      backgroundColor: 'rgba(17,19,24,0.92)',
                    }}
                  >
                    <div className="skeleton-shimmer h-2 w-14 rounded-full bg-white/15" />
                    <div
                      className="flex h-8 items-center rounded-lg border px-2.5 transition-all duration-400"
                      style={{
                        borderColor: aiResolved ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.22)',
                        backgroundColor: aiResolved ? 'rgba(59,130,246,0.16)' : 'rgba(59,130,246,0.08)',
                      }}
                    >
                      <span className="font-mono-num text-[9.5px] text-[#93C5FD]">
                        {aiResolved ? '01 Tokens' : ''}
                      </span>
                    </div>
                    <div className="skeleton-shimmer flex h-7 items-center rounded-lg bg-white/[0.06] px-2.5">
                      <span className="font-mono-num text-[9.5px] text-[#8E9CAD]">
                        {aiResolved ? '02 Layout' : ''}
                      </span>
                    </div>
                    <div className="skeleton-shimmer h-6 w-4/5 rounded-lg bg-white/[0.04]" />
                  </div>

                  <div
                    className="col-span-8 space-y-2.5 transition-all duration-500"
                    style={{
                      transitionTimingFunction: EASE_CSS,
                      opacity: aiRow3 ? 1 : 0,
                      transform: aiRow3 ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)',
                    }}
                  >
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border border-white/[0.09] bg-[#111318]/92 p-3">
                        <div className="font-mono-num text-[9px] uppercase text-[#64748B]">
                          {aiResolved ? 'LATENCY' : 'LOADING'}
                        </div>
                        {aiResolved ? (
                          <p className="mt-1 font-mono-num text-sm font-semibold text-[#93C5FD]">
                            16.6 ms
                          </p>
                        ) : (
                          <div className="mt-2 skeleton-shimmer h-4 w-20 rounded bg-[#3B82F6]/28" />
                        )}
                      </div>
                      <div className="rounded-xl border border-white/[0.09] bg-[#111318]/92 p-3">
                        <div className="font-mono-num text-[9px] uppercase text-[#64748B]">
                          {aiResolved ? 'COST' : 'LOADING'}
                        </div>
                        {aiResolved ? (
                          <p className="mt-1 font-mono-num text-sm font-semibold text-[#F59E0B]">
                            $0.00 / mo
                          </p>
                        ) : (
                          <div className="mt-2 skeleton-shimmer h-4 w-16 rounded bg-[#F59E0B]/28" />
                        )}
                      </div>
                    </div>

                    <div className="flex h-16 items-end gap-1.5 rounded-xl border border-white/[0.09] bg-[#111318]/92 p-3">
                      {[36, 62, 48, 76, 94, 72, 86].map((h, i) => (
                        <div
                          key={i}
                          className="skeleton-shimmer flex-1 rounded-t"
                          style={{
                            height: `${aiRow3 ? h : 12}%`,
                            backgroundColor:
                              i === 4
                                ? 'rgba(245,158,11,0.68)'
                                : 'rgba(59,130,246,0.46)',
                            transition: `height 640ms ${EASE_CSS} ${i * 45}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Z-30: Ghosted Titanium Foreground Slice */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden select-none text-center"
            style={{
              transform: `translate3d(${(0.5 - aiScrollT) * 38}px, 0, 0) scale(${0.96 + aiScrollT * 0.07})`,
            }}
          >
            <span className="titanium-stroke-front font-display text-[clamp(3.6rem,13vw,11.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.05em]">
              CREATIVE AI
            </span>
          </div>
        </section>

        {/* ====================================================================
            CHAPTER 04 — WEB & FRONT-END ENGINEERING (LIVE CODE-TO-UI & 60FPS)
            ==================================================================== */}
        <section
          aria-hidden={engOpacity < 0.05}
          className="absolute inset-0 flex items-center justify-center px-5 pt-14 sm:px-8"
          style={{
            opacity: engOpacity,
            pointerEvents: engOpacity > 0.3 ? 'auto' : 'none',
          }}
        >
          {/* Z-10: Giant Metallic "ENGINEER" Backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none"
            style={{
              transform: `translate3d(${(engScrollT - 0.5) * 44}px, 0, 0) scale(${0.96 + engScrollT * 0.07})`,
            }}
          >
            <span className="titanium-backdrop-word font-display text-[clamp(4.4rem,16.5vw,13.5rem)] font-bold uppercase leading-none tracking-[-0.055em]">
              ENGINEER
            </span>
          </div>

          {/* Z-20: Synchronized Live Code Stream (Left) -> Glass DOM Components (Right) + 60fps Curve */}
          <div
            className="relative z-20 w-full max-w-[650px] space-y-4 rounded-[26px] border border-white/[0.12] bg-[#111318]/86 p-6 shadow-[0_32px_88px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:p-7"
            style={{
              transform: `perspective(1200px) rotateX(${(0.5 - engScrollT) * 5}deg) translate3d(0, ${(0.5 - engScrollT) * 14}px, 0)`,
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
              <span className="font-mono-num text-[11px] uppercase tracking-[0.16em] text-[#F59E0B]">
                04 / WEB &amp; FRONT-END ENGINEERING
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono-num text-[11px] font-medium text-[#34D399]">
                <span className="h-2 w-2 rounded-full bg-[#34D399]" />
                <span>60.0 FPS · 0 CLS</span>
              </span>
            </div>

            {/* Live Code-to-UI Synchronized Split */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-12">
              {/* Left: Streaming Syntax-Highlighted Code */}
              <div className="space-y-2 rounded-2xl border border-white/[0.08] bg-[#07080B]/92 p-4 font-mono-num text-[11px] sm:col-span-7">
                {ENGINEER_LINES.map((line) => {
                  const active = engCycle >= line.threshold;
                  return (
                    <div
                      key={line.num}
                      className="flex items-baseline gap-2.5 transition-all duration-400"
                      style={{
                        transitionTimingFunction: EASE_CSS,
                        opacity: active ? 1 : 0.16,
                        transform: active ? 'translate3d(0,0,0)' : 'translate3d(-8px,0,0)',
                      }}
                    >
                      <span className="select-none text-[#64748B]">{line.num}</span>
                      <span className="break-words" style={{ color: line.color }}>
                        {line.code}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Right: Live Glass DOM Components Snapping Into Place in Sync */}
              <div className="flex flex-col justify-between gap-2 rounded-2xl border border-white/[0.08] bg-[#07080B]/82 p-3.5 sm:col-span-5">
                {/* Snapped DOM 1: Header */}
                <div
                  className="flex items-center justify-between rounded-xl border border-[#3B82F6]/40 bg-[#111318]/92 px-3 py-2 transition-all duration-400"
                  style={{
                    transitionTimingFunction: EASE_CSS,
                    opacity: engCycle >= 0.24 ? 1 : 0.15,
                    transform: engCycle >= 0.24 ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,10px,0) scale(0.94)',
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3 w-3 text-[#3B82F6]" aria-hidden="true" />
                    <span className="font-mono-num text-[10px] text-[#F3F5F8]">VoltRep</span>
                  </div>
                  <span className="font-mono-num text-[9.5px] text-[#34D399]">60fps</span>
                </div>

                {/* Snapped DOM 2: Metric Tiles */}
                <div
                  className="grid grid-cols-2 gap-2 transition-all duration-400"
                  style={{
                    transitionTimingFunction: EASE_CSS,
                    opacity: engCycle >= 0.44 ? 1 : 0.15,
                    transform: engCycle >= 0.44 ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,10px,0) scale(0.94)',
                  }}
                >
                  <div className="rounded-lg border border-white/10 bg-[#111318] p-2">
                    <div className="h-1.5 w-8 rounded-full bg-[#3B82F6]/70" />
                    <div className="mt-1.5 h-2 w-11 rounded-full bg-white/20" />
                  </div>
                  <div className="rounded-lg border border-white/10 bg-[#111318] p-2">
                    <div className="h-1.5 w-8 rounded-full bg-[#F59E0B]/75" />
                    <div className="mt-1.5 h-2 w-10 rounded-full bg-white/20" />
                  </div>
                </div>

                {/* Snapped DOM 3: Amber Action Bar */}
                <div
                  className="flex items-center justify-between rounded-xl border border-[#F59E0B]/50 bg-[#F59E0B]/15 px-3 py-2 transition-all duration-400"
                  style={{
                    transitionTimingFunction: EASE_CSS,
                    opacity: engCycle >= 0.64 ? 1 : 0.15,
                    transform: engCycle >= 0.64 ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,10px,0) scale(0.94)',
                  }}
                >
                  <span className="font-mono-num text-[10px] font-medium text-[#F59E0B]">
                    DOM READY
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.85)]" />
                </div>
              </div>
            </div>

            {/* Live 60fps Telemetry Curve & Zero-Cost Stack Pills */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#07080B]/92 p-3.5">
              <svg
                viewBox="0 0 320 38"
                className="h-9 w-full"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="vidsEngWave" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="55%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
                <path
                  d={engWavePath}
                  fill="none"
                  stroke="url(#vidsEngWave)"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              </svg>

              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] pt-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {STACK_BADGES.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/10 bg-[#111318] px-2.5 py-0.5 font-mono-num text-[10px] text-[#B8C2CF]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <span className="font-mono-num text-[10px] text-[#8E9CAD]">
                  16.6ms FRAME · $0 STACK
                </span>
              </div>
            </div>
          </div>

          {/* Z-30: Ghosted Titanium Foreground Slice */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden select-none"
            style={{
              transform: `translate3d(${(engScrollT - 0.5) * 44}px, 0, 0) scale(${0.96 + engScrollT * 0.07})`,
            }}
          >
            <span className="titanium-stroke-front font-display text-[clamp(4.4rem,16.5vw,13.5rem)] font-bold uppercase leading-none tracking-[-0.055em]">
              ENGINEER
            </span>
          </div>
        </section>

        {/* Bottom whisper-thin global runway progress bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[2px] bg-white/[0.05]"
        >
          <div
            className="h-full bg-gradient-to-r from-[#3B82F6] via-[#93C5FD] to-[#F59E0B]"
            style={{ width: `${(progress * 100).toFixed(2)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
