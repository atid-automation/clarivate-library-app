import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { lateFee } from './lateFee';

describe('lateFee', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-30T12:00:00Z'));   // שעון קבוע: הבדיקה לא תלויה ביום שבו היא רצה
  });
  afterEach(() => vi.useRealTimers());

  it('אין קנס בתוך 14 יום', () => {
    expect(lateFee(new Date('2026-11-16T12:00:00Z'))).toBe(0);
  });

  it('קנס על כל יום איחור', () => {
    expect(lateFee(new Date('2026-11-10T12:00:00Z'))).toBe(3);   // 20 יום מהשאלה, 6 ימי איחור
  });
});
