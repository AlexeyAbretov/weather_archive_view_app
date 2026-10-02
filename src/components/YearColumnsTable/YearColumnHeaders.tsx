import type { ColumnsType } from 'antd/es/table';

import type { WeatherDayRecord, YearWeatherRow } from '@domain';

import styles from './YearColumnsTable.module.css';
import type { YearColumnsRow, YearMetricKey } from './YearColumnsTable.types';

import { PrecipitationCell } from '../PrecipitationCell';
import { TemperatureCell } from '../TemperatureCell';
import { WeatherIcon } from '../WeatherIcon';
import { WindCell } from '../WindCell';

export const YEAR_METRIC_ROWS: YearColumnsRow[] = [
  { key: 'temperature' },
  { key: 'precipitation' },
  { key: 'wind' },
  { key: 'weather' },
];

const renderMetricCell = (metric: YearMetricKey, record: WeatherDayRecord) => {
  switch (metric) {
    case 'temperature':
      return <TemperatureCell record={record} />;
    case 'precipitation':
      return <PrecipitationCell record={record} />;
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
  return data.map((row) => {
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
      render: (_value, metric) => {
        return renderMetricCell(metric.key, row.day);
      },
    };
  });
};
