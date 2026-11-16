export const LOAN_DAYS = 14;
export const FEE_PER_DAY = 0.5;

const DAY_MS = 24 * 60 * 60 * 1000;

/** כמה ימים עבר המועד להחזרה. `now` הוא ברירת מחדל של השעון האמיתי, ולכן הבדיקה מקבעת אותו. */
export function daysOverdue(borrowedAt: Date, now: Date = new Date()): number {
  const days = Math.floor((now.getTime() - borrowedAt.getTime()) / DAY_MS);
  return Math.max(0, days - LOAN_DAYS);
}

export function lateFee(borrowedAt: Date, now: Date = new Date()): number {
  return daysOverdue(borrowedAt, now) * FEE_PER_DAY;
}
