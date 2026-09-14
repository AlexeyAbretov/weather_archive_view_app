import { Alert, Button, Progress, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getDatesForYearWindow } from '../../domain/yearWindowService';
import { DayWeatherCell } from '../archive/shared/DayWeatherCell';
import type { DailyWeather } from '../../domain/dailyWeather';
import type { YearWeatherCacheEntry } from './types';

type WeekRowExpandedProps = {
  year: number;
  anchorDate: string;
  entry: YearWeatherCacheEntry | undefined;
  getWeatherForDay: (year: number, date: string | null) => DailyWeather | null | undefined;
  onRetry: () => void;
};

type DayRow = {
  key: string;
  offset: number;
  date: string | null;
};

export function WeekRowExpanded({
  year,
  anchorDate,
  entry,
  getWeatherForDay,
  onRetry,
}: WeekRowExpandedProps) {
  if (!entry || entry.status === 'idle') {
    return <Spin tip="Загрузка…" />;
  }

  if (entry.status === 'loading') {
    const loaded = entry.days.size;
    return (
      <div>
        <Progress percent={Math.round((loaded / 15) * 100)} size="small" format={() => `${loaded}/15`} />
        <Spin tip="Загрузка данных за год…" style={{ display: 'block', marginTop: 8 }} />
      </div>
    );
  }

  if (entry.status === 'error') {
    return (
      <Alert
        type="error"
        message={entry.error ?? 'Ошибка загрузки'}
        action={
          <Button size="small" onClick={onRetry}>
            Повторить
          </Button>
        }
      />
    );
  }

  const dateSlots = getDatesForYearWindow(anchorDate, year);

  const columns: ColumnsType<DayRow> = dateSlots.map(({ offset, date }) => ({
    title: (
      <div>
        <div>{offset === 0 ? 'D' : offset > 0 ? `D+${offset}` : `D${offset}`}</div>
        <div style={{ fontSize: 11, fontWeight: 400 }}>
          {date ? dayjs(date).format('DD.MM') : '—'}
        </div>
      </div>
    ),
    dataIndex: String(offset),
    key: String(offset),
    width: 96,
    align: 'center',
    render: () => {
      if (!date) {
        return (
          <DayWeatherCell
            weather={null}
            unavailableReason={
              anchorDate.endsWith('-02-29')
                ? '29 февраля отсутствует в этом году'
                : 'Дата недоступна'
            }
          />
        );
      }

      const weather = getWeatherForDay(year, date);
      return <DayWeatherCell weather={weather ?? null} />;
    },
  }));

  const dataSource: DayRow[] = [{ key: 'week', offset: 0, date: anchorDate }];

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table<DayRow>
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
        size="small"
      />
    </div>
  );
}
