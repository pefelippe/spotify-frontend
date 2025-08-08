import React from 'react';

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

interface ProgressBarProps {
  currentPosition: number;
  duration: number;
  onSeek?: (e: React.MouseEvent<HTMLInputElement>) => void;
  size?: 'small' | 'large';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentPosition,
  duration,
  onSeek,
  size = 'small'
}) => {
  const progressPercent = duration > 0 ? (currentPosition / duration) * 100 : 0;

  const barHeight = size === 'small' 
    ? 'h-1 lg:h-1.5' 
    : 'h-2';

  return (
    <div className="w-full lg:max-w-[360px]">
      <div className="flex items-center gap-2">
        <span className={`${size === 'small' ? 'text-[10px] lg:text-xs' : 'text-sm'} text-gray-400 w-8 text-left`}>
          {formatTime(currentPosition)}
        </span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentPosition}
          onChange={(e) => onSeek && onSeek(e as unknown as React.MouseEvent<HTMLInputElement>)}
          className={`flex-1 appearance-none bg-gray-600 rounded-full cursor-pointer ${barHeight} progress-slider`}
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${progressPercent}%, #4b5563 ${progressPercent}%, #4b5563 100%)`
          }}
        />
        <span className={`${size === 'small' ? 'text-[10px] lg:text-xs' : 'text-sm'} text-gray-400 w-8 text-right`}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};