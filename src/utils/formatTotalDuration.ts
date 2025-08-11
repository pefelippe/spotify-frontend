export function formatTotalDurationFromPages(paginated: any, selector: (item: any) => number): string {
  if (!paginated?.pages) {
    return '';
  }

  const totalMs = paginated.pages.reduce((total: number, page: any) => {
    return total + page.items.reduce((pageTotal: number, item: any) => {
      return pageTotal + (selector(item) || 0);
    }, 0);
  }, 0);

  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
}

export default formatTotalDurationFromPages;

