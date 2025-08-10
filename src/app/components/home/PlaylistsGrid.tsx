import React from 'react';
import { HorizontalScroll } from '../HorizontalScroll';
import { CustomCard } from '../CustomCard';

interface PlaylistItem {
  id: string;
  name: string;
  image: string;
  tracks: number;
  owner?: string;
  onClick: () => void;
}

interface PlaylistsGridProps {
  items: PlaylistItem[];
}


export const PlaylistsGrid: React.FC<PlaylistsGridProps> = ({ items }) => {
  const handleNavigate = (onClick: () => void) => () => onClick();

  return (
    <section className="mt-8">
      <HorizontalScroll gapClassName="gap-6" ariaLabel="Your playlists">
        {items.map((playlist) => (
          <div key={playlist.id} className="w-[200px] md:w-[240px] lg:w-[240px] xl:w-[260px] 2xl:w-[280px]">
            <CustomCard
              id={playlist.id}
              imageSrc={playlist.image}
              imageAlt={playlist.name}
              title={playlist.name}
              subtitle={playlist.owner}
              onClick={handleNavigate(playlist.onClick)}
              playback={{ contextUri: `spotify:playlist:${playlist.id}` }}
              className=""
            />
          </div>
        ))}
      </HorizontalScroll>
    </section>
  );
};

export default PlaylistsGrid;