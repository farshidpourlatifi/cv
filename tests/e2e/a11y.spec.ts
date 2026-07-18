import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('no serious/critical axe violations', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(500);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical'
  );
  const summary = serious
    .map((v) => `${v.id} (${v.impact}) — ${v.nodes.length} node(s): ${v.help}`)
    .join('\n');
  expect(serious, `serious/critical violations:\n${summary}`).toHaveLength(0);
});

test('keyboard-only: nav and contact are reachable with a visible focus ring', async ({ page }) => {
  await page.goto('/');
  // Elements that carry our explicit :focus-visible outline (not UA-ring-only).
  const STYLED = ['nav-tab', 'contact-email', 'copy-icon'];
  const visited: string[] = [];
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        cls: typeof el.className === 'string' ? el.className : '',
        outlineVisible: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
      };
    });
    if (!info) continue;
    visited.push(info.cls);
    if (STYLED.some((c) => info.cls.includes(c))) {
      expect(info.outlineVisible, `no visible focus ring on <${info.tag} class="${info.cls}">`).toBe(true);
    }
  }
  expect(visited.some((c) => c.includes('nav-tab')), 'never tabbed to a nav link').toBe(true);
  expect(
    visited.some((c) => c.includes('contact-email') || c.includes('copy-icon')),
    'never tabbed to the contact controls'
  ).toBe(true);
});

test('prefers-reduced-motion halts the canvas animation', async ({ page }) => {
  // The guard hides the canvas and returns before starting any rAF loop, so a
  // display:none canvas proves the animation never runs. (The production build
  // additionally skips the paper.js download — covered elsewhere; the dev
  // server pre-optimizes deps so a network assertion is unreliable here.)
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForTimeout(2000);
  const display = await page.evaluate(
    () => getComputedStyle(document.getElementById('geometric-canvas')!).display
  );
  expect(display).toBe('none');
});
