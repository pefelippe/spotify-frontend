import { useNavigate } from 'react-router-dom';
import { useUserPlaylists } from '../../../features/user/useUserPlaylists';
import { useLikedSongs } from '../../../features/liked-songs/useLikedSongs';
import { usePlayer } from '../../../features/player';

import { useTopArtists } from '../../../features/user/useTopArtists';
import { useRecentlyPlayed } from '../../../features/user/useRecentlyPlayed';
import { useUserProfile } from '../../../features/user/useUserProfile';
import { DefaultPage } from '../../layout/DefaultPage';
import { UserAvatar } from '../../components/UserAvatar';
import { CustomHomeSection, QuickPlaylists } from '../../components/home';
import { useArtistDiscography } from '../../../features/artists/useArtistAlbums';
import { useMemo, useState, useEffect, useRef } from 'react';
import { usePickRandomTopArtist } from './useHomeEffects';
import { useAuth } from '../../../core/auth';
import { fetchSearch } from '../../../core/api/queries/search';

const Home = () => {
  const navigate = useNavigate();
  const { data: playlistsData } = useUserPlaylists();
  const { data: likedSongsData, isLoading: isLoadingLikedSongs } = useLikedSongs();
  const { playTrack, isReady, deviceId } = usePlayer();
  const { data: recentlyPlayedData, isLoading: isLoadingRecentlyPlayed } = useRecentlyPlayed();
  const { data: userProfile } = useUserProfile();
  const { accessToken } = useAuth();

  const { data: topArtistsData } = useTopArtists();
  const topArtists = (topArtistsData?.pages?.[0]?.items || []).slice(0, 6);
  const [randomTopArtist, setRandomTopArtist] = useState<any | null>(null);

  usePickRandomTopArtist(topArtists, userProfile?.id, setRandomTopArtist);
  
  const { data: discogData } = useArtistDiscography(randomTopArtist?.id || '');
  const discographyItems = useMemo(() => {
    const items = discogData?.pages?.flatMap((p: any) => p.items) || [];
    return items.slice(0, 12).map((a: any) => ({
      id: a.id,
      title: a.name,
      subtitle: a.album_type === 'single' ? 'Single' : (a.album_type || a.type),
      imageSrc: a.images?.[0]?.url || 'https://via.placeholder.com/200x200/333/fff?text=♪',
      playback: { contextUri: a.uri },
    }));
  }, [discogData]);

  const userPlaylists = playlistsData?.pages[0]?.items || [];
  const likedSongsCount = likedSongsData?.pages[0]?.total || 0;
  const recentlyPlayedTracks = recentlyPlayedData?.items || [];

  const uniqueRecentlyPlayed = useMemo(() => {
    const seen = new Set<string>();
    const uniques: any[] = [];
    for (const item of recentlyPlayedTracks) {
      const id = item?.track?.id as string | undefined;
      if (!id) {
        continue;
      }
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);
      uniques.push(item);
    }
    return uniques;
  }, [recentlyPlayedTracks]);


  const handlePlayItem = (uri: string, contextUri?: string) => {
    if (!isReady || !deviceId) {
      return;
    }
    playTrack(uri, contextUri);
  };

  const handlePlayTrack = (track: any) => {
    const trackUri = track.uri || `spotify:track:${track.id}`;
    handlePlayItem(trackUri);
  };

  const hasContent = recentlyPlayedTracks.length > 0 || userPlaylists.length > 0 || topArtists.length > 0 || likedSongsCount > 0;
  const isLoading = isLoadingLikedSongs || isLoadingRecentlyPlayed;

  // Inline search preview state
  const [searchText, setSearchText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewTracks, setPreviewTracks] = useState<any[]>([]);
  const [previewAlbums, setPreviewAlbums] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    const q = searchText.trim();
    if (!q) {
      setPreviewTracks([]);
      setPreviewAlbums([]);
      return;
    }
    searchTimeoutRef.current = window.setTimeout(async () => {
      if (!accessToken) return;
      setIsSearching(true);
      try {
        const res = await fetchSearch(q, accessToken, ['track', 'album'], 5, 0);
        setPreviewTracks(res.tracks?.items || []);
        setPreviewAlbums(res.albums?.items || []);
      } catch {
        // ignore
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [searchText, accessToken]);

  return (
    <DefaultPage
      className="mb-24"
    >
      <div className="space-y-10">
        {/* Search on Home with inline preview */}
        <div className="w-full">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar músicas e álbuns"
              className="w-full bg-transparent border-2 border-gray-700 focus:border-white transition-colors rounded-xl px-4 py-2 text-white placeholder-gray-500 outline-none"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.currentTarget.value);
                setShowPreview(true);
              }}
              onFocus={() => setShowPreview(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = searchText.trim();
                  if (value) {
                    navigate(`/search?q=${encodeURIComponent(value)}`);
                    setShowPreview(false);
                  }
                }
                if (e.key === 'Escape') {
                  setShowPreview(false);
                }
              }}
              onBlur={() => {
                // Let clicks inside the preview register before closing
                setTimeout(() => setShowPreview(false), 120);
              }}
            />

            {showPreview && (previewTracks.length > 0 || previewAlbums.length > 0 || isSearching) && (
              <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-800 bg-black/90 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="max-h-96 overflow-y-auto divide-y divide-gray-800">
                  {/* Tracks */}
                  <div className="py-2">
                    <div className="px-3 text-xs uppercase tracking-wide text-gray-400 mb-2">Músicas</div>
                    {isSearching && previewTracks.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">Buscando...</div>
                    ) : previewTracks.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">Sem resultados</div>
                    ) : (
                      previewTracks.map((t: any) => (
                        <button
                          key={t.id}
                          className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 text-left cursor-pointer"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            const trackUri = t.uri || `spotify:track:${t.id}`;
                            handlePlayItem(trackUri);
                            setShowPreview(false);
                          }}
                        >
                          <img src={t.album?.images?.[0]?.url || 'https://via.placeholder.com/40x40/333/fff?text=♪'} alt={t.name} className="w-10 h-10 rounded object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="text-white text-sm truncate">{t.name}</div>
                            <div className="text-gray-400 text-xs truncate">{(t.artists || []).map((a: any) => a.name).join(', ')}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Albums */}
                  <div className="py-2">
                    <div className="px-3 text-xs uppercase tracking-wide text-gray-400 mb-2">Álbuns</div>
                    {isSearching && previewAlbums.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">Buscando...</div>
                    ) : previewAlbums.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">Sem resultados</div>
                    ) : (
                      previewAlbums.map((a: any) => (
                        <button
                          key={a.id}
                          className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 text-left cursor-pointer"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            navigate(`/album/${a.id}`);
                            setShowPreview(false);
                          }}
                        >
                          <img src={a.images?.[0]?.url || 'https://via.placeholder.com/40x40/333/fff?text=♪'} alt={a.name} className="w-10 h-10 rounded object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="text-white text-sm truncate">{a.name}</div>
                            <div className="text-gray-400 text-xs truncate">{(a.artists || []).map((ar: any) => ar.name).join(', ')}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* See all */}
                  {searchText.trim() && (
                    <button
                      className="w-full px-3 py-3 text-sm text-white hover:bg-white/5 cursor-pointer"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
                        setShowPreview(false);
                      }}
                    >
                      Ver todos os resultados para "{searchText.trim()}"
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Welcome Banner */}
        {userProfile && (
          <div className="w-full rounded-2xl bg-[rgb(30,30,30)] p-4 md:p-6 flex items-center gap-4 md:gap-6">
            <div className="hidden sm:block">
              <UserAvatar
                userId={userProfile.id}
                displayName={userProfile.display_name || 'Você'}
                size="lg"
                className="w-12 h-12 md:w-16 md:h-16"
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-gray-300 text-xs md:text-sm">Bem-vindo de volta</div>
              <div className="text-white text-lg md:text-2xl font-extrabold truncate">{userProfile.display_name || 'Você'}</div>
              <div className="text-gray-400 text-xs md:text-sm mt-1 truncate">Pronto para continuar ouvindo?</div>
            </div>
          </div>
        )}
        {!isLoading && hasContent && (
          <>
            {(likedSongsCount > 0 || userPlaylists.length > 0) && (
              <QuickPlaylists
                items={[
                  ...(likedSongsCount > 0
                    ? [{
                        id: 'liked',
                        name: `Músicas Curtidas (${likedSongsCount})`,
                        image: '',
                        isLiked: true,
                        onClick: () => navigate('/playlists/liked-songs'),
                      }] as const
                    : []),
                  ...userPlaylists.slice(0, 7).map((pl: any) => ({
                    id: pl.id,
                    name: pl.name,
                    image: pl.images?.[0]?.url || '',
                    onClick: () => navigate(`/playlist/${pl.id}`),
                  })),
                ]}
              />
            )}

            {uniqueRecentlyPlayed.length > 0 && (
              <CustomHomeSection
                title="Tocadas Recentemente"
                data={uniqueRecentlyPlayed.slice(0, 12).map((item: any, index: number) => {
                  const { track } = item;
                  if (!track) {
                    return null as any;
                  }
                  return {
                    id: `${track.id}-${index}`,
                    title: track.name,
                    subtitle: track.artists?.map((a: any) => a.name).join(', '),
                    imageSrc: track.album?.images?.[0]?.url || 'https://via.placeholder.com/56x56/333/fff?text=♪',
                    playback: { uri: track.uri || `spotify:track:${track.id}` },
                  };
                }).filter(Boolean)}
                onClickData={(id) => {
                  const match = uniqueRecentlyPlayed
                    .map((rp: any, idx: number) => ({ rp, idx }))
                    .find(({ rp, idx }: { rp: any; idx: number }) => `${rp.track?.id}-${idx}` === id);
                  const track = match?.rp?.track;
                  if (!track) {
                    return;
                  }
                  handlePlayTrack(track);
                }}
                hasShowMore={false}
              />
            )}

            {topArtists.length > 0 && (
              <CustomHomeSection
                title="Seus Artistas Favoritos"
                data={topArtists.map((artist: any) => ({
                  id: artist.id,
                  title: artist.name,
                  imageSrc: artist.images?.[0]?.url || 'https://via.placeholder.com/150x150/333/fff?text=♪',
                  playback: { contextUri: `spotify:artist:${artist.id}` },
                }))}
                onClickData={(artistId) => navigate(`/artist/${artistId}`)}
                hasShowMore={true}
                onShowMore={() => navigate('/artists')}
                actionText="Mostrar tudo"
              />
            )}

            {userPlaylists.length > 0 && (
              <>
                <CustomHomeSection
                  title="Suas Playlists"
                  data={userPlaylists.slice(0, 12).map((playlist: any) => ({
                    id: playlist.id,
                    title: playlist.name,
                    subtitle: playlist.owner?.display_name,
                    imageSrc: playlist.images?.[0]?.url || '',
                    playback: { contextUri: `spotify:playlist:${playlist.id}` },
                  }))}
                  onClickData={(playlistId) => navigate(`/playlist/${playlistId}`)}
                  hasShowMore
                  onShowMore={() => navigate('/playlists')}
                  actionText="Mostrar tudo"
                />

                {randomTopArtist && discographyItems.length > 0 && (
                  <CustomHomeSection
                    title={`Para fãs de ${randomTopArtist.name}`}
                    data={discographyItems}
                    onClickData={(albumId) => navigate(`/album/${albumId}`)}
                    hasShowMore={false}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </DefaultPage>
  );
};

export default Home;
