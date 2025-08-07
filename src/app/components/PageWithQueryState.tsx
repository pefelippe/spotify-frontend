import { ReactNode } from 'react';
import { QueryState } from './QueryState';

interface PageWithQueryStateProps {
  isLoading?: boolean;
  error?: any;
  loadingMessage?: string;
  errorMessage?: string;
  children?: ReactNode;
  headerContent?: ReactNode;
  className?: string;
}

export const PageWithQueryState = ({
  isLoading,
  error,
  loadingMessage,
  errorMessage,
  children,
  headerContent,
  className = 'p-6',
}: PageWithQueryStateProps) => {
  if (isLoading || error) {
    return (
      <div className={className}>
        {headerContent}
        <QueryState
          isLoading={isLoading}
          error={error}
          loadingMessage={loadingMessage}
          errorMessage={errorMessage}
        >
          {children}
        </QueryState>
      </div>
    );
  }

  return null;
};
