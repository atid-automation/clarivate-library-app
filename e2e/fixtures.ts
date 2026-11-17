import { test as base, expect } from '@playwright/test';
import { uniqueIsbn } from './helpers';

/** TEST_MODE=real: runs against the real server. Default: mock, fast and environment-independent. */
export const REAL = process.env.TEST_MODE === 'real';

type Book = { id: number; title: string; author: string; isbn: string };
type Fixtures = { booksApi: { token: string }; newBook: Book };

export const test = base.extend<Fixtures>({
  // fixture that provides a login token via the API, without going through the login screen
  booksApi: async ({ request }, use) => {
    const res = await request.post('/api/login', { data: { username: 'librarian', password: 'secret' } });
    expect(res.ok()).toBeTruthy();
    await use({ token: (await res.json()).token });
  },

  // fixture that creates a book through the API before the test, and deletes it after (the test needs no UI setup)
  newBook: async ({ request, booksApi }, use) => {
    const headers = { Authorization: `Bearer ${booksApi.token}` };
    const res = await request.post('/api/books', {
      headers,
      data: { title: `API Book ${Date.now()}`, author: 'Tester', isbn: uniqueIsbn() },
    });
    expect(res.status()).toBe(201);
    const book = (await res.json()) as Book;

    await use(book);

    await request.delete(`/api/books/${book.id}`, { headers });   // cleanup; also fine if the test already deleted the book
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
