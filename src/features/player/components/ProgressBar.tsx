import React from 'react';

type ProgressBarProps = {
  progressPercent: number;
  currentPositionMs: number;
  durationMs: number;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  barClassName?: string;
  timeClassName?: string;
};

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  currentPositionMs,
  durationMs,
  onSeek,
  barClassName = 'group relative w-full h-1 bg-gray-600 rounded-full cursor-pointer',
  timeClassName = 'flex justify-between text-[10px] lg:text-xs text-gray-400 mt-1',
}) => {
  return (
    <div>
      <div
        className={barClassName}
        onClick={(e) => {
          e.stopPropagation();
          onSeek(e);
        }}
      >
        <div
          className="h-full bg-white rounded-full transition-all duration-200 group-hover:bg-green-500"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-[var(--progress-left)] h-2.5 w-2.5 lg:h-3 lg:w-3 rounded-full bg-white shadow-md opacity-0 scale-75 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100"
          style={{ left: `${progressPercent}%` }}
        />
      </div>
      <div className={timeClassName}>
        <span>{formatTime(currentPositionMs)}</span>
        <span>{formatTime(durationMs)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;

