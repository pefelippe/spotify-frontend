import React from 'react';
import { HeartIcon } from '../../../app/components/SpotifyIcons';

interface TrackInfoProps {
  track?: any;
  isLiked?: boolean;
  onArtistClick?: (artistId: string) => void;
  onLikeToggle?: () => void;
  size?: 'small' | 'large';
}

export const TrackInfo: React.FC<TrackInfoProps> = ({
  track,
  isLiked = false,
  onArtistClick,
  onLikeToggle,
  size = 'small'
}) => {
  if (!track) {
    return (
      <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
        <div className={`${size === 'small' ? 'w-10 h-10 lg:w-12 lg:h-12' : 'w-80 h-80 lg:w-full lg:h-auto lg:aspect-square'} rounded-md bg-gray-800 flex items-center justify-center`}>
          <span className="text-gray-500 text-lg">🎵</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-gray-400 text-sm lg:text-base font-normal">
            Nenhuma música
          </div>
          <div className="text-gray-500 text-xs lg:text-sm">
            Clique para tocar
          </div>
        </div>
      </div>
    );
  }

  const artistsDisplay = track.artists.map((artist: any, index: number) => (
    <span key={artist.uri || index}>
      <span
        className="hover:underline hover:text-white cursor-pointer transition-colors duration-200"
        onClick={() => onArtistClick?.(artist.uri?.split(':')[2] || '')}
      >
        {artist.name}
      </span>
      {index < track.artists.length - 1 && ', '}
    </span>
  ));

  const imageSize = size === 'small' 
    ? 'w-10 h-10 lg:w-12 lg:h-12 rounded-md' 
    : 'w-full h-full rounded-lg shadow-2xl object-cover animate-fade-in-scale';

  return (
    <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0  lg:max-w-[25%] track-info-area">
      <div className="relative overflow-hidden rounded-md group">
        <img
          src={track.album.images[0]?.url}
          alt={track.name}
          className={`${imageSize} transition-transform duration-200 group-hover:scale-105`}
          key={track.id}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 mb-0.5">
          <h4 className={`text-white ${size === 'small' ? 'text-xs lg:text-sm' : 'text-3xl lg:text-5xl'} font-normal truncate hover:underline cursor-pointer transition-colors`}>
            {track.name}
          </h4>
          {onLikeToggle && (
            <button
              onClick={onLikeToggle}
              className={`p-1 lg:p-1.5 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 ml-2 hover:scale-110 ${
                isLiked
                  ? 'text-green-500 hover:text-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <HeartIcon size={size === 'small' ? 16 : 32} filled={isLiked} />
            </button>
          )}
        </div>
        <div className={`text-gray-400 ${size === 'small' ? 'text-[11px] lg:text-xs' : 'text-lg lg:text-xl'} truncate`}>
          {artistsDisplay}
        </div>
      </div>
    </div>
  );
};