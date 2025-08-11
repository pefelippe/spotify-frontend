import { ReactNode, useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollListProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  className?: string;
  itemClassName?: string;
  threshold?: number;
}

export const InfiniteScrollList = ({
  items,
  renderItem,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  loadingComponent,
  emptyComponent,
  className = '',
  itemClassName = '',
  threshold = 100,
}: InfiniteScrollListProps) => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const element = loadingRef.current;
    if (!element) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: `${threshold}px`,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [handleObserver, threshold]);

  if (items.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={itemClassName}
        >
          {renderItem(item, index)}
        </div>
      ))}

      <div ref={loadingRef} className="flex justify-center py-4">
        {isFetchingNextPage && (
          loadingComponent || (
            <div className="text-white-text text-sm">Carregando mais...</div>
          )
        )}
      </div>
    </div>
  );
};
