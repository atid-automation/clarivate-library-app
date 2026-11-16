# אפליקציית הספרייה לסדנת הבדיקות (Clarivate)

אפליקציית תרגול קטנה: React עם TypeScript, ושרת API ב-Node בלי תלויות. היא אינה קשורה למוצר כלשהו של הלקוח ואינה משתמשת בשום נתון שלו.

## הרצה

```
npm install
npx playwright install chromium
npm run api      # שרת ה-API, פורט 3001
npm run dev      # האפליקציה, פורט 5173
```

משתמש הדמו: `librarian` עם הסיסמה `secret`. איפוס הנתונים: `POST /api/test/reset`.

## מבנה

| נתיב | מה יש בו |
|---|---|
| `server/` | שרת ה-API (`/api/login`, `/api/books`, `/api/test/reset`) |
| `src/lib/` | `isbn.ts` (נרמול ובדיקת ISBN), `lateFee.ts` (קנס איחור עם שעון) |
| `src/components/` | `AddBookForm` (הטופס, `onAdd` מוזרק), `LoginForm` |
| `src/*.test.*`, `src/**/*.test.*` | בדיקות Vitest: יחידה וקומפוננטה |
| `e2e/` | בדיקות Playwright: API, E2E, mock ו-`TEST_MODE` (`fixtures.ts`) |

## הרצת הבדיקות

```
npm test                 # Vitest: יחידה וקומפוננטה
npm run test:pr          # Playwright: רק @smoke, מול mock
npm run test:nightly     # Playwright: הכול, מול השרת האמיתי (TEST_MODE=real)
```

## ההדגמות בסדנה

כל הדגמה מתחילה מתג (tag) ב-git, כדי שכשל בהדגמה אחת לא יפיל את הבאות. התגים ייווצרו כשהפרקים ייכתבו: `start`, `after-2-1`, `after-3-1` וכן הלאה.
