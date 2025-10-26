# Development Context & Memory

**Last Updated:** 2025-10-23
**Project:** Online CV Website - Farshid Pourlatifi

## Project Overview

Single-page CV website built with React 18 (CDN), no build tools. Fully responsive with separate mobile/desktop experiences.

**Live Site:** https://farshid-pourlatifi.netlify.app/
**Local Dev:** http://localhost:3000 (via `bunx serve public/`)

---

## File Structure

```
online-cv/
├── public/                    # DEPLOYMENT FOLDER (Netlify serves this)
│   └── index.html            # Main file - ALL development happens here
├── docs/                     # PRIVATE - Not deployed
│   ├── farshid_pourlatifi_cv.json    # Source of truth for CV data
│   ├── figma/               # Figma design exports
│   │   ├── css/
│   │   │   ├── home-desktop.md
│   │   │   ├── home-mobile.md
│   │   │   └── experience-desktop.md
│   │   └── svg/
│   │       ├── bg.svg       # Desktop background (52 shapes)
│   │       └── pages/
│   │           └── home-mobile.svg
│   ├── shape-inventory.md   # Complete list of 52 SVG shapes
│   └── DEVELOPMENT_CONTEXT.md  # This file
├── netlify.toml             # Deploy config: publish = "public"
├── .gitignore               # Does NOT ignore public/ folder
└── README.md
```

---

## Deployment Architecture

### Why public/ folder?

**Problem:** Originally `netlify.toml` had `publish = "."` which would expose all docs, JSON, and markdown files publicly.

**Solution:** Separate deployment directory
- Development file: `public/index.html`
- Only `public/` contents are deployed
- `docs/` folder stays private
- Single source of truth: edit `public/index.html` directly

### Deployment Commands

```bash
# Local development
bunx serve public/

# Deploy
git add public/ netlify.toml
git commit -m "Update: description"
git push
# Netlify auto-deploys in ~30s
```

### Important Files

1. **public/index.html** - The ONLY file you edit (90% of work)
2. **docs/farshid_pourlatifi_cv.json** - CV data source (achievements, technologies)
3. **netlify.toml** - Deploy config (DO NOT change `publish = "public"`)
4. **docs/figma/** - Design references (read-only)

---

## Architecture

### Tech Stack

- **React 18** - Via CDN (production build)
- **Babel Standalone** - JSX transformation
- **No build tools** - Direct browser execution
- **Single HTML file** - All CSS/JS inline

### Component Structure

```javascript
const CVWebsite = () => {
    const [activePage, setActivePage] = useState('home');        // Desktop: which tab
    const [experienceIndex, setExperienceIndex] = useState(0);   // Desktop: carousel

    return (
        <div className="container">
            {/* Desktop: absolute positioned navigation */}
            <div className="nav">...</div>

            {/* Fixed social links (desktop: bottom-right, mobile: bottom-center) */}
            <div className="social-links">...</div>

            {/* Three sections */}
            <div id="home-section">...</div>
            <div id="skills-section">...</div>
            <div id="experience-section">...</div>
        </div>
    );
};
```

---

## Desktop vs Mobile Layouts

### Desktop (>768px)

**Behavior:**
- Tab-based navigation (Home, Skills, Experience)
- Only 1 section visible at a time (`.hidden` class)
- Fixed viewport (100vw × 100vh, no scroll)
- Experience carousel with numbered pagination

**Layout:**
- Navigation: top-left (absolute positioned)
- Social links: bottom-right (absolute positioned)
- Content: centered with flexbox or absolute positioning
- Background: 52 animated SVG shapes from `bg.svg`

**Key Classes:**
- `.nav` - Top left navigation
- `.social-links` - Bottom right (right: 103px, bottom: 35px)
- `.content-centered` - Home page (absolute: 50%, 50%, transform)
- `.page-wrapper` - Skills/Experience flexbox container
- `.carousel-wrapper` - Experience carousel
- `.pagination` - Bottom center numbered dots

### Mobile (≤768px)

**Behavior:**
- Vertical continuous scroll (no tabs)
- ALL sections visible simultaneously
- `.hidden` class overridden to `display: block !important`
- Each section `min-height: 100vh`
- All 6 experiences listed vertically (no carousel)

**Layout:**
```
┌─────────────────────────┐
│  HOME SECTION           │
│  ├─ Background shapes   │
│  ├─ Name & title        │
│  └─ [Skills] sticky ↓   │ ← Click to scroll
├─────────────────────────┤
│  SKILLS SECTION         │
│  ├─ [Skills] sticky ↑   │
│  ├─ Frontend/Backend    │
│  └─ [Experience] ↓      │ ← Click to scroll
├─────────────────────────┤
│  EXPERIENCE SECTION     │
│  ├─ [Experience] ↑      │
│  ├─ Younea (full)       │
│  ├─ Dextern (full)      │
│  ├─ Cellusys (full)     │
│  ├─ ... (all 6)         │
│  └─ End                 │
└─────────────────────────┘
     [LinkedIn CV] ← Fixed bottom center
