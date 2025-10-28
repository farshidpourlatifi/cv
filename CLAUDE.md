# 🤖 CLAUDE.md - AI-Assisted Development Guide

## Overview

This guide explains how to use Claude (Anthropic's AI assistant) for developing and maintaining your CV website, plus GitHub integration for automated deployments.

---

## ⚠️ Context Management & Documentation

### Important: Always Document in `/docs`

When implementing complex features or running low on context (>80% token usage):

1. **Check context**: Run `/context` to see token usage
2. **Document immediately**: Create comprehensive docs in `/docs` folder
3. **Include**:
   - Architecture overview
   - Implementation details
   - Configuration examples
   - Next steps/TODOs
4. **Reference in commits**: Link to docs in commit messages

**Example**: Neural network background documentation:
- `/docs/NEURAL_NETWORK_CURVES.md` - Bezier curve system
- `/docs/SCROLL_MORPHING_PLAN.md` - Scroll-based morphing plan
- `/docs/NEURAL_NETWORK_BACKGROUND.md` - Overall architecture

### Why This Matters

Claude has a 200k token context limit. Complex sessions can reach this limit. Documentation ensures:
- ✅ Work is preserved even if context is lost
- ✅ Future Claude sessions can pick up where you left off
- ✅ You have reference material for the implementation
- ✅ Other developers can understand the system

---

## Table of Contents

1. [Development with Claude](#development-with-claude)
2. [GitHub Setup](#github-setup)
3. [Netlify GitHub Integration](#netlify-github-integration)
4. [Automated Deployment Workflow](#automated-deployment-workflow)
5. [Common Development Tasks](#common-development-tasks)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Development with Claude

### What Claude Can Help With

Claude is excellent for:

✅ **Code Updates**
- Updating your work experience
- Adding new skills
- Modifying design/colors
- Fixing bugs
- Improving responsiveness

✅ **Feature Development**
- Adding new sections (Portfolio, Blog, Projects)
- Implementing contact forms
- Adding animations
- Integrating analytics
- Creating dark mode

✅ **Optimization**
- Performance improvements
- SEO optimization
- Accessibility enhancements
- Code refactoring

✅ **Documentation**
- Writing guides
- Creating README updates
- Explaining code changes

### How to Work with Claude

#### 1. **Be Specific About Changes**

❌ **Vague:**
"Make my CV better"

✅ **Specific:**
"Update the Younea role to add a new bullet point about implementing Redis caching that improved API response time by 40%"

#### 2. **Provide Context**

Always mention:
- Which file you're editing (`index.html`)
- Which section (Experience, Skills, Contact)
- What you want to achieve
- Any constraints (color scheme, design style)

**Example:**
```
I need to add a new work experience in index.html. 
The company is "TechCorp" (2024-Present), 
role is "Tech Lead", 
location is "Remote", 
and here are 4 achievements: [list]
Please add it BEFORE the Younea experience.
```

#### 3. **Iterate in Steps**

Rather than asking for everything at once:

**Step 1:** "Add dark mode toggle button to the header"
**Step 2:** "Now implement the dark mode CSS classes"
**Step 3:** "Save dark mode preference to localStorage"

#### 4. **Review and Test**

After Claude provides code:
1. Review the changes carefully
2. Test in browser (open `index.html`)
3. Check mobile responsiveness
4. Ask Claude to fix any issues

### Example Prompts

#### Adding New Experience
```
Add a new work experience to index.html:
- Company: NewCo
- Location: Berlin, Germany
- Role: Senior Developer
- Period: 2025 - Present
- Type: Remote, Full-Time
- Highlights:
  * Led frontend architecture for AI platform
  * Improved performance by 50%
  * Mentored 3 junior developers
- Tech: React, TypeScript, Python

Add it as the FIRST entry in the experiences array.
```

#### Updating Skills
```
Add these new skills to the skills object in index.html:
- Frontend: Add "Next.js" and "Remix"
- AI: Add "LangChain" and "OpenAI API"
- Remove "BackboneJS" from frontend (outdated)
```

#### Changing Design
```
Change the color scheme from purple/indigo to blue/cyan:
- Replace all "indigo" with "blue"
- Replace all "purple" with "cyan"
- Make sure gradients still look good
```

#### Adding New Section
```
Add a "Projects" section to index.html:
- Create a new tab called "projects"
- Add a projects array with 3 sample projects
- Each project should have: title, description, tech stack, link
- Use the same card design as achievements
```

---

## GitHub Setup

### Initial Repository Setup

#### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `cv-website`
4. Description: "Personal CV website - Farshid Pourlatifi"
5. Choose "Public" (or Private if preferred)
6. Don't initialize with README (we already have files)
7. Click "Create repository"

#### Step 2: Initialize Git Locally

```bash
# Navigate to your project
cd cv-website

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: CV website"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/cv-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 3: Verify Upload

Go to your repository on GitHub and verify all files are there:
- index.html
- netlify.toml
- package.json
- README.md
- All .md documentation files

### Git Workflow

#### Daily Development Workflow

```bash
# 1. Make changes to index.html
# (Edit file, test locally)

# 2. Check what changed
git status
git diff

# 3. Stage changes
git add index.html

# 4. Commit with descriptive message
git commit -m "Update: Added NewCo to work experience"

# 5. Push to GitHub
git push

# 6. Netlify auto-deploys in ~30 seconds!
```

#### Commit Message Guidelines

Use clear, descriptive commit messages:

✅ **Good:**
```bash
git commit -m "Add: Redis caching achievement to Younea role"
git commit -m "Update: Changed color scheme to blue/cyan"
git commit -m "Fix: Mobile responsiveness on skills section"
git commit -m "Feature: Added dark mode toggle"
```

❌ **Bad:**
```bash
git commit -m "update"
git commit -m "changes"
git commit -m "fix"
git commit -m "test"
```

#### Branching Strategy (Optional)

For major changes, use branches:

```bash
# Create new branch for feature
git checkout -b feature/add-projects-section

# Make changes, commit
git add .
git commit -m "Add: Projects section with sample data"

# Push branch to GitHub
git push -u origin feature/add-projects-section

# Create Pull Request on GitHub
# Review changes
# Merge to main

# Netlify deploys when main is updated
```

---

## Netlify GitHub Integration

### One-Time Setup

#### Step 1: Connect Netlify to GitHub

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site"
3. Choose "Import an existing project"
4. Click "Deploy with GitHub"
5. Authorize Netlify to access your GitHub
6. Select your `cv-website` repository

#### Step 2: Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`:

- **Branch to deploy:** `main`
- **Build command:** (leave empty)
- **Publish directory:** `.` (root)

Click "Deploy site"

#### Step 3: Set Up Deploy Notifications (Optional)

In Netlify dashboard:
1. Go to Site settings → Build & deploy → Deploy notifications
2. Add notification for "Deploy succeeded"
3. Options:
   - Email notification
   - Slack webhook
   - GitHub commit status (auto-enabled)

### How It Works

Once connected:

```
1. You edit index.html locally
2. You commit: git commit -m "Update experience"
3. You push: git push
4. GitHub receives push
5. Netlify detects push
6. Netlify builds/deploys site
7. New version live in ~30 seconds!
```

### Deploy Previews

Netlify automatically creates deploy previews for branches:

```bash
# Create feature branch
git checkout -b feature/new-design

# Make changes
git add .
git commit -m "Experimental new design"
git push -u origin feature/new-design

# Netlify creates preview at:
# https://deploy-preview-1--your-site.netlify.app

# Test preview
# If good: merge to main
# If bad: keep iterating on branch
```

---

## Automated Deployment Workflow

### Full Workflow Diagram

```
┌─────────────────┐
│  Local Changes  │
│  (index.html)   │
└────────┬────────┘
         │
         ▼
    git commit
         │
         ▼
     git push
         │
         ▼
┌─────────────────┐
│     GitHub      │
│   (Repository)  │
└────────┬────────┘
         │
         │ (webhook)
         ▼
┌─────────────────┐
│     Netlify     │
│   Auto-Deploy   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Live Site     │
│ (30 seconds)    │
└─────────────────┘
```

### Deployment States

Your site can be in these states:

1. **Local** - Changes only on your computer
2. **GitHub** - Pushed to repository (source of truth)
3. **Netlify (Building)** - Deployment in progress
4. **Netlify (Live)** - Deployed and accessible

Check status:
- **GitHub:** https://github.com/YOUR_USERNAME/cv-website
- **Netlify:** https://app.netlify.com/sites/YOUR_SITE

### Rollback/History

Netlify keeps all deployments:

1. Go to Netlify dashboard → Deploys
2. See all past deployments
3. Click any deployment → "Publish deploy"
4. Instantly reverts to that version

This is separate from Git history - you have two levels of backup!

---

## Common Development Tasks

### Task 1: Update Work Experience

**With Claude:**
```
Please update my Younea work experience in index.html:
- Change period from "2024 - Present" to "2024 - 2025"
- Add new company "NewTech" as current role (2025 - Present)
- Role: "Lead Engineer", Location: "Amsterdam", Type: "Remote"
- Add these 3 highlights: [list them]
```

**Deploy:**
```bash
git add index.html
git commit -m "Update: Added NewTech, updated Younea dates"
git push
```

### Task 2: Add New Skills

**With Claude:**
```
Add these skills to index.html:
- AI section: Add "LangChain", "Vector Databases"
- Frontend: Add "Astro", "Qwik"
```

**Deploy:**
```bash
git add index.html
git commit -m "Add: New AI and frontend skills"
git push
```

### Task 3: Fix Bug

**With Claude:**
```
The mobile menu isn't showing on screens smaller than 768px.
Can you add proper responsive styles for the tab navigation?
Test it works on mobile viewport.
```

**Deploy:**
```bash
git add index.html
git commit -m "Fix: Mobile navigation responsive styling"
git push
```

### Task 4: Major Redesign

**Use branches:**
```bash
# Create branch
git checkout -b redesign/new-layout

# Ask Claude for changes
# Test thoroughly locally

# Commit multiple times as you iterate
git add index.html
git commit -m "Redesign: New header layout"
# ... more commits ...

# Push branch
git push -u origin redesign/new-layout

# Test preview: https://deploy-preview-X--your-site.netlify.app

# If good, merge on GitHub
# If bad, keep iterating or delete branch
```

---

## Best Practices

### 1. Always Test Locally First

Before pushing:
```bash
# Open in browser
open index.html

# Or serve locally
bunx serve .
```

Check:
- ✅ Content updated correctly
- ✅ No typos
- ✅ Links work
- ✅ Mobile looks good
- ✅ No console errors

### 2. Commit Often

Don't make 10 changes and commit once:

❌ **Bad:**
```bash
# Changed 15 things
git commit -m "Updates"
```

✅ **Good:**
```bash
git commit -m "Update: Younea experience"
# ... more work ...
git commit -m "Add: Dark mode toggle"
# ... more work ...
git commit -m "Fix: Mobile menu"
```

### 3. Write Descriptive Commits

Use prefixes:
- `Add:` - New content/features
- `Update:` - Modified existing content
- `Fix:` - Bug fixes
- `Remove:` - Deleted content
- `Refactor:` - Code reorganization
- `Style:` - Visual/CSS changes
- `Docs:` - Documentation updates

### 4. Keep GitHub and Local in Sync

Always pull before starting work:
```bash
git pull
# Make changes
git push
```

### 5. Use .gitignore

The `.gitignore` file prevents committing:
- `.netlify/` folder (local Netlify state)
- `.DS_Store` (Mac system files)
- `node_modules/` (if you add npm packages)
- Log files

Never commit these!

### 6. Backup Strategy

You have multiple backups:
1. **Local** - Your computer
2. **GitHub** - Full git history
3. **Netlify** - Deployment history

Even if you delete something, you can recover from:
- Git history: `git log` → `git checkout`
- Netlify: Deploys tab → Publish old deploy

---

## Working with Claude: Advanced Patterns

### Pattern 1: Iterative Refinement

```
You: "Add a contact form to the Contact tab"

Claude: [Provides code]

You: "Make the form full-width on mobile"

Claude: [Updates code]

You: "Add client-side validation"

Claude: [Adds validation]

You: "Connect to Netlify Forms for submissions"

Claude: [Implements Netlify Forms]
```

### Pattern 2: Explain Then Do

```
You: "I want to add a blog section. 
Explain the best approach for a static site."

Claude: [Explains options]

You: "Let's go with approach #2. 
Implement it with 3 sample posts."

Claude: [Implements]
```

### Pattern 3: Review and Critique

```
You: "Review this code for:
- Accessibility issues
- Performance problems
- Mobile responsiveness
- Best practices"

Claude: [Provides analysis + suggestions]

You: "Fix all the issues you found"

Claude: [Provides fixed code]
```

### Pattern 4: Generate Variations

```
You: "Show me 3 different color scheme options 
for my CV site. Just CSS changes."

Claude: [Shows 3 variations]

You: "I like #2. Apply it and make the 
gradients more subtle."

Claude: [Applies with refinement]
```

---

## Troubleshooting

### Issue: Push Rejected

```bash
git push
# error: failed to push some refs
```

**Solution:**
```bash
# Pull latest changes first
git pull --rebase

# Resolve any conflicts if needed
# Then push
git push
```

### Issue: Netlify Build Failed

**Check build logs:**
1. Go to Netlify dashboard
2. Click failed deployment
3. Read build log
4. Fix issue in code
5. Push again

**Common causes:**
- Syntax error in HTML
- Missing file referenced
- Invalid netlify.toml

### Issue: Changes Not Showing

**Clear cache:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or open in incognito/private mode

**Check Netlify:**
- Verify deploy succeeded
- Check deploy time matches your push time

### Issue: Merge Conflict

```bash
git pull
# CONFLICT in index.html
```

**Solution:**
```bash
# Open index.html
# Look for conflict markers:
# <<<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>> branch-name

# Edit file to resolve
# Remove conflict markers
# Keep what you want

# Stage resolved file
git add index.html

# Complete merge
git commit -m "Merge: Resolved conflicts"

# Push
git push
```

### Issue: Wrong Content Deployed

**Rollback on Netlify:**
1. Go to Netlify → Deploys
2. Find good deployment
3. Click "Publish deploy"

**Or revert in Git:**
```bash
# Find commit to revert to
git log

# Revert to specific commit
git revert COMMIT_HASH

# Or reset (dangerous - rewrites history)
git reset --hard COMMIT_HASH
git push --force
```

---

## GitHub Actions (Optional Advanced)

For automated testing/checks on every push:

### Create `.github/workflows/deploy.yml`

```yaml
name: Validate and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate HTML
        run: |
          echo "Checking index.html exists"
          test -f index.html
          echo "✅ HTML file exists"
      
      - name: Check for TODOs
        run: |
          if grep -r "TODO" index.html; then
            echo "⚠️ Found TODOs in code"
            exit 1
          fi
          echo "✅ No TODOs found"
      
      - name: Success
        run: echo "🎉 All checks passed!"
```

This runs checks on every push before Netlify deploys.

---

## Quick Reference

### Common Git Commands

```bash
# Check status
git status

# View changes
git diff

# Stage files
git add index.html
git add .  # Add all changes

# Commit
git commit -m "Your message"

# Push to GitHub
git push

# Pull from GitHub
git pull

# Create branch
git checkout -b branch-name

# Switch branch
git checkout main

# View history
git log
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo changes to file
git checkout -- index.html
```

### Netlify Status

Check deployment at:
```
https://app.netlify.com/sites/YOUR_SITE/deploys
```

### Working with Claude

**Fast iteration:**
1. Ask Claude for change
2. Copy code to index.html
3. Test in browser
4. If good: commit + push
5. If bad: ask Claude to fix
6. Repeat

**Quality workflow:**
1. Plan changes with Claude
2. Implement in branch
3. Test thoroughly
4. Create PR on GitHub
5. Review with Claude
6. Merge to main
7. Auto-deploys!

---

## Summary

### Development Flow

1. **Plan** - Decide what to change
2. **Ask Claude** - Get implementation
3. **Test Local** - Verify it works
4. **Commit** - `git commit -m "Clear message"`
5. **Push** - `git push`
6. **Auto-Deploy** - Netlify deploys in 30s
7. **Verify** - Check live site

### Key Commands

```bash
# Development cycle
git pull                           # Start with latest
# ... make changes with Claude ...
bunx serve .                       # Test locally
git add index.html                 # Stage changes
git commit -m "Update: X"          # Commit
git push                           # Deploy
```

### Files to Edit

- **index.html** - Your CV content (90% of changes)
- **README.md** - Repository documentation
- **netlify.toml** - Deployment config (rarely change)

### Never Edit Directly on GitHub

Always edit locally, then push:
- Better testing
- Git history
- Easier rollback
- Can work with Claude

---

## Resources

- **Git Basics**: https://git-scm.com/book/en/v2
- **GitHub Docs**: https://docs.github.com
- **Netlify Docs**: https://docs.netlify.com
- **Claude**: https://claude.ai
- **Markdown Guide**: https://www.markdownguide.org

---

## Need Help?

### Working with Claude

Just ask naturally:
- "How do I add X to my CV?"
- "This isn't working, can you fix it?"
- "Show me 3 ways to improve Y"
- "Explain this code to me"

### Git Problems

```bash
# When stuck, ask Claude:
"I'm getting this Git error: [paste error]
What does it mean and how do I fix it?"
```

### Deployment Issues

```bash
# Share Netlify build log with Claude:
"My Netlify deployment failed. Here's the log: [paste log]
What's wrong?"
```

---

**Happy coding! 🚀**

*This workflow combines the power of Claude for development, Git for version control, GitHub for storage, and Netlify for deployment - giving you a professional, automated pipeline for your CV website.*
