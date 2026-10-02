import type { YearWeatherRow } from '@domain';

export type YearWeatherTableProps = {
  anchorYear?: number;
  data: YearWeatherRow[];
  loading?: boolean;
};
