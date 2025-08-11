import React from 'react';
// No play button for artists per requirement
import { HorizontalScroll } from '../HorizontalScroll';
import { CustomCard } from '../CustomCard';

interface TopArtistItem {
  id: string;
  name: string;
  image: string;
  onClick: () => void;
}

interface TopArtistsGridProps {
  items: TopArtistItem[];
}

export const TopArtistsGrid: React.FC<TopArtistsGridProps> = ({ items }) => {
  return (
    <section className="mt-8">
      <HorizontalScroll gapClassName="gap-6" ariaLabel="Top artists">
        {items.map((artist) => (
          <div key={artist.id} className="w-[200px] md:w-[240px] lg:w-[240px] xl:w-[260px] 2xl:w-[280px]">
            <CustomCard
              id={artist.id}
              imageSrc={artist.image}
              imageAlt={artist.name}
              title={artist.name}
              onClick={artist.onClick}
            />
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
};

export default TopArtistsGrid;
