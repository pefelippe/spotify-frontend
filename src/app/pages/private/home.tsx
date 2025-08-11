import { useNavigate } from 'react-router-dom';
import { useUserPlaylists } from '../../../features/user/useUserPlaylists';
import { useLikedSongs } from '../../../features/liked-songs/useLikedSongs';
import { usePlayer } from '../../../features/player';

import { useTopArtists } from '../../../features/user/useTopArtists';
import { useRecentlyPlayed } from '../../../features/user/useRecentlyPlayed';
import { useUserProfile } from '../../../features/user/useUserProfile';
import { DefaultPage } from '../../layout/DefaultPage';
import { CustomHomeSection, QuickPlaylists } from '../../components/home';
import { useArtistDiscography } from '../../../features/artists/useArtistAlbums';
import { useEffect, useMemo, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { data: playlistsData } = useUserPlaylists();
  const { data: likedSongsData, isLoading: isLoadingLikedSongs } = useLikedSongs();
  const { playTrack, isReady, deviceId } = usePlayer();
  const { data: recentlyPlayedData, isLoading: isLoadingRecentlyPlayed } = useRecentlyPlayed();
  const { data: userProfile } = useUserProfile();

  const { data: topArtistsData } = useTopArtists();
  const topArtists = (topArtistsData?.pages?.[0]?.items || []).slice(0, 6);
  const [randomTopArtist, setRandomTopArtist] = useState<any | null>(null);

  useEffect(() => {
    if (!topArtists || topArtists.length === 0) {
      return;
    }
    const userId = userProfile?.id || 'anon';
    const key = `forFans:selectedArtist:${userId}`;
    const savedId = typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;
    let picked = savedId ? topArtists.find((a: any) => a.id === savedId) : null;
    if (!picked) {
      const idx = Math.floor(Math.random() * topArtists.length);
      picked = topArtists[idx];
      try {
        sessionStorage.setItem(key, picked.id);
      } catch {}
    }
    setRandomTopArtist(picked);
  }, [topArtists, userProfile?.id]);
  
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

  return (
    <DefaultPage
      className="mb-24"
    >
      <div className="space-y-10 ">
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
                    image: pl.images?.[0]?.url || 'https://via.placeholder.com/96x96/333/fff?text=♪',
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
                    imageSrc: playlist.images?.[0]?.url || 'https://via.placeholder.com/200x200/333/fff?text=♪',
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
