# Mobile-First Design Documentation

## Overview

This CV website follows a **mobile-first approach**, meaning all base styles and functionality are optimized for mobile devices, with progressive enhancement for larger screens using media queries and conditional JavaScript.

**Breakpoint**: `768px` (min-width for desktop styles)

---

## Design Philosophy

### Mobile Experience
- **Scrolling Navigation**: All sections visible, user scrolls through content naturally
- **Simplified Layout**: Single-column layouts, stacked components
- **Touch-Friendly**: Larger tap targets, centered bottom navigation
- **No Complex Interactions**: Carousels and tab switching disabled

### Desktop Experience
- **Tab Navigation**: URL-based routing between sections (`/`, `/skills`, `/experience`)
- **Single Section View**: Only active section visible at a time
- **Complex Layouts**: Multi-column grids, advanced positioning
- **Interactive Elements**: Carousels, pagination, hover effects

---

## Component Breakdown

### 1. Social Links (`/src/components/Footer/SocialLinks.astro`)

**Purpose**: Display LinkedIn and CV download links

**Mobile Behavior**:
```css
.social-footer {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);  /* Centered */
}
```
- Links: LinkedIn, CV Download only
- Position: Fixed at bottom-center
- Size: 36px × 36px
- Gap: Small spacing

**Desktop Behavior** (`@media (min-width: 768px)`):
```css
.social-footer {
  bottom: 40px;
  right: 40px;
  left: auto;
  transform: none;  /* Bottom-right corner */
}
```
- Same links
- Position: Fixed at bottom-right
- Size: 40px × 40px
- Gap: Larger spacing

**Key Features**:
- Pulse animation on CV download button
- Hover effects (scale, color change)
- Backdrop blur for glassmorphism effect

---

### 2. Navigation (`/src/components/Navigation/TabNav.astro`)

**Purpose**: Tab-based navigation for desktop, hidden on mobile

**Mobile Behavior**:
```css
.tab-nav {
  display: none;  /* Completely hidden */
}
```
- No tab navigation
- Users scroll through all sections
- No JavaScript execution

**Desktop Behavior** (`@media (min-width: 768px)`):
```css
.tab-nav {
  display: block;
  position: fixed;
  top: 95px;
  left: 0;
}
```
- Visible at top of viewport
- Exact Figma positioning:
  - Home: `left: 103px`
  - Skills: `left: 210px`
  - Experience: `left: 316px`
- Active tab underline animation
- URL routing enabled

**JavaScript Behavior**:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const isDesktop = window.innerWidth >= 768;
  if (!isDesktop) return;  // Skip on mobile

  // Desktop-only tab switching logic
});
```

**URL Routing**:
- Home: `/` (root)
- Skills: `/skills`
- Experience: `/experience`
- Browser back/forward support
- Direct URL access support

---

### 3. Page Layout (`/src/pages/index.astro`, `skills.astro`, `experience.astro`)

**Purpose**: Container for all sections with responsive display logic

**Mobile Behavior**:
```css
.page-section {
  min-height: 100vh;
  display: flex;  /* All sections visible */
  padding: 60px 20px 80px;
}
```
- All sections rendered
- Natural scrolling flow
- Padding for header/footer clearance
- Full viewport height sections

**Desktop Behavior** (`@media (min-width: 768px)`):
```css
.page-section {
  display: none;      /* Hidden by default */
  padding: 0;
}

.page-section.active {
  display: flex;      /* Only active section visible */
}
```
- Tab-controlled visibility
- Single section view
- No padding (full-screen sections)

**Skills Section Overlay**:
```css
[data-page-section="skills"]::after {
  content: '';
  background: rgba(10, 58, 82, 0.7);  /* Dark overlay */
  z-index: 1;
}
```
- Applied on both mobile and desktop
- Creates visual hierarchy
- Content positioned above overlay (`z-index: 2`)

---

### 4. Skills Section (`/src/components/Sections/Skills.astro`)

**Purpose**: Display frontend and backend skills

**Mobile Behavior**:
```css
.skills-columns {
  grid-template-columns: 1fr;  /* Single column */
  gap: var(--space-6);
}

