/**
 * One-time initialisation guard.
 *
 * Section-tracking on the homepage must initialise exactly once. This encodes
 * the guard against the historical 4x double-init: the first claim for a given
 * key returns true; every subsequent claim returns false.
 */
export function claimInitOnce(
  store: Record<string, string | undefined>,
  key = 'cvSectionInit'
): boolean {
  if (store[key]) return false;
  store[key] = 'true';
  return true;
}
