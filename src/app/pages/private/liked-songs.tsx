import { useNavigate } from 'react-router-dom';

import { DefaultPage } from '../../../app/layout/DefaultPage';
import { QueryState } from '../../../app/components/QueryState';
import { TrackList } from '../../../features/tracks/TrackList';
import { UserAvatar } from '../../../app/components/UserAvatar';
import { useLikedSongs } from '../../../features/liked-songs/useLikedSongs';
import { useUserProfile } from '../../../features/user/useUserProfile';
import { usePlayer } from '../../../features/player';
import { HeartIcon, PlayIcon } from '../../../app/components/SpotifyIcons';

const LikedSongs = () => {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const { data: userProfile } = useUserProfile();
  const {
    data: likedSongsData,
    isLoading: isLoadingLikedSongs,
    error: likedSongsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLikedSongs();

  const likedSongsCount = likedSongsData?.pages[0]?.total || 0;

  const handlePlayLikedSongs = () => {
    const contextUri = 'spotify:user:collection:tracks';
    playTrack('', contextUri);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const formatTotalDuration = (tracks: any) => {
    if (!tracks?.pages) {
      return '';
    }

    const totalMs = tracks.pages.reduce((total: number, page: any) => {
      return total + page.items.reduce((pageTotal: number, item: any) => {
        return pageTotal + (item.track?.duration_ms || 0);
      }, 0);
    }, 0);

    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  if (isLoadingLikedSongs || likedSongsError) {
    return (
      <DefaultPage
        title={isLoadingLikedSongs ? 'Carregando músicas curtidas...' : 'Erro ao carregar músicas curtidas'}
        subtitle="Aguarde enquanto carregamos suas músicas curtidas"
        isLoading={isLoadingLikedSongs}
        error={likedSongsError}
        loadingMessage="Carregando músicas curtidas..."
        errorMessage="Erro ao carregar músicas curtidas. Tente novamente."
        hasBackButton
      >
        <div></div>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage
      hasBackButton
    >
      <div className="space-y-8">
        {/* Liked Songs Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg shadow-2xl flex items-center justify-center">
            <HeartIcon size={64} className="text-white" filled />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">
              Playlist
            </p>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white-text mb-4">
              Músicas Curtidas
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-400 text-sm space-x-1">
              <div className="flex items-center space-x-2">
                <UserAvatar
                  userId={userProfile?.id || ''}
                  displayName={userProfile?.display_name || ''}
                  size="md"
                />
                <span
                  className="font-medium text-white-text hover:underline cursor-pointer hover:text-green-500"
                  onClick={() => handleUserClick(userProfile?.id || '')}
                >
                  {userProfile?.display_name || 'Você'}
                </span>
              </div>
              <span>•</span>
              <span>{likedSongsCount} músicas</span>
              {likedSongsData && (
                <>
                  <span>•</span>
                  <span>{formatTotalDuration(likedSongsData)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Play Button */}
        {likedSongsCount > 0 && (
          <div className="mb-6">
            <button
              onClick={handlePlayLikedSongs}
              className="bg-green-500 text-black px-6 py-3 rounded-full hover:scale-105 transition-transform cursor-pointer flex items-center justify-center"
            >
              <PlayIcon size={24} className="ml-0.5" />
              <span className="ml-2">Reproduzir</span>
            </button>
          </div>
        )}

        {/* Tracks */}
        <div>
          {isLoadingLikedSongs ? (
            <QueryState
              isLoading={true}
              loadingMessage="Carregando músicas..."
              centered={false}
            />
          ) : likedSongsError ? (
            <QueryState
              error={likedSongsError}
              errorMessage="Erro ao carregar músicas."
              centered={false}
            />
          ) : (
            <TrackList
              data={likedSongsData}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isPlaylist={true}
              contextUri="spotify:user:collection:tracks"
            />
          )}
        </div>
      </div>
    </DefaultPage>
  );
};

export default LikedSongs;
