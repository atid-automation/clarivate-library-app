import { expect, test } from '@playwright/test';
import { uniqueIsbn } from './helpers';

// A working suite, but full of duplication: a repeated login, long locators and a hard-coded URL.
// The exercise in lesson 3.1: improve it with a minimal change. A login fixture, one Page Object for the page, and tags for running smoke.
// Run: npx playwright test messy.spec.ts --project=nightly

test('כניסה עם פרטים נכונים מציגה את טופס ההוספה', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('form[aria-label="כניסה"] label:has-text("שם משתמש") input').fill('librarian');
  await page.locator('form[aria-label="כניסה"] label:has-text("סיסמה") input').fill('secret');
  await page.locator('form[aria-label="כניסה"] button[type="submit"]').click();

  await expect(page.locator('form[aria-label="הוספת ספר"]')).toBeVisible();
});

test('כניסה עם סיסמה שגויה מציגה הודעת שגיאה', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('form[aria-label="כניסה"] label:has-text("שם משתמש") input').fill('librarian');
  await page.locator('form[aria-label="כניסה"] label:has-text("סיסמה") input').fill('wrong');
  await page.locator('form[aria-label="כניסה"] button[type="submit"]').click();

  await expect(page.locator('form[aria-label="כניסה"] p[role="alert"]')).toHaveText('שם משתמש או סיסמה שגויים');
});

test('ספר שנוסף מופיע בחיפוש', async ({ page }) => {
  const title = `Messy Add ${Date.now()}`;
  await page.goto('http://localhost:5173/');
  await page.locator('form[aria-label="כניסה"] label:has-text("שם משתמש") input').fill('librarian');
  await page.locator('form[aria-label="כניסה"] label:has-text("סיסמה") input').fill('secret');
  await page.locator('form[aria-label="כניסה"] button[type="submit"]').click();

  await page.locator('form[aria-label="הוספת ספר"] label:has-text("כותרת") input').fill(title);
  await page.locator('form[aria-label="הוספת ספר"] label:has-text("ISBN") input').fill(uniqueIsbn());
  await page.locator('form[aria-label="הוספת ספר"] button[type="submit"]').click();

  await page.locator('form[role="search"] input').fill(title);
  await page.locator('form[role="search"] button[type="submit"]').click();
  await expect(page.locator('table[aria-label="רשימת ספרים"] tbody tr', { hasText: title })).toHaveCount(1);
});

test('ISBN לא תקין חוסם את כפתור השמירה', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('form[aria-label="כניסה"] label:has-text("שם משתמש") input').fill('librarian');
  await page.locator('form[aria-label="כניסה"] label:has-text("סיסמה") input').fill('secret');
  await page.locator('form[aria-label="כניסה"] button[type="submit"]').click();

  await page.locator('form[aria-label="הוספת ספר"] label:has-text("כותרת") input').fill('Bad Isbn');
  await page.locator('form[aria-label="הוספת ספר"] label:has-text("ISBN") input').fill('123');

  await expect(page.locator('form[aria-label="הוספת ספר"] p[role="alert"]')).toHaveText('ISBN לא תקין');
  await expect(page.locator('form[aria-label="הוספת ספר"] button[type="submit"]')).toBeDisabled();
});

test('עריכת כותרת של ספר', async ({ page }) => {
  const title = `Messy Edit ${Date.now()}`;
  await page.goto('http://localhost:5173/');
  await page.locator('form[aria-label="כניסה"] label:has-text("שם משתמש") input').fill('librarian');
  await page.locator('form[aria-label="כניסה"] label:has-text("סיסמה") input').fill('secret');
  await page.locator('form[aria-label="כניסה"] button[type="submit"]').click();

  await page.locator('form[aria-label="הוספת ספר"] label:has-text("כותרת") input').fill(title);
  await page.locator('form[aria-label="הוספת ספר"] label:has-text("ISBN") input').fill(uniqueIsbn());
  await page.locator('form[aria-label="הוספת ספר"] button[type="submit"]').click();

  await page.locator('form[role="search"] input').fill(title);
  await page.locator('form[role="search"] button[type="submit"]').click();
  await page.locator('table[aria-label="רשימת ספרים"] tbody tr', { hasText: title }).locator('button:has-text("ערוך")').click();
  await page.locator('form[aria-label="עריכת ספר"] label:has-text("כותרת") input').fill(`${title} v2`);
  await page.locator('form[aria-label="עריכת ספר"] button[type="submit"]').click();

  await expect(page.locator('p[role="status"]')).toHaveText('הספר עודכן');
});

test('מחיקת ספר דורשת אישור', async ({ page }) => {
  const title = `Messy Delete ${Date.now()}`;
  await page.goto('http://localhost:5173/');
  await page.locator('form[aria-label="כניסה"] label:has-text("שם משתמש") input').fill('librarian');
  await page.locator('form[aria-label="כניסה"] label:has-text("סיסמה") input').fill('secret');
  await page.locator('form[aria-label="כניסה"] button[type="submit"]').click();

  await page.locator('form[aria-label="הוספת ספר"] label:has-text("כותרת") input').fill(title);
  await page.locator('form[aria-label="הוספת ספר"] label:has-text("ISBN") input').fill(uniqueIsbn());
  await page.locator('form[aria-label="הוספת ספר"] button[type="submit"]').click();

  await page.locator('form[role="search"] input').fill(title);
  await page.locator('form[role="search"] button[type="submit"]').click();
  await page.locator('table[aria-label="רשימת ספרים"] tbody tr', { hasText: title }).locator('button:has-text("מחק")').click();
  await page.locator('table[aria-label="רשימת ספרים"] tbody tr', { hasText: title }).locator('button:has-text("אישור מחיקה")').click();

  await expect(page.locator('p[role="status"]')).toHaveText('הספר נמחק');
  await expect(page.locator('table[aria-label="רשימת ספרים"] tbody tr', { hasText: title })).toHaveCount(0);
});
