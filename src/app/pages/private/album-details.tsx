import { useParams, useNavigate } from 'react-router-dom';

import { QueryState } from '../../components/QueryState';
import { TrackList } from '../../../features/tracks/TrackList';
import { useAlbumDetails, useAlbumTracks } from '../../../features/artists/useAlbumDetails';
import { useArtistDetails } from '../../../features/artists/useArtistDetails';
import { DefaultPage } from '../../layout/DefaultPage';
import { formatDatePtBR } from '../../../utils/formatDatePtBR';
import { formatTotalDurationFromPages } from '../../../utils/formatTotalDuration';

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

  const primaryArtistId = albumDetails?.artists?.[0]?.id || '';
  const { data: primaryArtist } = useArtistDetails(primaryArtistId);

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
                {primaryArtist?.images?.[0]?.url ? (
                  <img
                    src={primaryArtist.images[0].url}
                    alt={albumDetails.artists?.[0]?.name || 'Artista'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600" />
                )}
                <span
                  className="font-medium text-white-text hover:underline cursor-pointer hover:text-green-500"
                  onClick={() => handleArtistClick(albumDetails.artists?.[0]?.id)}
                >
                  {albumDetails.artists?.[0]?.name}
                </span>
              </div>
              <span>•</span>
              <span>{formatDatePtBR(albumDetails.release_date)}</span>
              {tracksData && (
                <>
                  <span>•</span>
                   <span>{formatTotalDurationFromPages(tracksData, (item: any) => item.duration_ms)}</span>
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
              defaultAlbumImageUrl={albumDetails.images?.[0]?.url}
              defaultAlbumName={albumDetails.name}
            />
          )}
        </div>
      </div>
    </DefaultPage>
  );
};

export default AlbumDetalhes;
