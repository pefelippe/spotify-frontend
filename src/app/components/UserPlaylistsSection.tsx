import React from 'react';
import { CustomSection, CustomHomeSectionItem } from './CustomSection';
import { HeartIcon } from './SpotifyIcons';

interface UserPlaylistsSectionProps {
  playlists: Array<{ id: string; name: string; owner?: { display_name?: string }; images?: { url: string }[] }>;
  onClickPlaylist: (playlistId: string) => void;
  onShowMore?: () => void;
  likedSongsCount?: number;
  onClickLikedSongs?: () => void;
  currentUserName?: string;
}

export const UserPlaylistsSection: React.FC<UserPlaylistsSectionProps> = ({ playlists, onClickPlaylist, onShowMore, likedSongsCount = 0, onClickLikedSongs, currentUserName }) => {
  if ((!playlists || playlists.length === 0) && !likedSongsCount) {
        return null;
  }
  const data: CustomHomeSectionItem[] = [
    ...(likedSongsCount > 0
      ? ([{
          id: 'liked',
          title: 'Músicas Curtidas',
          subtitle: currentUserName || undefined,
          imageSrc: '',
          placeholder: (
            <div className="w-full h-full rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <HeartIcon size={42} className="text-white" filled />
            </div>
          ),
          playback: { contextUri: 'spotify:user:collection:tracks' },
        }] as const)
      : []),
    ...playlists.slice(0, 11).map((playlist) => ({
      id: playlist.id,
      title: playlist.name,
      subtitle: playlist.owner?.display_name,
      imageSrc: playlist.images?.[0]?.url || '',
      playback: { contextUri: `spotify:playlist:${playlist.id}` },
    })),
  ];

  return (
    <CustomSection
      title="Suas Playlists"
      data={data}
      onClickData={(id) => (id === 'liked' ? onClickLikedSongs && onClickLikedSongs() : onClickPlaylist(id))}
      hasShowMore={!!onShowMore}
      onShowMore={onShowMore}
      actionText="Mostrar tudo"
      imageClassName="rounded-md"
      titleClassName="text-sm"
    />
  );
};

export default UserPlaylistsSection;

