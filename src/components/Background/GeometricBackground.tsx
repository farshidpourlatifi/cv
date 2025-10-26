/**
 * GeometricBackground Component
 *
 * Animated background using p5.js with geometric shapes
 * Based on the Geometric Constellation algorithm
 */

import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface GeometricBackgroundProps {
  seed?: number;
  shapeCount?: number;
  driftSpeed?: number;
  noiseScale?: number;
  breathingRate?: number;
  accentProb?: number;
}

export default function GeometricBackground({
  seed = 12345,
  shapeCount = 40,
  driftSpeed = 0.5,
  noiseScale = 0.003,
  breathingRate = 0.02,
  accentProb = 0.15
}: GeometricBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // CV Color Palette
    const colors = {
      bg: '#0A3A52',
      blueDark: '#004B72',
      blueMid: '#006BA5',
      blueLight: '#3E9FD4',
      accent: '#F0000F',
      white: '#FFFFFF'
    };

    // Geometric Shape Class
    class GeometricShape {
      x: number;
      y: number;
      index: number;
      type: 'circle' | 'rect' | 'triangle';
      size: number;
      color: string;
      strokeWeight: number;
      noiseOffsetX: number;
      noiseOffsetY: number;
      rotation: number;
      rotationSpeed: number;
      breathPhase: number;
      breathAmplitude: number;
      homeX: number;
      homeY: number;
      maxDrift: number;
      currentScale: number = 1;

      constructor(p: p5, x: number, y: number, index: number) {
        this.x = x;
        this.y = y;
        this.index = index;

        // Shape type based on distribution
        const typeRand = p.random();
        if (typeRand < 0.4) {
          this.type = 'circle';
        } else if (typeRand < 0.7) {
          this.type = 'rect';
        } else {
          this.type = 'triangle';
        }

        // Size based on type
        const baseSize = 30;
        if (this.type === 'circle') {
          this.size = p.random(baseSize * 0.5, baseSize * 2);
        } else if (this.type === 'rect') {
          this.size = p.random(baseSize * 0.7, baseSize * 1.5);
        } else {
          this.size = p.random(baseSize * 0.6, baseSize * 1.2);
        }

        // Color selection
        const colorRand = p.random();
        if (colorRand < accentProb) {
          this.color = colors.accent;
          this.strokeWeight = 3;
        } else if (colorRand < 0.3) {
          this.color = colors.white;
          this.strokeWeight = 2;
        } else if (colorRand < 0.5) {
          this.color = colors.blueLight;
          this.strokeWeight = 2;
        } else if (colorRand < 0.75) {
          this.color = colors.blueMid;
          this.strokeWeight = 3;
        } else {
          this.color = colors.blueDark;
          this.strokeWeight = 4;
        }

        // Movement parameters
        this.noiseOffsetX = p.random(1000);
        this.noiseOffsetY = p.random(1000);
        this.rotation = p.random(p.TWO_PI);
        this.rotationSpeed = p.random(-0.01, 0.01) * (20 / this.size);

        // Breathing parameters
        this.breathPhase = p.random(p.TWO_PI);
        this.breathAmplitude = p.random(0.05, 0.15);

        // Drift boundaries
        this.homeX = x;
        this.homeY = y;
        this.maxDrift = 60;
      }

      update(p: p5, time: number) {
        // Noise-based drift
        const noiseX = p.noise(this.noiseOffsetX + time * noiseScale);
        const noiseY = p.noise(this.noiseOffsetY + time * noiseScale);

        // Map noise to drift
        const driftX = p.map(noiseX, 0, 1, -this.maxDrift, this.maxDrift);
        const driftY = p.map(noiseY, 0, 1, -this.maxDrift, this.maxDrift);

        // Apply drift with speed factor
        this.x = this.homeX + driftX * driftSpeed;
        this.y = this.homeY + driftY * driftSpeed;

        // Keep shapes on screen with wrapping
        if (this.x < -this.size) this.x = p.width + this.size;
        if (this.x > p.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = p.height + this.size;
        if (this.y > p.height + this.size) this.y = -this.size;

        // Update rotation
        this.rotation += this.rotationSpeed * driftSpeed;

        // Breathing scale
        this.currentScale = 1 + p.sin(this.breathPhase + time * breathingRate) * this.breathAmplitude;
      }

      draw(p: p5) {
        p.push();
        p.translate(this.x, this.y);
        p.rotate(this.rotation);
        p.scale(this.currentScale);

        p.noFill();
        p.stroke(this.color);
        p.strokeWeight(this.strokeWeight);

        if (this.type === 'circle') {
          p.circle(0, 0, this.size);
        } else if (this.type === 'rect') {
          p.rectMode(p.CENTER);
          const cornerRadius = this.size * 0.1;
          p.rect(0, 0, this.size, this.size, cornerRadius);
        } else if (this.type === 'triangle') {
          const h = this.size * 0.866; // height of equilateral triangle
          p.triangle(
            0, -h/2,
            -this.size/2, h/2,
            this.size/2, h/2
          );
        }

        p.pop();
      }
    }

    // p5.js sketch
    const sketch = (p: p5) => {
      let shapes: GeometricShape[] = [];
      let time = 0;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent(containerRef.current!);

        // Seed randomness
        p.randomSeed(seed);
        p.noiseSeed(seed);

        // Initialize shapes
        initializeShapes();
      };

      const initializeShapes = () => {
        shapes = [];

        // Create shapes using Fibonacci distribution
        const goldenRatio = 1.618033988749895;
        const angleStep = p.TWO_PI * goldenRatio;

        for (let i = 0; i < shapeCount; i++) {
          const angle = i * angleStep;
          const radius = p.sqrt(i / shapeCount) * p.min(p.width, p.height) * 0.45;

          // Spiral distribution from center
          let x = p.width/2 + p.cos(angle) * radius;
          let y = p.height/2 + p.sin(angle) * radius;

          // Add randomness
          x += p.random(-50, 50);
          y += p.random(-50, 50);

          shapes.push(new GeometricShape(p, x, y, i));
        }

        time = 0;
        p.background(colors.bg);
      };

      p.draw = () => {
        // Fade background for trails
        p.push();
        (p as any).drawingContext.globalAlpha = 0.05;
        p.fill(colors.bg);
        p.noStroke();
        p.rect(0, 0, p.width, p.height);
        p.pop();

        // Update and draw shapes
        for (const shape of shapes) {
          shape.update(p, time);
          shape.draw(p);
        }

        // Increment time
        time++;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initializeShapes();
      };
    };

    // Create p5 instance
    p5Instance.current = new p5(sketch);

    // Cleanup
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [seed, shapeCount, driftSpeed, noiseScale, breathingRate, accentProb]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
