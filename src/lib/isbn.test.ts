import { describe, expect, it } from 'vitest';
import { isValidIsbn, normalizeIsbn } from './isbn';

describe('normalizeIsbn', () => {
  it('מסיר מקפים ורווחים', () => {
    expect(normalizeIsbn('978-0-441-01359-3')).toBe('9780441013593');
    expect(normalizeIsbn(' 0 306 40615 2 ')).toBe('0306406152');
  });
});

describe('isValidIsbn', () => {
  it.each(['9780441013593', '978-0-441-01359-3', '0306406152'])('מקבל ISBN תקין: %s', (isbn) => {
    expect(isValidIsbn(isbn)).toBe(true);
  });

  it.each(['', '123', '9780441013594', '0306406153', 'abcdefghijklm'])('דוחה ISBN לא תקין: "%s"', (isbn) => {
    expect(isValidIsbn(isbn)).toBe(false);
  });
});
