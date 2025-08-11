import { test, expect } from '@playwright/test';
import { seedAuthenticatedSession, stubSpotifyApis } from './utils';

test.beforeEach(async ({ page }) => {
  await seedAuthenticatedSession(page);
});

test('playlists page lists user playlists and open details on click (routing only)', async ({ page }) => {
  await stubSpotifyApis(page, {
    playlists: [
      { id: 'pl123', name: 'Road Trip', ownerName: 'Tester' },
      { id: 'pl456', name: 'Focus Mix', ownerName: 'Tester' },
    ],
  });

  await page.goto('/playlists');

  await expect(page.getByRole('heading', { name: /Minhas Playlists/i })).toBeVisible();
  await expect(page.getByText(/Road Trip/)).toBeVisible();
  await expect(page.getByText(/Focus Mix/)).toBeVisible();
});

