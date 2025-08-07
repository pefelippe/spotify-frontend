import React from 'react';
import Sidebar from '../components/Sidebar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-screen bg-black-bg flex font-family">
      <Sidebar />
      <main className="flex-1 overflow-auto ">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
