import { expect, test } from '@playwright/test';
import { uniqueIsbn } from './helpers';

// Three intentionally broken tests for the diagnosis exercise in lesson 2.3. Each has a different symptom.
// Run:     npx playwright test broken.spec.ts
// Inspect: npx playwright show-report   or   npx playwright test broken.spec.ts --ui
// Task: for each test, state the symptom, the cause (from the trace), and only then the fix.

test('הוספת ספר מציגה אותו ברשימה @broken', async ({ page }) => {
  const title = `Broken Demo ${Date.now()}`;
  await page.goto('/');
  await page.getByLabel('שם משתמש').fill('librarian');
  await page.getByLabel('סיסמה').fill('secret');
  await page.getByRole('button', { name: 'כניסה' }).click();

  await page.getByLabel('כותרת').fill(title);
  await page.getByLabel('ISBN').fill(uniqueIsbn());
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('cell', { name: title, exact: true })).toBeVisible();
});

test('הרשימה מציגה את Dune אחרי הטעינה @broken', async ({ page }) => {
  await page.setExtraHTTPHeaders({ 'x-demo-delay': '500' }); // simulates a slow server
  await page.goto('/');

  const count = await page.getByRole('cell', { name: 'Dune', exact: true }).count();

  expect(count).toBe(1);
});

test('חיפוש של Neuromancer מחזיר שורה אחת @broken', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('חיפוש').fill('Neuromancer');
  await page.getByRole('button', { name: 'חפש' }).click();

  await expect(page.getByRole('row')).toHaveCount(1);
});
