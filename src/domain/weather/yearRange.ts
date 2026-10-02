import type { AnchorDate } from '@types';
import { getYearRange, todayAnchorDate } from '@utils';

export const ARCHIVE_MIN_YEAR = 1940;

/** Годы от anchorYear − 10 до min(anchorYear + 10, текущий год). */
export const buildYearRange = (anchorDate: AnchorDate): number[] => {
  return getYearRange(anchorDate, todayAnchorDate().year);
};

export const isYearBeforeArchive = (year: number): boolean => {
  return year < ARCHIVE_MIN_YEAR;
};
