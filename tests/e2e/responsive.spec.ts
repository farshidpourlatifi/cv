import { test, expect } from '@playwright/test';

test('no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(300);
  const { scrollW, clientW } = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  expect(scrollW).toBeLessThanOrEqual(clientW + 1);
});

test('fixed nav + social icons carry a masking scrim over content', async ({ page }) => {
  // A fixed nav/footer unavoidably sits over scrolling content on both viewports,
  // so the regression guard for the overlap bug is the masking backdrop: both the
  // nav (.nav-list::before) and the social footer (.social-footer::before) must
  // render a scrim so bullets/text passing beneath them are masked, not collided.
  await page.goto('/');
  await page.waitForTimeout(300);
  const scrims = await page.evaluate(() => {
    const has = (sel: string, pseudo: string) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const cs = getComputedStyle(el, pseudo);
      return (
        cs.content !== 'none' && cs.content !== '' && cs.backgroundColor !== 'rgba(0, 0, 0, 0)'
      );
    };
    return {
      nav: has('.nav-list', '::before'),
      footer: has('.social-footer', '::before'),
    };
  });
  expect(scrims.nav, 'nav is missing its masking scrim').toBe(true);
  expect(scrims.footer, 'social footer is missing its masking scrim').toBe(true);
});

test('mobile nav tap targets are >= 44px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile only');
  await page.goto('/');
  await page.waitForTimeout(300);
  const heights = await page
    .locator('.nav-tab')
    .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
  expect(heights.length).toBeGreaterThan(0);
  for (const h of heights) expect(h).toBeGreaterThanOrEqual(44);
});
