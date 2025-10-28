# Neural Network Background - Current State Summary

**Last Updated**: 2025-10-28
**Context Used**: 179k/200k tokens (90%)

---

## ✅ What's Implemented

### 1. Bezier Curve System (Complete)
- ✅ Cubic Bezier math functions (point, tangent, perpendicular)
- ✅ Skills section using Bezier arc with 4 control points
- ✅ Shape generation along curves
- ✅ Shape regeneration on curves
- ✅ Guide visualization (center + bandwidth boundaries)

**Files Modified**:
- `src/components/Background/PaperCanvasExact.astro` (lines 203-248, 620-743, 784-816, 1087-1140)

**Config Example** (Skills section):
```typescript
pattern: 'curve',
curveControlPoints: [
  { x: 0.85, y: 1.0 },   // Bottom-right
  { x: 0.65, y: 0.75 },  // Pull left
  { x: 0.70, y: 0.25 },  // Pull left
  { x: 0.85, y: 0.0 }    // Top-right
],
bandWidth: 200,
```

### 2. Pattern Types
- ✅ Home: Diagonal sine wave (old system)
- ✅ Skills: Bezier arc (new system)
- ✅ Experience: Circle (old system)

### 3. Transition System (Basic)
- ✅ Discrete pattern switches between sections
- ✅ Accelerated death rate during transitions (5x speed)
- ✅ Guide morphing with fade out/in

---

## 🚧 What's Planned (Next Steps)

### Phase 1: Convert All Patterns to Bezier (Required)
**Goal**: Make all patterns use Bezier curves for easy interpolation

1. **Home (Diagonal)** → Bezier representation
   ```typescript
   curveControlPoints: [
     { x: 0.0, y: 1.0 },
     { x: 0.33, y: 0.66 },
     { x: 0.66, y: 0.33 },
     { x: 1.0, y: 0.0 }
   ]
   ```

2. **Experience (Circle)** → Bezier approximation
   ```typescript
   curveControlPoints: [
     { x: 0.5, y: 1.0 },    // Bottom
     { x: 0.2, y: 0.8 },    // Lower arc
     { x: 0.2, y: 0.2 },    // Upper arc
     { x: 0.5, y: 0.0 }     // Top
   ],
   closedCurve: true
   ```

**Files to Modify**:
- `src/components/Background/PaperCanvasExact.astro`
- Update `configPresets.home` and `configPresets.experience`
- Remove old generation functions (diagonal/circle)

**Estimated Time**: 1-2 hours

---

### Phase 2: Scroll Position Tracking
**Goal**: Detect when user is in transition zone (last 25% + first 25%)

**Implementation**:
```typescript
interface ScrollState {
  currentSection: 'home' | 'skills' | 'experience';
  nextSection: string | null;
  transitionProgress: number; // 0-1
  isTransitioning: boolean;
}

window.addEventListener('scroll', () => {
  const state = calculateScrollState();
  if (state.isTransitioning) {
    updateCurveMorph(state);
  }
});
```

**Files to Modify**:
- `src/components/Background/PaperCanvasExact.astro` (add scroll listener)
- Store scroll state globally

**Estimated Time**: 1 hour

---

### Phase 3: Curve Interpolation (Lerp)
**Goal**: Smoothly interpolate between curve control points based on scroll

**Implementation**:
```typescript
function lerpControlPoints(p1, p2, t) {
  return p1.map((point, i) => ({
    x: point.x + (p2[i].x - point.x) * t,
    y: point.y + (p2[i].y - point.y) * t
  }));
}

// In animation loop
if (scrollState.isTransitioning) {
  const morphedPoints = lerpControlPoints(
    currentPoints,
    nextPoints,
    scrollState.transitionProgress
  );
  updateGuidesWithPoints(morphedPoints);
}
```

**Files to Modify**:
- `src/components/Background/PaperCanvasExact.astro` (onFrame loop)
- Store morphed points globally
- Update guides in real-time

**Estimated Time**: 1 hour

---

### Phase 4: Birth Rate System
**Goal**: Control how many dead shapes regenerate

**Config Addition**:
```typescript
home: {
  distribution: {
    birthRate: 1.0,  // 100% - always regenerate
    targetDensity: 200
  }
},
skills: {
  distribution: {
    birthRate: 0.3,  // 30% - sparse
    targetDensity: 60
  }
}
```

**Implementation**:
```typescript
const regenerateShape = (shape, index) => {
  // Check birth rate
  if (Math.random() > shapeConfig.distribution.birthRate) {
    // Don't regenerate - permanent death
    removeShapePermanently(shape, index);
    return;
  }

  // Regenerate normally
  generateNewShapeAt(index);
};
```

**Files to Modify**:
- `src/components/Background/PaperCanvasExact.astro` (regenerateShape function ~line 1050)
- Add birthRate to all configs

**Estimated Time**: 30 minutes

---

