import React from 'react';
import { UserAvatar } from '../hooks/UserAvatar';
interface WelcomeBannerProps {
  userProfile: { id: string; display_name?: string };
  likedSongsCount: number;
  userPlaylists: Array<{ id: string; name: string; images?: { url: string }[] } & Record<string, any>>;
  onClickLikedSongs: () => void;
  onClickPlaylist: (playlistId: string) => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userProfile,
}) => {
  return (
    <div className="w-full rounded-2xl bg-[rgb(30,30,30)] p-4 flex flex-col gap-1">
      <div className="flex items-center gap-4 md:gap-6">
        <div>
          <UserAvatar
            userId={userProfile.id}
            displayName={userProfile.display_name || 'Você'}
            size="lg"
            className="w-12 h-12 md:w-16 md:h-16"
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <span className="text-gray-300 text-xs md:text-sm">Bem-vindo de volta</span>
          <p className="text-white py-0.5 text-lg md:text-2xl font-extrabold truncate">{userProfile.display_name || 'Você'}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;

