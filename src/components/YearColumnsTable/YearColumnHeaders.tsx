import type { ColumnsType } from 'antd/es/table';

import type { WeatherDayRecord, YearWeatherRow } from '@domain';

import { YearColumnsPrecipitationChart } from './YearColumnsPrecipitationChart';
import styles from './YearColumnsTable.module.css';
import type { YearColumnsRow, YearMetricKey } from './YearColumnsTable.types';
import { YearColumnsTemperatureChart } from './YearColumnsTemperatureChart';

import { WeatherIcon } from '../WeatherIcon';
import { WindCell } from '../WindCell';

export const YEAR_METRIC_ROWS: YearColumnsRow[] = [
  { key: 'temperature' },
  { key: 'precipitation' },
  { key: 'wind' },
  { key: 'weather' },
];

const CHART_METRICS: YearMetricKey[] = ['temperature', 'precipitation'];

const renderMetricCell = (
  metric: Exclude<YearMetricKey, 'temperature' | 'precipitation'>,
  record: WeatherDayRecord,
) => {
  switch (metric) {
    case 'wind':
      return <WindCell record={record} />;
    case 'weather':
      return <WeatherIcon record={record} />;
  }
};

export const buildYearColumnHeaders = (
  data: YearWeatherRow[],
  anchorYear?: number,
): ColumnsType<YearColumnsRow> => {
  return data.map((row, columnIndex) => {
    const isAnchor = row.year === anchorYear;

    return {
      title: row.year,
      key: String(row.year),
      width: 84,
      align: 'center',
      className: isAnchor ? styles.anchorColumn : undefined,
      onHeaderCell: () => {
        if (!isAnchor) {
          return {};
        }

        return { title: 'Год выбранной даты' };
      },
      onCell: (metric) => {
        if (!CHART_METRICS.includes(metric.key)) {
          return {};
        }

        if (columnIndex === 0) {
          return { colSpan: data.length, className: styles.chartCell };
        }

        return { colSpan: 0 };
      },
      render: (_value, metric) => {
        if (CHART_METRICS.includes(metric.key) && columnIndex > 0) {
          return null;
        }

        if (metric.key === 'temperature') {
          return (
            <YearColumnsTemperatureChart anchorYear={anchorYear} rows={data} />
          );
        }

        if (metric.key === 'precipitation') {
          return (
            <YearColumnsPrecipitationChart
              anchorYear={anchorYear}
              rows={data}
            />
          );
        }

        return renderMetricCell(metric.key, row.day);
      },
    };
  });
};
