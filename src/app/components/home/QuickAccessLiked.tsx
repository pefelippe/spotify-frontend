import React from 'react';
import { HeartIcon, ChevronRightIcon } from '../SpotifyIcons';

interface QuickAccessLikedProps {
  count: number;
  onClick: () => void;
}

export const QuickAccessLiked: React.FC<QuickAccessLikedProps> = ({ count, onClick }) => {
  return (
    <section className="">
      <div
        className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl md:rounded-2xl p-5 md:p-6 cursor-pointer hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-200"
        onClick={onClick}
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <HeartIcon size={28} className="text-white" filled />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-base md:text-lg mb-0.5">Músicas Curtidas</h3>
            <p className="text-gray-300 text-xs md:text-sm">{count} músicas</p>
          </div>
          <ChevronRightIcon size={20} className="text-gray-400 hidden sm:block" />
        </div>
      </div>
    </section>
  );
};

export default QuickAccessLiked;
