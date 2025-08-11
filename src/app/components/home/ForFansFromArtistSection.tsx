import React from 'react';
import { CustomHomeSection, CustomHomeSectionItem } from './CustomHomeSection';

interface ForFansFromArtistSectionProps {
  artistName: string;
  items: CustomHomeSectionItem[];
  onClickAlbum: (albumId: string) => void;
}

export const ForFansFromArtistSection: React.FC<ForFansFromArtistSectionProps> = ({ artistName, items, onClickAlbum }) => {
  if (!artistName || !items || items.length === 0) {
    return null;
  }
  return (
    <CustomHomeSection
      title={`Para fãs de ${artistName}`}
      data={items}
      onClickData={onClickAlbum}
      hasShowMore={false}
    />
  );
};

export default ForFansFromArtistSection;

