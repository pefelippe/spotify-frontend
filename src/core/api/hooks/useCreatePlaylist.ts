import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPlaylist } from '../queries/create-playlist';
import { useAuth } from '../../auth';
import { useUserProfile } from './useUserProfile';

export const useCreatePlaylist = () => {
  const { accessToken } = useAuth();
  const { data: userProfile } = useUserProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!accessToken || !userProfile?.id) {
        throw new Error('User not authenticated');
      }

      console.log('useCreatePlaylist called with:', { name, userId: userProfile.id });

      return createPlaylist(userProfile.id, name, accessToken);
    },
    onSuccess: (_data) => {
      console.log('Playlist created successfully, invalidating queries');
      // Invalidate and refetch playlists
      queryClient.invalidateQueries({ queryKey: ['userPlaylists'] });
    },
    onError: (error: any) => {
      console.error('Error creating playlist:', error);
    },
  });
};
