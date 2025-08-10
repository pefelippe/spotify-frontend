import React from 'react';
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  ShuffleIcon,
  RepeatIcon,
} from '../../../app/components/SpotifyIcons';

interface PlayerControlsProps {
  isPlaying: boolean;
  shuffle: boolean;
  repeat: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  size?: 'small' | 'large';
  fullWidthOnMobile?: boolean;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  shuffle,
  repeat,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  size = 'small',
  fullWidthOnMobile = false,
}) => {
  const iconSizes = {
    small: {
      shuffle: 16,
      skipPrev: 18,
      playPause: 14,
      skipNext: 18,
      repeat: 16,
    },
    large: {
      shuffle: 24,
      skipPrev: 28,
      playPause: 24,
      skipNext: 28,
      repeat: 24,
    },
  };

  const currentSizes = iconSizes[size];

  const wrapperClass = fullWidthOnMobile
    ? 'max-lg:w-full flex items-center justify-between lg:justify-center mb-2 relative lg:gap-4 max-w-md'
    : 'flex items-center justify-center space-x-1.5 lg:space-x-3 mb-2 relative';

  return (
    <div className={wrapperClass}>
      <div className="group relative">
        <button
          onClick={onShuffle}
          className={`p-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center hover:bg-white/10 hover:scale-105 ${
            shuffle
              ? 'text-green-500 hover:text-green-400'
              : 'text-gray-300 hover:text-white'
          } ${size === 'small' ? 'text-sm' : ''}`}
          title="Shuffle"
        >
          <ShuffleIcon size={currentSizes.shuffle} />
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          {shuffle ? 'Shuffle On' : 'Shuffle Off'}
        </span>
      </div>

      <div className="group relative">
        <button
          onClick={onPrevious}
          className={`${size === 'small' ? 'cursor-pointer text-gray-300 hover:text-white p-1.5 hover:bg-white/10 rounded-full' : 'text-gray-300 hover:text-white transition-all duration-200 p-3 cursor-pointer hover:scale-110'}`}
          title="Previous"
        >
          <SkipBackIcon size={currentSizes.skipPrev} />
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Previous
        </span>
      </div>

      <div className="group relative">
        <button
          onClick={onPlayPause}
          className={`${
            size === 'small'
              ? 'bg-white text-black rounded-full p-1.5 lg:p-2 hover:scale-105 active:scale-95'
              : 'bg-white text-black rounded-full p-4 lg:p-5 hover:scale-105 active:scale-95'
          } transition-all duration-200 ease-out hover:bg-gray-100 shadow-lg cursor-pointer flex items-center justify-center`}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <PauseIcon size={currentSizes.playPause} />
          ) : (
            <PlayIcon
              size={currentSizes.playPause}
              className={size === 'small' ? 'ml-0.5' : 'ml-1'}
            />
          )}
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          {isPlaying ? 'Pause' : 'Play'}
        </span>
      </div>

      <div className="group relative">
        <button
          onClick={onNext}
          className={`${size === 'small' ? 'cursor-pointer text-gray-300 hover:text-white p-1.5 hover:bg-white/10 rounded-full' : 'text-gray-300 hover:text-white transition-all duration-200 p-3 cursor-pointer hover:scale-110'}`}
          title="Next"
        >
          <SkipForwardIcon size={currentSizes.skipNext} />
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Next
        </span>
      </div>

      <div className="group relative">
        <button
          onClick={onRepeat}
          className={`p-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center hover:bg-white/10 hover:scale-105 ${
            repeat > 0
              ? 'text-green-500 hover:text-green-400'
              : 'text-gray-300 hover:text-white'
          } ${size === 'small' ? 'text-sm' : ''}`}
          title="Repeat"
        >
          <RepeatIcon size={currentSizes.repeat} />
        </button>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          {repeat === 0 ? 'Repeat Off' : repeat === 1 ? 'Repeat Context' : 'Repeat Track'}
        </span>
      </div>
    </div>
  );
};
