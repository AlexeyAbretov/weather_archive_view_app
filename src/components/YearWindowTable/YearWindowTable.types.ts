import type { WeatherDayRecord, YearWeatherWindow } from '@domain';

import type { DayWindowScrollSync } from './DayWindowScrollSync';

export type YearRow = {
  year: number;
  expandable: boolean;
};

export type YearWindowTableProps = {
  anchorYear: number;
  years: number[];
  windowsByYear: ReadonlyMap<number, YearWeatherWindow>;
  loadingYears: ReadonlySet<number>;
  errorYears: ReadonlyMap<number, Error>;
  expandedYears: number[];
  onExpandedYearsChange: (years: number[]) => void;
  onExpandYear: (year: number) => void;
  onRetryYear: (year: number) => void;
  isYearExpandable: (year: number) => boolean;
};

export type DayMetricKey = 'temperature' | 'precipitation' | 'wind' | 'weather';

export type DayWindowRow = {
  key: DayMetricKey;
};

export type DayWindowTableProps = {
  days: WeatherDayRecord[];
  scrollSync: DayWindowScrollSync;
};
