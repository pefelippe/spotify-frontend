import { Page } from '@playwright/test';

export const REQUIRED_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-library-modify',
  'user-follow-read',
  'user-follow-modify',
  'user-top-read',
  'streaming',
  'app-remote-control',
] as const;

export async function seedAuthenticatedSession(page: Page, token: string = 'e2e-token') {
  const scopes = REQUIRED_SCOPES.join(' ');
  await page.addInitScript(({ token, scopes }) => {
    window.sessionStorage.setItem('spotify_token', token);
    window.sessionStorage.setItem('spotify_token_scopes', scopes);
  }, { token, scopes });
}

export async function stubSpotifyApis(page: Page, options?: {
  playlists?: any[];
  userProfileName?: string;
}) {
  const playlists = options?.playlists ?? [];
  const userProfileName = options?.userProfileName ?? 'E2E Tester';

  await page.route('https://api.spotify.com/v1/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'user123', display_name: userProfileName }),
    });
  });

  await page.route('https://api.spotify.com/v1/me/playlists**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: playlists.map((p, i) => ({
          id: p.id ?? `pl_${i}`,
          name: p.name ?? `Playlist ${i + 1}`,
          images: p.images ?? [{ url: 'https://via.placeholder.com/72' }],
          owner: { display_name: p.ownerName ?? 'Owner' },
        })),
        next: null,
      }),
    });
  });

  await page.route('https://api.spotify.com/v1/me/tracks**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [], total: 0, limit: 20, offset: 0 }),
    });
  });

  await page.route('https://api.spotify.com/v1/me/player/recently-played**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [], next: null, cursors: { after: null, before: null }, limit: 10, href: null }),
    });
  });

  await page.route('https://api.spotify.com/v1/me/top/artists**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [], total: 0, limit: 20, offset: 0 }),
    });
  });

  await page.route(/https:\/\/api\.spotify\.com\/v1\/artists\/.*\/albums.*/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [], total: 0, limit: 20, offset: 0 }),
    });
  });
}

