import { defineConfig } from 'eslint-define-config'

export default defineConfig({
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  overrides: [
    {
      'files': ["./tests/**/*.ts"],
      'rules': {
        // Your rules here
      }
    }
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-explicit-any': 'off'
  }
});
