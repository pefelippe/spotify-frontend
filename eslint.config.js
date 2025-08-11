import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'dev-dist']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Code Quality
      'no-unused-vars': 'off', // Turned off in favor of TypeScript version
      'no-console': 'off',
      'no-debugger': 'error',
      'no-alert': 'warn',

      // Best Practices
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'error',

      // React Specific
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'warn',

      // Code Style
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],

      // TypeScript
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },
  // TypeScript-specific overrides
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // TypeScript handles undefined types/identifiers; this rule can misreport on type-only globals
      'no-undef': 'off',
      // Fast refresh rule is noisy for non-component modules in TS projects
      'react-refresh/only-export-components': 'off',
    },
  },
]);
