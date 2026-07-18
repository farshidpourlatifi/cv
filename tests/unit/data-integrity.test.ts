import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Data regression guards over src/data/*.json — positioning, structure,
 * generated markers, prose punctuation, and the email display/link invariant.
 */

const DATA_DIR = resolve(process.cwd(), 'src/data');
const FILES = ['personal.json', 'config.json', 'experience.json', 'skills.json'];

const rawOf = (name: string): string => readFileSync(resolve(DATA_DIR, name), 'utf8');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jsonOf = (name: string): any => JSON.parse(rawOf(name));

describe('no em-dashes in prose', () => {
  // Em-dashes are only allowed in the OG title fields ("Name — Role" convention);
  // all prose/body content must use hyphens.
  it('personal / experience / skills contain no em-dash (—)', () => {
    for (const file of ['personal.json', 'experience.json', 'skills.json']) {
      expect(rawOf(file).includes('—'), `em-dash (—) found in ${file}`).toBe(false);
    }
  });
  it('config.json em-dash appears only in og_title / og_image_alt', () => {
    const clone = jsonOf('config.json');
    delete clone.site.og_title;
    delete clone.site.og_image_alt;
    expect(
      JSON.stringify(clone).includes('—'),
      'em-dash (—) in config.json outside the OG title fields'
    ).toBe(false);
  });
});

describe('current role — no unverifiable percentage metric', () => {
  const current = jsonOf('experience.json').positions.find((p: { period: string }) =>
    p.period.includes('Present')
  );
  it('has a current role', () => expect(current).toBeTruthy());
  it('contains no "by 30%" metric', () => {
    expect(JSON.stringify(current).includes('by 30%')).toBe(false);
  });
});

describe('positioning', () => {
  it('personal.json title is exact', () => {
    expect(jsonOf('personal.json').title).toBe(
      'Senior Full-Stack Engineer | Multi-Tenant SaaS · AI Integration · Migrations'
    );
  });
  it('config og_title names the role', () => {
    expect(jsonOf('config.json').site.og_title).toContain('Senior Full-Stack Engineer');
  });
});

describe('generated markers', () => {
  for (const file of FILES) {
    it(`${file} has the _generated marker`, () => {
      const marker = jsonOf(file)._generated;
      expect(typeof marker).toBe('string');
      expect(marker.length).toBeGreaterThan(0);
    });
  }
});

const startYear = (period: string): number => {
  const startPart = (period.split(/\s*[–-]\s*/)[0] ?? '').trim();
  const yearToken = startPart.split(' ').pop() ?? '';
  return parseInt(yearToken, 10) || 0;
};

describe('experience structure', () => {
  const positions = jsonOf('experience.json').positions as Array<{
    company: string;
    period: string;
    employment_type?: string;
  }>;

  it('every position has employment_type', () => {
    for (const p of positions) {
      expect(p.employment_type, `${p.company} missing employment_type`).toBeTruthy();
    }
  });

  it('sorted by start year descending (as rendered) is monotonic, current role first', () => {
    const sorted = [...positions].sort((a, b) => startYear(b.period) - startYear(a.period));
    const years = sorted.map((p) => startYear(p.period));
    for (let i = 1; i < years.length; i++) {
      expect(years[i] as number).toBeLessThanOrEqual(years[i - 1] as number);
    }
    expect((sorted[0] as { period: string }).period.includes('Present')).toBe(true);
  });
});

describe('personal structure', () => {
  const personal = jsonOf('personal.json');
  it('has education with degree/field/institution/period', () => {
    for (const key of ['degree', 'field', 'institution', 'period']) {
      expect(personal.education[key]).toBeTruthy();
    }
  });
  it('has at least one certification', () => {
    expect(Array.isArray(personal.certifications)).toBe(true);
    expect(personal.certifications.length).toBeGreaterThan(0);
  });
  it('has exactly the languages English + Farsi', () => {
    expect(personal.languages.map((l: { language: string }) => l.language).sort()).toEqual([
      'English',
      'Farsi',
    ]);
  });
});

describe('email obfuscation', () => {
  // Sourced from personal.json (already the public source of truth) rather than
  // hardcoded, so no extra plaintext copy lives in this file.
  const ADDR = jsonOf('personal.json').email as string;
  for (const file of FILES) {
    it(`${file} contains the plain address only as personal.json's email field`, () => {
      const occurrences = rawOf(file).split(ADDR).length - 1;
      if (file === 'personal.json') {
        expect(occurrences).toBe(1);
      } else {
        expect(occurrences, `plain address leaked into ${file}`).toBe(0);
      }
    });
  }
});
