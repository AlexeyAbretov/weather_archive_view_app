import { Card, Space } from 'antd';
import { DateSelector } from '../../features/date/components/DateSelector';
import { LocationSelector } from '../../features/location/components/LocationSelector';
import { ModeSwitcher } from '../../features/archive-controls/ModeSwitcher';

export function FilterBar() {
  return (
    <Card size="small" title="Параметры">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <LocationSelector />
        <Space wrap>
          <DateSelector />
          <ModeSwitcher />
        </Space>
      </Space>
    </Card>
  );
}
