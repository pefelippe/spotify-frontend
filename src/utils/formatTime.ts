export function formatTime(milliseconds: number): string {
  const ms = Number.isFinite(milliseconds) ? Math.max(0, Math.floor(milliseconds)) : 0;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default formatTime;

