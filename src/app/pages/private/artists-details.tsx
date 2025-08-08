
import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

import ArtistAlbum from '@/features/artists/ArtistAlbum';
import { BackButton } from '@/app/layout/BackButton';
import { QueryState } from '@/app/components/QueryState';
import { InfiniteScrollList } from '@/app/components/InfiniteScrollList';
import { TrackList } from '@/features/tracks/TrackList';
import { useArtistDiscography, useArtistCollaborations } from '@/features/artists/useArtistAlbums';
import { useArtistDetails } from '@/features/artists/useArtistDetails';
import { useArtistTopTracks } from '@/features/artists/useArtistTopTracks';
import { usePlayer } from '@/features/player';
import { DefaultPage } from '@/app/layout/DefaultPage';

type DiscographyFilter = 'populares' | 'albuns' | 'singles' | 'eps';

const ArtistaDetalhes = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const { playTrack, deviceId, isReady } = usePlayer();
  const [discographyFilter, setDiscographyFilter] = useState<DiscographyFilter>('populares');
  // Discography (albums + singles)
  const {
    data: discographyData,
    isLoading: isLoadingDiscography,
    error: discographyError,
    fetchNextPage: fetchNextDiscographyPage,
    hasNextPage: hasNextDiscographyPage,
    isFetchingNextPage: isFetchingNextDiscographyPage,
  } = useArtistDiscography(artistId!);

  // Collaborations (appears_on)
  const {
    data: collaborationsData,
    isLoading: isLoadingCollaborations,
    error: collaborationsError,
    fetchNextPage: fetchNextCollaborationsPage,
    hasNextPage: hasNextCollaborationsPage,
    isFetchingNextPage: isFetchingNextCollaborationsPage,
  } = useArtistCollaborations(artistId!);

  // Artist details
  const {
    data: artistDetails,
    isLoading: isLoadingArtist,
    error: artistError,
  } = useArtistDetails(artistId!);

  // Top tracks
  const {
    data: topTracksData,
    isLoading: isLoadingTopTracks,
    error: topTracksError,
  } = useArtistTopTracks(artistId!);

  // Always call hooks in the same order - before any conditional returns
  const allDiscography = useMemo(() => {
    return discographyData?.pages.flatMap(page =>
      page.items.filter((album: any) => album.album_type !== 'compilation'),
    ) || [];
  }, [discographyData]);

  const allCollaborations = useMemo(() => {
    return collaborationsData?.pages.flatMap(page =>
      page.items.filter((album: any) => album.album_type !== 'compilation'),
    ) || [];
  }, [collaborationsData]);

  const topTracks = useMemo(() => {
    return topTracksData?.tracks?.slice(0, 5) || [];
  }, [topTracksData]);

  // Filtered discography based on selected filter
  const filteredDiscography = useMemo(() => {
    switch (discographyFilter) {
      case 'populares':
        // Sort by popularity (using release date as proxy for now)
        return [...allDiscography].sort((a: any, b: any) =>
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
        ).slice(0, 20);
      case 'albuns':
        return allDiscography.filter((item: any) => item.album_type === 'album');
      case 'singles':
        return allDiscography.filter((item: any) =>
          item.album_type === 'single' && item.total_tracks === 1,
        );
      case 'eps':
        return allDiscography.filter((item: any) =>
          item.album_type === 'single' && item.total_tracks > 1,
        );
      default:
        return allDiscography;
    }
  }, [allDiscography, discographyFilter]);

  const artistName = artistDetails?.name || allDiscography[0]?.artists?.[0]?.name || 'Artista';

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album/${albumId}`);
  };

  const handleAlbumPlay = (albumId: string, albumType: string) => {
    const contextUri = `spotify:album:${albumId}`;


    if (!isReady) {
      console.warn('⚠️ Player não está pronto ainda');
      return;
    }

    if (!deviceId) {
      console.warn('⚠️ Device ID não disponível');
      return;
    }

    // For all album types (album, single, compilation), play the album context
    // Pass empty string for uri to play from the beginning of the context
    playTrack('', contextUri);
  };

  // Loading and error states
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

  if (isAnyLoading || hasAnyError) {
    return (
      <DefaultPage
        title={isAnyLoading ? 'Carregando artista...' : 'Erro ao carregar artista'}
        subtitle="Aguarde enquanto carregamos as informações do artista"
        isLoading={isAnyLoading}
        error={hasAnyError}
        loadingMessage="Carregando detalhes do artista..."
        errorMessage="Tente novamente mais tarde."
        hasBackButton
      >
        <div></div>
      </DefaultPage>
    );
  }

  const renderAlbumItem = (album: any) => (
    <ArtistAlbum
      name={album.name}
      imageUrl={album.images?.[0]?.url || ''}
      releaseDate={album.release_date}
      albumType={album.album_type}
      albumId={album.id}
      onClick={() => handleAlbumClick(album.id)}
      onPlay={() => handleAlbumPlay(album.id, album.album_type)}
    />
  );

  return (
    <DefaultPage
      hasBackButton
    >
      <div className="space-y-8">
        {/* Artist Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
          <img
            src={artistDetails?.images?.[0]?.url || allDiscography[0]?.images?.[0]?.url || ''}
            alt={artistName}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white-text mb-2">{artistName}</h2>
            <div className="flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-3">
              {artistDetails?.followers?.total && (
                <p className="text-gray-400 text-sm">
                  {artistDetails.followers.total.toLocaleString()} seguidores
                </p>
              )}
              <p className="text-gray-400 text-sm">{allDiscography.length} lançamentos</p>
            </div>

            {/* Genres as tags */}
            {artistDetails?.genres && artistDetails.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {artistDetails.genres.slice(0, 4).map((genre: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Tracks */}
        {topTracks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-semibold text-white-text mb-4 md:mb-6">Musicas Populares</h3>
            <TrackList
              data={{ pages: [{ items: topTracks }] }}
              isPlaylist={false}
              contextUri={`spotify:artist:${artistId}`}
            />
          </div>
        )}

        {/* Discography with Filters */}
        {allDiscography.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h3 className="text-xl md:text-2xl font-semibold text-white-text mb-4 md:mb-6">Discografia</h3>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 mb-4 md:mb-6 bg-gray-800 p-1 rounded-lg w-fit mx-auto md:mx-0">
              {[
                { key: 'populares', label: 'Populares' },
                { key: 'albuns', label: 'Álbuns' },
                { key: 'singles', label: 'Singles' },
                { key: 'eps', label: 'EPs' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setDiscographyFilter(filter.key as DiscographyFilter)}
                  className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                    discographyFilter === filter.key
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <InfiniteScrollList
              items={filteredDiscography}
              renderItem={renderAlbumItem}
              hasNextPage={hasNextDiscographyPage}
              isFetchingNextPage={isFetchingNextDiscographyPage}
              fetchNextPage={fetchNextDiscographyPage}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
              emptyComponent={
                <div className="text-center py-12 text-gray-400 col-span-full">
                  Nenhum lançamento encontrado.
                </div>
              }
            />
          </div>
        )}

        {/* Collaborations/Features */}
        {allCollaborations.length > 0 && (
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-white-text mb-4 md:mb-6">Com o artista</h3>
            <InfiniteScrollList
              items={allCollaborations}
              renderItem={renderAlbumItem}
              hasNextPage={hasNextCollaborationsPage}
              isFetchingNextPage={isFetchingNextCollaborationsPage}
              fetchNextPage={fetchNextCollaborationsPage}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
              emptyComponent={
                <div className="text-center py-12 text-gray-400 col-span-full">
                  Nenhuma colaboração encontrada.
                </div>
              }
            />
          </div>
        )}
      </div>
    </DefaultPage>
  );
};

export default ArtistaDetalhes;

