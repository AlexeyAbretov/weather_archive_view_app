import { YearColumnsStepChart } from './YearColumnsStepChart';
import type {
  ChartColumnsProps,
  StepChartLabel,
  StepChartModel,
  YearColumnsChartProps,
} from './YearColumnsTable.types';
import {
  buildTemperatureChartFromColumns,
  type TemperatureChartModel,
  yearRowsToChartColumns,
} from './YearColumnsTemperatureChart.utils';

const toStepChart = (chart: TemperatureChartModel): StepChartModel => {
  return {
    height: chart.height,
    segments: chart.segments.map((segment) => {
      const labels: StepChartLabel[] = [];

      if (segment.labelMax != null && segment.labelMaxTop != null) {
        labels.push({
          text: segment.labelMax,
          top: segment.labelMaxTop,
        });
      }

      if (segment.labelMin != null && segment.labelMinTop != null) {
        labels.push({
          text: segment.labelMin,
          top: segment.labelMinTop,
        });
      }

      return {
        key: segment.key,
        isAnchor: segment.isAnchor,
        tooltip: segment.tooltip,
        emptyLabel: segment.emptyLabel,
        labels,
        band: segment.band,
      };
    }),
  };
};

export const TemperatureStepChart = ({ columns }: ChartColumnsProps) => {
  return (
    <YearColumnsStepChart
      chart={toStepChart(buildTemperatureChartFromColumns(columns))}
    />
  );
};

export const YearColumnsTemperatureChart = ({
  anchorYear,
  rows,
}: YearColumnsChartProps) => {
  return (
    <TemperatureStepChart columns={yearRowsToChartColumns(rows, anchorYear)} />
  );
};
