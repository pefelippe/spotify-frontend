import React, { useState } from 'react';
import { Modal } from './CustomModal';
import { useUserPlaylists } from '@/features/user/useUserPlaylists';
import { useAddTrackToPlaylist } from '@/features/playlist/useAddTrackToPlaylist';
import { useMemo } from 'react';

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

  const userPlaylists = useMemo(() => {
    return playlistsData?.pages.flatMap(page => page.items) || [];
  }, [playlistsData]);

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await addTrackMutation.mutateAsync({
        playlistId,
        trackUri,
      });
      onClose();
    } catch (error) {
      console.error('Failed to add track to playlist:', error);
    }
  };

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
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {userPlaylists.map((playlist: any) => (
            <button
              key={playlist.id}
              onClick={() => handleAddToPlaylist(playlist.id)}
              disabled={addTrackMutation.isPending}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg transition-colors group"
            >
              <img
                src={playlist.images?.[0]?.url || 'https://via.placeholder.com/40x40/333/fff?text=♪'}
                alt={playlist.name}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="flex-1 text-left">
                <p className="text-white font-medium text-sm truncate">
                  {playlist.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {playlist.tracks?.total || 0} músicas
                </p>
              </div>
              {addTrackMutation.isPending && addTrackMutation.variables?.playlistId === playlist.id && (
                <div className="text-green-500 text-sm">
                  Adicionando...
                </div>
              )}
            </button>
          ))}
        </div>

        {userPlaylists.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhuma playlist encontrada
          </div>
        )}
      </div>
    </Modal>
  );
}; 