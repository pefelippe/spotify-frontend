import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLikedSongs } from '@/features/liked-songs/useLikedSongs';

interface LikedTracksContextData {
  likedTracks: Set<string>;
  isTrackLiked: (trackId: string) => boolean;
  toggleLikeTrack: (trackId: string) => void;
  addLikedTrack: (trackId: string) => void;
  removeLikedTrack: (trackId: string) => void;
}

const LikedTracksContext = createContext<LikedTracksContextData | undefined>(undefined);

export const LikedTracksProvider = ({ children }: { children: ReactNode }) => {
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const { data: likedSongsData } = useLikedSongs();

  useEffect(() => {
    if (likedSongsData) {
      const trackIds = new Set<string>();
      likedSongsData.pages.forEach(page => {
        page.items.forEach((item: any) => {
          if (item.track?.id) {
            trackIds.add(item.track.id);
          }
        });
      });
      setLikedTracks(trackIds);
    }
  }, [likedSongsData]);

  const isTrackLiked = (trackId: string): boolean => {
    return likedTracks.has(trackId);
  };

  const toggleLikeTrack = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const addLikedTrack = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      newSet.add(trackId);
      return newSet;
    });
  };

  const removeLikedTrack = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      newSet.delete(trackId);
      return newSet;
    });
  };

  return (
    <LikedTracksContext.Provider
      value={{
        likedTracks,
        isTrackLiked,
        toggleLikeTrack,
        addLikedTrack,
        removeLikedTrack,
      }}
    >
      {children}
    </LikedTracksContext.Provider>
  );
};

export const useLikedTracks = (): LikedTracksContextData => {
  const context = useContext(LikedTracksContext);
  if (!context) {
    throw new Error('useLikedTracks deve estar dentro de LikedTracksProvider');
  }
  return context;
};

