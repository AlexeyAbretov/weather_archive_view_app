import type { ColumnsType } from 'antd/es/table';

import type { WeatherDayRecord } from '@domain';
import { MODE_B_OFFSET_DAYS } from '@domain';

import styles from './YearWindowTable.module.css';
import type { DayMetricKey, DayWindowRow } from './YearWindowTable.types';

import { WeatherIcon } from '../WeatherIcon';
import { WindCell } from '../WindCell';
import type { ChartColumn } from '../YearColumnsTable';
import {
  PrecipitationStepChart,
  TemperatureStepChart,
} from '../YearColumnsTable';

export const DAY_METRIC_ROWS: DayWindowRow[] = [
  { key: 'temperature' },
  { key: 'precipitation' },
  { key: 'wind' },
  { key: 'weather' },
];

const CHART_METRICS: DayMetricKey[] = ['temperature', 'precipitation'];

const formatDayColumnTitle = (record: WeatherDayRecord): string => {
  const [, month, day] = record.date.split('-');

  return `${day}.${month}`;
};

const toChartColumns = (days: WeatherDayRecord[]): ChartColumn[] => {
  return days.map((day, index) => ({
    key: day.date,
    label: formatDayColumnTitle(day),
    isAnchor: index === MODE_B_OFFSET_DAYS,
    day,
  }));
};

const renderMetricCell = (
  metric: Exclude<DayMetricKey, 'temperature' | 'precipitation'>,
  record: WeatherDayRecord,
) => {
  switch (metric) {
    case 'wind':
      return <WindCell record={record} />;
    case 'weather':
      return <WeatherIcon record={record} />;
  }
};

export const buildDayWindowColumns = (
  days: WeatherDayRecord[],
): ColumnsType<DayWindowRow> => {
  const chartColumns = toChartColumns(days);

  return days.map((day, columnIndex) => {
    const isAnchor = columnIndex === MODE_B_OFFSET_DAYS;

    return {
      title: formatDayColumnTitle(day),
      key: day.date,
      width: 84,
      align: 'center' as const,
      className: isAnchor ? styles.anchorColumn : undefined,
      onHeaderCell: () => {
        if (!isAnchor) {
          return {};
        }

        return { title: 'День выбранной даты' };
      },
      onCell: (metric) => {
        if (!CHART_METRICS.includes(metric.key)) {
          return {};
        }

        if (columnIndex === 0) {
          return { colSpan: days.length, className: styles.chartCell };
        }

        return { colSpan: 0 };
      },
      render: (_value, metric) => {
        if (CHART_METRICS.includes(metric.key) && columnIndex > 0) {
          return null;
        }

        if (metric.key === 'temperature') {
          return <TemperatureStepChart columns={chartColumns} />;
        }

        if (metric.key === 'precipitation') {
          return <PrecipitationStepChart columns={chartColumns} />;
        }

        return renderMetricCell(metric.key, day);
      },
    };
  });
};
