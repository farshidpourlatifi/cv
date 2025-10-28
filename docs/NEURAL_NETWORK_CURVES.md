# Neural Network Background - Bezier Curve System

## Overview

The neural network background uses **Bezier curves** to define the path where nodes (shapes) appear. This allows for smooth, morphing transitions between different section patterns.

## Architecture

### Three Pattern Types (All Bezier-Based)

1. **Home**: Diagonal sine wave (represented as Bezier)
2. **Skills**: Smooth arc (native Bezier with 4 control points)
3. **Experience**: Circle (represented as Bezier)

### Current Implementation Status

#### ✅ Completed
- Bezier curve math functions (cubic Bezier)
- Skills arc pattern with control points
- Guide drawing along curves
- Shape generation along curves
- Shape regeneration on curves

#### 🚧 In Progress (Next Steps)
- Convert diagonal/circle to Bezier representation
- Scroll-based curve interpolation
- Birth rate system
- Bandwidth-aware regeneration

---

## Bezier Curve Functions

Location: `PaperCanvasExact.astro:203-248`

### `bezierPoint(t, p0, p1, p2, p3)`
Calculates a point on cubic Bezier curve at parameter `t` (0-1).

**Formula**: `B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3`

**Parameters**:
- `t`: Position along curve (0 = start, 1 = end)
- `p0`: Start point `{x, y}`
- `p1`: First control point `{x, y}`
- `p2`: Second control point `{x, y}`
- `p3`: End point `{x, y}`

**Returns**: `{x, y}` - Point on curve

### `bezierTangent(t, p0, p1, p2, p3)`
Calculates the tangent (derivative) at parameter `t`.

**Returns**: `{dx, dy}` - Direction vector

### `bezierPerpendicular(t, p0, p1, p2, p3)`
Calculates normalized perpendicular direction at parameter `t`.

**Returns**: `{x, y}` - Unit vector perpendicular to curve

---

## Configuration

### Skills Section Example

```typescript
skills: {
  pattern: 'curve',  // Use Bezier curve
  sizes: { circle: [1], rect: [1], triangle: [1] },
  distribution: {
    minDistance: 10,
    bandWidth: 200,     // Width of curve band (perpendicular)
    spacing: 20,
    spacingRandomness: 3,
    edgeMargin: 10,
    boundsInset: 30,

    // Control points (as fractions 0-1 of screen size)
    curveControlPoints: [
      { x: 0.85, y: 1.0 },   // Start: bottom-right
      { x: 0.65, y: 0.75 },  // Control 1: pull left in lower section
      { x: 0.70, y: 0.25 },  // Control 2: pull left in upper section
      { x: 0.85, y: 0.0 }    // End: top-right
    ]
  },
  appearance: { strokeWidthOptions: [2, 3, 4] },
}
```

### Control Points Explained

Control points are defined as **fractions of screen size** (0-1):
- `x: 0.0` = left edge, `x: 1.0` = right edge
- `y: 0.0` = top, `y: 1.0` = bottom

**Example Arc Path**:
```
Start (0.85, 1.0) ────┐ Bottom-right
                      │
Control 1 (0.65, 0.75)│ Pull left 20%, 75% down
                      │
Control 2 (0.70, 0.25)│ Pull left 15%, 25% down
                      │
End (0.85, 0.0) ──────┘ Top-right
```

---

## Shape Generation

### `generateShapesAlongCurve()`
Location: `PaperCanvasExact.astro:620-743`

**Process**:
1. Convert control points from fractions to pixels
2. Sample curve at 1% intervals (t = 0 to 1, step 0.01)
3. For each sample point:
   - Calculate perpendicular direction
   - Random offset within `bandWidth`
   - Check bounds and spacing
   - Create shape if valid

**Key Parameters**:
- `spacing`: Controls density (higher = sparser)
- `minDistance`: Minimum space between shapes
- `bandWidth`: How far shapes can deviate from center line

### `generateSingleShapePosition()`
Location: `PaperCanvasExact.astro:784-816`

Used for **regenerating** individual shapes when they die.

**Process**:
1. Pick random `t` value (0-1) along curve
2. Calculate point at that `t`
3. Random perpendicular offset within bandwidth
4. Check validity (bounds, spacing)
5. Return position or fallback

---

## Guide Visualization

### `drawCurveGuides()`
Location: `PaperCanvasExact.astro:1087-1140`

