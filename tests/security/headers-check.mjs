#!/usr/bin/env node
/**
 * Security-header checks against a live URL. Netlify serves the headers from
 * netlify.toml, so this runs against a deploy (preview or production), not the
 * local dev server.
 *
 *   TEST_URL=https://deploy-preview-123--site.netlify.app node tests/security/headers-check.mjs
 *
 * Defaults to production. Asserts CSP / X-Frame-Options / X-Content-Type-Options
 * / Referrer-Policy / Permissions-Policy on the homepage, a 404, and the PDF,
 * and that every external <a> in the HTML has rel="noopener". Exits non-zero on
 * any failure.
 */
const BASE = (process.env.TEST_URL || 'https://farshid.is-a.dev').replace(/\/$/, '');
const failures = [];
const ok = (m) => console.log(`  ✓ ${m}`);
const check = (cond, m) => (cond ? ok(m) : failures.push(m));

const REQUIRED = {
  'content-security-policy': (v) =>
    v.includes("default-src 'self'") &&
    v.includes("frame-ancestors 'none'") &&
    v.includes("object-src 'none'") &&
    !v.includes('cdnjs'),
  'x-frame-options': (v) => v.toUpperCase() === 'DENY',
  'x-content-type-options': (v) => v.toLowerCase() === 'nosniff',
  'referrer-policy': (v) => v.length > 0,
  'permissions-policy': (v) => v.length > 0,
};

async function checkHeaders(path, label) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  } catch (e) {
    failures.push(`${label}: request failed (${e.message})`);
    return null;
  }
  for (const [name, ok] of Object.entries(REQUIRED)) {
    const val = res.headers.get(name);
    check(val != null && ok(val), `${label}: ${name} present and valid${val ? '' : ' (MISSING)'}`);
  }
  return res;
}

console.log(`Security headers @ ${BASE}`);

const home = await checkHeaders('/', 'homepage');
await checkHeaders('/this-route-does-not-exist-xyz', '404');
await checkHeaders('/farshid-pourlatifi.pdf', 'pdf');

// External links must carry rel="noopener".
if (home && home.ok) {
  const html = await home.clone().text();
  const anchors = [...html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"[^>]*>/gi)];
  const origin = new URL(BASE).origin;
  const external = anchors.filter((m) => !m[1].startsWith(origin));
  const missing = external.filter((m) => !/rel="[^"]*noopener[^"]*"/i.test(m[0]));
  check(missing.length === 0, `all ${external.length} external link(s) have rel="noopener"`);
  if (missing.length) missing.forEach((m) => console.error(`    - ${m[0].slice(0, 90)}`));
}

console.log('');
if (failures.length) {
  console.error(`✗ ${failures.length} security check(s) failed:`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log('✓ All security-header checks passed.');