```

**Sticky Navigation System:**

1. **Home Section:**
   - Sticky bottom: "Skills" → scrolls to #skills-section

2. **Skills Section:**
   - Sticky top: "Skills"
   - Sticky bottom: "Experience" → scrolls to #experience-section

3. **Experience Section:**
   - Sticky top: "Experience"
   - No bottom (last section)

**Mobile-Specific CSS:**

```css
@media (max-width: 768px) {
    /* Force all sections visible */
    .hidden {
        display: block !important;
    }

    /* Each section full viewport height */
    #home-section,
    #skills-section,
    #experience-section {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    /* Show sticky titles */
    .sticky-title-top,
    .sticky-title-bottom {
        display: block;
    }

    /* Hide desktop elements */
    .nav { display: none; }
    .pagination { display: none; }
    .page-title { display: none; }

    /* Stack experiences vertically */
    .carousel-track {
        display: flex;
        flex-direction: column !important;
        transform: none !important;
        gap: 40px;
    }

    .carousel-item {
        width: 100% !important;
        flex-direction: column;
    }
}
```

---

## Background Shapes

### Desktop: 52 Shapes from bg.svg

**Source:** `docs/figma/svg/bg.svg`
**Inventory:** `docs/shape-inventory.md`

**Shapes include:**
- Polygons (rotated, various sizes)
- Circles (stroke-only, various colors)
- Rectangles (rounded, rotated)
- Lines (stroke-linecap: round)

**Colors:**
- `#004B72` - Dark blue (primary shapes)
- `#006BA5` - Medium blue
- `#3E9FD4` - Light blue (accent)
- `#F0000F` - Red (accent)
- `#FFFFFF` - White
- `#E00514` - Red lines

**Animations:**
```css
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}

@keyframes floatSlow {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-15px) translateX(10px); }
}

@keyframes floatReverse {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(15px) translateX(-10px); }
}
```

**Applied via:**
```css
.shape-1 { animation: float 6s ease-in-out infinite; }
.shape-2 { animation: floatSlow 8s ease-in-out infinite; }
.shape-3 { animation: floatReverse 7s ease-in-out infinite; }
```

### Mobile: Simplified Shapes

**Source:** `docs/figma/svg/pages/home-mobile.svg`
**Implementation:** Currently using desktop shapes with `.shapes-blurred { opacity: 0.3; }`
**TODO:** Could replace with mobile-specific simplified shapes

---

## CSS Architecture

### Layout System

**Desktop:**
- Absolute positioning for nav, social, pagination
- Flexbox for content centering (Skills/Experience)
- Absolute centering for Home (to stay on SVG center)

**Mobile:**
- Vertical flexbox column
- Sticky positioning for section titles
- Fixed positioning for social links

### Key Measurements

**Desktop:**
- Container: 100vw × 100vh, min-width: 1200px, min-height: 600px
- Nav: top: 95px, left: 103px
- Social: right: 103px, bottom: 35px
- Page wrapper: top: 150px, bottom: 150px

**Mobile:**
- No min-width constraint
- Sections: min-height: 100vh
- Social: bottom: 20px, centered, fixed
- Padding: 60px 20px 80px

### Color Palette

```css
--background: #0A3A52;       /* Dark blue background */
--primary: #3E9FD4;          /* Light blue (accent text) */
--secondary: #006BA5;        /* Medium blue */
--dark-blue: #004B72;        /* Dark blue (shapes) */
--accent-red: #F0000F;       /* Red (CV icon, accents) */
--white: #FFFFFF;
```

### Typography

```css
font-family: 'Inter', sans-serif;

/* Desktop */
.name-first: 70px / 85px, weight: 600
.name-last: 60px / 73px, weight: 600
.job-title: 25px / 30px, weight: 600, color: #3E9FD4
.page-title: 70px / 85px, weight: 600, color: #3E9FD4
.nav-link: 20px, weight: 600

/* Mobile */
.name-first: 60px
.name-last: 50px
.job-title: 20px
.sticky-title: 20px, weight: 600
```

---

## Data Structure

### Experience Object

```javascript
{
    company: 'Younea S.à r.l.',
    location: 'Luxembourg',
    role: 'Senior Web Developer',
    type: 'Remote, Full-Time',
    startMonth: 'Jan',
    startYear: '2024',
    endMonth: 'Present',
    endYear: undefined,  // Optional
    achievements: [      // Array of bullet points
        'Achievement 1...',
        'Achievement 2...'
    ],
    technologies: [      // Array joined with ' · '
        'React', 'TypeScript', 'Redux', ...
    ]
}
```

