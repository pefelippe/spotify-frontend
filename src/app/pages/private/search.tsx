import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DefaultPage } from '../../layout/DefaultPage';
import { QueryState } from '../../components/QueryState';
import { CustomHomeSection } from '../../components/home';
import { useAuth } from '../../../core/auth';
import { fetchSearch } from '../../../core/api/queries/search';
import { TrackList } from '../../../features/tracks/TrackList';

function useQueryParam(name: string) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(name) || '', [search, name]);
}

const SearchPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [q, setQ] = useState('');
  const qp = useQueryParam('q');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    setQ(qp);
  }, [qp]);

  useEffect(() => {
    const run = async () => {
      if (!accessToken || !q) {
        setTracks([]);
        setAlbums([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSearch(q, accessToken, ['track', 'album'], 20, 0);
        setTracks(data.tracks?.items || []);
        setAlbums(data.albums?.items || []);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [q, accessToken]);

  return (
    <DefaultPage hasBackButton title="Buscar" subtitle={q ? `Resultados para "${q}"` : 'Pesquise músicas e álbuns'}>
      <div className="space-y-10">
        {isLoading || error ? (
          <QueryState isLoading={isLoading} error={error} loadingMessage="Buscando..." centered={false} />
        ) : null}

        {!isLoading && !error && q && (
          <>
            {tracks.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-white-text mb-4 md:mb-6">Músicas</h3>
                <TrackList data={{ pages: [{ items: tracks }] }} isPlaylist={false} contextUri={undefined} showAddedDate={false} />
              </div>
            )}

            {albums.length > 0 && (
              <CustomHomeSection
                title="Álbuns"
                data={albums.map((a: any) => ({
                  id: a.id,
                  title: a.name,
                  subtitle: a.artists?.map((ar: any) => ar.name).join(', '),
                  imageSrc: a.images?.[0]?.url || 'https://via.placeholder.com/200x200/333/fff?text=♪',
                  playback: { contextUri: a.uri },
                }))}
                onClickData={(albumId) => navigate(`/album/${albumId}`)}
                hasShowMore={false}
              />
            )}
          </>
        )}
      </div>
    </DefaultPage>
  );
};

export default SearchPage;

