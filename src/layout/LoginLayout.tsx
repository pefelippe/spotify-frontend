import React from 'react';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="min-h-screen w-screen bg-black-bg flex items-center justify-center font-rubik">
        {children} 
    </div>
  );
};

export default LoginLayout;
