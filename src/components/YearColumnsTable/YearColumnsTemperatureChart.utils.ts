import type { WeatherDayRecord, YearWeatherRow } from '@domain';
import { formatTemperature, getNoDataLabel } from '@utils';

import type {
  ChartColumn,
  TemperatureColorScale,
} from './YearColumnsTable.types';

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type TemperatureSample = {
  tempMin: number;
  tempMax: number;
};

export type TemperatureBand = {
  top: number;
  height: number;
  fill: string;
  stroke: string;
  fillTop?: string;
  fillBottom?: string;
  strokeTop?: string;
  strokeBottom?: string;
};

export type TemperatureChartSegment = {
  key: string;
  isAnchor: boolean;
  tooltip: string;
  emptyLabel?: string;
  labelMax?: string;
  labelMin?: string;
  labelMaxTop?: number;
  labelMinTop?: number;
  band?: TemperatureBand;
};

export type TemperatureChartModel = {
  height: number;
  segments: TemperatureChartSegment[];
};

const FILL_NEUTRAL: Rgb = { r: 198, g: 242, b: 168 };
const FILL_COLD: Rgb = { r: 186, g: 224, b: 255 };
const FILL_WARM: Rgb = { r: 255, g: 204, b: 199 };

const STROKE_NEUTRAL: Rgb = { r: 126, g: 217, b: 87 };
const STROKE_COLD: Rgb = { r: 22, g: 119, b: 255 };
const STROKE_WARM: Rgb = { r: 207, g: 19, b: 34 };

const ANOMALY_FULL_SCALE_C = 4;
const LEVEL_FULL_SPAN_C = 16;
const CHART_HEIGHT = 90;
const PLOT_TOP = 16;
const PLOT_BOTTOM = 72;
const MIN_BAND_PX = 3;
const LABEL_ABOVE = 14;
const LABEL_BELOW = 2;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const mixChannel = (from: number, to: number, amount: number): number => {
  return Math.round(from + (to - from) * amount);
};

const mix = (from: Rgb, to: Rgb, amount: number): Rgb => {
  return {
    r: mixChannel(from.r, to.r, amount),
    g: mixChannel(from.g, to.g, amount),
    b: mixChannel(from.b, to.b, amount),
  };
};

const rgbCss = (color: Rgb): string => {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
};

const bandColorsFromAmount = (
  amount: number,
): Pick<TemperatureBand, 'fill' | 'stroke'> => {
  const clamped = clamp(amount, -1, 1);

  if (clamped < 0) {
    const coldAmount = -clamped;

    return {
      fill: rgbCss(mix(FILL_NEUTRAL, FILL_COLD, coldAmount)),
      stroke: rgbCss(mix(STROKE_NEUTRAL, STROKE_COLD, coldAmount)),
    };
  }

  return {
    fill: rgbCss(mix(FILL_NEUTRAL, FILL_WARM, clamped)),
    stroke: rgbCss(mix(STROKE_NEUTRAL, STROKE_WARM, clamped)),
  };
};

const bandColors = (
  deviation: number,
): Pick<TemperatureBand, 'fill' | 'stroke'> => {
  return bandColorsFromAmount(deviation / ANOMALY_FULL_SCALE_C);
};

const colorAtTemperature = (
  temp: number,
  tMin: number,
  tMax: number,
): Pick<TemperatureBand, 'fill' | 'stroke'> => {
  const halfSpan = Math.max(tMax - tMin, LEVEL_FULL_SPAN_C) / 2;
  const mid = (tMin + tMax) / 2;

  return bandColorsFromAmount((temp - mid) / halfSpan);
};

const levelBandColors = (
  sample: TemperatureSample,
  tMin: number,
  tMax: number,
): Pick<
  TemperatureBand,
  'fill' | 'stroke' | 'fillTop' | 'fillBottom' | 'strokeTop' | 'strokeBottom'
> => {
  const atMax = colorAtTemperature(sample.tempMax, tMin, tMax);
  const atMin = colorAtTemperature(sample.tempMin, tMin, tMax);

  return {
    fill: atMax.fill,
    stroke: atMax.stroke,
    fillTop: atMax.fill,
    fillBottom: atMin.fill,
    strokeTop: atMax.stroke,
    strokeBottom: atMin.stroke,
  };
};

const formatDeviation = (value: number): string => {
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? '+' : '';

  return `${sign}${rounded.toFixed(1)}°`;
};

