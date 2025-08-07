import { useNavigate } from 'react-router-dom';
import { useUserPlaylists } from '../../hooks/useUserPlaylists';
import { useLikedSongs } from '../../hooks/useLikedSongs';
import { usePlayer } from '../../providers/player-provider';
import { PlayIcon, HeartIcon } from '../../components/SpotifyIcons';

const Home = () => {
  const navigate = useNavigate();
  const { data: playlistsData, isLoading: isLoadingPlaylists, error: playlistsError } = useUserPlaylists();
  const { data: likedSongsData, isLoading: isLoadingLikedSongs, error: likedSongsError } = useLikedSongs();
  const { playTrack, isReady, deviceId } = usePlayer();

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

  return (
    <div className="w-full p-6 space-y-8">
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
    </div>
  );
};

export default Home;
