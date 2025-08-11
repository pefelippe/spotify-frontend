import React from 'react';
import { CustomButton } from '../../app/components/CustomButton';
import { PlayIcon, CheckIcon } from '../../app/components/SpotifyIcons';

interface ArtistHeaderProps {
  imageUrl: string;
  name: string;
  followers?: number;
  releasesCount?: number;
  genres?: string[];
  onPlay?: () => void;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
}

export const ArtistHeader: React.FC<ArtistHeaderProps> = ({ imageUrl, name, followers, onPlay, isFollowing, onToggleFollow }) => {
  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
      <img
        src={imageUrl}
        alt={name}
        className="h-28 md:h-40 lg:h-[230px] lg:w-[230px] rounded-full object-cover bg-black/50 shadow-2xl border-2 border-white/10"
      />
      <div className="flex-1 text-left">
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white-text mb-2">{name}</h2>
        <div className="mb-3">
          {followers ? <p className="text-gray-400 text-sm">{followers.toLocaleString()} seguidores</p> : null}
        </div>
        <div className="flex items-center gap-3">
          {onPlay ? (
            <CustomButton
              label="Reproduzir"
              onClick={onPlay}
              variant="spotify"
              customClassName="inline-flex items-center gap-2"
              icon={<PlayIcon size={18} className="ml-0.5" />}
            />
          ) : null}
          {onToggleFollow ? (
            <CustomButton
              label={isFollowing ? 'Seguindo' : '+ Seguir'}
              onClick={onToggleFollow}
              variant={isFollowing ? 'pwa' : 'outline'}
              customClassName={`inline-flex items-center gap-2 ${isFollowing ? 'text-white' : ''}`}
              icon={isFollowing ? <CheckIcon size={18} className="ml-0.5" /> : undefined}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ArtistHeader;

