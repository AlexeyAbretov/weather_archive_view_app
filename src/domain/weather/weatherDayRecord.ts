export type PrecipitationType =
  | 'none'
  | 'rain'
  | 'snow'
  | 'mixed'
  | 'drizzle'
  | 'freezing_rain'
  | 'thunderstorm'
  | 'hail';

export type NoDataReason =
  'future' | 'feb29' | 'archive_lag' | 'api_error' | 'missing';

/** Нормализованная суточная запись для режимов A и B. */
export type WeatherDayRecord = {
  date: string;
  year: number;
  hasData: boolean;
  tempMin?: number;
  tempMax?: number;
  precipitationMm?: number;
  precipitationType?: PrecipitationType;
  rainMm?: number;
  snowfallCm?: number;
  windSpeedMax?: number;
  windDirection?: number;
  cloudCover?: number;
  weatherCode?: number;
  iconKey?: string;
  noDataReason?: NoDataReason;
};

export type YearWeatherRow = {
  year: number;
  day: WeatherDayRecord;
};

export type YearWeatherWindow = {
  year: number;
  days: WeatherDayRecord[];
};

export function createNoDataRecord(
  date: string,
  year: number,
  reason: NoDataReason,
): WeatherDayRecord {
  return {
    date,
    year,
    hasData: false,
    noDataReason: reason,
  };
}
