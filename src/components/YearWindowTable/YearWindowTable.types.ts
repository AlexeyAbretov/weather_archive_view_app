import type { WeatherDayRecord, YearWeatherWindow } from '@domain';

export type YearRow = {
  year: number;
  expandable: boolean;
};

export type YearWindowTableProps = {
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

export type DayWindowRow = {
  key: string;
};

export type DayWindowTableProps = {
  days: WeatherDayRecord[];
};
