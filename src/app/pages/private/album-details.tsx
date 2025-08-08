import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '@/app/layout/BackButton';
import { QueryState } from '@/app/components/QueryState';
import { TrackList } from '@/features/tracks/TrackList';
import { UserAvatar } from '@/app/components/UserAvatar';
import { useAlbumDetails, useAlbumTracks } from '@/features/artists/useAlbumDetails';
import { DefaultPage } from '@/app/layout/DefaultPage';

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
      <DefaultPage
        title="Álbum não encontrado"
        subtitle="O álbum que você está procurando não foi encontrado"
        hasBackButton
      >
        <div className="text-center py-12 text-gray-400">
          Álbum não encontrado
        </div>
      </DefaultPage>
    );
  }

  if (isLoadingDetails || detailsError) {
    return (
      <DefaultPage
        title={isLoadingDetails ? 'Carregando álbum...' : 'Erro ao carregar álbum'}
        subtitle="Aguarde enquanto carregamos as informações do álbum"
        isLoading={isLoadingDetails}
        error={detailsError}
        loadingMessage="Carregando detalhes do álbum..."
        errorMessage="Tente novamente mais tarde."
        hasBackButton
      >
        <div></div>
      </DefaultPage>
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
    <DefaultPage
      hasBackButton
    >
      <div className="space-y-8">
        {/* Album Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
          <img
            src={albumDetails.images?.[0]?.url || ''}
            alt={albumDetails.name}
            className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-2xl"
          />
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">
              {albumDetails.album_type === 'album' ? 'Álbum' :
               albumDetails.album_type === 'single' ? 'Single' :
               albumDetails.album_type}
            </p>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white-text mb-4">
              {albumDetails.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-400 text-sm space-x-1 mb-2">
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
    </DefaultPage>
  );
};

export default AlbumDetalhes;
