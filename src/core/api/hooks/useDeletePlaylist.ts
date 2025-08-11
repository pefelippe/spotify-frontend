import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePlaylist } from '../queries/delete-playlist';
import { useAuth } from '../../auth';

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
      queryClient.invalidateQueries({ queryKey: ['userPlaylists'] });
    },
    onError: (error: any) => {
      console.error('Error deleting playlist:', error);
    },
  });
};
