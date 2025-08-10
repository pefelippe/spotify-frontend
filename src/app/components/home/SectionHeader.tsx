import React from 'react';

interface SectionHeaderProps {
  title: string;
  onAction?: () => void;
  actionText?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onAction, actionText = 'Ver tudo', className }) => {
  return (
    <div className={`ml-4 mb-2 flex items-center justify-between ${className || ''}`}>
      <h2 onClick={onAction} className={` text-white text-2xl font-bold tracking-tight ${actionText ? "cursor-pointer hover:underline" : ''}`}>{title}</h2>
      {onAction && (
        <button
          onClick={onAction}
          className="text-gray-400 hover:text-white text-sm md:text-base font-medium flex items-center transition-colors duration-200 group cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  ); 
};

export default SectionHeader;