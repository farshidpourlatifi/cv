# Canvas Optimization Recommendations

## Current Performance Issues

Based on your `PaperCanvasExact.astro` implementation, here are the main performance bottlenecks:

### 🔴 Critical Issues (High Impact)

1. **Too Many Shapes & Connections**
   - Current: ~80+ shapes with ~150+ connections
   - Impact: Heavy CPU usage, low FPS on mobile
   - Target: 30-50 shapes, 60-80 connections

2. **Continuous Complex Calculations**
   - Bezier curve calculations every frame
   - Gradient color interpolation for every connection
   - Multiple trigonometric operations per shape

3. **Memory Leaks in Connection Regeneration**
   - Connections not always cleaned up properly
   - Traveling pulses accumulate

4. **No Performance Degradation Strategy**
   - Same complexity regardless of device capabilities
   - No frame skip or throttling

### 🟡 Moderate Issues

1. **Debug Guides Always Running**
   - Guide paths update even when hidden
   - Line: `const showGuides = true;` (should be false in production)

2. **Excessive Mouse Interaction**
   - `onMouseMove` checks on every pixel movement
   - No throttling or debouncing

3. **Blur Effects**
   - Shadow blur is GPU-intensive
   - Applied to multiple shapes

## Quick Wins (Implement These First)

### 1. Disable Debug Guides (Line 1191)

```typescript
// CHANGE THIS:
const showGuides = true;

// TO THIS:
const showGuides = false; // Or detect debug mode from URL param
```

**Expected Impact:** 5-10% FPS improvement

### 2. Reduce Shape Count Based on Device

```typescript
// Add this at the top of initPaperCanvas()
const isMobile = window.innerWidth < 768;
const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Modify shape generation to respect device capabilities
const SHAPE_COUNT_MULTIPLIER = hasReducedMotion ? 0.3 : isMobile ? 0.5 : isLowEnd ? 0.7 : 1.0;

// Apply to each preset
configPresets.home.distribution.spacing *= (1 / SHAPE_COUNT_MULTIPLIER);
configPresets.skills.distribution.spacing *= (1 / SHAPE_COUNT_MULTIPLIER);
configPresets.experience.distribution.spacing *= (1 / SHAPE_COUNT_MULTIPLIER);
```

**Expected Impact:** 20-40% FPS improvement on mobile

### 3. Disable Blur on Low-End Devices

```typescript
// Line 144 - Modify blur config
blur: {
  enabled: !isMobile && !isLowEnd, // <-- Add device check
  probability: 0.3,
  amount: 8
},
```

**Expected Impact:** 10-15% GPU usage reduction

### 4. Throttle Connection Updates

```typescript
// Add this variable at the top of initPaperCanvas()
let connectionUpdateCounter = 0;
const connectionUpdateInterval = isMobile ? 2 : 1; // Update every N frames

// In the onFrame loop (line 1834), wrap the connection animation:
if (connectionUpdateCounter++ % connectionUpdateInterval === 0) {
  // Animate neuron connections
  for (let i = connections.length - 1; i >= 0; i--) {
    // ... existing connection code ...
  }
}
```

**Expected Impact:** 15-25% CPU reduction on mobile

### 5. Throttle Mouse Interaction (Line 2001)

```typescript
// Add throttling variable
let lastMouseMoveTime = 0;
const mouseThrottleMs = 50; // Only check every 50ms

paper.view.onMouseMove = (event: any) => {
  const now = Date.now();
  if (now - lastMouseMoveTime < mouseThrottleMs) return;
  lastMouseMoveTime = now;

  // ... existing mouse code ...
};
```

**Expected Impact:** 5-10% CPU reduction during mouse movement

## Medium-Term Optimizations

### 6. Implement Frame Budget

```typescript
// Add at the start of paper.view.onFrame
const frameStartTime = performance.now();
const frameBudget = 16.67; // 60fps target
let budgetExceeded = false;

// Before expensive operations:
if (performance.now() - frameStartTime > frameBudget * 0.8) {
  budgetExceeded = true;
  // Skip non-critical animations
}

// Example: Skip pulse updates if over budget
if (!budgetExceeded) {
  // Animate traveling pulses
  const pulses = connection.data.travelingPulses;
  // ... pulse animation code ...
}
```

**Expected Impact:** Prevents frame drops, maintains 60fps

### 7. Optimize Bezier Calculations

