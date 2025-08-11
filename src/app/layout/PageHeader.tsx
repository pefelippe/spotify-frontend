import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-0">
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold text-white-text mb-1 md:mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 text-base md:text-lg">
              {subtitle}
            </p>
          )}
          {children && (
            <div className="mt-3 md:hidden">
              {children}
            </div>
          )}
        </div>
        {children && (
          <div className="hidden md:block ml-6 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
