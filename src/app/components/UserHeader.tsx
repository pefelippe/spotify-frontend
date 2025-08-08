import React from 'react';

interface UserHeaderProps {
  userProfile: any;
  showEmail?: boolean;
  showExternalLink?: boolean;
  stats?: {
    followers?: number;
    playlists?: number;
    likedSongs?: number;
  };
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  userProfile,
  showEmail = false,
  showExternalLink = true,
  stats = {}
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
      <img
        src={userProfile?.images?.[0]?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
        alt={userProfile?.display_name || 'User'}
        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-700 shadow-xl"
      />
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-white-text mb-2">
          {userProfile?.display_name || 'Usuário'}
        </h1>
        
        {/* User Stats */}
        <div className="flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0 md:space-x-6 mb-4">
          {stats.followers && (
            <div className="text-center md:text-left">
              <p className="text-white-text font-semibold text-lg">
                {stats.followers.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm">seguidores</p>
            </div>
          )}
          
          {stats.playlists !== undefined && (
            <div className="text-center md:text-left">
              <p className="text-white-text font-semibold text-lg">
                {stats.playlists}
              </p>
              <p className="text-gray-400 text-sm">playlists</p>
            </div>
          )}

          {stats.likedSongs !== undefined && (
            <div className="text-center md:text-left">
              <p className="text-white-text font-semibold text-lg">
                {stats.likedSongs}
              </p>
              <p className="text-gray-400 text-sm">músicas curtidas</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-400 text-sm space-x-1">
          {showEmail && userProfile?.email && (
            <>
              <span>📧 {userProfile.email}</span>
              <span>•</span>
            </>
          )}
          {userProfile?.country && (
            <>
              <span>🌍 {userProfile.country}</span>
              <span>•</span>
            </>
          )}
          {userProfile?.product && (
            <>
              <span>🎵 {userProfile.product === 'premium' ? 'Premium' : 'Free'}</span>
              <span>•</span>
            </>
          )}
          <span>Usuário do Spotify</span>
        </div>

        {/* External Links */}
        {showExternalLink && userProfile?.external_urls?.spotify && (
          <div className="mt-4">
            <a
              href={userProfile.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-black rounded-full hover:bg-green-400 transition-colors"
            >
              <span className="mr-2">Ver no Spotify</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}; 