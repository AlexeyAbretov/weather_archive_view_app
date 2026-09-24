import type { AnchorDate } from '@types';
import { isValidCalendarDate, todayAnchorDate } from '@utils';

import type { NoDataReason } from './weatherDayRecord';
import { ARCHIVE_MIN_YEAR } from './yearRange';

export const ARCHIVE_LAG_DAYS = 5;
export const MODE_B_WINDOW_DAYS = 15;
export const MODE_B_OFFSET_DAYS = 7;
/** Forecast API: 16 суток, включая сегодня. */
export const FORECAST_HORIZON_DAYS = 15;

export type DateFetchability =
  { fetchable: true } | { fetchable: false; reason: NoDataReason };

const toDayStamp = (date: AnchorDate): number => {
  return Date.UTC(date.year, date.month - 1, date.day);
};

const addDays = (date: AnchorDate, days: number): AnchorDate => {
  const next = new Date(date.year, date.month - 1, date.day + days);

  return {
    year: next.getFullYear(),
    month: next.getMonth() + 1,
    day: next.getDate(),
  };
};

const isAfterDay = (date: AnchorDate, other: AnchorDate): boolean => {
  return toDayStamp(date) > toDayStamp(other);
};

export const resolveTargetDate = (
  anchor: AnchorDate,
  year: number,
): AnchorDate | null => {
  if (!isValidCalendarDate(anchor.month, anchor.day, year)) {
    return null;
  }

  return {
    year,
    month: anchor.month,
    day: anchor.day,
  };
};

export const resolveModeBWindow = (
  anchor: AnchorDate,
  year: number,
): AnchorDate[] => {
  const anchorInYear = resolveTargetDate(anchor, year);
  const center = anchorInYear ?? {
    year,
    month: anchor.month,
    day: Math.min(anchor.day, 28),
  };

  return Array.from({ length: MODE_B_WINDOW_DAYS }, (_, index) =>
    addDays(center, index - MODE_B_OFFSET_DAYS),
  );
};

export const checkDateFetchability = (
  targetDate: AnchorDate,
  today: AnchorDate = todayAnchorDate(),
): DateFetchability => {
  if (targetDate.year < ARCHIVE_MIN_YEAR) {
    return { fetchable: false, reason: 'missing' };
  }

  if (isAfterDay(targetDate, today)) {
    return { fetchable: false, reason: 'future' };
  }

  const archiveCutoff = addDays(today, -ARCHIVE_LAG_DAYS);

  if (isAfterDay(targetDate, archiveCutoff)) {
    return { fetchable: false, reason: 'archive_lag' };
  }

  return { fetchable: true };
};

export const isCurrentYearForecastDate = (
  targetDate: AnchorDate,
  today: AnchorDate = todayAnchorDate(),
): boolean => {
  if (targetDate.year !== today.year) {
    return false;
  }

  if (!isValidCalendarDate(targetDate.month, targetDate.day, targetDate.year)) {
    return false;
  }

  const fetchability = checkDateFetchability(targetDate, today);

  if (fetchability.fetchable) {
    return false;
  }

  if (fetchability.reason === 'archive_lag') {
    return true;
  }

  if (fetchability.reason !== 'future') {
    return false;
  }

  const horizon = addDays(today, FORECAST_HORIZON_DAYS);

  return !isAfterDay(targetDate, horizon);
};

export const formatIsoDate = (date: AnchorDate): string => {
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');

  return `${date.year}-${month}-${day}`;
};
