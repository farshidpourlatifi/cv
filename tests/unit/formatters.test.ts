import { describe, it, expect } from 'vitest';
import {
  truncate,
  slugify,
  formatEmail,
  formatList,
  getInitials,
  parsePeriod,
  sortByDate,
  formatPeriodDuration,
} from '../../src/utils/formatters';

describe('formatters', () => {
  it('truncate leaves short text; ellipsizes long text', () => {
    expect(truncate('hello', 10)).toBe('hello');
    expect(truncate('hello world', 8)).toBe('hello...');
  });

  it('slugify', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('  A_B C ')).toBe('a-b-c');
  });

  it('formatEmail masks the local part', () => {
    expect(formatEmail('farshid@gmail.com')).toBe('far****@gmail.com');
    expect(formatEmail('notanemail')).toBe('notanemail');
  });

  it('formatList applies grammar', () => {
    expect(formatList(['A'])).toBe('A');
    expect(formatList(['A', 'B'])).toBe('A and B');
    expect(formatList(['A', 'B', 'C'])).toBe('A, B, and C');
    expect(formatList(['A', 'B'], 'or')).toBe('A or B');
  });

  it('getInitials', () => {
    expect(getInitials('Farshid Pourlatifi')).toBe('FP');
  });

  it('parsePeriod handles year ranges and Present', () => {
    expect(parsePeriod('2020 – 2024')).toEqual({ start: 2020, end: 2024 });
    expect(parsePeriod('2024 – Present')).toEqual({ start: 2024, end: 'present' });
  });

  it('sortByDate orders most-recent first', () => {
    const items = [{ period: '2016 – 2019' }, { period: '2024 – Present' }, { period: '2009 – 2014' }];
    expect(sortByDate(items).map((i) => i.period)).toEqual([
      '2024 – Present',
      '2016 – 2019',
      '2009 – 2014',
    ]);
  });

  it('formatPeriodDuration', () => {
    expect(formatPeriodDuration('2020 – 2024')).toBe('4 years');
    expect(formatPeriodDuration('2023 – 2024')).toBe('1 year');
  });
});
