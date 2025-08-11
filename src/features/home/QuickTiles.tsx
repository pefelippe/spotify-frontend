import React from 'react';

interface QuickTileItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  onClick: () => void;
}

interface QuickTilesProps {
  items: QuickTileItem[];
}

export const QuickTiles: React.FC<QuickTilesProps> = ({ items }) => {
  return (
    <section className="mt-8">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-3 md:gap-4 rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={item.onClick}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-14 h-14 md:w-16 md:h-16 object-cover"
              loading="lazy"
            />
            <div className="pr-3 md:pr-4 py-3 md:py-4 flex-1 min-w-0">
              <h4 className="text-white font-semibold text-xs md:text-sm truncate">{item.title}</h4>
              {item.subtitle && (
                <p className="text-gray-400 text-[11px] md:text-xs truncate">{item.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickTiles;

