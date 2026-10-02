import type { NoDataReason, WeatherDayRecord } from '../src/domain';

export const anchorDate = {
  year: 2020,
  month: 9,
  day: 15,
};

export const location = {
  name: 'Москва',
  label: 'Москва, Москва, Россия',
  lat: 55.752,
  lon: 37.6178,
};

export const weatherDay = (
  overrides: Partial<WeatherDayRecord> = {},
): WeatherDayRecord => {
  return {
    date: '2020-09-15',
    year: 2020,
    hasData: true,
    tempMin: -1.2,
    tempMax: 16.6,
    precipitationMm: 1.2,
    precipitationType: 'rain',
    windSpeedMax: 16.4,
    windDirection: 180,
    cloudCover: 40,
    weatherCode: 61,
    iconKey: 'rain',
    ...overrides,
  };
};

export const noDataDay = (
  reason: NoDataReason = 'missing',
): WeatherDayRecord => {
  return {
    date: '2020-09-15',
    year: 2020,
    hasData: false,
    noDataReason: reason,
  };
};
