import React, { useMemo, useState } from 'react';
import { Modal } from './CustomModal';
import { useUserPlaylists } from '../../features/user/useUserPlaylists';
import { useAddTrackToPlaylist } from '../../features/playlist/useAddTrackToPlaylist';
import { useUserProfile } from '../../features/user/useUserProfile';
import { CustomButton } from './CustomButton';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackUri: string;
  trackName: string;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  trackUri,
  trackName,
}) => {
  const { data: playlistsData } = useUserPlaylists();
  const addTrackMutation = useAddTrackToPlaylist();
  const { data: userProfile } = useUserProfile();
  const [selectedPlaylists, setSelectedPlaylists] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);

  const userPlaylists = useMemo(() => {
    return playlistsData?.pages.flatMap(page => page.items) || [];
  }, [playlistsData]);

  // Only show playlists owned by the current user
  const myPlaylists = useMemo(() => {
    const currentUserId = userProfile?.id;
    if (!currentUserId) {
      return [] as any[];
    }
    return userPlaylists.filter((pl: any) => pl?.owner?.id === currentUserId);
  }, [userPlaylists, userProfile?.id]);

  const toggleSelection = (playlistId: string) => {
    setSelectedPlaylists((prev) => ({
      ...prev,
      [playlistId]: !prev[playlistId],
    }));
  };

  const selectedIds = useMemo(() => Object.keys(selectedPlaylists).filter((id) => selectedPlaylists[id]), [selectedPlaylists]);

  const handleAddSelected = async () => {
    if (selectedIds.length === 0 || isAdding) {
      return;
    }
    try {
      setIsAdding(true);
      await Promise.allSettled(
        selectedIds.map((playlistId) =>
          addTrackMutation.mutateAsync({ playlistId, trackUri }),
        ),
      );
      setSelectedPlaylists({});
      onClose();
    } catch (e) {
      // error handled by hook toast/log
    } finally {
      setIsAdding(false);
    }
  };

  // Single add kept for potential future use (now we support multi-select)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
    >
      <div className="space-y-6">
        {/* Header with X button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <div className="text-center">
          <span className="text-white text-xl font-semibold">
            Adicionar a playlist
          </span>
          <p className="text-gray-400 text-sm mt-2">
            {trackName}
          </p>
        </div>

        {/* Playlists List */}
        <div className="space-y-2 max-h-64 overflow-y-auto px-1">
          {myPlaylists.map((playlist: any) => {
            const isSelected = !!selectedPlaylists[playlist.id];
            return (
              <button
                key={playlist.id}
                onClick={() => toggleSelection(playlist.id)}
                disabled={isAdding}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors group border border-gray-700/60 ${
                  isSelected ? 'bg-green-500/10 border-green-500/50' : 'bg-gray-800/40 hover:bg-gray-800/70'
                }`}
                aria-pressed={isSelected}
              >
                <img
                  src={playlist.images?.[0]?.url || 'https://via.placeholder.com/40x40/333/fff?text=♪'}
                  alt={playlist.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {playlist.name}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {playlist.tracks?.total || 0} músicas
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-500'}`} />
              </button>
            );
          })}
        </div>

        {myPlaylists.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhuma playlist encontrada
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-1 border-t border-gray-700 flex items-center justify-between gap-3">
          <div className="text-gray-400 text-sm">
            {selectedIds.length > 0 ? `${selectedIds.length} selecionada(s)` : 'Nenhuma playlist selecionada'}
          </div>
          <CustomButton
            onClick={handleAddSelected}
            label={isAdding ? 'Adicionando...' : 'Adicionar'}
            variant="spotify"
            disabled={isAdding || selectedIds.length === 0}
            className="ml-auto"
          />
        </div>
      </div>
    </Modal>
  );
};
