import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Standards live in docs/06-coding-standards.md. Rules marked "ratchet" are errors in the
 * standard but "warn" here, because the code written before them has hundreds of violations.
 * lint-staged runs ESLint with --max-warnings=0 on staged files, so any file you touch must be
 * clean. Nothing new gets in, and the legacy count only goes down.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Same globs as eslint-config-next, which only registers the react/import plugins for these.
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    rules: {
      // ── Hard errors ────────────────────────────────────────────────
      eqeqeq: ["error", "always", { null: "ignore" }],
      // One type system: Plus Jakarta Sans / Mukta in weights 400-700 only (docs/03-design-system.md).
      "no-restricted-syntax": [
        "error",
        {
          selector: "Property[key.name='fontWeight'][value.type='Literal'][value.value>=800]",
          message: "Use a weight from 400 to 700. The app's type system has no 800/900 (docs/03-design-system.md).",
        },
      ],
      "no-var": "error",
      "no-debugger": "error",
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],

      // ── Ratchet: warn globally, zero warnings in any file you commit ──
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
      "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "inline-type-imports" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      // React-compiler rules shipped with eslint-config-next 16; the existing views break several.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/refs": "warn",
      "react/display-name": "warn",

      // Import order: React → Next → third-party → @/ local → relative.
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          pathGroups: [
            { pattern: "react", group: "builtin", position: "before" },
            { pattern: "react-dom/**", group: "builtin", position: "before" },
            { pattern: "next", group: "builtin", position: "before" },
            { pattern: "next/**", group: "builtin", position: "before" },
            { pattern: "@/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: ["react", "next"],
          "newlines-between": "never",
        },
      ],
    },
  },
  {
    // Server state goes through services/ + TanStack Query. No raw axios in UI code.
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            { name: "axios", message: "Call the backend through services/*, consumed by a hook in hooks/." },
            { name: "@/services/api", message: "Use the domain service (services/<domain>/*.ts), not the Axios instance." },
          ],
        },
      ],
    },
  },
  {
    // Tests may use looser typing for mocks.
    files: ["tests/**/*.{ts,tsx}", "__tests__/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
      "import/order": "off",
    },
  },
  {
    // Node scripts.
    files: ["scripts/**/*.cjs", "jest.config.js", "playwright.config.ts"],
    rules: { "@typescript-eslint/no-require-imports": "off", "no-console": "off" },
  },
  globalIgnores([
    ".next/**",
    ".claude/**",
    ".claude-tmp/**",
    ".agents/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
