import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'error',
      'no-unreachable': 'error',
      'eqeqeq': 'error',
      'no-undef': 'warn',
      'prefer-const': 'error',
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];