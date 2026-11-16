export type Book = { id: number; title: string; author: string; isbn: string };
export type NewBook = { title: string; author: string; isbn: string };

export async function login(username: string, password: string): Promise<string> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('שם משתמש או סיסמה שגויים');
  return (await res.json()).token;
}

export async function searchBooks(q: string): Promise<Book[]> {
  const res = await fetch('/api/books?q=' + encodeURIComponent(q));
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export async function addBook(book: NewBook, token: string): Promise<Book> {
  const res = await fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(book),
  });
  if (res.status === 409) throw new Error('ISBN כבר קיים');
  if (!res.ok) throw new Error((await res.json()).error ?? 'שגיאה');
  return res.json();
}

export async function updateBook(id: number, book: NewBook, token: string): Promise<Book> {
  const res = await fetch(`/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(book),
  });
  if (res.status === 409) throw new Error('ISBN כבר קיים');
  if (!res.ok) throw new Error((await res.json()).error ?? 'שגיאה');
  return res.json();
}

export async function deleteBook(id: number, token: string): Promise<void> {
  const res = await fetch(`/api/books/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error((await res.json()).error ?? 'שגיאה');
}
