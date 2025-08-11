import { useNavigate } from 'react-router-dom';

import { DefaultPage } from '../../layout/DefaultPage';
import { QueryState } from '../../components/QueryState';
import { TrackList } from '../../components/TrackList';
import { useLikedSongs } from '../../../core/api/hooks/useLikedSongs';
import { useUserProfile } from '../../../core/api/hooks/useUserProfile';
import { usePlayer } from '../../../features/player';
import { PlayIcon } from '../../components/SpotifyIcons';
import { formatTotalDurationFromPages } from '../../../utils/formatTotalDuration';
import { LikedSongsHeader } from '../../../features/liked-songs/LikedSongsHeader';

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

  return (
    <DefaultPage
      isLoading={isLoadingLikedSongs}
      error={likedSongsError}
      loadingMessage="Carregando músicas curtidas..."
      errorMessage="Erro ao carregar músicas curtidas. Tente novamente."
      hasBackButton
    >
      <div className="space-y-8">
        <LikedSongsHeader
          user={userProfile}
          likedSongsCount={likedSongsCount}
          totalDurationText={likedSongsData ? formatTotalDurationFromPages(likedSongsData, (item: any) => item.track?.duration_ms) : undefined}
          onClickUser={handleUserClick}
        />

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
