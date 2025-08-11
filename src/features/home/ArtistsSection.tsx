import React from 'react';
import { CustomHomeSection, CustomHomeSectionItem } from './CustomHomeSection';

interface ArtistsSectionProps {
  artists: Array<{ id: string; name: string; images?: { url: string }[] }>;
  onClickArtist: (artistId: string) => void;
  onShowMore?: () => void;
  title?: string;
}

export const ArtistsSection: React.FC<ArtistsSectionProps> = ({ artists, onClickArtist, onShowMore, title = 'Seus Artistas Favoritos' }) => {
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
      title={title}
      data={data}
      onClickData={onClickArtist}
      hasShowMore={!!onShowMore}
      onShowMore={onShowMore}
      actionText="Mostrar tudo"
      imageClassName="rounded-full"
      titleClassName="text-center"
      align="center"
    />
  );
};

export default ArtistsSection;

