import { useNavigate } from 'react-router-dom';
import { useUserPlaylists } from '@/features/user/useUserPlaylists';
import { useLikedSongs } from '@/features/liked-songs/useLikedSongs';
import { usePlayer } from '@/features/player';
import { HeartIcon, ChevronRightIcon, PlayIcon } from '@/app/components/SpotifyIcons';
import { useTopArtists } from '@/features/user/useTopArtists';
import { PageHeader } from '@/app/layout/PageHeader';

const Home = () => {
  const navigate = useNavigate();
  const { data: playlistsData } = useUserPlaylists();
  const { data: likedSongsData, isLoading: isLoadingLikedSongs, error: likedSongsError } = useLikedSongs();
  const { playTrack, isReady, deviceId } = usePlayer();

  const { data: topArtistsData } = useTopArtists();
  const topArtists = (topArtistsData?.pages?.[0]?.items || []).slice(0, 6);

  const userPlaylists = playlistsData?.pages[0]?.items || [];
  const likedSongsCount = likedSongsData?.pages[0]?.total || 0;

  const renderSectionHeader = (title: string, moreAction: () => void, moreText = 'Ver tudo') => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-white text-3xl mb-5 font-semibold tracking-tight">{title}</h2>
      <button 
        onClick={moreAction} 
        className="text-gray-400 hover:text-white text-sm flex items-center transition-colors duration-200 group cursor-pointer"
      >
        {moreText}
        {moreText && (
          <ChevronRightIcon 
            size={16} 
            className="ml-1 transform group-hover:translate-x-0.5 transition-transform" 
          />
        )}
      </button>
    </div>
  );

  const handlePlayItem = (uri: string, contextUri?: string) => {
    if (!isReady || !deviceId) {
      return;
    }
    playTrack(uri, contextUri);
  };

  return (
    <div className="w-full min-h-screen bg-[#090707] text-white">
      <div className="p-6 pb-32 gap-16 flex flex-col">
        <PageHeader title="Home" subtitle="Explore sua música, descubra novos sons e mergulhe em uma experiência musical personalizada." />

        {/* Playlists Section */}
        <section className="">
          {renderSectionHeader('Suas Playlists', () => navigate('/playlists'))}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {/* Liked Songs as the first playlist */}
            {likedSongsCount > 0 && (
              <div
                key="liked-songs"
                className="group relative bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate('/playlists/liked-songs')}
              >
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center">
                  <HeartIcon size={64} className="text-white" filled />
                </div>
                <div className="p-3 bg-gray-800/50">
                  <h4 className="text-white font-semibold text-sm truncate">Músicas Curtidas</h4>
                  <p className="text-gray-300 text-xs">
                    {isLoadingLikedSongs ? 'Carregando...' :
                      likedSongsError?.response?.status === 403 ? 'Faça login novamente' :
                      likedSongsError ? 'Erro ao carregar' :
                      `${likedSongsCount} músicas`}
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayItem('', 'spotify:user:collection:tracks');
                    }}
                    className="bg-green-500 text-black p-3 rounded-full hover:scale-110 transition-transform cursor-pointer"
                  >
                    <PlayIcon size={20} className="ml-0.5" />
                  </button>
                </div>
              </div>
            )}

            {userPlaylists.slice(0, 5).map((pl: any) => (
              <div
                key={pl.id}
                className="group relative bg-gray-800/30 hover:bg-gray-700/50 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/playlist/${pl.id}`)}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={pl.images?.[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=♪'} 
                    alt={pl.name} 
                    className="w-full h-full object-cover group-hover:brightness-75 transition-all" 
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-white text-sm font-semibold truncate" title={pl.name}>{pl.name}</h4>
                  <p className="text-gray-400 text-xs truncate">Playlist</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayItem('', pl.uri);
                    }}
                    className="bg-green-500 text-black p-3 rounded-full hover:scale-110 transition-transform cursor-pointer"
                  >
                    <PlayIcon size={20} className="ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Artists Section */}
        <section className="mb-16">
          {renderSectionHeader('Seus Top Artistas', () => navigate('/artists'))}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {topArtists.map((artist: any) => {
              if (!artist) {
                return null;
              }
              
              return (
                <div
                  key={artist.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  <div className="aspect-square rounded-full overflow-hidden shadow-lg">
                    <img
                      src={artist.images?.[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=👤'}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <h4 className="text-sm font-semibold text-white truncate">{artist.name}</h4>
                    <p className="text-xs text-gray-400">Artista</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


      </div>
    </div>
  );
};

export default Home;
