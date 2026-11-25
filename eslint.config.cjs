/**
 * ESLint flat configuration for LS WP Build Plugin.
 *
 * ESLint 10 reads only eslint.config.* files; .eslintrc files are ignored.
 *
 * Variables:
 * - useEsModules: treat .js files as ES modules (default: false, CommonJS)
 * - strictMode: add the stricter style rules (default: false)
 * - hasBrowserGlobals: allow browser globals as well as Node ones (default: false)
 */

const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/', 'coverage/', 'dist/', 'build/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'prefer-const': 'warn',
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: { sourceType: 'module' },
  },
  {
    files: ['**/__tests__/**/*.{js,cjs,mjs}', '**/*.test.{js,cjs,mjs}'],
    languageOptions: { globals: { ...globals.jest } },
  },
];
