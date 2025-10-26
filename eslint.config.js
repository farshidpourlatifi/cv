import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  // Recommended config for Astro
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // Customize rules as needed
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
