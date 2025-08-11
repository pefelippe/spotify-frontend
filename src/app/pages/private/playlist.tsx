import { useUserPlaylists } from '../../../core/api/hooks/useUserPlaylists';
import { useCreatePlaylist } from '../../../core/api/hooks/useCreatePlaylist';
import CreatePlaylistModal from '../../../features/playlists/CreatePlaylistModal';
import { InfiniteScrollList } from '../../layout/InfiniteScrollList';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { DefaultPage } from '../../layout/DefaultPage';
import { PageHeader } from '../../layout/PageHeader';
import { CustomButton } from '../../components/CustomButton';
// PlusIcon no longer used in header button
import { useLikedSongs } from '../../../core/api/hooks/useLikedSongs';
import { usePlayer } from '../../../features/player';
import PlaylistItem from '../../../features/playlists/PlaylistItem';


const Playlists = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { playTrack } = usePlayer();
  const { data: likedSongsData } = useLikedSongs();
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
    const base = data?.pages.flatMap(page => page.items) || [];
    const likedCount = likedSongsData?.pages?.[0]?.total || 0;
    const likedTile = likedCount > 0 ? [{
      id: 'liked',
      name: 'Músicas Curtidas',
      owner: { display_name: '' },
      images: [{ url: '' }],
      _isLikedTile: true,
    }] : [];
    return [...likedTile, ...base];
  }, [data, likedSongsData]);

  const handleCreatePlaylist = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPlaylist = async (name: string) => {
    if (!name.trim()) {
      return;
    }
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
    if (playlistId === 'liked') {
      navigate('/playlists/liked-songs');
      return;
    }
    navigate(`/playlist/${playlistId}`);
  };

  const handlePlaylistPlay = (playlistId: string) => {
    const contextUri = playlistId === 'liked' ? 'spotify:user:collection:tracks' : `spotify:playlist:${playlistId}`;
    playTrack('', contextUri);
  };

  const renderPlaylistItem = (playlist: any) => (
    <PlaylistItem
      name={playlist.name}
      imageUrl={playlist._isLikedTile ? '' : playlist.images?.[0]?.url}
      ownerName={playlist._isLikedTile ? '' : playlist.owner.display_name}
      playlistId={playlist.id}
      onClick={() => handlePlaylistClick(playlist.id)}
      onPlay={() => handlePlaylistPlay(playlist.id)}
      isLikedTile={!!playlist._isLikedTile}
    />
  );

  return (
    <DefaultPage isLoading={isLoading} error={error} loadingMessage="Carregando playlists..." errorMessage="Erro ao carregar playlists. Tente novamente.">
      <div className="space-y-8">
        <PageHeader
          title="Minhas Playlists"
          subtitle="Sua coleção pessoal de playlists"
        >
          <CustomButton
            label="Criar Playlist"
            onClick={handleCreatePlaylist}
            variant="spotify"
            customClassName="justify-center gap-2"
          />
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
