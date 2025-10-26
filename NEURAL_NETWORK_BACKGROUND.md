# Neural Network Background Documentation

## Overview

An animated neural network visualization system built with Paper.js that creates a dynamic, living background with geometric shapes connected by pulsing lines. Shapes fire signals to each other, creating cascading chain reactions that simulate neural activity.

**Location:** `src/components/Background/PaperCanvasExact.astro`

---

## Features Summary

### 1. Dynamic Shape Generation
- Shapes distributed along a diagonal sine wave band (bottom-left to top-right)
- Three shape types: circles, rectangles, triangles
- Rounded corners on triangles for visual consistency
- Equal distribution of shapes, colors, and stroke widths

### 2. Organic Animation
- Independent X and Y axis floating motion
- Smooth easing functions for acceleration/deceleration
- Gentle rotation with varying speeds
- Each shape has unique movement parameters

### 3. Shape Lifecycle System
- Random lifespan (5-13 seconds per shape)
- Smooth fade in/out transitions (linear)
- Regeneration at original position with random jitter (±30px)
- Properties randomize on regeneration

### 4. Neural Network Connections
- Shapes connect to nearby shapes within range
- Directional connections (bottom-left → top-right)
- Subtle pulsing opacity animation
- Dynamic connections follow floating shapes

### 5. Neural Firing System
- Shapes randomly fire and trigger chain reactions
- Visual glow effect when firing
- Traveling pulses along connections
- Color morphing (source color → target color)
- Cooldown system prevents over-firing

### 6. Mouse Interaction
- Hover over any shape to make it fire immediately
- Interactive chain reactions triggered by mouse movement
- Respects cooldown system to prevent spam
- Seamless integration with random firing

---

## Architecture

### Core Components

#### 1. Shape Generation (`generateShapesInDiagonalBand()`)
**Lines:** 60-174

Generates shapes along a diagonal sine wave pattern from bottom-left to top-right.

**Key Parameters:**
```typescript
minDistance: 50           // Minimum spacing between shapes
bandWidth: 300           // Width of the diagonal band
sineAmplitude: 100       // Sine wave oscillation amplitude
sineFrequency: 0.004     // Sine wave frequency
spacing: 5               // Distance between generation attempts
```

**Process:**
1. Calculate diagonal from bottom-left (0, height) to top-right (width, 0)
2. Generate positions along diagonal with sine wave offset
3. Check for overlaps using `minDistance`
4. Cycle through shape types, colors, stroke widths for equal distribution
5. Store shape data with lifecycle and animation properties

---

#### 2. Shape Data Structure
Each shape has the following properties:

```typescript
shape.data = {
  // Animation
  originalPosition: Point,        // Base position for floating
  originalRotation: number,       // Initial rotation angle
  floatPhaseY: number,           // Y-axis sine wave phase
  floatPhaseX: number,           // X-axis sine wave phase
  rotationSpeed: number,         // Rotation speed (-0.02 to 0.02)
  floatSpeedY: number,           // Y movement speed (0.02-0.04)
  floatSpeedX: number,           // X movement speed (0.01-0.02)
  amplitudeY: number,            // Y movement range (1-4px)
  amplitudeX: number,            // X movement range (1-1.03px)

  // Lifecycle
  age: number,                   // Current age in frames
  lifespan: number,              // Total lifespan (300-800 frames)
  baseX: number,                 // Original X for regeneration
  baseY: number,                 // Original Y for regeneration
  shapeType: string,             // 'circle', 'rect', or 'triangle'

  // Firing
  isFiring: boolean,             // Currently firing?
  fireIntensity: number,         // Glow intensity (0-1)
  fireDecay: number,             // Fade rate (0.05)
  originalStrokeWidth: number,   // Default stroke width
  originalStrokeColor: string,   // Default color
  lastFireTime: number,          // Frame number of last fire
  fireCooldown: number,          // Frames between fires (180)
}
```

---

#### 3. Connection System
**Lines:** 447-493

Creates connections between nearby shapes in the top-right direction.

**Connection Parameters:**
```typescript
maxConnectionDistance: 150     // Max distance to connect
connectionProbability: 0.3     // 30% chance per valid pair
```

**Connection Data:**
```typescript
connection.data = {
  startShape: Path,              // Source shape
  endShape: Path,                // Target shape
  age: number,                   // For pulsing animation
  pulseSpeed: number,            // Pulse animation speed
  travelingPulses: Array,        // Active firing pulses
}
```

