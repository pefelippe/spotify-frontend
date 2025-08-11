import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { QueryState } from '../../components/QueryState';
import { TrackList } from '../../components/TrackList';
import { usePlaylistDetails, usePlaylistTracks } from '../../../core/api/hooks/usePlaylistDetails';
import { useDeletePlaylist } from '../../../core/api/hooks/useDeletePlaylist';
import { useUpdatePlaylist } from '../../../core/api/hooks/useUpdatePlaylist';
import { useRemoveTrackFromPlaylist } from '../../../core/api/hooks/useRemoveTrackFromPlaylist';
import { useUserProfile } from '../../../core/api/hooks/useUserProfile';
import { DefaultPage } from '../../layout/DefaultPage';
import EditPlaylistModal from '../../../features/playlists/EditPlaylistModal';
import DeletePlaylistModal from '../../../features/playlists/DeletePlaylistModal';
import TrackInfoDetailed from '../../components/TrackInfoDetailed';
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

  return (
    <DefaultPage
      isLoading={isLoadingDetails}
      error={detailsError || !playlistId}
      loadingMessage="Carregando detalhes da playlist..."
      errorMessage="Tente novamente mais tarde."
      hasBackButton
    >
      <div className="space-y-8">
        <TrackInfoDetailed
          imageUrl={playlistDetails?.images?.[0]?.url || 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'}
          title={playlistDetails?.name}
          typeLabel="Playlist"
          primaryLabel={playlistDetails?.owner?.display_name}
          primaryUserId={playlistDetails?.owner?.id}
          primaryDisplayName={playlistDetails?.owner?.display_name}
          onClickPrimaryLabel={() => handleOwnerClick(playlistDetails?.owner?.id)}
          metaItems={[
            ...(playlistDetails?.followers?.total ? [`${playlistDetails?.followers?.total?.toLocaleString()} seguidores`] : []),
            `${playlistDetails?.tracks?.total} músicas`,
            ...(tracksData ? [formatTotalDurationFromPages(tracksData, (item: any) => item?.track?.duration_ms)] : []),
          ]}
          onClickEdit={isOwner ? () => {
            setEditName(playlistDetails?.name || '');
            setEditDescription(playlistDetails?.description || '');
            setShowEditModal(true);
          } : undefined}
          onClickDelete={isOwner ? () => setShowDeleteModal(true) : undefined}
          onClickPlay={() => {
            if (!playlistId) {
              return;
            }
            const contextUri = `spotify:playlist:${playlistId}`;
            // Optional readiness check; playTrack also guards internally
            if (!isReady || !deviceId) {
              return;
            }
            playTrack('', contextUri);
          }}
        />

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
        playlistName={playlistDetails?.name}
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
