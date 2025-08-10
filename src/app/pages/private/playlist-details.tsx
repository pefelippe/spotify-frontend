import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { QueryState } from '../../components/QueryState';
import { TrackList } from '../../../features/tracks/TrackList';
import { UserAvatar } from '../../components/UserAvatar';
import { usePlaylistDetails, usePlaylistTracks } from '../../../features/playlist/usePlaylistDetails';
import { useDeletePlaylist } from '../../../features/playlist/useDeletePlaylist';
import { useRemoveTrackFromPlaylist } from '../../../features/playlist/useRemoveTrackFromPlaylist';
import { useUserProfile } from '../../../features/user/useUserProfile';
import { DefaultPage } from '../../layout/DefaultPage';
import { Modal } from '../../components/CustomModal';
import { CustomButton } from '../../components/CustomButton';


const PlaylistDetalhes = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data: playlistDetails, isLoading: isLoadingDetails, error: detailsError } = usePlaylistDetails(playlistId!);
  const { data: userProfile } = useUserProfile();
  const deletePlaylistMutation = useDeletePlaylist();
  const removeTrackMutation = useRemoveTrackFromPlaylist();

  const {
    data: tracksData,
    isLoading: isLoadingTracks,
    error: tracksError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePlaylistTracks(playlistId!);

  const isOwner = userProfile?.id === playlistDetails?.owner?.id;

  const handleOwnerClick = (ownerId: string) => {
    navigate(`/user/${ownerId}`);
  };

  const handleDeletePlaylist = async () => {
    if (!playlistId) return;

    try {
      await deletePlaylistMutation.mutateAsync(playlistId);
      navigate('/playlists');
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  const handleRemoveTrack = async (trackUri: string) => {
    if (!playlistId) return;

    try {
      await removeTrackMutation.mutateAsync({
        playlistId,
        trackUri,
      });
    } catch (error) {
      console.error('Failed to remove track:', error);
    }
  };

  if (!playlistId) {
    return (
      <DefaultPage
        title="Playlist não encontrada"
        subtitle="A playlist que você está procurando não foi encontrada"
        hasBackButton
      >
        <div className="text-center py-12 text-gray-400">
          Playlist não encontrada
        </div>
      </DefaultPage>
    );
  }

  if (isLoadingDetails || detailsError) {
    return (
      <DefaultPage
        title={isLoadingDetails ? 'Carregando playlist...' : 'Erro ao carregar playlist'}
        subtitle="Aguarde enquanto carregamos as informações da playlist"
        isLoading={isLoadingDetails}
        error={detailsError}
        loadingMessage="Carregando detalhes da playlist..."
        errorMessage="Tente novamente mais tarde."
        hasBackButton
      >
        <div></div>
      </DefaultPage>
    );
  }

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

  return (
    <DefaultPage
      hasBackButton
    >
      <div className="space-y-8">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
          <img
            src={playlistDetails.images?.[0]?.url || 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'}
            alt={playlistDetails.name}
            className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-2xl"
          />
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">
              Playlist
            </p>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white-text mb-4">
              {playlistDetails.name}
            </h1>
            {playlistDetails.description && (
              <p className="text-gray-400 text-sm mb-3 md:mb-4 max-w-2xl">
                {playlistDetails.description}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-400 text-sm space-x-1">
              <div className="flex items-center space-x-2">
                <UserAvatar
                  userId={playlistDetails.owner?.id || ''}
                  displayName={playlistDetails.owner?.display_name || ''}
                  size="md"
                />
                <span
                  className="font-medium text-white-text hover:underline cursor-pointer hover:text-green-500"
                  onClick={() => handleOwnerClick(playlistDetails.owner?.id)}
                >
                  {playlistDetails.owner?.display_name}
                </span>
              </div>
              {playlistDetails.followers?.total && (
                <>
                  <span>•</span>
                  <span>{playlistDetails.followers.total.toLocaleString()} seguidores</span>
                </>
              )}
              <span>•</span>
              <span>{playlistDetails.tracks?.total} músicas</span>
              {tracksData && (
                <>
                  <span>•</span>
                  <span>{formatTotalDuration(tracksData)}</span>
                </>
              )}
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex justify-center md:justify-start mt-4 space-x-3">
                <CustomButton
                  label="Deletar Playlist"
                  onClick={() => setShowDeleteModal(true)}
                  variant="outline"
                  customClassName="bg-red-600 border-red-600 text-white hover:bg-red-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* Tracks */}
        <div>
          {isLoadingTracks ? (
            <QueryState
              isLoading={true}
              loadingMessage="Carregando músicas..."
              centered={false}
            />
          ) : tracksError ? (
            <QueryState
              error={tracksError}
              errorMessage="Erro ao carregar músicas."
              centered={false}
            />
          ) : (
            <TrackList
              data={tracksData}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isPlaylist={true}
              contextUri={`spotify:playlist:${playlistId}`}
              onRemoveTrack={isOwner ? handleRemoveTrack : undefined}
            />
          )}
        </div>
      </div>

      {/* Delete Playlist Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title=""
      >
        <div className="space-y-6">
          {/* Header with X button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="text-gray-400 hover:text-white transition-colors text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <div className="text-center">
            <span className="text-white text-xl font-semibold">
              Deletar playlist
            </span>
            <p className="text-gray-400 text-sm mt-2">
              Tem certeza que deseja deletar "{playlistDetails.name}"?
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Esta ação não pode ser desfeita.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <CustomButton
              label="Cancelar"
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
              customClassName="flex-1"
            />
            <CustomButton
              label={deletePlaylistMutation.isPending ? 'Deletando...' : 'Deletar'}
              onClick={handleDeletePlaylist}
              variant="primary"
              customClassName="flex-1 bg-red-600 hover:bg-red-700"
              disabled={deletePlaylistMutation.isPending}
            />
          </div>
        </div>
      </Modal>
    </DefaultPage>
  );
};

export default PlaylistDetalhes;
