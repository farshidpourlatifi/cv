/**
 * Formatting Utilities
 *
 * Functions for formatting dates, strings, and other data
 */

/**
 * Format a period string (e.g., "2020 – 2024" or "2024 – Present")
 * Returns a human-readable duration
 */
export function formatPeriodDuration(period: string): string {
  const [start, end] = period.split('–').map(s => s.trim());

  if (!start || !end) {
    return period;
  }

  const startYear = parseInt(start);
  const endYear = end.toLowerCase() === 'present' ? new Date().getFullYear() : parseInt(end);

  if (isNaN(startYear) || isNaN(endYear)) {
    return period;
  }

  const years = endYear - startYear;
  const months = 0; // Could be enhanced to handle months if needed

  if (years === 0) {
    return 'Less than a year';
  } else if (years === 1) {
    return '1 year';
  } else {
    return `${years} years`;
  }
}

/**
 * Format a technology list into grouped categories
 */
export function groupTechnologies(technologies: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();

  const categories = {
    'Frontend': ['React', 'Vue', 'Angular', 'Svelte', 'TypeScript', 'JavaScript', 'jQuery', 'BackboneJS', 'Mithril'],
    'Backend': ['Python', 'FastAPI', 'Node.js', 'PHP', 'HapiJS', 'Express', 'ASP.NET', 'C#'],
    'Database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQL Server', 'Solr'],
    'DevOps': ['Docker', 'Jenkins', 'GitHub Actions', 'TeamCity', 'AWS', 'Azure', 'Nginx', 'Apache'],
    'Testing': ['Vitest', 'Playwright', 'Cypress', 'Jest', 'Nightwatch'],
    'AI/ML': ['Vocode', 'Dify', 'ElevenLabs', 'Claude', 'n8n'],
    'E-commerce': ['Magento', 'Shopify', 'BigCommerce', 'WordPress'],
  };

  // Initialize groups
  Object.keys(categories).forEach(key => groups.set(key, []));
  groups.set('Other', []);

  // Categorize technologies
  technologies.forEach(tech => {
    let categorized = false;

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => tech.toLowerCase().includes(keyword.toLowerCase()))) {
        groups.get(category)?.push(tech);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      groups.get('Other')?.push(tech);
    }
  });

  // Remove empty categories
  Array.from(groups.keys()).forEach(key => {
    if (groups.get(key)?.length === 0) {
      groups.delete(key);
    }
  });

  return groups;
}

/**
 * Truncate text to a specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Slugify a string (convert to URL-friendly format)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Format an email to be display-friendly (hide part of it)
 */
export function formatEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;

  const visibleChars = Math.min(3, local.length);
  const hidden = '*'.repeat(Math.max(0, local.length - visibleChars));

  return `${local.slice(0, visibleChars)}${hidden}@${domain}`;
}

/**
 * Format a phone number to international format
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format as international: +XX XXX XXX XXXX
  if (digits.length >= 10) {
    const countryCode = digits.slice(0, digits.length - 10);
    const areaCode = digits.slice(-10, -7);
    const firstPart = digits.slice(-7, -4);
    const lastPart = digits.slice(-4);

    return `+${countryCode} ${areaCode} ${firstPart} ${lastPart}`;
  }

  return phone;
}

/**
 * Format a list with proper grammar (e.g., "A, B, and C")
 */
export function formatList(items: string[], conjunction: 'and' | 'or' = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);

  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
}

/**
 * Calculate reading time for text (words per minute)
 */
export function calculateReadingTime(text: string, wpm: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
}

/**
 * Format large numbers with separators (e.g., 1,000,000)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
}

/**
 * Convert a period string to start and end years
 */
export function parsePeriod(period: string): { start: number; end: number | 'present' } {
  const [start, end] = period.split('–').map(s => s.trim());

  return {
    start: parseInt(start),
    end: end.toLowerCase() === 'present' ? 'present' : parseInt(end),
  };
}

/**
 * Sort positions by date (most recent first)
 */
export function sortByDate<T extends { period: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const periodA = parsePeriod(a.period);
    const periodB = parsePeriod(b.period);

    const endA = periodA.end === 'present' ? 9999 : periodA.end;
    const endB = periodB.end === 'present' ? 9999 : periodB.end;

    return endB - endA;
  });
}
