# Quick Reference Guide

Fast reference for common operations and code patterns.

---

## File Locations

| What | Where |
|------|-------|
| Main development file | `public/index.html` |
| CV data source | `docs/farshid_pourlatifi_cv.json` |
| Figma designs | `docs/figma/css/*.md` |
| Background SVG | `docs/figma/svg/bg.svg` |
| Deploy config | `netlify.toml` |

---

## Development Commands

```bash
# Local server
bunx serve public/

# Git workflow
git add public/
git commit -m "Update: description"
git push

# View in browser
open http://localhost:3000
```

---

## Breakpoint

```css
/* Mobile */
@media (max-width: 768px) { }

/* Desktop (default) */
```

---

## Adding Experience

```javascript
const experiences = [
    {
        company: 'Company Name',
        location: 'City, Country',
        role: 'Job Title',
        type: 'Remote, Full-Time',
        startMonth: 'Jan',
        startYear: '2025',
        endMonth: 'Present',
        endYear: undefined,  // Optional
        achievements: [
            'Achievement 1',
            'Achievement 2',
            'Achievement 3'
        ],
        technologies: ['React', 'TypeScript', 'Node.js']
    },
    // ... existing experiences
];
```

---

## Adding Skills

```javascript
const skills = {
    frontend: [
        'New Skill',
        'React',
        // ... existing skills
    ],
    backend: [
        'New Skill',
        'Node.js',
        // ... existing skills
    ]
};
```

---

## Color Palette

```css
Background:     #0A3A52
Primary Accent: #3E9FD4
Secondary:      #006BA5
Dark Blue:      #004B72
Accent Red:     #F0000F
White:          #FFFFFF
Red Lines:      #E00514
```

---

## Common Selectors

| Element | Desktop | Mobile |
|---------|---------|--------|
| Navigation | `.nav` (visible) | Hidden |
| Social Links | `.social-links` bottom-right | Fixed bottom-center |
| Page Title | `.page-title` (70px) | Hidden (use sticky-title) |
| Sticky Titles | Hidden | `.sticky-title-top/bottom` |
| Experience | `.carousel-wrapper` | Vertical list |
| Pagination | `.pagination` (visible) | Hidden |

---

## Layout Patterns

### Desktop Centering

```jsx
{/* Absolute centering (Home) */}
<div className="content-centered">
    {/* Content */}
</div>

{/* Flexbox centering (Skills/Experience) */}
<div className="page-wrapper">
    <div className="page-title">Title</div>
    <div className="content">
        {/* Content */}
    </div>
</div>
```

### Mobile Sections

```jsx
<div id="section-id" className={activePage === 'page' ? '' : 'hidden'}>
    {/* Background */}
    <div className="sticky-title-top">Section Name</div>

    {/* Content */}

    <div className="sticky-title-bottom" onClick={() => scrollToSection('next-section')}>
        Next Section
    </div>
</div>
```

---

## Animation Classes

```css
.shape-1 { animation: float 6s ease-in-out infinite; }
.shape-2 { animation: floatSlow 8s ease-in-out infinite; }
.shape-3 { animation: floatReverse 7s ease-in-out infinite; }
```

---

## Scroll to Section (Mobile)

```javascript
const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
```

---

## CSS Media Query Template

```css
/* Desktop default */
.element {
    /* Desktop styles */
}

/* Mobile overrides */
@media (max-width: 768px) {
    .element {
        /* Mobile styles */
    }
}
```

---

## Common CSS Patterns

### Sticky Positioning

```css
.sticky-element {
    position: sticky;
    top: 0;        /* or bottom: 0 */
    z-index: 200;
    background: #0A3A52;
}
```

### Flexbox Column

```css
.container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.header {
    flex-shrink: 0;  /* Don't shrink */
}

.content {
    flex: 1;  /* Take remaining space */
}

.footer {
    flex-shrink: 0;
}
```

### Absolute Centering

```css
.centered {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```

---

## Testing Checklist

### Desktop
```bash
# In DevTools
# Width: 1366px or wider
# Check: Navigation, Carousel, Pagination
```

### Mobile
```bash
# In DevTools Device Toolbar
# Width: 375px (iPhone) or 390px (standard)
# Check: Vertical scroll, Sticky titles, All experiences
```

---

## Git Commit Prefixes

```bash
Add:       # New features/content
Update:    # Modify existing
Fix:       # Bug fixes
Refactor:  # Code reorganization
Style:     # Visual/CSS changes
Docs:      # Documentation

# Examples
git commit -m "Update: Added NewCo experience"
git commit -m "Fix: Mobile sticky title positioning"
git commit -m "Add: JSON-LD structured data"
```

---

## Debugging Commands

```javascript
// Check if mobile
window.innerWidth <= 768

// Check section visibility
document.getElementById('home-section').style.display

// Force scroll to section
document.getElementById('skills-section').scrollIntoView()

// Check React state (in console)
// Add to component: window.debug = { activePage, experienceIndex }
window.debug
```

---

## Common Issues & Fixes

### Section not showing on mobile?
```css
/* Ensure these are set */
@media (max-width: 768px) {
    .hidden { display: block !important; }
    #section-id { min-height: 100vh; }
}
```

### Sticky title not working?
```css
/* Check parent has scroll */
.page-wrapper {
    overflow-y: auto;  /* or visible */
}

/* Check sticky element */
.sticky-title {
    position: sticky;
    top: 0;  /* or bottom: 0 */
    z-index: 200;
}
```

### Carousel not working?
```javascript
// Check transform on carousel-track
style={{ transform: `translateX(-${experienceIndex * 100}%)` }}

// Check experienceIndex state
console.log(experienceIndex)
```

---

## Performance Tips

```html
<!-- Add defer to scripts -->
<script defer src="..."></script>

<!-- Lazy load shapes (TODO) -->
<!-- Reduce shape count (TODO) -->

<!-- Use will-change sparingly -->
<style>
.animated-shape {
    will-change: transform;
}
</style>
```

---

## Useful URLs

- **Local:** http://localhost:3000
- **Live:** https://farshid-pourlatifi.netlify.app/
- **Netlify Dashboard:** https://app.netlify.com
- **GitHub Repo:** (your repo URL)

---

## Next Steps (TODO)

- [ ] Add `defer` to script tags (performance)
- [ ] Reduce SVG shapes to 20-25 (performance)
- [ ] Add JSON-LD structured data (SEO)
- [ ] Add Open Graph tags (SEO)
- [ ] Generate and add CV PDF
- [ ] Test on real mobile devices
- [ ] Add analytics (optional)

---

**Need detailed info?** See [DEVELOPMENT_CONTEXT.md](DEVELOPMENT_CONTEXT.md)
