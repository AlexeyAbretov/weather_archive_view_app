import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { DayWeatherCell } from '../../../components/weather/DayWeatherCell.tsx';
import { MODE_B_OFFSET_DAYS } from '../../../domain/weather/anchorDates.ts';
// eslint-disable-next-line @stylistic/max-len -- путь domain-модуля
import type { WeatherDayRecord } from '../../../domain/weather/weatherDayRecord.ts';

function formatDayOffsetLabel(offset: number): string {
  if (offset === 0) {
    return 'D';
  }

  if (offset > 0) {
    return `D+${offset}`;
  }

  return `D${offset}`;
}

function formatDayColumnTitle(record: WeatherDayRecord, index: number): string {
  const offset = index - MODE_B_OFFSET_DAYS;

  const dateLabel = dayjs(record.date).format('DD.MM');

  return `${formatDayOffsetLabel(offset)}\n${dateLabel}`;
}

type DayWindowRow = {
  key: string;
};

export function buildDayWindowColumns(
  days: WeatherDayRecord[],
): ColumnsType<DayWindowRow> {
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
}
