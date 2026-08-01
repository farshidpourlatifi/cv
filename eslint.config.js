import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  // Build output and tool reports are generated, not authored. Without this the
  // minified vendor bundles under dist/ are linted and report unused variables.
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'playwright-report/**',
      'test-results/**',
      'public/**',
    ],
  },

  // Recommended config for Astro. Its .astro entry delegates the frontmatter to
  // parserOptions.parser, which only resolves now that typescript-eslint is
  // installed — before, every TypeScript token in frontmatter was a parse error.
  ...eslintPluginAstro.configs.recommended,

  // Standalone .ts/.tsx matched no config at all previously, so data-loader.ts,
  // cv.types.ts and the test suites were silently unlinted.
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),

  {
    rules: {
      // Customize rules as needed
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  {
    // The base rule misreports type-only syntax; the TypeScript-aware version
    // replaces it for .ts/.tsx and keeps the same underscore escape hatch.
    // Note this also covers the virtual .ts files the Astro processor extracts
    // from <script> blocks, which is how client scripts get linted at all.
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // The canvas work is Paper.js interop and the perf monitor reads
      // half-standard PerformanceObserver entries; both are legitimately
      // untyped at the boundary, and those files already carry @ts-nocheck.
      // Worth seeing, not worth failing the lint over.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-nocheck': false }],
    },
  },
];
