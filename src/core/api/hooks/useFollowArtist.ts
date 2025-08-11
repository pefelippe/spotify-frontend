import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth';
import { checkIsFollowingArtists, followArtists, unfollowArtists } from '../queries/follow';

export const useIsFollowingArtist = (artistId?: string) => {
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ['isFollowingArtist', artistId],
    queryFn: async () => {
      if (!accessToken || !artistId) {
        return false;
      }
      const [isFollowing] = await checkIsFollowingArtists(accessToken, [artistId]);
      return isFollowing;
    },
    enabled: !!accessToken && !!artistId,
    staleTime: 60 * 1000,
  });
};

export const useFollowArtist = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ artistId }: { artistId: string }) => {
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
      await followArtists(accessToken, [artistId]);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['isFollowingArtist', variables.artistId] });
      queryClient.invalidateQueries({ queryKey: ['followingArtists'] });
    },
  });
};

export const useUnfollowArtist = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ artistId }: { artistId: string }) => {
      if (!accessToken) {
        throw new Error('User not authenticated');
      }
      await unfollowArtists(accessToken, [artistId]);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['isFollowingArtist', variables.artistId] });
      queryClient.invalidateQueries({ queryKey: ['followingArtists'] });
    },
  });
};