const readSample = (day: WeatherDayRecord): TemperatureSample | undefined => {
  const { hasData, tempMin, tempMax } = day;

  if (!hasData || tempMin == null || tempMax == null) {
    return undefined;
  }

  return { tempMin, tempMax };
};

const collectSamples = (columns: ChartColumn[]): TemperatureSample[] => {
  const samples: TemperatureSample[] = [];

  for (const column of columns) {
    const sample = readSample(column.day);

    if (sample) {
      samples.push(sample);
    }
  }

  return samples;
};

const midpoint = (sample: TemperatureSample): number => {
  return (sample.tempMin + sample.tempMax) / 2;
};

const emptySegment = (column: ChartColumn): TemperatureChartSegment => {
  const emptyLabel = getNoDataLabel(column.day.noDataReason);

  return {
    key: column.key,
    isAnchor: column.isAnchor,
    tooltip: `${column.label}: ${emptyLabel}`,
    emptyLabel,
  };
};

const yOf = (temp: number, tMin: number, span: number): number => {
  if (span === 0) {
    return (PLOT_TOP + PLOT_BOTTOM) / 2;
  }

  const ratio = (temp - tMin) / span;

  return PLOT_BOTTOM - ratio * (PLOT_BOTTOM - PLOT_TOP);
};

const bandGeometry = (
  sample: TemperatureSample,
  tMin: number,
  span: number,
): Pick<TemperatureBand, 'top' | 'height'> => {
  const yMax = yOf(sample.tempMax, tMin, span);
  const yMin = yOf(sample.tempMin, tMin, span);
  let top = Math.min(yMax, yMin);
  let height = Math.max(yMax, yMin) - top;

  if (height < MIN_BAND_PX) {
    top -= (MIN_BAND_PX - height) / 2;
    height = MIN_BAND_PX;
  }

  return {
    top: Math.round(top),
    height: Math.round(height),
  };
};

const dataSegment = (
  column: ChartColumn,
  sample: TemperatureSample,
  baseline: number,
  tMin: number,
  span: number,
  colorScale: TemperatureColorScale,
): TemperatureChartSegment => {
  const deviation = midpoint(sample) - baseline;
  const geometry = bandGeometry(sample, tMin, span);
  const labelMax = formatTemperature(sample.tempMax);
  const labelMin = formatTemperature(sample.tempMin);
  const deviationLabel = formatDeviation(deviation);
  const colors =
    colorScale === 'level'
      ? levelBandColors(sample, tMin, tMin + span)
      : bandColors(deviation);
  const rangeLabel = `${column.label}: ${labelMax} / ${labelMin}`;
  const tooltip =
    colorScale === 'level'
      ? rangeLabel
      : `${rangeLabel}, отклонение ${deviationLabel}`;

  return {
    key: column.key,
    isAnchor: column.isAnchor,
    tooltip,
    labelMax,
    labelMin,
    labelMaxTop: geometry.top - LABEL_ABOVE,
    labelMinTop: geometry.top + geometry.height + LABEL_BELOW,
    band: {
      ...geometry,
      ...colors,
    },
  };
};

export const yearRowsToChartColumns = (
  rows: YearWeatherRow[],
  anchorYear?: number,
): ChartColumn[] => {
  return rows.map((row) => ({
    key: String(row.year),
    label: String(row.year),
    isAnchor: row.year === anchorYear,
    day: row.day,
  }));
};

export const buildTemperatureChartFromColumns = (
  columns: ChartColumn[],
  colorScale: TemperatureColorScale = 'anomaly',
): TemperatureChartModel => {
  const samples = collectSamples(columns);

  if (samples.length === 0) {
    return {
      height: CHART_HEIGHT,
      segments: columns.map((column) => emptySegment(column)),
    };
  }

  const baseline =
    samples.reduce((sum, sample) => sum + midpoint(sample), 0) / samples.length;
  const temperatures = samples.flatMap((sample) => [
    sample.tempMin,
    sample.tempMax,
  ]);
  const tMin = Math.min(...temperatures);
  const span = Math.max(...temperatures) - tMin;

  return {
    height: CHART_HEIGHT,
    segments: columns.map((column) => {
      const sample = readSample(column.day);

      if (!sample) {
        return emptySegment(column);
      }

      return dataSegment(column, sample, baseline, tMin, span, colorScale);
    }),
  };
};

export const buildTemperatureChart = (
  rows: YearWeatherRow[],
  anchorYear?: number,
): TemperatureChartModel => {
  return buildTemperatureChartFromColumns(
    yearRowsToChartColumns(rows, anchorYear),
  );
};
