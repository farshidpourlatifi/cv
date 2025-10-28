# Scroll-Based Curve Morphing - Implementation Plan

## Vision

Instead of discrete pattern changes between sections, **curves morph smoothly** based on scroll position. As you scroll from Home → Skills, the diagonal sine wave gradually transforms into the arc curve.

## User Requirements

1. **Shapes stay in place** during morph, regenerate when they die
2. **25% transition zones**: Morph in last 25% of current section + first 25% of next
3. **All patterns as Bezier**: Convert diagonal/circle to Bezier for easy interpolation
4. **Smart birth/death system**:
   - Birth rate controls spawn probability (0-1)
   - Only regenerate if death position is inside current bandwidth
   - Shapes outside bandwidth die permanently
   - Node count adjusts naturally with bandwidth size

---

## Architecture

### Phase 1: Convert Patterns to Bezier

#### Home (Diagonal Sine Wave) → Bezier
```typescript
home: {
  pattern: 'curve',
  distribution: {
    curveControlPoints: [
      { x: 0.0, y: 1.0 },    // Bottom-left
      { x: 0.25, y: 0.75 },  // Sine wave control
      { x: 0.75, y: 0.25 },  // Sine wave control
      { x: 1.0, y: 0.0 }     // Top-right
    ],
    // Add sine wave modulation
    sineModulation: {
      amplitude: 100,
      frequency: 0.004
    }
  }
}
```

#### Experience (Circle) → Bezier
```typescript
experience: {
  pattern: 'curve',
  distribution: {
    // Approximate circle with 4 Bezier curves (quadrants)
    // Or use single curve for arc section
    curveControlPoints: [
      { x: 0.5, y: 1.0 },    // Bottom center
      { x: 0.2, y: 0.8 },    // Lower left arc
      { x: 0.2, y: 0.2 },    // Upper left arc
      { x: 0.5, y: 0.0 }     // Top center
    ],
    // Flag for closed curve
    closedCurve: true
  }
}
```

---

### Phase 2: Scroll Position Tracking

#### Scroll Event System
```typescript
// Track scroll position relative to sections
interface ScrollState {
  currentSection: 'home' | 'skills' | 'experience';
  nextSection: 'home' | 'skills' | 'experience' | null;
  transitionProgress: number; // 0-1 within transition zone
  isTransitioning: boolean;
}

// Listen to scroll events
window.addEventListener('scroll', () => {
  const scrollState = calculateScrollState();
  updateCurveMorph(scrollState);
});
```

#### Transition Zone Calculation
```typescript
function calculateScrollState(): ScrollState {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  // Find which section we're in
  const homeEnd = document.getElementById('home')?.offsetTop + windowHeight;
  const skillsStart = document.getElementById('skills')?.offsetTop;
  const skillsEnd = skillsStart + windowHeight;
  const expStart = document.getElementById('experience')?.offsetTop;

  // Transition zones (25% of section height)
  const transitionZone = windowHeight * 0.25;

  // Check if in Home → Skills transition
  if (scrollY > homeEnd - transitionZone && scrollY < skillsStart + transitionZone) {
    const progress = (scrollY - (homeEnd - transitionZone)) / (transitionZone * 2);
    return {
      currentSection: 'home',
      nextSection: 'skills',
      transitionProgress: progress,
      isTransitioning: true
    };
  }

  // Check if in Skills → Experience transition
  if (scrollY > skillsEnd - transitionZone && scrollY < expStart + transitionZone) {
    const progress = (scrollY - (skillsEnd - transitionZone)) / (transitionZone * 2);
    return {
      currentSection: 'skills',
      nextSection: 'experience',
      transitionProgress: progress,
      isTransitioning: true
    };
  }

  // Not transitioning
  return {
    currentSection: getCurrentSection(scrollY),
    nextSection: null,
    transitionProgress: 0,
    isTransitioning: false
  };
}
```

---

### Phase 3: Curve Interpolation

#### Lerp Between Control Points
```typescript
function lerpControlPoints(
  points1: ControlPoint[],
  points2: ControlPoint[],
  t: number
): ControlPoint[] {
  return points1.map((p1, i) => {
    const p2 = points2[i];
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t
    };
  });
}
```

#### Update Curve in Animation Loop
```typescript
paper.view.onFrame = (event: any) => {
  const scrollState = getScrollState();

  if (scrollState.isTransitioning) {
    // Get control points for current and next section
    const currentPoints = configPresets[scrollState.currentSection].curveControlPoints;
    const nextPoints = configPresets[scrollState.nextSection].curveControlPoints;

    // Interpolate based on scroll progress
    const morphedPoints = lerpControlPoints(
      currentPoints,
      nextPoints,
      scrollState.transitionProgress
    );

    // Update current curve
    currentCurvePoints = morphedPoints;

    // Redraw guides with morphed curve
    updateGuidesWithPoints(morphedPoints);
  }

  // ... rest of animation loop
};
```

---

### Phase 4: Birth Rate System

#### Config Addition
```typescript
interface PresetConfig {
  pattern: 'curve';
  sizes: { ... };
  distribution: {
    curveControlPoints: ControlPoint[];
    bandWidth: number;
    birthRate: number; // 0-1: probability of regenerating dead shapes
    targetDensity?: number; // Optional: target shape count
  };
  appearance: { ... };
}
```

#### Example Configs
```typescript
home: {
  distribution: {
    birthRate: 1.0,  // Always regenerate (dense)
    targetDensity: 200
  }
},
skills: {
  distribution: {
    birthRate: 0.3,  // 30% chance to regenerate (sparse)
    targetDensity: 60
  }
},
experience: {
  distribution: {
    birthRate: 0.7,  // 70% chance (medium)
    targetDensity: 120
  }
}
```

