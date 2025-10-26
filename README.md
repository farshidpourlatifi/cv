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
