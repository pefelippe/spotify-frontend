import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfiniteScrollList } from '@/app/components/InfiniteScrollList';
import { usePlayer } from '@/features/player';
import { useLikedTracks } from '@/features/liked-songs/liked-tracks-provider';
import { useAddToLikedSongs, useRemoveFromLikedSongs } from '@/features/liked-songs/useLikedSongs';
import { AddToPlaylistModal } from '@/app/components/AddToPlaylistModal';
import { PlayIcon, HeartIcon, PlayingIcon, TimeIcon, PlusIcon } from '@/app/components/SpotifyIcons';

interface Track {
  id: string;
  uri: string;
  name: string;
  artists: Array<{ name: string; uri?: string }>;
  duration_ms: number;
  track_number?: number;
  explicit?: boolean;
  album?: {
    name: string;
    id: string;
    uri?: string;
    images?: Array<{ url: string }>;
  };
}

interface TrackListProps {
  data: any;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  isPlaylist?: boolean;
  contextUri?: string;
  onRemoveTrack?: (trackUri: string) => Promise<void>;
}

const formatDuration = (ms: number) => {
  if (!ms || isNaN(ms)) {
    return '0:00';
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const formatAddedDate = (dateString: string) => {
  if (!dateString) {
    return 'Data desconhecida';
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'há 1 dia';
  } else if (diffDays < 7) {
    return `há ${diffDays} dias`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'há 1 semana' : `há ${weeks} semanas`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? 'há 1 mês' : `há ${months} meses`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? 'há 1 ano' : `há ${years} anos`;
  }
};

export const TrackList = ({
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isPlaylist = false,
  contextUri,
  onRemoveTrack,
}: TrackListProps) => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { isTrackLiked } = useLikedTracks();
  const addToLikedSongs = useAddToLikedSongs();
  const removeFromLikedSongs = useRemoveFromLikedSongs();
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<{ uri: string; name: string } | null>(null);

  const allTracks = useMemo(() => {
    if (isPlaylist) {
      const tracks = (data?.pages as Array<any> | undefined)?.flatMap((page: any) =>
        page.items
          .map((item: any) => ({
            ...item.track,
            added_at: item.added_at,
          }))
          .filter(Boolean),
      ) || [];
      return tracks;
    }

    const tracks = (data?.pages as Array<any> | undefined)?.flatMap((page: any) => page.items) || [];

    const validTracks = (tracks as Array<any>).filter((track: any) => {
      if (!track || !track.id || !track.name) {
        return false;
      }
      return true;
    });

    return validTracks;
  }, [data, isPlaylist]);

  const handlePlayTrack = (track: Track) => {
    const trackUri = track.uri || `spotify:track:${track.id}`;
    console.log('Playing track:', {
      trackUri,
      contextUri,
      trackName: track.name,
      trackArtists: track.artists.map(a => a.name),
    });

    // If contextUri is for liked songs, pass the specific track URI as offset
    if (contextUri === 'spotify:user:collection:tracks') {
      playTrack(trackUri, contextUri);
    } else {
      playTrack(trackUri, contextUri);
    }
  };

  const handleLikeTrack = (trackId: string) => {
    const isLiked = isTrackLiked(trackId);

    if (isLiked) {
      removeFromLikedSongs.mutate([trackId]);
    } else {
      addToLikedSongs.mutate([trackId]);
    }
  };

  const handleAddToPlaylist = (track: Track) => {
    setSelectedTrack({
      uri: track.uri,
      name: track.name,
    });
    setShowAddToPlaylistModal(true);
  };

  const handleRemoveTrack = async (trackUri: string) => {
    if (onRemoveTrack) {
      try {
        await onRemoveTrack(trackUri);
      } catch (error) {
        console.error('Failed to remove track:', error);
      }
    }
  };

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  const isCurrentTrack = (track: Track) => currentTrack?.id === track.id;
  const isCurrentTrackPlaying = (track: Track) => isCurrentTrack(track) && isPlaying;

  const renderTrackItem = (track: Track, index: number) => {
    if (!track || !track.id || !track.name) {
      return null;
    }

    const trackNumber = isPlaylist ? index + 1 : (track.track_number || index + 1);
    const trackImage = track.album?.images?.[0]?.url || 'https://via.placeholder.com/64x64/333/fff?text=♪';

    return (
      <div
        className="flex items-center px-4 py-3 rounded-md hover:bg-gray-800 hover:bg-opacity-50 group cursor-pointer transition-colors"
        onMouseEnter={() => setHoveredTrack(track.id)}
        onMouseLeave={() => setHoveredTrack(null)}
      >
        {/* Track Number / Play Button - Mobile: Always visible */}
        <div className="w-8 mr-3 flex justify-center flex-shrink-0">
          {isCurrentTrackPlaying(track) ? (
            <div className="text-green-500">
              <PlayingIcon size={16} />
            </div>
          ) : isCurrentTrack(track) ? (
            <div className="text-green-500">
              <PlayIcon size={16} />
            </div>
          ) : hoveredTrack === track.id ? (
            <button
              className="text-white hover:text-green-500 cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            >
              <PlayIcon size={16} />
            </button>
          ) : (
            <span className="text-gray-400 text-sm font-medium">
              {trackNumber}
            </span>
          )}
        </div>

        {/* Track Image - Mobile: Always visible */}
        <div className="w-12 h-12 mr-3 flex-shrink-0">
          <img
            src={trackImage}
            alt={track.name}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Track Info - Mobile: Main content */}
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className={`font-medium text-sm truncate ${
              isCurrentTrack(track) ? 'text-green-500' : 'text-white'
            }`}>
              {track.name || 'Música sem nome'}
            </h4>
            {track.explicit && (
              <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0">
                E
              </span>
            )}
          </div>
          <div className="text-gray-400 text-xs truncate">
            {track.artists?.map((artist, index) => (
              <span key={artist.uri || index}>
                <span
                  className="hover:underline hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArtistClick(artist.uri?.split(':')[2] || '');
                  }}
                >
                  {artist.name || 'Artista desconhecido'}
                </span>
                {index < (track.artists?.length || 0) - 1 && ', '}
              </span>
            )) || 'Artista desconhecido'}
          </div>
        </div>

        {/* Album Name - Desktop only */}
        <div className="hidden lg:block w-48 mr-4 min-w-0 flex-shrink-0">
          <div className="text-gray-400 text-sm truncate hover:underline hover:text-white cursor-pointer">
            {track.album?.name || 'Álbum desconhecido'}
          </div>
        </div>

        {/* Added Date - Desktop only */}
        <div className="hidden lg:block w-32 mr-4 flex-shrink-0">
          <div className="text-gray-400 text-sm">
            {(track as any).added_at ? formatAddedDate((track as any).added_at) : 'Data desconhecida'}
          </div>
        </div>

        {/* Like Button - Mobile: Always visible */}
        <div className="w-8 flex justify-center mr-3 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLikeTrack(track.id);
            }}
            className={`p-1 rounded-full cursor-pointer ${
              isTrackLiked(track.id)
                ? 'text-green-500 opacity-100'
                : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-green-500'
            }`}
          >
            <HeartIcon size={16} filled={isTrackLiked(track.id)} />
          </button>
        </div>

        {/* Add to Playlist Button - Mobile: Always visible */}
        <div className="w-8 flex justify-center mr-3 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToPlaylist(track);
            }}
            className="p-1 rounded-full cursor-pointer text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white"
          >
            <PlusIcon size={16} />
          </button>
        </div>

        {/* Remove Button - Only for playlist owners */}
        {onRemoveTrack && (
          <div className="w-8 flex justify-center mr-3 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTrack(track.uri);
              }}
              className="p-1 rounded-full cursor-pointer text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
            >
              <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>
          </div>
        )}

        {/* Duration - Mobile: Always visible */}
        <div className="w-12 text-right flex-shrink-0">
          <span className="text-gray-400 text-sm font-normal">
            {formatDuration(track.duration_ms || 0)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header - Desktop only */}
      <div className="hidden lg:flex items-center px-4 py-2 border-b border-gray-800 text-gray-400 text-sm font-normal mb-4">
        <div className="w-8 mr-3 text-center">#</div>
        <div className="w-12 mr-3">Imagem</div>
        <div className="flex-1 mr-3">Título</div>
        <div className="w-48 mr-4">Álbum</div>
        <div className="w-32 mr-4">Adicionado em</div>
        <div className="w-8 mr-3"></div>
        <div className="w-8 mr-3"></div>
        {onRemoveTrack && <div className="w-8 mr-3"></div>}
        <div className="w-12 flex justify-end">
          <TimeIcon size={16} className="opacity-50" />
        </div>
      </div>

      <InfiniteScrollList
        items={allTracks}
        renderItem={renderTrackItem}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        className="space-y-1"
        emptyComponent={
          <div className="text-center py-12 text-gray-400">
            Nenhuma música encontrada.
          </div>
        }
      />

      <AddToPlaylistModal
        isOpen={showAddToPlaylistModal}
        onClose={() => {
          setShowAddToPlaylistModal(false);
          setSelectedTrack(null);
        }}
        trackUri={selectedTrack?.uri || ''}
        trackName={selectedTrack?.name || ''}
      />
    </div>
  );
};

