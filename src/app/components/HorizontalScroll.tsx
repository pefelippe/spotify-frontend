import React, { useEffect, useRef, useState } from 'react';
import { ChevronRightIcon } from './SpotifyIcons';

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
  gapClassName?: string;
  ariaLabel?: string;
}

/**
 * A simple horizontal scroller that renders its children in a single row.
 * - Hides native scrollbars
 * - Enables smooth horizontal scrolling with optional snap behavior
 */
export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className,
  gapClassName,
  ariaLabel,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const overflow = el.scrollWidth > el.clientWidth + 1; // tolerance
    setHasOverflow(overflow);
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateScrollState();
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const onScroll = () => updateScrollState();
    el.addEventListener('scroll', onScroll);
    const onResize = () => updateScrollState();
    window.addEventListener('resize', onResize);
    const id = window.setTimeout(updateScrollState, 0);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(id);
    };
  }, [children]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const amount = Math.max(200, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className={`relative ${className || ''}`}>
      <div
        ref={containerRef}
        className="no-scrollbar overflow-x-auto overflow-y-hidden scroll-smooth"
        aria-label={ariaLabel}
        role="list"
      >
        <div className={`flex items-stretch ${gapClassName ?? 'gap-6'} snap-x snap-mandatory`}>
          {React.Children.map(children, (child, index) => (
            <div className="shrink-0 snap-start" role="listitem" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
      {hasOverflow && (
        <>
          <button
            aria-label="Scroll left"
            onClick={() => scrollByAmount('left')}
            className={`hidden lg:flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white w-9 h-9 shadow-md transition-opacity pointer-events-auto ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <span className="rotate-180 inline-flex"><ChevronRightIcon size={20} /></span>
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollByAmount('right')}
            className={`hidden lg:flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white w-9 h-9 shadow-md transition-opacity pointer-events-auto ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <ChevronRightIcon size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default HorizontalScroll;