.backend-column,
.frontend-column {
  text-align: left;  /* All left-aligned */
}
```
- Skills stacked vertically
- Back-End skills first, then Front-End
- All text left-aligned
- Smaller font sizes

**Desktop Behavior** (`@media (min-width: 768px)`):
```css
.skills-columns {
  grid-template-columns: 1fr 1fr;  /* Two columns */
  gap: var(--space-10);
}

.backend-column {
  text-align: right;  /* Right-aligned */
}

.frontend-column {
  text-align: left;   /* Left-aligned */
}
```
- Two-column grid layout
- Back-End column (left): right-aligned text
- Front-End column (right): left-aligned text
- Exact Figma spacing
- Larger font sizes

**Layout Structure**:
```
Mobile:
┌─────────────────┐
│   Back-End      │
│   - Node.js     │
│   - Python      │
├─────────────────┤
│   Front-End     │
│   - React       │
│   - TypeScript  │
└─────────────────┘

Desktop:
┌─────────┬─────────┐
│Back-End │Front-End│
│         │         │
│Node.js →│← React  │
│Python  →│← TS     │
└─────────┴─────────┘
```

---

### 5. Experience Section (`/src/components/Sections/Experience.astro`)

**Purpose**: Display work experience positions

**Mobile Behavior**:
```css
.experience-carousel {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.experience-item {
  display: block;  /* All items visible */
}

.pagination {
  display: none;   /* No pagination */
}
```
- All positions visible
- Stacked vertically with spacing
- No carousel functionality
- No pagination dots
- JavaScript disabled

**Desktop Behavior** (`@media (min-width: 768px)`):
```css
.experience-carousel {
  gap: 0;
}

.experience-item {
  display: none;  /* Hidden by default */
}

.experience-item[data-experience-index="0"] {
  display: block;  /* Show first item */
}

.pagination {
  display: flex;  /* Show pagination */
}
```
- Carousel mode: one position at a time
- First position visible by default
- Pagination dots for navigation
- JavaScript-controlled switching

**JavaScript Behavior**:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  const isDesktop = window.innerWidth >= 768;
  if (!isDesktop) return;  // Skip on mobile

  // Desktop-only pagination logic
});
```

**Content Layout**:
```css
.experience-content {
  display: grid;
  grid-template-columns: auto 1fr 2fr;  /* Date | Company | Skills */
}

@media (max-width: 767px) {
  .experience-content {
    grid-template-columns: 1fr;  /* Stacked */
  }
}
```

---

## CSS Architecture

### Mobile-First Pattern

**Base styles** (apply to all screen sizes):
```css
.component {
  /* Mobile styles here */
  display: flex;
  flex-direction: column;
  padding: 20px;
}
```

**Desktop overrides** (`@media (min-width: 768px)`):
```css
@media (min-width: 768px) {
  .component {
    /* Desktop-specific styles */
    flex-direction: row;
    padding: 40px;
  }
}
```

### Why Mobile-First?

1. **Performance**: Mobile devices load minimal CSS first
2. **Progressive Enhancement**: Add complexity for capable devices
3. **Maintainability**: Base styles are simpler
4. **Mobile Priority**: Most users start on mobile

### Anti-Pattern (Desktop-First - DON'T DO THIS):
```css
/* ❌ Desktop-first (avoid) */
.component {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Desktop default */
}

@media (max-width: 767px) {
  .component {
    grid-template-columns: 1fr;    /* Mobile override */
  }
}
```

---

## JavaScript Patterns

### Desktop-Only Execution

**Pattern**:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Check if desktop
  const isDesktop = window.innerWidth >= 768;
  if (!isDesktop) return;  // Exit early on mobile

  // Desktop-only code here
  const tabs = document.querySelectorAll('.nav-tab');
  // ... tab functionality
});
```

**Why This Approach?**:
- Prevents unnecessary JavaScript execution on mobile
- Reduces memory usage
- Improves mobile performance
- Clear separation of concerns

### Examples

**Tab Navigation** (`TabNav.astro`):
```javascript
// Only runs on desktop
if (window.innerWidth < 768) return;

