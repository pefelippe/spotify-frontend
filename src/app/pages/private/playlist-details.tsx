import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { QueryState } from '../../components/QueryState';
import { TrackList } from '../../../features/tracks/TrackList';
import { UserAvatar } from '../../components/UserAvatar';
import { usePlaylistDetails, usePlaylistTracks } from '../../../features/playlist/usePlaylistDetails';
import { useDeletePlaylist } from '../../../features/playlist/useDeletePlaylist';
import { useUpdatePlaylist } from '../../../features/playlist/useUpdatePlaylist';
import { useRemoveTrackFromPlaylist } from '../../../features/playlist/useRemoveTrackFromPlaylist';
import { useUserProfile } from '../../../features/user/useUserProfile';
import { DefaultPage } from '../../layout/DefaultPage';
import EditPlaylistModal from '../../components/playlist/EditPlaylistModal';
import DeletePlaylistModal from '../../components/playlist/DeletePlaylistModal';
import { PencilIcon, PlayIcon, TrashIcon } from '../../components/SpotifyIcons';
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
    if (!playlistId) return;
    if (!isReady || !deviceId) return;
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
        {/* Playlist Header */}
        {(() => {
          const headerImageUrl = playlistDetails.images?.[0]?.url || 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36';
          return (
            <div className="relative mb-6 md:mb-8 rounded-xl overflow-hidden w-full">
              <div className="absolute inset-0 -z-10 opacity-30">
                <div
                  style={{ backgroundImage: `url(${headerImageUrl})` }}
                  className="w-full h-full bg-cover bg-center blur-3xl scale-110"
                />
              </div>
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/70 to-transparent" />
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-start gap-12 p-4 md:p-6 lg:p-8 mx-auto">
                <div className="w-full md:w-auto flex-shrink-0">
                  <img
                    src={headerImageUrl}
                    alt={playlistDetails.name}
                    className="mx-auto w-48 h-48 sm:w-56 sm:h-56 md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] aspect-square rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-start gap-2 text-white/80 text-xs md:text-sm font-medium uppercase tracking-[0.14em] mb-2">
                    <span>Playlist</span>
                    {isOwner && (
                      <>
                        <button
                          aria-label="Editar playlist"
                          title="Editar playlist"
                          onClick={openEditModal}
                          className="inline-flex items-center justify-center p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          aria-label="Deletar playlist"
                          title="Deletar playlist"
                          onClick={() => setShowDeleteModal(true)}
                          className="inline-flex items-center justify-center p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white-text mb-3 md:mb-4 break-words">
                    {playlistDetails.name}
                  </h1>
                  {playlistDetails.description ? (
                    <p className="text-gray-300/90 text-sm md:text-base mb-3 md:mb-4 max-w-2xl">
                      {playlistDetails.description}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center justify-center md:justify-start text-gray-300/90 text-sm gap-x-2 gap-y-1">
                    <div className="flex items-center gap-2">
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
                    {playlistDetails.followers?.total ? (
                      <>
                        <span className="opacity-60">•</span>
                        <span>{playlistDetails.followers.total.toLocaleString()} seguidores</span>
                      </>
                    ) : null}
                    <span className="opacity-60">•</span>
                    <span>{playlistDetails.tracks?.total} músicas</span>
                    {tracksData ? (
                      <>
                        <span className="opacity-60">•</span>
                        <span>{formatTotalDurationFromPages(tracksData, (item: any) => item.track?.duration_ms)}</span>
                      </>
                    ) : null}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handlePlayPlaylist}
                      className="inline-flex items-center gap-2 bg-green-500 text-black px-5 py-2 rounded-full hover:bg-green-400 transition-colors cursor-pointer"
                    >
                      <PlayIcon size={18} className="ml-0.5" />
                      <span>Reproduzir</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

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
