import { describe, it, expect } from 'vitest';
import { splitEmail, assembleEmail, buildMailto, obfuscateEmail } from '../../src/utils/email';

describe('email helpers', () => {
  it('splits into [user, domain]', () => {
    expect(splitEmail('a.b@x.com')).toEqual(['a.b', 'x.com']);
  });
  it('handles a missing @', () => {
    expect(splitEmail('nope')).toEqual(['nope', '']);
  });
  it('splits only on the first @', () => {
    expect(splitEmail('a@b@c')).toEqual(['a', 'b@c']);
  });
  it('assembles user + domain', () => {
    expect(assembleEmail('a.b', 'x.com')).toBe('a.b@x.com');
  });
  it('round-trips split -> assemble', () => {
    const [u, d] = splitEmail('user.name@example.com');
    expect(assembleEmail(u, d)).toBe('user.name@example.com');
  });
  it('builds a mailto href', () => {
    expect(buildMailto('a', 'b.com')).toBe('mailto:a@b.com');
  });
  it('obfuscates the @ for display', () => {
    expect(obfuscateEmail('a@b.com')).toBe('a [@] b.com');
  });
});
