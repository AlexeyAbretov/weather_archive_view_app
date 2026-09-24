import { describe, expect, it, vi } from 'vitest';

import {
  formatAnchorDate,
  formatYearRange,
  getAnchorYear,
  getYearRange,
  isLeapYear,
  isValidCalendarDate,
  todayAnchorDate,
} from '../anchorDate';

describe('anchorDate', () => {
  it('определяет високосный год', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
  });

  it('проверяет календарную дату', () => {
    expect(isValidCalendarDate(0, 1, 2020)).toBe(false);
    expect(isValidCalendarDate(13, 1, 2020)).toBe(false);
    expect(isValidCalendarDate(1, 0, 2020)).toBe(false);
    expect(isValidCalendarDate(2, 29, 2020)).toBe(true);
    expect(isValidCalendarDate(2, 29, 2019)).toBe(false);
    expect(isValidCalendarDate(2, 28, 2019)).toBe(true);
    expect(isValidCalendarDate(4, 31, 2020)).toBe(false);
    expect(isValidCalendarDate(9, 15, 2020)).toBe(true);
  });

  it('берёт сегодняшнюю дату из системных часов', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2020, 8, 15));

    expect(todayAnchorDate()).toEqual({
      year: 2020,
      month: 9,
      day: 15,
    });

    vi.useRealTimers();
  });

  it('форматирует дату и диапазон лет', () => {
    const anchor = { year: 2020, month: 9, day: 15 };

    expect(formatAnchorDate(anchor)).toBe('15 сентября 2020');
    expect(getAnchorYear(anchor)).toBe(2020);
    expect(getYearRange(anchor)).toEqual(
      Array.from({ length: 21 }, (_, index) => 2010 + index),
    );
    expect(formatYearRange(anchor)).toBe('2010–2030');
  });
});