```typescript
// Cache Bezier points instead of calculating every frame
const bezierCache = new Map<string, {x: number, y: number}>();

const getCachedBezierPoint = (t: number, p0: any, p1: any, p2: any, p3: any) => {
  const key = `${t}-${p0.x}-${p0.y}-${p3.x}-${p3.y}`;

  if (bezierCache.has(key)) {
    return bezierCache.get(key)!;
  }

  const point = bezierPoint(t, p0, p1, p2, p3);
  bezierCache.set(key, point);

  // Clear cache periodically to prevent memory leak
  if (bezierCache.size > 1000) {
    bezierCache.clear();
  }

  return point;
};
```

**Expected Impact:** 10-20% CPU reduction for curve pattern

### 8. Use Object Pooling for Pulses

```typescript
// Create pulse pool to avoid garbage collection
class PulsePool {
  private pool: any[] = [];

  acquire() {
    return this.pool.pop() || {
      progress: 0,
      speed: 0,
      hasFired: false,
      segment: null
    };
  }

  release(pulse: any) {
    if (pulse.segment) {
      pulse.segment.visible = false;
    }
    pulse.progress = 0;
    pulse.hasFired = false;
    this.pool.push(pulse);
  }
}

const pulsePool = new PulsePool();

// When creating new pulse:
const pulse = pulsePool.acquire();
pulse.progress = 0;
pulse.speed = connectionConfig.pulseSpeed.min + Math.random() * speedRange;
pulse.hasFired = false;

// When removing pulse:
pulsePool.release(pulse);
```

**Expected Impact:** Reduces garbage collection pauses

### 9. Simplify Gradient Calculations

```typescript
// Instead of creating gradient for every connection every frame (line 1862):
// Create gradient once and update only opacity

// At connection creation:
const gradient = new paper.Color({
  gradient: {
    stops: [
      [startNodeColor, 0],
      [endNodeColor, 1]
    ]
  },
  origin: startPos,
  destination: endPos
});
connection.data.gradient = gradient;

// In animation loop, just update positions:
connection.strokeColor = connection.data.gradient;
connection.data.gradient.origin = startPos;
connection.data.gradient.destination = endPos;
```

**Expected Impact:** 15-25% reduction in color calculations

### 10. Reduce Random Fire Probability

```typescript
// Line 1734 - This fires random shapes too frequently
// Current:
if (Math.random() < shapeConfig.fireEffects.randomFireProbability) { // 0.003

// Recommended (less activity = better performance):
const baseFireProbability = isMobile ? 0.001 : 0.002;
if (Math.random() < baseFireProbability) {
```

**Expected Impact:** 5-10% CPU reduction

## Advanced Optimizations

### 11. Implement Visibility Culling

```typescript
// Don't update shapes that are off-screen
const isShapeVisible = (shape: paper.Path) => {
  const bounds = shape.bounds;
  const viewBounds = paper.view.bounds;
  return bounds.intersects(viewBounds.expand(100)); // 100px margin
};

// In animation loop:
shapes.forEach((shape, index) => {
  if (!isShapeVisible(shape)) {
    // Skip expensive updates for off-screen shapes
    shape.data.age += acceleratedDeathRate;
    return;
  }

  // ... regular updates ...
});
```

**Expected Impact:** 10-20% CPU reduction for large viewports

### 12. Use RequestIdleCallback for Non-Critical Work

```typescript
// Move shape regeneration to idle time
const regenerationQueue: Array<{shape: paper.Path, index: number}> = [];

// In onFrame, instead of regenerating immediately:
if (shape.data.age >= shape.data.lifespan) {
  regenerationQueue.push({shape, index});
}

// Process queue during idle time:
if ('requestIdleCallback' in window) {
  window.requestIdleCallback((deadline) => {
    while (deadline.timeRemaining() > 0 && regenerationQueue.length > 0) {
      const item = regenerationQueue.shift();
      if (item) {
        regenerateShape(item.shape, item.index);
      }
    }
  });
}
```

**Expected Impact:** Smoother frame times, no frame drops

### 13. Reduce Connection Complexity

```typescript
// Simplify connection visual (line 1326)
// Instead of gradient + pulsing + traveling pulses:

// Option A: Static dashed lines (cheapest)
const line = new paper.Path.Line({
  from: shape.position,
  to: otherShape.position,
  strokeColor: new paper.Color(colors.secondary),
  strokeWidth: 1,
  opacity: 0.2,
  dashArray: [2, 4],
});

// Option B: Simple opacity pulse (no traveling pulse)
// Remove traveling pulse code entirely
connection.opacity = connectionConfig.pulseBaseOpacity +
  Math.sin(connection.data.age * 0.1) * 0.2;
```

