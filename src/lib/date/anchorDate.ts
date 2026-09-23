import dayjs, { type Dayjs } from 'dayjs';

import type { AnchorDate } from '@types';

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Проверяет, существует ли дата в календаре указанного года.
 * 29.02 в невисокосный год → false (на этапе отображения — «нет данных»).
 */
export const isValidCalendarDate = (
  month: number,
  day: number,
  year: number,
): boolean => {
  if (month < 1 || month > 12 || day < 1) {
    return false;
  }

  const februaryDays = isLeapYear(year) ? 29 : 28;
  const maxDay = month === 2 ? februaryDays : DAYS_IN_MONTH[month - 1];

  return day <= maxDay;
};

export const parseAnchorDate = (date: Dayjs): AnchorDate => {
  return {
    month: date.month() + 1,
    day: date.date(),
    year: date.year(),
  };
};

export const toDayjs = (anchor: AnchorDate): Dayjs => {
  return dayjs()
    .year(anchor.year)
    .month(anchor.month - 1)
    .date(anchor.day)
    .startOf('day');
};

export const formatAnchorDate = (anchor: AnchorDate): string => {
  return toDayjs(anchor).format('D MMMM YYYY');
};

export const getAnchorYear = (anchor: AnchorDate): number => {
  return anchor.year;
};

/** Диапазон лет anchorYear − 10 … anchorYear + 10 (21 год). */
export const getYearRange = (anchor: AnchorDate): number[] => {
  const anchorYear = getAnchorYear(anchor);
  const years: number[] = [];

  for (let year = anchorYear - 10; year <= anchorYear + 10; year++) {
    years.push(year);
  }

  return years;
};

export const formatYearRange = (anchor: AnchorDate): string => {
  const years = getYearRange(anchor);

  return `${years[0]}–${years[years.length - 1]}`;
};
