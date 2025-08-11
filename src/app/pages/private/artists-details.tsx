
import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { TrackList } from '../../components/TrackList';
import { useArtistDiscography, useArtistCollaborations } from '../../../core/api/hooks/useArtistAlbums';
import { useArtistDetails } from '../../../core/api/hooks/useArtistDetails';
import { useArtistTopTracks } from '../../../core/api/hooks/useArtistTopTracks';
import { useFollowArtist, useIsFollowingArtist, useUnfollowArtist } from '../../../core/api/hooks/useFollowArtist';
import { usePlayer } from '../../../features/player';
import { DefaultPage } from '../../layout/DefaultPage';
import { ArtistHeader } from '../../../features/artists/ArtistHeader';
import { CustomSection, CustomHomeSectionItem } from '../../components/CustomSection';

const ArtistaDetalhes = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const {
    data: discographyData,
    isLoading: isLoadingDiscography,
    error: discographyError,
  } = useArtistDiscography(artistId!);

  const {
    isLoading: isLoadingCollaborations,
    error: collaborationsError,
  } = useArtistCollaborations(artistId!);

  const {
    data: artistDetails,
    isLoading: isLoadingArtist,
    error: artistError,
  } = useArtistDetails(artistId!);

  const { data: isFollowing = false } = useIsFollowingArtist(artistId);
  const followMutation = useFollowArtist();
  const unfollowMutation = useUnfollowArtist();

  const {
    data: topTracksData,
    isLoading: isLoadingTopTracks,
    error: topTracksError,
  } = useArtistTopTracks(artistId!);

  const allDiscography = useMemo(() => {
    return discographyData?.pages.flatMap(page =>
      page.items.filter((album: any) => album.album_type !== 'compilation'),
    ) || [];
  }, [discographyData]);

  const topTracks = useMemo(() => {
    return topTracksData?.tracks?.slice(0, 5) || [];
  }, [topTracksData]);

  const albumItems: CustomHomeSectionItem[] = useMemo(() => {
    return (allDiscography || [])
      .filter((item: any) => item.album_type === 'album')
      .map((a: any) => ({
        id: a.id,
        title: a.name,
        subtitle: (a.artists || []).map((ar: any) => ar.name).join(', '),
        imageSrc: a.images?.[0]?.url || 'https://via.placeholder.com/200x200/333/fff?text=♪',
        playback: { contextUri: a.uri },
      }));
  }, [allDiscography]);

  const singleItems: CustomHomeSectionItem[] = useMemo(() => {
    return (allDiscography || [])
      .filter((item: any) => item.album_type === 'single' && item.total_tracks === 1)
      .map((a: any) => ({
        id: a.id,
        title: a.name,
        subtitle: (a.artists || []).map((ar: any) => ar.name).join(', '),
        imageSrc: a.images?.[0]?.url || 'https://via.placeholder.com/200x200/333/fff?text=♪',
        playback: { contextUri: a.uri },
      }));
  }, [allDiscography]);

  const artistName = artistDetails?.name || allDiscography[0]?.artists?.[0]?.name || 'Artista';
  const isAnyLoading = isLoadingDiscography || isLoadingCollaborations || isLoadingArtist || isLoadingTopTracks;
  const hasAnyError = discographyError || collaborationsError || artistError || topTracksError;

  if (!artistId) {
    return (
      <DefaultPage
        title="Artista não encontrado"
        subtitle="O artista que você está procurando não foi encontrado"
        hasBackButton
      >
        <div className="text-center py-12 text-gray-400">
          Artista não encontrado
        </div>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage
      title={artistName}
      isLoading={isAnyLoading}
      error={hasAnyError}
      loadingMessage="Carregando detalhes do artista..."
      errorMessage="Tente novamente mais tarde."
      hasBackButton
    >
      <div className="space-y-8">
        <ArtistHeader
          imageUrl={artistDetails?.images?.[0]?.url || allDiscography[0]?.images?.[0]?.url || ''}
          name={artistName}
          followers={artistDetails?.followers?.total}
          onPlay={() => {
            const contextUri = `spotify:artist:${artistId}`;
            playTrack('', contextUri);
          }}
          isFollowing={isFollowing}
          onToggleFollow={() => {
            if (!artistId) {
              return;
            }
            if (isFollowing) {
              unfollowMutation.mutate({ artistId });
            } else {
              followMutation.mutate({ artistId });
            }
          }}
        />

        {topTracks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-semibold text-white-text mb-4 md:mb-6">Músicas Populares</h3>
            <TrackList
              data={{ pages: [{ items: topTracks }] }}
              isPlaylist={false}
              contextUri={`spotify:artist:${artistId}`}
              showIndex={false}
              showAddedDate={false}
            />
          </div>
        )}

        {albumItems.length > 0 && (
          <CustomSection
            title="Álbuns"
            data={albumItems}
            onClickData={(albumId) => navigate(`/album/${albumId}`)}
            hasShowMore={false}
          />
        )}

        {singleItems.length > 0 && (
          <CustomSection
            title="Singles"
            data={singleItems}
            onClickData={(albumId) => navigate(`/album/${albumId}`)}
            hasShowMore={false}
          />
        )}
        
      </div>
    </DefaultPage>
  );
};

export default ArtistaDetalhes;

