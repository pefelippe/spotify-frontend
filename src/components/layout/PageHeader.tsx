import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
  return (
    <div className="my-6 mx-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white-text mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-400 text-lg">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="ml-6 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
