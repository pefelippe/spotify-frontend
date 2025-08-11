import React from 'react';
import { CustomHomeSection, CustomHomeSectionItem } from './CustomHomeSection';

interface RecentlyPlayedSectionProps {
  items: Array<{ track: any }>;
  onPlayTrack: (track: any) => void;
}

export const RecentlyPlayedSection: React.FC<RecentlyPlayedSectionProps> = ({ items, onPlayTrack }) => {
  if (!items || items.length === 0) {
    return null;
  }
  const data: CustomHomeSectionItem[] = items.slice(0, 12).map((item: any, index: number) => {
    const track = item?.track;
    if (!track) {
      return null as any;
    }
    return {
      id: `${track.id}-${index}`,
      title: track.name,
      subtitle: (track.artists || []).map((a: any) => a.name).join(', '),
      imageSrc: track.album?.images?.[0]?.url || 'https://via.placeholder.com/56x56/333/fff?text=♪',
      playback: { uri: track.uri || `spotify:track:${track.id}` },
    };
  }).filter(Boolean) as CustomHomeSectionItem[];

  return (
    <CustomHomeSection
      title="Tocadas Recentemente"
      data={data}
      onClickData={(id: string) => {
        const match = items
          .map((rp: any, idx: number) => ({ rp, idx }))
          .find(({ rp, idx }: { rp: any; idx: number }) => `${rp.track?.id}-${idx}` === id);
        const track = match?.rp?.track;
        if (!track) return;
        onPlayTrack(track);
      }}
      hasShowMore={false}
    />
  );
};

export default RecentlyPlayedSection;

