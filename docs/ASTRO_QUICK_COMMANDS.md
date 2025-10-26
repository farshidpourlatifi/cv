# 🚀 Astro Migration - Quick Command Reference

**🔥 Using Bun for faster performance!**

## Essential Commands

### Project Setup
```bash
# Create new Astro project with Bun
bunx create-astro@latest cv-website-astro --template minimal --typescript strict --install

# Install dependencies
cd cv-website-astro
bun add @astrojs/netlify @astrojs/react @astrojs/sitemap astro-compress zod p5 react react-dom

# Install dev dependencies
bun add -D @playwright/test vitest @types/p5 prettier prettier-plugin-astro \
  eslint eslint-plugin-astro axe-playwright typescript @astrojs/check
```

### Development
```bash
# Start dev server (http://localhost:4321)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Validate data before build
bun run validate

# Format code
bun run format

# Lint code
bun run lint
```

### Testing
```bash
# Run all tests
bun test

# Run unit tests only
bun run test:unit

# Run unit tests in watch mode
bun run test:unit:watch

# Run E2E tests
bun run test:e2e

# Run E2E tests with UI
bun run test:e2e:ui

# Update visual snapshots
bun run test:e2e -- --update-snapshots

# Generate coverage report
bun run test:coverage
```

### Build & Deploy
```bash
# Full build pipeline
bun run build

# Generate PDF only
bun run generate:pdf

# Optimize images only
bun run optimize:images

# Deploy to Netlify (preview)
netlify deploy

# Deploy to Netlify (production)
netlify deploy --prod
```

---

## File Creation Commands

### Create Components
```bash
# Create new Astro component
touch src/components/MyComponent.astro

# Create React component for islands
touch src/components/Interactive.tsx
```

### Create Pages
```bash
# Create static page
touch src/pages/about.astro

# Create dynamic page
touch src/pages/blog/[slug].astro

# Create API endpoint
touch src/pages/api/data.json.ts
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/astro-migration

# Stage changes
git add .

# Commit with conventional message
git commit -m "feat: migrate to Astro framework"

# Push branch
git push -u origin feature/astro-migration

# Create PR
gh pr create --title "Migrate to Astro" --body "Migration plan implemented"
```

---

## Data Management

### Validate JSON Data
```javascript
// scripts/validate-data.js
import { readFileSync } from 'fs';
import { PersonalSchema, ExperienceSchema } from '../src/types/cv.types';

const personal = JSON.parse(readFileSync('./src/data/personal.json'));
const experiences = JSON.parse(readFileSync('./src/data/experience.json'));

PersonalSchema.parse(personal);
ExperienceSchema.array().parse(experiences);

console.log('✅ All data valid!');
```

### Quick Data Update
```bash
# Edit data
nano src/data/experience.json

# Validate
bun run validate

# Rebuild
bun run build
```

---

## Component Patterns

### Static Astro Component
```astro
---
// MyComponent.astro
export interface Props {
  title: string;
}
const { title } = Astro.props;
---

<div class="component">
  <h2>{title}</h2>
  <slot />
</div>

<style>
  .component { /* scoped styles */ }
</style>
```

### Interactive React Island
```tsx
// Interactive.tsx
export default function Interactive() {
  return <div>Hydrated on client</div>
}
```

```astro
---
// Using React island
import Interactive from './Interactive.tsx';
---
<Interactive client:visible />
```

---

## Debugging

### Check Build Output
```bash
# Analyze bundle
bun run build -- --verbose

# Check dist folder
ls -la dist/

# Serve dist locally
bunx serve dist
```

### Check Netlify Build
```bash
# Test Netlify build locally
netlify build

# Check functions
netlify functions:serve
```

### Debug Tests
```bash
# Debug specific test
bun run test:e2e -- --debug navigation.spec.ts

# Run tests in headed mode
bun run test:e2e -- --headed

# Generate trace for debugging
bun run test:e2e -- --trace on
```

---

## Performance Check

```bash
# Lighthouse CI
npx lighthouse http://localhost:4321 --view

# Bundle size check
npx vite-bundle-visualizer

# Check build size
du -sh dist/
```

---

## Environment Variables

```bash
# .env.local
PUBLIC_SITE_URL=https://farshid-pourlatifi.netlify.app
PUBLIC_GA_ID=UA-XXXXXXXX

# Access in Astro
const siteUrl = import.meta.env.PUBLIC_SITE_URL;
```

---

## Troubleshooting

| Issue | Command |
|-------|---------|
| Clear cache | `rm -rf .astro node_modules dist bun.lockb` |
| Reinstall deps | `bun install --force` |
| Check types | `bun run astro check` |
| View logs | `netlify logs:function` |
| Reset git | `git reset --hard origin/main` |

---

## VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-playwright.playwright",
    "ZixuanChen.vitest-explorer"
  ]
}
```

---

## Netlify CLI

```bash
# Login to Netlify
netlify login

# Link to site
netlify link

# Open site dashboard
netlify open

# View deploy logs
netlify watch

# Create new deploy
netlify deploy --prod
```

---

## Quick Checks

```bash
# Check everything before commit
bun run validate && bun run lint && bun run format && bun test

# Pre-deploy check
bun run build && bun run preview

# Full CI simulation
bun install && bun run build && bun test
```

---

**Pro Tips:**
- Use `bun run dev` constantly during development
- Test on mobile using `--host` flag: `bun run dev -- --host`
- Keep browser console open for hydration warnings
- Use Astro DevTools browser extension
- Check `/dist/_astro/` for bundled assets
- Bun is ~10x faster than npm for installs! 🚀

---

**Emergency Contacts:**
- Astro Discord: https://astro.build/chat
- Netlify Support: https://netlify.com/support
- Stack Overflow: [astro] tag

---

Last updated: 2024-01-25
Ready to code? Let's go! 🚀