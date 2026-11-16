import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  webServer: [
    { command: 'npm run api', url: 'http://localhost:3001/api/books', reuseExistingServer: true },
    { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true },
  ],
  projects: [
    // On PRs only the smoke tests run, fast and against mock
    { name: 'pr', grep: /@smoke/, use: { ...devices['Desktop Chrome'] } },
    // Nightly runs all tests (with TEST_MODE=real: against the real server), except the workshop's intentionally broken tests
    { name: 'nightly', grepInvert: /@broken/, use: { ...devices['Desktop Chrome'] } },
    // Only for the workshop debugging exercise: the intentionally broken tests (e2e/broken.spec.ts)
    { name: 'workshop', grep: /@broken/, use: { ...devices['Desktop Chrome'] } },
  ],
});
