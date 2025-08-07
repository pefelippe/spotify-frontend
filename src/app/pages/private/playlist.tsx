import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { CustomButton } from '@/app/components/CustomButton';
import { Modal } from '@/app/components/CustomModal';
import { PageHeader } from '@/app/layout/PageHeader';
import { PageWithQueryState } from '@/app/components/PageWithQueryState';
import { InfiniteScrollList } from '@/app/components/InfiniteScrollList';
import { useUserPlaylists } from '@/app/hooks/useUserPlaylists';
import { useLikedSongs } from '@/app/hooks/useLikedSongs';
import { useUserProfile } from '@/app/hooks/useUserProfile';
import { usePlayer } from '@/features/player';
import PlaylistItem from '@/app/components/PlaylistItem';
import { HeartIcon } from '@/app/components/SpotifyIcons';
import { TrackList } from '@/app/components/TrackList';

const Playlists = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { playTrack } = usePlayer();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserPlaylists();
  const {
    data: likedSongsData,
    isLoading: isLoadingLikedSongs,
    error: likedSongsError,
    fetchNextPage: fetchNextLikedSongs,
    hasNextPage: hasNextLikedSongs,
    isFetchingNextPage: isFetchingNextLikedSongs,
  } = useLikedSongs();
  const { data: userProfile } = useUserProfile();

  const isLikedSongsPage = location.pathname === '/playlists/liked-songs';

  const allPlaylists = useMemo(() => {
    return data?.pages.flatMap(page => page.items) || [];
  }, [data]);

  const likedSongsCount = likedSongsData?.pages[0]?.total || 0;

  const handleCreatePlaylist = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handlePlaylistPlay = (playlistId: string) => {
    const contextUri = `spotify:playlist:${playlistId}`;
    playTrack('', contextUri);
  };

  const handleLikedSongsClick = () => {
    navigate('/playlists/liked-songs');
  };

  const handleLikedSongsPlay = () => {
    const contextUri = 'spotify:user:collection:tracks';
    playTrack('', contextUri);
  };

  const pageHeader = isLikedSongsPage ? (
    <PageHeader
      title="Músicas Curtidas"
      subtitle="Suas músicas favoritas"
    />
  ) : (
    <PageHeader
      title="Minhas Playlists"
      subtitle="Sua coleção pessoal de playlists"
    >
      <CustomButton
        label="Criar Playlist"
        onClick={handleCreatePlaylist}
        variant="spotify"
      />
    </PageHeader>
  );

  if (isLikedSongsPage) {
    if (isLoadingLikedSongs || likedSongsError) {
      return (
        <PageWithQueryState
          isLoading={isLoadingLikedSongs}
          error={likedSongsError}
          loadingMessage="Carregando músicas curtidas..."
          errorMessage="Erro ao carregar músicas curtidas. Tente novamente."
          headerContent={pageHeader}
        />
      );
    }

    const likedSongsCount = likedSongsData?.pages[0]?.total || 0;

    return (
      <div className="w-full p-6">
        {pageHeader}

        <div className="flex items-end space-x-6 mb-8">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-white flex items-center justify-center rounded-lg shadow-lg">
            <HeartIcon size={80} className="text-white" filled />
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-white-text mb-2">Músicas Curtidas</h1>
                             <div className="flex items-center space-x-2 text-gray-400">
                 {userProfile?.images?.[0]?.url ? (
                   <img
                     src={userProfile.images[0].url}
                     alt={userProfile.display_name || 'Usuário'}
                     className="w-6 h-6 rounded-full object-cover"
                   />
                 ) : (
                   <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                     <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                       <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
                     </svg>
                   </div>
                 )}
                 <span className="text-sm">{userProfile?.display_name || 'Você'}</span>
                 <span className="text-sm">•</span>
                 <span className="text-sm">{likedSongsCount} músicas</span>
               </div>
            </div>

            <button
              onClick={handleLikedSongsPlay}
              className="px-8 py-3 bg-green-spotify hover:bg-green-600 text-black font-bold rounded-full transition-colors flex items-center space-x-2"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="black">
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.287V1.713z"/>
              </svg>
              <span>Tocar</span>
            </button>
          </div>
        </div>

        <TrackList
          data={likedSongsData}
          hasNextPage={hasNextLikedSongs}
          isFetchingNextPage={isFetchingNextLikedSongs}
          fetchNextPage={fetchNextLikedSongs}
          isPlaylist={true}
          contextUri="spotify:user:collection:tracks"
        />
      </div>
    );
  }

  if (isLoading || error) {
    return (
      <PageWithQueryState
        isLoading={isLoading}
        error={error}
        loadingMessage="Carregando playlists..."
        errorMessage="Erro ao carregar playlists. Tente novamente."
        headerContent={pageHeader}
      />
    );
  }

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
    <div className="w-full p-6">
      {pageHeader}

      <div className="mb-6">
        <div
          className="group flex items-center bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 p-4"
          onClick={handleLikedSongsClick}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-white flex items-center justify-center rounded-lg mr-4">
            <HeartIcon size={32} className="text-white" filled />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium text-lg">Músicas Curtidas</h3>
            <p className="text-gray-200 text-sm">
              {isLoadingLikedSongs ? 'Carregando...' :
               likedSongsError?.response?.status === 403 ? 'Não disponível' :
               likedSongsError ? 'Erro ao carregar' :
               likedSongsCount > 0 ? `${likedSongsCount} músicas` : 'Nenhuma música curtida'}
            </p>
          </div>
          {!likedSongsError && likedSongsCount > 0 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikedSongsPlay();
                }}
                className="w-12 h-12 bg-green-spotify rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="black" className="ml-0.5">
                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.287V1.713z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <InfiniteScrollList
        items={allPlaylists}
        renderItem={renderPlaylistItem}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        className="flex flex-col space-y-4"
        itemClassName=""
        emptyComponent={
          <div className="text-center py-12 text-gray-400 col-span-full">
            Nenhuma playlist encontrada.
          </div>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Criar Nova Playlist"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome da Playlist
            </label>
            <input
              type="text"
              placeholder="Digite o nome da playlist..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white-text placeholder-gray-400 focus:outline-none focus:border-green-spotify"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              placeholder="Descreva sua playlist..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white-text placeholder-gray-400 focus:outline-none focus:border-green-spotify resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <CustomButton
              label="Cancelar"
              onClick={handleCloseModal}
              variant="outline"
              customClassName="flex-1"
            />
            <CustomButton
              label="Criar"
              onClick={() => {
                handleCloseModal();
              }}
              variant="primary"
              customClassName="flex-1 bg-green-spotify hover:bg-green-600"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Playlists;
