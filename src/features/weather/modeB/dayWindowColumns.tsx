import type { ColumnsType } from 'antd/es/table';

import { DayWeatherCell } from '@components';
import { MODE_B_OFFSET_DAYS, type WeatherDayRecord } from '@domain';

const formatDayOffsetLabel = (offset: number): string => {
  if (offset === 0) {
    return 'день';
  }

  const days = Math.abs(offset);

  if (offset > 0) {
    return `${days} дн. после`;
  }

  return `${days} дн. до`;
};

const formatDayColumnTitle = (
  record: WeatherDayRecord,
  index: number,
): string => {
  const offset = index - MODE_B_OFFSET_DAYS;

  const [, month, day] = record.date.split('-');
  const dateLabel = `${day}.${month}`;

  return `${formatDayOffsetLabel(offset)}\n${dateLabel}`;
};

type DayWindowRow = {
  key: string;
};

export const buildDayWindowColumns = (
  days: WeatherDayRecord[],
): ColumnsType<DayWindowRow> => {
  return days.map((day, index) => ({
    title: (
      <span style={{ whiteSpace: 'pre-line' }}>
        {formatDayColumnTitle(day, index)}
      </span>
    ),
    key: day.date,
    width: 100,
    align: 'center' as const,
    render: () => <DayWeatherCell record={day} />,
  }));
};
