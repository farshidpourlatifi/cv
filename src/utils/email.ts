/**
 * Email assembly helpers.
 *
 * The plain address is never shipped as a single literal — it's split into
 * parts and reassembled at runtime (contact CTA + branded console). These pure
 * functions encode that assembly so it can be unit-tested and reused.
 */

/** Split an address into [user, domain]. */
export function splitEmail(email: string): [string, string] {
  const at = email.indexOf('@');
  if (at < 0) return [email, ''];
  return [email.slice(0, at), email.slice(at + 1)];
}

/** Reassemble a plain address from split parts (matches the runtime CTA). */
export function assembleEmail(user: string, domain: string): string {
  return `${user}@${domain}`;
}

/** Build a mailto: href from split parts. */
export function buildMailto(user: string, domain: string): string {
  return `mailto:${assembleEmail(user, domain)}`;
}

/** Obfuscate the @ for display (anti-scraper): "user@host" -> "user [@] host". */
export function obfuscateEmail(email: string): string {
  return email.replace('@', ' [@] ');
}
