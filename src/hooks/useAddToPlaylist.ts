import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTrackToPlaylist } from '../api/queries/add-to-playlist';
import { useAuth } from '../providers/auth-provider';

export const useAddToPlaylist = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, trackUri }: { playlistId: string; trackUri: string }) => {
      if (!accessToken) {
        throw new Error('No access token available');
      }
      return addTrackToPlaylist(playlistId, trackUri, accessToken);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['playlistTracks', variables.playlistId],
      });
    },
  });
};
