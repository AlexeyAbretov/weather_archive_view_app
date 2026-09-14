import type { DailyWeather } from '../../domain/dailyWeather';

export type YearRowData = {
  year: number;
  unavailable: boolean;
};

export type YearWeatherCacheEntry = {
  status: 'idle' | 'loading' | 'success' | 'error';
  days: Map<string, DailyWeather | null>;
  error?: string;
};

export type ArchiveModeBProps = {
  latitude: number;
  longitude: number;
  timezone: string;
  anchorDate: string;
};
