export type { DateFetchability } from './weather/anchorDates';
export {
  ARCHIVE_LAG_DAYS,
  checkDateFetchability,
  formatIsoDate,
  MODE_B_OFFSET_DAYS,
  MODE_B_WINDOW_DAYS,
  resolveModeBWindow,
  resolveTargetDate,
} from './weather/anchorDates';
export type { WeatherCodeInfo } from './weather/weatherCodeCatalog';
export {
  mapWeatherCode,
  resolvePrecipitationType,
} from './weather/weatherCodeCatalog';
export type {
  NoDataReason,
  PrecipitationType,
  WeatherDayRecord,
  YearWeatherRow,
  YearWeatherWindow,
} from './weather/weatherDayRecord';
export { createNoDataRecord } from './weather/weatherDayRecord';
export {
  ARCHIVE_MIN_YEAR,
  buildYearRange,
  isYearBeforeArchive,
} from './weather/yearRange';