### Source: docs/farshid_pourlatifi_cv.json

**Complete CV data including:**
- `personal_info`
- `professional_summary`
- `core_competencies`
- `professional_experience` ← Used for experiences array
- `technical_skills`
- `education`
- `languages`
- `key_achievements`
- `metadata`

---

## Important Conventions

### 1. CSS Class Naming

- Component classes: `.component-name`
- State classes: `.active`, `.hidden`
- Layout classes: `.container`, `.content`, `.page-wrapper`
- Utility: `.sticky-title-top`, `.sticky-title-bottom`

### 2. Desktop/Mobile Detection

**Media query breakpoint: 768px**

```css
/* Desktop styles (default) */
.element { ... }

/* Mobile overrides */
@media (max-width: 768px) {
    .element { ... }
}
```

### 3. Visibility Control

**Desktop:**
```javascript
className={activePage === 'home' ? '' : 'hidden'}
```

**Mobile:**
```css
.hidden { display: block !important; }  /* Override */
```

### 4. Scroll Handling

**Desktop:** No scroll (fixed viewport)

**Mobile:**
```javascript
const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
```

---

## Common Tasks

### Adding New Experience

1. Update `docs/farshid_pourlatifi_cv.json` (source of truth)
2. Add to `experiences` array in `public/index.html`:

```javascript
{
    company: 'Company Name',
    location: 'City, Country',
    role: 'Job Title',
    type: 'Remote, Full-Time',
    startMonth: 'Jan',
    startYear: '2025',
    endMonth: 'Present',
    achievements: [
        'Achievement 1',
        'Achievement 2'
    ],
    technologies: ['Tech1', 'Tech2']
}
```

3. Test desktop carousel and mobile list

### Updating Skills

Edit `skills` object in `public/index.html`:

```javascript
const skills = {
    frontend: ['Skill1', 'Skill2', ...],
    backend: ['Skill1', 'Skill2', ...]
};
```

### Changing Colors

Find and replace color values:
- Background: `#0A3A52`
- Accent: `#3E9FD4`
- Shapes: `#004B72`, `#006BA5`
- Red: `#F0000F`

### Adding Background Shapes

1. Add SVG path to `renderShapes()` function
2. Wrap in `<g>` with animation class
3. Test on both desktop and mobile

---

## Known Issues & Decisions

### 1. Why Single File?

**Decision:** Keep everything in `public/index.html`
**Reason:** No build tools, simplicity, easy deployment
**Tradeoff:** Large file (~1200 lines), but acceptable for single-page app

### 2. Why Not Hide Sticky Titles with .hidden?

**Problem:** Sticky titles need to exist in DOM for positioning
**Solution:** Hide via CSS `display: none` on desktop, show on mobile
**Implementation:**
```css
.sticky-title-top,
.sticky-title-bottom {
    display: none;  /* Desktop */
}

@media (max-width: 768px) {
    .sticky-title-top,
    .sticky-title-bottom {
        display: block;  /* Mobile */
    }
}
```

### 3. Why Duplicate Page Title?

**Desktop:** Large centered `.page-title` (70px)
**Mobile:** Hidden, replaced by `.sticky-title-top` (20px)

**Reason:** Different UX needs - desktop has space for large titles, mobile needs compact sticky navigation

### 4. Social Links Positioning

**Desktop:** Absolute (right: 103px, bottom: 35px)
**Mobile:** Fixed (bottom: 20px, centered)

**Why different?** Desktop layout is fixed viewport, mobile scrolls - fixed ensures always visible

### 5. Experience Display

**Desktop:** Carousel (1 at a time, pagination)
**Why?** Limited horizontal space, clean focused view

**Mobile:** Vertical list (all 6 visible)
**Why?** Vertical scroll is natural, no need for pagination

---

## Performance Notes

### Lighthouse Scores (as of 2025-10-23)

- **Performance:** 63 (needs improvement)
- **Accessibility:** 89 (good)
- **Best Practices:** 93 (excellent)
- **SEO:** 82 (good)

### Main Performance Issues

1. **Render-blocking scripts:**
   - React 18 CDN
   - ReactDOM CDN
   - Babel Standalone
   - **Fix:** Add `defer` attribute (TODO)

2. **Heavy DOM:**
   - 52 SVG shapes with animations
   - **Fix:** Reduce to ~20 shapes or lazy load (TODO)

3. **Animations:**
   - Multiple CSS keyframe animations
   - **Fix:** Use `will-change` sparingly, disable on mobile (TODO)

### SEO Improvements (TODO)

- Add JSON-LD structured data (Person schema)
- Add Open Graph tags
- Use semantic HTML (`<h1>`, `<h2>` instead of styled divs)

---

## Git Workflow

### Commit Messages

