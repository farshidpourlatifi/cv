import { describe, it, expect } from 'vitest';
import { claimInitOnce } from '../../src/utils/section-init';

describe('claimInitOnce — idempotent section init', () => {
  it('returns true once, then false forever (guards the historical 4x double-init)', () => {
    const store: Record<string, string | undefined> = {};
    expect(claimInitOnce(store)).toBe(true);
    expect(claimInitOnce(store)).toBe(false);
    expect(claimInitOnce(store)).toBe(false);
    expect(claimInitOnce(store)).toBe(false);
  });

  it('is per-key', () => {
    const store: Record<string, string | undefined> = {};
    expect(claimInitOnce(store, 'a')).toBe(true);
    expect(claimInitOnce(store, 'b')).toBe(true);
    expect(claimInitOnce(store, 'a')).toBe(false);
  });

  it('works against a real DOMStringMap (element dataset)', () => {
    const el = document.createElement('div');
    expect(claimInitOnce(el.dataset)).toBe(true);
    expect(claimInitOnce(el.dataset)).toBe(false);
    expect(el.dataset.cvSectionInit).toBe('true');
  });
});
