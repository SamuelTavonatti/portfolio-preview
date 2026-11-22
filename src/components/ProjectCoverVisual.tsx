import type { CaseStudy, Locale } from '../types/portfolio';
import { BrandMark } from './BrandMark';
import { ResilientImage } from './ResilientImage';

interface ProjectCoverVisualProps {
  study: CaseStudy;
  locale: Locale;
  size?: 'card' | 'hero';
}

function VoltRepAtmosphericBackdrop({ size = 'card' }: { size?: 'card' | 'hero' }) {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden bg-[#08090D] select-none"
      aria-hidden="true"
    >
      {/* Sleek dark-graphite architectural lighting gradient + subtle carbon-matte shadow texture */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 50% 32%, rgba(255, 255, 255, 0.085) 0%, rgba(24, 28, 38, 0.55) 45%, rgba(7, 8, 11, 0.98) 100%)',
        }}
      />
      {/* Subtle architectural diagonal light shafts & carbon-matte micro-grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(128deg, transparent 22%, rgba(255, 255, 255, 0.06) 44%, transparent 62%), repeating-linear-gradient(135deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 5px)',
        }}
      />
      {/* Consistent dark vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 35%, rgba(5, 6, 9, 0.72) 100%)',
        }}
      />

      {/* Centered Pure White VoltRep Logo Only */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
        <BrandMark variant="voltrep" size={size} />
      </div>
    </div>
  );
}

function EsuAtmosphericBackdrop({ size = 'card' }: { size?: 'card' | 'hero' }) {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden bg-[#070910] select-none"
      aria-hidden="true"
    >
      {/* Moody atmospheric dark-blue/graphite studio rim-light gradient */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        style={{
          background:
            'radial-gradient(ellipse 78% 64% at 50% 38%, rgba(59, 130, 246, 0.22) 0%, rgba(17, 24, 39, 0.68) 46%, rgba(7, 8, 11, 0.98) 100%)',
        }}
      />
      {/* Subtle optical wave curves in deep blue-graphite */}
      <svg
        viewBox="0 0 640 400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      >
        <defs>
          <linearGradient id="esuWaveRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-20 265 C 140 195, 290 315, 450 230 C 530 188, 600 208, 660 185"
          fill="none"
          stroke="url(#esuWaveRim)"
          strokeWidth="1.2"
        />
        <path
          d="M-20 295 C 155 225, 305 345, 465 258 C 545 215, 605 232, 660 212"
          fill="none"
          stroke="url(#esuWaveRim)"
          strokeOpacity="0.65"
          strokeWidth="1"
        />
        <path
          d="M-20 140 C 170 195, 320 95, 500 165 C 570 192, 620 175, 660 155"
          fill="none"
          stroke="url(#esuWaveRim)"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
      </svg>
      {/* Consistent dark vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 32%, rgba(5, 6, 9, 0.76) 100%)',
        }}
      />

      {/* Centered Pure White ESU Logo + SENSOR EXERCISE YOU Only */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
        <BrandMark variant="esu" size={size} />
      </div>
    </div>
  );
}

export function ProjectCoverVisual({
  study,
  locale,
  size = 'card',
}: ProjectCoverVisualProps) {
  if (study.brandMark === 'voltrep') {
    return <VoltRepAtmosphericBackdrop size={size} />;
  }

  if (study.brandMark === 'esu') {
    return <EsuAtmosphericBackdrop size={size} />;
  }

  // Keep authentic Dolomites mountain landscape at dusk with pure white TRENTINO logo
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#07080B]">
      <ResilientImage
        src={study.image}
        alt={study.imageAlt[locale]}
        fallbackLabel={study.fallbackLabel}
        aspectClass="aspect-[16/10]"
        width={1200}
        height={750}
        priority
        className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#07080B]/88 via-[#07080B]/48 to-[#07080B]/26 p-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      >
        <BrandMark variant={study.brandMark} size={size} />
      </div>
    </div>
  );
}
