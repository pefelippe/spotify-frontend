import React, { useState } from 'react';
import { PlayIcon, PauseIcon } from './SpotifyIcons';
import { usePlayer } from '../../features/player/usePlayer';

export interface PlaybackIntent {
  contextUri?: string;
  uri?: string;
}

interface CustomCardProps {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  onClick: () => void;
  className?: string;
  playback?: PlaybackIntent;
  isActive?: boolean;
  onTogglePlay?: () => void;
}

export const CustomCard: React.FC<CustomCardProps> = ({
  id,
  imageSrc,
  imageAlt,
  title,
  subtitle,
  onClick,
  className,
  playback,
  isActive,
  onTogglePlay,
}) => {
  const { isReady, deviceId, playTrack, pauseTrack } = usePlayer();
  const [isSelfPlaying, setIsSelfPlaying] = useState(false);
  const isControlled = typeof isActive === 'boolean' && typeof onTogglePlay === 'function';

  const handleNavigate = () => {
    onClick();
  };

  const handleKeyActivate = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!playback || !isReady || !deviceId) {
      return;
    }
    const shouldPause = isControlled ? !!isActive : isSelfPlaying;
    if (shouldPause) {
      await pauseTrack();
      if (!isControlled) {
        setIsSelfPlaying(false);
      }
      return;
    }
    await playTrack(playback.uri || '', playback.contextUri);
    if (!isControlled) {
      setIsSelfPlaying(true);
    }
  };

  return (
    <div
      className={`group w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-xl p-1 lg:p-4 transition-colors duration-200 hover:bg-[rgb(30,30,30)] ${className || ''}`}
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyActivate}
      data-card-id={id}
    >
      <div className="relative mb-2">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full aspect-square rounded-md object-cover"
            loading="lazy"
          />
        ) : (
          <div
            aria-hidden
            className="w-full aspect-square rounded-md bg-black"
          />
        )}
        {playback && (
          <button
            aria-label={(isControlled ? isActive : isSelfPlaying) ? 'Pause' : 'Play'}
            className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-2 shadow-md transition-all transform opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 hover:scale-105"
            onClick={async (e) => {
              await handlePlayPause(e);
              if (isControlled && onTogglePlay) {
                onTogglePlay();
              }
            }}
          >
            {(isControlled ? isActive : isSelfPlaying) ? (
              <PauseIcon size={18} />
            ) : (
              <PlayIcon size={18} className="ml-0.5" />
            )}
          </button>
        )}
      </div>
      <h4 className="text-white font-medium text-sm md:text-base truncate" title={title}>
        {title}
      </h4>
      {subtitle && (
        <p className="text-gray-400 text-xs md:text-sm truncate mt-0.5" title={subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default CustomCard;

