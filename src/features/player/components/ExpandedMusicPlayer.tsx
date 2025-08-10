import React from 'react';
import { ProgressBar } from './ProgressBar';
import { PlayerControls } from './PlayerControls';
import { ChevronDownIcon, HeartIcon } from '../../../app/components/SpotifyIcons';

interface ExpandedMusicPlayerProps {
  currentTrack: SpotifyTrack;
  isPlaying: boolean;
  currentPosition: number;
  duration: number;
  shuffle: boolean;
  repeat: number;
  isClosing: boolean;
  onClose: () => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffleToggle: () => void;
  onRepeatCycle: () => void;
  onSeek: (ms: number) => void;
  onArtistClick: (artistId: string) => void;
  isCurrentTrackLiked: boolean;
  onToggleLike: () => void;
}

export const ExpandedMusicPlayer: React.FC<ExpandedMusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentPosition,
  duration,
  shuffle,
  repeat,
  isClosing,
  onClose,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffleToggle,
  onRepeatCycle,
  onSeek,
  onArtistClick,
  isCurrentTrackLiked,
  onToggleLike,
}) => {
  // Disable body scroll when expanded
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);
  return (
    <div
      className={`fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-black z-[100] ${
        isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop'
      }`}
      onClick={onClose}
    >
      <div className={`${isClosing ? 'animate-fade-out-scale' : 'animate-fade-in-scale'}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-4 pt-8 lg:pt-4">
          <div className="absolute left-1/2 -translate-x-1/2 top-6 lg:top-4 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Playing</p>
            <p className="text-sm text-white font-medium">{currentTrack.album.name}</p>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer ml-4"
              aria-label="Close player"
            >
              <ChevronDownIcon size={24} />
            </button>
          </div>
        </div>

        <div
          className="flex flex-col lg:flex-row justify-center min-h-[90vh] h-auto mx-auto w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-4 lg:py-8 gap-0 lg:gap-16 items-stretch"
        >
        {/* Album image */}
          <div className="flex-shrink-0 flex justify-start items-start w-full lg:w-auto">
            <div className="w-full lg:w-[40vw] xl:w-[36vw] max-w-none aspect-square max-h-[60vh] max-lg:max-h-[50vh] lg:max-h-[80vh] h-full">
              <button className="w-full h-full" onClick={onClose} aria-label="Collapse player">
                <img
                  src={currentTrack.album.images[0]?.url}
                  alt={currentTrack.album.name}
                  className="rounded-2xl object-cover w-full h-full lg:shadow-2xl"
                />
              </button>
            </div>
        </div>

        {/* Info and controls */}
        <div className="flex flex-col justify-center items-start w-full lg:flex-1 py-6 lg:py-0 px-4 lg:px-8 max-w-none lg:max-w-2xl text-left">
          {/* Track name + like, and artists */}
          <div className="mb-4 w-full">
            <div className="flex items-start gap-3 justify-between lg:justify-start w-full">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white break-words">
                {currentTrack.name}
              </h2>
              <button
                onClick={onToggleLike}
                className={`p-2 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 mt-1 hover:scale-110 ${
                  isCurrentTrackLiked ? 'text-green-500 hover:text-green-400' : 'text-gray-400 hover:text-white'
                }`}
                aria-label={isCurrentTrackLiked ? 'Remove from liked' : 'Add to liked'}
              >
                <HeartIcon size={28} filled={isCurrentTrackLiked} />
              </button>
            </div>
            <div className="lg:mt-3 mb-1 flex flex-wrap gap-2 justify-start text-left">
              {currentTrack.artists.map((artistObj, idx) => {
                const { name, uri } = artistObj as any;
                let artistId: string = '';
                if (typeof (artistObj as any).id === 'string' && (artistObj as any).id) {
                  artistId = (artistObj as any).id;
                } else if (typeof uri === 'string') {
                  artistId = uri.split(':').pop() || name || String(idx);
                } else {
                  artistId = name || String(idx);
                }
                return (
                  <span
                    key={String(artistId)}
                     className="text-base sm:text-lg text-gray-300 hover:text-green-400 cursor-pointer underline-offset-2 hover:underline"
                    onClick={() => onArtistClick(String(artistId))}
                  >
                    {name}
                    {idx < currentTrack.artists.length - 1 && <span className="text-gray-500">,</span>}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full items-start">
            <ProgressBar
              currentPosition={currentPosition}
              duration={duration}
              onSeekChange={(ms) => onSeek(ms)}
              size="large"
            />
            <PlayerControls
              isPlaying={isPlaying}
              shuffle={shuffle}
              repeat={repeat}
              onPlayPause={onPlayPause}
              onPrevious={onPrevious}
              onNext={onNext}
              onShuffle={onShuffleToggle}
              onRepeat={onRepeatCycle}
              size="large"
              fullWidthOnMobile
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
