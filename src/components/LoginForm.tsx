import { useState, type FormEvent } from 'react';

export function LoginForm({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה');
    }
  }

  return (
    <form onSubmit={submit} aria-label="כניסה">
      <h2>כניסה לספרנים</h2>
      <div className="form-grid">
        <label className="field"><span>שם משתמש</span><input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" /></label>
        <label className="field"><span>סיסמה</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        <div><button type="submit" className="btn">כניסה</button></div>
      </div>
      {error && <p role="alert" className="alert">{error}</p>}
      <p className="hint">משתמש הדמו לסדנה: librarian, סיסמה: secret</p>
    </form>
  );
}
