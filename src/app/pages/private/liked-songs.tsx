import { useNavigate } from 'react-router-dom';

import { DefaultPage } from '../../layout/DefaultPage';
import { QueryState } from '../../components/QueryState';
import { TrackList } from '../../components/TrackList';
import { useLikedSongs } from '../../../core/api/hooks/useLikedSongs';
import { useUserProfile } from '../../../core/api/hooks/useUserProfile';
import { usePlayer } from '../../../features/player';
import { formatTotalDurationFromPages } from '../../../utils/formatTotalDuration';
import TrackInfoDetailed from '../../components/TrackInfoDetailed';

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
        <TrackInfoDetailed
          imageUrl={''}
          title="Músicas Curtidas"
          typeLabel="Playlist"
          primaryLabel={userProfile?.display_name || 'Você'}
          primaryUserId={userProfile?.id}
          primaryDisplayName={userProfile?.display_name}
          onClickPrimaryLabel={() => handleUserClick(userProfile?.id || '')}
          metaItems={[
            `${likedSongsCount} músicas`,
            ...(likedSongsData ? [formatTotalDurationFromPages(likedSongsData, (item: any) => item.track?.duration_ms)] : []),
          ]}
          onClickPlay={likedSongsCount > 0 ? handlePlayLikedSongs : undefined}
        />

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
