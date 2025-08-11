import React from 'react';
import { HorizontalScroll } from '../HorizontalScroll';
import { CustomCard } from '../CustomCard';

interface RecentlyPlayedGridProps {
  items: Array<{ id: string; name: string; artists: string; image: string; onClick: () => void }>;
}

export const RecentlyPlayedGrid: React.FC<RecentlyPlayedGridProps> = ({ items }) => {
  return (
    <section className="mt-8">
      {/* Single horizontal line across breakpoints */}
      <HorizontalScroll gapClassName="gap-6" ariaLabel="Recently played">
        {items.map((item) => (
          <div key={item.id} className="w-[200px] md:w-[240px] lg:w-[240px] xl:w-[260px] 2xl:w-[280px]">
            <CustomCard
              id={item.id}
              imageSrc={item.image}
              imageAlt={item.name}
              title={item.name}
              subtitle={item.artists}
              onClick={item.onClick}
              playback={{ uri: undefined, contextUri: undefined }}
            />
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
};

export default RecentlyPlayedGrid;
