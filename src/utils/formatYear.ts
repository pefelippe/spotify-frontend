export function formatYear(dateString: string): number {
  return new Date(dateString).getFullYear();
}

export default formatYear;

