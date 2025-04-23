import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import jasmine from "eslint-plugin-jasmine";

export default defineConfig([
  eslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["test/**/*.spec.ts"],
    extends: [tseslint.configs.strict, eslintConfigPrettier, jasmine.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jasmine,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      jasmine,
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: [tseslint.configs.strict, eslintConfigPrettier],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
]);
