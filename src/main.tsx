import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './providers/auth-provider.js';
import { ReactQueryProvider } from './providers/react-query-provider.js';
import { LikedTracksProvider } from './providers/liked-tracks-provider';

import './tailwind.css';

import App from './App.js';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <LikedTracksProvider>
            <App />
          </LikedTracksProvider>
        </AuthProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  </React.StrictMode>,
);
