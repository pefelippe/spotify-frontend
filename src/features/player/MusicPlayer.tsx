import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../features/player';
import { useLikedTracks } from '../../features/liked-songs/liked-tracks-provider';
import { ExpandedMusicPlayer } from './components/ExpandedMusicPlayer';
import { CompactMusicPlayer } from './components/CompactMusicPlayer';
import {
  useCloseDevicesOnOutsideClick,
  useEnterOnReady,
  usePlayheadProgress,
  useRefreshPlaybackOnAppFocus,
  useSyncCurrentPosition,
} from './useMusicPlayerEffects';

export const MusicPlayer = () => {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    isReady,
    deviceId,
    activeDeviceId,
    activeDeviceName,
    availableDevices,
    refreshDevices,
    refreshPlayback,
    transferPlayback,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekToPosition,
    setVolume,
    hasTrack,
    setShuffle: providerSetShuffle,
    setRepeat: providerSetRepeat,
  } = usePlayer();

  const { isTrackLiked, toggleLikeTrack } = useLikedTracks();

  const [currentPosition, setCurrentPosition] = useState(0);
  const [volumeState, setVolumeState] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [isDragging] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useSyncCurrentPosition(position, isDragging, isSeeking, setCurrentPosition);

  usePlayheadProgress(isPlaying, duration, isDragging, isSeeking, setCurrentPosition);

  useEnterOnReady(isReady, setIsEntering);

  useRefreshPlaybackOnAppFocus(refreshPlayback);

  useCloseDevicesOnOutsideClick(showDevices, setShowDevices);

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  const handleToggleDevices = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const newShowDevicesState = !showDevices;
    setShowDevices(newShowDevicesState);
    await refreshDevices();
  };

  const handlePlayerExpand = () => {
    setIsExpanded(true);
  };

  const handlePlayerCollapse = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 300);
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolumeState(previousVolume);
      setVolume(previousVolume / 100);
      setIsMuted(false);
    } else {
      setPreviousVolume(volumeState);
      setVolumeState(0);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const isRemotePlayback = !!activeDeviceId && activeDeviceId !== deviceId;

  if (!isReady || (!hasTrack && !isRemotePlayback)) {
    return null;
  }

  const isCurrentTrackLiked = currentTrack ? isTrackLiked(currentTrack.id) : false;

  return (
    <>
      {currentTrack && (
        <CompactMusicPlayer
          currentTrack={currentTrack as SpotifyTrack}
          isPlaying={isPlaying}
          currentPosition={currentPosition}
          duration={duration}
          shuffle={shuffle}
          repeat={repeat}
          isEntering={isEntering}
          isMuted={isMuted}
          volumeState={volumeState}
          availableDevices={availableDevices}
          isRemotePlayback={isRemotePlayback}
          activeDeviceName={activeDeviceName}
          showDevices={showDevices}
          onExpand={handlePlayerExpand}
          onPlayPause={() => (isPlaying ? pauseTrack() : resumeTrack())}
          onPrevious={previousTrack}
          onNext={nextTrack}
          onShuffleToggle={() => setShuffle(!shuffle)}
         onRepeatCycle={() => {
            const repeatModes: ('off' | 'context' | 'track')[] = ['off', 'context', 'track'];
            const currentIndex = repeat;
            const newIndex = (currentIndex + 1) % repeatModes.length;
            const mode = repeatModes[newIndex];
            setRepeat(newIndex);
            providerSetRepeat(mode);
          }}
          onSeekStart={() => setIsSeeking(true)}
          onSeekChange={(ms) => setCurrentPosition(ms)}
          onSeekCommit={async (ms) => {
            setIsSeeking(false);
            await seekToPosition(ms);
          }}
          onVolumeChange={(v) => {
            setVolumeState(v);
            if (isMuted && v > 0) {
              setIsMuted(false);
            }
            setVolume(v / 100);
          }}
          onMuteToggle={handleMuteToggle}
          onToggleDevices={handleToggleDevices}
          onDeviceSelect={async (deviceId) => await transferPlayback(deviceId, true)}
          onArtistClick={handleArtistClick}
          isCurrentTrackLiked={isCurrentTrackLiked}
          onToggleLike={() => currentTrack && toggleLikeTrack(currentTrack.id)}
        />
      )}

      {isExpanded && currentTrack && (
        <ExpandedMusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentPosition={currentPosition}
          duration={duration}
          shuffle={shuffle}
          repeat={repeat}
          isClosing={isClosing}
          onClose={handlePlayerCollapse}
          onPlayPause={() => (isPlaying ? pauseTrack() : resumeTrack())}
          onPrevious={previousTrack}
          onNext={nextTrack}
          onShuffleToggle={() => {
            const newShuffleState = !shuffle;
            setShuffle(newShuffleState);
            providerSetShuffle(newShuffleState);
          }}
      onRepeatCycle={() => {
        const repeatModes: ('off' | 'context' | 'track')[] = ['off', 'context', 'track'];
        const currentIndex = repeat;
        const newIndex = (currentIndex + 1) % repeatModes.length;
        const mode = repeatModes[newIndex];
        setRepeat(newIndex);
        providerSetRepeat(mode);
      }}
          onSeek={(ms) => seekToPosition(ms)}
          onArtistClick={handleArtistClick}
          isCurrentTrackLiked={isCurrentTrackLiked}
          onToggleLike={() => toggleLikeTrack(currentTrack.id)}
        />
      )}
    </>
  );
};
