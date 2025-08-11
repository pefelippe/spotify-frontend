import type { MouseEvent } from 'react';
import { TextMarquee } from '../player/components/TextMarquee';

interface PlaylistItemProps {
  name: string;
  imageUrl?: string;
  ownerName: string;
  onClick?: () => void;
  onPlay?: () => void;
  playlistId?: string;
}

const defaultImage = 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36';

const PlaylistItem = ({ name, imageUrl, ownerName, onClick, onPlay, playlistId }: PlaylistItemProps) => {
  const handlePlayClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <div
      className="group flex items-center gap-3 cursor-pointer w-full transition-all duration-200 hover:bg-gray-800/50 p-3 rounded-lg"
      onClick={onClick}
    >
      {/* Playlist Cover */}
      <div className="relative w-[72px] h-[72px] flex-shrink-0">
        <img
          src={imageUrl || defaultImage}
          alt={name}
          className="w-[72px] h-[72px] object-cover rounded-md"
        />
        {/* Play Button - appears on hover */}
        <button
          onClick={handlePlayClick}
          className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="black">
            <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.287V1.713z"/>
          </svg>
        </button>
      </div>

      {/* Playlist Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <TextMarquee text={name} className="text-white-text font-semibold text-sm" />
        <TextMarquee text={ownerName} className="text-gray-400 text-xs" />
      </div>
    </div>
  );
};

export default PlaylistItem;
