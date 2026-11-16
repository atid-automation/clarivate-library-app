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
    // ב-PR רצות רק בדיקות ה-smoke, מהר ומול mock
    { name: 'pr', grep: /@smoke/, use: { ...devices['Desktop Chrome'] } },
    // בלילה רצות כל הבדיקות (עם TEST_MODE=real: מול השרת האמיתי), חוץ מהטסטים השבורים בכוונה של הסדנה
    { name: 'nightly', grepInvert: /@broken/, use: { ...devices['Desktop Chrome'] } },
    // רק לתרגיל הדיבוג בסדנה: הטסטים השבורים בכוונה (e2e/broken.spec.ts)
    { name: 'workshop', grep: /@broken/, use: { ...devices['Desktop Chrome'] } },
  ],
});
