/**
 * Lighthouse CI budgets for the built site (mobile, throttled — Lighthouse's
 * default emulation). The homepage is prerendered, so we audit dist/ statically.
 *
 *   bun run build && bun run test:perf
 *
 * The JS byte budgets (total <= 200KB gzip, Paper.js chunk <= 130KB) are enforced
 * deterministically in scripts/build-output-checks.mjs instead — Lighthouse here
 * covers the score/Core-Web-Vitals budgets.
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['http://localhost/index.html'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-results',
    },
  },
};
