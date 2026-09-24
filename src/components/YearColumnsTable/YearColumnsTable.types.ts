import type { YearWeatherRow } from '@domain';

export type YearColumnsTableProps = {
  anchorYear?: number;
  data: YearWeatherRow[];
  loading?: boolean;
};

export type YearMetricKey =
  'temperature' | 'precipitation' | 'wind' | 'weather';

export type YearColumnsRow = {
  key: YearMetricKey;
};
