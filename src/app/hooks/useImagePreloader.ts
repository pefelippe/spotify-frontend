import { useState, useEffect } from 'react';

interface UseImagePreloaderProps {
  imageUrls: string[];
  priority?: boolean;
}

export const useImagePreloader = ({ imageUrls, priority = false }: UseImagePreloaderProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrls.length) {
      setIsLoading(false);
      return;
    }

    if (priority) {
      // For priority images, load immediately
      setIsLoading(false);
      return;
    }

    const preloadImages = async () => {
      const imagePromises = imageUrls.map((url) => {
        return new Promise<void>((resolve, reject) => {
          if (!url || url === '') {
            resolve();
            return;
          }

          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, url]));
            resolve();
          };
          img.onerror = () => {
            // Silently fail for failed images
            resolve();
          };
          img.src = url;
        });
      });

      try {
        await Promise.all(imagePromises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [imageUrls, priority]);

  const isImageLoaded = (url: string) => loadedImages.has(url);

  return {
    isLoading,
    isImageLoaded,
    loadedImages: Array.from(loadedImages),
  };
}; 