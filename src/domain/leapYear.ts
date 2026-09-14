export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Возвращает YYYY-MM-DD или null, если дата невалидна (напр. 29.02 в невисокосный год). */
export function resolveCalendarDate(year: number, month: number, day: number): string | null {
  if (month === 2 && day === 29 && !isLeapYear(year)) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}
