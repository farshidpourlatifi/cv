import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      // Vitest owns the unit tests only; the Playwright e2e specs (tests/e2e)
      // are run by `playwright test`, not vitest.
      include: ['tests/unit/**/*.test.ts'],
      exclude: ['node_modules', 'dist', '.astro', 'tests/e2e/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'tests/',
          '**/*.config.*',
          '**/dist/**',
          '**/.astro/**',
        ],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  })
);
