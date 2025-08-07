
import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

import ArtistAlbum from '@/features/artists/ArtistAlbum';
import { BackButton } from '@/app/layout/BackButton';
import { QueryState } from '@/app/components/QueryState';
import { InfiniteScrollList } from '@/app/components/InfiniteScrollList';
import { TrackList } from '@/app/components/TrackList';
import { useArtistDiscography, useArtistCollaborations } from '@/features/artists/useArtistAlbums';
import { useArtistDetails } from '@/features/artists/useArtistDetails';
import { useArtistTopTracks } from '@/features/artists/useArtistTopTracks';
import { usePlayer } from '@/features/player';

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
      <div className="w-full p-6">
        <div className="flex items-center space-x-4 mb-8">
          <BackButton artistName="Artista não encontrado" />
          <h1 className="text-2xl font-bold text-white-text">Artista não encontrado</h1>
        </div>
      </div>
    );
  }

  const backButtonHeader = (
    <div className="flex items-center space-x-4 mb-8">
      <BackButton artistName="Artista não encontrado" />
      <h1 className="text-2xl font-bold text-white-text">
        {isAnyLoading ? 'Carregando artista...' : 'Erro ao carregar artista'}
      </h1>
    </div>
  );

  if (isAnyLoading || hasAnyError) {
    return (
      <div className="w-full p-6">
        {backButtonHeader}
        <QueryState
          isLoading={isAnyLoading}
          error={hasAnyError}
          loadingMessage=""
          errorMessage="Tente novamente mais tarde."
          centered={false}
        />
      </div>
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
    <div className="w-full p-6">
      <div className="flex items-center space-x-4 mb-8">
        <BackButton artistName={artistName} />
      </div>

      <div className="flex items-start space-x-6 mb-8">
        <img
          src={artistDetails?.images?.[0]?.url || allDiscography[0]?.images?.[0]?.url || ''}
          alt={artistName}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white-text mb-2">{artistName}</h2>
          <div className="flex items-center space-x-4 mb-3">
            {artistDetails?.followers?.total && (
              <p className="text-gray-400">
                {artistDetails.followers.total.toLocaleString()} seguidores
              </p>
            )}
            <p className="text-gray-400">{allDiscography.length} lançamentos</p>
          </div>

          {/* Genres as tags */}
          {artistDetails?.genres && artistDetails.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
          <h3 className="text-2xl font-semibold text-white-text mb-6">Musicas Populares</h3>
          <TrackList
            data={{ pages: [{ items: topTracks }] }}
            isPlaylist={false}
            contextUri={`spotify:artist:${artistId}`}
          />
        </div>
      )}

      {/* Discography with Filters */}
      {allDiscography.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white-text mb-6">Discografia</h3>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg w-fit">
            {[
              { key: 'populares', label: 'Lançamentos populares' },
              { key: 'albuns', label: 'Álbuns' },
              { key: 'singles', label: 'Singles' },
              { key: 'eps', label: 'EPs' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setDiscographyFilter(filter.key as DiscographyFilter)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
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
          <h3 className="text-xl font-semibold text-white-text mb-6">Com o artista</h3>
          <InfiniteScrollList
            items={allCollaborations}
            renderItem={renderAlbumItem}
            hasNextPage={hasNextCollaborationsPage}
            isFetchingNextPage={isFetchingNextCollaborationsPage}
            fetchNextPage={fetchNextCollaborationsPage}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            emptyComponent={
              <div className="text-center py-12 text-gray-400 col-span-full">
                Nenhuma colaboração encontrada.
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ArtistaDetalhes;

