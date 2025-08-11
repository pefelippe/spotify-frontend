import { useEffect, useState } from 'react';

// Returns an average color for an image URL as an rgb() string.
export function useImageColor(imageUrl?: string, defaultColor: string = 'rgb(0, 0, 0)') {
  const [color, setColor] = useState<string>(defaultColor);

  useEffect(() => {
    if (!imageUrl) {
      setColor(defaultColor);
      return;
    }

    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const width = 10;
        const height = 10;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);
        const { data } = ctx.getImageData(0, 0, width, height);
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 16) continue; // skip very transparent pixels
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count += 1;
        }
        if (count > 0 && !isCancelled) {
          const avgR = Math.round(r / count);
          const avgG = Math.round(g / count);
          const avgB = Math.round(b / count);
          setColor(`rgb(${avgR}, ${avgG}, ${avgB})`);
        }
      } catch {
        // Ignore CORS/canvas errors; keep default color
        if (!isCancelled) setColor(defaultColor);
      }
    };

    img.onerror = () => {
      if (!isCancelled) setColor(defaultColor);
    };

    return () => {
      isCancelled = true;
    };
  }, [imageUrl, defaultColor]);

  return color;
}

