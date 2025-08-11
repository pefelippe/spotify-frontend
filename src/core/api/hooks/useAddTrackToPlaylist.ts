import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTrackToPlaylist } from '../queries/add-track-to-playlist';
import { useAuth } from '../../auth';

export const useAddTrackToPlaylist = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, trackUri }: { playlistId: string; trackUri: string }) => {
      if (!accessToken) {
        throw new Error('User not authenticated');
      }

      return addTrackToPlaylist(playlistId, trackUri, accessToken);
    },
    onSuccess: (_, { playlistId }) => {
      // Invalidate playlist tracks
      queryClient.invalidateQueries({ queryKey: ['playlistTracks', playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlistDetails', playlistId] });
    },
    onError: (error: any) => {
      console.error('Error adding track to playlist:', error);
    },
  });
};