**Traveling Pulse Data:**
```typescript
pulse = {
  progress: number,              // 0 = start, 1 = end
  speed: number,                 // Travel speed (0.02 = 2% per frame)
  segment: Path,                 // Visual line segment
}
```

---

#### 4. Animation Loop (`paper.view.onFrame`)
**Lines:** 735-910

Main animation loop that runs every frame (~60fps).

**Frame Sequence:**

1. **Random Fire Trigger** (lines 740-743)
   - 0.3% chance per frame (~0.18 fires/second)
   - Selects random shape to initiate firing

2. **Shape Updates** (lines 745-820)
   - Check for lifecycle completion → regenerate
   - Increment age
   - Calculate fade in/out opacity
   - Handle firing state (glow decay)
   - Apply floating animation
   - Apply rotation

3. **Connection Updates** (lines 823-909)
   - Validate connection integrity
   - Update connection positions
   - Animate baseline pulse opacity
   - Update traveling pulse positions
   - Interpolate pulse colors
   - Trigger target shapes when pulse arrives

---

## Feature Details

### 1. Diagonal Sine Wave Distribution

**Purpose:** Creates an organic, flowing distribution of shapes along a diagonal band.

**How It Works:**
- Base diagonal line from bottom-left to top-right
- Sine wave oscillation perpendicular to diagonal
- Random offset within band width
- Shapes cluster around the wave path

**Visualization:**
```
Red dashed line:   Center sine wave path
Green dashed lines: Band boundaries (±150px)
Toggle: Set showGuides = false (line 259)
```

**Adjusting Density:**
```typescript
// More shapes
minDistance = 40;              // Closer spacing
spacing = 0.3;                 // More attempts

// Fewer shapes
minDistance = 80;              // More spacing
spacing = 10;                  // Fewer attempts
```

---

### 2. Shape Lifecycle & Regeneration

**Purpose:** Keeps the canvas fresh and evolving over time.

**Lifecycle Stages:**
1. **Birth** (age 0-30): Fade in from 0 → 1 opacity
2. **Life** (age 30 to lifespan-30): Full visibility
3. **Death** (age lifespan-30 to lifespan): Fade out 1 → 0 opacity
4. **Regeneration**: New shape at same location with jitter

**Regeneration Process** (`regenerateShape()`, lines 551-702):
1. Remove all connections to old shape
2. Clean up traveling pulses
3. Apply position jitter (±30px)
4. Cycle to next shape type, color, stroke width
5. Randomize size within type
6. Create new shape at jittered position
7. Initialize new lifecycle data
8. Create new connections to/from nearby shapes

**Customizing Lifecycle:**
```typescript
lifespan: 300 + Math.random() * 500  // Change range
fadeInDuration: 30                    // Frames to fade in
fadeOutDuration: 30                   // Frames to fade out
```

---

### 3. Floating Animation

**Purpose:** Creates organic, independent movement for each shape.

**Movement System:**
- Separate sine waves for X and Y axes
- Different phases prevent synchronized movement
- Easing functions smooth acceleration/deceleration
- Gentle rotation varies by shape

**Animation Formula:**
```typescript
// Raw sine wave (-1 to 1)
rawSin = sin(time * speed + phase)

// Normalize to 0-1
normalized = (rawSin + 1) / 2

// Apply easing
eased = easeInOutSine(normalized)

// Convert back to -1 to 1 and scale
offset = (eased * 2 - 1) * amplitude

// Apply to position
position = originalPosition + offset
```

**Customizing Movement:**
```typescript
floatSpeedY: 0.02 + Math.random() * 0.02  // Y speed
floatSpeedX: 0.01 + Math.random() * 0.01  // X speed
amplitudeY: 1 + Math.random() * 3          // Y range
amplitudeX: 1 + Math.random() * .03        // X range (subtle)
rotationSpeed: (Math.random() - 0.5) * 0.02 // Rotation
```

---

### 4. Neural Firing System

**Purpose:** Simulates neural activity with cascading chain reactions.

#### Fire Initiation
**Random fires:** 0.3% chance per frame (line 740)
**Triggered fires:** When pulse reaches target shape

#### Fire Process (`fireShape()`, lines 704-733):

