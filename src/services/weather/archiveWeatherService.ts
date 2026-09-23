import { fetchArchive } from '@api/openMeteo/archiveClient.ts';
// eslint-disable-next-line @stylistic/max-len -- длинный путь модуля API
import type { OpenMeteoArchiveResponse } from '@api/openMeteo/archiveResponse.types.ts';
import type { Dayjs } from 'dayjs';

import {
  normalizeDailyRecord,
  normalizeDailyRecords,
} from './normalizeDailyRecord.ts';

import {
  checkDateFetchability,
  formatIsoDate,
  resolveModeBWindow,
  resolveTargetDate,
} from '../../domain/weather/anchorDates.ts';
import {
  createNoDataRecord,
  type WeatherDayRecord,
  type YearWeatherRow,
  type YearWeatherWindow,
} from '../../domain/weather/weatherDayRecord.ts';
import { buildYearRange } from '../../domain/weather/yearRange.ts';
import { runWithConcurrencyLimit } from '../../lib/concurrencyPool.ts';
import { isValidCalendarDate } from '../../lib/date/anchorDate.ts';
import { MemoryCache } from '../../lib/memoryCache.ts';

export type ArchiveWeatherParams = {
  lat: number;
  lon: number;
  anchorDate: Dayjs;
};

type FetchWindowParams = ArchiveWeatherParams & {
  startDate: string;
  endDate: string;
  cacheMode: 'A' | 'B';
  cacheYear: number;
};

const responseCache = new MemoryCache<OpenMeteoArchiveResponse>();

const placeholderDateForYear = (anchor: Dayjs, year: number): string => {
  const month = String(anchor.month() + 1).padStart(2, '0');
  const day = String(anchor.date()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const roundCoordinate = (value: number): string => {
  return value.toFixed(4);
};

const buildCacheKey = (params: FetchWindowParams): string => {
  return [
    roundCoordinate(params.lat),
    roundCoordinate(params.lon),
    params.cacheMode,
    formatIsoDate(params.anchorDate),
    params.cacheYear,
    params.startDate,
    params.endDate,
  ].join(':');
};

const fetchArchiveWindow = async (
  params: FetchWindowParams,
): Promise<OpenMeteoArchiveResponse> => {
  const cacheKey = buildCacheKey(params);
  const cached = responseCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await fetchArchive({
    lat: params.lat,
    lon: params.lon,
    startDate: params.startDate,
    endDate: params.endDate,
  });

  responseCache.set(cacheKey, response);

  return response;
};

const resolveModeADay = (anchorDate: Dayjs, year: number): WeatherDayRecord => {
  const targetDate = resolveTargetDate(anchorDate, year);

  if (!targetDate) {
    return createNoDataRecord(
      placeholderDateForYear(anchorDate, year),
      year,
      'feb29',
    );
  }

  const isoDate = formatIsoDate(targetDate);
  const fetchability = checkDateFetchability(targetDate);

  if (!fetchability.fetchable) {
    return createNoDataRecord(isoDate, year, fetchability.reason);
  }

  return createNoDataRecord(isoDate, year, 'missing');
};

const fetchModeADay = async (
  params: ArchiveWeatherParams,
  year: number,
): Promise<WeatherDayRecord> => {
  const targetDate = resolveTargetDate(params.anchorDate, year);

  if (!targetDate) {
    return createNoDataRecord(
      placeholderDateForYear(params.anchorDate, year),
      year,
      'feb29',
    );
  }

  const isoDate = formatIsoDate(targetDate);
  const fetchability = checkDateFetchability(targetDate);

  if (!fetchability.fetchable) {
    return createNoDataRecord(isoDate, year, fetchability.reason);
  }

  try {
    const response = await fetchArchiveWindow({
      ...params,
      startDate: isoDate,
      endDate: isoDate,
      cacheMode: 'A',
      cacheYear: year,
    });

    return normalizeDailyRecord(response, isoDate, year);
  } catch {
    return createNoDataRecord(isoDate, year, 'api_error');
  }
};

export const fetchModeBYear = async (
  params: ArchiveWeatherParams,
  year: number,
): Promise<YearWeatherWindow> => {
  const windowDates = resolveModeBWindow(params.anchorDate, year);

  const dayRecords = windowDates.map((date) => {
    const isoDate = formatIsoDate(date);

    if (!isValidCalendarDate(date.month() + 1, date.date(), date.year())) {
      return createNoDataRecord(isoDate, year, 'feb29');
    }

    const fetchability = checkDateFetchability(date);

    if (!fetchability.fetchable) {
      return createNoDataRecord(isoDate, year, fetchability.reason);
    }

    return createNoDataRecord(isoDate, year, 'missing');
  });

  const fetchableDates = windowDates
    .map((date, index) => ({ date, index }))
    .filter(({ date }) => checkDateFetchability(date).fetchable);

  if (fetchableDates.length === 0) {
    return { year, days: dayRecords };
  }

  const startDate = formatIsoDate(fetchableDates[0]!.date);
  const endDate = formatIsoDate(
    fetchableDates[fetchableDates.length - 1]!.date,
  );

  try {
    const response = await fetchArchiveWindow({
      ...params,
      startDate,
      endDate,
      cacheMode: 'B',
      cacheYear: year,
    });

    const normalized = normalizeDailyRecords(
      response,
      fetchableDates.map(({ date }) => ({
        date: formatIsoDate(date),
        year,
      })),
    );

    fetchableDates.forEach(({ index }, normalizedIndex) => {
      dayRecords[index] = normalized[normalizedIndex]!;
    });
  } catch {
    fetchableDates.forEach(({ index, date }) => {
      dayRecords[index] = createNoDataRecord(
        formatIsoDate(date),
        year,
        'api_error',
      );
    });
  }

  return { year, days: dayRecords };
};

export const fetchModeA = async (
  params: ArchiveWeatherParams,
): Promise<YearWeatherRow[]> => {
  const years = buildYearRange(params.anchorDate);

  const tasks = years.map(
    (year) => () => fetchModeADay(params, year).then((day) => ({ year, day })),
  );

  return runWithConcurrencyLimit(tasks);
};

export const fetchModeB = async (
  params: ArchiveWeatherParams,
): Promise<YearWeatherWindow[]> => {
  const years = buildYearRange(params.anchorDate);

  const tasks = years.map((year) => () => fetchModeBYear(params, year));

  return runWithConcurrencyLimit(tasks);
};

export const previewModeADay = (
  anchorDate: Dayjs,
  year: number,
): WeatherDayRecord => {
  return resolveModeADay(anchorDate, year);
};

export const clearArchiveWeatherCache = (): void => {
  responseCache.clear();
};

export type ArchiveWeatherService = {
  fetchModeA: typeof fetchModeA;
  fetchModeB: typeof fetchModeB;
  clearCache: typeof clearArchiveWeatherCache;
};

export const archiveWeatherService: ArchiveWeatherService = {
  fetchModeA,
  fetchModeB,
  clearCache: clearArchiveWeatherCache,
};
