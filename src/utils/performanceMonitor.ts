/**
 * Performance Monitor
 *
 * Tracks FPS, memory, and provides real-time performance metrics
 * Usage: Import and call startMonitoring() in your canvas initialization
 */

export interface PerformanceMetrics {
  fps: number;
  avgFps: number;
  minFps: number;
  memory: string;
  memoryMB: number;
  droppedFrames: number;
  totalFrames: number;
}

export class PerformanceMonitor {
  private fps: number = 0;
  private frames: number = 0;
  private lastTime: number = performance.now();
  private fpsHistory: number[] = [];
  private maxHistory: number = 60;
  private droppedFrames: number = 0;
  private totalFrames: number = 0;
  private displayElement: HTMLElement | null = null;
  private logInterval: number = 5000; // Log every 5 seconds
  private lastLogTime: number = performance.now();

  constructor(options: { showOverlay?: boolean; logInterval?: number } = {}) {
    if (options.showOverlay) {
      this.createOverlay();
    }
    if (options.logInterval) {
      this.logInterval = options.logInterval;
    }
  }

  /**
   * Creates a visual overlay for real-time performance display
   */
  private createOverlay(): void {
    this.displayElement = document.createElement('div');
    this.displayElement.id = 'perf-monitor';
    this.displayElement.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 4px;
      z-index: 9999;
      pointer-events: none;
      min-width: 200px;
    `;
    document.body.appendChild(this.displayElement);
  }

  /**
   * Call this in your animation loop (paper.view.onFrame)
   */
  update(): void {
    const now = performance.now();
    const delta = now - this.lastTime;

    this.totalFrames++;

    // Detect dropped frames (frame took longer than 16.67ms)
    if (delta > 16.67 * 1.5) {
      this.droppedFrames++;
    }

    if (delta >= 1000) {
      // Update FPS every second
      this.fps = Math.round((this.frames * 1000) / delta);
      this.fpsHistory.push(this.fps);

      if (this.fpsHistory.length > this.maxHistory) {
        this.fpsHistory.shift();
      }

      this.frames = 0;
      this.lastTime = now;

      // Update overlay if enabled
      if (this.displayElement) {
        this.updateOverlay();
      }

      // Log metrics periodically
      if (now - this.lastLogTime >= this.logInterval) {
        this.logMetrics();
        this.lastLogTime = now;
      }
    }

    this.frames++;
  }

  /**
   * Updates the visual overlay with current metrics
   */
  private updateOverlay(): void {
    if (!this.displayElement) return;

    const metrics = this.getMetrics();
    const fpsColor = this.getFpsColor(metrics.fps);

    this.displayElement.innerHTML = `
      <div style="color: ${fpsColor}; font-weight: bold; margin-bottom: 5px;">
        FPS: ${metrics.fps}
      </div>
      <div style="font-size: 11px;">
        Avg: ${metrics.avgFps} | Min: ${metrics.minFps}<br>
        Mem: ${metrics.memory}<br>
        Dropped: ${metrics.droppedFrames}/${metrics.totalFrames} (${this.getDroppedFramePercentage()}%)
      </div>
    `;
  }

  /**
   * Gets color based on FPS performance
   */
  private getFpsColor(fps: number): string {
    if (fps >= 55) return '#00ff00'; // Green
    if (fps >= 40) return '#ffff00'; // Yellow
    if (fps >= 25) return '#ff9900'; // Orange
    return '#ff0000'; // Red
  }

  /**
   * Logs metrics to console
   */
  private logMetrics(): void {
    const metrics = this.getMetrics();

    console.group('📊 Performance Metrics');
    console.log(`FPS: Current=${metrics.fps}, Avg=${metrics.avgFps}, Min=${metrics.minFps}`);
    console.log(`Memory: ${metrics.memory} (${metrics.memoryMB.toFixed(1)}MB)`);
    console.log(`Dropped Frames: ${metrics.droppedFrames}/${metrics.totalFrames} (${this.getDroppedFramePercentage()}%)`);
    console.log(`Performance Rating: ${this.getPerformanceRating()}`);
    console.groupEnd();
  }

  /**
   * Gets current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const avgFps = this.fpsHistory.length > 0
      ? Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
      : 0;
    const minFps = this.fpsHistory.length > 0 ? Math.min(...this.fpsHistory) : 0;

    let memoryMB = 0;
    let memoryStr = 'N/A';

    if ('memory' in performance && (performance as any).memory) {
      const used = (performance as any).memory.usedJSHeapSize / 1048576;
      const total = (performance as any).memory.totalJSHeapSize / 1048576;
      memoryMB = used;
      memoryStr = `${used.toFixed(1)}/${total.toFixed(1)}MB`;
    }

    return {
      fps: this.fps,
      avgFps,
      minFps,
      memory: memoryStr,
      memoryMB,
      droppedFrames: this.droppedFrames,
      totalFrames: this.totalFrames
    };
  }

  /**
   * Gets percentage of dropped frames
   */
  private getDroppedFramePercentage(): string {
    if (this.totalFrames === 0) return '0.0';
    return ((this.droppedFrames / this.totalFrames) * 100).toFixed(1);
  }

  /**
   * Gets overall performance rating
   */
  private getPerformanceRating(): string {
    const metrics = this.getMetrics();
    const droppedPercent = parseFloat(this.getDroppedFramePercentage());

    if (metrics.avgFps >= 55 && droppedPercent < 5) {
      return '🟢 Excellent';
    } else if (metrics.avgFps >= 40 && droppedPercent < 10) {
      return '🟡 Good';
    } else if (metrics.avgFps >= 25 && droppedPercent < 20) {
      return '🟠 Fair';
    } else {
      return '🔴 Poor - Optimization needed';
    }
  }

  /**
   * Removes the overlay from DOM
   */
  destroy(): void {
    if (this.displayElement && this.displayElement.parentElement) {
      this.displayElement.parentElement.removeChild(this.displayElement);
    }
  }

  /**
   * Resets all counters
   */
  reset(): void {
    this.fps = 0;
    this.frames = 0;
    this.fpsHistory = [];
    this.droppedFrames = 0;
    this.totalFrames = 0;
    this.lastTime = performance.now();
    this.lastLogTime = performance.now();
  }
}

/**
 * Simplified function to start monitoring
 */
export function startMonitoring(options: { showOverlay?: boolean; logInterval?: number } = {}) {
  return new PerformanceMonitor(options);
}

/**
 * Device capability detection
 */
export function getDeviceCapabilities() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;
  const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    isMobile,
    isLowEnd,
    hasReducedMotion,
    // Recommended settings based on device
    recommendedShapeCount: isMobile ? 30 : isLowEnd ? 50 : 80,
    shouldEnableBlur: !isMobile && !isLowEnd,
    shouldEnableConnections: true,
    connectionUpdateInterval: isMobile ? 2 : 1, // Update every N frames
    shouldEnableGuides: false, // Guides are for debugging only
  };
}

/**
 * Battery status monitoring (if available)
 */
export async function getBatteryStatus(): Promise<{
  level: number;
  charging: boolean;
  shouldReducePerformance: boolean;
} | null> {
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      return {
        level: battery.level,
        charging: battery.charging,
        shouldReducePerformance: !battery.charging && battery.level < 0.2, // Under 20% and not charging
      };
    } catch (e) {
      console.warn('Battery API not available:', e);
    }
  }
  return null;
}

/**
 * Core Web Vitals tracking
 */
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        console.log('✅ LCP:', lastEntry.startTime.toFixed(0), 'ms', lastEntry.startTime < 2500 ? '(Good)' : '(Needs improvement)');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          console.log('✅ FID:', fid.toFixed(0), 'ms', fid < 100 ? '(Good)' : '(Needs improvement)');
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        }
        console.log('✅ CLS:', clsScore.toFixed(3), clsScore < 0.1 ? '(Good)' : '(Needs improvement)');
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('Could not set up performance observers:', e);
    }
  }

  // Log navigation timing on load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        console.group('⚡ Page Load Performance');
        console.log('DOM Content Loaded:', (perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart).toFixed(0), 'ms');
        console.log('Load Complete:', (perfData.loadEventEnd - perfData.loadEventStart).toFixed(0), 'ms');
        console.log('DOM Interactive:', (perfData.domInteractive - perfData.fetchStart).toFixed(0), 'ms');
        console.log('Total Time:', (perfData.loadEventEnd - perfData.fetchStart).toFixed(0), 'ms');
        console.groupEnd();
      }
    }, 0);
  });
}
