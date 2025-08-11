import React from 'react';
import { UserAvatar } from '../../features/user/UserAvatar';
import { QuickPlaylists } from './QuickPlaylists';

interface WelcomeBannerProps {
  userProfile: { id: string; display_name?: string };
  likedSongsCount: number;
  userPlaylists: Array<{ id: string; name: string; images?: { url: string }[] } & Record<string, any>>;
  onClickLikedSongs: () => void;
  onClickPlaylist: (playlistId: string) => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userProfile,
  likedSongsCount,
  userPlaylists,
  onClickLikedSongs,
  onClickPlaylist,
}) => {
  return (
    <div className="w-full rounded-2xl bg-[rgb(30,30,30)] p-4 md:p-6 flex flex-col gap-4 md:gap-6">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden sm:block">
          <UserAvatar
            userId={userProfile.id}
            displayName={userProfile.display_name || 'Você'}
            size="lg"
            className="w-12 h-12 md:w-16 md:h-16"
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-gray-300 text-xs md:text-sm">Bem-vindo de volta</div>
          <div className="text-white text-lg md:text-2xl font-extrabold truncate">{userProfile.display_name || 'Você'}</div>
          <div className="text-gray-400 text-xs md:text-sm mt-1 truncate">Pronto para continuar ouvindo?</div>
        </div>
      </div>
      {(likedSongsCount > 0 || userPlaylists.length > 0) && (
        <div className="mt-1">
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
            variant="inCard"
          />
        </div>
      )}
    </div>
  );
};

export default WelcomeBanner;

