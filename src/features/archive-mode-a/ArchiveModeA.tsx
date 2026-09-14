import { Progress, Typography } from 'antd';
import { DayWeatherCell } from '../archive/shared/DayWeatherCell';
import { WeatherTableSkeleton } from '../archive/shared/WeatherTableSkeleton';
import { useModeAData } from './hooks/useModeAData';

const { Text } = Typography;

type ArchiveModeAProps = {
  latitude: number;
  longitude: number;
  timezone: string;
  anchorDate: string;
};

export function ArchiveModeA({ latitude, longitude, timezone, anchorDate }: ArchiveModeAProps) {
  const { columns, loadedCount, totalCount } = useModeAData({
    latitude,
    longitude,
    timezone,
    anchorDate,
  });

  if (columns.length === 0) {
    return <WeatherTableSkeleton columns={7} />;
  }

  const isLoading = loadedCount < totalCount;

  return (
    <div>
      {isLoading && (
        <Progress
          percent={Math.round((loadedCount / totalCount) * 100)}
          size="small"
          format={() => `Загружено ${loadedCount} из ${totalCount}`}
          style={{ marginBottom: 8 }}
        />
      )}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 0, minWidth: 'max-content' }}>
          {columns.map((col) => (
            <div
              key={col.year}
              style={{
                minWidth: 96,
                border: '1px solid #f0f0f0',
                padding: 8,
                textAlign: 'center',
                position: 'sticky' as const,
                top: 0,
              }}
            >
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                {col.year}
              </Text>
              {col.status === 'loading' || col.status === 'idle' ? (
                <WeatherTableSkeleton columns={1} />
              ) : col.status === 'unavailable' ? (
                <DayWeatherCell weather={null} unavailableReason="Дата недоступна в архиве" />
              ) : col.status === 'error' ? (
                <DayWeatherCell weather={null} unavailableReason="Не удалось загрузить" />
              ) : (
                <DayWeatherCell weather={col.weather} />
              )}
            </div>
          ))}
        </div>
      </div>
      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
        Режим A: один день по годам. Прокрутите таблицу горизонтально на узком экране.
      </Text>
    </div>
  );
}
