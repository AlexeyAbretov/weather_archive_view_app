import type { WeatherDayRecord, YearWeatherRow } from '@domain';
import { formatPrecipitationMm, getNoDataLabel } from '@utils';

import type {
  ChartColumn,
  StepChartModel,
  StepChartSegment,
} from './YearColumnsTable.types';
import { yearRowsToChartColumns } from './YearColumnsTemperatureChart.utils';

const FILL = 'rgb(105, 192, 255)';
const STROKE = 'rgb(9, 109, 217)';
const ZERO_LINE = 'rgb(140, 140, 140)';

const CHART_HEIGHT = 64;
const PLOT_TOP = 16;
const PLOT_BOTTOM = 60;
const LABEL_ABOVE = 14;

type PrecipitationSample = {
  precipitationMm: number;
};

const readSample = (day: WeatherDayRecord): PrecipitationSample | undefined => {
  const { hasData, precipitationMm } = day;

  if (!hasData || precipitationMm == null) {
    return undefined;
  }

  return { precipitationMm: Math.max(0, precipitationMm) };
};

const collectSamples = (columns: ChartColumn[]): PrecipitationSample[] => {
  const samples: PrecipitationSample[] = [];

  for (const column of columns) {
    const sample = readSample(column.day);

    if (sample) {
      samples.push(sample);
    }
  }

  return samples;
};

const emptySegment = (column: ChartColumn): StepChartSegment => {
  const emptyLabel = getNoDataLabel(column.day.noDataReason);

  return {
    key: column.key,
    isAnchor: column.isAnchor,
    tooltip: `${column.label}: ${emptyLabel}`,
    emptyLabel,
    labels: [],
  };
};

const yOf = (value: number, max: number): number => {
  if (max === 0) {
    return PLOT_BOTTOM;
  }

  return PLOT_BOTTOM - (value / max) * (PLOT_BOTTOM - PLOT_TOP);
};

const bandGeometry = (
  value: number,
  max: number,
): { top: number; height: number } => {
  const yTop = yOf(value, max);
  const top = Math.round(Math.min(yTop, PLOT_BOTTOM));
  const height = PLOT_BOTTOM - top;

  if (value > 0 && height < 1) {
    return { top: PLOT_BOTTOM - 1, height: 1 };
  }

  return { top, height };
};

const dataSegment = (
  column: ChartColumn,
  sample: PrecipitationSample,
  max: number,
): StepChartSegment => {
  const geometry = bandGeometry(sample.precipitationMm, max);
  const label = formatPrecipitationMm(sample.precipitationMm);
  const isZero = sample.precipitationMm === 0;

  return {
    key: column.key,
    isAnchor: column.isAnchor,
    tooltip: `${column.label}: ${label}`,
    labels: [{ text: label, top: geometry.top - LABEL_ABOVE }],
    band: {
      ...geometry,
      fill: isZero ? ZERO_LINE : FILL,
      stroke: isZero ? ZERO_LINE : STROKE,
    },
  };
};

export const buildPrecipitationChartFromColumns = (
  columns: ChartColumn[],
): StepChartModel => {
  const samples = collectSamples(columns);

  if (samples.length === 0) {
    return {
      height: CHART_HEIGHT,
      segments: columns.map((column) => emptySegment(column)),
    };
  }

  const max = Math.max(...samples.map((sample) => sample.precipitationMm));

  return {
    height: CHART_HEIGHT,
    segments: columns.map((column) => {
      const sample = readSample(column.day);

      if (!sample) {
        return emptySegment(column);
      }

      return dataSegment(column, sample, max);
    }),
  };
};

export const buildPrecipitationChart = (
  rows: YearWeatherRow[],
  anchorYear?: number,
): StepChartModel => {
  return buildPrecipitationChartFromColumns(
    yearRowsToChartColumns(rows, anchorYear),
  );
};
