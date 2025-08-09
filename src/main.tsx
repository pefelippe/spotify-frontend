import './tailwind.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './core/auth';
import { ReactQueryProvider } from './app/providers/react-query-provider';
import { LikedTracksProvider } from './features/liked-songs/liked-tracks-provider';

import App from './app/App';

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