**Expected Impact:** 30-50% reduction in connection overhead

### 14. Lazy Load Canvas on Scroll

```typescript
// Don't initialize canvas until user scrolls or interacts
let canvasInitialized = false;

const initCanvasLazy = () => {
  if (canvasInitialized) return;
  canvasInitialized = true;
  initPaperCanvas();
};

// Initialize after a delay or on interaction
setTimeout(initCanvasLazy, 1000);
window.addEventListener('scroll', initCanvasLazy, {once: true});
window.addEventListener('mousemove', initCanvasLazy, {once: true});
```

**Expected Impact:** Faster initial page load

## Configuration Presets for Device Tiers

```typescript
// Add device-specific presets
const getOptimizedConfig = () => {
  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;

  if (isMobile) {
    return {
      shapeCount: 0.4, // 40% of shapes
      enableBlur: false,
      enablePulses: false, // Disable traveling pulses
      connectionUpdateInterval: 3, // Update every 3 frames
      enableGuides: false,
      mouseInteraction: false, // Disable mouse fires
      randomFireProbability: 0.0005,
    };
  }

  if (isLowEnd) {
    return {
      shapeCount: 0.6,
      enableBlur: false,
      enablePulses: true,
      connectionUpdateInterval: 2,
      enableGuides: false,
      mouseInteraction: true,
      randomFireProbability: 0.001,
    };
  }

  // High-end desktop
  return {
    shapeCount: 1.0,
    enableBlur: true,
    enablePulses: true,
    connectionUpdateInterval: 1,
    enableGuides: false,
    mouseInteraction: true,
    randomFireProbability: 0.003,
  };
};
```

## Performance Monitoring Integration

```typescript
// Add to your canvas initialization
import { startMonitoring, getDeviceCapabilities } from '../utils/performanceMonitor';

function initPaperCanvas() {
  // ... existing code ...

  // Start performance monitoring (only in development)
  const isDev = import.meta.env.DEV;
  const monitor = isDev ? startMonitoring({ showOverlay: true }) : null;

  // Get device capabilities
  const deviceCaps = getDeviceCapabilities();
  console.log('Device capabilities:', deviceCaps);

  // Apply device-specific settings
  const enableBlur = deviceCaps.shouldEnableBlur;
  const connectionUpdateInterval = deviceCaps.connectionUpdateInterval;

  paper.view.onFrame = (event: any) => {
    monitor?.update(); // Track FPS

    // ... existing animation code ...
  };
}
```

## Testing Checklist

After applying optimizations:

- [ ] Test on iPhone/Android (target: 30fps minimum)
- [ ] Test on older laptop (target: 45fps minimum)
- [ ] Test battery drain (target: <15% per hour)
- [ ] Test with Chrome DevTools CPU throttling (4x slowdown)
- [ ] Check memory usage over 10 minutes (should be stable)
- [ ] Verify smooth scrolling between sections
- [ ] Test with reduced motion preference
- [ ] Lighthouse performance score (target: 90+)

## Recommended Implementation Order

1. ✅ Disable debug guides (immediate)
2. ✅ Reduce shape count for mobile (high impact)
3. ✅ Disable blur on low-end devices (high impact)
4. ✅ Throttle connection updates (high impact)
5. ✅ Throttle mouse interaction (medium impact)
6. ✅ Add performance monitoring (measure improvements)
7. ⚠️ Implement frame budget (prevents frame drops)
8. ⚠️ Simplify gradient calculations (medium impact)
9. ⚠️ Reduce random fire probability (low impact)
10. 🔮 Consider disabling traveling pulses on mobile (high impact but changes UX)

## Expected Overall Impact

Implementing all "Quick Wins" should give you:
- **Mobile**: 30-50% FPS improvement (from ~20fps to 30-40fps)
- **Desktop**: 15-25% FPS improvement (from ~45fps to 55-60fps)
- **Battery**: 20-30% reduction in energy consumption
- **Memory**: 20-30% reduction in memory usage

## Alternative: Simplified Mode

If performance is still not acceptable, consider a "lite" mode:

```typescript
// Completely disable canvas on very low-end devices
const isVeryLowEnd = (
  navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2
) || window.innerWidth < 400;

if (isVeryLowEnd) {
  // Show static CSS gradient background instead
  console.log('Canvas disabled - using static background');
  return;
}
```

## Next Steps

1. Implement performance monitoring first
2. Measure baseline performance
3. Apply optimizations one by one
4. Measure improvement after each change
5. Find the right balance between visual quality and performance
