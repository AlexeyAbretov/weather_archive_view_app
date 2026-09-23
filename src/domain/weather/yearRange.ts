import type { Dayjs } from 'dayjs';

export const ARCHIVE_MIN_YEAR = 1940;

/** Диапазон anchorYear − 10 … anchorYear + 10 (до 21 года). */
export const buildYearRange = (anchorDate: Dayjs): number[] => {
  const anchorYear = anchorDate.year();
  const years: number[] = [];

  for (let year = anchorYear - 10; year <= anchorYear + 10; year++) {
    years.push(year);
  }

  return years;
};

export const isYearBeforeArchive = (year: number): boolean => {
  return year < ARCHIVE_MIN_YEAR;
};
