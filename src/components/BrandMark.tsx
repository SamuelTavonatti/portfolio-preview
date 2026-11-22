import { BRAND_ASSETS } from '../data/content';
import type { BrandMarkVariant } from '../types/portfolio';

interface BrandMarkProps {
  variant: BrandMarkVariant;
  size?: 'card' | 'hero';
}

export function BrandMark({ variant, size = 'card' }: BrandMarkProps) {
  const isHero = size === 'hero';

  if (variant === 'voltrep') {
    return (
      <div
        className="flex flex-col items-center justify-center select-none"
        aria-hidden="true"
      >
        <div className="relative inline-flex items-end">
          {/* Pure white dumbbell + lightning bolt crest above "ep" */}
          <svg
            viewBox="0 0 92 34"
            fill="none"
            className={`absolute right-0.5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] ${
              isHero ? '-top-6 h-8 w-auto' : '-top-4 h-6 w-auto'
            }`}
          >
            <rect x="6" y="13" width="3.5" height="8" rx="1.5" fill="#FFFFFF" />
            <rect x="12" y="9" width="4.5" height="16" rx="1.8" fill="#FFFFFF" />
            <rect x="19" y="11" width="4" height="12" rx="1.6" fill="#FFFFFF" />
            <rect x="23" y="15.2" width="12" height="3.6" rx="1.2" fill="#FFFFFF" />
            <path
              d="M49.5 3L37.5 18.2H45.2L42.3 31L54.8 15.2H46.9L49.5 3Z"
              fill="#FFFFFF"
            />
            <rect x="57" y="15.2" width="12" height="3.6" rx="1.2" fill="#FFFFFF" />
            <rect x="69" y="11" width="4" height="12" rx="1.6" fill="#FFFFFF" />
            <rect x="75.5" y="9" width="4.5" height="16" rx="1.8" fill="#FFFFFF" />
            <rect x="82.5" y="13" width="3.5" height="8" rx="1.5" fill="#FFFFFF" />
          </svg>

          <span
            className={`font-display font-bold tracking-[-0.04em] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)] ${
              isHero ? 'text-5xl sm:text-6xl' : 'text-[2.1rem] sm:text-[2.35rem]'
            } leading-none`}
          >
            VoltRep
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'esu') {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2.5 select-none"
        aria-hidden="true"
      >
        {/* Pure white monochrome ESU circular athlete + barbell emblem */}
        <svg
          viewBox="0 0 120 84"
          fill="none"
          className={`drop-shadow-[0_6px_22px_rgba(0,0,0,0.55)] ${
            isHero ? 'h-16 w-auto sm:h-20' : 'h-12 w-auto sm:h-14'
          }`}
        >
          <circle
            cx="60"
            cy="42"
            r="32"
            stroke="#FFFFFF"
            strokeOpacity="0.92"
            strokeWidth="2"
          />
          <circle cx="60" cy="30" r="4.5" fill="#FFFFFF" />
          <path
            d="M44 40L52.5 52.5L60 44L67.5 52.5L76 40L71 38.2L65 45.2L60 39.2L55 45.2L49 38.2L44 40Z"
            fill="#FFFFFF"
          />
          <path
            d="M53.2 53L60 65.5L66.8 53L60 57.6L53.2 53Z"
            fill="#FFFFFF"
          />
          <rect x="20" y="39.8" width="80" height="4.4" rx="2.2" fill="#FFFFFF" />
          <rect x="21" y="30" width="4.6" height="24" rx="2" fill="#FFFFFF" />
          <rect x="14.5" y="33.2" width="4.2" height="17.6" rx="1.8" fill="#FFFFFF" />
          <rect x="9" y="36.5" width="3.5" height="11" rx="1.5" fill="#FFFFFF" />
          <rect x="94.4" y="30" width="4.6" height="24" rx="2" fill="#FFFFFF" />
          <rect x="101.3" y="33.2" width="4.2" height="17.6" rx="1.8" fill="#FFFFFF" />
          <rect x="107.5" y="36.5" width="3.5" height="11" rx="1.5" fill="#FFFFFF" />
        </svg>

        <div className="text-center leading-tight">
          <span
            className={`block font-display font-bold tracking-[0.1em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)] ${
              isHero ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
            }`}
          >
            ESU
          </span>
          <span className="mt-1 block font-mono-num text-[9.5px] tracking-[0.2em] text-white/75 uppercase">
            Sensor Exercise You
          </span>
        </div>
      </div>
    );
  }

  // Official Trentino high-res monochrome wordmark inverted crisp pure white
  return (
    <img
      src={BRAND_ASSETS.trentinoMonoLogo}
      alt=""
      aria-hidden="true"
      decoding="async"
      className={`w-auto object-contain brightness-0 invert drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)] ${
        isHero ? 'max-h-20 max-w-[66%]' : 'max-h-14 max-w-[72%]'
      }`}
    />
  );
}
