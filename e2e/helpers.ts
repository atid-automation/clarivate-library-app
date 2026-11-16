/** A valid, unique ISBN-13 per call: each test creates its own data and does not depend on another test. */
let counter = 0;
export function uniqueIsbn(): string {
  counter += 1;
  const first12 = '979' + String(Date.now() % 1e6).padStart(6, '0') + String(counter % 1000).padStart(3, '0');
  const sum = [...first12].reduce((acc, ch, i) => acc + Number(ch) * (i % 2 === 0 ? 1 : 3), 0);
  return first12 + String((10 - (sum % 10)) % 10);
}

/** Logs in through the login screen. In tests that don't test login itself, data can also be prepared via the API. */
export async function loginAsLibrarian(page: import('@playwright/test').Page): Promise<void> {
  await page.getByLabel('שם משתמש').fill('librarian');
  await page.getByLabel('סיסמה').fill('secret');
  await page.getByRole('button', { name: 'כניסה' }).click();
  await page.getByRole('button', { name: 'התנתק' }).waitFor();
}
