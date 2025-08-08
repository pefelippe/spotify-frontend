import React from 'react';
import { TrackInfo } from './TrackInfo';
import { ProgressBar } from './ProgressBar';
import { PlayerControls } from './PlayerControls';
import { DevicesModal } from './DevicesModal';
import { FullscreenIcon, DevicesIcon, VolumeIcon, VolumeMuteIcon } from '../../../app/components/SpotifyIcons';

interface CompactMusicPlayerProps {
  currentTrack: SpotifyTrack;
  isPlaying: boolean;
  currentPosition: number;
  duration: number;
  shuffle: boolean;
  repeat: number;
  isEntering: boolean;
  isMuted: boolean;
  volumeState: number;
  availableDevices: any[];
  showDevices: boolean;
  onExpand: () => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffleToggle: () => void;
  onRepeatCycle: () => void;
  onSeek: (ms: number) => void;
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
  onToggleDevices: () => void;
  onDeviceSelect: (deviceId: string) => Promise<void>;
  onArtistClick: (artistId: string) => void;
  isCurrentTrackLiked: boolean;
  onToggleLike: () => void;
}

export const CompactMusicPlayer: React.FC<CompactMusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentPosition,
  duration,
  shuffle,
  repeat,
  isEntering,
  isMuted,
  volumeState,
  availableDevices,
  showDevices,
  onExpand,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffleToggle,
  onRepeatCycle,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onToggleDevices,
  onDeviceSelect,
  onArtistClick,
  isCurrentTrackLiked,
  onToggleLike,
}) => {
  return (
    <div
      className={`fixed bottom-[70px] border border-gray-300/20 rounded-2xl bg-[#000000] max-lg:mx-2  
        lg:bottom-0 left-0 lg:left-[250px] right-0 lg:border-t lg:border-gray-700/30 z-50 
        shadow-2xl transform transition-transform duration-300 ease-out 
        ${isEntering ? 'translate-y-0' : 'translate-y-full'}`}
      onClick={(e) => {
        // On screens smaller than lg, any click on the player should expand,
        // except when clicking interactive buttons
        const isBelowLg = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(max-width: 1023px)').matches;
        if (isBelowLg) {
          const target = e.target as HTMLElement | null;
          if (target && target.closest('button')) {
            return;
          }
          onExpand();
        }
      }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between h-16 lg:h-24 px-3 lg:px-5 py-2 lg:py-3 hover:bg-gray-900/20 transition-colors duration-200">
          <TrackInfo
            track={currentTrack}
            isLiked={isCurrentTrackLiked}
            onArtistClick={onArtistClick}
            onLikeToggle={onToggleLike}
          />

          <div className="hidden lg:flex flex-col items-center justify-center flex-1 max-w-[40%] lg:max-w-[50%] pt-2">
            <PlayerControls
              isPlaying={isPlaying}
              shuffle={shuffle}
              repeat={repeat}
              onPlayPause={onPlayPause}
              onPrevious={onPrevious}
              onNext={onNext}
              onShuffle={onShuffleToggle}
              onRepeat={onRepeatCycle}
            />

            <ProgressBar
              currentPosition={currentPosition}
              duration={duration}
              onSeek={(e) => onSeek(Number(e.currentTarget.value))}
            />
          </div>

          <div className="flex items-center space-x-2 lg:space-x-3 flex-1 justify-end max-w-[30%] lg:max-w-[25%]">
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={onMuteToggle}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeMuteIcon size={16} /> : <VolumeIcon size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeState}
                onChange={(e) => onVolumeChange(parseInt(e.target.value))}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #22c55e 0%, #22c55e ${volumeState}%, #4b5563 ${volumeState}%, #4b5563 100%)`,
                }}
              />
            </div>
            <button
              onClick={onExpand}
              className="hidden lg:inline-flex p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              aria-label="Expand player"
            >
              <FullscreenIcon size={16} />
            </button>
            <div className="relative hidden lg:block">
              <button
                onClick={onToggleDevices}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                aria-label="Devices"
              >
                <DevicesIcon size={16} />
              </button>
              {showDevices && (
                <DevicesModal
                  devices={availableDevices}
                  onDeviceSelect={onDeviceSelect}
                  onClose={onToggleDevices}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
