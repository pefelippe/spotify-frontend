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
  isRemotePlayback?: boolean;
  activeDeviceName?: string | null;
  showDevices: boolean;
  onExpand: () => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffleToggle: () => void;
  onRepeatCycle: () => void;
  onSeekStart?: () => void;
  onSeekChange?: (ms: number) => void;
  onSeekCommit?: (ms: number) => void;
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
  activeDeviceName,
  showDevices,
  onExpand,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffleToggle,
  onRepeatCycle,
  onSeekStart,
  onSeekChange,
  onSeekCommit,
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
        <div className="flex items-center justify-between px-3 lg:px-5 py-2 lg:py-3 hover:bg-gray-900/20 transition-colors duration-200">
          <TrackInfo
            track={currentTrack}
            isLiked={isCurrentTrackLiked}
            onArtistClick={onArtistClick}
            onLikeToggle={onToggleLike}
            onImageClick={onExpand}
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
              onSeekStart={onSeekStart}
              onSeekChange={onSeekChange}
              onSeekCommit={onSeekCommit}
            />
          </div>

          <div className="flex items-center space-x-2 lg:space-x-3 flex-1 justify-end max-w-[30%] lg:max-w-[25%]">
            <div className="hidden lg:flex items-center space-x-2 relative">
              <button
                type="button"
                onClick={onToggleDevices}
                className="inline-flex items-center gap-1 text-xs mr-4 text-gray-300 bg-white/10 px-2 py-1 rounded-md hover:bg-white/15 transition-colors max-w-[180px] truncate"
                aria-label="Dispositivos disponíveis"
                title={activeDeviceName ? `Reproduzindo em ${activeDeviceName}` : 'Este dispositivo'}
                data-device-trigger
              >
                <DevicesIcon size={14} />
                <span className="truncate">{activeDeviceName === 'Spotify Clone Player' ? 'Este dispositivo' : activeDeviceName}</span>
              </button>
              {showDevices && (
                <DevicesModal
                  devices={availableDevices}
                  onDeviceSelect={onDeviceSelect}
                  onClose={onToggleDevices}
                />
              )}
              <button
                onClick={onMuteToggle}
                className="text-gray-300 hover:text-white tSpotify Clone Playerransition-colors cursor-pointer"
              >
                {isMuted ? <VolumeMuteIcon size={16} /> : <VolumeIcon size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeState}
                onChange={(e) => onVolumeChange(parseInt(e.target.value))}
                className="w-16 lg:w-24 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
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
          </div>
        </div>
      </div>
    </div>
  );
};
