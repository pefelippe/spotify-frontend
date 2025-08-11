import './tailwind.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './core/auth';
import { LikedTracksProvider } from './features/liked-songs/liked-tracks-provider';

import App from './app/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import localforage from 'localforage';
import { PlayerProvider } from './features/player';
import { registerSW } from 'virtual:pwa-register';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: {
    getItem: (key: string) => localforage.getItem<string>(key),
    setItem: (key: string, value: string) => localforage.setItem(key, value),
    removeItem: (key: string) => localforage.removeItem(key),
  } as unknown as Storage,
  throttleTime: 1000,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 24 * 60 * 60 * 1000,
  buster: 'v1',
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => query.state.status === 'success',
  },
});

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

// Register service worker for PWA (supports iOS/Safari when served over HTTPS)
if ('serviceWorker' in navigator) {
  // waits for app to be stable before registering
  window.addEventListener('load', () => {
    const updateSW = registerSW({ immediate: true, onNeedRefresh() {}, onOfflineReady() {} });
    // expose if you want to trigger update elsewhere
    (window as any).__pwa_update = updateSW;
  });
}
