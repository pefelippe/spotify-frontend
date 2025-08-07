import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '@/app/providers/player-provider';
import { useLikedTracks } from '@/app/providers/liked-tracks-provider';
import { AddToPlaylistModal } from '@/components/AddToPlaylistModal';
import {
  PlayIcon,
  PauseIcon,
  SkipNextIcon,
  SkipPrevIcon,
  ShuffleIcon,
  RepeatIcon,
  VolumeIcon,
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
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekToPosition,
    setVolume,
  } = usePlayer();

  const { isTrackLiked, toggleLikeTrack } = useLikedTracks();

  const [currentPosition, setCurrentPosition] = useState(0);
  const [volume, setVolumeState] = useState(50);
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
    const percent = (e.clientX - rect.left) / rect.width;
    const newPosition = Math.floor(percent * duration);
    setCurrentPosition(newPosition);
    seekToPosition(newPosition);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume / 100);

    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      // Unmute: restore previous volume
      setVolumeState(previousVolume);
      setVolume(previousVolume / 100);
      setIsMuted(false);
    } else {
      // Mute: save current volume and set to 0
      setPreviousVolume(volume);
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
    // TODO: Implementar shuffle na API
  };

  const handleRepeat = () => {
    setRepeat((prev) => (prev + 1) % 3);
    // TODO: Implementar repeat na API
  };

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  const handlePlayerExpand = () => {
    setIsExpanded(true);
  };

  const handlePlayerCollapse = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 200); // Duração da animação de saída
  };

  const handlePlayerClick = (e: React.MouseEvent) => {
    // Em telas grandes, só expandir se clicar na área de informações da música
    const target = e.target as HTMLElement;
    const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint

    if (isLargeScreen) {
      // Só expandir se clicar na div de informações da música ou botões de like/add
      const trackInfoArea = target.closest('.track-info-area');
      if (!trackInfoArea) {
        return;
      }
    } else if (target.closest('button')) {
      // Em telas pequenas, não expandir se clicar nos controles
      return;
    }

    handlePlayerExpand();
  };

  if (!isReady || !currentTrack) {
    return (
      <div className="fixed bottom-[72px] lg:bottom-0 left-0 lg:left-[250px] right-0 bg-black border-t border-gray-800 z-50 transform translate-y-full" />
    );
  }

  const progressPercent = duration > 0 ? (currentPosition / duration) * 100 : 0;
  const isCurrentTrackLiked = isTrackLiked(currentTrack.id);

  // Player Expandido (Fullscreen)
  if (isExpanded) {
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
                  className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Bolinha branca sempre visível na posição atual */}
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                  {/* Bolinha maior no hover */}
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(currentPosition)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div>
              <div className="flex items-center justify-start space-x-8">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShuffle();
                  }}
                  className={`p-3 transition-colors cursor-pointer ${
                    shuffle
                      ? 'text-green-500 hover:text-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ShuffleIcon size={28} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previousTrack();
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-3 cursor-pointer"
                >
                  <SkipPrevIcon size={36} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause();
                  }}
                  className="bg-white text-black rounded-full p-5 hover:scale-110 active:scale-95 transition-all duration-150 ease-out hover:bg-gray-200 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  {isPlaying ? (
                    <PauseIcon size={36} />
                  ) : (
                    <PlayIcon size={36} />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextTrack();
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-3 cursor-pointer"
                >
                  <SkipNextIcon size={36} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRepeat();
                  }}
                  className={`p-3 transition-colors relative cursor-pointer ${
                    repeat > 0
                      ? 'text-green-500 hover:text-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <RepeatIcon size={28} />
                  {repeat === 2 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>
              </div>


            </div>
          </div>
        </div>

        {/* Add to Playlist Modal */}
        <AddToPlaylistModal
          isOpen={showAddToPlaylistModal}
          onClose={() => setShowAddToPlaylistModal(false)}
          track={currentTrack ? {
            id: currentTrack.id,
            uri: currentTrack.uri,
            name: currentTrack.name,
            artists: currentTrack.artists,
          } : null}
        />
      </div>
    );
  }

  // Player Compacto (Mini Player)
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
          </div>

          {/* Center: Player Controls */}
          <div className="flex flex-col items-center justify-center flex-1 max-w-[40%] lg:max-w-[50%]">
            {/* Controls Row */}
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
                className={`p-2 rounded-full transition-all duration-200 cursor-pointer hidden lg:flex items-center justify-center hover:bg-white/10 hover:scale-105 relative ${
                  repeat > 0
                    ? 'text-green-500 hover:text-green-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <RepeatIcon size={16} />
                {repeat === 2 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-black"></span>
                )}
              </button>
            </div>

            {/* Progress Bar Row - apenas desktop */}
            <div className="w-full hidden lg:block">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-10 text-right">{formatTime(currentPosition)}</span>
                <div className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group" onClick={handleSeek}>
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300 relative group-hover:bg-green-400"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                  </div>
                </div>
                <span className="w-10">{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Right: Volume Control */}
          <div className="items-center space-x-3 flex-1 justify-end max-w-[25%] hidden lg:flex">
            <div className="flex items-center space-x-3 group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMuteToggle();
                }}
                className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 p-1 hover:bg-white/10 rounded-full"
              >
                {isMuted || volume === 0 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : volume < 33 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                  </svg>
                ) : volume < 66 ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
              <div className="w-24 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-600 rounded-full appearance-none slider cursor-pointer transition-all duration-200 hover:h-1.5"
                  style={{
                    background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #4B5563 ${volume}%, #4B5563 100%)`,
                  }}
                />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none"
                  style={{ left: `calc(${volume}% - 6px)` }}
                />
              </div>

              {/* Fullscreen Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayerExpand();
                }}
                className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-200 p-1 hover:bg-white/10 rounded-full ml-2"
                title="Expandir player"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={showAddToPlaylistModal}
        onClose={() => setShowAddToPlaylistModal(false)}
        track={currentTrack ? {
          id: currentTrack.id,
          uri: currentTrack.uri,
          name: currentTrack.name,
          artists: currentTrack.artists,
        } : null}
      />
    </div>
  );
};
