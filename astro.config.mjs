// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

/**
 * Dev-only pages. The authoring/dev tools (og-image, social-image headers, the
 * canvas tuner) live in src/dev-pages/ — outside src/pages/ so they're never
 * auto-routed — and are injected as routes ONLY when running `astro dev`. In
 * `astro build` the command is 'build', so nothing is injected: no route, no
 * HTML, nothing in the sitemap. Regenerating og-image still works because it
 * runs against the dev server.
 */
/** @type {() => import('astro').AstroIntegration} */
const devOnlyPages = () => ({
  name: 'dev-only-pages',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      const routes = [
        { pattern: '/og-image', entrypoint: './src/dev-pages/og-image.astro' },
        { pattern: '/tune', entrypoint: './src/dev-pages/tune.astro' },
        { pattern: '/linkedin-header', entrypoint: './src/dev-pages/linkedin-header.astro' },
        { pattern: '/twitter-header', entrypoint: './src/dev-pages/twitter-header.astro' },
      ];
      for (const { pattern, entrypoint } of routes) {
        injectRoute({ pattern, entrypoint, prerender: false });
      }
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: 'https://farshid.is-a.dev',
  output: 'server', // SSR with option to prerender specific pages
  adapter: netlify(),

  integrations: [
    // Inject the dev-only authoring/tuner pages when running `astro dev`.
    devOnlyPages(),
    // React only for interactive islands (p5.js background)
    react({
      include: ['**/Background*.tsx', '**/Background*.jsx']
    }),

    // Sitemap for SEO — exclude the dev tuner and the social-image utility
    // pages (they're noindex / not real content).
    sitemap({
      filter: (page) =>
        !['/tune', '/og-image', '/linkedin-header', '/twitter-header'].some((p) =>
          page.replace(/\/$/, '').endsWith(p)
        ),
    }),

    // Compress assets for better performance
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false, // Handle separately with scripts
      JavaScript: true,
      SVG: true,
    }),
  ],

  vite: {
    optimizeDeps: {
      include: ['p5', 'gifenc'],
      esbuildOptions: {
        target: 'esnext',
      },
    },
    build: {
      // Manual chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'p5': ['p5'],
          },
        },
      },
    },
    ssr: {
      // External packages that shouldn't be bundled for SSR
      external: [],
      noExternal: ['p5'],
    },
  },
});
