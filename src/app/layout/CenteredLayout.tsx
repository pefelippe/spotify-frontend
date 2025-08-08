import React from 'react';

interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export const CenteredLayout = ({ children, maxWidth = 'max-w-md' }: CenteredLayoutProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center   ">
        {children}
    </div>
  );
};
