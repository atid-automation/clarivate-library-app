// ולידציית ISBN בשרת (עותק קטן של src/lib/isbn.ts: השרת כתוב ב-JavaScript בלי תלויות).
export function normalizeIsbn(raw) {
  return String(raw ?? '').replace(/[\s-]/g, '').toUpperCase();
}

export function isValidIsbn(raw) {
  const s = normalizeIsbn(raw);
  if (/^\d{13}$/.test(s)) {
    const sum = [...s].slice(0, 12).reduce((acc, ch, i) => acc + Number(ch) * (i % 2 === 0 ? 1 : 3), 0);
    return (10 - (sum % 10)) % 10 === Number(s[12]);
  }
  if (/^\d{9}[\dX]$/.test(s)) {
    const sum = [...s].reduce((acc, ch, i) => acc + (ch === 'X' ? 10 : Number(ch)) * (10 - i), 0);
    return sum % 11 === 0;
  }
  return false;
}
