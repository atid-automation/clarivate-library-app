import { useState, type FormEvent } from 'react';
import { generateIsbn13, isValidIsbn } from '../lib/isbn';
import type { NewBook } from '../api';

type Props = {
  onAdd: (book: NewBook) => Promise<void>;
  /** When present, the form works in edit mode for an existing book. */
  initial?: NewBook;
  onCancel?: () => void;
};

/** A form for adding or editing a book. It doesn't call fetch itself: `onAdd` is injected, so it is easy to test. */
export function AddBookForm({ onAdd, initial, onCancel }: Props) {
  const editing = !!initial;
  const [title, setTitle] = useState(initial?.title ?? '');
  const [author, setAuthor] = useState(initial?.author ?? '');
  const [isbn, setIsbn] = useState(initial?.isbn ?? '');
  const [error, setError] = useState('');

  const isbnError = isbn && !isValidIsbn(isbn) ? 'ISBN לא תקין' : '';

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await onAdd({ title: title.trim(), author: author.trim(), isbn });
      if (!editing) { setTitle(''); setAuthor(''); setIsbn(''); }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה');
    }
  }

  return (
    <form onSubmit={submit} aria-label={editing ? 'עריכת ספר' : 'הוספת ספר'}>
      <h2>{editing ? 'עריכת ספר' : 'הוספת ספר'}</h2>
      <div className="form-grid">
        <label className="field"><span>כותרת</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="field"><span>מחבר</span><input value={author} onChange={(e) => setAuthor(e.target.value)} /></label>
        <div className="field isbn-field">
          <label className="field"><span>ISBN</span><input value={isbn} onChange={(e) => setIsbn(e.target.value)} /></label>
          <button type="button" className="btn secondary" onClick={() => setIsbn(generateIsbn13())}>צור ISBN</button>
        </div>
      </div>
      {isbnError && <p role="alert" className="alert">{isbnError}</p>}
      {error && <p role="alert" className="alert">{error}</p>}
      <div className="form-actions">
        {onCancel && <button type="button" className="btn secondary" onClick={onCancel}>ביטול</button>}
        <button type="submit" className="btn" disabled={!title.trim() || !isbn || !!isbnError}>{editing ? 'עדכן' : 'שמור'}</button>
      </div>
    </form>
  );
}
