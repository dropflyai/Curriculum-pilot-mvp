# Testing Infrastructure Setup

## Install Testing Dependencies

Add the following to your package.json devDependencies:

```bash
npm install --save-dev \
  @playwright/test \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest-environment-jsdom \
  puppeteer-core \
  axios \
  cheerio
```

## Package.json Scripts Addition

Add these test scripts to your package.json:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:flow": "node tests/scripts/games-mission-flow-test.js",
    "test:monitor": "node tests/scripts/flow-monitor.js",
    "test:regression": "npm run test:flow && npm run test:e2e"
  }
}
```

## Directory Structure

```
tests/
├── __tests__/
│   ├── unit/
│   │   ├── games-page.test.js
│   │   ├── mission-hq.test.js
│   │   └── middleware.test.js
│   └── integration/
│       └── games-mission-flow.test.js
├── e2e/
│   ├── playwright.config.js
│   ├── games-mission-hq.spec.js
│   └── cross-browser.spec.js
├── scripts/
│   ├── games-mission-flow-test.js
│   ├── flow-monitor.js
│   ├── middleware-validator.js
│   └── deployment-check.js
├── fixtures/
│   ├── demo-user.json
│   └── test-data.json
├── utils/
│   ├── test-helpers.js
│   └── browser-utils.js
└── reports/
    └── (auto-generated test reports)
```

## Configuration Files

### Jest Configuration (jest.config.js)
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### Playwright Configuration (tests/e2e/playwright.config.js)
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3003',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 3003,
    reuseExistingServer: !process.env.CI,
  },
});
```