import { useEffect, useState } from 'react';
import * as api from './api';
import { AddBookForm } from './components/AddBookForm';
import { LoginForm } from './components/LoginForm';

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [books, setBooks] = useState<api.Book[]>([]);
  const [query, setQuery] = useState('');
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState<api.Book | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');

  async function load(q = '') {
    try {
      setLoadError('');
      setBooks(await api.searchBooks(q));
    } catch {
      setLoadError('לא ניתן לטעון ספרים כרגע');
    }
  }

  useEffect(() => { void load(); }, []);

  function logout() {
    setToken(null);
    setEditing(null);
    setConfirmId(null);
    setActionError('');
    setNotice('');
  }

  async function remove(id: number) {
    try {
      setActionError('');
      await api.deleteBook(id, token!);
      setNotice('הספר נמחק');
      setConfirmId(null);
      if (editing?.id === id) setEditing(null);
      await load(query);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'שגיאה');
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden="true">📚</span>
          <h1>ספריית הסדנה</h1>
        </div>
        {token && (
          <div className="session">
            <span className="chip">מחובר כספרן</span>
            <button type="button" className="btn secondary" onClick={logout}>התנתק</button>
          </div>
        )}
      </header>

      <main className="container">
        <section className="card">
          {!token ? (
            <LoginForm onLogin={async (u, p) => setToken(await api.login(u, p))} />
          ) : editing ? (
            <AddBookForm
              key={editing.id}
              initial={editing}
              onCancel={() => setEditing(null)}
              onAdd={async (book) => { await api.updateBook(editing.id, book, token); setEditing(null); setNotice('הספר עודכן'); await load(query); }}
            />
          ) : (
            <AddBookForm onAdd={async (book) => { await api.addBook(book, token); setNotice('הספר נשמר'); await load(query); }} />
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2>הספרים בספרייה</h2>
            <span className="count">{books.length} תוצאות</span>
          </div>

          <form role="search" className="form-row" onSubmit={(e) => { e.preventDefault(); void load(query); }}>
            <label className="field">
              <span>חיפוש</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="כותרת או מחבר" />
            </label>
            <button type="submit" className="btn">חפש</button>
          </form>

          {loadError && <p role="alert" className="alert">{loadError}</p>}
          {notice && <p role="status" className="notice">{notice}</p>}
          {actionError && <p role="alert" className="alert">{actionError}</p>}

          <div className="table-wrap" style={{ marginTop: 16 }}>
            <table aria-label="רשימת ספרים">
              <thead>
                <tr><th>כותרת</th><th>מחבר</th><th>ISBN</th>{token && <th>פעולות</th>}</tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    <td>{b.title}</td><td>{b.author}</td><td className="isbn">{b.isbn}</td>
                    {token && (
                      <td className="actions">
                        {confirmId === b.id ? (
                          <>
                            <button type="button" className="btn danger small" aria-label={`אישור מחיקה: ${b.title}`} onClick={() => void remove(b.id)}>אישור מחיקה</button>
                            <button type="button" className="btn secondary small" onClick={() => setConfirmId(null)}>ביטול</button>
                          </>
                        ) : (
                          <>
                            <button type="button" className="btn secondary small" aria-label={`ערוך: ${b.title}`} onClick={() => { setEditing(b); setConfirmId(null); setNotice(''); }}>ערוך</button>
                            <button type="button" className="btn secondary small" aria-label={`מחק: ${b.title}`} onClick={() => { setConfirmId(b.id); setNotice(''); }}>מחק</button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {books.length === 0 && !loadError && <p className="empty">לא נמצאו ספרים</p>}
          </div>
        </section>
      </main>
    </>
  );
}
