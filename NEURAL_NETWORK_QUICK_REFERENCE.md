# Neural Network Background - Quick Reference

Quick guide for common customizations and adjustments.

---

## Common Adjustments

### 🎨 Visual Density

#### More Shapes (Denser)
```typescript
// Line 63
minDistance = 40;

// Line 110
spacing = 0.5;

// Line 128
if (x >= 20 && x <= paper.view.size.width - 20 &&
    y >= 20 && y <= paper.view.size.height - 20 &&
```

#### Fewer Shapes (Sparse)
```typescript
// Line 63
minDistance = 100;

// Line 110
spacing = 15;
```

---

### ⚡ Animation Speed

#### Faster Movement
```typescript
// Lines 425-426
floatSpeedY: 0.04 + Math.random() * 0.04,
floatSpeedX: 0.02 + Math.random() * 0.02,
```

#### Slower Movement
```typescript
// Lines 425-426
floatSpeedY: 0.01 + Math.random() * 0.01,
floatSpeedX: 0.005 + Math.random() * 0.005,
```

#### Faster Pulses
```typescript
// Line 728
speed: 0.04,  // Double speed
```

---

### 🔥 Firing Frequency

#### More Active Neural Network
```typescript
// Line 740
Math.random() < 0.006  // ~0.36 fires/second

// Line 442
fireCooldown: 90,  // 1.5 second cooldown
```

#### Calmer Neural Network
```typescript
// Line 740
Math.random() < 0.001  // ~0.06 fires/second

// Line 442
fireCooldown: 360,  // 6 second cooldown
```

#### Disable Random Fires (Only Chain Reactions)
```typescript
// Line 740
if (false) {  // Disable random firing
```

---

### ⏱️ Lifecycle Duration

#### Longer Lives
```typescript
// Line 431
lifespan: 600 + Math.random() * 600,  // 10-20 seconds
```

#### Shorter Lives
```typescript
// Line 431
lifespan: 180 + Math.random() * 180,  // 3-6 seconds
```

#### Instant Transitions (No Fade)
```typescript
// Lines 756-757
fadeInDuration: 1,
fadeOutDuration: 1,
```

---

### 🔗 Connection Behavior

#### More Connections
```typescript
// Line 444
maxConnectionDistance = 200,

// Line 445
connectionProbability = 0.5,
```

#### Fewer Connections
```typescript
// Line 444
maxConnectionDistance = 100,

// Line 445
connectionProbability = 0.15,
```

#### Thicker Connections
```typescript
// Line 514
strokeWidth: 2,

// Line 876 (pulses)
strokeWidth: 4,
```

---

### 🎨 Colors

#### Change Color Palette
```typescript
// Lines 51-58
const colors = {
  primaryLight: '#YOUR_HEX',
  secondary: '#YOUR_HEX',
  accent: '#YOUR_HEX',
  accentDark: '#YOUR_HEX',
  tertiary: '#YOUR_HEX',
  white: '#YOUR_HEX',
};
```

#### Monochrome Theme
```typescript
const colors = {
  primaryLight: '#333333',
  secondary: '#666666',
  accent: '#999999',
  accentDark: '#444444',
  tertiary: '#555555',
  white: '#CCCCCC',
};
```

---

### 📐 Shape Sizes

#### Larger Shapes
```typescript
// Line 90
const sizes = {
  circle: [20, 30, 15],
  rect: [20, 35, 25],
  triangle: [25, 20, 30]
};
```

#### Smaller Shapes
```typescript
// Line 90
const sizes = {
  circle: [8, 12, 6],
  rect: [8, 15, 10],
  triangle: [10, 8, 12]
};
```

---

### 🎯 Position Jitter

#### More Jitter (More Movement on Regeneration)
```typescript
// Lines 572-573
const jitterX = (Math.random() - 0.5) * 100;  // ±50px
const jitterY = (Math.random() - 0.5) * 100;
```

#### Less Jitter (Stay Closer to Original)
```typescript
// Lines 572-573
const jitterX = (Math.random() - 0.5) * 20;   // ±10px
const jitterY = (Math.random() - 0.5) * 20;
```

---

## Toggle Features

### Show/Hide Sine Wave Guides
```typescript
// Line 259
const showGuides = true;   // Show
const showGuides = false;  // Hide
```

### Disable Connections
```typescript
// After line 492, comment out:
// createConnections();
```

### Disable Firing
```typescript
// Line 740-742, comment out the entire block
/*
if (Math.random() < 0.003) {
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  fireShape(randomShape, time);
}
*/
```

