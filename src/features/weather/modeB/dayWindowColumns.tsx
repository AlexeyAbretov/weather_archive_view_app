import { DayWeatherCell } from '@components/weather/DayWeatherCell.tsx';
import { MODE_B_OFFSET_DAYS } from '@domain/weather/anchorDates.ts';
import type { WeatherDayRecord } from '@domain/weather/weatherDayRecord.ts';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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

  const dateLabel = dayjs(record.date).format('DD.MM');

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
