import React from 'react';
import { QuickPlaylists } from './QuickPlaylists';

interface QuickPlaylistsStandaloneProps {
  likedSongsCount: number;
  userPlaylists: Array<{ id: string; name: string; images?: { url: string }[] } & Record<string, any>>;
  onClickLikedSongs: () => void;
  onClickPlaylist: (playlistId: string) => void;
}

export const QuickPlaylistsStandalone: React.FC<QuickPlaylistsStandaloneProps> = ({
  likedSongsCount,
  userPlaylists,
  onClickLikedSongs,
  onClickPlaylist,
}) => {
  if (likedSongsCount <= 0 && userPlaylists.length === 0) {
    return null;
  }
  return (
    <QuickPlaylists
      items={[
        ...(likedSongsCount > 0
          ? ([{
              id: 'liked',
              name: `Músicas Curtidas (${likedSongsCount})`,
              image: '',
              isLiked: true,
              onClick: onClickLikedSongs,
            }] as const)
          : []),
        ...userPlaylists.slice(0, 7).map((pl: any) => ({
          id: pl.id,
          name: pl.name,
          image: pl.images?.[0]?.url || '',
          onClick: () => onClickPlaylist(pl.id),
        })),
      ]}
    />
  );
};

export default QuickPlaylistsStandalone;

