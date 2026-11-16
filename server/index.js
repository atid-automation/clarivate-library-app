// שרת ה-API של אפליקציית הספרייה לסדנה. Node בלבד, בלי תלויות. הנתונים בזיכרון ומתאפסים בכל הפעלה.
import http from 'node:http';
import { isValidIsbn, normalizeIsbn } from './isbn.js';

const PORT = Number(process.env.PORT ?? 3001);
const TOKEN = 'library-test-token';              // אפליקציית תרגול: טוקן קבוע, לא לשימוש אמיתי
const USERS = { librarian: 'secret' };            // משתמש הדמו של הסדנה

const SEED = [
  { title: 'Dune', author: 'Frank Herbert', isbn: '9780441013593' },
  { title: 'Neuromancer', author: 'William Gibson', isbn: '9780441569595' },
  { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', isbn: '9780441478125' },
  { title: 'Foundation', author: 'Isaac Asimov', isbn: '9780553293357' },
  { title: 'Hyperion', author: 'Dan Simmons', isbn: '9780553283686' },
];

let books = [];
let nextId = 1;
function reset() {
  books = SEED.map((b) => ({ id: nextId++, ...b }));
}
reset();

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body === undefined ? undefined : JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString('utf-8') || '{}'); } catch { return null; }
}

const authorized = (req) => req.headers.authorization === `Bearer ${TOKEN}`;

export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  if (req.method === 'POST' && path === '/api/login') {
    const b = await readJson(req);
    if (b && USERS[b.username] === b.password) return send(res, 200, { token: TOKEN });
    return send(res, 401, { error: 'שם משתמש או סיסמה שגויים' });
  }

  if (req.method === 'GET' && path === '/api/books') {
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
    const found = q ? books.filter((b) => [b.title, b.author, b.isbn].some((v) => v.toLowerCase().includes(q))) : books;
    return send(res, 200, found);
  }

  if (req.method === 'POST' && path === '/api/books') {
    if (!authorized(req)) return send(res, 401, { error: 'נדרשת כניסה' });
    const b = await readJson(req);
    if (!b || !String(b.title ?? '').trim()) return send(res, 400, { error: 'יש להזין כותרת' });
    if (!isValidIsbn(b.isbn)) return send(res, 400, { error: 'ISBN לא תקין' });
    const isbn = normalizeIsbn(b.isbn);
    if (books.some((x) => x.isbn === isbn)) return send(res, 409, { error: 'ISBN כבר קיים' });
    const book = { id: nextId++, title: String(b.title).trim(), author: String(b.author ?? '').trim(), isbn };
    books.push(book);
    return send(res, 201, book);
  }

  const one = path.match(/^\/api\/books\/(\d+)$/);
  if (req.method === 'PUT' && one) {
    if (!authorized(req)) return send(res, 401, { error: 'נדרשת כניסה' });
    const book = books.find((x) => x.id === Number(one[1]));
    if (!book) return send(res, 404, { error: 'הספר לא נמצא' });
    const b = await readJson(req);
    if (!b || !String(b.title ?? '').trim()) return send(res, 400, { error: 'יש להזין כותרת' });
    if (!isValidIsbn(b.isbn)) return send(res, 400, { error: 'ISBN לא תקין' });
    const isbn = normalizeIsbn(b.isbn);
    if (books.some((x) => x.isbn === isbn && x.id !== book.id)) return send(res, 409, { error: 'ISBN כבר קיים' });
    Object.assign(book, { title: String(b.title).trim(), author: String(b.author ?? '').trim(), isbn });
    return send(res, 200, book);
  }

  const del = path.match(/^\/api\/books\/(\d+)$/);
  if (req.method === 'DELETE' && del) {
    if (!authorized(req)) return send(res, 401, { error: 'נדרשת כניסה' });
    const i = books.findIndex((x) => x.id === Number(del[1]));
    if (i < 0) return send(res, 404, { error: 'הספר לא נמצא' });
    books.splice(i, 1);
    return send(res, 204);
  }

  // לצורכי הסדנה בלבד: איפוס הנתונים (לא קיים בפרודקשן)
  if (req.method === 'POST' && path === '/api/test/reset' && process.env.NODE_ENV !== 'production') {
    reset();
    return send(res, 204);
  }

  return send(res, 404, { error: 'לא נמצא' });
});

server.listen(PORT, () => console.log(`Library API on http://localhost:${PORT}`));
