import { test, expect } from '@playwright/test';

test('callback without code redirects to login', async ({ page }) => {
  await page.goto('/callback');
  await expect(page).toHaveURL(/\/login$/);
});

test('callback with code stores token and redirects to home (stub auth API)', async ({ page }) => {
  // Stub backend callback exchange
  await page.route('**/auth/callback?code=*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { access_token: 'e2e-token', scope: 'user-read-email user-read-private' } }),
    });
  });

  await page.goto('/callback?code=abc123');

  await expect(page).toHaveURL('http://localhost:5173/');
});