1. **Safety Checks:**
   - Shape still exists in array
   - Passed cooldown period (3 seconds)

2. **Visual Effect:**
   - Set `isFiring = true`
   - Set `fireIntensity = 1.0`
   - Stroke width increases by +3px
   - Color brightness increases by +30%

3. **Send Pulses:**
   - Create traveling pulse on each outgoing connection
   - Pulse starts at progress = 0

4. **Glow Decay:**
   - Intensity decreases by `fireDecay` (0.05) per frame
   - ~20 frames to fully fade
   - Shape returns to normal appearance

#### Cooldown System
**Purpose:** Prevents over-firing and maintains calm activity.

```typescript
lastFireTime: number      // Frame when last fired
fireCooldown: 180         // 3 seconds at 60fps

// Check before firing
timeSinceLastFire = currentFrame - lastFireTime
if (timeSinceLastFire < fireCooldown) return;
```

**Adjusting Activity Level:**
```typescript
// Calmer
Math.random() < 0.001     // Fewer random fires
fireCooldown: 300         // 5 second cooldown

// More active
Math.random() < 0.005     // More random fires
fireCooldown: 120         // 2 second cooldown
```

---

### 5. Traveling Pulses

**Purpose:** Visualizes signal transmission between neurons.

#### Pulse Animation (lines 850-908):

1. **Progress:** Advances by `speed` (0.02) per frame
2. **Visual:** Highlighted segment of connection line
3. **Length:** 15% of connection length
4. **Color:** Morphs from source to target color
5. **Opacity:** Fades as it travels

#### Color Morphing Algorithm (lines 861-869):

```typescript
// Get source and target colors
startColor = startShape.strokeColor
endColor = endShape.strokeColor

// Linear interpolation (lerp)
pulseColor.red = startColor.red + (endColor.red - startColor.red) * progress
pulseColor.green = startColor.green + (endColor.green - startColor.green) * progress
pulseColor.blue = startColor.blue + (endColor.blue - startColor.blue) * progress
```

