import React, { useState } from 'react';
import { PlayIcon, PauseIcon, HeartIcon } from '../SpotifyIcons';
import { usePlayer } from '../../../features/player/usePlayer';
import TextMarquee from '../../../features/player/components/TextMarquee';

interface QuickPlaylistItem {
  id: string;
  name: string;
  image: string;
  isLiked?: boolean;
  onClick: () => void;
}

interface QuickPlaylistsProps {
  items: QuickPlaylistItem[];
}

export const QuickPlaylists: React.FC<QuickPlaylistsProps> = ({ items }) => {
  const { isReady, deviceId, isPlaying, playTrack, pauseTrack } = usePlayer();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handlePlayPause = (playlistIdOrLiked: string, isLiked?: boolean) => async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isReady || !deviceId) {
      return;
    }
    if (isPlaying && activeId === playlistIdOrLiked) {
      await pauseTrack();
      return;
    }
    const contextUri = isLiked ? 'spotify:user:collection:tracks' : `spotify:playlist:${playlistIdOrLiked}`;
    await playTrack('', contextUri);
    setActiveId(playlistIdOrLiked);
  };

  return (
    <section className="w-full flex max-w-[100%] overflow-hidden ">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 max-lg:hidden">
        {items.map((pl) => (
          <div key={pl.id} className="group">
            <div
              className="flex items-center gap-3 rounded-xl p-3 bg-[rgb(30,30,30)]/60 hover:bg-[rgb(45,45,45)]/70 transition-colors cursor-pointer"
              onClick={pl.onClick}
            >
              <div className="relative">
                {pl.isLiked ? (
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <HeartIcon size={18} className="text-white" filled />
                  </div>
                ) : (
                  pl.image ? (
                    <img src={pl.image} alt={pl.name} className="w-12 h-12 rounded-md object-cover" loading="lazy" />
                  ) : (
                    <div aria-hidden className="w-12 h-12 rounded-md bg-black" />
                  )
                )}
              </div>
              <div className="min-w-0 flex-1">
                <TextMarquee text={pl.name} />
              </div>
              <button
                className="ml-auto bg-green-500 text-black rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={isPlaying && activeId === pl.id ? 'Pause' : 'Play'}
                onClick={handlePlayPause(pl.id, pl.isLiked)}
              >
                {isPlaying && activeId === pl.id ? (
                  <PauseIcon size={14} />
                ) : (
                  <PlayIcon size={14} className="ml-0.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickPlaylists;

