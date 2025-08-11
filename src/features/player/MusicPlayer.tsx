import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../features/player';
import { useLikedTracks } from '../liked-songs/liked-tracks-provider';
import { ExpandedMusicPlayer } from './components/ExpandedMusicPlayer';
import { CompactMusicPlayer } from './components/CompactMusicPlayer';

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

  useEffect(() => {
    if (!isDragging && !isSeeking) {
      setCurrentPosition(position);
    }
  }, [position, isDragging, isSeeking]);

  useEffect(() => {
    if (!isPlaying || isSeeking) {
      return;
    }

    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentPosition(prev => Math.min(prev + 1000, duration));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, isDragging, isSeeking]);

  useEffect(() => {
    if (isReady) {
      setTimeout(() => setIsEntering(true), 0);
    }
  }, [isReady]);

  // Ensure we surface player UI when remote playback starts by forcing a refresh on focus/visibility
  useEffect(() => {
    const onFocus = () => {
      refreshPlayback();
    };
    const onVisibility = () => {
      if (!document.hidden) {
        refreshPlayback();
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refreshPlayback]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (showDevices) {
        const triggers = Array.from(document.querySelectorAll('[data-device-trigger]'));
        const devicesModal = document.querySelector('.devices-modal');
        const target = e.target as Node;
        const clickedInsideAnyTrigger = triggers.some((el) => el.contains(target));
        const clickedInsideModal = !!devicesModal && devicesModal.contains(target);
        if (!clickedInsideAnyTrigger && !clickedInsideModal) {
          setShowDevices(false);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [showDevices]);

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
