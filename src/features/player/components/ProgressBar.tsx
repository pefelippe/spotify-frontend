import React from 'react';

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

interface ProgressBarProps {
  currentPosition: number;
  duration: number;
  // Preview while dragging
  onSeekChange?: (valueMs: number) => void;
  // Called when user starts dragging
  onSeekStart?: () => void;
  // Called when user releases thumb (commit)
  onSeekCommit?: (valueMs: number) => void;
  size?: 'small' | 'large';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentPosition,
  duration,
  onSeekChange,
  onSeekStart,
  onSeekCommit,
  size = 'small',
}) => {
  const progressPercent = duration > 0 ? (currentPosition / duration) * 100 : 0;

  const barHeight = size === 'small'
    ? 'h-1 lg:h-1.5'
    : 'h-2.5';

  return (
    <div className={`w-full ${size === 'large' ? 'lg:max-w-[720px]' : 'lg:max-w-[500px]'}`}>
      <div className={`flex items-center ${size === 'large' ? 'gap-3' : 'gap-2'}`}>
        <span className={`${size === 'small' ? 'text-[10px] lg:text-xs' : 'text-sm lg:text-base'} text-gray-400 w-10 text-left`}>
          {formatTime(currentPosition)}
        </span>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentPosition}
          onMouseDown={() => onSeekStart && onSeekStart()}
          onTouchStart={() => onSeekStart && onSeekStart()}
          onChange={(e) => onSeekChange && onSeekChange(Number(e.currentTarget.value))}
          onMouseUp={(e) => onSeekCommit && onSeekCommit(Number((e.currentTarget as HTMLInputElement).value))}
          onTouchEnd={(e) => onSeekCommit && onSeekCommit(Number((e.currentTarget as HTMLInputElement).value))}
          className={`flex-1 appearance-none bg-gray-600/60 hover:bg-gray-500/60 rounded-full cursor-pointer ${barHeight} progress-slider`}
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${progressPercent}%, #4b5563 ${progressPercent}%, #4b5563 100%)`,
          }}
        />
        <span className={`${size === 'small' ? 'text-[10px] lg:text-xs' : 'text-sm lg:text-base'} text-gray-400 w-10 text-right`}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};
