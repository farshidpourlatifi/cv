import { z } from 'zod';

// Personal Information Schema
export const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  period: z.string(),
});

export const LanguageSchema = z.object({
  language: z.string(),
  proficiency: z.string(),
});

export const PersonalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  location: z.string(),
  phone: z.string(),
  email: z.string().email('Valid email is required'),
  linkedin: z.string().url().optional().or(z.string().min(1)),
  education: EducationSchema,
  languages: z.array(LanguageSchema),
});

// Experience Schema
export const ExperiencePositionSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  location: z.string(),
  position: z.string().min(1, 'Position is required'),
  employment_type: z.string(),
  period: z.string().min(1, 'Period is required'),
  slug: z.string().min(1, 'Slug is required'),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
});

export const ExperienceSchema = z.object({
  positions: z.array(ExperiencePositionSchema),
});

// Skills Schema
export const CoreCompetenciesSchema = z.object({
  frontend_development: z.array(z.string()),
  backend_development: z.array(z.string()),
  ai_automation: z.array(z.string()),
  devops_cicd: z.array(z.string()),
  databases: z.array(z.string()),
  ecommerce_platforms: z.array(z.string()),
  testing_frameworks: z.array(z.string()),
  cloud_infrastructure: z.array(z.string()),
});

export const TechnicalSkillsSchema = z.object({
  programming_languages: z.array(z.string()),
  frontend_frameworks: z.array(z.string()),
  css_frameworks_tools: z.array(z.string()),
  backend_frameworks: z.array(z.string()),
  ai_machine_learning: z.array(z.string()),
  databases: z.array(z.string()),
  devops_cicd: z.array(z.string()),
  cloud_platforms: z.array(z.string()),
  ecommerce_cms: z.array(z.string()),
  testing_frameworks: z.array(z.string()),
  build_tools: z.array(z.string()),
  message_queues: z.array(z.string()),
  web_servers: z.array(z.string()),
  version_control: z.array(z.string()),
  api_development: z.array(z.string()),
  other: z.array(z.string()),
});

export const KeyAchievementSchema = z.object({
  achievement: z.string().min(1, 'Achievement title is required'),
  description: z.string().min(1, 'Achievement description is required'),
});

export const SkillsSchema = z.object({
  core_competencies: CoreCompetenciesSchema,
  technical_skills: TechnicalSkillsSchema,
  key_achievements: z.array(KeyAchievementSchema),
});

// Config Schema
export const SiteConfigSchema = z.object({
  title: z.string().min(1, 'Site title is required'),
  description: z.string().min(1, 'Site description is required'),
  url: z.string().url('Valid URL is required'),
  author: z.string().min(1, 'Author is required'),
  lang: z.string().default('en'),
});

export const WorkPreferencesSchema = z.object({
  remote: z.boolean(),
  location_preference: z.string(),
  job_types: z.array(z.string()),
});

export const MetadataSchema = z.object({
  total_experience_years: z.number().positive(),
  current_role: z.string(),
  current_company: z.string(),
  work_preferences: WorkPreferencesSchema,
  specializations: z.array(z.string()),
});

export const ThemeSchema = z.object({
  primary_color: z.string(),
  secondary_color: z.string(),
  accent_color: z.string(),
  background_gradient: z.object({
    from: z.string(),
    to: z.string(),
  }),
});

export const FeaturesSchema = z.object({
  show_achievements: z.boolean(),
  show_technologies: z.boolean(),
  show_timeline: z.boolean(),
  enable_pdf_download: z.boolean(),
  enable_geometric_background: z.boolean(),
});

export const ConfigSchema = z.object({
  site: SiteConfigSchema,
  professional_summary: z.string().min(1, 'Professional summary is required'),
  metadata: MetadataSchema,
  theme: ThemeSchema,
  features: FeaturesSchema,
});

// Type exports
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type ExperiencePosition = z.infer<typeof ExperiencePositionSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type CoreCompetencies = z.infer<typeof CoreCompetenciesSchema>;
export type TechnicalSkills = z.infer<typeof TechnicalSkillsSchema>;
export type KeyAchievement = z.infer<typeof KeyAchievementSchema>;
export type Skills = z.infer<typeof SkillsSchema>;
export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type WorkPreferences = z.infer<typeof WorkPreferencesSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Features = z.infer<typeof FeaturesSchema>;
export type Config = z.infer<typeof ConfigSchema>;
