# CV Website - Farshid Pourlatifi

Professional CV website built with Astro using a **mobile-first approach**.

## 📱 Mobile-First Design

This website prioritizes mobile devices with progressive enhancement for desktop:

- **Mobile**: Scrolling navigation, all sections visible, simplified layouts
- **Desktop**: Tab-based navigation with URL routing, multi-column layouts, interactive carousels
- **Breakpoint**: `768px` (tablet/desktop threshold)

[📖 Read the full Mobile-First Design Documentation](./docs/mobile-first-design.md)

## 🚀 Project Structure

```text
/
├── public/
│   ├── bg.svg                    # Original design background
│   └── downloads/
│       └── cv.pdf                # Downloadable CV
├── src/
│   ├── components/
│   │   ├── Background/
│   │   │   ├── PaperCanvasExact.astro   # Geometric shapes (Paper.js)
│   │   │   └── StaticBackground.astro   # Multi-layer background
│   │   ├── Footer/
│   │   │   └── SocialLinks.astro        # LinkedIn + CV download
│   │   ├── Navigation/
│   │   │   └── TabNav.astro             # Desktop tab navigation
│   │   └── Sections/
│   │       ├── Hero.astro               # Name and title
│   │       ├── Skills.astro             # Frontend/Backend skills
│   │       └── Experience.astro         # Work experience
│   ├── layouts/
│   │   ├── BaseLayout.astro             # Base HTML + styles
│   │   └── CVLayout.astro               # CV-specific layout
│   ├── pages/
│   │   ├── index.astro                  # Home route (/)
│   │   ├── skills.astro                 # Skills route (/skills)
│   │   └── experience.astro             # Experience route (/experience)
│   └── utils/
│       └── data-loader.ts               # Load CV data from JSON
├── docs/
│   ├── mobile-first-design.md           # Mobile-first documentation
│   ├── geometric-philosophy.md          # Background animation philosophy
│   └── figma/                           # Figma design specs
└── package.json
```

### Key Directories

- **`src/components/`** - Reusable Astro components
- **`src/pages/`** - File-based routing (each file = route)
- **`src/layouts/`** - Page layout templates
- **`docs/`** - Project documentation
- **`public/`** - Static assets (served as-is)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 🎨 Features

- **Mobile-First Responsive Design** - Optimized for mobile, enhanced for desktop
- **URL-Based Navigation** - Direct links to sections (`/`, `/skills`, `/experience`)
- **Paper.js Animations** - Interactive geometric background with 50+ shapes
- **Figma-Perfect Design** - Exact positioning and styling from design specs
- **Performance Optimized** - Fast loading, minimal JavaScript on mobile
- **Accessible** - Semantic HTML, keyboard navigation, ARIA labels

## 📖 Documentation

- [Mobile-First Design Guide](./docs/mobile-first-design.md) - Responsive architecture and patterns
- [Geometric Philosophy](./docs/geometric-philosophy.md) - Background animation system
- [Figma Specifications](./docs/figma/) - Original design documentation
- [Development Guide](./CLAUDE.md) - Working with Claude AI for development

## 🌐 Deployment

The site is deployed on [Netlify](https://www.netlify.com/) with automatic deployments on push to `main` branch.

**Live URL**: https://farshid-pourlatifi.netlify.app/

## 🔧 Tech Stack

- **Framework**: [Astro](https://astro.build) v5.15.1
- **Runtime**: Bun (JavaScript runtime)
- **Styling**: CSS with custom properties (mobile-first)
- **Animations**: Paper.js for canvas-based geometric shapes
- **Deployment**: Netlify with Astro adapter
- **Data**: JSON-based CV content (`/online-cv/` directory)

## 👀 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Paper.js Documentation](http://paperjs.org/reference/)
- [Mobile-First Web Design](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)

## ✅ Testing & quality gates

| Script | What it does |
|---|---|
| `bun run test` | Vitest unit + data-integrity tests (`tests/unit/`). The data-integrity tests are **hard regression guards** over the structure and prose of `src/data/*.json`. |
| `bun run test:build-output` | Post-`build` checks over `dist/` (`scripts/build-output-checks.mjs`): prerender, 404/sitemap contracts, dev-only pages absent, PDF > 400KB, plaintext-email + em-dash sweep, and JS budgets (total ≤ 200KB gzip, Paper.js chunk ≤ 130KB). |
| `bun run test:e2e` | Playwright e2e (`tests/e2e/`) — desktop 1440×900 + mobile Pixel 7. Content, links, console hygiene, axe a11y, keyboard, reduced-motion, responsive, SEO/meta. Runs in ~1–2 min. |
| `bun run test:all` | `validate` → `test` → `build` → `test:build-output` → `test:e2e`. |
| `bun run audit` | Dependency audit (`bun audit`). Needs registry/network access — falls back to `npm audit --omit=dev` (requires generating a lockfile with `npm i --package-lock-only`). |
| `bun run test:security` | Security-header checks (`tests/security/headers-check.mjs`) against a **live URL**. Netlify serves the headers, so run it against a deploy: `TEST_URL=https://deploy-preview-N--site.netlify.app bun run test:security` (defaults to production). Asserts CSP / X-Frame-Options / nosniff / Referrer-Policy / Permissions-Policy on `/`, a 404, and the PDF, and that external links carry `rel="noopener"`. |
| `bun run test:perf` | Lighthouse CI (`lighthouserc.cjs`) against `dist/`, mobile-throttled. Budgets: performance ≥ 90, accessibility ≥ 95, SEO ≥ 95; LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 300ms. Requires Chrome. Run after `bun run build`. |
| `bun run preflight` | `test:all` + `audit`. **Run before every deploy.** (`test:security` runs post-deploy against the preview URL; `test:perf` is run separately as it needs Chrome.) |

Dev-only pages (`/og-image`, `/tune`, `/linkedin-header`, `/twitter-header`) live in `src/dev-pages/` and are injected as routes **only under `astro dev`** — they never ship to production.
