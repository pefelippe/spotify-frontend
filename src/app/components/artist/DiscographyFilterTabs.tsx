import React from 'react';

export type DiscographyFilter = 'populares' | 'albuns' | 'singles' | 'eps';

interface DiscographyFilterTabsProps {
  value: DiscographyFilter;
  onChange: (value: DiscographyFilter) => void;
}

export const DiscographyFilterTabs: React.FC<DiscographyFilterTabsProps> = ({ value, onChange }) => {
  const options: Array<{ key: DiscographyFilter; label: string }> = [
    { key: 'populares', label: 'Populares' },
    { key: 'albuns', label: 'Álbuns' },
    { key: 'singles', label: 'Singles' },
    { key: 'eps', label: 'EPs' },
  ];

  return (
    <div className="flex flex-wrap gap-1 mb-4 md:mb-6 bg-gray-800 p-1 rounded-lg w-fit mx-0">
      {options.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onChange(filter.key)}
          className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors cursor-pointer ${
            value === filter.key ? 'bg-white text-black' : 'text-gray-300 hover:text-white'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default DiscographyFilterTabs;

