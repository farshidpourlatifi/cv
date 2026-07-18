import { test, expect } from '@playwright/test';

// Substrings of the four branded console lines — the only logs allowed to ship.
const BRANDED = ['Farshid Pourlatifi', 'You read consoles', 'This site:', 'Say hi:'];

test('no console errors or page errors; only the branded message logs', async ({ page }) => {
  const errors: string[] = [];
  const pageErrors: string[] = [];
  const unexpectedLogs: string[] = [];

  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      errors.push(text);
    } else if (type === 'log' || type === 'info' || type === 'debug') {
      // Ignore Vite's dev-client chatter — it never ships to production.
      if (text.includes('[vite]')) return;
      if (!BRANDED.some((b) => text.includes(b))) unexpectedLogs.push(`[${type}] ${text}`);
    }
  });

  await page.goto('/');
  // The branded banner is deferred via requestIdleCallback — give it time.
  await page.waitForTimeout(2500);

  expect(pageErrors, `page errors:\n${pageErrors.join('\n')}`).toHaveLength(0);
  expect(errors, `console errors:\n${errors.join('\n')}`).toHaveLength(0);
  expect(unexpectedLogs, `unexpected logs:\n${unexpectedLogs.join('\n')}`).toHaveLength(0);
});
