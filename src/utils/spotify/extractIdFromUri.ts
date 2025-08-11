export function extractIdFromUri(uri?: string): string {
  if (!uri) return '';
  const parts = uri.split(':');
  return parts[2] || '';
}

export default extractIdFromUri;

