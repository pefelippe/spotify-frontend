import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePlaylistDetails } from '../queries/update-playlist';
import { useAuth } from '../../auth';

export const useUpdatePlaylist = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, name, description }: { playlistId: string; name?: string; description?: string }) => {
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
      return updatePlaylistDetails(playlistId, accessToken, {
        name: name?.trim() || undefined,
        description: description?.trim() || undefined,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlistDetails', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['userPlaylists'] });
    },
  });
};

