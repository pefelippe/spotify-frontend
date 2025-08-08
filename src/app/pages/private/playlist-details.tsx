import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '@/app/layout/BackButton';
import { QueryState } from '@/app/components/QueryState';
import { TrackList } from '@/features/tracks/TrackList';
import { UserAvatar } from '@/app/components/UserAvatar';
import { usePlaylistDetails, usePlaylistTracks } from '@/features/playlist/usePlaylistDetails';

const PlaylistDetalhes = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { data: playlistDetails, isLoading: isLoadingDetails, error: detailsError } = usePlaylistDetails(playlistId!);
  const {
    data: tracksData,
    isLoading: isLoadingTracks,
    error: tracksError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePlaylistTracks(playlistId!);

  const handleOwnerClick = (ownerId: string) => {
    navigate(`/user/${ownerId}`);
  };

  if (!playlistId) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center space-x-4 mb-8">
          <BackButton artistName="Playlist não encontrada" />
          <h1 className="text-2xl font-bold text-white-text">Playlist não encontrada</h1>
        </div>
      </div>
    );
  }

  if (isLoadingDetails || detailsError) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center space-x-4 mb-8">
          <BackButton artistName={isLoadingDetails ? 'Carregando...' : 'Erro'} />
          <h1 className="text-2xl font-bold text-white-text">
            {isLoadingDetails ? 'Carregando playlist...' : 'Erro ao carregar playlist'}
          </h1>
        </div>
        <QueryState
          isLoading={isLoadingDetails}
          error={detailsError}
          loadingMessage=""
          errorMessage="Tente novamente mais tarde."
          centered={false}
        />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTotalDuration = (tracks: any) => {
    if (!tracks?.pages) {
      return '';
    }

    const totalMs = tracks.pages.reduce((total: number, page: any) => {
      return total + page.items.reduce((pageTotal: number, item: any) => {
        return pageTotal + (item.track?.duration_ms || 0);
      }, 0);
    }, 0);

    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center space-x-4 mb-8">
        <BackButton artistName={playlistDetails.name} />
      </div>

      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-6 mb-8">
        <img
          src={playlistDetails.images?.[0]?.url || 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'}
          alt={playlistDetails.name}
          className="w-48 h-48 rounded-lg object-cover shadow-2xl"
        />
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
            Playlist
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white-text mb-4">
            {playlistDetails.name}
          </h1>
          {playlistDetails.description && (
            <p className="text-gray-400 text-sm mb-4 max-w-2xl">
              {playlistDetails.description}
            </p>
          )}
          <div className="flex flex-wrap items-center text-gray-400 text-sm space-x-1">
            <div className="flex items-center space-x-2">
              <UserAvatar
                userId={playlistDetails.owner?.id || ''}
                displayName={playlistDetails.owner?.display_name || ''}
                size="md"
              />
              <span
                className="font-medium text-white-text hover:underline cursor-pointer hover:text-green-500"
                onClick={() => handleOwnerClick(playlistDetails.owner?.id)}
              >
                {playlistDetails.owner?.display_name}
              </span>
            </div>
            {playlistDetails.followers?.total && (
              <>
                <span>•</span>
                <span>{playlistDetails.followers.total.toLocaleString()} seguidores</span>
              </>
            )}
            <span>•</span>
            <span>{playlistDetails.tracks?.total} músicas</span>
            {tracksData && (
              <>
                <span>•</span>
                <span>{formatTotalDuration(tracksData)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div>
        {isLoadingTracks ? (
          <QueryState
            isLoading={true}
            loadingMessage="Carregando músicas..."
            centered={false}
          />
        ) : tracksError ? (
          <QueryState
            error={tracksError}
            errorMessage="Erro ao carregar músicas."
            centered={false}
          />
        ) : (
          <TrackList
            data={tracksData}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isPlaylist={true}
            contextUri={`spotify:playlist:${playlistId}`}
          />
        )}
      </div>
    </div>
  );
};

export default PlaylistDetalhes;
