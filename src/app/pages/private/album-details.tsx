import { useParams, useNavigate } from 'react-router-dom';

import { QueryState } from '../../components/QueryState';
import { TrackList } from '../../../features/tracks/TrackList';
import { useAlbumDetails, useAlbumTracks } from '../../../features/artists/useAlbumDetails';
import { useArtistDetails } from '../../../features/artists/useArtistDetails';
import { DefaultPage } from '../../layout/DefaultPage';
import { formatTotalDurationFromPages } from '../../../utils/formatTotalDuration';
import { AlbumHeader } from '../../components/album/AlbumHeader';

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
        <AlbumHeader
          album={albumDetails}
          primaryArtist={primaryArtist}
          onClickArtist={handleArtistClick}
          totalDurationText={tracksData ? formatTotalDurationFromPages(tracksData, (item: any) => item.duration_ms) : undefined}
        />

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
