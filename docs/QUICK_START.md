# QUICK START GUIDE - Deploy Your CV to Netlify

## What You Got
A complete, ready-to-deploy online CV website with:
- Modern React-based design
- Responsive layout (mobile, tablet, desktop)
- Tab-based navigation (Experience, Skills, Contact)
- Purple/indigo gradient theme
- All your professional information pre-filled

## 3 Ways to Deploy (Pick One)

### 🎯 EASIEST: Drag & Drop (2 minutes)
1. Download the `cv-website` folder
2. Compress it to a ZIP file (right-click → Compress)
3. Go to: https://app.netlify.com/drop
4. Drag and drop your ZIP file
5. Done! Your site is live!

### 🚀 RECOMMENDED: GitHub + Netlify (5 minutes)
**Why?** You can update your CV anytime by pushing changes to GitHub

**Steps:**
1. Create a free GitHub account if you don't have one
2. Create a new repository (call it `cv-website`)
3. Upload these files to the repository
4. Go to: https://app.netlify.com
5. Click "Add new site" → "Import an existing project"
6. Connect GitHub and select your repository
7. Click "Deploy site"
8. Netlify will give you a URL like: `https://random-name-12345.netlify.app`

### 💻 ADVANCED: Netlify CLI (for developers)
```bash
# Option 1: Install Netlify CLI with Bun
bun install -g netlify-cli

# Option 2: Use bunx (no installation needed - recommended!)
bunx netlify-cli login

# Navigate to folder
cd cv-website

# Deploy
bunx netlify-cli deploy --prod
```

## After Deployment

### Get a Custom Domain (Optional)
Instead of `random-name-12345.netlify.app`, you can use your own domain:

1. Buy a domain from Namecheap, GoDaddy, or Google Domains (~$10-15/year)
2. In Netlify dashboard → Domain settings → Add custom domain
3. Update your domain's DNS settings (Netlify provides instructions)
4. Wait 24-48 hours for DNS to propagate
5. Netlify automatically adds free HTTPS!

**Suggested domains for you:**
- farshidpourlatifi.com
- farshid.dev
- fpourlatifi.com

### Change the Default Netlify URL
1. Go to Netlify dashboard → Site settings
2. Click "Change site name"
3. Enter something like: `farshid-pourlatifi` or `farshid-cv`
4. Your URL becomes: `https://farshid-pourlatifi.netlify.app`

## Updating Your CV

### If using Drag & Drop:
1. Edit `index.html` locally
2. Compress to ZIP again
3. Drag & drop to Netlify (replaces old version)

### If using GitHub:
1. Edit `index.html` locally
2. Commit and push changes:
   ```bash
   git add .
   git commit -m "Updated experience"
   git push
   ```
3. Netlify auto-deploys in 30 seconds!

## What to Update First

Open `index.html` and search for these sections to customize:

1. **Line ~60**: Hero section text
2. **Line ~120**: Quick stats numbers
3. **Line ~150**: Achievements cards
4. **Line ~240**: Work experiences array
5. **Line ~300**: Skills object
6. **Line ~500**: Contact information

## Testing Locally (Before Deploy)

Want to see it on your computer first?

**Option 1: Just open the file**
- Double-click `index.html`
- Opens in your browser
- That's it!

**Option 2: Use Bun (fastest!)**
```bash
# Using bunx - no installation needed:
bunx serve .

# Then open: http://localhost:3000
```

**Option 3: Use Python**
```bash
# If you have Python installed:
python -m http.server 8000

# Then open: http://localhost:8000
```

**Option 4: Use VS Code Live Server**
- Install "Live Server" extension in VS Code
- Right-click `index.html` → "Open with Live Server"

## Files Included

- `index.html` - Your complete CV website (edit this!)
- `netlify.toml` - Netlify configuration
- `package.json` - Project metadata
- `README.md` - Full documentation
- `.gitignore` - Git ignore rules
- `QUICK_START.md` - This file!

## Need Help?

### Common Issues:

**Q: Site looks broken after deployment**
A: Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)

**Q: Want to change colors**
A: Search for `from-indigo-600` and `to-purple-600` in index.html
   Replace with other Tailwind colors like `from-blue-600 to-cyan-600`

**Q: How to add a profile photo**
A: The site uses an emoji (👨‍💻). To use a real photo:
   - Upload photo to your project
   - Replace line ~85 with:
   ```html
   <img src="your-photo.jpg" alt="Farshid Pourlatifi" class="w-48 h-48 rounded-full object-cover shadow-2xl">
   ```

**Q: Mobile menu not working**
A: It's a single-page app - all tabs work on mobile! Just tap them.

## Pro Tips

1. **Add Google Analytics**: Insert tracking code before `</head>` tag
2. **Add favicon**: Generate at https://favicon.io and add to project
3. **Test on mobile**: Use Chrome DevTools → Toggle device toolbar
4. **Print version**: The site is print-friendly! Try Ctrl/Cmd+P
5. **SEO**: The meta tags are already optimized, but you can add more in `<head>`

## Next Steps

1. Deploy using one of the methods above
2. Test on mobile and desktop
3. Share the link on LinkedIn!
4. Optional: Buy custom domain
5. Update regularly as you gain experience

## Your URLs (after deployment)

- Default: `https://[site-name].netlify.app`
- Custom: `https://yourname.com` (if you add domain)

---

Questions? Feel free to ask!

Good luck with your job search! 🚀
