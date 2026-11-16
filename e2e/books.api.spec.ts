import { expect, test } from './fixtures';
import { uniqueIsbn } from './helpers';

// בדיקות API עם ה-fixture `request` של Playwright: בלי דפדפן, מהירות ויציבות
test.describe('POST /api/books', () => {
  test('מוסיף ספר תקין @smoke', async ({ request, booksApi }) => {
    const res = await request.post('/api/books', {
      headers: { Authorization: `Bearer ${booksApi.token}` },
      data: { title: 'Test Book', author: 'Tester', isbn: uniqueIsbn() },
    });
    expect(res.status()).toBe(201);
  });

  test('ISBN כפול מחזיר 409', async ({ request, booksApi }) => {
    const headers = { Authorization: `Bearer ${booksApi.token}` };
    const isbn = uniqueIsbn();
    await request.post('/api/books', { headers, data: { title: 'First', author: '', isbn } });
    const second = await request.post('/api/books', { headers, data: { title: 'Second', author: '', isbn } });
    expect(second.status()).toBe(409);
  });

  test('בלי כניסה מחזיר 401', async ({ request }) => {
    const res = await request.post('/api/books', { data: { title: 'X', author: '', isbn: uniqueIsbn() } });
    expect(res.status()).toBe(401);
  });
});

test.describe('PUT ו-DELETE /api/books/:id', () => {
  test('מעדכן כותרת ומוחק ספר', async ({ request, booksApi }) => {
    const headers = { Authorization: `Bearer ${booksApi.token}` };
    const isbn = uniqueIsbn();
    const created = await (await request.post('/api/books', { headers, data: { title: 'Old', author: '', isbn } })).json();

    const put = await request.put(`/api/books/${created.id}`, { headers, data: { title: 'New', author: '', isbn } });
    expect(put.status()).toBe(200);
    expect((await put.json()).title).toBe('New');

    expect((await request.delete(`/api/books/${created.id}`, { headers })).status()).toBe(204);
    expect((await request.delete(`/api/books/${created.id}`, { headers })).status()).toBe(404);
  });

  test('עדכון בלי כניסה מחזיר 401', async ({ request }) => {
    const res = await request.put('/api/books/1', { data: { title: 'X', author: '', isbn: uniqueIsbn() } });
    expect(res.status()).toBe(401);
  });
});
