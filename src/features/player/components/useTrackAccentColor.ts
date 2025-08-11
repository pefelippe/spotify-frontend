import { useMemo } from 'react';
import { useImageColor } from './useImageColor';
import { parseRgbString } from '../../../utils/color/parseRgbString';
import { parseHexString } from '../../../utils/color/parseHexString';
import { toRgbString } from '../../../utils/color/toRgbString';
import { mixWithWhite } from '../../../utils/color/mixWithWhite';

export interface TrackAccentOptions {
  fallbackAccent?: string; // hex or rgb()
  tintAlpha?: number; // 0..1
  brightenFactor?: number; // 0..1
}

export function useTrackAccentColor(imageUrl?: string, options?: TrackAccentOptions) {
  const fallbackAccent = options?.fallbackAccent ?? '#22c55e';
  const tintAlpha = options?.tintAlpha ?? 0.38;
  const brightenFactor = options?.brightenFactor ?? 0.25;

  const avgColor = useImageColor(imageUrl, 'rgb(0,0,0)');

  return useMemo(() => {
    // Determine base accent color from avgColor or fallback
    const parsed = parseRgbString(avgColor || '');
    let baseAccent: string = fallbackAccent;
    if (parsed) {
      const luminance = 0.2126 * parsed.r + 0.7152 * parsed.g + 0.0722 * parsed.b;
      baseAccent = luminance < 70 ? fallbackAccent : toRgbString(parsed);
    }

    // Brighten for better visibility
    const fromRgb = parseRgbString(baseAccent);
    const fromHex = parseHexString(baseAccent);
    const source = fromRgb ?? fromHex ?? { r: 34, g: 197, b: 94 }; // spotify green
    const bright = mixWithWhite(source, brightenFactor);
    const accentColor = toRgbString(bright);

    // Tint as rgba with provided alpha
    const tint = parseRgbString(avgColor || '') ?? { r: 0, g: 0, b: 0 };
    const tintRgba = `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${tintAlpha})`;

    return {
      avgColor,
      baseAccentColor: baseAccent,
      accentColor,
      tintRgba,
    };
  }, [avgColor, brightenFactor, fallbackAccent, tintAlpha]);
}

