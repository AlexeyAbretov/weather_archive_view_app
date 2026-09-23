// eslint-disable-next-line @stylistic/max-len -- длинный путь модуля API
import type { OpenMeteoArchiveResponse } from '@api/openMeteo/archiveResponse.types.ts';
import {
  mapWeatherCode,
  resolvePrecipitationType,
} from '@domain/weather/weatherCodeCatalog.ts';
import type { WeatherDayRecord } from '@domain/weather/weatherDayRecord.ts';

const indexByDate = (times: string[]): Map<string, number> => {
  const map = new Map<string, number>();

  times.forEach((time, index) => {
    map.set(time.slice(0, 10), index);
  });

  return map;
};

const pickDailyWeatherCode = (
  hourlyTimes: string[],
  hourlyCodes: (number | null)[],
  date: string,
): number | null => {
  const dayCodes = hourlyTimes
    .map((time, index) => ({ time, code: hourlyCodes[index] }))
    .filter((entry) => entry.time.startsWith(date) && entry.code != null);

  if (dayCodes.length === 0) {
    return null;
  }

  const middayIndex = Math.floor(dayCodes.length / 2);

  return dayCodes[middayIndex]?.code ?? dayCodes[0]?.code ?? null;
};

const averageHourlyCloudCover = (
  hourlyTimes: string[],
  hourlyCloudCover: (number | null)[],
  date: string,
): number | undefined => {
  const values = hourlyTimes
    .map((time, index) => ({ time, value: hourlyCloudCover[index] }))
    .filter((entry) => entry.time.startsWith(date) && entry.value != null)
    .map((entry) => entry.value as number);

  if (values.length === 0) {
    return undefined;
  }

  const sum = values.reduce((acc, value) => acc + value, 0);

  return Math.round(sum / values.length);
};

const hasDailyValues = (
  dailyIndex: number,
  response: OpenMeteoArchiveResponse,
): boolean => {
  const { daily } = response;
  const values = [
    daily.temperature_2m_max[dailyIndex],
    daily.temperature_2m_min[dailyIndex],
    daily.precipitation_sum[dailyIndex],
  ];

  return values.some((value) => value != null);
};

export const normalizeDailyRecord = (
  response: OpenMeteoArchiveResponse,
  date: string,
  year: number,
): WeatherDayRecord => {
  const dailyIndex = indexByDate(response.daily.time).get(date);

  if (dailyIndex == null || !hasDailyValues(dailyIndex, response)) {
    return {
      date,
      year,
      hasData: false,
      noDataReason: 'missing',
    };
  }

  const { daily, hourly } = response;
  const weatherCode = pickDailyWeatherCode(
    hourly.time,
    hourly.weather_code,
    date,
  );
  const codeInfo = mapWeatherCode(weatherCode);
  const rainMm = daily.rain_sum[dailyIndex] ?? undefined;
  const snowfallCm = daily.snowfall_sum[dailyIndex] ?? undefined;

  return {
    date,
    year,
    hasData: true,
    tempMin: daily.temperature_2m_min[dailyIndex] ?? undefined,
    tempMax: daily.temperature_2m_max[dailyIndex] ?? undefined,
    precipitationMm: daily.precipitation_sum[dailyIndex] ?? undefined,
    rainMm,
    snowfallCm,
    windSpeedMax: daily.wind_speed_10m_max[dailyIndex] ?? undefined,
    windDirection: daily.wind_direction_10m_dominant[dailyIndex] ?? undefined,
    cloudCover: averageHourlyCloudCover(hourly.time, hourly.cloud_cover, date),
    weatherCode: weatherCode ?? undefined,
    iconKey: codeInfo.iconKey,
    precipitationType: resolvePrecipitationType({
      rainMm,
      snowfallCm,
      weatherCode,
    }),
  };
};

export const normalizeDailyRecords = (
  response: OpenMeteoArchiveResponse,
  dates: { date: string; year: number }[],
): WeatherDayRecord[] => {
  return dates.map(({ date, year }) =>
    normalizeDailyRecord(response, date, year),
  );
};
