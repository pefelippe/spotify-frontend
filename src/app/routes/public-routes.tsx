import { Routes, Route, Navigate } from 'react-router-dom';

import { Login } from '../pages/public/login';
import { Callback } from '../pages/public/callback';

interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/callback',
    element: <Callback />,
  },
];

export const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
