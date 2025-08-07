import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchArtistAlbums } from '../core/api/queries/artist-albums';
import { useAuth } from '@/core/auth';

export const useArtistDiscography = (artistId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['artistDiscography', artistId],
    queryFn: ({ pageParam = 0 }) => fetchArtistAlbums(artistId, accessToken!, 50, pageParam, 'album,single'),
    enabled: !!accessToken && !!artistId,
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

// Manter para compatibilidade
export const useArtistAlbums = (artistId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['artistAlbums', artistId],
    queryFn: ({ pageParam = 0 }) => fetchArtistAlbums(artistId, accessToken!, 20, pageParam, 'album'),
    enabled: !!accessToken && !!artistId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length * 20; // offset for next page
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};

export const useArtistSingles = (artistId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['artistSingles', artistId],
    queryFn: ({ pageParam = 0 }) => fetchArtistAlbums(artistId, accessToken!, 20, pageParam, 'single'),
    enabled: !!accessToken && !!artistId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length * 20; // offset for next page
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};

export const useArtistCollaborations = (artistId: string) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['artistCollaborations', artistId],
    queryFn: ({ pageParam = 0 }) => fetchArtistAlbums(artistId, accessToken!, 20, pageParam, 'appears_on'),
    enabled: !!accessToken && !!artistId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length * 20; // offset for next page
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};
