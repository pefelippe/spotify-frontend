import { useEffect, useMemo, useState, useRef } from 'react';
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
  const [artists, setArtists] = useState<any[]>([]);
  const [users, setUsers] = useState<Array<{ id: string; display_name: string }>>([]);
  const [localInput, setLocalInput] = useState('');
  const searchDebounceRef = useRef<number | null>(null);

  const saveRecentSearch = (value: string) => {
    const v = (value || '').trim();
    if (!v) return;
    try {
      const raw = localStorage.getItem('recent_searches');
      const arr = raw ? JSON.parse(raw) : [];
      const base: string[] = Array.isArray(arr) ? arr.filter((s) => typeof s === 'string') : [];
      const next = [v, ...base.filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 10);
      localStorage.setItem('recent_searches', JSON.stringify(next));
    } catch {}
  };

  useEffect(() => {
    setQ(qp);
    setLocalInput(qp);
    if (qp && qp.trim()) {
      saveRecentSearch(qp);
    }
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
        const data = await fetchSearch(q, accessToken, ['track', 'album', 'artist', 'playlist'], 20, 0);
        setTracks(data.tracks?.items || []);
        setAlbums(data.albums?.items || []);
        setArtists(data.artists?.items || []);
        const owners: Record<string, string> = {};
        const playlists = data.playlists?.items || [];
        for (const p of playlists) {
          const ownerId = p?.owner?.id;
          const ownerName = p?.owner?.display_name;
          if (ownerId && ownerName && !owners[ownerId]) {
            owners[ownerId] = ownerName;
          }
        }
        setUsers(Object.entries(owners).map(([id, display_name]) => ({ id, display_name })));
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [q, accessToken]);

  return (
    <DefaultPage title="Buscar" subtitle={q ? `Resultados para "${q}"` : 'Pesquise músicas e álbuns'}>
      <div className="space-y-8">
        {/* Search bar */}
        <div className="w-full">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar músicas e álbuns"
              className="w-full bg-transparent border-2 border-gray-700 focus:border-white transition-colors rounded-xl px-4 py-2 text-white placeholder-gray-500 outline-none"
              value={localInput}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setLocalInput(value);
                if (searchDebounceRef.current) {
                  window.clearTimeout(searchDebounceRef.current);
                }
                searchDebounceRef.current = window.setTimeout(() => {
                  const next = value.trim();
                  navigate(`/search?q=${encodeURIComponent(next)}`);
                }, 350);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const next = localInput.trim();
                  if (next) {
                    saveRecentSearch(next);
                  }
                  navigate(`/search?q=${encodeURIComponent(next)}`);
                  if (searchDebounceRef.current) {
                    window.clearTimeout(searchDebounceRef.current);
                  }
                }
              }}
            />
          </div>
        </div>

        {isLoading || error ? (
          <QueryState isLoading={isLoading} error={error} loadingMessage="Buscando..." centered={false} />
        ) : null}

        {!isLoading && !error && q && (
          <>
            {/* Top result + Tracks */}
            {tracks.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Result */}
                <div className="lg:col-span-1">
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Resultado principal</h3>
                  {(() => {
                    const t = tracks[0];
                    return (
                      <button
                        className="w-full text-left rounded-2xl bg-[rgb(25,25,25)] hover:bg-[rgb(35,35,35)] transition-colors p-4 cursor-pointer flex items-center gap-4"
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(q)}`);
                        }}
                      >
                        <img src={t.album?.images?.[0]?.url || 'https://via.placeholder.com/80x80/333/fff?text=♪'} alt={t.name} className="w-20 h-20 rounded object-cover" />
                        <div className="min-w-0">
                          <div className="text-white text-lg font-semibold truncate">{t.name}</div>
                          <div className="text-gray-400 text-sm truncate">{(t.artists || []).map((a: any) => a.name).join(', ')}</div>
                        </div>
                      </button>
                    );
                  })()}
                </div>
                {/* Tracks list */}
                <div className="lg:col-span-2">
                  <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Músicas</h3>
                  <TrackList data={{ pages: [{ items: tracks.slice(0, 10) }] }} isPlaylist={false} contextUri={undefined} showAddedDate={false} />
                </div>
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

            {artists.length > 0 && (
              <CustomHomeSection
                title="Artistas"
                data={artists.map((a: any) => ({
                  id: a.id,
                  title: a.name,
                  imageSrc: a.images?.[0]?.url || 'https://via.placeholder.com/200x200/333/fff?text=♪',
                  playback: { contextUri: a.uri },
                }))}
                onClickData={(artistId) => navigate(`/artist/${artistId}`)}
                hasShowMore={false}
              />
            )}

            {users.length > 0 && (
              <CustomHomeSection
                title="Usuários"
                data={users.map((u) => ({
                  id: u.id,
                  title: u.display_name,
                  imageSrc: 'https://via.placeholder.com/200x200/333/fff?text=👤',
                }))}
                onClickData={(userId) => navigate(`/user/${userId}`)}
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

