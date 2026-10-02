import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchArchive, fetchForecast } from '@api';
import type { AnchorDate } from '@types';

import {
  clearArchiveWeatherCache,
  fetchModeA,
  fetchModeBYear,
} from '../ArchiveWeatherService';

const TODAY: AnchorDate = { year: 2026, month: 9, day: 24 };

vi.mock('@utils', async () => {
  const actual = await vi.importActual<typeof import('@utils')>('@utils');

  return {
    ...actual,
    todayAnchorDate: () => TODAY,
  };
});

vi.mock('@api', () => ({
  fetchArchive: vi.fn(),
  fetchForecast: vi.fn(),
}));

const listDates = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const cursor = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (cursor.getTime() <= end.getTime()) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, '0');
    const day = String(cursor.getDate()).padStart(2, '0');

    dates.push(`${year}-${month}-${day}`);
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

const weatherResponse = (startDate: string, endDate: string) => {
  const dates = listDates(startDate, endDate);

  return {
    latitude: 55.75,
    longitude: 37.62,
    timezone: 'Europe/Moscow',
    daily: {
      time: dates,
      temperature_2m_max: dates.map(() => 18),
      temperature_2m_min: dates.map(() => 8),
      precipitation_sum: dates.map(() => 0),
      rain_sum: dates.map(() => 0),
      snowfall_sum: dates.map(() => 0),
      wind_speed_10m_max: dates.map(() => 12),
      wind_direction_10m_dominant: dates.map(() => 90),
    },
    hourly: {
      time: dates.map((date) => `${date}T12:00`),
      weather_code: dates.map(() => 1),
      cloud_cover: dates.map(() => 30),
    },
  };
};

const location = { lat: 55.75, lon: 37.62 };

describe('ArchiveWeatherService forecast', () => {
  beforeEach(() => {
    clearArchiveWeatherCache();
    vi.mocked(fetchArchive).mockReset();
    vi.mocked(fetchForecast).mockReset();
    vi.mocked(fetchArchive).mockImplementation(async (params) =>
      weatherResponse(params.startDate, params.endDate),
    );
    vi.mocked(fetchForecast).mockImplementation(async (params) =>
      weatherResponse(params.startDate, params.endDate),
    );
  });

  it('для текущего года берёт прогноз вместо «нет данных»', async () => {
    const rows = await fetchModeA({
      ...location,
      anchorDate: TODAY,
    });

    expect(fetchForecast).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: '2026-09-24',
        endDate: '2026-09-24',
      }),
    );
    expect(fetchArchive).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: '2025-09-24',
        endDate: '2025-09-24',
      }),
    );
    expect(rows.map((row) => row.year)).toEqual(
      Array.from({ length: 11 }, (_, index) => 2016 + index),
    );
    expect(rows.find((row) => row.year === 2026)?.day).toMatchObject({
      hasData: true,
      tempMax: 18,
    });
    expect(rows.find((row) => row.year === 2027)).toBeUndefined();
  });

  it('берёт прогноз в лаге архива и не дальше горизонта', async () => {
    await fetchModeA({
      ...location,
      anchorDate: { year: 2026, month: 12, day: 24 },
    });

    expect(fetchForecast).not.toHaveBeenCalled();

    vi.mocked(fetchForecast).mockClear();

    await fetchModeA({
      ...location,
      anchorDate: { year: 2026, month: 9, day: 22 },
    });

    expect(fetchForecast).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: '2026-09-22',
        endDate: '2026-09-22',
      }),
    );
  });

  it('помечает сбой прогноза и повторно читает кэш', async () => {
    vi.mocked(fetchForecast).mockRejectedValueOnce(new Error('сеть'));

    const failed = await fetchModeA({
      ...location,
      anchorDate: TODAY,
    });

    expect(failed.find((row) => row.year === 2026)?.day.noDataReason).toBe(
      'api_error',
    );

    clearArchiveWeatherCache();
    vi.mocked(fetchForecast).mockClear();
    vi.mocked(fetchForecast).mockImplementation(async (params) =>
      weatherResponse(params.startDate, params.endDate),
    );

    await fetchModeA({ ...location, anchorDate: TODAY });
    await fetchModeA({ ...location, anchorDate: TODAY });

    expect(fetchForecast).toHaveBeenCalledTimes(1);
  });

  it('делит окно текущего года на архив и прогноз', async () => {
    const window = await fetchModeBYear(
      { ...location, anchorDate: TODAY },
      TODAY.year,
    );

    expect(fetchArchive).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: '2026-09-17',
        endDate: '2026-09-19',
      }),
    );
    expect(fetchForecast).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: '2026-09-20',
        endDate: '2026-10-01',
      }),
    );
    expect(window.days.every((day) => day.hasData)).toBe(true);

    vi.mocked(fetchArchive).mockClear();
    vi.mocked(fetchForecast).mockClear();

    const future = await fetchModeBYear(
      { ...location, anchorDate: TODAY },
      2027,
    );

    expect(fetchArchive).not.toHaveBeenCalled();
    expect(fetchForecast).not.toHaveBeenCalled();
    expect(future.days.every((day) => day.noDataReason === 'future')).toBe(
      true,
    );
  });

  it('не запрашивает прогноз для 29 февраля невисокосного года', async () => {
    const rows = await fetchModeA({
      ...location,
      anchorDate: { year: 2024, month: 2, day: 29 },
    });

    expect(fetchForecast).not.toHaveBeenCalled();
    expect(rows.find((row) => row.year === 2026)?.day.noDataReason).toBe(
      'feb29',
    );
  });
});
