import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

const SCENE_DURATION_MS = 6000;
const SCENE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const AI_PROMPT =
  'Design and build a minimalist luxury workout & habit OS with 8pt grid and 60fps motion...';

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

// Double Diamond geometry for Scene 02
const DD_UPPER = [
  { x: 26, y: 84 },
  { x: 112, y: 24 },
  { x: 198, y: 84 },
  { x: 284, y: 24 },
  { x: 370, y: 84 },
];

const DD_LOWER = [
  { x: 26, y: 84 },
  { x: 112, y: 144 },
  { x: 198, y: 84 },
  { x: 284, y: 144 },
  { x: 370, y: 84 },
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

const CHAPTERS = [
  { id: 0, code: '01', label: 'UX/UI Design' },
  { id: 1, code: '02', label: 'User Research' },
  { id: 2, code: '03', label: 'Creative AI' },
  { id: 3, code: '04', label: 'Motion & Front-End' },
] as const;

const VOLTREP_SETS = [
  { id: 'W1', reps: '82.5 × 8', h: 52 },
  { id: 'W2', reps: '85.0 × 8', h: 64 },
  { id: 'W3', reps: '87.5 × 7', h: 76 },
  { id: 'W4', reps: '90.0 × 6', h: 88 },
  { id: 'W5', reps: '92.5 × 6', h: 100 },
];

function PointerSvg() {
  return (
    <svg width="22" height="24" viewBox="0 0 20 22" fill="none">
      <path
        d="M2.5 2L16.5 11.4L10.2 12.6L7.3 18.8L2.5 2Z"
        fill="#FFFFFF"
        stroke="#07080B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KineticHeroShowreel() {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const [activeScene, setActiveScene] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const sceneStartRef = useRef<number>(0);
  const activeSceneRef = useRef<number>(0);

  // Calibrate Creative AI camera zoom & layout on narrow viewports (<768px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const selectScene = useCallback((idx: number) => {
    activeSceneRef.current = idx;
    sceneStartRef.current = performance.now();
    setActiveScene(idx);
    setSceneProgress(0);
  }, []);

  // 60fps auto-playing showreel timer (~6s per scene)
  useEffect(() => {
    if (prefersReducedMotion) {
      setSceneProgress(0.9);
      return;
    }

    sceneStartRef.current = performance.now();
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
  }, [prefersReducedMotion]);

  const t = prefersReducedMotion ? 0.92 : sceneProgress;

  /* --------------------------------------------------------------------------
     SCENE 01 — UX / UI DESIGN (Figma Auto-Layout Frame + Simulated Cursor Click)
     -------------------------------------------------------------------------- */
  const s1Grid = clamp(t / 0.25);
  const s1ActiveBadge = t < 0.3 ? 0 : t < 0.55 ? 1 : 2;
  const s1CursorIn = !prefersReducedMotion && t >= 0.42 && t <= 0.88;
  const s1CursorArrived = t >= 0.56;
  const s1Pressed = t >= 0.6 && t <= 0.66;
  const s1Validated = t >= 0.64;

  /* --------------------------------------------------------------------------
     SCENE 02 — USER RESEARCH (Double Diamond + Live Usability Telemetry)
     -------------------------------------------------------------------------- */
  const ddLen = 420;
  const ddDraw = clamp(t / 0.8);
  const ddOffset = Math.max(0, ddLen * (1 - ddDraw));
  const ddTail = clamp(ddDraw - 0.09, 0, 1);
  const ddUpperHead = samplePath(DD_UPPER, ddDraw);
  const ddUpperTail = samplePath(DD_UPPER, ddTail);
  const ddLowerHead = samplePath(DD_LOWER, ddDraw);
  const ddLowerTail = samplePath(DD_LOWER, ddTail);

  const taskSuccessVal = 44.2 + clamp(t / 0.72) * (98.4 - 44.2);
  const s2CursorIn = !prefersReducedMotion && t >= 0.46 && t <= 0.9;
  const s2CursorArrived = t >= 0.58;
  const s2Pressed = t >= 0.62 && t <= 0.68;
  const s2Aligned = t >= 0.66;

  /* --------------------------------------------------------------------------
     SCENE 03 — CREATIVE AI (Google-Style Macro 1.9x Camera-Tracking Sequence)
     0.00 - 0.44 : Macro scale(1.9) on left of prompt pill & tall glowing caret, panning L->R
     0.44 - 0.60 : White/Graphite SVG cursor glides onto Amber ↑ button, clicks scale(0.92) + ripple
     0.60 - 0.73 : Cubic ease-out zoom back to scale(1)
     0.73 - 1.00 : Full dark-glass dashboard (14,820 kg, 21 days, 96%, sidebar, bar chart) cascades in
     -------------------------------------------------------------------------- */
  const aiTypeT = clamp(t / 0.44);
  const aiTyped = AI_PROMPT.slice(0, Math.round(aiTypeT * AI_PROMPT.length));

  const rawZoomOut = clamp((t - 0.6) / 0.14);
  const zoomOutEase = 1 - Math.pow(1 - rawZoomOut, 3);
  const peakZoom = isMobile ? 1.25 : 1.85;
  const aiScale = prefersReducedMotion ? 1 : peakZoom - zoomOutEase * (peakZoom - 1);

  const peakPan = isMobile ? 10 : 22;
  const aiPanX = prefersReducedMotion
    ? 0
    : t < 0.44
      ? peakPan - aiTypeT * (peakPan * 2)
      : t < 0.6
        ? -peakPan
        : -peakPan * (1 - zoomOutEase);
  const aiPanY = prefersReducedMotion ? 0 : (isMobile ? 12 : 22) * (1 - zoomOutEase);

  const aiCursorIn = !prefersReducedMotion && t >= 0.43 && t <= 0.66;
  const aiCursorArrived = t >= 0.5;
  const aiBtnPressed = t >= 0.525 && t <= 0.58;
  const aiRippleOn = t >= 0.53 && t <= 0.73;

  const aiDash1 = t >= 0.68;
  const aiDash2 = t >= 0.75;
  const aiDash3 = t >= 0.82;

  /* --------------------------------------------------------------------------
     SCENE 04 — MOTION & FRONT-END (VOLTREP LIVE SET LOGGER + 60 FPS • 0.4ms)
     -------------------------------------------------------------------------- */
  const loggedSets = Math.min(5, Math.max(1, Math.ceil(clamp(t / 0.58) * 5)));
  const s4SetLogged = t >= 0.54;
  const s4CursorIn = !prefersReducedMotion && t >= 0.46 && t <= 0.92;
  const s4CursorArrived = t >= 0.59;
  const s4Pressed = t >= 0.63 && t <= 0.69;
  const s4Deployed = t >= 0.67;

  const s4WavePath = (() => {
    const pts: string[] = [];
    const phase = t * 15;
    for (let x = 0; x <= 260; x += 8) {
      const y = 17 + Math.sin(x * 0.055 + phase) * 5.2 + Math.cos(x * 0.1 - phase * 0.6) * 2.1;
      pts.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  })();

  const getSceneStyle = (index: number) => {
    const isActive = activeScene === index;
    return {
      opacity: isActive ? 1 : 0,
      transform: isActive
        ? 'translate3d(0, 0, 0) scale(1)'
        : 'translate3d(0, 14px, 0) scale(0.985)',
      pointerEvents: isActive ? ('auto' as const) : ('none' as const),
      transition: `opacity 900ms ${SCENE_EASE}, transform 900ms ${SCENE_EASE}`,
    };
  };

  return (
    <section
      id="panoramica"
      aria-labelledby="hero-heading"
      className="relative scroll-mt-24 overflow-hidden bg-[#07080B] pb-16 pt-8 sm:pb-22 sm:pt-12"
    >
      {/* Subtle Studio Spotlight Glow (Cobalt + Semi-Warm Amber) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{
          background:
            'radial-gradient(ellipse 52% 46% at 50% 0%, rgba(59,130,246,0.14), transparent 72%), radial-gradient(ellipse 36% 36% at 62% 14%, rgba(245,158,11,0.09), transparent 72%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1160px] px-4 sm:px-6">
        {/* Executive Above-the-Fold Header: Name + Positioning Statement + Dual-CTA */}
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="hero-heading"
            className="titanium-text font-display text-[clamp(2.35rem,6.2vw,4.95rem)] font-semibold uppercase leading-[0.98] tracking-[-0.045em]"
          >
            SAMUEL TAVONATTI
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#B8C2CF] sm:text-base">
            {locale === 'it'
              ? 'UX/UI Designer & Front-End Developer — Progetto interfacce ad alta ergonomia cognitiva e architetture web veloci, accessibili e a costo zero.'
              : 'UX/UI Designer & Front-End Developer — Designing high-cognitive-ergonomics interfaces and fast, accessible, zero-cost web architectures.'}
          </p>

          {/* Dual Action Pills directly above the Kinetic Showreel */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#progetti"
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#F59E0B] px-5 py-2.5 font-display text-xs font-semibold text-[#07080B] shadow-[0_6px_24px_rgba(245,158,11,0.34)] transition-[background-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#FBBF24] hover:shadow-[0_10px_30px_rgba(245,158,11,0.46)] active:scale-[0.97] sm:text-sm"
            >
              <span>{locale === 'it' ? 'Esplora i Progetti' : 'Explore Projects'}</span>
              <ArrowDown
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>

            <a
              href="#contatti"
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#111318]/85 px-5 py-2.5 font-display text-xs font-semibold text-[#F3F5F8] backdrop-blur-md transition-[border-color,color,transform,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#F59E0B]/60 hover:text-[#F59E0B] active:scale-[0.97] sm:text-sm"
            >
              <span>{locale === 'it' ? 'Parliamone' : "Let's Talk"}</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* Wide Borderless Dark-Glass Kinetic Stage (Calibrated for Desktop & <768px Mobile) */}
        <div className="relative mt-7 h-[580px] w-full overflow-hidden rounded-2xl bg-[#111318]/84 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_32px_92px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:mt-8 md:h-[430px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 58% 46% at 20% 15%, rgba(59,130,246,0.10), transparent 70%), radial-gradient(ellipse 50% 42% at 82% 85%, rgba(245,158,11,0.09), transparent 70%)',
            }}
          />

          {/* ================================================================
              SCENE 01 — UX / UI DESIGN (Figma Auto-Layout Frame)
              ================================================================ */}
          <div
            aria-hidden={activeScene !== 0}
            className="absolute inset-0 flex items-center justify-center p-5 sm:p-8"
            style={getSceneStyle(0)}
          >
            {/* Drawing Cobalt Blue Auto-Layout Guides */}
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 430"
              className="pointer-events-none absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              {[86, 215, 344].map((y, i) => (
                <line
                  key={`h-${y}`}
                  x1="0"
                  y1={y}
                  x2={1000 * s1Grid}
                  y2={y}
                  stroke={i === 1 ? 'rgba(59,130,246,0.22)' : 'rgba(59,130,246,0.10)'}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
              {[200, 500, 800].map((x, i) => (
                <line
                  key={`v-${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2={430 * s1Grid}
                  stroke={i === 1 ? 'rgba(59,130,246,0.20)' : 'rgba(59,130,246,0.10)'}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
            </svg>

            {/* Figma Auto-Layout Frame */}
            <div className="relative z-10 w-full max-w-[780px] rounded-2xl border border-[#3B82F6]/35 bg-[#0A0C12]/88 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-6">
              {/* Top Spec Row: Frame Name + Architectural Spacing Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                  <span className="font-mono-num text-[11px] font-medium text-[#93C5FD]">
                    Figma Auto-Layout Frame
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 font-mono-num text-[10px]">
                  {(['8px', '16px', '24px'] as const).map((sp, i) => {
                    const active = s1ActiveBadge === i;
                    return (
                      <span
                        key={sp}
                        className="rounded-full border px-2.5 py-0.5 transition-all duration-400"
                        style={{
                          borderColor: active
                            ? 'rgba(59,130,246,0.75)'
                            : 'rgba(255,255,255,0.10)',
                          backgroundColor: active
                            ? 'rgba(59,130,246,0.20)'
                            : 'rgba(17,19,24,0.8)',
                          color: active ? '#93C5FD' : '#64748B',
                        }}
                      >
                        {sp}
                      </span>
                    );
                  })}
                  <span className="rounded-full border border-[#F59E0B]/40 bg-[#F59E0B]/12 px-2.5 py-0.5 text-[#F59E0B]">
                    4pt Grid • WCAG AAA
                  </span>
                </div>
              </div>

              {/* 3 Dark-Glass Architecture Modules: SURFACE, HIERARCHY, MOTION */}
              <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                {[
                  {
                    tag: 'SURFACE',
                    title: 'Dark Glass L2',
                    meta: 'blur(24px) · 1px rim',
                    accent: '#3B82F6',
                    lit: s1ActiveBadge >= 0,
                  },
                  {
                    tag: 'HIERARCHY',
                    title: 'Inter Display',
                    meta: '-0.04em · 7.8:1 AA+',
                    accent: '#93C5FD',
                    lit: s1ActiveBadge >= 1,
                  },
                  {
                    tag: 'MOTION',
                    title: 'Cubic Bezier',
                    meta: '(0.22, 1, 0.36, 1)',
                    accent: '#F59E0B',
                    lit: s1ActiveBadge >= 2,
                  },
                ].map((mod) => (
                  <div
                    key={mod.tag}
                    className="rounded-xl border bg-[#111318]/92 p-4 transition-all duration-500"
                    style={{
                      transitionTimingFunction: SCENE_EASE,
                      borderColor: mod.lit
                        ? mod.tag === 'MOTION'
                          ? 'rgba(245,158,11,0.48)'
                          : 'rgba(59,130,246,0.42)'
                        : 'rgba(255,255,255,0.08)',
                      transform: mod.lit ? 'translate3d(0,-2px,0)' : 'translate3d(0,0,0)',
                    }}
                  >
                    <span
                      className="font-mono-num text-[10px] font-semibold tracking-[0.14em]"
                      style={{ color: mod.accent }}
                    >
                      {mod.tag}
                    </span>
                    <p className="mt-2 font-display text-base font-semibold text-[#F3F5F8]">
                      {mod.title}
                    </p>
                    <p className="mt-1 font-mono-num text-[10.5px] text-[#8E9CAD]">
                      {mod.meta}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Auto-Layout Bar + Cursor Clicking "Validated ✓" */}
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
                <span className="font-mono-num text-[10.5px] text-[#64748B]">
                  AUTO-LAYOUT · GAP 16PX · PADDING 24PX
                </span>

                <div className="relative">
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono-num text-[11px] font-semibold transition-all duration-300"
                    style={{
                      transform: s1Pressed ? 'scale(0.92)' : 'scale(1)',
                      borderColor: s1Validated
                        ? 'rgba(52,211,153,0.75)'
                        : 'rgba(245,158,11,0.55)',
                      backgroundColor: s1Validated
                        ? 'rgba(52,211,153,0.18)'
                        : 'rgba(245,158,11,0.14)',
                      color: s1Validated ? '#34D399' : '#F59E0B',
                      boxShadow: s1Validated
                        ? '0 0 22px rgba(52,211,153,0.32)'
                        : '0 0 14px rgba(245,158,11,0.18)',
                    }}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Validated ✓</span>
                  </div>

                  {/* Simulated High-Contrast Cursor */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-50 will-change-transform"
                    style={{
                      opacity: s1CursorIn ? 1 : 0,
                      transform: s1CursorArrived
                        ? `translate3d(-2px, 4px, 0) scale(${s1Pressed ? 0.86 : 1})`
                        : 'translate3d(-72px, 34px, 0) scale(1)',
                      transition: `transform 520ms ${SCENE_EASE}, opacity 240ms ease`,
                    }}
                  >
                    <PointerSvg />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              SCENE 02 — USER RESEARCH (Double Diamond + Usability Telemetry)
              ================================================================ */}
          <div
            aria-hidden={activeScene !== 1}
            className="absolute inset-0 flex items-center justify-center p-5 sm:p-8"
            style={getSceneStyle(1)}
          >
            <div className="grid w-full max-w-[840px] grid-cols-1 gap-3.5 md:grid-cols-12 md:gap-4">
              {/* Left Module: Double Diamond Architecture */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/[0.10] bg-[#0A0C12]/90 p-4 sm:p-5 md:col-span-7">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-num text-[10.5px] uppercase tracking-[0.14em] text-[#93C5FD]">
                    Double Diamond Architecture
                  </span>
                  <span className="font-mono-num text-[10px] text-[#F59E0B]">
                    {Math.round(ddDraw * 100)}%
                  </span>
                </div>

                <div className="my-3">
                  <svg viewBox="0 0 396 168" className="h-auto w-full">
                    <defs>
                      <linearGradient id="edDdGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="52%" stopColor="#93C5FD" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                    <line x1="16" y1="84" x2="380" y2="84" stroke="rgba(148,163,184,0.14)" strokeWidth="1" strokeDasharray="3 4" />
                    <polygon points="26,84 112,24 198,84 112,144" fill="rgba(59,130,246,0.09)" stroke="rgba(59,130,246,0.22)" strokeWidth="1" />
                    <polygon points="198,84 284,24 370,84 284,144" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.22)" strokeWidth="1" />

                    <path
                      d="M26 84 L112 24 L198 84 L284 24 L370 84"
                      fill="none"
                      stroke="url(#edDdGrad)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={ddLen}
                      strokeDashoffset={ddOffset}
                    />
                    <path
                      d="M26 84 L112 144 L198 84 L284 144 L370 84"
                      fill="none"
                      stroke="url(#edDdGrad)"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={ddLen}
                      strokeDashoffset={ddOffset}
                      opacity="0.72"
                    />

                    {[
                      { x: 69, t: 'Discover', th: 0.08 },
                      { x: 155, t: 'Define', th: 0.34 },
                      { x: 241, t: 'Develop', th: 0.58 },
                      { x: 327, t: 'Deliver', th: 0.82 },
                    ].map((ph) => (
                      <text
                        key={ph.t}
                        x={ph.x}
                        y="14"
                        textAnchor="middle"
                        fill={ddDraw >= ph.th ? '#F3F5F8' : '#64748B'}
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {ph.t}
                      </text>
                    ))}

                    {ddDraw > 0.02 && ddDraw < 0.99 ? (
                      <>
                        <line x1={ddUpperTail.x} y1={ddUpperTail.y} x2={ddUpperHead.x} y2={ddUpperHead.y} stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
                        <circle cx={ddUpperHead.x} cy={ddUpperHead.y} r="4.5" fill="#3B82F6" />
                        <circle cx={ddUpperHead.x} cy={ddUpperHead.y} r="2.2" fill="#FFFFFF" />
                        <line x1={ddLowerTail.x} y1={ddLowerTail.y} x2={ddLowerHead.x} y2={ddLowerHead.y} stroke="#F59E0B" strokeWidth="2.6" strokeLinecap="round" />
                        <circle cx={ddLowerHead.x} cy={ddLowerHead.y} r="3.5" fill="#F59E0B" />
                      </>
                    ) : null}
                  </svg>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {['Stakeholder Map', 'Constraints', 'User Journey'].map((tag, i) => {
                    const lit = ddDraw >= 0.25 + i * 0.25;
                    return (
                      <span
                        key={tag}
                        className="rounded-full border px-2.5 py-0.5 font-mono-num text-[10px] transition-colors duration-400"
                        style={{
                          borderColor: lit ? 'rgba(245,158,11,0.55)' : 'rgba(255,255,255,0.08)',
                          backgroundColor: lit ? 'rgba(245,158,11,0.14)' : 'transparent',
                          color: lit ? '#F59E0B' : '#64748B',
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Right Module: Usability Telemetry */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/[0.10] bg-[#0A0C12]/90 p-4 sm:p-5 md:col-span-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-num text-[10.5px] uppercase tracking-[0.14em] text-[#F59E0B]">
                      Usability Telemetry
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#34D399]" />
                  </div>

                  {/* Task Success Climbing 44.2% -> 98.4% */}
                  <div className="rounded-xl border border-white/[0.08] bg-[#111318] p-3.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-mono-num text-[10px] uppercase text-[#8E9CAD]">
                        Task Success
                      </span>
                      <span className="font-mono-num text-xl font-semibold text-[#F3F5F8]">
                        {taskSuccessVal.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] via-[#93C5FD] to-[#F59E0B]"
                        style={{ width: `${taskSuccessVal.toFixed(1)}%` }}
                      />
                    </div>
                  </div>

                  {/* SUS Score 91/100 */}
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#111318] px-3.5 py-3">
                    <span className="font-mono-num text-[10.5px] uppercase text-[#8E9CAD]">
                      SUS Score
                    </span>
                    <span className="font-mono-num text-sm font-semibold text-[#34D399]">
                      91 / 100
                    </span>
                  </div>
                </div>

                {/* Cursor Clicking "Align Goals" */}
                <div className="relative mt-4 pt-2">
                  <div
                    className="flex w-full items-center justify-center gap-1.5 rounded-full border py-2.5 font-display text-xs font-semibold transition-all duration-300"
                    style={{
                      transform: s2Pressed ? 'scale(0.92)' : 'scale(1)',
                      borderColor: s2Aligned
                        ? 'rgba(52,211,153,0.7)'
                        : 'rgba(59,130,246,0.65)',
                      backgroundColor: s2Aligned
                        ? 'rgba(52,211,153,0.16)'
                        : 'rgba(59,130,246,0.18)',
                      color: s2Aligned ? '#34D399' : '#93C5FD',
                      boxShadow: s2Aligned
                        ? '0 0 22px rgba(52,211,153,0.28)'
                        : 'none',
                    }}
                  >
                    {s2Aligned ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                    <span>{s2Aligned ? 'Goals Aligned ✓' : 'Align Goals'}</span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-50 will-change-transform"
                    style={{
                      opacity: s2CursorIn ? 1 : 0,
                      transform: s2CursorArrived
                        ? `translate3d(4px, 4px, 0) scale(${s2Pressed ? 0.86 : 1})`
                        : 'translate3d(68px, 34px, 0) scale(1)',
                      transition: `transform 520ms ${SCENE_EASE}, opacity 240ms ease`,
                    }}
                  >
                    <PointerSvg />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              SCENE 03 — CREATIVE AI (Google-Style Macro 1.9× Camera-Tracking)
              ================================================================ */}
          <div
            aria-hidden={activeScene !== 2}
            className="absolute inset-0 overflow-hidden"
            style={getSceneStyle(2)}
          >
            {/* Virtual Camera Layer (Scale 1.9 -> 1.0, Pan L -> R) */}
            <div
              className="flex h-full w-full flex-col items-center justify-center px-5 py-6 will-change-transform sm:px-8"
              style={{
                transformOrigin: 'center center',
                transform: `translate3d(${aiPanX}%, ${aiPanY}%, 0) scale(${aiScale})`,
                transition: 'transform 160ms linear',
              }}
            >
              {/* Dark-Glass Prompt Pill + Tall Glowing Caret + Amber ↑ Submit */}
              <div className="relative flex w-full max-w-[680px] items-center justify-between gap-3 rounded-full border border-white/15 bg-[#0A0C12]/96 py-2 pl-4 pr-2 shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#F59E0B]" aria-hidden="true" />
                  <div className="flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap font-mono-num text-[11px] text-[#F3F5F8] sm:text-xs">
                    <span>{aiTyped}</span>
                    {t < 0.58 ? (
                      <span
                        aria-hidden="true"
                        className="kinetic-caret ml-0.5 inline-block h-5 w-[2.5px] shrink-0 rounded-full bg-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.95)]"
                      />
                    ) : null}
                  </div>
                </div>

                {/* Semi-Warm Amber ↑ Submit Button + Concentric Ripples + Cursor (z-50) */}
                <div className="relative shrink-0">
                  {aiRippleOn ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="ripple-wave-1 pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 rounded-full border-2 border-[#F59E0B]/85 shadow-[0_0_24px_rgba(245,158,11,0.58)]"
                      />
                      <span
                        aria-hidden="true"
                        className="ripple-wave-2 pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 rounded-full border border-[#3B82F6]/75 shadow-[0_0_18px_rgba(59,130,246,0.45)]"
                      />
                    </>
                  ) : null}

                  <div
                    className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F59E0B] text-[#07080B] transition-all duration-200"
                    style={{
                      transform: aiBtnPressed ? 'scale(0.92)' : 'scale(1)',
                      boxShadow: aiCursorArrived
                        ? '0 0 26px rgba(245,158,11,0.82)'
                        : '0 4px 14px rgba(245,158,11,0.34)',
                    }}
                  >
                    <ArrowUp className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
                  </div>

                  {/* High-Contrast White/Graphite Pointer (z-50 inside transformed stage) */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-50 will-change-transform"
                    style={{
                      opacity: aiCursorIn ? 1 : 0,
                      transform: aiCursorArrived
                        ? `translate3d(-3px, 4px, 0) scale(${aiBtnPressed ? 0.86 : 1})`
                        : 'translate3d(46px, 32px, 0) scale(1)',
                      transition: `transform 420ms ${SCENE_EASE}, opacity 220ms ease`,
                    }}
                  >
                    <PointerSvg />
                  </div>
                </div>
              </div>

              {/* Staggered Luxury Workout & Habit OS Dark-Glass Dashboard */}
              <div className="mt-4 grid w-full max-w-[680px] grid-cols-1 gap-2.5 md:mt-5 md:grid-cols-12">
                {/* Sidebar Navigation (compact horizontal strip on mobile, left rail on desktop) */}
                <div
                  className="rounded-xl border border-white/[0.09] bg-[#0A0C12]/92 p-2.5 transition-all duration-500 md:col-span-4 md:space-y-2 md:p-3"
                  style={{
                    transitionTimingFunction: SCENE_EASE,
                    opacity: aiDash1 ? 1 : 0,
                    transform: aiDash1 ? 'translate3d(0,0,0)' : 'translate3d(0,18px,0)',
                  }}
                >
                  <div className="flex items-center justify-between pb-1.5 md:pb-1">
                    <span className="font-mono-num text-[10px] font-semibold text-[#F59E0B]">
                      VOLTREP OS
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#34D399]" />
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 md:grid-cols-1 md:gap-2">
                    {['Overview', 'Volume', 'Habits', 'Stats'].map((nav, i) => (
                      <div
                        key={nav}
                        className={`truncate rounded-lg px-2 py-1 text-center font-mono-num text-[9.5px] md:px-2.5 md:py-1.5 md:text-left md:text-[10px] ${
                          i === 0
                            ? 'border border-[#3B82F6]/45 bg-[#3B82F6]/16 text-[#93C5FD]'
                            : 'bg-white/[0.03] text-[#8E9CAD]'
                        }`}
                      >
                        {nav}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Metrics (14,820 kg · 21 days · 96%) + Bar Chart */}
                <div className="space-y-2.5 md:col-span-8">
                  <div
                    className="grid grid-cols-3 gap-2 transition-all duration-500"
                    style={{
                      transitionTimingFunction: SCENE_EASE,
                      opacity: aiDash2 ? 1 : 0,
                      transform: aiDash2 ? 'translate3d(0,0,0)' : 'translate3d(0,18px,0)',
                    }}
                  >
                    <div className="rounded-xl border border-white/[0.09] bg-[#0A0C12]/92 p-3">
                      <span className="font-mono-num text-[9px] uppercase text-[#64748B]">
                        VOLUME
                      </span>
                      <p className="mt-1 font-mono-num text-xs font-semibold text-[#F3F5F8] sm:text-sm">
                        14,820 kg
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.09] bg-[#0A0C12]/92 p-3">
                      <span className="font-mono-num text-[9px] uppercase text-[#64748B]">
                        STREAK
                      </span>
                      <p className="mt-1 font-mono-num text-xs font-semibold text-[#F59E0B] sm:text-sm">
                        21 days
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.09] bg-[#0A0C12]/92 p-3">
                      <span className="font-mono-num text-[9px] uppercase text-[#64748B]">
                        READINESS
                      </span>
                      <p className="mt-1 font-mono-num text-xs font-semibold text-[#34D399] sm:text-sm">
                        96%
                      </p>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div
                    className="flex h-24 items-end gap-2 rounded-xl border border-white/[0.09] bg-[#0A0C12]/92 p-3 transition-all duration-500"
                    style={{
                      transitionTimingFunction: SCENE_EASE,
                      opacity: aiDash3 ? 1 : 0,
                      transform: aiDash3 ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)',
                    }}
                  >
                    {[42, 68, 56, 80, 96, 74, 88, 64].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md"
                        style={{
                          height: `${aiDash3 ? h : 10}%`,
                          backgroundColor:
                            i === 4 ? '#F59E0B' : 'rgba(59,130,246,0.52)',
                          transition: `height 640ms ${SCENE_EASE} ${i * 40}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              SCENE 04 — MOTION & FRONT-END (VOLTREP LIVE SET LOGGER + 60 FPS • 0.4ms)
              ================================================================ */}
          <div
            aria-hidden={activeScene !== 3}
            className="absolute inset-0 flex items-center justify-center p-5 sm:p-8"
            style={getSceneStyle(3)}
          >
            <div className="grid w-full max-w-[840px] grid-cols-1 gap-3.5 md:grid-cols-12 md:gap-4">
              {/* Left Card: VOLTREP LIVE SET LOGGER (W1-W5 + Set Logged ✓) */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/[0.10] bg-[#0A0C12]/92 p-4 sm:p-5 md:col-span-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-num text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#F59E0B]">
                    VOLTREP LIVE SET LOGGER
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono-num text-[10px] font-semibold transition-all duration-400"
                    style={{
                      borderColor: s4SetLogged
                        ? 'rgba(52,211,153,0.65)'
                        : 'rgba(245,158,11,0.4)',
                      backgroundColor: s4SetLogged
                        ? 'rgba(52,211,153,0.16)'
                        : 'rgba(245,158,11,0.12)',
                      color: s4SetLogged ? '#34D399' : '#F59E0B',
                    }}
                  >
                    <span>Set Logged ✓</span>
                  </span>
                </div>

                {/* W1 - W5 Live Progression */}
                <div className="mt-5 grid grid-cols-5 items-end gap-2">
                  {VOLTREP_SETS.map((set, idx) => {
                    const active = idx < loggedSets;
                    const isPeak = idx === loggedSets - 1;
                    return (
                      <div key={set.id} className="flex flex-col items-center gap-2">
                        <div className="flex h-28 w-full items-end rounded-lg bg-white/[0.04] p-1">
                          <div
                            className="w-full rounded-md transition-all duration-500"
                            style={{
                              transitionTimingFunction: SCENE_EASE,
                              height: `${active ? set.h : 16}%`,
                              backgroundColor: isPeak
                                ? '#F59E0B'
                                : active
                                  ? 'rgba(59,130,246,0.68)'
                                  : 'rgba(255,255,255,0.08)',
                              boxShadow: isPeak
                                ? '0 0 18px rgba(245,158,11,0.45)'
                                : 'none',
                            }}
                          />
                        </div>
                        <span
                          className={`font-mono-num text-[10.5px] font-semibold ${
                            isPeak
                              ? 'text-[#F59E0B]'
                              : active
                                ? 'text-[#F3F5F8]'
                                : 'text-[#64748B]'
                          }`}
                        >
                          {set.id}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 font-mono-num text-[10.5px] text-[#8E9CAD]">
                  <span>INCLINE BENCH · PROGRESSION</span>
                  <span className="text-[#F59E0B]">
                    {VOLTREP_SETS[loggedSets - 1]?.reps}
                  </span>
                </div>
              </div>

              {/* Right Card: Production Telemetry Panel (60 FPS • 0.4ms + Deploy System) */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/[0.10] bg-[#0A0C12]/92 p-4 sm:p-5 md:col-span-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-num text-[11px] font-semibold text-[#34D399]">
                      60 FPS • 0.4ms
                    </span>
                    <span className="font-mono-num text-[10px] text-[#8E9CAD]">
                      GPU COMPOSITED
                    </span>
                  </div>

                  {/* Animated Frame Curve */}
                  <div className="rounded-xl border border-white/[0.08] bg-[#111318] p-3">
                    <svg viewBox="0 0 260 34" className="h-9 w-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="s4TelemetryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="55%" stopColor="#34D399" />
                          <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                      </defs>
                      <path
                        d={s4WavePath}
                        fill="none"
                        stroke="url(#s4TelemetryGrad)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Lighthouse Trio: 100 Perf • 100 A11y • 100 SEO */}
                  <div className="grid grid-cols-3 gap-2 font-mono-num text-center">
                    {[
                      { score: '100', label: 'Perf' },
                      { score: '100', label: 'A11y' },
                      { score: '100', label: 'SEO' },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl border border-[#34D399]/25 bg-[#34D399]/[0.06] py-2.5"
                      >
                        <p className="text-sm font-semibold text-[#34D399]">{m.score}</p>
                        <p className="text-[10px] text-[#94A3B8]">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cursor Clicking "Deploy System" */}
                <div className="relative mt-4 pt-2">
                  <div
                    className="flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 font-display text-xs font-semibold transition-all duration-300"
                    style={{
                      transform: s4Pressed ? 'scale(0.92)' : 'scale(1)',
                      backgroundColor: s4Deployed ? '#34D399' : '#F59E0B',
                      color: '#07080B',
                      boxShadow: s4Deployed
                        ? '0 0 24px rgba(52,211,153,0.42)'
                        : '0 6px 20px rgba(245,158,11,0.34)',
                    }}
                  >
                    {s4Deployed ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                    <span>{s4Deployed ? 'System Deployed ✓' : 'Deploy System'}</span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-50 will-change-transform"
                    style={{
                      opacity: s4CursorIn ? 1 : 0,
                      transform: s4CursorArrived
                        ? `translate3d(4px, 4px, 0) scale(${s4Pressed ? 0.86 : 1})`
                        : 'translate3d(72px, 34px, 0) scale(1)',
                      transition: `transform 520ms ${SCENE_EASE}, opacity 240ms ease`,
                    }}
                  >
                    <PointerSvg />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Clickable Chapter Indicator Pills Underneath with Smooth Progress Fill */}
        <div
          role="tablist"
          aria-label={locale === 'it' ? 'Capitoli dello showreel' : 'Showreel chapters'}
          className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
        >
          {CHAPTERS.map((ch) => {
            const isActive = activeScene === ch.id;
            const fillPct = isActive ? (sceneProgress * 100).toFixed(2) : '0';
            return (
              <button
                key={ch.code}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectScene(ch.id)}
                className={`group relative overflow-hidden rounded-full border px-4 py-2.5 text-left transition-all duration-300 active:scale-[0.98] ${
                  isActive
                    ? 'border-[#3B82F6]/60 bg-[#111318] text-[#F3F5F8] shadow-[0_10px_28px_rgba(0,0,0,0.42)]'
                    : 'border-white/[0.08] bg-[#0B0D12]/80 text-[#8E9CAD] hover:border-white/18 hover:text-[#F3F5F8]'
                }`}
              >
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`font-mono-num text-[11px] font-medium shrink-0 ${
                        isActive ? 'text-[#F59E0B]' : 'text-[#64748B] group-hover:text-[#93C5FD]'
                      }`}
                    >
                      {ch.code}
                    </span>
                    <span className="truncate font-display text-xs font-semibold tracking-tight sm:text-[13px]">
                      {ch.label}
                    </span>
                  </div>
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                    />
                  ) : null}
                </div>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-3 bottom-0 h-[2px] overflow-hidden rounded-full bg-white/[0.06]"
                >
                  <span
                    className="block h-full bg-gradient-to-r from-[#3B82F6] via-[#93C5FD] to-[#F59E0B]"
                    style={{ width: `${fillPct}%` }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
