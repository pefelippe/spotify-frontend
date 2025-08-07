import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchPlaylistDetails, fetchPlaylistTracks } from '@/core/api/queries/playlist-details';
import { useAuth } from '@/core/auth';

export const usePlaylistDetails = (playlistId: string) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['playlistDetails', playlistId],
    queryFn: () => fetchPlaylistDetails(playlistId, accessToken!),
    enabled: !!accessToken && !!playlistId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const usePlaylistTracks = (playlistId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['playlistTracks', playlistId],
    queryFn: ({ pageParam = 0 }) => fetchPlaylistTracks(playlistId, accessToken!, 50, pageParam),
    enabled: !!accessToken && !!playlistId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length * 50; // offset for next page
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};
