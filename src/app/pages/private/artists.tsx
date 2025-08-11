import { useTopArtists } from '../../../core/api/hooks/useTopArtists';
import { useNavigate } from 'react-router-dom';
import { InfiniteScrollList } from '../../layout/InfiniteScrollList';
import { ArtistItem } from '../../../features/artists/ArtistItem';
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
    <ArtistItem
      name={artist.name}
      imageUrl={artist.images?.[0]?.url || ''}
      onClick={() => handleArtistClick(artist.id)}
      size="md"
    />
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
