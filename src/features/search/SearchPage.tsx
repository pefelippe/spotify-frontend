import { useEffect, useMemo, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DefaultPage } from '../../app/layout/DefaultPage';
import { QueryState } from '../../app/components/QueryState';
import { CustomHomeSection } from '../../features/home/CustomHomeSection';
import { useAuth } from '../../core/auth';
import { fetchSearch } from '../../core/api/queries/search';
import { TrackList } from '../../app/components/TrackList';
import { usePlayer } from '../../features/player';
import { fetchUserProfile } from '../../core/api/queries/user-details';

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
  const [users, setUsers] = useState<Array<{ id: string; display_name: string; image?: string }>>([]);
  const [localInput, setLocalInput] = useState('');
  const searchDebounceRef = useRef<number | null>(null);
  const { playTrack, isReady, deviceId } = usePlayer();

  const saveRecentSearch = (value: string) => {
    const v = (value || '').trim();
    if (!v) {
      return;
    }
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
        const owners: Record<string, { name: string; id: string }> = {} as any;
        const playlists = data.playlists?.items || [];
        for (const p of playlists) {
          const ownerId = p?.owner?.id;
          const ownerName = p?.owner?.display_name;
          if (ownerId && ownerName && !owners[ownerId]) {
            owners[ownerId] = { id: ownerId, name: ownerName };
          }
        }
        // Attempt to enrich users with images
        const ownerEntries = Object.values(owners);
        const enriched = await Promise.all(
          ownerEntries.slice(0, 12).map(async (o) => {
            try {
              const profile = await fetchUserProfile(o.id);
              const image = profile?.images?.[0]?.url;
              return { id: o.id, display_name: o.name, image };
            } catch {
              return { id: o.id, display_name: o.name };
            }
          }),
        );
        setUsers(enriched);
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
            {tracks.length > 0 && (
              <div className="grid gap-6">
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
                  imageSrc: u.image || 'https://via.placeholder.com/200x200/333/fff?text=👤',
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


