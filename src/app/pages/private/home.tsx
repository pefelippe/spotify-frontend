import { useNavigate } from 'react-router-dom';
import { useUserPlaylists } from '../../../core/api/hooks/useUserPlaylists';
import { useLikedSongs } from '../../../core/api/hooks/useLikedSongs';
import { usePlayer } from '../../../features/player';
import WelcomeBanner from '../../components/WelcomeBanner';
import { CustomSection } from '../../components/CustomSection';
import { ArtistsSection } from '../../components/ArtistsSection';
import { useTopArtists } from '../../../core/api/hooks/useTopArtists';
import { useRecentlyPlayed } from '../../../core/api/hooks/useRecentlyPlayed';
import { useUserProfile } from '../../../core/api/hooks/useUserProfile';
import { DefaultPage } from '../../layout/DefaultPage';

import {
  UserPlaylistsSection,
} from '../../components/UserPlaylistsSection';

import { useArtistDiscography } from '../../../core/api/hooks/useArtistAlbums';
import { useMemo, useState } from 'react';
import { usePickRandomTopArtist } from '../../hooks/useHomeEffects';
import SearchInput from '../../../features/search/SearchInput';

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
  const recentlyPlayedTracks = useMemo(() => recentlyPlayedData?.items || [], [recentlyPlayedData]);

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
      <div className="space-y-10">
        <SearchInput />
        {userProfile && (
          <WelcomeBanner
            userProfile={userProfile}
            likedSongsCount={likedSongsCount}
            userPlaylists={userPlaylists}
            onClickLikedSongs={() => navigate('/playlists/liked-songs')}
            onClickPlaylist={(id: string) => navigate(`/playlist/${id}`)}
          />
        )}
        {!isLoading && hasContent && (
          <>
            {userPlaylists.length > 0 && (
              <>
                <UserPlaylistsSection
                  playlists={userPlaylists}
                  onClickPlaylist={(id: string) => navigate(`/playlist/${id}`)}
                  onShowMore={() => navigate('/playlists')}
                  likedSongsCount={likedSongsCount}
                  onClickLikedSongs={() => navigate('/playlists/liked-songs')}
                  currentUserName={userProfile?.display_name}
                />
              </>
            )}
            {uniqueRecentlyPlayed.length > 0 && (
              <CustomSection
                title="Tocadas Recentemente"
                data={uniqueRecentlyPlayed.slice(0, 12).map((item: any, index: number) => {
                  const track = item?.track;
                  if (!track) {
                    return null as any;
                  }
                  return {
                    id: `${track.id}-${index}`,
                    title: track.name,
                    subtitle: (track.artists || []).map((a: any) => a.name).join(', '),
                    imageSrc: track.album?.images?.[0]?.url || 'https://via.placeholder.com/56x56/333/fff?text=♪',
                    playback: { uri: track.uri || `spotify:track:${track.id}` },
                  };
                }).filter(Boolean)}
                onClickData={(id: string) => {
                  const match = uniqueRecentlyPlayed
                    .map((rp: any, idx: number) => ({ rp, idx }))
                    .find(({ rp, idx }: { rp: any; idx: number }) => `${rp.track?.id}-${idx}` === id);
                  const track = match?.rp?.track;
                  if (!track) return;
                  handlePlayTrack(track);
                }}
                hasShowMore={false}
                itemWidthClassName="w-[160px] md:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px]"
                titleClassName="text-xs lg:text-sm"
              />
            )}
            {randomTopArtist && discographyItems.length > 0 && (
              <CustomSection
                title={`Para fãs de ${randomTopArtist.name}`}
                data={discographyItems}
                onClickData={(albumId: string) => navigate(`/album/${albumId}`)}
                hasShowMore={false}
                itemWidthClassName="w-[160px] md:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px]"
                titleClassName="text-xs lg:text-sm"
              />
            )}
            {topArtists.length > 0 && (
              <ArtistsSection
                artists={topArtists}
                onClickArtist={(id: string) => navigate(`/artist/${id}`)}
                onShowMore={() => navigate('/artists')}
              />
            )}
          </>
        )}
      </div>
    </DefaultPage>
  );
};

export default Home;
