import React from 'react';

interface ArtistHeaderProps {
  imageUrl: string;
  name: string;
  followers?: number;
  releasesCount?: number;
  genres?: string[];
}

export const ArtistHeader: React.FC<ArtistHeaderProps> = ({ imageUrl, name, followers, releasesCount, genres }) => {
  return (
    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
      <img src={imageUrl} alt={name} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover" />
      <div className="flex-1 text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-white-text mb-2">{name}</h2>
        <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4 mb-3">
          {followers ? <p className="text-gray-400 text-sm">{followers.toLocaleString()} seguidores</p> : null}
          {typeof releasesCount === 'number' ? <p className="text-gray-400 text-sm">{releasesCount} lançamentos</p> : null}
        </div>
        {genres && genres.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-start">
            {genres.slice(0, 4).map((genre, index) => (
              <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">
                {genre}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ArtistHeader;

