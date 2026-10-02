import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ANCHOR_DATE_STORAGE_KEY,
  EXPANDED_YEARS_STORAGE_KEY,
  readAnchorDate,
  readExpandedYears,
  readViewMode,
  readYearTableLayout,
  saveAnchorDate,
  saveExpandedYears,
  saveViewMode,
  saveYearTableLayout,
  VIEW_MODE_STORAGE_KEY,
  YEAR_TABLE_LAYOUT_STORAGE_KEY,
} from '../viewPreferences';

const anchorDate = { year: 2020, month: 9, day: 15 };

describe('viewPreferences', () => {
  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('сохраняет якорную дату и отбрасывает некорректную', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 24));

    expect(readAnchorDate()).toBeNull();

    saveAnchorDate(anchorDate);

    expect(readAnchorDate()).toEqual(anchorDate);

    const rejected = [
      { year: 2027, month: 9, day: 24 },
      { year: 2026, month: 10, day: 24 },
      { year: 2026, month: 9, day: 25 },
      { year: 2026, month: 2, day: 31 },
      { year: 2020, month: 9, day: 15.5 },
      { year: '2020', month: 9, day: 15 },
    ];

    rejected.forEach((date) => {
      saveAnchorDate(date as typeof anchorDate);

      expect(readAnchorDate()).toEqual(anchorDate);
    });

    saveAnchorDate({ year: 2026, month: 8, day: 24 });
    expect(readAnchorDate()).toEqual({ year: 2026, month: 8, day: 24 });

    saveAnchorDate({ year: 2026, month: 9, day: 23 });
    expect(readAnchorDate()).toEqual({ year: 2026, month: 9, day: 23 });

    saveAnchorDate({ year: 2026, month: 9, day: 24 });
    expect(readAnchorDate()).toEqual({ year: 2026, month: 9, day: 24 });

    saveAnchorDate({ year: 2025, month: 9, day: 24 });
    expect(readAnchorDate()).toEqual({ year: 2025, month: 9, day: 24 });

    const invalidStored = ['не json', 'null', '[]', JSON.stringify(null)];

    invalidStored.forEach((value) => {
      localStorage.setItem(ANCHOR_DATE_STORAGE_KEY, value);

      expect(readAnchorDate()).toBeNull();
    });
  });

  it('сохраняет режим просмотра', () => {
    expect(readViewMode()).toBeNull();

    saveViewMode('B');
    expect(readViewMode()).toBe('B');

    saveViewMode('A');
    expect(readViewMode()).toBe('A');

    localStorage.setItem(VIEW_MODE_STORAGE_KEY, 'C');
    expect(readViewMode()).toBeNull();
  });

  it('сохраняет вид таблицы по годам', () => {
    expect(readYearTableLayout()).toBeNull();

    saveYearTableLayout('columns');
    expect(readYearTableLayout()).toBe('columns');

    saveYearTableLayout('rows');
    expect(readYearTableLayout()).toBe('rows');

    localStorage.setItem(YEAR_TABLE_LAYOUT_STORAGE_KEY, 'grid');
    expect(readYearTableLayout()).toBeNull();
  });

  it('сохраняет раскрытые годы для той же точки и даты', () => {
    expect(readExpandedYears(null, null, null)).toEqual([]);
    expect(readExpandedYears(1, 2, anchorDate)).toEqual([]);

    saveExpandedYears(null, 2, anchorDate, [2020]);
    expect(localStorage.getItem(EXPANDED_YEARS_STORAGE_KEY)).toBeNull();

    saveExpandedYears(1, 2, anchorDate, [2020, 2020, 2018, Number.NaN]);

    expect(readExpandedYears(1, 2, anchorDate)).toEqual([2020, 2018]);
    expect(readExpandedYears(3, 2, anchorDate)).toEqual([]);
    expect(readExpandedYears(1, 2, { year: 2021, month: 9, day: 15 })).toEqual(
      [],
    );

    localStorage.setItem(EXPANDED_YEARS_STORAGE_KEY, 'не json');
    expect(readExpandedYears(1, 2, anchorDate)).toEqual([]);

    localStorage.setItem(EXPANDED_YEARS_STORAGE_KEY, 'null');
    expect(readExpandedYears(1, 2, anchorDate)).toEqual([]);

    localStorage.setItem(
      EXPANDED_YEARS_STORAGE_KEY,
      JSON.stringify({
        lat: 1,
        lon: 2,
        year: 2020,
        month: 9,
        day: 15,
        years: 'нет',
      }),
    );
    expect(readExpandedYears(1, 2, anchorDate)).toEqual([]);
  });

  it('не падает, если хранилище недоступно', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });

    expect(readAnchorDate()).toBeNull();
    expect(readViewMode()).toBeNull();
    expect(readYearTableLayout()).toBeNull();
    expect(readExpandedYears(1, 2, anchorDate)).toEqual([]);

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });

    expect(() => {
      saveAnchorDate(anchorDate);
      saveViewMode('A');
      saveYearTableLayout('rows');
      saveExpandedYears(1, 2, anchorDate, [2020]);
    }).not.toThrow();
  });
});
