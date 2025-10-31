/**
 * Data Loader Utilities
 *
 * Centralized functions for loading and validating CV data
 */

import personalData from '../data/personal.json';
import experienceData from '../data/experience.json';
import skillsData from '../data/skills.json';
import configData from '../data/config.json';

import {
  PersonalInfoSchema,
  ExperienceSchema,
  SkillsSchema,
  ConfigSchema,
  type PersonalInfo,
  type Experience,
  type Skills,
  type Config,
  type ExperiencePosition,
} from '../types/cv.types';

/**
 * Load and validate personal information
 */
export function getPersonalInfo(): PersonalInfo {
  return PersonalInfoSchema.parse(personalData);
}

/**
 * Load and validate all experience positions
 */
export function getExperience(): Experience {
  return ExperienceSchema.parse(experienceData);
}

/**
 * Load and validate skills data
 */
export function getSkills(): Skills {
  return SkillsSchema.parse(skillsData);
}

/**
 * Load and validate site configuration
 */
export function getConfig(): Config {
  return ConfigSchema.parse(configData);
}

/**
 * Get a specific experience position by slug
 */
export function getExperienceBySlug(slug: string): ExperiencePosition | undefined {
  const experience = getExperience();
  return experience.positions.find(pos => pos.slug === slug);
}

/**
 * Get all experience slugs for static path generation
 */
export function getAllExperienceSlugs(): string[] {
  const experience = getExperience();
  return experience.positions.map(pos => pos.slug);
}

/**
 * Get total years of experience
 */
export function getTotalYearsOfExperience(): number {
  const config = getConfig();
  return config.metadata.total_experience_years;
}

/**
 * Get all unique technologies across all positions
 */
export function getAllTechnologies(): string[] {
  const experience = getExperience();
  const techSet = new Set<string>();

  experience.positions.forEach(position => {
    position.technologies.forEach(tech => techSet.add(tech));
  });

  return Array.from(techSet).sort();
}

/**
 * Get experience positions grouped by year range
 */
export function getExperienceByYearRange(): Map<string, ExperiencePosition[]> {
  const experience = getExperience();
  const grouped = new Map<string, ExperiencePosition[]>();

  experience.positions.forEach(position => {
    // Extract year range (e.g., "2020 – 2024" -> "2020-2024")
    const yearMatch = position.period.match(/(\d{4})/);
    const decade = yearMatch && yearMatch[1] ? `${Math.floor(parseInt(yearMatch[1]) / 10) * 10}s` : 'Other';

    if (!grouped.has(decade)) {
      grouped.set(decade, []);
    }
    grouped.get(decade)?.push(position);
  });

  return grouped;
}

/**
 * Get current position
 */
export function getCurrentPosition(): ExperiencePosition | undefined {
  const experience = getExperience();
  return experience.positions.find(pos => pos.period.toLowerCase().includes('present'));
}

/**
 * Search positions by technology
 */
export function searchPositionsByTechnology(tech: string): ExperiencePosition[] {
  const experience = getExperience();
  const searchTerm = tech.toLowerCase();

  return experience.positions.filter(position =>
    position.technologies.some(t => t.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get all data combined (useful for API endpoints)
 */
export function getAllData() {
  return {
    personal: getPersonalInfo(),
    experience: getExperience(),
    skills: getSkills(),
    config: getConfig(),
  };
}
