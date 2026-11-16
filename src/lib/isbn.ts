/** מסיר רווחים ומקפים ומעביר לאותיות גדולות (ל-X בסוף ISBN-10). */
export function normalizeIsbn(raw: string): string {
  return raw.replace(/[\s-]/g, '').toUpperCase();
}

/** בודק ספרת ביקורת של ISBN-13 או ISBN-10. */
export function isValidIsbn(raw: string): boolean {
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

/** מחולל ISBN-13 תקין לתרגול: קידומת 978, תשע ספרות אקראיות וספרת ביקורת. `random` מוזרק כדי שאפשר יהיה לבדוק. */
export function generateIsbn13(random: () => number = Math.random): string {
  const body = '978' + Array.from({ length: 9 }, () => Math.floor(random() * 10)).join('');
  const sum = [...body].reduce((acc, ch, i) => acc + Number(ch) * (i % 2 === 0 ? 1 : 3), 0);
  return body + String((10 - (sum % 10)) % 10);
}
