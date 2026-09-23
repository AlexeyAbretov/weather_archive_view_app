import { isValidCalendarDate } from '@lib/date/anchorDate.ts';
import dayjs, { type Dayjs } from 'dayjs';

import type { NoDataReason } from './weatherDayRecord.ts';
import { ARCHIVE_MIN_YEAR } from './yearRange.ts';

export const ARCHIVE_LAG_DAYS = 5;
export const MODE_B_WINDOW_DAYS = 15;
export const MODE_B_OFFSET_DAYS = 7;

export type DateFetchability =
  { fetchable: true } | { fetchable: false; reason: NoDataReason };

export const resolveTargetDate = (
  anchor: Dayjs,
  year: number,
): Dayjs | null => {
  const month = anchor.month() + 1;
  const day = anchor.date();

  if (!isValidCalendarDate(month, day, year)) {
    return null;
  }

  return dayjs()
    .year(year)
    .month(anchor.month())
    .date(anchor.date())
    .startOf('day');
};

export const resolveModeBWindow = (anchor: Dayjs, year: number): Dayjs[] => {
  const anchorInYear = resolveTargetDate(anchor, year);

  if (!anchorInYear) {
    const fallbackCenter = dayjs()
      .year(year)
      .month(anchor.month())
      .date(Math.min(anchor.date(), 28))
      .startOf('day');

    return Array.from({ length: MODE_B_WINDOW_DAYS }, (_, index) =>
      fallbackCenter.add(index - MODE_B_OFFSET_DAYS, 'day'),
    );
  }

  return Array.from({ length: MODE_B_WINDOW_DAYS }, (_, index) =>
    anchorInYear.add(index - MODE_B_OFFSET_DAYS, 'day'),
  );
};

export const checkDateFetchability = (
  targetDate: Dayjs,
  today: Dayjs = dayjs().startOf('day'),
): DateFetchability => {
  if (targetDate.year() < ARCHIVE_MIN_YEAR) {
    return { fetchable: false, reason: 'missing' };
  }

  if (targetDate.isAfter(today, 'day')) {
    return { fetchable: false, reason: 'future' };
  }

  const archiveCutoff = today.subtract(ARCHIVE_LAG_DAYS, 'day');

  if (targetDate.isAfter(archiveCutoff, 'day')) {
    return { fetchable: false, reason: 'archive_lag' };
  }

  return { fetchable: true };
};

export const formatIsoDate = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD');
};
