import { useUserPlaylists } from '../../../features/user/useUserPlaylists';
import { useCreatePlaylist } from '../../../features/playlist/useCreatePlaylist';
import CreatePlaylistModal from '../../components/playlist/CreatePlaylistModal';
import { InfiniteScrollList } from '../../components/InfiniteScrollList';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { DefaultPage } from '../../layout/DefaultPage';
import { PageHeader } from '../../layout/PageHeader';
import { PlusIcon } from '../../components/SpotifyIcons';
import { usePlayer } from '../../../features/player';
import PlaylistItem from '../../../features/playlist/PlaylistItem';
//

const Playlists = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { playTrack } = usePlayer();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPlaylists();

  const createPlaylistMutation = useCreatePlaylist();

  const allPlaylists = useMemo(() => {
    return data?.pages.flatMap(page => page.items) || [];
  }, [data]);

  const handleCreatePlaylist = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPlaylist = async (name: string) => {
    if (!name.trim()) return;
    try {
      const result = await createPlaylistMutation.mutateAsync({
        name: name.trim(),
      });

      console.log('Playlist created successfully:', result);
      handleCloseModal();
      if (result?.id) {
        navigate(`/playlist/${result.id}`);
      }
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

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

  return (
    <DefaultPage isLoading={isLoading} error={error} loadingMessage="Carregando playlists..." errorMessage="Erro ao carregar playlists. Tente novamente.">
      <div className="space-y-8">
        {/* Custom Header with Create Button */}
        <PageHeader
          title="Minhas Playlists"
          subtitle="Sua coleção pessoal de playlists"
        >
          <button
            onClick={() => {
              console.log('Create playlist button clicked - test');
              handleCreatePlaylist();
            }}
            className="flex items-center space-x-2 bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-400 transition-colors font-semibold"
          >
            <PlusIcon size={16} />
            <span>Criar Playlist</span>
          </button>
        </PageHeader>


        <InfiniteScrollList
          items={allPlaylists}
          renderItem={renderPlaylistItem}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          className="flex flex-col space-y-1"
          itemClassName=""
          emptyComponent={
            <div className="text-center py-12 text-gray-400 col-span-full">
              Nenhuma playlist encontrada.
            </div>
          }
        />
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPlaylist}
        isSubmitting={createPlaylistMutation.isPending}
      />
    </DefaultPage>
  );
};

export default Playlists;
