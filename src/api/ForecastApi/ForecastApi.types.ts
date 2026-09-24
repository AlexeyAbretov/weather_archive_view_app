import type {
  OpenMeteoDailyVariables,
  OpenMeteoHourlyVariables,
} from '../ArchiveApi';

export type OpenMeteoForecastResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: OpenMeteoDailyVariables;
  hourly: OpenMeteoHourlyVariables;
};

export type OpenMeteoForecastError = {
  reason?: string;
  error?: boolean;
};

export type ForecastRequestParams = {
  lat: number;
  lon: number;
  startDate: string;
  endDate: string;
  signal?: AbortSignal;
};
