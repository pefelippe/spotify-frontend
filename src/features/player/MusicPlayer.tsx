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
    availableDevices,
    refreshDevices,
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
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setCurrentPosition(position);
    }
  }, [position, isDragging]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentPosition(prev => Math.min(prev + 1000, duration));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, isDragging]);

  useEffect(() => {
    if (isReady) {
      setTimeout(() => setIsEntering(true), 0);
    }
  }, [isReady]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (showDevices) {
        const deviceButton = document.querySelector('[aria-label="Devices"]');
        const devicesModal = document.querySelector('.devices-modal');
        if (
          deviceButton &&
          !deviceButton.contains(e.target as Node) &&
          devicesModal &&
          !devicesModal.contains(e.target as Node)
        ) {
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

  if (!isReady || !hasTrack) {
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
          onSeek={(ms) => seekToPosition(ms)}
          onVolumeChange={(v) => setVolume(v / 100)}
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
