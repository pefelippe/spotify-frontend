import { useUserPlaylists } from '../../../features/user/useUserPlaylists';
import { useCreatePlaylist } from '../../../features/playlist/useCreatePlaylist';
import { Modal } from '../../components/CustomModal';
import { InfiniteScrollList } from '../../components/InfiniteScrollList';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { DefaultPage } from '../../layout/DefaultPage';
import { PageHeader } from '../../layout/PageHeader';
import { PlusIcon } from '../../components/SpotifyIcons';
import { usePlayer } from '../../../features/player';
import PlaylistItem from '../../../features/playlist/PlaylistItem';

const Playlists = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
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
    setPlaylistName('');
  };

  const handleSubmitPlaylist = async () => {
    if (!playlistName.trim()) {
      return;
    }
    try {
      const result = await createPlaylistMutation.mutateAsync({
        name: playlistName.trim(),
      });

      console.log('Playlist created successfully:', result);
      handleCloseModal();
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title=""
      >
        <div className="space-y-6">
          {/* Header with X button */}
          <div className="flex justify-end">
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-white transition-colors text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <div className="text-center">
            <span className="text-white text-xl font-semibold">
              Dê um nome a sua playlist
            </span>
          </div>

          {/* Input with bottom border only */}
          <div className="space-y-2">
            <input
              type="text"
              value={playlistName}
              onChange={(e) => {
                console.log('Playlist name changed:', e.target.value);
                setPlaylistName(e.target.value);
              }}
              placeholder="Digite o nome da playlist..."
              className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors text-lg"
              maxLength={100}
              autoFocus
            />
          </div>

          {/* Centered Create Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                console.log('Create button clicked, playlist name:', playlistName);
                handleSubmitPlaylist();
              }}
              disabled={!playlistName.trim() || createPlaylistMutation.isPending}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-200 ${
                playlistName.trim() && !createPlaylistMutation.isPending
                  ? 'bg-green-500 text-black hover:bg-green-400 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {createPlaylistMutation.isPending ? 'Criando...' : 'Criar'}
            </button>
          </div>

          {createPlaylistMutation.isError && (
            <div className="text-red-400 text-sm text-center">
              Erro ao criar playlist. Tente novamente.
            </div>
          )}
        </div>
      </Modal>
    </DefaultPage>
  );
};

export default Playlists;
