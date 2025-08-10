import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { HorizontalScroll } from '../HorizontalScroll';
import { CustomCard, PlaybackIntent } from '../CustomCard';

export interface CustomHomeSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
  playback?: PlaybackIntent;
}

interface CustomHomeSectionProps {
  title: string;
  data: CustomHomeSectionItem[];
  onClickData: (itemId: string) => void;
  hasShowMore?: boolean;
  onShowMore?: () => void;
  actionText?: string;
  itemWidthClassName?: string; // optional override for card widths
  className?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

export const CustomHomeSection: React.FC<CustomHomeSectionProps> = ({
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

export default CustomHomeSection;

