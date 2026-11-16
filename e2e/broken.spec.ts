import { expect, test } from '@playwright/test';
import { uniqueIsbn } from './helpers';

// שלושה טסטים שבורים בכוונה, לתרגיל האבחון בשיעור 2.3. לכל אחד סימפטום אחר.
// הרצה:   npx playwright test broken.spec.ts
// חקירה:  npx playwright show-report   או   npx playwright test broken.spec.ts --ui
// המשימה: לכל טסט, מה הסימפטום, מה הסיבה (לפי ה-trace), ורק אחר כך תיקון.

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
