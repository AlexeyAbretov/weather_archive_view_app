import type { YearWeatherRow } from '@domain';

export type YearWeatherTableProps = {
  data: YearWeatherRow[];
  loading?: boolean;
};
