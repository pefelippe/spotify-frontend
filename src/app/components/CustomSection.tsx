import React, { useState } from 'react';
import { HorizontalScroll } from '../layout/HorizontalScroll';
import { CustomCard, PlaybackIntent } from './CustomCard';

export interface CustomHomeSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
  playback?: PlaybackIntent;
  placeholder?: React.ReactNode;
}

interface CustomHomeSectionProps {
  title: string;
  data: CustomHomeSectionItem[];
  onClickData: (itemId: string) => void;
  hasShowMore?: boolean;
  onShowMore?: () => void;
  actionText?: string;
  itemWidthClassName?: string;
  className?: string;
  isLoading?: boolean;
  skeletonCount?: number;
  imageClassName?: string;
  titleClassName?: string;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<{ title: string; onAction?: () => void; actionText?: string; className?: string }> = ({ title, onAction, actionText = 'Ver tudo', className }) => {
  return (
    <div className={`lg:ml-4 mb-2 flex items-center justify-between ${className || ''}`}>
      <h2 onClick={onAction} className={` text-white text-2xl font-bold tracking-tight ${actionText ? 'cursor-pointer hover:underline' : ''}`}>{title}</h2>
      {onAction && (
        <button
          onClick={onAction}
          className="text-gray-400 hover:text-white text-sm md:text-base font-medium flex items-center transition-colors duration-200 group cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const CustomSection: React.FC<CustomHomeSectionProps> = ({
  title,
  data,
  onClickData,
  hasShowMore = false,
  onShowMore,
  actionText = 'Ver tudo',
  itemWidthClassName,
  className,
  isLoading = false,
  skeletonCount = 8,
  imageClassName,
  titleClassName,
  align,
}) => {
  const widthClass = itemWidthClassName || 'w-[220px] md:w-[260px] lg:w-[260px] xl:w-[300px] 2xl:w-[320px]';
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className={`animate-slide-in-left ${className || ''}`}>
      <SectionHeader
        title={title}
        onAction={hasShowMore ? onShowMore : undefined}
        actionText={hasShowMore ? actionText : ''}
      />
      <HorizontalScroll gapClassName="gap-1" ariaLabel={title}>
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <div key={`skeleton-${idx}`} className={widthClass}>
                <div className="rounded-2xl p-1 ">
                  <div className="w-full aspect-square rounded-md bg-gray-700 animate-shimmer mb-2" />
                  <div className="h-4 w-3/4 bg-gray-700 rounded animate-shimmer mb-1.5" />
                  <div className="h-3 w-1/2 bg-gray-700 rounded animate-shimmer" />
                </div>
              </div>
            ))
          : data.map((item) => (
              <div key={item.id} className={widthClass}>
                <CustomCard
                  id={item.id}
                  imageSrc={item.imageSrc}
                  imageAlt={item.title}
                  title={item.title}
                  subtitle={item.subtitle}
                  onClick={() => onClickData(item.id)}
                  playback={item.playback}
                  isActive={!!item.playback && activeId === item.id}
                  imageClassName={imageClassName}
                  titleClassName={titleClassName}
                  align={align}
                  placeholder={item.placeholder}
                  onTogglePlay={() => {
                    if (activeId === item.id) {
                      setActiveId(null);
                    } else {
                      setActiveId(item.id);
                    }
                  }}
                />
              </div>
            ))}
      </HorizontalScroll>
    </section>
  );
};

export default CustomSection;