// Desktop tab switching
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Switch sections, update URL
  });
});
```

**Experience Pagination** (`Experience.astro`):
```javascript
// Only runs on desktop
const isDesktop = window.innerWidth >= 768;
if (!isDesktop) return;

// Desktop carousel pagination
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    // Show selected experience
  });
});
```

---

## Responsive Breakpoint

### Single Breakpoint: 768px

**Why 768px?**
- Industry standard tablet/desktop breakpoint
- iPad portrait width
- Clean separation between mobile and desktop experiences

**Usage**:
```css
/* Mobile: < 768px (base styles) */
.component { }

/* Desktop: ≥ 768px */
@media (min-width: 768px) {
  .component { }
}
```

**JavaScript**:
```javascript
const isDesktop = window.innerWidth >= 768;
const isMobile = window.innerWidth < 768;
```

---

## Layout Modes

### Mobile Layout

```
┌─────────────────────┐
│                     │
│   HERO SECTION      │  ← Scrollable
│   (Farshid)         │
│                     │
├─────────────────────┤
│                     │
│   SKILLS            │  ← All visible
│   Back-End          │
│   Front-End         │
│                     │
├─────────────────────┤
│                     │
│   EXPERIENCE        │  ← All positions
│   Position 1        │
│   Position 2        │
│   Position 3        │
│                     │
└─────────────────────┘
│ [LinkedIn] [CV]     │  ← Fixed bottom
└─────────────────────┘
```

### Desktop Layout

```
┌─────────────────────┐
│ [Home] [Skills] [Exp]│  ← Fixed top nav
├─────────────────────┤
│                     │
│                     │
│   ACTIVE SECTION    │  ← Only one visible
│   (Tab-controlled)  │
│                     │
│                     │
└─────────────────────┘
                 [🔗][📄]  ← Fixed bottom-right
```

---

## File Structure

```
src/
├── components/
│   ├── Navigation/
│   │   └── TabNav.astro           # Desktop-only tabs
│   ├── Footer/
│   │   └── SocialLinks.astro      # Mobile: center, Desktop: right
│   └── Sections/
│       ├── Hero.astro             # Same on mobile/desktop
│       ├── Skills.astro           # 1-col mobile, 2-col desktop
│       └── Experience.astro       # List mobile, carousel desktop
├── pages/
│   ├── index.astro                # Home (all sections mobile)
│   ├── skills.astro               # Skills route
│   └── experience.astro           # Experience route
└── layouts/
    ├── BaseLayout.astro           # Base HTML structure
    └── CVLayout.astro             # CV-specific layout
```

---

## Styling Conventions

### Spacing Variables

```css
/* Mobile spacing (base) */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
```

### Typography Scale

```css
/* Mobile-first font sizes */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */

