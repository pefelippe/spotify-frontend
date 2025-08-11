import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfiniteScrollList } from './InfiniteScrollList';
import { usePlayer } from '../../features/player';
import { useLikedTracks } from '../../features/liked-songs/liked-tracks-provider';
import { useAddToLikedSongs, useRemoveFromLikedSongs } from '../../core/api/hooks/useLikedSongs';
import { AddToPlaylistModal } from '../../features/playlists/AddToPlaylistModal';
import { formatDuration } from '../../utils/formatDuration';
import { formatAddedDate } from '../../utils/formatAddedDate';
import { PlayIcon, HeartIcon, PlayingIcon, TimeIcon, PlusIcon } from '../../app/components/SpotifyIcons';
import { extractIdFromUri } from '../../utils/spotify/extractIdFromUri';

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
  defaultAlbumImageUrl?: string;
  defaultAlbumName?: string;
  showIndex?: boolean;
  showAddedDate?: boolean;
}

export const TrackList = ({
  data,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isPlaylist = false,
  contextUri,
  onRemoveTrack,
  defaultAlbumImageUrl,
  defaultAlbumName,
  showIndex = true,
  showAddedDate = true,
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
      return (data?.pages as Array<any> | undefined)?.flatMap((page: any) =>
              page.items
                .map((item: any) => ({
                  ...item.track,
                  added_at: item.added_at,
                }))
                .filter(Boolean),
            ) || [];
    }

    const tracks = (data?.pages as Array<any> | undefined)?.flatMap((page: any) => page.items) || [];

    return (tracks as Array<any>).filter((track: any) => {
          if (!track || !track.id || !track.name) {
            return false;
          }
          return true;
        });
  }, [data, isPlaylist]);

  const handlePlayTrack = (track: Track) => {
    const trackUri = track.uri || `spotify:track:${track.id}`;
    console.log('Playing track:', {
      trackUri,
      contextUri,
      trackName: track.name,
      trackArtists: track.artists.map(a => a.name),
    });

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
    const trackImage =
      track.album?.images?.[0]?.url ||
      defaultAlbumImageUrl ||
      'https://via.placeholder.com/64x64/333/fff?text=♪';

    return (
      <div
        className="flex items-center px-2 lg:px-4 py-1 lg:py-3 rounded-md hover:bg-gray-800 hover:bg-opacity-50 group cursor-pointer transition-colors"
        onMouseEnter={() => setHoveredTrack(track.id)}
        onMouseLeave={() => setHoveredTrack(null)}
        onClick={() => handlePlayTrack(track)}
      >
        <div className="w-8 mr-3 flex justify-center flex-shrink-0 max-lg:hidden">
          <div className="hidden lg:block">
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
            ) : showIndex ? (
              <span className="text-gray-400 text-sm font-medium">
                {trackNumber}
              </span>
            ) : (
              <span className="text-gray-400 text-sm font-medium opacity-0">-</span>
            )}
          </div>
          <div className="lg:hidden">
            {showIndex ? (
              <span className="text-gray-400 text-sm font-medium">{trackNumber}</span>
            ) : (
              <span className="text-gray-400 text-sm font-medium opacity-0">-</span>
            )}
          </div>
        </div>

        <div className="w-12 h-12 mr-3 flex-shrink-0">
          <img
            src={trackImage}
            alt={track.name}
            className="w-full h-full object-cover rounded"
          />
        </div>

        <div className="flex-1 min-w-0 mr-1.5 lg:mr-3">
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
                    handleArtistClick(extractIdFromUri(artist.uri));
                  }}
                >
                  {artist.name || 'Artista desconhecido'}
                </span>
                {index < (track.artists?.length || 0) - 1 && ', '}
              </span>
            )) || 'Artista desconhecido'}
          </div>
        </div>

        <div className="hidden lg:block w-48 mr-4 min-w-0 flex-shrink-0">
          <div className="text-gray-400 text-sm truncate hover:underline hover:text-white cursor-pointer">
            {track.album?.name || defaultAlbumName || 'Álbum desconhecido'}
          </div>
        </div>

        {showAddedDate && (
          <div className="hidden lg:block w-32 mr-4 flex-shrink-0">
            <div className="text-gray-400 text-sm">
              {(track as any).added_at ? formatAddedDate((track as any).added_at) : 'Data desconhecida'}
            </div>
          </div>
        )}

        <div className="w-6 lg:w-8 flex justify-center mr-1.5 lg:mr-3 flex-shrink-0">
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

        <div className="w-6 lg:w-8 flex justify-center mr-1.5 lg:mr-3 flex-shrink-0">
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

        <div className="hidden lg:block w-12 text-right flex-shrink-0">
          <span className="text-gray-400 text-sm font-normal">
            {formatDuration(track.duration_ms || 0)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center px-2 lg:px-4 py-2 border-b border-gray-800 text-gray-400 text-sm font-normal mb-4">
        <div className="hidden lg:block w-8 mr-3 text-center">#</div>
        <div className="w-12 mr-3">Imagem</div>
        <div className="flex-1 mr-3">Título</div>
        <div className="hidden lg:block w-48 mr-4">Álbum</div>
        {showAddedDate && <div className="hidden lg:block w-32 mr-4">Adicionado em</div>}
        <div className="hidden lg:block w-8 mr-3"></div>
        <div className="hidden lg:block w-8 mr-3"></div>
        {onRemoveTrack && <div className="hidden lg:block w-8 mr-3"></div>}
        <div className="hidden lg:flex w-12 justify-end">
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

