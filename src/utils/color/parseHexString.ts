import type { Rgb } from './parseRgbString';

export function parseHexString(hex: string): Rgb | null {
  const normalized = (hex || '').replace('#', '').trim();
  if (normalized.length !== 6) {
    return null;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) {
    return null;
  }
  return { r, g, b };
}

export default parseHexString;