Use prefixes:
- `Add:` - New features/content
- `Update:` - Modify existing
- `Fix:` - Bug fixes
- `Refactor:` - Code reorganization
- `Style:` - Visual/CSS changes
- `Docs:` - Documentation

**Examples:**
```bash
git commit -m "Update: Added NewCo to experience"
git commit -m "Fix: Mobile sticky titles positioning"
git commit -m "Add: JSON-LD structured data for SEO"
```

### Deployment Flow

```bash
# 1. Make changes to public/index.html
# 2. Test locally
bunx serve public/

# 3. Stage and commit
git add public/
git commit -m "Update: description"

# 4. Push (triggers Netlify deploy)
git push

# 5. Verify at https://farshid-pourlatifi.netlify.app/
```

---

## Testing Checklist

### Desktop (>768px)

- [ ] Tab navigation works (Home/Skills/Experience)
- [ ] Only one section visible at a time
- [ ] Experience carousel with numbered pagination
- [ ] Social links bottom-right
- [ ] Background shapes animate smoothly
- [ ] All shapes visible and positioned correctly
- [ ] No horizontal/vertical scroll

### Mobile (≤768px)

- [ ] All sections visible and stacked vertically
- [ ] Each section min-height: 100vh
- [ ] Smooth vertical scroll through all sections
- [ ] Sticky titles at top/bottom
- [ ] Click sticky titles to jump sections
- [ ] All 6 experiences visible (no carousel)
- [ ] Social links fixed at bottom center
- [ ] Desktop nav hidden
- [ ] Pagination hidden
- [ ] Background shapes simplified/faded

### Cross-Browser

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (WebKit)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Future Enhancements (TODO)

### High Priority

1. **Performance:**
   - Add `defer` to script tags
   - Reduce SVG shapes to 20-25
   - Optimize animations

2. **SEO:**
   - JSON-LD structured data
   - Open Graph tags
   - Semantic HTML headings

3. **Accessibility:**
   - Add `aria-label` to all links
   - Use `<button>` for clickable elements
   - Improve color contrast (WCAG AA)

### Medium Priority

4. **Mobile Background:**
   - Replace with home-mobile.svg shapes
   - Optimize for mobile performance

5. **CV PDF:**
   - Generate and add to `public/`
   - Test download link

6. **Analytics:**
   - Add Google Analytics or Plausible
   - Track page views, section scrolls

### Low Priority

7. **Dark Mode Toggle:**
   - Add switch in nav
   - Store preference in localStorage

8. **Animations:**
   - Add scroll-triggered animations
   - Fade-in sections on mobile

9. **Portfolio Section:**
   - Add projects/case studies
   - Link to GitHub repos

---

## Debugging Tips

### Section Not Showing on Mobile?

Check:
1. `.hidden` override in mobile media query
2. `#section-id` has `min-height: 100vh`
3. `display: flex; flex-direction: column;`

### Sticky Titles Not Working?

Check:
1. `position: sticky`
2. `top: 0` or `bottom: 0`
3. Parent has scrollable overflow
4. `z-index: 200` (above other elements)

### Scroll Not Smooth?

Check:
1. `scrollIntoView({ behavior: 'smooth' })`
2. CSS: `scroll-behavior: smooth;` on html/body
3. Browser support (not all browsers support smooth scroll)

### Shapes Not Animating?

Check:
1. Animation applied to correct class
2. Keyframes defined
3. `will-change: transform` if needed
4. GPU acceleration (use `transform` not `top/left`)

---

## Contact & Resources

**Developer:** Farshid Pourlatifi
**Email:** farshid.pourlatifi@gmail.com
**LinkedIn:** https://linkedin.com/in/farshidpourlatifi
**Website:** https://farshid-pourlatifi.netlify.app/

**Figma Design:** See `docs/figma/` for exports
**CV JSON:** `docs/farshid_pourlatifi_cv.json`

---

## Version History

- **2025-10-23:** Mobile vertical scroll implementation
- **2025-10-23:** Deployment security (public/ folder)
- **2025-10-23:** Experience data structure with achievements arrays
- **2025-10-23:** Background shapes (52 from Figma)
- **2025-10-23:** Initial project setup

---

**Last Session Summary:**

Implemented mobile-first vertical scroll layout with sticky section navigation. All 3 sections (Home, Skills, Experience) now stack vertically on mobile (≤768px) with min-height: 100vh each. Desktop carousel replaced with vertical list showing all 6 experiences. Social links fixed at bottom center on mobile. Sticky titles provide navigation between sections. Desktop layout unchanged (tab-based, carousel, fixed viewport).

**Next Session TODO:**
- Test mobile layout on real devices (iOS/Android)
- Optimize mobile background shapes
- Consider performance improvements (defer scripts, reduce shapes)
- Add CV PDF file to public/ folder
