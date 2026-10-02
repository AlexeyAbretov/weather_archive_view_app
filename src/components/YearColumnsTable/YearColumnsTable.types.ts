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

export type YearColumnsChartProps = {
  anchorYear?: number;
  rows: YearWeatherRow[];
};

export type StepChartBand = {
  top: number;
  height: number;
  fill: string;
  stroke: string;
};

export type StepChartLabel = {
  text: string;
  top: number;
};

export type StepChartSegment = {
  year: number;
  isAnchor: boolean;
  tooltip: string;
  emptyLabel?: string;
  labels: StepChartLabel[];
  band?: StepChartBand;
};

export type StepChartModel = {
  height: number;
  segments: StepChartSegment[];
};

export type StepChartProps = {
  chart: StepChartModel;
};
