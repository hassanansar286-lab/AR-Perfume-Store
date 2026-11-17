import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export function ResilientImage({ src, alt, title, className = '' }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EFECE6] via-[#E6E1D8] to-[#DAD3C7] text-[#5C5954] p-6 text-center ${className}`}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="mb-3 text-[#8C6D3F]"
          aria-hidden="true"
        >
          <path d="M9 3h6v3H9z" />
          <path d="M10 6h4v2h-4z" />
          <rect x="6" y="8" width="12" height="13" rx="2" />
          <path d="M9 13h6" />
        </svg>
        <span className="font-serif text-base font-medium text-[#161514]">{title}</span>
        <span className="mt-1 text-xs text-[#5C5954]">AR PERFUME STORE</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
