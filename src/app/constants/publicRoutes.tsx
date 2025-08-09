import React from 'react';
import { Login } from '../../app/pages/public/login';
import { Callback } from '../../app/pages/public/callback';

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
