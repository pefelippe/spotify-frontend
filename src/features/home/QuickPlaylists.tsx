import React, { useState } from 'react';
import { PlayIcon, PauseIcon, HeartIcon } from '../../app/components/SpotifyIcons';
import { usePlayer } from '../../features/player/usePlayer';
import TextMarquee from '../../features/player/components/TextMarquee';
import HorizontalScroll from '../../app/components/HorizontalScroll';

interface QuickPlaylistItem {
  id: string;
  name: string;
  image: string;
  isLiked?: boolean;
  onClick: () => void;
}

interface QuickPlaylistsProps {
  items: QuickPlaylistItem[];
  variant?: 'default' | 'inCard';
}

export const QuickPlaylists: React.FC<QuickPlaylistsProps> = ({ items, variant = 'default' }) => {
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
    <section className="w-full">
      <div className="lg:hidden">
        <HorizontalScroll ariaLabel="Playlists rápidas" gapClassName="gap-2">
          {items.map((pl) => (
            <div key={pl.id} className="min-w-[260px]">
              <div
                className={`flex items-center gap-1 rounded-xl p-3 bg-white/10 hover:bg-white/20 transition-colors group `}
                onClick={pl.onClick}
              >
                <div className="relative flex-shrink-0 cursor-pointer">
                  {pl.isLiked ? (
                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <HeartIcon size={18} className="text-white" filled />
                    </div>
                  ) : pl.image ? (
                    <img src={pl.image} alt={pl.name} className="w-12 h-12 rounded-md object-cover" loading="lazy" />
                  ) : (
                    <div aria-hidden className="w-12 h-12 rounded-md bg-black" />
                  )}
                  <button
                    className="absolute bottom-1 right-1 rounded-full p-2 shadow bg-green-500 text-black hover:bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={isPlaying && activeId === pl.id ? 'Pause' : 'Play'}
                    onClick={handlePlayPause(pl.id, pl.isLiked)}
                  >
                    {isPlaying && activeId === pl.id ? (
                      <PauseIcon size={16} />
                    ) : (
                      <PlayIcon size={16} className="ml-0.5" />
                    )}
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <TextMarquee text={pl.name} />
                </div>
              </div>
            </div>
          ))}
        </HorizontalScroll>
      </div>

      <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-2 justify-items-start">
        {items.map((pl) => (
          <div key={pl.id} className="group w-full cursor-pointer">
            <div
              className={`flex items-center gap-3 rounded-xl p-2 bg-white/10 hover:bg-white/20 transition-colors group  cursor-pointer`}
              onClick={pl.onClick}
            >
              <div className="relative flex-shrink-0 cursor-pointer">
                {pl.isLiked ? (
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <HeartIcon size={18} className="text-white" filled />
                  </div>
                ) : pl.image ? (
                  <img src={pl.image} alt={pl.name} className="w-12 h-12 rounded-md object-cover" loading="lazy" />
                ) : (
                  <div aria-hidden className="w-12 h-12 rounded-md bg-black" />
                )}
                <button
                  className="absolute bottom-3 right-2 rounded-full p-1.5 shadow bg-green-500 text-black hover:bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <div className="min-w-0 flex-1">
                <TextMarquee text={pl.name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickPlaylists;