/* Desktop may override specific components */
@media (min-width: 768px) {
  .section-title {
    font-size: 70px;  /* Exact Figma spec */
  }
}
```

### Color System

```css
/* Colors (consistent across devices) */
--color-primary: #0A3A52;           /* Deep blue */
--color-primary-light: #004B72;     /* Blue */
--color-secondary: #3E9FD4;         /* Cyan */
--color-secondary-light: #6ACBFF;   /* Light cyan */
--color-accent: #F0000F;            /* Red */
--color-white: #FFFFFF;             /* White */
```

---

## Testing Guidelines

### Mobile Testing

**Test on**:
- iPhone SE (375px)
- iPhone 12/13 (390px)
- iPhone 14 Pro Max (430px)
- Android phones (360px-420px)

**Check**:
- All sections scroll naturally
- Social links centered at bottom
- No tab navigation visible
- Skills single-column, left-aligned
- All experience positions visible
- Touch targets ≥ 44px × 44px

### Desktop Testing

**Test on**:
- iPad (768px - breakpoint)
- Laptop (1366px - design spec)
- Desktop (1920px+)

**Check**:
- Tab navigation visible at top
- URL changes with tabs (`/`, `/skills`, `/experience`)
- Social links bottom-right
- Skills two-column layout
- Experience carousel with pagination
- Only active section visible

### Cross-Breakpoint

**Test at 767px and 768px**:
- Ensure clean transition
- No layout breaking
- JavaScript switches correctly
- No visual jumps

---

## Common Maintenance Tasks

### Adding a New Section

1. **Create component** (`src/components/Sections/NewSection.astro`)
2. **Add mobile-first styles**:
   ```css
   .new-section {
     /* Mobile styles */
   }

   @media (min-width: 768px) {
     .new-section {
       /* Desktop styles */
     }
   }
   ```

3. **Add to pages**:
   ```astro
   <div data-page-section="new" class="page-section">
     <NewSection />
   </div>
   ```

4. **Add tab** (desktop only):
   ```astro
   <button class="nav-tab" data-section="new">
     New Section
   </button>
   ```

### Adjusting Breakpoint

If you need to change the breakpoint from 768px:

1. **Update CSS** (find all `@media (min-width: 768px)`):
   ```css
   @media (min-width: 1024px) {  /* New breakpoint */
   ```

2. **Update JavaScript**:
   ```javascript
   const isDesktop = window.innerWidth >= 1024;  // New breakpoint
   ```

3. **Update this documentation**

### Adding Mobile-Only Features

1. **CSS** (no media query needed):
   ```css
   .mobile-feature {
     /* Visible by default (mobile) */
   }

   @media (min-width: 768px) {
     .mobile-feature {
       display: none;  /* Hide on desktop */
     }
   }
   ```

2. **JavaScript**:
   ```javascript
   const isMobile = window.innerWidth < 768;
   if (!isMobile) return;  // Only run on mobile
   ```

---

## Performance Considerations

### CSS Loading
- Base (mobile) CSS loads first
- Desktop CSS loads only when needed
- Minimized media query nesting
- Uses CSS custom properties for consistency

### JavaScript Execution
- Mobile avoids unnecessary JavaScript
- Desktop features check screen size before running
- Event listeners only attached when needed
- No polling or intervals on mobile

### Image Optimization
- Same images for mobile/desktop (Paper.js canvas)
- SVG icons scale perfectly
- No separate mobile/desktop asset loading

---

## Accessibility

### Mobile
- Large tap targets (36px minimum)
- Scrolling is native and accessible
- No complex interactions
- Clear visual hierarchy

### Desktop
- Keyboard navigation supported
- Tab states have visual indicators
- ARIA labels on interactive elements
- Focus states for all interactive elements

### Both
- High contrast colors
- Readable font sizes
- Semantic HTML structure
- Skip links available

---

## Browser Support

### Mobile
- iOS Safari 14+
- Chrome Mobile 90+
- Firefox Mobile 90+
- Samsung Internet 14+

### Desktop
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

**Note**: Breakpoint uses `min-width` media query (supported everywhere)

---

## Quick Reference

### Mobile Defaults
```css
/* Navigation */ display: none
/* Social Links */ bottom-center, 36px
/* All Sections */ display: flex (visible)
/* Skills */ 1 column, left-aligned
/* Experience */ All visible, stacked
/* Pagination */ display: none
```

### Desktop Overrides (`@media (min-width: 768px)`)
```css
/* Navigation */ display: block, top fixed
/* Social Links */ bottom-right, 40px
/* Active Section */ display: flex
/* Inactive Sections */ display: none
/* Skills */ 2 columns, mixed alignment
/* Experience */ First visible only
/* Pagination */ display: flex
```

---

## Related Documentation

- [Geometric Philosophy](./geometric-philosophy.md) - Background animation system
- [Figma Design](./figma/) - Original design specifications
- [CLAUDE.md](../CLAUDE.md) - Development and deployment guide

---

**Last Updated**: 2025-10-26
**Author**: Claude (AI Assistant)
**Version**: 1.0