---

### Phase 5: Bandwidth-Aware Regeneration

#### Updated Regeneration Logic
```typescript
const regenerateShape = (shape: paper.Path, index: number) => {
  // Check if current position is inside bandwidth
  const isInsideBandwidth = checkIfInsideBandwidth(
    shape.position.x,
    shape.position.y,
    currentCurvePoints,
    bandWidth
  );

  // Check birth rate
  const shouldSpawn = Math.random() < shapeConfig.distribution.birthRate;

  if (!isInsideBandwidth || !shouldSpawn) {
    // Permanent death: remove shape entirely
    shape.remove();
    shapes.splice(index, 1);

    // Remove connections
    removeConnectionsForShape(shape);

    console.log(`Shape permanently removed (inside: ${isInsideBandwidth}, spawn: ${shouldSpawn})`);
    return;
  }

  // Regenerate normally
  generateNewShapeAt(index);
};
```

#### Bandwidth Check Function
```typescript
function checkIfInsideBandwidth(
  x: number,
  y: number,
  curvePoints: ControlPoint[],
  bandWidth: number
): boolean {
  // Convert curve points to pixels
  const p0 = toPixels(curvePoints[0]);
  const p1 = toPixels(curvePoints[1]);
  const p2 = toPixels(curvePoints[2]);
  const p3 = toPixels(curvePoints[3]);

  // Find closest point on curve to (x, y)
  let minDistance = Infinity;

  for (let t = 0; t <= 1; t += 0.01) {
    const curvePoint = bezierPoint(t, p0, p1, p2, p3);
    const dx = curvePoint.x - x;
    const dy = curvePoint.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  // Check if within bandwidth
  return minDistance <= bandWidth / 2;
}
```

---

## Implementation Steps

### Step 1: Convert Existing Patterns (1-2 hours)
- [ ] Convert `home` diagonal to Bezier
- [ ] Convert `experience` circle to Bezier
- [ ] Test that shapes still generate correctly
- [ ] Update guide drawing for all patterns

### Step 2: Add Scroll Tracking (1 hour)
- [ ] Implement `calculateScrollState()` function
- [ ] Listen to scroll events
- [ ] Store scroll state globally
- [ ] Add debugging console logs

### Step 3: Curve Interpolation (1 hour)
- [ ] Implement `lerpControlPoints()` function
- [ ] Update `onFrame` to use interpolated curves
- [ ] Test smooth morphing between patterns
- [ ] Update guides to follow morphed curve

### Step 4: Birth Rate System (30 min)
- [ ] Add `birthRate` to configs
- [ ] Update regeneration logic to check birth rate
- [ ] Test population changes

### Step 5: Bandwidth Checking (1 hour)
- [ ] Implement `checkIfInsideBandwidth()` function
- [ ] Update regeneration to check bandwidth
- [ ] Test permanent death outside bandwidth
- [ ] Monitor population adjustments

### Step 6: Polish & Optimize (1 hour)
- [ ] Optimize bandwidth checking (cache results)
- [ ] Add smooth easing to transitions
- [ ] Test all section transitions
- [ ] Fine-tune birth rates and densities

**Total Estimated Time**: 5.5 - 6 hours

---

## Edge Cases

### What if sections have different numbers of control points?
**Solution**: Pad with interpolated points or use different transition logic.

### What if user scrolls quickly?
**Solution**: Debounce scroll events or sample at fixed intervals.

### What if bandwidth becomes very narrow?
**Solution**: Many shapes die permanently. That's intended behavior.

### Performance with many shapes?
**Solution**:
- Limit max shape count
- Use spatial indexing for bandwidth checks
- Optimize curve sampling

---

## Testing Plan

### Test 1: Pattern Conversion
- Load each section
- Verify shapes appear in correct pattern
- Check guides match shape distribution

### Test 2: Scroll Morphing
- Slowly scroll through transitions
- Verify smooth curve morphing
- Check guides update in real-time

### Test 3: Birth Rate
- Set skills to `birthRate: 0.1`
- Watch population decrease
- Verify only 10% regenerate

### Test 4: Bandwidth Death
- Create narrow bandwidth in skills
- Watch shapes outside die permanently
- Verify population adjusts

### Test 5: Performance
- Generate 500+ shapes
- Scroll rapidly through sections
- Monitor frame rate (target: 60fps)

---

## Configuration Examples

### Dense to Sparse Transition
```typescript
home: {
  birthRate: 1.0,
  bandWidth: 400,
  targetDensity: 250
}

skills: {
  birthRate: 0.2,
  bandWidth: 150,
  targetDensity: 50
}

Result: 250 → 50 shapes (80% die permanently)
```

### Sparse to Dense Transition
```typescript
skills: {
  birthRate: 0.3,
  targetDensity: 60
}

experience: {
  birthRate: 1.2, // Over 100% = bonus shapes
  targetDensity: 200
}

Result: 60 → 200 shapes (140 new spawns)
```

---

## Future Enhancements

1. **Path length-based spacing**: Shapes evenly distributed by arc length
2. **Velocity-based morphing**: Faster scroll = faster morph
3. **Elastic transitions**: Overshoot and bounce back
4. **Multiple curves**: Combine patterns (e.g., two parallel arcs)
5. **Animated control points**: Control points move independently

---

## References

See also:
- `NEURAL_NETWORK_CURVES.md` - Current Bezier implementation
- `NEURAL_NETWORK_BACKGROUND.md` - Overall architecture
- `NEURAL_NETWORK_QUICK_REFERENCE.md` - Quick config guide
