import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  priority?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

const defaultFallback = 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=♪';

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = defaultFallback,
  size = 'md',
  onClick,
  priority = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const finalSrc = hasError ? fallbackSrc : src;
  const shouldLoad = priority || isInView;

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 image-loading rounded-md" />
      )}
      
      {/* Error fallback */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 bg-gray-800 rounded-md flex items-center justify-center">
          <span className="text-white text-xs">♪</span>
        </div>
      )}

      {/* Actual image */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={finalSrc}
          alt={alt}
          className={`w-full h-full object-cover rounded-md transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100 image-loaded'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}; 