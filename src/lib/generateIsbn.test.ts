import { describe, expect, it } from 'vitest';
import { generateIsbn13, isValidIsbn } from './isbn';

describe('generateIsbn13', () => {
  it('מחזיר ISBN-13 תקין עם קידומת 978', () => {
    const isbn = generateIsbn13();
    expect(isbn).toMatch(/^978\d{10}$/);
    expect(isValidIsbn(isbn)).toBe(true);
  });

  it('תקין גם על הרבה ערכים אקראיים', () => {
    for (let i = 0; i < 200; i++) expect(isValidIsbn(generateIsbn13())).toBe(true);
  });

  it('דטרמיניסטי כשמזריקים random קבוע', () => {
    expect(generateIsbn13(() => 0)).toBe('9780000000002');
  });
});
