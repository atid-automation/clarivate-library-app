import { test as base, expect } from '@playwright/test';

/** TEST_MODE=real: מול השרת האמיתי. ברירת המחדל: mock, מהיר ולא תלוי בסביבה. */
export const REAL = process.env.TEST_MODE === 'real';

type Fixtures = { booksApi: { token: string } };

export const test = base.extend<Fixtures>({
  // fixture שנותן טוקן כניסה דרך ה-API, בלי לעבור על מסך הכניסה
  booksApi: async ({ request }, use) => {
    const res = await request.post('/api/login', { data: { username: 'librarian', password: 'secret' } });
    expect(res.ok()).toBeTruthy();
    await use({ token: (await res.json()).token });
  },

  // ב-mock: מחליף את תשובת החיפוש בתשובה קבועה. אחרת: לא עושה כלום, והבקשות הולכות לשרת
  page: async ({ page }, use) => {
    if (!REAL) {
      await page.route('**/api/books?*', (route) =>
        route.fulfill({ status: 200, json: [{ id: 1, title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593' }] }),
      );
    }
    await use(page);
  },
});

export { expect };
