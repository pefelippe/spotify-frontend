import { useParams, useNavigate } from 'react-router-dom';

import { QueryState } from '../../components/QueryState';
import { TrackList } from '../../components/TrackList';
import { useAlbumDetails, useAlbumTracks } from '../../../core/api/hooks/useAlbumDetails';
import { useArtistDetails } from '../../../core/api/hooks/useArtistDetails';
import { DefaultPage } from '../../layout/DefaultPage';
import { formatTotalDurationFromPages } from '../../../utils/formatTotalDuration';
import TrackInfoDetailed from '../../components/TrackInfoDetailed';
import { formatDatePtBR } from '../../../utils/formatDatePtBR';
import { usePlayer } from '../../../features/player';

const AlbumDetalhes = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { data: albumDetails, isLoading: isLoadingDetails, error: detailsError } = useAlbumDetails(albumId!);
  const { playTrack, isReady, deviceId } = usePlayer();
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

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  return (
    <DefaultPage
      isLoading={isLoadingDetails}
      error={detailsError || !albumId}
      loadingMessage="Carregando detalhes do álbum..."
      errorMessage="Tente novamente mais tarde."
      hasBackButton
    >
      <div className="space-y-8">
        {(() => {
          const imageUrl = albumDetails?.images?.[0]?.url || '';
          const typeLabel = albumDetails?.album_type === 'album' ? 'Álbum' : (albumDetails?.album_type === 'single' ? 'Single' : albumDetails?.album_type);
          const primaryLabel = albumDetails?.artists?.[0]?.name || '';
          const primaryAvatarUrl = primaryArtist?.images?.[0]?.url || '';
          const metaItems = [
            formatDatePtBR(albumDetails?.release_date),
            ...(tracksData ? [formatTotalDurationFromPages(tracksData, (item: any) => item?.duration_ms)] : []),
          ];
          return (
            <TrackInfoDetailed
              imageUrl={imageUrl}
              title={albumDetails?.name}
              typeLabel={typeLabel}
              primaryLabel={primaryLabel}
              primaryAvatarUrl={primaryAvatarUrl}
              onClickPrimaryLabel={() => handleArtistClick(albumDetails?.artists?.[0]?.id)}
              metaItems={metaItems}
              onClickPlay={() => {
                const contextUri = `spotify:album:${albumId}`;
                if (!isReady || !deviceId) return;
                playTrack('', contextUri);
              }}
            />
          );
        })()}

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
