import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/features/player';
import { useLikedTracks } from '@/features/liked-songs/liked-tracks-provider';
import {
  PlayIcon,
  PauseIcon,
  SkipNextIcon,
  SkipPrevIcon,
  ShuffleIcon,
  RepeatIcon,
  VolumeIcon,
  VolumeMuteIcon,
  HeartIcon,
  ChevronDownIcon,
  DevicesIcon,
  FullscreenIcon,
} from '../../app/components/SpotifyIcons';

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

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
  } = usePlayer();

  const { isTrackLiked, toggleLikeTrack } = useLikedTracks();

  const [currentPosition, setCurrentPosition] = useState(0);
  const [volumeState, setVolumeState] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [isDragging] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0); // 0: off, 1: all, 2: one
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setCurrentPosition(position);
    }
  }, [position, isDragging]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handlePlayerCollapse();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleKeyPress);
      // Prevenir scroll do body quando expandido
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

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

  // Animate mini player entrance when player becomes ready
  useEffect(() => {
    if (isReady) {
      // first render with translate-y-full, then animate to 0
      setTimeout(() => setIsEntering(true), 0);
    }
  }, [isReady]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { left, width } = rect;
    const clickX = e.clientX - left;
    const seekTime = (clickX / width) * duration;
    seekToPosition(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume / 100);
    setIsMuted(newVolume === 0);
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

  const handleLike = () => {
    if (currentTrack) {
      toggleLikeTrack(currentTrack.id);
    }
  };

  const handleShuffle = () => {
    setShuffle(!shuffle);
  };

  const handleRepeat = () => {
    setRepeat((repeat + 1) % 3);
  };

  const handleArtistClick = (artistId: string) => {
    navigate(`/artists/${artistId}`);
  };

  const handleToggleDevices = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setShowDevices(prev => !prev);
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
    }, 200);
  };

  const handlePlayerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handlePlayerExpand();
    }
  };

  if (!isReady) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentPosition / duration) * 100 : 0;
  const isCurrentTrackLiked = currentTrack ? isTrackLiked(currentTrack.id) : false;

  if (isExpanded && currentTrack) {
    return (
      <div
        className={`fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-black z-[100] ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        onClick={handlePlayerCollapse}
      >
        <div className="flex items-center justify-between p-4 pt-8 lg:pt-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handlePlayerCollapse}
            className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronDownIcon size={24} />
          </button>
          <div className="text-center flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Playing from</p>
            <p className="text-sm text-white font-medium">{currentTrack.album.name}</p>
          </div>
          <div className="w-10 h-10"></div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row lg:items-center px-8 py-8 gap-8 lg:gap-12" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center lg:flex-shrink-0 lg:w-[38%]">
            <div className="relative w-80 h-80 lg:w-full lg:h-auto lg:aspect-square max-w-sm lg:max-w-none">
              <img
                src={currentTrack.album.images[0]?.url}
                alt={currentTrack.name}
                className="w-full h-full rounded-lg shadow-2xl object-cover animate-fade-in-scale"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-8 lg:space-y-12 min-w-0 lg:w-[60%]">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl lg:text-5xl font-bold text-white truncate mb-4">
                    {currentTrack.name}
                  </h1>
                  <div className="text-lg lg:text-xl text-gray-400">
                    {currentTrack.artists.map((artist, index) => (
                      <span key={artist.uri || index}>
                        <span
                          className="hover:underline hover:text-white cursor-pointer transition-all duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArtistClick(artist.uri?.split(':')[2] || '');
                          }}
                        >
                          {artist.name}
                        </span>
                        {index < currentTrack.artists.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike();
                  }}
                  className={`p-3 lg:p-4 transition-colors ml-4 cursor-pointer ${
                    isCurrentTrackLiked
                      ? 'text-green-500 hover:text-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <HeartIcon size={32} filled={isCurrentTrackLiked} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 w-12 text-left">{formatTime(currentPosition)}</span>
              <div
                className="relative flex-1 h-2 bg-gray-600 rounded-full cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeek(e);
                }}
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-200 group-hover:bg-green-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 w-12 text-right">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center space-x-6 lg:space-x-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShuffle();
                }}
                className={`p-3 transition-all duration-200 cursor-pointer hover:scale-110 ${
                  shuffle
                    ? 'text-green-500 hover:text-green-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <ShuffleIcon size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previousTrack();
                }}
                className="text-gray-300 hover:text-white transition-all duration-200 p-3 cursor-pointer hover:scale-110"
              >
                <SkipPrevIcon size={28} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="bg-white text-black rounded-full p-4 lg:p-5 hover:scale-105 active:scale-95 transition-all duration-200 ease-out hover:bg-gray-100 shadow-lg cursor-pointer flex items-center justify-center"
              >
                {isPlaying ? (
                  <PauseIcon size={24} />
                ) : (
                  <PlayIcon size={24} className="ml-1" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextTrack();
                }}
                className="text-gray-300 hover:text-white transition-all duration-200 p-3 cursor-pointer hover:scale-110"
              >
                <SkipNextIcon size={28} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRepeat();
                }}
                className={`p-3 transition-all duration-200 cursor-pointer hover:scale-110 ${
                  repeat > 0
                    ? 'text-green-500 hover:text-green-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <RepeatIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-[72px] lg:bottom-0 left-0 lg:left-[250px] right-0 border-t border-gray-700/30 z-50 shadow-2xl transform transition-transform duration-300 ease-out ${isEntering ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ backgroundColor: '#000000' }}
      onClick={handlePlayerClick}
    >
      <div className="flex flex-col">
        

        <div className="flex items-center justify-between h-16 lg:h-20 px-3 lg:px-5 py-2 lg:py-3 hover:bg-gray-900/20 transition-colors duration-200">
          <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0 max-w-[30%] lg:max-w-[25%] track-info-area">
            {currentTrack ? (
              <>
                <div className="relative overflow-hidden rounded-md group">
                  <img
                    src={currentTrack.album.images[0]?.url}
                    alt={currentTrack.name}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-md object-cover transition-transform duration-200 group-hover:scale-105"
                    key={currentTrack.id}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <h4 className="text-white text-xs lg:text-sm font-normal truncate hover:underline cursor-pointer transition-colors">
                      {currentTrack.name}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                      }}
                      className={`p-1 lg:p-1.5 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 ml-2 hover:scale-110 ${
                        isCurrentTrackLiked
                          ? 'text-green-500 hover:text-green-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <HeartIcon size={16} filled={isCurrentTrackLiked} />
                    </button>
                  </div>
                  <div className="text-gray-400 text-[11px] lg:text-xs truncate">
                    {currentTrack.artists.map((artist, index) => (
                      <span key={artist.uri || index}>
                        <span
                          className="hover:underline hover:text-white cursor-pointer transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArtistClick(artist.uri?.split(':')[2] || '');
                          }}
                        >
                          {artist.name}
                        </span>
                        {index < currentTrack.artists.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-md bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">🎵</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-gray-400 text-sm lg:text-base font-normal">
                    Nenhuma música
                  </div>
                  <div className="text-gray-500 text-xs lg:text-sm">
                    Clique para tocar
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center flex-1 max-w-[40%] lg:max-w-[50%] pt-2">
            <div className="flex items-center justify-center space-x-1.5 lg:space-x-3 mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShuffle();
                }}
                className={`p-2 rounded-full transition-all duration-200 cursor-pointer hidden lg:flex items-center justify-center hover:bg-white/10 hover:scale-105 ${
                  shuffle
                    ? 'text-green-500 hover:text-green-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <ShuffleIcon size={16} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previousTrack();
                }}
                className="text-gray-300 hover:text-white transition-all duration-200 p-1.5 cursor-pointer hover:bg-white/10 rounded-full hover:scale-105"
              >
                <SkipPrevIcon size={18} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="bg-white text-black rounded-full p-1.5 lg:p-2 hover:scale-105 active:scale-95 transition-all duration-200 ease-out hover:bg-gray-100 shadow-lg cursor-pointer flex items-center justify-center"
              >
                {isPlaying ? (
                  <PauseIcon size={14} />
                ) : (
                  <PlayIcon size={14} className="ml-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextTrack();
                }}
                className="text-gray-300 hover:text-white transition-all duration-200 p-1.5 cursor-pointer hover:bg-white/10 rounded-full hover:scale-105"
              >
                <SkipNextIcon size={18} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRepeat();
                }}
                className={`p-2 rounded-full transition-all duration-200 cursor-pointer hidden lg:flex items-center justify-center hover:bg-white/10 hover:scale-105 ${
                  repeat > 0
                    ? 'text-green-500 hover:text-green-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <RepeatIcon size={16} />
              </button>
            </div>

            <div className="w-full max-w-[240px] lg:max-w-[360px]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] lg:text-xs text-gray-400 w-8 text-left">{formatTime(currentPosition)}</span>
                <div
                  className="group relative flex-1 h-1 lg:h-1.5 bg-gray-600 rounded-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeek(e);
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
                <span className="text-[10px] lg:text-xs text-gray-400 w-8 text-right">{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-3 flex-1 justify-end max-w-[30%] lg:max-w-[25%]">
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMuteToggle();
                }}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeMuteIcon size={16} /> : <VolumeIcon size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeState}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #fff 0%, #fff ${volumeState}%, #4b5563 ${volumeState}%, #4b5563 100%)`,
                }}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayerExpand();
              }}
              className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              aria-label="Expand player"
              title="Expandir"
            >
              <FullscreenIcon size={16} />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleDevices(e);
                }}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                aria-label="Devices"
                title="Devices"
              >
                <DevicesIcon size={16} />
              </button>
              {showDevices && (
                <div className="absolute right-0 bottom-10 w-64 bg-[#111] border border-gray-700 rounded-lg shadow-xl p-2 z-[200]" onClick={(e) => e.stopPropagation()}>
                  <div className="px-2 py-1.5 text-xs text-gray-400">Available devices</div>
                  <div className="max-h-60 overflow-y-auto">
                    {availableDevices.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">No devices found</div>
                    ) : (
                      availableDevices.map((d) => (
                        <button
                          key={d.id}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${d.is_active ? 'bg-green-600/10 text-green-400' : 'text-gray-200 hover:bg-white/10'}`}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await transferPlayback(d.id, true);
                            setShowDevices(false);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{d.name}</span>
                            {d.is_active && <span className="text-[10px] uppercase">Active</span>}
                          </div>
                          <div className="text-[10px] text-gray-400 capitalize">{`${d.type}`.toLowerCase()}</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
