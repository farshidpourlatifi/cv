# 🥟 DEPLOYING WITH BUN - Quick Guide

## Why Bun?
- ⚡ **Faster** than npm/yarn (up to 25x faster for installs)
- 🎯 **Drop-in replacement** for Node.js and npm
- 🔧 **Built-in tools** - no need for extra packages
- 💪 **Native TypeScript support**

## Prerequisites

### Install Bun (if you haven't already)

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows:**
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

Verify installation:
```bash
bun --version
# Should show something like: 1.0.x
```

## Deployment Methods with Bun

### Method 1: Using bunx (No Installation - Recommended! ⭐)

The beauty of Bun is you can run CLI tools without installing them:

```bash
# Navigate to your cv-website folder
cd cv-website

# Login to Netlify (first time only)
bunx netlify-cli login

# Deploy to production
bunx netlify-cli deploy --prod
```

That's it! The `bunx` command downloads and runs `netlify-cli` without installing it globally.

### Method 2: Global Installation

If you prefer to install Netlify CLI globally:

```bash
# Install Netlify CLI globally with Bun
bun install -g netlify-cli

# Navigate to your folder
cd cv-website

# Login (first time only)
netlify login

# Deploy
netlify deploy --prod
```

### Method 3: Project-level Installation

Install as a project dependency:

```bash
# Navigate to your folder
cd cv-website

# Install Netlify CLI locally
bun add -D netlify-cli

# Run using bun
bun run deploy
```

This uses the `deploy` script in `package.json` which is already set up to use bunx!

## Complete Deployment Workflow

### First-Time Setup
```bash
# 1. Navigate to your project
cd cv-website

# 2. Login to Netlify (opens browser)
bunx netlify-cli login

# 3. Initialize site (creates .netlify folder)
bunx netlify-cli init

# Follow prompts:
# - Create & configure a new site
# - Choose team (if you have multiple)
# - Site name (e.g., farshid-cv)
# - Build command: leave empty (it's static HTML)
# - Deploy directory: . (current directory)
```

### Deploy Updates
```bash
# After making changes to index.html:
bunx netlify-cli deploy --prod

# Or use the package.json script:
bun run deploy
```

## Testing Locally with Bun

Bun has a built-in HTTP server, but for best results use `serve`:

```bash
# Option 1: Using bunx (no installation)
bunx serve .

# Option 2: Using Bun's built-in server (experimental)
bun --hot index.html
```

Your site will be available at `http://localhost:3000`

## Advantages of Bun for This Project

### 1. Speed
```bash
# npm install time: ~5-10 seconds
npm install -g netlify-cli

# bun install time: ~1-2 seconds
bun install -g netlify-cli
```

### 2. Disk Space
- Bun uses less disk space for global packages
- No `node_modules` bloat if using `bunx`

### 3. Built-in Tools
```bash
# Run any npm package without installing:
bunx serve .
bunx netlify-cli deploy
bunx prettier --write index.html

# No need for npx!
```

## Common Bun Commands Cheat Sheet

```bash
# Install packages globally
bun install -g <package>

# Run without installing (like npx)
bunx <package>

# Install project dependencies
bun install

# Run scripts from package.json
bun run <script>

# Update Bun itself
bun upgrade

# Check Bun version
bun --version

# Run a file
bun run <file.js>
```

## Troubleshooting with Bun

### Issue: Command not found after global install
**Solution:** Add Bun's global bin to your PATH:

```bash
# For Bash/Zsh (add to ~/.bashrc or ~/.zshrc):
export PATH="$HOME/.bun/bin:$PATH"

# Reload shell:
source ~/.bashrc  # or source ~/.zshrc
```

### Issue: bunx is slow first time
**Reason:** First run downloads the package. Subsequent runs are cached and instant!

### Issue: Netlify CLI doesn't work with bunx
**Solution:** Specify full package name:
```bash
bunx netlify-cli deploy --prod
```

### Issue: Need to clear cache
```bash
# Clear Bun's global cache:
rm -rf ~/.bun/install/cache
```

## Bonus: Bun Scripts for Your Project

Add these to your `package.json` scripts:

```json
{
  "scripts": {
    "start": "bunx serve .",
    "deploy": "bunx netlify-cli deploy --prod",
    "deploy:draft": "bunx netlify-cli deploy",
    "status": "bunx netlify-cli status",
    "open": "bunx netlify-cli open",
    "lint": "bunx prettier --check index.html",
    "format": "bunx prettier --write index.html"
  }
}
```

Then use:
```bash
bun run start       # Start local server
bun run deploy      # Deploy to production
bun run deploy:draft # Deploy draft for preview
bun run status      # Check deployment status
bun run open        # Open site in browser
bun run format      # Format HTML with Prettier
```

## Comparison: npm vs Bun

| Task | npm | Bun |
|------|-----|-----|
| Install CLI globally | `npm i -g netlify-cli` | `bun i -g netlify-cli` |
| Run without install | `npx netlify-cli` | `bunx netlify-cli` |
| Install speed | ~5-10s | ~1-2s |
| Run project script | `npm run deploy` | `bun run deploy` |
| Local server | `npx serve .` | `bunx serve .` |

## Why Bun is Perfect for This Project

1. **Static HTML site** - No complex build process, Bun's simplicity shines
2. **Fast deploys** - Bun's speed makes iteration faster
3. **No dependencies** - Using CDN links for React/Tailwind, so no node_modules needed
4. **Modern workflow** - Bun represents modern JavaScript tooling

## Production Checklist with Bun

- [x] Install Bun (`curl -fsSL https://bun.sh/install | bash`)
- [x] Navigate to project (`cd cv-website`)
- [x] Login to Netlify (`bunx netlify-cli login`)
- [x] Deploy to production (`bunx netlify-cli deploy --prod`)
- [x] Verify deployment works
- [x] Bookmark deploy command for future updates

## Future: CI/CD with Bun

If you set up GitHub Actions later, you can use Bun there too:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Deploy to Netlify
        run: bunx netlify-cli deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Summary

**Simplest deployment with Bun:**
```bash
cd cv-website
bunx netlify-cli login    # First time only
bunx netlify-cli deploy --prod
```

That's it! Bun makes deployment simple and fast. 🚀

---

**Resources:**
- Bun Docs: https://bun.sh/docs
- Netlify CLI Docs: https://docs.netlify.com/cli/get-started/
- Bun Discord: https://bun.sh/discord

Happy deploying with Bun! 🥟⚡