### Phase 5: Bandwidth-Aware Regeneration
**Goal**: Only regenerate if death position is inside current bandwidth

**Implementation**:
```typescript
const regenerateShape = (shape, index) => {
  // Check if position is inside current bandwidth
  const isInside = checkIfInsideBandwidth(
    shape.position.x,
    shape.position.y,
    currentCurvePoints,
    bandWidth
  );

  const shouldSpawn = Math.random() < birthRate;

  if (!isInside || !shouldSpawn) {
    // Permanent death
    removeShapePermanently(shape, index);
    return;
  }

  // Regenerate
  generateNewShapeAt(index);
};

function checkIfInsideBandwidth(x, y, curvePoints, bandWidth) {
  // Find closest point on curve
  let minDist = Infinity;
  for (let t = 0; t <= 1; t += 0.01) {
    const point = bezierPoint(t, ...curvePoints);
    const dist = distance(point, {x, y});
    minDist = Math.min(minDist, dist);
  }
  return minDist <= bandWidth / 2;
}
```

**Files to Modify**:
- `src/components/Background/PaperCanvasExact.astro` (regenerateShape function)
- Add checkIfInsideBandwidth helper

**Estimated Time**: 1 hour

---

## 📊 Total Implementation Estimate

| Phase | Time | Priority |
|-------|------|----------|
| Convert patterns to Bezier | 1-2h | High |
| Scroll tracking | 1h | High |
| Curve interpolation | 1h | High |
| Birth rate system | 0.5h | Medium |
| Bandwidth checking | 1h | Medium |
| Testing & polish | 1h | High |
| **Total** | **5.5-6.5h** | - |

---

## 🔍 Key Decisions Made

### 1. Shape Behavior During Morph
**Decision**: Shapes stay in place, regenerate on death
**Reason**: Simpler logic, avoids complex position updates

### 2. Transition Zones
**Decision**: Last 25% of section + first 25% of next
**Reason**: Smooth, predictable morphing that's not too jarring

### 3. Bandwidth Death
**Decision**: Permanent death outside bandwidth
**Reason**: Natural population adjustment, no forced repositioning

### 4. Birth Rate Control
**Decision**: Per-section birth rate (0-1)
**Reason**: Fine-grained control over population density

---

## 📁 Documentation Files

All documentation is in `/docs`:

1. **NEURAL_NETWORK_CURVES.md**
   - Bezier curve math functions
   - Current implementation details
   - Control point configuration
   - Customization examples

2. **SCROLL_MORPHING_PLAN.md**
   - Scroll-based morphing architecture
   - Implementation steps
   - Code examples
   - Testing plan

3. **CURRENT_STATE_SUMMARY.md** (this file)
   - What's done
   - What's next
   - Time estimates
   - Key decisions

4. **NEURAL_NETWORK_BACKGROUND.md** (existing)
   - Overall architecture
   - Mouse interaction
   - Shape lifecycle

5. **NEURAL_NETWORK_QUICK_REFERENCE.md** (existing)
   - Quick config guide
   - Common customizations

---

## 🚀 How to Continue

### For Next Claude Session:

1. **Read these docs first**:
   ```
   /docs/NEURAL_NETWORK_CURVES.md
   /docs/SCROLL_MORPHING_PLAN.md
   /docs/CURRENT_STATE_SUMMARY.md
   ```

2. **Start with Phase 1**: Convert patterns to Bezier
   - Open `PaperCanvasExact.astro`
   - Update `configPresets.home`
   - Update `configPresets.experience`
   - Test each pattern independently

3. **Follow the phases in order**: Each builds on the previous

4. **Test frequently**: After each phase, verify in browser

5. **Update docs**: Add implementation notes as you go

---

## ⚠️ Known Issues

### 1. Shapes Outside Bandwidth (Current)
**Issue**: Some shapes appear outside guide lines
**Cause**: Fallback position when bandwidth is too crowded
**Fix**: Phase 5 will address this with bandwidth-aware regeneration

### 2. Discrete Pattern Switches (Current)
**Issue**: Jarring jumps between sections
**Fix**: Phases 2-3 will add smooth scroll-based morphing

### 3. Fixed Population Count (Current)
**Issue**: Same number of shapes in all sections
**Fix**: Phase 4 birth rate system will allow dynamic populations

---

## 🎯 Success Criteria

Implementation is complete when:

1. ✅ All patterns use Bezier curves
2. ✅ Curves morph smoothly during scroll
3. ✅ Guides follow morphing curves in real-time
4. ✅ Birth rate controls population size
5. ✅ Shapes outside bandwidth die permanently
6. ✅ Transitions are smooth and natural
7. ✅ Performance is good (60fps during scroll)

---

## 📞 Contact

If you need to pause and continue later:
- All work is documented in `/docs`
- Current state is fully described here
- Implementation plan is in `SCROLL_MORPHING_PLAN.md`
- Next session can start immediately from Phase 1
