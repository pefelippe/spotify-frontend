import React from 'react';
import { CustomHomeSection, CustomHomeSectionItem } from './CustomHomeSection';

interface TopArtistsSectionProps {
  artists: Array<{ id: string; name: string; images?: { url: string }[] }>;
  onClickArtist: (artistId: string) => void;
  onShowMore?: () => void;
}

export const TopArtistsSection: React.FC<TopArtistsSectionProps> = ({ artists, onClickArtist, onShowMore }) => {
  if (!artists || artists.length === 0) {
    return null;
  }
  const data: CustomHomeSectionItem[] = artists.map((artist) => ({
    id: artist.id,
    title: artist.name,
    imageSrc: artist.images?.[0]?.url || 'https://via.placeholder.com/150x150/333/fff?text=♪',
    playback: { contextUri: `spotify:artist:${artist.id}` },
  }));

  return (
    <CustomHomeSection
      title="Seus Artistas Favoritos"
      data={data}
      onClickData={onClickArtist}
      hasShowMore={!!onShowMore}
      onShowMore={onShowMore}
      actionText="Mostrar tudo"
    />
  );
};

export default TopArtistsSection;

