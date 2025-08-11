export function formatAddedDate(dateString: string): string {
  if (!dateString) {
    return 'Data desconhecida';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Data inválida';
  }

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'há 1 dia';
  }
  if (diffDays < 7) {
    return `há ${diffDays} dias`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'há 1 semana' : `há ${weeks} semanas`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? 'há 1 mês' : `há ${months} meses`;
  }
  const years = Math.floor(diffDays / 365);
  return years === 1 ? 'há 1 ano' : `há ${years} anos`;
}

export default formatAddedDate;

