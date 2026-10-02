import type { YearWeatherWindow } from '@domain';
import type { SelectedLocation } from '@types';

export type ModeBViewProps = {
  errorYears: ReadonlyMap<number, Error>;
  expandedYears: number[];
  isYearExpandable: (year: number) => boolean;
  loadingYears: ReadonlySet<number>;
  location: SelectedLocation | null;
  onExpandYear: (year: number) => void;
  onExpandedYearsChange: (years: number[]) => void;
  onRetryYear: (year: number) => void;
  windowsByYear: ReadonlyMap<number, YearWeatherWindow>;
  years: number[];
};
