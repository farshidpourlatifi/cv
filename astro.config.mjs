// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://farshid-pourlatifi.netlify.app',
  output: 'server', // SSR with option to prerender specific pages
  adapter: netlify(),

  integrations: [
    // React only for interactive islands (p5.js background)
    react({
      include: ['**/Background*.tsx', '**/Background*.jsx']
    }),

    // Sitemap for SEO
    sitemap(),

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