**Example:**
- Source: Blue (#004B72)
- Target: Red (#F0000F)
- Progress 0%: Blue
- Progress 50%: Purple
- Progress 100%: Red

#### Pulse Lifecycle:
1. Created when source fires
2. Travels along connection (50 frames at speed 0.02)
3. Updates position and color each frame
4. Triggers target when progress ≥ 1
5. Removed and cleaned up

**Customizing Pulses:**
```typescript
speed: 0.02               // Change travel speed
pulseLength: 0.15         // Change visual length
strokeWidth: 2            // Change thickness
opacity: 0.9 * (1 - progress * 0.3)  // Adjust fade
```

---

### 6. Mouse Interaction

**Purpose:** Allows users to interact with the neural network by hovering over shapes.

**Location:** Lines 923-948

#### How It Works:

1. **Mouse Tracking:**
   - `paper.view.onMouseMove` event listener
   - Tracks current frame count for cooldown checks
   - Maintains `lastHoveredShape` to prevent repeated firing

2. **Hit Detection:**
   ```typescript
   paper.project.hitTest(event.point, {
     fill: true,      // Detect filled shapes
     stroke: true,    // Detect strokes
     tolerance: 5     // 5px detection radius
   })
   ```

3. **Fire Trigger:**
   - Finds which shape in `shapes` array was hit
   - Checks if it's different from last hovered shape
   - Calls `fireShape(hoveredShape, currentFrameCount)`
   - Respects cooldown system (won't fire if recently fired)

4. **Reset:**
   - When mouse moves away from all shapes
   - Sets `lastHoveredShape = null`
   - Next hover will trigger fire again

#### User Experience:
- Hover over any shape (circle, rectangle, triangle) to make it fire
- Shape glows and sends pulses to connected neighbors
- Creates interactive chain reactions
- Cooldown prevents spam (3 second minimum between fires)
- Seamlessly integrates with random automatic firing

**Customizing Interaction:**
```typescript
// Adjust detection sensitivity
tolerance: 10        // Easier to trigger (default: 5)

// Disable mouse interaction
// Comment out the entire onMouseMove handler

// Bypass cooldown for mouse (not recommended)
// Remove cooldown check in fireShape() for mouse events
```

---

## Connection Management

### Initial Connection Creation
**Function:** `createConnections()` (lines 447-488)

**Rules:**
1. Only connect shapes within `maxConnectionDistance` (150px)
2. Only connect toward top-right (dx > 0 OR dy < 0)
3. 30% probability per valid pair
4. Avoid duplicate and self-connections

### Connection Regeneration
**Function:** `regenerateConnectionsForShape()` (lines 496-564)

When a shape regenerates, connections are rebuilt in both directions:

**Outgoing:** New shape → Other shapes
**Incoming:** Other shapes → New shape

This maintains full network connectivity as shapes evolve.

### Connection Validation
**Runs every frame** (lines 817-829)

Checks each connection's shapes are still valid:
- Shape exists
- Shape is in shapes array
- Both start and end are valid

Invalid connections are removed with pulse cleanup.

---

## Color System

### Defined Colors (lines 51-58):
```typescript
colors = {
  primaryLight: '#004B72',   // Dark blue
  secondary: '#3E9FD4',      // Light blue
  accent: '#F0000F',         // Red
  accentDark: '#E00514',     // Dark red
  tertiary: '#006BA5',       // Medium blue
  white: '#FFFFFF',          // White
}
```

### Color Distribution:
- **Shapes:** Cycle through all 5 colors equally
- **Connections:** Use `secondary` (#3E9FD4) as base
- **Pulses:** Morph from source to target shape color
- **Guides:** Red center line, green boundaries

---

## Equal Distribution System

**Purpose:** Ensures visual balance over time.

### Counters (lines 566-569):
```typescript
shapeTypeCounter: number    // Cycles: circle, rect, triangle
colorCounter: number        // Cycles through 5 colors
strokeWidthCounter: number  // Cycles: 1, 2, 5
```

### Distribution Logic:
```typescript
// Shape type (3 options)
type = shapeTypes[counter % 3]

// Color (5 options)
color = colorOptions[counter % 5]

// Stroke width (3 options)
strokeWidth = strokeWidthOptions[counter % 3]
```

**Result:** Over time, you get:
- 33.3% circles, 33.3% rectangles, 33.3% triangles
- 20% of each color
- 33.3% of each stroke width

---

## Performance Considerations

### Optimization Strategies:

1. **Connection Validation:** Only checks every frame, doesn't rebuild
2. **Pulse Cleanup:** Removes completed pulses immediately
3. **Shape Reuse:** Regenerates instead of creating new objects
4. **Color Caching:** Uses originalStrokeColor to avoid lookups
5. **Cooldown System:** Limits active fires and pulses

### Typical Performance:
- **Shapes:** ~150-300 active shapes
- **Connections:** ~200-500 connections
- **Active Pulses:** 0-10 at any time (cooldown limited)
- **Frame Rate:** Solid 60fps on modern hardware

### If Performance Issues:
```typescript
// Reduce shape count
minDistance = 80
spacing = 10

// Reduce connections
maxConnectionDistance = 100
connectionProbability = 0.2

// Reduce firing
Math.random() < 0.001
fireCooldown: 300
```

---

## Customization Guide

### Quick Adjustments

#### Make Shapes More Dense:
```typescript
// Line 63
minDistance = 40;

// Line 110
const spacing = 0.5;
```

#### Change Movement Speed:
```typescript
// Lines 425-426
floatSpeedY: 0.04 + Math.random() * 0.04  // Faster
floatSpeedX: 0.02 + Math.random() * 0.02  // Faster
```

#### Adjust Lifecycle Duration:
```typescript
// Line 431
lifespan: 600 + Math.random() * 600  // 10-20 seconds
```

#### Change Firing Frequency:
```typescript
// Line 740
Math.random() < 0.005  // More fires

// Line 442
fireCooldown: 120  // 2 second cooldown
```

#### Modify Connection Distance:
```typescript
// Line 444
const maxConnectionDistance = 200;  // Longer connections
```

#### Change Pulse Speed:
```typescript
// Line 728
speed: 0.04  // Twice as fast
```

### Visual Style Changes

#### Different Color Scheme:
```typescript
// Lines 51-58
const colors = {
  primaryLight: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
  accent: '#YOUR_COLOR',
  // ...
}
```

#### Thicker/Thinner Lines:
```typescript
// Line 92 (stroke width options)
const strokeWidthOptions = [2, 3, 6];

// Line 514 (connections)
strokeWidth: 1,

// Line 876 (pulses)
strokeWidth: 3,
```

#### Hide Sine Wave Guides:
```typescript
// Line 259
const showGuides = false;
```

---

## Troubleshooting

### Issue: Too many shapes firing
**Solution:**
```typescript
// Reduce random fire rate
Math.random() < 0.001

// Increase cooldown
fireCooldown: 300
```

### Issue: Shapes not connecting after regeneration
**Cause:** Connection regeneration not running
**Check:** `regenerateConnectionsForShape()` called at line 701

### Issue: Pulses not visible
**Check:**
- Pulse segment created (line 872)
- Opacity not too low (line 898)
- Colors not identical (source vs target)

### Issue: Performance drops over time
**Possible causes:**
- Too many active pulses (check cooldown)
- Invalid connections not being cleaned (check lines 821-828)
- Shape count too high (reduce density)

### Issue: Shapes not fading in/out
**Check:**
- Fade durations set (lines 756-757)
- Opacity being applied (line 768)
- Lifecycle timing correct (lines 761-767)

---

## Code Structure

```
PaperCanvasExact.astro
├── HTML & Styles (lines 1-30)
│   └── Canvas container with fixed positioning
│
├── Colors Definition (lines 51-58)
│
├── Shape Generation (lines 60-174)
│   ├── generateShapesInDiagonalBand()
│   └── Diagonal sine wave positioning
│
├── Sine Wave Guides (lines 178-256)
│   └── drawSineWaveBand() [Optional visualization]
│
├── Shape Creation (lines 345-446)
│   ├── Create Paper.js paths
│   ├── Store shape data
│   └── Initialize lifecycle
│
├── Connection System (lines 447-564)
│   ├── createConnections()
│   └── regenerateConnectionsForShape()
│
├── Distribution Counters (lines 566-569)
│
├── Easing Functions (lines 571-573)
│
├── Shape Regeneration (lines 575-702)
│   └── regenerateShape()
│
├── Fire System (lines 704-733)
│   └── fireShape()
│
└── Animation Loop (lines 735-910)
    ├── Random fire trigger
    ├── Shape updates
    │   ├── Lifecycle management
    │   ├── Fade in/out
    │   ├── Fire glow effect
    │   └── Floating animation
    └── Connection updates
        ├── Validation
        ├── Position updates
        └── Pulse animation
```

---

## Dependencies

### Required:
- **Paper.js** (`paper`): Vector graphics scripting
- Imported at line 33

### Browser Requirements:
- HTML5 Canvas support
- RequestAnimationFrame support
- Modern JavaScript (ES6+)

### Installation:
```bash
npm install paper
# or
bun add paper
```

---

## Future Enhancement Ideas

1. **Interactive Features:**
   - Click to trigger fires
   - Drag shapes to new positions
   - Pause/resume animation

2. **Advanced Effects:**
   - Particle trails on pulses
   - Glow/blur filters when firing
   - Connection thickness based on activity

3. **Configuration UI:**
   - Sliders for density, speed, fire rate
   - Color picker for custom palettes
   - Toggle individual features

4. **Performance:**
   - WebGL rendering for more shapes
   - Spatial partitioning for connections
   - Object pooling for pulses

5. **Biological Realism:**
   - Synaptic weights (connection strength)
   - Neurotransmitter types (different colors)
   - Refractory periods (longer cooldowns)
   - Inhibitory connections (prevent firing)

---

## Version History

**Current Version:** 1.0.0

### Features Implemented:
✅ Diagonal sine wave shape distribution
✅ Three shape types with rounded corners
✅ Organic floating animation with easing
✅ Shape lifecycle with fade in/out
✅ Automatic regeneration with jitter
✅ Equal distribution system
✅ Neural network connections
✅ Directional connectivity (bottom-left to top-right)
✅ Neural firing system
✅ Traveling pulses
✅ Color morphing pulses
✅ Fire cooldown system
✅ Connection management and validation

---

## License & Credits

**Component:** Neural Network Background
**Author:** Built with Claude Code
**Technology:** Paper.js, Astro
**License:** Project-specific

---

## Support & Questions

For issues or questions about this component:
1. Check the Troubleshooting section
2. Review customization examples
3. Inspect browser console for errors
4. Verify Paper.js is loaded correctly

---

*Last Updated: 2025-10-27*
*Documentation Version: 1.0*
