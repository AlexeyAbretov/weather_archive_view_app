import { Empty, Space, Typography } from 'antd';
import { FilterBar } from '../app/components/FilterBar';
import { useAppFilters } from '../app/context/AppFiltersContext';
import { ArchiveModeA } from '../features/archive-mode-a';
import { ArchiveModeB } from '../features/archive-mode-b';

const { Title } = Typography;

export function HomePage() {
  const { location, date, mode, hasLocation } = useAppFilters();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3} style={{ marginBottom: 0 }}>
        Архив погоды
      </Title>
      <FilterBar />
      {!hasLocation || !location ? (
        <Empty description="Выберите город и дату для просмотра архива" />
      ) : mode === 'a' ? (
        <ArchiveModeA
          latitude={location.lat}
          longitude={location.lon}
          timezone={location.timezone}
          anchorDate={date}
        />
      ) : (
        <ArchiveModeB
          latitude={location.lat}
          longitude={location.lon}
          timezone={location.timezone}
          anchorDate={date}
        />
      )}
    </Space>
  );
}