Draws three dotted lines showing the curve path:
- **Center line** (red): Main curve path
- **Upper boundary** (white): +bandWidth/2 perpendicular
- **Lower boundary** (white): -bandWidth/2 perpendicular

**Appearance**:
```typescript
centerLine: {
  color: '#FF0000',
  width: 2,
  opacity: 0.3,
  dashArray: [10, 5]
}

boundaries: {
  color: '#FFFFFF',
  width: 1,
  opacity: 0.2,
  dashArray: [5, 5]
}
```

**Toggle Visibility**: Line 1183
```typescript
const showGuides = true; // Set to false to hide
```

---

## Customization Examples

### Create an S-Curve
```typescript
curveControlPoints: [
  { x: 0.2, y: 1.0 },    // Start: bottom-left
  { x: 0.8, y: 0.75 },   // Pull right
  { x: 0.2, y: 0.25 },   // Pull left
  { x: 0.8, y: 0.0 }     // End: top-right
]
```

### Create a Wave
```typescript
curveControlPoints: [
  { x: 0.3, y: 1.0 },    // Start: bottom
  { x: 0.7, y: 0.66 },   // Wave right
  { x: 0.3, y: 0.33 },   // Wave left
  { x: 0.7, y: 0.0 }     // End: top
]
```

### Create a Diagonal Line
```typescript
curveControlPoints: [
  { x: 0.0, y: 1.0 },    // Start: bottom-left
  { x: 0.33, y: 0.66 },  // Straight through
  { x: 0.66, y: 0.33 },  // Straight through
  { x: 1.0, y: 0.0 }     // End: top-right
]
```

---

## Integration Points

### Pattern Detection
Location: `PaperCanvasExact.astro:746-759`

```typescript
const generateShapes = () => {
  const pattern = currentPreset.pattern;

  if (pattern === 'curve') {
    return generateShapesAlongCurve();
  } else if (pattern === 'vertical') {
    return generateShapesInVerticalLine();
  } else if (pattern === 'circle') {
    return generateShapesInCircle();
  } else {
    return generateShapesInDiagonalBand();
  }
};
```

### Guide Updates
Location: `PaperCanvasExact.astro:1166-1179`

```typescript
const updateGuides = () => {
  const pattern = currentPreset.pattern;

  if (pattern === 'curve') {
    drawCurveGuides(...);
  } else if (pattern === 'vertical') {
    drawVerticalGuides(...);
  } else if (pattern === 'circle') {
    drawCircularGuides(...);
  } else {
    drawDiagonalGuides(...);
  }
};
```

---

## Performance Considerations

### Sampling Rate
- Curves sampled at 1% intervals (100 samples)
- For denser curves, decrease step: `t += 0.005` (200 samples)
- For performance, increase step: `t += 0.02` (50 samples)

### Shape Count
Control via:
1. `spacing`: Higher = fewer shapes
2. `minDistance`: Higher = fewer shapes
3. `bandWidth`: Narrower = fewer shapes fit

---

## Troubleshooting

### Shapes Outside Bandwidth
**Issue**: Nodes appear outside the dotted guide lines

**Causes**:
1. Fallback position when max attempts reached (line 689-693)
2. Old nodes from previous pattern haven't died yet

**Solutions**:
1. Increase `minDistance` or decrease `spacing`
2. Widen `bandWidth`
3. Force regeneration on pattern change

### Curve Not Visible
**Issue**: No dotted lines showing

**Check**:
1. `showGuides = true` (line 1183)
2. `curveControlPoints` has exactly 4 points
3. Control points are valid (0-1 range)
4. Pattern is set to `'curve'`

### Jagged Curve
**Issue**: Curve looks angular, not smooth

**Fix**: Decrease sampling step
```typescript
for (let t = 0; t <= 1; t += 0.005) { // Was 0.01
```

---

## Next Steps (See SCROLL_MORPHING.md)

1. Convert all patterns to Bezier representation
2. Implement scroll-based interpolation
3. Add birth rate system
4. Bandwidth-aware regeneration

---

## References

- **Bezier Curve Math**: [Wikipedia - Bézier curve](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)
- **Cubic Bezier**: 4 control points (P0, P1, P2, P3)
- **Perpendicular Vector**: Rotate tangent 90° counter-clockwise: `(-dy, dx)`
