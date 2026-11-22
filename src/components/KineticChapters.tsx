import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ScrollReveal } from './ScrollReveal';

const EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Shared visibility + IntersectionObserver hook so each chapter runs smoothly ONLY while visible
function useChapterActive(threshold = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(Boolean(entry?.isIntersecting));
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return { ref, isActive: inView && tabVisible };
}

/* ============================================================================
   CHAPTER 01 — UX / UI DESIGN (Living Design System Morph)
   ============================================================================ */
type DesignMode = 'wireframe' | 'tokens' | 'elevated';
const DESIGN_MODES: DesignMode[] = ['wireframe', 'tokens', 'elevated'];

function Chapter01DesignSystem() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const { ref, isActive } = useChapterActive(0.22);

  const [modeIndex, setModeIndex] = useState<number>(2);
  const [isManualHold, setIsManualHold] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive || prefersReducedMotion || isManualHold) return;
    const timer = window.setInterval(() => {
      setModeIndex((prev) => (prev + 1) % DESIGN_MODES.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [isActive, prefersReducedMotion, isManualHold]);

  const mode = DESIGN_MODES[modeIndex];
  const isWireframe = mode === 'wireframe';
  const isTokens = mode === 'tokens';
  const isElevated = mode === 'elevated';

  const handleSelectMode = (idx: number) => {
    setModeIndex(idx);
    setIsManualHold(true);
    window.setTimeout(() => setIsManualHold(false), 7500);
  };

  return (
    <div ref={ref} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Left Narrative */}
      <ScrollReveal duration={0.9} className="space-y-5 lg:col-span-5">
        <p className="font-mono-num text-xs font-medium uppercase tracking-wider text-[#F59E0B]">
          01 / UX &amp; UI DESIGN
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[#F3F5F8] sm:text-4xl">
          {locale === 'it' ? 'Design System vivente' : 'Living Design System'}
        </h2>
        <p className="max-w-[46ch] text-[15px] leading-[1.72] text-[#B8C2CF] sm:text-base">
          {locale === 'it'
            ? 'Dal wireframe strutturale ai token di spaziatura fino alle superfici elevate in Cobalt Blue: ogni stato respira, scala e rispetta la gerarchia visiva.'
            : 'From structural wireframes through calibrated spacing tokens to Cobalt-illuminated glass surfaces: every state breathes and preserves visual hierarchy.'}
        </p>

        {/* Manual Interactive Mode Switch */}
        <div
          role="group"
          aria-label={locale === 'it' ? 'Seleziona stato design system' : 'Select design system state'}
          className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-[#111318] p-1.5"
        >
          {[
            { id: 'wireframe', label: 'Wireframe' },
            { id: 'tokens', label: locale === 'it' ? 'Token 8pt' : '8pt Tokens' },
            { id: 'elevated', label: locale === 'it' ? 'UI Elevata' : 'Elevated UI' },
          ].map((tab, idx) => {
            const selected = idx === modeIndex;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectMode(idx)}
                aria-pressed={selected}
                className={`min-h-[38px] rounded-lg px-3.5 font-display text-xs font-semibold transition-all duration-500 ${
                  selected
                    ? 'bg-[#3B82F6] text-white shadow-[0_4px_16px_rgba(59,130,246,0.35)]'
                    : 'text-[#8E9CAD] hover:text-[#F3F5F8]'
                }`}
                style={{ transitionTimingFunction: EASE_CSS }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Right Kinetic Glassmorphic Morph Canvas */}
      <div className="lg:col-span-7">
        <div
          onClick={() => handleSelectMode((modeIndex + 1) % DESIGN_MODES.length)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelectMode((modeIndex + 1) % DESIGN_MODES.length);
            }
          }}
          aria-label={
            locale === 'it'
              ? 'Clicca per cambiare stato del design system'
              : 'Click to toggle design system state'
          }
          className="relative cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[#111318] p-5 sm:p-8"
        >
          {/* Ambient Cobalt / Warm glow that intensifies on Elevated state */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: isElevated ? 1 : isTokens ? 0.55 : 0.25,
              background:
                'radial-gradient(ellipse 68% 58% at 50% 42%, rgba(59, 130, 246, 0.22), transparent 72%), radial-gradient(ellipse 46% 42% at 82% 76%, rgba(245, 158, 11, 0.14), transparent 72%)',
              transitionTimingFunction: EASE_CSS,
            }}
          />

          {/* Self-drawing SVG Wireframe Grid Lines via stroke-dashoffset */}
          <svg
            aria-hidden="true"
            viewBox="0 0 560 320"
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            {[80, 186, 280, 374, 480].map((x) => (
              <line
                key={`v-${x}`}
                x1={x}
                y1="0"
                x2={x}
                y2="320"
                stroke={isWireframe ? 'rgba(59, 130, 246, 0.34)' : 'rgba(148, 163, 184, 0.08)'}
                strokeWidth="1"
                strokeDasharray="320"
                strokeDashoffset={isActive || prefersReducedMotion ? (isWireframe ? 0 : 40) : 320}
                style={{
                  transition: `stroke-dashoffset 1200ms ${EASE_CSS}, stroke 700ms ${EASE_CSS}`,
                }}
              />
            ))}
            {[64, 160, 256].map((y) => (
              <line
                key={`h-${y}`}
                x1="0"
                y1={y}
                x2="560"
                y2={y}
                stroke={isWireframe ? 'rgba(59, 130, 246, 0.30)' : 'rgba(148, 163, 184, 0.08)'}
                strokeWidth="1"
                strokeDasharray="560"
                strokeDashoffset={isActive || prefersReducedMotion ? (isWireframe ? 0 : 80) : 560}
                style={{
                  transition: `stroke-dashoffset 1300ms ${EASE_CSS}, stroke 700ms ${EASE_CSS}`,
                }}
              />
            ))}
          </svg>

          {/* Morphing Floating Glassmorphic Card */}
          <div
            className="relative z-10 mx-auto max-w-[460px] rounded-[20px] border backdrop-blur-xl transition-all duration-1000"
            style={{
              transitionTimingFunction: EASE_CSS,
              padding: isTokens ? '28px' : '22px',
              backgroundColor: isWireframe
                ? 'rgba(11, 12, 16, 0.65)'
                : isTokens
                  ? 'rgba(17, 19, 24, 0.88)'
                  : 'rgba(20, 25, 36, 0.92)',
              borderColor: isElevated
                ? 'rgba(59, 130, 246, 0.65)'
                : isTokens
                  ? 'rgba(245, 158, 11, 0.45)'
                  : 'rgba(148, 163, 184, 0.24)',
              boxShadow: isElevated
                ? '0 26px 64px rgba(59, 130, 246, 0.24), 0 0 0 1px rgba(59, 130, 246, 0.25) inset'
                : isTokens
                  ? '0 16px 36px rgba(0, 0, 0, 0.45)'
                  : 'none',
              transform: isElevated
                ? 'translate3d(0, -4px, 0) scale(1.015)'
                : isTokens
                  ? 'translate3d(0, 0, 0) scale(1)'
                  : 'translate3d(0, 3px, 0) scale(0.985)',
            }}
          >
            {/* Dynamic Spacing Token Bar that expands in Tokens mode */}
            <div
              className="flex items-center justify-between overflow-hidden font-mono-num text-[10px] transition-all duration-700"
              style={{
                transitionTimingFunction: EASE_CSS,
                maxHeight: isTokens ? '32px' : '0px',
                opacity: isTokens ? 1 : 0,
                marginBottom: isTokens ? '14px' : '0px',
              }}
            >
              <span className="rounded bg-[#F59E0B]/15 px-2 py-0.5 text-[#F59E0B]">pad: 24px</span>
              <span className="h-px flex-1 mx-2 bg-[#F59E0B]/40" />
              <span className="rounded bg-[#3B82F6]/15 px-2 py-0.5 text-[#93C5FD]">gap: 16px</span>
            </div>

            {/* Header Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <p className="font-mono-num text-[10px] uppercase tracking-wider text-[#93C5FD]">
                  {isWireframe
                    ? 'GRID · 12 COL'
                    : isTokens
                      ? 'TOKENS · 8PT RHYTHM'
                      : 'SURFACE · COBALT ELEVATION'}
                </p>
                <p
                  className="font-display text-lg font-semibold tracking-tight transition-colors duration-700"
                  style={{ color: isWireframe ? '#94A3B8' : '#F3F5F8' }}
                >
                  {locale === 'it' ? 'Architettura Interfaccia' : 'Interface Architecture'}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded-full transition-transform duration-700"
                  style={{
                    backgroundColor: '#3B82F6',
                    transform: isElevated ? 'scale(1.18)' : 'scale(0.92)',
                  }}
                />
                <span
                  className="h-3 w-3 rounded-full transition-transform duration-700"
                  style={{
                    backgroundColor: '#F59E0B',
                    transform: isTokens ? 'scale(1.18)' : 'scale(0.92)',
                  }}
                />
              </div>
            </div>

            {/* Morphing Layout Grid inside Card */}
            <div
              className="mt-5 grid grid-cols-12 transition-all duration-700"
              style={{
                gap: isTokens ? '16px' : '10px',
                transitionTimingFunction: EASE_CSS,
              }}
            >
              <div
                className="col-span-5 rounded-xl border p-3.5 transition-all duration-700"
                style={{
                  borderColor: isElevated
                    ? 'rgba(59, 130, 246, 0.35)'
                    : 'rgba(255, 255, 255, 0.08)',
                  backgroundColor: isWireframe ? 'transparent' : 'rgba(11, 12, 16, 0.72)',
                  borderStyle: isWireframe ? 'dashed' : 'solid',
                }}
              >
                <p className="font-display text-2xl font-semibold text-[#F3F5F8]">Aa</p>
                <p className="mt-1 font-mono-num text-[10px] text-[#8E9CAD]">Inter · 600</p>
              </div>

              <div
                className="col-span-7 flex flex-col justify-between rounded-xl border p-3.5 transition-all duration-700"
                style={{
                  borderColor: isTokens
                    ? 'rgba(245, 158, 11, 0.4)'
                    : isElevated
                      ? 'rgba(59, 130, 246, 0.35)'
                      : 'rgba(255, 255, 255, 0.08)',
                  backgroundColor: isWireframe ? 'transparent' : 'rgba(11, 12, 16, 0.72)',
                  borderStyle: isWireframe ? 'dashed' : 'solid',
                }}
              >
                <div className="space-y-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: isElevated ? '88%' : isTokens ? '72%' : '60%',
                      backgroundColor: isElevated ? '#3B82F6' : 'rgba(243,245,248,0.45)',
                    }}
                  />
                  <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
                </div>
                <div className="mt-3 flex items-center justify-between font-mono-num text-[10px]">
                  <span className="text-[#8E9CAD]">AA 7.4:1</span>
                  <span className={isElevated ? 'text-[#3B82F6]' : 'text-[#F59E0B]'}>
                    {isWireframe ? '0px' : isTokens ? '8px · 16px' : 'Shadow · L3'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   CHAPTER 02 — USER RESEARCH & COGNITIVE ERGONOMICS (Animated Double Diamond)
   ============================================================================ */
const DD_UPPER_POINTS = [
  { x: 34, y: 88 },
  { x: 142, y: 26 },
  { x: 250, y: 88 },
  { x: 358, y: 26 },
  { x: 466, y: 88 },
];
const DD_LOWER_POINTS = [
  { x: 34, y: 88 },
  { x: 142, y: 150 },
  { x: 250, y: 88 },
  { x: 358, y: 150 },
  { x: 466, y: 88 },
];

function samplePolyline(points: { x: number; y: number }[], t: number) {
  const clamped = Math.max(0, Math.min(1, t));
  const segCount = points.length - 1;
  const scaled = clamped * segCount;
  const idx = Math.min(segCount - 1, Math.floor(scaled));
  const localT = scaled - idx;
  const a = points[idx];
  const b = points[idx + 1];
  return {
    x: a.x + (b.x - a.x) * localT,
    y: a.y + (b.y - a.y) * localT,
  };
}

function Chapter02UserResearch() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const { ref, isActive } = useChapterActive(0.22);

  const [cycleProgress, setCycleProgress] = useState<number>(() => (prefersReducedMotion ? 1 : 0));
  const elapsedRef = useRef<number>(0);
  const lastRef = useRef<number | null>(null);

  const CYCLE_MS = 7600;
  const DRAW_PORTION = 0.72; // 0..0.72 actively draws & pulses, 0.72..1.0 holds completed state

  const handleReplay = useCallback(() => {
    elapsedRef.current = 0;
    lastRef.current = null;
    setCycleProgress(prefersReducedMotion ? 1 : 0);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCycleProgress(1);
      return;
    }
    if (!isActive) {
      lastRef.current = null;
      return;
    }

    let rafId = 0;
    const tick = (now: number) => {
      if (lastRef.current === null) lastRef.current = now;
      const dt = Math.min(now - lastRef.current, 100);
      lastRef.current = now;
      elapsedRef.current = (elapsedRef.current + dt) % CYCLE_MS;
      setCycleProgress(elapsedRef.current / CYCLE_MS);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      lastRef.current = null;
    };
  }, [isActive, prefersReducedMotion]);

  const drawT = prefersReducedMotion ? 1 : Math.min(1, cycleProgress / DRAW_PORTION);
  const totalPathLen = 500;
  const dashOffset = Math.max(0, totalPathLen * (1 - drawT));

  const upperPulse = samplePolyline(DD_UPPER_POINTS, drawT);
  const lowerPulse = samplePolyline(DD_LOWER_POINTS, drawT);

  const milestones = [
    {
      id: 'stakeholder',
      title: 'Stakeholder Mapping',
      phase: 'Discover → Define',
      threshold: 0.34,
    },
    {
      id: 'constraints',
      title: 'Non-Negotiable Constraints',
      phase: 'Define · Convergence',
      threshold: 0.52,
    },
    {
      id: 'journey',
      title: 'User Journey Map',
      phase: 'Develop → Deliver',
      threshold: 0.86,
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Left Kinetic Double Diamond Stage */}
      <div className="order-2 lg:order-1 lg:col-span-7">
        <div
          onClick={handleReplay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleReplay();
            }
          }}
          aria-label={
            locale === 'it'
              ? 'Clicca per riavviare l’animazione Double Diamond'
              : 'Click to replay Double Diamond animation'
          }
          className="relative cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[#111318] p-5 sm:p-7"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 64% 55% at 28% 36%, rgba(59, 130, 246, 0.14), transparent 72%), radial-gradient(ellipse 52% 48% at 76% 68%, rgba(245, 158, 11, 0.12), transparent 72%)',
            }}
          />

          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#93C5FD]">
                Double Diamond · HCI
              </span>
              <span className="font-mono-num text-[11px] text-[#8E9CAD]">
                {Math.round(drawT * 100)}%
              </span>
            </div>

            {/* Self-drawing SVG Double Diamond with traveling light pulses */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0B0C10]/90 px-2 py-3 sm:px-4">
              <svg
                viewBox="0 0 500 176"
                className="h-auto w-full"
                role="img"
                aria-label="Animated Double Diamond: Discover, Define, Develop, Deliver"
              >
                <defs>
                  <linearGradient id="ddStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#93C5FD" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>

                {/* Base guide wireframe */}
                <path
                  d="M34 88 L142 26 L250 88 L142 150 Z M250 88 L358 26 L466 88 L358 150 Z"
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.16)"
                  strokeWidth="1.25"
                  strokeDasharray="4 5"
                />

                {/* Animated upper & lower self-drawing diamond paths */}
                <path
                  d="M34 88 L142 26 L250 88 L358 26 L466 88"
                  fill="none"
                  stroke="url(#ddStrokeGrad)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={totalPathLen}
                  strokeDashoffset={dashOffset}
                />
                <path
                  d="M34 88 L142 150 L250 88 L358 150 L466 88"
                  fill="none"
                  stroke="url(#ddStrokeGrad)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={totalPathLen}
                  strokeDashoffset={dashOffset}
                  opacity="0.72"
                />

                {/* Phase Labels */}
                {[
                  { x: 90, label: 'Discover', th: 0.08 },
                  { x: 196, label: 'Define', th: 0.35 },
                  { x: 304, label: 'Develop', th: 0.58 },
                  { x: 410, label: 'Deliver', th: 0.82 },
                ].map((lbl) => (
                  <text
                    key={lbl.label}
                    x={lbl.x}
                    y="15"
                    textAnchor="middle"
                    fill={drawT >= lbl.th ? '#F3F5F8' : '#64748B'}
                    fontSize="10.5"
                    fontWeight="500"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {lbl.label}
                  </text>
                ))}

                {/* Diamond Closing Validation Nodes (Amber rings) */}
                {[
                  { x: 34, y: 88, th: 0.02, amber: false },
                  { x: 250, y: 88, th: 0.5, amber: true },
                  { x: 466, y: 88, th: 0.96, amber: true },
                ].map((pt) => {
                  const lit = drawT >= pt.th;
                  return (
                    <g key={pt.x}>
                      {lit && pt.amber ? (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="13"
                          fill="rgba(245, 158, 11, 0.14)"
                          stroke="rgba(245, 158, 11, 0.55)"
                          strokeWidth="1.2"
                        />
                      ) : null}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={lit ? 5 : 3.5}
                        fill={lit ? (pt.amber ? '#F59E0B' : '#3B82F6') : '#171B24'}
                        stroke={lit ? (pt.amber ? '#FBBF24' : '#93C5FD') : 'rgba(226,232,240,0.3)'}
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}

                {/* Traveling Light Pulses along both paths */}
                {!prefersReducedMotion && drawT > 0.01 && drawT < 0.99 ? (
                  <>
                    <circle cx={upperPulse.x} cy={upperPulse.y} r="9" fill="rgba(59,130,246,0.28)" />
                    <circle cx={upperPulse.x} cy={upperPulse.y} r="3.8" fill="#F3F5F8" />
                    <circle cx={lowerPulse.x} cy={lowerPulse.y} r="8" fill="rgba(245,158,11,0.25)" />
                    <circle cx={lowerPulse.x} cy={lowerPulse.y} r="3.4" fill="#F59E0B" />
                  </>
                ) : null}
              </svg>
            </div>

            {/* Floating Methodological Milestones lighting up with Semi-Warm Amber validation rings */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {milestones.map((m) => {
                const validated = drawT >= m.threshold;
                return (
                  <div
                    key={m.id}
                    className="rounded-xl border p-3.5 transition-all duration-700"
                    style={{
                      transitionTimingFunction: EASE_CSS,
                      borderColor: validated
                        ? 'rgba(245, 158, 11, 0.48)'
                        : 'rgba(255, 255, 255, 0.08)',
                      backgroundColor: validated
                        ? 'rgba(245, 158, 11, 0.08)'
                        : 'rgba(11, 12, 16, 0.6)',
                      transform: validated ? 'translate3d(0, -2px, 0)' : 'translate3d(0, 0, 0)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-num text-[10px] text-[#8E9CAD]">{m.phase}</span>
                      <span
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-500"
                        style={{
                          borderColor: validated ? '#F59E0B' : 'rgba(255,255,255,0.16)',
                          backgroundColor: validated ? 'rgba(245,158,11,0.18)' : 'transparent',
                          boxShadow: validated ? '0 0 12px rgba(245,158,11,0.45)' : 'none',
                        }}
                      >
                        {validated ? (
                          <Check className="h-3 w-3 text-[#F59E0B]" aria-hidden="true" />
                        ) : null}
                      </span>
                    </div>
                    <p
                      className={`mt-2 font-display text-xs font-semibold leading-snug ${
                        validated ? 'text-[#F3F5F8]' : 'text-[#8E9CAD]'
                      }`}
                    >
                      {m.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Narrative */}
      <ScrollReveal duration={0.9} className="order-1 space-y-5 lg:order-2 lg:col-span-5">
        <p className="font-mono-num text-xs font-medium uppercase tracking-wider text-[#F59E0B]">
          02 / USER RESEARCH &amp; HCI
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[#F3F5F8] sm:text-4xl">
          {locale === 'it'
            ? 'Ergonomia cognitiva e Double Diamond'
            : 'Cognitive Ergonomics & Double Diamond'}
        </h2>
        <p className="max-w-[46ch] text-[15px] leading-[1.72] text-[#B8C2CF] sm:text-base">
          {locale === 'it'
            ? 'Ogni interfaccia nasce dalla comprensione rigorosa dei bisogni reali: divergenza esplorativa, vincoli non negoziabili e percorsi utente validati sul campo.'
            : 'Every interface begins with rigorous understanding of real human needs: divergent discovery, non-negotiable constraints, and field-validated user journeys.'}
        </p>
      </ScrollReveal>
    </div>
  );
}

/* ============================================================================
   CHAPTER 03 — CREATIVE AI & PROMPT ENGINEERING
   Exact 4-Step Automated Micro-Cinema Sequence (0.0s -> 7.5s + hold/loop):
   1. 0.0s - 2.8s : Macro Zoom scale(1.65) + Typewriter + Horizontal Camera Pan
   2. 2.8s - 4.5s : ~1.0s pause -> SVG Mouse Pointer glides in, hovers Amber CTA, clicks scale(0.92)
   3. 4.5s - 5.3s : Dramatic Zoom-Out back to scale(1) translate3d(0,0,0)
   4. 5.3s - 7.5s : Generative Skeleton UI Assembly + Semi-Warm Amber "UI Generated" badge
   ============================================================================ */
const PROMPT_TEXT = 'Architect dark glass UI with zero-cost telemetry...';
const AI_TOTAL_LOOP_MS = 10400; // 7.5s choreography + 2.9s calm showcase hold before smooth reset

function Chapter03CreativeAI() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const { ref, isActive } = useChapterActive(0.24);

  const [timeMs, setTimeMs] = useState<number>(() => (prefersReducedMotion ? 7500 : 0));
  const elapsedRef = useRef<number>(prefersReducedMotion ? 7500 : 0);
  const lastRef = useRef<number | null>(null);

  const handleReplay = useCallback(() => {
    elapsedRef.current = 0;
    lastRef.current = null;
    setTimeMs(prefersReducedMotion ? 7500 : 0);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTimeMs(7500);
      return;
    }
    if (!isActive) {
      lastRef.current = null;
      return;
    }

    let rafId = 0;
    const tick = (now: number) => {
      if (lastRef.current === null) lastRef.current = now;
      const dt = Math.min(now - lastRef.current, 80);
      lastRef.current = now;
      elapsedRef.current = (elapsedRef.current + dt) % AI_TOTAL_LOOP_MS;
      setTimeMs(elapsedRef.current);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      lastRef.current = null;
    };
  }, [isActive, prefersReducedMotion]);

  const sec = timeMs / 1000;

  // Step 1: Typewriter progress (0.0s -> 2.8s)
  const typeProgress = Math.min(1, Math.max(0, sec / 2.8));
  const typedCount = Math.round(typeProgress * PROMPT_TEXT.length);
  const visiblePrompt = PROMPT_TEXT.slice(0, typedCount);

  // Camera Transform (strictly GPU-composited translate3d + scale)
  // 0.0s - 2.8s : scale(1.65) panning horizontally from left (+22%) to right (-22%) tracking cursor
  // 2.8s - 4.5s : holds zoomed on right side of prompt pill where Amber Submit button sits
  // 4.5s - 5.3s : zooms cleanly out to scale(1) translate3d(0, 0, 0)
  const isZoomedIn = sec < 4.5 && !prefersReducedMotion;
  const panX = isZoomedIn
    ? sec <= 2.8
      ? 22 - typeProgress * 44
      : -22
    : 0;
  const panY = isZoomedIn ? 22 : 0;
  const camScale = isZoomedIn ? 1.65 : 1;

  // Step 2: Simulated Mouse Cursor & Click (3.65s glide -> 3.95s hover -> 4.18s press)
  const cursorVisible = !prefersReducedMotion && sec >= 3.45 && sec <= 4.75;
  const cursorArrived = sec >= 3.92;
  const buttonHovered = !prefersReducedMotion && sec >= 3.9 && sec <= 4.55;
  const buttonPressed = !prefersReducedMotion && sec >= 4.18 && sec <= 4.46;
  const showClickRipple = !prefersReducedMotion && sec >= 4.18 && sec <= 4.65;

  // Step 4: Generative Skeleton UI Assembly (5.3s -> 7.5s staggered cascade)
  const showSkeletonHeader = sec >= 5.35;
  const showSkeletonSidebar = sec >= 5.65;
  const showSkeletonCards = sec >= 6.0;
  const showSkeletonChart = sec >= 6.45;
  const showGeneratedBadge = sec >= 7.0;

  const phaseLabel =
    sec < 2.8
      ? '01 · Macro Pan & Prompt'
      : sec < 4.5
        ? '02 · Cursor Hover & Trigger'
        : sec < 5.3
          ? '03 · Camera Pull-Back'
          : '04 · Skeleton UI Assembly';

  return (
    <div ref={ref} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Left Narrative */}
      <ScrollReveal duration={0.9} className="space-y-5 lg:col-span-5">
        <p className="font-mono-num text-xs font-medium uppercase tracking-wider text-[#F59E0B]">
          03 / CREATIVE AI &amp; PROMPTING
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[#F3F5F8] sm:text-4xl">
          {locale === 'it'
            ? 'Prompt Engineering e Sintesi UI'
            : 'Prompt Engineering & UI Synthesis'}
        </h2>
        <p className="max-w-[46ch] text-[15px] leading-[1.72] text-[#B8C2CF] sm:text-base">
          {locale === 'it'
            ? 'L’intelligenza artificiale come strumento di regia creativa: istruzioni strutturate, prototipazione istantanea e composizione modulare ad alta precisione.'
            : 'AI directed with editorial precision: structured prompts, rapid interactive prototyping, and modular interface generation.'}
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-white/15 bg-[#111318] px-4 font-display text-xs font-semibold text-[#F3F5F8] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F59E0B]/55 hover:text-[#F59E0B] active:scale-[0.97]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{locale === 'it' ? 'Riproduci sequenza' : 'Replay sequence'}</span>
          </button>
          <span className="font-mono-num text-xs text-[#8E9CAD]">
            {Math.min(sec, 7.5).toFixed(1)}s / 7.5s
          </span>
        </div>
      </ScrollReveal>

      {/* Right Micro-Cinema Viewport (strict overflow-hidden so scale(1.65) never overflows) */}
      <div className="lg:col-span-7">
        <div
          onClick={handleReplay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleReplay();
            }
          }}
          aria-label={
            locale === 'it'
              ? 'Sequenza micro-cinema Creative AI — clicca per ripetere'
              : 'Creative AI micro-cinema sequence — click to replay'
          }
          className="relative h-[370px] w-full cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[#0B0C10] shadow-[0_24px_64px_rgba(0,0,0,0.55)] sm:h-[410px]"
        >
          {/* Ambient warm + cobalt lighting */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 68% 54% at 50% 24%, rgba(245, 158, 11, 0.12), transparent 72%), radial-gradient(ellipse 60% 50% at 30% 78%, rgba(59, 130, 246, 0.12), transparent 72%)',
            }}
          />

          {/* Subtle Cinema Phase HUD (top left, non-intrusive) */}
          <div className="pointer-events-none absolute left-4 top-3.5 z-20 flex items-center gap-2 font-mono-num text-[10px] uppercase tracking-wider text-[#8E9CAD]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
            <span>{phaseLabel}</span>
          </div>

          {/* VIRTUAL CAMERA LAYER — 100% GPU translate3d + scale */}
          <div
            className="relative flex h-full w-full flex-col justify-center px-5 pt-9 pb-5 will-change-transform sm:px-7"
            style={{
              transformOrigin: 'center center',
              transform: `translate3d(${panX}%, ${panY}%, 0) scale(${camScale})`,
              transition:
                sec <= 2.85
                  ? 'transform 140ms linear'
                  : `transform 820ms ${EASE_CSS}`,
            }}
          >
            {/* Glassmorphic Prompt Pill Input */}
            <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-between gap-2 rounded-full border border-white/15 bg-[#141822]/90 py-2 pl-4 pr-2 shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#F59E0B]" aria-hidden="true" />
                <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap font-mono-num text-[11px] text-[#F3F5F8] sm:text-xs">
                  <span>{visiblePrompt}</span>
                  {sec < 4.5 ? (
                    <span
                      aria-hidden="true"
                      className="kinetic-caret ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] bg-[#F59E0B]"
                    />
                  ) : null}
                </div>
              </div>

              {/* Semi-Warm Amber Submit Button with Hover Glow & Tactile scale(0.92) Press */}
              <div className="relative shrink-0">
                {showClickRipple ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2 rounded-full border border-[#F59E0B]/70 opacity-75 transition-transform duration-500"
                    style={{
                      transform: 'scale(1.35)',
                    }}
                  />
                ) : null}
                <div
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F59E0B] text-[#0B0C10] transition-all duration-200 sm:h-9 sm:w-9"
                  style={{
                    transitionTimingFunction: EASE_CSS,
                    transform: buttonPressed ? 'scale(0.92)' : 'scale(1)',
                    boxShadow: buttonHovered
                      ? '0 0 22px rgba(245, 158, 11, 0.72)'
                      : '0 4px 12px rgba(245, 158, 11, 0.28)',
                  }}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </div>

                {/* Custom SVG Mouse Pointer gliding cleanly onto the Amber Submit button */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 z-30 will-change-transform"
                  style={{
                    opacity: cursorVisible ? 1 : 0,
                    transform: cursorArrived
                      ? `translate3d(-2px, 2px, 0) scale(${buttonPressed ? 0.88 : 1})`
                      : 'translate3d(44px, 34px, 0) scale(1)',
                    transition: `transform 520ms ${EASE_CSS}, opacity 260ms ease`,
                  }}
                >
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                    <path
                      d="M2.5 2L16.5 11.4L10.2 12.6L7.3 18.8L2.5 2Z"
                      fill="#F3F5F8"
                      stroke="#0B0C10"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Generative Skeleton UI Workspace Canvas (Materializes cleanly at 5.3s - 7.5s) */}
            <div className="mx-auto mt-4 w-full max-w-[520px] space-y-2.5">
              {/* Skeleton Top Bar */}
              <div
                className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#111318]/90 px-3.5 py-2.5 will-change-transform"
                style={{
                  opacity: showSkeletonHeader ? 1 : 0,
                  transform: showSkeletonHeader
                    ? 'translate3d(0, 0, 0)'
                    : 'translate3d(0, 14px, 0)',
                  transition: `opacity 520ms ${EASE_CSS}, transform 620ms ${EASE_CSS}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]/80" />
                  <div className="skeleton-shimmer h-2.5 w-24 rounded-full bg-white/15" />
                </div>

                {/* Semi-Warm Amber "UI Generated" Badge */}
                <div
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#F59E0B]/45 bg-[#F59E0B]/15 px-2.5 py-0.5 font-mono-num text-[10px] font-medium text-[#F59E0B]"
                  style={{
                    opacity: showGeneratedBadge ? 1 : 0,
                    transform: showGeneratedBadge
                      ? 'translate3d(0, 0, 0) scale(1)'
                      : 'translate3d(0, 4px, 0) scale(0.92)',
                    transition: `opacity 450ms ${EASE_CSS}, transform 550ms ${EASE_CSS}`,
                  }}
                >
                  <Check className="h-3 w-3" aria-hidden="true" />
                  <span>UI Generated</span>
                </div>
              </div>

              {/* Skeleton Main Grid: Sidebar + Cards + Data Chart */}
              <div className="grid grid-cols-12 gap-2.5">
                {/* Sidebar Placeholder */}
                <div
                  className="col-span-4 space-y-2 rounded-xl border border-white/[0.08] bg-[#111318]/90 p-3 will-change-transform"
                  style={{
                    opacity: showSkeletonSidebar ? 1 : 0,
                    transform: showSkeletonSidebar
                      ? 'translate3d(0, 0, 0)'
                      : 'translate3d(0, 16px, 0)',
                    transition: `opacity 520ms ${EASE_CSS}, transform 640ms ${EASE_CSS}`,
                  }}
                >
                  <div className="skeleton-shimmer h-2 w-3/4 rounded-full bg-white/15" />
                  <div className="skeleton-shimmer h-7 w-full rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/25" />
                  <div className="skeleton-shimmer h-6 w-full rounded-lg bg-white/[0.06]" />
                  <div className="skeleton-shimmer h-6 w-full rounded-lg bg-white/[0.05]" />
                </div>

                {/* Right Content Column: KPI Cards + Chart */}
                <div className="col-span-8 space-y-2.5">
                  <div
                    className="grid grid-cols-2 gap-2.5 will-change-transform"
                    style={{
                      opacity: showSkeletonCards ? 1 : 0,
                      transform: showSkeletonCards
                        ? 'translate3d(0, 0, 0)'
                        : 'translate3d(0, 16px, 0)',
                      transition: `opacity 520ms ${EASE_CSS}, transform 640ms ${EASE_CSS}`,
                    }}
                  >
                    <div className="rounded-xl border border-white/[0.08] bg-[#111318]/90 p-3">
                      <div className="skeleton-shimmer h-2 w-12 rounded-full bg-white/12" />
                      <div className="mt-2.5 skeleton-shimmer h-4 w-20 rounded-md bg-[#3B82F6]/30" />
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-[#111318]/90 p-3">
                      <div className="skeleton-shimmer h-2 w-14 rounded-full bg-white/12" />
                      <div className="mt-2.5 skeleton-shimmer h-4 w-16 rounded-md bg-[#F59E0B]/30" />
                    </div>
                  </div>

                  {/* Shimmering Data Chart Block */}
                  <div
                    className="rounded-xl border border-white/[0.08] bg-[#111318]/90 p-3 will-change-transform"
                    style={{
                      opacity: showSkeletonChart ? 1 : 0,
                      transform: showSkeletonChart
                        ? 'translate3d(0, 0, 0)'
                        : 'translate3d(0, 18px, 0)',
                      transition: `opacity 540ms ${EASE_CSS}, transform 680ms ${EASE_CSS}`,
                    }}
                  >
                    <div className="flex h-16 items-end gap-2">
                      {[38, 62, 48, 76, 66, 92, 82].map((h, i) => (
                        <div
                          key={i}
                          className="skeleton-shimmer flex-1 rounded-t-md"
                          style={{
                            height: `${showSkeletonChart ? h : 10}%`,
                            backgroundColor:
                              i === 5
                                ? 'rgba(245, 158, 11, 0.55)'
                                : i >= 3
                                  ? 'rgba(59, 130, 246, 0.42)'
                                  : 'rgba(255, 255, 255, 0.12)',
                            transition: `height 700ms ${EASE_CSS} ${i * 55}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   CHAPTER 04 — WEB & FRONT-END ENGINEERING (Code-to-DOM + 60fps Telemetry)
   ============================================================================ */
const CHAPTER04_CODE = [
  { num: '01', text: 'const card = createGlass({', color: '#93C5FD' },
  { num: '02', text: '  surface: "#111318",', color: '#E2E8F0' },
  { num: '03', text: '  accent: "#F59E0B",', color: '#F59E0B' },
  { num: '04', text: '  gpu: "translate3d(0,0,0)",', color: '#34D399' },
  { num: '05', text: '});', color: '#93C5FD' },
];

const ZERO_COST_STACK = ['Vue.js', 'TypeScript', 'Tailwind', 'Firestore'];

function Chapter04FrontEnd() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const { ref, isActive } = useChapterActive(0.22);

  const [step, setStep] = useState<number>(() => (prefersReducedMotion ? 5 : 0));
  const [wavePhase, setWavePhase] = useState<number>(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setStep(5);
      return;
    }
    if (!isActive) return;

    const timer = window.setInterval(() => {
      setStep((prev) => (prev >= 6 ? 1 : prev + 1));
    }, 950);

    return () => window.clearInterval(timer);
  }, [isActive, prefersReducedMotion]);

  // Smooth 60fps telemetry wave animation
  useEffect(() => {
    if (prefersReducedMotion || !isActive) return;
    let rafId = 0;
    const animate = (now: number) => {
      setWavePhase(now * 0.003);
      rafId = window.requestAnimationFrame(animate);
    };
    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [isActive, prefersReducedMotion]);

  // Build crisp SVG telemetry sine path
  const wavePath = (() => {
    const pts: string[] = [];
    for (let x = 0; x <= 320; x += 8) {
      const y =
        20 +
        Math.sin(x * 0.045 + wavePhase) * 6 +
        Math.cos(x * 0.09 - wavePhase * 0.6) * 2.5;
      pts.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  })();

  const visibleLines = prefersReducedMotion ? 5 : Math.min(5, step);

  return (
    <div ref={ref} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Left Kinetic Code-to-DOM Stage */}
      <div className="order-2 lg:order-1 lg:col-span-7">
        <div
          onClick={() => setStep(1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setStep(1);
            }
          }}
          aria-label={
            locale === 'it'
              ? 'Clicca per riavviare lo stream Code-to-DOM'
              : 'Click to replay Code-to-DOM stream'
          }
          className="relative cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-[#111318] p-5 sm:p-7"
        >
          <div className="relative z-10 space-y-4">
            {/* Split Code Stream <-> Live DOM Glass Components */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Animated Code Column */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0B0C10] p-4 font-mono-num text-[11px] sm:text-xs">
                <div className="mb-3 flex items-center justify-between border-b border-white/[0.08] pb-2 text-[10px] text-[#8E9CAD]">
                  <span>surface.ts</span>
                  <span className="text-[#34D399]">0 errors</span>
                </div>
                <div className="space-y-1.5">
                  {CHAPTER04_CODE.map((line, i) => {
                    const shown = i < visibleLines;
                    return (
                      <div
                        key={line.num}
                        className="flex items-baseline gap-2.5 transition-all duration-500"
                        style={{
                          transitionTimingFunction: EASE_CSS,
                          opacity: shown ? 1 : 0.16,
                          transform: shown
                            ? 'translate3d(0, 0, 0)'
                            : 'translate3d(-6px, 0, 0)',
                        }}
                      >
                        <span className="select-none text-[#64748B]">{line.num}</span>
                        <span style={{ color: line.color }}>{line.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Corresponding Live DOM Glass Components snapping into alignment */}
              <div className="flex flex-col justify-between gap-2.5 rounded-2xl border border-white/[0.08] bg-[#0B0C10]/85 p-4">
                <div className="flex items-center justify-between text-[10px] font-mono-num text-[#8E9CAD]">
                  <span>DOM · GPU Layer</span>
                  <span className="text-[#3B82F6]">Live</span>
                </div>

                <div
                  className="rounded-xl border p-3 transition-all duration-700"
                  style={{
                    transitionTimingFunction: EASE_CSS,
                    borderColor:
                      visibleLines >= 2
                        ? 'rgba(59, 130, 246, 0.4)'
                        : 'rgba(255, 255, 255, 0.06)',
                    backgroundColor:
                      visibleLines >= 2 ? 'rgba(17, 19, 24, 0.95)' : 'transparent',
                    transform:
                      visibleLines >= 2
                        ? 'translate3d(0, 0, 0)'
                        : 'translate3d(14px, 0, 0)',
                    opacity: visibleLines >= 2 ? 1 : 0.25,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="h-2 w-16 rounded-full bg-white/75" />
                    <span
                      className="h-2.5 w-2.5 rounded-full transition-colors duration-500"
                      style={{
                        backgroundColor: visibleLines >= 3 ? '#F59E0B' : '#334155',
                        boxShadow:
                          visibleLines >= 3 ? '0 0 10px rgba(245,158,11,0.6)' : 'none',
                      }}
                    />
                  </div>
                  <div className="mt-2.5 h-1.5 w-4/5 rounded-full bg-white/15" />
                </div>

                <div
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#111318] px-3 py-2 transition-all duration-700"
                  style={{
                    transitionTimingFunction: EASE_CSS,
                    opacity: visibleLines >= 4 ? 1 : 0.25,
                    transform:
                      visibleLines >= 4
                        ? 'translate3d(0, 0, 0)'
                        : 'translate3d(0, 10px, 0)',
                  }}
                >
                  <span className="font-mono-num text-[10px] text-[#B8C2CF]">translate3d</span>
                  <span className="font-mono-num text-[10px] font-medium text-[#34D399]">
                    16.6ms · 60 FPS
                  </span>
                </div>
              </div>
            </div>

            {/* 60fps Performance Telemetry Wave + Zero-Cost Stack Row */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#0B0C10] p-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono-num text-[10px] uppercase tracking-wider text-[#8E9CAD]">
                  Frame Telemetry
                </span>
                <span className="font-mono-num text-[11px] font-medium text-[#34D399]">
                  60.0 FPS · 0 CLS
                </span>
              </div>

              <svg
                viewBox="0 0 320 40"
                className="mt-2 h-10 w-full"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="fpsWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="55%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
                <path
                  d={wavePath}
                  fill="none"
                  stroke="url(#fpsWaveGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Zero-Cost Stack Items */}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-3">
                {ZERO_COST_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/10 bg-[#111318] px-2.5 py-1 font-mono-num text-[11px] text-[#B8C2CF] transition-colors duration-200 hover:border-[#F59E0B]/45 hover:text-[#F59E0B]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Narrative */}
      <ScrollReveal duration={0.9} className="order-1 space-y-5 lg:order-2 lg:col-span-5">
        <p className="font-mono-num text-xs font-medium uppercase tracking-wider text-[#F59E0B]">
          04 / WEB &amp; FRONT-END ENGINEERING
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[#F3F5F8] sm:text-4xl">
          {locale === 'it'
            ? 'Dal codice al DOM a 60 FPS'
            : 'Code-to-DOM Engineering at 60 FPS'}
        </h2>
        <p className="max-w-[46ch] text-[15px] leading-[1.72] text-[#B8C2CF] sm:text-base">
          {locale === 'it'
            ? 'Trasformo sistemi visivi in componenti reali, accessibili e accelerati via GPU, mantenendo uno stack moderno, pulito e a costo zero.'
            : 'Translating visual systems into real, accessible, GPU-composited web components built on a clean, modern, zero-cost stack.'}
        </p>
      </ScrollReveal>
    </div>
  );
}

/* ============================================================================
   EXPORTED CONTAINER — ALL 4 SCROLL-DRIVEN KINETIC CHAPTERS
   ============================================================================ */
export function KineticChapters() {
  return (
    <section
      id="capitoli"
      aria-label="Interactive Design & Engineering Chapters"
      className="scroll-mt-20 border-t border-white/[0.08] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px] space-y-28 px-5 sm:space-y-36 sm:px-8">
        <Chapter01DesignSystem />
        <div className="border-t border-white/[0.06] pt-24 sm:pt-32">
          <Chapter02UserResearch />
        </div>
        <div className="border-t border-white/[0.06] pt-24 sm:pt-32">
          <Chapter03CreativeAI />
        </div>
        <div className="border-t border-white/[0.06] pt-24 sm:pt-32">
          <Chapter04FrontEnd />
        </div>
      </div>
    </section>
  );
}
