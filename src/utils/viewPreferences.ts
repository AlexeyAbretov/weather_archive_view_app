import type { AnchorDate } from '@types';

import { isValidCalendarDate, todayAnchorDate } from './anchorDate';

export const ANCHOR_DATE_STORAGE_KEY = 'weather-archive.anchor-date';
export const VIEW_MODE_STORAGE_KEY = 'weather-archive.view-mode';
export const YEAR_TABLE_LAYOUT_STORAGE_KEY =
  'weather-archive.year-table-layout';
export const EXPANDED_YEARS_STORAGE_KEY = 'weather-archive.expanded-years';

const isInteger = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isInteger(value);
};

const isNotAfterToday = (date: AnchorDate): boolean => {
  const today = todayAnchorDate();

  if (date.year !== today.year) {
    return date.year < today.year;
  }

  if (date.month !== today.month) {
    return date.month < today.month;
  }

  return date.day <= today.day;
};

const readAnchorDateValue = (value: unknown): AnchorDate | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate = value as AnchorDate;

  if (
    !isInteger(candidate.year) ||
    !isInteger(candidate.month) ||
    !isInteger(candidate.day) ||
    !isValidCalendarDate(candidate.month, candidate.day, candidate.year) ||
    !isNotAfterToday(candidate)
  ) {
    return null;
  }

  return {
    year: candidate.year,
    month: candidate.month,
    day: candidate.day,
  };
};

const readYearList = (value: unknown): number[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const years: number[] = [];

  value.forEach((item) => {
    if (!isInteger(item) || years.includes(item)) {
      return;
    }

    years.push(item);
  });

  return years;
};

export const readAnchorDate = (): AnchorDate | null => {
  try {
    const raw = localStorage.getItem(ANCHOR_DATE_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return readAnchorDateValue(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const saveAnchorDate = (date: AnchorDate): void => {
  const stored = readAnchorDateValue(date);

  if (!stored) {
    return;
  }

  try {
    localStorage.setItem(ANCHOR_DATE_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    return;
  }
};

export const readViewMode = (): 'A' | 'B' | null => {
  try {
    const value = localStorage.getItem(VIEW_MODE_STORAGE_KEY);

    if (value === 'A' || value === 'B') {
      return value;
    }

    return null;
  } catch {
    return null;
  }
};

export const saveViewMode = (mode: 'A' | 'B'): void => {
  try {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch {
    return;
  }
};

export const readYearTableLayout = (): 'rows' | 'columns' | null => {
  try {
    const value = localStorage.getItem(YEAR_TABLE_LAYOUT_STORAGE_KEY);

    if (value === 'rows' || value === 'columns') {
      return value;
    }

    return null;
  } catch {
    return null;
  }
};

export const saveYearTableLayout = (layout: 'rows' | 'columns'): void => {
  try {
    localStorage.setItem(YEAR_TABLE_LAYOUT_STORAGE_KEY, layout);
  } catch {
    return;
  }
};

type ExpandedYearsRecord = {
  lat: number;
  lon: number;
  year: number;
  month: number;
  day: number;
  years: unknown;
};

const readExpandedYearsValue = (
  value: unknown,
  lat: number,
  lon: number,
  anchorDate: AnchorDate,
): number[] => {
  if (typeof value !== 'object' || value === null) {
    return [];
  }

  const candidate = value as ExpandedYearsRecord;

  if (
    candidate.lat !== lat ||
    candidate.lon !== lon ||
    candidate.year !== anchorDate.year ||
    candidate.month !== anchorDate.month ||
    candidate.day !== anchorDate.day
  ) {
    return [];
  }

  return readYearList(candidate.years);
};

export const readExpandedYears = (
  lat: number | null,
  lon: number | null,
  anchorDate: AnchorDate | null,
): number[] => {
  if (lat == null || lon == null || anchorDate == null) {
    return [];
  }

  try {
    const raw = localStorage.getItem(EXPANDED_YEARS_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    return readExpandedYearsValue(JSON.parse(raw), lat, lon, anchorDate);
  } catch {
    return [];
  }
};

export const saveExpandedYears = (
  lat: number | null,
  lon: number | null,
  anchorDate: AnchorDate | null,
  years: number[],
): void => {
  if (lat == null || lon == null || anchorDate == null) {
    return;
  }

  try {
    localStorage.setItem(
      EXPANDED_YEARS_STORAGE_KEY,
      JSON.stringify({
        lat,
        lon,
        year: anchorDate.year,
        month: anchorDate.month,
        day: anchorDate.day,
        years: readYearList(years),
      }),
    );
  } catch {
    return;
  }
};
