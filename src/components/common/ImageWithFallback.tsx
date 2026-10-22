import React, { useState } from 'react';
import { getCategoryFallbackImage } from '../../utils/formatters';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  category?: string;
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'DailyNest Product',
  category,
  fallbackSrc,
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const effectiveFallback = fallbackSrc || getCategoryFallbackImage(category, alt);
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(effectiveFallback);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton blur placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
      )}
      <img
        src={imgSrc || fallbackSrc}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
