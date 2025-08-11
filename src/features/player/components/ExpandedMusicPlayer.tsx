import React from 'react';
import { useLockBodyScroll } from './useExpandedMusicPlayerEffects';
import TextMarquee from './TextMarquee';
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
  isCurrentTrackLiked,
  onToggleLike,
}) => {
  useLockBodyScroll();
  return (
    <div
      className={`fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-black z-[100] ${
        isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop'
      }`}
      onClick={onClose}
    >
      <div className={`${isClosing ? 'animate-fade-out-scale' : 'animate-fade-in-scale'} h-full flex flex-col`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header: 10vh */}
        <div className="h-[10vh] relative flex items-center justify-center px-4">
          <div className="text-center max-w-[80vw] lg:max-w-[50vw]">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Playing</p>
            <TextMarquee
              text={currentTrack.album.name}
              className="text-sm text-white font-medium"
              speedMs={12000}
            />
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close player"
          >
            <ChevronDownIcon size={24} />
          </button>
        </div>

        <div className="h-[80vh] flex flex-col lg:flex-row justify-start lg:justify-center items-center w-full px-4 sm:px-6 lg:px-12 xl:px-16 lg:gap-16 max-w-[600px] mx-auto lg:max-w-none">

          <div className="flex-shrink-0 flex justify-center lg:justify-start items-start w-full lg:w-auto mt-10 mb-8 lg:my-0">
            <div className="w-[80vw] sm:w-[72vw] md:w-[62vw] lg:w-[38vw] xl:w-[34vw] max-w-none aspect-square h-full lg:mt-0 max-h-[46vh] sm:max-h-[52vh] md:max-h-[58vh] lg:max-h-[64vh]">
              <button className="w-full h-full" onClick={onClose} aria-label="Collapse player">
                <img
                  src={currentTrack.album.images[0]?.url}
                  alt={currentTrack.album.name}
                  className="rounded-2xl object-cover w-full h-full lg:shadow-2xl"
                />
              </button>
            </div>
          </div>

    
          <div className="flex flex-col justify-center items-start w-full lg:flex-1 lg:py-2 lg:py-0 px-4 lg:px-8 max-w-none lg:max-w-2xl text-center">
            <div className="mb-3 lg:mb-4 w-full">
              <div className="flex items-start gap-2 lg:gap-3 justify-between lg:justify-center text-left  w-full">
                <div className="flex-1 min-w-0">
                  <TextMarquee text={currentTrack.name} className="text-2xl lg:text-5xl xl:text-6xl font-bold text-white" speedMs={14000} />
                </div>
                <button
                  onClick={onToggleLike}
                  className={` rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 mt-1 hover:scale-110 ${
                    isCurrentTrackLiked ? 'text-green-500 hover:text-green-400' : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label={isCurrentTrackLiked ? 'Remove from liked' : 'Add to liked'}
                >
                  <HeartIcon size={28} filled={isCurrentTrackLiked} />
                </button>
              </div>
              <div className="lg:mt-3 mb-1 w-full overflow-hidden text-left">
                <TextMarquee
                  text={currentTrack.artists.map((a: any) => a.name).join(', ')}
                  className="text-sm sm:text-base lg:text-lg text-gray-400"
                  speedMs={16000}
                />
              </div>
            </div>

            <div className="flex flex-col lg:gap-6 w-full items-start">
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

        <div className="lg:h-[10vh]" />
      </div>
    </div>
  );
};
