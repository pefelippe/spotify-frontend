
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

import Album from '../../../components/Album';
import { PageHeader } from '../../../components/layout/PageHeader';
import { PageWithQueryState } from '../../../components/PageWithQueryState';
import { InfiniteScrollList } from '../../../components/InfiniteScrollList';

import { useTopArtists } from '../../../hooks/useTopArtists';

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

  const pageHeader = (
    <PageHeader
      title="Top Artistas"
      subtitle="Aqui você encontra seus artistas preferidos"
    />
  );

  if (isLoading || error) {
    return (
      <PageWithQueryState
        isLoading={isLoading}
        error={error}
        loadingMessage="Carregando artistas..."
        errorMessage="Erro ao carregar artistas. Tente novamente."
        headerContent={pageHeader}
      />
    );
  }

  const renderArtistItem = (artist: any) => (
    <div
      onClick={() => handleArtistClick(artist.id)}
      className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
    >
      <Album
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
    <div className="w-full p-6">
      {pageHeader}

      <InfiniteScrollList
        items={allArtists}
        renderItem={renderArtistItem}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        className="flex flex-col "
        emptyComponent={<></>}
      />
    </div>
  );
};

export default Artistas;
