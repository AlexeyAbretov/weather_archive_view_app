import { buildPrecipitationChart } from './YearColumnsPrecipitationChart.utils';
import { YearColumnsStepChart } from './YearColumnsStepChart';
import type { YearColumnsChartProps } from './YearColumnsTable.types';

export { buildPrecipitationChart };

export const YearColumnsPrecipitationChart = ({
  anchorYear,
  rows,
}: YearColumnsChartProps) => {
  return (
    <YearColumnsStepChart chart={buildPrecipitationChart(rows, anchorYear)} />
  );
};
