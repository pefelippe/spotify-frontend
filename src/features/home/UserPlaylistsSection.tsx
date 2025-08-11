import React from 'react';
import { CustomHomeSection, CustomHomeSectionItem } from './CustomHomeSection';

interface UserPlaylistsSectionProps {
  playlists: Array<{ id: string; name: string; owner?: { display_name?: string }; images?: { url: string }[] }>;
  onClickPlaylist: (playlistId: string) => void;
  onShowMore?: () => void;
}

export const UserPlaylistsSection: React.FC<UserPlaylistsSectionProps> = ({ playlists, onClickPlaylist, onShowMore }) => {
  if (!playlists || playlists.length === 0) {
    return null;
  }
  const data: CustomHomeSectionItem[] = playlists.slice(0, 12).map((playlist) => ({
    id: playlist.id,
    title: playlist.name,
    subtitle: playlist.owner?.display_name,
    imageSrc: playlist.images?.[0]?.url || '',
    playback: { contextUri: `spotify:playlist:${playlist.id}` },
  }));

  return (
    <CustomHomeSection
      title="Suas Playlists"
      data={data}
      onClickData={onClickPlaylist}
      hasShowMore={!!onShowMore}
      onShowMore={onShowMore}
      actionText="Mostrar tudo"
    />
  );
};

export default UserPlaylistsSection;

