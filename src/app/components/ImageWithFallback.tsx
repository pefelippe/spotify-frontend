import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=♪',
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (currentSrc === fallbackSrc) {
      // Already using fallback, don't retry
      setIsLoading(false);
      return;
    }
    
    setHasError(true);
    setCurrentSrc(fallbackSrc);
    setIsLoading(true);
  };

  // Update src when prop changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-md" />
      )}
      
      {/* Actual image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        loading="lazy"
      />
    </div>
  );
}; 