# Performance Testing Guide

## Browser DevTools

### Chrome/Edge DevTools

1. **Performance Tab** (Profiling)
   ```
   1. Open DevTools (F12)
   2. Go to "Performance" tab
   3. Click Record button
   4. Interact with your page (scroll through sections)
   5. Stop recording after 5-10 seconds
   6. Analyze:
      - FPS (should be 60fps, green is good, red is bad)
      - Main thread activity (scripting time)
      - Rendering time
      - GPU activity
   ```

2. **Performance Monitor** (Real-time)
   ```
   1. Open DevTools (F12)
   2. Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
   3. Type "Show Performance Monitor"
   4. Watch in real-time:
      - CPU usage
      - JS heap size (memory)
      - DOM Nodes
      - JS event listeners
      - Layouts/sec (reflows)
   ```

3. **Rendering Tab**
   ```
   1. Open DevTools
   2. Cmd+Shift+P → "Show Rendering"
   3. Enable:
      - Frame Rendering Stats (FPS meter)
      - Paint flashing (shows repaint areas)
      - Layer borders (shows composited layers)
   ```

4. **Lighthouse** (Comprehensive Audit)
   ```
   1. Open DevTools → Lighthouse tab
   2. Select categories:
      - Performance ✓
      - Accessibility ✓
      - Best Practices ✓
   3. Run audit
   4. Review:
      - Performance Score (aim for 90+)
      - First Contentful Paint (FCP)
      - Time to Interactive (TTI)
      - Total Blocking Time (TBT)
      - Cumulative Layout Shift (CLS)
   ```

### Firefox DevTools

1. **Performance Tab**
   ```
   - Similar to Chrome
   - Shows Gecko-specific metrics
   - Better memory profiling
   ```

2. **about:performance**
   ```
   - Type in address bar: about:performance
   - Shows energy impact per tab
   - Firefox-specific metric
   ```

## Command Line Tools

### 1. Lighthouse CLI

```bash
# Install
npm install -g lighthouse

# Run audit
lighthouse http://localhost:4321 --view

# Specific metrics
lighthouse http://localhost:4321 \
  --only-categories=performance \
  --output=json \
  --output-path=./perf-report.json
```

### 2. WebPageTest

```bash
# Online: https://webpagetest.org
# Provides:
- Filmstrip view
- Waterfall chart
- Core Web Vitals
- Multiple location testing
- Device emulation
```

### 3. Chrome DevTools Protocol (Puppeteer)

```javascript
// performance-test.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Enable performance metrics
  await page.evaluateOnNewDocument(() => {
    window.performance.mark('start');
  });

  await page.goto('http://localhost:4321');

  // Wait for page to settle
  await page.waitForTimeout(3000);

  // Get performance metrics
  const metrics = await page.metrics();
  console.log('Performance Metrics:', metrics);

  // Get Core Web Vitals
  const cwv = await page.evaluate(() => {
    return {
      FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      LCP: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
      CLS: 0, // Would need layout shift entries
      FID: 0  // Would need first input delay
    };
  });

  console.log('Core Web Vitals:', cwv);

  await browser.close();
})();
```

## Custom Performance Monitoring

### Add to your page

```javascript
// performance-monitor.js - Add to your project
class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.maxHistory = 60; // Keep last 60 samples
  }

  update() {
    const now = performance.now();
    const delta = now - this.lastTime;

    if (delta >= 1000) { // Update every second
      this.fps = Math.round((this.frames * 1000) / delta);
      this.fpsHistory.push(this.fps);

      if (this.fpsHistory.length > this.maxHistory) {
        this.fpsHistory.shift();
      }

      this.frames = 0;
      this.lastTime = now;

      // Log metrics
      this.logMetrics();
    }

    this.frames++;
  }

  logMetrics() {
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    const minFps = Math.min(...this.fpsHistory);

    console.log('📊 Performance:', {
      current: this.fps,
      average: Math.round(avgFps),
      min: minFps,
      memory: this.getMemoryUsage(),
      cpu: this.getCPUUsage()
    });
  }

  getMemoryUsage() {
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize / 1048576;
      const total = performance.memory.totalJSHeapSize / 1048576;
      return `${used.toFixed(1)}MB / ${total.toFixed(1)}MB`;
    }
    return 'N/A';
  }

  getCPUUsage() {
    // Estimate based on frame time
    const frameTime = 1000 / (this.fps || 1);
    const targetFrameTime = 16.67; // 60fps
    const usage = (frameTime / targetFrameTime) * 100;
    return `~${Math.min(usage, 100).toFixed(0)}%`;
  }

  getReport() {
    return {
      currentFPS: this.fps,
      averageFPS: Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length),
      minFPS: Math.min(...this.fpsHistory),
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }
}

// Usage in your animation loop:
const monitor = new PerformanceMonitor();

paper.view.onFrame = (event) => {
  monitor.update();

  // Your existing animation code...
};
```

