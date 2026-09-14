import dayjs from 'dayjs';
import { resolveCalendarDate } from './leapYear';
import type { ArchiveViewMode, YearWindowSlot } from './yearWindow';

const MIN_ARCHIVE_YEAR = 1940;
const YEAR_OFFSET = 10;

function addDays(dateStr: string, days: number): string {
  return dayjs(dateStr).add(days, 'day').format('YYYY-MM-DD');
}

function buildSlotForYear(
  year: number,
  anchorDate: string,
  mode: ArchiveViewMode,
): YearWindowSlot {
  if (year < MIN_ARCHIVE_YEAR) {
    return { year, startDate: null, endDate: null, unavailable: true };
  }

  const anchor = dayjs(anchorDate);
  const month = anchor.month() + 1;
  const day = anchor.date();

  if (mode === 'A') {
    const calendarDate = resolveCalendarDate(year, month, day);
    if (!calendarDate) {
      return { year, startDate: null, endDate: null, unavailable: true };
    }
    return { year, startDate: calendarDate, endDate: calendarDate, unavailable: false };
  }

  const centerDate = resolveCalendarDate(year, month, day);
  if (!centerDate) {
    return { year, startDate: null, endDate: null, unavailable: true };
  }

  const startDate = addDays(centerDate, -7);
  const endDate = addDays(centerDate, 7);

  return { year, startDate, endDate, unavailable: false };
}

export function buildYearWindow(anchorDate: string, mode: ArchiveViewMode): YearWindowSlot[] {
  const referenceYear = dayjs(anchorDate).year();
  const slots: YearWindowSlot[] = [];

  for (let offset = -YEAR_OFFSET; offset <= YEAR_OFFSET; offset += 1) {
    slots.push(buildSlotForYear(referenceYear + offset, anchorDate, mode));
  }

  return slots;
}

export function getDayOffsets(): number[] {
  return Array.from({ length: 15 }, (_, index) => index - 7);
}

export function getDatesForYearWindow(
  anchorDate: string,
  year: number,
): Array<{ offset: number; date: string | null }> {
  const anchor = dayjs(anchorDate);
  const month = anchor.month() + 1;
  const day = anchor.date();
  const centerDate = resolveCalendarDate(year, month, day);

  if (!centerDate) {
    return getDayOffsets().map((offset) => ({ offset, date: null }));
  }

  return getDayOffsets().map((offset) => ({
    offset,
    date: addDays(centerDate, offset),
  }));
}

/** Дата позже допустимого архива (ERA5 lag ~5 дней). */
export function isFutureArchiveDate(dateStr: string, today = dayjs()): boolean {
  const archiveLagDays = 5;
  const latestAvailable = today.subtract(archiveLagDays, 'day').startOf('day');
  return dayjs(dateStr).isAfter(latestAvailable, 'day');
}
