import { test, expect } from '@playwright/test';

test('login page renders and CTA exists', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('img', { name: /spotify/i })).toBeVisible({ timeout: 10_000 });

  await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();

  await expect(page.getByText(/Entre com sua conta Spotify/i)).toBeVisible();
});

