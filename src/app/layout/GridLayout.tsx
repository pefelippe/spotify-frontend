import React from 'react';

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
}

export const GridLayout = ({
  children,
  columns = { sm: 2, md: 3, lg: 4, xl: 6 },
  gap = 'gap-6',
}: GridLayoutProps) => {
  const getGridClasses = () => {
    const baseClass = 'grid';
    const responsiveClasses = [
      `grid-cols-${columns.sm || 2}`,
      `sm:grid-cols-${columns.sm || 2}`,
      `md:grid-cols-${columns.md || 3}`,
      `lg:grid-cols-${columns.lg || 4}`,
      `xl:grid-cols-${columns.xl || 6}`,
    ];

    return `${baseClass} ${responsiveClasses.join(' ')} ${gap}`;
  };

  return (
    <div className={getGridClasses()}>
      {children}
    </div>
  );
};
