import React from 'react';
import { HeartIcon } from '@/app/components/SpotifyIcons';

type TrackInfoProps = {
  track: SpotifyTrack | null;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
  onArtistClick: (artistId: string, e: React.MouseEvent) => void;
};

export const TrackInfo: React.FC<TrackInfoProps> = ({ track, isLiked, onLike, onArtistClick }) => {
  if (!track) {
    return (
      <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-md bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500 text-lg">🎵</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-gray-400 text-sm lg:text-base font-normal">Nenhuma música</div>
          <div className="text-gray-500 text-xs lg:text-sm">Clique para tocar</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-md group">
        <img src={track.album.images[0]?.url} alt={track.name} className="w-12 h-12 lg:w-14 lg:h-14 rounded-md object-cover transition-transform duration-200 group-hover:scale-105" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 mb-0.5">
          <h4 className="text-white text-sm lg:text-base font-normal truncate hover:underline cursor-pointer transition-colors">{track.name}</h4>
          <button onClick={onLike} className={`p-1 lg:p-1.5 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 ml-2 hover:scale-110 ${isLiked ? 'text-green-500 hover:text-green-400' : 'text-gray-400 hover:text-white'}`}>
            <HeartIcon size={16} filled={isLiked} />
          </button>
        </div>
        <div className="text-gray-400 text-xs lg:text-sm truncate">
          {track.artists.map((artist, index) => (
            <span key={artist.uri || index}>
              <span className="hover:underline hover:text-white cursor-pointer transition-colors" onClick={(e) => onArtistClick(artist.uri?.split(':')[2] || '', e)}>
                {artist.name}
              </span>
              {index < track.artists.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default TrackInfo;

