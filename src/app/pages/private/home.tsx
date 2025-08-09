import { useNavigate } from 'react-router-dom';
import { useUserPlaylists } from '@/features/user/useUserPlaylists';
import { useLikedSongs } from '@/features/liked-songs/useLikedSongs';
import { usePlayer } from '@/features/player';
import { HeartIcon, ChevronRightIcon, PlayIcon, ClockIcon } from '@/app/components/SpotifyIcons';
import { useTopArtists } from '@/features/user/useTopArtists';
import { useRecentlyPlayed } from '@/features/user/useRecentlyPlayed';
import { useUserProfile } from '@/features/user/useUserProfile';
import { DefaultPage } from '@/app/layout/DefaultPage';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { data: playlistsData } = useUserPlaylists();
  const { data: likedSongsData, isLoading: isLoadingLikedSongs, error: likedSongsError } = useLikedSongs();
  const { playTrack, isReady, deviceId } = usePlayer();
  const { data: recentlyPlayedData, isLoading: isLoadingRecentlyPlayed } = useRecentlyPlayed();
  const { data: userProfile } = useUserProfile();

  const { data: topArtistsData } = useTopArtists();
  const topArtists = (topArtistsData?.pages?.[0]?.items || []).slice(0, 6);

  const userPlaylists = playlistsData?.pages[0]?.items || [];
  const likedSongsCount = likedSongsData?.pages[0]?.total || 0;
  const recentlyPlayedTracks = recentlyPlayedData?.items || [];

  // Log when recently played data changes
  useEffect(() => {
    if (recentlyPlayedData) {
      console.log('Recently played data updated:', {
        count: recentlyPlayedTracks.length,
        items: recentlyPlayedTracks.slice(0, 3).map((item: any) => ({
          track: item.track?.name,
          playedAt: item.played_at
        }))
      });
    }
  }, [recentlyPlayedData, recentlyPlayedTracks.length]);

  const renderSectionHeader = (title: string, moreAction?: () => void, moreText = 'Ver tudo') => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-white text-2xl font-bold tracking-tight">{title}</h2>
      {moreAction && (
        <button
          onClick={moreAction}
          className="text-gray-400 hover:text-white text-sm font-medium flex items-center transition-colors duration-200 group cursor-pointer"
        >
          {moreText}
          <ChevronRightIcon
            size={16}
            className="ml-1 transform group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      )}
    </div>
  );

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

  return (
    <DefaultPage
      title={`Boa ${getGreeting()}, ${userProfile?.display_name || 'Músico'}!`}
      subtitle="Explore sua música, descubra novos sons e mergulhe em uma experiência musical personalizada."
      className="pb-48"
    >
      <div className="space-y-8">
        {!hasContent && (
          <p>Carregando...</p>
        )}

        {/* Recently Played Tracks Section */}
        {recentlyPlayedTracks.length > 0 && (
          <section className="mb-8 mt-10">
            {renderSectionHeader('Tocadas Recentemente')}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recentlyPlayedTracks.slice(0, 8).map((item: any, index: number) => {
                const track = item.track;
                if (!track) return null;

                return (
                  <div
                    key={`${track.id}-${index}`}
                    className="group bg-gray-800/30 hover:bg-gray-700/50 rounded-lg p-4 cursor-pointer transition-all duration-200"
                    onClick={() => handlePlayTrack(track)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={track.album?.images?.[0]?.url || 'https://via.placeholder.com/56x56/333/fff?text=♪'}
                          alt={track.name}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div className="absolute inset-0  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-green-500 text-black p-2 rounded-full hover:scale-110 transition-transform">
                            <PlayIcon size={16} className="ml-0.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate" title={track.name}>
                          {track.name}
                        </h4>
                        <p className="text-gray-400 text-xs truncate">
                          {track.artists?.map((a: any) => a.name).join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Quick Access Section */}
        {likedSongsCount > 0 && (
          <section className="mb-8">
            {renderSectionHeader(
              'Feito por Você',
              () => navigate('/playlists/liked-songs'),
              ''
            )}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 cursor-pointer hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-200"
                 onClick={() => navigate('/playlists/liked-songs')}>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <HeartIcon size={32} className="text-white" filled />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">Músicas Curtidas</h3>
                  <p className="text-gray-300 text-sm">{likedSongsCount} músicas</p>
                </div>
                <ChevronRightIcon size={20} className="text-gray-400" />
              </div>
            </div>
          </section>
        )}

        {/* Top Artists Section */}
        {topArtists.length > 0 && (
          <section className="mb-8">
            {renderSectionHeader('Seus Artistas Favoritos')}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {topArtists.map((artist: any) => (
                <div
                  key={artist.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/artists/${artist.id}`)}
                >
                  <div className="relative mb-3">
                    <img
                      src={artist.images?.[0]?.url || 'https://via.placeholder.com/150x150/333/fff?text=♪'}
                      alt={artist.name}
                      className="w-full aspect-square rounded-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 rounded-full transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="bg-green-500 text-black p-3 rounded-full hover:scale-110">
                        <PlayIcon size={20} className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-white font-medium text-sm text-center truncate" title={artist.name}>
                    {artist.name}
                  </h4>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* User Playlists Section */}
        {userPlaylists.length > 0 && (
          <section className="mb-8">
            {renderSectionHeader(
              'Suas Playlists',
              () => navigate('/playlists'),
              'Ver todas'
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userPlaylists.slice(0, 8).map((playlist: any) => (
                <div
                  key={playlist.id}
                  className="group bg-gray-800/30 hover:bg-gray-700/50 rounded-lg p-4 cursor-pointer transition-all duration-200"
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                >
                  <div className="relative mb-3">
                    <img
                      src={playlist.images?.[0]?.url || 'https://via.placeholder.com/200x200/333/fff?text=♪'}
                      alt={playlist.name}
                      className="w-full aspect-square rounded object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 rounded transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="bg-green-500 text-black p-3 rounded-full hover:scale-110">
                        <PlayIcon size={20} className="ml-0.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-white font-medium text-sm truncate mb-1" title={playlist.name}>
                    {playlist.name}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    {playlist.tracks?.total || 0} músicas
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </DefaultPage>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'manhã';
  if (hour < 18) return 'tarde';
  return 'noite';
};

export default Home;