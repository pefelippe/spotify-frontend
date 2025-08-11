export type Rgb = { r: number; g: number; b: number };

export function parseRgbString(input: string): Rgb | null {
  const match = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(input || '');
  if (!match) {
    return null;
  }
  return { r: parseInt(match[1], 10), g: parseInt(match[2], 10), b: parseInt(match[3], 10) };
}

export default parseRgbString;

