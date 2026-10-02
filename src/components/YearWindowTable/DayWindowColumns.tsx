import type { ColumnsType } from 'antd/es/table';

import type { WeatherDayRecord } from '@domain';

import type { DayWindowRow } from './YearWindowTable.types';

import { DayWeatherCell } from '../DayWeatherCell';

const formatDayColumnTitle = (record: WeatherDayRecord): string => {
  const [, month, day] = record.date.split('-');

  return `${day}.${month}`;
};

export const buildDayWindowColumns = (
  days: WeatherDayRecord[],
): ColumnsType<DayWindowRow> => {
  return days.map((day) => ({
    title: formatDayColumnTitle(day),
    key: day.date,
    width: 100,
    align: 'center' as const,
    render: () => <DayWeatherCell record={day} />,
  }));
};
