import { useNavigate } from 'react-router-dom';
import { useUserPlaylists } from '@/features/user/useUserPlaylists';
import { useLikedSongs } from '@/features/liked-songs/useLikedSongs';
import { usePlayer } from '@/features/player';
import { PlayIcon, HeartIcon } from '@/app/components/SpotifyIcons';
import { useRecentlyPlayed } from '@/features/user/useRecentlyPlayed';
import { useTopArtists } from '@/features/user/useTopArtists';
import { useUserProfile } from '@/features/user/useUserProfile';

const Home = () => {
  const navigate = useNavigate();
  const { data: playlistsData } = useUserPlaylists();
  const { data: likedSongsData, isLoading: isLoadingLikedSongs, error: likedSongsError } = useLikedSongs();
  const { playTrack, isReady, deviceId } = usePlayer();
  const { data: recentlyPlayed } = useRecentlyPlayed();
  const { data: topArtistsData } = useTopArtists();
  const topArtists = (topArtistsData?.pages?.[0]?.items || []).slice(0, 6);

  const userPlaylists = playlistsData?.pages[0]?.items?.slice(0, 5) || [];
  const likedSongsCount = likedSongsData?.pages[0]?.total || 0;

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleLikedSongsClick = () => {
    navigate('/playlists/liked-songs');
  };

  const handlePlaylistPlay = (playlistId: string) => {
    if (!isReady || !deviceId) {
      return;
    }

    const contextUri = `spotify:playlist:${playlistId}`;
    playTrack('', contextUri);
  };

  const handleLikedSongsPlay = () => {
    if (!isReady || !deviceId) {
      return;
    }

    const contextUri = 'spotify:user:collection:tracks';
    playTrack('', contextUri);
  };

  const quickAccessPlaylists = userPlaylists.slice(0, 5);

  const { data: userProfile } = useUserProfile();

  return (
    <div className="w-full p-6 space-y-8">
      <header className="flex items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/40 rounded-xl px-5 py-4">
        <div>
          <h1 className="text-white text-2xl font-bold">{(() => { const h=new Date().getHours(); return h<12?'Bom dia':h<18?'Boa tarde':'Boa noite'; })()}, {userProfile?.display_name || 'você'}</h1>
          <p className="text-gray-300 text-sm mt-1">Curta suas músicas e descubra novos artistas</p>
        </div>
        {userProfile?.images?.[0]?.url ? (
          <img src={userProfile.images[0].url} alt={userProfile.display_name} className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700" />
        )}
      </header>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div
            className="group flex items-center bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 rounded-lg overflow-hidden cursor-pointer transition-all duration-200"
            onClick={handleLikedSongsClick}
          >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-white flex items-center justify-center">
                <HeartIcon size={32} className="text-white" filled />
              </div>
              <div className="flex-1 px-4">
                <h3 className="text-white font-medium">Músicas Curtidas</h3>
                <p className="text-gray-200 text-sm">
                {isLoadingLikedSongs ? 'Carregando...' :
                  likedSongsError?.response?.status === 403 ? 'Faça login novamente' :
                  likedSongsError ? 'Erro ao carregar' :
                  likedSongsCount > 0 ? `${likedSongsCount} músicas` : 'Nenhuma música curtida'}
                </p>
              </div>
              {!likedSongsError && likedSongsCount > 0 && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikedSongsPlay();
                    }}
                    className="w-12 h-12 bg-green-spotify rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <PlayIcon size={16} className="text-black ml-0.5" />
                  </button>
                </div>
              )}
            </div>

          {quickAccessPlaylists.map((playlist: any) => (
            <div
              key={playlist.id}
              className="group flex items-center bg-gray-800/30 hover:bg-gray-700/50 rounded-lg overflow-hidden cursor-pointer transition-all duration-200"
              onClick={() => handlePlaylistClick(playlist.id)}
            >
              <img
                src={playlist.images?.[0]?.url || 'https://via.placeholder.com/80x80/333/fff?text=♪'}
                alt={playlist.name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex-1 px-4">
                <h3 className="text-white font-medium truncate">{playlist.name}</h3>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaylistPlay(playlist.id);
                  }}
                  className="w-12 h-12 bg-green-spotify rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <PlayIcon size={16} className="text-black ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-white text-lg font-semibold mb-3">Suas Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {(playlistsData?.pages?.[0]?.items || []).slice(0, 8).map((pl: any) => (
            <div
              key={pl.id}
              className="group bg-gray-800/30 hover:bg-gray-700/50 rounded-lg overflow-hidden cursor-pointer transition-all duration-200"
              onClick={() => handlePlaylistClick(pl.id)}
            >
              <div className="aspect-square w-full overflow-hidden">
                <img src={pl.images?.[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=♪'} alt={pl.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-3">
                <h4 className="text-white text-sm font-medium truncate" title={pl.name}>{pl.name}</h4>
                <p className="text-gray-400 text-xs truncate">Playlist</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-white text-lg font-semibold mb-3">Tocados recentemente</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {(recentlyPlayed?.items || []).slice(0, 5).map((item: any, idx: number) => {
            const track = item?.track;
            if (!track) {
              return null;
            }
            const imageUrl = track.album?.images?.[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=♪';
            return (
              <div
                key={`${track.id}-${idx}`}
                className="group relative bg-gray-800/30 hover:bg-gray-700/40 rounded-lg overflow-hidden cursor-pointer transition-all duration-200"
                onClick={() => {
                  if (!isReady || !deviceId) {
                    return;
                  }
                  playTrack(track.uri || `spotify:track:${track.id}`);
                }}
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img src={imageUrl} alt={track.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <h4 className="text-white text-sm font-medium truncate" title={track.name}>{track.name}</h4>
                  <p className="text-gray-400 text-xs truncate">
                    {(track.artists || []).map((a: any) => a.name).join(', ')}
                  </p>
                </div>
                <button
                  className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-10 h-10 bg-green-spotify rounded-full flex items-center justify-center hover:scale-105 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isReady || !deviceId) return;
                    playTrack(track.uri || `spotify:track:${track.id}`);
                  }}
                >
                  <PlayIcon size={16} className="text-black ml-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-white text-lg font-semibold mb-3">Seus Top Artistas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {topArtists.map((artist: any) => (
            <div
              key={artist.id}
              className="group flex flex-col items-center text-center cursor-pointer"
              onClick={() => navigate(`/artists/${artist.id}`)}
            >
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mb-3 ring-1 ring-white/10 group-hover:ring-white/30 transition-all">
                <img
                  src={artist.images?.[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=👤'}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white text-sm font-medium truncate max-w-[10rem]">{artist.name}</div>
              <div className="text-gray-400 text-xs">Artista</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