## Energy Impact Testing

### macOS Activity Monitor

```
1. Open Activity Monitor
2. Go to "Energy" tab
3. Find your browser process
4. Watch "Energy Impact" column
   - 0-20: Low impact ✅
   - 20-50: Medium impact ⚠️
   - 50+: High impact ❌
```

### Windows Task Manager

```
1. Open Task Manager (Ctrl+Shift+Esc)
2. Go to "Details" tab
3. Add columns:
   - CPU
   - Memory
   - GPU
4. Monitor browser process
```

### Battery Usage Test

```
1. Fully charge laptop
2. Disconnect power
3. Open your page
4. Let it run for 1 hour
5. Check battery percentage drop
   - <10%: Good ✅
   - 10-20%: Acceptable ⚠️
   - >20%: High drain ❌
```

## Performance Budgets

### Recommended Targets

```
FPS: ≥ 60fps (mobile: ≥ 30fps acceptable)
First Contentful Paint (FCP): < 1.8s
Largest Contentful Paint (LCP): < 2.5s
Total Blocking Time (TBT): < 200ms
Cumulative Layout Shift (CLS): < 0.1

Memory: < 50MB for canvas animation
CPU: < 30% average
Energy Impact: < 20 (macOS Activity Monitor)
```

## Continuous Monitoring Setup

### 1. Add Performance Tracking Script

```typescript
// Add to your Astro project
// src/utils/performance.ts

export function trackPerformance() {
  if (typeof window === 'undefined') return;

  // Log Core Web Vitals
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime, 'ms');
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fid = entry.processingStart - entry.startTime;
        console.log('FID:', fid, 'ms');
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }

  // Log navigation timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('⚡ Load Performance:', {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
        totalTime: perfData.loadEventEnd - perfData.fetchStart
      });
    }, 0);
  });
}
```

### 2. Add Real User Monitoring (RUM)

```html
<!-- Add to your layout -->
<script>
  // Simple RUM tracking
  window.addEventListener('load', () => {
    const perf = performance.getEntriesByType('navigation')[0];

    // Send to analytics (optional)
    console.log('📈 RUM Data:', {
      loadTime: perf.loadEventEnd - perf.fetchStart,
      domReady: perf.domContentLoadedEventEnd - perf.fetchStart,
      resources: performance.getEntriesByType('resource').length
    });
  });
</script>
```

## Specific Recommendations for Your Canvas

Based on your PaperCanvasExact.astro, here are performance hotspots:

### High Impact Operations

1. **Shape Generation** (lines 259-749)
   - Bezier calculations every frame
   - Many Math operations

2. **Connection Updates** (lines 1834-1993)
   - Gradient calculations per connection
   - Multiple path updates

3. **Firing Effects** (lines 1581-1614)
   - Pulse animations
   - Color interpolation

### Quick Wins

```javascript
// 1. Reduce shape count based on device
const isMobile = window.innerWidth < 768;
const shapeCount = isMobile ? 30 : 60; // Reduce from current count

// 2. Disable expensive features on mobile
const enableBlur = !isMobile && shapeConfig.blur.enabled;
const enableGuides = !isMobile && showGuides;

// 3. Throttle connection updates
let connectionUpdateCounter = 0;
if (connectionUpdateCounter++ % 2 === 0) {
  // Update connections only every other frame
}

// 4. Use requestAnimationFrame budget
const frameStartTime = performance.now();
const frameBudget = 16; // ms for 60fps

// Skip expensive operations if running out of time
if (performance.now() - frameStartTime < frameBudget) {
  // Update pulses
}
```

## Testing Checklist

- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Check FPS with Performance Monitor (should be 60fps)
- [ ] Test on mobile device (30fps minimum)
- [ ] Monitor memory usage (< 50MB growth per minute)
- [ ] Check battery drain on laptop (< 15% per hour)
- [ ] Test with CPU throttling (DevTools: 4x slowdown)
- [ ] Verify smooth scrolling between sections
- [ ] Check interaction responsiveness (< 100ms)

## Next Steps

1. Measure current performance
2. Identify bottlenecks
3. Apply optimizations
4. Re-measure to validate improvements
5. Consider progressive enhancement (disable heavy features on low-power devices)
