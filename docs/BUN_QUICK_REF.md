# 🥟 BUN QUICK REFERENCE

## One-Line Deployment

```bash
bunx netlify-cli deploy --prod
```

## Essential Commands

### Installation
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash  # macOS/Linux
powershell -c "irm bun.sh/install.ps1|iex"  # Windows

# Check version
bun --version
```

### Netlify Deployment
```bash
# First time: Login
bunx netlify-cli login

# Deploy to production
bunx netlify-cli deploy --prod

# Deploy draft for preview
bunx netlify-cli deploy

# Check deployment status
bunx netlify-cli status

# Open site in browser
bunx netlify-cli open
```

### Local Development
```bash
# Start local server
bunx serve .
# Opens at: http://localhost:3000

# Or use Bun's built-in server
bun --hot index.html
```

### Package Management
```bash
# Install globally
bun install -g <package>

# Run without installing (recommended!)
bunx <package>

# Install project dependencies
bun install

# Add dependency
bun add <package>

# Remove dependency
bun remove <package>
```

### Project Scripts
```bash
# Run any script from package.json
bun run start
bun run deploy
bun run build
```

## Why Bun > npm for This Project

| Feature | npm | Bun |
|---------|-----|-----|
| Speed | Slow | **25x faster** |
| Run CLI tools | npx | **bunx** (same) |
| Install time | ~10s | **~2s** |
| Disk usage | High | **Low** |
| TypeScript | Needs config | **Built-in** |

## Troubleshooting

### Command not found
```bash
# Add to PATH (~/.bashrc or ~/.zshrc):
export PATH="$HOME/.bun/bin:$PATH"
source ~/.bashrc
```

### Clear cache
```bash
rm -rf ~/.bun/install/cache
```

### Update Bun
```bash
bun upgrade
```

## Complete Deployment Workflow

```bash
# 1. Navigate to project
cd cv-website

# 2. Login (first time)
bunx netlify-cli login

# 3. Edit your CV
# ... make changes to index.html ...

# 4. Test locally
bunx serve .

# 5. Deploy
bunx netlify-cli deploy --prod

# Done! 🎉
```

## Advantages

✅ **No installation needed** - `bunx` runs packages directly
✅ **Faster than npm** - Installs and runs 25x faster  
✅ **Drop-in replacement** - Works with all npm packages
✅ **Modern** - Built for 2024+ JavaScript development
✅ **Simpler** - Less configuration needed

## Your Project Scripts

Already set up in `package.json`:

```bash
bun run start   # Start local server
bun run deploy  # Deploy to Netlify
```

## Resources

- **Bun Docs**: https://bun.sh/docs
- **Install Bun**: https://bun.sh
- **Netlify CLI**: https://docs.netlify.com/cli

---

**TL;DR**: Replace all `npm` with `bun` and `npx` with `bunx`. That's it! 🚀
