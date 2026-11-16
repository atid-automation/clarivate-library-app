import { test as base, expect } from '@playwright/test';

/** TEST_MODE=real: runs against the real server. Default: mock, fast and environment-independent. */
export const REAL = process.env.TEST_MODE === 'real';

type Fixtures = { booksApi: { token: string } };

export const test = base.extend<Fixtures>({
  // fixture that provides a login token via the API, without going through the login screen
  booksApi: async ({ request }, use) => {
    const res = await request.post('/api/login', { data: { username: 'librarian', password: 'secret' } });
    expect(res.ok()).toBeTruthy();
    await use({ token: (await res.json()).token });
  },

  // In mock mode: replaces the search response with a fixed one. Otherwise: does nothing, and requests go to the server
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
