import type { YearWeatherRow } from '@domain';
import { formatPrecipitationMm, getNoDataLabel } from '@utils';

import type {
  StepChartModel,
  StepChartSegment,
} from './YearColumnsTable.types';

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

const readSample = (row: YearWeatherRow): PrecipitationSample | undefined => {
  const { hasData, precipitationMm } = row.day;

  if (!hasData || precipitationMm == null) {
    return undefined;
  }

  return { precipitationMm: Math.max(0, precipitationMm) };
};

const collectSamples = (rows: YearWeatherRow[]): PrecipitationSample[] => {
  const samples: PrecipitationSample[] = [];

  for (const row of rows) {
    const sample = readSample(row);

    if (sample) {
      samples.push(sample);
    }
  }

  return samples;
};

const emptySegment = (
  row: YearWeatherRow,
  anchorYear: number | undefined,
): StepChartSegment => {
  const emptyLabel = getNoDataLabel(row.day.noDataReason);

  return {
    year: row.year,
    isAnchor: row.year === anchorYear,
    tooltip: `${row.year}: ${emptyLabel}`,
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
  row: YearWeatherRow,
  sample: PrecipitationSample,
  anchorYear: number | undefined,
  max: number,
): StepChartSegment => {
  const geometry = bandGeometry(sample.precipitationMm, max);
  const label = formatPrecipitationMm(sample.precipitationMm);
  const isZero = sample.precipitationMm === 0;

  return {
    year: row.year,
    isAnchor: row.year === anchorYear,
    tooltip: `${row.year}: ${label}`,
    labels: [{ text: label, top: geometry.top - LABEL_ABOVE }],
    band: {
      ...geometry,
      fill: isZero ? ZERO_LINE : FILL,
      stroke: isZero ? ZERO_LINE : STROKE,
    },
  };
};

export const buildPrecipitationChart = (
  rows: YearWeatherRow[],
  anchorYear?: number,
): StepChartModel => {
  const samples = collectSamples(rows);

  if (samples.length === 0) {
    return {
      height: CHART_HEIGHT,
      segments: rows.map((row) => emptySegment(row, anchorYear)),
    };
  }

  const max = Math.max(...samples.map((sample) => sample.precipitationMm));

  return {
    height: CHART_HEIGHT,
    segments: rows.map((row) => {
      const sample = readSample(row);

      if (!sample) {
        return emptySegment(row, anchorYear);
      }

      return dataSegment(row, sample, anchorYear, max);
    }),
  };
};
