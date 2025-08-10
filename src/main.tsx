import './tailwind.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './core/auth';
import { LikedTracksProvider } from './features/liked-songs/liked-tracks-provider';

import App from './app/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlayerProvider } from './features/player';

const queryClient = new QueryClient();

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LikedTracksProvider>
          <PlayerProvider>
            <App />
          </PlayerProvider>
          </LikedTracksProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
