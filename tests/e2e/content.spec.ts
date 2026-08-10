import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Sourced from the data file (already the source of truth) — not hardcoded here.
const EMAIL = JSON.parse(readFileSync(resolve(process.cwd(), 'src/data/personal.json'), 'utf8'))
  .email as string;

test.describe('Hero', () => {
  test('shows name, two-line title and availability, and no summary line', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Farshid');
    await expect(page.locator('.hero-name')).toContainText('Pourlatifi');
    const titleLines = page.locator('.hero-title-line');
    await expect(titleLines).toHaveCount(2);
    await expect(titleLines.nth(0)).toContainText('Senior Full-Stack Engineer');
    await expect(titleLines.nth(1)).toContainText(
      'Multi-Tenant SaaS · AI Integration · Migrations'
    );
    await expect(page.locator('.hero-signals')).toContainText('Remote (EU time zones), UTC+3');
    // The professional summary was deliberately dropped from the hero; it still
    // lives in the generated data and the meta description.
    await expect(page.locator('.hero-summary')).toHaveCount(0);
  });
});

test.describe('Navigation', () => {
  test('has the four section anchors that scroll and update active state', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('#tab-navigation');
    for (const label of ['Top', 'Skills', 'Experience', 'Contact']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }
    await nav.getByRole('link', { name: 'Contact' }).click();
    await expect
      .poll(() =>
        page.evaluate(() => document.getElementById('tab-navigation')?.dataset.activeSection)
      )
      .toBe('contact');
    // The contact section is scrolled into view.
    await expect(page.locator('#contact')).toBeInViewport({ ratio: 0.2 });
  });
});

test.describe('Skills', () => {
  test('renders four featured groups; full list disclosure is closed then opens', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('.featured-group')).toHaveCount(4);
    const details = page.locator('.skills-more');
    await expect(details).not.toHaveJSProperty('open', true);
    await details.locator('summary').click();
    await expect(details).toHaveJSProperty('open', true);
  });
});

test.describe('Experience', () => {
  test('Younea first with employment type; education, OCI cert, languages at end', async ({
    page,
  }) => {
    await page.goto('/');
    const firstRole = page.locator('.experience-item').first();
    await expect(firstRole).toContainText('Younea');
    await expect(firstRole.locator('.company-type')).toBeVisible();
    await expect(firstRole.locator('.company-type')).not.toBeEmpty();

    const credentials = page.locator('#experience .credentials');
    await expect(credentials).toContainText('Education');
    await expect(credentials).toContainText('University of Tehran');
    await expect(credentials).toContainText('Oracle Cloud Infrastructure');
    await expect(credentials).toContainText('English');
    await expect(credentials).toContainText('Farsi');
  });
});

test.describe('Contact', () => {
  test('email CTA assembles a working mailto and copy writes the address', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#contact');
    const emailLink = page.locator('.contact-email');
    await expect(emailLink).toContainText('[@]');
    // mailto assembled at runtime.
    await expect.poll(() => emailLink.getAttribute('href')).toBe(`mailto:${EMAIL}`);

    await page.locator('.copy-icon').click();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(EMAIL);
  });
});
