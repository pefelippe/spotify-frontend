import React from 'react';

interface UserHeaderProps {
  userProfile: any;
  showEmail?: boolean;
  showExternalLink?: boolean;
  stats?: {
    followers?: number;
    following?: number;
    playlists?: number;
    likedSongs?: number;
  };
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  userProfile,
  stats,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center  space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
      <img
        src={userProfile?.images?.[0]?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
        alt={userProfile?.display_name || 'User'}
        className="w-24 h-24 md:w-32 md:h-32 lg:w-[230px] lg:h-[230px] rounded-full object-cover border-4 border-gray-700 shadow-xl"
      />
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl lg:text-5xl font-bold text-white-text mb-2">
          {userProfile?.display_name || 'Usuário'}
        </h1>
        {stats && (
          <div className="mt-2 text-gray-300 text-sm lg:text-base flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            {typeof stats.followers === 'number' && (
              <span>
                {stats.followers.toLocaleString()} seguidores
              </span>
            )}
            {typeof stats.following === 'number' && (
              <span>
                {stats.following.toLocaleString()} seguindo
              </span>
            )}
            {typeof stats.playlists === 'number' && (
              <span>
                {stats.playlists.toLocaleString()} playlists públicas
              </span>
            )}
            {typeof stats.likedSongs === 'number' && (
              <span>
                {stats.likedSongs.toLocaleString()} músicas curtidas
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHeader;

