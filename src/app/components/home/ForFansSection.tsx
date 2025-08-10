import React, { useMemo } from 'react';
import { CustomHomeSection, CustomHomeSectionItem } from './CustomHomeSection';
import { HeartIcon } from '../SpotifyIcons';

interface ForFansSectionProps {
  topArtists: Array<{ id: string; name: string; images?: { url: string }[] }>;
  getArtistItems: (artistId: string) => CustomHomeSectionItem[]; // playlists, albums, singles mapped to cards
  onClickItem: (itemId: string) => void;
}

export const ForFansSection: React.FC<ForFansSectionProps> = ({ topArtists, getArtistItems, onClickItem }) => {
  const picked = useMemo(() => {
    if (!topArtists || topArtists.length === 0) {
      return null;
    }
    const idx = Math.floor(Math.random() * topArtists.length);
    return topArtists[idx];
  }, [topArtists]);

  if (!picked) {
    return null;
  }

  const header = (
    <div className="flex items-center gap-3">
      <img
        src={picked.images?.[0]?.url || 'https://via.placeholder.com/48x48/333/fff?text=♪'}
        alt={picked.name}
        className="w-6 h-6 rounded-full object-cover"
      />
      <div className="leading-tight">
        <p className="text-gray-400 text-xs">Para fãs de</p>
        <p className="text-white text-sm font-medium -mt-0.5">{picked.name}</p>
      </div>
    </div>
  );

  const items = getArtistItems(picked.id);

  return (
    <div className="mt-8">
      <div className="mb-3">{header}</div>
      <CustomHomeSection
        title=""
        data={items}
        onClickData={onClickItem}
        hasShowMore={false}
        itemWidthClassName="w-[220px] md:w-[260px] lg:w-[260px] xl:w-[300px] 2xl:w-[320px]"
        className="mt-2"
      />
    </div>
  );
};

export default ForFansSection;

