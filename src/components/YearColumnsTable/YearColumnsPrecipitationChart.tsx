import {
  buildPrecipitationChart,
  buildPrecipitationChartFromColumns,
} from './YearColumnsPrecipitationChart.utils';
import { YearColumnsStepChart } from './YearColumnsStepChart';
import type {
  ChartColumnsProps,
  YearColumnsChartProps,
} from './YearColumnsTable.types';
import { yearRowsToChartColumns } from './YearColumnsTemperatureChart.utils';

export { buildPrecipitationChart };

export const PrecipitationStepChart = ({ columns }: ChartColumnsProps) => {
  return (
    <YearColumnsStepChart chart={buildPrecipitationChartFromColumns(columns)} />
  );
};

export const YearColumnsPrecipitationChart = ({
  anchorYear,
  rows,
}: YearColumnsChartProps) => {
  return (
    <PrecipitationStepChart
      columns={yearRowsToChartColumns(rows, anchorYear)}
    />
  );
};
