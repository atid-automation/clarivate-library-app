import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { lateFee } from './lateFee';

describe('lateFee', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-30T12:00:00Z'));   // fixed clock: the test doesn't depend on the day it runs
  });
  afterEach(() => vi.useRealTimers());

  it('אין קנס בתוך 14 יום', () => {
    expect(lateFee(new Date('2026-11-16T12:00:00Z'))).toBe(0);
  });

  it('קנס על כל יום איחור', () => {
    expect(lateFee(new Date('2026-11-10T12:00:00Z'))).toBe(3);   // 20 days since the loan, 6 days late
  });
});
