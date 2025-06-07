import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  webpSrc = null,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true, // Only trigger once when it comes into view
  });

  // Determine which image source to use
  const getImageSrc = () => {
    // Try WebP first if supported and available
    if (webpSrc && supportsWebP()) {
      return webpSrc;
    }
    return src;
  };

  // Check WebP support
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc && !hasError) {
      // Try fallback image
      setHasError(false);
    }
  };

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : getImageSrc();

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} {...props}>
      {/* Placeholder while loading */}
      {!isLoaded && inView && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual image */}
      {inView && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy" // Native lazy loading as backup
        />
      )}
      
      {/* Fallback for when image is not in view */}
      {!inView && (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default LazyImage; 