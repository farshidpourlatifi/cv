#!/usr/bin/env node

/**
 * Data Validation Script
 *
 * Validates all JSON data files against Zod schemas
 * Run with: bun run validate
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  PersonalInfoSchema,
  ExperienceSchema,
  SkillsSchema,
  ConfigSchema
} from '../src/types/cv.types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '..', 'src', 'data');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.blue);
}

function readJsonFile(filename) {
  const filePath = join(DATA_DIR, filename);
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read ${filename}: ${error.message}`);
  }
}

function validateFile(filename, schema, name) {
  logInfo(`Validating ${name}...`);

  try {
    const data = readJsonFile(filename);
    const result = schema.safeParse(data);

    if (result.success) {
      logSuccess(`${name} is valid`);
      return true;
    } else {
      logError(`${name} validation failed:`);
      result.error.issues.forEach(issue => {
        console.log(`  ${colors.red}→${colors.reset} ${issue.path.join('.')}: ${issue.message}`);
      });
      return false;
    }
  } catch (error) {
    logError(`${name} validation failed: ${error.message}`);
    return false;
  }
}

async function main() {
  log('\n' + '='.repeat(60), colors.bold);
  log('CV Data Validation', colors.bold);
  log('='.repeat(60) + '\n', colors.bold);

  const validations = [
    { file: 'personal.json', schema: PersonalInfoSchema, name: 'Personal Information' },
    { file: 'experience.json', schema: ExperienceSchema, name: 'Professional Experience' },
    { file: 'skills.json', schema: SkillsSchema, name: 'Skills & Competencies' },
    { file: 'config.json', schema: ConfigSchema, name: 'Site Configuration' },
  ];

  const results = validations.map(({ file, schema, name }) =>
    validateFile(file, schema, name)
  );

  const allValid = results.every(result => result === true);

  log('\n' + '='.repeat(60), colors.bold);
  if (allValid) {
    logSuccess('All data files are valid! ✨');
    log('='.repeat(60) + '\n', colors.bold);
    process.exit(0);
  } else {
    logError('Some data files have validation errors');
    log('='.repeat(60) + '\n', colors.bold);
    logWarning('Please fix the errors above and try again.');
    process.exit(1);
  }
}

main().catch(error => {
  logError(`Validation failed: ${error.message}`);
  process.exit(1);
});
