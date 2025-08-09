import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Sidebar } from '../../app/components/Sidebar';
import { MobileHeader } from '../../app/layout/MobileHeader';
import { BottomNavigation } from '../../app/components/BottomNavigation';
import { privateRoutes } from '../../app/constants/privateRoutes';

export const PrivateRoutes: React.FC = () => {
  return (
    <>
      <MobileHeader />
      <Sidebar />
      <Routes>
        {privateRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <div className="flex justify-center flex-1 lg:ml-[250px] pt-16 lg:pt-0 ">
                <Component />
              </div>
            }
          />
        ))}
      </Routes>
      <BottomNavigation />
    </>
  );
};
