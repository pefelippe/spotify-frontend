import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeTrackFromPlaylist } from '@/core/api/queries/remove-track-from-playlist';
import { useAuth } from '@/core/auth';

export const useRemoveTrackFromPlaylist = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, trackUri }: { playlistId: string; trackUri: string }) => {
      if (!accessToken) {
        throw new Error('User not authenticated');
      }

      return removeTrackFromPlaylist(playlistId, trackUri, accessToken);
    },
    onSuccess: (_, { playlistId }) => {
      // Invalidate playlist tracks
      queryClient.invalidateQueries({ queryKey: ['playlistTracks', playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlistDetails', playlistId] });
    },
    onError: (error: any) => {
      console.error('Error removing track from playlist:', error);
    },
  });
}; 