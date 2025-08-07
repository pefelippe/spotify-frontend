import { useState, useEffect, useMemo } from 'react';
import { useUserPlaylists } from '@/features/user/useUserPlaylists';
import { useAddToPlaylist } from '@/features/playlist/useAddToPlaylist';
import { useLikedTracks } from '@/app/providers/liked-tracks-provider';
import { PlusIcon, HeartIcon } from '@/app/components/SpotifyIcons';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: {
    id: string;
    uri: string;
    name: string;
    artists: Array<{ name: string }>;
  } | null;
}

export const AddToPlaylistModal = ({ isOpen, onClose, track }: AddToPlaylistModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: playlistsData, isLoading } = useUserPlaylists();
  const addToPlaylistMutation = useAddToPlaylist();
  const { isTrackLiked, toggleLikeTrack } = useLikedTracks();

  // Get all playlists from infinite query
  const allPlaylists = useMemo(() => {
    return playlistsData?.pages.flatMap(page => page.items) || [];
  }, [playlistsData]);

  // Filter playlists based on search term
  const filteredPlaylists = useMemo(() => {
    if (!searchTerm.trim()) {
      return allPlaylists;
    }

    return allPlaylists.filter(playlist =>
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.owner.display_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allPlaylists, searchTerm]);

  // Reset search when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!track) {
      return;
    }

    try {
      await addToPlaylistMutation.mutateAsync({
        playlistId,
        trackUri: track.uri,
      });
      onClose();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleLikeTrack = () => {
    if (track) {
      toggleLikeTrack(track.id);
    }
  };

  if (!isOpen || !track) {
    return null;
  }

  const isCurrentTrackLiked = isTrackLiked(track.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-modal-backdrop">
      <div className="bg-gray-900 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col animate-modal-scale">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Adicionar à playlist</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Track Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{track.name}</h3>
              <p className="text-gray-400 text-sm truncate">
                {track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLikeTrack}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer ${
              isCurrentTrackLiked
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            <HeartIcon size={20} filled={isCurrentTrackLiked} />
            <span className="font-medium">
              {isCurrentTrackLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-700">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Pesquisar playlists"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Playlists List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="text-gray-400">Carregando playlists...</div>
            </div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400">
                {searchTerm ? 'Nenhuma playlist encontrada' : 'Você não possui playlists'}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredPlaylists.map((playlist, index) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  disabled={addToPlaylistMutation.isPending}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img
                    src={playlist.images?.[0]?.url || 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'}
                    alt={playlist.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="text-white font-medium truncate">{playlist.name}</h4>
                    <p className="text-gray-400 text-sm truncate">
                      {playlist.tracks.total} música{playlist.tracks.total !== 1 ? 's' : ''} • {playlist.owner.display_name}
                    </p>
                  </div>
                  {addToPlaylistMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <PlusIcon size={20} className="text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
