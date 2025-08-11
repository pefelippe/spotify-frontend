import React from 'react';

interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export const CenteredLayout = ({ children }: CenteredLayoutProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center   ">
        {children}
    </div>
  );
};
