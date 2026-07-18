import { test, expect } from '@playwright/test';

test('CV PDF responds 200 with application/pdf', async ({ request }) => {
  const res = await request.get('/farshid-pourlatifi.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
});

test('LinkedIn link points to the correct profile', async ({ page }) => {
  await page.goto('/');
  const href = await page
    .locator('a[href*="linkedin.com/in/farshidpourlatifi"]')
    .first()
    .getAttribute('href');
  expect(href).toBe('https://www.linkedin.com/in/farshidpourlatifi');
});

test('CV download link uses the download attribute', async ({ page }) => {
  await page.goto('/');
  const cv = page.locator('a[href="/farshid-pourlatifi.pdf"]').first();
  await expect(cv).toHaveAttribute('download', /.*/);
});

test('unknown route serves the branded 404', async ({ page }) => {
  const res = await page.goto('/definitely-not-a-real-page-xyz');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('Page not found');
  await expect(page.locator('a[href="/"]')).toBeVisible();
});
