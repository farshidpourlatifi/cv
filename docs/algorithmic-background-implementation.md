# Algorithmic Background Implementation

## Overview
Created a new generative art system to replace the static SVG background with a dynamic, algorithmic approach using p5.js.

## Approach

### Philosophy: Geometric Constellation
- **Concept**: Professional identity as a constellation of experiences and skills
- **Visual Language**: Geometric primitives (circles, rectangles, triangles) representing different professional aspects
- **Movement**: Organic drift patterns using Perlin noise fields
- **Responsiveness**: Different behaviors for mobile vs desktop

### Key Design Decisions

#### Shape System
- **Circles**: Soft skills, completeness
- **Rectangles**: Technical competencies, structure
- **Triangles**: Future aspirations, directionality
- **Distribution**: Fibonacci spiral for initial placement
- **Physics**: Mass-based drift speeds, gravitational interactions

#### Color Palette (from original design)
```
Background: #0A3A52 (dark blue)
Primary Blues: #004B72, #006BA5, #3E9FD4
Accent Red: #F0000F
Highlight: #FFFFFF
```

#### Animation Behaviors
- **Desktop**: Expansive movements, larger clusters, complex interactions
- **Mobile**: Focused movements, tighter clustering, optimized for readability
- **Breathing**: Subtle scale oscillations using sine waves
- **Rotation**: Inverse relationship with size
- **Collisions**: Gentle repulsion forces maintaining spacing

### Technical Implementation

#### Core Algorithm Components
1. **Particle System**: Each shape as an independent entity with physics
2. **Noise Fields**: Multi-octave Perlin noise for organic movement
3. **Force System**: Gravitational attraction/repulsion between shapes
4. **Responsive Logic**: Canvas size detection for mobile/desktop modes
5. **Seeded Randomness**: Reproducible patterns using seed values

#### Performance Optimizations
- Quadtree spatial indexing for collision detection
- Object pooling for shape creation/destruction
- Frame rate adaptive quality settings
- Canvas size constraints for mobile devices

### Integration Plan

#### HTML Structure
```html
<div class="algorithmic-bg"></div>
<script src="p5.min.js"></script>
<script src="geometric-constellation.js"></script>
```

#### CSS Layering
- Background canvas at z-index: 1
- Content layers above at higher z-indices
- Pointer-events: none on background to maintain interactivity

#### Mobile Adaptations
- Reduced particle count (30 shapes mobile vs 52 desktop)
- Simplified collision detection
- Lower frame rate target (30fps vs 60fps)
- Tighter movement bounds

### Benefits Over Static SVG

1. **Dynamic**: Every page load creates unique variations
2. **Performant**: GPU-accelerated canvas rendering
3. **Responsive**: True adaptive behavior, not just scaling
4. **Maintainable**: Parameters can be tweaked without editing SVG paths
5. **Interactive Potential**: Can respond to user actions if needed

### Parameters for Customization

```javascript
params = {
  seed: 12345,           // Reproducible randomness
  shapeCount: 52,        // Number of shapes
  driftSpeed: 0.5,       // Movement speed
  noiseScale: 0.005,     // Smoothness of movement
  breathingRate: 0.02,   // Scale oscillation speed
  colorMix: 0.7,         // Blue to accent ratio
  mobileThreshold: 768,  // Breakpoint for mobile mode
}
```

### Files Created
- `geometric-constellation-philosophy.md` - The algorithmic philosophy document
- `geometric-constellation.html` - Interactive viewer implementation (to be created)
- This documentation file

### Next Steps
1. Complete the p5.js implementation
2. Test on various devices for performance
3. Integrate into the main CV website
4. Add parameter controls for live customization