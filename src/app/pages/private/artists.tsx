
import { useTopArtists } from '../../../features/user/useTopArtists';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth';
import { InfiniteScrollList } from '../../components/InfiniteScrollList';
import { ArtistAlbum } from '../../../features/artists/ArtistAlbum';
import { useMemo } from 'react';
import { DefaultPage } from '../../layout/DefaultPage';

const Artistas = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTopArtists();

  const allArtists = useMemo(() => {
    return data?.pages.flatMap(page => page.items) || [];
  }, [data]);

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
  };

  const renderArtistItem = (artist: any) => (
    <div
      onClick={() => handleArtistClick(artist.id)}
      className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
    >
      <ArtistAlbum
        name={artist.name}
        imageUrl={artist.images?.[0]?.url || ''}
        size="xs"
      />
      <div className="flex-1">
        <h3 className="text-white-text font-semibold text-lg">
          {artist.name}
        </h3>
      </div>
    </div>
  );

  return (
    <DefaultPage
      title="Top Artistas"
      subtitle="Aqui você encontra seus artistas preferidos"
      isLoading={isLoading} error={error} loadingMessage="Carregando artistas..."
      errorMessage="Erro ao carregar artistas. Tente novamente." >
      <InfiniteScrollList
        items={allArtists}
        renderItem={renderArtistItem}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        className="flex flex-col pt-6"
        emptyComponent={<></>}
      />
    </DefaultPage>
  );
};

export default Artistas;
