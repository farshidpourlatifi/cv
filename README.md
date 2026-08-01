# CV Website - Farshid Pourlatifi

Professional CV website built with Astro using a **mobile-first approach**.

## 📱 Mobile-First Design

This website prioritizes mobile devices with progressive enhancement for desktop:

- **Mobile**: Scrolling navigation, all sections visible, simplified layouts
- **Desktop**: Tab-based navigation with URL routing, multi-column layouts, interactive carousels
- **Breakpoint**: `768px` (tablet/desktop threshold)

## 🚀 Project Structure

```text
/
├── public/
│   ├── bg.svg                           # Original design background
│   ├── favicon.svg
│   ├── og-image.png                     # Social preview image
│   └── farshid-pourlatifi.pdf           # Downloadable CV
├── scripts/
│   ├── build-output-checks.mjs          # Post-build assertions over dist/
│   └── validate-data.js                 # Schema validation for src/data/
├── src/
│   ├── components/
│   │   ├── Background/
│   │   │   ├── PaperCanvasExact.astro   # Geometric shapes (Paper.js)
│   │   │   ├── HeaderCanvas.astro       # Social-header canvas (dev pages)
│   │   │   └── StaticBackground.astro   # Multi-layer background
│   │   ├── Footer/
│   │   │   └── SocialLinks.astro        # LinkedIn + CV download
│   │   ├── Navigation/
│   │   │   └── TabNav.astro             # Section navigation
│   │   └── Sections/
│   │       ├── Hero.astro               # Name, title, summary
│   │       ├── Skills.astro             # Skills carousel
│   │       ├── Experience.astro         # Work history + credentials
│   │       └── Closing.astro            # Contact / closing
│   ├── data/                            # GENERATED CV JSON — never hand-edit
│   ├── dev-pages/                       # Dev-only routes (never built)
│   ├── layouts/
│   │   ├── BaseLayout.astro             # Base HTML + global styles
│   │   └── CVLayout.astro               # CV-specific layout
│   ├── pages/
│   │   ├── index.astro                  # Single-page CV (/)
│   │   └── 404.astro                    # Not-found page
│   ├── types/
│   │   └── cv.types.ts                  # Zod schemas for src/data/
│   └── utils/                           # Data loading, formatting, email, perf
├── tests/
│   ├── unit/                            # Vitest specs
│   ├── e2e/                             # Playwright specs
│   └── security/                        # Live-URL header checks
├── docs/
│   └── figma/                           # Figma design specs
└── package.json
```

### Key Directories

- **`src/components/`** - Reusable Astro components
- **`src/pages/`** - File-based routing (each file = route)
- **`src/layouts/`** - Page layout templates
- **`src/data/`** - Generated CV content. See [AGENTS.md](./AGENTS.md) before touching it
- **`tests/`** - Unit, e2e and security suites
- **`scripts/`** - Validation and post-build checks
- **`docs/`** - Project documentation
- **`public/`** - Static assets (served as-is)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                           |
| :-------------------- | :----------------------------------------------- |
| `bun install`         | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 🎨 Features

- **Mobile-First Responsive Design** - Optimized for mobile, enhanced for desktop
- **Anchor Navigation** - One page, four sections (`#top`, `#skills`, `#experience`, `#contact`); the active section is tracked on scroll and reflected in the URL
- **Paper.js Animations** - Interactive geometric canvas background, disabled under `prefers-reduced-motion`
- **Figma-Perfect Design** - Exact positioning and styling from design specs
- **Performance Optimized** - Prerendered to static HTML, with JS budgets enforced at build time
- **Accessible** - Semantic HTML, keyboard navigation, ARIA labels, axe-checked in e2e

## 📖 Documentation

- [Figma Specifications](./docs/figma/) - Original design documentation
- [AI-Assisted Development Guide](./AGENTS.md) - Conventions, quality gates, and deployment workflow

## 🌐 Deployment

The site is deployed on [Netlify](https://www.netlify.com/) with automatic deployments on push to `main` branch.

**Live URL**: https://farshid-pourlatifi.netlify.app/

## 🔧 Tech Stack

- **Framework**: [Astro](https://astro.build) v5.15.1
- **Runtime**: Bun (JavaScript runtime)
- **Styling**: CSS with custom properties (mobile-first)
- **Animations**: Paper.js for canvas-based geometric shapes
- **Deployment**: Netlify with Astro adapter
- **Data**: JSON CV content in `src/data/`, validated by Zod schemas in `src/types/`
- **Quality**: ESLint + Prettier (`bun run verify`), enforced by a lefthook pre-commit hook

## 👀 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Paper.js Documentation](http://paperjs.org/reference/)
- [Mobile-First Web Design](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)

## ✅ Testing & quality gates

| Script                      | What it does                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bun run verify`            | ESLint + Prettier over the whole repo. Also runs as a staged-file pre-commit hook (`lefthook.yml`), so skipping it just moves the failure to commit time.                                                                                                                                                                                                                                                    |
| `bun run test`              | Vitest unit + data-integrity tests (`tests/unit/`). The data-integrity tests are **hard regression guards** over the structure and prose of `src/data/*.json`.                                                                                                                                                                                                                                               |
| `bun run test:build-output` | Post-`build` checks over `dist/` (`scripts/build-output-checks.mjs`): prerender, 404/sitemap contracts, dev-only pages absent, PDF > 400KB, plaintext-email + em-dash sweep, and JS budgets (total ≤ 200KB gzip, Paper.js chunk ≤ 130KB).                                                                                                                                                                    |
| `bun run test:e2e`          | Playwright e2e (`tests/e2e/`) — desktop 1440×900 + mobile Pixel 7. Content, links, console hygiene, axe a11y, keyboard, reduced-motion, responsive, SEO/meta. Runs in ~1–2 min.                                                                                                                                                                                                                              |
| `bun run test:all`          | `verify` → `validate` → `test` → `build` → `test:build-output` → `test:e2e`. `verify` runs first so a lint/format failure surfaces in seconds instead of after the e2e suite.                                                                                                                                                                                                                                |
| `bun run audit`             | Dependency audit (`bun audit`). Needs registry/network access — falls back to `npm audit --omit=dev` (requires generating a lockfile with `npm i --package-lock-only`).                                                                                                                                                                                                                                      |
| `bun run test:security`     | Security-header checks (`tests/security/headers-check.mjs`) against a **live URL**. Netlify serves the headers, so run it against a deploy: `TEST_URL=https://deploy-preview-N--site.netlify.app bun run test:security` (defaults to production). Asserts CSP / X-Frame-Options / nosniff / Referrer-Policy / Permissions-Policy on `/`, a 404, and the PDF, and that external links carry `rel="noopener"`. |
| `bun run test:perf`         | Lighthouse CI (`lighthouserc.cjs`) against `dist/`, mobile-throttled. Budgets: performance ≥ 90, accessibility ≥ 95, SEO ≥ 95; LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 300ms. Requires Chrome. Run after `bun run build`.                                                                                                                                                                                               |
| `bun run preflight`         | `test:all` + `audit`. **Run before every deploy.** (`test:security` runs post-deploy against the preview URL; `test:perf` is run separately as it needs Chrome.)                                                                                                                                                                                                                                             |

Dev-only pages (`/og-image`, `/tune`, `/linkedin-header`, `/twitter-header`) live in `src/dev-pages/` and are injected as routes **only under `astro dev`** — they never ship to production.
