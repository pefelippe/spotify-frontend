import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfiniteScrollList } from './InfiniteScrollList';
import { usePlayer } from '../providers/player-provider';
import { useLikedTracks } from '../providers/liked-tracks-provider';
import { useAddToLikedSongs, useRemoveFromLikedSongs } from '../hooks/useLikedSongs';
import { AddToPlaylistModal } from './AddToPlaylistModal';
import { PlayIcon, PauseIcon, HeartIcon, PlusIcon, MoreIcon, PlayingIcon, TimeIcon } from './SpotifyIcons';

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
  };
}

interface PlaylistTrack {
  track: Track;
  added_at: string;
}

interface TrackListProps {
  data: any;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  isPlaylist?: boolean;
  contextUri?: string;
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
}: TrackListProps) => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { isTrackLiked } = useLikedTracks();
  const addToLikedSongs = useAddToLikedSongs();
  const removeFromLikedSongs = useRemoveFromLikedSongs();
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const allTracks = useMemo(() => {
    if (isPlaylist) {
      const tracks = data?.pages.flatMap(page =>
        page.items.map((item: any) => ({
          ...item.track,
          added_at: item.added_at,
        })).filter(Boolean),
      ) || [];
      return tracks;
    }

    const tracks = data?.pages.flatMap(page => page.items) || [];

    const validTracks = tracks.filter(track => {
      if (!track || !track.id || !track.name) {
        return false;
      }
      return true;
    });

    return validTracks;
  }, [data, isPlaylist]);

  const handlePlayTrack = (track: Track) => {
    const trackUri = track.uri || `spotify:track:${track.id}`;
    playTrack(trackUri, contextUri);
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
    setSelectedTrack(track);
    setShowAddToPlaylistModal(true);
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

    return (
      <div
        className="flex items-center px-4 py-2 rounded-md hover:bg-gray-800 hover:bg-opacity-50 group cursor-pointer"
        onMouseEnter={() => setHoveredTrack(track.id)}
        onMouseLeave={() => setHoveredTrack(null)}
      >
        <div className="w-4 mr-4 flex justify-center">
          {isCurrentTrackPlaying(track) ? (
            <div className="text-green-500">
              <PlayingIcon size={14} />
            </div>
          ) : isCurrentTrack(track) ? (
            <div className="text-green-500">
              <PlayIcon size={14} />
            </div>
          ) : hoveredTrack === track.id ? (
            <button
              className="text-white hover:text-green-500 cursor-pointer"
              onClick={() => handlePlayTrack(track)}
            >
              <PlayIcon size={14} />
            </button>
          ) : (
            <span className="text-gray-400 text-sm font-medium">
              {trackNumber}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center space-x-2">
            <h4 className={`font-normal text-sm truncate ${
              isCurrentTrack(track) ? 'text-green-500' : 'text-white'
            }`}>
              {track.name || 'Música sem nome'}
            </h4>
            {track.explicit && (
              <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded text-[10px] font-bold">
                E
              </span>
            )}
          </div>
          <div className="text-gray-400 text-sm truncate">
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

        {isPlaylist && (
          <div className="w-48 mr-4 min-w-0">
            <div className="text-gray-400 text-sm truncate hover:underline hover:text-white cursor-pointer">
              {track.album?.name || 'Álbum desconhecido'}
            </div>
          </div>
        )}

        {isPlaylist && (
          <div className="w-32 mr-4">
            <div className="text-gray-400 text-sm">
              {(track as any).added_at ? formatAddedDate((track as any).added_at) : 'Data desconhecida'}
            </div>
          </div>
        )}

        <div className="w-8 flex justify-center mr-4">
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

        <div className="w-16 text-right pr-2">
          <span className="text-gray-400 text-sm font-normal">
            {formatDuration(track.duration_ms || 0)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center px-4 py-2 border-b border-gray-800 text-gray-400 text-sm font-normal mb-4">
        <div className="w-4 mr-4 text-center">#</div>
        <div className="flex-1 mr-4">Título</div>
        {isPlaylist && (
          <>
            <div className="w-48 mr-4">Álbum</div>
            <div className="w-32 mr-4">Adicionado em</div>
          </>
        )}
        <div className="w-8 mr-4"></div>
        <div className="w-16 flex justify-end pr-2">
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
        track={selectedTrack}
      />
    </div>
  );
};
