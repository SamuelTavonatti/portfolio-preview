import { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackLabel: string;
  aspectClass?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function ResilientImage({
  src,
  alt,
  fallbackLabel,
  aspectClass = 'aspect-[16/10]',
  className = '',
  imgClassName = 'object-cover object-center',
  priority = false,
  width = 1200,
  height = 750,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#151921] ${aspectClass} ${className}`}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`h-full w-full ${imgClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#151921] via-[#18202D] to-[#11151C] px-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#1C222D] text-[#93C5FD]">
            <Layers className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-display text-sm font-medium text-[#B8C2CF]">
            {fallbackLabel}
          </span>
        </div>
      )}
    </div>
  );
}
