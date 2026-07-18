#!/usr/bin/env node
/**
 * Build-output regression checks. Run AFTER `astro build`, against dist/.
 * Asserts prerendering, the 404/sitemap/tune contracts, the PDF, that the
 * plaintext email is assembled at runtime (never shipped), and that rendered
 * body text has no em-dashes.
 *
 * Exits non-zero on any failure.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = resolve(process.cwd(), 'dist');
const failures = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const check = (cond, msg) => (cond ? ok(msg) : failures.push(msg));

const read = (p) => readFileSync(join(DIST, p), 'utf8');

// Recursively collect files with the given extensions under dist/.
function collect(dir, exts, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collect(full, exts, acc);
    else if (exts.some((e) => entry.name.endsWith(e))) acc.push(full);
  }
  return acc;
}

console.log('Build-output checks (dist/):');

// 1. Homepage prerendered, content-full (no SSR stub).
check(existsSync(join(DIST, 'index.html')), 'dist/index.html exists');
if (existsSync(join(DIST, 'index.html'))) {
  const html = read('index.html');
  check(html.length > 15000, `index.html is content-full (${html.length} bytes)`);
  check(
    html.includes('Get in Touch') && html.includes('Experience') && html.includes('Farshid'),
    'index.html contains rendered sections (prerendered, not an SSR stub)'
  );
  check(!/data-astro-reload|__astro_ssr/.test(html), 'index.html is static (no SSR placeholder)');
}

// 2. 404 exists + noindex.
check(existsSync(join(DIST, '404.html')), 'dist/404.html exists');
if (existsSync(join(DIST, '404.html'))) {
  check(read('404.html').includes('noindex'), '404.html is noindex');
}

// 3. Sitemap exists, excludes /tune and social-image utility pages.
check(existsSync(join(DIST, 'sitemap-index.xml')), 'sitemap-index.xml exists');
const sitemaps = collect(DIST, ['.xml'])
  .filter((p) => p.includes('sitemap'))
  .map((p) => readFileSync(p, 'utf8'))
  .join('\n');
for (const bad of ['/tune', 'og-image', 'linkedin-header', 'twitter-header']) {
  check(!sitemaps.includes(bad), `sitemap excludes ${bad}`);
}

// 4. Dev-only pages must NOT ship to production (injected only in `astro dev`).
for (const p of ['tune', 'og-image', 'linkedin-header', 'twitter-header']) {
  check(!existsSync(join(DIST, p)), `dev-only page /${p} is absent from the production build`);
}

// 5. PDF exists + > 400KB.
check(existsSync(join(DIST, 'farshid-pourlatifi.pdf')), 'CV PDF exists');
if (existsSync(join(DIST, 'farshid-pourlatifi.pdf'))) {
  const kb = statSync(join(DIST, 'farshid-pourlatifi.pdf')).size / 1024;
  check(kb > 400, `CV PDF is > 400KB (${kb.toFixed(0)}KB)`);
}

// 6. The plaintext email must not ship in any HTML/JS (it's assembled at
// runtime). Sourced from personal.json — not hardcoded here.
const PLAIN_EMAIL = JSON.parse(
  readFileSync(resolve(process.cwd(), 'src/data/personal.json'), 'utf8')
).email;
const assets = collect(DIST, ['.html', '.js']);
const emailHit = assets.find((p) => readFileSync(p, 'utf8').includes(PLAIN_EMAIL));
check(
  !emailHit,
  `plaintext email absent from shipped HTML/JS${emailHit ? ` (found in ${emailHit})` : ''}`
);

// Em-dashes in rendered body text only (head + scripts legitimately use the
// "Name — Role" convention for <title>/og:title and the console banner).
const stripHeadAndScripts = (html) =>
  html
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');
for (const p of collect(DIST, ['.html'])) {
  const body = stripHeadAndScripts(readFileSync(p, 'utf8'));
  check(!body.includes('—'), `no em-dash in rendered body of ${p.replace(DIST, 'dist')}`);
}

// 7. JS budgets (gzip): total <= 200KB; the Paper.js chunk <= 130KB (must not creep).
const jsFiles = existsSync(join(DIST, '_astro')) ? collect(join(DIST, '_astro'), ['.js']) : [];
let totalGz = 0;
let paperGz = 0;
for (const f of jsFiles) {
  const gz = gzipSync(readFileSync(f)).length;
  totalGz += gz;
  if (/paper-full/.test(f)) paperGz = gz;
}
check(totalGz <= 200 * 1024, `total JS <= 200KB gzip (${(totalGz / 1024).toFixed(0)}KB)`);
check(
  paperGz > 0 && paperGz <= 130 * 1024,
  `Paper.js chunk <= 130KB gzip (${(paperGz / 1024).toFixed(0)}KB)`
);

console.log('');
if (failures.length) {
  console.error(`✗ ${failures.length} build-output check(s) failed:`);
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log(`✓ All build-output checks passed.`);
