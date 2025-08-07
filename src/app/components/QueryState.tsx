import { ReactNode } from 'react';

interface QueryStateProps {
  isLoading?: boolean;
  error?: any;
  loadingMessage?: string;
  errorMessage?: string;
  children?: ReactNode;
  className?: string;
  centered?: boolean;
}

export const QueryState = ({
  isLoading,
  error,
  loadingMessage = 'Carregando...',
  errorMessage = 'Erro ao carregar dados. Tente novamente.',
  children,
  className = '',
  centered = true,
}: QueryStateProps) => {
  const containerClasses = centered
    ? 'flex items-center justify-center py-12'
    : 'py-4';

  if (isLoading) {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="text-white-text">{loadingMessage}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${containerClasses} ${className}`}>
        <div className="text-center">
          <div className="text-red-500">{errorMessage}</div>
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    );
  }

  return null;
};
