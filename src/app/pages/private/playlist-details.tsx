import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { QueryState } from '../../components/QueryState';
import { TrackList } from '../../../features/tracks/TrackList';
import { usePlaylistDetails, usePlaylistTracks } from '../../../features/playlist/usePlaylistDetails';
import { useDeletePlaylist } from '../../../features/playlist/useDeletePlaylist';
import { useUpdatePlaylist } from '../../../features/playlist/useUpdatePlaylist';
import { useRemoveTrackFromPlaylist } from '../../../features/playlist/useRemoveTrackFromPlaylist';
import { useUserProfile } from '../../../features/user/useUserProfile';
import { DefaultPage } from '../../layout/DefaultPage';
import EditPlaylistModal from '../../components/playlist/EditPlaylistModal';
import DeletePlaylistModal from '../../components/playlist/DeletePlaylistModal';
import { PlaylistHeader } from '../../components/playlist/PlaylistHeader';
// removed page-level header buttons; handled in PlaylistHeader
import { formatTotalDurationFromPages } from '../../../utils/formatTotalDuration';
import { usePlayer } from '../../../features/player';


const PlaylistDetalhes = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { playTrack, isReady, deviceId } = usePlayer();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const { data: playlistDetails, isLoading: isLoadingDetails, error: detailsError } = usePlaylistDetails(playlistId!);
  const { data: userProfile } = useUserProfile();
  const deletePlaylistMutation = useDeletePlaylist();
  const updatePlaylistMutation = useUpdatePlaylist();
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

  const openEditModal = () => {
    setEditName(playlistDetails?.name || '');
    setEditDescription(playlistDetails?.description || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!playlistId) {
      return;
    }
    try {
      await updatePlaylistMutation.mutateAsync({
        playlistId,
        name: editName,
        description: editDescription,
      });
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update playlist:', error);
    }
  };

  const handleOwnerClick = (ownerId: string) => {
    navigate(`/user/${ownerId}`);
  };

  const handleDeletePlaylist = async () => {
    if (!playlistId) {
      return;
    }

    try {
      await deletePlaylistMutation.mutateAsync(playlistId);
      navigate('/playlists');
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  const handleRemoveTrack = async (trackUri: string) => {
    if (!playlistId) {
      return;
    }

    try {
      await removeTrackMutation.mutateAsync({
        playlistId,
        trackUri,
      });
    } catch (error) {
      console.error('Failed to remove track:', error);
    }
  };

  const handlePlayPlaylist = () => {
    if (!playlistId) {
      return;
    }
    if (!isReady || !deviceId) {
      return;
    }
    const contextUri = `spotify:playlist:${playlistId}`;
    playTrack('', contextUri);
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



  return (
    <DefaultPage
      hasBackButton
    >
      <div className="space-y-8">
        <PlaylistHeader
          playlist={playlistDetails}
          isOwner={isOwner}
          onClickOwner={handleOwnerClick}
          onClickPlay={handlePlayPlaylist}
          onClickEdit={openEditModal}
          onClickDelete={() => setShowDeleteModal(true)}
          totalDurationText={tracksData ? formatTotalDurationFromPages(tracksData, (item: any) => item.track?.duration_ms) : undefined}
        />

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

      <DeletePlaylistModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        playlistName={playlistDetails.name}
        onConfirm={handleDeletePlaylist}
        isDeleting={deletePlaylistMutation.isPending}
      />

      <EditPlaylistModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialName={editName}
        initialDescription={editDescription}
        onSave={async ({ name, description }) => {
          setEditName(name || '');
          setEditDescription(description || 'Adicione uma descrição');
          await handleSaveEdit();
        }}
        isSaving={updatePlaylistMutation.isPending}
        onRequestDelete={() => setShowDeleteModal(true)}
      />
    </DefaultPage>
  );
};

export default PlaylistDetalhes;