### Disable Shape Lifecycle
```typescript
// Line 431
lifespan: 999999,  // Essentially infinite
```

### Disable Mouse Interaction
```typescript
// Lines 926-948, comment out the entire block
/*
paper.view.onMouseMove = (event: any) => {
  // ... entire handler
};
*/
```

### Adjust Mouse Detection Sensitivity
```typescript
// Line 930
tolerance: 10    // Easier to hover (default: 5)
tolerance: 2     // Harder to hover (more precise)
```

---

## Performance Tuning

### Reduce for Better Performance
```typescript
minDistance = 80              // Fewer shapes
maxConnectionDistance = 100   // Fewer connections
connectionProbability = 0.2   // Fewer connections
fireCooldown: 300             // Less firing activity
```

### Maximum Visual Impact (May Impact Performance)
```typescript
minDistance = 30              // Many shapes
maxConnectionDistance = 200   // Many connections
connectionProbability = 0.4   // Dense network
Math.random() < 0.008         // Frequent firing
```

---

## Preset Configurations

### 🌊 Calm Ocean Theme
```typescript
// Colors: Blues and teals
primaryLight: '#003D5C'
secondary: '#00A8CC'
accent: '#00D9FF'

// Slow, gentle movement
floatSpeedY: 0.01 + Math.random() * 0.01
floatSpeedX: 0.005 + Math.random() * 0.005

// Rare firing
Math.random() < 0.001
fireCooldown: 480
```

### ⚡ Electric Storm Theme
```typescript
// Colors: Purples and electric blue
primaryLight: '#1E1E3F'
secondary: '#8B00FF'
accent: '#00FFFF'

// Fast movement
floatSpeedY: 0.05 + Math.random() * 0.05
floatSpeedX: 0.03 + Math.random() * 0.03

// Frequent firing
Math.random() < 0.01
fireCooldown: 60
speed: 0.05  // Fast pulses
```

### 🔥 Minimal Modern Theme
```typescript
// Grayscale with accent
primaryLight: '#1A1A1A'
secondary: '#666666'
accent: '#FF3366'
white: '#E5E5E5'

// Sparse distribution
minDistance = 90
spacing = 12

// Minimal connections
maxConnectionDistance = 120
connectionProbability = 0.2

// Occasional firing
Math.random() < 0.002
```

---

## Debug Mode

### Show Shape Info
Add console logs at line 448:
```typescript
console.log(`Shape ${index}: Type=${type}, Color=${strokeColor}, Age=${age}`);
```

### Show Connection Count
Add at line 493:
```typescript
setInterval(() => {
  console.log(`Connections: ${connections.length}`);
}, 5000);
```

### Show Fire Events
Add at line 721:
```typescript
console.log(`🔥 Shape fired at frame ${currentFrame}`);
```

---

## Common Locations

| Feature | Line Number |
|---------|-------------|
| Shape density | 63, 110 |
| Movement speed | 425-426 |
| Lifecycle duration | 431 |
| Fire rate | 740 |
| Fire cooldown | 442 |
| Connection distance | 444 |
| Pulse speed | 728 |
| Mouse interaction | 926-948 |
| Mouse sensitivity | 930 |
| Colors | 51-58 |
| Shape sizes | 90 |
| Jitter amount | 572-573 |
| Fade duration | 756-757 |
| Show guides | 259 |

---

## File Structure

```
cv-astro/
├── src/
│   └── components/
│       └── Background/
│           └── PaperCanvasExact.astro  ← Main file
│
├── NEURAL_NETWORK_BACKGROUND.md        ← Full documentation
└── NEURAL_NETWORK_QUICK_REFERENCE.md   ← This file
```

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Too many shapes firing | Increase `fireCooldown` (line 442) |
| No shapes appearing | Check browser console for errors |
| Connections not showing | Increase `connectionProbability` (line 445) |
| Animation too fast | Reduce `floatSpeed` values (lines 425-426) |
| Shapes overlap too much | Increase `minDistance` (line 63) |
| Pulses not visible | Check colors aren't identical, increase `strokeWidth` (line 876) |
| Mouse hover not firing shapes | Increase `tolerance` (line 930), check console for errors |
| Mouse firing too sensitive | Decrease `tolerance` to 2-3 (line 930) |
| Mouse interaction laggy | Disable mouse handler or reduce shape count |

---

*Quick Reference v1.0 - Last Updated: 2025-10-27*
