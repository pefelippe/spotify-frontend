export function extractIdFromUri(uri?: string): string {
  // Keep as util since it's used in multiple files
  if (!uri) return '';
  const parts = uri.split(':');
  return parts[2] || '';
}

export default extractIdFromUri;

