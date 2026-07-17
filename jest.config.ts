import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
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
          paths: {
            "@/*": ["./*"],
          },
        },
      },
    ],
  },
  collectCoverageFrom: [
    "lib/seo/**/*.ts",
    "app/robots.ts",
    "app/sitemap.xml/route.ts",
    "app/search/page.tsx",
  ],
  coverageReporters: ["text", "lcov"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  modulePathIgnorePatterns: ["/.next/"],
  setupFiles: ["<rootDir>/__tests__/setup.ts"],
};

export default config;
