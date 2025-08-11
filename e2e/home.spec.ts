import { test, expect } from '@playwright/test';
import { seedAuthenticatedSession, stubSpotifyApis } from './utils';

test.beforeEach(async ({ page }) => {
  await seedAuthenticatedSession(page);
});

test('home renders for authenticated user with welcome banner and search', async ({ page }) => {
  await stubSpotifyApis(page, {
    userProfileName: 'E2E Tester',
    playlists: [
      { id: 'pl1', name: 'My Playlist 1', ownerName: 'Tester' },
      { id: 'pl2', name: 'My Playlist 2', ownerName: 'Tester' },
    ],
  });

  await page.goto('/');

  await expect(page.getByPlaceholder('O que você deseja ouvir hoje?')).toBeVisible();

  await expect(page.getByText(/My Playlist 1/)).toBeVisible();
  await expect(page.getByText(/My Playlist 2/)).toBeVisible();
});

