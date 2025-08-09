import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePlaylist } from '../../core/api/queries/delete-playlist';
import { useAuth } from '../../core/auth';

export const useDeletePlaylist = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlistId: string) => {
      if (!accessToken) {
        throw new Error('User not authenticated');
      }

      return deletePlaylist(playlistId, accessToken);
    },
    onSuccess: () => {
      // Invalidate and refetch playlists
      queryClient.invalidateQueries({ queryKey: ['userPlaylists'] });
    },
    onError: (error: any) => {
      console.error('Error deleting playlist:', error);
    },
  });
};
