import React from 'react';
import { UserAvatar } from '../UserAvatar';
import { HeartIcon } from '../SpotifyIcons';

interface LikedSongsHeaderProps {
  user: { id?: string; display_name?: string } | undefined;
  likedSongsCount: number;
  totalDurationText?: string;
  onClickUser: (userId: string) => void;
}

export const LikedSongsHeader: React.FC<LikedSongsHeaderProps> = ({ user, likedSongsCount, totalDurationText, onClickUser }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
      <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg shadow-2xl flex items-center justify-center">
        <HeartIcon size={64} className="text-white" filled />
      </div>
      <div className="flex-1 text-center md:text-left">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">Playlist</p>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white-text mb-4">Músicas Curtidas</h1>
        <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-400 text-sm space-x-1">
          <div className="flex items-center space-x-2">
            <UserAvatar userId={user?.id || ''} displayName={user?.display_name || ''} size="md" />
            <span className="font-medium text-white-text hover:underline cursor-pointer hover:text-green-500" onClick={() => onClickUser(user?.id || '')}>
              {user?.display_name || 'Você'}
            </span>
          </div>
          <span>•</span>
          <span>{likedSongsCount} músicas</span>
          {totalDurationText ? (
            <>
              <span>•</span>
              <span>{totalDurationText}</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LikedSongsHeader;

