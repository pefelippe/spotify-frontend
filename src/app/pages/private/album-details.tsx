import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '@/app/components/BackButton';
import { QueryState } from '@/app/components/QueryState';
import { TrackList } from '@/app/components/TrackList';
import { UserAvatar } from '@/app/components/UserAvatar';
import { useAlbumDetails, useAlbumTracks } from '@/app/hooks/useAlbumDetails';

const AlbumDetalhes = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { data: albumDetails, isLoading: isLoadingDetails, error: detailsError } = useAlbumDetails(albumId!);
  const {
    data: tracksData,
    isLoading: isLoadingTracks,
    error: tracksError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAlbumTracks(albumId!);

  if (!albumId) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center space-x-4 mb-8">
          <BackButton artistName="Álbum não encontrado" />
          <h1 className="text-2xl font-bold text-white-text">Álbum não encontrado</h1>
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
            {isLoadingDetails ? 'Carregando álbum...' : 'Erro ao carregar álbum'}
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

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

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
        return pageTotal + (item.duration_ms || 0);
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
        <BackButton artistName={albumDetails.name} />
      </div>

      {/* Album Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-6 mb-8">
        <img
          src={albumDetails.images?.[0]?.url || ''}
          alt={albumDetails.name}
          className="w-48 h-48 rounded-lg object-cover shadow-2xl"
        />
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
            {albumDetails.album_type === 'album' ? 'Álbum' :
             albumDetails.album_type === 'single' ? 'Single' :
             albumDetails.album_type}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white-text mb-4">
            {albumDetails.name}
          </h1>
          <div className="flex flex-wrap items-center text-gray-400 text-sm space-x-1">
            <div className="flex items-center space-x-2">
              <UserAvatar
                userId={albumDetails.artists?.[0]?.id || ''}
                displayName={albumDetails.artists?.[0]?.name || ''}
                size="md"
              />
              <span
                className="font-medium text-white-text hover:underline cursor-pointer hover:text-green-500"
                onClick={() => handleArtistClick(albumDetails.artists?.[0]?.id)}
              >
                {albumDetails.artists?.[0]?.name}
              </span>
            </div>
            <span>•</span>
            <span>{formatDate(albumDetails.release_date)}</span>
            <span>•</span>
            <span>{albumDetails.total_tracks} músicas</span>
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
            isPlaylist={false}
            contextUri={`spotify:album:${albumId}`}
          />
        )}
      </div>
    </div>
  );
};

export default AlbumDetalhes;
