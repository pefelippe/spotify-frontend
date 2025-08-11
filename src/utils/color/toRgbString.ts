import type { Rgb } from './parseRgbString';

export function toRgbString({ r, g, b }: Rgb): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export default toRgbString;

