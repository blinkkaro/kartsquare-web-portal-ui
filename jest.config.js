/**
 * Jest config. Plain CommonJS on purpose: a `.ts` config needs `ts-node` installed.
 *
 * - Default environment is `node`. A test that renders React opts in with a
 *   `@jest-environment jsdom` docblock on its first line.
 * - `tests/` is the home for all new tests (unit, integration). `e2e/` is Playwright's, not Jest's.
 * - `__tests__/` holds the older suites; they keep running until moved into `tests/`.
 *
 * @type {import("jest").Config}
 */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests", "<rootDir>/__tests__"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/__tests__/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          resolveJsonModule: true,
          paths: { "@/*": ["./*"] },
        },
      },
    ],
  },
  setupFiles: ["<rootDir>/__tests__/setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/tests/e2e/"],
  modulePathIgnorePatterns: ["/.next/"],

  // Coverage: logic only. Pages, layouts and MUI-heavy views are covered by e2e, not by line counts.
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "utils/**/*.ts",
    "hooks/**/*.ts",
    "services/**/*.ts",
    "app/robots.ts",
    "app/sitemap.xml/route.ts",
    "!**/*.d.ts",
    "!services/**/*[Ii]nterface*.ts",
    "!services/**/*[Ii]nteraface*.ts",
    "!services/**/apiEnd[Pp]oint*.ts",
  ],
  coverageReporters: ["text-summary", "lcov"],
  // Target is 80% everywhere (docs/07-testing-strategy.md). Enforced per folder as each reaches it,
  // so CI never fails on code nobody has touched. Raise this list; never lower it.
  coverageThreshold: {
    "./lib/seo/": { statements: 80, lines: 80 },
  },
};

module.exports = config;
