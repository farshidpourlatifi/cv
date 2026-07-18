import { test, expect } from '@playwright/test';

test('head meta: title, OG, twitter, canonical', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Farshid Pourlatifi — Senior Full-Stack Engineer');

  const meta = (sel: string) => page.locator(`head ${sel}`).getAttribute('content');
  expect(await meta('meta[property="og:title"]')).toContain('Senior Full-Stack Engineer');
  expect(await meta('meta[property="og:site_name"]')).toBe('Farshid Pourlatifi');
  expect(await meta('meta[property="og:image"]')).toMatch(/\/og-image\.png$/);
  expect(await meta('meta[property="og:image:width"]')).toBe('1200');
  expect(await meta('meta[property="og:image:height"]')).toBe('630');
  expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');

  const canonical = await page.locator('head link[rel="canonical"]').getAttribute('href');
  expect(canonical).toContain('farshid.is-a.dev');
});

test('JSON-LD parses as valid Person JSON with no plaintext email', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  expect(raw).toBeTruthy();
  const data = JSON.parse(raw as string);
  expect(data['@type']).toBe('Person');
  expect(data.name).toBe('Farshid Pourlatifi');
  // The email is deliberately omitted here (assembled at runtime instead).
  expect(JSON.stringify(data)).not.toContain('@gmail.com');
});
