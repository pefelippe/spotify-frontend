import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DefaultPage } from '../../layout/DefaultPage';
import { QueryState } from '../../components/QueryState';
import { InfiniteScrollList } from '../../components/InfiniteScrollList';
import { UserHeader } from '../../components/UserHeader';
import { useUserDetails, useUserPublicPlaylists } from '../../../features/user/useUserDetails';
import PlaylistItem from '../../../features/playlist/PlaylistItem';
import { usePlayer } from '../../../features/player';

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  const { data: userProfile, isLoading: isLoadingProfile, error: profileError } = useUserDetails(userId!);
  const {
    data: playlistsData,
    isLoading: isLoadingPlaylists,
    error: playlistsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPublicPlaylists(userId!);

  const publicPlaylists = useMemo(() => {
    return playlistsData?.pages.flatMap(page => page.items) || [];
  }, [playlistsData]);

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handlePlaylistPlay = (playlistId: string) => {
    const contextUri = `spotify:playlist:${playlistId}`;
    playTrack('', contextUri);
  };

  const renderPlaylistItem = (playlist: any) => (
    <PlaylistItem
      name={playlist.name}
      imageUrl={playlist.images?.[0]?.url}
      ownerName={playlist.owner.display_name}
      playlistId={playlist.id}
      onClick={() => handlePlaylistClick(playlist.id)}
      onPlay={() => handlePlaylistPlay(playlist.id)}
    />
  );



  if (isLoadingProfile || profileError) {
    return (
      <DefaultPage
        title={isLoadingProfile ? 'Carregando perfil...' : 'Erro ao carregar perfil'}
        subtitle="Aguarde enquanto carregamos as informações do usuário"
        isLoading={isLoadingProfile}
        error={profileError}
        loadingMessage="Carregando perfil do usuário..."
        errorMessage="Erro ao carregar perfil. Tente novamente."
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
        {/* User Header */}
        <UserHeader
          userProfile={userProfile}
          showEmail={false}
          showExternalLink={true}
          stats={{
            followers: userProfile?.followers?.total,
            playlists: publicPlaylists.length,
          }}
        />

        {/* Public Playlists */}
        {publicPlaylists.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white-text mb-4 md:mb-6">
              Playlists Públicas
            </h2>

            {isLoadingPlaylists ? (
              <QueryState
                isLoading={true}
                loadingMessage="Carregando playlists..."
                centered={false}
              />
            ) : playlistsError ? (
              <QueryState
                error={playlistsError}
                errorMessage="Erro ao carregar playlists."
                centered={false}
              />
            ) : (
              <InfiniteScrollList
                items={publicPlaylists}
                renderItem={renderPlaylistItem}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                className="flex flex-col space-y-4"
                emptyComponent={
                  <div className="text-center py-12 text-gray-400">
                    Nenhuma playlist pública encontrada.
                  </div>
                }
              />
            )}
          </div>
        )}

        {/* Empty State */}
        {publicPlaylists.length === 0 && !isLoadingPlaylists && !playlistsError && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              Este usuário não tem playlists públicas
            </div>
            <p className="text-gray-500 text-sm">
              As playlists privadas não são exibidas aqui
            </p>
          </div>
        )}
      </div>
    </DefaultPage>
  );
};

export default UserDetails;
