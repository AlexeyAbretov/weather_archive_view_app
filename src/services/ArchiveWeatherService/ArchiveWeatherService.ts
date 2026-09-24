import {
  fetchArchive,
  fetchForecast,
  type OpenMeteoArchiveResponse,
} from '@api';
import {
  buildYearRange,
  checkDateFetchability,
  createNoDataRecord,
  formatIsoDate,
  isCurrentYearForecastDate,
  resolveModeBWindow,
  resolveTargetDate,
  type WeatherDayRecord,
  type YearWeatherRow,
  type YearWeatherWindow,
} from '@domain';
import type { AnchorDate } from '@types';
import {
  isValidCalendarDate,
  MemoryCache,
  runWithConcurrencyLimit,
} from '@utils';

import { normalizeDailyRecords } from './normalizeDailyRecord';

export type ArchiveWeatherParams = {
  lat: number;
  lon: number;
  anchorDate: AnchorDate;
};

type FetchWindowParams = ArchiveWeatherParams & {
  startDate: string;
  endDate: string;
  cacheMode: 'A' | 'B' | 'F';
  cacheYear: number;
};

type DatedIndex = {
  date: AnchorDate;
  index: number;
};

const responseCache = new MemoryCache<OpenMeteoArchiveResponse>();

const placeholderDateForYear = (anchor: AnchorDate, year: number): string => {
  const month = String(anchor.month).padStart(2, '0');
  const day = String(anchor.day).padStart(2, '0');

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

const fetchWeatherWindow = async (
  params: FetchWindowParams,
  load: (request: FetchWindowParams) => Promise<OpenMeteoArchiveResponse>,
): Promise<OpenMeteoArchiveResponse> => {
  const cacheKey = buildCacheKey(params);
  const cached = responseCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const response = await load(params);

  responseCache.set(cacheKey, response);

  return response;
};

const applyNormalizedDays = (
  dayRecords: WeatherDayRecord[],
  dates: DatedIndex[],
  response: OpenMeteoArchiveResponse,
  year: number,
): void => {
  const normalized = normalizeDailyRecords(
    response,
    dates.map(({ date }) => ({
      date: formatIsoDate(date),
      year,
    })),
  );

  dates.forEach(({ index }, normalizedIndex) => {
    const record = normalized[normalizedIndex];

    if (record) {
      dayRecords[index] = record;
    }
  });
};

const markApiError = (
  dayRecords: WeatherDayRecord[],
  dates: DatedIndex[],
  year: number,
): void => {
  dates.forEach(({ index, date }) => {
    dayRecords[index] = createNoDataRecord(
      formatIsoDate(date),
      year,
      'api_error',
    );
  });
};

const fillDates = async (
  params: ArchiveWeatherParams,
  dates: DatedIndex[],
  year: number,
  dayRecords: WeatherDayRecord[],
  cacheMode: FetchWindowParams['cacheMode'],
  load: (request: FetchWindowParams) => Promise<OpenMeteoArchiveResponse>,
): Promise<void> => {
  const first = dates[0];
  const last = dates[dates.length - 1];

  if (!first || !last) {
    return;
  }

  try {
    const response = await fetchWeatherWindow(
      {
        ...params,
        startDate: formatIsoDate(first.date),
        endDate: formatIsoDate(last.date),
        cacheMode,
        cacheYear: year,
      },
      load,
    );

    applyNormalizedDays(dayRecords, dates, response, year);
  } catch {
    markApiError(dayRecords, dates, year);
  }
};

const resolveModeADay = (
  anchorDate: AnchorDate,
  year: number,
): WeatherDayRecord => {
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
  const useForecast =
    !fetchability.fetchable && isCurrentYearForecastDate(targetDate);

  if (!fetchability.fetchable && !useForecast) {
    return createNoDataRecord(isoDate, year, fetchability.reason);
  }

  const dayRecords = [createNoDataRecord(isoDate, year, 'missing')];

  await fillDates(
    params,
    [{ date: targetDate, index: 0 }],
    year,
    dayRecords,
    useForecast ? 'F' : 'A',
    useForecast ? fetchForecast : fetchArchive,
  );

  return dayRecords[0] ?? createNoDataRecord(isoDate, year, 'missing');
};

export const fetchModeBYear = async (
  params: ArchiveWeatherParams,
  year: number,
): Promise<YearWeatherWindow> => {
  const windowDates = resolveModeBWindow(params.anchorDate, year);

  const dayRecords = windowDates.map((date) => {
    const isoDate = formatIsoDate(date);

    if (!isValidCalendarDate(date.month, date.day, date.year)) {
      return createNoDataRecord(isoDate, year, 'feb29');
    }

    const fetchability = checkDateFetchability(date);

    if (fetchability.fetchable || isCurrentYearForecastDate(date)) {
      return createNoDataRecord(isoDate, year, 'missing');
    }

    return createNoDataRecord(isoDate, year, fetchability.reason);
  });

  const indexedDates = windowDates.map((date, index) => ({ date, index }));
  const archiveDates = indexedDates.filter(
    ({ date }) => checkDateFetchability(date).fetchable,
  );
  const forecastDates = indexedDates.filter(({ date }) =>
    isCurrentYearForecastDate(date),
  );

  await fillDates(params, archiveDates, year, dayRecords, 'B', fetchArchive);
  await fillDates(params, forecastDates, year, dayRecords, 'F', fetchForecast);

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
  anchorDate: AnchorDate,
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
