import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/features/player';
import { useLikedTracks } from '@/app/providers/liked-tracks-provider';
import { AddToPlaylistModal } from '@/app/components/AddToPlaylistModal';
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
} from './SpotifyIcons';

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
    userInteracted,
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
  const [isDragging] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0); // 0: off, 1: all, 2: one
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setCurrentPosition(position);
    }
  }, [position, isDragging]);

  // Fechar player expandido com ESC
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

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
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

  // Player sempre visível, mesmo sem música
  if (!isReady) {
    return (
      <div className="fixed bottom-[72px] lg:bottom-0 left-0 lg:left-[250px] right-0 bg-black border-t border-gray-800 z-50 h-20 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Carregando player...</div>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentPosition / duration) * 100 : 0;
  const isCurrentTrackLiked = currentTrack ? isTrackLiked(currentTrack.id) : false;

  // Player Expandido (Fullscreen) - só quando há música
  if (isExpanded && currentTrack) {
    return (
      <div
        className={`fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-black z-[100] ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        onClick={handlePlayerCollapse}
      >
        {/* Header */}
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
          <div className="w-10 h-10"></div> {/* Espaço vazio para manter centralização */}
        </div>

        {/* Main Content - Mobile: Vertical, Desktop: Horizontal */}
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center px-8 py-8 gap-8 lg:gap-12" onClick={(e) => e.stopPropagation()}>
          {/* Album Art - quase 40% da largura em telas grandes */}
          <div className="flex items-center justify-center lg:flex-shrink-0 lg:w-[38%]">
            <div className="relative w-80 h-80 lg:w-full lg:h-auto lg:aspect-square max-w-sm lg:max-w-none">
              <img
                src={currentTrack.album.images[0]?.url}
                alt={currentTrack.name}
                className="w-full h-full rounded-lg shadow-2xl object-cover animate-fade-in-scale"
              />
            </div>
          </div>

          {/* Right Side - Track Info, Progress, Controls */}
          <div className="flex-1 flex flex-col justify-center space-y-8 lg:space-y-12 min-w-0 lg:w-[60%]">
            {/* Track Info */}
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

            {/* Progress Bar */}
            <div>
              <div
                className="w-full h-2 bg-gray-600 rounded-full cursor-pointer group mb-4"
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
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(currentPosition)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
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

  // Player Compacto (Mini Player) - Sempre visível
  return (
    <div
      className="fixed bottom-[72px] lg:bottom-0 left-0 lg:left-[250px] right-0 border-t border-gray-700/30 z-50 shadow-2xl"
      style={{ backgroundColor: '#000000' }}
      onClick={handlePlayerClick}
    >
      <div className="flex flex-col">
        {/* Progress bar no topo - apenas desktop */}

        <div className="flex items-center justify-between h-20 lg:h-24 px-4 lg:px-6 py-4 lg:py-6 hover:bg-gray-900/20 transition-colors duration-200">
          {/* Left: Track Info with Heart */}
          <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0 max-w-[30%] lg:max-w-[25%] track-info-area">
            {currentTrack ? (
              <>
                <div className="relative overflow-hidden rounded-md group">
                  <img
                    src={currentTrack.album.images[0]?.url}
                    alt={currentTrack.name}
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-md object-cover transition-transform duration-200 group-hover:scale-105"
                    key={currentTrack.id}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <h4 className="text-white text-sm lg:text-base font-normal truncate hover:underline cursor-pointer transition-colors">
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
                  <div className="text-gray-400 text-xs lg:text-sm truncate">
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

          {/* Center: Player Controls - Sempre mostrar */}
          <div className="flex flex-col items-center justify-center flex-1 max-w-[40%] lg:max-w-[50%]">
            <div className="flex items-center justify-center space-x-2 lg:space-x-4 mb-2">
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
                className="text-gray-300 hover:text-white transition-all duration-200 p-2 cursor-pointer hover:bg-white/10 rounded-full hover:scale-105"
              >
                <SkipPrevIcon size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="bg-white text-black rounded-full p-2 lg:p-2.5 hover:scale-105 active:scale-95 transition-all duration-200 ease-out hover:bg-gray-100 shadow-lg cursor-pointer flex items-center justify-center"
              >
                {isPlaying ? (
                  <PauseIcon size={16} />
                ) : (
                  <PlayIcon size={16} className="ml-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextTrack();
                }}
                className="text-gray-300 hover:text-white transition-all duration-200 p-2 cursor-pointer hover:bg-white/10 rounded-full hover:scale-105"
              >
                <SkipNextIcon size={20} />
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

            {/* Progress Bar - Mobile */}
            <div className="w-full max-w-xs lg:hidden">
              <div
                className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeek(e);
                }}
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Volume and Add to Playlist - Sempre mostrar */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-1 justify-end max-w-[30%] lg:max-w-[25%]">
            {/* Volume Control - Desktop Only */}
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
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #fff 0%, #fff ${volumeState}%, #4b5563 ${volumeState}%, #4b5563 100%)`,
                }}
              />
            </div>

            {/* Add to Playlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddToPlaylistModal(true);
              }}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer p-2 hover:bg-white/10 rounded-full"
              title="Adicionar à playlist"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Add to Playlist Modal */}
      {showAddToPlaylistModal && currentTrack && (
        <AddToPlaylistModal
          isOpen={showAddToPlaylistModal}
          track={currentTrack}
          onClose={() => setShowAddToPlaylistModal(false)}
        />
      )}
    </div>
  );
};
