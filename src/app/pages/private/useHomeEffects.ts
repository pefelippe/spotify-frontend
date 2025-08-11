import { useEffect } from 'react';

export function usePickRandomTopArtist(
  topArtists: Array<any>,
  userId: string | undefined,
  setRandomTopArtist: (artist: any) => void,
) {
  useEffect(() => {
    if (!topArtists || topArtists.length === 0) {
      return;
    }
    const resolvedUserId = userId || 'anon';
    const key = `forFans:selectedArtist:${resolvedUserId}`;
    const savedId = typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;
    let picked = savedId ? topArtists.find((a: any) => a.id === savedId) : null;
    if (!picked) {
      const idx = Math.floor(Math.random() * topArtists.length);
      picked = topArtists[idx];
      try {
        sessionStorage.setItem(key, picked.id);
      } catch {}
    }
    setRandomTopArtist(picked);
  }, [topArtists, userId, setRandomTopArtist]);
}

