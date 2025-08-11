export function formatDuration(milliseconds: number): string {
  if (!milliseconds || Number.isNaN(milliseconds)) {
    return '0:00';
  }
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default formatDuration;

