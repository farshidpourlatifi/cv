import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* `open: 'never'` matters: the html reporter defaults to opening the report
     on failure via `open --wait-apps`, which blocks the run until a human
     closes the browser window — a failing suite appeared to hang for minutes
     instead of exiting. The report is still written; view it with
     `npx playwright show-report`. */
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4322',
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Two projects: desktop Chromium 1440x900 and mobile Pixel 7 (390x844). */
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
  ],

  /* Serve the production build rather than `astro dev`.
     `astro dev` injects the Astro dev toolbar, whose apps render their own
     <h1>s inside open shadow roots. Playwright's CSS engine pierces shadow
     DOM, so `page.locator('h1')` matched five elements and tests failed with
     strict-mode violations — intermittently, depending on whether the toolbar
     had finished mounting. Serving the build also means the suite exercises
     what actually ships.
     `astro preview` is not usable here: the Netlify adapter rejects the
     preview command outright, so the prerendered dist/ is served statically.
     This requires an existing build — `bun run test:all` builds before the e2e
     step; running `bun run test:e2e` on its own tests whatever dist/ holds.
     Port 4322, not 4321: `astro dev` owns 4321, and with `reuseExistingServer`
     a dev server that happened to be running would be silently reused — which
     is exactly the toolbar situation this is meant to avoid. Separate port plus
     no reuse means the suite always tests the build, never whatever is up. */
  webServer: {
    command: 'bunx serve dist -l 4322 --no-clipboard',
    url: 'http://localhost:4322',
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
