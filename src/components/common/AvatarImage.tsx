import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';

interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackName?: string;
  showFallbackBadge?: boolean;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  className = '',
  fallbackName = 'Soul Partner',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Gradient seeds based on name
  const getGradient = (name: string) => {
    const gradients = [
      'from-rose-400 via-rose-500 to-pink-600',
      'from-rose-500 via-fuchsia-600 to-rose-700',
      'from-amber-400 via-rose-500 to-purple-600',
      'from-rose-300 via-pink-400 to-rose-500',
      'from-rose-600 via-purple-600 to-indigo-700',
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return gradients[sum % gradients.length];
  };

  const initials = fallbackName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (hasError || !src) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${getGradient(
          fallbackName
        )} text-white ${className}`}
      >
        <div className="flex flex-col items-center justify-center text-center p-3">
          <span className="text-2xl font-serif font-medium tracking-wider mb-1 opacity-90 drop-shadow">
            {initials}
          </span>
          <span className="text-[11px] font-sans font-medium text-white/80 line-clamp-1">
            {fallbackName}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-rose-50/50 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
          <UserIcon className="w-8 h-8 text-neutral-300" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
