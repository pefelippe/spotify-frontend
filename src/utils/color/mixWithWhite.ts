import type { Rgb } from './parseRgbString';

export function mixWithWhite(color: Rgb, factor: number): Rgb {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const f = Math.max(0, Math.min(1, factor));
  return {
    r: clamp(color.r + (255 - color.r) * f),
    g: clamp(color.g + (255 - color.g) * f),
    b: clamp(color.b + (255 - color.b) * f),
  };
}

export default mixWithWhite;

