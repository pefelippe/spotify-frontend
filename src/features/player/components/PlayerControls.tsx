import React from 'react';
import { PauseIcon, PlayIcon, RepeatIcon, ShuffleIcon, SkipNextIcon, SkipPrevIcon } from '@/app/components/SpotifyIcons';

type PlayerControlsProps = {
  isPlaying: boolean;
  shuffle: boolean;
  repeat: number;
  onPlayPause: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onShuffle: (e: React.MouseEvent) => void;
  onRepeat: (e: React.MouseEvent) => void;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  shuffle,
  repeat,
  onPlayPause,
  onPrev,
  onNext,
  onShuffle,
  onRepeat,
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 lg:space-x-4 mb-4">
      <button onClick={onShuffle} className={`p-2 rounded-full transition-all duration-200 cursor-pointer hidden lg:flex items-center justify-center hover:bg-white/10 hover:scale-105 ${shuffle ? 'text-green-500 hover:text-green-400' : 'text-gray-300 hover:text-white'}`}>
        <ShuffleIcon size={16} />
      </button>
      <button onClick={onPrev} className="text-gray-300 hover:text-white transition-all duration-200 p-2 cursor-pointer hover:bg-white/10 rounded-full hover:scale-105">
        <SkipPrevIcon size={20} />
      </button>
      <button onClick={onPlayPause} className="bg-white text-black rounded-full p-2 lg:p-2.5 hover:scale-105 active:scale-95 transition-all duration-200 ease-out hover:bg-gray-100 shadow-lg cursor-pointer flex items-center justify-center">
        {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} className="ml-0.5" />}
      </button>
      <button onClick={onNext} className="text-gray-300 hover:text-white transition-all duration-200 p-2 cursor-pointer hover:bg-white/10 rounded-full hover:scale-105">
        <SkipNextIcon size={20} />
      </button>
      <button onClick={onRepeat} className={`p-2 rounded-full transition-all duration-200 cursor-pointer hidden lg:flex items-center justify-center hover:bg-white/10 hover:scale-105 ${repeat > 0 ? 'text-green-500 hover:text-green-400' : 'text-gray-300 hover:text-white'}`}>
        <RepeatIcon size={16} />
      </button>
    </div>
  );
};

export default PlayerControls;

